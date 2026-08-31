import { seedProducts } from "@/seed/products";
import { IProduct, ICategory } from "@/types";

/**
 * Persisted to a local JSON file at `data/products.json` when running
 * locally (`npm run dev` / `npm run start`). On Vercel and Netlify the
 * filesystem is read-only, so an in-memory store seeded from
 * `seed/products.ts` is used.
 *
 * Mutation functions (create / update / delete) still work on Vercel for the
 * lifetime of a single serverless instance, but changes do not persist across
 * cold starts. To add real persistence, replace the internals with a database.
 */

interface StoredProduct {
  _id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  subcategory?: string;
  price: number;
  originalPrice: number;
  discount: number;
  images: string[];
  sizes: string[];
  colors: string[];
  stock: number;
  sku: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

const isServerless = process.env.VERCEL === "1" || process.env.NETLIFY === "true";

// ---------------------------------------------------------------------------
// File-system helpers (local only)
// ---------------------------------------------------------------------------

let fsModule: typeof import("fs") | null = null;
let pathModule: typeof import("path") | null = null;
let dataFilePath: string | null = null;

function getFs() {
  if (!fsModule) {
    fsModule = require("fs");
    pathModule = require("path");
    dataFilePath = pathModule!.join(process.cwd(), "data", "products.json");
  }
  return { fs: fsModule!, dataFile: dataFilePath! };
}

function readFile(): StoredProduct[] {
  try {
    const { fs, dataFile } = getFs();
    const raw = fs.readFileSync(dataFile, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as StoredProduct[]) : [];
  } catch {
    return [];
  }
}

function writeFile(records: StoredProduct[]) {
  try {
    const { fs, dataFile } = getFs();
    fs.mkdirSync(require("path").dirname(dataFile), { recursive: true });
    fs.writeFileSync(dataFile, JSON.stringify(records, null, 2), "utf-8");
  } catch {
    // Vercel / read-only filesystem — silently skip
  }
}

function deleteFile() {
  try {
    const { fs, dataFile } = getFs();
    if (fs.existsSync(dataFile)) fs.unlinkSync(dataFile);
  } catch {
    // ignore
  }
}

// ---------------------------------------------------------------------------
// In-memory store (used on Vercel; also serves as the working copy locally)
// ---------------------------------------------------------------------------

let memoryStore: StoredProduct[] | null = null;

function seedMemory(): StoredProduct[] {
  const now = new Date().toISOString();
  memoryStore = seedProducts.map((p, i) => ({
    ...p,
    _id: String(i + 1),
    createdAt: now,
    updatedAt: now,
    featured: Boolean(p.featured),
  })) as unknown as StoredProduct[];
  return memoryStore;
}

function load(): StoredProduct[] {
  if (memoryStore) return memoryStore;

  if (isServerless) {
    return seedMemory();
  }

  // Local: try file first, fall back to seed
  const records = readFile();
  if (records.length > 0) {
    memoryStore = records;
    return memoryStore;
  }

  // File missing — seed and persist for next restart
  const seeded = seedMemory();
  writeFile(seeded);
  return seeded;
}

// Always persist writes to file when possible (no-op on serverless)
function persist(records: StoredProduct[]) {
  memoryStore = records;
  if (!isServerless) writeFile(records);
}

// ---------------------------------------------------------------------------
// Conversions
// ---------------------------------------------------------------------------

function toIProduct(record: StoredProduct): IProduct {
  return {
    ...record,
    createdAt: new Date(record.createdAt),
    updatedAt: new Date(record.updatedAt),
  };
}

function fromIProduct(product: IProduct): StoredProduct {
  return {
    ...product,
    createdAt:
      product.createdAt instanceof Date
        ? product.createdAt.toISOString()
        : String(product.createdAt),
    updatedAt:
      product.updatedAt instanceof Date
        ? product.updatedAt.toISOString()
        : String(product.updatedAt),
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function nextId(records: StoredProduct[]): string {
  const max = records.reduce((acc, r) => {
    const n = parseInt(r._id, 10);
    return isNaN(n) ? acc : Math.max(acc, n);
  }, 0);
  return String(max + 1);
}

function uniqueSlug(base: string, records: StoredProduct[]): string {
  const slug = (base || "product").toLowerCase().replace(/[^\w]+/g, "-").replace(/^-+|-+$/g, "");
  const exists = (s: string) => records.some((r) => r.slug === s);
  if (!exists(slug)) return slug;
  let i = 2;
  while (exists(`${slug}-${i}`)) i += 1;
  return `${slug}-${i}`;
}

function calculateDiscount(price: number, originalPrice: number): number {
  if (originalPrice > price && originalPrice > 0) {
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  }
  return 0;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function getProducts(): IProduct[] {
  return load().map(toIProduct);
}

export function getProductByIdOrSlug(idOrSlug: string): IProduct | null {
  const product = load().find((p) => p._id === idOrSlug || p.slug === idOrSlug) || null;
  return product ? toIProduct(product) : null;
}

export function getProductById(id: string): IProduct | null {
  const product = load().find((p) => p._id === id) || null;
  return product ? toIProduct(product) : null;
}

export function createProduct(data: Record<string, unknown>): IProduct {
  const records = load();

  const name = String(data.name || "Untitled").trim();
  const price = Number(data.price) || 0;
  const originalPrice = Number(data.originalPrice) || 0;

  const record: StoredProduct = {
    _id: nextId(records),
    name,
    slug: uniqueSlug(String(data.slug || ""), records),
    description: String(data.description || ""),
    category: String(data.category || "Sarees"),
    subcategory: data.subcategory ? String(data.subcategory) : undefined,
    price,
    originalPrice,
    discount:
      typeof data.discount === "number"
        ? data.discount
        : calculateDiscount(price, originalPrice),
    images: Array.isArray(data.images) ? data.images.map(String).filter(Boolean) : [],
    sizes: Array.isArray(data.sizes) ? data.sizes.map(String).filter(Boolean) : [],
    colors: Array.isArray(data.colors) ? data.colors.map(String).filter(Boolean) : [],
    stock: Number(data.stock) || 0,
    sku: String(data.sku || ""),
    featured: Boolean(data.featured),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  persist([record, ...records]);
  return toIProduct(record);
}

export function updateProduct(
  id: string,
  data: Partial<IProduct> & Record<string, unknown>
): IProduct | null {
  const records = load();
  const idx = records.findIndex((p) => p._id === id);
  if (idx === -1) return null;

  const current = records[idx];
  const merged: StoredProduct = {
    ...current,
    ...(data as Record<string, unknown>),
    _id: current._id,
  } as unknown as StoredProduct;

  if (data.slug) merged.slug = String(data.slug).toLowerCase().replace(/[^\w]+/g, "-");
  if (data.name !== undefined) merged.name = String(data.name).trim();
  if (data.subcategory !== undefined) {
    merged.subcategory = data.subcategory ? String(data.subcategory) : undefined;
  }

  const price = Number(data.price ?? merged.price) || 0;
  const originalPrice = Number(data.originalPrice ?? merged.originalPrice) || 0;
  if (data.price !== undefined || data.originalPrice !== undefined) {
    merged.price = price;
    merged.originalPrice = originalPrice;
    merged.discount =
      typeof data.discount === "number" ? data.discount : calculateDiscount(price, originalPrice);
  }

  merged.updatedAt = new Date().toISOString();
  const next = [...records];
  next[idx] = merged;
  persist(next);
  return toIProduct(merged);
}

export function deleteProduct(id: string): boolean {
  const records = load();
  const before = records.length;
  const next = records.filter((p) => p._id !== id);
  if (next.length === before) return false;
  persist(next);
  return true;
}

export function duplicateProduct(id: string): IProduct | null {
  const source = getProductById(id);
  if (!source) return null;
  const data = {
    name: source.name,
    slug: `${source.slug}-copy`,
    description: source.description,
    category: source.category,
    subcategory: source.subcategory,
    price: source.price,
    originalPrice: source.originalPrice,
    discount: source.discount,
    images: source.images,
    sizes: source.sizes,
    colors: source.colors,
    stock: source.stock,
    sku: source.sku ? `${source.sku}-C` : "",
    featured: source.featured,
  };
  return createProduct(data);
}

export function queryProducts(filter: {
  search?: string;
  category?: string;
  size?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  sort?: string;
  page?: number;
  limit?: number;
}) {
  const {
    search = "",
    category = "",
    size = "",
    minPrice = 0,
    maxPrice = 999999,
    featured,
    sort = "newest",
    page = 1,
    limit = 12,
  } = filter;

  let filtered = getProducts();

  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(s) ||
        (p.description || "").toLowerCase().includes(s) ||
        p.category.toLowerCase().includes(s) ||
        (p.subcategory || "").toLowerCase().includes(s) ||
        p.sku.toLowerCase().includes(s)
    );
  }
  if (category) filtered = filtered.filter((p) => p.category === category);
  if (size) filtered = filtered.filter((p) => (p.sizes || []).includes(size));
  if (featured) filtered = filtered.filter((p) => p.featured);
  filtered = filtered.filter((p) => p.price >= minPrice && p.price <= maxPrice);

  if (sort === "price-low") filtered.sort((a, b) => a.price - b.price);
  else if (sort === "price-high") filtered.sort((a, b) => b.price - a.price);
  else if (sort === "name") filtered.sort((a, b) => a.name.localeCompare(b.name));
  else if (sort === "discount")
    filtered.sort((a, b) => (b.discount || 0) - (a.discount || 0));
  else filtered.sort((a, b) => Number(b.createdAt) - Number(a.createdAt));

  const total = filtered.length;
  const skip = (page - 1) * limit;
  const result = filtered.slice(skip, skip + limit);

  return {
    products: result,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
      limit,
    },
  };
}

export function getCategories(): ICategory[] {
  return [];
}

export function resetProductsToSeed(): boolean {
  memoryStore = null;
  deleteFile();
  load();
  return true;
}
