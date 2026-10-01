"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="container-x flex min-h-[70vh] flex-col items-start justify-center pt-28">
      <p className="eyebrow text-ember">Something went wrong</p>
      <h1 className="mt-4 text-5xl">We hit some turbulence</h1>
      <p className="mt-4 max-w-md text-muted-foreground">Please try again. If it keeps happening, call +354 644 7080 or email stay@flyershotel.com.</p>
      <button onClick={reset} className="mt-8 inline-flex h-11 items-center rounded-full bg-basalt px-6 text-sm text-stone">Try again</button>
    </section>
  );
}
