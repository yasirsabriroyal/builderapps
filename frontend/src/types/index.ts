export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'client' | 'designer' | 'builder' | 'admin';
  phone?: string;
  avatarUrl?: string;
}

export interface Project {
  id: string;
  ownerId: string;
  projectName: string;
  projectType: 'new_construction' | 'renovation' | 'addition' | 'remodel';
  address?: string;
  lotSizeSqft?: number;
  budgetMin?: number;
  budgetMax?: number;
  status: 'design' | 'planning' | 'permitting' | 'construction' | 'completed' | 'on_hold';
  startDate?: string;
  estimatedCompletionDate?: string;
  description?: string;
  thumbnailUrl?: string;
  createdAt: string;
  updatedAt: string;
  owner?: User;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
}

export interface ApiError {
  success: false;
  error: {
    message: string;
  };
}
