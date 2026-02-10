// Budget ranges
export type BudgetRange = '200-300' | '300-400' | '400-500' | '500+';

// Home types
export type HomeType = 'single-family' | 'duplex' | 'townhouse' | 'custom';

// Landscaping packages
export type LandscapingPackage = 'basic' | 'premium' | 'luxury';

// Finish levels
export type FinishLevel = 'standard' | 'premium' | 'luxury';

// Design packages
export type DesignPackage = 'modern' | 'traditional' | 'farmhouse' | 'contemporary';

// Room types for customization
export type RoomType = 'kitchen' | 'bathrooms' | 'living' | 'bedrooms';

// Material types
export interface MaterialOption {
  id: string;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
}

// Stage 1 selections
export interface Stage1Selections {
  budgetRange: BudgetRange | null;
  homeType: HomeType | null;
  bedrooms: number;
  bathrooms: number;
  additionalRooms: string[];
}

// Stage 2 selections
export interface Stage2Selections {
  finishedBasement: boolean;
  landscapingPackage: LandscapingPackage;
  finishLevel: FinishLevel;
  garage: string | null;
  deckPatio: boolean;
  smartHome: boolean;
  energyEfficiency: boolean;
}

// Stage 3 room customizations
export interface RoomCustomization {
  kitchen: {
    countertops: string;
    cabinetry: string;
    flooring: string;
    appliances: string;
    backsplash: string;
  };
  bathrooms: {
    vanity: string;
    countertop: string;
    flooring: string;
    showerTub: string;
    fixtures: string;
  };
  living: {
    flooring: string;
    paint: string;
    trim: string;
    lighting: string;
  };
  bedrooms: {
    flooring: string;
    paint: string;
    closet: string;
  };
}

// Stage 3 selections
export interface Stage3Selections {
  designPackage: DesignPackage | null;
  customizations: RoomCustomization;
  isCustomized: boolean;
}

// Complete application state
export interface AppState {
  currentStage: number;
  stage1: Stage1Selections;
  stage2: Stage2Selections;
  stage3: Stage3Selections;
  totalPrice: number;
}

// Price breakdown
export interface PriceBreakdown {
  basePrice: number;
  stage1Additions: number;
  stage2Additions: number;
  stage3Additions: number;
  total: number;
}

// Option card interface
export interface OptionCard {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  features?: string[];
}

// Budget types
export type BudgetCategory = 'materials' | 'labor' | 'permits' | 'contingency';

export interface BudgetLineItem {
  id: string;
  category: BudgetCategory;
  description: string;
  estimatedCost: number;
  actualCost: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentMilestone {
  id: string;
  name: string;
  amount: number;
  dueDate: Date;
  isPaid: boolean;
  paidDate?: Date;
  notes?: string;
}

export interface BudgetSummary {
  totalBudget: number;
  totalActual: number;
  percentSpent: number;
  categoryBreakdown: {
    category: BudgetCategory;
    estimated: number;
    actual: number;
  }[];
}

// Timeline types
export type MilestoneStatus = 'not-started' | 'in-progress' | 'completed' | 'delayed';

export interface Milestone {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: MilestoneStatus;
  progress: number;
  photos: MilestonePhoto[];
}

export interface MilestonePhoto {
  id: string;
  url: string;
  caption: string;
  uploadedAt: Date;
  milestoneId: string;
}

// Document types
export type DocumentCategory = 'contracts' | 'blueprints' | 'permits' | 'warranties' | 'other';

export interface Document {
  id: string;
  name: string;
  category: DocumentCategory;
  fileUrl: string;
  size: number;
  uploadedAt: Date;
  tags: string[];
  versions: DocumentVersion[];
}

export interface DocumentVersion {
  id: string;
  versionNumber: number;
  fileUrl: string;
  uploadedAt: Date;
  uploadedBy: string;
}

// Collaboration types
export type UserRole = 'client' | 'builder' | 'designer' | 'architect';
export type TaskPriority = 'high' | 'medium' | 'low';
export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  message: string;
  timestamp: Date;
  isOnline: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  assigneeId?: string;
  assigneeName?: string;
  dueDate?: Date;
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: Date;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  isOnline: boolean;
  phone?: string;
}

export interface ActivityNotification {
  id: string;
  type: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  userId: string;
}
