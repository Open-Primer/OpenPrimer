export interface Atom {
  x: number;
  y: number;
  z: number;
  color: string;
  radius: number;
  label: string;
}

export interface Bond {
  atomA: number;
  atomB: number;
  isDouble?: boolean;
}

export interface Preset {
  name: string;
  id: string;
  description: string;
  atoms: Atom[];
  bonds: Bond[];
}

export interface StructureViewer3DProps {
  presetId?: string;
  id?: string;
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

export const STRUCTURE_VIEWER_STRINGS: Record<string, {
  searchPlaceholder: string;
  loadBtn: string;
  notFound: (query: string) => string;
  loadedDesc: (query: string) => string;
  parseError: string;
  loadError: string;
}> = {
  EN: {
    searchPlaceholder: "Search (e.g. caffeine, aspirin, C60...)",
    loadBtn: "Load",
    notFound: (q) => `Molecule "${q}" not found or unavailable in 3D on PubChem.`,
    loadedDesc: (q) => `Molecular model of ${q} automatically loaded in real-time via the PubChem database.`,
    parseError: "Unable to parse 3D coordinates for this molecule.",
    loadError: "Error loading molecule."
  },
  FR: {
    searchPlaceholder: "Rechercher (ex: caféine, aspirine, C60...)",
    loadBtn: "Charger",
    notFound: (q) => `Molécule "${q}" introuvable ou indisponible en 3D sur PubChem.`,
    loadedDesc: (q) => `Modèle moléculaire de ${q} chargé automatiquement en temps réel via la base de données PubChem.`,
    parseError: "Impossible de lire les coordonnées tridimensionnelles de cette molécule.",
    loadError: "Erreur lors du chargement de la molécule."
  },
  ES: {
    searchPlaceholder: "Buscar (ej: cafeína, aspirina, C60...)",
    loadBtn: "Cargar",
    notFound: (q) => `Molécula "${q}" no encontrada o no disponible en 3D en PubChem.`,
    loadedDesc: (q) => `Modelo molecular de ${q} cargado automáticamente en tiempo real a través de la base de datos PubChem.`,
    parseError: "No se pueden leer las coordenadas 3D de esta molécula.",
    loadError: "Error al cargar la molécula."
  },
  DE: {
    searchPlaceholder: "Suchen (z.B. Koffein, Aspirin, C60...)",
    loadBtn: "Laden",
    notFound: (q) => `Molekül "${q}" auf PubChem nicht gefunden oder nicht in 3D verfügbar.`,
    loadedDesc: (q) => `Molekülmodell von ${q} in Echtzeit über die PubChem-Datenbank geladen.`,
    parseError: "3D-Koordinaten für dieses Molekül konnten nicht gelesen werden.",
    loadError: "Fehler beim Laden des Moleküls."
  },
  ZH: {
    searchPlaceholder: "搜索（如：caffeine, aspirin, C60...）",
    loadBtn: "加载",
    notFound: (q) => `在 PubChem 上未找到分子 "${q}" 或无 3D 模型。`,
    loadedDesc: (q) => `通过 PubChem 数据库实时自动加载的 ${q} 分子模型。`,
    parseError: "无法解析该分子的三维坐标。",
    loadError: "加载分子时出错。"
  },
  PT: {
    searchPlaceholder: "Pesquisar (ex: cafeína, aspirina, C60...)",
    loadBtn: "Carregar",
    notFound: (q) => `Molécula "${q}" não encontrada ou indisponível em 3D no PubChem.`,
    loadedDesc: (q) => `Modelo molecular de ${q} carregado automaticamente em tempo real via banco de dados PubChem.`,
    parseError: "Não foi possível ler as coordenadas 3D desta molécula.",
    loadError: "Erro ao carregar a molécula."
  },
  AR: {
    searchPlaceholder: "بحث (مثل: caffeine, aspirin, C60...)",
    loadBtn: "تحميل",
    notFound: (q) => `الجزيء "${q}" غير موجود أو غير متوفر بشكل ثلاثي الأبعاد على PubChem.`,
    loadedDesc: (q) => `النموذج الجزيئي لـ ${q} تم تحميله تلقائياً عبر قاعدة بيانات PubChem.`,
    parseError: "تعذر قراءة الإحداثيات ثلاثية الأبعاد لهذا الجزيء.",
    loadError: "خطأ أثناء تحميل الجزيء."
  },
  HI: {
    searchPlaceholder: "खोजें (उदा: caffeine, aspirin, C60...)",
    loadBtn: "लोड करें",
    notFound: (q) => `PubChem पर अणु "${q}" नहीं मिला या 3D में उपलब्ध नहीं है।`,
    loadedDesc: (q) => `PubChem डेटाबेस के माध्यम से ${q} का आणविक मॉडल वास्तविक समय में लोड किया गया।`,
    parseError: "इस अणु के 3D निर्देशांक पढ़ने में असमर्थ।",
    loadError: "अणु लोड करने में त्रुटि।"
  },
  UR: {
    searchPlaceholder: "تلاش کریں (مثلاً: caffeine, aspirin, C60...)",
    loadBtn: "لوڈ کریں",
    notFound: (q) => `مالیکیول "${q}" PubChem پر نہیں ملا یا 3D میں دستیاب نہیں ہے۔`,
    loadedDesc: (q) => `PubChem ڈیٹا بیس کے ذریعے ${q} کا مالیکیولر ماڈل ریئل ٹائم میں لوڈ کیا گیا۔`,
    parseError: "اس مالیکیول کے 3D کوآرڈینیٹس پڑھنے سے قاصر۔",
    loadError: "مالیکیول لوڈ کرنے میں خرابی۔"
  }
};

export const generateNaCl = (): { atoms: Atom[]; bonds: Bond[] } => {
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
          color: isNa ? '#10b981' : '#3b82f6',
          radius: isNa ? 10 : 15,
          label: isNa ? 'Na⁺' : 'Cl⁻'
        });
      }
    }
  }

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

export const generateGraphene = (): { atoms: Atom[]; bonds: Bond[] } => {
  const atoms: Atom[] = [];
  const bonds: Bond[] = [];
  const scale = 0.45;
  const rows = 4;
  const cols = 5;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; cols > c; c++) {
      const x = (c * 1.5) - (cols * 0.75);
      const y = (r * Math.sqrt(3) + (c % 2 === 0 ? 0 : Math.sqrt(3) / 2)) - (rows * Math.sqrt(3) * 0.5);
      const z = Math.sin(x * 1.5) * Math.cos(y * 1.5) * 0.25;

      atoms.push({
        x: x * scale,
        y: y * scale,
        z: z * scale,
        color: '#64748b',
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

export const PRESETS: Preset[] = [
  {
    name: "Water (H₂O)",
    id: "h2o",
    description: "Polar molecule showing a bent molecular geometry with an angle of 104.5°.",
    atoms: [
      { x: 0, y: -0.15, z: 0, color: '#ef4444', radius: 18, label: 'O' },
      { x: 0.85, y: 0.60, z: 0, color: '#f8fafc', radius: 10, label: 'H' },
      { x: -0.85, y: 0.60, z: 0, color: '#f8fafc', radius: 10, label: 'H' }
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
      { x: 0, y: 0, z: 0, color: '#475569', radius: 15, label: 'C' },
      { x: 1.2, y: 0, z: 0, color: '#ef4444', radius: 18, label: 'O' },
      { x: -1.2, y: 0, z: 0, color: '#ef4444', radius: 18, label: 'O' }
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
      { x: 0, y: 0, z: 0, color: '#475569', radius: 15, label: 'C' },
      { x: 0, y: 1.1, z: 0, color: '#f8fafc', radius: 10, label: 'H' },
      { x: 1.03, y: -0.36, z: 0, color: '#f8fafc', radius: 10, label: 'H' },
      { x: -0.51, y: -0.36, z: 0.89, color: '#f8fafc', radius: 10, label: 'H' },
      { x: -0.51, y: -0.36, z: -0.89, color: '#f8fafc', radius: 10, label: 'H' }
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
      { x: 0, y: -0.2, z: 0, color: '#475569', radius: 15, label: 'C' },
      { x: 0, y: 1.2, z: 0, color: '#84cc16', radius: 19, label: 'Cl' },
      { x: 1.03, y: -0.6, z: 0, color: '#f8fafc', radius: 10, label: 'H' },
      { x: -0.51, y: -0.6, z: 0.89, color: '#f8fafc', radius: 10, label: 'H' },
      { x: -0.51, y: -0.6, z: -0.89, color: '#f8fafc', radius: 10, label: 'H' }
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
      { x: -0.75, y: -0.1, z: 0, color: '#475569', radius: 15, label: 'C' },
      { x: 0.75, y: -0.1, z: 0, color: '#475569', radius: 15, label: 'C' },
      { x: 1.45, y: 1.1, z: 0, color: '#ef4444', radius: 18, label: 'O' },
      { x: 2.35, y: 0.9, z: 0, color: '#f8fafc', radius: 10, label: 'H' },
      { x: -1.15, y: -0.6, z: 0.89, color: '#f8fafc', radius: 10, label: 'H' },
      { x: -1.15, y: -0.6, z: -0.89, color: '#f8fafc', radius: 10, label: 'H' },
      { x: -1.15, y: 0.9, z: 0, color: '#f8fafc', radius: 10, label: 'H' },
      { x: 1.15, y: -0.6, z: 0.89, color: '#f8fafc', radius: 10, label: 'H' },
      { x: 1.15, y: -0.6, z: -0.89, color: '#f8fafc', radius: 10, label: 'H' }
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

export const ELEMENT_DETAILS: Record<string, {
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

export function getPresetName(preset: Preset, lang: string): string {
  if (!preset) return '';
  const k = (lang || 'en').toUpperCase();
  return (preset as any)[`name${k}`] || (preset as any).nameEN || preset.name || preset.id || '';
}

export function getPresetDesc(preset: Preset, lang: string): string {
  if (!preset) return '';
  const k = (lang || 'en').toUpperCase();
  return (preset as any)[`desc${k}`] || (preset as any).descEN || (preset as any).description || '';
}
