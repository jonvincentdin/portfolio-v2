import fs from "node:fs";
import path from "node:path";
import { db } from "../src/lib/db";
import { getSourceEditorSnapshot } from "../src/lib/content/editor";

const CONTENT_ROOT = path.join(process.cwd(), "content");

function walkFiles(directory: string): string[] {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(directory, entry.name);
    return entry.isDirectory() ? walkFiles(absolute) : [absolute];
  });
}

function mimeFor(filePath: string) {
  const extension = path.extname(filePath).toLowerCase();
  return ({ ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".svg": "image/svg+xml", ".pdf": "application/pdf", ".txt": "text/plain", ".json": "application/json" } as Record<string, string>)[extension] ?? "application/octet-stream";
}

function fileType(filePath: string) {
  const extension = path.extname(filePath).toLowerCase().replace(".", "");
  return ["pdf", "doc", "docx", "ppt", "pptx", "xls", "xlsx", "zip", "rar", "txt", "csv", "json", "png", "jpg", "webp", "svg", "mp4", "mov", "fig", "sketch"].includes(extension) ? extension : "other";
}

async function main() {
  const snapshot = getSourceEditorSnapshot();
  await db.$transaction(async (tx) => {
    await tx.profileImage.deleteMany();
    await tx.projectAsset.deleteMany(); await tx.mediaAsset.deleteMany(); await tx.projectLink.deleteMany(); await tx.projectFeature.deleteMany(); await tx.project.deleteMany();
    await tx.socialLink.deleteMany(); await tx.contactSettings.deleteMany(); await tx.aboutParagraph.deleteMany(); await tx.aboutPrinciple.deleteMany(); await tx.aboutSettings.deleteMany(); await tx.siteSettings.deleteMany();
    await tx.contactSubmission.deleteMany();
    await tx.experience.deleteMany(); await tx.education.deleteMany(); await tx.certification.deleteMany(); await tx.achievement.deleteMany(); await tx.service.deleteMany(); await tx.skillItem.deleteMany(); await tx.skillCategory.deleteMany();

    await tx.siteSettings.create({ data: { id: "default", ...snapshot.site, siteExperience: snapshot.siteExperience } });
    const about = await tx.aboutSettings.create({ data: { id: "default", headline: snapshot.about.headline } });
    await tx.aboutParagraph.createMany({ data: snapshot.about.philosophy.map((text, order) => ({ aboutId: about.id, text, order })) });
    await tx.aboutPrinciple.createMany({ data: snapshot.about.principles.map((principle, order) => ({ aboutId: about.id, ...principle, order })) });
    await tx.contactSettings.create({ data: { id: "default", ...snapshot.contact } });
    await tx.socialLink.createMany({ data: snapshot.socialLinks.map((link, order) => ({ ...link, order })) });

    for (const project of snapshot.projects) {
      await tx.project.create({ data: { id: project.id, folderName: project.folderName, slug: project.slug, name: project.name, shortName: project.shortName, tagline: project.tagline, description: project.description, year: project.year, featured: project.featured, visible: project.visible, downloadable: project.downloadable, displayOrder: project.order, status: project.status, category: project.category, role: project.role, technologies: project.technologies, caseStudy: project.caseStudy } });
      await tx.projectLink.createMany({ data: [{ label: "View Live", url: project.links.live, kind: "live", order: 0 }, { label: "Source Code", url: project.links.github, kind: "github", order: 1 }, ...project.links.additional.map((link, order) => ({ ...link, kind: "additional", order }))].filter((link) => link.url).map((link) => ({ ...link, projectId: project.id })) });
      await tx.projectFeature.createMany({ data: project.features.map((feature, order) => ({ projectId: project.id, order, title: feature.title, description: feature.description, imagePath: feature.image })) });
      const projectRoot = path.join(CONTENT_ROOT, "projects", project.folderName);
      const filePaths = new Set(project.files.map((file) => file.path));
      const assetRows = walkFiles(projectRoot).map((absolute) => {
        const relative = path.relative(projectRoot, absolute).split(path.sep).join("/");
        const kind = relative === project.media.hero ? "hero" : relative === project.media.thumbnail ? "thumbnail" : project.media.gallery.includes(relative) ? "gallery" : filePaths.has(relative) ? "file" : "asset";
        const listed = project.files.find((file) => file.path === relative);
        const data = fs.readFileSync(absolute);
        return { projectId: project.id, path: relative, name: listed?.name ?? path.basename(relative), kind, type: listed?.type ?? fileType(relative), description: listed?.description ?? "", mimeType: mimeFor(relative), size: data.byteLength, data };
      });
      for (const asset of assetRows) {
        const library = await tx.mediaAsset.create({ data: { name: asset.name, storageKey: `library/seed/${asset.projectId}/${asset.path}`, kind: ["hero", "thumbnail", "gallery"].includes(asset.kind) ? "image" : "file", type: asset.type, description: asset.description, mimeType: asset.mimeType, size: asset.size, data: asset.data } });
        await tx.projectAsset.create({ data: { projectId: asset.projectId, mediaAssetId: library.id, path: asset.path, name: asset.name, kind: asset.kind, type: asset.type, description: asset.description, mimeType: asset.mimeType, size: asset.size, data: null } });
      }
    }

    await tx.experience.createMany({ data: snapshot.experience.map((entry) => ({ id: entry.id, displayOrder: entry.order, visible: entry.visible, company: entry.company, position: entry.position, startDate: entry.startDate, endDate: entry.endDate, current: entry.current, location: entry.location, description: entry.description, responsibilities: entry.responsibilities, technologies: entry.technologies })) });
    await tx.education.createMany({ data: snapshot.education.map((entry) => ({ id: entry.id, displayOrder: entry.order, visible: entry.visible, institution: entry.institution, program: entry.program, startYear: entry.startYear, endYear: entry.endYear, description: entry.description, achievements: entry.achievements })) });
    await tx.certification.createMany({ data: snapshot.certifications.map((entry) => ({ id: entry.id, displayOrder: entry.order, visible: entry.visible, title: entry.title, issuer: entry.issuer, date: entry.date, credentialId: entry.credentialId, credentialUrl: entry.credentialUrl, imagePath: entry.image })) });
    await tx.achievement.createMany({ data: snapshot.achievements.map((entry) => ({ id: entry.id, displayOrder: entry.order, visible: entry.visible, title: entry.title, organization: entry.organization, date: entry.date, description: entry.description, imagePath: entry.image })) });
    await tx.service.createMany({ data: snapshot.services.map((entry) => ({ id: entry.id, displayOrder: entry.order, visible: entry.visible, title: entry.title, description: entry.description, capabilities: entry.capabilities })) });
    for (const category of snapshot.skills) { const id = category.category.toLowerCase().replace(/[^a-z0-9]+/g, "-"); await tx.skillCategory.create({ data: { id, category: category.category, displayOrder: category.order, visible: category.visible, skills: { create: category.skills.map((skill) => ({ name: skill.name, displayOrder: skill.order, level: skill.level, featured: skill.featured, visible: skill.visible })) } } }); }
  }, { maxWait: 30000, timeout: 120000 });
  console.log(`Seeded ${snapshot.projects.length} projects and all portfolio collections.`);
}

main().catch((error) => { console.error(error); process.exit(1); }).finally(() => db.$disconnect());
