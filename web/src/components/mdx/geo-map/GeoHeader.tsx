"use client";

import React from 'react';
import { Globe, Map, Compass } from 'lucide-react';

interface HeaderProps {
  t: any;
  mode: 'explore' | 'quiz';
  setMode: (m: 'explore' | 'quiz') => void;
  selectedLayer?: 'political' | 'physical' | 'demographic' | 'economic';
  setSelectedLayer?: (l: 'political' | 'physical' | 'demographic' | 'economic') => void;
  handleZoom?: (d: 'in' | 'out') => void;
  handleReset?: () => void;
  handlePan?: (d: 'up' | 'down' | 'left' | 'right') => void;
}

export const GeoHeader: React.FC<HeaderProps> = ({
  t,
  mode,
  setMode
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800/80 pb-5 mb-6">
      <div>
        <div className="flex items-center gap-2.5 mb-1.5">
          <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
            <Compass className="w-5 h-5 animate-spin-slow" />
          </div>
          <h3 className="text-lg md:text-xl font-black text-white leading-none">
            {t.title}
          </h3>
        </div>
        <p className="text-xs text-slate-400">
          {t.subtitle}
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl">
        <button
          onClick={() => setMode('explore')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
            mode === 'explore'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>{t.exploreMode}</span>
        </button>
        <button
          onClick={() => setMode('quiz')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
            mode === 'quiz'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Map className="w-3.5 h-3.5" />
          <span>{t.quizMode}</span>
        </button>
      </div>
    </div>
  );
};
