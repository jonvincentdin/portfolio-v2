import { loadJsonCollection } from "./fs-utils";
import { ExperienceSchema, type Experience } from "@/lib/schemas";

let cache: Experience[] | null = null;

/** All experience entries, current role(s) first, then by start date descending. */
export function getAllExperience(): Experience[] {
  if (cache) return cache;

  const entries = loadJsonCollection("experience", ExperienceSchema);

  cache = [...entries].sort((a, b) => {
    if (a.current !== b.current) return a.current ? -1 : 1;
    return b.startDate.localeCompare(a.startDate);
  });

  return cache;
}
