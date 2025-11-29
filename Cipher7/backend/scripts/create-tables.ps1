# PowerShell script to create database tables
# This script reads the .env file and creates the tables using psql

$envFile = Join-Path $PSScriptRoot "..\.env"
if (-not (Test-Path $envFile)) {
    Write-Host "❌ .env file not found at: $envFile" -ForegroundColor Red
    exit 1
}

# Read .env file
$envContent = Get-Content $envFile
$dbHost = ($envContent | Select-String "DB_HOST=").ToString().Split('=')[1]
$dbPort = ($envContent | Select-String "DB_PORT=").ToString().Split('=')[1]
$dbName = ($envContent | Select-String "DB_NAME=").ToString().Split('=')[1]
$dbUser = ($envContent | Select-String "DB_USER=").ToString().Split('=')[1]
$dbPassword = ($envContent | Select-String "DB_PASSWORD=").ToString().Split('=')[1]

if (-not $dbPassword -or $dbPassword -eq "your-postgres-password") {
    Write-Host "❌ DB_PASSWORD not configured in .env file" -ForegroundColor Red
    Write-Host "   Please update packages/backend/.env with your PostgreSQL password" -ForegroundColor Yellow
    exit 1
}

Write-Host "Creating database tables..." -ForegroundColor Cyan
Write-Host "Database: $dbName" -ForegroundColor Gray
Write-Host "Host: $dbHost" -ForegroundColor Gray
Write-Host ""

# Set password as environment variable for psql
$env:PGPASSWORD = $dbPassword

# Read SQL file
$sqlFile = Join-Path $PSScriptRoot "create-tables.sql"
$sql = Get-Content $sqlFile -Raw

# Execute SQL
try {
    $sql | psql -h $dbHost -p $dbPort -U $dbUser -d $dbName
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Database tables created successfully!" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to create tables. Check PostgreSQL connection." -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red
    Write-Host "   Make sure PostgreSQL is running and psql is in your PATH" -ForegroundColor Yellow
}

# Clear password
Remove-Item Env:\PGPASSWORD

