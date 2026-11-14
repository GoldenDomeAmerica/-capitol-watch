import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getDb } from "@/db";
import { signups } from "@/db/schema";
import { checkEmail, isUnset } from "@/lib/email-address";
import { logError } from "@/lib/errors";

export async function POST(request: Request) {
  const db = getDb();
  if (!db) {
    return NextResponse.json(
      { error: "Email signup is not available until the database is connected." },
      { status: 503 },
    );
  }
  let payload: { email?: string; consent?: boolean; source?: string };
  try {
    payload = (await request.json()) as typeof payload;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (!payload.consent) {
    return NextResponse.json({ error: "Check the box to subscribe." }, { status: 400 });
  }
  const checked = checkEmail(payload.email ?? "");
  if (!checked.ok) return NextResponse.json({ error: checked.reason }, { status: 400 });

  const [existing] = await db.select().from(signups).where(eq(signups.email, checked.email)).limit(1);
  if (existing) {
    return NextResponse.json({ message: "You're already on the list." });
  }

  const resendResult = await addToAudience(checked.email);
  try {
    await db.insert(signups).values({
      email: checked.email,
      consent: true,
      source: (payload.source || "website").slice(0, 40),
      resendContactId: resendResult.id,
      resendStatus: resendResult.status,
    });
  } catch (error) {
    await logError(error, "/api/signup");
    return NextResponse.json({ error: "Could not save that signup." }, { status: 500 });
  }
  if (resendResult.status === "failed") {
    await logError(new Error("Resend contact was not created"), "/api/signup");
  }
  return NextResponse.json({
    message:
      resendResult.status === "skipped"
        ? "You're on the list. The email audience is not connected yet, so this signup is stored here until it is."
        : "You're on the list.",
  });
}

async function addToAudience(email: string): Promise<{ status: string; id: string | null }> {
  const key = process.env.RESEND_API_KEY;
  const segmentId = process.env.RESEND_AUDIENCE_ID;
  if (isUnset(key) || isUnset(segmentId)) return { status: "skipped", id: null };
  try {
    const resend = new Resend(key);
    const created = await resend.contacts.create({
      email,
      unsubscribed: false,
      segments: [{ id: segmentId! }],
    });
    if (!created.error && created.data?.id) return { status: "added", id: created.data.id };
    const existing = await resend.contacts.get({ email });
    if (existing.data?.id) {
      await resend.contacts.segments.add({ contactId: existing.data.id, segmentId: segmentId! });
      return { status: "added", id: existing.data.id };
    }
    return { status: "failed", id: null };
  } catch (error) {
    await logError(error, "/api/signup");
    return { status: "failed", id: null };
  }
}
