import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  Divider,
  Table,
  TableBody,
  TableRow,
  TableCell,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from '@mui/material';
import {
  Close as CloseIcon,
  Store as StoreIcon,
  CheckCircle as InStockIcon,
  Cancel as OutOfStockIcon,
  Schedule as PreOrderIcon,
} from '@mui/icons-material';
import type { MaterialLibraryItem } from '../../services/material.service';

interface MaterialDetailProps {
  material: MaterialLibraryItem | null;
  open: boolean;
  onClose: () => void;
  onAddToProject: (material: MaterialLibraryItem) => void;
}

export const MaterialDetail: React.FC<MaterialDetailProps> = ({
  material,
  open,
  onClose,
  onAddToProject,
}) => {
  if (!material) return null;

  const getAvailabilityIcon = (availability: string) => {
    switch (availability) {
      case 'in-stock':
        return <InStockIcon color="success" />;
      case 'out-of-stock':
        return <OutOfStockIcon color="error" />;
      case 'pre-order':
        return <PreOrderIcon color="warning" />;
      default:
        return null;
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'in-stock':
        return 'success';
      case 'out-of-stock':
        return 'error';
      case 'pre-order':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" component="div">
          {material.name}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {/* Image */}
        {material.image && (
          <Box
            component="img"
            src={material.image}
            alt={material.name}
            sx={{
              width: '100%',
              maxHeight: 300,
              objectFit: 'cover',
              borderRadius: 1,
              mb: 3,
            }}
          />
        )}

        {/* Category */}
        <Box sx={{ mb: 2 }}>
          <Chip
            label={material.category}
            color="primary"
            sx={{ textTransform: 'capitalize' }}
          />
        </Box>

        {/* Description */}
        <Typography variant="body1" paragraph>
          {material.description}
        </Typography>

        <Divider sx={{ my: 3 }} />

        {/* Price */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Pricing
          </Typography>
          <Typography variant="h4" color="primary">
            ${material.priceRange.min} - ${material.priceRange.max}
            <Typography component="span" variant="body1" color="text.secondary" sx={{ ml: 1 }}>
              per {material.unit}
            </Typography>
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Specifications */}
        {Object.keys(material.specifications).length > 0 && (
          <>
            <Typography variant="h6" gutterBottom>
              Specifications
            </Typography>
            <Table size="small" sx={{ mb: 3 }}>
              <TableBody>
                {Object.entries(material.specifications).map(([key, value]) => (
                  <TableRow key={key}>
                    <TableCell sx={{ fontWeight: 'medium', textTransform: 'capitalize' }}>
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </TableCell>
                    <TableCell>{value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Divider sx={{ my: 3 }} />
          </>
        )}

        {/* Suppliers */}
        {material.suppliers.length > 0 && (
          <>
            <Typography variant="h6" gutterBottom>
              Suppliers ({material.suppliers.length})
            </Typography>
            <List>
              {material.suppliers.map((supplier) => (
                <ListItem
                  key={supplier.id}
                  sx={{
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 1,
                    mb: 1,
                  }}
                >
                  <Box sx={{ width: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <StoreIcon color="action" />
                        <Typography variant="subtitle1" fontWeight="medium">
                          {supplier.name}
                        </Typography>
                      </Box>
                      <Chip
                        icon={getAvailabilityIcon(supplier.availability) || undefined}
                        label={supplier.availability.replace('-', ' ')}
                        size="small"
                        color={getAvailabilityColor(supplier.availability) as any}
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </Box>
                    <ListItemText
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="text.primary">
                            ${supplier.pricePerUnit} per {material.unit}
                          </Typography>
                          {supplier.leadTime && (
                            <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                              Lead time: {supplier.leadTime}
                            </Typography>
                          )}
                          <br />
                          <Typography component="span" variant="body2" color="text.secondary">
                            Contact: {supplier.contact}
                          </Typography>
                        </>
                      }
                    />
                  </Box>
                </ListItem>
              ))}
            </List>
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button
          variant="contained"
          onClick={() => {
            onAddToProject(material);
            onClose();
          }}
        >
          Add to Project
        </Button>
      </DialogActions>
    </Dialog>
  );
};
