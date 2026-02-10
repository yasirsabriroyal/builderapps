// @ts-nocheck - React Three Fiber JSX elements are registered dynamically at runtime
import React, { Suspense } from 'react';
import { Canvas, extend } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Grid } from '@react-three/drei';
import { Room3D } from './Room3D';
import { Box, CircularProgress } from '@mui/material';
import * as THREE from 'three';

extend(THREE);

interface Scene3DProps {
  wireframe?: boolean;
  showGrid?: boolean;
  lightingMode?: 'day' | 'night';
  materialTexture?: string;
  cameraView?: 'perspective' | 'top' | 'front' | 'side';
}

const CameraPositions = {
  perspective: [8, 6, 8],
  top: [0, 15, 0.1],
  front: [0, 3, 12],
  side: [12, 3, 0],
} as const;

export const Scene3D: React.FC<Scene3DProps> = ({
  wireframe = false,
  showGrid = true,
  lightingMode = 'day',
  materialTexture,
  cameraView = 'perspective',
}) => {
  const cameraPosition = CameraPositions[cameraView] as [number, number, number];

  return (
    <Box sx={{ width: '100%', height: '600px', position: 'relative', bgcolor: '#1a1a1a' }}>
      <Canvas shadows>
        <Suspense fallback={null}>
          {/* Camera */}
          <PerspectiveCamera
            makeDefault
            position={cameraPosition}
            fov={50}
          />

          {/* Lighting */}
          {/* @ts-expect-error - React Three Fiber elements */}
          <ambientLight intensity={lightingMode === 'day' ? 0.6 : 0.2} />
          {/* @ts-expect-error - React Three Fiber elements */}
          <directionalLight
            position={[10, 10, 5]}
            intensity={lightingMode === 'day' ? 1 : 0.3}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          {/* @ts-expect-error - React Three Fiber elements */}
          <pointLight 
            position={[0, 5, 0]} 
            intensity={lightingMode === 'day' ? 0.5 : 0.8}
            color={lightingMode === 'night' ? '#ffd700' : '#ffffff'}
          />

          {/* Grid */}
          {showGrid && (
            <Grid
              args={[20, 20]}
              cellSize={1}
              cellThickness={0.5}
              cellColor="#6e6e6e"
              sectionSize={5}
              sectionThickness={1}
              sectionColor="#9d4b4b"
              fadeDistance={30}
              fadeStrength={1}
              followCamera={false}
              infiniteGrid
            />
          )}

          {/* Room */}
          <Room3D 
            wireframe={wireframe} 
            materialTexture={materialTexture}
            width={10}
            height={3}
            depth={10}
          />

          {/* Controls */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            maxPolarAngle={Math.PI / 2}
            minDistance={5}
            maxDistance={30}
          />
        </Suspense>
      </Canvas>

      {/* Loading indicator */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    </Box>
  );
};
