"use client";

export const toPascalCase = (str: string): string => {
  return str.replace(/[^a-zA-Z0-9]/g, ' ').split(' ').filter(Boolean).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
};
import React, { useState, useEffect } from 'react';
import { 
  Wrench, Sparkles, Terminal, FileText, Play, CheckCircle2, AlertTriangle, 
  RefreshCw, Layers, ChevronRight, Search, Check, Cpu, Ban, Loader2, Code,
  Lock, Unlock, ShieldAlert, Maximize2, Minimize2, Edit, Plus, Globe, Tag, X, Info,
  Copy, ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DISCIPLINES, getDisciplineLabel, ACADEMIC_LEVELS } from '../../strings';
import { Mermaid } from '@/components/mdx/Mermaid';

// Statically import the 14 rich pedagogical widgets for safe live-rendering
import { StructureViewer3D } from '@/components/mdx/StructureViewer3D';
import { QuantumOrbitalExplorer } from '@/components/mdx/QuantumOrbitalExplorer';
import { DynamicSimulation } from '@/components/mdx/DynamicSimulation';
import { ChemicalStoichiometry } from '@/components/mdx/ChemicalStoichiometry';
import { BasicMathExplorer } from '@/components/mdx/BasicMathExplorer';
import { FunctionPlotter } from '@/components/mdx/FunctionPlotter';
import { ComparisonSlider } from '@/components/mdx/ComparisonSlider';
import { CodeSandbox } from '@/components/mdx/CodeSandbox';
import { DataChart } from '@/components/mdx/DataChart';
import { InteractiveDiagram } from '@/components/mdx/InteractiveDiagram';
import { FunctionManipulator } from '@/components/mdx/FunctionManipulator';
import { EquationManipulator } from '@/components/mdx/EquationManipulator';
import { Geometry2D } from '@/components/mdx/Geometry2D';
import { GestaltInteractive } from '@/components/mdx/GestaltInteractive';
import { LogicGateSimulator } from '@/components/mdx/LogicGateSimulator';
import { GeneticsPedigreeLab } from '@/components/mdx/GeneticsPedigreeLab';
import { OrbitalMechanicsSim } from '@/components/mdx/OrbitalMechanicsSim';
import { PeriodicTable } from '@/components/mdx/PeriodicTable';
import { SolarSystemOrrery } from '@/components/mdx/SolarSystemOrrery';
import { FinancialChart } from '@/components/mdx/FinancialChart';
import { WaveInterferenceSim } from '@/components/mdx/WaveInterferenceSim';
import { AcousticPianoSynth } from '@/components/mdx/AcousticPianoSynth';
import { SankeyDiagram } from '@/components/mdx/SankeyDiagram';


export interface Widget {
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


// Preset controls mapping to display custom configurations inside the Live Sandbox Preview
export const SANDBOX_PRESETS: Record<string, { label: string; props: Record<string, any> }[]> = {
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

export const SUGGESTED_PROMPTS: Record<string, string[]> = {
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

export interface WidgetsTabProps {
  t: any;
  lang?: any;
  tr?: (k: string) => string;
  showToast?: (text: string, type?: 'success' | 'error' | 'info') => void;
}
