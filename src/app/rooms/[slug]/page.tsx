import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BedDouble, Check } from "lucide-react";
import { StayPicker } from "@/components/booking/stay-picker";
import { RoomFacts, RoomTile } from "@/components/site/sections";
import { getRoom, rooms } from "@content/rooms";
import { hotel } from "@content/hotel";

export function generateStaticParams() {
  return rooms.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/rooms/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const room = getRoom(slug);
  if (!room) return {};
  return { title: room.name, description: room.headline, openGraph: { images: [room.images[0]] } };
}

export default async function RoomPage({ params }: PageProps<"/rooms/[slug]">) {
  const { slug } = await params;
  const room = getRoom(slug);
  if (!room) notFound();
  const [first, ...rest] = room.images;
  const others = rooms.filter((r) => r.slug !== room.slug).slice(0, 3);

  return (
    <>
      <section className="container-x pt-28 sm:pt-32">
        <Link href="/rooms" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-basalt"><ArrowLeft className="size-4" /> All rooms</Link>
        <div className="mt-6 grid gap-3 sm:grid-cols-4 sm:grid-rows-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl sm:col-span-3 sm:row-span-2 sm:aspect-auto sm:min-h-[560px]">
            <Image src={first} alt={room.name} fill priority sizes="(min-width: 640px) 75vw, 100vw" className="object-cover" />
          </div>
          {rest.slice(0, 2).map((src) => (
            <div key={src} className="relative hidden overflow-hidden rounded-2xl sm:block">
              <Image src={src} alt="" fill sizes="25vw" className="object-cover" />
            </div>
          ))}
        </div>
        {rest.length > 2 && (
          <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-6">
            {rest.slice(2).map((src) => (
              <div key={src} className="relative aspect-square overflow-hidden rounded-xl">
                <Image src={src} alt="" fill sizes="16vw" className="object-cover" />
              </div>
            ))}
          </div>
        )}
        {rest.length > 0 && (
          <div className="mt-3 flex gap-3 overflow-x-auto sm:hidden">
            {rest.slice(0, 2).map((src) => (
              <div key={src} className="relative aspect-[4/3] w-2/3 shrink-0 overflow-hidden rounded-xl">
                <Image src={src} alt="" fill sizes="66vw" className="object-cover" />
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="container-x grid gap-14 py-16 sm:py-24 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="eyebrow text-ember">{room.bathroom === "private" ? "Private bathroom" : "Shared bathroom"}</p>
          <h1 className="mt-4 text-5xl leading-[1.02] sm:text-6xl">{room.name}</h1>
          <p className="mt-6 font-serif text-2xl leading-snug text-basalt/80 italic">{room.headline}</p>
          <div className="mt-8"><RoomFacts room={room} /></div>
          <p className="mt-8 text-lg leading-relaxed text-muted-foreground">{room.description}</p>
          <h2 className="mt-14 font-sans text-sm font-semibold tracking-wide">In the room</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            <li className="flex gap-3 text-sm"><BedDouble className="size-4 shrink-0 text-ember" /> {room.beds}</li>
            {room.amenities.map((a) => <li key={a} className="flex gap-3 text-sm"><Check className="size-4 shrink-0 text-ember" /> {a}</li>)}
          </ul>
          <h2 className="mt-14 font-sans text-sm font-semibold tracking-wide">House rules</h2>
          <dl className="mt-5 divide-y divide-border border-y border-border">
            {hotel.houseRules.map((r) => (
              <div key={r.label} className="flex justify-between gap-6 py-3 text-sm"><dt className="text-muted-foreground">{r.label}</dt><dd className="text-right">{r.value}</dd></div>
            ))}
          </dl>
        </div>
        <aside className="lg:col-span-5">
          <div className="sticky top-28 rounded-2xl border border-border bg-card p-6 sm:p-8">
            <p className="eyebrow text-ember">Check availability</p>
            <h2 className="mt-3 text-3xl">Live price for your dates</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Prices change with the season and occupancy, so we show them live from our booking system – the same total you’ll pay.</p>
            <div className="mt-6">
              <StayPicker stacked extraParams={{ room: room.slug }} submitLabel="See prices" />
            </div>
            <p className="mt-5 text-xs text-muted-foreground">Add car storage and airport transfers in the next step.</p>
          </div>
        </aside>
      </section>

      <section className="bg-stone py-20 sm:py-28">
        <div className="container-x">
          <h2 className="text-4xl">Other rooms</h2>
          <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((r) => <RoomTile key={r.slug} room={r} />)}
          </div>
        </div>
      </section>
    </>
  );
}
