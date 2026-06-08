"use client";

import React, { useState, useEffect, useRef } from 'react';
import { RotateCw, ZoomIn, ZoomOut, Zap, Eye, HelpCircle } from 'lucide-react';

interface Atom {
  x: number;
  y: number;
  z: number;
  color: string;
  radius: number;
  label: string;
}

interface Bond {
  atomA: number;
  atomB: number;
  isDouble?: boolean;
}

interface Preset {
  name: string;
  id: string;
  description: string;
  atoms: Atom[];
  bonds: Bond[];
}

// Generate NaCl grid
const generateNaCl = (): { atoms: Atom[]; bonds: Bond[] } => {
  const atoms: Atom[] = [];
  const bonds: Bond[] = [];
  const scale = 0.9;

  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        const isNa = (x + y + z) % 2 === 0;
        atoms.push({
          x: x * scale,
          y: y * scale,
          z: z * scale,
          color: isNa ? '#10b981' : '#3b82f6', // Na: Emerald Green, Cl: Blue
          radius: isNa ? 10 : 15,
          label: isNa ? 'Na⁺' : 'Cl⁻'
        });
      }
    }
  }

  // Connect adjacent nodes
  const getIndex = (cx: number, cy: number, cz: number) => {
    const xIdx = cx + 1;
    const yIdx = cy + 1;
    const zIdx = cz + 1;
    return xIdx * 9 + yIdx * 3 + zIdx;
  };

  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        const idx = getIndex(x, y, z);
        if (x < 1) bonds.push({ atomA: idx, atomB: getIndex(x + 1, y, z) });
        if (y < 1) bonds.push({ atomA: idx, atomB: getIndex(x, y + 1, z) });
        if (z < 1) bonds.push({ atomA: idx, atomB: getIndex(x, y, z + 1) });
      }
    }
  }

  return { atoms, bonds };
};

// Generate Graphene sheet with a slight 3D ripple
const generateGraphene = (): { atoms: Atom[]; bonds: Bond[] } => {
  const atoms: Atom[] = [];
  const bonds: Bond[] = [];
  const scale = 0.45;

  // Let's create a 4x4 hexagonal grid
  // In a hexagonal grid, coordinates can be defined on a triangular lattice
  const rows = 4;
  const cols = 5;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; cols > c; c++) {
      // Calculate hexagonal layout
      let x = (c * 1.5) - (cols * 0.75);
      let y = (r * Math.sqrt(3) + (c % 2 === 0 ? 0 : Math.sqrt(3) / 2)) - (rows * Math.sqrt(3) * 0.5);
      
      // Add a slight sine ripple on Z axis for amazing 3D aesthetic depth
      const z = Math.sin(x * 1.5) * Math.cos(y * 1.5) * 0.25;

      atoms.push({
        x: x * scale,
        y: y * scale,
        z: z * scale,
        color: '#64748b', // Carbon: Dark Slate
        radius: 11,
        label: 'C'
      });
    }
  }

  // Detect and connect adjacent atoms within hexagonal distance threshold
  const distanceThreshold = scale * 1.15; // Hexagon side length is roughly scale
  for (let i = 0; i < atoms.length; i++) {
    for (let j = i + 1; j < atoms.length; j++) {
      const dx = atoms[i].x - atoms[j].x;
      const dy = atoms[i].y - atoms[j].y;
      const dz = atoms[i].z - atoms[j].z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (dist < distanceThreshold) {
        bonds.push({ atomA: i, atomB: j });
      }
    }
  }

  return { atoms, bonds };
};

const PRESETS: Preset[] = [
  {
    name: "Water (H₂O)",
    id: "h2o",
    description: "Polar molecule showing a bent molecular geometry with an angle of 104.5°.",
    atoms: [
      { x: 0, y: -0.15, z: 0, color: '#ef4444', radius: 18, label: 'O' },      // Oxygen (Red)
      { x: 0.85, y: 0.60, z: 0, color: '#f8fafc', radius: 10, label: 'H' },    // Hydrogen 1 (White)
      { x: -0.85, y: 0.60, z: 0, color: '#f8fafc', radius: 10, label: 'H' }    // Hydrogen 2 (White)
    ],
    bonds: [
      { atomA: 0, atomB: 1 },
      { atomA: 0, atomB: 2 }
    ]
  },
  {
    name: "Carbon Dioxide (CO₂)",
    id: "co2",
    description: "Linear molecule featuring double covalent bonds between carbon and oxygen.",
    atoms: [
      { x: 0, y: 0, z: 0, color: '#475569', radius: 15, label: 'C' },         // Carbon (Slate)
      { x: 1.2, y: 0, z: 0, color: '#ef4444', radius: 18, label: 'O' },        // Oxygen 1 (Red)
      { x: -1.2, y: 0, z: 0, color: '#ef4444', radius: 18, label: 'O' }        // Oxygen 2 (Red)
    ],
    bonds: [
      { atomA: 0, atomB: 1, isDouble: true },
      { atomA: 0, atomB: 2, isDouble: true }
    ]
  },
  {
    name: "Methane (CH₄)",
    id: "ch4",
    description: "Symmetrical tetrahedral configuration showcasing four carbon-hydrogen single bonds.",
    atoms: [
      { x: 0, y: 0, z: 0, color: '#475569', radius: 15, label: 'C' },         // Carbon
      { x: 0, y: 1.1, z: 0, color: '#f8fafc', radius: 10, label: 'H' },        // Top H
      { x: 1.03, y: -0.36, z: 0, color: '#f8fafc', radius: 10, label: 'H' },   // H2
      { x: -0.51, y: -0.36, z: 0.89, color: '#f8fafc', radius: 10, label: 'H' }, // H3
      { x: -0.51, y: -0.36, z: -0.89, color: '#f8fafc', radius: 10, label: 'H' } // H4
    ],
    bonds: [
      { atomA: 0, atomB: 1 },
      { atomA: 0, atomB: 2 },
      { atomA: 0, atomB: 3 },
      { atomA: 0, atomB: 4 }
    ]
  },
  {
    name: "Salt Lattice (NaCl)",
    id: "nacl",
    description: "FCC (Face-Centered Cubic) crystalline arrangement of alternating sodium and chlorine ions.",
    ...generateNaCl()
  },
  {
    name: "Graphene Sheet",
    id: "graphene",
    description: "2D planar grid of sp² hybridized carbon atoms arranged in an interlocking hexagonal lattice.",
    ...generateGraphene()
  }
];

export const StructureViewer3D = ({ presetId = "h2o" }: { presetId?: string }) => {
  const [activePreset, setActivePreset] = useState<Preset>(() => {
    return PRESETS.find(p => p.id === presetId) || PRESETS[0];
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [zoom, setZoom] = useState(100);
  const [autoRotate, setAutoRotate] = useState(true);
  const [showLabels, setShowLabels] = useState(true);

  // Euler angles for 3D rotation tracking
  const [angleX, setAngleX] = useState(-0.4); // Pitch
  const [angleY, setAngleY] = useState(0.5);  // Yaw

  const isDragging = useRef(false);
  const lastMouseX = useRef(0);
  const lastMouseY = useRef(0);

  // React to preset updates from MDX props
  useEffect(() => {
    const found = PRESETS.find(p => p.id === presetId);
    if (found) {
      setActivePreset(found);
    }
  }, [presetId]);

  // Canvas Drawing & Rendering Logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      // Handle canvas resolution and size
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
      }

      const canvasWidth = rect.width;
      const canvasHeight = rect.height;

      // Clear layout
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      // Trigonometric cache for Euler angle projection
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);

      // Depth projection helper
      const project = (atom: Atom) => {
        // Rotate around Y axis (Yaw)
        const x1 = atom.x * cosY - atom.z * sinY;
        const z1 = atom.z * cosY + atom.x * sinY;

        // Rotate around X axis (Pitch)
        const y2 = atom.y * cosX - z1 * sinX;
        const z2 = z1 * cosX + atom.y * sinX;

        // Apply scale & viewport center offset
        const scaleFactor = zoom / (3.5 + z2 * 0.4); // Subtle orthographic perspective feel
        const sx = canvasWidth / 2 + x1 * scaleFactor;
        const sy = canvasHeight / 2 + y2 * scaleFactor;

        return { sx, sy, sz: z2, atom };
      };

      // Project all atoms
      const projectedAtoms = activePreset.atoms.map(project);

      // Depth sorting (Painters algorithm: back-to-front rendering)
      // Elements with larger `sz` (further away) are drawn first, elements with smaller `sz` (closer) are drawn last.
      // We sort items in descending order of sz so they draw back-to-front.
      
      // Let's pre-project the bonds to sort them relative to atoms
      const projectedBonds = activePreset.bonds.map(bond => {
        const pA = projectedAtoms[bond.atomA];
        const pB = projectedAtoms[bond.atomB];
        const averageZ = (pA.sz + pB.sz) / 2;
        return {
          type: 'bond' as const,
          sz: averageZ,
          bond,
          pA,
          pB
        };
      });

      const atomRenderObjects = projectedAtoms.map((pAtom, idx) => ({
        type: 'atom' as const,
        idx,
        ...pAtom
      }));

      // Combine both lists and sort them by sz descending (back-to-front)
      const renderQueue = [...projectedBonds, ...atomRenderObjects];
      renderQueue.sort((a, b) => b.sz - a.sz);

      // Draw loop
      renderQueue.forEach((item) => {
        if (item.type === 'bond') {
          const { pA, pB, bond } = item;
          ctx.beginPath();
          ctx.strokeStyle = '#475569';

          if (bond.isDouble) {
            // Draw dual offset double lines
            const dx = pB.sx - pA.sx;
            const dy = pB.sy - pA.sy;
            const len = Math.sqrt(dx * dx + dy * dy);
            const ox = (-dy / len) * 3.5;
            const oy = (dx / len) * 3.5;

            ctx.lineWidth = 2.5;
            ctx.strokeStyle = '#64748b';
            ctx.beginPath();
            ctx.moveTo(pA.sx + ox, pA.sy + oy);
            ctx.lineTo(pB.sx + ox, pB.sy + oy);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(pA.sx - ox, pA.sy - oy);
            ctx.lineTo(pB.sx - ox, pB.sy - oy);
            ctx.stroke();
          } else {
            // Standard single covalent bond
            ctx.lineWidth = 3.5;
            ctx.strokeStyle = 'rgba(100, 116, 139, 0.65)';
            ctx.moveTo(pA.sx, pA.sy);
            ctx.lineTo(pB.sx, pB.sy);
            ctx.stroke();
          }
        } else if (item.type === 'atom') {
          const { sx, sy, sz, atom } = item;
          // Dynamically scale atom size based on perspective depth
          const depthMultiplier = 3.5 / (3.5 + sz * 0.4);
          const drawRadius = Math.max(atom.radius * (zoom / 100) * depthMultiplier, 3);

          // Draw shiny spherical gradient
          const grad = ctx.createRadialGradient(
            sx - drawRadius * 0.28,
            sy - drawRadius * 0.28,
            drawRadius * 0.05,
            sx,
            sy,
            drawRadius
          );
          
          // Highlights mapping for organic 3D glossy feel
          grad.addColorStop(0, '#ffffff');
          grad.addColorStop(0.2, atom.color);
          grad.addColorStop(0.85, darkenColor(atom.color, 40));
          grad.addColorStop(1, darkenColor(atom.color, 80));

          ctx.beginPath();
          ctx.fillStyle = grad;
          ctx.arc(sx, sy, drawRadius, 0, Math.PI * 2);
          ctx.fill();

          // Delicate outer contour stroke
          ctx.strokeStyle = 'rgba(15, 23, 42, 0.45)';
          ctx.lineWidth = 1;
          ctx.stroke();

          // Render atom chemical symbol label
          if (showLabels) {
            ctx.fillStyle = '#ffffff';
            ctx.font = `bold ${Math.max(9, drawRadius * 0.6)}px system-ui, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
            ctx.shadowBlur = 4;
            ctx.fillText(atom.label, sx, sy);
            ctx.shadowBlur = 0; // Reset shadow
          }
        }
      });

      // Update angles if auto-rotating
      if (autoRotate && !isDragging.current) {
        setAngleY((prev) => (prev + 0.006) % (Math.PI * 2));
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [activePreset, zoom, autoRotate, showLabels, angleX, angleY]);

  // Utility to darken hex colors for Canvas specular lighting rendering
  const darkenColor = (hex: string, percent: number) => {
    const num = parseInt(hex.replace("#",""), 16),
          amt = Math.round(2.55 * percent),
          R = (num >> 16) - amt,
          G = (num >> 8 & 0x00FF) - amt,
          B = (num & 0x0000FF) - amt;
    return "#" + (0x1000000 + (R<0?0:R>255?255:R)*0x10000 + (G<0?0:G>255?255:G)*0x100 + (B<0?0:B>255?255:B)).toString(16).slice(1);
  };

  // Drag interaction handlers
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
    setAngleX((prev) => Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, prev + deltaY * 0.01)));
  };

  const handleMouseUpOrLeave = () => {
    isDragging.current = false;
  };

  // Touch handlers for mobile/tablet responsive drags
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    isDragging.current = true;
    lastMouseX.current = e.touches[0].clientX;
    lastMouseY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - lastMouseX.current;
    const deltaY = e.touches[0].clientY - lastMouseY.current;

    lastMouseX.current = e.touches[0].clientX;
    lastMouseY.current = e.touches[0].clientY;

    setAngleY((prev) => prev + deltaX * 0.01);
    setAngleX((prev) => Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, prev + deltaY * 0.01)));
  };

  return (
    <div className="my-8 rounded-3xl overflow-hidden border border-slate-800/80 bg-slate-950/40 backdrop-blur-xl shadow-2xl p-6 sm:p-8">
      {/* Molecule Details Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-850/80 pb-5 mb-5">
        <div>
          <h4 className="text-sm font-black text-slate-100 uppercase tracking-widest flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Interactive 3D Structure Viewer</span>
          </h4>
          <p className="text-[11px] text-slate-400 font-semibold mt-1">
            Drag to rotate molecule, use scroll or slider to zoom.
          </p>
        </div>

        {/* Preset pill list */}
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => setActivePreset(p)}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer border ${
                activePreset.id === p.id
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.15)]"
                  : "bg-slate-900/60 border-slate-800/80 text-slate-400 hover:text-slate-200"
              }`}
            >
              {p.name.split(' ')[0]} {/* Grab short name */}
            </button>
          ))}
        </div>
      </div>

      {/* Main interactive viewport container */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
        
        {/* Canvas Render Panel (3 cols) */}
        <div className="lg:col-span-3 relative h-[320px] rounded-2xl border border-slate-850 bg-slate-950 overflow-hidden group select-none">
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUpOrLeave}
            className="w-full h-full cursor-grab active:cursor-grabbing block"
          />

          {/* Quick HUD controls overlay (Watermark detail + toggles) */}
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
              onClick={() => setShowLabels(!showLabels)}
              className={`p-2 rounded-lg border text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                showLabels
                  ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
              title="Toggle Element Labels"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Zoom controls float HUD */}
          <div className="absolute bottom-3 right-3 flex items-center gap-2.5 bg-slate-900/80 border border-slate-800/80 rounded-xl px-3 py-1.5">
            <button onClick={() => setZoom(z => Math.max(40, z - 10))} className="text-slate-400 hover:text-white cursor-pointer">
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <input
              type="range"
              min="40"
              max="200"
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-16 sm:w-20 accent-amber-400 h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer"
            />
            <button onClick={() => setZoom(z => Math.min(200, z + 10))} className="text-slate-400 hover:text-white cursor-pointer">
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Compound details & Info card (1 col) */}
        <div className="lg:col-span-1 flex flex-col justify-between bg-slate-900/30 border border-slate-850 rounded-2xl p-5 space-y-4">
          <div className="space-y-3">
            <span className="text-[10px] font-black uppercase text-amber-400 tracking-widest flex items-center gap-1 bg-amber-500/5 border border-amber-500/10 px-2.5 py-1 rounded-lg w-max">
              Active Specimen
            </span>
            <h5 className="text-sm font-extrabold text-slate-100">{activePreset.name}</h5>
            <p className="text-xs text-slate-400 leading-relaxed font-semibold">
              {activePreset.description}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-850/80 space-y-2">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">
              Atom Legend
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
    </div>
  );
};
