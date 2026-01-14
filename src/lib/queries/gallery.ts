/**
 * Gallery Query Functions
 *
 * Server-side data fetching for the inspiration gallery.
 * Resolves multilingual JSON fields to the current locale.
 *
 * @see Story 2.3: Inspiration Gallery Page (Task 2)
 * @see Story 2.4: Gallery Filtering (Task 2)
 */

import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/queries/errorHandling";
import type { GalleryItemLocalized, GalleryFilters } from "@/types/gallery";
import type { LocalizedString } from "@/types/marble";
import type { FinishType, Prisma } from "@/generated/prisma/client";
import { FINISH_PRICE_MODIFIERS } from "@/constants/marbles";

/**
 * Standard cube volume for "From X €" pricing
 * 10×10×10 cm = 1000 cm³
 */
const STANDARD_CUBE_VOLUME = 1000;

/**
 * Get the minimum finish price modifier
 */
function getMinFinishModifier(): number {
  return Math.min(...Object.values(FINISH_PRICE_MODIFIERS));
}

/**
 * Calculate starting price for a marble
 * Formula: volume × basePricePerCm3 × cheapest finish modifier / 100
 *
 * @param basePricePerCm3 - Base price in cents per cm³
 * @returns Starting price in cents
 */
function calculateStartingPrice(basePricePerCm3: number): number {
  const minModifier = getMinFinishModifier();
  return Math.round(STANDARD_CUBE_VOLUME * basePricePerCm3 * minModifier);
}

/**
 * Resolve a localized JSON field to the current locale
 *
 * @param json - The JSON object with locale keys
 * @param locale - The target locale
 * @returns The resolved string (falls back to English if locale not found)
 */
function resolveLocale(json: unknown, locale: string): string {
  if (!json || typeof json !== "object") {
    return "";
  }
  const localized = json as LocalizedString;
  return localized[locale as keyof LocalizedString] || localized.en || "";
}

/**
 * Get all gallery items sorted by featured (first) then order
 * Supports optional filtering by marble type, finish, and use case.
 *
 * @param locale - The current locale for content resolution
 * @param filters - Optional filter criteria (AND logic for multiple filters)
 * @returns Array of localized gallery items
 *
 * @example
 * ```ts
 * // Get all items
 * const items = await getGalleryItems("fr");
 *
 * // Get filtered items
 * const filtered = await getGalleryItems("fr", {
 *   marbleType: "carrara-white",
 *   finish: "POLISHED",
 * });
 * ```
 */
export async function getGalleryItems(
  locale: string,
  filters?: GalleryFilters
): Promise<GalleryItemLocalized[]> {
  return safeQuery(
    async () => {
      // Build WHERE clause with AND logic for multiple filters
      const where: Prisma.GalleryItemWhereInput = {};

      // Build marble filter conditions
      const marbleConditions: Prisma.MarbleWhereInput = {};

      if (filters?.marbleType) {
        marbleConditions.slug = filters.marbleType;
      }

      if (filters?.finish) {
        // Filter by marble that has the specified finish
        marbleConditions.finishes = { some: { type: filters.finish } };
      }

      // Only add marble filter if we have conditions
      if (Object.keys(marbleConditions).length > 0) {
        where.marble = marbleConditions;
      }

      if (filters?.useCase) {
        where.useCase = filters.useCase;
      }

      const items = await prisma.galleryItem.findMany({
        where,
        orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
        include: {
          marble: {
            select: {
              slug: true,
              name: true,
              basePricePerCm3: true,
            },
          },
        },
      });

      return items.map((item) => ({
        id: item.id,
        title: resolveLocale(item.title, locale),
        description: resolveLocale(item.description, locale),
        imageUrl: item.imageUrl,
        useCase: item.useCase,
        featured: item.featured,
        marbleSlug: item.marble?.slug ?? null,
        marbleName: item.marble ? resolveLocale(item.marble.name, locale) : null,
        startingPrice: item.marble
          ? calculateStartingPrice(item.marble.basePricePerCm3)
          : null,
      }));
    },
    [], // Fallback to empty array if DB unavailable
    "getGalleryItems"
  );
}

/**
 * Get gallery item count for loading state
 */
export async function getGalleryItemCount(): Promise<number> {
  return prisma.galleryItem.count();
}

/**
 * Get available use cases from gallery items
 */
export async function getGalleryUseCases(): Promise<string[]> {
  const items = await prisma.galleryItem.findMany({
    where: { useCase: { not: null } },
    select: { useCase: true },
    distinct: ["useCase"],
  });

  return items
    .map((item) => item.useCase)
    .filter((useCase): useCase is string => useCase !== null);
}

/**
 * Gallery filter options for dropdowns
 */
export interface GalleryFilterOptions {
  marbles: Array<{ slug: string; name: string }>;
  finishes: FinishType[];
  useCases: string[];
}

/**
 * Get available filter options for gallery filters
 * Returns only options that exist in the current gallery items.
 *
 * @param locale - The current locale for marble name resolution
 * @returns Object with arrays of available marbles, finishes, and use cases
 *
 * @example
 * ```ts
 * const options = await getGalleryFilterOptions("fr");
 * // { marbles: [...], finishes: [...], useCases: [...] }
 * ```
 */
export async function getGalleryFilterOptions(
  locale: string
): Promise<GalleryFilterOptions> {
  return safeQuery(
    async () => {
      // Get unique marbles from gallery items
      const marblesWithGalleryItems = await prisma.marble.findMany({
        where: {
          galleryItems: { some: {} },
        },
        select: {
          slug: true,
          name: true,
        },
        orderBy: { slug: "asc" },
      });

      const marbles = marblesWithGalleryItems.map((marble) => ({
        slug: marble.slug,
        name: resolveLocale(marble.name, locale),
      }));

      // Get unique finishes from marbles that have gallery items
      const finishesResult = await prisma.marbleFinish.findMany({
        where: {
          marble: {
            galleryItems: { some: {} },
          },
        },
        select: { type: true },
        distinct: ["type"],
      });

      const finishes = finishesResult.map((f) => f.type);

      // Get unique use cases from gallery items
      const useCases = await getGalleryUseCases();

      return { marbles, finishes, useCases };
    },
    { marbles: [], finishes: [], useCases: [] }, // Fallback to empty options
    "getGalleryFilterOptions"
  );
}

