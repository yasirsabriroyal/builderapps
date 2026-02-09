import React from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task } from '../../types';

interface TaskCardProps {
  task: Task;
}

const PRIORITY_CONFIG = {
  high: { label: 'High', color: 'error' as const },
  medium: { label: 'Medium', color: 'warning' as const },
  low: { label: 'Low', color: 'info' as const },
};

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      elevation={isDragging ? 4 : 1}
      sx={{
        mb: 1,
        cursor: 'grab',
        '&:active': { cursor: 'grabbing' },
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Typography variant="subtitle2" gutterBottom>
          {task.title}
        </Typography>
        {task.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {task.description}
          </Typography>
        )}
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', alignItems: 'center' }}>
          <Chip
            label={PRIORITY_CONFIG[task.priority].label}
            color={PRIORITY_CONFIG[task.priority].color}
            size="small"
          />
          {task.assigneeName && (
            <Chip label={task.assigneeName} size="small" variant="outlined" />
          )}
          {task.dueDate && (
            <Chip
              label={formatDate(task.dueDate)}
              size="small"
              color={isOverdue ? 'error' : 'default'}
              variant="outlined"
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
};
