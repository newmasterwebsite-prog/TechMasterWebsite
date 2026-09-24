import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface MetallicRingsProps {
  scrollProgress: number;
  mouse: React.MutableRefObject<{ x: number; y: number }>;
}

export const MetallicRings: React.FC<MetallicRingsProps> = ({ scrollProgress, mouse }) => {
  const groupRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);

  // Keep tracking refs for smooth lerping
  const currentScaleRef = useRef(1);
  const currentScrollProgressRef = useRef(0);

  // Memoize geometries to prevent recreation on re-render
  const geometries = useMemo(() => ({
    ring1: new THREE.TorusGeometry(1.7, 0.012, 16, 80),
    ring2: new THREE.TorusGeometry(1.25, 0.009, 16, 80),
    ring3: new THREE.TorusGeometry(0.8, 0.006, 16, 80),
  }), []);

  // Memoize materials to prevent recreation on re-render
  const materials = useMemo(() => ({
    ring1: new THREE.MeshStandardMaterial({
      metalness: 1.0,
      roughness: 0.4,
      color: new THREE.Color("#D4AF37"),
      envMapIntensity: 0.6,
      transparent: true,
      opacity: 0.45,
    }),
    ring2: new THREE.MeshStandardMaterial({
      metalness: 0.85,
      roughness: 0.45,
      color: new THREE.Color("#aa3bff"),
      envMapIntensity: 0.5,
      transparent: true,
      opacity: 0.4,
    }),
    ring3: new THREE.MeshStandardMaterial({
      metalness: 0.8,
      roughness: 0.5,
      color: new THREE.Color("#00E5FF"),
      envMapIntensity: 0.4,
      transparent: true,
      opacity: 0.35,
    }),
  }), []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Smoothly lerp scrollProgress to avoid jitter/lag when scrolling up or down
    currentScrollProgressRef.current = THREE.MathUtils.lerp(
      currentScrollProgressRef.current,
      scrollProgress,
      0.1
    );
    const smoothScroll = currentScrollProgressRef.current;

    if (groupRef.current) {
      // Gentle mouse sway
      const targetX = mouse.current.x * 0.4;
      const targetY = mouse.current.y * 0.4;
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.04);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.04);
      
      // Scroll-based rotation shift
      groupRef.current.rotation.y = smoothScroll * (Math.PI * 0.5);

      // Scroll-based responsive scaling
      const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
      const isTablet = typeof window !== "undefined" && window.innerWidth < 1024;
      const responsiveFactor = isMobile ? 0.45 : (isTablet ? 0.65 : 0.8);
      
      // Scale shrinks as user scrolls down, and fades to 0 as it nears the footer (smoothScroll > 0.65)
      let targetScale = (1 - Math.min(smoothScroll * 0.3, 0.4)) * responsiveFactor;
      if (smoothScroll > 0.65) {
        const fadeFactor = Math.max(0, 1 - (smoothScroll - 0.65) / 0.25); // fades to 0 between 0.65 and 0.90
        targetScale *= fadeFactor;
      }

      // Lerp scale for butter-smooth size transition
      currentScaleRef.current = THREE.MathUtils.lerp(currentScaleRef.current, targetScale, 0.1);
      groupRef.current.scale.setScalar(currentScaleRef.current);
    }

    // Calm, slow individual ring rotations (about 30% of original speed)
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = time * 0.06 + smoothScroll * 0.3;
      ring1Ref.current.rotation.y = time * 0.09;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = -time * 0.08 - smoothScroll * 0.5;
      ring2Ref.current.rotation.z = time * 0.03;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x = -time * 0.05 + smoothScroll * 0.7;
      ring3Ref.current.rotation.z = time * 0.12;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={ring1Ref} geometry={geometries.ring1} material={materials.ring1} />
      <mesh ref={ring2Ref} geometry={geometries.ring2} material={materials.ring2} />
      <mesh ref={ring3Ref} geometry={geometries.ring3} material={materials.ring3} />
    </group>
  );
};
