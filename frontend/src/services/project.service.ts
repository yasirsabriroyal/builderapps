import api from './api';
import { Project } from '../types';

export const projectService = {
  async getProjects(params?: { status?: string; page?: number; limit?: number }): Promise<any> {
    const response = await api.get('/projects', { params });
    return response.data;
  },

  async getProject(id: string): Promise<{ success: boolean; data: Project }> {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  async createProject(data: Partial<Project>): Promise<{ success: boolean; data: Project }> {
    const response = await api.post('/projects', data);
    return response.data;
  },

  async updateProject(id: string, data: Partial<Project>): Promise<{ success: boolean; data: Project }> {
    const response = await api.patch(`/projects/${id}`, data);
    return response.data;
  },

  async deleteProject(id: string): Promise<{ success: boolean; message: string }> {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  }
};
