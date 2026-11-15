"""Build Arizona's ZIP and county crosswalk from Census files.

District splits use the 2024 state-legislative-district to 2020 ZCTA
relationship files (land-area shares). Counties on each district come from
the cartographic boundaries cb_2024_04_sldl, cb_2024_04_sldu, and the 2024
county file. Arizona uses the same legislative district number for both
chambers.
"""

from __future__ import annotations

import json
import math
import sys
import zipfile
from pathlib import Path
from urllib.request import Request, urlopen

import shapefile
from shapely.geometry import Point, shape
from shapely.ops import transform
from shapely.prepared import prep

ROOT = Path(__file__).resolve().parents[1]
CACHE = ROOT / "data" / "cache" / "arizona"
OUT_ZIPS = ROOT / "data" / "arizona" / "zips.json"
OUT_DISTRICTS = CACHE / "district-counties.json"

SLDL_REL = "https://www2.census.gov/geo/docs/maps-data/data/rel2020/cd-sld/tab20_sldl202420_zcta520_natl.txt"
SLDU_REL = "https://www2.census.gov/geo/docs/maps-data/data/rel2020/cd-sld/tab20_sldu202420_zcta520_natl.txt"
SLDL_SHP = "https://www2.census.gov/geo/tiger/GENZ2024/shp/cb_2024_04_sldl_500k.zip"
SLDU_SHP = "https://www2.census.gov/geo/tiger/GENZ2024/shp/cb_2024_04_sldu_500k.zip"
COUNTY_SHP = "https://www2.census.gov/geo/tiger/GENZ2024/shp/cb_2024_us_county_500k.zip"
GAZETTEER = "https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2024_Gazetteer/2024_Gaz_zcta_national.zip"

USER_AGENT = "AmericanCapitolWatch/1.0 (Arizona district crosswalk; responses are cached)"
SHARE_MIN = 0.02


def download(url: str, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    if dest.exists() and dest.stat().st_size > 0:
        return
    request = Request(url, headers={"User-Agent": USER_AGENT})
    with urlopen(request, timeout=120) as response, dest.open("wb") as handle:
        handle.write(response.read())
    print(f"Downloaded {dest.name}", file=sys.stderr)


def unzip(archive: Path, folder: Path) -> None:
    folder.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(archive) as bundle:
        bundle.extractall(folder)


def project(geom):
    # Local equirectangular meters around Arizona. Shares, not survey areas.
    cos = math.cos(math.radians(34.3))

    def xy(x, y, z=None):
        return (x * 111_320 * cos, y * 110_540)

    return transform(xy, geom)


def reader_for(folder: Path):
    shp = next(folder.glob("*.shp"))
    return shapefile.Reader(str(shp))


def record_dict(reader, index: int) -> dict:
    names = [field[0] for field in reader.fields if field[0] != "DeletionFlag"]
    values = reader.record(index)
    return dict(zip(names, values))


def district_number(rec: dict) -> int:
    for key in ("SLDLST", "SLDUST"):
        raw = str(rec.get(key) or "").strip()
        if raw.isdigit():
            return int(raw)
    geoid = str(rec.get("GEOID") or "").strip()
    if geoid.startswith("04") and geoid[2:].isdigit():
        return int(geoid[2:])
    raise RuntimeError(f"Could not read a district number from {rec}")


def load_districts(folder: Path) -> dict[int, object]:
    reader = reader_for(folder)
    found: dict[int, object] = {}
    for index in range(len(reader)):
        rec = record_dict(reader, index)
        number = district_number(rec)
        geom = project(shape(reader.shape(index).__geo_interface__))
        if geom.is_empty:
            continue
        found[number] = found[number].union(geom) if number in found else geom
    return found


def load_counties(folder: Path) -> list[tuple[str, object]]:
    reader = reader_for(folder)
    counties = []
    for index in range(len(reader)):
        rec = record_dict(reader, index)
        if str(rec.get("STATEFP") or "") != "04":
            continue
        name = str(rec.get("NAME") or "").strip()
        geom = project(shape(reader.shape(index).__geo_interface__))
        if name and not geom.is_empty:
            counties.append((name, geom))
    return counties


def county_shares(districts: dict[int, object], counties: list[tuple[str, object]]) -> dict[str, list[str]]:
    prepared = [(name, geom, prep(geom)) for name, geom in counties]
    result: dict[str, list[str]] = {}
    for number, geom in sorted(districts.items()):
        area = geom.area
        shares: list[tuple[str, float]] = []
        for name, county, fast in prepared:
            if not fast.intersects(geom):
                continue
            overlap = geom.intersection(county).area
            share = overlap / area if area else 0
            if share >= SHARE_MIN:
                shares.append((name, share))
        shares.sort(key=lambda item: item[1], reverse=True)
        result[str(number)] = [name for name, _share in shares]
        if not result[str(number)]:
            raise RuntimeError(f"District {number} did not overlap an Arizona county.")
    return result


def read_relationship(path: Path, district_column: str) -> dict[str, dict[int, float]]:
    zips: dict[str, dict[int, float]] = {}
    lines = path.read_text(encoding="utf-8-sig").splitlines()
    header = lines[0].split("|")
    district_index = header.index(district_column)
    zip_index = header.index("GEOID_ZCTA5_20")
    part_index = header.index("AREALAND_PART")
    total_index = header.index("AREALAND_ZCTA5_20")
    for line in lines[1:]:
        if not line:
            continue
        parts = line.split("|")
        geoid = parts[district_index]
        if not geoid.startswith("04"):
            continue
        district = int(geoid[2:])
        zip_code = parts[zip_index]
        part = float(parts[part_index] or 0)
        total = float(parts[total_index] or 0)
        if len(zip_code) != 5 or not zip_code.isdigit() or district <= 0 or total <= 0 or part <= 0:
            continue
        share = part / total
        if share < SHARE_MIN:
            continue
        row = zips.setdefault(zip_code, {})
        row[district] = row.get(district, 0) + share
    return zips


def load_points(archive: Path) -> dict[str, tuple[float, float]]:
    points: dict[str, tuple[float, float]] = {}
    with zipfile.ZipFile(archive) as bundle:
        name = next(item for item in bundle.namelist() if item.lower().endswith(".txt"))
        raw = bundle.read(name).decode("utf-8-sig")
    lines = raw.splitlines()
    delimiter = "|" if "|" in lines[0] else "\t"
    header = [part.strip() for part in lines[0].split(delimiter)]
    geoid_index = header.index("GEOID")
    lat_index = header.index("INTPTLAT")
    lon_index = header.index("INTPTLONG")
    for line in lines[1:]:
        parts = [part.strip() for part in line.split(delimiter)]
        if len(parts) <= lon_index:
            continue
        geoid = parts[geoid_index]
        if len(geoid) != 5:
            continue
        points[geoid] = (float(parts[lon_index]), float(parts[lat_index]))
    return points


def point_counties(points: dict[str, tuple[float, float]], counties: list[tuple[str, object]]) -> dict[str, str]:
    prepared = [(name, prep(geom)) for name, geom in counties]
    found: dict[str, str] = {}
    for zip_code, (lon, lat) in points.items():
        point = project(Point(lon, lat))
        for name, fast in prepared:
            if fast.contains(point):
                found[zip_code] = name
                break
    return found


def share_rows(raw: dict[int, float]) -> list[dict]:
    rows = [
        {"district": district, "share": round(min(share, 1), 4)}
        for district, share in raw.items()
    ]
    rows.sort(key=lambda item: item["share"], reverse=True)
    return rows


def main() -> None:
    download(SLDL_REL, CACHE / "sldl-zcta.txt")
    download(SLDU_REL, CACHE / "sldu-zcta.txt")
    download(SLDL_SHP, CACHE / "cb_2024_04_sldl_500k.zip")
    download(SLDU_SHP, CACHE / "cb_2024_04_sldu_500k.zip")
    download(COUNTY_SHP, CACHE / "cb_2024_us_county_500k.zip")
    download(GAZETTEER, CACHE / "2024_Gaz_zcta_national.zip")
    unzip(CACHE / "cb_2024_04_sldl_500k.zip", CACHE / "sldl")
    unzip(CACHE / "cb_2024_04_sldu_500k.zip", CACHE / "sldu")
    unzip(CACHE / "cb_2024_us_county_500k.zip", CACHE / "county")

    house_geom = load_districts(CACHE / "sldl")
    senate_geom = load_districts(CACHE / "sldu")
    counties = load_counties(CACHE / "county")
    if len(counties) != 15:
        raise RuntimeError(f"Expected 15 Arizona counties, found {len(counties)}.")
    if set(house_geom) != set(range(1, 31)) or set(senate_geom) != set(range(1, 31)):
        raise RuntimeError(
            f"Expected districts 1–30. House {sorted(house_geom)} Senate {sorted(senate_geom)}."
        )

    house_counties = county_shares(house_geom, counties)
    senate_counties = county_shares(senate_geom, counties)
    house_zips = read_relationship(CACHE / "sldl-zcta.txt", "GEOID_SLDL2024_20")
    senate_zips = read_relationship(CACHE / "sldu-zcta.txt", "GEOID_SLDU2024_20")
    points = point_counties(load_points(CACHE / "2024_Gaz_zcta_national.zip"), counties)

    zips = {}
    mismatched = 0
    for zip_code in sorted(set(house_zips) | set(senate_zips)):
        house = share_rows(house_zips.get(zip_code, {}))
        senate = share_rows(senate_zips.get(zip_code, {}))
        if not house and not senate:
            continue
        if [row["district"] for row in house] != [row["district"] for row in senate]:
            mismatched += 1
        names = []
        point_name = points.get(zip_code)
        if point_name:
            names.append(point_name)
        for row in house:
            only = house_counties.get(str(row["district"]), [])
            if len(only) == 1 and only[0] not in names:
                names.append(only[0])
        zips[zip_code] = {"city": "", "counties": names, "house": house, "senate": senate}

    county_names = sorted({name for name, _geom in counties})
    OUT_ZIPS.parent.mkdir(parents=True, exist_ok=True)
    OUT_ZIPS.write_text(
        json.dumps(
            {
                "source": "U.S. Census Bureau 2024 State Legislative District to 2020 ZCTA relationship files",
                "sourceUrl": SLDL_REL,
                "senateSourceUrl": SLDU_REL,
                "districtBoundaryUrl": SLDL_SHP,
                "senateBoundaryUrl": SLDU_SHP,
                "countyBoundaryUrl": COUNTY_SHP,
                "license": "U.S. Census Bureau public data",
                "note": "Arizona uses the same legislative district for the House and the Senate. ZIP shares are land area from the relationship file. Parts under 2% are omitted. Counties on a district are cartographic-boundary overlap of at least 2%. A ZIP county list starts with the ZCTA internal point and adds a county when a listed district lies in only that county.",
                "counties": county_names,
                "zips": zips,
            }
        )
    )
    OUT_DISTRICTS.write_text(json.dumps({"house": house_counties, "senate": senate_counties}))
    print(
        f"ZIP crosswalk: {len(zips)} Arizona ZCTAs. "
        f"House/Senate district lists differ for {mismatched} ZIPs."
    )


if __name__ == "__main__":
    main()
