import { loadJsonCollection } from "./fs-utils";
import { ExperienceSchema, type Experience } from "@/lib/schemas";
import { databaseConfigured } from "@/lib/db";
import { getDatabaseSnapshot } from "./database";

let cache: Experience[] | null = null;

/** All experience entries, current role(s) first, then by start date descending. */
export async function getAllExperience(): Promise<Experience[]> {
  if (databaseConfigured) return (await getDatabaseSnapshot()).experience.filter((entry) => entry.visible);
  return getAllExperienceForEditor().filter((entry) => entry.visible);
}

export function getAllExperienceForEditor(): Experience[] {
  if (cache) return cache;

  const entries = loadJsonCollection("experience", ExperienceSchema);

  cache = [...entries].sort(sortExperience);

  return cache;
}

function sortExperience(a: Experience, b: Experience) {
  if (a.order !== b.order) return a.order - b.order;
  if (a.current !== b.current) return a.current ? -1 : 1;
  return b.startDate.localeCompare(a.startDate);
}
