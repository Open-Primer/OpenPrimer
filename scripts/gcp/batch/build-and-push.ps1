<#
.SYNOPSIS
    OpenPrimer — Build and Push Worker Docker Image to Artifact Registry (PowerShell)
#>

param (
    [string]$ProjectId = "ether-509812",
    [string]$Region = "europe-west1",
    [string]$ImageTag = "latest"
)

$ErrorActionPreference = "Stop"

$RegistryName = "openprimer-registry"
$Image = "$Region-docker.pkg.dev/$ProjectId/$RegistryName/openprimer-worker:$ImageTag"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   OPENPRIMER — BUILD & PUSH DOCKER WORKER IMAGE" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  Image Target: $Image"
Write-Host "----------------------------------------------------------"

# Authenticate Docker with Artifact Registry
Write-Host "Configuring Docker auth for $Region-docker.pkg.dev..." -ForegroundColor Yellow
gcloud auth configure-docker "$Region-docker.pkg.dev" --quiet

# Build Docker image
$webDir = Resolve-Path (Join-Path $PSScriptRoot "..\..\..\web")
Write-Host "Building Docker image from $webDir..." -ForegroundColor Yellow
docker build -t $Image $webDir

# Push Docker image
Write-Host "Pushing Docker image to Artifact Registry..." -ForegroundColor Yellow
docker push $Image

Write-Host "==========================================================" -ForegroundColor Green
Write-Host "✅ Docker image built and pushed successfully: $Image" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green