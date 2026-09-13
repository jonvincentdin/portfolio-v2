import { loadJsonCollection } from "./fs-utils";
import { SkillCategorySchema, type SkillCategory } from "@/lib/schemas";
import { databaseConfigured } from "@/lib/db";
import { getDatabaseSnapshot } from "./database";

let cache: SkillCategory[] | null = null;

/** All skill categories, sorted alphabetically by category name. */
export async function getAllSkillCategories(): Promise<SkillCategory[]> {
  if (databaseConfigured) return (await getDatabaseSnapshot()).skills.filter((category) => category.visible);
  return getAllSkillCategoriesForEditor().filter((category) => category.visible);
}

export function getAllSkillCategoriesForEditor(): SkillCategory[] {
  if (cache) return cache;

  const entries = loadJsonCollection("skills", SkillCategorySchema);

  cache = [...entries].sort(sortSkills);

  return cache;
}

function sortSkills(a: SkillCategory, b: SkillCategory) {
  if (a.order !== b.order) return a.order - b.order;
  return a.category.localeCompare(b.category);
}
