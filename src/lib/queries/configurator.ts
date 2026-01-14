/**
 * Configurator Query Functions
 *
 * Server-side utilities for configurator marble validation and fallback.
 *
 * @see Story 2.6: Gallery to Configurator Navigation (Task 6)
 */

import { getAllMarbleSlugs, getMarbleBySlug } from "@/lib/queries/marbles";
import { DEFAULT_MARBLE_SLUG } from "@/constants/marbles";

/**
 * Get the first available marble slug for fallback
 *
 * @returns First available marble slug or null if none available
 *
 * @example
 * ```ts
 * const fallback = await getFirstAvailableMarbleSlug();
 * // "carrara-white"
 * ```
 */
export async function getFirstAvailableMarbleSlug(): Promise<string | null> {
  const slugs = await getAllMarbleSlugs();
  return slugs[0] ?? null;
}

/**
 * Validate a marble slug and return valid slug or fallback
 *
 * Handles AC3: Invalid or missing marble slug gracefully
 * - If marble param is missing → default to first available marble
 * - If marble param is invalid → default to first available marble
 * - No error displayed to user, seamless fallback
 *
 * @param slug - The marble slug from URL query parameter
 * @param locale - The current locale for validation
 * @returns Valid marble slug (original or fallback)
 *
 * @example
 * ```ts
 * const validSlug = await validateMarbleSlug("invalid-slug", "en");
 * // Returns fallback slug if "invalid-slug" doesn't exist
 * ```
 */
export async function validateMarbleSlug(
  slug: string | null | undefined,
  locale: string
): Promise<string> {
  try {
    // Get first available for fallback
    const fallbackSlug = await getFirstAvailableMarbleSlug();

    if (!fallbackSlug) {
      // DB unavailable - use hardcoded default
      console.warn("Database unavailable, using default marble slug");
      return DEFAULT_MARBLE_SLUG;
    }

    // No slug provided - use fallback
    if (!slug) {
      return fallbackSlug;
    }

    // Validate slug exists in database
    const marble = await getMarbleBySlug(slug, locale);

    if (!marble) {
      // Invalid slug - use fallback (AC3)
      return fallbackSlug;
    }

    return slug;
  } catch (error) {
    // Catch-all for any DB errors
    console.error("Error validating marble slug:", error);
    return DEFAULT_MARBLE_SLUG;
  }
}

