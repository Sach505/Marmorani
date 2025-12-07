/**
 * MarbleGrid Component
 *
 * Responsive grid layout for gallery cards.
 * Desktop: 3 columns, Mobile: 2 columns
 *
 * @see Story 2.3: Inspiration Gallery Page (Task 4)
 */

import { cn } from "@/lib/utils";
import { MarbleCard } from "./MarbleCard";
import type { MarbleGridProps } from "@/types/gallery";

/**
 * Number of above-fold items to prioritize for LCP
 */
const DEFAULT_PRIORITY_COUNT = 6;

export function MarbleGrid({
  items,
  priorityCount = DEFAULT_PRIORITY_COUNT,
}: MarbleGridProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section
      aria-label="Marble gallery"
      className={cn(
        "grid gap-4 md:gap-6",
        // Responsive grid: 2 columns mobile, 3 columns desktop
        "grid-cols-2 md:grid-cols-3"
      )}
    >
      {items.map((item, index) => (
        <MarbleCard
          key={item.id}
          item={item}
          priority={index < priorityCount}
          // Featured items get larger display on desktop
          className={cn(
            item.featured && index === 0 && "md:col-span-2 md:row-span-2"
          )}
        />
      ))}
    </section>
  );
}

