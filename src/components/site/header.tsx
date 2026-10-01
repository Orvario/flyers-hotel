"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Phone } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { hotel } from "@content/hotel";

const nav = [
  { href: "/rooms", label: "Rooms" },
  { href: "/travel-package", label: "Travel package" },
  { href: "/facilities", label: "Facilities" },
  { href: "/explore", label: "Reykjanes" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Wordmark({ light }: { light?: boolean }) {
  return (
    <span className={cn("flex flex-col leading-none", light ? "text-stone" : "text-basalt")}>
      <span className="font-serif text-[1.65rem] font-medium tracking-tight">Flyers</span>
      <span className={cn("mt-1 text-[0.55rem] tracking-[0.32em] whitespace-nowrap uppercase", light ? "text-stone/70" : "text-basalt/60")}>
        Keflavík Airport Hotel
      </span>
    </span>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const overHero = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const transparent = overHero && !scrolled;
  const inBooking = pathname.startsWith("/book");

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        transparent ? "bg-transparent" : "border-b border-border/70 bg-background/90 backdrop-blur-md",
      )}
    >
      <div className="container-x flex h-20 items-center justify-between gap-6">
        <Link href="/" aria-label="Flyers Hotel home" onClick={() => setOpen(false)}>
          <Wordmark light={transparent} />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Main">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-[0.8rem] tracking-wide transition-colors",
                transparent ? "text-stone/80 hover:text-stone" : "text-basalt/70 hover:text-basalt",
                pathname.startsWith(item.href) && (transparent ? "text-stone" : "text-basalt"),
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={hotel.phoneHref}
            className={cn(
              "hidden items-center gap-2 text-[0.8rem] xl:flex",
              transparent ? "text-stone/80 hover:text-stone" : "text-basalt/70 hover:text-basalt",
            )}
          >
            <Phone className="size-3.5" /> {hotel.phone}
          </a>
          {!inBooking && (
            <Link
              href="/book"
              className={cn(
                "inline-flex h-10 items-center rounded-full px-4 text-[0.8rem] font-medium tracking-wide whitespace-nowrap transition-colors sm:px-5",
                transparent ? "bg-stone text-basalt hover:bg-white" : "bg-basalt text-stone hover:bg-basalt-soft",
              )}
            >
              <span className="sm:hidden">Book</span>
              <span className="hidden sm:inline">Book your stay</span>
            </Link>
          )}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className={cn("rounded-full p-2 lg:hidden", transparent ? "text-stone" : "text-basalt")}
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-sm bg-stone p-8">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <Wordmark />
              <nav className="mt-12 flex flex-col gap-5" aria-label="Mobile">
                {[{ href: "/", label: "Home" }, ...nav].map((item) => (
                  <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="font-serif text-3xl text-basalt">
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto space-y-2 pt-12 text-sm text-basalt/70">
                <a href={hotel.phoneHref} className="block">{hotel.phone}</a>
                <a href={`mailto:${hotel.email}`} className="block">{hotel.email}</a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
