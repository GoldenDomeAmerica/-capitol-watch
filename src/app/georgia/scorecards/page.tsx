import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conservative scorecards",
  description: "Links to public Georgia legislative scorecards from the Georgia Republican Assembly, Faith & Freedom Coalition, and the Freedom Index.",
};

const CARDS = [
  {
    name: "Georgia Republican Assembly",
    href: "https://georgiara.com/2025/06/23/2025-gra-legislative-scorecards-are-now-available/",
    extra: [
      { href: "https://georgiara.com/gra-voting-scorecard-2025-legislative-session/", label: "2025 scores" },
      { href: "https://georgiara.com/gra-voting-scorecard-2026-legislative-session/", label: "2026 scores" },
    ],
    body: "GRA says it has published legislative scorecards since 2017 and that the 2025 edition judged votes on dozens of bills using long-standing Republican themes: smaller government, gun rights, taxes, life, and parental rights. They also describe a sponsorship credit separate from the vote score. Read their method and the grades on their site.",
  },
  {
    name: "Georgia Faith & Freedom Coalition",
    href: "https://www.georgiaffc.com/2025scorecard",
    extra: [{ href: "https://www.georgiaffc.com/", label: "georgiaffc.com" }],
    body: "The Georgia Faith & Freedom Coalition publishes a legislative scorecard for people of faith. Their own description of the work covers family, life, marriage, taxes on families and small business, and the size of government. Open their 2025 scorecard for the grades. We do not copy them here.",
  },
  {
    name: "Freedom Index",
    href: "https://freedomindex.us/ga/reports/",
    extra: [],
    body: "The Freedom Index publishes Georgia vote reports and ranks representatives and senators on what it calls fidelity to constitutional and limited-government principles. Each report names the votes they chose. Open the report for the descriptions and the scores.",
  },
];

export default function ScorecardsPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl text-navy">Scorecards</h1>
      <p className="max-w-2xl text-sm leading-relaxed">
        These groups already grade Georgia legislators. This page links to them and says, in short, what they say they measure. American Capitol Watch does not calculate scores and does not republish their grades.
      </p>
      <ul className="space-y-4">
        {CARDS.map((card) => (
          <li key={card.name} className="rounded-lg border border-line bg-paper p-4">
            <h2 className="font-serif text-2xl text-navy">{card.name}</h2>
            <p className="mt-2 text-sm leading-relaxed">{card.body}</p>
            <p className="mt-3 text-sm">
              <a className="font-semibold text-crimson underline" href={card.href}>
                Open their page
              </a>
              {card.extra.map((link) => (
                <a key={link.href} className="ml-3 font-semibold text-navy underline" href={link.href}>
                  {link.label}
                </a>
              ))}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
