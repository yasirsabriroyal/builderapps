import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

interface MaterialPreviewProps {
  materialName?: string;
  materialCategory?: string;
  materialImage?: string;
  onClose: () => void;
}

export const MaterialPreview: React.FC<MaterialPreviewProps> = ({
  materialName,
  materialCategory,
  materialImage,
  onClose,
}) => {
  if (!materialName) return null;

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 16,
        right: 16,
        zIndex: 10,
        maxWidth: 300,
      }}
    >
      <Card elevation={4}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
            <Typography variant="h6" component="div">
              Applied Material
            </Typography>
            <Button
              size="small"
              onClick={onClose}
              sx={{ minWidth: 'auto', p: 0.5 }}
            >
              <CloseIcon fontSize="small" />
            </Button>
          </Box>

          {materialImage && (
            <Box
              component="img"
              src={materialImage}
              alt={materialName}
              sx={{
                width: '100%',
                height: 120,
                objectFit: 'cover',
                borderRadius: 1,
                mb: 2,
              }}
            />
          )}

          <Typography variant="body1" fontWeight="medium" gutterBottom>
            {materialName}
          </Typography>

          {materialCategory && (
            <Chip
              label={materialCategory}
              size="small"
              color="primary"
              variant="outlined"
            />
          )}

          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            This material is being previewed on the 3D surfaces. Rotate the view to see it from different angles.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};
