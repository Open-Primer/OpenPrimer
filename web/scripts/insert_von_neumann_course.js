const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables from web/.env.local
function parseEnv() {
  const envPath = path.join(__dirname, '../.env.local');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split(/\r?\n/).forEach(line => {
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
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("🚨 Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be defined in web/.env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const courseData = {
  id: 1300,
  title: "Architecture des Ordinateurs : Le Modèle de von Neumann",
  slug: "architecture_von_neumann",
  level: "L1",
  subject: "Computer_Science",
  description: "Découvrez les fondements de l'architecture moderne des ordinateurs : l'unité centrale de traitement, la mémoire, les bus, et le cycle d'exécution des instructions selon John von Neumann.",
  languages: ["fr"],
  ects: 4,
  is_active: true,
  is_curriculum: false,
  translations: {
    FR: {
      title: "Architecture des Ordinateurs : Le Modèle de von Neumann",
      description: "Découvrez les fondements de l'architecture moderne des ordinateurs : l'unité centrale de traitement, la mémoire, les bus, et le cycle d'exécution des instructions selon John von Neumann."
    }
  }
};

const defaultUser = '26d54efe-6f14-4e36-9fcf-3fcf684a4444'; // Default Vanguard Admin user

async function run() {
  console.log(`🚀 Registering course '${courseData.title}' in Supabase...`);
  const { error: courseErr } = await supabase
    .from('courses')
    .upsert(courseData, { onConflict: 'slug' });

  if (courseErr) {
    console.error(`🚨 Error upserting course '${courseData.slug}':`, courseErr.message);
    process.exit(1);
  }
  console.log("✅ Course registered successfully.");

  console.log(`⏳ Enrolling Default Admin User (${defaultUser}) in the course...`);
  const { data: progress, error: checkErr } = await supabase
    .from('progress')
    .select('*')
    .eq('user_id', defaultUser)
    .eq('course_id', courseData.id)
    .maybeSingle();

  if (checkErr) {
    console.error("🚨 Error checking enrollment:", checkErr.message);
  } else if (!progress) {
    const { error: enrollErr } = await supabase
      .from('progress')
      .insert({
        user_id: defaultUser,
        course_id: courseData.id,
        progress: 0,
        last_visited: new Date().toISOString(),
        lesson_progress: {},
        quiz_results: {}
      });
    if (enrollErr) {
      console.error("🚨 Error enrolling user:", enrollErr.message);
    } else {
      console.log("✅ Default admin user enrolled successfully!");
    }
  } else {
    console.log("✅ Default admin user is already enrolled.");
  }
  console.log("🎉 Course setup completed successfully!");
}

run();
