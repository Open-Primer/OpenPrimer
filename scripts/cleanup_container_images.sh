#!/usr/bin/env bash
# OpenPrimer Container Image Cleanup Script (Bash)
# Keeps only the latest active Docker image and removes all untagged / orphan image layers

set -euo pipefail

PROJECT_ID="${1:-ether-509812}"
IMAGE_NAME="${2:-gcr.io/ether-509812/openprimer-generator-worker}"

echo "===================================================="
echo "Cleaning up obsolete Docker images on GCP GCR / AR"
echo "Image: $IMAGE_NAME | Project: $PROJECT_ID"
echo "===================================================="

# List untagged images and delete them
UNTAGGED_DIGESTS=$(gcloud container images list-tags "$IMAGE_NAME" --filter="-tags:*" --format="get(digest)" --project="$PROJECT_ID" 2>/dev/null || true)

if [ -n "$UNTAGGED_DIGESTS" ]; then
  for digest in $UNTAGGED_DIGESTS; do
    echo "Deleting untagged image layer: $digest..."
    gcloud container images delete "$IMAGE_NAME@$digest" --quiet --force-delete-tags --project="$PROJECT_ID"
  done
else
  echo "No untagged images found."
fi

echo "✅ Container image cleanup complete!"
