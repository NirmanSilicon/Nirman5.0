@echo off
echo.
echo ========================================
echo   Starting CYBER-NOVA Application
echo ========================================
echo.

REM Start Backend Server
echo Starting Backend Server...
start "CYBER-NOVA Backend" cmd /k "cd server && npm run dev"

timeout /t 3 /nobreak >nul

REM Start Frontend Server
echo Starting Frontend Server...
start "CYBER-NOVA Frontend" cmd /k "cd frontend && npm run dev"

timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo   Servers Started!
echo ========================================
echo.
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:4000
echo.
echo Both servers are running in separate windows.
echo Close those windows to stop the servers.
echo.
pause

