# Frontend Services and Authentication

This document describes the newly added frontend libraries, services, and authentication system.

## New Dependencies Added

### UI Framework
- **@mui/material** - Material-UI core components
- **@mui/icons-material** - Material-UI icons
- **@emotion/react** - CSS-in-JS library (required by MUI)
- **@emotion/styled** - Styled components (required by MUI)

### 3D and Graphics
- **three** - Three.js 3D library
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Helper components for React Three Fiber
- **fabric** - Fabric.js for canvas manipulation (floor plan designer)

### API and Real-time
- **axios** (v1.12.0) - HTTP client for API calls
- **socket.io-client** - WebSocket client for real-time collaboration

## Service Layer

### API Service (`src/services/api.ts`)
Base Axios instance with:
- Auto-injection of authentication tokens
- Base URL configuration via environment variables
- Request/response interceptors
- Automatic redirect on 401 (unauthorized)

### Auth Service (`src/services/auth.service.ts`)
Authentication operations:
- `login(credentials)` - User login
- `register(userData)` - New user registration
- `logout()` - User logout
- `getCurrentUser()` - Fetch current user details
- `updateProfile(userData)` - Update user profile
- `changePassword(oldPassword, newPassword)` - Change password

### Project Service (`src/services/project.service.ts`)
Project management operations:
- CRUD operations for projects
- Floor plan management
- Material management
- Timeline management
- Document upload and management

### Material Service (`src/services/material.service.ts`)
Material library operations:
- Browse materials by category
- Search materials
- Get supplier information

### Socket Service (`src/services/socket.service.ts`)
Real-time collaboration features:
- Connect/disconnect to WebSocket server
- Join/leave project rooms
- Emit and listen for real-time updates
- User presence tracking

## Authentication Context

### AuthContext (`src/contexts/AuthContext.tsx`)
Provides authentication state management:
- `user` - Current user object
- `isAuthenticated` - Boolean authentication status
- `isLoading` - Loading state
- `login(credentials)` - Login function
- `register(userData)` - Registration function
- `logout()` - Logout function
- `updateUser(userData)` - Update user function

### ProtectedRoute Component
Wrapper component for protected routes that require authentication.
Automatically redirects to login page if user is not authenticated.

## New Pages

### Authentication Pages
- **LoginPage** (`/login`) - User login form
- **RegisterPage** (`/register`) - User registration form
- **ProfilePage** (`/profile`) - User profile management

### Application Pages
- **DashboardPage** (`/dashboard`) - Main dashboard with navigation
- **FloorPlanPage** (`/floor-plan`) - Floor plan designer (placeholder)
- **Viewer3DPage** (`/3d-viewer`) - 3D visualization (placeholder)
- **MaterialsPage** (`/materials`) - Materials library (placeholder)
- **BudgetPage** (`/budget`) - Budget management (placeholder)
- **TimelinePage** (`/timeline`) - Timeline management (placeholder)
- **DocumentsPage** (`/documents`) - Document management (placeholder)
- **CollaborationPage** (`/collaboration`) - Team collaboration (placeholder)

## Environment Configuration

Create a `.env` file in the project root with:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

See `.env.example` for a template.

## Usage

### Using the Auth Context

```tsx
import { useAuth } from './contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  // Use authentication state and functions
}
```

### Making API Calls

```tsx
import { projectService } from './services/project.service';

async function loadProjects() {
  const projects = await projectService.getAllProjects();
  // Handle projects
}
```

### Protected Routes

```tsx
import { ProtectedRoute } from './contexts/AuthContext';

<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  } 
/>
```

## Integration with Existing Code

The new authentication system works alongside the existing `AppContext`:
- `AuthContext` manages user authentication and authorization
- `AppContext` manages application state (form data, selections, etc.)
- Both contexts wrap the entire application in `App.tsx`

## Security Notes

- Authentication tokens are stored in localStorage
- Tokens are automatically included in all API requests
- Unauthorized requests (401) automatically redirect to login
- WebSocket connections are authenticated with the same token
- All protected routes require authentication
- Used axios v1.12.0 to avoid known security vulnerabilities

## Next Steps

The placeholder pages need to be implemented with:
1. Floor plan designer using Fabric.js
2. 3D viewer using React Three Fiber
3. Material selection and browsing
4. Budget tracking and visualization
5. Timeline/Gantt chart
6. Document upload interface
7. Real-time collaboration features
