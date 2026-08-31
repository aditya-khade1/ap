import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth";

const ADMIN_PREFIX = "/admin";

export default auth((req) => {
  const isAdminRoute =
    req.nextUrl.pathname === ADMIN_PREFIX ||
    req.nextUrl.pathname.startsWith(`${ADMIN_PREFIX}/`);

  if (isAdminRoute && !req.auth) {
    const loginUrl = new URL("/auth/login", req.url);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
});

export const config = {
  matcher: ["/admin/:path*"],
};