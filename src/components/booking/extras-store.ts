"use client";

import { useState } from "react";
import type { PackageDetails } from "@/lib/booking";

export type Extras = PackageDetails & {
  childSeat?: "none" | "seat" | "booster";
  guestAges?: string;
  crib?: boolean;
};

const KEY = "flyers.booking.extras";

function read(): Extras {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(sessionStorage.getItem(KEY) ?? "{}");
  } catch {
    return {};
  }
}

export function useExtras() {
  const [extras, setExtras] = useState<Extras>(read);
  const update = (patch: Partial<Extras>) =>
    setExtras((prev) => {
      const next = { ...prev, ...patch };
      try {
        sessionStorage.setItem(KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  return { extras, update };
}

export const childSeatLabels: Record<NonNullable<Extras["childSeat"]>, { label: string; godo: string }> = {
  none: { label: "No child seat", godo: "Enginn" },
  seat: { label: "Child car seat", godo: "Bílstóll" },
  booster: { label: "Booster seat", godo: "Bílstóll - Kollur" },
};
