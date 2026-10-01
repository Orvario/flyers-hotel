import type { Metadata } from "next";
import { BookCta, FaqList, PageHero } from "@/components/site/sections";
import { faq } from "@content/faq";

export const metadata: Metadata = { title: "FAQ", description: "Check-in times, the travel package, cancellation, parking and more." };

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return (
    <>
      <PageHero eyebrow="FAQ" title="Good to know before you fly" />
      <section className="container-x max-w-4xl py-20">
        <FaqList />
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BookCta />
    </>
  );
}
