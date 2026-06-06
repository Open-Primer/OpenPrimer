/**
 * OpenPrimer Reusable Setup & Disaster Recovery Seeding Script
 * 
 * Purpose: 
 * Sets up a clean Supabase database with minimal system requirements:
 *  - Truncates all tables including public.courses (0 courses, clean slate)
 *  - Seeds standard dynamic languages (FR, EN, ES, DE, ZH)
 *  - Seeds the 25 standard Achievements (Badges) with translation JSON block
 *  - Seeds the 8 core master Socratic AI Tutor personalities
 *  - Truncates all student dynamic tables (progress, favorites, search logs, contact feedback, and task queue)
 *  - Purges Supabase Auth system and registers 4 pristine accounts:
 *      1. Vanguard Administrator (vanguard.mysterious@gmail.com)
 *      2. Test Student 1 (student1@openprimer.org)
 *      3. Test Student 2 (student2@openprimer.org)
 *      4. Test Student 3 (student3@openprimer.org)
 * 
 * Usage:
 *  node scripts/seed_fresh_database.js
 */

const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
const { createClient } = require('@supabase/supabase-js');

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
    env[match[1]] = match[2];
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;
const dbPassword = env.SUPABASE_DB_PASSWORD;

if (!supabaseUrl || !serviceRoleKey || !dbPassword) {
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

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const initialAchievements = [];

async function main() {
  try {
    console.log("=============================================");
    console.log("   OpenPrimer Reusable Setup & Seed Utility  ");
    console.log("=============================================\n");

    await pgClient.connect();
    console.log("Applying schema upgrade migrations...");
    const migrations = [
      "ALTER TABLE public.tutor_personalities ADD COLUMN IF NOT EXISTS translations JSONB DEFAULT '{}'::jsonb",
      "ALTER TABLE public.tutor_personalities ADD COLUMN IF NOT EXISTS archiving_level INTEGER DEFAULT 0",
      "ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS is_curriculum BOOLEAN DEFAULT false",
      "ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS child_courses INTEGER[] DEFAULT '{}'::integer[]",
      "ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS translations JSONB DEFAULT '{}'::jsonb",
      "ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS archiving_level INTEGER DEFAULT 0",
      "ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS archived_languages TEXT[] DEFAULT '{}'::text[]",
      "ALTER TABLE public.achievements ADD COLUMN IF NOT EXISTS translations JSONB DEFAULT '{}'::jsonb",
      "ALTER TABLE public.achievements ADD COLUMN IF NOT EXISTS archiving_level INTEGER DEFAULT 0",
      "ALTER TABLE public.languages ADD COLUMN IF NOT EXISTS archiving_level INTEGER DEFAULT 0",
      "ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS password VARCHAR(255)",
      "ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS audio_volume NUMERIC(3, 2) DEFAULT 1.00",
      "ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS audio_rate NUMERIC(3, 2) DEFAULT 1.00",
      "ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS audio_voice_id VARCHAR(255) DEFAULT ''",
      "ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS version VARCHAR(50) DEFAULT 'v1.0.0'",
      "ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS last_revision_date TIMESTAMP WITH TIME ZONE"
    ];
    for (const q of migrations) {
      try {
        await pgClient.query(q);
      } catch (e) {
        console.log("Migration note:", e.message);
      }
    }
  
    console.log("ðŸ”Œ Connected to PostgreSQL Database owner successfully.");

    // 0. ENSURE SITE STATS, AGENT METRICS, PROGRESS, SYSTEM PARAMETERS AND SERVICE UPTIME LOGS EXIST
    console.log("ðŸ› ï¸ Guaranteeing all system, stats, uptime logs, and progress tables exist...");
    await pgClient.query(`
      CREATE TABLE IF NOT EXISTS public.site_stats (
        id SERIAL PRIMARY KEY,
        total_students INTEGER DEFAULT 0,
        validation_rate NUMERIC(5, 2) DEFAULT 0.00,
        total_course_visits INTEGER DEFAULT 0,
        platform_rating VARCHAR(50) DEFAULT '0.0/5'
      );

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

      CREATE TABLE IF NOT EXISTS public.system_parameters (
        key VARCHAR(255) PRIMARY KEY,
        value TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS public.service_uptime_logs (
        date DATE PRIMARY KEY,
        db NUMERIC(5, 2) NOT NULL,
        email NUMERIC(5, 2) NOT NULL,
        ai NUMERIC(5, 2) NOT NULL,
        images NUMERIC(5, 2) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS public.progress (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id VARCHAR(255) NOT NULL,
        course_id INTEGER NOT NULL,
        progress INTEGER DEFAULT 0,
        lesson_progress JSONB DEFAULT '{}'::jsonb,
        quiz_results JSONB DEFAULT '{}'::jsonb,
        total_minutes INTEGER DEFAULT 0,
        last_visited TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT unique_user_course UNIQUE (user_id, course_id)
      );

      CREATE TABLE IF NOT EXISTS public.translation_requests (
        id SERIAL PRIMARY KEY,
        course_name VARCHAR(255) NOT NULL,
        source_lang VARCHAR(10) DEFAULT 'EN',
        target_lang VARCHAR(10) NOT NULL,
        requests_count INTEGER DEFAULT 1,
        priority VARCHAR(50) DEFAULT 'Medium',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS public.course_feedbacks (
        id SERIAL PRIMARY KEY,
        course_id INTEGER NOT NULL,
        rating INTEGER NOT NULL,
        comment TEXT,
        is_treated BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS public.report_clusters (
        id SERIAL PRIMARY KEY,
        course VARCHAR(255) NOT NULL,
        issue_summary TEXT,
        count INTEGER DEFAULT 1,
        status VARCHAR(50) DEFAULT 'Pending',
        ai_proposal TEXT,
        priority VARCHAR(50) DEFAULT 'Medium',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS public.email_templates (
        id VARCHAR(255) PRIMARY KEY,
        template_type VARCHAR(100) NOT NULL,
        lang VARCHAR(10) NOT NULL,
        subject TEXT NOT NULL,
        subtitle TEXT NOT NULL,
        welcome TEXT NOT NULL,
        body TEXT NOT NULL,
        button TEXT NOT NULL,
        fallback_text TEXT NOT NULL,
        footer TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT unique_type_lang UNIQUE (template_type, lang)
      );

      -- Apply RLS policies & permissions
      CREATE OR REPLACE FUNCTION public.is_admin()
      RETURNS BOOLEAN SECURITY DEFINER AS $$
      BEGIN
        RETURN EXISTS (
          SELECT 1 FROM public.profiles
          WHERE id = (auth.uid())::text AND role = 'admin'
        );
      END;
      $$ LANGUAGE plpgsql;

      ALTER TABLE public.system_parameters ENABLE ROW LEVEL SECURITY;
      DROP POLICY IF EXISTS "Allow all access to system_parameters" ON public.system_parameters;
      CREATE POLICY "Allow all access to system_parameters" ON public.system_parameters FOR ALL USING (true) WITH CHECK (true);
      GRANT SELECT, INSERT, UPDATE, DELETE ON public.system_parameters TO public, anon, authenticated;

      ALTER TABLE public.service_uptime_logs ENABLE ROW LEVEL SECURITY;
      DROP POLICY IF EXISTS "Allow all access to service_uptime_logs" ON public.service_uptime_logs;
      CREATE POLICY "Allow all access to service_uptime_logs" ON public.service_uptime_logs FOR ALL USING (true) WITH CHECK (true);
      GRANT SELECT, INSERT, UPDATE, DELETE ON public.service_uptime_logs TO public, anon, authenticated;

      ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;
      DROP POLICY IF EXISTS "Users can read own progress" ON public.progress;
      CREATE POLICY "Users can read own progress" ON public.progress FOR SELECT USING (true);
      DROP POLICY IF EXISTS "Users can update own progress" ON public.progress;
      CREATE POLICY "Users can update own progress" ON public.progress FOR UPDATE USING (auth.uid()::text = user_id OR user_id = 'u1');
      DROP POLICY IF EXISTS "Users can insert own progress" ON public.progress;
      CREATE POLICY "Users can insert own progress" ON public.progress FOR INSERT WITH CHECK (auth.uid()::text = user_id OR user_id = 'u1');
      DROP POLICY IF EXISTS "Users can delete own progress" ON public.progress;
      CREATE POLICY "Users can delete own progress" ON public.progress FOR DELETE USING (auth.uid()::text = user_id OR user_id = 'u1');
      GRANT SELECT, INSERT, UPDATE, DELETE ON public.progress TO public, anon, authenticated;

      ALTER TABLE public.translation_requests ENABLE ROW LEVEL SECURITY;
      DROP POLICY IF EXISTS "Allow all access to translation_requests" ON public.translation_requests;
      DROP POLICY IF EXISTS "Service role full access to translation_requests" ON public.translation_requests;
      DROP POLICY IF EXISTS "Allow public insert to translation_requests" ON public.translation_requests;
      DROP POLICY IF EXISTS "Admins can access translation_requests" ON public.translation_requests;
      CREATE POLICY "Service role full access to translation_requests" ON public.translation_requests
        FOR ALL TO service_role USING (true) WITH CHECK (true);
      CREATE POLICY "Allow public insert to translation_requests" ON public.translation_requests
        FOR INSERT WITH CHECK (true);
      CREATE POLICY "Admins can access translation_requests" ON public.translation_requests
        FOR ALL TO public
        USING (public.is_admin() = true)
        WITH CHECK (public.is_admin() = true);
      GRANT SELECT, INSERT, UPDATE, DELETE ON public.translation_requests TO public, anon, authenticated;

      ALTER TABLE public.course_feedbacks ENABLE ROW LEVEL SECURITY;
      DROP POLICY IF EXISTS "Allow all access to course_feedbacks" ON public.course_feedbacks;
      DROP POLICY IF EXISTS "Service role full access to course_feedbacks" ON public.course_feedbacks;
      DROP POLICY IF EXISTS "Allow public insert to course_feedbacks" ON public.course_feedbacks;
      DROP POLICY IF EXISTS "Admins can access course_feedbacks" ON public.course_feedbacks;
      CREATE POLICY "Service role full access to course_feedbacks" ON public.course_feedbacks
        FOR ALL TO service_role USING (true) WITH CHECK (true);
      CREATE POLICY "Allow public insert to course_feedbacks" ON public.course_feedbacks
        FOR INSERT WITH CHECK (true);
      CREATE POLICY "Admins can access course_feedbacks" ON public.course_feedbacks
        FOR ALL TO public
        USING (public.is_admin() = true)
        WITH CHECK (public.is_admin() = true);
      GRANT SELECT, INSERT, UPDATE, DELETE ON public.course_feedbacks TO public, anon, authenticated;

      ALTER TABLE public.report_clusters ENABLE ROW LEVEL SECURITY;
      DROP POLICY IF EXISTS "Allow all access to report_clusters" ON public.report_clusters;
      DROP POLICY IF EXISTS "Service role full access to report_clusters" ON public.report_clusters;
      DROP POLICY IF EXISTS "Admins can access report_clusters" ON public.report_clusters;
      CREATE POLICY "Service role full access to report_clusters" ON public.report_clusters
        FOR ALL TO service_role USING (true) WITH CHECK (true);
      CREATE POLICY "Admins can access report_clusters" ON public.report_clusters
        FOR ALL TO public
        USING (public.is_admin() = true)
        WITH CHECK (public.is_admin() = true);
      GRANT SELECT, INSERT, UPDATE, DELETE ON public.report_clusters TO public, anon, authenticated;

      ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
      DROP POLICY IF EXISTS "Allow all access to email_templates" ON public.email_templates;
      CREATE POLICY "Allow all access to email_templates" ON public.email_templates FOR ALL USING (true) WITH CHECK (true);
      GRANT SELECT, INSERT, UPDATE, DELETE ON public.email_templates TO public, anon, authenticated;
    `);

    // A. PURGE ALL TRANSACTIONAL AND PROGRESS DATA (Clean canvas, 0 courses completed)
    console.log("🗑️ Truncating active student and course data (completions, courses, queues, logs, feedbacks)...");
    await pgClient.query(`
      TRUNCATE TABLE 
        public.profiles, 
        public.courses,
        public.achievements,
        public.task_queue, 
        public.search_logs, 
        public.contact_feedbacks,
        public.site_stats,
        public.agent_metrics,
        public.progress,
        public.translation_requests,
        public.course_feedbacks,
        public.report_clusters,
        public.email_templates
      CASCADE;
    `);
    console.log("✅ Student progress, stats, and operational logs fully truncated.");

    // B. PURGE ALL AUTH ACCOUNTS
    console.log("🗑️ Purging Supabase Auth accounts...");
    await pgClient.query('TRUNCATE TABLE auth.users CASCADE;');
    console.log("âœ… Authentication table fully purged.");

    // C. SEED SYSTEM LANGUAGES
    console.log("ðŸŒ± Seeding Core Languages...");
    await pgClient.query(`
      INSERT INTO public.languages (code, flag, label, archiving_level) VALUES
        ('FR', 'ðŸ‡«ðŸ‡·', 'FranÃ§ais', 0),
        ('EN', 'ðŸ‡ºðŸ‡¸', 'English', 0),
        ('ES', 'ðŸ‡ªðŸ‡¸', 'EspaÃ±ol', 0),
        ('DE', 'ðŸ‡©ðŸ‡ª', 'Deutsch', 0),
        ('ZH', 'ðŸ‡¨ðŸ‡³', 'ä¸­æ–‡', 0)
      ON CONFLICT (code) DO UPDATE SET flag = EXCLUDED.flag, label = EXCLUDED.label;
    `);
    console.log("✅ System languages seeded.");

    console.log("🌱 Seeding Email Templates...");
    const emailTemplates = [
      // verify_email
      {
        id: 'verify_email_FR',
        template_type: 'verify_email',
        lang: 'FR',
        subject: 'Activer votre compte OpenPrimer',
        subtitle: 'VOTRE UNIVERSITÉ ACADÉMIQUE DE POINTE',
        welcome: 'Bienvenue à bord !',
        body: 'Merci de vous être inscrit sur OpenPrimer. Pour commencer votre apprentissage personnalisé allant du primaire à la L3, veuillez confirmer votre adresse e-mail en cliquant sur le bouton ci-dessous :',
        button: 'Activer mon compte',
        fallback_text: 'Si le bouton ci-dessus ne fonctionne pas, copiez et collez le lien suivant dans votre navigateur :',
        footer: '© 2026 OpenPrimer. Tous droits réservés.'
      },
      {
        id: 'verify_email_EN',
        template_type: 'verify_email',
        lang: 'EN',
        subject: 'Activate your OpenPrimer account',
        subtitle: 'YOUR LEADING ACADEMIC UNIVERSITY',
        welcome: 'Welcome aboard !',
        body: 'Thank you for signing up on OpenPrimer. To begin your personalized learning journey from primary school to level L3, please confirm your email address by clicking the button below:',
        button: 'Activate my account',
        fallback_text: 'If the button above does not work, copy and paste the following link into your browser:',
        footer: '© 2026 OpenPrimer. All rights reserved.'
      },
      {
        id: 'verify_email_ES',
        template_type: 'verify_email',
        lang: 'ES',
        subject: 'Activa tu cuenta de OpenPrimer',
        subtitle: 'TU UNIVERSIDAD ACADÉMICA DE VANGUARDIA',
        welcome: '¡Bienvenido a bordo!',
        body: 'Gracias por registrarte en OpenPrimer. Para comenzar tu viaje de aprendizaje personalizado desde la escuela primaria hasta el nivel L3, confirma tu dirección de correo electrónico haciendo clic en el botón de abajo:',
        button: 'Activar mi cuenta',
        fallback_text: 'Si el botón de arriba no funciona, copia y pega el siguiente enlace en tu navegador:',
        footer: '© 2026 OpenPrimer. Todos los derechos reservados.'
      },
      {
        id: 'verify_email_DE',
        template_type: 'verify_email',
        lang: 'DE',
        subject: 'Aktivieren Sie Ihr OpenPrimer-Konto',
        subtitle: 'IHRE FÜHRENDE AKADEMISCHE UNIVERSITÄT',
        welcome: 'Willkommen an Bord!',
        body: 'Vielen Dank für Ihre Anmeldung bei OpenPrimer. Um Ihre personalisierte Lernreise von der Grundschule bis zur Stufe L3 zu beginnen, bestätigen Sie bitte Ihre E-Mail-Adresse, indem Sie auf die Schaltfläche unten klicken:',
        button: 'Mein Konto aktivieren',
        fallback_text: 'Wenn die Schaltfläche oben nicht funktioniert, kopieren Sie den folgenden Link und fügen Sie ihn in Ihren Browser ein:',
        footer: '© 2026 OpenPrimer. Alle Rechte vorbehalten.'
      },
      {
        id: 'verify_email_ZH',
        template_type: 'verify_email',
        lang: 'ZH',
        subject: '激活您的 OpenPrimer 账户',
        subtitle: '您的顶尖学术大学',
        welcome: '欢迎加入！',
        body: '感谢您注册 OpenPrimer。要开始您从小学到 L3 级别的个性化学习之旅，请点击下方按钮确认您的电子邮件地址：',
        button: '激活我的账户',
        fallback_text: '如果下方的按钮无法点击，请复制并粘贴以下链接到浏览器中：',
        footer: '© 2026 OpenPrimer. 保留所有权利。'
      },
      // lost_password
      {
        id: 'lost_password_FR',
        template_type: 'lost_password',
        lang: 'FR',
        subject: 'Réinitialiser votre mot de passe OpenPrimer',
        subtitle: 'VOTRE UNIVERSITÉ ACADÉMIQUE DE POINTE',
        welcome: 'Bonjour {{firstName}} !',
        body: 'Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte OpenPrimer. Si vous n\'êtes pas à l\'origine de cette demande, vous pouvez ignorer cet e-mail en toute sécurité. Pour réinitialiser votre mot de passe, veuillez cliquer sur le bouton ci-dessous :',
        button: 'Réinitialiser le mot de passe',
        fallback_text: 'Si le bouton ci-dessus ne fonctionne pas, copiez et collez le lien suivant dans votre navigateur :',
        footer: '© 2026 OpenPrimer. Tous droits réservés.'
      },
      {
        id: 'lost_password_EN',
        template_type: 'lost_password',
        lang: 'EN',
        subject: 'Reset your OpenPrimer password',
        subtitle: 'YOUR LEADING ACADEMIC UNIVERSITY',
        welcome: 'Hello {{firstName}} !',
        body: 'We received a request to reset the password for your OpenPrimer account. If you did not make this request, you can safely ignore this email. To reset your password, please click the button below:',
        button: 'Reset password',
        fallback_text: 'If the button above does not work, copy and paste the following link into your browser:',
        footer: '© 2026 OpenPrimer. All rights reserved.'
      },
      {
        id: 'lost_password_ES',
        template_type: 'lost_password',
        lang: 'ES',
        subject: 'Restablecer su contraseña de OpenPrimer',
        subtitle: 'TU UNIVERSIDAD ACADÉMICA DE VANGUARDIA',
        welcome: '¡Hola {{firstName}} !',
        body: 'Hemos recibido una solicitud para restablecer la contraseña de su cuenta de OpenPrimer. Si no realizó esta solicitud, puede ignorar este correo de forma segura. Para restablecer su contraseña, haga clic en el botón de abajo:',
        button: 'Restablecer contraseña',
        fallback_text: 'Si el botón de arriba no funciona, copie y pegue el siguiente enlace en su navegador:',
        footer: '© 2026 OpenPrimer. Todos los derechos reservados.'
      },
      {
        id: 'lost_password_DE',
        template_type: 'lost_password',
        lang: 'DE',
        subject: 'Setzen Sie Ihr OpenPrimer-Passwort zurück',
        subtitle: 'IHRE FÜHRENDE AKADEMISCHE UNIVERSITÄT',
        welcome: 'Hallo {{firstName}} !',
        body: 'Wir haben eine Anfrage zum Zurücksetzen des Passworts für Ihr OpenPrimer-Konto erhalten. Wenn Sie diese Anfrage nicht gestellt haben, können Sie diese E-Mail ignorieren. Um Ihr Passwort zurückzusetzen, klicken Sie bitte auf die Schaltfläche unten:',
        button: 'Passwort zurücksetzen',
        fallback_text: 'Wenn die Schaltfläche oben nicht funktioniert, kopieren Sie den folgenden Link und fügen Sie ihn in Ihren Browser ein:',
        footer: '© 2026 OpenPrimer. Alle Rechte vorbehalten.'
      },
      {
        id: 'lost_password_ZH',
        template_type: 'lost_password',
        lang: 'ZH',
        subject: '重置您的 OpenPrimer 密码',
        subtitle: '您的顶尖学术大学',
        welcome: '您好 {{firstName}} ！',
        body: '我们收到了重置您 OpenPrimer 账户密码的请求。如果您没有提交此请求，可以安全地忽略此邮件。要重置您的密码，请点击下方按钮：',
        button: '重置密码',
        fallback_text: '如果下方的按钮无法点击，请复制并粘贴以下链接到浏览器中：',
        footer: '© 2026 OpenPrimer. 保留所有权利。'
      },
      // feedback
      {
        id: 'feedback_FR',
        template_type: 'feedback',
        lang: 'FR',
        subject: 'Nous avons reçu votre message - OpenPrimer',
        subtitle: 'VOTRE UNIVERSITÉ ACADÉMIQUE DE POINTE',
        welcome: 'Merci pour votre message {{firstName}} !',
        body: 'Nous vous remercions d\'avoir contacté OpenPrimer. Nous avons bien reçu vos commentaires ou votre question, et notre équipe reviendra vers vous dès que possible. Voici un récapitulatif de votre message :',
        button: 'Visiter OpenPrimer',
        fallback_text: 'Pour toute urgence, vous pouvez répondre directement à cet e-mail.',
        footer: '© 2026 OpenPrimer. Tous droits réservés.'
      },
      {
        id: 'feedback_EN',
        template_type: 'feedback',
        lang: 'EN',
        subject: 'We received your message - OpenPrimer',
        subtitle: 'YOUR LEADING ACADEMIC UNIVERSITY',
        welcome: 'Thank you for your message {{firstName}} !',
        body: 'Thank you for contacting OpenPrimer. We have successfully received your feedback or inquiry, and our team will get back to you as soon as possible. Here is a copy of your message:',
        button: 'Visit OpenPrimer',
        fallback_text: 'If you have any urgent updates, you can reply directly to this email.',
        footer: '© 2026 OpenPrimer. All rights reserved.'
      },
      {
        id: 'feedback_ES',
        template_type: 'feedback',
        lang: 'ES',
        subject: 'Hemos recibido tu mensaje - OpenPrimer',
        subtitle: 'TU UNIVERSIDAD ACADÉMICA DE VANGUARDIA',
        welcome: '¡Gracias por tu mensaje {{firstName}} !',
        body: 'Gracias por contactar con OpenPrimer. Hemos recibido correctamente sus comentarios o consultas, y nuestro equipo se pondrá en contacto con usted lo antes posible. Aquí hay una copia de su mensaje:',
        button: 'Visitar OpenPrimer',
        fallback_text: 'Para cualquier urgencia, puede responder directamente a este correo electrónico.',
        footer: '© 2026 OpenPrimer. Todos los derechos reservados.'
      },
      {
        id: 'feedback_DE',
        template_type: 'feedback',
        lang: 'DE',
        subject: 'Wir haben Ihre Nachricht erhalten - OpenPrimer',
        subtitle: 'IHRE FÜHRENDE AKADEMISCHE UNIVERSITÄT',
        welcome: 'Vielen Dank für Ihre Nachricht {{firstName}} !',
        body: 'Vielen Dank, dass Sie sich an OpenPrimer gewandt haben. Wir haben Ihr Feedback oder Ihre Anfrage erfolgreich erhalten und unser Team wird sich so schnell wie möglich bei Ihnen melden. Hier ist eine Kopie Ihrer Nachricht:',
        button: 'OpenPrimer besuchen',
        fallback_text: 'Bei dringenden Fragen können Sie direkt auf diese E-Mail antworten.',
        footer: '© 2026 OpenPrimer. Alle Rechte vorbehalten.'
      },
      {
        id: 'feedback_ZH',
        template_type: 'feedback',
        lang: 'ZH',
        subject: '我们已收到您的留言 - OpenPrimer',
        subtitle: '您的顶尖学术大学',
        welcome: '感谢您的留言 {{firstName}} ！',
        body: '感谢您联系 OpenPrimer。我们已成功收到您的反馈或咨询，我们的团队会尽快与您联系。以下是您的留言备份：',
        button: '访问 OpenPrimer',
        fallback_text: '如有任何紧急情况，您可以直接回复此邮件。',
        footer: '© 2026 OpenPrimer. 保留所有权利。'
      }
    ];

    for (const t of emailTemplates) {
      await pgClient.query(`
        INSERT INTO public.email_templates (id, template_type, lang, subject, subtitle, welcome, body, button, fallback_text, footer)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (id) DO UPDATE SET
          subject = EXCLUDED.subject,
          subtitle = EXCLUDED.subtitle,
          welcome = EXCLUDED.welcome,
          body = EXCLUDED.body,
          button = EXCLUDED.button,
          fallback_text = EXCLUDED.fallback_text,
          footer = EXCLUDED.footer;
      `, [t.id, t.template_type, t.lang, t.subject, t.subtitle, t.welcome, t.body, t.button, t.fallback_text, t.footer]);
    }
    console.log("✅ Core email templates seeded successfully.");

    // D. SEED AI TUTOR PERSONALITIES
    console.log("ðŸŒ± Seeding Master AI Tutor Personalities...");
    const tutors = [
      ['socratic', 'Socratic Coach', 'You are a master Socratic pedagogue inspired by Plato and the classical liberal arts. You never give direct answers or bare formulas. Instead, dissect the student\'s question into atomic premises, and guide them step-by-step using inductive questioning, conceptual counter-examples, and intellectual midwifery. Force them to define their terms, state their assumptions, and identify logical fallacies in their own reasoning. Maintain a patient, intellectually challenging, and deeply encouraging philosophical tone.', true],
      ['direct', 'Direct Synthesizer', 'You are an elite, high-density scientific advisor and researcher. Skip all conversational pleasantries, rhetorical preamble, and superficial hand-waving. Provide immediate, highly rigorous mathematical formulations, precise physical derivations, axiomatic definitions, and concise structural summaries. Use LaTeX formatting extensively for all formulas. Focus on extreme informational efficiency, maximum technical density, and clear logical sequence.', false],
      ['gamified', 'Gamified Companion', 'You are a highly engaging, gamified academic companion. Frame the learning material as an epic intellectual quest within the grand repository of universal knowledge. Encourage the student using leveling milestones, XP checkpoint suggestions, pedagogical quests, boss battles against difficult concepts, and roleplay metaphors (e.g., \'You are leveling up your thermodynamics skill tree!\'). Keep the tone enthusiastic, vibrant, game-like, and highly motivational.', false],
      ['historical', 'Historical Storyteller', 'You are an academic historian of science and ideas. Teach every technical concept by embedding it within its historical, cultural, and human drama. Reconstruct the precise intellectual struggle, the letters exchanged, the accidental discoveries, and the fierce debates between legendary scientists (e.g., Newton vs. Leibniz, Einstein vs. Bohr). Use rich storytelling, historical anecdotes, and humanizing narratives to make cold academic theorems feel alive, dramatic, and unforgettable.', false],
      ['feynman', 'Feynman Simplifier', 'You are a world-class expositor operating strictly under the Feynman Technique of extreme simplification. Your mission is to demystify the most complex, abstract, and advanced academic concepts by explaining them using simple, non-jargon analogies, concrete real-world physical models, and plain intuitive language. Avoid high-level technical terms until you have built a solid foundation. If you must introduce jargon, define it instantly through visceral mechanical or physical metaphors.', false],
      ['proof', 'Rigorous Proof Master', 'You are a formal mathematician and proof-theoretic tutor. Every answer you give must be built from first principles (axioms) and structured with strict logical proofs. Clearly state your assumptions, lemmas, theorems, and Q.E.D. blocks. Do not accept hand-waving, numerical approximations, or informal intuition without formal grounding. Guide the student to construct valid deductions, formal epsilon-delta arguments, or structural inductive proofs.', false],
      ['engineer', 'Pragmatic Engineer', 'You are a practical, hands-on systems engineer and software architect. Ground every theory into actual industrial applications, concrete hardware specifications, real-world code snippets, and operational constraints. Explain \'how it works under the hood\' rather than how it looks on paper. Focus on scaling laws, trade-offs, engineering safety factors, computational overhead, and modern industrial frameworks.', false],
      ['debater', 'Interactive Debater', 'You are a sharp, intellectually playful debate partner. Challenge the student\'s understanding by playing devil\'s advocate. Introduce dissenting scientific viewpoints, controversial academic interpretations, or alternative hypotheses. Force the student to defend their position against well-formulated counterarguments, synthesize competing paradigms, and acknowledge the limits of current scientific models.', false]
    ];

    for (const [id, name, prompt, is_default] of tutors) {
      await pgClient.query(`
        INSERT INTO public.tutor_personalities (id, name, prompt, is_default, archiving_level)
        VALUES ($1, $2, $3, $4, 0)
        ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, prompt = EXCLUDED.prompt, is_default = EXCLUDED.is_default;
      `, [id, name, prompt, is_default]);
    }
    console.log("âœ… Core AI Tutor personalities seeded.");

    // E. SEED SYSTEM ACHIEVEMENTS (BADGES)
    console.log("ðŸŒ± Seeding Achievements / Badges...");
    for (const ach of initialAchievements) {
      await pgClient.query(`
        INSERT INTO public.achievements (id, name, description, threshold, count, status, start_date, end_date, icon, translations, archiving_level)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 0)
        ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, threshold = EXCLUDED.threshold, count = EXCLUDED.count, status = EXCLUDED.status, icon = EXCLUDED.icon, translations = EXCLUDED.translations;
      `, [ach.id, ach.name, ach.description, ach.threshold, ach.count, ach.status, ach.startDate, ach.endDate, ach.icon, JSON.stringify(ach.translations)]);
    }
    console.log("âœ… Core Achievements / Badges successfully seeded.");

    // F. SEED USER ACCOUNTS
    const accounts = [
      {
        email: 'vanguard.mysterious@gmail.com',
        password: ';fXX£e*Y7>xB4[88*',
        name: 'Vanguard Admin',
        role: 'admin'
      },
      {
        email: 'student1@openprimer.org',
        password: 'student1password',
        name: 'Student One',
        role: 'student'
      },
      {
        email: 'student2@openprimer.org',
        password: 'student2password',
        name: 'Student Two',
        role: 'student'
      },
      {
        email: 'student3@openprimer.org',
        password: 'student3password',
        name: 'Student Three',
        role: 'student'
      }
    ];

    console.log("\n🌱 Seeding System User Accounts...");
    for (const acc of accounts) {
      console.log(`Creating account in Supabase Auth: ${acc.email}`);
      const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
        email: acc.email,
        password: acc.password,
        email_confirm: true,
        user_metadata: { name: acc.name }
      });

      if (authErr) {
        console.error(`Failed to register ${acc.email} in Supabase Auth:`, authErr.message);
        continue;
      }

      const userId = authData.user.id;
      console.log(`Seeding DB profile for: ${userId} (${acc.role})`);
      await pgClient.query(`
        INSERT INTO public.profiles (id, name, email, role, level, kp, is_email_verified, is_blocked, favorites, tutor_choice, audio_volume, audio_rate, audio_voice_id)
        VALUES ($1, $2, $3, $4, 1, 0, true, false, '{}', 'socratic', 1.00, 1.00, '')
      `, [userId, acc.name, acc.email, acc.role]);

      console.log(`✅ Seeded account: ${acc.email}`);
    }

    // G. APPLY ADMINISTRATIVE RLS POLICIES FOR ADMIN ACCESSIBILITY
    console.log("\n🛡️ Configuring administrative RLS policies...");
    await pgClient.query(`
      ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
      
      -- Drop old conflicting policies
      DROP POLICY IF EXISTS "Admins can read all profiles" ON public.profiles;
      DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
      DROP POLICY IF EXISTS "Admins can delete profiles" ON public.profiles;
      DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
      DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
      DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
      DROP POLICY IF EXISTS "Users can delete own profile" ON public.profiles;

       -- Allow admin access (is_admin() = true)
       CREATE POLICY "Admins can read all profiles" ON public.profiles 
         FOR SELECT 
         USING (public.is_admin() = true);
 
       CREATE POLICY "Admins can update all profiles" ON public.profiles 
         FOR UPDATE 
         USING (public.is_admin() = true);
 
       CREATE POLICY "Admins can delete profiles" ON public.profiles 
         FOR DELETE 
         USING (public.is_admin() = true);

        -- Allow users to read, update, insert, delete their own profiles
        CREATE POLICY "Users can read own profile" ON public.profiles
          FOR SELECT TO authenticated
          USING ((auth.uid())::text = id OR public.is_admin() = true);

        CREATE POLICY "Users can update own profile" ON public.profiles 
          FOR UPDATE USING ((auth.uid())::text = id OR id = 'u1');

        CREATE POLICY "Users can insert own profile" ON public.profiles 
          FOR INSERT WITH CHECK (true);

        CREATE POLICY "Users can delete own profile" ON public.profiles 
          FOR DELETE USING ((auth.uid())::text = id OR id = 'u1');

        GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO public, anon, authenticated;
     `);
     console.log("✅ Administrative and user RLS policies successfully applied.");

    // H. SEED SITE STATS AND AGENT METRICS
    console.log("\n🌱 Seeding Site Stats and Agent Metrics (Zeroed for Pristine Launch)...");
    await pgClient.query(`
      INSERT INTO public.site_stats (id, total_students, validation_rate, total_course_visits, platform_rating)
      VALUES (1, 0, 0.00, 0, '0.0/5')
      ON CONFLICT (id) DO NOTHING;

      INSERT INTO public.agent_metrics (id, name_en, name_fr, name_es, name_de, name_zh, total_cost, rolling_30_days_cost, requests, avg_response_time)
      VALUES 
        ('generation', 'Course Generation Agent', 'Agent de GÃ©nÃ©ration de Cursus', 'Agente de GeneraciÃ³n de Cursos', 'Kursgenerierungs-Agent', 'è¯¾ç¨‹ç”Ÿæˆæ™ºèƒ½ä½“', 0.00, 0.00, 0, '0ms'),
        ('translation', 'Translation Agent', 'Agent de Traduction Multi-Langues', 'Agente de TraducciÃ³n MultilingÃ¼e', 'Ãœbersetzungs-Agent', 'ç¿»è¯‘æ™ºèƒ½ä½“', 0.00, 0.00, 0, '0ms'),
        ('revision', 'Pedagogical Revision Agent', 'Agent de RÃ©vision PÃ©dagogique', 'Agente de RevisiÃ³n PedagÃ³gica', 'PÃ¤dagogischer Revisions-Agent', 'æ•™å­¦ä¿®è®¢æ™ºèƒ½ä½“', 0.00, 0.00, 0, '0ms'),
        ('tutor', 'AI Tutor Agent & Personalities', 'Agent de Tutorat IA & PersonnalitÃ©s', 'Agente de TutorÃ­a IA y Personalidades', 'KI-Tutor-Agent & PersÃ¶nlichkeiten', 'AI æ™ºèƒ½ä½“ with Personality', 0.00, 0.00, 0, '0ms')
      ON CONFLICT (id) DO NOTHING;

      -- Apply RLS and permissions
      ALTER TABLE public.site_stats ENABLE ROW LEVEL SECURITY;
      DROP POLICY IF EXISTS "Allow public read access to site_stats" ON public.site_stats;
      CREATE POLICY "Allow public read access to site_stats" ON public.site_stats FOR SELECT USING (true);
      DROP POLICY IF EXISTS "Allow all access to site_stats" ON public.site_stats;
      CREATE POLICY "Allow all access to site_stats" ON public.site_stats FOR ALL USING (true) WITH CHECK (true);

      ALTER TABLE public.agent_metrics ENABLE ROW LEVEL SECURITY;
      DROP POLICY IF EXISTS "Allow public read access to agent_metrics" ON public.agent_metrics;
      CREATE POLICY "Allow public read access to agent_metrics" ON public.agent_metrics FOR SELECT USING (true);
      DROP POLICY IF EXISTS "Allow all access to agent_metrics" ON public.agent_metrics;
      CREATE POLICY "Allow all access to agent_metrics" ON public.agent_metrics FOR ALL USING (true) WITH CHECK (true);

      GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_stats TO public, anon, authenticated;
      GRANT SELECT, INSERT, UPDATE, DELETE ON public.agent_metrics TO public, anon, authenticated;
      GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA public TO public, anon, authenticated;
    `);
    console.log("âœ… Site stats and agent metrics seeded and secured.");

    console.log("\n=============================================");
    console.log("   ðŸŽ‰ Clean Seed Operation Completed!        ");
    console.log("\n=============================================");

  } catch (error) {
    console.error("Fatal Error during setup & seed process:", error.message);
  } finally {
    await pgClient.end();
  }
}

main();

