"use client";

import { useState, useEffect } from "react";
import { Package, ShoppingCart, Users, IndianRupee } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface Stats {
  totalProducts: number;
  totalOrders: number;
  totalCustomers: number;
  totalRevenue: number;
  recentOrders: {
    _id: string;
    orderNumber: string;
    customerName: string;
    total: number;
    orderStatus: string;
    createdAt: string;
  }[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-ink border-t-transparent" />
      </div>
    );
  }

  const statCards = [
    { label: "Total Products", value: stats?.totalProducts || 0, icon: Package, color: "bg-blue-50 text-blue-600" },
    { label: "Total Orders", value: stats?.totalOrders || 0, icon: ShoppingCart, color: "bg-green-50 text-green-600" },
    { label: "Total Customers", value: stats?.totalCustomers || 0, icon: Users, color: "bg-purple-50 text-purple-600" },
    { label: "Total Revenue", value: formatPrice(stats?.totalRevenue || 0), icon: IndianRupee, color: "bg-amber-50 text-amber-600" },
  ];

  return (
    <div>
      <h1 className="mb-8 font-serif text-3xl font-bold">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.label} className="rounded-2xl bg-white p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-black/50">{card.label}</p>
                <p className="mt-1 font-serif text-2xl font-bold">{card.value}</p>
              </div>
              <div className={`grid h-12 w-12 place-items-center rounded-xl ${card.color}`}>
                <card.icon size={22} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl bg-white p-6 shadow-soft">
        <h2 className="mb-4 font-serif text-xl font-semibold">Recent Orders</h2>
        {stats?.recentOrders?.length ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-black/5">
                  <th className="pb-3 text-left font-medium text-black/50">Order #</th>
                  <th className="pb-3 text-left font-medium text-black/50">Customer</th>
                  <th className="pb-3 text-left font-medium text-black/50">Total</th>
                  <th className="pb-3 text-left font-medium text-black/50">Status</th>
                  <th className="pb-3 text-left font-medium text-black/50">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order) => (
                  <tr key={order._id} className="border-b border-black/5">
                    <td className="py-3 font-medium">{order.orderNumber}</td>
                    <td className="py-3">{order.customerName}</td>
                    <td className="py-3 font-semibold">{formatPrice(order.total)}</td>
                    <td className="py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          order.orderStatus === "delivered"
                            ? "bg-green-50 text-green-600"
                            : order.orderStatus === "cancelled"
                              ? "bg-red-50 text-red-600"
                              : "bg-amber-50 text-amber-600"
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="py-3 text-black/50">
                      {new Date(order.createdAt).toLocaleDateString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-black/40">No orders yet.</p>
        )}
      </div>
    </div>
  );
}
