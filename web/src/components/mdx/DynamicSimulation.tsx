import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Play, Pause, RotateCcw, Activity, Info, FastForward } from 'lucide-react';
import { STATIC_UI_STRINGS } from '@/lib/translations';
import { PRESETS, SimulationPreset } from './dynamic-sim/presets';
import { DrawMitosis, DrawCarnot, DrawWaves, DrawDoubleSlit, DrawEnzyme } from './dynamic-sim/SpecimenDrawers';

export { PRESETS };
export type { SimulationPreset };

export const DynamicSimulation = ({ presetId = "mitosis", gradeLevel }: { presetId?: string; gradeLevel?: 'middle_school' | 'high_school' | 'university' }) => {
  const { language } = useLanguage();
  const t = (STATIC_UI_STRINGS[language.toUpperCase() as keyof typeof STATIC_UI_STRINGS] || STATIC_UI_STRINGS.EN) as any;

  const activePresetRaw = PRESETS.find(p => p.id === presetId) || PRESETS[0];

  const activePreset = React.useMemo(() => {
    return {
      ...activePresetRaw,
      name: (activePresetRaw?.name && t[activePresetRaw.name]) || activePresetRaw?.name || '',
      description: (activePresetRaw?.description && t[activePresetRaw.description]) || activePresetRaw?.description || '',
      stages: activePresetRaw.stages.map(s => ({
        ...s,
        label: (s?.label && t[s.label]) || s?.label || '',
        details: (s?.details && t[s.details]) || s?.details || ''
      }))
    };
  }, [activePresetRaw, t]);

  const [progress, setProgress] = useState(0); // 0 to 100 timeline scrubber
  const [isPlaying, setIsPlaying] = useState(false);
  const playRef = useRef<number | null>(null);

  // Extra simulation parameters
  const [freq, setFreq] = useState(1.5);        // For waves / double slit
  const [amp, setAmp] = useState(30);         // For waves
  const [wavelength, setWavelength] = useState(500); // Nanometers for double-slit color representation

  // === Carnot sandbox parameters ===
  const [carnotTh, setCarnotTh] = useState(600);  // Hot reservoir temperature (K)
  const [carnotTc, setCarnotTc] = useState(300);  // Cold sink temperature (K)

  // === Enzyme sandbox parameters ===
  const [enzymeConc, setEnzymeConc] = useState(5);      // Enzyme concentration (arbitrary units 1-10)
  const [substrateConc, setSubstrateConc] = useState(5); // Substrate [S] (µM, 1-20)
  const [enzymeTemp, setEnzymeTemp] = useState(37);      // Temperature (°C)
  const KM = 4; // Michaelis constant (µM) — fixed for the demo

  // === Mitosis sandbox parameters ===
  const [mitosisSpeed, setMitosisSpeed] = useState(1.0);  // Speed multiplier (0.25–3.0)
  const [mitosisPathological, setMitosisPathological] = useState(false); // Cancer/trisomy toggle

  useEffect(() => {
    setProgress(0);
    setIsPlaying(false);
  }, [presetId]);

  // Handle play/pause looping
  useEffect(() => {
    if (isPlaying) {
      const step = () => {
        setProgress((prev) => {
          if (prev >= 100) {
            return 0; // Loop around
          }
          const speedMultiplier = activePreset.id === 'mitosis' ? mitosisSpeed : 1.0;
          return prev + 0.35 * speedMultiplier; // Fine step with optional speed multiplier
        });
        playRef.current = requestAnimationFrame(step);
      };
      playRef.current = requestAnimationFrame(step);
    } else {
      if (playRef.current) cancelAnimationFrame(playRef.current);
    }

    return () => {
      if (playRef.current) cancelAnimationFrame(playRef.current);
    };
  }, [isPlaying]);

  // Find active step description
  const activeStage = React.useMemo(() => {
    let matched = activePreset.stages[0];
    activePreset.stages.forEach(s => {
      if (progress >= s.at) {
        matched = s;
      }
    });
    return matched;
  }, [progress, activePreset]);


  const renderSpecimenCanvas = () => {
    switch (activePreset.id) {
      case "mitosis":
        return <DrawMitosis progress={progress} t={t} />;
      case "carnot":
        return <DrawCarnot progress={progress} t={t} />;
      case "waves":
        return <DrawWaves progress={progress} t={t} />;
      case "doubleslit":
        return <DrawDoubleSlit progress={progress} t={t} />;
      case "enzyme":
        return <DrawEnzyme progress={progress} t={t} />;
      default:
        return null;
    }
  };

  // ─── Derived sandbox values ───────────────────────────────────────────────
  const carnotEfficiency = Math.max(0, Math.min(1, 1 - carnotTc / carnotTh));
  const vMax = enzymeConc * 2; // Vmax proportional to enzyme concentration
  const tempFactor = enzymeTemp <= 10 ? 0.15 : enzymeTemp <= 37 ? (enzymeTemp / 37) * 0.85 + 0.15 : Math.max(0.05, 1 - (enzymeTemp - 37) / 80);
  const reactionVelocity = (vMax * substrateConc) / (KM + substrateConc) * tempFactor;
  const vMaxAdjusted = vMax * tempFactor;

  return (
    <div className="my-8 rounded-3xl overflow-hidden border border-slate-800/80 bg-slate-950/40 backdrop-blur-xl shadow-2xl p-6 sm:p-8">
      {/* Simulation Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5 mb-5">
        <div>
          <h4 className="text-sm font-black text-slate-100 uppercase tracking-widest flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{activePreset.name}</span>
          </h4>
          <p className="text-[11px] text-slate-400 font-semibold mt-1">
            {t["Play, pause or manually scrub the timeline to study step-by-step states."] || "Play, pause or manually scrub the timeline to study step-by-step states."}
          </p>
        </div>
      </div>

      {/* Main active specimen display */}
      <div className="bg-slate-950/80 rounded-2xl border border-slate-900 p-5 min-h-[220px] flex items-center justify-center">
        <div className="w-full">
          {renderSpecimenCanvas()}
        </div>
      </div>

      {/* ═══ CARNOT SANDBOX PANEL ═══ */}
      {activePreset.id === 'carnot' && (
        <div className="mt-4 p-5 rounded-2xl border border-amber-500/20 bg-amber-500/5 space-y-4">
          <span className="text-[9px] font-black uppercase tracking-widest text-amber-400 flex items-center gap-1.5">🔬 Carnot Heat Engine Sandbox</span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-amber-400 tracking-wider flex justify-between">
                <span>Hot Reservoir T<sub>h</sub></span>
                <span className="font-mono text-amber-300">{carnotTh} K</span>
              </label>
              <input type="range" min={carnotTc + 10} max={1200} step={10} value={carnotTh}
                onChange={e => setCarnotTh(parseInt(e.target.value))}
                className="w-full h-1 rounded-lg appearance-none cursor-pointer accent-amber-500" />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider flex justify-between">
                <span>Cold Sink T<sub>c</sub></span>
                <span className="font-mono text-slate-300">{carnotTc} K</span>
              </label>
              <input type="range" min={50} max={carnotTh - 10} step={10} value={carnotTc}
                onChange={e => setCarnotTc(parseInt(e.target.value))}
                className="w-full h-1 rounded-lg appearance-none cursor-pointer accent-slate-500" />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex-1 bg-slate-950/60 border border-amber-500/20 rounded-xl p-4 flex flex-col items-center gap-1">
              <span className="text-[9px] font-black uppercase text-amber-400 tracking-wider">Carnot Efficiency η = 1 − T<sub>c</sub>/T<sub>h</sub></span>
              <div className="w-full bg-slate-900 rounded-full h-3 mt-2 overflow-hidden">
                <div className="h-3 rounded-full transition-all duration-500"
                  style={{ width: `${carnotEfficiency * 100}%`, background: `linear-gradient(90deg, #f59e0b, #ef4444)` }} />
              </div>
              <span className="font-mono font-black text-2xl text-amber-300 mt-1">{(carnotEfficiency * 100).toFixed(1)}%</span>
              <span className="text-[10px] text-slate-500 font-semibold">Maximum theoretical efficiency</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
              <div className="text-2xl">🔥</div>
              <span className="text-[10px] text-amber-400 font-black">{carnotTh} K</span>
              <div className="w-0.5 h-8 bg-gradient-to-b from-amber-500 to-slate-600" />
              <div className="text-2xl">🧊</div>
              <span className="text-[10px] text-slate-400 font-black">{carnotTc} K</span>
            </div>
          </div>
        </div>
      )}

      {/* ═══ ENZYME SANDBOX PANEL ═══ */}
      {activePreset.id === 'enzyme' && (
        <div className="mt-4 p-5 rounded-2xl border border-pink-500/20 bg-pink-500/5 space-y-4">
          <span className="text-[9px] font-black uppercase tracking-widest text-pink-400 flex items-center gap-1.5">🔬 Enzyme Kinetics Sandbox (Michaelis-Menten)</span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-pink-400 tracking-wider flex justify-between">
                <span>[Enzyme]</span>
                <span className="font-mono text-pink-300">{enzymeConc}</span>
              </label>
              <input type="range" min={1} max={10} step={1} value={enzymeConc}
                onChange={e => setEnzymeConc(parseInt(e.target.value))}
                className="w-full h-1 rounded-lg appearance-none cursor-pointer accent-pink-500" />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-indigo-400 tracking-wider flex justify-between">
                <span>[Substrate] S (µM)</span>
                <span className="font-mono text-indigo-300">{substrateConc}</span>
              </label>
              <input type="range" min={1} max={20} step={1} value={substrateConc}
                onChange={e => setSubstrateConc(parseInt(e.target.value))}
                className="w-full h-1 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-amber-400 tracking-wider flex justify-between">
                <span>Temperature (°C)</span>
                <span className={`font-mono font-black ${enzymeTemp > 60 ? 'text-red-400' : enzymeTemp < 20 ? 'text-blue-400' : 'text-amber-300'}`}>{enzymeTemp}°C</span>
              </label>
              <input type="range" min={0} max={100} step={1} value={enzymeTemp}
                onChange={e => setEnzymeTemp(parseInt(e.target.value))}
                className="w-full h-1 rounded-lg appearance-none cursor-pointer accent-amber-500" />
            </div>
          </div>
          {/* Michaelis-Menten mini bar chart */}
          <div className="flex items-end gap-2 h-20 bg-slate-950/60 border border-pink-500/15 rounded-xl px-4 py-2 overflow-hidden">
            {Array.from({ length: 15 }).map((_, i) => {
              const s = (i + 1) * 1.4;
              const v = (vMaxAdjusted * s) / (KM + s);
              const vRatio = vMaxAdjusted > 0 ? v / vMaxAdjusted : 0;
              const isActive = Math.round(substrateConc / 1.4) === i;
              return (
                <div key={i} className="flex-1 flex flex-col items-center justify-end gap-0.5">
                  <div className="w-full rounded-t transition-all duration-300" style={{
                    height: `${vRatio * 64}px`,
                    background: isActive ? '#ec4899' : 'rgba(236,72,153,0.3)'
                  }} />
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[9px] text-slate-500 font-bold">v = Vmax·[S] / (Km + [S])    Km = {KM} µM</span>
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-pink-400 font-black">v = <span className="font-mono text-white">{reactionVelocity.toFixed(2)}</span> µmol/min</span>
              <span className="text-[10px] text-slate-500 font-bold">Vmax = {vMaxAdjusted.toFixed(1)}</span>
            </div>
          </div>
          {enzymeTemp > 60 && <p className="text-[10px] text-red-400 font-bold">⚠️ Enzyme denaturation: protein structure collapses above ~60°C, sharply reducing activity.</p>}
          {enzymeTemp < 15 && <p className="text-[10px] text-blue-400 font-bold">🧊 Very low temperature: molecular collisions are rare, slowing reaction rate significantly.</p>}
        </div>
      )}

      {/* ═══ MITOSIS SANDBOX PANEL ═══ */}
      {activePreset.id === 'mitosis' && (
        <div className="mt-4 p-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 space-y-4">
          <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">🔬 Mitosis Mutation Lab</span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-emerald-400 tracking-wider flex justify-between">
                <span>Division Speed</span>
                <span className="font-mono text-emerald-300">{mitosisSpeed.toFixed(2)}×</span>
              </label>
              <input type="range" min={0.25} max={4} step={0.25} value={mitosisSpeed}
                onChange={e => setMitosisSpeed(parseFloat(e.target.value))}
                className="w-full h-1 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
              <p className="text-[9px] text-slate-500 font-bold">High speed → chromosomes may not segregate properly</p>
            </div>
            <div className="flex flex-col items-start gap-2">
              <span className="text-[9px] font-black uppercase text-rose-400 tracking-wider">Pathological Replication</span>
              <button
                onClick={() => setMitosisPathological(p => !p)}
                className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider border select-none cursor-pointer transition-all ${
                  mitosisPathological
                    ? 'bg-rose-600 border-rose-500 text-white shadow-lg shadow-rose-500/20'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {mitosisPathological ? '🦠 Pathological ON (Cancer Mode)' : '✅ Normal Mitosis'}
              </button>
              {mitosisPathological && (
                <p className="text-[10px] text-rose-400 font-bold leading-relaxed">Spindle checkpoint bypass: chromosomes may fail to separate correctly, producing aneuploid daughter cells (incorrect chromosome number). Models trisomy and cancer replication errors.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Control center panel HUD with timeline scrubber and description */}
      <div className="mt-5 space-y-4 pt-4 border-t border-slate-800/80">
        
        {/* Scrubber Playback row */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all cursor-pointer shadow-lg flex items-center justify-center"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 pl-0.5" />}
            </button>

            <button
              onClick={() => {
                setIsPlaying(false);
                setProgress(0);
              }}
              className="p-3 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer"
              title={t["Reset Timeline"] || "Reset Timeline"}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 w-full flex items-center gap-3">
            <span className="text-[10px] font-black text-slate-500 w-8 text-right font-mono">
              {Math.floor(progress)}%
            </span>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={progress}
              onChange={(e) => {
                setIsPlaying(false);
                setProgress(parseInt(e.target.value));
              }}
              className="flex-1 h-1.5 bg-slate-900 accent-emerald-400 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-[10px] font-black text-slate-500 w-8 font-mono">
              100%
            </span>
          </div>
        </div>

        {/* Step-by-Step Didactic readout description block */}
        <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-4 flex items-start gap-3">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mt-0.5">
            <Info className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">
              {activeStage.label}
            </span>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-semibold">
              {activeStage.details}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
