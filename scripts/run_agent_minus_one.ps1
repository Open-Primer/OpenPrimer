<#
.SYNOPSIS
    OpenPrimer Curriculum Seed & Task Queue Generator Wrapper (PowerShell)
.DESCRIPTION
    Runs the Agent Generator -1 to model pre-bac and post-bac curricula and populate the task queue.
.PARAMETER Seed
    Truncates the database and seeds the full 12,828 production tasks.
.PARAMETER Append
    Appends new curriculums to the existing database without truncating.
.PARAMETER DryRun
    Runs the model planning without writing anything to the active Supabase database (default).
.EXAMPLE
    .\scripts\run_agent_minus_one.ps1 -DryRun
#>

param(
    [switch]$Seed,
    [switch]$Append,
    [switch]$DryRun
)

# 1. Store original directory and navigate to web
$OriginalDir = Get-Location
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location "$ScriptDir\..\web"

# 2. Determine execution flag
$Flag = "--dry-run"
if ($Seed) {
    $Flag = "--seed"
} elseif ($Append) {
    $Flag = "--append"
}

Write-Host "🧠 OpenPrimer Curriculum Generator (Agent -1) Runner" -ForegroundColor Cyan
Write-Host "Running in mode: $Flag" -ForegroundColor Yellow
Write-Host "----------------------------------------------------"

# 3. Run command
npx tsx scratch/run_agent_minus_one.ts $Flag

# 4. Restore original location
Set-Location $OriginalDir
