/**
 * CubeViewer Component
 *
 * Main 3D scene component using React Three Fiber.
 * Renders a photo-realistic marble cube with studio lighting.
 *
 * @see Story 3.3: 3D Cube Viewer Component (All Tasks, AC1-AC8)
 */

"use client";

import { Suspense, useMemo, useRef, useEffect } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import type { Mesh } from "three";

import { FinishType } from "@/generated/prisma/enums";
import { SceneLighting } from "./SceneLighting";
import { MarbleMaterial, FallbackMaterial } from "./MarbleMaterial";
import { Controls } from "./Controls";

// ============================================================================
// TYPES
// ============================================================================

interface CubeViewerProps {
  /** Selected marble slug */
  marbleSlug: string;
  /** Cube width in cm */
  width: number;
  /** Cube height in cm */
  height: number;
  /** Cube depth in cm */
  depth: number;
  /** Selected finish type */
  finish: FinishType;
}

interface MarbleCubeProps {
  marbleSlug: string;
  width: number;
  height: number;
  depth: number;
  finish: FinishType;
}

// ============================================================================
// INVALIDATE CONTROLLER
// ============================================================================

/**
 * Handles frameloop invalidation for on-demand rendering
 */
function InvalidateController() {
  const { invalidate } = useThree();
  
  // Invalidate on mount to ensure initial render
  useEffect(() => {
    invalidate();
  }, [invalidate]);

  return null;
}

// ============================================================================
// MARBLE CUBE COMPONENT
// ============================================================================

/**
 * MarbleCube - The actual 3D cube mesh with marble material
 *
 * Features:
 * - BoxGeometry with store dimensions (AC1)
 * - Dimensions in real-world scale: 1 unit = 1 cm (AC1)
 * - Centered in viewport regardless of dimensions (AC1)
 */
function MarbleCube({
  marbleSlug,
  width,
  height,
  depth,
  finish,
}: MarbleCubeProps) {
  const meshRef = useRef<Mesh>(null);
  const { invalidate } = useThree();

  // Convert cm to scene units and scale down for viewport
  // Using 0.02 scale: 20cm cube = 0.4 scene units
  const scale = 0.02;
  const scaledWidth = width * scale;
  const scaledHeight = height * scale;
  const scaledDepth = depth * scale;

  // Position cube so bottom sits on ground plane
  const yPosition = scaledHeight / 2;

  // Invalidate when dimensions change (AC1.4 - within 500ms)
  useEffect(() => {
    invalidate();
  }, [width, height, depth, marbleSlug, finish, invalidate]);

  // Use useFrame with invalidate for smooth updates
  useFrame(() => {
    // Nothing to animate, but keeps frame loop responsive
  });

  return (
    <mesh
      ref={meshRef}
      position={[0, yPosition, 0]}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[scaledWidth, scaledHeight, scaledDepth]} />
      <Suspense fallback={<FallbackMaterial finish={finish} />}>
        <MarbleMaterial
          marbleSlug={marbleSlug}
          finish={finish}
        />
      </Suspense>
    </mesh>
  );
}

// ============================================================================
// CONTACT SHADOW
// ============================================================================

interface CubeShadowProps {
  width: number;
  depth: number;
}

/**
 * CubeShadow - Soft contact shadow beneath the cube
 *
 * Features:
 * - Scales with cube dimensions (AC5)
 * - Soft, realistic appearance (AC5)
 * - Matches Nero Marquina theme (AC5.4)
 */
function CubeShadow({ width, depth }: CubeShadowProps) {
  const scale = 0.02;
  const maxDim = Math.max(width, depth) * scale;
  
  // Shadow should extend beyond cube
  const shadowScale = maxDim * 4;

  return (
    <ContactShadows
      position={[0, 0, 0]}
      opacity={0.4}
      scale={shadowScale}
      blur={2.5}
      far={4}
      color="#000000"
    />
  );
}

// ============================================================================
// SCENE CONTENT
// ============================================================================

type SceneContentProps = CubeViewerProps;

/**
 * SceneContent - All 3D content inside the Canvas
 *
 * @see Story 3.4: Added Controls component (Task 1, AC1-AC7)
 */
function SceneContent({
  marbleSlug,
  width,
  height,
  depth,
  finish,
}: SceneContentProps) {
  return (
    <>
      <InvalidateController />
      <SceneLighting />
      <MarbleCube
        marbleSlug={marbleSlug}
        width={width}
        height={height}
        depth={depth}
        finish={finish}
      />
      <CubeShadow width={width} depth={depth} />
      {/* OrbitControls for rotation/zoom (Story 3.4: AC1-AC7, AC9) */}
      <Controls width={width} height={height} depth={depth} />
    </>
  );
}

// ============================================================================
// LOADING FALLBACK
// ============================================================================

/**
 * Loading fallback for Suspense boundary
 */
function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[0.4, 0.4, 0.4]} />
      <meshStandardMaterial color="#2D2D2D" wireframe />
    </mesh>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * CubeViewer - Main 3D cube visualization component
 *
 * Features:
 * - React Three Fiber Canvas (AC1, AC6)
 * - frameloop="demand" for performance (AC7)
 * - Nero Marquina background #0D0D0D (AC6)
 * - Suspense loading state (AC7)
 * - Photo-realistic PBR materials (AC2)
 * - Finish-based appearance (AC3)
 * - Studio lighting (AC4)
 * - Contact shadow (AC5)
 *
 * @example
 * ```tsx
 * <CubeViewer
 *   marbleSlug="carrara-white"
 *   width={20}
 *   height={20}
 *   depth={20}
 *   finish={FinishType.POLISHED}
 * />
 * ```
 */
export function CubeViewer({
  marbleSlug,
  width,
  height,
  depth,
  finish,
}: CubeViewerProps) {
  // Calculate camera distance based on cube size
  const cameraDistance = useMemo(() => {
    const scale = 0.02;
    const maxDim = Math.max(width, height, depth) * scale;
    return Math.max(2, maxDim * 3);
  }, [width, height, depth]);

  return (
    <Canvas
      frameloop="demand" // Only render on changes (AC7)
      dpr={[1, 2]} // Device pixel ratio bounds
      gl={{
        antialias: true,
        alpha: false, // No transparency needed (AC6)
        powerPreference: "high-performance",
      }}
      camera={{
        position: [cameraDistance * 0.8, cameraDistance * 0.6, cameraDistance],
        fov: 45,
        near: 0.1,
        far: 100,
      }}
      style={{ background: "#0D0D0D" }} // Nero Marquina (AC6)
    >
      {/* Scene background color (AC6) */}
      <color attach="background" args={["#0D0D0D"]} />

      {/* Main scene content with Suspense (AC7) */}
      <Suspense fallback={<LoadingFallback />}>
        <SceneContent
          marbleSlug={marbleSlug}
          width={width}
          height={height}
          depth={depth}
          finish={finish}
        />
      </Suspense>
    </Canvas>
  );
}

export default CubeViewer;

