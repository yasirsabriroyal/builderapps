import React from 'react';
import {
  Box,
  Chip,
  Typography,
} from '@mui/material';
import {
  Countertops as CountertopsIcon,
  Kitchen as CabinetsIcon,
  Lightbulb as LightingIcon,
  Plumbing as PlumbingIcon,
  ElectricalServices as ElectricalIcon,
  Build as HardwareIcon,
  FormatPaint as PaintIcon,
  Category as OtherIcon,
} from '@mui/icons-material';

interface MaterialCategoryNavProps {
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

const categories = [
  { value: 'all', label: 'All', icon: <OtherIcon /> },
  { value: 'flooring', label: 'Flooring', icon: <CountertopsIcon /> },
  { value: 'paint', label: 'Paint', icon: <PaintIcon /> },
  { value: 'fixtures', label: 'Fixtures', icon: <CabinetsIcon /> },
  { value: 'lighting', label: 'Lighting', icon: <LightingIcon /> },
  { value: 'plumbing', label: 'Plumbing', icon: <PlumbingIcon /> },
  { value: 'electrical', label: 'Electrical', icon: <ElectricalIcon /> },
  { value: 'hardware', label: 'Hardware', icon: <HardwareIcon /> },
  { value: 'other', label: 'Other', icon: <OtherIcon /> },
];

export const MaterialCategoryNav: React.FC<MaterialCategoryNavProps> = ({
  selectedCategory,
  onCategorySelect,
}) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle2" gutterBottom color="text.secondary">
        Categories
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {categories.map((category) => (
          <Chip
            key={category.value}
            label={category.label}
            icon={category.icon}
            onClick={() => onCategorySelect(category.value)}
            color={selectedCategory === category.value ? 'primary' : 'default'}
            variant={selectedCategory === category.value ? 'filled' : 'outlined'}
            sx={{
              '&:hover': {
                backgroundColor: selectedCategory === category.value ? undefined : 'action.hover',
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
};
