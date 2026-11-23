# Site structure

Source of truth for routes, layout, admin endpoints, and tables. Update this file when a route, endpoint, or table changes. Configured states come from `STATES` in `src/lib/states.ts`. A state is public only when `launchesAt` is null or the timestamp is in the past. `src/lib/launch.ts` does that check at request time (`liveStates()`). A row in the `states` table does not add a section by itself.

Idaho launches at `2026-11-21T07:00:00-05:00`, New York at `2026-11-23T07:00:00-05:00`, and Texas at `2026-11-25T07:00:00-05:00`. Georgia, Pennsylvania, and Arizona have `launchesAt: null` and stay public. Before a launch time, that state is left out of the header, the footer credits, the home cards, the sitemap, Hot Topics, the signup dropdown, and `POST /api/signup`. A request for its routes, including child routes, is rewritten to a 404. After the launch time the same deployment shows the state on the next request. No redeploy is required. `src/lib/launch.test.ts` checks the minute before and the minute of each launch. `ACW_NOW` can override the clock when `NODE_ENV` is not `production`, for a local screenshot. Production ignores it.

The shared layout is `src/app/layout.tsx`: optional sponsor bar, header, `<main>` (`max-w-5xl`, horizontal padding, vertical padding), and footer. The header title is the site name only. The header nav is the states `liveStates()` returns, then Hot Topics, and Contact. The current state link is crimson when the path is that state or a page under it. The footer links are Contact, Send a tip (`/submit`), About and sources, Privacy, and Sponsor, plus the source credits. The sponsor bar renders only when a sponsor week is active and the visitor has not dismissed it. Page views are recorded for paths other than `/api` and `/go`.

Unknown URLs use `src/app/not-found.tsx`.

## Public pages

| Path | What it shows |
| --- | --- |
| `/` | State cards from `STATES`, then the newsletter signup form. |
| `/hot-topics` | Latest stored week of hot topics for each live state, or an empty line when that state has none. |
| `/[state]` | Landing page for a slug in `STATES` that has launched: overview, links to bills, legislators, topics, and scorecards or vetoes when that state flags them. `dynamicParams` is false, so any other slug is a 404. A configured state before its launch time is also a 404. Static state folders still own the child routes below. Idaho, New York, and Texas have no scorecards page and no vetoes page. |
| `/{state}/bills` | Searchable bill list for that state. `BillCardView` in `src/components/bills.tsx` renders each card. The card title links to the bill page, and the link covers the card so a click on the summary opens that page too. Topic chips stay separate links. When `src/lib/bill-research/` has that state and bill slug, the card shows that file's `shortSummary`. Otherwise, when `src/lib/plain-summaries.ts` has the bill, the card shows that plain-language summary. Otherwise it shows the summary stored on the bill. A search also matches the plain-language sentences in `plain-summaries.ts`. The same card is used on topic pages and on `/arizona/vetoes`. |
| `/{state}/bills/{slug}` | One bill. `BillDetailPage` shows the short title and the "Plain-English summary" from `src/lib/plain-summaries.ts` when the bill is listed there. If `src/lib/bill-research/` has the bill, `BillResearchSections` then shows, in order: status badge, What it changes, Timeline, Cost, How they voted (chamber totals and a collapsed "See how each member voted" link), Viewpoints (opinion, not fact), In the news, and Sources checked Nov 22, 2026. A statement of purpose is labeled "Sponsor's view (opinion)". Viewpoint colors are in `docs/design-tokens.md`. If the research file has no row, the page keeps today's sponsors, actions, and links and adds "Detailed research for this bill is coming soon." Georgia's folder param is named `[id]`; Pennsylvania and Arizona use `[slug]`. The value is the bill slug. |
| `/{state}/legislators` | Roster search by name, district, chamber, county, ZIP, or street address. |
| `/{state}/legislators/{slug}` | One legislator. Georgia's folder param is named `[id]`. |
| `/{state}/topics/{slug}` | Bills tagged with one topic. Slugs are `taxes`, `guns`, `schools`, `elections`, `property-rights`, `energy`, `abortion`, and `border`, from `src/lib/topics.ts`. The heading leads with "Hot Topics" and does not prefix the state name. |
| `/georgia/scorecards` | Links to outside Georgia scorecards. No other state has this page. |
| `/arizona/vetoes` | Tracked Arizona bills with a veto in the official record. No other state has this page. |
| `/about` | How facts, opinion, and sources are handled. |
| `/contact` | Contact form. |
| `/privacy` | Privacy note. |
| `/sponsor` | Sponsor inquiry and public counts. |
| `/submit` | Tip, correction, event, or sponsor note. The header does not link here. The footer does. |
| `/sitemap.xml` | Generated sitemap. |
| `/robots.txt` | Allows `/` and points at the sitemap. |

`/go/{sponsor}` records a click and redirects to that sponsor's destination. It is not a page.

## Public form endpoints

These do not use `ADMIN_TOKEN`. They return 503 when `DATABASE_URL` is missing.

| Method and path | Role |
| --- | --- |
| `POST /api/signup` | Save a newsletter signup. Requires consent and a state slug that has already launched. |
| `POST /api/contact` | Save a contact message. |
| `POST /api/submit` | Save a tip or other submission for review. |
| `POST /api/sponsor` | Save a sponsor inquiry. |

## Admin API

Every `/api/admin/*` route uses `adminGuard` in `src/lib/admin.ts`.

- Send `Authorization: Bearer` plus the value of `ADMIN_TOKEN`.
- If `ADMIN_TOKEN` is unset, the route returns 503 `{ "error": "Admin API is not configured." }`.
- A missing or wrong token returns 401 `{ "error": "Unauthorized" }`.
- Do not commit, log, or write the token value in docs.

| Method and path | Role |
| --- | --- |
| `GET /api/admin/queue` | Pending tips, corrections, events, and sponsor inquiries. |
| `POST /api/admin/approve` | `{ "id", "decision": "approve" or "reject", "note" }`. Approving marks a tip reviewed. It does not create a bill. |
| `GET /api/admin/stats` | Signup, pageview, sponsor-click, and contact counts. |
| `GET /api/admin/contact` | Contact messages, newest first. Optional `?status=new` or `?status=read`. |
| `POST /api/admin/contact` | `{ "id" }` marks that message read. |
| `GET /api/admin/signups` | Subscribers. Optional `?state=` a live slug. A row with no stored state is listed under Georgia. |
| `GET /api/admin/searches` | Searches that returned nothing. |
| `GET /api/admin/sponsors` | Sponsor weeks. |
| `POST /api/admin/sponsors` | Create a sponsor week. |
| `GET /api/admin/hot-topics` | Up to 200 stored rows, newest week first. Optional `?state=` and `?weekStart=YYYY-MM-DD`. Returns `{ "topics": [ ... ] }`. |
| `POST /api/admin/hot-topics` | Replace one state's topics for one week. Body is `{ "state", "weekStart", "topics" }` with one or two items. Each item has `rank` (1 or 2, unique), `title` (2–140 characters), `summary` (2–400), optional `link` (a topic or bill path on this site), and optional `sourceNote` (at most 240 characters). Success is `{ "state", "weekStart", "topics" }` including `id` and `createdAt`. The site does not call X. |

## Database

Postgres, accessed with Drizzle (`src/db/schema.ts`). The app reads `DATABASE_URL` only. On Vercel, `npm run vercel-build` runs `drizzle-kit migrate` when that variable, or `DATABASE_URL_UNPOOLED`, is set, then seeds a state only if it has no bills. Idaho, New York, and Texas use `scripts/seed-scheduled.ts`, which inserts missing rows and does not update or delete anything.

Preview and production share one database. New SQL must be additive. No `DROP`, no rename, no rewrite of an existing column. Prefer `CREATE TABLE IF NOT EXISTS` and `CREATE INDEX IF NOT EXISTS`, as in `drizzle/0003_contact_messages.sql` and `drizzle/0004_hot_topics.sql`. A migration that runs on a preview build changes the shared data. This launch did not add a migration. The new state rows are seed data, and the pages stay dark until `launchesAt`.

| Table | Role |
| --- | --- |
| `states` | State ids. The public site does not use this table to decide which sections exist. |
| `topics` | Topic ids. Public topic pages use `src/lib/topics.ts`. |
| `bills` | Tracked bills, one row per state and slug. Plain-language display text is not a column. `src/lib/plain-summaries.ts` holds one row per drafted bill (`state`, `slug`, `identifier`, `title`, `summary`). `displayBillSummary` and `displayBillTitle` read it. A missing row keeps the stored title and summary. The summary sentence `Summary not available yet` means the official description did not say what the bill would do. Idaho is the only state in that file. S1441's stored short title misspells "agreement"; the file's title is the spelling the pages show. Deeper research is also not a column. `src/lib/bill-research/` holds it, keyed by state slug and bill slug. Idaho has five bills there. |
| `bill_topics` | Bill-to-topic join. |
| `legislators` | Roster rows, including some former members kept so votes resolve. |
| `bill_sponsors` | Sponsors named on a bill. |
| `votes` | Member votes on tracked bills. |
| `signups` | Newsletter addresses and the state list they picked. |
| `submissions` | Tips and other items waiting for review. |
| `contact_messages` | Contact form messages. |
| `zero_result_searches` | Queries that matched nothing. |
| `pageviews` | Daily counts by path. |
| `sponsor_weeks` | Paid sponsor weeks. |
| `sponsor_clicks` | Clicks through `/go/{sponsor}`. |
| `errors` | Server errors, with secrets scrubbed. |
| `hot_topics` | Weekly topics. Columns: `id`, `state_slug`, `week_start`, `rank` (check: 1 or 2), `title`, `summary`, `link`, `source_note`, `created_at`. Unique on state, week, and rank. Created by `drizzle/0004_hot_topics.sql`. |
