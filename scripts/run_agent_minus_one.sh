#!/bin/bash
# OpenPrimer Curriculum Seed & Task Queue Generator Wrapper (Bash)

# Determine the directory of the script and change to the web directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cd "$SCRIPT_DIR/../web" || exit 1

FLAG="--dry-run"
if [ "$1" == "--seed" ] || [ "$1" == "-s" ]; then
  FLAG="--seed"
elif [ "$1" == "--append" ] || [ "$1" == "-a" ]; then
  FLAG="--append"
fi

echo -e "\033[36m🧠 OpenPrimer Curriculum Generator (Agent -1) Runner\033[0m"
echo -e "\033[33mRunning in mode: $FLAG\033[0m"
echo "----------------------------------------------------"

npx tsx scratch/run_agent_minus_one.ts "$FLAG"
