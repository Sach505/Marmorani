/**
 * Marble Query Functions
 *
 * Server-side data fetching for individual marble detail pages.
 * Resolves multilingual JSON fields to the current locale.
 *
 * @see Story 2.5: Marble Detail Page (Task 2)
 */

import { prisma } from "@/lib/prisma";
import type { MarbleDetailLocalized, MarbleLocalized } from "@/types/marble";
import type { LocalizedString } from "@/types/marble";
import { calculatePriceRange } from "@/lib/utils/price";

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
 * Get a single marble by slug with all details for the detail page
 *
 * @param slug - The marble slug (e.g., "carrara-white")
 * @param locale - The current locale for content resolution
 * @returns Localized marble detail or null if not found
 *
 * @example
 * ```ts
 * const marble = await getMarbleBySlug("carrara-white", "fr");
 * if (marble) {
 *   console.log(marble.name); // "Marbre de Carrare"
 * }
 * ```
 */
export async function getMarbleBySlug(
  slug: string,
  locale: string
): Promise<MarbleDetailLocalized | null> {
  const marble = await prisma.marble.findUnique({
    where: { slug, available: true },
    include: {
      finishes: {
        select: {
          type: true,
          priceModifier: true,
        },
      },
    },
  });

  if (!marble) {
    return null;
  }

  const localizedMarble: MarbleLocalized = {
    id: marble.id,
    slug: marble.slug,
    name: resolveLocale(marble.name, locale),
    description: resolveLocale(marble.description, locale),
    density: marble.density,
    basePricePerCm3: marble.basePricePerCm3,
    origin: marble.origin,
    textureFolder: marble.textureFolder,
    finishes: marble.finishes.map((f) => ({
      type: f.type,
      priceModifier: f.priceModifier,
    })),
  };

  // Calculate price range using the utility function
  const priceRange = calculatePriceRange(localizedMarble);

  return {
    ...localizedMarble,
    priceRange,
  };
}

/**
 * Get all available marble slugs for static generation
 *
 * @returns Array of marble slugs
 *
 * @example
 * ```ts
 * const slugs = await getAllMarbleSlugs();
 * // ["carrara-white", "calacatta-gold", ...]
 * ```
 */
export async function getAllMarbleSlugs(): Promise<string[]> {
  const marbles = await prisma.marble.findMany({
    where: { available: true },
    select: { slug: true },
    orderBy: { slug: "asc" },
  });

  return marbles.map((m) => m.slug);
}

