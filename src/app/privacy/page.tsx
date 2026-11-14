import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
  description: "What American Capitol Watch stores when you sign up or send a tip.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl space-y-4 text-sm leading-relaxed">
      <h1 className="font-serif text-3xl text-navy">Privacy</h1>
      <p>
        The weekly email is optional. The box is unchecked until you check it. We store your email in our database. If Resend is configured, we also add you to that audience so the newsletter can be sent later. The newsletter includes an unsubscribe link.
      </p>
      <p>
        Tips and sponsor notes store the name, email, and message you submit so a person can review them. We count pageviews on the server as a total per path per day. We do not sell the list.
      </p>
      <p>Test addresses and common disposable inboxes are rejected so the list stays deliverable.</p>
    </div>
  );
}
