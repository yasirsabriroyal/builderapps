import React from 'react';
import { Container, Box, Typography, Paper } from '@mui/material';

export const TimelinePage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Project Timeline
        </Typography>
        <Paper elevation={3} sx={{ p: 4, minHeight: '600px' }}>
          <Typography variant="body1" color="text.secondary">
            Timeline management and Gantt chart will be implemented here
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};
