"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import ProductForm, { ProductFormData } from "@/components/admin/ProductForm";
import { useToast } from "@/hooks/useToast";

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { addToast } = useToast();
  const [product, setProduct] = useState<Partial<ProductFormData> | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/products/${id}`)
      .then(async (r) => {
        if (!r.ok) {
          if (!cancelled) setNotFound(true);
          return null;
        }
        return r.json();
      })
      .then((p) => {
        if (!cancelled && p) setProduct(p);
      })
      .catch(() => {
        if (!cancelled) setNotFound(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleSubmit = async (data: ProductFormData) => {
    const res = await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to update product");
    }
    addToast("Product updated successfully");
    router.push("/admin/products");
  };

  if (loading) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <Loader2 size={32} className="animate-spin text-ink/30" />
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="rounded-2xl bg-white p-12 text-center shadow-soft">
        <h1 className="font-serif text-3xl font-bold">Product Not Found</h1>
        <p className="mt-2 text-sm text-black/45">
          This product may have been deleted.
        </p>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => router.push("/admin/products")}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-black/50 transition hover:text-ink"
      >
        <ArrowLeft size={16} /> Back to products
      </button>
      <h1 className="mb-8 font-serif text-3xl font-bold">Edit Product</h1>
      <ProductForm
        initialData={product}
        submitLabel="Save Changes"
        busyLabel="Saving..."
        onSubmit={handleSubmit}
      />
    </div>
  );
}