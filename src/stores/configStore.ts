/**
 * Configuration Store (Zustand)
 *
 * Centralized state management for cube configuration with:
 * - Persistence to localStorage
 * - Automatic derived value calculations (weight, price)
 * - Optimized selector hooks for re-render minimization
 * - URL parameter initialization support
 *
 * @see Story 2.6: Gallery to Configurator Navigation
 * @see Story 3.2: Zustand Configuration Store (AC1-AC7)
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { FinishType } from "@/generated/prisma/enums";
import {
  MANUFACTURING_CONSTRAINTS,
  DEFAULT_MARBLE_SLUG,
  MARBLE_DATA,
} from "@/constants/marbles";
import { calculateDerivedValues } from "@/lib/calculations/cubeCalculations";

// ============================================================================
// TYPES
// ============================================================================

/**
 * Configuration state interface (AC1)
 */
export interface ConfigState {
  /** Selected marble slug */
  marbleSlug: string;
  /** Cube width in cm (constrained 5-100) */
  width: number;
  /** Cube height in cm (constrained 5-100) */
  height: number;
  /** Cube depth in cm (constrained 5-100) */
  depth: number;
  /** Selected finish type */
  finish: FinishType;
  /** Calculated weight in kg (derived) */
  calculatedWeight: number;
  /** Calculated price in cents (derived) */
  calculatedPrice: number;
  /** Whether store has been hydrated from localStorage */
  _hasHydrated: boolean;
}

/**
 * Configuration actions interface (AC5)
 */
export interface ConfigActions {
  /** Set the selected marble with validation and recalculation */
  setMarble: (slug: string) => void;
  /** Set cube dimensions with constraint clamping */
  setDimensions: (dims: Partial<{ width: number; height: number; depth: number }>) => void;
  /** Set individual dimension - width */
  setWidth: (width: number) => void;
  /** Set individual dimension - height */
  setHeight: (height: number) => void;
  /** Set individual dimension - depth */
  setDepth: (depth: number) => void;
  /** Set finish type with recalculation trigger */
  setFinish: (finish: FinishType) => void;
  /** Initialize from URL parameter (AC4) */
  initializeFromUrl: (marbleSlug: string) => void;
  /** Reset to default configuration */
  resetConfiguration: () => void;
  /** Trigger recalculation of derived values */
  recalculate: () => void;
  /** Set hydration status */
  setHasHydrated: (state: boolean) => void;
}

/**
 * Combined store type
 */
export type ConfigStore = ConfigState & ConfigActions;

// ============================================================================
// CONSTANTS & HELPERS
// ============================================================================

/**
 * Default dimension for new configurations (20cm cube)
 */
const DEFAULT_DIMENSION = 20;

/**
 * Default configuration values
 */
const DEFAULT_CONFIG: Omit<ConfigState, "_hasHydrated" | "calculatedWeight" | "calculatedPrice"> = {
  marbleSlug: DEFAULT_MARBLE_SLUG,
  width: DEFAULT_DIMENSION,
  height: DEFAULT_DIMENSION,
  depth: DEFAULT_DIMENSION,
  finish: FinishType.POLISHED,
};

/**
 * Calculate initial derived values for defaults
 */
const initialDerived = calculateDerivedValues({
  marbleSlug: DEFAULT_CONFIG.marbleSlug,
  width: DEFAULT_CONFIG.width,
  height: DEFAULT_CONFIG.height,
  depth: DEFAULT_CONFIG.depth,
  finish: DEFAULT_CONFIG.finish,
});

/**
 * Clamp a dimension value to manufacturing constraints (5-100 cm)
 * Logs warning in dev mode for invalid values (AC5.6)
 */
function clampDimension(value: number): number {
  const clamped = Math.max(
    MANUFACTURING_CONSTRAINTS.MIN_DIMENSION,
    Math.min(MANUFACTURING_CONSTRAINTS.MAX_DIMENSION, value)
  );

  // Log warning in dev mode for invalid values
  if (process.env.NODE_ENV === "development" && clamped !== value) {
    console.warn(
      `[configStore] Dimension ${value}cm clamped to ${clamped}cm ` +
        `(valid range: ${MANUFACTURING_CONSTRAINTS.MIN_DIMENSION}-${MANUFACTURING_CONSTRAINTS.MAX_DIMENSION}cm)`
    );
  }

  return clamped;
}

/**
 * Validate marble slug exists in MARBLE_DATA
 */
function isValidMarbleSlug(slug: string): boolean {
  return slug in MARBLE_DATA;
}

// ============================================================================
// STORE
// ============================================================================

/**
 * Configuration Zustand store with persist middleware
 *
 * Features:
 * - Automatic calculation of weight and price (AC2)
 * - localStorage persistence (AC3)
 * - URL parameter initialization (AC4)
 * - Typed actions with validation (AC5)
 * - Manufacturing constraint enforcement (AC5.5)
 *
 * @example
 * ```tsx
 * // In a client component - use selectors for optimal re-renders
 * const marbleSlug = useMarbleSlug();
 * const { calculatedWeight, calculatedPrice } = useCalculatedValues();
 *
 * // Initialize from URL (typically in ConfiguratorClient)
 * useConfigStore.getState().initializeFromUrl("carrara-white");
 * ```
 */
export const useConfigStore = create<ConfigStore>()(
  persist(
    (set, get) => ({
      // ========================================
      // Initial State (AC1)
      // ========================================
      ...DEFAULT_CONFIG,
      calculatedWeight: initialDerived.calculatedWeight,
      calculatedPrice: initialDerived.calculatedPrice,
      _hasHydrated: false,

      // ========================================
      // Actions (AC5)
      // ========================================

      /**
       * Set marble with validation and recalculation
       */
      setMarble: (slug: string) => {
        // Validate marble exists (AC5.1)
        if (!isValidMarbleSlug(slug)) {
          if (process.env.NODE_ENV === "development") {
            console.warn(`[configStore] Invalid marble slug: ${slug}, using default`);
          }
          slug = DEFAULT_MARBLE_SLUG;
        }

        const state = get();
        const derived = calculateDerivedValues({
          marbleSlug: slug,
          width: state.width,
          height: state.height,
          depth: state.depth,
          finish: state.finish,
        });

        set({
          marbleSlug: slug,
          ...derived,
        });
      },

      /**
       * Set dimensions with constraint clamping (AC5.2, AC5.5)
       */
      setDimensions: (dims) => {
        const state = get();
        const newWidth = dims.width !== undefined ? clampDimension(dims.width) : state.width;
        const newHeight = dims.height !== undefined ? clampDimension(dims.height) : state.height;
        const newDepth = dims.depth !== undefined ? clampDimension(dims.depth) : state.depth;

        const derived = calculateDerivedValues({
          marbleSlug: state.marbleSlug,
          width: newWidth,
          height: newHeight,
          depth: newDepth,
          finish: state.finish,
        });

        set({
          width: newWidth,
          height: newHeight,
          depth: newDepth,
          ...derived,
        });
      },

      /**
       * Set individual dimension - width
       */
      setWidth: (width: number) => {
        const state = get();
        const clampedWidth = clampDimension(width);

        const derived = calculateDerivedValues({
          marbleSlug: state.marbleSlug,
          width: clampedWidth,
          height: state.height,
          depth: state.depth,
          finish: state.finish,
        });

        set({
          width: clampedWidth,
          ...derived,
        });
      },

      /**
       * Set individual dimension - height
       */
      setHeight: (height: number) => {
        const state = get();
        const clampedHeight = clampDimension(height);

        const derived = calculateDerivedValues({
          marbleSlug: state.marbleSlug,
          width: state.width,
          height: clampedHeight,
          depth: state.depth,
          finish: state.finish,
        });

        set({
          height: clampedHeight,
          ...derived,
        });
      },

      /**
       * Set individual dimension - depth
       */
      setDepth: (depth: number) => {
        const state = get();
        const clampedDepth = clampDimension(depth);

        const derived = calculateDerivedValues({
          marbleSlug: state.marbleSlug,
          width: state.width,
          height: state.height,
          depth: clampedDepth,
          finish: state.finish,
        });

        set({
          depth: clampedDepth,
          ...derived,
        });
      },

      /**
       * Set finish type with recalculation (AC5.3)
       */
      setFinish: (finish: FinishType) => {
        const state = get();

        const derived = calculateDerivedValues({
          marbleSlug: state.marbleSlug,
          width: state.width,
          height: state.height,
          depth: state.depth,
          finish: finish,
        });

        set({
          finish,
          ...derived,
        });
      },

      /**
       * Initialize from URL parameter (AC4)
       * URL param takes precedence over localStorage on initial load
       */
      initializeFromUrl: (marbleSlug: string) => {
        if (marbleSlug && isValidMarbleSlug(marbleSlug)) {
          const state = get();
          const derived = calculateDerivedValues({
            marbleSlug,
            width: state.width,
            height: state.height,
            depth: state.depth,
            finish: state.finish,
          });

          set({
            marbleSlug,
            ...derived,
          });
        }
      },

      /**
       * Reset to default configuration (AC5.4)
       */
      resetConfiguration: () => {
        const derived = calculateDerivedValues({
          marbleSlug: DEFAULT_CONFIG.marbleSlug,
          width: DEFAULT_CONFIG.width,
          height: DEFAULT_CONFIG.height,
          depth: DEFAULT_CONFIG.depth,
          finish: DEFAULT_CONFIG.finish,
        });

        set({
          ...DEFAULT_CONFIG,
          ...derived,
        });
      },

      /**
       * Trigger recalculation of derived values
       * Useful after hydration from localStorage
       */
      recalculate: () => {
        const state = get();
        const derived = calculateDerivedValues({
          marbleSlug: state.marbleSlug,
          width: state.width,
          height: state.height,
          depth: state.depth,
          finish: state.finish,
        });

        set(derived);
      },

      /**
       * Set hydration status
       */
      setHasHydrated: (state: boolean) => set({ _hasHydrated: state }),
    }),
    {
      // ========================================
      // Persist Configuration (AC3)
      // ========================================
      name: "marmorani-config", // localStorage key (AC3.4)

      /**
       * Partial persistence - exclude derived values (AC3.2)
       * calculatedWeight and calculatedPrice are regenerated on hydration
       */
      partialize: (state) => ({
        marbleSlug: state.marbleSlug,
        width: state.width,
        height: state.height,
        depth: state.depth,
        finish: state.finish,
      }),

      /**
       * Trigger recalculation after hydration (AC3.3)
       */
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true);
          // Recalculate derived values after hydration
          state.recalculate();
        }
      },

      /**
       * Skip persist on server (AC3.5)
       * This is handled automatically by Zustand persist middleware
       * when typeof window === 'undefined'
       */
    }
  )
);

// ============================================================================
// SELECTOR HOOKS (AC7)
// ============================================================================

/**
 * Individual field selectors for optimized re-renders (AC7.1)
 * Using these instead of destructuring the entire store prevents
 * unnecessary re-renders when unrelated state changes.
 */

/** Select marble slug only */
export const useMarbleSlug = () => useConfigStore((state) => state.marbleSlug);

/** Select width only */
export const useWidth = () => useConfigStore((state) => state.width);

/** Select height only */
export const useHeight = () => useConfigStore((state) => state.height);

/** Select depth only */
export const useDepth = () => useConfigStore((state) => state.depth);

/** Select finish only */
export const useFinish = () => useConfigStore((state) => state.finish);

/** Select hydration status */
export const useHasHydrated = () => useConfigStore((state) => state._hasHydrated);

/**
 * Composite selector for full cube configuration (AC7.2)
 * Returns all configuration values needed to render/display a cube
 */
export const useConfiguredCube = () =>
  useConfigStore((state) => ({
    marbleSlug: state.marbleSlug,
    width: state.width,
    height: state.height,
    depth: state.depth,
    finish: state.finish,
  }));

/**
 * Selector for calculated values only (AC7.3)
 * For components that only need to display weight and price
 */
export const useCalculatedValues = () =>
  useConfigStore((state) => ({
    calculatedWeight: state.calculatedWeight,
    calculatedPrice: state.calculatedPrice,
  }));

/**
 * Selector for dimensions only
 * For components that manage dimension inputs
 */
export const useDimensions = () =>
  useConfigStore((state) => ({
    width: state.width,
    height: state.height,
    depth: state.depth,
  }));

/**
 * Selector for all actions
 * Returns only action methods, not state
 */
export const useConfigActions = () =>
  useConfigStore((state) => ({
    setMarble: state.setMarble,
    setDimensions: state.setDimensions,
    setWidth: state.setWidth,
    setHeight: state.setHeight,
    setDepth: state.setDepth,
    setFinish: state.setFinish,
    initializeFromUrl: state.initializeFromUrl,
    resetConfiguration: state.resetConfiguration,
    recalculate: state.recalculate,
  }));
