"use client";

import { useRef, useState } from "react";
import { X, ImagePlus, Star, Loader2, Link2 } from "lucide-react";

interface ImageUploaderProps {
  value: string[];
  onChange: (urls: string[]) => void;
}

const inputClass =
  "w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-ink";

export default function ImageUploader({ value, onChange }: ImageUploaderProps) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [newUrl, setNewUrl] = useState("");

  const addUrls = (urls: string[]) => {
    onChange([...value.filter((u) => !urls.includes(u)), ...urls]);
  };

  const removeImage = (url: string) => {
    onChange(value.filter((u) => u !== url));
  };

  const setCover = (url: string) => {
    onChange([url, ...value.filter((u) => u !== url)]);
  };

  const handleUpload = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      Array.from(files).forEach((f) => formData.append("files", f));
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      addUrls(data.urls || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  };

  const handleAddUrl = () => {
    const url = newUrl.trim();
    if (!url) return;
    let normalized = url;
    if (!url.startsWith("/") && !url.startsWith("http")) {
      normalized = `/product-assets/${url}`;
    }
    addUrls([normalized]);
    setNewUrl("");
  };

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-4">
        {value.map((url, i) => (
          <div
            key={`${url}-${i}`}
            className="group relative aspect-[4/5] overflow-hidden rounded-xl border border-black/10 bg-sand"
          >
            <img src={url} alt={`Product image ${i + 1}`} className="h-full w-full object-cover" />
            {i === 0 && (
              <span className="absolute left-2 top-2 rounded-full bg-ink px-2 py-0.5 text-[10px] font-bold text-white">
                Cover
              </span>
            )}
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1 bg-black/45 p-1.5 opacity-0 transition group-hover:opacity-100">
              {i !== 0 && (
                <button
                  type="button"
                  onClick={() => setCover(url)}
                  title="Set as cover"
                  className="grid h-8 w-8 place-items-center rounded-lg bg-white/90 text-black transition hover:bg-white"
                >
                  <Star size={14} />
                </button>
              )}
              <button
                type="button"
                onClick={() => removeImage(url)}
                title="Remove"
                className="grid h-8 w-8 place-items-center rounded-lg bg-white/90 text-red-500 transition hover:bg-white"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-start">
        <button
          type="button"
          onClick={() => fileInput.current?.click()}
          disabled={uploading}
          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-dashed border-black/20 px-4 py-2.5 text-sm font-medium transition hover:border-ink disabled:opacity-50"
        >
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={16} />}
          {uploading ? "Uploading..." : "Upload from computer"}
        </button>
        <input
          ref={fileInput}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
          multiple
          className="hidden"
          onChange={(e) => handleUpload(e.target.files)}
        />
        <div className="flex flex-1 items-center gap-2">
          <Link2 size={16} className="shrink-0 text-black/30" />
          <input
            type="text"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddUrl();
              }
            }}
            placeholder="Or paste an image URL..."
            className={inputClass}
          />
          <button
            type="button"
            onClick={handleAddUrl}
            className="shrink-0 rounded-xl border border-black/10 px-4 py-2.5 text-sm font-medium hover:border-ink"
          >
            Add
          </button>
        </div>
      </div>

      {error && <p className="mt-2 text-xs font-medium text-red-500">{error}</p>}
      <p className="mt-2 text-xs text-black/40">
        Images are saved to <span className="font-medium">public/product-assets</span>. JPG,
        PNG, WEBP, GIF or AVIF, max 8MB each.
      </p>
    </div>
  );
}