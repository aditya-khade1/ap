"use client";

import { useState, useEffect } from "react";
import { formatPrice } from "@/lib/utils";

interface Order {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
}

const statuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((r) => r.json())
      .then((data) => setOrders(data.orders || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (orderId: string, status: string) => {
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus: status }),
      });
      setOrders(
        orders.map((o) => (o._id === orderId ? { ...o, orderStatus: status } : o))
      );
    } catch {
      alert("Failed to update status");
    }
  };

  if (loading) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-ink border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-8 font-serif text-3xl font-bold">Orders</h1>

      <div className="rounded-2xl bg-white shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/5 bg-black/[0.02]">
                <th className="px-4 py-3 text-left font-medium text-black/50">Order #</th>
                <th className="px-4 py-3 text-left font-medium text-black/50">Customer</th>
                <th className="px-4 py-3 text-left font-medium text-black/50">Total</th>
                <th className="px-4 py-3 text-left font-medium text-black/50">Payment</th>
                <th className="px-4 py-3 text-left font-medium text-black/50">Status</th>
                <th className="px-4 py-3 text-left font-medium text-black/50">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b border-black/5">
                  <td className="px-4 py-3 font-medium">{order.orderNumber}</td>
                  <td className="px-4 py-3">
                    <div>{order.customerName}</div>
                    <div className="text-xs text-black/40">{order.customerPhone}</div>
                  </td>
                  <td className="px-4 py-3 font-semibold">{formatPrice(order.total)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-semibold ${
                        order.paymentStatus === "paid" ? "text-green-600" : "text-amber-600"
                      }`}
                    >
                      {order.paymentMethod === "cod" ? "COD" : "Online"} - {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={order.orderStatus}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                      className="rounded-lg border border-black/10 px-2 py-1 text-xs font-semibold outline-none"
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-black/50">
                    {new Date(order.createdAt).toLocaleDateString("en-IN")}
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-sm text-black/40">
                    No orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
