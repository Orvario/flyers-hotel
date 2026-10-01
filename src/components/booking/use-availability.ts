"use client";

import { useCallback, useEffect, useState } from "react";
import type { AvailabilityResponse, StayQuery } from "@/lib/booking";

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; data: AvailabilityResponse };

type Result = { key: string } & ({ ok: true; data: AvailabilityResponse } | { ok: false; message: string });

export function useAvailability(stay: StayQuery | null) {
  const [nonce, setNonce] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const stayKey = stay ? `${stay.checkin}|${stay.checkout}|${stay.adults}|${stay.children}` : "";
  const requestKey = stayKey ? `${stayKey}#${nonce}` : "";

  useEffect(() => {
    if (!requestKey) return;
    const [checkin, checkout, adults, children] = requestKey.split("#")[0].split("|");
    const ctrl = new AbortController();
    fetch(`/api/availability?${new URLSearchParams({ checkin, checkout, adults, children })}`, { signal: ctrl.signal })
      .then(async (res) => {
        const body = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(body.error ?? "Something went wrong while checking availability.");
        setResult({ key: requestKey, ok: true, data: body as AvailabilityResponse });
      })
      .catch((err: Error) => {
        if (ctrl.signal.aborted) return;
        setResult({ key: requestKey, ok: false, message: err.message || "We couldn’t reach our booking system." });
      });
    return () => ctrl.abort();
  }, [requestKey]);

  let state: State;
  if (!requestKey) state = { status: "idle" };
  else if (!result || result.key !== requestKey) state = { status: "loading" };
  else state = result.ok ? { status: "ready", data: result.data } : { status: "error", message: result.message };

  const retry = useCallback(() => setNonce((n) => n + 1), []);
  return { state, retry };
}
