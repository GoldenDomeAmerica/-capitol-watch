import type { BillResearch, BillSource } from "@/lib/bill-research/types";
import { RESEARCH_CHECKED } from "@/lib/bill-research/types";

function source(label: string, url: string): BillSource {
  return { label, url, checked: RESEARCH_CHECKED };
}

const H0623 = "https://legislature.idaho.gov/sessioninfo/2026/legislation/h0623/";
const H0559 = "https://legislature.idaho.gov/sessioninfo/2026/legislation/h0559/";
const H0708 = "https://legislature.idaho.gov/sessioninfo/2026/legislation/h0708/";
const H0736 = "https://legislature.idaho.gov/sessioninfo/2026/legislation/h0736/";
const S1349 = "https://legislature.idaho.gov/sessioninfo/2026/legislation/s1349/";

const ED_NEWS = "https://www.idahoednews.org/top-news/teachers-are-rolling-their-eyes-over-moment-of-silence-mandate/";
const SHOSHONE =
  "https://shoshonenewspress.com/news/2026/sep/15/silver-valley-schools-settle-into-moment-of-silence-routine/";
const SUN_FEB6 = "https://idahocapitalsun.com/2026/02/06/idaho-senate-approves-bill-conforming-to-federal-tax-cuts-in-big-beautiful-bill/";

export const IDAHO_BILL_RESEARCH: BillResearch[] = [
  {
    state: "idaho",
    slug: "h0623",
    identifier: "H0623",
    shortSummary:
      "Every Idaho public school classroom now has to start the day with at least 60 seconds of silence. Students can pray, reflect, meditate, or just sit quietly, and teachers can't tell them what to think about. Schools must tell parents about it and encourage them to guide their kids. It passed the House 51-17 and the Senate 18-15, and the fiscal note says it costs nothing.",
    statusLabel: "Signed into law, effective July 1, 2026 (Ch. 62)",
    whatItChanges:
      "Adds a new section, Idaho Code § 33-1639, “Moment of silence in public schools.” It does not amend an existing section.\n\nAt or near the start of each school day, in all grades and all Idaho public schools, the teacher or school employee in charge of a classroom must provide at least 60 seconds of silence, with every pupil participating. During that period a student may reflect, meditate, pray, or do another silent activity, as long as the student does not interfere with or distract another student. No other activities may take place during the period. Staff must require pupils to remain silent and make no distracting display. Public-school personnel may not instruct students on the nature of any reflection, other than as the section itself provides. Each public school must notify parents and legal guardians about the period of silence and must encourage them to give pupils guidance on it.\n\nSection 2 declares an emergency and makes the act effective on and after July 1, 2026.",
    timeline: [
      { date: "2026-02-10", action: "Introduced, read first time, referred to JRA for Printing" },
      { date: "2026-02-11", action: "Reported printed and referred to Education" },
      { date: "2026-02-20", action: "Reported out of committee with Do Pass recommendation; filed for second reading" },
      { date: "2026-02-23", action: "Read second time; filed for third reading" },
      { date: "2026-02-24", action: "Read third time in full; passed the House 51-17-2; title approved; to Senate" },
      { date: "2026-02-25", action: "Received in the Senate; introduced, read first time; referred to Education" },
      { date: "2026-03-11", action: "Reported out of committee with Do Pass recommendation; filed for second reading" },
      { date: "2026-03-12", action: "Read second time; filed for third reading" },
      { date: "2026-03-16", action: "Read third time in full; passed the Senate 18-15-2; title approved; to House" },
      {
        date: "2026-03-17",
        action: "Returned from Senate passed; to JRA for enrolling; reported enrolled; signed by Speaker; transmitted to Senate",
      },
      {
        date: "2026-03-18",
        action:
          "Received in the Senate enrolled/signed by Speaker; signed by President; returned to House; ordered transmitted to Governor",
      },
      {
        date: "2026-03-19",
        action: "Delivered to the Governor at 4:22 p.m. on March 18, 2026 (time as printed; zone not stated on the bill page)",
      },
      {
        date: "2026-03-20",
        action: "Reported signed by the Governor on March 19, 2026; Session Law Chapter 62; effective July 1, 2026",
      },
    ],
    fiscalNote:
      "The official Statement of Purpose / Fiscal Note (revised March 13, 2026, 10:22 a.m.) states: “This legislation causes no increase or decrease in revenue, or additional expenditure of funds at the state or local level of government; therefore, this legislation has no fiscal impact.”",
    votes: [
      { chamber: "house", date: "2026-02-24", yes: 51, no: 17, absent: 2, url: H0623 },
      { chamber: "senate", date: "2026-03-16", yes: 18, no: 15, absent: 2, url: H0623 },
    ],
    sponsors: [
      {
        name: "Rep. Bruce D. Skaug",
        party: "Republican",
        role: "Statement of Purpose contact and House floor sponsor",
        url: "https://legislature.idaho.gov/legislators/membership/2026/id6708/",
      },
      {
        name: "Sen. Tammy Nichols",
        party: "Republican",
        role: "Statement of Purpose contact and Senate floor sponsor",
        url: "https://legislature.idaho.gov/legislators/membership/2026/id5380/",
      },
    ],
    conservativeView: [
      {
        quote: "This isn't a sneaky way to get prayer into school.",
        speaker: "Rep. Bruce Skaug",
        party: "Republican",
        role: "sponsor",
        outlet: "Idaho Education News",
        date: "Mar 25, 2026",
        url: ED_NEWS,
      },
      {
        quote:
          "“Just that 60 seconds,” he said. “No screen time, no outside influence, just to reflect, to pray or whatever they want to do in that 60 seconds.”",
        speaker: "Rep. Bruce Skaug",
        party: "Republican",
        role: "bill co-sponsor and House floor sponsor",
        outlet: "Shoshone News-Press",
        date: "September 15, 2026",
        url: SHOSHONE,
      },
    ],
    liberalView: [
      {
        quote: "“No serious person in education thinks a moment of silence is going to achieve anything.”",
        speaker: "Brian Coffey",
        party: "party not stated",
        role: "president, Nampa Education Association",
        outlet: "Idaho Education News",
        date: "Mar 25, 2026",
        url: ED_NEWS,
        label: "OPPOSING VIEW · Opinion",
      },
    ],
    viewpointNote: "The Idaho Education Association was officially neutral on the legislation.",
    sponsorStatement: {
      quote:
        "“This legislation requires public school classrooms provide a moment of silence for students for a minimum of sixty seconds, at or near the beginning of each school day, to reflect, meditate, pray, or engage in any other silent activity. It is the student’s choice, so long as they do not interfere with another student’s moment of silence. Public schools are prohibited from providing instruction regarding the nature of the moment of silence, other than as provided in this section.”",
      speaker: "Rep. Bruce D. Skaug",
      party: "Republican",
      role: "Statement of Purpose contact and House floor sponsor",
      url: "https://legislature.idaho.gov/wp-content/uploads/sessioninfo/2026/legislation/H0623SOP.pdf",
    },
    news: [
      {
        outlet: "Coeur d’Alene Press",
        date: "Sept. 25, 2026",
        title: "Not found",
        url: "https://cdapress.com/news/2026/sep/25/starting-the-school-day-with-silence/",
      },
      {
        outlet: "Shoshone News-Press",
        date: "Sept. 15, 2026",
        title: "Not found",
        url: SHOSHONE,
      },
      {
        outlet: "Idaho Education News",
        date: "March 25, 2026",
        title: "Not found",
        url: ED_NEWS,
      },
    ],
    sources: [
      source("Official bill page (status, actions, roll calls)", H0623),
      source("Bill text PDF", "https://legislature.idaho.gov/wp-content/uploads/sessioninfo/2026/legislation/H0623.pdf"),
      source(
        "Statement of Purpose / Fiscal Note PDF",
        "https://legislature.idaho.gov/wp-content/uploads/sessioninfo/2026/legislation/H0623SOP.pdf",
      ),
      source(
        "Current statute § 33-1639",
        "https://legislature.idaho.gov/statutesrules/idstat/title33/t33ch16/sect33-1639/",
      ),
      source("LegiScan", "https://legiscan.com/ID/bill/H0623/2026"),
      source("Coeur d’Alene Press, Audrey Herrin, Sept. 25, 2026", "https://cdapress.com/news/2026/sep/25/starting-the-school-day-with-silence/"),
      source("Shoshone News-Press, Josh McDonald, Sept. 15, 2026", SHOSHONE),
      source("Idaho Education News, Sean Dolan, March 25, 2026", ED_NEWS),
      source("Rep. Bruce D. Skaug, official member page", "https://legislature.idaho.gov/legislators/membership/2026/id6708/"),
      source("Sen. Tammy Nichols, official member page", "https://legislature.idaho.gov/legislators/membership/2026/id5380/"),
    ],
  },
  {
    state: "idaho",
    slug: "h0559",
    identifier: "H0559",
    shortSummary:
      "Idaho's income tax code now follows the federal One Big Beautiful Bill, with two exceptions. Idahoans get the federal breaks on their state returns too: no tax on tips or overtime, a deduction for car-loan interest, a bigger standard deduction, and a larger senior deduction. The fiscal note puts the cost to state revenue at about $155 million this fiscal year and $175 million next year. It passed the House 59-9 and the Senate 28-7.",
    statusLabel: "Signed into law, retroactive to Jan 1, 2025 (Ch. 1)",
    whatItChanges:
      "Amends three existing sections. It does not add a new section.\n\nIdaho Code § 63-3004. Updates the state’s definition of “Internal Revenue Code” from the Code as in effect on January 1, 2025, to the Code as in effect on January 1, 2026. Two exceptions remain: (1) IRC § 85 is applied as in effect on January 1, 2020; and (2) specified research or experimental expenditures, as defined in IRC § 174 as in effect on December 31, 2024, incurred in taxable years beginning on or after January 1, 2022, and before January 1, 2025, continue to be treated under the Internal Revenue Code provisions in effect immediately before enactment of section 70302 of P.L. 119-21, rather than under that section.\n\nIdaho Code § 63-3022O. Extends Idaho’s existing add-back / decoupling rules for federal bonus depreciation so they also cover IRC § 168(n), not only § 168(k).\n\nIdaho Code § 63-3029G. Keeps the existing Idaho credit for increasing research activities in Idaho, and adds that amounts deducted or amortized under IRC § 174 or § 174A that constitute qualified research expenses are not eligible for that credit.\n\nSection 4 declares an emergency and makes the act effective on and after passage and approval, and retroactive to January 1, 2025.",
    timeline: [
      { date: "2026-01-29", action: "Introduced, read first time, referred to JRA for Printing" },
      { date: "2026-01-30", action: "Reported printed and referred to Revenue & Taxation" },
      { date: "2026-02-02", action: "Reported out of committee with Do Pass recommendation; filed for second reading" },
      {
        date: "2026-02-03",
        action:
          "Read second time; filed for third reading. Rules suspended (Ayes 64, Nays 2, Absent/excused 4); read in full as required; passed the House 59-9-2; title approved; to Senate",
      },
      { date: "2026-02-04", action: "Received in the Senate; introduced, read first time; referred to Local Government & Taxation" },
      {
        date: "2026-02-06",
        action:
          "Reported out of committee with Do Pass recommendation; filed for second reading. Rules suspended (2/3 vote — read in full as required); passed the Senate 28-7-0; title approved; to House",
      },
      {
        date: "2026-02-09",
        action:
          "Returned from Senate passed; to JRA for enrolling; reported enrolled; signed by Speaker; transmitted to Senate; signed by President; returned to House; ordered transmitted to Governor",
      },
      {
        date: "2026-02-10",
        action: "Delivered to the Governor at 2:40 p.m. on February 9, 2026 (time as printed; zone not stated on the bill page)",
      },
      {
        date: "2026-02-11",
        action: "Reported signed by the Governor on February 10, 2026; Session Law Chapter 1; effective retroactive to January 1, 2025",
      },
    ],
    fiscalNote:
      "The official Statement of Purpose / Fiscal Note (introduced January 29, 2026, 9:59 a.m.) states: “The estimated additional fiscal impact to general revenue for Fiscal Year 2026 is a decrease of $155 million and for Fiscal Year 2027 a decrease of $175 million.” The official fiscal note does not list administrative implementation costs. Idaho Capital Sun later reported that a Feb. 2, 2026, Tax Commission memo to bill sponsors estimated $555,000 in administrative costs that were not included in the fiscal note.",
    votes: [
      { chamber: "house", date: "2026-02-03", yes: 59, no: 9, absent: 2, url: H0559 },
      { chamber: "senate", date: "2026-02-06", yes: 28, no: 7, absent: 0, url: H0559 },
    ],
    sponsors: [
      {
        name: "Rep. Jeff Ehlers",
        party: "Republican",
        role: "Statement of Purpose contact and House floor sponsor",
        url: "https://legislature.idaho.gov/legislators/membership/2026/id7805/",
      },
      {
        name: "Sen. C. Scott Grow",
        party: "Republican",
        role: "Statement of Purpose contact",
        url: "https://legislature.idaho.gov/legislators/membership/2026/id5126/",
      },
      {
        name: "Rep. David M. Cannon",
        party: "Republican",
        role: "Statement of Purpose contact",
        url: "https://legislature.idaho.gov/legislators/membership/2026/id6699/",
      },
      {
        name: "Sen. Doug Ricks",
        party: "Republican",
        role: "Statement of Purpose contact and Senate floor sponsor",
        url: "https://legislature.idaho.gov/legislators/membership/2026/id5383/",
      },
    ],
    conservativeView: [
      {
        quote: "“Even though there is a cost of $155 million projected for (fiscal year 2026), there is a huge benefit to our Idaho taxpayers.”",
        speaker: "Sen. Doug Ricks",
        party: "Republican",
        role: "bill sponsor and Senate floor sponsor",
        outlet: "Idaho Capital Sun",
        date: "February 6, 2026",
        url: SUN_FEB6,
      },
    ],
    liberalView: [
      {
        quote:
          "“I just think that’s wrong,” Wintrow said of the ongoing agency cuts. “We really need to rethink that. We need to be more conservative, and in that respect, restore the revenue that we’ve taken out and cut too hard. Because our government is on the brink, and folks are suffering.”",
        speaker: "Sen. Melissa Wintrow",
        party: "Democrat",
        role: "Senate Minority Leader, who voted no",
        outlet: "Idaho Capital Sun",
        date: "February 6, 2026",
        url: SUN_FEB6,
      },
    ],
    sponsorStatement: {
      quote:
        "“This proposed legislation is the annual tax conformity bill to update references to the Internal Revenue Code (IRC). The bill conforms the Idaho income tax code to changes made to the IRC that affect the 2025 tax year. It fully conforms Idaho to the tax changes in the One Big Beautiful Bill with two exceptions: 1. Bonus depreciation which Idaho has historically not conformed to. 2. R&E expenditures incurred from 2022-2024 already being amortized will continue to the end of their 5-year amortization schedule. Any R&E expenditures from 2025 and forward will conform to OBBB. This proposed legislation also ensures that businesses cannot use the same R&E expenses for both a deduction and an Idaho tax credit.”",
      speaker: "Rep. Jeff Ehlers",
      party: "Republican",
      role: "Statement of Purpose contact and House floor sponsor",
      url: "https://legislature.idaho.gov/wp-content/uploads/sessioninfo/2026/legislation/H0559SOP.pdf",
    },
    news: [
      { outlet: "Idaho Capital Sun", date: "Feb. 6, 2026", title: "Not found", url: SUN_FEB6 },
      {
        outlet: "Idaho Capital Sun",
        date: "Feb. 11, 2026",
        title: "Not found",
        url: "https://idahocapitalsun.com/2026/02/11/idaho-tax-commission-estimates-it-will-cost-555k-to-implement-big-beautiful-tax-changes/",
      },
      {
        outlet: "Idaho State Tax Commission",
        date: "Feb. 17, 2026",
        title: "Not found",
        url: "https://tax.idaho.gov/pressrelease/update-on-filing-2025-idaho-income-taxes-now-that-conformity-is-law/",
      },
    ],
    sources: [
      source("Official bill page (status, actions, roll calls)", H0559),
      source("Bill text PDF", "https://legislature.idaho.gov/wp-content/uploads/sessioninfo/2026/legislation/H0559.pdf"),
      source(
        "Statement of Purpose / Fiscal Note PDF",
        "https://legislature.idaho.gov/wp-content/uploads/sessioninfo/2026/legislation/H0559SOP.pdf",
      ),
      source("Current statute § 63-3004", "https://legislature.idaho.gov/statutesrules/idstat/title63/t63ch30/sect63-3004/"),
      source("LegiScan", "https://legiscan.com/ID/bill/H0559/2026"),
      source("Idaho Capital Sun, Laura Guido, Feb. 6, 2026", SUN_FEB6),
      source(
        "Idaho Capital Sun, Laura Guido, Feb. 11, 2026",
        "https://idahocapitalsun.com/2026/02/11/idaho-tax-commission-estimates-it-will-cost-555k-to-implement-big-beautiful-tax-changes/",
      ),
      source(
        "Idaho State Tax Commission press release, Feb. 17, 2026",
        "https://tax.idaho.gov/pressrelease/update-on-filing-2025-idaho-income-taxes-now-that-conformity-is-law/",
      ),
      source("Rep. Jeff Ehlers, official member page", "https://legislature.idaho.gov/legislators/membership/2026/id7805/"),
      source("Sen. Doug Ricks, official member page", "https://legislature.idaho.gov/legislators/membership/2026/id5383/"),
      source("Sen. Melissa Wintrow, official member page", "https://legislature.idaho.gov/legislators/membership/2026/id3139/"),
    ],
  },
  {
    state: "idaho",
    slug: "h0708",
    identifier: "H0708",
    shortSummary:
      "This would have made every homeowner association face a vote every 10 years. The HOA would dissolve automatically unless a majority of eligible members voted to keep it. Each HOA would also have had to plan ahead for what happens to shared property like parks and clubhouses. The bill never got a committee vote before the session ended on April 2.",
    statusLabel: "Died in committee",
    whatItChanges:
      "Would have added a new section, Idaho Code § 55-3204C, “Automatic dissolution of homeowner’s associations,” to Chapter 32, Title 55 (the Homeowner’s Association Act). It would not have amended an existing section. The bill did not become law.\n\nAny homeowner’s association that, as of July 1, 2026, had existed for 10 years or more would automatically dissolve on July 1, 2029, unless its members voted against dissolution. Any association in existence for less than 10 years as of July 1, 2026, or created after that date, would automatically dissolve 10 years after its articles were filed, unless members voted against dissolution. Automatic dissolution would not occur if a majority of the eligible voters voted against it.\n\nUnless the declaration or governing documents provided otherwise, common property would remain dedicated to the members’ common use. The plan of dissolution would have to provide for disposition of the association’s assets by transfer to a successor entity, the lot owners, or a local government.\n\nSection 2 declared an emergency and would have made the act effective on and after July 1, 2026.",
    timeline: [
      { date: "2026-02-16", action: "Introduced, read first time, referred to JRA for Printing" },
      { date: "2026-02-17", action: "Reported printed and referred to Business" },
      {
        date: "2026-04-02",
        action:
          "The 2026 legislative session ended. No further official actions appear on the bill page. The official page shows no committee report, floor vote, or enrollment.",
      },
    ],
    fiscalNote:
      "The official Statement of Purpose / Fiscal Note (introduced February 16, 2026, 10:51 a.m.) states: “This legislation causes no additional expenditure of funds at the state or local level of government, nor does it cause an increase or decrease in revenue for state or local government. Therefore, the legislation has no fiscal impact.”",
    votes: [],
    sponsors: [
      {
        name: "Rep. Jeff Ehlers",
        party: "Republican",
        role: "Statement of Purpose contact",
        url: "https://legislature.idaho.gov/legislators/membership/2026/id7805/",
      },
    ],
    conservativeView: [
      {
        quote:
          "“This legislation seeks to allow for the automatic sunsetting of HOAs. Every 10 years, current HOAs members will vote whether or not to keep their HOA. The current HOA will create a plan on how the common property would be handled upon dissolution, with broad options allowed for.”",
        speaker: "Rep. Jeff Ehlers",
        party: "Republican",
        role: "Statement of Purpose contact",
        outlet: "Statement of Purpose",
        date: "February 16, 2026",
        url: "https://legislature.idaho.gov/wp-content/uploads/sessioninfo/2026/legislation/H0708SOP.pdf",
      },
    ],
    sponsorStatement: {
      quote:
        "“This legislation seeks to allow for the automatic sunsetting of HOAs. Every 10 years, current HOAs members will vote whether or not to keep their HOA. The current HOA will create a plan on how the common property would be handled upon dissolution, with broad options allowed for.”",
      speaker: "Rep. Jeff Ehlers",
      party: "Republican",
      role: "Statement of Purpose contact",
      url: "https://legislature.idaho.gov/wp-content/uploads/sessioninfo/2026/legislation/H0708SOP.pdf",
    },
    news: [
      {
        outlet: "KIVI / Idaho News 6",
        date: "Not found",
        title: "Not found",
        url: "https://www.kivitv.com/eagle/eagles-new-hoa-networking-group-holds-first-meeting-amid-concerns-over-house-bill-708-and-sewer-district-plans",
      },
    ],
    sources: [
      source("Official bill page (status and actions)", H0708),
      source("Bill text PDF", "https://legislature.idaho.gov/wp-content/uploads/sessioninfo/2026/legislation/H0708.pdf"),
      source(
        "Statement of Purpose / Fiscal Note PDF",
        "https://legislature.idaho.gov/wp-content/uploads/sessioninfo/2026/legislation/H0708SOP.pdf",
      ),
      source("LegiScan", "https://legiscan.com/ID/bill/H0708/2026"),
      source("Office of the Governor, 2026 Legislative Session page", "https://gov.idaho.gov/legislative-sessions/2026-session/"),
      source("Legislature “Today in the House” page", "https://legislature.idaho.gov/sessioninfo/agenda/today-in-the-house/"),
      source(
        "Idaho Capital Sun, Clark Corbin, April 2, 2026",
        "https://idahocapitalsun.com/2026/04/02/after-divisive-session-marked-by-budget-cuts-idaho-legislature-adjourns-2026-session/",
      ),
      source(
        "KIVI / Idaho News 6, Greenlee Clark",
        "https://www.kivitv.com/eagle/eagles-new-hoa-networking-group-holds-first-meeting-amid-concerns-over-house-bill-708-and-sewer-district-plans",
      ),
      source("Rep. Jeff Ehlers, official member page", "https://legislature.idaho.gov/legislators/membership/2026/id7805/"),
    ],
  },
  {
    state: "idaho",
    slug: "h0736",
    identifier: "H0736",
    shortSummary:
      "In any area with more than 25,000 registered voters, candidate names now rotate on the ballot for federal, state, county, and local races. The Secretary of State sets one standard for all of it. It passed with almost no opposition, 68-1 in the House and 34-0 in the Senate.",
    statusLabel: "Signed into law, effective July 1, 2026 (Ch. 186)",
    whatItChanges:
      "Amends existing Idaho Code § 34-903, which directs the Secretary of State to prescribe the form and contents of ballots and related documents.\n\nPreviously, candidate-name rotation determined by the Secretary of State applied to federal, state, county, and city offices in a political entity whose registered-voter count at the last general election exceeded 25,000, and a separate rule required rotation for “other offices” only if the entity’s registered-voter count exceeded 100,000. The bill strikes “city” and inserts “local,” so rotation under the 25,000-voter rule applies to federal, state, county, and local offices. It deletes the separate 100,000-voter rule for other offices. In all other elections, name order is determined by applying the first letter of each candidate’s last name to a random alphabet selected before each election by the Secretary of State.\n\nSection 2 declares an emergency and makes the act effective on and after July 1, 2026.",
    timeline: [
      { date: "2026-02-19", action: "Introduced, read first time, referred to JRA for Printing" },
      { date: "2026-02-20", action: "Reported printed and referred to State Affairs" },
      { date: "2026-02-26", action: "Reported out of committee with Do Pass recommendation; filed for second reading" },
      { date: "2026-02-27", action: "Read second time; filed for third reading" },
      { date: "2026-03-02", action: "U.C. to hold place on third reading calendar one legislative day" },
      { date: "2026-03-03", action: "U.C. to hold place on third reading calendar one legislative day" },
      { date: "2026-03-04", action: "U.C. to hold place on third reading calendar one legislative day" },
      { date: "2026-03-05", action: "Read third time in full; passed the House 68-1-1; title approved; to Senate" },
      { date: "2026-03-06", action: "Received in the Senate; introduced, read first time; referred to State Affairs" },
      { date: "2026-03-17", action: "Reported out of committee with Do Pass recommendation; filed for second reading" },
      { date: "2026-03-18", action: "Read second time; filed for third reading" },
      {
        date: "2026-03-24",
        action: "Read third time in full; passed the Senate 34-0-1; title approved; to House; returned from Senate passed; to JRA for enrolling",
      },
      {
        date: "2026-03-25",
        action: "Reported enrolled; signed by Speaker; transmitted to Senate; received in the Senate; signed by President; returned to House",
      },
      {
        date: "2026-03-26",
        action:
          "Returned signed by the President; ordered transmitted to Governor; delivered to the Governor at 12:58 p.m. on March 26, 2026 (time as printed; zone not stated on the bill page)",
      },
      {
        date: "2026-03-30",
        action: "Reported signed by the Governor on March 26, 2026; Session Law Chapter 186; effective July 1, 2026",
      },
    ],
    fiscalNote:
      "The official Statement of Purpose / Fiscal Note (introduced February 19, 2026, 10:20 a.m.) states: “This legislation will have no fiscal impact on any state political subdivision nor the state general fund. Any enforcement costs will be managed within existing budgets.”",
    votes: [
      { chamber: "house", date: "2026-03-05", yes: 68, no: 1, absent: 1, url: H0736 },
      { chamber: "senate", date: "2026-03-24", yes: 34, no: 0, absent: 1, url: H0736 },
    ],
    sponsors: [
      {
        name: "Rep. Anne Henderson Haws",
        party: "Democrat",
        role: "Statement of Purpose contact and House floor sponsor",
        url: "https://legislature.idaho.gov/legislators/membership/2026/id10055/",
      },
      {
        name: "Sen. James D. Ruchti",
        party: "Democrat",
        role: "Senate floor sponsor",
        url: "https://legislature.idaho.gov/legislators/membership/2026/id52/",
      },
    ],
    bipartisan: true,
    viewpointNote:
      "Bipartisan, passed nearly unanimously. Sponsored by Rep. Anne Henderson Haws (D) and Sen. James D. Ruchti (D). The only no vote was Rep. Ted Hill (R).",
    sponsorStatement: {
      quote:
        "“This legislation amends Idaho Code section 34-903 to revise ballot rotation requirements by applying current candidate name rotation to federal, state, county, and local offices in political entities with more than 25,000 registered voters. It removes the separate voter threshold for other offices and provides a single standard administered by the secretary of state.”",
      speaker: "Rep. Anne Henderson Haws",
      party: "Democrat",
      role: "Statement of Purpose contact and House floor sponsor",
      url: "https://legislature.idaho.gov/wp-content/uploads/sessioninfo/2026/legislation/H0736SOP.pdf",
    },
    news: [
      {
        outlet: "Ballotpedia News",
        date: "April 29, 2026",
        title: "Not found",
        url: "https://news.ballotpedia.org/2026/04/29/idaho-amends-voter-id-affidavit-process-enacts-14-other-election-bills-in-2026/",
      },
    ],
    sources: [
      source("Official bill page (status, actions, roll calls)", H0736),
      source("Bill text PDF", "https://legislature.idaho.gov/wp-content/uploads/sessioninfo/2026/legislation/H0736.pdf"),
      source(
        "Statement of Purpose / Fiscal Note PDF",
        "https://legislature.idaho.gov/wp-content/uploads/sessioninfo/2026/legislation/H0736SOP.pdf",
      ),
      source("Current statute § 34-903", "https://legislature.idaho.gov/statutesrules/idstat/title34/t34ch9/sect34-903/"),
      source("LegiScan", "https://legiscan.com/ID/bill/H0736/2026"),
      source(
        "Ballotpedia News, Andrew Bahl, April 29, 2026",
        "https://news.ballotpedia.org/2026/04/29/idaho-amends-voter-id-affidavit-process-enacts-14-other-election-bills-in-2026/",
      ),
      source(
        "NCSL, 2026 Election Enactments, updated August 31, 2026",
        "https://www.ncsl.org/elections-and-campaigns/2026-election-enactments",
      ),
      source("Rep. Anne Henderson Haws, official member page", "https://legislature.idaho.gov/legislators/membership/2026/id10055/"),
      source("Sen. James D. Ruchti, official member page", "https://legislature.idaho.gov/legislators/membership/2026/id52/"),
      source("House membership roster (Rep. Ted Hill)", "https://legislature.idaho.gov/house/membership/"),
    ],
  },
  {
    state: "idaho",
    slug: "s1349",
    identifier: "S1349",
    shortSummary:
      "If the federal machine-gun ban were ever repealed or struck down, this bill would have made it legal under Idaho law for law-abiding adults to own, make, and sell machine guns. It also would have barred state and local agencies from helping enforce the old federal ban, and it kept every existing law against using guns in crimes. It never got a committee vote before the session ended.",
    statusLabel: "Died in committee",
    whatItChanges:
      "Would have added two new sections to Chapter 33, Title 18, Idaho Code, plus legislative findings, a severability clause, and an effective date. It would not have amended an existing section. The bill did not become law.\n\nThe findings state that federal law currently restricts manufacture, transfer, and possession of certain machine guns under 18 U.S.C. 922(o), and that if those restrictions are repealed, invalidated, or otherwise rendered unenforceable, Idaho should immediately recognize and protect the right of law-abiding citizens and Idaho-based industry to lawfully possess, manufacture, transfer, and sell machine guns in the state, subject only to otherwise applicable state law.\n\nNew § 18-3328, “Machine guns — contingent authorization,” would define “machine gun” as any firearm that shoots, is designed to shoot, or can be readily restored to shoot automatically more than one shot, without manual reloading, by a single function of the trigger. A “trigger event” would be the first of: congressional repeal of 18 U.S.C. 922(o) or any successor provision; a U.S. Supreme Court decision holding that provision unconstitutional in whole or in relevant part; a decision of a federal court of competent jurisdiction that is binding in Idaho, that permanently enjoins enforcement of that provision in Idaho, and that is not stayed; or formal written notice by the Idaho Attorney General that ATF, or a successor agency, has ceased enforcing that provision as to law-abiding civilians generally.\n\nUpon a trigger event, it would be lawful under Idaho law for any person not otherwise prohibited from possessing firearms under state or federal law to possess, purchase, receive, sell, transfer, or manufacture a machine gun in this state. The section would not authorize possession by a person prohibited from possessing firearms, would not affect generally applicable criminal laws (including use of firearms in a crime, reckless endangerment, or unlawful discharge), and would not require any person or entity to manufacture, sell, or transfer a machine gun.\n\nNew § 18-3329 would provide that, upon a trigger event, no Idaho agency, political subdivision, or employee acting in an official capacity could expend funds or use personnel or other resources to enforce, or assist in enforcing, 18 U.S.C. 922(o) to the extent it had been repealed, invalidated, or rendered unenforceable, or provide material support for investigating a person for conduct that is lawful under § 18-3328.\n\nSection 5 would have made the act effective on and after July 1, 2026.",
    timeline: [
      { date: "2026-03-02", action: "Introduced; read first time; referred to JR for Printing" },
      { date: "2026-03-03", action: "Reported printed; referred to State Affairs" },
      {
        date: "2026-04-02",
        action:
          "The 2026 legislative session ended. No further official actions appear on the bill page. The official page shows no committee report, floor vote, or enrollment.",
      },
    ],
    fiscalNote:
      "The official Statement of Purpose / Fiscal Note (introduced February 27, 2026, 12:18 p.m.) states: “No funds will be expensed or gained from this legislation, thus no impact to the general fund is expected.”",
    votes: [],
    sponsors: [
      {
        name: "Sen. Joshua Kohl",
        party: "Republican",
        role: "Statement of Purpose contact",
        url: "https://legislature.idaho.gov/legislators/membership/2026/id9401/",
      },
    ],
    conservativeView: [
      {
        quote:
          "“This legislation provides legal protection for fully automatic weapons within the state of Idaho in the event of the federal ban being overturned or repealed.”",
        speaker: "Sen. Joshua Kohl",
        party: "Republican",
        role: "Statement of Purpose contact",
        outlet: "Statement of Purpose",
        date: "February 27, 2026",
        url: "https://legislature.idaho.gov/wp-content/uploads/sessioninfo/2026/legislation/S1349SOP.pdf",
      },
    ],
    sponsorStatement: {
      quote:
        "“This legislation provides legal protection for fully automatic weapons within the state of Idaho in the event of the federal ban being overturned or repealed.”",
      speaker: "Sen. Joshua Kohl",
      party: "Republican",
      role: "Statement of Purpose contact",
      url: "https://legislature.idaho.gov/wp-content/uploads/sessioninfo/2026/legislation/S1349SOP.pdf",
    },
    news: [],
    sources: [
      source("Official bill page (status and actions)", S1349),
      source("Bill text PDF", "https://legislature.idaho.gov/wp-content/uploads/sessioninfo/2026/legislation/S1349.pdf"),
      source(
        "Statement of Purpose / Fiscal Note PDF",
        "https://legislature.idaho.gov/wp-content/uploads/sessioninfo/2026/legislation/S1349SOP.pdf",
      ),
      source("LegiScan", "https://legiscan.com/ID/bill/S1349/2026"),
      source("Office of the Governor, 2026 Legislative Session page", "https://gov.idaho.gov/legislative-sessions/2026-session/"),
      source("Legislature “Today in the House” page", "https://legislature.idaho.gov/sessioninfo/agenda/today-in-the-house/"),
      source(
        "Idaho Capital Sun, April 2, 2026",
        "https://idahocapitalsun.com/2026/04/02/after-divisive-session-marked-by-budget-cuts-idaho-legislature-adjourns-2026-session/",
      ),
      source("Sen. Joshua Kohl, official member page", "https://legislature.idaho.gov/legislators/membership/2026/id9401/"),
    ],
  },
];
