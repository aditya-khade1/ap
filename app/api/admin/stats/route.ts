export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getProducts } from "@/lib/data/products";
import { getOrders, getOrderStats } from "@/lib/data/orders";
import { isAdminSession, unauthorized } from "@/lib/require-admin";

export async function GET() {
  if (!(await isAdminSession())) return unauthorized();
  try {
    const products = getProducts();
    const orders = getOrders();
    const { totalRevenue, recentOrders } = getOrderStats();

    const totalProducts = products.length;
    const totalOrders = orders.length;
    const totalCustomers = new Set(
      orders.map((o) => o.customerPhone || o.customerName || "guest")
    ).size;
    const totalSales = orders.length;
    const revenue = orders.reduce((s, o) => s + o.total, 0);

    const ordersByStatus = orders.reduce<Record<string, number>>((acc, o) => {
      acc[o.orderStatus] = (acc[o.orderStatus] || 0) + 1;
      return acc;
    }, {});

    return NextResponse.json({
      totalProducts,
      totalOrders,
      totalCustomers,
      totalSales,
      totalRevenue: revenue || totalRevenue || 0,
      recentOrders,
      ordersByStatus: Object.entries(ordersByStatus).map(([status, count]) => ({
        _id: status,
        count,
      })),
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
