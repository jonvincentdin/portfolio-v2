import { Readable } from "node:stream";
import { ZipArchive, type ArchiverError } from "archiver";
import { getProjectBySlug, getProjectDirectoryPath } from "@/lib/content/projects";

export const runtime = "nodejs";

/**
 * GET /api/projects/[slug]/download
 *
 * Streams the ENTIRE project folder as a ZIP (spec §62–§63) — not just the
 * files listed in `files[]`. The `slug` is validated against the closed set
 * from `getAllProjects()` (via `getProjectBySlug`) before any filesystem
 * access happens; this is the path-traversal defense described in
 * ARCHITECTURE.md — the filesystem path is never built from raw request
 * input, only from the trusted `folderName` on the matched project.
 *
 * `archiver` (v8's `ZipArchive` class) streams directly into the Response
 * body via `Readable.toWeb` rather than buffering the full archive in
 * memory, per spec §63's explicit warning against buffering large archives.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return new Response("Project not found", { status: 404 });
  }

  const projectDir = getProjectDirectoryPath(project.folderName);

  const archive = new ZipArchive({ zlib: { level: 9 } });
  archive.on("error", (error: ArchiverError) => {
    // Streams throw if an "error" event has no listener; log rather than
    // crash the process. The client will simply see a truncated/failed
    // download in this case.
    console.error(`ZIP archive error for project "${project.folderName}":`, error);
  });

  // Preserves the full folder structure under a top-level
  // <folderName>/ entry, exactly as spec §62 requires.
  archive.directory(projectDir, project.folderName);
  // finalize() resolves once all entries are queued, not once streaming is
  // complete — the stream itself is still consumed below as it's written.
  // Not awaited: it must run concurrently with the response body being
  // read, not before it.
  archive.finalize().catch((error: unknown) => {
    console.error(`ZIP finalize error for project "${project.folderName}":`, error);
  });

  const webStream = Readable.toWeb(archive) as ReadableStream<Uint8Array>;

  return new Response(webStream, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${project.folderName}.zip"`,
    },
  });
}
