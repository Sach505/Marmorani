"use client";

/**
 * FinishPicker Component
 *
 * Horizontal row of finish options with keyboard navigation,
 * accessibility, and Zustand store integration.
 *
 * @see Story 3.7: Finish Picker
 * @see AC1: Display available finishes for selected marble
 * @see AC3: 3D material updates on selection
 * @see AC4: Price recalculation with finish modifier
 * @see AC5: Selection state with gold highlight
 * @see AC6: Keyboard navigation and accessibility
 * @see AC7: Mobile-responsive layout
 */

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { FINISH_TYPES } from "@/constants/marbles";
import { useFinish, useConfigStore } from "@/stores/configStore";
import { FinishOption } from "./FinishOption";

export interface FinishPickerProps {
  /** Optional class name */
  className?: string;
  /** Disabled state */
  disabled?: boolean;
}

/**
 * FinishPicker - Row of finish options with selection
 *
 * Features:
 * - All 4 finish types displayed (AC1)
 * - Horizontal pill/button layout (AC2, AC7)
 * - Keyboard navigation with Arrow keys (AC6)
 * - role="radiogroup" for accessibility (AC6)
 * - Gold highlight on selected option (AC5)
 * - Immediate store update on selection (AC3, AC4)
 * - Responsive wrap on mobile if needed (AC7)
 * - Minimum 44x44px touch targets (AC7)
 */
export function FinishPicker({
  className,
  disabled = false,
}: FinishPickerProps) {
  const t = useTranslations("configurator");

  // Current selection from store (AC3)
  const currentFinish = useFinish();

  // Track focused option for keyboard navigation (AC6)
  const currentFinishIndex = FINISH_TYPES.indexOf(currentFinish);
  const [focusedIndex, setFocusedIndex] = useState<number>(
    currentFinishIndex >= 0 ? currentFinishIndex : 0
  );

  /**
   * Handle finish selection (AC3, AC4)
   * Uses getState() for SSR-safe action call
   * Triggers automatic price recalculation via store
   */
  const handleSelect = useCallback(
    (finish: typeof FINISH_TYPES[number]) => {
      if (disabled) return;
      useConfigStore.getState().setFinish(finish);
      // Update focused index to match selection
      const newIndex = FINISH_TYPES.indexOf(finish);
      if (newIndex >= 0) {
        setFocusedIndex(newIndex);
      }
    },
    [disabled]
  );

  /**
   * Handle keyboard navigation (AC6)
   * - ArrowLeft/ArrowRight for navigation
   * - Enter/Space to select
   * - Home/End for first/last
   */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;

      const totalCount = FINISH_TYPES.length;
      let newIndex = focusedIndex;

      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
          e.preventDefault();
          newIndex = (focusedIndex + 1) % totalCount;
          break;
        case "ArrowLeft":
        case "ArrowUp":
          e.preventDefault();
          newIndex = (focusedIndex - 1 + totalCount) % totalCount;
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
          handleSelect(FINISH_TYPES[focusedIndex]);
          return;
        default:
          return;
      }

      setFocusedIndex(newIndex);
    },
    [disabled, focusedIndex, handleSelect]
  );

  return (
    <section
      className={cn(
        "rounded-lg border border-border bg-surface/50 p-4",
        className
      )}
      aria-labelledby="finish-section-title"
    >
      {/* Section heading */}
      <h3
        id="finish-section-title"
        className="font-display text-base md:text-lg font-semibold mb-3"
      >
        {t("finish")}
      </h3>

      {/* Screen reader announcement for selection */}
      <div className="sr-only" role="status" aria-live="polite">
        {t("finish")}: {t(`finishes.${currentFinish}`)}
      </div>

      {/* Finish options with radiogroup role (AC6) */}
      <div
        role="radiogroup"
        aria-label={t("finish")}
        onKeyDown={handleKeyDown}
        className={cn(
          // Horizontal row with gap (AC2, AC7)
          "flex flex-wrap gap-2",
          // Responsive: Optional wrap to second row if many finishes (AC7)
          "items-start"
        )}
      >
        {FINISH_TYPES.map((finish, index) => (
          <FinishOption
            key={finish}
            finish={finish}
            isSelected={finish === currentFinish}
            onSelect={handleSelect}
            index={index}
            totalCount={FINISH_TYPES.length}
            disabled={disabled}
          />
        ))}
      </div>
    </section>
  );
}
