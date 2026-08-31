export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getOrders, createOrder } from "@/lib/data/orders";

export async function GET() {
  try {
    const orders = getOrders();
    return NextResponse.json({ orders });
  } catch {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const order = createOrder({
      ...body,
      paymentMethod: "cod",
      paymentStatus: "pending",
      orderStatus: "pending",
    });

    return NextResponse.json(order, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
