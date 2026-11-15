import { execFile } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { and, eq, inArray, notInArray, sql, type SQL } from "drizzle-orm";
import { TOPICS } from "../src/lib/topics";
import { billSponsors, billTopics, bills, legislators, states, topics, votes } from "../src/db/schema";
import { openScriptDb } from "./script-db";

const execFileAsync = promisify(execFile);

const API = "https://apps.azleg.gov/api";
const ROSTER_URL = "https://www.azleg.gov/memberroster/";
const USER_AGENT = "AmericanCapitolWatch/1.0 (Arizona legislative research; responses are cached)";

const SESSIONS = {
  2025: { id: 129, name: "2025 First Regular Session" },
  2026: { id: 130, name: "2026 Second Regular Session" },
} as const;

const SHORTLIST: { year: 2025 | 2026; number: string; topic: string }[] = [
  { year: 2025, number: "HB2004", topic: "elections" },
  { year: 2025, number: "HB2006", topic: "elections" },
  { year: 2025, number: "HB2007", topic: "elections" },
  { year: 2025, number: "HB2017", topic: "elections" },
  { year: 2025, number: "HB2038", topic: "elections" },
  { year: 2025, number: "SB1001", topic: "elections" },
  { year: 2026, number: "HCR2001", topic: "elections" },
  { year: 2026, number: "SB1037", topic: "elections" },
  { year: 2026, number: "SB1040", topic: "elections" },
  { year: 2026, number: "SB1057", topic: "elections" },
  { year: 2025, number: "SB1137", topic: "schools" },
  { year: 2025, number: "SB1451", topic: "schools" },
  { year: 2025, number: "SB1640", topic: "schools" },
  { year: 2026, number: "HB2600", topic: "schools" },
  { year: 2026, number: "SB1142", topic: "schools" },
  { year: 2026, number: "SB1264", topic: "schools" },
  { year: 2026, number: "SB1699", topic: "schools" },
  { year: 2025, number: "HCR2034", topic: "guns" },
  { year: 2025, number: "HB2619", topic: "guns" },
  { year: 2025, number: "SB1143", topic: "guns" },
  { year: 2025, number: "SB1705", topic: "guns" },
  { year: 2026, number: "SB1012", topic: "guns" },
  { year: 2026, number: "SB1058", topic: "guns" },
  { year: 2026, number: "SB1068", topic: "guns" },
  { year: 2026, number: "SB1069", topic: "guns" },
  { year: 2025, number: "HCR2012", topic: "taxes" },
  { year: 2025, number: "HB2421", topic: "taxes" },
  { year: 2025, number: "HB2635", topic: "taxes" },
  { year: 2025, number: "SB1318", topic: "taxes" },
  { year: 2026, number: "HB2261", topic: "taxes" },
  { year: 2026, number: "HB2273", topic: "taxes" },
  { year: 2026, number: "HB2792", topic: "taxes" },
  { year: 2026, number: "SB1221", topic: "taxes" },
  { year: 2025, number: "SB1050", topic: "property-rights" },
  { year: 2026, number: "HB2566", topic: "property-rights" },
  { year: 2026, number: "HB2841", topic: "property-rights" },
  { year: 2026, number: "SB1779", topic: "property-rights" },
  { year: 2025, number: "HB2099", topic: "border" },
  { year: 2025, number: "SB1088", topic: "border" },
  { year: 2025, number: "SB1164", topic: "border" },
  { year: 2025, number: "SB1268", topic: "border" },
  { year: 2026, number: "SB1051", topic: "border" },
  { year: 2026, number: "SB1421", topic: "border" },
  { year: 2026, number: "SB1457", topic: "border" },
  { year: 2026, number: "SB1520", topic: "border" },
  { year: 2025, number: "HCR2058", topic: "abortion" },
  { year: 2025, number: "HB2681", topic: "abortion" },
  { year: 2025, number: "SB1553", topic: "abortion" },
  { year: 2026, number: "HB2060", topic: "abortion" },
  { year: 2026, number: "HB2364", topic: "abortion" },
  { year: 2026, number: "SB1218", topic: "abortion" },
  { year: 2025, number: "HCR2022", topic: "energy" },
  { year: 2025, number: "SB1009", topic: "energy" },
  { year: 2026, number: "HB2388", topic: "energy" },
  { year: 2026, number: "HB2456", topic: "energy" },
];

type Chamber = "house" | "senate";

type AzLegislator = {
  LegislatorId?: number;
  Body?: string | null;
  FirstName?: string | null;
  LastName?: string | null;
  FullName?: string | null;
  Party?: string | null;
};

type AzSponsor = {
  SponsorType?: string | null;
  DisplayOrder?: number | null;
  LegislatorId?: number | null;
  Legislator?: AzLegislator | null;
};

type AzVote = {
  LegislatorId?: number | null;
  Vote?: string | null;
  Legislator?: AzLegislator | null;
};

type AzFloor = {
  CommitteeId?: number | null;
  Action?: string | null;
  Ayes?: number | null;
  Nays?: number | null;
  Excused?: number | null;
  NotVoting?: number | null;
  Absent?: number | null;
  ReportDate?: string | null;
  AssignedDate?: string | null;
  Votes?: AzVote[] | null;
};

type AzAction = {
  Action?: string | null;
  AssignedDate?: string | null;
  ActionDatetime?: string | null;
  ReportDate?: string | null;
  Committee?: { CommitteeName?: string | null; LegislativeBody?: string | null } | null;
};

type AzBill = {
  BillId: number;
  SessionId: number;
  Number: string;
  ShortTitle?: string | null;
  NOWTitle?: string | null;
  Description?: string | null;
  DateIntroduced?: string | null;
  IntroducedDate?: string | null;
  PreFileDate?: string | null;
  GovernorAction?: string | null;
  GovernorActionDate?: string | null;
  ChapterNumber?: number | string | null;
  FinalDisposition?: string | null;
  BillStatusActionText?: string | null;
  House1stRead?: string | null;
  House2ndRead?: string | null;
  Senate1stRead?: string | null;
  Senate2ndRead?: string | null;
  BillStatusAction?: AzAction[] | null;
  FloorHeaders?: { CommitteeId?: number; CommitteeName?: string | null; LegislativeBody?: string | null; ActionDate?: string | null }[] | null;
  BodyTransmittedTo?: { LegislativeBody?: string | null; TransmitDate?: string | null }[] | null;
};

type AzDocument = {
  DocumentName?: string | null;
  HtmlPath?: string | null;
  PdfPath?: string | null;
};

type DistrictCounties = { house: Record<string, string[]>; senate: Record<string, string[]> };

export type ArizonaSnapshot = {
  generatedAt: string;
  voteGaps: string[];
  sources: { name: string; url: string; license: string }[];
  bills: {
    id: string;
    session: string;
    sessionName: string;
    slug: string;
    identifier: string;
    chamber: Chamber;
    title: string;
    summary: string;
    officialSummary: string | null;
    watchNote: string | null;
    status: string | null;
    lastAction: string | null;
    lastActionDate: string | null;
    sourceUrl: string;
    textUrl: string | null;
    memoUrl: string | null;
    billType: string | null;
    governorAction: { status: string; decisionDate: string | null; actNumber: string | null } | null;
    passageVotes: {
      chamber: string | null;
      date: string | null;
      result: string | null;
      motionText: string | null;
      yea: number | null;
      nay: number | null;
      other: number | null;
    }[];
    actions: { date: string | null; chamber: string | null; text: string; vote: string | null }[];
    featured: boolean;
    legislationId: number | null;
    topics: string[];
    sponsors: { name: string; primary: boolean; legislatorId: string | null }[];
  }[];
  legislators: {
    id: string;
    slug: string;
    name: string;
    firstName: string | null;
    lastName: string | null;
    party: string | null;
    chamber: Chamber;
    district: number;
    residence: string | null;
    counties: string[];
    email: string | null;
    phone: string | null;
    address: string | null;
    imageUrl: string | null;
    profileUrl: string;
    committees: string[];
    leadershipRole: string | null;
    status: string | null;
    statusNote: string | null;
    isCurrent: boolean;
  }[];
  votes: {
    id: string;
    billId: string;
    legislatorId: string | null;
    externalVoteId: string;
    chamber: string | null;
    position: string;
    motion: string | null;
    result: string | null;
    yea: number | null;
    nay: number | null;
    voteDate: string | null;
    rollNumber: number | null;
    sourceUrl: string | null;
    session: string | null;
    billIdentifier: string | null;
  }[];
};

const cacheDir = path.join(process.cwd(), "data", "cache", "arizona");

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function exists(file: string): Promise<boolean> {
  try {
    await readFile(file);
    return true;
  } catch {
    return false;
  }
}

async function fetchText(url: string, accept: string): Promise<string> {
  let last = "request failed";
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    await sleep(80);
    try {
      const response = await fetch(url, {
        headers: { Accept: accept, "User-Agent": USER_AGENT },
        signal: AbortSignal.timeout(30000),
      });
      if (!response.ok) {
        last = `${response.status} ${url}`;
        if (response.status < 500 && response.status !== 429) throw new Error(last);
      } else {
        return await response.text();
      }
    } catch (error) {
      last = error instanceof Error ? error.message : String(error);
    }
    await sleep(400 * attempt);
  }
  throw new Error(last);
}

async function cachedText(url: string, file: string, accept: string): Promise<string> {
  if (process.env.AZ_REFRESH !== "1" && (await exists(file))) return readFile(file, "utf8");
  const text = await fetchText(url, accept);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, text);
  return text;
}

async function cachedJson<T>(url: string, file: string): Promise<T> {
  const text = await cachedText(url, file, "application/json");
  return JSON.parse(text) as T;
}

function isoDate(value: string | null | undefined): string | null {
  if (!value) return null;
  const text = value.trim();
  const iso = text.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;
  const us = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (us) return `${us[3]}-${us[1].padStart(2, "0")}-${us[2].padStart(2, "0")}`;
  return null;
}

function meaningful(value: string | null | undefined): string | null {
  const text = (value ?? "").trim();
  if (!text || /^none$/i.test(text)) return null;
  return text;
}

function sentenceCase(value: string): string {
  const text = value.replace(/\s+/g, " ").trim();
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function identifierOf(number: string): string {
  const match = number.match(/^([A-Z]+?)(\d+)$/);
  if (!match) return number;
  return `${match[1]} ${Number(match[2])}`;
}

function slugOf(year: number, number: string): string {
  const match = number.match(/^([A-Z]+?)(\d+)$/);
  if (!match) throw new Error(`Unexpected bill number ${number}`);
  return `${year}-${match[1].toLowerCase()}-${Number(match[2])}`;
}

function chamberOf(number: string): Chamber {
  return number.startsWith("S") ? "senate" : "house";
}

function billTypeOf(number: string): string {
  const prefix = number.match(/^[A-Z]+/)?.[0] ?? "";
  if (prefix.endsWith("CR")) return "concurrent resolution";
  if (prefix.endsWith("CM")) return "concurrent memorial";
  if (prefix.endsWith("JR")) return "joint resolution";
  if (prefix.endsWith("M")) return "memorial";
  if (prefix.endsWith("R")) return "resolution";
  return "bill";
}

function chamberName(code: string | null | undefined): Chamber | null {
  if (code === "H" || code === "house") return "house";
  if (code === "S" || code === "senate") return "senate";
  return null;
}

function chamberWord(code: string | null | undefined): string | null {
  const chamber = chamberName(code);
  if (chamber === "house") return "House";
  if (chamber === "senate") return "Senate";
  return null;
}

function isUnreported(action: string | null | undefined): boolean {
  return !action || /^none$/i.test(action.trim());
}

function htmlToText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#(\d+);/g, (_match, digits: string) => String.fromCharCode(Number(digits)))
    .replace(/[ \t]+\n/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{2,}/g, "\n")
    .trim();
}

function overviewFromFactSheet(html: string): string | null {
  const text = htmlToText(html).replace(/\s+/g, " ");
  const match = text.match(
    /(?:Overview|Purpose)\s+(.{40,1400}?)(?=\s+(?:History|Provisions|Background|Fiscal Impact)\b|\s+-{5,}|\s+DOCUMENT FOOTER)/i,
  );
  if (!match) return null;
  let overview = match[1].replace(/\s+/g, " ").trim();
  if (overview.length > 700) {
    const cut = overview.slice(0, 700);
    const end = cut.lastIndexOf(".");
    overview = end > 200 ? cut.slice(0, end + 1) : cut;
  }
  if (!/[.!?]$/.test(overview)) overview = `${overview}.`;
  return overview;
}

function absoluteUrl(value: string | null | undefined, origin: string): string | null {
  if (!value) return null;
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  if (value.startsWith("/")) return `${origin}${value}`;
  return null;
}

function versionRank(name: string): number {
  const text = name.toLowerCase();
  if (text.includes("chapter")) return 5;
  if (text.includes("conference")) return 4;
  if (text.includes("senate engrossed")) return 3;
  if (text.includes("house engrossed")) return 2;
  if (text.includes("introduced")) return 1;
  return 2;
}

function dateInName(name: string): string {
  const match = name.match(/(\d{2})\/(\d{2})\/(\d{4})/);
  return match ? `${match[3]}-${match[1]}-${match[2]}` : "";
}

function normalizePosition(value: string | null | undefined): string | null {
  const text = (value ?? "").trim().toUpperCase();
  if (text === "Y" || text === "YES") return "yea";
  if (text === "N" || text === "NO") return "nay";
  if (text === "NV" || text === "N/V" || text === "NOT VOTING") return "not voting";
  if (text === "E" || text === "EX" || text === "EXCUSED") return "excused";
  if (text === "A" || text === "ABSENT") return "absent";
  if (text === "P" || text === "PRESENT") return "present";
  return text ? text.toLowerCase() : null;
}

function partyName(code: string | null | undefined): string | null {
  if (!code) return null;
  if (/^D/i.test(code) || /democrat/i.test(code)) return "Democratic";
  if (/^R/i.test(code) || /republican/i.test(code)) return "Republican";
  if (/^I/i.test(code) || /independent/i.test(code)) return "Independent";
  return code;
}

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function decode(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function selectSession(sessionId: number): Promise<void> {
  const body = `id=${sessionId}`;
  for (const url of [
    "https://apps.azleg.gov/BillStatus/UpdateCurrentSession/",
    "https://apps.azleg.gov/BillStatus/setsession.php",
  ]) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json, text/html",
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": USER_AGENT,
        },
        body,
        signal: AbortSignal.timeout(20000),
      });
      console.log(`Session select ${sessionId} via ${url}: HTTP ${response.status}`);
    } catch (error) {
      console.log(`Session select ${sessionId} via ${url} failed: ${error instanceof Error ? error.message : error}`);
    }
  }
}

function parseRoster(html: string, chamber: Chamber): ArizonaSnapshot["legislators"] {
  const tableId = chamber === "house" ? "HouseRoster" : "SenateRoster";
  const start = html.indexOf(`id="${tableId}"`);
  const end = html.indexOf("</table>", start);
  if (start < 0 || end < 0) throw new Error(`Could not find the ${tableId} table on the member roster.`);
  const rows = html.slice(start, end).match(/<tr\b[^>]*>[\s\S]*?<\/tr>/g) ?? [];
  const people: ArizonaSnapshot["legislators"] = [];
  for (const row of rows) {
    const id = row.match(/legislator=(\d+)/)?.[1];
    const name = decode(row.match(/roster-tooltip">([^<]+)/)?.[1] ?? "");
    const district = Number(row.match(/District (\d+)/)?.[1]);
    if (!id || !name || !Number.isInteger(district)) continue;
    const partyTitle = row.match(/<span title="([^"]+)">/)?.[1] ?? null;
    const emailLocal = row.match(/Email:\s*([A-Za-z0-9]+)/)?.[1] ?? null;
    const resigned = decode(row.match(/color:\s*RED[^>]*>([^<]+)/i)?.[1] ?? "");
    const image = row.match(/src="([^"]*MemberPhotos[^"]+)"/)?.[1] ?? null;
    const profile = row.match(/href="(https:\/\/www\.azleg\.gov\/[^"]*legislator=\d+[^"]*)"/)?.[1] ?? null;
    const room = decode(row.match(/<td>\s*(Room[^<]*)<\/td>/i)?.[1] ?? "");
    const phone = decode(row.match(/<td>\s*(\(\d{3}\)[^<]*)<\/td>/)?.[1] ?? "");
    const sitting = !resigned;
    people.push({
      id: `az-leg-${id}`,
      slug: slugify(name),
      name,
      firstName: name.split(/\s+/)[0] ?? null,
      lastName: name.split(/\s+/).slice(1).join(" ") || null,
      party: partyName(partyTitle),
      chamber,
      district,
      residence: null,
      counties: [],
      email: sitting && emailLocal ? `${emailLocal}@azleg.gov` : null,
      phone: phone || null,
      address: room || null,
      imageUrl: image,
      profileUrl: profile ?? `https://www.azleg.gov/memberroster/`,
      committees: [],
      leadershipRole: null,
      status: sitting ? null : "Resigned",
      statusNote: resigned || null,
      isCurrent: sitting,
    });
  }
  return people;
}

function dedupeSlugs(people: ArizonaSnapshot["legislators"]): void {
  const seen = new Map<string, number>();
  for (const person of people) {
    const count = seen.get(person.slug) ?? 0;
    seen.set(person.slug, count + 1);
    if (count > 0) person.slug = `${person.slug}-${person.district}`;
  }
}

async function loadRoster(): Promise<ArizonaSnapshot["legislators"]> {
  const html = await cachedText(ROSTER_URL, path.join(cacheDir, "memberroster.html"), "text/html");
  const people = [...parseRoster(html, "house"), ...parseRoster(html, "senate")];
  dedupeSlugs(people);
  const sittingHouse = people.filter((person) => person.chamber === "house" && person.isCurrent).length;
  const sittingSenate = people.filter((person) => person.chamber === "senate" && person.isCurrent).length;
  const resigned = people.filter((person) => !person.isCurrent);
  if (sittingHouse !== 60 || sittingSenate !== 30) {
    throw new Error(`Expected 60 sitting representatives and 30 sitting senators, found ${sittingHouse} and ${sittingSenate}.`);
  }
  if (resigned.length === 0) throw new Error("The roster had no resignation rows. The parser missed mid-term departures.");
  console.log(
    `Roster: ${sittingHouse} sitting House, ${sittingSenate} sitting Senate, ${resigned.length} resigned (${resigned.map((person) => person.name).join(", ")}).`,
  );
  return people;
}

async function buildCrosswalk(): Promise<DistrictCounties> {
  await execFileAsync("python3", [path.join(process.cwd(), "scripts", "arizona-crosswalk.py")], {
    cwd: process.cwd(),
    timeout: 180000,
    maxBuffer: 20_000_000,
  });
  const file = path.join(cacheDir, "district-counties.json");
  return JSON.parse(await readFile(file, "utf8")) as DistrictCounties;
}

function sponsorName(row: AzSponsor): string {
  const leg = row.Legislator;
  const full = (leg?.FullName ?? "").replace(/\s+/g, " ").trim();
  if (full) return full;
  return [leg?.FirstName, leg?.LastName].filter(Boolean).join(" ").trim();
}

async function loadBill(year: 2025 | 2026, number: string): Promise<{
  bill: AzBill;
  sponsors: AzSponsor[];
  floor: AzFloor[];
  documents: { DocumentGroupCode?: string; Documents?: AzDocument[] }[];
  overview: string | null;
}> {
  const session = SESSIONS[year];
  const stem = path.join(cacheDir, "bills", `${session.id}-${number}`);
  const bill = await cachedJson<AzBill>(
    `${API}/Bill/?sessionId=${session.id}&billNumber=${number}`,
    `${stem}.json`,
  );
  if (!bill?.BillId || Number(bill.SessionId) !== session.id || bill.Number?.replace(/\s+/g, "") !== number) {
    throw new Error(
      `Bill ${year} ${number} did not match session ${session.id}. Got ${bill?.SessionId} ${bill?.Number} id ${bill?.BillId}.`,
    );
  }
  const sponsors = await cachedJson<AzSponsor[]>(`${API}/BillSponsor/?id=${bill.BillId}`, `${stem}-sponsors.json`);
  if (!Array.isArray(sponsors)) throw new Error(`Sponsors for ${number} were not a list.`);
  let floor: AzFloor[] = [];
  try {
    const parsed = await cachedJson<AzFloor[] | { Message?: string }>(
      `${API}/BillStatusFloorAction/?billStatusId=${bill.BillId}`,
      `${stem}-floor.json`,
    );
    floor = Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.log(`No floor roll call file for ${year} ${number}: ${error instanceof Error ? error.message : error}`);
  }
  let documents: { DocumentGroupCode?: string; Documents?: AzDocument[] }[] = [];
  try {
    const parsed = await cachedJson<typeof documents | { Message?: string }>(
      `${API}/DocType/?billStatusId=${bill.BillId}`,
      `${stem}-docs.json`,
    );
    documents = Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.log(`No document list for ${year} ${number}: ${error instanceof Error ? error.message : error}`);
  }
  const docs = documents.flatMap((group) => group.Documents ?? []);
  const summaries = docs
    .filter((doc) => doc.HtmlPath && /summary|fact sheet/i.test(doc.DocumentName ?? ""))
    .sort((a, b) => dateInName(a.DocumentName ?? "").localeCompare(dateInName(b.DocumentName ?? "")));
  const summaryDoc = summaries.at(-1);
  let overview: string | null = null;
  if (summaryDoc?.HtmlPath) {
    const html = await cachedText(summaryDoc.HtmlPath, `${stem}-summary.html`, "text/html");
    overview = overviewFromFactSheet(html);
  }
  return { bill, sponsors, floor, documents, overview };
}

function textUrlOf(documents: { DocumentGroupCode?: string; Documents?: AzDocument[] }[]): string | null {
  const versions = documents.find((group) => group.DocumentGroupCode === "BillDocuments")?.Documents ?? [];
  if (!versions.length) return null;
  const ranked = [...versions].sort((a, b) => versionRank(a.DocumentName ?? "") - versionRank(b.DocumentName ?? ""));
  const best = ranked.at(-1);
  return absoluteUrl(best?.HtmlPath, "https://www.azleg.gov") ?? absoluteUrl(best?.PdfPath, "https://apps.azleg.gov");
}

function buildActions(bill: AzBill, chamber: Chamber): ArizonaSnapshot["bills"][number]["actions"] {
  const rows: ArizonaSnapshot["bills"][number]["actions"] = [];
  const push = (date: string | null, text: string, actionChamber: Chamber | null) => {
    if (!text) return;
    if (rows.some((row) => row.date === date && row.text === text)) return;
    rows.push({ date, chamber: actionChamber, text, vote: null });
  };
  const introduced = isoDate(bill.DateIntroduced) || isoDate(bill.IntroducedDate);
  const prefiled = isoDate(bill.PreFileDate);
  if (prefiled && prefiled !== introduced) push(prefiled, "Prefiled", chamber);
  if (introduced) push(introduced, prefiled && prefiled === introduced ? "Prefiled" : "Introduced", chamber);
  const read = (date: string | null, text: string, actionChamber: Chamber) => {
    if (date) push(date, text, actionChamber);
  };
  read(isoDate(bill.House1stRead), "House first read", "house");
  read(isoDate(bill.House2ndRead), "House second read", "house");
  read(isoDate(bill.Senate1stRead), "Senate first read", "senate");
  read(isoDate(bill.Senate2ndRead), "Senate second read", "senate");
  for (const action of bill.BillStatusAction ?? []) {
    const committee = action.Committee?.CommitteeName?.trim() || null;
    const body = chamberName(action.Committee?.LegislativeBody);
    const date = isUnreported(action.Action)
      ? isoDate(action.AssignedDate) || isoDate(action.ReportDate)
      : isoDate(action.ReportDate) || isoDate(action.ActionDatetime) || isoDate(action.AssignedDate);
    if (isUnreported(action.Action)) {
      push(
        date,
        `Referred to ${committee || "a committee"}. The legislature lists this action as None, which means the referral was not reported.`,
        body,
      );
    } else if (action.Action) {
      const who = [chamberWord(action.Committee?.LegislativeBody), committee].filter(Boolean).join(" ");
      push(date, who ? `${who}: ${action.Action}` : action.Action, body);
    }
  }
  for (const transmit of bill.BodyTransmittedTo ?? []) {
    const body = transmit.LegislativeBody;
    const label =
      body === "G"
        ? "Transmitted to the governor"
        : body === "H"
          ? "Transmitted to the House"
          : body === "S"
            ? "Transmitted to the Senate"
            : body === "SS"
              ? "Transmitted to the Secretary of State"
              : body
                ? `Transmitted to ${body}`
                : null;
    if (label) push(isoDate(transmit.TransmitDate), label, chamberName(body));
  }
  const governor = meaningful(bill.GovernorAction);
  const governorDate = isoDate(bill.GovernorActionDate);
  if (governor) push(governorDate, `Governor action: ${governor}`, null);
  if (bill.ChapterNumber) push(governorDate, `Chapter ${bill.ChapterNumber}`, null);
  rows.sort((a, b) => (a.date ?? "9999").localeCompare(b.date ?? "9999"));
  return rows;
}

export async function buildSnapshot(): Promise<ArizonaSnapshot> {
  if (SHORTLIST.length !== 55) throw new Error(`The Arizona shortlist has ${SHORTLIST.length} bills, not 55.`);
  const seen = new Set<string>();
  for (const item of SHORTLIST) {
    const key = `${item.year}|${item.number}`;
    if (seen.has(key)) throw new Error(`Duplicate shortlist bill ${key}`);
    seen.add(key);
    if (!TOPICS.some((topic) => topic.id === item.topic)) throw new Error(`Unknown topic ${item.topic}`);
  }

  await selectSession(129);
  await selectSession(130);
  const [roster, districtCounties] = await Promise.all([loadRoster(), buildCrosswalk()]);
  const byLegislatorId = new Map(roster.map((person) => [person.id, person]));
  for (const person of roster) {
    const table = person.chamber === "house" ? districtCounties.house : districtCounties.senate;
    person.counties = table[String(person.district)] ?? [];
    if (person.counties.length === 0) {
      throw new Error(`No counties for ${person.chamber} district ${person.district}.`);
    }
  }

  const gaps: string[] = [];
  const billsOut: ArizonaSnapshot["bills"] = [];
  const votesOut: ArizonaSnapshot["votes"] = [];
  let overviews = 0;

  for (const item of SHORTLIST) {
    const session = SESSIONS[item.year];
    const loaded = await loadBill(item.year, item.number);
    const { bill } = loaded;
    const identifier = identifierOf(item.number);
    const sourceUrl = `https://apps.azleg.gov/BillStatus/BillOverview/${bill.BillId}`;
    const nowTitle = meaningful(bill.NOWTitle);
    const shortTitle = (bill.ShortTitle || bill.Description || identifier).replace(/\s+/g, " ").trim();
    const title = sentenceCase(nowTitle || shortTitle);
    const officialBits = [
      nowTitle ? `Now title: ${nowTitle}.` : null,
      `Short title: ${shortTitle}.`,
      nowTitle ? "The Now title is the legislature's title after a strike-everything amendment." : null,
    ].filter(Boolean);
    const overview = loaded.overview;
    if (overview) overviews += 1;
    const summary = overview || `Official short title: ${title}.`;
    const governorStatus = meaningful(bill.GovernorAction);
    const disposition = meaningful(bill.FinalDisposition);
    const chapter = bill.ChapterNumber ? String(bill.ChapterNumber) : null;
    const actions = buildActions(bill, chamberOf(item.number));
    const last = [...actions].reverse().find((action) => action.date) ?? actions.at(-1);
    const status =
      governorStatus ||
      (chapter ? `Chapter ${chapter}` : null) ||
      disposition ||
      meaningful(bill.BillStatusActionText) ||
      last?.text ||
      "No final disposition on file";
    const governorAction = governorStatus
      ? { status: governorStatus, decisionDate: isoDate(bill.GovernorActionDate), actNumber: chapter }
      : chapter
        ? { status: disposition || `Chapter ${chapter}`, decisionDate: isoDate(bill.GovernorActionDate), actNumber: chapter }
        : null;

    const sponsorRows = loaded.sponsors
      .map((row) => ({
        name: sponsorName(row),
        primary: /^prime/i.test(row.SponsorType ?? ""),
        order: row.DisplayOrder ?? 99,
        legislatorId: row.LegislatorId || row.Legislator?.LegislatorId || null,
      }))
      .filter((row) => row.name)
      .sort((a, b) => Number(b.primary) - Number(a.primary) || a.order - b.order);
    const sponsors: ArizonaSnapshot["bills"][number]["sponsors"] = [];
    const sponsorNames = new Set<string>();
    for (const row of sponsorRows) {
      if (sponsorNames.has(row.name)) continue;
      sponsorNames.add(row.name);
      const legislatorId = row.legislatorId ? `az-leg-${row.legislatorId}` : null;
      sponsors.push({
        name: row.name,
        primary: row.primary,
        legislatorId: legislatorId && byLegislatorId.has(legislatorId) ? legislatorId : null,
      });
    }
    if (sponsors.length === 0) gaps.push(`${item.year} ${identifier} has no sponsors from BillSponsor.`);

    const headers = new Map((bill.FloorHeaders ?? []).map((header) => [header.CommitteeId, header]));
    const passageVotes: ArizonaSnapshot["bills"][number]["passageVotes"] = [];
    for (const floor of loaded.floor) {
      const ayes = floor.Ayes ?? 0;
      const nays = floor.Nays ?? 0;
      const other = (floor.NotVoting ?? 0) + (floor.Excused ?? 0) + (floor.Absent ?? 0);
      const memberVotes = floor.Votes ?? [];
      if (ayes + nays + other === 0 && memberVotes.length === 0) continue;
      const header = headers.get(floor.CommitteeId ?? -1);
      const date = isoDate(floor.ReportDate) || isoDate(floor.AssignedDate) || isoDate(header?.ActionDate);
      const body = chamberName(header?.LegislativeBody) || chamberName(memberVotes[0]?.Legislator?.Body);
      const motion = header?.CommitteeName || "Floor vote";
      passageVotes.push({
        chamber: body,
        date,
        result: floor.Action || null,
        motionText: motion,
        yea: floor.Ayes ?? null,
        nay: floor.Nays ?? null,
        other,
      });
      if ((ayes > 0 || nays > 0) && memberVotes.length === 0) {
        gaps.push(`${item.year} ${identifier} ${motion} lists ${ayes}-${nays} and no member roll call.`);
      }
      const externalVoteId = `${bill.BillId}:${floor.CommitteeId ?? "floor"}:${date ?? "undated"}`;
      for (const member of memberVotes) {
        const position = normalizePosition(member.Vote);
        if (!position) continue;
        const rawId = member.LegislatorId || member.Legislator?.LegislatorId;
        const legislatorId = rawId ? `az-leg-${rawId}` : null;
        const linked = legislatorId && byLegislatorId.has(legislatorId) ? legislatorId : null;
        const who = linked || slugify(member.Legislator?.FullName || String(rawId || "unknown"));
        votesOut.push({
          id: `az|${bill.BillId}|${date ?? "undated"}|${floor.CommitteeId ?? "floor"}|${who}`,
          billId: `az|${session.id}|${item.number}`,
          legislatorId: linked,
          externalVoteId,
          chamber: body,
          position,
          motion,
          result: floor.Action || null,
          yea: floor.Ayes ?? null,
          nay: floor.Nays ?? null,
          voteDate: date,
          rollNumber: null,
          sourceUrl,
          session: String(session.id),
          billIdentifier: identifier,
        });
      }
    }

    billsOut.push({
      id: `az|${session.id}|${item.number}`,
      session: String(session.id),
      sessionName: session.name,
      slug: slugOf(item.year, item.number),
      identifier,
      chamber: chamberOf(item.number),
      title,
      summary,
      officialSummary: officialBits.join(" "),
      watchNote: null,
      status,
      lastAction: last?.text ?? status,
      lastActionDate: last?.date ?? isoDate(bill.GovernorActionDate),
      sourceUrl,
      textUrl: textUrlOf(loaded.documents),
      memoUrl: null,
      billType: billTypeOf(item.number),
      governorAction,
      passageVotes,
      actions,
      featured: false,
      legislationId: bill.BillId,
      topics: [item.topic],
      sponsors,
    });
    console.log(`${item.year} ${identifier} ${status} sponsors ${sponsors.length} votes ${passageVotes.length}`);
  }

  const voteIds = new Set<string>();
  const votes = votesOut.filter((vote) => {
    if (voteIds.has(vote.id)) return false;
    voteIds.add(vote.id);
    return true;
  });
  const vetoes = billsOut.filter((bill) => /veto/i.test(bill.governorAction?.status ?? "")).length;
  const snapshot: ArizonaSnapshot = {
    generatedAt: new Date().toISOString(),
    voteGaps: gaps,
    sources: [
      {
        name: "Arizona State Legislature",
        url: "https://www.azleg.gov/",
        license: "Public legislative record. Credit: Arizona State Legislature.",
      },
      {
        name: "Arizona State Legislature bill status API",
        url: "https://apps.azleg.gov/api/",
        license: "Public legislative record. Credit: Arizona State Legislature.",
      },
      {
        name: "U.S. Census Bureau legislative district relationship files and cartographic boundaries",
        url: "https://www2.census.gov/geo/tiger/GENZ2024/shp/cb_2024_04_sldl_500k.zip",
        license: "U.S. Census Bureau public data",
      },
    ],
    bills: billsOut,
    legislators: roster,
    votes,
  };
  if (snapshot.bills.length !== 55) throw new Error(`Built ${snapshot.bills.length} Arizona bills, not 55.`);
  await mkdir(path.join(process.cwd(), "data", "arizona"), { recursive: true });
  await writeFile(path.join(process.cwd(), "data", "arizona", "snapshot.json"), JSON.stringify(snapshot));
  console.log(
    `Arizona snapshot: ${snapshot.bills.length} bills, ${roster.filter((person) => person.isCurrent).length} sitting legislators, ${votes.length} member votes, ${vetoes} vetoes, ${overviews} fact-sheet overviews.`,
  );
  if (gaps.length) {
    console.log("Gaps:");
    for (const gap of gaps) console.log(`- ${gap}`);
  }
  return snapshot;
}

async function insertChunks<T>(rows: T[], size: number, write: (chunk: T[]) => Promise<void>) {
  for (let index = 0; index < rows.length; index += size) {
    await write(rows.slice(index, index + size));
  }
}

function sqlExcluded(column: string): SQL {
  return sql.raw(`excluded.${column}`);
}

export async function upsertSnapshot(snapshot: ArizonaSnapshot) {
  if (snapshot.bills.length < 55) {
    throw new Error(`Refusing to update Arizona with ${snapshot.bills.length} bills.`);
  }
  for (const bill of snapshot.bills) {
    if (!bill.sourceUrl.startsWith("https://apps.azleg.gov/BillStatus/BillOverview/")) {
      throw new Error(`Refusing bill without an official apps.azleg.gov URL: ${bill.identifier}`);
    }
    if (!bill.summary.trim()) throw new Error(`Missing summary for ${bill.identifier}`);
  }
  const { db, client } = openScriptDb();
  try {
    await db.transaction(async (tx) => {
      await tx
        .insert(states)
        .values({
          id: "az",
          name: "Arizona",
          slug: "arizona",
          legislatureName: "Arizona State Legislature",
        })
        .onConflictDoUpdate({
          target: states.id,
          set: { name: "Arizona", slug: "arizona", legislatureName: "Arizona State Legislature" },
        });
      for (const topic of TOPICS) {
        await tx
          .insert(topics)
          .values(topic)
          .onConflictDoUpdate({
            target: topics.id,
            set: { name: topic.name, slug: topic.slug, description: topic.description, sortOrder: topic.sortOrder },
          });
      }
      await insertChunks(snapshot.legislators, 80, async (chunk) => {
        await tx
          .insert(legislators)
          .values(
            chunk.map((member) => ({
              id: member.id,
              stateId: "az",
              slug: member.slug,
              name: member.name,
              firstName: member.firstName,
              lastName: member.lastName,
              party: member.party,
              chamber: member.chamber,
              district: member.district,
              residence: member.residence,
              counties: member.counties,
              email: member.email,
              phone: member.phone,
              address: member.address,
              imageUrl: member.imageUrl,
              profileUrl: member.profileUrl,
              committees: member.committees,
              leadershipRole: member.leadershipRole,
              status: member.status,
              statusNote: member.statusNote,
              isCurrent: member.isCurrent,
            })),
          )
          .onConflictDoUpdate({
            target: legislators.id,
            set: {
              slug: sqlExcluded("slug"),
              name: sqlExcluded("name"),
              firstName: sqlExcluded("first_name"),
              lastName: sqlExcluded("last_name"),
              party: sqlExcluded("party"),
              chamber: sqlExcluded("chamber"),
              district: sqlExcluded("district"),
              residence: sqlExcluded("residence"),
              counties: sqlExcluded("counties"),
              email: sqlExcluded("email"),
              phone: sqlExcluded("phone"),
              address: sqlExcluded("address"),
              imageUrl: sqlExcluded("image_url"),
              profileUrl: sqlExcluded("profile_url"),
              committees: sqlExcluded("committees"),
              leadershipRole: sqlExcluded("leadership_role"),
              status: sqlExcluded("status"),
              statusNote: sqlExcluded("status_note"),
              isCurrent: sqlExcluded("is_current"),
            },
          });
      });
      const rosterIds = snapshot.legislators.map((member) => member.id);
      if (rosterIds.length) {
        await tx
          .update(legislators)
          .set({ isCurrent: false })
          .where(and(eq(legislators.stateId, "az"), notInArray(legislators.id, rosterIds)));
      }

      for (const bill of snapshot.bills) {
        await tx
          .insert(bills)
          .values({
            id: bill.id,
            stateId: "az",
            session: bill.session,
            sessionName: bill.sessionName,
            slug: bill.slug,
            identifier: bill.identifier,
            chamber: bill.chamber,
            title: bill.title,
            summary: bill.summary,
            officialSummary: bill.officialSummary,
            watchNote: bill.watchNote,
            status: bill.status,
            lastAction: bill.lastAction,
            lastActionDate: bill.lastActionDate,
            sourceUrl: bill.sourceUrl,
            textUrl: bill.textUrl,
            memoUrl: bill.memoUrl,
            billType: bill.billType,
            governorAction: bill.governorAction,
            passageVotes: bill.passageVotes,
            actions: bill.actions,
            featured: bill.featured,
            legislationId: bill.legislationId,
            updatedAt: new Date(),
          })
          .onConflictDoUpdate({
            target: bills.id,
            set: {
              slug: bill.slug,
              title: bill.title,
              summary: bill.summary,
              officialSummary: bill.officialSummary,
              status: bill.status,
              lastAction: bill.lastAction,
              lastActionDate: bill.lastActionDate,
              sourceUrl: bill.sourceUrl,
              textUrl: bill.textUrl,
              governorAction: bill.governorAction,
              passageVotes: bill.passageVotes,
              actions: bill.actions,
              featured: bill.featured,
              sessionName: bill.sessionName,
              updatedAt: new Date(),
            },
          });
      }

      const billIds = snapshot.bills.map((bill) => bill.id);
      await tx.delete(bills).where(and(eq(bills.stateId, "az"), notInArray(bills.id, billIds)));
      await tx.delete(billSponsors).where(inArray(billSponsors.billId, billIds));
      await tx.delete(billTopics).where(inArray(billTopics.billId, billIds));
      await tx.delete(votes).where(inArray(votes.billId, billIds));

      const knownLegislators = new Set(snapshot.legislators.map((member) => member.id));
      const sponsorRows = snapshot.bills.flatMap((bill) => {
        const names = new Set<string>();
        return bill.sponsors.flatMap((sponsor, index) => {
          const name = sponsor.name.trim();
          if (!name || names.has(name)) return [];
          names.add(name);
          return [
            {
              billId: bill.id,
              legislatorId: sponsor.legislatorId && knownLegislators.has(sponsor.legislatorId) ? sponsor.legislatorId : null,
              name,
              isPrimary: sponsor.primary,
              sortOrder: index,
            },
          ];
        });
      });
      await insertChunks(sponsorRows, 200, async (chunk) => {
        if (chunk.length) await tx.insert(billSponsors).values(chunk);
      });
      const topicRows = snapshot.bills.flatMap((bill) => bill.topics.map((topicId) => ({ billId: bill.id, topicId })));
      await insertChunks(topicRows, 200, async (chunk) => {
        if (chunk.length) await tx.insert(billTopics).values(chunk);
      });
      const voteRows = snapshot.votes.map((vote) => ({
        ...vote,
        legislatorId: vote.legislatorId && knownLegislators.has(vote.legislatorId) ? vote.legislatorId : null,
      }));
      await insertChunks(voteRows, 400, async (chunk) => {
        if (chunk.length) await tx.insert(votes).values(chunk);
      });
    });
  } finally {
    await client.end({ timeout: 5 });
  }
  console.log("Arizona database updated. Georgia and Pennsylvania rows were not deleted.");
}
