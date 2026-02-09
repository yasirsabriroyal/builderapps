import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Typography,
} from '@mui/material';

export interface FloorPlanTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  canvasData: Record<string, unknown> | null;
}

const templates: FloorPlanTemplate[] = [
  {
    id: 'blank',
    name: 'Blank Canvas',
    description: 'Start from scratch',
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5CbGFuazwvdGV4dD48L3N2Zz4=',
    canvasData: null,
  },
  {
    id: 'studio',
    name: 'Studio Apartment',
    description: 'Simple studio layout (500 sq ft)',
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI2VlZiIvPjxyZWN0IHg9IjIwIiB5PSIyMCIgd2lkdGg9IjE2MCIgaGVpZ2h0PSIxMTAiIGZpbGw9IiNkZGYiIHN0cm9rZT0iIzAwNiIgc3Ryb2tlLXdpZHRoPSIyIi8+PHRleHQgeD0iMTAwIiB5PSI3NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjMDA2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5TdHVkaW88L3RleHQ+PC9zdmc+',
    canvasData: {
      objects: [
        {
          type: 'rect',
          left: 100,
          top: 100,
          width: 400,
          height: 300,
          fill: 'rgba(200, 220, 240, 0.5)',
          stroke: '#0066cc',
          strokeWidth: 2,
        },
      ],
    },
  },
  {
    id: 'two-bedroom',
    name: '2-Bedroom House',
    description: 'Two bedroom layout (1000 sq ft)',
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI2VlZiIvPjxyZWN0IHg9IjEwIiB5PSIxMCIgd2lkdGg9IjgwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjZGRmIiBzdHJva2U9IiMwMDYiIHN0cm9rZS13aWR0aD0iMSIvPjxyZWN0IHg9IjExMCIgeT0iMTAiIHdpZHRoPSI4MCIgaGVpZ2h0PSI2MCIgZmlsbD0iI2RkZiIgc3Ryb2tlPSIjMDA2IiBzdHJva2Utd2lkdGg9IjEiLz48cmVjdCB4PSIxMCIgeT0iODAiIHdpZHRoPSIxODAiIGhlaWdodD0iNjAiIGZpbGw9IiNkZGYiIHN0cm9rZT0iIzAwNiIgc3Ryb2tlLXdpZHRoPSIxIi8+PHRleHQgeD0iMTAwIiB5PSI3NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiBmaWxsPSIjMDA2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj4yLUJlZHJvb208L3RleHQ+PC9zdmc+',
    canvasData: {
      objects: [
        {
          type: 'rect',
          left: 100,
          top: 100,
          width: 200,
          height: 150,
          fill: 'rgba(200, 220, 240, 0.5)',
          stroke: '#0066cc',
          strokeWidth: 2,
        },
        {
          type: 'rect',
          left: 320,
          top: 100,
          width: 200,
          height: 150,
          fill: 'rgba(200, 220, 240, 0.5)',
          stroke: '#0066cc',
          strokeWidth: 2,
        },
        {
          type: 'rect',
          left: 100,
          top: 270,
          width: 420,
          height: 200,
          fill: 'rgba(200, 220, 240, 0.5)',
          stroke: '#0066cc',
          strokeWidth: 2,
        },
      ],
    },
  },
  {
    id: 'office',
    name: 'Small Office',
    description: 'Office space layout (800 sq ft)',
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI2VlZiIvPjxyZWN0IHg9IjE0IiB5PSIxNCIgd2lkdGg9IjE3MCIgaGVpZ2h0PSI0MCIgZmlsbD0iI2RkZiIgc3Ryb2tlPSIjMDA2IiBzdHJva2Utd2lkdGg9IjEiLz48cmVjdCB4PSIxNCIgeT0iNjQiIHdpZHRoPSI4MCIgaGVpZ2h0PSI3MCIgZmlsbD0iI2RkZiIgc3Ryb2tlPSIjMDA2IiBzdHJva2Utd2lkdGg9IjEiLz48cmVjdCB4PSIxMDQiIHk9IjY0IiB3aWR0aD0iODAiIGhlaWdodD0iNzAiIGZpbGw9IiNkZGYiIHN0cm9rZT0iIzAwNiIgc3Ryb2tlLXdpZHRoPSIxIi8+PHRleHQgeD0iMTAwIiB5PSI3NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiBmaWxsPSIjMDA2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5PZmZpY2U8L3RleHQ+PC9zdmc+',
    canvasData: {
      objects: [
        {
          type: 'rect',
          left: 100,
          top: 100,
          width: 500,
          height: 120,
          fill: 'rgba(200, 220, 240, 0.5)',
          stroke: '#0066cc',
          strokeWidth: 2,
        },
        {
          type: 'rect',
          left: 100,
          top: 240,
          width: 240,
          height: 200,
          fill: 'rgba(200, 220, 240, 0.5)',
          stroke: '#0066cc',
          strokeWidth: 2,
        },
        {
          type: 'rect',
          left: 360,
          top: 240,
          width: 240,
          height: 200,
          fill: 'rgba(200, 220, 240, 0.5)',
          stroke: '#0066cc',
          strokeWidth: 2,
        },
      ],
    },
  },
];

interface FloorPlanTemplatesProps {
  open: boolean;
  onClose: () => void;
  onSelectTemplate: (template: FloorPlanTemplate) => void;
}

export const FloorPlanTemplates: React.FC<FloorPlanTemplatesProps> = ({
  open,
  onClose,
  onSelectTemplate,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<FloorPlanTemplate | null>(null);

  const handleSelectTemplate = (template: FloorPlanTemplate) => {
    setSelectedTemplate(template);
  };

  const handleConfirm = () => {
    if (selectedTemplate) {
      onSelectTemplate(selectedTemplate);
      onClose();
      setSelectedTemplate(null);
    }
  };

  const handleClose = () => {
    setSelectedTemplate(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Choose a Template</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {templates.map((template) => (
            <Grid item xs={12} sm={6} md={4} key={template.id}>
              <Card
                sx={{
                  border: selectedTemplate?.id === template.id ? 2 : 0,
                  borderColor: 'primary.main',
                }}
              >
                <CardActionArea onClick={() => handleSelectTemplate(template)}>
                  <CardMedia
                    component="img"
                    height="150"
                    image={template.thumbnail}
                    alt={template.name}
                    sx={{ backgroundColor: '#f5f5f5' }}
                  />
                  <CardContent>
                    <Typography variant="h6" component="div" gutterBottom>
                      {template.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {template.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={!selectedTemplate}
        >
          Use Template
        </Button>
      </DialogActions>
    </Dialog>
  );
};
