const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
const { execSync } = require('child_process');

async function runSetup() {
  console.log("=============================================");
  console.log("   🚀 OpenPrimer Supabase Database Setup    ");
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

  console.log("🔌 Database Host:", dbHost);
  console.log("🔑 Authenticating as owner 'postgres'...");

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

    // 2. Read the supabase_schema.sql
    const schemaPath = path.join(__dirname, '../src/lib/supabase_schema.sql');
    if (!fs.existsSync(schemaPath)) {
      throw new Error("Schema SQL file not found at: " + schemaPath);
    }

    console.log("📖 Reading schema definition script from:", schemaPath);
    const schemaSQL = fs.readFileSync(schemaPath, 'utf-8');

    console.log("⚡ Executing initial database schema script to create tables and RLS policies...");
    await pgClient.query(schemaSQL);
    console.log("✅ Database schema successfully created and initialized!");

    await pgClient.end();

    // 3. Run the seed_fresh_database.js script to populate the seeded data
    const seedScriptPath = path.join(__dirname, '../scripts/seed_fresh_database.js');
    console.log("\n🌱 Seeding initial dynamic achievements, languages, and tutor accounts...");
    console.log("Executing: node scripts/seed_fresh_database.js");
    
    const output = execSync('node scripts/seed_fresh_database.js', { cwd: path.join(__dirname, '..'), encoding: 'utf-8' });
    console.log(output);

    console.log("=============================================");
    console.log("   🎉 PRODUCTION DATABASE SET UP SUCCESSFULLY! ");
    console.log("=============================================\n");
  } catch (error) {
    console.error("\n❌ Database setup failed with error:", error.message);
    try {
      await pgClient.end();
    } catch (e) {}
    process.exit(1);
  }
}

runSetup();
