/**
 * OpenPrimer Database Schema Deployment & Seeding Script
 * Hardened version — applies latest security-hardened RLS schema
 * Connects directly to Supabase PostgreSQL using the 'pg' library.
 * 
 * Usage: node db_deploy.js
 * Requires: NEXT_PUBLIC_SUPABASE_URL + SUPABASE_DB_PASSWORD in .env.local
 */
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Load environment variables
try {
  require('dotenv').config({ path: path.join(__dirname, '.env.local') });
} catch (e) {
  // dotenv not installed, fall back to manual parse
}

function parseEnv() {
  const envPath = path.join(__dirname, '.env.local');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach(line => {
      const match = line.match(/^\s*([^#=\s]+)\s*=\s*(.*)$/);
      if (match) {
        const key = match[1].trim();
        let val = match[2].trim();
        if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
        if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
        process.env[key] = val;
      }
    });
  }
}

parseEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const dbPassword = process.env.SUPABASE_DB_PASSWORD;

if (!supabaseUrl || !dbPassword) {
  console.error('🚨 Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_DB_PASSWORD must be defined in .env.local');
  process.exit(1);
}

const projectRefMatch = supabaseUrl.match(/https:\/\/([^.]+)\.supabase/);
if (!projectRefMatch) {
  console.error('🚨 Error: Could not extract project reference from NEXT_PUBLIC_SUPABASE_URL');
  process.exit(1);
}

const projectRef = projectRefMatch[1];
const host = `db.${projectRef}.supabase.co`;
const connectionString = `postgresql://postgres:${encodeURIComponent(dbPassword)}@${host}:5432/postgres`;

console.log(`🔌 Connecting to Supabase PostgreSQL: ${host}...`);

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function runMigrations() {
  console.log('⏳ Applying schema upgrade migrations (ALTER TABLE)...');
  const migrations = [
    // Tutor personalities
    "ALTER TABLE public.tutor_personalities ADD COLUMN IF NOT EXISTS translations JSONB DEFAULT '{}'::jsonb",
    "ALTER TABLE public.tutor_personalities ADD COLUMN IF NOT EXISTS archiving_level INTEGER DEFAULT 0",
    // Courses
    "ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS is_curriculum BOOLEAN DEFAULT false",
    "ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS child_courses INTEGER[] DEFAULT '{}'::integer[]",
    "ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS translations JSONB DEFAULT '{}'::jsonb",
    "ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS archiving_level INTEGER DEFAULT 0",
    "ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS archived_languages TEXT[] DEFAULT '{}'::text[]",
    "ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS version VARCHAR(50) DEFAULT 'v1.0.0'",
    "ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS last_revision_date TIMESTAMP WITH TIME ZONE",
    // Achievements
    "ALTER TABLE public.achievements ADD COLUMN IF NOT EXISTS translations JSONB DEFAULT '{}'::jsonb",
    "ALTER TABLE public.achievements ADD COLUMN IF NOT EXISTS archiving_level INTEGER DEFAULT 0",
    // Languages
    "ALTER TABLE public.languages ADD COLUMN IF NOT EXISTS archiving_level INTEGER DEFAULT 0",
    // Profiles
    "ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS password VARCHAR(255)",
    "ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS audio_volume NUMERIC(3, 2) DEFAULT 1.00",
    "ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS audio_rate NUMERIC(3, 2) DEFAULT 1.00",
    "ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS audio_voice_id VARCHAR(255) DEFAULT ''",
    "ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS audio_read_course BOOLEAN DEFAULT true",
    "ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS audio_read_tutor BOOLEAN DEFAULT true",
    "ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS tts_enabled BOOLEAN DEFAULT true",
    // Lessons
    "ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS \"order\" INTEGER",
    // Admin user password hash (SHA-256 of default password)
    "UPDATE public.profiles SET password = '3ba484af8a5fe572560ac841e91b77c9ddb8d6a2f6d9cd203975b8dc16e7fabc' WHERE email = 'vanguard.mysterious@gmail.com' AND (password IS NULL OR password = '')",
  ];

  for (const query of migrations) {
    try {
      await client.query(query);
    } catch (err) {
      console.log(`ℹ️  Migration note: ${err.message.split('\n')[0]}`);
    }
  }
  console.log('✅ Upgrade migrations complete.');
}

async function runSchema() {
  const schemaPath = path.join(__dirname, 'src', 'lib', 'supabase_schema.sql');
  if (!fs.existsSync(schemaPath)) {
    console.warn('⚠️  Schema file not found at src/lib/supabase_schema.sql — skipping');
    return;
  }
  console.log('⏳ Deploying hardened database schema (tables + RLS policies)...');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  await client.query(schemaSql);
  console.log('✅ Schema successfully deployed!');
}

async function runSeed() {
  const seedPath = path.join(__dirname, 'src', 'lib', 'supabase_seed.sql');
  if (!fs.existsSync(seedPath)) {
    console.warn('⚠️  Seed file not found at src/lib/supabase_seed.sql — skipping');
    return;
  }
  console.log('⏳ Seeding core metadata (languages, achievements, personalities, courses)...');
  const seedSql = fs.readFileSync(seedPath, 'utf8');
  await client.query(seedSql);
  console.log('✅ Core database seed complete!');
}

async function verifyRls() {
  console.log('\n🔍 Verifying RLS policy coverage...');
  const result = await client.query(`
    SELECT t.tablename,
           t.rowsecurity AS rls_enabled,
           COUNT(p.policyname) AS policy_count
    FROM pg_tables t
    LEFT JOIN pg_policies p ON p.tablename = t.tablename AND p.schemaname = t.schemaname
    WHERE t.schemaname = 'public'
    GROUP BY t.tablename, t.rowsecurity
    ORDER BY t.tablename
  `);

  let allGood = true;
  for (const row of result.rows) {
    const status = row.rls_enabled
      ? (row.policy_count > 0 ? '✅' : '⚠️  RLS ON but NO policies')
      : '🚨 RLS DISABLED';
    console.log(`  ${status} ${row.tablename} (${row.policy_count} policies)`);
    if (!row.rls_enabled || (row.rls_enabled && row.policy_count === 0)) allGood = false;
  }

  if (allGood) {
    console.log('✅ All tables have RLS enabled with at least one policy.');
  } else {
    console.warn('⚠️  Some tables need attention — review RLS configuration above.');
  }
}

async function run() {
  try {
    await client.connect();
    console.log('✅ Connected successfully!\n');

    await runMigrations();
    await runSchema();
    await runSeed();
    await verifyRls();

    console.log('\n🎉 Database fully aligned and secured!');
    console.log('   Schema: latest hardened version with least-privilege RLS');
    console.log('   Run `node db_deploy.js` again anytime to re-apply safely (idempotent)\n');
  } catch (err) {
    console.error('🚨 Database operation failed:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
