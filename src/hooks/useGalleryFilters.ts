/**
 * useGalleryFilters Hook
 *
 * Client-side hook for managing gallery filter state via URL search params.
 * All filter state is stored in URL for shareability and SSR compatibility.
 *
 * @see Story 2.4: Gallery Filtering (Task 1)
 */

"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";
import type { GalleryFilters } from "@/types/gallery";
import type { FinishType } from "@/generated/prisma/enums";

/** URL parameter keys */
const PARAM_KEYS = {
  marble: "marble",
  finish: "finish",
  useCase: "useCase",
} as const;

/** Valid finish types for URL validation */
const VALID_FINISHES: FinishType[] = ["POLISHED", "HONED", "RAW", "BRUSHED"];

/**
 * Parse and validate finish type from URL param
 */
function parseFinishParam(value: string | null): FinishType | undefined {
  if (!value) return undefined;
  const upperValue = value.toUpperCase() as FinishType;
  return VALID_FINISHES.includes(upperValue) ? upperValue : undefined;
}

/**
 * Hook return type
 */
export interface UseGalleryFiltersReturn {
  /** Current filter values */
  filters: GalleryFilters;
  /** Set a single filter value (undefined to clear) */
  setFilter: (key: keyof GalleryFilters, value: string | undefined) => void;
  /** Clear a single filter */
  clearFilter: (key: keyof GalleryFilters) => void;
  /** Clear all filters */
  clearAllFilters: () => void;
  /** Whether any filter is currently active */
  hasActiveFilters: boolean;
  /** Count of active filters */
  activeFilterCount: number;
}

/**
 * Gallery filter state management hook
 *
 * Uses URL search params as the source of truth for filter state.
 * Enables shareable URLs and browser back/forward navigation.
 *
 * @example
 * ```tsx
 * const { filters, setFilter, clearAllFilters, hasActiveFilters } = useGalleryFilters();
 *
 * // Set a filter
 * setFilter('marbleType', 'carrara-white');
 *
 * // Clear all filters
 * clearAllFilters();
 * ```
 */
export function useGalleryFilters(): UseGalleryFiltersReturn {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Parse current filters from URL
  const filters = useMemo<GalleryFilters>(() => {
    return {
      marbleType: searchParams.get(PARAM_KEYS.marble) || undefined,
      finish: parseFinishParam(searchParams.get(PARAM_KEYS.finish)),
      useCase: searchParams.get(PARAM_KEYS.useCase) || undefined,
    };
  }, [searchParams]);

  // Calculate active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.marbleType) count++;
    if (filters.finish) count++;
    if (filters.useCase) count++;
    return count;
  }, [filters]);

  const hasActiveFilters = activeFilterCount > 0;

  /**
   * Update URL with new search params
   */
  const updateUrl = useCallback(
    (newParams: URLSearchParams) => {
      const search = newParams.toString();
      const url = search ? `${pathname}?${search}` : pathname;
      router.push(url, { scroll: false });
    },
    [pathname, router]
  );

  /**
   * Set a single filter value
   */
  const setFilter = useCallback(
    (key: keyof GalleryFilters, value: string | undefined) => {
      const newParams = new URLSearchParams(searchParams.toString());

      const paramKey =
        key === "marbleType"
          ? PARAM_KEYS.marble
          : key === "finish"
            ? PARAM_KEYS.finish
            : PARAM_KEYS.useCase;

      if (value) {
        newParams.set(paramKey, value);
      } else {
        newParams.delete(paramKey);
      }

      updateUrl(newParams);
    },
    [searchParams, updateUrl]
  );

  /**
   * Clear a single filter
   */
  const clearFilter = useCallback(
    (key: keyof GalleryFilters) => {
      setFilter(key, undefined);
    },
    [setFilter]
  );

  /**
   * Clear all filters
   */
  const clearAllFilters = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [pathname, router]);

  return {
    filters,
    setFilter,
    clearFilter,
    clearAllFilters,
    hasActiveFilters,
    activeFilterCount,
  };
}

