import type { Metadata } from "next";
import { ContactForm } from "@/components/forms";
import { SiteTrust } from "@/components/chrome";
import { contactTopic } from "@/lib/contact-topics";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact American Capitol Watch about a question, a data correction, sponsorship, or press. We reply within 2 business days.",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string }>;
}) {
  const topic = contactTopic((await searchParams).topic) ?? "general";
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-4">
        <h1 className="font-serif text-3xl text-navy">Contact</h1>
        <SiteTrust variant="page" />
      </div>
      <div className="rounded-lg border border-line bg-paper p-4">
        <h2 className="font-serif text-2xl text-navy">Send a message</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Name, email, a topic, and a short message. We reply within 2 business days (Mon–Fri).
        </p>
        <div className="mt-3">
          <ContactForm initialTopic={topic} />
        </div>
      </div>
    </div>
  );
}
