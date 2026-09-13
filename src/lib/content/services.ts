import { loadJsonCollection } from "./fs-utils";
import { ServiceSchema, type Service } from "@/lib/schemas";
import { databaseConfigured } from "@/lib/db";
import { getDatabaseSnapshot } from "./database";

let cache: Service[] | null = null;

/** All services, sorted by their author-assigned id ("01", "02", ...). */
export async function getAllServices(): Promise<Service[]> {
  if (databaseConfigured) return (await getDatabaseSnapshot()).services.filter((entry) => entry.visible);
  return getAllServicesForEditor().filter((entry) => entry.visible);
}

export function getAllServicesForEditor(): Service[] {
  if (cache) return cache;

  const entries = loadJsonCollection("services", ServiceSchema);

  cache = [...entries].sort(sortServices);

  return cache;
}

function sortServices(a: Service, b: Service) {
  if (a.order !== b.order) return a.order - b.order;
  return a.id.localeCompare(b.id);
}
