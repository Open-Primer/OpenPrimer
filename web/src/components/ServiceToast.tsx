'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Wifi, WifiOff, RefreshCw, CheckCircle } from 'lucide-react';
import { useServiceStatus, getDegradedServices, ServiceHealth } from '../lib/serviceStatus';
import { UI_STRINGS } from './RefinedUI';

// Service toast i18n labels (extend UI_STRINGS where needed with inline fallbacks)
const SERVICE_LABELS: Record<string, Record<string, string>> = {
  health_db:     { EN: 'Database', FR: 'Base de données', ES: 'Base de datos', DE: 'Datenbank', ZH: '数据库' },
  health_email:  { EN: 'Email Service', FR: 'Service Email', ES: 'Servicio de Email', DE: 'E-Mail-Dienst', ZH: '邮件服务' },
  health_ai:     { EN: 'AI Agent (Gemini)', FR: 'Agent IA (Gemini)', ES: 'Agente IA (Gemini)', DE: 'KI-Agent (Gemini)', ZH: 'AI代理 (Gemini)' },
  health_images: { EN: 'Image Generator', FR: 'Générateur d\'Images', ES: 'Generador de Imágenes', DE: 'Bildgenerator', ZH: '图像生成器' },
};

const STATUS_MSGS: Record<string, Record<string, string>> = {
  offline:  { EN: 'offline – retrying…', FR: 'hors ligne – reconnexion…', ES: 'sin conexión – reintentando…', DE: 'offline – Wiederverbindung…', ZH: '离线 – 重试中…' },
  degraded: { EN: 'degraded', FR: 'dégradé', ES: 'degradado', DE: 'eingeschränkt', ZH: '服务降级' },
  ok:       { EN: 'restored', FR: 'rétabli', ES: 'restablecido', DE: 'wiederhergestellt', ZH: '已恢复' },
};

interface ServiceToastProps {
  lang?: string;
}

export default function ServiceToast({ lang = 'EN' }: ServiceToastProps) {
  const { health, isChecking, refresh } = useServiceStatus(30_000);
  const degraded = getDegradedServices(health);
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [justRestored, setJustRestored] = useState<ServiceHealth[]>([]);
  const [prevDegradedIds, setPrevDegradedIds] = useState<string[]>([]);

  useEffect(() => {
    const currentDegradedIds = degraded.map(s => s.id);
    // detect services that just came back online
    const restored = prevDegradedIds
      .filter(id => !currentDegradedIds.includes(id))
      .map(id => health[id])
      .filter(Boolean);

    if (restored.length > 0) {
      setJustRestored(restored);
      setTimeout(() => setJustRestored([]), 5000); // auto-dismiss restored toast after 5s
    }
    setPrevDegradedIds(currentDegradedIds);
  }, [health]);

  const visibleDegraded = degraded.filter(s => !dismissed.includes(s.id));
  const L = (lang || 'EN').toUpperCase() as string;

  return (
    <div className="fixed bottom-4 left-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {/* Restored services */}
        {justRestored.map(svc => (
          <motion.div
            key={`restored-${svc.id}`}
            initial={{ opacity: 0, x: -20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.95 }}
            className="pointer-events-auto flex items-center gap-3 px-4 py-3 bg-emerald-950/90 border border-emerald-500/30 rounded-2xl shadow-2xl backdrop-blur-xl"
          >
            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span className="text-xs font-semibold text-emerald-300">
              {SERVICE_LABELS[svc.nameKey]?.[L] || svc.id} — {STATUS_MSGS.ok[L] || 'restored'}
            </span>
          </motion.div>
        ))}

        {/* Degraded/offline services */}
        {visibleDegraded.map(svc => (
          <motion.div
            key={svc.id}
            initial={{ opacity: 0, x: -20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.95 }}
            className="pointer-events-auto flex items-center gap-3 px-4 py-3 bg-slate-950/95 border border-amber-500/30 rounded-2xl shadow-2xl backdrop-blur-xl max-w-xs"
          >
            {svc.status === 'offline'
              ? <WifiOff className="w-4 h-4 text-red-400 flex-shrink-0" />
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
            <button
              onClick={() => { refresh(); }}
              title="Retry"
              className="p-1 text-slate-500 hover:text-white transition-colors flex-shrink-0"
            >
              <RefreshCw className={`w-3 h-3 ${isChecking ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => setDismissed(prev => [...prev, svc.id])}
              className="text-slate-600 hover:text-slate-400 text-xs leading-none flex-shrink-0"
            >
              ✕
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
