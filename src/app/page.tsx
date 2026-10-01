import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Clock, MapPin, Plane } from "lucide-react";
import { StayPicker } from "@/components/booking/stay-picker";
import { BookCta, FacilityGrid, FaqList, RoomTile, SectionHeading } from "@/components/site/sections";
import { hotel, travelPackage } from "@content/hotel";
import { rooms } from "@content/rooms";

export default function Home() {
  return (
    <>
      <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-basalt">
        <Image src="/images/hero.jpg" alt="Flyers Hotel at blue hour with the northern lights over the Reykjanes lava fields" fill priority sizes="100vw" className="-z-10 object-cover object-[72%_center] sm:object-center" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-basalt via-basalt/30 to-basalt/40" />
        <div className="container-x pt-32 pb-14 sm:pb-20">
          <p className="eyebrow text-ember-soft">Keflavík · Reykjanes Peninsula · Iceland</p>
          <h1 className="mt-5 max-w-3xl text-[3.2rem] leading-[0.98] text-stone sm:text-7xl lg:text-[5.5rem]">
            The calm between <em className="font-normal text-ember-soft">landing</em> and leaving.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-stone/75">
            Nineteen quiet rooms five minutes from Keflavík Airport, with self check-in at any hour and car storage with airport transfers on request.
          </p>
          <div className="mt-10 max-w-4xl">
            <StayPicker variant="hero" />
          </div>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs text-stone/70">
            <li className="flex items-center gap-2"><Check className="size-3.5 text-ember-soft" /> Live prices – the same at payment</li>
            <li className="flex items-center gap-2"><Check className="size-3.5 text-ember-soft" /> Secure payment, instant confirmation</li>
            <li className="flex items-center gap-2"><Check className="size-3.5 text-ember-soft" /> Free parking</li>
          </ul>
        </div>
      </section>

      <section className="container-x grid gap-14 py-24 sm:py-32 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <SectionHeading eyebrow={hotel.fullName} title="A great place to start and finish your journey" />
          <p className="mt-8 text-lg leading-relaxed text-muted-foreground">{hotel.intro}</p>
          <Link href="/about" className="mt-8 inline-flex items-center gap-2 text-sm font-medium">About the hotel <ArrowRight className="size-4" /></Link>
        </div>
        <div className="lg:col-span-5 lg:col-start-8">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
            <Image src="/images/site/lobby-1.jpg" alt="The Flyers Hotel lounge" fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
          </div>
          <dl className="mt-8 grid grid-cols-2 gap-6">
            {hotel.stats.map((s) => (
              <div key={s.label} className="border-t border-border pt-4">
                <dt className="text-xs text-muted-foreground">{s.label}</dt>
                <dd className="mt-1 font-serif text-4xl text-basalt">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="bg-stone py-24 sm:py-32">
        <div className="container-x">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeading eyebrow="Rooms" title="Six ways to rest well" intro="Singles, doubles, triples and family rooms – with private or shared bathrooms, freshly made beds, TV and fast Wi-Fi." />
            <Link href="/rooms" className="inline-flex shrink-0 items-center gap-2 text-sm font-medium">All rooms <ArrowRight className="size-4" /></Link>
          </div>
          <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {rooms.map((r) => <RoomTile key={r.slug} room={r} />)}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-basalt text-stone">
        <div className="grid lg:grid-cols-2">
          <div className="relative min-h-[420px]">
            <Image src="/images/site/flugvel.jpg" alt="A plane over Keflavík" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          </div>
          <div className="px-6 py-20 sm:px-12 lg:px-16 lg:py-28">
            <p className="eyebrow text-ember-soft">{travelPackage.icelandicName}</p>
            <h2 className="mt-4 text-4xl leading-tight sm:text-5xl">Park, sleep, fly. We drive you to the terminal.</h2>
            <p className="mt-6 max-w-lg leading-relaxed text-stone/70">{travelPackage.summary}</p>
            <ul className="mt-8 space-y-3">
              {travelPackage.includes.map((i) => (
                <li key={i} className="flex gap-3 text-stone/85"><Check className="mt-0.5 size-4 shrink-0 text-ember-soft" /> {i}</li>
              ))}
            </ul>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/book" className="inline-flex h-12 items-center gap-2 rounded-full bg-stone px-6 text-sm font-medium text-basalt hover:bg-white">See live package prices <ArrowRight className="size-4" /></Link>
              <Link href="/travel-package" className="inline-flex h-12 items-center rounded-full border border-white/20 px-6 text-sm text-stone hover:bg-white/5">How it works</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container-x py-24 sm:py-32">
        <SectionHeading eyebrow="Facilities" title="Everything you need. Nothing you don’t." intro={hotel.contactPitch} />
        <div className="mt-14">
          <FacilityGrid items={hotel.facilities} />
        </div>
      </section>

      <section className="bg-stone py-24 sm:py-32">
        <div className="container-x">
          <SectionHeading eyebrow="Around you" title="The Reykjanes Peninsula" intro="An active volcanic UNESCO Global Geopark on your doorstep – lava fields, geothermal springs and the Bridge Between Continents." />
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {hotel.activities.map((a) => (
              <Link key={a.slug} href={`/explore#${a.slug}`} className="group">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                  <Image src={a.image} alt={a.title} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition-transform duration-[1.2s] group-hover:scale-[1.04]" />
                </div>
                <h3 className="mt-5 text-2xl">{a.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{a.teaser}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x grid gap-14 py-24 sm:py-32 lg:grid-cols-2">
        <div>
          <SectionHeading eyebrow="Location" title="Five minutes from the runway" />
          <ul className="mt-10 space-y-6">
            <li className="flex gap-4"><MapPin className="mt-1 size-5 shrink-0 text-ember" /><span><span className="block font-medium">{hotel.address.street}, {hotel.address.postcode} {hotel.address.town}</span><span className="text-sm text-muted-foreground">In the centre of town, walking distance to restaurants, bars and the pool.</span></span></li>
            <li className="flex gap-4"><Plane className="mt-1 size-5 shrink-0 text-ember" /><span><span className="block font-medium">About 5 min. from Keflavík Airport</span><span className="text-sm text-muted-foreground">Reykjavík is about 50 minutes’ drive from the airport.</span></span></li>
            <li className="flex gap-4"><Clock className="mt-1 size-5 shrink-0 text-ember" /><span><span className="block font-medium">Self check-in after 15:00 · check-out by 11:00</span><span className="text-sm text-muted-foreground">Arrive on the last flight or leave on the first – we’re ready.</span></span></li>
          </ul>
          <a href={hotel.address.mapsUrl} target="_blank" rel="noreferrer" className="mt-10 inline-flex items-center gap-2 text-sm font-medium">Get directions <ArrowRight className="size-4" /></a>
        </div>
        <div className="overflow-hidden rounded-2xl border border-border">
          <iframe title="Map of Flyers Hotel, Reykjanesbær" src={hotel.address.mapEmbedUrl} className="h-[420px] w-full grayscale-[0.4]" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        </div>
      </section>

      <section className="border-t border-border">
        <div className="container-x grid gap-12 py-24 sm:py-32 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading eyebrow="Questions" title="Before you fly" />
            <Link href="/faq" className="mt-8 inline-flex items-center gap-2 text-sm font-medium">All questions <ArrowRight className="size-4" /></Link>
          </div>
          <div className="lg:col-span-8">
            <FaqList limit={5} />
          </div>
        </div>
      </section>

      <BookCta />
    </>
  );
}
