"use client";

/**
 * MarbleCard Component
 *
 * Gallery card with hover overlay showing marble name and starting price.
 * Implements UX spec 6.1 hover animations.
 * Includes quick-configure action for direct configurator navigation (AC5).
 *
 * @see Story 2.3: Inspiration Gallery Page (Task 3)
 * @see Story 2.6: Gallery to Configurator Navigation (Task 5)
 */

import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MarbleCardProps } from "@/types/gallery";

/**
 * Format price in cents to locale currency string
 */
function formatPrice(cents: number, locale: string): string {
  const euros = cents / 100;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(euros);
}

export function MarbleCard({ item, priority = false, className }: MarbleCardProps) {
  const locale = useLocale();
  const t = useTranslations("gallery");
  const tCommon = useTranslations("header");

  const href = item.marbleSlug
    ? `/${locale}/marble/${item.marbleSlug}`
    : undefined;

  // Quick-configure URL (AC5)
  const configuratorHref = item.marbleSlug
    ? `/${locale}/configurator?marble=${item.marbleSlug}`
    : undefined;

  const CardContent = (
    <article
      className={cn(
        "group relative aspect-[4/3] overflow-hidden rounded-lg bg-muted",
        "transition-all duration-300 ease-out",
        // Hover scale per UX spec 6.1
        "hover:scale-[1.02] hover:shadow-lg",
        // Featured items get special styling
        item.featured && "ring-2 ring-accent/50",
        className
      )}
    >
      {/* Image */}
      <Image
        src={item.imageUrl}
        alt={item.title}
        fill
        sizes="(max-width: 768px) 50vw, 33vw"
        priority={priority}
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* Featured badge */}
      {item.featured && (
        <div className="absolute left-3 top-3 z-10">
          <span className="rounded-full bg-accent px-3 py-1 font-body text-xs font-medium text-accent-foreground">
            {t("featured")}
          </span>
        </div>
      )}

      {/* Hover Overlay - Desktop only */}
      <div
        className={cn(
          "absolute inset-0 flex flex-col justify-end p-4",
          "bg-gradient-to-t from-black/70 via-black/20 to-transparent",
          // Desktop: opacity transition on hover
          "opacity-0 transition-opacity duration-300 ease-out md:group-hover:opacity-100",
          // Mobile: always visible
          "max-md:opacity-100"
        )}
      >
        {/* Marble Name */}
        {item.marbleName && (
          <h3 className="font-display text-lg font-semibold text-white md:text-xl">
            {item.marbleName}
          </h3>
        )}

        {/* Title (if different from marble name) */}
        {(!item.marbleName || item.title !== item.marbleName) && (
          <p className="font-body text-sm text-white/90">{item.title}</p>
        )}

        {/* Starting Price */}
        {item.startingPrice && (
          <p className="mt-1 font-body text-sm text-accent">
            {t("fromPrice", { price: formatPrice(item.startingPrice, locale) })}
          </p>
        )}

        {/* Use Case Badge */}
        {item.useCase && (
          <span className="mt-2 inline-block w-fit rounded-full bg-white/20 px-2 py-0.5 font-body text-xs text-white/80 backdrop-blur-sm">
            {t(`useCases.${item.useCase}`)}
          </span>
        )}
      </div>

      {/* Quick-configure overlay (AC5) - Desktop only */}
      {configuratorHref && (
        <Link
          href={configuratorHref}
          onClick={(e) => e.stopPropagation()}
          className={cn(
            "absolute right-3 top-3 z-20",
            "flex h-9 w-9 items-center justify-center",
            "rounded-full bg-accent text-accent-foreground",
            "opacity-0 transition-all duration-300",
            "hover:scale-110 hover:brightness-110",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent",
            // Show on hover (desktop) or always visible on touch (mobile)
            "group-hover:opacity-100 max-md:opacity-100"
          )}
          aria-label={tCommon("configurator")}
        >
          <Settings2 className="h-4 w-4" />
        </Link>
      )}
    </article>
  );

  // Wrap in Link if marble has a detail page
  if (href) {
    return (
      <Link href={href} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-accent">
        {CardContent}
      </Link>
    );
  }

  return CardContent;
}

