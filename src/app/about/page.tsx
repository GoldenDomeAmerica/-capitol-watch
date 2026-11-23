import type { Metadata } from "next";
import Link from "next/link";
import { liveStates } from "@/lib/launch";
import { stateListLabel } from "@/lib/states";

export function generateMetadata(): Metadata {
  return {
    title: "About and sources",
    description: `How American Capitol Watch handles bill facts, opinion, and sources for ${stateListLabel(liveStates())}.`,
  };
}

export default function AboutPage() {
  const states = liveStates();
  const live = new Set(states.map((state) => state.slug));
  return (
    <div className="max-w-2xl space-y-4 text-sm leading-relaxed">
      <h1 className="font-serif text-3xl text-navy">About and sources</h1>
      <p>
        American Capitol Watch is a national name. The live sections are{" "}
        {states.map((state, index) => (
          <span key={state.slug}>
            {index > 0 && index === states.length - 1 ? ", and " : index > 0 ? ", " : ""}
            {state.name}, at /{state.slug}/
          </span>
        ))}
        . Each state keeps its own bills, topics, and legislator roster. The list of live states is in the site code, and a
        scheduled state stays off the public site until its launch time. A state row in the database does not add a section
        on its own.
      </p>
      <p>
        Every tracked bill links to its official page. Plain-English summaries come from that official caption or description.
        Where a plain-language summary is on file for the bill, that wording is shown on the bill list and the bill page.
        Those sentences do not add vote counts, dollar figures, or effects that the official text does not state. A “Watch note” is opinion
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
      <h2 className="font-serif text-2xl text-navy">Arizona</h2>
      <p>
        Arizona bill pages link to apps.azleg.gov. Titles, sponsors, actions, governor action, chapter numbers, and floor roll
        calls come from the Arizona State Legislature’s public bill-status API. Sponsors are read from that API’s BillSponsor
        record. The Now title is used when the legislature records a strike-everything amendment. Plain-English summaries use
        the official fact-sheet overview when one was published.
      </p>
      <p>
        The sitting roster comes from the legislature’s member roster: one senator and two representatives for each of the 30
        districts. Members the roster marks as resigned stay in the file so older votes still resolve, and they are left off
        the public roster. This v1 tracks a curated shortlist, not every bill filed. Vetoed bills in that shortlist are listed
        at /arizona/vetoes. The 2027 regular session opens January 11, 2027.
      </p>
      <p>
        A street address uses the U.S. Census Bureau geocoder. ZIP districts use the Census Bureau’s 2024 legislative-district
        to 2020 ZCTA relationship files and keep each part of a split ZIP. Counties come from the overlap of the Census
        cb_2024 Arizona House and Senate district boundaries with county boundaries. Arizona uses the same district number for
        the House and the Senate.
      </p>
      {live.has("idaho") ? (
        <>
          <h2 className="font-serif text-2xl text-navy">Idaho</h2>
          <p>
            Idaho bill pages link to legislature.idaho.gov. Titles, the official description, the sponsor line, actions, and
            bill-text PDFs come from the 2026 legislation index and the bill pages. The plain-language summary is rewritten
            from that official description. If the description does not say what the bill would do, the page says a summary
            is not available yet. The House and Senate roster comes from the
            legislature&apos;s member directory. This v1 tracks a curated shortlist, not every bill filed. There is no scorecards
            page and no vetoes page.
          </p>
          <p>
            A street address uses the U.S. Census Bureau geocoder. ZIP districts use the Census Bureau&apos;s 2024
            legislative-district to 2020 ZCTA relationship files. The member directory does not list counties. House and Senate
            share one district number.
          </p>
        </>
      ) : null}
      {live.has("new-york") ? (
        <>
          <h2 className="font-serif text-2xl text-navy">New York</h2>
          <p>
            New York bill pages link to nyassembly.gov. Summaries, sponsors, and actions come from the Assembly bill pages for
            the 2025–2026 session. The tracked bills are ones an Assembly member prime-sponsored. The Assembly roster comes
            from the Assembly member directory. Senate member rows cite each senator&apos;s official nysenate.gov page. This v1
            tracks a curated shortlist, not every bill filed. There is no scorecards page and no vetoes page.
          </p>
        </>
      ) : null}
      {live.has("texas") ? (
        <>
          <h2 className="font-serif text-2xl text-navy">Texas</h2>
          <p>
            Texas bill pages link to capitol.texas.gov. Captions, authors, sponsors, and the last action come from the Texas
            Legislature Online filed-bill reports for the 90th regular session. The House roster comes from house.texas.gov.
            The Senate roster comes from senate.texas.gov. This v1 tracks a curated shortlist, not every bill filed. There is
            no scorecards page and no vetoes page.
          </p>
          <p>
            A street address uses the U.S. Census Bureau geocoder. ZIP districts use the Census Bureau&apos;s 2024
            legislative-district to 2020 ZCTA relationship files. Those member directories do not list a county, a party, or a
            phone.
          </p>
        </>
      ) : null}
      <h2 className="font-serif text-2xl text-navy">Contact</h2>
      <p>Owned and operated by American Capitol Watch.</p>
      <p>Covering state legislatures across the United States, starting with {stateListLabel(states)}.</p>
      <p>
        Questions, press notes, and sponsorship inquiries go through the{" "}
        <Link className="underline" href="/contact">
          contact form
        </Link>
        . We reply within 2 business days (Mon–Fri). To fix a bill or legislator page,{" "}
        <Link className="underline" href="/contact?topic=correction">
          report a correction
        </Link>
        .
      </p>
    </div>
  );
}
