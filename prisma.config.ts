/**
 * Prisma Configuration for Marmorani
 * Prisma 7.x requires connection URLs in this config file, not in schema.prisma
 *
 * @see https://pris.ly/d/config-datasource
 */
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx tsx prisma/seed.ts",
  },
  datasource: {
    // Pooled connection via Supabase PgBouncer (port 6543)
    // For migrations, use: npx prisma migrate dev --url $DIRECT_URL
    url: env("DATABASE_URL"),
  },
});
