The files `snapshot.json` and `zips.json` in this folder are a curated extract for American Capitol Watch.

Bill numbers, short titles, status, the official description, the "by" sponsor line, the action list, and bill-text PDFs come from the Idaho Legislature's 2026 regular session:

- Legislation index: https://legislature.idaho.gov/sessioninfo/2026/legislation/
- Bill page: https://legislature.idaho.gov/sessioninfo/2026/legislation/H0489/

The House and Senate rosters (name, party, district, seat, Statehouse phone, legislative email, committees, and leadership title when the directory prints one) come from:

- https://legislature.idaho.gov/house/membership/
- https://legislature.idaho.gov/senate/membership/

The directory's home mailing address and home phone are not stored. The session convened January 12, 2026. House and Senate share a district number.

Co-sponsor PDFs are linked from the bill pages and are not parsed. The bill pages used here do not list how each member voted, so this file has no member vote rows.

ZIP-to-district matches come from the U.S. Census Bureau 2024 State Legislative District to 2020 ZCTA relationship files. A ZIP that splits keeps each part that is at least 2 percent of its land area. The member directory does not list counties. Street addresses are looked up live through the Census geocoder and are not stored here.

Credit: Idaho Legislature. Census relationship files are works of the U.S. Census Bureau.

The summary stored in the snapshot repeats the official description, or the index short title when the description was not on the page. Public pages may show a shorter plain-language sentence from `src/lib/plain-summaries.ts`, rewritten from that same description. They do not add facts. Application source code outside this data folder is not covered by the data credit above.
