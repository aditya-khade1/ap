import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AP Fashion Mart",
    short_name: "AP Fashion",
    description:
      "Shop sarees, kids wear, jewellery, bangles, night suits, kurtis and blouses at AP Fashion Mart with WhatsApp ordering and pay on delivery.",
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    display_override: ["standalone", "minimal-ui"],
    orientation: "portrait",
    background_color: "#FAF6F1",
    theme_color: "#211A18",
    categories: ["shopping", "fashion", "lifestyle"],
    lang: "en",
    dir: "ltr",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
    ],
    shortcuts: [
      {
        name: "Shop All",
        short_name: "Shop",
        description: "Browse the full collection",
        url: "/shop",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Order on WhatsApp",
        short_name: "Order",
        description: "Place an order via WhatsApp",
        url: "/checkout",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
    ],
  };
}
