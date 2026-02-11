#!/bin/bash
set -e

echo "🚀 Starting Home Builder App Development Setup..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check Node.js
echo "📦 Checking prerequisites..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "   Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi
echo -e "${GREEN}✅ Node.js $(node --version)${NC}"

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ npm $(npm --version)${NC}"

# Check PostgreSQL
if ! command -v psql &> /dev/null; then
    echo -e "${RED}❌ PostgreSQL is not installed${NC}"
    echo "   macOS: brew install postgresql@14"
    echo "   Ubuntu/Debian: sudo apt-get install postgresql postgresql-contrib"
    exit 1
fi
echo -e "${GREEN}✅ PostgreSQL installed${NC}"

# Check if PostgreSQL is running
if ! pg_isready &> /dev/null; then
    echo -e "${RED}❌ PostgreSQL is not running${NC}"
    echo "   macOS: brew services start postgresql@14"
    echo "   Ubuntu/Debian: sudo systemctl start postgresql"
    exit 1
fi
echo -e "${GREEN}✅ PostgreSQL is running${NC}"

echo ""
echo "📥 Installing dependencies..."

# Install frontend dependencies
echo -e "${BLUE}Installing frontend dependencies...${NC}"
npm install

# Install backend dependencies
echo -e "${BLUE}Installing backend dependencies...${NC}"
cd backend
npm install
cd ..

echo -e "${GREEN}✅ Dependencies installed${NC}"

# Setup environment files
echo ""
echo "⚙️  Setting up environment files..."

# Frontend .env
if [ ! -f .env ]; then
    echo -e "${BLUE}Creating frontend .env file...${NC}"
    cat > .env << 'EOF'
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
EOF
    echo -e "${GREEN}✅ Created .env${NC}"
else
    echo -e "${GREEN}✅ .env already exists${NC}"
fi

# Backend .env
if [ ! -f backend/.env ]; then
    echo -e "${BLUE}Creating backend .env file...${NC}"
    
    # Generate a random JWT secret
    JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
    
    cat > backend/.env << EOF
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/home_builder_db
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
EOF
    echo -e "${GREEN}✅ Created backend/.env with generated JWT_SECRET${NC}"
else
    echo -e "${GREEN}✅ backend/.env already exists${NC}"
fi

# Setup database
echo ""
echo "🗄️  Setting up database..."
createdb home_builder_db 2>/dev/null || echo -e "${BLUE}Database already exists${NC}"

# Seed database
echo -e "${BLUE}Seeding database with materials and categories...${NC}"
cd backend
npm run seed
cd ..
echo -e "${GREEN}✅ Database seeded with 70+ materials${NC}"

# Build frontend
echo ""
echo "🏗️  Building frontend..."
npm run build
echo -e "${GREEN}✅ Frontend built successfully${NC}"

# Success message
echo ""
echo -e "${GREEN}════════════════════════════════════════════════${NC}"
echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo -e "${GREEN}════════════════════════════════════════════════${NC}"
echo ""
echo "🚀 To start the application:"
echo ""
echo "   Terminal 1 (Backend):"
echo -e "   ${BLUE}cd backend && npm run dev${NC}"
echo ""
echo "   Terminal 2 (Frontend):"
echo -e "   ${BLUE}npm run dev${NC}"
echo ""
echo "📍 Application URLs:"
echo "   Frontend: http://localhost:5173"
echo "   Backend API: http://localhost:5000/api"
echo ""
echo "📚 Documentation:"
echo "   - STATUS_AND_NEXT_STEPS.md"
echo "   - FRONTEND_SERVICES.md"
echo "   - backend/README.md"
echo ""
