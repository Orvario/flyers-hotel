import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { PageHero } from "@/components/site/sections";
import { hotel } from "@content/hotel";

export const metadata: Metadata = { title: "Contact", description: hotel.contactPitch };

export default function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Contact Flyers Hotel" title="Have a question? We’ll answer it." intro={hotel.contactPitch} />
      <section className="container-x grid gap-12 py-20 lg:grid-cols-2">
        <div className="space-y-8">
          <a href={hotel.phoneHref} className="flex gap-5 rounded-2xl border border-border bg-card p-7 hover:border-basalt/30">
            <Phone className="size-5 shrink-0 text-ember" />
            <span><span className="eyebrow block text-muted-foreground">Call</span><span className="mt-2 block font-serif text-3xl">{hotel.phone}</span></span>
          </a>
          <a href={`mailto:${hotel.email}`} className="flex gap-5 rounded-2xl border border-border bg-card p-7 hover:border-basalt/30">
            <Mail className="size-5 shrink-0 text-ember" />
            <span><span className="eyebrow block text-muted-foreground">Email</span><span className="mt-2 block font-serif text-3xl">{hotel.email}</span></span>
          </a>
          <a href={hotel.address.mapsUrl} target="_blank" rel="noreferrer" className="flex gap-5 rounded-2xl border border-border bg-card p-7 hover:border-basalt/30">
            <MapPin className="size-5 shrink-0 text-ember" />
            <span>
              <span className="eyebrow block text-muted-foreground">Address</span>
              <span className="mt-2 block font-serif text-2xl">{hotel.fullName}</span>
              <span className="text-muted-foreground">{hotel.address.street}, {hotel.address.postcode} {hotel.address.town}, {hotel.address.country}</span>
            </span>
          </a>
          <p className="text-sm text-muted-foreground">Group booking (3+ rooms) or a special request? Email us with your dates and we’ll come back with an offer.</p>
        </div>
        <div className="overflow-hidden rounded-2xl border border-border">
          <iframe title="Map of Flyers Hotel" src={hotel.address.mapEmbedUrl} className="h-full min-h-[480px] w-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        </div>
      </section>
    </>
  );
}
