import { z } from "zod";
import { SkillLevelSchema } from "./common";

/**
 * One skill entry deliberately has no percentage/score field — spec §25/§26
 * explicitly forbid fabricated proficiency percentages. `level` is optional
 * and only ever rendered when the content author supplies it.
 */
const SkillItemSchema = z.object({
  name: z.string().min(1),
  level: SkillLevelSchema.optional(),
  featured: z.boolean().default(false),
});

export const SkillCategorySchema = z.object({
  category: z.string().min(1),
  skills: z.array(SkillItemSchema).min(1),
});

export type SkillCategory = z.infer<typeof SkillCategorySchema>;
export type SkillItem = z.infer<typeof SkillItemSchema>;
