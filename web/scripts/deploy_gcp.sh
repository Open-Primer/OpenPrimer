#!/usr/bin/env bash
# OpenPrimer Google Cloud Run Deployment Script (Human-Friendly for macOS/Linux)

set -e

# Configuration
PROJECT_ID="openprimer-free"
REGION="europe-west9"
REPO_NAME="openprimer-repo"
SERVICE_NAME="openprimer-worker"
ACCOUNT_EMAIL="vanguard.mysterious@gmail.com"

echo "===================================================="
echo -e "\033[0;36m🚀 Starting OpenPrimer Google Cloud Run Deployment\033[0m"
echo "===================================================="

# 1. Verify Active Account and Project
echo -e "\n\033[0;33m🔍 Checking gcloud configurations...\033[0m"
active_account=$(gcloud config get-value account 2>/dev/null)

if [ "$active_account" != "$ACCOUNT_EMAIL" ]; then
    echo -e "\033[0;36m⚠️ Active account is '$active_account'. Switching to '$ACCOUNT_EMAIL'...\033[0m"
    gcloud config set account "$ACCOUNT_EMAIL"
else
    echo -e "\033[0;32m✅ Account matches '$ACCOUNT_EMAIL'.\033[0m"
fi

echo -e "\033[0;32m✅ Setting active project to '$PROJECT_ID'...\033[0m"
gcloud config set project "$PROJECT_ID"

# 2. Parse Environment Variables from .env.local
echo -e "\n\033[0;33m🔑 Loading environment variables from .env.local...\033[0m"
script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
env_file="$script_dir/../.env.local"

if [ ! -f "$env_file" ]; then
    echo -e "\033[0;31m❌ Error: .env.local not found at $env_file\033[0m"
    exit 1
fi

# Simple parser for KEY=VALUE
parse_env() {
    local key=$1
    grep -E "^${key}\s*=" "$env_file" | head -n 1 | cut -d'=' -f2- | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//' -e 's/^"//' -e 's/"$//' -e "s/^'//" -e "s/'$//"
}

supabase_url=$(parse_env "NEXT_PUBLIC_SUPABASE_URL")
supabase_anon_key=$(parse_env "NEXT_PUBLIC_SUPABASE_ANON_KEY")
service_role_key=$(parse_env "SUPABASE_SERVICE_ROLE_KEY")
gemini_api_key=$(parse_env "GEMINI_API_KEY")
cron_secret=$(parse_env "CRON_SECRET")

if [ -z "$supabase_url" ]; then echo "❌ Error: NEXT_PUBLIC_SUPABASE_URL not found in .env.local"; exit 1; fi
if [ -z "$supabase_anon_key" ]; then echo "❌ Error: NEXT_PUBLIC_SUPABASE_ANON_KEY not found in .env.local"; exit 1; fi
if [ -z "$service_role_key" ]; then echo "❌ Error: SUPABASE_SERVICE_ROLE_KEY not found in .env.local"; exit 1; fi

if [ -z "$cron_secret" ]; then
    cron_secret="OPSecretGate_$(LC_ALL=C tr -dc 'a-zA-Z0-9' < /dev/urandom | fold -w 8 | head -n 1)"
    echo -e "\033[0;33m⚠️ CRON_SECRET not found. Generated: $cron_secret\033[0m"
else
    echo -e "\033[0;32m✅ Loaded CRON_SECRET from .env.local.\033[0m"
fi

# 3. Create Artifact Registry Repository if not exists
echo -e "\n\033[0;33m📦 Checking if Artifact Registry repository '$REPO_NAME' exists...\033[0m"
if ! gcloud artifacts repositories describe "$REPO_NAME" --location="$REGION" --project="$PROJECT_ID" &>/dev/null; then
    echo "Creating Docker repository '$REPO_NAME' in region '$REGION'..."
    gcloud artifacts repositories create "$REPO_NAME" \
        --repository-format=docker \
        --location="$REGION" \
        --description="Docker repository for OpenPrimer Web App" \
        --project="$PROJECT_ID"
    echo -e "\033[0;32m✅ Repository created successfully.\033[0m"
else
    echo -e "\033[0;32m✅ Repository '$REPO_NAME' already exists.\033[0m"
fi

# 4. Trigger Google Cloud Build Remote Compilation
echo -e "\n\033[0;33m🏗️ Building container image remotely using Google Cloud Build...\033[0m"
image_tag="$REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/web-app:latest"
web_dir="$(cd "$script_dir/.." && pwd)"

env_prod_path="$web_dir/.env.production"
gcloud_ignore_path="$web_dir/.gcloudignore"

cleanup() {
    echo -e "\n\033[0;33m🧹 Cleaning up temporary build-time files...\033[0m"
    rm -f "$env_prod_path" "$gcloud_ignore_path"
}
trap cleanup EXIT

echo -e "📝 Creating temporary build-time files (.env.production & .gcloudignore)..."
cat << EOF > "$env_prod_path"
NEXT_PUBLIC_SUPABASE_URL=$supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=$supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=$service_role_key
GEMINI_API_KEY=$gemini_api_key
CRON_SECRET=$cron_secret
EOF

cat << EOF > "$gcloud_ignore_path"
# Standard gcloudignore rules
.gcloudignore
.git/
.gitignore

# Ignore build artifacts and caches
node_modules/
.next/
playwright-report/
test-results/
.codex/
.cursor/
.vscode/
.zed/

# Protect sensitive secrets
secrets/
*.json.key
*-service-account*.json
openprimer-free*.json
*serviceaccount*.json

# DO NOT ignore .env.production so Next.js build gets its build-time variables!
! .env.production
EOF

echo "Running build submit from $web_dir..."
gcloud builds submit "$web_dir" --tag "$image_tag" --project="$PROJECT_ID"

echo -e "\033[0;32m✅ Remote build completed and pushed to Artifact Registry.\033[0m"

# 5. Deploy Container to Google Cloud Run
echo -e "\n\033[0;33m🚀 Deploying container to Google Cloud Run...\033[0m"

gcloud run deploy "$SERVICE_NAME" \
    --image="$image_tag" \
    --platform=managed \
    --region="$REGION" \
    --allow-unauthenticated \
    --port=3000 \
    --set-env-vars="NEXT_PUBLIC_SUPABASE_URL=${supabase_url},NEXT_PUBLIC_SUPABASE_ANON_KEY=${supabase_anon_key},SUPABASE_SERVICE_ROLE_KEY=${service_role_key},CRON_SECRET=${cron_secret},GEMINI_API_KEY=${gemini_api_key}" \
    --project="$PROJECT_ID"

service_url=$(gcloud run services describe "$SERVICE_NAME" --platform=managed --region="$REGION" --project="$PROJECT_ID" --format="value(status.url)" 2>/dev/null)

echo -e "\n===================================================="
echo -e "\033[0;32m🎉 Deployment Successful!\033[0m"
echo "===================================================="
echo -e "Service URL: \033[0;36m$service_url\033[0m"
echo -e "CRON_SECRET: \033[0;36m$cron_secret\033[0m"
echo "===================================================="
echo -e "\033[0;33m👉 Register these credentials in Supabase system_parameters:\033[0m"
echo "Key: 'cloudRunUrl'  -> Value: $service_url/api/tasks/run"
echo "Key: 'cronSecret'   -> Value: $cron_secret"
echo "===================================================="
