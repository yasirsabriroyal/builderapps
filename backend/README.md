# Builder App - Backend API

Express.js backend API for the Builder App.

## Setup

1. **Install dependencies**
```bash
npm install
```

2. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your database credentials
```

3. **Create database**
```bash
createdb builder_app
# Or use psql:
# psql -U postgres
# CREATE DATABASE builder_app;
```

4. **Start development server**
```bash
npm run dev
```

The server will start on `http://localhost:3001`

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user (requires auth)

### Projects
- `GET /api/v1/projects` - List user's projects (requires auth)
- `GET /api/v1/projects/:id` - Get project details (requires auth)
- `POST /api/v1/projects` - Create new project (requires auth)
- `PATCH /api/v1/projects/:id` - Update project (requires auth)
- `DELETE /api/v1/projects/:id` - Delete project (requires auth)

### Health Check
- `GET /health` - Server health status

## Database

The application uses PostgreSQL with Sequelize ORM. Models are automatically synced on server start.

### Models
- User - User accounts and authentication
- Project - Construction projects

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server

## Tech Stack

- Node.js + TypeScript
- Express.js
- PostgreSQL + Sequelize
- JWT Authentication
- Bcrypt for password hashing
- Joi for validation
