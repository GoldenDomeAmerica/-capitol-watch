import { NextResponse } from "next/server";
import { adminGuard, pendingSubmissions } from "@/lib/admin";
import { logError } from "@/lib/errors";

export async function GET(request: Request) {
  const denied = adminGuard(request);
  if (denied) return denied;
  try {
    const queue = await pendingSubmissions();
    return NextResponse.json({ queue });
  } catch (error) {
    await logError(error, "/api/admin/queue");
    return NextResponse.json({ error: "Could not read the queue." }, { status: 500 });
  }
}
