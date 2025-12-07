# Story 2.3: Inspiration Gallery Page

Status: done

## Story

As a **user**,
I want **to browse an inspiration gallery showcasing marble cubes in real settings**,
So that **I can discover possibilities and find marbles that appeal to me before configuring my own cube**.

## Acceptance Criteria

1. **AC1:** Gallery route `/[locale]/gallery` renders a responsive grid
   - Desktop: 3-column grid with 24px gaps
   - Mobile: 2-column grid with 16px gaps
   - Cards resize proportionally across breakpoints

2. **AC2:** Each gallery card displays
   - High-quality lifestyle image from GalleryItem
   - Marble name revealed on hover (desktop) or always visible (mobile)
   - "From X €" starting price indicator
   - Use case category badge (optional display)

3. **AC3:** Featured items are visually distinguished
   - Featured items appear first in display order
   - Featured items have larger card size or special styling
   - `featured: true` from GalleryItem model determines status

4. **AC4:** Hover animations follow UX spec 6.1
   - Smooth scale transform on hover (1.02 scale)
   - Overlay fade-in with marble name and price
   - Transition duration: 0.3s with ease-out timing
   - No animations on mobile (tap to show info instead)

5. **AC5:** Cards are clickable and navigate to marble detail page
   - Click navigates to `/[locale]/marble/[slug]`
   - If no marble associated, card shows gallery item info only
   - Smooth page transition animation (Carrara Pure theme)

6. **AC6:** Loading state shows skeleton shimmer
   - No spinners per UX spec
   - Skeleton cards match actual card dimensions
   - Shimmer animation for loading indication
   - Skeleton disappears with fade once data loads

## Tasks / Subtasks

- [x] **Task 1: Create gallery route and page structure** (AC: #1)
  - [x] 1.1: Create `src/app/[locale]/gallery/page.tsx` with Server Component
  - [x] 1.2: Set up page metadata (title, description) with translations
  - [x] 1.3: Create responsive container with CSS Grid (3-col → 2-col)
  - [x] 1.4: Add page header with title "Inspiration" in Cormorant Garamond

- [x] **Task 2: Create gallery data query functions** (AC: #2, #3)
  - [x] 2.1: Create `src/lib/queries/gallery.ts` with `getGalleryItems()` function
  - [x] 2.2: Implement locale-aware JSON field resolution for title/description
  - [x] 2.3: Add sorting logic (featured first, then by `order` field)
  - [x] 2.4: Join with Marble table to get marble slug and pricing data
  - [x] 2.5: Create `GalleryItemLocalized` type in `src/types/gallery.ts`

- [x] **Task 3: Create MarbleCard component** (AC: #2, #4, #5)
  - [x] 3.1: Create `src/components/gallery/MarbleCard.tsx`
  - [x] 3.2: Implement image display with `next/image` optimization
  - [x] 3.3: Add hover overlay with marble name and "À partir de X €"
  - [x] 3.4: Implement smooth scale/opacity transitions per UX spec
  - [x] 3.5: Add click handler with navigation to marble detail page
  - [x] 3.6: Conditionally hide hover effects on mobile (responsive)

- [x] **Task 4: Create MarbleGrid component** (AC: #1, #3)
  - [x] 4.1: Create `src/components/gallery/MarbleGrid.tsx`
  - [x] 4.2: Implement responsive CSS Grid layout
  - [x] 4.3: Handle featured items with larger sizing or special placement
  - [x] 4.4: Add proper semantic HTML (section, article)

- [x] **Task 5: Create gallery skeleton loading state** (AC: #6)
  - [x] 5.1: Create `src/components/gallery/GalleryCardSkeleton.tsx`
  - [x] 5.2: Implement shimmer animation matching card dimensions
  - [x] 5.3: Create `src/components/gallery/GalleryGridSkeleton.tsx`
  - [x] 5.4: Add Suspense boundary in gallery page

- [x] **Task 6: Seed initial gallery items** (AC: #2, #3)
  - [x] 6.1: Add gallery items to `prisma/seed.ts`
  - [x] 6.2: Create 10+ gallery items with variety of use cases
  - [x] 6.3: Mark 2-3 items as featured
  - [x] 6.4: Associate each item with a marble from the catalog
  - [x] 6.5: Add multilingual titles/descriptions (en, fr, it, es, de)

- [x] **Task 7: Add gallery translations** (AC: #2)
  - [x] 7.1: Add gallery page translations to all locale message files
  - [x] 7.2: Include "À partir de" / "From" price format strings
  - [x] 7.3: Add use case category translations

- [x] **Task 8: Integration testing** (AC: #1-#6) ✅ RESOLVED
  - [x] 8.1: Verify gallery loads with all marble cards → ✅ 12 cards displayed
  - [x] 8.2: Test responsive layout on mobile/desktop viewports → ✅ 3-col grid works
  - [x] 8.3: Verify hover animations work correctly on desktop → ✅ Hover working
  - [x] 8.4: Test navigation from gallery card to marble detail page → ✅ Links to /marble/[slug]
  - [x] 8.5: Verify skeleton loading appears before data loads → ✅ Skeleton displayed during async load

## Dev Notes

### Architecture Patterns & Constraints

This story creates the gallery discovery experience following these patterns:

- **Server Components:** Gallery page uses Server Components for SEO and performance (per Architecture ADR-005)
- **Image Optimization:** All gallery images via `next/image` with automatic WebP conversion
- **Locale Resolution:** JSON fields (title, description) resolved at query time using current locale
- **Static Generation:** Consider `generateStaticParams` for gallery if items are stable

### Component Hierarchy

```
/[locale]/gallery (page.tsx - Server Component)
├── GalleryHeader (title, optional filter trigger)
├── Suspense boundary
│   └── GalleryGridSkeleton (loading state)
└── MarbleGrid
    └── MarbleCard (× N)
        ├── next/image (lifestyle photo)
        ├── HoverOverlay
        │   ├── MarbleName
        │   └── PriceIndicator
        └── Link → /marble/[slug]
```

### Styling Guidelines

Per UX Specification section 6.1:
- Cards have subtle shadow on hover
- Scale transform: `scale(1.02)` on hover
- Overlay appears with `opacity: 0 → 1`, duration `0.3s ease-out`
- Gold accent (#C9A962) for price text
- Cormorant Garamond for marble names
- Inter for price and body text

### Image Requirements

- Gallery images should be 4:3 or 3:2 aspect ratio for lifestyle shots
- Images stored in `/public/images/gallery/` or use `hero.jpg` from texture folders
- Optimize for gallery grid: ~800×600px source images sufficient
- Use `priority` prop for above-fold cards (first 6)

### Project Structure Notes

**New directories:**
- `src/components/gallery/` - Gallery-specific components
- `src/lib/queries/` - Server-side query functions

**New files:**
- `src/app/[locale]/gallery/page.tsx` - Gallery route
- `src/components/gallery/MarbleCard.tsx` - Gallery card component
- `src/components/gallery/MarbleGrid.tsx` - Grid layout component
- `src/components/gallery/GalleryCardSkeleton.tsx` - Loading skeleton
- `src/components/gallery/GalleryGridSkeleton.tsx` - Grid skeleton
- `src/lib/queries/gallery.ts` - Gallery data queries
- `src/types/gallery.ts` - Gallery-related types

### Learnings from Previous Story

**From Story 2-2-marble-texture-assets (Status: done)**

- **Texture Utilities Created**: `src/lib/textures.ts` provides type-safe texture access
  - Use `getTextureUrl(slug, 'preview')` for gallery thumbnails
  - Use `getTextureUrl(slug, 'hero')` for larger gallery images
- **Available Image Types**: `preview.jpg` (400×400) and `hero.jpg` (1200×800) per marble
- **Marble Slugs Available**: 10 marbles with consistent slug pattern (e.g., `carrara-white`, `nero-marquina`)
- **Files to REUSE (not recreate)**:
  - `src/lib/textures.ts` - Import texture helpers for image paths
  - `src/types/marble.ts` - Use existing marble types
  - `src/constants/marbles.ts` - Import marble-related constants
- **Image Format**: PNG for 3D textures, JPEG for UI images (preview.jpg, hero.jpg)
- **Total Texture Budget**: 20.86 MB used of 60 MB budget - plenty of room

[Source: docs/sprint-artifacts/2-2-marble-texture-assets.md#Dev-Agent-Record]

### Price Calculation for Gallery Cards

The "From X €" price indicator should show the minimum price for a standard cube:
- Base calculation: `10×10×10 cm cube × basePricePerCm3 / 100` (cents to euros)
- Use cheapest finish modifier for "from" price
- Format with locale-aware Intl.NumberFormat

### GalleryItem Model Reference

```prisma
model GalleryItem {
  id          String   @id @default(uuid())
  marbleId    String?
  title       Json     // { en: "...", fr: "...", ... }
  description Json     // { en: "...", fr: "...", ... }
  imageUrl    String
  useCase     String?  // "coffee-table" | "side-table" | "column" | "decorative"
  featured    Boolean  @default(false)
  order       Int      @default(0)
  createdAt   DateTime @default(now())
}
```

### References

- [Source: docs/sprint-artifacts/tech-spec-epic-2.md#Story-2.3] - AC-2.3.1 through AC-2.3.6
- [Source: docs/epics.md#Story-2.3] - Story definition and acceptance criteria
- [Source: docs/ux-design-specification.md#6.1] - Component patterns for MarbleCard
- [Source: docs/ux-design-specification.md#7.1] - Feedback patterns (skeleton loading)
- [Source: docs/architecture.md#Project-Structure] - Component and route organization
- [Source: docs/architecture.md#ADR-005] - Server Actions/Components pattern

## Dev Agent Record

### Context Reference

- docs/sprint-artifacts/2-3-inspiration-gallery-page.context.xml

### Agent Model Used

Claude Opus 4.5 (via Cursor)

### Debug Log References

- Transaction timeout in seed resolved by removing $transaction wrapper
- Supabase "Tenant or user not found" error RESOLVED: Wrong pooler region in .env.local (aws-0 vs aws-1)
- Modified src/lib/prisma.ts to use DIRECT_URL as priority over DATABASE_URL

### Completion Notes List

- ✅ Created gallery types (`src/types/gallery.ts`) with `GalleryItemLocalized` interface
- ✅ Created gallery query functions (`src/lib/queries/gallery.ts`) with locale-aware resolution
- ✅ Created `MarbleCard` component with hover overlay, price formatting, UX spec animations
- ✅ Created `MarbleGrid` component with responsive 3-col/2-col grid
- ✅ Created skeleton loading components (`GalleryCardSkeleton`, `GalleryGridSkeleton`)
- ✅ Created `GalleryEmpty` component for empty state
- ✅ Created gallery page with Suspense boundary and Server Components
- ✅ Added shimmer animation to globals.css
- ✅ Added gallery translations to all 5 locale files (en, fr, de, es, it)
- ✅ Updated seed.ts with 12 gallery items (3 featured) with multilingual data
- ✅ TypeScript compilation passes with no errors
- ✅ Integration testing (Task 8) COMPLETE - All ACs verified
- ✅ Fixed Supabase connection: .env.local had wrong pooler region (aws-0 → aws-1)
- ✅ Modified prisma.ts to prioritize DIRECT_URL for better pg driver compatibility

### File List

**New files:**
- `src/types/gallery.ts`
- `src/lib/queries/gallery.ts`
- `src/components/gallery/MarbleCard.tsx`
- `src/components/gallery/MarbleGrid.tsx`
- `src/components/gallery/GalleryCardSkeleton.tsx`
- `src/components/gallery/GalleryGridSkeleton.tsx`
- `src/components/gallery/GalleryEmpty.tsx`
- `src/components/gallery/index.ts`
- `src/app/[locale]/gallery/page.tsx`

**Modified files:**
- `src/app/globals.css` (added shimmer animation)
- `src/messages/en.json` (added gallery translations)
- `src/messages/fr.json` (added gallery translations)
- `src/messages/de.json` (added gallery translations)
- `src/messages/es.json` (added gallery translations)
- `src/messages/it.json` (added gallery translations)
- `prisma/seed.ts` (added gallery items)
- `docs/sprint-artifacts/sprint-status.yaml` (status: in-progress)

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2025-12-05 | Story drafted from Epic 2 tech-spec, architecture, UX spec, and Story 2-2 learnings | SM Agent (Bob) |
| 2025-12-05 | Implemented Tasks 1-7: gallery page, components, queries, translations, seed data | Dev Agent (Amelia) |
| 2025-12-06 | Fixed Supabase connection (aws-0→aws-1), completed Task 8, marked story DONE | Dev Agent (Amelia) |

