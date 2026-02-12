@echo off
REM Database setup script for Windows

echo Setting up PostgreSQL database...

REM Check if PostgreSQL is installed
where psql >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo PostgreSQL is not installed. Please install it from:
    echo https://www.postgresql.org/download/windows/
    exit /b 1
)

REM Create database
echo Creating database 'home_builder_db'...
createdb -U postgres home_builder_db 2>nul || echo Database already exists

echo Database setup complete!
