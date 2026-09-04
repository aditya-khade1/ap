"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Search, Phone, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { store } from "@/lib/store";
import { categories } from "@/lib/store";
import SearchBar from "@/components/search/SearchBar";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) return null;

  const navLinks = [
    { href: "/shop", label: "Shop" },
    ...categories.map((c) => ({ href: `/category/${c.slug}`, label: c.name })),
  ];

  const isActive = (href: string) =>
    href === "/shop"
      ? pathname === "/shop"
      : pathname.startsWith(`/category/`) && pathname.includes(href);

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b border-line bg-cream shadow-[0_6px_20px_-8px_rgba(33,26,24,0.18)] transition-shadow ${
          scrolled ? "shadow-[0_10px_28px_-10px_rgba(33,26,24,0.28)]" : ""
        }`}
      >
        {/* Top row: brand + actions */}
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-2 pt-[calc(0.5rem+env(safe-area-inset-top,0px))] pb-1.5 sm:px-6 md:gap-4 lg:px-8">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2.5 sm:gap-3"
            aria-label={store.name}
          >
            {store.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={store.logo}
                alt={store.name}
                className="h-9 w-auto shrink-0 object-contain lg:h-11"
              />
            ) : (
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-dark text-sm font-bold text-white">
                AP
              </div>
            )}
            <span className="shrink-0 font-serif text-xl text-ink">
              AP Fashion Mart
            </span>
          </Link>

          <div className="flex shrink-0 items-center gap-1 sm:gap-2 md:gap-3">
            {store.phone && (
              <a
                href={`tel:${store.phone.replace(/\s/g, "")}`}
                aria-label={`Call ${store.phone}`}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line text-ink/70 transition hover:bg-ink/5 md:hidden"
              >
                <Phone size={18} />
              </a>
            )}
            <a
              href={`tel:${store.phone.replace(/\s/g, "")}`}
              aria-label={`Call ${store.phone}`}
              className="hidden shrink-0 items-center gap-1.5 whitespace-nowrap text-sm text-ink/60 hover:text-ink md:flex"
            >
              <Phone size={15} />
              <span>{store.phone}</span>
            </a>

            <button
              onClick={() => setSearchOpen(true)}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line transition hover:bg-ink/5"
              aria-label="Search"
            >
              <Search size={18} />
            </button>

            <div className="hidden shrink-0 flex-col items-end xl:flex">
              <a
                href={`https://wa.me/${store.whatsapp}?text=${encodeURIComponent(
                  "Hello AP Fashion Mart,\nI would like to see more products.\nPlease share your latest collection and prices."
                )}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-brand-dark px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-deep"
              >
                <MessageCircle size={16} /> WhatsApp
              </a>
              <a
                href={`https://wa.me/${store.whatsapp}?text=${encodeURIComponent(
                  "Hello AP Fashion Mart, I'd like to see more of your collection."
                )}`}
                target="_blank"
                rel="noreferrer"
                className="mt-0.5 whitespace-nowrap text-[10px] font-medium text-ink/55 underline decoration-brand/40 underline-offset-2 transition hover:text-brand-dark"
              >
                See more on WhatsApp
              </a>
            </div>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line md:hidden"
              aria-label="Open menu"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile category rail */}
        <nav
          aria-label="Mobile categories"
          className="relative border-t border-line bg-cream md:hidden"
        >
          <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto overscroll-x-contain scroll-smooth scroll-px-3 px-3 py-1.5 sm:px-5 sm:scroll-px-5">
            {navLinks
              .filter((link) => link.href !== "/shop")
              .map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`shrink-0 whitespace-nowrap rounded-lg border px-3 py-1 text-[11px] font-medium tracking-wide transition-all duration-200 active:scale-[0.96] ${
                    isActive(link.href)
                      ? "border-brand/25 bg-brand-tint text-brand-dark"
                      : "border-line bg-cream/80 text-ink/75 hover:border-brand/30 hover:text-brand-dark"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-cream to-transparent"
          />
        </nav>

        {/* Bottom row: full navigation */}
        <nav
          aria-label="Primary"
          className="hidden items-center justify-center gap-x-6 gap-y-1 border-t border-line pb-2.5 pt-2.5 md:flex md:flex-wrap"
        >
          {navLinks
            .filter((link) => link.href !== "/shop")
            .map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`shrink-0 whitespace-nowrap px-1 text-[13px] font-medium transition hover:text-brand-dark ${
                  isActive(link.href) ? "text-brand-dark" : "text-ink/70"
                }`}
              >
                {link.label}
              </Link>
            ))}
        </nav>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div
            className="absolute inset-0 bg-ink/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-80 max-w-[85vw] bg-cream animate-slide-in overflow-y-auto pb-[max(2rem,env(safe-area-inset-bottom,0px))]">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-cream px-6 py-4">
              <span className="shrink-0 font-serif text-xl text-ink">
                AP Fashion Mart
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-line"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="px-4 pt-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex min-h-[48px] items-center rounded-xl px-4 text-base font-medium transition hover:bg-ink/5 ${
                    isActive(link.href) ? "bg-brand-tint text-brand-dark" : ""
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="mt-6 space-y-3 border-t border-line px-6 pt-6">
              <a
                href={`tel:${store.phone.replace(/\s/g, "")}`}
                className="flex min-h-[48px] items-center gap-3 rounded-full bg-ink px-5 text-sm font-semibold text-white"
              >
                <Phone size={18} /> Call {store.phone}
              </a>
              <a
                href={`https://wa.me/${store.whatsapp}?text=${encodeURIComponent(
                  "Hello AP Fashion Mart,\nI would like to see more products.\nPlease share your latest collection and prices."
                )}`}
                target="_blank"
                rel="noreferrer"
                className="flex min-h-[48px] items-center gap-3 rounded-full bg-whatsapp px-5 text-sm font-semibold text-white"
              >
                <MessageCircle size={18} /> Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Search Overlay */}
      {searchOpen && <SearchBar onClose={() => setSearchOpen(false)} />}
    </>
  );
}
