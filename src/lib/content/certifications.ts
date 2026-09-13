import { loadJsonCollection } from "./fs-utils";
import { CertificationSchema, type Certification } from "@/lib/schemas";
import { databaseConfigured } from "@/lib/db";
import { getDatabaseSnapshot } from "./database";

let cache: Certification[] | null = null;

/**
 * All certifications, most recent first. `date` is a free-text field per
 * the content schema, so this sort is correct for ISO-like values
 * ("2024-03") and best-effort otherwise — acceptable for a personal,
 * author-controlled content set (see CONTENT_SYSTEM.md).
 */
export async function getAllCertifications(): Promise<Certification[]> {
  if (databaseConfigured) return (await getDatabaseSnapshot()).certifications.filter((entry) => entry.visible);
  return getAllCertificationsForEditor().filter((entry) => entry.visible);
}

export function getAllCertificationsForEditor(): Certification[] {
  if (cache) return cache;

  const entries = loadJsonCollection("certifications", CertificationSchema);

  cache = [...entries].sort(sortCertifications);

  return cache;
}

function sortCertifications(a: Certification, b: Certification) {
  if (a.order !== b.order) return a.order - b.order;
  return b.date.localeCompare(a.date);
}
