# Story 3.7: Finish Picker

Status: ready-for-dev

## Story

As a **user**,
I want **to select the finish for my marble cube**,
So that **I can see how polished, honed, or raw surfaces look on my chosen marble**.

## Acceptance Criteria

1. **AC1:** Display available finishes for selected marble
   - Show finish options based on selected marble's `finishes` array from `MarbleFinish` relation
   - Finishes include: Polished, Honed, Raw, Brushed (if available for marble)
   - Unavailable finishes are hidden (not greyed out)
   - Update available finishes when marble selection changes

2. **AC2:** Finish option display with visual indicator
   - Each option shows finish name (localized via i18n)
   - Visual indicator or icon representing finish texture
   - Price modifier displayed if different from base (e.g., "+10%", "-5%")
   - Compact pill/button layout fitting the dark theme

3. **AC3:** 3D material updates on selection
   - Selecting a finish updates 3D material properties:
     - Polished: roughness = 0.1, high reflectivity
     - Honed: roughness = 0.5, matte surface
     - Raw: roughness = 0.9, natural texture
     - Brushed: roughness = 0.7, anisotropic (if applicable)
   - Material change visible within 500ms (NFR3)

4. **AC4:** Price recalculation with finish modifier
   - Price updates in real-time based on `finishModifier` (e.g., 1.0, 1.1, 0.95)
   - Formula: `basePricePerCm3 × volume × finishModifier`
   - Price display updates within 200ms (NFR4)

5. **AC5:** Selection state with gold highlight
   - Selected finish has gold (#C9A962) visual highlight (border or background)
   - Clear visual distinction from unselected options
   - Selection persists across re-renders

6. **AC6:** Keyboard navigation and accessibility
   - `role="radiogroup"` on container with `aria-label`
   - Each option has `role="radio"` with `aria-checked`
   - Arrow keys navigate between options
   - Enter/Space selects focused option
   - Visible focus ring on each option

7. **AC7:** Mobile-responsive layout
   - Horizontal row of options on all viewports
   - Touch targets minimum 44×44px
   - Text remains readable on small screens
   - Optional wrap to second row if many finishes

## Tasks / Subtasks

- [ ] **Task 1: Create FinishPicker component** (AC: #1, #5, #6)
  - [ ] 1.1: Create `src/components/configurator/FinishPicker.tsx`
  - [ ] 1.2: Fetch available finishes from marble data (MARBLE_DATA or store)
  - [ ] 1.3: Implement horizontal button/pill layout
  - [ ] 1.4: Add ARIA attributes (`role="radiogroup"`, `role="radio"`)
  - [ ] 1.5: Style selected option with gold highlight
  - [ ] 1.6: Add component to barrel export in `src/components/configurator/index.ts`

- [ ] **Task 2: Create FinishOption sub-component** (AC: #2, #5, #6)
  - [ ] 2.1: Create `src/components/configurator/FinishOption.tsx`
  - [ ] 2.2: Display finish name with i18n localization
  - [ ] 2.3: Show visual texture indicator (icon or subtle pattern)
  - [ ] 2.4: Display price modifier if != 1.0 ("+10%", "-5%")
  - [ ] 2.5: Implement selected/unselected visual states
  - [ ] 2.6: Add focus ring styling

- [ ] **Task 3: Connect to Zustand store** (AC: #3, #4)
  - [ ] 3.1: Use `useFinish` selector to read current finish
  - [ ] 3.2: Use `getState().setFinish()` action for SSR-safe updates
  - [ ] 3.3: Verify Zustand derived state recalculates price with modifier
  - [ ] 3.4: Confirm finish change reflects in 3D view

- [ ] **Task 4: Update 3D material for finish** (AC: #3)
  - [ ] 4.1: Modify `MarbleMaterial.tsx` or `CubeViewer.tsx` to read finish from store
  - [ ] 4.2: Apply roughness values based on finish type
  - [ ] 4.3: Test visual difference between all finish types
  - [ ] 4.4: Ensure transition is smooth (no jarring pop)

- [ ] **Task 5: Implement keyboard navigation** (AC: #6)
  - [ ] 5.1: Add ArrowLeft/ArrowRight key handlers
  - [ ] 5.2: Enter/Space to select focused option
  - [ ] 5.3: Implement roving tabindex pattern
  - [ ] 5.4: Test keyboard-only navigation

- [ ] **Task 6: Integrate into ConfigPanel** (AC: #1-#7)
  - [ ] 6.1: Add FinishPicker to ConfigPanel below MarbleSelector
  - [ ] 6.2: Add section heading "Finish" with i18n translation
  - [ ] 6.3: Style to match dark theme (Nero Marquina)
  - [ ] 6.4: Test responsive layout on mobile and desktop

- [ ] **Task 7: Add i18n translations** (AC: #2)
  - [ ] 7.1: Add finish picker translation keys in all locale files
  - [ ] 7.2: Add finish type names: Polished, Honed, Raw, Brushed
  - [ ] 7.3: Translate in: en, fr, de, it, es

- [ ] **Task 8: Testing and verification** (AC: #3, #4)
  - [ ] 8.1: Verify 3D material changes within 500ms (NFR3)
  - [ ] 8.2: Verify price recalculates with modifier < 200ms (NFR4)
  - [ ] 8.3: Test all finish types render correctly
  - [ ] 8.4: Verify TypeScript compiles without errors
  - [ ] 8.5: Verify production build succeeds

## Dev Notes

### Architecture Patterns & Constraints

Per Architecture document, the configurator uses:
- **Zustand** for state management (`src/stores/configStore.ts`)
- **Prisma/Constants** for marble data (`src/constants/marbles.ts`)
- **shadcn/ui patterns** for interactive components
- **Tailwind CSS** for styling with design tokens

**Performance Requirements (from NFRs):**
- NFR3: Finish changes reflect in 3D view within 500ms
- NFR4: Price calculations update in real-time (< 200ms)

**Component Pattern from architecture.md:**
```tsx
interface ComponentProps {
  // Props interface
}

export function Component({ prop1, prop2 }: ComponentProps) {
  // 1. Hooks first
  const { t } = useTranslations();
  const finish = useFinish();
  
  // 2. Derived state
  const availableFinishes = getAvailableFinishes(marbleSlug);
  
  // 3. Event handlers
  const handleSelect = (finishType: FinishType) => {
    useConfigStore.getState().setFinish(finishType);
  };
  
  // 4. Render
  return <div>...</div>;
}
```

### Learnings from Previous Story

**From Story 3-6-marble-type-selector (Status: review)**

- **SSR Hydration Pattern**: Use individual selectors (`useFinish`) and `getState()` for actions to avoid SSR hydration issues
  ```typescript
  import { useConfigStore } from '@/stores/configStore';
  const setFinish = useConfigStore.getState().setFinish;
  ```

- **Overlay Click Fix**: Use `pointer-events-none` on overlay container and `pointer-events-auto` on interactive elements

- **Accessibility Pattern**: Full radiogroup implementation with:
  - `role="radiogroup"` / `role="radio"`
  - `aria-checked={isSelected}`
  - `aria-posinset` / `aria-setsize`
  - Roving tabindex pattern: `tabIndex={isSelected ? 0 : -1}`

- **Gold Accent Color**: Use `ring-accent` class for gold border (#C9A962)

- **Focus Styling**: Use `focus-visible:ring-2 focus-visible:ring-accent` for consistent focus rings

- **getLocalizedName Utility**: Consider extracting to shared utility (currently duplicated in MarbleSelector/MarbleSwatch)

- **Barrel Export Missing**: Should create `src/components/configurator/index.ts` for clean imports

**Files Created in Previous Story:**
- `src/components/configurator/MarbleSelector.tsx` - Grid selector component
- `src/components/configurator/MarbleSwatch.tsx` - Individual swatch

**Files Modified:**
- `src/components/configurator/ConfigPanel.tsx` - Integrated MarbleSelector
- `src/constants/marbles.ts` - Added localized `name` property
- `src/messages/*.json` - Added marble names translations

[Source: docs/sprint-artifacts/3-6-marble-type-selector.md#Dev-Agent-Record]

### Project Structure Notes

**Alignment with unified project structure:**
- Component location: `src/components/configurator/FinishPicker.tsx`
- Sub-component: `src/components/configurator/FinishOption.tsx`
- Store integration: Uses existing `src/stores/configStore.ts`
- Marble finish data: `src/constants/marbles.ts` (MARBLE_DATA.finishes array)

**Expected new files:**
- `src/components/configurator/FinishPicker.tsx` - Finish selector container
- `src/components/configurator/FinishOption.tsx` - Individual finish option button
- `src/components/configurator/index.ts` - Barrel export (if not exists)

**Files to modify:**
- `src/components/configurator/ConfigPanel.tsx` - Add FinishPicker
- `src/components/3d/MarbleMaterial.tsx` - Add finish-based roughness
- `src/stores/configStore.ts` - Ensure `setFinish` action exists (likely already there)
- `src/messages/*.json` - Add finish translation keys

### Existing Store Integration

The configStore should provide (from Story 3.2):

```typescript
// Selectors
useFinish() → FinishType (e.g., "POLISHED", "HONED")

// Actions
setFinish(finish: FinishType) → void
  - Updates finish
  - Triggers price recalculation with finishModifier
```

### Finish Types and Material Properties

```typescript
// From schema - FinishType enum
type FinishType = 'POLISHED' | 'HONED' | 'RAW' | 'BRUSHED';

// Material roughness mapping
const FINISH_ROUGHNESS: Record<FinishType, number> = {
  POLISHED: 0.1,  // Mirror-like, high reflectivity
  HONED: 0.5,     // Matte, smooth
  RAW: 0.9,       // Natural texture, rough
  BRUSHED: 0.7,   // Linear texture, medium-rough
};

// From MarbleFinish relation
interface MarbleFinish {
  type: FinishType;
  priceModifier: number; // e.g., 1.0, 1.1, 0.95
}
```

### Marble Data Structure

```typescript
// From src/constants/marbles.ts
export const MARBLE_DATA = [
  {
    slug: 'carrara',
    name: { en: 'Carrara White', fr: 'Blanc de Carrare', ... },
    density: 2700,
    basePricePerCm3: 15,
    finishes: [
      { type: 'POLISHED', priceModifier: 1.0 },
      { type: 'HONED', priceModifier: 0.95 },
      { type: 'RAW', priceModifier: 0.9 },
    ],
    // ...
  },
];
```

### Translation Keys Structure

```json
{
  "configurator": {
    "finishPicker": {
      "title": "Finish",
      "ariaLabel": "Select finish type",
      "priceModifier": "{modifier}%"
    },
    "finishTypes": {
      "POLISHED": "Polished",
      "HONED": "Honed",
      "RAW": "Raw",
      "BRUSHED": "Brushed"
    }
  }
}
```

### UX Specification Notes

From UX Design Specification section 6.1:
- **FinishPicker**: Row of finish options with visual indicators
- **States**: Default, Hover (subtle lift), Selected (gold highlight)
- **Layout**: Horizontal pills/buttons, compact design

From section 8.2 (Accessibility):
- Arrow keys navigate finish options
- Touch targets: 44×44px minimum
- Screen readers: announce finish name and price modifier

### Price Calculation Logic

```typescript
// Price formula from Architecture doc
const calculatePrice = (
  volume: number, // in cm³
  basePricePerCm3: number, // in cents
  finishModifier: number // e.g., 1.1 for +10%
): number => {
  return Math.round(volume * basePricePerCm3 * finishModifier);
};
```

### References

- [Source: docs/epics.md#Story-3.7] - Story definition, acceptance criteria
- [Source: docs/architecture.md#Project-Structure] - Component locations
- [Source: docs/architecture.md#Implementation-Patterns] - Code patterns
- [Source: docs/architecture.md#Data-Architecture] - FinishType enum, MarbleFinish model
- [Source: docs/prd.md#FR12] - Users can select finish with visual preview
- [Source: docs/prd.md#FR14] - System auto-calculates price based on config
- [Source: docs/prd.md#NFR3] - Changes reflect in 3D view within 500ms
- [Source: docs/prd.md#NFR4] - Price calculations update < 200ms
- [Source: docs/sprint-artifacts/3-6-marble-type-selector.md#Dev-Agent-Record] - Previous story learnings

## Dev Agent Record

### Context Reference

- docs/sprint-artifacts/3-7-finish-picker.context.xml

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2025-12-07 | Story drafted from epics.md, PRD, architecture, and Story 3-6 learnings | SM Agent (Bob) |

