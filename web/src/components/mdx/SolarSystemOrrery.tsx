"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Play, Pause, RotateCcw, Info, Zap, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface PlanetInfo {
  id: string;
  nameFR: string;
  nameEN: string;
  color: string;
  size: number; // visual circle size
  orbitRadius: number; // visual orbit radius
  speed: number; // orbital angular speed multiplier
  realSize: string;
  realDist: string;
  periodFR: string;
  periodEN: string;
  temp: string;
  moons: number;
}

const PLANETS_DB: PlanetInfo[] = [
  { id: 'mercury', nameFR: 'Mercure', nameEN: 'Mercury', color: '#9ca3af', size: 4, orbitRadius: 35, speed: 4.15, realSize: '4,879 km', realDist: '57.9 M km', periodFR: '88 jours', periodEN: '88 days', temp: '167 °C', moons: 0 },
  { id: 'venus', nameFR: 'Vénus', nameEN: 'Venus', color: '#fbbf24', size: 6.5, orbitRadius: 55, speed: 1.62, realSize: '12,104 km', realDist: '108.2 M km', periodFR: '224 jours', periodEN: '224 days', temp: '464 °C', moons: 0 },
  { id: 'earth', nameFR: 'Terre', nameEN: 'Earth', color: '#3b82f6', size: 7, orbitRadius: 75, speed: 1.0, realSize: '12,742 km', realDist: '149.6 M km', periodFR: '365 jours', periodEN: '365 days', temp: '15 °C', moons: 1 },
  { id: 'mars', nameFR: 'Mars', nameEN: 'Mars', color: '#f87171', size: 5, orbitRadius: 95, speed: 0.53, realSize: '6,779 km', realDist: '227.9 M km', periodFR: '687 jours', periodEN: '687 days', temp: '-65 °C', moons: 2 },
  { id: 'jupiter', nameFR: 'Jupiter', nameEN: 'Jupiter', color: '#f59e0b', size: 14, orbitRadius: 125, speed: 0.084, realSize: '139,820 km', realDist: '778.5 M km', periodFR: '12 ans', periodEN: '12 years', temp: '-110 °C', moons: 95 },
  { id: 'saturn', nameFR: 'Saturne', nameEN: 'Saturn', color: '#fcd34d', size: 12, orbitRadius: 155, speed: 0.034, realSize: '116,460 km', realDist: '1.4 B km', periodFR: '29 ans', periodEN: '29 years', temp: '-140 °C', moons: 146 },
  { id: 'uranus', nameFR: 'Uranus', nameEN: 'Uranus', color: '#22d3ee', size: 9, orbitRadius: 185, speed: 0.012, realSize: '50,724 km', realDist: '2.8 B km', periodFR: '84 ans', periodEN: '84 years', temp: '-195 °C', moons: 28 },
  { id: 'neptune', nameFR: 'Neptune', nameEN: 'Neptune', color: '#6366f1', size: 8.5, orbitRadius: 215, speed: 0.006, realSize: '49,244 km', realDist: '4.5 B km', periodFR: '165 ans', periodEN: '165 years', temp: '-200 °C', moons: 16 }
];

export const SolarSystemOrrery = () => {
  const { language } = useLanguage();
  const isFR = language === 'FR';

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [timeMultiplier, setTimeMultiplier] = useState<number>(1.5);
  const [selectedPlanetId, setSelectedPlanetId] = useState<string>('earth');
  const [zoomScale, setZoomScale] = useState<number>(1.0);

  // Use a ref for angles to avoid state updates on every animation frame
  const anglesRef = useRef<Record<string, number>>({
    mercury: 0, venus: 0, earth: 0, mars: 0, jupiter: 0, saturn: 0, uranus: 0, neptune: 0
  });

  const activePlanet = useMemo(() => {
    return PLANETS_DB.find(p => p.id === selectedPlanetId) || PLANETS_DB[2];
  }, [selectedPlanetId]);

  // Main Canvas Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      // Clear canvas with a nice space dark fade
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Draw starry ambient points
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      for (let i = 0; i < 60; i++) {
        const x = (Math.sin(i * 12345) * 0.5 + 0.5) * canvas.width;
        const y = (Math.cos(i * 54321) * 0.5 + 0.5) * canvas.height;
        ctx.fillRect(x, y, 1, 1);
      }

      // Draw Orbit Paths
      PLANETS_DB.forEach((p) => {
        ctx.beginPath();
        ctx.arc(centerX, centerY, p.orbitRadius * zoomScale, 0, Math.PI * 2);
        ctx.strokeStyle = p.id === selectedPlanetId ? 'rgba(99, 102, 241, 0.25)' : 'rgba(51, 65, 85, 0.2)';
        ctx.lineWidth = p.id === selectedPlanetId ? 2 : 1;
        ctx.stroke();
      });

      // Draw the Sun with standard solar glow
      const sunGlow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 22 * zoomScale);
      sunGlow.addColorStop(0, '#fef08a');
      sunGlow.addColorStop(0.3, '#f59e0b');
      sunGlow.addColorStop(1, 'transparent');

      ctx.beginPath();
      ctx.arc(centerX, centerY, 22 * zoomScale, 0, Math.PI * 2);
      ctx.fillStyle = sunGlow;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(centerX, centerY, 11 * zoomScale, 0, Math.PI * 2);
      ctx.fillStyle = '#fbbf24';
      ctx.shadowColor = '#fbbf24';
      ctx.shadowBlur = 15;
      ctx.fill();
      ctx.shadowBlur = 0; // reset shadow

      // Draw & Move Planets
      PLANETS_DB.forEach((p) => {
        // Calculate current position
        const angle = anglesRef.current[p.id];
        const x = centerX + Math.cos(angle) * p.orbitRadius * zoomScale;
        const y = centerY + Math.sin(angle) * p.orbitRadius * zoomScale;

        // Draw selection halo
        if (p.id === selectedPlanetId) {
          ctx.beginPath();
          ctx.arc(x, y, (p.size + 6) * zoomScale, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(99, 102, 241, 0.6)';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([4, 3]);
          ctx.stroke();
          ctx.setLineDash([]); // Reset
        }

        // Draw Ring for Saturn
        if (p.id === 'saturn') {
          ctx.beginPath();
          ctx.ellipse(x, y, 22 * zoomScale, 6 * zoomScale, Math.PI / 6, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(217, 119, 6, 0.45)';
          ctx.lineWidth = 3 * zoomScale;
          ctx.stroke();
        }

        // Draw planet body
        ctx.beginPath();
        ctx.arc(x, y, p.size * zoomScale, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        // Increment angle if playing
        if (isPlaying) {
          anglesRef.current[p.id] += (0.015 * p.speed * timeMultiplier);
          if (anglesRef.current[p.id] > Math.PI * 2) {
            anglesRef.current[p.id] -= Math.PI * 2;
          }
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, timeMultiplier, selectedPlanetId, zoomScale]);

  // Click on Canvas to select a planet
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Calculate distance from center
    const dx = clickX - centerX;
    const dy = clickY - centerY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Find the closest orbit
    let closestPlanetId = selectedPlanetId;
    let minDiff = Infinity;

    PLANETS_DB.forEach((p) => {
      const diff = Math.abs(dist - p.orbitRadius * zoomScale);
      if (diff < minDiff && diff < 15) {
        minDiff = diff;
        closestPlanetId = p.id;
      }
    });

    setSelectedPlanetId(closestPlanetId);
  };

  const handleResetOrbits = () => {
    anglesRef.current = {
      mercury: 0, venus: 0, earth: 0, mars: 0, jupiter: 0, saturn: 0, uranus: 0, neptune: 0
    };
  };

  return (
    <div className="my-8 rounded-[40px] border border-slate-850 bg-slate-950/40 backdrop-blur-xl shadow-2xl p-6 sm:p-8 relative select-none">
      <div className="absolute -left-16 -top-16 w-36 h-36 rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />

      {/* Top row description */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-850 pb-6 mb-6">
        <div>
          <h3 className="text-sm font-black text-slate-200 uppercase tracking-[0.25em] flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
            <span>{isFR ? 'Planétarium Interactif' : 'Solar System Orrery'}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            {isFR 
              ? "Simulez la révolution orbitale des planètes autour du Soleil. Les distances orbitales sont à l'échelle logarithmique pour une visibilité optimale."
              : "Simulate planetary revolution speeds around the Sun. Distance scales are logarithmically optimized for complete visual orbit mapping."}
          </p>
        </div>

        {/* Play/Pause & Speed widgets */}
        <div className="flex flex-wrap items-center gap-3 bg-slate-900/40 border border-slate-850/80 p-2 rounded-2xl">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className={`p-2.5 rounded-xl cursor-pointer transition-all duration-300 ${
              isPlaying ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-800 text-slate-300'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button 
            onClick={handleResetOrbits}
            className="p-2.5 rounded-xl bg-slate-800 text-slate-300 cursor-pointer hover:bg-slate-700 transition-colors"
            title={isFR ? "Réinitialiser" : "Reset Positions"}
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <div className="h-6 w-[1px] bg-slate-800 mx-1" />

          {/* Speed slider */}
          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-[10px] font-mono font-bold text-slate-300 w-12 text-right">
              {timeMultiplier.toFixed(1)}x
            </span>
            <input 
              type="range" 
              min="0.1" 
              max="5.0" 
              step="0.1"
              value={timeMultiplier}
              onChange={(e) => setTimeMultiplier(parseFloat(e.target.value))}
              className="w-24 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Main split grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left canvas: Interactive system representation */}
        <div className="lg:col-span-8 flex flex-col items-center">
          <div className="relative rounded-3xl overflow-hidden border border-slate-850 bg-[#020617] shadow-inner p-1 w-full max-w-[500px]">
            
            <canvas 
              ref={canvasRef} 
              width={500} 
              height={480} 
              onClick={handleCanvasClick}
              className="w-full h-auto cursor-pointer block"
            />

            {/* Orbit Selector Panel overlay */}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5 max-w-[130px] select-none">
              {PLANETS_DB.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPlanetId(p.id)}
                  className={`px-2.5 py-1 text-[9px] font-bold rounded-lg border text-left transition-all duration-300 flex items-center gap-1.5 ${
                    p.id === selectedPlanetId 
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-500/10' 
                      : 'bg-slate-950/80 border-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p.color }} />
                  <span>{isFR ? p.nameFR : p.nameEN}</span>
                </button>
              ))}
            </div>

            {/* Scale toggle helper */}
            <div className="absolute bottom-4 right-4 bg-slate-950/80 border border-slate-900 rounded-xl px-2.5 py-1 text-[9px] font-medium text-slate-500 flex items-center gap-1">
              <Info className="w-3 h-3 text-indigo-400" />
              <span>{isFR ? "Échelle modifiée" : "Not to physical scale"}</span>
            </div>
          </div>

          {/* Orbit zoom helper */}
          <div className="flex items-center gap-3 mt-4 select-none">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Zoom :</span>
            <div className="flex gap-1.5">
              {[0.75, 1.0, 1.25].map((scale) => (
                <button
                  key={scale}
                  onClick={() => setZoomScale(scale)}
                  className={`w-10 py-1 text-[10px] font-mono font-bold rounded-lg border transition-colors cursor-pointer ${
                    zoomScale === scale 
                      ? 'bg-indigo-600/25 border-indigo-500/50 text-indigo-300' 
                      : 'bg-slate-900/40 border-slate-850 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {scale.toFixed(2)}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right card: Planet exploration metrics */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="rounded-3xl border border-slate-850 bg-slate-900/40 p-6 flex flex-col relative overflow-hidden">
            <div className="absolute -right-12 -bottom-12 w-28 h-28 rounded-full bg-blue-500/5 blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between border-b border-slate-850 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: activePlanet.color }} />
                <h4 className="text-xl font-black text-slate-100 leading-none">
                  {isFR ? activePlanet.nameFR : activePlanet.nameEN}
                </h4>
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-lg">
                {isFR ? "Planète" : "Planet"}
              </span>
            </div>

            {/* Metrics cards grid */}
            <div className="grid grid-cols-2 gap-3 text-xs select-text">
              <div className="bg-slate-950/40 p-3 rounded-2xl border border-slate-850/80">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">{isFR ? 'Diamètre Équatorial' : 'Diameter'}</span>
                <div className="font-mono font-bold text-slate-200 mt-0.5">{activePlanet.realSize}</div>
              </div>
              <div className="bg-slate-950/40 p-3 rounded-2xl border border-slate-850/80">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">{isFR ? 'Distance au Soleil' : 'Distance from Sun'}</span>
                <div className="font-mono font-bold text-slate-200 mt-0.5">{activePlanet.realDist}</div>
              </div>
              <div className="bg-slate-950/40 p-3 rounded-2xl border border-slate-850/80 col-span-2">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">{isFR ? 'Période de Révolution (An)' : 'Orbital Period (Year)'}</span>
                <div className="font-mono font-bold text-slate-200 mt-0.5">{isFR ? activePlanet.periodFR : activePlanet.periodEN}</div>
              </div>
              <div className="bg-slate-950/40 p-3 rounded-2xl border border-slate-850/80">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">{isFR ? 'Temp. Moyenne' : 'Mean Temp.'}</span>
                <div className="font-mono font-bold text-slate-200 mt-0.5">{activePlanet.temp}</div>
              </div>
              <div className="bg-slate-950/40 p-3 rounded-2xl border border-slate-850/80">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">{isFR ? 'Lunes Connues' : 'Moons'}</span>
                <div className="font-mono font-bold text-slate-200 mt-0.5">{activePlanet.moons}</div>
              </div>
            </div>

            {/* Interesting fact / pedagogical paragraph */}
            <div className="mt-5 p-4 bg-slate-950/30 border border-slate-850/60 rounded-2xl text-[11px] text-slate-400 select-text leading-relaxed">
              {(() => {
                if (activePlanet.id === 'mercury') {
                  return isFR 
                    ? "Mercure est la planète la plus proche du Soleil. En raison de son absence d'atmosphère, elle connaît les écarts de température les plus extrêmes du système solaire."
                    : "Mercury is the closest planet to the Sun. Due to its lack of atmosphere, it experiences the most extreme temperature fluctuations in the solar system.";
                }
                if (activePlanet.id === 'venus') {
                  return isFR 
                    ? "Vénus possède une atmosphère extrêmement dense de CO₂ provoquant un effet de serre incontrôlé, ce qui en fait la planète la plus chaude du système solaire."
                    : "Venus has an incredibly thick CO₂ atmosphere that traps heat in a runaway greenhouse effect, making it the hottest planet in our solar system.";
                }
                if (activePlanet.id === 'earth') {
                  return isFR 
                    ? "La Terre est la seule planète connue à abriter de la vie et à posséder de l'eau liquide à sa surface, un équilibre maintenu par sa distance idéale du Soleil."
                    : "Earth is the only known planet to harbor life and support liquid water on its surface, maintained by its ideal astronomical distance from the Sun.";
                }
                if (activePlanet.id === 'mars') {
                  return isFR 
                    ? "Mars, la planète rouge, doit sa couleur à l'oxyde de fer (rouille) à sa surface. Elle possède deux petites lunes de forme irrégulière: Phobos et Deimos."
                    : "Mars, the red planet, gets its rusty color from iron oxide on its surface. It has two small, irregularly shaped moons: Phobos and Deimos.";
                }
                if (activePlanet.id === 'jupiter') {
                  return isFR 
                    ? "Jupiter est la plus grande planète du système solaire. C'est une géante gazeuse qui possède une Grande Tache Rouge, un ouragan géant plus grand que la Terre."
                    : "Jupiter is the largest planet in our solar system. A massive gas giant, it features the Great Red Spot—a storm wider than Earth itself.";
                }
                if (activePlanet.id === 'saturn') {
                  return isFR 
                    ? "Saturne est célèbre pour son système d'anneaux spectaculaires constitués de particules de glace et de poussière rocheuse. Sa densité est inférieure à celle de l'eau."
                    : "Saturn is famous for its spectacular ring system, composed mostly of ice and rocky debris. Its bulk density is lower than water.";
                }
                if (activePlanet.id === 'uranus') {
                  return isFR 
                    ? "Uranus est une géante de glace caractérisée par son axe de rotation incliné à près de 98 degrés, ce qui signifie qu'elle orbite pratiquement 'sur le côté'."
                    : "Uranus is an icy giant unique for its extreme axial tilt of 98 degrees, meaning it rotates almost completely on its side relative to its orbit.";
                }
                if (activePlanet.id === 'neptune') {
                  return isFR 
                    ? "Neptune est la planète la plus éloignée du Soleil. Elle est balayée par les vents les plus rapides du système solaire, atteignant plus de 2,100 km/h."
                    : "Neptune is the most distant planet in our solar system. It experiences the strongest winds in the system, reaching speeds of up to 2,100 km/h.";
                }
              })()}
            </div>
          </div>

          {/* Interactive Bohr orbital comparison banner */}
          <div className="rounded-3xl border border-slate-850 bg-slate-900/40 p-4 text-center select-none">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>{isFR ? "Comparaison Gravitationnelle" : "Keplerian Mechanics"}</span>
            </span>
            <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
              {isFR 
                ? "Conformément à la troisième loi de Kepler, la vitesse orbitale diminue à mesure que la distance au Soleil augmente : v ≈ 1/√r."
                : "According to Kepler's third law, planetary orbital speed decreases as distance from the Sun increases: v ≈ 1/√r."}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
