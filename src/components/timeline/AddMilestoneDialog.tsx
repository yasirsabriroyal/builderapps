import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
} from '@mui/material';
import type { Milestone, MilestoneStatus } from '../../types';

interface AddMilestoneDialogProps {
  open: boolean;
  milestone: Milestone | null;
  onClose: () => void;
  onSave: (milestone: Omit<Milestone, 'id' | 'photos'>) => void;
}

const STATUS_OPTIONS: { value: MilestoneStatus; label: string }[] = [
  { value: 'not-started', label: 'Not Started' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'delayed', label: 'Delayed' },
];

export const AddMilestoneDialog: React.FC<AddMilestoneDialogProps> = ({
  open,
  milestone,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState<MilestoneStatus>('not-started');
  const [progress, setProgress] = useState('0');

  useEffect(() => {
    if (milestone) {
      setName(milestone.name);
      setDescription(milestone.description);
      setStartDate(new Date(milestone.startDate).toISOString().split('T')[0]);
      setEndDate(new Date(milestone.endDate).toISOString().split('T')[0]);
      setStatus(milestone.status);
      setProgress(milestone.progress.toString());
    } else {
      setName('');
      setDescription('');
      setStartDate('');
      setEndDate('');
      setStatus('not-started');
      setProgress('0');
    }
  }, [milestone, open]);

  const handleSave = () => {
    onSave({
      name,
      description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      status,
      progress: parseInt(progress) || 0,
    });
  };

  const isValid = name && startDate && endDate;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{milestone ? 'Edit Milestone' : 'Add Milestone'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Milestone Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter milestone name"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              select
              fullWidth
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value as MilestoneStatus)}
            >
              {STATUS_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Progress (%)"
              type="number"
              value={progress}
              onChange={(e) => setProgress(e.target.value)}
              InputProps={{ inputProps: { min: 0, max: 100 } }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" disabled={!isValid}>
          {milestone ? 'Save' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
