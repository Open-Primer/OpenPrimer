import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { callVertexAI } from '@/lib/vertex-client';

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
}

const WIDGETS_CATALOG: Record<string, WidgetMetadata> = {
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

// Files to exclude from pedagogical widget inventory
const EXCLUDE_FILES = new Set([
  'MdxContent.tsx',
  'AdvancedLearning.tsx',
  'AudioPlayer.tsx',
  'Citation.tsx',
  'CriticalThinking.tsx',
  'DiagnosticQuiz.tsx',
  'DidYouKnow.tsx',
  'DivergingViews.tsx',
  'DynamicTableChart.tsx',
  'Epistemology.tsx',
  'EssayEvaluation.tsx',
  'Glossary.tsx',
  'GoingFurther.tsx',
  'HistoricalAnecdote.tsx',
  'HistoricalFact.tsx',
  'HistoricalPerson.tsx',
  'Interactive.tsx',
  'InteractiveExercises.tsx',
  'OpenQuestion.tsx',
  'PointOfView.tsx',
  'Prerequisites.tsx',
  'Quiz.tsx',
  'References.tsx',
  'ScientificDebate.tsx',
  'ScientificMethod.tsx',
  'Video.tsx',
  'WhatsNext.tsx',
  'Mermaid.tsx' // Handled by standard renderer
]);

export async function GET() {
  try {
    const mdxDir = path.join(process.cwd(), 'src', 'components', 'mdx');
    if (!fs.existsSync(mdxDir)) {
      return NextResponse.json({ success: false, error: 'MDX Directory not found' }, { status: 404 });
    }

    const files = fs.readdirSync(mdxDir);
    const widgets: any[] = [];

    for (const file of files) {
      if (!file.endsWith('.tsx') || EXCLUDE_FILES.has(file)) continue;

      const widgetId = file.replace('.tsx', '');
      const filePath = path.join(mdxDir, file);
      const stat = fs.statSync(filePath);
      const code = fs.readFileSync(filePath, 'utf8');
      const linesCount = code.split('\n').length;
      
      const hasBackup = fs.existsSync(`${filePath}.bak`);
      const catalogInfo = WIDGETS_CATALOG[widgetId] || {
        nameFR: `Composant ${widgetId}`,
        nameEN: `Component ${widgetId}`,
        descFR: "Composant interactif personnalisé pour l'enrichissement pédagogique.",
        descEN: "Custom interactive component built for pedagogical curriculum enrichment.",
        levelFR: "Lycée / Université",
        levelEN: "High School / University",
        disciplines: ["General"]
      };

      widgets.push({
        id: widgetId,
        fileName: file,
        sizeBytes: stat.size,
        linesCount,
        hasBackup,
        code,
        ...catalogInfo
      });
    }

    return NextResponse.json({ success: true, widgets });
  } catch (err: any) {
    console.error('[API WIDGETS GET ERROR]', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  let filePath = '';
  let backupPath = '';
  let mdxContentPath = '';
  let mdxContentBackupPath = '';
  let isNew = false;
  let widgetId = '';

  try {
    const body = await request.json();
    widgetId = body.widgetId;
    let code = body.code;
    const prompt = body.prompt;

    if (!widgetId) {
      return NextResponse.json({ success: false, error: 'widgetId is required' }, { status: 400 });
    }

    // Capitalize and format ID
    widgetId = widgetId.trim();
    widgetId = widgetId.charAt(0).toUpperCase() + widgetId.slice(1);
    
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
- Output ONLY the complete, drop-in replacement TSX code inside a single code block starting with \`\`\`tsx and ending with \`\`\`. Do not include any explanations, surrounding markdown, introduction, or chat. Output just the code.`;

      const userMessage = isNew 
        ? `Create a brand new interactive component called "${widgetId}". Instructions: "${prompt}"`
        : `Modify the existing component "${widgetId}". Here is the existing code:
\`\`\`tsx
${existingCode}
\`\`\`

Modifications requested: "${prompt}"`;

      const aiResponse = await callVertexAI({
        task: 'course_generation', // Uses Gemini 2.5 Flash with generous output tokens
        contents: [{ role: 'user', parts: [{ text: userMessage }] }],
        systemInstruction,
        generationConfig: { temperature: 0.2 }
      });

      if (!aiResponse || !aiResponse.ok) {
        const errorText = aiResponse ? await aiResponse.text() : 'No response';
        return NextResponse.json({ success: false, error: `AI Generation service failed: ${errorText}` }, { status: 502 });
      }

      const aiData = await aiResponse.json();
      const rawText = aiData.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
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
      
      // Delete backup files on success
      if (fs.existsSync(backupPath)) fs.unlinkSync(backupPath);
      if (fs.existsSync(mdxContentBackupPath)) fs.unlinkSync(mdxContentBackupPath);

      return NextResponse.json({
        success: true,
        message: isNew ? `Widget "${widgetId}" created and registered successfully!` : `Widget "${widgetId}" updated successfully!`,
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
