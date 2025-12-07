/**
 * Prisma Client Singleton for Next.js (Prisma 7.x)
 *
 * Implements the recommended singleton pattern with the pg driver adapter
 * to prevent multiple PrismaClient instances during Next.js hot reloading.
 *
 * For Vercel/serverless deployments with Supabase:
 * - Uses DATABASE_URL (Transaction Pooler, port 6543) in production
 * - Uses DIRECT_URL (Session mode, port 5432) in development
 * - Pool size is minimized for serverless compatibility
 *
 * @see https://pris.ly/d/prisma7-client-config
 * @see https://www.prisma.io/docs/orm/overview/databases/postgresql
 * @see https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler
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
 * 
 * Production (Vercel serverless):
 * - Uses DATABASE_URL (Transaction Pooler) for better connection management
 * - Pool size of 1 to avoid exhausting Supabase connection limits
 * 
 * Development:
 * - Uses DIRECT_URL (Session mode) for better debugging
 * - Larger pool size for faster local development
 */
function createPool(): Pool {
  const isProduction = process.env.NODE_ENV === "production";
  
  // In production, prefer DATABASE_URL (transaction pooler) for serverless
  // In development, prefer DIRECT_URL (session mode) for debugging
  const connectionString = isProduction
    ? process.env.DATABASE_URL || process.env.DIRECT_URL
    : process.env.DIRECT_URL || process.env.DATABASE_URL;
    
  if (!connectionString) {
    throw new Error("DATABASE_URL or DIRECT_URL environment variable is not set");
  }

  return new Pool({
    connectionString,
    // Serverless: minimize pool size to avoid MaxClientsInSessionMode errors
    // Each serverless function instance maintains its own pool
    max: isProduction ? 1 : 5,
    idleTimeoutMillis: isProduction ? 10000 : 30000,
    connectionTimeoutMillis: isProduction ? 5000 : 2000,
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

  // Store pool reference for reuse (important for both dev and production)
  // This helps prevent creating new pools on every request in serverless
  globalForPrisma.pool = pool;

  return client;
}

/**
 * Prisma Client singleton instance
 *
 * Reuses the same instance across requests in the same serverless function instance.
 * This is critical for Vercel serverless to avoid exhausting database connections.
 *
 * Usage:
 * ```typescript
 * import { prisma } from '@/lib/prisma';
 *
 * const users = await prisma.user.findMany();
 * ```
 */
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// Preserve instance across requests (important for both dev hot-reload and production serverless)
globalForPrisma.prisma = prisma;

// Re-export PrismaClient type for use in other files
export type { PrismaClient } from "@/generated/prisma/client";
