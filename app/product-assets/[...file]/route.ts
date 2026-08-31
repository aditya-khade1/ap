import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

/**
 * Serves images that were uploaded by the admin into `public/product-assets`.
 * Added via a route handler (instead of relying on Next's static file server)
 * so that brand-new uploads are served immediately in both dev and `next start`
 * without restarting the server.
 */

const MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  avif: "image/avif",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ file: string[] }> }
) {
  try {
    const { file } = await params;
    const root = path.join(process.cwd(), "public", "product-assets");
    const rel = Array.isArray(file) ? file.join("/") : "";
    const filePath = path.resolve(root, rel);

    if (!filePath.startsWith(root + path.sep)) {
      return new NextResponse("Not found", { status: 404 });
    }

    if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
      return new NextResponse("Not found", { status: 404 });
    }

    const buf = fs.readFileSync(filePath);
    const ext = path.extname(filePath).slice(1).toLowerCase();
    const type = MIME[ext] || "application/octet-stream";

    return new NextResponse(new Uint8Array(buf), {
      headers: {
        "Content-Type": type,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}