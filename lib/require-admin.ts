import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

/**
 * Guard for admin-only API routes.
 * Returns false when the request is not from an authenticated admin.
 */
export async function isAdminSession(): Promise<boolean> {
  try {
    const session = await auth();
    return Boolean(session?.user);
  } catch {
    return false;
  }
}

export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}