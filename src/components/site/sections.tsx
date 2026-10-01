import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Bath, Beer, Car, Coffee, Maximize2, Mountain, Plane, Users, UtensilsCrossed, Waves, Wifi } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import type { Room } from "@content/rooms";
import { faq } from "@content/faq";

export function SectionHeading({ eyebrow, title, intro, align = "left", light }: { eyebrow: string; title: string; intro?: string; align?: "left" | "center"; light?: boolean }) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
      <p className={cn("eyebrow", light ? "text-ember-soft" : "text-ember")}>{eyebrow}</p>
      <h2 className={cn("mt-4 text-4xl leading-[1.05] sm:text-5xl", light ? "text-stone" : "text-basalt")}>{title}</h2>
      {intro && <p className={cn("mt-5 text-base leading-relaxed sm:text-lg", light ? "text-stone/70" : "text-muted-foreground")}>{intro}</p>}
    </div>
  );
}

export function PageHero({ eyebrow, title, intro, image }: { eyebrow: string; title: string; intro?: string; image?: string }) {
  return (
    <section className={cn("relative overflow-hidden", image ? "bg-basalt" : "bg-stone")}>
      {image && <Image src={image} alt="" fill priority sizes="100vw" className="object-cover opacity-45" />}
      <div className="container-x relative pt-40 pb-20 sm:pt-48 sm:pb-24">
        <p className={cn("eyebrow", image ? "text-ember-soft" : "text-ember")}>{eyebrow}</p>
        <h1 className={cn("mt-4 max-w-3xl text-5xl leading-[1.02] sm:text-6xl", image ? "text-stone" : "text-basalt")}>{title}</h1>
        {intro && <p className={cn("mt-6 max-w-2xl text-lg leading-relaxed", image ? "text-stone/75" : "text-muted-foreground")}>{intro}</p>}
      </div>
    </section>
  );
}

export function RoomTile({ room, priority }: { room: Room; priority?: boolean }) {
  return (
    <Link href={`/rooms/${room.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-sand">
        <Image src={room.images[0]} alt={room.name} fill priority={priority} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-basalt/70 to-transparent" />
        <span className="absolute bottom-4 left-4 flex gap-2 text-[0.7rem] text-stone">
          <span className="rounded-full bg-black/30 px-2.5 py-1 backdrop-blur">{room.sizeM2} m²</span>
          <span className="rounded-full bg-black/30 px-2.5 py-1 backdrop-blur">Sleeps {room.maxGuests}</span>
          <span className="rounded-full bg-black/30 px-2.5 py-1 backdrop-blur">{room.bathroom === "private" ? "Private bath" : "Shared bath"}</span>
        </span>
      </div>
      <h3 className="mt-5 text-2xl leading-tight text-basalt">{room.name}</h3>
      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{room.headline}</p>
      <span className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-basalt">
        View room & live prices <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}

export function RoomFacts({ room }: { room: Room }) {
  return (
    <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
      <li className="flex items-center gap-2"><Maximize2 className="size-4 text-ember" /> {room.sizeM2} m²</li>
      <li className="flex items-center gap-2"><Users className="size-4 text-ember" /> Up to {room.maxGuests} guest{room.maxGuests > 1 ? "s" : ""}</li>
      <li className="flex items-center gap-2"><Bath className="size-4 text-ember" /> {room.bathroom === "private" ? "Private bathroom" : "Shared bathroom"}</li>
    </ul>
  );
}

const icons = { wifi: Wifi, coffee: Coffee, utensils: UtensilsCrossed, mountain: Mountain, waves: Waves, beer: Beer, plane: Plane, car: Car } as const;

export function FacilityGrid({ items }: { items: readonly { title: string; text: string; icon: string }[] }) {
  return (
    <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
      {items.map((f, i) => {
        const Icon = icons[f.icon as keyof typeof icons] ?? Wifi;
        return (
          <div key={f.title} className="bg-background p-7">
            <div className="flex items-center justify-between">
              <Icon className="size-5 text-ember" strokeWidth={1.5} />
              <span className="font-serif text-sm text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
            </div>
            <h3 className="mt-6 text-xl">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.text}</p>
          </div>
        );
      })}
    </div>
  );
}

export function FaqList({ limit }: { limit?: number }) {
  const items = limit ? faq.slice(0, limit) : faq;
  return (
    <Accordion className="w-full border-t border-border">
      {items.map((f) => (
        <AccordionItem key={f.q} value={f.q} className="border-b border-border">
          <AccordionTrigger className="py-6 text-left font-serif text-xl hover:no-underline">{f.q}</AccordionTrigger>
          <AccordionContent className="pb-6 text-base leading-relaxed text-muted-foreground">{f.a}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export function BookCta({ title = "Your calm start to Iceland", text = "Live prices, instant confirmation and car storage with airport transfers – booked in a few minutes." }: { title?: string; text?: string }) {
  return (
    <section className="relative overflow-hidden bg-basalt">
      <Image src="/images/site/front-mynd-nota.jpg" alt="" fill sizes="100vw" className="object-cover opacity-30" />
      <div className="container-x relative flex flex-col items-start gap-8 py-24 md:flex-row md:items-end md:justify-between">
        <div className="max-w-xl">
          <p className="eyebrow text-ember-soft">Book direct</p>
          <h2 className="mt-4 text-4xl text-stone sm:text-5xl">{title}</h2>
          <p className="mt-4 text-stone/70">{text}</p>
        </div>
        <Link href="/book" className="inline-flex h-14 items-center gap-3 rounded-full bg-stone px-8 text-sm font-medium tracking-wide text-basalt hover:bg-white">
          Check availability <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}
