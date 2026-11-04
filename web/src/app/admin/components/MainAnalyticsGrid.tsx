import React from 'react';
import { Zap, Globe, Flame, Award, Clock, Sparkles, RefreshCw, Activity, Trophy } from 'lucide-react';
import type { DashboardTranslation } from './dashboardStrings';

interface MainAnalyticsGridProps {
  t: DashboardTranslation;
  stats: any;
  liveCostEstimates: any;
  financialMetrics: any;
  heatmapDays: any[];
  topStudents: any[];
  dynamicAccuracyRate: string;
  dynamicGenerationRate: string;
  availableLanguages: any[];
  allCourses: any[];
  formatLanguageLabel: (code: string) => string;
  getHeatmapColor: (val: number) => string;
}

export const MainAnalyticsGrid: React.FC<MainAnalyticsGridProps> = ({
  t,
  stats,
  liveCostEstimates,
  financialMetrics,
  heatmapDays,
  topStudents,
  dynamicAccuracyRate,
  dynamicGenerationRate,
  availableLanguages,
  allCourses,
  formatLanguageLabel,
  getHeatmapColor
}) => {
  return (
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Row 1, Col 1: AI Content Engine */}
        <section className="space-y-6">
          <h2 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] flex items-center gap-3">
             <Sparkles className="w-4 h-4 text-blue-500" /> {t.content_engine}
          </h2>
          <div className="p-8 rounded-[40px] bg-slate-900/40 border border-slate-800/50 space-y-8">
             <div className="flex justify-between items-end">
                <div className="cursor-help" title={t.tooltip_accuracy}>
                   <p className="text-3xl font-black text-white">{dynamicAccuracyRate}</p>
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t.accuracy_label}</p>
                </div>
                <div className="h-12 w-32 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                   <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest">{t.stable}</p>
                </div>
             </div>
             <div className="space-y-2 cursor-help" title={t.tooltip_queue_rate}>
                <div className="flex justify-between text-[8px] font-black text-slate-600 uppercase tracking-widest">
                   <span>{t.queue}</span>
                   <span>{dynamicGenerationRate}</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                   <div className="h-full w-[65%] bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
                </div>
             </div>
          </div>
        </section>

        {/* Row 1, Col 2: Translation Metrics */}
        <section className="space-y-6">
          <h2 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] flex items-center gap-3">
             <RefreshCw className="w-4 h-4 text-emerald-500" /> {t.translation_tracker}
          </h2>
          <div className="p-8 rounded-[40px] bg-slate-900/40 border border-slate-800/50 space-y-6">
             {availableLanguages.map((l) => {
               const langCode = l.code.toUpperCase();
               const totalCourses = allCourses.length;
               const count = allCourses.filter(c => 
                 c.languages?.some((lang: string) => String(lang).toUpperCase() === langCode)
               ).length;
               
               const progress = totalCourses > 0 ? Math.round((count / totalCourses) * 100) : 0;
               const isMaster = langCode === 'EN';
               
               const status = isMaster 
                 ? t.certified 
                 : (progress === 100 
                    ? t.certified 
                    : (progress > 0 
                       ? t.in_progress
                       : t.in_queue));
                       
               const color = isMaster 
                 ? "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
                 : (progress === 100 
                    ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" 
                    : (progress > 0 
                       ? "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" 
                       : "bg-slate-800"));

               const displayName = formatLanguageLabel(langCode);               
               return (
                 <div key={langCode} className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                       <span className="flex items-center gap-2">
                         <span className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-[8px] font-extrabold">{l.flag || '🌐'} {langCode}</span>
                         <span className="text-slate-200">{displayName}</span>
                       </span>
                       <span className="text-[9px] text-slate-500 font-semibold">{count} / {totalCourses} {t.modules} ({progress}%)</span>
                    </div>
                    <div className="relative">
                       <div className="h-2 w-full bg-slate-950 border border-slate-900 rounded-full overflow-hidden">
                          <div className={`h-full ${color}`} style={{ width: `${progress}%` }} />
                       </div>
                       <span className="absolute right-0 -top-6 text-[8px] font-extrabold uppercase text-slate-600 tracking-widest">{status}</span>
                    </div>
                 </div>
               );
             })}
          </div>
        </section>

        {/* Row 2, Col 1: Integrated Feature 5 - Cohort Daily Engagement Heatmap */}
        <section className="space-y-6">
          <h2 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] flex items-center gap-3">
             <Activity className="w-4 h-4 text-emerald-500" /> {t.cohort_heatmap}
          </h2>
          <div className="p-8 rounded-[40px] bg-slate-900/40 border border-slate-800/50 space-y-6">
             <div>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">
                   {t.heatmap_desc}
                </p>
             </div>
             
             {/* Heatmap GitHub Grid */}
             <div className="grid grid-cols-7 gap-3 max-w-sm mx-auto p-4 bg-slate-950/40 border border-slate-800 rounded-3xl">
                {heatmapDays.map((day) => (
                  <div 
                    key={day.day}
                    className={`w-9 h-9 rounded-lg border transition-all flex items-center justify-center text-[9px] font-extrabold text-slate-500 hover:text-white ${getHeatmapColor(day.val)}`}
                    title={`${day.day}: ${day.val}`}
                  >
                    {day.day}
                  </div>
                ))}
             </div>

             <div className="flex justify-between items-center text-[8px] font-black text-slate-600 uppercase tracking-widest pt-2">
                <span>{t.less_active}</span>
                <div className="flex gap-1.5">
                   <div className="w-3.5 h-3.5 rounded bg-slate-900 border border-slate-800" />
                   <div className="w-3.5 h-3.5 rounded bg-emerald-950 border border-emerald-900" />
                   <div className="w-3.5 h-3.5 rounded bg-emerald-800 border border-emerald-700" />
                   <div className="w-3.5 h-3.5 rounded bg-emerald-600 border border-emerald-500" />
                   <div className="w-3.5 h-3.5 rounded bg-emerald-400 border border-emerald-300" />
                </div>
                <span>{t.highly_active}</span>
             </div>
          </div>
        </section>

        {/* Row 2, Col 2: Dynamic DB Leaderboard of Top Students */}
        <section className="space-y-6">
          <h2 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] flex items-center gap-3">
             <Trophy className="w-4 h-4 text-yellow-500" /> {t.elite_leaderboard}
          </h2>
          <div className="p-8 rounded-[40px] bg-slate-900/40 border border-slate-800/50 space-y-4">
             {topStudents.map((student, index) => (
               <div key={student.id} className="p-4 bg-slate-950/30 border border-slate-800/50 rounded-2xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                     <span className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-[9px] border ${index === 0 ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : index === 1 ? 'bg-slate-300/10 text-slate-350 border-slate-300/20' : 'bg-amber-600/10 text-amber-500 border-amber-600/20'}`}>
                        {index + 1}
                     </span>
                     <div>
                        <h4 className="text-xs font-bold text-slate-200">{student.name}</h4>
                        <p className="text-[8px] text-slate-600 font-bold uppercase tracking-wider">{student.email}</p>
                     </div>
                  </div>
                  <div className="text-right">
                     <span className="text-[9px] font-black bg-slate-950 px-2.5 py-1 rounded-full text-slate-400 uppercase">
                        {student.kp.toLocaleString()} KP
                     </span>
                     <span className="text-[8px] block text-slate-600 font-extrabold uppercase mt-1">{t.level} {student.level}</span>
                  </div>
               </div>
             ))}
              {topStudents.length === 0 && (
                <p className="text-xs text-slate-600 italic text-center py-8">{t.no_profiles}</p>
              )}
          </div>
        </section>
      </div>


  );
};
