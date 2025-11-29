# Start both Frontend and Backend Servers
# Run this script to start the entire application

Write-Host "🚀 Starting CYBER-NOVA Application..." -ForegroundColor Cyan
Write-Host ""

# Check if servers are already running
$frontendRunning = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue
$backendRunning = Get-NetTCPConnection -LocalPort 4000 -ErrorAction SilentlyContinue

if ($frontendRunning) {
    Write-Host "⚠️  Frontend already running on port 5173" -ForegroundColor Yellow
} else {
    Write-Host "📱 Starting Frontend Server..." -ForegroundColor Green
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; npm run dev"
    Start-Sleep -Seconds 2
}

if ($backendRunning) {
    Write-Host "⚠️  Backend already running on port 4000" -ForegroundColor Yellow
} else {
    Write-Host "🔧 Starting Backend Server..." -ForegroundColor Green
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\server'; npm run dev"
    Start-Sleep -Seconds 2
}

Write-Host ""
Write-Host "✅ Servers starting..." -ForegroundColor Green
Write-Host ""
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "Backend:  http://localhost:4000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to exit (servers will continue running in separate windows)..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

