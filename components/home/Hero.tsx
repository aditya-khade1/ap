"use client";

import Link from "next/link";
import { ArrowRight, MapPin, Sparkles } from "lucide-react";
import { store, categories } from "@/lib/store";

export default function Hero() {
  return (
    <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-ink text-white">
      {/* Background Video */}
      <div className="absolute inset-0">
        <video
          src="/5561749-uhd_3840_2160_25fps.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover"
          aria-hidden="true"
        />
      </div>

      {/* Cinematic Overlay - Darker at top/bottom, completely clear center */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/90 via-transparent to-ink/90" />
      <div className="absolute inset-0 bg-black/20" />

      {/* Content Container */}
      <div className="relative z-10 mx-auto w-full max-w-4xl px-4 py-16 sm:px-6">
        <div className="flex flex-col items-center text-center">
          
          {/* Elegant Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/20 px-5 py-2.5 text-xs font-medium uppercase tracking-[0.25em] text-white/90 backdrop-blur-md">
            <Sparkles size={14} className="text-brand-tint" /> 
            <span>New season styles</span>
          </div>

          {/* Typography */}
          <h1 className="mx-auto max-w-4xl font-serif text-5xl leading-[1.05] sm:text-6xl lg:text-7xl drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
            <span className="text-white">Everyday fashion,</span>
            <br />
            <span className="bg-gradient-to-r from-sky-tint to-sky text-transparent bg-clip-text drop-shadow-[0_2px_8px_rgba(0,175,239,0.3)]">beautifully chosen.</span>
          </h1>
          
          <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg lg:text-xl font-light drop-shadow-md">
            Discover sarees, kids wear, jewellery, bangles and night suits — all
            in one trusted family fashion store.
          </p>

          {/* Actions */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
            <Link
              href="/#featured-picks"
              className="group inline-flex min-h-[56px] items-center justify-center gap-3 rounded-full bg-white px-8 py-4 text-sm font-semibold text-ink shadow-xl transition-all duration-300 hover:scale-[1.02] hover:bg-cream hover:shadow-2xl"
            >
              Shop Collection 
              <ArrowRight size={18} className="text-brand transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href={store.mapUrl}
              target="_blank"
              className="inline-flex min-h-[56px] items-center justify-center gap-3 rounded-full border border-white/20 bg-black/20 px-8 py-4 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:border-white/40 hover:bg-white/10 hover:scale-[1.02]"
            >
              <MapPin size={18} className="text-white/80" /> 
              Get Directions
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs uppercase tracking-widest text-white/80 drop-shadow-sm">
            <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-brand-tint" />{categories.length} core categories</span>
            <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-sky-tint" />WhatsApp ordering</span>
          </div>
        </div>
      </div>
    </section>
  );
}
