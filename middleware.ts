import { NextResponse, type NextRequest } from "next/server";
import NextAuth from "next-auth";
import { baseAuthConfig } from "@/lib/auth";

const ADMIN_PREFIX = "/admin";

// Lightweight edge-safe auth instance: verifies the JWT session cookie without
// importing the database-backed credentials provider (Node-only).
const { auth } = NextAuth(baseAuthConfig);

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
