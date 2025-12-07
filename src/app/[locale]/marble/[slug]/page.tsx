/**
 * Marble Detail Page
 *
 * Server Component displaying detailed information about a specific marble type.
 * Uses static generation for SEO and performance.
 *
 * @see Story 2.5: Marble Detail Page
 */

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getMarbleBySlug, getAllMarbleSlugs } from "@/lib/queries/marbles";
import { MarbleHero, MarbleSpecs, MarbleCTA } from "@/components/marble";

// Supported locales for static generation
const LOCALES = ["en", "fr", "de", "es", "it"];

/**
 * Generate static params for all marble detail pages
 * Creates routes for all marble slugs × all locales
 * Falls back to empty array if DB is unavailable during build
 */
export async function generateStaticParams(): Promise<
  { locale: string; slug: string }[]
> {
  try {
    const slugs = await getAllMarbleSlugs();

    // Generate params for each locale × slug combination
    return LOCALES.flatMap((locale) =>
      slugs.map((slug) => ({
        locale,
        slug,
      }))
    );
  } catch (error) {
    // DB not available during build (e.g., Vercel build environment)
    // Pages will be generated on-demand instead
    console.warn("Could not fetch marble slugs for static generation:", error);
    return [];
  }
}

/**
 * Page props with route parameters
 */
interface MarblePageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

/**
 * Generate SEO metadata for the marble detail page
 */
export async function generateMetadata({
  params,
}: MarblePageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const marble = await getMarbleBySlug(slug, locale);
  const t = await getTranslations({ locale, namespace: "marble" });

  if (!marble) {
    return {
      title: "Marble Not Found",
    };
  }

  const heroImage = `/textures/${slug}/hero.jpg`;

  return {
    title: `${marble.name} | Marmorani`,
    description: marble.description || t("defaultDescription", { name: marble.name }),
    openGraph: {
      title: `${marble.name} | Marmorani`,
      description: marble.description,
      images: [
        {
          url: heroImage,
          width: 1200,
          height: 630,
          alt: marble.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: marble.name,
      description: marble.description,
      images: [heroImage],
    },
  };
}

/**
 * Marble Detail Page Component
 */
export default async function MarbleDetailPage({ params }: MarblePageProps) {
  const { locale, slug } = await params;
  const marble = await getMarbleBySlug(slug, locale);
  const t = await getTranslations({ locale, namespace: "marble" });

  // Return 404 for invalid slugs
  if (!marble) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Image Section */}
      <MarbleHero slug={marble.slug} alt={marble.name} />

      {/* Content Section */}
      <div className="container mx-auto px-4 py-8 md:px-6 md:py-16">
        {/* Back to Gallery Link */}
        <Link
          href={`/${locale}/gallery`}
          className="mb-6 inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="font-body text-sm">{t("backToGallery")}</span>
        </Link>

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-3 lg:gap-12">
          {/* Left Column: Name, Description, Specs */}
          <div className="lg:col-span-2">
            {/* Marble Name */}
            <h1 className="font-display text-4xl font-semibold tracking-wide text-foreground md:text-5xl lg:text-6xl">
              {marble.name}
            </h1>

            {/* Description */}
            {marble.description && (
              <div className="mt-6 md:mt-8">
                <p className="font-body text-lg leading-relaxed text-muted-foreground md:text-xl">
                  {marble.description}
                </p>
              </div>
            )}

            {/* Technical Specifications */}
            <div className="mt-8 md:mt-12">
              <MarbleSpecs
                origin={marble.origin}
                density={marble.density}
                finishes={marble.finishes}
                priceRange={marble.priceRange}
              />
            </div>
          </div>

          {/* Right Column: CTA */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <div className="rounded-lg border border-border bg-surface p-6 md:p-8">
                <h2 className="font-display text-xl font-semibold text-foreground">
                  {t("interestedTitle")}
                </h2>
                <p className="mt-2 font-body text-sm text-muted-foreground">
                  {t("interestedDescription")}
                </p>
                <div className="mt-6">
                  <MarbleCTA slug={marble.slug} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 p-4 backdrop-blur-sm md:hidden">
        <MarbleCTA slug={marble.slug} />
      </div>

      {/* Spacer for mobile sticky CTA */}
      <div className="h-20 md:hidden" aria-hidden="true" />
    </div>
  );
}

