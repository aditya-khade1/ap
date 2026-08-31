export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getOrders } from "@/lib/data/orders";
import { isAdminSession, unauthorized } from "@/lib/require-admin";

export async function GET() {
  if (!(await isAdminSession())) return unauthorized();
  try {
    const orders = getOrders();
    return NextResponse.json({ orders });
  } catch {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
