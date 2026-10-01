"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Minus, Plus, Users } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { parseISODate, toISODate } from "@/lib/booking";
import { godo } from "@content/godo";

type Props = {
  variant?: "hero" | "panel";
  initial?: { checkin?: string; checkout?: string; adults?: number; children?: number };
  extraParams?: Record<string, string>;
  submitLabel?: string;
  stacked?: boolean;
  onSubmit?: (v: { checkin: string; checkout: string; adults: number; children: number }) => void;
};

export function StayPicker({ variant = "panel", initial, extraParams, submitLabel = "Check availability", stacked, onSubmit }: Props) {
  const router = useRouter();
  const [range, setRange] = useState<DateRange | undefined>(
    initial?.checkin && initial?.checkout
      ? { from: parseISODate(initial.checkin), to: parseISODate(initial.checkout) }
      : undefined,
  );
  const [adults, setAdults] = useState(initial?.adults ?? 2);
  const [children, setChildren] = useState(initial?.children ?? 0);
  const [dateOpen, setDateOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const submit = () => {
    if (!range?.from || !range?.to) {
      setError("Choose your arrival and departure dates.");
      setDateOpen(true);
      return;
    }
    if (range.to <= range.from) {
      setError("Departure must be at least one night after arrival.");
      return;
    }
    setError(null);
    const v = { checkin: toISODate(range.from), checkout: toISODate(range.to), adults, children };
    if (onSubmit) return onSubmit(v);
    const p = new URLSearchParams({ ...extraParams, checkin: v.checkin, checkout: v.checkout, adults: String(adults), children: String(children) });
    router.push(`/book?${p.toString()}`);
  };

  const hero = variant === "hero";
  const total = adults + children;
  const fieldCls = cn(
    "flex w-full flex-col items-start gap-1 px-5 py-3 text-left transition-colors",
    hero ? "hover:bg-white/60" : "hover:bg-muted",
  );

  return (
    <div className="w-full">
      <div
        className={cn(
          "grid w-full overflow-hidden rounded-2xl",
          !stacked && "md:grid-cols-[1.4fr_1fr_auto] md:rounded-full",
          hero ? "bg-stone/95 shadow-2xl shadow-black/30 backdrop-blur" : "border border-border bg-card",
        )}
      >
        <Popover open={dateOpen} onOpenChange={setDateOpen}>
          <PopoverTrigger className={cn(fieldCls, !stacked && "md:rounded-l-full md:pl-7")}>
            <span className="eyebrow text-basalt/50">Arrive — Depart</span>
            <span className="flex items-center gap-2 text-[0.95rem] text-basalt">
              <CalendarDays className="size-4 text-ember" />
              {range?.from ? (
                <>
                  {format(range.from, "EEE d MMM")} <span className="text-basalt/40">→</span>{" "}
                  {range.to ? format(range.to, "EEE d MMM") : <span className="text-basalt/50">Select departure</span>}
                </>
              ) : (
                <span className="text-basalt/60">Select dates</span>
              )}
            </span>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              numberOfMonths={typeof window !== "undefined" && window.innerWidth < 768 ? 1 : 2}
              selected={range}
              onSelect={(r) => {
                setRange(r);
                setError(null);
                if (r?.from && r?.to && r.to > r.from) setDateOpen(false);
              }}
              disabled={{ before: today }}
              defaultMonth={range?.from ?? today}
              className="p-3 [--cell-size:--spacing(9)]"
            />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger className={cn(fieldCls, "border-t border-basalt/10", !stacked && "md:border-t-0 md:border-l")}>
            <span className="eyebrow text-basalt/50">Guests</span>
            <span className="flex items-center gap-2 text-[0.95rem] text-basalt">
              <Users className="size-4 text-ember" />
              {adults} adult{adults === 1 ? "" : "s"}
              {children > 0 && `, ${children} child${children === 1 ? "" : "ren"}`}
            </span>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-5" align="start">
            <Counter label="Adults" value={adults} min={1} max={godo.maxGuestsPerRoom - children} onChange={setAdults} />
            <Counter label="Children" hint="Under 12" value={children} min={0} max={godo.maxGuestsPerRoom - adults} onChange={setChildren} />
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              Rooms sleep up to {godo.maxGuestsPerRoom}. For {total >= godo.maxGuestsPerRoom ? "more guests" : "groups"} or multiple rooms, email us and we’ll arrange it.
            </p>
          </PopoverContent>
        </Popover>

        <div className={cn("p-2", !hero && !stacked && "md:border-l md:border-border")}>
          <button
            type="button"
            onClick={submit}
            className={cn("h-full min-h-12 w-full rounded-xl bg-basalt px-7 text-sm font-medium tracking-wide text-stone transition-colors hover:bg-basalt-soft", !stacked && "md:rounded-full")}
          >
            {submitLabel}
          </button>
        </div>
      </div>
      {error && (
        <p role="alert" className={cn("mt-3 text-sm", hero ? "text-stone" : "text-destructive")}>
          {error}
        </p>
      )}
    </div>
  );
}

function Counter({ label, hint, value, min, max, onChange }: { label: string; hint?: string; value: number; min: number; max: number; onChange: (n: number) => void }) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="text-sm font-medium">{label}</p>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </div>
      <div className="flex items-center gap-3">
        <button type="button" aria-label={`Fewer ${label.toLowerCase()}`} disabled={value <= min} onClick={() => onChange(value - 1)} className="grid size-8 place-items-center rounded-full border border-border disabled:opacity-30">
          <Minus className="size-3.5" />
        </button>
        <span className="w-4 text-center text-sm tabular-nums">{value}</span>
        <button type="button" aria-label={`More ${label.toLowerCase()}`} disabled={value >= max} onClick={() => onChange(value + 1)} className="grid size-8 place-items-center rounded-full border border-border disabled:opacity-30">
          <Plus className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
