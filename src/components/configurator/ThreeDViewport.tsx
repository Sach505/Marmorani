"use client";

/**
 * ThreeDViewport Component
 *
 * Container for the 3D cube viewer (React Three Fiber).
 * Dynamically imports CubeViewer to prevent SSR issues.
 *
 * @see Story 3.1: Configurator Page Shell & Theme (Task 5, AC6)
 * @see Story 3.3: 3D Cube Viewer Component (Task 7, AC8)
 * @see Story 3.4: 3D Interaction Controls (Task 6, AC8)
 */

import { Suspense, useMemo } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import {
  useMarbleSlug,
  useWidth,
  useHeight,
  useDepth,
  useFinish,
  useHasHydrated,
} from "@/stores/configStore";
import { InteractionHint } from "./InteractionHint";

// Dynamic import with SSR disabled for R3F components (AC8)
const CubeViewer = dynamic(
  () => import("@/components/3d/CubeViewer").then((mod) => mod.CubeViewer),
  {
    ssr: false,
    loading: () => <LoadingShimmer />,
  }
);

interface ThreeDViewportProps {
  /** Whether to force loading state */
  isLoading?: boolean;
  /** Custom class name */
  className?: string;
}

/**
 * LoadingShimmer - Loading animation while 3D viewer initializes
 */
function LoadingShimmer() {
  const t = useTranslations("configurator");

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      {/* Shimmer background effect */}
      <div
        className={cn(
          "absolute inset-0",
          "bg-gradient-to-r from-surface via-muted/30 to-surface",
          "animate-shimmer"
        )}
        aria-hidden="true"
      />

      {/* Loading content */}
      <div className="relative z-10 text-center px-4">
        {/* 3D cube icon placeholder */}
        <div
          className={cn(
            "mx-auto mb-6",
            "w-20 h-20 md:w-24 md:h-24",
            "rounded-xl",
            "bg-accent/10 border border-accent/20",
            "flex items-center justify-center"
          )}
          aria-hidden="true"
        >
          <svg
            className="w-10 h-10 md:w-12 md:h-12 text-accent/60"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
            />
          </svg>
        </div>

        {/* Loading text */}
        <p className="font-display text-lg md:text-xl text-foreground mb-2">
          {t("viewer3dPlaceholder")}
        </p>
        <p className="font-body text-sm text-muted-foreground">{t("loading3d")}</p>

        {/* Animated dots */}
        <div className="flex justify-center gap-1.5 mt-4" aria-hidden="true">
          <span
            className="w-2 h-2 rounded-full bg-accent/60 animate-pulse"
            style={{ animationDelay: "0ms" }}
          />
          <span
            className="w-2 h-2 rounded-full bg-accent/60 animate-pulse"
            style={{ animationDelay: "150ms" }}
          />
          <span
            className="w-2 h-2 rounded-full bg-accent/60 animate-pulse"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * ThreeDViewport - Container for 3D cube visualization
 *
 * Features:
 * - Dynamic import of CubeViewer (AC8)
 * - Proper sizing for Canvas component (AC8)
 * - Loading shimmer during initialization (AC8)
 * - Responsive sizing: desktop 70%, mobile 60% (AC8)
 * - Connected to Zustand store (Task 6)
 * - Accessibility with aria-label (AC8)
 *
 * @example
 * ```tsx
 * <ThreeDViewport />
 * ```
 */
export function ThreeDViewport({ isLoading = false, className }: ThreeDViewportProps) {
  const t = useTranslations("configurator");

  // Get configuration from store (Task 6, AC1-AC3)
  const marbleSlug = useMarbleSlug();
  const width = useWidth();
  const height = useHeight();
  const depth = useDepth();
  const finish = useFinish();
  const hasHydrated = useHasHydrated();

  // Accessibility description for the 3D viewer
  const ariaLabel = useMemo(() => {
    return t("viewer3dLabel", {
      marble: marbleSlug,
      width,
      height,
      depth,
      finish: finish.toLowerCase(),
    });
  }, [t, marbleSlug, width, height, depth, finish]);

  // Show loading state until store is hydrated
  const showLoading = isLoading || !hasHydrated;

  return (
    <div
      className={cn(
        "relative w-full h-full",
        "min-h-[400px] md:min-h-[600px]",
        "rounded-lg overflow-hidden",
        "bg-[#0D0D0D]", // Nero Marquina background (AC6)
        className
      )}
      role="img"
      aria-label={ariaLabel}
      aria-busy={showLoading}
    >
      {/* Loading shimmer overlay */}
      {showLoading && <LoadingShimmer />}

      {/* 3D Canvas - only render when hydrated (Task 7) */}
      {hasHydrated && (
        <div className="absolute inset-0">
          <Suspense fallback={<LoadingShimmer />}>
            <CubeViewer
              marbleSlug={marbleSlug}
              width={width}
              height={height}
              depth={depth}
              finish={finish}
            />
          </Suspense>
          {/* First-time user interaction hint (Story 3.4: AC8) */}
          <InteractionHint />
        </div>
      )}
    </div>
  );
}
