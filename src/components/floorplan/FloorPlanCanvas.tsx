import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { Box, CircularProgress } from '@mui/material';
import type { CustomFabricObject } from './types';
import { isGridObject } from './types';

export type DrawingMode = 'select' | 'wall' | 'room' | 'door' | 'window' | 'text';

interface FloorPlanCanvasProps {
  onCanvasReady?: (canvas: fabric.Canvas) => void;
  drawingMode: DrawingMode;
  gridSize?: number;
  snapToGrid?: boolean;
  onObjectSelected?: (obj: fabric.Object | null) => void;
  onCanvasModified?: () => void;
}

export const FloorPlanCanvas: React.FC<FloorPlanCanvasProps> = ({
  onCanvasReady,
  drawingMode,
  gridSize = 20,
  snapToGrid = true,
  onObjectSelected,
  onCanvasModified,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isDrawingRef = useRef(false);
  const drawStartRef = useRef<{ x: number; y: number } | null>(null);
  const tempObjectRef = useRef<fabric.Object | null>(null);

  const snapToGridValue = (value: number) => {
    if (!snapToGrid) return value;
    return Math.round(value / gridSize) * gridSize;
  };

  const drawGrid = (canvas: fabric.Canvas) => {
    const width = canvas.getWidth();
    const height = canvas.getHeight();

    for (let i = 0; i < width / gridSize; i++) {
      const line = new fabric.Line([i * gridSize, 0, i * gridSize, height], {
        stroke: '#e0e0e0',
        strokeWidth: 1,
        selectable: false,
        evented: false,
      }) as CustomFabricObject;
      line.objectType = 'grid';
      canvas.add(line);
    }

    for (let i = 0; i < height / gridSize; i++) {
      const line = new fabric.Line([0, i * gridSize, width, i * gridSize], {
        stroke: '#e0e0e0',
        strokeWidth: 1,
        selectable: false,
        evented: false,
      }) as CustomFabricObject;
      line.objectType = 'grid';
      canvas.add(line);
    }
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 1000,
      height: 700,
      backgroundColor: '#ffffff',
      selection: drawingMode === 'select',
    });

    fabricCanvasRef.current = canvas;
    drawGrid(canvas);
    
    // Defer state update to avoid synchronous setState in effect
    Promise.resolve().then(() => setIsLoading(false));

    if (onCanvasReady) {
      onCanvasReady(canvas);
    }

    // Object modification events
    canvas.on('object:modified', () => {
      if (onCanvasModified) onCanvasModified();
    });

    canvas.on('object:added', () => {
      if (onCanvasModified) onCanvasModified();
    });

    canvas.on('object:removed', () => {
      if (onCanvasModified) onCanvasModified();
    });

    canvas.on('selection:created', (e) => {
      if (onObjectSelected && e.selected) {
        onObjectSelected(e.selected[0]);
      }
    });

    canvas.on('selection:updated', (e) => {
      if (onObjectSelected && e.selected) {
        onObjectSelected(e.selected[0]);
      }
    });

    canvas.on('selection:cleared', () => {
      if (onObjectSelected) onObjectSelected(null);
    });

    return () => {
      canvas.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    // Update canvas selection mode
    canvas.selection = drawingMode === 'select';
    
    // Make all objects selectable or not based on mode
    canvas.forEachObject((obj) => {
      if (!isGridObject(obj)) {
        obj.selectable = drawingMode === 'select';
        obj.evented = drawingMode === 'select';
      }
    });

    canvas.requestRenderAll();

    // Mouse event handlers for drawing
    const handleMouseDown = (e: fabric.IEvent) => {
      if (drawingMode === 'select' || !e.pointer) return;

      isDrawingRef.current = true;
      const pointer = e.pointer;
      drawStartRef.current = {
        x: snapToGridValue(pointer.x),
        y: snapToGridValue(pointer.y),
      };

      if (drawingMode === 'text') {
        const text = new fabric.IText('Room Name', {
          left: drawStartRef.current.x,
          top: drawStartRef.current.y,
          fontSize: 16,
          fill: '#000000',
          fontFamily: 'Arial',
        });
        canvas.add(text);
        canvas.setActiveObject(text);
        text.enterEditing();
        isDrawingRef.current = false;
      }
    };

    const handleMouseMove = (e: fabric.IEvent) => {
      if (!isDrawingRef.current || !drawStartRef.current || !e.pointer) return;

      const pointer = e.pointer;
      const currentX = snapToGridValue(pointer.x);
      const currentY = snapToGridValue(pointer.y);

      // Remove temporary object
      if (tempObjectRef.current) {
        canvas.remove(tempObjectRef.current);
      }

      let tempObject: fabric.Object | null = null;

      switch (drawingMode) {
        case 'wall': {
          tempObject = new fabric.Line(
            [drawStartRef.current.x, drawStartRef.current.y, currentX, currentY],
            {
              stroke: '#000000',
              strokeWidth: 6,
              selectable: false,
            }
          );
          break;
        }

        case 'room': {
          const width = currentX - drawStartRef.current.x;
          const height = currentY - drawStartRef.current.y;
          tempObject = new fabric.Rect({
            left: drawStartRef.current.x,
            top: drawStartRef.current.y,
            width: Math.abs(width),
            height: Math.abs(height),
            fill: 'rgba(200, 220, 240, 0.5)',
            stroke: '#0066cc',
            strokeWidth: 2,
            selectable: false,
          });
          break;
        }

        case 'door': {
          const doorWidth = currentX - drawStartRef.current.x;
          tempObject = new fabric.Group(
            [
              new fabric.Rect({
                width: Math.abs(doorWidth),
                height: 10,
                fill: '#8B4513',
              }),
              new fabric.Line([0, 5, Math.abs(doorWidth), 5], {
                stroke: '#654321',
                strokeWidth: 2,
              }),
            ],
            {
              left: drawStartRef.current.x,
              top: drawStartRef.current.y,
              selectable: false,
            }
          );
          break;
        }

        case 'window': {
          const windowWidth = currentX - drawStartRef.current.x;
          tempObject = new fabric.Rect({
            left: drawStartRef.current.x,
            top: drawStartRef.current.y,
            width: Math.abs(windowWidth),
            height: 8,
            fill: '#87CEEB',
            stroke: '#4682B4',
            strokeWidth: 2,
            selectable: false,
          });
          break;
        }
      }

      if (tempObject) {
        tempObjectRef.current = tempObject;
        canvas.add(tempObject);
        canvas.requestRenderAll();
      }
    };

    const handleMouseUp = () => {
      if (!isDrawingRef.current) return;

      isDrawingRef.current = false;
      
      if (tempObjectRef.current) {
        // Make the final object selectable
        tempObjectRef.current.selectable = true;
        tempObjectRef.current.evented = true;
        
        // Add metadata
        const obj = tempObjectRef.current as CustomFabricObject;
        if (drawingMode !== 'select') {
          obj.objectType = drawingMode;
        }
        
        // Calculate area for rooms
        if (drawingMode === 'room' && obj.objectType === 'room') {
          const rect = obj as fabric.Rect & { area?: number; left?: number; top?: number; width?: number; height?: number; scaleX?: number; scaleY?: number };
          const width = (rect.width || 0) * (rect.scaleX || 1);
          const height = (rect.height || 0) * (rect.scaleY || 1);
          const areaInPixels = width * height;
          const areaInSqFt = (areaInPixels / (gridSize * gridSize)) * 9; // Assuming 1 grid = 3ft x 3ft
          rect.area = Math.round(areaInSqFt);
          
          // Add area label
          const label = new fabric.Text(`${rect.area} sq ft`, {
            left: (rect.left || 0) + width / 2,
            top: (rect.top || 0) + height / 2,
            fontSize: 14,
            fill: '#0066cc',
            originX: 'center',
            originY: 'center',
            selectable: false,
            evented: false,
          });
          canvas.add(label);
        }
        
        tempObjectRef.current = null;
      }

      drawStartRef.current = null;
      canvas.requestRenderAll();
    };

    canvas.on('mouse:down', handleMouseDown);
    canvas.on('mouse:move', handleMouseMove);
    canvas.on('mouse:up', handleMouseUp);

    return () => {
      canvas.off('mouse:down', handleMouseDown);
      canvas.off('mouse:move', handleMouseMove);
      canvas.off('mouse:up', handleMouseUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drawingMode, snapToGrid, gridSize]);

  return (
    <Box
      sx={{
        position: 'relative',
        border: '1px solid #ddd',
        borderRadius: 1,
        overflow: 'hidden',
        backgroundColor: '#f5f5f5',
      }}
    >
      {isLoading && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
          }}
        >
          <CircularProgress />
        </Box>
      )}
      <canvas ref={canvasRef} />
    </Box>
  );
};
