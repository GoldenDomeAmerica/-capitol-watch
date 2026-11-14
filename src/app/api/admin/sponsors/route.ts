import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { sponsorWeeks } from "@/db/schema";
import { adminGuard, listSponsors } from "@/lib/admin";
import { logError } from "@/lib/errors";

export async function GET(request: Request) {
  const denied = adminGuard(request);
  if (denied) return denied;
  try {
    return NextResponse.json({ sponsors: await listSponsors() });
  } catch (error) {
    await logError(error, "/api/admin/sponsors");
    return NextResponse.json({ error: "Could not read sponsors." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const denied = adminGuard(request);
  if (denied) return denied;
  const db = getDb();
  if (!db) return NextResponse.json({ error: "Database is not configured." }, { status: 503 });
  let payload: {
    slug?: string;
    name?: string;
    tagline?: string;
    destinationUrl?: string;
    paidForBy?: string;
    startsOn?: string;
    endsOn?: string;
    weeklyRateCents?: number;
    emailSlot?: boolean;
    siteBar?: boolean;
    active?: boolean;
  };
  try {
    payload = (await request.json()) as typeof payload;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const slug = (payload.slug ?? "").trim().toLowerCase();
  const name = (payload.name ?? "").trim();
  const paidForBy = (payload.paidForBy ?? "").trim();
  const destinationUrl = (payload.destinationUrl ?? "").trim();
  if (!/^[a-z0-9-]{2,64}$/.test(slug)) {
    return NextResponse.json({ error: "Slug must be 2–64 lowercase letters, numbers, or hyphens." }, { status: 400 });
  }
  if (name.length < 2 || paidForBy.length < 8) {
    return NextResponse.json(
      { error: "Name and a Paid for by line are required. Political sponsors must include that line." },
      { status: 400 },
    );
  }
  let destination: URL;
  try {
    destination = new URL(destinationUrl);
  } catch {
    return NextResponse.json({ error: "destinationUrl must be a valid URL." }, { status: 400 });
  }
  if (destination.protocol !== "http:" && destination.protocol !== "https:") {
    return NextResponse.json({ error: "destinationUrl must be http or https." }, { status: 400 });
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(payload.startsOn ?? "") || !/^\d{4}-\d{2}-\d{2}$/.test(payload.endsOn ?? "")) {
    return NextResponse.json({ error: "startsOn and endsOn must be YYYY-MM-DD." }, { status: 400 });
  }
  try {
    const [row] = await db
      .insert(sponsorWeeks)
      .values({
        slug,
        name,
        tagline: payload.tagline?.trim() || null,
        destinationUrl,
        paidForBy,
        startsOn: payload.startsOn!,
        endsOn: payload.endsOn!,
        weeklyRateCents: payload.weeklyRateCents ?? 5000,
        emailSlot: payload.emailSlot !== false,
        siteBar: payload.siteBar !== false,
        active: payload.active !== false,
      })
      .returning();
    return NextResponse.json({ sponsor: row });
  } catch (error) {
    await logError(error, "/api/admin/sponsors");
    return NextResponse.json({ error: "Could not save that sponsor week." }, { status: 500 });
  }
}
