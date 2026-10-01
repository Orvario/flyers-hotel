import Link from "next/link";
import { hotel } from "@content/hotel";
import { Wordmark } from "./header";

export function SiteFooter() {
  return (
    <footer className="bg-basalt text-stone">
      <div className="container-x grid gap-12 py-20 md:grid-cols-12">
        <div className="md:col-span-5">
          <Wordmark light />
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-stone/60">{hotel.shortPitch}</p>
        </div>
        <div className="md:col-span-3">
          <p className="eyebrow text-ember-soft">Visit</p>
          <address className="mt-4 text-sm leading-relaxed text-stone/80 not-italic">
            {hotel.fullName}
            <br />
            {hotel.address.street}, {hotel.address.postcode} {hotel.address.town}
            <br />
            {hotel.address.country}
          </address>
          <a href={hotel.phoneHref} className="mt-4 block text-sm text-stone/80 hover:text-stone">{hotel.phone}</a>
          <a href={`mailto:${hotel.email}`} className="block text-sm text-stone/80 hover:text-stone">{hotel.email}</a>
        </div>
        <div className="grid grid-cols-2 gap-8 md:col-span-4">
          <div>
            <p className="eyebrow text-ember-soft">Stay</p>
            <ul className="mt-4 space-y-2 text-sm text-stone/80">
              <li><Link href="/rooms" className="hover:text-stone">Rooms</Link></li>
              <li><Link href="/travel-package" className="hover:text-stone">Travel package</Link></li>
              <li><Link href="/book" className="hover:text-stone">Book your stay</Link></li>
              <li><a href={hotel.links.shuttleApp} className="hover:text-stone">Airport shuttle</a></li>
              <li><Link href="/gift-card" className="hover:text-stone">Gift card</Link></li>
            </ul>
          </div>
          <div>
            <p className="eyebrow text-ember-soft">Hotel</p>
            <ul className="mt-4 space-y-2 text-sm text-stone/80">
              <li><Link href="/about" className="hover:text-stone">About</Link></li>
              <li><Link href="/facilities" className="hover:text-stone">Facilities</Link></li>
              <li><Link href="/explore" className="hover:text-stone">Reykjanes</Link></li>
              <li><Link href="/faq" className="hover:text-stone">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-stone">Contact</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-3 py-6 text-xs text-stone/50 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Flyers Hotel. {hotel.company}</p>
          <div className="flex gap-6">
            <Link href="/terms" className="hover:text-stone">Terms & conditions</Link>
            <Link href="/privacy" className="hover:text-stone">Privacy</Link>
            <a href={hotel.facebook} target="_blank" rel="noreferrer" className="hover:text-stone">Facebook</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
