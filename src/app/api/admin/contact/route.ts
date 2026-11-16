import { NextResponse } from "next/server";
import { adminGuard, contactMessagePage, markContactRead } from "@/lib/admin";
import { logError } from "@/lib/errors";

export async function GET(request: Request) {
  const denied = adminGuard(request);
  if (denied) return denied;
  const status = new URL(request.url).searchParams.get("status")?.trim() || "";
  if (status && status !== "new" && status !== "read") {
    return NextResponse.json({ error: "Status must be new or read." }, { status: 400 });
  }
  try {
    const page = await contactMessagePage(status || null);
    return NextResponse.json({ status: status || null, count: page.count, messages: page.messages });
  } catch (error) {
    await logError(error, "/api/admin/contact");
    return NextResponse.json({ error: "Could not list contact messages." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const denied = adminGuard(request);
  if (denied) return denied;
  let payload: { id?: unknown };
  try {
    payload = (await request.json()) as typeof payload;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const id = payload.id;
  if (typeof id !== "number" || !Number.isInteger(id) || id < 1) {
    return NextResponse.json({ error: "Send the message id to mark it read." }, { status: 400 });
  }
  try {
    const message = await markContactRead(id);
    if (!message) return NextResponse.json({ error: "No contact message with that id." }, { status: 404 });
    return NextResponse.json({ message });
  } catch (error) {
    await logError(error, "/api/admin/contact");
    return NextResponse.json({ error: "Could not update that message." }, { status: 500 });
  }
}
