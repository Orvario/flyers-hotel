import type { Metadata } from "next";
import Image from "next/image";
import { BookCta, FacilityGrid, PageHero } from "@/components/site/sections";
import { hotel } from "@content/hotel";

export const metadata: Metadata = { title: "Facilities", description: hotel.facilitiesIntro };

export default function FacilitiesPage() {
  return (
    <>
      <PageHero eyebrow="Facilities" title="Comfort, cleanliness and simplicity" intro={hotel.facilitiesIntro} />
      <section className="container-x py-20 sm:py-28">
        <FacilityGrid items={hotel.facilities} />
        <div className="mt-16 grid gap-4 sm:grid-cols-3">
          {["/images/site/lobby-1.jpg", "/images/site/front-mockup.jpg", "/images/site/bakgrunnsmynd-heimasida.jpg"].map((src) => (
            <div key={src} className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <Image src={src} alt="" fill sizes="(min-width: 640px) 33vw, 100vw" className="object-cover" />
            </div>
          ))}
        </div>
      </section>
      <BookCta />
    </>
  );
}
