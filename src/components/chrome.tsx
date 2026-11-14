import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

const LINKS = [
  { href: "/georgia/bills", label: "Bills" },
  { href: "/georgia/topics/taxes", label: "Topics" },
  { href: "/georgia/legislators", label: "Legislators" },
  { href: "/georgia/scorecards", label: "Scorecards" },
  { href: "/submit", label: "Send a tip" },
];

export function Header() {
  return (
    <header className="border-b border-line bg-paper">
      <div className="h-1 bg-crimson" />
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-end sm:justify-between">
        <Link href="/" className="group">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-crimson">Georgia</p>
          <p className="font-serif text-2xl leading-none text-navy group-hover:text-crimson">{SITE_NAME}</p>
        </Link>
        <nav aria-label="Primary" className="flex flex-wrap gap-x-4 gap-y-1 text-sm font-semibold text-navy">
          {LINKS.map((link) => (
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
            A plain-English look at the Georgia General Assembly. Facts stay with the official record. Opinion is labeled.
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
            Bill facts come from the{" "}
            <a className="underline" href="https://www.legis.ga.gov/">
              Georgia General Assembly
            </a>
            . The compiled roster and roll calls are adapted from{" "}
            <a className="underline" href="https://votega.org">
              VoteGA.org
            </a>{" "}
            (CC BY-SA 4.0).
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
