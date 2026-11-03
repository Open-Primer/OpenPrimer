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
import { LogicGateSimulator } from '../../../../components/mdx/LogicGateSimulator';
import { GeneticsPedigreeLab } from '../../../../components/mdx/GeneticsPedigreeLab';
import { OrbitalMechanicsSim } from '../../../../components/mdx/OrbitalMechanicsSim';
import { PeriodicTable } from '../../../../components/mdx/PeriodicTable';
import { SolarSystemOrrery } from '../../../../components/mdx/SolarSystemOrrery';
import { FinancialChart } from '../../../../components/mdx/FinancialChart';
import { WaveInterferenceSim } from '../../../../components/mdx/WaveInterferenceSim';
import { AcousticPianoSynth } from '../../../../components/mdx/AcousticPianoSynth';
import { SankeyDiagram } from '../../../../components/mdx/SankeyDiagram';


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

