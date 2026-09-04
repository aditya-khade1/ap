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
                className="inline-flex min-h-[56px] items-center justify-center gap-3 rounded-full border border-white/20 bg-white/5 px-8 py-4 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/40 hover:bg-white/10 hover:scale-[1.02]"
              >
                <MapPin size={18} className="text-white/80" /> 
                Get Directions
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs uppercase tracking-widest text-white/60">
              <span className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-brand-tint" />{categories.length} core categories</span>
              <span className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-sky-tint" />WhatsApp ordering</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
