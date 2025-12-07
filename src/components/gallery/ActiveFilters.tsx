/**
 * ActiveFilters Component
 *
 * Displays active filter chips with remove buttons.
 * Hidden when no filters are active.
 *
 * @see Story 2.4: Gallery Filtering (Task 5)
 */

"use client";

import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { GalleryFilters } from "@/types/gallery";
import type { FinishType } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";

export interface ActiveFiltersProps {
  /** Current filter values */
  filters: GalleryFilters;
  /** Available options for label resolution */
  options: {
    marbles: Array<{ slug: string; name: string }>;
    finishes: FinishType[];
    useCases: string[];
  };
  /** Callback to clear a single filter */
  onClearFilter: (key: keyof GalleryFilters) => void;
  /** Callback to clear all filters */
  onClearAll: () => void;
  /** Optional additional class names */
  className?: string;
}

/**
 * ActiveFilters - Display chips for each active filter
 */
export function ActiveFilters({
  filters,
  options,
  onClearFilter,
  onClearAll,
  className,
}: ActiveFiltersProps) {
  const t = useTranslations("gallery");

  // Build list of active filters with labels
  const activeFilters: Array<{
    key: keyof GalleryFilters;
    label: string;
    value: string;
  }> = [];

  if (filters.marbleType) {
    const marble = options.marbles.find((m) => m.slug === filters.marbleType);
    activeFilters.push({
      key: "marbleType",
      label: t("filters.marbleType"),
      value: marble?.name || filters.marbleType,
    });
  }

  if (filters.finish) {
    activeFilters.push({
      key: "finish",
      label: t("filters.finishType"),
      value: t(`finishes.${filters.finish}`),
    });
  }

  if (filters.useCase) {
    activeFilters.push({
      key: "useCase",
      label: t("filters.useCase"),
      value: t(`useCases.${filters.useCase}`),
    });
  }

  // Don't render if no active filters
  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <div
      className={cn("flex flex-wrap items-center gap-2", className)}
      role="region"
      aria-label={t("filters.activeFilters")}
    >
      {activeFilters.map((filter) => (
        <FilterChip
          key={filter.key}
          label={filter.label}
          value={filter.value}
          onRemove={() => onClearFilter(filter.key)}
        />
      ))}

      {activeFilters.length > 1 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
        >
          {t("filters.clearAll")}
        </Button>
      )}
    </div>
  );
}

/**
 * FilterChip - Individual filter pill with remove button
 */
interface FilterChipProps {
  label: string;
  value: string;
  onRemove: () => void;
}

function FilterChip({ label, value, onRemove }: FilterChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1",
        "bg-gold/10 text-gold-dark text-sm font-medium",
        "border border-gold/30",
        "transition-all duration-200 hover:bg-gold/20"
      )}
    >
      <span className="text-muted-foreground text-xs">{label}:</span>
      <span>{value}</span>
      <button
        type="button"
        onClick={onRemove}
        className={cn(
          "ml-0.5 rounded-full p-0.5",
          "hover:bg-gold/30 focus:outline-none focus:ring-2 focus:ring-gold/50",
          "transition-colors duration-150"
        )}
        aria-label={`Remove ${label}: ${value} filter`}
      >
        <X className="size-3" />
      </button>
    </span>
  );
}

