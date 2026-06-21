"use client";

import React from 'react';
import { COCKPIT_DICTIONARY, EXTRA_TOOLTIP_STRINGS } from '../strings';

interface ArchivingLevelButtonsProps {
  currentLevel: number;
  onChange: (level: number) => void;
  disableLevel3?: boolean;
  lang?: 'EN' | 'FR' | 'ES' | 'DE' | 'ZH';
}

export const ArchivingLevelButtons: React.FC<ArchivingLevelButtonsProps> = ({
  currentLevel,
  onChange,
  disableLevel3 = false,
  lang = 'EN'
}) => {
  const tr = (key: string): string => {
    const dict = ((COCKPIT_DICTIONARY as any)[lang || 'EN'] || COCKPIT_DICTIONARY.EN) as Record<string, string>;
    const extraDict = (EXTRA_TOOLTIP_STRINGS[lang] || EXTRA_TOOLTIP_STRINGS.EN) as Record<string, string>;
    return extraDict[key] || dict[key] || key;
  };

  return (
    <div className="flex items-center gap-1.5 bg-slate-950 p-1 border border-slate-850 rounded-2xl w-fit">
      {[0, 1, 2, 3].map((lvl) => {
        const isActive = currentLevel === lvl;
        const isDisabled = lvl === 3 && disableLevel3;
        let activeClass = "";
        
        if (isDisabled) {
          activeClass = "opacity-30 cursor-not-allowed text-slate-600";
        } else if (isActive) {
          if (lvl === 0) activeClass = "bg-emerald-600 text-white shadow-md shadow-emerald-600/20";
          else if (lvl === 1) activeClass = "bg-amber-500 text-white shadow-md shadow-amber-500/20";
          else if (lvl === 2) activeClass = "bg-blue-600 text-white shadow-md shadow-blue-600/20";
          else if (lvl === 3) activeClass = "bg-red-600 text-white shadow-md shadow-red-600/20";
        } else {
          activeClass = "text-slate-500 hover:text-slate-300 hover:bg-slate-900";
        }

        let tooltip = "";
        if (lvl === 0) {
          tooltip = tr("Level 0 tooltip");
        } else if (lvl === 1) {
          tooltip = tr("Level 1 tooltip");
        } else if (lvl === 2) {
          tooltip = tr("Level 2 tooltip");
        } else if (lvl === 3) {
          tooltip = tr("Level 3 tooltip");
        }

        return (
          <button
            key={lvl}
            type="button"
            disabled={isDisabled}
            onClick={() => onChange(lvl)}
            className={`w-7 h-7 flex items-center justify-center rounded-xl text-xs font-black transition-all ${activeClass}`}
            title={tooltip}
          >
            {lvl}
          </button>
        );
      })}
    </div>
  );
};
