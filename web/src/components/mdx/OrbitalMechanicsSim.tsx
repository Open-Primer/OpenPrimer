"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Plus, Trash2, Target } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { STATIC_UI_STRINGS } from '@/lib/translations';

interface Body {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  mass: number;
  color: string;
  trail: { x: number; y: number }[];
  type: 'star' | 'planet' | 'satellite';
}

interface OrbitalMechanicsSimProps {
  gradeLevel?: 'middle_school' | 'high_school' | 'university';
}

const BODY_COLORS = ['#fbbf24', '#60a5fa', '#34d399', '#f87171', '#a78bfa', '#fb923c', '#38bdf8'];

const G = 500; // Scaled gravitational constant for visual simulation
const MAX_TRAIL = 180;

const PRESETS = [
  {
    id: 'earth-moon',
    nameEN: 'Earth–Moon System',
    nameFR: 'Système Terre-Lune',
    bodies: [
      { id: 1, x: 300, y: 250, vx: 0, vy: 0, mass: 80, color: '#60a5fa', trail: [], type: 'planet' as const },
      { id: 2, x: 420, y: 250, vx: 0, vy: 2.5, mass: 1, color: '#94a3b8', trail: [], type: 'satellite' as const },
    ]
  },
  {
    id: 'sun-planets',
    nameEN: 'Solar System (3 Planets)',
    nameFR: 'Système Solaire (3 Planètes)',
    bodies: [
      { id: 1, x: 300, y: 250, vx: 0, vy: 0, mass: 200, color: '#fbbf24', trail: [], type: 'star' as const },
      { id: 2, x: 420, y: 250, vx: 0, vy: 3.5, mass: 2, color: '#60a5fa', trail: [], type: 'planet' as const },
      { id: 3, x: 510, y: 250, vx: 0, vy: 2.5, mass: 3, color: '#34d399', trail: [], type: 'planet' as const },
      { id: 4, x: 170, y: 250, vx: 0, vy: -3.2, mass: 1.5, color: '#f87171', trail: [], type: 'planet' as const },
    ]
  },
  {
    id: 'binary-star',
    nameEN: 'Binary Star System',
    nameFR: 'Système d\'Étoiles Binaires',
    bodies: [
      { id: 1, x: 240, y: 250, vx: 0, vy: 1.5, mass: 100, color: '#fbbf24', trail: [], type: 'star' as const },
      { id: 2, x: 360, y: 250, vx: 0, vy: -1.5, mass: 100, color: '#fb923c', trail: [], type: 'star' as const },
    ]
  },
];

export const OrbitalMechanicsSim = ({ gradeLevel = 'high_school' }: OrbitalMechanicsSimProps) => {
  const { language } = useLanguage();

  const localFR: Record<string, string> = {
    "Earth–Moon System": "Système Terre-Lune",
    "Solar System (3 Planets)": "Système Solaire (3 Planètes)",
    "Binary Star System": "Système d'Étoiles Binaires",
    "Orbital Mechanics Simulator": "Simulateur de Mécanique Orbitale",
    "2D Newtonian gravity sandbox — place stars, planets & satellites. Observe Keplerian orbits and decay.": "Gravité newtonienne en 2D — placez des étoiles, planètes & satellites. Observez les orbites keplériennes et la dégradation.",
    "Click anywhere to place:": "Cliquez n'importe où pour placer :",
    "star": "une étoile",
    "planet": "une planète",
    "satellite": "un satellite",
    "★ Star": "★ Étoile",
    "● Planet": "● Planète",
    "◆ Moon": "◆ Lune",
    "Add Body": "Ajouter un corps",
    "Bodies": "Corps présents",
    "System Energy": "Énergie du Système",
    "F = G·m₁m₂/r² applied at each step": "F = G·m₁m₂/r² appliqué à chaque étape",
    "ℹ️ This uses Euler integration of Newton's law of gravity (F = Gm₁m₂/r²). Simulation is scaled for visual clarity, not astronomical precision.": "ℹ️ Cette simulation utilise l'intégration d'Euler de la loi de la gravitation de Newton (F = Gm₁m₂/r²). L'échelle est ajustée pour la clarté visuelle et non pour la précision astronomique.",
    "Trails": "Trajectoires",
    "Vectors": "Vecteurs",
    "Time Scale": "Échelle Temporelle",
    "Star": "Étoile",
    "Planet": "Planète",
    "Satellite": "Satellite"
  };

  const t = (key: string) => {
    const globalT = (STATIC_UI_STRINGS[language.toUpperCase() as keyof typeof STATIC_UI_STRINGS] || STATIC_UI_STRINGS.EN) as any;
    const translated = globalT?.[key];
    if (translated && translated !== key) return translated;
    if (language.toUpperCase() === 'FR' && localFR[key]) return localFR[key];
    return key;
  };

  const [bodies, setBodies] = useState<Body[]>(PRESETS[0].bodies.map(b => ({ ...b, trail: [] })));
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTrails, setShowTrails] = useState(true);
  const [showVectors, setShowVectors] = useState(false);
  const [timeScale, setTimeScale] = useState(1.0);
  const [selectedPreset, setSelectedPreset] = useState(PRESETS[0].id);
  const [addingBody, setAddingBody] = useState<'star' | 'planet' | 'satellite' | null>(null);
  const [hoverInfo, setHoverInfo] = useState<Body | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bodiesRef = useRef<Body[]>(bodies);
  const animRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  bodiesRef.current = bodies;

  const loadPreset = useCallback((presetId: string) => {
    setIsPlaying(false);
    if (animRef.current) cancelAnimationFrame(animRef.current);
    const preset = PRESETS.find(p => p.id === presetId) || PRESETS[0];
    setBodies(preset.bodies.map(b => ({ ...b, trail: [] })));
    setSelectedPreset(presetId);
  }, []);

  const simulateStep = useCallback((dt: number) => {
    setBodies(prev => {
      const next = prev.map(b => ({ ...b, trail: [...b.trail] }));

      // Compute gravitational forces
      for (let i = 0; i < next.length; i++) {
        let ax = 0, ay = 0;
        for (let j = 0; j < next.length; j++) {
          if (i === j) continue;
          const dx = next[j].x - next[i].x;
          const dy = next[j].y - next[i].y;
          const dist2 = dx * dx + dy * dy;
          const dist = Math.sqrt(dist2);
          if (dist < 5) continue;
          const force = G * next[j].mass / dist2;
          ax += force * dx / dist;
          ay += force * dy / dist;
        }
        next[i].vx += ax * dt * timeScale;
        next[i].vy += ay * dt * timeScale;
      }

      // Update positions and trails
      for (const b of next) {
        b.x += b.vx * dt * timeScale;
        b.y += b.vy * dt * timeScale;

        // Boundary bounce (soft)
        const canvas = canvasRef.current;
        if (canvas) {
          if (b.x < 0 || b.x > canvas.width / (window.devicePixelRatio || 1)) b.vx *= -0.85;
          if (b.y < 0 || b.y > canvas.height / (window.devicePixelRatio || 1)) b.vy *= -0.85;
          b.x = Math.max(0, Math.min(b.x, canvas.width / (window.devicePixelRatio || 1)));
          b.y = Math.max(0, Math.min(b.y, canvas.height / (window.devicePixelRatio || 1)));
        }

        if (showTrails) {
          b.trail.push({ x: b.x, y: b.y });
          if (b.trail.length > MAX_TRAIL) b.trail.shift();
        }
      }

      return next;
    });
  }, [timeScale, showTrails]);

  // Animation loop
  useEffect(() => {
    if (!isPlaying) {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      return;
    }

    let lastTs = 0;
    const loop = (ts: number) => {
      const dt = Math.min((ts - lastTs) / 1000, 0.05);
      lastTs = ts;
      if (dt > 0) simulateStep(dt);
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [isPlaying, simulateStep]);

  // Canvas render
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    }

    const W = rect.width;
    const H = rect.height;

    // Dark space background
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, W, H);

    // Star field
    ctx.fillStyle = 'rgba(148,163,184,0.25)';
    for (let s = 0; s < 120; s++) {
      const sx = ((s * 137.508 + 13) % 1) * W;
      const sy = ((s * 97.321 + 7) % 1) * H;
      ctx.beginPath();
      ctx.arc(sx, sy, 0.8, 0, Math.PI * 2);
      ctx.fill();
    }

    bodies.forEach(b => {
      // Draw trail
      if (showTrails && b.trail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(b.trail[0].x, b.trail[0].y);
        b.trail.forEach((pt, i) => {
          const alpha = (i / b.trail.length) * 0.5;
          ctx.lineTo(pt.x, pt.y);
        });
        ctx.strokeStyle = b.color + '55';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Velocity vector
      if (showVectors) {
        ctx.beginPath();
        ctx.moveTo(b.x, b.y);
        ctx.lineTo(b.x + b.vx * 8, b.y + b.vy * 8);
        ctx.strokeStyle = '#34d399';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        // arrowhead
        ctx.beginPath();
        ctx.arc(b.x + b.vx * 8, b.y + b.vy * 8, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#34d399';
        ctx.fill();
      }

      // Body glow
      const bodyRadius = Math.max(5, Math.sqrt(b.mass) * 1.8);
      const gradient = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, bodyRadius * 2.5);
      gradient.addColorStop(0, b.color + 'cc');
      gradient.addColorStop(0.4, b.color + '55');
      gradient.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(b.x, b.y, bodyRadius * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Solid body
      ctx.beginPath();
      ctx.arc(b.x, b.y, bodyRadius, 0, Math.PI * 2);
      ctx.fillStyle = b.color;
      ctx.fill();

      // Label
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(b.type === 'star' ? '★' : b.type === 'satellite' ? '◆' : '●', b.x, b.y - bodyRadius - 4);
    });

  }, [bodies, showTrails, showVectors]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!addingBody) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newId = Math.max(0, ...bodies.map(b => b.id)) + 1;
    const massMap = { star: 150, planet: 5, satellite: 0.5 };
    const colorIdx = newId % BODY_COLORS.length;
    setBodies(prev => [...prev, {
      id: newId, x, y, vx: 1.5, vy: 0,
      mass: massMap[addingBody],
      color: BODY_COLORS[colorIdx],
      trail: [],
      type: addingBody
    }]);
    setAddingBody(null);
  };

  const removeBody = (id: number) => {
    setBodies(prev => prev.filter(b => b.id !== id));
  };

  const totalKE = bodies.reduce((sum, b) => sum + 0.5 * b.mass * (b.vx ** 2 + b.vy ** 2), 0);

  return (
    <div className="my-8 rounded-3xl overflow-hidden border border-slate-800/80 bg-slate-950/40 backdrop-blur-xl shadow-2xl p-6 sm:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-850/80 pb-5 mb-5">
        <div>
          <h4 className="text-sm font-black text-slate-100 uppercase tracking-widest flex items-center gap-2">
            <Target className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{t("Orbital Mechanics Simulator")}</span>
          </h4>
          <p className="text-[11px] text-slate-400 font-semibold mt-1">
            {t("2D Newtonian gravity sandbox — place stars, planets & satellites. Observe Keplerian orbits and decay.")}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map(p => (
            <button key={p.id} onClick={() => loadPreset(p.id)}
              className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider border transition-all cursor-pointer ${
                selectedPreset === p.id
                  ? 'bg-cyan-600 border-cyan-500 text-white'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}>
              {t(p.nameEN)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Canvas */}
        <div className="lg:col-span-8 relative">
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            className={`w-full h-[350px] rounded-2xl border border-slate-850 block ${addingBody ? 'cursor-crosshair' : 'cursor-default'}`}
          />
          {addingBody && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-cyan-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg">
              {t("Click anywhere to place:")} {t(addingBody)} ✨
            </div>
          )}

          {/* HUD Overlay */}
          <div className="absolute bottom-3 left-3 flex gap-2">
            <button onClick={() => setIsPlaying(p => !p)}
              className="p-2.5 bg-slate-900/90 border border-slate-700 text-white rounded-xl cursor-pointer hover:bg-slate-800 transition-all">
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 pl-0.5" />}
            </button>
            <button onClick={() => loadPreset(selectedPreset)}
              className="p-2.5 bg-slate-900/90 border border-slate-700 text-slate-400 rounded-xl cursor-pointer hover:text-white transition-all">
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="absolute bottom-3 right-3 flex gap-2">
            <button onClick={() => setShowTrails(t => !t)}
              className={`px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase border cursor-pointer transition-all ${showTrails ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' : 'bg-slate-900/80 border-slate-700 text-slate-500'}`}>
              {t("Trails")}
            </button>
            <button onClick={() => setShowVectors(v => !v)}
              className={`px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase border cursor-pointer transition-all ${showVectors ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-900/80 border-slate-700 text-slate-500'}`}>
              {t("Vectors")}
            </button>
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Time Scale */}
          <div className="p-4 rounded-2xl border border-slate-850 bg-slate-900/30 space-y-2">
            <label className="text-[9px] font-black uppercase text-cyan-400 tracking-wider flex justify-between">
              <span>{t("Time Scale")}</span>
              <span className="font-mono text-cyan-300">{timeScale.toFixed(2)}×</span>
            </label>
            <input type="range" min={0.1} max={4} step={0.1} value={timeScale}
              onChange={e => setTimeScale(parseFloat(e.target.value))}
              className="w-full h-1 rounded-lg appearance-none cursor-pointer accent-cyan-500" />
          </div>

          {/* Add Body */}
          <div className="p-4 rounded-2xl border border-slate-850 bg-slate-900/30 space-y-2">
            <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">{t("Add Body")}</span>
            <div className="grid grid-cols-3 gap-1.5">
              {(['star', 'planet', 'satellite'] as const).map(type => (
                <button key={type} onClick={() => setAddingBody(addingBody === type ? null : type)}
                  className={`py-2 rounded-xl text-[8px] font-black uppercase border transition-all cursor-pointer ${
                    addingBody === type
                      ? 'bg-cyan-600 border-cyan-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}>
                  {type === 'star' ? t("★ Star") : type === 'planet' ? t("● Planet") : t("◆ Moon")}
                </button>
              ))}
            </div>
          </div>

          {/* Bodies List */}
          <div className="p-4 rounded-2xl border border-slate-850 bg-slate-900/30 space-y-2 flex-1">
            <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">{t("Bodies")} ({bodies.length})</span>
            <div className="space-y-1.5 max-h-[150px] overflow-y-auto pr-1">
              {bodies.map(b => (
                <div key={b.id} className="flex items-center gap-2 p-2 rounded-lg bg-slate-950/60 border border-slate-900">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: b.color }} />
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-black text-slate-300 capitalize">
                      {t(b.type)}
                    </span>
                    <span className="text-[8px] text-slate-500 font-mono ml-1">m={b.mass}</span>
                  </div>
                  <button onClick={() => removeBody(b.id)}
                    className="text-slate-600 hover:text-rose-400 cursor-pointer transition-colors">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Physics Readout */}
          {gradeLevel === 'university' && (
            <div className="p-3 rounded-xl border border-slate-850 bg-slate-950/40 space-y-1">
              <span className="text-[9px] font-black uppercase text-cyan-400 tracking-wider block">{t("System Energy")}</span>
              <div className="font-mono text-[10px] text-slate-300">
                <div>KE ≈ <span className="text-cyan-400 font-black">{totalKE.toFixed(1)}</span> (scaled)</div>
                <div className="text-[8px] text-slate-500 mt-0.5">
                  {t("F = G·m₁m₂/r² applied at each step")}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <p className="mt-4 text-[10px] text-slate-500 font-semibold select-text leading-relaxed">
        {t("ℹ️ This uses Euler integration of Newton's law of gravity (F = Gm₁m₂/r²). Simulation is scaled for visual clarity, not astronomical precision.")}
      </p>
    </div>
  );
};
