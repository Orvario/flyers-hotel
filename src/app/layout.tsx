import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { hotel } from "@content/hotel";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const body = Manrope({
  variable: "--font-body",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://flyershotel.com"),
  title: {
    default: "Flyers Hotel – Airport Hotel in Keflavík, Iceland",
    template: "%s · Flyers Hotel Keflavík",
  },
  description: hotel.shortPitch,
  openGraph: {
    title: "Flyers Hotel – Airport Hotel in Keflavík",
    description: hotel.shortPitch,
    images: ["/images/hero.jpg"],
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#121a22",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
