import { z } from "zod";

/**
 * Shared primitives for content schemas — see .claude/context/CONTENT_SYSTEM.md
 */

/** Lowercase, hyphen-separated slug (e.g. "memora", "curriculum-axxer"). */
export const SlugSchema = z
  .string()
  .min(1)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "must be lowercase and hyphen-separated (e.g. 'my-project')");

/**
 * Relative path within a content folder — never an absolute path, URL, or
 * parent-directory reference. This is the schema-level half of the
 * path-traversal defense described in ARCHITECTURE.md; the runtime loaders
 * additionally verify the resolved file actually exists.
 */
export const RelativePathSchema = z
  .string()
  .min(1)
  .refine((value) => !value.startsWith("/") && !value.includes(".."), {
    message: "must be a relative path within the content folder (no leading '/' and no '..')",
  });

/**
 * A link that is either a real absolute URL or an empty string. Empty means
 * "hide this button" per spec §74 (empty-state rules), rather than the
 * field being omitted, which keeps the shape of `links` predictable.
 */
export const OptionalLinkSchema = z
  .union([z.literal(""), z.string().url()])
  .default("");

export const SkillLevelSchema = z.enum([
  "Learning",
  "Familiar",
  "Intermediate",
  "Advanced",
  "Primary",
]);

export type SkillLevel = z.infer<typeof SkillLevelSchema>;
