import type { Metadata } from "next";
import { PolicyPage } from "@/components/site/policy";
import { terms } from "@content/policies";

export const metadata: Metadata = { title: "Terms & conditions" };

export default function TermsPage() {
  return <PolicyPage eyebrow="Terms & conditions" title="Booking and hotel terms" sections={terms} />;
}
