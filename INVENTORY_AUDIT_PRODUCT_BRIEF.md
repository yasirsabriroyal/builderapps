# Inventory & Tools Audit SaaS - Product Brief and Baseline Requirements

## Stage 0 Deliverables (Week 1)

### Ideal Customer Profile (ICP)
- **Construction firms**: track distributed toolsets across active job sites.
- **Warehouses and yard operations**: maintain stock accuracy and reduce shrinkage.
- **Maintenance teams**: monitor tool condition, calibration, and service readiness.

### Core Use Cases
1. Capture tool/item by photo and auto-prefill metadata.
2. Add item details hands-free using voice notes.
3. Review and confirm AI suggestions before save.
4. Run audit sessions to compare expected vs counted quantities.
5. Export audit history and discrepancies for compliance records.

### Pricing Hypothesis
- **Starter**: small teams, one workspace, limited monthly AI usage.
- **Growth**: multi-site teams, higher AI limits, role controls.
- **Enterprise**: advanced compliance, SSO/SAML, integrations, custom retention.

### Locked MVP Scope
- Workspace-based inventory separation.
- AI image prefill suggestions.
- Voice description transcription contract.
- Manual review before item save.
- Inventory list with search-ready fields.
- Audit session lifecycle (start, count, reconcile, complete).

### Success Metrics
- **Capture Time / Item**: median time from photo input to saved record.
- **AI Prefill Accuracy**: accepted AI-suggested fields ÷ total suggested fields.
- **Audit Completion Rate**: completed audit sessions ÷ started sessions.

### Milestone Outcome
- Product brief approved.
- MVP requirements baseline frozen for implementation.

---

## Stage 1 Deliverables (Weeks 2-3)

### Standalone SaaS-Ready Architecture
- Independent backend API with JWT auth and workspace tenancy.
- Tenant isolation through `workspaceId` scope and membership checks.
- Frontend module isolated as Inventory Audit workflow surface.
- Integration adapters for AI vision, speech-to-text, storage, billing.

### Baseline Data Model
- **Workspace**: tenant container and plan tier.
- **WorkspaceMember**: role mapping per user and workspace.
- **InventoryItem**: master inventory record including AI confidence.
- **AuditSession**: audit lifecycle state.
- **AuditEntry**: expected vs counted records and discrepancies.

### Security and Compliance Baseline
- Role-based access control (`owner`, `admin`, `auditor`, `member`).
- Workspace-scoped authorization on all inventory/audit endpoints.
- Immutable audit evidence references per audit entry.
- Data retention policy hooks via lifecycle states and timestamps.

### Integration Boundaries
- **Vision Adapter**: `/ai/analyze-image` placeholder contract for external model providers.
- **Speech Adapter**: `/ai/voice-transcription` placeholder contract for STT providers.
- **Storage Boundary**: `imageUrl` supports object-storage integration.
- **Billing Boundary**: workspace `plan` field for future entitlement enforcement.

### API Contract Baseline (Frozen for MVP)
- `GET /api/v1/workspaces`
- `POST /api/v1/workspaces`
- `POST /api/v1/workspaces/:workspaceId/members`
- `GET /api/v1/workspaces/:workspaceId/items`
- `POST /api/v1/workspaces/:workspaceId/items`
- `PUT /api/v1/workspaces/:workspaceId/items/:itemId`
- `POST /api/v1/workspaces/:workspaceId/ai/analyze-image`
- `POST /api/v1/workspaces/:workspaceId/ai/voice-transcription`
- `GET /api/v1/workspaces/:workspaceId/audits`
- `POST /api/v1/workspaces/:workspaceId/audits`
- `POST /api/v1/workspaces/:workspaceId/audits/:auditId/records`
- `PUT /api/v1/workspaces/:workspaceId/audits/:auditId/complete`

### Milestone Outcome
- Architecture sign-off baseline implemented.
- Data schema and MVP API surface established.
