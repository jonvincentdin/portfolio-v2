import crypto from "node:crypto";
import path from "node:path";
import { getOwnerSession } from "@/lib/auth";
import { databaseConfigured, db } from "@/lib/db";
import { readProjectUpload } from "@/lib/project-assets";
import type { MediaLibraryAsset } from "@/lib/media-library";

export const runtime = "nodejs";

function toAsset(asset: { id: string; name: string; kind: string; type: string; mimeType: string; size: number; description: string; createdAt: Date; _count?: { projectAssets: number } }): MediaLibraryAsset {
  return {
    id: asset.id,
    name: asset.name,
    kind: asset.kind === "image" ? "image" : "file",
    type: asset.type,
    mimeType: asset.mimeType,
    size: asset.size,
    description: asset.description,
    createdAt: asset.createdAt.toISOString(),
    ...(asset.kind === "image" ? { url: `/content-media/library/${asset.id}` } : {}),
    ...(asset._count ? { usageCount: asset._count.projectAssets } : {}),
  };
}

export async function GET() {
  if (!(await getOwnerSession())) return Response.json({ message: "Unauthorized" }, { status: 401 });
  if (!databaseConfigured) return Response.json({ message: "Set DATABASE_URL and run npm run db:setup first." }, { status: 503 });
  const assets = await db.mediaAsset.findMany({ orderBy: { createdAt: "desc" }, include: { _count: { select: { projectAssets: true } } } });
  return Response.json({ assets: assets.map(toAsset) });
}

export async function POST(request: Request) {
  if (!(await getOwnerSession())) return Response.json({ message: "Unauthorized" }, { status: 401 });
  if (!databaseConfigured) return Response.json({ message: "Set DATABASE_URL and run npm run db:setup first." }, { status: 503 });
  try {
    const form = await request.formData();
    const file = form.get("file");
    const kind = String(form.get("kind") ?? "file");
    if (!(file instanceof File)) return Response.json({ message: "Choose a file." }, { status: 400 });
    if (kind !== "image" && kind !== "file") return Response.json({ message: "Choose image or file." }, { status: 400 });
    const extension = path.extname(file.name).toLowerCase() || ".bin";
    const upload = await readProjectUpload(file, `library/${crypto.randomUUID()}${extension}`, kind);
    const name = String(form.get("name") ?? "").trim() || upload.name;
    const description = String(form.get("description") ?? "").trim();
    const asset = await db.mediaAsset.create({ data: { name, storageKey: upload.path, kind, type: upload.type, description, mimeType: upload.mimeType, size: upload.size, data: upload.data } });
    return Response.json({ ok: true, asset: toAsset({ ...asset, _count: { projectAssets: 0 } }) });
  } catch (error) {
    return Response.json({ message: error instanceof Error ? error.message : "Unable to save library asset." }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  if (!(await getOwnerSession())) return Response.json({ message: "Unauthorized" }, { status: 401 });
  if (!databaseConfigured) return Response.json({ message: "Set DATABASE_URL and run npm run db:setup first." }, { status: 503 });
  try {
    const body = await request.json() as { id?: string };
    if (!body.id) return Response.json({ message: "Asset id is required." }, { status: 400 });
    const asset = await db.mediaAsset.findUnique({ where: { id: body.id }, include: { _count: { select: { projectAssets: true } } } });
    if (!asset) return Response.json({ message: "Library asset not found." }, { status: 404 });
    if (asset._count.projectAssets > 0) return Response.json({ message: "This asset is linked to a project. Remove the project link before deleting it." }, { status: 409 });
    await db.mediaAsset.delete({ where: { id: body.id } });
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ message: error instanceof Error ? error.message : "Unable to delete library asset." }, { status: 400 });
  }
}
