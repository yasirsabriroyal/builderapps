# Database Schema Design

## Overview
This document outlines the database schema for the Builder App, designed to support all core features efficiently.

---

## Entity Relationship Diagram (Conceptual)

```
Users (1) ←→ (N) Projects
Projects (1) ←→ (N) Designs
Designs (1) ←→ (N) FloorPlans
Designs (1) ←→ (N) MaterialSelections
Projects (1) ←→ (N) Documents
Projects (1) ←→ (N) Milestones
Projects (1) ←→ (N) Communications
Projects (1) ←→ (1) Budget
Users (N) ←→ (N) Projects (TeamMembers)
Materials (N) ←→ (N) MaterialCategories
```

---

## Tables

### 1. users
Stores all user information for clients, designers, builders, and admins.

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) NOT NULL CHECK (role IN ('client', 'designer', 'builder', 'admin')),
    avatar_url TEXT,
    email_verified BOOLEAN DEFAULT FALSE,
    notification_preferences JSONB DEFAULT '{"email": true, "sms": false, "push": true}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended'))
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

---

### 2. projects
Main project entity linking all design and construction data.

```sql
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    project_name VARCHAR(255) NOT NULL,
    project_type VARCHAR(50) NOT NULL CHECK (project_type IN ('new_construction', 'renovation', 'addition', 'remodel')),
    address TEXT,
    lot_size_sqft DECIMAL(10, 2),
    budget_min DECIMAL(12, 2),
    budget_max DECIMAL(12, 2),
    status VARCHAR(30) DEFAULT 'design' CHECK (status IN ('design', 'planning', 'permitting', 'construction', 'completed', 'on_hold')),
    start_date DATE,
    estimated_completion_date DATE,
    actual_completion_date DATE,
    description TEXT,
    site_details JSONB, -- topography, soil, utilities, etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_projects_owner ON projects(owner_id);
CREATE INDEX idx_projects_status ON projects(status);
```

---

### 3. project_team_members
Associates team members with projects.

```sql
CREATE TABLE project_team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL CHECK (role IN ('lead_designer', 'assistant_designer', 'project_manager', 'contractor', 'consultant')),
    permissions JSONB DEFAULT '{"view": true, "edit": false, "approve": false}',
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, user_id)
);

CREATE INDEX idx_team_project ON project_team_members(project_id);
CREATE INDEX idx_team_user ON project_team_members(user_id);
```

---

### 4. designs
Stores design versions for each project.

```sql
CREATE TABLE designs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    design_name VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    is_approved BOOLEAN DEFAULT FALSE,
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP,
    total_sqft DECIMAL(10, 2),
    num_bedrooms INTEGER,
    num_bathrooms DECIMAL(3, 1),
    num_stories INTEGER,
    style VARCHAR(50), -- modern, traditional, ranch, colonial, etc.
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, version_number)
);

CREATE INDEX idx_designs_project ON designs(project_id);
CREATE INDEX idx_designs_active ON designs(is_active);
```

---

### 5. floor_plans
Stores floor plan data for each design.

```sql
CREATE TABLE floor_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    design_id UUID NOT NULL REFERENCES designs(id) ON DELETE CASCADE,
    floor_number INTEGER NOT NULL,
    floor_name VARCHAR(100), -- 'First Floor', 'Basement', 'Loft', etc.
    floor_data JSONB NOT NULL, -- JSON structure with walls, doors, windows, rooms
    thumbnail_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(design_id, floor_number)
);

CREATE INDEX idx_floor_plans_design ON floor_plans(design_id);
```

---

### 6. rooms
Detailed room information within floor plans.

```sql
CREATE TABLE rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    floor_plan_id UUID NOT NULL REFERENCES floor_plans(id) ON DELETE CASCADE,
    room_name VARCHAR(100) NOT NULL,
    room_type VARCHAR(50) NOT NULL, -- bedroom, bathroom, kitchen, living, etc.
    dimensions JSONB NOT NULL, -- width, length, height
    sqft DECIMAL(10, 2),
    ceiling_height DECIMAL(5, 2),
    features JSONB, -- windows, doors, fixtures
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_rooms_floor_plan ON rooms(floor_plan_id);
CREATE INDEX idx_rooms_type ON rooms(room_type);
```

---

### 7. material_categories
Categorizes materials for organization.

```sql
CREATE TABLE material_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_name VARCHAR(100) NOT NULL UNIQUE,
    parent_category_id UUID REFERENCES material_categories(id),
    description TEXT,
    display_order INTEGER DEFAULT 0,
    icon_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_category_parent ON material_categories(parent_category_id);
```

---

### 8. materials
Library of available materials and finishes.

```sql
CREATE TABLE materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES material_categories(id),
    material_name VARCHAR(255) NOT NULL,
    manufacturer VARCHAR(255),
    model_number VARCHAR(100),
    description TEXT,
    price_per_unit DECIMAL(10, 2),
    unit_type VARCHAR(20), -- sqft, linear_ft, piece, etc.
    color VARCHAR(100),
    finish VARCHAR(100),
    image_urls JSONB, -- array of image URLs
    thumbnail_url TEXT,
    specifications JSONB, -- dimensions, weight, ratings, etc.
    sustainability_rating VARCHAR(20),
    lead_time_days INTEGER,
    vendor_info JSONB, -- contact, website, availability
    is_available BOOLEAN DEFAULT TRUE,
    is_premium BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_materials_category ON materials(category_id);
CREATE INDEX idx_materials_available ON materials(is_available);
CREATE INDEX idx_materials_name ON materials(material_name);
```

---

### 9. material_selections
Tracks material selections for specific design areas.

```sql
CREATE TABLE material_selections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    design_id UUID NOT NULL REFERENCES designs(id) ON DELETE CASCADE,
    room_id UUID REFERENCES rooms(id),
    area_type VARCHAR(100) NOT NULL, -- flooring, walls, countertop, cabinets, etc.
    material_id UUID NOT NULL REFERENCES materials(id),
    quantity DECIMAL(10, 2),
    estimated_cost DECIMAL(12, 2),
    notes TEXT,
    selected_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_selections_design ON material_selections(design_id);
CREATE INDEX idx_selections_room ON material_selections(room_id);
CREATE INDEX idx_selections_material ON material_selections(material_id);
```

---

### 10. budgets
Comprehensive budget tracking for projects.

```sql
CREATE TABLE budgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    total_budget DECIMAL(12, 2) NOT NULL,
    contingency_percentage DECIMAL(5, 2) DEFAULT 10.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_budgets_project ON budgets(project_id);
```

---

### 11. budget_items
Detailed line items within budgets.

```sql
CREATE TABLE budget_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    budget_id UUID NOT NULL REFERENCES budgets(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL, -- materials, labor, permits, design, etc.
    subcategory VARCHAR(100),
    description TEXT NOT NULL,
    estimated_cost DECIMAL(12, 2) NOT NULL,
    actual_cost DECIMAL(12, 2),
    paid_amount DECIMAL(12, 2) DEFAULT 0,
    vendor VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_budget_items_budget ON budget_items(budget_id);
CREATE INDEX idx_budget_items_category ON budget_items(category);
```

---

### 12. milestones
Project timeline milestones.

```sql
CREATE TABLE milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    milestone_name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50), -- design, permitting, construction, inspection, completion
    planned_start_date DATE,
    planned_end_date DATE,
    actual_start_date DATE,
    actual_end_date DATE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'delayed', 'blocked')),
    completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
    dependencies JSONB, -- array of dependent milestone IDs
    assigned_to UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_milestones_project ON milestones(project_id);
CREATE INDEX idx_milestones_status ON milestones(status);
```

---

### 13. documents
Centralized document storage.

```sql
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    document_name VARCHAR(255) NOT NULL,
    document_type VARCHAR(50) NOT NULL, -- contract, blueprint, permit, invoice, photo, etc.
    file_url TEXT NOT NULL,
    file_size_bytes BIGINT,
    mime_type VARCHAR(100),
    version_number INTEGER DEFAULT 1,
    description TEXT,
    tags JSONB, -- array of tags for searchability
    uploaded_by UUID REFERENCES users(id),
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_documents_project ON documents(project_id);
CREATE INDEX idx_documents_type ON documents(document_type);
CREATE INDEX idx_documents_tags ON documents USING GIN(tags);
```

---

### 14. communications
Communication threads and messages.

```sql
CREATE TABLE communications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES communications(id), -- for threaded conversations
    sender_id UUID NOT NULL REFERENCES users(id),
    message_type VARCHAR(20) DEFAULT 'message' CHECK (message_type IN ('message', 'comment', 'annotation', 'approval_request')),
    subject VARCHAR(255),
    message_body TEXT NOT NULL,
    attachments JSONB, -- array of file URLs
    related_entity_type VARCHAR(50), -- design, material, milestone, document
    related_entity_id UUID,
    is_read BOOLEAN DEFAULT FALSE,
    read_by JSONB, -- array of user IDs who have read the message
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_communications_project ON communications(project_id);
CREATE INDEX idx_communications_sender ON communications(sender_id);
CREATE INDEX idx_communications_parent ON communications(parent_id);
```

---

### 15. approvals
Tracks design and change approvals.

```sql
CREATE TABLE approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    approval_type VARCHAR(50) NOT NULL, -- design, material, change_order, budget
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    requested_by UUID NOT NULL REFERENCES users(id),
    approver_id UUID NOT NULL REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'revise')),
    comments TEXT,
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_approvals_project ON approvals(project_id);
CREATE INDEX idx_approvals_status ON approvals(status);
CREATE INDEX idx_approvals_approver ON approvals(approver_id);
```

---

### 16. notifications
User notifications.

```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    notification_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    action_url TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    sent_via JSONB DEFAULT '{"email": false, "sms": false, "push": false}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);
```

---

### 17. activity_logs
Audit trail for all system activities.

```sql
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    project_id UUID REFERENCES projects(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id UUID,
    changes JSONB, -- before/after values
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_activity_user ON activity_logs(user_id);
CREATE INDEX idx_activity_project ON activity_logs(project_id);
CREATE INDEX idx_activity_created ON activity_logs(created_at DESC);
```

---

### 18. inspiration_gallery
Showcase of completed projects.

```sql
CREATE TABLE inspiration_gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    style_tags JSONB, -- modern, traditional, coastal, etc.
    size_category VARCHAR(20), -- small, medium, large, estate
    budget_range VARCHAR(50), -- moderate, luxury, custom
    featured_image_url TEXT,
    gallery_images JSONB, -- array of image URLs
    project_stats JSONB, -- sqft, bedrooms, bathrooms, etc.
    is_featured BOOLEAN DEFAULT FALSE,
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_gallery_style ON inspiration_gallery USING GIN(style_tags);
CREATE INDEX idx_gallery_featured ON inspiration_gallery(is_featured);
CREATE INDEX idx_gallery_published ON inspiration_gallery(published_at DESC);
```

---

### 19. user_favorites
User-saved designs and materials.

```sql
CREATE TABLE user_favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    entity_type VARCHAR(50) NOT NULL, -- design, material, gallery_item
    entity_id UUID NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, entity_type, entity_id)
);

CREATE INDEX idx_favorites_user ON user_favorites(user_id);
```

---

### 20. settings
Global and project-specific settings.

```sql
CREATE TABLE settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scope VARCHAR(20) NOT NULL CHECK (scope IN ('global', 'project')),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    key VARCHAR(100) NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(scope, project_id, key)
);

CREATE INDEX idx_settings_scope ON settings(scope);
```

---

## Views

### Project Overview View
```sql
CREATE VIEW project_overview AS
SELECT 
    p.id,
    p.project_name,
    p.status,
    p.owner_id,
    u.first_name || ' ' || u.last_name AS owner_name,
    d.design_name AS active_design,
    d.total_sqft,
    b.total_budget,
    COALESCE(SUM(bi.actual_cost), 0) AS spent_amount,
    COUNT(DISTINCT m.id) AS milestone_count,
    COUNT(DISTINCT CASE WHEN m.status = 'completed' THEN m.id END) AS completed_milestones
FROM projects p
LEFT JOIN users u ON p.owner_id = u.id
LEFT JOIN designs d ON p.id = d.project_id AND d.is_active = TRUE
LEFT JOIN budgets b ON p.id = b.project_id
LEFT JOIN budget_items bi ON b.id = bi.budget_id
LEFT JOIN milestones m ON p.id = m.project_id
GROUP BY p.id, u.first_name, u.last_name, d.design_name, d.total_sqft, b.total_budget;
```

---

## Indexes Summary

All critical foreign keys and frequently queried columns have indexes created above. Additional composite indexes can be added based on actual query patterns.

---

## Data Retention & Archival

- **Active Projects**: Full data retention
- **Completed Projects**: Archive after 2 years to separate storage
- **Activity Logs**: Retain for 1 year, then archive
- **Notifications**: Delete after 6 months if read, 1 year if unread
- **Communications**: Permanent retention

---

## Security Considerations

1. **Row-Level Security (RLS)**: Implement policies ensuring users only access their projects
2. **Encryption**: Encrypt sensitive fields (contracts, personal info)
3. **Audit Trail**: All data changes logged in activity_logs
4. **Soft Deletes**: Consider adding `deleted_at` columns for important tables
5. **Backups**: Daily automated backups with point-in-time recovery

---

## Scalability Considerations

1. **Partitioning**: Partition large tables (activity_logs, notifications) by date
2. **Caching**: Redis for frequently accessed data (materials library, user sessions)
3. **CDN**: Store files (images, documents) in cloud storage with CDN
4. **Read Replicas**: For reporting and analytics queries
5. **Connection Pooling**: Implement connection pooling for database efficiency
