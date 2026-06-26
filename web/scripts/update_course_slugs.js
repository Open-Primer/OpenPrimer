const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manually parse .env.local
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w_]+)\s*=\s*(.*)\s*$/);
  if (match) {
    env[match[1]] = match[2].trim();
  }
});

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseKey = env['SUPABASE_SERVICE_ROLE_KEY'];

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing keys in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const slugUpdates = [
  { id: 1200, oldSlug: 'intro_linguistique', newSlug: 'Introduction_a_la_Semantique_et_Phonetique' },
  { id: 1201, oldSlug: 'espagnol_fondamental', newSlug: 'Espagnol_Fondamental_Syntaxe_et_Expression' }
];

async function run() {
  console.log("🚀 Aligning course slugs with clean path segments...");
  for (const item of slugUpdates) {
    console.log(`Updating Course ID ${item.id}: "${item.oldSlug}" ➡️ "${item.newSlug}"`);
    const { error } = await supabase
      .from('courses')
      .update({ slug: item.newSlug })
      .eq('id', item.id);

    if (error) {
      console.error(`🚨 Error updating course ${item.id}:`, error.message);
    } else {
      console.log(`✅ Successfully updated course ID ${item.id}`);
    }
  }
  console.log("🎉 Course slugs alignment completed!");
}

run();
