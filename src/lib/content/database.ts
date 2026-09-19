import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";
import { EditorSnapshotSchema, SiteExperienceSchema, type EditorSnapshot, type EditorProject } from "@/lib/schemas";

const emptyCaseStudy = { overview: "", problem: "", objective: "", solution: "", challenges: "", results: "", lessons: "" };

type ProjectRow = Prisma.ProjectGetPayload<{ include: { links: true; features: true; assets: { include: { mediaAsset: true } } } }>;

function projectFromRow(row: ProjectRow): EditorProject {
  const hero = row.assets.find((asset) => asset.kind === "hero")?.path ?? "hero.webp";
  const thumbnail = row.assets.find((asset) => asset.kind === "thumbnail")?.path ?? hero;
  const gallery = row.assets.filter((asset) => asset.kind === "gallery").sort((a, b) => a.path.localeCompare(b.path)).map((asset) => asset.path);
  const files = row.assets.filter((asset) => asset.kind === "file").sort((a, b) => a.path.localeCompare(b.path)).map((asset) => ({ name: asset.name ?? asset.mediaAsset?.name ?? asset.path.split("/").pop() ?? "File", path: asset.path, type: (asset.type ?? asset.mediaAsset?.type ?? "other") as "other", description: asset.description || asset.mediaAsset?.description || "", access: (asset.access === "hidden" || asset.access === "visible" ? asset.access : "downloadable") as "downloadable" }));
  return EditorSnapshotSchema.shape.projects.element.parse({
    id: row.id, folderName: row.folderName, slug: row.slug, name: row.name, shortName: row.shortName,
    tagline: row.tagline, description: row.description, year: row.year, featured: row.featured,
    visible: row.visible, downloadable: row.downloadable, order: row.displayOrder, status: row.status,
    category: row.category, role: row.role, technologies: row.technologies,
    links: {
      live: row.links.find((link) => link.kind === "live")?.url ?? "",
      github: row.links.find((link) => link.kind === "github")?.url ?? "",
      additional: row.links.filter((link) => link.kind === "additional").sort((a, b) => a.order - b.order).map((link) => ({ label: link.label, url: link.url })),
    },
    media: { hero, thumbnail, gallery },
    caseStudy: typeof row.caseStudy === "object" && row.caseStudy !== null ? row.caseStudy : emptyCaseStudy,
    features: row.features.sort((a, b) => a.order - b.order).map((feature) => ({ title: feature.title, description: feature.description, ...(feature.imagePath ? { image: feature.imagePath } : {}) })),
    files,
  });
}

export async function getDatabaseSnapshot(): Promise<EditorSnapshot> {
  const [site, about, contact, socialLinks, projects, experience, education, certifications, achievements, services, skills] = await Promise.all([
    db.siteSettings.findUnique({ where: { id: "default" } }),
    db.aboutSettings.findUnique({ where: { id: "default" }, include: { paragraphs: true, principles: true } }),
    db.contactSettings.findUnique({ where: { id: "default" } }),
    db.socialLink.findMany({ orderBy: [{ order: "asc" }, { label: "asc" }] }),
    db.project.findMany({ include: { links: true, features: true, assets: { include: { mediaAsset: true } } }, orderBy: [{ displayOrder: "asc" }, { year: "desc" }] }),
    db.experience.findMany({ orderBy: [{ displayOrder: "asc" }, { startDate: "desc" }] }),
    db.education.findMany({ orderBy: [{ displayOrder: "asc" }, { endYear: "desc" }] }),
    db.certification.findMany({ orderBy: [{ displayOrder: "asc" }, { date: "desc" }] }),
    db.achievement.findMany({ orderBy: [{ displayOrder: "asc" }, { date: "desc" }] }),
    db.service.findMany({ orderBy: [{ displayOrder: "asc" }, { id: "asc" }] }),
    db.skillCategory.findMany({ include: { skills: { orderBy: { displayOrder: "asc" } } }, orderBy: [{ displayOrder: "asc" }, { category: "asc" }] }),
  ]);
  if (!site || !about || !contact) throw new Error("Database is connected but has not been seeded. Run npm run db:seed.");

  return EditorSnapshotSchema.parse({
    site: { name: site.name, role: site.role, supportingStatement: site.supportingStatement, introduction: site.introduction, location: site.location, specialization: site.specialization, status: site.status, contactEmail: site.contactEmail, siteUrl: site.siteUrl, viewProjectsLabel: site.viewProjectsLabel, contactLabel: site.contactLabel },
    about: { headline: about.headline, philosophy: about.paragraphs.sort((a, b) => a.order - b.order).map((paragraph) => paragraph.text), principles: about.principles.sort((a, b) => a.order - b.order).map((principle) => ({ title: principle.title, description: principle.description })) },
    contact: { heading: contact.heading, introduction: contact.introduction, submitLabel: contact.submitLabel },
    socialLinks: socialLinks.map((link) => ({ label: link.label, href: link.href, visible: link.visible })),
    projects: projects.map(projectFromRow),
    experience: experience.map((entry) => ({ id: entry.id, order: entry.displayOrder, visible: entry.visible, company: entry.company, position: entry.position, startDate: entry.startDate, ...(entry.endDate ? { endDate: entry.endDate } : {}), current: entry.current, location: entry.location, description: entry.description, responsibilities: entry.responsibilities, technologies: entry.technologies })),
    education: education.map((entry) => ({ id: entry.id, order: entry.displayOrder, visible: entry.visible, institution: entry.institution, program: entry.program, startYear: entry.startYear, endYear: entry.endYear, description: entry.description, achievements: entry.achievements })),
    certifications: certifications.map((entry) => ({ id: entry.id, order: entry.displayOrder, visible: entry.visible, title: entry.title, issuer: entry.issuer, date: entry.date, credentialId: entry.credentialId, credentialUrl: entry.credentialUrl, ...(entry.imagePath ? { image: entry.imagePath } : {}) })),
    achievements: achievements.map((entry) => ({ id: entry.id, order: entry.displayOrder, visible: entry.visible, title: entry.title, organization: entry.organization, date: entry.date, description: entry.description, ...(entry.imagePath ? { image: entry.imagePath } : {}) })),
    services: services.map((entry) => ({ id: entry.id, order: entry.displayOrder, visible: entry.visible, title: entry.title, description: entry.description, capabilities: entry.capabilities })),
    skills: skills.map((category) => ({ category: category.category, order: category.displayOrder, visible: category.visible, skills: category.skills.map((skill) => ({ name: skill.name, order: skill.displayOrder, ...(skill.level ? { level: skill.level as "Learning" } : {}), featured: skill.featured, visible: skill.visible })) })),
    siteExperience: SiteExperienceSchema.parse(site.siteExperience ?? {}),
  });
}

export async function saveDatabaseSnapshot(snapshot: EditorSnapshot) {
  await db.$transaction(async (tx) => {
    await tx.siteSettings.upsert({ where: { id: "default" }, update: { ...snapshot.site, siteExperience: snapshot.siteExperience }, create: { id: "default", ...snapshot.site, siteExperience: snapshot.siteExperience } });
    const about = await tx.aboutSettings.upsert({ where: { id: "default" }, update: { headline: snapshot.about.headline }, create: { id: "default", headline: snapshot.about.headline } });
    await tx.aboutParagraph.deleteMany({ where: { aboutId: about.id } });
    await tx.aboutPrinciple.deleteMany({ where: { aboutId: about.id } });
    await tx.aboutParagraph.createMany({ data: snapshot.about.philosophy.map((text, order) => ({ aboutId: about.id, text, order })) });
    await tx.aboutPrinciple.createMany({ data: snapshot.about.principles.map((principle, order) => ({ aboutId: about.id, ...principle, order })) });
    await tx.contactSettings.upsert({ where: { id: "default" }, update: snapshot.contact, create: { id: "default", ...snapshot.contact } });
    await tx.socialLink.deleteMany();
    await tx.socialLink.createMany({ data: snapshot.socialLinks.map((link, order) => ({ ...link, order })) });

    await tx.project.deleteMany({ where: { id: { notIn: snapshot.projects.map((project) => project.id) } } });

    for (const project of snapshot.projects) {
      const saved = await tx.project.upsert({ where: { id: project.id }, update: { folderName: project.folderName, slug: project.slug, name: project.name, shortName: project.shortName, tagline: project.tagline, description: project.description, year: project.year, featured: project.featured, visible: project.visible, downloadable: project.downloadable, displayOrder: project.order, status: project.status, category: project.category, role: project.role, technologies: project.technologies, caseStudy: project.caseStudy }, create: { id: project.id, folderName: project.folderName, slug: project.slug, name: project.name, shortName: project.shortName, tagline: project.tagline, description: project.description, year: project.year, featured: project.featured, visible: project.visible, downloadable: project.downloadable, displayOrder: project.order, status: project.status, category: project.category, role: project.role, technologies: project.technologies, caseStudy: project.caseStudy } });
      await tx.projectLink.deleteMany({ where: { projectId: saved.id } });
      await tx.projectFeature.deleteMany({ where: { projectId: saved.id } });
      await tx.projectLink.createMany({ data: [{ label: "View Live", url: project.links.live, kind: "live", order: 0 }, { label: "Source Code", url: project.links.github, kind: "github", order: 1 }, ...project.links.additional.map((link, order) => ({ ...link, kind: "additional", order }))].filter((link) => link.url) .map((link) => ({ ...link, projectId: saved.id })) });
      await tx.projectFeature.createMany({ data: project.features.map((feature, order) => ({ projectId: saved.id, order, title: feature.title, description: feature.description, imagePath: feature.image })) });
      for (const file of project.files) await tx.projectAsset.updateMany({ where: { projectId: saved.id, path: file.path, kind: "file" }, data: { name: file.name, type: file.type, description: file.description, access: file.access } });
    }
    await tx.experience.deleteMany(); await tx.experience.createMany({ data: snapshot.experience.map((entry) => ({ id: entry.id, displayOrder: entry.order, visible: entry.visible, company: entry.company, position: entry.position, startDate: entry.startDate, endDate: entry.endDate, current: entry.current, location: entry.location, description: entry.description, responsibilities: entry.responsibilities, technologies: entry.technologies })) });
    await tx.education.deleteMany(); await tx.education.createMany({ data: snapshot.education.map((entry) => ({ id: entry.id, displayOrder: entry.order, visible: entry.visible, institution: entry.institution, program: entry.program, startYear: entry.startYear, endYear: entry.endYear, description: entry.description, achievements: entry.achievements })) });
    await tx.certification.deleteMany(); await tx.certification.createMany({ data: snapshot.certifications.map((entry) => ({ id: entry.id, displayOrder: entry.order, visible: entry.visible, title: entry.title, issuer: entry.issuer, date: entry.date, credentialId: entry.credentialId, credentialUrl: entry.credentialUrl, imagePath: entry.image })) });
    await tx.achievement.deleteMany(); await tx.achievement.createMany({ data: snapshot.achievements.map((entry) => ({ id: entry.id, displayOrder: entry.order, visible: entry.visible, title: entry.title, organization: entry.organization, date: entry.date, description: entry.description, imagePath: entry.image })) });
    await tx.service.deleteMany(); await tx.service.createMany({ data: snapshot.services.map((entry) => ({ id: entry.id, displayOrder: entry.order, visible: entry.visible, title: entry.title, description: entry.description, capabilities: entry.capabilities })) });
    await tx.skillCategory.deleteMany();
    for (const category of snapshot.skills) { const savedCategory = await tx.skillCategory.create({ data: { id: category.category.toLowerCase().replace(/[^a-z0-9]+/g, "-"), category: category.category, displayOrder: category.order, visible: category.visible } }); await tx.skillItem.createMany({ data: category.skills.map((skill) => ({ categoryId: savedCategory.id, name: skill.name, displayOrder: skill.order, level: skill.level, featured: skill.featured, visible: skill.visible })) }); }
  });
}
