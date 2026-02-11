# Development Setup Guide

## Quick Start (Recommended)

### Unix/Linux/macOS:
```bash
chmod +x setup-dev.sh
./setup-dev.sh
```

### Windows:
```batch
setup-dev.bat
```

## Manual Setup

### Prerequisites
- Node.js 18+ 
- PostgreSQL 12+
- npm 8+

### Step 1: Install Dependencies
```bash
npm install
cd backend && npm install && cd ..
```

### Step 2: Setup Environment Files
Copy the templates and configure:
```bash
cp .env.example .env
cp backend/.env.example backend/.env
```

Edit `backend/.env` and update:
- `DATABASE_URL` - Your PostgreSQL connection string
- `JWT_SECRET` - Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### Step 3: Setup Database
```bash
createdb home_builder_db
cd backend && npm run seed
```

### Step 4: Verify Setup
```bash
npm run verify
```

### Step 5: Start Development Servers

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
npm run dev
```

## Verification
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- Health check: http://localhost:5000/api/v1/health

## Troubleshooting

### PostgreSQL not running
```bash
# macOS
brew services start postgresql@14

# Ubuntu/Debian
sudo systemctl start postgresql

# Windows
# Start from Services or pgAdmin
```

### Port already in use
Change ports in `.env` files or kill existing processes:
```bash
# Find process on port 5000
lsof -ti:5000 | xargs kill -9

# Find process on port 5173
lsof -ti:5173 | xargs kill -9
```

### Database connection error
Verify PostgreSQL credentials in `backend/.env`:
```bash
psql -U postgres -c "SELECT 1"
```
