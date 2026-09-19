import { z } from "zod";
import { ProjectSchema } from "./project";
import { ExperienceSchema } from "./experience";
import { EducationSchema } from "./education";
import { CertificationSchema } from "./certification";
import { AchievementSchema } from "./achievement";
import { ServiceSchema } from "./service";
import { SkillCategorySchema } from "./skill";
import { DEFAULT_SITE_EXPERIENCE, SiteExperienceSchema } from "./site-experience";
const SafeHttpUrlSchema = z.string().url().refine((value) => ["http:", "https:"].includes(new URL(value).protocol), "must use http or https");

export const SiteIdentitySchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  supportingStatement: z.string().min(1),
  introduction: z.string().min(1),
  location: z.string().min(1),
  specialization: z.string().min(1),
  status: z.string().min(1),
  contactEmail: z.string().email(),
  siteUrl: SafeHttpUrlSchema,
  viewProjectsLabel: z.string().min(1).default("View Projects"),
  contactLabel: z.string().min(1).default("Contact"),
});

export const AboutPrincipleSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

export const AboutContentSchema = z.object({
  headline: z.string().min(1),
  philosophy: z.array(z.string().min(1)).min(1),
  principles: z.array(AboutPrincipleSchema).min(1),
});

export const ContactContentSchema = z.object({
  heading: z.string().min(1),
  introduction: z.string().min(1),
  submitLabel: z.string().min(1),
});

export const SocialLinkSchema = z.object({
  label: z.string().min(1),
  href: z.union([SafeHttpUrlSchema, z.string().startsWith("mailto:"), z.string().startsWith("tel:")]),
  visible: z.boolean().default(true),
});

export const EditorProjectSchema = ProjectSchema.extend({
  folderName: z.string().min(1),
});

export const EditorSnapshotSchema = z.object({
  site: SiteIdentitySchema,
  about: AboutContentSchema,
  contact: ContactContentSchema,
  socialLinks: z.array(SocialLinkSchema),
  projects: z.array(EditorProjectSchema),
  experience: z.array(ExperienceSchema),
  education: z.array(EducationSchema),
  certifications: z.array(CertificationSchema),
  achievements: z.array(AchievementSchema),
  services: z.array(ServiceSchema),
  skills: z.array(SkillCategorySchema),
  siteExperience: SiteExperienceSchema.default(DEFAULT_SITE_EXPERIENCE),
});

export type SiteIdentityData = z.infer<typeof SiteIdentitySchema>;
export type AboutContentData = z.infer<typeof AboutContentSchema>;
export type ContactContent = z.infer<typeof ContactContentSchema>;
export type SocialLinkData = z.infer<typeof SocialLinkSchema>;
export type EditorProject = z.infer<typeof EditorProjectSchema>;
export type EditorSnapshot = z.infer<typeof EditorSnapshotSchema>;
