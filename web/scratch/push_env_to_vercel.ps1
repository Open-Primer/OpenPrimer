# OpenPrimer Vercel Env Sync Script
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "   OpenPrimer Vercel Environment Sync Tool" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

$EnvFile = Join-Path $PSScriptRoot "..\.env.local"
if (-not (Test-Path $EnvFile)) {
    Write-Error "Could not find .env.local file at $EnvFile"
    exit 1
}

Write-Host "Reading keys from .env.local..." -ForegroundColor Yellow
$lines = Get-Content $EnvFile

foreach ($line in $lines) {
    $trimmed = $line.Trim()
    if ($trimmed.StartsWith("#") -or [string]::IsNullOrWhiteSpace($trimmed)) {
        continue
    }

    $parts = $trimmed.Split("=", 2)
    if ($parts.Length -eq 2) {
        $key = $parts[0].Trim()
        $value = $parts[1].Trim()

        # Skip support redirect or public local projectId helpers if not needed in production env
        if ($key -eq "SUPPORT_EMAIL_REDIRECTION" -or $key -eq "NEXT_PUBLIC_GCP_PROJECT_ID") {
            # Still push them just in case
        }

        Write-Host "Adding $key to Vercel (Production, Preview, Development)..." -ForegroundColor Magenta
        
        # Loop through each target environment and execute the non-interactive vercel env add syntax
        $environments = @("production", "preview", "development")
        foreach ($env in $environments) {
            npx vercel env add $key $env --value $value --yes --force
        }
    }
}

Write-Host "=============================================" -ForegroundColor Green
Write-Host "  Success! Environment variables synced! " -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green
