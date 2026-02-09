import React from 'react';
import {
  Box,
  Paper,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Slider,
  Typography,
  Button,
  InputAdornment,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';

interface MaterialFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  maxPrice: number;
  onClearFilters: () => void;
}

export const MaterialFilter: React.FC<MaterialFilterProps> = ({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  priceRange,
  onPriceRangeChange,
  maxPrice,
  onClearFilters,
}) => {
  const handleSortChange = (event: SelectChangeEvent) => {
    onSortChange(event.target.value);
  };

  const handlePriceChange = (_event: Event, newValue: number | number[]) => {
    onPriceRangeChange(newValue as [number, number]);
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Search */}
        <TextField
          fullWidth
          placeholder="Search materials..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        {/* Sort and Price Range */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {/* Sort */}
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="sort-label">Sort By</InputLabel>
            <Select
              labelId="sort-label"
              value={sortBy}
              label="Sort By"
              onChange={handleSortChange}
            >
              <MenuItem value="name-asc">Name (A-Z)</MenuItem>
              <MenuItem value="name-desc">Name (Z-A)</MenuItem>
              <MenuItem value="price-asc">Price (Low to High)</MenuItem>
              <MenuItem value="price-desc">Price (High to Low)</MenuItem>
              <MenuItem value="category">Category</MenuItem>
            </Select>
          </FormControl>

          {/* Price Range */}
          <Box sx={{ flexGrow: 1, minWidth: 250 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Price Range: ${priceRange[0]} - ${priceRange[1]}
            </Typography>
            <Slider
              value={priceRange}
              onChange={handlePriceChange}
              valueLabelDisplay="auto"
              min={0}
              max={maxPrice}
              valueLabelFormat={(value) => `$${value}`}
            />
          </Box>

          {/* Clear Filters */}
          <Button
            variant="outlined"
            startIcon={<ClearIcon />}
            onClick={onClearFilters}
          >
            Clear Filters
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};
