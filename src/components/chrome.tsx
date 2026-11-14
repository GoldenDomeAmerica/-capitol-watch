import Link from "next/link";
import { stateListLabel, STATES } from "@/lib/states";
import { SITE_NAME } from "@/lib/site";

export function Header({ path }: { path: string | null }) {
  const active = STATES.find((state) => path?.startsWith(`/${state.slug}`)) ?? null;
  const links = active
    ? [
        { href: `/${active.slug}/bills`, label: "Bills" },
        { href: `/${active.slug}/topics/taxes`, label: "Topics" },
        { href: `/${active.slug}/legislators`, label: "Legislators" },
        ...(active.scorecards ? [{ href: `/${active.slug}/scorecards`, label: "Scorecards" }] : []),
        ...(active.vetoes ? [{ href: `/${active.slug}/vetoes`, label: "Vetoes" }] : []),
        { href: "/submit", label: "Send a tip" },
      ]
    : [
        ...STATES.map((state) => ({ href: `/${state.slug}/bills`, label: state.name })),
        { href: "/submit", label: "Send a tip" },
      ];

  return (
    <header className="border-b border-line bg-paper">
      <div className="h-1 bg-crimson" />
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link href="/" className="group">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-crimson">
              {active ? active.name : stateListLabel()}
            </p>
            <p className="font-serif text-2xl leading-none text-navy group-hover:text-crimson">{SITE_NAME}</p>
          </Link>
          <nav aria-label="States" className="mt-2 flex gap-3 text-xs font-semibold uppercase tracking-wide">
            {STATES.map((state) => {
              const current = active?.slug === state.slug;
              return (
                <Link
                  key={state.slug}
                  href={`/${state.slug}/bills`}
                  aria-current={current ? "page" : undefined}
                  className={current ? "text-crimson" : "text-navy hover:text-crimson"}
                >
                  {state.name}
                </Link>
              );
            })}
          </nav>
        </div>
        <nav aria-label="Primary" className="flex flex-wrap gap-x-4 gap-y-1 text-sm font-semibold text-navy">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-crimson">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-12 border-t border-line bg-navy text-white">
      <div className="mx-auto grid max-w-5xl gap-6 px-4 py-8 text-sm sm:grid-cols-2">
        <div>
          <p className="font-serif text-lg">{SITE_NAME}</p>
          <p className="mt-2 text-white/80">
            A plain-English look at the {stateListLabel()} legislatures. Facts stay with the official record. Opinion is labeled.
          </p>
        </div>
        <div className="space-y-1 text-white/80">
          <p>
            <Link className="underline" href="/about">
              About and sources
            </Link>
            {" · "}
            <Link className="underline" href="/privacy">
              Privacy
            </Link>
            {" · "}
            <Link className="underline" href="/sponsor">
              Sponsor
            </Link>
          </p>
          <p>
            Georgia bill facts come from the{" "}
            <a className="underline" href="https://www.legis.ga.gov/">
              Georgia General Assembly
            </a>
            , compiled by{" "}
            <a className="underline" href="https://votega.org">
              VoteGA.org
            </a>{" "}
            (CC BY-SA 4.0). Pennsylvania facts come from the{" "}
            <a className="underline" href="https://www.palegis.us/">
              Pennsylvania General Assembly
            </a>{" "}
            and are public information provided as is. Arizona facts come from the{" "}
            <a className="underline" href="https://www.azleg.gov/">
              Arizona State Legislature
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}

export function StatusBanner({ children }: { children: React.ReactNode }) {
  return (
    <p className="border border-line bg-paper px-4 py-3 text-sm text-muted" role="status">
      {children}
    </p>
  );
}
