import { loadJsonCollection } from "./fs-utils";
import { AchievementSchema, type Achievement } from "@/lib/schemas";

let cache: Achievement[] | null = null;

/** All achievements, most recent first (see note on date sorting in certifications.ts). */
export function getAllAchievements(): Achievement[] {
  if (cache) return cache;

  const entries = loadJsonCollection("achievements", AchievementSchema);

  cache = [...entries].sort((a, b) => b.date.localeCompare(a.date));

  return cache;
}
