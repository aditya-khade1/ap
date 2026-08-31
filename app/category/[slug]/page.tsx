"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import ProductCard from "@/components/product/ProductCard";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";
import CustomRequestSection from "@/components/home/CustomRequestSection";
import { categories } from "@/lib/store";
import { IProduct } from "@/types";

export default function CategoryPage() {
  const { slug } = useParams();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const category = categories.find((c) => c.slug === slug);

  const fetchProducts = useCallback(async () => {
    if (!category) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/products?category=${encodeURIComponent(category.name)}&limit=50`);
      const data = await res.json();
      setProducts(data.products || []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (!category) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h1 className="font-serif text-4xl">Category Not Found</h1>
        <p className="mt-4 text-black/55">The category you&apos;re looking for doesn&apos;t exist.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-rose">
          Category
        </p>
        <h1 className="mt-2 font-serif text-4xl">{category.name}</h1>
        <p className="mt-2 text-black/55">{category.description}</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center">
          <p className="text-lg font-medium">No products in this category yet</p>
          <p className="mt-2 text-sm text-black/45">
            Check back soon for new arrivals.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

      <CustomRequestSection />
    </div>
  );
}
