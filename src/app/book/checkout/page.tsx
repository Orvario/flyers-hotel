import type { Metadata } from "next";
import { Suspense } from "react";
import { Checkout } from "@/components/booking/checkout";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Secure payment",
  robots: { index: false },
};

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="container-x space-y-6 pt-32 pb-24">
          <Skeleton className="h-12 w-72" />
          <Skeleton className="h-[600px] w-full rounded-2xl" />
        </div>
      }
    >
      <Checkout />
    </Suspense>
  );
}
