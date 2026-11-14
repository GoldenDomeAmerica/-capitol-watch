import { NextResponse } from "next/server";
import { adminGuard, listSignups, signupCountsByState } from "@/lib/admin";
import { logError } from "@/lib/errors";
import { stateBySlug } from "@/lib/states";

export async function GET(request: Request) {
  const denied = adminGuard(request);
  if (denied) return denied;
  const state = new URL(request.url).searchParams.get("state")?.trim() || "";
  if (state && !stateBySlug(state)) {
    return NextResponse.json({ error: "Unknown state." }, { status: 400 });
  }
  try {
    const [signups, byState] = await Promise.all([listSignups(state || null), signupCountsByState()]);
    return NextResponse.json({
      state: state || null,
      count: state ? (byState[state] ?? 0) : Object.values(byState).reduce((sum, value) => sum + value, 0),
      byState,
      signups,
    });
  } catch (error) {
    await logError(error, "/api/admin/signups");
    return NextResponse.json({ error: "Could not list subscribers." }, { status: 500 });
  }
}
