import { NextResponse } from "next/server";
import { adminGuard, reviewSubmission } from "@/lib/admin";
import { logError } from "@/lib/errors";

export async function POST(request: Request) {
  const denied = adminGuard(request);
  if (denied) return denied;
  let payload: { id?: number; decision?: string; note?: string };
  try {
    payload = (await request.json()) as typeof payload;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (!payload.id || (payload.decision !== "approve" && payload.decision !== "reject")) {
    return NextResponse.json({ error: "Send id and decision of approve or reject." }, { status: 400 });
  }
  try {
    const row = await reviewSubmission(payload.id, payload.decision, payload.note?.slice(0, 1000) ?? null);
    if (!row) return NextResponse.json({ error: "No pending submission with that id." }, { status: 404 });
    return NextResponse.json({ submission: row });
  } catch (error) {
    await logError(error, "/api/admin/approve");
    return NextResponse.json({ error: "Could not update that submission." }, { status: 500 });
  }
}
