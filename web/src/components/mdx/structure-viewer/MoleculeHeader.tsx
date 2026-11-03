import React from 'react';
import { Preset } from './structure-viewer/presets';
import { Loader2 } from 'lucide-react';

interface MoleculeHeaderProps {
  activePreset: Preset;
  presetList: Preset[];
  onSelectPreset: (preset: Preset) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  handleSearchAndLoad: () => void;
  isLoading: boolean;
  localStr: any;
  t: any;
}

export const MoleculeHeader: React.FC<MoleculeHeaderProps> = ({
  activePreset,
  presetList,
  onSelectPreset,
  searchQuery,
  setSearchQuery,
  handleSearchAndLoad,
  isLoading,
  localStr,
  t
}) => {
  return (
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5 mb-5">
        <div>
          <h4 className="text-sm font-black text-slate-100 uppercase tracking-widest flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{t["Interactive 3D Structure Viewer"]}</span>
          </h4>
          <p className="text-[11px] text-slate-400 font-semibold mt-1">
            {t["Drag to rotate molecule. Scroll/slider to zoom. Click an atom to inspect properties."]}
          </p>
        </div>

        {/* Preset pill list & Search Bar container */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {shouldShowPresetsMenu && (
            <div className="flex flex-wrap gap-1.5">
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setActivePreset(p);
                    setSelectedAtomIndex(null);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer border ${
                    activePreset.id === p.id
                      ? "bg-amber-500/10 border-amber-500/30 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.15)]"
                      : "bg-slate-900/60 border-slate-800/80 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {(t[p.name] || p.name).split(' ')[0]}
                </button>
              ))}
            </div>
          )}

          {/* Real-time search/load from PubChem */}
          <form onSubmit={handleSearch} className="flex items-center gap-1.5 bg-slate-900/40 border border-slate-800/80 rounded-xl p-1 shrink-0">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={localStr.searchPlaceholder}
              className="bg-transparent text-[10px] text-slate-200 placeholder-slate-500 font-bold px-2.5 py-1 focus:outline-none w-[170px] sm:w-[190px]"
            />
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_10px_rgba(245,158,11,0.2)] hover:scale-[1.02]"
            >
              {localStr.loadBtn}
            </button>
          </form>
        </div>
      </div>


  );
};
