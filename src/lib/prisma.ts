/**
 * Prisma Client Singleton for Next.js (Prisma 7.x)
 *
 * Implements the recommended singleton pattern with the pg driver adapter
 * to prevent multiple PrismaClient instances during Next.js hot reloading.
 *
 * @see https://pris.ly/d/prisma7-client-config
 * @see https://www.prisma.io/docs/orm/overview/databases/postgresql
 */

import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

// Extend globalThis with prisma property for singleton pattern
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

/**
 * Create PostgreSQL connection pool
 * Uses DIRECT_URL (session mode, port 5432) for better pg driver compatibility
 */
function createPool(): Pool {
  // Prefer DIRECT_URL (session mode) over DATABASE_URL (transaction mode)
  // The pg driver has issues with Supabase transaction pooler (port 6543)
  const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DIRECT_URL or DATABASE_URL environment variable is not set");
  }

  return new Pool({
    connectionString,
    max: 10, // Maximum pool size
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });
}

/**
 * Create Prisma client with pg adapter
 */
function createPrismaClient(): PrismaClient {
  const pool = globalForPrisma.pool ?? createPool();
  const adapter = new PrismaPg(pool);

  const client = new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

  // Store pool reference for reuse in development
  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.pool = pool;
  }

  return client;
}

/**
 * Prisma Client singleton instance
 *
 * In development: Reuses the same instance across hot reloads
 * In production: Creates a new instance per serverless function invocation
 *
 * Usage:
 * ```typescript
 * import { prisma } from '@/lib/prisma';
 *
 * const users = await prisma.user.findMany();
 * ```
 */
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// Preserve instance across hot reloads in development
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Re-export PrismaClient type for use in other files
export type { PrismaClient } from "@/generated/prisma/client";
