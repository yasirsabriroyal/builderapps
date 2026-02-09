import api from './api';

export interface Project {
  id: string;
  name: string;
  description: string;
  location: string;
  budget: number;
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold';
  startDate: string;
  endDate?: string;
  ownerId: string;
  floorPlan?: FloorPlan;
  materials: Material[];
  timeline: TimelineItem[];
  documents: Document[];
  createdAt: string;
  updatedAt: string;
}

export interface FloorPlan {
  id: string;
  projectId: string;
  canvasData: string;
  dimensions: {
    width: number;
    height: number;
  };
  rooms: Room[];
  updatedAt: string;
}

export interface Room {
  id: string;
  name: string;
  area: number;
  coordinates: { x: number; y: number }[];
}

export interface Material {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  totalCost: number;
  supplier?: string;
}

export interface TimelineItem {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'in-progress' | 'completed' | 'delayed';
  assignedTo?: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number;
  uploadedBy: string;
  uploadedAt: string;
}

export interface CreateProjectRequest {
  name: string;
  description: string;
  location: string;
  budget: number;
  startDate: string;
}

export const projectService = {
  async getAllProjects(): Promise<Project[]> {
    const response = await api.get<Project[]>('/projects');
    return response.data;
  },

  async getProject(id: string): Promise<Project> {
    const response = await api.get<Project>(`/projects/${id}`);
    return response.data;
  },

  async createProject(projectData: CreateProjectRequest): Promise<Project> {
    const response = await api.post<Project>('/projects', projectData);
    return response.data;
  },

  async updateProject(id: string, projectData: Partial<Project>): Promise<Project> {
    const response = await api.put<Project>(`/projects/${id}`, projectData);
    return response.data;
  },

  async deleteProject(id: string): Promise<void> {
    await api.delete(`/projects/${id}`);
  },

  async saveFloorPlan(projectId: string, floorPlanData: Partial<FloorPlan>): Promise<FloorPlan> {
    const response = await api.post<FloorPlan>(`/projects/${projectId}/floor-plan`, floorPlanData);
    return response.data;
  },

  async getFloorPlan(projectId: string): Promise<FloorPlan> {
    const response = await api.get<FloorPlan>(`/projects/${projectId}/floor-plan`);
    return response.data;
  },

  async addMaterial(projectId: string, materialData: Omit<Material, 'id'>): Promise<Material> {
    const response = await api.post<Material>(`/projects/${projectId}/materials`, materialData);
    return response.data;
  },

  async updateMaterial(projectId: string, materialId: string, materialData: Partial<Material>): Promise<Material> {
    const response = await api.put<Material>(`/projects/${projectId}/materials/${materialId}`, materialData);
    return response.data;
  },

  async deleteMaterial(projectId: string, materialId: string): Promise<void> {
    await api.delete(`/projects/${projectId}/materials/${materialId}`);
  },

  async addTimelineItem(projectId: string, timelineData: Omit<TimelineItem, 'id'>): Promise<TimelineItem> {
    const response = await api.post<TimelineItem>(`/projects/${projectId}/timeline`, timelineData);
    return response.data;
  },

  async updateTimelineItem(projectId: string, itemId: string, timelineData: Partial<TimelineItem>): Promise<TimelineItem> {
    const response = await api.put<TimelineItem>(`/projects/${projectId}/timeline/${itemId}`, timelineData);
    return response.data;
  },

  async uploadDocument(projectId: string, file: File): Promise<Document> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post<Document>(`/projects/${projectId}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async deleteDocument(projectId: string, documentId: string): Promise<void> {
    await api.delete(`/projects/${projectId}/documents/${documentId}`);
  },
};
