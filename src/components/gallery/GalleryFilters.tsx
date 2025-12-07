/**
 * GalleryFilters Component
 *
 * Client-side wrapper that combines FilterPanel, MobileFilterSheet,
 * and ActiveFilters with the useGalleryFilters hook.
 *
 * @see Story 2.4: Gallery Filtering (Task 6)
 */

"use client";

import { FilterPanel } from "./FilterPanel";
import { MobileFilterSheet } from "./MobileFilterSheet";
import { ActiveFilters } from "./ActiveFilters";
import { useGalleryFilters } from "@/hooks/useGalleryFilters";
import type { GalleryFilterOptions } from "@/lib/queries/gallery";
import { cn } from "@/lib/utils";

export interface GalleryFiltersProps {
  /** Available filter options from server */
  options: GalleryFilterOptions;
  /** Optional additional class names */
  className?: string;
}

/**
 * GalleryFilters - Client component combining all filter UI elements
 */
export function GalleryFilters({ options, className }: GalleryFiltersProps) {
  const {
    filters,
    setFilter,
    clearFilter,
    clearAllFilters,
    hasActiveFilters,
    activeFilterCount,
  } = useGalleryFilters();

  return (
    <div className={cn("space-y-4", className)}>
      {/* Desktop Filter Bar */}
      <div className="hidden md:block">
        <FilterPanel
          filters={filters}
          options={options}
          onFilterChange={setFilter}
          onClearAll={clearAllFilters}
        />
      </div>

      {/* Mobile Filter Button */}
      <MobileFilterSheet
        filters={filters}
        options={options}
        onFilterChange={setFilter}
        onClearAll={clearAllFilters}
        activeFilterCount={activeFilterCount}
      />

      {/* Active Filter Chips (both desktop and mobile) */}
      {hasActiveFilters && (
        <ActiveFilters
          filters={filters}
          options={options}
          onClearFilter={clearFilter}
          onClearAll={clearAllFilters}
        />
      )}
    </div>
  );
}

/**
 * Export hook for use in GalleryEmpty
 */
export { useGalleryFilters } from "@/hooks/useGalleryFilters";

