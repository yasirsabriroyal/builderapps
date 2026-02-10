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
import { Download as DownloadIcon, Print as PrintIcon } from '@mui/icons-material';
import { BudgetSummary } from '../components/budget/BudgetSummary';
import { LineItemsTable } from '../components/budget/LineItemsTable';
import { PaymentMilestones } from '../components/budget/PaymentMilestones';
import api from '../services/api';
import type {
  BudgetLineItem,
  PaymentMilestone,
  BudgetSummary as BudgetSummaryType,
} from '../types';

export const BudgetPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lineItems, setLineItems] = useState<BudgetLineItem[]>([]);
  const [milestones, setMilestones] = useState<PaymentMilestone[]>([]);
  const [summary, setSummary] = useState<BudgetSummaryType | null>(null);

  useEffect(() => {
    fetchBudgetData();
  }, []);

  const fetchBudgetData = async () => {
    try {
      setLoading(true);
      const [itemsRes, milestonesRes, summaryRes] = await Promise.all([
        api.get('/budget/line-items'),
        api.get('/budget/milestones'),
        api.get('/budget/summary'),
      ]);
      setLineItems(itemsRes.data);
      setMilestones(milestonesRes.data);
      setSummary(summaryRes.data);
    } catch (err) {
      setError('Failed to load budget data');
      console.error(err);
      // Mock data for development
      setLineItems([
        {
          id: '1',
          category: 'materials',
          description: 'Foundation concrete',
          estimatedCost: 15000,
          actualCost: 16500,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          category: 'labor',
          description: 'Framing crew',
          estimatedCost: 25000,
          actualCost: 24000,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
      setMilestones([
        {
          id: '1',
          name: 'Initial Deposit',
          amount: 50000,
          dueDate: new Date('2024-01-15'),
          isPaid: true,
          paidDate: new Date('2024-01-10'),
        },
        {
          id: '2',
          name: 'Foundation Complete',
          amount: 75000,
          dueDate: new Date('2024-03-01'),
          isPaid: false,
        },
      ]);
      setSummary({
        totalBudget: 300000,
        totalActual: 40500,
        percentSpent: 13.5,
        categoryBreakdown: [
          { category: 'materials', estimated: 100000, actual: 16500 },
          { category: 'labor', estimated: 120000, actual: 24000 },
          { category: 'permits', estimated: 30000, actual: 0 },
          { category: 'contingency', estimated: 50000, actual: 0 },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (item: Omit<BudgetLineItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await api.post('/budget/line-items', item);
      setLineItems([...lineItems, response.data]);
      fetchBudgetData();
    } catch (err) {
      console.error(err);
      // Mock add for development
      const newItem: BudgetLineItem = {
        ...item,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setLineItems([...lineItems, newItem]);
    }
  };

  const handleEditItem = async (
    id: string,
    item: Omit<BudgetLineItem, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    try {
      await api.put(`/budget/line-items/${id}`, item);
      setLineItems(lineItems.map((li) => (li.id === id ? { ...li, ...item } : li)));
      fetchBudgetData();
    } catch (err) {
      console.error(err);
      // Mock edit for development
      setLineItems(lineItems.map((li) => (li.id === id ? { ...li, ...item } : li)));
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await api.delete(`/budget/line-items/${id}`);
      setLineItems(lineItems.filter((item) => item.id !== id));
      fetchBudgetData();
    } catch (err) {
      console.error(err);
      // Mock delete for development
      setLineItems(lineItems.filter((item) => item.id !== id));
    }
  };

  const handleMarkPaid = async (id: string) => {
    try {
      await api.put(`/budget/milestones/${id}/paid`, { paidDate: new Date() });
      setMilestones(
        milestones.map((m) =>
          m.id === id ? { ...m, isPaid: true, paidDate: new Date() } : m
        )
      );
    } catch (err) {
      console.error(err);
      // Mock update for development
      setMilestones(
        milestones.map((m) =>
          m.id === id ? { ...m, isPaid: true, paidDate: new Date() } : m
        )
      );
    }
  };

  const handleEditMilestone = (milestone: PaymentMilestone) => {
    console.log('Edit milestone:', milestone);
    // TODO: Implement milestone editing dialog
  };

  const handleExportPDF = () => {
    window.print();
  };

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
          <Typography variant="h4">Budget Management</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<PrintIcon />}
              onClick={handleExportPDF}
            >
              Print
            </Button>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={handleExportPDF}
            >
              Export PDF
            </Button>
          </Box>
        </Box>

        {error && (
          <Alert severity="info" sx={{ mb: 3 }}>
            {error} - Using demo data
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12}>
            {summary && <BudgetSummary summary={summary} />}
          </Grid>

          <Grid item xs={12}>
            <LineItemsTable
              items={lineItems}
              onAddItem={handleAddItem}
              onEditItem={handleEditItem}
              onDeleteItem={handleDeleteItem}
            />
          </Grid>

          <Grid item xs={12}>
            <PaymentMilestones
              milestones={milestones}
              onMarkPaid={handleMarkPaid}
              onEdit={handleEditMilestone}
            />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};
