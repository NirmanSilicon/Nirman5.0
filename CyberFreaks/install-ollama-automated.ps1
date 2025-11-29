# Automated Ollama Installation and Setup
# This script downloads, installs, and configures Ollama automatically

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Automated Ollama Installation" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if running as administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "⚠️  This script requires administrator privileges" -ForegroundColor Yellow
    Write-Host "   Requesting elevation..." -ForegroundColor Yellow
    Start-Process powershell -Verb RunAs -ArgumentList "-ExecutionPolicy Bypass -File `"$PSCommandPath`""
    exit
}

# Step 1: Check if Ollama is already installed
Write-Host "Step 1: Checking Ollama installation..." -ForegroundColor Yellow
$ollamaInstalled = $false

try {
    $ollamaVersion = ollama --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Ollama is already installed: $ollamaVersion" -ForegroundColor Green
        $ollamaInstalled = $true
    }
} catch {
    Write-Host "❌ Ollama not found - will install now" -ForegroundColor Yellow
}

# Step 2: Download and Install Ollama
if (-not $ollamaInstalled) {
    Write-Host ""
    Write-Host "Step 2: Downloading Ollama installer..." -ForegroundColor Yellow
    
    $ollamaUrl = "https://ollama.com/download/windows"
    $installerPath = "$env:TEMP\ollama-installer.exe"
    
    try {
        Write-Host "   Downloading from $ollamaUrl..." -ForegroundColor Gray
        Invoke-WebRequest -Uri $ollamaUrl -OutFile $installerPath -UseBasicParsing
        
        Write-Host "✅ Download complete" -ForegroundColor Green
        Write-Host ""
        Write-Host "Step 3: Installing Ollama..." -ForegroundColor Yellow
        Write-Host "   This will open the Ollama installer..." -ForegroundColor Gray
        Write-Host "   Please complete the installation in the window that opens" -ForegroundColor Gray
        Write-Host ""
        
        # Run installer
        Start-Process -FilePath $installerPath -Wait
        
        # Clean up installer
        Remove-Item $installerPath -ErrorAction SilentlyContinue
        
        # Wait a bit for installation to complete
        Start-Sleep -Seconds 3
        
        # Verify installation
        try {
            $ollamaVersion = ollama --version 2>&1
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✅ Ollama installed successfully!" -ForegroundColor Green
                $ollamaInstalled = $true
            } else {
                Write-Host "⚠️  Installation may need a terminal restart" -ForegroundColor Yellow
                Write-Host "   Please restart your terminal and run this script again" -ForegroundColor Yellow
                exit 1
            }
        } catch {
            Write-Host "⚠️  Could not verify installation. Please restart terminal and try again." -ForegroundColor Yellow
            exit 1
        }
    } catch {
        Write-Host "❌ Failed to download Ollama: $_" -ForegroundColor Red
        Write-Host "   Please download manually from: https://ollama.ai/download" -ForegroundColor Yellow
        exit 1
    }
}

# Step 4: Start Ollama Service
Write-Host ""
Write-Host "Step 4: Starting Ollama service..." -ForegroundColor Yellow

# Check if Ollama is running
try {
    $response = Invoke-WebRequest -Uri "http://localhost:11434/api/tags" -Method GET -TimeoutSec 5 -ErrorAction Stop
    Write-Host "✅ Ollama service is already running" -ForegroundColor Green
} catch {
    Write-Host "   Starting Ollama service..." -ForegroundColor Gray
    try {
        # Try to start Ollama
        Start-Process "ollama" -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 5
        
        # Check again
        $maxRetries = 6
        $retryCount = 0
        $serviceStarted = $false
        
        while ($retryCount -lt $maxRetries) {
            try {
                $response = Invoke-WebRequest -Uri "http://localhost:11434/api/tags" -Method GET -TimeoutSec 5 -ErrorAction Stop
                Write-Host "✅ Ollama service is now running" -ForegroundColor Green
                $serviceStarted = $true
                break
            } catch {
                $retryCount++
                Write-Host "   Waiting for Ollama to start... ($retryCount/$maxRetries)" -ForegroundColor Gray
                Start-Sleep -Seconds 5
            }
        }
        
        if (-not $serviceStarted) {
            Write-Host "⚠️  Ollama service may need manual start" -ForegroundColor Yellow
            Write-Host "   Please start Ollama from the Start menu or system tray" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "⚠️  Could not start Ollama automatically" -ForegroundColor Yellow
        Write-Host "   Please start Ollama manually from the Start menu" -ForegroundColor Yellow
    }
}

# Step 5: Download Model
Write-Host ""
Write-Host "Step 5: Downloading AI model (llama3.2)..." -ForegroundColor Yellow
Write-Host "   This may take 5-15 minutes depending on your internet speed..." -ForegroundColor Gray
Write-Host "   Model size: ~2GB" -ForegroundColor Gray
Write-Host ""

$modelName = "llama3.2"

# Check if model already exists
try {
    $modelsResponse = Invoke-WebRequest -Uri "http://localhost:11434/api/tags" -Method GET -TimeoutSec 10
    $modelsData = $modelsResponse.Content | ConvertFrom-Json
    $availableModels = $modelsData.models | ForEach-Object { $_.name }
    
    if ($availableModels -contains $modelName) {
        Write-Host "✅ Model '$modelName' is already installed" -ForegroundColor Green
    } else {
        Write-Host "   Downloading model '$modelName'..." -ForegroundColor Gray
        Write-Host "   (This will show progress in a new window)" -ForegroundColor Gray
        
        # Run ollama pull
        $pullProcess = Start-Process -FilePath "ollama" -ArgumentList "pull", $modelName -NoNewWindow -PassThru -Wait
        
        if ($pullProcess.ExitCode -eq 0) {
            Write-Host "✅ Model '$modelName' downloaded successfully!" -ForegroundColor Green
        } else {
            Write-Host "❌ Failed to download model" -ForegroundColor Red
            Write-Host "   You can download it manually with: ollama pull $modelName" -ForegroundColor Yellow
        }
    }
} catch {
    Write-Host "❌ Could not check/download models. Ollama may not be running." -ForegroundColor Red
    Write-Host "   Error: $_" -ForegroundColor Yellow
}

# Step 6: Configure Environment
Write-Host ""
Write-Host "Step 6: Configuring environment..." -ForegroundColor Yellow

$envFile = "server\.env"
$envContent = @"
# Server Configuration
PORT=4000
FRONTEND_ORIGIN=http://localhost:5173

# Database Configuration
MONGODB_URI=
MONGO_DB=cyber-nova

# Local LLM Configuration (Ollama)
LLM_API_URL=http://localhost:11434
LLM_MODEL=$modelName
LLM_TIMEOUT=60000
"@

if (-not (Test-Path $envFile)) {
    Set-Content -Path $envFile -Value $envContent
    Write-Host "✅ Created $envFile" -ForegroundColor Green
} else {
    # Update existing .env
    $currentContent = Get-Content $envFile -Raw -ErrorAction SilentlyContinue
    if ($currentContent -notmatch "LLM_API_URL") {
        Add-Content -Path $envFile -Value "`n# Local LLM Configuration`nLLM_API_URL=http://localhost:11434`nLLM_MODEL=$modelName`nLLM_TIMEOUT=60000"
        Write-Host "✅ Updated $envFile" -ForegroundColor Green
    } else {
        Write-Host "✅ $envFile already configured" -ForegroundColor Green
    }
}

# Step 7: Test Setup
Write-Host ""
Write-Host "Step 7: Testing setup..." -ForegroundColor Yellow

try {
    $testResponse = Invoke-WebRequest -Uri "http://localhost:11434/api/tags" -Method GET -TimeoutSec 10
    $testData = $testResponse.Content | ConvertFrom-Json
    $models = $testData.models | ForEach-Object { $_.name }
    
    if ($models -contains $modelName) {
        Write-Host "✅ Setup complete! Model '$modelName' is ready" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Setup complete, but model may need to be downloaded" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  Could not verify setup. Ollama may need to be restarted." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Installation Complete! 🎉" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Restart your backend server: cd server && npm run dev" -ForegroundColor Cyan
Write-Host "2. Open http://localhost:5173 in your browser" -ForegroundColor Cyan
Write-Host "3. Go to Assistant section and start chatting!" -ForegroundColor Cyan
Write-Host ""
Write-Host "Your AI assistant is now ready with local LLM! 🚀" -ForegroundColor Green
Write-Host ""

