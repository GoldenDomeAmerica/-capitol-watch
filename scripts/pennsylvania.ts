import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";
import { and, eq, inArray, notInArray, sql, type SQL } from "drizzle-orm";
import { TOPICS } from "../src/lib/topics";
import { plainSummary } from "../src/lib/summary";
import { billSponsors, billTopics, bills, legislators, states, topics, votes } from "../src/db/schema";
import { openScriptDb } from "./script-db";

const execFileAsync = promisify(execFile);

const BILL_HISTORY_URL = "https://www.palegis.us/data/file?documentType=BillHistoryData&session=2025_0";
const HOUSE_MEMBERS_URL = "https://www.palegis.us/house/rss/session/members";
const SENATE_MEMBERS_URL = "https://www.palegis.us/senate/rss/session/members";
const SLDL_URL =
  "https://www2.census.gov/geo/docs/maps-data/data/rel2020/cd-sld/tab20_sldl202420_zcta520_natl.txt";
const SLDU_URL =
  "https://www2.census.gov/geo/docs/maps-data/data/rel2020/cd-sld/tab20_sldu202420_zcta520_natl.txt";
const USER_AGENT = "AmericanCapitolWatch/1.0 (Pennsylvania legislative research; responses are cached)";
const SESSION = "2025_0";
const SESSION_NAME = "2025-2026 Regular Session";

const SHORTLIST: Record<string, string[]> = {
  elections: ["HB 437", "HB 759", "HB 771", "HB 1193", "HB 1298", "HB 1422", "SB 705", "SB 1367"],
  schools: ["HB 581", "HB 1489", "HB 1500", "HB 1763", "HB 2594", "SB 10", "SB 304", "SB 706", "SB 969"],
  taxes: ["HB 310", "HB 582", "HB 1394", "HB 2066", "SB 100", "SB 394", "SB 750", "SB 962"],
  "property-rights": ["HB 96", "HB 247", "HB 1464", "SB 225", "SB 574", "SB 1098"],
  guns: ["HB 454", "HB 483", "HB 548", "HB 1593", "SB 122", "SB 200", "SB 242", "SB 244", "SB 357"],
  energy: ["HB 347", "HB 1946", "HB 2129", "SB 102", "SB 524", "SB 910", "SB 1358"],
  abortion: ["HB 1801", "HB 1841", "HB 1844", "HB 1957", "HB 1962", "SB 837", "SB 881"],
};

type Chamber = "house" | "senate";

export type PennsylvaniaSnapshot = {
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

const cacheDir = path.join(process.cwd(), "data", "cache");

let nextPalegisSlot = 0;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function throttlePalegis(): Promise<void> {
  const now = Date.now();
  const wait = Math.max(0, nextPalegisSlot - now);
  nextPalegisSlot = Math.max(nextPalegisSlot, now) + 450;
  if (wait) await sleep(wait);
}

async function exists(file: string): Promise<boolean> {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

async function download(url: string, cachePath: string, polite: boolean): Promise<string> {
  if (await exists(cachePath)) {
    const cached = await readFile(cachePath, "utf8");
    if (cached.trim()) return cached;
  }
  await mkdir(path.dirname(cachePath), { recursive: true });
  let lastError: unknown;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      if (polite) await throttlePalegis();
      const response = await fetch(url, {
        headers: { "user-agent": USER_AGENT, accept: "*/*" },
        signal: AbortSignal.timeout(180000),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);
      const text = await response.text();
      if (!text.trim()) throw new Error(`Empty response for ${url}`);
      await writeFile(cachePath, text);
      return text;
    } catch (error) {
      lastError = error;
      console.warn(`Attempt ${attempt} failed for ${url}: ${error instanceof Error ? error.message : error}`);
      await sleep(1500 * attempt);
    }
  }
  throw lastError instanceof Error ? lastError : new Error(`Failed to download ${url}`);
}

function decodeXml(value: string): string {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, num: string) => String.fromCodePoint(Number(num)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function attrs(raw: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const match of raw.matchAll(/([A-Za-z0-9_:-]+)="([^"]*)"/g)) {
    out[match[1]] = decodeXml(match[2]);
  }
  return out;
}

function tagText(body: string, tag: string): string {
  const match = body.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`));
  return match ? decodeXml(match[1]) : "";
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 72);
}

function stripSuffix(value: string): string {
  return value.replace(/\s+(JR|SR|II|III|IV|V)\.?$/i, "").trim();
}

function properName(value: string): string {
  return value
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) =>
      part
        .split("-")
        .map((piece) => (piece ? piece.charAt(0).toUpperCase() + piece.slice(1) : piece))
        .join("-"),
    )
    .join(" ")
    .replace(/([A-Za-z])'([a-z])/g, (_, left: string, right: string) => `${left}'${right.toUpperCase()}`);
}

function partyName(code: string): string | null {
  if (code === "R") return "Republican";
  if (code === "D") return "Democratic";
  const trimmed = code.trim();
  return trimmed || null;
}

function parseCounties(value: string): string[] {
  return value
    .replace(/\(part\)/gi, "")
    .split(/\s+and\s+|,\s*/i)
    .map((part) => part.trim().replace(/\s+count(?:y|ies)$/i, "").trim())
    .filter(Boolean);
}

function parseShortDate(value: string): string | null {
  const match = value.trim().match(/^(\d{2})\/(\d{2})\/(\d{2})$/);
  if (!match) return null;
  const year = Number(match[3]);
  const full = year >= 70 ? 1900 + year : 2000 + year;
  return `${full}-${match[1]}-${match[2]}`;
}

function parseTally(value: string): { yea: number | null; nay: number | null } {
  const match = value.match(/\((\d+)\s*-\s*(\d+)\)/);
  if (!match) return { yea: null, nay: null };
  return { yea: Number(match[1]), nay: Number(match[2]) };
}

function chamberOf(body: string): Chamber | null {
  if (body === "H") return "house";
  if (body === "S") return "senate";
  return null;
}

function billPublicUrl(chamber: Chamber, number: number): string {
  return `https://www.palegis.us/legislation/bills/2025/${chamber === "house" ? "hb" : "sb"}${number}`;
}

function lastToken(value: string): string {
  const parts = stripSuffix(value)
    .toUpperCase()
    .replace(/[^A-Z0-9' ]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
  return parts[parts.length - 1] ?? "";
}

function officeLine(label: string, street1: string, street2: string, city: string, phone: string): string | null {
  const place = [street1, street2, city].filter(Boolean).join(", ");
  if (!place && !phone) return null;
  const bits = [label, place, phone].filter(Boolean);
  return bits.join(" · ");
}

type RawMember = PennsylvaniaSnapshot["legislators"][number];

function parseMembers(xml: string, chamber: Chamber): RawMember[] {
  const rows: RawMember[] = [];
  for (const item of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
    const body = item[1];
    const title = tagText(body, "title");
    const link = tagText(body, "link");
    const memberId = link.match(/memberId=(\d+)/)?.[1];
    const district = Number(tagText(body, "parss:District"));
    if (!title || !memberId || !Number.isFinite(district)) continue;
    const vacant = /<parss:Vacant>\s*true\s*<\/parss:Vacant>/i.test(body);
    const name = properName(stripSuffix(title));
    const nameParts = name.split(" ");
    const counties = parseCounties(tagText(body, "parss:County"));
    const districtStreet = tagText(body, "parss:District_1_Street1");
    const districtStreet2 = tagText(body, "parss:District_1_Street2");
    const districtCity = tagText(body, "parss:District_1_CityStateZip");
    const districtPhone = tagText(body, "parss:District_1_Phone");
    const capitolStreet = tagText(body, "parss:CapitolAddress_Street1");
    const capitolStreet2 = tagText(body, "parss:CapitolAddress_Street2");
    const capitolCity = tagText(body, "parss:CapitolAddress_CityStateZip");
    const capitolPhone = tagText(body, "parss:CapitolAddress_Phone");
    const image = tagText(body, "parss:ImageSrc");
    const residence = districtCity.split(",")[0]?.trim() || null;
    rows.push({
      id: `pa-${chamber === "house" ? "h" : "s"}-${memberId}`,
      slug: "",
      name,
      firstName: nameParts.slice(0, -1).join(" ") || null,
      lastName: nameParts[nameParts.length - 1] ?? null,
      party: partyName(tagText(body, "parss:Party")),
      chamber,
      district,
      residence,
      counties,
      email: null,
      phone: capitolPhone || districtPhone || null,
      address: [
        officeLine("District", districtStreet, districtStreet2, districtCity, districtPhone),
        officeLine("Capitol", capitolStreet, capitolStreet2, capitolCity, capitolPhone),
      ]
        .filter((line): line is string => Boolean(line))
        .join(" | "),
      imageUrl: image || null,
      profileUrl: link,
      committees: [],
      leadershipRole: null,
      status: vacant ? "Vacant" : null,
      statusNote: null,
      isCurrent: !vacant,
    });
  }
  return rows;
}

type ParsedBill = {
  identifier: string;
  number: number;
  chamber: Chamber;
  title: string;
  memoUrl: string | null;
  textUrl: string | null;
  actions: PennsylvaniaSnapshot["bills"][number]["actions"];
  sponsors: { sequence: number; name: string; party: string; chamber: Chamber; district: number }[];
  subType: string;
};

function parseBill(body: string): ParsedBill | null {
  const chamber = chamberOf(tagText(body, "body"));
  const type = tagText(body, "type");
  const number = Number(tagText(body, "number"));
  if (!chamber || type !== "B" || !Number.isFinite(number)) return null;
  const identifier = `${chamber === "house" ? "HB" : "SB"} ${number}`;
  const printers = [...body.matchAll(/<number\b([^>]*)>(\d+)<\/number>/g)].map((match) => ({
    sequence: Number(attrs(match[1]).sequence ?? 0),
    url: attrs(match[1]).billTextPdfUrl || null,
  }));
  const withUrl = printers.filter((row) => row.url).sort((a, b) => a.sequence - b.sequence);
  const memo = body.match(/<cosponsorshipMemo\b([^>]*)>([\s\S]*?)<\/cosponsorshipMemo>/);
  const sponsors = [...body.matchAll(/<sponsor\b([^>]*)>([^<]*)<\/sponsor>/g)].map((match) => {
    const values = attrs(match[1]);
    return {
      sequence: Number(values.sequenceNumber ?? 0),
      name: decodeXml(match[2]),
      party: values.party ?? "",
      chamber: chamberOf(values.body ?? "") ?? chamber,
      district: Number(values.districtNumber),
    };
  });
  const actions = [...body.matchAll(/<action\b([^>]*)>([\s\S]*?)<\/action>/g)]
    .map((match) => {
      const values = attrs(match[1]);
      const inner = match[2];
      const vote = tagText(inner, "rollCallVote");
      return {
        sequence: Number(values.sequence ?? 0),
        date: parseShortDate(tagText(inner, "date")),
        chamber: values.actionChamber === "H" ? "house" : values.actionChamber === "S" ? "senate" : values.actionChamber || null,
        text: tagText(inner, "fullAction"),
        vote: vote || null,
      };
    })
    .filter((action) => action.text)
    .sort((a, b) => a.sequence - b.sequence);
  return {
    identifier,
    number,
    chamber,
    title: tagText(body, "shortTitle"),
    memoUrl: memo ? attrs(memo[1]).memoUrl || null : null,
    textUrl: withUrl[0]?.url ?? null,
    actions: actions.map(({ date, chamber: actionChamber, text, vote }) => ({
      date,
      chamber: actionChamber,
      text,
      vote,
    })),
    sponsors,
    subType: tagText(body, "subType"),
  };
}

function topicsByIdentifier(): Map<string, string[]> {
  const map = new Map<string, string[]>();
  for (const [topicId, identifiers] of Object.entries(SHORTLIST)) {
    for (const identifier of identifiers) {
      const list = map.get(identifier) ?? [];
      if (!list.includes(topicId)) list.push(topicId);
      map.set(identifier, list);
    }
  }
  return map;
}

async function ensureBillXml(): Promise<string> {
  const xmlPath = path.join(cacheDir, "PA-Bill-History-2025-RegularSession.xml");
  if (await exists(xmlPath)) return xmlPath;
  const zipPath = path.join(cacheDir, "pa-bill-history.zip");
  if (!(await exists(zipPath))) {
    console.log("Downloading the Pennsylvania bill history ZIP.");
    await throttlePalegis();
    const response = await fetch(BILL_HISTORY_URL, {
      headers: { "user-agent": USER_AGENT, accept: "application/zip,*/*" },
      signal: AbortSignal.timeout(240000),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status} for the bill history ZIP`);
    const bytes = Buffer.from(await response.arrayBuffer());
    await mkdir(cacheDir, { recursive: true });
    await writeFile(zipPath, bytes);
  }
  await execFileAsync("unzip", ["-o", zipPath, "-d", cacheDir]);
  if (!(await exists(xmlPath))) throw new Error("The bill history ZIP did not contain the expected XML file.");
  return xmlPath;
}

function readRelationship(
  text: string,
  districtColumn: string,
): Map<string, Map<number, number>> {
  const lines = text.replace(/^\uFEFF/, "").split(/\r?\n/);
  const header = lines[0]?.split("|") ?? [];
  const districtIndex = header.indexOf(districtColumn);
  const zipIndex = header.indexOf("GEOID_ZCTA5_20");
  const partIndex = header.indexOf("AREALAND_PART");
  const totalIndex = header.indexOf("AREALAND_ZCTA5_20");
  if (districtIndex < 0 || zipIndex < 0 || partIndex < 0 || totalIndex < 0) {
    throw new Error(`Unexpected Census relationship header for ${districtColumn}.`);
  }
  const zips = new Map<string, Map<number, number>>();
  for (const line of lines.slice(1)) {
    if (!line) continue;
    const parts = line.split("|");
    const geoid = parts[districtIndex] ?? "";
    if (!geoid.startsWith("42")) continue;
    const district = Number(geoid.slice(2));
    const zip = parts[zipIndex] ?? "";
    const part = Number(parts[partIndex]);
    const total = Number(parts[totalIndex]);
    if (!/^\d{5}$/.test(zip) || !Number.isInteger(district) || district <= 0) continue;
    if (!Number.isFinite(part) || !Number.isFinite(total) || total <= 0 || part <= 0) continue;
    const share = part / total;
    if (share < 0.02) continue;
    const row = zips.get(zip) ?? new Map<number, number>();
    row.set(district, (row.get(district) ?? 0) + share);
    zips.set(zip, row);
  }
  return zips;
}

async function buildZipFile(counties: string[]): Promise<void> {
  const lowerText = await download(SLDL_URL, path.join(cacheDir, "sldl-zcta.txt"), false);
  const upperText = await download(SLDU_URL, path.join(cacheDir, "sldu-zcta.txt"), false);
  const house = readRelationship(lowerText, "GEOID_SLDL2024_20");
  const senate = readRelationship(upperText, "GEOID_SLDU2024_20");
  const zipCodes = new Set([...house.keys(), ...senate.keys()]);
  const zips: Record<
    string,
    { city: string; counties: string[]; house: { district: number; share: number }[]; senate: { district: number; share: number }[] }
  > = {};
  for (const zip of [...zipCodes].sort()) {
    const shares = (rows: Map<number, number> | undefined) =>
      [...(rows ?? new Map<number, number>()).entries()]
        .map(([district, share]) => ({ district, share: Math.round(Math.min(share, 1) * 10000) / 10000 }))
        .sort((a, b) => b.share - a.share);
    zips[zip] = { city: "", counties: [], house: shares(house.get(zip)), senate: shares(senate.get(zip)) };
  }
  await mkdir(path.join(process.cwd(), "data", "pennsylvania"), { recursive: true });
  await writeFile(
    path.join(process.cwd(), "data", "pennsylvania", "zips.json"),
    JSON.stringify({
      source: "U.S. Census Bureau 2024 State Legislative District to 2020 ZCTA relationship files",
      sourceUrl: SLDL_URL,
      senateSourceUrl: SLDU_URL,
      license: "U.S. Census Bureau public data",
      note: "Shares are land area. Parts under 2% of a ZIP are omitted. A ZIP can list more than one House or Senate district.",
      counties: [...new Set(counties)].sort(),
      zips,
    }),
  );
  console.log(`ZIP crosswalk: ${Object.keys(zips).length} Pennsylvania ZCTAs.`);
}

function stripTags(value: string): string {
  return decodeXml(value.replace(/<[^>]+>/g, " "));
}

function normalizePosition(value: string): string {
  const text = value.toLowerCase();
  if (text === "yea" || text === "yes") return "yea";
  if (text === "nay" || text === "no") return "nay";
  if (text === "n/v" || text === "nv" || text === "not voting") return "not voting";
  if (text === "leave" || text === "lve") return "leave";
  return text;
}

function parseRollCall(html: string): {
  date: string | null;
  motion: string | null;
  members: { memberId: string; position: string }[];
} {
  const date = html.match(/[?&]date=(\d{4}-\d{2}-\d{2})/)?.[1] ?? null;
  const action = html.match(/bg-light fw-bold">\s*Action\s*<\/div>\s*<div>([\s\S]*?)<\/div>/i);
  const motion = action ? stripTags(action[1]) : null;
  const members: { memberId: string; position: string }[] = [];
  for (const block of html.split('class="rc-member d-flex').slice(1)) {
    const memberId = block.match(/\/members\/bio\/(\d+)\//)?.[1] ?? block.match(/\/images\/members\/\d+\/(\d+)\.jpg/)?.[1];
    const position = block.match(/title="([^"]+)"/)?.[1];
    if (!memberId || !position) continue;
    if (!/^(yea|nay|leave|n\/v|not voting|present|absent|yes|no)$/i.test(position)) continue;
    members.push({ memberId, position: normalizePosition(position) });
  }
  return { date, motion, members };
}

function rollCallLinks(html: string): { chamber: Chamber; rcNum: number }[] {
  const found = new Map<string, { chamber: Chamber; rcNum: number }>();
  for (const match of html.matchAll(/\/(house|senate)\/roll-calls\/summary\?sessYr=2025(?:&amp;|&)sessInd=0(?:&amp;|&)rcNum=(\d+)/g)) {
    const chamber = match[1] === "house" ? "house" : "senate";
    const rcNum = Number(match[2]);
    found.set(`${chamber}:${rcNum}`, { chamber, rcNum });
  }
  return [...found.values()];
}

async function loadRollCalls(
  bills: { identifier: string; sourceUrl: string; id: string }[],
  knownLegislators: Set<string>,
): Promise<{ votes: PennsylvaniaSnapshot["votes"]; gaps: string[] }> {
  const voteRows: PennsylvaniaSnapshot["votes"] = [];
  const gaps: string[] = [];
  for (const bill of bills) {
    const cacheName = bill.sourceUrl.split("/").pop() || bill.identifier;
    let html = "";
    try {
      html = await download(bill.sourceUrl, path.join(cacheDir, "pa-bills", `${cacheName}.html`), true);
    } catch (error) {
      gaps.push(`${bill.identifier}: official bill page could not be fetched (${error instanceof Error ? error.message : "error"}). Member votes were skipped.`);
      continue;
    }
    const links = rollCallLinks(html);
    if (links.length === 0) continue;
    console.log(`${bill.identifier}: ${links.length} floor roll call${links.length === 1 ? "" : "s"}`);
    for (const link of links) {
      const url = `https://www.palegis.us/${link.chamber}/roll-calls/summary?sessYr=2025&sessInd=0&rcNum=${link.rcNum}`;
      let page = "";
      try {
        page = await download(url, path.join(cacheDir, "pa-rollcalls", `${link.chamber}-${link.rcNum}.html`), true);
      } catch (error) {
        gaps.push(`${bill.identifier}: roll call ${link.chamber} ${link.rcNum} could not be fetched (${error instanceof Error ? error.message : "error"}).`);
        continue;
      }
      const parsed = parseRollCall(page);
      const minimum = link.chamber === "house" ? 150 : 40;
      if (parsed.members.length < minimum) {
        gaps.push(
          `${bill.identifier}: roll call ${link.chamber} ${link.rcNum} parsed ${parsed.members.length} member votes, below the expected floor. It was skipped.`,
        );
        continue;
      }
      const yea = parsed.members.filter((member) => member.position === "yea").length;
      const nay = parsed.members.filter((member) => member.position === "nay").length;
      for (const member of parsed.members) {
        const legislatorId = `pa-${link.chamber === "house" ? "h" : "s"}-${member.memberId}`;
        const id = `pa|${link.chamber}|${link.rcNum}|${member.memberId}`;
        voteRows.push({
          id,
          billId: bill.id,
          legislatorId: knownLegislators.has(legislatorId) ? legislatorId : null,
          externalVoteId: id,
          chamber: link.chamber,
          position: member.position,
          motion: parsed.motion,
          result: `${yea} yea, ${nay} nay`,
          yea,
          nay,
          voteDate: parsed.date,
          rollNumber: link.rcNum,
          sourceUrl: url,
          session: SESSION,
          billIdentifier: bill.identifier,
        });
      }
    }
  }
  return { votes: dedupeVotes(voteRows), gaps };
}

function dedupeVotes(rows: PennsylvaniaSnapshot["votes"]): PennsylvaniaSnapshot["votes"] {
  const seen = new Set<string>();
  return rows.filter((row) => {
    if (seen.has(row.id)) return false;
    seen.add(row.id);
    return true;
  });
}

export async function buildSnapshot(): Promise<PennsylvaniaSnapshot> {
  const topicMap = topicsByIdentifier();
  if (topicMap.size !== 54) {
    throw new Error(`The Pennsylvania shortlist has ${topicMap.size} bills. Expected 54 unique identifiers.`);
  }
  const xmlPath = await ensureBillXml();
  const xml = await readFile(xmlPath, "utf8");
  const parsed = new Map<string, ParsedBill>();
  for (const match of xml.matchAll(/<bill\b[^>]*>([\s\S]*?)<\/bill>/g)) {
    const bill = parseBill(match[1]);
    if (!bill || !topicMap.has(bill.identifier)) continue;
    parsed.set(bill.identifier, bill);
  }
  const missing = [...topicMap.keys()].filter((identifier) => !parsed.has(identifier));
  if (missing.length) {
    throw new Error(`Bill history XML is missing shortlist bills: ${missing.join(", ")}`);
  }

  const houseXml = await download(HOUSE_MEMBERS_URL, path.join(cacheDir, "pa-house-members.xml"), true);
  const senateXml = await download(SENATE_MEMBERS_URL, path.join(cacheDir, "pa-senate-members.xml"), true);
  const members = [...parseMembers(houseXml, "house"), ...parseMembers(senateXml, "senate")];
  const houseCount = members.filter((member) => member.chamber === "house").length;
  const senateCount = members.filter((member) => member.chamber === "senate").length;
  if (houseCount < 190 || senateCount < 45) {
    throw new Error(`Member feeds returned ${houseCount} House and ${senateCount} Senate rows. Refusing a partial roster.`);
  }
  const usedSlugs = new Set<string>();
  for (const member of members) {
    let slug = `${member.chamber}-${member.district}-${slugify(member.name)}`;
    if (usedSlugs.has(slug)) slug = `${slug}-${member.id.replace(/^pa-/, "")}`;
    usedSlugs.add(slug);
    member.slug = slug;
    if (!member.address) member.address = null;
  }
  const byDistrict = new Map<string, RawMember>();
  for (const member of members) byDistrict.set(`${member.chamber}:${member.district}`, member);
  const counties = members.flatMap((member) => member.counties);
  await buildZipFile(counties);

  const usedBillSlugs = new Set<string>();
  const billRows: PennsylvaniaSnapshot["bills"] = [];
  for (const identifier of [...topicMap.keys()].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))) {
    const bill = parsed.get(identifier);
    if (!bill) continue;
    let slug = slugify(identifier);
    if (usedBillSlugs.has(slug)) slug = `${slug}-${bill.number}`;
    usedBillSlugs.add(slug);
    const sourceUrl = billPublicUrl(bill.chamber, bill.number);
    if (!sourceUrl.startsWith("https://www.palegis.us/legislation/bills/")) {
      throw new Error(`${identifier} is missing an official palegis.us URL`);
    }
    const last = bill.actions[bill.actions.length - 1];
    const passageVotes = bill.actions
      .filter((action) => action.vote)
      .map((action) => {
        const tally = parseTally(action.vote ?? "");
        return {
          chamber: action.chamber,
          date: action.date,
          result: action.vote,
          motionText: action.text,
          yea: tally.yea,
          nay: tally.nay,
        };
      });
    const act = [...bill.actions].reverse().find((action) => /Act No\.\s*\d+/i.test(action.text));
    const actNumber = act?.text.match(/Act No\.\s*(\d+)/i)?.[1] ?? null;
    const approved = [...bill.actions].reverse().find((action) => /approved by the governor|signed by the governor/i.test(action.text));
    const governorSource = approved ?? act;
    const sponsors = bill.sponsors
      .sort((a, b) => a.sequence - b.sequence)
      .map((sponsor) => {
        const member = byDistrict.get(`${sponsor.chamber}:${sponsor.district}`);
        const sponsorLast = lastToken(sponsor.name);
        const memberLast = member ? lastToken(member.name) : "";
        const linked = member && sponsorLast && sponsorLast === memberLast ? member : null;
        return {
          name: linked?.name ?? properName(sponsor.name),
          primary: sponsor.sequence === 1,
          legislatorId: linked?.id ?? null,
        };
      });
    billRows.push({
      id: `pa|${SESSION}|${identifier}`,
      session: SESSION,
      sessionName: SESSION_NAME,
      slug,
      identifier,
      chamber: bill.chamber,
      title: bill.title,
      summary: plainSummary(bill.title, null),
      officialSummary: bill.title || null,
      watchNote: null,
      status: last?.text ?? null,
      lastAction: last?.text ?? null,
      lastActionDate: last?.date ?? null,
      sourceUrl,
      textUrl: bill.textUrl,
      memoUrl: bill.memoUrl,
      billType: bill.subType === "J" ? "joint resolution" : "bill",
      governorAction: governorSource
        ? {
            status: governorSource.text,
            decisionDate: governorSource.date,
            actNumber,
          }
        : null,
      passageVotes,
      actions: bill.actions,
      featured: Boolean(passageVotes.length || actNumber),
      legislationId: bill.number,
      topics: topicMap.get(identifier) ?? [],
      sponsors,
    });
  }

  const known = new Set(members.map((member) => member.id));
  console.log("Fetching official bill pages and floor roll calls for the shortlist.");
  const rollCalls = await loadRollCalls(
    billRows.map((bill) => ({ identifier: bill.identifier, sourceUrl: bill.sourceUrl, id: bill.id })),
    known,
  );

  const snapshot: PennsylvaniaSnapshot = {
    generatedAt: new Date().toISOString(),
    voteGaps: rollCalls.gaps,
    sources: [
      {
        name: "Pennsylvania General Assembly",
        url: "https://www.palegis.us/",
        license: "Public information, provided AS IS. No Creative Commons license.",
      },
      {
        name: "U.S. Census Bureau 2024 legislative district to ZCTA relationship files",
        url: SLDL_URL,
        license: "U.S. Census Bureau public data",
      },
    ],
    bills: billRows,
    legislators: members.sort((a, b) => a.chamber.localeCompare(b.chamber) || a.district - b.district || a.name.localeCompare(b.name)),
    votes: rollCalls.votes,
  };
  await mkdir(path.join(process.cwd(), "data", "pennsylvania"), { recursive: true });
  await writeFile(path.join(process.cwd(), "data", "pennsylvania", "snapshot.json"), JSON.stringify(snapshot));
  console.log(
    `Snapshot: ${snapshot.bills.length} bills, ${snapshot.legislators.length} legislators (${houseCount} House, ${senateCount} Senate), ${snapshot.votes.length} member votes.`,
  );
  if (snapshot.voteGaps.length) {
    console.log("Vote gaps:");
    for (const gap of snapshot.voteGaps) console.log(`- ${gap}`);
  } else {
    console.log("No roll-call gaps.");
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

export async function upsertSnapshot(snapshot: PennsylvaniaSnapshot) {
  for (const bill of snapshot.bills) {
    if (!bill.sourceUrl.startsWith("https://www.palegis.us/")) {
      throw new Error(`Refusing bill without an official palegis.us URL: ${bill.identifier}`);
    }
    if (!bill.summary.trim()) throw new Error(`Missing summary for ${bill.identifier}`);
  }
  const { db, client } = openScriptDb();
  try {
    await db.transaction(async (tx) => {
      await tx
        .insert(states)
        .values({
          id: "pa",
          name: "Pennsylvania",
          slug: "pennsylvania",
          legislatureName: "Pennsylvania General Assembly",
        })
        .onConflictDoUpdate({
          target: states.id,
          set: { name: "Pennsylvania", slug: "pennsylvania", legislatureName: "Pennsylvania General Assembly" },
        });
      for (const topic of TOPICS) {
        await tx
          .insert(topics)
          .values(topic)
          .onConflictDoUpdate({
            target: topics.id,
            set: {
              name: topic.name,
              slug: topic.slug,
              description: topic.description,
              sortOrder: topic.sortOrder,
            },
          });
      }
      await insertChunks(snapshot.legislators, 80, async (chunk) => {
        await tx
          .insert(legislators)
          .values(
            chunk.map((member) => ({
              id: member.id,
              stateId: "pa",
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

      for (const bill of snapshot.bills) {
        await tx
          .insert(bills)
          .values({
            id: bill.id,
            stateId: "pa",
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
              watchNote: bill.watchNote,
              status: bill.status,
              lastAction: bill.lastAction,
              lastActionDate: bill.lastActionDate,
              sourceUrl: bill.sourceUrl,
              textUrl: bill.textUrl,
              memoUrl: bill.memoUrl,
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
      if (billIds.length) {
        await tx.delete(bills).where(and(eq(bills.stateId, "pa"), notInArray(bills.id, billIds)));
        await tx.delete(billSponsors).where(inArray(billSponsors.billId, billIds));
        await tx.delete(billTopics).where(inArray(billTopics.billId, billIds));
        await tx.delete(votes).where(inArray(votes.billId, billIds));
      }
      const knownLegislators = new Set(snapshot.legislators.map((member) => member.id));
      const sponsorRows = snapshot.bills.flatMap((bill) => {
        const seen = new Set<string>();
        return bill.sponsors.flatMap((sponsor, index) => {
          const name = sponsor.name.trim();
          if (!name || seen.has(name)) return [];
          seen.add(name);
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
        await tx.insert(billSponsors).values(chunk);
      });
      const topicRows = snapshot.bills.flatMap((bill) => bill.topics.map((topicId) => ({ billId: bill.id, topicId })));
      await insertChunks(topicRows, 200, async (chunk) => {
        await tx.insert(billTopics).values(chunk);
      });
      await insertChunks(snapshot.votes, 400, async (chunk) => {
        await tx.insert(votes).values(chunk);
      });
    });
  } finally {
    await client.end({ timeout: 5 });
  }
  console.log("Pennsylvania database updated. Georgia rows were not deleted.");
}
