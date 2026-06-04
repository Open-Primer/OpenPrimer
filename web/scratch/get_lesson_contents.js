const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

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

async function run() {
  try {
    await client.connect();
    
    const lessons = [
      'supply-demand-mechanics',
      'producer-behavior-costs',
      'market-structures-beyond-perfect-competition'
    ];

    for (const slug of lessons) {
      const res = await client.query(`
        SELECT content FROM public.lessons 
        WHERE course_slug = 'introductory_microeconomics' AND lesson_slug = $1
      `, [slug]);

      if (res.rows[0]) {
        const filePath = path.join(__dirname, `${slug}.mdx`);
        fs.writeFileSync(filePath, res.rows[0].content, 'utf8');
        console.log(`Saved ${slug}.mdx to ${filePath}`);
      } else {
        console.warn(`Lesson ${slug} not found in DB`);
      }
    }

  } catch (e) {
    console.error(e);
  } finally {
    await client.end();
  }
}

run();
