"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";
import CustomRequestSection from "@/components/home/CustomRequestSection";
import { categories } from "@/lib/store";
import { IProduct } from "@/types";

const allSizes = ["XS", "S", "M", "L", "XL", "XXL", "Free Size", "2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-11Y"];
const priceRanges = [
  { label: "Under ₹500", min: 0, max: 500 },
  { label: "₹500 - ₹1000", min: 500, max: 1000 },
  { label: "₹1000 - ₹2000", min: 1000, max: 2000 },
  { label: "₹2000 - ₹5000", min: 2000, max: 5000 },
  { label: "Above ₹5000", min: 5000, max: 999999 },
];

function ShopContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [mobileFilters, setMobileFilters] = useState(false);

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 999999 });
  const [size, setSize] = useState("");
  const [sort, setSort] = useState("newest");

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (category) params.set("category", category);
      if (priceRange.min > 0) params.set("minPrice", String(priceRange.min));
      if (priceRange.max < 999999) params.set("maxPrice", String(priceRange.max));
      if (size) params.set("size", size);
      params.set("sort", sort);
      params.set("page", String(page));
      params.set("limit", "12");

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      setProducts(data.products || []);
      setTotalPages(data.pagination?.pages || 1);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [search, category, priceRange, size, sort, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setPriceRange({ min: 0, max: 999999 });
    setSize("");
    setSort("newest");
    setPage(1);
  };

  const hasActiveFilters = category || priceRange.max < 999999 || size;

  const FiltersContent = () => (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider">Category</h3>
        <div className="space-y-1">
          <button
            onClick={() => { setCategory(""); setPage(1); }}
            className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition ${
              !category ? "bg-ink text-white" : "hover:bg-black/5"
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => { setCategory(cat.name); setPage(1); }}
              className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                category === cat.name ? "bg-ink text-white" : "hover:bg-black/5"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider">Price Range</h3>
        <div className="space-y-1">
          <button
            onClick={() => { setPriceRange({ min: 0, max: 999999 }); setPage(1); }}
            className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition ${
              priceRange.max === 999999 && priceRange.min === 0
                ? "bg-ink text-white"
                : "hover:bg-black/5"
            }`}
          >
            All Prices
          </button>
          {priceRanges.map((range) => (
            <button
              key={range.label}
              onClick={() => { setPriceRange({ min: range.min, max: range.max }); setPage(1); }}
              className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                priceRange.min === range.min && priceRange.max === range.max
                  ? "bg-ink text-white"
                  : "hover:bg-black/5"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider">Size</h3>
        <div className="flex flex-wrap gap-2">
          {allSizes.map((s) => (
            <button
              key={s}
              onClick={() => { setSize(size === s ? "" : s); setPage(1); }}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                size === s
                  ? "border-ink bg-ink text-white"
                  : "border-black/15 hover:border-ink"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-serif text-4xl">Shop</h1>
        <p className="mt-2 text-black/55">
          Browse our complete collection across all categories.
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search products..."
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 pl-10 text-sm outline-none transition focus:border-ink"
          />
          <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileFilters(true)}
            className="flex items-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-medium lg:hidden"
          >
            <SlidersHorizontal size={16} /> Filters
          </button>
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="appearance-none rounded-xl border border-black/10 bg-white px-4 py-2.5 pr-8 text-sm font-medium outline-none"
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name A-Z</option>
              <option value="discount">Biggest Discount</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        <aside className="hidden w-64 shrink-0 lg:block">
          <FiltersContent />
        </aside>

        <div className="flex-1">
          {hasActiveFilters && (
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {category && (
                <span className="flex items-center gap-1 rounded-full bg-ink/5 px-3 py-1 text-xs font-medium">
                  {category}
                  <button onClick={() => setCategory("")}>
                    <X size={12} />
                  </button>
                </span>
              )}
              {size && (
                <span className="flex items-center gap-1 rounded-full bg-ink/5 px-3 py-1 text-xs font-medium">
                  Size: {size}
                  <button onClick={() => setSize("")}>
                    <X size={12} />
                  </button>
                </span>
              )}
              <button
                onClick={clearFilters}
                className="text-xs font-medium text-rose hover:underline"
              >
                Clear All
              </button>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-2xl bg-white p-12 text-center">
              <p className="text-lg font-medium">No products found</p>
              <p className="mt-2 text-sm text-black/45">
                Try adjusting your filters or search terms.
              </p>
              <button
                onClick={clearFilters}
                className="mt-4 rounded-full bg-ink px-6 py-2.5 text-sm font-semibold text-white"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                      className={`grid h-10 w-10 place-items-center rounded-xl text-sm font-medium transition ${
                        p === page ? "bg-ink text-white" : "border border-black/10 hover:bg-black/5"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <CustomRequestSection />

      {mobileFilters && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFilters(false)} />
          <div className="absolute inset-y-0 left-0 w-80 max-w-[85vw] bg-cream p-6 overflow-y-auto animate-slide-in">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-serif text-xl font-semibold">Filters</h2>
              <button onClick={() => setMobileFilters(false)}>
                <X size={22} />
              </button>
            </div>
            <FiltersContent />
            <button
              onClick={() => setMobileFilters(false)}
              className="mt-6 w-full rounded-full bg-ink py-3 text-sm font-semibold text-white"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-ink border-t-transparent mx-auto" />
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
