# American Capitol Watch

Plain-English tracking of state-legislature bills for voters. The name is national. Georgia lives at `/georgia/...` and Pennsylvania at `/pennsylvania/...`.

Facts on a bill page come from the official record. A **Watch note** is opinion and is labeled that way.

## Stack

- Next.js (App Router) and TypeScript
- Tailwind CSS
- Postgres with Drizzle
- Resend for the audience, the owner alert, and a draft newsletter broadcast
- React Email for the American Capitol Watch newsletter

On Vercel, use the Neon Postgres integration from the Marketplace. `DATABASE_URL` is the only database variable the app reads.

## Environment variables

Copy `.env.example` to `.env.local`. The site renders an empty state when these are missing. It does not crash a preview build.

| Variable | Required to | Notes |
| --- | --- | --- |
| `DATABASE_URL` | store anything | Neon connection string, or any Postgres URL. Local example: `postgres://acw:acw@localhost:5432/capitol_watch` |
| `ADMIN_TOKEN` | call `/api/admin/*` | Send `Authorization: Bearer <token>`. Never commit or log the value. If it is unset, admin routes return 503. |
| `RESEND_API_KEY` | add contacts and send mail | Leave blank until you have a key. Signups still save in Postgres. |
| `RESEND_AUDIENCE_ID` | put signups in a segment | Resend now calls these segments. Put the segment id here (`seg_...`). |
| `NEWSLETTER_FROM` | create a broadcast or email the owner | Leave unset, or use a placeholder, until a domain is verified. The newsletter script still writes HTML. |
| `OWNER_EMAIL` | receive sponsor inquiries | The form always saves. Email is sent only when this, `RESEND_API_KEY`, and a real `NEWSLETTER_FROM` are set. |
| `NEXT_PUBLIC_SITE_URL` | links, sitemap, canonical URLs | No trailing slash. Example: `https://your-domain.example` |
| `NEWSLETTER_POSTAL_ADDRESS` | optional | Printed in the newsletter draft. Do not invent one. A physical address is required before you actually send marketing mail. |

## Local setup

```bash
npm install
cp .env.example .env.local
# set DATABASE_URL

npm run db:migrate
npm run db:seed
npm run dev
```

`db:seed` loads `data/georgia/snapshot.json` when that file is present. `npm run import:georgia` downloads the public Georgia files again, rebuilds the snapshot, and upserts. Use that to refresh the January 2027 session once the upstream files include it. Set `IMPORT_FRESH=1` on `db:seed` to do the same thing.

`npm run import:pennsylvania` reads the Pennsylvania General Assembly Bill History file, the House and Senate member RSS feeds, and floor roll-call summary pages for the curated shortlist. It writes `data/pennsylvania/snapshot.json` and, when `DATABASE_URL` is set, upserts Pennsylvania only. It does not delete Georgia rows. The ZIP crosswalk is built from the Census Bureau’s 2024 legislative-district to ZCTA files. Pennsylvania is a full-time legislature, so the site labels that section “recent activity.”

The importer reads:

- [VoteGA bill files](https://github.com/Votega/ga-legislation), compiled from the General Assembly web service at legis.ga.gov
- [VoteGA legislator roster and roll calls](https://github.com/Votega/ga-legislators)
- The VoteGA ZIP-to-district crosswalk for county and ZIP search

Every seeded bill keeps an official `https://www.legis.ga.gov/...` URL. The adapted snapshot is CC BY-SA 4.0. See `data/georgia/LICENSE.md`.

Street-address lookup calls the U.S. Census geocoder. If that service is down, name, district, county, and ZIP still work.

## Newsletter

```bash
npm run newsletter
```

This builds one national issue per launched state: a short introduction, then that state's bills. It writes `newsletter-out/american-capitol-watch-<state>.html`. The signup form is a dropdown of the states in code. The choice is stored as a list (one state today). An empty list counts as Georgia.

If `RESEND_API_KEY`, `RESEND_AUDIENCE_ID`, and a real `NEWSLETTER_FROM` are set, it also tags each stored subscriber in the American Capitol Watch segment. The state is a contact property (`acw_state`, fallback `georgia`) and one Resend topic per state. It creates one **draft** broadcast per state, limited to that topic, so a reader only gets the state they picked. It does not send. Preview the template with `npm run email`.

`onboarding@resend.dev` can only deliver to the Resend account address. Do not point `NEWSLETTER_FROM` at an unverified domain and expect delivery. Leave it unset until the domain is verified.

## Admin API

All routes require `Authorization: Bearer $ADMIN_TOKEN`.

- `GET /api/admin/queue` — pending tips, corrections, events, and sponsor inquiries
- `POST /api/admin/approve` — `{ "id": 1, "decision": "approve" | "reject", "note": "optional" }`
- `GET /api/admin/stats` — signups (including a count by state), pageviews, sponsor clicks, top pages
- `GET /api/admin/signups` — subscribers, with `?state=georgia` or `?state=pennsylvania` to filter. A row with no stored state is listed under Georgia.
- `GET /api/admin/searches` — searches that returned nothing
- `GET /api/admin/sponsors` and `POST /api/admin/sponsors`

Approving a tip marks it reviewed. It does not invent a bill.

Create a sponsor week:

```bash
curl -X POST "$NEXT_PUBLIC_SITE_URL/api/admin/sponsors" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "example-week",
    "name": "Example Sponsor",
    "tagline": "A one-line offer.",
    "destinationUrl": "https://example.com",
    "paidForBy": "Paid for by Example Sponsor",
    "startsOn": "2026-11-16",
    "endsOn": "2026-11-22",
    "weeklyRateCents": 5000
  }'
```

The site bar stays hidden when no sponsor week is active. `/go/example-week` records a click and redirects.

## Deploy on Vercel

1. Import this repository. Framework preset is Next.js. `vercel.json` sets the build command to `npm run vercel-build`.
2. Add **Neon Postgres** from the Vercel Marketplace so `DATABASE_URL` is injected for Preview and Production. `DATABASE_URL_UNPOOLED` is used for migrations when Vercel provides it. Do not use the retired `@vercel/postgres` package.
3. Set `ADMIN_TOKEN`, `NEXT_PUBLIC_SITE_URL`, and the Resend variables in the project settings for Production and Preview. Preview can omit Resend. The pages still load.
4. Each Vercel build applies Drizzle migrations, then loads a state snapshot only when that state has no bills yet. Georgia is seeded from `data/georgia/snapshot.json` when no Georgia bills are present. Pennsylvania is seeded from `data/pennsylvania/snapshot.json` when no Pennsylvania bills are present. Existing rows are left in place. A Pennsylvania seed never deletes Georgia data. If `DATABASE_URL` is missing, that step is skipped and `next build` still runs. Local setup is still:

```bash
npm run db:migrate
npm run db:seed
```

5. Verify a domain in Resend before filling in `NEWSLETTER_FROM`. Create a segment and put its id in `RESEND_AUDIENCE_ID`.
6. Run `npm run newsletter` when you want a draft. Send it from the Resend dashboard after you read it.

The free Hobby plan is enough: serverless Node functions, no Edge runtime, and no cron. Pageviews are counted in Postgres on each page render.

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Local site |
| `npm run build` | Production build, without touching the database |
| `npm run vercel-build` | Migrate, seed only if `bills` is empty, then `next build` |
| `npm run lint` | ESLint |
| `npm run db:generate` | Write a new Drizzle migration after a schema change |
| `npm run db:migrate` | Apply migrations |
| `npm run db:seed` | Load the committed snapshot |
| `npm run import:georgia` | Refresh Georgia bills, legislators, and votes from public files |
| `npm run import:pennsylvania` | Refresh the Pennsylvania shortlist, roster, and floor roll calls |
| `npm run newsletter` | Write one draft issue per state and, when configured, create unsent Resend drafts |
