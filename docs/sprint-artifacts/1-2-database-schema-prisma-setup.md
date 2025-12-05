# Story 1.2: Database Schema & Prisma Setup

Status: done

## Story

As a **developer**,
I want **the complete database schema defined in Prisma with Supabase PostgreSQL connection**,
So that **all data models are ready for the application features**.

## Acceptance Criteria

1. **AC1**: Prisma is configured with Supabase PostgreSQL connection using `DATABASE_URL` and `DIRECT_URL` environment variables ✅
2. **AC2**: All models are defined per Architecture schema:
   - `User` (id, email, name, role, addresses, orders, timestamps) ✅
   - `Address` (id, userId, label, street, city, postalCode, country, isDefault, timestamps) ✅
   - `Marble` (id, slug, name[JSON], description[JSON], density, basePricePerCm3, origin, available, textureFolder, finishes, orderItems, timestamps) ✅
   - `MarbleFinish` (id, marbleId, type, priceModifier) ✅
   - `Order` (id, userId, status, items, shippingAddress, subtotal, shippingCost, total, locale, stripePaymentId, paidAt, shippedAt, deliveredAt, trackingNumber, timestamps) ✅
   - `OrderItem` (id, orderId, marbleId, dimensions, finish, weight, unitPrice, quantity) ✅
   - `GalleryItem` (id, marbleId, title[JSON], description[JSON], imageUrl, useCase, featured, order, timestamps) ✅
3. **AC3**: All enums are defined:
   - `Role`: CUSTOMER, ADMIN ✅
   - `OrderStatus`: PENDING, PAID, IN_PRODUCTION, SHIPPED, DELIVERED, CANCELLED ✅
   - `FinishType`: POLISHED, HONED, RAW, BRUSHED ✅
4. **AC4**: `prisma generate` runs successfully and generates typed client ✅
5. **AC5**: `prisma db push` applies schema to Supabase database ✅
6. **AC6**: `src/lib/prisma.ts` singleton is fully implemented with connection pooling ✅
7. **AC7**: Prisma client is properly typed and importable in application code ✅

## Tasks / Subtasks

- [x] **Task 1: Configure Prisma datasource for Supabase** (AC: #1)
  - [x] 1.1: Update `prisma/schema.prisma` datasource block with PostgreSQL provider
  - [x] 1.2: Configure `url = env("DATABASE_URL")` for pooled connection
  - [x] 1.3: Configure `directUrl = env("DIRECT_URL")` for direct connection (migrations)
  - [x] 1.4: Add connection pooling settings if needed

- [x] **Task 2: Define User model** (AC: #2)
  - [x] 2.1: Create User model with id (uuid), email (unique), name (optional), role (enum), timestamps
  - [x] 2.2: Add relations to Address[] and Order[]
  - [x] 2.3: Add appropriate indexes (@unique on email)

- [x] **Task 3: Define Address model** (AC: #2)
  - [x] 3.1: Create Address model with id, userId, label, street, city, postalCode, country, isDefault
  - [x] 3.2: Add relation to User (many-to-one with onDelete cascade consideration)
  - [x] 3.3: Add createdAt timestamp

- [x] **Task 4: Define Marble model** (AC: #2)
  - [x] 4.1: Create Marble model with id, slug (unique), name (Json), description (Json), density (Float), basePricePerCm3 (Int in cents), origin, available, textureFolder
  - [x] 4.2: Add relations to MarbleFinish[] and OrderItem[]
  - [x] 4.3: Add timestamps (createdAt, updatedAt)

- [x] **Task 5: Define MarbleFinish model** (AC: #2)
  - [x] 5.1: Create MarbleFinish model with id, marbleId, type (FinishType enum), priceModifier (Float, default 1.0)
  - [x] 5.2: Add relation to Marble (many-to-one)

- [x] **Task 6: Define Order model** (AC: #2)
  - [x] 6.1: Create Order model with id, userId, status (OrderStatus enum), shippingAddress (Json), subtotal/shippingCost/total (Int in cents), locale, stripePaymentId
  - [x] 6.2: Add date fields: paidAt, shippedAt, deliveredAt (optional DateTime)
  - [x] 6.3: Add trackingNumber (optional String)
  - [x] 6.4: Add relation to User and OrderItem[]
  - [x] 6.5: Add timestamps (createdAt, updatedAt)

- [x] **Task 7: Define OrderItem model** (AC: #2)
  - [x] 7.1: Create OrderItem model with id, orderId, marbleId, width/height/depth (Int in cm), finish (FinishType), weight (Float in kg), unitPrice (Int in cents), quantity
  - [x] 7.2: Add relations to Order and Marble

- [x] **Task 8: Define GalleryItem model** (AC: #2)
  - [x] 8.1: Create GalleryItem model with id, marbleId (optional), title (Json), description (Json), imageUrl, useCase, featured, order (Int for display order)
  - [x] 8.2: Add createdAt timestamp

- [x] **Task 9: Define all enums** (AC: #3)
  - [x] 9.1: Define `Role` enum with CUSTOMER, ADMIN
  - [x] 9.2: Define `OrderStatus` enum with PENDING, PAID, IN_PRODUCTION, SHIPPED, DELIVERED, CANCELLED
  - [x] 9.3: Define `FinishType` enum with POLISHED, HONED, RAW, BRUSHED

- [x] **Task 10: Implement Prisma singleton** (AC: #6)
  - [x] 10.1: Update `src/lib/prisma.ts` with proper singleton pattern for Next.js
  - [x] 10.2: Handle hot reloading in development (avoid multiple instances)
  - [x] 10.3: Export typed PrismaClient instance
  - [x] 10.4: Add proper TypeScript types

- [x] **Task 11: Generate and push schema** (AC: #4, #5)
  - [x] 11.1: Run `npx prisma generate` - verify success
  - [x] 11.2: Configure Supabase project (if not done already)
  - [x] 11.3: Add DATABASE_URL and DIRECT_URL to `.env`
  - [x] 11.4: Run `npx prisma db push` - verify schema applied
  - [x] 11.5: Verify tables created in Supabase dashboard

- [x] **Task 12: Verify client usage** (AC: #7)
  - [x] 12.1: Create a test import in a Server Component
  - [x] 12.2: Verify TypeScript autocomplete works for models
  - [x] 12.3: Run `npm run build` to verify no type errors

## Dev Notes

### Architecture Patterns & Constraints

This story implements the complete data model for Marmorani. Key decisions:

- **UUID Primary Keys**: All models use `@id @default(uuid())` for globally unique identifiers
- **JSON Fields for i18n**: `name` and `description` fields use Json type for multilingual content `{ en: "...", fr: "...", ... }`
- **Prices in Cents**: All monetary values stored as Int (cents) to avoid floating point issues
- **Timestamps**: All models with user-facing data have `createdAt`; mutable models also have `updatedAt`
- **Connection Pooling**: Supabase requires separate URLs for pooled (transactions) and direct (migrations) connections

### Prisma 7.x Configuration

The project uses Prisma 7.1.0 which has updated API:
- Client generated to `src/generated/prisma/` by default (from Story 1.1)
- **NEW**: Connection URLs configured in `prisma.config.ts` (not in schema.prisma)
- **NEW**: Requires `@prisma/adapter-pg` and `pg` packages for direct PostgreSQL connection
- Import from `@/generated/prisma/client` (not `@/generated/prisma`)

### Singleton Pattern for Next.js (Prisma 7.x)

```typescript
// src/lib/prisma.ts
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

function createPrismaClient(): PrismaClient {
  const pool = globalForPrisma.pool ?? new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
```

### Supabase Connection Strings

From Supabase dashboard > Settings > Database:
- **DATABASE_URL**: Connection pooling URL (port 6543, `?pgbouncer=true`)
- **DIRECT_URL**: Direct connection URL (port 5432)

Example format:
```
DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-1-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[project-ref]:[password]@aws-1-eu-central-1.pooler.supabase.com:5432/postgres"
```

### Project Structure Notes

Files to modify/create:
- `prisma/schema.prisma` - Update from empty placeholder to full schema
- `src/lib/prisma.ts` - Implement from placeholder to working singleton

Alignment with Architecture:
- Schema matches exactly with [Source: docs/architecture.md#Data-Architecture]
- Singleton pattern follows [Source: docs/architecture.md#Implementation-Patterns]

### Learnings from Previous Story

**From Story 1-1-project-initialization-core-dependencies (Status: done)**

- **Prisma Version**: Prisma 7.1.0 installed (newer than 5.x targeted in architecture)
- **Client Location**: Generated to `src/generated/prisma/` with new Prisma 7 API
- **Prisma Config**: `prisma.config.ts` exists at project root
- **Placeholder Implementation**: `src/lib/prisma.ts` contains placeholder code that needs to be replaced
- **Project Versions**: Next.js 16, Tailwind 4, Zustand 5 installed (all newer than architecture targets, backwards compatible)
- **Path Aliases**: `@/*` maps to `./src/*` - use this for imports

**Files from previous story to reference:**
- `src/lib/prisma.ts` - Contains placeholder, needs full implementation
- `prisma/schema.prisma` - Empty, needs all models
- `prisma.config.ts` - May need updates for Prisma 7

[Source: docs/sprint-artifacts/1-1-project-initialization-core-dependencies.md#Dev-Agent-Record]

### References

- [Source: docs/architecture.md#Data-Architecture] - Complete Prisma schema specification
- [Source: docs/architecture.md#Implementation-Patterns] - Singleton pattern
- [Source: docs/sprint-artifacts/tech-spec-epic-1.md#Story-1.2] - Detailed acceptance criteria AC1.2.1-7
- [Source: docs/sprint-artifacts/tech-spec-epic-1.md#Data-Models-and-Contracts] - Full schema with relations
- [Source: docs/epics.md#Story-1.2] - Story definition and business context

## Dev Agent Record

### Context Reference

- `docs/sprint-artifacts/1-2-database-schema-prisma-setup.context.xml`

### Agent Model Used

Claude Opus 4 (Amelia - Dev Agent)

### Debug Log References

- Prisma 7.x breaking changes identified: URLs moved to `prisma.config.ts`
- Prisma 7.x requires `@prisma/adapter-pg` for direct PostgreSQL connections
- Import path changed from `@/generated/prisma` to `@/generated/prisma/client`
- Supabase region identified as `aws-1-eu-central-1` (not `aws-0`)

### Completion Notes List

- ✅ Full Prisma schema implemented with 7 models and 3 enums matching architecture spec
- ✅ Adapted to Prisma 7.x breaking changes (adapter pattern, config file)
- ✅ Added `@prisma/adapter-pg` and `pg` packages for PostgreSQL connection
- ✅ Singleton pattern implemented with connection pooling via pg Pool
- ✅ Schema successfully pushed to Supabase PostgreSQL
- ✅ Build passes with full TypeScript type checking
- ✅ All models have proper indexes for query optimization

### File List

| File | Action | Description |
|------|--------|-------------|
| `prisma/schema.prisma` | Modified | Complete schema with 7 models, 3 enums, indexes |
| `prisma.config.ts` | Modified | Added DATABASE_URL configuration for Prisma 7.x |
| `src/lib/prisma.ts` | Modified | Full singleton with pg adapter for Prisma 7.x |
| `.env` | Created | Supabase connection strings |
| `.env.local` | Created | Local environment variables |
| `.env.example` | Created | Template for environment variables |
| `.gitignore` | Modified | Added `!.env.example` exception |
| `package.json` | Modified | Added @prisma/adapter-pg, pg, @types/pg |

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2025-12-04 | Story drafted from epics, architecture, and tech spec | SM Agent (Bob) |
| 2025-12-04 | Implementation complete - all 7 models, 3 enums, Prisma 7.x adapter pattern, Supabase connected | Dev Agent (Amelia) |
| 2025-12-04 | Senior Developer Review notes appended - APPROVED | Dev Agent (Amelia) |

---

## Senior Developer Review (AI)

### Reviewer
Sacha

### Date
2025-12-04

### Outcome
**✅ APPROVE** - L'implémentation est complète et conforme aux critères d'acceptation.

### Summary
La story 1.2 implémente correctement le schéma de base de données Prisma avec connexion à Supabase PostgreSQL. Le développeur a adapté l'implémentation pour Prisma 7.x (au lieu de 5.x ciblé dans l'architecture), ce qui a nécessité des ajustements techniques appropriés (adapter-pg, prisma.config.ts, pattern singleton adapté).

### Acceptance Criteria Coverage

| AC# | Description | Status | Evidence |
|-----|-------------|--------|----------|
| AC1 | Prisma configuré avec DATABASE_URL et DIRECT_URL | ✅ IMPLEMENTED | `prisma.config.ts:18`, `.env` créé |
| AC2 | Tous les 7 modèles définis | ✅ IMPLEMENTED | `prisma/schema.prisma:44-153` |
| AC3 | Tous les 3 enums définis | ✅ IMPLEMENTED | `prisma/schema.prisma:19-38` |
| AC4 | `prisma generate` réussit | ✅ IMPLEMENTED | `src/generated/prisma/client.ts` exists |
| AC5 | `prisma db push` applique le schéma | ✅ IMPLEMENTED | Terminal: "Your database is now in sync" |
| AC6 | Singleton avec connection pooling | ✅ IMPLEMENTED | `src/lib/prisma.ts:24-36` |
| AC7 | Client typé et importable | ✅ IMPLEMENTED | `npm run build` exit 0, types exportés |

**Summary: 7 of 7 acceptance criteria fully implemented**

### Task Completion Validation

| Task | Marked As | Verified As | Evidence |
|------|-----------|-------------|----------|
| Task 1-9: Schema & Enums | ✅ Complete | ✅ VERIFIED | `prisma/schema.prisma` |
| Task 10: Implement singleton | ✅ Complete | ✅ VERIFIED | `src/lib/prisma.ts` |
| Task 11: Generate and push | ✅ Complete | ✅ VERIFIED | Terminal logs |
| Task 12: Verify client usage | ✅ Complete | ✅ VERIFIED | `npm run build` exit 0 |

**Summary: 12 of 12 completed tasks verified, 0 falsely marked complete**

### Key Findings

**No HIGH Severity Issues ✅**

**MEDIUM Severity:**
- Le schéma ajoute `galleryItems` relation et `onDelete` constraints - amélioration acceptable
- Prisma 7.x architecture différente documentée dans Dev Notes

**LOW Severity:**
- Index supplémentaires ajoutés - bonne pratique

### Architectural Alignment
✅ Conforme à `docs/architecture.md#Data-Architecture` avec adaptations Prisma 7.x

### Action Items

**Advisory Notes:**
- Note: Considérer l'ajout d'un script `postinstall` avec `prisma generate` pour Vercel (Story 1.5)
- Note: Credentials DB visibles dans terminal logs - sensibilisation sécurité

**No code changes required.**
