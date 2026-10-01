import type { Metadata } from "next";
import Image from "next/image";
import { Mail, Phone } from "lucide-react";
import { PageHero } from "@/components/site/sections";
import { giftCard, hotel } from "@content/hotel";

export const metadata: Metadata = { title: "Gift card", description: giftCard.summary };

export default function GiftCardPage() {
  return (
    <>
      <PageHero eyebrow="Gjafabréf · Gift card" title="Give a trip that starts easy" intro={giftCard.summary} />
      <section className="container-x grid items-center gap-14 py-20 lg:grid-cols-2">
        <div className="relative mx-auto aspect-[1414/2000] w-full max-w-md overflow-hidden rounded-2xl shadow-2xl shadow-basalt/10">
          <Image src={giftCard.image} alt="Flyers Airport Hotel gift card" fill sizes="(min-width: 1024px) 28rem, 100vw" className="object-cover" />
        </div>
        <div>
          <h2 className="text-4xl">How to order</h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">Contact us to buy a gift card. {giftCard.howToRedeem}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a href={`mailto:${hotel.email}?subject=Gift%20card`} className="inline-flex h-12 items-center gap-2 rounded-full bg-basalt px-6 text-sm text-stone"><Mail className="size-4" /> {hotel.email}</a>
            <a href={hotel.phoneHref} className="inline-flex h-12 items-center gap-2 rounded-full border border-border px-6 text-sm"><Phone className="size-4" /> {hotel.phone}</a>
          </div>
        </div>
      </section>
    </>
  );
}
