import Link from "next/link";
import { stateListLabel, STATES, type StateSection } from "@/lib/states";
import { SITE_NAME } from "@/lib/site";

export function Header({ path }: { path: string | null }) {
  const active = STATES.find((state) => path?.startsWith(`/${state.slug}`)) ?? null;
  const links = active
    ? [
        { href: `/${active.slug}/bills`, label: "Bills" },
        { href: "/hot-topics", label: "Hot Topics" },
        { href: `/${active.slug}/legislators`, label: "Legislators" },
        ...(active.scorecards ? [{ href: `/${active.slug}/scorecards`, label: "Scorecards" }] : []),
        ...(active.vetoes ? [{ href: `/${active.slug}/vetoes`, label: "Vetoes" }] : []),
        { href: "/submit", label: "Send a tip" },
        { href: "/contact", label: "Contact" },
      ]
    : [
        ...STATES.map((state) => ({ href: `/${state.slug}`, label: state.name })),
        { href: "/hot-topics", label: "Hot Topics" },
        { href: "/submit", label: "Send a tip" },
        { href: "/contact", label: "Contact" },
      ];

  return (
    <header className="border-b border-line bg-paper">
      <div className="h-1 bg-crimson" />
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link href="/" className="group">
            {active ? (
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-crimson">{active.name}</p>
            ) : null}
            <p className="font-serif text-2xl leading-none text-navy group-hover:text-crimson">{SITE_NAME}</p>
          </Link>
          <nav aria-label="States" className="mt-2 flex gap-3 text-xs font-semibold uppercase tracking-wide">
            {STATES.map((state) => {
              const current = active?.slug === state.slug;
              const onLanding = path === `/${state.slug}`;
              return (
                <Link
                  key={state.slug}
                  href={`/${state.slug}`}
                  aria-current={onLanding ? "page" : undefined}
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

function sourceLine(state: StateSection, linkClass: string) {
  const body = (
    <a className={linkClass} href={state.officialSite}>
      {state.legislatureName}
    </a>
  );
  if (state.creditStyle === "compiled" && state.compiler) {
    return (
      <>
        {state.name} bill, vote, and legislator data come from the {body}, compiled by{" "}
        <a className={linkClass} href={state.compiler.href}>
          {state.compiler.label}
        </a>{" "}
        {state.compiler.note}.
      </>
    );
  }
  if (state.creditStyle === "public-as-is") {
    return (
      <>
        {state.name} bill, vote, and legislator data come from the {body}&apos;s {state.sourceDetail}, and are public
        information provided as is.
      </>
    );
  }
  return (
    <>
      {state.name} bill, vote, and legislator data come from the {body}&apos;s {state.sourceDetail}.
    </>
  );
}

export function SiteTrust({ variant }: { variant: "page" | "footer" }) {
  const linkClass = variant === "footer" ? "underline" : "underline hover:text-crimson";
  const textClass = variant === "footer" ? "space-y-2 text-white/80" : "space-y-3 text-sm leading-relaxed";
  return (
    <div className={textClass}>
      <p>Owned and operated by American Capitol Watch.</p>
      <p>Covering state legislatures across the United States, starting with {stateListLabel()}.</p>
      <p>We reply within 2 business days (Mon–Fri).</p>
      <p>
        {variant === "page" ? (
          "Use the contact form on this page to reach American Capitol Watch."
        ) : (
          <>
            Reach us through the{" "}
            <Link className={linkClass} href="/contact">
              contact form
            </Link>
            .
          </>
        )}
      </p>
      <p>
        Edited by the American Capitol Watch editorial team. Bill, vote, and legislator data come from official state
        legislature records. {STATES.map((state) => <span key={state.slug}>{sourceLine(state, linkClass)} </span>)}
      </p>
      <p>
        <Link className={linkClass} href="/contact?topic=correction">
          Report a correction
        </Link>
      </p>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="mt-12 border-t border-line bg-navy text-white">
      <div className="mx-auto grid max-w-5xl gap-6 px-4 py-8 text-sm sm:grid-cols-2">
        <div>
          <p className="font-serif text-lg">{SITE_NAME}</p>
          <p className="mt-2 text-white/80">
            A plain-English look at the {stateListLabel()} legislatures. Facts stay with the official record. Opinion is
            labeled.
          </p>
        </div>
        <div className="space-y-2">
          <p className="text-white/80">
            <Link className="underline" href="/contact">
              Contact
            </Link>
            {" · "}
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
          <SiteTrust variant="footer" />
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
