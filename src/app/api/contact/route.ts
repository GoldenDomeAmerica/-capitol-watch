import { render } from "react-email";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getDb } from "@/db";
import { contactMessages } from "@/db/schema";
import { ContactMessageEmail } from "../../../../emails/contact-message";
import { contactTopicLabel } from "@/lib/contact-topics";
import { CONTACT_SUCCESS, hashIp, parseContact, requestIp, tooManyContactMessages } from "@/lib/contact";
import { isPlaceholderFrom, isUnset } from "@/lib/email-address";
import { logError } from "@/lib/errors";

export async function POST(request: Request) {
  let payload: {
    name?: unknown;
    email?: unknown;
    topic?: unknown;
    message?: unknown;
    fax?: unknown;
  };
  try {
    payload = (await request.json()) as typeof payload;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (typeof payload.fax === "string" && payload.fax.trim()) {
    return NextResponse.json({ message: CONTACT_SUCCESS });
  }

  const parsed = parseContact(payload);
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });

  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: "The contact form needs a database." }, { status: 503 });
  }

  const ip = requestIp(request);
  const ipHash = ip ? hashIp(ip) : null;
  let saved: { id: number; name: string; email: string; topic: string; message: string } | null = null;
  try {
    if (ipHash && (await tooManyContactMessages(ipHash))) {
      return NextResponse.json(
        { error: "You've sent several messages recently. Wait an hour and try again." },
        { status: 429 },
      );
    }
    const [row] = await db
      .insert(contactMessages)
      .values({
        name: parsed.value.name,
        email: parsed.value.email,
        topic: parsed.value.topic,
        message: parsed.value.message,
        ipHash,
        status: "new",
      })
      .returning();
    saved = row
      ? { id: row.id, name: row.name, email: row.email, topic: row.topic, message: row.message }
      : null;
  } catch (error) {
    await logError(error, "/api/contact");
    return NextResponse.json({ error: "Could not send that message." }, { status: 500 });
  }

  if (saved) await emailOwner(saved);
  return NextResponse.json({ message: CONTACT_SUCCESS });
}

async function emailOwner(input: {
  id: number;
  name: string;
  email: string;
  topic: string;
  message: string;
}): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.NEWSLETTER_FROM;
  const owner = process.env.OWNER_EMAIL;
  if (isUnset(key) || isPlaceholderFrom(from) || isUnset(owner) || !owner?.includes("@")) return;
  try {
    const resend = new Resend(key);
    const topic = contactTopicLabel(input.topic);
    const element = ContactMessageEmail({ ...input, topic });
    const html = await render(element);
    const text = await render(element, { plainText: true });
    const subjectName = input.name.replace(/[\r\n]+/g, " ").slice(0, 80);
    const sent = await resend.emails.send(
      {
        from: from!,
        to: [owner],
        replyTo: input.email,
        subject: `Contact (${topic}) from ${subjectName}`,
        html,
        text,
      },
      { idempotencyKey: `contact-message/${input.id}` },
    );
    if (sent.error) await logError(new Error(sent.error.message), "/api/contact");
  } catch (error) {
    await logError(error, "/api/contact");
  }
}
