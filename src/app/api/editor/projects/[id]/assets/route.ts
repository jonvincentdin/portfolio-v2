import crypto from "node:crypto";
import path from "node:path";
import { getOwnerSession } from "@/lib/auth";
import { databaseConfigured, db } from "@/lib/db";
import { readProjectUpload } from "@/lib/project-assets";
import { RelativePathSchema } from "@/lib/schemas";

export const runtime = "nodejs";

const kinds = ["hero", "thumbnail", "gallery", "file", "asset"] as const;
type ProjectAssetKind = (typeof kinds)[number];

function safePath(value: string) {
  const parsed = RelativePathSchema.safeParse(value.replaceAll("\\", "/"));
  if (!parsed.success) throw new Error("Asset path must be relative and cannot contain '..'.");
  return parsed.data;
}

function automaticPath(kind: ProjectAssetKind, name: string) {
  const cleanName = name.replace(/[^a-zA-Z0-9._-]+/g, "-").toLowerCase() || "asset";
  return `${kind === "file" ? "files" : "media"}/${crypto.randomUUID().slice(0, 8)}-${cleanName}`;
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getOwnerSession())) return Response.json({ message: "Unauthorized" }, { status: 401 });
  if (!databaseConfigured) return Response.json({ message: "Set DATABASE_URL and run npm run db:setup first." }, { status: 503 });

  try {
    const { id } = await params;
    const form = await request.formData();
    const file = form.get("file");
    const libraryAssetId = String(form.get("libraryAssetId") ?? "").trim();
    const kind = String(form.get("kind") ?? "file") as ProjectAssetKind;
    const requestedPath = String(form.get("path") ?? "").trim();
    if (!kinds.includes(kind)) return Response.json({ message: "Unsupported asset type." }, { status: 400 });
    const project = await db.project.findUnique({ where: { id } });
    if (!project) return Response.json({ message: "Project not found." }, { status: 404 });

    let projectPath: string;
    let libraryAsset: { id: string; name: string; kind: string; type: string; mimeType: string; size: number; data: Uint8Array };
    if (libraryAssetId) {
      const found = await db.mediaAsset.findUnique({ where: { id: libraryAssetId } });
      if (!found) return Response.json({ message: "Library asset not found." }, { status: 404 });
      if (kind !== "file" && found.kind !== "image") return Response.json({ message: "Image slots can only use image library assets." }, { status: 400 });
      libraryAsset = found;
      projectPath = safePath(requestedPath || automaticPath(kind, found.name));
    } else {
      if (!(file instanceof File)) return Response.json({ message: "Choose a file or select a library asset." }, { status: 400 });
      projectPath = safePath(requestedPath || automaticPath(kind, file.name));
      const upload = await readProjectUpload(file, projectPath, kind);
      const libraryKind = ["hero", "thumbnail", "gallery"].includes(kind) ? "image" : "file";
      libraryAsset = { id: crypto.randomUUID(), name: upload.name, kind: libraryKind, type: upload.type, mimeType: upload.mimeType, size: upload.size, data: upload.data };
    }

    const saved = await db.$transaction(async (tx) => {
      if (kind === "hero" || kind === "thumbnail") await tx.projectAsset.deleteMany({ where: { projectId: id, kind } });
      if (!libraryAssetId) await tx.mediaAsset.create({ data: { id: libraryAsset.id, name: libraryAsset.name, storageKey: `library/${libraryAsset.id}${path.extname(projectPath).toLowerCase()}`, kind: libraryAsset.kind, type: libraryAsset.type, description: "", mimeType: libraryAsset.mimeType, size: libraryAsset.size, data: libraryAsset.data } });
      return tx.projectAsset.upsert({
        where: { projectId_path: { projectId: id, path: projectPath } },
        update: { mediaAssetId: libraryAsset.id, name: libraryAsset.name, kind, type: libraryAsset.type, description: "", mimeType: libraryAsset.mimeType, size: libraryAsset.size, data: null },
        create: { projectId: id, mediaAssetId: libraryAsset.id, path: projectPath, name: libraryAsset.name, kind, type: libraryAsset.type, description: "", mimeType: libraryAsset.mimeType, size: libraryAsset.size, data: null },
      });
    });
    return Response.json({ ok: true, asset: { path: saved.path, name: saved.name, kind: saved.kind, type: saved.type, description: saved.description, libraryAssetId: saved.mediaAssetId } });
  } catch (error) {
    return Response.json({ message: error instanceof Error ? error.message : "Unable to save project asset." }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getOwnerSession())) return Response.json({ message: "Unauthorized" }, { status: 401 });
  if (!databaseConfigured) return Response.json({ message: "Set DATABASE_URL and run npm run db:setup first." }, { status: 503 });
  try {
    const { id } = await params;
    const body = await request.json() as { path?: string };
    if (!body.path) return Response.json({ message: "Asset path is required." }, { status: 400 });
    const asset = await db.projectAsset.findUnique({ where: { projectId_path: { projectId: id, path: safePath(body.path) } } });
    if (!asset) return Response.json({ message: "Project asset not found." }, { status: 404 });
    if (asset.kind === "hero" || asset.kind === "thumbnail") return Response.json({ message: "Replace the cover image instead of removing it." }, { status: 409 });
    await db.$transaction(async (tx) => {
      await tx.projectAsset.delete({ where: { id: asset.id } });
      if (asset.mediaAssetId) {
        const usage = await tx.projectAsset.count({ where: { mediaAssetId: asset.mediaAssetId } });
        if (usage === 0) await tx.mediaAsset.delete({ where: { id: asset.mediaAssetId } });
      }
    });
    return Response.json({ ok: true });
  } catch (error) { return Response.json({ message: error instanceof Error ? error.message : "Unable to remove project asset." }, { status: 400 }); }
}
