"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import ProductForm, { ProductFormData } from "@/components/admin/ProductForm";
import { useToast } from "@/hooks/useToast";

export default function NewProductPage() {
  const router = useRouter();
  const { addToast } = useToast();

  const handleSubmit = async (data: ProductFormData) => {
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to create product");
    }
    addToast("Product created successfully");
    router.push("/admin/products");
  };

  return (
    <div>
      <button
        onClick={() => router.push("/admin/products")}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-black/50 transition hover:text-ink"
      >
        <ArrowLeft size={16} /> Back to products
      </button>
      <h1 className="mb-8 font-serif text-3xl font-bold">Add New Product</h1>
      <ProductForm
        submitLabel="Create Product"
        busyLabel="Creating..."
        onSubmit={handleSubmit}
      />
    </div>
  );
}