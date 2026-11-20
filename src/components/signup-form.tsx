"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { STATES } from "@/lib/states";

function stateOnPage(path: string): string {
  const match = STATES.find((state) => path === `/${state.slug}` || path.startsWith(`/${state.slug}/`));
  return match?.slug ?? STATES[0]?.slug ?? "";
}

export function SignupForm({ compact = false }: { compact?: boolean }) {
  const pathname = usePathname();
  const defaultState = stateOnPage(pathname || "/");
  const emailId = useId();
  const stateId = useId();
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
            state: form.get("state"),
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
        <h2 className="font-serif text-2xl text-navy">American Capitol Watch</h2>
        <p className="mt-1 text-sm text-muted">
          One national email. You get a short introduction, then the bills from the state you pick. No spam folder tricks.
        </p>
      </div>
      <label className="block text-sm font-semibold" htmlFor={stateId}>
        State
      </label>
      <select
        id={stateId}
        name="state"
        required
        defaultValue={defaultState}
        className="min-h-11 w-full rounded-md border border-line bg-white px-3 text-base"
      >
        {STATES.map((state) => (
          <option key={state.slug} value={state.slug}>
            {state.name}
          </option>
        ))}
      </select>
      <label className="block text-sm font-semibold" htmlFor={emailId}>
        Email
      </label>
      <input
        id={emailId}
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
          Send me the American Capitol Watch email for the state I selected. I can unsubscribe anytime. See the{" "}
          <Link className="underline" href="/privacy">
            privacy note
          </Link>
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
