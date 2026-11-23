/**
 * Plain-language bill summaries for bill lists and bill pages.
 *
 * Keyed by state slug and bill slug so another state can be added in this
 * file without a database change. A missing entry falls back to the summary
 * stored on the bill. Preview and production share one database, so these
 * sentences stay in the repo.
 *
 * Idaho sentences are rewritten from the official description on each bill
 * page at legislature.idaho.gov, together with that bill's short title.
 * They do not add effects the description does not state. The unavailable
 * sentence is used when that description does not say what would change.
 */

export const PLAIN_SUMMARY_UNAVAILABLE = "Summary not available yet";

export type PlainBillSummary = {
  state: string;
  slug: string;
  identifier: string;
  title: string;
  summary: string;
};

export const PLAIN_BILL_SUMMARIES: PlainBillSummary[] = [
  {
    state: "idaho",
    slug: "h0551",
    identifier: "H0551",
    title: "Property tax, assessment",
    summary:
      "This bill would change how new construction is counted on the property-tax roll for fire protection and ambulance service districts, including districts that are not subject to urban-renewal revenue-allocation financing. It would affect those districts and the property taxpayers in them.",
  },
  {
    state: "idaho",
    slug: "h0559",
    identifier: "H0559",
    title: "Internal revenue code conformity",
    summary:
      "This bill would update Idaho tax law to the current federal Internal Revenue Code and change some tax credits and adjustments. It would affect taxpayers who use those credits.",
  },
  {
    state: "idaho",
    slug: "h0573",
    identifier: "H0573",
    title: "Firearms instructor, enhanced lic",
    summary:
      "This bill would let some people teach Idaho law on firearms and the use of deadly force. It would affect those instructors and people seeking an enhanced license to carry a concealed weapon.",
  },
  {
    state: "idaho",
    slug: "h0592",
    identifier: "H0592",
    title: "Patient immigration status data",
    summary:
      "This bill would add rules for hospitals on collecting a patient's immigration status. It would affect hospitals and their patients.",
  },
  {
    state: "idaho",
    slug: "h0594",
    identifier: "H0594",
    title: "Taxation, late charges, fees",
    summary:
      "This bill would change late charges and interest on some taxes, and how that money is split among taxing districts. It would affect people who owe those taxes and the districts.",
  },
  {
    state: "idaho",
    slug: "h0599",
    identifier: "H0599",
    title: "Digital content and curriculum fund",
    summary:
      "This bill would change the rules for the Public School Digital Content and Curriculum Fund. It would affect public schools that use the fund.",
  },
  {
    state: "idaho",
    slug: "h0612",
    identifier: "H0612",
    title: "Portable solar generators",
    summary:
      "This bill would exempt portable solar generators from public-utility rules. It would affect people who use those generators and public utilities.",
  },
  {
    state: "idaho",
    slug: "h0623",
    identifier: "H0623",
    title: "Schools, moment of silence",
    summary:
      "This bill would require Idaho public schools to set a policy for a daily moment of silence. It would affect students and those schools.",
  },
  {
    state: "idaho",
    slug: "h0624",
    identifier: "H0624",
    title: "Virtual public education",
    summary:
      "This bill would change the rules for virtual public education in Idaho. It would affect students and schools in those programs.",
  },
  {
    state: "idaho",
    slug: "h0628",
    identifier: "H0628",
    title: "Parent-student driver’s training",
    summary:
      "This bill would change the rules for the parent-student on-road driver's training program. It would affect parents and students in that program.",
  },
  {
    state: "idaho",
    slug: "h0636",
    identifier: "H0636",
    title: "School district facilities fund",
    summary:
      "This bill would change the rules for the School District Facilities Fund. It would affect school districts that use the fund.",
  },
  {
    state: "idaho",
    slug: "h0656",
    identifier: "H0656",
    title: "Students, immigration data",
    summary:
      "This bill would add rules for collecting grouped data on students' immigration status and nationality. It would affect students in Idaho public schools and colleges.",
  },
  {
    state: "idaho",
    slug: "h0659",
    identifier: "H0659",
    title: "Immigration, memo of agreement",
    summary:
      "This bill would add rules for law enforcement agencies that make a written agreement with Immigration and Customs Enforcement. It would affect those agencies.",
  },
  {
    state: "idaho",
    slug: "h0660",
    identifier: "H0660",
    title: "Immigration status, arrested",
    summary:
      "This bill would add rules about the immigration status and nationality of people who are arrested. It would affect people who are arrested.",
  },
  {
    state: "idaho",
    slug: "h0708",
    identifier: "H0708",
    title: "Homeowner’s associations, dissolve",
    summary:
      "This bill would add a law to dissolve homeowner associations automatically. It would affect those associations and the homeowners in them.",
  },
  {
    state: "idaho",
    slug: "h0711",
    identifier: "H0711",
    title: "School admin, alt authorization",
    summary:
      "This bill would add another way for school administrators to be authorized and would allow money to be used to mentor them. It would affect those administrators and their schools.",
  },
  {
    state: "idaho",
    slug: "h0721",
    identifier: "H0721",
    title: "Public school building plan reviews",
    summary:
      "This bill would change the rules for reviews of public school building plans. It would affect public schools and the people who review the plans.",
  },
  {
    state: "idaho",
    slug: "h0722",
    identifier: "H0722",
    title: "Rate-regulated utilities",
    summary:
      "This bill would change tax rules for some electric and gas companies whose rates are regulated. It would affect those companies.",
  },
  {
    state: "idaho",
    slug: "h0733",
    identifier: "H0733",
    title: "Income taxes, partnerships",
    summary:
      "This bill would change how partnership income is taxed. It would affect partnerships and their partners.",
  },
  {
    state: "idaho",
    slug: "h0734",
    identifier: "H0734",
    title: "Green energy tax revenue",
    summary:
      "This bill would change how some green-energy tax money is divided. It would affect the people and governments that receive that money.",
  },
  {
    state: "idaho",
    slug: "h0736",
    identifier: "H0736",
    title: "Elections, ballots",
    summary:
      "This bill would change the form and contents of ballots prepared by the Secretary of State. It would affect voters who use those ballots.",
  },
  {
    state: "idaho",
    slug: "h0751",
    identifier: "H0751",
    title: "Sales tax, rebate, developers",
    summary:
      "This bill would change a sales and use tax rebate for some developers of retail complexes. It would affect those developers.",
  },
  {
    state: "idaho",
    slug: "h0756",
    identifier: "H0756",
    title: "Electric, new large loads",
    summary: PLAIN_SUMMARY_UNAVAILABLE,
  },
  {
    state: "idaho",
    slug: "h0762",
    identifier: "H0762",
    title: "Charter schools, admission",
    summary:
      "This bill would change how public charter schools admit students. It would affect those schools and students who apply.",
  },
  {
    state: "idaho",
    slug: "h0792",
    identifier: "H0792",
    title: "Sales tax, exemptions, small seller",
    summary:
      "This bill would change sales tax exemptions for occasional sales and for small sellers. It would affect people who make those sales.",
  },
  {
    state: "idaho",
    slug: "h0793",
    identifier: "H0793",
    title: "Beer, revenue distribution",
    summary:
      "This bill would change how beer revenue is distributed. It would affect the groups that receive that money.",
  },
  {
    state: "idaho",
    slug: "h0831",
    identifier: "H0831",
    title: "Election day, school instruction",
    summary:
      "This bill would ban some in-person teaching in schools on election day. It would affect schools and students.",
  },
  {
    state: "idaho",
    slug: "h0865",
    identifier: "H0865",
    title: "Public utilities commission",
    summary:
      "This bill would set rules for private contact with the Public Utilities Commission and limit gifts to a commissioner or staff member. It would affect the commission and people who contact it.",
  },
  {
    state: "idaho",
    slug: "h0872",
    identifier: "H0872",
    title: "Ballots, general elections",
    summary:
      "This bill would remove a rule about how ballots are prepared for general elections. It would affect the preparation of those ballots.",
  },
  {
    state: "idaho",
    slug: "h0873",
    identifier: "H0873",
    title: "Elections, procedures",
    summary: PLAIN_SUMMARY_UNAVAILABLE,
  },
  {
    state: "idaho",
    slug: "h0911",
    identifier: "H0911",
    title: "Electricity, new large loads",
    summary: PLAIN_SUMMARY_UNAVAILABLE,
  },
  {
    state: "idaho",
    slug: "h0930",
    identifier: "H0930",
    title: "Campaign finance, treasurers",
    summary:
      "This bill would change the duties of political treasurers. It would affect those treasurers.",
  },
  {
    state: "idaho",
    slug: "h0932",
    identifier: "H0932",
    title: "State gun, advisory question",
    summary:
      "This bill would put an advisory question about the state gun of Idaho on the ballot for voters. It would affect those voters.",
  },
  {
    state: "idaho",
    slug: "h0959",
    identifier: "H0959",
    title: "Initiative, budget limits",
    summary:
      "This bill would let voters petition to raise or lower property tax budgets for fire protection and ambulance districts, and change some budget limits. It would affect those districts and their taxpayers.",
  },
  {
    state: "idaho",
    slug: "s1260",
    identifier: "S1260",
    title: "Immigration, illegal entry",
    summary:
      "This bill would change some illegal-entry rules, remove other illegal-entry rules, and add defenses a person could raise. It would affect people those rules apply to.",
  },
  {
    state: "idaho",
    slug: "s1278",
    identifier: "S1278",
    title: "Local land use, religious land",
    summary:
      "This bill would add rules for development on religious land. It would affect owners of that land and local governments that regulate land use.",
  },
  {
    state: "idaho",
    slug: "s1280",
    identifier: "S1280",
    title: "Duplexes, twin homes, land use",
    summary:
      "This bill would add rules for twin homes and duplexes. It would affect those homes and local governments that regulate them.",
  },
  {
    state: "idaho",
    slug: "s1303",
    identifier: "S1303",
    title: "Energy resources fund",
    summary:
      "This bill would change the name of the energy resources fund and change a definition in that law. It would affect that fund.",
  },
  {
    state: "idaho",
    slug: "s1310",
    identifier: "S1310",
    title: "Human fetal tissue",
    summary:
      "This bill would add rules on the use of human fetal tissue in products. It would affect products that use that tissue.",
  },
  {
    state: "idaho",
    slug: "s1349",
    identifier: "S1349",
    title: "Machine guns",
    summary:
      "This bill would add machine-gun rules and approval that depends on other conditions, and bar enforcement of federal restrictions the bill treats as invalid. It would affect people under those rules and the officers who enforce them.",
  },
  {
    state: "idaho",
    slug: "s1356",
    identifier: "S1356",
    title: "Highway districts, elections",
    summary:
      "This bill would change how commissioners are elected in some single countywide highway districts. It would affect those districts and the voters who elect the commissioners.",
  },
  {
    state: "idaho",
    slug: "s1368",
    identifier: "S1368",
    title: "Public utilities, new large loads",
    summary: PLAIN_SUMMARY_UNAVAILABLE,
  },
  {
    state: "idaho",
    slug: "s1370",
    identifier: "S1370",
    title: "Abortion trafficking",
    summary: PLAIN_SUMMARY_UNAVAILABLE,
  },
  {
    state: "idaho",
    slug: "s1389",
    identifier: "S1389",
    title: "Polling places, liability",
    summary:
      "This bill would limit legal liability for owners of property used as a polling place. It would affect those property owners.",
  },
  {
    state: "idaho",
    slug: "s1391",
    identifier: "S1391",
    title: "Property rights protection, trailer",
    summary: PLAIN_SUMMARY_UNAVAILABLE,
  },
  {
    state: "idaho",
    slug: "s1430",
    identifier: "S1430",
    title: "Firearms regulations, preemption",
    summary:
      "This bill would change the state law that limits local firearm rules, add a penalty, and allow a lawsuit. It would affect local governments and people who bring those cases.",
  },
  {
    state: "idaho",
    slug: "s1441",
    identifier: "S1441",
    title: "Memorandum of agreement, immigration",
    summary:
      "This bill would add rules for law enforcement agencies that make a written agreement with Immigration and Customs Enforcement. It would affect those agencies.",
  },
];

const byStateAndSlug = new Map<string, PlainBillSummary>(
  PLAIN_BILL_SUMMARIES.map((row) => [`${row.state}:${row.slug}`, row]),
);

export function plainBillSummary(stateSlug: string, slug: string): PlainBillSummary | null {
  return byStateAndSlug.get(`${stateSlug}:${slug}`) ?? null;
}

/** Summary to show. Stored bill text is used when this file has no entry for that state and slug. */
export function displayBillSummary(stateSlug: string, slug: string, storedSummary: string): string {
  return plainBillSummary(stateSlug, slug)?.summary ?? storedSummary;
}

/** Short title to show. A listed bill can correct a spelling error in the stored title. */
export function displayBillTitle(stateSlug: string, slug: string, storedTitle: string): string {
  return plainBillSummary(stateSlug, slug)?.title ?? storedTitle;
}

/** Slugs whose plain summary contains the query. The unavailable sentence is not searchable. */
export function plainSummarySlugsMatching(stateSlug: string, query: string): string[] {
  const needle = query.trim().toLowerCase();
  if (needle.length < 2) return [];
  return PLAIN_BILL_SUMMARIES.filter((row) => {
    if (row.state !== stateSlug) return false;
    if (row.summary === PLAIN_SUMMARY_UNAVAILABLE) return false;
    return row.summary.toLowerCase().includes(needle);
  }).map((row) => row.slug);
}
