The files `snapshot.json` and `zips.json` in this folder are a curated extract for American Capitol Watch.

Bill numbers, captions, authors, sponsors, and the last action come from the Texas Legislature Online filed-bill reports for the 90th Legislature regular session:

- House: https://capitol.texas.gov/reports/Report.aspx?ID=housefiled&LegSess=90R
- Senate: https://capitol.texas.gov/reports/Report.aspx?ID=senatefiled&LegSess=90R
- Bill history: https://capitol.texas.gov/BillLookup/History.aspx?LegSess=90R&Bill=HB101

The report date on those files when this extract was built was November 20, 2026. The regular session convenes in January 2027. This extract is not the 89th regular session and not a called session. The last action on a newly filed bill is often "Filed", which is the whole history the report lists.

The House roster (name, district, photo) comes from https://house.texas.gov/members for members that directory marks active. Districts 1, 93, and 98 are not in that active list and are not filled in. The Senate roster comes from https://senate.texas.gov/members.php. District 22 is listed there as vacant, so no senator is stored for it. Those directories do not print party, email, or phone.

The filed-bill report does not include yea and nay roll calls, so this file has no member vote rows.

ZIP-to-district matches come from the U.S. Census Bureau 2024 State Legislative District to 2020 ZCTA relationship files. A ZIP that splits keeps each part that is at least 2 percent of its land area. Counties are not on these directories. Street addresses are looked up live through the Census geocoder and are not stored here.

Credit: Texas Legislature. The information is public and provided as is. Census files are works of the U.S. Census Bureau.

Plain-English summaries repeat the official caption. They do not add facts. Application source code outside this data folder is not covered by the data credit above.
