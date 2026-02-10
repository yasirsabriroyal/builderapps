import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import { DocumentCard } from '../components/documents/DocumentCard';
import { DocumentUpload } from '../components/documents/DocumentUpload';
import { DocumentViewer } from '../components/documents/DocumentViewer';
import { DocumentFilter } from '../components/documents/DocumentFilter';
import api from '../services/api';
import type { Document, DocumentCategory } from '../types';

export const DocumentsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await api.get('/documents');
      setDocuments(response.data);
    } catch (err) {
      setError('Failed to load documents');
      console.error(err);
      // Mock data for development
      setDocuments([
        {
          id: '1',
          name: 'Construction_Contract.pdf',
          category: 'contracts',
          fileUrl: '/docs/contract.pdf',
          size: 256000,
          uploadedAt: new Date('2024-01-10'),
          tags: ['contract', 'signed'],
          versions: [
            {
              id: 'v1',
              versionNumber: 1,
              fileUrl: '/docs/contract.pdf',
              uploadedAt: new Date('2024-01-10'),
              uploadedBy: 'John Doe',
            },
          ],
        },
        {
          id: '2',
          name: 'Floor_Plan.pdf',
          category: 'blueprints',
          fileUrl: '/docs/floorplan.pdf',
          size: 1024000,
          uploadedAt: new Date('2024-01-15'),
          tags: ['blueprint', 'revised'],
          versions: [
            {
              id: 'v1',
              versionNumber: 2,
              fileUrl: '/docs/floorplan-v2.pdf',
              uploadedAt: new Date('2024-01-20'),
              uploadedBy: 'Jane Smith',
            },
            {
              id: 'v2',
              versionNumber: 1,
              fileUrl: '/docs/floorplan-v1.pdf',
              uploadedAt: new Date('2024-01-15'),
              uploadedBy: 'Jane Smith',
            },
          ],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (files: File[]) => {
    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('documents', file);
      });

      await api.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const progress = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;
          setUploadProgress(progress);
        },
      });

      fetchDocuments();
    } catch (err) {
      console.error(err);
      // Mock upload for development
      const newDocs: Document[] = files.map((file, index) => ({
        id: `${Date.now()}-${index}`,
        name: file.name,
        category: 'other',
        fileUrl: URL.createObjectURL(file),
        size: file.size,
        uploadedAt: new Date(),
        tags: [],
        versions: [
          {
            id: `v-${Date.now()}-${index}`,
            versionNumber: 1,
            fileUrl: URL.createObjectURL(file),
            uploadedAt: new Date(),
            uploadedBy: 'Current User',
          },
        ],
      }));
      setDocuments([...documents, ...newDocs]);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleView = (document: Document) => {
    setSelectedDocument(document);
    setViewerOpen(true);
  };

  const handleDownload = (id: string) => {
    const doc = documents.find((d) => d.id === id);
    if (doc) {
      window.open(doc.fileUrl, '_blank');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
      await api.delete(`/documents/${id}`);
      setDocuments(documents.filter((d) => d.id !== id));
    } catch (err) {
      console.error(err);
      // Mock delete for development
      setDocuments(documents.filter((d) => d.id !== id));
    }
  };

  const handleShare = (id: string) => {
    // TODO: Implement share functionality
    console.log('Share document:', id);
    alert('Share functionality coming soon!');
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Document Management
        </Typography>

        {error && (
          <Alert severity="info" sx={{ mb: 3 }}>
            {error} - Using demo data
          </Alert>
        )}

        <Box sx={{ mb: 3 }}>
          <DocumentUpload
            onUpload={handleUpload}
            uploading={uploading}
            uploadProgress={uploadProgress}
          />
        </Box>

        <DocumentFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        <Grid container spacing={2}>
          {filteredDocuments.map((doc) => (
            <Grid item xs={12} sm={6} md={viewMode === 'grid' ? 4 : 12} key={doc.id}>
              <DocumentCard
                document={doc}
                onDownload={handleDownload}
                onDelete={handleDelete}
                onShare={handleShare}
                onView={handleView}
              />
            </Grid>
          ))}
        </Grid>

        {filteredDocuments.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="body1" color="text.secondary">
              No documents found
            </Typography>
          </Box>
        )}

        <DocumentViewer
          open={viewerOpen}
          document={selectedDocument}
          onClose={() => setViewerOpen(false)}
        />
      </Box>
    </Container>
  );
};
