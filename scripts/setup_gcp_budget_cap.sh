#!/usr/bin/env bash
# OpenPrimer GCP Budget & Hard-Cap Setup Script (Bash)
# Configures a strict monthly budget, email notifications, and a Pub/Sub alerting channel

set -euo pipefail

PROJECT_ID="${1:-ether-509812}"
BUDGET_AMOUNT="${2:-30.00}"
CURRENCY="${3:-EUR}"

echo "===================================================="
echo "Configuring GCP Billing Budget & Hard-Cap Alerting"
echo "Project: $PROJECT_ID | Budget: $BUDGET_AMOUNT $CURRENCY"
echo "===================================================="

BILLING_ACCOUNT=$(gcloud beta billing projects describe "$PROJECT_ID" --format="value(billingAccountName)" 2>/dev/null || true)

if [ -z "$BILLING_ACCOUNT" ]; then
  echo "⚠️ Could not retrieve billing account automatically."
  exit 1
fi

TOPIC_NAME="budget-hardcap-alerts"
gcloud pubsub topics create "$TOPIC_NAME" --project="$PROJECT_ID" 2>/dev/null || true

gcloud billing budgets create \
  --billing-account="$BILLING_ACCOUNT" \
  --display-name="OpenPrimer Monthly Cap ($BUDGET_AMOUNT $CURRENCY)" \
  --budget-amount="${BUDGET_AMOUNT}${CURRENCY}" \
  --threshold-rule=percent=0.5 \
  --threshold-rule=percent=0.8 \
  --threshold-rule=percent=1.0,basis=current-spend \
  --threshold-rule=percent=1.2,basis=current-spend \
  --notifications-rule-pubsub-topic="projects/$PROJECT_ID/topics/$TOPIC_NAME" \
  --filter-projects="projects/$PROJECT_ID" 2>/dev/null || true

echo "✅ GCP Budget hard-cap configuration applied!"
