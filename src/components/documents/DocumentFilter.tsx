import React from 'react';
import {
  Box,
  TextField,
  ToggleButtonGroup,
  ToggleButton,
  MenuItem,
} from '@mui/material';
import { ViewModule as GridIcon, ViewList as ListIcon } from '@mui/icons-material';
import type { DocumentCategory } from '../../types';

interface DocumentFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: DocumentCategory | 'all';
  onCategoryChange: (category: DocumentCategory | 'all') => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

const CATEGORIES: { value: DocumentCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All Documents' },
  { value: 'contracts', label: 'Contracts' },
  { value: 'blueprints', label: 'Blueprints' },
  { value: 'permits', label: 'Permits' },
  { value: 'warranties', label: 'Warranties' },
  { value: 'other', label: 'Other' },
];

export const DocumentFilter: React.FC<DocumentFilterProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  viewMode,
  onViewModeChange,
}) => {
  return (
    <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
      <TextField
        size="small"
        placeholder="Search documents..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        sx={{ flex: 1, minWidth: 200 }}
      />
      <TextField
        select
        size="small"
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value as DocumentCategory | 'all')}
        sx={{ minWidth: 150 }}
      >
        {CATEGORIES.map((cat) => (
          <MenuItem key={cat.value} value={cat.value}>
            {cat.label}
          </MenuItem>
        ))}
      </TextField>
      <ToggleButtonGroup
        value={viewMode}
        exclusive
        onChange={(_, value) => value && onViewModeChange(value)}
        size="small"
      >
        <ToggleButton value="grid">
          <GridIcon />
        </ToggleButton>
        <ToggleButton value="list">
          <ListIcon />
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};
