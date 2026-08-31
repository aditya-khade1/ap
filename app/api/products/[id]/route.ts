export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import {
  getProductByIdOrSlug,
  updateProduct,
  deleteProduct,
} from "@/lib/data/products";
import { isAdminSession, unauthorized } from "@/lib/require-admin";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = getProductByIdOrSlug(id);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminSession())) return unauthorized();

  try {
    const { id } = await params;
    const body = await request.json();

    const product = updateProduct(id, body);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminSession())) return unauthorized();

  try {
    const { id } = await params;
    const deleted = deleteProduct(id);

    if (!deleted) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Product deleted" });
  } catch {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}