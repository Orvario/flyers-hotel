"use client";

import { useSyncExternalStore } from "react";
import type { PackageDetails } from "@/lib/booking";

export type Extras = PackageDetails & {
  childSeat?: "none" | "seat" | "booster";
  guestAges?: string;
  crib?: boolean;
};

const KEY = "flyers.booking.extras";
const EMPTY: Extras = {};
const listeners = new Set<() => void>();
let cache: { raw: string | null; value: Extras } = { raw: null, value: EMPTY };

function getSnapshot(): Extras {
  let raw: string | null = null;
  try {
    raw = sessionStorage.getItem(KEY);
  } catch {}
  if (raw !== cache.raw) {
    let value = EMPTY;
    try {
      value = raw ? JSON.parse(raw) : EMPTY;
    } catch {}
    cache = { raw, value };
  }
  return cache.value;
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useExtras() {
  const extras = useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);
  const update = (patch: Partial<Extras>) => {
    try {
      sessionStorage.setItem(KEY, JSON.stringify({ ...getSnapshot(), ...patch }));
    } catch {}
    listeners.forEach((l) => l());
  };
  return { extras, update };
}

export const childSeatLabels: Record<NonNullable<Extras["childSeat"]>, { label: string; godo: string }> = {
  none: { label: "No child seat", godo: "Enginn" },
  seat: { label: "Child car seat", godo: "Bílstóll" },
  booster: { label: "Booster seat", godo: "Bílstóll - Kollur" },
};
