import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BillCardView, BillSearch } from "@/components/bills";
import { StatusBanner } from "@/components/chrome";
import { SignupForm } from "@/components/signup-form";
import { databaseConfigured } from "@/db";
import type { BillAction, GovernorAction, PassageVote } from "@/db/schema";
import { logError } from "@/lib/errors";
import { countyNames, districtsForAddress, districtsForZip, type DistrictHit } from "@/lib/find-legislators";
import { getBill, getLegislator, searchBills, searchLegislators, type LegislatorCard } from "@/lib/queries";
import { chamberLabel, formatDate, partyShort } from "@/lib/site";
import { stateBySlug, type StateSlug } from "@/lib/states";
import { TOPICS, topicBySlug } from "@/lib/topics";

function requireState(slug: StateSlug) {
  const state = stateBySlug(slug);
  if (!state) notFound();
  return state;
}

function stateOrThrow(slug: StateSlug) {
  const state = stateBySlug(slug);
  if (!state) throw new Error(`Unknown state section: ${slug}`);
  return state;
}

export async function billMetadata(stateSlug: StateSlug, slug: string): Promise<Metadata> {
  const state = requireState(stateSlug);
  if (!databaseConfigured()) return { title: "Bill" };
  try {
    const bill = await getBill(state.id, slug);
    if (!bill) return { title: "Bill not found" };
    return {
      title: `${bill.identifier}: ${bill.title}`,
      description: bill.summary.slice(0, 180),
    };
  } catch {
    return { title: "Bill" };
  }
}

export async function BillDetailPage({ stateSlug, slug }: { stateSlug: StateSlug; slug: string }) {
  const state = requireState(stateSlug);
  if (!databaseConfigured()) {
    return <StatusBanner>Connect the database to open bill pages.</StatusBanner>;
  }
  let bill;
  let failed = false;
  try {
    bill = await getBill(state.id, slug);
  } catch (error) {
    await logError(error, `/${state.slug}/bills/${slug}`);
    failed = true;
  }
  if (failed) return <StatusBanner>This bill could not be loaded.</StatusBanner>;
  if (!bill) notFound();
  return (
    <article className="space-y-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-crimson">
        {state.name} · {bill.identifier} · {chamberLabel(bill.chamber)} · {bill.sessionName}
      </p>
      <h1 className="font-serif text-3xl leading-tight text-navy sm:text-4xl">{bill.title}</h1>
      {state.fullTime ? <p className="text-sm text-muted">{state.sessionNote}</p> : null}
      <section className="rounded-lg border border-line bg-paper p-4">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">Plain-English summary</h2>
        <p className="mt-2 text-base leading-relaxed">{bill.summary}</p>
        <p className="mt-2 text-xs text-muted">{state.summaryNote}</p>
      </section>
      {bill.officialSummary && !bill.summary.startsWith("Official caption:") ? (
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">Official summary</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink">{bill.officialSummary}</p>
        </section>
      ) : null}
      {bill.watchNote ? (
        <aside className="border-l-4 border-crimson bg-paper px-4 py-3">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-crimson">Watch note · opinion</h2>
          <p className="mt-1 text-sm leading-relaxed">{bill.watchNote}</p>
        </aside>
      ) : null}
      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="font-semibold text-muted">Status / last action</dt>
          <dd>
            {bill.lastAction || bill.status || "Not listed"} · {formatDate(bill.lastActionDate)}
          </dd>
        </div>
        <div>
          <dt className="font-semibold text-muted">Chamber</dt>
          <dd>{chamberLabel(bill.chamber)}</dd>
        </div>
        <GovernorLine action={bill.governorAction} />
      </dl>
      <section>
        <h2 className="font-serif text-2xl text-navy">Sponsors</h2>
        {bill.sponsors.length === 0 ? (
          <p className="mt-2 text-sm text-muted">No sponsors were listed in the official record.</p>
        ) : (
          <ul className="mt-2 space-y-1 text-sm">
            {bill.sponsors.map((sponsor) => (
              <li key={sponsor.name}>
                {sponsor.slug ? (
                  <Link className="font-semibold text-navy underline" href={`/${state.slug}/legislators/${sponsor.slug}`}>
                    {sponsor.name}
                  </Link>
                ) : (
                  <span className="font-semibold">{sponsor.name}</span>
                )}
                {sponsor.isPrimary ? " · primary sponsor" : ""}
                {sponsor.party ? ` · ${partyShort(sponsor.party)}` : ""}
                {sponsor.district ? ` · ${chamberLabel(sponsor.chamber)} ${sponsor.district}` : ""}
              </li>
            ))}
          </ul>
        )}
      </section>
      <Passage votes={bill.passageVotes} />
      <ActionHistory actions={bill.actions} />
      <div className="flex flex-wrap gap-2">
        {bill.topics.map((topic) => (
          <Link
            key={topic.slug}
            href={`/${state.slug}/topics/${topic.slug}`}
            className="rounded-full bg-cream px-3 py-1 text-sm font-semibold text-navy"
          >
            {topic.name}
          </Link>
        ))}
      </div>
      <p className="text-sm">
        <a className="font-semibold text-crimson underline" href={bill.sourceUrl}>
          {state.billLinkLabel}
        </a>
        {bill.textUrl ? (
          <>
            {" · "}
            <a className="font-semibold text-navy underline" href={bill.textUrl}>
              {state.textLinkLabel}
            </a>
          </>
        ) : null}
        {bill.memoUrl ? (
          <>
            {" · "}
            <a className="font-semibold text-navy underline" href={bill.memoUrl}>
              Co-sponsorship memo
            </a>
          </>
        ) : null}
      </p>
    </article>
  );
}

function GovernorLine({ action }: { action: GovernorAction | null }) {
  if (!action?.status && !action?.actNumber) return null;
  const bits = [
    action.status,
    action.decisionDate ? formatDate(action.decisionDate) : null,
    action.actNumber ? `Act ${action.actNumber}` : null,
  ]
    .filter(Boolean)
    .join(" · ");
  return (
    <div>
      <dt className="font-semibold text-muted">Governor</dt>
      <dd>{bits}</dd>
    </div>
  );
}

function Passage({ votes }: { votes: PassageVote[] | null }) {
  if (!votes?.length) return null;
  return (
    <section>
      <h2 className="font-serif text-2xl text-navy">Recorded floor tallies</h2>
      <ul className="mt-2 space-y-2 text-sm">
        {votes.map((vote, index) => (
          <li key={`${vote.date}-${vote.chamber}-${index}`} className="rounded-md border border-line bg-paper px-3 py-2">
            {chamberLabel(vote.chamber)} · {vote.motionText || "Vote"} · {vote.result || "result not listed"} · {vote.yea ?? "?"}{" "}
            yea, {vote.nay ?? "?"} nay
            {vote.date ? ` · ${formatDate(vote.date)}` : ""}
          </li>
        ))}
      </ul>
      <p className="mt-2 text-xs text-muted">
        Tallies are the floor totals from the legislative record. How each member voted is on the legislator pages when a roll call
        was published.
      </p>
    </section>
  );
}

function ActionHistory({ actions }: { actions: BillAction[] | null }) {
  if (!actions?.length) return null;
  const rows = [...actions].reverse();
  return (
    <section>
      <h2 className="font-serif text-2xl text-navy">Action history</h2>
      <ol className="mt-2 space-y-2 text-sm">
        {rows.map((action, index) => (
          <li key={`${action.date ?? "undated"}-${index}`} className="rounded-md border border-line bg-paper px-3 py-2">
            <span className="text-muted">{action.date ? formatDate(action.date) : "No date"}</span>
            {" · "}
            {action.text}
          </li>
        ))}
      </ol>
      <p className="mt-2 text-xs text-muted">Newest action first. The wording is the legislature&apos;s, not a paraphrase.</p>
    </section>
  );
}

export function billsIndexMetadata(stateSlug: StateSlug): Metadata {
  const state = stateOrThrow(stateSlug);
  return {
    title: `${state.name} bills`,
    description: `Search ${state.legislatureName} bills with plain-English summaries, sponsors, and official links.`,
  };
}

export async function BillsIndexPage({
  stateSlug,
  q,
  topic,
}: {
  stateSlug: StateSlug;
  q: string;
  topic: string;
}) {
  const state = requireState(stateSlug);
  const topicInfo = topic ? topicBySlug(topic) : null;
  const heading = topicInfo ? topicInfo.name : `${state.name} bills`;
  if (!databaseConfigured()) {
    return (
      <div className="space-y-4">
        <h1 className="font-serif text-3xl text-navy">{heading}</h1>
        <BillSearch stateSlug={state.slug} q={q} />
        <StatusBanner>Connect the database to search bills.</StatusBanner>
        <SignupForm />
      </div>
    );
  }
  let bills;
  let failed = false;
  try {
    bills = await searchBills({ stateId: state.id, q, topic: topicInfo?.slug });
  } catch (error) {
    await logError(error, `/${state.slug}/bills`);
    failed = true;
  }
  if (failed || !bills) {
    return (
      <div className="space-y-4">
        <h1 className="font-serif text-3xl text-navy">{heading}</h1>
        <StatusBanner>Search is unavailable until the database responds.</StatusBanner>
        <SignupForm />
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <h1 className="font-serif text-3xl text-navy">{heading}</h1>
      <p className="text-sm text-muted">
        {topicInfo
          ? topicInfo.description
          : state.fullTime
            ? `Search by bill number or a word from the title. ${state.sessionNote}`
            : "Search by bill number, title, or a word from the summary."}
      </p>
      <BillSearch
        stateSlug={state.slug}
        q={q}
        topic={topicInfo?.slug}
        placeholder={state.slug === "pennsylvania" ? "Search bills, such as voter ID or HB 437" : undefined}
      />
      {bills.length === 0 ? (
        <StatusBanner>{q ? `No bills matched “${q}”.` : "No bills are loaded for this view."}</StatusBanner>
      ) : (
        <div className="grid gap-3">
          {bills.map((bill) => (
            <BillCardView key={bill.id} bill={bill} stateSlug={state.slug} />
          ))}
        </div>
      )}
      <SignupForm />
    </div>
  );
}

export function topicMetadata(slug: string): Metadata {
  const topic = topicBySlug(slug);
  if (!topic) return { title: "Topic" };
  return { title: `${topic.name} bills`, description: topic.description };
}

export function topicParams() {
  return TOPICS.map((topic) => ({ slug: topic.slug }));
}

export async function TopicPage({
  stateSlug,
  slug,
  q,
}: {
  stateSlug: StateSlug;
  slug: string;
  q: string;
}) {
  const state = requireState(stateSlug);
  const topic = topicBySlug(slug);
  if (!topic) notFound();
  if (!databaseConfigured()) {
    return (
      <div className="space-y-4">
        <h1 className="font-serif text-3xl text-navy">
          {state.name} · {topic.name}
        </h1>
        <p className="text-sm text-muted">{topic.description}</p>
        <StatusBanner>Connect the database to load this topic.</StatusBanner>
      </div>
    );
  }
  let bills;
  let failed = false;
  try {
    bills = await searchBills({ stateId: state.id, q, topic: topic.slug });
  } catch (error) {
    await logError(error, `/${state.slug}/topics/${slug}`);
    failed = true;
  }
  if (failed || !bills) return <StatusBanner>This topic could not be loaded.</StatusBanner>;
  return (
    <div className="space-y-4">
      <h1 className="font-serif text-3xl text-navy">
        {state.name} · {topic.name}
      </h1>
      <p className="max-w-2xl text-sm text-muted">{topic.description}</p>
      <BillSearch stateSlug={state.slug} q={q} topic={topic.slug} />
      {bills.length === 0 ? (
        <StatusBanner>
          {q ? `No ${topic.name.toLowerCase()} bills matched “${q}”.` : "No bills are tagged with this topic yet."}
        </StatusBanner>
      ) : (
        <div className="grid gap-3">
          {bills.map((bill) => (
            <BillCardView key={bill.id} bill={bill} stateSlug={state.slug} />
          ))}
        </div>
      )}
    </div>
  );
}

export function legislatorsMetadata(stateSlug: StateSlug): Metadata {
  const state = stateOrThrow(stateSlug);
  return {
    title: `${state.name} legislators`,
    description: `Find ${state.name} state senators and representatives by name, district, county, ZIP, or street address.`,
  };
}

export async function LegislatorsPage({
  stateSlug,
  params,
}: {
  stateSlug: StateSlug;
  params: { q?: string; district?: string; chamber?: string; county?: string; zip?: string; address?: string };
}) {
  const state = requireState(stateSlug);
  const q = params.q?.trim() || "";
  const county = params.county?.trim() || "";
  const zip = (params.zip || "").replace(/\D/g, "").slice(0, 5);
  const address = params.address?.trim() || "";
  const district = Number(params.district);
  const chamber = params.chamber === "house" || params.chamber === "senate" ? params.chamber : "";
  const counties = await countyNames(state.slug);

  let note: string | null = null;
  let hits: DistrictHit[] = [];
  if (zip.length === 5) {
    const found = await districtsForZip(state.slug, zip);
    if (!found) note = `That ZIP is not in the ${state.name} district file.`;
    else {
      hits = found.districts;
      const place = found.city || `ZIP ${zip}`;
      const where = found.counties.length ? ` in ${found.counties.join(", ")}` : "";
      const houseCount = found.districts.filter((hit) => hit.chamber === "house").length;
      const senateCount = found.districts.filter((hit) => hit.chamber === "senate").length;
      note =
        houseCount > 1 || senateCount > 1
          ? `${place}${where} covers more than one district. The roster below includes each district with a real share of this ZIP. A ZIP can cross district lines.`
          : `${place}${where}. Districts below are the ones that cover this ZIP. A ZIP can still cross a line.`;
    }
  } else if (address) {
    const found = await districtsForAddress(address, state.censusState);
    note =
      found.error ||
      (found.matchedAddress ? `Matched ${found.matchedAddress}${found.county ? `, ${found.county} County` : ""}.` : null);
    hits = found.districts;
  }

  if (!databaseConfigured()) {
    return (
      <div className="space-y-4">
        <h1 className="font-serif text-3xl text-navy">Find your {state.name} legislators</h1>
        <Finder stateSlug={state.slug} defaults={{ q, district: params.district, chamber, county, zip: params.zip, address }} counties={counties} placeholder={state.addressPlaceholder} />
        <StatusBanner>Connect the database to show the roster.</StatusBanner>
      </div>
    );
  }

  let people;
  let failed = false;
  try {
    people = await searchLegislators({
      stateId: state.id,
      q: hits.length ? undefined : q,
      county: hits.length ? undefined : county,
      district: hits.length ? undefined : Number.isFinite(district) ? district : undefined,
      chamber: hits.length ? undefined : chamber || undefined,
      districts: hits.map((hit) => ({ chamber: hit.chamber, district: hit.district })),
    });
  } catch (error) {
    await logError(error, `/${state.slug}/legislators`);
    failed = true;
  }
  if (failed || !people) return <StatusBanner>The roster could not be loaded.</StatusBanner>;
  return (
    <div className="space-y-4">
      <h1 className="font-serif text-3xl text-navy">Find your {state.name} legislators</h1>
      <p className="text-sm text-muted">
        Search by name, district, or county. A county match uses the counties listed on the official member record. A ZIP uses a
        Census ZCTA crosswalk and lists every district that covers part of a split ZIP. A street address uses the U.S. Census
        geocoder.
      </p>
      <Finder
        stateSlug={state.slug}
        defaults={{ q, district: params.district, chamber, county, zip: params.zip, address }}
        counties={counties}
        placeholder={state.addressPlaceholder}
      />
      {note ? <StatusBanner>{note}</StatusBanner> : null}
      <Roster stateSlug={state.slug} people={people} />
    </div>
  );
}

function Finder({
  stateSlug,
  defaults,
  counties,
  placeholder,
}: {
  stateSlug: string;
  defaults: { q?: string; district?: string; chamber?: string; county?: string; zip?: string; address?: string };
  counties: string[];
  placeholder: string;
}) {
  return (
    <form className="grid gap-3 rounded-lg border border-line bg-paper p-4 sm:grid-cols-2">
      <label className="text-sm font-semibold">
        Name or city
        <input name="q" defaultValue={defaults.q} className="mt-1 min-h-11 w-full rounded-md border border-line bg-white px-3 font-normal" />
      </label>
      <label className="text-sm font-semibold">
        District number
        <input
          name="district"
          inputMode="numeric"
          defaultValue={defaults.district}
          className="mt-1 min-h-11 w-full rounded-md border border-line bg-white px-3 font-normal"
        />
      </label>
      <label className="text-sm font-semibold">
        Chamber
        <select name="chamber" defaultValue={defaults.chamber || ""} className="mt-1 min-h-11 w-full rounded-md border border-line bg-white px-3 font-normal">
          <option value="">Either</option>
          <option value="house">House</option>
          <option value="senate">Senate</option>
        </select>
      </label>
      <label className="text-sm font-semibold">
        County
        <input
          name="county"
          list={`${stateSlug}-counties`}
          defaultValue={defaults.county}
          className="mt-1 min-h-11 w-full rounded-md border border-line bg-white px-3 font-normal"
        />
        <datalist id={`${stateSlug}-counties`}>
          {counties.map((name) => (
            <option key={name} value={name} />
          ))}
        </datalist>
      </label>
      <label className="text-sm font-semibold">
        ZIP code
        <input name="zip" inputMode="numeric" defaultValue={defaults.zip} className="mt-1 min-h-11 w-full rounded-md border border-line bg-white px-3 font-normal" />
      </label>
      <label className="text-sm font-semibold">
        Street address
        <input
          name="address"
          defaultValue={defaults.address}
          placeholder={placeholder}
          className="mt-1 min-h-11 w-full rounded-md border border-line bg-white px-3 font-normal"
        />
      </label>
      <button type="submit" className="min-h-11 rounded-md bg-navy px-4 font-semibold text-white sm:col-span-2">
        Search
      </button>
    </form>
  );
}

function Roster({ stateSlug, people }: { stateSlug: string; people: LegislatorCard[] }) {
  if (people.length === 0) return <StatusBanner>No legislators matched.</StatusBanner>;
  return (
    <ul className="divide-y divide-line rounded-lg border border-line bg-paper">
      {people.map((person) => (
        <li key={person.id}>
          <Link href={`/${stateSlug}/legislators/${person.slug}`} className="flex items-start justify-between gap-3 px-4 py-3 hover:bg-cream">
            <span>
              <span className="block font-semibold text-navy">{person.name}</span>
              <span className="text-sm text-muted">
                {partyShort(person.party) ? `${partyShort(person.party)} · ` : ""}
                {chamberLabel(person.chamber)} {person.district}
                {person.residence ? ` · ${person.residence}` : ""}
                {person.counties.length ? ` · ${person.counties.slice(0, 3).join(", ")}` : ""}
              </span>
            </span>
            {!person.isCurrent ? <span className="text-xs text-muted">{person.status || "Former"}</span> : null}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export async function legislatorMetadata(stateSlug: StateSlug, slug: string): Promise<Metadata> {
  const state = requireState(stateSlug);
  if (!databaseConfigured()) return { title: "Legislator" };
  try {
    const row = await getLegislator(state.id, slug);
    if (!row) return { title: "Legislator not found" };
    const person = row.person;
    return {
      title: person.name,
      description: `${person.name}, ${chamberLabel(person.chamber)} District ${person.district}, and the tracked bills and recorded votes on file.`,
    };
  } catch {
    return { title: "Legislator" };
  }
}

export async function LegislatorDetailPage({ stateSlug, slug }: { stateSlug: StateSlug; slug: string }) {
  const state = requireState(stateSlug);
  if (!databaseConfigured()) return <StatusBanner>Connect the database to open legislator pages.</StatusBanner>;
  let row;
  let failed = false;
  try {
    row = await getLegislator(state.id, slug);
  } catch (error) {
    await logError(error, `/${state.slug}/legislators/${slug}`);
    failed = true;
  }
  if (failed) return <StatusBanner>This legislator page could not be loaded.</StatusBanner>;
  if (!row) notFound();
  const { person, sponsored, recorded } = row;
  return (
    <article className="space-y-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-crimson">
        {state.name} · {chamberLabel(person.chamber)} District {person.district}
        {person.party ? ` · ${person.party}` : ""}
        {!person.isCurrent ? ` · ${person.status || "Not current"}` : ""}
      </p>
      <div className="flex items-start gap-4">
        {person.imageUrl ? (
          // Official portrait hosted by the legislature.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={person.imageUrl}
            alt=""
            width={96}
            height={120}
            className="h-28 w-24 rounded-md border border-line object-cover object-top"
          />
        ) : (
          <div className="flex h-28 w-24 items-center justify-center rounded-md bg-navy font-serif text-2xl text-white">
            {partyShort(person.party) || state.name.slice(0, 2).toUpperCase()}
          </div>
        )}
        <div>
          <h1 className="font-serif text-3xl text-navy">{person.name}</h1>
          {person.leadershipRole ? <p className="text-sm">{person.leadershipRole}</p> : null}
          <p className="mt-1 text-sm text-muted">
            {person.residence ? `${person.residence}` : "Residence not listed"}
            {person.counties.length ? ` · Counties: ${person.counties.join(", ")}` : ""}
          </p>
        </div>
      </div>
      <dl className="grid gap-2 text-sm sm:grid-cols-2">
        {person.email ? (
          <div>
            <dt className="font-semibold text-muted">Email</dt>
            <dd>
              <a className="underline" href={`mailto:${person.email}`}>
                {person.email}
              </a>
            </dd>
          </div>
        ) : null}
        {person.phone ? (
          <div>
            <dt className="font-semibold text-muted">Phone</dt>
            <dd>{person.phone}</dd>
          </div>
        ) : null}
        {person.address ? (
          <div className="sm:col-span-2">
            <dt className="font-semibold text-muted">Office</dt>
            <dd>{person.address}</dd>
          </div>
        ) : null}
      </dl>
      <p className="text-sm">
        <a className="font-semibold text-crimson underline" href={person.profileUrl}>
          Official member page
        </a>
      </p>
      {person.committees?.length ? (
        <p className="text-sm">
          <span className="font-semibold">Committees: </span>
          {person.committees.join(", ")}
        </p>
      ) : null}
      <section>
        <h2 className="font-serif text-2xl text-navy">Sponsored bills we track</h2>
        {sponsored.length === 0 ? (
          <p className="mt-2 text-sm text-muted">None of the bills in this tracker list this member as a sponsor.</p>
        ) : (
          <ul className="mt-2 space-y-2 text-sm">
            {sponsored.map((bill) => (
              <li key={bill.slug}>
                <Link className="font-semibold text-navy underline" href={`/${state.slug}/bills/${bill.slug}`}>
                  {bill.identifier}
                </Link>{" "}
                {bill.title}
                {bill.isPrimary ? " · primary sponsor" : ""}
                {bill.status ? ` · ${bill.status}` : ""}
              </li>
            ))}
          </ul>
        )}
      </section>
      <section>
        <h2 className="font-serif text-2xl text-navy">Recorded votes on tracked bills</h2>
        {recorded.length === 0 ? (
          <p className="mt-2 text-sm text-muted">No floor vote on a tracked bill is on file for this member.</p>
        ) : (
          <ul className="mt-2 space-y-2 text-sm">
            {recorded.map((vote) => (
              <li key={vote.id} className="rounded-md border border-line bg-paper px-3 py-2">
                <span className="font-semibold">{vote.position}</span>
                {" · "}
                {vote.billSlug ? (
                  <Link className="underline" href={`/${state.slug}/bills/${vote.billSlug}`}>
                    {vote.billIdentifier}
                  </Link>
                ) : (
                  vote.billIdentifier
                )}{" "}
                {vote.billTitle ? `· ${vote.billTitle}` : ""}
                <span className="block text-muted">
                  {vote.motion || "Vote"} · {vote.result || "result not listed"} · {formatDate(vote.voteDate)}
                  {vote.yea != null ? ` · ${vote.yea}–${vote.nay ?? "?"}` : ""}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </article>
  );
}
