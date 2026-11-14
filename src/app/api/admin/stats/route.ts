import { NextResponse } from "next/server";
import { adminGuard, adminStats } from "@/lib/admin";
import { logError } from "@/lib/errors";

export async function GET(request: Request) {
  const denied = adminGuard(request);
  if (denied) return denied;
  try {
    return NextResponse.json(await adminStats());
  } catch (error) {
    await logError(error, "/api/admin/stats");
    return NextResponse.json({ error: "Could not read stats." }, { status: 500 });
  }
}
