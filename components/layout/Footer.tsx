import Link from "next/link";
import { store, categories } from "@/lib/store";
import { Phone, MapPin, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-black/5 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center">
              {store.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={store.logo}
                  alt={store.name}
                  className="h-12 w-auto max-w-[220px] shrink-0 object-contain"
                />
              ) : (
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink text-sm font-bold text-white">
                  AP
                </div>
              )}
            </div>
            <p className="mt-4 text-sm leading-6 text-black/55">
              Your trusted family fashion store for sarees, kids wear, jewellery,
              bangles and night suits.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
              Categories
            </h3>
            <ul className="space-y-2.5">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="text-sm text-black/55 transition hover:text-rose"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/shop"
                  className="text-sm text-black/55 transition hover:text-rose"
                >
                  Shop All
                </Link>
              </li>
              <li>
                <a
                  href={`https://wa.me/${store.whatsapp}?text=${encodeURIComponent(
                    "Hi AP Fashion Mart! I'd like to place an order."
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-black/55 transition hover:text-rose"
                >
                  Order on WhatsApp
                </a>
              </li>
              <li>
                <Link
                  href={store.mapUrl}
                  className="text-sm text-black/55 transition hover:text-rose"
                >
                  Get Directions
                </Link>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="text-sm text-black/55 transition hover:text-rose"
                >
                  Admin
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={`tel:${store.phone.replace(/\s/g, "")}`}
                  aria-label={`Call ${store.phone}`}
                  className="flex items-center gap-2 text-sm text-black/55 transition hover:text-ink"
                >
                  <Phone size={15} /> {store.phone}
                </a>
              </li>
              <li>
                <a
                  href={store.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-sm text-black/55 transition hover:text-ink"
                >
                  <MapPin size={15} /> Get Directions
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${store.whatsapp}?text=${encodeURIComponent(
                    "Hi AP Fashion Mart!"
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-sm text-black/55 transition hover:text-ink"
                >
                  <MessageCircle size={15} /> WhatsApp Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-black/5 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom,0px))] text-center text-xs text-black/40">
          &copy; {new Date().getFullYear()} {store.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
