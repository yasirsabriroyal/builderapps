# Home Builder Design Center - Backend API

## Overview
RESTful API backend for the Home Builder Design Center application built with Node.js, Express, TypeScript, PostgreSQL, and Socket.io.

## Features
- ✅ User Authentication (JWT)
- ✅ Project Management
- ✅ Floor Plan Designer
- ✅ Material Selection & Management
- ✅ Budget Tracking
- ✅ Task Management
- ✅ Timeline & Milestones
- ✅ Document Management
- ✅ Real-time Messaging (Socket.io)
- ✅ Role-based Access Control

## Tech Stack
- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Sequelize
- **Authentication:** JWT + bcryptjs
- **Real-time:** Socket.io
- **Validation:** Custom middleware

## Prerequisites
- Node.js 16+
- PostgreSQL 12+
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your database credentials:
```
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://username:password@localhost:5432/home_builder_db
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
```

3. Create PostgreSQL database:
```bash
createdb home_builder_db
```

4. Seed the database:
```bash
npm run seed
```

## Running the Application

**Development mode:**
```bash
npm run dev
```

**Production build:**
```bash
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/reset-password` - Reset password

### Projects
- `GET /api/v1/projects` - List all projects
- `POST /api/v1/projects` - Create project
- `GET /api/v1/projects/:id` - Get project details
- `PUT /api/v1/projects/:id` - Update project
- `DELETE /api/v1/projects/:id` - Delete project

### Floor Plans
- `GET /api/v1/projects/:id/floor-plans` - List floor plans
- `POST /api/v1/projects/:id/floor-plans` - Create floor plan
- `GET /api/v1/projects/:id/floor-plans/:floorPlanId` - Get floor plan
- `PUT /api/v1/projects/:id/floor-plans/:floorPlanId` - Update floor plan

### Materials
- `GET /api/v1/materials` - List materials (with filters)
- `GET /api/v1/materials/categories` - List categories
- `GET /api/v1/materials/:id` - Get material details
- `GET /api/v1/projects/:id/materials` - List project materials
- `POST /api/v1/projects/:id/materials` - Add material to project
- `DELETE /api/v1/projects/:id/materials/:materialId` - Remove material

### Budget
- `GET /api/v1/projects/:id/budget` - Get project budget
- `PUT /api/v1/projects/:id/budget` - Update budget
- `POST /api/v1/projects/:id/budget/line-items` - Add line item

### Timeline & Milestones
- `GET /api/v1/projects/:id/timeline` - Get project timeline
- `POST /api/v1/projects/:id/milestones` - Create milestone
- `PUT /api/v1/projects/:id/milestones/:milestoneId` - Update milestone

### Documents
- `GET /api/v1/projects/:id/documents` - List documents
- `POST /api/v1/projects/:id/documents` - Upload document
- `DELETE /api/v1/projects/:id/documents/:documentId` - Delete document

### Messages
- `GET /api/v1/projects/:id/messages` - List messages
- `POST /api/v1/projects/:id/messages` - Send message

### Tasks
- `GET /api/v1/projects/:id/tasks` - List tasks
- `POST /api/v1/projects/:id/tasks` - Create task
- `PUT /api/v1/projects/:id/tasks/:taskId` - Update task
- `DELETE /api/v1/projects/:id/tasks/:taskId` - Delete task

## Database Models

### User
- id, email, password, firstName, lastName, role, phone

### Project
- id, userId, name, status, designData, budget

### FloorPlan
- id, projectId, name, canvasData

### Material
- id, categoryId, name, description, price, imageUrl, vendor

### Budget
- id, projectId, totalBudget, actualCost

### Milestone
- id, projectId, name, description, dueDate, completedDate, status

### Task
- id, projectId, title, description, assignedTo, dueDate, status, priority

### Document
- id, projectId, name, fileUrl, category, uploadedBy

### Message
- id, projectId, userId, content

## Socket.io Events

### Client → Server
- `join-project` - Join project room
- `leave-project` - Leave project room
- `new-message` - Send new message
- `project-update` - Broadcast project update

### Server → Client
- `message-received` - Receive new message
- `project-updated` - Receive project update

## Authentication
All protected routes require JWT token in header:
```
Authorization: Bearer <token>
```

## Error Handling
API returns standardized error responses:
```json
{
  "status": "error",
  "message": "Error description"
}
```

## Development
- Code is automatically reloaded with nodemon
- TypeScript compilation on-the-fly with ts-node
- Database schema auto-synced in development

## Scripts
- `npm run dev` - Start development server
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run seed` - Seed database with sample data

## License
ISC
