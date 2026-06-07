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
  
  // List of potential connection strings to try
  const connectionStrings = [
    // Pooler - Ohio (us-east-2) aws-1 - port 5432 (Session mode)
    `postgresql://postgres.${projectRef}:${encodeURIComponent(dbPassword)}@aws-1-us-east-2.pooler.supabase.com:5432/postgres`,
    // Pooler - Ohio (us-east-2) aws-1 - port 6543 (Transaction mode)
    `postgresql://postgres.${projectRef}:${encodeURIComponent(dbPassword)}@aws-1-us-east-2.pooler.supabase.com:6543/postgres`,
    // Pooler - Ohio (us-east-2) aws-0 - port 5432 (Session mode)
    `postgresql://postgres.${projectRef}:${encodeURIComponent(dbPassword)}@aws-0-us-east-2.pooler.supabase.com:5432/postgres`,
    // Pooler - Ohio (us-east-2) aws-0 - port 6543 (Transaction mode)
    `postgresql://postgres.${projectRef}:${encodeURIComponent(dbPassword)}@aws-0-us-east-2.pooler.supabase.com:6543/postgres`,
    // Pooler - Paris (eu-west-3) - port 5432 (Session mode)
    `postgresql://postgres.${projectRef}:${encodeURIComponent(dbPassword)}@aws-0-eu-west-3.pooler.supabase.com:5432/postgres`,
    // Pooler - Paris (eu-west-3) - port 6543 (Transaction mode)
    `postgresql://postgres.${projectRef}:${encodeURIComponent(dbPassword)}@aws-0-eu-west-3.pooler.supabase.com:6543/postgres`,
    // Pooler - Ireland (eu-west-1) - port 5432 (Session mode)
    `postgresql://postgres.${projectRef}:${encodeURIComponent(dbPassword)}@aws-0-eu-west-1.pooler.supabase.com:5432/postgres`,
    // Pooler - Ireland (eu-west-1) - port 6543 (Transaction mode)
    `postgresql://postgres.${projectRef}:${encodeURIComponent(dbPassword)}@aws-0-eu-west-1.pooler.supabase.com:6543/postgres`,
    // Pooler - US East 1 - port 5432
    `postgresql://postgres.${projectRef}:${encodeURIComponent(dbPassword)}@aws-0-us-east-1.pooler.supabase.com:5432/postgres`,
    // Fallback direct connection (uses IPv6)
    `postgresql://postgres:${encodeURIComponent(dbPassword)}@db.${projectRef}.supabase.co:5432/postgres`
  ];

  let client: Client | null = null;
  let connected = false;

  for (const connString of connectionStrings) {
    const obscuredUrl = connString.replace(/:[^:@]+@/, ':***@');
    console.log(`Attempting connection using: ${obscuredUrl}`);
    client = new Client({
      connectionString: connString,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 5000 // 5 seconds timeout per attempt
    });

    try {
      await client.connect();
      console.log("Connected successfully!");
      connected = true;
      break;
    } catch (err) {
      console.warn(`Connection failed:`, (err as Error).message);
      try {
        await client.end();
      } catch (endErr) {}
      client = null;
    }
  }

  if (!connected || !client) {
    console.error("Could not connect to Supabase database via any pooler region or direct connection.");
    process.exit(1);
  }

  try {
    console.log("Hardening RLS policies on 'task_queue' to restrict all client-side access strictly to authenticated admin...");
    await client.query(`
      -- Drop the temporary wide-open policy
      DROP POLICY IF EXISTS "Allow all access to task_queue" ON task_queue;
      
      -- Create a secure policy that only allows administrators (role = 'admin') to read/write/delete
      DROP POLICY IF EXISTS "Allow admin access to task_queue" ON task_queue;
      DROP POLICY IF EXISTS "Admins can access task_queue" ON task_queue;
      CREATE POLICY "Admins can access task_queue" ON task_queue 
        FOR ALL TO public 
        USING (public.is_admin() = true) 
        WITH CHECK (public.is_admin() = true);
        
      -- Ensure the service role still has absolute full access (needed for cron jobs and scripts)
      DROP POLICY IF EXISTS "Service role full access to task_queue" ON task_queue;
      CREATE POLICY "Service role full access to task_queue" ON task_queue
        FOR ALL TO service_role USING (true) WITH CHECK (true);
    `);

    console.log("RLS policies hardened and verified successfully!");
  } catch (error) {
    console.error("Error securing policies on task_queue:", error);
  } finally {
    await client.end().catch(() => {});
  }
}

run();
