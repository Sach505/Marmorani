/**
 * MarbleMaterial Component
 *
 * PBR (Physically Based Rendering) material for marble visualization.
 * Loads diffuse, normal, and roughness textures dynamically.
 *
 * @see Story 3.3: 3D Cube Viewer Component (Task 2, Task 3, AC2, AC3)
 */

"use client";

import { useMemo, useRef, useEffect } from "react";
import { useTexture } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { ClampToEdgeWrapping, type Texture, SRGBColorSpace, type MeshStandardMaterial } from "three";
import { FinishType } from "@/generated/prisma/enums";

// ============================================================================
// TYPES
// ============================================================================

interface MarbleMaterialProps {
  /** Marble slug for texture path (e.g., "carrara-white") */
  marbleSlug: string;
  /** Finish type affects roughness and metalness */
  finish: FinishType;
}

// ============================================================================
// FINISH MATERIAL PROPERTIES (AC3)
// ============================================================================

/**
 * Material roughness per finish type
 * POLISHED: Mirror-like reflections
 * HONED: Matte, soft appearance
 * RAW: Natural stone texture
 * BRUSHED: Anisotropic feel
 */
const FINISH_ROUGHNESS: Record<FinishType, number> = {
  [FinishType.POLISHED]: 0.1,
  [FinishType.HONED]: 0.5,
  [FinishType.RAW]: 0.9,
  [FinishType.BRUSHED]: 0.7,
};

/**
 * Material metalness per finish type
 * Polished marble has slight metallic sheen
 */
const FINISH_METALNESS: Record<FinishType, number> = {
  [FinishType.POLISHED]: 0.05,
  [FinishType.HONED]: 0.0,
  [FinishType.RAW]: 0.0,
  [FinishType.BRUSHED]: 0.02,
};

/**
 * Environment map intensity per finish
 * Higher for polished (more reflective)
 */
const FINISH_ENV_INTENSITY: Record<FinishType, number> = {
  [FinishType.POLISHED]: 1.2,
  [FinishType.HONED]: 0.5,
  [FinishType.RAW]: 0.3,
  [FinishType.BRUSHED]: 0.6,
};

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * MarbleMaterial - PBR material with dynamic textures
 *
 * Features:
 * - Loads diffuse, normal, roughness maps (AC2)
 * - Single texture per face (no tiling)
 * - Finish-based roughness/metalness (AC3)
 * - Suspense-compatible (useTexture)
 */
export function MarbleMaterial({
  marbleSlug,
  finish,
}: MarbleMaterialProps) {
  const { invalidate } = useThree();
  const materialRef = useRef<MeshStandardMaterial>(null);

  // Texture paths (AC2.1-2.3)
  const texturePaths = useMemo(
    () => ({
      diffuse: `/textures/${marbleSlug}/diffuse.png`,
      normal: `/textures/${marbleSlug}/normal.png`,
      roughness: `/textures/${marbleSlug}/roughness.png`,
    }),
    [marbleSlug]
  );

  // Load textures with Drei useTexture (Suspense-compatible)
  const textures = useTexture(texturePaths);

  // Configure textures for single image per face (no tiling)
  // Each face displays one complete marble texture
  useEffect(() => {
    const allTextures = [textures.diffuse, textures.normal, textures.roughness];
    
    allTextures.forEach((texture: Texture) => {
      // ClampToEdge prevents texture repetition - single image per face
      texture.wrapS = ClampToEdgeWrapping;
      texture.wrapT = ClampToEdgeWrapping;
      // Fixed repeat of 1 = one complete texture per face
      texture.repeat.set(1, 1);
      texture.needsUpdate = true;
    });

    // Ensure diffuse is in correct color space
    textures.diffuse.colorSpace = SRGBColorSpace;

    // Force re-render for frameloop="demand"
    invalidate();
  }, [textures, invalidate]);

  // Get finish-based material properties (AC3)
  const roughness = FINISH_ROUGHNESS[finish];
  const metalness = FINISH_METALNESS[finish];
  const envMapIntensity = FINISH_ENV_INTENSITY[finish];

  // Invalidate on finish change for immediate update
  useEffect(() => {
    invalidate();
  }, [finish, invalidate]);

  return (
    <meshStandardMaterial
      ref={materialRef}
      map={textures.diffuse}
      normalMap={textures.normal}
      roughnessMap={textures.roughness}
      roughness={roughness}
      metalness={metalness}
      envMapIntensity={envMapIntensity}
      normalScale={[1, 1]}
    />
  );
}

// ============================================================================
// FALLBACK MATERIAL
// ============================================================================

/**
 * Fallback material when textures fail to load
 */
export function FallbackMaterial({ finish }: { finish: FinishType }) {
  const roughness = FINISH_ROUGHNESS[finish];
  const metalness = FINISH_METALNESS[finish];

  return (
    <meshStandardMaterial
      color="#9c9c9c"
      roughness={roughness}
      metalness={metalness}
    />
  );
}

