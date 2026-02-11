#!/bin/bash

# Quick Start Script for Home Builder App
# This script helps set up the development environment

echo "======================================"
echo "Home Builder App - Quick Start Setup"
echo "======================================"
echo ""

# Check if PostgreSQL is installed
echo "Checking for PostgreSQL..."
if command -v psql &> /dev/null; then
    echo "✅ PostgreSQL is installed"
    psql --version
else
    echo "❌ PostgreSQL is NOT installed"
    echo ""
    echo "Please install PostgreSQL first:"
    echo "  macOS:   brew install postgresql"
    echo "  Ubuntu:  sudo apt-get install postgresql"
    echo "  Windows: Download from https://www.postgresql.org/download/windows/"
    echo ""
    exit 1
fi

echo ""
echo "======================================"
echo "Step 1: Create Database"
echo "======================================"
echo ""
echo "Creating database 'home_builder_db'..."
echo "You may need to enter your PostgreSQL password"
echo ""

# Create database (if it doesn't exist)
psql postgres -c "CREATE DATABASE home_builder_db;" 2>/dev/null || echo "Database may already exist"

echo ""
echo "======================================"
echo "Step 2: Setup Environment Files"
echo "======================================"
echo ""

# Setup backend .env
if [ ! -f backend/.env ]; then
    echo "Creating backend/.env from example..."
    cp backend/.env.example backend/.env
    echo "✅ Created backend/.env"
    echo ""
    echo "⚠️  IMPORTANT: Edit backend/.env and update:"
    echo "   - DATABASE_URL with your PostgreSQL credentials"
    echo "   - JWT_SECRET with a secure random string"
    echo ""
else
    echo "✅ backend/.env already exists"
fi

# Setup frontend .env
if [ ! -f .env ]; then
    echo "Creating .env from example..."
    cp .env.example .env
    echo "✅ Created .env"
else
    echo "✅ .env already exists"
fi

echo ""
echo "======================================"
echo "Step 3: Install Dependencies"
echo "======================================"
echo ""

# Install frontend dependencies
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
else
    echo "✅ Frontend dependencies already installed"
fi

# Install backend dependencies
if [ ! -d "backend/node_modules" ]; then
    echo "Installing backend dependencies..."
    cd backend && npm install && cd ..
else
    echo "✅ Backend dependencies already installed"
fi

echo ""
echo "======================================"
echo "Step 4: Build Backend"
echo "======================================"
echo ""
cd backend
npm run build
cd ..

echo ""
echo "======================================"
echo "✅ Setup Complete!"
echo "======================================"
echo ""
echo "Next steps:"
echo ""
echo "1. Edit backend/.env if you haven't already:"
echo "   - Update DATABASE_URL with your PostgreSQL credentials"
echo "   - Set a secure JWT_SECRET"
echo ""
echo "2. Start the backend server:"
echo "   cd backend && npm run dev"
echo ""
echo "3. In a new terminal, seed the database:"
echo "   cd backend && npm run seed"
echo ""
echo "4. In another terminal, start the frontend:"
echo "   npm run dev"
echo ""
echo "5. Open http://localhost:5173 in your browser"
echo ""
echo "For detailed instructions, see STATUS_AND_NEXT_STEPS.md"
echo ""
