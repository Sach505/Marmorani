/**
 * Configurator Page (Server Component)
 *
 * Entry point for the cube configurator with dynamic metadata.
 * Parses URL parameters and validates marble selection.
 *
 * @see Story 2.6: Gallery to Configurator Navigation
 * @see Story 3.1: Configurator Page Shell & Theme (Task 1, AC5)
 */

import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ConfiguratorClient } from "@/components/configurator/ConfiguratorClient";
import { validateMarbleSlug } from "@/lib/queries/configurator";
import { getMarbleBySlug } from "@/lib/queries/marbles";

/**
 * Configurator page props
 */
interface ConfiguratorPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ marble?: string }>;
}

/**
 * Generate dynamic metadata for SEO (AC5)
 *
 * Features:
 * - Title reflects current marble selection (AC5)
 * - Meta description updated for SEO (AC5)
 * - Browser tab shows current configuration state (AC5)
 */
export async function generateMetadata({
  params,
  searchParams,
}: ConfiguratorPageProps): Promise<Metadata> {
  const { locale } = await params;
  const { marble: marbleSlug } = await searchParams;
  const t = await getTranslations({ locale, namespace: "configurator" });

  // Get marble name for dynamic title (AC5)
  let marbleName: string | undefined;
  if (marbleSlug) {
    const marble = await getMarbleBySlug(marbleSlug, locale);
    marbleName = marble?.name;
  }

  // Dynamic title: "Configure - Carrara White" or just "Configurator" (AC5)
  const title = marbleName
    ? t("pageTitleWithMarble", { marbleName })
    : t("pageTitle");

  // Dynamic description (AC5)
  const description = marbleName
    ? t("pageDescriptionWithMarble", { marbleName })
    : t("pageDescription");

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

/**
 * Configurator Page
 *
 * Server Component that:
 * - Parses marble URL query parameter
 * - Validates marble slug against database
 * - Falls back to first available marble if invalid
 * - Passes validated marble to client component
 *
 * Navigation target: /[locale]/configurator?marble={slug}
 */
export default async function ConfiguratorPage({
  params,
  searchParams,
}: ConfiguratorPageProps) {
  const { locale } = await params;
  const { marble: marbleSlug } = await searchParams;

  // Validate marble slug - handles invalid/missing → fallback
  const validatedSlug = await validateMarbleSlug(marbleSlug, locale);

  return (
    <ConfiguratorClient
      initialMarble={validatedSlug}
    />
  );
}
