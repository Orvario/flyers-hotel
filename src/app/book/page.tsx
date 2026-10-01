import type { Metadata } from "next";
import { Suspense } from "react";
import { BookingFlow } from "@/components/booking/booking-flow";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Book your stay",
  description: "Live availability and prices for Flyers Hotel, Keflavík. Choose your room, add car storage and airport transfers, and pay securely.",
};

export default function BookPage() {
  return (
    <Suspense fallback={<FlowFallback />}>
      <BookingFlow />
    </Suspense>
  );
}

function FlowFallback() {
  return (
    <div className="container-x space-y-6 pt-32 pb-24">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-12 w-80" />
      <Skeleton className="h-20 w-full rounded-full" />
    </div>
  );
}
