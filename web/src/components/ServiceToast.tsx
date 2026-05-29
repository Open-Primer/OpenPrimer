'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, WifiOff, RefreshCw, CheckCircle, ShieldAlert, Cpu } from 'lucide-react';
import { useServiceStatus, ServiceHealth, SERVICES_CONFIG } from '../lib/serviceStatus';

// Service toast i18n labels
const SERVICE_LABELS: Record<string, Record<string, string>> = {
  health_db:     { EN: 'Database (Supabase)', FR: 'Base de données (Supabase)', ES: 'Base de datos (Supabase)', DE: 'Datenbank (Supabase)', ZH: '数据库 (Supabase)' },
  health_email:  { EN: 'Email Service (Resend)', FR: 'Service Email (Resend)', ES: 'Servicio de Email (Resend)', DE: 'E-Mail-Dienst (Resend)', ZH: '邮件服务 (Resend)' },
  health_ai:     { EN: 'AI Agent (Gemini)', FR: 'Agent IA (Gemini)', ES: 'Agente IA (Gemini)', DE: 'KI-Agent (Gemini)', ZH: 'AI代理 (Gemini)' },
  health_images: { EN: 'Image Generator', FR: 'Générateur d\'Images', ES: 'Generador de Imágenes', DE: 'Bildgenerator', ZH: '图像生成器' },
};

const STATUS_TITLES: Record<string, Record<string, string>> = {
  monitor: { EN: 'System Health', FR: 'Santé du Système', ES: 'Estado del Sistema', DE: 'Systemstatus', ZH: '系统健康状态' }
};

const STATUS_MSGS: Record<string, Record<string, string>> = {
  offline:  { EN: 'offline', FR: 'hors ligne', ES: 'sin conexión', DE: 'offline', ZH: '离线' },
  degraded: { EN: 'degraded', FR: 'dégradé', ES: 'degradado', DE: 'eingeschränkt', ZH: '服务降级' },
  unauthorized: { EN: 'auth failed', FR: 'auth requise', ES: 'auth requerida', DE: 'Authentifizierung fehlgeschlagen', ZH: '身份验证失败' },
  ok:       { EN: 'operational', FR: 'opérationnel', ES: 'operativo', DE: 'betriebsbereit', ZH: '运行正常' },
  unknown:  { EN: 'checking…', FR: 'vérification…', ES: 'verificando…', DE: 'prüfung…', ZH: '检查中…' },
};

interface ServiceToastProps {
  lang?: string;
}

export default function ServiceToast({ lang = 'EN' }: ServiceToastProps) {
  const { health, isChecking, refresh } = useServiceStatus(15_000);
  const [isMinimized, setIsMinimized] = useState(false);
  const L = (lang || 'EN').toUpperCase() as string;

  // Calculate global summary state
  const services = SERVICES_CONFIG.map(cfg => health[cfg.id] || {
    id: cfg.id,
    nameKey: cfg.nameKey,
    url: cfg.url,
    status: 'unknown',
    latencyMs: null,
    checkedAt: null
  });

  const offlineCount = services.filter(s => s.status === 'offline').length;
  const degradedCount = services.filter(s => s.status === 'degraded' || s.status === 'unauthorized').length;
  
  const getGlobalStatusColor = () => {
    if (offlineCount > 0) return 'border-red-500/30 bg-red-950/20';
    if (degradedCount > 0) return 'border-amber-500/30 bg-amber-950/20';
    return 'border-white/10 bg-slate-950/75';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ok':
        return (
          <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
            <CheckCircle className="w-2.5 h-2.5" />
            {STATUS_MSGS.ok[L] || 'operational'}
          </span>
        );
      case 'unauthorized':
        return (
          <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full">
            <ShieldAlert className="w-2.5 h-2.5" />
            {STATUS_MSGS.unauthorized[L] || 'auth failed'}
          </span>
        );
      case 'degraded':
        return (
          <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
            <AlertTriangle className="w-2.5 h-2.5" />
            {STATUS_MSGS.degraded[L] || 'degraded'}
          </span>
        );
      case 'offline':
        return (
          <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-red-500 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full animate-pulse">
            <WifiOff className="w-2.5 h-2.5" />
            {STATUS_MSGS.offline[L] || 'offline'}
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-slate-500 bg-slate-800/40 border border-slate-700/20 px-2 py-0.5 rounded-full">
            <RefreshCw className="w-2.5 h-2.5 animate-spin" />
            {STATUS_MSGS.unknown[L] || 'checking…'}
          </span>
        );
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-[9999] pointer-events-auto">
      <motion.div
        layout
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={`flex flex-col rounded-[24px] border shadow-2xl backdrop-blur-xl overflow-hidden transition-all ${getGlobalStatusColor()} w-72`}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-white/2 select-none">
          <div className="flex items-center gap-2.5">
            <Cpu className={`w-4 h-4 ${offlineCount > 0 ? 'text-red-400 animate-pulse' : degradedCount > 0 ? 'text-amber-400' : 'text-blue-400'}`} />
            <span className="text-xs font-black uppercase tracking-wider text-slate-100">
              {STATUS_TITLES.monitor[L] || 'System Health'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Manual refresh button */}
            <button
              onClick={refresh}
              disabled={isChecking}
              title={lang === 'FR' ? 'Actualiser manuellement' : 'Refresh manually'}
              className="p-1 hover:bg-white/5 rounded-lg transition-all flex items-center justify-center cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-slate-400 hover:text-white ${isChecking ? 'animate-spin' : ''}`} />
            </button>

            {/* Minimize / Maximize button */}
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors cursor-pointer px-1.5 py-0.5 rounded bg-white/5"
            >
              {isMinimized ? '＋' : '－'}
            </button>
          </div>
        </div>

        {/* Core Services Status List */}
        {!isMinimized && (
          <div className="p-4 flex flex-col gap-3">
            {services.map(svc => (
              <div 
                key={svc.id} 
                className="flex flex-col p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.03] hover:bg-white/[0.04] transition-all"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-slate-200 truncate">
                      {SERVICE_LABELS[svc.nameKey]?.[L] || svc.id}
                    </span>
                    {svc.latencyMs !== null && (
                      <span className="text-[9px] text-slate-500 font-medium mt-0.5">
                        Latency: {svc.latencyMs}ms
                      </span>
                    )}
                  </div>
                  <div className="flex-shrink-0">
                    {getStatusBadge(svc.status)}
                  </div>
                </div>

                {/* Show detailed error message if service fails */}
                {svc.errorMessage && svc.status !== 'ok' && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-2 p-2 bg-red-950/30 border border-red-500/20 rounded-lg text-[9px] text-red-400 font-mono break-all whitespace-pre-wrap leading-relaxed shadow-inner"
                  >
                    Error: {svc.errorMessage}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
