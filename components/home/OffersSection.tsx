import Link from "next/link";
import { Tag, Percent } from "lucide-react";

export default function OffersSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-6 sm:grid-cols-2">
        <Link
          href="/category/sarees"
          className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose to-rose/80 p-8 text-white transition hover:shadow-medium sm:p-10"
        >
          <Tag size={28} className="mb-4 opacity-70" />
          <h3 className="font-serif text-3xl">Saree Festival Sale</h3>
          <p className="mt-2 max-w-xs text-sm text-white/80">
            Up to 40% off on our complete saree collection. Limited time offer.
          </p>
          <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold">
            Shop Now &rarr;
          </span>
        </Link>

        <Link
          href="/category/jewellery"
          className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-gold to-gold/80 p-8 text-white transition hover:shadow-medium sm:p-10"
        >
          <Percent size={28} className="mb-4 opacity-70" />
          <h3 className="font-serif text-3xl">Jewellery Special</h3>
          <p className="mt-2 max-w-xs text-sm text-white/80">
            Flat 30% off on necklace sets, earrings and bangles. Perfect for gifting.
          </p>
          <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold">
            Shop Now &rarr;
          </span>
        </Link>
      </div>
    </section>
  );
}
