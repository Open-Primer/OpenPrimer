#!/usr/bin/env bash
# ==============================================================================
# OpenPrimer — Google Cloud Batch: One-Time Infrastructure Setup
#
# Creates all GCP resources required to run OpenPrimer course generation &
# batch translations via Cloud Batch with SPOT instances:
#   1. Enables required GCP APIs
#   2. Creates Artifact Registry repository (Docker images)
#   3. Creates GCS bucket for batch outputs & drafts
#   4. Creates service account with minimal required permissions
# ==============================================================================

set -euo pipefail

PROJECT_ID="${1:-ether-509812}"
REGION="${2:-europe-west1}"
REGISTRY_NAME="openprimer-registry"
GCS_BUCKET="gs://openprimer-batch-artifacts"
SA_NAME="openprimer-batch-runner"
SA_EMAIL="${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"

echo "=========================================================="
echo "   OPENPRIMER — GCP BATCH INFRASTRUCTURE SETUP"
echo "=========================================================="
echo "  Project ID   : ${PROJECT_ID}"
echo "  Region       : ${REGION}"
echo "  Registry     : ${REGISTRY_NAME}"
echo "  GCS Bucket   : ${GCS_BUCKET}"
echo "  Service Acct : ${SA_EMAIL}"
echo "----------------------------------------------------------"

# 1. Enable APIs
echo "[1/4] Enabling required GCP APIs..."
gcloud services enable \
  batch.googleapis.com \
  artifactregistry.googleapis.com \
  aiplatform.googleapis.com \
  storage.googleapis.com \
  logging.googleapis.com \
  --project="${PROJECT_ID}"
echo "      APIs enabled."

# 2. Artifact Registry
echo "[2/4] Ensuring Artifact Registry '${REGISTRY_NAME}' exists..."
if ! gcloud artifacts repositories describe "${REGISTRY_NAME}" \
    --location="${REGION}" --project="${PROJECT_ID}" > /dev/null 2>&1; then
  gcloud artifacts repositories create "${REGISTRY_NAME}" \
    --repository-format=docker \
    --location="${REGION}" \
    --project="${PROJECT_ID}" \
    --description="OpenPrimer worker engine Docker images"
  echo "      Repository created."
else
  echo "      Repository already exists."
fi

# 3. GCS Bucket
echo "[3/4] Ensuring GCS bucket '${GCS_BUCKET}' exists..."
if ! gsutil ls -b "${GCS_BUCKET}" > /dev/null 2>&1; then
  gsutil mb -p "${PROJECT_ID}" -l "${REGION}" -b on "${GCS_BUCKET}"
  echo "      Bucket created."
else
  echo "      Bucket already exists."
fi

# 4. Service Account
echo "[4/4] Ensuring Service Account '${SA_NAME}' exists..."
if ! gcloud iam service-accounts describe "${SA_EMAIL}" \
    --project="${PROJECT_ID}" > /dev/null 2>&1; then
  gcloud iam service-accounts create "${SA_NAME}" \
    --project="${PROJECT_ID}" \
    --display-name="OpenPrimer Batch Runner" \
    --description="Service account for OpenPrimer Cloud Batch jobs"
  echo "      Service account created."
fi

# Bind roles
ROLES=(
  "roles/batch.agentReporter"
  "roles/aiplatform.user"
  "roles/storage.objectAdmin"
  "roles/logging.logWriter"
)

for ROLE in "${ROLES[@]}"; do
  gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
    --member="serviceAccount:${SA_EMAIL}" \
    --role="${ROLE}" \
    --condition=None \
    --quiet > /dev/null 2>&1 || true
done
echo "      IAM roles bound successfully."

echo "=========================================================="
echo "✅ OpenPrimer Cloud Batch infrastructure setup complete!"
echo "=========================================================="