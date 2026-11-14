import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
  pixelBasedPreset,
} from "react-email";

export type WeeklyBill = {
  identifier: string;
  title: string;
  summary: string;
  url: string;
};

export type WeeklyStateSection = {
  slug: string;
  name: string;
  note: string;
  bills: WeeklyBill[];
};

export type WeeklyIssueProps = {
  issueDate: string;
  sections: WeeklyStateSection[];
  siteUrl: string;
  sponsorName?: string | null;
  paidForBy?: string | null;
  postalAddress?: string | null;
};

export default function WeeklyIssue({
  issueDate,
  sections,
  siteUrl,
  sponsorName,
  paidForBy,
  postalAddress,
}: WeeklyIssueProps) {
  const stateNames = sections.map((section) => section.name).join(" and ") || "your state";
  return (
    <Html lang="en">
      <Tailwind
        config={{
          presets: [pixelBasedPreset],
          theme: { extend: { colors: { navy: "#10243e", crimson: "#8e1b2a" } } },
        }}
      >
        <Head />
        <Body className="bg-white font-sans text-navy">
          <Preview>{`American Capitol Watch: ${stateNames}, one line each.`}</Preview>
          <Container className="mx-auto max-w-xl px-6 py-6">
            <Text className="m-0 text-xs font-semibold uppercase tracking-wide text-crimson">American Capitol Watch</Text>
            <Heading as="h1" className="mt-2 mb-1 text-2xl text-navy">
              This week in the states you follow
            </Heading>
            <Text className="mt-0 text-sm text-gray-700">{issueDate}</Text>
            <Text className="text-base text-gray-800">
              A short national note, then only the state you picked. Each line is a plain summary, not a grade. Open the site for
              sponsors, status, and the official page.
            </Text>
            {sections.map((section) => (
              <Section key={section.slug} className="mt-4">
                <Heading as="h2" className="mb-1 text-xl text-navy">
                  {section.name}
                </Heading>
                <Text className="mt-0 text-sm text-gray-700">{section.note}</Text>
                {section.bills.length === 0 ? (
                  <Text className="text-sm text-gray-800">No tracked bills are loaded for this state yet.</Text>
                ) : (
                  section.bills.map((bill) => (
                    <Section key={bill.url} className="mb-4">
                      <Text className="m-0 text-base font-semibold text-navy">
                        <Link href={bill.url} className="text-navy underline">
                          {bill.identifier}: {bill.title}
                        </Link>
                      </Text>
                      <Text className="mt-1 mb-0 text-sm text-gray-800">{bill.summary}</Text>
                    </Section>
                  ))
                )}
              </Section>
            ))}
            <Hr className="my-4 border-solid border-gray-300" />
            <Text className="text-sm text-gray-800">
              Sponsored by {sponsorName || "this slot is open"}.
              {paidForBy ? ` ${paidForBy}` : ""}
            </Text>
            <Text className="text-sm">
              <Link href={siteUrl} className="text-crimson underline">
                Read the full list
              </Link>
            </Text>
            <Text className="text-xs text-gray-600">
              {postalAddress || "Add NEWSLETTER_POSTAL_ADDRESS before sending. A physical address is required for a marketing email."}
            </Text>
            <Text className="text-xs text-gray-600">
              <Link href="{{{RESEND_UNSUBSCRIBE_URL}}}" className="text-gray-600 underline">
                Unsubscribe
              </Link>
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

WeeklyIssue.PreviewProps = {
  issueDate: "November 14, 2026",
  siteUrl: "https://example.com",
  sponsorName: "Open slot",
  paidForBy: null,
  postalAddress: null,
  sections: [
    {
      slug: "georgia",
      name: "Georgia",
      note: "Tracked bills from the Gold Dome.",
      bills: [
        {
          identifier: "HB 111",
          title: "Income tax; reduce rate of tax",
          summary: "This bill would reduce the income-tax rate.",
          url: "https://example.com/georgia/bills/hb-111",
        },
      ],
    },
  ],
} satisfies WeeklyIssueProps;
