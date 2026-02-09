import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Button,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import type { BudgetLineItem, BudgetCategory } from '../../types';
import { AddLineItemDialog } from './AddLineItemDialog';

interface LineItemsTableProps {
  items: BudgetLineItem[];
  onAddItem: (item: Omit<BudgetLineItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onEditItem: (id: string, item: Omit<BudgetLineItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onDeleteItem: (id: string) => void;
}

const CATEGORY_LABELS = {
  materials: 'Materials',
  labor: 'Labor',
  permits: 'Permits',
  contingency: 'Contingency',
};

const CATEGORY_COLORS: Record<BudgetCategory, 'primary' | 'secondary' | 'warning' | 'info'> = {
  materials: 'primary',
  labor: 'secondary',
  permits: 'warning',
  contingency: 'info',
};

export const LineItemsTable: React.FC<LineItemsTableProps> = ({
  items,
  onAddItem,
  onEditItem,
  onDeleteItem,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BudgetLineItem | null>(null);

  const handleEdit = (item: BudgetLineItem) => {
    setEditingItem(item);
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setEditingItem(null);
  };

  const handleSave = (item: Omit<BudgetLineItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingItem) {
      onEditItem(editingItem.id, item);
    } else {
      onAddItem(item);
    }
    handleClose();
  };

  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<BudgetCategory, BudgetLineItem[]>);

  const calculateSubtotal = (category: BudgetCategory) => {
    const categoryItems = groupedItems[category] || [];
    const estimated = categoryItems.reduce((sum, item) => sum + item.estimatedCost, 0);
    const actual = categoryItems.reduce((sum, item) => sum + item.actualCost, 0);
    return { estimated, actual };
  };

  return (
    <>
      <Card elevation={2}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Line Items
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setDialogOpen(true)}
            >
              Add Line Item
            </Button>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Category</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell align="right">Estimated Cost</TableCell>
                  <TableCell align="right">Actual Cost</TableCell>
                  <TableCell align="right">Variance</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(CATEGORY_LABELS).map(([category, label]) => {
                  const categoryItems = groupedItems[category as BudgetCategory] || [];
                  const subtotal = calculateSubtotal(category as BudgetCategory);
                  
                  return (
                    <React.Fragment key={category}>
                      {categoryItems.map((item) => {
                        const variance = item.actualCost - item.estimatedCost;
                        return (
                          <TableRow key={item.id}>
                            <TableCell>
                              <Chip
                                label={label}
                                color={CATEGORY_COLORS[item.category]}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>{item.description}</TableCell>
                            <TableCell align="right">
                              ${item.estimatedCost.toLocaleString()}
                            </TableCell>
                            <TableCell align="right">
                              ${item.actualCost.toLocaleString()}
                            </TableCell>
                            <TableCell 
                              align="right"
                              sx={{ 
                                color: variance > 0 ? 'error.main' : variance < 0 ? 'success.main' : 'text.primary' 
                              }}
                            >
                              {variance > 0 ? '+' : ''}${variance.toLocaleString()}
                            </TableCell>
                            <TableCell align="right">
                              <IconButton size="small" onClick={() => handleEdit(item)}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton size="small" onClick={() => onDeleteItem(item.id)}>
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      {categoryItems.length > 0 && (
                        <TableRow sx={{ backgroundColor: 'action.hover' }}>
                          <TableCell colSpan={2}>
                            <Typography variant="subtitle2">
                              {label} Subtotal
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="subtitle2">
                              ${subtotal.estimated.toLocaleString()}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="subtitle2">
                              ${subtotal.actual.toLocaleString()}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography 
                              variant="subtitle2"
                              sx={{ 
                                color: subtotal.actual > subtotal.estimated ? 'error.main' : 'success.main' 
                              }}
                            >
                              {subtotal.actual > subtotal.estimated ? '+' : ''}
                              ${(subtotal.actual - subtotal.estimated).toLocaleString()}
                            </Typography>
                          </TableCell>
                          <TableCell />
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <AddLineItemDialog
        open={dialogOpen}
        item={editingItem}
        onClose={handleClose}
        onSave={handleSave}
      />
    </>
  );
};
