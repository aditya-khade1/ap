"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MessageCircle } from "lucide-react";
import { store } from "@/lib/store";

export default function MobileBottomNav() {
  const pathname = usePathname();

  const isAdmin = pathname.startsWith("/admin");
  if (isAdmin) return null;

  const active = (p: string) =>
    pathname === p || pathname.startsWith(`${p}/`);

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 border-t border-black/5 bg-white/95 backdrop-blur lg:hidden"
      aria-label="Mobile navigation"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <Link
        href="/"
        className={`flex min-h-[56px] flex-col items-center justify-center gap-0.5 text-[10px] font-medium ${
          active("/") ? "text-rose" : "text-ink/55"
        }`}
      >
        <Home size={22} />
        Home
      </Link>
      <a
        href={`https://wa.me/${store.whatsapp}?text=${encodeURIComponent(
          "Hi AP Fashion Mart! I'd like to place an order."
        )}`}
        target="_blank"
        rel="noreferrer"
        className={`flex min-h-[56px] flex-col items-center justify-center gap-0.5 text-[10px] font-medium ${
          pathname === "/checkout" ? "text-rose" : "text-ink/55"
        }`}
      >
        <MessageCircle size={22} />
        Chat
      </a>
    </nav>
  );
}
