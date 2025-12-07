"use client";

/**
 * MarbleCTA Component
 *
 * Call-to-action button for navigating to the configurator.
 * Uses gold accent color per UX spec.
 *
 * @see Story 2.5: Marble Detail Page (Task 6)
 */

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface MarbleCTAProps {
  /** Marble slug for configurator navigation */
  slug: string;
  /** Optional class name */
  className?: string;
  /** Whether to use sticky positioning on mobile */
  sticky?: boolean;
}

/**
 * MarbleCTA - Gold accent CTA button
 *
 * Features:
 * - Gold accent color (#C9A962) per UX spec
 * - Links to configurator with marble pre-selected
 * - Hover animation with scale and brightness
 * - Optional sticky positioning for mobile
 *
 * @example
 * ```tsx
 * <MarbleCTA slug="carrara-white" sticky />
 * ```
 */
export function MarbleCTA({ slug, className, sticky = false }: MarbleCTAProps) {
  const locale = useLocale();
  const t = useTranslations("marble");

  const configuratorUrl = `/${locale}/configurator?marble=${slug}`;

  return (
    <div
      className={cn(
        sticky && "sticky bottom-0 z-40 bg-background/80 backdrop-blur-sm py-4 md:relative md:bg-transparent md:backdrop-blur-none md:py-0",
        className
      )}
    >
      <Link
        href={configuratorUrl}
        className={cn(
          "group inline-flex w-full items-center justify-center gap-2",
          "rounded-lg px-8 py-4 md:w-auto",
          // Gold accent color
          "bg-accent text-accent-foreground",
          // Hover animation per UX spec 6.1
          "transition-all duration-300 ease-out",
          "hover:scale-[1.02] hover:brightness-110 hover:shadow-lg",
          // Focus state
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
          // Typography
          "font-display text-lg font-semibold tracking-wide"
        )}
      >
        {t("createCube")}
        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
}

