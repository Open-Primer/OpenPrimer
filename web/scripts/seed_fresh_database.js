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

const initialAchievements = [
  {
    id: 1,
    name: "Fast Learner",
    description: "Validate a course in record time.",
    threshold: "3 days",
    count: 1240,
    status: "active",
    startDate: null,
    endDate: null,
    icon: 'img_1',
    translations: {
      EN: { name: "Fast Learner", description: "Validate a course in record time." },
      FR: { name: "Apprenant Rapide", description: "Valider un cours en un temps record." },
      ES: { name: "Estudiante Rápido", description: "Valida un curso en tiempo récord." },
      DE: { name: "Schneller Lerner", description: "Schließen Sie einen Kurs in Rekordzeit ab." },
      ZH: { name: "神速学习者", description: "以创纪录的时间通过一门课程의验证。" }
    }
  },
  {
    id: 2,
    name: "Socratic Master",
    description: "Ask 50+ deep questions to the AI Tutor.",
    threshold: "50 questions",
    count: 450,
    status: "active",
    startDate: null,
    endDate: null,
    icon: 'img_2',
    translations: {
      EN: { name: "Socratic Master", description: "Ask 50+ deep questions to the AI Tutor." },
      FR: { name: "Maître Socratique", description: "Poser plus de 50 questions profondes au Tuteur IA." },
      ES: { name: "Maestro Socrático", description: "Realiza más de 50 preguntas profundas al Tutor IA." },
      DE: { name: "Sokratischer Meister", description: "Stellen Sie dem KI-Tutor mehr als 50 tiefgründige Fragen." },
      ZH: { name: "苏格拉底大师", description: "向人工智能导师提出 50 个以上的深度问题。" }
    }
  },
  {
    id: 3,
    name: "Polyglot Scholar",
    description: "Switch between 3+ languages in one course.",
    threshold: "3 languages",
    count: 89,
    status: "active",
    startDate: null,
    endDate: null,
    icon: 'img_3',
    translations: {
      EN: { name: "Polyglot Scholar", description: "Switch between 3+ languages in one course." },
      FR: { name: "Érudit Polyglotte", description: "Passer d'une langue à l'autre (3+) dans un même cours." },
      ES: { name: "Erudito Políglota", description: "Cambia entre 3 o más idiomas en un solo curso." },
      DE: { name: "Mehrsprachiger Gelehrter", description: "Wechseln Sie in einem Kurs zwischen 3 oder mehr Sprachen." },
      ZH: { name: "多语种学者", description: "在一门课程中切换 3 种以上的语言学习。" }
    }
  },
  {
    id: 4,
    name: "Streak Warrior",
    description: "Study for 7 consecutive days on OpenPrimer.",
    threshold: "7 day streak",
    count: 320,
    status: "active",
    startDate: "2026-05-01",
    endDate: "2026-06-01",
    icon: 'img_4',
    translations: {
      EN: { name: "Streak Warrior", description: "Study for 7 consecutive days on OpenPrimer." },
      FR: { name: "Guerrier de la Régularité", description: "Étudier pendant 7 jours consécutifs sur OpenPrimer." },
      ES: { name: "Guerrero de la Constancia", description: "Estudia durante 7 días consecutivos en OpenPrimer." },
      DE: { name: "Lernserien-Krieger", description: "Lernen Sie an 7 aufeinanderfolgenden Tagen auf OpenPrimer." },
      ZH: { name: "连击勇士", description: "在 OpenPrimer 上连续学习 7 天。" }
    }
  },
  {
    id: 5,
    name: "Perfect Score",
    description: "Get 100% on any chapter active quiz.",
    threshold: "100% score",
    count: 512,
    status: "active",
    startDate: null,
    endDate: null,
    icon: 'img_5',
    translations: {
      EN: { name: "Perfect Score", description: "Get 100% on any chapter active quiz." },
      FR: { name: "Sans-Faute", description: "Obtenir 100% à n'importe quel quiz de chapitre actif." },
      ES: { name: "Puntuación Perfecta", description: "Obtén el 100% en cualquier cuestionario activo de capítulo." },
      DE: { name: "Perfekte Punktzahl", description: "Erreichen Sie 100 % in einem beliebigen aktiven Kapitel-Quiz." },
      ZH: { name: "满分通关", description: "在任何章节的激活测验中获得 100% 的满分。" }
    }
  },
  {
    id: 6,
    name: "Night Owl",
    description: "Complete a study session after 10 PM.",
    threshold: "5 night sessions",
    count: 830,
    status: "active",
    startDate: null,
    endDate: null,
    icon: 'img_6',
    translations: {
      EN: { name: "Night Owl", description: "Complete a study session after 10 PM." },
      FR: { name: "Oiseau de Nuit", description: "Terminer une session d'étude après 22h00." },
      ES: { name: "Búho Nocturno", description: "Completa una sesión de estudio después de las 10 PM." },
      DE: { name: "Nachteule", description: "Schließen Sie eine Lernsitzung nach 22 Uhr ab." },
      ZH: { name: "夜猫子", description: "在晚上 10 点之后完成一次学习会话。" }
    }
  },
  {
    id: 7,
    name: "Early Bird",
    description: "Complete a study session before 7 AM.",
    threshold: "5 morning sessions",
    count: 410,
    status: "active",
    startDate: null,
    endDate: null,
    icon: 'img_7',
    translations: {
      EN: { name: "Early Bird", description: "Complete a study session before 7 AM." },
      FR: { name: "Lève-Tôt", description: "Terminer une session d'étude avant 7h00." },
      ES: { name: "Madrugador", description: "Completa una sesión de estudio antes de las 7 AM." },
      DE: { name: "Frühaufsteher", description: "Schließen Sie eine Lernsitzung vor 7 Uhr morgens ab." },
      ZH: { name: "晨间使者", description: "在早上 7 点之前完成一次学习会话。" }
    }
  },
  {
    id: 8,
    name: "Academic Sovereign",
    description: "Graduate fully from L1 level curriculum.",
    threshold: "L1 graduate",
    count: 210,
    status: "active",
    startDate: null,
    endDate: null,
    icon: 'img_8',
    translations: {
      EN: { name: "Academic Sovereign", description: "Graduate fully from L1 level curriculum." },
      FR: { name: "Souverain Académique", description: "Obtenir le diplôme complet du niveau L1." },
      ES: { name: "Soberano Académico", description: "Gradúate por completo del plan de estudios de nivel L1." },
      DE: { name: "Akademischer Souverän", description: "Schließen Sie das L1-Lehrplanniveau vollständig ab." },
      ZH: { name: "学术元首", description: "完整从 L1 级别的课程体系中毕业。" }
    }
  },
  {
    id: 9,
    name: "Curriculum Explorer",
    description: "Enrol in 5 or more course modules.",
    threshold: "5 courses",
    count: 1045,
    status: "active",
    startDate: null,
    endDate: null,
    icon: 'img_9',
    translations: {
      EN: { name: "Curriculum Explorer", description: "Enrol in 5 or more course modules." },
      FR: { name: "Explorateur de Cursus", description: "S'inscrire à 5 modules de cours ou plus." },
      ES: { name: "Explorador de Planes", description: "Inscríbete en 5 o más módulos de cursos." },
      DE: { name: "Lehrplan-Entdecker", description: "Melden Sie sich für 5 oder mehr Kursmodule an." },
      ZH: { name: "课程探索者", description: "注册 5 个或更多课程模块。" }
    }
  },
  {
    id: 10,
    name: "Error Slayer",
    description: "Resolve and patch 10 AI diagnostics feedback reports.",
    threshold: "10 corrections",
    count: 75,
    status: "active",
    startDate: null,
    endDate: null,
    icon: 'img_10',
    translations: {
      EN: { name: "Error Slayer", description: "Resolve and patch 10 AI diagnostics feedback reports." },
      FR: { name: "Chasseur de Bugs", description: "Résoudre et corriger 10 rapports de retour de diagnostic de l'IA." },
      ES: { name: "Cazador de Errores", description: "Resuelve y parchea 10 informes de comentarios del diagnóstico de IA." },
      DE: { name: "Fehler-Bezwinger", description: "Lösen und beheben Sie 10 KI-Diagnoseberichte." },
      ZH: { name: "Bug 斩杀者", description: "解决并修正 10 个人工智能诊断反馈报告。" }
    }
  },
  {
    id: 11,
    name: "Deep Thinker",
    description: "Ask 100+ deep questions to AI Tutor.",
    threshold: "100 questions",
    count: 180,
    status: "active",
    startDate: null,
    endDate: null,
    icon: 'img_11',
    translations: {
      EN: { name: "Deep Thinker", description: "Ask 100+ deep questions to AI Tutor." },
      FR: { name: "Penseur Profond", description: "Poser plus de 100 questions profondes au Tuteur IA." },
      ES: { name: "Pensador Profundo", description: "Realiza más de 100 preguntas profundas al Tutor IA." },
      DE: { name: "Tiefgründiger Denker", description: "Stellen Sie dem KI-Tutor mehr als 100 tiefgründige Fragen." },
      ZH: { name: "深思熟虑者", description: "向人工智能导师提出 100 个以上的深度问题。" }
    }
  },
  {
    id: 12,
    name: "Syllabus Architect",
    description: "Create a custom curriculum syllabus layout.",
    threshold: "1 curriculum",
    count: 64,
    status: "active",
    startDate: null,
    endDate: null,
    icon: 'img_12',
    translations: {
      EN: { name: "Syllabus Architect", description: "Create a custom curriculum syllabus layout." },
      FR: { name: "Architecte du Programme", description: "Créer une structure de programme d'études personnalisée." },
      ES: { name: "Arquitecto del Programa", description: "Crea una estructura de programa de estudios personalizada." },
      DE: { name: "Lehrplan-Architekt", description: "Erstellen Sie ein benutzerdefiniertes Lehrplan-Layout." },
      ZH: { name: "大纲架构师", description: "创建自定义课程教学大纲布局。" }
    }
  },
  {
    id: 13,
    name: "Review Curator",
    description: "Rate and leave feedback on 10 lessons.",
    threshold: "10 ratings",
    count: 540,
    status: "active",
    startDate: null,
    endDate: null,
    icon: 'img_13',
    translations: {
      EN: { name: "Review Curator", description: "Rate and leave feedback on 10 lessons." },
      FR: { name: "Conservateur des Avis", description: "Évaluer et laisser des commentaires sur 10 leçons." },
      ES: { name: "Curador de Reseñas", description: "Califica y deja comentarios en 10 lecciones." },
      DE: { name: "Bewertungskurator", description: "Bewerten und kommentieren Sie 10 Lektionen." },
      ZH: { name: "评价馆长", description: "对 10 门课程进行评分并留下反馈建议。" }
    }
  },
  {
    id: 14,
    name: "Sovereign Master",
    description: "Complete 100 quizzes with perfect scores.",
    threshold: "100 perfect scores",
    count: 45,
    status: "active",
    startDate: null,
    endDate: null,
    icon: 'img_14',
    translations: {
      EN: { name: "Sovereign Master", description: "Complete 100 quizzes with perfect scores." },
      FR: { name: "Maître Souverain", description: "Compléter 100 quiz avec un score parfait de 100%." },
      ES: { name: "Maestro Soberano", description: "Completa 100 cuestionarios con puntuaciones perfectas." },
      DE: { name: "Souveräner Meister", description: "Schließen Sie 100 Quizze mit perfekter Punktzahl ab." },
      ZH: { name: "至尊霸主", description: "以满分通关 100 个测验。" }
    }
  },
  {
    id: 15,
    name: "Beta Pioneer",
    description: "Report an issue directly to the diagnostic cockpit.",
    threshold: "1 feedback",
    count: 125,
    status: "active",
    startDate: null,
    endDate: null,
    icon: 'img_15',
    translations: {
      EN: { name: "Beta Pioneer", description: "Report an issue directly to the diagnostic cockpit." },
      FR: { name: "Pionnier Beta", description: "Signaler un problème directement dans le cockpit de diagnostic." },
      ES: { name: "Pionero Beta", description: "Informa de un problema directement al panel de diagnóstico." },
      DE: { name: "Beta-Pionier", description: "Melden Sie ein Problem direkt im Diagnose-Cockpit." },
      ZH: { name: "内测先锋", description: "直接向诊断控制舱报告一个系统问题。" }
    }
  },
  {
    id: 16,
    name: "Quantum Leap",
    description: "Complete 3 highly advanced science modules with score >= 95%.",
    threshold: "3 advanced courses",
    count: 24,
    status: "active",
    startDate: null,
    endDate: null,
    icon: 'img_28',
    translations: {
      EN: { name: "Quantum Leap", description: "Complete 3 highly advanced science modules with score >= 95%." },
      FR: { name: "Saut Quantique", description: "Compléter 3 modules scientifiques très avancés avec un score >= 95%." },
      ES: { name: "Salto Cuántico", description: "Completa 3 módulos científicos altamente avanzados con puntuación >= 95%." },
      DE: { name: "Quantensprung", description: "Schließen Sie 3 hochentwickelte wissenschaftliche Module mit einer Punktzahl >= 95 % ab." },
      ZH: { name: "量子跃迁", description: "以不低于 95% 的成绩完成 3 个极高级的科学模块。" }
    }
  },
  {
    id: 17,
    name: "Infinite Recursion",
    description: "Successfully prompt the pedagogical engine 10 times in a single session.",
    threshold: "10 loop prompts",
    count: 58,
    status: "active",
    startDate: null,
    endDate: null,
    icon: 'img_12',
    translations: {
      EN: { name: "Infinite Recursion", description: "Successfully prompt the pedagogical engine 10 times in a single session." },
      FR: { name: "Récursion Infinie", description: "Solliciter avec succès le moteur pédagogique 10 fois dans une seule session." },
      ES: { name: "Recursión Infinita", description: "Envía con éxito 10 solicitudes al motor pedagógico en una sola sesión." },
      DE: { name: "Unendliche Rekursion", description: "Rufen Sie die pädagogische Engine in einer einzigen Sitzung erfolgreich 10-mal auf." },
      ZH: { name: "无限递归", description: "在单次会话中成功触发教学引擎 10 次。" }
    }
  },
  {
    id: 18,
    name: "Polymath Monarch",
    description: "Validate courses across 3 distinct academic subject domains.",
    threshold: "3 subject fields",
    count: 15,
    status: "active",
    startDate: null,
    endDate: null,
    icon: 'img_35',
    translations: {
      EN: { name: "Polymath Monarch", description: "Validate courses across 3 distinct academic subject domains." },
      FR: { name: "Monarque Polymathe", description: "Valider des cours dans 3 domaines académiques distincts." },
      ES: { name: "Monarca Polímata", description: "Valida cursos en 3 dominios de asignaturas académicas distintos." },
      DE: { name: "Universalgelehrter Monarch", description: "Schließen Sie Kurse in 3 verschiedenen akademischen Fachbereichen ab." },
      ZH: { name: "博学君主", description: "通过 3 个不同学术领域的课程验证。" }
    }
  },
  {
    id: 19,
    name: "Resilient Explorer",
    description: "Successfully override a failed AI generation path via custom feedback query.",
    threshold: "1 custom query override",
    count: 8,
    status: "active",
    startDate: null,
    endDate: null,
    icon: 'img_45',
    translations: {
      EN: { name: "Resilient Explorer", description: "Successfully override a failed AI generation path via custom feedback query." },
      FR: { name: "Explorateur Résilient", description: "Forcer avec succès un chemin de génération d'IA défaillant via une requête de retour personnalisée." },
      ES: { name: "Explorador Resiliente", description: "Anula con éxito una ruta de generación de IA fallida mediante una consulta de comentarios personalizada." },
      DE: { name: "Resilienter Entdecker", description: "Umgehen Sie erfolgreich einen fehlgeschlagenen KI-Generierungspfad über eine benutzerdefinierte Feedback-Abfrage." },
      ZH: { name: "韧性探索家", description: "通过自定义反馈查询成功覆盖失败的人工智能生成路径。" }
    }
  },
  {
    id: 20,
    name: "Architect of Knowledge",
    description: "Expand an existing active course with 2+ dynamic sub-modules.",
    threshold: "2 sub-modules expanded",
    count: 32,
    status: "active",
    startDate: null,
    endDate: null,
    icon: 'img_49',
    translations: {
      EN: { name: "Architect of Knowledge", description: "Expand an existing active course with 2+ dynamic sub-modules." },
      FR: { name: "Architecte du Savoir", description: "Étendre un cours actif existant avec 2+ sous-modules dynamiques." },
      ES: { name: "Arquitecto del Saber", description: "Expande un curso activo existente con 2 o más submódulos dinámicos." },
      DE: { name: "Architekt des Wissens", description: "Erweitern Sie einen bestehenden aktiven Kurs um 2 oder mehr dynamische Untermodule." },
      ZH: { name: "知识架构师", description: "使用 2 个以上的动态子模块扩展现有的激活课程。" }
    }
  },
  {
    id: 21,
    name: "Polymath Overlord",
    description: "Validate and graduate from at least one course in 4 distinct academic subject fields.",
    threshold: "4 disciplines",
    count: 0,
    status: "active",
    startDate: null,
    endDate: null,
    icon: 'img_8',
    translations: {
      EN: { name: "Polymath Overlord", description: "Validate and graduate from at least one course in 4 distinct academic subject fields." },
      FR: { name: "Monarque Absolu Polymathe", description: "Valider et obtenir un diplôme dans au moins un cours de 4 disciplines académiques différentes." },
      ES: { name: "Señor Polímata", description: "Valida y gradúate de al menos un curso en 4 disciplinas académicas diferentes." },
      DE: { name: "Universalgelehrter Herrscher", description: "Schließen Sie mindestens einen Kurs in 4 verschiedenen akademischen Fachbereichen erfolgreich ab." },
      ZH: { name: "全才领主", description: "在至少 4 个不同的学术领域中验证并毕业至少一门课程。" }
    }
  },
  {
    id: 22,
    name: "Epistemic Explorer",
    description: "Achieve a perfect 100% score on 20 distinct curriculum chapter quizzes.",
    threshold: "20 perfect quizzes",
    count: 0,
    status: "active",
    startDate: null,
    endDate: null,
    icon: 'img_28',
    translations: {
      EN: { name: "Epistemic Explorer", description: "Achieve a perfect 100% score on 20 distinct curriculum chapter quizzes." },
      FR: { name: "Explorateur Épistémique", description: "Obtenir un score parfait de 100% dans 20 quiz de chapitres différents." },
      ES: { name: "Explorador Epistémico", description: "Consigue una puntuación perfecta del 100% en 20 cuestionarios de capítulos distintos." },
      DE: { name: "Epistemischer Entdecker", description: "Erreichen Sie eine perfekte Punktzahl von 100 % in 20 verschiedenen Kapitel-Quizzen." },
      ZH: { name: "认识论探险家", description: "在 20 个不同的课程章节测验中获得 100% 的满分。" }
    }
  },
  {
    id: 23,
    name: "Sovereign Governor",
    description: "Initiate and guide 10 distinct dynamic AI curriculum generation or deep pedagogical revision pipelines.",
    threshold: "10 AI generations",
    count: 0,
    status: "active",
    startDate: null,
    endDate: null,
    icon: 'img_26',
    translations: {
      EN: { name: "Sovereign Governor", description: "Initiate and guide 10 distinct dynamic AI curriculum generation or deep pedagogical revision pipelines." },
      FR: { name: "Gouverneur Souverain", description: "Initier et guider 10 pipelines distincts de génération dynamique de cursus ou de révision pédagogique par l'IA." },
      ES: { name: "Gobernador Soberano", description: "Inicia y guía 10 flujos de trabajo dinámicos de generación de planes o de revisión pedagógica profunda por IA." },
      DE: { name: "Souveräner Regent", description: "Initiieren und leiten Sie 10 verschiedene dynamische KI-Lehrplangenerierungen oder tiefgehende pädagogische Revisionspipelines." },
      ZH: { name: "至尊掌舵者", description: "发起并引导 10 次不同的人工智能动态课程生成或深度教学修订管线。" }
    }
  },
  {
    id: 24,
    name: "Synaptic Consolidator",
    description: "Accumulate over 50 hours of active learning time across the sovereign knowledge grid.",
    threshold: "50 hours study",
    count: 0,
    status: "active",
    startDate: null,
    endDate: null,
    icon: 'img_48',
    translations: {
      EN: { name: "Synaptic Consolidator", description: "Accumulate over 50 hours of active learning time across the sovereign knowledge grid." },
      FR: { name: "Consolidateur Synaptique", description: "Accumuler plus de 50 heures de temps d'apprentissage actif sur la grille souveraine du savoir." },
      ES: { name: "Consolidador Sináptico", description: "Acumula más de 50 horas de temps de aprendizaje activo en la red soberana del saber." },
      DE: { name: "Synaptischer Festiger", description: "Sammeln Sie über 50 Stunden aktive Lernzeit im souveränen Wissensnetzwerk an." },
      ZH: { name: "突触巩固家", description: "在自主学习知识网络中累计学习超过 50 个小时。" }
    }
  },
  {
    id: 25,
    name: "Elite Curator",
    description: "Submit 25 detailed diagnostic feedback reports to help refine and perfect the pedagogical system.",
    threshold: "25 diagnostics",
    count: 0,
    status: "active",
    startDate: null,
    endDate: null,
    icon: 'img_34',
    translations: {
      EN: { name: "Elite Curator", description: "Submit 25 detailed diagnostic feedback reports to help refine and perfect the pedagogical system." },
      FR: { name: "Conservateur d'Élite", description: "Soumettre 25 rapports détaillés de retour de diagnostic pour aider à affiner et perfectionner le système." },
      ES: { name: "Curador de Élite", description: "Envía 25 informes de diagnóstico detallados para ayudar a perfeccionar el sistema pedagógico." },
      DE: { name: "Elite-Kurator", description: "Reichen Sie 25 detaillierte Diagnose-Feedbackberichte ein, um das pädagogische System zu verfeinern." },
      ZH: { name: "精英馆长", description: "提交 25 份详细的诊断反馈报告，以协助优化 and 完善教学系统。" }
    }
  }
];

async function main() {
  try {
    console.log("=============================================");
    console.log("   OpenPrimer Reusable Setup & Seed Utility  ");
    console.log("=============================================\n");

    await pgClient.connect();
    console.log("🔌 Connected to PostgreSQL Database owner successfully.");

    // 0. ENSURE SITE STATS, AGENT METRICS, PROGRESS, SYSTEM PARAMETERS AND SERVICE UPTIME LOGS EXIST
    console.log("🛠️ Guaranteeing all system, stats, uptime logs, and progress tables exist...");
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

      -- Apply RLS policies & permissions
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
      CREATE POLICY "Allow all access to translation_requests" ON public.translation_requests FOR ALL USING (true) WITH CHECK (true);
      GRANT SELECT, INSERT, UPDATE, DELETE ON public.translation_requests TO public, anon, authenticated;

      ALTER TABLE public.course_feedbacks ENABLE ROW LEVEL SECURITY;
      DROP POLICY IF EXISTS "Allow all access to course_feedbacks" ON public.course_feedbacks;
      CREATE POLICY "Allow all access to course_feedbacks" ON public.course_feedbacks FOR ALL USING (true) WITH CHECK (true);
      GRANT SELECT, INSERT, UPDATE, DELETE ON public.course_feedbacks TO public, anon, authenticated;

      ALTER TABLE public.report_clusters ENABLE ROW LEVEL SECURITY;
      DROP POLICY IF EXISTS "Allow all access to report_clusters" ON public.report_clusters;
      CREATE POLICY "Allow all access to report_clusters" ON public.report_clusters FOR ALL USING (true) WITH CHECK (true);
      GRANT SELECT, INSERT, UPDATE, DELETE ON public.report_clusters TO public, anon, authenticated;
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
        public.report_clusters
      CASCADE;
    `);
    console.log("✅ Student progress, stats, and operational logs fully truncated.");

    // B. PURGE ALL AUTH ACCOUNTS
    console.log("🗑️ Purging Supabase Auth accounts...");
    await pgClient.query('TRUNCATE TABLE auth.users CASCADE;');
    console.log("✅ Authentication table fully purged.");

    // C. SEED SYSTEM LANGUAGES
    console.log("🌱 Seeding Core Languages...");
    await pgClient.query(`
      INSERT INTO public.languages (code, flag, label, archiving_level) VALUES
        ('FR', '🇫🇷', 'Français', 0),
        ('EN', '🇺🇸', 'English', 0),
        ('ES', '🇪🇸', 'Español', 0),
        ('DE', '🇩🇪', 'Deutsch', 0),
        ('ZH', '🇨🇳', '中文', 0)
      ON CONFLICT (code) DO UPDATE SET flag = EXCLUDED.flag, label = EXCLUDED.label;
    `);
    console.log("✅ System languages seeded.");

    // D. SEED AI TUTOR PERSONALITIES
    console.log("🌱 Seeding Master AI Tutor Personalities...");
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
    console.log("✅ Core AI Tutor personalities seeded.");

    // E. SEED SYSTEM ACHIEVEMENTS (BADGES)
    console.log("🌱 Seeding Achievements / Badges...");
    for (const ach of initialAchievements) {
      await pgClient.query(`
        INSERT INTO public.achievements (id, name, description, threshold, count, status, start_date, end_date, icon, translations, archiving_level)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 0)
        ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, threshold = EXCLUDED.threshold, count = EXCLUDED.count, status = EXCLUDED.status, icon = EXCLUDED.icon, translations = EXCLUDED.translations;
      `, [ach.id, ach.name, ach.description, ach.threshold, ach.count, ach.status, ach.startDate, ach.endDate, ach.icon, JSON.stringify(ach.translations)]);
    }
    console.log("✅ Core Achievements / Badges successfully seeded.");

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
        INSERT INTO public.profiles (id, name, email, role, level, kp, is_email_verified, is_blocked, favorites, tutor_choice)
        VALUES ($1, $2, $3, $4, 1, 0, true, false, '{}', 'socratic')
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

      -- Allow Vanguard Admin email access (vanguard.mysterious@gmail.com) via JWT claims
      CREATE POLICY "Admins can read all profiles" ON public.profiles 
        FOR SELECT 
        USING (auth.jwt() ->> 'email' = 'vanguard.mysterious@gmail.com');

      CREATE POLICY "Admins can update all profiles" ON public.profiles 
        FOR UPDATE 
        USING (auth.jwt() ->> 'email' = 'vanguard.mysterious@gmail.com');

      CREATE POLICY "Admins can delete profiles" ON public.profiles 
        FOR DELETE 
        USING (auth.jwt() ->> 'email' = 'vanguard.mysterious@gmail.com');
    `);
    console.log("✅ Administrative RLS policies successfully applied.");

    // H. SEED SITE STATS AND AGENT METRICS
    console.log("\n🌱 Seeding Site Stats and Agent Metrics (Zeroed for Pristine Launch)...");
    await pgClient.query(`
      INSERT INTO public.site_stats (id, total_students, validation_rate, total_course_visits, platform_rating)
      VALUES (1, 0, 0.00, 0, '0.0/5')
      ON CONFLICT (id) DO NOTHING;

      INSERT INTO public.agent_metrics (id, name_en, name_fr, name_es, name_de, name_zh, total_cost, rolling_30_days_cost, requests, avg_response_time)
      VALUES 
        ('generation', 'Course Generation Agent', 'Agent de Génération de Cursus', 'Agente de Generación de Cursos', 'Kursgenerierungs-Agent', '课程生成智能体', 0.00, 0.00, 0, '0ms'),
        ('translation', 'Translation Agent', 'Agent de Traduction Multi-Langues', 'Agente de Traducción Multilingüe', 'Übersetzungs-Agent', '翻译智能体', 0.00, 0.00, 0, '0ms'),
        ('revision', 'Pedagogical Revision Agent', 'Agent de Révision Pédagogique', 'Agente de Revisión Pedagógica', 'Pädagogischer Revisions-Agent', '教学修订智能体', 0.00, 0.00, 0, '0ms'),
        ('tutor', 'AI Tutor Agent & Personalities', 'Agent de Tutorat IA & Personnalités', 'Agente de Tutoría IA y Personalidades', 'KI-Tutor-Agent & Persönlichkeiten', 'AI 智能体 with Personality', 0.00, 0.00, 0, '0ms')
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
    console.log("✅ Site stats and agent metrics seeded and secured.");

    console.log("\n=============================================");
    console.log("   🎉 Clean Seed Operation Completed!        ");
    console.log("\n=============================================");

  } catch (error) {
    console.error("Fatal Error during setup & seed process:", error.message);
  } finally {
    await pgClient.end();
  }
}

main();
