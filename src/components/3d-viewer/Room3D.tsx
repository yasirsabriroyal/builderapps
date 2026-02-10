// @ts-nocheck - React Three Fiber JSX elements are registered dynamically at runtime
import React from 'react';
import type { Mesh } from 'three';
import { useFrame } from '@react-three/fiber';
import { extend } from '@react-three/fiber';
import * as THREE from 'three';

extend(THREE);

interface Room3DProps {
  width?: number;
  height?: number;
  depth?: number;
  wireframe?: boolean;
  materialTexture?: string;
}

export const Room3D: React.FC<Room3DProps> = ({
  width = 10,
  height = 3,
  depth = 10,
  wireframe = false,
  materialTexture,
}) => {
  const floorRef = React.useRef<Mesh>(null);

  useFrame(() => {
    if (floorRef.current && materialTexture) {
      // Animation could be added here
    }
  });

  return (
    // @ts-expect-error - React Three Fiber elements are registered at runtime
    <group>
      {/* Floor */}
      {/* @ts-expect-error - React Three Fiber elements */}
      <mesh ref={floorRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial 
          color={materialTexture ? '#ffffff' : '#e0e0e0'} 
          wireframe={wireframe}
        />
      </mesh>

      {/* Back Wall */}
      {/* @ts-expect-error - React Three Fiber elements */}
      <mesh position={[0, height / 2, -depth / 2]} receiveShadow>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color="#f5f5f5" wireframe={wireframe} />
      </mesh>

      {/* Left Wall */}
      {/* @ts-expect-error - React Three Fiber elements */}
      <mesh 
        position={[-width / 2, height / 2, 0]} 
        rotation={[0, Math.PI / 2, 0]} 
        receiveShadow
      >
        <planeGeometry args={[depth, height]} />
        <meshStandardMaterial color="#fafafa" wireframe={wireframe} />
      </mesh>

      {/* Right Wall */}
      {/* @ts-expect-error - React Three Fiber elements */}
      <mesh 
        position={[width / 2, height / 2, 0]} 
        rotation={[0, -Math.PI / 2, 0]} 
        receiveShadow
      >
        <planeGeometry args={[depth, height]} />
        <meshStandardMaterial color="#fafafa" wireframe={wireframe} />
      </mesh>

      {/* Ceiling */}
      {/* @ts-expect-error - React Three Fiber elements */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, height, 0]} receiveShadow>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color="#ffffff" wireframe={wireframe} />
      </mesh>

      {/* Sample Furniture - Box */}
      {/* @ts-expect-error - React Three Fiber elements */}
      <mesh position={[2, 0.5, 2]} castShadow>
        <boxGeometry args={[2, 1, 1]} />
        <meshStandardMaterial color="#8b4513" wireframe={wireframe} />
      </mesh>

      {/* Sample Furniture - Sphere */}
      {/* @ts-expect-error - React Three Fiber elements */}
      <mesh position={[-2, 0.5, -2]} castShadow>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#4a90e2" wireframe={wireframe} />
      </mesh>
    </group>
  );
};
