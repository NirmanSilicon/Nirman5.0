@echo off
echo Starting PDF-GPT Development Servers...
echo.

REM Start Python PDF Processor
echo [1/2] Starting Python PDF Processor on port 8000...
start "PDF Processor" cmd /k "cd pdf-processor && python main.py"
timeout /t 3 /nobreak >nul

REM Start Next.js Backend
echo [2/2] Starting Next.js Backend on port 3000...
start "Next.js Backend" cmd /k "npm run dev"

echo.
echo ========================================
echo All services started!
echo ========================================
echo.
echo Python PDF Processor: http://localhost:8000
echo Next.js Backend:      http://localhost:3000
echo.
echo Press any key to stop all services...
pause >nul

REM Kill all started processes
taskkill /FI "WindowTitle eq PDF Processor*" /T /F
taskkill /FI "WindowTitle eq Next.js Backend*" /T /F
