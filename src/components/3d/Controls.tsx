/**
 * Controls Component
 *
 * OrbitControls wrapper for 3D cube interaction.
 * Handles rotation, zoom, auto-rotate, and reset functionality.
 *
 * @see Story 3.4: 3D Interaction Controls (Tasks 1-4, AC1-AC7, AC9)
 */

"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { OrbitControls as DreiOrbitControls } from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";

// ============================================================================
// TYPES
// ============================================================================

interface ControlsProps {
  /** Cube width in cm */
  width: number;
  /** Cube height in cm */
  height: number;
  /** Cube depth in cm */
  depth: number;
  /** Callback when user starts interacting */
  onInteractionStart?: () => void;
  /** Callback when user stops interacting */
  onInteractionEnd?: () => void;
}

// ============================================================================
// CONSTANTS
// ============================================================================

/** Scale factor matching CubeViewer (1cm = 0.02 scene units) */
const SCALE_FACTOR = 0.02;

/** Vertical angle limits (radians) - ~15° to ~85° from vertical axis */
const MIN_POLAR_ANGLE = Math.PI / 12; // ~15°
const MAX_POLAR_ANGLE = Math.PI / 2 - 0.1; // ~85°

/** Auto-rotate speed (subtle, elegant) */
const AUTO_ROTATE_SPEED = 0.5;

/** Idle timeout before auto-rotate resumes (ms) */
const IDLE_TIMEOUT_MS = 3000;

/** Camera reset animation duration (ms) */
const RESET_DURATION_MS = 800;

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * Controls - OrbitControls wrapper with auto-rotate and reset
 *
 * Features:
 * - Horizontal rotation: 360° (no limits) (AC1)
 * - Vertical rotation: limited arc ~15°-85° (AC2)
 * - Zoom: dynamic limits based on cube size (AC3)
 * - Reset: double-click animates to default position (AC4)
 * - Auto-rotate: pauses on interaction, resumes after 3s (AC5)
 * - Touch: handled automatically by OrbitControls (AC6)
 * - Panning: disabled (AC7)
 * - Performance: works with frameloop="demand" (AC9)
 */
export function Controls({
  width,
  height,
  depth,
  onInteractionStart,
  onInteractionEnd,
}: ControlsProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera, invalidate, gl } = useThree();

  // Store initial camera position/target for reset
  const initialCameraPosition = useRef<THREE.Vector3>(new THREE.Vector3());
  const initialTarget = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const isInitialized = useRef(false);

  // Auto-rotate state
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Reset animation state
  const [isResetting, setIsResetting] = useState(false);
  const resetStartTime = useRef<number>(0);
  const resetStartPosition = useRef<THREE.Vector3>(new THREE.Vector3());
  const resetStartTarget = useRef<THREE.Vector3>(new THREE.Vector3());

  // ========================================
  // ZOOM LIMITS (AC3)
  // ========================================

  // Calculate dynamic zoom limits based on cube dimensions
  const maxDimension = Math.max(width, height, depth);
  const scaledMax = maxDimension * SCALE_FACTOR;

  // Min distance: close but not clipping (1.5x max dimension)
  const minDistance = Math.max(0.5, scaledMax * 1.5);

  // Max distance: far enough to see full cube with context (5x max dimension)
  const maxDistance = Math.max(3, scaledMax * 5);

  // ========================================
  // INITIAL POSITION CAPTURE
  // ========================================

  useEffect(() => {
    if (!isInitialized.current) {
      initialCameraPosition.current.copy(camera.position);
      if (controlsRef.current) {
        initialTarget.current.copy(controlsRef.current.target);
      }
      isInitialized.current = true;
    }
  }, [camera]);

  // ========================================
  // INTERACTION HANDLERS (AC5)
  // ========================================

  const handleInteractionStart = useCallback(() => {
    // Pause auto-rotate immediately
    setIsAutoRotating(false);

    // Clear any pending idle timer
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }

    onInteractionStart?.();
  }, [onInteractionStart]);

  const handleInteractionEnd = useCallback(() => {
    // Set timer to resume auto-rotate after idle timeout
    idleTimerRef.current = setTimeout(() => {
      setIsAutoRotating(true);
    }, IDLE_TIMEOUT_MS);

    onInteractionEnd?.();
  }, [onInteractionEnd]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
    };
  }, []);

  // ========================================
  // DOUBLE-CLICK RESET (AC4)
  // ========================================

  const handleDoubleClick = useCallback(() => {
    if (!controlsRef.current) return;

    // Store starting position for animation
    resetStartPosition.current.copy(camera.position);
    resetStartTarget.current.copy(controlsRef.current.target);
    resetStartTime.current = performance.now();

    // Start reset animation
    setIsResetting(true);
    setIsAutoRotating(false);

    // Clear idle timer during reset
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
  }, [camera]);

  // Attach double-click listener to canvas
  useEffect(() => {
    const canvas = gl.domElement;
    canvas.addEventListener("dblclick", handleDoubleClick);
    return () => {
      canvas.removeEventListener("dblclick", handleDoubleClick);
    };
  }, [gl.domElement, handleDoubleClick]);

  // ========================================
  // RESET ANIMATION FRAME (AC4)
  // ========================================

  useFrame(() => {
    if (!isResetting || !controlsRef.current) return;

    const elapsed = performance.now() - resetStartTime.current;
    const progress = Math.min(elapsed / RESET_DURATION_MS, 1);

    // Ease-out cubic for smooth deceleration
    const eased = 1 - Math.pow(1 - progress, 3);

    // Lerp camera position
    camera.position.lerpVectors(
      resetStartPosition.current,
      initialCameraPosition.current,
      eased
    );

    // Lerp target
    controlsRef.current.target.lerpVectors(
      resetStartTarget.current,
      initialTarget.current,
      eased
    );

    // Update controls
    controlsRef.current.update();
    invalidate();

    // End animation
    if (progress >= 1) {
      setIsResetting(false);
      // Resume auto-rotate after reset
      setIsAutoRotating(true);
    }
  });

  // ========================================
  // RENDER
  // ========================================

  return (
    <DreiOrbitControls
      ref={controlsRef}
      // Rotation settings (AC1, AC2)
      enableRotate={true}
      minPolarAngle={MIN_POLAR_ANGLE} // ~15° from top
      maxPolarAngle={MAX_POLAR_ANGLE} // ~85° from top
      // Zoom settings (AC3)
      enableZoom={true}
      minDistance={minDistance}
      maxDistance={maxDistance}
      // Pan settings (AC7)
      enablePan={false}
      // Auto-rotate (AC5)
      autoRotate={isAutoRotating && !isResetting}
      autoRotateSpeed={AUTO_ROTATE_SPEED}
      // Event handlers (AC5)
      onStart={handleInteractionStart}
      onEnd={handleInteractionEnd}
      // R3F integration
      makeDefault
    />
  );
}

export default Controls;

