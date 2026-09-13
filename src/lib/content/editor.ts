import fs from "node:fs";
import path from "node:path";
import { ABOUT_CONTENT } from "@/lib/about";
import { getAllAchievementsForEditor } from "@/lib/content/achievements";
import { getAllCertificationsForEditor } from "@/lib/content/certifications";
import { getAllEducationForEditor } from "@/lib/content/education";
import { getAllExperienceForEditor } from "@/lib/content/experience";
import { getSourceProjectsForEditor } from "@/lib/content/projects";
import { getAllServicesForEditor } from "@/lib/content/services";
import { getAllSkillCategoriesForEditor } from "@/lib/content/skills";
import { SiteIdentitySchema, EditorSnapshotSchema, type EditorSnapshot } from "@/lib/schemas";
import { SITE_IDENTITY } from "@/lib/site";
import { SOCIAL_LINKS } from "@/lib/social";
import { ContentFileError } from "./fs-utils";
import { databaseConfigured } from "@/lib/db";
import { db } from "@/lib/db";
import { getDatabaseSnapshot, saveDatabaseSnapshot } from "./database";

export const DEFAULT_CONTACT_CONTENT = {
  heading: "Let's build something worth driving.",
  introduction: "Have a project in mind, or just want to talk shop? Send a message below — I read every one.",
  submitLabel: "Send Message",
};

export class DatabaseNotConfiguredError extends Error {}

export async function getContactContent() {
  if (databaseConfigured) return (await getDatabaseSnapshot()).contact;
  return DEFAULT_CONTACT_CONTENT;
}

export function getSourceEditorSnapshot(): EditorSnapshot {
  return EditorSnapshotSchema.parse({
    site: SiteIdentitySchema.parse({ ...SITE_IDENTITY }),
    about: ABOUT_CONTENT,
    contact: DEFAULT_CONTACT_CONTENT,
    socialLinks: SOCIAL_LINKS,
    projects: getSourceProjectsForEditor(),
    experience: getAllExperienceForEditor(),
    education: getAllEducationForEditor(),
    certifications: getAllCertificationsForEditor(),
    achievements: getAllAchievementsForEditor(),
    services: getAllServicesForEditor(),
    skills: getAllSkillCategoriesForEditor(),
  });
}

export async function getEditorSnapshot(): Promise<EditorSnapshot> {
  if (databaseConfigured) return getDatabaseSnapshot();
  return getSourceEditorSnapshot();
}

async function assertProjectReferences(snapshot: EditorSnapshot) {
  const databaseProjects = databaseConfigured ? await db.project.findMany({ select: { id: true, folderName: true } }) : [];
  const databaseAssets = databaseConfigured ? await db.projectAsset.findMany({ select: { projectId: true, path: true } }) : [];
  const sourceFolders = new Set(getSourceProjectsForEditor().map((project) => project.folderName));
  const contentRoot = path.join(process.cwd(), "content", "projects");

  for (const project of snapshot.projects) {
    const databaseProject = databaseProjects.find((item) => item.id === project.id && item.folderName === project.folderName);
    if (databaseConfigured && !databaseProject) {
      throw new ContentFileError(`Unknown project record "${project.folderName}".`);
    }
    if (!databaseConfigured && !sourceFolders.has(project.folderName)) {
      throw new ContentFileError(`Unknown project folder "${project.folderName}".`);
    }
    if (databaseConfigured) {
      const available = new Set(databaseAssets.filter((asset) => asset.projectId === project.id).map((asset) => asset.path));
      const references = [project.media.hero, project.media.thumbnail, ...project.media.gallery, ...project.files.map((file) => file.path), ...project.features.flatMap((feature) => feature.image ? [feature.image] : [])];
      for (const reference of references) if (!available.has(reference)) throw new ContentFileError(`Missing database asset for ${project.folderName}: ${reference}`);
      continue;
    }
    const projectRoot = path.resolve(contentRoot, project.folderName);
    if (!projectRoot.startsWith(path.resolve(contentRoot) + path.sep)) {
      throw new ContentFileError("Project folder must remain inside content/projects.");
    }

    const references = [
      ["media.hero", project.media.hero],
      ["media.thumbnail", project.media.thumbnail],
      ...project.media.gallery.map((value, index) => [`media.gallery[${index}]`, value]),
      ...project.files.map((file, index) => [`files[${index}].path`, file.path]),
      ...project.features.flatMap((feature, index) => feature.image ? [[`features[${index}].image`, feature.image]] : []),
    ];
    for (const [field, relativePath] of references) {
      const resolved = path.resolve(projectRoot, relativePath);
      if (!resolved.startsWith(projectRoot + path.sep) || !fs.existsSync(resolved)) {
        throw new ContentFileError(`Missing project file for ${project.folderName} → ${field}: ${relativePath}`);
      }
    }
  }
}

export async function saveEditorSnapshot(input: unknown): Promise<EditorSnapshot> {
  const parsed = EditorSnapshotSchema.safeParse(input);
  if (!parsed.success) throw parsed.error;
  await assertProjectReferences(parsed.data);
  if (!databaseConfigured) throw new DatabaseNotConfiguredError("Set DATABASE_URL and run npm run db:setup before saving editor content.");
  await saveDatabaseSnapshot(parsed.data);
  return parsed.data;
}
