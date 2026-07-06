const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w_]+)\s*=\s*(.*)\s*$/);
  if (match) {
    let val = match[2].trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
    env[match[1]] = val;
  }
});

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseKey = env['SUPABASE_SERVICE_ROLE_KEY'];

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing keys in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const courseIds = [267, 268];
  const courseSlugs = [
    "Acoustique_sous-marine_et_oceanographie_physique",
    "Introduction_a_l_Opera_Classique_Art_Acoustique_et_Dramaturgie"
  ];

  console.log(`Checking references in other tables for courses ${courseIds} / slugs ${courseSlugs}...`);

  // 1. progress table
  const { data: progressData, error: progressErr } = await supabase
    .from('progress')
    .select('*')
    .in('course_id', courseIds);
  if (progressErr) {
    console.error("Error checking progress:", progressErr);
  } else {
    console.log(`Progress rows found: ${progressData.length}`);
    progressData.forEach(p => console.log(p));
  }

  // 2. course_feedbacks table
  // Note: course_feedbacks table might have course_id as VARCHAR(255) referencing course slug or id
  const { data: feedbackData1, error: feedbackErr1 } = await supabase
    .from('course_feedbacks')
    .select('*')
    .in('course_id', courseIds.map(String));
  const { data: feedbackData2, error: feedbackErr2 } = await supabase
    .from('course_feedbacks')
    .select('*')
    .in('course_id', courseSlugs);
  
  if (feedbackErr1 || feedbackErr2) {
    console.error("Error checking course_feedbacks:", feedbackErr1 || feedbackErr2);
  } else {
    const combined = [...(feedbackData1 || []), ...(feedbackData2 || [])];
    console.log(`Course feedbacks found: ${combined.length}`);
    combined.forEach(f => console.log(f));
  }

  // 3. report_clusters table
  const { data: reportData, error: reportErr } = await supabase
    .from('report_clusters')
    .select('*')
    .in('course', courseSlugs);
  if (reportErr) {
    console.error("Error checking report_clusters:", reportErr);
  } else {
    console.log(`Report clusters found: ${reportData.length}`);
    reportData.forEach(r => console.log(r));
  }
}

main();
