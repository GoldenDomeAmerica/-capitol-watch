import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { BillResearchSections } from "@/components/bill-research";
import { billResearchFor } from "@/lib/bill-research";
import { RESEARCH_COMING_SOON } from "@/lib/bill-research/types";

test("only the five Idaho bills have research", () => {
  for (const slug of ["h0623", "h0559", "h0708", "h0736", "s1349"]) {
    assert.ok(billResearchFor("idaho", slug), slug);
  }
  assert.equal(billResearchFor("idaho", "h0551"), null);
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
