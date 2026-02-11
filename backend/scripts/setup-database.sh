#!/bin/bash
# Database setup script for Unix/Linux/macOS

echo "🗄️  Setting up PostgreSQL database..."

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install it first:"
    echo "   macOS: brew install postgresql@14"
    echo "   Ubuntu/Debian: sudo apt-get install postgresql postgresql-contrib"
    echo "   Windows: Download from https://www.postgresql.org/download/windows/"
    exit 1
fi

# Check if PostgreSQL is running
if ! pg_isready &> /dev/null; then
    echo "❌ PostgreSQL is not running. Please start it:"
    echo "   macOS: brew services start postgresql@14"
    echo "   Ubuntu/Debian: sudo systemctl start postgresql"
    exit 1
fi

# Create database
echo "Creating database 'home_builder_db'..."
createdb home_builder_db 2>/dev/null || echo "⚠️  Database already exists"

echo "✅ Database setup complete!"
