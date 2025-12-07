"use client";

/**
 * ConfiguratorLayout Component
 *
 * Responsive layout wrapper for desktop (70/30 grid) and mobile (stacked).
 * Handles the switch between desktop panel and mobile bottom sheet.
 *
 * @see Story 3.1: Configurator Page Shell & Theme (Task 2, Task 3, AC2, AC3)
 */

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ThreeDViewport } from "./ThreeDViewport";
import { ConfigPanel } from "./ConfigPanel";
import { MobileBottomSheet } from "./MobileBottomSheet";

interface ConfiguratorLayoutProps {
  /** Custom class name */
  className?: string;
}

// Breakpoint for mobile/desktop switch (768px per Tailwind md:)
const MOBILE_BREAKPOINT = 768;

/**
 * ConfiguratorLayout - Responsive configurator layout
 *
 * Features:
 * - Desktop: 70/30 CSS Grid split (AC2)
 * - Desktop: 3D viewport ~70% left, config panel ~30% right (AC2)
 * - Desktop: Minimum viewport height 600px (AC2)
 * - Desktop: Config panel with vertical scroll (AC2)
 * - Mobile: 60% viewport top, 40% bottom sheet (AC3)
 * - Mobile: Bottom sheet is swipeable (AC3)
 * - Responsive breakpoint at 768px (md:)
 *
 * @example
 * ```tsx
 * <ConfiguratorLayout marbleName="Carrara White" />
 * ```
 */
export function ConfiguratorLayout({
  className,
}: ConfiguratorLayoutProps) {
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile viewport on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // Initial check
    checkMobile();

    // Listen for resize
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Mobile layout (AC3)
  if (isMobile) {
    return (
      <div className={cn("relative min-h-screen pb-[40vh]", className)}>
        {/* 3D Viewport - 60% of screen (AC3) */}
        <div
          className="h-[60vh] w-full"
          style={{ height: "60vh" }}
        >
          <ThreeDViewport className="h-full" />
        </div>

        {/* Mobile Bottom Sheet - 40% collapsed, 80% expanded (AC3) */}
        <MobileBottomSheet>
          <ConfigPanel />
        </MobileBottomSheet>
      </div>
    );
  }

  // Desktop layout (AC2)
  return (
    <div
      className={cn(
        // 70/30 CSS Grid layout (AC2)
        "grid grid-cols-[70%_30%]",
        // Full height minus header
        "min-h-[calc(100vh-64px)]",
        className
      )}
    >
      {/* Left: 3D Viewport area ~70% (AC2) */}
      <div
        className={cn(
          "relative",
          "p-4 md:p-6",
          // Minimum height 600px (AC2)
          "min-h-[600px]"
        )}
      >
        <ThreeDViewport className="h-full" />
      </div>

      {/* Right: Configuration panel ~30% (AC2) */}
      <div
        className={cn(
          "border-l border-border/50",
          "bg-background",
          // Vertical scroll on overflow (AC2)
          "overflow-y-auto",
          "max-h-[calc(100vh-64px)]"
        )}
      >
        <ConfigPanel />
      </div>
    </div>
  );
}

