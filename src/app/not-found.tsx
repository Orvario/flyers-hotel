import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-x flex min-h-[70vh] flex-col items-start justify-center pt-28">
      <p className="eyebrow text-ember">404</p>
      <h1 className="mt-4 text-5xl">This page has flown</h1>
      <p className="mt-4 max-w-md text-muted-foreground">The page you’re looking for doesn’t exist. Our rooms, however, are right where we left them.</p>
      <div className="mt-8 flex gap-4">
        <Link href="/" className="inline-flex h-11 items-center rounded-full bg-basalt px-6 text-sm text-stone">Home</Link>
        <Link href="/book" className="inline-flex h-11 items-center rounded-full border border-border px-6 text-sm">Book your stay</Link>
      </div>
    </section>
  );
}
