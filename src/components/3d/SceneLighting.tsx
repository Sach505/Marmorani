/**
 * SceneLighting Component
 *
 * Studio-style lighting setup for the 3D cube viewer.
 * Creates a "private atelier" aesthetic with realistic reflections.
 *
 * @see Story 3.3: 3D Cube Viewer Component (Task 4, AC4)
 */

import { Environment } from "@react-three/drei";

/**
 * SceneLighting - Lighting configuration for marble visualization
 *
 * Features:
 * - HDRI environment map for realistic reflections (AC4)
 * - Ambient light for base illumination
 * - Directional key light for shadows
 * - "Private atelier" aesthetic
 */
export function SceneLighting() {
  return (
    <>
      {/* HDRI Environment for realistic reflections (AC4) */}
      <Environment
        preset="studio"
        background={false}
        environmentIntensity={0.6}
      />

      {/* Ambient light for base fill (low intensity) */}
      <ambientLight intensity={0.3} color="#ffffff" />

      {/* Key light - primary shadows and highlights */}
      <directionalLight
        position={[5, 8, 5]}
        intensity={0.8}
        color="#ffffff"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={1}
        shadow-camera-far={20}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
        shadow-bias={-0.0001}
      />

      {/* Fill light - soften shadows */}
      <directionalLight
        position={[-3, 4, -2]}
        intensity={0.3}
        color="#e8e0d8"
      />

      {/* Rim light - enhance edges for "atelier" aesthetic */}
      <directionalLight
        position={[0, 2, -5]}
        intensity={0.2}
        color="#f5f0e8"
      />
    </>
  );
}

