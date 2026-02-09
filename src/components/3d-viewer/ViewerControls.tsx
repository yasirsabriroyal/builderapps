import React from 'react';
import {
  Box,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Button,
  Tooltip,
  Divider,
  Typography,
} from '@mui/material';
import {
  WbSunny as DayIcon,
  NightsStay as NightIcon,
  GridOn as GridIcon,
  GridOff as GridOffIcon,
  ViewInAr as WireframeIcon,
  CameraAlt as ScreenshotIcon,
  ThreeDRotation as View3DIcon,
  ViewAgenda as TopViewIcon,
  ViewArray as FrontViewIcon,
  ViewColumn as SideViewIcon,
  HelpOutline as HelpIcon,
} from '@mui/icons-material';

interface ViewerControlsProps {
  lightingMode: 'day' | 'night';
  onLightingChange: (mode: 'day' | 'night') => void;
  wireframe: boolean;
  onWireframeToggle: () => void;
  showGrid: boolean;
  onGridToggle: () => void;
  cameraView: 'perspective' | 'top' | 'front' | 'side';
  onCameraViewChange: (view: 'perspective' | 'top' | 'front' | 'side') => void;
  onScreenshot: () => void;
}

export const ViewerControls: React.FC<ViewerControlsProps> = ({
  lightingMode,
  onLightingChange,
  wireframe,
  onWireframeToggle,
  showGrid,
  onGridToggle,
  cameraView,
  onCameraViewChange,
  onScreenshot,
}) => {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        mb: 2,
        display: 'flex',
        flexWrap: 'wrap',
        gap: 2,
        alignItems: 'center',
      }}
    >
      {/* Lighting Controls */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Lighting:
        </Typography>
        <ToggleButtonGroup
          value={lightingMode}
          exclusive
          onChange={(_, value) => value && onLightingChange(value)}
          size="small"
        >
          <ToggleButton value="day">
            <Tooltip title="Day Mode">
              <DayIcon />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value="night">
            <Tooltip title="Night Mode">
              <NightIcon />
            </Tooltip>
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Divider orientation="vertical" flexItem />

      {/* View Mode Controls */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2" color="text.secondary">
          View:
        </Typography>
        <ToggleButtonGroup
          value={cameraView}
          exclusive
          onChange={(_, value) => value && onCameraViewChange(value)}
          size="small"
        >
          <ToggleButton value="perspective">
            <Tooltip title="Perspective View">
              <View3DIcon />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value="top">
            <Tooltip title="Top View">
              <TopViewIcon />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value="front">
            <Tooltip title="Front View">
              <FrontViewIcon />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value="side">
            <Tooltip title="Side View">
              <SideViewIcon />
            </Tooltip>
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Divider orientation="vertical" flexItem />

      {/* Display Options */}
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Tooltip title={wireframe ? 'Solid View' : 'Wireframe View'}>
          <Button
            variant={wireframe ? 'contained' : 'outlined'}
            size="small"
            onClick={onWireframeToggle}
            startIcon={<WireframeIcon />}
          >
            Wireframe
          </Button>
        </Tooltip>

        <Tooltip title={showGrid ? 'Hide Grid' : 'Show Grid'}>
          <Button
            variant={showGrid ? 'contained' : 'outlined'}
            size="small"
            onClick={onGridToggle}
            startIcon={showGrid ? <GridOffIcon /> : <GridIcon />}
          >
            Grid
          </Button>
        </Tooltip>
      </Box>

      <Divider orientation="vertical" flexItem />

      {/* Actions */}
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Tooltip title="Take Screenshot">
          <Button
            variant="outlined"
            size="small"
            onClick={onScreenshot}
            startIcon={<ScreenshotIcon />}
          >
            Screenshot
          </Button>
        </Tooltip>

        <Tooltip title="Use mouse to rotate, scroll to zoom, right-click to pan">
          <Button variant="outlined" size="small" startIcon={<HelpIcon />}>
            Help
          </Button>
        </Tooltip>
      </Box>
    </Paper>
  );
};
