# Research notes

Source of truth for where bill data comes from and how Hot Topics is filled. Update this file when an importer or the Hot Topics contract changes. Which states are live is the `STATES` array in `src/lib/states.ts`, not whatever rows happen to be in the `states` table.

The site stores a curated extract. It does not mirror every bill a legislature files. Pennsylvania and Arizona are shortlists. Plain-English summaries do not add facts that the official text does not state. A Watch note is opinion and is labeled. Street-address lookup calls the U.S. Census Bureau geocoder at request time and is not stored in the snapshots. If that service is down, name, district, county, and ZIP lookup still work.

Importers upsert one state. They do not delete another state's rows. `npm run vercel-build` seeds a state only when that state has zero bills.

## Georgia

Official record: Georgia General Assembly, https://www.legis.ga.gov/. The file we import is an adaptation of the VoteGA.org compilation (https://votega.org), which is CC BY-SA 4.0. VoteGA reads the General Assembly web service. Upstream code is https://github.com/Votega/ga-legislation and https://github.com/Votega/ga-legislators. The ZIP-to-district crosswalk comes from that project. See `data/georgia/LICENSE.md`.

Import: `npm run import:georgia` downloads the public files, rebuilds `data/georgia/snapshot.json`, and upserts Georgia when `DATABASE_URL` is set. `npm run db:seed` loads that snapshot when the file is present. `IMPORT_FRESH=1` on `db:seed` downloads again before loading.

Summaries are rewritten from the official caption and summary. They are not legal advice. Every seeded bill keeps an official legis.ga.gov URL.

The 2025–2026 regular session has adjourned. The next regular session opens January 11, 2027. Refresh the snapshot once the upstream files include that session.

Scorecards are links to other groups' pages (Georgia Republican Assembly, Georgia Faith & Freedom Coalition, Freedom Index). This site does not calculate scores and does not copy their grades. Georgia has no vetoes page.

## Pennsylvania

Official record: Pennsylvania General Assembly, https://www.palegis.us/. The information is public and provided as is. It is not under a Creative Commons license, and this site does not add one.

Import: `npm run import:pennsylvania` reads the Bill History file for the 2025–2026 regular session (`documentType=BillHistoryData&session=2025_0`), the House and Senate member RSS feeds, and floor roll-call summary pages for the shortlist. It writes `data/pennsylvania/snapshot.json` and upserts Pennsylvania only. See `data/pennsylvania/SOURCES.md`.

ZIP districts use the Census Bureau 2024 state-legislative-district to 2020 ZCTA relationship files. A ZIP that splits keeps each district that covers part of it. County search uses the counties on the official member record.

The General Assembly is full time. Pages say "recent activity" instead of treating the record like a short session that has adjourned. There is no scorecards page and no vetoes page. Summaries repeat the official short title.

This v1 tracks a curated shortlist, not every bill filed.

## Arizona

Official record: Arizona State Legislature, https://www.azleg.gov/ and the bill-status API at https://apps.azleg.gov/api/. Sponsors come from `BillSponsor`. Floor roll calls come from `BillStatusFloorAction`. The member roster is https://www.azleg.gov/memberroster/. See `data/arizona/SOURCES.md`.

Import: `npm run import:arizona` writes `data/arizona/snapshot.json` and upserts Arizona only. Sessions in the file are 129 (2025 first regular) and 130 (2026 second regular). Bill numbers repeat across years, so each bill is keyed by session and number, and the slug includes the year.

The roster includes members the legislature marks as resigned. Those rows stay so older votes still resolve, and they are left off the public roster. A strike-everything amendment uses the legislature's Now title. Summaries use the official fact-sheet overview when one was published, otherwise the short title.

House and Senate share one district number. ZIP districts use the Census 2024 relationship files and keep each part of a split ZIP that is at least 2 percent of its land area. Counties come from the overlap of `cb_2024` House and Senate district boundaries with county boundaries. Rebuilding that crosswalk needs the Python packages `shapely` and `pyshp`.

The next regular session opens January 11, 2027. Vetoed bills in the shortlist are listed at `/arizona/vetoes`. There is no scorecards page. This v1 is a curated shortlist, not every bill filed.

## Hot Topics

The site does not call the X API. A weekly job, outside this app, reads public posts on X and `POST`s one or two topics per live state to `/api/admin/hot-topics`. The public page at `/hot-topics` reads the latest stored week for each state and says "Based on public posts on X this week." A state with no rows yet shows an empty line. Details of the request and response are in `docs/site-structure.md` and the README admin section. Do not put a token in either file.

## Design decisions from this pull request

These are the owner's choices for the chrome and the home page:

- The site title, American Capitol Watch, stands alone. No state name sits above it or directly under it, on any page.
- The header nav is one row: the live states from `src/lib/states.ts`, then Hot Topics (`/hot-topics`), then Contact (`/contact`).
- The home page body is the state cards, then the newsletter signup form. It does not list bills or topics.
- Send a tip (`/submit`) is a link in the shared footer, not in the header.
