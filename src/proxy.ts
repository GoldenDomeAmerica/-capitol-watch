import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { blockedPublicPath } from "@/lib/launch";

export function proxy(request: NextRequest) {
  if (blockedPublicPath(request.nextUrl.pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/not-live";
    return NextResponse.rewrite(url);
  }
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-acw-path", request.nextUrl.pathname);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
