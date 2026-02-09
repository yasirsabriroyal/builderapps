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
import type { BudgetLineItem, BudgetCategory } from '../../types';

interface AddLineItemDialogProps {
  open: boolean;
  item: BudgetLineItem | null;
  onClose: () => void;
  onSave: (item: Omit<BudgetLineItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

const CATEGORIES: { value: BudgetCategory; label: string }[] = [
  { value: 'materials', label: 'Materials' },
  { value: 'labor', label: 'Labor' },
  { value: 'permits', label: 'Permits' },
  { value: 'contingency', label: 'Contingency' },
];

export const AddLineItemDialog: React.FC<AddLineItemDialogProps> = ({
  open,
  item,
  onClose,
  onSave,
}) => {
  const [category, setCategory] = useState<BudgetCategory>('materials');
  const [description, setDescription] = useState('');
  const [estimatedCost, setEstimatedCost] = useState('');
  const [actualCost, setActualCost] = useState('');

  useEffect(() => {
    if (item) {
      setCategory(item.category);
      setDescription(item.description);
      setEstimatedCost(item.estimatedCost.toString());
      setActualCost(item.actualCost.toString());
    } else {
      setCategory('materials');
      setDescription('');
      setEstimatedCost('');
      setActualCost('');
    }
  }, [item, open]);

  const handleSave = () => {
    onSave({
      category,
      description,
      estimatedCost: parseFloat(estimatedCost) || 0,
      actualCost: parseFloat(actualCost) || 0,
    });
  };

  const isValid = description && estimatedCost;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {item ? 'Edit Line Item' : 'Add Line Item'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid item xs={12}>
            <TextField
              select
              fullWidth
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value as BudgetCategory)}
            >
              {CATEGORIES.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter item description"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Estimated Cost"
              type="number"
              value={estimatedCost}
              onChange={(e) => setEstimatedCost(e.target.value)}
              InputProps={{
                startAdornment: <span>$</span>,
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Actual Cost"
              type="number"
              value={actualCost}
              onChange={(e) => setActualCost(e.target.value)}
              InputProps={{
                startAdornment: <span>$</span>,
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" disabled={!isValid}>
          {item ? 'Save' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
