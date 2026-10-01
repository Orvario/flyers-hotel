import type { Metadata } from "next";
import Image from "next/image";
import { Check } from "lucide-react";
import { BookCta, PageHero } from "@/components/site/sections";
import { hotel } from "@content/hotel";

export const metadata: Metadata = { title: "About", description: hotel.about.paragraphs[0] };

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About Flyers Airport Hotel" title={hotel.about.title} image="/images/site/front-mockup.jpg" />
      <section className="container-x grid gap-14 py-24 lg:grid-cols-12">
        <div className="space-y-6 text-lg leading-relaxed text-muted-foreground lg:col-span-7">
          {hotel.about.paragraphs.map((p) => <p key={p}>{p}</p>)}
          <div className="grid gap-6 pt-6 sm:grid-cols-3">
            {hotel.about.roomKinds.map((k) => (
              <div key={k.title} className="border-t border-border pt-4">
                <p className="font-serif text-2xl text-basalt">{k.title}</p>
                <p className="mt-1 text-sm">{k.text}</p>
              </div>
            ))}
          </div>
        </div>
        <aside className="space-y-8 lg:col-span-4 lg:col-start-9">
          <div className="rounded-2xl border border-border bg-card p-7">
            <p className="eyebrow text-ember">Information</p>
            <ul className="mt-5 space-y-3 text-sm">
              {hotel.about.information.map((i) => <li key={i} className="flex gap-3"><Check className="mt-0.5 size-4 shrink-0 text-ember" /> {i}</li>)}
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-card p-7">
            <p className="eyebrow text-ember">House rules</p>
            <dl className="mt-5 space-y-3 text-sm">
              {hotel.houseRules.map((r) => <div key={r.label}><dt className="text-muted-foreground">{r.label}</dt><dd>{r.value}</dd></div>)}
            </dl>
          </div>
          <dl className="grid grid-cols-2 gap-6">
            {[["Bedrooms", hotel.facts.bedrooms], ["Bathrooms", hotel.facts.bathrooms], ["Parking spaces", hotel.facts.parkings], ["Size", `${hotel.facts.sizeM2} m²`]].map(([k, v]) => (
              <div key={k} className="border-t border-border pt-3"><dt className="text-xs text-muted-foreground">{k}</dt><dd className="font-serif text-3xl">{v}</dd></div>
            ))}
          </dl>
        </aside>
      </section>
      <section className="container-x grid gap-4 pb-24 sm:grid-cols-3">
        {["/images/site/img-4332.jpg", "/images/site/img-4356.jpg", "/images/site/img-8984.jpg"].map((src) => (
          <div key={src} className="relative aspect-[3/4] overflow-hidden rounded-2xl">
            <Image src={src} alt="" fill sizes="(min-width: 640px) 33vw, 100vw" className="object-cover" />
          </div>
        ))}
        <p className="text-xs text-muted-foreground sm:col-span-3">{hotel.company}</p>
      </section>
      <BookCta />
    </>
  );
}
