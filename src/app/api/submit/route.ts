import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { submissions } from "@/db/schema";
import { checkEmail } from "@/lib/email-address";
import { logError } from "@/lib/errors";

const KINDS = new Set(["bill_tip", "correction", "event"]);

export async function POST(request: Request) {
  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: "The review queue needs a database." }, { status: 503 });
  }
  let payload: { kind?: string; name?: string; email?: string; body?: string; relatedUrl?: string };
  try {
    payload = (await request.json()) as typeof payload;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (!payload.kind || !KINDS.has(payload.kind)) {
    return NextResponse.json({ error: "Pick a tip, a correction, or an event." }, { status: 400 });
  }
  const name = (payload.name ?? "").trim();
  const body = (payload.body ?? "").trim();
  if (name.length < 2 || name.length > 120) {
    return NextResponse.json({ error: "Add your name." }, { status: 400 });
  }
  if (body.length < 8 || body.length > 5000) {
    return NextResponse.json({ error: "Add a short description, under 5,000 characters." }, { status: 400 });
  }
  const checked = checkEmail(payload.email ?? "");
  if (!checked.ok) return NextResponse.json({ error: checked.reason }, { status: 400 });
  const related = (payload.relatedUrl ?? "").trim();
  if (related && !/^https?:\/\//i.test(related)) {
    return NextResponse.json({ error: "Links need to start with http:// or https://." }, { status: 400 });
  }
  try {
    await db.insert(submissions).values({
      kind: payload.kind,
      name,
      email: checked.email,
      body,
      relatedUrl: related || null,
      status: "pending",
    });
  } catch (error) {
    await logError(error, "/api/submit");
    return NextResponse.json({ error: "Could not save that." }, { status: 500 });
  }
  return NextResponse.json({ message: "Received. It is in the review queue." });
}
