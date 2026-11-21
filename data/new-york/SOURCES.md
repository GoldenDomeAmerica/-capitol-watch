The files `snapshot.json` and `zips.json` in this folder are a curated extract for American Capitol Watch.

Bill numbers, summaries, sponsors, cosponsors, and actions come from the New York State Assembly for the 2025–2026 session (named 2025):

- Bill page: https://nyassembly.gov/leg/?bn=A00100&term=2025
- Assembly roster: https://nyassembly.gov/mem/

The shortlist is drawn from bills an Assembly member prime-sponsored. A Senate bill that no Assembly member prime-sponsored is not in this file.

The Assembly directory does not print party. Party on an Assembly row is the party in the Open States people dataset for that Assembly district: https://github.com/openstates/people

The Senate roster is the current upper-chamber people in that same dataset whose profile link is on nysenate.gov. The Senate site returned a bot challenge to this import, and the Open Legislation API requires a key. Senate District 12 has no current row in the dataset and is left empty. Birth dates and non-official profiles are not copied.

Member floor votes are not on the Assembly summary view, so this file has no member vote rows.

ZIP-to-district matches come from the U.S. Census Bureau 2024 State Legislative District to 2020 ZCTA relationship files. A ZIP that splits keeps each part that is at least 2 percent of its land area. The Assembly directory does not list counties. Street addresses are looked up live through the Census geocoder and are not stored here.

Credit: New York State Assembly for bills and the Assembly roster. Senate rows cite the official nysenate.gov profile stored in the Open States people dataset. Census files are works of the U.S. Census Bureau.

Plain-English summaries repeat the official Assembly summary. They do not add facts. Application source code outside this data folder is not covered by the data credit above.
