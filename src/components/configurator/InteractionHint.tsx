/**
 * InteractionHint Component
 *
 * First-time user hint overlay for 3D cube interaction.
 * Shows "Drag to rotate" and fades out after interaction or timeout.
 *
 * @see Story 3.4: 3D Interaction Controls (Task 6, AC8)
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

// ============================================================================
// CONSTANTS
// ============================================================================

/** localStorage key for hint dismissed state */
const HINT_SHOWN_KEY = "marmorani_configurator_hint_shown";

/** Hint auto-dismiss timeout (ms) */
const AUTO_DISMISS_MS = 3000;

/** Fade out animation duration (ms) */
const FADE_DURATION_MS = 500;

// ============================================================================
// TYPES
// ============================================================================

interface InteractionHintProps {
  /** Callback when user interacts (used to dismiss hint) */
  onInteraction?: () => void;
  /** Custom class name */
  className?: string;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Check if hint should be shown (not previously dismissed)
 */
function shouldShowHint(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return !localStorage.getItem(HINT_SHOWN_KEY);
  } catch {
    // localStorage might not be available (private browsing, etc.)
    return true;
  }
}

/**
 * Mark hint as shown in localStorage
 */
function markHintAsShown(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(HINT_SHOWN_KEY, "true");
  } catch {
    // Ignore localStorage errors
  }
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * InteractionHint - First-time user hint overlay
 *
 * Features:
 * - Shows "Drag to rotate" text with animated icon (AC8.1, AC8.2)
 * - Positioned centered over 3D canvas (AC8.3)
 * - Checks localStorage for previous dismissal (AC8.4)
 * - Fades out on first interaction or after 3 seconds (AC8.5)
 * - Sets localStorage flag after dismissed (AC8.6)
 * - Accessible with aria-label (AC8.7)
 * - i18n translation keys (AC8.8)
 */
export function InteractionHint({ onInteraction, className }: InteractionHintProps) {
  const t = useTranslations("configurator");

  // State - lazy initialization to avoid setState in effect
  const [isVisible, setIsVisible] = useState(() => shouldShowHint());
  const [isFadingOut, setIsFadingOut] = useState(false);

  // Dismiss handler
  const dismissHint = useCallback(() => {
    if (isFadingOut) return;

    setIsFadingOut(true);
    markHintAsShown();

    // Remove from DOM after fade animation
    setTimeout(() => {
      setIsVisible(false);
    }, FADE_DURATION_MS);
  }, [isFadingOut]);

  // Auto-dismiss timer
  useEffect(() => {
    if (!isVisible || isFadingOut) return;

    const timer = setTimeout(() => {
      dismissHint();
    }, AUTO_DISMISS_MS);

    return () => clearTimeout(timer);
  }, [isVisible, isFadingOut, dismissHint]);

  // Handle user interaction (dismiss immediately)
  const handleInteraction = useCallback(() => {
    dismissHint();
    onInteraction?.();
  }, [dismissHint, onInteraction]);

  // Listen for pointer/touch events on document (for 3D canvas interactions)
  useEffect(() => {
    if (!isVisible || isFadingOut) return;

    const handlePointerDown = () => {
      handleInteraction();
    };

    // Add listeners with capture to catch events before 3D canvas
    document.addEventListener("pointerdown", handlePointerDown, { capture: true, once: true });
    document.addEventListener("touchstart", handlePointerDown, { capture: true, once: true });

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown, { capture: true });
      document.removeEventListener("touchstart", handlePointerDown, { capture: true });
    };
  }, [isVisible, isFadingOut, handleInteraction]);

  // Don't render if not visible
  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "absolute inset-0 flex items-center justify-center",
        "pointer-events-none z-10",
        "transition-opacity",
        isFadingOut ? "opacity-0" : "opacity-100",
        className
      )}
      style={{ transitionDuration: `${FADE_DURATION_MS}ms` }}
      role="status"
      aria-live="polite"
      aria-label={t("hint.dragToRotate")}
    >
      {/* Hint container */}
      <div
        className={cn(
          "flex flex-col items-center gap-3",
          "px-6 py-4 rounded-xl",
          "bg-black/60 backdrop-blur-sm",
          "border border-white/10"
        )}
      >
        {/* Animated rotate icon */}
        <div
          className={cn(
            "w-12 h-12 rounded-full",
            "bg-white/10 border border-white/20",
            "flex items-center justify-center",
            "animate-pulse"
          )}
          aria-hidden="true"
        >
          {/* Rotate icon SVG */}
          <svg
            className="w-6 h-6 text-white animate-[spin_3s_ease-in-out_infinite]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
        </div>

        {/* Hint text */}
        <p className="font-body text-sm text-white/90 text-center">
          {t("hint.dragToRotate")}
        </p>

        {/* Subtext for touch devices */}
        <p className="font-body text-xs text-white/60 text-center hidden sm:block">
          {t("hint.scrollToZoom")}
        </p>
        <p className="font-body text-xs text-white/60 text-center sm:hidden">
          {t("hint.pinchToZoom")}
        </p>
      </div>
    </div>
  );
}

export default InteractionHint;

