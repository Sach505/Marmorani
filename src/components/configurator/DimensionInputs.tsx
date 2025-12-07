"use client";

/**
 * DimensionInputs Component
 *
 * Composite component that groups all three dimension inputs (H×W×D)
 * with Zustand store integration and debounced updates.
 *
 * @see Story 3.5: Dimension Input Controls
 * @see AC1: H/W/D input controls
 * @see AC4: Real-time 3D view updates (debounced)
 * @see AC5: Typography hierarchy
 * @see AC8: Integration with Zustand store
 */

import { useCallback } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useWidth, useHeight, useDepth, useConfigStore } from "@/stores/configStore";
import { DimensionInput, type DimensionType } from "./DimensionInput";

export interface DimensionInputsProps {
  /** Optional class name */
  className?: string;
}

/**
 * Dimension configuration for mapping
 */
const DIMENSION_CONFIG: { key: DimensionType; labelKey: "width" | "height" | "depth" }[] = [
  { key: "width", labelKey: "width" },
  { key: "height", labelKey: "height" },
  { key: "depth", labelKey: "depth" },
];

/**
 * DimensionInputs - Composite H×W×D dimension controls
 *
 * Features:
 * - Three DimensionInput components for W, H, D (AC1)
 * - Connected to Zustand store (AC8)
 * - Debounced updates trigger 3D view refresh (AC4)
 * - Section heading with translations (AC5)
 * - Follows ConfigPanel styling conventions
 */
export function DimensionInputs({ className }: DimensionInputsProps) {
  const t = useTranslations("configurator");
  
  // Read current dimensions from store using individual selectors (AC8)
  // Using individual selectors avoids SSR hydration issues with object selectors
  const width = useWidth();
  const height = useHeight();
  const depth = useDepth();
  
  // Stable callbacks to store actions (AC8)
  // Using useCallback with getState() avoids SSR hydration issues
  const handleWidthChange = useCallback((value: number) => {
    useConfigStore.getState().setWidth(value);
  }, []);
  
  const handleHeightChange = useCallback((value: number) => {
    useConfigStore.getState().setHeight(value);
  }, []);
  
  const handleDepthChange = useCallback((value: number) => {
    useConfigStore.getState().setDepth(value);
  }, []);

  /**
   * Map dimension key to setter action
   */
  const getSetterForDimension = (dimension: DimensionType) => {
    switch (dimension) {
      case "width":
        return handleWidthChange;
      case "height":
        return handleHeightChange;
      case "depth":
        return handleDepthChange;
    }
  };

  /**
   * Get current value for dimension
   */
  const getValueForDimension = (dimension: DimensionType): number => {
    switch (dimension) {
      case "width":
        return width;
      case "height":
        return height;
      case "depth":
        return depth;
    }
  };

  return (
    <section
      className={cn(
        "rounded-lg border border-border bg-surface/50 p-4",
        className
      )}
      aria-labelledby="dimensions-section-title"
    >
      {/* Section heading (AC5: Display font hierarchy) */}
      <h3
        id="dimensions-section-title"
        className="font-display text-base md:text-lg font-semibold mb-4"
      >
        {t("dimensions")}
      </h3>

      {/* Dimension inputs */}
      <div className="space-y-4">
        {DIMENSION_CONFIG.map(({ key, labelKey }) => (
          <DimensionInput
            key={key}
            dimension={key}
            value={getValueForDimension(key)}
            onChange={getSetterForDimension(key)}
            label={t(labelKey)}
          />
        ))}
      </div>
    </section>
  );
}

