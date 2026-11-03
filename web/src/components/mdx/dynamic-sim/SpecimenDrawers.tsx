import React from 'react';

interface DrawerProps {
  progress: number;
  t: any;
}

export const DrawMitosis: React.FC<DrawerProps> = ({ progress, t }) => {
    const p = progress / 100;
    
    // Coordinates for dual nucleus poles
    const poleLeftX = 150 - (p * 50);
    const poleRightX = 250 + (p * 50);
    
    // Cell shape pinching
    // Cleavage furrow: path constricts inside the center as p approaches 100%
    const centerPinch = p < 0.6 ? 0 : (p - 0.6) * 2.5; // constricts from 0 to 1
    const pathD = p < 0.6 
      ? "M 100 120 C 100 60, 300 60, 300 120 C 300 180, 100 180, 100 120 Z" // Oval
      : `M 100 120 C 100 65, 185 ${60 + (centerPinch*45)}, 200 ${120 - (centerPinch*25)} C 215 ${60 + (centerPinch*45)}, 300 65, 300 120 C 300 175, 215 ${180 - (centerPinch*45)}, 200 ${120 + (centerPinch*25)} C 185 ${180 - (centerPinch*45)}, 100 175, 100 120 Z`;

    return (
      <svg viewBox="0 0 400 240" className="w-full h-auto max-h-[280px]">
        {/* Cleavage Cytoplasm body */}
        <path
          d={pathD}
          fill="url(#cell-grad)"
          stroke="#10b981"
          strokeWidth="2.5"
          className="transition-all duration-100"
        />

        {/* Spindle poles (Centrioles) appearing after 25% */}
        {p > 0.2 && (
          <g className="opacity-80">
            {/* Left Centriole */}
            <circle cx={130} cy={120} r="4" fill="#6366f1" />
            {/* Right Centriole */}
            <circle cx={270} cy={120} r="4" fill="#6366f1" />
          </g>
        )}

        {/* Spindle Fibers pulling */}
        {p > 0.35 && p < 0.9 && (
          <g stroke="#818cf8" strokeWidth="0.5" strokeDasharray="2,2" className="opacity-60">
            {/* Spindles left */}
            <line x1={130} y1={120} x2={165 + p * 15} y2={95} />
            <line x1={130} y1={120} x2={165 + p * 15} y2={145} />
            {/* Spindles right */}
            <line x1={270} y1={120} x2={235 - p * 15} y2={95} />
            <line x1={270} y1={120} x2={235 - p * 15} y2={145} />
          </g>
        )}

        {/* Chromosomes details depending on phases */}
        {p < 0.25 && (
          // Interphase: Intact nucleus containing chromatin threads
          <g>
            <circle cx={200} cy={120} r="28" fill="#1e293b" stroke="#34d399" strokeWidth="1.5" strokeDasharray="3,3" />
            <path d="M 190 110 Q 200 130, 210 115 T 195 130" stroke="#f43f5e" strokeWidth="1" fill="none" className="opacity-50" />
            <path d="M 195 115 Q 185 125, 205 128 T 190 120" stroke="#60a5fa" strokeWidth="1" fill="none" className="opacity-50" />
          </g>
        )}

        {p >= 0.25 && p < 0.45 && (
          // Prophase: Condensed chromosomes random
          <g>
            {/* Chromosome X blobs */}
            <path d="M 180 100 L 195 115 M 195 100 L 180 115" stroke="#ec4899" strokeWidth="3" strokeLinecap="round" />
            <path d="M 210 125 L 225 140 M 225 125 L 210 140" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
          </g>
        )}

        {p >= 0.45 && p < 0.65 && (
          // Metaphase: Chromosomes aligned equatorially
          <g>
            <line x1={200} y1={80} x2={200} y2={160} stroke="rgba(244,63,94,0.3)" strokeWidth="1" strokeDasharray="3,3" />
            {/* Centered lining up chromosomes */}
            <path d="M 193 90 L 207 100 M 207 90 L 193 100" stroke="#ec4899" strokeWidth="3" strokeLinecap="round" />
            <path d="M 193 115 L 207 125 M 207 115 L 193 125" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
            <path d="M 193 140 L 207 150 M 207 140 L 193 150" stroke="#8b5cf6" strokeWidth="3" strokeLinecap="round" />
          </g>
        )}

        {p >= 0.65 && p < 0.9 && (
          // Anaphase: Pulled chromatids split
          <g>
            {/* Pulled Left */}
            <path d="M 165 95 L 155 90 M 165 95 L 155 102 M 165 135 L 155 130 M 165 135 L 155 142" stroke="#ec4899" strokeWidth="3" strokeLinecap="round" />
            {/* Pulled Right */}
            <path d="M 235 95 L 245 90 M 235 95 L 245 102 M 235 135 L 245 130 M 235 135 L 245 142" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
          </g>
        )}

        {p >= 0.9 && (
          // Telophase: 2 separate nuclei reforming
          <g>
            {/* Left Nucleolus */}
            <circle cx={145} cy={120} r="20" fill="#020617" stroke="#10b981" strokeWidth="1.5" />
            <path d="M 140 115 Q 145 125, 150 118" stroke="#ec4899" strokeWidth="1.5" fill="none" />
            {/* Right Nucleolus */}
            <circle cx={255} cy={120} r="20" fill="#020617" stroke="#10b981" strokeWidth="1.5" />
            <path d="M 250 115 Q 255 125, 260 118" stroke="#3b82f6" strokeWidth="1.5" fill="none" />
          </g>
        )}

        {/* Dynamic Labels with helper pointer lines */}
        <g className="text-[7.5px] font-extrabold fill-slate-400 opacity-90 select-none">
          {/* Plasma membrane label (always visible) */}
          <path d="M 70 50 L 95 50 L 110 80" stroke="#475569" strokeWidth="0.5" fill="none" />
          <text x={65} y={53} textAnchor="end" className="fill-emerald-400 uppercase tracking-wider">
            {t["Plasma membrane"] || "Plasma membrane"}
          </text>

          {/* Conditional labels based on phase */}
          {p < 0.25 && (
            <>
              {/* Noyau intact */}
              <path d="M 200 65 L 200 45 L 230 45" stroke="#475569" strokeWidth="0.5" fill="none" />
              <text x={235} y={48} textAnchor="start" className="fill-emerald-400 uppercase tracking-wider">
                {t["Cell nucleus"] || "Cell nucleus"}
              </text>

              {/* Chromatine */}
              <path d="M 195 125 L 180 155 L 150 155" stroke="#475569" strokeWidth="0.5" fill="none" />
              <text x={145} y={158} textAnchor="end" className="fill-pink-400 uppercase tracking-wider">
                {t["Diffuse chromatin"] || "Diffuse chromatin"}
              </text>
            </>
          )}

          {p >= 0.25 && p < 0.45 && (
            <>
              {/* Centrioles */}
              <path d="M 130 115 L 130 85 L 100 85" stroke="#475569" strokeWidth="0.5" fill="none" />
              <text x={95} y={88} textAnchor="end" className="fill-blue-400 uppercase tracking-wider">
                {t["Centrioles (Pole)"] || "Centrioles (Pole)"}
              </text>

              {/* Chromosomes condensés */}
              <path d="M 215 130 L 230 160 L 260 160" stroke="#475569" strokeWidth="0.5" fill="none" />
              <text x={265} y={163} textAnchor="start" className="fill-pink-400 uppercase tracking-wider">
                {t["Condensed chromosomes"] || "Condensed chromosomes"}
              </text>
            </>
          )}

          {p >= 0.45 && p < 0.65 && (
            <>
              {/* Plaque métaphasique */}
              <path d="M 200 70 L 200 45 L 230 45" stroke="#475569" strokeWidth="0.5" fill="none" />
              <text x={235} y={48} textAnchor="start" className="fill-pink-400 uppercase tracking-wider">
                {t["Equatorial plate"] || "Equatorial plate"}
              </text>

              {/* Fuseau mitotique */}
              <path d="M 160 110 L 160 70 L 140 70" stroke="#475569" strokeWidth="0.5" fill="none" />
              <text x={135} y={73} textAnchor="end" className="fill-blue-400 uppercase tracking-wider">
                {t["Mitotic spindle"] || "Mitotic spindle"}
              </text>
            </>
          )}

          {p >= 0.65 && p < 0.9 && (
            <>
              {/* Chromatides sœurs séparées */}
              <path d="M 160 90 L 160 60 L 180 60" stroke="#475569" strokeWidth="0.5" fill="none" />
              <text x={185} y={63} textAnchor="start" className="fill-pink-400 uppercase tracking-wider">
                {t["Sister chromatids"] || "Sister chromatids"}
              </text>

              {/* Sillon de division */}
              <path d="M 200 135 L 200 170 L 220 170" stroke="#475569" strokeWidth="0.5" fill="none" />
              <text x={225} y={173} textAnchor="start" className="fill-amber-400 uppercase tracking-wider">
                {t["Cleavage furrow"] || "Cleavage furrow"}
              </text>
            </>
          )}

          {p >= 0.9 && (
            <>
              {/* Enveloppe nucléaire en reformation */}
              <path d="M 135 110 L 120 70 L 95 70" stroke="#475569" strokeWidth="0.5" fill="none" />
              <text x={90} y={73} textAnchor="end" className="fill-emerald-400 uppercase tracking-wider">
                {t["Nuclear envelope"] || "Nuclear envelope"}
              </text>

              {/* Cytocinèse */}
              <path d="M 200 120 L 200 170 L 220 170" stroke="#475569" strokeWidth="0.5" fill="none" />
              <text x={225} y={173} textAnchor="start" className="fill-amber-400 uppercase tracking-wider">
                {t["Cytokinesis"] || "Cytokinesis"}
              </text>
            </>
          )}
        </g>

        <defs>
          <linearGradient id="cell-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.18" />
          </linearGradient>
        </defs>
      </svg>
    );
  };

  // Render SVG for Carnot cycle indicator and piston moving

};

export const DrawCarnot: React.FC<DrawerProps> = ({ progress, t }) => {
    const p = progress / 100;
    
    // Cycle points A, B, C, D coordinates on Pressure-Volume grid
    const pts = {
      A: { x: 70, y: 50 },
      B: { x: 130, y: 75 },
      C: { x: 190, y: 150 },
      D: { x: 110, y: 135 }
    };

    let dotX = pts.A.x;
    let dotY = pts.A.y;
    let pistonY = 70; // piston expansion level
    let thermalColor = "rgba(100, 116, 139, 0.2)"; // plate heat color

    if (p < 0.25) {
      const ratio = p / 0.25;
      dotX = pts.A.x + (pts.B.x - pts.A.x) * ratio;
      dotY = pts.A.y + (pts.B.y - pts.A.y) * ratio;
      pistonY = 70 + ratio * 20;
      thermalColor = "rgba(239, 68, 68, 0.4)"; // Hot contact (Th)
    } else if (p < 0.5) {
      const ratio = (p - 0.25) / 0.25;
      dotX = pts.B.x + (pts.C.x - pts.B.x) * ratio;
      dotY = pts.B.y + (pts.C.y - pts.B.y) * ratio;
      pistonY = 90 + ratio * 25;
      thermalColor = "rgba(100, 116, 139, 0.05)"; // Insulated (Q=0)
    } else if (p < 0.75) {
      const ratio = (p - 0.5) / 0.25;
      dotX = pts.C.x + (pts.D.x - pts.C.x) * ratio;
      dotY = pts.C.y + (pts.D.y - pts.C.y) * ratio;
      pistonY = 115 - ratio * 30;
      thermalColor = "rgba(59, 130, 246, 0.4)"; // Cold sink (Tc)
    } else {
      const ratio = (p - 0.75) / 0.25;
      dotX = pts.D.x + (pts.A.x - pts.D.x) * ratio;
      dotY = pts.D.y + (pts.A.y - pts.D.y) * ratio;
      pistonY = 85 - ratio * 15;
      thermalColor = "rgba(100, 116, 139, 0.05)"; // Insulated (Q=0)
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        {/* PV diagram SVG */}
        <div>
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider block mb-1">
            {t["PV Indicator Diagram"] || "PV Indicator Diagram"}
          </span>
          <svg viewBox="0 0 240 180" className="w-full bg-slate-950 rounded-xl border border-slate-900 overflow-visible p-2">
            {/* Grid Axes */}
            <line x1={40} y1={20} x2={40} y2={160} stroke="#475569" strokeWidth="1" />
            <line x1={40} y1={160} x2={220} y2={160} stroke="#475569" strokeWidth="1" />
            <text x={35} y={25} fill="#64748b" fontSize="8" textAnchor="end" fontWeight="bold">{t["Pressure (P)"] || "Pressure (P)"}</text>
            <text x={210} y={172} fill="#64748b" fontSize="8" textAnchor="middle" fontWeight="bold">{t["Volume (V)"] || "Volume (V)"}</text>

            {/* Curve paths */}
            <path d={`M ${pts.A.x} ${pts.A.y} Q 100 62, ${pts.B.x} ${pts.B.y}`} stroke="#ef4444" strokeWidth="1.5" fill="none" />
            <path d={`M ${pts.B.x} ${pts.B.y} Q 160 110, ${pts.C.x} ${pts.C.y}`} stroke="#f59e0b" strokeWidth="1.5" fill="none" />
            <path d={`M ${pts.C.x} ${pts.C.y} Q 150 145, ${pts.D.x} ${pts.D.y}`} stroke="#3b82f6" strokeWidth="1.5" fill="none" />
            <path d={`M ${pts.D.x} ${pts.D.y} Q 90 90, ${pts.A.x} ${pts.A.y}`} stroke="#a855f7" strokeWidth="1.5" fill="none" />

            {/* Stage point labels */}
            <text x={pts.A.x - 6} y={pts.A.y - 4} fill="#94a3b8" fontSize="8" fontWeight="bold">A</text>
            <text x={pts.B.x + 8} y={pts.B.y - 4} fill="#94a3b8" fontSize="8" fontWeight="bold">B</text>
            <text x={pts.C.x + 8} y={pts.C.y + 4} fill="#94a3b8" fontSize="8" fontWeight="bold">C</text>
            <text x={pts.D.x - 8} y={pts.D.y + 8} fill="#94a3b8" fontSize="8" fontWeight="bold">D</text>

            {/* Moving active state tracer */}
            <circle cx={dotX} cy={dotY} r="5" fill="#f59e0b" className="animate-pulse shadow-md" />
            <circle cx={dotX} cy={dotY} r="9" stroke="#f59e0b" strokeWidth="1" fill="none" className="animate-ping opacity-40" />
          </svg>
        </div>

        {/* Cylinder piston animation */}
        <div className="flex flex-col items-center">
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider block mb-1">
            {t["Gas Cylinder Assembly"] || "Gas Cylinder Assembly"}
          </span>
          <svg viewBox="0 0 160 180" className="w-40 bg-slate-950 rounded-xl border border-slate-900 overflow-visible">
            {/* Thermic interface block at the bottom */}
            <rect x={20} y={150} width={120} height={18} rx="3" fill={thermalColor} stroke="#334155" strokeWidth="1" className="transition-all duration-300" />
            <text x={80} y={162} fill="#94a3b8" fontSize="8" textAnchor="middle" fontWeight="bold" className="uppercase tracking-wider">
              {p < 0.25 ? (t["Hot Plate"] || "Hot Plate") : p >= 0.5 && p < 0.75 ? (t["Cold Sink"] || "Cold Sink") : (t["Insulation"] || "Insulation")}
            </text>

            {/* Cylinder boundary */}
            <rect x={35} y={30} width={90} height={120} fill="transparent" stroke="#475569" strokeWidth="2.5" />

            {/* Compressed / Expanded working fluid molecules */}
            <g opacity="0.6">
              {Array.from({ length: 15 }).map((_, i) => {
                const stepSeed = Math.sin(i * 1.7) * 45;
                const cosSeed = Math.cos(i * 2.3) * 45;
                const atomX = 80 + stepSeed * 0.7;
                const volumeHeight = 150 - pistonY;
                const atomY = pistonY + 5 + Math.abs(cosSeed) * (volumeHeight / 55);

                return (
                  <circle
                    key={i}
                    cx={atomX}
                    cy={atomY}
                    r="2.5"
                    fill={p < 0.25 ? "#f87171" : p >= 0.5 && p < 0.75 ? "#60a5fa" : "#e2e8f0"}
                    className="transition-colors duration-300"
                  />
                );
              })}
            </g>

            {/* Piston head */}
            <rect x={37} y={pistonY} width={86} height={10} fill="#64748b" stroke="#94a3b8" strokeWidth="1" />
            {/* Piston rod */}
            <rect x={76} y={10} width={8} height={pistonY - 10} fill="#cbd5e1" />
          </svg>
        </div>
      </div>
    );
  };

  // Render SVG for continuous customizable waves

};

export const DrawWaves: React.FC<DrawerProps> = ({ progress, t }) => {
    const points: string[] = [];
    const width = 400;
    const height = 150;
    const centerY = height / 2;
    const tVal = progress * 0.25;

    for (let x = 0; x <= width; x += 3) {
      const radians = (x * 0.05 * freq) - tVal;
      const y = centerY + Math.sin(radians) * amp;
      points.push(`${x},${y}`);
    }

    const pathD = `M ${points.join(' L ')}`;

    return (
      <div className="space-y-4">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full bg-slate-950 rounded-xl border border-slate-900 overflow-hidden">
          <line x1={0} y1={centerY} x2={width} y2={centerY} stroke="#334155" strokeWidth="0.5" strokeDasharray="5,5" />
          <path
            d={pathD}
            fill="none"
            stroke="url(#wave-grad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            className="drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]"
          />
          <circle cx={4} cy={centerY + Math.sin(-tVal) * amp} r="6" fill="#f59e0b" />
          <defs>
            <linearGradient id="wave-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
        </svg>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950/60 p-4 border border-slate-800 rounded-xl">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
              <span className="uppercase tracking-wider">{t["Wave Frequency (f)"] || "Wave Frequency (f)"}</span>
              <span className="text-blue-400">{freq.toFixed(1)} Hz</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="4.0"
              step="0.1"
              value={freq}
              onChange={(e) => setFreq(parseFloat(e.target.value))}
              className="w-full accent-blue-500 h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
              <span className="uppercase tracking-wider">{t["Amplitude (A)"] || "Amplitude (A)"}</span>
              <span className="text-purple-400">{amp.toFixed(0)} px</span>
            </div>
            <input
              type="range"
              min="5"
              max="65"
              value={amp}
              onChange={(e) => setAmp(parseInt(e.target.value))}
              className="w-full accent-purple-500 h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>
    );
  };

  // Render SVG for wave optics Double-Slit Diffraction

};

export const DrawDoubleSlit: React.FC<DrawerProps> = ({ progress, t }) => {
    const getWavelengthColor = (nm: number) => {
      if (nm < 450) return "#8b5cf6"; // Violet
      if (nm < 490) return "#06b6d4"; // Cyan
      if (nm < 560) return "#10b981"; // Green
      if (nm < 590) return "#eab308"; // Yellow
      if (nm < 630) return "#f97316"; // Orange
      return "#ef4444"; // Red
    };

    const laserColor = getWavelengthColor(wavelength);
    const p = progress / 100;

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <div className="md:col-span-3 relative h-40 bg-slate-950 rounded-xl border border-slate-900 overflow-hidden">
            <rect x={140} y={0} width={10} height={60} fill="#1e293b" stroke="#334155" strokeWidth="0.5" />
            <rect x={140} y={75} width={10} height={25} fill="#1e293b" stroke="#334155" strokeWidth="0.5" />
            <rect x={140} y={115} width={10} height={50} fill="#1e293b" stroke="#334155" strokeWidth="0.5" />

            {Array.from({ length: 5 }).map((_, i) => {
              const xCoord = ((i * 30 + p * 30) % 140);
              return (
                <line
                  key={i}
                  x1={xCoord}
                  y1={0}
                  x2={xCoord}
                  y2={160}
                  stroke={laserColor}
                  strokeWidth="2"
                  strokeOpacity={Math.max(0, 1 - xCoord / 130)}
                />
              );
            })}

            {p > 0.1 && (
              <g stroke={laserColor} strokeWidth="1.5" fill="none">
                {Array.from({ length: 4 }).map((_, i) => {
                  const r = (i * 35 + p * 35) % 150;
                  if (r < 10) return null;
                  return (
                    <g key={i} strokeOpacity={Math.max(0, 1 - r / 140)}>
                      <path d={`M 150 ${67 - r} A ${r} ${r} 0 0 1 150 ${67 + r}`} />
                      <path d={`M 150 ${107 - r} A ${r} ${r} 0 0 1 150 ${107 + r}`} />
                    </g>
                  );
                })}
              </g>
            )}

            <line x1={290} y1={0} x2={290} y2={160} stroke="#475569" strokeWidth="3" />
          </div>

          <div className="md:col-span-1 flex flex-col items-center justify-center p-3 bg-slate-950 rounded-xl border border-slate-900">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider block mb-2 text-center text-ellipsis overflow-hidden w-full whitespace-nowrap">
              {t["Fringe Intensity Detector"] || "Fringe Intensity Detector"}
            </span>
            <div className="w-full h-32 rounded bg-slate-950 flex flex-col overflow-hidden relative">
              {Array.from({ length: 11 }).map((_, i) => {
                const distFromCenter = Math.abs(i - 5);
                const slitSpacingFactor = 1.3;
                const fringeIntensity = Math.abs(Math.cos(distFromCenter * (wavelength / 180) * slitSpacingFactor));
                
                return (
                  <div
                    key={i}
                    className="flex-1 transition-all duration-300"
                    style={{
                      backgroundColor: laserColor,
                      opacity: fringeIntensity * (1 - distFromCenter * 0.15)
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-1.5 bg-slate-950/60 p-4 border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
            <span className="uppercase tracking-wider">{t["Source Laser Wavelength (λ)"] || "Source Laser Wavelength (λ)"}</span>
            <span style={{ color: laserColor }} className="font-extrabold">{wavelength} nm</span>
          </div>
          <input
            type="range"
            min="400"
            max="700"
            step="10"
            value={wavelength}
            onChange={(e) => setWavelength(parseInt(e.target.value))}
            className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer"
            style={{ accentColor: laserColor }}
          />
        </div>
      </div>
    );
  };

  // Render SVG for Enzyme active-site mechanism

};

export { DrawEnzyme } from './DrawEnzyme';
