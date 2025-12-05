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

