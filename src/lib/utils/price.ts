/**
 * Price Calculation Utilities
 *
 * Utilities for calculating marble prices based on volume and finish modifiers.
 *
 * @see Story 2.5: Marble Detail Page (Task 5.6)
 */

import { MANUFACTURING_CONSTRAINTS, FINISH_PRICE_MODIFIERS } from "@/constants/marbles";
import type { MarbleLocalized } from "@/types/marble";
import type { FinishType } from "@/generated/prisma/enums";

/**
 * Price range result
 */
export interface PriceRange {
  min: number;
  max: number;
}

/**
 * Calculate the price range for a marble based on min/max cube sizes
 *
 * Min cube: 5×5×5 = 125 cm³ (smallest allowed)
 * Max cube: 100×100×100 = 1,000,000 cm³ (largest allowed)
 *
 * Price formula: volume × basePricePerCm3 × finishModifier
 * Returns prices in cents.
 *
 * @param marble - The marble with base price and finishes
 * @returns Object with min and max prices in cents
 *
 * @example
 * ```ts
 * const range = calculatePriceRange(marble);
 * // { min: 5000, max: 1500000 } // in cents
 * ```
 */
export function calculatePriceRange(marble: MarbleLocalized): PriceRange {
  const { basePricePerCm3, finishes } = marble;
  const { MIN_DIMENSION, MAX_DIMENSION } = MANUFACTURING_CONSTRAINTS;

  // Calculate volumes
  const minVolume = MIN_DIMENSION ** 3; // 5×5×5 = 125 cm³
  const maxVolume = MAX_DIMENSION ** 3; // 100×100×100 = 1,000,000 cm³

  // Get finish modifiers (use available finishes if any, otherwise use defaults)
  const modifiers =
    finishes.length > 0
      ? finishes.map((f) => f.priceModifier)
      : Object.values(FINISH_PRICE_MODIFIERS);

  const minModifier = Math.min(...modifiers);
  const maxModifier = Math.max(...modifiers);

  // Calculate price range in cents
  // Min price = smallest cube with cheapest finish
  const minPrice = Math.round(minVolume * basePricePerCm3 * minModifier);
  // Max price = largest cube with most expensive finish
  const maxPrice = Math.round(maxVolume * basePricePerCm3 * maxModifier);

  return { min: minPrice, max: maxPrice };
}

/**
 * Format price in cents to locale currency string
 *
 * @param cents - Price in cents
 * @param locale - Locale for formatting (e.g., "fr", "en")
 * @returns Formatted currency string
 *
 * @example
 * ```ts
 * formatPrice(15000, "fr") // "150 €"
 * formatPrice(15000, "en") // "€150"
 * ```
 */
export function formatPrice(cents: number, locale: string): string {
  const euros = cents / 100;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(euros);
}

/**
 * Format a price range to display string
 *
 * @param range - Price range object with min/max in cents
 * @param locale - Locale for formatting
 * @returns Formatted range string
 *
 * @example
 * ```ts
 * formatPriceRange({ min: 5000, max: 150000 }, "fr")
 * // "50 € - 1 500 €"
 * ```
 */
export function formatPriceRange(range: PriceRange, locale: string): string {
  return `${formatPrice(range.min, locale)} - ${formatPrice(range.max, locale)}`;
}

/**
 * Get finish modifier by type
 */
export function getFinishModifier(type: FinishType): number {
  return FINISH_PRICE_MODIFIERS[type] ?? 1.0;
}

