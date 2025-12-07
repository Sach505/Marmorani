/**
 * Gallery Type Definitions
 *
 * TypeScript interfaces for gallery data structures.
 *
 * @see Story 2.3: Inspiration Gallery Page (Task 2.5)
 */

import type { FinishType } from "@/generated/prisma/enums";

/**
 * Gallery item with resolved locale data (for display)
 */
export interface GalleryItemLocalized {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  useCase: string | null;
  featured: boolean;
  marbleSlug: string | null;
  marbleName: string | null;
  /** Starting price in cents (10×10×10 cube × cheapest finish) */
  startingPrice: number | null;
}

/**
 * Gallery filters for server-side filtering
 */
export interface GalleryFilters {
  marbleType?: string;
  finish?: FinishType;
  useCase?: string;
}

/**
 * Props for MarbleCard component
 */
export interface MarbleCardProps {
  item: GalleryItemLocalized;
  /** Enable priority loading for above-fold images */
  priority?: boolean;
  className?: string;
}

/**
 * Props for MarbleGrid component
 */
export interface MarbleGridProps {
  items: GalleryItemLocalized[];
  /** Number of above-fold items to prioritize */
  priorityCount?: number;
}

