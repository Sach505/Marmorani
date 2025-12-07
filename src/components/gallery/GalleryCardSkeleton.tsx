/**
 * GalleryCardSkeleton Component
 *
 * Skeleton loading state for gallery cards with shimmer animation.
 * No spinners per UX spec 7.1.
 *
 * @see Story 2.3: Inspiration Gallery Page (Task 5.1, 5.2)
 */

import { cn } from "@/lib/utils";

interface GalleryCardSkeletonProps {
  /** Apply featured styling (larger) */
  featured?: boolean;
  className?: string;
}

export function GalleryCardSkeleton({
  featured = false,
  className,
}: GalleryCardSkeletonProps) {
  return (
    <div
      className={cn(
        "aspect-[4/3] overflow-hidden rounded-lg bg-muted",
        featured && "md:col-span-2 md:row-span-2",
        className
      )}
      role="status"
      aria-label="Loading gallery item"
    >
      {/* Shimmer animation */}
      <div className="relative h-full w-full overflow-hidden">
        <div
          className={cn(
            "absolute inset-0",
            "bg-gradient-to-r from-transparent via-white/20 to-transparent",
            "animate-shimmer"
          )}
          style={{
            backgroundSize: "200% 100%",
          }}
        />

        {/* Content skeleton */}
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-4">
          {/* Title skeleton */}
          <div className="h-5 w-3/4 rounded bg-white/10" />
          {/* Price skeleton */}
          <div className="h-4 w-1/3 rounded bg-white/10" />
        </div>
      </div>
    </div>
  );
}

