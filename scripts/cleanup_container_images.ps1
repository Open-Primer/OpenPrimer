# OpenPrimer Container Image Cleanup Script (PowerShell)
# Keeps only the latest active Docker image and removes all untagged / orphan image layers

param(
    [string]$ProjectId = "ether-509812",
    [string]$ImageName = "gcr.io/ether-509812/openprimer-generator-worker"
)

Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "Cleaning up obsolete Docker images on GCP GCR / AR" -ForegroundColor Cyan
Write-Host "Image: $ImageName | Project: $ProjectId" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan

# 1. List all image digests
$digests = gcloud container images list-tags $ImageName --project=$ProjectId --format="get(digest,tags)" 2>$null

if (-not $digests) {
    Write-Host "No images found for $ImageName." -ForegroundColor Yellow
    exit 0
}

# 2. Find untagged digests or older digests
$allImages = gcloud container images list-tags $ImageName --project=$ProjectId --sort-by=~timestamp --format="json" | ConvertFrom-Json

Write-Host "Found $($allImages.Count) image layer(s)." -ForegroundColor Cyan

if ($allImages.Count -le 1) {
    Write-Host "✅ Only 1 image exists. No cleanup needed." -ForegroundColor Green
    exit 0
}

# Keep index 0 (the most recent one), delete the rest
$toDelete = $allImages | Select-Object -Skip 1

foreach ($img in $toDelete) {
    $digest = $img.digest
    $tagStr = if ($img.tags) { $img.tags -join ", " } else { "<untagged>" }
    Write-Host "Deleting obsolete image: $digest ($tagStr)..." -ForegroundColor Yellow
    gcloud container images delete "$ImageName@$digest" --quiet --force-delete-tags --project=$ProjectId
}

Write-Host "✅ Container image cleanup complete. Storage freed!" -ForegroundColor Green
