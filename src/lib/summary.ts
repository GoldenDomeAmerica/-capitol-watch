const BOILERPLATE =
  /^(provide for )?(related matters|an effective date(?: and applicability)?|applicability|a short title|legislative findings(?: and intent)?|definitions|exceptions(?: and affirmative defenses)?|conforming changes|statutory construction|construction)\b|repeal conflicting|and for other purposes|provide for related matters/i;

function lowerFirst(value: string): string {
  if (!value) return value;
  return value.charAt(0).toLowerCase() + value.slice(1);
}

function sentenceFromTitle(title: string): string {
  const cleaned = title.replace(/\s+/g, " ").replace(/[;,.]+$/, "").trim();
  if (!cleaned) return "The official caption is on the legislature's page.";
  return `Official caption: ${cleaned}.`;
}

/**
 * Plain-English summary built only from the official caption and the
 * "so as to" clauses in the General Assembly summary. It does not add facts.
 */
export function plainSummary(title: string, abstract: string | null | undefined): string {
  const source = (abstract ?? "").replace(/\s+/g, " ").trim();
  const split = source.split(/so as to /i);
  if (split.length < 2) return sentenceFromTitle(title);

  const clauses = split
    .slice(1)
    .join("so as to ")
    .split(";")
    .map((clause) => clause.trim().replace(/^to\s+/i, "").replace(/[.\s]+$/, "").trim())
    .filter((clause) => clause.length > 12 && !BOILERPLATE.test(clause))
    .slice(0, 3);

  if (!clauses.length) return sentenceFromTitle(title);

  return clauses
    .map((clause, index) => {
      const body = lowerFirst(clause);
      const lead = index === 0 ? "This bill would " : "It would also ";
      const sentence = `${lead}${body}`;
      return /[.!?]$/.test(sentence) ? sentence : `${sentence}.`;
    })
    .join(" ");
}
