import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About and sources",
  description: "How American Capitol Watch handles Georgia bill facts, opinion, and sources.",
};

export default function AboutPage() {
  return (
    <div className="max-w-2xl space-y-4 text-sm leading-relaxed">
      <h1 className="font-serif text-3xl text-navy">About and sources</h1>
      <p>
        American Capitol Watch is a national name with one state section at launch: Georgia. The address pattern is /georgia/ so other states can be added without renaming the site.
      </p>
      <p>
        Every tracked bill links to its official page on legis.ga.gov. Plain-English summaries are rewritten from that official caption and summary. They do not add vote counts, dollar figures, or effects that the official text does not state. A “Watch note” is opinion and is labeled that way. It is never mixed into the summary.
      </p>
      <p>
        The roster, roll calls, and the file we import are adapted from VoteGA.org, which compiles the General Assembly’s own web service and licenses that compilation CC BY-SA 4.0. County and ZIP district matches come from that project’s public ZIP crosswalk. Street-address lookup uses the U.S. Census Bureau geocoder. Scorecards are linked, not copied.
      </p>
      <p>
        The importer can be run again when the 2027 session is published. It refreshes status from the public files and keeps hand-checked summaries where we have written one.
      </p>
    </div>
  );
}
