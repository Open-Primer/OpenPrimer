#!/bin/bash
# OpenPrimer Local Task Queue Worker Wrapper (Bash)

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cd "$SCRIPT_DIR/../web" || exit 1

echo -e "\033[36m🚀 OpenPrimer Local Queue Worker Runner\033[0m"
echo "----------------------------------------------------"

npx tsx scratch/run_queue_worker.ts
