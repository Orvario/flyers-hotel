import { godo, type RateId } from "@content/godo";

export type StayQuery = {
  checkin: string;
  checkout: string;
  adults: number;
  children: number;
};

export type RateQuote = {
  rateId: RateId;
  total: number;
  available: boolean;
  reason?: string;
};

export type RoomQuote = {
  godoRoomId: number;
  unitsLeft: number | null;
  rates: RateQuote[];
  available: boolean;
  reason?: string;
};

export type AvailabilityResponse = {
  query: StayQuery;
  nights: number;
  currency: string;
  fetchedAt: string;
  rooms: RoomQuote[];
};

export type PackageDetails = {
  licensePlate?: string;
  transferTime?: string;
  arrivalDate?: string;
  flightNumber?: string;
  landingTime?: string;
};

const ISO = /^\d{4}-\d{2}-\d{2}$/;

export function toISODate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function parseISODate(s: string) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function nightsBetween(checkin: string, checkout: string) {
  const ms = parseISODate(checkout).getTime() - parseISODate(checkin).getTime();
  return Math.round(ms / 86_400_000);
}

export function validateStay(input: Partial<Record<keyof StayQuery, string | null>>):
  | { ok: true; stay: StayQuery }
  | { ok: false; error: string } {
  const { checkin, checkout } = input;
  const adults = Number(input.adults ?? 2);
  const children = Number(input.children ?? 0);
  if (!checkin || !checkout || !ISO.test(checkin) || !ISO.test(checkout)) {
    return { ok: false, error: "Please choose your check-in and check-out dates." };
  }
  const nights = nightsBetween(checkin, checkout);
  if (nights < 1) return { ok: false, error: "Check-out must be after check-in." };
  if (nights > 30) return { ok: false, error: "For stays longer than 30 nights, please contact us directly." };
  const today = toISODate(new Date());
  if (checkin < today) return { ok: false, error: "Check-in can’t be in the past." };
  if (!Number.isInteger(adults) || adults < 1 || adults > godo.maxGuestsPerRoom) {
    return { ok: false, error: `Rooms sleep 1–${godo.maxGuestsPerRoom} guests.` };
  }
  if (!Number.isInteger(children) || children < 0 || adults + children > godo.maxGuestsPerRoom) {
    return { ok: false, error: `Rooms sleep up to ${godo.maxGuestsPerRoom} guests in total.` };
  }
  return { ok: true, stay: { checkin, checkout, adults, children } };
}

/**
 * Builds the Godo deep link that lands the guest directly on the guest-details
 * and payment step for the selected room and rate. `br{rateId}-{roomId}=Book`
 * is the same field Godo's own "Book" button submits.
 */
export function buildGodoCheckoutUrl(stay: StayQuery, godoRoomId: number, rateId: RateId) {
  const p = new URLSearchParams({
    propid: String(godo.propId),
    checkin: stay.checkin,
    checkout: stay.checkout,
    numadult: String(stay.adults),
    numchild: String(stay.children),
    lang: godo.lang,
    cur: godo.currency,
  });
  p.set(`br${rateId}-${godoRoomId}`, "Book");
  return `${godo.bookingUrl}?${p.toString()}`;
}

export function buildGodoSearchUrl(stay: StayQuery) {
  const p = new URLSearchParams({
    propid: String(godo.propId),
    checkin: stay.checkin,
    checkout: stay.checkout,
    numadult: String(stay.adults),
    numchild: String(stay.children),
    lang: godo.lang,
    cur: godo.currency,
  });
  return `${godo.bookingUrl}?${p.toString()}`;
}

export function formatMoney(amount: number, currency: string = godo.currency) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}
