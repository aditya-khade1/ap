"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  MessageCircle,
  Minus,
  Plus,
  Check,
  Truck,
  Shield,
} from "lucide-react";
import ProductGallery from "@/components/product/ProductGallery";
import ProductCard from "@/components/product/ProductCard";
import { useToast } from "@/hooks/useToast";
import { buildWhatsAppOrderMessage, buildWhatsAppLink } from "@/lib/whatsapp";
import { formatPrice } from "@/lib/utils";
import { IProduct } from "@/types";

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { addToast } = useToast();

  const [product, setProduct] = useState<IProduct | null>(null);
  const [related, setRelated] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
          if (data.sizes?.length) setSelectedSize(data.sizes[0]);
          if (data.colors?.length) setSelectedColor(data.colors[0]);

          const relRes = await fetch(
            `/api/products?category=${encodeURIComponent(data.category)}&limit=4`
          );
          const relData = await relRes.json();
          setRelated(
            (relData.products || []).filter((p: IProduct) => p._id !== data._id).slice(0, 4)
          );
        }
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleOrderOnWhatsApp = () => {
    if (!product) return;
    const message = buildWhatsAppOrderMessage({
      customerName: "Customer",
      phone: "",
      address: "",
      pincode: "",
      items: [
        {
          name: `${product.name}${selectedSize ? ` (${selectedSize})` : ""}${
            selectedColor ? ` - ${selectedColor}` : ""
          }`,
          price: product.price,
          quantity,
        },
      ],
      total: product.price * quantity,
    });
    window.open(buildWhatsAppLink(message), "_blank", "noopener,noreferrer");
    addToast("WhatsApp opened — send your order!");
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="aspect-[4/5] animate-pulse rounded-2xl bg-ink/5" />
          <div className="space-y-4">
            <div className="h-4 w-20 animate-pulse rounded bg-ink/5" />
            <div className="h-8 w-3/4 animate-pulse rounded bg-ink/5" />
            <div className="h-6 w-32 animate-pulse rounded bg-ink/5" />
            <div className="h-20 w-full animate-pulse rounded bg-ink/5" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h1 className="font-serif text-4xl">Product Not Found</h1>
        <p className="mt-4 text-ink/65">
          The product you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-flex rounded-full bg-brand-dark px-6 py-3 text-sm font-semibold text-white"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  const discount =
    product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  const inStock = product.stock > 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-ink/50">
        <Link href="/" className="hover:text-ink">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/shop" className="hover:text-ink">Shop</Link>
        <span className="mx-2">/</span>
        <Link href={`/category/${product.category.toLowerCase().replace(/\s+/g, "-")}`} className="hover:text-ink">
          {product.category}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-12">
        <ProductGallery images={product.images} name={product.name} />

        <div className="flex flex-col">
          <div className="text-xs uppercase tracking-wider text-ink/50">
            {product.category}{product.subcategory ? ` / ${product.subcategory}` : ""}
          </div>
          <h1 className="mt-2 font-serif text-3xl sm:text-4xl">{product.name}</h1>

          <div className="mt-4 flex items-center gap-3">
            <span className="font-serif text-3xl font-bold">{formatPrice(product.price)}</span>
            {discount > 0 && (
              <>
                <span className="text-lg text-ink/45 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
                <span className="rounded-full bg-brand-tint px-3 py-1 text-sm font-semibold text-brand-dark">
                  {discount}% OFF
                </span>
              </>
            )}
          </div>

          <p className="mt-6 leading-7 text-ink/70">{product.description}</p>

          {/* Sizes */}
          {product.sizes.length > 0 && (
            <div className="mt-6">
              <h3 className="mb-3 text-sm font-semibold">Size</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`min-w-[3rem] rounded-xl border px-4 py-2 text-sm font-medium transition ${
                      selectedSize === s
                        ? "border-brand-dark bg-brand-dark text-white"
                        : "border-line hover:border-brand-dark"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Colors */}
          {product.colors.length > 0 && (
            <div className="mt-5">
              <h3 className="mb-3 text-sm font-semibold">
                Color{product.colors.length > 1 ? "s" : ""}: {selectedColor}
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
                      selectedColor === c
                        ? "border-brand-dark bg-brand-dark text-white"
                        : "border-line hover:border-brand-dark"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock Status */}
          <div className="mt-5">
            {inStock ? (
              <span className="flex items-center gap-1.5 text-sm text-success">
                <Check size={16} /> In Stock ({product.stock} available)
              </span>
            ) : (
              <span className="text-sm text-danger">Out of Stock</span>
            )}
          </div>

          {/* Quantity */}
          <div className="mt-6">
            <h3 className="mb-3 text-sm font-semibold">Quantity</h3>
            <div className="inline-flex items-center rounded-xl border border-line">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="grid h-11 w-11 place-items-center transition hover:bg-black/5"
              >
                <Minus size={16} />
              </button>
              <span className="w-12 text-center text-sm font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="grid h-11 w-11 place-items-center transition hover:bg-black/5"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col gap-3">
            <button
              onClick={handleOrderOnWhatsApp}
              disabled={!inStock}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-whatsapp px-6 py-4 text-sm font-semibold text-white transition hover:bg-whatsapp-deep disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <MessageCircle size={18} /> Order on WhatsApp
            </button>
              <span className="text-center text-xs text-success">
                Pay when your order arrives
              </span>
          </div>

          {/* Trust Badges */}
          <div className="mt-8 grid max-w-sm grid-cols-2 gap-4 border-t border-line pt-6">
            <div className="text-center">
              <Truck size={20} className="mx-auto text-brand-dark" />
              <div className="mt-2 text-xs font-medium">Fast Delivery</div>
            </div>
            <div className="text-center">
              <Shield size={20} className="mx-auto text-brand-dark" />
              <div className="mt-2 text-xs font-medium">Secure Payment</div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-serif text-3xl">You May Also Like</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
