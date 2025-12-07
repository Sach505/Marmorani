"use client";

/**
 * MarbleSwatch Component
 *
 * Individual marble swatch with thumbnail, hover name overlay,
 * and selection state styling.
 *
 * @see Story 3.6: Marble Type Selector
 * @see AC1: Display preview.jpg thumbnail
 * @see AC2: Marble name on hover/focus
 * @see AC3: Selected marble highlighted with gold border
 * @see AC4: View details link to marble page
 */

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { MARBLE_DATA, type LocalizedMarbleName } from "@/constants/marbles";

export interface MarbleSwatchProps {
  /** Marble slug identifier */
  slug: string;
  /** Whether this swatch is currently selected */
  isSelected: boolean;
  /** Callback when swatch is clicked/selected */
  onSelect: (slug: string) => void;
  /** Index for keyboard navigation */
  index: number;
  /** Total count for accessibility */
  totalCount: number;
  /** Whether the swatch is currently focused (for keyboard nav) */
  isFocused?: boolean;
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
 * MarbleSwatch - Single marble option in the selector grid
 *
 * Features:
 * - Preview thumbnail from /textures/{slug}/preview.jpg (AC1)
 * - Hover overlay with marble name (AC2)
 * - Gold border on selection (#C9A962) (AC3)
 * - View details link on hover (AC4)
 * - Focus state with visible ring (AC9)
 * - Touch-friendly 44px minimum (AC9)
 * - role="radio" for accessibility (AC9)
 */
export function MarbleSwatch({
  slug,
  isSelected,
  onSelect,
  index,
  totalCount,
  isFocused = false,
  className,
  disabled = false,
}: MarbleSwatchProps) {
  const locale = useLocale();
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Get marble data
  const marbleData = MARBLE_DATA[slug];
  const marbleName = marbleData?.name
    ? getLocalizedName(marbleData.name, locale)
    : slug;

  // Handle selection
  const handleClick = useCallback(() => {
    if (!disabled) {
      onSelect(slug);
    }
  }, [disabled, onSelect, slug]);

  // Handle keyboard selection
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onSelect(slug);
      }
    },
    [disabled, onSelect, slug]
  );

  // Show name overlay on hover or focus
  const showOverlay = isHovered || isFocused;

  return (
    <div
      role="radio"
      aria-checked={isSelected}
      aria-label={marbleName}
      aria-posinset={index + 1}
      aria-setsize={totalCount}
      tabIndex={isSelected ? 0 : -1}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      className={cn(
        // Base styles
        "relative aspect-square rounded-lg overflow-hidden cursor-pointer",
        "transition-all duration-200",
        // Minimum touch target (AC9: 44px)
        "min-w-11 min-h-11",
        // Border and selection states (AC3)
        "ring-2 ring-offset-2 ring-offset-background",
        isSelected
          ? "ring-accent" // Gold border for selected
          : "ring-transparent hover:ring-accent/50",
        // Focus state (AC9)
        "focus:outline-none focus-visible:ring-accent",
        // Disabled state
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {/* Marble preview image (AC1) */}
      {!imageError ? (
        <Image
          src={`/textures/${slug}/preview.jpg`}
          alt={marbleName}
          fill
          sizes="(max-width: 640px) 80px, 100px"
          className="object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        // Fallback for missing images
        <div className="w-full h-full bg-muted flex items-center justify-center">
          <span className="text-xs text-muted-foreground text-center px-1">
            {marbleName}
          </span>
        </div>
      )}

      {/* Hover/Focus overlay with marble name (AC2) */}
      <div
        className={cn(
          "absolute inset-0 bg-black/70 flex flex-col items-center justify-center p-2",
          "transition-opacity duration-200",
          "pointer-events-none", // Allow clicks to pass through to parent
          showOverlay ? "opacity-100" : "opacity-0"
        )}
        aria-hidden={!showOverlay}
      >
        <span className="font-body text-xs text-white text-center leading-tight">
          {marbleName}
        </span>

        {/* View details link (AC4) */}
        <Link
          href={`/marble/${slug}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className={cn(
            "mt-2 flex items-center gap-1 text-[10px] text-accent hover:text-accent/80",
            "transition-colors",
            "pointer-events-auto", // Re-enable pointer events for link
            "focus:outline-none focus-visible:underline"
          )}
          aria-label={`View details for ${marbleName}`}
        >
          <ExternalLink className="size-3" />
        </Link>
      </div>

      {/* Selected indicator (AC3) */}
      {isSelected && (
        <div
          className="absolute bottom-1 right-1 size-3 rounded-full bg-accent"
          aria-hidden="true"
        />
      )}
    </div>
  );
}

