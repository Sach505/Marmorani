# Epic Technical Specification: Marble Catalog & Discovery

Date: 2025-12-05
Author: Sacha
Epic ID: 2
Status: Draft

---

## Overview

This technical specification details the implementation of **Epic 2: Marble Catalog & Discovery**, which enables users to explore the marble collection and get inspired before configuring their cube. This is the "Inspiration First" journey from the UX specification.

The epic transforms the marble catalog data and assets into a browsable, filterable gallery experience where users can discover marble types, learn about each variety's characteristics, and seamlessly transition to the 3D configurator with their chosen marble pre-selected.

**PRD Context:** This epic addresses the "Content & Discovery" functional requirements (FR29-FR34), enabling users to browse inspiration, filter by preferences, view detailed marble pages, and navigate directly to configuration.

## Objectives and Scope

### In-Scope

- **Marble Data Seeding:** Seed the database with ~10 marble types including multilingual names, descriptions, density, pricing, and finish modifiers
- **Constants Definition:** Define manufacturing constraints (MIN/MAX dimensions, finish types) as typed constants
- **Texture Asset Integration:** Organize and integrate marble texture assets (diffuse, normal, roughness maps) for 3D rendering
- **Inspiration Gallery Page:** Build a responsive grid gallery showcasing marble examples with hover effects and filtering
- **Gallery Filtering:** Implement server-side filtering by marble type, finish, and use case with URL-synced state
- **Marble Detail Pages:** Create detailed product pages with specifications, imagery, and configurator CTA
- **Navigation Flow:** Enable pre-selection of marble when navigating from gallery/detail to configurator

### Out-of-Scope

- 3D Configurator implementation (Epic 3)
- User authentication (Epic 4)
- Cart/Checkout functionality (Epic 5)
- Admin management of marble catalog (Epic 7)
- Dynamic texture upload (textures managed via deployment for MVP)

## System Architecture Alignment

This epic builds on the **Foundation (Epic 1)** and prepares data/assets for **Epic 3 (3D Configurator)**.

**Components Referenced:**
- `src/app/[locale]/gallery/page.tsx` — Gallery route
- `src/app/[locale]/marble/[slug]/page.tsx` — Marble detail route
- `src/components/gallery/` — Gallery components (MarbleCard, MarbleGrid, FilterPanel)
- `src/constants/marbles.ts` — Manufacturing constraints
- `prisma/seed.ts` — Marble data seeding
- `/public/textures/{slug}/` — Texture asset storage

**Architecture Constraints:**
- Server Components for data fetching (SEO, performance)
- URL-based filter state for shareability
- Static generation with `generateStaticParams` for marble detail pages
- Image optimization via `next/image`

## Detailed Design

### Services and Modules

| Module | Responsibility | Inputs | Outputs |
|--------|---------------|--------|---------|
| `prisma/seed.ts` | Seed initial marble catalog data | Marble definitions | Marble, MarbleFinish records |
| `src/constants/marbles.ts` | Define manufacturing constraints | - | Typed constants (dimensions, finishes) |
| `src/app/[locale]/gallery/page.tsx` | Render gallery with filters | URL search params | Gallery page with filtered results |
| `src/app/[locale]/marble/[slug]/page.tsx` | Render marble detail page | Slug param | Marble detail page |
| `src/components/gallery/MarbleCard.tsx` | Display gallery item card | GalleryItem data | Card component with hover effects |
| `src/components/gallery/MarbleGrid.tsx` | Render responsive grid | GalleryItem[] | Grid layout |
| `src/components/gallery/FilterPanel.tsx` | Filter controls UI | Current filters, options | Filter UI with callbacks |
| `src/lib/queries/marbles.ts` | Database queries for marbles | Filters | Marble data |

### Data Models and Contracts

**Marble Model (already defined in Prisma):**
```prisma
model Marble {
  id              String         @id @default(uuid())
  slug            String         @unique
  name            Json           // { en: "Carrara", fr: "Carrare", ... }
  description     Json           // Multilingual descriptions
  density         Float          // kg/m³ for weight calculation
  basePricePerCm3 Int            // cents
  origin          String         // Country of origin
  available       Boolean        @default(true)
  textureFolder   String         // e.g., "carrara"
  finishes        MarbleFinish[]
  orderItems      OrderItem[]
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt
}

model MarbleFinish {
  id            String     @id @default(uuid())
  marbleId      String
  marble        Marble     @relation(fields: [marbleId], references: [id])
  type          FinishType
  priceModifier Float      @default(1.0)
}

model GalleryItem {
  id          String   @id @default(uuid())
  marbleId    String?
  title       Json     // Multilingual
  description Json     // Multilingual
  imageUrl    String
  useCase     String?  // "coffee-table" | "side-table" | "column" | "decorative"
  featured    Boolean  @default(false)
  order       Int      @default(0)
  createdAt   DateTime @default(now())
}

enum FinishType {
  POLISHED
  HONED
  RAW
  BRUSHED
}
```

**TypeScript Types (src/types/marble.ts):**
```typescript
export interface MarbleLocalized {
  id: string;
  slug: string;
  name: string;           // Resolved to current locale
  description: string;    // Resolved to current locale
  density: number;
  basePricePerCm3: number;
  origin: string;
  textureFolder: string;
  finishes: FinishOption[];
}

export interface FinishOption {
  type: FinishType;
  priceModifier: number;
}

export interface GalleryItemLocalized {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  useCase: string | null;
  featured: boolean;
  marbleSlug: string | null;
}

export interface GalleryFilters {
  marbleType?: string;
  finish?: FinishType;
  useCase?: string;
}
```

**Constants (src/constants/marbles.ts):**
```typescript
export const MANUFACTURING_CONSTRAINTS = {
  MIN_DIMENSION: 5,      // cm
  MAX_DIMENSION: 100,    // cm
} as const;

export const FINISH_TYPES = ['POLISHED', 'HONED', 'RAW', 'BRUSHED'] as const;

export const USE_CASES = [
  'coffee-table',
  'side-table', 
  'column',
  'decorative',
] as const;
```

### APIs and Interfaces

**Server Actions / Query Functions:**

| Function | Path | Purpose | Response |
|----------|------|---------|----------|
| `getMarbles()` | `src/lib/queries/marbles.ts` | Get all available marbles | `MarbleLocalized[]` |
| `getMarbleBySlug(slug)` | `src/lib/queries/marbles.ts` | Get single marble details | `MarbleLocalized \| null` |
| `getGalleryItems(filters)` | `src/lib/queries/gallery.ts` | Get filtered gallery items | `GalleryItemLocalized[]` |
| `getGalleryFilters()` | `src/lib/queries/gallery.ts` | Get available filter options | `{ marbles, finishes, useCases }` |

**Page Routes:**

| Route | Method | Purpose |
|-------|--------|---------|
| `/[locale]/gallery` | GET | Render gallery page with optional filters |
| `/[locale]/marble/[slug]` | GET | Render marble detail page |
| `/[locale]/configurator?marble={slug}` | GET | Configurator with pre-selected marble (Epic 3) |

### Workflows and Sequencing

**Gallery Browse Flow:**
```
1. User navigates to /gallery
2. Server Component fetches gallery items + filter options
3. Gallery renders with all items (or filtered if URL params present)
4. User interacts with filters → URL updates → page re-fetches filtered data
5. User clicks gallery card → navigates to marble detail OR directly to configurator
```

**Marble Discovery Flow:**
```
1. User clicks marble card in gallery
2. Navigate to /marble/{slug}
3. Server Component fetches marble with finishes
4. Detail page renders with specs, imagery, CTA
5. User clicks "Create My Cube" → navigates to /configurator?marble={slug}
```

**Pre-selection Flow (Gallery → Configurator):**
```
1. User on gallery or marble detail
2. User clicks "Configure with this marble"
3. Navigate to /configurator?marble={slug}
4. Configurator reads URL param, initializes store with marble
5. 3D view loads with selected marble texture
```

## Non-Functional Requirements

### Performance

| Requirement | Target | Implementation |
|-------------|--------|----------------|
| Gallery load time | < 2s | Server Components, optimized images |
| Image lazy loading | Progressive | `next/image` with priority for above-fold |
| Filter response | < 300ms | Server-side filtering, minimal JS |
| Marble detail page | < 2s | Static generation with ISR |
| Texture preloading | Smooth transitions | Preload adjacent marble textures |

**Image Optimization:**
- Use `next/image` with `sizes` prop for responsive images
- Gallery thumbnails: 400×400px WebP
- Detail heroes: 1200×800px WebP
- 3D textures: 2K JPG (loaded separately in Epic 3)

### Security

| Concern | Mitigation |
|---------|------------|
| SQL Injection | Prisma parameterized queries |
| XSS | React auto-escaping, sanitized JSON content |
| Path traversal | Slug validation, no user-provided file paths |

### Reliability/Availability

| Scenario | Handling |
|----------|----------|
| Database unavailable | Error boundary with retry message |
| Image CDN failure | Fallback placeholder images |
| Invalid marble slug | 404 page with gallery redirect |
| Empty filter results | Friendly empty state with clear filter CTA |

### Observability

| Signal | Implementation |
|--------|----------------|
| Page views | Vercel Analytics (built-in) |
| Filter usage | URL params in analytics |
| Popular marbles | Track marble detail page views |
| Error tracking | Vercel error logging |

## Dependencies and Integrations

| Dependency | Version | Purpose |
|------------|---------|---------|
| `next` | 16.0.7 | App Router, Server Components |
| `@prisma/client` | 7.1.0 | Database queries |
| `next-intl` | 4.5.8 | Multilingual content resolution |
| `next/image` | (bundled) | Image optimization |
| `lucide-react` | 0.555.0 | Icons for filters, navigation |
| `tailwindcss` | 4.x | Styling |
| `clsx` + `tailwind-merge` | Latest | Class utilities |

**External Integrations:**
- **Vercel CDN:** Automatic static asset caching
- **Supabase PostgreSQL:** Marble/Gallery data storage

**Internal Dependencies:**
- **Epic 1 Foundation:** Layout, design system, i18n, Prisma setup (COMPLETED)
- **Story 2.2 → 2.3+:** Textures must exist before gallery can display

## Acceptance Criteria (Authoritative)

### Story 2.1: Marble Data Seeding & Constants

1. **AC-2.1.1:** Running `npm run db:seed` creates 10 marble types with multilingual names/descriptions
2. **AC-2.1.2:** Each marble has accurate density (kg/m³), base price (cents/cm³), origin country
3. **AC-2.1.3:** Each marble has textureFolder matching `/public/textures/{slug}/`
4. **AC-2.1.4:** Each marble has 2-4 finishes with price modifiers
5. **AC-2.1.5:** `src/constants/marbles.ts` exports MIN_DIMENSION=5, MAX_DIMENSION=100, FINISH_TYPES

### Story 2.2: Marble Texture Assets

6. **AC-2.2.1:** Each marble has `/public/textures/{slug}/diffuse.jpg` (2K minimum)
7. **AC-2.2.2:** Each marble has `/public/textures/{slug}/normal.jpg`
8. **AC-2.2.3:** Each marble has `/public/textures/{slug}/roughness.jpg`
9. **AC-2.2.4:** Each marble has `/public/textures/{slug}/preview.jpg` (400×400px)
10. **AC-2.2.5:** Images load correctly via `next/image` with optimization

### Story 2.3: Inspiration Gallery Page

11. **AC-2.3.1:** `/[locale]/gallery` renders responsive grid (3-col desktop, 2-col mobile)
12. **AC-2.3.2:** Each card shows image, marble name on hover, price indicator
13. **AC-2.3.3:** Featured items are visually distinguished (larger or first position)
14. **AC-2.3.4:** Hover animations are smooth (per UX spec 6.1)
15. **AC-2.3.5:** Cards are clickable, navigating to marble detail page
16. **AC-2.3.6:** Loading state shows skeleton shimmer, no spinners

### Story 2.4: Gallery Filtering

17. **AC-2.4.1:** Filter controls for marble type, finish, use case are visible
18. **AC-2.4.2:** Selecting a filter updates URL params and re-fetches results
19. **AC-2.4.3:** Multiple filters combine with AND logic
20. **AC-2.4.4:** Active filters are visually indicated
21. **AC-2.4.5:** "Clear filters" button resets all filters
22. **AC-2.4.6:** Empty results show friendly message with clear filters CTA
23. **AC-2.4.7:** URL is shareable/bookmarkable with filter state

### Story 2.5: Marble Detail Page

24. **AC-2.5.1:** `/[locale]/marble/[slug]` renders with hero image
25. **AC-2.5.2:** Marble name uses Cormorant Garamond typography
26. **AC-2.5.3:** Origin story and characteristics description are displayed
27. **AC-2.5.4:** Technical specs shown: origin country, available finishes
28. **AC-2.5.5:** Price range indicator ("From X € to Y €") is visible
29. **AC-2.5.6:** "Create My Cube" CTA button is prominent (gold, per UX spec)
30. **AC-2.5.7:** Page follows Carrara Pure theme (white, elegant spacing)
31. **AC-2.5.8:** Images are zoomable via lightbox on click

### Story 2.6: Gallery to Configurator Navigation

32. **AC-2.6.1:** Clicking "Create My Cube" navigates to `/configurator?marble={slug}`
33. **AC-2.6.2:** Theme transition from light (gallery) to dark (configurator) is smooth (0.5s)
34. **AC-2.6.3:** Invalid/missing marble slug defaults to first available marble
35. **AC-2.6.4:** Configurator marble selector shows pre-selected marble as active

## Traceability Mapping

| AC | Spec Section | Component(s) | Test Idea |
|----|--------------|--------------|-----------|
| AC-2.1.1-5 | Data Models | `prisma/seed.ts`, `src/constants/marbles.ts` | Unit: verify seed creates 10 marbles with all fields |
| AC-2.2.1-5 | Data Models | `/public/textures/` | E2E: all marble texture paths resolve 200 |
| AC-2.3.1-6 | Services/Modules | `MarbleGrid`, `MarbleCard` | E2E: gallery loads, cards render, responsive |
| AC-2.4.1-7 | APIs/Interfaces | `FilterPanel`, `getGalleryItems` | E2E: filters update URL, results filter |
| AC-2.5.1-8 | Services/Modules | `marble/[slug]/page.tsx` | E2E: detail page renders all spec sections |
| AC-2.6.1-4 | Workflows | Navigation, URL params | E2E: click CTA → configurator loads with marble |

## Risks, Assumptions, Open Questions

### Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Texture files missing for some marbles | High - 3D won't render | Validate texture existence in CI, fallback textures |
| Large texture files slow initial load | Medium - poor UX | Progressive loading, compressed previews |
| Multilingual content incomplete | Medium - display issues | Default to English if locale missing |

### Assumptions

- **A1:** Texture assets will be provided/sourced before Story 2.2 implementation
- **A2:** ~10 marbles is sufficient for MVP launch
- **A3:** Price per cm³ model is accurate for real pricing (to be validated with Sacha)
- **A4:** Gallery items will be seeded initially; admin management comes in Epic 7

### Open Questions

| Question | Owner | Impact |
|----------|-------|--------|
| Q1: Exact pricing formula confirmed? | Sacha | Story 2.1 pricing data |
| Q2: Marble texture source/licensing? | Sacha | Story 2.2 assets |
| Q3: Specific density values per marble? | Sacha | Story 2.1 seed data |

## Test Strategy Summary

### Test Levels

| Level | Scope | Framework |
|-------|-------|-----------|
| Unit | Seed script, query functions, components | Vitest |
| Integration | Database queries with Prisma | Vitest + Prisma test utils |
| E2E | Full gallery/detail page flows | Playwright |

### Coverage of Acceptance Criteria

| Stories | Test Approach |
|---------|---------------|
| 2.1 | Unit test seed script output; verify all 10 marbles created |
| 2.2 | File existence check; image optimization validation |
| 2.3-2.4 | E2E: navigate to gallery, verify cards, interact with filters |
| 2.5 | E2E: navigate to detail page, verify all sections render |
| 2.6 | E2E: click CTA, verify navigation with marble param |

### Critical Paths

1. **Gallery → Detail → Configurator:** Full discovery flow works end-to-end
2. **Filtering:** All filter combinations return correct results
3. **i18n:** Content displays correctly in all 5 locales
4. **Responsive:** Gallery grid adapts correctly on mobile/desktop

### Edge Cases

- Empty gallery (no items seeded)
- Invalid marble slug in URL
- All filters selected with no matching items
- Missing texture files
- Very long marble names (truncation)

