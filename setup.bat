@echo off
echo.
echo 🏡 Builder App - Setup Script
echo ==============================
echo.

REM Check if PostgreSQL is installed
where psql >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ PostgreSQL is not installed. Please install PostgreSQL first.
    echo Visit: https://www.postgresql.org/download/
    exit /b 1
)

echo ✅ PostgreSQL found
echo.

REM Create database
echo 📊 Creating database...
createdb builder_app 2>nul || echo ℹ️  Database already exists
echo ✅ Database ready
echo.

REM Backend setup
echo 🔧 Setting up backend...
cd backend

if not exist ".env" (
    echo Creating .env file...
    copy .env.example .env
)

if not exist "node_modules" (
    echo Installing backend dependencies...
    call npm install
) else (
    echo ✅ Backend dependencies already installed
)

cd ..
echo ✅ Backend setup complete
echo.

REM Frontend setup
echo 🎨 Setting up frontend...
cd frontend

if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
) else (
    echo ✅ Frontend dependencies already installed
)

cd ..
echo ✅ Frontend setup complete
echo.

echo ==============================
echo ✅ Setup Complete!
echo ==============================
echo.
echo 🚀 To start the application:
echo.
echo Terminal 1 - Backend:
echo   cd backend ^&^& npm run dev
echo.
echo Terminal 2 - Frontend:
echo   cd frontend ^&^& npm start
echo.
echo Then visit: http://localhost:3000
echo.
echo 📚 Documentation: See README.md for more details
echo.
pause
