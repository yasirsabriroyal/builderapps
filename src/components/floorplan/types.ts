import { fabric } from 'fabric';

// Extended Fabric object types with custom properties
export interface CustomFabricObject extends fabric.Object {
  objectType?: 'wall' | 'room' | 'door' | 'window' | 'text' | 'grid';
  area?: number;
  id?: string;
}

export interface CustomFabricRect extends fabric.Rect {
  objectType?: 'room';
  area?: number;
  id?: string;
}

export interface CustomFabricLine extends fabric.Line {
  objectType?: 'wall';
  id?: string;
}

export interface CustomFabricText extends fabric.IText {
  objectType?: 'text';
  id?: string;
}

// Type guard functions
export const isGridObject = (obj: fabric.Object): boolean => {
  const customObj = obj as CustomFabricObject;
  return customObj.objectType === 'grid' || customObj.type === 'grid';
};

export const isRoomObject = (obj: fabric.Object): obj is CustomFabricRect => {
  const customObj = obj as CustomFabricObject;
  return customObj.objectType === 'room' && obj.type === 'rect';
};

export const isWallObject = (obj: fabric.Object): obj is CustomFabricLine => {
  const customObj = obj as CustomFabricObject;
  return customObj.objectType === 'wall' && obj.type === 'line';
};
