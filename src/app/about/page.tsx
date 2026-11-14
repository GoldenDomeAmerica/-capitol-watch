import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About and sources",
  description: "How American Capitol Watch handles bill facts, opinion, and sources for Georgia and Pennsylvania.",
};

export default function AboutPage() {
  return (
    <div className="max-w-2xl space-y-4 text-sm leading-relaxed">
      <h1 className="font-serif text-3xl text-navy">About and sources</h1>
      <p>
        American Capitol Watch is a national name. The live sections are Georgia, at /georgia/, and Pennsylvania, at
        /pennsylvania/. Each state keeps its own bills, topics, and legislator roster.
      </p>
      <p>
        Every tracked bill links to its official page. Plain-English summaries are taken from that official caption or summary.
        They do not add vote counts, dollar figures, or effects that the official text does not state. A “Watch note” is opinion
        and is labeled that way. It is never mixed into the summary.
      </p>
      <h2 className="font-serif text-2xl text-navy">Georgia</h2>
      <p>
        Georgia bill pages link to legis.ga.gov. The roster, roll calls, and the file we import are adapted from VoteGA.org,
        which compiles the General Assembly’s own web service and licenses that compilation CC BY-SA 4.0. County and ZIP district
        matches come from that project’s public ZIP crosswalk. Street-address lookup uses the U.S. Census Bureau geocoder.
        Scorecards are linked, not copied. The 2025–2026 regular session has adjourned. The next regular session opens January
        11, 2027.
      </p>
      <h2 className="font-serif text-2xl text-navy">Pennsylvania</h2>
      <p>
        Pennsylvania bill pages link to palegis.us. Titles, sponsors, the full action history, memo links, and printer’s-number
        PDFs come from the Pennsylvania General Assembly’s Bill History file for the 2025–2026 session. The House and Senate
        rosters come from the General Assembly’s member RSS feeds: party, district, counties, phones, addresses, and photos.
        Member votes, when a shortlisted bill had a floor roll call, come from the official roll-call summary pages. This v1
        tracks a curated shortlist, not every bill filed.
      </p>
      <p>
        The General Assembly’s information is public and provided as is. It is not offered under a Creative Commons license, and
        this site does not add one. Pennsylvania’s legislature is full time, so the Pennsylvania pages say “recent activity”
        instead of treating the record like a short session that has adjourned.
      </p>
      <p>
        A Pennsylvania ZIP uses the U.S. Census Bureau’s 2024 state-legislative-district to 2020 ZCTA relationship files. When a
        ZIP splits, the lookup lists each district that covers part of it. A street address uses the Census geocoder. County
        search uses the counties on the official member record. The site does not automate the General Assembly’s Find My
        Legislator tool.
      </p>
    </div>
  );
}
