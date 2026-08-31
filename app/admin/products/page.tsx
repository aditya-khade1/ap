"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Copy,
  Search,
  Star,
  Loader2,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { categories } from "@/lib/store";
import { IProduct } from "@/types";

const statusFilters = [
  { key: "", label: "All" },
  { key: "featured", label: "Featured" },
];

function Badge({ active, label }: { active: boolean; label: string }) {
  if (!active) return null;
  return (
    <span className="rounded-full bg-ink/5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-ink/70">
      {label}
    </span>
  );
}

function ProductActions({ product, onChanged }: { product: IProduct; onChanged: () => void }) {
  const [busy, setBusy] = useState(false);

  const toggle = async (field: "featured") => {
    setBusy(true);
    try {
      const res = await fetch(`/api/products/${product._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: !product[field] }),
      });
      if (res.ok) onChanged();
    } catch {
      alert("Failed to update product");
    } finally {
      setBusy(false);
    }
  };

  const duplicate = async () => {
    setBusy(true);
    try {
      const res = await fetch(`/api/products/${product._id}/duplicate`, { method: "POST" });
      if (!res.ok) throw new Error();
      onChanged();
    } catch {
      alert("Failed to duplicate product");
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/products/${product._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      onChanged();
    } catch {
      alert("Failed to delete product");
    } finally {
      setBusy(false);
    }
  };

  const toggleBtn = (field: "featured", Icon: typeof Star, title: string) => (
    <button
      onClick={() => toggle(field)}
      disabled={busy}
      title={title}
      className={`grid h-8 w-8 place-items-center rounded-lg transition ${
        product[field] ? "bg-amber-100 text-amber-600" : "text-black/30 hover:bg-black/5"
      }`}
    >
      <Icon size={16} fill={product[field] ? "currentColor" : "none"} />
    </button>
  );

  return (
    <div className="flex items-center justify-end gap-1">
      {toggleBtn("featured", Star, "Toggle Featured")}
      <Link
        href={`/product/${product.slug}`}
        className="grid h-8 w-8 place-items-center rounded-lg transition hover:bg-black/5"
        title="View on site"
      >
        <Eye size={16} />
      </Link>
      <Link
        href={`/admin/products/${product._id}/edit`}
        className="grid h-8 w-8 place-items-center rounded-lg transition hover:bg-black/5"
        title="Edit"
      >
        <Edit size={16} />
      </Link>
      <button
        onClick={duplicate}
        disabled={busy}
        className="grid h-8 w-8 place-items-center rounded-lg transition hover:bg-black/5 disabled:opacity-50"
        title="Duplicate"
      >
        <Copy size={16} />
      </button>
      <button
        onClick={remove}
        disabled={busy}
        className="grid h-8 w-8 place-items-center rounded-lg text-red-400 transition hover:bg-red-50 disabled:opacity-50"
        title="Delete"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");

  const fetchProducts = async (showLoader = true) => {
    if (showLoader) setLoading(true);
    try {
      const res = await fetch("/api/products?limit=200&sort=newest");
      const data = await res.json();
      setProducts(data.products || []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      if (q && !p.name.toLowerCase().includes(q) && !p.sku.toLowerCase().includes(q)) return false;
      if (category && p.category !== category) return false;
      if (status === "featured" && !p.featured) return false;
      return true;
    });
  }, [products, search, category, status]);

  const filterBar = (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/30" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products by name or SKU..."
          className="w-full rounded-xl border border-black/10 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-ink"
        />
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {statusFilters.map((f) => (
            <button
              key={f.key}
              onClick={() => setStatus(f.key)}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
                status === f.key
                  ? "border-ink bg-ink text-white"
                  : "border-black/10 bg-white text-ink/60 hover:border-ink"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-ink sm:w-auto"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.slug} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold">Products</h1>
          <p className="mt-1 text-sm text-black/50">
            {filtered.length} of {products.length} products
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-ink/90"
        >
          <Plus size={16} /> Add Product
        </Link>
      </div>

      <div className="mb-5">{filterBar}</div>

      {loading ? (
        <div className="grid min-h-[40vh] place-items-center">
          <Loader2 size={32} className="animate-spin text-ink/30" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center shadow-soft">
          <p className="text-base font-medium">No products found</p>
          <p className="mt-1.5 text-sm text-black/45">
            Try adjusting your search or filters, or add a new product.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-2xl bg-white shadow-soft md:block">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-black/5 bg-black/[0.02]">
                    <th className="px-4 py-3 text-left font-medium text-black/50">Product</th>
                    <th className="px-4 py-3 text-left font-medium text-black/50">Category</th>
                    <th className="px-4 py-3 text-left font-medium text-black/50">Price</th>
                    <th className="px-4 py-3 text-left font-medium text-black/50">Stock</th>
                    <th className="px-4 py-3 text-left font-medium text-black/50">Tags</th>
                    <th className="px-4 py-3 text-right font-medium text-black/50">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((product) => (
                    <tr key={product._id} className="border-b border-black/5">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-sand">
                            {product.images[0] && (
                              <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium line-clamp-1">{product.name}</div>
                            <div className="text-xs text-black/40">{product.sku}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-black/60">{product.category}</td>
                      <td className="px-4 py-3">
                        <span className="font-semibold">{formatPrice(product.price)}</span>
                        {product.originalPrice > product.price && (
                          <span className="ml-1 text-xs text-black/30 line-through">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`font-medium ${
                            product.stock > 10
                              ? "text-green-600"
                              : product.stock > 0
                                ? "text-amber-600"
                                : "text-red-500"
                          }`}
                        >
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          <Badge active={product.featured} label="Featured" />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <ProductActions product={product} onChanged={() => fetchProducts(false)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="grid gap-3 md:hidden">
            {filtered.map((product) => (
              <div key={product._id} className="rounded-2xl bg-white p-3 shadow-soft">
                <div className="flex gap-3">
                  <div className="h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-sand">
                    {product.images[0] && (
                      <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] uppercase tracking-wider text-black/40">
                      {product.category}
                    </div>
                    <div className="mt-0.5 truncate text-sm font-semibold">{product.name}</div>
                    <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm">
                      <span className="font-semibold">{formatPrice(product.price)}</span>
                      {product.originalPrice > product.price && (
                        <span className="text-xs text-black/30 line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                      <span
                        className={`text-xs font-medium ${
                          product.stock > 0 ? "text-green-600" : "text-red-500"
                        }`}
                      >
                        {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      <Badge active={product.featured} label="Featured" />
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-black/5 pt-3">
                  <ProductActions product={product} onChanged={() => fetchProducts(false)} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}