import { render } from "react-email";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getDb } from "@/db";
import { submissions } from "@/db/schema";
import { checkEmail, isPlaceholderFrom, isUnset } from "@/lib/email-address";
import { logError } from "@/lib/errors";
import { SponsorInquiryEmail } from "../../../../emails/sponsor-inquiry";

export async function POST(request: Request) {
  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: "The inquiry form needs a database." }, { status: 503 });
  }
  let payload: { name?: string; email?: string; organization?: string; body?: string };
  try {
    payload = (await request.json()) as typeof payload;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const name = (payload.name ?? "").trim();
  const organization = (payload.organization ?? "").trim();
  const body = (payload.body ?? "").trim();
  if (name.length < 2 || name.length > 120) {
    return NextResponse.json({ error: "Add your name." }, { status: 400 });
  }
  if (body.length < 8 || body.length > 5000) {
    return NextResponse.json({ error: "Tell us what you want to sponsor." }, { status: 400 });
  }
  const checked = checkEmail(payload.email ?? "");
  if (!checked.ok) return NextResponse.json({ error: checked.reason }, { status: 400 });

  let id = 0;
  try {
    const [row] = await db
      .insert(submissions)
      .values({
        kind: "sponsor",
        name,
        email: checked.email,
        organization: organization || null,
        body,
        status: "pending",
      })
      .returning();
    id = row?.id ?? 0;
  } catch (error) {
    await logError(error, "/api/sponsor");
    return NextResponse.json({ error: "Could not save that inquiry." }, { status: 500 });
  }

  const emailed = await emailOwner({ id, name, email: checked.email, organization, body });
  return NextResponse.json({
    message: emailed
      ? "Saved, and the note was emailed."
      : "Saved. Email to the owner is skipped until NEWSLETTER_FROM, RESEND_API_KEY, and OWNER_EMAIL are set.",
  });
}

async function emailOwner(input: {
  id: number;
  name: string;
  email: string;
  organization: string;
  body: string;
}): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.NEWSLETTER_FROM;
  const owner = process.env.OWNER_EMAIL;
  if (isUnset(key) || isPlaceholderFrom(from) || isUnset(owner) || !owner?.includes("@")) return false;
  try {
    const resend = new Resend(key);
    const element = SponsorInquiryEmail(input);
    const html = await render(element);
    const text = await render(element, { plainText: true });
    const sent = await resend.emails.send(
      { from: from!, to: [owner], replyTo: input.email, subject: `Sponsor inquiry from ${input.name}`, html, text },
      { idempotencyKey: `sponsor-inquiry/${input.id}` },
    );
    if (sent.error) {
      await logError(new Error(sent.error.message), "/api/sponsor");
      return false;
    }
    return true;
  } catch (error) {
    await logError(error, "/api/sponsor");
    return false;
  }
}
