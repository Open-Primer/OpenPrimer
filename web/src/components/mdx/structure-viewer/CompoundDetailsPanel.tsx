import React from 'react';
import { Preset } from './presets';
import { Zap, Eye } from 'lucide-react';

interface CompoundDetailsProps {
  activePreset: Preset;
  selectedAtomIndex: number | null;
  localStr: any;
  t: any;
}

export const CompoundDetailsPanel: React.FC<CompoundDetailsProps> = ({
  activePreset,
  selectedAtomIndex,
  localStr,
  t
}) => {
  return (
        {/* Compound details & Info card (1 col) */}
        <div className="lg:col-span-1 flex flex-col justify-between bg-slate-900/30 border border-slate-800 rounded-2xl p-5 space-y-4">
          
          {selectedAtom && selectedElement ? (
            <div className="space-y-3.5 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-amber-400 tracking-widest bg-amber-500/5 border border-amber-500/10 px-2.5 py-1 rounded-lg w-max block">
                  {t["Atom Inspector"]}
                </span>
                <button 
                  onClick={() => setSelectedAtomIndex(null)}
                  className="text-[10px] font-bold text-slate-500 hover:text-slate-300 uppercase cursor-pointer"
                >
                  {t["Clear"]}
                </button>
              </div>

              <div className="flex items-center gap-3 bg-slate-950/40 border border-slate-800 p-3 rounded-xl">
                <div 
                  className="w-11 h-11 rounded-lg flex items-center justify-center text-lg font-black text-white shadow-md border border-slate-800"
                  style={{ backgroundColor: selectedAtom.color }}
                >
                  {selectedAtom.label}
                </div>
                <div>
                  <h5 className="text-xs font-black text-white">{t[selectedElement.nameEN] || selectedElement.nameEN}</h5>
                  <p className="text-[10px] text-slate-400 font-bold">{t[selectedElement.categoryEN] || selectedElement.categoryEN}</p>
                </div>
              </div>

              <div className="space-y-1.5 border-t border-slate-800/80 pt-3">
                <div className="flex justify-between items-center text-[10px] font-bold">
                  <span className="text-slate-500 uppercase tracking-wide">{t["Atomic Number"]}</span>
                  <span className="text-slate-300 font-black">{selectedElement.num}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold">
                  <span className="text-slate-500 uppercase tracking-wide">{t["Atomic Mass"]}</span>
                  <span className="text-slate-300 font-black">{selectedElement.weight} u</span>
                </div>
                
                {gradeLevel !== "middle_school" && (
                  <>
                    <div className="flex justify-between items-center text-[10px] font-bold">
                      <span className="text-slate-500 uppercase tracking-wide">{t["Configuration"]}</span>
                      <span className="text-slate-300 font-mono font-black">{selectedElement.config}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-bold">
                      <span className="text-slate-500 uppercase tracking-wide">{t["Electronegativity"]}</span>
                      <span className="text-slate-300 font-black">{selectedElement.electronegativity}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <span className="text-[10px] font-black uppercase text-amber-400 tracking-widest flex items-center gap-1 bg-amber-500/5 border border-amber-500/10 px-2.5 py-1 rounded-lg w-max">
                {t["Active Specimen"]}
              </span>
              <h5 className="text-sm font-extrabold text-slate-100">{t[activePreset.name] || activePreset.name}</h5>
              <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                {t[activePreset.description] || activePreset.description}
              </p>
            </div>
          )}

          <div className="pt-4 border-t border-slate-800/80 space-y-2">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">
              {t["Atom Legend"]}
            </span>
            <div className="flex flex-col gap-1.5">
              {Array.from(new Map(activePreset.atoms.map(a => [a.label, a])).values()).map((atom, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full border border-slate-900 shadow-sm"
                    style={{ backgroundColor: atom.color }}
                  />
                  <span className="text-[10px] font-black text-slate-300">{atom.label}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

  );
};
