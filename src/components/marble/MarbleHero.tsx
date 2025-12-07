"use client";

/**
 * MarbleHero Component
 *
 * Hero section displaying high-quality marble texture image.
 * Implements click-to-zoom functionality via lightbox.
 *
 * @see Story 2.5: Marble Detail Page (Task 3)
 */

import { useState, useCallback } from "react";
import Image from "next/image";
import { ZoomIn } from "lucide-react";
import { ImageLightbox } from "@/components/ui/ImageLightbox";
import { cn } from "@/lib/utils";

interface MarbleHeroProps {
  /** Marble slug for texture folder path */
  slug: string;
  /** Alt text for accessibility */
  alt: string;
  /** Optional class name for custom styling */
  className?: string;
}

/**
 * MarbleHero - Full-width hero image with lightbox
 *
 * Features:
 * - Uses hero.jpg from texture folder, falls back to preview.jpg
 * - Click to open full-size lightbox
 * - Responsive sizing via next/image
 * - Subtle hover effect indicating clickability
 *
 * @example
 * ```tsx
 * <MarbleHero slug="carrara-white" alt="Carrara White Marble" />
 * ```
 */
export function MarbleHero({ slug, alt, className }: MarbleHeroProps) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Primary image path (hero.jpg) or fallback (preview.jpg)
  const imagePath = imageError
    ? `/textures/${slug}/preview.jpg`
    : `/textures/${slug}/hero.jpg`;

  const handleImageClick = useCallback(() => {
    setIsLightboxOpen(true);
  }, []);

  const handleImageError = useCallback(() => {
    if (!imageError) {
      setImageError(true);
    }
  }, [imageError]);

  return (
    <>
      {/* Hero Image Container */}
      <div
        className={cn(
          "group relative w-full overflow-hidden",
          "aspect-[21/9] md:aspect-[3/1] lg:aspect-[4/1]",
          "cursor-zoom-in",
          className
        )}
        onClick={handleImageClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleImageClick();
          }
        }}
        aria-label={`View ${alt} in full size`}
      >
        <Image
          src={imagePath}
          alt={alt}
          fill
          sizes="100vw"
          priority
          className={cn(
            "object-cover transition-transform duration-500",
            "group-hover:scale-[1.02]"
          )}
          onError={handleImageError}
        />

        {/* Zoom hint overlay */}
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center",
            "bg-black/0 transition-colors duration-300",
            "group-hover:bg-black/20"
          )}
        >
          <div
            className={cn(
              "rounded-full bg-white/80 p-3 backdrop-blur-sm",
              "opacity-0 transition-all duration-300",
              "group-hover:opacity-100 group-hover:scale-100",
              "scale-90"
            )}
          >
            <ZoomIn className="h-6 w-6 text-foreground" />
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      <ImageLightbox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        src={imagePath}
        alt={alt}
        title={alt}
      />
    </>
  );
}

