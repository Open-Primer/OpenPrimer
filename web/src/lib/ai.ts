import { dbService } from './db';
import { supabase, supabaseAdmin } from './supabase';
import { callVertexAI, isVertexConfigured, recordMetrics } from './vertex-client';
import { preprocessMdx, isolateJsxForTranslation, restoreJsxAfterTranslation } from './content';
import { resolveAndPersistMedia } from './media-resolver';
import { cleanPathSegment } from './translations';
import { TASK_MODELS } from './ai-config';


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
    }
  },
  required: ["courseContext", "lessons"]
};

const verificationSchema = {
  type: "object",
  properties: {
    approved: { type: "boolean" },
    critique: { type: "string" }
  },
  required: ["approved", "critique"]
};

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
    "conclusionSummary",
    "finalEvaluation",
    "glossary",
    "references"
  ]
};

export function validateAndFixWidgets(widgets: any): any {
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
      }
      return comp;
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

    if (comp.componentType === "Quiz") {
      compStr = `<Quiz durationLimit={${comp.props.durationLimit || 300}}>\n  ${comp.props.questions.map((q: any) => `  <Question q="${q.q.replace(/"/g, '&quot;')}" explanation="${(q.explanation || '').replace(/"/g, '&quot;')}">\n    ${q.options.map((o: any) => `<Option text="${o.text.replace(/"/g, '&quot;')}" correct={${o.correct}} />`).join('\n    ')}\n  </Question>`).join('\n  ')}\n</Quiz>`;
    } else if (comp.componentType === "FillInBlanks") {
      compStr = `<FillInBlanks sentence="${comp.props.sentence.replace(/"/g, '&quot;')}" answer="${comp.props.answer.replace(/"/g, '&quot;')}" />`;
    } else if (comp.componentType === "SolvedExercise") {
      compStr = `<SolvedExercise title="${comp.props.title.replace(/"/g, '&quot;')}" solution="${comp.props.solution.replace(/"/g, '&quot;')}">\n  ${comp.props.problem}\n</SolvedExercise>`;
    } else if (comp.componentType === "UnsolvedExercise") {
      compStr = `<UnsolvedExercise title="${comp.props.title.replace(/"/g, '&quot;')}" correctAnswer="${comp.props.correctAnswer.replace(/"/g, '&quot;')}" explanation="${(comp.props.explanation || '').replace(/"/g, '&quot;')}">\n  ${comp.props.problem}\n</UnsolvedExercise>`;
    } else if (comp.componentType === "Mermaid") {
      compStr = `<Mermaid chart={\`${comp.props.chart}\`} />`;
    } else if (comp.componentType === "FunctionPlotter") {
      compStr = `<FunctionPlotter fn="${comp.props.fn}" domain={${JSON.stringify(comp.props.domain || [-10, 10])}} />`;
    } else if (comp.componentType === "CodeSandbox") {
      compStr = `<CodeSandbox initialCode={\`${comp.props.initialCode || ''}\`} language="${comp.props.language || 'javascript'}" />`;
    } else if (comp.componentType === "DataChart") {
      compStr = `<DataChart title="${(comp.props.title || '').replace(/"/g, '&quot;')}" data={${JSON.stringify(comp.props.data || [])}} xKey="${comp.props.xKey || 'label'}" yKey="${comp.props.yKey || 'value'}" />`;
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
    finalEvalStr = `<Quiz durationLimit={${fProps.durationLimit || 1800}}>\n  ${(fProps.questions || []).map((q: any) => `  <Question q="${q.q.replace(/"/g, '&quot;')}" explanation="${(q.explanation || '').replace(/"/g, '&quot;')}">\n    ${(q.options || []).map((o: any) => `<Option text="${o.text.replace(/"/g, '&quot;')}" correct={${o.correct}} />`).join('\n    ')}\n  </Question>`).join('\n  ')}\n</Quiz>`;
  } else {
    finalEvalStr = `<EssayEvaluation prompt="${(widgets.finalEvaluation.props.prompt || '').replace(/"/g, '&quot;')}" subject="${(widgets.finalEvaluation.props.subject || '').replace(/"/g, '&quot;')}" durationLimit={3600} />`;
  }

  if (content.includes('[[WIDGET:finalEvaluation]]')) {
    content = content.replace('[[WIDGET:finalEvaluation]]', finalEvalStr);
  } else {
    content = content + `\n\n${finalEvalStr}`;
  }

  const glossaryStr = `\n\n### Glossaire\n\n${widgets.glossary.map((g: any) => `* **${g.term}** : ${g.definition}`).join('\n')}`;
  content = content + glossaryStr;

  // Extract all cited reference numbers from the narrative text
  const citedRefs = getCitedReferenceNumbers(content);

  // Group references into cited and uncited
  const citedList: string[] = [];
  const uncitedList: string[] = [];

  widgets.references.forEach((ref: string, idx: number) => {
    const refNum = idx + 1;
    const cleanRef = ref.replace(/^\[\d+\]\s*/, '');
    if (citedRefs.has(refNum)) {
      citedList.push(`* [${refNum}] ${cleanRef}`);
    } else {
      uncitedList.push(`* ${cleanRef}`);
    }
  });

  // Build references section based on target language keywords in content
  const isFr = content.toLowerCase().includes('présentation') || content.toLowerCase().includes('introduction') || content.toLowerCase().includes('références') || content.toLowerCase().includes('glossaire');
  const refHeading = isFr ? '### Références' : '### References';
  const readingHeading = isFr ? '#### Lectures complémentaires' : '#### Further Reading';

  let referencesStr = '';
  if (citedList.length > 0) {
    referencesStr += `\n\n${refHeading}\n\n${citedList.join('\n')}`;
  } else {
    // Fallback if none are cited: render them all under primary heading as plain bullets
    referencesStr += `\n\n${refHeading}\n\n${uncitedList.join('\n')}`;
  }

  if (citedList.length > 0 && uncitedList.length > 0) {
    referencesStr += `\n\n${readingHeading}\n\n${uncitedList.join('\n')}`;
  }

  content = content + referencesStr;

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

  // 1. Generate syllabus (lesson titles and slugs)
  const promptSyllabus = `You are the Primary Pedagogical Architect Agent (Agent 1 & 2).
Ta mission est de concevoir la structure, le chapitrage et la stratégie cognitive du cours intitulé "${correctedCourseName}" pour le niveau "${level}". Tu ne rédiges pas le cours, tu en crées l'ossature computationnelle et didactique la plus pure et la plus adaptée.

Un cours d'anatomie ne s'articule pas comme un cours de topologie algébrique ou de philosophie politique. Tu dois impérativement adapter le squelette du cours à l'ADN épistémologique de la discipline et à l'âge du public visé (de la Primaire à la Licence 3).

---

# ETAPE 1 : PROFILAGE DE LA DISCIPLINE (ADN COGNITIF)
Avant de générer le moindre chapitre, tu dois classifier la discipline cible selon son mode d'administration de la preuve et de la transmission. Tu choisiras et appliqueras la matrice dominante parmi les suivantes :

1. **Sciences Déductives / Formelles (Mathématiques, Logique, Physique Théorique) :**
   * Focus : Rigueur absolue, chaîne causale sans faille.
   * Composants obligatoires : Lemme ➔ Théorème ➔ Démonstration ➔ Corollaire. Chaque brique doit découler logiquement de la précédente.

2. **Sciences Empiriques / Expérimentales (Biologie, Physique Expérimentale, Chimie) :**
   * Focus : Observation du réel, double codage visuel.
   * Composants obligatoires : Hypothèse ➔ Protocole Expérimental ➔ Observation/Données ➔ Interprétation/Modélisation. Présence massive de schémas, d'atlas ou d'illustrations anatomiques/structurelles.

3. **Sciences Humaines et Discursives (Philosophie, Histoire, Littérature) :**
   * Focus : Rhétorique, problématisation, dialectique.
   * Composants obligatoires : Thèse ➔ Antithèse ➔ Synthèse (ou approche généalogique/conceptuelle). Analyse textuelle fine, contextualisation socio-historique, controverses doctrinales.

4. **Sciences Appliquées / Ingénierie (Informatique, Architecture des Systèmes, Électronique) :**
   * Focus : Résolution de problèmes, design pattern, constructivisme.
   * Composants obligatoires : Expression du besoin ➔ Contraintes techniques ➔ Spécification de l'Architecture ➔ Implémentation/Code ➔ Tests de validation.

---

# ETAPE 2 : ADAPTATION AU PUBLIC (GRADATION COGNITIVE ET COHÉRENCE COGNITIVE NATURELLE)
Le plan de cours doit refléter fidèlement la capacité d'abstraction et la structure d'apprentissage naturelle du public cible :

1. **Primaire, Collège et Lycée (K-12 : de foundation_1 à preuni) :**
   * **Rapprochement des parcours réels :** À l'école, l'enseignement ne se fait pas par cours cloisonnés hyper-spécifiques. Si le cours demandé porte sur un programme annuel général (ex: "Mathématiques de 3ème"), le syllabus doit proposer un découpage thématique réaliste et équilibré couvrant les grands piliers officiels (ex: Géométrie, Fonctions, Équations). 
   * **Apprentissage en spirale (Spiralaire) :** Les mêmes concepts clés (ex: fractions, vecteurs, géométrie) sont revisités d'année en année avec un niveau d'abstraction croissant. Si le cours porte sur un concept ciblé (ex: "Géométrie au Collège"), structure les leçons de façon progressive en rappelant explicitement les notions acquises dans les classes précédentes et en connectant logiquement chaque chapitre à l'ossature générale de l'apprentissage annuel réel.
   * **Règles de cadrage & taille :**
     * *Primaire (foundation_1 & foundation_2) :* Approche narrative, métaphorique et inductive. Maximum 3 leçons très courtes au total (y compris l'Introduction et l'Évaluation Finale).
     * *Collège/Lycée (secondary_1 & secondary_2) :* Transition graduelle vers la formalisation, rigueur croissante. Introduction des méthodes propres à la pensée disciplinaire. 4 à 6 leçons bien distinctes au total (y compris l'Introduction et l'Évaluation Finale).

2. **Enseignement Supérieur / Université (L1 à M2 / de beginner à expert) :**
   * *Licence 1 (L1 / Bachelor 1er) :* Les cours doivent être généraux, fondateurs et introductifs (ex: "Introduction à l'Algèbre Linéaire", "Fondements de la Thermodynamique"). Ils doivent poser les concepts clés, le vocabulaire universel et la rigueur méthodologique globale de la discipline.
   * *Licence 2 & Licence 3 (L2-L3) :* Transition vers la modélisation formelle et l'étude des sous-branches précises avec un formalisme académique strict, des preuves formelles et une analyse critique des limites des modèles étudiés.
   * *Master 1 & Master 2 (M1-M2 / advanced & expert) :* Les cours doivent basculer intégralement sur de **l'ultra-spécialisation de pointe**, axée sur des sujets de recherche avancés, pointus et extrêmement techniques (ex: "Méthodes numériques pour la dynamique des fluides turbulents", "Neurobiologie de la transmission synaptique"). Aucun cours généraliste ou d'introduction globale ne doit être généré à ce niveau.

---

# ETAPE 3 : FORMAT DE SORTIE ATTENDU
Tu dois sortir uniquement un objet JSON structurant le cours. Le chapitrage doit être exhaustif, détaillé et ne comporter AUCUN élément vague. Chaque sous-section doit spécifier sa "stratégie éditoriale".
Le JSON généré doit être entièrement rédigé dans la langue cible suivante : "${targetLang}" (les titres, stratégies, et descriptions doivent être dans cette langue).
Ne renvoie PAS de balises de bloc de code markdown (\`\`\`). Rends uniquement l'objet JSON brut.


{
  "courseContext": {
    "discipline": "[Nom de la discipline]",
    "description": "[Description détaillée et attractive du cours en 2-3 phrases, présentant les objectifs pédagogiques généraux et les compétences clés visées]",
    "epistemologicalMatrix": "[Déductive / Empirique / Discursive / Ingénierie]",
    "targetLevel": "${level}",
    "pedagogicalStrategy": "[Explication de la stratégie adoptée pour ce public et cette discipline]"
  },
  "lessons": [
    {
      "title": "[Titre explicite et percutant de la leçon / du chapitre]",
      "slug": "[Slug URL-friendly en ASCII]",
      "cognitiveArtifact": "[Spécifier : Démonstration de lemme / Schéma d'anatomie légendé / Analyse de texte / Bloc de code Sandbox]",
      "technicalDepth": "[Niveau de détail attendu pour guider l'agent rédacteur Agent 3]"
    }
  ]
}

---

# CONTRÔLE QUALITÉ ET INTERDICTIONS STRICTES
* **Interdiction absolue du plan générique :** Un plan de cours de Mathématiques L3 qui ressemble à un plan d'Histoire (ex: I. Introduction, II. Évolution, III. Conclusion) sera rejeté.
* **Exhaustivité du chapitrage :** Tu dois spécifier 4 à 6 leçons bien distinctes (maximum 3 pour le niveau Primaire). L'agent rédacteur (Agent 3) ne doit avoir aucune extrapolation à faire sur le plan.
* **Introduction obligatoire :** La toute première leçon du cours (le premier élément de la liste 'lessons') doit obligatoirement être une leçon d'Introduction (titre: "Introduction" ou "Introduction à [Sujet]" ou équivalent dans la langue "${targetLang}", slug: "introduction" ou "introduction-a-[sujet]"). Cette première leçon doit être rédigée avec la même qualité et rigueur académique que les autres leçons, sans aucun placeholder ou fallback.
* **Évaluation Finale globale obligatoire :** La toute dernière leçon du cours (le dernier élément de la liste 'lessons') doit obligatoirement être consacrée à l'Évaluation Finale (titre: "Évaluation Finale" ou "Final Evaluation" selon la langue "${targetLang}", slug: "evaluation-finale" ou "final-evaluation"). Ce chapitre ne doit pas introduire de nouveaux concepts, mais servir d'examen final sommatif pour évaluer l'assimilation globale de l'ensemble du cours.`;

  try {
    let parsedSyllabus: any = null;
    let lessonsList: { title: string; slug: string; cognitiveArtifact?: string; technicalDepth?: string }[] = [];
    let courseContext: any = {};

  if (taskId) {
    try {
      const { data: taskData, error: taskError } = await supabaseAdmin
        .from('task_queue')
        .select('description')
        .eq('id', taskId)
        .single();
      if (!taskError && taskData?.description) {
        const extra = JSON.parse(taskData.description || '{}');
        if (extra.syllabus) {
          await appendTaskLog(`[AI GENERATOR] Found cached syllabus in task description. Reusing to prevent duplicate chapters.`);
          parsedSyllabus = extra.syllabus;
        }
      }
    } catch (err) {
      console.warn(`[AI GENERATOR WARNING] Failed to retrieve cached syllabus for task ${taskId}:`, err);
    }
  }

  // If we have a lessonOffset > 0, but no cached syllabus, we have a mismatch hazard!
  // In this case, we reset lessonOffset to 0 and start from scratch to guarantee course consistency.
  if (lessonOffset > 0 && !parsedSyllabus) {
    await appendTaskLog(`[AI GENERATOR WARNING] lessonOffset is ${lessonOffset} but no cached syllabus was found. Resetting offset to 0 to avoid duplicates.`);
    lessonOffset = 0;
  }

  // If lessonOffset is 0, clear any existing lessons for this course and language to avoid duplicates from previous failed runs.
  if (lessonOffset === 0 && !process.env.REGENERATE_CHAPTER_1_ONLY) {
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

      if (!lessonsList || lessonsList.length === 0) {
        throw new Error(`[AI GENERATOR CRITICAL ERROR] AI model generated an empty or invalid syllabus for course "${correctedCourseName}". Lessons list is empty.`);
      }

      lessonsList.forEach((les: any, idx: number) => {
        if (!les || typeof les !== 'object' || !les.title || !les.slug) {
          throw new Error(`[AI GENERATOR CRITICAL ERROR] Syllabus lesson at index ${idx} is missing a title or slug: ${JSON.stringify(les)}`);
        }
      });

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

    // 2. For each lesson, generate rich MDX content with concurrency limit
    await mapConcurrent(lessonsList, MAX_PARALLEL_LESSONS, async (item, index) => {
      if (index < lessonOffset) {
        console.log(`[INCREMENTAL] Skipping lesson "${item.title}" because it is below the resume offset ${lessonOffset}.`);
        return;
      }

      // Check if this lesson already exists and is non-empty (incremental generation check)
      try {
        const { data: existingLesson } = await dbService.getLesson(
          cleanPathSegment(correctedCourseName),
          item.slug,
          targetLang.toLowerCase()
        );
        if (existingLesson && existingLesson.content && existingLesson.content.trim().length > 100) {
          await appendTaskLog(`[INCREMENTAL] Skipping generation for already existing lesson: "${item.title}" (${item.slug})`);
          await updateTaskProgress(item.title);
          return;
        }
      } catch (err) {
        console.warn(`[INCREMENTAL] Check failed for "${item.title}", proceeding with generation.`, err);
      }

      // Stagger starts to smooth API requests
      if (index > 0 && INTER_LESSON_DELAY_MS > 0) {
        const delay = index * INTER_LESSON_DELAY_MS;
        console.log(`[THROTTLE] Delaying start of lesson "${item.title}" (${index + 1}/${lessonsList.length}) by ${delay / 1000}s...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }

      const isPrimary = levelInput.toLowerCase().includes('primary') || levelInput.toLowerCase().includes('primaire');
      const isLastLesson = index === lessonsList.length - 1 && lessonsList.length > 1;

      await appendTaskLog(`[AI GENERATOR - WFTA] [STAGE 1] Generating Widgets JSON for lesson "${item.title}"...`);
      
      // Construct a very precise prompt for Stage 1 Widgets generation
      const widgetsPrompt = `You are a world-class educational curriculum architect (Agent 3 - Widgets Designer).
Your task is to generate ALL interactive widgets, objectives, prerequisites, final evaluations, glossary, and reference resources for the academic lesson "${item.title}" in the course "${correctedCourseName}" (Level: ${levelInput}).

Course Discipline: ${courseContext.discipline || 'General'}
Course Epistemological Matrix: ${courseContext.epistemologicalMatrix || 'N/A'}
Lesson Cognitive Artifact: ${item.cognitiveArtifact || 'N/A'}
Lesson Technical Depth / Expected Guidelines: ${item.technicalDepth || 'N/A'}
Target Language: ${targetLang.toUpperCase()}

### DISCIPLINARY & PEDAGOGICAL REQUIREMENTS FOR INTERACTIVE COMPONENTS:
Ensure you include highly relevant components in "interactiveComponents" that match the discipline and level:
1. **Life Sciences / Anatomy / Biology / Medicine**: You MUST systematically include at least one \<InteractiveDiagram\> of type "cell", "neuron" or "custom" with 3-6 distinct detailed hotspots.
2. **Mathematics / Physics / Economics / Finance**: You MUST systematically include at least one dynamic graph, equation sandbox or basic math explorer component: "FunctionPlotter", "FunctionManipulator", "EquationManipulator", "Geometry2D", or "BasicMathExplorer". You MUST also include at least one Solved Worked Example ("SolvedExercise") and one Unsolved Numeric Challenge ("UnsolvedExercise" with tolerance).
3. **Computer Science / Software Engineering**: You MUST systematically include at least one \<CodeSandbox\> for real-time coding with initial code.
4. **History / Geography / Social Sciences / Processes**: You MUST systematically include at least one process/timeline flowchart using Mermaid ("Mermaid" component with "chart" syntax).
5. **Statistical / Analytical Data (All disciplines)**: You MUST systematically include at least one gradient chart ("DataChart" component of type "bar" or "donut" with data array).
6. **Auditory & Video Enrichment**: You MUST systematically include at least one short audio or video resource ("Video" with empty ID to search on YouTube, or "Audio" with precise searchable title).

### OTHER REQUIRED SECTIONS:
- **prerequisites**: 1 to 2 logical prerequisite courses.
- **diagnosticQuiz**: A single multiple-choice question before the introduction allowing learners to skip sections.
- **learningObjectives**: KSA model objectives (Knowledge, Skills, Attitudes). If university level, use Revised Bloom's Taxonomy verbs (Analyze, Evaluate, Create / Analyser, Évaluer, Créer).
- **conclusionSummary**: Exactly 3 to 4 complete, grammatically whole and self-contained sentences summarizing the key takeaways (each must end with a period).
- **finalEvaluation**: A substantial, timed summative evaluation adapted to the discipline (MCQ Quiz with 5-10 questions in Flat-Prop format, or EssayEvaluation with a deep prompt).
- **glossary**: At least 3 key academic terms with clear definitions.
- **references**: At least 3-5 complete, real, authoritative academic references (exclude for primary school level). Ensure book/article titles are in standard quotes, not asterisks, and conform to **${getCitationStyle(courseContext.discipline || correctedCourseName).name}** style.

Return a valid JSON object matching the requested schema. Ensure all fields are in "${targetLang.toUpperCase()}".`;

      let widgetsJsonStr = '';
      let widgetsSuccess = false;
      let widgetsError = 'N/A';

      if (isVertexConfigured()) {
        try {
          const widgetsRes = await callVertexAI({
            task: 'course_generation',
            contents: [{ role: 'user', parts: [{ text: widgetsPrompt }] }],
            generationConfig: {
              temperature: 0.2,
              responseMimeType: "application/json",
              responseSchema: lessonWidgetsSchema
            }
          });
          if (widgetsRes && widgetsRes.ok) {
            const resJson = await widgetsRes.json();
            widgetsJsonStr = resJson.candidates?.[0]?.content?.parts?.[0]?.text || '';
            widgetsSuccess = true;
          } else {
            widgetsError = widgetsRes ? `HTTP ${widgetsRes.status} ${widgetsRes.statusText}` : 'Null Response';
          }
        } catch (err: any) {
          widgetsError = err.message || String(err);
          console.warn("[AI GENERATOR - WFTA] Vertex Stage 1 widgets call exception:", err);
        }
      }

      if (!widgetsSuccess && apiKey) {
        const startTime = Date.now();
        try {
          const widgetsRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: widgetsPrompt }] }],
              generationConfig: {
                responseMimeType: "application/json",
                responseSchema: lessonWidgetsSchema,
                temperature: 0.2
              }
            })
          });
          if (widgetsRes.ok) {
            const resJson = await widgetsRes.json();
            widgetsJsonStr = resJson?.candidates?.[0]?.content?.parts?.[0]?.text || '';
            widgetsSuccess = true;

            const durationMs = Date.now() - startTime;
            const usage = resJson.usageMetadata || {};
            await recordMetrics('course_generation', 'gemini-2.5-flash', durationMs, usage.promptTokenCount || 0, usage.candidatesTokenCount || 0, widgetsPrompt);
          } else {
            widgetsError = `HTTP ${widgetsRes.status} ${widgetsRes.statusText}`;
          }
        } catch (err: any) {
          widgetsError = err.message || String(err);
          console.error(`[AI GENERATOR - WFTA] AI Studio Stage 1 widgets fallback exception:`, err);
        }
      }

      if (!widgetsJsonStr) {
        throw new Error(`[AI GENERATOR CRITICAL ERROR] Failed to generate Widgets JSON for lesson "${item.title}". Error: ${widgetsError}`);
      }

      // Parse and clean the generated widgets locally
      let parsedWidgets: any = {};
      try {
        const cleanedJson = widgetsJsonStr.replace(/```json/g, '').replace(/```/g, '').trim();
        parsedWidgets = safeJsonParse(cleanedJson, 'generateCourseContent (WFTA Stage 1 Widgets)');
        parsedWidgets = validateAndFixWidgets(parsedWidgets);
      } catch (err: any) {
        await appendTaskLog(`[AI GENERATOR ERROR] Failed to parse/validate widgets: ${err.message || err}. Falling back to default mock widgets.`);
        parsedWidgets = validateAndFixWidgets({});
      }

      await appendTaskLog(`[AI GENERATOR - WFTA] [STAGE 2] Generating academic narrative text for lesson "${item.title}"...`);

      // Describe the generated widgets to the narrative writer so they can weave them perfectly
      const widgetsDescription = `
We have pre-generated and verified the following highly interactive educational widgets for this lesson.
You MUST write your academic course text directly around these widgets.
To insert a widget at the best educational moment, write its exact bracketed anchor tag like this: [[WIDGET:id]].
Directly before and after each widget, provide a paragraph of high-quality narrative context, explaining what the widget demonstrates, how it relates to the theory, or prompting the student on what to observe or solve.

LIST OF GENERATED WIDGETS AT YOUR DISPOSAL (INSERT EACH EXACTLY ONCE):
- **Prerequisites block**: [[WIDGET:prerequisites]] (Insert at the very beginning, before the introduction).
- **Diagnostic Quiz skip-block**: [[WIDGET:diagnosticQuiz]] (Insert immediately after the Prerequisites block, before the introduction).
- **Learning Objectives block**: [[WIDGET:learningObjectives]] (Insert immediately after the Introduction section).
- **Conclusion Summary block**: [[WIDGET:conclusionSummary]] (Insert at the beginning of the "## Conclusion" section).
- **What's Next steps block**: [[WIDGET:whatsNext]] (Insert at the very end of the Conclusion section).
- **Final Exam block**: [[WIDGET:finalEvaluation]] (Insert after the Conclusion section, as the ultimate validation).

- **Pre-generated bibliography/references (YOU MUST CITE THESE INLINE IN YOUR TEXT)**:
${(parsedWidgets.references || []).map((r: string, idx: number) => `  - [${idx + 1}] ${r}`).join('\n')}
*Mandate*: Integrate inline citations into your text to credit these specific resources. Format them exactly as standard inline links, for example: \`[1](#ref-1)\`, \`[2](#ref-2)\`, etc., placed right next to the corresponding fact, claim, or quote.

INTERACTIVE COMPONENTS (INSERT EACH EXACTLY ONCE IN THE RESPECTIVE SECTION BODY):
${parsedWidgets.interactiveComponents.map((comp: any) => `
- Component ID: "\${comp.id}"
  Anchor tag to insert: [[WIDGET:\${comp.id}]]
  Component Type: "\${comp.componentType}"
  Planned Section: "\${comp.sectionAnchor}"
  Props/Data summary: \${JSON.stringify(comp.props).slice(0, 300)}...
`).join('\n')}
`;

      const narrativePrompt = `You are a world-class academic professor and expert writer (Agent 3 - Academic Writer).
Your task is to write the complete, professional, extremely detailed academic MDX narrative content for the lesson "${item.title}" in the course "${correctedCourseName}" (Level: ${levelInput}).

Course Context and Disciplinary Strategy:
${courseContext.pedagogicalStrategy ? `- Pedagogical Strategy: ${courseContext.pedagogicalStrategy}` : ''}
${courseContext.epistemologicalMatrix ? `- Epistemological Matrix: ${courseContext.epistemologicalMatrix}` : ''}
${item.cognitiveArtifact ? `- Expected Cognitive Artifact for this lesson: ${item.cognitiveArtifact}` : ''}
${item.technicalDepth ? `- Expected Guidelines and Technical Depth: ${item.technicalDepth}` : ''}

### WIDGET PLACEMENT MANDATE (THE WFTA SYSTEM):
${widgetsDescription}

### RIGOROUS WRITING & PEDAGOGICAL STYLING CONSTRAINTS:
1. **Academic Density & Zero-Placeholders**:
   - Write fully developed paragraphs. Skeletons, placeholders, comments like "write your section here", vague lists, and bullet points without substance are strictly prohibited and will cause immediate failure.
   - You must write the actual text of all sections (Introduction, the main concepts body, and Conclusion). Do NOT write headings like '## Glossaire' or '## Références', as these are appended programmatically from the pre-generated widgets!
2. **Author Quotes with Citations**:
   - Systematically weave high-impact, contextually relevant quotes from notable thinkers and scientists formatted as:
     > "Quote text..." — Author name, *Book/Publication Title*, Publisher, City, Year, p. Page
     Every quote must be in the course language (or translated in brackets immediately following the quote) and must be followed by a dedicated paragraph explaining its conceptual implications.
2b. **In-text Bibliography Citations**:
   - Cite the pre-generated bibliography references listed in the widgets description inside your narrative text using standard markdown links: \`[1](#ref-1)\`, \`[2](#ref-2)\`, etc. at appropriate, highly relevant academic moments.
3. **Controlled Digressions (Encadrés Épistémologiques)**:
   - If the level is university level (L1, L2, L3), systematically insert at least one historical controversy or limits-of-concept box:
     <Epistemology title="Title of Digression">Detailed epistemological discussion...</Epistemology>
4. **Contextual Mini-Biographies (Minibios)**:
   - Include at least one detailed biographical box inside the main text using:
     > [!INFO] **Mini-Biographie : Name (Dates)**
     Write 8-12 lines of biography (4-6 for primary level) and systematically include a direct, working Wikipedia markdown link at the end: \`[En savoir plus sur Wikipédia](...)\`.
5. **Connected Entities Hover-Cards**:
   - Wrap every historical figure, author, artwork, geographic location, fictional character, or historical event mentioned inline in their respective custom overlay component with a 2-3 line biographical/description attribute as fallback:
     - <RealPerson name="Wiki_Title" lang="${targetLang.toLowerCase()}" bio="...">Name (Dates)</RealPerson>
     - <Artwork name="Wiki_Title" lang="${targetLang.toLowerCase()}" description="...">Title</Artwork>
     - <Location name="Wiki_Title" lang="${targetLang.toLowerCase()}" description="...">Name</Location>
     - <EventLink name="Wiki_Title" lang="${targetLang.toLowerCase()}" description="...">Name</EventLink>
     - <FictionalCharacter name="Wiki_Title" lang="${targetLang.toLowerCase()}" description="...">Name</FictionalCharacter>
     *Constraint*: Do NOT require or place these tags inside JSX attribute properties (like inside component props or diagnostic quiz questions), as nesting JSX is syntactically invalid there. Keep names as plain text when inside properties. Do not wrap names inside markdown image captions.
6. **Visual Assets Accessibility & Captions**:
   - For decorative/illustrative imagery (Pollinations.ai), use English prompts with underscores:
     ![Alt Text](https://image.pollinations.ai/prompt/english_descriptive_prompt?width=800&height=600&nologo=true)
   - Caption every single image, audio or video player immediately below using:
     *Figure X : [Title] - [Description]. Source : ...* (use "Wikimedia Commons" or specify AI-generated origin).
     For external resources, link them with a footnote tag: <sup><a id="ref-src-X" href="#ref-X">X</a></sup>. No link for flowcharts or AI images.
   - For complex scientific, anatomical, biological or geographical diagrams, prefer using a real Wikipedia/Wikimedia Commons direct image URL.
7. **Discipline Adaptation**:
   - biology/anatomy: focus on visual illustrations and anatomical mapping.
   - math/physics: use advanced LaTeX formulas ($ and $$), systematic definitions, and proof.
   - humanities/philosophy: focus on comparative dialectics, historical controversy, and rhetoric.
8. **Level Adaptation**:
   - Tailor vocabulary, tone, mathematical rigor and paragraph density strictly to the presumption of "${levelInput}".
9. **No Code Block Wrappers**:
   - Return ONLY the raw MDX content. Do not wrap the response in markdown code blocks (\`\`\`).
10. **STRICT PROHIBITION ON RAW INTERACTIVE JSX TAGS**:
    - You MUST NEVER write raw JSX/HTML tags for interactive components (such as \`<DataChart>\`, \`<Video>\`, \`<Quiz>\`, \`<DiagnosticQuiz>\`, \`<SolvedExercise>\`, \`<UnsolvedExercise>\`, \`<Mermaid>\` or \`<CodeSandbox>\`) inside your narrative text.
    - Instead, you MUST EXCLUSIVELY use the pre-generated bracketed anchor tags (e.g. \`[[WIDGET:prerequisites]]\`, \`[[WIDGET:comp_02]]\`).
    - The actual code for these interactive components has been pre-compiled and verified separately. Attempting to write raw custom components or placeholders in your narrative will fail the validation audit. Keep your markup limited to standard markdown (headings, paragraphs, blockquotes, bold/italic, lists) and the approved widget anchors.
    - Write in "${targetLang.toUpperCase()}".`;

      let narrativeText = '';
      let narrativeSuccess = false;
      let narrativeError = 'N/A';

      if (isVertexConfigured()) {
        try {
          const narrativeRes = await callVertexAI({
            task: 'course_generation',
            contents: [{ role: 'user', parts: [{ text: narrativePrompt }] }],
            generationConfig: {
              temperature: 0.3
            }
          });
          if (narrativeRes && narrativeRes.ok) {
            const resJson = await narrativeRes.json();
            narrativeText = resJson.candidates?.[0]?.content?.parts?.[0]?.text || '';
            narrativeSuccess = true;
          } else {
            narrativeError = narrativeRes ? `HTTP ${narrativeRes.status} ${narrativeRes.statusText}` : 'Null Response';
          }
        } catch (err: any) {
          narrativeError = err.message || String(err);
          console.warn("[AI GENERATOR - WFTA] Vertex Stage 2 narrative call exception:", err);
        }
      }

      if (!narrativeSuccess && apiKey) {
        const startTime = Date.now();
        try {
          const narrativeRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: narrativePrompt }] }],
              generationConfig: {
                temperature: 0.3
              }
            })
          });
          if (narrativeRes.ok) {
            const resJson = await narrativeRes.json();
            narrativeText = resJson?.candidates?.[0]?.content?.parts?.[0]?.text || '';
            narrativeSuccess = true;

            const durationMs = Date.now() - startTime;
            const usage = resJson.usageMetadata || {};
            await recordMetrics('course_generation', 'gemini-2.5-flash', durationMs, usage.promptTokenCount || 0, usage.candidatesTokenCount || 0, narrativePrompt);
          } else {
            narrativeError = `HTTP ${narrativeRes.status} ${narrativeRes.statusText}`;
          }
        } catch (err: any) {
          narrativeError = err.message || String(err);
          console.error(`[AI GENERATOR - WFTA] AI Studio Stage 2 narrative fallback exception:`, err);
        }
      }

      if (!narrativeText) {
        throw new Error(`[AI GENERATOR CRITICAL ERROR] Failed to generate Narrative text for lesson "${item.title}". Error: ${narrativeError}`);
      }

      // STAGE 3: Stitching the narrative and widgets programmatically
      let currentMdx = stitchLessonContent(narrativeText, parsedWidgets);

      let approved = false;
      let iteration = 0;
      const maxIterations = 3;

      while (!approved && iteration < maxIterations) {
        iteration++;
        await appendTaskLog(`[AI GENERATOR - WFTA] [STAGE 4] Verifying stitched content (Attempt ${iteration}/${maxIterations})...`);

        const verifierPrompt = `You are the Verifier/Critic Agent (Agent 4). Your job is to strictly review the generated academic course content (MDX) to ensure it complies with the "Zero-Placeholder", "Academic Density", and "Styling/Structure" policies.

MDX CONTENT TO VERIFY:
---
${currentMdx}
---

Your Checkpoints:
1. "Zero-Placeholder & Prohibited Empty Tags & Content Collisions":
   - **STRICT ZERO-PLACEHOLDER CONSTRAINT**: Systematically reject (approved: false) if the lesson contains any placeholders, comments telling the user to write their own text, unwritten sections, or skeletons like "Insérer ici...", "[Placeholder]", "[À compléter]", "Lorem Ipsum", or generic non-developed paragraphs. The text must be fully written, complete, and production-ready.
   - Detect if there are any empty custom component tags (e.g. <Evaluation></Evaluation>, <Objectives></Objectives>, <CriticalThinking />, etc.). If ANY tag is present but empty, lacks significant children/content, or is self-closing without proper props/data, you MUST reject the content (set "approved": false).
   - Content collision: Ensure that <HistoricalAnecdote>, <HistoricalFact>, and <DidYouKnow> do NOT cover the exact same subject or discover. Ensure that <HistoricalAnecdote> is TRULY anecdotal, quirky, funny, or human (not just a dry historical milestone). Factual milestones like the founding of a laboratory or publication of a textbook MUST be placed in a <HistoricalFact> (Événement Historique) block instead.
2. "Academic Density": Verify that the content is exhaustive, detailed, and academically rigorous for the specified level ("${levelInput}"). Look for lazy summaries or text-avoidance patterns.
3. "Structural Completeness & Mandated Sections":
   - Ensure the presence of prerequisites at the very beginning (using '<Prerequisites items={[...]} />').
   - Ensure the presence of diagnostic quizzes (using '<DiagnosticQuiz ... />') before the introduction.
   - Ensure the presence of a proper introduction section (using '## Introduction' or a translated equivalent heading).
   - Ensure the presence of learning objectives (using '<Objectives>' containing '<Knowledge>', '<Skills>', and '<Attitudes>' sub-components).
   - Ensure the presence of a forward-looking/what's next section (using '<WhatsNext>' component) before the final evaluation.
   - Ensure the presence of a concluding section (using the heading '## Conclusion' or localized equivalent) containing the '<Summary items={[...]} />' component.
   - Ensure the presence of a final validating/timed end-of-lesson evaluation (using '<Quiz durationLimit={...}>' or '<EssayEvaluation ... />').
   - Ensure the presence of a glossary section (using a heading like '### Glossary' or '### Glossaire').
   - Ensure the presence of a bibliography/references section (using a heading like '### References' or '### Références'). Note: This references section is mandatory for all levels except if the level is primary.
     - Check formatting of bibliography references: verify that (a) they do NOT contain raw URLs, hyperlinks, or markdown link syntax in the citation text; (b) book/article titles inside the citation text must be wrapped in standard quotation marks (or French guillemets « ... » for French lessons) and NEVER in asterisks (*) or underscores (_); and (c) the citation format matches the discipline-appropriate style expected for the course (i.e., **${getCitationStyle(courseContext.discipline || correctedCourseName).name}**) — for example, APA 7 for psychology/social sciences, Vancouver for medicine, Chicago Notes-Bibliography for history/philosophy, IEEE for engineering/CS, CSE for biology, Bluebook/OSCOLA for law, etc. Reject if references are in plainly wrong format for the discipline.
     - **CRITICAL**: You must NEVER reject or fail a lesson draft (approved must remain true) under the pretext that a pre-generated reference from the list was not cited or used inline in the text. Unused references are automatically and silently handled during programmatic post-processing/stitching. Simply evaluate the references that ARE present.
4. "Multimedia, Illustrations, & Non-Text Media Density":
   This checkpoint is DISCIPLINE-AWARE. Evaluate the illustration requirement against the course subject and level ("${levelInput}", course: "${correctedCourseName}"):
   - Verify that the image density conforms to age-adaptation: for primary CP-CM2, reject if text dominates over visuals/simulators (the text/image ratio must be reversed: let visuals, games, and simulations dominate, and keep text explanations short and simple).
   - Check that the minimum media baseline/diversity is respected: even for advanced university levels (Licence L1-L3), reject if the lesson lacks at least 1 illustration/diagram, 1 or 2 graphs/curves/simulations (e.g. using \`<FunctionPlotter />\` or a Markdown table chart toggle), and 1 or 2 source images (painting, sculpture, historical photo, monument, map).
   - For VISUAL, SPATIAL, HISTORICAL, or EMPIRICAL disciplines: A text-only lesson is UNACCEPTABLE. Reject immediately if the content lacks at least 2 to 3 '<CustomFigure />' / '<Image />' elements, at least one '<Mermaid />' flowchart, or at least one '<InteractiveDiagram />'.
   - For QUANTITATIVE or EXPERIMENTAL disciplines (mathematics, physics, chemistry, economics, computer science): The absence of inline illustrations may be acceptable IF the content compensates with visual interactive components. Reject if NONE of these are present.
   - For TEXTUAL, PHILOSOPHICAL, LITERARY, or HUMANISTIC disciplines: A text-dominant lesson is pedagogically acceptable. However, you MUST flag (in the critique, without setting "approved" to false for this reason alone) if ZERO visual elements are present, as at least a minimal enrichment would still be beneficial.
   - "Audio/Video Integrity": When '<Audio />' or '<Video />' components are present, verify that:
     * Each has a non-empty 'src' or 'url' attribute (not a placeholder like "url_here" or "").
     * Each specifies a 'duration' attribute and that this duration is strictly between 1 minute and 60 minutes. Any audio or video under 1 minute or exceeding 60 minutes must be rejected.
     * Each has a caption line directly below it (italicized) and, for actual external resources, an accessible fallback redirect link. Reject any '<Audio />' or '<Video />' tag with a missing or empty 'duration' attribute.
   - "Existing Artwork AI-Generation Block Check": Verify that the content contains absolutely NO AI-generated images (e.g., Pollinations.ai prompts) of real/existing paintings, drawings, frescoes, sculptures, historical photographs, monuments, or real artworks. You MUST reject (set "approved": false) if the writer attempted to use an AI-generated image URL for an existing real historical artwork (such as Mona Lisa, David, Starry Night, etc.). Real historical artworks must only use Wikimedia Commons links or have no image at all.
5. "Section Interactivity and Sandboxes":
   5a. "Per-Section Interactivity Rule": Every major conceptual section (demarcated by a '##' heading) MUST contain at least one interactive/active learning component. Passive reading blocks are prohibited.
   5b. "Discipline-Specific Simulator Mandate": Beyond the per-section rule, apply these discipline-level simulator requirements:
     * LIFE SCIENCES / ANATOMY / BIOLOGY / MEDICINE / CHEMISTRY / MATERIAL SCIENCES: The lesson MUST contain at least one '<InteractiveDiagram />' or '<StructureViewer3D presetId="..." />'. A lesson in these disciplines without either component MUST be rejected.
     * MATHEMATICS / PHYSICS / ECONOMICS / FINANCE: The lesson MUST contain at least one dynamic graph, equation, or basic math explorer component. A lesson in these disciplines without any of these MUST be rejected.
     * COMPUTER SCIENCE / ENGINEERING / PROGRAMMING: The lesson MUST contain at least one '<CodeSandbox />'. A lesson without it MUST be rejected.
     * HISTORY / GEOGRAPHY / POLITICAL SCIENCE / SOCIAL SCIENCES: The lesson MUST contain at least one process/timeline flowchart ('<Mermaid />'). A lesson without it MUST be rejected.
6. "No Fragmented Sentences in Key Points": Check '<Summary items={[...]} />' and ensure none of the items are fragmented or artificially split clauses of a single sentence. Each item MUST be a complete, grammatically whole sentence.
7. "Connected Entities (Real Persons, Fictional Characters, Locations, Events, Artworks) & Mini-Biographies":
   - Verify that EVERY real person mentioned in the lesson content is wrapped in '<RealPerson name="..." lang="..." bio="...">'. Verify that it has a non-empty \`bio\` attribute. IMPORTANT: Do NOT require or check for '<RealPerson>' tags inside JSX component attribute properties (like inside 'options', 'explanation', 'knowledge', 'skills', or 'attitudes' arrays/objects of \`<Quiz>\` etc.), as nesting JSX elements inside JavaScript strings or array attributes is syntactically invalid.
   - Verify that there are no duplicate or nested '<RealPerson>' tags for the same person in close proximity. Ensure that the bold titles of '**Mini-Biographie**' or '**Mini-Biography**' blocks do NOT contain '<RealPerson>' tags. Reject content (set "approved": false) if duplicate/nested tags are found.
   - Verify that any Contextual Mini-Biography block is substantial (at least 8-12 lines for secondary/university, 4-6 lines for primary) and systematically and obligatorily includes a direct, working Wikipedia markdown link at the end (e.g. \`[En savoir plus sur Wikipédia](...)\`). Reject the content if it's too short or lacks the Wikipedia link.
8. "No Source Redirects for Flowcharts, Simulators, or AI Resources": Check system-generated flowcharts (mermaid diagrams), interactive simulators, or AI-generated resources, and ensure they do NOT contain any "[Source]" / "[Link]" / "[Reference]" / "[Accéder]" text links below them, as they are constructed dynamically or have no external origin URL.
9. "Interactive Elements and Assessment Integrity": Systematically audit all <Quiz>, <Question>, <Option>, <DiagnosticQuiz>, <EssayEvaluation>, and <UnsolvedExercise> tags. Verify that:
    - Every <Question> element MUST have its question text defined in the 'q' attribute and not as raw text children.
    - Systematically reject (approved: false) any content containing deprecated pedagogical tags like <Explanation>, <Solution>, <Instruction>, or <KeyConcept>.
    - Every <Option /> tag MUST follow the Flat-Prop pattern: it must pass the option text via the 'text' attribute and its correctness state via the 'correct' boolean attribute, and it MUST be a self-closing tag. Systematically reject any question containing nested/wrapped text inside <Option> or missing the 'text' attribute, or where no option has correct={true}.
    - Every <DiagnosticQuiz> has options, and a valid "correctIndex" attribute.
10. "Foreign Language Quotes & Translations":
    - Verify that any quote in a language other than the lesson's target language is systematically translated into the target language of the lesson, and that this translation is displayed in brackets immediately following the quote. Reject if a foreign quote is not followed by its bracketed translation. Every quote must be followed by a dedicated paragraph explaining its conceptual implications and context.
11. "Wikimedia Commons Preference for Complex Diagrams":
    - For complex biological, chemical, physical, geographical, or anatomical diagrams, verify that high-quality public domain images from Wikimedia Commons are preferred over low-quality Pollinations.ai images. Verify that the Wikimedia Commons image URL is correctly used in the markdown image syntax and linked/credited in the references section.
12. "DataChart Data Integrity":
    - Every \`<DataChart />\` tag MUST have a \`data={[...]}\` attribute with at least 2 valid data point objects (each with a label string and value number). A \`<DataChart />\` without a data attribute, with an empty data array, or with a string instead of a JSX array MUST be rejected.
13. "SolvedExercise Completeness":
    - Every \`<SolvedExercise>\` block MUST have: (a) a non-empty \`title\` attribute, (b) non-empty problem statement children (clearly formulating a concrete problem with enough context), AND (c) a non-empty \`solution="..."\` attribute or \`<Solution>...</Solution>\` child with step-by-step resolution. An empty \`<SolvedExercise>\` MUST be rejected.

You must return a valid JSON object with the following keys:
- "approved": boolean (true if it perfectly complies with the policies; false if there are violations).
- "critique": string (detailed description of the violations and clear instructions on how the generating agent must expand or correct the text. Leave empty if approved).

Return ONLY a valid JSON object. Do not include markdown code block backticks around the JSON.`;

        let verifierRaw = '';
        let verifierSuccess = false;
        try {
          if (isVertexConfigured()) {
            const vRes = await callVertexAI({
              task: 'course_generation',
              contents: [{ role: 'user', parts: [{ text: verifierPrompt }] }],
              generationConfig: {
                temperature: 0.1,
                responseMimeType: "application/json",
                responseSchema: verificationSchema
              }
            });
            if (vRes && vRes.ok) {
              const vJson = await vRes.json();
              verifierRaw = vJson.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
              verifierSuccess = true;
            }
          }
          
          if (!verifierSuccess && apiKey) {
            const startTime = Date.now();
            const vRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ parts: [{ text: verifierPrompt }] }],
                generationConfig: {
                  responseMimeType: "application/json",
                  responseSchema: verificationSchema,
                  temperature: 0.1
                }
              })
            });
            if (vRes.ok) {
              const vJson = await vRes.json();
              verifierRaw = vJson.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
              verifierSuccess = true;

              const durationMs = Date.now() - startTime;
              const usage = vJson.usageMetadata || {};
              await recordMetrics('course_generation', 'gemini-2.5-flash', durationMs, usage.promptTokenCount || 0, usage.candidatesTokenCount || 0, verifierPrompt);
            }
          }

          const cleanedVJson = verifierRaw.replace(/```json/g, '').replace(/```/g, '').trim();
          const verificationResult = safeJsonParse(cleanedVJson, 'generateCourseContent (Agent 4 Verification)');

          if (verificationResult && verificationResult.approved === true) {
            await appendTaskLog(`[AI GENERATOR - AGENT 4] Content approved for "${item.title}" on attempt ${iteration}!`);
            approved = true;
          } else {
            const critique = verificationResult?.critique || 'Invalid or empty verification response from AI critic.';
            await appendTaskLog(`[AI GENERATOR - AGENT 4] Content REJECTED for "${item.title}" on attempt ${iteration}. Critique: ${critique}`);
            
            if (iteration >= maxIterations) {
              await appendTaskLog(`[AI GENERATOR - AGENT 4] Max verification attempts reached. Moving forward with current MDX.`);
              break;
            }

            const refinerPrompt = `You are a world-class academic professor (Agent 3 - Academic Writer).
The verifier/critic (Agent 4) has rejected your previously generated academic narrative text.
You MUST now rewrite, expand, and fully correct the academic narrative text based on their feedback, ensuring zero placeholders, high academic density, and proper formatting.

CRITIQUE FROM AGENT 4:
"${critique}"

PREVIOUS ACADEMIC NARRATIVE TEXT:
---
${narrativeText}
---

LIST OF PRE-GENERATED WIDGETS AT YOUR DISPOSAL (YOU MUST PRESERVE AND INSERT EACH WIDGET ANCHOR [[WIDGET:id]] EXACTLY ONCE):
- Prerequisites block: [[WIDGET:prerequisites]]
- Diagnostic Quiz skip-block: [[WIDGET:diagnosticQuiz]]
- Learning Objectives block: [[WIDGET:learningObjectives]]
- Conclusion Summary block: [[WIDGET:conclusionSummary]]
- What's Next steps block: [[WIDGET:whatsNext]]
- Final Exam block: [[WIDGET:finalEvaluation]]
${parsedWidgets.interactiveComponents.map((comp: any) => `- Component ID: "${comp.id}" -> Anchor: [[WIDGET:${comp.id}]] (Component Type: "${comp.componentType}", planned for "${comp.sectionAnchor}")`).join('\n')}

LIST OF PRE-GENERATED REFERENCES FOR THIS LESSON (YOU MUST CITE EVERY RELEVANT ITEM INLINE):
${(parsedWidgets.references || []).map((r: string, idx: number) => `- [${idx + 1}] ${r}`).join('\n')}
*Mandate*: Preserve and integrate inline citations for these specific resources. Format them exactly as standard inline links, for example: \`[1](#ref-1)\`, \`[2](#ref-2)\`, etc., placed right next to the corresponding fact, claim, or quote.

Generate the complete, updated, fully-fledged academic narrative text incorporating all corrections.
STRICT PROHIBITION ON RAW INTERACTIVE JSX TAGS:
- You MUST NEVER write raw JSX/HTML tags for interactive components (such as \`<DataChart>\`, \`<Video>\`, \`<Quiz>\`, \`<DiagnosticQuiz>\`, \`<SolvedExercise>\`, \`<UnsolvedExercise>\`, \`<Mermaid>\` or \`<CodeSandbox>\`) inside your narrative text.
- Instead, you MUST EXCLUSIVELY use the pre-generated bracketed anchor tags (e.g. \`[[WIDGET:prerequisites]]\`, \`[[WIDGET:comp_02]]\`).
- Any raw interactive custom elements will break validation. Keep your markup limited to standard markdown and approved widget anchors.

Return ONLY the raw narrative text. Do not wrap the response in markdown code blocks (\`\`\`).`;

            let refinedNarrative = '';
            let refineSuccess = false;
            
            if (isVertexConfigured()) {
              try {
                const refRes = await callVertexAI({
                  task: 'course_generation',
                  contents: [{ role: 'user', parts: [{ text: refinerPrompt }] }],
                  generationConfig: { temperature: 0.3 }
                });
                if (refRes && refRes.ok) {
                  const refJson = await refRes.json();
                  refinedNarrative = refJson.candidates?.[0]?.content?.parts?.[0]?.text || '';
                  refineSuccess = true;
                }
              } catch (err: any) {
                console.warn("[AI GENERATOR - AGENT 4] Vertex refinement call exception:", err);
              }
            }
            
            if (!refineSuccess && apiKey) {
              const startTime = Date.now();
              try {
                const refRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    contents: [{ parts: [{ text: refinerPrompt }] }]
                  })
                });
                if (refRes.ok) {
                  const refJson = await refRes.json();
                  refinedNarrative = refJson?.candidates?.[0]?.content?.parts?.[0]?.text || '';
                  refineSuccess = true;
                  
                  const durationMs = Date.now() - startTime;
                  const usage = refJson.usageMetadata || {};
                  await recordMetrics('course_generation', 'gemini-2.5-flash', durationMs, usage.promptTokenCount || 0, usage.candidatesTokenCount || 0, refinerPrompt);
                }
              } catch (err: any) {
                console.error(`[AI GENERATOR - REFINE] AI Studio refinement fetch exception:`, err);
              }
            }

            if (refinedNarrative) {
              narrativeText = refinedNarrative;
              currentMdx = stitchLessonContent(narrativeText, parsedWidgets);
            } else {
              console.warn("[AI GENERATOR - AGENT 4] Refinement failed to return content, keeping previous MDX.");
            }
          }
        } catch (vErr: any) {
          console.error("[AI GENERATOR - AGENT 4] Error during verification cycle:", vErr);
          throw new Error(`[VERIFICATION CRITICAL ERROR] Verification failed for lesson "${item.title}": ${vErr.message || vErr}`);
        }
      }

      // De-hallucinate bibliography links against Crossref / Google Books
      let validatedMdx = await validateAndFixBibliography(currentMdx, targetLang.toLowerCase());
      validatedMdx = await validateAndFixExternalResources(validatedMdx, targetLang.toLowerCase());

      let mdxWithFrontmatter = `---
title: "${item.title}"
subject: "${correctedCourseName}"
level: "${level}"
module: "${item.title}"
order: ${index + 1}${isLastLesson ? '\nsummative: true' : ''}
---

${validatedMdx}`;


      // Apply preprocessMdx BEFORE validation so common AI-generation issues
      // (bare & in JSX attrs, unescaped braces, etc.) are fixed deterministically
      mdxWithFrontmatter = preprocessMdx(mdxWithFrontmatter, targetLang.toLowerCase());

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
      const healedMdx = preprocessMdx(mdxWithFrontmatter, targetLang.toLowerCase());
      const resolvedMdx = await resolveAndPersistMedia(healedMdx, targetLang.toLowerCase());

      // Save to Supabase
      await dbService.saveLesson({
        course_slug: cleanPathSegment(correctedCourseName),
        lesson_slug: item.slug,
        lang: targetLang.toLowerCase(),
        title: item.title,
        content: resolvedMdx,
        order: index + 1
      });
      await updateTaskProgress(item.title);
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
      
      const INTER_LESSON_DELAY_MS = Number(process.env.INTER_LESSON_DELAY_MS ?? 5000);
      
      const childIds = course.childCourses || [];
      const childPromises = childIds.map(async (childId, index) => {
        const childCourse = allCourses?.find(c => c.id === childId);
        if (childCourse && childCourse.slug) {
          const delay = index * INTER_LESSON_DELAY_MS;
          console.log(`[TRANSLATOR] Staggering child translation for "${childCourse.slug}" by ${delay / 1000}s...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          try {
            console.log(`[TRANSLATOR] Translating curriculum child course: "${childCourse.slug}" to "${targetLang}"...`);
            await translateCourseContent(childCourse.slug, targetLang);
          } catch (childErr) {
            console.error(`[TRANSLATOR ERROR] Failed to translate curriculum child course "${childCourse.slug}":`, childErr);
          }
        }
      });
      await Promise.all(childPromises);
      
      const optionalIds = course.optionalCourses || [];
      const optionalPromises = optionalIds.map(async (optId, index) => {
        const optCourse = allCourses?.find(c => c.id === optId);
        if (optCourse && optCourse.slug) {
          const delay = index * INTER_LESSON_DELAY_MS;
          console.log(`[TRANSLATOR] Staggering optional translation for "${optCourse.slug}" by ${delay / 1000}s...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          try {
            console.log(`[TRANSLATOR] Translating curriculum optional course: "${optCourse.slug}" to "${targetLang}"...`);
            await translateCourseContent(optCourse.slug, targetLang);
          } catch (optErr) {
            console.error(`[TRANSLATOR ERROR] Failed to translate curriculum optional course "${optCourse.slug}":`, optErr);
          }
        }
      });
      await Promise.all(optionalPromises);
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
                  translatedMdx = restoreJsxAfterTranslation(rawText, registry);
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
                  translatedMdx = restoreJsxAfterTranslation(rawText, registry);
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
2. MDX Components Preservation: Are all MDX elements (like <Quiz>, <Question>, <Option>, <Glossary>, <Video>, <Audio>, <FillInBlanks>, <SolvedProblem>, <Summary>, <SelfEval>, <HistoricalPerson>, <Location>, <Place>, <EntityLink>, <EssayEvaluation>, <OpenQuestion>, <ScientificDebate>, etc.) completely present with all their JSX tags and properties intact? Do NOT generate empty components like <CriticalThinking />, <WhatsNext />, <OpenQuestion />, or <ScientificDebate /> without text/children. Do NOT nest wrapper components (e.g. nesting <WhatsNext> inside itself is strictly forbidden).
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
                      currentTranslation = restoreJsxAfterTranslation(rawText, refineRegistry);
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
                      currentTranslation = restoreJsxAfterTranslation(rawText, refineRegistry);
                      refineSuccess = true;
                    }
                  } catch (err) {
                    console.error("[AI GENERATOR - TRANSLATION CRITIC] AI Studio fallback translation refinement call failed:", err);
                  }
                }

                if (!refineSuccess) {
                  console.warn("[AI GENERATOR - TRANSLATION CRITIC] Refinement failed to respond, continuing with current translation.");
                  translatedMdx = currentTranslation;
                  break;
                }
              }
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

    const promptRevise = `You are a Pedagogical Revision Agent (Agent de Révision).
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
3. Preserve all MDX custom React components (<Quiz>, <Question>, <Glossary>, <HistoricalPerson>, <Location>, <DataChart>, <DynamicSimulation>, etc.) exactly as they are, including all their attributes, unless the feedback specifically requests to change/fix them.
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
2. Are all MDX elements (like <Quiz>, <Question>, <Option>, <Glossary>, <Video>, <Audio>, <FillInBlanks>, <SolvedProblem>, <Summary>, <SelfEval>, <HistoricalPerson>, <Location>, <Place>, <EntityLink>, <EssayEvaluation>, <OpenQuestion>, <ScientificDebate>, etc.) completely present with all their JSX tags and properties intact? Did you ensure they weren't accidentally lost?
3. Zero placeholders and empty tags: Are there any placeholders, skeletal sentences, or unfinished sections? Do NOT generate empty components like <CriticalThinking />, <WhatsNext />, <OpenQuestion />, or <ScientificDebate /> without text/children. If a component is present, it must contain full text/children.
4. No nested wrappers: Ensure you do NOT nest wrapper tags inside each other (e.g. self-nesting is strictly forbidden).
4. Academic Integrity: Is the scientific/academic depth, tone, and accuracy fully preserved or improved?
5. Assessment Integrity: Ensure all revised interactive assessments (<Quiz>, <Question>, <Option>, <DiagnosticQuiz>, <EssayEvaluation>, <UnsolvedExercise>) remain structurally intact, fully written, and correct (e.g. every <Question> has <Option>s, correct answers are specified, no empty blocks exist).
6. Mandated Sections & Structural Integrity: Verify that the revised MDX content still contains:
   - Prerequisites block ('<Prerequisites items={[...]} />') at the very beginning.
   - Diagnostic quiz ('<DiagnosticQuiz ... />') before the introduction.
   - Introduction heading (titled '## Introduction' or localized equivalent).
   - Objectives block ('<Objectives>') containing '<Knowledge>', '<Skills>', and '<Attitudes>'.
   - Forward-looking section ('<WhatsNext>') before the final evaluation.
   - Concluding section (titled '## Conclusion' or localized equivalent) containing the '<Summary>' component.
   - Glossary section (titled '### Glossary' or localized equivalent).
   - Bibliography/references section (titled '### References' or localized equivalent), unless the original course is a primary school level course.
   If any of these required structural sections/components are missing, you MUST reject the revision (set "approved": false).
7. Multimedia, Illustrations, & Non-Text Media Integrity (DISCIPLINE-AWARE):
   - For VISUAL/SPATIAL/HISTORICAL/EMPIRICAL disciplines (visual arts, anatomy, architecture, history of art, cinema, geography, biology, etc.): Verify that the revision has not accidentally removed illustration elements. '<CustomFigure />' / '<Image />', '<Mermaid />', or '<InteractiveDiagram />' components that were present in the original MUST remain intact. Their removal constitutes a regression and must be rejected.
   - For QUANTITATIVE/EXPERIMENTAL disciplines (mathematics, physics, chemistry, economics): Verify that interactive visual components ('<Mermaid />', '<FunctionPlotter />', '<EquationManipulator />', '<DataChart />', '<BasicMathExplorer />', '<ChemicalStoichiometry />', etc.) are preserved.
   - For TEXTUAL/PHILOSOPHICAL/LITERARY disciplines (philosophy, literature, law, ethics): Do not reject if illustration components are absent, but flag in the critique if they have been removed without reason — reducing visual enrichment unnecessarily is undesirable even in text-heavy disciplines.
   - Regardless of discipline: Ensure any audio players ('<AudioPlayer />' or '<Audio />') or video players ('<Video />') from the original are preserved and not lost during revision.
8. Section Interactivity and Interactive Sandboxes:
   - Ensure that every major conceptual section (demarcated by a '##' heading) still contains at least one interactive/active learning component (e.g. formative quizzes, fill-in-the-blanks, solved/unsolved exercises, or sandbox/simulation widgets like '<FunctionPlotter />', '<FunctionManipulator />', '<EquationManipulator />', '<Geometry2D />', '<CodeSandbox />', '<DataChart />', '<StructureViewer3D />', '<DynamicSimulation />', '<BasicMathExplorer />', or '<ChemicalStoichiometry />').

You must output ONLY a valid JSON object matching this structure:
{
  "approved": true or false,
  "critique": "If not approved, explain exactly what is wrong/missing/broken so the writer can correct it. If approved, keep this empty."
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
              responseSchema: verificationSchema
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
          console.error("[REVISION AGENT - AGENT 4] AI Studio fallback critique call failed:", err);
        }
      }

      if (criticSuccess && criticResText) {
        try {
          const cleanedCritic = criticResText.replace(/```json/g, '').replace(/```/g, '').trim();
          const criticObj = safeJsonParse(cleanedCritic, 'translateCourseContent (Agent 4 Verification)');
          approved = !!criticObj.approved;
          critique = criticObj.critique || '';
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
        console.warn(`[REVISION AGENT - AGENT 4] Revision REJECTED for "${lesson.title}". Critique: ${critique}`);
        // Refine revision
        const promptRefine = `You are a professional academic writer. The Revision Critic Agent has rejected your previous revised MDX with the following critique:

CRITIQUE FROM REVISION CRITIC:
${critique}

Original MDX Content:
${lesson.content}

Previous Revised Content:
${currentMdx}

Revision Instructions:
${feedbackText}

Please re-generate the revised MDX content for "${lesson.title}", fully addressing the critic's critique and incorporating all original revision instructions.
Return ONLY the revised MDX content. Do not include markdown code block wrappers.`;

        let refineSuccess = false;
        if (isVertexConfigured()) {
          try {
            const resRefine = await callVertexAI({
              task: 'course_generation',
              contents: [{ role: 'user', parts: [{ text: promptRefine }] }],
              generationConfig: { temperature: 0.3 }
            });
            if (resRefine && resRefine.ok) {
              const resJson = await resRefine.json();
              currentMdx = resJson.candidates?.[0]?.content?.parts?.[0]?.text || '';
              refineSuccess = true;
            }
          } catch (err) {
            console.warn("[REVISION AGENT - AGENT 4] Vertex refinement call failed:", err);
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
              currentMdx = resJson.candidates?.[0]?.content?.parts?.[0]?.text || '';
              refineSuccess = true;
            }
          } catch (err) {
            console.error("[REVISION AGENT - AGENT 4] AI Studio fallback refinement call failed:", err);
          }
        }

        if (!refineSuccess) {
          console.warn("[REVISION AGENT - AGENT 4] Refinement failed, continuing with current content.");
          revisedMdx = currentMdx;
          break;
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
3. Make sure custom components like <Quiz>, <Question>, <Glossary>, <HistoricalPerson>, <Epistemology>, etc. are well-formed and closed.
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
  const linkRegex = /\[([^\]]+)\]\(((?:https?:\/\/|\/\/)[^\s)]+)\)/gi;
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
- Categorize courses as either "mandatory" (obligatoire) or "optional" (optionnel). Note that some curricula may consist entirely of mandatory courses (0 optional courses) if that aligns with standard program progressions.

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

