import api from './api';

export interface Workspace {
  id: number;
  name: string;
  slug: string;
  plan: 'starter' | 'growth' | 'enterprise';
  isActive: boolean;
}

export interface WorkspaceMembership {
  id: number;
  role: 'owner' | 'admin' | 'auditor' | 'member';
  workspace: Workspace;
}

export interface InventoryItem {
  id: number;
  itemCode: string;
  name: string;
  category: string;
  brand?: string;
  model?: string;
  serialNumber?: string;
  quantity: number;
  unit: string;
  condition: 'new' | 'good' | 'fair' | 'damaged';
  status: 'available' | 'in-use' | 'missing' | 'repair';
  location?: string;
  description?: string;
  imageUrl?: string;
  aiConfidence?: number;
  lastAuditAt?: string;
  updatedAt: string;
}

export interface AuditEntry {
  id: number;
  itemId: number;
  expectedQuantity: number;
  countedQuantity: number;
  discrepancy: number;
}

export interface AuditSession {
  id: number;
  name: string;
  status: 'in-progress' | 'completed';
  startedAt: string;
  completedAt?: string;
  entries?: AuditEntry[];
}

interface AnalyzeImageResponse {
  analysis: {
    suggestions: {
      name: string;
      category: string;
      brand?: string;
      model?: string;
      condition: 'new' | 'good' | 'fair' | 'damaged';
      status: 'available';
    };
    confidence: number;
    requiresManualReview: boolean;
  };
}

export const inventoryAuditService = {
  async listWorkspaces(): Promise<WorkspaceMembership[]> {
    const response = await api.get<{ workspaces: WorkspaceMembership[] }>('/v1/workspaces');
    return response.data.workspaces;
  },

  async createWorkspace(name: string): Promise<Workspace> {
    const response = await api.post<{ workspace: Workspace }>('/v1/workspaces', { name });
    return response.data.workspace;
  },

  async listItems(workspaceId: number): Promise<InventoryItem[]> {
    const response = await api.get<{ items: InventoryItem[] }>(`/v1/workspaces/${workspaceId}/items`);
    return response.data.items;
  },

  async createItem(workspaceId: number, payload: Partial<InventoryItem>): Promise<InventoryItem> {
    const response = await api.post<{ item: InventoryItem }>(`/v1/workspaces/${workspaceId}/items`, payload);
    return response.data.item;
  },

  async analyzeImage(workspaceId: number, imageUrl: string, hintDescription: string): Promise<AnalyzeImageResponse['analysis']> {
    const response = await api.post<AnalyzeImageResponse>(`/v1/workspaces/${workspaceId}/ai/analyze-image`, {
      imageUrl,
      hintDescription
    });
    return response.data.analysis;
  },

  async transcribeVoice(workspaceId: number, rawText: string): Promise<{ transcription: string; confidence: number }> {
    const response = await api.post<{ transcription: string; confidence: number }>(
      `/v1/workspaces/${workspaceId}/ai/voice-transcription`,
      { rawText }
    );
    return response.data;
  },

  async listAudits(workspaceId: number): Promise<AuditSession[]> {
    const response = await api.get<{ sessions: AuditSession[] }>(`/v1/workspaces/${workspaceId}/audits`);
    return response.data.sessions;
  },

  async createAudit(workspaceId: number, name: string): Promise<AuditSession> {
    const response = await api.post<{ session: AuditSession }>(`/v1/workspaces/${workspaceId}/audits`, { name });
    return response.data.session;
  },

  async recordAuditEntry(
    workspaceId: number,
    auditId: number,
    itemId: number,
    countedQuantity: number
  ): Promise<{ discrepancy: number }> {
    const response = await api.post<{ discrepancy: number }>(
      `/v1/workspaces/${workspaceId}/audits/${auditId}/records`,
      {
        itemId,
        countedQuantity
      }
    );
    return response.data;
  },

  async completeAudit(workspaceId: number, auditId: number): Promise<void> {
    await api.put(`/v1/workspaces/${workspaceId}/audits/${auditId}/complete`);
  }
};
