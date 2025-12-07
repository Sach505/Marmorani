/**
 * GalleryGridSkeleton Component
 *
 * Full grid skeleton for gallery loading state.
 *
 * @see Story 2.3: Inspiration Gallery Page (Task 5.3)
 */

import { cn } from "@/lib/utils";
import { GalleryCardSkeleton } from "./GalleryCardSkeleton";

interface GalleryGridSkeletonProps {
  /** Number of skeleton cards to display */
  count?: number;
  className?: string;
}

export function GalleryGridSkeleton({
  count = 9,
  className,
}: GalleryGridSkeletonProps) {
  return (
    <div
      className={cn(
        "grid gap-4 md:gap-6",
        "grid-cols-2 md:grid-cols-3",
        className
      )}
      role="status"
      aria-label="Loading gallery"
    >
      {Array.from({ length: count }).map((_, index) => (
        <GalleryCardSkeleton
          key={index}
          // First item is featured (larger)
          featured={index === 0}
        />
      ))}
      <span className="sr-only">Loading gallery items...</span>
    </div>
  );
}

