The files `snapshot.json` and `zips.json` in this folder are a curated extract for American Capitol Watch.

Bill titles, the Now title on strike-everything amendments, sponsors, actions, final disposition, governor action, chapter numbers, text links, and member floor votes come from the Arizona State Legislature:

- Bill status API: https://apps.azleg.gov/api/
- Official bill page: https://apps.azleg.gov/BillStatus/BillOverview/{BillId}
- Sponsors: https://apps.azleg.gov/api/BillSponsor/?id={BillId}
- Floor roll calls: https://apps.azleg.gov/api/BillStatusFloorAction/?billStatusId={BillId}
- Member roster: https://www.azleg.gov/memberroster/

Sessions in this file: 129 is the 2025 first regular session, and 130 is the 2026 second regular session. Bill numbers repeat across years, so each bill is keyed by session and number. The slug includes the year.

The roster lists sitting members and members the legislature marks as resigned. Resigned members are kept so a recorded vote can still name them. The public roster shows sitting members only.

ZIP-to-district matches come from the U.S. Census Bureau’s 2024 state-legislative-district to 2020 ZCTA relationship files. A ZIP that splits keeps each part of at least 2% of its land area. District counties come from the overlap of `cb_2024_04_sldl`, `cb_2024_04_sldu`, and the 2024 county cartographic boundaries. Arizona uses the same legislative district number for the House and the Senate. Street addresses are looked up live through the Census geocoder and are not stored here.

Credit: Arizona State Legislature. The information is a public legislative record. Census files are works of the U.S. Census Bureau.

Plain-English summaries repeat an official fact-sheet overview when one was published, and otherwise repeat the official short title. They do not add facts. Application source code outside this data folder is not covered by the data credit above.
