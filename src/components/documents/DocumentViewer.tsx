import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Chip,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { Close as CloseIcon, GetApp as DownloadIcon } from '@mui/icons-material';
import type { Document } from '../../types';

interface DocumentViewerProps {
  open: boolean;
  document: Document | null;
  onClose: () => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  open,
  document,
  onClose,
}) => {
  if (!document) return null;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const isImage = document.name.match(/\.(jpg|jpeg|png|gif)$/i);
  const isPDF = document.name.match(/\.pdf$/i);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" noWrap sx={{ flex: 1, mr: 2 }}>
            {document.name}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Uploaded: {formatDate(document.uploadedAt)}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Size: {formatFileSize(document.size)}
          </Typography>
          <Box sx={{ mt: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {document.tags.map((tag) => (
              <Chip key={tag} label={tag} size="small" />
            ))}
          </Box>
        </Box>

        {isImage && (
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <img
              src={document.fileUrl}
              alt={document.name}
              style={{ maxWidth: '100%', maxHeight: '500px' }}
            />
          </Box>
        )}

        {isPDF && (
          <Box sx={{ height: 500, border: '1px solid', borderColor: 'divider' }}>
            <iframe
              src={document.fileUrl}
              width="100%"
              height="100%"
              title={document.name}
              style={{ border: 'none' }}
            />
          </Box>
        )}

        {document.versions.length > 1 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Version History
            </Typography>
            <List dense>
              {document.versions
                .sort((a, b) => b.versionNumber - a.versionNumber)
                .map((version) => (
                  <ListItem
                    key={version.id}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        onClick={() => window.open(version.fileUrl, '_blank')}
                      >
                        <DownloadIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={`Version ${version.versionNumber}`}
                      secondary={`${formatDate(version.uploadedAt)} - by ${version.uploadedBy}`}
                    />
                  </ListItem>
                ))}
            </List>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={() => window.open(document.fileUrl, '_blank')}
        >
          Download
        </Button>
      </DialogActions>
    </Dialog>
  );
};
