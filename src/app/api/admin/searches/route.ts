import { NextResponse } from "next/server";
import { adminGuard, recentSearches } from "@/lib/admin";
import { logError } from "@/lib/errors";

export async function GET(request: Request) {
  const denied = adminGuard(request);
  if (denied) return denied;
  try {
    return NextResponse.json({ searches: await recentSearches() });
  } catch (error) {
    await logError(error, "/api/admin/searches");
    return NextResponse.json({ error: "Could not read searches." }, { status: 500 });
  }
}
