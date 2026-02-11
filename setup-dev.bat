@echo off
setlocal enabledelayedexpansion

echo Starting Home Builder App Development Setup...
echo.

REM Check Node.js
echo Checking prerequisites...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed
    echo Please install Node.js 18+ from https://nodejs.org/
    exit /b 1
)
echo [OK] Node.js installed

REM Check npm
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm is not installed
    exit /b 1
)
echo [OK] npm installed

REM Check PostgreSQL
where psql >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] PostgreSQL is not installed
    echo Please install from https://www.postgresql.org/download/windows/
    exit /b 1
)
echo [OK] PostgreSQL installed
echo.

echo Installing dependencies...

REM Install frontend dependencies
echo Installing frontend dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 exit /b 1

REM Install backend dependencies
echo Installing backend dependencies...
cd backend
call npm install
if %ERRORLEVEL% NEQ 0 exit /b 1
cd ..

echo [OK] Dependencies installed
echo.

echo Setting up environment files...

REM Frontend .env
if not exist .env (
    echo Creating frontend .env file...
    (
        echo VITE_API_URL=http://localhost:5000/api
        echo VITE_SOCKET_URL=http://localhost:5000
    ) > .env
    echo [OK] Created .env
) else (
    echo [OK] .env already exists
)

REM Backend .env
if not exist backend\.env (
    echo Creating backend .env file...
    (
        echo PORT=5000
        echo NODE_ENV=development
        echo DATABASE_URL=postgresql://postgres:postgres@localhost:5432/home_builder_db
        echo JWT_SECRET=change-this-to-a-secure-random-string-min-32-characters-long
        echo JWT_EXPIRE=7d
        echo FRONTEND_URL=http://localhost:5173
    ) > backend\.env
    echo [OK] Created backend/.env
    echo [WARNING] Please update JWT_SECRET in backend/.env with a secure random string
) else (
    echo [OK] backend/.env already exists
)

REM Setup database
echo.
echo Setting up database...
createdb -U postgres home_builder_db 2>nul || echo Database already exists

REM Seed database
echo Seeding database...
cd backend
call npm run seed
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] Database seeding may have had issues
)
cd ..
echo [OK] Database setup complete

REM Build frontend
echo.
echo Building frontend...
call npm run build
if %ERRORLEVEL% NEQ 0 exit /b 1
echo [OK] Frontend built successfully

echo.
echo ================================================
echo Setup Complete!
echo ================================================
echo.
echo To start the application:
echo.
echo   Terminal 1 (Backend):
echo   cd backend ^&^& npm run dev
echo.
echo   Terminal 2 (Frontend):
echo   npm run dev
echo.
echo Application URLs:
echo   Frontend: http://localhost:5173
echo   Backend API: http://localhost:5000/api
echo.
