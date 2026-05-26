'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Activity, Database, Mail, Cpu, Image, RefreshCw,
  CheckCircle, AlertTriangle, WifiOff, ExternalLink, Clock
} from 'lucide-react';
import { TopNav } from '../../../components/RefinedUI';
import { useServiceStatus, ServiceHealth } from '../../../lib/serviceStatus';

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
    status_unknown: 'Unknown',
    health_db: 'Supabase Database',
    health_email: 'Resend Email API',
    health_ai: 'Gemini AI (Google)',
    health_images: 'Pollinations.ai (Image Generator)',
    db_desc: 'Primary PostgreSQL database — authentication, courses, achievements, search logs.',
    email_desc: 'Transactional email delivery — account verification, notifications.',
    ai_desc: 'Generative AI backbone — badge prompts, translations, analytics reports, tutor chat.',
    images_desc: 'AI image generation for academic achievement badges.',
    auto_refresh: 'Auto-refreshes every 30 seconds',
    ms: 'ms',
    not_configured: 'Not configured',
    error: 'Error detail',
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
    status_unknown: 'Inconnu',
    health_db: 'Base de données Supabase',
    health_email: 'API Email Resend',
    health_ai: 'Gemini IA (Google)',
    health_images: 'Pollinations.ai (Génération d\'Images)',
    db_desc: 'Base de données PostgreSQL principale — authentification, cours, badges, journaux de recherche.',
    email_desc: 'Envoi d\'emails transactionnels — vérification de compte, notifications.',
    ai_desc: 'Moteur IA génératif — prompts de badges, traductions, rapports analytiques, chat tuteur.',
    images_desc: 'Génération d\'images IA pour les badges d\'accomplissement académique.',
    auto_refresh: 'Actualisation automatique toutes les 30 secondes',
    ms: 'ms',
    not_configured: 'Non configuré',
    error: 'Détail de l\'erreur',
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
    status_unknown: 'Desconocido',
    health_db: 'Base de datos Supabase',
    health_email: 'API de Email Resend',
    health_ai: 'Gemini IA (Google)',
    health_images: 'Pollinations.ai (Generador de Imágenes)',
    db_desc: 'Base de datos PostgreSQL principal — autenticación, cursos, logros, registros de búsqueda.',
    email_desc: 'Entrega de correos transaccionales — verificación de cuenta, notificaciones.',
    ai_desc: 'Motor de IA generativa — prompts de insignias, traducciones, informes analíticos, chat de tutor.',
    images_desc: 'Generación de imágenes IA para insignias de logros académicos.',
    auto_refresh: 'Actualización automática cada 30 segundos',
    ms: 'ms',
    not_configured: 'No configurado',
    error: 'Detalle del error',
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
    status_unknown: 'Unbekannt',
    health_db: 'Supabase Datenbank',
    health_email: 'Resend E-Mail API',
    health_ai: 'Gemini KI (Google)',
    health_images: 'Pollinations.ai (Bildgenerator)',
    db_desc: 'Primäre PostgreSQL-Datenbank — Authentifizierung, Kurse, Abzeichen, Suchprotokolle.',
    email_desc: 'Transaktionale E-Mail-Zustellung — Kontobestätigung, Benachrichtigungen.',
    ai_desc: 'Generative KI-Engine — Abzeichen-Prompts, Übersetzungen, Analyseberichte, Tutor-Chat.',
    images_desc: 'KI-Bildgenerierung für akademische Leistungsabzeichen.',
    auto_refresh: 'Automatische Aktualisierung alle 30 Sekunden',
    ms: 'ms',
    not_configured: 'Nicht konfiguriert',
    error: 'Fehlerdetail',
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
    status_unknown: '未知',
    health_db: 'Supabase 数据库',
    health_email: 'Resend 邮件 API',
    health_ai: 'Gemini AI (Google)',
    health_images: 'Pollinations.ai (图像生成器)',
    db_desc: '主要 PostgreSQL 数据库 — 身份验证、课程、成就、搜索日志。',
    email_desc: '事务性邮件发送 — 账户验证、通知。',
    ai_desc: '生成式 AI 引擎 — 徽章提示、翻译、分析报告、导师聊天。',
    images_desc: 'AI 图像生成，用于学术成就徽章。',
    auto_refresh: '每 30 秒自动刷新',
    ms: 'ms',
    not_configured: '未配置',
    error: '错误详情',
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
    : svc.status === 'degraded' ? 'border-amber-500/20'
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
  const t = HEALTH_STRINGS[lang] || HEALTH_STRINGS.EN;
  const { health, isChecking, refresh } = useServiceStatus(30_000);

  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseAnonKey, setSupabaseAnonKey] = useState('');
  const [resendApiKey, setResendApiKey] = useState('');
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [notif, setNotif] = useState<string | null>(null);

  // Load hot-swap keys on mount
  useState(() => {
    if (typeof window !== 'undefined') {
      setSupabaseUrl(localStorage.getItem('op_supabase_url') || '');
      setSupabaseAnonKey(localStorage.getItem('op_supabase_anon_key') || '');
      setResendApiKey(localStorage.getItem('op_resend_api_key') || '');
      setGeminiApiKey(localStorage.getItem('op_gemini_api_key') || '');
    }
  });

  const handleSaveKeys = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('op_supabase_url', supabaseUrl);
    localStorage.setItem('op_supabase_anon_key', supabaseAnonKey);
    localStorage.setItem('op_resend_api_key', resendApiKey);
    localStorage.setItem('op_gemini_api_key', geminiApiKey);
    setNotif(lang === 'FR' ? 'Clés API appliquées avec succès à chaud !' : 'API Keys successfully hot-swapped!');
    setTimeout(() => setNotif(null), 4000);
    refresh();
  };

  const handleResetKeys = () => {
    localStorage.removeItem('op_supabase_url');
    localStorage.removeItem('op_supabase_anon_key');
    localStorage.removeItem('op_resend_api_key');
    localStorage.removeItem('op_gemini_api_key');
    setSupabaseUrl('');
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
    <div className="min-h-screen bg-background text-foreground font-sans transition-colors duration-500">
      <TopNav />

      <div className="max-w-6xl mx-auto px-8 pt-32 pb-24 space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-5xl font-black tracking-tighter flex items-center gap-4 text-white">
              <Activity className={`w-10 h-10 ${allOk ? 'text-emerald-500' : anyOffline ? 'text-red-500' : 'text-amber-500'}`} />
              {t.title}
            </h1>
            <p className="text-slate-500 text-[11px] uppercase tracking-widest font-semibold mt-2">{t.subtitle}</p>
            <p className="text-slate-700 text-[10px] mt-1 flex items-center gap-1.5">
              <RefreshCw className="w-3 h-3" /> {t.auto_refresh}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Language picker */}
            <select
              value={lang}
              onChange={e => setLang(e.target.value as any)}
              className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-2xl px-4 py-2.5 focus:outline-none"
            >
              {(['EN', 'FR', 'ES', 'DE', 'ZH'] as const).map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>

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
                value={supabaseUrl}
                onChange={e => setSupabaseUrl(e.target.value)}
                placeholder="https://xxx.supabase.co"
                className="bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-blue-500/50 placeholder:text-slate-700"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{currentCfg.lbl_sb_key}</label>
              <input
                type="password"
                value={supabaseAnonKey}
                onChange={e => setSupabaseAnonKey(e.target.value)}
                placeholder="••••••••••••••••••••••••••••"
                className="bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-blue-500/50 placeholder:text-slate-700"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{currentCfg.lbl_resend}</label>
              <input
                type="password"
                value={resendApiKey}
                onChange={e => setResendApiKey(e.target.value)}
                placeholder="re_xxxxxxxxxxxxxx"
                className="bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-blue-500/50 placeholder:text-slate-700"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{currentCfg.lbl_gemini}</label>
              <input
                type="password"
                value={geminiApiKey}
                onChange={e => setGeminiApiKey(e.target.value)}
                placeholder="AIzaSyxxxxxxxxxxxxxxx"
                className="bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-blue-500/50 placeholder:text-slate-700"
              />
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

        {/* Service Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {services.map(svc => (
            <ServiceCard key={svc.id} svc={svc} t={t} lang={lang} />
          ))}
        </div>
      </div>
    </div>
  );
}
