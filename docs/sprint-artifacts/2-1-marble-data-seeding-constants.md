# Story 2.1: Marble Data Seeding & Constants

Status: done

## Story

As a **developer**,
I want **the initial marble catalog data seeded in the database with manufacturing constraints defined as constants**,
So that **the gallery and configurator have real marble data to display and validate against**.

## Acceptance Criteria

1. **AC1:** Running `npm run db:seed` creates 10 marble types in the database
   - Seed script executes without errors
   - 10 distinct marbles are created with unique slugs
   - Marbles can be queried via Prisma after seeding

2. **AC2:** Each marble has multilingual names and descriptions (en, fr, it, es, de)
   - JSON fields contain all 5 locale keys
   - Names are properly translated (e.g., "Carrara" / "Carrare")
   - Descriptions include origin story and characteristics

3. **AC3:** Each marble has accurate technical specifications
   - Density value in kg/m³ (typically ~2700 for most marbles)
   - Base price per cm³ in cents (integer value)
   - Origin country as string
   - textureFolder matching future `/public/textures/{slug}/` pattern

4. **AC4:** Each marble has 2-4 finishes with price modifiers
   - MarbleFinish records created for each marble
   - Finishes include at least POLISHED and HONED
   - Price modifiers are decimals (e.g., 1.0, 1.1, 0.9)

5. **AC5:** Manufacturing constraints are defined in `src/constants/marbles.ts`
   - `MANUFACTURING_CONSTRAINTS.MIN_DIMENSION = 5` (cm)
   - `MANUFACTURING_CONSTRAINTS.MAX_DIMENSION = 100` (cm)
   - `FINISH_TYPES` array with all FinishType enum values
   - Constants are properly typed with `as const`

6. **AC6:** Seed script is idempotent
   - Running seed multiple times doesn't create duplicates
   - Uses upsert or delete-then-create pattern
   - Script logs progress and result count

## Tasks / Subtasks

- [x] **Task 1: Create manufacturing constants file** (AC: #5)
  - [x] 1.1: Create `src/constants/marbles.ts`
  - [x] 1.2: Define `MANUFACTURING_CONSTRAINTS` with MIN/MAX dimensions
  - [x] 1.3: Define `FINISH_TYPES` array from FinishType enum
  - [x] 1.4: Define `USE_CASES` array for gallery filtering
  - [x] 1.5: Export all constants with proper TypeScript types

- [x] **Task 2: Create marble type definitions** (AC: #3, #4)
  - [x] 2.1: Create `src/types/marble.ts` if not exists
  - [x] 2.2: Define `MarbleLocalized` interface for resolved locale data
  - [x] 2.3: Define `FinishOption` interface
  - [x] 2.4: Define `MarbleSeedData` interface for seed input

- [x] **Task 3: Create Prisma seed script** (AC: #1, #6)
  - [x] 3.1: Create `prisma/seed.ts`
  - [x] 3.2: Import Prisma client and types
  - [x] 3.3: Implement main seed function with logging
  - [x] 3.4: Add cleanup logic for idempotent seeding (delete existing data)
  - [x] 3.5: Configure `prisma.seed` in prisma.config.ts (Prisma 7.x)

- [x] **Task 4: Define marble catalog data** (AC: #2, #3, #4)
  - [x] 4.1: Create marble data for Carrara White (Italy)
  - [x] 4.2: Create marble data for Nero Marquina (Spain)
  - [x] 4.3: Create marble data for Calacatta Gold (Italy)
  - [x] 4.4: Create marble data for Emperador Dark (Spain)
  - [x] 4.5: Create marble data for Statuario (Italy)
  - [x] 4.6: Create marble data for Verde Guatemala (Guatemala)
  - [x] 4.7: Create marble data for Rosa Portogallo (Portugal)
  - [x] 4.8: Create marble data for Sahara Noir (Tunisia)
  - [x] 4.9: Create marble data for Bianco Sivec (North Macedonia)
  - [x] 4.10: Create marble data for Travertino Romano (Italy)

- [x] **Task 5: Implement marble seeding logic** (AC: #1, #4)
  - [x] 5.1: Loop through marble definitions and create records
  - [x] 5.2: Create MarbleFinish records for each marble
  - [x] 5.3: Add transaction wrapper for atomicity
  - [x] 5.4: Log creation results with counts

- [x] **Task 6: Add seed script to package.json** (AC: #1)
  - [x] 6.1: Add `"db:seed": "prisma db seed"` to scripts
  - [x] 6.2: Configure seed in prisma.config.ts (Prisma 7.x pattern)
  - [x] 6.3: Ensure `tsx` is installed for TypeScript execution

- [x] **Task 7: Test seeding locally** (AC: #1, #6)
  - [x] 7.1: Run `npm run db:seed` and verify no errors
  - [x] 7.2: Verified via seed script output (10 marbles, 26 finishes)
  - [x] 7.3: Verify all 10 marbles created with finishes
  - [x] 7.4: Run seed again to verify idempotency
  - [x] 7.5: Verified counts match after 2nd run

## Dev Notes

### Architecture Patterns & Constraints

This story implements the data layer foundation for Epic 2, following Architecture doc patterns:

- **Prisma ORM**: Type-safe database client for PostgreSQL via Supabase
- **JSON Fields**: Multilingual content stored as JSON (name, description)
- **Constants**: Typed constants with `as const` for compile-time safety
- **Seed Pattern**: Idempotent seeding using transaction with cleanup

### Marble Data Specifications

| Marble | Origin | Density (kg/m³) | Base Price (cents/cm³) | Available Finishes |
|--------|--------|-----------------|------------------------|-------------------|
| Carrara White | Italy | 2710 | 8 | POLISHED, HONED, RAW |
| Nero Marquina | Spain | 2700 | 12 | POLISHED, HONED, BRUSHED |
| Calacatta Gold | Italy | 2700 | 18 | POLISHED, HONED |
| Emperador Dark | Spain | 2720 | 10 | POLISHED, HONED, BRUSHED |
| Statuario | Italy | 2690 | 22 | POLISHED, HONED |
| Verde Guatemala | Guatemala | 2750 | 14 | POLISHED, HONED, RAW |
| Rosa Portogallo | Portugal | 2680 | 9 | POLISHED, HONED |
| Sahara Noir | Tunisia | 2710 | 11 | POLISHED, HONED, BRUSHED |
| Bianco Sivec | North Macedonia | 2700 | 16 | POLISHED, HONED |
| Travertino Romano | Italy | 2400 | 7 | POLISHED, HONED, RAW |

**Finish Price Modifiers:**
- POLISHED: 1.0 (base price)
- HONED: 0.95 (5% discount)
- RAW: 0.85 (15% discount)
- BRUSHED: 1.1 (10% premium)

### Multilingual Content Guidelines

Each marble's `name` and `description` JSON fields follow this pattern:

```typescript
{
  en: "Carrara White",
  fr: "Carrare Blanc",
  it: "Bianco Carrara",
  es: "Blanco Carrara",
  de: "Carrara Weiß"
}
```

Descriptions should include:
- Origin region and quarry heritage
- Visual characteristics (veining patterns, color nuances)
- Historical significance (e.g., Michelangelo's David)
- Suggested use cases

### Project Structure Notes

New files created:
- `src/constants/marbles.ts` - Manufacturing constraints and constants
- `src/types/marble.ts` - TypeScript interfaces (may already exist)
- `prisma/seed.ts` - Database seeding script

Modified files:
- `package.json` - Add seed scripts and prisma seed configuration

### Learnings from Previous Story

**From Story 1-5-deployment-pipeline-environment-configuration (Status: done)**

- **Production URL**: https://marmorani.vercel.app - fully operational
- **Prisma postinstall**: `postinstall` script configured for `prisma generate`
- **Database Ready**: Supabase PostgreSQL connected via DATABASE_URL/DIRECT_URL
- **i18n Active**: 5 locales working (/en, /fr, /it, /es, /de)
- **Stripe Deferred**: Payment integration deferred to Epic 5

**Important for this story:**
- Use existing Prisma schema (User, Address, Marble, MarbleFinish, Order, OrderItem, GalleryItem already defined)
- Use DIRECT_URL for seeding locally (not pooled connection)
- `tsx` preferred over `ts-node` for faster TypeScript execution

[Source: docs/sprint-artifacts/1-5-deployment-pipeline-environment-configuration.md#Dev-Agent-Record]

### References

- [Source: docs/architecture.md#Data-Architecture] - Prisma schema and data models
- [Source: docs/architecture.md#Implementation-Patterns] - Naming conventions and code patterns
- [Source: docs/sprint-artifacts/tech-spec-epic-2.md#Story-2.1] - AC-2.1.1 through AC-2.1.5
- [Source: docs/epics.md#Story-2.1] - Story definition and marble list
- [Source: docs/prd.md#FR29-FR34] - Content & Discovery functional requirements

## Dev Agent Record

### Context Reference

- docs/sprint-artifacts/2-1-marble-data-seeding-constants.context.xml

### Agent Model Used

Claude Opus 4.5

### Debug Log References

- Seed script uses Prisma 7.x pattern with prisma.config.ts instead of package.json for seed configuration
- Transaction wrapper ensures atomic marble+finish creation
- Delete-then-create pattern for idempotency
- Used DIRECT_URL fallback for non-pooled connection during seeding

### Completion Notes List

- ✅ AC1: `npm run db:seed` creates 10 marbles with unique slugs (verified)
- ✅ AC2: All marbles have 5-locale JSON fields (en, fr, it, es, de) with proper translations
- ✅ AC3: Each marble has density (2400-2750 kg/m³), basePricePerCm3 (cents), origin, textureFolder
- ✅ AC4: 26 total finishes across 10 marbles (2-3 per marble), all include POLISHED and HONED
- ✅ AC5: `MANUFACTURING_CONSTRAINTS.MIN_DIMENSION = 5`, `MAX_DIMENSION = 100`, `FINISH_TYPES`, `USE_CASES` exported with `as const`
- ✅ AC6: Idempotent seeding verified - 2nd run cleans 10 marbles/26 finishes, recreates same counts

### File List

**Created:**
- `src/constants/marbles.ts` - Manufacturing constraints, finish types, price modifiers, use cases
- `src/types/marble.ts` - LocalizedString, FinishOption, MarbleLocalized, MarbleSeedData, MarbleRaw interfaces
- `prisma/seed.ts` - Complete seed script with 10 marbles and idempotent logic

**Modified:**
- `package.json` - Added `db:seed` script, `tsx` devDependency
- `prisma.config.ts` - Added `seed` configuration for Prisma 7.x

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2025-12-05 | Story drafted from Epic 2 tech-spec, architecture, and previous story learnings | SM Agent (Bob) |
| 2025-12-05 | Implementation complete - all 7 tasks done, all 6 ACs verified, ready for review | Dev Agent (Claude Opus 4.5) |
| 2025-12-05 | Code review APPROVED - excellent quality, all ACs verified, architecture compliant | Dev Agent (Claude Opus 4.5) |

