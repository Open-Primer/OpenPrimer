"use client";

import React, { useState, useEffect, useRef } from 'react';
import { RotateCw, ZoomIn, ZoomOut, Zap, Eye, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { STATIC_UI_STRINGS } from '@/lib/translations';
import {
  Atom,
  Bond,
  Preset,
  StructureViewer3DProps,
  PRESETS,
  ELEMENT_DETAILS,
  STRUCTURE_VIEWER_STRINGS,
  generateNaCl,
  generateGraphene
} from './structure-viewer/presets';
import {
  decodeBase64,
  centerCoordinates,
  parseSDF,
  parseXYZ,
  darkenColor
} from './structure-viewer/parsers';

export type { Atom, Bond, Preset, StructureViewer3DProps };
export {
  PRESETS,
  ELEMENT_DETAILS,
  STRUCTURE_VIEWER_STRINGS,
  generateNaCl,
  generateGraphene,
  decodeBase64,
  centerCoordinates,
  parseSDF,
  parseXYZ,
  darkenColor
};

export const StructureViewer3D = ({
  presetId,
  id,
  name,
  description,
  atoms,
  bonds,
  atomsBase64,
  bondsBase64,
  xyz,
  xyzBase64,
  showMenu,
  gradeLevel = "high_school"
}: StructureViewer3DProps) => {

  const { language } = useLanguage();
  const langUpper = (language || 'EN').toUpperCase();
  const t = (STATIC_UI_STRINGS[langUpper as keyof typeof STATIC_UI_STRINGS] || STATIC_UI_STRINGS.EN) as any;
  const localStr = STRUCTURE_VIEWER_STRINGS[langUpper] || STRUCTURE_VIEWER_STRINGS.EN;

  const resolvedPresetId = presetId || id || "h2o";

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [activePreset, setActivePreset] = useState<Preset>(() => {
    const found = PRESETS.find(p => p.id === resolvedPresetId) || PRESETS[0];
    
    let xyzContent = xyz;
    if (xyzBase64) {
      try {
        if (typeof window !== 'undefined') {
          xyzContent = decodeURIComponent(window.atob(xyzBase64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
        } else {
          xyzContent = Buffer.from(xyzBase64, 'base64').toString('utf-8');
        }
      } catch (e) {
        console.error("Failed to decode xyzBase64:", e);
      }
    }

    if (xyzContent) {
      const parsed = parseXYZ(xyzContent);
      if (parsed) {
        return {
          name: name || "Custom XYZ Molecule",
          id: "custom",
          description: description || "Interactive XYZ molecular coordinate rendering.",
          atoms: parsed.atoms,
          bonds: parsed.bonds
        };
      }
    }

    let resolvedAtoms = atoms;
    if (atomsBase64) {
      resolvedAtoms = decodeBase64(atomsBase64);
    }
    
    let resolvedBonds = bonds;
    if (bondsBase64) {
      resolvedBonds = decodeBase64(bondsBase64);
    }

    return {
      name: name || (resolvedAtoms ? "Custom Molecule" : found.name),
      id: resolvedAtoms ? "custom" : found.id,
      description: description || (resolvedAtoms ? "Interactive visualization of a custom molecular assembly." : found.description),
      atoms: resolvedAtoms || found.atoms,
      bonds: resolvedBonds || found.bonds
    };
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [zoom, setZoom] = useState(100);
  const [autoRotate, setAutoRotate] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  
  const [selectedAtomIndex, setSelectedAtomIndex] = useState<number | null>(null);

  const [angleX, setAngleX] = useState(-0.4); // Pitch
  const [angleY, setAngleY] = useState(0.5);  // Yaw

  const isDragging = useRef(false);
  const lastMouseX = useRef(0);
  const lastMouseY = useRef(0);
  const dragStartX = useRef(0);
  const dragStartY = useRef(0);

  const projectedAtomsRef = useRef<Array<{ sx: number; sy: number; sz: number; drawRadius: number; atom: Atom; index: number }>>([]);

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().toLowerCase();
    if (!query) return;

    setIsLoading(true);
    setErrorMsg(null);
    setSelectedAtomIndex(null);

    try {
      const res = await fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(query)}/record/SDF/?record_type=3d`);
      if (!res.ok) {
        throw new Error(localStr.notFound(query));
      }
      const sdfText = await res.text();
      const parsed = parseSDF(sdfText);
      if (parsed && parsed.atoms.length > 0) {
        const centeredAtoms = centerCoordinates(parsed.atoms);
        setActivePreset({
          name: query.charAt(0).toUpperCase() + query.slice(1),
          id: query,
          description: localStr.loadedDesc(query),
          atoms: centeredAtoms,
          bonds: parsed.bonds
        });
      } else {
        throw new Error(localStr.parseError);
      }
    } catch (err: any) {
      console.error("[PubChem search failure]:", err);
      setErrorMsg(err.message || localStr.loadError);
    } finally {
      setIsLoading(false);
    }
  };

  // React to preset updates from MDX props, and dynamically fetch from PubChem if not a built-in preset
  useEffect(() => {
    let resolvedAtoms = atoms;
    if (atomsBase64) resolvedAtoms = decodeBase64(atomsBase64);

    let resolvedBonds = bonds;
    if (bondsBase64) resolvedBonds = decodeBase64(bondsBase64);

    if (resolvedAtoms) {
      setActivePreset({
        name: name || "Custom Molecule",
        id: "custom",
        description: description || "Interactive visualization of a custom molecular assembly.",
        atoms: resolvedAtoms,
        bonds: resolvedBonds || []
      });
      setSelectedAtomIndex(null);
    } else {
      const builtInIds = ["h2o", "co2", "ch4", "ch3cl", "ethanol", "nacl", "graphene"];
      if (!builtInIds.includes(resolvedPresetId) && resolvedPresetId !== 'custom') {
        setIsLoading(true);
        setErrorMsg(null);
        
        fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(resolvedPresetId)}/record/SDF/?record_type=3d`)
          .then(res => {
            if (!res.ok) throw new Error(localStr.notFound(resolvedPresetId));
            return res.text();
          })
          .then(sdfText => {
            const parsed = parseSDF(sdfText);
            if (parsed && parsed.atoms.length > 0) {
              const centeredAtoms = centerCoordinates(parsed.atoms);
              setActivePreset({
                name: name || resolvedPresetId.charAt(0).toUpperCase() + resolvedPresetId.slice(1),
                id: resolvedPresetId,
                description: description || localStr.loadedDesc(resolvedPresetId),
                atoms: centeredAtoms,
                bonds: parsed.bonds
              });
              setSelectedAtomIndex(null);
            } else {
              throw new Error(localStr.parseError);
            }
          })
          .catch(err => {
            console.error("[PubChem fetch failure]:", err);
            setErrorMsg(err.message || localStr.loadError);
          })
          .finally(() => {
            setIsLoading(false);
          });
      } else {
        const found = PRESETS.find(p => p.id === resolvedPresetId);
        if (found) {
          setActivePreset(found);
          setSelectedAtomIndex(null);
        }
      }
    }
  }, [resolvedPresetId, name, description, atoms, bonds, atomsBase64, bondsBase64]);

  // Canvas Drawing & Rendering Logic
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

      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);

      const project = (atom: Atom, index: number) => {
        const x1 = atom.x * cosY - atom.z * sinY;
        const z1 = atom.z * cosY + atom.x * sinY;

        const y2 = atom.y * cosX - z1 * sinX;
        const z2 = z1 * cosX + atom.y * sinX;

        const scaleFactor = zoom / (3.5 + z2 * 0.4);
        const sx = canvasWidth / 2 + x1 * scaleFactor;
        const sy = canvasHeight / 2 + y2 * scaleFactor;

        return { sx, sy, sz: z2, atom, index };
      };

      const projectedAtoms = activePreset.atoms.map((atom, idx) => project(atom, idx));

      projectedAtomsRef.current = projectedAtoms.map((p) => {
        const depthMultiplier = 3.5 / (3.5 + p.sz * 0.4);
        const drawRadius = Math.max(p.atom.radius * (zoom / 100) * depthMultiplier, 3);
        return {
          sx: p.sx,
          sy: p.sy,
          sz: p.sz,
          drawRadius,
          atom: p.atom,
          index: p.index
        };
      });

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

      const atomRenderObjects = projectedAtoms.map((pAtom) => ({
        type: 'atom' as const,
        ...pAtom
      }));

      const renderQueue = [...projectedBonds, ...atomRenderObjects];
      renderQueue.sort((a, b) => b.sz - a.sz);

      renderQueue.forEach((item) => {
        if (item.type === 'bond') {
          const { pA, pB, bond } = item;
          ctx.beginPath();

          if (bond.isDouble) {
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
            ctx.lineWidth = 3.5;
            ctx.strokeStyle = 'rgba(100, 116, 139, 0.65)';
            ctx.moveTo(pA.sx, pA.sy);
            ctx.lineTo(pB.sx, pB.sy);
            ctx.stroke();
          }
        } else if (item.type === 'atom') {
          const { sx, sy, sz, atom, index } = item;
          const depthMultiplier = 3.5 / (3.5 + sz * 0.4);
          const drawRadius = Math.max(atom.radius * (zoom / 100) * depthMultiplier, 3);

          const grad = ctx.createRadialGradient(
            sx - drawRadius * 0.28,
            sy - drawRadius * 0.28,
            drawRadius * 0.05,
            sx,
            sy,
            drawRadius
          );
          
          grad.addColorStop(0, '#ffffff');
          grad.addColorStop(0.2, atom.color);
          grad.addColorStop(0.85, darkenColor(atom.color, 40));
          grad.addColorStop(1, darkenColor(atom.color, 80));

          ctx.beginPath();
          ctx.fillStyle = grad;
          ctx.arc(sx, sy, drawRadius, 0, Math.PI * 2);
          ctx.fill();

          if (selectedAtomIndex === index) {
            ctx.strokeStyle = '#f59e0b';
            ctx.lineWidth = 2.5;
            ctx.stroke();
          } else {
            ctx.strokeStyle = 'rgba(15, 23, 42, 0.45)';
            ctx.lineWidth = 1;
            ctx.stroke();
          }

          if (showLabels) {
            ctx.fillStyle = '#ffffff';
            ctx.font = `bold ${Math.max(9, drawRadius * 0.6)}px system-ui, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
            ctx.shadowBlur = 4;
            ctx.fillText(atom.label, sx, sy);
            ctx.shadowBlur = 0;
          }
        }
      });

      if (autoRotate && !isDragging.current) {
        setAngleY((prev) => (prev + 0.006) % (Math.PI * 2));
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [activePreset, zoom, autoRotate, showLabels, angleX, angleY, selectedAtomIndex]);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    lastMouseX.current = e.clientX;
    lastMouseY.current = e.clientY;
    dragStartX.current = e.clientX;
    dragStartY.current = e.clientY;
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

  const handleMouseUpOrLeave = (e?: React.MouseEvent) => {
    isDragging.current = false;
    if (!e || dragStartX.current === 0) return;

    const dx = e.clientX - dragStartX.current;
    const dy = e.clientY - dragStartY.current;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 5) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      let foundIndex = -1;
      let closestZ = Infinity;

      projectedAtomsRef.current.forEach((p) => {
        const adx = clickX - p.sx;
        const ady = clickY - p.sy;
        const dist = Math.sqrt(adx * adx + ady * ady);
        if (dist <= p.drawRadius) {
          if (p.sz < closestZ) {
            closestZ = p.sz;
            foundIndex = p.index;
          }
        }
      });

      setSelectedAtomIndex((prev) => (prev === foundIndex ? null : foundIndex));
    }
    dragStartX.current = 0;
    dragStartY.current = 0;
  };

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

  const isCustomOrSpecific = resolvedPresetId !== "h2o" || atomsBase64 !== undefined || atoms !== undefined;
  const shouldShowPresetsMenu = showMenu !== undefined ? showMenu : !isCustomOrSpecific;

  const selectedAtom = selectedAtomIndex !== null ? activePreset.atoms[selectedAtomIndex] : null;
  const cleanedLabel = selectedAtom ? selectedAtom.label.replace(/[⁺⁻\d]/g, '') : '';
  const selectedElement = selectedAtom ? ELEMENT_DETAILS[cleanedLabel] : null;

  return (
    <div className="my-8 rounded-3xl overflow-hidden border border-slate-800/80 bg-slate-950/40 backdrop-blur-xl shadow-2xl p-6 sm:p-8">
      {/* Molecule Details Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5 mb-5">
        <div>
          <h4 className="text-sm font-black text-slate-100 uppercase tracking-widest flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{t["Interactive 3D Structure Viewer"]}</span>
          </h4>
          <p className="text-[11px] text-slate-400 font-semibold mt-1">
            {t["Drag to rotate molecule. Scroll/slider to zoom. Click an atom to inspect properties."]}
          </p>
        </div>

        {/* Preset pill list & Search Bar container */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {shouldShowPresetsMenu && (
            <div className="flex flex-wrap gap-1.5">
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setActivePreset(p);
                    setSelectedAtomIndex(null);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer border ${
                    activePreset.id === p.id
                      ? "bg-amber-500/10 border-amber-500/30 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.15)]"
                      : "bg-slate-900/60 border-slate-800/80 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {(t[p.name] || p.name).split(' ')[0]}
                </button>
              ))}
            </div>
          )}

          {/* Real-time search/load from PubChem */}
          <form onSubmit={handleSearch} className="flex items-center gap-1.5 bg-slate-900/40 border border-slate-800/80 rounded-xl p-1 shrink-0">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={localStr.searchPlaceholder}
              className="bg-transparent text-[10px] text-slate-200 placeholder-slate-500 font-bold px-2.5 py-1 focus:outline-none w-[170px] sm:w-[190px]"
            />
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_10px_rgba(245,158,11,0.2)] hover:scale-[1.02]"
            >
              {localStr.loadBtn}
            </button>
          </form>
        </div>
      </div>

      {/* Main interactive viewport container */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
        
        {/* Canvas Render Panel (3 cols) */}
        <div className="lg:col-span-3 relative h-[340px] rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden group select-none">
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={(e) => handleMouseUpOrLeave(e)}
            onMouseLeave={() => handleMouseUpOrLeave()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={() => handleMouseUpOrLeave()}
            className="w-full h-full cursor-grab active:cursor-grabbing block"
          />

          {isLoading && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-10">
              <RotateCw className="w-8 h-8 text-amber-500 animate-spin" />
              <p className="text-xs font-black text-slate-300 uppercase tracking-widest animate-pulse">{t["Loading molecule..."]}</p>
            </div>
          )}

          {errorMsg && (
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center gap-4 z-10">
              <AlertCircle className="w-10 h-10 text-rose-500" />
              <div className="space-y-1 max-w-sm">
                <h5 className="text-xs font-black text-rose-400 uppercase tracking-wider">{t["Loading error"]}</h5>
                <p className="text-[11px] font-semibold text-slate-400 leading-relaxed">{errorMsg}</p>
              </div>
              <button
                onClick={() => {
                  setErrorMsg(null);
                  setIsLoading(false);
                  setActivePreset(PRESETS[0]);
                  setSelectedAtomIndex(null);
                }}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs font-black text-slate-300 uppercase rounded-xl transition-all cursor-pointer"
              >
                {t["Return to Water (H₂O)"]}
              </button>
            </div>
          )}

          {/* Quick HUD controls overlay */}
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
    </div>
  );
};
