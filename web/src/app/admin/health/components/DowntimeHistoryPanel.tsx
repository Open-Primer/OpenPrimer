import React from 'react';
import { motion } from 'framer-motion';
import { Clock, WifiOff } from 'lucide-react';
import { HEALTH_STRINGS } from './healthStrings';

export interface DowntimeDay {
  date: string;
  hasIncident?: boolean;
  incidentTitle?: string;
  status?: string;
  db?: number;
  email?: number;
  ai?: number;
  images?: number;
  smithsonian?: number;
  unsplash?: number;
  [key: string]: any;
}

interface DowntimeHistoryPanelProps {
  t: any;
  days365?: DowntimeDay[];
  hoveredDay: DowntimeDay | null;
  setHoveredDay: (day: DowntimeDay | null) => void;
  lang: string;
  getServiceStats: (id: any) => any;
  overallAvg: number;
  slaHistory: DowntimeDay[];
  getDayStatus: (dayData: any) => string;
}

export const DowntimeHistoryPanel: React.FC<DowntimeHistoryPanelProps> = ({
  t,
  days365,
  hoveredDay,
  setHoveredDay,
  lang,
  getServiceStats,
  overallAvg,
  slaHistory,
  getDayStatus
}) => {
  return (
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

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-6">
          {[
            { id: 'db' as const, name: 'Supabase DB', label: t.lbl_database, color: 'text-emerald-400' },
            { id: 'email' as const, name: 'Resend API', label: t.lbl_email, color: 'text-blue-400' },
            { id: 'ai' as const, name: 'Gemini AI', label: t.lbl_ai, color: 'text-violet-400' },
            { id: 'images' as const, name: 'Pollinations.ai', label: t.lbl_images, color: 'text-orange-400' },
            { id: 'smithsonian' as const, name: 'Smithsonian API', label: (t as any).lbl_smithsonian || 'Smithsonian', color: 'text-sky-400' },
            { id: 'unsplash' as const, name: 'Unsplash API', label: (t as any).lbl_unsplash || 'Unsplash', color: 'text-amber-400' },
          ].map(s => {
            const stats = getServiceStats(s.id);
            return (
              <div key={s.id} className="p-6 bg-slate-950/60 rounded-3xl border border-slate-800 hover:border-slate-800 transition-all flex flex-col justify-between group relative overflow-hidden">
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
        <div className="p-6 bg-slate-950/40 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-wider text-slate-400 min-h-8">
              {hoveredDay ? (
                <div className="flex items-center justify-between w-full text-[10px] text-slate-200 animate-in fade-in duration-200">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 font-extrabold font-mono">
                      {new Date(hoveredDay.date).toLocaleDateString(({ EN: 'en-US', FR: 'fr-FR', ES: 'es-ES', DE: 'de-DE', ZH: 'zh-CN', PT: 'pt-BR', AR: 'ar-SA', HI: 'hi-IN', UR: 'ur-PK' } as Record<string, string>)[lang] || 'en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
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
                      <span className={hoveredDay.status === 'no_data' ? 'text-slate-500' : (hoveredDay.db ?? 100) < 100 ? 'text-amber-400 font-black' : 'text-emerald-400'}>
                        {hoveredDay.status === 'no_data' ? '—' : `${hoveredDay.db}%`}
                      </span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="text-slate-500 font-bold">{t.lbl_email || 'Email'}:</span> 
                      <span className={hoveredDay.status === 'no_data' ? 'text-slate-500' : (hoveredDay.email ?? 100) < 100 ? 'text-amber-400 font-black' : 'text-emerald-400'}>
                        {hoveredDay.status === 'no_data' ? '—' : `${hoveredDay.email}%`}
                      </span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="text-slate-500 font-bold">{t.lbl_ai || 'AI'}:</span> 
                      <span className={hoveredDay.status === 'no_data' ? 'text-slate-500' : (hoveredDay.ai ?? 100) < 100 ? 'text-amber-400 font-black' : 'text-emerald-400'}>
                        {hoveredDay.status === 'no_data' ? '—' : `${hoveredDay.ai}%`}
                      </span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="text-slate-500 font-bold">{t.lbl_images || 'Images'}:</span> 
                      <span className={hoveredDay.status === 'no_data' ? 'text-slate-500' : (hoveredDay.images ?? 100) < 100 ? 'text-amber-400 font-black' : 'text-emerald-400'}>
                        {hoveredDay.status === 'no_data' ? '—' : `${hoveredDay.images}%`}
                      </span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="text-slate-500 font-bold">{(t as any).lbl_smithsonian || 'Smithsonian'}:</span> 
                      <span className={hoveredDay.status === 'no_data' ? 'text-slate-500' : (hoveredDay.smithsonian ?? 100) < 100 ? 'text-amber-400 font-black' : 'text-emerald-400'}>
                        {hoveredDay.status === 'no_data' ? '—' : `${hoveredDay.smithsonian ?? 100}%`}
                      </span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="text-slate-500 font-bold">{(t as any).lbl_unsplash || 'Unsplash'}:</span> 
                      <span className={hoveredDay.status === 'no_data' ? 'text-slate-500' : (hoveredDay.unsplash ?? 100) < 100 ? 'text-amber-400 font-black' : 'text-emerald-400'}>
                        {hoveredDay.status === 'no_data' ? '—' : `${hoveredDay.unsplash ?? 100}%`}
                      </span>
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center w-full animate-in fade-in duration-200">
                  <div className="flex items-center gap-2">
                    <span>{t.sla_grid_title}</span>
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
                        : status === 'no_data' ? 'bg-slate-800/60 border-slate-800/80 shadow-none hover:bg-slate-800 hover:border-slate-700'
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
                      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-slate-800 border border-slate-800" /> {t.status_no_data || 'No Log Data'}</span>
                   </div>
                   <span>{t.today}</span>
                </div>
              </>
            )}
         </div>
      </motion.div>


  );
};
