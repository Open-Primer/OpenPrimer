#!/usr/bin/env bash
# ==============================================================================
# OpenPrimer — Submit a Google Cloud Batch Job with SPOT Instances
# ==============================================================================

set -euo pipefail

JOB_TYPE="${1:-worker}"  # "worker" (queue drainer) or "course" or "translate"
COURSE_NAME="${2:-}"
LEVEL="${3:-L1}"
TARGET_LANG="${4:-fr}"
WORKERS="${5:-1}"
MACHINE_TYPE="${6:-e2-standard-4}"
USE_SPOT="${7:-true}"
PROJECT_ID="${8:-ether-509812}"
REGION="${9:-europe-west1}"
IMAGE_TAG="${10:-latest}"

GCS_BUCKET="openprimer-batch-artifacts"
IMAGE="${REGION}-docker.pkg.dev/${PROJECT_ID}/openprimer-registry/openprimer-worker:${IMAGE_TAG}"
SA_EMAIL="openprimer-batch-runner@${PROJECT_ID}.iam.gserviceaccount.com"

TIMESTAMP=$(date +%Y%m%d-%H%M%S)
JOB_NAME="op-${JOB_TYPE}-${TIMESTAMP}"

if [ "${USE_SPOT}" = "true" ]; then
  PROVISIONING_MODEL="SPOT"
else
  PROVISIONING_MODEL="STANDARD"
fi

echo "=========================================================="
echo "   OPENPRIMER — SUBMITTING CLOUD BATCH SPOT JOB"
echo "=========================================================="
echo "  Job Name     : ${JOB_NAME}"
echo "  Job Type     : ${JOB_TYPE}"
echo "  Provisioning : ${PROVISIONING_MODEL} (Spot ~80% discount)"
echo "  Machine Type : ${MACHINE_TYPE}"
echo "  Replicas     : ${WORKERS}"
echo "  Image        : ${IMAGE}"
echo "  Project ID   : ${PROJECT_ID}"
echo "----------------------------------------------------------"

JOB_SPEC=$(cat << EOF
{
  "taskGroups": [
    {
      "taskSpec": {
        "runnables": [
          {
            "container": {
              "imageUri": "${IMAGE}",
              "entrypoint": "/bin/sh",
              "commands": ["-c",
                "node scripts/run_parallel_generation.js || node scripts/batch_translate.js"
              ]
            },
            "environment": {
              "variables": {
                "CLI_WORKER": "true",
                "VERTEX_PROJECT_ID": "${PROJECT_ID}",
                "VERTEX_LOCATION": "${REGION}",
                "COURSE_NAME": "${COURSE_NAME}",
                "LEVEL": "${LEVEL}",
                "TARGET_LANG": "${TARGET_LANG}"
              }
            }
          }
        ],
        "computeResource": {
          "cpuMilli": 4000,
          "memoryMib": 8192
        },
        "maxRetryCount": 2,
        "maxRunDuration": "14400s"
      },
      "taskCount": ${WORKERS},
      "parallelism": ${WORKERS}
    }
  ],
  "allocationPolicy": {
    "instances": [
      {
        "policy": {
          "machineType": "${MACHINE_TYPE}",
          "provisioningModel": "${PROVISIONING_MODEL}"
        }
      }
    ],
    "serviceAccount": {
      "email": "${SA_EMAIL}"
    }
  },
  "logsPolicy": {
    "destination": "CLOUD_LOGGING"
  }
}
EOF
)

echo "${JOB_SPEC}" | gcloud batch jobs submit "${JOB_NAME}" \
  --project="${PROJECT_ID}" \
  --location="${REGION}" \
  --config=-

echo ""
echo "✅ Job submitted: ${JOB_NAME}"
echo "   Logs: https://console.cloud.google.com/batch/jobsDetails/regions/${REGION}/jobs/${JOB_NAME}?project=${PROJECT_ID}"