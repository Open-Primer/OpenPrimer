"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Play, Pause, RefreshCw, Compass, ShieldAlert, Sparkles, Orbit, Sliders } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { STATIC_UI_STRINGS } from '@/lib/translations';

interface Planet {
  id: string;
  nameFR: string;
  nameEN: string;
  color: string;
  radius: number; // visual pixels size
  semiMajorAxis: number; // scaled orbital radius
  orbitalPeriod: number; // relative years speed multiplier
  defaultEccentricity: number; // default orbit stretch
  massText: string;
  tempText: string;
  descFR: string;
  descEN: string;
}

const PLANETS_DB: Planet[] = [
  { 
    id: "mercury", nameFR: "Mercure", nameEN: "Mercury", color: "#9ca3af", radius: 3, semiMajorAxis: 38, orbitalPeriod: 0.24, defaultEccentricity: 0.206,
    massText: "0.055 Earths", tempText: "167 °C",
    descFR: "Planète la plus proche du Soleil. Orbite très excentrique caractérisée par de forts écarts de vitesse.",
    descEN: "The closest planet to the Sun. Highly eccentric orbit exhibiting extreme speed fluctuations."
  },
  { 
    id: "venus", nameFR: "Vénus", nameEN: "Venus", color: "#f59e0b", radius: 5, semiMajorAxis: 54, orbitalPeriod: 0.62, defaultEccentricity: 0.007,
    massText: "0.815 Earths", tempText: "464 °C",
    descFR: "Orbite presque circulaire. Enveloppée d'une atmosphère dense provoquant un puissant effet de serre.",
    descEN: "Nearly perfect circular orbit. Enshrouded in a dense atmosphere triggering a massive greenhouse effect."
  },
  { 
    id: "earth", nameFR: "Terre", nameEN: "Earth", color: "#3b82f6", radius: 6, semiMajorAxis: 72, orbitalPeriod: 1.00, defaultEccentricity: 0.017,
    massText: "1.000 Earths", tempText: "15 °C",
    descFR: "Notre planète bleue. Orbite stable idéale pour l'étude cinématique des vecteurs vitesse tangents.",
    descEN: "Our home world. Highly stable orbit ideal for studying tangential velocity vectors."
  },
  { 
    id: "mars", nameFR: "Mars", nameEN: "Mars", color: "#ef4444", radius: 4, semiMajorAxis: 92, orbitalPeriod: 1.88, defaultEccentricity: 0.093,
    massText: "0.107 Earths", tempText: "-65 °C",
    descFR: "La planète rouge. Présente une excentricité modérée propice aux premières vérifications des lois de Kepler.",
    descEN: "The red planet. Moderately eccentric orbit, which originally inspired Kepler's orbital discoveries."
  },
  { 
    id: "jupiter", nameFR: "Jupiter", nameEN: "Jupiter", color: "#f97316", radius: 11, semiMajorAxis: 122, orbitalPeriod: 4.5, defaultEccentricity: 0.048,
    massText: "317.8 Earths", tempText: "-110 °C",
    descFR: "Géante gazeuse massive. Exerce une influence gravitationnelle majeure perturbant les corps environnants.",
    descEN: "Massive gas giant. Exerts dominant gravitational fields affecting satellite trajectories."
  },
  { 
    id: "saturn", nameFR: "Saturne", nameEN: "Saturn", color: "#eab308", radius: 9, semiMajorAxis: 154, orbitalPeriod: 8.0, defaultEccentricity: 0.056,
    massText: "95.2 Earths", tempText: "-140 °C",
    descFR: "Magnifique géante annelée. Possède un grand nombre de lunes en orbites de résonance stable.",
    descEN: "Stunning ringed giant. Features an extensive system of moons orbiting in stable resonances."
  }
];

export const SolarSystemOrrery = () => {
  const { language } = useLanguage();

  const localFR: Record<string, string> = {
    "Mercury": "Mercure",
    "Venus": "Vénus",
    "Earth": "Terre",
    "Mars": "Mars",
    "Jupiter": "Jupiter",
    "Saturn": "Saturne",
    "The closest planet to the Sun. Highly eccentric orbit exhibiting extreme speed fluctuations.": "Planète la plus proche du Soleil. Orbite très excentrique caractérisée par de forts écarts de vitesse.",
    "Nearly perfect circular orbit. Enshrouded in a dense atmosphere triggering a massive greenhouse effect.": "Orbite presque circulaire. Enveloppée d'une atmosphère dense provoquant un puissant effet de serre.",
    "Our home world. Highly stable orbit ideal for studying tangential velocity vectors.": "Notre planète bleue. Orbite stable idéale pour l'étude cinématique des vecteurs vitesse tangents.",
    "The red planet. Moderately eccentric orbit, which originally inspired Kepler's orbital discoveries.": "La planète rouge. Présente une excentricité modérée propice aux premières vérifications des lois de Kepler.",
    "Massive gas giant. Exerts dominant gravitational fields affecting satellite trajectories.": "Géante gazeuse massive. Exerce une influence gravitationnelle majeure perturbant les corps environnants.",
    "Stunning ringed giant. Features an extensive system of moons orbiting in stable resonances.": "Magnifique géante annelée. Possède un grand nombre de lunes en orbites de résonance stable.",
    "Kepler's Laws & Mechanics Lab": "Laboratoire des Lois de Kepler",
    "Explore angular momentum conservation: deform elliptical excentricity parameters and analyze velocity vs gravitational acceleration vectors.": "Étudiez la physique de la conservation du moment cinétique : manipulez l'excentricité elliptique et analysez les vecteurs d'accélération et d'aires.",
    "Select Celestial Target": "Corps Céleste en observation",
    "Adjust Eccentricity (e)": "Ajustement de l'Excentricité (e)",
    "Eccentricity Coefficient": "Coefficient d'excentricité",
    "Velocity Vector (v)": "Vecteur Vitesse (v⃗)",
    "Gravity Force (F)": "Force d'Attraction (F⃗g)",
    "Second Law of Kepler": "Deuxième Loi de Kepler",
    "« Equal orbital areas are swept out in equal times ». Observe that all violet sector segments are identical in surface: the planet moves faster at perihelion.": "« Des surfaces égales sont balayées dans des intervalles de temps égaux ». Observez que les portions d'aires elliptiques violettes ont toutes la même surface : la planète accélère près du Soleil.",
    "Vectors ⇾": "Vecteurs ⇾",
    "Swept Areas (2nd Law)": "Aires Balayées (2e Loi)"
  };

  const t = (key: string) => {
    const globalT = (STATIC_UI_STRINGS[language.toUpperCase() as keyof typeof STATIC_UI_STRINGS] || STATIC_UI_STRINGS.EN) as any;
    const translated = globalT?.[key];
    if (translated && translated !== key) return translated;
    if (language.toUpperCase() === 'FR' && localFR[key]) return localFR[key];
    return key;
  };

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1.5);
  const [selectedPlanetId, setSelectedPlanetId] = useState<string>("mercury");
  
  // Custom Kepler Parameters
  const [eccentricity, setEccentricity] = useState<number>(0.206);
  const [showVectors, setShowVectors] = useState<boolean>(true);
  const [showSweeper, setShowSweeper] = useState<boolean>(true);

  // Active planet angles
  const anglesRef = useRef<Record<string, number>>({
    mercury: 0.0,
    venus: 0.0,
    earth: 0.0,
    mars: 0.0,
    jupiter: 0.0,
    saturn: 0.0
  });

  // Equal-time swept sectors cache for the selected planet
  // Storing sector coordinates: { startAngle, endAngle, a, b }
  const [sweptSectors, setSweptSectors] = useState<{ startAngle: number; endAngle: number; a: number; b: number }[]>([]);
  const lastSectorAngleRef = useRef<number | null>(null);
  const sweepIntervalTimerRef = useRef<number>(0);

  const selectedPlanet = useMemo(() => {
    return PLANETS_DB.find(p => p.id === selectedPlanetId) || PLANETS_DB[0];
  }, [selectedPlanetId]);

  // Synchronize custom eccentricity slider when selected planet changes
  useEffect(() => {
    setEccentricity(selectedPlanet.defaultEccentricity);
    setSweptSectors([]); // Flush sectors history
    lastSectorAngleRef.current = null;
    sweepIntervalTimerRef.current = 0;
  }, [selectedPlanetId, selectedPlanet]);

  // Main high-performance render and physics simulation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    const render = () => {
      // 1. Draw space environment background
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, width, height);

      // Starry particles
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      for (let i = 0; i < 20; i++) {
        const sx = (Math.sin(i * 99) * 0.5 + 0.5) * width;
        const sy = (Math.cos(i * 34) * 0.5 + 0.5) * height;
        ctx.fillRect(sx, sy, 1.5, 1.5);
      }

      // Draw Sun focal point
      const sunGrad = ctx.createRadialGradient(centerX, centerY, 1, centerX, centerY, 15);
      sunGrad.addColorStop(0, '#fef08a');
      sunGrad.addColorStop(0.3, '#f59e0b');
      sunGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');
      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 16, 0, Math.PI * 2);
      ctx.fill();

      // 2. Render orbits, planets, and vectors
      PLANETS_DB.forEach((p) => {
        const isSelected = p.id === selectedPlanetId;
        const ecc = isSelected ? eccentricity : p.defaultEccentricity;

        // Semi-major (a) and Semi-minor (b) axes calculations
        const a = p.semiMajorAxis;
        const b = a * Math.sqrt(1 - ecc ** 2);
        
        // Offset focal center (F1 focus is at Sun center: 0,0)
        // Center of the ellipse is shifted left by focal distance: c = a * e
        const focalShift = a * ecc;
        const ellipseCenterX = centerX - focalShift;

        // Trace orbital trajectory line
        ctx.strokeStyle = isSelected ? 'rgba(99, 102, 241, 0.4)' : 'rgba(51, 65, 85, 0.25)';
        ctx.lineWidth = isSelected ? 1.5 : 0.75;
        ctx.beginPath();
        ctx.ellipse(ellipseCenterX, centerY, a, b, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Retrieve current anomalies angle
        let theta = anglesRef.current[p.id] || 0;

        // Physics step: Keplerian non-uniform angular speed (Sweeping faster near Sun)
        // From angular momentum: dtheta/dt = constant / r^2
        // We calculate current position distance r to the focal center
        const r_dist = a * (1 - ecc ** 2) / (1 + ecc * Math.cos(theta));
        
        // Base step speed proportional to relative years period
        const baseDt = (0.015 / p.orbitalPeriod) * speedMultiplier;
        
        // Angular step incorporating Keplerian scaling: dt' = dt * (a^2 / r^2)
        const dTheta = baseDt * ((a / r_dist) ** 2);

        if (isPlaying) {
          theta = (theta + dTheta) % (Math.PI * 2);
          anglesRef.current[p.id] = theta;
        }

        // Translate polar coords to focal Sun-relative cartesian coordinates
        const planetX = ellipseCenterX + a * Math.cos(theta);
        const planetY = centerY + b * Math.sin(theta);

        // Render Equal-Time Swept Sectors if toggled (Selected planet only)
        if (isSelected && showSweeper) {
          // Trigger a new sweep capture at fixed intervals of time
          if (isPlaying) {
            sweepIntervalTimerRef.current += 1;
            if (sweepIntervalTimerRef.current >= 45) { // captures every 45 ticks
              sweepIntervalTimerRef.current = 0;
              
              if (lastSectorAngleRef.current !== null) {
                // Save sector segment coordinates
                setSweptSectors((prev) => {
                  const chunk = prev.length >= 8 ? prev.slice(1) : prev;
                  return [...chunk, { 
                    startAngle: lastSectorAngleRef.current!, 
                    endAngle: theta, 
                    a, 
                    b 
                  }];
                });
              }
              lastSectorAngleRef.current = theta;
            }
          }

          // Draw all cached swept sector slices
          sweptSectors.forEach((sec, sIdx) => {
            ctx.fillStyle = `rgba(139, 92, 246, ${0.12 + (sIdx * 0.02)})`; // fading purple alpha
            ctx.strokeStyle = 'rgba(167, 139, 250, 0.35)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY); // Sun focal focus

            // Plot elliptical wedge curve points
            const steps = 15;
            const sAngle = sec.startAngle;
            let eAngle = sec.endAngle;
            // Handle wrap-around
            if (eAngle < sAngle) eAngle += Math.PI * 2;

            for (let i = 0; i <= steps; i++) {
              const curAngle = sAngle + (eAngle - sAngle) * (i / steps);
              const sx = ellipseCenterX + sec.a * Math.cos(curAngle);
              const sy = centerY + sec.b * Math.sin(curAngle);
              ctx.lineTo(sx, sy);
            }
            ctx.lineTo(centerX, centerY);
            ctx.fill();
            ctx.stroke();
          });
        }

        // Draw individual planet body node
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = isSelected ? 8 : 0;
        ctx.beginPath();
        ctx.arc(planetX, planetY, p.radius + (isSelected ? 2 : 0), 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // Reset glow

        // 3. Draw Professional Vector arrows starting from planet node (Selected planet only)
        if (isSelected && showVectors) {
          // Unit radial direction vector to Sun
          const dx = centerX - planetX;
          const dy = centerY - planetY;
          const d_len = Math.sqrt(dx * dx + dy * dy);
          const ux = dx / d_len;
          const uy = dy / d_len;

          // Gravitational Attraction Vector: pointing to Sun, scales inversely with distance square
          // F_g = G*M*m / r^2
          const gravityMagnitude = 11000 / (d_len * d_len) + 12; // visual scaling bounds
          const fX = planetX + ux * gravityMagnitude * 2.8;
          const fY = planetY + uy * gravityMagnitude * 2.8;

          // Draw Gravity Pull vector arrow (Glowing Crimson)
          drawVectorArrow(ctx, planetX, planetY, fX, fY, '#f43f5e', 1.5);

          // Velocity Vector: tangent to ellipse path, scales with energy conservation
          // In elliptical coordinate, tangent vector is proportional to (-a*sin(theta), b*cos(theta))
          const tx = -a * Math.sin(theta);
          const ty = b * Math.cos(theta);
          const t_len = Math.sqrt(tx * tx + ty * ty);
          
          // Speed magnitude incorporating Kepler vis-viva equation: v = c * dTheta
          const speedScaling = d_len * dTheta * 15; // physical velocity mapping
          const vx = planetX + (tx / t_len) * speedScaling;
          const vy = planetY + (ty / t_len) * speedScaling;

          // Draw Velocity tangent vector arrow (Neon Teal)
          drawVectorArrow(ctx, planetX, planetY, vx, vy, '#06b6d4', 1.5);
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isPlaying, speedMultiplier, selectedPlanetId, eccentricity, showVectors, showSweeper, sweptSectors]);

  // Utility to render vector arrows on canvas
  const drawVectorArrow = (ctx: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number, toY: number, color: string, width: number) => {
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();

    // Arrow tip calculations
    const angle = Math.atan2(toY - fromY, toX - fromX);
    const arrowSize = 5;
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - arrowSize * Math.cos(angle - Math.PI / 6), toY - arrowSize * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(toX - arrowSize * Math.cos(angle + Math.PI / 6), toY - arrowSize * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();
  };

  const handleResetOrbits = () => {
    setEccentricity(selectedPlanet.defaultEccentricity);
    setSweptSectors([]);
    lastSectorAngleRef.current = null;
    sweepIntervalTimerRef.current = 0;
  };

  return (
    <div className="my-8 rounded-[40px] border border-slate-850 bg-slate-950/40 backdrop-blur-xl shadow-2xl p-6 sm:p-8 relative select-none">
      <div className="absolute -left-16 -top-16 w-36 h-36 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />

      {/* Header element */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-850 pb-6 mb-6">
        <div>
          <h3 className="text-sm font-black text-slate-200 uppercase tracking-[0.25em] flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>{t("Kepler's Laws & Mechanics Lab")}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            {t("Explore angular momentum conservation: deform elliptical excentricity parameters and analyze velocity vs gravitational acceleration vectors.")}
          </p>
        </div>

        {/* Action Triggers */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Vector toggler */}
          <button
            onClick={() => setShowVectors(!showVectors)}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
              showVectors ? 'bg-indigo-600/25 border border-indigo-500/50 text-indigo-300' : 'bg-slate-900/40 border border-slate-850 text-slate-400'
            }`}
          >
            {t("Vectors ⇾")}
          </button>

          {/* Sweeper toggler */}
          <button
            onClick={() => setShowSweeper(!showSweeper)}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
              showSweeper ? 'bg-violet-600/25 border border-violet-500/50 text-violet-300' : 'bg-slate-900/40 border border-slate-850 text-slate-400'
            }`}
          >
            {t("Swept Areas (2nd Law)")}
          </button>

          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className={`p-2 rounded-xl cursor-pointer ${isPlaying ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          <button 
            onClick={handleResetOrbits}
            className="p-2 rounded-xl bg-slate-850 text-slate-400 cursor-pointer hover:text-slate-200 transition-colors"
            title="Reset orbits"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Planet Board Canvas */}
        <div className="lg:col-span-7 flex justify-center items-center">
          <div className="relative rounded-3xl overflow-hidden border border-slate-850 bg-[#020617] p-2 w-full max-w-[440px] aspect-square">
            <canvas
              ref={canvasRef}
              width={400}
              height={440}
              className="w-full h-full block rounded-2xl"
            />
          </div>
        </div>

        {/* Right Info panels */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Planet Selector Tabs */}
          <div className="rounded-3xl border border-slate-850 bg-slate-900/40 p-5">
            <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
              <Orbit className="w-4 h-4 text-cyan-400" />
              <span>{t("Select Celestial Target")}</span>
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {PLANETS_DB.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPlanetId(p.id)}
                  className={`px-2 py-1.5 rounded-xl text-[10px] font-bold text-center cursor-pointer transition-colors border ${
                    selectedPlanetId === p.id 
                      ? 'bg-slate-850 border-cyan-500/50 text-cyan-300' 
                      : 'bg-slate-900/20 border-slate-850 text-slate-400 hover:border-slate-800'
                  }`}
                >
                  {t(p.nameEN)}
                </button>
              ))}
            </div>
          </div>

          {/* Kepler Custom Eccentricity Slider */}
          <div className="rounded-3xl border border-slate-850 bg-slate-900/40 p-5 flex flex-col gap-4">
            <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-2 mb-1">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>{t("Adjust Eccentricity (e)")}</span>
            </h4>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-bold text-slate-400">
                <span>{t("Eccentricity Coefficient")}</span>
                <span className="font-mono text-cyan-300">{eccentricity.toFixed(3)}</span>
              </div>
              <input 
                type="range" 
                min="0.0" 
                max="0.75" 
                step="0.005"
                value={eccentricity}
                onChange={(e) => setEccentricity(parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>
          </div>

          {/* Physical Planet Specs Card */}
          <div className="rounded-3xl border border-slate-850 bg-slate-900/30 p-5 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start border-b border-slate-850/50 pb-2 mb-3">
                <h4 className="text-xs font-black text-slate-100 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedPlanet.color }} />
                  <span>{t(selectedPlanet.nameEN)}</span>
                </h4>
                <span className="text-[9px] font-bold text-slate-500 uppercase">{selectedPlanet.massText}</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {t(selectedPlanet.descEN)}
              </p>
            </div>

            {/* Vector Legend Indicators */}
            {showVectors && (
              <div className="border-t border-slate-850/50 pt-3.5 mt-4 grid grid-cols-2 gap-3 text-[9.5px] font-black uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-1.5 rounded-sm bg-[#06b6d4]" />
                  <span className="text-cyan-400">{t("Velocity Vector (v)")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-1.5 rounded-sm bg-[#f43f5e]" />
                  <span className="text-rose-400">{t("Gravity Force (F)")}</span>
                </div>
              </div>
            )}
          </div>

          {/* Theoretical acoustics insight */}
          <div className="rounded-3xl border border-slate-850 bg-slate-900/40 p-4 text-center select-text">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t("Second Law of Kepler")}</span>
            </span>
            <p className="text-[10.5px] text-slate-400 mt-1.5 leading-relaxed">
              {t("« Equal orbital areas are swept out in equal times ». Observe that all violet sector segments are identical in surface: the planet moves faster at perihelion.")}
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
