const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

async function grantPrivileges() {
  console.log("=============================================");
  console.log("   🔑 OpenPrimer Supabase Privilege Grant    ");
  console.log("=============================================\n");

  // 1. Read configuration from .env.local
  const envPath = path.join(__dirname, '../.env.local');
  if (!fs.existsSync(envPath)) {
    console.error("Error: .env.local file not found at: " + envPath);
    process.exit(1);
  }

  const envContent = fs.readFileSync(envPath, 'utf-8');
  const env = {};
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w_]+)\s*=\s*(.+?)\s*$/);
    if (match) {
      env[match[1]] = match[2].trim();
    }
  });

  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const dbPassword = env.SUPABASE_DB_PASSWORD;

  if (!supabaseUrl || !dbPassword) {
    console.error("Error: Missing Supabase configurations in .env.local");
    process.exit(1);
  }

  const hostMatch = supabaseUrl.match(/https:\/\/([^.]+)\.supabase/);
  if (!hostMatch) {
    console.error("Error: Invalid Supabase URL format:", supabaseUrl);
    process.exit(1);
  }
  const dbHost = `db.${hostMatch[1]}.supabase.co`;

  const pgClient = new Client({
    host: dbHost,
    port: 5432,
    user: 'postgres',
    password: dbPassword,
    database: 'postgres',
    ssl: { rejectUnauthorized: false }
  });

  try {
    await pgClient.connect();
    console.log("🔌 Connected to Supabase PostgreSQL database successfully!");

    console.log("⚡ Granting SELECT privileges on public tables to 'anon' and 'authenticated' roles...");
    await pgClient.query(`
      -- Grant select privileges to public / anon / authenticated on read-only tables
      GRANT SELECT ON public.languages TO public, anon, authenticated;
      GRANT SELECT ON public.achievements TO public, anon, authenticated;
      GRANT SELECT ON public.tutor_personalities TO public, anon, authenticated;
      GRANT SELECT ON public.courses TO public, anon, authenticated;

      -- Grant select, insert, update privileges on profiles and transactional tables
      GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO public, anon, authenticated;
      GRANT INSERT, SELECT ON public.contact_feedbacks TO public, anon, authenticated;
      GRANT INSERT, SELECT ON public.search_logs TO public, anon, authenticated;
      GRANT SELECT, INSERT, UPDATE, DELETE ON public.task_queue TO public, anon, authenticated;

      -- Grant usage on sequences so inserting works
      GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA public TO public, anon, authenticated;
    `);
    console.log("✅ Privileges successfully granted on all tables and sequences!");

    await pgClient.end();
    console.log("\n=============================================");
    console.log("   🎉 DATABASE PRIVILEGES GRANTED SUCCESSFULLY! ");
    console.log("=============================================\n");
  } catch (error) {
    console.error("\n❌ Privilege grant failed with error:", error.message);
    try {
      await pgClient.end();
    } catch (e) {}
    process.exit(1);
  }
}

grantPrivileges();
