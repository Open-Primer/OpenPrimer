<#
.SYNOPSIS
    OpenPrimer Local Task Queue Worker Wrapper (PowerShell)
.DESCRIPTION
    Runs the Socratic generation & translation queue worker from the root scripts folder.
.EXAMPLE
    .\scripts\run_queue_worker.ps1
#>

# 1. Store original directory and navigate to web
$OriginalDir = Get-Location
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location "$ScriptDir\..\web"

Write-Host "🚀 OpenPrimer Local Queue Worker Runner" -ForegroundColor Cyan
Write-Host "----------------------------------------------------"

# 2. Run worker
npx tsx scratch/run_queue_worker.ts

# 3. Restore original location
Set-Location $OriginalDir
