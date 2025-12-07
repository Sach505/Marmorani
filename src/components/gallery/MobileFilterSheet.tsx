/**
 * MobileFilterSheet Component
 *
 * Mobile-friendly filter bottom sheet for gallery filtering.
 * Shows a filter icon button with active filter count badge.
 *
 * @see Story 2.4: Gallery Filtering (Task 4)
 */

"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { SlidersHorizontal, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { GalleryFilters } from "@/types/gallery";
import type { FinishType } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";

export interface MobileFilterSheetProps {
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
  /** Count of active filters */
  activeFilterCount: number;
  /** Optional additional class names */
  className?: string;
}

/** Value used to represent "all" (no filter) */
const ALL_VALUE = "__all__";

/**
 * MobileFilterSheet - Bottom sheet filter for mobile viewports
 */
export function MobileFilterSheet({
  filters,
  options,
  onFilterChange,
  onClearAll,
  activeFilterCount,
  className,
}: MobileFilterSheetProps) {
  const t = useTranslations("gallery");
  const [open, setOpen] = useState(false);

  const hasActiveFilters = activeFilterCount > 0;

  const handleValueChange = (key: keyof GalleryFilters, value: string) => {
    onFilterChange(key, value === ALL_VALUE ? undefined : value);
  };

  const handleClearAll = () => {
    onClearAll();
  };

  const handleApply = () => {
    setOpen(false);
  };

  return (
    <div className={cn("md:hidden", className)}>
      {/* Filter Trigger Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="relative gap-2"
        aria-label={t("filters.filterBy")}
      >
        <SlidersHorizontal className="size-4" />
        {t("filters.filter")}
        {hasActiveFilters && (
          <Badge
            variant="default"
            className="absolute -top-2 -right-2 size-5 p-0 text-[10px] bg-gold text-white"
          >
            {activeFilterCount}
          </Badge>
        )}
      </Button>

      {/* Filter Sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="h-auto max-h-[80vh] rounded-t-xl">
          <SheetHeader>
            <SheetTitle className="font-display text-xl">
              {t("filters.filterBy")}
            </SheetTitle>
            <SheetDescription>
              {t("filters.filterDescription")}
            </SheetDescription>
          </SheetHeader>

          {/* Filter Controls */}
          <div className="flex flex-col gap-4 px-4 py-6">
            {/* Marble Type Filter */}
            <FilterGroup label={t("filters.marbleType")}>
              <Select
                value={filters.marbleType || ALL_VALUE}
                onValueChange={(v) => handleValueChange("marbleType", v)}
              >
                <SelectTrigger
                  className={cn(
                    "w-full transition-all duration-300",
                    filters.marbleType && "border-gold ring-1 ring-gold/30"
                  )}
                >
                  <SelectValue placeholder={t("filters.allMarbles")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_VALUE}>
                    {t("filters.allMarbles")}
                  </SelectItem>
                  {options.marbles.map((marble) => (
                    <SelectItem key={marble.slug} value={marble.slug}>
                      {marble.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FilterGroup>

            {/* Finish Type Filter */}
            <FilterGroup label={t("filters.finishType")}>
              <Select
                value={filters.finish || ALL_VALUE}
                onValueChange={(v) => handleValueChange("finish", v)}
              >
                <SelectTrigger
                  className={cn(
                    "w-full transition-all duration-300",
                    filters.finish && "border-gold ring-1 ring-gold/30"
                  )}
                >
                  <SelectValue placeholder={t("filters.allFinishes")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_VALUE}>
                    {t("filters.allFinishes")}
                  </SelectItem>
                  {options.finishes.map((finish) => (
                    <SelectItem key={finish} value={finish}>
                      {t(`finishes.${finish}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FilterGroup>

            {/* Use Case Filter */}
            <FilterGroup label={t("filters.useCase")}>
              <Select
                value={filters.useCase || ALL_VALUE}
                onValueChange={(v) => handleValueChange("useCase", v)}
              >
                <SelectTrigger
                  className={cn(
                    "w-full transition-all duration-300",
                    filters.useCase && "border-gold ring-1 ring-gold/30"
                  )}
                >
                  <SelectValue placeholder={t("filters.allUseCases")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_VALUE}>
                    {t("filters.allUseCases")}
                  </SelectItem>
                  {options.useCases.map((useCase) => (
                    <SelectItem key={useCase} value={useCase}>
                      {t(`useCases.${useCase}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FilterGroup>
          </div>

          {/* Footer Actions */}
          <SheetFooter className="flex-row gap-3 border-t pt-4">
            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={handleClearAll}
                className="flex-1"
              >
                <X className="mr-2 size-4" />
                {t("filters.clearAll")}
              </Button>
            )}
            <SheetClose asChild>
              <Button
                onClick={handleApply}
                className={cn(
                  "flex-1 bg-gold text-white hover:bg-gold-dark",
                  !hasActiveFilters && "w-full"
                )}
              >
                {t("filters.apply")}
              </Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}

/**
 * FilterGroup - Label + control wrapper for mobile filters
 */
interface FilterGroupProps {
  label: string;
  children: React.ReactNode;
}

function FilterGroup({ label, children }: FilterGroupProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      {children}
    </div>
  );
}

