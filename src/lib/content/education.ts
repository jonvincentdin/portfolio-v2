import { loadJsonCollection } from "./fs-utils";
import { EducationSchema, type Education } from "@/lib/schemas";
import { databaseConfigured } from "@/lib/db";
import { getDatabaseSnapshot } from "./database";

let cache: Education[] | null = null;

/** All education entries, most recent (by end year) first. */
export async function getAllEducation(): Promise<Education[]> {
  if (databaseConfigured) return (await getDatabaseSnapshot()).education.filter((entry) => entry.visible);
  return getAllEducationForEditor().filter((entry) => entry.visible);
}

export function getAllEducationForEditor(): Education[] {
  if (cache) return cache;

  const entries = loadJsonCollection("education", EducationSchema);

  cache = [...entries].sort(sortEducation);

  return cache;
}

function sortEducation(a: Education, b: Education) {
  if (a.order !== b.order) return a.order - b.order;
  return b.endYear.localeCompare(a.endYear);
}
