import { createHash } from "node:crypto";
import { and, eq, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { contactMessages } from "@/db/schema";
import { checkEmail } from "@/lib/email-address";
import { contactTopic, type ContactTopic } from "@/lib/contact-topics";

const NAME_MAX = 120;
const MESSAGE_MIN = 8;
const MESSAGE_MAX = 5000;
const RATE_LIMIT = 5;

export const CONTACT_SUCCESS =
  "Thanks. We received your message and will reply within 2 business days (Mon–Fri).";

export type ContactInput = {
  name: string;
  email: string;
  topic: ContactTopic;
  message: string;
};

export function parseContact(payload: {
  name?: unknown;
  email?: unknown;
  topic?: unknown;
  message?: unknown;
}): { ok: true; value: ContactInput } | { ok: false; error: string } {
  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const message = typeof payload.message === "string" ? payload.message.trim() : "";
  const topic = contactTopic(typeof payload.topic === "string" ? payload.topic : null);
  if (name.length < 2 || name.length > NAME_MAX) {
    return { ok: false, error: "Add your name, up to 120 characters." };
  }
  if (!topic) return { ok: false, error: "Pick a topic." };
  if (message.length < MESSAGE_MIN || message.length > MESSAGE_MAX) {
    return { ok: false, error: "Add a message, under 5,000 characters." };
  }
  const checked = checkEmail(typeof payload.email === "string" ? payload.email : "");
  if (!checked.ok) return { ok: false, error: checked.reason };
  return { ok: true, value: { name, email: checked.email, topic, message } };
}

/** First public client address from the proxy header. Null when it is missing or not an IP. */
export function requestIp(request: Request): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  const candidate = (forwarded?.split(",")[0] ?? request.headers.get("x-real-ip") ?? "").trim();
  if (!candidate || candidate.length > 80) return null;
  if (!/^[a-fA-F0-9:.]+$/.test(candidate)) return null;
  return candidate;
}

export function hashIp(ip: string): string {
  return createHash("sha256").update(`acw-contact:${ip}`).digest("hex");
}

/** True when this address already stored the hourly cap of contact messages. */
export async function tooManyContactMessages(ipHash: string): Promise<boolean> {
  const db = getDb();
  if (!db) return false;
  const [row] = await db
    .select({ value: sql<number>`count(*)::int` })
    .from(contactMessages)
    .where(and(eq(contactMessages.ipHash, ipHash), sql`${contactMessages.createdAt} >= now() - interval '1 hour'`));
  return Number(row?.value ?? 0) >= RATE_LIMIT;
}
