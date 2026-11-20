#!/usr/bin/env python3
"""Build curated snapshots for Idaho, New York, and Texas from official sources.

Writes data/<state>/snapshot.json and data/<state>/zips.json. Does not touch the database.
"""

from __future__ import annotations

import html
import json
import re
import subprocess
import sys
import time
import urllib.error
import urllib.request
from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CACHE = ROOT / "data" / "cache"
UA = "AmericanCapitolWatch/1.0 (state legislative research; responses are cached)"

TOPIC_PATTERNS: dict[str, str] = {
    "taxes": r"\b(tax|taxes|taxation|taxpayer|revenue|homestead exemption|property tax)\b",
    "guns": r"\b(firearm|firearms|weapon|weapons|gun|guns|ammunition|concealed carry|second amendment)\b",
    "schools": r"\b(school|schools|education|student|students|teacher|teachers|charter|university|college|curriculum)\b",
    "elections": r"\b(election|elections|voter|voters|ballot|ballots|campaign|initiative|referendum|polling)\b",
    "property-rights": r"\b(eminent domain|landlord|tenant|zoning|land use|homeowner|property rights|private property|takings)\b",
    "energy": r"\b(energy|electricity|solar|nuclear|pipeline|power plant|public utility|utilities|oil and gas|rate-regulated|large loads|electric(?!-assisted))\b",
    "abortion": r"\b(abortion|unborn|fetal|fetus|pregnancy termination)\b",
    "border": r"\b(immigration|immigrant|alien|border|citizenship|migrant|undocumented)\b",
}

SLDL_URL = "https://www2.census.gov/geo/docs/maps-data/data/rel2020/cd-sld/tab20_sldl202420_zcta520_natl.txt"
SLDU_URL = "https://www2.census.gov/geo/docs/maps-data/data/rel2020/cd-sld/tab20_sldu202420_zcta520_natl.txt"


def clean(value: str) -> str:
    text = html.unescape(value or "")
    text = text.replace("\xa0", " ").replace("\u00a0", " ")
    text = re.sub(r"<[^>]+>", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def slugify(value: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")
    return slug[:72] or "member"


def fetch(url: str, cache_name: str, timeout: int = 90) -> str:
    path = CACHE / cache_name
    if path.exists() and path.stat().st_size > 200:
        return path.read_text(encoding="utf-8", errors="replace")
    path.parent.mkdir(parents=True, exist_ok=True)
    last_error: Exception | None = None
    for attempt in range(1, 4):
        try:
            request = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "*/*"})
            with urllib.request.urlopen(request, timeout=timeout) as response:
                data = response.read()
            if not data.strip():
                raise RuntimeError(f"Empty response for {url}")
            path.write_bytes(data)
            return data.decode("utf-8", errors="replace")
        except Exception as error:  # noqa: BLE001 - retry network failures
            last_error = error
            print(f"Attempt {attempt} failed for {url}: {error}", file=sys.stderr)
            time.sleep(1.5 * attempt)
    raise RuntimeError(f"Failed to download {url}") from last_error


def party_name(letter: str | None) -> str | None:
    if letter == "R":
        return "Republican"
    if letter == "D":
        return "Democratic"
    return None


def official_caption(text: str) -> str:
    body = clean(text).rstrip(".")
    if not body:
        return "The official caption is on the legislature's page."
    return f"Official caption: {body}."


def pick_shortlist(bills: list[dict]) -> dict[str, list[str]]:
    """Map bill id to topic ids. Prefer enacted or further-along bills, then spread across topics."""
    chosen: dict[str, list[str]] = {}

    def rank(bill: dict) -> tuple[int, str]:
        status = (bill.get("status") or "").lower()
        enacted = 0 if status in {"law", "signed", "enacted"} or "law" in status else 1
        return (enacted, bill["identifier"])

    per_topic = 8
    for _pass in range(3):
        for topic, pattern in TOPIC_PATTERNS.items():
            matches = [bill for bill in bills if re.search(pattern, f"{bill['title']} {bill.get('caption') or ''}", re.I)]
            matches.sort(key=rank)
            added = 0
            for bill in matches:
                topics = chosen.setdefault(bill["id"], [])
                if topic in topics:
                    continue
                if _pass == 0 and added >= per_topic:
                    break
                if _pass > 0 and len(chosen) >= 56:
                    break
                topics.append(topic)
                added += 1
        if len(chosen) >= 48:
            break
        per_topic += 4
    return {bill_id: topics for bill_id, topics in chosen.items() if topics}


def write_zips(state_dir: Path, fips: str) -> None:
    lower = fetch(SLDL_URL, "sldl-zcta.txt", timeout=180)
    upper = fetch(SLDU_URL, "sldu-zcta.txt", timeout=180)

    def read(text: str, column: str) -> dict[str, dict[int, float]]:
        lines = text.replace("\ufeff", "").splitlines()
        header = lines[0].split("|")
        district_index = header.index(column)
        zip_index = header.index("GEOID_ZCTA5_20")
        part_index = header.index("AREALAND_PART")
        total_index = header.index("AREALAND_ZCTA5_20")
        zips: dict[str, dict[int, float]] = defaultdict(dict)
        for line in lines[1:]:
            if not line:
                continue
            parts = line.split("|")
            geoid = parts[district_index]
            if not geoid.startswith(fips):
                continue
            district = int(geoid[len(fips):])
            zip_code = parts[zip_index]
            part = float(parts[part_index] or 0)
            total = float(parts[total_index] or 0)
            if not re.fullmatch(r"\d{5}", zip_code) or district <= 0 or total <= 0 or part <= 0:
                continue
            share = part / total
            if share < 0.02:
                continue
            zips[zip_code][district] = zips[zip_code].get(district, 0) + share
        return zips

    house = read(lower, "GEOID_SLDL2024_20")
    senate = read(upper, "GEOID_SLDU2024_20")

    def shares(rows: dict[int, float] | None) -> list[dict]:
        items = [
            {"district": district, "share": round(min(share, 1), 4)}
            for district, share in (rows or {}).items()
        ]
        items.sort(key=lambda row: (-row["share"], row["district"]))
        return items

    zips = {}
    for zip_code in sorted(set(house) | set(senate)):
        zips[zip_code] = {
            "city": "",
            "counties": [],
            "house": shares(house.get(zip_code)),
            "senate": shares(senate.get(zip_code)),
        }
    payload = {
        "source": "U.S. Census Bureau 2024 State Legislative District to 2020 ZCTA relationship files",
        "sourceUrl": SLDL_URL,
        "senateSourceUrl": SLDU_URL,
        "license": "U.S. Census Bureau public data",
        "note": "Shares are land area. Parts under 2% of a ZIP are omitted. A ZIP can list more than one House or Senate district. Member directories used for this state did not publish a county field, so county lists are empty.",
        "counties": [],
        "zips": zips,
    }
    state_dir.mkdir(parents=True, exist_ok=True)
    (state_dir / "zips.json").write_text(json.dumps(payload), encoding="utf-8")
    print(f"ZIP crosswalk: {len(zips)} ZCTAs for FIPS {fips}.")


def unique_slug(name: str, used: set[str], district: int) -> str:
    base = slugify(name)
    slug = base
    if slug in used:
        slug = f"{base}-{district}"
    n = 2
    while slug in used:
        slug = f"{base}-{district}-{n}"
        n += 1
    used.add(slug)
    return slug


# --- Idaho -----------------------------------------------------------------

def idaho_members(html_text: str, chamber: str) -> list[dict]:
    people = []
    for match in re.finditer(r"<strong>([^<]+)</strong>\(([DR])\)", html_text):
        name = clean(match.group(1))
        body = html_text[match.end() : match.end() + 1800]
        email = re.search(r"mailto:([^\"']+)", body)
        district = re.search(r"district=(\d+)", body)
        seat = re.search(r"House Seat ([AB])", body)
        plain_body = clean(body).split("Committees")[0].split("Subscribe")[0]
        cities = re.findall(
            r"((?:[A-Z][A-Za-z'’.\-]*|d['’][A-Za-z]+)(?: (?:[A-Z][A-Za-z'’.\-]*|d['’][A-Za-z]+)){0,3}),\s*ID\s+\d{5}",
            plain_body,
        )
        city_match = cities[-1] if cities else None
        leader_text = plain_body.replace("Public Speaker", "")
        leader_phrase = next(
            (
                phrase
                for phrase in (
                    "Assistant Minority Leader",
                    "Assistant Majority Leader",
                    "Majority Leader",
                    "Minority Leader",
                    "President Pro Tem",
                    "Speaker",
                )
                if phrase in leader_text
            ),
            None,
        )
        phone = re.search(r"Statehouse[\s\S]{0,180}?\((\d{3})\)\s*(\d{3}-\d{4})", body)
        image = re.search(r'src="([^"]+)"', html_text[max(0, match.start() - 900) : match.start()])
        committees = [clean(label) for label in re.findall(r"standingcommittees/[^\"']+\"[^>]*>([^<]+)", body)]
        if not district:
            continue
        people.append(
            {
                "name": name,
                "party": party_name(match.group(2)),
                "email": email.group(1) if email else None,
                "district": int(district.group(1)),
                "seat": seat.group(1) if seat else None,
                "city": city_match.strip(" .") if city_match else None,
                "phone": f"({phone.group(1)}) {phone.group(2)}" if phone else None,
                "image": image.group(1) if image else None,
                "committees": [item for item in committees if item and item.lower() != "committees:"],
                "leadership": leader_phrase,
                "chamber": chamber,
            }
        )
    return people


def idaho_index(html_text: str) -> list[dict]:
    bills = []
    for match in re.finditer(r'<tr id="bill([A-Z0-9]+)"[\s\S]*?</tr>', html_text):
        number = match.group(1)
        if not re.fullmatch(r"[HS]\d+[a-z]?", number):
            continue
        cells = re.findall(r"<td[^>]*>(.*?)</td>", match.group(0), re.S)
        texts = [clean(cell) for cell in cells]
        title = texts[1] if len(texts) > 1 else ""
        status = texts[3] if len(texts) > 3 else ""
        if not title:
            continue
        bills.append(
            {
                "id": f"id-2026-{number.lower()}",
                "number": number,
                "identifier": number,
                "title": title,
                "status": status or None,
                "chamber": "house" if number.startswith("H") else "senate",
                "caption": title,
            }
        )
    return bills


def parse_idaho_bill(page: str, bill: dict) -> dict:
    sponsor = re.search(
        r'<td[^>]*text-align:right[^>]*>\s*by\s+([^<]+)</td>',
        page,
        re.I,
    )
    description = ""
    actions = []
    tables = re.findall(r'<table class="bill-table">([\s\S]*?)</table>', page)
    for table in tables:
        rows = re.findall(r"<tr[\s\S]*?</tr>", table)
        for row in rows:
            cells = [clean(cell) for cell in re.findall(r"<td[^>]*>(.*?)</td>", row, re.S)]
            cells = [cell for cell in cells if cell]
            if len(cells) == 1 and len(cells[0]) > 40 and not re.fullmatch(r"\d{2}/\d{2}", cells[0]):
                description = cells[0]
            date_cell = next((cell for cell in cells if re.fullmatch(r"\d{2}/\d{2}", cell)), None)
            if date_cell:
                text = cells[-1] if cells[-1] != date_cell else ""
                month = int(date_cell[:2])
                year = 2025 if month >= 11 else 2026
                actions.append(
                    {
                        "date": f"{year}-{date_cell[:2]}-{date_cell[3:5]}",
                        "chamber": bill["chamber"],
                        "text": text,
                        "vote": None,
                    }
                )
    pdf = re.search(r'href="(/wp-content/uploads/sessioninfo/2026/legislation/[^"]+\.pdf)"', page)
    text_url = None
    if pdf and "SOP" not in pdf.group(1) and "LegCo" not in pdf.group(1):
        text_url = "https://legislature.idaho.gov" + pdf.group(1)
    caption = description or bill["title"]
    last = actions[-1] if actions else None
    return {
        **bill,
        "caption": caption,
        "sponsor_line": clean(sponsor.group(1)) if sponsor else None,
        "actions": actions,
        "text_url": text_url,
        "last_action": last["text"] if last else bill.get("status"),
        "last_action_date": last["date"] if last else None,
    }


def match_person(line: str | None, people: list[dict]) -> str | None:
    if not line:
        return None
    if re.search(r"\bcommittee\b", line, re.I):
        return None
    last = line.split(",")[0].strip().lower()
    last = re.sub(r"[^a-z\- ]", "", last).strip()
    hits = [person for person in people if person["name"].lower().endswith(last) or last in person["name"].lower().split()]
    # Prefer an exact last-name match.
    exact = [person for person in people if person["name"].split()[-1].lower() == last]
    if len(exact) == 1:
        return exact[0]["id"]
    return None


def build_idaho() -> None:
    print("Building Idaho.")
    index_html = fetch(
        "https://legislature.idaho.gov/sessioninfo/2026/legislation/",
        "idaho-legislation-2026.html",
        timeout=120,
    )
    house_html = fetch("https://legislature.idaho.gov/house/membership/", "idaho-house.html")
    senate_html = fetch("https://legislature.idaho.gov/senate/membership/", "idaho-senate.html")
    house = idaho_members(house_html, "house")
    senate = idaho_members(senate_html, "senate")
    if len(house) < 60 or len(senate) < 30:
        raise SystemExit(f"Idaho roster looks short: house {len(house)}, senate {len(senate)}.")
    bills = idaho_index(index_html)
    shortlist = pick_shortlist(bills)
    selected = [bill for bill in bills if bill["id"] in shortlist]
    print(f"Idaho index {len(bills)} bills; shortlist {len(selected)}.")

    def load_one(bill: dict) -> dict:
        page = fetch(
            f"https://legislature.idaho.gov/sessioninfo/2026/legislation/{bill['number']}/",
            f"idaho-bills/{bill['number']}.html",
            timeout=60,
        )
        return parse_idaho_bill(page, bill)

    detailed = []
    with ThreadPoolExecutor(max_workers=6) as pool:
        futures = [pool.submit(load_one, bill) for bill in selected]
        for future in as_completed(futures):
            detailed.append(future.result())
    detailed.sort(key=lambda bill: bill["identifier"])

    used: set[str] = set()
    legislators = []
    for person in house + senate:
        seat = person["seat"] or ""
        leg_id = f"id-{'h' if person['chamber']=='house' else 's'}-{person['district']}{seat.lower()}"
        person["id"] = leg_id
        residence = person["city"]
        if person["seat"]:
            residence = f"{residence}, Seat {person['seat']}" if residence else f"Seat {person['seat']}"
        legislators.append(
            {
                "id": leg_id,
                "slug": unique_slug(person["name"], used, person["district"]),
                "name": person["name"],
                "firstName": person["name"].split()[0],
                "lastName": person["name"].split()[-1],
                "party": person["party"],
                "chamber": person["chamber"],
                "district": person["district"],
                "residence": residence,
                "counties": [],
                "email": person["email"],
                "phone": person["phone"],
                "address": None,
                "imageUrl": ("https://legislature.idaho.gov" + person["image"]) if person["image"] else None,
                "profileUrl": f"https://legislature.idaho.gov/legislators/membership/?yr=2026&district={person['district']}",
                "committees": person["committees"],
                "leadershipRole": person.get("leadership"),
                "status": None,
                "statusNote": f"House Seat {person['seat']}" if person["seat"] else None,
                "isCurrent": True,
            }
        )
    by_id = {person["id"]: person for person in legislators}
    snapshot_bills = []
    for bill in detailed:
        topics = shortlist[bill["id"]]
        sponsor_id = match_person(bill.get("sponsor_line"), legislators)
        sponsors = []
        if bill.get("sponsor_line"):
            sponsors.append({"name": bill["sponsor_line"], "primary": True, "legislatorId": sponsor_id if sponsor_id in by_id else None})
        snapshot_bills.append(bill_record(
            bill,
            session="2026",
            session_name="2026 Regular Session",
            source_url=f"https://legislature.idaho.gov/sessioninfo/2026/legislation/{bill['number']}/",
            topics=topics,
            sponsors=sponsors,
        ))
    write_snapshot(
        "idaho",
        "16",
        snapshot_bills,
        legislators,
        [
            "Member floor votes are not in this file. The Idaho bill pages list actions, not a roll call of yeas and nays.",
            "Co-sponsor lists are published as PDFs and are not parsed here. The sponsor line is the legislature's \"by\" line.",
            "Mailing addresses labeled as a home address on the directory are not stored. The phone is the Statehouse number.",
            "The directory does not list counties.",
        ],
        [
            {
                "name": "Idaho Legislature, 2026 legislation index and bill pages",
                "url": "https://legislature.idaho.gov/sessioninfo/2026/legislation/",
                "license": "Official legislative record",
            },
            {
                "name": "Idaho Legislature member directory",
                "url": "https://legislature.idaho.gov/house/membership/",
                "license": "Official legislative record",
            },
        ],
    )


def bill_record(
    bill: dict,
    session: str,
    session_name: str,
    source_url: str,
    topics: list[str],
    sponsors: list[dict],
    summary_lead: str = "Official caption",
) -> dict:
    caption = bill.get("caption") or bill["title"]
    return {
        "id": bill["id"],
        "session": session,
        "sessionName": session_name,
        "slug": slugify(bill["identifier"]),
        "identifier": bill["identifier"],
        "chamber": bill["chamber"],
        "title": bill["title"],
        "summary": official_caption(caption).replace("Official caption", summary_lead, 1),
        "officialSummary": caption,
        "watchNote": None,
        "status": bill.get("status"),
        "lastAction": bill.get("last_action") or bill.get("status"),
        "lastActionDate": bill.get("last_action_date"),
        "sourceUrl": source_url,
        "textUrl": bill.get("text_url"),
        "memoUrl": None,
        "billType": "bill",
        "governorAction": None,
        "passageVotes": [],
        "actions": bill.get("actions") or [],
        "featured": False,
        "legislationId": None,
        "topics": topics,
        "sponsors": sponsors,
    }


def write_snapshot(folder: str, fips: str, bills: list[dict], legislators: list[dict], gaps: list[str], sources: list[dict]) -> None:
    # Mark one featured bill per topic, first identifier in each topic.
    seen_topics: set[str] = set()
    for bill in sorted(bills, key=lambda item: item["identifier"]):
        for topic in bill["topics"]:
            if topic not in seen_topics:
                bill["featured"] = True
                seen_topics.add(topic)
    state_dir = ROOT / "data" / folder
    state_dir.mkdir(parents=True, exist_ok=True)
    payload = {
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "voteGaps": gaps,
        "sources": sources,
        "bills": bills,
        "legislators": legislators,
        "votes": [],
    }
    (state_dir / "snapshot.json").write_text(json.dumps(payload), encoding="utf-8")
    topic_counts: dict[str, int] = defaultdict(int)
    for bill in bills:
        for topic in bill["topics"]:
            topic_counts[topic] += 1
    print(
        f"{folder}: {len(bills)} bills, {len(legislators)} legislators, topics {dict(sorted(topic_counts.items()))}."
    )
    missing = [topic for topic in TOPIC_PATTERNS if topic_counts[topic] == 0]
    if missing:
        print(f"{folder}: no shortlist bills for {', '.join(missing)}.")
    if len(bills) < 40:
        raise SystemExit(f"{folder} shortlist has only {len(bills)} bills.")
    write_zips(state_dir, fips)


# --- Texas -----------------------------------------------------------------

def texas_members() -> list[dict]:
    house_html = fetch("https://house.texas.gov/members", "texas-house-members.html")
    start = house_html.find(':members="')
    if start < 0:
        raise SystemExit("Texas House member JSON was not on the members page.")
    start += len(':members="')
    end = house_html.find('"', start)
    house_rows = json.loads(html.unescape(house_html[start:end]))
    people = []
    for row in house_rows:
        if not row.get("active"):
            continue
        name = clean(row["member_name"])
        # "Alders, Daniel" -> Daniel Alders
        if "," in name:
            last, first = [part.strip() for part in name.split(",", 1)]
            display = f"{first} {last}".strip()
        else:
            display = name
            last = name.split()[-1]
        district = int(row["id"])
        code = row.get("member_bill_code")
        people.append(
            {
                "id": f"tx-h-{district}",
                "name": display,
                "lastName": last,
                "party": None,
                "chamber": "house",
                "district": district,
                "imageUrl": f"https://house.texas.gov/{row['image']}" if row.get("image") else None,
                "profileUrl": row.get("link") or f"https://house.texas.gov/members/{code}",
                "email": None,
                "phone": None,
                "committees": [],
            }
        )
    senate_html = fetch("https://senate.texas.gov/members.php", "texas-senate-members.html")
    for match in re.finditer(
        r'src="(members/d\d+/img/[^"]+)"[\s\S]{0,240}?member\.php\?d=(\d+)"[^>]*>([^<]+)</a>',
        senate_html,
    ):
        district = int(match.group(2))
        raw_name = clean(match.group(3))
        if "constituent services" in raw_name.lower() or "vacant" in raw_name.lower():
            continue
        people.append(
            {
                "id": f"tx-s-{district}",
                "name": re.sub(r"\s+", " ", raw_name),
                "lastName": re.sub(r"\s+", " ", raw_name).split()[-1],
                "party": None,
                "chamber": "senate",
                "district": district,
                "imageUrl": "https://senate.texas.gov/" + match.group(1),
                "profileUrl": f"https://senate.texas.gov/member.php?d={district}",
                "email": None,
                "phone": None,
                "committees": [],
            }
        )
    return people


def parse_texas_report(html_text: str, chamber: str) -> list[dict]:
    bills = []
    for chunk in html_text.split('class="row"')[1:]:
        bill_match = re.search(r"Bill=([A-Z]+\d+)", chunk)
        if not bill_match:
            continue
        raw = bill_match.group(1)

        def field(label: str) -> str | None:
            found = re.search(
                rf"<b>{label}:?</b>:?\s*</div>\s*<div[^>]*>\s*([^<]+)",
                chunk,
            )
            return clean(found.group(1)) if found else None

        caption = field("Caption")
        author = field("Author")
        sponsor = field("Sponsor")
        action = field("Last Action")
        if not caption:
            continue
        kind = "HB" if raw.startswith("HB") else "SB" if raw.startswith("SB") else None
        if kind is None:
            continue
        number = raw[len(kind):]
        identifier = f"{kind} {number}"
        action_date = None
        action_text = action
        if action:
            dated = re.match(r"(\d{2})/(\d{2})/(\d{4})\s+[HS]\s+(.*)", action)
            if dated:
                action_date = f"{dated.group(3)}-{dated.group(1)}-{dated.group(2)}"
                action_text = dated.group(4).strip()
        bills.append(
            {
                "id": f"tx-90r-{raw.lower()}",
                "identifier": identifier,
                "raw": raw,
                "title": caption.rstrip("."),
                "caption": caption,
                "status": action_text,
                "chamber": "house" if kind == "HB" else "senate",
                "author": author,
                "sponsor": sponsor,
                "last_action": action_text,
                "last_action_date": action_date,
                "actions": (
                    [
                        {
                            "date": action_date,
                            "chamber": chamber if kind == "HB" else "senate",
                            "text": action_text or action,
                            "vote": None,
                        }
                    ]
                    if action_text
                    else []
                ),
                "text_url": None,
            }
        )
    return bills


def link_texas_sponsor(label: str | None, people: list[dict], chamber: str | None) -> str | None:
    if not label:
        return None
    # "Bell, Cecil" or "Bucy" or "Buckley | Bernal | Guillen" — caller passes one name.
    name = clean(label)
    if "," in name:
        last, first = [part.strip() for part in name.split(",", 1)]
        hits = [
            person
            for person in people
            if person["lastName"].lower() == last.lower()
            and (not chamber or person["chamber"] == chamber)
            and first.split()[0].lower() in person["name"].lower()
        ]
    else:
        last = name.split()[-1]
        hits = [
            person
            for person in people
            if person["lastName"].lower() == last.lower() and (not chamber or person["chamber"] == chamber)
        ]
    if len(hits) == 1:
        return hits[0]["id"]
    return None


def build_texas() -> None:
    print("Building Texas.")
    house_html = fetch(
        "https://capitol.texas.gov/reports/Report.aspx?ID=housefiled&LegSess=90R",
        "texas-90r-housefiled.htm",
        timeout=120,
    )
    senate_html = fetch(
        "https://capitol.texas.gov/reports/Report.aspx?ID=senatefiled&LegSess=90R",
        "texas-90r-senatefiled.htm",
        timeout=120,
    )
    bills = parse_texas_report(house_html, "house") + parse_texas_report(senate_html, "senate")
    people = texas_members()
    house_count = sum(1 for person in people if person["chamber"] == "house")
    senate_count = sum(1 for person in people if person["chamber"] == "senate")
    print(f"Texas roster house {house_count}, senate {senate_count}; filed bills {len(bills)}.")
    if house_count < 140 or senate_count < 28:
        raise SystemExit("Texas roster is short.")
    shortlist = pick_shortlist(bills)
    used: set[str] = set()
    legislators = []
    for person in people:
        legislators.append(
            {
                "id": person["id"],
                "slug": unique_slug(person["name"], used, person["district"]),
                "name": person["name"],
                "firstName": person["name"].split()[0],
                "lastName": person["lastName"],
                "party": None,
                "chamber": person["chamber"],
                "district": person["district"],
                "residence": None,
                "counties": [],
                "email": None,
                "phone": None,
                "address": None,
                "imageUrl": person["imageUrl"],
                "profileUrl": person["profileUrl"],
                "committees": [],
                "leadershipRole": None,
                "status": None,
                "statusNote": None,
                "isCurrent": True,
            }
        )
    known = {person["id"] for person in legislators}
    snapshot_bills = []
    for bill in bills:
        if bill["id"] not in shortlist:
            continue
        sponsors = []
        if bill.get("author"):
            for index, name in enumerate([part.strip() for part in bill["author"].split("|")]):
                if not name:
                    continue
                leg_id = link_texas_sponsor(name, people, "house" if bill["chamber"] == "house" else "senate")
                sponsors.append({"name": name, "primary": index == 0, "legislatorId": leg_id if leg_id in known else None})
        if bill.get("sponsor"):
            for name in [part.strip() for part in bill["sponsor"].split("|")]:
                if not name:
                    continue
                leg_id = link_texas_sponsor(name, people, "senate" if bill["chamber"] == "house" else "house")
                sponsors.append({"name": name, "primary": False, "legislatorId": leg_id if leg_id in known else None})
        snapshot_bills.append(
            bill_record(
                bill,
                session="90R",
                session_name="90th Legislature Regular Session",
                source_url=f"https://capitol.texas.gov/BillLookup/History.aspx?LegSess=90R&Bill={bill['raw']}",
                topics=shortlist[bill["id"]],
                sponsors=sponsors,
            )
        )
    write_snapshot(
        "texas",
        "48",
        snapshot_bills,
        legislators,
        [
            "This file is the 90th Legislature regular session filed-bill report dated on Texas Legislature Online. It is not the adjourned 89th regular session and not a called session.",
            "Each tracked bill keeps the report's last action, not a separate journal scrape. For a bill whose only action is Filed, that is the whole history on the report.",
            "Member roll calls are not included. The filed-bill report does not list yeas and nays.",
            "The House and Senate directories used here do not print party, email, or phone. Those fields are left blank.",
            "Senate District 22 is listed on senate.texas.gov as vacant (Constituent Services). No person is invented for that seat.",
            "The roster is the sitting 89th Legislature directory. The 90th Legislature convenes in January 2027.",
            "Counties are not on these member directories.",
        ],
        [
            {
                "name": "Texas Legislature Online filed House and Senate bills, 90th regular session",
                "url": "https://capitol.texas.gov/reports/Report.aspx?ID=housefiled&LegSess=90R",
                "license": "Official legislative record, provided as is",
            },
            {
                "name": "Texas House of Representatives member directory",
                "url": "https://house.texas.gov/members",
                "license": "Official legislative record",
            },
            {
                "name": "Texas Senate member directory",
                "url": "https://senate.texas.gov/members.php",
                "license": "Official legislative record",
            },
        ],
    )


# --- New York --------------------------------------------------------------

def ny_assembly_roster(html_text: str) -> list[dict]:
    people = []
    for chunk in re.split(r'<section class="mem-item"', html_text)[1:]:
        district = re.search(r'id="(\d+)"', chunk[:40])
        name = re.search(r'class="mem-name"[^>]*>\s*<a[^>]*>\s*([^<]+)', chunk)
        email = re.search(r'mailto:([^"\']+)', chunk)
        if not district or not name:
            continue
        addrs = re.findall(r'class="full-addr[^"]*"[^>]*>(.*?)</div>', chunk, re.S)
        capitol = next((clean(block) for block in addrs if re.search(r"\bLOB\b", block)), None)
        phone = None
        if capitol:
            phones = re.findall(r"\d{3}-\d{3}-\d{4}", capitol)
            phone = phones[-1] if phones else None
        image = re.search(r'src="(/write/upload/member_files/\d+/headshot/[^"]+)"', chunk)
        dist_num = int(district.group(1))
        display = clean(name.group(1))
        people.append(
            {
                "id": f"ny-a-{dist_num}",
                "name": display,
                "lastName": display.split()[-1],
                "party": None,
                "chamber": "house",
                "district": dist_num,
                "email": email.group(1) if email else None,
                "phone": phone,
                "address": capitol,
                "imageUrl": ("https://nyassembly.gov" + image.group(1).split("?")[0]) if image else None,
                "profileUrl": f"https://nyassembly.gov/mem/{re.search(r'href=\"/?mem/([^\"]+)\"', chunk).group(1)}"
                if re.search(r'href=\"/?mem/([^\"]+)\"', chunk)
                else "https://nyassembly.gov/mem/",
                "slug_hint": None,
            }
        )
    # Profile slug from the member link is more reliable than the regex above if it fails.
    return people


def load_openstates_senate() -> list[dict]:
    dest = CACHE / "openstates-people"
    legislature = dest / "data" / "ny" / "legislature"
    if not legislature.exists():
        dest.parent.mkdir(parents=True, exist_ok=True)
        if dest.exists():
            subprocess.run(["rm", "-rf", str(dest)], check=True)
        subprocess.run(
            [
                "git",
                "clone",
                "--depth",
                "1",
                "--filter=blob:none",
                "--sparse",
                "https://github.com/openstates/people.git",
                str(dest),
            ],
            check=True,
        )
        subprocess.run(["git", "sparse-checkout", "set", "data/ny/legislature"], cwd=dest, check=True)
    try:
        import yaml  # type: ignore
    except ImportError:
        subprocess.run([sys.executable, "-m", "pip", "install", "pyyaml", "-q"], check=True)
        import yaml  # type: ignore
    people = []
    for path in sorted(legislature.glob("*.yml")):
        data = yaml.safe_load(path.read_text(encoding="utf-8"))
        roles = data.get("roles") or []
        role = next(
            (
                item
                for item in roles
                if item.get("type") == "upper"
                and "state:ny" in (item.get("jurisdiction") or "")
                and not item.get("end_date")
            ),
            None,
        )
        if not role or not role.get("district"):
            continue
        sources = [item.get("url") or "" for item in (data.get("sources") or [])]
        links = [item.get("url") or "" for item in (data.get("links") or [])]
        official = next((url for url in links + sources if re.fullmatch(r"https://www\.nysenate\.gov/senators/[^/]+", url)), None)
        if not official:
            continue
        offices = data.get("offices") or []
        capitol = next((office for office in offices if office.get("classification") == "capitol" and office.get("voice")), None)
        party = None
        if data.get("party"):
            party = data["party"][0].get("name")
        image = data.get("image") if isinstance(data.get("image"), str) and "nysenate.gov" in data["image"] else None
        district = int(str(role["district"]))
        people.append(
            {
                "id": f"ny-s-{district}",
                "name": data["name"],
                "lastName": (data.get("family_name") or data["name"].split()[-1]),
                "party": party,
                "chamber": "senate",
                "district": district,
                "email": data.get("email"),
                "phone": (capitol or {}).get("voice"),
                "address": (capitol or {}).get("address"),
                "imageUrl": image,
                "profileUrl": official,
            }
        )
    return people


def ny_sponsor_catalog(roster: list[dict]) -> list[dict]:
    # Member page paths from the directory listing.
    directory = fetch("https://nyassembly.gov/mem/", "ny-assembly-members.html")
    slugs = []
    for href in re.findall(r'href="(?:https://nyassembly.gov)?/mem/([A-Za-z0-9.\-]+)"', directory):
        if href.lower() in {"email", "leadership", "search"}:
            continue
        slugs.append(href)
    slugs = sorted(set(slugs))
    print(f"New York Assembly sponsor pages: {len(slugs)}.")
    catalog: dict[str, dict] = {}

    def one(slug: str) -> str:
        return fetch(f"https://nyassembly.gov/mem/{slug}/sponsor/", f"ny-sponsors/{slug}.html", timeout=40)

    with ThreadPoolExecutor(max_workers=8) as pool:
        futures = {pool.submit(one, slug): slug for slug in slugs}
        for future in as_completed(futures):
            page = future.result()
            table = re.search(r'id="prime_spo_tbl">(.*?)</table>', page, re.S)
            if not table:
                continue
            for number, title in re.findall(r'bn=([AS]\d+[A-Z]?)[^"]*"[^>]*>[^<]*</A></td><td>([^<]+)', table.group(1)):
                if number in catalog:
                    continue
                catalog[number] = {"number": number, "title": clean(title)}
    bills = []
    for number, row in catalog.items():
        display = re.sub(r"([AS])0+(\d)", r"\1\2", number)
        bills.append(
            {
                "id": f"ny-2025-{number.lower()}",
                "number": number,
                "identifier": display,
                "title": row["title"],
                "caption": row["title"],
                "status": None,
                "chamber": "house" if number.startswith("A") else "senate",
            }
        )
    print(f"New York prime-sponsored bills cataloged: {len(bills)}.")
    return bills


def parse_ny_bill(page: str, bill: dict) -> dict:
    summary_block = re.search(r"Summary:</h3><table[\s\S]*?</table>", page)
    caption = bill["title"]
    sponsor = None
    cosponsors = ""
    if summary_block:
        block = summary_block.group(0)
        sponsor_match = re.search(r"SPONSOR</td><td>([^<]*)</td>", block)
        sponsor = clean(sponsor_match.group(1)) if sponsor_match else None
        co = re.search(r"COSPNSR</td><td>(.*?)</td>", block, re.S)
        cosponsors = clean(co.group(1)) if co else ""
        cells = [clean(item) for item in re.findall(r'colspan=2>([^<]+)', block)]
        sentences = [cell for cell in cells if cell and not cell.lower().startswith("amd") and len(cell) > 25]
        if sentences:
            caption = sentences[-1]
    actions = []
    action_block = re.search(r"Actions:</h3><table[\s\S]*?</table>", page)
    if action_block:
        for date, text in re.findall(r">(\d{2}/\d{2}/\d{4})</td><td[^>]*>([^<]+)", action_block.group(0)):
            month, day, year = date.split("/")
            actions.append({"date": f"{year}-{month}-{day}", "chamber": bill["chamber"], "text": clean(text), "vote": None})
    last = actions[-1] if actions else None
    status = last["text"] if last else None
    return {
        **bill,
        "caption": caption,
        "title": caption.rstrip("."),
        "sponsor": sponsor,
        "cosponsors": [clean(part) for part in re.split(r",| and ", cosponsors) if clean(part)],
        "actions": actions,
        "status": status,
        "last_action": status,
        "last_action_date": last["date"] if last else None,
        "text_url": f"https://nyassembly.gov/leg/?bn={bill['number']}&term=2025&Text=Y",
    }


def build_new_york() -> None:
    print("Building New York.")
    directory = fetch("https://nyassembly.gov/mem/", "ny-assembly-members.html")
    assembly = ny_assembly_roster(directory)
    # Fix profile URLs from hrefs inside each section more carefully.
    sections = directory.split('<section class="mem-item"')
    by_district = {}
    for chunk in sections[1:]:
        district = re.search(r'id="(\d+)"', chunk[:30])
        href = re.search(r'href="([^"]+)"', chunk)
        if district and href:
            link = href.group(1)
            if link.startswith("/"):
                link = "https://nyassembly.gov" + link
            elif not link.startswith("http"):
                link = "https://nyassembly.gov/mem/" + link
            by_district[int(district.group(1))] = link.split("?")[0]
    for person in assembly:
        if person["district"] in by_district and "/mem/" in by_district[person["district"]]:
            person["profileUrl"] = by_district[person["district"]]
    print(f"New York Assembly roster: {len(assembly)}.")
    if len(assembly) < 140:
        raise SystemExit("New York Assembly roster is short.")
    senate = []
    try:
        senate = load_openstates_senate()
        print(f"New York Senate roster from Open States people files: {len(senate)}.")
    except Exception as error:  # noqa: BLE001
        print(f"Senate roster was not loaded: {error}", file=sys.stderr)
    # Party for Assembly members from the same files when the district matches, if present.
    try:
        import yaml  # type: ignore

        legislature = CACHE / "openstates-people" / "data" / "ny" / "legislature"
        if legislature.exists():
            parties: dict[int, str] = {}
            for path in legislature.glob("*.yml"):
                data = yaml.safe_load(path.read_text(encoding="utf-8"))
                for role in data.get("roles") or []:
                    if role.get("type") == "lower" and "state:ny" in (role.get("jurisdiction") or "") and not role.get("end_date"):
                        if data.get("party"):
                            parties[int(str(role["district"]))] = data["party"][0].get("name")
            for person in assembly:
                person["party"] = parties.get(person["district"])
    except Exception as error:  # noqa: BLE001
        print(f"Assembly party labels were not added: {error}", file=sys.stderr)

    bills = ny_sponsor_catalog(assembly)
    shortlist = pick_shortlist(bills)
    selected = [bill for bill in bills if bill["id"] in shortlist]
    print(f"New York shortlist {len(selected)}.")

    def load_one(bill: dict) -> dict:
        page = fetch(
            f"https://nyassembly.gov/leg/?bn={bill['number']}&term=2025&Summary=Y&Actions=Y",
            f"ny-bills/{bill['number']}.html",
            timeout=40,
        )
        return parse_ny_bill(page, bill)

    detailed = []
    with ThreadPoolExecutor(max_workers=8) as pool:
        futures = [pool.submit(load_one, bill) for bill in selected]
        for future in as_completed(futures):
            detailed.append(future.result())
    people = assembly + senate
    used: set[str] = set()
    legislators = []
    for person in people:
        legislators.append(
            {
                "id": person["id"],
                "slug": unique_slug(person["name"], used, person["district"]),
                "name": person["name"],
                "firstName": person["name"].split()[0],
                "lastName": person["lastName"],
                "party": person.get("party"),
                "chamber": person["chamber"],
                "district": person["district"],
                "residence": None,
                "counties": [],
                "email": person.get("email"),
                "phone": person.get("phone"),
                "address": person.get("address"),
                "imageUrl": person.get("imageUrl"),
                "profileUrl": person["profileUrl"],
                "committees": [],
                "leadershipRole": None,
                "status": None,
                "statusNote": None,
                "isCurrent": True,
            }
        )
    known = {person["id"] for person in legislators}

    def find_name(label: str) -> str | None:
        last = label.split()[-1].lower()
        hits = [person for person in legislators if person["lastName"].lower() == last and person["chamber"] == "house"]
        if len(hits) == 1:
            return hits[0]["id"]
        return None

    snapshot_bills = []
    for bill in detailed:
        sponsors = []
        if bill.get("sponsor"):
            sponsors.append({"name": bill["sponsor"], "primary": True, "legislatorId": find_name(bill["sponsor"]) if find_name(bill["sponsor"]) in known else None})
        for name in bill.get("cosponsors") or []:
            if name.lower() in {"", "no cosponsors"}:
                continue
            sponsors.append({"name": name, "primary": False, "legislatorId": find_name(name) if find_name(name) in known else None})
        snapshot_bills.append(
            bill_record(
                bill,
                session="2025",
                session_name="2025-2026 Legislative Session",
                source_url=f"https://nyassembly.gov/leg/?bn={bill['number']}&term=2025",
                topics=shortlist[bill["id"]],
                sponsors=sponsors,
                summary_lead="Official summary",
            )
        )
    gaps = [
        "The shortlist is built from bills prime-sponsored by Assembly members, as listed on nyassembly.gov. Senate-only bills are not in this file.",
        "The New York Senate website (nysenate.gov) returned a bot challenge to this importer, and the Open Legislation API requires a key. Senate roster rows are taken from the Open States people dataset, which cites each member's nysenate.gov page. Birth dates and non-official profiles are not copied.",
        "Assembly party labels, when present, come from that same people dataset because the Assembly directory page does not print party.",
        "Member floor votes are not included. The Assembly summary view lists actions, not a yea/nay roll call.",
        "Counties are not on the Assembly directory.",
    ]
    if len(senate) < 50:
        gaps.append(f"Senate roster count is {len(senate)}. A full Senate is 63 members.")
    write_snapshot(
        "new-york",
        "36",
        snapshot_bills,
        legislators,
        gaps,
        [
            {
                "name": "New York State Assembly bill search and member directory",
                "url": "https://nyassembly.gov/leg/",
                "license": "Official legislative record",
            },
            {
                "name": "Open States people dataset, New York Senate rows that cite nysenate.gov",
                "url": "https://github.com/openstates/people",
                "license": "Compiled roster; official profile links point at nysenate.gov",
            },
        ],
    )


def main() -> None:
    which = set(sys.argv[1:]) or {"idaho", "new-york", "texas"}
    if "idaho" in which:
        build_idaho()
    if "texas" in which:
        build_texas()
    if "new-york" in which:
        build_new_york()


if __name__ == "__main__":
    main()
