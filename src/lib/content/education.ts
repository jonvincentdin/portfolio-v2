import { loadJsonCollection } from "./fs-utils";
import { EducationSchema, type Education } from "@/lib/schemas";

let cache: Education[] | null = null;

/** All education entries, most recent (by end year) first. */
export function getAllEducation(): Education[] {
  if (cache) return cache;

  const entries = loadJsonCollection("education", EducationSchema);

  cache = [...entries].sort((a, b) => b.endYear.localeCompare(a.endYear));

  return cache;
}
