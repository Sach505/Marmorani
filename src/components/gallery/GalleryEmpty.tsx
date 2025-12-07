/**
 * GalleryEmpty Component
 *
 * Empty state for gallery when no items are available.
 * Supports filter-specific messaging with clear filters CTA.
 *
 * @see Story 2.3: Inspiration Gallery Page (AC: Empty state)
 * @see Story 2.4: Gallery Filtering (AC: #6 - Empty results with filters)
 */

"use client";

import { useTranslations } from "next-intl";
import { ImageOff, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface GalleryEmptyProps {
  /** Whether there are active filters causing empty results */
  hasActiveFilters?: boolean;
  /** Callback to clear filters */
  onClearFilters?: () => void;
}

export function GalleryEmpty({
  hasActiveFilters = false,
  onClearFilters,
}: GalleryEmptyProps) {
  const t = useTranslations("gallery");

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <ImageOff className="mb-4 h-12 w-12 text-muted-foreground/50" />
      <h2 className="font-display text-xl font-medium text-foreground">
        {hasActiveFilters ? t("filters.noResults") : t("noItems")}
      </h2>
      <p className="mt-2 max-w-md font-body text-sm text-muted-foreground">
        {hasActiveFilters
          ? t("filters.noResultsDescription")
          : t("noItemsDescription")}
      </p>
      {hasActiveFilters && onClearFilters && (
        <Button
          variant="outline"
          onClick={onClearFilters}
          className="mt-6"
        >
          <X className="mr-2 size-4" />
          {t("filters.clearAll")}
        </Button>
      )}
    </div>
  );
}

