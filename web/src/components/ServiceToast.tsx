'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, WifiOff, RefreshCw, CheckCircle } from 'lucide-react';
import { useServiceStatus, getDegradedServices, ServiceHealth } from '../lib/serviceStatus';

// Service toast i18n labels
const SERVICE_LABELS: Record<string, Record<string, string>> = {
  health_db:     { EN: 'Database', FR: 'Base de données', ES: 'Base de datos', DE: 'Datenbank', ZH: '数据库' },
  health_email:  { EN: 'Email Service', FR: 'Service Email', ES: 'Servicio de Email', DE: 'E-Mail-Dienst', ZH: '邮件服务' },
  health_ai:     { EN: 'AI Agent (Gemini)', FR: 'Agent IA (Gemini)', ES: 'Agente IA (Gemini)', DE: 'KI-Agent (Gemini)', ZH: 'AI代理 (Gemini)' },
  health_images: { EN: 'Image Generator', FR: 'Générateur d\'Images', ES: 'Generador de Imágenes', DE: 'Bildgenerator', ZH: '图像生成器' },
};

const STATUS_MSGS: Record<string, Record<string, string>> = {
  offline:  { EN: 'offline – retrying…', FR: 'hors ligne – reconnexion…', ES: 'sin conexión – reintentando…', DE: 'offline – Wiederverbindung…', ZH: '离线 – 重试中…' },
  degraded: { EN: 'degraded – monitoring…', FR: 'dégradé – surveillance…', ES: 'degradado – monitoreando…', DE: 'eingeschränkt – Überwachung…', ZH: '服务降级 – 监测中…' },
  unauthorized: { EN: 'authentication required', FR: 'authentification requise', ES: 'autenticación requerida', DE: 'Authentifizierung erforderlich', ZH: '需要身份验证' },
  ok:       { EN: '✓ restored', FR: '✓ rétabli', ES: '✓ restablecido', DE: '✓ wiederhergestellt', ZH: '✓ 已恢复' },
};

interface ServiceToastProps {
  lang?: string;
}

export default function ServiceToast({ lang = 'EN' }: ServiceToastProps) {
  // Auto-refresh every 10s — consistent with health page
  const { health, isChecking, refresh } = useServiceStatus(10_000);
  const degraded = getDegradedServices(health);
  const [justRestored, setJustRestored] = useState<ServiceHealth[]>([]);
  const [prevDegradedIds, setPrevDegradedIds] = useState<string[]>([]);

  useEffect(() => {
    const currentDegradedIds = degraded.map(s => s.id);
    // Detect services that just came back online
    const restored = prevDegradedIds
      .filter(id => !currentDegradedIds.includes(id))
      .map(id => health[id])
      .filter(Boolean);

    if (restored.length > 0) {
      setJustRestored(prev => {
        const existingIds = prev.map(s => s.id);
        const newRestored = restored.filter(s => !existingIds.includes(s.id));
        return [...prev, ...newRestored];
      });
      // Auto-dismiss green "restored" toast after 5s
      setTimeout(() => setJustRestored([]), 5000);
    }
    setPrevDegradedIds(currentDegradedIds);
  }, [health]);

  const L = (lang || 'EN').toUpperCase() as string;

  return (
    <div className="fixed bottom-4 left-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {/* ── Restored services: green flash, auto-dismiss after 5s ── */}
        {justRestored.map(svc => (
          <motion.div
            key={`restored-${svc.id}`}
            initial={{ opacity: 0, x: -20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.95 }}
            className="pointer-events-auto flex items-center gap-3 px-4 py-3 bg-emerald-950/90 border border-emerald-500/40 rounded-2xl shadow-2xl backdrop-blur-xl"
          >
            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span className="text-xs font-semibold text-emerald-300">
              {SERVICE_LABELS[svc.nameKey]?.[L] || svc.id} — {STATUS_MSGS.ok[L] || '✓ restored'}
            </span>
            {/* Small auto-dismiss progress bar */}
            <div className="w-12 h-0.5 bg-emerald-900 rounded-full overflow-hidden flex-shrink-0">
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 5, ease: 'linear' }}
                className="h-full bg-emerald-500"
              />
            </div>
          </motion.div>
        ))}

        {/* ── Offline/degraded services: persistent until service recovers ── */}
        {degraded.map(svc => (
          <motion.div
            key={svc.id}
            initial={{ opacity: 0, x: -20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.95 }}
            className="pointer-events-auto flex items-center gap-3 px-4 py-3 bg-slate-950/95 border border-red-500/30 rounded-2xl shadow-2xl backdrop-blur-xl max-w-xs"
          >
            {svc.status === 'offline'
              ? <WifiOff className="w-4 h-4 text-red-400 flex-shrink-0 animate-pulse" />
              : <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            }
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-200 truncate">
                {SERVICE_LABELS[svc.nameKey]?.[L] || svc.id}
              </p>
              <p className="text-[10px] text-slate-500">
                {STATUS_MSGS[svc.status]?.[L] || svc.status}
              </p>
            </div>
            {/* Clickable manual refresh wheel button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                refresh();
              }}
              disabled={isChecking}
              title={lang === 'FR' ? 'Actualiser manuellement' : 'Refresh manually'}
              className={`p-1.5 hover:bg-slate-900/60 rounded-xl transition-all flex items-center justify-center border border-transparent hover:border-slate-800 active:scale-95 group cursor-pointer ${isChecking ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              <RefreshCw className={`w-3.5 h-3.5 flex-shrink-0 transition-transform duration-500 ${isChecking ? 'animate-spin text-emerald-400' : 'text-slate-500 group-hover:text-slate-200 group-hover:rotate-180'}`} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
