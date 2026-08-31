export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getOrders } from "@/lib/data/orders";

export async function GET() {
  try {
    const orders = getOrders();
    const customerMap = new Map<string, {
      _id: string;
      name: string;
      email: string;
      phone: string;
      orders: number;
      createdAt: string;
    }>();

    orders.forEach((o) => {
      const key = `${o.customerName || ""}-${o.customerPhone || ""}`;
      if (!customerMap.has(key)) {
        const address = o.address || {};
        customerMap.set(key, {
          _id: key,
          name: o.customerName || address.fullName || "Guest",
          email: "",
          phone: o.customerPhone || address.phone || "",
          orders: 0,
          createdAt: String(o.createdAt || ""),
        });
      }
      customerMap.get(key)!.orders += 1;
    });

    const customers = Array.from(customerMap.values());
    return NextResponse.json({ customers });
  } catch {
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
  }
}
