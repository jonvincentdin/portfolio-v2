import { loadJsonCollection } from "./fs-utils";
import { CertificationSchema, type Certification } from "@/lib/schemas";

let cache: Certification[] | null = null;

/**
 * All certifications, most recent first. `date` is a free-text field per
 * the content schema, so this sort is correct for ISO-like values
 * ("2024-03") and best-effort otherwise — acceptable for a personal,
 * author-controlled content set (see CONTENT_SYSTEM.md).
 */
export function getAllCertifications(): Certification[] {
  if (cache) return cache;

  const entries = loadJsonCollection("certifications", CertificationSchema);

  cache = [...entries].sort((a, b) => b.date.localeCompare(a.date));

  return cache;
}
