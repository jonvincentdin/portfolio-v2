import { PrismaClient } from "@prisma/client";

const globalForDb = globalThis as unknown as { portfolioDb?: PrismaClient };

export const databaseConfigured = Boolean(process.env.DATABASE_URL?.trim());
export const db = globalForDb.portfolioDb ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForDb.portfolioDb = db;
