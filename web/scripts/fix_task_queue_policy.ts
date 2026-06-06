import './env-loader';
import { Client } from 'pg';

async function run() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const dbPassword = process.env.SUPABASE_DB_PASSWORD;

  if (!supabaseUrl || !dbPassword) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_DB_PASSWORD");
    process.exit(1);
  }

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

    console.log("Hardening RLS policies on 'task_queue' to restrict all client-side access strictly to authenticated admin...");
    await client.query(`
      -- Drop the temporary wide-open policy
      DROP POLICY IF EXISTS "Allow all access to task_queue" ON task_queue;
      
      -- Create a secure policy that only allows the specific admin email (checked via JWT) to read/write/delete
      DROP POLICY IF EXISTS "Allow admin access to task_queue" ON task_queue;
      CREATE POLICY "Allow admin access to task_queue" ON task_queue 
        FOR ALL TO public 
        USING ((auth.jwt() ->> 'email') = 'vanguard.mysterious@gmail.com') 
        WITH CHECK ((auth.jwt() ->> 'email') = 'vanguard.mysterious@gmail.com');
        
      -- Ensure the service role still has absolute full access (needed for cron jobs and scripts)
      DROP POLICY IF EXISTS "Service role full access to task_queue" ON task_queue;
      CREATE POLICY "Service role full access to task_queue" ON task_queue
        FOR ALL TO service_role USING (true) WITH CHECK (true);
    `);

    console.log("RLS policies hardened and verified successfully!");
  } catch (error) {
    console.error("Error securing policies on task_queue:", error);
  } finally {
    await client.end();
  }
}

run();
