/**
 * Texture Utility Functions
 *
 * Provides type-safe access to marble texture paths with fallback handling.
 *
 * @see Story 2.2: Marble Texture Assets (AC6)
 */

/**
 * Available texture types for each marble
 */
export const TEXTURE_TYPES = [
  "diffuse",
  "normal",
  "roughness",
  "preview",
  "hero",
] as const;

/**
 * Type for texture types
 */
export type TextureType = (typeof TEXTURE_TYPES)[number];

/**
 * All valid marble slugs matching the seed data
 */
export const MARBLE_SLUGS = [
  "carrara-white",
  "nero-marquina",
  "calacatta-gold",
  "emperador-dark",
  "statuario",
  "verde-guatemala",
  "rosa-portogallo",
  "sahara-noir",
  "bianco-sivec",
  "travertino-romano",
] as const;

/**
 * Type for marble slug values
 */
export type MarbleSlug = (typeof MARBLE_SLUGS)[number];

/**
 * Texture file specifications
 * Note: preview/hero are JPEG for smaller file size, 3D textures are PNG
 */
export const TEXTURE_SPECS = {
  diffuse: { width: 2048, height: 2048, format: "png" as const },
  normal: { width: 1024, height: 1024, format: "png" as const },
  roughness: { width: 1024, height: 1024, format: "png" as const },
  preview: { width: 400, height: 400, format: "jpg" as const },
  hero: { width: 1200, height: 800, format: "jpg" as const },
} as const;

/**
 * Fallback placeholder image path
 */
export const FALLBACK_TEXTURE = "/images/placeholder-marble.jpg";

/**
 * Get the URL for a specific marble texture
 *
 * @param slug - The marble slug (e.g., "carrara-white")
 * @param type - The texture type (diffuse, normal, roughness, preview, hero)
 * @returns The texture URL path
 *
 * @example
 * ```ts
 * const diffuseUrl = getTextureUrl("carrara-white", "diffuse");
 * // Returns: "/textures/carrara-white/diffuse.png"
 * const previewUrl = getTextureUrl("carrara-white", "preview");
 * // Returns: "/textures/carrara-white/preview.jpg"
 * ```
 */
export function getTextureUrl(slug: string, type: TextureType): string {
  const format = TEXTURE_SPECS[type].format;
  return `/textures/${slug}/${type}.${format}`;
}

/**
 * Get all texture URLs for a marble
 *
 * @param slug - The marble slug
 * @returns Object with all texture URLs
 *
 * @example
 * ```ts
 * const textures = getAllTextureUrls("nero-marquina");
 * // Returns: { diffuse: "/textures/nero-marquina/diffuse.jpg", ... }
 * ```
 */
export function getAllTextureUrls(slug: string): Record<TextureType, string> {
  return {
    diffuse: getTextureUrl(slug, "diffuse"),
    normal: getTextureUrl(slug, "normal"),
    roughness: getTextureUrl(slug, "roughness"),
    preview: getTextureUrl(slug, "preview"),
    hero: getTextureUrl(slug, "hero"),
  };
}

/**
 * Get 3D PBR texture URLs (for React Three Fiber useTexture)
 *
 * @param slug - The marble slug
 * @returns Array of [diffuse, normal, roughness] URLs for useTexture hook
 *
 * @example
 * ```ts
 * const [diffuse, normal, roughness] = useTexture(getPBRTextureUrls("statuario"));
 * ```
 */
export function getPBRTextureUrls(
  slug: string
): [diffuse: string, normal: string, roughness: string] {
  return [
    getTextureUrl(slug, "diffuse"),
    getTextureUrl(slug, "normal"),
    getTextureUrl(slug, "roughness"),
  ];
}

/**
 * Check if a slug is a valid marble slug
 *
 * @param slug - The slug to validate
 * @returns True if the slug is a valid marble slug
 */
export function isValidMarbleSlug(slug: string): slug is MarbleSlug {
  return MARBLE_SLUGS.includes(slug as MarbleSlug);
}

/**
 * Get texture URL with fallback handling
 *
 * @param slug - The marble slug
 * @param type - The texture type
 * @param fallback - Custom fallback URL (defaults to FALLBACK_TEXTURE)
 * @returns The texture URL or fallback if slug is invalid
 */
export function getTextureUrlSafe(
  slug: string,
  type: TextureType,
  fallback: string = FALLBACK_TEXTURE
): string {
  if (!isValidMarbleSlug(slug)) {
    return fallback;
  }
  return getTextureUrl(slug, type);
}

/**
 * Get texture specifications for a type
 *
 * @param type - The texture type
 * @returns Object with width, height, and format
 */
export function getTextureSpec(type: TextureType): (typeof TEXTURE_SPECS)[TextureType] {
  return TEXTURE_SPECS[type];
}

/**
 * Build texture path object for next/image props
 *
 * @param slug - The marble slug
 * @param type - The texture type
 * @returns Object with src, width, and height for next/image
 */
export function getImageProps(
  slug: string,
  type: TextureType
): { src: string; width: number; height: number } {
  const spec = getTextureSpec(type);
  return {
    src: getTextureUrl(slug, type),
    width: spec.width,
    height: spec.height,
  };
}

