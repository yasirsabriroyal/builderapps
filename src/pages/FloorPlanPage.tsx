import React, { useState, useRef } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import { FolderOpen, ViewModule } from '@mui/icons-material';
import { fabric } from 'fabric';
import { FloorPlanCanvas } from '../components/floorplan/FloorPlanCanvas';
import type { DrawingMode } from '../components/floorplan/FloorPlanCanvas';
import { FloorPlanToolbar } from '../components/floorplan/FloorPlanToolbar';
import { FloorPlanTemplates } from '../components/floorplan/FloorPlanTemplates';
import type { FloorPlanTemplate } from '../components/floorplan/FloorPlanTemplates';
import { FloorPlanDimensions } from '../components/floorplan/FloorPlanDimensions';
import { projectService } from '../services/project.service';
import type { Project } from '../services/project.service';

interface HistoryState {
  canvasState: string;
}

export const FloorPlanPage: React.FC = () => {
  const [drawingMode, setDrawingMode] = useState<DrawingMode>('select');
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);
  const [gridEnabled, setGridEnabled] = useState(true);
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [exportFormat, setExportFormat] = useState<'png' | 'json'>('png');
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  
  // History management
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyStep, setHistoryStep] = useState(-1);
  const isLoadingHistory = useRef(false);

  const saveHistory = () => {
    if (!canvas || isLoadingHistory.current) return;

    const canvasState = JSON.stringify(canvas.toJSON(['objectType', 'area']));
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push({ canvasState });
    
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (!canvas || historyStep <= 0) return;

    isLoadingHistory.current = true;
    const prevState = history[historyStep - 1];
    
    canvas.loadFromJSON(prevState.canvasState, () => {
      canvas.renderAll();
      setHistoryStep(historyStep - 1);
      isLoadingHistory.current = false;
    });
  };

  const handleRedo = () => {
    if (!canvas || historyStep >= history.length - 1) return;

    isLoadingHistory.current = true;
    const nextState = history[historyStep + 1];
    
    canvas.loadFromJSON(nextState.canvasState, () => {
      canvas.renderAll();
      setHistoryStep(historyStep + 1);
      isLoadingHistory.current = false;
    });
  };

  const handleCanvasReady = (fabricCanvas: fabric.Canvas) => {
    setCanvas(fabricCanvas);
    // Initialize history
    const initialState = JSON.stringify(fabricCanvas.toJSON(['objectType', 'area']));
    setHistory([{ canvasState: initialState }]);
    setHistoryStep(0);
  };

  const handleDelete = () => {
    if (!canvas) return;
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      canvas.remove(activeObject);
      canvas.requestRenderAll();
      saveHistory();
    }
  };

  const handleZoomIn = () => {
    if (!canvas) return;
    const zoom = canvas.getZoom();
    canvas.setZoom(zoom * 1.1);
    canvas.requestRenderAll();
  };

  const handleZoomOut = () => {
    if (!canvas) return;
    const zoom = canvas.getZoom();
    canvas.setZoom(zoom * 0.9);
    canvas.requestRenderAll();
  };

  const handleToggleGrid = () => {
    setGridEnabled(!gridEnabled);
    if (!canvas) return;
    
    canvas.forEachObject((obj: any) => {
      if (obj.type === 'grid') {
        obj.visible = !gridEnabled;
      }
    });
    canvas.requestRenderAll();
  };

  const handleClear = () => {
    if (!canvas) return;
    if (window.confirm('Are you sure you want to clear the canvas? This cannot be undone.')) {
      const objects = canvas.getObjects().filter((obj: any) => obj.type !== 'grid');
      objects.forEach((obj) => canvas.remove(obj));
      canvas.requestRenderAll();
      saveHistory();
    }
  };

  const handleSave = async () => {
    if (!canvas) return;

    const canvasData = JSON.stringify(canvas.toJSON(['objectType', 'area']));
    
    // Calculate dimensions
    interface RoomData {
      id: string;
      name: string;
      area: number;
      coordinates: Array<{ x: number; y: number }>;
    }
    
    const rooms: RoomData[] = [];
    canvas.forEachObject((obj) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fabricObj = obj as any;
      if (fabricObj.objectType === 'room' && fabricObj.type === 'rect') {
        const area = fabricObj.area || 0;
        rooms.push({
          id: fabricObj.id || `room-${Date.now()}`,
          name: 'Room',
          area,
          coordinates: [
            { x: fabricObj.left, y: fabricObj.top },
            { x: fabricObj.left + fabricObj.width, y: fabricObj.top },
            { x: fabricObj.left + fabricObj.width, y: fabricObj.top + fabricObj.height },
            { x: fabricObj.left, y: fabricObj.top + fabricObj.height },
          ],
        });
      }
    });

    if (selectedProjectId) {
      // Save to existing project
      try {
        setLoading(true);
        await projectService.saveFloorPlan(selectedProjectId, {
          canvasData,
          dimensions: {
            width: canvas.getWidth(),
            height: canvas.getHeight(),
          },
          rooms,
        });
        setSnackbar({ open: true, message: 'Floor plan saved successfully!', severity: 'success' });
      } catch {
        setSnackbar({ open: true, message: 'Failed to save floor plan', severity: 'error' });
      } finally {
        setLoading(false);
      }
    } else {
      // Show save dialog to create new project
      setSaveDialogOpen(true);
    }
  };

  const handleSaveNewProject = async () => {
    if (!canvas || !projectName) return;

    try {
      setLoading(true);
      const canvasData = JSON.stringify(canvas.toJSON(['objectType', 'area']));
      
      interface RoomData {
        id: string;
        name: string;
        area: number;
        coordinates: Array<{ x: number; y: number }>;
      }
      
      const rooms: RoomData[] = [];
      canvas.forEachObject((obj) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const fabricObj = obj as any;
        if (fabricObj.objectType === 'room' && fabricObj.type === 'rect') {
          rooms.push({
            id: fabricObj.id || `room-${Date.now()}`,
            name: 'Room',
            area: fabricObj.area || 0,
            coordinates: [
              { x: fabricObj.left, y: fabricObj.top },
              { x: fabricObj.left + fabricObj.width, y: fabricObj.top },
              { x: fabricObj.left + fabricObj.width, y: fabricObj.top + fabricObj.height },
              { x: fabricObj.left, y: fabricObj.top + fabricObj.height },
            ],
          });
        }
      });

      const project = await projectService.createProject({
        name: projectName,
        description: 'Created from Floor Plan Designer',
        location: '',
        budget: 0,
        startDate: new Date().toISOString(),
      });

      await projectService.saveFloorPlan(project.id, {
        canvasData,
        dimensions: {
          width: canvas.getWidth(),
          height: canvas.getHeight(),
        },
        rooms,
      });

      setSelectedProjectId(project.id);
      setSaveDialogOpen(false);
      setProjectName('');
      setSnackbar({ open: true, message: 'Project created and floor plan saved!', severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: 'Failed to create project', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleLoadProjects = async () => {
    try {
      setLoading(true);
      const projectList = await projectService.getAllProjects();
      setProjects(projectList);
      setLoadDialogOpen(true);
    } catch {
      setSnackbar({ open: true, message: 'Failed to load projects', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleLoadProject = async () => {
    if (!canvas || !selectedProjectId) return;

    try {
      setLoading(true);
      const floorPlan = await projectService.getFloorPlan(selectedProjectId);
      
      if (floorPlan.canvasData) {
        canvas.loadFromJSON(JSON.parse(floorPlan.canvasData), () => {
          canvas.requestRenderAll();
          saveHistory();
          setLoadDialogOpen(false);
          setSnackbar({ open: true, message: 'Floor plan loaded successfully!', severity: 'success' });
        });
      }
    } catch {
      setSnackbar({ open: true, message: 'Failed to load floor plan', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    setExportDialogOpen(true);
  };

  const handleExportConfirm = () => {
    if (!canvas) return;

    if (exportFormat === 'png') {
      const dataURL = canvas.toDataURL({
        format: 'png',
        quality: 1,
        multiplier: 2,
      });

      const link = document.createElement('a');
      link.download = `floor-plan-${Date.now()}.png`;
      link.href = dataURL;
      link.click();
      
      setSnackbar({ open: true, message: 'Floor plan exported as PNG!', severity: 'success' });
    } else if (exportFormat === 'json') {
      const json = JSON.stringify(canvas.toJSON(['objectType', 'area']), null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.download = `floor-plan-${Date.now()}.json`;
      link.href = url;
      link.click();
      
      URL.revokeObjectURL(url);
      setSnackbar({ open: true, message: 'Floor plan exported as JSON!', severity: 'success' });
    }

    setExportDialogOpen(false);
  };

  const handleSelectTemplate = (template: FloorPlanTemplate) => {
    if (!canvas || !template.canvasData) return;

    canvas.loadFromJSON(template.canvasData, () => {
      canvas.requestRenderAll();
      saveHistory();
    });
  };

  // Calculate dimension info
  const getDimensionInfo = () => {
    if (!canvas) return undefined;

    interface RoomInfo {
      id: string;
      name: string;
      area: number;
    }

    const rooms: RoomInfo[] = [];
    let totalArea = 0;

    canvas.forEachObject((obj) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fabricObj = obj as any;
      if (fabricObj.objectType === 'room' && fabricObj.type === 'rect' && fabricObj.area) {
        const area = fabricObj.area;
        totalArea += area;
        rooms.push({
          id: fabricObj.id || `room-${rooms.length}`,
          name: `Room ${rooms.length + 1}`,
          area,
        });
      }
    });

    return { totalArea, rooms };
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">
            Floor Plan Designer
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<ViewModule />}
              onClick={() => setTemplatesOpen(true)}
            >
              Templates
            </Button>
            <Button
              variant="outlined"
              startIcon={<FolderOpen />}
              onClick={handleLoadProjects}
            >
              Load Project
            </Button>
          </Box>
        </Box>

        <FloorPlanToolbar
          drawingMode={drawingMode}
          onDrawingModeChange={setDrawingMode}
          onDelete={handleDelete}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onToggleGrid={handleToggleGrid}
          onClear={handleClear}
          onSave={handleSave}
          onExport={handleExport}
          canUndo={historyStep > 0}
          canRedo={historyStep < history.length - 1}
          gridEnabled={gridEnabled}
        />

        <Grid container spacing={2}>
          <Grid item xs={12} md={9}>
            <FloorPlanCanvas
              onCanvasReady={handleCanvasReady}
              drawingMode={drawingMode}
              snapToGrid={gridEnabled}
              onObjectSelected={setSelectedObject}
              onCanvasModified={saveHistory}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FloorPlanDimensions
              selectedObject={selectedObject || undefined}
              dimensionInfo={getDimensionInfo()}
            />
          </Grid>
        </Grid>

        {/* Templates Dialog */}
        <FloorPlanTemplates
          open={templatesOpen}
          onClose={() => setTemplatesOpen(false)}
          onSelectTemplate={handleSelectTemplate}
        />

        {/* Save Dialog */}
        <Dialog open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)}>
          <DialogTitle>Save Floor Plan</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Project Name"
              fullWidth
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSaveDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveNewProject} variant="contained" disabled={!projectName || loading}>
              {loading ? <CircularProgress size={24} /> : 'Save'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Load Dialog */}
        <Dialog open={loadDialogOpen} onClose={() => setLoadDialogOpen(false)}>
          <DialogTitle>Load Floor Plan</DialogTitle>
          <DialogContent>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Select Project</InputLabel>
              <Select
                value={selectedProjectId}
                label="Select Project"
                onChange={(e) => setSelectedProjectId(e.target.value)}
              >
                {projects.map((project) => (
                  <MenuItem key={project.id} value={project.id}>
                    {project.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setLoadDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleLoadProject} variant="contained" disabled={!selectedProjectId || loading}>
              {loading ? <CircularProgress size={24} /> : 'Load'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Export Dialog */}
        <Dialog open={exportDialogOpen} onClose={() => setExportDialogOpen(false)}>
          <DialogTitle>Export Floor Plan</DialogTitle>
          <DialogContent>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Export Format</InputLabel>
              <Select
                value={exportFormat}
                label="Export Format"
                onChange={(e) => setExportFormat(e.target.value as 'png' | 'json')}
              >
                <MenuItem value="png">PNG Image</MenuItem>
                <MenuItem value="json">JSON Data</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setExportDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleExportConfirm} variant="contained">
              Export
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};
