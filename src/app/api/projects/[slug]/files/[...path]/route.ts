import fs from "node:fs";
import path from "node:path";
import { getProjectBySlug, getProjectDirectoryPath } from "@/lib/content/projects";

export const runtime = "nodejs";

/**
 * GET /api/projects/[slug]/files/[...path]
 *
 * Serves a single downloadable project file (spec §61's "DOWNLOAD" action
 * per file row). Two layers of validation before touching disk:
 *
 * 1. `slug` is checked against the closed set from `getAllProjects()` —
 *    same pattern as the ZIP download route.
 * 2. The requested relative path must exactly match one of the project's
 *    own `files[].path` entries. This is stricter than plain path-traversal
 *    prevention: it restricts downloads to files the project author
 *    explicitly listed as downloadable, not merely to files that happen to
 *    live inside the project folder (e.g. hero.webp is in the folder but
 *    was never meant to be "downloaded" as a file).
 *
 * A resolved-path containment check is kept as defense in depth even
 * though the whitelist above already makes traversal impossible with a
 * valid `files[]` entry.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string; path: string[] }> },
) {
  const { slug, path: segments } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return new Response("Project not found", { status: 404 });
  }

  const requestedPath = segments.join("/");
  const fileEntry = project.files.find((file) => file.path === requestedPath);

  if (!fileEntry) {
    return new Response("File not found", { status: 404 });
  }

  const projectDir = getProjectDirectoryPath(project.folderName);
  const resolvedRoot = path.resolve(projectDir);
  const resolvedPath = path.resolve(projectDir, fileEntry.path);

  if (!resolvedPath.startsWith(resolvedRoot + path.sep)) {
    return new Response("File not found", { status: 404 });
  }

  if (!fs.existsSync(resolvedPath) || !fs.statSync(resolvedPath).isFile()) {
    return new Response("File not found", { status: 404 });
  }

  const fileBuffer = fs.readFileSync(resolvedPath);
  const filename = path.basename(resolvedPath);

  return new Response(new Uint8Array(fileBuffer), {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": String(fileBuffer.byteLength),
    },
  });
}
