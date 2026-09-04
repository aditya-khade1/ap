import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";
import { IProduct } from "@/types";

interface ProductSectionProps {
  title: string;
  subtitle: string;
  products: IProduct[];
  viewAllHref?: string;
}

export default function ProductSection({
  title,
  subtitle,
  products,
  viewAllHref = "/shop",
}: ProductSectionProps) {
  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-dark">
            {subtitle}
          </p>
          <h2 className="mt-2 font-serif text-4xl">{title}</h2>
        </div>
        <Link
          href={viewAllHref}
          className="text-sm font-medium text-brand-dark transition hover:text-brand"
        >
          View All &rarr;
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 xl:grid-cols-4">
        {products.slice(0, 8).map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
}
