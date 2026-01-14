"use client";

/**
 * ConfigPanel Component
 *
 * Configuration panel with placeholder sections for marble selection,
 * dimensions, finish, and price display.
 *
 * @see Story 3.1: Configurator Page Shell & Theme (Task 6, AC7)
 * @see Story 3.6: Marble Type Selector
 */

import { useTranslations, useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { useMarbleSlug } from "@/stores/configStore";
import { MARBLE_DATA, type LocalizedMarbleName } from "@/constants/marbles";
import { DimensionInputs } from "./DimensionInputs";
import { MarbleSelector } from "./MarbleSelector";
import { FinishPicker } from "./FinishPicker";

interface ConfigPanelProps {
  /** Custom class name */
  className?: string;
}

/**
 * Get localized marble name from MARBLE_DATA
 */
function getLocalizedMarbleName(slug: string, locale: string): string {
  const marble = MARBLE_DATA[slug];
  if (!marble?.name) return slug;
  const localeKey = locale as keyof LocalizedMarbleName;
  return marble.name[localeKey] || marble.name.en;
}

/**
 * ConfigPanel - Right-side configuration panel
 *
 * Features:
 * - MarbleSelector section with live updates (Story 3.6)
 * - DimensionInputs section (Story 3.5)
 * - FinishPicker placeholder section (AC7)
 * - PriceDisplay placeholder section (AC7)
 * - Sections clearly delineated and ready for Story 3.5-3.8 (AC7)
 *
 * @example
 * ```tsx
 * <ConfigPanel />
 * ```
 */
export function ConfigPanel({ className }: ConfigPanelProps) {
  const t = useTranslations("configurator");
  const locale = useLocale();
  
  // Read marble from store (AC5: immediate updates on selection)
  const marbleSlug = useMarbleSlug();
  const marbleName = getLocalizedMarbleName(marbleSlug, locale);

  return (
    <div
      className={cn(
        "flex flex-col gap-4 md:gap-6",
        "p-4 md:p-6",
        "overflow-y-auto",
        className
      )}
      role="complementary"
      aria-label={t("panelTitle")}
    >
      {/* Selected Marble Header (AC5: updates immediately on selection) */}
      <div className="text-center md:text-left pb-2 border-b border-border/50">
        <p className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1">
          {t("selectedMarble")}
        </p>
        <h2 className="font-display text-xl md:text-2xl font-semibold text-accent">
          {marbleName}
        </h2>
      </div>

      {/* MarbleSelector Section (Story 3.6) */}
      <MarbleSelector />

      {/* DimensionInputs Section (Story 3.5) */}
      <DimensionInputs />

      {/* FinishPicker Section (Story 3.7) */}
      <FinishPicker />

      {/* PriceDisplay Section (Story 3.8) */}
      <section
        className={cn(
          "rounded-lg p-4 md:p-5",
          "bg-accent/10 border border-accent/30"
        )}
        aria-labelledby="price-section-title"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <h3
              id="price-section-title"
              className="font-body text-xs text-muted-foreground uppercase tracking-wider mb-1"
            >
              {t("priceAndWeight")}
            </h3>
            <p className="font-mono text-2xl md:text-3xl font-bold text-accent">
              €XXX
            </p>
            <p className="font-body text-xs text-muted-foreground mt-1">
              {t("weightPlaceholder")}
            </p>
          </div>
          <button
            type="button"
            className={cn(
              "w-full sm:w-auto",
              "px-6 py-3 rounded-lg",
              "bg-accent text-accent-foreground",
              "font-display font-semibold text-sm md:text-base",
              "transition-all hover:brightness-110",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
            disabled
            aria-disabled="true"
          >
            {t("addToCart")}
          </button>
        </div>
        <p className="font-body text-xs text-muted-foreground mt-3 text-center">
          {t("comingSoonStory38")}
        </p>
      </section>
    </div>
  );
}

