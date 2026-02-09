import React from 'react';
import { Container, Box, Typography, Paper } from '@mui/material';

export const Viewer3DPage: React.FC = () => {
  return (
    <Container maxWidth="xl">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          3D Viewer
        </Typography>
        <Paper elevation={3} sx={{ p: 4, minHeight: '600px' }}>
          <Typography variant="body1" color="text.secondary">
            3D viewer will be implemented here using Three.js and React Three Fiber
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};
