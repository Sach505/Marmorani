"use client";

/**
 * ImageLightbox Component
 *
 * Modal lightbox for displaying full-size images.
 * Implements UX spec 7.1 modal patterns with accessibility.
 *
 * @see Story 2.5: Marble Detail Page (Task 4)
 */

import { useCallback, useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface ImageLightboxProps {
  /** Whether the lightbox is open */
  isOpen: boolean;
  /** Callback when lightbox should close */
  onClose: () => void;
  /** Image source URL */
  src: string;
  /** Alt text for accessibility */
  alt: string;
  /** Optional title for the image */
  title?: string;
  /** Optional additional images for gallery mode */
  gallery?: { src: string; alt: string }[];
  /** Current image index in gallery mode */
  currentIndex?: number;
  /** Callback when gallery index changes */
  onIndexChange?: (index: number) => void;
}

/**
 * ImageLightbox - Full-screen image viewer modal
 *
 * Features:
 * - Close via X button, Escape key, or click outside
 * - Smooth fade-in/fade-out animations
 * - Prevents body scroll when open
 * - Accessible with proper ARIA attributes
 *
 * @example
 * ```tsx
 * <ImageLightbox
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   src="/textures/carrara-white/hero.jpg"
 *   alt="Carrara White Marble"
 * />
 * ```
 */
export function ImageLightbox({
  isOpen,
  onClose,
  src,
  alt,
  title,
}: ImageLightboxProps) {
  // Handle Escape key (Dialog handles this, but we can add extra handling if needed)
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className={cn(
          "max-w-[95vw] max-h-[95vh] w-auto h-auto p-0 border-0",
          "bg-transparent shadow-none",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
          "data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95"
        )}
        aria-describedby={undefined}
      >
        {/* Accessible title - visually hidden but available to screen readers */}
        <VisuallyHidden>
          <DialogTitle>{title || alt}</DialogTitle>
          <DialogDescription>
            Full-size view of {alt}. Press Escape or click outside to close.
          </DialogDescription>
        </VisuallyHidden>

        {/* Close button */}
        <button
          onClick={onClose}
          className={cn(
            "absolute right-4 top-4 z-50",
            "rounded-full bg-black/50 p-2 backdrop-blur-sm",
            "text-white transition-colors hover:bg-black/70",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          )}
          aria-label="Close lightbox"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Image container */}
        <div className="relative flex items-center justify-center">
          <Image
            src={src}
            alt={alt}
            width={1920}
            height={1080}
            className="max-h-[90vh] max-w-[90vw] object-contain"
            priority
          />
        </div>

        {/* Optional title overlay */}
        {title && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <p className="text-center font-display text-lg text-white">
              {title}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

