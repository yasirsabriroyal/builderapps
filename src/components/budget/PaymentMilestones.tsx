import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from '@mui/lab';
import {
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import type { PaymentMilestone } from '../../types';

interface PaymentMilestonesProps {
  milestones: PaymentMilestone[];
  onMarkPaid: (id: string) => void;
  onEdit: (milestone: PaymentMilestone) => void;
}

export const PaymentMilestones: React.FC<PaymentMilestonesProps> = ({
  milestones,
  onMarkPaid,
  onEdit,
}) => {
  const sortedMilestones = [...milestones].sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const totalAmount = milestones.reduce((sum, m) => sum + m.amount, 0);
  const paidAmount = milestones.filter(m => m.isPaid).reduce((sum, m) => sum + m.amount, 0);

  return (
    <Card elevation={2}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Payment Milestones
          </Typography>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Paid: ${paidAmount.toLocaleString()} / ${totalAmount.toLocaleString()}
            </Typography>
          </Box>
        </Box>

        <Timeline position="right">
          {sortedMilestones.map((milestone, index) => (
            <TimelineItem key={milestone.id}>
              <TimelineOppositeContent color="text.secondary" sx={{ flex: 0.3 }}>
                <Typography variant="body2">{formatDate(milestone.dueDate)}</Typography>
                {milestone.isPaid && milestone.paidDate && (
                  <Typography variant="caption" color="success.main">
                    Paid: {formatDate(milestone.paidDate)}
                  </Typography>
                )}
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot color={milestone.isPaid ? 'success' : 'grey'}>
                  {milestone.isPaid ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />}
                </TimelineDot>
                {index < sortedMilestones.length - 1 && <TimelineConnector />}
              </TimelineSeparator>
              <TimelineContent>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography variant="subtitle2">{milestone.name}</Typography>
                    <Chip
                      label={milestone.isPaid ? 'Paid' : 'Pending'}
                      color={milestone.isPaid ? 'success' : 'default'}
                      size="small"
                    />
                  </Box>
                  <Typography variant="h6" color="primary">
                    ${milestone.amount.toLocaleString()}
                  </Typography>
                  {milestone.notes && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {milestone.notes}
                    </Typography>
                  )}
                  <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                    {!milestone.isPaid && (
                      <IconButton
                        size="small"
                        color="success"
                        onClick={() => onMarkPaid(milestone.id)}
                        title="Mark as paid"
                      >
                        <CheckCircleIcon fontSize="small" />
                      </IconButton>
                    )}
                    <IconButton
                      size="small"
                      onClick={() => onEdit(milestone)}
                      title="Edit milestone"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </CardContent>
    </Card>
  );
};
