export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { duplicateProduct } from "@/lib/data/products";
import { isAdminSession, unauthorized } from "@/lib/require-admin";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminSession())) return unauthorized();

  try {
    const { id } = await params;
    const product = duplicateProduct(id);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to duplicate product" }, { status: 500 });
  }
}