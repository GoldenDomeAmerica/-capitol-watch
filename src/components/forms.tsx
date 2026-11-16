"use client";

import { useState } from "react";
import { CONTACT_TOPICS } from "@/lib/contact-topics";

function Message({ error, message }: { error: string | null; message: string | null }) {
  if (error) return <p className="text-sm text-crimson">{error}</p>;
  if (message) return <p className="text-sm text-navy">{message}</p>;
  return null;
}

export function SubmitForm() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  return (
    <form
      className="space-y-3"
      onSubmit={async (event) => {
        event.preventDefault();
        setPending(true);
        setError(null);
        setMessage(null);
        const form = new FormData(event.currentTarget);
        const response = await fetch("/api/submit", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            kind: form.get("kind"),
            name: form.get("name"),
            email: form.get("email"),
            body: form.get("body"),
            relatedUrl: form.get("relatedUrl"),
          }),
        });
        const payload = (await response.json().catch(() => null)) as { error?: string; message?: string } | null;
        setPending(false);
        if (!response.ok) {
          setError(payload?.error || "Could not save that. Try again.");
          return;
        }
        setMessage(payload?.message || "Received. We'll review it.");
        event.currentTarget.reset();
      }}
    >
      <label className="block text-sm font-semibold" htmlFor="kind">
        What is this?
      </label>
      <select id="kind" name="kind" className="min-h-11 w-full rounded-md border border-line bg-white px-3" required>
        <option value="bill_tip">Bill tip</option>
        <option value="correction">Correction</option>
        <option value="event">Event</option>
      </select>
      <label className="block text-sm font-semibold" htmlFor="tip-name">
        Name
      </label>
      <input id="tip-name" name="name" required className="min-h-11 w-full rounded-md border border-line bg-white px-3" />
      <label className="block text-sm font-semibold" htmlFor="tip-email">
        Email
      </label>
      <input id="tip-email" name="email" type="email" required className="min-h-11 w-full rounded-md border border-line bg-white px-3" />
      <label className="block text-sm font-semibold" htmlFor="tip-url">
        Link, if you have one
      </label>
      <input id="tip-url" name="relatedUrl" type="url" className="min-h-11 w-full rounded-md border border-line bg-white px-3" />
      <label className="block text-sm font-semibold" htmlFor="tip-body">
        Details
      </label>
      <textarea id="tip-body" name="body" required rows={6} className="w-full rounded-md border border-line bg-white px-3 py-2" />
      <button type="submit" disabled={pending} className="min-h-11 rounded-md bg-navy px-4 font-semibold text-white">
        {pending ? "Sending…" : "Submit for review"}
      </button>
      <Message error={error} message={message} />
    </form>
  );
}

export function ContactForm({ initialTopic }: { initialTopic: string }) {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const topic = CONTACT_TOPICS.some((item) => item.value === initialTopic) ? initialTopic : "general";

  return (
    <form
      className="relative space-y-3"
      onSubmit={async (event) => {
        event.preventDefault();
        const formElement = event.currentTarget;
        setPending(true);
        setError(null);
        setMessage(null);
        const form = new FormData(formElement);
        try {
          const response = await fetch("/api/contact", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              name: form.get("name"),
              email: form.get("email"),
              topic: form.get("topic"),
              message: form.get("message"),
              fax: form.get("fax"),
            }),
          });
          const payload = (await response.json().catch(() => null)) as { error?: string; message?: string } | null;
          if (!response.ok) {
            setError(payload?.error || "Could not send that. Try again.");
            return;
          }
          setMessage(payload?.message || "Thanks. We received your message.");
          formElement.reset();
        } catch {
          setError("Could not send that. Try again.");
        } finally {
          setPending(false);
        }
      }}
    >
      <div className="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="contact-fax">Fax</label>
        <input id="contact-fax" name="fax" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>
      <label className="block text-sm font-semibold" htmlFor="contact-name">
        Name
      </label>
      <input
        id="contact-name"
        name="name"
        required
        maxLength={120}
        autoComplete="name"
        className="min-h-11 w-full rounded-md border border-line bg-white px-3"
      />
      <label className="block text-sm font-semibold" htmlFor="contact-email">
        Email
      </label>
      <input
        id="contact-email"
        name="email"
        type="email"
        required
        maxLength={254}
        autoComplete="email"
        className="min-h-11 w-full rounded-md border border-line bg-white px-3"
      />
      <label className="block text-sm font-semibold" htmlFor="contact-topic">
        Topic
      </label>
      <select
        id="contact-topic"
        name="topic"
        key={topic}
        defaultValue={topic}
        required
        className="min-h-11 w-full rounded-md border border-line bg-white px-3"
      >
        {CONTACT_TOPICS.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
      <label className="block text-sm font-semibold" htmlFor="contact-message">
        Message
      </label>
      <textarea
        id="contact-message"
        name="message"
        required
        rows={6}
        maxLength={5000}
        className="w-full rounded-md border border-line bg-white px-3 py-2"
      />
      <button type="submit" disabled={pending} className="min-h-11 rounded-md bg-navy px-4 font-semibold text-white">
        {pending ? "Sending…" : "Send message"}
      </button>
      <div role="status" aria-live="polite">
        <Message error={error} message={message} />
      </div>
    </form>
  );
}

export function SponsorForm() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  return (
    <form
      className="space-y-3"
      onSubmit={async (event) => {
        event.preventDefault();
        setPending(true);
        setError(null);
        setMessage(null);
        const form = new FormData(event.currentTarget);
        const response = await fetch("/api/sponsor", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            name: form.get("name"),
            email: form.get("email"),
            organization: form.get("organization"),
            body: form.get("body"),
          }),
        });
        const payload = (await response.json().catch(() => null)) as { error?: string; message?: string } | null;
        setPending(false);
        if (!response.ok) {
          setError(payload?.error || "Could not save that. Try again.");
          return;
        }
        setMessage(payload?.message || "Got it. We'll be in touch.");
        event.currentTarget.reset();
      }}
    >
      <label className="block text-sm font-semibold" htmlFor="sp-name">
        Name
      </label>
      <input id="sp-name" name="name" required className="min-h-11 w-full rounded-md border border-line bg-white px-3" />
      <label className="block text-sm font-semibold" htmlFor="sp-email">
        Email
      </label>
      <input id="sp-email" name="email" type="email" required className="min-h-11 w-full rounded-md border border-line bg-white px-3" />
      <label className="block text-sm font-semibold" htmlFor="sp-org">
        Organization
      </label>
      <input id="sp-org" name="organization" className="min-h-11 w-full rounded-md border border-line bg-white px-3" />
      <label className="block text-sm font-semibold" htmlFor="sp-body">
        What do you want to sponsor?
      </label>
      <textarea id="sp-body" name="body" required rows={5} className="w-full rounded-md border border-line bg-white px-3 py-2" />
      <button type="submit" disabled={pending} className="min-h-11 rounded-md bg-crimson px-4 font-semibold text-white">
        {pending ? "Sending…" : "Get in touch"}
      </button>
      <Message error={error} message={message} />
    </form>
  );
}
