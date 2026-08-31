"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight } from "lucide-react";
import Link from "next/link";

interface SearchBarProps {
  onClose: () => void;
}

export default function SearchBar({ onClose }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ name: string; slug: string; category: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    inputRef.current?.focus();
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(query)}&limit=8`);
        const data = await res.json();
        setResults(data.products || []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/shop?search=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[70]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative mx-auto mt-20 max-w-2xl px-4 animate-slide-up">
        <div className="rounded-2xl bg-white shadow-medium overflow-hidden">
          <form onSubmit={handleSubmit} className="flex items-center gap-3 border-b border-black/5 px-5">
            <Search size={20} className="shrink-0 text-black/30" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for sarees, jewellery, kids wear..."
              className="flex-1 bg-transparent py-4 text-sm outline-none placeholder:text-black/30"
            />
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 rounded-lg bg-black/5 p-1.5 transition hover:bg-black/10"
            >
              <X size={16} />
            </button>
          </form>

          {results.length > 0 && (
            <div className="max-h-80 overflow-y-auto p-2">
              {results.map((item) => (
                <Link
                  key={item.slug}
                  href={`/product/${item.slug}`}
                  onClick={onClose}
                  className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition hover:bg-black/5"
                >
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-black/40">{item.category}</div>
                  </div>
                  <ArrowRight size={16} className="text-black/30" />
                </Link>
              ))}
            </div>
          )}

          {query.length >= 2 && results.length === 0 && !loading && (
            <div className="p-6 text-center text-sm text-black/40">
              No products found for &ldquo;{query}&rdquo;
            </div>
          )}

          {query.length < 2 && (
            <div className="p-6 text-center text-sm text-black/40">
              Type to search products...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
