/**
 * Inspiration Gallery Page
 *
 * Server Component displaying a responsive grid of marble gallery items.
 * Uses Suspense for streaming loading states.
 * Supports filtering by marble type, finish, and use case via URL params.
 *
 * @see Story 2.3: Inspiration Gallery Page
 * @see Story 2.4: Gallery Filtering
 */

import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import { getGalleryItems, getGalleryFilterOptions } from "@/lib/queries/gallery";
import type { GalleryFilters } from "@/types/gallery";
import type { FinishType } from "@/generated/prisma/enums";
import {
  MarbleGrid,
  GalleryGridSkeleton,
  GalleryEmptyWithFilters,
  GalleryFilters as GalleryFiltersComponent,
} from "@/components/gallery";

/** Valid finish types for URL validation */
const VALID_FINISHES: FinishType[] = ["POLISHED", "HONED", "RAW", "BRUSHED"];

/**
 * Page props with searchParams for filtering
 */
interface GalleryPageProps {
  searchParams: Promise<{
    marble?: string;
    finish?: string;
    useCase?: string;
  }>;
}

/**
 * Parse and validate finish type from URL param
 */
function parseFinishParam(value: string | undefined): FinishType | undefined {
  if (!value) return undefined;
  const upperValue = value.toUpperCase() as FinishType;
  return VALID_FINISHES.includes(upperValue) ? upperValue : undefined;
}

/**
 * Generate metadata for the gallery page
 */
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("gallery");

  return {
    title: t("pageTitle"),
    description: t("pageDescription"),
    openGraph: {
      title: t("pageTitle"),
      description: t("pageDescription"),
    },
  };
}

/**
 * Gallery content component for Suspense boundary
 */
async function GalleryContent({ filters }: { filters: GalleryFilters }) {
  const locale = await getLocale();
  const items = await getGalleryItems(locale, filters);

  if (items.length === 0) {
    return <GalleryEmptyWithFilters />;
  }

  return <MarbleGrid items={items} />;
}

/**
 * Gallery Page
 */
export default async function GalleryPage({ searchParams }: GalleryPageProps) {
  const t = await getTranslations("gallery");
  const locale = await getLocale();

  // Await searchParams (Next.js 15+ async params)
  const params = await searchParams;

  // Parse filters from URL params
  const filters: GalleryFilters = {
    marbleType: params.marble || undefined,
    finish: parseFinishParam(params.finish),
    useCase: params.useCase || undefined,
  };

  // Fetch filter options for dropdowns
  const filterOptions = await getGalleryFilterOptions(locale);

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
      {/* Page Header */}
      <header className="mb-8 md:mb-12">
        <h1 className="font-display text-3xl font-semibold tracking-wide text-foreground md:text-4xl lg:text-5xl">
          {t("title")}
        </h1>
        <p className="mt-3 max-w-2xl font-body text-base text-muted-foreground md:text-lg">
          {t("subtitle")}
        </p>
      </header>

      {/* Filter Controls */}
      <GalleryFiltersComponent options={filterOptions} className="mb-8" />

      {/* Gallery Grid with Suspense */}
      <Suspense
        key={JSON.stringify(filters)}
        fallback={<GalleryGridSkeleton />}
      >
        <GalleryContent filters={filters} />
      </Suspense>
    </div>
  );
}
