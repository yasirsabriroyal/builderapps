import React from 'react';
import { Box, Card, CardContent, Typography, Paper } from '@mui/material';
import type { Milestone } from '../../types';

interface GanttChartProps {
  milestones: Milestone[];
}

export const GanttChart: React.FC<GanttChartProps> = ({ milestones }) => {
  const sortedMilestones = [...milestones].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  const allDates = sortedMilestones.flatMap((m) => [
    new Date(m.startDate).getTime(),
    new Date(m.endDate).getTime(),
  ]);
  const minDate = Math.min(...allDates);
  const maxDate = Math.max(...allDates);
  const totalDays = Math.ceil((maxDate - minDate) / (1000 * 60 * 60 * 24));
  const today = Date.now();

  const getPosition = (date: Date) => {
    const dateTime = new Date(date).getTime();
    return ((dateTime - minDate) / (maxDate - minDate)) * 100;
  };

  const getDuration = (start: Date, end: Date) => {
    const startPos = getPosition(start);
    const endPos = getPosition(end);
    return endPos - startPos;
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getStatusColor = (status: Milestone['status']) => {
    switch (status) {
      case 'completed':
        return '#4caf50';
      case 'in-progress':
        return '#2196f3';
      case 'delayed':
        return '#f44336';
      default:
        return '#9e9e9e';
    }
  };

  const todayPosition = ((today - minDate) / (maxDate - minDate)) * 100;

  return (
    <Card elevation={2}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Project Timeline
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Duration: {totalDays} days
        </Typography>

        <Box sx={{ position: 'relative', minHeight: sortedMilestones.length * 60 + 40 }}>
          {/* Today indicator */}
          {todayPosition >= 0 && todayPosition <= 100 && (
            <Box
              sx={{
                position: 'absolute',
                left: `${todayPosition}%`,
                top: 0,
                bottom: 0,
                width: 2,
                backgroundColor: 'error.main',
                zIndex: 10,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  position: 'absolute',
                  top: -20,
                  left: -15,
                  backgroundColor: 'error.main',
                  color: 'white',
                  px: 1,
                  borderRadius: 1,
                  fontSize: '0.7rem',
                }}
              >
                Today
              </Typography>
            </Box>
          )}

          {/* Milestones */}
          {sortedMilestones.map((milestone, index) => {
            const left = getPosition(milestone.startDate);
            const width = getDuration(milestone.startDate, milestone.endDate);

            return (
              <Box
                key={milestone.id}
                sx={{
                  position: 'absolute',
                  top: index * 60 + 20,
                  left: 0,
                  right: 0,
                  height: 50,
                }}
              >
                <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.85rem' }}>
                  {milestone.name}
                </Typography>
                <Box sx={{ position: 'relative', height: 30 }}>
                  <Paper
                    elevation={1}
                    sx={{
                      position: 'absolute',
                      left: `${left}%`,
                      width: `${width}%`,
                      height: '100%',
                      backgroundColor: getStatusColor(milestone.status),
                      display: 'flex',
                      alignItems: 'center',
                      px: 1,
                      overflow: 'hidden',
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'white',
                        fontWeight: 'medium',
                        fontSize: '0.75rem',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {milestone.progress}%
                    </Typography>
                  </Paper>
                  <Typography
                    variant="caption"
                    sx={{
                      position: 'absolute',
                      left: `${left}%`,
                      top: 35,
                      fontSize: '0.7rem',
                      color: 'text.secondary',
                    }}
                  >
                    {formatDate(milestone.startDate)}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      position: 'absolute',
                      left: `${left + width}%`,
                      top: 35,
                      fontSize: '0.7rem',
                      color: 'text.secondary',
                      transform: 'translateX(-100%)',
                    }}
                  >
                    {formatDate(milestone.endDate)}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>

        <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {[
            { status: 'completed', label: 'Completed' },
            { status: 'in-progress', label: 'In Progress' },
            { status: 'not-started', label: 'Not Started' },
            { status: 'delayed', label: 'Delayed' },
          ].map((item) => (
            <Box key={item.status} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  backgroundColor: getStatusColor(item.status as Milestone['status']),
                  borderRadius: 1,
                }}
              />
              <Typography variant="caption">{item.label}</Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};
