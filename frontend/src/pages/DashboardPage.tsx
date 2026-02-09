import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  AppBar,
  Toolbar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
  CircularProgress
} from '@mui/material';
import { Add as AddIcon, Logout as LogoutIcon, Home as HomeIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { projectService } from '../services/project.service';
import { Project } from '../types';

const DashboardPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    projectName: '',
    projectType: 'new_construction',
    address: '',
    budgetMin: '',
    budgetMax: '',
    description: ''
  });
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await projectService.getProjects();
      setProjects(response.data.projects);
    } catch (err: any) {
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
    setError('');
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({
      projectName: '',
      projectType: 'new_construction',
      address: '',
      budgetMin: '',
      budgetMax: '',
      description: ''
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateProject = async () => {
    setError('');
    try {
      const projectData = {
        ...formData,
        budgetMin: formData.budgetMin ? parseFloat(formData.budgetMin) : undefined,
        budgetMax: formData.budgetMax ? parseFloat(formData.budgetMax) : undefined
      };
      await projectService.createProject(projectData);
      handleCloseDialog();
      loadProjects();
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to create project');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      design: 'primary',
      planning: 'info',
      permitting: 'warning',
      construction: 'success',
      completed: 'default',
      on_hold: 'error'
    };
    return colors[status] || 'default';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <HomeIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Builder App
          </Typography>
          <Typography variant="body1" sx={{ mr: 2 }}>
            {user?.firstName} {user?.lastName}
          </Typography>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Typography variant="h4" gutterBottom>
              Welcome, {user?.firstName}!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              You have {projects.length} active project{projects.length !== 1 ? 's' : ''}
            </Typography>
          </div>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
            size="large"
          >
            New Project
          </Button>
        </Box>

        {projects.length === 0 ? (
          <Card sx={{ textAlign: 'center', py: 8 }}>
            <CardContent>
              <HomeIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                No Projects Yet
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Get started by creating your first project
              </Typography>
              <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenDialog}>
                Create Your First Project
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {projects.map((project) => (
              <Grid item xs={12} sm={6} md={4} key={project.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {project.projectName}
                    </Typography>
                    <Chip 
                      label={project.status.replace('_', ' ').toUpperCase()} 
                      color={getStatusColor(project.status)}
                      size="small"
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {project.projectType.replace('_', ' ')}
                    </Typography>
                    {project.address && (
                      <Typography variant="body2" color="text.secondary" noWrap>
                        📍 {project.address}
                      </Typography>
                    )}
                    {project.budgetMin && project.budgetMax && (
                      <Typography variant="body2" color="text.secondary">
                        💰 ${project.budgetMin.toLocaleString()} - ${project.budgetMax.toLocaleString()}
                      </Typography>
                    )}
                  </CardContent>
                  <CardActions>
                    <Button size="small">View Details</Button>
                    <Button size="small">Edit</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Create Project Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Project</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            fullWidth
            label="Project Name"
            name="projectName"
            value={formData.projectName}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            select
            label="Project Type"
            name="projectType"
            value={formData.projectType}
            onChange={handleChange}
            margin="normal"
            required
          >
            <MenuItem value="new_construction">New Construction</MenuItem>
            <MenuItem value="renovation">Renovation</MenuItem>
            <MenuItem value="addition">Addition</MenuItem>
            <MenuItem value="remodel">Remodel</MenuItem>
          </TextField>
          <TextField
            fullWidth
            label="Address (Optional)"
            name="address"
            value={formData.address}
            onChange={handleChange}
            margin="normal"
          />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Budget Min"
                name="budgetMin"
                type="number"
                value={formData.budgetMin}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Budget Max"
                name="budgetMax"
                type="number"
                value={formData.budgetMax}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
          </Grid>
          <TextField
            fullWidth
            label="Description (Optional)"
            name="description"
            value={formData.description}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleCreateProject} variant="contained">
            Create Project
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DashboardPage;
