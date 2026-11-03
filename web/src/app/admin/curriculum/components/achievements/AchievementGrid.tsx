import React from 'react';
import { Award, Edit, Trash2, Calendar, Target, Clock, AlertTriangle } from 'lucide-react';
import type { Achievement } from '@/lib/db';

interface AchievementGridProps {
  achievements: Achievement[];
  getDynamicBadgeCount: (ach: any) => number;
  handleOpenEditAchievement: (ach: Achievement) => void;
  handleOpenPurge: (ach: Achievement) => void;
  t: any;
  LUCIDE_ICONS: Record<string, any>;
}

export const AchievementGrid: React.FC<AchievementGridProps> = ({
  achievements,
  getDynamicBadgeCount,
  handleOpenEditAchievement,
  handleOpenPurge,
  t,
  LUCIDE_ICONS
}) => {
  return (
      {/* GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sortedAchievements.map(ach => {
          const styledBadge = BADGE_LIBRARY.find(b => b.id === ach.icon);
          const IconComp = styledBadge ? (LUCIDE_ICONS[styledBadge.iconName] || Award) : (LUCIDE_ICONS[ach.icon] || Award);
          const gradientClass = styledBadge ? styledBadge.gradient : 'from-violet-500 to-fuchsia-600';
          const isArchived = (ach.archivingLevel || 0) > 0;
          const isCustomImg = ach.icon && (ach.icon.startsWith('data:image') || ach.icon.startsWith('http'));
          
          return (
            <div key={ach.id} className={`p-8 border rounded-[40px] flex flex-col justify-between group hover:border-violet-500/30 transition-all shadow-xl relative overflow-hidden ${isArchived ? 'bg-slate-950/20 border-slate-900 opacity-75' : 'bg-slate-900/40 border-slate-800'}`}>
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div className={`w-14 h-14 rounded-2xl ${isCustomImg ? 'bg-slate-950 border border-slate-880' : `bg-gradient-to-br ${gradientClass}`} text-white flex items-center justify-center shadow-lg shadow-violet-500/10 overflow-hidden`}>
                    {isCustomImg ? (
                      <img src={ach.icon} alt={ach.name} className="w-full h-full object-cover" />
                    ) : (
                      <IconComp className="w-7 h-7" />
                    )}
                  </div>
                  {isArchived && (
                    <span className="px-2.5 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[8px] font-black rounded-full uppercase tracking-wider font-mono">
                      {tr("Level (label)")} {ach.archivingLevel}
                    </span>
                  )}
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-black">
                    {ach.translations?.[lang.toUpperCase()]?.name || 
                     ach.translations?.[lang.toLowerCase()]?.name || 
                     tr(ach.name)}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {ach.translations?.[lang.toUpperCase()]?.description || 
                     ach.translations?.[lang.toLowerCase()]?.description || 
                     tr(ach.description)}
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col gap-4">
                <div className="flex items-center justify-between text-[8px] font-black text-slate-600 uppercase tracking-widest">
                  <div>
                    <p>{tr("Trigger Parameter")}: <span className="text-violet-400">{tr(ach.threshold)}</span></p>
                    <p className="mt-1">{getDynamicBadgeCount(ach)} {tr("Earned")}</p>
                  </div>
                  <div>
                    {ach.startDate && <p>{tr("From:")} <span className="text-slate-400">{ach.startDate}</span></p>}
                    {ach.endDate && <p className="mt-0.5">{tr("To:")} <span className="text-slate-400">{ach.endDate}</span></p>}
                  </div>
                </div>
                
                <div className="h-px bg-slate-800" />
                
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{tr("Archival Level:")}</span>
                  <ArchivingLevelButtons 
                    currentLevel={ach.archivingLevel || 0}
                    lang={lang}
                    onChange={async (nextLvl) => {
                      if (nextLvl === 3) {
                        handleOpenPurge(ach);
                      } else {
                        await dbService.saveAchievement({ 
                          ...ach, 
                          archivingLevel: nextLvl, 
                          status: nextLvl === 0 ? 'active' : 'archived' 
                        });
                        loadData();
                      }
                    }}
                  />
                </div>
                
                <button 
                  type="button"
                  title={tr("Edit")}
                  onClick={() => handleOpenEditAchievement(ach)}
                  className="w-full py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-500 hover:text-white transition-all text-[8px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" /> {tr("Edit Details")}
                </button>
              </div>
            </div>
          );
        })}
      </div>

  );
};
