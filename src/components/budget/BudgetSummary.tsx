import React from 'react';
import { Box, Card, CardContent, Typography, LinearProgress, Grid } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { BudgetSummary as BudgetSummaryType } from '../../types';

interface BudgetSummaryProps {
  summary: BudgetSummaryType;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const CATEGORY_LABELS = {
  materials: 'Materials',
  labor: 'Labor',
  permits: 'Permits',
  contingency: 'Contingency',
};

export const BudgetSummary: React.FC<BudgetSummaryProps> = ({ summary }) => {
  const chartData = summary.categoryBreakdown.map((item) => ({
    name: CATEGORY_LABELS[item.category],
    value: item.actual || item.estimated,
  }));

  const remaining = summary.totalBudget - summary.totalActual;
  const isOverBudget = remaining < 0;

  return (
    <Card elevation={2}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Budget Overview
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Total Budget
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  ${summary.totalBudget.toLocaleString()}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Actual Spent
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  ${summary.totalActual.toLocaleString()}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Remaining
                </Typography>
                <Typography 
                  variant="body2" 
                  fontWeight="bold"
                  color={isOverBudget ? 'error' : 'success.main'}
                >
                  {isOverBudget ? '-' : ''}${Math.abs(remaining).toLocaleString()}
                </Typography>
              </Box>

              <Box sx={{ mb: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">Progress</Typography>
                  <Typography variant="body2">{summary.percentSpent.toFixed(1)}%</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={Math.min(summary.percentSpent, 100)} 
                  color={summary.percentSpent > 100 ? 'error' : 'primary'}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Category Breakdown
              </Typography>
              {summary.categoryBreakdown.map((item, index) => (
                <Box key={item.category} sx={{ mb: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box 
                        sx={{ 
                          width: 12, 
                          height: 12, 
                          backgroundColor: COLORS[index], 
                          borderRadius: '50%',
                          mr: 1 
                        }} 
                      />
                      <Typography variant="body2">
                        {CATEGORY_LABELS[item.category]}
                      </Typography>
                    </Box>
                    <Typography variant="body2" fontWeight="medium">
                      ${item.actual.toLocaleString()} / ${item.estimated.toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
