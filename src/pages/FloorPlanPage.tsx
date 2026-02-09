import React from 'react';
import { Container, Box, Typography, Paper } from '@mui/material';

export const FloorPlanPage: React.FC = () => {
  return (
    <Container maxWidth="xl">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Floor Plan Designer
        </Typography>
        <Paper elevation={3} sx={{ p: 4, minHeight: '600px' }}>
          <Typography variant="body1" color="text.secondary">
            Floor plan designer will be implemented here using Fabric.js canvas
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};
