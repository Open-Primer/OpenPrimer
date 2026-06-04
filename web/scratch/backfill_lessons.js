const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

function parseEnv() {
  const envPath = path.join(__dirname, '..', '.env.local');
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
const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\.supabase/)[1];
const host = `db.${projectRef}.supabase.co`;
const connectionString = `postgresql://postgres:${encodeURIComponent(dbPassword)}@${host}:5432/postgres`;

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

const introductoryMicroeconomicsOrder = {
  'introduction': 1,
  'fundamental_principles': 2,
  'intro-economic-thinking': 3,
  'supply-demand-mechanics': 4,
  'consumer-behavior-utility': 5,
  'producer-behavior-costs': 6,
  'market-structures-perfect-competition': 7,
  'market-structures-monopoly': 8,
  'market-structures-beyond-perfect-competition': 9,
  'market-failures-government-role': 10,
  'advanced_applications': 11,
  'conclusion': 12
};

const duplicateLessons = [
  'intro-microeconomics-scarcity-choice',
  'supply-demand-market-analysis',
  'consumer-behavior-utility-choice',
  'producer-behavior-production-costs'
];

const revolutionOrder = {
  'introduction': 1,
  'causes_structurelles': 2,
  'dynamique_revolutionnaire': 3,
  'consequences_heritage': 4
};

async function run() {
  try {
    await client.connect();
    console.log("Connected to DB");

    // 1. Delete duplicates
    console.log("Deleting duplicate lessons...");
    const deleteRes = await client.query(`
      DELETE FROM public.lessons 
      WHERE course_slug = 'introductory_microeconomics' AND lesson_slug = ANY($1)
    `, [duplicateLessons]);
    console.log(`Deleted ${deleteRes.rowCount} duplicate lessons.`);

    // 2. Fetch remaining lessons
    const res = await client.query(`
      SELECT id, course_slug, lesson_slug, lang, title, content
      FROM public.lessons
    `);

    console.log(`Updating frontmatter and order for remaining ${res.rows.length} lessons...`);

    for (const row of res.rows) {
      let order = null;
      if (row.course_slug === 'introductory_microeconomics') {
        order = introductoryMicroeconomicsOrder[row.lesson_slug];
      } else if (row.course_slug === 'revolution') {
        order = revolutionOrder[row.lesson_slug];
      }

      if (order === undefined || order === null) {
        console.warn(`⚠️ No order defined for lesson_slug "${row.lesson_slug}" in course "${row.course_slug}". Skipping...`);
        continue;
      }

      // Parse MDX frontmatter
      try {
        const parsed = matter(row.content);
        parsed.data.order = order;
        
        // Rebuild content string with updated frontmatter
        const updatedContent = matter.stringify(parsed.content, parsed.data);

        // Update database row
        await client.query(`
          UPDATE public.lessons
          SET "order" = $1, content = $2
          WHERE id = $3
        `, [order, updatedContent, row.id]);

        console.log(`✅ Updated "${row.course_slug}/${row.lesson_slug}" to order: ${order}`);
      } catch (err) {
        console.error(`❌ Failed to update frontmatter for lesson id ${row.id}:`, err.message);
      }
    }

    console.log("\nChecking final state of lessons...");
    const checkRes = await client.query(`
      SELECT id, course_slug, lesson_slug, lang, title, "order"
      FROM public.lessons 
      ORDER BY course_slug, "order", lesson_slug, lang
    `);
    console.table(checkRes.rows);

  } catch (e) {
    console.error("Migration error:", e);
  } finally {
    await client.end();
  }
}

run();
