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
    console.log("Connected to DB");

    const lessons = [
      'supply-demand-mechanics',
      'producer-behavior-costs'
    ];

    for (const slug of lessons) {
      const filePath = path.join(__dirname, `${slug}.mdx`);
      if (fs.existsSync(filePath)) {
        const updatedContent = fs.readFileSync(filePath, 'utf8');

        await client.query(`
          UPDATE public.lessons
          SET content = $1
          WHERE course_slug = 'introductory_microeconomics' AND lesson_slug = $2
        `, [updatedContent, slug]);

        console.log(`✅ Successfully updated database row for "${slug}"`);
      }
    }

  } catch (e) {
    console.error(e);
  } finally {
    await client.end();
  }
}

run();
