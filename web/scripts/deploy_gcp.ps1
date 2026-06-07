# OpenPrimer Google Cloud Run Deployment Script (Human-Friendly)
# This script automates building and deploying the Next.js app to Google Cloud Run.

# Configuration
$PROJECT_ID = "openprimer-free"
$REGION = "europe-west9"  # Default region
$REPO_NAME = "openprimer-repo"
$SERVICE_NAME = "openprimer-worker"
$ACCOUNT_EMAIL = "vanguard.mysterious@gmail.com"

Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "Starting OpenPrimer Google Cloud Run Deployment" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan

# 1. Verify Active Account and Project
Write-Host "Checking gcloud configurations..." -ForegroundColor Yellow
$activeAccount = (gcloud config get-value account 2>$null)

if ($activeAccount -ne $ACCOUNT_EMAIL) {
    Write-Host "Active account is $activeAccount. Switching to $ACCOUNT_EMAIL..." -ForegroundColor Cyan
    gcloud config set account $ACCOUNT_EMAIL
    if ($LastExitCode -ne 0) { throw "Failed to set gcloud account." }
} else {
    Write-Host "Account matches $ACCOUNT_EMAIL." -ForegroundColor Green
}

# Explicitly use openprimer-free project
Write-Host "Setting active project to $PROJECT_ID..." -ForegroundColor Green
gcloud config set project $PROJECT_ID
if ($LastExitCode -ne 0) { throw "Failed to set gcloud project." }

# 2. Parse Environment Variables from .env.local
Write-Host "Loading environment variables from .env.local..." -ForegroundColor Yellow
$envFilePath = Join-Path $PSScriptRoot "..\.env.local"
if (-not (Test-Path $envFilePath)) {
    throw "Could not find .env.local at $envFilePath. Please make sure it exists."
}

$envVars = @{}
Get-Content $envFilePath | ForEach-Object {
    $line = $_.Trim()
    if ($line -and -not $line.StartsWith("#") -and $line.Contains("=")) {
        $parts = $line.Split("=", 2)
        $key = $parts[0].Trim()
        $value = $parts[1].Trim()
        
        # Remove surrounding quotes safely using ASCII codes (34 = double quote, 39 = single quote)
        $doubleQuote = [char]34
        $singleQuote = [char]39
        if ($value.StartsWith($doubleQuote) -and $value.EndsWith($doubleQuote)) {
            $value = $value.Substring(1, $value.Length - 2)
        } elseif ($value.StartsWith($singleQuote) -and $value.EndsWith($singleQuote)) {
            $value = $value.Substring(1, $value.Length - 2)
        }
        $envVars[$key] = $value
    }
}

$supabaseUrl = $envVars["NEXT_PUBLIC_SUPABASE_URL"]
$serviceRoleKey = $envVars["SUPABASE_SERVICE_ROLE_KEY"]
$geminiApiKey = $envVars["GEMINI_API_KEY"]

if (-not $supabaseUrl) { throw "NEXT_PUBLIC_SUPABASE_URL not found in .env.local" }
if (-not $serviceRoleKey) { throw "SUPABASE_SERVICE_ROLE_KEY not found in .env.local" }

# Define or load CRON_SECRET
$cronSecret = $envVars["CRON_SECRET"]
if (-not $cronSecret) {
    $cronSecret = "OPSecretGate_" + [Guid]::NewGuid().ToString().Substring(0,8)
    Write-Host "CRON_SECRET not found in .env.local. Generated a temporary one: $cronSecret" -ForegroundColor Yellow
} else {
    Write-Host "Loaded CRON_SECRET from .env.local." -ForegroundColor Green
}

# 3. Create Artifact Registry Repository if not exists
Write-Host "Checking if Artifact Registry repository $REPO_NAME exists..." -ForegroundColor Yellow
$repoCheck = gcloud artifacts repositories list --project=$PROJECT_ID --location=$REGION --filter="name:projects/$PROJECT_ID/locations/$REGION/repositories/$REPO_NAME" --format="value(name)" 2>$null

if (-not $repoCheck) {
    Write-Host "Creating Docker repository $REPO_NAME in region $REGION..." -ForegroundColor Cyan
    gcloud artifacts repositories create $REPO_NAME `
        --repository-format=docker `
        --location=$REGION `
        --description="Docker repository for OpenPrimer Web App" `
        --project=$PROJECT_ID
    if ($LastExitCode -ne 0) { throw "Failed to create Artifact Registry repository." }
    Write-Host "Repository created successfully." -ForegroundColor Green
} else {
    Write-Host "Repository $REPO_NAME already exists." -ForegroundColor Green
}

# 4. Trigger Google Cloud Build Remote Compilation
Write-Host "Building container image remotely using Google Cloud Build..." -ForegroundColor Yellow
$imageTag = "$REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/web-app:latest"

# Change directory to the web folder to execute the build submit
$webDir = Resolve-Path (Join-Path $PSScriptRoot "..")
Write-Host "Running build submit from $webDir..." -ForegroundColor Cyan

gcloud builds submit $webDir --tag $imageTag --project=$PROJECT_ID
if ($LastExitCode -ne 0) { throw "Google Cloud Build remote compilation failed." }

Write-Host "Remote build completed and pushed to Artifact Registry." -ForegroundColor Green

# 5. Deploy Container to Google Cloud Run
Write-Host "Deploying container to Google Cloud Run..." -ForegroundColor Yellow

gcloud run deploy $SERVICE_NAME `
    --image=$imageTag `
    --platform=managed `
    --region=$REGION `
    --allow-unauthenticated `
    --port=3000 `
    --set-env-vars="NEXT_PUBLIC_SUPABASE_URL=$supabaseUrl,SUPABASE_SERVICE_ROLE_KEY=$serviceRoleKey,CRON_SECRET=$cronSecret,GEMINI_API_KEY=$geminiApiKey" `
    --project=$PROJECT_ID
if ($LastExitCode -ne 0) { throw "Google Cloud Run deployment failed." }

$serviceUrl = (gcloud run services describe $SERVICE_NAME --platform=managed --region=$REGION --project=$PROJECT_ID --format="value(status.url)" 2>$null)

Write-Host "====================================================" -ForegroundColor Green
Write-Host "Deployment Successful!" -ForegroundColor Green
Write-Host "====================================================" -ForegroundColor Green
Write-Host "Service URL: $serviceUrl" -ForegroundColor Cyan
Write-Host "CRON_SECRET: $cronSecret" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Green
Write-Host "Register these credentials in Supabase system_parameters:" -ForegroundColor Yellow
Write-Host "Key: cloudRunUrl  -> Value: $serviceUrl/api/tasks/run" -ForegroundColor Yellow
Write-Host "Key: cronSecret   -> Value: $cronSecret" -ForegroundColor Yellow
Write-Host "====================================================" -ForegroundColor Green
