import api from './api';

export interface MaterialLibraryItem {
  id: string;
  name: string;
  category: 'flooring' | 'paint' | 'fixtures' | 'lighting' | 'plumbing' | 'electrical' | 'hardware' | 'other';
  description: string;
  image?: string;
  priceRange: {
    min: number;
    max: number;
  };
  unit: string;
  specifications: Record<string, string>;
  suppliers: Supplier[];
  createdAt: string;
  updatedAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  pricePerUnit: number;
  availability: 'in-stock' | 'out-of-stock' | 'pre-order';
  leadTime?: string;
}

export interface MaterialSearchParams {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

export const materialService = {
  async getAllMaterials(params?: MaterialSearchParams): Promise<MaterialLibraryItem[]> {
    const response = await api.get<MaterialLibraryItem[]>('/materials', { params });
    return response.data;
  },

  async getMaterial(id: string): Promise<MaterialLibraryItem> {
    const response = await api.get<MaterialLibraryItem>(`/materials/${id}`);
    return response.data;
  },

  async searchMaterials(query: string): Promise<MaterialLibraryItem[]> {
    const response = await api.get<MaterialLibraryItem[]>('/materials/search', {
      params: { q: query },
    });
    return response.data;
  },

  async getMaterialsByCategory(category: string): Promise<MaterialLibraryItem[]> {
    const response = await api.get<MaterialLibraryItem[]>(`/materials/category/${category}`);
    return response.data;
  },

  async getSuppliers(materialId: string): Promise<Supplier[]> {
    const response = await api.get<Supplier[]>(`/materials/${materialId}/suppliers`);
    return response.data;
  },
};
