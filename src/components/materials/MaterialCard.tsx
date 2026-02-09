import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  AddCircleOutline as AddIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import type { MaterialLibraryItem } from '../../services/material.service';

interface MaterialCardProps {
  material: MaterialLibraryItem;
  isFavorite?: boolean;
  onFavoriteToggle: (materialId: string) => void;
  onAddToProject: (material: MaterialLibraryItem) => void;
  onViewDetails: (material: MaterialLibraryItem) => void;
}

export const MaterialCard: React.FC<MaterialCardProps> = ({
  material,
  isFavorite = false,
  onFavoriteToggle,
  onAddToProject,
  onViewDetails,
}) => {
  const formatPrice = (min: number, max: number) => {
    if (min === max) return `$${min}`;
    return `$${min} - $${max}`;
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6,
        },
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={material.image || 'https://via.placeholder.com/400x300?text=No+Image'}
        alt={material.name}
        sx={{ objectFit: 'cover' }}
      />
      
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
          <Typography variant="h6" component="h2" gutterBottom sx={{ flexGrow: 1 }}>
            {material.name}
          </Typography>
          <IconButton
            size="small"
            onClick={() => onFavoriteToggle(material.id)}
            color={isFavorite ? 'error' : 'default'}
          >
            {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
        </Box>

        <Chip
          label={material.category}
          size="small"
          color="primary"
          variant="outlined"
          sx={{ mb: 1, textTransform: 'capitalize' }}
        />

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {material.description.length > 100
            ? `${material.description.substring(0, 100)}...`
            : material.description}
        </Typography>

        <Typography variant="h6" color="primary" gutterBottom>
          {formatPrice(material.priceRange.min, material.priceRange.max)}{' '}
          <Typography component="span" variant="body2" color="text.secondary">
            per {material.unit}
          </Typography>
        </Typography>

        {material.suppliers.length > 0 && (
          <Typography variant="body2" color="text.secondary">
            {material.suppliers.length} supplier{material.suppliers.length !== 1 ? 's' : ''} available
          </Typography>
        )}
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Tooltip title="View full details">
          <Button
            size="small"
            startIcon={<InfoIcon />}
            onClick={() => onViewDetails(material)}
          >
            Details
          </Button>
        </Tooltip>
        <Tooltip title="Add to project">
          <Button
            size="small"
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => onAddToProject(material)}
          >
            Add
          </Button>
        </Tooltip>
      </CardActions>
    </Card>
  );
};
