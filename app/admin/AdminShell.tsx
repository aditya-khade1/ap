"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import AdminSidebar from "@/components/layout/AdminSidebar";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-cream">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-64">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-black/5 bg-white px-4 py-3 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-xl transition hover:bg-black/5"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <span className="font-serif text-lg font-semibold">Admin Panel</span>
          <div className="grid h-10 w-10 place-items-center rounded-full bg-ink text-xs font-bold text-white">
            AP
          </div>
        </header>

        <main className="p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">{children}</main>
      </div>
    </div>
  );
}