import type { Metadata } from "next";
import { SubmitForm } from "@/components/forms";

export const metadata: Metadata = {
  title: "Send a tip",
  description: "Send a bill tip, a correction, or an event. Submissions go to a review queue.",
};

export default function SubmitPage() {
  return (
    <div className="mx-auto max-w-xl space-y-4">
      <h1 className="font-serif text-3xl text-navy">Send a tip</h1>
      <p className="text-sm leading-relaxed text-muted">
        Bill tips, corrections, and events land in a review queue. Nothing is published automatically. If you cite a bill, include the official legis.ga.gov or palegis.us link when you have it.
      </p>
      <SubmitForm />
    </div>
  );
}
