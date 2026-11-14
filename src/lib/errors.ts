import { errors } from "@/db/schema";
import { getDb } from "@/db";

const SECRET_KEYS = [
  "ADMIN_TOKEN",
  "RESEND_API_KEY",
  "DATABASE_URL",
  "OWNER_EMAIL",
  "NEWSLETTER_FROM",
] as const;

export function scrub(value: string): string {
  let out = value.replace(/postgres(?:ql)?:\/\/\S+/gi, "postgres://[redacted]");
  for (const key of SECRET_KEYS) {
    const secret = process.env[key];
    if (secret && secret.length > 3) out = out.split(secret).join("[redacted]");
  }
  return out.slice(0, 4000);
}

export async function logError(error: unknown, path?: string): Promise<void> {
  const message = scrub(error instanceof Error ? error.message : String(error));
  const detail = scrub(error instanceof Error ? error.stack || "" : "");
  try {
    const db = getDb();
    if (!db) {
      console.error("[acw]", message);
      return;
    }
    await db.insert(errors).values({ message, path: path ?? null, detail: detail || null });
  } catch (nested) {
    console.error("[acw] failed to record error", scrub(String(nested)));
  }
}
