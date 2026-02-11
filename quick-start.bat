@echo off
REM Quick Start Script for Home Builder App (Windows)
REM This script helps set up the development environment

echo ======================================
echo Home Builder App - Quick Start Setup
echo ======================================
echo.

REM Check if PostgreSQL is installed
echo Checking for PostgreSQL...
where psql >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ PostgreSQL is installed
    psql --version
) else (
    echo ❌ PostgreSQL is NOT installed
    echo.
    echo Please install PostgreSQL first:
    echo   Download from https://www.postgresql.org/download/windows/
    echo.
    pause
    exit /b 1
)

echo.
echo ======================================
echo Step 1: Setup Environment Files
echo ======================================
echo.

REM Setup backend .env
if not exist backend\.env (
    echo Creating backend\.env from example...
    copy backend\.env.example backend\.env
    echo ✅ Created backend\.env
    echo.
    echo ⚠️  IMPORTANT: Edit backend\.env and update:
    echo    - DATABASE_URL with your PostgreSQL credentials
    echo    - JWT_SECRET with a secure random string
    echo.
) else (
    echo ✅ backend\.env already exists
)

REM Setup frontend .env
if not exist .env (
    echo Creating .env from example...
    copy .env.example .env
    echo ✅ Created .env
) else (
    echo ✅ .env already exists
)

echo.
echo ======================================
echo Step 2: Install Dependencies
echo ======================================
echo.

REM Install frontend dependencies
if not exist node_modules (
    echo Installing frontend dependencies...
    call npm install
) else (
    echo ✅ Frontend dependencies already installed
)

REM Install backend dependencies
if not exist backend\node_modules (
    echo Installing backend dependencies...
    cd backend
    call npm install
    cd ..
) else (
    echo ✅ Backend dependencies already installed
)

echo.
echo ======================================
echo Step 3: Build Backend
echo ======================================
echo.
cd backend
call npm run build
cd ..

echo.
echo ======================================
echo ✅ Setup Complete!
echo ======================================
echo.
echo Next steps:
echo.
echo 1. Create PostgreSQL database:
echo    psql postgres -c "CREATE DATABASE home_builder_db;"
echo.
echo 2. Edit backend\.env if you haven't already:
echo    - Update DATABASE_URL with your PostgreSQL credentials
echo    - Set a secure JWT_SECRET
echo.
echo 3. Start the backend server:
echo    cd backend
echo    npm run dev
echo.
echo 4. In a new command prompt, seed the database:
echo    cd backend
echo    npm run seed
echo.
echo 5. In another command prompt, start the frontend:
echo    npm run dev
echo.
echo 6. Open http://localhost:5173 in your browser
echo.
echo For detailed instructions, see STATUS_AND_NEXT_STEPS.md
echo.
pause
