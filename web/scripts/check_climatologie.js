const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env.local');
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

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('slug', 'geographie_physique_et_climatologie')
    .single();

  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Course properties:', {
      id: data.id,
      slug: data.slug,
      is_active: data.is_active,
      isActive: data.isActive,
      archiving_level: data.archiving_level,
      archivingLevel: data.archivingLevel,
      isCurriculum: data.isCurriculum
    });
  }
}

check();
