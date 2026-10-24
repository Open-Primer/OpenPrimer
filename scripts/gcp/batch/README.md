# OpenPrimer — Google Cloud Batch & Spot Provisioning (HPC Mode)

This directory contains infrastructure automation and runner scripts for executing OpenPrimer course generation tasks and 9-language batch translation pipelines on **Google Cloud Batch** with **Spot VMs** (`provisioningModel: "SPOT"`).

---

## 🌟 Why Cloud Batch + Spot VMs?

| Feature | Local Execution | Cloud Run | **Cloud Batch (Spot HPC)** |
|---|---|---|---|
| **VM Lifecycle** | Tied to local machine | Limited to 60-min timeouts | **Ephemeral — auto-terminates on queue completion** |
| **Idle Cost** | $0 (local power) | Pay for base container | **$0 when no generation is active** |
| **Spot Discount** | N/A | No Spot support | **~80% discount vs on-demand instances** |
| **Concurrency** | Limited by local CPU | Bounded by max instances | **Native task arrays & worker pools** |
| **Rate Limit Management** | Interactive RPM caps | Interactive limits | **Asynchronous queue drainer** |

---

## 🚀 Quickstart Workflow

### 1. One-Time Infrastructure Setup
```powershell
.\scripts\gcp\batch\setup-gcp-batch-infra.ps1 -ProjectId "ether-509812" -Region "europe-west1"
```
Or in Bash:
```bash
./scripts/gcp/batch/setup-gcp-batch-infra.sh ether-509812 europe-west1
```

### 2. Build & Push Worker Image
```powershell
.\scripts\gcp\batch\build-and-push.ps1 -ProjectId "ether-509812" -Region "europe-west1"
```

### 3. Submit Spot Batch Job
```powershell
# Run a Spot worker queue drainer
.\scripts\gcp\batch\submit-batch-job.ps1 -JobType "worker" -Workers 2 -UseSpot $true

# Run a specific course generation on Spot VM
.\scripts\gcp\batch\submit-batch-job.ps1 -JobType "course" -CourseName "Mécanique Quantique" -Level "L3" -UseSpot $true
```