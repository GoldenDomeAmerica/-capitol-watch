import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { BillResearchSections } from "@/components/bill-research";
import { billResearchFor, researchedBillCount } from "@/lib/bill-research";
import { RESEARCH_COMING_SOON } from "@/lib/bill-research/types";

const FIRST_FIVE = ["h0623", "h0559", "h0708", "h0736", "s1349"];
const BATCH_ONE = ["h0551", "h0573", "h0592", "h0594", "h0599", "h0612", "h0624", "h0628", "h0636", "h0656"];

test("Idaho research is the first five bills plus batch 1", () => {
  for (const slug of [...FIRST_FIVE, ...BATCH_ONE]) {
    assert.ok(billResearchFor("idaho", slug), slug);
  }
  assert.equal(researchedBillCount("idaho"), 15);
  assert.equal(billResearchFor("idaho", "h0659"), null);
  assert.equal(billResearchFor("georgia", "hb-1"), null);
  assert.equal(billResearchFor("new-york", "a100"), null);
  assert.equal(billResearchFor("texas", "hb-1"), null);
});

test("researched pages render the approved sections and a missing side stays neutral", () => {
  const silence = renderToStaticMarkup(
    createElement(BillResearchSections, { research: billResearchFor("idaho", "h0623") }),
  );
  assert.match(silence, /Signed into law, effective July 1, 2026 \(Ch\. 62\)/);
  assert.match(silence, /What it changes/);
  assert.match(silence, /How they voted/);
  assert.match(silence, /See how each member voted/);
  assert.match(silence, /Viewpoints \(opinion, not fact\)/);
  assert.match(silence, /CONSERVATIVE VIEW/);
  assert.match(silence, /OPPOSING VIEW/);
  assert.match(silence, /This isn&#x27;t a sneaky way to get prayer into school\./);
  assert.match(silence, /No serious person in education/);
  assert.match(silence, /Sponsor&#x27;s view \(opinion\)/);
  assert.match(silence, /checked Nov 22, 2026/);
  assert.match(silence, /Idaho Education Association was officially neutral/);

  const ballots = renderToStaticMarkup(
    createElement(BillResearchSections, { research: billResearchFor("idaho", "h0736") }),
  );
  assert.match(ballots, /Bipartisan, passed nearly unanimously/);
  assert.doesNotMatch(ballots, /CONSERVATIVE VIEW/);
  assert.doesNotMatch(ballots, /LIBERAL VIEW/);

  const guns = renderToStaticMarkup(
    createElement(BillResearchSections, { research: billResearchFor("idaho", "s1349") }),
  );
  assert.match(guns, /Died in committee/);
  assert.match(guns, /No liberal quote on the record was found\./);
  assert.match(guns, /In the news/);
  assert.match(guns, /Not found/);

  const empty = renderToStaticMarkup(createElement(BillResearchSections, { research: null }));
  assert.match(empty, new RegExp(RESEARCH_COMING_SOON));
});

test("batch 1 pages render status, votes, and viewpoints from the research files", () => {
  const enacted = renderToStaticMarkup(
    createElement(BillResearchSections, { research: billResearchFor("idaho", "h0551") }),
  );
  assert.match(enacted, /Signed into law, retroactive to Jan 1, 2026 \(Ch\. 19\)/);
  assert.match(enacted, /What it changes/);
  assert.match(enacted, /68 yes, 0 no, 2 absent/);
  assert.match(enacted, /See how each member voted/);
  assert.match(enacted, /checked Nov 22, 2026/);
  assert.match(enacted, /CONSERVATIVE VIEW/);
  assert.match(enacted, /No liberal quote on the record was found/);

  const died = renderToStaticMarkup(
    createElement(BillResearchSections, { research: billResearchFor("idaho", "h0592") }),
  );
  assert.match(died, /Died in committee/);
  assert.match(died, /How they voted/);
  assert.match(died, /Not found/);
  assert.doesNotMatch(died, /See how each member voted/);
  assert.match(died, /OPPOSING VIEW/);
  assert.match(died, /This bill would discourage individuals from pursuing necessary care/);
  assert.match(died, /Everyone deserves to access medical care, regardless of their immigration status/);
  assert.match(died, /ACLU of Idaho \(not applicable\), advocacy organization/);
  assert.match(died, /bg-viewpoint-liberal-bg/);
  assert.doesNotMatch(died, /No liberal quote on the record was found/);

  const solar = renderToStaticMarkup(
    createElement(BillResearchSections, { research: billResearchFor("idaho", "h0612") }),
  );
  assert.match(solar, /Died in committee/);
  assert.match(solar, /Rep\. John Gannon \(D\) and Rep\. Stephanie Jo Mickelsen \(R\)/);
  assert.doesNotMatch(solar, /CONSERVATIVE VIEW/);
  assert.doesNotMatch(solar, /LIBERAL VIEW/);
  assert.match(solar, /bg-viewpoint-neutral-bg/);

  const driving = renderToStaticMarkup(
    createElement(BillResearchSections, { research: billResearchFor("idaho", "h0628") }),
  );
  assert.match(driving, /Signed into law, effective March 17, 2026 \(Ch\. 30\)/);
  assert.match(driving, /63 yes, 6 no, 1 absent/);
  assert.match(driving, /29 yes, 6 no, 0 absent/);
  assert.match(
    driving,
    /You don’t want to have your life as the car or your safety or your life as the person in the car next to a teenager to count on them to make split second decisions to step on the brake and how to handle that/,
  );
  assert.match(driving, /This is a simple bill that should be green lights across the board/);
  assert.match(driving, /Rep\. Kyle Harris \(Republican\), who voted yes/);
  assert.match(driving, /Rep\. Steve Berch \(Democrat\), Assistant Minority Leader, who voted no/);
  assert.match(driving, /bg-viewpoint-conservative-bg/);
  assert.match(driving, /text-viewpoint-conservative-quote/);
  assert.match(driving, /text-viewpoint-liberal-quote/);
  assert.match(driving, /text-viewpoint-citation/);
  assert.match(driving, /Headline: Not found/);

  const facilities = renderToStaticMarkup(
    createElement(BillResearchSections, { research: billResearchFor("idaho", "h0636") }),
  );
  assert.match(facilities, /No conservative quote on the record was found/);
  assert.match(facilities, /No liberal quote on the record was found/);
  assert.match(facilities, /Rep\. Soñia R\. Galaviz \(Democrat\)/);
  assert.match(facilities, /Sponsor&#x27;s view \(opinion\)/);

  const students = renderToStaticMarkup(
    createElement(BillResearchSections, { research: billResearchFor("idaho", "h0656") }),
  );
  assert.match(students, /Died in committee/);
  assert.match(
    students,
    /could create a chilling effect for undocumented or mixed-status families/,
  );
  assert.match(students, /OPPOSING VIEW/);

  for (const slug of ["h0573", "h0594", "h0599", "h0624"]) {
    const html = renderToStaticMarkup(
      createElement(BillResearchSections, { research: billResearchFor("idaho", slug) }),
    );
    assert.match(html, /Signed into law/, slug);
    assert.match(html, /See how each member voted/, slug);
    assert.match(html, /CONSERVATIVE VIEW/, slug);
    assert.match(html, /No liberal quote on the record was found/, slug);
    assert.match(html, /checked Nov 22, 2026/, slug);
  }
});

test("batch 1 statement-of-purpose and viewpoint quotes are verbatim", () => {
  const research = readFileSync(new URL("../../../docs/research/idaho/batch-1-2026.md", import.meta.url), "utf8");
  const viewpoints = readFileSync(
    new URL("../../../docs/research/idaho/batch-1-2026-viewpoints.md", import.meta.url),
    "utf8",
  );
  for (const bill of ["H0551", "H0573", "H0592", "H0594", "H0599", "H0612", "H0624", "H0628", "H0636", "H0656"]) {
    const start = research.indexOf(`# ${bill} —`);
    const next = research.indexOf("\n# ", start + 1);
    const section = research.slice(start, next === -1 ? undefined : next);
    const sop = section.match(/Sponsor’s view, quoted from the official Statement of Purpose[\s\S]*?\n\n(“.*”)\n/);
    assert.ok(sop, bill);
    const row = billResearchFor("idaho", bill.toLowerCase());
    assert.equal(row?.sponsorStatement?.quote, sop?.[1], bill);
  }
  const driving = billResearchFor("idaho", "h0628");
  const drivingSection = viewpoints.slice(viewpoints.indexOf("# H0628 —"));
  const quotes = [...drivingSection.matchAll(/^(“.*”)\s*$/gm)].map((match) => match[1]);
  assert.equal(driving?.liberalView?.[0]?.quote, quotes[0]);
  assert.equal(driving?.conservativeView?.[0]?.quote, quotes[1]);
  assert.equal(driving?.liberalView?.[0]?.party, "Democrat");
  assert.equal(driving?.conservativeView?.[0]?.party, "Republican");

  for (const [slug, marker] of [
    ["h0592", "# H0592 —"],
    ["h0656", "# H0656 —"],
  ] as const) {
    const section = viewpoints.slice(viewpoints.indexOf(marker));
    const quote = section.match(/^(“.*”)\s*$/m)?.[1];
    const row = billResearchFor("idaho", slug);
    assert.equal(row?.liberalView?.[0]?.quote, quote, slug);
    assert.equal(row?.liberalView?.[0]?.speaker, "ACLU of Idaho");
    assert.equal(row?.liberalView?.[0]?.party, "not applicable");
    assert.equal(row?.liberalView?.[0]?.role, "advocacy organization");
  }
});
