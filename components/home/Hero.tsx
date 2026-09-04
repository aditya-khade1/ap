"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Sparkles } from "lucide-react";
import { store, categories } from "@/lib/store";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink text-white">
      <div className="absolute inset-0 opacity-15">
        <Image
          src="/images/saree-1.png"
          alt=""
          fill
          className="object-cover"
          priority
          aria-hidden
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-ink/95 via-ink/85 to-ink/95 md:bg-gradient-to-r md:from-ink/95 md:via-ink/85 md:to-ink/95" />

      <div className="relative mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20 lg:py-28">
        <div className="text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] uppercase tracking-[0.2em] sm:text-xs">
            <Sparkles size={14} /> New season styles
          </div>
          <h1 className="mx-auto max-w-2xl font-serif text-4xl leading-[1.05] sm:text-6xl lg:text-7xl">
            Everyday fashion,{" "}
            <span className="text-sky">beautifully chosen.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-white/75 sm:text-lg lg:text-xl">
            Discover sarees, kids wear, jewellery, bangles and night suits — all
            in one trusted family fashion store.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/#featured-picks"
              className="inline-flex min-h-[52px] items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-ink transition hover:bg-white/90"
            >
              Shop Collection <ArrowRight size={17} className="text-brand" />
            </Link>
            <Link
              href={store.mapUrl}
              target="_blank"
              className="inline-flex min-h-[52px] items-center gap-2 rounded-full border border-white/25 bg-white/5 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-white/15"
            >
              <MapPin size={17} /> Get Directions
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/55">
            <span>{categories.length} core categories</span>
            <span>&bull;</span>
            <span>WhatsApp ordering</span>
          </div>
        </div>
      </div>
    </section>
  );
}
