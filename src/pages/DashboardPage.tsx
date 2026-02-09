import React from 'react';
import { Container, Box, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const menuItems = [
    { title: 'Floor Plan Designer', path: '/floor-plan', description: 'Design and edit floor plans' },
    { title: '3D Viewer', path: '/3d-viewer', description: 'View your project in 3D' },
    { title: 'Materials Library', path: '/materials', description: 'Browse and select materials' },
    { title: 'Budget Management', path: '/budget', description: 'Track project costs' },
    { title: 'Timeline', path: '/timeline', description: 'Manage project timeline' },
    { title: 'Documents', path: '/documents', description: 'Upload and manage documents' },
    { title: 'Collaboration', path: '/collaboration', description: 'Team communication' },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h3" gutterBottom>
          Welcome, {user?.name}!
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Manage your construction projects from this dashboard
        </Typography>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          {menuItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.path}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {item.description}
                  </Typography>
                  <Button variant="contained" onClick={() => navigate(item.path)} fullWidth>
                    Open
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};
