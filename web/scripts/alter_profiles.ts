import './env-loader';
import { Client } from 'pg';

async function run() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const dbPassword = process.env.SUPABASE_DB_PASSWORD;

  if (!supabaseUrl || !dbPassword) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_DB_PASSWORD");
    process.exit(1);
  }

  // Parse project reference from https://[ref].supabase.co
  const match = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/);
  if (!match) {
    console.error("Invalid NEXT_PUBLIC_SUPABASE_URL format:", supabaseUrl);
    process.exit(1);
  }

  const projectRef = match[1];
  const host = `db.${projectRef}.supabase.co`;
  
  console.log(`Connecting to database at ${host}...`);

  const client = new Client({
    connectionString: `postgresql://postgres:${encodeURIComponent(dbPassword)}@${host}:5432/postgres`,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log("Connected successfully!");

    console.log("Adding missing columns to profiles table...");
    await client.query(`
      ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS reduce_motion BOOLEAN DEFAULT false;
      ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS dyslexia_friendly BOOLEAN DEFAULT false;
      ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS fine_visual_controls BOOLEAN DEFAULT false;
      ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS tutor_enabled BOOLEAN DEFAULT true;
      ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS colorblind_theme VARCHAR(100) DEFAULT 'none';
    `);

    console.log("Columns successfully verified/added!");
  } catch (error) {
    console.error("Error modifying table profiles:", error);
  } finally {
    await client.end();
  }
}

run();
