import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { Straighten, AspectRatio, SquareFoot } from '@mui/icons-material';

interface DimensionInfo {
  totalArea: number;
  rooms: Array<{
    id: string;
    name: string;
    area: number;
    dimensions?: { width: number; height: number };
  }>;
}

interface FloorPlanDimensionsProps {
  selectedObject?: fabric.Object;
  dimensionInfo?: DimensionInfo;
  gridSize?: number;
}

export const FloorPlanDimensions: React.FC<FloorPlanDimensionsProps> = ({
  selectedObject,
  dimensionInfo,
  gridSize = 20,
}) => {
  const pixelsToFeet = (pixels: number) => {
    return Math.round((pixels / gridSize) * 3); // Assuming 1 grid = 3 feet
  };

  const calculateArea = (width: number, height: number) => {
    const widthInFeet = pixelsToFeet(width);
    const heightInFeet = pixelsToFeet(height);
    return widthInFeet * heightInFeet;
  };

  // Type guard for fabric objects
  const obj = selectedObject as fabric.Object & {
    type?: string;
    width?: number;
    height?: number;
    scaleX?: number;
    scaleY?: number;
    x1?: number;
    x2?: number;
    y1?: number;
    y2?: number;
    text?: string;
    fontSize?: number;
  };

  return (
    <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Straighten />
        Dimensions
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {selectedObject && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="primary" gutterBottom>
            Selected Object
          </Typography>
          
          {obj.type === 'rect' && (
            <Box sx={{ pl: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <AspectRatio fontSize="small" />
                <Typography variant="body2">
                  Width: {pixelsToFeet((obj.width || 0) * (obj.scaleX || 1))} ft
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <AspectRatio fontSize="small" sx={{ transform: 'rotate(90deg)' }} />
                <Typography variant="body2">
                  Height: {pixelsToFeet((obj.height || 0) * (obj.scaleY || 1))} ft
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SquareFoot fontSize="small" />
                <Typography variant="body2">
                  Area: {calculateArea(
                    (obj.width || 0) * (obj.scaleX || 1),
                    (obj.height || 0) * (obj.scaleY || 1)
                  )} sq ft
                </Typography>
              </Box>
            </Box>
          )}

          {obj.type === 'line' && (
            <Box sx={{ pl: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Straighten fontSize="small" />
                <Typography variant="body2">
                  Length: {pixelsToFeet(
                    Math.sqrt(
                      Math.pow((obj.x2 || 0) - (obj.x1 || 0), 2) +
                      Math.pow((obj.y2 || 0) - (obj.y1 || 0), 2)
                    )
                  )} ft
                </Typography>
              </Box>
            </Box>
          )}

          {obj.type === 'i-text' && (
            <Box sx={{ pl: 2 }}>
              <Typography variant="body2">
                Text: "{obj.text}"
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Font Size: {obj.fontSize}px
              </Typography>
            </Box>
          )}
        </Box>
      )}

      {dimensionInfo && (
        <Box>
          <Typography variant="subtitle2" color="primary" gutterBottom>
            Floor Plan Summary
          </Typography>
          
          <Box sx={{ pl: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <SquareFoot fontSize="small" color="primary" />
              <Typography variant="body1" fontWeight="bold">
                Total Area: {dimensionInfo.totalArea} sq ft
              </Typography>
            </Box>
          </Box>

          {dimensionInfo.rooms.length > 0 && (
            <>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ mt: 2 }}>
                Rooms
              </Typography>
              <List dense sx={{ pl: 1 }}>
                {dimensionInfo.rooms.map((room) => (
                  <ListItem key={room.id} sx={{ py: 0.5 }}>
                    <ListItemText
                      primary={room.name}
                      secondary={`${room.area} sq ft${
                        room.dimensions
                          ? ` (${room.dimensions.width}' × ${room.dimensions.height}')`
                          : ''
                      }`}
                      primaryTypographyProps={{ variant: 'body2' }}
                      secondaryTypographyProps={{ variant: 'caption' }}
                    />
                  </ListItem>
                ))}
              </List>
            </>
          )}

          {dimensionInfo.rooms.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', pl: 2 }}>
              No rooms defined yet. Draw rooms using the Room tool.
            </Typography>
          )}
        </Box>
      )}

      {!selectedObject && !dimensionInfo && (
        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
          Select an object or add rooms to see dimensions.
        </Typography>
      )}

      <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
        <Typography variant="caption" color="text.secondary">
          Scale: 1 grid unit = 3 feet
        </Typography>
      </Box>
    </Paper>
  );
};
