import { PrismaClient } from "@prisma/client";

const globalForDb = globalThis as unknown as { portfolioDb?: PrismaClient };

// Explicit preview mode keeps all content/media loaders on the same seed source.
// Never silently replace saved CMS content after an arbitrary database error.
export const seedContentMode = process.env.PORTFOLIO_CONTENT_SOURCE === "seed";
export const databaseConfigured = !seedContentMode && Boolean(process.env.DATABASE_URL?.trim());
export const db = globalForDb.portfolioDb ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForDb.portfolioDb = db;
