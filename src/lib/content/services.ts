import { loadJsonCollection } from "./fs-utils";
import { ServiceSchema, type Service } from "@/lib/schemas";

let cache: Service[] | null = null;

/** All services, sorted by their author-assigned id ("01", "02", ...). */
export function getAllServices(): Service[] {
  if (cache) return cache;

  const entries = loadJsonCollection("services", ServiceSchema);

  cache = [...entries].sort((a, b) => a.id.localeCompare(b.id));

  return cache;
}
