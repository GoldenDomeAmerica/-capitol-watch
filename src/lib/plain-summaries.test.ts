import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { BillCardView } from "@/components/bills";
import type { BillCard } from "@/lib/queries";
import {
  PLAIN_BILL_SUMMARIES,
  PLAIN_SUMMARY_UNAVAILABLE,
  displayBillSummary,
  plainSummarySlugsMatching,
} from "@/lib/plain-summaries";

const snapshot = JSON.parse(readFileSync(new URL("../../data/idaho/snapshot.json", import.meta.url), "utf8")) as {
  bills: { slug: string; identifier: string; title: string }[];
};

function sentences(summary: string): string[] {
  return summary.split(/(?<=[.!?])\s+(?=[A-Z])/).filter(Boolean);
}

function card(stateSlug: string, slug: string, stored: string): string {
  const bill: BillCard = {
    id: `${stateSlug}-${slug}`,
    slug,
    identifier: slug.toUpperCase(),
    title: "Stored title",
    summary: stored,
    status: "In committee",
    lastAction: null,
    lastActionDate: null,
    chamber: "house",
    sessionName: "2026",
    featured: false,
    governorAction: null,
    topics: [],
  };
  return renderToStaticMarkup(createElement(BillCardView, { bill, stateSlug }));
}

test("every Idaho bill in the snapshot has one plain summary, and no extra Idaho rows", () => {
  const slugs = snapshot.bills.map((bill) => bill.slug).sort();
  const drafted = PLAIN_BILL_SUMMARIES.filter((row) => row.state === "idaho");
  assert.deepEqual(
    drafted.map((row) => row.slug).sort(),
    slugs,
  );
  assert.equal(new Set(drafted.map((row) => row.slug)).size, drafted.length);
  for (const bill of snapshot.bills) {
    const row = drafted.find((item) => item.slug === bill.slug);
    assert.ok(row);
    assert.equal(row.identifier, bill.identifier);
    const title = bill.slug === "s1441" ? "Memorandum of agreement, immigration" : bill.title;
    assert.equal(row.title, title);
  }
});

test("written summaries are one or two sentences, and thin bills use the exact flag", () => {
  const flagged = ["h0551", "h0756", "h0873", "h0911", "s1368", "s1370", "s1391"];
  for (const row of PLAIN_BILL_SUMMARIES) {
    if (row.summary === PLAIN_SUMMARY_UNAVAILABLE) {
      assert.ok(flagged.includes(row.slug), row.slug);
      continue;
    }
    assert.equal(flagged.includes(row.slug), false, row.slug);
    assert.match(row.summary, /^This bill would /);
    assert.match(row.summary, /It would affect /);
    const parts = sentences(row.summary);
    assert.ok(parts.length >= 1 && parts.length <= 2, `${row.identifier}: ${parts.length}`);
    assert.doesNotMatch(row.summary, /\b(Democrat|Republican|liberal|conservative|radical)\b/i);
  }
  assert.equal(PLAIN_BILL_SUMMARIES.filter((row) => row.summary === PLAIN_SUMMARY_UNAVAILABLE).length, 7);
});

test("the review draft matches the summaries the pages show", () => {
  const draft = readFileSync(new URL("../../docs/bill-summaries-draft.md", import.meta.url), "utf8");
  const lines = draft.split("\n").filter((line) => line.startsWith("- **"));
  assert.equal(lines.length, PLAIN_BILL_SUMMARIES.length);
  for (const row of PLAIN_BILL_SUMMARIES) {
    assert.ok(lines.includes(`- **${row.identifier}** ${row.title}: ${row.summary}`), row.identifier);
  }
});

test("other states keep the stored summary until they are added", () => {
  assert.equal(displayBillSummary("georgia", "hb-1", "Stored Georgia summary."), "Stored Georgia summary.");
  assert.equal(plainSummarySlugsMatching("georgia", "moment of silence").length, 0);
  assert.deepEqual(plainSummarySlugsMatching("idaho", "moment of silence"), ["h0623"]);
  assert.deepEqual(plainSummarySlugsMatching("idaho", "not available"), []);
});

test("an Idaho bill card shows the plain summary, not the stored caption", () => {
  const shown = card("idaho", "h0623", "Official caption: Returned Signed by the President.");
  assert.match(shown, /daily moment of silence/);
  assert.doesNotMatch(shown, /Returned Signed/);
  assert.match(shown, /text-sm leading-relaxed/);

  const missing = card("idaho", "h0551", "Official caption: Returned Signed by the President.");
  assert.match(missing, /Summary not available yet/);
  assert.match(missing, /text-muted/);

  const georgia = card("georgia", "hb-1", "Stored Georgia summary.");
  assert.match(georgia, /Stored Georgia summary\./);
  assert.match(georgia, /Stored title/);

  const corrected = renderToStaticMarkup(
    createElement(BillCardView, {
      stateSlug: "idaho",
      bill: {
        id: "id-s1441",
        slug: "s1441",
        identifier: "S1441",
        title: "Memorandum of agreemnt, immigration",
        summary: "Official caption: a status line.",
        status: "In committee",
        lastAction: null,
        lastActionDate: null,
        chamber: "senate",
        sessionName: "2026",
        featured: false,
        governorAction: null,
        topics: [],
      },
    }),
  );
  assert.match(corrected, /Memorandum of agreement, immigration/);
  assert.doesNotMatch(corrected, /agreemnt/);
});
