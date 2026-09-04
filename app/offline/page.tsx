import Link from "next/link";
import { WifiOff, MessageCircle, Phone } from "lucide-react";
import { store } from "@/lib/store";

export const metadata = {
  title: "You're Offline",
};

export default function OfflinePage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-6 py-16 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-full bg-ink/5 text-ink">
        <WifiOff size={28} />
      </div>
      <h1 className="mt-6 font-serif text-3xl">You&apos;re Offline</h1>
      <p className="mt-3 text-sm leading-6 text-ink/65">
        It looks like you&apos;ve lost your connection. Check your network and try
        again — or reach us directly on WhatsApp or phone.
      </p>

      <div className="mt-8 flex w-full flex-col gap-3">
        <a
          href={`https://wa.me/${store.whatsapp}?text=${encodeURIComponent(
            "Hi AP Fashion Mart, I would like to place an order."
          )}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 rounded-full bg-whatsapp px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-whatsapp-deep"
        >
          <MessageCircle size={18} /> Message Us on WhatsApp
        </a>
        <a
          href={`tel:${store.phone.replace(/\s/g, "")}`}
          className="flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-ink/90"
        >
          <Phone size={18} /> Call {store.phone}
        </a>
        <Link
          href="/"
          className="mt-1 text-sm font-medium text-brand-dark hover:underline"
        >
          Try going back home
        </Link>
      </div>
    </div>
  );
}
