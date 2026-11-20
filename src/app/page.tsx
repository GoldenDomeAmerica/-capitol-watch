import Link from "next/link";
import { STATES } from "@/lib/states";

export default function HomePage() {
  return (
    <section aria-labelledby="states">
      <h1 id="states" className="sr-only">
        States
      </h1>
      <ul className="grid gap-3 sm:grid-cols-3">
        {STATES.map((state) => (
          <li key={state.slug}>
            <Link href={`/${state.slug}`} className="block h-full rounded-lg border border-line bg-paper p-4 hover:border-navy">
              <span className="font-semibold text-navy">{state.name}</span>
              <span className="mt-1 block text-sm text-muted">{state.blurb}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
