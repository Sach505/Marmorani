/**
 * Cube Calculation Functions
 *
 * Pure functions for calculating weight and price of marble cubes.
 * These functions are designed to be used by the Zustand configuration store.
 *
 * @see Story 3.2: Zustand Configuration Store (AC2, AC6)
 * @see docs/architecture.md for formula specifications
 */

import {
  MARBLE_DATA,
  FINISH_PRICE_MODIFIERS,
  DEFAULT_MARBLE_SLUG,
  type MarbleConstants,
} from "@/constants/marbles";
import { FinishType } from "@/generated/prisma/enums";

/**
 * Calculate the weight of a marble cube in kilograms
 *
 * Formula: weight_kg = (width × height × depth) × density / 1,000,000
 * Where dimensions are in cm and density is in kg/m³
 *
 * @param width - Width in centimeters
 * @param height - Height in centimeters
 * @param depth - Depth in centimeters
 * @param density - Density in kg/m³
 * @returns Weight in kilograms (rounded to 2 decimal places)
 *
 * @example
 * // Carrara White (density ~2710 kg/m³), 10×10×10 cube
 * calculateWeight(10, 10, 10, 2710) // → 2.71 kg
 */
export function calculateWeight(
  width: number,
  height: number,
  depth: number,
  density: number
): number {
  // Volume in cm³, density in kg/m³
  // Need to convert: cm³ to m³ = ÷ 1,000,000
  const volumeCm3 = width * height * depth;
  const weightKg = (volumeCm3 * density) / 1_000_000;

  // Round to 2 decimal places for display
  return Math.round(weightKg * 100) / 100;
}

/**
 * Calculate the price of a marble cube in cents
 *
 * Formula: price_cents = volume × basePricePerCm3 × finishModifier
 * Where volume = width × height × depth (cm³)
 *
 * @param volume - Volume in cubic centimeters
 * @param basePricePerCm3 - Base price per cm³ in cents
 * @param finishModifier - Price modifier for the finish type (default 1.0)
 * @returns Price in cents (rounded to nearest integer)
 *
 * @example
 * // 10×10×10 = 1000cm³, basePricePerCm3=8 cents, POLISHED (1.0)
 * calculatePrice(1000, 8, 1.0) // → 8000 cents (€80.00)
 */
export function calculatePrice(
  volume: number,
  basePricePerCm3: number,
  finishModifier: number = 1.0
): number {
  const priceCents = volume * basePricePerCm3 * finishModifier;

  // Round to nearest integer (cents)
  return Math.round(priceCents);
}

/**
 * Calculate volume from dimensions
 *
 * @param width - Width in centimeters
 * @param height - Height in centimeters
 * @param depth - Depth in centimeters
 * @returns Volume in cubic centimeters
 */
export function calculateVolume(
  width: number,
  height: number,
  depth: number
): number {
  return width * height * depth;
}

/**
 * Get the finish modifier for a given finish type
 *
 * @param finish - The finish type
 * @returns Price modifier (multiplier)
 */
export function getFinishModifier(finish: FinishType): number {
  return FINISH_PRICE_MODIFIERS[finish] ?? 1.0;
}

/**
 * Get marble constants by slug with fallback
 *
 * @param slug - Marble slug identifier
 * @returns MarbleConstants with density and basePricePerCm3
 */
export function getMarbleData(slug: string): MarbleConstants {
  return MARBLE_DATA[slug] ?? MARBLE_DATA[DEFAULT_MARBLE_SLUG];
}

/**
 * Calculate all derived values for a cube configuration
 *
 * This is the main calculation function used by the store.
 * It combines weight and price calculations with marble/finish lookups.
 *
 * @param config - Cube configuration
 * @returns Object with calculatedWeight (kg) and calculatedPrice (cents)
 *
 * @example
 * calculateDerivedValues({
 *   marbleSlug: 'carrara-white',
 *   width: 20, height: 20, depth: 20,
 *   finish: FinishType.POLISHED
 * })
 * // → { calculatedWeight: 21.68, calculatedPrice: 64000 }
 */
export function calculateDerivedValues(config: {
  marbleSlug: string;
  width: number;
  height: number;
  depth: number;
  finish: FinishType;
}): { calculatedWeight: number; calculatedPrice: number } {
  const { marbleSlug, width, height, depth, finish } = config;

  // Get marble data
  const marbleData = getMarbleData(marbleSlug);

  // Calculate weight
  const calculatedWeight = calculateWeight(
    width,
    height,
    depth,
    marbleData.density
  );

  // Calculate volume and price
  const volume = calculateVolume(width, height, depth);
  const finishModifier = getFinishModifier(finish);
  const calculatedPrice = calculatePrice(
    volume,
    marbleData.basePricePerCm3,
    finishModifier
  );

  return {
    calculatedWeight,
    calculatedPrice,
  };
}

