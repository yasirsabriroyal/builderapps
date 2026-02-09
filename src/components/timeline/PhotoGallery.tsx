import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  IconButton,
  Box,
  Typography,
  TextField,
} from '@mui/material';
import {
  Close as CloseIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import type { MilestonePhoto } from '../../types';

interface PhotoGalleryProps {
  open: boolean;
  photos: MilestonePhoto[];
  onClose: () => void;
  onUpload: (files: FileList, caption: string) => void;
  onDelete: (photoId: string) => void;
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({
  open,
  photos,
  onClose,
  onUpload,
  onDelete,
}) => {
  const [selectedFile, setSelectedFile] = useState<FileList | null>(null);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFile(e.target.files);
    }
  };

  const handleUpload = async () => {
    if (selectedFile) {
      setUploading(true);
      await onUpload(selectedFile, caption);
      setSelectedFile(null);
      setCaption('');
      setUploading(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Milestone Photos</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Upload New Photos
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
            <Button variant="outlined" component="label" startIcon={<AddIcon />}>
              Select Files
              <input
                type="file"
                hidden
                multiple
                accept="image/*"
                onChange={handleFileSelect}
              />
            </Button>
            {selectedFile && (
              <>
                <TextField
                  size="small"
                  label="Caption"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  sx={{ flex: 1 }}
                />
                <Button
                  variant="contained"
                  onClick={handleUpload}
                  disabled={uploading}
                >
                  Upload {selectedFile.length} file{selectedFile.length !== 1 ? 's' : ''}
                </Button>
              </>
            )}
          </Box>
        </Box>

        {photos.length > 0 ? (
          <ImageList cols={3} gap={8}>
            {photos.map((photo) => (
              <ImageListItem key={photo.id}>
                <img
                  src={photo.url}
                  alt={photo.caption}
                  loading="lazy"
                  style={{ height: 200, objectFit: 'cover' }}
                />
                <ImageListItemBar
                  title={photo.caption}
                  subtitle={formatDate(photo.uploadedAt)}
                  actionIcon={
                    <IconButton
                      sx={{ color: 'rgba(255, 255, 255, 0.8)' }}
                      onClick={() => onDelete(photo.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                />
              </ImageListItem>
            ))}
          </ImageList>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              No photos uploaded yet
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
