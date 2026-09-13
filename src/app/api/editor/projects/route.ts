import crypto from "node:crypto";
import path from "node:path";
import { getOwnerSession } from "@/lib/auth";
import { databaseConfigured, db } from "@/lib/db";
import { ProjectSchema } from "@/lib/schemas";
import { readProjectUpload } from "@/lib/project-assets";

export const runtime = "nodejs";

function text(form: FormData, key: string) { return String(form.get(key) ?? "").trim(); }
function list(form: FormData, key: string) { return text(form, key).split(",").map((value) => value.trim()).filter(Boolean); }

export async function POST(request: Request) {
  if (!(await getOwnerSession())) return Response.json({ message: "Unauthorized" }, { status: 401 });
  if (!databaseConfigured) return Response.json({ message: "Set DATABASE_URL and run npm run db:setup before adding database content." }, { status: 503 });
  try {
    const form = await request.formData();
    const hero = form.get("hero"); const thumbnail = form.get("thumbnail");
    if (!(hero instanceof File) || !(thumbnail instanceof File)) return Response.json({ message: "Hero and thumbnail images are required." }, { status: 400 });
    const slug = text(form, "slug");
    const id = crypto.randomUUID();
    const folderName = `project-${slug}-${id.slice(0, 8)}`;
    const heroAsset = await readProjectUpload(hero, `media/hero-${id.slice(0, 8)}${path.extname(hero.name).toLowerCase() || ".bin"}`, "hero");
    const thumbnailAsset = await readProjectUpload(thumbnail, `media/thumbnail-${id.slice(0, 8)}${path.extname(thumbnail.name).toLowerCase() || ".bin"}`, "thumbnail");
    const project = ProjectSchema.parse({ id, folderName, slug, name: text(form, "name"), shortName: text(form, "shortName") || text(form, "name"), tagline: text(form, "tagline"), description: text(form, "description"), year: Number(text(form, "year")), order: Number(text(form, "order") || 0), status: text(form, "status") || "In Progress", category: list(form, "category"), role: list(form, "role"), technologies: list(form, "technologies"), media: { hero: heroAsset.path, thumbnail: thumbnailAsset.path, gallery: [] }, links: { live: "", github: "", additional: [] }, caseStudy: {}, features: [], files: [], featured: false, visible: true, downloadable: true });
    const saved = await db.$transaction(async (tx) => {
      const heroLibrary = await tx.mediaAsset.create({ data: { name: heroAsset.name, storageKey: `library/${id}/hero${path.extname(heroAsset.path).toLowerCase()}`, kind: "image", type: heroAsset.type, description: "", mimeType: heroAsset.mimeType, size: heroAsset.size, data: heroAsset.data } });
      const thumbnailLibrary = await tx.mediaAsset.create({ data: { name: thumbnailAsset.name, storageKey: `library/${id}/thumbnail${path.extname(thumbnailAsset.path).toLowerCase()}`, kind: "image", type: thumbnailAsset.type, description: "", mimeType: thumbnailAsset.mimeType, size: thumbnailAsset.size, data: thumbnailAsset.data } });
      return tx.project.create({ data: { id: project.id, folderName, slug: project.slug, name: project.name, shortName: project.shortName, tagline: project.tagline, description: project.description, year: project.year, featured: project.featured, visible: project.visible, downloadable: project.downloadable, displayOrder: project.order, status: project.status, category: project.category, role: project.role, technologies: project.technologies, caseStudy: project.caseStudy, assets: { create: [{ path: heroAsset.path, name: heroAsset.name, kind: "hero", type: heroAsset.type, description: "", mimeType: heroAsset.mimeType, size: heroAsset.size, data: null, mediaAssetId: heroLibrary.id }, { path: thumbnailAsset.path, name: thumbnailAsset.name, kind: "thumbnail", type: thumbnailAsset.type, description: "", mimeType: thumbnailAsset.mimeType, size: thumbnailAsset.size, data: null, mediaAssetId: thumbnailLibrary.id }] } } });
    });
    return Response.json({ ok: true, project: { ...project, folderName: saved.folderName } });
  } catch (error) { return Response.json({ message: error instanceof Error ? error.message : "Unable to create project." }, { status: 400 }); }
}
