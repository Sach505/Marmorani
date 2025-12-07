"use client";

/**
 * ConfiguratorClient Component
 *
 * Client wrapper for the configurator page.
 * Handles dark theme application, Zustand store initialization,
 * and composes the responsive layout.
 *
 * @see Story 2.6: Gallery to Configurator Navigation
 * @see Story 3.1: Configurator Page Shell & Theme (Task 1, AC1-AC8)
 */

import { useEffect, useRef } from "react";
import { useConfigStore } from "@/stores/configStore";
import { cn } from "@/lib/utils";
import { ConfiguratorHeader } from "./ConfiguratorHeader";
import { ConfiguratorLayout } from "./ConfiguratorLayout";

interface ConfiguratorClientProps {
  /** Pre-validated marble slug from server */
  initialMarble: string;
}

/**
 * ConfiguratorClient - Client-side configurator wrapper
 *
 * Features:
 * - Applies Nero Marquina dark theme (AC1)
 * - Initializes Zustand store with URL marble parameter (once on mount)
 * - Smooth theme transition on mount (cinematic fade)
 * - Composes ConfiguratorHeader and ConfiguratorLayout
 * - Full dark theme with proper color tokens (AC1):
 *   - Background: #0D0D0D (Nero Marquina bg)
 *   - Surface: #1A1A1A (Nero Marquina surface)
 *   - Text: #FFFFFF primary, #B3B3B3 secondary
 *   - Accent: #C9A962 (gold)
 *
 * @example
 * ```tsx
 * <ConfiguratorClient initialMarble="carrara-white" marbleName="Carrara White" />
 * ```
 */
export function ConfiguratorClient({
  initialMarble,
}: ConfiguratorClientProps) {
  // Track if we've already initialized from URL to prevent re-initialization
  // when user changes marble selection
  const hasInitialized = useRef(false);

  // Initialize store from URL parameter ONLY on first mount
  // This prevents overwriting user's marble selection when they change it
  useEffect(() => {
    if (initialMarble && !hasInitialized.current) {
      hasInitialized.current = true;
      useConfigStore.getState().initializeFromUrl(initialMarble);
    }
  }, [initialMarble]);

  return (
    <div
      className={cn(
        // Apply dark theme class for Nero Marquina (AC1)
        "dark",
        // Minimum height for full page
        "min-h-screen",
        // Theme transition - cinematic fade from light to dark
        "theme-transition-cinematic"
      )}
    >
      <div
        className={cn(
          // Dark background (AC1: #0D0D0D)
          "bg-background",
          // Light text (AC1: #FFFFFF)
          "text-foreground",
          // Full screen height
          "min-h-screen",
          // Configurator page fade-in animation
          "animate-configurator-enter"
        )}
      >
        {/* Minimal header with back navigation and logo (AC4) */}
        <ConfiguratorHeader />

        {/* Main configurator area - responsive layout (AC2, AC3) */}
        <main>
          <ConfiguratorLayout />
        </main>
      </div>
    </div>
  );
}
