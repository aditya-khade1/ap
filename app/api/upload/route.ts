export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { isAdminSession, unauthorized } from "@/lib/require-admin";

const isServerless = process.env.VERCEL === "1" || process.env.NETLIFY === "true";

const ALLOWED_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

const MAX_SIZE_MB = 8;
const MAX_SIZE = MAX_SIZE_MB * 1024 * 1024;

export async function POST(request: Request) {
  if (!(await isAdminSession())) return unauthorized();

  if (isServerless) {
    return NextResponse.json(
      {
        error:
          "Image uploads are not supported on Vercel/Netlify (read-only filesystem). Use the seed images shipped with the store, or connect an external image host.",
      },
      { status: 501 }
    );
  }

  try {
    const formData = await request.formData();
    const files = formData
      .getAll("files")
      .filter((entry): entry is File => entry instanceof File);

    if (files.length === 0) {
      return NextResponse.json({ error: "No files selected" }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), "public", "product-assets");
    fs.mkdirSync(uploadDir, { recursive: true });

    const urls: string[] = [];

    for (const file of files) {
      if (!ALLOWED_MIME[file.type]) {
        return NextResponse.json(
          { error: `Unsupported file type: ${file.type || "unknown"}. Use JPG, PNG, WEBP, GIF or AVIF.` },
          { status: 400 }
        );
      }
      if (file.size > MAX_SIZE) {
        return NextResponse.json(
          { error: `"${file.name}" exceeds the ${MAX_SIZE_MB}MB limit` },
          { status: 400 }
        );
      }

      const bytes = Buffer.from(await file.arrayBuffer());
      const ext = ALLOWED_MIME[file.type];
      const filename = `product-${Date.now()}-${crypto.randomBytes(4).toString("hex")}.${ext}`;
      fs.writeFileSync(path.join(uploadDir, filename), bytes);
      urls.push(`/product-assets/${filename}`);
    }

    return NextResponse.json({ urls });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
