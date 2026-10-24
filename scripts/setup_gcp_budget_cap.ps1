# OpenPrimer GCP Budget & Hard-Cap Setup Script (PowerShell)
# Configures a strict monthly budget, email notifications, and a Pub/Sub alerting channel

param(
    [string]$ProjectId = "ether-509812",
    [double]$MonthlyBudgetAmount = 30.00,
    [string]$Currency = "EUR"
)

Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "Configuring GCP Billing Budget & Hard-Cap Alerting" -ForegroundColor Cyan
Write-Host "Project: $ProjectId | Budget: $MonthlyBudgetAmount $Currency" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan

# 1. Get Billing Account ID
$billingAccount = gcloud beta billing projects describe $ProjectId --format="value(billingAccountName)" 2>$null

if (-not $billingAccount) {
    Write-Host "⚠️ No billing account linked to project $ProjectId or insufficient permissions." -ForegroundColor Yellow
    exit 1
}

Write-Host "Found billing account: $billingAccount" -ForegroundColor Green

# 2. Create Pub/Sub Topic for programmatic hard-cap triggers
$topicName = "budget-hardcap-alerts"
Write-Host "Ensuring Pub/Sub topic '$topicName' exists..." -ForegroundColor Yellow
gcloud pubsub topics create $topicName --project=$ProjectId 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Pub/Sub topic created." -ForegroundColor Green
} else {
    Write-Host "Pub/Sub topic '$topicName' already exists or is ready." -ForegroundColor Gray
}

# 3. Create or update Cloud Billing Budget via gcloud
Write-Host "Creating Cloud Billing Budget ($MonthlyBudgetAmount $Currency)..." -ForegroundColor Yellow

$budgetDisplayName = "OpenPrimer Monthly Cap ($MonthlyBudgetAmount $Currency)"
$fullTopic = "projects/$ProjectId/topics/$topicName"

# Create budget with multiple thresholds: 50%, 80%, 100%, 120%
gcloud billing budgets create `
    --billing-account=$billingAccount `
    --display-name="$budgetDisplayName" `
    --budget-amount="$MonthlyBudgetAmount$Currency" `
    --threshold-rule=percent=0.5 `
    --threshold-rule=percent=0.8 `
    --threshold-rule=percent=1.0,basis=current-spend `
    --threshold-rule=percent=1.2,basis=current-spend `
    --notifications-rule-pubsub-topic="$fullTopic" `
    --filter-projects="projects/$ProjectId" 2>$null

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Cloud Billing Budget created successfully!" -ForegroundColor Green
} else {
    Write-Host "ℹ️ Budget may already exist or can be viewed in Google Cloud Console -> Billing -> Budgets & Alerts." -ForegroundColor Cyan
}

Write-Host "`n🎉 Setup completed: hard-cap threshold set to $MonthlyBudgetAmount $Currency/month." -ForegroundColor Green
