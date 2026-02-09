import React from 'react';
import { Container, Box, Typography, Paper } from '@mui/material';

export const BudgetPage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Budget Management
        </Typography>
        <Paper elevation={3} sx={{ p: 4, minHeight: '600px' }}>
          <Typography variant="body1" color="text.secondary">
            Budget tracking and cost analysis will be implemented here
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};
