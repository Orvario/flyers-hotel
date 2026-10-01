# Flyers Hotel – booking website

A new website for [Flyers Hotel](https://flyershotel.com/), an airport hotel in Reykjanesbær, five minutes from Keflavík Airport (KEF). It replaces the WordPress site and keeps guests on-brand through the whole booking journey. Only the final payment step is Godo's, and it is embedded in the page.

Built with Next.js 16 (App Router), TypeScript, Tailwind CSS v4 and shadcn/ui (Base UI).

## Run locally

```bash
npm install
npm run dev        # http://localhost:4317
```

Production:

```bash
npm run build
npm start          # http://localhost:4317
```

No API keys or environment variables are needed. Live prices come from Godo's public endpoints (see below).

## How booking works

1. **Dates and guests**: from the hero, a room page, or `/book`.
2. **Room and rate**: `/api/availability` asks Godo for live prices for every room and rate. Prices are never hardcoded, so they always match what Godo charges.
3. **Extras**: the travel package (room, car storage and airport transfers) is a Godo rate, so adding it switches the rate and the live total updates. Transfer details are collected here and stored in `sessionStorage`.
4. **Review**: a full summary with the live total.
5. **Secure payment**: `/book/checkout` embeds Godo's guest-details and payment step in an iframe. The URL is prefilled with room, rate, dates, guests, language and currency, and the guest's transfer details sit beside the form with copy buttons. A "new tab" fallback is shown if the iframe doesn't load.

Godo integration points (all in `src/lib`):

| What | Where |
| --- | --- |
| Live price per room and rate | `godo-server.ts`: `POST property.godo.is/api/ajax/getroomprice.php` (the same call Godo's own page makes) |
| Rooms left | `godo-server.ts`: Beds24 `getAvailabilities` (public JSON API, no key) |
| Deep link to the payment step | `booking.ts`: `buildGodoCheckoutUrl()` uses `booking.php?propid=298423&checkin&checkout&numadult&numchild&lang&cur&br{rate}-{room}=Book` |

Room IDs and rate IDs are mapped in `content/rooms.ts` and `content/godo.ts`.

## Content

All copy and images were scraped from flyershotel.com:

- `content/hotel.ts`: contact details, about text, facilities, house rules, activities, travel package, shuttle and gift card.
- `content/rooms.ts`: the six room types, mapped to Godo room IDs.
- `content/policies.ts`: terms and privacy. `content/faq.ts`: FAQ built from the published terms.
- `content/images.json`: a manifest of every image, with its source URL.
- `content/raw/`: plain-text dumps of every scraped page (EN and IS) and Godo's booking page, kept for reference.
- `public/images/site/`: the scraped photos, re-encoded with a 2000 px maximum edge. `public/images/hero.jpg` is the newly generated hero image.

## Project structure

```
content/              structured content (single source of truth)
src/app/              routes: /, /rooms, /rooms/[slug], /book, /book/checkout, /travel-package, ...
src/app/api/availability   live availability and prices (server-side proxy to Godo)
src/components/booking     stay picker, booking flow, checkout embed
src/components/site        header, footer, shared sections
```
