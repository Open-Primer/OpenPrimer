import React from 'react';
import * as Icons from 'lucide-react';
import { Trophy } from 'lucide-react';
import { BADGE_LIBRARY } from '@/lib/db';
import { getAchievementTranslation } from './curriculumAuditHelpers';

interface AchievementsGallerySectionProps {
  achievements: any[];
  earnedIds: number[];
  lang: string;
  t: any;
}

export const AchievementsGallerySection: React.FC<AchievementsGallerySectionProps> = ({
  achievements,
  earnedIds,
  lang,
  t
}) => {
  const activeAchievements = achievements.filter(ach => ach.status !== 'inactive');

  if (activeAchievements.length === 0) return null;

  return (
    <section className="mt-20">
      <h2 className="text-2xl font-black mb-8 flex items-center gap-4 text-amber-500">
        <Trophy className="w-6 h-6 text-amber-500 animate-bounce" /> {t.achievements_gallery}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {activeAchievements.map((ach) => {
          const isEarned = earnedIds.includes(ach.id);
          const badge = BADGE_LIBRARY.find(b => b.id === ach.icon) || { iconName: 'Award', gradient: 'from-blue-500 to-indigo-500' };
          const IconComponent = (Icons as any)[badge.iconName] || Icons.Award;
          const name = ach.translations?.[lang.toUpperCase()]?.name || ach.translations?.[lang.toLowerCase()]?.name || ach.name;
          const description = getAchievementTranslation(ach, 'description', lang);

          return (
            <div 
              key={ach.id}
              className={`p-6 border rounded-[32px] flex flex-col items-center text-center transition-all bg-slate-900/50 shadow-xl shadow-blue-500/5 ${
                isEarned 
                  ? 'border-blue-500/30' 
                  : 'border-dashed border-slate-700/60 opacity-60'
              }`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg ${
                isEarned 
                  ? `bg-gradient-to-br ${badge.gradient}` 
                  : 'bg-slate-800 border border-slate-700/50 grayscale contrast-75 opacity-40'
              }`}>
                <IconComponent className="w-6 h-6" />
              </div>
              <h4 className={`text-sm font-black mb-1 line-clamp-1 ${
                isEarned ? 'text-slate-200' : 'text-slate-500'
              }`}>
                {name}
              </h4>
              <p className="text-[10px] text-slate-500 mb-3 leading-tight line-clamp-2">
                {description}
              </p>
              <span className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                isEarned 
                  ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' 
                  : 'bg-slate-800/20 border-slate-800/40 text-slate-600'
              }`}>
                {isEarned ? t.unlocked : (t.locked || "Locked")}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
};
