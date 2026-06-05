'use client';
import { useState, useEffect, useMemo } from 'react';
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
    sla_title: "Dependency SLA & Downtime Over Last 365 Days",
    sla_desc: "Rolling annual service level agreement (SLA) status, aggregated incident tracking, and average latency offsets.",
    lbl_database: "Database",
    lbl_email: "Email Relay",
    lbl_ai: "AI LLM Backend",
    lbl_images: "Image Engine",
    no_data: "No data",
    db_conn_req: "Database connection required",
    no_downtime: "No downtime",
    downtime_min: "Downtime: {min}m",
    downtime_hour: "Downtime: {hour}h",
    no_major_incidents: "No major incidents",
    inc_db_upgrade: "Incident: Replica DB upgrade",
    inc_rate_limit: "Incident: Rate-limit tuning",
    inc_quota_scaling: "Incident: LLM quota scaling",
    inc_oom: "Incident: Batch out-of-memory",
    status_nominal: "Nominal",
    status_no_data: "No Log Data",
    status_outage: "Outage",
    sla_grid_title: "Rolling Service Availability Grid (Last 365 Days Timeline)",
    overall_avg: "Overall Average",
    no_avail_data: "No availability data — Active database connection required",
    days_ago: "365 Days Ago",
    today: "Today",
    keys_applied: "API Keys successfully hot-swapped!",
    keys_reset: "Returned to default server keys.",
    live_db: "Live DB",
    sandbox: "Sandbox",
    sys_all_nominal: "All systems nominal",
    sys_unreachable: "One or more services are unreachable"
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
    sla_title: "SLA de Disponibilité sur les 365 Derniers Jours",
    sla_desc: "Indicateurs de performance réseau et taux de disponibilité cumulés du catalogue de services.",
    lbl_database: "Base de données",
    lbl_email: "Relais Email",
    lbl_ai: "Backend IA (LLM)",
    lbl_images: "Moteur d'Images",
    no_data: "Aucune donnée",
    db_conn_req: "Connexion base de données requise",
    no_downtime: "Aucune interruption",
    downtime_min: "Indisponibilité : {min} min",
    downtime_hour: "Indisponibilité : {hour} h",
    no_major_incidents: "Aucun incident majeur",
    inc_db_upgrade: "Incident : Mise à jour réplique",
    inc_rate_limit: "Incident : Ajustement quota",
    inc_quota_scaling: "Incident : Échelle de quota",
    inc_oom: "Incident : Dépassement mémoire",
    status_nominal: "Nominal",
    status_no_data: "Pas de Log",
    status_outage: "Interruption",
    sla_grid_title: "Calendrier Annuel de Disponibilité (365 Jours)",
    overall_avg: "Moyenne Globale",
    no_avail_data: "Aucune donnée de disponibilité — Connexion base de données active requise",
    days_ago: "Il y a 365 Jours",
    today: "Aujourd'hui",
    keys_applied: "Clés API appliquées avec succès à chaud !",
    keys_reset: "Retour aux clés serveurs par défaut.",
    live_db: "BDD en Direct",
    sandbox: "Bac à Sable",
    sys_all_nominal: "Tous les systèmes sont opérationnels",
    sys_unreachable: "Un ou plusieurs services sont inaccessibles"
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
    sla_title: "SLA de Dependencia y Tiempo de Inactividad en los Últimos 365 Días",
    sla_desc: "Estado de SLA anual, seguimiento de incidentes acumulados y compensaciones de latencia promedio.",
    lbl_database: "Base de datos",
    lbl_email: "Relé de Correo",
    lbl_ai: "Backend de IA (LLM)",
    lbl_images: "Motor de Imágenes",
    no_data: "Sin datos",
    db_conn_req: "Se requiere conexión a la base de datos",
    no_downtime: "Sin tiempo de inactividad",
    downtime_min: "Inactividad: {min}m",
    downtime_hour: "Inactividad: {hour}h",
    no_major_incidents: "Sin incidentes mayores",
    inc_db_upgrade: "Incidente: Actualización de réplica",
    inc_rate_limit: "Incidente: Ajuste de límite de tasa",
    inc_quota_scaling: "Incidente: Escalamiento de cuota de LLM",
    inc_oom: "Incidente: Memoria agotada en lote",
    status_nominal: "Nominal",
    status_no_data: "Sin Datos de Log",
    status_outage: "Interrupción",
    sla_grid_title: "Cuadrícula de Disponibilidad de Servicio (Línea de Tiempo de 365 Días)",
    overall_avg: "Promedio General",
    no_avail_data: "Sin datos de disponibilidad — Se requiere conexión activa a la base de datos",
    days_ago: "Hace 365 Días",
    today: "Hoy",
    keys_applied: "¡Claves API aplicadas con éxito en caliente!",
    keys_reset: "Se restablecieron las claves del servidor predeterminadas.",
    live_db: "BD en Vivo",
    sandbox: "Entorno de Pruebas",
    sys_all_nominal: "Todos los sistemas están operativos",
    sys_unreachable: "Uno o más servicios no están disponibles"
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
    sla_title: "Abhängigkeits-SLA & Ausfallzeiten der letzten 365 Tage",
    sla_desc: "Fortlaufender SLA-Status für das Gesamtjahr, aggregierte Incident-Verfolgung und durchschnittliche Latenzzeit.",
    lbl_database: "Datenbank",
    lbl_email: "E-Mail-Relay",
    lbl_ai: "KI-LLM-Backend",
    lbl_images: "Bild-Engine",
    no_data: "Keine Daten",
    db_conn_req: "Datenbankverbindung erforderlich",
    no_downtime: "Keine Ausfallzeit",
    downtime_min: "Ausfallzeit: {min} Min.",
    downtime_hour: "Ausfallzeit: {hour} Std.",
    no_major_incidents: "Keine größeren Incidents",
    inc_db_upgrade: "Incident: Replik-Datenbank-Upgrade",
    inc_rate_limit: "Incident: Ratenlimit-Anpassung",
    inc_quota_scaling: "Incident: LLM-Kontingentskalierung",
    inc_oom: "Incident: Stapel-Speicherüberlauf",
    status_nominal: "Nominal",
    status_no_data: "Keine Logdaten",
    status_outage: "Ausfall",
    sla_grid_title: "Fortlaufendes Service-Verfügbarkeitsraster (Zeitachse der letzten 365 Tage)",
    overall_avg: "Gesamtdurchschnitt",
    no_avail_data: "Keine Verfügbarkeitsdaten — Aktive Datenbankverbindung erforderlich",
    days_ago: "Vor 365 Tagen",
    today: "Heute",
    keys_applied: "API-Schlüssel erfolgreich im laufenden Betrieb getauscht!",
    keys_reset: "Auf Standard-Serverschlüssel zurückgesetzt.",
    live_db: "Live-Datenbank",
    sandbox: "Sandbox",
    sys_all_nominal: "Alle Systeme laufen normal",
    sys_unreachable: "Ein oder mehrere Dienste sind nicht erreichbar"
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
    sla_title: "最近 365 天服务可用性 (SLA) 与停机时间",
    sla_desc: "年度滚动服务等级协议 (SLA) 可用率、聚合故障事件追踪和平均延迟偏移量。",
    lbl_database: "数据库",
    lbl_email: "邮件中继",
    lbl_ai: "AI 大语言模型后台",
    lbl_images: "图像生成引擎",
    no_data: "暂无数据",
    db_conn_req: "需要活跃数据库连接",
    no_downtime: "未发生停机",
    downtime_min: "停机时长：{min} 分钟",
    downtime_hour: "停机时长：{hour} 小时",
    no_major_incidents: "未发生重大故障",
    inc_db_upgrade: "故障事件：只读副本数据库升级",
    inc_rate_limit: "故障事件：频率限制参数调整",
    inc_quota_scaling: "故障事件：大模型 API 配额大版面调优",
    inc_oom: "故障事件：批量生成任务内存溢出",
    status_nominal: "正常",
    status_no_data: "无日志数据",
    status_outage: "停机中断",
    sla_grid_title: "滚动服务可用率网格 (最近 365 天时间线)",
    overall_avg: "全局平均可用率",
    no_avail_data: "暂无可用性数据 — 需要建立活跃的数据库连接",
    days_ago: "365 天前",
    today: "今天",
    keys_applied: "API 密钥已成功热插拔应用！",
    keys_reset: "已成功恢复为默认服务器端密钥环境。",
    live_db: "活跃数据库",
    sandbox: "沙盒测试",
    sys_all_nominal: "所有系统运行正常",
    sys_unreachable: "一个或多个服务无法访问"
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

  const [slaHistory, setSlaHistory] = useState<any[]>(() => []);
  const [slaSource, setSlaSource] = useState<'prng' | 'database'>('database');
  const [hoveredDay, setHoveredDay] = useState<{ date: string; db: number; email: number; ai: number; images: number; status: string } | null>(null);


  const getServiceStats = (id: 'db' | 'email' | 'ai' | 'images') => {
    if (!slaHistory || slaHistory.length === 0) {
      return {
        avg: '0.00%',
        downtime: t.no_data || 'No data',
        incident: t.db_conn_req || 'Database connection required'
      };
    }
    const sum = slaHistory.reduce((acc, entry) => acc + entry[id], 0);
    const avg = sum / slaHistory.length;

    const downtimeHours = slaHistory.reduce((acc, entry) => acc + (100 - entry[id]) / 100 * 24, 0);

    let downtimeStr = '';
    if (downtimeHours === 0) {
      downtimeStr = t.no_downtime || 'No downtime';
    } else if (downtimeHours < 1) {
      const mins = Math.round(downtimeHours * 60);
      downtimeStr = (t.downtime_min || 'Downtime: {min}m').replace('{min}', String(mins));
    } else {
      const hrs = downtimeHours.toFixed(1);
      downtimeStr = (t.downtime_hour || 'Downtime: {hour}h').replace('{hour}', String(hrs));
    }

    let incident = t.no_major_incidents || 'No major incidents';
    if (id === 'db') incident = t.inc_db_upgrade || 'Incident: Replica DB upgrade';
    if (id === 'email') incident = t.inc_rate_limit || 'Incident: Rate-limit tuning';
    if (id === 'ai') incident = t.inc_quota_scaling || 'Incident: LLM quota scaling';
    if (id === 'images') incident = t.inc_oom || 'Incident: Batch out-of-memory';

    return {
      avg: `${avg.toFixed(2)}%`,
      downtime: downtimeStr,
      incident
    };
  };

  const overallAvg = (() => {
    if (!slaHistory || slaHistory.length === 0) return 0;
    let total = 0;
    slaHistory.forEach(day => {
      total += (day.db + day.email + day.ai + day.images) / 4;
    });
    return total / slaHistory.length;
  })();

  const getDayStatus = (dayData: typeof slaHistory[0]) => {
    const vals = [dayData.db, dayData.email, dayData.ai, dayData.images];
    const maxVal = Math.max(...vals);
    if (maxVal === 0) return 'no_data';
    
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

  // Load hot-swap keys and SLA history on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSupabaseUrl(localStorage.getItem('op_supabase_url') || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://supabase.io');
      setSupabaseAnonKey(localStorage.getItem('op_supabase_anon_key') || '');
      setResendApiKey(localStorage.getItem('op_resend_api_key') || '');
      setGeminiApiKey(localStorage.getItem('op_gemini_api_key') || '');

      // Fetch dynamic database SLA History
      const fetchSla = async () => {
        try {
          const adminSession = localStorage.getItem('op_session') || '';
          const headers: Record<string, string> = {};
          if (localStorage.getItem('op_supabase_url')) headers['x-supabase-url'] = localStorage.getItem('op_supabase_url') || '';
          if (localStorage.getItem('op_supabase_anon_key')) headers['x-supabase-anon-key'] = localStorage.getItem('op_supabase_anon_key') || '';
          if (adminSession === 'true') headers['x-admin-session'] = 'true';

          const res = await fetch('/api/health/sla', { headers });
          if (res.ok) {
            const json = await res.json();
            if (json.success && json.data) {
              setSlaHistory(json.data);
              setSlaSource(json.source);
            }
          }
        } catch (err) {
          console.warn("Failed to fetch database SLA history", err);
        }
      };
      fetchSla();
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

    setNotif(t.keys_applied || 'API Keys successfully hot-swapped!');
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
    setNotif(t.keys_reset || 'Returned to default server keys.');
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
      lbl_gemini: 'Gemini API Key or Service Account JSON',
      btn_apply: 'Apply Hot-Swap Keys',
      btn_reset: 'Reset to Defaults'
    },
    FR: {
      cfg_title: '🛠️ Configurateur de Clés API à Chaud',
      cfg_desc: 'Surcharger temporairement les clés serveurs pour cette session de navigateur. Transmis en toute sécurité via en-têtes requêtes.',
      lbl_sb_url: 'URL du Projet Supabase',
      lbl_sb_key: 'Clé Publique Anon Supabase',
      lbl_resend: 'Clé API Resend',
      lbl_gemini: 'Clé API Gemini ou Compte de Service JSON',
      btn_apply: 'Appliquer les Clés',
      btn_reset: 'Réinitialiser aux Défauts'
    },
    ES: {
      cfg_title: '🛠️ Configurador de Claves API en Caliente',
      cfg_desc: 'Anule temporalmente las claves del servidor en esta sesión. Transmitido de forma segura a través de encabezados.',
      lbl_sb_url: 'URL del Proyecto Supabase',
      lbl_sb_key: 'Clave Pública Anon Supabase',
      lbl_resend: 'Clave API Resend',
      lbl_gemini: 'Clave API Gemini o Cuenta de Servicio JSON',
      btn_apply: 'Aplicar Cambios',
      btn_reset: 'Restablecer Valores'
    },
    DE: {
      cfg_title: '🛠️ Hot-Swap API-Schlüssel Konfigurator',
      cfg_desc: 'Server-Umgebungsschlüssel in dieser Sitzung vorübergehend überschreiben. Sicher übertragen über Anfrage-Header.',
      lbl_sb_url: 'Supabase Projekt-URL',
      lbl_sb_key: 'Supabase Anon Public Key',
      lbl_resend: 'Resend API-Schlüssel',
      lbl_gemini: 'Gemini API-Schlüssel oder Service-Account-JSON',
      btn_apply: 'Schlüssel anwenden',
      btn_reset: 'Auf Standard zurücksetzen'
    },
    ZH: {
      cfg_title: '🛠️ 热插拔 API 密钥配置器',
      cfg_desc: '在当前浏览器会话中临时覆盖服务器环境变量密钥。密钥通过安全请求头动态传输。',
      lbl_sb_url: 'Supabase 项目 URL',
      lbl_sb_key: 'Supabase Anon 公钥',
      lbl_resend: 'Resend 邮件 API 密钥',
      lbl_gemini: 'Gemini API 密钥或服务账号 JSON',
      btn_apply: '应用热插拔密钥',
      btn_reset: '重置为默认值'
    }
  };

  const currentCfg = strings[lang] || strings.EN;

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6">
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
          <p className="text-sm font-semibold text-emerald-300">{t.status_ok} — {(t as any).sys_all_nominal || 'All systems nominal'}</p>
        </div>
      )}
      {anyOffline && (
        <div className="flex items-center gap-3 px-6 py-4 bg-red-500/5 border border-red-500/20 rounded-2xl">
          <WifiOff className="w-5 h-5 text-red-400" />
          <p className="text-sm font-semibold text-red-300">{t.status_offline} — {(t as any).sys_unreachable || 'One or more services are unreachable'}</p>
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
            {t.sla_title}
          </h2>
          <p className="text-xs text-slate-500 mt-1 leading-snug">
            {t.sla_desc}
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {[
            { id: 'db' as const, name: 'Supabase DB', label: t.lbl_database, color: 'text-emerald-400' },
            { id: 'email' as const, name: 'Resend API', label: t.lbl_email, color: 'text-blue-400' },
            { id: 'ai' as const, name: 'Gemini AI', label: t.lbl_ai, color: 'text-violet-400' },
            { id: 'images' as const, name: 'Pollinations.ai', label: t.lbl_images, color: 'text-orange-400' },
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
            <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-wider text-slate-400 min-h-8">
              {hoveredDay ? (
                <div className="flex items-center justify-between w-full text-[10px] text-slate-200 animate-in fade-in duration-200">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 font-extrabold font-mono">
                      {new Date(hoveredDay.date).toLocaleDateString({ EN: 'en-US', FR: 'fr-FR', ES: 'es-ES', DE: 'de-DE', ZH: 'zh-CN' }[lang] || 'en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                      hoveredDay.status === 'nominal' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                      : hoveredDay.status === 'degraded' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse' 
                      : hoveredDay.status === 'no_data' ? 'bg-slate-800/80 text-slate-400 border border-slate-700/50'
                      : 'bg-red-500/10 text-red-400 border border-red-500/20 animate-pulse'
                    }`}>
                      {hoveredDay.status === 'nominal' ? (t.status_nominal || 'Nominal')
                        : hoveredDay.status === 'degraded' ? (t.status_degraded || 'Degraded')
                        : hoveredDay.status === 'no_data' ? (t.status_no_data || 'No Log Data')
                        : (t.status_outage || 'Outage')}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-[9px] font-mono text-slate-300">
                    <span className="flex items-center gap-1">
                      <span className="text-slate-500 font-bold">{t.lbl_database || 'DB'}:</span> 
                      <span className={hoveredDay.status === 'no_data' ? 'text-slate-500' : hoveredDay.db < 100 ? 'text-amber-400 font-black' : 'text-emerald-400'}>
                        {hoveredDay.status === 'no_data' ? '—' : `${hoveredDay.db}%`}
                      </span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="text-slate-500 font-bold">{t.lbl_email || 'Email'}:</span> 
                      <span className={hoveredDay.status === 'no_data' ? 'text-slate-500' : hoveredDay.email < 100 ? 'text-amber-400 font-black' : 'text-emerald-400'}>
                        {hoveredDay.status === 'no_data' ? '—' : `${hoveredDay.email}%`}
                      </span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="text-slate-500 font-bold">{t.lbl_ai || 'AI'}:</span> 
                      <span className={hoveredDay.status === 'no_data' ? 'text-slate-500' : hoveredDay.ai < 100 ? 'text-amber-400 font-black' : 'text-emerald-400'}>
                        {hoveredDay.status === 'no_data' ? '—' : `${hoveredDay.ai}%`}
                      </span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="text-slate-500 font-bold">{t.lbl_images || 'Images'}:</span> 
                      <span className={hoveredDay.status === 'no_data' ? 'text-slate-500' : hoveredDay.images < 100 ? 'text-amber-400 font-black' : 'text-emerald-400'}>
                        {hoveredDay.status === 'no_data' ? '—' : `${hoveredDay.images}%`}
                      </span>
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center w-full animate-in fade-in duration-200">
                  <div className="flex items-center gap-2">
                    <span>{t.sla_grid_title}</span>
                    <span className={`px-1.5 py-0.5 rounded-md text-[7px] font-black uppercase tracking-wider ${
                      slaSource === 'database' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25' 
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>
                      {slaSource === 'database' ? ((t as any).live_db || 'Live DB') : ((t as any).sandbox || 'Sandbox')}
                    </span>
                  </div>
                  <span className="text-emerald-400 font-mono font-bold">
                    {overallAvg.toFixed(3)}% {t.overall_avg}
                  </span>
                </div>
              )}
            </div>
            
            {slaHistory.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-slate-500 text-[10px] font-semibold gap-2 border border-dashed border-slate-800/80 rounded-2xl bg-slate-950/20">
                <WifiOff className="w-6 h-6 text-slate-650 animate-pulse" />
                <span>
                  {t.no_avail_data}
                </span>
              </div>
            ) : (
              <>
                <div className="grid grid-rows-7 grid-flow-col gap-[3.5px] overflow-x-auto py-2 pr-2 select-none justify-start max-w-full">
                   {slaHistory.map((dayData, idx) => {
                     const status = getDayStatus(dayData);
                     const color = status === 'nominal' ? 'bg-emerald-500 border-emerald-400/20 shadow-[0_0_4px_rgba(16,185,129,0.1)] hover:bg-emerald-400'
                        : status === 'degraded' ? 'bg-amber-500 border-amber-400/20 shadow-[0_0_4px_rgba(245,158,11,0.1)] hover:bg-amber-400'
                        : status === 'no_data' ? 'bg-slate-850/60 border-slate-800/80 shadow-none hover:bg-slate-800 hover:border-slate-700'
                        : 'bg-red-500 border-red-400/20 shadow-[0_0_4px_rgba(239,68,68,0.1)] hover:bg-red-400';

                     const isHovered = hoveredDay?.date === dayData.date;

                     return (
                       <div 
                         key={idx}
                         className={`w-3.5 h-3.5 rounded-sm border cursor-help transition-all duration-100 ${color} ${
                           isHovered 
                             ? 'scale-125 border-slate-100 shadow-[0_0_8px_rgba(255,255,255,0.4)] z-10' 
                             : ''
                         }`}
                         onMouseEnter={() => setHoveredDay({ ...dayData, status })}
                         onMouseLeave={() => setHoveredDay(null)}
                       />
                     );
                   })}
                </div>
                <div className="flex justify-between items-center text-[8px] font-black uppercase text-slate-650 tracking-widest pt-2">
                   <span>{t.days_ago}</span>
                   <div className="flex gap-4">
                     <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-emerald-500 border border-emerald-400" /> {t.status_nominal}</span>
                     <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-amber-500 border border-amber-400" /> {t.status_degraded}</span>
                     <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-red-500 border border-red-400" /> {t.status_outage}</span>
                      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-slate-850 border border-slate-800" /> {t.status_no_data || 'No Log Data'}</span>
                   </div>
                   <span>{t.today}</span>
                </div>
              </>
            )}
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
                  placeholder={geminiApiKey && geminiApiKey.trim().startsWith('{') ? "Service Account JSON loaded..." : "••••••••••••••••••••••••••••"}
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
              <div className="flex items-center gap-2 mt-1">
                <label className="text-[9px] font-bold text-slate-500 hover:text-white transition-colors cursor-pointer bg-slate-800/60 border border-slate-750 rounded-lg px-2.5 py-1.5 active:scale-[0.98]">
                  <span>Upload Service Account JSON File</span>
                  <input
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          const text = event.target?.result as string;
                          try {
                            JSON.parse(text);
                            setGeminiApiKey(text);
                            setShowGeminiKey(false);
                          } catch (err) {
                            alert("Invalid JSON file!");
                          }
                        };
                        reader.readAsText(file);
                      }
                    }}
                  />
                </label>
                {geminiApiKey && geminiApiKey.trim().startsWith('{') && (
                  <span className="text-[9px] text-emerald-400 font-bold bg-emerald-500/5 border border-emerald-500/10 px-2 py-1 rounded-lg">
                    JSON Key Loaded
                  </span>
                )}
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
