# Development Best Practices & Tips

## Overview
This document provides best practices, coding standards, and helpful tips for the Builder App development team.

---

## Code Quality Standards

### 1. General Principles

#### SOLID Principles
- **Single Responsibility**: Each module/class should have one reason to change
- **Open/Closed**: Open for extension, closed for modification
- **Liskov Substitution**: Subtypes must be substitutable for base types
- **Interface Segregation**: Many specific interfaces > one general interface
- **Dependency Inversion**: Depend on abstractions, not concretions

#### DRY (Don't Repeat Yourself)
```typescript
// ❌ Bad - Repeated code
function calculateMaterialCost(quantity: number, price: number) {
  return quantity * price * 1.08; // Sales tax
}

function calculateLaborCost(hours: number, rate: number) {
  return hours * rate * 1.08; // Sales tax
}

// ✅ Good - Reusable function
function applyTax(amount: number, taxRate: number = 0.08) {
  return amount * (1 + taxRate);
}

function calculateMaterialCost(quantity: number, price: number) {
  return applyTax(quantity * price);
}

function calculateLaborCost(hours: number, rate: number) {
  return applyTax(hours * rate);
}
```

#### KISS (Keep It Simple, Stupid)
```typescript
// ❌ Bad - Overly complex
const isValidEmail = (email: string) => {
  return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
};

// ✅ Good - Simple and clear
const isValidEmail = (email: string) => {
  return email.includes('@') && email.includes('.');
};
// Or use a well-tested library like validator.js
```

---

### 2. TypeScript Best Practices

#### Strong Typing
```typescript
// ❌ Bad - Using 'any'
function processData(data: any) {
  return data.map((item: any) => item.value);
}

// ✅ Good - Proper types
interface DataItem {
  id: string;
  value: number;
}

function processData(data: DataItem[]): number[] {
  return data.map(item => item.value);
}
```

#### Interface vs Type
```typescript
// Use Interface for objects that can be extended
interface User {
  id: string;
  email: string;
}

interface Admin extends User {
  permissions: string[];
}

// Use Type for unions, intersections, or mapped types
type Status = 'active' | 'inactive' | 'pending';
type Result = Success | Error;
```

#### Optional Chaining & Nullish Coalescing
```typescript
// ✅ Good - Safe property access
const userName = user?.profile?.name ?? 'Guest';
const userAge = user?.profile?.age ?? 0;
```

---

### 3. React Best Practices

#### Component Structure
```typescript
// ✅ Good component structure
import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';

interface ProjectCardProps {
  projectId: string;
  onSelect: (id: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ 
  projectId, 
  onSelect 
}) => {
  // 1. Hooks first
  const { data, isLoading } = useQuery(['project', projectId], fetchProject);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // 2. Effects
  useEffect(() => {
    // Component mount logic
  }, []);
  
  // 3. Event handlers
  const handleClick = () => {
    onSelect(projectId);
  };
  
  // 4. Conditional rendering logic
  if (isLoading) return <Skeleton />;
  if (!data) return <ErrorMessage />;
  
  // 5. Return JSX
  return (
    <Card onClick={handleClick}>
      <CardContent>
        <Typography>{data.name}</Typography>
      </CardContent>
    </Card>
  );
};
```

#### Custom Hooks
```typescript
// ✅ Good - Reusable custom hook
function useProject(projectId: string) {
  const { data, isLoading, error } = useQuery(
    ['project', projectId],
    () => fetchProject(projectId),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000 // 10 minutes
    }
  );
  
  return { project: data, isLoading, error };
}

// Usage
function ProjectDetails({ projectId }: Props) {
  const { project, isLoading, error } = useProject(projectId);
  
  // Component logic
}
```

#### Memoization
```typescript
// Use React.memo for expensive components
export const ExpensiveComponent = React.memo(({ data }: Props) => {
  return <div>{/* Expensive rendering */}</div>;
});

// Use useMemo for expensive calculations
function ProjectBudget({ items }: Props) {
  const totalCost = useMemo(() => {
    return items.reduce((sum, item) => sum + item.cost, 0);
  }, [items]);
  
  return <div>Total: ${totalCost}</div>;
}

// Use useCallback for event handlers passed to children
function ParentComponent() {
  const [count, setCount] = useState(0);
  
  const handleClick = useCallback(() => {
    setCount(c => c + 1);
  }, []); // Empty deps since using functional update
  
  return <ChildComponent onClick={handleClick} />;
}
```

---

### 4. Backend Best Practices

#### Error Handling
```typescript
// ✅ Good - Comprehensive error handling
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational: boolean = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

// Controller with error handling
export const createProject = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, type, budget } = req.body;
    
    // Validation
    if (!name) {
      throw new AppError(400, 'Project name is required');
    }
    
    const project = await Project.create({
      name,
      type,
      budget,
      ownerId: req.user.id
    });
    
    res.status(201).json({
      success: true,
      data: project
    });
  } catch (error) {
    next(error); // Pass to error middleware
  }
};

// Global error handler
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message
      }
    });
  }
  
  // Unexpected errors
  console.error('ERROR:', err);
  res.status(500).json({
    success: false,
    error: {
      message: 'Something went wrong'
    }
  });
};
```

#### Input Validation
```typescript
import Joi from 'joi';

// ✅ Good - Schema validation
const projectSchema = Joi.object({
  name: Joi.string().min(3).max(255).required(),
  type: Joi.string().valid('new_construction', 'renovation', 'addition').required(),
  budget: Joi.number().min(0).required(),
  address: Joi.string().max(500).optional()
});

export const validateProject = (req: Request, res: Response, next: NextFunction) => {
  const { error } = projectSchema.validate(req.body);
  
  if (error) {
    throw new AppError(400, error.details[0].message);
  }
  
  next();
};

// Usage in route
router.post('/projects', authenticate, validateProject, createProject);
```

#### Async/Await Best Practices
```typescript
// ✅ Good - Proper async/await usage
async function createProjectWithDesign(projectData: ProjectData, designData: DesignData) {
  const transaction = await sequelize.transaction();
  
  try {
    // Create project
    const project = await Project.create(projectData, { transaction });
    
    // Create initial design
    const design = await Design.create({
      ...designData,
      projectId: project.id
    }, { transaction });
    
    await transaction.commit();
    return { project, design };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
```

---

### 5. Database Best Practices

#### Query Optimization
```typescript
// ❌ Bad - N+1 query problem
async function getProjectsWithDesigns() {
  const projects = await Project.findAll();
  
  for (const project of projects) {
    project.designs = await Design.findAll({
      where: { projectId: project.id }
    });
  }
  
  return projects;
}

// ✅ Good - Use eager loading
async function getProjectsWithDesigns() {
  return await Project.findAll({
    include: [{
      model: Design,
      as: 'designs'
    }]
  });
}
```

#### Pagination
```typescript
// ✅ Good - Efficient pagination
async function getProjects(page: number = 1, limit: number = 20) {
  const offset = (page - 1) * limit;
  
  const { count, rows } = await Project.findAndCountAll({
    limit,
    offset,
    order: [['createdAt', 'DESC']]
  });
  
  return {
    projects: rows,
    pagination: {
      page,
      limit,
      total: count,
      pages: Math.ceil(count / limit)
    }
  };
}
```

#### Indexes
```sql
-- ✅ Good - Add indexes for frequently queried columns
CREATE INDEX idx_projects_owner_id ON projects(owner_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_designs_project_id ON designs(project_id);
CREATE INDEX idx_materials_category_id ON materials(category_id);

-- Composite indexes for common queries
CREATE INDEX idx_projects_owner_status ON projects(owner_id, status);
```

---

### 6. Security Best Practices

#### Authentication
```typescript
// ✅ Good - Secure password hashing
import bcrypt from 'bcrypt';

async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}
```

#### Authorization
```typescript
// ✅ Good - Role-based access control
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError(401, 'Not authenticated');
    }
    
    if (!roles.includes(req.user.role)) {
      throw new AppError(403, 'Not authorized');
    }
    
    next();
  };
};

// Usage
router.delete('/projects/:id', 
  authenticate, 
  authorize('admin', 'project_manager'), 
  deleteProject
);
```

#### Input Sanitization
```typescript
import DOMPurify from 'isomorphic-dompurify';

// ✅ Good - Sanitize user input
function sanitizeInput(input: string): string {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  });
}

// Usage
const safeDescription = sanitizeInput(req.body.description);
```

#### SQL Injection Prevention
```typescript
// ✅ Good - Always use parameterized queries
// Sequelize does this automatically
const user = await User.findOne({
  where: { email: userEmail } // Safe - parameterized
});

// ❌ Bad - Never use string concatenation
// const query = `SELECT * FROM users WHERE email = '${userEmail}'`; // Vulnerable!
```

---

### 7. Testing Best Practices

#### Unit Tests
```typescript
// ✅ Good - Well-structured test
describe('calculateBudget', () => {
  it('should calculate total budget correctly', () => {
    // Arrange
    const items = [
      { cost: 1000, quantity: 2 },
      { cost: 500, quantity: 3 }
    ];
    
    // Act
    const total = calculateBudget(items);
    
    // Assert
    expect(total).toBe(3500);
  });
  
  it('should handle empty items', () => {
    expect(calculateBudget([])).toBe(0);
  });
  
  it('should throw error for negative costs', () => {
    const items = [{ cost: -100, quantity: 1 }];
    expect(() => calculateBudget(items)).toThrow();
  });
});
```

#### Integration Tests
```typescript
// ✅ Good - API integration test
describe('POST /api/projects', () => {
  it('should create a new project', async () => {
    const response = await request(app)
      .post('/api/v1/projects')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'Test Project',
        type: 'new_construction',
        budget: 300000
      });
    
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('id');
    expect(response.body.data.name).toBe('Test Project');
  });
});
```

---

### 8. Performance Optimization

#### Code Splitting
```typescript
// ✅ Good - Lazy load routes
import { lazy, Suspense } from 'react';

const ProjectDashboard = lazy(() => import('./pages/ProjectDashboard'));
const FloorPlanEditor = lazy(() => import('./pages/FloorPlanEditor'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/dashboard" element={<ProjectDashboard />} />
        <Route path="/editor" element={<FloorPlanEditor />} />
      </Routes>
    </Suspense>
  );
}
```

#### Image Optimization
```typescript
// ✅ Good - Responsive images
<picture>
  <source 
    srcSet="/images/project-large.webp" 
    type="image/webp" 
    media="(min-width: 1024px)"
  />
  <source 
    srcSet="/images/project-medium.webp" 
    type="image/webp" 
    media="(min-width: 768px)"
  />
  <img 
    src="/images/project-small.jpg" 
    alt="Project thumbnail"
    loading="lazy"
  />
</picture>
```

#### Caching Strategy
```typescript
// ✅ Good - Multi-level caching
import Redis from 'redis';

const redis = Redis.createClient();

async function getMaterial(materialId: string) {
  // 1. Check memory cache (React Query handles this)
  
  // 2. Check Redis cache
  const cached = await redis.get(`material:${materialId}`);
  if (cached) {
    return JSON.parse(cached);
  }
  
  // 3. Query database
  const material = await Material.findByPk(materialId);
  
  // 4. Cache for future requests
  await redis.setex(
    `material:${materialId}`,
    3600, // 1 hour
    JSON.stringify(material)
  );
  
  return material;
}
```

---

### 9. Git Workflow

#### Commit Messages
```bash
# ✅ Good commit messages
git commit -m "feat: add material search functionality"
git commit -m "fix: resolve budget calculation rounding error"
git commit -m "docs: update API documentation for projects endpoint"
git commit -m "refactor: extract budget calculation to utility function"
git commit -m "test: add unit tests for floor plan validation"

# Commit message format:
# <type>: <description>
#
# Types: feat, fix, docs, style, refactor, test, chore
```

#### Branch Strategy
```bash
# Main branches
main         # Production-ready code
develop      # Integration branch

# Feature branches
feature/floor-plan-editor
feature/material-selector

# Bugfix branches
bugfix/budget-calculation
bugfix/login-redirect

# Hotfix branches (for production)
hotfix/security-vulnerability
```

---

### 10. Documentation Best Practices

#### Code Comments
```typescript
// ✅ Good - Explain WHY, not WHAT
// Use Haversine formula to calculate distance between coordinates
// Standard formula doesn't work well for short distances
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  // Implementation
}

// ❌ Bad - States the obvious
// Set the user name
const userName = user.name;
```

#### JSDoc Comments
```typescript
/**
 * Calculates the total budget for a design including materials and labor
 * 
 * @param designId - The unique identifier of the design
 * @param options - Optional configuration
 * @param options.includeTax - Whether to include sales tax (default: true)
 * @param options.includeContingency - Whether to include contingency (default: true)
 * @returns Promise<BudgetBreakdown> - Detailed budget breakdown
 * @throws {AppError} - If design is not found
 * 
 * @example
 * ```typescript
 * const budget = await calculateDesignBudget('design-id', { 
 *   includeTax: false 
 * });
 * console.log(budget.total);
 * ```
 */
async function calculateDesignBudget(
  designId: string,
  options?: BudgetOptions
): Promise<BudgetBreakdown> {
  // Implementation
}
```

---

### 11. Common Pitfalls to Avoid

#### 1. Mutating State Directly
```typescript
// ❌ Bad
state.items.push(newItem);
setState(state);

// ✅ Good
setState({
  ...state,
  items: [...state.items, newItem]
});
```

#### 2. Not Handling Errors
```typescript
// ❌ Bad
async function fetchData() {
  const response = await fetch('/api/data');
  return response.json();
}

// ✅ Good
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch data:', error);
    throw error;
  }
}
```

#### 3. Memory Leaks
```typescript
// ❌ Bad - Forgot to cleanup
useEffect(() => {
  const interval = setInterval(() => {
    // Do something
  }, 1000);
}, []);

// ✅ Good - Cleanup on unmount
useEffect(() => {
  const interval = setInterval(() => {
    // Do something
  }, 1000);
  
  return () => clearInterval(interval);
}, []);
```

---

### 12. Useful Tools & Resources

#### Development Tools
- **ESLint**: Catch errors early
- **Prettier**: Consistent code formatting
- **Husky**: Git hooks for pre-commit checks
- **lint-staged**: Run linters on staged files
- **TypeScript**: Type safety

#### Testing Tools
- **Jest**: Unit testing
- **React Testing Library**: Component testing
- **Cypress**: E2E testing
- **Supertest**: API testing
- **MSW**: API mocking

#### Monitoring & Debugging
- **Sentry**: Error tracking
- **LogRocket**: Session replay
- **React DevTools**: Debug React apps
- **Redux DevTools**: Debug Redux state

---

### 13. Code Review Checklist

Before submitting PR:
- [ ] Code follows style guidelines
- [ ] All tests pass
- [ ] New tests added for new features
- [ ] Documentation updated
- [ ] No console.logs or debugger statements
- [ ] Error handling implemented
- [ ] Performance considered
- [ ] Security vulnerabilities checked
- [ ] Accessibility requirements met
- [ ] Mobile responsiveness verified

---

### 14. Performance Benchmarks

Target metrics:
- **Lighthouse Score**: >90
- **First Contentful Paint**: <1.5s
- **Time to Interactive**: <3.5s
- **Bundle Size**: <500KB (gzipped)
- **API Response Time**: <200ms (p95)
- **Database Queries**: <50ms (p95)

---

## Conclusion

Following these best practices will ensure the Builder App codebase remains maintainable, scalable, and high-quality. Always prioritize code clarity, security, and user experience.

---

**Remember**: The best code is code that others can easily understand and maintain!
