/**
 * OpenPrimer Database Test - Vanguard Admin Protection Verification
 * Attempts to delete/modify the Vanguard Admin profile to assert that our newly deployed trigger throws.
 * 
 * Usage: node scripts/test_vanguard_protection.js
 */
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

function parseEnv() {
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
const host = `db.${projectRefMatch[1]}.supabase.co`;
const connectionString = `postgresql://postgres:${encodeURIComponent(dbPassword)}@${host}:5432/postgres`;

console.log(`🔌 Connecting to Supabase PostgreSQL at ${host} to run protection tests...`);

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function runTests() {
  try {
    await client.connect();
    console.log('✅ Connected.');

    // Test 1: Try to delete the Vanguard Admin user
    console.log('\n🧪 TEST 1: Attempting to delete Vanguard Admin (should be blocked)...');
    try {
      await client.query("DELETE FROM public.profiles WHERE id = '26d54efe-6f14-4e36-9fcf-3fcf684a4444';");
      console.error('❌ FAILURE: Was able to delete Vanguard Admin! Trigger failed.');
    } catch (err) {
      if (err.message.includes('Deletion or modification of Vanguard Admin profile is prohibited.')) {
        console.log('✅ SUCCESS: Deletion was successfully BLOCKED by the trigger!');
        console.log(`   Error message: "${err.message}"`);
      } else {
        console.error('❌ FAILURE: Deletion failed but with unexpected error:', err.message);
      }
    }

    // Test 2: Try to change Vanguard Admin's role
    console.log('\n🧪 TEST 2: Attempting to modify Vanguard Admin\'s role (should be blocked)...');
    try {
      await client.query("UPDATE public.profiles SET role = 'user' WHERE id = '26d54efe-6f14-4e36-9fcf-3fcf684a4444';");
      console.error('❌ FAILURE: Was able to change Vanguard Admin role! Trigger failed.');
    } catch (err) {
      if (err.message.includes('Deletion or modification of Vanguard Admin profile is prohibited.')) {
        console.log('✅ SUCCESS: Role update was successfully BLOCKED by the trigger!');
        console.log(`   Error message: "${err.message}"`);
      } else {
        console.error('❌ FAILURE: Update failed but with unexpected error:', err.message);
      }
    }

    // Test 3: Try to change Vanguard Admin's name (unprotected column, should succeed)
    console.log('\n🧪 TEST 3: Attempting to update unprotected column "name" (should be allowed)...');
    try {
      await client.query("UPDATE public.profiles SET name = 'Vanguard Mysterious' WHERE id = '26d54efe-6f14-4e36-9fcf-3fcf684a4444';");
      console.log('✅ SUCCESS: Name update was successfully ALLOWED by the trigger!');
    } catch (err) {
      console.error('❌ FAILURE: Name update was blocked:', err.message);
    }

  } catch (err) {
    console.error('🚨 Test error:', err);
  } finally {
    await client.end();
  }
}

runTests();
