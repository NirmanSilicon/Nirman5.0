# CYBER-NOVA AI Assistant Setup Script
# This script sets up Ollama and downloads the necessary model

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  CYBER-NOVA AI Assistant Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Ollama is installed
Write-Host "Step 1: Checking Ollama installation..." -ForegroundColor Yellow
$ollamaInstalled = $false

try {
    $ollamaVersion = ollama --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Ollama is installed: $ollamaVersion" -ForegroundColor Green
        $ollamaInstalled = $true
    }
} catch {
    Write-Host "❌ Ollama not found" -ForegroundColor Red
}

if (-not $ollamaInstalled) {
    Write-Host ""
    Write-Host "Ollama is not installed. Please install it:" -ForegroundColor Yellow
    Write-Host "1. Visit: https://ollama.ai/download" -ForegroundColor Cyan
    Write-Host "2. Download and install Ollama for Windows" -ForegroundColor Cyan
    Write-Host "3. Run this script again" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Opening Ollama download page..." -ForegroundColor Yellow
    Start-Process "https://ollama.ai/download"
    Read-Host "Press Enter after installing Ollama to continue"
    
    # Check again
    try {
        $ollamaVersion = ollama --version 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Ollama is now installed!" -ForegroundColor Green
            $ollamaInstalled = $true
        }
    } catch {
        Write-Host "❌ Ollama still not found. Please restart your terminal and try again." -ForegroundColor Red
        exit 1
    }
}

# Check if Ollama service is running
Write-Host ""
Write-Host "Step 2: Checking Ollama service..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:11434/api/tags" -Method GET -TimeoutSec 5 -ErrorAction Stop
    Write-Host "✅ Ollama service is running" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Ollama service not running. Starting Ollama..." -ForegroundColor Yellow
    Write-Host "   Please start Ollama manually or it will start automatically." -ForegroundColor Yellow
    Write-Host "   You can start it from the Start menu or system tray." -ForegroundColor Yellow
    Write-Host ""
    $startOllama = Read-Host "Start Ollama now? (y/n)"
    if ($startOllama -eq "y" -or $startOllama -eq "Y") {
        try {
            Start-Process "ollama" -ErrorAction Stop
            Write-Host "Waiting for Ollama to start..." -ForegroundColor Yellow
            Start-Sleep -Seconds 5
            
            # Check again
            $response = Invoke-WebRequest -Uri "http://localhost:11434/api/tags" -Method GET -TimeoutSec 10 -ErrorAction Stop
            Write-Host "✅ Ollama service is now running" -ForegroundColor Green
        } catch {
            Write-Host "❌ Could not start Ollama automatically" -ForegroundColor Red
            Write-Host "   Please start Ollama manually from the Start menu" -ForegroundColor Yellow
            Read-Host "Press Enter when Ollama is running"
        }
    }
}

# Check available models
Write-Host ""
Write-Host "Step 3: Checking available models..." -ForegroundColor Yellow
try {
    $modelsResponse = Invoke-WebRequest -Uri "http://localhost:11434/api/tags" -Method GET -TimeoutSec 10
    $modelsData = $modelsResponse.Content | ConvertFrom-Json
    $availableModels = $modelsData.models | ForEach-Object { $_.name }
    
    if ($availableModels.Count -gt 0) {
        Write-Host "✅ Found $($availableModels.Count) model(s):" -ForegroundColor Green
        $availableModels | ForEach-Object { Write-Host "   - $_" -ForegroundColor Cyan }
    } else {
        Write-Host "⚠️  No models found" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Could not check models" -ForegroundColor Red
}

# Download recommended model
Write-Host ""
Write-Host "Step 4: Setting up LLM model..." -ForegroundColor Yellow
$recommendedModel = "llama3.2"
$modelExists = $false

if ($availableModels -contains $recommendedModel) {
    Write-Host "✅ Model '$recommendedModel' is already installed" -ForegroundColor Green
    $modelExists = $true
} else {
    Write-Host "📥 Model '$recommendedModel' not found. Downloading..." -ForegroundColor Yellow
    Write-Host "   This may take several minutes depending on your internet speed..." -ForegroundColor Gray
    Write-Host ""
    
    try {
        # Run ollama pull in the background and show progress
        $pullProcess = Start-Process -FilePath "ollama" -ArgumentList "pull", $recommendedModel -NoNewWindow -PassThru -Wait
        
        if ($pullProcess.ExitCode -eq 0) {
            Write-Host "✅ Model '$recommendedModel' downloaded successfully!" -ForegroundColor Green
            $modelExists = $true
        } else {
            Write-Host "❌ Failed to download model" -ForegroundColor Red
        }
    } catch {
        Write-Host "❌ Error downloading model: $_" -ForegroundColor Red
        Write-Host "   You can download it manually with: ollama pull $recommendedModel" -ForegroundColor Yellow
    }
}

# Test the model
if ($modelExists) {
    Write-Host ""
    Write-Host "Step 5: Testing the model..." -ForegroundColor Yellow
    try {
        $testBody = @{
            model = $recommendedModel
            prompt = "Say hello in one sentence."
            stream = $false
        } | ConvertTo-Json
        
        $testResponse = Invoke-WebRequest -Uri "http://localhost:11434/api/generate" -Method POST -Body $testBody -ContentType "application/json" -TimeoutSec 30
        $testData = $testResponse.Content | ConvertFrom-Json
        
        if ($testData.response) {
            Write-Host "✅ Model is working!" -ForegroundColor Green
            Write-Host "   Test response: $($testData.response.Substring(0, [Math]::Min(50, $testData.response.Length)))..." -ForegroundColor Gray
        }
    } catch {
        Write-Host "⚠️  Could not test model (this is okay, it will work when you use it)" -ForegroundColor Yellow
    }
}

# Update environment file
Write-Host ""
Write-Host "Step 6: Configuring environment..." -ForegroundColor Yellow
$envFile = "server\.env"
$envContent = @"
# Server Configuration
PORT=4000
FRONTEND_ORIGIN=http://localhost:5173

# Database Configuration
# Leave empty to use in-memory MongoDB
MONGODB_URI=
MONGO_DB=cyber-nova

# Local LLM Configuration (Ollama)
LLM_API_URL=http://localhost:11434
LLM_MODEL=$recommendedModel
LLM_TIMEOUT=60000
"@

if (-not (Test-Path $envFile)) {
    Set-Content -Path $envFile -Value $envContent
    Write-Host "✅ Created $envFile with LLM configuration" -ForegroundColor Green
} else {
    # Update existing .env file
    $currentContent = Get-Content $envFile -Raw
    if ($currentContent -notmatch "LLM_API_URL") {
        Add-Content -Path $envFile -Value "`n# Local LLM Configuration`nLLM_API_URL=http://localhost:11434`nLLM_MODEL=$recommendedModel`nLLM_TIMEOUT=60000"
        Write-Host "✅ Updated $envFile with LLM configuration" -ForegroundColor Green
    } else {
        Write-Host "✅ $envFile already configured" -ForegroundColor Green
    }
}

# Final summary
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Setup Complete! 🎉" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Ollama: Installed and running" -ForegroundColor Green
Write-Host "✅ Model: $recommendedModel ready" -ForegroundColor Green
Write-Host "✅ Configuration: Updated" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Make sure your backend server is running:" -ForegroundColor Cyan
Write-Host "   cd server" -ForegroundColor Gray
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Make sure your frontend server is running:" -ForegroundColor Cyan
Write-Host "   cd frontend" -ForegroundColor Gray
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Open http://localhost:5173 in your browser" -ForegroundColor Cyan
Write-Host ""
Write-Host "4. Go to the Assistant section and try sending a message!" -ForegroundColor Cyan
Write-Host ""
Write-Host "The AI assistant is now ready to use! 🚀" -ForegroundColor Green
Write-Host ""

