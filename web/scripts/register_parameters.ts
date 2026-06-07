import path from 'path';
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

// Resolve environment loading compatible with ES Module and CommonJS
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
        const index = trimmed.indexOf('=');
        const key = trimmed.substring(0, index).trim();
        const value = trimmed.substring(index + 1).trim().replace(/^['"]|['"]$/g, '');
        if (key) {
          process.env[key] = value;
        }
      }
    });
  }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const cloudRunUrl = 'https://openprimer-worker-3l7ofqqacq-od.a.run.app/api/tasks/run';
const cronSecret = 'OPSecretGate_6e8a1d89';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function run() {
  console.log('🔗 Connecting to Supabase at:', supabaseUrl);
  console.log('⏳ Registering system parameters...');

  // Upsert cloudRunUrl
  const { error: err1 } = await supabase
    .from('system_parameters')
    .upsert({ key: 'cloudRunUrl', value: cloudRunUrl }, { onConflict: 'key' });

  if (err1) {
    console.error('❌ Failed to register cloudRunUrl:', err1.message);
  } else {
    console.log('✅ Successfully registered cloudRunUrl:', cloudRunUrl);
  }

  // Upsert cronSecret
  const { error: err2 } = await supabase
    .from('system_parameters')
    .upsert({ key: 'cronSecret', value: cronSecret }, { onConflict: 'key' });

  if (err2) {
    console.error('❌ Failed to register cronSecret:', err2.message);
  } else {
    console.log('✅ Successfully registered cronSecret:', cronSecret);
  }

  console.log('🎉 Database configuration completed!');
}

run();
