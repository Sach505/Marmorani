"use client";

/**
 * MarbleSelector Component
 *
 * Grid of marble swatches with keyboard navigation,
 * mobile horizontal scroll, and Zustand store integration.
 *
 * @see Story 3.6: Marble Type Selector
 * @see AC1: Grid of marble swatches with thumbnail textures
 * @see AC3: Currently selected marble highlighted
 * @see AC5: Immediate 3D texture change on selection
 * @see AC7: Price and weight recalculation
 * @see AC8: Mobile horizontal scroll
 * @see AC9: Keyboard navigation and accessibility
 */

import { useCallback, useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { MARBLE_SLUGS, MARBLE_DATA, type LocalizedMarbleName } from "@/constants/marbles";
import { useMarbleSlug, useConfigStore } from "@/stores/configStore";
import { MarbleSwatch } from "./MarbleSwatch";

export interface MarbleSelectorProps {
  /** Optional class name */
  className?: string;
  /** Disabled state */
  disabled?: boolean;
}

/**
 * Get localized marble name
 */
function getLocalizedName(name: LocalizedMarbleName, locale: string): string {
  const localeKey = locale as keyof LocalizedMarbleName;
  return name[localeKey] || name.en;
}

/**
 * MarbleSelector - Grid of marble swatches with selection
 *
 * Features:
 * - Responsive grid: 5-6 columns desktop, 4 columns mobile (AC1)
 * - Mobile horizontal scroll with snap (AC8)
 * - Keyboard navigation with Arrow keys (AC9)
 * - role="radiogroup" for accessibility (AC9)
 * - Gold border on selected swatch (AC3)
 * - Immediate store update on selection (AC5)
 * - Triggers weight/price recalculation (AC7)
 */
export function MarbleSelector({
  className,
  disabled = false,
}: MarbleSelectorProps) {
  const t = useTranslations("configurator");
  const locale = useLocale();

  // Current selection from store (AC5)
  const currentSlug = useMarbleSlug();

  // Track focused swatch for keyboard navigation (AC9)
  // Initialize with current selection index
  const currentSlugIndex = MARBLE_SLUGS.indexOf(currentSlug);
  const [focusedIndex, setFocusedIndex] = useState<number>(
    currentSlugIndex >= 0 ? currentSlugIndex : 0
  );

  // Ref for the grid container
  const gridRef = useRef<HTMLDivElement>(null);
  const swatchRefs = useRef<Map<string, HTMLElement>>(new Map());

  // Get selected marble name for screen reader announcement
  const selectedMarble = MARBLE_DATA[currentSlug];
  const selectedName = selectedMarble?.name
    ? getLocalizedName(selectedMarble.name, locale)
    : currentSlug;

  /**
   * Handle marble selection (AC5, AC7)
   * Uses getState() for SSR-safe action call
   */
  const handleSelect = useCallback(
    (slug: string) => {
      if (disabled) return;
      useConfigStore.getState().setMarble(slug);
      // Update focused index to match selection
      const newIndex = MARBLE_SLUGS.indexOf(slug);
      if (newIndex >= 0) {
        setFocusedIndex(newIndex);
      }
    },
    [disabled]
  );

  /**
   * Handle keyboard navigation (AC9)
   * - ArrowLeft/ArrowRight for horizontal navigation
   * - ArrowUp/ArrowDown for grid navigation
   * - Enter/Space to select
   * - Home/End for first/last
   */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;

      const totalCount = MARBLE_SLUGS.length;
      let newIndex = focusedIndex;

      // Calculate columns based on viewport (approximate)
      const columnsDesktop = 5;
      const columnsMobile = 4;
      const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
      const columns = isMobile ? columnsMobile : columnsDesktop;

      switch (e.key) {
        case "ArrowRight":
          e.preventDefault();
          newIndex = (focusedIndex + 1) % totalCount;
          break;
        case "ArrowLeft":
          e.preventDefault();
          newIndex = (focusedIndex - 1 + totalCount) % totalCount;
          break;
        case "ArrowDown":
          e.preventDefault();
          newIndex = Math.min(focusedIndex + columns, totalCount - 1);
          break;
        case "ArrowUp":
          e.preventDefault();
          newIndex = Math.max(focusedIndex - columns, 0);
          break;
        case "Home":
          e.preventDefault();
          newIndex = 0;
          break;
        case "End":
          e.preventDefault();
          newIndex = totalCount - 1;
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          handleSelect(MARBLE_SLUGS[focusedIndex]);
          return;
        default:
          return;
      }

      setFocusedIndex(newIndex);

      // Focus the new swatch
      const newSlug = MARBLE_SLUGS[newIndex];
      const swatchEl = swatchRefs.current.get(newSlug);
      if (swatchEl) {
        swatchEl.focus();
        // Scroll into view for mobile horizontal scroll
        swatchEl.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    },
    [disabled, focusedIndex, handleSelect]
  );


  return (
    <section
      className={cn(
        "rounded-lg border border-border bg-surface/50 p-4",
        className
      )}
      aria-labelledby="marble-section-title"
    >
      {/* Section heading */}
      <h3
        id="marble-section-title"
        className="font-display text-base md:text-lg font-semibold mb-3"
      >
        {t("marbleSelector")}
      </h3>

      {/* Screen reader announcement for selection */}
      <div className="sr-only" role="status" aria-live="polite">
        {t("marbleSelector")}: {selectedName}
      </div>

      {/* Marble grid with radiogroup role (AC9) */}
      <div
        ref={gridRef}
        role="radiogroup"
        aria-label={t("marbleSelector")}
        onKeyDown={handleKeyDown}
        className={cn(
          // Desktop: Grid layout (AC1: 5-6 columns)
          "hidden md:grid",
          "grid-cols-5 lg:grid-cols-6 gap-2"
        )}
      >
        {MARBLE_SLUGS.map((slug, index) => (
          <div
            key={slug}
            ref={(el) => {
              if (el) swatchRefs.current.set(slug, el);
            }}
          >
            <MarbleSwatch
              slug={slug}
              isSelected={slug === currentSlug}
              onSelect={handleSelect}
              index={index}
              totalCount={MARBLE_SLUGS.length}
              isFocused={index === focusedIndex}
              disabled={disabled}
            />
          </div>
        ))}
      </div>

      {/* Mobile: Horizontal scroll container (AC8) */}
      <div
        className={cn(
          "md:hidden",
          "relative"
        )}
      >
        {/* Scroll container */}
        <div
          role="radiogroup"
          aria-label={t("marbleSelector")}
          onKeyDown={handleKeyDown}
          className={cn(
            // Horizontal scroll (AC8)
            "flex gap-2 overflow-x-auto",
            // Scroll snap (AC8)
            "snap-x snap-mandatory",
            // Hide scrollbar but keep functionality
            "scrollbar-none",
            // Padding for scroll shadows
            "px-1 py-1 -mx-1"
          )}
        >
          {MARBLE_SLUGS.map((slug, index) => (
            <div
              key={slug}
              ref={(el) => {
                if (el) swatchRefs.current.set(slug, el);
              }}
              className={cn(
                // Fixed width for mobile swatches (AC8)
                "flex-shrink-0 w-16 h-16",
                // Scroll snap alignment (AC8)
                "snap-center"
              )}
            >
              <MarbleSwatch
                slug={slug}
                isSelected={slug === currentSlug}
                onSelect={handleSelect}
                index={index}
                totalCount={MARBLE_SLUGS.length}
                isFocused={index === focusedIndex}
                disabled={disabled}
              />
            </div>
          ))}
        </div>

        {/* Scroll fade indicators (AC8) */}
        <div
          className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-surface/50 to-transparent pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-surface/50 to-transparent pointer-events-none"
          aria-hidden="true"
        />
      </div>
    </section>
  );
}

