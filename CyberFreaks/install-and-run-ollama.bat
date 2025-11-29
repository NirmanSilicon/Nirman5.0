@echo off
echo.
echo ========================================
echo   Installing and Running Ollama
echo ========================================
echo.
echo This will:
echo 1. Install Ollama (if not installed)
echo 2. Download the AI model
echo 3. Start Ollama service
echo 4. Configure everything
echo.
pause

powershell -ExecutionPolicy Bypass -File "%~dp0install-ollama-automated.ps1"

echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo Next: Restart your backend server
echo.
pause

