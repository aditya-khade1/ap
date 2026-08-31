"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { categories } from "@/lib/store";
import ImageUploader from "@/components/admin/ImageUploader";
import { calculateDiscount } from "@/lib/utils";

export interface ProductFormData {
  name: string;
  slug: string;
  description: string;
  category: string;
  subcategory: string;
  price: number;
  originalPrice: number;
  discount: number;
  images: string[];
  sizes: string[];
  colors: string[];
  stock: number;
  sku: string;
  featured: boolean;
}

interface ProductFormProps {
  initialData?: Partial<ProductFormData>;
  submitLabel?: string;
  busyLabel?: string;
  onSubmit: (data: ProductFormData) => Promise<void>;
  onSuccess?: (productId: string) => void;
}

const inputClass =
  "w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm outline-none transition focus:border-ink";

const labelClass = "mb-1.5 block text-sm font-medium";

function splitTags(value: string): string[] {
  return value
    .split(/[,，\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function ProductForm({
  initialData = {},
  submitLabel = "Save Product",
  busyLabel = "Saving...",
  onSubmit,
  onSuccess,
}: ProductFormProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState(initialData.name || "");
  const [slug, setSlug] = useState(initialData.slug || "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initialData.slug));
  const [description, setDescription] = useState(initialData.description || "");
  const [category, setCategory] = useState(initialData.category || categories[0]?.name || "Sarees");
  const [subcategory, setSubcategory] = useState(initialData.subcategory || "");
  const [price, setPrice] = useState(initialData.price != null ? String(initialData.price) : "");
  const [originalPrice, setOriginalPrice] = useState(
    initialData.originalPrice != null ? String(initialData.originalPrice) : ""
  );
  const [images, setImages] = useState<string[]>(initialData.images || []);
  const [sizes, setSizes] = useState((initialData.sizes || []).join(", "));
  const [colors, setColors] = useState((initialData.colors || []).join(", "));
  const [stock, setStock] = useState(initialData.stock != null ? String(initialData.stock) : "");
  const [sku, setSku] = useState(initialData.sku || "");
  const [featured, setFeatured] = useState(Boolean(initialData.featured));

  const priceNum = Number(price) || 0;
  const originalNum = Number(originalPrice) || 0;
  const discount = calculateDiscount(originalNum, priceNum);
  const autoSlug = name.toLowerCase().replace(/[^\w]+/g, "-").replace(/^-+|-+$/g, "");

  const handleNameChange = (value: string) => {
    setName(value);
    if (!slugTouched) setSlug(value.toLowerCase().replace(/[^\w]+/g, "-").replace(/^-+|-+$/g, ""));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await onSubmit({
        name: name.trim(),
        slug: slug.trim() || autoSlug,
        description,
        category,
        subcategory: subcategory.trim(),
        price: priceNum,
        originalPrice: originalNum,
        discount,
        images,
        sizes: splitTags(sizes),
        colors: splitTags(colors),
        stock: Number(stock) || 0,
        sku: sku.trim(),
        featured,
      });
      onSuccess?.("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl">
      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="space-y-5 rounded-2xl bg-white p-5 shadow-soft sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelClass}>Product Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              required
              placeholder="e.g. Banarasi Silk Saree"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={inputClass}
            >
              {categories.map((cat) => (
                <option key={cat.slug} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass}>Subcategory</label>
            <input
              type="text"
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
              placeholder="e.g. Silk"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Price (₹) *</label>
            <input
              type="number"
              min="0"
              step="1"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              placeholder="999"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Original Price (₹)</label>
            <input
              type="number"
              min="0"
              step="1"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              placeholder="1299"
              className={inputClass}
            />
            {discount > 0 && (
              <p className="mt-1.5 text-xs font-semibold text-green-600">
                {discount}% discount will be shown
              </p>
            )}
          </div>

          <div>
            <label className={labelClass}>Stock (units) *</label>
            <input
              type="number"
              min="0"
              step="1"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
              placeholder="25"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>SKU</label>
            <input
              type="text"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              placeholder="e.g. SAR-0009"
              className={inputClass}
            />
          </div>

          <div className="sm:col-span-2">
            <label className={labelClass}>Sizes (comma separated)</label>
            <input
              type="text"
              value={sizes}
              onChange={(e) => setSizes(e.target.value)}
              placeholder="S, M, L, XL  or  Free Size"
              className={inputClass}
            />
          </div>

          <div className="sm:col-span-2">
            <label className={labelClass}>Colors (comma separated)</label>
            <input
              type="text"
              value={colors}
              onChange={(e) => setColors(e.target.value)}
              placeholder="Red, Maroon, Gold"
              className={inputClass}
            />
          </div>

          <div className="sm:col-span-2">
            <label className={labelClass}>Images</label>
            <ImageUploader value={images} onChange={setImages} />
          </div>

          <div className="sm:col-span-2">
            <label className={labelClass}>Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              placeholder="Describe the product..."
              className={inputClass}
            />
          </div>
        </div>

        <div className="border-t border-black/5 pt-4">
          <label className="flex max-w-xs items-center gap-2.5 rounded-xl border border-black/10 px-3.5 py-3 text-sm font-medium transition hover:border-ink">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="h-4 w-4 accent-ink"
            />
            Featured
          </label>
          <p className="mt-2 text-xs text-black/40">
            URL: <span className="font-mono">/{slug.trim() || autoSlug || "product-slug"}</span>
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          disabled={busy}
          className="rounded-full bg-ink px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-ink/90 disabled:opacity-50"
        >
          {busy ? busyLabel : submitLabel}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-full border border-black/15 px-8 py-3.5 text-sm font-semibold transition hover:border-ink"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}