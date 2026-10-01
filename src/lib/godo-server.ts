import "server-only";
import { godo, ratePlans } from "@content/godo";
import { rooms } from "@content/rooms";
import { nightsBetween, type AvailabilityResponse, type RoomQuote, type StayQuery } from "./booking";

type GodoPriceRow = {
  id: string;
  roomprice: number;
  warn?: string;
  roomid: number;
  offerid: number;
  ratesperday?: Record<string, number | string>;
};

type Beds24Availability = Record<string, { roomId?: string; roomsavail?: number } | unknown>;

// Both upstream calls run in parallel; keep well under the 10 s limit for synchronous serverless functions.
const TIMEOUT_MS = 6000;

async function fetchWithTimeout(url: string, init: RequestInit) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: ctrl.signal, cache: "no-store" });
  } finally {
    clearTimeout(t);
  }
}

/** Same request Godo's own booking page makes to render prices per room and rate. */
async function fetchGodoPrices(stay: StayQuery): Promise<GodoPriceRow[]> {
  const ids = rooms.flatMap((r) => ratePlans.map((rate) => `roomprice-${rate.id}-${r.godoRoomId}`));
  const qs = new URLSearchParams({
    ci: stay.checkin,
    co: stay.checkout,
    na: String(stay.adults),
    nc: String(stay.children),
    pt: "7",
    la: godo.lang,
    cu: godo.currency,
  });
  const res = await fetchWithTimeout(`${godo.priceEndpoint}?${qs}`, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      "x-requested-with": "XMLHttpRequest",
      referer: `${godo.bookingUrl}?propid=${godo.propId}`,
    },
    body: new URLSearchParams({ or: JSON.stringify(ids) }).toString(),
  });
  if (!res.ok) throw new Error(`Godo price endpoint responded ${res.status}`);
  const data = (await res.json()) as GodoPriceRow[];
  if (!Array.isArray(data)) throw new Error("Unexpected Godo price response");
  return data;
}

/** Beds24 public availability call (no credentials) – used only for "rooms left" counts. */
async function fetchUnitsLeft(stay: StayQuery): Promise<Record<number, number>> {
  try {
    const res = await fetchWithTimeout(godo.availabilityEndpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        checkIn: stay.checkin.replaceAll("-", ""),
        checkOut: stay.checkout.replaceAll("-", ""),
        propId: String(godo.propId),
        numAdult: String(stay.adults),
        numChild: String(stay.children),
      }),
    });
    if (!res.ok) return {};
    const data = (await res.json()) as Beds24Availability;
    const out: Record<number, number> = {};
    for (const r of rooms) {
      const row = data[String(r.godoRoomId)] as { roomsavail?: number } | undefined;
      if (row && typeof row.roomsavail === "number") out[r.godoRoomId] = row.roomsavail;
    }
    return out;
  } catch {
    return {};
  }
}

function cleanReason(warn?: string) {
  if (!warn) return undefined;
  if (/occupancy/i.test(warn)) return "Too many guests for this room";
  if (/no price/i.test(warn)) return "Not bookable online for these dates";
  return warn.replace(/<[^>]+>/g, "");
}

export async function getAvailability(stay: StayQuery): Promise<AvailabilityResponse> {
  const [prices, units] = await Promise.all([fetchGodoPrices(stay), fetchUnitsLeft(stay)]);
  const roomQuotes: RoomQuote[] = rooms.map((room) => {
    const rates = ratePlans.map((rate) => {
      const row = prices.find((p) => p.roomid === room.godoRoomId && p.offerid === rate.id);
      const total = row ? Number(row.roomprice) || 0 : 0;
      return {
        rateId: rate.id,
        total,
        available: total > 0 && !row?.warn,
        reason: cleanReason(row?.warn) ?? (total > 0 ? undefined : "Not available"),
      };
    });
    const available = rates.some((r) => r.available);
    const firstReason = rates.find((r) => r.reason)?.reason;
    return {
      godoRoomId: room.godoRoomId,
      unitsLeft: units[room.godoRoomId] ?? null,
      rates,
      available,
      reason: available ? undefined : firstReason,
    };
  });
  return {
    query: stay,
    nights: nightsBetween(stay.checkin, stay.checkout),
    currency: godo.currency,
    fetchedAt: new Date().toISOString(),
    rooms: roomQuotes,
  };
}
