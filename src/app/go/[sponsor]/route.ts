import { NextResponse } from "next/server";
import { logError } from "@/lib/errors";
import { getSponsorBySlug, logSponsorClick } from "@/lib/queries";
import { siteUrl } from "@/lib/site";

export async function GET(
  request: Request,
  context: { params: Promise<{ sponsor: string }> },
) {
  const { sponsor } = await context.params;
  const row = await getSponsorBySlug(sponsor);
  if (!row) {
    return NextResponse.json({ error: "Unknown sponsor." }, { status: 404 });
  }
  let destination: URL;
  try {
    destination = new URL(row.destinationUrl);
  } catch {
    return NextResponse.json({ error: "Sponsor link is not a valid URL." }, { status: 500 });
  }
  if (destination.protocol !== "https:" && destination.protocol !== "http:") {
    return NextResponse.json({ error: "Sponsor link must be http or https." }, { status: 500 });
  }
  try {
    const referer = request.headers.get("referer");
    await logSponsorClick(row.id, referer ? referer.slice(0, 300) : "direct");
  } catch (error) {
    await logError(error, `/go/${sponsor}`);
  }
  const response = NextResponse.redirect(destination, 302);
  response.headers.set("x-acw-site", siteUrl());
  return response;
}
