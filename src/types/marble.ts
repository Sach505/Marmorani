/**
 * Marble Type Definitions
 *
 * TypeScript interfaces for marble data structures used across the application.
 *
 * @see Story 2.1: Marble Data Seeding & Constants (Task 2)
 */

import type { FinishType } from "@/generated/prisma/enums";

/**
 * Localized string object for multilingual content
 */
export interface LocalizedString {
  en: string;
  fr: string;
  it: string;
  es: string;
  de: string;
}

/**
 * Finish option with type and price modifier
 */
export interface FinishOption {
  type: FinishType;
  priceModifier: number;
}

/**
 * Marble with resolved locale data (for display)
 */
export interface MarbleLocalized {
  id: string;
  slug: string;
  name: string;
  description: string;
  density: number;
  basePricePerCm3: number;
  origin: string;
  textureFolder: string;
  finishes: FinishOption[];
}

/**
 * Marble seed data structure (for seeding)
 */
export interface MarbleSeedData {
  slug: string;
  name: LocalizedString;
  description: LocalizedString;
  density: number;
  basePricePerCm3: number;
  origin: string;
  textureFolder: string;
  finishes: FinishOption[];
}

/**
 * Raw marble data from database (with JSON fields)
 */
export interface MarbleRaw {
  id: string;
  slug: string;
  name: LocalizedString;
  description: LocalizedString;
  density: number;
  basePricePerCm3: number;
  origin: string;
  available: boolean;
  textureFolder: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Extended marble type for detail page with calculated price range
 *
 * @see Story 2.5: Marble Detail Page
 */
export interface MarbleDetailLocalized extends MarbleLocalized {
  priceRange: {
    min: number;
    max: number;
  };
}

