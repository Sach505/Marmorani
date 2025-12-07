/**
 * Marble Manufacturing Constants
 *
 * Defines manufacturing constraints and finish types for the marble configurator.
 * All values are typed with `as const` for compile-time safety.
 *
 * @see Story 2.1: Marble Data Seeding & Constants (AC5)
 */

import { FinishType } from "@/generated/prisma/enums";

/**
 * Manufacturing dimension constraints in centimeters
 */
export const MANUFACTURING_CONSTRAINTS = {
  /** Minimum dimension for any axis (cm) */
  MIN_DIMENSION: 5,
  /** Maximum dimension for any axis (cm) */
  MAX_DIMENSION: 100,
} as const;

/**
 * All available finish types from Prisma enum
 */
export const FINISH_TYPES = [
  FinishType.POLISHED,
  FinishType.HONED,
  FinishType.RAW,
  FinishType.BRUSHED,
] as const;

/**
 * Price modifiers for each finish type
 * - POLISHED: Base price (1.0)
 * - HONED: 5% discount (0.95)
 * - RAW: 15% discount (0.85)
 * - BRUSHED: 10% premium (1.1)
 */
export const FINISH_PRICE_MODIFIERS: Record<FinishType, number> = {
  [FinishType.POLISHED]: 1.0,
  [FinishType.HONED]: 0.95,
  [FinishType.RAW]: 0.85,
  [FinishType.BRUSHED]: 1.1,
} as const;

/**
 * Gallery use case categories for filtering
 */
export const USE_CASES = [
  "coffee-table",
  "side-table",
  "column",
  "decorative",
] as const;

/**
 * Type for use case values
 */
export type UseCase = (typeof USE_CASES)[number];

/**
 * Type for manufacturing constraints
 */
export type ManufacturingConstraints = typeof MANUFACTURING_CONSTRAINTS;

/**
 * Localized string type for marble names
 */
export interface LocalizedMarbleName {
  en: string;
  fr: string;
  it: string;
  es: string;
  de: string;
}

/**
 * Marble constants for client-side calculations
 * Contains density (kg/m³) and base price per cm³ (cents)
 *
 * @see Story 3.2: Zustand Configuration Store (AC6)
 * @see Story 3.6: Marble Type Selector
 * @see prisma/seed.ts for source data
 */
export interface MarbleConstants {
  /** Density in kg/m³ */
  density: number;
  /** Base price per cubic centimeter in cents */
  basePricePerCm3: number;
  /** Localized marble name */
  name: LocalizedMarbleName;
}

/**
 * Marble data lookup for calculations
 * Maps marble slugs to their physical and pricing constants
 *
 * Values match seeded database values in prisma/seed.ts
 * @see Story 3.6: Marble Type Selector (AC2 - localized names)
 */
export const MARBLE_DATA: Record<string, MarbleConstants> = {
  "carrara-white": {
    density: 2710,
    basePricePerCm3: 8,
    name: {
      en: "Carrara White",
      fr: "Carrare Blanc",
      it: "Bianco Carrara",
      es: "Blanco Carrara",
      de: "Carrara Weiß",
    },
  },
  "nero-marquina": {
    density: 2700,
    basePricePerCm3: 12,
    name: {
      en: "Nero Marquina",
      fr: "Noir Marquina",
      it: "Nero Marquina",
      es: "Negro Marquina",
      de: "Nero Marquina",
    },
  },
  "calacatta-gold": {
    density: 2700,
    basePricePerCm3: 18,
    name: {
      en: "Calacatta Gold",
      fr: "Calacatta Or",
      it: "Calacatta Oro",
      es: "Calacatta Oro",
      de: "Calacatta Gold",
    },
  },
  "emperador-dark": {
    density: 2720,
    basePricePerCm3: 10,
    name: {
      en: "Emperador Dark",
      fr: "Emperador Foncé",
      it: "Emperador Scuro",
      es: "Emperador Oscuro",
      de: "Emperador Dunkel",
    },
  },
  statuario: {
    density: 2690,
    basePricePerCm3: 22,
    name: {
      en: "Statuario",
      fr: "Statuario",
      it: "Statuario",
      es: "Estatuario",
      de: "Statuario",
    },
  },
  "verde-guatemala": {
    density: 2750,
    basePricePerCm3: 14,
    name: {
      en: "Verde Guatemala",
      fr: "Verde Guatemala",
      it: "Verde Guatemala",
      es: "Verde Guatemala",
      de: "Verde Guatemala",
    },
  },
  "rosa-portogallo": {
    density: 2680,
    basePricePerCm3: 9,
    name: {
      en: "Rosa Portogallo",
      fr: "Rose Portugal",
      it: "Rosa Portogallo",
      es: "Rosa Portugal",
      de: "Rosa Portugal",
    },
  },
  "sahara-noir": {
    density: 2710,
    basePricePerCm3: 11,
    name: {
      en: "Sahara Noir",
      fr: "Sahara Noir",
      it: "Sahara Nero",
      es: "Sahara Negro",
      de: "Sahara Schwarz",
    },
  },
  "bianco-sivec": {
    density: 2700,
    basePricePerCm3: 16,
    name: {
      en: "Bianco Sivec",
      fr: "Bianco Sivec",
      it: "Bianco Sivec",
      es: "Bianco Sivec",
      de: "Bianco Sivec",
    },
  },
  "travertino-romano": {
    density: 2400,
    basePricePerCm3: 7,
    name: {
      en: "Travertino Romano",
      fr: "Travertin Romain",
      it: "Travertino Romano",
      es: "Travertino Romano",
      de: "Römischer Travertin",
    },
  },
};

/**
 * Array of all marble slugs for iteration
 * @see Story 3.6: Marble Type Selector (AC1 - grid display)
 */
export const MARBLE_SLUGS = Object.keys(MARBLE_DATA) as Array<keyof typeof MARBLE_DATA>;

/**
 * Default marble slug (first available marble)
 */
export const DEFAULT_MARBLE_SLUG = "carrara-white";

/**
 * Get marble constants by slug, with fallback to default
 */
export function getMarbleConstants(slug: string): MarbleConstants {
  return MARBLE_DATA[slug] ?? MARBLE_DATA[DEFAULT_MARBLE_SLUG];
}

