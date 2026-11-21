import Link from "next/link";
import { SignupForm } from "@/components/signup-form";
import { liveStates } from "@/lib/launch";

export default function HomePage() {
  const states = liveStates();
  return (
    <div className="space-y-6">
      <section aria-labelledby="states">
        <h1 id="states" className="sr-only">
          States
        </h1>
        <ul className="grid gap-3 sm:grid-cols-3">
          {states.map((state) => (
            <li key={state.slug}>
              <Link href={`/${state.slug}`} className="block h-full rounded-lg border border-line bg-paper p-4 hover:border-navy">
                <span className="font-semibold text-navy">{state.name}</span>
                <span className="mt-1 block text-sm text-muted">{state.blurb}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <SignupForm states={states} />
    </div>
  );
}
