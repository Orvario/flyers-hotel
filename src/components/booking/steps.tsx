import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const bookingSteps = ["Dates", "Room & rate", "Extras", "Secure payment"] as const;

export function StepIndicator({ current }: { current: number }) {
  return (
    <ol className="flex w-full items-center gap-2 overflow-x-auto pb-1 text-xs sm:gap-3" aria-label="Booking progress">
      {bookingSteps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={label} className="flex shrink-0 items-center gap-2 sm:gap-3" aria-current={active ? "step" : undefined}>
            <span
              className={cn(
                "grid size-6 place-items-center rounded-full border text-[0.7rem] tabular-nums transition-colors",
                done && "border-basalt bg-basalt text-stone",
                active && "border-ember bg-ember text-white",
                !done && !active && "border-border text-muted-foreground",
              )}
            >
              {done ? <Check className="size-3" /> : i + 1}
            </span>
            <span className={cn("tracking-wide", active ? "font-medium text-basalt" : "text-muted-foreground", !active && "hidden sm:inline")}>
              {label}
            </span>
            {i < bookingSteps.length - 1 && <span className="h-px w-4 bg-border sm:w-8" aria-hidden />}
          </li>
        );
      })}
    </ol>
  );
}
