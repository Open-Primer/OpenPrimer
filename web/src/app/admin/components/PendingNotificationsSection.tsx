import React from 'react';
import { Mail } from 'lucide-react';
import type { DashboardTranslation } from './dashboardStrings';

interface PendingNotificationsProps {
  t: DashboardTranslation;
  pendingEmails: Array<{
    courseTitle: string;
    targetLang: string;
    timestamp: string;
    [key: string]: any;
  }>;
  formatLanguageLabel: (lang: string) => string;
}

export const PendingNotificationsSection: React.FC<PendingNotificationsProps> = ({
  t,
  pendingEmails,
  formatLanguageLabel,
}) => {
  return (
    <section className="space-y-6 pt-4">
      <h2 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] flex items-center gap-3">
        <Mail className="w-4 h-4 text-emerald-500" /> {t.notification_queue}
      </h2>
      <div className="grid md:grid-cols-3 gap-8">
        {/* Stat card */}
        <div className="p-8 rounded-[40px] bg-slate-900/40 border border-slate-800/50 flex flex-col justify-between group hover:border-emerald-500/30 transition-all">
          <div>
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 block">{t.total_waiting}</span>
            <p className="text-4xl font-black text-white mt-4">{pendingEmails.length}</p>
            <p className="text-xs text-slate-400 mt-2 font-medium">{t.waiting_desc}</p>
          </div>
          <div className="pt-4 border-t border-slate-800/80 mt-6">
            <span className="text-[8px] font-black uppercase tracking-wider text-slate-500">{t.avg_queuing}</span>
            <p className="text-xs font-mono font-bold text-emerald-400 mt-1">2.4 {t.days_suffix}</p>
          </div>
        </div>

        {/* Language distribution list */}
        <div className="p-8 rounded-[40px] bg-slate-900/40 border border-slate-800/50 space-y-6 group hover:border-emerald-500/30 transition-all flex flex-col">
          <div className="flex items-center justify-between h-[15px]">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">{t.queue_by_lang}</span>
          </div>
          <div className={`flex-1 flex flex-col min-h-[260px] ${pendingEmails.length === 0 ? 'justify-center' : 'justify-start'}`}>
            {(() => {
              const langCounts: Record<string, number> = {};
              pendingEmails.forEach(e => {
                const l = String(e.targetLang).toUpperCase();
                langCounts[l] = (langCounts[l] || 0) + 1;
              });
              const items = Object.entries(langCounts);
              if (items.length === 0) {
                return <p className="text-xs text-slate-650 italic text-center py-8">{t.no_pending_notifications}</p>;
              }
              return (
                <div className="space-y-4">
                  {items.map(([l, count]) => {
                    const pct = Math.round((count / pendingEmails.length) * 100);
                    return (
                      <div key={l} className="space-y-2">
                        <div className="flex justify-between text-[9px] font-black uppercase tracking-wider text-slate-400">
                          <span>{l} - {formatLanguageLabel(l)}</span>
                          <span className="text-slate-350">{count} ({pct}%)</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-900">
                          <div className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        </div>

        {/* Pending items - AGGREGATED by course + language */}
        <div className="p-8 rounded-[40px] bg-slate-900/40 border border-slate-800/50 space-y-6 group hover:border-emerald-500/30 transition-all flex flex-col">
          <div className="flex items-center justify-between h-[15px]">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">{t.pending_backlog}</span>
            {pendingEmails.length > 0 && (
              <span className="text-[8px] font-black uppercase tracking-widest text-slate-600">
                {(() => {
                  const uniqueJobs = new Map<string, number>();
                  pendingEmails.forEach(item => {
                    const key = `${item.courseTitle}|${item.targetLang}`;
                    uniqueJobs.set(key, (uniqueJobs.get(key) || 0) + 1);
                  });
                  return t.unique_subscribers.replace('{jobs}', uniqueJobs.size.toString()).replace('{subs}', pendingEmails.length.toString());
                })()}
              </span>
            )}
          </div>
          <div className={`space-y-2 max-h-[260px] min-h-[260px] overflow-y-auto pr-1 custom-scrollbar flex-1 flex flex-col ${pendingEmails.length === 0 ? 'justify-center' : 'justify-start'}`}>
            {(() => {
              if (pendingEmails.length === 0) {
                return (
                  <p className="text-xs text-slate-650 italic text-center py-8">{t.no_queued_notifications}</p>
                );
              }
              const aggregated = new Map<string, { courseTitle: string; targetLang: string; count: number; oldest: string }>();
              pendingEmails.forEach(item => {
                const key = `${item.courseTitle}|${item.targetLang}`;
                const existing = aggregated.get(key);
                if (!existing) {
                  aggregated.set(key, { courseTitle: item.courseTitle, targetLang: item.targetLang, count: 1, oldest: item.timestamp });
                } else {
                  existing.count += 1;
                  if (item.timestamp < existing.oldest) existing.oldest = item.timestamp;
                }
              });
              const sorted = Array.from(aggregated.values()).sort((a, b) => b.count - a.count);
              const MAX_VISIBLE = 10;
              const visible = sorted.slice(0, MAX_VISIBLE);
              const overflow = sorted.length - MAX_VISIBLE;
              return (
                <>
                  {visible.map((job) => (
                    <div key={`${job.courseTitle}|${job.targetLang}`} className="p-4 bg-slate-950/40 border border-slate-800/60 rounded-2xl flex items-center justify-between gap-3 text-xs">
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-slate-200 truncate">{job.courseTitle}</p>
                        <p className="text-[8px] text-slate-550 font-bold mt-1 uppercase tracking-wider">
                          {t.oldest_request}: {new Date(job.oldest).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[8px] font-black rounded uppercase tracking-wider">
                          {job.targetLang}
                        </span>
                        <span className={`px-2.5 py-1 rounded-full text-[8px] font-black border ${job.count >= 10 ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-slate-800 text-slate-400 border-slate-700/30'}`}>
                          ×{job.count}
                        </span>
                      </div>
                    </div>
                  ))}
                  {overflow > 0 && (
                    <div className="p-3 rounded-2xl border border-dashed border-slate-800 text-center">
                      <p className="text-[8px] font-black uppercase tracking-widest text-slate-600">
                        + {overflow} {t.overflow_jobs}
                      </p>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      </div>
    </section>
  );
};
