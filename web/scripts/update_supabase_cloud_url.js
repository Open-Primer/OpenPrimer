const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};

for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const parts = trimmed.split('=');
    const key = parts[0].trim();
    const value = parts.slice(1).join('=').trim();
    env[key] = value;
  }
}

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseServiceKey = env['SUPABASE_SERVICE_ROLE_KEY'];

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const cloudRunEndpoint = 'https://openprimer-worker-170696028139.europe-west9.run.app/api/tasks/run';
const cronSecret = env['CRON_SECRET'] || 'OPSecretGate_280f1019';

async function updateConfig() {
  console.log("Updating Supabase system_parameters with live Cloud Run URL...");

  // Update cloudRunUrl
  const { error: err1 } = await supabase
    .from('system_parameters')
    .upsert({ key: 'cloudRunUrl', value: cloudRunEndpoint }, { onConflict: 'key' });

  if (err1) console.error("Error updating cloudRunUrl:", err1.message);
  else console.log("  ✅ cloudRunUrl updated to:", cloudRunEndpoint);

  // Update cronSecret
  const { error: err2 } = await supabase
    .from('system_parameters')
    .upsert({ key: 'cronSecret', value: cronSecret }, { onConflict: 'key' });

  if (err2) console.error("Error updating cronSecret:", err2.message);
  else console.log("  ✅ cronSecret updated to:", cronSecret);

  // Update maxConcurrentWorkers to 4
  const { error: err3 } = await supabase
    .from('system_parameters')
    .upsert({ key: 'maxConcurrentWorkers', value: '4' }, { onConflict: 'key' });

  if (err3) console.error("Error updating maxConcurrentWorkers:", err3.message);
  else console.log("  ✅ maxConcurrentWorkers updated to: 4");

  process.exit(0);
}

updateConfig().catch(console.error);
