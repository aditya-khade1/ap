"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

interface ProductGalleryProps {
  images: string[];
  name: string;
}

export default function ProductGallery({ images, name }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  const allImages = images.length > 0 ? images : ["/placeholder.png"];

  const prev = () =>
    setSelectedIndex((i) => (i === 0 ? allImages.length - 1 : i - 1));
  const next = () =>
    setSelectedIndex((i) => (i === allImages.length - 1 ? 0 : i + 1));

  return (
    <div className="space-y-3">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-sand">
        <Image
          src={allImages[selectedIndex]}
          alt={`${name} - Image ${selectedIndex + 1}`}
          fill
          className={`object-cover transition-transform duration-300 ${
            zoomed ? "scale-150 cursor-zoom-out" : "cursor-zoom-in"
          }`}
          onClick={() => setZoomed(!zoomed)}
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
        {allImages.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-white/90 shadow-medium transition hover:bg-white"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-white/90 shadow-medium transition hover:bg-white"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setZoomed(!zoomed);
          }}
          className="absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 shadow-medium transition hover:bg-white"
        >
          <ZoomIn size={16} />
        </button>
        <div className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium shadow-medium">
          {selectedIndex + 1} / {allImages.length}
        </div>
      </div>

      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {allImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedIndex(i)}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                i === selectedIndex
                  ? "border-brand-dark"
                  : "border-transparent hover:border-ink/20"
              }`}
            >
              <Image
                src={img}
                alt={`${name} thumbnail ${i + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
