import React, { useCallback } from 'react';
import { Box, Typography, Paper, LinearProgress } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';

interface DocumentUploadProps {
  onUpload: (files: File[]) => void;
  uploading?: boolean;
  uploadProgress?: number;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  onUpload,
  uploading = false,
  uploadProgress = 0,
}) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onUpload(acceptedFiles);
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
  });

  return (
    <Paper
      {...getRootProps()}
      elevation={0}
      sx={{
        border: '2px dashed',
        borderColor: isDragActive ? 'primary.main' : 'divider',
        backgroundColor: isDragActive ? 'action.hover' : 'background.paper',
        p: 4,
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s',
        '&:hover': {
          borderColor: 'primary.main',
          backgroundColor: 'action.hover',
        },
      }}
    >
      <input {...getInputProps()} />
      <CloudUploadIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
      <Typography variant="h6" gutterBottom>
        {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        or click to select files
      </Typography>
      <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
        Supported: PDF, Images, Word documents
      </Typography>

      {uploading && (
        <Box sx={{ mt: 3, maxWidth: 400, mx: 'auto' }}>
          <LinearProgress variant="determinate" value={uploadProgress} />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
            Uploading... {uploadProgress}%
          </Typography>
        </Box>
      )}
    </Paper>
  );
};
