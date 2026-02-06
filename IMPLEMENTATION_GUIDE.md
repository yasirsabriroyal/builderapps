# Implementation Guide & Setup Instructions

## Overview
Step-by-step guide to implement and deploy the Builder App from scratch.

---

## Phase 1: MVP Development (3-4 Months)

### Week 1-2: Project Setup & Infrastructure

#### 1. Initialize Repository
```bash
# Backend
mkdir builder-app-backend
cd builder-app-backend
npm init -y
npm install express typescript @types/express @types/node
npm install pg sequelize jsonwebtoken bcrypt
npm install -D nodemon ts-node

# Frontend
npx create-react-app builder-app-frontend --template typescript
cd builder-app-frontend
npm install @mui/material @emotion/react @emotion/styled
npm install react-router-dom react-query axios
npm install @reduxjs/toolkit react-redux
```

#### 2. Database Setup
```sql
-- Create PostgreSQL database
CREATE DATABASE builder_app;

-- Run migration scripts from DATABASE_SCHEMA.md
psql -U postgres -d builder_app -f schema.sql
```

#### 3. Environment Configuration

**Backend `.env`**:
```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/builder_app
JWT_SECRET=your_jwt_secret_key
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_S3_BUCKET=builder-app-storage
SENDGRID_API_KEY=your_sendgrid_key
```

**Frontend `.env`**:
```env
REACT_APP_API_URL=http://localhost:3000/api/v1
REACT_APP_WS_URL=ws://localhost:3000
```

---

### Week 3-4: Authentication System

#### Backend Implementation

**1. User Model** (`models/User.ts`):
```typescript
import { DataTypes, Model } from 'sequelize';
import bcrypt from 'bcrypt';

class User extends Model {
  public id!: string;
  public email!: string;
  public passwordHash!: string;
  public firstName!: string;
  public lastName!: string;
  public role!: string;
  
  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.passwordHash);
  }
}

User.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  firstName: DataTypes.STRING,
  lastName: DataTypes.STRING,
  role: DataTypes.STRING
}, { sequelize, tableName: 'users' });
```

**2. Auth Controller** (`controllers/authController.ts`):
```typescript
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/User';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;
    
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    
    const passwordHash = await bcrypt.hash(password, 10);
    
    const user = await User.create({
      email,
      passwordHash,
      firstName,
      lastName,
      role: role || 'client'
    });
    
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      success: true,
      data: { user, token }
    });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const isValid = await user.validatePassword(password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );
    
    res.json({
      success: true,
      data: { user, token }
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
};
```

**3. Auth Middleware** (`middleware/auth.ts`):
```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  const token = authHeader.substring(7);
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
```

#### Frontend Implementation

**1. Auth Context** (`contexts/AuthContext.tsx`):
```typescript
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  
  const login = async (email: string, password: string) => {
    const response = await axios.post('/api/v1/auth/login', { email, password });
    const { user, token } = response.data.data;
    
    setUser(user);
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  };
  
  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
```

**2. Login Page** (`pages/Login.tsx`):
```typescript
import React from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const { register, handleSubmit } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const onSubmit = async (data: any) => {
    try {
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed', error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} type="email" placeholder="Email" />
      <input {...register('password')} type="password" placeholder="Password" />
      <button type="submit">Login</button>
    </form>
  );
};
```

---

### Week 5-8: Projects & Designs

#### 1. Project CRUD Operations
- Create project model and controllers
- Implement project list, create, update, delete endpoints
- Create project dashboard UI
- Implement project cards and list views

#### 2. Design Versions
- Create design model linked to projects
- Version control for designs
- Design approval workflow
- Design comparison view

---

### Week 9-12: Basic Floor Plan Designer

#### 1. Canvas Setup
```typescript
import { fabric } from 'fabric';

const initializeCanvas = (canvasElement: HTMLCanvasElement) => {
  const canvas = new fabric.Canvas(canvasElement, {
    width: 1000,
    height: 800,
    backgroundColor: '#ffffff'
  });
  
  return canvas;
};
```

#### 2. Drawing Tools
```typescript
const addWall = (canvas: fabric.Canvas, x1: number, y1: number, x2: number, y2: number) => {
  const wall = new fabric.Line([x1, y1, x2, y2], {
    stroke: '#000000',
    strokeWidth: 6,
    selectable: true
  });
  
  canvas.add(wall);
};

const addRoom = (canvas: fabric.Canvas, x: number, y: number, width: number, height: number) => {
  const room = new fabric.Rect({
    left: x,
    top: y,
    width: width,
    height: height,
    fill: 'rgba(200, 200, 200, 0.3)',
    stroke: '#000000',
    strokeWidth: 2
  });
  
  canvas.add(room);
};
```

#### 3. Save/Load Floor Plans
```typescript
const saveFloorPlan = (canvas: fabric.Canvas) => {
  const json = JSON.stringify(canvas.toJSON());
  return json;
};

const loadFloorPlan = (canvas: fabric.Canvas, jsonData: string) => {
  canvas.loadFromJSON(jsonData, () => {
    canvas.renderAll();
  });
};
```

---

### Week 13-14: Material Selector (Basic)

#### 1. Material Database Seeding
```typescript
const seedMaterials = async () => {
  const materials = [
    {
      categoryId: 'flooring-category-id',
      materialName: 'Oak Hardwood',
      manufacturer: 'Premium Woods',
      pricePerUnit: 8.50,
      unitType: 'sqft',
      thumbnailUrl: 'https://example.com/oak.jpg'
    },
    // Add more materials
  ];
  
  await Material.bulkCreate(materials);
};
```

#### 2. Material Library UI
- Grid view of materials
- Search and filter functionality
- Material detail modal
- Add to favorites

---

### Week 15-16: Budget Calculator & Document Storage

#### 1. Budget Calculator
```typescript
const calculateDesignBudget = async (designId: string) => {
  const design = await Design.findByPk(designId, {
    include: [MaterialSelection]
  });
  
  let totalMaterialCost = 0;
  
  for (const selection of design.materialSelections) {
    const cost = selection.quantity * selection.material.pricePerUnit;
    totalMaterialCost += cost;
  }
  
  const laborCost = design.totalSqft * 50; // $50 per sqft estimate
  const permitCost = 5000; // Flat estimate
  
  return {
    materials: totalMaterialCost,
    labor: laborCost,
    permits: permitCost,
    total: totalMaterialCost + laborCost + permitCost
  };
};
```

#### 2. Document Upload
```typescript
import AWS from 'aws-sdk';
import multer from 'multer';

const s3 = new AWS.S3();
const upload = multer({ storage: multer.memoryStorage() });

export const uploadDocument = async (req: Request, res: Response) => {
  const file = req.file;
  
  const params = {
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: `documents/${Date.now()}-${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype
  };
  
  const result = await s3.upload(params).promise();
  
  const document = await Document.create({
    projectId: req.body.projectId,
    documentName: file.originalname,
    documentType: req.body.documentType,
    fileUrl: result.Location,
    fileSizeBytes: file.size,
    mimeType: file.mimetype,
    uploadedBy: req.user.userId
  });
  
  res.status(201).json({ success: true, data: document });
};
```

---

## Phase 2: Enhanced Features (3-4 Months)

### 3D Visualization

```typescript
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const create3DModel = (floorPlan: FloorPlan) => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer();
  
  // Add walls
  floorPlan.walls.forEach(wall => {
    const wallGeometry = new THREE.BoxGeometry(
      wall.length, 
      8, // height
      0.5 // thickness
    );
    const wallMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc });
    const wallMesh = new THREE.Mesh(wallGeometry, wallMaterial);
    scene.add(wallMesh);
  });
  
  // Add floor
  const floorGeometry = new THREE.PlaneGeometry(100, 100);
  const floorMaterial = new THREE.MeshBasicMaterial({ color: 0xf0f0f0 });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);
  
  camera.position.set(50, 50, 50);
  camera.lookAt(0, 0, 0);
  
  return { scene, camera, renderer };
};
```

### Timeline & Milestones

- Gantt chart implementation using react-gantt-chart
- Milestone creation and tracking
- Critical path calculation
- Progress updates

### Mobile App (Basic)

```bash
# React Native setup
npx react-native init BuilderAppMobile --template react-native-template-typescript

# Install dependencies
npm install @react-navigation/native @react-navigation/stack
npm install react-native-vector-icons
npm install @react-native-async-storage/async-storage
```

---

## Phase 3: Advanced Features (4-6 Months)

### AR/VR Integration

```typescript
// AR.js integration for augmented reality
import * as AFRAME from 'aframe';
import 'aframe-ar';

const ARViewer = () => {
  return (
    <a-scene embedded arjs>
      <a-marker preset="hiro">
        <a-box position="0 0.5 0" material="color: red;"></a-box>
      </a-marker>
      <a-entity camera></a-entity>
    </a-scene>
  );
};
```

### AI Recommendations

```python
# Python ML service for recommendations
from sklearn.ensemble import RandomForestClassifier
import numpy as np

def recommend_materials(user_preferences, design_style):
    # Load trained model
    model = load_model('material_recommender.pkl')
    
    # Prepare features
    features = prepare_features(user_preferences, design_style)
    
    # Get predictions
    recommendations = model.predict_proba(features)
    
    return recommendations
```

---

## Testing Strategy

### Unit Tests

```typescript
// Jest test example
describe('Budget Calculator', () => {
  it('should calculate total budget correctly', () => {
    const design = {
      totalSqft: 2000,
      materialSelections: [
        { quantity: 500, material: { pricePerUnit: 10 } }
      ]
    };
    
    const budget = calculateDesignBudget(design);
    
    expect(budget.total).toBe(110000); // 5000 + 100000 + 5000
  });
});
```

### Integration Tests

```typescript
// Supertest API testing
import request from 'supertest';
import app from '../app';

describe('Auth API', () => {
  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: 'test@example.com',
        password: 'SecurePass123',
        firstName: 'Test',
        lastName: 'User'
      });
    
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
  });
});
```

### E2E Tests

```typescript
// Cypress test
describe('Floor Plan Editor', () => {
  it('should create a new floor plan', () => {
    cy.visit('/projects/123/designs/456/floor-plan');
    cy.get('[data-cy=add-wall-tool]').click();
    cy.get('canvas').click(100, 100);
    cy.get('canvas').click(200, 100);
    cy.get('[data-cy=save-button]').click();
    cy.contains('Floor plan saved').should('be.visible');
  });
});
```

---

## Deployment

### Docker Setup

**Dockerfile (Backend)**:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/server.js"]
```

**docker-compose.yml**:
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: builder_app
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres-data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
  
  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://postgres:password@postgres:5432/builder_app
      JWT_SECRET: your_secret
    depends_on:
      - postgres
  
  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  postgres-data:
```

### CI/CD Pipeline

**GitHub Actions** (`.github/workflows/deploy.yml`):
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm test
  
  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to production
        run: |
          # Deploy commands
          npm run deploy
```

---

## Performance Optimization

### Database Indexes
```sql
CREATE INDEX CONCURRENTLY idx_projects_owner ON projects(owner_id);
CREATE INDEX CONCURRENTLY idx_designs_project ON designs(project_id);
CREATE INDEX CONCURRENTLY idx_materials_category ON materials(category_id);
```

### Caching Strategy
```typescript
import Redis from 'redis';

const redis = Redis.createClient();

const getCachedMaterials = async (categoryId: string) => {
  const cacheKey = `materials:${categoryId}`;
  const cached = await redis.get(cacheKey);
  
  if (cached) {
    return JSON.parse(cached);
  }
  
  const materials = await Material.findAll({ where: { categoryId } });
  await redis.setex(cacheKey, 3600, JSON.stringify(materials));
  
  return materials;
};
```

---

## Security Best Practices

1. **Input Validation**: Use Joi or Yup for request validation
2. **Rate Limiting**: Implement rate limiting with express-rate-limit
3. **SQL Injection Prevention**: Use parameterized queries (Sequelize does this)
4. **XSS Protection**: Sanitize user input
5. **CORS**: Configure proper CORS policies
6. **HTTPS**: Always use HTTPS in production
7. **Password Policy**: Enforce strong passwords
8. **2FA**: Implement two-factor authentication
9. **Data Encryption**: Encrypt sensitive data at rest
10. **Regular Security Audits**: Use npm audit and dependency scanning

---

## Monitoring & Logging

```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Use in application
logger.info('User logged in', { userId: user.id });
logger.error('Database connection failed', { error: err.message });
```

---

## Maintenance & Support

### Backup Strategy
- Daily automated database backups
- Weekly full system backups
- Point-in-time recovery enabled
- Test restore procedures monthly

### Update Schedule
- Security patches: Immediately
- Bug fixes: Weekly releases
- Feature updates: Bi-weekly or monthly
- Major versions: Quarterly with migration guides

---

This implementation guide provides a comprehensive roadmap for building the Builder App from concept to production deployment.
