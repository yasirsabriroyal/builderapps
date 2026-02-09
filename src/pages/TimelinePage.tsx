import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { GanttChart } from '../components/timeline/GanttChart';
import { MilestoneCard } from '../components/timeline/MilestoneCard';
import { AddMilestoneDialog } from '../components/timeline/AddMilestoneDialog';
import { PhotoGallery } from '../components/timeline/PhotoGallery';
import api from '../services/api';
import type { Milestone, MilestonePhoto } from '../types';

export const TimelinePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);
  const [photoGalleryOpen, setPhotoGalleryOpen] = useState(false);
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string | null>(null);

  useEffect(() => {
    fetchMilestones();
  }, []);

  const fetchMilestones = async () => {
    try {
      setLoading(true);
      const response = await api.get('/timeline/milestones');
      setMilestones(response.data);
    } catch (err) {
      setError('Failed to load timeline data');
      console.error(err);
      // Mock data for development
      setMilestones([
        {
          id: '1',
          name: 'Foundation',
          description: 'Excavation and foundation work',
          startDate: new Date('2024-01-15'),
          endDate: new Date('2024-02-15'),
          status: 'completed',
          progress: 100,
          photos: [],
        },
        {
          id: '2',
          name: 'Framing',
          description: 'Frame structure and roof',
          startDate: new Date('2024-02-16'),
          endDate: new Date('2024-04-01'),
          status: 'in-progress',
          progress: 60,
          photos: [],
        },
        {
          id: '3',
          name: 'Electrical & Plumbing',
          description: 'Install electrical and plumbing systems',
          startDate: new Date('2024-04-02'),
          endDate: new Date('2024-05-15'),
          status: 'not-started',
          progress: 0,
          photos: [],
        },
        {
          id: '4',
          name: 'Interior Finishing',
          description: 'Drywall, painting, and flooring',
          startDate: new Date('2024-05-16'),
          endDate: new Date('2024-07-01'),
          status: 'not-started',
          progress: 0,
          photos: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMilestone = () => {
    setEditingMilestone(null);
    setDialogOpen(true);
  };

  const handleEditMilestone = (milestone: Milestone) => {
    setEditingMilestone(milestone);
    setDialogOpen(true);
  };

  const handleSaveMilestone = async (milestoneData: Omit<Milestone, 'id' | 'photos'>) => {
    try {
      if (editingMilestone) {
        await api.put(`/timeline/milestones/${editingMilestone.id}`, milestoneData);
        setMilestones(
          milestones.map((m) =>
            m.id === editingMilestone.id ? { ...m, ...milestoneData } : m
          )
        );
      } else {
        const response = await api.post('/timeline/milestones', milestoneData);
        setMilestones([...milestones, response.data]);
      }
      setDialogOpen(false);
    } catch (err) {
      console.error(err);
      // Mock save for development
      if (editingMilestone) {
        setMilestones(
          milestones.map((m) =>
            m.id === editingMilestone.id ? { ...m, ...milestoneData } : m
          )
        );
      } else {
        const newMilestone: Milestone = {
          ...milestoneData,
          id: Date.now().toString(),
          photos: [],
        };
        setMilestones([...milestones, newMilestone]);
      }
      setDialogOpen(false);
    }
  };

  const handleMarkComplete = async (id: string) => {
    try {
      await api.put(`/timeline/milestones/${id}`, {
        status: 'completed',
        progress: 100,
      });
      setMilestones(
        milestones.map((m) =>
          m.id === id ? { ...m, status: 'completed' as const, progress: 100 } : m
        )
      );
    } catch (err) {
      console.error(err);
      // Mock update for development
      setMilestones(
        milestones.map((m) =>
          m.id === id ? { ...m, status: 'completed' as const, progress: 100 } : m
        )
      );
    }
  };

  const handleAddPhoto = (milestoneId: string) => {
    setSelectedMilestoneId(milestoneId);
    setPhotoGalleryOpen(true);
  };

  const handleUploadPhotos = async (files: FileList, caption: string) => {
    if (!selectedMilestoneId) return;

    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append('photos', file);
      });
      formData.append('caption', caption);

      await api.post(`/timeline/milestones/${selectedMilestoneId}/photos`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      fetchMilestones();
    } catch (err) {
      console.error(err);
      // Mock upload for development
      const newPhotos: MilestonePhoto[] = Array.from(files).map((file, index) => ({
        id: `${Date.now()}-${index}`,
        url: URL.createObjectURL(file),
        caption,
        uploadedAt: new Date(),
        milestoneId: selectedMilestoneId,
      }));
      setMilestones(
        milestones.map((m) =>
          m.id === selectedMilestoneId ? { ...m, photos: [...m.photos, ...newPhotos] } : m
        )
      );
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (!selectedMilestoneId) return;

    try {
      await api.delete(`/timeline/photos/${photoId}`);
      setMilestones(
        milestones.map((m) =>
          m.id === selectedMilestoneId
            ? { ...m, photos: m.photos.filter((p) => p.id !== photoId) }
            : m
        )
      );
    } catch (err) {
      console.error(err);
      // Mock delete for development
      setMilestones(
        milestones.map((m) =>
          m.id === selectedMilestoneId
            ? { ...m, photos: m.photos.filter((p) => p.id !== photoId) }
            : m
        )
      );
    }
  };

  const selectedMilestone = milestones.find((m) => m.id === selectedMilestoneId);

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">Project Timeline</Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddMilestone}>
            Add Milestone
          </Button>
        </Box>

        {error && (
          <Alert severity="info" sx={{ mb: 3 }}>
            {error} - Using demo data
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <GanttChart milestones={milestones} />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Milestones
            </Typography>
          </Grid>

          {milestones.map((milestone) => (
            <Grid item xs={12} md={6} key={milestone.id}>
              <MilestoneCard
                milestone={milestone}
                onEdit={handleEditMilestone}
                onMarkComplete={handleMarkComplete}
                onAddPhoto={handleAddPhoto}
              />
            </Grid>
          ))}
        </Grid>

        <AddMilestoneDialog
          open={dialogOpen}
          milestone={editingMilestone}
          onClose={() => setDialogOpen(false)}
          onSave={handleSaveMilestone}
        />

        {selectedMilestone && (
          <PhotoGallery
            open={photoGalleryOpen}
            photos={selectedMilestone.photos}
            onClose={() => setPhotoGalleryOpen(false)}
            onUpload={handleUploadPhotos}
            onDelete={handleDeletePhoto}
          />
        )}
      </Box>
    </Container>
  );
};
