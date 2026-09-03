import { loadJsonCollection } from "./fs-utils";
import { SkillCategorySchema, type SkillCategory } from "@/lib/schemas";

let cache: SkillCategory[] | null = null;

/** All skill categories, sorted alphabetically by category name. */
export function getAllSkillCategories(): SkillCategory[] {
  if (cache) return cache;

  const entries = loadJsonCollection("skills", SkillCategorySchema);

  cache = [...entries].sort((a, b) => a.category.localeCompare(b.category));

  return cache;
}
