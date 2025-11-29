@echo off
echo 🚀 Starting LokAI - AI for Smarter Cities
echo ==========================================

REM Check if MongoDB is running
echo 📊 Checking MongoDB...
tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I /N "mongod.exe">NUL
if %ERRORLEVEL% neq 0 (
    echo ❌ MongoDB is not running. Please start MongoDB first.
    echo    Run: mongod
    pause
    exit /b 1
)
echo ✅ MongoDB is running

REM Check if Redis is running (optional)
echo 🔍 Checking Redis...
tasklist /FI "IMAGENAME eq redis-server.exe" 2>NUL | find /I /N "redis-server.exe">NUL
if %ERRORLEVEL% neq 0 (
    echo ⚠️  Redis is not running ^(optional - will use in-memory fallback^)
) else (
    echo ✅ Redis is running
)

REM Start backend
echo 🔧 Starting backend...
cd backend

if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

call venv\Scripts\activate.bat
pip install -r requirements.txt >nul 2>&1

REM Start backend in background
start "LokAI Backend" cmd /c "uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"
echo ✅ Backend started on http://localhost:8000

REM Wait for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend
echo 🎨 Starting frontend...
cd ..\frontend

if not exist "node_modules" (
    echo Installing frontend dependencies...
    npm install >nul 2>&1
)

start "LokAI Frontend" cmd /c "npm start"
echo ✅ Frontend started on http://localhost:3000

echo.
echo 🎉 LokAI is now running!
echo ========================
echo 📱 Frontend: http://localhost:3000
echo 🔧 Backend:  http://localhost:8000
echo 📚 API Docs: http://localhost:8000/docs
echo.
echo Press any key to exit...
pause
