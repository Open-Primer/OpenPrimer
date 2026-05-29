'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, WifiOff, RefreshCw, CheckCircle, ShieldAlert, Cpu, X } from 'lucide-react';
import { useServiceStatus, ServiceHealth, SERVICES_CONFIG } from '../lib/serviceStatus';

const SERVICE_LABELS: Record<string, Record<string, string>> = {
  health_db:     { EN: 'Database', FR: 'Base de données', ES: 'Base de datos', DE: 'Datenbank', ZH: '数据库' },
  health_email:  { EN: 'Email', FR: 'Email', ES: 'Email', DE: 'E-Mail', ZH: '邮件' },
  health_ai:     { EN: 'AI Agent', FR: 'Agent IA', ES: 'Agente IA', DE: 'KI-Agent', ZH: 'AI代理' },
  health_images: { EN: 'Images', FR: 'Images', ES: 'Imágenes', DE: 'Bilder', ZH: '图像' },
};

const STATUS_MSGS: Record<string, Record<string, string>> = {
  offline:      { EN: 'offline', FR: 'hors ligne', ES: 'sin conexión', DE: 'offline', ZH: '离线' },
  degraded:     { EN: 'degraded', FR: 'dégradé', ES: 'degradado', DE: 'eingeschränkt', ZH: '降级' },
  unauthorized: { EN: 'auth failed', FR: 'auth requise', ES: 'auth req.', DE: 'Auth fehlg.', ZH: '验证失败' },
  ok:           { EN: 'ok', FR: 'ok', ES: 'ok', DE: 'ok', ZH: '正常' },
  unknown:      { EN: '…', FR: '…', ES: '…', DE: '…', ZH: '…' },
};

interface ServiceToastProps {
  lang?: string;
}

export default function ServiceToast({ lang = 'EN' }: ServiceToastProps) {
  const { health, isChecking, refresh } = useServiceStatus(30_000);
  const [expanded, setExpanded] = useState(false);
  const L = (lang || 'EN').toUpperCase();

  const services = SERVICES_CONFIG.map(cfg => health[cfg.id] || {
    id: cfg.id, nameKey: cfg.nameKey, url: cfg.url,
    status: 'unknown', latencyMs: null, checkedAt: null
  });

  const offlineCount  = services.filter(s => s.status === 'offline').length;
  const degradedCount = services.filter(s => s.status === 'degraded' || s.status === 'unauthorized').length;
  const allOk         = offlineCount === 0 && degradedCount === 0 && services.every(s => s.status === 'ok');

  // Dot color for minimized state
  const dotColor = offlineCount > 0
    ? 'bg-red-500 shadow-red-500/50'
    : degradedCount > 0
    ? 'bg-amber-400 shadow-amber-400/50'
    : allOk
    ? 'bg-emerald-400 shadow-emerald-500/40'
    : 'bg-slate-500';

  const panelBorder = offlineCount > 0
    ? 'border-red-500/25'
    : degradedCount > 0
    ? 'border-amber-500/25'
    : 'border-white/10';

  const getStatusBadge = (status: string) => {
    const base = 'flex items-center gap-1 text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full border';
    switch (status) {
      case 'ok':           return <span className={`${base} text-emerald-400 bg-emerald-500/10 border-emerald-500/20`}><CheckCircle className="w-2 h-2" />{STATUS_MSGS.ok[L]}</span>;
      case 'unauthorized': return <span className={`${base} text-rose-400 bg-rose-500/10 border-rose-500/20`}><ShieldAlert className="w-2 h-2" />{STATUS_MSGS.unauthorized[L]}</span>;
      case 'degraded':     return <span className={`${base} text-amber-400 bg-amber-500/10 border-amber-500/20`}><AlertTriangle className="w-2 h-2" />{STATUS_MSGS.degraded[L]}</span>;
      case 'offline':      return <span className={`${base} text-red-400 bg-red-500/10 border-red-500/20 animate-pulse`}><WifiOff className="w-2 h-2" />{STATUS_MSGS.offline[L]}</span>;
      default:             return <span className={`${base} text-slate-500 bg-slate-800/40 border-slate-700/20`}><RefreshCw className="w-2 h-2 animate-spin" />{STATUS_MSGS.unknown[L]}</span>;
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-[9999] flex flex-col items-start gap-2">
      {/* Expanded panel — slides up from the dot */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ type: 'spring', damping: 24, stiffness: 260 }}
            className={`w-60 rounded-2xl border backdrop-blur-xl bg-slate-950/90 shadow-2xl overflow-hidden ${panelBorder}`}
          >
            {/* Panel header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Cpu className={`w-3.5 h-3.5 ${offlineCount > 0 ? 'text-red-400 animate-pulse' : degradedCount > 0 ? 'text-amber-400' : 'text-blue-400'}`} />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-200">
                  {L === 'FR' ? 'Santé Système' : 'System Health'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={refresh}
                  disabled={isChecking}
                  className="p-1 hover:bg-white/5 rounded-lg transition-all disabled:opacity-40"
                >
                  <RefreshCw className={`w-3 h-3 text-slate-400 hover:text-white ${isChecking ? 'animate-spin' : ''}`} />
                </button>
                <button onClick={() => setExpanded(false)} className="p-1 hover:bg-white/5 rounded-lg transition-all">
                  <X className="w-3 h-3 text-slate-500 hover:text-white" />
                </button>
              </div>
            </div>

            {/* Service rows */}
            <div className="p-3 flex flex-col gap-2">
              {services.map(svc => (
                <div key={svc.id} className="flex items-center justify-between px-2 py-1.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <span className="text-[10px] font-semibold text-slate-300 truncate">
                    {SERVICE_LABELS[svc.nameKey]?.[L] || svc.id}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    {svc.latencyMs !== null && (
                      <span className="text-[8px] text-slate-600 font-mono">{svc.latencyMs}ms</span>
                    )}
                    {getStatusBadge(svc.status)}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Minimized dot trigger */}
      <button
        onClick={() => setExpanded(e => !e)}
        title={L === 'FR' ? 'Santé du système' : 'System health'}
        className={`w-7 h-7 rounded-full flex items-center justify-center bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-lg hover:scale-110 transition-transform`}
      >
        <span className={`w-2.5 h-2.5 rounded-full shadow-md ${dotColor} ${!allOk && offlineCount === 0 && degradedCount === 0 ? 'animate-pulse' : ''}`} />
      </button>
    </div>
  );
}
