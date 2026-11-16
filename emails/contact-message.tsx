import { Body, Container, Head, Heading, Html, Preview, Text } from "react-email";

export type ContactMessageProps = {
  id: number;
  name: string;
  email: string;
  topic: string;
  message: string;
};

export function ContactMessageEmail({ id, name, email, topic, message }: ContactMessageProps) {
  return (
    <Html lang="en">
      <Head />
      <Body style={{ backgroundColor: "#f4f0e8", fontFamily: "Georgia, serif", color: "#10243e" }}>
        <Preview>
          Contact form: {topic} from {name}
        </Preview>
        <Container style={{ margin: "0 auto", maxWidth: "560px", padding: "24px" }}>
          <Heading as="h1" style={{ fontSize: "24px" }}>
            Contact message #{id}
          </Heading>
          <Text>
            {name} ({email}) · {topic}
          </Text>
          <Text>{message}</Text>
          <Text style={{ fontSize: "12px", color: "#5c6b7a" }}>
            Saved as a contact message. Reply to this email to answer them.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

ContactMessageEmail.PreviewProps = {
  id: 1,
  name: "Ada Lovelace",
  email: "ada@example.com",
  topic: "General",
  message: "A question about a bill page.",
} satisfies ContactMessageProps;
