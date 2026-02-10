import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Alert,
  Snackbar,
  CircularProgress,
  Backdrop,
} from '@mui/material';
import { Scene3D } from '../components/3d-viewer/Scene3D';
import { ViewerControls } from '../components/3d-viewer/ViewerControls';
import { MaterialPreview } from '../components/3d-viewer/MaterialPreview';

export const Viewer3DPage: React.FC = () => {
  const [lightingMode, setLightingMode] = useState<'day' | 'night'>('day');
  const [wireframe, setWireframe] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [cameraView, setCameraView] = useState<'perspective' | 'top' | 'front' | 'side'>('perspective');
  const [materialTexture, setMaterialTexture] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  // Mock material data for preview
  const [appliedMaterial, setAppliedMaterial] = useState<{
    name: string;
    category: string;
    image: string;
  } | null>(null);

  React.useEffect(() => {
    // Simulate loading time for 3D scene
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleScreenshot = () => {
    setSnackbar({
      open: true,
      message: 'Screenshot functionality will capture the current 3D view',
    });
  };

  const handleClearMaterial = () => {
    setAppliedMaterial(null);
    setMaterialTexture('');
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          3D Viewer
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Visualize your project in 3D. Use mouse to rotate, scroll to zoom, right-click to pan.
        </Typography>

        {/* Controls */}
        <ViewerControls
          lightingMode={lightingMode}
          onLightingChange={setLightingMode}
          wireframe={wireframe}
          onWireframeToggle={() => setWireframe(!wireframe)}
          showGrid={showGrid}
          onGridToggle={() => setShowGrid(!showGrid)}
          cameraView={cameraView}
          onCameraViewChange={setCameraView}
          onScreenshot={handleScreenshot}
        />

        {/* 3D Scene */}
        <Box sx={{ position: 'relative' }}>
          <Scene3D
            wireframe={wireframe}
            showGrid={showGrid}
            lightingMode={lightingMode}
            materialTexture={materialTexture}
            cameraView={cameraView}
          />

          {/* Material Preview Overlay */}
          {appliedMaterial && (
            <MaterialPreview
              materialName={appliedMaterial.name}
              materialCategory={appliedMaterial.category}
              materialImage={appliedMaterial.image}
              onClose={handleClearMaterial}
            />
          )}
        </Box>

        {/* Info Alert */}
        <Alert severity="info" sx={{ mt: 2 }}>
          This is a basic 3D room visualization. In a full implementation, it would load actual floor plan data
          and allow you to apply materials from the Material Library to different surfaces.
        </Alert>

        {/* Loading Backdrop */}
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress color="inherit" />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Initializing 3D Scene...
            </Typography>
          </Box>
        </Backdrop>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          message={snackbar.message}
        />
      </Box>
    </Container>
  );
};
