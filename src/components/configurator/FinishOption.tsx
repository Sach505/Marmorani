"use client";

/**
 * FinishOption Component
 *
 * Individual finish option button with visual indicator,
 * localized name, and price modifier display.
 *
 * @see Story 3.7: Finish Picker
 * @see AC2: Finish option display with localized name, visual indicator, price modifier
 * @see AC5: Selection state with gold highlight
 * @see AC6: Keyboard navigation and accessibility
 */

import { useCallback } from "react";
import { useTranslations } from "next-intl";
import { Sparkles, Grid3x3, Mountain, Rows3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { FinishType } from "@/generated/prisma/enums";
import { FINISH_PRICE_MODIFIERS } from "@/constants/marbles";

export interface FinishOptionProps {
  /** Finish type */
  finish: FinishType;
  /** Whether this option is currently selected */
  isSelected: boolean;
  /** Callback when option is clicked/selected */
  onSelect: (finish: FinishType) => void;
  /** Index for keyboard navigation */
  index: number;
  /** Total count for accessibility */
  totalCount: number;
  /** Optional class name */
  className?: string;
  /** Disabled state */
  disabled?: boolean;
}

/**
 * Icon mapping for finish types (AC2: visual indicator)
 */
const FINISH_ICONS = {
  [FinishType.POLISHED]: Sparkles,
  [FinishType.HONED]: Grid3x3,
  [FinishType.RAW]: Mountain,
  [FinishType.BRUSHED]: Rows3,
} as const;

/**
 * Format price modifier as percentage string
 * e.g., 1.1 => "+10%", 0.95 => "-5%", 1.0 => null
 */
function formatPriceModifier(modifier: number): string | null {
  if (modifier === 1.0) return null;
  const percent = Math.round((modifier - 1.0) * 100);
  return percent > 0 ? `+${percent}%` : `${percent}%`;
}

/**
 * FinishOption - Single finish option button
 *
 * Features:
 * - Localized finish name (AC2)
 * - Visual icon indicator for finish texture (AC2)
 * - Price modifier display if != 1.0 (AC2)
 * - Gold border/background on selection (AC5)
 * - Focus ring styling (AC6)
 * - Minimum 44x44px touch target (AC7)
 * - role="radio" for accessibility (AC6)
 */
export function FinishOption({
  finish,
  isSelected,
  onSelect,
  index,
  totalCount,
  className,
  disabled = false,
}: FinishOptionProps) {
  const t = useTranslations("configurator.finishes");

  // Get finish name and icon
  const finishName = t(finish);
  const Icon = FINISH_ICONS[finish];

  // Get price modifier
  const priceModifier = FINISH_PRICE_MODIFIERS[finish];
  const priceModifierText = formatPriceModifier(priceModifier);

  // Handle selection
  const handleClick = useCallback(() => {
    if (!disabled) {
      onSelect(finish);
    }
  }, [disabled, onSelect, finish]);

  // Handle keyboard selection
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onSelect(finish);
      }
    },
    [disabled, onSelect, finish]
  );

  return (
    <button
      type="button"
      role="radio"
      aria-checked={isSelected}
      aria-label={`${finishName}${priceModifierText ? ` (${priceModifierText})` : ""}`}
      aria-posinset={index + 1}
      aria-setsize={totalCount}
      tabIndex={isSelected ? 0 : -1}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      className={cn(
        // Base styles - pill/button layout (AC2)
        "flex items-center gap-2 px-4 py-2.5 rounded-lg",
        "font-body text-sm transition-all duration-200",
        // Minimum touch target (AC7: 44px)
        "min-h-11",
        // Selection states (AC5: gold highlight)
        isSelected
          ? "bg-accent text-accent-foreground ring-2 ring-accent"
          : "bg-muted text-muted-foreground hover:bg-muted/80 ring-2 ring-transparent",
        // Focus state (AC6)
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        // Disabled state
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {/* Visual indicator icon (AC2) */}
      <Icon
        className={cn(
          "size-4 flex-shrink-0",
          isSelected ? "text-accent-foreground" : "text-muted-foreground/60"
        )}
        aria-hidden="true"
      />

      {/* Finish name (AC2: localized) */}
      <span className="font-medium">{finishName}</span>

      {/* Price modifier if != 1.0 (AC2) */}
      {priceModifierText && (
        <span
          className={cn(
            "ml-auto text-xs font-mono",
            isSelected ? "text-accent-foreground/80" : "text-muted-foreground"
          )}
          aria-label={`Price modifier: ${priceModifierText}`}
        >
          {priceModifierText}
        </span>
      )}
    </button>
  );
}
