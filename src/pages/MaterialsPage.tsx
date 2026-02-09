import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Pagination,
  Alert,
  Snackbar,
  Skeleton,
} from '@mui/material';
import { MaterialCard } from '../components/materials/MaterialCard';
import { MaterialFilter } from '../components/materials/MaterialFilter';
import { MaterialDetail } from '../components/materials/MaterialDetail';
import { MaterialCategoryNav } from '../components/materials/MaterialCategoryNav';
import {
  materialService,
} from '../services/material.service';
import type {
  MaterialLibraryItem,
  MaterialSearchParams,
} from '../services/material.service';

const ITEMS_PER_PAGE = 12;
const MAX_PRICE = 10000;

export const MaterialsPage: React.FC = () => {
  const [materials, setMaterials] = useState<MaterialLibraryItem[]>([]);
  const [filteredMaterials, setFilteredMaterials] = useState<MaterialLibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name-asc');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, MAX_PRICE]);
  
  // UI states
  const [page, setPage] = useState(1);
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialLibraryItem | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  // Load materials
  useEffect(() => {
    const loadMaterials = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const params: MaterialSearchParams = {};
        if (selectedCategory !== 'all') {
          params.category = selectedCategory;
        }
        
        const data = await materialService.getAllMaterials(params);
        setMaterials(data);
        setFilteredMaterials(data);
      } catch (err) {
        console.error('Failed to load materials:', err);
        setError('Failed to load materials. Using sample data.');
        // Generate sample data for demo
        setMaterials(generateSampleMaterials());
        setFilteredMaterials(generateSampleMaterials());
      } finally {
        setLoading(false);
      }
    };

    loadMaterials();
  }, [selectedCategory]);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...materials];

    // Search filter
    if (searchQuery) {
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Price range filter
    result = result.filter(
      (m) =>
        m.priceRange.min >= priceRange[0] &&
        m.priceRange.max <= priceRange[1]
    );

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'price-asc':
          return a.priceRange.min - b.priceRange.min;
        case 'price-desc':
          return b.priceRange.max - a.priceRange.max;
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

    setFilteredMaterials(result);
    setPage(1);
  }, [materials, searchQuery, priceRange, sortBy]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setPriceRange([0, MAX_PRICE]);
    setSortBy('name-asc');
    setSelectedCategory('all');
  };

  const handleFavoriteToggle = (materialId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(materialId)) {
        newFavorites.delete(materialId);
        showSnackbar('Removed from favorites');
      } else {
        newFavorites.add(materialId);
        showSnackbar('Added to favorites');
      }
      return newFavorites;
    });
  };

  const handleAddToProject = (material: MaterialLibraryItem) => {
    showSnackbar(`Added ${material.name} to project`);
  };

  const handleViewDetails = (material: MaterialLibraryItem) => {
    setSelectedMaterial(material);
    setDetailOpen(true);
  };

  const showSnackbar = (message: string) => {
    setSnackbar({ open: true, message });
  };

  // Pagination
  const totalPages = Math.ceil(filteredMaterials.length / ITEMS_PER_PAGE);
  const paginatedMaterials = filteredMaterials.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <Container maxWidth="xl">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Materials Library
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Browse and select materials for your project
        </Typography>

        {error && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Category Navigation */}
        <MaterialCategoryNav
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
        />

        {/* Filters */}
        <MaterialFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          priceRange={priceRange}
          onPriceRangeChange={setPriceRange}
          maxPrice={MAX_PRICE}
          onClearFilters={handleClearFilters}
        />

        {/* Results Count */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {loading ? 'Loading...' : `${filteredMaterials.length} materials found`}
        </Typography>

        {/* Material Grid */}
        {loading ? (
          <Grid container spacing={3}>
            {Array.from({ length: 6 }).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Skeleton variant="rectangular" height={200} />
                <Skeleton variant="text" sx={{ mt: 1 }} />
                <Skeleton variant="text" />
              </Grid>
            ))}
          </Grid>
        ) : filteredMaterials.length === 0 ? (
          <Alert severity="info">
            No materials found. Try adjusting your filters.
          </Alert>
        ) : (
          <>
            <Grid container spacing={3}>
              {paginatedMaterials.map((material) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={material.id}>
                  <MaterialCard
                    material={material}
                    isFavorite={favorites.has(material.id)}
                    onFavoriteToggle={handleFavoriteToggle}
                    onAddToProject={handleAddToProject}
                    onViewDetails={handleViewDetails}
                  />
                </Grid>
              ))}
            </Grid>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, value) => setPage(value)}
                  color="primary"
                  size="large"
                />
              </Box>
            )}
          </>
        )}

        {/* Material Detail Modal */}
        <MaterialDetail
          material={selectedMaterial}
          open={detailOpen}
          onClose={() => setDetailOpen(false)}
          onAddToProject={handleAddToProject}
        />

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          message={snackbar.message}
        />
      </Box>
    </Container>
  );
};

// Sample data generator for demo purposes
function generateSampleMaterials(): MaterialLibraryItem[] {
  const materials: MaterialLibraryItem[] = [];

  const sampleData = [
    { name: 'Oak Hardwood Flooring', category: 'flooring', desc: 'Premium solid oak hardwood flooring with natural finish', min: 8, max: 15, unit: 'sq ft' },
    { name: 'Porcelain Tile', category: 'flooring', desc: 'Durable porcelain tile suitable for high-traffic areas', min: 5, max: 12, unit: 'sq ft' },
    { name: 'Interior Wall Paint', category: 'paint', desc: 'Low-VOC latex paint in various colors', min: 25, max: 45, unit: 'gallon' },
    { name: 'LED Recessed Lighting', category: 'lighting', desc: 'Energy-efficient LED recessed light fixtures', min: 35, max: 75, unit: 'unit' },
    { name: 'Kitchen Faucet', category: 'plumbing', desc: 'Single-handle pull-down kitchen faucet', min: 150, max: 350, unit: 'unit' },
    { name: 'Door Hardware Set', category: 'hardware', desc: 'Complete door handle and lock set', min: 45, max: 120, unit: 'set' },
    { name: 'Pendant Light Fixture', category: 'lighting', desc: 'Modern pendant light with adjustable height', min: 80, max: 200, unit: 'unit' },
    { name: 'Bathroom Vanity', category: 'fixtures', desc: '36-inch bathroom vanity with marble top', min: 600, max: 1200, unit: 'unit' },
    { name: 'Carpet Tiles', category: 'flooring', desc: 'Modular carpet tiles for easy installation', min: 3, max: 7, unit: 'sq ft' },
    { name: 'Wall Outlet', category: 'electrical', desc: 'Standard 15A duplex electrical outlet', min: 3, max: 8, unit: 'unit' },
    { name: 'Cabinet Knobs', category: 'hardware', desc: 'Decorative cabinet knobs in various finishes', min: 5, max: 15, unit: 'unit' },
    { name: 'Vinyl Plank Flooring', category: 'flooring', desc: 'Waterproof luxury vinyl plank flooring', min: 4, max: 9, unit: 'sq ft' },
  ];

  sampleData.forEach((item, index) => {
    materials.push({
      id: `mat-${index + 1}`,
      name: item.name,
      category: item.category as any,
      description: item.desc,
      image: `https://via.placeholder.com/400x300?text=${encodeURIComponent(item.name)}`,
      priceRange: {
        min: item.min,
        max: item.max,
      },
      unit: item.unit,
      specifications: {
        material: 'High Quality',
        warranty: '1-5 years',
        installation: 'Professional recommended',
      },
      suppliers: [
        {
          id: `sup-${index}-1`,
          name: 'BuildMart Supply',
          contact: 'info@buildmart.com',
          pricePerUnit: item.min + (item.max - item.min) * 0.3,
          availability: 'in-stock',
          leadTime: '1-2 days',
        },
        {
          id: `sup-${index}-2`,
          name: 'Home Depot',
          contact: '1-800-HOME-DEPOT',
          pricePerUnit: item.min + (item.max - item.min) * 0.7,
          availability: 'in-stock',
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  });

  return materials;
}
