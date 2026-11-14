"use client";

import { useSyncExternalStore } from "react";

function subscribe(onStoreChange: () => void) {
  window.addEventListener("acw-sponsor", onStoreChange);
  return () => window.removeEventListener("acw-sponsor", onStoreChange);
}

export function SponsorBar({
  sponsor,
}: {
  sponsor: { id: number; slug: string; name: string; tagline: string | null; paidForBy: string } | null;
}) {
  const closed = useSyncExternalStore(
    subscribe,
    () => (sponsor ? window.localStorage.getItem(`acw-sponsor-closed-${sponsor.id}`) : null),
    () => null,
  );
  if (!sponsor || closed === "1") return null;

  return (
    <div className="bg-navy text-white">
      <div className="mx-auto flex max-w-5xl items-start gap-3 px-4 py-2 text-sm">
        <p className="min-w-0 flex-1 leading-snug">
          <span className="font-semibold">Sponsored by {sponsor.name}.</span>{" "}
          {sponsor.tagline ? <span>{sponsor.tagline} </span> : null}
          <a className="underline" href={`/go/${sponsor.slug}`}>
            Learn more
          </a>
          <span className="mt-0.5 block text-xs text-white/80">{sponsor.paidForBy}</span>
        </p>
        <button
          type="button"
          className="shrink-0 rounded px-2 py-1 text-xs uppercase tracking-wide text-white/90 hover:bg-white/10"
          onClick={() => {
            window.localStorage.setItem(`acw-sponsor-closed-${sponsor.id}`, "1");
            window.dispatchEvent(new Event("acw-sponsor"));
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}
