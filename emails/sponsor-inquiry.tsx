import { Body, Container, Head, Heading, Html, Preview, Text } from "react-email";

export type SponsorInquiryProps = {
  id: number;
  name: string;
  email: string;
  organization: string;
  body: string;
};

export function SponsorInquiryEmail({ id, name, email, organization, body }: SponsorInquiryProps) {
  return (
    <Html lang="en">
      <Head />
      <Body style={{ backgroundColor: "#f4f0e8", fontFamily: "Georgia, serif", color: "#10243e" }}>
        <Preview>Sponsor inquiry from {name}</Preview>
        <Container style={{ margin: "0 auto", maxWidth: "560px", padding: "24px" }}>
          <Heading as="h1" style={{ fontSize: "24px" }}>
            Sponsor inquiry #{id}
          </Heading>
          <Text>
            {name} ({email})
            {organization ? ` · ${organization}` : ""}
          </Text>
          <Text>{body}</Text>
          <Text style={{ fontSize: "12px", color: "#5c6b7a" }}>
            Saved in the review queue as a sponsor submission. Reply to this email to answer them.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

SponsorInquiryEmail.PreviewProps = {
  id: 1,
  name: "Ada Lovelace",
  email: "ada@example.com",
  organization: "Example Co",
  body: "We would like the email slot for one week.",
} satisfies SponsorInquiryProps;
