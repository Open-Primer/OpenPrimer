/**
 * OpenPrimer Database Migration - Vanguard Admin Protection Trigger
 * Deploy Postgres function and trigger to prevent deletion or modifications of the Vanguard Admin profile.
 * 
 * Usage: node scripts/protect_vanguard.js
 */
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

function parseEnv() {
  // Try loading from .env.local in the parent 'web' folder
  const envPath = path.join(__dirname, '..', '.env.local');
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

console.log(`🔌 Connecting to Supabase PostgreSQL at ${host}...`);

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function deployProtection() {
  try {
    await client.connect();
    console.log('✅ Connected successfully.');

    // 1. Deploy the protection function
    console.log('⏳ Creating/updating protect_vanguard_admin() function...');
    const ddlFunction = `
      CREATE OR REPLACE FUNCTION public.protect_vanguard_admin()
      RETURNS TRIGGER AS $$
      BEGIN
        IF OLD.id = '26d54efe-6f14-4e36-9fcf-3fcf684a4444' OR OLD.email = 'vanguard.mysterious@gmail.com' THEN
          RAISE EXCEPTION 'Deletion or modification of Vanguard Admin profile is prohibited.';
        END IF;
        RETURN OLD;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `;
    await client.query(ddlFunction);
    console.log('✅ Function created.');

    // 2. Drop existing trigger if it exists and create new one
    console.log('⏳ Creating trg_protect_vanguard_admin trigger on public.profiles...');
    const ddlTrigger = `
      DROP TRIGGER IF EXISTS trg_protect_vanguard_admin ON public.profiles;
      CREATE TRIGGER trg_protect_vanguard_admin
      BEFORE DELETE OR UPDATE OF email, role ON public.profiles
      FOR EACH ROW EXECUTE FUNCTION public.protect_vanguard_admin();
    `;
    await client.query(ddlTrigger);
    console.log('✅ Trigger deployed.');

    // 3. Verify trigger
    console.log('🔍 Verifying trigger installation...');
    const verifyRes = await client.query(`
      SELECT trigger_name 
      FROM information_schema.triggers 
      WHERE event_object_table = 'profiles' AND trigger_name = 'trg_protect_vanguard_admin';
    `);
    
    if (verifyRes.rows.length > 0) {
      console.log('🎉 Verification SUCCESS: trg_protect_vanguard_admin is ACTIVE on the profiles table!');
    } else {
      console.warn('⚠️ Warning: Trigger does not seem to be active. Please check manually.');
    }

  } catch (err) {
    console.error('❌ Error during trigger deployment:', err);
  } finally {
    await client.end();
  }
}

deployProtection();
