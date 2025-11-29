# Test Assistant Service
Write-Host "Testing CYBER-NOVA Assistant Service..." -ForegroundColor Cyan
Write-Host ""

# Test 1: Backend Health
Write-Host "1. Testing Backend Health..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:4000/api/health" -Method GET -TimeoutSec 5
    Write-Host "   ✅ Backend is running: $($health.status)" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Backend is NOT running" -ForegroundColor Red
    Write-Host "   Start it with: cd server && npm run dev" -ForegroundColor Yellow
    exit 1
}

# Test 2: Assistant Health
Write-Host ""
Write-Host "2. Testing Assistant Service..." -ForegroundColor Yellow
try {
    $assistantHealth = Invoke-RestMethod -Uri "http://localhost:4000/api/assistant/health" -Method GET -TimeoutSec 10
    Write-Host "   ✅ Assistant service is accessible" -ForegroundColor Green
    Write-Host "   LLM Status: $($assistantHealth.llm.available)" -ForegroundColor $(if ($assistantHealth.llm.available) { "Green" } else { "Yellow" })
    Write-Host "   Model: $($assistantHealth.llm.model)" -ForegroundColor Cyan
} catch {
    Write-Host "   ⚠️  Assistant health check failed (this is okay if server just started)" -ForegroundColor Yellow
}

# Test 3: Create Conversation
Write-Host ""
Write-Host "3. Testing Conversation Creation..." -ForegroundColor Yellow
try {
    $conversation = Invoke-RestMethod -Uri "http://localhost:4000/api/assistant/conversations" -Method POST -ContentType "application/json" -Body "{}"
    Write-Host "   ✅ Conversation created: $($conversation._id)" -ForegroundColor Green
    
    # Test 4: Send Message
    Write-Host ""
    Write-Host "4. Testing Message Sending..." -ForegroundColor Yellow
    Start-Sleep -Seconds 2
    $messageBody = @{
        content = "Hello, this is a test message"
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "http://localhost:4000/api/assistant/conversations/$($conversation._id)/messages" -Method POST -ContentType "application/json" -Body $messageBody -TimeoutSec 60
    Write-Host "   ✅ Message sent and received response!" -ForegroundColor Green
    Write-Host "   Response preview: $($response.assistantMessage.content.Substring(0, [Math]::Min(100, $response.assistantMessage.content.Length)))..." -ForegroundColor Gray
    
} catch {
    Write-Host "   ❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "   Details: $responseBody" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Test Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "If all tests passed, your assistant is ready!" -ForegroundColor Green
Write-Host "Open http://localhost:5173 and go to Assistant section" -ForegroundColor Cyan

