"use client";

import React, { useState, useEffect } from 'react';
import { 
  Wrench, Sparkles, Terminal, FileText, Play, CheckCircle2, AlertTriangle, 
  RefreshCw, Layers, ChevronRight, Search, Check, Cpu, Ban, Loader2, Code
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Statically import the 14 rich pedagogical widgets for safe live-rendering
import { StructureViewer3D } from '../../../../components/mdx/StructureViewer3D';
import { QuantumOrbitalExplorer } from '../../../../components/mdx/QuantumOrbitalExplorer';
import { DynamicSimulation } from '../../../../components/mdx/DynamicSimulation';
import { ChemicalStoichiometry } from '../../../../components/mdx/ChemicalStoichiometry';
import { BasicMathExplorer } from '../../../../components/mdx/BasicMathExplorer';
import { FunctionPlotter } from '../../../../components/mdx/FunctionPlotter';
import { ComparisonSlider } from '../../../../components/mdx/ComparisonSlider';
import { CodeSandbox } from '../../../../components/mdx/CodeSandbox';
import { DataChart } from '../../../../components/mdx/DataChart';
import { InteractiveDiagram } from '../../../../components/mdx/InteractiveDiagram';
import { FunctionManipulator } from '../../../../components/mdx/FunctionManipulator';
import { EquationManipulator } from '../../../../components/mdx/EquationManipulator';
import { Geometry2D } from '../../../../components/mdx/Geometry2D';
import { GestaltInteractive } from '../../../../components/mdx/GestaltInteractive';


interface Widget {
  id: string;
  fileName: string;
  sizeBytes: number;
  linesCount: number;
  hasBackup: boolean;
  code: string;
  nameFR: string;
  nameEN: string;
  descFR: string;
  descEN: string;
  levelFR: string;
  levelEN: string;
  disciplines: string[];
}

interface WidgetsTabProps {
  lang: 'EN' | 'FR' | 'ES' | 'DE' | 'ZH' | 'PT' | 'AR' | 'HI' | 'UR';
  t: any;
  tr: (key: string) => string;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
}

// Preset controls mapping to display custom configurations inside the Live Sandbox Preview
const SANDBOX_PRESETS: Record<string, { label: string; props: Record<string, any> }[]> = {
  StructureViewer3D: [
    { label: "Water Molecule (H₂O)", props: { presetId: "water" } },
    { label: "Salt Crystal Lattice (NaCl)", props: { presetId: "nacl" } },
    { label: "Graphene Layer", props: { presetId: "graphene" } }
  ],
  QuantumOrbitalExplorer: [
    { label: "1s Spherical", props: { initialPresetId: "1s" } },
    { label: "2s Spherical w/ Node", props: { initialPresetId: "2s" } },
    { label: "2p_z Bilobed", props: { initialPresetId: "2pz" } },
    { label: "3d_xy Quadrupolar", props: { initialPresetId: "3d" } }
  ]
};

const SUGGESTED_PROMPTS: Record<string, string[]> = {
  StructureViewer3D: [
    "Add a premium preset for Ethanol (C2H5OH) molecule",
    "Integrate a toggle to show/hide atomic labels in the viewport",
    "Apply a slow auto-rotation animation by default when rendering"
  ],
  QuantumOrbitalExplorer: [
    "Add an hybrid sp3 tetrahedral orbital preset",
    "Integrate a toggle to animate the orbital lobes with a breeding effect",
    "Add a scale slider to adjust probe size visually"
  ],
  DynamicSimulation: [
    "Add an input field to let students configure gravity explicitly",
    "Draw the trajectory curve trail with a glowing neon line",
    "Add a preset option for an elastic collision test case"
  ],
  General: [
    "Inject responsive screen adjustments to the container",
    "Add a help tool-tip describing the fundamental equations",
    "Make the sliders look modern and premium using Tailwind CSS grid spacing"
  ]
};

export const WidgetsTab: React.FC<WidgetsTabProps> = ({
  lang,
  t,
  tr,
  showToast
}) => {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWidget, setSelectedWidget] = useState<Widget | null>(null);
  const [workshopTab, setWorkshopTab] = useState<'preview' | 'code' | 'props'>('preview');
  
  // Custom interactive preset selected for previewing
  const [activePresetIndex, setActivePresetIndex] = useState(0);

  // AI Generation workshop States
  const [prompt, setPrompt] = useState('');
  const [isExecuting, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  const isFR = lang === 'FR';

  const loadWidgets = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/widgets');
      const data = await res.json();
      if (data.success) {
        setWidgets(data.widgets);
        if (data.widgets.length > 0) {
          // Keep current selection or default to first
          const currentId = selectedWidget?.id;
          const found = data.widgets.find((w: any) => w.id === currentId);
          setSelectedWidget(found || data.widgets[0]);
        }
      } else {
        showToast(tr("Failed to load pedagogical widgets: ") + data.error, 'error');
      }
    } catch (e: any) {
      console.error(e);
      showToast(tr("Error fetching widgets list."), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWidgets();
  }, []);

  useEffect(() => {
    // Reset preset index when switching widget
    setActivePresetIndex(0);
    setErrorDetails(null);
    setPrompt('');
  }, [selectedWidget]);

  // Execute safe compiler refinement
  const handleEnhanceWidget = async () => {
    if (!selectedWidget || !prompt.trim() || isExecuting) return;

    setIsGenerating(true);
    setErrorDetails(null);
    setCurrentStep(1); // 🚀 Contacting Gemini...

    try {
      // Step timeline simulations
      const stepTimer1 = setTimeout(() => setCurrentStep(2), 3500); // 💾 Copying backup...
      const stepTimer2 = setTimeout(() => setCurrentStep(3), 5000); // 📝 Appending edits...
      const stepTimer3 = setTimeout(() => setCurrentStep(4), 7000); // 🔍 Running tsc check...

      const response = await fetch('/api/admin/widgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          widgetId: selectedWidget.id,
          prompt: prompt
        })
      });

      // Clear layout timers
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);

      const data = await response.json();

      if (response.ok && data.success) {
        setCurrentStep(5); // 🎉 Done
        showToast(
          isFR 
            ? `Widget "${selectedWidget.id}" mis à jour et validé avec succès !`
            : `Widget "${selectedWidget.id}" successfully updated and compile-verified!`,
          'success'
        );
        setPrompt('');
        
        // Refresh catalog to load new changes
        await loadWidgets();
      } else {
        setCurrentStep(0);
        setErrorDetails(data.details || data.error || "Unknown compilation error");
        showToast(
          isFR
            ? `Échec de validation. Les modifications ont été annulées.`
            : `Compilation validation failed. Changes rolled back.`,
          'error'
        );
      }
    } catch (e: any) {
      console.error(e);
      setCurrentStep(0);
      setErrorDetails(e.message || "Network exception during compilation test");
      showToast(tr("An unexpected error occurred during execution."), 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  // Filtered list
  const filteredWidgets = widgets.filter(w => {
    const term = searchQuery.toLowerCase();
    const idMatches = w.id.toLowerCase().includes(term);
    const nameMatches = (isFR ? w.nameFR : w.nameEN).toLowerCase().includes(term);
    const descMatches = (isFR ? w.descFR : w.descEN).toLowerCase().includes(term);
    const disciplineMatches = w.disciplines.some(d => d.toLowerCase().includes(term));
    return idMatches || nameMatches || descMatches || disciplineMatches;
  });

  // Dynamic component mounting renderer
  const renderLiveWidget = () => {
    if (!selectedWidget) return null;

    const componentMap: Record<string, React.ComponentType<any>> = {
      StructureViewer3D,
      QuantumOrbitalExplorer,
      DynamicSimulation,
      ChemicalStoichiometry,
      BasicMathExplorer,
      FunctionPlotter,
      ComparisonSlider,
      CodeSandbox,
      DataChart,
      InteractiveDiagram,
      FunctionManipulator,
      EquationManipulator,
      Geometry2D,
      GestaltInteractive,
    };

    const WidgetComponent = componentMap[selectedWidget.id];

    if (!WidgetComponent) {
      return (
        <div className="flex flex-col items-center justify-center p-12 text-center h-80 bg-slate-950/40 rounded-[30px] border border-slate-850 space-y-4">
          <div className="w-16 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400">
            <Cpu className="w-8 h-8" />
          </div>
          <div className="space-y-1 max-w-sm">
            <h4 className="text-sm font-black text-slate-200">
              {isFR ? "Nouveau Widget Prêt" : "New Widget Hot-Registered"}
            </h4>
            <p className="text-[10px] text-slate-550 leading-relaxed">
              {isFR 
                ? `Le composant "${selectedWidget.id}" est enregistré dans MdxContent.tsx. Il sera compilé pour la prévisualisation au prochain redémarrage du serveur dev.`
                : `The component "${selectedWidget.id}" has been registered in MdxContent.tsx and is ready for course lessons. It will be loaded inside this sandbox on your next development rebuild.`}
            </p>
          </div>
        </div>
      );
    }

    // Retrieve active preset props if any
    const presets = SANDBOX_PRESETS[selectedWidget.id] || [];
    const activeProps = presets[activePresetIndex]?.props || {};

    try {
      return (
        <div className="bg-slate-950/20 rounded-[30px] border border-slate-850 p-6 min-h-[350px] flex flex-col justify-between shadow-inner">
          {presets.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4 pb-4 border-b border-slate-900">
              <span className="text-[8px] font-black uppercase text-slate-500 flex items-center gap-1.5 self-center mr-2">
                <Layers className="w-3 h-3" /> PRESET:
              </span>
              {presets.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePresetIndex(idx)}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-black transition-all ${activePresetIndex === idx ? 'bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/10' : 'bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-white'}`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}
          <div className="w-full h-full flex-grow relative overflow-hidden">
            {/* Direct mount inside safe boundaries */}
            <WidgetComponent {...activeProps} />
          </div>
        </div>
      );
    } catch (e: any) {
      return (
        <div className="flex flex-col items-center justify-center p-12 text-center h-80 bg-red-950/10 rounded-[30px] border border-red-900/20 space-y-4">
          <div className="w-14 h-14 bg-red-500/10 rounded-full flex items-center justify-center text-red-400">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div className="space-y-2 max-w-sm">
            <h4 className="text-sm font-black text-red-400 uppercase tracking-wider">
              {isFR ? "Erreur de Rendu Sandbox" : "Sandbox Render Exception"}
            </h4>
            <p className="text-[10px] text-slate-400 font-mono bg-slate-950/60 p-4 rounded-xl text-left border border-slate-850/50">
              {e.message}
            </p>
          </div>
        </div>
      );
    }
  };

  const getDisciplineColor = (disc: string) => {
    const map: Record<string, string> = {
      Chemistry: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
      Physics: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
      Mathematics: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
      Biology: 'bg-emerald-600/10 border-emerald-600/20 text-emerald-300',
      'Computer Science': 'bg-fuchsia-500/10 border-fuchsia-500/20 text-fuchsia-400',
      Economics: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
      'Social Sciences': 'bg-pink-500/10 border-pink-500/20 text-pink-400',
      General: 'bg-slate-500/10 border-slate-500/20 text-slate-400'
    };
    return map[disc] || 'bg-slate-500/10 border-slate-500/20 text-slate-400';
  };

  // Select recommended presets helper
  const handleApplyPresetPrompt = (txt: string) => {
    setPrompt(txt);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* SECTION BANNER HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-slate-100 uppercase tracking-tight flex items-center gap-3">
            <Wrench className="w-7 h-7 text-teal-500" />
            {isFR ? "Atelier des Widgets Pédagogiques" : "Pedagogical Widgets Workshop"}
          </h2>
          <p className="text-xs text-slate-450 leading-relaxed font-medium">
            {isFR 
              ? "Surveiller, inspecter, prévisualiser et affiner les composants interactifs autonomes du curriculum."
              : "Monitor, inspect, preview, and safely compile prompt-driven enhancements to interactive workspace blocks."}
          </p>
        </div>
        
        {/* REFRESH INVENTORY */}
        <button
          onClick={loadWidgets}
          disabled={loading || isExecuting}
          className="px-5 py-3 border border-slate-850 hover:border-teal-500/25 bg-slate-900/40 text-slate-400 hover:text-teal-400 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          {isFR ? "Actualiser" : "Refresh Inventory"}
        </button>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: SCANNED WIDGETS PANEL */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900/40 border border-slate-850 rounded-[35px] p-6 space-y-6 shadow-xl backdrop-blur-xl">
            
            {/* SEARCH INPUT */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isFR ? "Rechercher un composant, une matière..." : "Filter components, subjects..."}
                className="w-full bg-slate-950/80 border border-slate-850/60 hover:border-slate-800 rounded-2xl py-3 pl-11 pr-4 text-xs focus:outline-none focus:border-teal-555 text-white placeholder-slate-600 transition-colors"
              />
            </div>

            {/* CATALOG LIST */}
            <div className="space-y-4 max-h-[580px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-800">
              {loading ? (
                <div className="flex flex-col items-center justify-center p-12 text-center space-y-3">
                  <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                    {isFR ? "Scan du dossier mdx..." : "Scanning MDX directory..."}
                  </p>
                </div>
              ) : filteredWidgets.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center space-y-2">
                  <Ban className="w-8 h-8 text-slate-650" />
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
                    {isFR ? "Aucun widget trouvé" : "No matching widgets"}
                  </p>
                </div>
              ) : (
                filteredWidgets.map(widget => {
                  const isSelected = selectedWidget?.id === widget.id;
                  return (
                    <div
                      key={widget.id}
                      onClick={() => setSelectedWidget(widget)}
                      className={`p-5 rounded-[24px] border transition-all cursor-pointer flex flex-col justify-between gap-4 group ${isSelected ? 'bg-teal-500/10 border-teal-500/30' : 'bg-slate-950/40 border-slate-900/60 hover:border-slate-800 hover:bg-slate-900/20'}`}
                    >
                      <div className="space-y-2.5">
                        <div className="flex justify-between items-start gap-4">
                          <h4 className={`text-sm font-black transition-all ${isSelected ? 'text-teal-400' : 'text-slate-200 group-hover:text-white'}`}>
                            {widget.id}
                          </h4>
                          <span className="px-2.5 py-1 bg-slate-950/80 border border-slate-850/80 rounded-lg text-[8px] font-mono font-bold text-slate-450 tracking-wider shrink-0">
                            {widget.linesCount} LOC
                          </span>
                        </div>
                        
                        <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                          {isFR ? widget.descFR : widget.descEN}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-900/60">
                        {/* DISCIPLINES */}
                        <div className="flex flex-wrap gap-1.5">
                          {widget.disciplines.map(disc => (
                            <span
                              key={disc}
                              className={`px-2 py-0.5 border text-[7px] font-black uppercase tracking-widest rounded-full ${getDisciplineColor(disc)}`}
                            >
                              {disc}
                            </span>
                          ))}
                        </div>

                        {/* COMPATIBLE ACADEMIC LEVEL */}
                        <span className="text-[8px] font-bold text-slate-500 uppercase font-mono shrink-0">
                          🎓 {isFR ? widget.levelFR : widget.levelEN}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: WORKSHOP WORKSPACE */}
        <div className="lg:col-span-7 space-y-6">
          {selectedWidget ? (
            <div className="bg-slate-900/40 border border-slate-850 rounded-[35px] p-8 space-y-6 shadow-xl backdrop-blur-xl relative overflow-hidden">
              
              {/* BACKUP CORNER TAG */}
              {selectedWidget.hasBackup && (
                <div className="absolute top-0 right-0 bg-yellow-500/10 border-l border-b border-yellow-500/20 px-4 py-2 rounded-bl-2xl text-[8px] font-mono font-black text-yellow-500 uppercase tracking-widest flex items-center gap-1.5">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75 animate-duration-1000"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-yellow-500"></span>
                  </span>
                  Backup Active
                </div>
              )}

              {/* ACTIVE WIDGET TITLE */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <span className="text-[9px] font-black uppercase bg-teal-500/10 border border-teal-500/20 text-teal-400 px-2.5 py-1 rounded-lg tracking-widest font-mono">
                    {selectedWidget.fileName}
                  </span>
                  <span className="text-[9px] font-bold text-slate-550 font-mono">
                    {(selectedWidget.sizeBytes / 1024).toFixed(1)} KB
                  </span>
                </div>
                <h3 className="text-xl font-black text-white">
                  {isFR ? selectedWidget.nameFR : selectedWidget.nameEN}
                </h3>
              </div>

              {/* TABS HEADER CONTROL */}
              <div className="flex border-b border-slate-900 pb-2 gap-4">
                {[
                  { id: 'preview', label: isFR ? "Aperçu Interactif" : "Interactive Live Sandbox", icon: Play },
                  { id: 'code', label: isFR ? "Code Source TSX" : "TSX Source Code", icon: Code },
                  { id: 'props', label: isFR ? "Documentation & API" : "Props & API Schema", icon: FileText }
                ].map(tab => {
                  const TabIcon = tab.icon;
                  const isTabSelected = workshopTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setWorkshopTab(tab.id as any)}
                      className={`pb-3 text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-2 border-b-2 -mb-[10px] cursor-pointer ${isTabSelected ? 'border-teal-500 text-teal-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                    >
                      <TabIcon className="w-3.5 h-3.5" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* WORKSPACE BODY VIEW */}
              <div className="py-4">
                
                {/* 1. INTERACTIVE LIVE PREVIEW */}
                {workshopTab === 'preview' && (
                  <div className="space-y-6">
                    {renderLiveWidget()}
                  </div>
                )}

                {/* 2. SOURCE CODE VIEWER */}
                {workshopTab === 'code' && (
                  <div className="space-y-4">
                    <p className="text-[10px] text-slate-450 leading-relaxed font-medium">
                      {isFR 
                        ? "Inspection en lecture seule du fichier TSX. Pour le modifier, utilisez la console d'IA ci-dessous."
                        : "Read-only inspection of the active TSX source code file. To edit or adjust logic, use the AI assistant console below."}
                    </p>
                    <div className="bg-slate-950/80 rounded-2xl border border-slate-850 p-6 max-h-[350px] overflow-y-auto font-mono text-[9px] text-slate-400 leading-relaxed scrollbar-thin scrollbar-thumb-slate-800">
                      <pre className="whitespace-pre-wrap">{selectedWidget.code}</pre>
                    </div>
                  </div>
                )}

                {/* 3. PROPS & API SCHEMATIC */}
                {workshopTab === 'props' && (
                  <div className="space-y-4">
                    <p className="text-[10px] text-slate-450 leading-relaxed font-medium">
                      {isFR 
                        ? "Signature technique d'intégration pédagogique détectée dans le code du composant."
                        : "Pedagogical parameters signature and React properties registered for this interactive simulator."}
                    </p>
                    <div className="bg-slate-950/40 rounded-2xl border border-slate-850 p-6 space-y-4 font-mono text-[10px]">
                      <div className="space-y-2">
                        <div className="text-teal-400 font-bold">interface {selectedWidget.id}Props</div>
                        <div className="border-l border-slate-800 pl-4 py-2 space-y-2 text-slate-400">
                          {selectedWidget.id === 'StructureViewer3D' ? (
                            <>
                              <div><span className="text-blue-400">presetId?</span>: <span className="text-orange-400">"water" | "nacl" | "graphene"</span>; <span className="text-slate-550">// Pre-packaged atomic configuration</span></div>
                              <div><span className="text-blue-400">atoms?</span>: <span className="text-fuchsia-400">Atom[]</span>; <span className="text-slate-550">// Direct coordinate inject override</span></div>
                              <div><span className="text-blue-400">showMenu?</span>: <span className="text-orange-400">boolean</span>; <span className="text-slate-550">// Display toolbar controls in lesson viewport</span></div>
                            </>
                          ) : selectedWidget.id === 'QuantumOrbitalExplorer' ? (
                            <>
                              <div><span className="text-blue-400">initialPresetId?</span>: <span className="text-orange-400">"1s" | "2s" | "2pz" | "3d"</span>; <span className="text-slate-550">// Starting wave function lobe</span></div>
                              <div><span className="text-blue-400">gradeLevel?</span>: <span className="text-orange-400">"middle_school" | "high_school" | "university"</span>; <span className="text-slate-550">// Adjust mathematical complexity automatically</span></div>
                            </>
                          ) : (
                            <>
                              <div><span className="text-blue-400">initialVolume?</span>: <span className="text-orange-400">number</span>; <span className="text-slate-550">// Default initialization metric</span></div>
                              <div><span className="text-blue-400">className?</span>: <span className="text-orange-400">string</span>; <span className="text-slate-550">// Optional styling utilities custom append</span></div>
                              <div><span className="text-blue-400">showControls?</span>: <span className="text-orange-400">boolean</span>; <span className="text-slate-550">// Show interactive parameter bars</span></div>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="pt-2 border-t border-slate-900 text-slate-500 text-[9px]">
                        MDX JSX Block: <code className="text-slate-350">{`<${selectedWidget.id} showControls={true} />`}</code>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* AI REFINEMENT ASSISTANT PROMPT AREA */}
              <div className="pt-6 border-t border-slate-900 space-y-5">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-teal-400" />
                    {isFR ? "Assistant d'Amélioration par IA" : "AI Prompt Refinement Console"}
                  </h4>
                  <span className="px-2.5 py-0.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-[7px] font-black text-cyan-400 uppercase tracking-widest">
                    Gemini 2.5 Flash
                  </span>
                </div>

                {/* SUGGESTED PRESET CHIPS */}
                <div className="flex flex-wrap gap-1.5">
                  {(SUGGESTED_PROMPTS[selectedWidget.id] || SUGGESTED_PROMPTS.General).map((p, i) => (
                    <button
                      key={i}
                      onClick={() => handleApplyPresetPrompt(p)}
                      disabled={isExecuting}
                      className="px-3 py-1.5 border border-slate-850 bg-slate-950/30 text-[9px] font-bold text-slate-400 hover:text-white hover:border-slate-700 hover:bg-slate-900/20 rounded-xl transition-all cursor-pointer max-w-xs truncate"
                    >
                      💡 {p}
                    </button>
                  ))}
                </div>

                {/* INPUT FIELD */}
                <div className="relative">
                  <textarea
                    rows={3}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    disabled={isExecuting}
                    placeholder={isFR ? `Décrivez vos modifications pour "${selectedWidget.id}"...` : `Instruct the AI to enhance, modify, or add features to "${selectedWidget.id}"...`}
                    className="w-full bg-slate-950 border border-slate-850 rounded-2xl p-4 text-xs focus:outline-none focus:border-teal-555 text-white placeholder-slate-600 transition-colors resize-none pr-12 scrollbar-thin disabled:opacity-60"
                  />
                  
                  {/* GENERATE RUN BUTTON */}
                  <button
                    onClick={handleEnhanceWidget}
                    disabled={!prompt.trim() || isExecuting}
                    className="absolute bottom-4 right-4 p-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl transition-all active:scale-95 cursor-pointer disabled:opacity-40 disabled:scale-100 shadow-lg shadow-teal-500/10"
                  >
                    {isExecuting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <ChevronRight className="w-4 h-4 font-black" />
                    )}
                  </button>
                </div>

                {/* RUNNING LOADER STEP GRAPH */}
                <AnimatePresence>
                  {isExecuting && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="p-6 bg-slate-950 border border-slate-850 rounded-2xl space-y-4"
                    >
                      <div className="flex items-center gap-3">
                        <Loader2 className="w-5 h-5 text-teal-500 animate-spin shrink-0" />
                        <span className="text-xs font-black text-slate-200 uppercase tracking-wider">
                          {isFR ? "Refonte Sécurisée en Cours..." : "Compiling Sovereign Refinements..."}
                        </span>
                      </div>
                      
                      {/* Timeline flow */}
                      <div className="grid grid-cols-4 gap-4 text-center">
                        {[
                          { step: 1, label: isFR ? "AI Call" : "AI Synthesis", icon: Sparkles },
                          { step: 2, label: isFR ? "Sauvegarde" : "Backup FS", icon: FileText },
                          { step: 3, label: isFR ? "Écriture Code" : "TSX Inject", icon: Code },
                          { step: 4, label: isFR ? "Compilateur TSC" : "TSC Compile", icon: Terminal }
                        ].map((s) => {
                          const isDone = currentStep > s.step;
                          const isActive = currentStep === s.step;
                          return (
                            <div key={s.step} className="space-y-1.5">
                              <div className={`w-8 h-8 rounded-lg mx-auto flex items-center justify-center transition-colors ${isDone ? 'bg-emerald-500/10 text-emerald-400' : isActive ? 'bg-teal-500/20 text-teal-400 border border-teal-500/40 animate-pulse' : 'bg-slate-900 text-slate-600'}`}>
                                {isDone ? <Check className="w-4 h-4" /> : <s.icon className="w-4 h-4" />}
                              </div>
                              <div className={`text-[8px] font-black uppercase tracking-wider ${isActive ? 'text-teal-400' : isDone ? 'text-emerald-400' : 'text-slate-650'}`}>
                                {s.label}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* ERROR OUTPUT LOG DISPLAY */}
                <AnimatePresence>
                  {errorDetails && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      className="p-6 bg-red-950/10 border border-red-500/20 rounded-[24px] space-y-4 shadow-lg shadow-red-950/5 animate-fade-in"
                    >
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                        <div className="space-y-0.5">
                          <h4 className="text-xs font-black text-red-400 uppercase tracking-widest">
                            {isFR ? "Erreur de Compilation détectée" : "TSX Compilation Log Rejected"}
                          </h4>
                          <p className="text-[9px] text-slate-400 font-medium">
                            {isFR 
                              ? "Les modifications ont été annulées et le backup d'origine a été restauré."
                              : "Build-breaking changes were safely discarded and the active component has been restored."}
                          </p>
                        </div>
                      </div>

                      <div className="bg-slate-950/80 border border-red-950/30 rounded-xl p-4 max-h-[220px] overflow-y-auto font-mono text-[9px] text-red-400 leading-relaxed scrollbar-thin scrollbar-thumb-red-950/30">
                        <pre className="whitespace-pre-wrap">{errorDetails}</pre>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>

            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-16 text-center h-96 bg-slate-900/10 border border-slate-850 border-dashed rounded-[35px] space-y-4">
              <div className="w-16 h-16 bg-slate-950/40 rounded-full flex items-center justify-center text-slate-500">
                <Wrench className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">
                  {isFR ? "Aucun widget sélectionné" : "No Widget Selected"}
                </h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                  {isFR 
                    ? "Sélectionnez un composant interactif dans le catalogue pour lancer la sandbox."
                    : "Select an interactive widget component from the catalog list to activate the preview sandbox workshop."}
                </p>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
