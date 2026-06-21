"use client";

import React, { useState, useEffect, useRef } from 'react';
import { RotateCw, ZoomIn, ZoomOut, Zap, Eye, Sliders, Play, Info, Award, CircleDot } from 'lucide-react';

interface Lobe {
  x: number;
  y: number;
  z: number;
  radius: number;
  color: string;
  phase: '+' | '-';
}

interface OrbitalPreset {
  id: string;
  nameFR: string;
  nameEN: string;
  descriptionFR: string;
  descriptionEN: string;
  geometryFR: string;
  geometryEN: string;
  lobes: Lobe[];
}

interface QuantumOrbitalExplorerProps {
  initialPresetId?: string;
  gradeLevel?: 'middle_school' | 'high_school' | 'university';
}

const ORBITALS: OrbitalPreset[] = [
  {
    id: "1s",
    nameFR: "Orbitale 1s",
    nameEN: "1s Orbital",
    descriptionFR: "Orbitale de plus basse énergie, de symétrie sphérique. La probabilité de présence de l'électron est maximale au centre.",
    descriptionEN: "The lowest energy orbital, showing perfect spherical symmetry. Electron probability density peaks at the nucleus.",
    geometryFR: "Sphérique (l = 0, m = 0)",
    geometryEN: "Spherical (l = 0, m = 0)",
    lobes: [
      { x: 0, y: 0, z: 0, radius: 26, color: '#3b82f6', phase: '+' }
    ]
  },
  {
    id: "2s",
    nameFR: "Orbitale 2s",
    nameEN: "2s Orbital",
    descriptionFR: "Orbitale sphérique comportant un nœud radial (surface sphérique où la probabilité de présence est nulle).",
    descriptionEN: "Spherical orbital with a radial node (a spherical shell where electron probability drops to zero).",
    geometryFR: "Sphérique avec nœud (l = 0, m = 0)",
    geometryEN: "Spherical with Node (l = 0, m = 0)",
    lobes: [
      { x: 0, y: 0, z: 0, radius: 28, color: '#3b82f6', phase: '+' },
      { x: 0, y: 0, z: 0, radius: 13, color: '#ef4444', phase: '-' } // Inner node lobe
    ]
  },
  {
    id: "2pz",
    nameFR: "Orbitale 2p_z",
    nameEN: "2p_z Orbital",
    descriptionFR: "Comporte deux lobes opposés séparés par un plan nodal (le plan xy). Les phases d'onde positive (bleu) et négative (rouge) représentent le signe de la fonction d'onde.",
    descriptionEN: "Features two opposing lobes separated by a nodal plane (the xy-plane). Wave phases of positive (blue) and negative (red) represent wave sign.",
    geometryFR: "Haltère / Bilobée (l = 1, m = 0)",
    geometryEN: "Dumbbell / Bilobed (l = 1, m = 0)",
    lobes: [
      { x: 0, y: 0.7, z: 0, radius: 22, color: '#3b82f6', phase: '+' },
      { x: 0, y: -0.7, z: 0, radius: 22, color: '#ef4444', phase: '-' }
    ]
  },
  {
    id: "2px",
    nameFR: "Orbitale 2p_x",
    nameEN: "2p_x Orbital",
    descriptionFR: "Orbitale bilobée orientée le cours de l'axe x. Le plan de symétrie yz est un plan nodal.",
    descriptionEN: "Bilobed orbital oriented along the x-axis. The yz-plane acts as a nodal plane.",
    geometryFR: "Haltère / Bilobée (l = 1, m = ±1)",
    geometryEN: "Dumbbell / Bilobed (l = 1, m = ±1)",
    lobes: [
      { x: 0.7, y: 0, z: 0, radius: 22, color: '#3b82f6', phase: '+' },
      { x: -0.7, y: 0, z: 0, radius: 22, color: '#ef4444', phase: '-' }
    ]
  },
  {
    id: "3d",
    nameFR: "Orbitale 3d_xy",
    nameEN: "3d_xy Orbital",
    descriptionFR: "Orbitale à quatre lobes (quadripolaire). Les lobes de signes opposés alternent dans les quatre quadrants.",
    descriptionEN: "Four-lobed (quadrupolar) d-orbital. Lobes of alternating wave signs populate the four quadrants.",
    geometryFR: "Trèfle / Quadrilobée (l = 2, m = ±2)",
    geometryEN: "Clover / Quadrupolar (l = 2, m = ±2)",
    lobes: [
      { x: 0.55, y: 0.55, z: 0, radius: 17, color: '#3b82f6', phase: '+' },
      { x: -0.55, y: -0.55, z: 0, radius: 17, color: '#3b82f6', phase: '+' },
      { x: -0.55, y: 0.55, z: 0, radius: 17, color: '#ef4444', phase: '-' },
      { x: 0.55, y: -0.55, z: 0, radius: 17, color: '#ef4444', phase: '-' }
    ]
  },
  {
    id: "sp",
    nameFR: "Hybride sp",
    nameEN: "sp Hybrid",
    descriptionFR: "Combinaison linéaire d'une orbitale s et d'une orbitale p. Donne deux orbitales hybrides orientées à 180° (géométrie linéaire).",
    descriptionEN: "Linear combination of one s and one p orbital. Creates two hybrid orbitals pointing at 180° (linear geometry).",
    geometryFR: "Linéaire (Angle de 180°)",
    geometryEN: "Linear (180° angle)",
    lobes: [
      { x: 0.6, y: 0, z: 0, radius: 22, color: '#3b82f6', phase: '+' },
      { x: -0.2, y: 0, z: 0, radius: 10, color: '#ef4444', phase: '-' },
      { x: -0.6, y: 0, z: 0, radius: 22, color: '#ef4444', phase: '-' },
      { x: 0.2, y: 0, z: 0, radius: 10, color: '#3b82f6', phase: '+' }
    ]
  },
  {
    id: "sp2",
    nameFR: "Hybride sp²",
    nameEN: "sp² Hybrid",
    descriptionFR: "Combinaison linéaire d'une orbitale s et de deux orbitales p. Forme trois orbitales hybrides orientées à 120° dans un plan.",
    descriptionEN: "Linear combination of one s and two p orbitals. Shapes three hybrid orbitals coplanar at 120°.",
    geometryFR: "Trigonale Plane (Angle de 120°)",
    geometryEN: "Trigonal Planar (120° angle)",
    lobes: [
      // Lobe 1
      { x: 0.6, y: 0, z: 0, radius: 21, color: '#3b82f6', phase: '+' },
      { x: -0.2, y: 0, z: 0, radius: 9, color: '#ef4444', phase: '-' },
      // Lobe 2
      { x: -0.3, y: 0.52, z: 0, radius: 21, color: '#3b82f6', phase: '+' },
      { x: 0.1, y: -0.17, z: 0, radius: 9, color: '#ef4444', phase: '-' },
      // Lobe 3
      { x: -0.3, y: -0.52, z: 0, radius: 21, color: '#3b82f6', phase: '+' },
      { x: 0.1, y: 0.17, z: 0, radius: 9, color: '#ef4444', phase: '-' }
    ]
  },
  {
    id: "sp3",
    nameFR: "Hybride sp³",
    nameEN: "sp³ Hybrid",
    descriptionFR: "Combinaison d'une orbitale s et de trois orbitales p. Produit quatre orbitales hybrides orientées vers les sommets d'un tétraèdre régulier.",
    descriptionEN: "Combination of one s and three p orbitals. Yields four hybrid orbitals oriented toward the vertices of a regular tetrahedron.",
    geometryFR: "Tétraédrique (Angle de 109.5°)",
    geometryEN: "Tetrahedral (109.5° angle)",
    lobes: [
      // Lobe 1 (Top)
      { x: 0, y: 0.65, z: 0, radius: 19, color: '#3b82f6', phase: '+' },
      { x: 0, y: -0.2, z: 0, radius: 8, color: '#ef4444', phase: '-' },
      // Lobe 2
      { x: 0.61, y: -0.21, z: 0, radius: 19, color: '#3b82f6', phase: '+' },
      { x: -0.2, y: 0.07, z: 0, radius: 8, color: '#ef4444', phase: '-' },
      // Lobe 3
      { x: -0.31, y: -0.21, z: 0.53, radius: 19, color: '#3b82f6', phase: '+' },
      { x: 0.1, y: 0.07, z: -0.18, radius: 8, color: '#ef4444', phase: '-' },
      // Lobe 4
      { x: -0.31, y: -0.21, z: -0.53, radius: 19, color: '#3b82f6', phase: '+' },
      { x: 0.1, y: 0.07, z: 0.18, radius: 8, color: '#ef4444', phase: '-' }
    ]
  }
];

export const QuantumOrbitalExplorer = ({
  initialPresetId = "1s",
  gradeLevel = "high_school"
}: QuantumOrbitalExplorerProps) => {

  const [activePreset, setActivePreset] = useState<OrbitalPreset>(() => {
    return ORBITALS.find(o => o.id === initialPresetId) || ORBITALS[0];
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [zoom, setZoom] = useState(100);
  const [autoRotate, setAutoRotate] = useState(true);
  const [showPhases, setShowPhases] = useState(true);

  // Euler angles
  const [angleX, setAngleX] = useState(-0.3);
  const [angleY, setAngleY] = useState(0.4);

  const isDragging = useRef(false);
  const lastMouseX = useRef(0);
  const lastMouseY = useRef(0);

  // Quantum electron configuration state (interactive shell filler)
  const [electronCount, setElectronCount] = useState(1);

  // Sync preset if prop updates
  useEffect(() => {
    const found = ORBITALS.find(o => o.id === initialPresetId);
    if (found) {
      setActivePreset(found);
    }
  }, [initialPresetId]);

  // 3D canvas rendering loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
      }

      const canvasWidth = rect.width;
      const canvasHeight = rect.height;

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      // Background grid lines (blueprint scientific grid)
      ctx.strokeStyle = 'rgba(51, 65, 85, 0.08)';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvasWidth; i += 30) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvasHeight);
        ctx.stroke();
      }
      for (let j = 0; j < canvasHeight; j += 30) {
        ctx.beginPath();
        ctx.moveTo(0, j);
        ctx.lineTo(canvasWidth, j);
        ctx.stroke();
      }

      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);

      const project = (lobe: Lobe, idx: number) => {
        const x1 = lobe.x * cosY - lobe.z * sinY;
        const z1 = lobe.z * cosY + lobe.x * sinY;

        const y2 = lobe.y * cosX - z1 * sinX;
        const z2 = z1 * cosX + lobe.y * sinX;

        const scaleFactor = zoom / (3.2 + z2 * 0.3);
        const sx = canvasWidth / 2 + x1 * scaleFactor;
        const sy = canvasHeight / 2 + y2 * scaleFactor;

        return { sx, sy, sz: z2, lobe, idx };
      };

      const projectedLobes = activePreset.lobes.map(project);
      
      // Sort back-to-front (Painters algorithm)
      projectedLobes.sort((a, b) => b.sz - a.sz);

      // Draw electron clouds / probability orbitals
      projectedLobes.forEach((item) => {
        const { sx, sy, sz, lobe } = item;
        const depthMultiplier = 3.2 / (3.2 + sz * 0.3);
        const drawRadius = Math.max(lobe.radius * (zoom / 100) * depthMultiplier, 3);

        const color = showPhases ? (lobe.phase === '+' ? '#3b82f6' : '#ef4444') : '#10b981';

        // Draw radial glow for orbital cloud feeling (using overlapping soft circles)
        const gradient = ctx.createRadialGradient(
          sx, sy, drawRadius * 0.1,
          sx, sy, drawRadius
        );

        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
        gradient.addColorStop(0.2, blendAlpha(color, 0.35));
        gradient.addColorStop(0.65, blendAlpha(color, 0.12));
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(sx, sy, drawRadius, 0, Math.PI * 2);
        ctx.fill();

        // Draw delicate boundary thin line contour
        ctx.strokeStyle = blendAlpha(color, 0.25);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(sx, sy, drawRadius * 0.85, 0, Math.PI * 2);
        ctx.stroke();

        // Overlay tiny positive or negative phase symbols (+ or -)
        if (showPhases) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
          ctx.font = 'bold 11px font-mono, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(lobe.phase, sx, sy);
        }
      });

      // Axis helper lines in bottom-left watermarked
      const axisLen = 25;
      const ox = 40, oy = canvasHeight - 40;
      
      // Draw X axis (Red)
      const rxX = cosY * axisLen, rxY = sinY * sinX * axisLen;
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(ox, oy);
      ctx.lineTo(ox + rxX, oy - rxY);
      ctx.stroke();
      
      // Draw Y axis (Green)
      const ryX = 0, ryY = cosX * axisLen;
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
      ctx.beginPath();
      ctx.moveTo(ox, oy);
      ctx.lineTo(ox + ryX, oy - ryY);
      ctx.stroke();

      if (autoRotate && !isDragging.current) {
        setAngleY((prev) => (prev + 0.007) % (Math.PI * 2));
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [activePreset, zoom, autoRotate, showPhases, angleX, angleY]);

  // Utility to blend hex and opacity for soft glow
  const blendAlpha = (hex: string, alpha: number) => {
    const num = parseInt(hex.replace("#",""), 16),
          R = num >> 16,
          G = num >> 8 & 0x00FF,
          B = num & 0x0000FF;
    return `rgba(${R}, ${G}, ${B}, ${alpha})`;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    lastMouseX.current = e.clientX;
    lastMouseY.current = e.clientY;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - lastMouseX.current;
    const deltaY = e.clientY - lastMouseY.current;

    lastMouseX.current = e.clientX;
    lastMouseY.current = e.clientY;

    setAngleY((prev) => prev + deltaX * 0.01);
    setAngleX((prev) => Math.max(-Math.PI / 2.3, Math.min(Math.PI / 2.3, prev + deltaY * 0.01)));
  };

  // Helper to build the electron arrows on energy levels
  // Aufbau principle configuration constructor
  const renderShellElectrons = (shell: '1s' | '2s' | '2px' | '2py' | '2pz') => {
    // Determine number of electrons in this specific subshell based on Hund's rule/Aufbau
    let count = 0;
    
    // 1s fills first
    if (shell === '1s') {
      count = Math.min(2, electronCount);
    } 
    // 2s fills second
    else if (shell === '2s') {
      count = Math.min(2, Math.max(0, electronCount - 2));
    } 
    // 2p fills last. Regenerate degenerates (Hund's rule)
    else {
      const pCount = Math.max(0, electronCount - 4);
      if (pCount > 0) {
        if (pCount <= 3) {
          // Fill singly first
          if (shell === '2px') count = 1;
          if (shell === '2py' && pCount >= 2) count = 1;
          if (shell === '2pz' && pCount >= 3) count = 1;
        } else {
          // Double up
          if (shell === '2px') count = 2;
          if (shell === '2py') count = pCount >= 5 ? 2 : 1;
          if (shell === '2pz') count = pCount >= 6 ? 2 : 1;
        }
      }
    }

    return (
      <div className="flex items-center gap-1.5 h-6 px-2 bg-slate-950/60 border border-slate-900 rounded-lg min-w-[34px] justify-center shadow-inner">
        {count >= 1 && (
          <span className="text-cyan-400 font-black text-sm select-none animate-fadeIn">↑</span>
        )}
        {count >= 2 && (
          <span className="text-amber-400 font-black text-sm select-none animate-fadeIn">↓</span>
        )}
        {count === 0 && <span className="text-slate-700 font-extrabold text-[8px] select-none uppercase tracking-wide">Empty</span>}
      </div>
    );
  };

  return (
    <div className="my-8 rounded-3xl overflow-hidden border border-slate-800/85 bg-slate-950/40 backdrop-blur-xl shadow-2xl p-6 sm:p-8">
      {/* Upper header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-850 pb-5 mb-5">
        <div>
          <h4 className="text-sm font-black text-slate-100 uppercase tracking-widest flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Quantum Orbital & Hybridization Explorer</span>
          </h4>
          <p className="text-[11px] text-slate-400 font-semibold mt-1">
            Drag to rotate 3D wave probability density. Step through energy levels on the sidebar.
          </p>
        </div>

        {/* Orbitals selector pills */}
        <div className="flex flex-wrap gap-1.5">
          {ORBITALS.map((o) => (
            <button
              key={o.id}
              onClick={() => setActivePreset(o)}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer border ${
                activePreset.id === o.id
                  ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.15)]"
                  : "bg-slate-900/60 border-slate-800/80 text-slate-400 hover:text-slate-200"
              }`}
            >
              {o.id}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Render Viewport (7 cols) */}
        <div className="lg:col-span-7 relative h-[320px] lg:h-[360px] rounded-2xl border border-slate-850 bg-slate-950 overflow-hidden select-none">
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={() => { isDragging.current = false; }}
            onMouseLeave={() => { isDragging.current = false; }}
            className="w-full h-full cursor-grab active:cursor-grabbing block"
          />

          {/* Quick HUD controls */}
          <div className="absolute bottom-3 left-3 flex items-center gap-2 pointer-events-auto">
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className={`p-2 rounded-lg border text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                autoRotate
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
              title="Toggle Auto Rotation"
            >
              <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
            </button>

            <button
              onClick={() => setShowPhases(!showPhases)}
              className={`p-2 rounded-lg border text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                showPhases
                  ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
              title="Toggle Wave Sign Phases (+ / -)"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="absolute bottom-3 right-3 flex items-center gap-2 bg-slate-900/85 border border-slate-800/80 rounded-xl px-2 py-1">
            <button onClick={() => setZoom(z => Math.max(40, z - 10))} className="text-slate-400 hover:text-white cursor-pointer p-1">
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => setZoom(z => Math.min(180, z + 10))} className="text-slate-400 hover:text-white cursor-pointer p-1">
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Quantum Sidebar: Interactive Aufbau Energy Shell Filler (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-slate-900/30 border border-slate-850 rounded-2xl p-5 space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black uppercase text-cyan-400 tracking-widest bg-cyan-500/5 border border-cyan-500/10 px-2.5 py-1 rounded-lg w-max block">
                Aufbau Shell Filler
              </span>
              
              {/* Interactive electron counter */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setElectronCount(e => Math.max(1, e - 1))}
                  className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-800 hover:text-white text-slate-400 flex items-center justify-center font-bold cursor-pointer text-xs active:scale-95"
                  title="Remove Electron"
                >
                  -
                </button>
                <span className="text-xs font-mono font-black text-slate-200 w-12 text-center bg-slate-950/50 py-0.5 border border-slate-900 rounded">
                  {electronCount} e⁻
                </span>
                <button 
                  onClick={() => setElectronCount(e => Math.min(10, e + 1))}
                  className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-800 hover:text-white text-slate-400 flex items-center justify-center font-bold cursor-pointer text-xs active:scale-95"
                  title="Add Electron"
                >
                  +
                </button>
              </div>
            </div>

            {/* Visual Shell levels graph */}
            <div className="relative border-l border-slate-800/80 pl-4 py-1 space-y-3">
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500/50 via-indigo-500/30 to-slate-900/10" />
              
              {/* 2p Subshell (degenerates) */}
              <div className="space-y-1">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider block">Subshell 2p</span>
                <div className="flex gap-2">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-mono font-black text-slate-400">2p_x</span>
                    {renderShellElectrons('2px')}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-mono font-black text-slate-400">2p_y</span>
                    {renderShellElectrons('2py')}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-mono font-black text-slate-400">2p_z</span>
                    {renderShellElectrons('2pz')}
                  </div>
                </div>
              </div>

              {/* 2s Subshell */}
              <div className="space-y-1">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider block">Subshell 2s</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono font-black text-slate-400">2s</span>
                  {renderShellElectrons('2s')}
                </div>
              </div>

              {/* 1s Subshell */}
              <div className="space-y-1">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider block">Subshell 1s</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono font-black text-slate-400">1s</span>
                  {renderShellElectrons('1s')}
                </div>
              </div>
            </div>
          </div>

          {/* Active Preset detailed chemical annotation */}
          <div className="pt-4 border-t border-slate-850/80 space-y-2">
            <h5 className="text-xs font-black text-white flex items-center gap-1.5">
              <CircleDot className="w-3.5 h-3.5 text-cyan-400" />
              <span>{activePreset.nameFR}</span>
            </h5>
            <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
              {activePreset.descriptionFR}
            </p>
            
            <div className="bg-slate-950/40 border border-slate-850 p-2.5 rounded-xl flex justify-between items-center text-[10px] font-bold">
              <span className="text-slate-500 uppercase">Géométrie de liaison</span>
              <span className="text-cyan-400 font-black">{activePreset.geometryFR}</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
