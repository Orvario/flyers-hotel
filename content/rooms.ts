export type Room = {
  slug: string;
  godoRoomId: number;
  name: string;
  godoName: string;
  shortName: string;
  sizeM2: number;
  maxGuests: number;
  bathroom: "private" | "shared";
  beds: string;
  headline: string;
  description: string;
  amenities: string[];
  images: string[];
  legacyUrl: string;
};

const baseAmenities = ["Hardwood floors", "Heating", "Flat-screen TV with cable", "Vanity & wash basin", "Free high-speed Wi-Fi", "Fresh towels", "Reading light"];

export const rooms: Room[] = [
  {
    slug: "double-private-bathroom",
    godoRoomId: 623239,
    name: "Double Room with Private Bathroom",
    godoName: "Flyers Hotel - Double Bed with Private Bathroom",
    shortName: "Double · Private bath",
    sizeM2: 18,
    maxGuests: 2,
    bathroom: "private",
    beds: "Double bed or two single beds",
    headline: "More privacy for a relaxing stay near the airport.",
    description:
      "A bright, spacious room ideal for couples or solo travellers who appreciate having their own bathroom. Enjoy extra comfort and privacy in our 18 m² Double Room with a private bathroom. Perfect for couples or solo travellers who value their own space, the room includes a comfortable double bed, private bathroom with shower, wash basin, and fresh towels. Amenities include a flat-screen TV with cable channels, reading light, and complimentary high-speed Wi-Fi. Bright, clean, and tastefully furnished, this room is designed for a relaxing stay just minutes from Keflavík Airport. Whether you’re catching an early flight or arriving late at night, you’ll find the comfort you need here.",
    amenities: ["Private bathroom with shower", ...baseAmenities],
    images: ["/images/site/room-22-1.jpg", "/images/site/room-22-3.jpg", "/images/site/room-22-5.jpg", "/images/site/room-22-4.jpg", "/images/site/room-22-2.jpg"],
    legacyUrl: "https://flyershotel.com/accommodation/deluxe-single-room/",
  },
  {
    slug: "double-shared-bathroom",
    godoRoomId: 623241,
    name: "Double Room with Shared Bathroom",
    godoName: "Flyers Hotel - Double Bed with Shared Bathroom",
    shortName: "Double · Shared bath",
    sizeM2: 12,
    maxGuests: 2,
    bathroom: "shared",
    beds: "One double bed or two single beds",
    headline: "Comfortable and budget-friendly, just minutes from Keflavík Airport.",
    description:
      "Perfect for couples or travel companions looking for a great value stay close to the terminal. Bright, comfortable, and practical, this 12 m² Double or Twin Room is perfect for couples or travel companions seeking great value near Keflavík Airport. The room features either one double bed or two single beds, freshly made with soft linens. A wash basin, flat-screen TV with cable channels, reading light, and complimentary high-speed Wi-Fi ensure your comfort and convenience. Shared bathrooms, maintained to a high standard, are located just steps away. Ideal for short stays, late arrivals, or early departures, this room offers everything you need to rest and recharge before continuing your journey.",
    amenities: ["Shared bathrooms steps away", ...baseAmenities],
    images: ["/images/site/room-15-5.jpg", "/images/site/room-15-3.jpg", "/images/site/room-15-2.jpg", "/images/site/room-15-4.jpg", "/images/site/room-15-1.jpg"],
    legacyUrl: "https://flyershotel.com/accommodation/delux-double-room/",
  },
  {
    slug: "triple-shared-bathroom",
    godoRoomId: 623242,
    name: "Triple Room with Shared Bathroom",
    godoName: "Flyers Hotel - Three Beds with Shared Bathroom",
    shortName: "Triple · Shared bath",
    sizeM2: 18,
    maxGuests: 3,
    bathroom: "shared",
    beds: "Three single beds",
    headline: "Spacious and affordable, perfect for friends, family, or small groups.",
    description:
      "Ideal for travellers who want to share a room without sacrificing comfort. Spacious and budget-friendly, our 18 m² Triple Room with Shared Bathroom is ideal for friends or small groups travelling together. The room features three comfortable single beds, freshly made with soft bedding. You’ll have your own wash basin in the room, plus a flat-screen TV with cable channels, reading light, and complimentary high-speed Wi-Fi. Well-maintained shared bathrooms are conveniently located nearby. This room offers a practical solution for those seeking affordable, quality accommodation close to the airport without compromising on cleanliness or comfort.",
    amenities: ["Shared bathrooms nearby", ...baseAmenities],
    images: ["/images/site/img-9026.jpg", "/images/site/room-22-1.jpg"],
    legacyUrl: "https://flyershotel.com/accommodation/standard-single-room/",
  },
  {
    slug: "family-three-private-bathroom",
    godoRoomId: 623243,
    name: "Family Room with Three Beds & Private Bathroom",
    godoName: "Flyers Hotel - Three Beds with Private Bathroom",
    shortName: "Family of three · Private bath",
    sizeM2: 18,
    maxGuests: 3,
    bathroom: "private",
    beds: "Three single beds",
    headline: "Privacy and comfort for smaller families or groups.",
    description:
      "Enjoy your own bathroom while staying close to the airport. Our 18 m² Family Room with Three Beds & Private Bathroom combines comfort, privacy, and convenience. Suitable for small families or groups of three, the room includes three comfortable single beds, an en-suite bathroom with shower, wash basin, fresh towels, flat-screen TV with cable channels, reading lights, and free high-speed Wi-Fi. Bright and well-maintained, it’s the perfect choice for those wanting more privacy while staying just minutes from Keflavík Airport. A great option for travellers looking for a hassle-free stay close to the terminal.",
    amenities: ["En-suite bathroom with shower", ...baseAmenities],
    images: ["/images/site/img-9063.jpg", "/images/site/img-9176.jpg"],
    legacyUrl: "https://flyershotel.com/accommodation/family-room-with-three-beds-private-bathroom-18-m%c2%b2/",
  },
  {
    slug: "family-four-shared-bathroom",
    godoRoomId: 623244,
    name: "Family Room with Four Beds & Shared Bathroom",
    godoName: "Flyers Hotel - Four Beds with Shared Bathroom",
    shortName: "Family of four · Shared bath",
    sizeM2: 22,
    maxGuests: 4,
    bathroom: "shared",
    beds: "Four single beds",
    headline: "Great value and space for families or larger groups.",
    description:
      "A practical option for those travelling together, with easy access to shared facilities. Designed with families in mind, our 22 m² Family Room with Four Beds offers space, comfort, and great value. Featuring four comfortable single beds, a wash basin, flat-screen TV with cable channels, reading lights, fresh towels, and complimentary high-speed Wi-Fi, it’s ideal for families or groups on the move. The shared bathrooms are conveniently located and kept spotless. This bright and airy room provides the perfect base for exploring the Reykjanes Peninsula or for a restful night before catching your flight.",
    amenities: ["Shared bathrooms nearby", ...baseAmenities],
    images: ["/images/site/img-9176.jpg", "/images/site/img-9173.jpg", "/images/site/img-9182.jpg", "/images/site/img-9174.jpg"],
    legacyUrl: "https://flyershotel.com/accommodation/family-room-with-four-beds-shared-bathroom-22-m%c2%b2/",
  },
  {
    slug: "single-shared-bathroom",
    godoRoomId: 623240,
    name: "Single Room with Shared Bathroom",
    godoName: "Flyers Hotel - Single Bed with Shared Bathroom",
    shortName: "Single · Shared bath",
    sizeM2: 10,
    maxGuests: 1,
    bathroom: "shared",
    beds: "One single bed",
    headline: "Cosy and quiet – the perfect choice for solo travellers.",
    description:
      "An affordable and comfortable stay, just a short distance from the terminal. Perfect for solo travellers, our 10 m² Single Room offers a quiet and cosy space to relax before or after your journey. The room includes a comfortable single bed, wash basin, reading light, flat-screen TV with cable channels, fresh towels, and free high-speed Wi-Fi. Shared bathrooms are close by and maintained to a high standard. Bright and spotlessly clean, this room is an excellent choice for travellers seeking affordable accommodation near Keflavík Airport, whether for a quick stopover or an early morning departure.",
    amenities: ["Shared bathrooms close by", ...baseAmenities],
    images: ["/images/site/room-17-2.jpg", "/images/site/room-17-1.jpg", "/images/site/room-17-3.jpg", "/images/site/room-17-6.jpg", "/images/site/room-17-4.jpg", "/images/site/room-17-5.jpg"],
    legacyUrl: "https://flyershotel.com/accommodation/single-room-with-shared-bathroom-10-m%c2%b2/",
  },
];

export const getRoom = (slug: string) => rooms.find((r) => r.slug === slug);
export const getRoomByGodoId = (id: number) => rooms.find((r) => r.godoRoomId === id);
