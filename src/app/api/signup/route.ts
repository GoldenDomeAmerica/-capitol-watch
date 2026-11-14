import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { signups } from "@/db/schema";
import { parseStateChoice } from "@/lib/audience";
import { checkEmail, isUnset } from "@/lib/email-address";
import { logError } from "@/lib/errors";
import { tagContact } from "@/lib/resend-audience";

export async function POST(request: Request) {
  const db = getDb();
  if (!db) {
    return NextResponse.json(
      { error: "Email signup is not available until the database is connected." },
      { status: 503 },
    );
  }
  let payload: { email?: string; consent?: boolean; source?: string; state?: string };
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
  const choice = parseStateChoice(payload.state);
  if (!choice.ok) return NextResponse.json({ error: choice.reason }, { status: 400 });

  const segmentId = process.env.RESEND_AUDIENCE_ID;
  const resendResult = isUnset(segmentId)
    ? { status: "skipped", id: null }
    : await tagContact({ email: checked.email, states: choice.states, segmentId: segmentId! });

  const [existing] = await db.select().from(signups).where(eq(signups.email, checked.email)).limit(1);
  try {
    if (existing) {
      await db
        .update(signups)
        .set({
          states: choice.states,
          source: (payload.source || existing.source || "website").slice(0, 40),
          resendContactId: resendResult.id ?? existing.resendContactId,
          resendStatus: resendResult.status,
        })
        .where(eq(signups.id, existing.id));
    } else {
      await db.insert(signups).values({
        email: checked.email,
        consent: true,
        states: choice.states,
        source: (payload.source || "website").slice(0, 40),
        resendContactId: resendResult.id,
        resendStatus: resendResult.status,
      });
    }
  } catch (error) {
    await logError(error, "/api/signup");
    return NextResponse.json({ error: "Could not save that signup." }, { status: 500 });
  }
  if (resendResult.status === "failed") {
    await logError(new Error("Resend contact was not tagged"), "/api/signup");
  }
  const saved = existing ? "We saved the state you picked." : "You're on the list.";
  return NextResponse.json({
    message:
      resendResult.status === "skipped"
        ? `${saved} The email audience is not connected yet, so this signup is stored here until it is.`
        : saved,
  });
}
