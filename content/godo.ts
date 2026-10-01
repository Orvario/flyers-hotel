export const godo = {
  propId: 298423,
  bookingUrl: "https://property.godo.is/booking.php",
  priceEndpoint: "https://property.godo.is/api/ajax/getroomprice.php",
  availabilityEndpoint: "https://api.beds24.com/json/getAvailabilities",
  currency: "EUR",
  lang: "en",
  maxGuestsPerRoom: 4,
} as const;

export type RateId = 1 | 2 | 3;

export type RatePlan = {
  id: RateId;
  godoName: string;
  name: string;
  short: string;
  refundable: boolean;
  includesPackage: boolean;
  description: string;
};

export const ratePlans: RatePlan[] = [
  {
    id: 1,
    godoName: "Standard Rate - Einungis Gisting",
    name: "Flexible rate",
    short: "Room only · free cancellation up to 48 h",
    refundable: true,
    includesPackage: false,
    description: "Room only. Cancel free of charge up to 48 hours before arrival.",
  },
  {
    id: 2,
    godoName: "Non Refundable - Einungis Gisting",
    name: "Room only",
    short: "Non-refundable · best room-only price",
    refundable: false,
    includesPackage: false,
    description: "Room only, at our lowest non-refundable price.",
  },
  {
    id: 3,
    godoName: "Non Refundable með Ferðapakka (Gisting, Bílageymsla og Akstur til og frá flugvelli)",
    name: "Travel package",
    short: "Room, car storage & airport transfers",
    refundable: false,
    includesPackage: true,
    description: "Your room, secure car storage while you travel, and transfers to and from Keflavík Airport. Non-refundable.",
  },
];

export const getRatePlan = (id: number) => ratePlans.find((r) => r.id === id);
