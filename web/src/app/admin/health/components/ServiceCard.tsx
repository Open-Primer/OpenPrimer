import React from 'react';
import { Database, Mail, Cpu, Image, CheckCircle, AlertTriangle, XCircle, ArrowUpRight, Lock, WifiOff, Clock, Activity, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import type { ServiceHealth } from '@/app/api/health/route';
import { HEALTH_STRINGS } from './healthStrings';

const SERVICE_META: Record<string, { icon: any; descKey: keyof typeof HEALTH_STRINGS.EN; color: string }> = {
  db:     { icon: Database, descKey: 'db_desc',     color: 'emerald' },
  email:  { icon: Mail,     descKey: 'email_desc',  color: 'blue' },
  ai:     { icon: Cpu,      descKey: 'ai_desc',     color: 'violet' },
  images: { icon: Image,    descKey: 'images_desc', color: 'orange' },
  smithsonian: { icon: Image, descKey: 'smithsonian_desc', color: 'blue' },
  unsplash: { icon: Image, descKey: 'unsplash_desc', color: 'orange' },
};

const COLOR_MAP: Record<string, Record<string, string>> = {
  emerald: { bg: 'bg-emerald-500/10', icon: 'text-emerald-400', border: 'border-emerald-500/20', dot: 'bg-emerald-400' },
  blue:    { bg: 'bg-blue-500/10',    icon: 'text-blue-400',    border: 'border-blue-500/20',    dot: 'bg-blue-400' },
  violet:  { bg: 'bg-violet-500/10',  icon: 'text-violet-400',  border: 'border-violet-500/20',  dot: 'bg-violet-400' },
  orange:  { bg: 'bg-orange-500/10',  icon: 'text-orange-400',  border: 'border-orange-500/20',  dot: 'bg-orange-400' },
};

export function StatusBadge({ status, t }: { status: ServiceHealth['status']; t: typeof HEALTH_STRINGS.EN }) {
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

export function ServiceCard({ svc, t, lang }: { svc: ServiceHealth; t: typeof HEALTH_STRINGS.EN; lang: string }) {
  const meta = SERVICE_META[svc.id];
  const colors = COLOR_MAP[meta?.color || 'blue'];
  const Icon = meta?.icon || Activity;
  const nameKey = `health_${svc.id}` as keyof typeof HEALTH_STRINGS.EN;
  const descKey = meta?.descKey;

  const borderColor = svc.status === 'ok' ? 'border-slate-800 hover:border-emerald-500/20'
    : svc.status === 'offline' ? 'border-red-500/20'
    : svc.status === 'degraded' || svc.status === 'unauthorized' ? 'border-amber-500/20'
    : 'border-slate-800';

  const details = (svc as any).details as Array<{ projectId: string; status: 'ok' | 'degraded' | 'offline'; latencyMs: number | null; errorMessage?: string }> | undefined;

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

      {/* Vertex Multi-Project Pool Details */}
      {svc.id === 'ai' && details && details.length > 0 && (
        <div className="flex flex-col gap-3 p-4 bg-slate-950/40 rounded-2xl border border-slate-800/60">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
              GCP Service Accounts Pool ({details.length})
            </span>
            <span className="text-[9px] font-bold text-slate-500 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-full">
              Load Balancer Active
            </span>
          </div>
          <div className="space-y-2.5 max-h-[180px] overflow-y-auto pr-1">
            {details.map((account, idx) => (
              <div 
                key={idx} 
                className="group p-3 bg-slate-950/60 border border-slate-900 hover:border-slate-800 hover:scale-[1.01] rounded-xl flex flex-col gap-1.5 transition-all duration-300"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 truncate">
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 shadow-lg ${
                      account.status === 'ok' ? 'bg-emerald-400 shadow-emerald-400/20' : 
                      account.status === 'degraded' ? 'bg-amber-400 shadow-amber-400/20 animate-pulse' : 
                      'bg-red-400 shadow-red-400/20'
                    }`} />
                    <span className="text-[11px] font-black font-mono text-slate-300 truncate" title={account.projectId}>
                      {account.projectId}
                    </span>
                  </div>
                  <span className={`text-[10px] font-bold font-mono ${
                    account.latencyMs === null ? 'text-slate-600' :
                    account.latencyMs < 500 ? 'text-emerald-400/90' : 
                    account.latencyMs < 2000 ? 'text-amber-400/90' : 
                    'text-red-400/90'
                  }`}>
                    {account.latencyMs !== null ? `${account.latencyMs} ms` : '—'}
                  </span>
                </div>
                {account.errorMessage && (
                  <p className="text-[10px] font-mono text-red-400/80 leading-snug border-t border-red-950/20 pt-1.5 pl-4">
                    {account.errorMessage}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Endpoint */}
      <div className="flex items-center gap-2 p-3 bg-slate-950/40 rounded-xl border border-slate-800">
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
