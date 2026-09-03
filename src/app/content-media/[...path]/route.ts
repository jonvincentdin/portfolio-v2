import fs from "node:fs";
import path from "node:path";
import { CONTENT_ROOT } from "@/lib/content";

/**
 * Serves image files from content/ (project hero/thumbnail/gallery images,
 * and later certification/achievement images) so they can be used with
 * next/image. content/ lives outside public/, which is the only directory
 * Next.js serves statically — this route is the deliberate bridge between
 * the two, restricted to image extensions only.
 *
 * Deliberately scoped to images only: downloadable project files (PDF, ZIP,
 * etc. under a project's files/ folder) are NOT served here — those go
 * through the dedicated, slug-validated download system in Milestone 06.
 * Serving them here would create a second, less deliberate access path to
 * the same files.
 *
 * Path-traversal defense: reject any segment containing ".." or a path
 * separator, then re-verify the fully resolved path is still inside
 * CONTENT_ROOT before touching the filesystem (defense in depth, same
 * principle as the project download API described in ARCHITECTURE.md).
 */

const IMAGE_MIME_TYPES: Record<string, string> = {
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".gif": "image/gif",
  ".avif": "image/avif",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await params;

  if (segments.some((segment) => segment.includes("..") || segment.includes("/") || segment.includes("\\"))) {
    return new Response("Not found", { status: 404 });
  }

  const resolvedRoot = path.resolve(CONTENT_ROOT);
  const resolvedPath = path.resolve(resolvedRoot, ...segments);

  if (!resolvedPath.startsWith(resolvedRoot + path.sep)) {
    return new Response("Not found", { status: 404 });
  }

  const ext = path.extname(resolvedPath).toLowerCase();
  const contentType = IMAGE_MIME_TYPES[ext];
  if (!contentType) {
    return new Response("Not found", { status: 404 });
  }

  if (!fs.existsSync(resolvedPath) || !fs.statSync(resolvedPath).isFile()) {
    return new Response("Not found", { status: 404 });
  }

  const fileBuffer = fs.readFileSync(resolvedPath);

  return new Response(new Uint8Array(fileBuffer), {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
