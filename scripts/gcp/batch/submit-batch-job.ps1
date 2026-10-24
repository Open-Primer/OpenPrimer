<#
.SYNOPSIS
    OpenPrimer — Submit a Google Cloud Batch Job with SPOT Instances (PowerShell)
#>

param (
    [string]$JobType = "worker",
    [string]$CourseName = "",
    [string]$Level = "L1",
    [string]$TargetLang = "fr",
    [int]$Workers = 1,
    [string]$MachineType = "e2-standard-4",
    [bool]$UseSpot = $true,
    [string]$ProjectId = "ether-509812",
    [string]$Region = "europe-west1",
    [string]$ImageTag = "latest"
)

$ErrorActionPreference = "Stop"

$RegistryName = "openprimer-registry"
$Image = "$Region-docker.pkg.dev/$ProjectId/$RegistryName/openprimer-worker:$ImageTag"
$SaEmail = "openprimer-batch-runner@$ProjectId.iam.gserviceaccount.com"

$Timestamp = (Get-Date).ToString("yyyyMMdd-HHmmss")
$JobName = "op-$JobType-$Timestamp"

$ProvisioningModel = if ($UseSpot) { "SPOT" } else { "STANDARD" }

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   OPENPRIMER — SUBMITTING CLOUD BATCH SPOT JOB" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  Job Name     : $JobName"
Write-Host "  Job Type     : $JobType"
Write-Host "  Provisioning : $ProvisioningModel (Spot ~80% discount)"
Write-Host "  Machine Type : $MachineType"
Write-Host "  Replicas     : $Workers"
Write-Host "  Image        : $Image"
Write-Host "  Project ID   : $ProjectId"
Write-Host "----------------------------------------------------------"

$jobSpec = @"
{
  "taskGroups": [
    {
      "taskSpec": {
        "runnables": [
          {
            "container": {
              "imageUri": "$Image",
              "entrypoint": "/bin/sh",
              "commands": ["-c",
                "node scripts/run_parallel_generation.js || node scripts/batch_translate.js"
              ]
            },
            "environment": {
              "variables": {
                "CLI_WORKER": "true",
                "VERTEX_PROJECT_ID": "$ProjectId",
                "VERTEX_LOCATION": "$Region",
                "COURSE_NAME": "$CourseName",
                "LEVEL": "$Level",
                "TARGET_LANG": "$TargetLang"
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
      "taskCount": $Workers,
      "parallelism": $Workers
    }
  ],
  "allocationPolicy": {
    "instances": [
      {
        "policy": {
          "machineType": "$MachineType",
          "provisioningModel": "$ProvisioningModel"
        }
      }
    ],
    "serviceAccount": {
      "email": "$SaEmail"
    }
  },
  "logsPolicy": {
    "destination": "CLOUD_LOGGING"
  }
}
"@

$jobSpec | gcloud batch jobs submit $JobName `
  --project=$ProjectId `
  --location=$Region `
  --config=-

Write-Host ""
Write-Host "✅ Job submitted: $JobName" -ForegroundColor Green
Write-Host "   Logs: https://console.cloud.google.com/batch/jobsDetails/regions/$Region/jobs/$JobName?project=$ProjectId" -ForegroundColor Cyan