"use client";

import React, { useState, useEffect, useRef } from 'react';
import { RotateCw, ZoomIn, ZoomOut, Zap, Eye, HelpCircle, Info, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { STATIC_UI_STRINGS } from '@/lib/translations';

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

interface StructureViewer3DProps {
  presetId?: string;
  name?: string;
  description?: string;
  atoms?: Atom[];
  bonds?: Bond[];
  atomsBase64?: string;
  bondsBase64?: string;
  xyz?: string;
  xyzBase64?: string;
  showMenu?: boolean;
  gradeLevel?: 'middle_school' | 'high_school' | 'university';
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

  const rows = 4;
  const cols = 5;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; cols > c; c++) {
      let x = (c * 1.5) - (cols * 0.75);
      let y = (r * Math.sqrt(3) + (c % 2 === 0 ? 0 : Math.sqrt(3) / 2)) - (rows * Math.sqrt(3) * 0.5);
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

  const distanceThreshold = scale * 1.15;
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
    name: "Chloromethane (CH₃Cl)",
    id: "ch3cl",
    description: "Simple organic halogen compound with a tetrahedral carbon bonded to three hydrogens and one chlorine.",
    atoms: [
      { x: 0, y: -0.2, z: 0, color: '#475569', radius: 15, label: 'C' },         // Carbon
      { x: 0, y: 1.2, z: 0, color: '#84cc16', radius: 19, label: 'Cl' },        // Chlorine (Lime Green)
      { x: 1.03, y: -0.6, z: 0, color: '#f8fafc', radius: 10, label: 'H' },     // H1
      { x: -0.51, y: -0.6, z: 0.89, color: '#f8fafc', radius: 10, label: 'H' },  // H2
      { x: -0.51, y: -0.6, z: -0.89, color: '#f8fafc', radius: 10, label: 'H' } // H3
    ],
    bonds: [
      { atomA: 0, atomB: 1 },
      { atomA: 0, atomB: 2 },
      { atomA: 0, atomB: 3 },
      { atomA: 0, atomB: 4 }
    ]
  },
  {
    name: "Ethanol (C₂H₅OH)",
    id: "ethanol",
    description: "Clear, colorless alcohol featuring a methyl group, a methylene group, and a polar hydroxyl functional group.",
    atoms: [
      { x: -0.75, y: -0.1, z: 0, color: '#475569', radius: 15, label: 'C' },      // Carbon 1
      { x: 0.75, y: -0.1, z: 0, color: '#475569', radius: 15, label: 'C' },       // Carbon 2
      { x: 1.45, y: 1.1, z: 0, color: '#ef4444', radius: 18, label: 'O' },        // Oxygen
      { x: 2.35, y: 0.9, z: 0, color: '#f8fafc', radius: 10, label: 'H' },        // Hydrogen (hydroxyl)
      { x: -1.15, y: -0.6, z: 0.89, color: '#f8fafc', radius: 10, label: 'H' },   // H (on C1)
      { x: -1.15, y: -0.6, z: -0.89, color: '#f8fafc', radius: 10, label: 'H' },  // H (on C1)
      { x: -1.15, y: 0.9, z: 0, color: '#f8fafc', radius: 10, label: 'H' },       // H (on C1)
      { x: 1.15, y: -0.6, z: 0.89, color: '#f8fafc', radius: 10, label: 'H' },    // H (on C2)
      { x: 1.15, y: -0.6, z: -0.89, color: '#f8fafc', radius: 10, label: 'H' }   // H (on C2)
    ],
    bonds: [
      { atomA: 0, atomB: 1 },
      { atomA: 1, atomB: 2 },
      { atomA: 2, atomB: 3 },
      { atomA: 0, atomB: 4 },
      { atomA: 0, atomB: 5 },
      { atomA: 0, atomB: 6 },
      { atomA: 1, atomB: 7 },
      { atomA: 1, atomB: 8 }
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

// Dummy array to force extraction of all localized strings by the backend i18n parser
const _dummy_translations = (t: any) => [
  t("Water (H₂O)"),
  t("Polar molecule showing a bent molecular geometry with an angle of 104.5°."),
  t("Carbon Dioxide (CO₂)"),
  t("Linear molecule featuring double covalent bonds between carbon and oxygen."),
  t("Methane (CH₄)"),
  t("Symmetrical tetrahedral configuration showcasing four carbon-hydrogen single bonds."),
  t("Chloromethane (CH₃Cl)"),
  t("Simple organic halogen compound with a tetrahedral carbon bonded to three hydrogens and one chlorine."),
  t("Ethanol (C₂H₅OH)"),
  t("Clear, colorless alcohol featuring a methyl group, a methylene group, and a polar hydroxyl functional group."),
  t("Salt Lattice (NaCl)"),
  t("FCC (Face-Centered Cubic) crystalline arrangement of alternating sodium and chlorine ions."),
  t("Graphene Sheet"),
  t("2D planar grid of sp² hybridized carbon atoms arranged in an interlocking hexagonal lattice."),
  
  // Element Names
  t("Hydrogen"), t("Helium"), t("Lithium"), t("Beryllium"), t("Boron"), t("Carbon"),
  t("Nitrogen"), t("Oxygen"), t("Fluorine"), t("Neon"), t("Sodium"), t("Magnesium"),
  t("Aluminium"), t("Silicon"), t("Phosphorus"), t("Sulfur"), t("Chlorine"),
  t("Potassium"), t("Calcium"), t("Iron"), t("Copper"), t("Zinc"), t("Bromine"), t("Iodine"),

  // Element Categories
  t("Reactive Nonmetal"), t("Noble Gas"), t("Alkali Metal"), t("Alkaline Earth Metal"),
  t("Metalloid"), t("Halogen"), t("Post-Transition Metal"), t("Transition Metal"),

  // HUD and Interface Strings
  t("Interactive 3D Structure Viewer"),
  t("Drag to rotate molecule. Scroll/slider to zoom. Click an atom to inspect properties."),
  t("Loading molecule..."),
  t("Loading error"),
  t("Return to Water (H₂O)"),
  t("Atom Inspector"),
  t("Clear"),
  t("Active Specimen"),
  t("Atom Legend"),
  t("Atomic Number"),
  t("Atomic Mass"),
  t("Configuration"),
  t("Electronegativity")
];

const ELEMENT_DETAILS: Record<string, {
  nameEN: string;
  nameFR: string;
  num: number;
  weight: number;
  config: string;
  electronegativity: number;
  categoryFR: string;
  categoryEN: string;
  color: string;
}> = {
  'H': { nameEN: 'Hydrogen', nameFR: 'Hydrogène', num: 1, weight: 1.008, config: '1s¹', electronegativity: 2.20, categoryFR: 'Non-métal réactif', categoryEN: 'Reactive Nonmetal', color: '#f8fafc' },
  'HE': { nameEN: 'Helium', nameFR: 'Hélium', num: 2, weight: 4.0026, config: '1s²', electronegativity: 0, categoryFR: 'Gaz noble', categoryEN: 'Noble Gas', color: '#c084fc' },
  'LI': { nameEN: 'Lithium', nameFR: 'Lithium', num: 3, weight: 6.94, config: '[He] 2s¹', electronegativity: 0.98, categoryFR: 'Métal alcalin', categoryEN: 'Alkali Metal', color: '#a855f7' },
  'BE': { nameEN: 'Beryllium', nameFR: 'Béryllium', num: 4, weight: 9.0122, config: '[He] 2s²', electronegativity: 1.57, categoryFR: 'Métal alcalino-terreux', categoryEN: 'Alkaline Earth Metal', color: '#9333ea' },
  'B': { nameEN: 'Boron', nameFR: 'Bore', num: 5, weight: 10.81, config: '[He] 2s² 2p¹', electronegativity: 2.04, categoryFR: 'Métalloïde', categoryEN: 'Metalloid', color: '#fb923c' },
  'C': { nameEN: 'Carbon', nameFR: 'Carbone', num: 6, weight: 12.011, config: '[He] 2s² 2p²', electronegativity: 2.55, categoryFR: 'Non-métal réactif', categoryEN: 'Reactive Nonmetal', color: '#475569' },
  'N': { nameEN: 'Nitrogen', nameFR: 'Azote', num: 7, weight: 14.007, config: '[He] 2s² 2p³', electronegativity: 3.04, categoryFR: 'Non-métal réactif', categoryEN: 'Reactive Nonmetal', color: '#3b82f6' },
  'O': { nameEN: 'Oxygen', nameFR: 'Oxygène', num: 8, weight: 15.999, config: '[He] 2s² 2p⁴', electronegativity: 3.44, categoryFR: 'Non-métal réactif', categoryEN: 'Reactive Nonmetal', color: '#ef4444' },
  'F': { nameEN: 'Fluorine', nameFR: 'Fluor', num: 9, weight: 18.998, config: '[He] 2s² 2p⁵', electronegativity: 3.98, categoryFR: 'Halogène', categoryEN: 'Halogen', color: '#06b6d4' },
  'NE': { nameEN: 'Neon', nameFR: 'Néon', num: 10, weight: 20.180, config: '[He] 2s² 2p⁶', electronegativity: 0, categoryFR: 'Gaz noble', categoryEN: 'Noble Gas', color: '#f472b6' },
  'NA': { nameEN: 'Sodium', nameFR: 'Sodium', num: 11, weight: 22.990, config: '[Ne] 3s¹', electronegativity: 0.93, categoryFR: 'Métal alcalin', categoryEN: 'Alkali Metal', color: '#10b981' },
  'MG': { nameEN: 'Magnesium', nameFR: 'Magnésium', num: 12, weight: 24.305, config: '[Ne] 3s²', electronegativity: 1.31, categoryFR: 'Métal alcalino-terreux', categoryEN: 'Alkaline Earth Metal', color: '#047857' },
  'AL': { nameEN: 'Aluminium', nameFR: 'Aluminium', num: 13, weight: 26.982, config: '[Ne] 3s² 3p¹', electronegativity: 1.61, categoryFR: 'Métal de pauvre transition', categoryEN: 'Post-Transition Metal', color: '#94a3b8' },
  'SI': { nameEN: 'Silicon', nameFR: 'Silicium', num: 14, weight: 28.085, config: '[Ne] 3s² 3p²', electronegativity: 1.90, categoryFR: 'Métalloïde', categoryEN: 'Metalloid', color: '#e2e8f0' },
  'P': { nameEN: 'Phosphorus', nameFR: 'Phosphore', num: 15, weight: 30.974, config: '[Ne] 3s² 3p³', electronegativity: 2.19, categoryFR: 'Non-métal réactif', categoryEN: 'Reactive Nonmetal', color: '#f97316' },
  'S': { nameEN: 'Sulfur', nameFR: 'Soufre', num: 16, weight: 32.06, config: '[Ne] 3s² 3p⁴', electronegativity: 2.58, categoryFR: 'Non-métal réactif', categoryEN: 'Reactive Nonmetal', color: '#eab308' },
  'CL': { nameEN: 'Chlorine', nameFR: 'Chlore', num: 17, weight: 35.45, config: '[Ne] 3s² 3p⁵', electronegativity: 3.16, categoryFR: 'Halogène', categoryEN: 'Halogen', color: '#84cc16' },
  'K': { nameEN: 'Potassium', nameFR: 'Potassium', num: 19, weight: 39.098, config: '[Ar] 4s¹', electronegativity: 0.82, categoryFR: 'Métal alcalin', categoryEN: 'Alkali Metal', color: '#8b5cf6' },
  'CA': { nameEN: 'Calcium', nameFR: 'Calcium', num: 20, weight: 40.078, config: '[Ar] 4s²', electronegativity: 1.00, categoryFR: 'Métal alcalino-terreux', categoryEN: 'Alkaline Earth Metal', color: '#64748b' },
  'FE': { nameEN: 'Iron', nameFR: 'Fer', num: 26, weight: 55.845, config: '[Ar] 3d⁶ 4s²', electronegativity: 1.83, categoryFR: 'Métal de transition', categoryEN: 'Transition Metal', color: '#b45309' },
  'CU': { nameEN: 'Copper', nameFR: 'Cuivre', num: 29, weight: 63.546, config: '[Ar] 3d¹⁰ 4s¹', electronegativity: 1.90, categoryFR: 'Métal de transition', categoryEN: 'Transition Metal', color: '#ea580c' },
  'ZN': { nameEN: 'Zinc', nameFR: 'Zinc', num: 30, weight: 65.38, config: '[Ar] 3d¹⁰ 4s²', electronegativity: 1.65, categoryFR: 'Métal de transition', categoryEN: 'Transition Metal', color: '#4f46e5' },
  'BR': { nameEN: 'Bromine', nameFR: 'Brome', num: 35, weight: 79.904, config: '[Ar] 3d¹⁰ 4s² 4p⁵', electronegativity: 2.96, categoryFR: 'Halogène', categoryEN: 'Halogen', color: '#9a3412' },
  'I': { nameEN: 'Iodine', nameFR: 'Iode', num: 53, weight: 126.90, config: '[Kr] 4d¹⁰ 5s² 5p⁵', electronegativity: 2.66, categoryFR: 'Halogène', categoryEN: 'Halogen', color: '#6b21a8' }
};

const decodeBase64 = (str: string): any => {
  try {
    if (typeof window !== 'undefined') {
      return JSON.parse(decodeURIComponent(window.atob(str).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')));
    } else {
      return JSON.parse(Buffer.from(str, 'base64').toString('utf-8'));
    }
  } catch (e) {
    console.error("Failed to decode base64:", e);
    return null;
  }
};

const centerCoordinates = (atoms: Atom[]): Atom[] => {
  if (atoms.length === 0) return atoms;
  
  let sumX = 0, sumY = 0, sumZ = 0;
  atoms.forEach(a => {
    sumX += a.x;
    sumY += a.y;
    sumZ += a.z;
  });
  const avgX = sumX / atoms.length;
  const avgY = sumY / atoms.length;
  const avgZ = sumZ / atoms.length;
  
  let maxDist = 0;
  const shifted = atoms.map(a => {
    const x = a.x - avgX;
    const y = a.y - avgY;
    const z = a.z - avgZ;
    const dist = Math.sqrt(x*x + y*y + z*z);
    if (dist > maxDist) maxDist = dist;
    return { ...a, x, y, z };
  });
  
  if (maxDist === 0) return shifted;
  const targetScale = 1.35;
  const scaleFactor = targetScale / maxDist;
  
  return shifted.map(a => ({
    ...a,
    x: a.x * scaleFactor,
    y: a.y * scaleFactor,
    z: a.z * scaleFactor
  }));
};

const parseSDF = (sdfString: string): { atoms: Atom[]; bonds: Bond[] } | null => {
  try {
    const lines = sdfString.split('\n');
    if (lines.length < 4) return null;
    
    const countsLine = lines[3];
    const numAtoms = parseInt(countsLine.substring(0, 3).trim(), 10);
    const numBonds = parseInt(countsLine.substring(3, 6).trim(), 10);
    
    if (isNaN(numAtoms) || numAtoms <= 0) return null;
    
    const atoms: Atom[] = [];
    const bonds: Bond[] = [];
    
    const elementProps: Record<string, { color: string; radius: number }> = {
      'H': { color: '#f8fafc', radius: 10 },
      'C': { color: '#475569', radius: 15 },
      'O': { color: '#ef4444', radius: 18 },
      'N': { color: '#3b82f6', radius: 15 },
      'CL': { color: '#84cc16', radius: 19 },
      'NA': { color: '#10b981', radius: 10 },
      'S': { color: '#eab308', radius: 17 },
      'P': { color: '#f97316', radius: 17 },
      'F': { color: '#06b6d4', radius: 12 },
      'BR': { color: '#9a3412', radius: 19 },
      'I': { color: '#6b21a8', radius: 21 },
      'K': { color: '#8b5cf6', radius: 18 },
      'CA': { color: '#64748b', radius: 20 },
      'FE': { color: '#b45309', radius: 20 },
      'MG': { color: '#047857', radius: 17 }
    };
    
    for (let i = 0; i < numAtoms; i++) {
      const line = lines[4 + i];
      if (!line) continue;
      
      const x = parseFloat(line.substring(0, 10).trim());
      const y = parseFloat(line.substring(10, 20).trim());
      const z = parseFloat(line.substring(20, 30).trim());
      const label = line.substring(31, 34).trim();
      
      if (isNaN(x) || isNaN(y) || isNaN(z) || !label) continue;
      
      const lookupLabel = label.toUpperCase();
      const props = elementProps[lookupLabel] || { color: '#a855f7', radius: 14 };
      
      atoms.push({
        x,
        y,
        z,
        color: props.color,
        radius: props.radius,
        label
      });
    }
    
    for (let i = 0; i < numBonds; i++) {
      const line = lines[4 + numAtoms + i];
      if (!line) continue;
      
      const atomAIdx = parseInt(line.substring(0, 3).trim(), 10) - 1;
      const atomBIdx = parseInt(line.substring(3, 6).trim(), 10) - 1;
      const bondType = parseInt(line.substring(6, 9).trim(), 10);
      
      if (isNaN(atomAIdx) || isNaN(atomBIdx) || atomAIdx < 0 || atomBIdx < 0) continue;
      
      bonds.push({
        atomA: atomAIdx,
        atomB: atomBIdx,
        isDouble: bondType === 2
      });
    }
    
    if (bonds.length === 0) {
      for (let i = 0; i < atoms.length; i++) {
        for (let j = i + 1; j < atoms.length; j++) {
          const a1 = atoms[i];
          const a2 = atoms[j];
          const dist = Math.sqrt(
            (a1.x - a2.x) ** 2 + 
            (a1.y - a2.y) ** 2 + 
            (a1.z - a2.z) ** 2
          );
          
          if (dist > 0.4 && dist < 1.95) {
            bonds.push({ atomA: i, atomB: j });
          }
        }
      }
    }
    
    return { atoms, bonds };
  } catch (e) {
    console.error("Failed to parse SDF format:", e);
    return null;
  }
};

const parseXYZ = (xyzString: string): { atoms: Atom[]; bonds: Bond[] } | null => {
  try {
    const lines = xyzString.trim().split('\n').map(line => line.trim()).filter(line => line.length > 0);
    if (lines.length < 3) return null;
    
    const atoms: Atom[] = [];
    const bonds: Bond[] = [];
    
    const elementProps: Record<string, { color: string; radius: number }> = {
      'H': { color: '#f8fafc', radius: 10 },
      'C': { color: '#475569', radius: 15 },
      'O': { color: '#ef4444', radius: 18 },
      'N': { color: '#3b82f6', radius: 15 },
      'CL': { color: '#84cc16', radius: 19 },
      'NA': { color: '#10b981', radius: 10 },
      'S': { color: '#eab308', radius: 17 },
      'P': { color: '#f97316', radius: 17 },
      'F': { color: '#06b6d4', radius: 12 },
      'BR': { color: '#9a3412', radius: 19 },
      'I': { color: '#6b21a8', radius: 21 },
      'K': { color: '#8b5cf6', radius: 18 },
      'CA': { color: '#64748b', radius: 20 },
      'FE': { color: '#b45309', radius: 20 },
      'MG': { color: '#047857', radius: 17 }
    };

    for (let i = 2; i < lines.length; i++) {
      const parts = lines[i].split(/\s+/);
      if (parts.length < 4) continue;
      
      const label = parts[0];
      const x = parseFloat(parts[1]);
      const y = parseFloat(parts[2]);
      const z = parseFloat(parts[3]);
      
      if (isNaN(x) || isNaN(y) || isNaN(z)) continue;
      
      const lookupLabel = label.toUpperCase();
      const props = elementProps[lookupLabel] || { color: '#a855f7', radius: 14 };
      
      atoms.push({
        x,
        y,
        z,
        color: props.color,
        radius: props.radius,
        label
      });
    }

    for (let i = 0; i < atoms.length; i++) {
      for (let j = i + 1; j < atoms.length; j++) {
        const a1 = atoms[i];
        const a2 = atoms[j];
        const dist = Math.sqrt(
          (a1.x - a2.x) ** 2 + 
          (a1.y - a2.y) ** 2 + 
          (a1.z - a2.z) ** 2
        );
        
        if (dist > 0.4 && dist < 1.95) {
          bonds.push({ atomA: i, atomB: j });
        }
      }
    }
    
    return { atoms, bonds };
  } catch (e) {
    console.error("Failed to parse XYZ format:", e);
    return null;
  }
};

export const StructureViewer3D = ({
  presetId = "h2o",
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
  const t = (STATIC_UI_STRINGS[language.toUpperCase() as keyof typeof STATIC_UI_STRINGS] || STATIC_UI_STRINGS.EN) as any;

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [activePreset, setActivePreset] = useState<Preset>(() => {
    const found = PRESETS.find(p => p.id === presetId) || PRESETS[0];
    
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
      if (!builtInIds.includes(presetId) && presetId !== 'custom') {
        setIsLoading(true);
        setErrorMsg(null);
        
        fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(presetId)}/record/SDF/?record_type=3d`)
          .then(res => {
            if (!res.ok) throw new Error(`Molécule "${presetId}" introuvable ou indisponible en 3D sur PubChem.`);
            return res.text();
          })
          .then(sdfText => {
            const parsed = parseSDF(sdfText);
            if (parsed && parsed.atoms.length > 0) {
              const centeredAtoms = centerCoordinates(parsed.atoms);
              setActivePreset({
                name: name || presetId.charAt(0).toUpperCase() + presetId.slice(1),
                id: presetId,
                description: description || `Modèle moléculaire de ${presetId} chargé automatiquement en temps réel via la base de données PubChem.`,
                atoms: centeredAtoms,
                bonds: parsed.bonds
              });
              setSelectedAtomIndex(null);
            } else {
              throw new Error("Impossible de lire les coordonnées tridimensionnelles de cette molécule.");
            }
          })
          .catch(err => {
            console.error("[PubChem fetch failure]:", err);
            setErrorMsg(err.message || "Erreur de connexion à la base de données PubChem.");
          })
          .finally(() => {
            setIsLoading(false);
          });
      } else {
        const found = PRESETS.find(p => p.id === presetId);
        if (found) {
          setActivePreset(found);
          setSelectedAtomIndex(null);
        }
      }
    }
  }, [presetId, name, description, atoms, bonds, atomsBase64, bondsBase64]);

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

      // Depth projection helper
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

      // Cache projected coordinates for click handler
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

      // Project bonds
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

      // Draw loop
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

          // Specular highlights
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

          // Highlight selected atom with an outer halo ring
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

  const darkenColor = (hex: string, percent: number) => {
    const num = parseInt(hex.replace("#",""), 16),
          amt = Math.round(2.55 * percent),
          R = (num >> 16) - amt,
          G = (num >> 8 & 0x00FF) - amt,
          B = (num & 0x0000FF) - amt;
    return "#" + (0x1000000 + (R<0?0:R>255?255:R)*0x10000 + (G<0?0:G>255?255:G)*0x100 + (B<0?0:B>255?255:B)).toString(16).slice(1);
  };

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

    // Detect Click (negligible dragging)
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

  // Determine if we should show the preset selection list
  const isCustomOrSpecific = presetId !== "h2o" || atomsBase64 !== undefined || atoms !== undefined;
  const shouldShowPresetsMenu = showMenu !== undefined ? showMenu : !isCustomOrSpecific;

  const selectedAtom = selectedAtomIndex !== null ? activePreset.atoms[selectedAtomIndex] : null;
  const cleanedLabel = selectedAtom ? selectedAtom.label.replace(/[⁺⁻\d]/g, '') : '';
  const selectedElement = selectedAtom ? ELEMENT_DETAILS[cleanedLabel] : null;

  return (
    <div className="my-8 rounded-3xl overflow-hidden border border-slate-800/80 bg-slate-950/40 backdrop-blur-xl shadow-2xl p-6 sm:p-8">
      {/* Molecule Details Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-850/80 pb-5 mb-5">
        <div>
          <h4 className="text-sm font-black text-slate-100 uppercase tracking-widest flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{t["Interactive 3D Structure Viewer"]}</span>
          </h4>
          <p className="text-[11px] text-slate-400 font-semibold mt-1">
            {t["Drag to rotate molecule. Scroll/slider to zoom. Click an atom to inspect properties."]}
          </p>
        </div>

        {/* Preset pill list */}
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
      </div>

      {/* Main interactive viewport container */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
        
        {/* Canvas Render Panel (3 cols) */}
        <div className="lg:col-span-3 relative h-[340px] rounded-2xl border border-slate-850 bg-slate-950 overflow-hidden group select-none">
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
                  // fallback to PRESETS[0] (water)
                  setActivePreset(PRESETS[0]);
                  setSelectedAtomIndex(null);
                }}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-xs font-black text-slate-300 uppercase rounded-xl transition-all cursor-pointer"
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
        <div className="lg:col-span-1 flex flex-col justify-between bg-slate-900/30 border border-slate-850 rounded-2xl p-5 space-y-4">
          
          {selectedAtom && selectedElement ? (
            /* Premium Atom Inspector Panel */
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

              <div className="flex items-center gap-3 bg-slate-950/40 border border-slate-850 p-3 rounded-xl">
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

              <div className="space-y-1.5 border-t border-slate-850/80 pt-3">
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
            /* Default Compound description card */
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

          <div className="pt-4 border-t border-slate-850/80 space-y-2">
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
