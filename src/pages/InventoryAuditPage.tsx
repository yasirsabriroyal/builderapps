import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import {
  inventoryAuditService
} from '../services/inventoryAudit.service';
import type { AuditSession, InventoryItem, WorkspaceMembership } from '../services/inventoryAudit.service';

type ItemDraft = {
  name: string;
  category: string;
  brand: string;
  model: string;
  quantity: number;
  unit: string;
  condition: 'new' | 'good' | 'fair' | 'damaged';
  status: 'available' | 'in-use' | 'missing' | 'repair';
  location: string;
  description: string;
  imageUrl: string;
  aiConfidence?: number;
};

const initialItemDraft: ItemDraft = {
  name: '',
  category: 'Tools',
  brand: '',
  model: '',
  quantity: 1,
  unit: 'pcs',
  condition: 'good',
  status: 'available',
  location: '',
  description: '',
  imageUrl: ''
};

export const InventoryAuditPage: React.FC = () => {
  const [workspaces, setWorkspaces] = useState<WorkspaceMembership[]>([]);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<number | ''>('');
  const [newWorkspaceName, setNewWorkspaceName] = useState('');

  const [items, setItems] = useState<InventoryItem[]>([]);
  const [itemDraft, setItemDraft] = useState<ItemDraft>(initialItemDraft);

  const [audits, setAudits] = useState<AuditSession[]>([]);
  const [newAuditName, setNewAuditName] = useState('');
  const [countInputs, setCountInputs] = useState<Record<number, number>>({});

  const [voiceInput, setVoiceInput] = useState('');
  const [analysisHint, setAnalysisHint] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const selectedWorkspace = useMemo(
    () => workspaces.find(workspace => workspace.workspace.id === selectedWorkspaceId),
    [selectedWorkspaceId, workspaces]
  );

  const activeAudit = useMemo(
    () => audits.find(audit => audit.status === 'in-progress'),
    [audits]
  );

  const loadWorkspaceData = async (workspaceId: number) => {
    const [loadedItems, loadedAudits] = await Promise.all([
      inventoryAuditService.listItems(workspaceId),
      inventoryAuditService.listAudits(workspaceId)
    ]);
    setItems(loadedItems);
    setAudits(loadedAudits);
  };

  useEffect(() => {
    const bootstrap = async () => {
      try {
        setLoading(true);
        const list = await inventoryAuditService.listWorkspaces();
        setWorkspaces(list);
        if (list.length > 0) {
          const defaultWorkspaceId = list[0].workspace.id;
          setSelectedWorkspaceId(defaultWorkspaceId);
          await loadWorkspaceData(defaultWorkspaceId);
        }
      } catch {
        setError('Unable to load workspace data. Please login and try again.');
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  const onWorkspaceChange = async (workspaceId: number) => {
    setSelectedWorkspaceId(workspaceId);
    setMessage(null);
    setError(null);
    try {
      await loadWorkspaceData(workspaceId);
    } catch {
      setError('Failed to load selected workspace data.');
    }
  };

  const createWorkspace = async () => {
    if (!newWorkspaceName.trim()) {
      setError('Workspace name is required.');
      return;
    }

    try {
      const created = await inventoryAuditService.createWorkspace(newWorkspaceName.trim());
      const updatedWorkspaces = await inventoryAuditService.listWorkspaces();
      setWorkspaces(updatedWorkspaces);
      setNewWorkspaceName('');
      setSelectedWorkspaceId(created.id);
      await loadWorkspaceData(created.id);
      setMessage('Workspace created successfully.');
    } catch {
      setError('Failed to create workspace.');
    }
  };

  const runImageAnalysis = async () => {
    if (!selectedWorkspaceId || !itemDraft.imageUrl.trim()) {
      setError('Select a workspace and provide an image URL before analysis.');
      return;
    }

    try {
      const analysis = await inventoryAuditService.analyzeImage(
        selectedWorkspaceId,
        itemDraft.imageUrl,
        analysisHint
      );

      setItemDraft(previous => ({
        ...previous,
        name: previous.name || analysis.suggestions.name,
        category: previous.category || analysis.suggestions.category,
        brand: previous.brand || analysis.suggestions.brand || '',
        model: previous.model || analysis.suggestions.model || '',
        condition: analysis.suggestions.condition,
        status: analysis.suggestions.status,
        aiConfidence: analysis.confidence
      }));

      setMessage(`Image analysis complete (confidence ${Math.round(analysis.confidence * 100)}%).`);
    } catch {
      setError('Image analysis failed.');
    }
  };

  const applyVoiceTranscription = async () => {
    if (!selectedWorkspaceId || !voiceInput.trim()) {
      setError('Enter voice notes text to transcribe.');
      return;
    }

    try {
      const result = await inventoryAuditService.transcribeVoice(selectedWorkspaceId, voiceInput);
      setItemDraft(previous => ({
        ...previous,
        description: previous.description
          ? `${previous.description} ${result.transcription}`
          : result.transcription
      }));
      setVoiceInput('');
      setMessage(`Voice notes applied (${Math.round(result.confidence * 100)}% confidence).`);
    } catch {
      setError('Voice transcription failed.');
    }
  };

  const createItem = async () => {
    if (!selectedWorkspaceId) {
      setError('Select or create a workspace first.');
      return;
    }

    if (!itemDraft.name.trim()) {
      setError('Item name is required.');
      return;
    }

    try {
      await inventoryAuditService.createItem(selectedWorkspaceId, itemDraft);
      await loadWorkspaceData(selectedWorkspaceId);
      setItemDraft(initialItemDraft);
      setAnalysisHint('');
      setMessage('Inventory item saved after manual review.');
    } catch {
      setError('Failed to save item.');
    }
  };

  const createAudit = async () => {
    if (!selectedWorkspaceId || !newAuditName.trim()) {
      setError('Provide an audit name and select a workspace.');
      return;
    }

    try {
      await inventoryAuditService.createAudit(selectedWorkspaceId, newAuditName.trim());
      await loadWorkspaceData(selectedWorkspaceId);
      setNewAuditName('');
      setMessage('Audit session started.');
    } catch {
      setError('Failed to start audit session.');
    }
  };

  const recordCount = async (itemId: number) => {
    if (!selectedWorkspaceId || !activeAudit) {
      setError('Start an in-progress audit session first.');
      return;
    }

    const countedQuantity = countInputs[itemId];
    if (countedQuantity === undefined || Number.isNaN(countedQuantity)) {
      setError('Enter counted quantity first.');
      return;
    }

    try {
      const result = await inventoryAuditService.recordAuditEntry(
        selectedWorkspaceId,
        activeAudit.id,
        itemId,
        countedQuantity
      );
      await loadWorkspaceData(selectedWorkspaceId);
      setMessage(`Count recorded. Discrepancy: ${result.discrepancy}.`);
    } catch {
      setError('Failed to record count.');
    }
  };

  const completeAudit = async () => {
    if (!selectedWorkspaceId || !activeAudit) {
      setError('No active audit to complete.');
      return;
    }

    try {
      await inventoryAuditService.completeAudit(selectedWorkspaceId, activeAudit.id);
      await loadWorkspaceData(selectedWorkspaceId);
      setMessage('Audit completed successfully.');
    } catch {
      setError('Failed to complete audit.');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4 }}>
          <Typography>Loading inventory audit workspace...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ mt: 4, mb: 6 }}>
        <Typography variant="h4" gutterBottom>
          Inventory & Tools Audit
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Standalone, SaaS-ready workflow with workspace tenancy, AI-assisted capture, and audit reconciliation.
        </Typography>

        {message && (
          <Alert sx={{ mt: 2 }} severity="success" onClose={() => setMessage(null)}>
            {message}
          </Alert>
        )}
        {error && (
          <Alert sx={{ mt: 2 }} severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Workspace
                </Typography>

                <Stack spacing={2}>
                  <TextField
                    select
                    label="Select Workspace"
                    value={selectedWorkspaceId}
                    onChange={event => onWorkspaceChange(Number(event.target.value))}
                    fullWidth
                  >
                    {workspaces.map(workspace => (
                      <MenuItem key={workspace.workspace.id} value={workspace.workspace.id}>
                        {workspace.workspace.name} ({workspace.role})
                      </MenuItem>
                    ))}
                  </TextField>

                  <Divider />

                  <TextField
                    label="New Workspace Name"
                    value={newWorkspaceName}
                    onChange={event => setNewWorkspaceName(event.target.value)}
                    fullWidth
                  />
                  <Button variant="outlined" onClick={createWorkspace}>
                    Create Workspace
                  </Button>

                  {selectedWorkspace && (
                    <Stack direction="row" spacing={1}>
                      <Chip label={`Plan: ${selectedWorkspace.workspace.plan}`} size="small" />
                      <Chip label={`Role: ${selectedWorkspace.role}`} size="small" color="primary" />
                    </Stack>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  AI-Assisted Item Capture (Manual Review Required)
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Image URL"
                      value={itemDraft.imageUrl}
                      onChange={event =>
                        setItemDraft(previous => ({ ...previous, imageUrl: event.target.value }))
                      }
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Image Analysis Hint"
                      value={analysisHint}
                      onChange={event => setAnalysisHint(event.target.value)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button variant="contained" onClick={runImageAnalysis}>
                      Analyze Tool Photo
                    </Button>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Item Name"
                      value={itemDraft.name}
                      onChange={event =>
                        setItemDraft(previous => ({ ...previous, name: event.target.value }))
                      }
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Category"
                      value={itemDraft.category}
                      onChange={event =>
                        setItemDraft(previous => ({ ...previous, category: event.target.value }))
                      }
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      label="Brand"
                      value={itemDraft.brand}
                      onChange={event =>
                        setItemDraft(previous => ({ ...previous, brand: event.target.value }))
                      }
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      label="Model"
                      value={itemDraft.model}
                      onChange={event =>
                        setItemDraft(previous => ({ ...previous, model: event.target.value }))
                      }
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <TextField
                      label="Qty"
                      type="number"
                      value={itemDraft.quantity}
                      onChange={event =>
                        setItemDraft(previous => ({ ...previous, quantity: Number(event.target.value) }))
                      }
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <TextField
                      label="Unit"
                      value={itemDraft.unit}
                      onChange={event =>
                        setItemDraft(previous => ({ ...previous, unit: event.target.value }))
                      }
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Location"
                      value={itemDraft.location}
                      onChange={event =>
                        setItemDraft(previous => ({ ...previous, location: event.target.value }))
                      }
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Voice notes input"
                      value={voiceInput}
                      onChange={event => setVoiceInput(event.target.value)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button variant="outlined" onClick={applyVoiceTranscription}>
                      Apply Voice Description
                    </Button>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      label="Description"
                      value={itemDraft.description}
                      onChange={event =>
                        setItemDraft(previous => ({ ...previous, description: event.target.value }))
                      }
                      fullWidth
                      multiline
                      minRows={3}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Button variant="contained" onClick={createItem}>
                        Save Item
                      </Button>
                      {itemDraft.aiConfidence !== undefined && (
                        <Chip
                          label={`AI confidence ${Math.round(itemDraft.aiConfidence * 100)}%`}
                          color="info"
                          size="small"
                        />
                      )}
                    </Stack>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Audit Sessions
            </Typography>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 2 }}>
              <TextField
                label="New Audit Session Name"
                value={newAuditName}
                onChange={event => setNewAuditName(event.target.value)}
                fullWidth
              />
              <Button variant="contained" onClick={createAudit}>
                Start Audit
              </Button>
              <Button variant="outlined" onClick={completeAudit} disabled={!activeAudit}>
                Complete Active Audit
              </Button>
            </Stack>

            {audits.length === 0 ? (
              <Typography color="text.secondary">No audit sessions created yet.</Typography>
            ) : (
              <Stack spacing={1}>
                {audits.map(audit => (
                  <Stack key={audit.id} direction="row" spacing={1} alignItems="center">
                    <Typography>{audit.name}</Typography>
                    <Chip
                      label={audit.status}
                      color={audit.status === 'completed' ? 'success' : 'warning'}
                      size="small"
                    />
                    <Typography variant="caption" color="text.secondary">
                      Entries: {audit.entries?.length || 0}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            )}
          </CardContent>
        </Card>

        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Inventory List & Reconciliation
            </Typography>
            {items.length === 0 ? (
              <Typography color="text.secondary">No items saved yet.</Typography>
            ) : (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Code</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell align="right">Expected Qty</TableCell>
                    <TableCell align="right">Counted Qty</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map(item => (
                    <TableRow key={item.id}>
                      <TableCell>{item.itemCode}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.location || '-'}</TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell align="right">
                        <TextField
                          size="small"
                          type="number"
                          value={countInputs[item.id] ?? ''}
                          onChange={event =>
                            setCountInputs(previous => ({
                              ...previous,
                              [item.id]: Number(event.target.value)
                            }))
                          }
                          sx={{ width: 100 }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => recordCount(item.id)}
                          disabled={!activeAudit}
                        >
                          Record
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};
