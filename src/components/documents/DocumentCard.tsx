import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Chip,
  Box,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Description as DescriptionIcon,
  PictureAsPdf as PdfIcon,
  Image as ImageIcon,
  MoreVert as MoreVertIcon,
  GetApp as DownloadIcon,
  Share as ShareIcon,
} from '@mui/icons-material';
import type { Document } from '../../types';

interface DocumentCardProps {
  document: Document;
  onDownload: (id: string) => void;
  onDelete: (id: string) => void;
  onShare: (id: string) => void;
  onView: (document: Document) => void;
}

const getFileIcon = (filename: string) => {
  const ext = filename.split('.').pop()?.toLowerCase();
  if (ext === 'pdf') return <PdfIcon sx={{ fontSize: 48, color: '#d32f2f' }} />;
  if (['jpg', 'jpeg', 'png', 'gif'].includes(ext || ''))
    return <ImageIcon sx={{ fontSize: 48, color: '#1976d2' }} />;
  return <DescriptionIcon sx={{ fontSize: 48, color: '#757575' }} />;
};

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

const CATEGORY_LABELS = {
  contracts: 'Contract',
  blueprints: 'Blueprint',
  permits: 'Permit',
  warranties: 'Warranty',
  other: 'Other',
};

const CATEGORY_COLORS: Record<Document['category'], 'primary' | 'secondary' | 'success' | 'warning' | 'default'> = {
  contracts: 'primary',
  blueprints: 'secondary',
  permits: 'warning',
  warranties: 'success',
  other: 'default',
};

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onDownload,
  onDelete,
  onShare,
  onView,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <>
      <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardContent
          sx={{ flex: 1, cursor: 'pointer' }}
          onClick={() => onView(document)}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            {getFileIcon(document.name)}
          </Box>
          <Typography variant="subtitle2" noWrap title={document.name}>
            {document.name}
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5, mt: 1, mb: 1, flexWrap: 'wrap' }}>
            <Chip
              label={CATEGORY_LABELS[document.category]}
              size="small"
              color={CATEGORY_COLORS[document.category]}
            />
            {document.versions.length > 1 && (
              <Chip label={`v${document.versions.length}`} size="small" variant="outlined" />
            )}
          </Box>
          <Typography variant="caption" color="text.secondary" display="block">
            {formatFileSize(document.size)}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            {formatDate(document.uploadedAt)}
          </Typography>
        </CardContent>
        <CardActions sx={{ justifyContent: 'space-between' }}>
          <Box>
            <IconButton size="small" onClick={() => onDownload(document.id)} title="Download">
              <DownloadIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={() => onShare(document.id)} title="Share">
              <ShareIcon fontSize="small" />
            </IconButton>
          </Box>
          <IconButton size="small" onClick={handleMenuOpen}>
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </CardActions>
      </Card>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem
          onClick={() => {
            onView(document);
            handleMenuClose();
          }}
        >
          View
        </MenuItem>
        <MenuItem
          onClick={() => {
            onDownload(document.id);
            handleMenuClose();
          }}
        >
          Download
        </MenuItem>
        <MenuItem
          onClick={() => {
            onShare(document.id);
            handleMenuClose();
          }}
        >
          Share
        </MenuItem>
        <MenuItem
          onClick={() => {
            onDelete(document.id);
            handleMenuClose();
          }}
          sx={{ color: 'error.main' }}
        >
          Delete
        </MenuItem>
      </Menu>
    </>
  );
};
