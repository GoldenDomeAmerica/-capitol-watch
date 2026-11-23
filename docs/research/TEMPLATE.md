# Bill research template

Copy this file for a new state or a new bill. Fill it only from official sources and from quotes checked word for word on a free page. If a fact or a quote is not in a source, write `Not found`. Do not guess.

Brand on the public site is American Capitol Watch.

## Sourcing rules

- Official legislature sources come first: the bill page, the bill text, the statement of purpose, and the current statute.
- Quotes are verbatim. Do not tidy, shorten, or paraphrase a quotation.
- Label opinion. A statement of purpose is a sponsor's view. The legislature says it is prepared by a proponent and is not legislative intent.
- Party labels come from the official member page, not from a news article.
- A missing viewpoint is `Not found`, not a stand-in quote.
- Record the date you checked each source.

## Per bill

- **Identifier and slug:**
- **shortSummary:** one or two paragraphs. What the bill does, who it affects, and the vote or outcome, in plain words.
- **statusLabel:**
- **whatItChanges:** only what the bill text says.
- **timeline:** date and the legislature's action, one line each.
- **fiscalNote:** the official fiscal note, quoted. If a later official or news source adds a cost the note omitted, say so and cite it.
- **votes:** chamber, date, yes, no, absent, and the official roll-call URL. If there was no floor vote, `Not found`.
- **sponsors:** name, party, role, official member-page URL.
- **conservativeView:** quote, speaker, party, role, outlet, date, URL. Or `Not found`.
- **liberalView:** same fields. Or `Not found`.
- **viewpointNote:** optional. Use one neutral note when the bill is bipartisan and there is no opposing quote.
- **sponsorStatement:** the statement of purpose, verbatim, with its PDF URL.
- **news:** outlet, date, title, URL. If the headline was not on the page you checked, title is `Not found`.
- **sources:** label, URL, and `checked: YYYY-MM-DD`.

## Where it goes in the app

Add the filled bill to `src/lib/bill-research/{state}.ts` and export it from `src/lib/bill-research/index.ts`, keyed by state slug and bill slug. Pages read that module. Do not add a database column. Preview and production share one database.

A bill with no row keeps the existing summary and shows: `Detailed research for this bill is coming soon.`
