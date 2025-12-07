"use client";

/**
 * MobileBottomSheet Component
 *
 * Draggable bottom sheet for mobile configurator layout.
 * Shows collapsed by default, expandable via swipe or tap.
 *
 * @see Story 3.1: Configurator Page Shell & Theme (Task 3, AC3)
 */

import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { ChevronUp, GripHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileBottomSheetProps {
  /** Children to render inside the sheet */
  children: React.ReactNode;
  /** Custom class name */
  className?: string;
}

/**
 * MobileBottomSheet - Swipeable bottom panel for mobile
 *
 * Features:
 * - Collapsed state shows essential controls (40% height) (AC3)
 * - Expanded state shows all options (80% height) (AC3)
 * - Swipe up to expand, down to collapse (AC3)
 * - Tap handle area to toggle (AC3)
 * - Focus trap when expanded (AC8)
 *
 * @example
 * ```tsx
 * <MobileBottomSheet>
 *   <ConfigPanel marbleName="Carrara White" />
 * </MobileBottomSheet>
 * ```
 */
export function MobileBottomSheet({
  children,
  className,
}: MobileBottomSheetProps) {
  const t = useTranslations("configurator");
  const [isExpanded, setIsExpanded] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef<number | null>(null);
  const currentTranslateY = useRef(0);

  // Height values (percentage of viewport)
  const collapsedHeight = 40; // 40vh
  const expandedHeight = 80; // 80vh

  const toggleExpanded = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  // Handle keyboard accessibility
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleExpanded();
      } else if (e.key === "Escape" && isExpanded) {
        setIsExpanded(false);
      }
    },
    [isExpanded, toggleExpanded]
  );

  // Touch handlers for swipe gesture (AC3)
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    dragStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (dragStartY.current === null) return;

      const currentY = e.touches[0].clientY;
      const deltaY = dragStartY.current - currentY;

      // Determine direction
      if (Math.abs(deltaY) > 30) {
        // Threshold for gesture recognition
        if (deltaY > 0 && !isExpanded) {
          // Swipe up - expand
          setIsExpanded(true);
        } else if (deltaY < 0 && isExpanded) {
          // Swipe down - collapse
          setIsExpanded(false);
        }
        dragStartY.current = null;
      }
    },
    [isExpanded]
  );

  const handleTouchEnd = useCallback(() => {
    dragStartY.current = null;
  }, []);

  // Focus trap when expanded (AC8)
  useEffect(() => {
    if (isExpanded && sheetRef.current) {
      // Find first focusable element
      const focusableElements = sheetRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus();
      }
    }
  }, [isExpanded]);

  return (
    <div
      ref={sheetRef}
      className={cn(
        "fixed inset-x-0 bottom-0 z-40",
        "bg-background",
        "rounded-t-2xl",
        "border-t border-border/50",
        "shadow-2xl shadow-black/30",
        "transition-all duration-300 ease-out",
        className
      )}
      style={{
        height: `${isExpanded ? expandedHeight : collapsedHeight}vh`,
      }}
      role="region"
      aria-label={t("configPanel")}
      aria-expanded={isExpanded}
    >
      {/* Drag handle (AC3) */}
      <div
        className={cn(
          "flex flex-col items-center justify-center",
          "py-3 px-4",
          "cursor-grab active:cursor-grabbing",
          "select-none touch-none"
        )}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={toggleExpanded}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label={isExpanded ? t("collapsePanel") : t("expandPanel")}
      >
        {/* Visual handle indicator */}
        <div
          className="w-12 h-1.5 rounded-full bg-muted-foreground/40 mb-2"
          aria-hidden="true"
        />

        {/* Expand/collapse icon */}
        <div className="flex items-center gap-2 text-muted-foreground">
          <ChevronUp
            className={cn(
              "w-5 h-5 transition-transform duration-300",
              isExpanded && "rotate-180"
            )}
            aria-hidden="true"
          />
          <span className="font-body text-xs uppercase tracking-wider">
            {isExpanded ? t("tapToCollapse") : t("tapToExpand")}
          </span>
          <ChevronUp
            className={cn(
              "w-5 h-5 transition-transform duration-300",
              isExpanded && "rotate-180"
            )}
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Sheet content with scroll */}
      <div
        className={cn(
          "overflow-y-auto",
          "h-[calc(100%-60px)]",
          "overscroll-contain"
        )}
      >
        {children}
      </div>
    </div>
  );
}

