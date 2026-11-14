"use client";

import { useState } from "react";

export function SignupForm({ compact = false }: { compact?: boolean }) {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  return (
    <form
      className={compact ? "space-y-3" : "space-y-3 rounded-lg border border-line bg-paper p-4"}
      onSubmit={async (event) => {
        event.preventDefault();
        setPending(true);
        setError(null);
        setMessage(null);
        const form = new FormData(event.currentTarget);
        const response = await fetch("/api/signup", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            email: form.get("email"),
            consent: form.get("consent") === "on",
            source: "website",
          }),
        });
        const payload = (await response.json().catch(() => null)) as { error?: string; message?: string } | null;
        setPending(false);
        if (!response.ok) {
          setError(payload?.error || "Signup failed. Try again in a minute.");
          return;
        }
        setMessage(payload?.message || "You're on the list.");
        event.currentTarget.reset();
      }}
    >
      <div>
        <h2 className="font-serif text-2xl text-navy">This week at the Gold Dome</h2>
        <p className="mt-1 text-sm text-muted">
          A short email of about five Georgia bills, one line each, with a link back here. No spam folder tricks.
        </p>
      </div>
      <label className="block text-sm font-semibold" htmlFor="signup-email">
        Email
      </label>
      <input
        id="signup-email"
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="you@example.com"
        className="min-h-11 w-full rounded-md border border-line bg-white px-3 text-base"
      />
      <label className="flex items-start gap-2 text-sm">
        <input name="consent" type="checkbox" required className="mt-1" />
        <span>
          Send me the weekly Georgia bill email. I can unsubscribe anytime. See the{" "}
          <a className="underline" href="/privacy">
            privacy note
          </a>
          .
        </span>
      </label>
      <button
        type="submit"
        disabled={pending}
        className="min-h-11 rounded-md bg-crimson px-4 font-semibold text-white disabled:opacity-60"
      >
        {pending ? "Saving…" : "Sign up"}
      </button>
      {message ? <p className="text-sm text-navy">{message}</p> : null}
      {error ? <p className="text-sm text-crimson">{error}</p> : null}
    </form>
  );
}
