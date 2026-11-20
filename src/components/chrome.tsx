import Link from "next/link";
import { stateListLabel, STATES, type StateSection } from "@/lib/states";
import { SITE_NAME } from "@/lib/site";

export function Header({ path }: { path: string | null }) {
  const links = [
    ...STATES.map((state) => ({
      href: `/${state.slug}`,
      label: state.name,
      current: path === `/${state.slug}` || path?.startsWith(`/${state.slug}/`) === true,
    })),
    { href: "/hot-topics", label: "Hot Topics", current: path === "/hot-topics" || path?.startsWith("/hot-topics/") === true },
    { href: "/contact", label: "Contact", current: path === "/contact" },
  ];

  return (
    <header className="border-b border-line bg-paper">
      <div className="h-1 bg-crimson" />
      <div className="mx-auto max-w-5xl px-4 py-4">
        <Link href="/" className="group inline-block">
          <p className="font-serif text-2xl leading-none text-navy group-hover:text-crimson">{SITE_NAME}</p>
        </Link>
        <nav aria-label="Primary" className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm font-semibold text-navy">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={path === link.href ? "page" : undefined}
              className={link.current ? "text-crimson" : "hover:text-crimson"}
            >
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
