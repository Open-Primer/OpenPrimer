const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Parse .env.local
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

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing keys in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("🔍 Querying Spanish lesson from database...");
  const { data: lesson, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('course_slug', 'Espagnol_fondamental_syntaxe_et_expression')
    .eq('lesson_slug', 'sons-espagnol-monde-hispanophone')
    .maybeSingle();

  if (error) {
    console.error("🚨 Error querying lesson:", error.message);
    process.exit(1);
  }

  if (!lesson) {
    console.error("🚨 Lesson not found in database!");
    process.exit(1);
  }

  console.log(`✅ Lesson found: "${lesson.title}"`);
  console.log(`Course Slug: ${lesson.course_slug}`);
  console.log(`Lesson Slug: ${lesson.lesson_slug}`);
  console.log(`Language:    ${lesson.lang}`);

  const content = lesson.content || '';
  console.log(`Total Length: ${content.length} characters\n`);

  // Search for pronunciation components
  const keywords = ['PronunciationSandbox', 'SandboxPrononciation', 'Sandbox', 'Prononciation'];
  console.log("Checking for pronunciation component keywords in MDX content:");
  keywords.forEach(kw => {
    const regex = new RegExp(kw, 'gi');
    const matches = content.match(regex);
    console.log(`  - "${kw}": ${matches ? matches.length : 0} occurrences`);
  });

  // Find exact lines where pronunciation tags appear
  const lines = content.split('\n');
  const matchedLines = [];
  lines.forEach((line, index) => {
    if (line.toLowerCase().includes('prononciation') || line.toLowerCase().includes('pronunciation')) {
      matchedLines.push({ lineNum: index + 1, text: line.trim() });
    }
  });

  if (matchedLines.length > 0) {
    console.log(`\nFound ${matchedLines.length} lines mentioning pronunciation/prononciation:`);
    matchedLines.slice(0, 15).forEach(m => {
      console.log(`  Line ${m.lineNum}: ${m.text}`);
    });
  } else {
    console.log("\nNo specific lines mentioning pronunciation/prononciation.");
  }
}

run();
