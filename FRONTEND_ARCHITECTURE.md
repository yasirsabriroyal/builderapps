# Frontend Architecture & Components

## Overview
Modern, responsive frontend architecture for the Builder App using React.js with component-based design.

---

## Technology Stack

### Core Framework
- **React 18+** with Hooks and Context API
- **TypeScript** for type safety
- **React Router v6** for navigation
- **Redux Toolkit** or **Zustand** for state management

### UI Framework
- **Tailwind CSS** for styling
- **Material-UI (MUI)** or **Ant Design** for pre-built components
- **Framer Motion** for animations

### 3D & Visualization
- **Three.js** for 3D rendering
- **React Three Fiber** for React integration
- **Fabric.js** or **Konva.js** for 2D floor plan editing

### Forms & Validation
- **React Hook Form** for form management
- **Zod** or **Yup** for validation

### Data Fetching
- **React Query (TanStack Query)** for server state
- **Axios** for HTTP requests

### Build Tools
- **Vite** or **Next.js** for bundling
- **ESLint** + **Prettier** for code quality

---

## Project Structure

```
src/
├── api/                    # API client and endpoints
│   ├── axios.config.ts
│   ├── auth.api.ts
│   ├── projects.api.ts
│   ├── designs.api.ts
│   └── materials.api.ts
├── components/            # Reusable components
│   ├── common/           # Generic components
│   ├── layout/           # Layout components
│   ├── auth/             # Authentication components
│   ├── projects/         # Project-related components
│   ├── designs/          # Design components
│   ├── materials/        # Material components
│   └── communication/    # Communication components
├── features/             # Feature-based modules
│   ├── floor-plan-editor/
│   ├── 3d-viewer/
│   ├── material-selector/
│   └── budget-calculator/
├── hooks/                # Custom React hooks
├── contexts/             # React contexts
├── store/                # Redux/Zustand store
├── types/                # TypeScript types
├── utils/                # Utility functions
├── constants/            # Constants and configs
├── styles/               # Global styles
├── pages/                # Page components
└── App.tsx              # Root component
```

---

## Core Components

### 1. Layout Components

#### AppLayout
Main application layout wrapper.

```tsx
interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="app-layout">
      <Header />
      <Sidebar />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
};
```

---

#### Header
Top navigation bar with user menu.

```tsx
const Header: React.FC = () => {
  return (
    <header className="header">
      <Logo />
      <Navigation />
      <SearchBar />
      <NotificationBell />
      <UserMenu />
    </header>
  );
};
```

---

#### Sidebar
Side navigation with project switcher.

```tsx
const Sidebar: React.FC = () => {
  return (
    <aside className="sidebar">
      <ProjectSwitcher />
      <NavigationMenu items={menuItems} />
      <QuickActions />
    </aside>
  );
};
```

---

### 2. Authentication Components

#### LoginForm
User login form.

```tsx
interface LoginFormProps {
  onSuccess: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const onSubmit = async (data: LoginData) => {
    // Login logic
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Email"
        type="email"
        {...register('email', { required: true })}
        error={errors.email?.message}
      />
      <Input
        label="Password"
        type="password"
        {...register('password', { required: true })}
        error={errors.password?.message}
      />
      <Button type="submit">Login</Button>
    </form>
  );
};
```

---

#### RegisterForm
User registration form.

---

#### ProtectedRoute
Route wrapper for authenticated pages.

```tsx
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};
```

---

### 3. Project Components

#### ProjectCard
Display project summary card.

```tsx
interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  return (
    <Card className="project-card" onClick={onClick}>
      <CardMedia
        image={project.thumbnailUrl}
        alt={project.projectName}
      />
      <CardContent>
        <Typography variant="h6">{project.projectName}</Typography>
        <StatusBadge status={project.status} />
        <Typography variant="body2">{project.address}</Typography>
        <ProgressBar value={project.completionPercentage} />
      </CardContent>
      <CardActions>
        <Button size="small">View</Button>
        <Button size="small">Edit</Button>
      </CardActions>
    </Card>
  );
};
```

---

#### ProjectList
Grid or list view of projects.

```tsx
interface ProjectListProps {
  projects: Project[];
  viewMode: 'grid' | 'list';
  onProjectClick: (projectId: string) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ 
  projects, 
  viewMode, 
  onProjectClick 
}) => {
  return (
    <div className={`project-list ${viewMode}`}>
      {projects.map(project => (
        <ProjectCard
          key={project.id}
          project={project}
          onClick={() => onProjectClick(project.id)}
        />
      ))}
    </div>
  );
};
```

---

#### ProjectDashboard
Main project overview dashboard.

```tsx
const ProjectDashboard: React.FC<{ projectId: string }> = ({ projectId }) => {
  const { data: project } = useProject(projectId);
  
  return (
    <div className="project-dashboard">
      <DashboardHeader project={project} />
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <BudgetSummaryCard projectId={projectId} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TimelineSummaryCard projectId={projectId} />
        </Grid>
        <Grid item xs={12}>
          <RecentActivity projectId={projectId} />
        </Grid>
      </Grid>
    </div>
  );
};
```

---

### 4. Design Components

#### DesignViewer
View and manage design versions.

```tsx
interface DesignViewerProps {
  designId: string;
  mode: '2d' | '3d';
}

const DesignViewer: React.FC<DesignViewerProps> = ({ designId, mode }) => {
  const { data: design } = useDesign(designId);
  
  return (
    <div className="design-viewer">
      <DesignToolbar />
      {mode === '2d' ? (
        <FloorPlanCanvas design={design} />
      ) : (
        <ThreeDViewer design={design} />
      )}
      <DesignControls />
    </div>
  );
};
```

---

#### FloorPlanEditor
Interactive floor plan editing tool.

```tsx
const FloorPlanEditor: React.FC<{ floorPlanId: string }> = ({ floorPlanId }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState<Tool>('select');
  const { data: floorPlan, mutate } = useFloorPlan(floorPlanId);
  
  useEffect(() => {
    // Initialize Fabric.js canvas
    if (canvasRef.current) {
      const canvas = new fabric.Canvas(canvasRef.current);
      // Load floor plan data
      loadFloorPlan(canvas, floorPlan);
    }
  }, [floorPlan]);
  
  return (
    <div className="floor-plan-editor">
      <EditorToolbar
        activeTool={tool}
        onToolChange={setTool}
        tools={['select', 'wall', 'door', 'window', 'room']}
      />
      <canvas ref={canvasRef} />
      <PropertiesPanel />
    </div>
  );
};
```

---

#### ThreeDViewer
3D visualization component.

```tsx
const ThreeDViewer: React.FC<{ design: Design }> = ({ design }) => {
  return (
    <Canvas camera={{ position: [10, 10, 10] }}>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} />
      <OrbitControls />
      <House design={design} />
      <Ground />
      <Sky />
    </Canvas>
  );
};
```

---

### 5. Material Components

#### MaterialLibrary
Browse and search materials.

```tsx
const MaterialLibrary: React.FC = () => {
  const [filters, setFilters] = useState<MaterialFilters>({});
  const { data: materials } = useMaterials(filters);
  
  return (
    <div className="material-library">
      <MaterialFilters
        filters={filters}
        onFilterChange={setFilters}
      />
      <MaterialGrid materials={materials} />
    </div>
  );
};
```

---

#### MaterialCard
Display material details.

```tsx
interface MaterialCardProps {
  material: Material;
  onSelect?: (material: Material) => void;
}

const MaterialCard: React.FC<MaterialCardProps> = ({ material, onSelect }) => {
  return (
    <Card className="material-card">
      <CardMedia image={material.thumbnailUrl} />
      <CardContent>
        <Typography variant="h6">{material.materialName}</Typography>
        <Typography variant="body2">{material.manufacturer}</Typography>
        <Chip label={material.category.categoryName} size="small" />
        <Typography variant="h6" color="primary">
          ${material.pricePerUnit}/{material.unitType}
        </Typography>
      </CardContent>
      <CardActions>
        <Button onClick={() => onSelect?.(material)}>Select</Button>
        <IconButton><FavoriteIcon /></IconButton>
      </CardActions>
    </Card>
  );
};
```

---

#### MaterialSelector
Select materials for specific areas.

```tsx
interface MaterialSelectorProps {
  designId: string;
  areaType: string;
  roomId?: string;
}

const MaterialSelector: React.FC<MaterialSelectorProps> = ({
  designId,
  areaType,
  roomId
}) => {
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  
  const handleSelect = async (material: Material) => {
    await selectMaterialForArea({
      designId,
      areaType,
      roomId,
      materialId: material.id
    });
  };
  
  return (
    <Dialog open={true}>
      <DialogTitle>Select {areaType} Material</DialogTitle>
      <DialogContent>
        <MaterialLibrary onSelect={setSelectedMaterial} />
        {selectedMaterial && (
          <MaterialPreview material={selectedMaterial} />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleSelect(selectedMaterial)}>
          Apply Material
        </Button>
      </DialogActions>
    </Dialog>
  );
};
```

---

### 6. Budget Components

#### BudgetDashboard
Overview of project budget.

```tsx
const BudgetDashboard: React.FC<{ projectId: string }> = ({ projectId }) => {
  const { data: budget } = useBudget(projectId);
  
  return (
    <div className="budget-dashboard">
      <BudgetSummary budget={budget} />
      <BudgetChart data={budget.items} />
      <BudgetItemsList items={budget.items} />
    </div>
  );
};
```

---

#### BudgetCalculator
Interactive budget calculator.

```tsx
const BudgetCalculator: React.FC<{ designId: string }> = ({ designId }) => {
  const { data: design } = useDesign(designId);
  const [breakdown, setBreakdown] = useState<BudgetBreakdown | null>(null);
  
  const calculateBudget = async () => {
    const result = await calculateDesignBudget(designId);
    setBreakdown(result);
  };
  
  return (
    <div className="budget-calculator">
      <Button onClick={calculateBudget}>Calculate Budget</Button>
      {breakdown && (
        <>
          <BudgetBreakdownChart data={breakdown} />
          <BudgetDetailsTable data={breakdown} />
        </>
      )}
    </div>
  );
};
```

---

### 7. Timeline Components

#### TimelineView
Gantt chart or timeline view.

```tsx
const TimelineView: React.FC<{ projectId: string }> = ({ projectId }) => {
  const { data: milestones } = useMilestones(projectId);
  
  return (
    <div className="timeline-view">
      <TimelineHeader />
      <GanttChart milestones={milestones} />
      <MilestonesList milestones={milestones} />
    </div>
  );
};
```

---

#### MilestoneCard
Display milestone details.

```tsx
interface MilestoneCardProps {
  milestone: Milestone;
  onUpdate: (milestone: Milestone) => void;
}

const MilestoneCard: React.FC<MilestoneCardProps> = ({ milestone, onUpdate }) => {
  return (
    <Card className="milestone-card">
      <CardContent>
        <Typography variant="h6">{milestone.milestoneName}</Typography>
        <StatusChip status={milestone.status} />
        <DateRange
          start={milestone.plannedStartDate}
          end={milestone.plannedEndDate}
        />
        <ProgressBar value={milestone.completionPercentage} />
      </CardContent>
      <CardActions>
        <Button onClick={() => onUpdate(milestone)}>Update</Button>
      </CardActions>
    </Card>
  );
};
```

---

### 8. Communication Components

#### MessageCenter
Central hub for communications.

```tsx
const MessageCenter: React.FC<{ projectId: string }> = ({ projectId }) => {
  const { data: messages } = useMessages(projectId);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  
  return (
    <div className="message-center">
      <MessageList
        messages={messages}
        onMessageSelect={setSelectedMessage}
      />
      <MessageThread message={selectedMessage} />
      <ComposeMessage projectId={projectId} />
    </div>
  );
};
```

---

#### ChatWindow
Real-time chat interface.

```tsx
const ChatWindow: React.FC<{ projectId: string }> = ({ projectId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const { socket } = useWebSocket();
  
  useEffect(() => {
    socket.on('message', (message: ChatMessage) => {
      setMessages(prev => [...prev, message]);
    });
  }, [socket]);
  
  return (
    <div className="chat-window">
      <MessageList messages={messages} />
      <MessageInput onSend={handleSendMessage} />
    </div>
  );
};
```

---

### 9. Document Components

#### DocumentManager
Document library interface.

```tsx
const DocumentManager: React.FC<{ projectId: string }> = ({ projectId }) => {
  const { data: documents } = useDocuments(projectId);
  
  return (
    <div className="document-manager">
      <DocumentToolbar />
      <DocumentGrid documents={documents} />
      <UploadDialog />
    </div>
  );
};
```

---

#### DocumentViewer
Preview documents.

```tsx
interface DocumentViewerProps {
  document: Document;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ document }) => {
  const renderDocument = () => {
    if (document.mimeType === 'application/pdf') {
      return <PDFViewer url={document.fileUrl} />;
    }
    if (document.mimeType.startsWith('image/')) {
      return <ImageViewer url={document.fileUrl} />;
    }
    return <FileDownloadLink document={document} />;
  };
  
  return (
    <Dialog open fullWidth maxWidth="lg">
      <DialogTitle>{document.documentName}</DialogTitle>
      <DialogContent>
        {renderDocument()}
      </DialogContent>
    </Dialog>
  );
};
```

---

### 10. Common Components

#### Button
Reusable button component.

```tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  onClick,
  children
}) => {
  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? <Spinner /> : children}
    </button>
  );
};
```

---

#### Input
Form input component.

```tsx
interface InputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  required = false
}) => {
  return (
    <div className="input-group">
      <label>
        {label}
        {required && <span className="required">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={error ? 'error' : ''}
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};
```

---

#### Modal
Reusable modal component.

---

#### Card
Reusable card component.

---

#### Table
Data table with sorting and filtering.

---

#### Dropdown
Dropdown menu component.

---

## Custom Hooks

### useAuth
Authentication hook.

```tsx
const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  
  const login = async (email: string, password: string) => {
    const response = await authApi.login(email, password);
    setUser(response.user);
    localStorage.setItem('token', response.token);
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };
  
  return { user, login, logout, isAuthenticated: !!user };
};
```

---

### useProject
Project data hook.

```tsx
const useProject = (projectId: string) => {
  return useQuery(['project', projectId], () => 
    projectsApi.getProject(projectId)
  );
};
```

---

### useDesign
Design data hook.

---

### useMaterials
Materials with filtering.

```tsx
const useMaterials = (filters: MaterialFilters) => {
  return useQuery(['materials', filters], () =>
    materialsApi.getMaterials(filters)
  );
};
```

---

### useWebSocket
WebSocket connection hook.

```tsx
const useWebSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  
  useEffect(() => {
    const ws = io(WS_URL);
    setSocket(ws);
    
    return () => {
      ws.disconnect();
    };
  }, []);
  
  return { socket };
};
```

---

## State Management

### Redux Store Structure (if using Redux)

```
store/
├── auth/
│   ├── authSlice.ts
│   └── authSelectors.ts
├── projects/
│   ├── projectsSlice.ts
│   └── projectsSelectors.ts
├── designs/
│   ├── designsSlice.ts
│   └── designsSelectors.ts
└── store.ts
```

### Zustand Store (Alternative)

```tsx
interface AppStore {
  user: User | null;
  setUser: (user: User | null) => void;
  currentProject: Project | null;
  setCurrentProject: (project: Project | null) => void;
}

const useAppStore = create<AppStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  currentProject: null,
  setCurrentProject: (project) => set({ currentProject: project })
}));
```

---

## Responsive Design

### Breakpoints
```scss
$breakpoints: (
  'mobile': 320px,
  'tablet': 768px,
  'desktop': 1024px,
  'wide': 1440px
);
```

### Mobile-First Approach
- Design for mobile first
- Progressive enhancement for larger screens
- Touch-friendly UI elements
- Simplified navigation on mobile

---

## Performance Optimization

1. **Code Splitting**: Lazy load routes and components
2. **Memoization**: Use React.memo for expensive components
3. **Virtual Scrolling**: For large lists (react-window)
4. **Image Optimization**: Lazy loading and WebP format
5. **Caching**: React Query for server state caching

---

## Accessibility

- **ARIA labels** on all interactive elements
- **Keyboard navigation** support
- **Screen reader** friendly
- **Color contrast** WCAG AA compliant
- **Focus indicators** visible and clear

---

## Testing Strategy

- **Unit Tests**: Jest + React Testing Library
- **Integration Tests**: Testing user flows
- **E2E Tests**: Cypress or Playwright
- **Visual Regression**: Chromatic or Percy

---

## Deployment

- **Build**: `npm run build`
- **Preview**: `npm run preview`
- **Deploy**: CI/CD pipeline (GitHub Actions, Vercel, Netlify)
- **Environment Variables**: `.env` files for different environments

---

This frontend architecture provides a solid foundation for building a modern, scalable builder app with excellent user experience.
