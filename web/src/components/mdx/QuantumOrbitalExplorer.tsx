import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { RotateCcw, Eye, Play, Pause, Atom, Sparkles, CircleDot, RotateCw, ZoomOut, ZoomIn } from 'lucide-react';
import { STATIC_UI_STRINGS } from '@/lib/translations';
import { ORBITALS, OrbitalPreset, Lobe, Point3D, Face, Mesh } from './quantum-orbital/orbitalPresets';
import { generateMeshForPreset, generateCustomMesh } from './quantum-orbital/orbitalMath';
import { OrbitalSidebar } from './quantum-orbital/OrbitalSidebar';

export { ORBITALS };
export type { OrbitalPreset, Lobe, Point3D, Face, Mesh };

export interface QuantumOrbitalExplorerProps {
  initialPresetId?: string;
  initialPreset?: string;
  gradeLevel?: string;
}

export const QuantumOrbitalExplorer = ({
  initialPresetId = "1s",
  gradeLevel = "high_school"
}: QuantumOrbitalExplorerProps) => {
  const { language } = useLanguage();
  const t = (STATIC_UI_STRINGS[language.toUpperCase() as keyof typeof STATIC_UI_STRINGS] || STATIC_UI_STRINGS.EN) as any;

  const [activePreset, setActivePreset] = useState<OrbitalPreset>(() => {
    return ORBITALS.find(o => o.id === initialPresetId) || ORBITALS[0];
  });

  const [mode, setMode] = useState<'preset' | 'schrodinger'>('preset');

  // Custom Schrödinger sandbox states
  const [customN, setCustomN] = useState(3);
  const [customL, setCustomL] = useState(1);
  const [customM, setCustomM] = useState(0);

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
  const sidebarTab = mode === 'preset' ? 'presets' : 'quantum';
  const setSidebarTab = (tab: any) => setMode(tab === 'presets' ? 'preset' : 'schrodinger');
  const activePresetId = activePreset.id;
  const selectPreset = (id: string) => {
    const found = ORBITALS.find(o => o.id === id);
    if (found) setActivePreset(found);
  };
  const isHybridPreset = Boolean((activePreset as any).isHybrid || activePreset.id.startsWith('sp'));
  const atomicNumber = electronCount;
  const setAtomicNumber = setElectronCount;
  const energyLevelEv = (-13.6 / (customN * customN)).toFixed(2);
  const customOrbitalInfo = {
    name: `${customN}${['s', 'p', 'd', 'f'][customL] || 'g'}_${customM}`,
    desc: `Quantum state n=${customN}, l=${customL}, m=${customM}`,
    geometry: 'Spherical Harmonic'
  };
  const renderElectronBox = (shell: string, maxElectrons: number) => (
    <div className="flex gap-1">
      {Array.from({ length: maxElectrons }).map((_, i) => (
        <div key={i} className={`w-3 h-3 rounded-sm border ${i < electronCount ? 'bg-cyan-500 border-cyan-400' : 'bg-slate-800 border-slate-700'}`} />
      ))}
    </div>
  );

  // Sync preset if prop updates
  useEffect(() => {
    const found = ORBITALS.find(o => o.id === initialPresetId);
    if (found) {
      setActivePreset(found);
      setMode('preset');
    }
  }, [initialPresetId]);

  // Generate meshes for current state
  const activeMeshes = useMemo(() => {
    if (mode === 'schrodinger') {
      return generateCustomMesh(customN, customL, customM);
    }
    return generateMeshForPreset(activePreset.id);
  }, [mode, activePreset.id, customN, customL, customM]);

  // Helper to blend base colors with light intensity and alpha opacity
  const blendAlphaAndLight = (hex: string, intensity: number, opacity: number) => {
    const num = parseInt(hex.replace("#", ""), 16);
    let R = (num >> 16) & 0xff;
    let G = (num >> 8) & 0xff;
    let B = num & 0xff;

 
    R = Math.min(255, Math.max(0, Math.round(R * intensity)));
    G = Math.min(255, Math.max(0, Math.round(G * intensity)));
    B = Math.min(255, Math.max(0, Math.round(B * intensity)));

    return `rgba(${R}, ${G}, ${B}, ${opacity})`;
  };

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
      ctx.strokeStyle = 'rgba(51, 65, 85, 0.06)';
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

      // Projects 3D mesh vertices into 2D canvas coordinates
      const allProjectedMeshes = activeMeshes.map((mesh, meshIdx) => {
        const projectedVertices = mesh.vertices.map((v) => {
          // Rotate around Y-axis (horizontal)
          const x1 = v.x * cosY - v.z * sinY;
          const z1 = v.z * cosY + v.x * sinY;

          // Rotate around X-axis (vertical)
          const y2 = v.y * cosX - z1 * sinX;
          const z2 = z1 * cosX + v.y * sinX;

          // Perspective scaling
          const scaleFactor = (zoom / 100) / (1.2 + (z2 / 250));
          const sx = canvasWidth / 2 + x1 * scaleFactor;
          const sy = canvasHeight / 2 + y2 * scaleFactor;

          return { sx, sy, sz: z2, rx: x1, ry: y2, rz: z2 };
        });

        // Map faces and compute normal vectors + depths
        return mesh.faces.map((face) => {
          const p0 = projectedVertices[face.indices[0]];
          const p1 = projectedVertices[face.indices[1]];
          const p2 = projectedVertices[face.indices[2]];
          const p3 = projectedVertices[face.indices[3]];

          const avgZ = (p0.sz + p1.sz + p2.sz + p3.sz) / 4;

          // Normal calculation from rotated vertices
          const ux = p1.rx - p0.rx;
          const uy = p1.ry - p0.ry;
          const uz = p1.rz - p0.rz;

          const vx = p3.rx - p0.rx;
          const vy = p3.ry - p0.ry;
          const vz = p3.rz - p0.rz;

          let nx = uy * vz - uz * vy;
          let ny = uz * vx - ux * vz;
          let nz = ux * vy - uy * vx;

          const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
          if (len > 0.0001) {
            nx /= len;
            ny /= len;
            nz /= len;
          }

          // Shading: light coming from front (dot product with z-axis)
          const intensity = 0.35 + 0.65 * Math.abs(nz);

          let colorBase = '#10b981'; // Phase off color
          if (showPhases) {
            colorBase = face.phase === 1 ? '#3b82f6' : '#ef4444';
          }

          // Inner shells or outer shells transparent/solid blending (hybrid lobes should be uniform)
          const isHybrid = mode === 'preset' && activePreset.id.startsWith('sp');
          const opacity = (meshIdx === 0 && activeMeshes.length > 1 && !isHybrid) ? 0.32 : 0.82;

          return { p0, p1, p2, p3, avgZ, intensity, colorBase, opacity };
        });
      });

      const allFaces = allProjectedMeshes.flat();
      if (allFaces.length > 0) {
        // Painters Algorithm: sort faces back-to-front
        allFaces.sort((a, b) => b.avgZ - a.avgZ);

        // Draw solid shaded polygons
        allFaces.forEach((face) => {
          const { p0, p1, p2, p3, intensity, colorBase, opacity } = face;

          const color = blendAlphaAndLight(colorBase, intensity, opacity);
          const strokeColor = blendAlphaAndLight(colorBase, intensity * 1.15, opacity * 0.25);

          ctx.fillStyle = color;
          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = 0.5;

          ctx.beginPath();
          ctx.moveTo(p0.sx, p0.sy);
          ctx.lineTo(p1.sx, p1.sy);
          ctx.lineTo(p2.sx, p2.sy);
          ctx.lineTo(p3.sx, p3.sy);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        });
      }

      // Draw 3D axis helper in the bottom-left corner
      const axisLen = 22;
      const ox = 40;
      const oy = canvasHeight - 40;

      const rotateVector = (vx: number, vy: number, vz: number) => {
        const x1 = vx * cosY - vz * sinY;
        const z1 = vz * cosY + vx * sinY;
        const y2 = vy * cosX - z1 * sinX;
        const z2 = z1 * cosX + vy * sinX;
        return { x: x1, y: y2, z: z2 };
      };

      const axisX = rotateVector(axisLen, 0, 0);
      const axisY = rotateVector(0, axisLen, 0);
      const axisZ = rotateVector(0, 0, axisLen);

      // Draw X axis (Red)
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(ox, oy);
      ctx.lineTo(ox + axisX.x, oy - axisX.y);
      ctx.stroke();

      // Draw Y axis (Green)
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.45)';
      ctx.beginPath();
      ctx.moveTo(ox, oy);
      ctx.lineTo(ox + axisY.x, oy - axisY.y);
      ctx.stroke();

      // Draw Z axis (Blue)
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.45)';
      ctx.beginPath();
      ctx.moveTo(ox, oy);
      ctx.lineTo(ox + axisZ.x, oy - axisZ.y);
      ctx.stroke();

      // Draw Axis labels
      ctx.font = 'bold 8.5px sans-serif';
      ctx.fillStyle = 'rgba(239, 68, 68, 0.6)';
      ctx.fillText('x', ox + axisX.x + 3.5, oy - axisX.y + 3);

      ctx.fillStyle = 'rgba(16, 185, 129, 0.6)';
      ctx.fillText('y', ox + axisY.x + 3.5, oy - axisY.y - 3.5);

      ctx.fillStyle = 'rgba(59, 130, 246, 0.6)';
      ctx.fillText('z', ox + axisZ.x + 3.5, oy - axisZ.y + 3);

      if (autoRotate && !isDragging.current) {
        setAngleY((prev) => (prev + 0.007) % (Math.PI * 2));
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [activeMeshes, zoom, autoRotate, showPhases, angleX, angleY]);

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

    setAngleY((prev) => prev + deltaX * 0.009);
    setAngleX((prev) => Math.max(-Math.PI / 2.3, Math.min(Math.PI / 2.3, prev + deltaY * 0.009)));
  };

  const renderShellElectrons = (shell: '1s' | '2s' | '2px' | '2py' | '2pz') => {
    let count = 0;

    if (shell === '1s') {
      count = Math.min(2, electronCount);
    } else if (shell === '2s') {
      count = Math.min(2, Math.max(0, electronCount - 2));
    } else {
      const pCount = Math.max(0, electronCount - 4);
      if (pCount > 0) {
        if (pCount <= 3) {
          if (shell === '2px') count = 1;
          if (shell === '2py' && pCount >= 2) count = 1;
          if (shell === '2pz' && pCount >= 3) count = 1;
        } else {
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
        {count === 0 && <span className="text-slate-700 font-extrabold text-[8px] select-none uppercase tracking-wide">{t["Empty"]}</span>}
      </div>
    );
  };

  // Convert n, l, m numbers to chemical subshell label (e.g. 3d_z2)
  const getCustomOrbitalInfo = () => {
    const lLetters = ['s', 'p', 'd', 'f'];
    const letter = lLetters[customL] || 's';
    
    let sub = '';
    if (customL === 0) sub = '';
    else if (customL === 1) {
      if (customM === 0) sub = '_z';
      else if (customM === 1) sub = '_x';
      else if (customM === -1) sub = '_y';
    } else if (customL === 2) {
      if (customM === 0) sub = '_z²';
      else if (customM === 1) sub = '_xz';
      else if (customM === -1) sub = '_yz';
      else if (customM === 2) sub = '_x²-y²';
      else if (customM === -2) sub = '_xy';
    } else if (customL === 3) {
      if (customM === 0) sub = '_z³';
      else if (customM === 1) sub = '_xz²';
      else if (customM === -1) sub = '_yz²';
      else if (customM === 2) sub = '_z(x²-y²)';
      else if (customM === -2) sub = '_xyz';
      else if (customM === 3) sub = '_x(x²-3y²)';
      else if (customM === -3) sub = '_y(3x²-y²)';
    }

    const name = `${customN}${letter}${sub}`;
    
    // Simple descriptions for custom states
    let desc = (t["Hydrogenic orbital wave function for state |n, l, m⟩."] || "Hydrogenic orbital wave function for state |{n}, {l}, {m}⟩.")
      .replace('{n}', String(customN))
      .replace('{l}', String(customL))
      .replace('{m}', String(customM));

    if (customL === 0) {
      desc = (t["Spherical symmetric orbital (l=0) with radial nodes. Probability density is highest at the nucleus."] || "Spherical symmetric orbital (l=0) with {nodes} radial nodes. Probability density is highest at the nucleus.")
        .replace('{nodes}', String(customN - 1));
    } else if (customL === 1) {
      desc = (t["Dumbbell-shaped orbital with 1 angular nodal plane and radial node shells."] || "Dumbbell-shaped orbital with 1 angular nodal plane and {nodes} radial node shells.")
        .replace('{nodes}', String(customN - 2));
    } else if (customL === 2) {
      desc = (t["Four-lobed clover or dumbbell-ring structure (l=2) with 2 angular nodal planes and radial node shells."] || "Four-lobed clover or dumbbell-ring structure (l=2) with 2 angular nodal planes and {nodes} radial node shells.")
        .replace('{nodes}', String(customN - 3));
    } else if (customL === 3) {
      desc = (t["Complex higher-order angular distribution (l=3) with 3 angular nodal planes. Typical of f-block heavy elements."] || "Complex higher-order angular distribution (l=3) with 3 angular nodal planes. Typical of f-block heavy elements.");
    }

    return { name, desc, geometry: `l = ${customL}, m = ${customM}` };
  };

  const customInfo = getCustomOrbitalInfo();

  return (
    <div className="my-8 rounded-3xl overflow-hidden border border-slate-800/85 bg-slate-950/40 backdrop-blur-xl shadow-2xl p-6 sm:p-8">
      {/* Upper header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-5">
        <div>
          <h4 className="text-sm font-black text-slate-100 uppercase tracking-widest flex items-center gap-2">
            <CircleDot className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{t["Quantum Orbital & Hybridization Explorer"] || "Quantum Orbital Explorer"}</span>
          </h4>
          <p className="text-[11px] text-slate-400 font-semibold mt-1">
            {mode === 'schrodinger'
              ? (t["Schrödinger Laboratory: Solve wavefunctions by configuring quantum variables n, l, and m."] || "Schrödinger Laboratory: Solve wavefunctions by configuring quantum variables n, l, and m.")
              : (t["Drag to rotate 3D wave probability density. Step through energy levels on the sidebar."] || "Drag to rotate 3D wave probability density. Step through energy levels on the sidebar.")}
          </p>
        </div>

        {/* Orbitals selector pills */}
        <div className="flex flex-wrap gap-1.5 max-w-full md:max-w-[60%]">
          {ORBITALS.map((o) => (
            <button
              key={o.id}
              onClick={() => {
                setActivePreset(o);
                setMode('preset');
              }}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer border ${
                mode === 'preset' && activePreset.id === o.id
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
        <div className="lg:col-span-7 relative h-[320px] lg:h-[360px] rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden select-none">
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
              title={t["Toggle Auto Rotation"]}
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
              title={t["Toggle Wave Sign Phases (+ / -)"]}
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


        {/* Quantum Sidebar: Interactive Tabbed Panel (5 cols) */}
        <OrbitalSidebar
          sidebarTab={sidebarTab}
          setSidebarTab={setSidebarTab}
          activePresetId={activePresetId}
          selectPreset={selectPreset}
          isHybridPreset={isHybridPreset}
          t={t}
          customN={customN}
          setCustomN={setCustomN}
          customL={customL}
          setCustomL={setCustomL}
          customM={customM}
          setCustomM={setCustomM}
          customOrbitalInfo={customOrbitalInfo}
          energyLevelEv={energyLevelEv}
          atomicNumber={atomicNumber}
          setAtomicNumber={setAtomicNumber}
          renderElectronBox={renderElectronBox}
        />
      </div>
    </div>
  );
};
