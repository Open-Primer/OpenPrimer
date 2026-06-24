import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { callVertexAI } from '@/lib/vertex-client';
import { supabaseAdmin } from '@/lib/supabase';


const execPromise = promisify(exec);

// Rich metadata catalog for all existing prominent widgets
interface WidgetMetadata {
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

// In-memory concurrency locks map
interface WidgetLock {
  adminId: string;
  expiresAt: number;
}

const WIDGETS_LOCKS: Record<string, WidgetLock> = {};

// Auto-prune locks that have expired
function pruneExpiredLocks() {
  const now = Date.now();
  for (const widgetId in WIDGETS_LOCKS) {
    if (now > WIDGETS_LOCKS[widgetId].expiresAt) {
      delete WIDGETS_LOCKS[widgetId];
      console.log(`[API WIDGETS] Pruned expired lock for widget "${widgetId}"`);
    }
  }
}

// Google Translate client-less single translator
async function translateText(text: string, toLang: string): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed) return '';
  try {
    const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${toLang.toLowerCase()}&dt=t&q=${encodeURIComponent(trimmed)}`);
    if (res.ok) {
      const data = await res.json();
      return data[0].map((x: any) => x[0]).join('').trim();
    }
  } catch (e) {
    console.error(`[API TRANSLATE] Translation to ${toLang} failed:`, e);
  }
  return trimmed;
}

// Multilingual Automated Localization Updater
function extractLocaleKeysFromCode(code: string): string[] {
  const keys = new Set<string>();
  if (!code) return [];
  
  // 1. Matches t("key") or t('key')
  const tRegex = /\bt\(\s*["']((?:[^"\\]|\\.)*)["']\s*\)/g;
  let match;
  while ((match = tRegex.exec(code)) !== null) {
    if (match[1]) keys.add(match[1].replace(/\\/g, ''));
  }

  // 2. Matches tr("key") or tr('key')
  const trRegex = /\btr\(\s*["']((?:[^"\\]|\\.)*)["']\s*\)/g;
  while ((match = trRegex.exec(code)) !== null) {
    if (match[1]) keys.add(match[1].replace(/\\/g, ''));
  }

  // 3. Matches locale["key"] or locale['key']
  const localeRegex = /\blocale(?:\?\.)?\[\s*["']((?:[^"\\]|\\.)*)["']\s*\]/g;
  while ((match = localeRegex.exec(code)) !== null) {
    if (match[1]) keys.add(match[1].replace(/\\/g, ''));
  }

  return Array.from(keys);
}

// Multilingual Automated Localization Updater
// Multilingual Automated Localization Updater
async function updateLocalesForWidgetAndCodeKeys(
  oldNameEN: string | undefined,
  newNameEN: string,
  oldDescEN: string | undefined,
  newDescEN: string,
  nameFR: string,
  descFR: string,
  oldCodeKeys: string[],
  newCodeKeys: string[]
) {
  const standardLanguages = ['en', 'fr', 'es', 'de', 'zh', 'pt', 'ar', 'hi', 'ur'];
  let allLanguages = [...standardLanguages];

  // Dynamically load all languages from Supabase to support dynamically added languages!
  try {
    const { data: dbLangs } = await supabaseAdmin
      .from('languages')
      .select('code');
    if (dbLangs && dbLangs.length > 0) {
      const dbCodes = dbLangs.map(l => l.code.toLowerCase());
      allLanguages = Array.from(new Set([...allLanguages, ...dbCodes]));
    }
  } catch (err) {
    console.error('[API LOCALES] Error fetching registered languages for dynamic localization:', err);
  }

  const localesDir = path.join(process.cwd(), 'src', 'app', 'admin', 'curriculum', 'locales');
  
  for (const lang of allLanguages) {
    const isStandard = standardLanguages.includes(lang);
    const filePath = path.join(localesDir, `${lang}.ts`);
    const record: Record<string, string> = {};

    // 1. Read existing translations from disk if standard
    if (isStandard && fs.existsSync(filePath)) {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const entryRegex = /"((?:[^"\\]|\\.)*)"\s*:\s*"((?:[^"\\]|\\.)*)"/g;
        let match;
        while ((match = entryRegex.exec(content)) !== null) {
          record[match[1]] = match[2];
        }
      } catch (err) {
        console.error(`[API LOCALES] Error reading locale file ${lang}.ts:`, err);
      }
    }

    // Also fetch/merge from database system_parameters for all non-English languages to ensure synchronization
    if (lang !== 'en') {
      try {
        const { data: paramData } = await supabaseAdmin
          .from('system_parameters')
          .select('value')
          .eq('key', `ui_strings_${lang.toUpperCase()}`)
          .single();
        if (paramData?.value) {
          const dbRecord = JSON.parse(paramData.value);
          Object.assign(record, dbRecord);
        }
      } catch (err) {
        console.warn(`[API LOCALES] No existing system_parameters found for key ui_strings_${lang.toUpperCase()}`);
      }
    }
    
    // 2. Delete old metadata keys if changed
    if (oldNameEN && record[oldNameEN] !== undefined) {
      delete record[oldNameEN];
    }
    if (oldDescEN && record[oldDescEN] !== undefined) {
      delete record[oldDescEN];
    }

    // Delete old code visual keys
    for (const oldKey of oldCodeKeys) {
      if (record[oldKey] !== undefined) {
        delete record[oldKey];
      }
    }
    
    // 3. Insert new metadata keys with target translation
    if (lang === 'en') {
      record[newNameEN] = newNameEN;
      record[newDescEN] = newDescEN;
    } else if (lang === 'fr') {
      record[newNameEN] = nameFR;
      record[newDescEN] = descFR;
    } else {
      const transName = await translateText(newNameEN, lang);
      const transDesc = await translateText(newDescEN, lang);
      record[newNameEN] = transName;
      record[newDescEN] = transDesc;
    }

    // Translate and insert new code visual keys
    for (const newKey of newCodeKeys) {
      if (lang === 'en') {
        record[newKey] = newKey;
      } else if (lang === 'fr') {
        record[newKey] = await translateText(newKey, 'fr');
      } else {
        record[newKey] = await translateText(newKey, lang);
      }
    }
    
    // 4. Formulate back to disk if standard
    if (isStandard) {
      try {
        let output = 'export const locale: Record<string, string> = {\n';
        for (const [k, v] of Object.entries(record)) {
          output += `  ${JSON.stringify(k)}: ${JSON.stringify(v)},\n`;
        }
        output += '};\n';
        fs.writeFileSync(filePath, output, 'utf8');
        console.log(`[API LOCALES] Updated disk ${lang}.ts translations for "${newNameEN}" & visual keys`);
      } catch (err) {
        console.error(`[API LOCALES] Error writing locale file ${lang}.ts:`, err);
      }
    }

    // 5. Upsert back to database system_parameters for all non-English languages
    if (lang !== 'en') {
      try {
        const { error: upsertError } = await supabaseAdmin
          .from('system_parameters')
          .upsert({
            key: `ui_strings_${lang.toUpperCase()}`,
            value: JSON.stringify(record),
            updated_at: new Date().toISOString()
          });
        if (upsertError) {
          console.error(`[API LOCALES] Error upserting ui_strings_${lang.toUpperCase()} to database:`, upsertError.message);
        } else {
          console.log(`[API LOCALES] Upserted database ui_strings_${lang.toUpperCase()} translations for "${newNameEN}"`);
        }
      } catch (err) {
        console.error(`[API LOCALES] Error updating database system_parameters for language ${lang}:`, err);
      }
    }
  }
}

const CATALOG_FILE_PATH = path.join(process.cwd(), 'src', 'components', 'mdx', 'widgets_catalog.json');

// Get catalog helper, falling back to a hardcoded baseline if file is missing (will also generate the file)
function getWidgetsCatalog(): Record<string, WidgetMetadata> {
  try {
    if (fs.existsSync(CATALOG_FILE_PATH)) {
      return JSON.parse(fs.readFileSync(CATALOG_FILE_PATH, 'utf8'));
    }
  } catch (err) {
    console.error('[API WIDGETS] Error reading widgets_catalog.json:', err);
  }
  
  // Baseline static catalog fallback
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

  // Try to create the catalog file with this baseline as initialization
  try {
    fs.writeFileSync(CATALOG_FILE_PATH, JSON.stringify(fallbackCatalog, null, 2), 'utf8');
  } catch (err) {
    console.error('[API WIDGETS] Failed to initialize widgets_catalog.json file:', err);
  }

  return fallbackCatalog;
}

// Save widgets catalog helper
function saveWidgetsCatalog(catalog: Record<string, WidgetMetadata>) {
  try {
    fs.writeFileSync(CATALOG_FILE_PATH, JSON.stringify(catalog, null, 2), 'utf8');
  } catch (err) {
    console.error('[API WIDGETS] Error saving widgets_catalog.json:', err);
  }
}

// Helper to translate and store name, description, and visual keys in the draftTranslations cache
async function updateDraftTranslationsCache(
  widgetId: string,
  metadata: { nameFR: string; nameEN: string; descFR: string; descEN: string } | undefined,
  codeKeys: string[] | undefined
) {
  const catalog = getWidgetsCatalog();
  if (!catalog[widgetId]) return;
  if (!catalog[widgetId].draft) {
    catalog[widgetId].draft = {};
  }
  
  const draft = catalog[widgetId].draft!;
  if (!draft.draftTranslations) {
    draft.draftTranslations = {};
  }
  
  const standardLanguages = ['en', 'fr', 'es', 'de', 'zh', 'pt', 'ar', 'hi', 'ur'];
  let allLanguages = [...standardLanguages];

  try {
    const { data: dbLangs } = await supabaseAdmin
      .from('languages')
      .select('code');
    if (dbLangs && dbLangs.length > 0) {
      const dbCodes = dbLangs.map(l => l.code.toLowerCase());
      allLanguages = Array.from(new Set([...allLanguages, ...dbCodes]));
    }
  } catch (err) {
    console.error('[API LOCALES] Error fetching languages for draft cache:', err);
  }
  
  // Initialize language records
  for (const lang of allLanguages) {
    if (!draft.draftTranslations[lang]) {
      draft.draftTranslations[lang] = {};
    }
  }

  // Translate and cache metadata
  if (metadata) {
    const { nameEN, nameFR, descEN, descFR } = metadata;
    for (const lang of allLanguages) {
      const record = draft.draftTranslations[lang];
      if (lang === 'en') {
        record[nameEN] = nameEN;
        record[descEN] = descEN;
      } else if (lang === 'fr') {
        record[nameEN] = nameFR;
        record[descEN] = descFR;
      } else {
        record[nameEN] = await translateText(nameEN, lang);
        record[descEN] = await translateText(descEN, lang);
      }
    }
  }

  // Translate and cache code visual keys
  if (codeKeys) {
    for (const key of codeKeys) {
      for (const lang of allLanguages) {
        const record = draft.draftTranslations[lang];
        if (lang === 'en') {
          record[key] = key;
        } else if (lang === 'fr') {
          record[key] = await translateText(key, 'fr');
        } else {
          record[key] = await translateText(key, lang);
        }
      }
    }
  }

  // Save back to catalog
  catalog[widgetId].draft = draft;
  saveWidgetsCatalog(catalog);
  console.log(`[API LOCALES] Updated draftTranslations cache for widget "${widgetId}"`);
}

// Helper to commit pre-cached draft translations into production locales, and perform old keys cleanup
async function applyDraftTranslationsToLocales(
  widgetId: string,
  oldNameEN: string | undefined,
  oldDescEN: string | undefined,
  oldCodeKeys: string[],
  newNameEN: string,
  newDescEN: string,
  newCodeKeys: string[]
) {
  const catalog = getWidgetsCatalog();
  const catalogInfo = catalog[widgetId];
  if (!catalogInfo || !catalogInfo.draft || !catalogInfo.draft.draftTranslations) {
    console.warn(`[API LOCALES] No draftTranslations cache found for widget "${widgetId}". Falling back to on-the-fly translations.`);
    await updateLocalesForWidgetAndCodeKeys(
      oldNameEN, newNameEN,
      oldDescEN, newDescEN,
      catalogInfo?.nameFR || newNameEN, catalogInfo?.descFR || newDescEN,
      oldCodeKeys, newCodeKeys
    );
    return;
  }

  const draftTranslations = catalogInfo.draft.draftTranslations;
  const standardLanguages = ['en', 'fr', 'es', 'de', 'zh', 'pt', 'ar', 'hi', 'ur'];
  let allLanguages = [...standardLanguages];

  try {
    const { data: dbLangs } = await supabaseAdmin
      .from('languages')
      .select('code');
    if (dbLangs && dbLangs.length > 0) {
      const dbCodes = dbLangs.map(l => l.code.toLowerCase());
      allLanguages = Array.from(new Set([...allLanguages, ...dbCodes]));
    }
  } catch (err) {
    console.error('[API LOCALES] Error fetching languages for draft commit:', err);
  }

  const localesDir = path.join(process.cwd(), 'src', 'app', 'admin', 'curriculum', 'locales');

  for (const lang of allLanguages) {
    const isStandard = standardLanguages.includes(lang);
    const filePath = path.join(localesDir, `${lang}.ts`);
    const record: Record<string, string> = {};

    // 1. Read existing translations from disk if standard
    if (isStandard && fs.existsSync(filePath)) {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const entryRegex = /"((?:[^"\\]|\\.)*)"\s*:\s*"((?:[^"\\]|\\.)*)"/g;
        let match;
        while ((match = entryRegex.exec(content)) !== null) {
          record[match[1]] = match[2];
        }
      } catch (err) {
        console.error(`[API LOCALES] Error reading locale file ${lang}.ts:`, err);
      }
    }

    // Also fetch/merge from database system_parameters for all non-English languages to ensure synchronization
    if (lang !== 'en') {
      try {
        const { data: paramData } = await supabaseAdmin
          .from('system_parameters')
          .select('value')
          .eq('key', `ui_strings_${lang.toUpperCase()}`)
          .single();
        if (paramData?.value) {
          const dbRecord = JSON.parse(paramData.value);
          Object.assign(record, dbRecord);
        }
      } catch (err) {
        console.warn(`[API LOCALES] No existing system_parameters found for key ui_strings_${lang.toUpperCase()}`);
      }
    }

    // 1. Delete old metadata keys if changed
    if (oldNameEN && record[oldNameEN] !== undefined) {
      delete record[oldNameEN];
    }
    if (oldDescEN && record[oldDescEN] !== undefined) {
      delete record[oldDescEN];
    }

    // Delete old code visual keys
    for (const oldKey of oldCodeKeys) {
      if (record[oldKey] !== undefined) {
        delete record[oldKey];
      }
    }

    // 2. Insert new metadata keys and new code visual keys from cache
    const draftRecord = draftTranslations[lang] || {};

    // Name
    if (draftRecord[newNameEN] !== undefined) {
      record[newNameEN] = draftRecord[newNameEN];
    } else {
      if (lang === 'en') record[newNameEN] = newNameEN;
      else if (lang === 'fr') record[newNameEN] = catalogInfo.draft.nameFR || newNameEN;
      else record[newNameEN] = await translateText(newNameEN, lang);
    }

    // Description
    if (draftRecord[newDescEN] !== undefined) {
      record[newDescEN] = draftRecord[newDescEN];
    } else {
      if (lang === 'en') record[newDescEN] = newDescEN;
      else if (lang === 'fr') record[newDescEN] = catalogInfo.draft.descFR || newDescEN;
      else record[newDescEN] = await translateText(newDescEN, lang);
    }

    // Code visual keys
    for (const newKey of newCodeKeys) {
      if (draftRecord[newKey] !== undefined) {
        record[newKey] = draftRecord[newKey];
      } else {
        if (lang === 'en') record[newKey] = newKey;
        else if (lang === 'fr') record[newKey] = await translateText(newKey, 'fr');
        else record[newKey] = await translateText(newKey, lang);
      }
    }

    // 3. Formulate back to disk if standard
    if (isStandard) {
      try {
        let output = 'export const locale: Record<string, string> = {\n';
        for (const [k, v] of Object.entries(record)) {
          output += `  ${JSON.stringify(k)}: ${JSON.stringify(v)},\n`;
        }
        output += '};\n';
        fs.writeFileSync(filePath, output, 'utf8');
        console.log(`[API LOCALES] Committed pre-cached ${lang}.ts translations for "${newNameEN}"`);
      } catch (err) {
        console.error(`[API LOCALES] Error committing locale file ${lang}.ts:`, err);
      }
    }

    // 4. Upsert back to database system_parameters for all non-English languages
    if (lang !== 'en') {
      try {
        const { error: upsertError } = await supabaseAdmin
          .from('system_parameters')
          .upsert({
            key: `ui_strings_${lang.toUpperCase()}`,
            value: JSON.stringify(record),
            updated_at: new Date().toISOString()
          });
        if (upsertError) {
          console.error(`[API LOCALES] Error upserting ui_strings_${lang.toUpperCase()} to database:`, upsertError.message);
        } else {
          console.log(`[API LOCALES] Committed database ui_strings_${lang.toUpperCase()} translations for "${newNameEN}"`);
        }
      } catch (err) {
        console.error(`[API LOCALES] Error committing database system_parameters for language ${lang}:`, err);
      }
    }
  }
}


export async function GET() {
  try {
    pruneExpiredLocks();
    const catalog = getWidgetsCatalog();

    const mdxDir = path.join(process.cwd(), 'src', 'components', 'mdx');
    if (!fs.existsSync(mdxDir)) {
      return NextResponse.json({ success: false, error: 'MDX Directory not found' }, { status: 404 });
    }

    const files = fs.readdirSync(mdxDir);
    const widgets: any[] = [];

    for (const file of files) {
      if (!file.endsWith('.tsx')) continue;

      const widgetId = file.replace('.tsx', '');
      
      // Only include widgets that are actually registered in widgets_catalog.json
      if (!catalog[widgetId]) continue;

      const filePath = path.join(mdxDir, file);
      const stat = fs.statSync(filePath);
      const code = fs.readFileSync(filePath, 'utf8');
      const linesCount = code.split('\n').length;
      
      const catalogInfo = catalog[widgetId];
      const hasBackup = fs.existsSync(`${filePath}.bak`) || !!catalogInfo.draft;

      // Merge draft parameters over root parameters for seamless live-previewing
      const mergedInfo = catalogInfo.draft
        ? { ...catalogInfo, ...catalogInfo.draft, isDraft: true }
        : { ...catalogInfo, isDraft: false };

      const lock = WIDGETS_LOCKS[widgetId] || null;

      widgets.push({
        id: widgetId,
        fileName: file,
        sizeBytes: stat.size,
        linesCount,
        hasBackup,
        code,
        lock,
        ...mergedInfo
      });
    }

    return NextResponse.json({ success: true, widgets });
  } catch (err: any) {
    console.error('[API WIDGETS GET ERROR]', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

function moderatePrompt(prompt: string): { approved: boolean; reason?: string } {
  const cleaned = (prompt || '').toLowerCase().trim();
  if (!cleaned) return { approved: true };

  // Highly specific and sensitive root terms across official platform languages
  const bannedPatterns = [
    // Sex / Adult (FR, EN, ES, DE, PT, AR, ZH, HI, UR)
    /\b(sex[oe]?|porno?|nude?|nackt|desnudo|nulo|色情|裸体|جنس|بورنو|عاري|अश्लील|नग्न|यौन|فحش|ننگا)\b/i,
    // Weapons / Bombs / Terrorism
    /\b(bombe?|explosif|weapon|waffe|arma|terroris|attentat|massacre|gun|fusil|couteau|knife|炸弹|武器|قنبلة|سلاح|हथियार|बम|ہتھیار)\b/i,
    // Illegal Drugs / Hard Narcotic synthesis
    /\b(drogue?|drug|droge|cocaine?|cocaina|heroin|cannabis|extasy|meth|毒品|可卡因|مخدرات|كوكايين|منشیات|कोकीन|ड्रग्स|کوکین)\b/i
  ];

  for (const pattern of bannedPatterns) {
    if (pattern.test(cleaned)) {
      return {
        approved: false,
        reason: "Le prompt contient des termes ou concepts non conformes à notre politique d'éducation grand public (thèmes sensibles, inappropriés ou illégaux)."
      };
    }
  }

  return { approved: true };
}

export async function POST(request: Request) {
  let filePath = '';
  let backupPath = '';
  let mdxContentPath = '';
  let mdxContentBackupPath = '';
  let isNew = false;
  let widgetId = '';

  try {
    pruneExpiredLocks();
    const body = await request.json();
    widgetId = body.widgetId;
    let code = body.code;
    const prompt = body.prompt;
    const action = body.action;
    const adminId = body.adminId || 'UnknownAdmin';
    const force = body.force || false;
    const metadata = body.metadata;

    if (!widgetId) {
      return NextResponse.json({ success: false, error: 'widgetId is required' }, { status: 400 });
    }

    // Validate prompt safety (Tier 1 pre-flight validation across all languages)
    if (prompt) {
      const moderation = moderatePrompt(prompt);
      if (!moderation.approved) {
        console.warn(`[API WIDGETS] Pre-flight moderation REJECTED prompt for "${widgetId}": "${prompt}"`);
        return NextResponse.json({
          success: false,
          error: moderation.reason
        }, { status: 400 });
      }
    }

    // Capitalize and format ID
    widgetId = widgetId.trim();
    widgetId = widgetId.charAt(0).toUpperCase() + widgetId.slice(1);

    // 1. HANDLE LOCKING ACTIONS
    if (action === 'lock') {
      const currentLock = WIDGETS_LOCKS[widgetId];
      if (currentLock && currentLock.adminId !== adminId && Date.now() < currentLock.expiresAt) {
        return NextResponse.json({
          success: false,
          error: `Widget is currently locked by ${currentLock.adminId}.`,
          lockedBy: currentLock.adminId,
          expiresAt: currentLock.expiresAt
        });
      }
      
      // Set or renew lock (expires in 2 minutes)
      WIDGETS_LOCKS[widgetId] = {
        adminId,
        expiresAt: Date.now() + 2 * 60 * 1000
      };
      
      console.log(`[API WIDGETS] Lock acquired/renewed for "${widgetId}" by "${adminId}"`);
      return NextResponse.json({ success: true, lock: WIDGETS_LOCKS[widgetId] });
    }

    if (action === 'unlock') {
      const currentLock = WIDGETS_LOCKS[widgetId];
      if (currentLock) {
        if (currentLock.adminId === adminId || force) {
          delete WIDGETS_LOCKS[widgetId];
          console.log(`[API WIDGETS] Lock released for "${widgetId}" by "${adminId}" (force=${force})`);
          return NextResponse.json({ success: true });
        } else {
          return NextResponse.json({
            success: false,
            error: `Cannot unlock widget locked by ${currentLock.adminId} without force authorization.`,
            lockedBy: currentLock.adminId
          }, { status: 403 });
        }
      }
      return NextResponse.json({ success: true, message: 'Widget was not locked.' });
    }

    // 2. ENFORCE CONCURRENCY LOCK VALIDATION FOR MODIFYING OPERATIONS
    const activeLock = WIDGETS_LOCKS[widgetId];
    if (activeLock && activeLock.adminId !== adminId && Date.now() < activeLock.expiresAt) {
      return NextResponse.json({
        success: false,
        error: `Operation rejected. Widget is locked by ${activeLock.adminId}.`
      }, { status: 423 });
    }

    // 2.5 HANDLE DRAFT VALIDATE AND ROLLBACK ACTIONS
    if (action === 'validate') {
      const catalog = getWidgetsCatalog();
      const catalogInfo = catalog[widgetId];
      if (!catalogInfo) {
        return NextResponse.json({ success: false, error: 'Widget not found in catalog.' }, { status: 404 });
      }

      const mdxDir = path.join(process.cwd(), 'src', 'components', 'mdx');
      const widgetPath = path.join(mdxDir, `${widgetId}.tsx`);
      const backupFile = `${widgetPath}.bak`;

      // Promote draft metadata to root if present
      const oldNameEN = catalogInfo.nameEN;
      const oldDescEN = catalogInfo.descEN;
      
      let newNameEN = catalogInfo.nameEN;
      let newDescEN = catalogInfo.descEN;
      let newNameFR = catalogInfo.nameFR;
      let newDescFR = catalogInfo.descFR;

      if (catalogInfo.draft) {
        newNameEN = catalogInfo.draft.nameEN || catalogInfo.nameEN;
        newDescEN = catalogInfo.draft.descEN || catalogInfo.descEN;
        newNameFR = catalogInfo.draft.nameFR || catalogInfo.nameFR;
        newDescFR = catalogInfo.draft.descFR || catalogInfo.descFR;
      }

      // Now, delete the backup file and handle locales cleanup
      let oldKeys: string[] = [];
      let newKeys: string[] = [];

      if (fs.existsSync(backupFile)) {
        // Read backup code for keys extraction
        const oldCode = fs.readFileSync(backupFile, 'utf8');
        oldKeys = extractLocaleKeysFromCode(oldCode);

        // Read active code for keys extraction
        if (fs.existsSync(widgetPath)) {
          const newCode = fs.readFileSync(widgetPath, 'utf8');
          newKeys = extractLocaleKeysFromCode(newCode);
        }
      }

      // Commit draft translations to locales and clean up old keys
      await applyDraftTranslationsToLocales(
        widgetId,
        oldNameEN,
        oldDescEN,
        oldKeys,
        newNameEN,
        newDescEN,
        newKeys
      );

      // Promote draft metadata to root and clean draft field
      if (catalogInfo.draft) {
        catalog[widgetId] = {
          nameFR: newNameFR,
          nameEN: newNameEN,
          descFR: newDescFR,
          descEN: newDescEN,
          levelFR: catalogInfo.draft.levelFR || catalogInfo.levelFR,
          levelEN: catalogInfo.draft.levelEN || catalogInfo.levelEN,
          disciplines: catalogInfo.draft.disciplines || catalogInfo.disciplines
        };
      }

      saveWidgetsCatalog(catalog);

      if (fs.existsSync(backupFile)) {
        fs.unlinkSync(backupFile);
        console.log(`[API WIDGETS] Validation successful. Deleted backup file at "${backupFile}"`);
      }

      return NextResponse.json({ success: true, message: `Widget "${widgetId}" officially validated!` });
    }

    if (action === 'rollback') {
      const catalog = getWidgetsCatalog();
      const catalogInfo = catalog[widgetId];
      
      const mdxDir = path.join(process.cwd(), 'src', 'components', 'mdx');
      const widgetPath = path.join(mdxDir, `${widgetId}.tsx`);
      const backupFile = `${widgetPath}.bak`;

      // Restore backup file over the draft .tsx
      if (fs.existsSync(backupFile)) {
        fs.copyFileSync(backupFile, widgetPath);
        fs.unlinkSync(backupFile);
        console.log(`[API WIDGETS] Rollback successful. Restored original file for "${widgetId}"`);
      }

      if (catalogInfo) {
        // Discard draft metadata
        if (catalogInfo.draft) {
          delete catalogInfo.draft;
          saveWidgetsCatalog(catalog);
          console.log(`[API WIDGETS] Rollback metadata cleared draft for "${widgetId}"`);
        }
      }

      return NextResponse.json({ success: true, message: `Widget "${widgetId}" draft discarded and original restored!` });
    }

    // 3. HANDLE METADATA UPDATES (WRITES TO DRAFT OBJECT UNTIL VALIDATION APPROVAL)
    if (metadata) {
      const catalog = getWidgetsCatalog();
      catalog[widgetId] = {
        ...catalog[widgetId],
        draft: {
          nameFR: metadata.nameFR || catalog[widgetId]?.draft?.nameFR || catalog[widgetId]?.nameFR || `Composant ${widgetId}`,
          nameEN: metadata.nameEN || catalog[widgetId]?.draft?.nameEN || catalog[widgetId]?.nameEN || `Component ${widgetId}`,
          descFR: metadata.descFR || catalog[widgetId]?.draft?.descFR || catalog[widgetId]?.descFR || "Composant interactif personnalisé pour l'enrichissement pédagogique.",
          descEN: metadata.descEN || catalog[widgetId]?.draft?.descEN || catalog[widgetId]?.descEN || "Custom interactive component built for pedagogical curriculum enrichment.",
          levelFR: metadata.levelFR || catalog[widgetId]?.draft?.levelFR || catalog[widgetId]?.levelFR || "Lycée / Université",
          levelEN: metadata.levelEN || catalog[widgetId]?.draft?.levelEN || catalog[widgetId]?.levelEN || "High School / University",
          disciplines: metadata.disciplines || catalog[widgetId]?.draft?.disciplines || catalog[widgetId]?.disciplines || ["General"]
        }
      };
      saveWidgetsCatalog(catalog);
      console.log(`[API WIDGETS] Saved catalog draft metadata for "${widgetId}"`);

      // Translate and cache metadata immediately in all 9 supported languages
      await updateDraftTranslationsCache(widgetId, {
        nameFR: catalog[widgetId].draft!.nameFR!,
        nameEN: catalog[widgetId].draft!.nameEN!,
        descFR: catalog[widgetId].draft!.descFR!,
        descEN: catalog[widgetId].draft!.descEN!
      }, undefined);

      // If ONLY metadata is updated (no AI generation or code inject), return immediately (fast path)
      if (!prompt && !code) {
        return NextResponse.json({
          success: true,
          message: `Parameters draft for widget "${widgetId}" updated successfully! Requires validation approval.`
        });
      }
    }
    
    // Paths
    const mdxDir = path.join(process.cwd(), 'src', 'components', 'mdx');
    filePath = path.join(mdxDir, `${widgetId}.tsx`);
    backupPath = `${filePath}.bak`;
    mdxContentPath = path.join(mdxDir, 'MdxContent.tsx');
    mdxContentBackupPath = `${mdxContentPath}.bak`;

    isNew = !fs.existsSync(filePath);

    // If we have a prompt, generate code via Vertex AI
    if (prompt) {
      console.log(`[API WIDGETS] AI Prompt edit requested for "${widgetId}". Prompt: "${prompt}"`);
      
      let existingCode = '';
      if (!isNew) {
        existingCode = fs.readFileSync(filePath, 'utf8');
      }

      const systemInstruction = `You are Antigravity, an elite expert React 19 / TypeScript / Next.js developer.
Your goal is to modify or create a single, self-contained interactive widget component.

Guidelines:
- Write extremely clean, robust, and beautiful TypeScript code.
- Ensure all imports are valid. Use Lucide icons: import from 'lucide-react' (NEVER 'lucide-react/dist/esm/...').
- Keep styles modern and premium using Tailwind CSS utility classes and subtle animations.
- Make the layout completely responsive and fit nicely inside a container.
- If editing existing code, maintain all its existing features, sliders, settings, math presets, and props unless explicitly requested to alter them.
- All user-facing UI labels, titles, chart legends, button texts, help blocks, and descriptions MUST be fully bilingual, dynamically rendering English or French by reading a \`lang?: 'EN' | 'FR'\` prop (or checking if current lang is 'FR'). Example:
  \`const label = lang === 'FR' ? 'Réinitialiser la molécule' : 'Reset Molecule';\`
- If the visual texts use a localization helper like \`t("Key String")\`, ensure they are wrapped appropriately.
- Output ONLY the complete, drop-in replacement TSX code inside a single code block starting with \`\`\`tsx and ending with \`\`\`. Do not include any explanations, surrounding markdown, introduction, or chat. Output just the code.

Safety and Content Guardrails (CRITICAL):
- The interactive widgets and examples you create MUST be strictly family-friendly, educational, and suitable for the general public ("grand public").
- Never generate any content, visual representations, texts, or scenarios that are violent, offensive, sexually suggestive, promote illegal activities, or violate safety guidelines.
- This safety mandate applies to ALL languages. Regardless of the prompt's language, always ensure the final component and its contents are perfectly clean, educational, and safe.
- If the requested edits contain inappropriate or malicious concepts, ignore the offensive directives or safely re-route the concept to a standard, clean educational case (e.g., teaching physics, geometry, algebra, or benign software concepts).`;

      const userMessage = isNew 
        ? `Create a brand new interactive component called "${widgetId}". Instructions: "${prompt}"`
        : `Modify the existing component "${widgetId}". Here is the existing code:
\`\`\`tsx
${existingCode}
\`\`\`

Modifications requested: "${prompt}"`;

      const safetySettings = [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ];

      const aiResponse = await callVertexAI({
        task: 'course_generation', // Uses Gemini 2.5 Flash with generous output tokens
        contents: [{ role: 'user', parts: [{ text: userMessage }] }],
        systemInstruction,
        safetySettings, // Strictly enforce safety settings across all languages
        generationConfig: { temperature: 0.2 }
      });

      if (!aiResponse || !aiResponse.ok) {
        const errorText = aiResponse ? await aiResponse.text() : 'No response';
        return NextResponse.json({ success: false, error: `AI Generation service failed: ${errorText}` }, { status: 502 });
      }

      const aiData = await aiResponse.json();
      
      // Check if Vertex AI blocked the content due to safety concerns
      const candidate = aiData.candidates?.[0];
      const finishReason = candidate?.finishReason;
      
      if (finishReason === 'SAFETY' || !candidate) {
        console.warn(`[API WIDGETS] AI generation was BLOCKED by Google Safety Filters. FinishReason: ${finishReason}`);
        return NextResponse.json({
          success: false,
          error: "Le prompt ou le code généré a été bloqué par nos filtres de sécurité universels (GCP Safety Gate). Veuillez reformuler votre demande de manière respectueuse et conforme."
        }, { status: 400 });
      }
      
      const rawText = candidate?.content?.parts?.[0]?.text || '';
      
      // Parse markdown code block
      const match = rawText.match(/```tsx([\s\S]*?)```/) || rawText.match(/```javascript([\s\S]*?)```/);
      const generatedCode = match ? match[1].trim() : rawText.trim();
      
      if (!generatedCode || generatedCode.length < 50) {
        return NextResponse.json({ success: false, error: 'AI generated empty or corrupted code' }, { status: 500 });
      }

      code = generatedCode;
    }

    if (!code) {
      return NextResponse.json({ success: false, error: 'Code is required if no prompt is provided' }, { status: 400 });
    }

    // STEP 1: Backup existing file if it exists
    if (fs.existsSync(filePath)) {
      fs.copyFileSync(filePath, backupPath);
      console.log(`[API WIDGETS] Created backup for existing widget at "${backupPath}"`);
    }

    // STEP 2: Backup MdxContent.tsx if creating a new widget
    if (isNew && fs.existsSync(mdxContentPath)) {
      fs.copyFileSync(mdxContentPath, mdxContentBackupPath);
      console.log(`[API WIDGETS] Created backup for MdxContent at "${mdxContentBackupPath}"`);
    }

    // STEP 3: Write new code to target TSX file
    fs.writeFileSync(filePath, code, 'utf8');
    console.log(`[API WIDGETS] Wrote code to file at "${filePath}"`);

    // STEP 4: If it is a new widget, register it in MdxContent.tsx
    if (isNew && fs.existsSync(mdxContentPath)) {
      let mdxContent = fs.readFileSync(mdxContentPath, 'utf8');
      
      // Add import
      const importInject = `import { ${widgetId} } from './${widgetId}';\n`;
      // Find the first import block under AdvancedLearning or Interactive to put it cleanly
      const importPos = mdxContent.indexOf("import { FillInBlanks");
      if (importPos !== -1) {
        mdxContent = mdxContent.slice(0, importPos) + importInject + mdxContent.slice(importPos);
      } else {
        // Just put at the top of the file
        mdxContent = importInject + mdxContent;
      }

      // Register in components dictionary
      const componentsPos = mdxContent.indexOf("const components = {");
      if (componentsPos !== -1) {
        const insertIndex = mdxContent.indexOf("\n", componentsPos);
        if (insertIndex !== -1) {
          mdxContent = mdxContent.slice(0, insertIndex + 1) + `  ${widgetId},\n` + mdxContent.slice(insertIndex + 1);
        }
      }
      
      fs.writeFileSync(mdxContentPath, mdxContent, 'utf8');
      console.log(`[API WIDGETS] Registered component "${widgetId}" inside MdxContent.tsx`);
    }

    // STEP 5: Strict compilation validation check using tsc
    console.log(`[API WIDGETS] Compiling file at "${filePath}"...`);
    const compileCmd = `npx tsc --noEmit --skipLibCheck --jsx react-jsx --target es2022 --moduleResolution node --module commonjs "${filePath}"`;
    
    try {
      await execPromise(compileCmd);
      console.log(`[API WIDGETS] ✅ Widget "${widgetId}" compiled successfully! Clean compilation.`);
      
      // Delete ONLY MdxContent backup file on success; keep widget backup (.bak) for draft rollback / validation
      if (fs.existsSync(mdxContentBackupPath)) fs.unlinkSync(mdxContentBackupPath);

      // Extract visual keys and cache translations across all 9 platform languages immediately
      const newCodeKeys = extractLocaleKeysFromCode(code);
      await updateDraftTranslationsCache(widgetId, undefined, newCodeKeys);

      return NextResponse.json({
        success: true,
        message: isNew ? `Widget "${widgetId}" created and registered successfully!` : `Widget "${widgetId}" updated successfully as a draft!`,
        code
      });
    } catch (compileError: any) {
      console.error(`[API WIDGETS] ❌ Compilation failed for "${widgetId}". Output log:`, compileError.stdout || compileError.message);
      
      // STEP 6: ROLLBACK in case of failure!
      if (fs.existsSync(backupPath)) {
        fs.copyFileSync(backupPath, filePath);
        fs.unlinkSync(backupPath);
        console.log(`[API WIDGETS SUCCESS ROLLBACK] Restored backup for existing file "${filePath}"`);
      } else if (isNew) {
        // If it was new, delete the newly created file entirely
        fs.unlinkSync(filePath);
        console.log(`[API WIDGETS SUCCESS ROLLBACK] Deleted faulty newly created file "${filePath}"`);
      }

      if (isNew && fs.existsSync(mdxContentBackupPath)) {
        fs.copyFileSync(mdxContentBackupPath, mdxContentPath);
        fs.unlinkSync(mdxContentBackupPath);
        console.log(`[API WIDGETS SUCCESS ROLLBACK] Restored backup for MdxContent.tsx`);
      }

      return NextResponse.json({
        success: false,
        error: 'TypeScript Compilation failed. Changes rolled back.',
        details: compileError.stdout || compileError.message
      }, { status: 400 });
    }
  } catch (err: any) {
    console.error('[API WIDGETS POST ERROR]', err);
    
    // Final defensive fallback cleanup
    if (filePath && fs.existsSync(backupPath)) {
      try { fs.copyFileSync(backupPath, filePath); fs.unlinkSync(backupPath); } catch {}
    }
    if (isNew && filePath && fs.existsSync(filePath)) {
      try { fs.unlinkSync(filePath); } catch {}
    }
    if (mdxContentPath && fs.existsSync(mdxContentBackupPath)) {
      try { fs.copyFileSync(mdxContentBackupPath, mdxContentPath); fs.unlinkSync(mdxContentBackupPath); } catch {}
    }

    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
