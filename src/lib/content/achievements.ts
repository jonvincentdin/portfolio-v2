import { loadJsonCollection } from "./fs-utils";
import { AchievementSchema, type Achievement } from "@/lib/schemas";
import { databaseConfigured } from "@/lib/db";
import { getDatabaseSnapshot } from "./database";

let cache: Achievement[] | null = null;

/** All achievements, most recent first (see note on date sorting in certifications.ts). */
export async function getAllAchievements(): Promise<Achievement[]> {
  if (databaseConfigured) return (await getDatabaseSnapshot()).achievements.filter((entry) => entry.visible);
  return getAllAchievementsForEditor().filter((entry) => entry.visible);
}

export function getAllAchievementsForEditor(): Achievement[] {
  if (cache) return cache;

  const entries = loadJsonCollection("achievements", AchievementSchema);

  cache = [...entries].sort(sortAchievements);

  return cache;
}

function sortAchievements(a: Achievement, b: Achievement) {
  if (a.order !== b.order) return a.order - b.order;
  return b.date.localeCompare(a.date);
}
