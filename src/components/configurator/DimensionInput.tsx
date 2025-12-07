"use client";

/**
 * DimensionInput Component
 *
 * Individual dimension input with increment/decrement controls,
 * validation, and real-time store updates.
 *
 * @see Story 3.5: Dimension Input Controls
 * @see AC1: H/W/D input controls with range 5-100cm
 * @see AC2: Real-time validation with error feedback
 * @see AC3: Visual feedback at min/max limits
 * @see AC5: Typography (JetBrains Mono for values, Inter for labels)
 * @see AC6: Keyboard accessibility
 * @see AC7: Mobile responsiveness (44px touch targets)
 */

import { useState, useRef, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { MANUFACTURING_CONSTRAINTS } from "@/constants/marbles";

const { MIN_DIMENSION, MAX_DIMENSION } = MANUFACTURING_CONSTRAINTS;

/** Debounce delay for store updates (AC4: 100ms) */
const DEBOUNCE_MS = 100;

export type DimensionType = "width" | "height" | "depth";

export interface DimensionInputProps {
  /** Which dimension this input controls */
  dimension: DimensionType;
  /** Current value in cm */
  value: number;
  /** Callback when value changes (debounced) */
  onChange: (value: number) => void;
  /** Optional label override */
  label?: string;
  /** Optional class name */
  className?: string;
  /** Disable input */
  disabled?: boolean;
}

/**
 * Validate dimension value
 * Returns error key if invalid, null if valid
 */
function validateDimension(value: number): string | null {
  if (isNaN(value)) return "invalid";
  if (value < MIN_DIMENSION) return "min";
  if (value > MAX_DIMENSION) return "max";
  return null;
}

/**
 * Check if value is at boundary
 */
function getBoundaryState(value: number): "min" | "max" | null {
  if (value === MIN_DIMENSION) return "min";
  if (value === MAX_DIMENSION) return "max";
  return null;
}

/**
 * DimensionInput - Single dimension control with validation
 *
 * Features:
 * - Numeric input with +/- buttons (AC1)
 * - Real-time validation (AC2)
 * - Boundary warnings (AC3)
 * - Debounced store updates (AC4)
 * - JetBrains Mono typography (AC5)
 * - Keyboard navigation (AC6)
 * - 44px touch targets (AC7)
 */
export function DimensionInput({
  dimension,
  value,
  onChange,
  label,
  className,
  disabled = false,
}: DimensionInputProps) {
  const t = useTranslations("configurator");
  
  // Local state for immediate input feedback
  const [localValue, setLocalValue] = useState<string>(String(value));
  const [isFocused, setIsFocused] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync local value with prop when not focused
  useEffect(() => {
    if (!isFocused) {
      setLocalValue(String(value));
    }
  }, [value, isFocused]);

  // Validate current value
  const numericValue = parseFloat(localValue) || 0;
  const error = validateDimension(numericValue);
  const boundary = !error ? getBoundaryState(numericValue) : null;

  // Debounced onChange handler
  const debouncedOnChange = useCallback(
    (newValue: number) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(() => {
        // Clamp value before sending to store
        const clampedValue = Math.max(MIN_DIMENSION, Math.min(MAX_DIMENSION, newValue));
        onChange(clampedValue);
      }, DEBOUNCE_MS);
    },
    [onChange]
  );

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  /**
   * Handle input change (AC2: validation on change)
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    setLocalValue(rawValue);
    
    const parsed = parseFloat(rawValue);
    if (!isNaN(parsed)) {
      debouncedOnChange(parsed);
    }
  };

  /**
   * Handle blur (AC2: validation on blur)
   */
  const handleBlur = () => {
    setIsFocused(false);
    
    // Clamp and commit value on blur
    const parsed = parseFloat(localValue);
    if (isNaN(parsed)) {
      setLocalValue(String(value));
    } else {
      const clamped = Math.max(MIN_DIMENSION, Math.min(MAX_DIMENSION, parsed));
      setLocalValue(String(clamped));
      onChange(clamped);
    }
  };

  /**
   * Handle increment/decrement (AC6: arrow keys, shift for ±10)
   */
  const adjustValue = (delta: number) => {
    if (disabled) return;
    
    const current = parseFloat(localValue) || value;
    const newValue = Math.max(MIN_DIMENSION, Math.min(MAX_DIMENSION, current + delta));
    setLocalValue(String(newValue));
    onChange(newValue);
  };

  /**
   * Handle keyboard navigation (AC6)
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "ArrowUp":
        e.preventDefault();
        adjustValue(e.shiftKey ? 10 : 1);
        break;
      case "ArrowDown":
        e.preventDefault();
        adjustValue(e.shiftKey ? -10 : -1);
        break;
    }
  };

  // Get translated label
  const displayLabel = label || t(dimension);
  
  // Get error/warning message
  const errorMessage = error ? t(`dimensionErrors.${error}`, { 
    min: MIN_DIMENSION, 
    max: MAX_DIMENSION 
  }) : null;
  
  const warningMessage = boundary ? t(`dimensionWarnings.${boundary === "min" ? "atMin" : "atMax"}`) : null;

  return (
    <div className={cn("space-y-1", className)}>
      {/* Label (AC5: Inter font) */}
      <label
        htmlFor={`dimension-${dimension}`}
        className="block font-body text-sm text-muted-foreground"
      >
        {displayLabel}
      </label>

      {/* Input group */}
      <div className="flex items-center gap-1">
        {/* Decrement button (AC7: 44px touch target) */}
        <button
          type="button"
          onClick={() => adjustValue(-1)}
          disabled={disabled || numericValue <= MIN_DIMENSION}
          className={cn(
            "flex-shrink-0 size-11 flex items-center justify-center",
            "rounded-lg border transition-colors",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            disabled || numericValue <= MIN_DIMENSION
              ? "opacity-50 cursor-not-allowed bg-muted border-border"
              : "bg-surface hover:bg-muted border-border hover:border-accent/50"
          )}
          aria-label={t("decrementDimension", { dimension: displayLabel })}
          tabIndex={-1} // Skip in tab order, use arrow keys instead
        >
          <Minus className="size-4 text-foreground" />
        </button>

        {/* Input field (AC5: JetBrains Mono, AC6: keyboard nav) */}
        <div className="relative flex-1 min-w-0">
          <input
            ref={inputRef}
            id={`dimension-${dimension}`}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={localValue}
            onChange={handleInputChange}
            onBlur={handleBlur}
            onFocus={() => setIsFocused(true)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? `${dimension}-error` : boundary ? `${dimension}-warning` : undefined}
            className={cn(
              "w-full h-11 px-3 py-2",
              "font-mono text-center text-base",
              "rounded-lg border transition-colors",
              "bg-surface text-foreground",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              // States
              error
                ? "border-error focus-visible:ring-error/50"
                : boundary
                  ? "border-warning focus-visible:ring-warning/50"
                  : "border-border focus-visible:ring-accent",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          />
          {/* Unit label (AC1, AC5: monospace) */}
          <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-sm text-muted-foreground pointer-events-none">
            {t("unit")}
          </span>
        </div>

        {/* Increment button (AC7: 44px touch target) */}
        <button
          type="button"
          onClick={() => adjustValue(1)}
          disabled={disabled || numericValue >= MAX_DIMENSION}
          className={cn(
            "flex-shrink-0 size-11 flex items-center justify-center",
            "rounded-lg border transition-colors",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            disabled || numericValue >= MAX_DIMENSION
              ? "opacity-50 cursor-not-allowed bg-muted border-border"
              : "bg-surface hover:bg-muted border-border hover:border-accent/50"
          )}
          aria-label={t("incrementDimension", { dimension: displayLabel })}
          tabIndex={-1} // Skip in tab order, use arrow keys instead
        >
          <Plus className="size-4 text-foreground" />
        </button>
      </div>

      {/* Error message (AC2) */}
      {error && errorMessage && (
        <p
          id={`${dimension}-error`}
          className="font-body text-xs text-error"
          role="alert"
        >
          {errorMessage}
        </p>
      )}

      {/* Warning message (AC3) */}
      {!error && boundary && warningMessage && (
        <p
          id={`${dimension}-warning`}
          className="font-body text-xs text-warning"
        >
          {warningMessage}
        </p>
      )}
    </div>
  );
}

