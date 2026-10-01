import type { PolicySection } from "@content/policies";
import { PageHero } from "./sections";

export function PolicyPage({ eyebrow, title, sections }: { eyebrow: string; title: string; sections: PolicySection[] }) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} />
      <section className="container-x max-w-3xl space-y-14 py-20">
        {sections.map((s) => (
          <div key={s.heading}>
            <h2 className="text-3xl">{s.heading}</h2>
            <ul className="mt-5 space-y-3 leading-relaxed text-muted-foreground">
              {s.items.map((i) => <li key={i}>{i}</li>)}
            </ul>
          </div>
        ))}
        <p className="border-t border-border pt-8 text-sm text-muted-foreground">Questions? Email stay@flyershotel.com.</p>
      </section>
    </>
  );
}
