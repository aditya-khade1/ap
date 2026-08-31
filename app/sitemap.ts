import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/data/products";

export const dynamic = "force-dynamic";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const categories = [
    "sarees",
    "kids-wear",
    "jewellery",
    "bangles",
    "night-suit",
    "kurti",
    "blouse",
    "hand-bags",
    "ladies-innerwear",
  ];

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1 },
    { url: `${baseUrl}/shop`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${baseUrl}/auth/login`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.3 },
  ];

  const categoryPages = categories.map((slug) => ({
    url: `${baseUrl}/category/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const productPages = getProducts().map((p) => ({
    url: `${baseUrl}/product/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...categoryPages, ...productPages];
}