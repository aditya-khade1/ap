import Image from "next/image";
import Link from "next/link";
import { categories } from "@/lib/store";

export default function FeaturedCategories() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-dark">
            Shop by category
          </p>
          <h2 className="mt-2 font-serif text-4xl">Something for everyone</h2>
        </div>
        <p className="max-w-md text-sm leading-6 text-ink/60">
          A curated mix for celebrations, everyday dressing, children and finishing touches.
        </p>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-5">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/category/${category.slug}`}
            className="group overflow-hidden rounded-2xl bg-white shadow-soft transition hover:shadow-medium"
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
              <div className="absolute inset-x-2 bottom-2 sm:inset-x-4 sm:bottom-4 text-white">
                <div className="font-serif text-sm sm:text-xl">{category.name}</div>
                <div className="mt-0.5 hidden text-xs text-white/75 sm:block">{category.description}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
