"use client";

/**
 * Texture Validation Test Page
 *
 * Dev-only route to verify all marble textures load correctly.
 * Displays all textures in a grid with load status indicators.
 *
 * @see Story 2.2: Marble Texture Assets (AC4)
 */

import Image from "next/image";
import { useState, useCallback, useEffect } from "react";
import {
  MARBLE_SLUGS,
  TEXTURE_TYPES,
  getAllTextureUrls,
  getTextureSpec,
  type MarbleSlug,
  type TextureType,
} from "@/lib/textures";

type LoadStatus = "loading" | "success" | "error";

interface TextureStatus {
  slug: MarbleSlug;
  type: TextureType;
  status: LoadStatus;
  error?: string;
}

export default function TexturesDevPage() {
  const [statuses, setStatuses] = useState<Map<string, TextureStatus>>(
    new Map()
  );
  const [summary, setSummary] = useState({ total: 0, loaded: 0, errors: 0 });

  // Initialize all statuses as loading
  useEffect(() => {
    const initial = new Map<string, TextureStatus>();
    MARBLE_SLUGS.forEach((slug) => {
      TEXTURE_TYPES.forEach((type) => {
        const key = `${slug}-${type}`;
        initial.set(key, { slug, type, status: "loading" });
      });
    });
    setStatuses(initial);
    setSummary({ total: initial.size, loaded: 0, errors: 0 });
  }, []);

  const updateStatus = useCallback(
    (slug: MarbleSlug, type: TextureType, status: LoadStatus, error?: string) => {
      const key = `${slug}-${type}`;
      setStatuses((prev) => {
        const next = new Map(prev);
        next.set(key, { slug, type, status, error });
        return next;
      });

      setSummary((prev) => {
        if (status === "success") {
          return { ...prev, loaded: prev.loaded + 1 };
        }
        if (status === "error") {
          console.error(`[Texture Error] ${slug}/${type}.jpg: ${error}`);
          return { ...prev, errors: prev.errors + 1 };
        }
        return prev;
      });
    },
    []
  );

  const getStatusColor = (status: LoadStatus) => {
    switch (status) {
      case "loading":
        return "bg-yellow-500";
      case "success":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
    }
  };

  const getStatusEmoji = (status: LoadStatus) => {
    switch (status) {
      case "loading":
        return "⏳";
      case "success":
        return "✅";
      case "error":
        return "❌";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold mb-2">
          🧪 Texture Validation
        </h1>
        <p className="text-muted-foreground mb-4">
          Dev-only page to verify all marble textures load correctly via
          next/image.
        </p>

        {/* Summary Stats */}
        <div className="flex gap-4 rounded-lg bg-muted/50 p-4">
          <div className="text-center">
            <div className="font-mono text-2xl font-bold">{summary.total}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </div>
          <div className="text-center">
            <div className="font-mono text-2xl font-bold text-green-600">
              {summary.loaded}
            </div>
            <div className="text-sm text-muted-foreground">Loaded</div>
          </div>
          <div className="text-center">
            <div className="font-mono text-2xl font-bold text-red-600">
              {summary.errors}
            </div>
            <div className="text-sm text-muted-foreground">Errors</div>
          </div>
          <div className="text-center">
            <div className="font-mono text-2xl font-bold text-yellow-600">
              {summary.total - summary.loaded - summary.errors}
            </div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </div>
        </div>
      </div>

      {/* Marble Grid */}
      <div className="space-y-12">
        {MARBLE_SLUGS.map((slug) => {
          const textures = getAllTextureUrls(slug);

          return (
            <div key={slug} className="rounded-lg border p-6">
              <h2 className="font-display text-xl font-semibold mb-4 capitalize">
                {slug.replace(/-/g, " ")}
              </h2>
              <div className="font-mono text-sm text-muted-foreground mb-4">
                /public/textures/{slug}/
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {TEXTURE_TYPES.map((type) => {
                  const key = `${slug}-${type}`;
                  const status = statuses.get(key);
                  const spec = getTextureSpec(type);
                  const isPreview = type === "preview" || type === "hero";

                  return (
                    <div
                      key={type}
                      className="relative rounded-lg border bg-muted/30 p-2"
                    >
                      {/* Status Indicator */}
                      <div className="absolute top-1 right-1 z-10 flex items-center gap-1">
                        <span className="text-xs">
                          {status ? getStatusEmoji(status.status) : "⏳"}
                        </span>
                        <div
                          className={`h-2 w-2 rounded-full ${
                            status ? getStatusColor(status.status) : "bg-gray-400"
                          }`}
                        />
                      </div>

                      {/* Image Container */}
                      <div
                        className={`relative overflow-hidden rounded bg-black/5 ${
                          isPreview ? "aspect-square" : "aspect-square"
                        }`}
                        style={{
                          minHeight: type === "hero" ? "100px" : "80px",
                        }}
                      >
                        <Image
                          src={textures[type]}
                          alt={`${slug} ${type}`}
                          width={spec.width}
                          height={spec.height}
                          className="object-cover"
                          style={{ width: "100%", height: "100%" }}
                          onLoad={() => updateStatus(slug, type, "success")}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            updateStatus(
                              slug,
                              type,
                              "error",
                              `Failed to load: ${target.src}`
                            );
                          }}
                          unoptimized={false}
                        />
                      </div>

                      {/* Label */}
                      <div className="mt-2 text-center">
                        <div className="font-mono text-xs font-medium">
                          {type}.{spec.format}
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          {spec.width}×{spec.height}
                        </div>
                      </div>

                      {/* Error Message */}
                      {status?.status === "error" && (
                        <div className="mt-1 text-[10px] text-red-500 text-center truncate">
                          404
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Console Log Instructions */}
      <div className="mt-8 rounded-lg bg-muted/50 p-4">
        <h3 className="font-semibold mb-2">📋 Console Logs</h3>
        <p className="text-sm text-muted-foreground">
          Open browser DevTools (F12) to see detailed error logs for any missing
          textures. Each 404 error will be logged with the full path.
        </p>
      </div>
    </div>
  );
}

