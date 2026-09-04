"use client";

import { useState, useEffect } from "react";
import { Users } from "lucide-react";

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  orders: number;
  createdAt: string;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/customers")
      .then((r) => r.json())
      .then((data) => setCustomers(data.customers || []))
      .catch(() => setCustomers([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-dark border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-8 font-serif text-3xl font-bold">Customers</h1>

      <div className="rounded-2xl bg-white shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line bg-sand/40">
                <th className="px-4 py-3 text-left font-medium text-ink/50">Name</th>
                <th className="px-4 py-3 text-left font-medium text-ink/50">Phone</th>
                <th className="px-4 py-3 text-left font-medium text-ink/50">Orders</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer._id} className="border-b border-line">
                  <td className="px-4 py-3 font-medium">{customer.name}</td>
                  <td className="px-4 py-3 text-ink/65">{customer.phone || "-"}</td>
                  <td className="px-4 py-3 text-ink/65">{customer.orders}</td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-12 text-center text-sm text-ink/50">
                    <Users size={40} className="mx-auto mb-3 text-ink/10" />
                    No customers yet.
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
