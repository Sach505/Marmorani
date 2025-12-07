"use client";

/**
 * ConfiguratorHeader Component
 *
 * Minimal header for the configurator page with back navigation and logo.
 * Dark-themed, unobtrusive design that doesn't compete with the 3D view.
 *
 * @see Story 3.1: Configurator Page Shell & Theme (Task 4, AC4)
 * @see Story 3.6: Marble Type Selector (reactive marble name display)
 */

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useMarbleSlug } from "@/stores/configStore";
import { MARBLE_DATA, type LocalizedMarbleName } from "@/constants/marbles";

interface ConfiguratorHeaderProps {
  /** Custom class name */
  className?: string;
}

/**
 * Get localized marble name
 */
function getLocalizedName(name: LocalizedMarbleName, locale: string): string {
  const localeKey = locale as keyof LocalizedMarbleName;
  return name[localeKey] || name.en;
}

/**
 * ConfiguratorHeader - Minimal header for configurator
 *
 * Features:
 * - Back button returns to previous page (gallery or marble detail) (AC4)
 * - Logo links to homepage (AC4)
 * - Minimal, low-profile design on dark background (AC4)
 * - Light text on dark background (AC4)
 * - Reactive marble name from Zustand store (Story 3.6)
 *
 * @example
 * ```tsx
 * <ConfiguratorHeader />
 * ```
 */
export function ConfiguratorHeader({
  className,
}: ConfiguratorHeaderProps) {
  const t = useTranslations("configurator");
  const locale = useLocale();
  const router = useRouter();
  
  // Read marble from store for reactive updates (Story 3.6)
  const currentSlug = useMarbleSlug();
  const marbleData = MARBLE_DATA[currentSlug];
  const marbleName = marbleData?.name
    ? getLocalizedName(marbleData.name, locale)
    : currentSlug;

  const handleBack = () => {
    // Navigate back to previous page (preserves history - AC4)
    router.back();
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50",
        "h-14 md:h-16",
        "bg-background/80 backdrop-blur-md",
        "border-b border-border/50",
        className
      )}
      role="banner"
    >
      <div className="h-full flex items-center justify-between px-4 md:px-6">
        {/* Back navigation (AC4) */}
        <button
          type="button"
          onClick={handleBack}
          className={cn(
            "group inline-flex items-center gap-2",
            "text-muted-foreground hover:text-foreground",
            "transition-colors duration-200",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            "rounded-sm p-1 -ml-1"
          )}
          aria-label={t("backToGallery")}
        >
          <ArrowLeft
            className="h-5 w-5 transition-transform duration-200 group-hover:-translate-x-0.5"
            aria-hidden="true"
          />
          <span className="font-body text-sm hidden sm:inline">
            {t("backToGallery")}
          </span>
        </button>

        {/* Logo - links to homepage (AC4) */}
        <Link
          href={`/${locale}`}
          className={cn(
            "font-display text-lg md:text-xl font-semibold tracking-wide",
            "text-foreground hover:text-accent",
            "transition-colors duration-200",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            "rounded-sm px-2 py-1"
          )}
          aria-label="Marmorani - Accueil"
        >
          <span className="text-accent">M</span>armorani
        </Link>

        {/* Current marble name (right side) */}
        <div className="w-24 sm:w-32 text-right">
          {marbleName && (
            <span className="font-body text-xs sm:text-sm text-muted-foreground truncate block">
              {marbleName}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}

