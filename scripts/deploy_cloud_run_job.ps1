# OpenPrimer Cloud Run Job Deployment & Runner (PowerShell)
# Automates building the generation container and deploying it as a Cloud Run Job (timeout = 24h)

param(
    [string]$ProjectId = "ether-509812",
    [string]$Region = "europe-west1",
    [string]$JobName = "openprimer-generation-job",
    [switch]$ExecuteNow
)

$ErrorActionPreference = "Stop"

Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "Deploying OpenPrimer Course Generation Cloud Run Job" -ForegroundColor Cyan
Write-Host "Project: $ProjectId | Region: $Region | Timeout: 86400s (24h)" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan

# 1. Read environment variables from web/.env.local
$envFilePath = Join-Path $PSScriptRoot "..\web\.env.local"
if (-not (Test-Path $envFilePath)) {
    throw "Could not find .env.local at $envFilePath"
}

$envVars = @{}
Get-Content $envFilePath | ForEach-Object {
    $line = $_.Trim()
    if ($line -and -not $line.StartsWith("#") -and $line.Contains("=")) {
        $parts = $line.Split("=", 2)
        $k = $parts[0].Trim()
        $v = $parts[1].Trim()
        $doubleQuote = [char]34
        $singleQuote = [char]39
        if ($v.StartsWith($doubleQuote) -and $v.EndsWith($doubleQuote)) {
            $v = $v.Substring(1, $v.Length - 2)
        } elseif ($v.StartsWith($singleQuote) -and $v.EndsWith($singleQuote)) {
            $v = $v.Substring(1, $v.Length - 2)
        }
        $envVars[$k] = $v
    }
}

$supabaseUrl = $envVars["NEXT_PUBLIC_SUPABASE_URL"]
$supabaseKey = $envVars["SUPABASE_SERVICE_ROLE_KEY"]

if (-not $supabaseUrl -or -not $supabaseKey) {
    throw "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local"
}

# 2. Build Container Image with Google Cloud Build
$imageTag = "gcr.io/$ProjectId/openprimer-generator-worker:latest"
$webDir = Join-Path $PSScriptRoot "..\web"

Write-Host "Building container image: $imageTag via Cloud Build..." -ForegroundColor Yellow
$configPath = Join-Path $webDir "cloudbuild-job.yaml"
gcloud builds submit $webDir --config $configPath --project $ProjectId

if ($LASTEXITCODE -ne 0) {
    throw "Cloud Build failed."
}

$geminiApiKey = $envVars["GEMINI_API_KEY"]
if (-not $geminiApiKey) {
    $geminiApiKey = $envVars["GOOGLE_API_KEY"]
}

# Encode Service Account to Base64
$saKeyPath = Join-Path $webDir "secrets\openprimer-ether-sa-key.json"
$saBase64 = ""
if (Test-Path $saKeyPath) {
    $saBytes = [System.IO.File]::ReadAllBytes($saKeyPath)
    $saBase64 = [System.Convert]::ToBase64String($saBytes)
}

# 3. Deploy or Update Cloud Run Job
Write-Host "Deploying Cloud Run Job: $JobName with 24h timeout..." -ForegroundColor Yellow

$envFlagsList = @(
    "NEXT_PUBLIC_SUPABASE_URL=$supabaseUrl",
    "SUPABASE_SERVICE_ROLE_KEY=$supabaseKey",
    "VERTEX_PROJECT_ID=$ProjectId",
    "GEMINI_GENERATION_MODEL=gemini-3.5-flash-lite",
    "NODE_ENV=production"
)

if ($geminiApiKey) {
    $envFlagsList += "GEMINI_API_KEY=$geminiApiKey"
}

if ($saBase64) {
    $envFlagsList += "VERTEX_SERVICE_ACCOUNT_BASE64=$saBase64"
}

$envFlags = $envFlagsList -join ","

gcloud run jobs deploy $JobName `
    --image $imageTag `
    --region $Region `
    --project $ProjectId `
    --cpu 2 `
    --memory 4Gi `
    --task-timeout 86400s `
    --max-retries 0 `
    --set-env-vars $envFlags

if ($LASTEXITCODE -ne 0) {
    throw "Cloud Run Job deployment failed."
}

Write-Host "✅ Cloud Run Job deployed successfully!" -ForegroundColor Green
Write-Host "To trigger execution in the cloud:" -ForegroundColor Cyan
Write-Host "  gcloud run jobs execute $JobName --region $Region --project $ProjectId" -ForegroundColor White

if ($ExecuteNow) {
    Write-Host "Triggering execution now..." -ForegroundColor Yellow
    gcloud run jobs execute $JobName --region $Region --project $ProjectId
}
