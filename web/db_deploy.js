/**
 * OpenPrimer Database Schema Deployment & Seeding Script
 * Connects directly to Supabase PostgreSQL using the 'pg' library.
 */
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Read environment variables
try {
  require('dotenv').config({ path: path.join(__dirname, '.env.local') });
} catch (e) {
  // dotenv might not be installed, we can read .env.local manually
}

function parseEnv() {
  const envPath = path.join(__dirname, '.env.local');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    const lines = content.split('\n');
    lines.forEach(line => {
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
  console.error("🚨 Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_DB_PASSWORD must be defined in .env.local");
  process.exit(1);
}

// Extract project ref from Supabase URL: https://cayylzaasyqqpvuezufy.supabase.co -> cayylzaasyqqpvuezufy
const projectRefMatch = supabaseUrl.match(/https:\/\/([^.]+)\.supabase/);
if (!projectRefMatch) {
  console.error("🚨 Error: Could not extract project reference from NEXT_PUBLIC_SUPABASE_URL");
  process.exit(1);
}

const projectRef = projectRefMatch[1];
const host = `db.${projectRef}.supabase.co`;
const connectionString = `postgresql://postgres:${encodeURIComponent(dbPassword)}@${host}:5432/postgres`;

console.log(`🔌 Connecting to Supabase PostgreSQL: ${host}...`);

const client = new Client({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

async function run() {
  try {
    await client.connect();
    console.log("✅ Connected successfully!");

    // 1. Run Alteration Migrations first (ensure pre-existing tables are upgraded before schema executes)
    console.log("⏳ Applying schema upgrade migrations (ALTER TABLE statements)...");
    const migrations = [
      "ALTER TABLE public.tutor_personalities ADD COLUMN IF NOT EXISTS translations JSONB DEFAULT '{}'::jsonb",
      "ALTER TABLE public.tutor_personalities ADD COLUMN IF NOT EXISTS archiving_level INTEGER DEFAULT 0",
      "ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS is_curriculum BOOLEAN DEFAULT false",
      "ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS child_courses INTEGER[] DEFAULT '{}'::integer[]",
      "ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS translations JSONB DEFAULT '{}'::jsonb",
      "ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS archiving_level INTEGER DEFAULT 0",
      "ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS archived_languages TEXT[] DEFAULT '{}'::text[]",
      "ALTER TABLE public.achievements ADD COLUMN IF NOT EXISTS translations JSONB DEFAULT '{}'::jsonb",
      "ALTER TABLE public.achievements ADD COLUMN IF NOT EXISTS archiving_level INTEGER DEFAULT 0",
      "ALTER TABLE public.languages ADD COLUMN IF NOT EXISTS archiving_level INTEGER DEFAULT 0",
      "ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS password VARCHAR(255)",
      "ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS audio_volume NUMERIC(3, 2) DEFAULT 1.00",
      "ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS audio_rate NUMERIC(3, 2) DEFAULT 1.00",
      "ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS audio_voice_id VARCHAR(255) DEFAULT ''",
      "ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS version VARCHAR(50) DEFAULT 'v1.0.0'",
      "ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS last_revision_date TIMESTAMP WITH TIME ZONE",
      "UPDATE public.profiles SET password = '3ba484af8a5fe572560ac841e91b77c9ddb8d6a2f6d9cd203975b8dc16e7fabc' WHERE email = 'vanguard.mysterious@gmail.com'"
    ];

    for (const query of migrations) {
      try {
        await client.query(query);
      } catch (migrationErr) {
        // Log query warning but continue; typical if table doesn't exist yet
        console.log(`ℹ️ Migration note: ${migrationErr.message}`);
      }
    }
    console.log("✅ Upgrade migrations complete.");

    // 2. Run Schema
    const schemaPath = path.join(__dirname, 'src', 'lib', 'supabase_schema.sql');
    if (fs.existsSync(schemaPath)) {
      console.log("⏳ Deploying database schema...");
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      await client.query(schemaSql);
      console.log("✅ Schema successfully deployed!");
    } else {
      console.warn("⚠️ Schema file not found at src/lib/supabase_schema.sql");
    }

    // 3. Run Seed
    const seedPath = path.join(__dirname, 'src', 'lib', 'supabase_seed.sql');
    if (fs.existsSync(seedPath)) {
      console.log("⏳ Seeding core metadata (languages, achievements, personalities, courses)...");
      const seedSql = fs.readFileSync(seedPath, 'utf8');
      await client.query(seedSql);
      console.log("✅ Core database seed successfully completed!");
    } else {
      console.warn("⚠️ Seed file not found at src/lib/supabase_seed.sql");
    }

    console.log("\n🎉 Database fully aligned and initialized in direct database-first mode!");
  } catch (err) {
    console.error("🚨 Database operation failed:", err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
