#!/usr/bin/env bash
# OpenPrimer Cloud Run Job Deployment & Runner (Bash)
# Automates building the generation container and deploying it as a Cloud Run Job (timeout = 24h)

set -euo pipefail

PROJECT_ID="${1:-ether-509812}"
REGION="${2:-europe-west1}"
JOB_NAME="${3:-openprimer-generation-job}"

echo "===================================================="
echo "Deploying OpenPrimer Course Generation Cloud Run Job"
echo "Project: $PROJECT_ID | Region: $REGION | Timeout: 86400s (24h)"
echo "===================================================="

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WEB_DIR="$SCRIPT_DIR/../web"
ENV_FILE="$WEB_DIR/.env.local"

if [ ! -f "$ENV_FILE" ]; then
  echo "Error: .env.local not found at $ENV_FILE"
  exit 1
fi

# Load variables
SUPABASE_URL=$(grep "^NEXT_PUBLIC_SUPABASE_URL=" "$ENV_FILE" | cut -d '=' -f2- | tr -d '"' | tr -d "'")
SUPABASE_KEY=$(grep "^SUPABASE_SERVICE_ROLE_KEY=" "$ENV_FILE" | cut -d '=' -f2- | tr -d '"' | tr -d "'")

if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_KEY" ]; then
  echo "Error: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local"
  exit 1
fi

IMAGE_TAG="gcr.io/$PROJECT_ID/openprimer-generator-worker:latest"

echo "Building container image: $IMAGE_TAG via Cloud Build..."
gcloud builds submit "$WEB_DIR" --config "$WEB_DIR/cloudbuild-job.yaml" --project "$PROJECT_ID"

GEMINI_KEY=$(grep "^GEMINI_API_KEY=" "$ENV_FILE" | cut -d '=' -f2- | tr -d '"' | tr -d "'" || true)
if [ -z "$GEMINI_KEY" ]; then
  GEMINI_KEY=$(grep "^GOOGLE_API_KEY=" "$ENV_FILE" | cut -d '=' -f2- | tr -d '"' | tr -d "'" || true)
fi

SA_KEY_PATH="$WEB_DIR/secrets/openprimer-ether-sa-key.json"
SA_BASE64=""
if [ -f "$SA_KEY_PATH" ]; then
  SA_BASE64=$(base64 -w 0 "$SA_KEY_PATH" 2>/dev/null || base64 "$SA_KEY_PATH" | tr -d '\n')
fi

ENV_FLAGS="NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL,SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_KEY,VERTEX_PROJECT_ID=$PROJECT_ID,GEMINI_GENERATION_MODEL=gemini-3.5-flash-lite,NODE_ENV=production"
if [ -n "$GEMINI_KEY" ]; then
  ENV_FLAGS="$ENV_FLAGS,GEMINI_API_KEY=$GEMINI_KEY"
fi
if [ -n "$SA_BASE64" ]; then
  ENV_FLAGS="$ENV_FLAGS,VERTEX_SERVICE_ACCOUNT_BASE64=$SA_BASE64"
fi

echo "Deploying Cloud Run Job: $JOB_NAME with 24h timeout..."
gcloud run jobs deploy "$JOB_NAME" \
  --image "$IMAGE_TAG" \
  --region "$REGION" \
  --project "$PROJECT_ID" \
  --cpu 2 \
  --memory 4Gi \
  --task-timeout 86400s \
  --max-retries 0 \
  --set-env-vars "$ENV_FLAGS"

echo "✅ Cloud Run Job deployed successfully!"
echo "To trigger execution in the cloud:"
echo "  gcloud run jobs execute $JOB_NAME --region $REGION --project $PROJECT_ID"
