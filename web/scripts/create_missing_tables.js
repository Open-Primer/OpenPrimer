/**
 * OpenPrimer Setup Script - Create and Seed Missing Tables
 * 
 * Purpose:
 * Creates the missing 'site_stats' and 'agent_metrics' tables in Supabase,
 * seeds them with default values, and grants necessary anon permissions to 
 * resolve the PGRST205 (table not found) database offline loop error.
 */

const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

// 1. Read configuration from .env.local
const envPath = path.join(__dirname, '../.env.local');
if (!fs.existsSync(envPath)) {
  console.error("Error: .env.local file not found at: " + envPath);
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w_]+)\s*=\s*(.+?)\s*$/);
  if (match) {
    env[match[1]] = match[2].trim();
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const dbPassword = env.SUPABASE_DB_PASSWORD;

if (!supabaseUrl || !dbPassword) {
  console.error("Error: Missing Supabase configurations in .env.local");
  process.exit(1);
}

const hostMatch = supabaseUrl.match(/https:\/\/([^.]+)\.supabase/);
if (!hostMatch) {
  console.error("Error: Invalid Supabase URL format:", supabaseUrl);
  process.exit(1);
}
const dbHost = `db.${hostMatch[1]}.supabase.co`;

const pgClient = new Client({
  host: dbHost,
  port: 5432,
  user: 'postgres',
  password: dbPassword,
  database: 'postgres',
  ssl: { rejectUnauthorized: false }
});

async function run() {
  console.log("Connecting to Supabase Database on host:", dbHost);
  await pgClient.connect();
  console.log("Connected successfully!");

  try {
    // 1. Create site_stats table
    console.log("Creating 'site_stats' table...");
    await pgClient.query(`
      CREATE TABLE IF NOT EXISTS public.site_stats (
        id SERIAL PRIMARY KEY,
        total_students INTEGER DEFAULT 0,
        validation_rate NUMERIC(5, 2) DEFAULT 0.00,
        total_course_visits INTEGER DEFAULT 0,
        platform_rating VARCHAR(50) DEFAULT '0.0/5'
      );
    `);

    // Seed initial site_stats row if empty
    const { rows: statsRows } = await pgClient.query("SELECT COUNT(*) FROM public.site_stats");
    if (parseInt(statsRows[0].count) === 0) {
      console.log("Seeding 'site_stats' default entry...");
      await pgClient.query(`
        INSERT INTO public.site_stats (id, total_students, validation_rate, total_course_visits, platform_rating)
        VALUES (1, 10, 80.00, 150, '4.8/5')
        ON CONFLICT (id) DO NOTHING;
      `);
    }

    // 2. Create agent_metrics table
    console.log("Creating 'agent_metrics' table...");
    await pgClient.query(`
      CREATE TABLE IF NOT EXISTS public.agent_metrics (
        id VARCHAR(100) PRIMARY KEY,
        name_en VARCHAR(255) NOT NULL,
        name_fr VARCHAR(255) NOT NULL,
        name_es VARCHAR(255) DEFAULT '',
        name_de VARCHAR(255) DEFAULT '',
        name_zh VARCHAR(255) DEFAULT '',
        total_cost NUMERIC(10, 2) DEFAULT 0.00,
        rolling_30_days_cost NUMERIC(10, 2) DEFAULT 0.00,
        requests INTEGER DEFAULT 0,
        avg_response_time VARCHAR(50) DEFAULT '0ms'
      );
    `);

    // Seed initial agent_metrics if empty
    const { rows: metricsRows } = await pgClient.query("SELECT COUNT(*) FROM public.agent_metrics");
    if (parseInt(metricsRows[0].count) === 0) {
      console.log("Seeding 'agent_metrics' default entries...");
      await pgClient.query(`
        INSERT INTO public.agent_metrics (id, name_en, name_fr, name_es, name_de, name_zh, total_cost, rolling_30_days_cost, requests, avg_response_time)
        VALUES 
          ('generation', 'Course Generation Agent', 'Agent de Génération de Cursus', 'Agente de Generación de Cursos', 'Kursgenerierungs-Agent', '课程生成智能体', 245.80, 48.50, 820, '1420ms'),
          ('translation', 'Translation Agent', 'Agent de Traduction Multi-Langues', 'Agente de Traducción Multilingüe', 'Übersetzungs-Agent', '翻译智能体', 188.40, 32.10, 1240, '890ms'),
          ('revision', 'Pedagogical Revision Agent', 'Agent de Révision Pédagogique', 'Agente de Revisión Pédagógica', 'Pädagogischer Revisions-Agent', '教学修订智能体', 98.20, 15.60, 450, '1120ms'),
          ('tutor', 'AI Tutor Agent & Personalities', 'Agent de Tutorat IA & Personnalités', 'Agente de Tutoría IA y Personalidades', 'KI-Tutor-Agent & Persönlichkeiten', 'AI 智能体与个性化角色', 312.50, 64.20, 3420, '580ms')
        ON CONFLICT (id) DO NOTHING;
      `);
    }

    // 3. Grant Row Level Security Policies
    console.log("Configuring security policies...");
    
    // site_stats policies
    await pgClient.query("ALTER TABLE public.site_stats ENABLE ROW LEVEL SECURITY;");
    await pgClient.query("DROP POLICY IF EXISTS \"Allow public read access to site_stats\" ON public.site_stats;");
    await pgClient.query("CREATE POLICY \"Allow public read access to site_stats\" ON public.site_stats FOR SELECT USING (true);");
    await pgClient.query("DROP POLICY IF EXISTS \"Allow all access to site_stats\" ON public.site_stats;");
    await pgClient.query("CREATE POLICY \"Allow all access to site_stats\" ON public.site_stats FOR ALL USING (true) WITH CHECK (true);");

    // agent_metrics policies
    await pgClient.query("ALTER TABLE public.agent_metrics ENABLE ROW LEVEL SECURITY;");
    await pgClient.query("DROP POLICY IF EXISTS \"Allow public read access to agent_metrics\" ON public.agent_metrics;");
    await pgClient.query("CREATE POLICY \"Allow public read access to agent_metrics\" ON public.agent_metrics FOR SELECT USING (true);");
    await pgClient.query("DROP POLICY IF EXISTS \"Allow all access to agent_metrics\" ON public.agent_metrics;");
    await pgClient.query("CREATE POLICY \"Allow all access to agent_metrics\" ON public.agent_metrics FOR ALL USING (true) WITH CHECK (true);");

    // 4. Grant privileges to roles
    console.log("Granting privileges to public, anon, and authenticated roles...");
    await pgClient.query("GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_stats TO public, anon, authenticated;");
    await pgClient.query("GRANT SELECT, INSERT, UPDATE, DELETE ON public.agent_metrics TO public, anon, authenticated;");
    await pgClient.query("GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA public TO public, anon, authenticated;");

    console.log("Database schema configuration successful! All missing tables are created and seeded.");
  } catch (err) {
    console.error("SQL Execution Error:", err);
  } finally {
    await pgClient.end();
    console.log("Connection closed.");
  }
}

run();
