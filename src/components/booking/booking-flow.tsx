"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BedDouble,
  Bath,
  Car,
  Check,
  Lock,
  Maximize2,
  Plane,
  RefreshCw,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { formatMoney, nightsBetween, parseISODate, validateStay, type AvailabilityResponse, type RoomQuote, type StayQuery } from "@/lib/booking";
import { getRatePlan, type RateId } from "@content/godo";
import { getRoom, getRoomByGodoId, type Room } from "@content/rooms";
import { hotel, shuttle, travelPackage } from "@content/hotel";
import { StayPicker } from "./stay-picker";
import { StepIndicator } from "./steps";
import { useAvailability } from "./use-availability";
import { childSeatLabels, useExtras, type Extras } from "./extras-store";

type Step = "dates" | "room" | "extras";
const stepIndex: Record<Step, number> = { dates: 0, room: 1, extras: 2 };

export function BookingFlow() {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const parsed = validateStay({
    checkin: sp.get("checkin"),
    checkout: sp.get("checkout"),
    adults: sp.get("adults"),
    children: sp.get("children"),
  });
  const stay = parsed.ok ? parsed.stay : null;
  const hasDates = sp.get("checkin") || sp.get("checkout");
  const room = getRoom(sp.get("room") ?? "");
  const rateId = Number(sp.get("rate")) as RateId;
  const rate = getRatePlan(rateId);

  const requested = sp.get("step") === "review" ? "extras" : ((sp.get("step") as Step) ?? "room");
  let step: Step = requested;
  if (!stay) step = "dates";
  else if (step === "extras" && (!room || !rate)) step = "room";
  else if (!["dates", "room", "extras"].includes(step)) step = "room";

  const { state, retry } = useAvailability(stay);
  const { extras, update } = useExtras();

  const setParams = (patch: Record<string, string | null>, opts?: { scroll?: boolean }) => {
    const p = new URLSearchParams(sp.toString());
    for (const [k, v] of Object.entries(patch)) {
      if (v === null) p.delete(k);
      else p.set(k, v);
    }
    router.push(`${pathname}?${p.toString()}`, { scroll: opts?.scroll ?? true });
  };

  const quote = state.status === "ready" && room ? state.data.rooms.find((r) => r.godoRoomId === room.godoRoomId) : undefined;
  const rateQuote = quote?.rates.find((r) => r.rateId === rateId);
  const selectionStale = state.status === "ready" && room && rate && !rateQuote?.available;

  return (
    <div className="container-x pt-28 pb-32 lg:pt-32">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="eyebrow text-ember">Book direct · Flyers Hotel</p>
          <h1 className="mt-3 text-4xl text-basalt sm:text-5xl">
            {step === "dates" && "When are you flying?"}
            {step === "room" && "Choose your room"}
            {step === "extras" && "Make the journey easy"}
          </h1>
        </div>
        <StepIndicator current={stepIndex[step]} />
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px] lg:gap-14">
        <div className="min-w-0">
          {step === "dates" && (
            <DatesStep
              error={hasDates && !parsed.ok ? parsed.error : undefined}
              initial={{ checkin: sp.get("checkin") ?? undefined, checkout: sp.get("checkout") ?? undefined, adults: Number(sp.get("adults") ?? 2), children: Number(sp.get("children") ?? 0) }}
              onSubmit={(v) => setParams({ ...Object.fromEntries(Object.entries(v).map(([k, val]) => [k, String(val)])), step: "room" })}
              preselected={room}
            />
          )}

          {step === "room" && stay && (
            <RoomStep
              stay={stay}
              state={state}
              retry={retry}
              selected={room && rate ? { slug: room.slug, rateId: rate.id } : undefined}
              preferred={room?.slug}
              onEditDates={() => setParams({ step: "dates" })}
              onSelect={(slug, id) => setParams({ room: slug, rate: String(id), step: "extras" })}
            />
          )}

          {step === "extras" && stay && room && rate && (
            <ExtrasStep
              rateId={rate.id}
              quote={quote}
              loading={state.status === "loading"}
              extras={extras}
              update={update}
              onSwitchRate={(id) => setParams({ rate: String(id) }, { scroll: false })}
              onBack={() => setParams({ step: "room" })}
              stale={!!selectionStale}
              canContinue={!!rateQuote?.available}
              checkoutHref={`/book/checkout?${new URLSearchParams({
                checkin: stay.checkin,
                checkout: stay.checkout,
                adults: String(stay.adults),
                children: String(stay.children),
                room: room.slug,
                rate: String(rate.id),
              })}`}
            />
          )}

        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-28">
            <Summary stay={stay} room={room} rateId={rate?.id} state={state} extras={extras} />
          </div>
        </aside>
      </div>

      <MobileSummaryBar stay={stay} room={room} rateId={rate?.id} state={state} />
    </div>
  );
}

function DatesStep({ initial, onSubmit, error, preselected }: { initial: { checkin?: string; checkout?: string; adults: number; children: number }; onSubmit: (v: StayQuery) => void; error?: string; preselected?: Room }) {
  return (
    <div className="space-y-8">
      <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
        Pick your dates and we’ll show every room with the exact, live price from our booking system — the same price you’ll pay.
      </p>
      {preselected && (
        <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-3">
          <div className="relative size-16 shrink-0 overflow-hidden rounded-lg">
            <Image src={preselected.images[0]} alt="" fill sizes="64px" className="object-cover" />
          </div>
          <div>
            <p className="eyebrow text-muted-foreground">You’re looking at</p>
            <p className="font-serif text-xl">{preselected.name}</p>
          </div>
        </div>
      )}
      {error && (
        <p role="alert" className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="size-4" /> {error}
        </p>
      )}
      <StayPicker initial={initial} onSubmit={onSubmit} submitLabel="Show rooms & prices" />
      <ul className="grid gap-4 text-sm text-muted-foreground sm:grid-cols-3">
        <li className="flex gap-2"><Plane className="size-4 shrink-0 text-ember" /> 5 minutes from Keflavík Airport</li>
        <li className="flex gap-2"><Check className="size-4 shrink-0 text-ember" /> 24/7 self check-in after 15:00</li>
        <li className="flex gap-2"><Car className="size-4 shrink-0 text-ember" /> Free parking, first come – first served</li>
      </ul>
    </div>
  );
}

function RoomStep({
  stay,
  state,
  retry,
  selected,
  preferred,
  onSelect,
  onEditDates,
}: {
  preferred?: string;
  stay: StayQuery;
  state: ReturnType<typeof useAvailability>["state"];
  retry: () => void;
  selected?: { slug: string; rateId: RateId };
  onSelect: (slug: string, rateId: RateId) => void;
  onEditDates: () => void;
}) {
  const nights = nightsBetween(stay.checkin, stay.checkout);
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card px-5 py-4 text-sm">
        <span>
          <span className="font-medium">{format(parseISODate(stay.checkin), "EEE d MMM")} → {format(parseISODate(stay.checkout), "EEE d MMM yyyy")}</span>
          <span className="text-muted-foreground"> · {nights} night{nights > 1 ? "s" : ""} · {stay.adults + stay.children} guest{stay.adults + stay.children > 1 ? "s" : ""}</span>
        </span>
        <button onClick={onEditDates} className="text-sm font-medium text-ember underline-offset-4 hover:underline">Change</button>
      </div>

      {state.status === "loading" && (
        <div className="space-y-5" aria-busy="true" aria-label="Checking live availability">
          <p className="flex items-center gap-2 text-sm text-muted-foreground"><RefreshCw className="size-3.5 animate-spin" /> Checking live availability and prices…</p>
          {[0, 1, 2].map((i) => (
            <div key={i} className="grid gap-5 rounded-2xl border border-border bg-card p-4 sm:grid-cols-[240px_1fr]">
              <Skeleton className="aspect-[4/3] w-full rounded-xl" />
              <div className="space-y-3 py-2">
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
              </div>
            </div>
          ))}
        </div>
      )}

      {state.status === "error" && (
        <div role="alert" className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8">
          <p className="flex items-center gap-2 font-medium text-destructive"><AlertCircle className="size-4" /> {state.message}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Your selection is safe. Try again, or contact us on <a className="underline" href={hotel.phoneHref}>{hotel.phone}</a> / <a className="underline" href={`mailto:${hotel.email}`}>{hotel.email}</a> and we’ll book it for you.
          </p>
          <button onClick={retry} className="mt-5 inline-flex h-10 items-center gap-2 rounded-full bg-basalt px-5 text-sm text-stone">
            <RefreshCw className="size-3.5" /> Try again
          </button>
        </div>
      )}

      {state.status === "ready" && <RoomList data={state.data} selected={selected} preferred={preferred} onSelect={onSelect} onEditDates={onEditDates} />}
    </div>
  );
}

function RoomList({ data, selected, preferred, onSelect, onEditDates }: { data: AvailabilityResponse; selected?: { slug: string; rateId: RateId }; preferred?: string; onSelect: (slug: string, rateId: RateId) => void; onEditDates: () => void }) {
  const sorted = useMemo(() => {
    const prefId = preferred ? getRoom(preferred)?.godoRoomId : undefined;
    return [...data.rooms].sort(
      (a, b) => Number(b.godoRoomId === prefId) - Number(a.godoRoomId === prefId) || Number(b.available) - Number(a.available),
    );
  }, [data, preferred]);
  const anyAvailable = data.rooms.some((r) => r.available);
  const guests = data.query.adults + data.query.children;

  if (!anyAvailable) {
    return (
      <div className="rounded-2xl border border-border bg-card p-10 text-center">
        <p className="font-serif text-3xl">We’re fully booked for these dates</p>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">
          No room is available for {guests} guest{guests > 1 ? "s" : ""} on the nights you chose. Try moving your dates by a day, or get in touch – we can often help, including with multiple rooms for larger groups.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button onClick={onEditDates} className="inline-flex h-11 items-center rounded-full bg-basalt px-6 text-sm text-stone">Change dates</button>
          <a href={`mailto:${hotel.email}`} className="inline-flex h-11 items-center rounded-full border border-border px-6 text-sm">Email {hotel.email}</a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <p className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className="relative flex size-2"><span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60" /><span className="relative inline-flex size-2 rounded-full bg-emerald-500" /></span>
        Live prices from our booking system · checked {format(new Date(data.fetchedAt), "HH:mm")} · total for {data.nights} night{data.nights > 1 ? "s" : ""}, VAT & city tax included
      </p>
      {sorted.map((q, i) => {
        const room = getRoomByGodoId(q.godoRoomId);
        if (!room) return null;
        return <RoomCard key={room.slug} priority={i === 0} room={room} quote={q} nights={data.nights} selected={selected?.slug === room.slug ? selected.rateId : undefined} onSelect={(id) => onSelect(room.slug, id)} />;
      })}
    </div>
  );
}

function RoomCard({ room, quote, nights, selected, onSelect, priority }: { priority?: boolean; room: Room; quote: RoomQuote; nights: number; selected?: RateId; onSelect: (id: RateId) => void }) {
  const rates = quote.rates.filter((r) => r.available);
  return (
    <article className={cn("grid gap-5 rounded-2xl border bg-card p-4 transition-shadow sm:grid-cols-[240px_1fr] sm:p-5", quote.available ? "border-border hover:shadow-lg hover:shadow-basalt/5" : "border-border/60 opacity-70")}>
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl sm:aspect-auto sm:min-h-52">
        <Image src={room.images[0]} alt={room.name} fill priority={priority} sizes="(min-width: 640px) 240px, 100vw" className="object-cover" />
        {quote.unitsLeft !== null && quote.available && quote.unitsLeft <= 2 && (
          <span className="absolute top-3 left-3 rounded-full bg-basalt/85 px-3 py-1 text-[0.7rem] text-stone backdrop-blur">
            {quote.unitsLeft === 1 ? "Last room" : `${quote.unitsLeft} rooms left`}
          </span>
        )}
      </div>
      <div className="flex min-w-0 flex-col">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h2 className="text-2xl leading-tight">{room.name}</h2>
            <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Maximize2 className="size-3" /> {room.sizeM2} m²</span>
              <span className="flex items-center gap-1"><Users className="size-3" /> Up to {room.maxGuests}</span>
              <span className="flex items-center gap-1"><BedDouble className="size-3" /> {room.beds}</span>
              <span className="flex items-center gap-1"><Bath className="size-3" /> {room.bathroom === "private" ? "Private bathroom" : "Shared bathroom"}</span>
            </p>
          </div>
          <Link href={`/rooms/${room.slug}`} className="text-xs text-muted-foreground underline-offset-4 hover:underline">Room details</Link>
        </div>

        {!quote.available ? (
          <p className="mt-6 rounded-lg bg-muted px-4 py-3 text-sm text-muted-foreground">{quote.reason ?? "Not available for these dates"}</p>
        ) : (
          <div className="mt-5 space-y-2.5">
            {rates.map((r) => {
              const plan = getRatePlan(r.rateId)!;
              const isSel = selected === r.rateId;
              return (
                <button
                  key={r.rateId}
                  onClick={() => onSelect(r.rateId)}
                  className={cn(
                    "group flex w-full items-center justify-between gap-4 rounded-xl border px-4 py-3 text-left transition-colors",
                    isSel ? "border-ember bg-ember/5" : "border-border hover:border-basalt/40",
                  )}
                  aria-pressed={isSel}
                >
                  <span className="min-w-0">
                    <span className="flex items-center gap-2 text-sm font-medium">
                      {plan.includesPackage && <Car className="size-3.5 text-ember" />}
                      {plan.name}
                      {plan.includesPackage && <span className="rounded-full bg-ember/15 px-2 py-0.5 text-[0.65rem] font-medium text-ember">Car storage + transfers</span>}
                    </span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">{plan.short}</span>
                  </span>
                  <span className="flex shrink-0 items-center gap-3">
                    <span className="text-right">
                      <span className="block font-serif text-2xl leading-none tabular-nums">{formatMoney(r.total)}</span>
                      <span className="text-[0.7rem] text-muted-foreground">{nights > 1 ? `${formatMoney(Math.round(r.total / nights))} / night avg.` : "for 1 night"}</span>
                    </span>
                    <span className={cn("grid size-8 place-items-center rounded-full transition-colors", isSel ? "bg-ember text-white" : "bg-muted text-basalt group-hover:bg-basalt group-hover:text-stone")}>
                      <ArrowRight className="size-4" />
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </article>
  );
}

function ExtrasStep({
  rateId,
  quote,
  loading,
  extras,
  update,
  onSwitchRate,
  onBack,
  stale,
  canContinue,
  checkoutHref,
}: {
  rateId: RateId;
  quote?: RoomQuote;
  loading: boolean;
  extras: Extras;
  update: (p: Partial<Extras>) => void;
  onSwitchRate: (id: RateId) => void;
  onBack: () => void;
  stale: boolean;
  canContinue: boolean;
  checkoutHref: string;
}) {
  const plan = getRatePlan(rateId)!;
  const pkg = quote?.rates.find((r) => r.rateId === 3);
  const roomOnly = quote?.rates.filter((r) => r.rateId !== 3 && r.available).sort((a, b) => a.total - b.total)[0];
  const current = quote?.rates.find((r) => r.rateId === rateId);
  const diff = pkg?.available && current?.available ? pkg.total - current.total : null;

  return (
    <div className="space-y-8">
      <section className={cn("overflow-hidden rounded-2xl border", plan.includesPackage ? "border-ember bg-ember/5" : "border-border bg-card")}>
        <div className="grid gap-0 md:grid-cols-[1fr_220px]">
          <div className="p-6 sm:p-8">
            <p className="eyebrow text-ember">{travelPackage.icelandicName} · Most popular with drivers</p>
            <h2 className="mt-2 text-3xl">Car storage & airport transfers</h2>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">{travelPackage.summary}</p>
            <ul className="mt-5 grid gap-2 text-sm sm:grid-cols-2">
              {travelPackage.includes.map((i) => (
                <li key={i} className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-ember" /> {i}</li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              {loading && <Skeleton className="h-11 w-56 rounded-full" />}
              {!loading && pkg?.available && !plan.includesPackage && (
                <button onClick={() => onSwitchRate(3)} className="inline-flex h-11 items-center gap-2 rounded-full bg-basalt px-6 text-sm text-stone hover:bg-basalt-soft">
                  Add for {diff !== null && diff > 0 ? `+${formatMoney(diff)}` : formatMoney(pkg.total)}
                  <span className="text-stone/60">· {formatMoney(pkg.total)} total</span>
                </button>
              )}
              {!loading && plan.includesPackage && (
                <>
                  <span className="inline-flex h-11 items-center gap-2 rounded-full bg-ember px-5 text-sm text-white"><Check className="size-4" /> Included in your rate</span>
                  {roomOnly && (
                    <button onClick={() => onSwitchRate(roomOnly.rateId)} className="text-sm text-muted-foreground underline-offset-4 hover:underline">
                      Remove · room only {formatMoney(roomOnly.total)}
                    </button>
                  )}
                </>
              )}
              {!loading && !pkg?.available && <span className="text-sm text-muted-foreground">Not available for this room on your dates.</span>}
            </div>
          </div>
          <div className="relative hidden min-h-full md:block">
            <Image src="/images/site/flugvel.jpg" alt="" fill sizes="220px" className="object-cover" />
          </div>
        </div>

        {plan.includesPackage && (
          <div className="border-t border-ember/30 bg-card p-6 sm:p-8">
            <h3 className="font-sans text-sm font-semibold">Your transfer details</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Optional now, but having them ready makes payment quicker. We’ll keep them beside the secure payment form so you can copy them in.
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Car licence plate" value={extras.licensePlate} onChange={(v) => update({ licensePlate: v.toUpperCase() })} placeholder="e.g. AB123" />
              <div className="space-y-1.5">
                <Label className="text-xs">Transfer to KEF (departure day)</Label>
                <select value={extras.transferTime ?? ""} onChange={(e) => update({ transferTime: e.target.value })} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                  <option value="">Choose a time</option>
                  {travelPackage.transferTimes.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <Field label="Return date to Keflavík" type="date" value={extras.arrivalDate} onChange={(v) => update({ arrivalDate: v })} />
              <Field label="Return flight number" value={extras.flightNumber} onChange={(v) => update({ flightNumber: v.toUpperCase() })} placeholder="e.g. FI205" />
              <Field label="Estimated landing time" type="time" value={extras.landingTime} onChange={(v) => update({ landingTime: v })} />
              <div className="space-y-1.5">
                <Label className="text-xs">Child seat for the transfer</Label>
                <select value={extras.childSeat ?? "none"} onChange={(e) => update({ childSeat: e.target.value as Extras["childSeat"] })} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                  {Object.entries(childSeatLabels).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <Plane className="size-5 text-ember" />
          <h3 className="mt-3 text-2xl">{shuttle.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{shuttle.summary}</p>
          <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
            {shuttle.details.map((d) => <li key={d} className="flex gap-2"><span className="mt-2 size-1 shrink-0 rounded-full bg-ember" />{d}</li>)}
          </ul>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <BedDouble className="size-5 text-ember" />
          <h3 className="mt-3 text-2xl">Travelling with little ones?</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Baby cribs are free on request, subject to availability. Family rooms can add travel beds.</p>
          <label className="mt-4 flex items-center gap-3 text-sm">
            <input type="checkbox" checked={!!extras.crib} onChange={(e) => update({ crib: e.target.checked })} className="size-4 accent-[var(--color-ember)]" />
            I’d like a baby crib
          </label>
          <Field className="mt-4" label="Ages of guests (optional)" value={extras.guestAges} onChange={(v) => update({ guestAges: v })} placeholder="e.g. 38, 36, 4" />
        </div>
      </section>

      {stale && (
        <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm">
          <span className="flex items-center gap-2 text-destructive"><AlertCircle className="size-4" /> This room and rate just sold out for your dates.</span>
          <button onClick={onBack} className="font-medium underline">Choose another room</button>
        </div>
      )}

      <div className="space-y-4 border-t border-border pt-8">
        <p className="flex max-w-xl gap-2 text-sm leading-relaxed text-muted-foreground">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-ember" />
          Next: add your name, email and card on our secure payment form{plan.includesPackage ? " and transfer details" : ""}. Your room, dates and total carry straight over.
        </p>
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button onClick={onBack} className="inline-flex h-12 items-center gap-2 text-sm text-muted-foreground hover:text-basalt"><ArrowLeft className="size-4" /> Back to rooms</button>
          <Link
            href={checkoutHref}
            aria-disabled={stale || !canContinue}
            className={cn("inline-flex h-14 items-center justify-center gap-3 rounded-full bg-basalt px-8 text-sm font-medium tracking-wide text-stone transition-colors hover:bg-basalt-soft", (stale || !canContinue) && "pointer-events-none opacity-40")}
          >
            <Lock className="size-4" /> Continue to secure payment
          </Link>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text", className }: { label: string; value?: string; onChange: (v: string) => void; placeholder?: string; type?: string; className?: string }) {
  const id = `f-${label.replace(/\W+/g, "-").toLowerCase()}`;
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={id} className="text-xs">{label}</Label>
      <Input id={id} type={type} value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="h-10" />
    </div>
  );
}

export function Summary({ stay, room, rateId, state, extras, compact }: { stay: StayQuery | null; room?: Room; rateId?: RateId; state: ReturnType<typeof useAvailability>["state"]; extras?: Extras; compact?: boolean }) {
  const plan = rateId ? getRatePlan(rateId) : undefined;
  const rq = state.status === "ready" && room ? state.data.rooms.find((r) => r.godoRoomId === room.godoRoomId)?.rates.find((r) => r.rateId === rateId) : undefined;
  const nights = stay ? nightsBetween(stay.checkin, stay.checkout) : 0;
  return (
    <div className={cn("rounded-2xl border border-border bg-card", compact ? "p-5" : "p-6")}>
      <p className="eyebrow text-ember">Your stay</p>
      {room ? (
        <div className="mt-4 flex gap-4">
          <div className="relative size-16 shrink-0 overflow-hidden rounded-lg">
            <Image src={room.images[0]} alt="" fill sizes="64px" className="object-cover" />
          </div>
          <div className="min-w-0">
            <p className="font-serif text-lg leading-tight">{room.name}</p>
            {plan && <p className="mt-1 text-xs text-muted-foreground">{plan.name} · {plan.short}</p>}
          </div>
        </div>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">Choose a room to see it here.</p>
      )}
      <dl className="mt-5 space-y-2.5 border-t border-border pt-5 text-sm">
        <Row label="Check-in" value={stay ? format(parseISODate(stay.checkin), "EEE d MMM yyyy") : "—"} />
        <Row label="Check-out" value={stay ? format(parseISODate(stay.checkout), "EEE d MMM yyyy") : "—"} />
        <Row label="Nights" value={stay ? String(nights) : "—"} />
        <Row label="Guests" value={stay ? String(stay.adults + stay.children) : "—"} />
        {plan?.includesPackage && <Row label="Includes" value="Car storage & transfers" />}
        {extras?.crib && <Row label="Request" value="Baby crib" />}
      </dl>
      <div className="mt-5 flex items-end justify-between border-t border-border pt-5">
        <span className="text-sm text-muted-foreground">Total</span>
        {state.status === "loading" && room && rateId ? (
          <Skeleton className="h-8 w-24" />
        ) : rq?.available ? (
          <span className="font-serif text-3xl tabular-nums">{formatMoney(rq.total)}</span>
        ) : (
          <span className="text-sm text-muted-foreground">{room && rateId && state.status === "ready" ? "Unavailable" : "—"}</span>
        )}
      </div>
      <p className="mt-4 flex gap-2 text-xs leading-relaxed text-muted-foreground">
        <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-ember" />
        Live price from our booking system. You’ll pay exactly this on the secure payment step – no surprises.
      </p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right">{value}</dd>
    </div>
  );
}

function MobileSummaryBar({ stay, room, rateId, state }: { stay: StayQuery | null; room?: Room; rateId?: RateId; state: ReturnType<typeof useAvailability>["state"] }) {
  const rq = state.status === "ready" && room ? state.data.rooms.find((r) => r.godoRoomId === room.godoRoomId)?.rates.find((r) => r.rateId === rateId) : undefined;
  if (!stay) return null;
  const nights = nightsBetween(stay.checkin, stay.checkout);
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-5 py-3 backdrop-blur lg:hidden">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0 text-xs">
          <p className="truncate font-medium">{room ? room.shortName : "No room selected yet"}</p>
          <p className="text-muted-foreground">{format(parseISODate(stay.checkin), "d MMM")} – {format(parseISODate(stay.checkout), "d MMM")} · {nights} night{nights > 1 ? "s" : ""} · {stay.adults + stay.children} guest{stay.adults + stay.children > 1 ? "s" : ""}</p>
        </div>
        <div className="text-right">
          {rq?.available ? <p className="font-serif text-2xl tabular-nums">{formatMoney(rq.total)}</p> : <p className="text-xs text-muted-foreground">Live prices</p>}
        </div>
      </div>
    </div>
  );
}