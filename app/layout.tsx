import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import ToastContainer from "@/components/ToastContainer";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import { AuthProvider } from "@/components/AuthProvider";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  applicationName: "AP Fashion Mart",
  title: {
    default: "AP Fashion Mart | Sarees, Kids Wear, Jewellery, Kurti & More",
    template: "%s | AP Fashion Mart",
  },
  description:
    "Shop sarees, kids wear, jewellery, bangles, night suits, kurtis and blouses at AP Fashion Mart. Trusted local fashion store with WhatsApp ordering and pay on delivery.",
  keywords: [
    "sarees",
    "kids wear",
    "jewellery",
    "bangles",
    "night suits",
    "kurti",
    "blouse",
    "hand bags",
    "fashion store",
    "Indian fashion",
    "AP Fashion Mart",
  ],
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "AP Fashion Mart",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "AP Fashion Mart | Sarees, Kids Wear, Jewellery, Kurti & More",
    description:
      "Discover sarees, kids wear, jewellery, bangles, kurtis, blouses and more. Shop online or visit our store.",
    url: APP_URL,
    siteName: "AP Fashion Mart",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AP Fashion Mart",
    description: "Sarees, Kids Wear, Jewellery, Bangles, Night Suits & Kurtis",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icons/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#EC268F",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <Navbar />
          <main className="flex-1 pb-[max(4.5rem,env(safe-area-inset-bottom,0px))] lg:pb-0">{children}</main>
          <Footer />
          <MobileBottomNav />
          <ToastContainer />
          <ServiceWorkerRegistration />
        </AuthProvider>
      </body>
    </html>
  );
}
