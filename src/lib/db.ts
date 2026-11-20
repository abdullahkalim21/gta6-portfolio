import { PrismaClient } from "@prisma/client";
import { env } from "./env";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

/**
 * Prisma client, or `null` when DATABASE_URL isn't set.
 * Always check for null — the site must work without a database.
 */
export const prisma: PrismaClient | null = env.databaseEnabled
  ? (globalForPrisma.prisma ??= new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    }))
  : null;
