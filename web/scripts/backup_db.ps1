<#
.SYNOPSIS
    OpenPrimer Database Backup Utility (PowerShell)
.DESCRIPTION
    Automatically extracts the database password and host from web/.env.local,
    verifies pg_dump availability, and performs a complete schema/data export
    to web/backups/supabase_backup_YYYYMMDD_HHMMSS.sql.
.EXAMPLE
    .\scripts\backup_db.ps1
#>

# 1. Setup workspace variables
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir
Set-Location .. # Move up to web/ root

# 2. Check if .env.local exists
$EnvFile = ".env.local"
if (-not (Test-Path $EnvFile)) {
    Write-Error "Error: $EnvFile file not found in current folder: $(Get-Location)"
    Exit
}

# 3. Parse variables from .env.local
Write-Host "🔍 Loading configurations from $EnvFile..." -ForegroundColor Cyan
$Configs = @{}
Get-Content $EnvFile | ForEach-Object {
    if ($_ -match '^\s*([\w_]+)\s*=\s*(.+?)\s*$') {
        $Configs[$Matches[1]] = $Matches[2].Trim()
    }
}

$SupabaseUrl = $Configs["NEXT_PUBLIC_SUPABASE_URL"]
$DbPassword = $Configs["SUPABASE_DB_PASSWORD"]

if (-not $SupabaseUrl -or -not $DbPassword) {
    Write-Error "Error: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_DB_PASSWORD missing in $EnvFile"
    Exit
}

# Parse host from URL (e.g. https://cayylzaasyqqpvuezufy.supabase.co)
if ($SupabaseUrl -match 'https://([^.]+)\.supabase') {
    $Subdomain = $Matches[1]
    $DbHost = "db.$Subdomain.supabase.co"
} else {
    Write-Error "Error: Invalid NEXT_PUBLIC_SUPABASE_URL format: $SupabaseUrl"
    Exit
}

$DbUser = "postgres"
$DbPort = "5432"
$DbName = "postgres"

# Create backup directory if it doesn't exist
$BackupDir = "backups"
if (-not (Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir | Out-Null
}

$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$BackupPath = "$BackupDir\supabase_backup_$Timestamp.sql"
$ConnectionString = "postgresql://$DbUser`:$DbPassword@$DbHost`:$DbPort/$DbName"

Write-Host "=============================================" -ForegroundColor Green
Write-Host "   OpenPrimer Supabase Backup Engine         " -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green
Write-Host "Target Host: $DbHost"
Write-Host "Target Port: $DbPort"
Write-Host "Target User: $DbUser"
Write-Host "Destination: $BackupPath"
Write-Host "---------------------------------------------"

# 4. Check for pg_dump tool
$PgDumpPath = Get-Command pg_dump -ErrorAction SilentlyContinue

if ($null -eq $PgDumpPath) {
    Write-Host "⚠️ Warning: 'pg_dump' utility not detected in your system PATH." -ForegroundColor Yellow
    Write-Host "---------------------------------------------"
    Write-Host "To resolve this, you can download PostgreSQL command-line tools,"
    Write-Host "or use this direct connection string in your preferred DB GUI tool"
    Write-Host "(e.g., pgAdmin, DBeaver, TablePlus, or Supabase Dashboard) to export:"
    Write-Host ""
    Write-Host "Connection URI:" -ForegroundColor Yellow
    Write-Host "  $ConnectionString" -ForegroundColor Magenta
    Write-Host ""
    Write-Host "Host: $DbHost"
    Write-Host "Port: $DbPort"
    Write-Host "Database/DBName: $DbName"
    Write-Host "User: $DbUser"
    Write-Host "Password: $DbPassword"
    Write-Host ""
    Write-Host "Press any key to exit..."
    $null = [Console]::ReadKey()
    Exit
}

# 5. Run pg_dump
Write-Host "🚀 Running pg_dump..." -ForegroundColor Yellow
$env:PGPASSWORD = $DbPassword

try {
    # Execute pg_dump
    pg_dump --dbname=$ConnectionString --clean --if-exists --format=plain --file=$BackupPath --no-owner --no-privileges
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Success! Backup successfully created at: $BackupPath" -ForegroundColor Green
        $FileObj = Get-Item $BackupPath
        Write-Host "Size: $([Math]::Round($FileObj.Length / 1KB, 2)) KB"
    } else {
        Write-Error "Error: pg_dump execution failed with exit code $LASTEXITCODE"
    }
} catch {
    Write-Error "Exception occurred during backup: $_"
} finally {
    # Clear password env var for safety
    Remove-Item Env:\PGPASSWORD -ErrorAction SilentlyContinue
}
