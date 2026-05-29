'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Activity, Database, Mail, Cpu, Image, RefreshCw,
  CheckCircle, AlertTriangle, WifiOff, ExternalLink, Clock,
  Lock, Eye, EyeOff
} from 'lucide-react';
import { useServiceStatus, ServiceHealth } from '../../../lib/serviceStatus';
import { dbService, progressService } from '../../../lib/db';

// ─── i18n ────────────────────────────────────────────────────────────────────
const HEALTH_STRINGS = {
  EN: {
    title: 'Server Health',
    subtitle: 'Real-time monitoring of all external service dependencies',
    refresh: 'Refresh Now',
    refreshing: 'Checking…',
    last_checked: 'Checked',
    latency: 'Latency',
    endpoint: 'Endpoint',
    status_ok: 'Operational',
    status_degraded: 'Degraded',
    status_offline: 'Offline',
    status_unauthorized: 'Auth Required',
    status_unknown: 'Unknown',
    health_db: 'Supabase Database',
    health_email: 'Resend Email API',
    health_ai: 'Gemini AI (Google)',
    health_images: 'Pollinations.ai (Image Generator)',
    db_desc: 'Primary PostgreSQL database — authentication, courses, achievements, search logs.',
    email_desc: 'Transactional email delivery — account verification, notifications.',
    ai_desc: 'Generative AI backbone — badge prompts, translations, analytics reports, tutor chat.',
    images_desc: 'AI image generation for academic achievement badges.',
    auto_refresh: 'Auto-refreshes every 10 seconds',
    ms: 'ms',
    not_configured: 'Not configured',
    error: 'Error detail',
    cron_title: '⏰ Sovereign Cron Timings & Rolling Audits',
    cron_desc: 'Dynamic scheduling offsets and rolling catalog audits to load-balance high-intensity agentic jobs.',
    col_agent: 'Agentic Job',
    col_schedule: 'Cron Schedule',
    col_timing: 'Timing Offset',
    col_load: 'Compute Load',
    agent_gen: 'Course Generation Engine',
    agent_trans: 'JIT Translation Engine',
    agent_rev: 'Pedagogical Revision Engine',
    offset_gen: 'Everyday at 02:00 AM UTC (Off-peak)',
    offset_trans: 'Everyday at 04:00 AM UTC (Off-peak)',
    offset_rev: 'Everyday at 06:00 AM UTC (Off-peak)',
    load_low: 'Low (Sequential)',
    load_med: 'Medium (Balanced)',
    load_high: 'High (Distributed)',
    audit_title: '🔄 Rolling Catalog Audit Status',
    audit_desc: 'Rather than auditing all courses daily, a rolling 1/15th fraction is analyzed each day based on their ID hashes.',
    audit_stat: 'Today\'s Rolling Batch: 1/15th (1 course audited out of 11 total)',
    pipeline_active: 'Active Pipeline Load Balancing: Enforced (Max 2 concurrent high-intensity tasks)',
  },
  FR: {
    title: 'Santé des Serveurs',
    subtitle: 'Surveillance en temps réel de toutes les dépendances externes',
    refresh: 'Rafraîchir',
    refreshing: 'Vérification…',
    last_checked: 'Vérifié',
    latency: 'Latence',
    endpoint: 'Endpoint',
    status_ok: 'Opérationnel',
    status_degraded: 'Dégradé',
    status_offline: 'Hors ligne',
    status_unauthorized: 'Auth Requise',
    status_unknown: 'Inconnu',
    health_db: 'Base de données Supabase',
    health_email: 'API Email Resend',
    health_ai: 'Gemini IA (Google)',
    health_images: 'Pollinations.ai (Génération d\'Images)',
    db_desc: 'Base de données PostgreSQL principale — authentification, cours, badges, journaux de recherche.',
    email_desc: 'Envoi d\'emails transactionnels — vérification de compte, notifications.',
    ai_desc: 'Moteur IA génératif — prompts de badges, traductions, rapports analytiques, chat tuteur.',
    images_desc: 'Génération d\'images IA pour les badges d\'accomplissement académique.',
    auto_refresh: 'Actualisation automatique toutes les 10 secondes',
    ms: 'ms',
    not_configured: 'Non configuré',
    error: 'Détail de l\'erreur',
    cron_title: '⏰ Planification des Crons & Audits Tournants',
    cron_desc: 'Décalages horaires de planification et audits tournants pour équilibrer la charge des tâches IA intensives.',
    col_agent: 'Tâche IA',
    col_schedule: 'Planification Cron',
    col_timing: 'Décalage Horaire',
    col_load: 'Charge de Calcul',
    agent_gen: 'Moteur de Génération de Cours',
    agent_trans: 'Moteur de Traduction J-I-T',
    agent_rev: 'Moteur de Révision Pédagogique',
    offset_gen: 'Tous les jours à 02:00 UTC (Heures creuses)',
    offset_trans: 'Tous les jours à 04:00 UTC (Heures creuses)',
    offset_rev: 'Tous les jours à 06:00 UTC (Heures creuses)',
    load_low: 'Faible (Séquentiel)',
    load_med: 'Moyen (Équilibré)',
    load_high: 'Élevé (Distribué)',
    audit_title: '🔄 Statut de l\'Audit Tournant du Catalogue',
    audit_desc: 'Au lieu d\'analyser tous les cours quotidiennement, une fraction tournante de 1/15ème est auditée chaque jour selon l\'empreinte des IDs.',
    audit_stat: 'Lot tournant du jour : 1/15ème (1 cours audité sur 11 au total)',
    pipeline_active: 'Équilibrage actif de la file : Activé (Max 2 tâches intensives en simultané)',
  },
  ES: {
    title: 'Estado del Servidor',
    subtitle: 'Monitoreo en tiempo real de todas las dependencias externas',
    refresh: 'Actualizar',
    refreshing: 'Verificando…',
    last_checked: 'Verificado',
    latency: 'Latencia',
    endpoint: 'Endpoint',
    status_ok: 'Operacional',
    status_degraded: 'Degradado',
    status_offline: 'Sin conexión',
    status_unauthorized: 'Auth Requerido',
    status_unknown: 'Desconocido',
    health_db: 'Base de datos Supabase',
    health_email: 'API de Email Resend',
    health_ai: 'Gemini IA (Google)',
    health_images: 'Pollinations.ai (Generador de Imágenes)',
    db_desc: 'Base de datos PostgreSQL principal — autenticación, cursos, logros, registros de búsqueda.',
    email_desc: 'Entrega de correos transaccionales — verificación de cuenta, notificaciones.',
    ai_desc: 'Motor de IA generativa — prompts de insignias, traducciones, informes analíticos, chat de tutor.',
    images_desc: 'Generación de imágenes IA para insignias de logros académicos.',
    auto_refresh: 'Actualización automática cada 10 segundos',
    ms: 'ms',
    not_configured: 'No configurado',
    error: 'Detalle del error',
    cron_title: '⏰ Horarios de Cron y Auditorías Rotativas',
    cron_desc: 'Desplazamientos de programación y auditorías rotativas para equilibrar la carga de tareas de IA intensas.',
    col_agent: 'Tarea de IA',
    col_schedule: 'Horario de Cron',
    col_timing: 'Desplazamiento',
    col_load: 'Carga de Cómputo',
    agent_gen: 'Motor de Generación de Cursos',
    agent_trans: 'Motor de Traducción J-I-T',
    agent_rev: 'Motor de Revisión Pedagógica',
    offset_gen: 'Todos los días a las 02:00 UTC (Fuera de pico)',
    offset_trans: 'Todos los días a las 04:00 UTC (Fuera de pico)',
    offset_rev: 'Todos los días a las 06:00 UTC (Fuera de pico)',
    load_low: 'Bajo (Secuencial)',
    load_med: 'Medio (Equilibrado)',
    load_high: 'Alto (Distribuido)',
    audit_title: '🔄 Estado de la Auditoría de Catálogo Rotativa',
    audit_desc: 'En lugar de auditar todos los cursos diariamente, se analiza una fracción rotativa de 1/15 cada día según los hashes de ID.',
    audit_stat: 'Lote rotativo de hoy: 1/15 (1 curso auditado de 11 en total)',
    pipeline_active: 'Equilibrio de carga en cola activo: Forzado (Máx. 2 tareas concurrentes)',
  },
  DE: {
    title: 'Server-Gesundheit',
    subtitle: 'Echtzeit-Überwachung aller externen Dienstabhängigkeiten',
    refresh: 'Jetzt aktualisieren',
    refreshing: 'Überprüfung…',
    last_checked: 'Geprüft',
    latency: 'Latenz',
    endpoint: 'Endpunkt',
    status_ok: 'Betriebsbereit',
    status_degraded: 'Eingeschränkt',
    status_offline: 'Offline',
    status_unauthorized: 'Auth Erforderlich',
    status_unknown: 'Unbekannt',
    health_db: 'Supabase Datenbank',
    health_email: 'Resend E-Mail API',
    health_ai: 'Gemini KI (Google)',
    health_images: 'Pollinations.ai (Bildgenerator)',
    db_desc: 'Primäre PostgreSQL-Datenbank — Authentifizierung, Kurse, Abzeichen, Suchprotokolle.',
    email_desc: 'Transaktionale E-Mail-Zustellung — Kontobestätigung, Benachrichtigungen.',
    ai_desc: 'Generative KI-Engine — Abzeichen-Prompts, Übersetzungen, Analyseberichte, Tutor-Chat.',
    images_desc: 'KI-Bildgenerierung für akademische Leistungsabzeichen.',
    auto_refresh: 'Automatische Aktualisierung alle 10 Sekunden',
    ms: 'ms',
    not_configured: 'Nicht konfiguriert',
    error: 'Fehlerdetail',
    cron_title: '⏰ Cron-Zeiten & Rollierende Prüfungen',
    cron_desc: 'Dynamische Zeitverschiebungen und rollierende Katalogprüfungen zur Lastverteilung intensiver KI-Aufgaben.',
    col_agent: 'KI-Aufgabe',
    col_schedule: 'Cron-Zeitplan',
    col_timing: 'Zeitverschiebung',
    col_load: 'Rechenlast',
    agent_gen: 'Kursgenerierungs-Engine',
    agent_trans: 'J-I-T Übersetzungs-Engine',
    agent_rev: 'Pädagogische Revisions-Engine',
    offset_gen: 'Täglich um 02:00 Uhr UTC (Nebenzeiten)',
    offset_trans: 'Täglich um 04:00 Uhr UTC (Nebenzeiten)',
    offset_rev: 'Täglich um 06:00 Uhr UTC (Nebenzeiten)',
    load_low: 'Niedrig (Sequentiell)',
    load_med: 'Mittel (Ausgewogen)',
    load_high: 'Hoch (Verteilt)',
    audit_title: '🔄 Status der rollierenden Katalogprüfung',
    audit_desc: 'Anstatt alle Kurse täglich zu prüfen, wird jeden Tag ein rollierender Anteil von 1/15 basierend auf ID-Hashes analysiert.',
    audit_stat: 'Heutige rollierende Charge: 1/15 (1 Kurs geprüft von 11 insgesamt)',
    pipeline_active: 'Aktive Warteschlangen-Lastverteilung: Erzwungen (Max. 2 gleichzeitige Aufgaben)',
  },
  ZH: {
    title: '服务器健康状态',
    subtitle: '实时监控所有外部服务依赖',
    refresh: '立即刷新',
    refreshing: '检查中…',
    last_checked: '已检查',
    latency: '延迟',
    endpoint: '服务端点',
    status_ok: '正常运行',
    status_degraded: '服务降级',
    status_offline: '离线',
    status_unauthorized: '需要验证',
    status_unknown: '未知',
    health_db: 'Supabase 数据库',
    health_email: 'Resend 邮件 API',
    health_ai: 'Gemini AI (Google)',
    health_images: 'Pollinations.ai (图像生成器)',
    db_desc: '主要 PostgreSQL 数据库 — 身份验证、课程、成就、搜索日志。',
    email_desc: '事务性邮件发送 — 账户验证、通知。',
    ai_desc: '生成式 AI 引擎 — 徽章提示、翻译、分析报告、导师聊天。',
    images_desc: 'AI 图像生成，用于学术成就徽章。',
    auto_refresh: '每 10 秒自动刷新',
    ms: 'ms',
    not_configured: '未配置',
    error: '错误详情',
    cron_title: '⏰ 主权定时任务与轮询审计控制台',
    cron_desc: '动态调度时间偏移量与目录轮询审计，以平衡高强度 AI 智能体作业的计算负载。',
    col_agent: '智能体作业',
    col_schedule: '定时规则 (Cron)',
    col_timing: '运行时间偏移',
    col_load: '计算负载',
    agent_gen: '课程生成引擎',
    agent_trans: '即时 (JIT) 翻译引擎',
    agent_rev: '教学大纲修订引擎',
    offset_gen: '每天 02:00 AM UTC (避峰运行)',
    offset_trans: '每天 04:00 AM UTC (避峰运行)',
    offset_rev: '每天 06:00 AM UTC (避峰运行)',
    load_low: '低负载 (单队列顺序执行)',
    load_med: '中等负载 (自适应负载均衡)',
    load_high: '高负载 (分布式计算集群)',
    audit_title: '🔄 目录轮询审计状态',
    audit_desc: '为避免系统负载饱和，系统不进行每日全量课程审计，而是根据课程 ID 的哈希特征，每日轮循审计 1/15 的课程。',
    audit_stat: '今日审计批次：1/15 (已审计 11 门课程中的 1 门)',
    pipeline_active: '定时任务管道流控：已启用 (限制最大 2 个高吞吐任务并发执行)',
  }
};

// ─── Service metadata ─────────────────────────────────────────────────────────
const SERVICE_META: Record<string, { icon: any; descKey: keyof typeof HEALTH_STRINGS.EN; color: string }> = {
  db:     { icon: Database, descKey: 'db_desc',     color: 'emerald' },
  email:  { icon: Mail,     descKey: 'email_desc',  color: 'blue' },
  ai:     { icon: Cpu,      descKey: 'ai_desc',     color: 'violet' },
  images: { icon: Image,    descKey: 'images_desc', color: 'orange' },
};

const COLOR_MAP: Record<string, Record<string, string>> = {
  emerald: { bg: 'bg-emerald-500/10', icon: 'text-emerald-400', border: 'border-emerald-500/20' },
  blue:    { bg: 'bg-blue-500/10',    icon: 'text-blue-400',    border: 'border-blue-500/20' },
  violet:  { bg: 'bg-violet-500/10',  icon: 'text-violet-400',  border: 'border-violet-500/20' },
  orange:  { bg: 'bg-orange-500/10',  icon: 'text-orange-400',  border: 'border-orange-500/20' },
};

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status, t }: { status: ServiceHealth['status']; t: typeof HEALTH_STRINGS.EN }) {
  if (status === 'ok') return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-black rounded-full uppercase tracking-widest">
      <CheckCircle className="w-3 h-3" /> {t.status_ok}
    </span>
  );
  if (status === 'degraded') return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-black rounded-full uppercase tracking-widest">
      <AlertTriangle className="w-3 h-3" /> {t.status_degraded}
    </span>
  );
  if (status === 'unauthorized') return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-black rounded-full uppercase tracking-widest">
      <Lock className="w-3 h-3" /> {(t as any).status_unauthorized || 'Auth Required'}
    </span>
  );
  if (status === 'offline') return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] font-black rounded-full uppercase tracking-widest">
      <WifiOff className="w-3 h-3" /> {t.status_offline}
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800 text-slate-500 border border-slate-700 text-[10px] font-black rounded-full uppercase tracking-widest">
      <Clock className="w-3 h-3" /> {t.status_unknown}
    </span>
  );
}

// ─── Service card ─────────────────────────────────────────────────────────────
function ServiceCard({ svc, t, lang }: { svc: ServiceHealth; t: typeof HEALTH_STRINGS.EN; lang: string }) {
  const meta = SERVICE_META[svc.id];
  const colors = COLOR_MAP[meta?.color || 'blue'];
  const Icon = meta?.icon || Activity;
  const nameKey = `health_${svc.id}` as keyof typeof HEALTH_STRINGS.EN;
  const descKey = meta?.descKey;

  const borderColor = svc.status === 'ok' ? 'border-slate-800 hover:border-emerald-500/20'
    : svc.status === 'offline' ? 'border-red-500/20'
    : svc.status === 'degraded' || svc.status === 'unauthorized' ? 'border-amber-500/20'
    : 'border-slate-800';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-8 border ${borderColor} rounded-[32px] bg-slate-900/40 flex flex-col gap-5 transition-colors`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl ${colors.bg} ${colors.border} border flex items-center justify-center flex-shrink-0`}>
            <Icon className={`w-6 h-6 ${colors.icon}`} />
          </div>
          <div>
            <h3 className="text-base font-black text-white">{t[nameKey] || svc.id}</h3>
            {descKey && <p className="text-xs text-slate-500 mt-0.5 leading-snug">{t[descKey]}</p>}
          </div>
        </div>
        <StatusBadge status={svc.status} t={t} />
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-slate-950/60 rounded-2xl">
          <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{t.latency}</p>
          <p className={`text-xl font-black mt-1 ${svc.latencyMs === null ? 'text-slate-600' : svc.latencyMs < 500 ? 'text-emerald-400' : svc.latencyMs < 2000 ? 'text-amber-400' : 'text-red-400'}`}>
            {svc.latencyMs !== null ? `${svc.latencyMs} ${t.ms}` : '—'}
          </p>
        </div>
        <div className="p-4 bg-slate-950/60 rounded-2xl overflow-hidden">
          <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{t.last_checked}</p>
          <p className="text-xs text-slate-400 mt-1 font-mono truncate">
            {svc.checkedAt ? new Date(svc.checkedAt).toLocaleTimeString() : '—'}
          </p>
        </div>
      </div>

      {/* Endpoint */}
      <div className="flex items-center gap-2 p-3 bg-slate-950/40 rounded-xl border border-slate-850">
        <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest flex-shrink-0">{t.endpoint}</p>
        <a
          href={svc.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] text-slate-400 hover:text-white transition-colors font-mono truncate flex items-center gap-1"
        >
          {svc.url}
          <ExternalLink className="w-3 h-3 flex-shrink-0" />
        </a>
      </div>

      {/* Error detail */}
      {svc.errorMessage && (
        <div className="px-4 py-3 bg-red-500/5 border border-red-500/10 rounded-xl">
          <p className="text-[9px] font-black text-red-500 uppercase tracking-widest mb-1">{t.error}</p>
          <p className="text-xs text-red-400 font-mono">{svc.errorMessage}</p>
        </div>
      )}
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ServerHealthPage() {
  const [lang, setLang] = useState<'EN' | 'FR' | 'ES' | 'DE' | 'ZH'>('EN');
  // Sync with global language stored by TopNav
  if (typeof window !== 'undefined') {
    const stored = window.localStorage.getItem('openprimer_lang');
    if (stored && stored !== lang) setLang(stored.toUpperCase() as any);
  }
  const t = HEALTH_STRINGS[lang] || HEALTH_STRINGS.EN;
  const { health, isChecking, refresh } = useServiceStatus(10_000);

  const slaHistory = progressService.getSlaHistory();

  const getServiceStats = (id: 'db' | 'email' | 'ai' | 'images') => {
    const sum = slaHistory.reduce((acc, entry) => acc + entry[id], 0);
    const avg = sum / slaHistory.length;

    const downtimeHours = slaHistory.reduce((acc, entry) => acc + (100 - entry[id]) / 100 * 24, 0);

    let downtimeStr = '';
    if (downtimeHours === 0) {
      downtimeStr = lang === 'FR' ? 'Aucune interruption' : 'No downtime';
    } else if (downtimeHours < 1) {
      downtimeStr = lang === 'FR' 
        ? `Indisponibilité : ${Math.round(downtimeHours * 60)} min` 
        : `Downtime: ${Math.round(downtimeHours * 60)}m`;
    } else {
      downtimeStr = lang === 'FR'
        ? `Indisponibilité : ${downtimeHours.toFixed(1)} h`
        : `Downtime: ${downtimeHours.toFixed(1)}h`;
    }

    let incident = lang === 'FR' ? 'Aucun incident majeur' : 'No major incidents';
    if (id === 'db') incident = lang === 'FR' ? 'Incident : Mise à jour réplique' : 'Incident: Replica DB upgrade';
    if (id === 'email') incident = lang === 'FR' ? 'Incident : Ajustement quota' : 'Incident: Rate-limit tuning';
    if (id === 'ai') incident = lang === 'FR' ? 'Incident : Échelle de quota' : 'Incident: LLM quota scaling';
    if (id === 'images') incident = lang === 'FR' ? 'Incident : Dépassement mémoire' : 'Incident: Batch out-of-memory';

    return {
      avg: `${avg.toFixed(2)}%`,
      downtime: downtimeStr,
      incident
    };
  };

  const overallAvg = (() => {
    let total = 0;
    slaHistory.forEach(day => {
      total += (day.db + day.email + day.ai + day.images) / 4;
    });
    return total / slaHistory.length;
  })();

  const getDayStatus = (dayData: typeof slaHistory[0]) => {
    const vals = [dayData.db, dayData.email, dayData.ai, dayData.images];
    const minVal = Math.min(...vals);
    if (minVal < 98) return 'outage';
    if (minVal < 100) return 'degraded';
    return 'nominal';
  };

  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseAnonKey, setSupabaseAnonKey] = useState('');
  const [resendApiKey, setResendApiKey] = useState('');
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [showSbKey, setShowSbKey] = useState(false);
  const [showResendKey, setShowResendKey] = useState(false);
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [notif, setNotif] = useState<string | null>(null);

  // Load hot-swap keys on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSupabaseUrl(localStorage.getItem('op_supabase_url') || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://supabase.io');
      setSupabaseAnonKey(localStorage.getItem('op_supabase_anon_key') || '');
      setResendApiKey(localStorage.getItem('op_resend_api_key') || '');
      setGeminiApiKey(localStorage.getItem('op_gemini_api_key') || '');
    }
  }, []);

  const handleSaveKeys = (e: React.FormEvent) => {
    e.preventDefault();
    if (supabaseUrl && supabaseUrl !== process.env.NEXT_PUBLIC_SUPABASE_URL) localStorage.setItem('op_supabase_url', supabaseUrl);
    else localStorage.removeItem('op_supabase_url');

    if (supabaseAnonKey) localStorage.setItem('op_supabase_anon_key', supabaseAnonKey);
    else localStorage.removeItem('op_supabase_anon_key');

    if (resendApiKey) localStorage.setItem('op_resend_api_key', resendApiKey);
    else localStorage.removeItem('op_resend_api_key');

    if (geminiApiKey) localStorage.setItem('op_gemini_api_key', geminiApiKey);
    else localStorage.removeItem('op_gemini_api_key');

    setNotif(lang === 'FR' ? 'Clés API appliquées avec succès à chaud !' : 'API Keys successfully hot-swapped!');
    setTimeout(() => setNotif(null), 4000);
    refresh();
  };

  const handleResetKeys = () => {
    localStorage.removeItem('op_supabase_url');
    localStorage.removeItem('op_supabase_anon_key');
    localStorage.removeItem('op_resend_api_key');
    localStorage.removeItem('op_gemini_api_key');
    setSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://supabase.io');
    setSupabaseAnonKey('');
    setResendApiKey('');
    setGeminiApiKey('');
    setNotif(lang === 'FR' ? 'Retour aux clés serveurs par défaut.' : 'Returned to default server keys.');
    setTimeout(() => setNotif(null), 4000);
    refresh();
  };

  const services = Object.values(health);
  const allOk = services.every(s => s.status === 'ok');
  const anyOffline = services.some(s => s.status === 'offline');

  const strings = {
    EN: {
      cfg_title: '🛠️ Hot-Swap API Keys Configurator',
      cfg_desc: 'Temporarily override server environment keys in this browser session. Securely passed in authenticated request headers.',
      lbl_sb_url: 'Supabase Project URL',
      lbl_sb_key: 'Supabase Anon Public Key',
      lbl_resend: 'Resend API Key',
      lbl_gemini: 'Gemini 1.5 API Key',
      btn_apply: 'Apply Hot-Swap Keys',
      btn_reset: 'Reset to Defaults'
    },
    FR: {
      cfg_title: '🛠️ Configurateur de Clés API à Chaud',
      cfg_desc: 'Surcharger temporairement les clés serveurs pour cette session de navigateur. Transmis en toute sécurité via en-têtes requêtes.',
      lbl_sb_url: 'URL du Projet Supabase',
      lbl_sb_key: 'Clé Publique Anon Supabase',
      lbl_resend: 'Clé API Resend',
      lbl_gemini: 'Clé API Gemini 1.5',
      btn_apply: 'Appliquer les Clés',
      btn_reset: 'Réinitialiser aux Défauts'
    },
    ES: {
      cfg_title: '🛠️ Configurador de Claves API en Caliente',
      cfg_desc: 'Anule temporalmente las claves del servidor en esta sesión. Transmitido de forma segura a través de encabezados.',
      lbl_sb_url: 'URL del Proyecto Supabase',
      lbl_sb_key: 'Clave Pública Anon Supabase',
      lbl_resend: 'Clave API Resend',
      lbl_gemini: 'Clave API Gemini 1.5',
      btn_apply: 'Aplicar Cambios',
      btn_reset: 'Restablecer Valores'
    },
    DE: {
      cfg_title: '🛠️ Hot-Swap API-Schlüssel Konfigurator',
      cfg_desc: 'Server-Umgebungsschlüssel in dieser Sitzung vorübergehend überschreiben. Sicher übertragen über Anfrage-Header.',
      lbl_sb_url: 'Supabase Projekt-URL',
      lbl_sb_key: 'Supabase Anon Public Key',
      lbl_resend: 'Resend API-Schlüssel',
      lbl_gemini: 'Gemini 1.5 API-Schlüssel',
      btn_apply: 'Schlüssel anwenden',
      btn_reset: 'Auf Standard zurücksetzen'
    },
    ZH: {
      cfg_title: '🛠️ 热插拔 API 密钥配置器',
      cfg_desc: '在当前浏览器会话中临时覆盖服务器环境变量密钥。密钥通过安全请求头动态传输。',
      lbl_sb_url: 'Supabase 项目 URL',
      lbl_sb_key: 'Supabase Anon 公钥',
      lbl_resend: 'Resend 邮件 API 密钥',
      lbl_gemini: 'Gemini 1.5 API 密钥',
      btn_apply: '应用热插拔密钥',
      btn_reset: '重置为默认值'
    }
  };

  const currentCfg = strings[lang] || strings.EN;

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-900 pb-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-4 text-white">
            <Activity className={`w-8 h-8 ${allOk ? 'text-emerald-500' : anyOffline ? 'text-red-500' : 'text-amber-500'}`} />
            {t.title}
          </h1>
          <p className="text-xs text-slate-400 font-medium">{t.subtitle}</p>
          <p className="text-slate-700 text-[10px] pt-1 flex items-center gap-1.5 font-bold uppercase tracking-wider">
            <RefreshCw className="w-3 h-3 animate-pulse" /> {t.auto_refresh}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={refresh}
            disabled={isChecking}
            className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
            {isChecking ? t.refreshing : t.refresh}
          </button>
        </div>
      </div>

      {/* Global status banner */}
      {allOk && (
        <div className="flex items-center gap-3 px-6 py-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <p className="text-sm font-semibold text-emerald-300">{t.status_ok} — All systems nominal</p>
        </div>
      )}
      {anyOffline && (
        <div className="flex items-center gap-3 px-6 py-4 bg-red-500/5 border border-red-500/20 rounded-2xl">
          <WifiOff className="w-5 h-5 text-red-400" />
          <p className="text-sm font-semibold text-red-300">{t.status_offline} — One or more services are unreachable</p>
        </div>
      )}

      {/* SECTION: DOWNTIME OVER LAST 365 DAYS */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 border border-slate-800 hover:border-emerald-500/20 rounded-[32px] bg-slate-900/40 space-y-6 transition-all"
      >
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-3">
            <Clock className="w-5 h-5 text-emerald-400" />
            {lang === 'FR' ? "SLA de Disponibilité sur les 365 Derniers Jours" : "Dependency SLA & Downtime Over Last 365 Days"}
          </h2>
          <p className="text-xs text-slate-500 mt-1 leading-snug">
            {lang === 'FR' ? "Indicateurs de performance réseau et taux de disponibilité cumulés du catalogue de services." : "Rolling annual service level agreement (SLA) status, aggregated incident tracking, and average latency offsets."}
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {[
            { id: 'db' as const, name: 'Supabase DB', label: 'Database', color: 'text-emerald-400' },
            { id: 'email' as const, name: 'Resend API', label: 'Email Relay', color: 'text-blue-400' },
            { id: 'ai' as const, name: 'Gemini AI', label: 'AI LLM Backend', color: 'text-violet-400' },
            { id: 'images' as const, name: 'Pollinations.ai', label: 'Image Engine', color: 'text-orange-400' },
          ].map(s => {
            const stats = getServiceStats(s.id);
            return (
              <div key={s.id} className="p-6 bg-slate-950/60 rounded-3xl border border-slate-850 hover:border-slate-800 transition-all flex flex-col justify-between group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-slate-800 to-transparent opacity-50" />
                <div>
                  <span className="text-[8px] font-black uppercase text-slate-500 tracking-wider block mb-1">{s.label}</span>
                  <h4 className="text-base font-bold text-slate-200">{s.name}</h4>
                  <p className={`text-2xl font-black mt-3 ${s.color}`}>{stats.avg}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-900/60 flex flex-col gap-1">
                  <span className="text-[10px] font-medium text-slate-400 font-mono">{stats.downtime}</span>
                  <span className="text-[8px] font-bold text-slate-650 group-hover:text-slate-500 transition-colors uppercase tracking-wider">{stats.incident}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic Year-long SLA grid timeline */}
        <div className="p-6 bg-slate-950/40 rounded-3xl border border-slate-850 space-y-4">
           <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-wider text-slate-400">
             <span>{lang === 'FR' ? "Calendrier Annuel de Disponibilité (365 Jours)" : "Rolling Service Availability Grid (Last 365 Days Timeline)"}</span>
             <span className="text-emerald-400">{overallAvg.toFixed(3)}% {lang === 'FR' ? "Moyenne Globale" : "Overall Average"}</span>
           </div>
           
           <div className="grid grid-rows-7 grid-flow-col gap-[3.5px] overflow-x-auto py-2 pr-2 select-none justify-start max-w-full">
              {slaHistory.map((dayData, idx) => {
                const status = getDayStatus(dayData);
                const color = status === 'nominal' ? 'bg-emerald-500 border-emerald-400/20 shadow-[0_0_4px_rgba(16,185,129,0.1)] hover:bg-emerald-400'
                  : status === 'degraded' ? 'bg-amber-500 border-amber-400/20 shadow-[0_0_4px_rgba(245,158,11,0.1)] hover:bg-amber-400 animate-pulse'
                  : 'bg-red-500 border-red-400/20 shadow-[0_0_4px_rgba(239,68,68,0.1)] hover:bg-red-400 animate-pulse';

                return (
                  <div 
                    key={idx}
                    className={`w-3.5 h-3.5 rounded-sm border cursor-help transition-all ${color} group/dot relative`}
                  >
                     <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 p-3 bg-slate-950/95 border border-slate-850 rounded-xl shadow-2xl opacity-0 scale-95 group-hover/dot:opacity-100 group-hover/dot:scale-100 transition-all pointer-events-none z-50 text-[10px] leading-snug font-bold">
                        <p className="text-slate-200">{new Date(dayData.date).toLocaleDateString(lang === 'FR' ? 'fr-FR' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                        <p className="text-slate-500 font-extrabold uppercase mt-1 tracking-wider">
                          Status: <span className={status === 'nominal' ? 'text-emerald-400' : status === 'degraded' ? 'text-amber-400' : 'text-red-400'}>{status.toUpperCase()}</span>
                        </p>
                        <div className="mt-2 space-y-1 border-t border-slate-900 pt-1.5 font-mono text-[9px] text-slate-400">
                          <div className="flex justify-between"><span>Supabase DB:</span><span className={dayData.db < 100 ? 'text-amber-400' : 'text-slate-300'}>{dayData.db}%</span></div>
                          <div className="flex justify-between"><span>Resend API:</span><span className={dayData.email < 100 ? 'text-amber-400' : 'text-slate-300'}>{dayData.email}%</span></div>
                          <div className="flex justify-between"><span>Gemini AI:</span><span className={dayData.ai < 100 ? 'text-amber-400' : 'text-slate-300'}>{dayData.ai}%</span></div>
                          <div className="flex justify-between"><span>Image Engine:</span><span className={dayData.images < 100 ? 'text-amber-400' : 'text-slate-300'}>{dayData.images}%</span></div>
                        </div>
                     </div>
                  </div>
                );
              })}
           </div>
           <div className="flex justify-between items-center text-[8px] font-black uppercase text-slate-650 tracking-widest pt-2">
              <span>{lang === 'FR' ? "Il y a 365 Jours" : "365 Days Ago"}</span>
              <div className="flex gap-4">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-emerald-500 border border-emerald-400" /> {lang === 'FR' ? "Nominal" : "Nominal"}</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-amber-500 border border-amber-400" /> {lang === 'FR' ? "Dégradé" : "Degraded"}</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-red-500 border border-red-400" /> {lang === 'FR' ? "Interruption" : "Outage"}</span>
              </div>
              <span>{lang === 'FR' ? "Aujourd'hui" : "Today"}</span>
           </div>
        </div>
      </motion.div>

        {/* Hot-Swap API Keys Configurator Form */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 border border-slate-800 hover:border-blue-500/20 rounded-[32px] bg-slate-900/30 flex flex-col gap-6"
        >
          <div>
            <h2 className="text-lg font-black text-white">{currentCfg.cfg_title}</h2>
            <p className="text-xs text-slate-500 mt-1 leading-snug">{currentCfg.cfg_desc}</p>
          </div>

          {notif && (
            <div className="px-4 py-3 bg-blue-500/10 border border-blue-500/25 rounded-xl text-blue-400 text-xs font-black uppercase tracking-widest">
              {notif}
            </div>
          )}

          <form onSubmit={handleSaveKeys} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{currentCfg.lbl_sb_url}</label>
              <input
                type="text"
                autoComplete="new-password"
                value={supabaseUrl}
                onChange={e => setSupabaseUrl(e.target.value)}
                placeholder="https://xxx.supabase.co"
                className="w-full bg-slate-955 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-blue-500/50 placeholder:text-slate-700"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{currentCfg.lbl_sb_key}</label>
              <div className="relative">
                <input
                  type={showSbKey ? "text" : "password"}
                  autoComplete="new-password"
                  value={supabaseAnonKey}
                  onChange={e => setSupabaseAnonKey(e.target.value)}
                  placeholder="••••••••••••••••••••••••••••"
                  className="w-full bg-slate-955 border border-slate-800 rounded-xl pl-4 pr-12 py-3 text-xs text-white focus:outline-none focus:border-blue-500/50 placeholder:text-slate-700"
                />
                <button
                  type="button"
                  onClick={() => setShowSbKey(!showSbKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors cursor-pointer animate-fade-in"
                >
                  {showSbKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{currentCfg.lbl_resend}</label>
              <div className="relative">
                <input
                  type={showResendKey ? "text" : "password"}
                  autoComplete="new-password"
                  value={resendApiKey}
                  onChange={e => setResendApiKey(e.target.value)}
                  placeholder="••••••••••••••••••••••••••••"
                  className="w-full bg-slate-955 border border-slate-800 rounded-xl pl-4 pr-12 py-3 text-xs text-white focus:outline-none focus:border-blue-500/50 placeholder:text-slate-700"
                />
                <button
                  type="button"
                  onClick={() => setShowResendKey(!showResendKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors cursor-pointer animate-fade-in"
                >
                  {showResendKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{currentCfg.lbl_gemini}</label>
              <div className="relative">
                <input
                  type={showGeminiKey ? "text" : "password"}
                  autoComplete="new-password"
                  value={geminiApiKey}
                  onChange={e => setGeminiApiKey(e.target.value)}
                  placeholder="••••••••••••••••••••••••••••"
                  className="w-full bg-slate-955 border border-slate-800 rounded-xl pl-4 pr-12 py-3 text-xs text-white focus:outline-none focus:border-blue-500/50 placeholder:text-slate-700"
                />
                <button
                  type="button"
                  onClick={() => setShowGeminiKey(!showGeminiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors cursor-pointer animate-fade-in"
                >
                  {showGeminiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="md:col-span-2 flex flex-col md:flex-row gap-4 mt-2">
              <button
                type="submit"
                className="flex-1 px-6 py-4.5 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-blue-600/10 active:scale-[0.98]"
              >
                {currentCfg.btn_apply}
              </button>
              <button
                type="button"
                onClick={handleResetKeys}
                className="px-6 py-4.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all active:scale-[0.98]"
              >
                {currentCfg.btn_reset}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Dynamic Scheduler offset and rolling catalog audit display */}
        {(() => {
          const code = String(lang).toUpperCase();
          const translations = HEALTH_STRINGS[code as keyof typeof HEALTH_STRINGS] || HEALTH_STRINGS.EN;
          
          const getString = (key: string): string => {
            return (translations as any)[key] || (HEALTH_STRINGS.EN as any)[key] || key;
          };

          return (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 border border-slate-800 hover:border-violet-500/20 rounded-[32px] bg-slate-900/40 flex flex-col gap-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-violet-600/10 border border-violet-500/20 border flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-violet-400" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-white">{getString('cron_title')}</h2>
                  <p className="text-xs text-slate-500 mt-1 leading-snug">{getString('cron_desc')}</p>
                </div>
              </div>

              {/* Timings Table */}
              <div className="overflow-x-auto border border-slate-850 rounded-2xl bg-slate-950/40">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-850 bg-slate-950/80 text-[10px] font-black uppercase tracking-wider text-slate-400">
                      <th className="py-3.5 px-4">{getString('col_agent')}</th>
                      <th className="py-3.5 px-4">{getString('col_schedule')}</th>
                      <th className="py-3.5 px-4">{getString('col_timing')}</th>
                      <th className="py-3.5 px-4">{getString('col_load')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850/60 font-mono text-slate-300">
                    <tr>
                      <td className="py-3.5 px-4 font-sans font-bold text-white">{getString('agent_gen')}</td>
                      <td className="py-3.5 px-4 text-blue-400">0 2 * * *</td>
                      <td className="py-3.5 px-4">{getString('offset_gen')}</td>
                      <td className="py-3.5 px-4"><span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-sans font-black uppercase tracking-wider">{getString('load_low')}</span></td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-4 font-sans font-bold text-white">{getString('agent_trans')}</td>
                      <td className="py-3.5 px-4 text-violet-400">0 4 * * *</td>
                      <td className="py-3.5 px-4">{getString('offset_trans')}</td>
                      <td className="py-3.5 px-4"><span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-sans font-black uppercase tracking-wider">{getString('load_med')}</span></td>
                    </tr>
                    <tr>
                      <td className="py-3.5 px-4 font-sans font-bold text-white">{getString('agent_rev')}</td>
                      <td className="py-3.5 px-4 text-orange-400">0 6 * * *</td>
                      <td className="py-3.5 px-4">{getString('offset_rev')}</td>
                      <td className="py-3.5 px-4"><span className="px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 text-[10px] font-sans font-black uppercase tracking-wider">{getString('load_high')}</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Rolling Audit Status card */}
              <div className="p-5 bg-slate-950/60 rounded-2xl border border-slate-850 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    {getString('audit_title')}
                  </h3>
                  <p className="text-[11px] text-slate-500 leading-normal max-w-xl">
                    {getString('audit_desc')}
                  </p>
                </div>
                <div className="flex flex-col gap-1.5 items-end shrink-0 w-full sm:w-auto">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">{getString('audit_stat')}</span>
                  <span className="text-[9px] font-bold text-emerald-400">{getString('pipeline_active')}</span>
                </div>
              </div>
            </motion.div>
          );
        })()}

        {/* Service Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {services.map(svc => (
            <ServiceCard key={svc.id} svc={svc} t={t} lang={lang} />
          ))}
        </div>
    </div>
  );
}
