import { z } from "zod";
import { RelativePathSchema, SlugSchema, OptionalLinkSchema } from "./common";

/**
 * Project schema — the core content type. See CONTENT_SYSTEM.md §Project and
 * spec §18 for the source schema this implements.
 *
 * All media/file paths are RELATIVE to the project's own folder
 * (content/projects/NNN-slug/) and are existence-checked by the loader,
 * not by this schema — Zod validates shape, the loader validates that the
 * filesystem backs it up (spec §66).
 */

export const ProjectStatusSchema = z.enum(["Active", "Production", "Archived", "In Progress"]);

const ProjectFileSchema = z.object({
  name: z.string().min(1),
  path: RelativePathSchema,
  type: z.enum([
    "pdf",
    "doc",
    "docx",
    "ppt",
    "pptx",
    "xls",
    "xlsx",
    "zip",
    "rar",
    "txt",
    "csv",
    "json",
    "png",
    "jpg",
    "webp",
    "svg",
    "mp4",
    "mov",
    "fig",
    "sketch",
    "archive",
    "presentation",
    "other",
  ]),
  description: z.string().default(""),
});

const ProjectFeatureSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  image: RelativePathSchema.optional(),
});

const ProjectMediaSchema = z.object({
  hero: RelativePathSchema,
  thumbnail: RelativePathSchema,
  gallery: z.array(RelativePathSchema).default([]),
});

const ProjectCaseStudySchema = z.object({
  overview: z.string().default(""),
  problem: z.string().default(""),
  objective: z.string().default(""),
  solution: z.string().default(""),
  challenges: z.string().default(""),
  results: z.string().default(""),
  lessons: z.string().default(""),
});

const ProjectLinksSchema = z.object({
  live: OptionalLinkSchema,
  github: OptionalLinkSchema,
});

export const ProjectSchema = z.object({
  id: z.string().min(1),
  slug: SlugSchema,
  name: z.string().min(1),
  shortName: z.string().min(1),
  tagline: z.string().min(1),
  description: z.string().min(1),
  year: z.number().int().gte(2000).lte(2100),
  featured: z.boolean().default(false),
  order: z.number().int(),
  status: ProjectStatusSchema,
  category: z.array(z.string()).min(1),
  role: z.array(z.string()).min(1),
  technologies: z.array(z.string()).min(1),
  links: ProjectLinksSchema.default({ live: "", github: "" }),
  media: ProjectMediaSchema,
  caseStudy: ProjectCaseStudySchema.default({
    overview: "",
    problem: "",
    objective: "",
    solution: "",
    challenges: "",
    results: "",
    lessons: "",
  }),
  features: z.array(ProjectFeatureSchema).default([]),
  files: z.array(ProjectFileSchema).default([]),
});

export type Project = z.infer<typeof ProjectSchema>;
export type ProjectFile = z.infer<typeof ProjectFileSchema>;
export type ProjectFeature = z.infer<typeof ProjectFeatureSchema>;
