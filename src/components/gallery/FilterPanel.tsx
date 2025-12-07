/**
 * FilterPanel Component
 *
 * Desktop filter controls for gallery filtering.
 * Uses shadcn Select components with gold accent for active filters.
 *
 * @see Story 2.4: Gallery Filtering (Task 3)
 */

"use client";

import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { GalleryFilters } from "@/types/gallery";
import type { FinishType } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";

export interface FilterPanelProps {
  /** Current filter values */
  filters: GalleryFilters;
  /** Available options for each filter */
  options: {
    marbles: Array<{ slug: string; name: string }>;
    finishes: FinishType[];
    useCases: string[];
  };
  /** Callback when a filter changes */
  onFilterChange: (key: keyof GalleryFilters, value: string | undefined) => void;
  /** Callback to clear all filters */
  onClearAll: () => void;
  /** Optional additional class names */
  className?: string;
}

/** Value used to represent "all" (no filter) */
const ALL_VALUE = "__all__";

/**
 * FilterPanel - Desktop filter bar
 */
export function FilterPanel({
  filters,
  options,
  onFilterChange,
  onClearAll,
  className,
}: FilterPanelProps) {
  const t = useTranslations("gallery");

  const hasActiveFilters =
    !!filters.marbleType || !!filters.finish || !!filters.useCase;

  const handleValueChange = (
    key: keyof GalleryFilters,
    value: string
  ) => {
    onFilterChange(key, value === ALL_VALUE ? undefined : value);
  };

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-3",
        className
      )}
      role="group"
      aria-label={t("filters.filterBy")}
    >
      {/* Marble Type Filter */}
      <FilterSelect
        value={filters.marbleType || ALL_VALUE}
        onValueChange={(v) => handleValueChange("marbleType", v)}
        placeholder={t("filters.allMarbles")}
        isActive={!!filters.marbleType}
      >
        <SelectItem value={ALL_VALUE}>{t("filters.allMarbles")}</SelectItem>
        {options.marbles.map((marble) => (
          <SelectItem key={marble.slug} value={marble.slug}>
            {marble.name}
          </SelectItem>
        ))}
      </FilterSelect>

      {/* Finish Type Filter */}
      <FilterSelect
        value={filters.finish || ALL_VALUE}
        onValueChange={(v) => handleValueChange("finish", v)}
        placeholder={t("filters.allFinishes")}
        isActive={!!filters.finish}
      >
        <SelectItem value={ALL_VALUE}>{t("filters.allFinishes")}</SelectItem>
        {options.finishes.map((finish) => (
          <SelectItem key={finish} value={finish}>
            {t(`finishes.${finish}`)}
          </SelectItem>
        ))}
      </FilterSelect>

      {/* Use Case Filter */}
      <FilterSelect
        value={filters.useCase || ALL_VALUE}
        onValueChange={(v) => handleValueChange("useCase", v)}
        placeholder={t("filters.allUseCases")}
        isActive={!!filters.useCase}
      >
        <SelectItem value={ALL_VALUE}>{t("filters.allUseCases")}</SelectItem>
        {options.useCases.map((useCase) => (
          <SelectItem key={useCase} value={useCase}>
            {t(`useCases.${useCase}`)}
          </SelectItem>
        ))}
      </FilterSelect>

      {/* Clear All Button */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={onClearAll}
          className="ml-2 text-muted-foreground hover:text-foreground"
        >
          <X className="mr-1 size-3.5" />
          {t("filters.clearAll")}
        </Button>
      )}
    </div>
  );
}

/**
 * FilterSelect - Styled select with gold accent when active
 */
interface FilterSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  isActive: boolean;
  children: React.ReactNode;
}

function FilterSelect({
  value,
  onValueChange,
  placeholder,
  isActive,
  children,
}: FilterSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger
        className={cn(
          "min-w-[140px] transition-all duration-300 ease-out",
          isActive && "border-gold ring-1 ring-gold/30 text-gold"
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>{children}</SelectContent>
    </Select>
  );
}

