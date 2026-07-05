"use client";

import React, { useState, useEffect } from 'react';
import { 
  Wrench, Sparkles, Terminal, FileText, Play, CheckCircle2, AlertTriangle, 
  RefreshCw, Layers, ChevronRight, Search, Check, Cpu, Ban, Loader2, Code,
  Lock, Unlock, ShieldAlert, Maximize2, Minimize2, Edit, Plus, Globe, Tag, X, Info,
  Copy, ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DISCIPLINES, getDisciplineLabel, ACADEMIC_LEVELS } from '../strings';
import { Mermaid } from '../../../../components/mdx/Mermaid';

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
  lock: { adminId: string; expiresAt: number } | null;
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
  ],
  Mermaid: [
    {
      label: "Photosynthesis Flowchart",
      props: {
        chart: `graph TD
    A[Light + H2O] -->|Light Reactions| B[ATP + NADPH + O2]
    C[CO2 + ATP + NADPH] -->|Calvin Cycle| D[G3P / Glucose]
    B --> C
    style A fill:#0f172a,stroke:#0d9488,stroke-width:2px,color:#f8fafc
    style B fill:#0f172a,stroke:#10b981,stroke-width:2px,color:#f8fafc
    style C fill:#0f172a,stroke:#3b82f6,stroke-width:2px,color:#f8fafc
    style D fill:#0f172a,stroke:#f59e0b,stroke-width:2px,color:#f8fafc`
      }
    },
    {
      label: "Nervous System Mindmap",
      props: {
        chart: `graph LR
    CNS[Central Nervous System] --> Brain[Brain]
    CNS --> SC[Spinal Cord]
    PNS[Peripheral Nervous System] --> ANS[Autonomic]
    PNS --> SNS[Somatic]
    ANS --> Sym[Sympathetic]
    ANS --> Para[Parasympathetic]
    style CNS fill:#0f172a,stroke:#0d9488,stroke-width:2px,color:#f8fafc
    style PNS fill:#0f172a,stroke:#3b82f6,stroke-width:2px,color:#f8fafc`
      }
    }
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
  const [sortBy, setSortBy] = useState<'alphabetical' | 'level' | 'discipline'>('alphabetical');
  const [selectedWidget, setSelectedWidget] = useState<Widget | null>(null);
  const [workshopTab, setWorkshopTab] = useState<'preview' | 'code' | 'props'>('preview');
  
  // Custom interactive preset selected for previewing
  const [activePresetIndex, setActivePresetIndex] = useState(0);

  // Sandbox Parameter Randomizer overrides
  const [randomProps, setRandomProps] = useState<Record<string, any> | null>(null);
  const [diceRotation, setDiceRotation] = useState(0);

  const generateRandomProps = (widgetId: string): Record<string, any> => {
    switch (widgetId) {
      case 'StructureViewer3D': {
        const presets = ["water", "nacl", "graphene", "co2", "ch4", "ethanol"];
        const presetId = presets[Math.floor(Math.random() * presets.length)];
        return { presetId };
      }
      case 'QuantumOrbitalExplorer': {
        const orbitals = ["1s", "2s", "2pz", "sp", "sp2", "sp3"];
        const levels = ["middle_school", "high_school", "university"];
        return {
          initialPresetId: orbitals[Math.floor(Math.random() * orbitals.length)],
          gradeLevel: levels[Math.floor(Math.random() * levels.length)]
        };
      }
      case 'DynamicSimulation': {
        const presets = ['mitosis', 'carnot', 'wave', 'double_slit', 'enzyme'];
        return { preset: presets[Math.floor(Math.random() * presets.length)] };
      }
      case 'ChemicalStoichiometry': {
        const equations = ["H2O", "CH4", "NH3", "C6H12O6"];
        return { reaction: equations[Math.floor(Math.random() * equations.length)] };
      }
      case 'BasicMathExplorer': {
        const tabs = ['add-sub', 'mul-div', 'fractions', 'parentheses'];
        const modes = ['add', 'sub', 'mul', 'div'];
        const levels = ["middle_school", "high_school", "university"];
        return {
          initialTab: tabs[Math.floor(Math.random() * tabs.length)],
          initialMode: modes[Math.floor(Math.random() * modes.length)],
          initialNumA: Math.floor(Math.random() * 20) + 1,
          initialNumB: Math.floor(Math.random() * 10) + 1,
          gradeLevel: levels[Math.floor(Math.random() * levels.length)]
        };
      }
      case 'FunctionPlotter': {
        const modes = ['linear', 'compound-interest', 'supply-demand', 'expression'];
        const levels = ["middle_school", "high_school", "university"];
        return {
          mode: modes[Math.floor(Math.random() * modes.length)],
          gradeLevel: levels[Math.floor(Math.random() * levels.length)],
          xMin: 0,
          xMax: Math.floor(Math.random() * 15) + 10
        };
      }
      case 'ComparisonSlider': {
        const layouts = ['clip', 'split'];
        const levels = ["middle_school", "high_school", "university"];
        return {
          beforeLabel: tr("State A (Randomized)"),
          afterLabel: tr("State B (Randomized)"),
          beforeContent: React.createElement('div', { className: "w-full h-full flex flex-col items-center justify-center bg-blue-950/40 text-blue-400 p-8 border border-blue-900/20 rounded-2xl gap-2 min-h-[200px]" }, React.createElement('span', { className: "text-xl" }, "📊"), React.createElement('span', { className: "font-bold text-xs uppercase tracking-wide" }, tr("Spectroscopy Phase A"))),
          afterContent: React.createElement('div', { className: "w-full h-full flex flex-col items-center justify-center bg-emerald-950/40 text-emerald-400 p-8 border border-emerald-900/20 rounded-2xl gap-2 min-h-[200px]" }, React.createElement('span', { className: "text-xl" }, "📈"), React.createElement('span', { className: "font-bold text-xs uppercase tracking-wide" }, tr("Spectroscopy Phase B"))),
          layout: layouts[Math.floor(Math.random() * layouts.length)],
          gradeLevel: levels[Math.floor(Math.random() * levels.length)]
        };
      }
      case 'CodeSandbox': {
        const languages = ['html', 'javascript', 'css'];
        const randLang = languages[Math.floor(Math.random() * languages.length)];
        const templates = {
          html: `<h1>${tr("Randomized Canvas")}</h1>\n<p style="color: coral;">${tr("Generated seed:")} ${Math.random().toFixed(4)}</p>`,
          javascript: `console.log("${tr("Random parameters initialized!")}");\nconst seed = ${Math.random().toFixed(4)};\nalert("${tr("Randomizer Seed:")} " + seed);`,
          css: `body {\n  background: linear-gradient(135deg, #1e1b4b, #111827);\n  color: #10b981;\n  font-family: system-ui;\n}`
        };
        return {
          language: randLang,
          initialCode: templates[randLang as keyof typeof templates],
          title: tr("Randomized Code Experiment")
        };
      }
      case 'DataChart': {
        const types = ['bar', 'pie', 'donut', 'line'];
        const levels = ["middle_school", "high_school", "university"];
        const randVal1 = Math.floor(Math.random() * 50) + 10;
        const randVal2 = Math.floor(Math.random() * 50) + 10;
        const randVal3 = Math.floor(Math.random() * 50) + 10;
        const randData = [
          { label: tr("Alpha"), value: randVal1 },
          { label: tr("Beta"), value: randVal2 },
          { label: tr("Gamma"), value: randVal3 }
        ];
        return {
          title: tr("Randomized Metric Series"),
          type: types[Math.floor(Math.random() * types.length)],
          data: randData,
          gradeLevel: levels[Math.floor(Math.random() * levels.length)]
        };
      }
      case 'InteractiveDiagram': {
        const types = ['cell', 'neuron'];
        const levels = ["middle_school", "high_school", "university"];
        return {
          type: types[Math.floor(Math.random() * types.length)],
          gradeLevel: levels[Math.floor(Math.random() * levels.length)]
        };
      }
      case 'FunctionManipulator': {
        const levels = ["middle_school", "high_school", "university"];
        return { gradeLevel: levels[Math.floor(Math.random() * levels.length)] };
      }
      case 'EquationManipulator': {
        const levels = ["middle_school", "high_school", "university"];
        return { gradeLevel: levels[Math.floor(Math.random() * levels.length)] };
      }
      case 'Geometry2D': {
        const presets = ['triangle', 'circle', 'vector'];
        const levels = ["middle_school", "high_school", "university"];
        return {
          preset: presets[Math.floor(Math.random() * presets.length)],
          gradeLevel: levels[Math.floor(Math.random() * levels.length)]
        };
      }
      case 'GestaltInteractive': {
        const levels = ["middle_school", "high_school", "university"];
        return { gradeLevel: levels[Math.floor(Math.random() * levels.length)] };
      }
      default:
        return {};
    }
  };

  const DISCIPLINES_LIST = React.useMemo(() => {
    const staticEn = DISCIPLINES.map(d => d.EN);
    let customList: string[] = [];
    if (typeof window !== 'undefined') {
      try {
        customList = JSON.parse(localStorage.getItem('op_custom_disciplines') || '[]');
      } catch (e) {}
    }
    const combined = Array.from(new Set([...staticEn, ...customList]));
    return combined;
  }, []);

  const toPascalCase = (str: string): string => {
    const clean = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const matches = clean.match(/[a-zA-Z0-9]+/g);
    const words: string[] = matches ? Array.from(matches) : [];
    
    if (words.length > 1 && words[0]) {
      const firstLower = words[0].toLowerCase();
      if (firstLower === '2d' || firstLower === '3d' || /^\d+$/.test(firstLower)) {
        const shifted = words.shift();
        if (shifted) words.push(shifted);
      }
    }
    
    return words
      .map(word => {
        const lower = word.toLowerCase();
        if (lower === '2d' || lower === '3d') {
          return word.toUpperCase();
        }
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join('');
  };

  const translateText = async (text: string, fromLang: string, toLang: string): Promise<string> => {
    const trimmed = text.trim();
    if (!trimmed) return '';
    try {
      const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${fromLang.toLowerCase()}&tl=${toLang.toLowerCase()}&dt=t&q=${encodeURIComponent(trimmed)}`);
      if (res.ok) {
        const data = await res.json();
        return data[0].map((x: any) => x[0]).join('').trim();
      }
    } catch (e) {
      console.error("Translation failed:", e);
    }
    return trimmed;
  };

  const getWidgetName = (w: Widget) => {
    const translated = tr(w.nameEN);
    if (translated !== w.nameEN) return translated;
    const prop = `name${lang.toUpperCase()}`;
    return (w as any)[prop] || w.nameEN;
  };
  const getWidgetDesc = (w: Widget) => {
    const translated = tr(w.descEN);
    if (translated !== w.descEN) return translated;
    const prop = `desc${lang.toUpperCase()}`;
    return (w as any)[prop] || w.descEN;
  };
  const getWidgetLevel = (w: Widget) => {
    const translated = tr(w.levelEN);
    if (translated !== w.levelEN) return translated;
    const prop = `level${lang.toUpperCase()}`;
    return (w as any)[prop] || w.levelEN;
  };

  // AI Generation workshop States
  const [prompt, setPrompt] = useState('');
  const [isExecuting, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  // Concurrency & Admin State
  const [adminId, setAdminId] = useState<string>('');
  const [isEditingAdminName, setIsEditingAdminName] = useState(false);

  // Modals Visibility
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [widgetToValidate, setWidgetToValidate] = useState<string | null>(null);

  // Parameter Edit States
  const [editNameFR, setEditNameFR] = useState('');
  const [editNameEN, setEditNameEN] = useState('');
  const [editDescFR, setEditDescFR] = useState('');
  const [editDescEN, setEditDescEN] = useState('');
  const [editLevelFR, setEditLevelFR] = useState('');
  const [editLevelEN, setEditLevelEN] = useState('');
  const [editDisciplines, setEditDisciplines] = useState<string[]>([]);
  const [isSavingMetadata, setIsSavingMetadata] = useState(false);

  // Create New Widget States
  const [newWidgetId, setNewWidgetId] = useState('');
  const [newWidgetPrompt, setNewWidgetPrompt] = useState('');
  const [newWidgetNameFR, setNewWidgetNameFR] = useState('');
  const [newWidgetNameEN, setNewWidgetNameEN] = useState('');
  const [newWidgetDescFR, setNewWidgetDescFR] = useState('');
  const [newWidgetDescEN, setNewWidgetDescEN] = useState('');
  const [newWidgetLevelFR, setNewWidgetLevelFR] = useState('');
  const [newWidgetLevelEN, setNewWidgetLevelEN] = useState('');
  const [newWidgetDisciplines, setNewWidgetDisciplines] = useState<string[]>([]);

  // UX Enhancements & Validation States
  const [widgetVersionKey, setWidgetVersionKey] = useState(0);
  const [isEditLevelDropdownOpen, setIsEditLevelDropdownOpen] = useState(false);
  const [isEditSubjectDropdownOpen, setIsEditSubjectDropdownOpen] = useState(false);
  const [isCreateLevelDropdownOpen, setIsCreateLevelDropdownOpen] = useState(false);
  const [isCreateSubjectDropdownOpen, setIsCreateSubjectDropdownOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Toggle Academic Level utility keeping FR and EN perfectly synchronized
  const toggleAcademicLevel = (levelVal: string, state: 'edit' | 'new') => {
    const currentFR = state === 'edit' ? editLevelFR : newWidgetLevelFR;
    const currentEN = state === 'edit' ? editLevelEN : newWidgetLevelEN;

    const selectedFRList = currentFR ? currentFR.split(' / ').map(s => s.trim()).filter(Boolean) : [];
    const selectedENList = currentEN ? currentEN.split(' / ').map(s => s.trim()).filter(Boolean) : [];

    const targetLevel = ACADEMIC_LEVELS.find(lvl => lvl.value === levelVal);
    if (!targetLevel) return;

    let newFRList: string[];
    let newENList: string[];

    const alreadySelectedIdx = selectedENList.findIndex(x => x.toLowerCase() === targetLevel.EN.toLowerCase());

    if (alreadySelectedIdx !== -1) {
      newFRList = selectedFRList.filter((_, idx) => idx !== alreadySelectedIdx);
      newENList = selectedENList.filter((_, idx) => idx !== alreadySelectedIdx);
    } else {
      newFRList = [...selectedFRList, targetLevel.FR];
      newENList = [...selectedENList, targetLevel.EN];
    }

    const finalFR = newFRList.join(' / ');
    const finalEN = newENList.join(' / ');

    if (state === 'edit') {
      setEditLevelFR(finalFR);
      setEditLevelEN(finalEN);
    } else {
      setNewWidgetLevelFR(finalFR);
      setNewWidgetLevelEN(finalEN);
    }
  };

  const namingCollisionError = React.useMemo(() => {
    const inputName = (lang === 'FR' ? newWidgetNameFR : newWidgetNameEN).trim();
    if (!inputName) return null;

    const inputLower = inputName.toLowerCase();
    const computedPascal = toPascalCase(inputName).toLowerCase();

    for (const w of widgets) {
      if (
        w.nameFR.trim().toLowerCase() === inputLower ||
        w.nameEN.trim().toLowerCase() === inputLower
      ) {
        return tr("A widget with this exact name already exists!");
      }

      if (w.id.toLowerCase() === computedPascal) {
        return tr("This name is too similar to an existing widget and would cause an ID collision ({id}).").replace("{id}", w.id);
      }

      const existingNameFRPascal = toPascalCase(w.nameFR).toLowerCase();
      const existingNameENPascal = toPascalCase(w.nameEN).toLowerCase();
      if (existingNameFRPascal === computedPascal || existingNameENPascal === computedPascal) {
        return tr("This name is too similar to '{existing}' and would generate a duplicate ID ({id}).")
          .replace("{existing}", lang === 'FR' ? w.nameFR : w.nameEN)
          .replace("{id}", w.id);
      }
    }
    return null;
  }, [newWidgetNameFR, newWidgetNameEN, lang, widgets]);

  // Retrieve/Initialize Admin Name
  useEffect(() => {
    let savedId = localStorage.getItem('op_widget_admin_id');
    if (!savedId) {
      savedId = `Admin_#${Math.floor(1000 + Math.random() * 9000)}`;
      localStorage.setItem('op_widget_admin_id', savedId);
    }
    setAdminId(savedId);
  }, []);

  const handleSaveAdminName = (name: string) => {
    const trimmed = name.trim();
    if (trimmed.length > 2) {
      setAdminId(trimmed);
      localStorage.setItem('op_widget_admin_id', trimmed);
      showToast(tr("Admin nickname updated to: ") + trimmed, 'success');
    }
    setIsEditingAdminName(false);
  };

  const loadWidgets = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/widgets');
      const data = await res.json();
      if (data.success) {
        setWidgets(data.widgets);
        if (data.widgets.length > 0) {
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

  // Sync locks periodically (polling locks state every 15 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isExecuting && !isSavingMetadata) {
        // Silently refresh widget details to update locks
        fetch('/api/admin/widgets')
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              setWidgets(data.widgets);
            }
          })
          .catch(console.error);
      }
    }, 15000);
    return () => clearInterval(interval);
  }, [isExecuting, isSavingMetadata]);

  // Keep active selectedWidget synchronized with latest lock data from widgets array
  useEffect(() => {
    if (widgets.length > 0 && selectedWidget) {
      const latest = widgets.find(w => w.id === selectedWidget.id);
      if (latest && JSON.stringify(latest.lock) !== JSON.stringify(selectedWidget.lock)) {
        setSelectedWidget(latest);
      }
    }
  }, [widgets]);

  useEffect(() => {
    setActivePresetIndex(0);
    setErrorDetails(null);
    setPrompt('');

    if (selectedWidget) {
      const presets = SANDBOX_PRESETS[selectedWidget.id] || [];
      if (presets.length === 0) {
        // Automatically generate randomized properties to populate sandbox on select
        const initialProps = generateRandomProps(selectedWidget.id);
        setRandomProps(initialProps);
      } else {
        setRandomProps(null);
      }
    } else {
      setRandomProps(null);
    }
  }, [selectedWidget]);

  // Automatically focus on the first matching widget during searches or handle empty search state
  useEffect(() => {
    const term = searchQuery.toLowerCase();
    const filtered = widgets.filter(w => {
      const idMatches = w.id.toLowerCase().includes(term);
      const nameMatches = getWidgetName(w).toLowerCase().includes(term);
      const descMatches = getWidgetDesc(w).toLowerCase().includes(term);
      const disciplineMatches = w.disciplines.some(d => d.toLowerCase().includes(term));
      return idMatches || nameMatches || descMatches || disciplineMatches;
    });

    if (filtered.length > 0) {
      // If the currently selected widget is not in the filtered list, focus on the first match
      if (!selectedWidget || !filtered.some(w => w.id === selectedWidget.id)) {
        const sorted = [...filtered].sort((a, b) => {
          if (sortBy === 'level') {
            const getLevelRank = (levelStr: string): number => {
              const cleanStr = levelStr.toLowerCase();
              let minRank = 999;
              ACADEMIC_LEVELS.forEach((lvl, idx) => {
                const val = lvl.value.toLowerCase();
                const en = lvl.EN.toLowerCase();
                const fr = lvl.FR.toLowerCase();
                if (
                  cleanStr.includes(val) ||
                  cleanStr.includes(en.split(' (')[0].toLowerCase()) ||
                  cleanStr.includes(fr.split(' (')[0].toLowerCase()) ||
                  (val === 'secondary_1' && cleanStr.includes('collège')) ||
                  (val === 'preuni_1' && cleanStr.includes('lycée')) ||
                  (val.startsWith('L') && cleanStr.includes('université'))
                ) {
                  if (idx < minRank) minRank = idx;
                }
              });
              return minRank === 999 ? 100 : minRank;
            };
            const rankA = getLevelRank(lang === 'FR' ? a.levelFR : a.levelEN);
            const rankB = getLevelRank(lang === 'FR' ? b.levelFR : b.levelEN);
            if (rankA !== rankB) return rankA - rankB;
          } else if (sortBy === 'discipline') {
            const discA = a.disciplines[0] || '';
            const discB = b.disciplines[0] || '';
            if (discA !== discB) return discA.localeCompare(discB);
          }
          const nameA = getWidgetName(a);
          const nameB = getWidgetName(b);
          return nameA.localeCompare(nameB);
        });
        setSelectedWidget(sorted[0]);
      }
    } else if (widgets.length > 0) {
      setSelectedWidget(null);
    }
  }, [searchQuery, widgets, sortBy]);

  // LOCK MANAGEMENT LIFECYCLE
  const acquireLock = async (widgetIdToLock: string): Promise<boolean> => {
    if (!adminId) return false;
    try {
      const res = await fetch('/api/admin/widgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'lock',
          widgetId: widgetIdToLock,
          adminId
        })
      });
      const data = await res.json();
      return data.success;
    } catch (e) {
      console.error('[LOCK ACQUIRE EXCEPTION]', e);
      return false;
    }
  };

  const releaseLock = async (widgetIdToUnlock: string, force: boolean = false): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/widgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'unlock',
          widgetId: widgetIdToUnlock,
          adminId,
          force
        })
      });
      const data = await res.json();
      return data.success;
    } catch (e) {
      console.error('[LOCK RELEASE EXCEPTION]', e);
      return false;
    }
  };

  // Heartbeat Lock Renewal Hook (active when prompt contains text or parameters modal is open)
  useEffect(() => {
    if (!selectedWidget || !adminId) return;

    const isEditingPrompt = prompt.trim().length > 0;
    const isEditingParams = isEditModalOpen;
    const needsLock = isEditingPrompt || isEditingParams;

    if (!needsLock) return;

    const attemptAcquisition = async () => {
      const success = await acquireLock(selectedWidget.id);
      if (!success) {
        showToast(
          tr("Lock denied. Another administrator is currently editing this widget."),
          'error'
        );
        // Reset local modifications
        setPrompt('');
        setIsEditModalOpen(false);
      }
    };

    attemptAcquisition();

    const interval = setInterval(async () => {
      await acquireLock(selectedWidget.id);
    }, 30000); // 30s heartbeat

    return () => {
      clearInterval(interval);
      releaseLock(selectedWidget.id);
    };
  }, [selectedWidget?.id, prompt.trim().length > 0, isEditModalOpen, adminId]);

  // Save modified parameters
  const handleSaveParameters = async () => {
    if (!selectedWidget || !adminId) return;
    setIsSavingMetadata(true);
    

    try {
      let finalNameFR = editNameFR;
      let finalNameEN = editNameEN;
      let finalDescFR = editDescFR;
      let finalDescEN = editDescEN;
      let finalLevelFR = editLevelFR;
      let finalLevelEN = editLevelEN;

      if (lang === 'FR') {
        const [tName, tDesc, tLevel] = await Promise.all([
          translateText(editNameFR, 'FR', 'EN'),
          translateText(editDescFR, 'FR', 'EN'),
          translateText(editLevelFR, 'FR', 'EN')
        ]);
        finalNameEN = tName;
        finalDescEN = tDesc;
        finalLevelEN = tLevel;
      } else {
        const [tName, tDesc, tLevel] = await Promise.all([
          translateText(editNameEN, lang, 'FR'),
          translateText(editDescEN, lang, 'FR'),
          translateText(editLevelEN, lang, 'FR')
        ]);
        finalNameFR = tName;
        finalDescFR = tDesc;
        finalLevelFR = tLevel;
      }

      const res = await fetch('/api/admin/widgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          widgetId: selectedWidget.id,
          adminId,
          metadata: {
            nameFR: finalNameFR,
            nameEN: finalNameEN,
            descFR: finalDescFR,
            descEN: finalDescEN,
            levelFR: finalLevelFR,
            levelEN: finalLevelEN,
            disciplines: editDisciplines
          }
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast(
          tr("Pedagogical parameters successfully updated!"),
          'success'
        );
        setIsEditModalOpen(false);
        await loadWidgets();
      } else {
        showToast(data.error || "Failed to update parameters", 'error');
      }
    } catch (e: any) {
      console.error(e);
      showToast("Network exception saving parameters.", 'error');
    } finally {
      setIsSavingMetadata(false);
    }
  };

  const handleValidateWidget = async (widgetId: string) => {
    if (!adminId) return;
    try {
      setLoading(true);
      const res = await fetch('/api/admin/widgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'validate',
          widgetId,
          adminId
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast(tr("Widget draft successfully promoted and validated! All translations updated."), 'success');
        // Force unmount/refresh of currently rendered live component to make sure clean state
        setWidgetVersionKey(prev => prev + 1);
        await loadWidgets();
      } else {
        showToast(data.error || tr("Failed to validate widget."), 'error');
      }
    } catch (e) {
      console.error(e);
      showToast(tr("Error validating widget draft."), 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRollbackWidget = async (widgetId: string) => {
    if (!adminId) return;
    try {
      setLoading(true);
      const res = await fetch('/api/admin/widgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'rollback',
          widgetId,
          adminId
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast(tr("Draft discarded and original widget version restored!"), 'success');
        setWidgetVersionKey(prev => prev + 1);
        await loadWidgets();
      } else {
        showToast(data.error || tr("Failed to restore original widget."), 'error');
      }
    } catch (e) {
      console.error(e);
      showToast(tr("Error restoring original widget."), 'error');
    } finally {
      setLoading(false);
    }
  };

  // Open Parameter modal
  const openEditModal = () => {
    if (!selectedWidget) return;
    setEditNameFR(selectedWidget.nameFR);
    setEditNameEN(selectedWidget.nameEN);
    setEditDescFR(selectedWidget.descFR);
    setEditDescEN(selectedWidget.descEN);
    setEditLevelFR(selectedWidget.levelFR);
    setEditLevelEN(selectedWidget.levelEN);
    setEditDisciplines(selectedWidget.disciplines);
    setIsEditModalOpen(true);
  };

  // Force break lock
  const handleForceUnlock = async (widgetIdToUnlock: string) => {
    const success = await releaseLock(widgetIdToUnlock, true);
    if (success) {
      showToast(
        tr("Lock successfully broken. Widget is now free!"),
        'success'
      );
      await loadWidgets();
    } else {
      showToast("Failed to force unlock widget.", 'error');
    }
  };

  // Create brand new widget trigger
  const handleCreateWidget = async () => {
    const isFr = lang === 'FR';
    const activeName = isFr ? newWidgetNameFR.trim() : newWidgetNameEN.trim();
    if (!activeName || !newWidgetPrompt.trim() || isExecuting || namingCollisionError) return;

    setIsCreateModalOpen(false); // Close setup wizard
    setIsGenerating(true);
    setErrorDetails(null);
    setCurrentStep(1); // 🚀 Setup / Translation phase

    let finalNameFR = '';
    let finalNameEN = '';
    let finalDescFR = '';
    let finalDescEN = '';
    let finalLevelFR = '';
    let finalLevelEN = '';

    try {
      const stepTimer1 = setTimeout(() => setCurrentStep(2), 5000); // Backup
      const stepTimer2 = setTimeout(() => setCurrentStep(3), 8000); // Code Inject
      const stepTimer3 = setTimeout(() => setCurrentStep(4), 11000); // Compile

      if (isFr) {
        finalNameFR = newWidgetNameFR.trim();
        finalNameEN = await translateText(finalNameFR, 'FR', 'EN');
        
        const rawDesc = newWidgetDescFR.trim();
        finalDescFR = rawDesc || "Composant interactif personnalisé pour l'enrichissement pédagogique.";
        finalDescEN = rawDesc ? await translateText(rawDesc, 'FR', 'EN') : "Custom interactive component built for pedagogical curriculum enrichment.";

        const rawLevel = newWidgetLevelFR.trim();
        finalLevelFR = rawLevel || "Lycée / Université";
        finalLevelEN = rawLevel ? await translateText(rawLevel, 'FR', 'EN') : "High School / University";
      } else {
        finalNameEN = newWidgetNameEN.trim();
        finalNameFR = await translateText(finalNameEN, lang, 'FR');

        const rawDesc = newWidgetDescEN.trim();
        finalDescEN = rawDesc || "Custom interactive component built for pedagogical curriculum enrichment.";
        finalDescFR = rawDesc ? await translateText(rawDesc, lang, 'FR') : "Composant interactif personnalisé pour l'enrichissement pédagogique.";

        const rawLevel = newWidgetLevelEN.trim();
        finalLevelEN = rawLevel || "High School / University";
        finalLevelFR = rawLevel ? await translateText(rawLevel, lang, 'FR') : "Lycée / Université";
      }

      // Generate the widgetId Clean from English Name
      const computedId = toPascalCase(finalNameEN);
      const widgetIdClean = computedId || "CustomWidget" + Math.floor(Math.random() * 1000);

      // Check if widget already exists
      if (widgets.some(w => w.id.toLowerCase() === widgetIdClean.toLowerCase())) {
        clearTimeout(stepTimer1);
        clearTimeout(stepTimer2);
        clearTimeout(stepTimer3);
        setIsGenerating(false);
        setCurrentStep(0);
        showToast(tr("A widget with this name already exists!"), 'error');
        return;
      }

      const response = await fetch('/api/admin/widgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          widgetId: widgetIdClean,
          prompt: newWidgetPrompt,
          adminId,
          metadata: {
            nameFR: finalNameFR,
            nameEN: finalNameEN,
            descFR: finalDescFR,
            descEN: finalDescEN,
            levelFR: finalLevelFR,
            levelEN: finalLevelEN,
            disciplines: newWidgetDisciplines.length > 0 ? newWidgetDisciplines : ["General"]
          }
        })
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);

      const data = await response.json();

      if (response.ok && data.success) {
        setCurrentStep(5); // 🎉 Done
        showToast(
          tr("Widget \"{id}\" successfully created and registered!").replace("{id}", widgetIdClean),
          'success'
        );
        
        // Reset creation inputs
        setNewWidgetId('');
        setNewWidgetPrompt('');
        setNewWidgetNameFR('');
        setNewWidgetNameEN('');
        setNewWidgetDescFR('');
        setNewWidgetDescEN('');
        setNewWidgetLevelFR('');
        setNewWidgetLevelEN('');
        setNewWidgetDisciplines([]);

        // Reload lists and focus on the new widget
        setLoading(true);
        const refRes = await fetch('/api/admin/widgets');
        const refData = await refRes.json();
        if (refData.success) {
          setWidgets(refData.widgets);
          const found = refData.widgets.find((w: any) => w.id === widgetIdClean);
          setSelectedWidget(found || refData.widgets[0]);
        }
        setLoading(false);
      } else {
        setCurrentStep(0);
        setErrorDetails(data.details || data.error || "Compilation failed");
        showToast(
          tr("Creation failed. Changes rolled back."),
          'error'
        );
      }
    } catch (e: any) {
      console.error(e);
      setCurrentStep(0);
      setErrorDetails(e.message || "Network error");
      showToast(tr("An unexpected error occurred during execution."), 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  // AI Refine existing widget
  const handleEnhanceWidget = async () => {
    if (!selectedWidget || !prompt.trim() || isExecuting) return;

    setIsGenerating(true);
    setErrorDetails(null);
    setCurrentStep(1); 

    try {
      const stepTimer1 = setTimeout(() => setCurrentStep(2), 3500); 
      const stepTimer2 = setTimeout(() => setCurrentStep(3), 5000); 
      const stepTimer3 = setTimeout(() => setCurrentStep(4), 7000); 

      const response = await fetch('/api/admin/widgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          widgetId: selectedWidget.id,
          prompt: prompt,
          adminId
        })
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);

      const data = await response.json();

      if (response.ok && data.success) {
        setCurrentStep(5); // 🎉 Done
        showToast(
          tr("Widget \"{id}\" successfully updated and compile-verified!").replace("{id}", selectedWidget.id),
          'success'
        );
        setPrompt('');
        await loadWidgets();
      } else {
        setCurrentStep(0);
        setErrorDetails(data.details || data.error || "Unknown compilation error");
        showToast(
          tr("Compilation validation failed. Changes rolled back."),
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

  const toggleDiscipline = (disc: string, state: 'edit' | 'new') => {
    if (state === 'edit') {
      setEditDisciplines(prev => 
        prev.includes(disc) ? prev.filter(d => d !== disc) : [...prev, disc]
      );
    } else {
      setNewWidgetDisciplines(prev => 
        prev.includes(disc) ? prev.filter(d => d !== disc) : [...prev, disc]
      );
    }
  };

  const filteredWidgets = widgets.filter(w => {
    const term = searchQuery.toLowerCase();
    const idMatches = w.id.toLowerCase().includes(term);
    const nameMatches = getWidgetName(w).toLowerCase().includes(term);
    const descMatches = getWidgetDesc(w).toLowerCase().includes(term);
    const disciplineMatches = w.disciplines.some(d => d.toLowerCase().includes(term));
    return idMatches || nameMatches || descMatches || disciplineMatches;
  }).sort((a, b) => {
    if (sortBy === 'level') {
      const getLevelRank = (levelStr: string): number => {
        const cleanStr = levelStr.toLowerCase();
        let minRank = 999;
        ACADEMIC_LEVELS.forEach((lvl, idx) => {
          const val = lvl.value.toLowerCase();
          const en = lvl.EN.toLowerCase();
          const fr = lvl.FR.toLowerCase();
          if (
            cleanStr.includes(val) ||
            cleanStr.includes(en.split(' (')[0].toLowerCase()) ||
            cleanStr.includes(fr.split(' (')[0].toLowerCase()) ||
            (val === 'secondary_1' && cleanStr.includes('collège')) ||
            (val === 'preuni_1' && cleanStr.includes('lycée')) ||
            (val.startsWith('L') && cleanStr.includes('université'))
          ) {
            if (idx < minRank) minRank = idx;
          }
        });
        return minRank === 999 ? 100 : minRank;
      };
      const rankA = getLevelRank(lang === 'FR' ? a.levelFR : a.levelEN);
      const rankB = getLevelRank(lang === 'FR' ? b.levelFR : b.levelEN);
      if (rankA !== rankB) return rankA - rankB;
    } else if (sortBy === 'discipline') {
      const discA = a.disciplines[0] || '';
      const discB = b.disciplines[0] || '';
      if (discA !== discB) return discA.localeCompare(discB);
    }
    const nameA = getWidgetName(a);
    const nameB = getWidgetName(b);
    return nameA.localeCompare(nameB);
  });

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
      Mermaid,
    };

    const WidgetComponent = componentMap[selectedWidget.id];

    if (!WidgetComponent) {
      return (
        <div className="flex flex-col items-center justify-center p-12 text-center h-80 bg-slate-950/40 rounded-[30px] border border-slate-850 space-y-4">
          <div className="w-16 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400">
            <Cpu className="w-8 h-8" />
          </div>
          <div className="space-y-1 max-w-md">
            <h4 className="text-sm font-black text-slate-200">
              {tr("New Widget Hot-Registered")}
            </h4>
            <p className="text-[10px] text-slate-550 leading-relaxed">
              {tr("The component \"{id}\" has been registered in MdxContent.tsx and is ready for course lessons. It will be loaded inside this sandbox on your next development rebuild.").replace("{id}", selectedWidget.id)}
            </p>
          </div>
        </div>
      );
    }

    const presets = SANDBOX_PRESETS[selectedWidget.id] || [];
    const activeProps = randomProps !== null ? randomProps : (presets[activePresetIndex]?.props || {});

    try {
      return (
        <div className="bg-slate-950/20 rounded-[30px] border border-slate-850 p-6 min-h-[350px] flex flex-col justify-between shadow-inner">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-4 border-b border-slate-900">
            <div className="flex flex-wrap gap-2 items-center">
              {presets.length > 0 ? (
                <>
                  <span className="text-[8px] font-black uppercase text-slate-500 flex items-center gap-1.5 self-center mr-2">
                    <Layers className="w-3 h-3" /> {tr("Preset:")}
                  </span>
                  {presets.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setActivePresetIndex(idx);
                        setRandomProps(null);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-[9px] font-black transition-all ${randomProps === null && activePresetIndex === idx ? 'bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/10' : 'bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-white'}`}
                    >
                      {tr(p.label)}
                    </button>
                  ))}
                </>
              ) : (
                <span className="text-[8px] font-black uppercase text-slate-500 flex items-center gap-1.5 self-center">
                  <Sparkles className="w-3 h-3 text-teal-400 animate-pulse" /> {tr("Dynamic Sandbox Controls")}
                </span>
              )}
            </div>

            <button
              onClick={() => {
                setDiceRotation(prev => prev + 360);
                setRandomProps(generateRandomProps(selectedWidget.id));
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-black bg-gradient-to-r from-teal-500/10 to-emerald-500/10 hover:from-teal-500/20 hover:to-emerald-500/20 text-teal-400 border border-teal-500/20 hover:border-teal-500/40 transition-all hover:scale-[1.02] active:scale-95 shadow-md shadow-teal-500/5"
            >
              <span
                style={{
                  transform: `rotate(${diceRotation}deg)`,
                  transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  display: 'inline-block'
                }}
              >
                🎲
              </span>
              {tr("Refresh Random Parameters")}
            </button>
          </div>
          <div className="w-full h-full flex-grow relative overflow-hidden">
            <WidgetComponent key={`${selectedWidget.id}_v${widgetVersionKey}_r${randomProps ? JSON.stringify(randomProps) : 'preset_' + activePresetIndex}`} {...activeProps} />
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
              {tr("Sandbox Render Exception")}
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

  const isEditFormInvalid = 
    (lang === 'FR' ? (!editNameFR.trim() || editNameFR.trim().length < 3 || editNameFR.trim().length > 50 || !editDescFR.trim() || !editLevelFR.trim())
                   : (!editNameEN.trim() || editNameEN.trim().length < 3 || editNameEN.trim().length > 50 || !editDescEN.trim() || !editLevelEN.trim())) ||
    editDisciplines.length === 0;

  const isCreateFormInvalid = 
    (lang === 'FR' ? (!newWidgetNameFR.trim() || newWidgetNameFR.trim().length < 3 || newWidgetNameFR.trim().length > 50 || !newWidgetDescFR.trim() || !newWidgetLevelFR.trim())
                   : (!newWidgetNameEN.trim() || newWidgetNameEN.trim().length < 3 || newWidgetNameEN.trim().length > 50 || !newWidgetDescEN.trim() || !newWidgetLevelEN.trim())) ||
    newWidgetDisciplines.length === 0 ||
    !newWidgetPrompt.trim() ||
    !!namingCollisionError;

  const getDisciplinesSummary = (selected: string[]) => {
    if (selected.length === 0) return tr("Select subject fields...");
    if (selected.length <= 2) {
      return selected.map(d => getDisciplineLabel(d, lang)).join(', ');
    }
    return tr("{count} subjects selected").replace("{count}", selected.length.toString());
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* SECTION BANNER HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-slate-950/40 p-6 rounded-[30px] border border-slate-900 shadow-lg">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-slate-100 uppercase tracking-tight flex items-center gap-3">
            <Wrench className="w-7 h-7 text-teal-500" />
            {tr("Pedagogical Widgets Workshop")}
          </h2>
          <p className="text-xs text-slate-450 leading-relaxed font-medium">
            {tr("Monitor, inspect, preview, and safely compile prompt-driven enhancements to interactive curriculum blocks.")}
          </p>
        </div>

        {/* ADMIN IDENTITY CONFIG & ACTIONS */}
        <div className="flex flex-wrap items-center gap-4">

          <button
            onClick={loadWidgets}
            disabled={loading || isExecuting}
            className="px-4 py-2.5 border border-slate-850 hover:border-teal-500/25 bg-slate-900/40 text-slate-400 hover:text-teal-400 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            title={tr("Re-scan MDX directory to load physical disk changes")}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            {tr("Refresh")}
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            disabled={loading || isExecuting}
            className="px-4 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950 hover:scale-[1.02] rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-teal-500/10"
          >
            <Plus className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />
            {tr("Create Widget")}
          </button>
        </div>
      </div>

      {/* TOP SECTION: FULL WIDTH SEARCH AND CATALOG GRID */}
      <div className="bg-slate-900/40 border border-slate-850 rounded-[35px] p-6 space-y-6 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3 w-full sm:max-w-2xl flex-grow">
            <div className="relative flex-grow max-w-md">
              <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={tr("Filter components, subjects...")}
                className="w-full bg-slate-950/80 border border-slate-850/60 hover:border-slate-800 rounded-2xl py-2.5 pl-11 pr-4 text-xs focus:outline-none focus:border-teal-555 text-white placeholder-slate-600 transition-colors"
              />
            </div>
            {/* Sort Selector Dropdown */}
            <div className="relative shrink-0">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="appearance-none bg-slate-950/80 border border-slate-850/60 hover:border-slate-800 text-slate-300 hover:text-white rounded-2xl py-2.5 pl-4 pr-10 text-xs focus:outline-none focus:border-teal-555 transition-colors cursor-pointer"
                style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%252394a3b8'%3e%3cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3e%3c/svg%3e")`, backgroundPosition: 'right 12px center', backgroundSize: '16px', backgroundRepeat: 'no-repeat' }}
              >
                <option value="alphabetical">{tr("Sort: Alphabetical")}</option>
                <option value="level">{tr("Sort: Academic Level")}</option>
                <option value="discipline">{tr("Sort: Subject Area")}</option>
              </select>
            </div>
          </div>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider shrink-0">
            {filteredWidgets.length} {tr("catalog widgets")}
          </span>
        </div>

        {/* CATALOG LIST IN BEAUTIFUL HORIZONTAL GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-h-[340px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-800">
          {loading ? (
            <div className="col-span-full flex flex-col items-center justify-center p-12 text-center space-y-3">
              <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
              <p className="text-[10px] text-slate-550 font-bold uppercase tracking-widest">
                {tr("Scanning MDX directory...")}
              </p>
            </div>
          ) : filteredWidgets.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center p-12 text-center space-y-2">
              <Ban className="w-8 h-8 text-slate-650" />
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
                {tr("No matching widgets")}
              </p>
            </div>
          ) : (
            filteredWidgets.map(widget => {
              const isSelected = selectedWidget?.id === widget.id;
              const activeLock = widget.lock;
              const isLockedByOther = activeLock && activeLock.adminId !== adminId && Date.now() < activeLock.expiresAt;

              return (
                <div
                  key={widget.id}
                  onClick={() => setSelectedWidget(widget)}
                  className={`p-4 rounded-[20px] border transition-all cursor-pointer flex flex-col justify-between gap-3 group relative ${isSelected ? 'bg-teal-500/10 border-teal-500/40 ring-1 ring-teal-500/10' : 'bg-slate-950/40 border-slate-900/60 hover:border-slate-800 hover:bg-slate-900/20'}`}
                >
                  {/* LOCK OVERLAY INDICATION */}
                  {isLockedByOther && (
                    <div className="absolute top-2.5 right-2 px-2 py-1 bg-red-500/10 border border-red-500/20 rounded-md text-[8px] font-bold text-red-400 flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" />
                      {activeLock.adminId}
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-4">
                      <h4 className={`text-xs font-black transition-all ${isSelected ? 'text-teal-400' : 'text-slate-200 group-hover:text-white'}`}>
                        {getWidgetName(widget)}
                      </h4>
                      {!isLockedByOther && (
                        <span className="px-2 py-0.5 bg-slate-950/80 border border-slate-850/80 rounded-md text-[7px] font-mono font-bold text-slate-450 shrink-0">
                          {widget.linesCount} LOC
                        </span>
                      )}
                    </div>
                    
                    <p className="text-[9px] text-slate-400 font-medium leading-relaxed line-clamp-2">
                      {getWidgetDesc(widget)}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-900/60">
                    <div className="flex flex-wrap gap-1">
                      {widget.disciplines.slice(0, 2).map(disc => (
                        <span
                          key={disc}
                          className={`px-1.5 py-0.5 border text-[6px] font-black uppercase tracking-wider rounded-full ${getDisciplineColor(disc)}`}
                        >
                          {getDisciplineLabel(disc, lang)}
                        </span>
                      ))}
                      {widget.disciplines.length > 2 && (
                        <span className="text-[6px] font-bold text-slate-500 self-center">
                          +{widget.disciplines.length - 2}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[7px] font-mono bg-slate-950/60 text-slate-500 px-1.5 py-0.5 rounded border border-slate-850/60">
                        {widget.id}
                      </span>
                      <span className="text-[7px] font-bold text-slate-500 uppercase font-mono">
                        🎓 {getWidgetLevel(widget)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* BOTTOM SECTION: FULL WIDTH WORKSPACE PANEL */}
      <div className="w-full">
        {selectedWidget ? (
          <div className="bg-slate-900/40 border border-slate-850 rounded-[35px] p-8 space-y-6 shadow-xl backdrop-blur-xl relative overflow-hidden">
            
            {/* CONCURRENCY LOCK HEADER NOTIFICATION BANNER */}
            {(() => {
              const activeLock = selectedWidget.lock;
              const isLockedByOther = activeLock && activeLock.adminId !== adminId && Date.now() < activeLock.expiresAt;
              if (isLockedByOther) {
                return (
                  <div className="p-4 bg-red-950/15 border border-red-500/20 rounded-[20px] flex items-center justify-between gap-4 animate-pulse">
                    <div className="flex items-center gap-3">
                      <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
                      <div className="space-y-0.5">
                        <p className="text-[11px] font-black text-red-400 uppercase tracking-wider">
                          {tr("{adminId} is currently editing this component").replace("{adminId}", activeLock.adminId)}
                        </p>
                        <p className="text-[10px] text-slate-400 leading-relaxed">
                          {tr("Parameter saves or AI prompt commits are locked. Read-only preview available.")}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleForceUnlock(selectedWidget.id)}
                      className="px-3.5 py-1.5 bg-red-500 hover:bg-red-400 text-slate-950 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer"
                    >
                      {tr("Force Unlock")}
                    </button>
                  </div>
                );
              }
              return null;
            })()}

            {/* DRAFT NOTIFICATION BANNER */}
            {selectedWidget.hasBackup && (
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-[20px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <Globe className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="text-[11px] font-black text-amber-400 uppercase tracking-wider">
                      {tr("Unvalidated Draft")}
                    </p>
                    <p className="text-[10px] text-slate-300 leading-relaxed">
                      {tr("This version is currently a draft. To validate and propagate (name, description, and visual keys), click 'Validate Version'. To discard, click 'Restore Original'.")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => handleRollbackWidget(selectedWidget.id)}
                    className="px-3 py-1.5 border border-slate-800 hover:border-slate-700 bg-slate-950/40 text-slate-400 hover:text-white rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer"
                  >
                    {tr("Restore Original")}
                  </button>
                  <button
                    onClick={() => setWidgetToValidate(selectedWidget.id)}
                    className="px-3.5 py-1.5 bg-gradient-to-r from-teal-500 to-emerald-600 text-slate-950 font-black rounded-lg text-[9px] font-black uppercase tracking-wider hover:scale-[1.02] transition-all cursor-pointer shadow-lg shadow-teal-500/10"
                  >
                    {tr("Validate Version")}
                  </button>
                </div>
              </div>
            )}

            {/* ACTIVE WIDGET TITLE & CONTROLS */}
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="text-[9px] font-black uppercase bg-teal-500/10 border border-teal-500/20 text-teal-400 px-2.5 py-1 rounded-lg tracking-widest font-mono">
                    {selectedWidget.fileName}
                  </span>
                  <span className="text-[9px] font-bold text-slate-550 font-mono">
                    {(selectedWidget.sizeBytes / 1024).toFixed(1)} KB
                  </span>
                </div>
                <h3 className="text-xl font-black text-white">
                  {getWidgetName(selectedWidget)}
                </h3>
                <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
                  {getWidgetDesc(selectedWidget)}
                </p>
              </div>

              {/* EDIT PARAMETERS BUTTON */}
              <button
                onClick={openEditModal}
                disabled={isExecuting || (selectedWidget.lock !== null && selectedWidget.lock.adminId !== adminId && Date.now() < selectedWidget.lock.expiresAt)}
                className="px-4 py-2.5 border border-slate-800 hover:border-slate-700 hover:bg-slate-800 bg-slate-950/40 text-slate-300 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:scale-100"
              >
                <Edit className="w-3.5 h-3.5 text-teal-400" />
                {tr("Edit Parameters")}
              </button>
            </div>

            {/* TABS HEADER CONTROL */}
            <div className="flex items-center justify-between border-b border-slate-900 pb-2">
              <div className="flex gap-4">
                {[
                  { id: 'preview', label: tr("Interactive Live Sandbox"), icon: Play },
                  { id: 'code', label: tr("TSX Source Code"), icon: Code },
                  { id: 'props', label: tr("Props & API Schema"), icon: FileText }
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

              {/* FULLSCREEN PREVIEW TRIGGER */}
              {workshopTab === 'preview' && (
                <button
                  onClick={() => setIsFullscreenOpen(true)}
                  className="px-3 py-1.5 border border-slate-850 hover:border-teal-500/20 bg-slate-950/40 text-slate-400 hover:text-teal-400 rounded-lg text-[9px] font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Maximize2 className="w-3 h-3" />
                  {tr("Fullscreen Preview")}
                </button>
              )}
            </div>

            {/* WORKSPACE BODY VIEW */}
            <div className="py-2">
              
              {/* 1. INTERACTIVE LIVE PREVIEW */}
              {workshopTab === 'preview' && (
                <div className="space-y-6">
                  {renderLiveWidget()}
                </div>
              )}

              {/* 2. SOURCE CODE VIEWER */}
              {workshopTab === 'code' && (
                <div className="space-y-4">
                  <p className="text-[10px] text-slate-455 leading-relaxed font-medium">
                    {tr("Read-only inspection of the active TSX source code file. To edit or adjust logic, use the AI assistant console below.")}
                  </p>
                  <div className="relative group/code">
                    {/* FLOATING COPY BUTTON */}
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(selectedWidget.code);
                        setIsCopied(true);
                        showToast(tr("Source code copied to clipboard!"), 'success');
                        setTimeout(() => setIsCopied(false), 2000);
                      }}
                      className="absolute top-4 right-4 z-10 px-3 py-1.5 bg-slate-900/90 hover:bg-slate-850 border border-slate-800 rounded-lg text-[9px] font-black uppercase tracking-wider text-slate-300 hover:text-white flex items-center gap-1.5 transition-all opacity-0 group-hover/code:opacity-100 cursor-pointer"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                          {tr("Copied!")}
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-teal-400" />
                          {tr("Copy")}
                        </>
                      )}
                    </button>
                    
                    <div className="bg-slate-950/80 rounded-2xl border border-slate-850 p-6 max-h-[350px] overflow-y-auto font-mono text-[9px] text-slate-400 leading-relaxed scrollbar-thin scrollbar-thumb-slate-800">
                      <pre className="whitespace-pre-wrap">{selectedWidget.code}</pre>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. PROPS & API SCHEMATIC */}
              {workshopTab === 'props' && (
                <div className="space-y-4">
                  <p className="text-[10px] text-slate-455 leading-relaxed font-medium">
                    {tr("Pedagogical parameters signature and React properties registered for this interactive simulator.")}
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
                  {tr("AI Prompt Refinement Console")}
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
                    onClick={() => setPrompt(p)}
                    disabled={isExecuting || (selectedWidget.lock !== null && selectedWidget.lock.adminId !== adminId && Date.now() < selectedWidget.lock.expiresAt)}
                    className="px-3 py-1.5 border border-slate-850 bg-slate-950/30 text-[9px] font-bold text-slate-400 hover:text-white hover:border-slate-700 hover:bg-slate-900/20 rounded-xl transition-all cursor-pointer max-w-xs truncate disabled:opacity-40"
                  >
                    💡 {tr(p)}
                  </button>
                ))}
              </div>

              {/* INPUT FIELD */}
              <div className="relative">
                <textarea
                  rows={3}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  disabled={isExecuting || (selectedWidget.lock !== null && selectedWidget.lock.adminId !== adminId && Date.now() < selectedWidget.lock.expiresAt)}
                  placeholder={tr("Instruct the AI to enhance, modify, or add features to \"{id}\"...").replace("{id}", selectedWidget.id)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-2xl p-4 text-xs focus:outline-none focus:border-teal-555 text-white placeholder-slate-600 transition-colors resize-none pr-12 scrollbar-thin disabled:opacity-50"
                />
                
                <button
                  onClick={handleEnhanceWidget}
                  disabled={!prompt.trim() || isExecuting || (selectedWidget.lock !== null && selectedWidget.lock.adminId !== adminId && Date.now() < selectedWidget.lock.expiresAt)}
                  className="absolute bottom-4 right-4 p-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl transition-all active:scale-95 cursor-pointer disabled:opacity-40 disabled:scale-100 shadow-lg shadow-teal-500/10"
                >
                  {isExecuting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ChevronRight className="w-4 h-4 font-black" />
                  )}
                </button>
              </div>

              {/* AI PROMPT WARNING ALERT */}
              <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-4 flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-amber-500 tracking-wider">
                    {tr("Warning: Ephemeral Draft Preview")}
                  </p>
                  <p className="text-[9px] text-slate-400 leading-relaxed font-medium">
                    {tr("Submitting a prompt will generate a new version of the widget, which must then be approved or rejected. Once approved, the previous version is overwritten and modifications are immediately propagated to the entire site. Handle with care.")}
                  </p>
                </div>
              </div>

              {/* RUNNING COMPILER LOADER STEP GRAPH */}
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
                        {tr("Compiling Sovereign Refinements...")}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4 text-center">
                      {[
                        { step: 1, label: tr("AI Synthesis"), icon: Sparkles },
                        { step: 2, label: tr("Backup FS"), icon: FileText },
                        { step: 3, label: tr("TSX Inject"), icon: Code },
                        { step: 4, label: tr("TSC Compile"), icon: Terminal }
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
                          {tr("TSX Compilation Log Rejected")}
                        </h4>
                        <p className="text-[9px] text-slate-400 font-medium">
                          {tr("Build-breaking changes were safely discarded and the active component has been restored.")}
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
                {tr("No Widget Selected")}
              </h4>
              <p className="text-xs text-slate-550 max-w-xs mx-auto leading-relaxed">
                {tr("Select an interactive widget component from the catalog list to activate the preview sandbox workshop.")}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* EDIT PARAMETERS METADATA MODAL */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div 
            onClick={() => setIsEditModalOpen(false)}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 cursor-pointer"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl rounded-[35px] max-w-2xl w-full p-8 shadow-2xl relative flex flex-col max-h-[90vh] overflow-hidden cursor-default"
            >
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="absolute top-6 right-6 p-2 bg-slate-950 hover:bg-slate-850 rounded-full text-slate-400 hover:text-white transition-colors cursor-pointer z-10"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-1 shrink-0 border-b border-slate-850 pb-4 pr-12">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Edit className="w-5 h-5 text-teal-400" />
                  {tr("Edit parameters: {id}").replace(/[:：]\s*\{id\}/, "").trim()}
                </h3>
                <p className="text-[10px] text-slate-450">
                  {tr("Modify pedagogical metrics displayed to content authors within curriculum schedules.")}
                </p>
              </div>

              <div className="flex-grow overflow-y-auto py-6 pr-2 pb-24 scrollbar-thin space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {lang === 'FR' ? (
                    <>
                      {/* Name FR */}
                      <div className="space-y-1.5 col-span-1 md:col-span-2">
                        <label className="text-[10px] font-black uppercase text-slate-500">
                          {tr("Name")}
                        </label>
                        <input
                          type="text"
                          value={editNameFR}
                          onChange={(e) => setEditNameFR(e.target.value)}
                          className={`w-full bg-slate-950 border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-teal-555 ${editNameFR.trim().length < 3 || editNameFR.trim().length > 50 ? 'border-rose-500/50 focus:border-rose-500' : 'border-slate-850'}`}
                        />
                        {/* Display Name Tip Warning */}
                        <div className="mt-1.5 p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl flex items-start gap-2">
                          <Info className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                          <p className="text-[9px] text-slate-450 leading-relaxed font-medium">
                            {tr("Modifying the display name does not alter the technical component ID ({id}), which remains fixed for system stability. Enter between 3 and 50 characters.").replace("{id}", selectedWidget?.id || '')}
                          </p>
                        </div>
                      </div>
                      {/* Academic Level FR (Interactive selector dropdown) */}
                      <div className="space-y-1.5 col-span-1 md:col-span-2">
                        <label className="text-[10px] font-black uppercase text-slate-500">
                          {tr("Academic Level")}
                        </label>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => {
                              setIsEditLevelDropdownOpen(!isEditLevelDropdownOpen);
                              setIsEditSubjectDropdownOpen(false);
                            }}
                            className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-teal-555 flex items-center justify-between cursor-pointer"
                          >
                            <span className={!editLevelFR ? "text-slate-600" : ""}>
                              {editLevelFR || tr("Select academic levels...")}
                            </span>
                            <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isEditLevelDropdownOpen ? 'rotate-180' : ''}`} />
                          </button>
                          
                          <AnimatePresence>
                            {isEditLevelDropdownOpen && (
                              <motion.div
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                className="absolute z-10 mt-1.5 w-full bg-slate-950 border border-slate-850 rounded-xl p-2.5 shadow-xl space-y-1.5 max-h-48 overflow-y-auto scrollbar-thin"
                              >
                                {ACADEMIC_LEVELS.map(lvl => {
                                  const isChecked = editLevelFR.toLowerCase().split(' / ').map(s => s.trim()).includes(lvl.FR.toLowerCase());
                                  return (
                                    <button
                                      key={lvl.value}
                                      type="button"
                                      onClick={() => toggleAcademicLevel(lvl.value, 'edit')}
                                      className={`w-full px-3 py-2 rounded-lg text-left text-xs transition-colors flex items-center justify-between cursor-pointer ${isChecked ? 'bg-teal-500/10 text-teal-400 font-bold' : 'text-slate-400 hover:bg-slate-900/60 hover:text-white'}`}
                                    >
                                      <span>{lvl.FR}</span>
                                      {isChecked && <Check className="w-3.5 h-3.5 text-teal-400" />}
                                    </button>
                                  );
                                })}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                      {/* Description FR */}
                      <div className="col-span-1 md:col-span-2 space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-slate-500">
                          {tr("Description")}
                        </label>
                        <textarea
                          rows={2}
                          value={editDescFR}
                          onChange={(e) => setEditDescFR(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-teal-555 resize-none"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Name EN */}
                      <div className="space-y-1.5 col-span-1 md:col-span-2">
                        <label className="text-[10px] font-black uppercase text-slate-500">
                          {tr("Name")}
                        </label>
                        <input
                          type="text"
                          value={editNameEN}
                          onChange={(e) => setEditNameEN(e.target.value)}
                          className={`w-full bg-slate-950 border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-teal-555 ${editNameEN.trim().length < 3 || editNameEN.trim().length > 50 ? 'border-rose-500/50 focus:border-rose-500' : 'border-slate-850'}`}
                        />
                        {/* Display Name Tip Warning */}
                        <div className="mt-1.5 p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl flex items-start gap-2">
                          <Info className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                          <p className="text-[9px] text-slate-450 leading-relaxed font-medium">
                            {tr("Modifying the display name does not alter the technical component ID ({id}), which remains fixed for system stability. Enter between 3 and 50 characters.").replace("{id}", selectedWidget?.id || '')}
                          </p>
                        </div>
                      </div>
                      {/* Academic Level EN */}
                      <div className="space-y-1.5 col-span-1 md:col-span-2">
                        <label className="text-[10px] font-black uppercase text-slate-500">
                          {tr("Academic Level")}
                        </label>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => {
                              setIsEditLevelDropdownOpen(!isEditLevelDropdownOpen);
                              setIsEditSubjectDropdownOpen(false);
                            }}
                            className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-teal-555 flex items-center justify-between cursor-pointer"
                          >
                            <span className={!editLevelEN ? "text-slate-600" : ""}>
                              {editLevelEN || "Select academic levels..."}
                            </span>
                            <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isEditLevelDropdownOpen ? 'rotate-180' : ''}`} />
                          </button>
                          
                          <AnimatePresence>
                            {isEditLevelDropdownOpen && (
                              <motion.div
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                className="absolute z-10 mt-1.5 w-full bg-slate-950 border border-slate-850 rounded-xl p-2.5 shadow-xl space-y-1.5 max-h-48 overflow-y-auto scrollbar-thin"
                              >
                                {ACADEMIC_LEVELS.map(lvl => {
                                  const isChecked = editLevelEN.toLowerCase().split(' / ').map(s => s.trim()).includes(lvl.EN.toLowerCase());
                                  return (
                                    <button
                                      key={lvl.value}
                                      type="button"
                                      onClick={() => toggleAcademicLevel(lvl.value, 'edit')}
                                      className={`w-full px-3 py-2 rounded-lg text-left text-xs transition-colors flex items-center justify-between cursor-pointer ${isChecked ? 'bg-teal-500/10 text-teal-400 font-bold' : 'text-slate-400 hover:bg-slate-900/60 hover:text-white'}`}
                                    >
                                      <span>{lvl.EN}</span>
                                      {isChecked && <Check className="w-3.5 h-3.5 text-teal-400" />}
                                    </button>
                                  );
                                })}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                      {/* Description EN */}
                      <div className="col-span-1 md:col-span-2 space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-slate-500">
                          {tr("Description")}
                        </label>
                        <textarea
                          rows={2}
                          value={editDescEN}
                          onChange={(e) => setEditDescEN(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-teal-555 resize-none"
                        />
                      </div>
                    </>
                  )}

                  {/* Compact Subjects Selector Dropdown */}
                  <div className="col-span-1 md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500">{tr("Target Subject Fields")}</label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditSubjectDropdownOpen(!isEditSubjectDropdownOpen);
                          setIsEditLevelDropdownOpen(false);
                        }}
                        className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-teal-555 flex items-center justify-between cursor-pointer"
                      >
                        <span className={editDisciplines.length === 0 ? "text-slate-600" : ""}>
                          {getDisciplinesSummary(editDisciplines)}
                        </span>
                        <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isEditSubjectDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>
                      
                      <AnimatePresence>
                        {isEditSubjectDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="absolute z-10 mt-1.5 w-full bg-slate-950 border border-slate-850 rounded-xl p-3 shadow-xl space-y-2 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-850"
                          >
                            <div className="grid grid-cols-2 gap-1.5">
                              {DISCIPLINES_LIST.map((disc) => {
                                const isChecked = editDisciplines.includes(disc);
                                return (
                                  <button
                                    key={disc}
                                    type="button"
                                    onClick={() => toggleDiscipline(disc, 'edit')}
                                    className={`px-2.5 py-2 border rounded-lg text-[9px] font-black uppercase tracking-wider transition-colors text-left flex items-center justify-between cursor-pointer ${isChecked ? 'bg-teal-500 border-teal-400 text-slate-950' : 'bg-slate-900/60 border-slate-850 text-slate-400 hover:border-slate-750 hover:text-white'}`}
                                  >
                                    <span className="truncate mr-1">{getDisciplineLabel(disc, lang)}</span>
                                    {isChecked && <Check className="w-3 h-3 text-slate-950 shrink-0" />}
                                  </button>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                </div> {/* Closes <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> */}

                {/* PRODUCTION STABILITY WARNING ALERT */}
                <div className="bg-rose-500/5 border border-rose-500/10 rounded-2xl p-4 flex items-start gap-3 mt-6">
                  <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase text-rose-400 tracking-wider">
                      {tr("Production Stability Warning")}
                    </p>
                    <p className="text-[9px] text-slate-400 leading-relaxed font-medium">
                      {tr("Modifying a widget's technical interface or parameters risks breaking all courses in production that render this widget. Always ensure strict backwards compatibility by keeping old props optional and supplying default fallback values in the component's code.")}
                    </p>
                  </div>
                </div>
              </div> {/* Closes <div className="flex-grow overflow-y-auto..."> */}

              {/* Edit Modal Footer Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-850 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-950 border border-slate-850 text-slate-400 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer"
                >
                  {tr("Cancel")}
                </button>
                <button
                  type="button"
                  onClick={handleSaveParameters}
                  disabled={isSavingMetadata || isEditFormInvalid}
                  className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 text-slate-950 hover:scale-[1.01] rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-teal-500/10 disabled:opacity-40 disabled:scale-100"
                >
                  {isSavingMetadata ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-950" />
                  ) : (
                    <Check className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />
                  )}
                  {tr("Save Changes")}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

       {/* CREATE NEW WIDGET MODAL DIALOG */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div 
            onClick={() => setIsCreateModalOpen(false)}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 cursor-pointer"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl rounded-[35px] max-w-2xl w-full p-8 shadow-2xl relative flex flex-col max-h-[90vh] overflow-hidden cursor-default"
            >
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="absolute top-6 right-6 p-2 bg-slate-950 hover:bg-slate-850 rounded-full text-slate-400 hover:text-white transition-colors cursor-pointer z-10"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-1 shrink-0 border-b border-slate-850 pb-4 pr-12">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Plus className="w-5 h-5 text-teal-400" />
                  {tr("Create Brand New Interactive Widget")}
                </h3>
                <p className="text-[10px] text-slate-400">
                  {tr("The AI agent will generate, run a static check verify, and deploy a self-contained simulator block.")}
                </p>
              </div>

              <div className="flex-grow overflow-y-auto py-6 pr-2 pb-24 scrollbar-thin space-y-4">
                
                {/* Active-Language Only Inputs Grid */}
                <div className="grid grid-cols-1 gap-4">
                  {lang === 'FR' ? (
                    <>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-slate-500">{tr("Name")}</label>
                        <input
                          type="text"
                          value={newWidgetNameFR}
                          onChange={(e) => setNewWidgetNameFR(e.target.value)}
                          placeholder="Ex: Laboratoire Optique Lumineuse"
                          className={`w-full bg-slate-950 border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500 ${newWidgetNameFR.trim().length < 3 || newWidgetNameFR.trim().length > 50 || namingCollisionError ? 'border-rose-500/50 focus:border-rose-500' : 'border-slate-850'}`}
                        />
                        {/* Naming Collision and Length Indicators */}
                        <div className="mt-1.5 p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl flex items-start gap-2">
                          <Info className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                          <p className="text-[9px] text-slate-450 leading-relaxed font-medium">
                            Le nom d'affichage doit contenir entre 3 et 50 caractères. Il sera utilisé pour déduire l'ID PascalCase technique du composant.
                          </p>
                        </div>
                        {namingCollisionError && (
                          <p className="text-[9px] font-semibold text-rose-400 mt-1 flex items-center gap-1">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-500" />
                            {namingCollisionError}
                          </p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-slate-500">{tr("Academic Level")}</label>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => {
                              setIsCreateLevelDropdownOpen(!isCreateLevelDropdownOpen);
                              setIsCreateSubjectDropdownOpen(false);
                            }}
                            className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-teal-550 flex items-center justify-between cursor-pointer"
                          >
                            <span className={!newWidgetLevelFR ? "text-slate-600" : ""}>
                              {newWidgetLevelFR || tr("Select academic levels...")}
                            </span>
                            <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isCreateLevelDropdownOpen ? 'rotate-180' : ''}`} />
                          </button>
                          
                          <AnimatePresence>
                            {isCreateLevelDropdownOpen && (
                              <motion.div
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                className="absolute z-10 mt-1.5 w-full bg-slate-950 border border-slate-850 rounded-xl p-2.5 shadow-xl space-y-1.5 max-h-48 overflow-y-auto scrollbar-thin"
                              >
                                {ACADEMIC_LEVELS.map(lvl => {
                                  const isChecked = newWidgetLevelFR.toLowerCase().split(' / ').map(s => s.trim()).includes(lvl.FR.toLowerCase());
                                  return (
                                    <button
                                      key={lvl.value}
                                      type="button"
                                      onClick={() => toggleAcademicLevel(lvl.value, 'new')}
                                      className={`w-full px-3 py-2 rounded-lg text-left text-xs transition-colors flex items-center justify-between cursor-pointer ${isChecked ? 'bg-teal-500/10 text-teal-400 font-bold' : 'text-slate-400 hover:bg-slate-900/60 hover:text-white'}`}
                                    >
                                      <span>{lvl.FR}</span>
                                      {isChecked && <Check className="w-3.5 h-3.5 text-teal-400" />}
                                    </button>
                                  );
                                })}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-slate-500">{tr("Description")}</label>
                        <textarea
                          rows={2}
                          value={newWidgetDescFR}
                          onChange={(e) => setNewWidgetDescFR(e.target.value)}
                          placeholder="Ex: Simulation physique de la réfraction de la lumière à travers des prismes."
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-teal-555 resize-none"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-slate-500">{tr("Name")}</label>
                        <input
                          type="text"
                          value={newWidgetNameEN}
                          onChange={(e) => setNewWidgetNameEN(e.target.value)}
                          placeholder="Ex: Light Optics Simulator"
                          className={`w-full bg-slate-950 border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-teal-555 ${newWidgetNameEN.trim().length < 3 || newWidgetNameEN.trim().length > 50 || namingCollisionError ? 'border-rose-500/50 focus:border-rose-555' : 'border-slate-850'}`}
                        />
                        {/* Naming Collision and Length Indicators */}
                        <div className="mt-1.5 p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl flex items-start gap-2">
                          <Info className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                          <p className="text-[9px] text-slate-450 leading-relaxed font-medium">
                            {tr("Display name must be between 3 and 50 characters. It will automatically compile the technical component PascalCase ID.")}
                          </p>
                        </div>
                        {namingCollisionError && (
                          <p className="text-[9px] font-semibold text-rose-400 mt-1 flex items-center gap-1">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-500" />
                            {namingCollisionError}
                          </p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-slate-500">{tr("Academic Level")}</label>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => {
                              setIsCreateLevelDropdownOpen(!isCreateLevelDropdownOpen);
                              setIsCreateSubjectDropdownOpen(false);
                            }}
                            className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-teal-550 flex items-center justify-between cursor-pointer"
                          >
                            <span className={!newWidgetLevelEN ? "text-slate-600" : ""}>
                              {newWidgetLevelEN || tr("Select academic levels...")}
                            </span>
                            <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isCreateLevelDropdownOpen ? 'rotate-180' : ''}`} />
                          </button>
                          
                          <AnimatePresence>
                            {isCreateLevelDropdownOpen && (
                              <motion.div
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                className="absolute z-10 mt-1.5 w-full bg-slate-950 border border-slate-850 rounded-xl p-2.5 shadow-xl space-y-1.5 max-h-48 overflow-y-auto scrollbar-thin"
                              >
                                {ACADEMIC_LEVELS.map(lvl => {
                                  const isChecked = newWidgetLevelEN.toLowerCase().split(' / ').map(s => s.trim()).includes(lvl.EN.toLowerCase());
                                  return (
                                    <button
                                      key={lvl.value}
                                      type="button"
                                      onClick={() => toggleAcademicLevel(lvl.value, 'new')}
                                      className={`w-full px-3 py-2 rounded-lg text-left text-xs transition-colors flex items-center justify-between cursor-pointer ${isChecked ? 'bg-teal-500/10 text-teal-400 font-bold' : 'text-slate-400 hover:bg-slate-900/60 hover:text-white'}`}
                                    >
                                      <span>{lvl.EN}</span>
                                      {isChecked && <Check className="w-3.5 h-3.5 text-teal-400" />}
                                    </button>
                                  );
                                })}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-slate-500">{tr("Description")}</label>
                        <textarea
                          rows={2}
                          value={newWidgetDescEN}
                          onChange={(e) => setNewWidgetDescEN(e.target.value)}
                          placeholder="Ex: Physics simulation of light refraction through interactive glass prisms."
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-teal-555 resize-none"
                        />
                      </div>
                    </>
                  )}

                  {/* Compact Disciplines Selector Dropdown */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500">{tr("Target Subject Fields")}</label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => {
                          setIsCreateSubjectDropdownOpen(!isCreateSubjectDropdownOpen);
                          setIsCreateLevelDropdownOpen(false);
                        }}
                        className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-teal-550 flex items-center justify-between cursor-pointer"
                      >
                        <span className={newWidgetDisciplines.length === 0 ? "text-slate-600" : ""}>
                          {getDisciplinesSummary(newWidgetDisciplines)}
                        </span>
                        <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isCreateSubjectDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>
                      
                      <AnimatePresence>
                        {isCreateSubjectDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="absolute z-10 mt-1.5 w-full bg-slate-950 border border-slate-850 rounded-xl p-3 shadow-xl space-y-2 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-850"
                          >
                            <div className="grid grid-cols-2 gap-1.5">
                              {DISCIPLINES_LIST.map((disc) => {
                                const isChecked = newWidgetDisciplines.includes(disc);
                                return (
                                  <button
                                    key={disc}
                                    type="button"
                                    onClick={() => toggleDiscipline(disc, 'new')}
                                    className={`px-2.5 py-2 border rounded-lg text-[9px] font-black uppercase tracking-wider transition-colors text-left flex items-center justify-between cursor-pointer ${isChecked ? 'bg-teal-500 border-teal-400 text-slate-950' : 'bg-slate-900/60 border-slate-850 text-slate-400 hover:border-slate-750 hover:text-white'}`}
                                  >
                                    <span className="truncate mr-1">{getDisciplineLabel(disc, lang)}</span>
                                    {isChecked && <Check className="w-3 h-3 text-slate-950 shrink-0" />}
                                  </button>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                {/* AI Prompt */}
                <div className="space-y-1.5 pt-2">
                  <label className="text-[10px] font-black uppercase text-slate-500">{tr("Instructions for AI Generation (Prompt)")}</label>
                  <textarea
                    rows={4}
                    value={newWidgetPrompt}
                    onChange={(e) => setNewWidgetPrompt(e.target.value)}
                    placeholder="Ex: Crée un simulateur physique interactif de réfraction de la lumière. L'utilisateur peut déplacer un rayon lumineux sur un canevas 2D, ajouter des prismes de verre de différentes formes (triangle, rectangle) et ajuster l'indice de réfraction du verre avec un slider. Calcule les angles réels de réfraction."
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl p-4 text-xs focus:outline-none focus:border-teal-555 text-white placeholder-slate-650 resize-none scrollbar-thin font-medium leading-relaxed"
                  />
                </div>

              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-850">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-950 border border-slate-850 text-slate-400 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer"
                >
                  {tr("Cancel")}
                </button>
                <button
                  type="button"
                  onClick={handleCreateWidget}
                  disabled={isCreateFormInvalid}
                  className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 text-slate-950 hover:scale-[1.01] rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-teal-500/10 disabled:opacity-40 disabled:scale-100"
                >
                  <Sparkles className="w-3.5 h-3.5 text-slate-950 fill-slate-950" />
                  {tr("Generate & Deploy")}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FULL SCREEN SHOWCASE PREVIEW MODAL */}
      <AnimatePresence>
        {isFullscreenOpen && selectedWidget && (
          <div className="fixed inset-0 bg-slate-950 z-[999] flex flex-col p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-900 pb-4 shrink-0">
              <div className="space-y-0.5">
                <span className="text-[9px] font-black uppercase bg-teal-500/10 border border-teal-500/20 text-teal-400 px-2 py-0.5 rounded-md font-mono">
                  {selectedWidget.id} Fullscreen Sandbox
                </span>
                <h3 className="text-md font-black text-white">
                  {getWidgetName(selectedWidget)}
                </h3>
              </div>
              <button 
                onClick={() => setIsFullscreenOpen(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer border border-slate-850"
              >
                <Minimize2 className="w-4 h-4 text-teal-400" />
                {tr("Exit Fullscreen")}
              </button>
            </div>

            {/* Immersive Expanded Canvas */}
            <div className="flex-grow w-full overflow-hidden bg-slate-950/20 rounded-[30px] border border-slate-850/60 p-8 shadow-inner flex flex-col justify-center relative">
              <div className="w-full h-full">
                {renderLiveWidget()}
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* CONFIRM VALIDATION MODAL */}
      <AnimatePresence>
        {widgetToValidate && (
          <div 
            onClick={() => setWidgetToValidate(null)}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[1000] flex items-center justify-center p-4 cursor-pointer"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl rounded-[35px] max-w-md w-full p-8 shadow-2xl relative overflow-hidden cursor-default space-y-6 text-center"
            >
              <div className="mx-auto w-12 h-12 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-full flex items-center justify-center animate-pulse">
                <ShieldAlert className="w-6 h-6" />
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-black text-white uppercase tracking-wider">
                  {tr("Confirm Promotion & Validation?")}
                </h4>
                <p className="text-[10px] text-slate-300 leading-relaxed font-medium">
                  {tr("Are you sure you want to validate this version? These changes will be applied instantly across the entire site. Once validated, there is no possibility of rollback or undo.")}
                </p>
              </div>

              <div className="flex justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setWidgetToValidate(null)}
                  className="px-5 py-2.5 bg-slate-950 border border-slate-850 text-slate-400 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer"
                >
                  {tr("Cancel")}
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    const id = widgetToValidate;
                    setWidgetToValidate(null);
                    await handleValidateWidget(id);
                  }}
                  className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 text-slate-950 hover:scale-[1.01] rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-teal-500/10"
                >
                  {tr("Confirm Validation")}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
