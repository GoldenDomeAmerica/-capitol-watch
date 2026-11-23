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

const H0551_PAGE = "https://legislature.idaho.gov/sessioninfo/2026/legislation/h0551/";
const H0551_PDF = "https://legislature.idaho.gov/wp-content/uploads/sessioninfo/2026/legislation/H0551.pdf";
const H0551_SOP = "https://legislature.idaho.gov/wp-content/uploads/sessioninfo/2026/legislation/H0551SOP.pdf";
const H0551_LEGIS = "https://legiscan.com/ID/bill/H0551/2026";
const H0573_PAGE = "https://legislature.idaho.gov/sessioninfo/2026/legislation/h0573/";
const H0573_PDF = "https://legislature.idaho.gov/wp-content/uploads/sessioninfo/2026/legislation/H0573.pdf";
const H0573_SOP = "https://legislature.idaho.gov/wp-content/uploads/sessioninfo/2026/legislation/H0573SOP.pdf";
const H0573_LEGIS = "https://legiscan.com/ID/bill/H0573/2026";
const H0592_PAGE = "https://legislature.idaho.gov/sessioninfo/2026/legislation/h0592/";
const H0592_PDF = "https://legislature.idaho.gov/wp-content/uploads/sessioninfo/2026/legislation/H0592.pdf";
const H0592_SOP = "https://legislature.idaho.gov/wp-content/uploads/sessioninfo/2026/legislation/H0592SOP.pdf";
const H0592_LEGIS = "https://legiscan.com/ID/bill/H0592/2026";
const H0594_PAGE = "https://legislature.idaho.gov/sessioninfo/2026/legislation/h0594/";
const H0594_PDF = "https://legislature.idaho.gov/wp-content/uploads/sessioninfo/2026/legislation/H0594.pdf";
const H0594_SOP = "https://legislature.idaho.gov/wp-content/uploads/sessioninfo/2026/legislation/H0594SOP.pdf";
const H0594_LEGIS = "https://legiscan.com/ID/bill/H0594/2026";
const H0599_PAGE = "https://legislature.idaho.gov/sessioninfo/2026/legislation/h0599/";
const H0599_PDF = "https://legislature.idaho.gov/wp-content/uploads/sessioninfo/2026/legislation/H0599.pdf";
const H0599_SOP = "https://legislature.idaho.gov/wp-content/uploads/sessioninfo/2026/legislation/H0599SOP.pdf";
const H0599_LEGIS = "https://legiscan.com/ID/bill/H0599/2026";
const H0612_PAGE = "https://legislature.idaho.gov/sessioninfo/2026/legislation/h0612/";
const H0612_PDF = "https://legislature.idaho.gov/wp-content/uploads/sessioninfo/2026/legislation/H0612.pdf";
const H0612_SOP = "https://legislature.idaho.gov/wp-content/uploads/sessioninfo/2026/legislation/H0612SOP.pdf";
const H0612_LEGIS = "https://legiscan.com/ID/bill/H0612/2026";
const H0624_PAGE = "https://legislature.idaho.gov/sessioninfo/2026/legislation/h0624/";
const H0624_PDF = "https://legislature.idaho.gov/wp-content/uploads/sessioninfo/2026/legislation/H0624.pdf";
const H0624_SOP = "https://legislature.idaho.gov/wp-content/uploads/sessioninfo/2026/legislation/H0624SOP.pdf";
const H0624_LEGIS = "https://legiscan.com/ID/bill/H0624/2026";
const H0628_PAGE = "https://legislature.idaho.gov/sessioninfo/2026/legislation/h0628/";
const H0628_PDF = "https://legislature.idaho.gov/wp-content/uploads/sessioninfo/2026/legislation/H0628.pdf";
const H0628_SOP = "https://legislature.idaho.gov/wp-content/uploads/sessioninfo/2026/legislation/H0628SOP.pdf";
const H0628_LEGIS = "https://legiscan.com/ID/bill/H0628/2026";
const H0636_PAGE = "https://legislature.idaho.gov/sessioninfo/2026/legislation/h0636/";
const H0636_PDF = "https://legislature.idaho.gov/wp-content/uploads/sessioninfo/2026/legislation/H0636.pdf";
const H0636_SOP = "https://legislature.idaho.gov/wp-content/uploads/sessioninfo/2026/legislation/H0636SOP.pdf";
const H0636_LEGIS = "https://legiscan.com/ID/bill/H0636/2026";
const H0656_PAGE = "https://legislature.idaho.gov/sessioninfo/2026/legislation/h0656/";
const H0656_PDF = "https://legislature.idaho.gov/wp-content/uploads/sessioninfo/2026/legislation/H0656.pdf";
const H0656_SOP = "https://legislature.idaho.gov/wp-content/uploads/sessioninfo/2026/legislation/H0656SOP.pdf";
const H0656_LEGIS = "https://legiscan.com/ID/bill/H0656/2026";
const HOUSE_ROSTER = "https://legislature.idaho.gov/house/membership/";
const SENATE_ROSTER = "https://legislature.idaho.gov/senate/membership/";
const MINI_DIRECTORY = "https://legislature.idaho.gov/wp-content/uploads/sessioninfo/2026/directory/Mini_Directory.pdf";
const GOV_2026 = "https://gov.idaho.gov/legislative-sessions/2026-session/";
const SESSION_2026 = "https://legislature.idaho.gov/sessioninfo/2026/";
const NICHOLS_PAGE = "https://legislature.idaho.gov/legislators/membership/2026/id5380/";
const KMVT_H0628 = "https://www.kmvt.com/2026/02/28/several-measures-signed-into-law-legislative-session-continues/";
const ACLU_H0592 = "https://www.acluidaho.org/legislation/2026-hb-592-patient-immigration-status-data-collection/";
const ACLU_H0656 = "https://www.acluidaho.org/legislation/2026-hb-656-student-immigration-status-data-collection/";

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
  {
    state: "idaho",
    slug: "h0551",
    identifier: "H0551",
    shortSummary: "Fire protection districts and ambulance service districts now count taxable new-construction value under revised rules, including districts that are not subject to urban-renewal revenue-allocation financing. The bill amends Idaho Code § 63-301A. It passed the House 68-0-2 and the Senate 31-0-4, and the Governor signed it on March 11, 2026, as Session Law Chapter 19, effective retroactively to January 1, 2026.",
    statusLabel: "Signed into law, retroactive to Jan 1, 2026 (Ch. 19)",
    whatItChanges: "Amends existing Idaho Code § 63-301A, “New construction roll.” It does not add a new section.\n\nSubsection (3)(k) addresses fire protection districts and ambulance service districts. For a fire protection or ambulance service district that encompasses all or part of an urban renewal revenue allocation area that the district withdrew from under § 50-2906(5), eighty percent of the increment value may be included on the new construction roll for the year of withdrawal. Each year thereafter, ninety percent of the taxable value of otherwise qualifying new construction shall be included on the new construction roll for such a district, and for fire protection and ambulance service districts that are not subject to the financing provisions of an urban renewal revenue allocation area under § 50-2906(4), even if that new construction would not otherwise qualify because it was located within a revenue allocation area.\n\nSection 2 declares an emergency and makes the act effective on and after passage and approval, and retroactively to January 1, 2026.",
    timeline: [
      { date: "2026-01-28", action: "Introduced, read first time, referred to JRA for Printing" },
      { date: "2026-01-29", action: "Reported printed and referred to Revenue & Taxation" },
      { date: "2026-02-05", action: "Reported out of committee with Do Pass recommendation; filed for second reading" },
      { date: "2026-02-06", action: "Read second time; filed for third reading" },
      { date: "2026-02-09", action: "U.C. to hold place on third reading calendar one legislative day" },
      { date: "2026-02-10", action: "Read third time in full; passed the House 68-0-2; title approved; to Senate" },
      { date: "2026-02-11", action: "Received in the Senate; introduced, read first time; referred to Local Government & Taxation" },
      { date: "2026-02-23", action: "Reported out of committee with Do Pass recommendation; filed for second reading" },
      { date: "2026-02-24", action: "Read second time; filed for third reading" },
      { date: "2026-03-06", action: "Read third time in full; passed the Senate 31-0-4; title approved; to House" },
      { date: "2026-03-09", action: "Returned from Senate passed; to JRA for enrolling; reported enrolled; signed by Speaker; transmitted to Senate" },
      { date: "2026-03-10", action: "Received in the Senate enrolled/signed by Speaker; signed by President; returned to House; ordered transmitted to Governor" },
      { date: "2026-03-11", action: "Delivered to the Governor at 3:53 p.m. on March 10, 2026 (time as printed; zone not stated on the bill page)" },
      { date: "2026-03-12", action: "Reported signed by the Governor on March 11, 2026; Session Law Chapter 19; effective retroactive to January 1, 2026" },
    ],
    fiscalNote: "The official Statement of Purpose / Fiscal Note (introduced January 28, 2026, 10:29 a.m.) states: “Because the proposed change affects only property tax calculation, it will have no effect on the general fund.”",
    votes: [
      { chamber: "house", date: "2026-02-10", yes: 68, no: 0, absent: 2, url: H0551_PAGE },
      { chamber: "senate", date: "2026-03-06", yes: 31, no: 0, absent: 4, url: H0551_PAGE },
    ],
    sponsors: [
      {
        name: "Rep. Richard W. Cheatum",
        party: "Republican",
        role: "Statement of Purpose contact and House floor sponsor",
        url: "https://legislature.idaho.gov/house/membership/",
      },
      {
        name: "Sen. Treg A. Bernt",
        party: "Republican",
        role: "Senate floor sponsor",
        url: "https://legislature.idaho.gov/senate/membership/",
      },
    ],
    conservativeView: [
      {
        quote: "“Provides clarification and correction for calculating taxable values of fire protection districts and ambulance services districts not subject to urban renewable district revenue allocation areas.”",
        speaker: "Rep. Richard W. Cheatum",
        party: "Republican",
        role: "Statement of Purpose contact and House floor sponsor",
        outlet: "Statement of Purpose",
        date: "January 28, 2026",
        url: H0551_SOP,
      },
    ],
    sponsorStatement: {
      quote: "“Provides clarification and correction for calculating taxable values of fire protection districts and ambulance services districts not subject to urban renewable district revenue allocation areas.”",
      speaker: "Rep. Richard W. Cheatum",
      party: "Republican",
      role: "Statement of Purpose contact and House floor sponsor",
      url: H0551_SOP,
    },
    news: [],
    sources: [
      source("Official bill page (status, actions, roll calls)", H0551_PAGE),
      source("Bill text PDF", H0551_PDF),
      source("Statement of Purpose / Fiscal Note PDF", H0551_SOP),
      source("LegiScan free page (direct fetch returned HTTP 403; not used for status or votes)", H0551_LEGIS),
      source("Official 2026 session hub", SESSION_2026),
      source("Rep. Richard W. Cheatum, House membership roster", HOUSE_ROSTER),
      source("Sen. Treg A. Bernt, Senate membership roster", SENATE_ROSTER),
      source("2026 Mini Directory", MINI_DIRECTORY),
    ],
  },
  {
    state: "idaho",
    slug: "h0573",
    identifier: "H0573",
    shortSummary: "Idaho expanded who may teach the firearms-law and use-of-deadly-force portion of an enhanced concealed-carry course. Nationally certified instructors who have taught an approved enhanced course for at least eight years can give that instruction, along with members of the Idaho State Bar and specified law-enforcement officers. The bill amends Idaho Code § 18-3302K. It passed the House 68-0-2 and the Senate 33-0-2, and the Governor signed it on March 26, 2026, as Session Law Chapter 159, effective July 1, 2026.",
    statusLabel: "Signed into law, effective July 1, 2026 (Ch. 159)",
    whatItChanges: "Amends existing Idaho Code § 18-3302K, “Issuance of enhanced licenses to carry concealed weapons,” and makes a technical correction. It does not add a new section.\n\nThe required qualifying handgun course must still include instruction in Idaho law relating to firearms and the use of deadly force. That legal instruction must be delivered by any of the following, whose name and credential must appear on the certificate: (A) an active, senior, or emeritus member of the Idaho State Bar; (B) a law enforcement officer, active or retired, who currently possesses or possessed at retirement an intermediate or higher Idaho POST certificate; or (C) an instructor certified by the National Rifle Association, or equivalent, who has instructed an approved course for enhanced concealed carry for at least eight years. In the printed bill, “either” is changed to “any of the following,” and item (C) is added.\n\nSection 2 declares an emergency and makes the act effective on and after July 1, 2026.\n\nThe “smaller group and one-on-one instruction” language appears in the Statement of Purpose. It does not appear as added text in the portions of the bill PDF that set out who may deliver the legal instruction; that change, in the bill text, is the addition of the experienced nationally certified instructor category described above.",
    timeline: [
      { date: "2026-02-02", action: "Introduced, read first time, referred to JRA for Printing" },
      { date: "2026-02-03", action: "Reported printed and referred to State Affairs" },
      { date: "2026-02-10", action: "Reported out of committee with Do Pass recommendation; filed for second reading" },
      { date: "2026-02-11", action: "Read second time; filed for third reading" },
      { date: "2026-02-12", action: "U.C. to hold place on third reading calendar one legislative day" },
      { date: "2026-02-13", action: "Read third time in full; passed the House 68-0-2; title approved; to Senate" },
      { date: "2026-02-16", action: "Received in the Senate; introduced, read first time; referred to State Affairs" },
      { date: "2026-03-16", action: "Reported out of committee with Do Pass recommendation; filed for second reading" },
      { date: "2026-03-17", action: "Read second time; filed for third reading" },
      { date: "2026-03-23", action: "Read third time in full; passed the Senate 33-0-2; title approved; to House" },
      { date: "2026-03-24", action: "Returned from Senate passed; to JRA for enrolling; reported enrolled; signed by Speaker; transmitted to Senate" },
      { date: "2026-03-25", action: "Received in the Senate enrolled/signed by Speaker; signed by President; returned to House; ordered transmitted to Governor" },
      { date: "2026-03-26", action: "Delivered to the Governor at 4:39 p.m. on March 25, 2026 (time as printed; zone not stated); reported signed by the Governor on March 26, 2026; Session Law Chapter 159; effective July 1, 2026" },
    ],
    fiscalNote: "The official Statement of Purpose / Fiscal Note (introduced February 2, 2026, 8:44 a.m.) states: “This legislation causes no increase or decrease in revenue, or additional expenditure of funds at the state or local level of government; therefore, this legislation has no fiscal impact.”",
    votes: [
      { chamber: "house", date: "2026-02-13", yes: 68, no: 0, absent: 2, url: H0573_PAGE },
      { chamber: "senate", date: "2026-03-23", yes: 33, no: 0, absent: 2, url: H0573_PAGE },
    ],
    sponsors: [
      {
        name: "Rep. Charlie Shepherd",
        party: "Republican",
        role: "Statement of Purpose contact and House floor sponsor",
        url: "https://legislature.idaho.gov/house/membership/",
      },
      {
        name: "Sen. Kelly Arthur Anthon",
        party: "Republican",
        role: "Senate floor sponsor",
        url: "https://legislature.idaho.gov/senate/membership/",
      },
    ],
    conservativeView: [
      {
        quote: "“The purpose of this legislation is to amend Section 18-3302K, Idaho Code, relating to Idaho enhanced concealed carry licenses. The bill allows enhanced concealed carry training to be delivered in more adaptable instructional formats, including smaller group and one-on-one instruction, enabling instructors to tailor training to individual student needs. This legislation recognizes experienced, nationally certified firearms instructors with extensive enhanced concealed carry teaching backgrounds as individuals authorized to provide instruction on Idaho firearms law. It provides greater flexibility in the delivery of required training while maintaining Idaho’s high standards for public safety and legal compliance.”",
        speaker: "Rep. Charlie Shepherd",
        party: "Republican",
        role: "Statement of Purpose contact and House floor sponsor",
        outlet: "Statement of Purpose",
        date: "February 2, 2026",
        url: H0573_SOP,
      },
    ],
    sponsorStatement: {
      quote: "“The purpose of this legislation is to amend Section 18-3302K, Idaho Code, relating to Idaho enhanced concealed carry licenses. The bill allows enhanced concealed carry training to be delivered in more adaptable instructional formats, including smaller group and one-on-one instruction, enabling instructors to tailor training to individual student needs. This legislation recognizes experienced, nationally certified firearms instructors with extensive enhanced concealed carry teaching backgrounds as individuals authorized to provide instruction on Idaho firearms law. It provides greater flexibility in the delivery of required training while maintaining Idaho’s high standards for public safety and legal compliance.”",
      speaker: "Rep. Charlie Shepherd",
      party: "Republican",
      role: "Statement of Purpose contact and House floor sponsor",
      url: H0573_SOP,
    },
    news: [],
    sources: [
      source("Official bill page (status, actions, roll calls)", H0573_PAGE),
      source("Bill text PDF", H0573_PDF),
      source("Statement of Purpose / Fiscal Note PDF", H0573_SOP),
      source("LegiScan free page (direct fetch returned HTTP 403; not used for status or votes)", H0573_LEGIS),
      source("Official 2026 session hub", SESSION_2026),
      source("Rep. Charlie Shepherd, House membership roster", HOUSE_ROSTER),
      source("Sen. Kelly Arthur Anthon, Senate membership roster", SENATE_ROSTER),
      source("2026 Mini Directory", MINI_DIRECTORY),
    ],
  },
  {
    state: "idaho",
    slug: "h0592",
    identifier: "H0592",
    shortSummary: "This would have required every Medicaid-accepting hospital to ask, on admission or registration forms, whether a patient is a U.S. citizen, lawfully present, or not lawfully present, and to say that the answer would not affect care or be reported to immigration authorities. Hospitals would have sent quarterly counts to the Department of Health and Welfare, which would have reported yearly totals to the Governor and legislative leaders. It was referred to House Health and Welfare on February 5, 2026, and had no further official action. The 2026 session ended April 2, 2026. There were no floor votes, and the bill was not enacted.",
    statusLabel: "Died in committee",
    whatItChanges: "Would have added a new section, Idaho Code § 39-1397, “Patient immigration status data collection,” to Chapter 13, Title 39. It would not have amended an existing section. The bill did not become law.\n\nEvery hospital that accepts Medicaid would have to include a provision on patient admission or registration forms for the patient or the patient’s representative to state or indicate the patient’s immigration status, including whether the patient is a United States citizen, is lawfully present in the United States, or is not lawfully present. The inquiry would have to be followed by a statement that the response will not affect patient care or result in a report of the patient’s immigration status to immigration authorities.\n\nEvery hospital would submit a quarterly report to the Department of Health and Welfare within 30 days after the end of each calendar quarter, including the number of admissions or emergency-department visits in the previous quarter in those three self-reported categories. By March 1 of each year, the department would submit a report to the Governor, the President Pro Tempore of the Senate, and the Speaker of the House, with yearly totals by those categories and information relating to the costs of uncompensated care for aliens not lawfully present, the impact of uncompensated care on hospitals’ cost or ability to provide services, hospital funding needs, and other related information.\n\nThe department could promulgate rules, subject to legislative approval, on report format and acceptable form language. The rules could not require disclosure of patient names or other personal identifying information to the department. “Immigration status” is defined by reference to the Immigration and Nationality Act and includes listed groups: citizens; permanent residents (including conditional permanent residents); nonimmigrants; refugees and asylees; and “undocumented migrants or illegal aliens who have overstayed their visa or entered the United States without authorization,” regardless of any temporary status granted by the Department of Homeland Security.\n\nSection 2 declared an emergency and would have made the act effective on and after July 1, 2026.",
    timeline: [
      { date: "2026-02-04", action: "Introduced, read first time, referred to JRA for Printing" },
      { date: "2026-02-05", action: "Reported printed and referred to Health & Welfare" },
      { date: "2026-04-02", action: "No further official actions appear on the bill page as of November 22, 2026. The 2026 legislative session ended April 2, 2026. The official page shows no committee report, floor vote, or enrollment." },
    ],
    fiscalNote: "The official Statement of Purpose / Fiscal Note (introduced February 4, 2026, 10:24 a.m.) states: “There is no anticipated fiscal impact to the State or general fund because it requires no expenditure of State funds.”",
    votes: [
    ],
    sponsors: [
      {
        name: "Rep. Jordan Redman",
        party: "Republican",
        role: "Statement of Purpose contact",
        url: "https://legislature.idaho.gov/house/membership/",
      },
    ],
    conservativeView: [
      {
        quote: "“This bill establishes a new provision requiring all Medicaid-accepting hospitals to collect information on patients’ immigration status at admission. The patient immigration status data will be submitted to the Department of Health & Welfare on a quarterly basis for review.”",
        speaker: "Rep. Jordan Redman",
        party: "Republican",
        role: "Statement of Purpose contact",
        outlet: "Statement of Purpose",
        date: "February 4, 2026",
        url: H0592_SOP,
      },
    ],
    liberalView: [
      {
        quote: "“This bill would discourage individuals from pursuing necessary care.”",
        speaker: "ACLU of Idaho",
        party: "not applicable",
        role: "advocacy organization",
        outlet: "ACLU of Idaho",
        date: "Apr 6, 2026",
        url: ACLU_H0592,
        label: "OPPOSING VIEW · Opinion",
      },
      {
        quote: "“Everyone deserves to access medical care, regardless of their immigration status.”",
        speaker: "ACLU of Idaho",
        party: "not applicable",
        role: "advocacy organization",
        outlet: "ACLU of Idaho",
        date: "Apr 6, 2026",
        url: ACLU_H0592,
        label: "OPPOSING VIEW · Opinion",
      },
    ],
    sponsorStatement: {
      quote: "“This bill establishes a new provision requiring all Medicaid-accepting hospitals to collect information on patients’ immigration status at admission. The patient immigration status data will be submitted to the Department of Health & Welfare on a quarterly basis for review.”",
      speaker: "Rep. Jordan Redman",
      party: "Republican",
      role: "Statement of Purpose contact",
      url: H0592_SOP,
    },
    news: [],
    sources: [
      source("Official bill page (status and actions)", H0592_PAGE),
      source("Bill text PDF", H0592_PDF),
      source("Statement of Purpose / Fiscal Note PDF", H0592_SOP),
      source("LegiScan free page (direct fetch returned HTTP 403; not used for status or votes)", H0592_LEGIS),
      source("Office of the Governor, 2026 Legislative Session page (session ended April 2, 2026)", GOV_2026),
      source("Official 2026 session hub", SESSION_2026),
      source("ACLU of Idaho written position page (Position: Oppose; page lists Latest Update: Apr 6, 2026)", ACLU_H0592),
      source("Rep. Jordan Redman, House membership roster", HOUSE_ROSTER),
      source("2026 Mini Directory", MINI_DIRECTORY),
    ],
  },
  {
    state: "idaho",
    slug: "h0594",
    identifier: "H0594",
    shortSummary: "Late charges and interest collected with delinquent property taxes are now apportioned to taxing districts in the same proportion as each district receives in property taxes. The bill amends Idaho Code §§ 63-903, 63-1201, and 63-1202. It passed the House 69-0-1 and the Senate 31-0-4, and the Governor signed it on March 12, 2026, as Session Law Chapter 20, effective July 1, 2026.",
    statusLabel: "Signed into law, effective July 1, 2026 (Ch. 20)",
    whatItChanges: "Amends three existing sections. It does not add a new section.\n\nIdaho Code § 63-903. Adds that all property taxes and fees, together with any costs, late charges, and interest collected by the county tax collector, shall be remitted to the county auditor as provided in § 63-1201, and that the county auditor shall apportion the late charges and interest among the taxing districts in the same proportion as each taxing district receives in property taxes from the total amount collected in property taxes for the entire county.\n\nIdaho Code § 63-1201. Revises the tax collector’s monthly settlement with the county auditor so that it covers all moneys collected, including property taxes levied on property, together with any late charges and interest collected.\n\nIdaho Code § 63-1202. Revises the county auditor’s settlement so that the transmittal to each taxing district includes all moneys belonging to the district, including all property taxes together with late charges and interest, paid into the county treasury since the last transmittal.\n\nSection 4 declares an emergency and makes the act effective on and after July 1, 2026.\n\nThe Statement of Purpose refers to “the 2025 Supreme Court decision” but does not name the case. A case name and citation were not verified from the official bill materials.",
    timeline: [
      { date: "2026-02-05", action: "Introduced, read first time, referred to JRA for Printing" },
      { date: "2026-02-06", action: "Reported printed and referred to Revenue & Taxation" },
      { date: "2026-02-13", action: "Reported out of committee with Do Pass recommendation; filed for second reading" },
      { date: "2026-02-16", action: "Read second time; filed for third reading" },
      { date: "2026-02-17", action: "Read third time in full; passed the House 69-0-1; title approved; to Senate" },
      { date: "2026-02-18", action: "Received in the Senate; introduced, read first time; referred to Local Government & Taxation" },
      { date: "2026-02-23", action: "Reported out of committee with Do Pass recommendation; filed for second reading" },
      { date: "2026-02-24", action: "Read second time; filed for third reading" },
      { date: "2026-03-06", action: "Read third time in full; passed the Senate 31-0-4; title approved; to House" },
      { date: "2026-03-09", action: "Returned from Senate passed; to JRA for enrolling; reported enrolled; signed by Speaker; transmitted to Senate" },
      { date: "2026-03-10", action: "Received in the Senate enrolled/signed by Speaker; signed by President; returned to House; ordered transmitted to Governor" },
      { date: "2026-03-11", action: "Delivered to the Governor at 3:53 p.m. on March 10, 2026 (time as printed; zone not stated)" },
      { date: "2026-03-13", action: "Reported signed by the Governor on March 12, 2026; Session Law Chapter 20; effective July 1, 2026" },
    ],
    fiscalNote: "The official Statement of Purpose / Fiscal Note (introduced February 5, 2026, 9:41 a.m.) states: “There will be no fiscal impact to state revenues and expenses, and local revenue collections will continue to be appropriated proportionally to each taxing district, including any penalties and interest for delinquent taxes.”",
    votes: [
      { chamber: "house", date: "2026-02-17", yes: 69, no: 0, absent: 1, url: H0594_PAGE },
      { chamber: "senate", date: "2026-03-06", yes: 31, no: 0, absent: 4, url: H0594_PAGE },
    ],
    sponsors: [
      {
        name: "Rep. Richard W. Cheatum",
        party: "Republican",
        role: "Statement of Purpose contact and House floor sponsor",
        url: "https://legislature.idaho.gov/house/membership/",
      },
      {
        name: "Sen. Treg A. Bernt",
        party: "Republican",
        role: "Senate floor sponsor",
        url: "https://legislature.idaho.gov/senate/membership/",
      },
    ],
    conservativeView: [
      {
        quote: "“This legislation codifies the 2025 Supreme Court decision that proportional appropriation for fees and interest collections on delinquent property tax collections must go to each taxing district.”",
        speaker: "Rep. Richard W. Cheatum",
        party: "Republican",
        role: "Statement of Purpose contact and House floor sponsor",
        outlet: "Statement of Purpose",
        date: "February 5, 2026",
        url: H0594_SOP,
      },
    ],
    sponsorStatement: {
      quote: "“This legislation codifies the 2025 Supreme Court decision that proportional appropriation for fees and interest collections on delinquent property tax collections must go to each taxing district.”",
      speaker: "Rep. Richard W. Cheatum",
      party: "Republican",
      role: "Statement of Purpose contact and House floor sponsor",
      url: H0594_SOP,
    },
    news: [],
    sources: [
      source("Official bill page (status, actions, roll calls)", H0594_PAGE),
      source("Bill text PDF", H0594_PDF),
      source("Statement of Purpose / Fiscal Note PDF", H0594_SOP),
      source("LegiScan free page (direct fetch returned HTTP 403; not used for status or votes)", H0594_LEGIS),
      source("Official 2026 session hub", SESSION_2026),
      source("Rep. Richard W. Cheatum, House membership roster", HOUSE_ROSTER),
      source("Sen. Treg A. Bernt, Senate membership roster", SENATE_ROSTER),
      source("2026 Mini Directory", MINI_DIRECTORY),
    ],
  },
  {
    state: "idaho",
    slug: "h0599",
    identifier: "H0599",
    shortSummary: "Money from the Public School Digital Content and Curriculum Fund is now distributed to local education agencies under competitive, needs-based criteria set by the State Department of Education, instead of on a first-come, first-served basis. The $50,000 cap on a single request and the other qualification rules remain. It passed the House 68-0-2 and the Senate 35-0-0, and the Governor signed it on March 19, 2026, as Session Law Chapter 60, effective July 1, 2026.",
    statusLabel: "Signed into law, effective July 1, 2026 (Ch. 60)",
    whatItChanges: "Amends existing Idaho Code § 33-4804, “Public school digital content and curriculum fund,” and makes technical corrections. It does not add a new section.\n\nSubject to availability, moneys in the fund shall still be distributed at the request of a local education agency (LEA) and shall be based on the amount requested. A single request shall not exceed $50,000. The printed bill strikes the rule that distributions be made “on a first-come, first-served basis” and the rule that a request that cannot be funded for lack of moneys be prioritized “in the order received.” In their place, distributions shall be made to LEAs that meet the subsection’s requirements “based on competitive, needs-based criteria established by the state department of education.” If distributions cannot be made for lack of moneys, requests by eligible LEAs shall be prioritized according to those competitive, needs-based criteria once moneys become available. Two or more LEAs may still jointly request a distribution. Qualification still requires technology infrastructure and an explanation of how the distribution will improve performance and enhance student achievement, including the items already listed in the statute. Additional distributions after an initial award still require that the LEA has met or is making demonstrable progress toward its measurable targets. “Must” is changed to “shall” in two places as a technical correction.\n\nSection 2 declares an emergency and makes the act effective on and after July 1, 2026.",
    timeline: [
      { date: "2026-02-05", action: "Introduced, read first time, referred to JRA for Printing" },
      { date: "2026-02-06", action: "Reported printed and referred to Education" },
      { date: "2026-02-19", action: "Reported out of committee with Do Pass recommendation; filed for second reading" },
      { date: "2026-02-20", action: "Read second time; filed for third reading" },
      { date: "2026-02-23", action: "U.C. to hold place on third reading calendar one legislative day" },
      { date: "2026-02-24", action: "Read third time in full; passed the House 68-0-2; title approved; to Senate" },
      { date: "2026-02-25", action: "Received in the Senate; introduced, read first time; referred to Education" },
      { date: "2026-03-05", action: "Reported out of committee with Do Pass recommendation; filed for second reading" },
      { date: "2026-03-06", action: "Read second time; filed for third reading" },
      { date: "2026-03-16", action: "Read third time in full; passed the Senate 35-0-0; title approved; to House" },
      { date: "2026-03-17", action: "Returned from Senate passed; to JRA for enrolling; reported enrolled; signed by Speaker; transmitted to Senate" },
      { date: "2026-03-18", action: "Received in the Senate enrolled/signed by Speaker; signed by President; returned to House; ordered transmitted to Governor" },
      { date: "2026-03-19", action: "Delivered to the Governor at 4:22 p.m. on March 18, 2026 (time as printed; zone not stated)" },
      { date: "2026-03-20", action: "Reported signed by the Governor on March 19, 2026; Session Law Chapter 60; effective July 1, 2026" },
    ],
    fiscalNote: "The official Statement of Purpose / Fiscal Note (revised February 27, 2026, 1:04 p.m.) states: “This legislation is revenue neutral, therefore has no impact on state general funds.”",
    votes: [
      { chamber: "house", date: "2026-02-24", yes: 68, no: 0, absent: 2, url: H0599_PAGE },
      { chamber: "senate", date: "2026-03-16", yes: 35, no: 0, absent: 0, url: H0599_PAGE },
    ],
    sponsors: [
      {
        name: "Rep. Jerald Raymond",
        party: "Republican",
        role: "Statement of Purpose contact and House floor sponsor",
        url: "https://legislature.idaho.gov/house/membership/",
      },
      {
        name: "Sen. Tammy Nichols",
        party: "Republican",
        role: "Statement of Purpose contact",
        url: "https://legislature.idaho.gov/legislators/membership/2026/id5380/",
      },
      {
        name: "Sen. James Woodward",
        party: "Republican",
        role: "Senate floor sponsor",
        url: "https://legislature.idaho.gov/senate/membership/",
      },
    ],
    conservativeView: [
      {
        quote: "“Historically, digital curriculum funding to local public-school districts has been on a “first come, first serve” basis. This legislation provides funding for LEA’s based on need.”",
        speaker: "Rep. Jerald Raymond",
        party: "Republican",
        role: "Statement of Purpose contact and House floor sponsor",
        outlet: "Statement of Purpose",
        date: "February 27, 2026",
        url: H0599_SOP,
      },
    ],
    sponsorStatement: {
      quote: "“Historically, digital curriculum funding to local public-school districts has been on a “first come, first serve” basis. This legislation provides funding for LEA’s based on need.”",
      speaker: "Rep. Jerald Raymond",
      party: "Republican",
      role: "Statement of Purpose contact and House floor sponsor",
      url: H0599_SOP,
    },
    news: [],
    sources: [
      source("Official bill page (status, actions, roll calls)", H0599_PAGE),
      source("Bill text PDF", H0599_PDF),
      source("Statement of Purpose / Fiscal Note PDF", H0599_SOP),
      source("LegiScan free page (direct fetch returned HTTP 403; not used for status or votes)", H0599_LEGIS),
      source("Official 2026 session hub", SESSION_2026),
      source("Rep. Jerald Raymond, House membership roster", HOUSE_ROSTER),
      source("Sen. Tammy Nichols, official member page", NICHOLS_PAGE),
      source("Sen. James Woodward, Senate membership roster", SENATE_ROSTER),
      source("2026 Mini Directory", MINI_DIRECTORY),
    ],
  },
  {
    state: "idaho",
    slug: "h0612",
    identifier: "H0612",
    shortSummary: "This would have defined portable solar generation devices, exempted them from interconnection and net-metering rules, and barred electric companies from requiring approval, fees, or extra equipment for those devices. Utilities would not have been liable for damage or injury the devices cause. The devices would have been left out of the definition of a public utility and out of the Residential Solar Energy System Disclosure Act, and that Act's capacity threshold would have risen from one kilowatt to 1,200 watts. It was referred to House State Affairs on February 11, 2026, and had no further official action. The 2026 session ended April 2, 2026. There were no floor votes, and the bill was not enacted.",
    statusLabel: "Died in committee",
    whatItChanges: "Would have added a new section, Idaho Code § 61-122, and amended §§ 61-129, 48-1802, and 48-1803. The bill did not become law.\n\nNew § 61-122 would have defined a “portable solar generation device” as a moveable photovoltaic generation device that is designed to be connected to a building’s electrical system through a standard electrical outlet; is intended to offset part or all of a customer’s electricity consumption; is limited to supplying a maximum power output of not more than 1,200 watts to the utility electric grid; is certified by Underwriters Laboratories or an equivalent nationally recognized testing laboratory; and meets the standards of the most recent National Electrical Code. Notwithstanding any other provision of law, such a device would have been exempt from interconnection and net metering requirements. An electric corporation would not have been allowed to require a customer using such a device to obtain the corporation’s approval before installing or using it, to pay any fee or charge related to the device or for feeding energy back into the grid, or to install any additional controls or equipment beyond what is integrated into the device. The electric corporation would not have been liable for any damage or injury caused by a portable solar generation device.\n\n§ 61-129 would have been amended to state that the term “public utility” shall not include portable solar generation devices, with a related renumbering of existing subsections.\n\n§ 48-1802 would have changed the definition of “residential solar energy system” so that the electricity delivery capacity must exceed 1,200 watts, replacing “one (1) kilowatt.”\n\n§ 48-1803 would have added that the Residential Solar Energy System Disclosure Act does not apply to portable solar generation devices as defined in § 61-122.\n\nSection 5 declared an emergency and would have made the act effective on and after July 1, 2026.\n\nThe comparison to Utah H.B. 340 and the “22 states” figure appear only in the Statement of Purpose and were not independently verified for this file.",
    timeline: [
      { date: "2026-02-10", action: "Introduced, read first time, referred to JRA for Printing" },
      { date: "2026-02-11", action: "Reported printed and referred to State Affairs" },
      { date: "2026-04-02", action: "No further official actions appear on the bill page as of November 22, 2026. The 2026 legislative session ended April 2, 2026. The official page shows no committee report, floor vote, or enrollment." },
    ],
    fiscalNote: "The official Statement of Purpose / Fiscal Note (introduced February 9, 2026, 4:05 p.m.) states: “There is no fiscal impact to the General Fund. The entire cost is the responsibility of the owner of the product.”",
    votes: [
    ],
    sponsors: [
      {
        name: "Rep. John Gannon",
        party: "Democrat",
        role: "Statement of Purpose contact",
        url: "https://legislature.idaho.gov/house/membership/",
      },
      {
        name: "Rep. Stephanie Jo Mickelsen",
        party: "Republican",
        role: "Statement of Purpose contact",
        url: "https://legislature.idaho.gov/house/membership/",
      },
    ],
    bipartisan: true,
    viewpointNote:
      "Statement of Purpose contacts are from both parties: Rep. John Gannon (D) and Rep. Stephanie Jo Mickelsen (R). The bill had no floor votes. A verbatim quote from either side, other than the Statement of Purpose, was not found.",
    sponsorStatement: {
      quote: "“Plug In Solar has been used in Europe for several years, and is beginning to be used in the United States. This product consists of several mobile solar panels with devices that allow them to be used with residential or small business electrical systems. The units appear to range in price from less than $1000 up to $6000. This legislation makes changes to Idaho utility law to require basic safety features including a UL certification, an exemption so that the products can be used without an agreement or permission of the service provider (utility), and liability protection for the service provider (utility). The legislation is the same as Utah House H 340 that was passed unanimously in 2025 by the Utah Legislature. Utah was the first to act and legislation is now pending in 22 states.”",
      speaker: "Rep. John Gannon and Rep. Stephanie Jo Mickelsen",
      party: "Democrat and Republican",
      role: "Statement of Purpose contacts",
      url: H0612_SOP,
    },
    news: [],
    sources: [
      source("Official bill page (status and actions)", H0612_PAGE),
      source("Bill text PDF", H0612_PDF),
      source("Statement of Purpose / Fiscal Note PDF", H0612_SOP),
      source("LegiScan free page (direct fetch returned HTTP 403; not used for status or votes)", H0612_LEGIS),
      source("Office of the Governor, 2026 Legislative Session page (session ended April 2, 2026)", GOV_2026),
      source("Official 2026 session hub", SESSION_2026),
      source("Rep. John Gannon, House membership roster", HOUSE_ROSTER),
      source("Rep. Stephanie Jo Mickelsen, House membership roster", HOUSE_ROSTER),
      source("2026 Mini Directory", MINI_DIRECTORY),
    ],
  },
  {
    state: "idaho",
    slug: "h0624",
    identifier: "H0624",
    shortSummary: "School districts that run virtual education programs must now disclose provider contracts and costs, set conflict-of-interest rules, keep Idaho residency and curriculum records, and use certificated teachers. State funds may not be paid directly to parents, and supplemental learning funds are limited to eligible expenses the district orders. The bill also revises definitions and operating requirements for public charter schools. It passed the House 68-0-2 and the Senate 32-0-3, and the Governor signed it on March 10, 2026, as Session Law Chapter 12, effective July 1, 2026.",
    statusLabel: "Signed into law, effective July 1, 2026 (Ch. 12)",
    whatItChanges: "Amends three existing sections.\n\nIdaho Code § 33-1619, “Virtual education programs.” Keeps the existing authority for school districts to offer internet-based and blended instruction and to count average daily attendance as already described. Adds that school districts offering virtual education programs shall make available to the State Board of Education the information required under § 33-5205(3); require that all contracts and subsequent amendments between a school district and an educational services provider relating to virtual learning be approved by the school district board of trustees before execution; maintain records verifying Idaho residency for all students enrolled in a virtual education program; and ensure that all curricular materials, including alternative or supplemental curriculum, meet State Board content standards and establish a system to document such curriculum. Any educational services provider contracting with and receiving public funds from a school district for a virtual education program must provide a written disclosure of services and costs identifying the specific services, the cost of each service or category of service and the method used to calculate it, and a clear relationship between the public funds received and the services provided. The virtual program and the provider must establish conflict-of-interest policies for people employed by both the district and the provider, including mechanisms for accountability and oversight. No school district, virtual education program, or contracted provider may furnish any payment of state funds directly to parents or legal guardians of enrolled students. Any state funds the district determines to use as “supplemental learning funds” may be used only for eligible education expenses under § 33-5206(8)(m), for all courses including electives, and must be expended through direct order by the school district only, except as otherwise provided in that subsection. Every person employed as a teacher in such a virtual education program must hold a certificate as required under § 33-1201, and the school district retains authority to hire, oversee, and evaluate all teachers delivering instruction in the program.\n\nIdaho Code §§ 33-5202A and 33-5206, in the public charter school chapter, are also amended to revise definitions and requirements for operating a public charter school, as set out in the bill text.\n\nSection 4 declares an emergency and makes the act effective on and after July 1, 2026.",
    timeline: [
      { date: "2026-02-10", action: "Introduced, read first time, referred to JRA for Printing" },
      { date: "2026-02-11", action: "Reported printed; filed for second reading" },
      { date: "2026-02-12", action: "Read second time; filed for third reading" },
      { date: "2026-02-13", action: "Read third time in full; passed the House 68-0-2; title approved; to Senate" },
      { date: "2026-02-16", action: "Received in the Senate; introduced, read first time; referred to Education" },
      { date: "2026-02-19", action: "Reported out of committee with Do Pass recommendation; filed for second reading" },
      { date: "2026-02-20", action: "Read second time; filed for third reading" },
      { date: "2026-03-05", action: "Read third time in full; passed the Senate 32-0-3; title approved; to House; returned from Senate passed; to JRA for enrolling; reported enrolled; signed by Speaker; transmitted to Senate" },
      { date: "2026-03-06", action: "Received in the Senate enrolled/signed by Speaker; signed by President; returned to House" },
      { date: "2026-03-09", action: "Returned signed by the President; ordered transmitted to Governor; delivered to the Governor at 2:13 p.m. on March 9, 2026 (time as printed; zone not stated)" },
      { date: "2026-03-11", action: "Reported signed by the Governor on March 10, 2026; Session Law Chapter 12; effective July 1, 2026" },
    ],
    fiscalNote: "The official Statement of Purpose / Fiscal Note (revised February 23, 2026, 9:03 a.m.) states: “This legislation does not require any additional expenditure of funds at the state or local level of government and therefore has no fiscal impact.”",
    votes: [
      { chamber: "house", date: "2026-02-13", yes: 68, no: 0, absent: 2, url: H0624_PAGE },
      { chamber: "senate", date: "2026-03-05", yes: 32, no: 0, absent: 3, url: H0624_PAGE },
    ],
    sponsors: [
      {
        name: "Rep. Douglas T. Pickett",
        party: "Republican",
        role: "Statement of Purpose contact and House floor sponsor",
        url: "https://legislature.idaho.gov/house/membership/",
      },
      {
        name: "Rep. Clay Handy",
        party: "Republican",
        role: "Statement of Purpose contact",
        url: "https://legislature.idaho.gov/house/membership/",
      },
      {
        name: "Rep. Soñia R. Galaviz",
        party: "Democrat",
        role: "Statement of Purpose contact",
        url: "https://legislature.idaho.gov/house/membership/",
      },
      {
        name: "Sen. Dave Lent",
        party: "Republican",
        role: "Statement of Purpose contact and Senate floor sponsor",
        url: "https://legislature.idaho.gov/senate/membership/",
      },
    ],
    conservativeView: [
      {
        quote: "“This legislation updates and aligns provisions governing virtual education programs operated by school districts and public charter schools.”",
        speaker: "Rep. Douglas T. Pickett",
        party: "Republican",
        role: "Statement of Purpose contact and House floor sponsor",
        outlet: "Statement of Purpose",
        date: "February 23, 2026",
        url: H0624_SOP,
      },
    ],
    sponsorStatement: {
      quote: "“This legislation updates and aligns provisions governing virtual education programs operated by school districts and public charter schools.”",
      speaker: "Rep. Douglas T. Pickett",
      party: "Republican",
      role: "Statement of Purpose contact and House floor sponsor",
      url: H0624_SOP,
    },
    news: [],
    sources: [
      source("Official bill page (status, actions, roll calls)", H0624_PAGE),
      source("Bill text PDF", H0624_PDF),
      source("Statement of Purpose / Fiscal Note PDF", H0624_SOP),
      source("LegiScan free page (direct fetch returned HTTP 403; not used for status or votes)", H0624_LEGIS),
      source("Official 2026 session hub", SESSION_2026),
      source("Rep. Douglas T. Pickett, House membership roster", HOUSE_ROSTER),
      source("Rep. Clay Handy, House membership roster", HOUSE_ROSTER),
      source("Rep. Soñia R. Galaviz, House membership roster", HOUSE_ROSTER),
      source("Sen. Dave Lent, Senate membership roster", SENATE_ROSTER),
      source("2026 Mini Directory", MINI_DIRECTORY),
    ],
  },
  {
    state: "idaho",
    slug: "h0628",
    identifier: "H0628",
    shortSummary: "Parents can now teach the in-car part of driver's training anywhere in Idaho. The bill removes the limit that allowed a parent or legal guardian to provide in-car observation and behind-the-wheel instruction only in a rural school district, or in a district that does not offer a driver's training course. Students still complete 30 hours of classroom instruction through an approved online course, and a parent still has to meet license and driving-record qualifications and keep a driving log. It passed the House 63-6-1 and the Senate 29-6-0, and the Governor signed it on March 17, 2026, as Session Law Chapter 30, effective March 17, 2026.",
    statusLabel: "Signed into law, effective March 17, 2026 (Ch. 30)",
    whatItChanges: "Amends existing Idaho Code § 49-307. It does not add a new section.\n\nSubsection (6)(a) still allows eligible students to satisfy the driver’s-training-course requirements of § 33-1702 through parent-student on-road driver’s training. The printed bill strikes the limitation that a student may receive the in-car observation and behind-the-wheel components from a qualifying parent or legal guardian instead of a licensed instructor “only if the parent or legal guardian and the student live in a rural school district as described in section 33-319, Idaho Code, or in a school district that does not offer a driver’s training course.”\n\nOther requirements in subsection (6) remain, including that the student enroll in and successfully complete 30 hours of classroom instruction through the Idaho Digital Learning Alliance online driver education course or another online course approved by the State Department of Education; that a qualifying parent may teach the six hours of in-car observation and six hours of behind-the-wheel instruction, concurrently with the classroom component, meeting state curriculum standards; and that a parent qualifies if the parent possesses a valid Idaho driver’s license that permits unaccompanied driving and has not had a license suspended, revoked, or canceled and has not been disqualified from holding an Idaho driver’s license for the previous two years. A driving log is still required.\n\nSection 2 of the act, as printed at the end of the bill PDF, declares an emergency. The official bill page states the enacted effective date is March 17, 2026.",
    timeline: [
      { date: "2026-02-11", action: "Introduced, read first time, referred to JRA for Printing" },
      { date: "2026-02-12", action: "Reported printed and referred to Transportation & Defense" },
      { date: "2026-02-19", action: "Reported out of committee with Do Pass recommendation; filed for second reading" },
      { date: "2026-02-20", action: "Read second time; filed for third reading" },
      { date: "2026-02-23", action: "Read third time in full; passed the House 63-6-1; title approved; to Senate" },
      { date: "2026-02-24", action: "Received in the Senate; introduced, read first time; referred to Transportation" },
      { date: "2026-02-27", action: "Reported out of committee with Do Pass recommendation; filed for second reading" },
      { date: "2026-03-02", action: "Read second time; filed for third reading" },
      { date: "2026-03-10", action: "Read third time in full; passed the Senate 29-6-0; title approved; to House" },
      { date: "2026-03-11", action: "Returned from Senate passed; to JRA for enrolling" },
      { date: "2026-03-12", action: "Reported enrolled; signed by Speaker; transmitted to Senate; received in the Senate enrolled/signed by Speaker; signed by President; returned to House" },
      { date: "2026-03-13", action: "Returned signed by the President; ordered transmitted to Governor" },
      { date: "2026-03-16", action: "Delivered to the Governor at 2:30 p.m. on March 13, 2026 (time as printed; zone not stated)" },
      { date: "2026-03-18", action: "Reported signed by the Governor on March 17, 2026; Session Law Chapter 30; effective March 17, 2026" },
    ],
    fiscalNote: "The official Statement of Purpose / Fiscal Note (introduced February 11, 2026, 8:46 a.m.) states: “This legislation causes no increase or decrease in revenue, or additional expenditure of funds at the state or local level of government; therefore, this legislation has no fiscal impact.”",
    votes: [
      { chamber: "house", date: "2026-02-23", yes: 63, no: 6, absent: 1, url: H0628_PAGE },
      { chamber: "senate", date: "2026-03-10", yes: 29, no: 6, absent: 0, url: H0628_PAGE },
    ],
    sponsors: [
      {
        name: "Rep. Ron Mendive",
        party: "Republican",
        role: "Statement of Purpose contact and House floor sponsor",
        url: "https://legislature.idaho.gov/house/membership/",
      },
      {
        name: "Sen. Carl J. Bjerke",
        party: "Republican",
        role: "Statement of Purpose contact and Senate floor sponsor; the roll call prints Bjerke(Bjerke)",
        url: "https://legislature.idaho.gov/senate/membership/",
      },
    ],
    conservativeView: [
      {
        quote: "“Current law requires six hours with a professional instructor. The other 50 are performed by the parents on these roads with their children that they know better than anybody else in society because they are their kids,” Harris said. “This is a simple bill that should be green lights across the board.”",
        speaker: "Rep. Kyle Harris",
        party: "Republican",
        role: "who voted yes",
        outlet: "KMVT",
        date: "February 27, 2026",
        url: KMVT_H0628,
      },
    ],
    liberalView: [
      {
        quote: "“You don’t want to have your life as the car or your safety or your life as the person in the car next to a teenager to count on them to make split second decisions to step on the brake and how to handle that,” Berch said. “This is a safety issue.”",
        speaker: "Rep. Steve Berch",
        party: "Democrat",
        role: "Assistant Minority Leader, who voted no",
        outlet: "KMVT",
        date: "February 27, 2026",
        url: KMVT_H0628,
      },
    ],
    sponsorStatement: {
      quote: "“Currently parents in Idaho can only teach their children to drive and obtain a driver’s license in rural school districts or in urban districts that do not offer a driver’s training course. This legislation simply allows parents statewide to teach their children to drive.”",
      speaker: "Rep. Ron Mendive",
      party: "Republican",
      role: "Statement of Purpose contact and House floor sponsor",
      url: H0628_SOP,
    },
    news: [
      {
        outlet: "KMVT",
        date: "February 27, 2026",
        title: "Not found",
        url: KMVT_H0628,
      },
    ],
    sources: [
      source("Official bill page (status, actions, roll calls)", H0628_PAGE),
      source("Bill text PDF", H0628_PDF),
      source("Statement of Purpose / Fiscal Note PDF", H0628_SOP),
      source("LegiScan free page (direct fetch returned HTTP 403; not used for status or votes)", H0628_LEGIS),
      source("Official 2026 session hub", SESSION_2026),
      source("KMVT, Heatherann Wagner, February 27, 2026, 8:15 p.m. MST (10:15 p.m. ET)", KMVT_H0628),
      source("Rep. Kyle Harris, House membership roster", HOUSE_ROSTER),
      source("Rep. Steve Berch, House membership roster", HOUSE_ROSTER),
      source("Rep. Ron Mendive, House membership roster", HOUSE_ROSTER),
      source("Sen. Carl J. Bjerke, Senate membership roster (roll call prints Bjerke(Bjerke))", SENATE_ROSTER),
      source("2026 Mini Directory", MINI_DIRECTORY),
    ],
  },
  {
    state: "idaho",
    slug: "h0636",
    identifier: "H0636",
    shortSummary: "After required payments for existing school bonds and certain levies, money left in the School District Facilities Fund may be used for new construction, renovation, or maintenance; to secure and pay school-facilities bonds; for lease-purchase agreements; or saved in a reserve account. Amounts used for the levy-related purposes named in the bill must still be deducted from a school levy that property taxpayers would otherwise pay. It passed the House 66-0-4 and the Senate 34-0-1, and the Governor signed it on March 17, 2026, as Session Law Chapter 32, effective July 1, 2026.",
    statusLabel: "Signed into law, effective July 1, 2026 (Ch. 32)",
    whatItChanges: "Amends existing Idaho Code § 33-911, “School district facilities fund.” It does not add a new section.\n\nMoneys transferred to each school district must still be used in place of property-tax levy moneys, in a listed order of priority: (a) payment of existing school bonds issued prior to July 1, 2025; (b) payments required pursuant to § 33-909; (c) payment of existing school bonds issued on or after July 1, 2025; (d) payment of supplemental school levies authorized pursuant to § 33-802, excluding indefinite-term supplemental levies described in § 33-802(5); and (e) payment of school plant facility levies authorized pursuant to §§ 33-804 and 33-804A. Paragraph (f) is revised so that any moneys that remain after those payments may be used for construction of a new school facility, renovation, or maintenance needs; used to secure and make payments on a new school facilities bond; used to make additional payments on existing school facilities bonds; used to make payments on lease-purchase agreements for school facilities; or saved in a reserve account for future school facility needs. Uses of funds shall include regular and routine facilities maintenance, including preventive maintenance, building repairs, and building security, and periodic major facilities projects involving planning, design, construction, renovation, retrofitting, and replacing of buildings and building systems, components, and features, as well as site acquisition, site improvements, and new construction.\n\nSubsection (3) is revised so that the amount of moneys received pursuant to “subsection (2)(a), (c), (d), and (e) of this section,” rather than “this section” generally, must be deducted from a school levy that would otherwise have been paid by property taxpayers. Such moneys may not be duplicated by the collection of property tax, and no property taxes may be collected in order to make extra payments on expenses described in subsection (2) in excess of required amounts.\n\nSection 2 declares an emergency and makes the act effective on and after July 1, 2026.",
    timeline: [
      { date: "2026-02-11", action: "Introduced, read first time, referred to JRA for Printing" },
      { date: "2026-02-12", action: "Reported printed and referred to Education" },
      { date: "2026-02-16", action: "Reported out of committee with Do Pass recommendation; filed for second reading" },
      { date: "2026-02-17", action: "Read second time; filed for third reading" },
      { date: "2026-02-18", action: "Read third time in full; passed the House 66-0-4; title approved; to Senate" },
      { date: "2026-02-19", action: "Received in the Senate; introduced, read first time; referred to Education" },
      { date: "2026-02-25", action: "Reported out of committee with Do Pass recommendation; filed for second reading" },
      { date: "2026-02-26", action: "Read second time; filed for third reading" },
      { date: "2026-03-10", action: "Read third time in full; passed the Senate 34-0-1; title approved; to House; returned from Senate passed; to JRA for enrolling" },
      { date: "2026-03-11", action: "Reported enrolled; signed by Speaker; transmitted to Senate" },
      { date: "2026-03-12", action: "Received in the Senate enrolled/signed by Speaker; signed by President; returned to House" },
      { date: "2026-03-13", action: "Returned signed by the President; ordered transmitted to Governor" },
      { date: "2026-03-16", action: "Delivered to the Governor at 2:30 p.m. on March 13, 2026 (time as printed; zone not stated)" },
      { date: "2026-03-18", action: "Reported signed by the Governor on March 17, 2026; Session Law Chapter 32; effective July 1, 2026" },
    ],
    fiscalNote: "The official Statement of Purpose / Fiscal Note (revised February 26, 2026, 1:20 p.m.) states: “This legislation causes no additional expenditure of funds at the state or local level of government, nor does it cause an increase or decrease in revenue for state or local government; therefore, the legislation has no fiscal impact.”",
    votes: [
      { chamber: "house", date: "2026-02-18", yes: 66, no: 0, absent: 4, url: H0636_PAGE },
      { chamber: "senate", date: "2026-03-10", yes: 34, no: 0, absent: 1, url: H0636_PAGE },
    ],
    sponsors: [
      {
        name: "Rep. Mike Moyle",
        party: "Republican",
        role: "Statement of Purpose contact",
        url: "https://legislature.idaho.gov/house/membership/",
      },
      {
        name: "Rep. Jason A. Monks",
        party: "Republican",
        role: "Statement of Purpose contact",
        url: "https://legislature.idaho.gov/house/membership/",
      },
      {
        name: "Sen. Treg A. Bernt",
        party: "Republican",
        role: "Statement of Purpose contact and Senate floor sponsor",
        url: "https://legislature.idaho.gov/senate/membership/",
      },
      {
        name: "Rep. Soñia R. Galaviz",
        party: "Democrat",
        role: "Statement of Purpose contact and House floor sponsor",
        url: "https://legislature.idaho.gov/house/membership/",
      },
    ],
    viewpointNote:
      "No verbatim quote from either side was found. Republican Statement of Purpose contacts are Rep. Mike Moyle, Rep. Jason A. Monks, and Sen. Treg A. Bernt, who was the Senate floor sponsor.",
    sponsorStatement: {
      quote: "“This bill reduces property taxes by establishing a sustainable mechanism for school districts to fund building maintenance and new construction without relying on new bond elections. It expands the allowable uses of the School District Facilities Fund once existing bonds and levies have been discharged.”",
      speaker: "Rep. Soñia R. Galaviz",
      party: "Democrat",
      role: "Statement of Purpose contact and House floor sponsor",
      url: H0636_SOP,
    },
    news: [],
    sources: [
      source("Official bill page (status, actions, roll calls)", H0636_PAGE),
      source("Bill text PDF", H0636_PDF),
      source("Statement of Purpose / Fiscal Note PDF", H0636_SOP),
      source("LegiScan free page (direct fetch returned HTTP 403; not used for status or votes)", H0636_LEGIS),
      source("Official 2026 session hub", SESSION_2026),
      source("Rep. Mike Moyle, House membership roster", HOUSE_ROSTER),
      source("Rep. Jason A. Monks, House membership roster", HOUSE_ROSTER),
      source("Sen. Treg A. Bernt, Senate membership roster", SENATE_ROSTER),
      source("Rep. Soñia R. Galaviz, House membership roster", HOUSE_ROSTER),
      source("2026 Mini Directory", MINI_DIRECTORY),
    ],
  },
  {
    state: "idaho",
    slug: "h0656",
    identifier: "H0656",
    shortSummary: "This would have directed the State Board of Education to collect aggregated data from public colleges and universities, charter schools, and school districts on the immigration status, nationality, and primary language of enrolled students, and to send an annual report to the Legislature. The bill text says the data would be for analysis only, shall not be used to discriminate, and that only aggregated data would be reported. It was referred to House Education on February 13, 2026, and had no further official action. The 2026 session ended April 2, 2026. There were no floor votes, and the bill was not enacted.",
    statusLabel: "Died in committee",
    whatItChanges: "Would have added a new section, Idaho Code § 33-144, “Student immigration status and nationality in Idaho public educational institutions — data collection,” to Chapter 1, Title 33. It would not have amended an existing section. The bill did not become law.\n\nThe Legislature’s stated intent in the bill is to collect aggregated immigration data for Idaho students to enable the Legislature to estimate more accurately the cost of educating Idaho students and to illustrate the financial impact that federal immigration policy has on the state. “Aggregated data” and “school district” would have the meanings in § 33-133. “Immigration status” would mean legal status under the Immigration and Nationality Act, including a lawful permanent resident as defined in 8 U.S.C. 1101(20); a “national of the United States” as defined in 8 U.S.C. 1101(22); a “qualified alien” as defined in 8 U.S.C. 1641; and a “non-qualified alien,” defined in the bill as an individual who is unauthorized and not lawfully admitted into the United States. “Public institution of higher education” would mean any state university, college, or community college in Idaho.\n\nThe State Board of Education would collect from all public institutions of higher education, charter schools, and school districts aggregated data regarding the immigration status, nationality, and primary language of all enrolled students, subject to the data-protection and privacy requirements of § 33-133. The collection would be for the purpose of analyzing data only; such student data shall not be used to discriminate against any student in any manner; and all student data collected under the section and reported to the board shall be aggregated data. The board would submit an annual report to the Legislature including the aggregated data collected.\n\nSection 2 declared an emergency and would have made the act effective on and after July 1, 2026.",
    timeline: [
      { date: "2026-02-12", action: "Introduced, read first time, referred to JRA for Printing" },
      { date: "2026-02-13", action: "Reported printed and referred to Education" },
      { date: "2026-04-02", action: "No further official actions appear on the bill page as of November 22, 2026. The 2026 legislative session ended April 2, 2026. The official page shows no committee report, floor vote, or enrollment." },
    ],
    fiscalNote: "The official Statement of Purpose / Fiscal Note (introduced February 12, 2026, 10:57 a.m.) states: “This legislation causes no increase or decrease in revenue, or additional expenditure of funds at the state or local level of government; therefore, this legislation has no fiscal impact.”",
    votes: [
    ],
    sponsors: [
      {
        name: "Rep. Steve C. Tanner",
        party: "Republican",
        role: "Statement of Purpose contact",
        url: "https://legislature.idaho.gov/house/membership/",
      },
    ],
    conservativeView: [
      {
        quote: "“The landmark U.S. Supreme Court decision Plyler v Doe (1982) ruled that public schools cannot deny any student enrollment based on immigration status. In order to more accurately assess the cost of educating children of people having foreign status, the purpose of this bill is to require public schools to collect and report the immigration status and language group of each enrolled student. This statute directs school districts to aggregate the immigration status already collected in student records per Idaho Code 33-133(1 )(j) and 33-133(3)( c) (vi), using categories specified in 8 U.S.C. 1101 and 8 U.S.C. 1641 of the U.S. Immigration and Nationality Act. No personally identifiable information shall be reported for purposes of this act. This statute only requires aggregate data. These data are needed to better inform the state department of education and the Idaho legislature regarding the costs to educate these students.”",
        speaker: "Rep. Steve C. Tanner",
        party: "Republican",
        role: "Statement of Purpose contact",
        outlet: "Statement of Purpose",
        date: "February 12, 2026",
        url: H0656_SOP,
      },
    ],
    liberalView: [
      {
        quote: "“Even though the bill says data will be aggregated and not used to discriminate, the very act of collecting and categorizing students by immigration status in a public school system could create a chilling effect for undocumented or mixed-status families.”",
        speaker: "ACLU of Idaho",
        party: "not applicable",
        role: "advocacy organization",
        outlet: "ACLU of Idaho",
        date: "Apr 6, 2026",
        url: ACLU_H0656,
        label: "OPPOSING VIEW · Opinion",
      },
    ],
    sponsorStatement: {
      quote: "“The landmark U.S. Supreme Court decision Plyler v Doe (1982) ruled that public schools cannot deny any student enrollment based on immigration status. In order to more accurately assess the cost of educating children of people having foreign status, the purpose of this bill is to require public schools to collect and report the immigration status and language group of each enrolled student. This statute directs school districts to aggregate the immigration status already collected in student records per Idaho Code 33-133(1 )(j) and 33-133(3)( c) (vi), using categories specified in 8 U.S.C. 1101 and 8 U.S.C. 1641 of the U.S. Immigration and Nationality Act. No personally identifiable information shall be reported for purposes of this act. This statute only requires aggregate data. These data are needed to better inform the state department of education and the Idaho legislature regarding the costs to educate these students.”",
      speaker: "Rep. Steve C. Tanner",
      party: "Republican",
      role: "Statement of Purpose contact",
      url: H0656_SOP,
    },
    news: [],
    sources: [
      source("Official bill page (status and actions)", H0656_PAGE),
      source("Bill text PDF", H0656_PDF),
      source("Statement of Purpose / Fiscal Note PDF", H0656_SOP),
      source("LegiScan free page (direct fetch returned HTTP 403; not used for status or votes)", H0656_LEGIS),
      source("Office of the Governor, 2026 Legislative Session page (session ended April 2, 2026)", GOV_2026),
      source("Official 2026 session hub", SESSION_2026),
      source("ACLU of Idaho written position page (Position: Oppose; page lists Latest Update: Apr 6, 2026)", ACLU_H0656),
      source("Rep. Steve C. Tanner, House membership roster", HOUSE_ROSTER),
      source("2026 Mini Directory", MINI_DIRECTORY),
    ],
  },

];
