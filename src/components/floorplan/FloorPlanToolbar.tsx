import React from 'react';
import {
  Box,
  ToggleButtonGroup,
  ToggleButton,
  IconButton,
  Divider,
  Tooltip,
  Paper,
} from '@mui/material';
import {
  PanTool,
  HorizontalRule,
  CropSquare,
  MeetingRoom,
  Window,
  TextFields,
  Delete,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  GridOn,
  Clear,
  Save,
  Download,
} from '@mui/icons-material';
import type { DrawingMode } from './FloorPlanCanvas';

interface FloorPlanToolbarProps {
  drawingMode: DrawingMode;
  onDrawingModeChange: (mode: DrawingMode) => void;
  onDelete?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onToggleGrid?: () => void;
  onClear?: () => void;
  onSave?: () => void;
  onExport?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  gridEnabled?: boolean;
}

export const FloorPlanToolbar: React.FC<FloorPlanToolbarProps> = ({
  drawingMode,
  onDrawingModeChange,
  onDelete,
  onUndo,
  onRedo,
  onZoomIn,
  onZoomOut,
  onToggleGrid,
  onClear,
  onSave,
  onExport,
  canUndo = false,
  canRedo = false,
  gridEnabled = true,
}) => {
  const handleModeChange = (_: React.MouseEvent<HTMLElement>, newMode: DrawingMode | null) => {
    if (newMode !== null) {
      onDrawingModeChange(newMode);
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 1, mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
        {/* Drawing Tools */}
        <ToggleButtonGroup
          value={drawingMode}
          exclusive
          onChange={handleModeChange}
          size="small"
          aria-label="drawing tools"
        >
          <ToggleButton value="select" aria-label="select">
            <Tooltip title="Select">
              <PanTool />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value="wall" aria-label="wall">
            <Tooltip title="Draw Wall">
              <HorizontalRule />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value="room" aria-label="room">
            <Tooltip title="Add Room">
              <CropSquare />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value="door" aria-label="door">
            <Tooltip title="Add Door">
              <MeetingRoom />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value="window" aria-label="window">
            <Tooltip title="Add Window">
              <Window />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value="text" aria-label="text">
            <Tooltip title="Add Text">
              <TextFields />
            </Tooltip>
          </ToggleButton>
        </ToggleButtonGroup>

        <Divider orientation="vertical" flexItem />

        {/* Edit Actions */}
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="Delete Selected">
            <span>
              <IconButton size="small" onClick={onDelete} color="error">
                <Delete />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Undo">
            <span>
              <IconButton size="small" onClick={onUndo} disabled={!canUndo}>
                <Undo />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Redo">
            <span>
              <IconButton size="small" onClick={onRedo} disabled={!canRedo}>
                <Redo />
              </IconButton>
            </span>
          </Tooltip>
        </Box>

        <Divider orientation="vertical" flexItem />

        {/* View Controls */}
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="Zoom In">
            <IconButton size="small" onClick={onZoomIn}>
              <ZoomIn />
            </IconButton>
          </Tooltip>
          <Tooltip title="Zoom Out">
            <IconButton size="small" onClick={onZoomOut}>
              <ZoomOut />
            </IconButton>
          </Tooltip>
          <Tooltip title="Toggle Grid">
            <IconButton 
              size="small" 
              onClick={onToggleGrid}
              color={gridEnabled ? 'primary' : 'default'}
            >
              <GridOn />
            </IconButton>
          </Tooltip>
        </Box>

        <Divider orientation="vertical" flexItem />

        {/* File Actions */}
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="Clear Canvas">
            <IconButton size="small" onClick={onClear} color="warning">
              <Clear />
            </IconButton>
          </Tooltip>
          <Tooltip title="Save">
            <IconButton size="small" onClick={onSave} color="success">
              <Save />
            </IconButton>
          </Tooltip>
          <Tooltip title="Export">
            <IconButton size="small" onClick={onExport} color="primary">
              <Download />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Paper>
  );
};
