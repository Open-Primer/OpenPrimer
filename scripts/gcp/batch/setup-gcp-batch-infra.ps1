<#
.SYNOPSIS
    OpenPrimer â€” Google Cloud Batch: One-Time Infrastructure Setup (PowerShell)
.DESCRIPTION
    Creates all GCP resources required to run OpenPrimer course generation &
    batch translations via Cloud Batch with SPOT instances.
#>

param (
    [string]$ProjectId = "ether-509812",
    [string]$Region = "europe-west1"
)

$ErrorActionPreference = "Continue"

$RegistryName = "openprimer-registry"
$GcsBucket = "gs://openprimer-batch-artifacts"
$SaName = "openprimer-batch-runner"
$SaEmail = "$SaName@$ProjectId.iam.gserviceaccount.com"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   OPENPRIMER â€” GCP BATCH INFRASTRUCTURE SETUP" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  Project ID   : $ProjectId"
Write-Host "  Region       : $Region"
Write-Host "  Registry     : $RegistryName"
Write-Host "  GCS Bucket   : $GcsBucket"
Write-Host "  Service Acct : $SaEmail"
Write-Host "----------------------------------------------------------"

# 1. Enable APIs
Write-Host "[1/4] Enabling required GCP APIs..." -ForegroundColor Yellow
gcloud services enable `
  batch.googleapis.com `
  artifactregistry.googleapis.com `
  aiplatform.googleapis.com `
  storage.googleapis.com `
  logging.googleapis.com `
  --project=$ProjectId

# 2. Artifact Registry
Write-Host "[2/4] Ensuring Artifact Registry '$RegistryName' exists..." -ForegroundColor Yellow
$repoCheck = gcloud artifacts repositories list --project=$ProjectId --location=$Region --filter="name:projects/$ProjectId/locations/$Region/repositories/$RegistryName" --format="value(name)" 2>$null
if (-not $repoCheck) {
    gcloud artifacts repositories create $RegistryName `
      --repository-format=docker `
      --location=$Region `
      --project=$ProjectId `
      --description="OpenPrimer worker engine Docker images"
    Write-Host "      Repository created." -ForegroundColor Green
} else {
    Write-Host "      Repository already exists." -ForegroundColor Green
}

# 3. GCS Bucket
Write-Host "[3/4] Ensuring GCS bucket '$GcsBucket' exists..." -ForegroundColor Yellow
$bucketCheck = gsutil ls -b $GcsBucket 2>$null
if (-not $bucketCheck) {
    gsutil mb -p $ProjectId -l $Region -b on $GcsBucket
    Write-Host "      Bucket created." -ForegroundColor Green
} else {
    Write-Host "      Bucket already exists." -ForegroundColor Green
}

# 4. Service Account
Write-Host "[4/4] Ensuring Service Account '$SaName' exists..." -ForegroundColor Yellow
$saCheck = gcloud iam service-accounts describe $SaEmail --project=$ProjectId 2>$null
if (-not $saCheck) {
    gcloud iam service-accounts create $SaName `
      --project=$ProjectId `
      --display-name="OpenPrimer Batch Runner" `
      --description="Service account for OpenPrimer Cloud Batch jobs"
    Write-Host "      Service account created." -ForegroundColor Green
} else {
    Write-Host "      Service account already exists." -ForegroundColor Green
}

# Bind roles
$roles = @(
  "roles/batch.agentReporter",
  "roles/aiplatform.user",
  "roles/storage.objectAdmin",
  "roles/logging.logWriter"
)

foreach ($role in $roles) {
    gcloud projects add-iam-policy-binding $ProjectId `
      --member="serviceAccount:$SaEmail" `
      --role=$role `
      --condition=None `
      --quiet 2>$null | Out-Null
}
Write-Host "      IAM roles bound successfully." -ForegroundColor Green

Write-Host "==========================================================" -ForegroundColor Green
Write-Host "[OK] OpenPrimer Cloud Batch infrastructure setup complete!" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green