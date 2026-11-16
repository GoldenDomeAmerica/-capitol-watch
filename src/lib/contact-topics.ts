export const CONTACT_TOPICS = [
  { value: "general", label: "General" },
  { value: "correction", label: "Data correction" },
  { value: "sponsorship", label: "Sponsorship / advertising" },
  { value: "press", label: "Press" },
  { value: "other", label: "Other" },
] as const;

export type ContactTopic = (typeof CONTACT_TOPICS)[number]["value"];

export function contactTopic(value: string | null | undefined): ContactTopic | null {
  const normalized = value?.trim().toLowerCase() ?? "";
  return CONTACT_TOPICS.find((topic) => topic.value === normalized)?.value ?? null;
}

export function contactTopicLabel(value: string): string {
  return CONTACT_TOPICS.find((topic) => topic.value === value)?.label ?? value;
}
