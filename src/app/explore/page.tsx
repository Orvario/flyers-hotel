import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { BookCta, PageHero } from "@/components/site/sections";
import { hotel } from "@content/hotel";

export const metadata: Metadata = { title: "Explore Reykjanes", description: "Things to do around Flyers Hotel on the Reykjanes Peninsula." };

export default function ExplorePage() {
  return (
    <>
      <PageHero eyebrow="Around Flyers Hotel" title="Fire, water and wind on your doorstep" intro="Reykjanes is an active volcanic GeoPark – about 12 eruptions in the past four years – with geothermal pools, lighthouses and the Bridge Between Continents." image="/images/site/reykjanes.jpg" />
      <div className="container-x space-y-24 py-24 sm:space-y-32 sm:py-32">
        {hotel.activities.map((a, i) => (
          <article key={a.slug} id={a.slug} className="grid scroll-mt-28 items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div className={i % 2 ? "lg:order-2" : ""}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                <Image src={a.image} alt={a.title} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
              </div>
              {"imageCredit" in a && <p className="mt-2 text-xs text-muted-foreground">{a.imageCredit}</p>}
            </div>
            <div>
              <p className="eyebrow text-ember">{String(i + 1).padStart(2, "0")}</p>
              <h2 className="mt-4 text-4xl sm:text-5xl">{a.title}</h2>
              {a.body.map((p) => <p key={p} className="mt-5 leading-relaxed text-muted-foreground">{p}</p>)}
              <a href={a.url} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 text-sm font-medium">Visit website <ArrowUpRight className="size-4" /></a>
            </div>
          </article>
        ))}
        <div className="grid gap-4 sm:grid-cols-3">
          {["/images/site/9834111765-0e64871f19-b.jpg", "/images/site/img-4843.jpg", "/images/site/102ula403.jpg"].map((src) => (
            <div key={src} className="relative aspect-[3/4] overflow-hidden rounded-2xl">
              <Image src={src} alt="" fill sizes="(min-width: 640px) 33vw, 100vw" className="object-cover" />
            </div>
          ))}
        </div>
      </div>
      <BookCta />
    </>
  );
}
