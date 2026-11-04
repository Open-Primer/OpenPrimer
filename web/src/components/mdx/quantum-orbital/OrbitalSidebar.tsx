import React from 'react';
import { Layers, Sliders, Shield, BookOpen, AlertCircle, CircleDot } from 'lucide-react';
import { ORBITALS } from './orbitalPresets';

interface SidebarProps {
  sidebarTab: 'presets' | 'quantum' | 'spectro';
  setSidebarTab: (tab: 'presets' | 'quantum' | 'spectro') => void;
  activePresetId: string;
  selectPreset: (id: string) => void;
  isHybridPreset: boolean;
  t: any;
  customN: number;
  setCustomN: (n: number) => void;
  customL: number;
  setCustomL: (l: number) => void;
  customM: number;
  setCustomM: (m: number) => void;
  customOrbitalInfo: any;
  energyLevelEv: string;
  atomicNumber: number;
  setAtomicNumber: (z: number) => void;
  renderElectronBox: (shell: string, maxElectrons: number) => React.ReactNode;
}

export const OrbitalSidebar: React.FC<SidebarProps> = ({
  sidebarTab,
  setSidebarTab,
  activePresetId,
  selectPreset,
  isHybridPreset,
  t,
  customN,
  setCustomN,
  customL,
  setCustomL,
  customM,
  setCustomM,
  customOrbitalInfo,
  energyLevelEv,
  atomicNumber,
  setAtomicNumber,
  renderElectronBox
}) => {
  const mode = sidebarTab === 'presets' ? 'preset' : 'schrodinger';
  const setMode = (m: string) => setSidebarTab(m === 'preset' ? 'presets' : 'quantum');
  const electronCount = atomicNumber;
  const setElectronCount = (val: any) => setAtomicNumber(typeof val === 'function' ? val(atomicNumber) : Number(val?.target?.value ?? val));
  const renderShellElectrons = renderElectronBox;
  const customInfo = customOrbitalInfo || { name: '', desc: '', geometry: '' };
  const activePreset = ORBITALS.find(o => o.id === activePresetId) || ORBITALS[0] || { name: '', description: '', geometry: '' };
  return (
      <div className="lg:col-span-5 flex flex-col justify-between bg-slate-900/30 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="space-y-4">
            {/* Tab switch buttons */}
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-950/60 border border-slate-900 rounded-xl">
              <button
                onClick={() => setMode('preset')}
                className={`py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                  mode === 'preset'
                    ? 'bg-slate-900 text-cyan-400 font-extrabold border border-slate-800/50 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t["Aufbau Shell Filler"] || "Aufbau Filler"}
              </button>
              <button
                onClick={() => setMode('schrodinger')}
                className={`py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                  mode === 'schrodinger'
                    ? 'bg-slate-900 text-cyan-400 font-extrabold border border-slate-800/50 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                🔬 {t["Schrödinger Lab"] || "Schrödinger Lab"}
              </button>
            </div>

            {/* TAB CONTENT: AUFBAU FILLER */}
            {mode === 'preset' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider">
                    {t["Aufbau Puzzle"] || "Aufbau Puzzle"}
                  </span>

                  {/* Interactive electron counter */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setElectronCount((e: any) => Math.max(1, e - 1))}
                      className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-800 hover:text-white text-slate-400 flex items-center justify-center font-bold cursor-pointer text-xs active:scale-95"
                      title={t["Remove Electron"]}
                    >
                      -
                    </button>
                    <span className="text-xs font-mono font-black text-slate-200 w-12 text-center bg-slate-950/50 py-0.5 border border-slate-900 rounded">
                      {electronCount} e⁻
                    </span>
                    <button
                      onClick={() => setElectronCount((e: any) => Math.min(10, e + 1))}
                      className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-800 hover:text-white text-slate-400 flex items-center justify-center font-bold cursor-pointer text-xs active:scale-95"
                      title={t["Add Electron"]}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Visual Shell levels graph */}
                <div className="relative border-l border-slate-800/80 pl-4 py-1 space-y-3">
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500/50 via-indigo-500/30 to-slate-900/10" />

                  {/* 2p Subshell */}
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider block">{t["Subshell 2p"]}</span>
                    <div className="flex gap-2">
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] font-mono font-black text-slate-400">2p_x</span>
                        {renderShellElectrons('2px', 2)}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] font-mono font-black text-slate-400">2p_y</span>
                        {renderShellElectrons('2py', 2)}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] font-mono font-black text-slate-400">2p_z</span>
                        {renderShellElectrons('2pz', 2)}
                      </div>
                    </div>
                  </div>

                  {/* 2s Subshell */}
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider block">{t["Subshell 2s"]}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-black text-slate-400">2s</span>
                      {renderShellElectrons('2s', 2)}
                    </div>
                  </div>

                  {/* 1s Subshell */}
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider block">{t["Subshell 1s"]}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-black text-slate-400">1s</span>
                      {renderShellElectrons('1s', 2)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: SCHRODINGER SANDBOX */}
            {mode === 'schrodinger' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider block">{t["Hydrogenic Quantum Numbers"] || "Hydrogenic Quantum Numbers"}</span>
                
                <div className="space-y-3">
                  {/* n Slider */}
                  <div className="space-y-1 bg-slate-950/40 p-2.5 rounded-xl border border-slate-900">
                    <label className="text-[9px] font-black uppercase text-cyan-400 tracking-wider flex justify-between">
                      <span>{t["n (Principal)"] || "n (Principal)"}</span>
                      <span className="font-mono text-white text-xs">{customN}</span>
                    </label>
                    <input
                      type="range" min={1} max={4} step={1} value={customN}
                      onChange={(e) => {
                        const nextN = parseInt(e.target.value, 10);
                        setCustomN(nextN);
                        // Restrict l
                        if (customL >= nextN) {
                          const nextL = nextN - 1;
                          setCustomL(nextL);
                          if (Math.abs(customM) > nextL) setCustomM(0);
                        }
                      }}
                      className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                    />
                    <span className="text-[8px] text-slate-550 font-bold block">{t["Determines shell energy and size (1 to 4)"] || "Determines shell energy and size (1 to 4)"}</span>
                  </div>

                  {/* l Slider */}
                  <div className="space-y-1 bg-slate-950/40 p-2.5 rounded-xl border border-slate-900">
                    <label className="text-[9px] font-black uppercase text-indigo-400 tracking-wider flex justify-between">
                      <span>{t["l (Azimuthal)"] || "l (Azimuthal)"}</span>
                      <span className="font-mono text-white text-xs">
                        {customL} ({['s', 'p', 'd', 'f'][customL] || 's'})
                      </span>
                    </label>
                    <input
                      type="range" min={0} max={customN - 1} step={1} value={customL}
                      onChange={(e) => {
                        const nextL = parseInt(e.target.value, 10);
                        setCustomL(nextL);
                        // Restrict m
                        if (Math.abs(customM) > nextL) {
                          setCustomM(0);
                        }
                      }}
                      className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                    <span className="text-[8px] text-slate-550 font-bold block">{t["Determines subshell shape (0 to n-1)"] || "Determines subshell shape (0 to n-1)"}</span>
                  </div>

                  {/* m Slider */}
                  <div className="space-y-1 bg-slate-950/40 p-2.5 rounded-xl border border-slate-900">
                    <label className="text-[9px] font-black uppercase text-amber-400 tracking-wider flex justify-between">
                      <span>{t["m (Magnetic)"] || "m (Magnetic)"}</span>
                      <span className="font-mono text-white text-xs">{customM >= 0 ? `+${customM}` : customM}</span>
                    </label>
                    <input
                      type="range" min={-customL} max={customL} step={1} value={customM}
                      onChange={(e) => setCustomM(parseInt(e.target.value, 10))}
                      className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-amber-500"
                      disabled={customL === 0}
                    />
                    <span className="text-[8px] text-slate-550 font-bold block">{t["Determines spatial orientation (-l to +l)"] || "Determines spatial orientation (-l to +l)"}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Active Preset or Custom detailed chemical annotation */}
          <div className="pt-4 border-t border-slate-800/80 space-y-2">
            <h5 className="text-xs font-black text-white flex items-center gap-1.5">
              <CircleDot className="w-3.5 h-3.5 text-cyan-400" />
              <span>
                {mode === 'schrodinger'
                  ? `${t["Orbital"] || "Orbital"} ${customInfo.name}`
                  : (activePreset.name && t[activePreset.name]) || activePreset.name || ''}
              </span>
            </h5>
            <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
              {mode === 'schrodinger'
                ? customInfo.desc
                : (activePreset.description && t[activePreset.description]) || activePreset.description || ''}
            </p>

            <div className="bg-slate-950/40 border border-slate-800 p-2.5 rounded-xl flex justify-between items-center text-[10px] font-bold">
              <span className="text-slate-500 uppercase">{t["Bond Geometry"] || "Geometry"}</span>
              <span className="text-cyan-400 font-black">
                {mode === 'schrodinger'
                  ? customInfo.geometry
                  : (activePreset.geometry && t[activePreset.geometry]) || activePreset.geometry || ''}
              </span>
            </div>
          </div>
        </div>
  );
};
