import { initializeAccounts, optimizeAccountQuotasInBackground } from '../src/lib/vertex-client';
import fs from 'fs';
import path from 'path';

// Load .env.local manually
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const parts = trimmed.split('=');
      const key = parts[0].trim();
      const value = parts.slice(1).join('=').trim();
      process.env[key] = value;
    }
  }
}

async function run() {
  console.log("Initializing accounts...");
  const accounts = await initializeAccounts(true);
  console.log(`Initialized ${accounts.length} accounts.`);
  for (const acc of accounts) {
    console.log(`Optimizing quotas for account: ${acc.projectId}`);
    await optimizeAccountQuotasInBackground(acc);
  }
}

run().catch(console.error);
