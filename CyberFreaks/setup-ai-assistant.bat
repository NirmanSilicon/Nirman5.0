@echo off
echo.
echo ========================================
echo   CYBER-NOVA AI Assistant Setup
echo ========================================
echo.

REM Check if PowerShell is available
powershell -ExecutionPolicy Bypass -File "%~dp0setup-ai-assistant.ps1"

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Error running setup script.
    echo Please run setup-ai-assistant.ps1 manually in PowerShell
    echo.
    pause
)

