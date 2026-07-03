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
  console.error("🚨 Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY must be defined in web/.env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const testCourse = {
  id: 9999, // Reserved high ID for tests/sandbox
  title: "Sandbox de Test des Composants",
  slug: "test_widgets",
  level: "L1",
  subject: "Computer_Science",
  description: "Un espace d'expérimentation isolé contenant toutes les simulations, tous les widgets interactifs, les quiz et blocs sémantiques de la plateforme OpenPrimer.",
  languages: ["fr"],
  ects: 0,
  is_active: true,
  is_curriculum: false,
  translations: {
    FR: {
      title: "Sandbox de Test des Composants",
      description: "Un espace d'expérimentation isolé contenant toutes les simulations, tous les widgets interactifs, les quiz et blocs sémantiques de la plateforme OpenPrimer."
    }
  }
};

const defaultUser = '26d54efe-6f14-4e36-9fcf-3fcf684a4444'; // Default Vanguard Admin user

async function run() {
  console.log("🚀 Registering Sandbox Test Course 'test_widgets' in Supabase...");
  const { error: courseErr } = await supabase
    .from('courses')
    .upsert(testCourse, { onConflict: 'slug' });

  if (courseErr) {
    console.error("🚨 Error upserting course 'test_widgets':", courseErr.message);
    process.exit(1);
  }
  console.log("✅ Course 'test_widgets' registered successfully.");

  console.log(`⏳ Enrolling Default Admin User (${defaultUser}) in Sandbox Course...`);
  const { data: progress, error: checkErr } = await supabase
    .from('progress')
    .select('*')
    .eq('user_id', defaultUser)
    .eq('course_id', testCourse.id)
    .maybeSingle();

  if (checkErr) {
    console.error("🚨 Error checking enrollment:", checkErr.message);
  } else if (!progress) {
    const { error: enrollErr } = await supabase
      .from('progress')
      .insert({
        user_id: defaultUser,
        course_id: testCourse.id,
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
  console.log("🎉 Test course setup completed successfully!");
}

run();
