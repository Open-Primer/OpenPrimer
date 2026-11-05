import fs from 'fs';
import path from 'path';
import { cookies } from 'next/headers';
import { dbService } from '@/lib/db';
import { verifySession } from '@/lib/authHelper';

export async function checkAdminAuth(request: Request): Promise<boolean> {
  const isProd = process.env.NODE_ENV === 'production';
  console.log('[SECURITY DEBUG] Entering checkAdminAuth. NodeEnv:', process.env.NODE_ENV);

  // 1. Check if we should allow sandbox access (for development/testing)
  try {
    if (!isProd) {
      const cookieStore = await cookies();
      const allowSandbox = cookieStore.get('op_allow_sandbox')?.value;
      console.log('[SECURITY DEBUG] Cookie op_allow_sandbox:', allowSandbox);
      if (allowSandbox === 'true' || process.env.PLAYWRIGHT_TEST === 'true' || process.env.NEXT_PUBLIC_PLAYWRIGHT_TEST === 'true') {
        console.log('[SECURITY DEBUG] Sandbox/Test mode active. Bypassing admin authentication checks.');
        return true;
      }
    }
  } catch (err) {
    console.error('[SECURITY] Sandbox check error in checkAdminAuth:', err);
  }

  // 2. Try Authorization header verifySession first
  try {
    const authUser = await verifySession(request);
    console.log('[SECURITY DEBUG] verifySession returned user:', authUser ? { id: authUser.id, email: authUser.email } : 'null');
    if (authUser) {
      if (authUser.id === 'mock-offline-user-id') {
        if (!isProd) {
          console.log('[SECURITY DEBUG] Permitting mock offline developer user.');
          return true;
        }
      }
      const { data: profile } = await dbService.getUserProfile(authUser.id);
      console.log('[SECURITY DEBUG] getUserProfile result for verifySession user:', profile ? { id: profile?.id, role: profile?.role } : 'null');
      if (profile?.role === 'admin') {
        console.log('[SECURITY DEBUG] Access GRANTED via verifySession for admin user:', authUser.email);
        return true;
      }
    }
  } catch (err) {
    console.error('[SECURITY] verifySession error in checkAdminAuth:', err);
  }

  // 3. Try cookie op_user_id
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('op_user_id')?.value;
    console.log('[SECURITY DEBUG] Cookie op_user_id:', userId);
    if (userId) {
      const { data: profile } = await dbService.getUserProfile(userId);
      console.log('[SECURITY DEBUG] getUserProfile result for cookie user:', profile ? { id: profile?.id, role: profile?.role } : 'null');
      if (profile?.role === 'admin') {
        console.log('[SECURITY DEBUG] Access GRANTED via cookie op_user_id for admin user:', userId);
        return true;
      }
    }
  } catch (err) {
    console.error('[SECURITY] Cookie auth error in checkAdminAuth:', err);
  }

  // Fallback for development if database is not configured
  if (!isProd && (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project'))) {
    console.log('[SECURITY DEBUG] Database not configured, allowing offline development access.');
    return true;
  }

  console.warn('[SECURITY WARNING] Access DENIED in checkAdminAuth. No valid admin authorization found.');
  return false;
}

export interface WidgetMetadata {
  nameFR: string;
  nameEN: string;
  descFR: string;
  descEN: string;
  levelFR: string;
  levelEN: string;
  disciplines: string[];
  draft?: {
    nameFR?: string;
    nameEN?: string;
    descFR?: string;
    descEN?: string;
    levelFR?: string;
    levelEN?: string;
    disciplines?: string[];
    draftTranslations?: Record<string, Record<string, string>>;
  };
}

export interface WidgetLock {
  adminId: string;
  expiresAt: number;
}

export const WIDGETS_LOCKS: Record<string, WidgetLock> = {};

export function pruneExpiredLocks() {
  const now = Date.now();
  for (const widgetId in WIDGETS_LOCKS) {
    if (now > WIDGETS_LOCKS[widgetId].expiresAt) {
      delete WIDGETS_LOCKS[widgetId];
      console.log(`[API WIDGETS] Pruned expired lock for widget "${widgetId}"`);
    }
  }
}

export const CATALOG_FILE_PATH = fs.existsSync(path.join(process.cwd(), 'src', 'components', 'mdx', 'widgets_catalog.json'))
  ? path.join(process.cwd(), 'src', 'components', 'mdx', 'widgets_catalog.json')
  : path.join(process.cwd(), 'web', 'src', 'components', 'mdx', 'widgets_catalog.json');

export function getWidgetsCatalog(): Record<string, WidgetMetadata> {
  try {
    if (fs.existsSync(CATALOG_FILE_PATH)) {
      return JSON.parse(fs.readFileSync(CATALOG_FILE_PATH, 'utf8'));
    }
  } catch (err) {
    console.error('[API WIDGETS] Error reading widgets_catalog.json:', err);
  }
  
  const fallbackCatalog: Record<string, WidgetMetadata> = {
    StructureViewer3D: {
      nameFR: "Visualisateur 3D de structures moléculaires",
      nameEN: "3D Molecular Structure Viewer",
      descFR: "Représentation et manipulation en 3D interactive de réseaux cristallins et de molécules complexes.",
      descEN: "Interactive 3D representation and manipulation of molecular structures and crystal lattices.",
      levelFR: "Lycée / Université",
      levelEN: "High School / University",
      disciplines: ["Chemistry", "Physics"]
    },
    QuantumOrbitalExplorer: {
      nameFR: "Explorateur d'orbitales quantiques",
      nameEN: "Quantum Orbital Explorer",
      descFR: "Visualisation des fonctions d'onde et orbitales atomiques (s, p, d) avec phases de probabilités colorées.",
      descEN: "Wave function and atomic orbital (s, p, d) visualizer with colored probability phases.",
      levelFR: "Université (L3 / Master)",
      levelEN: "University (Junior / Master)",
      disciplines: ["Physics", "Chemistry"]
    },
    DynamicSimulation: {
      nameFR: "Simulateur de physique dynamique",
      nameEN: "Dynamic Physics Simulator",
      descFR: "Simulation d'expériences physiques interactives (ex: projectile, pendule) avec variables ajustables (gravité, amortissement).",
      descEN: "Interactive physical experiment simulator (e.g. projectile, pendulum) with adjustable friction and gravity parameters.",
      levelFR: "Collège / Lycée / Université",
      levelEN: "Middle School / High School / University",
      disciplines: ["Physics", "Mathematics"]
    },
    ChemicalStoichiometry: {
      nameFR: "Équilibre stœchiométrique chimique",
      nameEN: "Chemical Stoichiometry Balancer",
      descFR: "Atelier d'équilibrage de réactions chimiques et calcul de proportions des réactifs/produits.",
      descEN: "Interactive chemical equation balancer and reactant-product proportion calculator.",
      levelFR: "Collège / Lycée",
      levelEN: "Middle School / High School",
      disciplines: ["Chemistry"]
    },
    BasicMathExplorer: {
      nameFR: "Laboratoire de mathématiques de base",
      nameEN: "Basic Math Explorer",
      descFR: "Manipulateur visuel interactif pour comprendre les fractions, les ratios, et les opérations fondamentales.",
      descEN: "Interactive visual tool to master fractions, ratios, percentages, and elementary calculations.",
      levelFR: "Collège / Lycée",
      levelEN: "Middle School / High School",
      disciplines: ["Mathematics"]
    },
    FunctionPlotter: {
      nameFR: "Traceur de fonctions mathématiques 2D",
      nameEN: "2D Cartesian Function Plotter",
      descFR: "Outil graphique interactif permettant de tracer des équations mathématiques complexes en temps réel.",
      descEN: "Interactive Cartesian plotting tool to render complex mathematical functions and curves.",
      levelFR: "Lycée / Université",
      levelEN: "High School / University",
      disciplines: ["Mathematics", "Physics"]
    },
    ComparisonSlider: {
      nameFR: "Glisseur de comparaison visuelle",
      nameEN: "Visual Comparison Slider",
      descFR: "Comparateur d'images côte à côte avec séparateur interactif (idéal pour la biologie ou la géologie).",
      descEN: "Side-by-side image comparison with interactive slider handle, perfect for biology and earth sciences.",
      levelFR: "Tous niveaux",
      levelEN: "All levels",
      disciplines: ["Biology", "History", "Humanities / Letters"]
    },
    CodeSandbox: {
      nameFR: "Bac à sable de programmation JS",
      nameEN: "JavaScript Code Sandbox",
      descFR: "Éditeur de code léger avec console d'exécution JavaScript temps réel intégrée.",
      descEN: "Lightweight online coding workspace with reactive JavaScript runtime and terminal console.",
      levelFR: "Lycée / Université",
      levelEN: "High School / University",
      disciplines: ["Computer Science"]
    },
    DataChart: {
      nameFR: "Analyseur de données graphiques",
      nameEN: "Experimental Data Chart Analyzer",
      descFR: "Outil interactif de nuages de points et courbes de régression pour analyser des jeux de données réels.",
      descEN: "Plot experimental data points, adjust trends, and perform basic regression/correlation analysis.",
      levelFR: "Lycée / Université",
      levelEN: "High School / University",
      disciplines: ["Economics", "Physics", "Social Sciences"]
    },
    Mermaid: {
      nameFR: "Moteur de diagrammes Mermaid",
      nameEN: "Mermaid Diagram Engine",
      descFR: "Générateur dynamique de schémas, organigrammes et frises chronologiques à partir d'une syntaxe déclarative.",
      descEN: "Render rich flowcharts, timelines, and concept maps from descriptive text markup.",
      levelFR: "Tous niveaux",
      levelEN: "All levels",
      disciplines: ["All Disciplines"]
    },
    InteractiveDiagram: {
      nameFR: "Schéma anatomique interactif",
      nameEN: "Anatomical Interactive Diagram",
      descFR: "Schéma d'exploration de systèmes complexes avec fiches explicatives détaillées au survol (anatomie, géographie).",
      descEN: "Explore anatomy system or maps using visual hot-spots that display educational summary cards on hover.",
      levelFR: "Lycée / Université",
      levelEN: "High School / University",
      disciplines: ["Biology", "Medicine", "Social Sciences"]
    },
    FunctionManipulator: {
      nameFR: "Manipulateur de coefficients de fonction",
      nameEN: "Interactive Function Manipulator",
      descFR: "Ajustez les coefficients a, b, c et observez instantanément la déformation des courbes quadratiques/sinusoïdales.",
      descEN: "Vary sliders for parameters a, b, c to dynamically observe changes in mathematical curves.",
      levelFR: "Lycée / Université",
      levelEN: "High School / University",
      disciplines: ["Mathematics"]
    },
    EquationManipulator: {
      nameFR: "Résolveur pas à pas d'équations",
      nameEN: "Step-by-Step Equation Manipulator",
      descFR: "Visualiseur algébrique permettant de déplacer des termes d'une équation pour assimiler les règles de calcul.",
      descEN: "Drag and drop algebraic elements to learn algebraic balance rules visually.",
      levelFR: "Collège / Lycée / Université",
      levelEN: "Middle School / High School / University",
      disciplines: ["Mathematics", "Physics"]
    },
    Geometry2D: {
      nameFR: "Laboratoire de géométrie plane interactif",
      nameEN: "2D Interactive Geometry Canvas",
      descFR: "Dessinez et mesurez dynamiquement des angles, des lignes parallèles, des polygones et des triangles.",
      descEN: "Draw circles, compute angles, trace parallel lines, and manipulate dynamic polygons interactively.",
      levelFR: "Collège / Lycée",
      levelEN: "Middle School / High School",
      disciplines: ["Mathematics"]
    },
    GestaltInteractive: {
      nameFR: "Laboratoire de psychologie de la Gestalt",
      nameEN: "Gestalt Psychology Laboratory",
      descFR: "Expériences interactives pour explorer les illusions d'optique et les lois de perception de la Gestalt.",
      descEN: "Interactive visual illusions to demonstrate proximity, similarity, and closure laws.",
      levelFR: "Lycée / Université",
      levelEN: "High School / University",
      disciplines: ["Social Sciences", "Humanities / Letters"]
    }
  };

  try {
    fs.writeFileSync(CATALOG_FILE_PATH, JSON.stringify(fallbackCatalog, null, 2), 'utf8');
  } catch (err) {
    console.error('[API WIDGETS] Failed to initialize widgets_catalog.json file:', err);
  }

  return fallbackCatalog;
}

export function saveWidgetsCatalog(catalog: Record<string, WidgetMetadata>) {
  try {
    fs.writeFileSync(CATALOG_FILE_PATH, JSON.stringify(catalog, null, 2), 'utf8');
  } catch (err) {
    console.error('[API WIDGETS] Error saving widgets_catalog.json:', err);
  }
}
