export const TOPICS = [
  {
    id: "taxes",
    slug: "taxes",
    name: "Taxes",
    description:
      "Bills that change income taxes, sales taxes, homestead exemptions, or other state revenue rules.",
    sortOrder: 1,
  },
  {
    id: "guns",
    slug: "guns",
    name: "Guns & 2A",
    description:
      "Bills about firearms, ammunition, and the right to keep and bear arms.",
    sortOrder: 2,
  },
  {
    id: "schools",
    slug: "schools",
    name: "Schools",
    description: "Bills about public schools, scholarships, sports, and college.",
    sortOrder: 3,
  },
  {
    id: "elections",
    slug: "elections",
    name: "Elections",
    description: "Bills about voting, ballots, campaign finance, and election rules.",
    sortOrder: 4,
  },
  {
    id: "property-rights",
    slug: "property-rights",
    name: "Property rights",
    description:
      "Bills about owning, using, and getting paid for private property.",
    sortOrder: 5,
  },
] as const;

export type TopicSlug = (typeof TOPICS)[number]["slug"];

export function topicBySlug(slug: string) {
  return TOPICS.find((topic) => topic.slug === slug) ?? null;
}
