# Story 3.2: Zustand Configuration Store

Status: done

## Story

As a **developer**,
I want **a centralized state store for cube configuration with persistence and derived calculations**,
So that **all components stay synchronized, state persists across sessions, and price/weight calculations are automated and accurate**.

## Acceptance Criteria

1. **AC1:** Zustand store manages all cube configuration state
   - `marbleSlug`: string (selected marble slug, from URL param or default)
   - `width`: number (cm, constrained 5-100)
   - `height`: number (cm, constrained 5-100)
   - `depth`: number (cm, constrained 5-100)
   - `finish`: FinishType enum (POLISHED, HONED, RAW, BRUSHED)
   - All values initialized with sensible defaults

2. **AC2:** Derived values auto-calculate when inputs change
   - `calculatedWeight`: number (kg) derived from dimensions × density
   - `calculatedPrice`: number (cents) derived from volume × basePricePerCm3 × finishModifier
   - Calculations update within 200ms of input change (NFR4)
   - Values recalculate when marble type, dimensions, or finish change

3. **AC3:** State persists to localStorage via Zustand persist middleware
   - User can close browser and return to find their configuration intact
   - Persistence key: `marmorani-config`
   - Partial persistence (exclude calculated values - regenerate on hydration)

4. **AC4:** URL parameter `?marble={slug}` initializes marbleSlug on first load
   - If URL param exists and marble is valid, use it
   - If URL param invalid or missing, use default (first available marble)
   - URL param takes precedence over localStorage on initial load
   - Store syncs with URL when marble changes from configurator

5. **AC5:** Store provides typed actions for state mutations
   - `setMarble(slug: string)`: validates and sets marble, triggers recalculation
   - `setDimensions(width?, height?, depth?)`: validates and sets dimensions
   - `setFinish(finish: FinishType)`: sets finish, triggers price recalculation
   - `resetConfiguration()`: resets all values to defaults
   - Actions enforce manufacturing constraints (5-100 cm)

6. **AC6:** Marble data integration for calculations
   - Store fetches/accesses marble density and basePricePerCm3 for selected marble
   - Store fetches/accesses finish price modifiers for selected marble
   - Data sourced from constants or Prisma query (client-accessible)

7. **AC7:** Store selector hooks for optimized re-renders
   - `useConfigStore.getState()` for non-reactive access
   - Individual selectors for each field to minimize re-renders
   - `useConfiguredCube()` selector for full configuration object

## Tasks / Subtasks

- [x] **Task 1: Extend existing configStore with full state model** (AC: #1)
  - [x] 1.1: Review existing `src/stores/configStore.ts` from Story 2-6
  - [x] 1.2: Add TypeScript interfaces for ConfigState, ConfigActions
  - [x] 1.3: Add `calculatedWeight` and `calculatedPrice` derived state fields
  - [x] 1.4: Set default values (first marble, 20×20×20cm, POLISHED)
  - [x] 1.5: Ensure all fields are properly typed with FinishType enum

- [x] **Task 2: Implement calculation logic for weight and price** (AC: #2, #6)
  - [x] 2.1: Create `src/lib/calculations/cubeCalculations.ts`
  - [x] 2.2: Implement `calculateWeight(width, height, depth, density)` function
  - [x] 2.3: Implement `calculatePrice(volume, basePricePerCm3, finishModifier)` function
  - [x] 2.4: Add marble data lookup (density, basePricePerCm3) from constants
  - [x] 2.5: Add finish modifier lookup from constants
  - [x] 2.6: Integrate calculations into store with automatic recalculation
  - [x] 2.7: Debouncing not needed - calculations are synchronous and instant

- [x] **Task 3: Configure persist middleware with localStorage** (AC: #3)
  - [x] 3.1: Review existing persist configuration in configStore
  - [x] 3.2: Configure `partialize` to exclude derived values
  - [x] 3.3: Configure `onRehydrateStorage` to trigger recalculation after hydration
  - [x] 3.4: Add storage key `marmorani-config`
  - [x] 3.5: Handle SSR hydration edge cases (skip persist on server)

- [x] **Task 4: Implement URL parameter initialization** (AC: #4)
  - [x] 4.1: ConfiguratorClient.tsx already reads URL `marble` param on mount
  - [x] 4.2: initializeFromUrl() calls setMarble internally with recalculation
  - [x] 4.3: Server-side validation via validateMarbleSlug in page.tsx
  - [x] 4.4: Server falls back to first available marble if URL param invalid
  - [x] 4.5: URL param takes precedence - initializeFromUrl called after hydration

- [x] **Task 5: Implement typed store actions** (AC: #5)
  - [x] 5.1: Implement `setMarble(slug)` with validation and recalculation
  - [x] 5.2: Implement `setDimensions({width?, height?, depth?})` with constraint clamping
  - [x] 5.3: Implement `setFinish(finish)` with recalculation trigger
  - [x] 5.4: Implement `resetConfiguration()` to restore defaults
  - [x] 5.5: Add manufacturing constraint validation (MIN=5, MAX=100)
  - [x] 5.6: Log warnings for invalid values (dev mode only)

- [x] **Task 6: Create marble data constants for calculations** (AC: #6)
  - [x] 6.1: Extend `src/constants/marbles.ts` with MARBLE_DATA lookup
  - [x] 6.2: Add density (kg/m³) and basePricePerCm3 (cents) for each marble
  - [x] 6.3: FINISH_PRICE_MODIFIERS already exists from previous story
  - [x] 6.4: Constants match seeded database values in prisma/seed.ts
  - [x] 6.5: Export MarbleConstants type and getMarbleConstants helper

- [x] **Task 7: Create optimized selector hooks** (AC: #7)
  - [x] 7.1: Create individual field selectors (useMarbleSlug, useWidth, etc.)
  - [x] 7.2: Create `useConfiguredCube()` composite selector
  - [x] 7.3: Create `useCalculatedValues()` selector for weight + price
  - [x] 7.4: Document selector usage patterns in code comments
  - [x] 7.5: Export all selectors from store file

- [x] **Task 8: Integration and testing** (AC: #1-#7)
  - [x] 8.1: Test localStorage persistence - verified via browser DevTools
  - [x] 8.2: Test URL parameter initialization - ?marble=nero-marquina works
  - [x] 8.3: Calculation logic implemented with correct formulas
  - [x] 8.4: Constraint enforcement via clampDimension (5-100cm)
  - [x] 8.5: Calculations are synchronous - well under 200ms
  - [x] 8.6: TypeScript compiles with no errors
  - [x] 8.7: Build succeeds (npm run build passed)

## Dev Notes

### Architecture Patterns & Constraints

Per Architecture document, Zustand is the chosen state management solution:
- Lightweight with persist middleware for localStorage
- Works well with React Server Components (hydration-safe)
- Selector pattern for optimized re-renders

**Weight Formula (from Architecture):**
```
weight_kg = (width × height × depth) × density / 1,000,000
```
Where density is in kg/m³ and dimensions are in cm.

**Price Formula (from Architecture):**
```
price_cents = basePricePerCm3 × volume × finishModifier
```
Where volume = width × height × depth (cm³).

### Learnings from Previous Story

**From Story 3-1-configurator-page-shell-theme (Status: done)**

- **ConfiguratorClient Exists**: `src/components/configurator/ConfiguratorClient.tsx` - Client wrapper where URL param reading should happen
- **ConfiguratorLayout Handles Responsive**: Uses useEffect + window.innerWidth for mobile detection
- **Zustand Store Partially Exists**: `src/stores/configStore.ts` from Story 2-6 has basic fields (`marbleSlug`, `width`, `height`, `depth`, `finish`) with persist middleware
- **Marble Validation Ready**: `src/lib/queries/configurator.ts` has `validateMarbleSlug()` and `getFirstAvailableMarbleSlug()`
- **Dark Theme Applied**: `.dark` class on ConfiguratorClient triggers Nero Marquina tokens
- **Placeholder Sections Ready**: ConfigPanel has MarbleSelector, DimensionInputs, FinishPicker, PriceDisplay placeholders ready to receive store data

**From Story 2-6-gallery-to-configurator-navigation:**
- Existing configStore has persist middleware with `marmorani-config` key
- URL param `?marble={slug}` is already used to initialize from gallery navigation

**Files to Extend/Modify:**
- `src/stores/configStore.ts` - Extend with calculations, better typing, selectors
- `src/constants/marbles.ts` - Add MARBLE_DATA with density and pricing
- `src/components/configurator/ConfiguratorClient.tsx` - Ensure URL param sync on mount

**Files to Create:**
- `src/lib/calculations/cubeCalculations.ts` - Pure calculation functions

### Component Integration (for future stories)

This store will be consumed by Stories 3.5-3.8:
- **Story 3.5 DimensionInputs**: Uses `width`, `height`, `depth`, `setDimensions`
- **Story 3.6 MarbleSelector**: Uses `marbleSlug`, `setMarble`
- **Story 3.7 FinishPicker**: Uses `finish`, `setFinish`
- **Story 3.8 PriceDisplay**: Uses `calculatedPrice`, `calculatedWeight`
- **Story 3.3 CubeViewer**: Uses `marbleSlug`, `width`, `height`, `depth`, `finish` for 3D rendering

### Marble Data Structure

```typescript
// src/constants/marbles.ts
export const MARBLE_DATA: Record<string, MarbleConstants> = {
  'carrara': {
    density: 2700,        // kg/m³
    basePricePerCm3: 15,  // cents
  },
  'nero-marquina': {
    density: 2750,
    basePricePerCm3: 18,
  },
  // ... other marbles
};

export const FINISH_MODIFIERS: Record<FinishType, number> = {
  POLISHED: 1.0,
  HONED: 0.95,
  RAW: 0.90,
  BRUSHED: 1.05,
};
```

### Store Type Definitions

```typescript
// src/stores/configStore.ts
interface ConfigState {
  // Core configuration
  marbleSlug: string;
  width: number;
  height: number;
  depth: number;
  finish: FinishType;
  
  // Derived (calculated) values
  calculatedWeight: number;
  calculatedPrice: number;
}

interface ConfigActions {
  setMarble: (slug: string) => void;
  setDimensions: (dims: Partial<Pick<ConfigState, 'width' | 'height' | 'depth'>>) => void;
  setFinish: (finish: FinishType) => void;
  resetConfiguration: () => void;
  recalculate: () => void;
}
```

### Project Structure Notes

**Alignment with unified project structure:**
- Store in `src/stores/configStore.ts` (existing location)
- Calculation helpers in `src/lib/calculations/` (new directory)
- Constants in `src/constants/marbles.ts` (existing file to extend)
- Types in store file or `src/types/config.ts` if separate

**Detected conflicts or variances:**
- Story 2-6 already created basic configStore - this story extends rather than replaces

### References

- [Source: docs/epics.md#Story-3.2] - Story definition, prerequisites, technical notes
- [Source: docs/architecture.md#Technology-Stack-Details] - Zustand configuration
- [Source: docs/architecture.md#Data-Architecture] - Price/weight formulas
- [Source: docs/PRD.md#FR13] - Weight calculation requirement
- [Source: docs/PRD.md#FR14] - Price calculation requirement
- [Source: docs/PRD.md#NFR4] - Real-time calculation performance (< 200ms)
- [Source: docs/sprint-artifacts/3-1-configurator-page-shell-theme.md#Dev-Agent-Record] - Previous story learnings

## Dev Agent Record

### Context Reference

- `docs/sprint-artifacts/3-2-zustand-configuration-store.context.xml`

### Agent Model Used

Claude Opus 4.5

### Debug Log References

- Browser tests validated AC1-AC7 via localhost:3000/fr/configurator

### Completion Notes List

- Implemented full Zustand configuration store with derived calculations
- Weight formula: `(width × height × depth) × density / 1,000,000` (kg)
- Price formula: `volume × basePricePerCm3 × finishModifier` (cents)
- localStorage persistence excludes derived values (calculatedWeight, calculatedPrice)
- Derived values recalculate on hydration via onRehydrateStorage callback
- Optimized selector hooks minimize re-renders for consuming components
- MARBLE_DATA constants match seeded database values exactly
- URL param initialization handled via existing ConfiguratorClient flow

### File List

**New Files:**
- `src/lib/calculations/cubeCalculations.ts` - Pure calculation functions

**Modified Files:**
- `src/stores/configStore.ts` - Extended with derived state, recalculation, selectors
- `src/constants/marbles.ts` - Added MARBLE_DATA, MarbleConstants type, getMarbleConstants

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2025-12-06 | Story drafted from epics.md, PRD, architecture, UX spec, and Story 3-1 learnings | SM Agent (Bob) |
| 2025-12-06 | Implemented all tasks (1-8), all ACs satisfied, TypeScript builds clean | Dev Agent (Amelia) |
| 2025-12-06 | Senior Developer Review notes appended - APPROVED | Dev Agent (Amelia) |

---

## Senior Developer Review (AI)

### Review Metadata
- **Reviewer:** Sacha
- **Date:** 2025-12-06
- **Agent Model:** Claude Opus 4.5
- **Outcome:** ✅ **APPROVED**

### Summary

Excellent implementation of the Zustand configuration store. All 7 acceptance criteria are fully implemented with proper TypeScript typing, optimized selectors, and synchronized data between client constants and database seed. The code follows architectural patterns and naming conventions established in the project.

### Outcome: APPROVE ✅

**Justification:** All acceptance criteria implemented and verified with file:line evidence. All tasks marked complete are verified as actually done. No HIGH or MEDIUM severity issues found. Code quality is excellent with proper documentation, TypeScript safety, and dev-only logging.

### Key Findings

**No HIGH or MEDIUM severity issues found.**

#### Low Severity (Advisory)
- Note: Weight rounding uses `Math.round(weightKg * 100) / 100` - valid approach, consider `toFixed(2)` for consistency if needed elsewhere
- Note: `calculateDerivedValues` could benefit from memoization if performance becomes a concern (currently instant, synchronous)

### Acceptance Criteria Coverage

| AC# | Description | Status | Evidence |
|-----|-------------|--------|----------|
| AC1 | Zustand store manages all cube config state | ✅ IMPLEMENTED | `configStore.ts:31-48` ConfigState interface |
| AC2 | Derived values auto-calculate | ✅ IMPLEMENTED | `cubeCalculations.ts:35-48` (weight), `:65-74` (price) |
| AC3 | State persists via localStorage | ✅ IMPLEMENTED | `configStore.ts:376-411` persist middleware |
| AC4 | URL param initialization | ✅ IMPLEMENTED | `ConfiguratorClient.tsx:50-58`, `configStore.ts:318-333` |
| AC5 | Typed actions with constraints | ✅ IMPLEMENTED | `configStore.ts:182-352` all actions |
| AC6 | Marble data integration | ✅ IMPLEMENTED | `marbles.ts:86-127` MARBLE_DATA |
| AC7 | Optimized selector hooks | ✅ IMPLEMENTED | `configStore.ts:425-491` selectors |

**Summary: 7 of 7 acceptance criteria fully implemented**

### Task Completion Validation

| Task | Marked As | Verified As | Evidence |
|------|-----------|-------------|----------|
| Task 1: State model | [x] Complete | ✅ VERIFIED | `configStore.ts:31-99` |
| Task 2: Calculation logic | [x] Complete | ✅ VERIFIED | `cubeCalculations.ts:35-162` |
| Task 3: Persist middleware | [x] Complete | ✅ VERIFIED | `configStore.ts:376-411` |
| Task 4: URL initialization | [x] Complete | ✅ VERIFIED | `ConfiguratorClient.tsx:50-58` |
| Task 5: Typed actions | [x] Complete | ✅ VERIFIED | `configStore.ts:182-374` |
| Task 6: Marble constants | [x] Complete | ✅ VERIFIED | `marbles.ts:73-139` |
| Task 7: Selector hooks | [x] Complete | ✅ VERIFIED | `configStore.ts:414-491` |
| Task 8: Integration/testing | [x] Complete | ✅ VERIFIED | Build passes (exit 0), tsc --noEmit OK |

**Summary: 8 of 8 completed tasks verified, 0 questionable, 0 falsely marked complete**

### Test Coverage and Gaps

- ✅ TypeScript compilation validates type correctness
- ✅ Build succeeds (npm run build exit 0)
- ⚠️ No formal unit tests (vitest not configured per architecture doc)
- **Recommendation:** Add unit tests for `cubeCalculations.ts` functions when vitest is set up

### Architectural Alignment

- ✅ Zustand 5.x with persist middleware (per architecture.md)
- ✅ Selector pattern for optimized re-renders (per architecture.md)
- ✅ Constants in `src/constants/` (per project structure)
- ✅ Store in `src/stores/configStore.ts` (per project structure)
- ✅ Calculation helpers in `src/lib/calculations/` (new, appropriate location)
- ✅ Uses Prisma-generated `FinishType` enum from `src/generated/prisma/enums`
- ✅ Weight formula: `(width × height × depth) × density / 1,000,000` matches architecture.md
- ✅ Price formula: `volume × basePricePerCm3 × finishModifier` matches architecture.md
- ✅ Manufacturing constraints: 5-100cm enforced via `clampDimension()`

### Security Notes

- ✅ No security concerns identified
- ✅ Input validation via dimension clamping
- ✅ localStorage used for non-sensitive configuration data only
- ✅ No XSS vectors present
- ✅ Dev-only console logging properly gated

### Best-Practices and References

- [Zustand persist middleware docs](https://docs.pmnd.rs/zustand/integrations/persisting-store-data)
- [Zustand selector patterns](https://docs.pmnd.rs/zustand/guides/auto-generating-selectors)
- Project architecture: `docs/architecture.md` - Zustand configuration

### Action Items

**Advisory Notes:**
- Note: Consider adding unit tests for `calculateWeight` and `calculatePrice` when vitest is configured (Story 8.x or future)
- Note: MARBLE_DATA values are synchronized with seed - maintain this when adding new marbles

