"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AlertCircle, ArrowLeft, Check, Copy, ExternalLink, Lock, Mail, Phone, ShieldCheck } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { buildGodoCheckoutUrl, validateStay } from "@/lib/booking";
import { getRatePlan, type RateId } from "@content/godo";
import { getRoom } from "@content/rooms";
import { hotel, shuttle, travelPackage } from "@content/hotel";
import { StepIndicator } from "./steps";
import { Summary } from "./booking-flow";
import { useAvailability } from "./use-availability";
import { childSeatLabels, useExtras } from "./extras-store";

const LOAD_TIMEOUT_MS = 15000;

export function Checkout() {
  const sp = useSearchParams();
  const parsed = validateStay({ checkin: sp.get("checkin"), checkout: sp.get("checkout"), adults: sp.get("adults"), children: sp.get("children") });
  const room = getRoom(sp.get("room") ?? "");
  const rateId = Number(sp.get("rate")) as RateId;
  const plan = getRatePlan(rateId);
  const stay = parsed.ok ? parsed.stay : null;
  const { state } = useAvailability(stay);
  const { extras } = useExtras();
  const [loaded, setLoaded] = useState(false);
  const [timedOut, setTimedOut] = useState(false);

  const godoUrl = stay && room && plan ? buildGodoCheckoutUrl(stay, room.godoRoomId, plan.id) : null;

  useEffect(() => {
    if (!godoUrl) return;
    const t = setTimeout(() => setTimedOut(true), LOAD_TIMEOUT_MS);
    return () => clearTimeout(t);
  }, [godoUrl]);

  if (!stay || !room || !plan || !godoUrl) {
    return (
      <div className="container-x pt-32 pb-24">
        <div className="mx-auto max-w-lg rounded-2xl border border-border bg-card p-10 text-center">
          <AlertCircle className="mx-auto size-6 text-ember" />
          <h1 className="mt-4 text-3xl">Your booking details are incomplete</h1>
          <p className="mt-3 text-muted-foreground">{!parsed.ok ? parsed.error : "Please choose a room and rate first."}</p>
          <Link href="/book" className="mt-6 inline-flex h-11 items-center rounded-full bg-basalt px-6 text-sm text-stone">Start your booking</Link>
        </div>
      </div>
    );
  }

  const quote = state.status === "ready" ? state.data.rooms.find((r) => r.godoRoomId === room.godoRoomId)?.rates.find((r) => r.rateId === rateId) : undefined;
  const soldOut = state.status === "ready" && !quote?.available;
  const back = `/book?${new URLSearchParams({ checkin: stay.checkin, checkout: stay.checkout, adults: String(stay.adults), children: String(stay.children), room: room.slug, rate: String(rateId), step: "review" })}`;

  const copyItems = plan.includesPackage
    ? [
        { godo: travelPackage.detailsNeeded[0].godoLabel, value: extras.licensePlate },
        { godo: travelPackage.detailsNeeded[1].godoLabel, value: extras.transferTime },
        { godo: travelPackage.detailsNeeded[2].godoLabel, value: extras.arrivalDate },
        { godo: travelPackage.detailsNeeded[3].godoLabel, value: extras.flightNumber },
        { godo: travelPackage.detailsNeeded[4].godoLabel, value: extras.landingTime },
        { godo: "Barnabílstólar (child seat)", value: extras.childSeat && extras.childSeat !== "none" ? childSeatLabels[extras.childSeat].godo : undefined },
        { godo: "Aldur gesta / Age of guests", value: extras.guestAges },
      ]
    : extras.guestAges
      ? [{ godo: "Aldur gesta / Age of guests", value: extras.guestAges }]
      : [];

  return (
    <div className="container-x pt-28 pb-24 lg:pt-32">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Link href={back} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-basalt"><ArrowLeft className="size-4" /> Back to review</Link>
          <h1 className="mt-3 flex items-center gap-3 text-4xl text-basalt sm:text-5xl"><Lock className="size-7 text-ember" /> Secure payment</h1>
        </div>
        <StepIndicator current={4} />
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px] lg:gap-12">
        <div className="min-w-0 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-stone/70 px-5 py-3.5 text-sm">
            <span className="flex items-start gap-2">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-ember" />
              <span>Encrypted payment by <strong className="font-semibold">Godo</strong>, Flyers Hotel’s official booking partner. Your room, dates and total are already filled in.</span>
            </span>
            <a href={godoUrl} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground underline-offset-4 hover:text-basalt hover:underline">
              Open in a new tab <ExternalLink className="size-3" />
            </a>
          </div>

          {soldOut && (
            <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm">
              <span className="flex items-center gap-2 text-destructive"><AlertCircle className="size-4" /> This room and rate is no longer available for your dates.</span>
              <Link href={back.replace("step=review", "step=room")} className="font-medium underline">Choose another room</Link>
            </div>
          )}

          <div className="relative overflow-hidden rounded-2xl border border-border bg-[#dfddd0]">
            {!loaded && (
              <div className="absolute inset-0 z-10 space-y-4 bg-card p-8" aria-busy="true">
                <p className="flex items-center gap-2 text-sm text-muted-foreground"><Lock className="size-3.5" /> Opening the secure payment form…</p>
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-2/3" />
                {timedOut && (
                  <div className="rounded-xl border border-border bg-stone p-5 text-sm">
                    <p className="font-medium">This is taking longer than usual.</p>
                    <p className="mt-1 text-muted-foreground">Some browsers block embedded payment forms. You can continue in a new tab – everything stays prefilled.</p>
                    <a href={godoUrl} target="_blank" rel="noopener" className="mt-4 inline-flex h-11 items-center gap-2 rounded-full bg-basalt px-6 text-sm text-stone">
                      <Lock className="size-3.5" /> Continue securely in a new tab
                    </a>
                  </div>
                )}
              </div>
            )}
            <iframe
              title="Secure payment – Flyers Hotel booking"
              src={godoUrl}
              onLoad={() => setLoaded(true)}
              className="block h-[2300px] w-full border-0 sm:h-[1700px] lg:h-[1450px]"
              allow="payment"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Godo’s form shows some labels in Icelandic and English. Questions about your booking? Call <a className="underline" href={hotel.phoneHref}>{hotel.phone}</a> or email <a className="underline" href={`mailto:${hotel.email}`}>{hotel.email}</a>.
          </p>
        </div>

        <aside className="min-w-0 space-y-5">
          <div className="lg:sticky lg:top-28 lg:space-y-5">
            <Summary stay={stay} room={room} rateId={rateId} state={state} extras={extras} compact />

            {copyItems.length > 0 && (
              <div className="mt-5 rounded-2xl border border-ember/40 bg-ember/5 p-5 lg:mt-0">
                <p className="eyebrow text-ember">Copy into the form</p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  The payment form asks for these below your contact details{plan.includesPackage ? " (tick “Aðeins fylla út… ef ferðapakki er valinn” first)" : ""}.
                </p>
                <ul className="mt-4 space-y-3">
                  {copyItems.map((c) => <CopyRow key={c.godo} label={c.godo} value={c.value} />)}
                </ul>
              </div>
            )}

            <div className="mt-5 rounded-2xl border border-border bg-card p-5 text-sm lg:mt-0">
              <p className="font-medium">Good to know</p>
              <ul className="mt-3 space-y-2 text-muted-foreground">
                <li className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-ember" /> {plan.refundable ? "Free cancellation up to 48 hours before arrival." : "Non-refundable rate – this is our best price."}</li>
                <li className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-ember" /> Self check-in any time after 15:00.</li>
                {!plan.includesPackage && <li className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-ember" /> Need a ride to KEF? Book the <a href={shuttle.url} className="underline">airport shuttle</a> once confirmed.</li>}
              </ul>
              <div className="mt-4 flex gap-4 border-t border-border pt-4 text-xs">
                <a href={hotel.phoneHref} className="flex items-center gap-1.5 text-muted-foreground hover:text-basalt"><Phone className="size-3.5" /> {hotel.phone}</a>
                <a href={`mailto:${hotel.email}`} className="flex items-center gap-1.5 text-muted-foreground hover:text-basalt"><Mail className="size-3.5" /> Email us</a>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function CopyRow({ label, value }: { label: string; value?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <li className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="truncate text-[0.7rem] text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value || <span className="font-normal text-muted-foreground">Not provided</span>}</p>
      </div>
      {value && (
        <button
          onClick={() => {
            navigator.clipboard?.writeText(value).then(() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            });
          }}
          className="grid size-8 shrink-0 place-items-center rounded-full border border-border bg-card hover:bg-muted"
          aria-label={`Copy ${label}`}
        >
          {copied ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
        </button>
      )}
    </li>
  );
}
