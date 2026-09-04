"use client";

import Image from "next/image";
import Link from "next/link";
import { MessageCircle, ShoppingBag } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/store";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { formatPrice } from "@/lib/utils";
import { IProduct } from "@/types";

function buildOrderMessage(product: IProduct): string {
  return [
    "Hello AP Fashion Mart,",
    "",
    "I would like to order:",
    `${product.name}`,
    `Price: ₹${product.price.toLocaleString("en-IN")}`,
    "",
    "Please confirm availability and delivery details.",
  ].join("\n");
}

export default function ProductCard({ product }: { product: IProduct }) {
  const discount =
    product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) * 100
        )
      : 0;

  const enquireUrl = getWhatsAppUrl(product.name, product.price);
  const orderUrl = buildWhatsAppLink(buildOrderMessage(product));

  return (
    <article className="group overflow-hidden rounded-2xl bg-white shadow-soft transition hover:shadow-medium">
      <Link href={`/product/${product.slug}`}>
        <div className="relative aspect-[4/5] overflow-hidden bg-sand">
          {product.images[0] && (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          )}
          {discount > 0 && (
            <span className="absolute left-3 top-3 rounded-full bg-brand-dark px-2.5 py-1 text-[11px] font-bold text-white">
              {discount}% OFF
            </span>
          )}
        </div>
      </Link>
      <div className="p-3 sm:p-4">
        <div className="text-[11px] uppercase tracking-wider text-ink/50">
          {product.category}
        </div>
        <Link href={`/product/${product.slug}`}>
          <h3 className="mt-1 text-sm font-medium line-clamp-1 transition hover:text-brand-dark">
            {product.name}
          </h3>
        </Link>
        <div className="mt-2 flex items-end gap-2">
          <span className="text-lg font-semibold">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-sm text-ink/45 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
        <div className="mt-3 space-y-2">
          <a
            href={orderUrl}
            target="_blank"
            rel="noreferrer"
            className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl bg-whatsapp px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-whatsapp-deep"
          >
            <ShoppingBag size={15} /> Order on WhatsApp
          </a>
          <a
            href={enquireUrl}
            target="_blank"
            rel="noreferrer"
            className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border border-line bg-white px-3 py-2.5 text-xs font-semibold text-ink transition hover:border-brand-dark"
          >
            <MessageCircle size={15} /> Enquire
          </a>
        </div>
      </div>
    </article>
  );
}
