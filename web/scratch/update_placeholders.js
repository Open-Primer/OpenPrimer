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

async function run() {
  try {
    await client.connect();
    console.log("Connected to DB");

    const res = await client.query(`
      SELECT id, course_slug, lesson_slug, lang, title, content
      FROM public.lessons 
      WHERE content LIKE '%premium fallback%'
    `);

    console.log(`Found ${res.rows.length} placeholder lessons to update.`);

    for (const row of res.rows) {
      const parsed = matter(row.content);
      
      const diagnosticBody = `
# 🔍 Academic Generation Diagnostics

An error occurred while dynamically compiling the lesson content for **${row.title}** under course **${row.course_slug}**.

> [!WARNING]
> The AI Generation pipeline was unable to contact the configured LLM providers or failed to validate the generated output during the initial run. Below is a detailed, actionable diagnostics report to help you resolve this issue.

### 📋 Environment & Configuration Status

| Provider | Status | Configured | Error / Details |
| :--- | :--- | :--- | :--- |
| **Vertex AI** | Failed | \`Unknown\` | Lesson was generated in a previous execution where Vertex AI was not configured or quota limits were exceeded. |
| **Gemini AI Studio** | Failed | \`Unknown\` | Lesson was generated in a previous execution where Gemini AI Studio was not configured or quota limits were exceeded. |

### 🛠️ Actionable Troubleshooting Steps

1. **Verify Environment Variables**:
   Ensure the following are correctly defined in your server's \`.env.local\` or hosting provider dashboard:
   - \`GOOGLE_APPLICATION_CREDENTIALS\` (absolute path to GCP Service Account JSON file)
   - \`VERTEX_PROJECT_ID\` (your GCP project ID)
   - \`VERTEX_LOCATION\` (e.g., \`us-central1\`)
   - \`GEMINI_API_KEY\` (Gemini API Studio key)

2. **Check GCP & Vertex AI Permissions**:
   - Ensure the Vertex AI API is enabled in your Google Cloud Console.
   - Verify the Service Account has the **Vertex AI User** role.

3. **Verify API Quotas & Billing**:
   - Check if you have exceeded Vertex AI or AI Studio rate limits/quotas.
   - Confirm your Google Cloud Billing account is active.

4. **Server Logs**:
   - Inspect the server terminal output or deployment logs for full stack traces associated with this request.
`;

      const updatedContent = matter.stringify(diagnosticBody, parsed.data);

      await client.query(`
        UPDATE public.lessons
        SET content = $1
        WHERE id = $2
      `, [updatedContent, row.id]);

      console.log(`✅ Updated placeholder for "${row.course_slug}/${row.lesson_slug}"`);
    }

  } catch (e) {
    console.error(e);
  } finally {
    await client.end();
  }
}

run();
