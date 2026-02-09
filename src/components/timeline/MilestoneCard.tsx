import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  LinearProgress,
  Button,
} from '@mui/material';
import {
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  PhotoCamera as PhotoCameraIcon,
} from '@mui/icons-material';
import type { Milestone } from '../../types';

interface MilestoneCardProps {
  milestone: Milestone;
  onEdit: (milestone: Milestone) => void;
  onMarkComplete: (id: string) => void;
  onAddPhoto: (id: string) => void;
}

const STATUS_CONFIG = {
  'not-started': { label: 'Not Started', color: 'default' as const },
  'in-progress': { label: 'In Progress', color: 'primary' as const },
  completed: { label: 'Completed', color: 'success' as const },
  delayed: { label: 'Delayed', color: 'error' as const },
};

export const MilestoneCard: React.FC<MilestoneCardProps> = ({
  milestone,
  onEdit,
  onMarkComplete,
  onAddPhoto,
}) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const status = STATUS_CONFIG[milestone.status];
  const isOverdue =
    milestone.status !== 'completed' && new Date(milestone.endDate) < new Date();

  return (
    <Card elevation={2}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography variant="h6">{milestone.name}</Typography>
              <Chip
                label={status.label}
                color={isOverdue ? 'error' : status.color}
                size="small"
              />
            </Box>
            <Typography variant="body2" color="text.secondary">
              {milestone.description}
            </Typography>
          </Box>
          <IconButton size="small" onClick={() => onEdit(milestone)}>
            <EditIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2" color="text.secondary">
              Progress
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {milestone.progress}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={milestone.progress}
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Start Date
            </Typography>
            <Typography variant="body2">{formatDate(milestone.startDate)}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              End Date
            </Typography>
            <Typography variant="body2" color={isOverdue ? 'error' : 'inherit'}>
              {formatDate(milestone.endDate)}
            </Typography>
          </Box>
        </Box>

        {milestone.photos.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary">
              {milestone.photos.length} photo{milestone.photos.length !== 1 ? 's' : ''}
            </Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', gap: 1 }}>
          {milestone.status !== 'completed' && (
            <Button
              size="small"
              variant="outlined"
              color="success"
              startIcon={<CheckCircleIcon />}
              onClick={() => onMarkComplete(milestone.id)}
            >
              Mark Complete
            </Button>
          )}
          <Button
            size="small"
            variant="outlined"
            startIcon={<PhotoCameraIcon />}
            onClick={() => onAddPhoto(milestone.id)}
          >
            Add Photos
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};
