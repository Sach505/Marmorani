"use client";

/**
 * MarbleSpecs Component
 *
 * Technical specifications section for marble detail page.
 * Displays origin, density, available finishes, and price range.
 *
 * @see Story 2.5: Marble Detail Page (Task 5)
 */

import { useLocale, useTranslations } from "next-intl";
import { MapPin, Layers3, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatPriceRange } from "@/lib/utils/price";
import { cn } from "@/lib/utils";
import type { FinishOption } from "@/types/marble";

interface MarbleSpecsProps {
  /** Country of origin */
  origin: string;
  /** Density in kg/m³ */
  density: number;
  /** Available finishes with modifiers */
  finishes: FinishOption[];
  /** Price range in cents */
  priceRange: { min: number; max: number };
  /** Optional class name */
  className?: string;
}

/**
 * MarbleSpecs - Technical specifications display
 *
 * Features:
 * - Origin country with icon
 * - Density indicator with unit
 * - Available finishes as styled badges
 * - Price range with locale-aware formatting
 *
 * @example
 * ```tsx
 * <MarbleSpecs
 *   origin="Italy"
 *   density={2711}
 *   finishes={[{ type: "POLISHED", priceModifier: 1.0 }]}
 *   priceRange={{ min: 5000, max: 150000 }}
 * />
 * ```
 */
export function MarbleSpecs({
  origin,
  density,
  finishes,
  priceRange,
  className,
}: MarbleSpecsProps) {
  const locale = useLocale();
  const t = useTranslations("marble");

  // Format density with unit
  const formattedDensity = new Intl.NumberFormat(locale).format(density);

  return (
    <section
      className={cn(
        "rounded-lg bg-surface p-6 md:p-8",
        className
      )}
      aria-label={t("specifications")}
    >
      <h2 className="mb-6 font-display text-xl font-semibold text-foreground md:text-2xl">
        {t("specifications")}
      </h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Origin */}
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-muted p-2">
            <MapPin className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t("origin")}</p>
            <p className="font-body font-medium text-foreground">{origin}</p>
          </div>
        </div>

        {/* Density */}
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-muted p-2">
            <Layers3 className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t("density")}</p>
            <p className="font-body font-medium text-foreground">
              ~{formattedDensity} kg/m³
            </p>
          </div>
        </div>

        {/* Available Finishes */}
        <div className="sm:col-span-2 lg:col-span-2">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-muted p-2">
              <Sparkles className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="mb-2 text-sm text-muted-foreground">
                {t("availableFinishes")}
              </p>
              <div className="flex flex-wrap gap-2">
                {finishes.map((finish) => (
                  <Badge
                    key={finish.type}
                    variant="secondary"
                    className="font-body text-sm"
                  >
                    {t(`finishes.${finish.type}`)}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Price Range */}
      <div className="mt-6 border-t border-border pt-6">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">{t("priceRange")}</p>
          <p className="font-display text-2xl font-semibold text-foreground md:text-3xl">
            {formatPriceRange(priceRange, locale)}
          </p>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {t("priceRangeNote")}
        </p>
      </div>
    </section>
  );
}

