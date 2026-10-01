import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Plane } from "lucide-react";
import { BookCta, PageHero, SectionHeading } from "@/components/site/sections";
import { hotel, shuttle, travelPackage } from "@content/hotel";

export const metadata: Metadata = {
  title: "Travel package – car storage & airport transfers",
  description: travelPackage.summary,
};

const steps = [
  { title: "Arrive the night before", text: "Drive to Flyers Hotel, park, and check yourself in any time after 15:00." },
  { title: "Leave the car with us", text: "Your car stays in secure storage for the whole trip – no airport parking fees to watch." },
  { title: "We drive you to KEF", text: "Choose a morning transfer time when you book. The terminal is about five minutes away." },
  { title: "Collected when you land", text: "Tell us your return flight and we pick you up and bring you back to your car." },
];

export default function TravelPackagePage() {
  return (
    <>
      <PageHero eyebrow={`${travelPackage.icelandicName} · Travel package`} title="Park, sleep, fly – and come home to your car" intro={travelPackage.summary} image="/images/site/front-mynd-nota.jpg" />

      <section className="container-x grid gap-14 py-24 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHeading eyebrow="Included" title="One rate, everything handled" />
          <ul className="mt-10 space-y-4">
            {travelPackage.includes.map((i) => (
              <li key={i} className="flex gap-3 text-lg"><Check className="mt-1.5 size-4 shrink-0 text-ember" /> {i}</li>
            ))}
          </ul>
          <p className="mt-8 text-sm leading-relaxed text-muted-foreground">{travelPackage.note}</p>
          <Link href="/book" className="mt-10 inline-flex h-12 items-center gap-2 rounded-full bg-basalt px-6 text-sm text-stone hover:bg-basalt-soft">See live package prices <ArrowRight className="size-4" /></Link>
        </div>
        <ol className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:col-span-7">
          {steps.map((s, i) => (
            <li key={s.title} className="bg-background p-8">
              <span className="font-serif text-4xl text-ember">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-6 text-2xl">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-stone py-24">
        <div className="container-x grid gap-14 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="When you book" title="What we’ll ask for" intro="Have these to hand – our booking flow keeps them next to the payment form so you can copy them straight in." />
            <ul className="mt-8 divide-y divide-border border-y border-border">
              {travelPackage.detailsNeeded.map((d) => <li key={d.key} className="py-3 text-sm">{d.label}</li>)}
              <li className="py-3 text-sm">Child car seat or booster, if you need one</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-card p-8">
            <Plane className="size-5 text-ember" />
            <h3 className="mt-4 text-3xl">Only need a ride?</h3>
            <p className="mt-3 leading-relaxed text-muted-foreground">{shuttle.summary}</p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {shuttle.details.map((d) => <li key={d} className="flex gap-2"><span className="mt-2 size-1 shrink-0 rounded-full bg-ember" />{d}</li>)}
            </ul>
            <a href={shuttle.url} className="mt-6 inline-flex items-center gap-2 text-sm font-medium">Go to the shuttle service <ArrowRight className="size-4" /></a>
            <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-xl">
              <Image src="/images/site/ferdapakki-logo.png" alt="Bóka ferðapakka" fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-contain" />
            </div>
          </div>
        </div>
      </section>

      <section className="container-x py-20 text-sm text-muted-foreground">
        <p>Longer-term car storage without a hotel stay is offered by our sister service <a className="underline" href={hotel.links.carStorage}>Bílageymsla.is</a>. Call {hotel.phone} to book.</p>
      </section>
      <BookCta />
    </>
  );
}
