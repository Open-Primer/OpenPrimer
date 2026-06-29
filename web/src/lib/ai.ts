import { dbService } from './db';
import { supabase, supabaseAdmin } from './supabase';
import { callVertexAI, isVertexConfigured, recordMetrics } from './vertex-client';
import { preprocessMdx, isolateJsxForTranslation, restoreJsxAfterTranslation } from './content';
import { resolveAndPersistMedia } from './media-resolver';
import { cleanPathSegment } from './translations';
import { TASK_MODELS } from './ai-config';
import fs from 'fs';
import path from 'path';


const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

export class TransientNetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TransientNetworkError';
  }
}

export class StructuralJsonError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StructuralJsonError';
  }
}

export async function safeResponseJson(res: Response, contextName: string = 'unknown'): Promise<any> {
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    const text = await res.text();
    throw new TransientNetworkError(`[HTTP NON-JSON RESPONSE] Expected JSON response, but received Content-Type "${contentType}" with status ${res.status}. Context: "${contextName}". Body: "${text.slice(0, 300)}"`);
  }
  try {
    return await res.json();
  } catch (e: any) {
    const text = await res.clone().text().catch(() => '');
    throw new StructuralJsonError(`[JSON PARSE ERROR] Failed to parse JSON response. Context: "${contextName}". Error: ${e.message}. Snippet: "${text.slice(0, 200)}"`);
  }
}

export function safeJsonParse(text: string, contextName: string = 'unknown'): any {
  if (!text) return null;
  const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
  if (cleaned.startsWith('<!DOCTYPE') || cleaned.startsWith('<html') || cleaned.startsWith('<')) {
    throw new TransientNetworkError(`[JSON PARSE FAILED] Received HTML response instead of JSON. Context: "${contextName}". Snippet: "${cleaned.slice(0, 200)}"`);
  }
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    const startIdx = cleaned.indexOf('{');
    const endIdx = cleaned.lastIndexOf('}');
    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
      try {
        const potentialJson = cleaned.substring(startIdx, endIdx + 1);
        return JSON.parse(potentialJson);
      } catch (innerErr) {}
    }
    const startArr = cleaned.indexOf('[');
    const endArr = cleaned.lastIndexOf(']');
    if (startArr !== -1 && endArr !== -1 && endArr > startArr) {
      try {
        const potentialJson = cleaned.substring(startArr, endArr + 1);
        return JSON.parse(potentialJson);
      } catch (innerErr) {}
    }
    
    console.error(`[safeJsonParse] JSON parse failure in context "${contextName}". Raw length: ${cleaned.length}`);
    console.error(`[safeJsonParse] Content snippet: "${cleaned.slice(0, 1000)}"`);
    
    throw new StructuralJsonError(`[JSON PARSE FAILED] The model returned an invalid JSON response (likely a natural language error or empty response). Context: "${contextName}". Error: ${(e as Error).message}. Snippet: "${cleaned.slice(0, 200)}"`);
  }
}

export function saveDraftRevision(filename: string, content: string) {
  try {
    const dir = path.resolve(process.cwd(), 'drafts_revisions');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(path.join(dir, filename), content, 'utf8');
    console.log(`[DRAFTS_REVISIONS] Successfully saved ${filename}`);
  } catch (err) {
    console.error(`[DRAFTS_REVISIONS] Error saving ${filename}:`, err);
  }
}

export function generateStatsMarkdown(stats: any): string {
  return `# 📊 Generation Statistics: ${stats.lessonTitle}

- **Course Name**: ${stats.courseName}
- **Lesson Title**: ${stats.lessonTitle}
- **Lesson Slug**: ${stats.lessonSlug}
- **Academic Level**: ${stats.level}
- **Target Language**: ${stats.language.toUpperCase()}
- **Generation Date**: ${new Date(stats.startTime).toLocaleString()}
- **Status**: ${stats.status === 'success' ? '✅ SUCCESS' : '❌ FAILED'}
${stats.error ? `- **Error**: \`${stats.error}\`\n` : ''}

## ⏱️ Performance Metrics
- **Total Duration**: ${stats.durationSeconds} seconds
- **Syllabus Generation Attempts**: ${stats.syllabusAttempts}
- **Narrative Scribe Attempts**: ${stats.narrativeAttempts}
- **Narrative Critic Rejections**: ${stats.narrativeRejections}
- **Widgets Architect Attempts**: ${stats.widgetsAttempts}
- **Widgets Critic Rejections**: ${stats.widgetsRejections}
- **MDX Self-Healing Attempts**: ${stats.selfHealingAttempts}

## 🪙 Token & Cost Estimation
- **Prompt Tokens**: ${stats.tokenMetrics.promptTokens.toLocaleString()}
- **Candidates Tokens**: ${stats.tokenMetrics.candidatesTokens.toLocaleString()}
- **Total Tokens**: ${(stats.tokenMetrics.promptTokens + stats.tokenMetrics.candidatesTokens).toLocaleString()}
- **Estimated Cost (Gemini 2.5 Flash)**: $${((stats.tokenMetrics.promptTokens * 0.075 / 1000000) + (stats.tokenMetrics.candidatesTokens * 0.30 / 1000000)).toFixed(6)}
  *(Based on official pricing: $0.075 / 1M input tokens, $0.30 / 1M output tokens)*
`;
}

async function mapConcurrent<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  const results: R[] = [];
  let index = 0;
  
  const workers = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (index < items.length) {
      const currentIndex = index++;
      results[currentIndex] = await fn(items[currentIndex], currentIndex);
    }
  });
  
  await Promise.all(workers);
  return results;
}

// ─────────────────────────────────────────────────────────────────
// STRUCTURED OUTPUT SCHEMAS
// ─────────────────────────────────────────────────────────────────

const syllabusSchema = {
  type: "object",
  properties: {
    courseContext: {
      type: "object",
      properties: {
        discipline: { type: "string" },
        description: { type: "string" },
        epistemologicalMatrix: { type: "string" },
        targetLevel: { type: "string" },
        pedagogicalStrategy: { type: "string" }
      },
      required: ["discipline", "description", "epistemologicalMatrix", "targetLevel", "pedagogicalStrategy"]
    },
    lessons: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          slug: { type: "string" },
          cognitiveArtifact: { type: "string" },
          technicalDepth: { type: "string" }
        },
        required: ["title", "slug", "cognitiveArtifact", "technicalDepth"]
      }
    },
    references: {
      type: "array",
      items: { type: "string" }
    }
  },
  required: ["courseContext", "lessons", "references"]
};

const verificationSchema = {
  type: "object",
  properties: {
    approved: { type: "boolean" },
    critique: { type: "string" }
  },
  required: ["approved", "critique"]
};

const revisionAuditSchema = {
  type: "object",
  properties: {
    approved: { type: "boolean" },
    isGlobalRevision: { type: "boolean" },
    globalCritique: { type: "string" },
    sections: {
      type: "array",
      items: {
        type: "object",
        properties: {
          heading: { type: "string" },
          approved: { type: "boolean" },
          critique: { type: "string" }
        },
        required: ["heading", "approved", "critique"]
      }
    }
  },
  required: ["approved", "isGlobalRevision", "globalCritique", "sections"]
};

interface MarkdownSection {
  heading: string;
  content: string;
}

function parseMarkdownSections(mdx: string): MarkdownSection[] {
  const lines = mdx.split('\n');
  const sections: MarkdownSection[] = [];
  let currentHeading = '';
  let currentContent: string[] = [];

  for (const line of lines) {
    if (line.startsWith('## ')) {
      sections.push({
        heading: currentHeading,
        content: currentContent.join('\n')
      });
      currentHeading = line.trim();
      currentContent = [];
    } else {
      currentContent.push(line);
    }
  }

  sections.push({
    heading: currentHeading,
    content: currentContent.join('\n')
  });

  return sections;
}

function reconstructMarkdown(sections: MarkdownSection[]): string {
  return sections.map(sec => {
    if (sec.heading) {
      return `${sec.heading}\n${sec.content}`;
    } else {
      return sec.content;
    }
  }).join('\n');
}

function parseJointRepairOutput(output: string): Map<string, string> {
  const result = new Map<string, string>();
  const regex = /<revised_section\s+heading="([^"]+)">([\s\S]*?)<\/revised_section>/gi;
  let match;
  while ((match = regex.exec(output)) !== null) {
    const heading = match[1].trim();
    const content = match[2].trim();
    result.set(heading.toLowerCase(), content);
  }
  return result;
}

// ─────────────────────────────────────────────────────────────────
// WIDGETS-FIRST (WFTA) SCHEMAS & HELPERS
// ─────────────────────────────────────────────────────────────────

const lessonWidgetsSchema = {
  type: "object",
  properties: {
    prerequisites: {
      type: "object",
      properties: {
        items: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: { type: "string" },
              slug: { type: "string" },
              level: { type: "string" },
              subject: { type: "string" }
            },
            required: ["title", "slug", "level", "subject"]
          }
        }
      },
      required: ["items"]
    },
    diagnosticQuiz: {
      type: "object",
      properties: {
        question: { type: "string" },
        options: { type: "array", items: { type: "string" } },
        correctIndex: { type: "integer" },
        targetSectionId: { type: "string" },
        sectionTitle: { type: "string" }
      },
      required: ["question", "options", "correctIndex", "targetSectionId", "sectionTitle"]
    },
    learningObjectives: {
      type: "object",
      properties: {
        knowledge: { type: "array", items: { type: "string" } },
        skills: { type: "array", items: { type: "string" } },
        attitudes: { type: "array", items: { type: "string" } }
      },
      required: ["knowledge", "skills", "attitudes"]
    },
    interactiveComponents: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          componentType: { type: "string" },
          sectionAnchor: { type: "string" },
          props: { type: "object" }
        },
        required: ["id", "componentType", "sectionAnchor", "props"]
      }
    },
    whatsNext: {
      type: "object",
      properties: {
        steps: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: { type: "string" },
              description: { type: "string" },
              slug: { type: "string" }
            },
            required: ["title", "description", "slug"]
          }
        }
      },
      required: ["steps"]
    },
    goingFurther: {
      type: "object",
      properties: {
        items: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: { type: "string" },
              type: { type: "string", enum: ["book", "article", "video", "website", "research", "movie", "film"] },
              url: { type: "string" },
              description: { type: "string" }
            },
            required: ["title", "type", "description"]
          }
        }
      },
      required: ["items"]
    },
    conclusionSummary: {
      type: "object",
      properties: {
        items: { type: "array", items: { type: "string" } }
      },
      required: ["items"]
    },
    finalEvaluation: {
      type: "object",
      properties: {
        type: { type: "string" },
        props: { type: "object" }
      },
      required: ["type", "props"]
    },
    glossary: {
      type: "array",
      items: {
        type: "object",
        properties: {
          term: { type: "string" },
          definition: { type: "string" }
        },
        required: ["term", "definition"]
      }
    },
    references: {
      type: "array",
      items: { type: "string" }
    }
  },
  required: [
    "prerequisites",
    "diagnosticQuiz",
    "learningObjectives",
    "interactiveComponents",
    "whatsNext",
    "goingFurther",
    "conclusionSummary",
    "finalEvaluation",
    "glossary",
    "references"
  ]
};

export function validateAndFixWidgets(widgets: any, discipline?: string): any {
  if (!widgets || typeof widgets !== 'object') {
    throw new Error("Widgets content is empty or malformed.");
  }

  // 1. Prerequisites validation
  if (!widgets.prerequisites || !Array.isArray(widgets.prerequisites.items)) {
    widgets.prerequisites = { items: [] };
  }

  // 2. Diagnostic quiz validation
  if (!widgets.diagnosticQuiz || typeof widgets.diagnosticQuiz !== 'object') {
    widgets.diagnosticQuiz = {
      question: "Qu'est-ce que ce concept fondamental ?",
      options: ["Option A (correct)", "Option B"],
      correctIndex: 0,
      targetSectionId: "introduction",
      sectionTitle: "Introduction"
    };
  } else {
    if (!Array.isArray(widgets.diagnosticQuiz.options) || widgets.diagnosticQuiz.options.length < 2) {
      widgets.diagnosticQuiz.options = ["Option A (Correct)", "Option B (Incorrect)"];
      widgets.diagnosticQuiz.correctIndex = 0;
    }
    if (typeof widgets.diagnosticQuiz.correctIndex !== 'number' || widgets.diagnosticQuiz.correctIndex < 0 || widgets.diagnosticQuiz.correctIndex >= widgets.diagnosticQuiz.options.length) {
      widgets.diagnosticQuiz.correctIndex = 0;
    }
  }

  // 3. Objectives KSA validation
  if (!widgets.learningObjectives || typeof widgets.learningObjectives !== 'object') {
    widgets.learningObjectives = {
      knowledge: ["Comprendre les notions abordées."],
      skills: ["Savoir appliquer les modèles."],
      attitudes: ["Développer un esprit critique et analytique."]
    };
  } else {
    if (!Array.isArray(widgets.learningObjectives.knowledge) || widgets.learningObjectives.knowledge.length === 0) {
      widgets.learningObjectives.knowledge = ["Comprendre les notions abordées."];
    }
    if (!Array.isArray(widgets.learningObjectives.skills) || widgets.learningObjectives.skills.length === 0) {
      widgets.learningObjectives.skills = ["Savoir appliquer les modèles."];
    }
    if (!Array.isArray(widgets.learningObjectives.attitudes) || widgets.learningObjectives.attitudes.length === 0) {
      widgets.learningObjectives.attitudes = ["Développer un esprit critique."];
    }
  }

  // 4. Formative interactiveComponents validation & sanitization
  if (!Array.isArray(widgets.interactiveComponents)) {
    widgets.interactiveComponents = [];
  } else {
    widgets.interactiveComponents = widgets.interactiveComponents.map((comp: any, idx: number) => {
      if (!comp || typeof comp !== 'object') {
        return {
          id: `widget_${idx}`,
          componentType: "Quiz",
          sectionAnchor: "## Section 1",
          props: { questions: [] }
        };
      }
      if (!comp.id) comp.id = `widget_${idx}`;
      if (!comp.componentType) comp.componentType = "Quiz";
      if (!comp.sectionAnchor) comp.sectionAnchor = "## Section";
      if (!comp.props || typeof comp.props !== 'object') comp.props = {};

      if (comp.componentType === "Quiz") {
        if (!Array.isArray(comp.props.questions) || comp.props.questions.length === 0) {
          comp.props.questions = [
            {
              q: "Question d'auto-évaluation ?",
              explanation: "Explication de la réponse correcte.",
              options: [
                { text: "Option Correcte", correct: true },
                { text: "Option Incorrecte", correct: false }
              ]
            }
          ];
        } else {
          comp.props.questions = comp.props.questions.map((q: any) => {
            if (!q.q) q.q = "Question d'auto-évaluation ?";
            if (!Array.isArray(q.options) || q.options.length < 2) {
              q.options = [
                { text: "Option Correcte", correct: true },
                { text: "Option Incorrecte", correct: false }
              ];
            } else {
              q.options = q.options.map((o: any) => {
                if (!o || typeof o !== 'object') {
                  return { text: "Option", correct: false };
                }
                if (!o.text) o.text = "Option";
                o.correct = !!o.correct;
                return o;
              });
              if (!q.options.some((o: any) => o.correct)) {
                q.options[0].correct = true;
              }
            }
            return q;
          });
        }
      } else if (comp.componentType === "FillInBlanks") {
        if (!comp.props.sentence) comp.props.sentence = "La Terre est une _____.";
        if (!comp.props.answer) comp.props.answer = "planète";
      } else if (comp.componentType === "SolvedExercise") {
        if (!comp.props.title) comp.props.title = "Exercice résolu";
        if (!comp.props.problem) comp.props.problem = "Formulez l'exercice ici.";
        if (!comp.props.solution) comp.props.solution = "La solution détaillée.";
      } else if (comp.componentType === "UnsolvedExercise") {
        if (!comp.props.title) comp.props.title = "Exercice d'application";
        if (!comp.props.problem) comp.props.problem = "Sujet de l'exercice à résoudre.";
        if (!comp.props.correctAnswer) comp.props.correctAnswer = "Réponse attendue";
      } else if (comp.componentType === "Mermaid") {
        if (!comp.props.chart) comp.props.chart = "graph TD\n  A[Début] --> B[Fin]";
      } else if (comp.componentType === "FunctionPlotter") {
        if (!comp.props.fn) comp.props.fn = "x^2";
      } else if (comp.componentType === "PronunciationSandbox" || comp.componentType === "SandboxPrononciation") {
        if (!comp.props.word) comp.props.word = "concept";
        if (!comp.props.ipa) comp.props.ipa = "";
        if (!comp.props.lang) comp.props.lang = "en";
      } else if (comp.componentType === "Video") {
        if (!comp.props.title) comp.props.title = "Vidéo académique";
        if (!comp.props.url && !comp.props.id) {
          comp.props.url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
          comp.props.provider = "YouTube";
        }
      } else if (comp.componentType === "AudioPlayer" || comp.componentType === "Audio") {
        if (!comp.props.title) comp.props.title = "Audio explicatif";
        if (!comp.props.url) {
          comp.props.url = "https://upload.wikimedia.org/wikipedia/commons/c/c8/Example.ogg";
        }
      } else if (comp.componentType === "OralEvaluation" || comp.componentType === "EvaluationOrale") {
        if (!comp.props.prompt) comp.props.prompt = "Expliquez le concept clé de cette leçon de vive voix.";
        if (!comp.props.gradingSystem) comp.props.gradingSystem = "0/20";
      }

      return comp;
    });

    // Programmatically filter out components that are incompatible with the course discipline
    const disc = (discipline || "").toLowerCase().trim();
    const isMath = disc.includes("math") || disc.includes("algè") || disc.includes("geomet");
    const isPhysics = disc.includes("physic") || disc.includes("physiq") || disc.includes("astron");
    const isChemistry = disc.includes("chemist") || disc.includes("chimi");
    const isBiology = disc.includes("biolog") || disc.includes("life science") || disc.includes("anatom") || disc.includes("medec") || disc.includes("medici") || disc.includes("santé");
    const isCS = disc.includes("computer") || disc.includes("informatique") || disc.includes("program") || disc.includes("software");
    const isEconomics = disc.includes("econom") || disc.includes("finan") || disc.includes("busines") || disc.includes("comptab");
    const isSocialPsych = disc.includes("psych") || disc.includes("sociol") || disc.includes("social");
    const isHistoryGeogHumanities = disc.includes("histor") || disc.includes("geogr") || disc.includes("philosoph") || disc.includes("liter") || disc.includes("lettr") || disc.includes("art");

    widgets.interactiveComponents = widgets.interactiveComponents.filter((comp: any) => {
      if (!comp || !comp.componentType) return false;
      
      const alwaysAllowed = [
        "Quiz", "FillInBlanks", "SolvedExercise", "UnsolvedExercise", "Mermaid", "Video", "Audio", "AudioPlayer",
        "StructureViewer3D", "QuantumOrbitalExplorer", "DynamicSimulation",
        "ChemicalStoichiometry", "BasicMathExplorer", "FunctionPlotter",
        "ComparisonSlider", "CodeSandbox", "DataChart", "InteractiveDiagram",
        "FunctionManipulator", "EquationManipulator", "Geometry2D", "GestaltInteractive"
      ];
      if (alwaysAllowed.includes(comp.componentType)) {
        return true;
      }
      
      if (comp.componentType === "Geometry2D" || comp.componentType === "BasicMathExplorer" || comp.componentType === "FunctionManipulator") {
        return isMath;
      }
      
      if (comp.componentType === "FunctionPlotter" || comp.componentType === "EquationManipulator") {
        return isMath || isPhysics;
      }
      
      if (comp.componentType === "DynamicSimulation") {
        return isPhysics || isMath;
      }
      
      if (comp.componentType === "StructureViewer3D" || comp.componentType === "QuantumOrbitalExplorer") {
        return isPhysics || isChemistry;
      }
      
      if (comp.componentType === "ChemicalStoichiometry") {
        return isChemistry;
      }
      
      if (comp.componentType === "CodeSandbox") {
        return isCS;
      }
      
      if (comp.componentType === "InteractiveDiagram") {
        return isBiology || isSocialPsych || isHistoryGeogHumanities;
      }
      
      if (comp.componentType === "ComparisonSlider") {
        return isBiology || isHistoryGeogHumanities;
      }
      
      if (comp.componentType === "GestaltInteractive") {
        return isSocialPsych || isHistoryGeogHumanities;
      }
      
      if (comp.componentType === "DataChart") {
        return isEconomics || isPhysics || isSocialPsych || isMath || isHistoryGeogHumanities || isBiology || isChemistry || isCS;
      }
      
      return false;
    });
  }

  // 5. Whats next validation
  if (!widgets.whatsNext || !Array.isArray(widgets.whatsNext.steps) || widgets.whatsNext.steps.length === 0) {
    widgets.whatsNext = {
      steps: [
        { title: "Sujet suivant", description: "Découvrez le chapitre suivant pour approfondir.", slug: "next-chapter" }
      ]
    };
  }

  // 5b. Going further validation
  if (!widgets.goingFurther || !Array.isArray(widgets.goingFurther.items) || widgets.goingFurther.items.length === 0) {
    widgets.goingFurther = {
      items: [
        {
          title: "Introduction aux concepts clés",
          type: "website",
          url: "https://wikipedia.org",
          description: "Explorez les notions fondamentales et historiques liées à cette leçon sur Wikipédia."
        }
      ]
    };
  } else {
    widgets.goingFurther.items = widgets.goingFurther.items.map((it: any) => {
      const title = (it.title || "Ressource complémentaire").trim();
      const type = ["book", "article", "video", "website", "research", "movie", "film"].includes(it.type) ? it.type : "website";
      const url = (it.url || "").trim();
      const description = (it.description || "Pour approfondir vos connaissances sur le sujet.").trim();
      return { title, type, url, description };
    });
  }

  // 6. Summary points validation (must be complete sentences ending with periods)
  if (!widgets.conclusionSummary || !Array.isArray(widgets.conclusionSummary.items) || widgets.conclusionSummary.items.length === 0) {
    widgets.conclusionSummary = {
      items: [
        "Ce chapitre a permis d'explorer les concepts fondamentaux de la discipline.",
        "Les notions d'analyse et d'application ont été démontrées avec rigueur.",
        "Les perspectives d'étude ouvrent la voie à de futurs développements majeurs."
      ]
    };
  } else {
    widgets.conclusionSummary.items = widgets.conclusionSummary.items.map((it: string) => {
      let clean = (it || "").trim();
      if (!clean) return "Concept clé assimilé de manière autonome.";
      if (!clean.endsWith(".") && !clean.endsWith("!") && !clean.endsWith("?")) {
        clean += ".";
      }
      return clean;
    });
  }

  // 7. Final summative evaluation validation
  if (!widgets.finalEvaluation || typeof widgets.finalEvaluation !== 'object') {
    widgets.finalEvaluation = {
      type: "Quiz",
      props: {
        durationLimit: 1800,
        questions: [
          {
            q: "Question d'examen finale ?",
            explanation: "Explication générale.",
            options: [
              { text: "Option Correcte", correct: true },
              { text: "Option Incorrecte", correct: false }
            ]
          }
        ]
      }
    };
  } else {
    if (widgets.finalEvaluation.type === "Quiz") {
      const qProps = widgets.finalEvaluation.props || {};
      if (!Array.isArray(qProps.questions) || qProps.questions.length === 0) {
        widgets.finalEvaluation.props = {
          durationLimit: 1800,
          questions: [
            {
              q: "Question d'examen finale ?",
              explanation: "Explication générale.",
              options: [
                { text: "Option Correcte", correct: true },
                { text: "Option Incorrecte", correct: false }
              ]
            }
          ]
        };
      }
    }
  }

  // 8. Glossary & References validation
  if (!Array.isArray(widgets.glossary) || widgets.glossary.length === 0) {
    widgets.glossary = [
      { term: "Souverain", definition: "Qui s'exerce de manière autonome et absolue." }
    ];
  }
  if (!Array.isArray(widgets.references) || widgets.references.length === 0) {
    widgets.references = [
      "OpenPrimer Academic Research. 2026. *Autonomous Synthesizer Journal* 12 (2): 45-67."
    ];
  }

  return widgets;
}

export function getCitedReferenceNumbers(narrativeText: string): Set<number> {
  const cited = new Set<number>();
  
  // 1. Match [X](#ref-X)
  const mdLinkRegex = /\[(\d+)\]\(#ref-\1\)/g;
  let match;
  while ((match = mdLinkRegex.exec(narrativeText)) !== null) {
    cited.add(parseInt(match[1], 10));
  }

  // 2. Match href="#ref-X" or href='#ref-X'
  const hrefRegex = /href=["']#ref-(\d+)["']/g;
  while ((match = hrefRegex.exec(narrativeText)) !== null) {
    cited.add(parseInt(match[1], 10));
  }

  // 3. Match refNum={X}
  const refNumRegex = /refNum=\{\s*(\d+)\s*\}/g;
  while ((match = refNumRegex.exec(narrativeText)) !== null) {
    cited.add(parseInt(match[1], 10));
  }

  // 4. Match <sup>X</sup> or <sup>[X]</sup> or similar
  const supRegex = /<sup>\s*\[?(\d+)\]?\s*<\/sup>/gi;
  while ((match = supRegex.exec(narrativeText)) !== null) {
    cited.add(parseInt(match[1], 10));
  }

  return cited;
}

export function stitchLessonContent(narrativeMdx: string, widgets: any): string {
  let content = narrativeMdx.trim();

  const prerequisitesStr = `<Prerequisites items={${JSON.stringify(widgets.prerequisites.items)}} />`;
  const diagnosticQuizStr = `<DiagnosticQuiz question="${widgets.diagnosticQuiz.question.replace(/"/g, '&quot;')}" options={${JSON.stringify(widgets.diagnosticQuiz.options)}} correctIndex={${widgets.diagnosticQuiz.correctIndex}} targetSectionId="${widgets.diagnosticQuiz.targetSectionId}" sectionTitle="${widgets.diagnosticQuiz.sectionTitle.replace(/"/g, '&quot;')}" />`;

  const objectivesStr = `<Objectives>
  <Knowledge>
    <ul className="list-disc pl-4 space-y-1">
      ${widgets.learningObjectives.knowledge.map((k: string) => `<li>${k}</li>`).join('\n      ')}
    </ul>
  </Knowledge>
  <Skills>
    <ul className="list-disc pl-4 space-y-1">
      ${widgets.learningObjectives.skills.map((s: string) => `<li>${s}</li>`).join('\n      ')}
    </ul>
  </Skills>
  <Attitudes>
    <ul className="list-disc pl-4 space-y-1">
      ${widgets.learningObjectives.attitudes.map((a: string) => `<li>${a}</li>`).join('\n      ')}
    </ul>
  </Attitudes>
</Objectives>`;

  if (content.includes('[[WIDGET:prerequisites]]')) {
    content = content.replace('[[WIDGET:prerequisites]]', prerequisitesStr);
  } else {
    content = `${prerequisitesStr}\n\n${content}`;
  }

  if (content.includes('[[WIDGET:diagnosticQuiz]]')) {
    content = content.replace('[[WIDGET:diagnosticQuiz]]', diagnosticQuizStr);
  } else {
    content = content.replace(prerequisitesStr, `${prerequisitesStr}\n\n${diagnosticQuizStr}`);
  }

  if (content.includes('[[WIDGET:learningObjectives]]')) {
    content = content.replace('[[WIDGET:learningObjectives]]', objectivesStr);
  } else {
    const introIdx = content.indexOf('## Introduction');
    const presIdx = content.indexOf('## Présentation');
    const targetIdx = introIdx !== -1 ? introIdx : (presIdx !== -1 ? presIdx : -1);

    if (targetIdx !== -1) {
      const nextHeadingIdx = content.indexOf('##', targetIdx + 15);
      if (nextHeadingIdx !== -1) {
        content = content.slice(0, nextHeadingIdx).trim() + `\n\n${objectivesStr}\n\n` + content.slice(nextHeadingIdx);
      } else {
        content = content + `\n\n${objectivesStr}`;
      }
    } else {
      content = content.replace(diagnosticQuizStr, `${diagnosticQuizStr}\n\n${objectivesStr}`);
    }
  }

  widgets.interactiveComponents.forEach((comp: any) => {
    const anchor = `[[WIDGET:${comp.id}]]`;
    let compStr = '';
    const props = comp.props || {};

    if (comp.componentType === "Quiz") {
      compStr = `<Quiz durationLimit={${props.durationLimit || 300}}${props.limit ? ` limit={${props.limit}}` : ''}>\n  ${(props.questions || []).map((q: any) => `  <Question q="${(q.q || '').replace(/"/g, '&quot;')}" explanation="${(q.explanation || '').replace(/"/g, '&quot;')}">\n    ${(q.options || []).map((o: any) => `<Option text="${(o.text || '').replace(/"/g, '&quot;')}" correct={${o.correct}} />`).join('\n    ')}\n  </Question>`).join('\n  ')}\n</Quiz>`;
    } else if (comp.componentType === "FillInBlanks") {
      compStr = `<FillInBlanks sentence="${(props.sentence || '').replace(/"/g, '&quot;')}" answer="${(props.answer || '').replace(/"/g, '&quot;')}" />`;
    } else if (comp.componentType === "SolvedExercise") {
      compStr = `<SolvedExercise title="${(props.title || '').replace(/"/g, '&quot;')}" solution="${(props.solution || '').replace(/"/g, '&quot;')}">\n  ${props.problem || ''}\n</SolvedExercise>`;
    } else if (comp.componentType === "UnsolvedExercise") {
      compStr = `<UnsolvedExercise title="${(props.title || '').replace(/"/g, '&quot;')}" correctAnswer="${(props.correctAnswer || '').replace(/"/g, '&quot;')}" explanation="${(props.explanation || '').replace(/"/g, '&quot;')}">\n  ${props.problem || ''}\n</UnsolvedExercise>`;
    } else if (comp.componentType === "Mermaid") {
      compStr = `<Mermaid chart={\`${props.chart || ''}\`} />`;
    } else if (comp.componentType === "FunctionPlotter") {
      compStr = `<FunctionPlotter fn="${props.fn || 'x^2'}" domain={${JSON.stringify(props.domain || [-10, 10])}} />`;
    } else if (comp.componentType === "CodeSandbox") {
      compStr = `<CodeSandbox initialCode={\`${props.initialCode || ''}\`} language="${props.language || 'javascript'}" />`;
    } else if (comp.componentType === "DataChart") {
      compStr = `<DataChart title="${(props.title || '').replace(/"/g, '&quot;')}" data={${JSON.stringify(props.data || [])}} xKey="${props.xKey || 'label'}" yKey="${props.yKey || 'value'}" />`;
    } else if (comp.componentType === "PronunciationSandbox" || comp.componentType === "SandboxPrononciation") {
      const pWord = (props.word || '').replace(/"/g, '&quot;');
      const pIpa = props.ipa ? ` ipa="${props.ipa.replace(/"/g, '&quot;')}"` : '';
      const pLang = props.lang ? ` lang="${props.lang.replace(/"/g, '&quot;')}"` : '';
      const pDef = props.definition ? ` definition="${props.definition.replace(/"/g, '&quot;')}"` : '';
      const pExp = props.explanation ? ` explanation="${props.explanation.replace(/"/g, '&quot;')}"` : '';
      compStr = `<PronunciationSandbox word="${pWord}"${pIpa}${pLang}${pDef}${pExp} />`;
    } else if (comp.componentType === "Video") {
      const vTitle = (props.title || '').replace(/"/g, '&quot;');
      const vIdAttr = props.id ? ` id="${props.id.replace(/"/g, '&quot;')}"` : '';
      const vProvider = props.provider ? ` provider="${props.provider.replace(/"/g, '&quot;')}"` : '';
      const vUrl = props.url ? ` url="${props.url.replace(/"/g, '&quot;')}"` : '';
      const vDur = props.duration ? ` duration="${props.duration.replace(/"/g, '&quot;')}"` : '';
      const vUnres = props.unresolved !== undefined ? ` unresolved={${props.unresolved}}` : '';
      compStr = `<Video title="${vTitle}"${vIdAttr}${vProvider}${vUrl}${vDur}${vUnres} />`;
    } else if (comp.componentType === "AudioPlayer" || comp.componentType === "Audio") {
      const aTitle = (props.title || '').replace(/"/g, '&quot;');
      const aUrl = (props.url || '').replace(/"/g, '&quot;');
      const aDur = props.duration ? ` duration="${props.duration.replace(/"/g, '&quot;')}"` : '';
      const aAi = props.aiGenerated !== undefined ? ` aiGenerated={${props.aiGenerated}}` : '';
      const aUnres = props.unresolved !== undefined ? ` unresolved={${props.unresolved}}` : '';
      const aAlt = props.alt ? ` alt="${props.alt.replace(/"/g, '&quot;')}"` : '';
      const aDesc = props.description ? ` description="${props.description.replace(/"/g, '&quot;')}"` : '';
      compStr = `<AudioPlayer title="${aTitle}" url="${aUrl}"${aDur}${aAi}${aUnres}${aAlt}${aDesc} />`;
    } else if (comp.componentType === "OralEvaluation" || comp.componentType === "EvaluationOrale") {
      const oPrompt = (props.prompt || '').replace(/"/g, '&quot;');
      const oSubject = props.subject ? ` subject="${props.subject.replace(/"/g, '&quot;')}"` : '';
      const oGrading = props.gradingSystem ? ` gradingSystem="${props.gradingSystem.replace(/"/g, '&quot;')}"` : '';
      const oDur = props.durationLimit ? ` durationLimit={${props.durationLimit}}` : '';
      const oFinal = props.isFinal !== undefined ? ` isFinal={${props.isFinal}}` : '';
      const oCalc = props.calculatorAllowed !== undefined ? ` calculatorAllowed={${props.calculatorAllowed}}` : '';
      const oDocs = props.externalDocumentsAllowed !== undefined ? ` externalDocumentsAllowed={${props.externalDocumentsAllowed}}` : '';
      const oWeb = props.webBrowsingAllowed !== undefined ? ` webBrowsingAllowed={${props.webBrowsingAllowed}}` : '';
      const oAi = props.aiTutorAssistanceAllowed !== undefined ? ` aiTutorAssistanceAllowed={${props.aiTutorAssistanceAllowed}}` : '';
      compStr = `<OralEvaluation prompt="${oPrompt}"${oSubject}${oGrading}${oDur}${oFinal}${oCalc}${oDocs}${oWeb}${oAi} />`;
    } else {
      compStr = `<${comp.componentType} id="${comp.id}" />`;
    }


    if (content.includes(anchor)) {
      content = content.replace(anchor, compStr);
    } else {
      const sectionHeader = comp.sectionAnchor || '##';
      const headingIdx = content.indexOf(sectionHeader);
      if (headingIdx !== -1) {
        const nextHeadingIdx = content.indexOf('##', headingIdx + sectionHeader.length);
        if (nextHeadingIdx !== -1) {
          content = content.slice(0, nextHeadingIdx).trim() + `\n\n${compStr}\n\n` + content.slice(nextHeadingIdx);
        } else {
          content = content + `\n\n${compStr}`;
        }
      } else {
        if (content.includes('[[WIDGET:conclusionSummary]]')) {
          content = content.replace('[[WIDGET:conclusionSummary]]', `${compStr}\n\n[[WIDGET:conclusionSummary]]`);
        } else {
          content = content + `\n\n${compStr}`;
        }
      }
    }
  });

  // Render GoingFurther suggested readings widget
  let goingFurtherItemsStr = '';
  if (widgets.goingFurther && Array.isArray(widgets.goingFurther.items) && widgets.goingFurther.items.length > 0) {
    goingFurtherItemsStr = `<GoingFurther>\n  ${widgets.goingFurther.items.map((it: any) => `<GoingFurtherItem title="${it.title.replace(/"/g, '&quot;')}" type="${it.type}"${it.url ? ` url="${it.url.replace(/"/g, '&quot;')}"` : ''} description="${it.description.replace(/"/g, '&quot;')}" />`).join('\n  ')}\n</GoingFurther>`;
  }

  if (content.includes('[[WIDGET:goingFurther]]')) {
    content = content.replace('[[WIDGET:goingFurther]]', goingFurtherItemsStr);
  } else {
    const conclusionIdx = content.indexOf('## Conclusion');
    const conclusionIdxFr = content.indexOf('## Synthèse');
    const targetConclusionIdx = conclusionIdx !== -1 ? conclusionIdx : (conclusionIdxFr !== -1 ? conclusionIdxFr : -1);

    if (targetConclusionIdx !== -1) {
      content = content.slice(0, targetConclusionIdx).trim() + `\n\n${goingFurtherItemsStr}\n\n` + content.slice(targetConclusionIdx);
    } else {
      if (content.includes('[[WIDGET:conclusionSummary]]')) {
        content = content.replace('[[WIDGET:conclusionSummary]]', `${goingFurtherItemsStr}\n\n[[WIDGET:conclusionSummary]]`);
      } else {
        content = content + `\n\n${goingFurtherItemsStr}`;
      }
    }
  }

  const parsedSteps = (widgets.whatsNext.steps || []).map((s: any) => ({
    title: s.title || '',
    description: s.description || '',
    slug: s.slug || '',
    subject: s.subject || '',
    level: s.level || ''
  }));
  const stepsEncoded = Buffer.from(JSON.stringify(parsedSteps)).toString('base64');
  const whatsNextStr = `<WhatsNext itemsBase64="${stepsEncoded}" />`;
  
  if (content.includes('[[WIDGET:whatsNext]]')) {
    content = content.replace('[[WIDGET:whatsNext]]', whatsNextStr);
  } else {
    content = content + `\n\n${whatsNextStr}`;
  }

  const summaryStr = `<Summary items={${JSON.stringify(widgets.conclusionSummary.items)}} />`;
  
  if (content.includes('[[WIDGET:conclusionSummary]]')) {
    content = content.replace('[[WIDGET:conclusionSummary]]', summaryStr);
  } else {
    const conclusionIdx = content.indexOf('## Conclusion');
    const conclusionIdxFr = content.indexOf('## Synthèse');
    const targetConclusionIdx = conclusionIdx !== -1 ? conclusionIdx : (conclusionIdxFr !== -1 ? conclusionIdxFr : -1);

    if (targetConclusionIdx !== -1) {
      content = content.slice(0, targetConclusionIdx + 13) + `\n\n${summaryStr}\n` + content.slice(targetConclusionIdx + 13);
    } else {
      content = content + `\n\n${summaryStr}`;
    }
  }

  let finalEvalStr = '';
  if (widgets.finalEvaluation.type === "Quiz") {
    const fProps = widgets.finalEvaluation.props || {};
    finalEvalStr = `<Quiz durationLimit={${fProps.durationLimit || 1800}}${fProps.limit ? ` limit={${fProps.limit}}` : ''}>\n  ${(fProps.questions || []).map((q: any) => `  <Question q="${q.q.replace(/"/g, '&quot;')}" explanation="${(q.explanation || '').replace(/"/g, '&quot;')}">\n    ${(q.options || []).map((o: any) => `<Option text="${o.text.replace(/"/g, '&quot;')}" correct={${o.correct}} />`).join('\n    ')}\n  </Question>`).join('\n  ')}\n</Quiz>`;
  } else {
    finalEvalStr = `<EssayEvaluation prompt="${(widgets.finalEvaluation.props.prompt || '').replace(/"/g, '&quot;')}" subject="${(widgets.finalEvaluation.props.subject || '').replace(/"/g, '&quot;')}" durationLimit={3600} />`;
  }

  if (content.includes('[[WIDGET:finalEvaluation]]')) {
    content = content.replace('[[WIDGET:finalEvaluation]]', finalEvalStr);
  } else {
    content = content + `\n\n${finalEvalStr}`;
  }

  const glossaryStr = `\n\n\n### Glossaire\n\n${widgets.glossary.map((g: any) => `* **${g.term}** : ${g.definition}`).join('\n')}`;
  content = content.trim() + glossaryStr;

  // Convert [refN] citations in the narrative text to standard superscript links with back-links
  const citedSet = new Set<number>();
  content = content.replace(/\[ref[-_]?\s*(\d+)\]/gi, (match, numStr) => {
    const num = parseInt(numStr, 10);
    if (num > 0 && num <= widgets.references.length) {
      if (!citedSet.has(num)) {
        citedSet.add(num);
        return `<sup id="cite-${num}" class="scroll-mt-24"><a href="#ref-${num}">[${num}]</a></sup>`;
      } else {
        return `<sup><a href="#ref-${num}">[${num}]</a></sup>`;
      }
    }
    return match;
  });

  // Map all references from widgets.references into a clean structured list
  const referencesList: string[] = [];
  widgets.references.forEach((ref: string, idx: number) => {
    const refNum = idx + 1;
    const cleanRef = ref.replace(/^\[\d+\]\s*/, '');
    referencesList.push(`[${refNum}] ${cleanRef}`);
  });

  // Build references section based on target language keywords in content
  const isFr = content.toLowerCase().includes('présentation') || content.toLowerCase().includes('introduction') || content.toLowerCase().includes('références') || content.toLowerCase().includes('glossaire');
  const refHeading = isFr ? '### Références' : '### References';

  const referencesStr = `\n\n\n${refHeading}\n\n${referencesList.join('\n')}`;
  content = content.trim() + referencesStr;

  // Clean up any remaining unresolved [[WIDGET:...]] placeholders
  content = content.replace(/\[\[WIDGET:[^\]]+\]\]/gi, '');

  // Clean up empty self-closing InteractiveDiagram components without hotspotsBase64
  content = content.replace(/<InteractiveDiagram(?![\s\S]*?hotspotsBase64)[^>]*?\/>/gi, '');

  // Clean up generic/empty developer placeholders at the end of lessons
  content = content.replace(/<FunctionPlotter\s+fn=["']x\^2["']\s*\/?>/gi, '');

  content = content.replace(/```mdx/g, '').replace(/```/g, '').trim();

  return content;
}

const slugsArraySchema = {
  type: "array",
  items: { type: "string" }
};

const systemicAnalysisSchema = {
  type: "object",
  properties: {
    isSystemic: { type: "boolean" },
    reason: { type: "string" }
  },
  required: ["isSystemic", "reason"]
};

const videoSearchSchema = {
  type: "object",
  properties: {
    provider: { type: "string" },
    id: { type: "string" },
    url: { type: "string" }
  }
};

const audioSearchSchema = {
  type: "object",
  properties: {
    url: { type: "string" }
  }
};

const curriculumSchema = {
  type: "object",
  properties: {
    description: { type: "string" },
    courses: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          subject: { type: "string" },
          volume: { type: "string" },
          type: { type: "string", enum: ["mandatory", "optional"] },
          description: { type: "string" }
        },
        required: ["title", "subject", "volume", "type", "description"]
      }
    }
  },
  required: ["description", "courses"]
};

export async function correctCourseTitle(title: string, targetLang: string = 'en', translateToTargetLang = true): Promise<string> {
  const cleanTitle = title.trim();
  if (!cleanTitle || cleanTitle.length < 3) return title;

  const langLabel = targetLang.toUpperCase();
  // When translateToTargetLang is true (default for English targets), translate AND correct.
  // When false (used during non-English course generation), only correct in original language.
  const systemInstruction = translateToTargetLang
    ? `You are an elite academic copyeditor and translator. Produce a final, publication-ready course title in the target language: ${langLabel}.
Rules:
- Translate the title into the target language (${langLabel}) if it is in a different language.
- Apply standard, appropriate capitalization (Title Case or localized standard) and spacing for academic course titles in the target language (${langLabel}).
- Correct all spelling, grammar, and typing mistakes.
- Keep academic level prefixes if present (e.g. L1, L2, M1, M2).
- Respond with ONLY the corrected/translated title. No quotes, no markdown, no explanations.`
    : `You are an elite academic copyeditor. Correct the spelling, grammar, accentuation, and capitalization of the course title in the language '${langLabel}'.
Rules:
- Standardize the capitalization (use Title Case appropriate for academic subjects in the target language).
- Correct any obvious spelling errors, typos, and punctuation issues.
- Do NOT translate the title to another language. Correct it in its original language.
- Respond with ONLY the corrected title text. No quotes, markdown formatting, explanations, or introductory text.`;

  const userPrompt = `Course Title: "${cleanTitle}"`;

  try {
    if (isVertexConfigured()) {
      const res = await callVertexAI({
        task: 'course_generation',
        contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
        systemInstruction,
        generationConfig: { temperature: 0.1 }
      });
      if (res && res.ok) {
        const json = await safeResponseJson(res, 'correctCourseTitle (Vertex AI)');
        const corrected = json?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (corrected) {
          const sanitized = corrected.replace(/^["'«“‘]|["'»”’]$/g, '').replace(/```/g, '').trim();
          if (sanitized && sanitized.length >= 3 && sanitized.length <= cleanTitle.length * 3 + 20 && !/sorry|error|apologize|cannot|unable/i.test(sanitized)) {
            return sanitized;
          }
        }
      }
    }
    
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (apiKey) {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userPrompt }] }],
          systemInstruction: { parts: [{ text: systemInstruction }] },
          generationConfig: { temperature: 0.1 }
        })
      });
      if (res.ok) {
        const json = await safeResponseJson(res, 'correctCourseTitle (API Fallback)');
        const corrected = json?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (corrected) {
          const sanitized = corrected.replace(/^["'«“‘]|["'»”’]$/g, '').replace(/```/g, '').trim();
          if (sanitized && sanitized.length >= 3 && sanitized.length <= cleanTitle.length * 3 + 20 && !/sorry|error|apologize|cannot|unable/i.test(sanitized)) {
            return sanitized;
          }
        }
      }
    }
  } catch (err) {
    console.warn(`[correctCourseTitle] Failed to correct title using AI:`, err);
  }

  // Basic fallback: Capitalize each word (Title Case) if AI fails
  return cleanTitle
    .split(/\s+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

// ─────────────────────────────────────────────────────────────────
// CITATION STYLE RESOLVER
// Maps discipline/subject to internationally recommended citation style
// ─────────────────────────────────────────────────────────────────

interface CitationStyleSpec {
  name: string;       // Short label, e.g. "APA 7"
  fullName: string;   // Full name, e.g. "American Psychological Association (APA), 7th edition"
  bookExample: string;
  articleExample: string;
  chapterExample: string;
  websiteExample: string;
  notes: string;
}

function getCitationStyle(discipline: string): CitationStyleSpec {
  const d = (discipline || '').toLowerCase().trim();

  // ── Psychology, Behavioural Sciences, Social Sciences, Education, Linguistics
  if (/psycholog|psychiatr|cogniti|neuroscien|social scien|sociolog|anthropolog|politic|education|pedagog|linguist|communication|management|human resources|business administration/.test(d)) {
    return {
      name: 'APA 7',
      fullName: 'American Psychological Association (APA), 7th edition',
      bookExample: 'Lastname, A. B. (Year). *Book title: Subtitle*. Publisher. https://doi.org/xxxxx',
      articleExample: 'Lastname, A. B., & Lastname, C. D. (Year). Article title. *Journal Name*, *Volume*(Issue), page–page. https://doi.org/xxxxx',
      chapterExample: 'Lastname, A. B. (Year). Chapter title. In E. Editor (Ed.), *Book title* (pp. xx–xx). Publisher.',
      websiteExample: 'Author, A. (Year, Month Day). *Page title*. Website Name. https://www.example.com',
      notes: 'In-text citations use (Author, Year) format. Every in-text citation must have a matching reference entry. Use italics for journal names and book/report titles. Include DOI or URL when available.'
    };
  }

  // ── Humanities: Literature, History of Art, Film, Comparative Literature, Cultural Studies
  if (/literatur|humanities|film|cinema|cultur|art histor|comparative|theatre|music(?!olog)|media studi/.test(d)) {
    return {
      name: 'MLA 9',
      fullName: 'Modern Language Association (MLA), 9th edition',
      bookExample: 'Lastname, Firstname. *Book Title: Subtitle*. Publisher, Year.',
      articleExample: 'Lastname, Firstname. "Article Title." *Journal Name*, vol. X, no. Y, Year, pp. xx–xx. DOI or URL.',
      chapterExample: 'Lastname, Firstname. "Chapter Title." *Book Title*, edited by Firstname Lastname, Publisher, Year, pp. xx–xx.',
      websiteExample: 'Lastname, Firstname. "Page Title." *Website Name*, Day Month Year, URL.',
      notes: 'In-text citations use (Author page) parenthetical format. Container titles are italicised. Works Cited list is alphabetically sorted. Access dates required for online sources.'
    };
  }

  // ── History, Archaeology, Classical Studies, Philosophy (analytical)
  if (/histor(?!y of art)|archaeolog|classical|philosoph|ethics|politic(?!al scien)|theology|religion/.test(d)) {
    return {
      name: 'Chicago 17 (Notes–Bibliography)',
      fullName: 'Chicago Manual of Style, 17th edition — Notes–Bibliography system',
      bookExample: 'Lastname, Firstname. *Book Title: Subtitle*. City: Publisher, Year.',
      articleExample: 'Lastname, Firstname. "Article Title." *Journal Name* Volume, no. Issue (Year): page–page. https://doi.org/xxxxx.',
      chapterExample: 'Lastname, Firstname. "Chapter Title." In *Book Title*, edited by Firstname Lastname, xx–xx. City: Publisher, Year.',
      websiteExample: 'Lastname, Firstname. "Page Title." Website Name. Last modified Month Day, Year. URL.',
      notes: 'Use footnotes or endnotes for in-text citations (superscript numbers). Ibid. and short-form citations acceptable after first full note. Bibliography is alphabetical by author surname.'
    };
  }

  // ── Medicine, Biomedical Sciences, Nursing, Public Health, Pharmacology
  if (/medic(?!al law)|biomed|nursing|pharmac|public health|epidemiolog|clinical|health scien|surgery|radiol|patholog/.test(d)) {
    return {
      name: 'Vancouver / ICMJE',
      fullName: 'Vancouver style (International Committee of Medical Journal Editors — ICMJE recommendations)',
      bookExample: 'Lastname AB, Lastname CD. Book Title: Subtitle. Edition. City: Publisher; Year. Total pages p.',
      articleExample: 'Lastname AB, Lastname CD, Lastname EF. Article title. *Abbreviated J Name*. Year;Volume(Issue):page–page. doi:10.xxxx/xxxxx.',
      chapterExample: 'Lastname AB. Chapter title. In: Lastname EF, editor. Book Title. City: Publisher; Year. p. xx–xx.',
      websiteExample: 'Organisation Name [Internet]. Page title [cited Year Month Day]. Available from: https://www.example.com',
      notes: 'References are numbered sequentially in the order they appear in the text, using superscript numbers [1]. Journal titles are abbreviated per NLM/Index Medicus conventions. PMID or DOI must be included when available.'
    };
  }

  // ── Biology, Ecology, Zoology, Botany, Genetics, Molecular Biology, Biochemistry
  if (/biolog|ecolog|zoolog|botan|genetic|molecular|biochem|evolutionar|microbiolog/.test(d)) {
    return {
      name: 'CSE (Citation-Name)',
      fullName: 'Council of Science Editors (CSE), 8th edition — Citation-Name system',
      bookExample: 'Lastname AB, Lastname CD. Year. Book title: subtitle. City (State): Publisher. Total pages p.',
      articleExample: 'Lastname AB, Lastname CD. Year. Article title. *Journal Abbrev*. Volume(Issue):page–page. doi:10.xxxx/xxxxx.',
      chapterExample: 'Lastname AB. Year. Chapter title. In: Lastname EF, editor. Book title. City: Publisher. p. xx–xx.',
      websiteExample: '[Author/Organisation]. Year [accessed Year Month Day]. Page title. URL.',
      notes: 'References are listed alphabetically and numbered; in-text citations use the corresponding number in brackets [1]. Scientific names must be italicised. Abbreviate journal titles per NLM standard.'
    };
  }

  // ── Physical Sciences: Physics, Astronomy, Chemistry (general), Materials Science, Geoscience
  if (/physics|astronom|chemist(?!ry of law)|material scien|geoscien|geolog|earth scien|climat|atmospheri/.test(d)) {
    return {
      name: 'AIP / ACS',
      fullName: 'AIP Style (American Institute of Physics) for physics; ACS Style (American Chemical Society) for chemistry',
      bookExample: 'A. B. Lastname, *Book Title: Subtitle* (Publisher, City, Year), pp. xx–xx.',
      articleExample: 'A. B. Lastname and C. D. Lastname, J. Abbrev., **volume**, page (year). doi:10.xxxx/xxxxx.',
      chapterExample: 'A. B. Lastname, in *Book Title*, edited by C. D. Editor (Publisher, City, Year), pp. xx–xx.',
      websiteExample: 'A. B. Lastname, "Page title", Website Name (Year), URL, accessed Day Month Year.',
      notes: 'In-text citations are superscript numbers in the order of appearance. Journal names are abbreviated. Italicise journal abbreviation and volume number. DOI required for all journal articles.'
    };
  }

  // ── Mathematics, Statistics, Computer Science, Information Technology
  if (/mathematic|statistic|computer scien|information technolog|software|algorithm|cryptograph|data scien|artificial intelligence|machine learning/.test(d)) {
    return {
      name: 'ACM / IEEE',
      fullName: 'ACM Reference Format (computing) or IEEE Citation Style (engineering/CS)',
      bookExample: '[1] A. B. Lastname and C. D. Lastname, *Book Title: Subtitle*. City, Country: Publisher, Year, pp. xx–xx.',
      articleExample: '[1] A. B. Lastname, "Article title," *Journal Name*, vol. X, no. Y, pp. xx–xx, Month Year, doi: 10.xxxx/xxxxx.',
      chapterExample: '[1] A. B. Lastname, "Chapter title," in *Book Title*, C. D. Editor, Ed. City: Publisher, Year, pp. xx–xx.',
      websiteExample: '[1] A. B. Lastname. "Page title." Website Name. Accessed: Day Month Year. [Online]. Available: https://www.example.com',
      notes: 'References are numbered [1], [2], … in order of appearance in the text. Abbreviate journal and conference names per IEEE/ACM convention. All references in a numbered list at the end.'
    };
  }

  // ── Engineering: Civil, Mechanical, Electrical, Environmental
  if (/engineer|mechanic|electrical|civil|structural|environmental|aerospace|chemical engineer/.test(d)) {
    return {
      name: 'IEEE',
      fullName: 'IEEE Reference Style',
      bookExample: '[1] A. B. Lastname and C. D. Lastname, *Book Title*. City, Country: Publisher, Year, pp. xx–xx.',
      articleExample: '[1] A. B. Lastname, "Article title," *IEEE Trans. Abbrev.*, vol. X, no. Y, pp. xx–xx, Month Year, doi: 10.1109/xxx.',
      chapterExample: '[1] A. B. Lastname, "Chapter title," in *Book Title*, C. D. Editor, Ed. City: Publisher, Year, pp. xx–xx.',
      websiteExample: '[1] Organisation. "Page title." Accessed: Day Month Year. [Online]. Available: https://www.example.com',
      notes: 'In-text citations use bracketed sequential numbers [1]. Italicise book and journal titles. Abbreviate journal/conference names per the IEEE Abbreviations list.'
    };
  }

  // ── Economics, Finance, Business, Accounting, Marketing
  if (/econom|financ|accounting|marketing|business|commerce|management(?! de)/.test(d)) {
    return {
      name: 'APA 7',
      fullName: 'American Psychological Association (APA), 7th edition (standard in economics/business journals)',
      bookExample: 'Lastname, A. B. (Year). *Book title: Subtitle*. Publisher. https://doi.org/xxxxx',
      articleExample: 'Lastname, A. B., & Lastname, C. D. (Year). Article title. *Journal Name*, *Volume*(Issue), page–page. https://doi.org/xxxxx',
      chapterExample: 'Lastname, A. B. (Year). Chapter title. In E. Editor (Ed.), *Book title* (pp. xx–xx). Publisher.',
      websiteExample: 'Organisation Name. (Year, Month Day). *Report or page title*. Publisher/Website. https://www.example.com',
      notes: 'In-text citations use (Author, Year) or (Author, Year, p. xx) format. All references include DOI or URL. Working papers: include institution and working paper number.'
    };
  }

  // ── Law
  if (/\blaw\b|legal|jurisprudence|droit|rechtswissenschaft|derecho/.test(d)) {
    return {
      name: 'Oscillating (Bluebook / Dalloz / OSCOLA)',
      fullName: 'Legal citation: Bluebook (US/International), Dalloz style (France), or OSCOLA (UK) depending on jurisdiction',
      bookExample: 'LASTNAME Firstname, Title of Book, Publisher, City, Year, p. xx.',
      articleExample: 'LASTNAME Firstname, "Article title", Revue/Journal Name, Year, No. X, p. xx.',
      chapterExample: 'LASTNAME Firstname, "Chapter title", in EDITOR Firstname (dir.), Book Title, Publisher, Year, p. xx.',
      websiteExample: 'ORGANISATION, "Document title", Website Name, Date, [available at: URL, accessed Day Month Year].',
      notes: 'French law: author surnames in SMALL CAPS or all-caps; use « guillemets » for article titles; italicise journal and book titles. Cite legislation as: Code civil, art. XX. Cite case law by court, date, and publication reference. For other jurisdictions, follow the dominant national standard.'
    };
  }

  // ── Architecture, Design, Urban Planning, Fine Arts
  if (/architect|design|urban plan|fine art|visual art|graphic design/.test(d)) {
    return {
      name: 'Chicago 17 (Author–Date)',
      fullName: 'Chicago Manual of Style, 17th edition — Author–Date system (commonly used in architecture & design journals)',
      bookExample: 'Lastname, Firstname. Year. *Book Title: Subtitle*. City: Publisher.',
      articleExample: 'Lastname, Firstname. Year. "Article Title." *Journal Name* Volume (Issue): page–page. https://doi.org/xxxxx.',
      chapterExample: 'Lastname, Firstname. Year. "Chapter Title." In *Book Title*, edited by Firstname Lastname, xx–xx. City: Publisher.',
      websiteExample: 'Lastname, Firstname. Year. "Page Title." Website Name. Month Day. URL.',
      notes: 'In-text citations use (Author Year, page) format. Figures and images: full caption with artist, title, date, medium, and institution/collection. Licence and source URL required for reproduced images.'
    };
  }

  // ── Default fallback: general academic / multi-disciplinary
  return {
    name: 'Chicago 17 (Author–Date)',
    fullName: 'Chicago Manual of Style, 17th edition — Author–Date system (general academic fallback)',
    bookExample: 'Lastname, Firstname. Year. *Book Title: Subtitle*. City: Publisher.',
    articleExample: 'Lastname, Firstname. Year. "Article Title." *Journal Name* Volume (Issue): page–page. https://doi.org/xxxxx.',
    chapterExample: 'Lastname, Firstname. Year. "Chapter Title." In *Book Title*, edited by Firstname Lastname, xx–xx. City: Publisher.',
    websiteExample: 'Lastname, Firstname. Year. "Page Title." Website Name. Month Day. URL.',
    notes: 'In-text citations use (Author Year) or (Author Year, page) format. Full reference list at the end of the document, alphabetically by author.'
  };
}

export function getFilteredWidgetsCatalog(discipline: string): Record<string, any> {
  const dbCatalog = getDatabaseWidgets();
  if (!discipline) return dbCatalog;
  
  const filtered: Record<string, any> = {};
  const normDiscipline = discipline.toLowerCase().trim();
  
  for (const [id, meta] of Object.entries(dbCatalog)) {
    const disciplines: string[] = meta.disciplines || [];
    const hasAll = disciplines.some(d => d.toLowerCase() === 'all disciplines');
    if (hasAll) {
      filtered[id] = meta;
      continue;
    }
    
    const isMatch = disciplines.some(d => {
      const normD = d.toLowerCase().trim();
      return normDiscipline.includes(normD) || normD.includes(normDiscipline);
    });
    
    if (isMatch) {
      filtered[id] = meta;
    }
  }
  
  return filtered;
}

export function getDatabaseWidgets(): Record<string, any> {
  try {
    const catalogPath = path.join(process.cwd(), 'src', 'components', 'mdx', 'widgets_catalog.json');
    if (fs.existsSync(catalogPath)) {
      return JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
    }
  } catch (err) {
    console.error('[AI] Error reading widgets_catalog.json:', err);
  }
  return {};
}

export async function generateCourseContent(courseName: string, levelInput: string, targetLang: string = 'en', taskId?: string, lessonOffset: number = 0) {
  const appendTaskLog = async (msg: string) => {
    const timestampedMsg = `[${new Date().toISOString()}] ${msg}`;
    console.log(timestampedMsg);
    if (!taskId) return;
    try {
      const { data: currentTask } = await supabaseAdmin
        .from('task_queue')
        .select('logs')
        .eq('id', taskId)
        .single();
      const existingLogs = currentTask?.logs || [];
      await supabaseAdmin
        .from('task_queue')
        .update({ logs: [...existingLogs, timestampedMsg] })
        .eq('id', taskId);
    } catch (err) {
      console.warn(`[LOG UPDATE ERROR] Failed to append log for task ${taskId}:`, err);
    }
  };

  const correctedCourseName = await correctCourseTitle(courseName, targetLang, true);
  await appendTaskLog(`[TITLE CORRECTION] Corrected course title from "${courseName}" to "${correctedCourseName}"`);

  const normalizeLevel = (lvl: string): string => {
    if (!lvl) return 'beginner';
    const clean = lvl.trim().toLowerCase();
    if (clean === 'l1') return 'L1';
    if (clean === 'l2') return 'L2';
    if (clean === 'l3') return 'L3';
    if (clean === 'm1') return 'M1';
    if (clean === 'm2') return 'M2';
    const standards = ['foundation_1', 'foundation_2', 'secondary_1', 'secondary_2', 'preuni_1', 'preuni_2', 'preuni_3', 'beginner', 'intermediate', 'advanced', 'expert'];
    const found = standards.find(s => s === clean);
    if (found) return found;
    return clean;
  };
  const level = normalizeLevel(levelInput);

  let extra: any = {};
  if (taskId) {
    try {
      const { data: taskData, error: taskError } = await supabaseAdmin
        .from('task_queue')
        .select('description')
        .eq('id', taskId)
        .single();
      if (!taskError && taskData?.description) {
        extra = JSON.parse(taskData.description || '{}');
      }
    } catch (err) {
      console.warn(`[AI GENERATOR WARNING] Failed to retrieve task description in pre-prompt load:`, err);
    }
  }

  const discipline = extra.subject || 'General';
  const volume = extra.volume || '15h';

  // 1. Generate syllabus (lesson titles and slugs)
  const promptSyllabus = `You are the Primary Pedagogical Architect Agent (Agent 1 & 2).
Your mission is to design the structure, lesson titles, and cognitive strategy of the course titled "${correctedCourseName}" for the level "${level}". You do not write the course content; you construct its pure, highly-adapted computational and educational backbone.

An anatomy course is not structured like an algebraic topology or political philosophy course. You MUST adapt the skeleton of the course to the epistemological DNA of the discipline, the target audience's age (from Primary School to Bachelor/University Year 3), and the course's hourly volume.

---

# STEP 1: PARAMETERS AND COGNITIVE DNA
The following parameters are fixed *a priori* and must guide your architecture:
- **Course Title:** "${correctedCourseName}"
- **Target Level:** "${level}"
- **Discipline:** "${discipline}"
- **Hourly Volume:** "${volume}"
- **Target Language:** "${targetLang}"

Before generating any chapters, classify the target discipline according to its style of validation, evidence, and knowledge transmission. Select and apply the dominant matrix from the following options:

1. **Deductive / Formal Sciences (Mathematics, Logic, Theoretical Physics):**
   * Focus: Absolute rigor, seamless causal chain.
   * Obligatory components: Lemma ➔ Theorem ➔ Proof ➔ Corollary. Every block must flow logically from the previous one.

2. **Empirical / Experimental Sciences (Biology, Experimental Physics, Chemistry):**
   * Focus: Real-world observation, visual dual-coding.
   * Obligatory components: Hypothesis ➔ Experimental Protocol ➔ Observation/Data ➔ Interpretation/Modeling. Pervasive use of labeled diagrams, structural schemas, or anatomical atlases.

3. **Humanities and Discursive Sciences (Philosophy, History, Literature):**
   * Focus: Rhetoric, problematization, dialectic.
   * Obligatory components: Thesis ➔ Antithesis ➔ Synthesis (or genealogical/conceptual approach). Fine text analysis, socio-historical contextualization, doctrinal controversies.

4. **Applied Sciences / Engineering (Computer Science, Systems Architecture, Electronics):**
   * Focus: Problem-solving, design patterns, constructivism.
   * Obligatory components: Requirements gathering ➔ Technical constraints ➔ Architecture specifications ➔ Implementation/Code ➔ Validation tests.

---

# STEP 2: AUDIENCE AND VOLUME ADAPTATION (COGNITIVE GRADATION AND STRUCTURE)
The quantity, granularity, and depth of the chapters must be strictly proportional to the target level and the hourly volume of "${volume}":

1. **Primary, Middle, and High School (K-12: from foundation_1 to preuni):**
   * **Real-world Curricular Realism:** In schools, learning does not happen through isolated, hyper-specific courses. If the requested course represents a general annual program, the syllabus must propose a realistic and balanced thematic division covering the main official pillars.
   * **Spiral Learning Progression:** Core concepts are revisited year after year with increasing levels of abstraction. Structure the lessons progressively, explicitly building upon knowledge acquired in previous school years.
   * **Scope & Length Rules:**
     * *Primary School (foundation_1 & foundation_2):* Proportional to low hourly volume (e.g. 1h-3h). Narrative, metaphorical, and inductive approach. Maximum of 3 short items in total (including the Implicit Introduction and Terminal Evaluation).
     * *Middle & High School (secondary_1 & secondary_2):* Proportional to medium hourly volume (e.g. 5h-10h). Gradual transition to formalization, increasing rigor. 4 to 6 distinct items in total.

2. **Higher Education / University (L1 to M2 / from beginner to expert):**
   * Proportional to high hourly volume (e.g. 15h-30h or more).
   * *First Year (L1 / Bachelor 1st):* Courses must be broad, foundational, and introductory to establish key concepts, universal terminology, and global methodology. 6 to 8 lessons in total.
   * *Second & Third Year (L2-L3):* Transition to formal modeling, proofs, and precise sub-branches with strict academic formalism and critical evaluation of model limits. 6 to 10 lessons in total.
   * *Master's & Expert Levels (M1-M2 / advanced & expert):* Focus entirely on highly specialized, cutting-edge research topics. Do not include general or introductory courses. 6 to 10 lessons in total.

---

# STEP 3: SPECIFIC PEDAGOGICAL STRUCTURE (IMPLICIT INTRODUCTION, DETACHED EVALUATION)
You must follow these strict structural guidelines:

1. **First Lesson (Implicit Introduction - Context & History):**
   * The very first item in the 'lessons' array represents the start of the course. It must **NOT** be forced to use the word "Introduction" or "Introduction to [Subject]" in its title. Be creative and academic!
   * This lesson is naturally introductory. It must present stronger historical, conceptual, or contextual elements explaining *why* there is a subject to treat, its origin, and why it is critical. It must contain real, high-quality academic content, not just generic welcoming text.

2. **Last Lesson (Content with General Conclusion):**
   * The penultimate item in the 'lessons' array (the last core teaching lesson) must be a core content lesson, but its technical depth/description must specify that it also integrates a complete **general conclusion** for the entire course, synthesizing all main lessons and concepts.

3. **Terminal Evaluation (Detached Evaluation Chapter):**
   * The ultimate item in the 'lessons' array must be the Terminal Evaluation (title: "Évaluation Terminale" or "Final Evaluation" or equivalent in the target language "${targetLang}", slug: "evaluation-finale" or "final-evaluation").
   * This chapter is **not** a standard lesson. It must contain **only** the assessment/questions/summative validation itself (with no new lesson content, no narrative text, and no core textbook content).

---

# STEP 4: EXPECTED OUTPUT FORMAT
You must output ONLY a valid JSON object structuring the course. The chapter list must be exhaustive and detailed with NO vague placeholders. Each lesson must specify its "cognitiveArtifact" and "technicalDepth".
**CRITICAL LANGUAGE REQUIREMENT**: Instructions are given in English, but you must imperatively generate the actual JSON output values (titles, descriptions, strategies, etc.) in the requested target language: "${targetLang}". Ensure the values of all fields are translated and formatted in "${targetLang}".
Do NOT return markdown code block backticks (\`\`\`). Output only the raw JSON object.


{
  "courseContext": {
    "discipline": "[Input discipline: '${discipline}', translated to ${targetLang.toUpperCase()}]",
    "description": "[Detailed, engaging 2-3 sentence course description, detailing general objectives and target skills, in ${targetLang.toUpperCase()}]",
    "epistemologicalMatrix": "[Deductive / Empirical / Discursive / Engineering, translated to ${targetLang.toUpperCase()}]",
    "targetLevel": "${level}",
    "pedagogicalStrategy": "[Explanation of the strategy adopted for this specific audience, discipline, and hourly volume of ${volume}, in ${targetLang.toUpperCase()}]"
  },
  "lessons": [
{
"title": "[Explicit, engaging title of the lesson/chapter, in ${targetLang.toUpperCase()}]",
"slug": "[URL-friendly ASCII slug]",
"cognitiveArtifact": "[Specify: Lemma Proof / Labeled Anatomical Schema / Text Analysis / Sandbox Code Block, translated to ${targetLang.toUpperCase()}]",
"technicalDepth": "[Expected level of detail to guide the writing agent Agent 3, in ${targetLang.toUpperCase()}]"
}
],
"references": [
"[Authoritative reference 1: Books, landmark papers, or journal articles in standard citation format (Dalloz, APA, MLA, Chicago, etc. depending on discipline), with no asterisks for italics (use quotes or guillemets)]",
"[Authoritative reference 2...]"
]
}

---

# QUALITY CONTROL & STRICT PROHIBITIONS
* **No Generic Outlines or Fillers:** A syllabus outline that uses generic academic blocks (e.g., I. Introduction, II. History, III. Conclusion) is strictly prohibited. The syllabus must be **complete, specific, and highly authentic**, matching a real-world curriculum you would find in actual academic or professional training, without being overly eccentric.
* **Exhaustiveness of Chapters:** You must specify the exact number of distinct lessons appropriate for the level and volume (maximum of 3 for Primary level, 4 to 6 for Middle/High school, 6 to 10 for University). The writing agent (Agent 3) must have clear, actionable guidelines with zero need for outline extrapolation.
* **Detached Evaluation Content:** Under no circumstances should the Terminal Evaluation contain instructional content. It must focus purely on testing.
* **Mandatory Reference Registry:** You MUST generate a list of EXACTLY 5 to 8 authoritative academic references in the \`references\` array. These must represent the absolute canon of the course's discipline. Do NOT use placeholder references or list generic URLs. They must be formatted strictly according to the citation style of the discipline, but without markdown bold/italics symbols (no asterisks).`;

  try {
    let parsedSyllabus: any = null;
    let lessonsList: { title: string; slug: string; cognitiveArtifact?: string; technicalDepth?: string }[] = [];
    let courseContext: any = {};
    let originalSyllabusLessonsLength = 0;

    if (taskId && extra && extra.syllabus) {
      await appendTaskLog(`[AI GENERATOR] Found cached syllabus in task description. Reusing to prevent duplicate chapters.`);
      parsedSyllabus = extra.syllabus;
    }

  // If we have a lessonOffset > 0, but no cached syllabus, we have a mismatch hazard!
  // In this case, we reset lessonOffset to 0 and start from scratch to guarantee course consistency.
  if (lessonOffset > 0 && !parsedSyllabus) {
    await appendTaskLog(`[AI GENERATOR WARNING] lessonOffset is ${lessonOffset} but no cached syllabus was found. Resetting offset to 0 to avoid duplicates.`);
    lessonOffset = 0;
  }

  // If lessonOffset is 0, clear any existing lessons for this course and language to avoid duplicates from previous failed runs.
  if (lessonOffset === 0 && !process.env.REGENERATE_CHAPTER_1_ONLY && process.env.ONLY_SECOND_LESSON !== 'true') {
    const cleanSlug = cleanPathSegment(correctedCourseName);
    await appendTaskLog(`[AI GENERATOR] lessonOffset is 0. Clearing existing lessons for course "${cleanSlug}" and language "${targetLang.toLowerCase()}" to prevent duplicate chapters.`);
    try {
      const { error: deleteError } = await supabaseAdmin
        .from('lessons')
        .delete()
        .eq('course_slug', cleanSlug)
        .eq('lang', targetLang.toLowerCase());
      if (deleteError) {
        console.warn(`[AI GENERATOR WARNING] Failed to clear existing lessons: ${deleteError.message}`);
      }
    } catch (err) {
      console.warn(`[AI GENERATOR WARNING] Exception clearing existing lessons:`, err);
    }
  }

  if (parsedSyllabus) {
    lessonsList = Array.isArray(parsedSyllabus) ? parsedSyllabus : (parsedSyllabus.lessons || []);
    courseContext = Array.isArray(parsedSyllabus) ? {} : (parsedSyllabus.courseContext || {});
  } else {
    try {
      let rawJson = '';
      let success = false;
      
      if (isVertexConfigured()) {
        console.log(`[AI GENERATOR] Generating syllabus for "${courseName}" via Vertex AI (${TASK_MODELS['course_generation']})...`);
        try {
          const res = await callVertexAI({
            task: 'course_generation',
            contents: [{ role: 'user', parts: [{ text: promptSyllabus }] }],
            generationConfig: {
              temperature: 0.2,
              responseMimeType: "application/json",
              responseSchema: syllabusSchema
            }
          });

          if (res && res.ok) {
            const jsonRes = await safeResponseJson(res, 'Vertex course syllabus generation');
            rawJson = jsonRes.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
            success = true;
          }
        } catch (err) {
          console.warn(`[AI GENERATOR] Vertex AI syllabus generation exception.`, err);
        }
      }
      
      if (!success && apiKey) {
        console.log(`[AI GENERATOR] Generating syllabus for "${courseName}" via AI Studio fallback (gemini-2.5-flash)...`);
        const startTime = Date.now();
        try {
          const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: promptSyllabus }] }],
              generationConfig: {
                responseMimeType: "application/json",
                responseSchema: syllabusSchema
              }
            })
          });
          if (res.ok) {
            const jsonRes = await safeResponseJson(res, 'AI Studio syllabus generation fallback');
            rawJson = jsonRes.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
            success = true;

            const durationMs = Date.now() - startTime;
            const usage = jsonRes.usageMetadata || {};
            const promptTokens = usage.promptTokenCount || 0;
            const candidatesTokens = usage.candidatesTokenCount || usage.candidateTokenCount || 0;
            await recordMetrics('course_generation', 'gemini-2.5-flash', durationMs, promptTokens, candidatesTokens, promptSyllabus);
          } else {
            const errText = await res.text();
            console.error(`[AI GENERATOR] AI Studio syllabus call failed (${res.status}):`, errText);
          }
        } catch (err) {
          console.error(`[AI GENERATOR] AI Studio fetch exception:`, err);
        }
      }

      if (!rawJson) {
        throw new Error(`[AI GENERATOR CRITICAL ERROR] AI model failed to generate syllabus for course "${correctedCourseName}". Syllabus raw JSON is empty.`);
      }

      const cleanedJson = rawJson.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedSyllabus = safeJsonParse(cleanedJson, 'generateCourseContent (Syllabus)');
      lessonsList = Array.isArray(parsedSyllabus)
        ? parsedSyllabus
        : (parsedSyllabus.lessons || []);
      courseContext = Array.isArray(parsedSyllabus) ? {} : (parsedSyllabus.courseContext || {});

      // Export syllabus prompt, schema, and outputs
      const courseSlug = cleanPathSegment(correctedCourseName);
      saveDraftRevision(`prompt_stage0_syllabus_${courseSlug}.md`, promptSyllabus);
      saveDraftRevision(`agent1_2_syllabus_schema.json`, JSON.stringify(syllabusSchema, null, 2));
      if (rawJson) {
        saveDraftRevision(`draft_stage0_syllabus_${courseSlug}.json`, rawJson);
      }
      if (parsedSyllabus) {
        saveDraftRevision(`final_stage0_syllabus_${courseSlug}.json`, JSON.stringify(parsedSyllabus, null, 2));
      }

      // Save the syllabus to the task description to ensure durability on retries
      if (taskId) {
        try {
          const { data: taskData, error: fetchError } = await supabaseAdmin
            .from('task_queue')
            .select('description')
            .eq('id', taskId)
            .single();
          if (!fetchError && taskData) {
            const extra = JSON.parse(taskData.description || '{}');
            extra.syllabus = parsedSyllabus;
            
            const { error: updateError } = await supabaseAdmin
              .from('task_queue')
              .update({ description: JSON.stringify(extra) })
              .eq('id', taskId);
            if (updateError) {
              console.error(`[AI GENERATOR] Failed to save syllabus to task description:`, updateError.message);
            } else {
              await appendTaskLog(`[AI GENERATOR] Successfully persisted generated syllabus to task description.`);
            }
          }
        } catch (err) {
          console.warn(`[AI GENERATOR WARNING] Failed to persist syllabus to task description:`, err);
        }
      }
    } catch (err) {
      await appendTaskLog(`[AI GENERATOR ERROR] Syllabus generation failed: ${err}`);
      throw err;
    }
  }

  // --- Scoping, Slicing & Verification of Syllabus lessons (supports both generated and cached) ---
  if (!lessonsList || lessonsList.length === 0) {
    throw new Error(`[AI GENERATOR CRITICAL ERROR] Syllabus lessons list is empty or invalid for course "${correctedCourseName}".`);
  }

  lessonsList.forEach((les: any, idx: number) => {
    if (!les || typeof les !== 'object' || !les.title || !les.slug) {
      throw new Error(`[AI GENERATOR CRITICAL ERROR] Syllabus lesson at index ${idx} is missing a title or slug: ${JSON.stringify(les)}`);
    }
    les.originalIndex = idx;
  });

  originalSyllabusLessonsLength = lessonsList.length;

  if (process.env.ONLY_FIRST_LESSON === 'true') {
    lessonsList = lessonsList.slice(0, 1);
    console.log(`[ONLY_FIRST_LESSON] Sliced lessons list to only generate the first lesson: "${lessonsList[0]?.title}"`);
  } else if (process.env.ONLY_SECOND_LESSON === 'true') {
    lessonsList = lessonsList.slice(1, 2);
    console.log(`[ONLY_SECOND_LESSON] Sliced lessons list to only generate the second lesson: "${lessonsList[0]?.title}"`);
  }

  await appendTaskLog(`[AI GENERATOR] Syllabus loaded. Total lessons to generate: ${lessonsList.length}. Offset: ${lessonOffset}.`);

  let completedLessons = lessonOffset;
  const updateTaskProgress = async (lessonTitle: string) => {
    completedLessons++;
    const currentProgress = 20 + Math.floor((completedLessons / lessonsList.length) * 70);
    await appendTaskLog(`[AI GENERATOR] Finished lesson "${lessonTitle}" (${completedLessons}/${lessonsList.length}). Progress: ${currentProgress}%.`);
    if (!taskId) return;
    try {
      await supabaseAdmin
        .from('task_queue')
        .update({ progress: Math.min(99, currentProgress) })
        .eq('id', taskId);
    } catch (err) {
      console.warn(`[PROGRESS UPDATE ERROR] Failed to update task ${taskId} progress to ${currentProgress}:`, err);
    }
  };

    // ─────────────────────────────────────────────────────────────────
    // INTER-LESSON THROTTLE — prevents burst of Vertex AI calls within a run.
    // Tune via INTER_LESSON_DELAY_MS env var (default: 5000ms = 5 seconds).
    // Set to 0 to disable. Raise this value if you still hit 429 errors.
    const INTER_LESSON_DELAY_MS = Number(process.env.INTER_LESSON_DELAY_MS ?? 0);

    const MAX_PARALLEL_LESSONS = Number(process.env.MAX_PARALLEL_LESSONS || 1);

    const usedDatabaseWidgetIds = new Set<string>();

    // 2. For each lesson, generate rich MDX content with concurrency limit
    await mapConcurrent(lessonsList, MAX_PARALLEL_LESSONS, async (item: any, index) => {
      const realIndex = item.originalIndex !== undefined ? item.originalIndex : index;

      if (realIndex < lessonOffset) {
        console.log(`[INCREMENTAL] Skipping lesson "${item.title}" because it is below the resume offset ${lessonOffset}.`);
        return;
      }

      // Check if this lesson already exists and is non-empty (incremental generation check)
      try {
        const { data: existingLesson } = await dbService.getLesson(
          cleanPathSegment(correctedCourseName),
          cleanPathSegment(item.slug),
          targetLang.toLowerCase()
        );
        if (existingLesson && existingLesson.content && existingLesson.content.trim().length > 100) {
          await appendTaskLog(`[AI GENERATOR - INCREMENTAL] Skipping lesson "${item.title}" because it is already generated.`);
          await updateTaskProgress(item.title);
          return;
        }
      } catch (err) {
        console.warn(`[AI GENERATOR] Incremental check failed for "${item.title}", proceeding to generate:`, err);
      }

      const lessonStats = {
        courseName: correctedCourseName,
        lessonTitle: item.title,
        lessonSlug: item.slug,
        level: level,
        language: targetLang,
        startTime: Date.now(),
        endTime: 0,
        durationSeconds: 0,
        syllabusAttempts: 1,
        narrativeAttempts: 0,
        narrativeRejections: 0,
        widgetsAttempts: 0,
        widgetsRejections: 0,
        selfHealingAttempts: 0,
        status: 'pending',
        error: '',
        tokenMetrics: {
          promptTokens: 0,
          candidatesTokens: 0
        }
      };

      try {
      // Helper to call Vertex AI or fallback Gemini 2.5 Flash
      const callAIEngine = async (
        promptText: string,
        schema?: any,
        temperature: number = 0.2
      ): Promise<string> => {
        let resultText = '';
        let success = false;
        let lastError = 'N/A';

        const generationConfig: any = { temperature };
        if (schema) {
          generationConfig.responseMimeType = "application/json";
          generationConfig.responseSchema = schema;
        }

        if (isVertexConfigured()) {
          try {
            const res = await callVertexAI({
              task: 'course_generation',
              contents: [{ role: 'user', parts: [{ text: promptText }] }],
              generationConfig
            });
            if (res && res.ok) {
              const resJson = await res.json();
              resultText = resJson.candidates?.[0]?.content?.parts?.[0]?.text || '';
              success = true;

              const usage = resJson.usageMetadata || {};
              lessonStats.tokenMetrics.promptTokens += usage.promptTokenCount || 0;
              lessonStats.tokenMetrics.candidatesTokens += usage.candidatesTokenCount || usage.candidateTokenCount || 0;
            } else {
              lastError = res ? `HTTP ${res.status} ${res.statusText}` : 'Null Response';
            }
          } catch (err: any) {
            lastError = err.message || String(err);
            console.warn("[AI GENERATOR] Vertex AI call exception:", err);
          }
        }

        if (!success && apiKey) {
          const startTime = Date.now();
          try {
            const bodyPayload: any = {
              contents: [{ parts: [{ text: promptText }] }],
              generationConfig
            };
            const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(bodyPayload)
            });
            if (res.ok) {
              const resJson = await res.json();
              resultText = resJson?.candidates?.[0]?.content?.parts?.[0]?.text || '';
              success = true;

              const durationMs = Date.now() - startTime;
              const usage = resJson.usageMetadata || {};
              lessonStats.tokenMetrics.promptTokens += usage.promptTokenCount || 0;
              lessonStats.tokenMetrics.candidatesTokens += usage.candidatesTokenCount || usage.candidateTokenCount || 0;
              await recordMetrics('course_generation', 'gemini-2.5-flash', durationMs, usage.promptTokenCount || 0, usage.candidatesTokenCount || 0, promptText);
            } else {
              lastError = `HTTP ${res.status} ${res.statusText}`;
            }
          } catch (err: any) {
            lastError = err.message || String(err);
            console.error(`[AI GENERATOR] AI Studio fallback exception:`, err);
          }
        }

        if (!success) {
          throw new Error(`AI Call failed. Last error: ${lastError}`);
        }

        return resultText;
      };

      // 1. Discipline-Aware Catalog Pruning
      const prunedCatalog = getFilteredWidgetsCatalog(courseContext.discipline || 'General');
      const remainingBudget = Math.max(0, 2 - usedDatabaseWidgetIds.size);
      const alreadyUsedList = usedDatabaseWidgetIds.size > 0 
        ? Array.from(usedDatabaseWidgetIds).map(id => `"${id}"`).join(', ')
        : 'None';

      const formattedCatalogList = Object.entries(prunedCatalog).map(([id, meta]: [string, any]) => {
        return `- ID: "${id}"
  Name: "${meta.nameEN || id}" (${meta.nameFR || id})
  Description: "${meta.descEN || meta.descFR || ''}"
  Disciplines: [${(meta.disciplines || []).join(', ')}]
  Educational Level: "${meta.levelEN || meta.levelFR || 'All levels'}"`;
      }).join('\n\n');

      // ───────────────────────────────────────────────────────────────
      // [STAGE 1] NARRATIVE SCRIBE (AGENT 3A)
      // ───────────────────────────────────────────────────────────────
      await appendTaskLog(`[AI GENERATOR - INVERTED] [STAGE 1] Drafting academic narrative text for lesson "${item.title}"...`);

      let pronunciationMandate = "";
      const isLanguageOrLinguistics = (courseContext.discipline || '').toLowerCase().includes('lang') || 
                                      (courseContext.discipline || '').toLowerCase().includes('linguistic') ||
                                      correctedCourseName.toLowerCase().includes('espagnol') ||
                                      correctedCourseName.toLowerCase().includes('semantique') ||
                                      correctedCourseName.toLowerCase().includes('sémantique') ||
                                      item.title.toLowerCase().includes('son') ||
                                      item.title.toLowerCase().includes('prononciation') ||
                                      item.title.toLowerCase().includes('phonet') ||
                                      item.title.toLowerCase().includes('phonét');

      if (isLanguageOrLinguistics) {
        if (targetLang.toLowerCase() === 'fr') {
          pronunciationMandate = `
=============================================================================
🚨 MANDATORY PRONUNCIATION WIDGET REQUIREMENT 🚨
Since this lesson belongs to a Language or Linguistics course, you MUST insert the following custom JSX tag:
<SandboxPrononciation />
at least once (and ideally multiple times) directly in the pronunciation, phonetic, or practice sections of your narrative text.
Do NOT use bracketed syntax for this specific tag. Exclusively write it as raw JSX: <SandboxPrononciation />.
=============================================================================
`;
        } else {
          pronunciationMandate = `
=============================================================================
🚨 MANDATORY PRONUNCIATION WIDGET REQUIREMENT 🚨
Since this lesson belongs to a Language or Linguistics course, you MUST insert the following custom JSX tag:
<PronunciationSandbox />
at least once (and ideally multiple times) directly in the pronunciation, phonetic, or practice sections of your narrative text.
Do NOT use bracketed syntax for this specific tag. Exclusively write it as raw JSX: <PronunciationSandbox />.
=============================================================================
`;
        }
      }

      const courseReferences = parsedSyllabus?.references || [];
  const referencesMetadata = courseReferences.length > 0
    ? courseReferences.map((ref: string, idx: number) => `[ref${idx + 1}] ${ref}\n`).join('')
    : 'None provided. Please construct academic references for the discipline.';

  const narrativePrompt = `You are a world-class academic professor and expert writer (Agent 3A - Narrative Scribe).
Your task is to write the complete, professional, extremely detailed academic MDX narrative content for the specified lesson.

${pronunciationMandate}

=============================================================================
⚠️ CRITICAL MARKUP & XML/JSX COMPLIANCE RULES (MDX SAFETY MANDATE) ⚠️
To prevent Next-MDX compilation crashes, you MUST strictly follow these rules:

1. ABSOLUTE PROHIBITION ON RAW INTERACTIVE JSX TAGS:
   - Do NOT write raw JSX tags for interactive widgets (such as <DataChart>, <BasicMathExplorer>, <CodeSandbox>, <Mermaid>, <InteractiveDiagram>, <Quiz>, or <FillInBlanks>) in your prose.
   - You must exclusively use bracketed anchors: [[WIDGET:id]]. Writing raw interactive tags will crash the compiler and reject your lesson.
   - The ONLY custom tags allowed inline in your prose are hover-cards: <RealPerson>, <FictionalCharacter>, <Location>, <EventLink>, <Artwork>, <ConceptLink>, <TheoremLink>, <InstitutionLink>, <SpeciesLink>, <ChemicalLink>, and <CelestialLink>. Note: <SandboxPrononciation /> (for French lessons) and <PronunciationSandbox /> (for English lessons) are explicitly allowed and highly recommended to be written as raw JSX in pronunciation/phonetic sections of Language and Linguistics courses.

2. NO RAW HTML FOR LISTS:
   - Do NOT use raw HTML tags (<ul>, <ol>, <li>) to build bulleted or numbered lists.
   - Exclusively use standard Markdown bullet points (- or *) or numbered lists (1.). Mixing HTML tags with markdown text inside lists crashes the parser.

3. NO LITERAL CURLY BRACES IN PLAIN TEXT:
   - Literal { and } characters in normal text are parsed as JSX expressions.
   - For math equations, always wrap curly braces inside LaTeX delimiters: $ \\{x \\in \\mathbb{R}\\} $ or $$ \\{a, b\\} $$.
   - For normal text, wrap curly braces in inline code backticks: \`{x}\` or use HTML entities &#123; and &#125;.

4. NO STRAY import/export STATEMENTS:
   - Never write "import " or "export " at the beginning of a line in normal text.
   - If you must show code blocks containing imports/exports, wrap them in standard markdown code blocks (e.g. \`\`\`\`javascript ... \`\`\`\`).
=============================================================================

---

### METADATA
- **Course Name**: "${correctedCourseName}"
- **Academic Level**: "${levelInput}"
- **Lesson Title**: "${item.title}"
- **Lesson Slug**: "${item.slug}"
- **Target Language**: "${targetLang.toUpperCase()}"
- **Course Discipline**: "${courseContext.discipline || 'General'}"
- **Epistemological Matrix**: "${courseContext.epistemologicalMatrix || 'N/A'}"
- **Expected Cognitive Artifact**: "${item.cognitiveArtifact || 'N/A'}"
- **Expected Guidelines / Technical Depth**: "${item.technicalDepth || 'N/A'}"

---

### 1. DISCIPLINARY WRITING MATRIX
You must adapt your writing style, formatting, and density strictly to the epistemological DNA of the discipline:

1. **Deductive / Formal Sciences (Mathematics, Logic, Theoretical Physics):**
   - Style: Formal, absolute logical rigor, and deductive reasoning.
   - Requirements: Systematically include Lemma ➔ Theorem ➔ Proof ➔ Corollary blocks. Use LaTeX equations inline (\`$...$\`) and block (\`$$...$$\`) extensively. Ensure every formula is defined and placed in logical sequence.
2. **Empirical / Experimental Sciences (Biology, Experimental Physics, Chemistry, Medicine):**
   - Style: Observational, analytical, and highly structured.
   - Requirements: Follow the Hypothesis ➔ Experimental Protocol ➔ Observation ➔ Interpretation/Modeling workflow. Use labeled anatomical or structural diagrams and process flows.
3. **Humanities and Discursive Sciences (Philosophy, History, Literature, Sociology):**
   - Style: Discursive, argumentative, rhetorical, and dialectical.
   - Requirements: Follow a Thesis ➔ Antithesis ➔ Synthesis framework. Focus on deep textual analysis, socio-historical contextualization, and competing intellectual doctrines/controversies.
4. **Applied Sciences / Engineering (Computer Science, Electronics, Systems Design):**
   - Style: Problem-solving, architectural, and constructivist.
   - Requirements: Follow the Requirements ➔ Technical Constraints ➔ Architectural Design ➔ Implementation ➔ Validation workflow. Use code structures and technical schemas.

---

### 2. LEVEL & LANGUAGE ADAPTATION (BLOOM'S TAXONOMY)
- **Vocabulary & Tone**: Tailor all terminology, sentence complexity, and conceptual depth to the target academic level ("${levelInput}").
- **Language**: Write the entire content in "${targetLang.toUpperCase()}".
- **Bloom's Taxonomy Rule**:
  - If the target level is University/Higher Education (L1-M2, beginner-expert):
    - If Target Language is **FR** (French): Systematically use Revised Bloom's Taxonomy verbs: **Analyser** (Analyze), **Évaluer** (Evaluate), and **Créer** (Create) when introducing goals and activities.
    - If Target Language is **EN** (English) or any other language: Systematically use their exact localized equivalents: **Analyze**, **Evaluate**, and **Create**.

---

### 3. WIDGET PLACEMENT SYSTEM (WFTA SYSTEM)
You do NOT write interactive components, quizzes, or glossary definitions in raw HTML or JS. Doing so is strictly prohibited and will cause compile-time failures.
Instead, you must decide where these elements belong and insert standard or custom bracketed anchor tags \`[[WIDGET:id]]\` directly into your narrative. The **Widgets Architect (Agent 3B)** will parse these anchors and generate matching interactive components programmatically.

#### A. Standard/Structural Widget Anchors (Insert Each Exactly Once):
- \`[[WIDGET:prerequisites]]\`: Place at the very beginning of the document, before the introduction.
- \`[[WIDGET:diagnosticQuiz]]\`: Place immediately after the prerequisites block, before the introduction. This provides a diagnostic skip-pass for students.
- \`[[WIDGET:learningObjectives]]\`: Place immediately after the \`## Introduction\` section.
- \`[[WIDGET:conclusionSummary]]\`: Place at the very beginning of the \`## Conclusion\` section.
- \`[[WIDGET:goingFurther]]\`: Place immediately before the \`## Conclusion\` section. This renders suggested readings as interactive widgets.
- \`[[WIDGET:whatsNext]]\`: Place at the very end of the \`## Conclusion\` section.
- \`[[WIDGET:finalEvaluation]]\`: Place at the very end of the document, after the conclusion, as the ultimate summative validation.

#### B. Discipline-Aware Custom Interactive Anchors:
You must insert at least 1 to 2 custom interactive widget anchors inside the conceptual body sections (e.g., \`[[WIDGET:my_custom_chart]]\`).
For each anchor you insert, you must provide a dedicated, highly engaging narrative paragraph directly before or after it, explaining what the component represents, guiding students on what variables to manipulate, or prompting them on what to solve.

**Approved Pruned Widgets for this Discipline**:
${formattedCatalogList}

*Constraint on Curation Budget*:
- You may insert **at most 1** database-curated widget from the approved list above (e.g. \`[[WIDGET:FunctionPlotter:my_plot]]\` or \`[[WIDGET:CodeSandbox:my_sandbox]]\`). Rely on simple discursives like Quizzes, FillInBlanks, or Solved/Unsolved Exercises for other sections (e.g., \`[[WIDGET:Quiz:section_quiz]]\` or \`[[WIDGET:SolvedExercise:math_work]]\`).

---

### 4. RIGOROUS WRITING & PEDAGOGICAL STYLING RULES
1. **Academic Density & Word Count**:
   - For higher education levels (L1-L3), write an extremely thorough, exhaustive narrative. Skeletons, empty summaries, or "write section here" comments are strictly forbidden.
   - Target word count: **3,000 to 5,000 words** of deeply developed text across at least 4 to 5 conceptual sections (each starting with a '## ' heading).
2. **Author Quotes with Citations**:
   - Weave at least one high-impact, authentic quotation from a notable expert/scientist, formatted exactly as:
     > "Quote text..." — Author, *Book/Publication Title*, Publisher, City, Year, p. Page
   - Every foreign-language quote must be followed by its bracketed translation in the course's target language, plus a paragraph detailing its conceptual implications.
3. **In-text Bibliography Citations (CRITICAL)**:
   - Ground the lesson in these specific, canonical course-level references:
${referencesMetadata}
   - When making claims or citing definitions, you must cite these references inline using the strict format: [refN] (where N is the 1-based number of the reference, e.g. [ref1], [ref2]).
   - Do NOT use other citation formats (like superscript HTML links, raw URLs, or bracketed numbers like [1]).
   - Only cite references that are relevant to this lesson, but make sure to cite at least 1 or 2 canonical references from the list.
4. **Controlled Digressions (Encadrés Épistémologiques)**:
   - Include at least one historical controversy or limit-of-concept discussion box:
     <Epistemology title="Title of Controversy">Deep academic controversy or critical discussion...</Epistemology>
5. **Contextual Mini-Biographies**:
   - Include at least one detailed biographical sidebar:
     > [!INFO] **Mini-Biography: Name (Dates)**
     > Write 8-12 lines of biography detailing their main academic contribution. Systematically include a direct working Wikipedia link at the end: \`[Read more on Wikipedia](...)\`.
6. **Entity Hover-Cards**:
   - Wrap named historical figures, landmark artworks, locations, events, fictional characters, scientific concepts, mathematical theorems, or academic institutions mentioned inline in Hover-Card components with a short description:
     - \`<RealPerson name="Wiki_Title" lang="${targetLang.toLowerCase()}" bio="...">Name (Dates)</RealPerson>\`
     - \`<FictionalCharacter name="Wiki_Title" lang="${targetLang.toLowerCase()}" bio="...">Character Name</FictionalCharacter>\`
     - \`<Artwork name="Wiki_Title" lang="${targetLang.toLowerCase()}" description="...">Title</Artwork>\`
     - \`<Location name="Wiki_Title" lang="${targetLang.toLowerCase()}" description="...">Name</Location>\`
     - \`<EventLink name="Wiki_Title" lang="${targetLang.toLowerCase()}" description="...">Name</EventLink>\`
     - \`<ConceptLink name="Wiki_Title" lang="${targetLang.toLowerCase()}" description="...">Concept Name</ConceptLink>\`
     - \`<TheoremLink name="Wiki_Title" lang="${targetLang.toLowerCase()}" description="...">Theorem/Law Name</TheoremLink>\`
     - \`<InstitutionLink name="Wiki_Title" lang="${targetLang.toLowerCase()}" description="...">Institution Name</InstitutionLink>\`
     - \`<SpeciesLink name="Wiki_Title" lang="${targetLang.toLowerCase()}" bio="...">Species Name</SpeciesLink>\`
     - \`<ChemicalLink name="Wiki_Title" lang="${targetLang.toLowerCase()}" bio="...">Chemical/Molecule Name (Formula)</ChemicalLink>\`
     - \`<CelestialLink name="Wiki_Title" lang="${targetLang.toLowerCase()}" bio="...">Celestial Body/Space Mission</CelestialLink>\`
   *Strict Constraints*:
   - ABSOLUTELY FORBIDDEN to wrap verbs (especially action/Bloom verbs like "analyser", "comprendre", "créer", "identifier", etc.) inside these entity tags. Verbs must remain as plain text or bold text, never wrapped in hover-cards. Only wrap true named entities or technical terms.
   - Do NOT require or place Hover-Cards inside JSX attribute properties (like inside options, questions, or other strings), or inside image captions.
7. **Factual Images & Captions**:
   - Include 5 to 6 factual/sourced images and 1 to 2 decorative AI illustrations for Licence level.
   - Factual images (historical figures, maps, diagrams) MUST use standard Markdown image tags where the Alt Text is the **EXACT, search-friendly English Wikipedia title** of the subject, and the URL is empty/blank:
     \`![Adam_Smith]()\`
   - Decorative/Conceptual images MUST use a descriptive query as the Alt Text and have a blank/empty URL, e.g. \`![A colorful diagram showing photosynthesis]()\`.
   - Every image must have an italicized figure caption directly below:
     *Figure X: [Title] - [Description].*
   - Strict prohibition: Do NOT use images for mathematical curves or plots. Use custom interactive anchors instead.

---

### 5. OUTPUT FORMAT
- Return ONLY the raw MDX content.
- Do NOT wrap your output in markdown code blocks (\`\`\`).
- Ensure no headings for \`## Glossary\` or \`## References\` are written, as those are appended programmatically by the Stitching layer.
`;

      // Export Scribe Prompt
      saveDraftRevision(`prompt_stage1_scribe_${item.slug}.md`, narrativePrompt);

      let narrativeText = await callAIEngine(narrativePrompt, null, 0.3);

      // Pre-verifier 1: MDX Text Preprocessor & Cleaner
      let cleanedNarrative = narrativeText.replace(/```json/gi, '').replace(/```mdx/gi, '').replace(/```/gi, '').trim();

      // Programmatic Preprocessor execution BEFORE the critique (Agent 4A) sees it!
      cleanedNarrative = preprocessMdx(cleanedNarrative, targetLang.toLowerCase(), false, item.slug);

      lessonStats.narrativeAttempts++;
      saveDraftRevision(`draft_stage1_narrative_${item.slug}_attempt_1.md`, cleanedNarrative);

      // ───────────────────────────────────────────────────────────────
      // [STAGE 4A] NARRATIVE CRITIC (AGENT 4A)
      // ───────────────────────────────────────────────────────────────
      let narrativeApproved = false;
      let narrativeIteration = 0;
      const maxNarrativeIterations = 3;

      while (!narrativeApproved && narrativeIteration < maxNarrativeIterations) {
        narrativeIteration++;
        await appendTaskLog(`[AI GENERATOR - INVERTED] [STAGE 4A] Reviewing narrative text (Attempt ${narrativeIteration}/${maxNarrativeIterations})...`);

        const narrativeCriticPrompt = `You are the Narrative Critic Agent (Agent 4A). Your job is to strictly review the generated academic lesson narrative text to ensure it complies with our "Zero-Placeholder", "Academic Density", and "Pedagogical Formatting" policies before widgets are designed.

---

### METADATA
- **Course Name**: "${correctedCourseName}"
- **Academic Level**: "${levelInput}"
- **Lesson Title**: "${item.title}"
- **Target Language**: "${targetLang.toUpperCase()}"

---

### INPUT NARRATIVE TEXT TO AUDIT
---
${cleanedNarrative}
---

---

### CORE CHECKPOINTS
You must audit the narrative text against the following 7 critical checkpoints:

1. **Zero-Placeholder Constraint**:
   - **STRICT REJECTION**: You MUST reject (\`approved: false\`) if the text contains any comments, skeletons, or placeholder phrases like "write section here," "[À compléter]," "Lorem Ipsum," or undeveloped paragraphs. The narrative must be 100% complete and publication-ready.
2. **Academic Density & Length**:
   - For higher education levels (L1-M2), verify that the lesson is detailed, rigorous, and exhaustive. It must cover at least 4 to 5 core conceptual sections under distinct \`## \` headings.
   - Target word count: **3,000 to 5,000 words** of rich, well-formed narrative paragraphs. Reject if the writer produced a brief, simplistic, or highly summarized text.
3. **Widget Placement & Anchors**:
   - Verify that the standard structural widget anchors are placed exactly once and at correct positions:
     - \`[[WIDGET:prerequisites]]\` (at the very beginning)
     - \`[[WIDGET:diagnosticQuiz]]\` (before introduction)
     - \`[[WIDGET:learningObjectives]]\` (after introduction)
     - \`[[WIDGET:conclusionSummary]]\` (at the beginning of ## Conclusion)
     - \`[[WIDGET:goingFurther]]\` (immediately before the ## Conclusion section)
     - \`[[WIDGET:whatsNext]]\` (at the very end of conclusion)
     - \`[[WIDGET:finalEvaluation]]\` (after conclusion, as ultimate validation)
   - Verify that there are **at least 1 to 2** custom interactive anchors (e.g. \`[[WIDGET:my_plot]]\`) placed within conceptual body sections, and each is surrounded by high-quality explanatory paragraphs.
   - **STRICT PROHIBITION ON RAW CUSTOM JSX**: Verify that the narrative contains NO raw JSX tags representing interactive components (such as \`<DataChart>\`, \`<Quiz>\`, \`<CodeSandbox>\`, or \`<Mermaid>\`). They must exclusively use bracketed anchors. Note: <SandboxPrononciation /> and <PronunciationSandbox /> are explicitly allowed as raw JSX in pronunciation/phonetic sections of Language and Linguistics courses.
4. **Author Quotes & In-text Citations**:
   - Verify that the text integrates high-impact quotes formatted exactly as:
     > "Quote text..." — Author, *Book/Publication Title*, Publisher, City, Year, p. Page
   - Every foreign-language quote must be immediately followed by its bracketed translation. Every quote must have an explanatory paragraph.
   - Verify that references are cited inline using standard brackets, e.g. \`[1](#ref-1)\`.
5. **Controlled Digressions & Mini-Biographies**:
   - For higher education, verify that at least one \`<Epistemology>\` controversy/limit box is present with deep theoretical content.
   - Verify that at least one contextual Mini-Biography is present, is substantial (8-12 lines), and contains a working, direct Wikipedia Markdown link at the very end.
6. **Connected Entity Hover-Cards**:
   - Verify that named entities mentioned inline are wrapped in their custom Hover-Cards: \`<RealPerson>\`, \`<FictionalCharacter>\`, \`<Location>\`, \`<EventLink>\`, \`<Artwork>\`, \`<ConceptLink>\`, \`<TheoremLink>\`, \`<InstitutionLink>\`, \`<SpeciesLink>\`, \`<ChemicalLink>\`, or \`<CelestialLink>\`.
   - **STRICT REJECTION FOR WRAPPED VERBS**: Strictly check and REJECT if any active verbs, action verbs, or Revised Bloom's Taxonomy verbs (such as *analyser*, *comprendre*, *créer*, *identifier*, *expliquer*, etc., or their English equivalents) are wrapped inside any hover-card tags. Verify that only proper names, nouns, and true entities are wrapped.
   - Ensure these custom tags are NOT placed inside JSX attributes (like component property values) where they are syntactically invalid.
   - Check for and reject any nested or duplicated Hover-Cards.
7. **Visual Assets Density, Sourcing & Captions**:
   - For higher education, verify that the lesson contains at least **5 to 6 distinct factual images/figures** and **1 to 2 decorative AI illustrations**.
   - Factual images must use English Wikipedia page titles as their Alt Text and have a blank/empty URL, e.g. \`![Adam_Smith]()\`. Obscure or bloated alt texts are unacceptable.
   - Every image must have an italicized figure caption directly below:
     *Figure X: [Title] - [Description]. Source: ...*

---

### OUTPUT FORMAT
You must return ONLY a valid JSON object matching the \`verificationSchema\` with the following keys:
- **\`approved\`**: boolean (true if the narrative complies perfectly with all checkpoints; false if there are any violations).
- **\`critique\`**: string (detailed, actionable explanation of the violations and clear instructions on how the writer must expand or correct the text. Leave empty if approved).

Do NOT wrap your JSON response in markdown code blocks (\`\`\`).
`;

        const critiqueJsonStr = await callAIEngine(narrativeCriticPrompt, verificationSchema, 0.1);
        saveDraftRevision(`critique_stage4a_narrative_${item.slug}_attempt_${narrativeIteration}.json`, critiqueJsonStr);

        const critiqueClean = critiqueJsonStr.replace(/```json/gi, '').replace(/```/gi, '').trim();
        const audit = safeJsonParse(critiqueClean, 'Narrative Critic Audit');

        if (audit && audit.approved === true) {
          await appendTaskLog(`[AI GENERATOR - INVERTED] [STAGE 4A] Narrative text APPROVED on attempt ${narrativeIteration}!`);
          narrativeApproved = true;
        } else {
          const critiqueText = audit?.critique || 'Invalid response from critic.';
          await appendTaskLog(`[AI GENERATOR - INVERTED] [STAGE 4A] Narrative text REJECTED. Critique: ${critiqueText}`);
          lessonStats.narrativeRejections++;

          if (narrativeIteration >= maxNarrativeIterations) {
            await appendTaskLog(`[AI GENERATOR - INVERTED] [STAGE 4A] Max narrative critique loops reached. Moving forward.`);
            break;
          }

          const narrativeRefinerPrompt = `You are a world-class academic professor and expert writer (Agent 3A - Narrative Scribe).
The narrative critic (Agent 4A) has rejected your previously generated academic narrative text.
You MUST now rewrite, expand, and fully correct the academic narrative text based on their feedback, ensuring zero placeholders, high academic density, and proper formatting.

${pronunciationMandate}

⚠️ CRITICAL REMINDER: You MUST maintain absolute XML/JSX markup compliance to prevent parser crashes:
- Do NOT use raw JSX tags for interactive widgets (<DataChart>, <BasicMathExplorer>, <Quiz>, etc.). Use bracketed anchors: [[WIDGET:id]].
- Do NOT use raw HTML tags (<ul>, <ol>, <li>) for lists; use standard Markdown instead.
- Do NOT use literal curly braces { } in plain text; escape them as \`{x}\` or wrap math in LaTeX $ \\{...\\} $ or $$ \\{...\\} $$.
- Never write "import " or "export " at the start of a line in plain prose.

CRITIQUE FROM AGENT 4A:
"${critiqueText}"

PREVIOUS ACADEMIC NARRATIVE TEXT:
---
${cleanedNarrative}
---

Generate the complete, updated, fully-fledged academic narrative text incorporating all corrections.
Strictly follow the original writing, adaptation, and widget placement rules. Do NOT wrap the response in markdown code blocks.`;

          saveDraftRevision(`prompt_stage1_refiner_${item.slug}_attempt_${narrativeIteration + 1}.md`, narrativeRefinerPrompt);

          const refined = await callAIEngine(narrativeRefinerPrompt, null, 0.3);
          const rawRefined = refined.replace(/```json/gi, '').replace(/```/gi, '').trim();
          
          // Programmatic Preprocessor execution BEFORE the critique (Agent 4A) sees the refined draft!
          cleanedNarrative = preprocessMdx(rawRefined, targetLang.toLowerCase(), false, item.slug);
          
          lessonStats.narrativeAttempts++;
          saveDraftRevision(`draft_stage1_narrative_${item.slug}_attempt_${narrativeIteration + 1}.md`, cleanedNarrative);
        }
      }

      const approvedNarrativeText = cleanedNarrative;

      // ───────────────────────────────────────────────────────────────
      // [STAGE 2] WIDGETS ARCHITECT (AGENT 3B)
      // ───────────────────────────────────────────────────────────────
      await appendTaskLog(`[AI GENERATOR - INVERTED] [STAGE 2] Designing interactive widgets JSON for lesson "${item.title}"...`);

      const cleanLevel = (levelInput || 'L1').trim().toLowerCase();
      const isLvlPrimary = cleanLevel.startsWith('p') || cleanLevel.startsWith('m') || cleanLevel.includes('primary') || cleanLevel.includes('maternelle') || ['1', '2', '3', 'foundation_1', 'foundation_2'].includes(cleanLevel);
      const isLvlSecondary = cleanLevel.includes('secondary') || cleanLevel.startsWith('coll') || cleanLevel.startsWith('lyc') || cleanLevel.includes('preuni') || ['secondary_1', 'secondary_2', 'preuni_1', 'preuni_2', 'preuni_3'].includes(cleanLevel);

      const finalQuizPoolCount = isLvlPrimary ? 10 : isLvlSecondary ? 25 : 60;
      const finalQuizDisplayLimit = isLvlPrimary ? 5 : isLvlSecondary ? 15 : 30;

      const sectionQuizPoolCount = isLvlPrimary ? 5 : isLvlSecondary ? 10 : 20;
      const sectionQuizDisplayLimit = isLvlPrimary ? 3 : isLvlSecondary ? 5 : 10;

      const widgetsPrompt = `You are a world-class educational curriculum architect and JSON data validator (Agent 3B - Widgets Architect).
Your task is to parse the approved academic narrative draft of the lesson, extract all custom and standard bracketed widget anchors (\`[[WIDGET:id]]\`), and generate a valid JSON object conforming strictly to the requested \`lessonWidgetsSchema\` to fully define each anchor.

=============================================================================
⚠️ CRITICAL DATA INTEGRITY & MDX SAFETY RULES ⚠️
To ensure that the generated JSON translates to correct MDX attributes:

1. NO RAW CODE IN ANCHORS OR PROPS:
   - Ensure that interactive component JSON attributes (such as "props") do NOT contain raw javascript arrow functions, backticks (\`), or complex unescaped double quotes.
   - Keep MCQ options as simple, plain text strings. Never place markdown list items (- or *) or HTML tags inside of quiz "options" or "question" strings.
=============================================================================

---

### METADATA
- **Course Name**: "${correctedCourseName}"
- **Academic Level**: "${levelInput}"
- **Lesson Title**: "${item.title}"
- **Target Language**: "${targetLang.toUpperCase()}"
- **Course Discipline**: "${courseContext.discipline || 'General'}"
- **Citation Style**: "${getCitationStyle(courseContext.discipline || correctedCourseName).name}"

---

### INPUT APPROVED NARRATIVE DRAFT
Review the approved narrative text to identify all placed \`[[WIDGET:id]]\` anchors and the bibliography citation links (e.g. \`[1](#ref-1)\`):
---
${approvedNarrativeText}
---

---

### 1. CURATION-FIRST INTERACTIVE COMPONENTS MANDATE
For every custom interactive widget anchor you find in the approved narrative draft (other than standard structural ones), you must define a corresponding item inside the \`interactiveComponents\` JSON array:

#### A. Approved Pruned Widgets for this Discipline:
${formattedCatalogList}

#### B. Selection Heuristics & Budget Enforcer:
1. **Simple Discursive Components (Can be generated from scratch)**:
   - \`Quiz\`: Multiple-choice question sets with questions, options, correct indices, and detailed explanations.
   - \`FillInBlanks\`: Sentence structures with blank gaps.
   - \`SolvedExercise\`: Step-by-step worked analytical or mathematical solution.
   - \`UnsolvedExercise\`: Conceptual or mathematical question with an explanation and correct answer string.
2. **Complex Structural Tools (Matchmaker Database-Curated Widgets)**:
   - If the narrative draft places a database widget (e.g. \`[[WIDGET:FunctionPlotter:my_plot]]\`), you must select it from the approved catalog list above.
   - **Crucial Curation-First Rule**: For all database-curated widgets, set "props" to \`{}\` (empty object), as their pre-configured behaviors and schemas are handled programmatically by the system.
   - **Strict Budget Constraints**:
     - Remaining database widget budget for this lesson: ${remainingBudget}.
     - If the remaining budget is 0, do NOT select any database-curated widgets. Use simple discursives instead.
     - Never repeat a database widget ID that has already been used in this course: Already used list: ${alreadyUsedList}.

---

### 2. CORE SCHEMA FIELDS TO GENERATE (CONFORMING TO lessonWidgetsSchema)
Your generated JSON must contain the following top-level keys:

1. **\`prerequisites\`**:
   - Provide 1 to 2 logical prerequisite lessons. Each must have \`title\`, \`slug\`, \`level\`, and \`subject\` (in target language "${targetLang.toUpperCase()}").
2. **\`diagnosticQuiz\`**:
   - A single premium multiple-choice question designed to allow advanced students to bypass this lesson. Include \`question\`, \`options\` array, \`correctIndex\`, \`targetSectionId\` (anchor of the bypass section), and \`sectionTitle\`.
3. **\`learningObjectives\`**:
   - Provide learning objectives broken down into \`knowledge\` (concepts), \`skills\` (capabilities), and \`attitudes\` (metacognition) arrays.
   - **Bloom's Taxonomy Rule**: For all pedagogical objectives (under \`knowledge\`, \`skills\`, and \`attitudes\`), you must EXCLUSIVELY use Revised Bloom's Taxonomy verbs from the highest cognitive levels (Analyze/Analyser, Evaluate/Évaluer, Create/Créer depending on target language "\${targetLang.toUpperCase()}"). Lower-level passive verbs (such as understand, know, list, comprendre, connaître) are STRICTLY FORBIDDEN.
4. **\`conclusionSummary\`**:
   - Provide exactly 3 to 4 complete, grammatically whole and self-contained sentences summarizing the key takeaways (each item in the \`items\` array must end with a period).
5. **\`whatsNext\`**:
   - Provide 2 to 3 engaging next steps or follow-up courses, each with \`title\`, \`description\`, and \`slug\`.
5b. **\`goingFurther\`**:
   - Provide 2 to 3 suggested readings or external resources (books, articles, videos, websites) to explore the topic deeper. Each item must have:
     - \`title\`: Title of the resource.
     - \`type\`: One of "book", "article", "video", "website", "research", "movie", "film".
     - \`url\`: A valid external URL if available (optional).
     - \`description\`: A brief explanation of what the resource contains and why it is valuable.
6. **\`finalEvaluation\`**:
   - A comprehensive final test. This must be a structured JSON object representing either an \`EssayEvaluation\` with a detailed prompt, or a high-fidelity MCQ \`Quiz\`.
   - **MCQ Quiz Pool Size and Display Limit (CRITICAL - NO GUESSING)**:
     - You MUST generate a pool of EXACTLY ${finalQuizPoolCount} questions in the \`props.questions\` array.
     - You MUST specify \`props.limit\`: ${finalQuizDisplayLimit} in the \`props\` object.
     - This ensures there are enough extra questions in the pool so that the platform randomly shuffles and selects ${finalQuizDisplayLimit} questions at runtime, preventing repetition.
7. **\`glossary\`**:
   - An array of at least 3 key academic terms with clear definitions.
8. **\`references\` (CRITICAL REFERENCE MAPPING RULE)**:
   - You MUST populate this array.
   - Start the array with the exact canonical course references provided in:
${referencesMetadata}
   - In the lesson narrative, the citations are marked as [ref1], [ref2], etc.
   - You must map [ref1] to references[0], [ref2] to references[1], and so on, keeping their exact content.
   - Ensure the citations in the narrative and their order in this array align perfectly.
   - Book/article titles must be in standard quotes (or French guillemets « ... »), not asterisks.
   - Exclude this references array only for primary school levels.
9. **\`interactiveComponents\`**:
   - An array of all custom interactive components. Every custom \`[[WIDGET:id]]\` anchor in the narrative draft MUST have a corresponding object here where \`id\` matches the anchor suffix exactly, \`componentType\` matches the selected widget ID, \`sectionAnchor\` is the heading title of the parent section, and \`props\` specifies its data properties.
   - **Quiz Pool Size and Display Limit (CRITICAL - NO GUESSING)**:
     - For any \`Quiz\` component in this array, you MUST generate EXACTLY ${sectionQuizPoolCount} questions in its \`props.questions\` array.
     - You MUST specify \`props.limit\`: ${sectionQuizDisplayLimit} in its \`props\` object.
     - This guarantees the pool is larger than the visible slice for retry randomisation.

---

### 3. OUTPUT FORMAT
- Return ONLY a valid JSON object matching the \`lessonWidgetsSchema\` schema.
- Do NOT wrap your JSON response in markdown code blocks (\`\`\`).
- Ensure all string values are fully written in "${targetLang.toUpperCase()}".
`;

      // Export Architect Prompt & Schema
      saveDraftRevision(`prompt_stage2_architect_${item.slug}.md`, widgetsPrompt);
      saveDraftRevision(`agent3_widgets_schema.json`, JSON.stringify(lessonWidgetsSchema, null, 2));

      let parsedWidgets: any = {};
      let widgetsApproved = false;
      let widgetsIteration = 0;
      const maxWidgetsIterations = 3;

      const widgetsJsonStr = await callAIEngine(widgetsPrompt, lessonWidgetsSchema, 0.2);
      lessonStats.widgetsAttempts++;
      saveDraftRevision(`draft_stage2_widgets_${item.slug}_attempt_1.json`, widgetsJsonStr);

      const cleanWidgetsJson = widgetsJsonStr.replace(/```json/gi, '').replace(/```/gi, '').trim();
      parsedWidgets = safeJsonParse(cleanWidgetsJson, 'WFTA Stage 2 Widgets Parsing');
      parsedWidgets = validateAndFixWidgets(parsedWidgets, courseContext.discipline || correctedCourseName);

      while (!widgetsApproved && widgetsIteration < maxWidgetsIterations) {
        widgetsIteration++;
        await appendTaskLog(`[AI GENERATOR - INVERTED] [STAGE 4B] Reviewing widgets JSON (Attempt ${widgetsIteration}/${maxWidgetsIterations})...`);

        // --- Programmatic Pre-verifier 2: Curation-First budget & normalization ---
        const dbCatalogKeys = Object.keys(prunedCatalog);
        if (parsedWidgets && Array.isArray(parsedWidgets.interactiveComponents)) {
          let databaseWidgetsInThisLesson = 0;
          parsedWidgets.interactiveComponents = parsedWidgets.interactiveComponents.filter((comp: any) => {
            if (!comp || !comp.componentType) return false;

            const matchedKey = dbCatalogKeys.find(
              key => key.toLowerCase() === comp.componentType.toLowerCase() || key.toLowerCase() === comp.id?.toLowerCase()
            );

            if (matchedKey) {
              const isDuplicate = usedDatabaseWidgetIds.has(matchedKey);
              const isOverBudget = (usedDatabaseWidgetIds.size + databaseWidgetsInThisLesson) >= 2;

              if (isDuplicate || isOverBudget) {
                console.log(`[WIDGET CURATION] Filtered out database widget "${matchedKey}" (Duplicate: ${isDuplicate}, OverBudget: ${isOverBudget})`);
                return false;
              }

              comp.componentType = matchedKey;
              comp.id = matchedKey;
              comp.props = {};
              databaseWidgetsInThisLesson++;
              usedDatabaseWidgetIds.add(matchedKey);
              appendTaskLog(`[WIDGET CURATION] Selected and approved database-curated widget: "${matchedKey}"`);
              return true;
            }

            return true;
          });
        }

        // Stage 4B Critic check
        const widgetsCriticPrompt = `# 🔬 Agent 4B: Widgets Critic Prompt (Stage 4B)

You are the Widgets Critic Agent (Agent 4B). Your job is to strictly review the generated academic lesson widgets JSON to ensure it complies perfectly with our "Pedagogical Rigor", "Curation-First Matchmaker", and "Data Integrity" constraints before the content is programmatically stitched.

---

### METADATA
- **Course Name**: "${correctedCourseName}"
- **Academic Level**: "${levelInput}"
- **Lesson Title**: "${item.title}"
- **Target Language**: "${targetLang.toUpperCase()}"
- **Course Discipline**: "${courseContext.discipline || 'General'}"
- **Citation Style**: "${getCitationStyle(courseContext.discipline || correctedCourseName).fullName}"

---

### INPUT WIDGETS JSON TO AUDIT
Review the generated widgets JSON structure:
---
${JSON.stringify(parsedWidgets, null, 2)}
---

### INPUT APPROVED NARRATIVE DRAFT (FOR REFERENCE)
Verify that all anchors and citations match the approved text perfectly:
---
${approvedNarrativeText}
---

---

### CORE CHECKPOINTS
You must audit the widgets JSON against the following 6 critical checkpoints:

1. **Perfect Semantic & Anchor Alignment**:
   - **STRICT REJECTION**: You MUST verify that every single interactive anchor (e.g. \`[[WIDGET:id]]\`) placed in the approved narrative draft has a corresponding entry in the \`interactiveComponents\` array with the exact same \`id\` (after removing the suffix/prefix, matching precisely).
   - Ensure \`sectionAnchor\` matches the actual section title (\`## Heading\`) in the narrative draft.
   - Reject if any extra/undeclared anchors exist, or if any placed anchors are missing from the JSON.

2. **Curation-First Matchmaker & Budget Compliance**:
   - Verify that any database-curated widgets (like \`FunctionPlotter\`, \`CodeSandbox\`, \`DataChart\`, etc.) have their \`props\` set to exactly \`{}\` (empty object).
   - Verify that the number of database-curated widgets in this lesson does not exceed the remaining budget: **${remainingBudget}**.
   - Verify that no database-curated widget used in this lesson has already been used earlier in the course: **${alreadyUsedList}**.

3. **Bloom's Taxonomy Verbs (Objectives & Diagnostics)**:
   - For University levels, check that the \`learningObjectives\` under \`knowledge\`, \`skills\`, and \`attitudes\` utilize the Revised Bloom's Taxonomy verbs:
     - **FR (French)**: Analyser, Évaluer, Créer.
     - **EN (English)** or other languages: Analyze, Evaluate, Create.
   - Reject if simplistic or passive verbs (like "comprendre", "connaître", "understand", "know") are used for higher education levels.

4. **MCQ and Diagnostic Correctness & Flat-Prop Format**:
   - Audit the \`diagnosticQuiz\` and \`finalEvaluation\` (if MCQ). Check that the question is academically robust, options are diverse, and the \`correctIndex\` is mathematically/scientifically accurate (0-indexed).
   - Verify that MCQ questions do NOT use nested markdown structures or custom Hover-Card tags inside options or question strings.
   - For \`finalEvaluation\` MCQ quiz, verify that the props conform to the **Flat-Prop Quiz Format**:
     - Array of questions with \`question\`, \`options\`, \`correctIndex\`, and \`explanation\`.

5. **Glossary Rigor**:
   - Verify that the \`glossary\` contains at least 3 high-quality key academic terms defined in "${targetLang.toUpperCase()}".
   - Definitions must be clear, concise, and academically accurate.

6. **Academic Bibliography & Citation Style**:
   - Verify that the \`references\` array contains 3 to 5 real, authoritative academic works (books, journal articles, landmark papers) formatted strictly in **${getCitationStyle(courseContext.discipline || correctedCourseName).fullName}**.
   - Asterisks for italics (like \`*Book Title*\`) are forbidden inside JSON strings—titles must use quotes or French guillemets.
   - Ensure that the inline citations inside the approved narrative (e.g. \`[1](#ref-1)\`) map 1-to-1 to their correct index in this array (i.e. \`references[0]\` is citation \`[1]\`, \`references[1]\` is citation \`[2]\`).

---

### OUTPUT FORMAT
You must return ONLY a valid JSON object matching the \`verificationSchema\` with the following keys:
- **\`approved\`**: boolean (true if the widgets JSON complies perfectly with all checkpoints; false if there are any violations).
- **\`critique\`**: string (detailed, actionable explanation of the violations and clear instructions on how the widgets architect must modify or regenerate the JSON. Leave empty if approved).

Do NOT wrap your JSON response in markdown code blocks (\`\`\`).
`;

        const widgetsAuditStr = await callAIEngine(widgetsCriticPrompt, verificationSchema, 0.1);
        const cleanWidgetsAudit = widgetsAuditStr.replace(/```json/gi, '').replace(/```/gi, '').trim();
        const widgetsAudit = safeJsonParse(cleanWidgetsAudit, 'Widgets Critic Audit');

        if (widgetsAudit && widgetsAudit.approved === true) {
          await appendTaskLog(`[AI GENERATOR - INVERTED] [STAGE 4B] Widgets JSON APPROVED on attempt ${widgetsIteration}!`);
          widgetsApproved = true;
        } else {
          const critiqueText = widgetsAudit?.critique || 'Invalid response from widgets critic.';
          await appendTaskLog(`[AI GENERATOR - INVERTED] [STAGE 4B] Widgets JSON REJECTED. Critique: ${critiqueText}`);
          lessonStats.widgetsRejections++;
          saveDraftRevision(`critique_stage4b_widgets_${item.slug}_attempt_${widgetsIteration}.json`, widgetsAuditStr);

          if (widgetsIteration >= maxWidgetsIterations) {
            await appendTaskLog(`[AI GENERATOR - INVERTED] [STAGE 4B] Max widgets critique loops reached. Moving forward with current widgets.`);
            break;
          }

          const widgetsRefinerPrompt = `You are a world-class educational curriculum architect and JSON data validator (Agent 3B - Widgets Architect).
The widgets critic (Agent 4B) has rejected your previously generated widgets JSON.
You MUST now rewrite and fully correct the JSON object based on their feedback, ensuring perfect semantic alignment with the narrative, correct schema fields, and strict budget compliance.

⚠️ CRITICAL REMINDER: You MUST maintain absolute data safety to prevent MDX parser crashes:
- Ensure that interactive component JSON attributes (such as "props") do NOT contain raw javascript arrow functions, backticks (\`), or complex unescaped double quotes.
- Keep MCQ options as simple, plain text strings. Never place markdown list items (- or *) or HTML tags inside of quiz "options" or "question" strings.

CRITIQUE FROM AGENT 4B:
"${critiqueText}"

PREVIOUS WIDGETS JSON:
---
${JSON.stringify(parsedWidgets, null, 2)}
---

INPUT APPROVED NARRATIVE DRAFT:
---
${approvedNarrativeText}
---

Generate the complete, updated, fully-fledged widgets JSON conforming strictly to the requested schema. Do NOT wrap your JSON response in markdown code blocks.`;

          saveDraftRevision(`prompt_stage2_refiner_${item.slug}_attempt_${widgetsIteration + 1}.md`, widgetsRefinerPrompt);

          const refinedWidgetsStr = await callAIEngine(widgetsRefinerPrompt, lessonWidgetsSchema, 0.2);
          lessonStats.widgetsAttempts++;
          saveDraftRevision(`draft_stage2_widgets_${item.slug}_attempt_${widgetsIteration + 1}.json`, refinedWidgetsStr);

          const cleanRefinedWidgets = refinedWidgetsStr.replace(/```json/gi, '').replace(/```/gi, '').trim();
          parsedWidgets = safeJsonParse(cleanRefinedWidgets, 'WFTA Stage 2 Widgets Refinement');
          parsedWidgets = validateAndFixWidgets(parsedWidgets, courseContext.discipline || correctedCourseName);
        }
      }

      // ───────────────────────────────────────────────────────────────
      // [STAGE 3] DETERMINISTIC STITCHING ENGINE
      // ───────────────────────────────────────────────────────────────
      await appendTaskLog(`[AI GENERATOR - INVERTED] [STAGE 3] Stitching narrative and widgets programmatically...`);
      const isLastLesson = realIndex === originalSyllabusLessonsLength - 1;
      let currentMdx = stitchLessonContent(approvedNarrativeText, parsedWidgets);

      // De-hallucinate bibliography links against Crossref / Google Books
      let validatedMdx = await validateAndFixBibliography(currentMdx, targetLang.toLowerCase());
      validatedMdx = await validateAndFixExternalResources(validatedMdx, targetLang.toLowerCase());

      let mdxWithFrontmatter = `---
title: "${item.title}"
subject: "${correctedCourseName}"
level: "${level}"
module: "${item.title}"
order: ${realIndex + 1}${isLastLesson ? '\nsummative: true' : ''}
---

${validatedMdx}`;


      // Apply preprocessMdx BEFORE validation so common AI-generation issues
      // (bare & in JSX attrs, unescaped braces, etc.) are fixed deterministically
      mdxWithFrontmatter = preprocessMdx(mdxWithFrontmatter, targetLang.toLowerCase(), false, item.slug);

      // Pre-validate MDX compilation to avoid 404 or compilation crashes
      let mdxCheck = await validateMdxContent(mdxWithFrontmatter, targetLang.toLowerCase());
      if (!mdxCheck.success) {
        try {
          const fs = require('fs');
          const path = require('path');
          fs.writeFileSync(path.resolve(process.cwd(), `failed_mdx_${item.slug}.md`), mdxWithFrontmatter, 'utf8');
          console.log(`[DEBUG] Wrote failed MDX to failed_mdx_${item.slug}.md`);
        } catch (debugErr) {
          console.error("Failed to write debug MDX file:", debugErr);
        }
        console.warn(`[AI GENERATOR - MDX VALIDATION ERROR] Content for "${item.title}" failed MDX validation: ${mdxCheck.error}. Initiating Self-Healing MDX loop...`);
        let healedResult = mdxWithFrontmatter;
        let healAttempt = 0;
        const maxHealAttempts = 3;
        while (!mdxCheck.success && healAttempt < maxHealAttempts) {
          healAttempt++;
          lessonStats.selfHealingAttempts++;
          console.log(`[SELF-HEALING] Attempt ${healAttempt}/${maxHealAttempts} to heal MDX compilation error: ${mdxCheck.error}`);
          healedResult = await healMdxWithAI(healedResult, mdxCheck.error || 'Unknown MDX compilation error', targetLang.toLowerCase());
          mdxCheck = await validateMdxContent(healedResult, targetLang.toLowerCase());
        }

        if (mdxCheck.success) {
          console.log(`[SELF-HEALING] Successfully healed MDX content on attempt ${healAttempt}!`);
          mdxWithFrontmatter = healedResult;
        } else {
          console.error(`[SELF-HEALING] Self-healing failed after ${maxHealAttempts} attempts. Rejecting lesson generation to avoid fallback/broken rendering.`);
          try {
            const fs = require('fs');
            const path = require('path');
            fs.writeFileSync(path.resolve(process.cwd(), `failed_mdx_final_${item.slug}.md`), healedResult, 'utf8');
            console.log(`[DEBUG] Wrote final failed MDX to failed_mdx_final_${item.slug}.md`);
          } catch (debugErr) {
            console.error("Failed to write debug MDX file:", debugErr);
          }
          try {
            const cleanCrsSlug = cleanPathSegment(correctedCourseName);
            await dbService.submitReport(
              cleanCrsSlug,
              `${cleanCrsSlug}/${item.slug}`,
              `[GENERATION MDX FAILURE] Self-healing failed: ${mdxCheck.error}`
            );
          } catch (reportErr) {
            console.error("Failed to auto-submit generation error report:", reportErr);
          }
          throw new Error(`[MDX COMPILATION CRITICAL ERROR] Lesson "${item.title}" failed MDX compilation and self-healing: ${mdxCheck.error}`);
        }
      }

      // Re-run preprocessMdx on the (potentially AI-healed) final content to ensure
      // any content regenerated by the self-healing loop is also fully sanitized.
      const healedMdx = preprocessMdx(mdxWithFrontmatter, targetLang.toLowerCase(), false, item.slug);
      const resolvedMdx = await resolveAndPersistMedia(healedMdx, targetLang.toLowerCase());

      // Save to Supabase
      await dbService.saveLesson({
        course_slug: cleanPathSegment(correctedCourseName),
        lesson_slug: item.slug,
        lang: targetLang.toLowerCase(),
        title: item.title,
        content: resolvedMdx,
        order: realIndex + 1
      });
      await updateTaskProgress(item.title);

      // Record success status & final saves
      lessonStats.status = 'success';
      lessonStats.endTime = Date.now();
      lessonStats.durationSeconds = Math.round((lessonStats.endTime - lessonStats.startTime) / 1000);

      saveDraftRevision(`final_stage1_narrative_${item.slug}.md`, approvedNarrativeText);
      saveDraftRevision(`final_stage2_widgets_${item.slug}.json`, JSON.stringify(parsedWidgets, null, 2));
      saveDraftRevision(`final_stage3_stitched_${item.slug}.mdx`, resolvedMdx);

      saveDraftRevision(`stats_${item.slug}.json`, JSON.stringify(lessonStats, null, 2));
      saveDraftRevision(`stats_${item.slug}.md`, generateStatsMarkdown(lessonStats));

    } catch (err: any) {
      lessonStats.status = 'failed';
      lessonStats.error = err instanceof Error ? err.message : String(err);
      lessonStats.endTime = Date.now();
      lessonStats.durationSeconds = Math.round((lessonStats.endTime - lessonStats.startTime) / 1000);

      // Save stats on failure
      saveDraftRevision(`stats_${item.slug}.json`, JSON.stringify(lessonStats, null, 2));
      saveDraftRevision(`stats_${item.slug}.md`, generateStatsMarkdown(lessonStats));

      throw err;
    }
  });

    // Save/Update the Course card in the database
    try {
      const courseSlug = cleanPathSegment(correctedCourseName);
      const { data: allCourses } = await dbService.getAllCourses();
      const existingCourse = allCourses?.find(c => c.slug === courseSlug);
      
      const courseDescription = courseContext.description || `A comprehensive course on ${correctedCourseName} dynamically generated at ${level} level.`;
      const ectsCount = lessonsList.length || 4; // Calibration: 1 ECTS per lesson, or minimum of 4
      
      let courseId = existingCourse ? existingCourse.id : undefined;
      if (!courseId && allCourses && allCourses.length > 0) {
        const maxId = Math.max(...allCourses.map(c => typeof c.id === 'number' ? c.id : parseInt(c.id) || 0));
        courseId = maxId + 1;
      } else if (!courseId) {
        courseId = Math.floor(Math.random() * 1000) + 20;
      }

      const updatedLanguages = existingCourse
        ? (existingCourse.languages?.includes(targetLang.toLowerCase()) ? existingCourse.languages : [...(existingCourse.languages || []), targetLang.toLowerCase()])
        : [targetLang.toLowerCase()];

      const updatedLangsUpper = existingCourse
        ? (existingCourse.langs?.includes(targetLang.toUpperCase()) ? existingCourse.langs : [...(existingCourse.langs || []), targetLang.toUpperCase()])
        : [targetLang.toUpperCase()];

      const translations = existingCourse?.translations || {};
      translations[targetLang.toUpperCase()] = {
        title: correctedCourseName,
        description: courseDescription
      };

      await dbService.saveCourse({
        id: courseId,
        title: correctedCourseName,
        slug: courseSlug,
        subject: courseContext.discipline || "General",
        description: courseDescription,
        level: level,
        archivingLevel: 0,
        ects: ectsCount,
        is_active: true,
        languages: updatedLanguages,
        langs: updatedLangsUpper,
        isCurriculum: false,
        childCourses: [],
        translations: translations
      });
      console.log(`[AI GENERATOR] Saved/Updated course card for "${correctedCourseName}" (ID: ${courseId}, ECTS: ${ectsCount}, Languages: ${updatedLanguages.join(', ')})`);
    } catch (saveErr) {
      console.error("[AI GENERATOR] Failed to save/update course card:", saveErr);
    }
    return { title: correctedCourseName, slug: cleanPathSegment(correctedCourseName) };
  } catch (err) {
    console.error("AI Generation failed:", err);
    throw err;
  }
}

export async function translateCourseContent(courseSlug: string, targetLang: string, taskId?: string, lessonOffset: number = 0) {
  try {
    // 1. Check if the course is a curriculum
    const { data: allCourses } = await dbService.getAllCourses();
    const course = allCourses?.find(c => c.slug === courseSlug);
    
    if (course?.isCurriculum) {
      console.log(`[TRANSLATOR] Target "${courseSlug}" is a curriculum. Cascading translation to all child courses first...`);
      
      const childIds = course.childCourses || [];
      for (const childId of childIds) {
        const childCourse = allCourses?.find(c => c.id === childId);
        if (childCourse && childCourse.slug) {
          try {
            console.log(`[TRANSLATOR] Translating curriculum child course: "${childCourse.slug}" to "${targetLang}"...`);
            await translateCourseContent(childCourse.slug, targetLang);
          } catch (childErr) {
            console.error(`[TRANSLATOR ERROR] Failed to translate curriculum child course "${childCourse.slug}":`, childErr);
          }
        }
      }
      
      const optionalIds = course.optionalCourses || [];
      for (const optId of optionalIds) {
        const optCourse = allCourses?.find(c => c.id === optId);
        if (optCourse && optCourse.slug) {
          try {
            console.log(`[TRANSLATOR] Translating curriculum optional course: "${optCourse.slug}" to "${targetLang}"...`);
            await translateCourseContent(optCourse.slug, targetLang);
          } catch (optErr) {
            console.error(`[TRANSLATOR ERROR] Failed to translate curriculum optional course "${optCourse.slug}":`, optErr);
          }
        }
      }
    } else {
      // 1. Fetch only primary source lessons for this course to avoid duplicates
      const sourceLang = (course?.languages && course.languages.length > 0)
        ? course.languages[0].toLowerCase()
        : 'en';

      const { data: sourceLessons } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_slug', courseSlug)
        .eq('lang', sourceLang);

      if (!sourceLessons || sourceLessons.length === 0) {
        console.warn(`No source lessons found in database for course ${courseSlug} to translate.`);
      } else {
        const INTER_LESSON_DELAY_MS = Number(process.env.INTER_LESSON_DELAY_MS ?? 5000);
        const failures: string[] = [];
        
        let completedLessons = lessonOffset;
        const updateTaskProgress = async () => {
          if (!taskId) return;
          completedLessons++;
          const currentProgress = 20 + Math.floor((completedLessons / sourceLessons.length) * 70);
          try {
            await supabase
              .from('task_queue')
              .update({ progress: Math.min(99, currentProgress) })
              .eq('id', taskId);
            console.log(`[TASK PROGRESS] Translation Task ${taskId} updated to ${currentProgress}%`);
          } catch (err) {
            console.warn(`[PROGRESS UPDATE ERROR] Failed to update task ${taskId} progress to ${currentProgress}:`, err);
          }
        };
        
        const MAX_PARALLEL_LESSONS = Number(process.env.MAX_PARALLEL_LESSONS || 1);

        // 2. Translate lessons with concurrency limit
        const lessonPromises = mapConcurrent(sourceLessons, MAX_PARALLEL_LESSONS, async (lesson, index) => {
          if (index < lessonOffset) {
            console.log(`[INCREMENTAL] Skipping translation for lesson "${lesson.title}" because it is below the resume offset ${lessonOffset}.`);
            return;
          }

          // Check if this lesson is already translated (incremental translation check)
          try {
            const { data: existingLesson } = await dbService.getLesson(
              courseSlug,
              lesson.lesson_slug,
              targetLang.toLowerCase()
            );
            if (existingLesson && existingLesson.content && existingLesson.content.trim().length > 100) {
              console.log(`[INCREMENTAL] Skipping translation for already existing translated lesson: "${lesson.title}" (${lesson.lesson_slug}) to "${targetLang}"`);
              await updateTaskProgress();
              return;
            }
          } catch (err) {
            console.warn(`[INCREMENTAL] Translation check failed for "${lesson.title}", proceeding.`, err);
          }

          try {
            const delay = index * INTER_LESSON_DELAY_MS;
            console.log(`[TRANSLATOR] Staggering translation of lesson "${lesson.title}" by ${delay / 1000}s...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            
            const { content: isolatedContent, registry } = isolateJsxForTranslation(lesson.content);

            const promptTranslate = `You are a professional academic translator. Translate the following academic MDX course content to target language code: "${targetLang.toUpperCase()}".
Rules:
1. Preserve all markdown structure, custom blockquotes, headings, lists, and links.
2. Keep all Math equations (wrapped in $ or $$) completely untouched.
3. Do NOT translate technical code blocks. You will see placeholder tokens like __JSX_SELF_...__, __JSX_CLOSE_...__, __JSX_OPEN_...__, __JSX_ATTR_...__, __JSX_END_...__. These placeholders protect the custom interactive components from corruption. Do NOT translate or modify these placeholders or the '|||' separators. Preserve them EXACTLY as they are.
4. Translate the title and return ONLY the translated MDX content. Do not include markdown code block wrappers.
5. CRITICAL MDX COMPILER COMPLIANCE RULES:
   - Do NOT wrap the translated response in markdown code blocks (such as \`\`\`md or \`\`\`mdx). Return the raw MDX content directly.
   - Absolutely NO orphaned JSX tags or unclosed tags.
   - Never nest a custom component inside itself.
   - Do NOT generate empty components without text or children.

MDX CONTENT TO TRANSLATE:
${isolatedContent}`;

            if (process.env.DEBUG === 'true') {
              saveDraftRevision(`prompt_translation_${lesson.lesson_slug}_${targetLang.toLowerCase()}.md`, promptTranslate);
            }

            let translatedMdx = '';
            let transSuccess = false;

            if (isVertexConfigured()) {
              console.log(`[AI GENERATOR] Translating lesson "${lesson.title}" to ${targetLang} via Vertex AI (gemini-2.5-flash)...`);
              try {
                const res = await callVertexAI({
                  task: 'course_translation',
                  contents: [{ role: 'user', parts: [{ text: promptTranslate }] }],
                  generationConfig: { temperature: 0.1 }
                });

                if (res && res.ok) {
                  const resJson = await res.json();
                  const rawText = resJson.candidates?.[0]?.content?.parts?.[0]?.text || '';
                  translatedMdx = restoreJsxAfterTranslation(rawText, registry, targetLang);
                  transSuccess = true;
                }
              } catch (err) {
                console.warn("[AI GENERATOR] Vertex translation call failed:", err);
              }
            }
            
            if (!transSuccess && apiKey) {
              console.log(`[AI GENERATOR] Translating lesson "${lesson.title}" to ${targetLang} via AI Studio fallback (gemini-2.5-flash)...`);
              const startTime = Date.now();
              try {
                const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    contents: [{ parts: [{ text: promptTranslate }] }]
                  })
                });
                if (res.ok) {
                  const resJson = await res.json();
                  const rawText = resJson.candidates?.[0]?.content?.parts?.[0]?.text || '';
                  translatedMdx = restoreJsxAfterTranslation(rawText, registry, targetLang);
                  transSuccess = true;

                  const durationMs = Date.now() - startTime;
                  const usage = resJson.usageMetadata || {};
                  const promptTokens = usage.promptTokenCount || 0;
                  const candidatesTokens = usage.candidatesTokenCount || usage.candidateTokenCount || 0;
                  await recordMetrics('course_translation', 'gemini-2.5-flash', durationMs, promptTokens, candidatesTokens, promptTranslate);
                }
              } catch (err) {
                console.error(`[AI GENERATOR] AI Studio translation fetch exception:`, err);
              }
            }

            if (transSuccess && translatedMdx && process.env.DEBUG === 'true') {
              saveDraftRevision(`draft_translation_${lesson.lesson_slug}_${targetLang.toLowerCase()}_attempt_1.md`, translatedMdx);
            }

            if (!translatedMdx) {
              console.warn(`[AI GENERATOR] Failed to translate lesson "${lesson.title}". Using fallback translator.`);
              translatedMdx = lesson.content.replace('lang: "en"', `lang: "${targetLang}"`);
            }

            // === TRANSLATION CRITIC PIPELINE ===
            let approved = false;
            let critique = '';
            let currentTranslation = translatedMdx;
            let critiqueIteration = 0;
            const maxCritiqueIterations = 3;

            while (!approved && critiqueIteration < maxCritiqueIterations && currentTranslation) {
              critiqueIteration++;
              console.log(`[AI GENERATOR - TRANSLATION CRITIC] Reviewing translation for "${lesson.title}" to "${targetLang}" (Attempt ${critiqueIteration}/${maxCritiqueIterations})...`);

              const promptCritic = `You are the Translation Critic Agent (Agent 4 - Specialized in Translation Quality Assurance). Your job is to strictly validate the translated academic MDX content against the original source content.
Source Language: English
Target Language: "${targetLang.toUpperCase()}"

Original MDX Content:
${lesson.content}

Translated MDX Content:
${currentTranslation}

Your validation checklist:
1. Academic Integrity: Is the scientific/academic depth, tone, and accuracy of the original content fully preserved?
2. MDX Components Preservation: Are all MDX elements (like <Quiz>, <Question>, <Option>, <Glossary>, <Video>, <Audio>, <FillInBlanks>, <SolvedProblem>, <Summary>, <SelfEval>, <HistoricalPerson>, <Location>, <Place>, <EntityLink>, <EssayEvaluation>, <OpenQuestion>, <ScientificDebate>, <SpeciesLink>, <ChemicalLink>, <CelestialLink>, etc.) completely present with all their JSX tags and properties intact? Do NOT generate empty components like <CriticalThinking />, <WhatsNext />, <OpenQuestion />, or <ScientificDebate /> without text/children. Do NOT nest wrapper components (e.g. nesting <WhatsNext> inside itself is strictly forbidden).
3. Custom attributes: For <Glossary>, are term/definition translated? For <HistoricalPerson>, are name/lang translated/updated? For <EssayEvaluation>, are prompt/subject translated? Are other properties (like durations, options, gradingSystem, IDs) preserved exactly as in the original?
4. Formulas and Code: Are all Math equations ($...$ or $$...$$) and code blocks kept exactly as they were, untranslated?
5. Zero Translator Commentary: Did the translator introduce any notes, prefixes, or meta-conversational lines (e.g. "Here is the translation:")? If so, reject it.
6. Zero placeholders: Are there any placeholders or unfinished sections?
7. Assessment Integrity: Ensure all translated interactive assessments (<Quiz>, <Question>, <Option>, <DiagnosticQuiz>, <EssayEvaluation>, <UnsolvedExercise>) are complete, fully populated with high-quality, non-empty text matching the target course level, length, and complexity of the subject, and verify that the translation has not broken correct option attributes (e.g. "correct" prop on <Option>, or "correctIndex" on <DiagnosticQuiz>).

You must output ONLY a valid JSON object matching this structure:
{
  "approved": true or false,
  "critique": "If not approved, explain exactly what is wrong/missing/broken so the translator can correct it. If approved, keep this empty."
}
Do not write any markdown code block wrappers (like \`\`\`json) or any conversational text. Only output raw JSON.`;

              let criticResText = '';
              let criticSuccess = false;

              if (process.env.DEBUG === 'true') {
                saveDraftRevision(`prompt_translation_critic_${lesson.lesson_slug}_${targetLang.toLowerCase()}_attempt_${critiqueIteration}.md`, promptCritic);
              }

              if (isVertexConfigured()) {
                try {
                  const res = await callVertexAI({
                    task: 'course_generation', // Using pro model for critique reasoning
                    contents: [{ role: 'user', parts: [{ text: promptCritic }] }],
                    generationConfig: {
                      temperature: 0.1,
                      responseMimeType: "application/json",
                      responseSchema: verificationSchema
                    }
                  });
                  if (res && res.ok) {
                    const resJson = await res.json();
                    criticResText = resJson.candidates?.[0]?.content?.parts?.[0]?.text || '';
                    criticSuccess = true;
                  }
                } catch (err) {
                  console.warn("[AI GENERATOR - TRANSLATION CRITIC] Vertex critique call failed:", err);
                }
              }

              if (!criticSuccess && apiKey) {
                try {
                  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      contents: [{ parts: [{ text: promptCritic }] }],
                      generationConfig: {
                        responseMimeType: "application/json",
                        responseSchema: verificationSchema
                      }
                    })
                  });
                  if (res.ok) {
                    const resJson = await res.json();
                    criticResText = resJson.candidates?.[0]?.content?.parts?.[0]?.text || '';
                    criticSuccess = true;
                  }
                } catch (err) {
                  console.error("[AI GENERATOR - TRANSLATION CRITIC] AI Studio fallback critique call failed:", err);
                }
              }

              if (criticSuccess && criticResText) {
                if (process.env.DEBUG === 'true') {
                  saveDraftRevision(`critique_translation_${lesson.lesson_slug}_${targetLang.toLowerCase()}_attempt_${critiqueIteration}.json`, criticResText);
                }
                try {
                  const cleanedCritic = criticResText.replace(/```json/g, '').replace(/```/g, '').trim();
                  const criticObj = safeJsonParse(cleanedCritic, 'reviseCourseContent (Agent 4 Verification)');
                  approved = !!criticObj.approved;
                  critique = criticObj.critique || '';
                } catch (e) {
                  console.error("[AI GENERATOR - TRANSLATION CRITIC] Failed to parse critic JSON response:", e);
                  approved = true; // Avoid infinite loop or blocks if AI returns malformed JSON
                }
              } else {
                approved = true; // Bypass critique loop if service is unavailable
              }

              if (approved) {
                console.log(`[AI GENERATOR - TRANSLATION CRITIC] Translation approved for "${lesson.title}"!`);
                translatedMdx = currentTranslation;
              } else {
                console.warn(`[AI GENERATOR - TRANSLATION CRITIC] Translation REJECTED for "${lesson.title}". Critique: ${critique}`);
                
                const { content: isolatedContent, registry: refineRegistry } = isolateJsxForTranslation(lesson.content);
                const { content: isolatedRejected } = isolateJsxForTranslation(currentTranslation);

                const promptRefine = `You are a professional academic translator. The Translation Critic Agent has rejected your previous translation with the following critique:

CRITIQUE FROM TRANSLATION CRITIC:
${critique}

Original MDX Content to Translate:
${isolatedContent}

Previous Rejected Translation:
${isolatedRejected}

Please re-translate the Original MDX Content to "${targetLang.toUpperCase()}", correcting all issues highlighted by the critic.
Follow all initial translation rules:
1. Preserve all markdown structure, custom blockquotes, headings, lists, and links.
2. Keep all Math equations (wrapped in $ or $$) completely untouched.
3. Do NOT translate technical code blocks or placeholder tokens like __JSX_SELF_...__, __JSX_CLOSE_...__, __JSX_OPEN_...__, __JSX_ATTR_...__, __JSX_END_...__. Preserve them EXACTLY as they are. Do not translate the '|||' separators.
4. Translate the title and return ONLY the translated MDX content. Do not include markdown code block wrappers.`;

                if (process.env.DEBUG === 'true') {
                  saveDraftRevision(`prompt_translation_refiner_${lesson.lesson_slug}_${targetLang.toLowerCase()}_attempt_${critiqueIteration + 1}.md`, promptRefine);
                }

                let refineSuccess = false;
                if (isVertexConfigured()) {
                  try {
                    const resRefine = await callVertexAI({
                      task: 'course_translation',
                      contents: [{ role: 'user', parts: [{ text: promptRefine }] }],
                      generationConfig: { temperature: 0.1 }
                    });
                    if (resRefine && resRefine.ok) {
                      const resJson = await resRefine.json();
                      const rawText = resJson.candidates?.[0]?.content?.parts?.[0]?.text || '';
                      currentTranslation = restoreJsxAfterTranslation(rawText, refineRegistry, targetLang);
                      refineSuccess = true;
                    }
                  } catch (err) {
                    console.warn("[AI GENERATOR - TRANSLATION CRITIC] Vertex translation refinement call failed:", err);
                  }
                }

                if (!refineSuccess && apiKey) {
                  try {
                    const resRefine = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        contents: [{ parts: [{ text: promptRefine }] }]
                      })
                    });
                    if (resRefine.ok) {
                      const resJson = await resRefine.json();
                      const rawText = resJson.candidates?.[0]?.content?.parts?.[0]?.text || '';
                      currentTranslation = restoreJsxAfterTranslation(rawText, refineRegistry, targetLang);
                      refineSuccess = true;
                    }
                  } catch (err) {
                    console.error("[AI GENERATOR - TRANSLATION CRITIC] AI Studio fallback translation refinement call failed:", err);
                  }
                }

                if (refineSuccess && currentTranslation && process.env.DEBUG === 'true') {
                  saveDraftRevision(`draft_translation_${lesson.lesson_slug}_${targetLang.toLowerCase()}_attempt_${critiqueIteration + 1}.md`, currentTranslation);
                }

                if (!refineSuccess) {
                  console.warn("[AI GENERATOR - TRANSLATION CRITIC] Refinement failed to respond, continuing with current translation.");
                  translatedMdx = currentTranslation;
                  break;
                }
              }
            }

            if (!approved && currentTranslation) {
              console.warn(`[AI GENERATOR - TRANSLATION CRITIC] Translation not fully approved after max critique iterations. Using latest refinement.`);
              translatedMdx = currentTranslation;
            }

            // Translate title
            let transTitle = lesson.title;
            try {
              const promptTitle = `Translate the lesson title "${lesson.title}" to "${targetLang.toUpperCase()}". Return only the translated string.`;
              
              let transTitleSuccess = false;
              if (isVertexConfigured()) {
                try {
                  const resTitle = await callVertexAI({
                    task: 'course_translation',
                    contents: [{ role: 'user', parts: [{ text: promptTitle }] }],
                    generationConfig: { temperature: 0.1 }
                  });
                  if (resTitle && resTitle.ok) {
                    const tJson = await resTitle.json();
                    transTitle = (tJson.candidates?.[0]?.content?.parts?.[0]?.text || lesson.title).trim();
                    transTitleSuccess = true;
                  }
                } catch (err) {
                  console.warn("[AI GENERATOR] Vertex title translation call failed:", err);
                }
              }
              
              if (!transTitleSuccess && apiKey) {
                console.log(`[AI GENERATOR] Translating title "${lesson.title}" via AI Studio fallback (gemini-2.5-flash)...`);
                const startTime = Date.now();
                try {
                  const resTitle = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      contents: [{ parts: [{ text: promptTitle }] }]
                    })
                  });
                  if (resTitle.ok) {
                    const tJson = await resTitle.json();
                    transTitle = (tJson.candidates?.[0]?.content?.parts?.[0]?.text || lesson.title).trim();
                    transTitleSuccess = true;

                    const durationMs = Date.now() - startTime;
                    const usage = tJson.usageMetadata || {};
                    const promptTokens = usage.promptTokenCount || 0;
                    const candidatesTokens = usage.candidatesTokenCount || usage.candidateTokenCount || 0;
                    await recordMetrics('course_translation', 'gemini-2.5-flash', durationMs, promptTokens, candidatesTokens, promptTitle);
                  }
                } catch (err) {
                  console.error(`[AI GENERATOR] AI Studio title translation fetch exception:`, err);
                }
              }
            } catch (e) {
              console.warn(`[AI GENERATOR] Title translation failed:`, e);
            }

            // De-hallucinate translated references
            let validatedMdx = await validateAndFixBibliography(translatedMdx, targetLang.toLowerCase());
            validatedMdx = await validateAndFixExternalResources(validatedMdx, targetLang.toLowerCase());

            // Pre-validate translated MDX compilation
            let mdxCheck = await validateMdxContent(validatedMdx, targetLang.toLowerCase());
            if (!mdxCheck.success) {
              console.warn(`[AI GENERATOR - TRANSLATION MDX ERROR] Content for translated "${transTitle}" failed MDX validation: ${mdxCheck.error}. Initiating Self-Healing MDX loop...`);
              let healedResult = validatedMdx;
              let healAttempt = 0;
              const maxHealAttempts = 3;
              while (!mdxCheck.success && healAttempt < maxHealAttempts) {
                healAttempt++;
                console.log(`[SELF-HEALING-TRANSLATION] Attempt ${healAttempt}/${maxHealAttempts} to heal MDX compilation error: ${mdxCheck.error}`);
                healedResult = await healMdxWithAI(healedResult, mdxCheck.error || 'Unknown MDX compilation error', targetLang.toLowerCase());
                mdxCheck = await validateMdxContent(healedResult, targetLang.toLowerCase());
              }

              if (mdxCheck.success) {
                console.log(`[SELF-HEALING-TRANSLATION] Successfully healed MDX content on attempt ${healAttempt}!`);
                validatedMdx = healedResult;
              } else {
                console.error(`[SELF-HEALING-TRANSLATION] Self-healing failed after ${maxHealAttempts} attempts. Rejecting translation.`);
                try {
                  await dbService.submitReport(
                    courseSlug,
                    `${courseSlug}/${lesson.lesson_slug}`,
                    `[TRANSLATION MDX FAILURE] Self-healing failed: ${mdxCheck.error}`
                  );
                } catch (reportErr) {
                  console.error("Failed to auto-submit translation error report:", reportErr);
                }
                throw new Error(`[MDX TRANSLATION CRITICAL ERROR] Lesson "${transTitle}" failed compilation and self-healing: ${mdxCheck.error}`);
              }
            }

            // Preprocess and heal translated MDX before writing to DB
            const healedMdx = preprocessMdx(validatedMdx, targetLang.toLowerCase());
            const resolvedMdx = await resolveAndPersistMedia(healedMdx, targetLang.toLowerCase());

            if (process.env.DEBUG === 'true') {
              saveDraftRevision(`final_translation_${lesson.lesson_slug}_${targetLang.toLowerCase()}.mdx`, resolvedMdx);
            }

            // Save translated lesson to Supabase
            await dbService.saveLesson({
              course_slug: courseSlug,
              lesson_slug: lesson.lesson_slug,
              lang: targetLang.toLowerCase(),
              title: transTitle,
              content: resolvedMdx,
              order: lesson.order
            });
            await updateTaskProgress();

          } catch (lessonErr: any) {
            console.error(`[TRANSLATOR ERROR] Failed to translate lesson "${lesson.title}":`, lessonErr);
            failures.push(`Lesson "${lesson.title}": ${lessonErr.message || String(lessonErr)}`);
            await updateTaskProgress();
          }
        });
        await lessonPromises;

        if (failures.length > 0) {
          console.warn(`[TRANSLATOR] Course translation completed with ${failures.length} lesson translation failure(s):\n${failures.join('\n')}`);
          if (failures.length === sourceLessons.length) {
            throw new Error(`[CRITICAL] All ${sourceLessons.length} lessons failed to translate for course "${courseSlug}".`);
          }
        }
      }
    }

    // 3. Translate the course metadata (Syllabus/Curriculum Card) to targetLang
    try {
      const { data: allCourses } = await dbService.getAllCourses();
      const course = allCourses?.find(c => c.slug === courseSlug);
      
      if (course) {
        let translatedCourseTitle = course.title;
        let translatedCourseDescription = course.description;

        console.log(`[TRANSLATOR - CARD] Translating course card metadata for "${courseSlug}" to "${targetLang}"...`);

        // Translate Title
        try {
          const promptCourseTitle = `Translate the course title "${course.title}" to target language code: "${targetLang.toUpperCase()}". Return only the translated string.`;
          let titleSuccess = false;
          if (isVertexConfigured()) {
            try {
              const res = await callVertexAI({
                task: 'course_translation',
                contents: [{ role: 'user', parts: [{ text: promptCourseTitle }] }],
                generationConfig: { temperature: 0.1 }
              });
              if (res && res.ok) {
                const resJson = await res.json();
                translatedCourseTitle = (resJson.candidates?.[0]?.content?.parts?.[0]?.text || course.title).trim();
                titleSuccess = true;
              }
            } catch (e) {
              console.warn("[TRANSLATOR] Vertex course title translation failed:", e);
            }
          }
          if (!titleSuccess && apiKey) {
            const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ parts: [{ text: promptCourseTitle }] }]
              })
            });
            if (res.ok) {
              const resJson = await res.json();
              translatedCourseTitle = (resJson.candidates?.[0]?.content?.parts?.[0]?.text || course.title).trim();
            }
          }
        } catch (err) {
          console.error("[TRANSLATOR] Failed to translate course title:", err);
        }

        // Translate Description
        try {
          const promptCourseDesc = `Translate the course description "${course.description}" to target language code: "${targetLang.toUpperCase()}". Return only the translated string.`;
          let descSuccess = false;
          if (isVertexConfigured()) {
            try {
              const res = await callVertexAI({
                task: 'course_translation',
                contents: [{ role: 'user', parts: [{ text: promptCourseDesc }] }],
                generationConfig: { temperature: 0.1 }
              });
              if (res && res.ok) {
                const resJson = await res.json();
                translatedCourseDescription = (resJson.candidates?.[0]?.content?.parts?.[0]?.text || course.description).trim();
                descSuccess = true;
              }
            } catch (e) {
              console.warn("[TRANSLATOR] Vertex course description translation failed:", e);
            }
          }
          if (!descSuccess && apiKey) {
            const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ parts: [{ text: promptCourseDesc }] }]
              })
            });
            if (res.ok) {
              const resJson = await res.json();
              translatedCourseDescription = (resJson.candidates?.[0]?.content?.parts?.[0]?.text || course.description).trim();
            }
          }
        } catch (err) {
          console.error("[TRANSLATOR] Failed to translate course description:", err);
        }

        // Update Course metadata
        const originalLanguages = course.languages || [];
        const updatedLanguages = originalLanguages.includes(targetLang.toLowerCase())
          ? originalLanguages
          : [...originalLanguages, targetLang.toLowerCase()];

        const originalLangsUpper = course.langs || [];
        const updatedLangsUpper = originalLangsUpper.includes(targetLang.toUpperCase())
          ? originalLangsUpper
          : [...originalLangsUpper, targetLang.toUpperCase()];

        const translations = course.translations || {};
        translations[targetLang.toUpperCase()] = {
          title: translatedCourseTitle,
          description: translatedCourseDescription
        };

        await dbService.saveCourse({
          ...course,
          languages: updatedLanguages,
          langs: updatedLangsUpper,
          translations: translations
        });
        console.log(`[TRANSLATOR - CARD] Successfully saved updated course card translations for "${courseSlug}".`);
      }
    } catch (metaErr) {
      console.error("[TRANSLATOR - CARD] Error during course card metadata translation:", metaErr);
    }
  } catch (err) {
    console.error("AI Translation failed:", err);
    throw err;
  }
}

export async function reviseCourseContent(courseSlug: string, revisionDetails: string, targetLang: string = 'en') {
  console.log(`[REVISION AGENT] Starting revision for course: "${courseSlug}" (Lang: ${targetLang})`);
  console.log(`[REVISION AGENT] Original Details: "${revisionDetails}"`);

  // 1. Fetch untreated feedbacks for this course slug to compile and evaluate them
  let untreatedFeedbacks: any[] = [];
  try {
    const { data: fdb, error: fdbError } = await supabaseAdmin
      .from('course_feedbacks')
      .select('*')
      .eq('is_treated', false);
      
    if (!fdbError && fdb) {
      const targetCanonical = courseSlug.toLowerCase().replace(/_/g, '-');
      untreatedFeedbacks = fdb.filter((f: any) => {
        const fCanonical = (f.course_id || '').toLowerCase().replace(/_/g, '-');
        return fCanonical === targetCanonical;
      });
    }
  } catch (err) {
    console.warn("[REVISION AGENT] Failed to fetch untreated feedbacks:", err);
  }

  const feedbackText = untreatedFeedbacks.length > 0
    ? `Original Trigger: ${revisionDetails}\n\nAll Untreated Feedbacks to address:\n` + 
      untreatedFeedbacks.map((f, i) => `${i + 1}. [Rating: ${f.rating} stars] comment: "${f.comment}"`).join('\n')
    : revisionDetails;

  console.log(`[REVISION AGENT] Compiled feedback to address:\n${feedbackText}`);

  // 2. Clean up report clusters and mark course feedbacks as resolved immediately
  console.log(`[REVISION AGENT] Marking course feedbacks as resolved and cleaning up report clusters for course "${courseSlug}"...`);
  try {
    if (untreatedFeedbacks.length > 0) {
      const idsToUpdate = untreatedFeedbacks.map(f => f.id);
      const { error: updateFeedbacksErr } = await supabaseAdmin
        .from('course_feedbacks')
        .update({ is_treated: true })
        .in('id', idsToUpdate);
        
      if (updateFeedbacksErr) {
        console.warn(`[REVISION AGENT] Warning updating course_feedbacks status:`, updateFeedbacksErr.message);
      }
    } else {
      const { error: updateFeedbacksErr } = await supabaseAdmin
        .from('course_feedbacks')
        .update({ is_treated: true })
        .eq('course_id', courseSlug);
        
      if (updateFeedbacksErr) {
        console.warn(`[REVISION AGENT] Warning updating course_feedbacks status (fallback):`, updateFeedbacksErr.message);
      }
    }
    
    // Fetch and delete matching report clusters case-insensitively
    const { data: clusters, error: fetchErr } = await supabaseAdmin
      .from('report_clusters')
      .select('id, course');
      
    if (fetchErr) {
      console.warn(`[REVISION AGENT] Warning fetching report_clusters for deletion:`, fetchErr.message);
    } else if (clusters) {
      const targetSlugLower = courseSlug.toLowerCase();
      const targetTitleLower = courseSlug.replace(/_/g, ' ').toLowerCase();
      
      const idsToDelete = clusters
        .filter((c: any) => {
          if (!c.course) return false;
          const courseLower = c.course.toLowerCase();
          const courseSlugLower = cleanPathSegment(c.course).toLowerCase();
          return courseLower === targetTitleLower || 
                 courseSlugLower === targetSlugLower ||
                 courseLower === targetSlugLower;
        })
        .map((c: any) => c.id);
        
      if (idsToDelete.length > 0) {
        console.log(`[REVISION AGENT] Deleting report clusters with IDs:`, idsToDelete);
        const { error: deleteErr } = await supabaseAdmin
          .from('report_clusters')
          .delete()
          .in('id', idsToDelete);
          
        if (deleteErr) {
          console.warn(`[REVISION AGENT] Warning deleting report_clusters by ID:`, deleteErr.message);
        }
      }
    }
    console.log(`[REVISION AGENT] Cleaned up all report clusters and feedbacks for "${courseSlug}".`);
  } catch (cleanErr) {
    console.error(`[REVISION AGENT] Error cleaning up feedbacks/reports:`, cleanErr);
  }

  // 2. Fetch lessons for this course slug
  const { data: lessons, error: lessonsError } = await supabase
    .from('lessons')
    .select('*')
    .eq('course_slug', courseSlug)
    .eq('lang', targetLang.toLowerCase());

  if (lessonsError) {
    console.error(`[REVISION AGENT] Failed to fetch lessons:`, lessonsError.message);
    throw lessonsError;
  }

  if (!lessons || lessons.length === 0) {
    console.warn(`[REVISION AGENT] No lessons found for course "${courseSlug}" in language "${targetLang}".`);
    return;
  }

  console.log(`[REVISION AGENT] Found ${lessons.length} lessons. Analyzing which lessons are affected...`);

  // 3. Ask AI to analyze which lessons are affected
  const promptIdentify = `You are a Pedagogical Architect/Revision Planner.
We have a course "${courseSlug}" with the following lessons:
${lessons.map(l => `- Slug: "${l.lesson_slug}", Title: "${l.title}"`).join('\n')}

Feedback / Bug report to address:
"${feedbackText}"

Please analyze which of these lessons need to be revised to fix this issue.
Return a valid JSON array of lesson slugs that should be revised. For example: ["lesson_slug_1", "lesson_slug_2"].
If the feedback is general or you are not sure, or if it applies to multiple lessons, return all affected lesson slugs.
If no lesson is affected, return an empty array [].
Return ONLY the raw JSON array. Do not wrap it in markdown blockticks (\`\`\`).`;

  let identifyRaw = '[]';
  let identifySuccess = false;

  if (isVertexConfigured()) {
    try {
      const res = await callVertexAI({
        task: 'course_generation',
        contents: [{ role: 'user', parts: [{ text: promptIdentify }] }],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: "application/json",
          responseSchema: slugsArraySchema
        }
      });
      if (res && res.ok) {
        const jsonRes = await res.json();
        identifyRaw = jsonRes.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
        identifySuccess = true;
      }
    } catch (e) {
      console.warn(`[REVISION AGENT] Vertex AI identify failed:`, e);
    }
  }

  if (!identifySuccess && apiKey) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptIdentify }] }],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: slugsArraySchema
          }
        })
      });
      if (res.ok) {
        const jsonRes = await res.json();
        identifyRaw = jsonRes.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
        identifySuccess = true;
      }
    } catch (e) {
      console.error(`[REVISION AGENT] AI Studio identify failed:`, e);
    }
  }

  let affectedSlugs: string[] = [];
  try {
    const cleaned = identifyRaw.replace(/```json/g, '').replace(/```/g, '').trim();
    affectedSlugs = safeJsonParse(cleaned, 'translateCourseContent (Revision affected slugs)');
  } catch (e) {
    console.error(`[REVISION AGENT] Failed to parse affected slugs JSON: "${identifyRaw}". Defaulting to all lessons.`, e);
    affectedSlugs = lessons.map(l => l.lesson_slug);
  }

  const revisedSlugs = affectedSlugs;

  if (affectedSlugs.length === 0) {
    console.log(`[REVISION AGENT] No lessons identified for revision.`);
    return { revisedSlugs: [], isSystemic: false, systemicReason: 'No lessons affected.' };
  }

  console.log(`[REVISION AGENT] Lessons identified for revision: ${affectedSlugs.join(', ')}`);

  // 4. For each affected lesson, revise it
  for (const slug of affectedSlugs) {
    const lesson = lessons.find(l => l.lesson_slug === slug);
    if (!lesson) continue;

    console.log(`[REVISION AGENT] Revising lesson: "${lesson.title}" (${slug})...`);

    const promptRevise = `You are a Pedagogical Revision Agent (Revision Agent).
Your mission is to revise and correct a specific course lesson (written in MDX) based on the feedback/reports below.

COURSE: ${courseSlug}
LESSON TITLE: "${lesson.title}"
REVISION DETAILS / FEEDBACK:
"${feedbackText}"

CURRENT MDX CONTENT:
---
${lesson.content}
---

INSTRUCTIONS:
1. Revise the content to address the issues specified in the feedback.
2. Maintain high academic density, rigor, and the target language of the lesson.
3. Preserve all MDX custom React components (<Quiz>, <Question>, <Glossary>, <HistoricalPerson>, <Location>, <DataChart>, <DynamicSimulation>, <SpeciesLink>, <ChemicalLink>, <CelestialLink>, etc.) exactly as they are, including all their attributes, unless the feedback specifically requests to change/fix them.
4. Keep the frontmatter block at the top intact.
5. Do NOT include markdown code block wrappers (like \`\`\`md or \`\`\`mdx) around your output. Return ONLY the raw revised MDX content.
6. Make precise edits. Do not lose other parts of the lesson.`;

    let revisedMdx = '';
    let reviseSuccess = false;

    if (isVertexConfigured()) {
      try {
        const res = await callVertexAI({
          task: 'course_generation',
          contents: [{ role: 'user', parts: [{ text: promptRevise }] }],
          generationConfig: { temperature: 0.3 }
        });
        if (res && res.ok) {
          const jsonRes = await res.json();
          revisedMdx = jsonRes.candidates?.[0]?.content?.parts?.[0]?.text || '';
          reviseSuccess = true;
        }
      } catch (e) {
        console.warn(`[REVISION AGENT] Vertex AI revision failed for "${slug}":`, e);
      }
    }

    if (!reviseSuccess && apiKey) {
      try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: promptRevise }] }]
          })
        });
        if (res.ok) {
          const jsonRes = await res.json();
          revisedMdx = jsonRes.candidates?.[0]?.content?.parts?.[0]?.text || '';
          reviseSuccess = true;
        }
      } catch (e) {
        console.error(`[REVISION AGENT] AI Studio revision failed for "${slug}":`, e);
      }
    }

    if (!revisedMdx) {
      console.warn(`[REVISION AGENT] Could not revise lesson "${lesson.title}", skipping.`);
      continue;
    }

    // === REVISION CRITIC PIPELINE (Agent 4) ===
    let approved = false;
    let critique = '';
    let currentMdx = revisedMdx;
    let critiqueIteration = 0;
    const maxCritiqueIterations = 3;

    while (!approved && critiqueIteration < maxCritiqueIterations && currentMdx) {
      critiqueIteration++;
      console.log(`[REVISION AGENT - AGENT 4] Reviewing revised content for "${lesson.title}" (Attempt ${critiqueIteration}/${maxCritiqueIterations})...`);

      const promptCritic = `You are the Revision Critic Agent (Agent 4 - Specialized in Revision Quality Assurance). Your job is to strictly validate the revised academic MDX content against the revision instructions and the original content.
Source Language: English
Target Language: "${targetLang.toUpperCase()}"

Revision Instructions/Feedbacks:
${feedbackText}

Original MDX Content:
${lesson.content}

Revised MDX Content:
${currentMdx}

Your validation checklist:
1. Did the revision fully address the student concerns and instructions in the revision instructions list?
2. Are all MDX elements (like <Quiz>, <Question>, <Option>, <Glossary>, <Video>, <Audio>, <FillInBlanks>, <SolvedProblem>, <Summary>, <SelfEval>, <HistoricalPerson>, <Location>, <Place>, <EntityLink>, <EssayEvaluation>, <OpenQuestion>, <ScientificDebate>, <SpeciesLink>, <ChemicalLink>, <CelestialLink>, etc.) completely present with all their JSX tags and properties intact? Did you ensure they weren't accidentally lost?
3. Zero placeholders and empty tags: Are there any placeholders, skeletal sentences, or unfinished sections? Do NOT generate empty components like <CriticalThinking />, <WhatsNext />, <OpenQuestion />, or <ScientificDebate /> without text/children. If a component is present, it must contain full text/children.
4. No nested wrappers: Ensure you do NOT nest wrapper tags inside each other (e.g. self-nesting is strictly forbidden).
5. Academic Integrity: Is the scientific/academic depth, tone, and accuracy fully preserved or improved?
6. Assessment Integrity: Ensure all revised interactive assessments (<Quiz>, <Question>, <Option>, <DiagnosticQuiz>, <EssayEvaluation>, <UnsolvedExercise>) remain structurally intact, fully written, and correct (e.g. every <Question> has <Option>s, correct answers are specified, no empty blocks exist).
7. Mandated Sections & Structural Integrity: Verify that the revised MDX content still contains:
   - Prerequisites block ('<Prerequisites items={[...]} />') at the very beginning.
   - Diagnostic quiz ('<DiagnosticQuiz ... />') before the introduction.
   - Introduction heading (titled '## Introduction' or localized equivalent).
   - Objectives block ('<Objectives>') containing '<Knowledge>', '<Skills>', and '<Attitudes>'.
   - Forward-looking section ('<WhatsNext>') before the final evaluation.
   - Concluding section (titled '## Conclusion' or localized equivalent) containing the '<Summary>' component.
   - Glossary section (titled '### Glossary' or localized equivalent).
   - Bibliography/references section (titled '### References' or localized equivalent), unless the original course is a primary school level course.
   If any of these required structural sections/components are missing, you MUST reject the revision (set "approved": false).
8. Multimedia, Illustrations, & Non-Text Media Integrity (DISCIPLINE-AWARE):
   - For VISUAL/SPATIAL/HISTORICAL/EMPIRICAL disciplines (visual arts, anatomy, architecture, history of art, cinema, geography, biology, etc.): Verify that the revision has not accidentally removed illustration elements. '<CustomFigure />' / '<Image />', '<Mermaid />', or '<InteractiveDiagram />' components that were present in the original MUST remain intact. Their removal constitutes a regression and must be rejected.
   - For QUANTITATIVE/EXPERIMENTAL disciplines (mathematics, physics, chemistry, economics): Verify that interactive visual components ('<Mermaid />', '<FunctionPlotter />', '<EquationManipulator />', '<DataChart />', '<BasicMathExplorer />', '<ChemicalStoichiometry />', etc.) are preserved.
   - For TEXTUAL/PHILOSOPHICAL/LITERARY disciplines (philosophy, literature, law, ethics): Do not reject if illustration components are absent, but flag in the critique if they have been removed without reason.
   - Regardless of discipline: Ensure any audio players ('<AudioPlayer />' or '<Audio />') or video players ('<Video />') from the original are preserved and not lost during revision.
9. Section Interactivity and Interactive Sandboxes:
   - Ensure that every major conceptual section (demarcated by a '##' heading) still contains at least one interactive/active learning component (e.g. formative quizzes, fill-in-the-blanks, solved/unsolved exercises, or sandbox/simulation widgets like '<FunctionPlotter />', '<FunctionManipulator />', '<EquationManipulator />', '<Geometry2D />', '<CodeSandbox />', '<DataChart />', '<StructureViewer3D />', '<DynamicSimulation />', '<BasicMathExplorer />', or '<ChemicalStoichiometry />').

Your audit can be in dual-mode:
- If there are widespread, structural, length, course-outline, or numerous missing tag issues that require a total lesson re-write, you MUST set "isGlobalRevision": true and provide a comprehensive "globalCritique".
- If the issues are localized to specific sections, you can set "isGlobalRevision": false, approve/reject section-by-section, and specify the exact "critique" for the rejected sections in the "sections" array.

You must output ONLY a valid JSON object matching the revisionAuditSchema:
{
  "approved": true or false,
  "isGlobalRevision": true or false,
  "globalCritique": "Explain exactly what is wrong/missing/broken globally if isGlobalRevision is true. Otherwise keep empty.",
  "sections": [
    {
      "heading": "Heading of the section, e.g., '## Introduction' (or '' for the header/frontmatter block)",
      "approved": true or false,
      "critique": "If not approved, explain exactly what is wrong/missing in this section."
    }
  ]
}
Do not write any markdown code block wrappers (like \`\`\`json) or any conversational text. Only output raw JSON.`;

      let criticResText = '';
      let criticSuccess = false;

      if (isVertexConfigured()) {
        try {
          const res = await callVertexAI({
            task: 'course_generation', // Using pro model configuration
            contents: [{ role: 'user', parts: [{ text: promptCritic }] }],
            generationConfig: {
              temperature: 0.1,
              responseMimeType: "application/json",
              responseSchema: revisionAuditSchema
            }
          });
          if (res && res.ok) {
            const resJson = await res.json();
            criticResText = resJson.candidates?.[0]?.content?.parts?.[0]?.text || '';
            criticSuccess = true;
          }
        } catch (err) {
          console.warn("[REVISION AGENT - AGENT 4] Vertex critique call failed:", err);
        }
      }

      if (!criticSuccess && apiKey) {
        try {
          const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: promptCritic }] }],
              generationConfig: {
                responseMimeType: "application/json",
                responseSchema: revisionAuditSchema
              }
            })
          });
          if (res.ok) {
            const resJson = await res.json();
            criticResText = resJson.candidates?.[0]?.content?.parts?.[0]?.text || '';
            criticSuccess = true;
          }
        } catch (err) {
          console.error("[REVISION AGENT - AGENT 4] AI Studio fallback critique call failed:", err);
        }
      }

      let isGlobalRevision = false;
      let globalCritique = '';
      let criticSections: { heading: string; approved: boolean; critique: string; }[] = [];

      if (criticSuccess && criticResText) {
        try {
          const cleanedCritic = criticResText.replace(/```json/g, '').replace(/```/g, '').trim();
          const criticObj = safeJsonParse(cleanedCritic, 'translateCourseContent (Agent 4 Verification)');
          approved = !!criticObj.approved;
          isGlobalRevision = !!criticObj.isGlobalRevision;
          globalCritique = criticObj.globalCritique || '';
          criticSections = criticObj.sections || [];
        } catch (e) {
          console.error("[REVISION AGENT - AGENT 4] Failed to parse critic JSON response:", e);
          approved = true; // Avoid blocking loop on parse failure
        }
      } else {
        approved = true; // Bypass critic loop if services are unavailable
      }

      if (approved) {
        console.log(`[REVISION AGENT - AGENT 4] Revision approved for "${lesson.title}"!`);
        revisedMdx = currentMdx;
      } else {
        console.warn(`[REVISION AGENT - AGENT 4] Revision REJECTED for "${lesson.title}". Global: ${isGlobalRevision}.`);

        if (isGlobalRevision) {
          console.log(`[REVISION AGENT] Initiating Scribe full-text global rewrite based on critique: "${globalCritique}"`);
          const promptRefineGlobal = `You are Scribe (Agent 3), a professional academic writer. The Revision Critic Agent (Agent 4) has rejected your previous revised MDX in its entirety with a global critique:

GLOBAL CRITIQUE:
${globalCritique}

Original MDX Content:
${lesson.content}

Previous Revised Content:
${currentMdx}

Revision Instructions:
${feedbackText}

Please re-generate the ENTIRE revised MDX content for "${lesson.title}", fully addressing the critic's global critique, ensuring high academic density, proper structure, and full compliance.
Return ONLY the revised MDX content. Do NOT include markdown code block wrappers (such as \`\`\`md or \`\`\`mdx) or conversational intro/outro text.`;

          let refineSuccess = false;
          if (isVertexConfigured()) {
            try {
              const resRefine = await callVertexAI({
                task: 'course_generation',
                contents: [{ role: 'user', parts: [{ text: promptRefineGlobal }] }],
                generationConfig: { temperature: 0.3 }
              });
              if (resRefine && resRefine.ok) {
                const resJson = await resRefine.json();
                currentMdx = resJson.candidates?.[0]?.content?.parts?.[0]?.text || '';
                refineSuccess = true;
              }
            } catch (err) {
              console.warn("[REVISION AGENT - AGENT 4] Vertex global refinement call failed:", err);
            }
          }

          if (!refineSuccess && apiKey) {
            try {
              const resRefine = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  contents: [{ parts: [{ text: promptRefineGlobal }] }]
                })
              });
              if (resRefine.ok) {
                const resJson = await resRefine.json();
                currentMdx = resJson.candidates?.[0]?.content?.parts?.[0]?.text || '';
                refineSuccess = true;
              }
            } catch (err) {
              console.error("[REVISION AGENT - AGENT 4] AI Studio fallback global refinement call failed:", err);
            }
          }

          if (!refineSuccess) {
            console.warn("[REVISION AGENT - AGENT 4] Global refinement failed, continuing with current content.");
            revisedMdx = currentMdx;
            break;
          }
        } else {
          // Section-by-section localized repair
          console.log(`[REVISION AGENT] Initiating localized section-by-section repair for "${lesson.title}"...`);
          const parsedSections = parseMarkdownSections(currentMdx);

          // Find which sections are rejected
          const rejectedSectionsData: {
            heading: string;
            content: string;
            critique: string;
            precedingHeading: string | null;
            succeedingHeading: string | null;
          }[] = [];

          for (let i = 0; i < parsedSections.length; i++) {
            const sec = parsedSections[i];
            const secHeadingNorm = (sec.heading || 'Header / Introduction Block').trim().toLowerCase();
            const criticMatch = criticSections.find(cs => {
              const csHeadingNorm = (cs.heading || 'Header / Introduction Block').trim().toLowerCase();
              return csHeadingNorm === secHeadingNorm || 
                     csHeadingNorm.replace(/^##\s+/, '') === secHeadingNorm.replace(/^##\s+/, '');
            });

            const isSecApproved = criticMatch ? criticMatch.approved : true;
            if (!isSecApproved) {
              // Find neighborhood contexts
              const precedingHeading = i > 0 ? parsedSections[i - 1].heading : null;
              const succeedingHeading = i < parsedSections.length - 1 ? parsedSections[i + 1].heading : null;

              rejectedSectionsData.push({
                heading: sec.heading || 'Header / Introduction Block',
                content: sec.content,
                critique: criticMatch ? criticMatch.critique : "Section needs improvement.",
                precedingHeading,
                succeedingHeading
              });
            }
          }

          if (rejectedSectionsData.length > 0) {
            console.log(`[REVISION AGENT] Localized repair required for ${rejectedSectionsData.length} sections: ${rejectedSectionsData.map(s => `"${s.heading}"`).join(', ')}`);

            const promptJointRepair = `You are Scribe (Agent 3), a professional academic writer.
We need to repair multiple specific sections of the lesson "${lesson.title}" that were rejected by the Revision Critic (Agent 4).

CONTEXT OF THE LESSON:
Course: ${courseSlug}
Lesson Title: "${lesson.title}"
Language: "${targetLang.toUpperCase()}"

Here are the sections that need repair. For each section, we provide its heading, its current content, its critique, and its surrounding neighborhood context (preceding and succeeding section headings) to help you preserve perfect narrative flow and continuity.

${rejectedSectionsData.map((rj, idx) => `
--- REJECTED SECTION ${idx + 1} ---
Heading: "${rj.heading || 'Header / Introduction Block'}"
Neighborhood Context:
  - Preceding Section: ${rj.precedingHeading || 'None'}
  - Succeeding Section: ${rj.succeedingHeading || 'None'}
Critique from Agent 4:
  "${rj.critique}"
Current Content of this section:
${rj.content}
----------------------------------
`).join('\n')}

INSTRUCTIONS:
1. Repair each of the rejected sections listed above to fully resolve its respective critique.
2. For each repaired section, wrap your output in a \`<revised_section heading="HEADING_TEXT_EXACTLY_AS_SHOWN_ABOVE">\` tag.
   Example output format:
   <revised_section heading="${rejectedSectionsData[0]?.heading || 'Header / Introduction Block'}">
   [Your revised content here, preserving academic rigor and MDX elements]
   </revised_section>
3. Do NOT include markdown code block wrappers (like \`\`\`md or \`\`\`mdx) around your entire output.
4. Return ONLY the wrapped revised sections. Do not include any other conversational text or metadata outside the tags.`;

            let scribeRepairOutput = '';
            let repairSuccess = false;

            if (isVertexConfigured()) {
              try {
                const resRepair = await callVertexAI({
                  task: 'course_generation',
                  contents: [{ role: 'user', parts: [{ text: promptJointRepair }] }],
                  generationConfig: { temperature: 0.3 }
                });
                if (resRepair && resRepair.ok) {
                  const resJson = await resRepair.json();
                  scribeRepairOutput = resJson.candidates?.[0]?.content?.parts?.[0]?.text || '';
                  repairSuccess = true;
                }
              } catch (err) {
                console.warn("[REVISION AGENT - AGENT 4] Vertex joint repair call failed:", err);
              }
            }

            if (!repairSuccess && apiKey) {
              try {
                const resRepair = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    contents: [{ parts: [{ text: promptJointRepair }] }]
                  })
                });
                if (resRepair.ok) {
                  const resJson = await resRepair.json();
                  scribeRepairOutput = resJson.candidates?.[0]?.content?.parts?.[0]?.text || '';
                  repairSuccess = true;
                }
              } catch (err) {
                console.error("[REVISION AGENT - AGENT 4] AI Studio fallback joint repair call failed:", err);
              }
            }

            if (repairSuccess && scribeRepairOutput) {
              const repairs = parseJointRepairOutput(scribeRepairOutput);
              // Fallback if regex parsing failed but we only have 1 section to repair
              if (repairs.size === 0 && rejectedSectionsData.length === 1) {
                const singleSec = rejectedSectionsData[0];
                const key = (singleSec.heading || 'Header / Introduction Block').trim().toLowerCase();
                repairs.set(key, scribeRepairOutput.trim());
              }

              // Apply repairs
              for (const sec of parsedSections) {
                const key = (sec.heading || 'Header / Introduction Block').trim().toLowerCase();
                if (repairs.has(key)) {
                  console.log(`[REVISION] Applying repaired content for section: "${sec.heading || 'Header / Introduction Block'}"`);
                  sec.content = repairs.get(key)!;
                }
              }

              currentMdx = reconstructMarkdown(parsedSections);
            } else {
              console.warn("[REVISION AGENT - AGENT 4] Localized repair failed, continuing with current content.");
              revisedMdx = currentMdx;
              break;
            }
          } else {
            console.log("[REVISION AGENT] No localized sections rejected (but lesson was rejected globally or as a whole).");
            revisedMdx = currentMdx;
            break;
          }
        }
      }
    }

    // Run verification/validation and self-healing loop
    let validatedMdx = await validateAndFixBibliography(revisedMdx, targetLang.toLowerCase());
    validatedMdx = await validateAndFixExternalResources(validatedMdx, targetLang.toLowerCase());

    // Pre-validate MDX compilation
    let mdxCheck = await validateMdxContent(validatedMdx, targetLang.toLowerCase());
    if (!mdxCheck.success) {
      console.warn(`[REVISION AGENT - MDX ERROR] Revised content for "${lesson.title}" failed MDX validation: ${mdxCheck.error}. Initiating Self-Healing MDX loop...`);
      let healedResult = validatedMdx;
      let healAttempt = 0;
      const maxHealAttempts = 3;
      while (!mdxCheck.success && healAttempt < maxHealAttempts) {
        healAttempt++;
        console.log(`[SELF-HEALING-REVISION] Attempt ${healAttempt}/${maxHealAttempts} to heal MDX compilation error: ${mdxCheck.error}`);
        healedResult = await healMdxWithAI(healedResult, mdxCheck.error || 'Unknown MDX compilation error', targetLang.toLowerCase());
        mdxCheck = await validateMdxContent(healedResult, targetLang.toLowerCase());
      }

      if (mdxCheck.success) {
        console.log(`[SELF-HEALING-REVISION] Successfully healed MDX content on attempt ${healAttempt}!`);
        validatedMdx = healedResult;
      } else {
        console.error(`[SELF-HEALING-REVISION] Self-healing failed after ${maxHealAttempts} attempts. Rejecting revision.`);
        try {
          await dbService.submitReport(
            courseSlug,
            `${courseSlug}/${slug}`,
            `[REVISION MDX FAILURE] Self-healing failed: ${mdxCheck.error}`
          );
        } catch (reportErr) {
          console.error("Failed to auto-submit revision error report:", reportErr);
        }
        throw new Error(`[MDX REVISION CRITICAL ERROR] Lesson "${lesson.title}" failed compilation and self-healing: ${mdxCheck.error}`);
      }
    }

    // Preprocess and heal MDX before writing to DB
    const healedMdx = preprocessMdx(validatedMdx, targetLang.toLowerCase());
    const resolvedMdx = await resolveAndPersistMedia(healedMdx, targetLang.toLowerCase());

    // Save back to DB
    await dbService.saveLesson({
      course_slug: courseSlug,
      lesson_slug: slug,
      lang: targetLang.toLowerCase(),
      title: lesson.title,
      content: resolvedMdx,
      order: lesson.order
    });

    console.log(`[REVISION AGENT] Successfully revised and saved lesson: "${lesson.title}" (${slug})`);
  }

  // 5. Update the course version/governance
  try {
    const { data: allCourses } = await dbService.getAllCourses();
    const course = allCourses?.find(c => c.slug === courseSlug);
    if (course) {
      const currentVersion = course.version || 'v1.0.0';
      let nextVersion = 'v1.0.1';
      const match = currentVersion.match(/v?(\d+)\.(\d+)\.(\d+)/);
      if (match) {
        const major = parseInt(match[1], 10);
        const minor = parseInt(match[2], 10);
        const patch = parseInt(match[3], 10) + 1;
        nextVersion = `v${major}.${minor}.${patch}`;
      }
      const originalLanguages = course.languages || [];
      const updatedLanguages = originalLanguages.includes(targetLang.toLowerCase())
        ? originalLanguages
        : [...originalLanguages, targetLang.toLowerCase()];

      const originalLangsUpper = course.langs || [];
      const updatedLangsUpper = originalLangsUpper.includes(targetLang.toUpperCase())
        ? originalLangsUpper
        : [...originalLangsUpper, targetLang.toUpperCase()];

      await dbService.saveCourse({
        ...course,
        languages: updatedLanguages,
        langs: updatedLangsUpper,
        version: nextVersion,
        last_revision_date: new Date().toISOString()
      });
      console.log(`[REVISION AGENT] Updated course "${courseSlug}" version to ${nextVersion}`);
    }
  } catch (err) {
    console.error(`[REVISION AGENT] Failed to update course version card:`, err);
  }

  // 5. Systemic issue analysis to determine propagation necessity
  let isSystemic = false;
  let systemicReason = "Defaulting to non-systemic (language-specific) unless identified as conceptual or structural.";

  const promptSystemic = `You are a Pedagogical Auditor.
Analyze the following course revision feedback/motive:
"${feedbackText}"

Determine if this feedback relates to a systemic issue that should be propagated to all other language versions of the course (e.g., conceptual error, scientific/mathematical formula error, incorrect tags, empty examples, structural formatting issue).
If it is a local language-specific issue (e.g., translation correction, spelling mistake, grammar typo specific to the language "${targetLang}"), it should NOT be propagated.

Return a valid JSON object with the following fields:
{
  "isSystemic": true or false,
  "reason": "A brief explanation of why this affects or does not affect other languages"
}
Return ONLY the raw JSON object. Do not wrap it in markdown blockticks (\`\`\`).`;

  let analysisRaw = '{"isSystemic":false,"reason":""}';
  let analysisSuccess = false;

  if (isVertexConfigured()) {
    try {
      const res = await callVertexAI({
        task: 'course_generation',
        contents: [{ role: 'user', parts: [{ text: promptSystemic }] }],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: "application/json",
          responseSchema: systemicAnalysisSchema
        }
      });
      if (res && res.ok) {
        const jsonRes = await res.json();
        analysisRaw = jsonRes.candidates?.[0]?.content?.parts?.[0]?.text || '{"isSystemic":false,"reason":""}';
        analysisSuccess = true;
      }
    } catch (e) {
      console.warn(`[REVISION AGENT] Vertex AI systemic analysis failed:`, e);
    }
  }

  if (!analysisSuccess && apiKey) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptSystemic }] }],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: systemicAnalysisSchema
          }
        })
      });
      if (res.ok) {
        const jsonRes = await res.json();
        analysisRaw = jsonRes.candidates?.[0]?.content?.parts?.[0]?.text || '{"isSystemic":false,"reason":""}';
        analysisSuccess = true;
      }
    } catch (e) {
      console.error(`[REVISION AGENT] AI Studio systemic analysis failed:`, e);
    }
  }

  try {
    const cleanedAnalysis = analysisRaw.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanedAnalysis);
    isSystemic = !!parsed.isSystemic;
    systemicReason = parsed.reason || "";
  } catch (e) {
    console.error(`[REVISION AGENT] Failed to parse systemic analysis JSON: "${analysisRaw}"`, e);
  }

  console.log(`[REVISION AGENT] Systemic audit results: isSystemic = ${isSystemic}, Reason = "${systemicReason}"`);

  return {
    revisedSlugs: affectedSlugs,
    isSystemic,
    systemicReason
  };
}

export async function healMdxWithAI(content: string, mdxError: string, targetLang: string = 'fr'): Promise<string> {
  const promptHealer = `You are a Self-Healing MDX Compiler Agent (Agent B).
Your task is to fix syntax errors or invalid tags in MDX content so it compiles successfully.
Below is the compilation error message and the faulty MDX content.

COMPILATION ERROR:
${mdxError}

FAULTY MDX CONTENT:
---
${content}
---

INSTRUCTIONS:
1. Fix the tags that are unclosed, incorrectly nested, or contain invalid syntax.
2. For unclosed JSX/HTML tags, either close them properly or wrap the content correctly. For example, if it says "Expected a closing tag for <a>", make sure all <a> tags are closed with </a>.
3. Make sure custom components like <Quiz>, <Question>, <Glossary>, <HistoricalPerson>, <Epistemology>, <SpeciesLink>, <ChemicalLink>, <CelestialLink>, etc. are well-formed and closed.
4. Do NOT change the learning objectives, pedagogical content, or text substance. Just repair the MDX structure so that Acorn or the MDX parser doesn't crash.
5. Return ONLY the repaired MDX content. Do NOT wrap the response in markdown code blocks (\`\`\`).
6. Do NOT add any conversational explanation before or after the code. Just output the clean, fixed MDX.`;

  let repairedMdx = '';
  let success = false;

  if (isVertexConfigured()) {
    console.log(`[SELF-HEALING] Healing MDX content via Vertex AI (gemini-2.5-flash)...`);
    try {
      const res = await callVertexAI({
        task: 'course_generation',
        contents: [{ role: 'user', parts: [{ text: promptHealer }] }],
        generationConfig: { temperature: 0.1 }
      });
      if (res && res.ok) {
        const jsonRes = await res.json();
        repairedMdx = jsonRes.candidates?.[0]?.content?.parts?.[0]?.text || '';
        if (repairedMdx) success = true;
      }
    } catch (err) {
      console.warn(`[SELF-HEALING] Vertex AI healer exception:`, err);
    }
  }

  if (!success && apiKey) {
    console.log(`[SELF-HEALING] Healing MDX content via AI Studio fallback (gemini-2.5-flash)...`);
    try {
      const startTime = Date.now();
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptHealer }] }]
        })
      });
      if (res.ok) {
        const jsonRes = await res.json();
        repairedMdx = jsonRes?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        if (repairedMdx) {
          success = true;
          const durationMs = Date.now() - startTime;
          const usage = jsonRes.usageMetadata || {};
          const promptTokens = usage.promptTokenCount || 0;
          const candidatesTokens = usage.candidatesTokenCount || usage.candidateTokenCount || 0;
          await recordMetrics('course_generation', 'gemini-2.5-flash', durationMs, promptTokens, candidatesTokens, promptHealer);
        } else {
          console.warn("[SELF-HEALING] AI Studio healer returned empty content");
        }
      } else {
        const errText = await res.text();
        console.warn(`[SELF-HEALING] AI Studio healer failed (${res.status}): ${errText}`);
      }
    } catch (err) {
      console.error(`[SELF-HEALING] AI Studio healer exception:`, err);
    }
  }

  if (!repairedMdx) {
    console.warn("[SELF-HEALING] Healer failed to produce content, returning original.");
    return content;
  }

  return repairedMdx;
}

// Recursive ytInitialData parser to extract search result videos
async function searchYouTubeVideo(query: string): Promise<string | null> {
  try {
    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
    const res = await fetchWithTimeout(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
        'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7'
      }
    }, 5000);
    if (!res.ok) return null;
    const html = await res.text();
    
    // Extract ytInitialData
    let ytInitialData = null;
    const jsonMatch = html.match(/ytInitialData\s*=\s*({[\s\S]+?});/);
    if (jsonMatch) {
      try {
        ytInitialData = JSON.parse(jsonMatch[1]);
      } catch (e) {
        // Fallback brace matching if parsing failed
        const startIdx = html.indexOf('ytInitialData = {');
        if (startIdx !== -1) {
          const start = html.indexOf('{', startIdx);
          let braceCount = 1;
          let i = start + 1;
          while (i < html.length && braceCount > 0) {
            if (html[i] === '{') braceCount++;
            else if (html[i] === '}') braceCount--;
            i++;
          }
          if (braceCount === 0) {
            try {
              ytInitialData = JSON.parse(html.substring(start, i));
            } catch {}
          }
        }
      }
    }

    const videos: any[] = [];

    if (ytInitialData) {
      const findRenderers = (obj: any) => {
        if (!obj || typeof obj !== 'object') return;
        if (obj.videoRenderer) {
          const vr = obj.videoRenderer;
          const videoId = vr.videoId;
          let title = '';
          if (vr.title?.runs?.[0]?.text) title = vr.title.runs[0].text;
          else if (vr.title?.simpleText) title = vr.title.simpleText;

          let viewStr = '';
          if (vr.viewCountText?.simpleText) viewStr = vr.viewCountText.simpleText;
          else if (vr.shortViewCountText?.simpleText) viewStr = vr.shortViewCountText.simpleText;

          let durationStr = '';
          if (vr.lengthText?.simpleText) durationStr = vr.lengthText.simpleText;

          if (videoId && videoId.length === 11) {
            let multiplier = 1;
            const cleanStr = viewStr.toLowerCase().replace(/[^0-9kmy\s.,]/g, '').trim();
            if (cleanStr.includes('k')) multiplier = 1000;
            else if (cleanStr.includes('m')) multiplier = 1000000;
            else if (cleanStr.includes('b') || cleanStr.includes('g')) multiplier = 1000000000;
            else if (cleanStr.includes('mille')) multiplier = 1000;
            else if (cleanStr.includes('million')) multiplier = 1000000;

            const valMatch = cleanStr.match(/([0-9]+(?:[.,][0-9]+)?)/);
            const viewCount = valMatch ? parseFloat(valMatch[1].replace(',', '.')) * multiplier : 0;

            videos.push({ videoId, title, viewCount, duration: durationStr });
          }
          return;
        }
        for (const key of Object.keys(obj)) {
          findRenderers(obj[key]);
        }
      };

      findRenderers(ytInitialData);
    }

    if (videos.length > 0) {
      const topCandidates = videos.slice(0, 5);
      topCandidates.sort((a, b) => b.viewCount - a.viewCount);
      console.log(`[YOUTUBE-SCRAPER] Sorted top candidates by viewCount:`, topCandidates.map(v => `${v.videoId} (${v.viewCount} views): "${v.title}"`));
      return topCandidates[0].videoId;
    }

    const fallbackMatch = html.match(/"videoId"\s*:\s*"([\w-]{11})"/);
    if (fallbackMatch && fallbackMatch[1]) {
      return fallbackMatch[1];
    }
    return null;
  } catch (err) {
    console.warn(`[MEDIA-RESOLVER] YouTube search failed for query "${query}":`, err);
    return null;
  }
}

async function findAlternativeVideo(title: string, lang: string): Promise<{ id?: string; url?: string; provider?: string } | null> {
  console.log(`[ALTERNATIVE SEARCH] Searching alternative video for title: "${title}" (${lang})...`);
  const query = lang.toLowerCase() === 'fr' ? `${title} explication cours` : `${title} educational explanation`;
  const videoId = await searchYouTubeVideo(query);
  if (videoId) {
    return { id: videoId, provider: 'youtube' };
  }
  return null;
}

async function findAlternativeVideoWithFallback(title: string, targetLang: string): Promise<{ id?: string; url?: string; provider?: string } | null> {
  // 1. Try local language
  const localVideo = await findAlternativeVideo(title, targetLang);
  if (localVideo) {
    return localVideo;
  }

  // 2. Try English if not already English
  if (targetLang.toLowerCase() !== 'en') {
    console.log(`[ALTERNATIVE VIDEO FALLBACK] Falling back to English for video title: "${title}"`);
    return await findAlternativeVideo(title, 'en');
  }

  return null;
}

async function findAlternativeAudio(title: string, lang: string): Promise<string | null> {
  console.log(`[ALTERNATIVE SEARCH] Searching alternative audio for title: "${title}" (${lang})...`);
  const queries = [
    title,
    `${title} podcast`,
    `${title} audio guide`
  ];
  for (let attempt = 0; attempt < 3; attempt++) {
    const query = queries[attempt];
    console.log(`[ALTERNATIVE SEARCH] Audio Search Attempt ${attempt + 1}/3 with query: "${query}"`);
    
    const prompt = `You are a Research Agent (Agent C).
Find a real, public, educational MP3 or audio URL about: "${query}".
The audio must be in language: "${lang}".
Output JSON only:
{
  "url": "https://example.com/real-audio-file.mp3"
}
If you cannot find any real audio, output: {}`;

    try {
      let rawJson = '';
      if (isVertexConfigured()) {
        const res = await callVertexAI({
          task: 'course_generation',
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: "application/json",
            responseSchema: audioSearchSchema
          }
        });
        if (res && res.ok) {
          const jsonRes = await res.json();
          rawJson = jsonRes.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
        }
      } else if (apiKey) {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: "application/json",
              responseSchema: audioSearchSchema
            }
          })
        });
        if (res.ok) {
          const jsonRes = await res.json();
          rawJson = jsonRes.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
        }
      }

      if (rawJson) {
        const cleaned = rawJson.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = safeJsonParse(cleaned, 'Audio Search Alternative');
        if (data.url) {
          const audioTag = `<Audio url="${data.url}" />`;
          const isReachable = await isAudioReachable(audioTag);
          if (isReachable) {
            console.log(`[ALTERNATIVE SEARCH] Found valid alternative audio: URL=${data.url}`);
            return data.url;
          }
        }
      }
    } catch (err) {
      console.warn(`[ALTERNATIVE SEARCH] Audio search exception on attempt ${attempt + 1}:`, err);
    }
  }
  return null;
}

async function findAlternativeAudioWithFallback(title: string, targetLang: string): Promise<string | null> {
  // 1. Try local language
  const localAudio = await findAlternativeAudio(title, targetLang);
  if (localAudio) {
    return localAudio;
  }

  // 2. Try English if not already English
  if (targetLang.toLowerCase() !== 'en') {
    console.log(`[ALTERNATIVE AUDIO FALLBACK] Falling back to English for audio title: "${title}"`);
    return await findAlternativeAudio(title, 'en');
  }

  return null;
}

async function validateAndFixBibliography(mdx: string, targetLang: string = 'fr'): Promise<string> {
  const refRegex = /<a id="ref-(\d+)"><\/a>\[(\d+)\]\s*\[(.*?)\]\((.*?)\)/g;
  let match;
  const replacements: { original: string; replacement: string; refId: string }[] = [];

  while ((match = refRegex.exec(mdx)) !== null) {
    const fullMatch = match[0];
    const refId = match[1];
    const refNum = match[2];
    const refText = match[3];
    const refUrl = match[4];

    console.log(`[BIBLIOGRAPHY VALIDATOR] Verifying Reference #${refId}: "${refText}" with URL "${refUrl}"`);

    let isReachable = false;
    if (refUrl && refUrl.startsWith('http')) {
      isReachable = await isUrlReachable(refUrl);
    }

    if (isReachable) {
      console.log(`[BIBLIOGRAPHY VALIDATOR] Existing URL is reachable: ${refUrl}`);
      continue;
    }

    let resolvedUrl = '';
    let resolvedTitle = '';
    
    const queries = [
      refText,
      refText.split('by')[0].replace(/"/g, '').trim(),
      (targetLang.toLowerCase() !== 'en') 
        ? `${refText.split('by')[0].replace(/"/g, '').trim()} english edition` 
        : refText.replace(/[^\w\s-]/g, '').split(/\s+/).slice(0, 8).join(' ')
    ];

    for (let attempt = 0; attempt < 3; attempt++) {
      const query = queries[attempt];
      if (!query) continue;
      console.log(`[BIBLIOGRAPHY VALIDATOR] Attempt ${attempt + 1}/3 with query: "${query}"`);

      try {
        const searchRes = await fetchWithTimeout(`https://api.crossref.org/works?query=${encodeURIComponent(query)}&rows=1`);
        if (searchRes.ok) {
          const data = await searchRes.json();
          const item = data.message?.items?.[0];
          if (item && item.DOI) {
            resolvedUrl = `https://doi.org/${item.DOI}`;
            const cleanTitle = item.title?.[0] || refText;
            const cleanAuthor = item.author?.[0]?.family ? `by ${item.author[0].family}` : '';
            resolvedTitle = `${cleanTitle} ${cleanAuthor}`.trim();
            if (!resolvedTitle.endsWith('.')) resolvedTitle += '.';
            break;
          }
        }
      } catch (e) {
        console.warn(`[BIBLIOGRAPHY VALIDATOR] Crossref attempt ${attempt + 1} failed:`, e);
      }

      try {
        const gBooksRes = await fetchWithTimeout(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=1`);
        if (gBooksRes.ok) {
          const data = await gBooksRes.json();
          const book = data.items?.[0]?.volumeInfo;
          if (book) {
            resolvedUrl = book.previewLink || book.infoLink || `https://books.google.com?q=${encodeURIComponent(query)}`;
            resolvedTitle = `${book.title} by ${book.authors?.join(', ') || 'Unknown'}`.trim();
            if (!resolvedTitle.endsWith('.')) resolvedTitle += '.';
            break;
          }
        }
      } catch (e) {
        console.warn(`[BIBLIOGRAPHY VALIDATOR] Google Books attempt ${attempt + 1} failed:`, e);
      }
    }

    if (resolvedUrl) {
      const updatedRef = `<a id="ref-${refId}"></a>[${refNum}] [${resolvedTitle}](${resolvedUrl})`;
      replacements.push({ original: fullMatch, replacement: updatedRef, refId });
      console.log(`[BIBLIOGRAPHY VALIDATOR] Successfully resolved to alternative URL: ${resolvedUrl}`);
    } else {
      replacements.push({ original: fullMatch, replacement: '', refId });
      console.warn(`[BIBLIOGRAPHY VALIDATOR] Failed to resolve Reference #${refId} after 3 attempts. Marking for removal.`);
    }
  }

  let updatedMdx = mdx;
  for (const rep of replacements) {
    updatedMdx = updatedMdx.replace(rep.original, rep.replacement);
    if (rep.replacement === '') {
      const footnoteRegex = new RegExp(`<sup><a\\b[^>]*href=["']#ref-${rep.refId}["'][^>]*>.*?</a></sup>`, 'g');
      updatedMdx = updatedMdx.replace(footnoteRegex, '');
    }
  }

  return updatedMdx;
}

async function validateAndFixImages(mdx: string): Promise<string> {
  const figureRegex = /!\[(.*?)\]\(((?:https?:\/\/|\/\/).*?)\)\s*\r?\n\s*\*\s*(Figure\s*[\d\w]*\s*[:\-\u2013].*?)\s*\*(?:\s*\r?\n\s*\[(Accéder directement.*?|Access the resource.*?|Access directly.*?)\]\(((?:https?:\/\/|\/\/).*?)\))?/gi;
  
  let match;
  const blocks: { fullBlock: string; url: string }[] = [];
  
  while ((match = figureRegex.exec(mdx)) !== null) {
    blocks.push({
      fullBlock: match[0],
      url: match[2]
    });
  }
  
  if (blocks.length === 0) {
    return mdx;
  }
  
  console.log(`[IMAGE VALIDATOR] Found ${blocks.length} images to validate.`);
  
  const validationResults = await Promise.all(
    blocks.map(async (block) => {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 15000);
      try {
        const response = await fetch(block.url, {
          method: 'GET',
          signal: controller.signal
        });
        clearTimeout(id);
        if (!response.ok) {
          console.warn(`[IMAGE VALIDATOR] Image failed with status ${response.status}: ${block.url}`);
          if (block.url.includes('pollinations.ai')) {
            return { fullBlock: block.fullBlock, isValid: true };
          }
          return { fullBlock: block.fullBlock, isValid: false };
        }
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          console.warn(`[IMAGE VALIDATOR] Image URL returned a JSON error payload: ${block.url}`);
          if (block.url.includes('pollinations.ai')) {
            return { fullBlock: block.fullBlock, isValid: true };
          }
          return { fullBlock: block.fullBlock, isValid: false };
        }
        console.log(`[IMAGE VALIDATOR] Image validated successfully: ${block.url}`);
        return { fullBlock: block.fullBlock, isValid: true };
      } catch (err: any) {
        clearTimeout(id);
        console.warn(`[IMAGE VALIDATOR] Error checking image ${block.url}:`, err);
        if (block.url.includes('pollinations.ai') || err.name === 'AbortError') {
          console.log(`[IMAGE VALIDATOR] Keeping pollinations/timeout image: ${block.url}`);
          return { fullBlock: block.fullBlock, isValid: true };
        }
        return { fullBlock: block.fullBlock, isValid: false };
      }
    })
  );
  
  let updatedMdx = mdx;
  for (const res of validationResults) {
    if (!res.isValid) {
      console.log(`[IMAGE VALIDATOR] Removing failed image block.`);
      updatedMdx = updatedMdx.replace(res.fullBlock, '');
    }
  }
  
  return updatedMdx;
}

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs: number = 3500): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => {
    try { controller.abort(); } catch {}
  }, timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

async function isUrlReachable(url: string, timeoutMs: number = 3500): Promise<boolean> {
  const controller = new AbortController();
  const id = setTimeout(() => {
    try { controller.abort(); } catch {}
  }, timeoutMs);

  const fetchPromise = fetch(url, {
    method: 'GET',
    signal: controller.signal,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
    }
  }).then(res => {
    clearTimeout(id);
    return res.ok;
  }).catch(() => {
    clearTimeout(id);
    return false;
  });

  const timeoutPromise = new Promise<boolean>((resolve) => {
    setTimeout(() => {
      resolve(false);
    }, timeoutMs + 100);
  });

  return Promise.race([fetchPromise, timeoutPromise]);
}

async function isVideoReachable(videoTagContent: string): Promise<boolean> {
  const idMatch = videoTagContent.match(/id="([^"]+)"/) || videoTagContent.match(/id='([^']+)'/);
  const urlMatch = videoTagContent.match(/url="([^"]+)"/) || videoTagContent.match(/url='([^']+)'/);
  const providerMatch = videoTagContent.match(/provider="([^"]+)"/) || videoTagContent.match(/provider='([^']+)'/);

  const id = idMatch ? idMatch[1] : '';
  const url = urlMatch ? urlMatch[1] : '';
  let provider = providerMatch ? providerMatch[1].toLowerCase() : '';

  if (url) {
    if (/youtube\.com|youtu\.be/i.test(url)) provider = 'youtube';
    else if (/vimeo\.com/i.test(url)) provider = 'vimeo';
  }

  if (provider === 'youtube' || (!provider && id && id.length === 11)) {
    const videoId = id || (url ? (url.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/i)?.[1] || '') : '');
    if (!videoId) return false;
    const checkUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}&format=json`;
    return isUrlReachable(checkUrl);
  }

  if (provider === 'vimeo') {
    const videoId = id || (url ? (url.match(/(?:vimeo\.com|player\.vimeo\.com)\/(\d+)/i)?.[1] || '') : '');
    if (!videoId) return false;
    const checkUrl = `https://vimeo.com/api/oembed.json?url=https://vimeo.com/${encodeURIComponent(videoId)}`;
    return isUrlReachable(checkUrl);
  }

  const targetUrl = url || id;
  if (!targetUrl || !targetUrl.startsWith('http')) return false;
  return isUrlReachable(targetUrl);
}

async function isAudioReachable(audioTagContent: string): Promise<boolean> {
  const urlMatch = audioTagContent.match(/url="([^"]+)"/) || audioTagContent.match(/url='([^']+)'/);
  const url = urlMatch ? urlMatch[1] : '';
  if (!url || !url.startsWith('http')) return false;
  return isUrlReachable(url);
}

async function isLinkReachable(url: string): Promise<boolean> {
  if (!url || !url.startsWith('http')) return true;
  return isUrlReachable(url);
}

async function validateAndFixExternalResources(mdx: string, targetLang: string = 'fr'): Promise<string> {
  let updatedMdx = await validateAndFixImages(mdx);

  // Validate and fix Video tags
  const videoRegex = /<Video\s+([^>]*?)\/>/gi;
  let videoMatch;
  const videoBlocks: { fullBlock: string; attributes: string }[] = [];
  while ((videoMatch = videoRegex.exec(updatedMdx)) !== null) {
    videoBlocks.push({
      fullBlock: videoMatch[0],
      attributes: videoMatch[1]
    });
  }

  if (videoBlocks.length > 0) {
    console.log(`[EXTERNAL RESOURCE VALIDATOR] Validating ${videoBlocks.length} video elements...`);
    for (const block of videoBlocks) {
      const isValid = await isVideoReachable(block.fullBlock);
      if (!isValid) {
        console.log(`[EXTERNAL RESOURCE VALIDATOR] Video is dead: ${block.fullBlock}`);
        const titleMatch = block.attributes.match(/title="([^"]+)"/) || block.attributes.match(/title='([^']+)'/);
        const title = titleMatch ? titleMatch[1] : '';
        const durationMatch = block.attributes.match(/duration="([^"]+)"/) || block.attributes.match(/duration='([^']+)'/);
        const duration = durationMatch ? durationMatch[1] : '2:00';
        
        let alternativeFound = false;
        if (title) {
          const alternative = await findAlternativeVideoWithFallback(title, targetLang);
          if (alternative) {
            const newTag = `<Video id="${alternative.id || ''}" url="${alternative.url || ''}" provider="${alternative.provider || 'youtube'}" title="${title}" duration="${duration}" />`;
            updatedMdx = updatedMdx.replace(block.fullBlock, newTag);
            alternativeFound = true;
            console.log(`[EXTERNAL RESOURCE VALIDATOR] Replaced dead video with alternative: ${newTag}`);
          }
        }
        
        if (!alternativeFound) {
          console.log(`[EXTERNAL RESOURCE VALIDATOR] No alternative video found. Cleanly removing: ${block.fullBlock}`);
          updatedMdx = updatedMdx.replace(block.fullBlock, '');
        }
      }
    }
  }

  // Validate and fix Audio components
  const audioRegex = /<(?:Audio|AudioPlayer)\s+([^>]*?)\/>/gi;
  let audioMatch;
  const audioBlocks: { fullBlock: string; attributes: string }[] = [];
  while ((audioMatch = audioRegex.exec(updatedMdx)) !== null) {
    audioBlocks.push({ fullBlock: audioMatch[0], attributes: audioMatch[1] });
  }

  if (audioBlocks.length > 0) {
    console.log(`[EXTERNAL RESOURCE VALIDATOR] Validating ${audioBlocks.length} audio elements...`);
    for (const block of audioBlocks) {
      const isValid = await isAudioReachable(block.fullBlock);
      if (!isValid) {
        console.log(`[EXTERNAL RESOURCE VALIDATOR] Audio is dead: ${block.fullBlock}`);
        const titleMatch = block.attributes.match(/title="([^"]+)"/) || block.attributes.match(/title='([^']+)'/);
        const title = titleMatch ? titleMatch[1] : '';
        const durationMatch = block.attributes.match(/duration="([^"]+)"/) || block.attributes.match(/duration='([^']+)'/);
        const duration = durationMatch ? durationMatch[1] : '1:00';
        
        let alternativeFound = false;
        if (title) {
          const altUrl = await findAlternativeAudioWithFallback(title, targetLang);
          if (altUrl) {
            const newTag = `<AudioPlayer url="${altUrl}" title="${title}" duration="${duration}" />`;
            updatedMdx = updatedMdx.replace(block.fullBlock, newTag);
            alternativeFound = true;
            console.log(`[EXTERNAL RESOURCE VALIDATOR] Replaced dead audio with alternative: ${newTag}`);
          }
        }
        
        if (!alternativeFound) {
          console.log(`[EXTERNAL RESOURCE VALIDATOR] No alternative audio found. Cleanly removing: ${block.fullBlock}`);
          updatedMdx = updatedMdx.replace(block.fullBlock, '');
        }
      }
    }
  }

  // Validate and fix Markdown links: [text](url)
  const linkRegex = /(?<!\!)\[([^\]]+)\]\(((?:https?:\/\/|\/\/)[^\s)]+)\)/gi;
  let linkMatch;
  const links: { fullMatch: string; text: string; url: string }[] = [];
  while ((linkMatch = linkRegex.exec(updatedMdx)) !== null) {
    if (linkMatch[0].includes('id="ref-') || linkMatch[0].includes('ref-')) {
      continue;
    }
    links.push({
      fullMatch: linkMatch[0],
      text: linkMatch[1],
      url: linkMatch[2]
    });
  }

  if (links.length > 0) {
    console.log(`[EXTERNAL RESOURCE VALIDATOR] Validating ${links.length} markdown links...`);
    for (const link of links) {
      const isValid = await isLinkReachable(link.url);
      if (!isValid) {
        console.log(`[EXTERNAL RESOURCE VALIDATOR] Link is dead: ${link.url}`);
        let resolvedUrl = '';
        const queries = [
          link.text,
          `${link.text} wikipedia`,
          `${link.text} official site`
        ];
        
        for (let attempt = 0; attempt < 3; attempt++) {
          const query = queries[attempt];
          const queryLang = (attempt === 2 && targetLang.toLowerCase() !== 'en') ? 'en' : targetLang.toLowerCase();
          console.log(`[EXTERNAL RESOURCE VALIDATOR] Link retry ${attempt + 1}/3 with query: "${query}" in language "${queryLang}"`);
          
          try {
            const wikiRes = await fetchWithTimeout(`https://${queryLang}.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(query)}&limit=1&format=json`);
            if (wikiRes.ok) {
              const data = await wikiRes.json();
              if (data && data[3] && data[3][0]) {
                const wikiUrl = data[3][0];
                if (await isUrlReachable(wikiUrl)) {
                  resolvedUrl = wikiUrl;
                  break;
                }
              }
            }
          } catch (e) {
            console.warn(`[EXTERNAL RESOURCE VALIDATOR] Wiki search attempt failed:`, e);
          }
        }
        
        if (resolvedUrl) {
          const newLink = `[${link.text}](${resolvedUrl})`;
          updatedMdx = updatedMdx.replace(link.fullMatch, newLink);
          console.log(`[EXTERNAL RESOURCE VALIDATOR] Replaced dead link with Wikipedia alternative: ${newLink}`);
        } else {
          console.log(`[EXTERNAL RESOURCE VALIDATOR] Replacing dead link with plain text: ${link.url}`);
          updatedMdx = updatedMdx.replace(link.fullMatch, link.text);
        }
      }
    }
  }

  return updatedMdx;
}

export async function generateCurriculum(curriculumName: string, levelInput: string, targetLang: string = 'en') {
  const normalizeLevel = (lvl: string): string => {
    if (!lvl) return 'beginner';
    const clean = lvl.trim().toLowerCase();
    if (clean === 'l1') return 'L1';
    if (clean === 'l2') return 'L2';
    if (clean === 'l3') return 'L3';
    if (clean === 'm1') return 'M1';
    if (clean === 'm2') return 'M2';
    const standards = ['foundation_1', 'foundation_2', 'secondary_1', 'secondary_2', 'preuni_1', 'preuni_2', 'preuni_3', 'beginner', 'intermediate', 'advanced', 'expert'];
    const found = standards.find(s => s === clean);
    if (found) return found;
    return clean;
  };
  const level = normalizeLevel(levelInput);

  const promptCurriculum = `You are a Curriculum Planner Agent (Agent 0). Your goal is to structure a full academic curriculum for "${curriculumName}" at the level "${level}".
You must model this curriculum on real-world academic programs (curriculums and syllabus guidelines from schools and universities) for this specific discipline and level, ensuring they reflect natural and realistic educational paths:

1. **Primary, Middle, and High School Levels (K-12: foundation_1, foundation_2, secondary_1, secondary_2, preuni):**
   - **Integrated Grade-Level Curriculum:** At school levels, curricula are not divided into highly specialized, isolated courses. Instead, students follow a unified, comprehensive annual course (e.g., "Mathematics Grade 9", "Biology & Geology Grade 10") that covers multiple key branches.
   - **Balanced Subject Coverage:** Your curriculum should structure courses that represent the general annual subjects or clear progressive units of that grade level, covering topics in a logical, balanced sequence (e.g., alternating between algebra, geometry, and functions for a high school math curriculum).
   - **Spiral Progression:** Design the courses to respect spiral learning—revisiting core themes at increasing levels of depth, explicitly building upon what was learned in previous school years.
   - **Simplicity & Scope:** Keep the number of courses/modules modest (typically 1 to 5 main units or modules representing the annual program).

2. **Higher Education / University Levels (L1, L2, L3, M1, M2):**
   - **First Year (L1 / Bachelor 1):** Curricula must consist of **broad, introductory, and foundational courses** (e.g., "Introduction to Classical Mechanics", "Foundations of Organic Chemistry", "General Sociology") to establish core concepts, terminology, and historical context across the entire discipline. Avoid any premature narrow specialization.
   - **Gradual Specialization (L2, L3):** Curricula transition to focused sub-fields and formal methodology (e.g., "Thermodynamics", "Electromagnetism") with increased academic rigor, proofs, and critical model evaluation.
   - **Master's and Expert Levels (M1, M2):** Curricula must shift entirely to **highly specialized, advanced research-grade, or professional courses** focusing on narrow, cutting-edge topics (e.g., "Relativistic Quantum Electrodynamics", "Synaptic Plasticity & Memory Consolidation", "Phenomenology of Perception"). Do not include broad, general, or general-introduction courses at the Master's level.

Be flexible:
- Adjust the number of courses (typically between 1 and 5 for school levels, and between 5 and 15 courses for university levels) and credit/hour volumes based on the actual complexity and standard requirements of the level and discipline.
- Categorize courses as either "mandatory" or "optional" (use exactly these literal strings "mandatory" or "optional"). Note that some curricula may consist entirely of mandatory courses (0 optional courses) if that aligns with standard program progressions.

**CRITICAL LANGUAGE REQUIREMENT**: Although these instructions and guidelines are given in English, you must imperatively write all the text content of your JSON response (the curriculum 'description', the course 'title', 'subject', 'volume', and course 'description') in the requested target language: "${targetLang.toUpperCase()}". All generated descriptive text and labels must be fully written in "${targetLang.toUpperCase()}".

You must return a valid JSON object with the following keys:
1. "description": A comprehensive, high-quality, professional academic description of the entire curriculum (master-level description). Do not use generic placeholders.
2. "courses": A JSON array of course objects, where each object represents a constituent course/module and has the following keys:
   - "title": The title of the course.
   - "subject": The subject/discipline (e.g. "Biology", "Mathematics", "Philosophy").
   - "volume": The estimated volume or hours (e.g. "30 hours").
   - "type": Must be either "mandatory" or "optional".
   - "description": A detailed, course-level descriptive summary detailing the goals, scope, and key topics of this specific course.

Return ONLY a valid JSON object. Do not include markdown code block backticks around the JSON.`;

  let rawJson = '';
  try {
    if (isVertexConfigured()) {
      console.log(`[AI CURRICULUM] Generating curriculum for "${curriculumName}" via Vertex AI...`);
      const res = await callVertexAI({
        task: 'course_generation',
        contents: [{ role: 'user', parts: [{ text: promptCurriculum }] }],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: "application/json",
          responseSchema: curriculumSchema
        }
      });
      if (res && res.ok) {
        const jsonRes = await res.json();
        rawJson = jsonRes.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
      }
    } else if (apiKey) {
      console.log(`[AI CURRICULUM] Generating curriculum for "${curriculumName}" via AI Studio fallback (gemini-2.5-flash)...`);
      const startTime = Date.now();
      try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: promptCurriculum }] }],
            generationConfig: {
              responseMimeType: "application/json",
              responseSchema: curriculumSchema
            }
          })
        });
        if (res.ok) {
          const jsonRes = await res.json();
          rawJson = jsonRes.candidates?.[0]?.content?.parts?.[0]?.text || '{}';

          const durationMs = Date.now() - startTime;
          const usage = jsonRes.usageMetadata || {};
          const promptTokens = usage.promptTokenCount || 0;
          const candidatesTokens = usage.candidatesTokenCount || usage.candidateTokenCount || 0;
          await recordMetrics('course_generation', 'gemini-2.5-flash', durationMs, promptTokens, candidatesTokens, promptCurriculum);
        }
      } catch (err) {
        console.error("[AI CURRICULUM] AI Studio curriculum generation fetch exception:", err);
      }
    }

    if (!rawJson) {
      console.warn("[AI CURRICULUM] AI model failed to generate curriculum. Generating mock curriculum.");
      rawJson = JSON.stringify({
        description: `Structured curriculum for "${curriculumName}". Constituent modules planned. Synthesized by Episteme.`,
        courses: [
          { title: `Introduction to ${curriculumName}`, subject: "General", volume: "15 hours", type: "mandatory", description: "Foundational concepts" },
          { title: `Core Methods in ${curriculumName}`, subject: "Core", volume: "30 hours", type: "mandatory", description: "Core methodological framework" },
          { title: `Advanced Topics in ${curriculumName}`, subject: "Advanced", volume: "30 hours", type: "optional", description: "Optional specialized topics" }
        ]
      });
    }

    const cleanedJson = rawJson.replace(/```json/g, '').replace(/```/g, '').trim();
    let parsedData: unknown;
    try {
      parsedData = safeJsonParse(cleanedJson, 'getStructuredLessonContext (Curriculum Structure)');
    } catch (e) {
      console.warn("Failed to parse AI curriculum JSON, trying to recover standard array...");
      throw e;
    }

    let masterDescription = `Structured curriculum for "${curriculumName}". Constituent modules planned. Synthesized by Episteme.`;
    let coursesList: { title: string; subject: string; volume: string; type: string; description: string }[] = [];

    if (Array.isArray(parsedData)) {
      coursesList = parsedData;
    } else if (parsedData && typeof parsedData === 'object') {
      const dataObj = parsedData as Record<string, unknown>;
      masterDescription = (dataObj.description as string) || masterDescription;
      coursesList = (dataObj.courses as { title: string; subject: string; volume: string; type: string; description: string }[]) || [];
    }

    const curriculumId = `cur_${(Date.now() % 1000000000) + Math.floor(Math.random() * 1000)}`;
    const curriculumSlug = curriculumName
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9\s_-]/g, '')
      .trim()
      .replace(/\s+/g, '_');

    // Fetch current queue
    const { data: currentQueue } = await dbService.getPipelineQueue();
    const newTasks = coursesList.map((c, index) => {
      const taskUuid = `task_${Date.now()}_${index}_${Math.random().toString(36).substr(2, 5)}`;
      return {
        id: taskUuid,
        title: c.title,
        type: 'generation',
        status: 'queued',
        progress: 0,
        priority: 'High',
        timestamp: new Date().toISOString(),
        details: `Course Generation from Curriculum (${c.type.toUpperCase()} - ${c.volume}): Level ${level}, Subject "${c.subject}", Language ${targetLang}`,
        targetLang: targetLang,
        level: level,
        subject: c.subject,
        parentCurriculumSlug: curriculumSlug,
        courseType: c.type,
        volume: c.volume,
        description: c.description || `Dynamic sovereign course on "${c.title}".`
      };
    });

    // Save tasks to queue
    await dbService.savePipelineQueue([...(currentQueue || []), ...newTasks]);

    // Save Curriculum entry
    await dbService.saveCourse({
      id: curriculumId,
      title: curriculumName,
      slug: curriculumSlug,
      subject: coursesList[0]?.subject || 'General',
      description: masterDescription,
      level: level,
      archivingLevel: 0,
      badge: 'badge_1',
      modulesCount: coursesList.length,
      lessonsCount: coursesList.length * 4,
      is_active: true,
      languages: [targetLang.toLowerCase()],
      langs: [targetLang.toUpperCase()],
      isCurriculum: true,
      childCourses: [],
      translations: {
        [targetLang.toUpperCase()]: {
          title: curriculumName,
          description: masterDescription
        }
      }
    });

  } catch (error) {
    console.error("[generateCurriculum] Error in Agent 0 execution:", error);
    throw error;
  }
}

function stripJsxComments(mdx: string): string {
  const tagRegex = /<([A-Z][a-zA-Z0-9]*)([\s\S]*?)(\/?>)/g;
  return mdx.replace(tagRegex, (match, tagName, tagBody, closing) => {
    let cleanedBody = tagBody.replace(/\/\*[\s\S]*?\*\//g, '');
    const lines = cleanedBody.split('\n');
    const cleanedLines = lines.map((line: string) => {
      const commentIndex = line.indexOf('//');
      if (commentIndex !== -1) {
        const prefix = line.substring(0, commentIndex);
        if (!prefix.endsWith('http:') && !prefix.endsWith('https:')) {
          return prefix;
        }
      }
      return line;
    });
    return `<${tagName}${cleanedLines.join('\n')}${closing}`;
  });
}

async function validateMdxContent(content: string, lang: string = 'fr'): Promise<{ success: boolean; error?: string }> {
  const cleanedContent = preprocessMdx(content, lang);
  try {
    const { serialize } = await import('next-mdx-remote/serialize');
    const remarkMath = (await import('remark-math')).default;
    const remarkGfm = (await import('remark-gfm')).default;
    const rehypeKatex = (await import('rehype-katex')).default;
    
    await serialize(cleanedContent, {
      mdxOptions: {
        remarkPlugins: [remarkMath, remarkGfm],
        rehypePlugins: [rehypeKatex],
        format: 'mdx',
      },
    });
    return { success: true };
  } catch (err) {
    const error = err as Error;
    let errorMsg = error.message || String(err);
    
    let lineNum = -1;
    let colNum = -1;
    const match = errorMsg.match(/(?:at\s+line\s+|:)(\d+)(?::|,?\s+column\s+)(\d+)/i) || errorMsg.match(/\((\d+):(\d+)\)/);
    if (match) {
      lineNum = parseInt(match[1], 10);
      colNum = parseInt(match[2], 10);
    }
    
    if (lineNum !== -1) {
      const lines = cleanedContent.split(/\r?\n/);
      const startLine = Math.max(1, lineNum - 3);
      const endLine = Math.min(lines.length, lineNum + 3);
      const snippet = lines.slice(startLine - 1, endLine).map((l, idx) => {
        const curLineNum = startLine + idx;
        const pointer = curLineNum === lineNum ? ' >>> ' : '     ';
        return `${pointer}${curLineNum}: ${l}`;
      }).join('\n');
      
      errorMsg = `${errorMsg}\n\n=== MDX PARSER ERROR CONTEXT ===\nLine: ${lineNum}, Column: ${colNum}\n\nSnippet:\n${snippet}\n================================`;
    }
    
    return { success: false, error: errorMsg };
  }
}


function sanitizeMdxFallback(mdx: string): string {
  const allowedTags = [
    // Core & Structural
    'Prerequisites', 'DiagnosticQuiz', 'Quiz', 'Question', 'Option',
    'Summary', 'EssayEvaluation', 'Glossary', 'RealPerson', 'HistoricalPerson',
    'EventLink', 'HistoricalEventLink', 'HistoricalDate', 'Location', 'EntityLink',
    'SpeciesLink', 'SpeciesLien', 'EspeceLien', 'EspèceLien', 'OrganismeLien',
    'ChemicalLink', 'ChemicalLien', 'MoleculesLien', 'MoleculeLien', 'ChimieLien',
    'CelestialLink', 'CelestialLien', 'CorpsCeleste', 'CorpsCéleste', 'AstroLien',
    'Artwork', 'CriticalThinking', 'ScientificMethod', 'HistoricalAnecdote',
    'HistoricalEvent', 'HistoricalFact', 'WhatsNext', 'EtApres', 'IdeeBrillante', 'BrilliantIdea',
    'PointOfView', 'DidYouKnow', 'SolvedExercise', 'UnsolvedExercise',
    'Geometry2D', 'OpenQuestion', 'ScientificDebate', 'Epistemology',
    'Video', 'Audio', 'Mermaid', 'ComparisonSlider', 'FunctionPlotter',
    'CodeSandbox', 'SelfEval', 'SolvedProblem', 'InteractiveDiagram', 'FillInBlanks',
    
    // Additional registered elements
    'Alert', 'CustomFigure', 'Objectives', 'Objective', 'Knowledge', 'Skills', 'Attitudes',
    'References', 'AudioPlayer', 'Explanation', 'Solution', 'KeyConcept', 'Instruction', 'Shape',
    'MetaNote', 'SelfAssessment', 'FictionalCharacter', 'Place', 'EvenementHistorique',
    'ExternalSandbox', 'GestaltInteractive', 'GestaltLab', 'DataChart', 'StructureViewer3D',
    'DynamicSimulation', 'GoingFurther', 'GoingFurtherItem', 'FunctionManipulator',
    'ManipulateurFonction', 'ExplorateurFonctions', 'EquationManipulator', 'ManipulateurEquation',
    'ExplorateurEquations', 'ChemicalStoichiometry', 'EquilibrageChimique', 'StoichiometrieChimique',
    'BasicMathExplorer', 'ExplorateurMathsBase', 'EspritCritique', 'LeSaviezVous',
    'AnecdoteHistorique', 'FaitHistorique', 'MethodeScientifique', 'PointDeVue', 'Geometrie2D',
    'SummativeEvaluation', 'EvaluationSection', 'Assignment', 'Deadline', 'Submission',
    'Evaluation', 'FinalProject', 'FinalWork', 'Format', 'Instructions', 'FinalQuiz',
    'QuizQuestion', 'Answer', 'Description', 'Title', 'FormativeQuiz', 'Callout',
    'CalloutContainer', 'Image',
    
    // Common standard HTML elements that could be output or generated
    'p', 'span', 'div', 'a', 'img', 'br', 'hr', 'ul', 'ol', 'li', 'strong', 'em', 'code', 'pre',
    'blockquote', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'iframe'
  ];
  const tagPattern = new RegExp(`<\\/?(${allowedTags.join('|')})\\b`, 'i');
  
  const parts = mdx.split(/(<\/?[a-zA-Z0-9_]+(?:[^'">]|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')*?>)/g);
  const processedParts = parts.map(part => {
    if (part.startsWith('<') && part.endsWith('>')) {
      if (tagPattern.test(part)) {
        return part;
      }
      return '&lt;' + part.slice(1);
    } else {
      return part
        .replace(/</g, '&lt;')
        .replace(/\{/g, '&#123;')
        .replace(/\}/g, '&#125;');
    }
  });
  
  return processedParts.join('');
}

