import type { Metadata } from "next";
import { BookCta, PageHero, RoomTile } from "@/components/site/sections";
import { rooms } from "@content/rooms";

export const metadata: Metadata = {
  title: "Rooms",
  description: "Single, double, triple and family rooms with private or shared bathrooms, five minutes from Keflavík Airport.",
};

export default function RoomsPage() {
  return (
    <>
      <PageHero
        eyebrow="Rooms at Flyers Hotel"
        title="Bright, clean and quiet – for every kind of traveller"
        intro="All rooms come with freshly made beds, TV with cable, a wash basin, fresh towels, reading lights and free high-speed Wi-Fi, plus access to our shared lounge."
      />
      <section className="container-x py-20 sm:py-28">
        <div className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map((r, i) => <RoomTile key={r.slug} room={r} priority={i < 3} />)}
        </div>
      </section>
      <BookCta title="See tonight’s prices" text="Pick your dates to see live availability and the exact price for every room." />
    </>
  );
}
