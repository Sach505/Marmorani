/**
 * GalleryEmptyWithFilters Component
 *
 * Client component wrapper for GalleryEmpty that integrates with filter state.
 *
 * @see Story 2.4: Gallery Filtering (Task 6.5)
 */

"use client";

import { GalleryEmpty } from "./GalleryEmpty";
import { useGalleryFilters } from "@/hooks/useGalleryFilters";

/**
 * GalleryEmptyWithFilters - Empty state with filter integration
 */
export function GalleryEmptyWithFilters() {
  const { hasActiveFilters, clearAllFilters } = useGalleryFilters();

  return (
    <GalleryEmpty
      hasActiveFilters={hasActiveFilters}
      onClearFilters={clearAllFilters}
    />
  );
}

