import React from 'react';
import { Search, Plus, Sparkles, Layers, Lock, Unlock, Code, ChevronRight, Loader2, Ban } from 'lucide-react';

interface WidgetCatalogGridProps {
  loading?: boolean;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  sortBy: 'alphabetical' | 'level' | 'discipline';
  setSortBy: (s: 'alphabetical' | 'level' | 'discipline') => void;
  setIsCreateModalOpen: (v: boolean) => void;
  filteredWidgets: any[];
  selectedWidget: any;
  setSelectedWidget: (w: any) => void;
  getWidgetName: (w: any) => string;
  getWidgetDesc: (w: any) => string;
  getWidgetLevel: (w: any) => string;
  getDisciplineColor: (d: string) => string;
  getDisciplineLabel: (d: string, lang: string) => string;
  lang: string;
  adminId: string;
  acquireLock: (id: string) => Promise<boolean>;
  releaseLock: (id: string, force?: boolean) => Promise<boolean>;
  handleForceUnlock: (id: string) => void;
  t: any;
  tr: (key: string) => string;
}

export const WidgetCatalogGrid: React.FC<WidgetCatalogGridProps> = ({
  loading = false,
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  setIsCreateModalOpen,
  filteredWidgets,
  selectedWidget,
  setSelectedWidget,
  getWidgetName,
  getWidgetDesc,
  getWidgetLevel,
  getDisciplineColor,
  getDisciplineLabel,
  lang,
  adminId,
  acquireLock,
  releaseLock,
  handleForceUnlock,
  t,
  tr
}) => {
  return (
      <div className="bg-slate-900/40 border border-slate-800 rounded-[35px] p-6 space-y-6 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3 w-full sm:max-w-2xl flex-grow">
            <div className="relative flex-grow max-w-md">
              <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={tr("Filter components, subjects...")}
                className="w-full bg-slate-950/80 border border-slate-800/60 hover:border-slate-800 rounded-2xl py-2.5 pl-11 pr-4 text-xs focus:outline-none focus:border-teal-555 text-white placeholder-slate-600 transition-colors"
              />
            </div>
            {/* Sort Selector Dropdown */}
            <div className="relative shrink-0">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="appearance-none bg-slate-950/80 border border-slate-800/60 hover:border-slate-800 text-slate-300 hover:text-white rounded-2xl py-2.5 pl-4 pr-10 text-xs focus:outline-none focus:border-teal-555 transition-colors cursor-pointer"
                style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%252394a3b8'%3e%3cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3e%3c/svg%3e")`, backgroundPosition: 'right 12px center', backgroundSize: '16px', backgroundRepeat: 'no-repeat' }}
              >
                <option value="alphabetical">{tr("Sort: Alphabetical")}</option>
                <option value="level">{tr("Sort: Academic Level")}</option>
                <option value="discipline">{tr("Sort: Subject Area")}</option>
              </select>
            </div>
          </div>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider shrink-0">
            {filteredWidgets.length} {tr("catalog widgets")}
          </span>
        </div>

        {/* CATALOG LIST IN BEAUTIFUL HORIZONTAL GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-h-[340px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-800">
          {loading ? (
            <div className="col-span-full flex flex-col items-center justify-center p-12 text-center space-y-3">
              <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
              <p className="text-[10px] text-slate-550 font-bold uppercase tracking-widest">
                {tr("Scanning MDX directory...")}
              </p>
            </div>
          ) : filteredWidgets.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center p-12 text-center space-y-2">
              <Ban className="w-8 h-8 text-slate-650" />
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
                {tr("No matching widgets")}
              </p>
            </div>
          ) : (
            filteredWidgets.map(widget => {
              const isSelected = selectedWidget?.id === widget.id;
              const activeLock = widget.lock;
              const isLockedByOther = activeLock && activeLock.adminId !== adminId && Date.now() < activeLock.expiresAt;

              return (
                <div
                  key={widget.id}
                  onClick={() => setSelectedWidget(widget)}
                  className={`p-4 rounded-[20px] border transition-all cursor-pointer flex flex-col justify-between gap-3 group relative ${isSelected ? 'bg-teal-500/10 border-teal-500/40 ring-1 ring-teal-500/10' : 'bg-slate-950/40 border-slate-900/60 hover:border-slate-800 hover:bg-slate-900/20'}`}
                >
                  {/* LOCK OVERLAY INDICATION */}
                  {isLockedByOther && (
                    <div className="absolute top-2.5 right-2 px-2 py-1 bg-red-500/10 border border-red-500/20 rounded-md text-[8px] font-bold text-red-400 flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" />
                      {activeLock.adminId}
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-4">
                      <h4 className={`text-xs font-black transition-all ${isSelected ? 'text-teal-400' : 'text-slate-200 group-hover:text-white'}`}>
                        {getWidgetName(widget)}
                      </h4>
                      {!isLockedByOther && (
                        <span className="px-2 py-0.5 bg-slate-950/80 border border-slate-800/80 rounded-md text-[7px] font-mono font-bold text-slate-450 shrink-0">
                          {widget.linesCount} LOC
                        </span>
                      )}
                    </div>
                    
                    <p className="text-[9px] text-slate-400 font-medium leading-relaxed line-clamp-2">
                      {getWidgetDesc(widget)}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-900/60">
                    <div className="flex flex-wrap gap-1">
                      {widget.disciplines.slice(0, 2).map((disc: string) => (
                        <span
                          key={disc}
                          className={`px-1.5 py-0.5 border text-[6px] font-black uppercase tracking-wider rounded-full ${getDisciplineColor(disc)}`}
                        >
                          {getDisciplineLabel(disc, lang)}
                        </span>
                      ))}
                      {widget.disciplines.length > 2 && (
                        <span className="text-[6px] font-bold text-slate-500 self-center">
                          +{widget.disciplines.length - 2}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[7px] font-mono bg-slate-950/60 text-slate-500 px-1.5 py-0.5 rounded border border-slate-800/60">
                        {widget.id}
                      </span>
                      <span className="text-[7px] font-bold text-slate-500 uppercase font-mono">
                        🎓 {getWidgetLevel(widget)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>


  );
};
