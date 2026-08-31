export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import {
  queryProducts,
  createProduct,
  getProducts,
} from "@/lib/data/products";
import { isAdminSession, unauthorized } from "@/lib/require-admin";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const minPrice = parseInt(searchParams.get("minPrice") || "0");
    const maxPrice = parseInt(searchParams.get("maxPrice") || "999999");
    const size = searchParams.get("size") || "";
    const sort = searchParams.get("sort") || "newest";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const featuredStr = searchParams.get("featured") || "";

    const result = queryProducts({
      search,
      category,
      minPrice,
      maxPrice,
      size,
      sort,
      page,
      limit,
      featured: featuredStr === "true",
    });

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { products: [], pagination: { total: 0, page: 1, pages: 0, limit: 12 } },
      { status: 200 }
    );
  }
}

export async function POST(request: Request) {
  if (!(await isAdminSession())) return unauthorized();

  try {
    const body = await request.json();

    const existing = getProducts().find(
      (p) =>
        p.slug.toLowerCase() ===
        String(body.slug || body.name || "")
          .toLowerCase()
          .replace(/[^\w]+/g, "-")
          .replace(/^-+|-+$/g, "")
    );
    if (existing) {
      return NextResponse.json(
        { error: "A product with this name already exists" },
        { status: 409 }
      );
    }

    const product = createProduct(body);
    return NextResponse.json(product, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}