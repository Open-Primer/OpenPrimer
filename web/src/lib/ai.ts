import { dbService } from './db';
import { supabase, supabaseAdmin } from './supabase';
import { callVertexAI, isVertexConfigured, recordMetrics, compressPromptText } from './vertex-client';
import { preprocessMdx, isolateJsxForTranslation, restoreJsxAfterTranslation, resolvePrecompiledAnchors, rehypeMdxSanitizer } from './content';
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
  if (!text || !text.trim()) {
    throw new StructuralJsonError(`[JSON PARSE FAILED] The model returned an empty response. Context: "${contextName}".`);
  }
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

    console.log(`[DRAFTS_REVISIONS] Successfully saved ${filename} to drafts_revisions`);
  } catch (err) {
    console.error(`[DRAFTS_REVISIONS] Error saving ${filename}:`, err);
  }
}

export function getDescriptiveLevelForPrompt(level: string): string {
  if (!level) return 'Beginner Level';
  const clean = level.trim();
  switch (clean) {
    case 'L1':
      return 'University Year 1 / Bachelor 1st Year (L1)';
    case 'L2':
      return 'University Year 2 / Bachelor 2nd Year (L2)';
    case 'L3':
      return 'University Year 3 / Bachelor 3rd Year (L3)';
    case 'M1':
      return 'Master 1st Year (M1)';
    case 'M2':
      return 'Master 2nd Year (M2)';
    case 'foundation_1':
      return 'Primary School (foundation_1)';
    case 'foundation_2':
      return 'Primary School (foundation_2)';
    case 'secondary_1':
      return 'Middle School (secondary_1)';
    case 'secondary_2':
      return 'High School (secondary_2)';
    case 'preuni_1':
      return 'Pre-University Year 1 (preuni_1)';
    case 'preuni_2':
      return 'Pre-University Year 2 (preuni_2)';
    case 'preuni_3':
      return 'Pre-University Year 3 (preuni_3)';
    case 'beginner':
      return 'Beginner Level';
    case 'intermediate':
      return 'Intermediate Level';
    case 'advanced':
      return 'Advanced Level';
    case 'expert':
      return 'Expert Level';
    default:
      return clean;
  }
}

export interface LevelConstraints {
  minWordCount: number;
  maxWordCount: number;
  minHoverCardsPerBlock: number;
  minBlockWidgetsPerBlock: number;
  globalWidgetsTarget: number;
  minGlossaryCount: number;
  minReferencesCount: number;
  minBiographiesCount: number;
  minConceptLinksCount: number;
  mandatedWidgetTypes: string[];
  discouragedWidgetTypes: string[];
}

export const DEFAULT_LEVEL_CONSTRAINTS: Record<string, LevelConstraints> = {
  "foundation": {
    "minWordCount": 800,
    "maxWordCount": 1200,
    "minHoverCardsPerBlock": 2,
    "minBlockWidgetsPerBlock": 1,
    "globalWidgetsTarget": 4,
    "minGlossaryCount": 2,
    "minReferencesCount": 1,
    "minBiographiesCount": 1,
    "minConceptLinksCount": 2,
    "mandatedWidgetTypes": ["HistoricalAnecdote", "Quiz", "Image"],
    "discouragedWidgetTypes": ["DataChart"]
  },
  "secondary_1": {
    "minWordCount": 1000,
    "maxWordCount": 1500,
    "minHoverCardsPerBlock": 2,
    "minBlockWidgetsPerBlock": 1,
    "globalWidgetsTarget": 6,
    "minGlossaryCount": 3,
    "minReferencesCount": 2,
    "minBiographiesCount": 1,
    "minConceptLinksCount": 3,
    "mandatedWidgetTypes": ["HistoricalAnecdote", "Quiz", "Image", "Mermaid"],
    "discouragedWidgetTypes": []
  },
  "secondary_2_preuni": {
    "minWordCount": 1500,
    "maxWordCount": 2200,
    "minHoverCardsPerBlock": 3,
    "minBlockWidgetsPerBlock": 1,
    "globalWidgetsTarget": 8,
    "minGlossaryCount": 4,
    "minReferencesCount": 3,
    "minBiographiesCount": 2,
    "minConceptLinksCount": 5,
    "mandatedWidgetTypes": ["HistoricalAnecdote", "Quiz", "Image", "Mermaid", "SolvedExercise"],
    "discouragedWidgetTypes": []
  },
  "university_undergrad": {
    "minWordCount": 2500,
    "maxWordCount": 3500,
    "minHoverCardsPerBlock": 3,
    "minBlockWidgetsPerBlock": 2,
    "globalWidgetsTarget": 12,
    "minGlossaryCount": 6,
    "minReferencesCount": 5,
    "minBiographiesCount": 2,
    "minConceptLinksCount": 8,
    "mandatedWidgetTypes": ["HistoricalAnecdote", "Quiz", "Image", "Mermaid", "SolvedExercise", "UnsolvedExercise", "DataChart"],
    "discouragedWidgetTypes": []
  },
  "university_grad": {
    "minWordCount": 3500,
    "maxWordCount": 4500,
    "minHoverCardsPerBlock": 4,
    "minBlockWidgetsPerBlock": 2,
    "globalWidgetsTarget": 16,
    "minGlossaryCount": 8,
    "minReferencesCount": 8,
    "minBiographiesCount": 3,
    "minConceptLinksCount": 12,
    "mandatedWidgetTypes": ["Quiz", "Image", "Mermaid", "SolvedExercise", "UnsolvedExercise", "DataChart", "InteractiveDiagram"],
    "discouragedWidgetTypes": ["HistoricalAnecdote"]
  }
};

let loadedConstraints: Record<string, LevelConstraints> = DEFAULT_LEVEL_CONSTRAINTS;

export async function loadLevelConstraintsFromDb(): Promise<Record<string, LevelConstraints>> {
  try {
    const { data } = await supabaseAdmin
      .from('system_parameters')
      .select('value')
      .eq('key', 'academic_level_constraints')
      .maybeSingle();
      
    if (data?.value) {
      try {
        const parsed = typeof data.value === 'string' ? JSON.parse(data.value) : data.value;
        if (parsed && typeof parsed === 'object') {
          return parsed;
        }
      } catch (e) {
        console.warn("[LevelConstraints] Failed to parse JSON from DB, seeding/using defaults", e);
      }
    }

    // Seed defaults to Supabase if not present
    await supabaseAdmin
      .from('system_parameters')
      .upsert({
        key: 'academic_level_constraints',
        value: JSON.stringify(DEFAULT_LEVEL_CONSTRAINTS, null, 2),
        updated_at: new Date().toISOString()
      }, { onConflict: 'key' });

  } catch (err) {
    console.warn("[LevelConstraints] Supabase query failed, using static defaults:", err);
  }
  return DEFAULT_LEVEL_CONSTRAINTS;
}

export async function initializeConstraints() {
  loadedConstraints = await loadLevelConstraintsFromDb();
}

export function getConstraintKeyForLevel(level: string): string {
  const clean = (level || '').trim().toLowerCase();
  if (clean.startsWith('foundation') || clean === 'primary') return 'foundation';
  if (clean.includes('secondary_1') || clean.includes('middle')) return 'secondary_1';
  if (clean.includes('secondary_2') || clean.includes('high') || clean.includes('preuni')) return 'secondary_2_preuni';
  if (clean.includes('m1') || clean.includes('m2') || clean.includes('expert') || clean.includes('master')) return 'university_grad';
  return 'university_undergrad';
}

export function getWordCountLimitForLevel(level: string): { min: number; max: number } {
  if (!level) return { min: 2500, max: 3500 };
  const clean = level.trim();
  const key = getConstraintKeyForLevel(clean);
  const constraint = loadedConstraints[key] || DEFAULT_LEVEL_CONSTRAINTS[key] || DEFAULT_LEVEL_CONSTRAINTS.university_undergrad;
  return { min: constraint.minWordCount, max: constraint.maxWordCount };
}

export function generateStatsMarkdown(stats: any): string {
  // Compute dollar cost
  const costUSD = (stats.tokenMetrics.promptTokens * 0.075 / 1_000_000) + (stats.tokenMetrics.candidatesTokens * 0.30 / 1_000_000);

  // Per-block breakdown lines
  let blockBreakdown = '';
  if (stats.narrativeBlockAttempts && Array.isArray(stats.narrativeBlockAttempts) && stats.narrativeBlockAttempts.length > 0) {
    blockBreakdown = '\n### Narrative Block Details\n';
    stats.narrativeBlockAttempts.forEach((b: any, i: number) => {
      const rejections = b.attempts - 1;
      blockBreakdown += `- **Block ${i + 1}** ("${b.sections?.join(' / ') || '?'}"): ${b.attempts} attempt${b.attempts > 1 ? 's' : ''}${rejections > 0 ? `, ${rejections} rejection${rejections > 1 ? 's' : ''}` : ''} → ${b.approved ? '✅ Approved' : '⚠️ Max iterations reached'}\n`;
    });
  }

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
- **Syllabus Critic Rejections**: ${stats.syllabusRejections ?? 0}
- **Narrative Blocks Total**: ${stats.narrativeBlockAttempts?.length ?? '?'}
- **Narrative Scribe Attempts (all blocks)**: ${stats.narrativeAttempts}
- **Narrative Critic Rejections (all blocks)**: ${stats.narrativeRejections}
- **Narrative Global Rewrites (4A)**: ${stats.narrativeGlobalRewrites ?? 0}
- **Narrative Localized Section Repairs (4A)**: ${stats.narrativeLocalRepairs ?? 0}
${blockBreakdown}
- **Widgets Architect Attempts**: ${stats.widgetsAttempts}
- **Widgets Critic Rejections**: ${stats.widgetsRejections}
- **MDX Self-Healing Attempts**: ${stats.selfHealingAttempts}

## 🪙 Token & Cost Estimation
- **Prompt Tokens**: ${stats.tokenMetrics.promptTokens.toLocaleString()}
- **Candidates Tokens**: ${stats.tokenMetrics.candidatesTokens.toLocaleString()}
- **Total Tokens**: ${(stats.tokenMetrics.promptTokens + stats.tokenMetrics.candidatesTokens).toLocaleString()}
- **Estimated Cost (Gemini 2.5 Flash)**: **$${costUSD.toFixed(6)}**
  *(Based on official pricing: $0.075/1M prompt tokens, $0.30/1M output tokens)*
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
    critique: { type: "string", description: "Detailed critique explaining what to fix. MUST be empty if approved is true." }
  },
  required: ["approved", "critique"]
};

const syllabusAuditSchema = {
  type: "object",
  properties: {
    approved: { type: "boolean" },
    critique: { type: "string", description: "Detailed critique explaining what to fix. MUST be empty if approved is true." }
  },
  required: ["approved", "critique"]
};

const lessonOutlineSchema = {
  type: "object",
  properties: {
    sections: {
      type: "array",
      items: {
        type: "object",
        properties: {
          heading: { type: "string" },
          description: { type: "string" }
        },
        required: ["heading", "description"]
      }
    }
  },
  required: ["sections"]
};

const outlineAuditSchema = {
  type: "object",
  properties: {
    approved: { type: "boolean" },
    critique: { type: "string", description: "Detailed critique explaining what to fix. MUST be empty if approved is true." }
  },
  required: ["approved", "critique"]
};

const blockNarrativeAuditSchema = {
  type: "object",
  properties: {
    approved: { type: "boolean" },
    isGlobalRevision: { type: "boolean" },
    globalCritique: { type: "string", description: "Detailed critique explaining what to fix globally. MUST be empty if approved is true or isGlobalRevision is false." },
    sections: {
      type: "array",
      description: "List of rejected sections. MUST be empty if approved is true or isGlobalRevision is true. Do NOT include approved sections.",
      items: {
        type: "object",
        properties: {
          heading: { type: "string" },
          approved: { type: "boolean", description: "Must strictly be false because only rejected sections are allowed in this array." },
          critique: { type: "string", description: "Detailed critique explaining what to fix in this specific section." }
        },
        required: ["heading", "approved", "critique"]
      }
    }
  },
  required: ["approved", "isGlobalRevision", "globalCritique"]
};

const widgetBlockAuditSchema = {
  type: "object",
  properties: {
    approved: { type: "boolean" },
    critique: { type: "string", description: "Detailed critique explaining what to fix globally. MUST be empty if approved is true." },
    fields: {
      type: "array",
      description: "List of invalid/rejected fields. MUST be empty if approved is true. Do NOT include approved fields.",
      items: {
        type: "object",
        properties: {
          field: { type: "string", description: "Name of the invalid property/field, e.g., 'diagnosticQuiz' or 'references'." },
          approved: { type: "boolean", description: "Must strictly be false because only rejected fields are allowed in this array." },
          critique: { type: "string", description: "Detailed critique explaining what is invalid and how to fix it." }
        },
        required: ["field", "approved", "critique"]
      }
    }
  },
  required: ["approved", "critique"]
};

const widgetsAuditSchema = {
  type: "object",
  properties: {
    approved: { type: "boolean" },
    isGlobalRevision: { type: "boolean" },
    globalCritique: { type: "string" },
    widgets: {
      type: "array",
      items: {
        type: "object",
        properties: {
          key: { type: "string" },
          approved: { type: "boolean" },
          critique: { type: "string" }
        },
        required: ["key", "approved", "critique"]
      }
    }
  },
  required: ["approved", "isGlobalRevision", "globalCritique"]
};

const revisionAuditSchema = {
  type: "object",
  properties: {
    approved: { type: "boolean" },
    isGlobalRevision: { type: "boolean" },
    globalCritique: { type: "string", description: "Detailed critique explaining what to fix globally. MUST be empty if approved is true or isGlobalRevision is false." },
    sections: {
      type: "array",
      description: "List of rejected sections. MUST be empty if approved is true or isGlobalRevision is true. Do NOT include approved sections.",
      items: {
        type: "object",
        properties: {
          heading: { type: "string" },
          approved: { type: "boolean", description: "Must strictly be false because only rejected sections are allowed in this array." },
          critique: { type: "string", description: "Detailed critique explaining what to fix in this specific section." }
        },
        required: ["heading", "approved", "critique"]
      }
    }
  },
  required: ["approved", "isGlobalRevision", "globalCritique"]
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

function pruneNarrativeForWidgets(narrativeText: string): string {
  const paragraphs = narrativeText.split(/\n\s*\n/);
  const prunedParagraphs: string[] = [];

  for (let i = 0; i < paragraphs.length; i++) {
    const p = paragraphs[i].trim();
    if (!p) continue;

    // Preserve headings
    if (p.startsWith('#')) {
      prunedParagraphs.push(p);
      continue;
    }

    // Check if paragraph has an anchor or inline citation links/references
    const hasWidget = /\[\[WIDGET:.*?\]\]/gi.test(p);
    const hasCitation = /\[\d+\]/gi.test(p) || /#ref-/gi.test(p);

    if (hasWidget || hasCitation) {
      // Add preceding paragraph context if not already present
      if (i > 0) {
        const prev = paragraphs[i - 1].trim();
        if (prev && !prev.startsWith('#') && !prunedParagraphs.includes(prev)) {
          if (prunedParagraphs.length > 0 && prunedParagraphs[prunedParagraphs.length - 1] !== '...') {
            prunedParagraphs.push('...');
          }
          prunedParagraphs.push(`(Context) ${prev}`);
        }
      }

      prunedParagraphs.push(p);

      // Add succeeding paragraph context
      if (i < paragraphs.length - 1) {
        const next = paragraphs[i + 1].trim();
        if (next && !next.startsWith('#')) {
          prunedParagraphs.push(`(Context) ${next}`);
          i++; // Skip next paragraph
        }
      }
    } else {
      if (prunedParagraphs.length > 0 && prunedParagraphs[prunedParagraphs.length - 1] !== '...') {
        prunedParagraphs.push('...');
      }
    }
  }

  // Remove consecutive ellipses
  const result: string[] = [];
  for (const item of prunedParagraphs) {
    if (item === '...') {
      if (result.length > 0 && result[result.length - 1] !== '...') {
        result.push('...');
      }
    } else {
      result.push(item);
    }
  }

  return result.join('\n\n');
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
        anyOf: [
          {
            type: "object",
            properties: {
              id: { type: "string" },
              componentType: { type: "string", enum: ["Biography"] },
              sectionAnchor: { type: "string" },
              props: {
                type: "object",
                properties: {
                  name: { type: "string", description: "Full name of the person." },
                  dates: { type: "string", description: "Lifespan dates, e.g., '1856-1939' or '1723-1790'." },
                  description: { type: "string", description: "Detailed biographical summary focusing on their contributions (8-12 sentences)." },
                  wikipediaUrl: { type: "string", description: "Direct link to their English Wikipedia page." }
                },
                required: ["name", "dates", "description", "wikipediaUrl"]
              }
            },
            required: ["id", "componentType", "sectionAnchor", "props"]
          },
          {
            type: "object",
            properties: {
              id: { type: "string" },
              componentType: { type: "string", enum: ["Citation"] },
              sectionAnchor: { type: "string" },
              props: {
                type: "object",
                properties: {
                  quote: { type: "string", description: "The exact quote text in the target language." },
                  author: { type: "string", description: "Full name of the author." },
                  source: { type: "string", description: "Title of the book, paper, or landmark publication." },
                  year: { type: "string", description: "Year of publication, e.g., '1776'." },
                  original: { type: "string", description: "Original untranslated quote text in the author's original language of writing. MANDATORY if the author's original language of writing is different from the target language. Empty or omitted if the original language is the same as the target language." },
                  commentary: { type: "string", description: "Academic analysis explaining the relevance of the quote (at least 3-4 sentences)." }
                },
                required: ["quote", "author", "source", "year", "commentary"]
              }
            },
            required: ["id", "componentType", "sectionAnchor", "props"]
          },
          {
            type: "object",
            properties: {
              id: { type: "string" },
              componentType: { type: "string", enum: ["Epistemology"] },
              sectionAnchor: { type: "string" },
              props: {
                type: "object",
                properties: {
                  title: { type: "string", description: "The title of the debate or critical controversy." },
                  content: { type: "string", description: "Deeply academic analysis of the epistemology debate (150-250 words)." }
                },
                required: ["title", "content"]
              }
            },
            required: ["id", "componentType", "sectionAnchor", "props"]
          },
          {
            type: "object",
            properties: {
              id: { type: "string" },
              componentType: { type: "string", enum: ["Image"] },
              sectionAnchor: { type: "string" },
              props: {
                type: "object",
                properties: {
                  description: { type: "string", description: "The detailed search/generation description for the image (at least 2-3 sentences of visual instructions). DO NOT generate sequential figure numbers." },
                  alt: { type: "string", description: "Short description for accessibility." },
                  caption: { type: "string", description: "A detailed, italicized caption explaining academic relevance. DO NOT generate sequential figure numbers." },
                  title: { type: "string", description: "Short title of the image." },
                  searchQuery: { type: "string", description: "Highly canonical 1 to 3 search words (e.g. 'Claudio Monteverdi', 'Larynx humain', 'Doppler acoustique') to ensure precise database matches." }
                },
                required: ["description", "alt", "caption", "searchQuery"]
              }
            },
            required: ["id", "componentType", "sectionAnchor", "props"]
          },
          {
            type: "object",
            properties: {
              id: { type: "string" },
              componentType: { type: "string", enum: ["Audio"] },
              sectionAnchor: { type: "string" },
              props: {
                type: "object",
                properties: {
                  title: { type: "string", description: "Short descriptive title for the audio narration." },
                  url: { type: "string", description: "Optional pre-resolved or empty audio URL." },
                  duration: { type: "string", description: "Estimated duration, e.g. '1:30' or '2:45'." },
                  unresolved: { type: "boolean", description: "Whether the resource is unresolved/needs backend matching. Defaults to true." },
                  alt: { type: "string", description: "Short accessibility text." },
                  description: { type: "string", description: "Detailed description of the audio track's content, narration, or pronunciation details." }
                },
                required: ["title"]
              }
            },
            required: ["id", "componentType", "sectionAnchor", "props"]
          },
          {
            type: "object",
            properties: {
              id: { type: "string" },
              componentType: { type: "string", enum: ["Video"] },
              sectionAnchor: { type: "string" },
              props: {
                type: "object",
                properties: {
                  title: { type: "string", description: "Title of the video documentary or lecture segment." },
                  url: { type: "string", description: "Optional video URL (e.g. YouTube/Vimeo)." },
                  id: { type: "string", description: "Optional video platform ID." },
                  provider: { type: "string", enum: ["youtube", "vimeo", "direct"] },
                  duration: { type: "string", description: "Estimated duration, e.g. '3:15'." },
                  unresolved: { type: "boolean", description: "Whether the resource is unresolved/needs backend matching. Defaults to true." }
                },
                required: ["title"]
              }
            },
            required: ["id", "componentType", "sectionAnchor", "props"]
          },
          {
            type: "object",
            properties: {
              id: { type: "string" },
              componentType: { type: "string", enum: ["PronunciationSandbox", "SandboxPrononciation"] },
              sectionAnchor: { type: "string" },
              props: {
                type: "object",
                properties: {
                  word: { type: "string", description: "The word/phrase to practice pronouncing." },
                  ipa: { type: "string", description: "The phonetic transcription in International Phonetic Alphabet (IPA)." },
                  lang: { type: "string", description: "The language code of the word, e.g., 'fr' or 'en'." },
                  definition: { type: "string", description: "A short, clear definition of the word." },
                  explanation: { type: "string", description: "Orthographic and phonetic pronunciation guidance." }
                },
                required: ["word", "ipa", "lang", "definition", "explanation"]
              }
            },
            required: ["id", "componentType", "sectionAnchor", "props"]
          },
          {
            type: "object",
            properties: {
              id: { type: "string" },
              componentType: { type: "string", enum: ["Quiz"] },
              sectionAnchor: { type: "string" },
              props: {
                type: "object",
                properties: {
                  limit: { type: "integer", description: "The number of questions to display at once." },
                  mode: { type: "string", enum: ["standard", "speed"] },
                  questionDurationLimit: { type: "integer", description: "Optional speed mode time limit in seconds per question." },
                  questions: {
                     type: "array",
                     items: {
                       type: "object",
                       properties: {
                         q: { type: "string", description: "The question card text." },
                         explanation: { type: "string", description: "Extremely concise, punchy explanation of the correct choice." },
                         mode: { type: "string", enum: ["standard", "elimination"] },
                         mediaType: { type: "string", enum: ["image", "audio", "video"] },
                         mediaUrl: { type: "string" },
                         mediaCaption: { type: "string" },
                         options: {
                           type: "array",
                           items: {
                             type: "object",
                             properties: {
                               text: { type: "string", description: "The text of the option." },
                               correct: { type: "boolean", description: "Whether this option is correct." }
                             },
                             required: ["text", "correct"]
                           }
                         }
                       },
                       required: ["q", "explanation", "options"]
                     }
                  }
                },
                required: ["limit", "questions"]
              }
            },
            required: ["id", "componentType", "sectionAnchor", "props"]
          },
          {
            type: "object",
            properties: {
              id: { type: "string" },
              componentType: { type: "string", enum: ["MatchingEvaluation", "AssociationCorrespondance"] },
              sectionAnchor: { type: "string" },
              props: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  pairs: { type: "string", description: "Sequence of pairs separated by vertical bars and double pipes, e.g., 'Concept A|Def A || Concept B|Def B'" },
                  explanation: { type: "string" }
                },
                required: ["pairs"]
              }
            },
            required: ["id", "componentType", "sectionAnchor", "props"]
          },
          {
            type: "object",
            properties: {
              id: { type: "string" },
              componentType: { type: "string", enum: ["ReorderEvaluation", "ReordonnerItems"] },
              sectionAnchor: { type: "string" },
              props: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  items: { type: "string", description: "Sequence of ordered items separated by vertical bars, e.g., 'Step 1 | Step 2 | Step 3'" },
                  explanation: { type: "string" }
                },
                required: ["items"]
              }
            },
            required: ["id", "componentType", "sectionAnchor", "props"]
          },
          {
            type: "object",
            properties: {
              id: { type: "string" },
              componentType: { type: "string", enum: ["FillInBlanks", "TextesATrous"] },
              sectionAnchor: { type: "string" },
              props: {
                type: "object",
                properties: {
                  sentence: { type: "string", description: "The sentence containing one or more blanks represented by five underscores (_____)." },
                  answer: { type: "string", description: "The correct comma-separated answers for the blanks." }
                },
                required: ["sentence", "answer"]
              }
            },
            required: ["id", "componentType", "sectionAnchor", "props"]
          },
          {
            type: "object",
            properties: {
              id: { type: "string" },
              componentType: { type: "string", enum: ["SolvedExercise", "ExerciceResolut"] },
              sectionAnchor: { type: "string" },
              props: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  problem: { type: "string", description: "The problem statement." },
                  solution: { type: "string", description: "The detailed step-by-step solution." }
                },
                required: ["title", "problem", "solution"]
              }
            },
            required: ["id", "componentType", "sectionAnchor", "props"]
          },
          {
            type: "object",
            properties: {
              id: { type: "string" },
              componentType: { type: "string", enum: ["UnsolvedExercise", "ExerciceACompleter"] },
              sectionAnchor: { type: "string" },
              props: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  problem: { type: "string", description: "The unsolved application exercise statement." },
                  correctAnswer: { type: "string", description: "The correct analytical answer or formula." }
                },
                required: ["title", "problem", "correctAnswer"]
              }
            },
            required: ["id", "componentType", "sectionAnchor", "props"]
          },
          {
            type: "object",
            properties: {
              id: { type: "string" },
              componentType: { type: "string", enum: ["Mermaid"] },
              sectionAnchor: { type: "string" },
              props: {
                type: "object",
                properties: {
                  chart: { type: "string", description: "Valid Mermaid chart notation." }
                },
                required: ["chart"]
              }
            },
            required: ["id", "componentType", "sectionAnchor", "props"]
          },
          {
            type: "object",
            properties: {
              id: { type: "string" },
              componentType: { type: "string" },
              sectionAnchor: { type: "string" },
              props: { type: "object" }
            },
            required: ["id", "componentType", "sectionAnchor", "props"]
          }
        ]
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
              description: { type: "string" },
              author: { type: "string" },
              year: { type: "string" },
              url: { type: "string" }
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
        type: { type: "string", enum: ["Quiz"] },
        props: {
          type: "object",
          properties: {
            durationLimit: { type: "integer" },
            questions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  q: { type: "string" },
                  explanation: { type: "string" },
                  options: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        text: { type: "string" },
                        correct: { type: "boolean" }
                      },
                      required: ["text", "correct"]
                    },
                    minItems: 2
                  }
                },
                required: ["q", "explanation", "options"]
              },
              minItems: 1
            }
          },
          required: ["questions"]
        }
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
    },
    previousLessonSummary: {
      type: "object",
      properties: {
        previousLessonTitle: { type: "string" },
        previousLessonSlug: { type: "string" },
        keyTakeaways: { type: "array", items: { type: "string" } },
        cognitiveBridge: { type: "string" }
      },
      required: ["previousLessonTitle", "keyTakeaways", "cognitiveBridge"]
    },
    careerProfile: {
      type: "object",
      properties: {
        profession: { type: "string" },
        discipline: { type: "string" },
        courseConnection: { type: "string" },
        keyMissions: { type: "array", items: { type: "string" } },
        careerOutlook: {
          type: "object",
          properties: {
            demand: { type: "string" },
            typicalEmployers: { type: "array", items: { type: "string" } },
            salaryIndication: { type: "string" }
          },
          required: ["demand", "typicalEmployers", "salaryIndication"]
        }
      },
      required: ["profession", "discipline", "courseConnection", "keyMissions", "careerOutlook"]
    },
    researchFocus: {
      type: "object",
      properties: {
        question: { type: "string" },
        category: { type: "string" },
        context: { type: "string" },
        whyUnresolved: { type: "string" },
        activeHypotheses: { type: "array", items: { type: "string" } }
      },
      required: ["question", "category", "context", "whyUnresolved", "activeHypotheses"]
    },
    recentNewsBridge: {
      type: "object",
      properties: {
        eventTitle: { type: "string" },
        date: { type: "string" },
        source: { type: "string" },
        description: { type: "string" },
        courseConnection: { type: "string" },
        whyItMatters: { type: "string" }
      },
      required: ["eventTitle", "date", "source", "description", "courseConnection", "whyItMatters"]
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

const widgetBlock1Schema = {
  type: "object",
  properties: {
    prerequisites: lessonWidgetsSchema.properties.prerequisites,
    diagnosticQuiz: lessonWidgetsSchema.properties.diagnosticQuiz,
    learningObjectives: lessonWidgetsSchema.properties.learningObjectives
  },
  required: ["prerequisites", "diagnosticQuiz", "learningObjectives"]
};

const widgetBlock2Schema = {
  type: "object",
  properties: {
    interactiveComponents: lessonWidgetsSchema.properties.interactiveComponents
  },
  required: ["interactiveComponents"]
};

const widgetBlock3Schema = {
  type: "object",
  properties: {
    conclusionSummary: lessonWidgetsSchema.properties.conclusionSummary,
    whatsNext: lessonWidgetsSchema.properties.whatsNext,
    goingFurther: lessonWidgetsSchema.properties.goingFurther,
    glossary: lessonWidgetsSchema.properties.glossary
  },
  required: ["conclusionSummary", "whatsNext", "goingFurther", "glossary"]
};

const widgetBlock4Schema = {
  type: "object",
  properties: {
    finalEvaluation: lessonWidgetsSchema.properties.finalEvaluation,
    references: lessonWidgetsSchema.properties.references
  },
  required: ["finalEvaluation", "references"]
};


function extractWidgetAnchors(narrativeText: string): { raw: string, type: string, id: string, topic?: string }[] {
  const matches: { raw: string, type: string, id: string, topic?: string }[] = [];
  const regex = /\[\[WIDGET:(.*?)\]\]+/gi;
  let match;
  while ((match = regex.exec(narrativeText)) !== null) {
    const raw = match[0];
    const inner = match[1].trim();
    const parts = inner.split(':');
    if (parts.length >= 3) {
      const type = parts[0].trim();
      const id = parts[1].trim();
      const topic = parts.slice(2).join(':').trim();
      matches.push({ raw, type, id, topic });
    } else if (parts.length === 2) {
      const type = parts[0].trim();
      const id = parts[1].trim();
      matches.push({ raw, type, id });
    } else if (parts.length === 1) {
      const id = parts[0].trim();
      matches.push({ raw, type: id, id });
    }
  }
  return matches;
}

function getDynamicWidgetsSchema(narrativeText: string): any {
  const schema = JSON.parse(JSON.stringify(lessonWidgetsSchema));
  const anchors = extractWidgetAnchors(narrativeText);
  const foundTypes = new Set(anchors.map(a => a.type.toLowerCase()));
  const foundIds = new Set(anchors.map(a => a.id.toLowerCase()));

  const conditionalProps = ["previousLessonSummary", "careerProfile", "researchFocus", "recentNewsBridge"];
  for (const prop of conditionalProps) {
    if (!foundTypes.has(prop.toLowerCase()) && !foundIds.has(prop.toLowerCase())) {
      delete schema.properties[prop];
    }
  }

  if (schema.properties.interactiveComponents && schema.properties.interactiveComponents.items) {
    const anyOf = schema.properties.interactiveComponents.items.anyOf;
    if (Array.isArray(anyOf)) {
      const activeAnyOf: any[] = [];
      const genericFallback = anyOf[anyOf.length - 1];

      for (const option of anyOf) {
        if (!option.properties || !option.properties.componentType) continue;
        const compTypeEnum = option.properties.componentType.enum;
        if (Array.isArray(compTypeEnum)) {
          const hasMatch = compTypeEnum.some(type => foundTypes.has(type.toLowerCase()));
          if (hasMatch) {
            activeAnyOf.push(option);
          }
        }
      }

      activeAnyOf.push(genericFallback);
      schema.properties.interactiveComponents.items.anyOf = activeAnyOf;
    }
  }

  return schema;
}

function getSchemasForRejectedKeys(rejectedKeys: string[], baseSchema: any): string {
  const schemas: Record<string, any> = {};

  for (const key of rejectedKeys) {
    if (key.startsWith('interactiveComponents:')) {
      const compId = key.substring('interactiveComponents:'.length).toLowerCase();
      if (baseSchema.properties.interactiveComponents?.items?.anyOf) {
        const anyOf = baseSchema.properties.interactiveComponents.items.anyOf;
        const matched = anyOf.find((opt: any) => {
          if (!opt.properties || !opt.properties.componentType) return false;
          const compTypeEnum = opt.properties.componentType.enum;
          return Array.isArray(compTypeEnum) && compTypeEnum.some(type => type.toLowerCase() === compId || type.toLowerCase().replace(/sandbox|prononciation/g, '') === compId.replace(/sandbox|prononciation/g, ''));
        });
        if (matched) {
          schemas[key] = matched;
        } else {
          schemas[key] = anyOf[anyOf.length - 1];
        }
      }
    } else {
      const propSchema = baseSchema.properties[key];
      if (propSchema) {
        schemas[key] = propSchema;
      }
    }
  }

  if (Object.keys(schemas).length === 0) {
    return "No specific schemas found. Follow the standard properties format.";
  }

  return JSON.stringify(schemas, null, 2);
}

function getDisciplineFallbackSentence(discipline?: string, lang: string = 'fr'): { sentence: string; answer: string } {
  const normDisc = (discipline || '').toLowerCase();
  const normLang = lang.toLowerCase().split('-')[0];

  const sentences: Record<string, Record<string, { sentence: string; answer: string }>> = {
    linguistics: {
      fr: { sentence: "Le _____ est l'unité minimale de son dans une langue.", answer: "phonème" },
      en: { sentence: "The _____ is the smallest unit of sound in a language.", answer: "phoneme" },
      es: { sentence: "El _____ es la unidad mínima de sonido en una lengua.", answer: "fonema" },
      de: { sentence: "Das _____ ist die kleinste lautliche Einheit einer Sprache.", answer: "Phonem" },
      zh: { sentence: "_____ 是语言中最小的声音单位。", answer: "音位" }
    },
    physics: {
      fr: { sentence: "La vitesse de la lumière dans le vide est d'environ 300 000 _____ par seconde.", answer: "kilomètres" },
      en: { sentence: "The speed of light in a vacuum is approximately 300,000 _____ per second.", answer: "kilometers" },
      es: { sentence: "La velocidad de la luz en el vacío es de aproximadamente 300.000 _____ por segundo.", answer: "kilómetros" },
      de: { sentence: "Die Lichtgeschwindigkeit im Vakuum beträgt etwa 300.000 _____ pro Sekunde.", answer: "Kilometer" },
      zh: { sentence: "真空中光速约为每秒 30 _____ 公里。", answer: "万" }
    },
    astronomy: {
      fr: { sentence: "La Terre tourne autour du _____.", answer: "Soleil" },
      en: { sentence: "The Earth revolves around the _____.", answer: "Sun" },
      es: { sentence: "La Tierra gira alrededor del _____.", answer: "Sol" },
      de: { sentence: "Die Erde dreht sich um die _____.", answer: "Sonne" },
      zh: { sentence: "地球围绕_____公转。", answer: "太阳" }
    },
    chemistry: {
      fr: { sentence: "L'eau est composée de deux atomes d'hydrogène et d'un atome d'_____.", answer: "oxygène" },
      en: { sentence: "Water is composed of two hydrogen atoms and one _____ atom.", answer: "oxygen" },
      es: { sentence: "El agua está compuesta por dos átomos de hidrógeno y uno de _____.", answer: "oxígeno" },
      de: { sentence: "Wasser besteht aus zwei Wasserstoffatomen und einem _____atom.", answer: "Sauerstoff" },
      zh: { sentence: "水分子由两个氢原子和一个_____原子组成。", answer: "氧" }
    },
    biology: {
      fr: { sentence: "Le _____ est l'organe central qui pompe le sang dans le corps.", answer: "cœur" },
      en: { sentence: "The _____ is the central organ that pumps blood throughout the body.", answer: "heart" },
      es: { sentence: "El _____ es el órgano central que bombea sangre por todo el cuerpo.", answer: "corazón" },
      de: { sentence: "Das _____ ist das zentrale Organ, das Blut durch den Körper pumpt.", answer: "Herz" },
      zh: { sentence: "_____是向全身泵送血液的中心器官。", answer: "心脏" }
    },
    mathematics: {
      fr: { sentence: "Un triangle rectangle possède un angle _____.", answer: "droit" },
      en: { sentence: "A right triangle always has one _____ angle.", answer: "right" },
      es: { sentence: "Un triángulo rectángulo tiene un ángulo _____.", answer: "recto" },
      de: { sentence: "Ein rechtwinkliges Dreieck hat einen _____ Winkel.", answer: "rechten" },
      zh: { sentence: "直角三角形包含一个_____角。", answer: "直" }
    },
    history: {
      fr: { sentence: "La Révolution française a débuté en _____.", answer: "1789" },
      en: { sentence: "The French Revolution began in the year _____.", answer: "1789" },
      es: { sentence: "La Revolución Francesa comenzó en el año _____.", answer: "1789" },
      de: { sentence: "Die Französische Revolution begann im Jahr _____.", answer: "1789" },
      zh: { sentence: "法国大革命开始于 _____ 年。", answer: "1789" }
    },
    computers: {
      fr: { sentence: "Un algorithme est une suite finie d'_____.", answer: "instructions" },
      en: { sentence: "An algorithm is a finite sequence of _____.", answer: "instructions" },
      es: { sentence: "Un algoritmo es una secuencia finita de _____.", answer: "instrucciones" },
      de: { sentence: "Ein Algorithmus ist eine endliche Abfolge von _____.", answer: "Anweisungen" },
      zh: { sentence: "算法是有限的_____序列。", answer: "指令" }
    }
  };

  let category = 'astronomy';
  if (normDisc.includes('ling') || normDisc.includes('lang') || normDisc.includes('phon')) {
    category = 'linguistics';
  } else if (normDisc.includes('phys')) {
    category = 'physics';
  } else if (normDisc.includes('chem') || normDisc.includes('chim')) {
    category = 'chemistry';
  } else if (normDisc.includes('bio') || normDisc.includes('anat') || normDisc.includes('med')) {
    category = 'biology';
  } else if (normDisc.includes('math') || normDisc.includes('alg') || normDisc.includes('geom')) {
    category = 'mathematics';
  } else if (normDisc.includes('hist') || normDisc.includes('polit')) {
    category = 'history';
  } else if (normDisc.includes('comp') || normDisc.includes('prog') || normDisc.includes('info') || normDisc.includes('web')) {
    category = 'computers';
  }

  const langSentences = sentences[category] || sentences['astronomy'];
  return langSentences[normLang] || langSentences['en'] || { sentence: "The Earth revolves around the _____.", answer: "Sun" };
}

function detectLanguageLeakage(text: string, targetLang: string): boolean {
  if (!text || typeof text !== 'string') return false;
  const clean = text.toLowerCase().trim();
  if (clean.length < 8) return false;

  const normLang = (targetLang || 'fr').toLowerCase().split('-')[0];
  if (normLang === 'en') return false;

  const englishIndicators = [
    /\bthe\s+(?:study|theory|concept|process|method|system|model|structure|function|example|role|importance|nature|effect|development|history|origin|application|analysis|definition|classification|principles|elements|components|features|characteristics)\b/i,
    /\bis\s+a\b/i,
    /\is\s+the\b/i,
    /\brefers\s+to\b/i,
    /\bdefined\s+as\b/i,
    /\bcan\s+be\b/i,
    /\bwhich\s+is\b/i,
    /\bthere\s+are\b/i,
    /\bwith\s+the\b/i,
    /\bof\s+the\b/i,
    /\band\s+the\b/i,
    /\bfor\s+example\b/i,
    /\bthis\s+means\b/i
  ];

  let matches = 0;
  for (const regex of englishIndicators) {
    if (regex.test(clean)) {
      matches++;
    }
  }

  if (matches >= 1) return true;

  if (normLang === 'fr') {
    const frenchIndicators = [
      /\b(le|la|les|un|une|des|du|de|en|et|ou|est|sont|dans|pour|par|sur|avec|qui|que|ce|cette|ces|se|dans|pour)\b/i
    ];
    if (clean.length > 20 && !frenchIndicators[0].test(clean)) {
      return true;
    }
  }

  return false;
}

async function translateText(text: string, targetLang: string): Promise<string> {
  const prompt = `You are a precise translator. Translate the following text into ${targetLang.toUpperCase()}. Keep all technical/academic/literary terms accurate. Do NOT add any explanations, introductory text, or markdown formatting. Return ONLY the translated text.

TEXT TO TRANSLATE:
${text}`;
  try {
    const res = await callVertexAI({
      task: 'course_generation',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.1 }
    });
    if (res && res.ok) {
      const resJson = await res.json();
      const resultText = resJson.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const cleanRes = resultText.replace(/```[a-z]*/g, '').replace(/```/g, '').trim();
      return cleanRes;
    }
    return text;
  } catch (err) {
    console.error(`[TRANSLATE] Failed to translate:`, err);
    return text;
  }
}

export async function validateAndFixWidgets(widgets: any, discipline?: string, lang: string = 'fr'): Promise<any> {
  if (!widgets || typeof widgets !== 'object') {
    throw new Error("Widgets content is empty or malformed.");
  }

  // 1. Prerequisites validation
  if (!widgets.prerequisites || !Array.isArray(widgets.prerequisites.items)) {
    widgets.prerequisites = { items: [] };
  } else {
    widgets.prerequisites.items = widgets.prerequisites.items.filter((x: any) => x && String(x).trim().length > 0);
    for (let i = 0; i < widgets.prerequisites.items.length; i++) {
      if (detectLanguageLeakage(widgets.prerequisites.items[i], lang)) {
        widgets.prerequisites.items[i] = await translateText(widgets.prerequisites.items[i], lang);
      }
    }
  }

  // 2. Diagnostic quiz validation
  if (widgets.diagnosticQuiz && typeof widgets.diagnosticQuiz === 'object') {
    if (!Array.isArray(widgets.diagnosticQuiz.options) || widgets.diagnosticQuiz.options.length < 2) {
      widgets.diagnosticQuiz = null;
    } else {
      widgets.diagnosticQuiz.options = widgets.diagnosticQuiz.options.filter((o: any) => o && String(o).trim().length > 0);
      if (widgets.diagnosticQuiz.options.length < 2) {
        widgets.diagnosticQuiz = null;
      } else {
        if (typeof widgets.diagnosticQuiz.correctIndex !== 'number' || widgets.diagnosticQuiz.correctIndex < 0 || widgets.diagnosticQuiz.correctIndex >= widgets.diagnosticQuiz.options.length) {
          widgets.diagnosticQuiz.correctIndex = 0;
        }
        
        // Translate diagnosticQuiz fields if leaked
        if (detectLanguageLeakage(widgets.diagnosticQuiz.question, lang)) {
          widgets.diagnosticQuiz.question = await translateText(widgets.diagnosticQuiz.question, lang);
        }
        if (detectLanguageLeakage(widgets.diagnosticQuiz.sectionTitle, lang)) {
          widgets.diagnosticQuiz.sectionTitle = await translateText(widgets.diagnosticQuiz.sectionTitle, lang);
        }
        for (let i = 0; i < widgets.diagnosticQuiz.options.length; i++) {
          if (detectLanguageLeakage(widgets.diagnosticQuiz.options[i], lang)) {
            widgets.diagnosticQuiz.options[i] = await translateText(widgets.diagnosticQuiz.options[i], lang);
          }
        }
      }
    }
  } else {
    widgets.diagnosticQuiz = null;
  }

  // 3. Objectives KSA validation
  if (widgets.learningObjectives && typeof widgets.learningObjectives === 'object') {
    widgets.learningObjectives.knowledge = Array.isArray(widgets.learningObjectives.knowledge)
      ? widgets.learningObjectives.knowledge.filter((x: any) => x && String(x).trim().length > 0)
      : [];
    widgets.learningObjectives.skills = Array.isArray(widgets.learningObjectives.skills)
      ? widgets.learningObjectives.skills.filter((x: any) => x && String(x).trim().length > 0)
      : [];
    widgets.learningObjectives.attitudes = Array.isArray(widgets.learningObjectives.attitudes)
      ? widgets.learningObjectives.attitudes.filter((x: any) => x && String(x).trim().length > 0)
      : [];

    // Translate learningObjectives fields if leaked
    const categories = ['knowledge', 'skills', 'attitudes'];
    for (const cat of categories) {
      const items = widgets.learningObjectives[cat];
      for (let i = 0; i < items.length; i++) {
        if (detectLanguageLeakage(items[i], lang)) {
          items[i] = await translateText(items[i], lang);
        }
      }
    }

    if (widgets.learningObjectives.knowledge.length === 0 && widgets.learningObjectives.skills.length === 0 && widgets.learningObjectives.attitudes.length === 0) {
      widgets.learningObjectives = null;
    }
  } else {
    widgets.learningObjectives = null;
  }

  // 4. Formative interactiveComponents validation & sanitization
  if (!Array.isArray(widgets.interactiveComponents)) {
    widgets.interactiveComponents = [];
  } else {
    widgets.interactiveComponents = widgets.interactiveComponents.filter((comp: any) => {
      if (!comp || typeof comp !== 'object' || !comp.id || !comp.componentType) {
        return false;
      }
      const props = comp.props || {};
      if (comp.componentType === "Biography") {
        if (!props.name || /placeholder|dummy|todo|tbd/i.test(props.name)) {
          return false;
        }
      }
      if (comp.componentType === "Image") {
        if (!props.description || /illustration|placeholder/i.test(props.description)) {
          return false;
        }
      }
      return true;
    });

    const disc = (discipline || "").toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const isMath = disc.includes("math") || disc.includes("alge") || disc.includes("geomet");
    const isPhysics = disc.includes("physic") || disc.includes("physiq") || disc.includes("astron");
    const isChemistry = disc.includes("chemist") || disc.includes("chimi");
    const isBiology = disc.includes("biolog") || disc.includes("life science") || disc.includes("anatom") || disc.includes("medec") || disc.includes("medici") || disc.includes("sante");
    const isCS = disc.includes("computer") || disc.includes("informatique") || disc.includes("program") || disc.includes("software");
    const isEconomics = disc.includes("econom") || disc.includes("finan") || disc.includes("busines") || disc.includes("comptab");
    const isSocialPsych = disc.includes("psych") || disc.includes("sociol") || disc.includes("social");
    const isHistoryGeogHumanities = disc.includes("histor") || disc.includes("geogr") || disc.includes("philosoph") || disc.includes("liter") || disc.includes("lettr") || disc.includes("art");

    widgets.interactiveComponents = widgets.interactiveComponents.filter((comp: any) => {
      if (!comp || !comp.componentType) return false;
      
      const alwaysAllowed = [
        "Quiz", "FillInBlanks", "SolvedExercise", "UnsolvedExercise", "Mermaid", "Video", "Audio",
        "Biography", "Image", "Citation", "Epistemology", "MatchingEvaluation", "AssociationCorrespondance",
        "ReorderEvaluation", "ReordonnerItems"
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

    // Heal, translate and clean up fields
    for (const comp of widgets.interactiveComponents) {
      if (!comp.props || typeof comp.props !== 'object') comp.props = {};
      const props = comp.props;

      // Intelligent biography healing
      if (comp.componentType === "Biography") {
        let name = (props.name || "").trim();
        let description = (props.description || "").trim();
        const isPlaceholder = !description || description.length < 20 || /placeholder|dummy|todo|tbd|biographie détaillée/i.test(description);
        
        if (name && isPlaceholder) {
          console.log(`[BIOGRAPHY VALIDATOR] Biography placeholder or empty description for "${name}". Healing via Wikipedia...`);
          try {
            const targetLang = (lang || 'fr').toLowerCase().split('-')[0];
            const wikiSearchUrl = `https://${targetLang}.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=${encodeURIComponent(name)}&srlimit=1`;
            const res = await fetchWithTimeout(wikiSearchUrl);
            if (res.ok) {
              const data = await res.json();
              const searchResult = data.query?.search?.[0];
              if (searchResult) {
                const canonicalTitle = searchResult.title;
                const wikiExtractUrl = `https://${targetLang}.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro=1&explaintext=1&titles=${encodeURIComponent(canonicalTitle)}&redirects=1`;
                const res2 = await fetchWithTimeout(wikiExtractUrl);
                if (res2.ok) {
                  const data2 = await res2.json();
                  const pages = data2.query?.pages;
                  if (pages) {
                    const pageId = Object.keys(pages)[0];
                    if (pageId && pageId !== '-1') {
                      const extract = pages[pageId].extract || '';
                      if (extract && extract.length > 30) {
                        let sentence = extract.split(/[.!?]\s/)[0].trim();
                        const parts = extract.split(/[.!?]\s/);
                        if (parts[1]) sentence += '. ' + parts[1].trim();
                        if (parts[2]) sentence += '. ' + parts[2].trim();
                        if (!sentence.endsWith('.')) sentence += '.';
                        sentence = sentence.replace(/\s*\([^)]*\)/g, '').trim();
                        sentence = sentence.replace(/\s+/g, ' ');
                        
                        props.description = sentence;
                        props.name = canonicalTitle;
                        props.wikipediaUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(canonicalTitle.replace(/\s+/g, '_'))}`;
                        console.log(`[BIOGRAPHY VALIDATOR] Healed "${name}" description via Wikipedia.`);
                      }
                    }
                  }
                }
              }
            }
          } catch (err) {
            console.error(`[BIOGRAPHY VALIDATOR] Error healing biography:`, err);
          }
        }
      }

      // Check language leakage and translate
      if (comp.componentType === "Quiz") {
        if (Array.isArray(props.questions)) {
          props.questions = props.questions.filter((q: any) => q && q.q && Array.isArray(q.options) && q.options.length >= 2);
          for (const q of props.questions) {
            if (detectLanguageLeakage(q.q, lang)) {
              q.q = await translateText(q.q, lang);
            }
            if (detectLanguageLeakage(q.explanation, lang)) {
              q.explanation = await translateText(q.explanation, lang);
            }
            q.options = q.options.map((o: any) => {
              if (!o || typeof o !== 'object') return { text: "Option", correct: false };
              if (!o.text) o.text = "Option";
              o.correct = !!o.correct;
              return o;
            });
            for (const o of q.options) {
              if (detectLanguageLeakage(o.text, lang)) {
                o.text = await translateText(o.text, lang);
              }
            }
            if (!q.options.some((o: any) => o.correct)) {
              q.options[0].correct = true;
            }
          }
        }
      } else if (comp.componentType === "Biography") {
        if (detectLanguageLeakage(props.name, lang)) {
          props.name = await translateText(props.name, lang);
        }
        if (detectLanguageLeakage(props.description, lang)) {
          props.description = await translateText(props.description, lang);
        }
      } else if (comp.componentType === "Image") {
        if (detectLanguageLeakage(props.description, lang)) {
          props.description = await translateText(props.description, lang);
        }
        if (detectLanguageLeakage(props.alt, lang)) {
          props.alt = await translateText(props.alt, lang);
        }
        if (props.caption && detectLanguageLeakage(props.caption, lang)) {
          props.caption = await translateText(props.caption, lang);
        }
      } else if (comp.componentType === "Citation") {
        if (detectLanguageLeakage(props.quote, lang)) {
          props.quote = await translateText(props.quote, lang);
        }
        if (detectLanguageLeakage(props.commentary, lang)) {
          props.commentary = await translateText(props.commentary, lang);
        }
      } else if (comp.componentType === "Epistemology") {
        if (detectLanguageLeakage(props.title, lang)) {
          props.title = await translateText(props.title, lang);
        }
        if (detectLanguageLeakage(props.content, lang)) {
          props.content = await translateText(props.content, lang);
        }
      } else if (comp.componentType === "SolvedExercise" || comp.componentType === "UnsolvedExercise") {
        if (detectLanguageLeakage(props.title, lang)) {
          props.title = await translateText(props.title, lang);
        }
        if (detectLanguageLeakage(props.problem, lang)) {
          props.problem = await translateText(props.problem, lang);
        }
        if (props.solution && detectLanguageLeakage(props.solution, lang)) {
          props.solution = await translateText(props.solution, lang);
        }
        if (props.correctAnswer && detectLanguageLeakage(props.correctAnswer, lang)) {
          props.correctAnswer = await translateText(props.correctAnswer, lang);
        }
        if (props.explanation && detectLanguageLeakage(props.explanation, lang)) {
          props.explanation = await translateText(props.explanation, lang);
        }
      }
    }
  }

  // 5. Whats next validation
  if (widgets.whatsNext && Array.isArray(widgets.whatsNext.steps)) {
    widgets.whatsNext.steps = widgets.whatsNext.steps.filter((s: any) => s && s.title && s.description && !/placeholder|todo/i.test(s.description));
    for (const step of widgets.whatsNext.steps) {
      if (detectLanguageLeakage(step.title, lang)) {
        step.title = await translateText(step.title, lang);
      }
      if (detectLanguageLeakage(step.description, lang)) {
        step.description = await translateText(step.description, lang);
      }
    }
  } else {
    widgets.whatsNext = { steps: [] };
  }

  // 5b. Going further validation
  if (widgets.goingFurther && Array.isArray(widgets.goingFurther.items)) {
    const PLACEHOLDER_URL_PATTERNS = [
      'example.com', 'your_youtube_id', 'youtube.com/watch?v=xxxxxx',
      'youtube.com/watch?v=abcdef', 'youtube.com/watch?v=12345',
      'youtube.com/watch?v=dqw4w9wgxcq', 'test.com', 'placeholder', 'fakeurl'
    ];
    widgets.goingFurther.items = widgets.goingFurther.items.filter((it: any) => {
      if (!it || !it.title || !it.description || /placeholder|todo/i.test(it.description)) return false;
      return true;
    }).map((it: any) => {
      const title = String(it.title).trim();
      const type = ["book", "article", "video", "website", "research", "movie", "film"].includes(it.type) ? it.type : "website";
      let url = (it.url || "").trim();
      const lowerUrl = url.toLowerCase();
      if (url && PLACEHOLDER_URL_PATTERNS.some(p => lowerUrl.includes(p))) {
        url = "";
      }
      const description = String(it.description).trim();
      const author = it.author ? String(it.author).trim() : "";
      const year = it.year ? String(it.year).trim() : "";
      return { title, type, url, description, author, year };
    });

    for (const item of widgets.goingFurther.items) {
      if (detectLanguageLeakage(item.title, lang)) {
        item.title = await translateText(item.title, lang);
      }
      if (detectLanguageLeakage(item.description, lang)) {
        item.description = await translateText(item.description, lang);
      }
      if (item.author && detectLanguageLeakage(item.author, lang)) {
        item.author = await translateText(item.author, lang);
      }
    }
  } else {
    widgets.goingFurther = { items: [] };
  }

  // 6. Summary points validation (must be complete sentences ending with periods)
  if (widgets.conclusionSummary && Array.isArray(widgets.conclusionSummary.items)) {
    widgets.conclusionSummary.items = widgets.conclusionSummary.items.filter((it: any) => it && String(it).trim().length > 0).map((it: string) => {
      let clean = (it || "").trim();
      if (!clean.endsWith(".") && !clean.endsWith("!") && !clean.endsWith("?")) {
        clean += ".";
      }
      return clean;
    });

    for (let i = 0; i < widgets.conclusionSummary.items.length; i++) {
      if (detectLanguageLeakage(widgets.conclusionSummary.items[i], lang)) {
        widgets.conclusionSummary.items[i] = await translateText(widgets.conclusionSummary.items[i], lang);
      }
    }
  } else {
    widgets.conclusionSummary = { items: [] };
  }

  // 7. Final summative evaluation validation
  if (widgets.finalEvaluation && typeof widgets.finalEvaluation === 'object') {
    widgets.finalEvaluation.type = "Quiz";
    if (!widgets.finalEvaluation.props || typeof widgets.finalEvaluation.props !== 'object') {
      widgets.finalEvaluation.props = {};
    }
    const qProps = widgets.finalEvaluation.props;
    if (!qProps.durationLimit) qProps.durationLimit = 1800;
    
    if (qProps.prompt && detectLanguageLeakage(qProps.prompt, lang)) {
      qProps.prompt = await translateText(qProps.prompt, lang);
    }
    if (qProps.subject && detectLanguageLeakage(qProps.subject, lang)) {
      qProps.subject = await translateText(qProps.subject, lang);
    }

    if (Array.isArray(qProps.questions)) {
      qProps.questions = qProps.questions.filter((q: any) => {
        if (!q || typeof q !== 'object' || !q.q || !Array.isArray(q.options) || q.options.length < 2) return false;
        if (/placeholder|question d'auto-évaluation|evaluation question/i.test(q.q)) return false;
        return true;
      }).map((q: any) => {
        q.q = String(q.q).trim();
        q.explanation = q.explanation ? String(q.explanation).trim() : "";
        q.options = q.options.map((o: any) => {
          if (!o || typeof o !== 'object') return { text: "Option", correct: false };
          return { text: String(o.text || o).trim(), correct: !!o.correct };
        });
        if (!q.options.some((o: any) => o.correct)) {
          q.options[0].correct = true;
        }
        return q;
      });

      for (const q of qProps.questions) {
        if (detectLanguageLeakage(q.q, lang)) {
          q.q = await translateText(q.q, lang);
        }
        if (detectLanguageLeakage(q.explanation, lang)) {
          q.explanation = await translateText(q.explanation, lang);
        }
        for (const o of q.options) {
          if (detectLanguageLeakage(o.text, lang)) {
            o.text = await translateText(o.text, lang);
          }
        }
      }

      if (qProps.questions.length === 0) {
        widgets.finalEvaluation = null;
      }
    } else {
      widgets.finalEvaluation = null;
    }
  } else {
    widgets.finalEvaluation = null;
  }

  // 8. Glossary & References validation
  if (Array.isArray(widgets.glossary)) {
    const targetLang = (lang || 'fr').toLowerCase().split('-')[0];
    const healedGlossary = [];
    for (let i = 0; i < widgets.glossary.length; i++) {
      const entry = widgets.glossary[i];
      if (!entry || typeof entry !== 'object') continue;

      let term = (entry.term || "").trim();
      let definition = (entry.definition || "").trim();

      if (!term || !definition) continue;

      const isCircular = term.toLowerCase() === definition.toLowerCase();
      const isShort = definition.length < 8;
      const isPlaceholder = /placeholder|dummy|todo|tbd|a definir/i.test(definition);

      const isWrongLanguage = (targetLang !== 'en') && (
        /\b(is a|are|refers to|the study of|of the|in the|and the|with the|is the|study of)\b/i.test(definition) ||
        (targetLang === 'fr' && !/\b(est|une|des|les|dans|pour|avec|qui|que|du|en)\b/i.test(definition))
      );

      if (isCircular || isShort || isPlaceholder || isWrongLanguage) {
        console.log(`[GLOSSARY VALIDATOR] Invalid or English glossary entry detected: "${term}": "${definition}". Healing via Wikipedia...`);
        const queryTerm = term || definition;
        let healed = false;
        try {
          const wikiSearchUrl = `https://${targetLang}.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=${encodeURIComponent(queryTerm)}&srlimit=1`;
          const res = await fetchWithTimeout(wikiSearchUrl);
          if (res.ok) {
            const data = await res.json();
            const searchResult = data.query?.search?.[0];
            if (searchResult) {
              const canonicalTitle = searchResult.title;
              const wikiExtractUrl = `https://${targetLang}.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro=1&explaintext=1&titles=${encodeURIComponent(canonicalTitle)}&redirects=1`;
              const res2 = await fetchWithTimeout(wikiExtractUrl);
              if (res2.ok) {
                const data2 = await res2.json();
                const pages = data2.query?.pages;
                if (pages) {
                  const pageId = Object.keys(pages)[0];
                  if (pageId && pageId !== '-1') {
                    const extract = pages[pageId].extract || '';
                    if (extract && extract.length > 20) {
                      let sentence = extract.split(/[.!?]\s/)[0].trim();
                      if (sentence.length < 30 && extract.split(/[.!?]\s/)[1]) {
                        sentence += '. ' + extract.split(/[.!?]\s/)[1].trim();
                      }
                      if (!sentence.endsWith('.')) sentence += '.';
                      sentence = sentence.replace(/\s*\([^)]*\)/g, '').trim();
                      sentence = sentence.replace(/\s+/g, ' ');
                      
                      healedGlossary.push({
                        term: canonicalTitle,
                        definition: sentence
                      });
                      console.log(`[GLOSSARY VALIDATOR] Healed to: "${canonicalTitle}": "${sentence}"`);
                      healed = true;
                    }
                  }
                }
              }
            }
          }
        } catch (err) {
          console.error(`[GLOSSARY VALIDATOR] Error healing glossary entry:`, err);
        }

        // Fallback to translation if Wikipedia healing failed
        if (!healed) {
          console.log(`[GLOSSARY VALIDATOR] Wikipedia healing failed. Translating term and definition directly...`);
          try {
            const translatedTerm = await translateText(term, targetLang);
            const translatedDef = await translateText(definition, targetLang);
            if (translatedTerm && translatedDef) {
              healedGlossary.push({
                term: translatedTerm,
                definition: translatedDef
              });
              healed = true;
            }
          } catch (tErr) {
            console.error(`[GLOSSARY VALIDATOR] Direct translation of glossary entry failed:`, tErr);
          }
        }
      } else {
        healedGlossary.push({ term, definition });
      }
    }

    // Final language leakage sweep for all glossary entries
    for (const g of healedGlossary) {
      if (detectLanguageLeakage(g.term, lang)) {
        g.term = await translateText(g.term, lang);
      }
      if (detectLanguageLeakage(g.definition, lang)) {
        g.definition = await translateText(g.definition, lang);
      }
    }

    widgets.glossary = healedGlossary;
  } else {
    widgets.glossary = [];
  }

  if (!Array.isArray(widgets.references)) {
    widgets.references = [];
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

function replaceWidget(content: string, widgetName: string, widgetStr: string): { content: string, replaced: boolean } {
  const escapedName = widgetName.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  // Match [[WIDGET:widgetName]], [[WIDGET:Type:widgetName]], or [[WIDGET:Type:widgetName:Topic]]
  const regex = new RegExp(`\\[\\[\\s*WIDGET\\s*:\\s*(?:[^:\\s\\]]+\\s*:\\s*)?${escapedName}\\s*(?::\\s*([^\\]]+))?\\s*\\]\\]`, 'gi');
  if (regex.test(content)) {
    return { content: content.replace(regex, widgetStr), replaced: true };
  }
  return { content, replaced: false };
}

export function extractAndInjectCitations(content: string, references: string[]): string {
  let updatedContent = content;
  const citationTagRegex = /<(Citation|QuoteBlock|InteractiveQuote)\b([^>]*?)>/gi;
  
  updatedContent = updatedContent.replace(citationTagRegex, (match, tagName, attrsStr) => {
    const authorMatch = attrsStr.match(/author=(["'])([\s\S]*?)\1/);
    const sourceMatch = attrsStr.match(/source=(["'])([\s\S]*?)\1/);
    const yearMatch = attrsStr.match(/year=(["'])([\s\S]*?)\1/);
    const refNumMatch = attrsStr.match(/refNum=\{\s*(\d+)\s*\}/);
    
    const author = authorMatch ? authorMatch[2].trim() : '';
    const source = sourceMatch ? sourceMatch[2].trim() : '';
    const year = yearMatch ? yearMatch[2].trim() : '';
    let refNum = refNumMatch ? parseInt(refNumMatch[1], 10) : null;
    
    if (!author && !source) {
      return match;
    }
    
    let bibEntry = author;
    if (source) {
      bibEntry += bibEntry ? `, *${source}*` : `*${source}*`;
    }
    if (year) {
      bibEntry += bibEntry ? `, ${year}` : year;
    }
    
    if (bibEntry && !bibEntry.endsWith('.')) {
      bibEntry += '.';
    }
    
    if (bibEntry) {
      let existingIdx = references.findIndex(r => {
        const cleanR = r.toLowerCase().replace(/[*_.]/g, '');
        const cleanBib = bibEntry.toLowerCase().replace(/[*_.]/g, '');
        return cleanR.includes(cleanBib) || cleanBib.includes(cleanR);
      });
      
      if (existingIdx !== -1) {
        refNum = existingIdx + 1;
      } else {
        references.push(bibEntry);
        refNum = references.length;
      }
    }
    
    if (refNum !== null) {
      let newAttrsStr = attrsStr;
      if (attrsStr.includes('refNum=')) {
        newAttrsStr = newAttrsStr.replace(/refNum=\{\s*\d+\s*\}/g, `refNum={${refNum}}`);
      } else {
        newAttrsStr = newAttrsStr.trim() + ` refNum={${refNum}}`;
      }
      return `<${tagName} ${newAttrsStr}>`;
    }
    
    return match;
  });
  
  return updatedContent;
}

export function stitchLessonContent(narrativeMdx: string, widgets: any, isTerminalEvaluation: boolean = false): string {
  let content = narrativeMdx.trim();

  // Compile Category A (direct markdown/prose enclosers) inline *before* suffix normalization
  const categoryAMap: { [key: string]: string } = {
    didyouknow: "DidYouKnow",
    lesaviezvous: "LeSaviezVous",
    historicalanecdote: "HistoricalAnecdote",
    anecdotehistorique: "AnecdoteHistorique",
    pointofview: "PointOfView",
    pointdevue: "PointDeVue",
    criticalthinking: "CriticalThinking",
    espritcritique: "EspritCritique",
    scientificmethod: "ScientificMethod",
    methodescientifique: "MethodeScientifique",
    scientificdebate: "ScientificDebate",
    debatscientifique: "DebatScientifique",
    openquestion: "OpenQuestion",
    historicalfact: "HistoricalFact",
    faithistorique: "FaitHistorique",
    historicalevent: "HistoricalEvent",
    evenementhistorique: "EvenementHistorique",
    brilliantidea: "BrilliantIdea",
    ideebrillante: "IdeeBrillante"
  };

  content = content.replace(/\[\[\s*WIDGET\s*:\s*(DidYouKnow|LeSaviezVous|HistoricalAnecdote|AnecdoteHistorique|PointOfView|PointDeVue|CriticalThinking|EspritCritique|ScientificMethod|MethodeScientifique|ScientificDebate|DebatScientifique|OpenQuestion|HistoricalFact|FaitHistorique|HistoricalEvent|EvenementHistorique|BrilliantIdea|IdeeBrillante)\s*:\s*([^:\s\]]+)\s*:\s*([\s\S]*?)\s*\]\]/gi, (match, type, id, payload) => {
    const canonicalType = categoryAMap[type.toLowerCase()] || type;
    return `<${canonicalType}>\n${payload.trim()}\n</${canonicalType}>`;
  });

  // Suffix-augmented anchors [[WIDGET:Type:ID:Topic]] are left intact here to preserve metadata for stitching fallbacks.

  // Initialize references array if not present
  if (!widgets) widgets = {};
  if (!widgets.references || !Array.isArray(widgets.references)) {
    widgets.references = [];
  }

  // Pre-process goingFurther items to construct bibliographic references if author/year are present
  if (widgets.goingFurther && Array.isArray(widgets.goingFurther.items)) {
    widgets.goingFurther.items.forEach((it: any) => {
      if (it.author || it.year) {
        const title = it.title || '';
        const author = it.author || '';
        const year = it.year || '';
        
        let bibEntry = '';
        if (author && year) {
          bibEntry = `${author}. ${year}. *${title}*.`;
        } else if (author) {
          bibEntry = `${author}. *${title}*.`;
        } else if (year) {
          bibEntry = `*${title}* (${year}).`;
        } else {
          bibEntry = `*${title}*.`;
        }
        
        // Find existing index in widgets.references
        let existingIdx = widgets.references.findIndex((r: string) => {
          const cleanR = r.toLowerCase().replace(/[*_.]/g, '').trim();
          const cleanBib = bibEntry.toLowerCase().replace(/[*_.]/g, '').trim();
          return cleanR.includes(cleanBib) || cleanBib.includes(cleanR);
        });
        
        let refNum: number;
        if (existingIdx !== -1) {
          refNum = existingIdx + 1;
        } else {
          widgets.references.push(bibEntry);
          refNum = widgets.references.length;
        }
        
        // Store refNum on the item so it renders with the badge
        it.refNum = refNum;
      }
    });
  }
  if (isTerminalEvaluation) {
    let finalEvalStr = '';
    if (widgets && widgets.finalEvaluation) {
      const finalEvalType = (widgets.finalEvaluation.type || '').toLowerCase();
      if (finalEvalType === "quiz" || finalEvalType === "qcm") {
        const fProps = widgets.finalEvaluation.props || {};
        finalEvalStr = `<Quiz durationLimit={${fProps.durationLimit || 1800}}${fProps.limit ? ` limit={${fProps.limit}}` : ''}>\n  ${(fProps.questions || []).map((q: any) => `  <Question q="${(q.q || '').replace(/"/g, '&quot;')}" explanation="${(q.explanation || '').replace(/"/g, '&quot;')}">\n    ${(q.options || []).map((o: any) => `<Option text="${(o.text || '').replace(/"/g, '&quot;')}" correct={${o.correct}} />`).join('\n    ')}\n  </Question>`).join('\n  ')}\n</Quiz>`;
      } else {
        const promptVal = (widgets.finalEvaluation.props?.prompt || "Rédigez un essai de synthèse structuré sur les concepts clés de cette leçon.").replace(/"/g, '&quot;');
        const subjectVal = (widgets.finalEvaluation.props?.subject || "Essai de synthèse").replace(/"/g, '&quot;');
        finalEvalStr = `<EssayEvaluation prompt="${promptVal}" subject="${subjectVal}" durationLimit={3600} />`;
      }
    }

    let goingFurtherItemsStr = '';
    if (widgets && widgets.goingFurther && Array.isArray(widgets.goingFurther.items) && widgets.goingFurther.items.length > 0) {
      goingFurtherItemsStr = `<GoingFurther>\n  ${widgets.goingFurther.items.map((it: any) => {
        const authorAttr = it.author ? ` author="${it.author.replace(/"/g, '&quot;')}"` : '';
        const yearAttr = it.year ? ` year="${it.year.replace(/"/g, '&quot;')}"` : '';
        const refNumAttr = it.refNum ? ` refNum={${it.refNum}}` : '';
        const urlAttr = it.url ? ` url="${it.url.replace(/"/g, '&quot;')}"` : '';
        return `<GoingFurtherItem title="${it.title.replace(/"/g, '&quot;')}" type="${it.type}"${authorAttr}${yearAttr}${refNumAttr}${urlAttr} description="${it.description.replace(/"/g, '&quot;')}" />`;
      }).join('\n  ')}\n</GoingFurther>`;
    }

    let whatsNextStr = '';
    if (widgets && widgets.whatsNext) {
      const parsedSteps = (widgets.whatsNext.steps || []).map((s: any) => ({
        title: s.title || '',
        description: s.description || '',
        slug: s.slug || '',
        subject: s.subject || '',
        level: s.level || ''
      }));
      const stepsEncoded = Buffer.from(JSON.stringify(parsedSteps)).toString('base64');
      whatsNextStr = `<WhatsNext itemsBase64="${stepsEncoded}" />`;
    }

    let combined = finalEvalStr;
    if (goingFurtherItemsStr) {
      combined += `\n\n${goingFurtherItemsStr}`;
    }
    if (whatsNextStr) {
      combined += `\n\n${whatsNextStr}`;
    }
    return combined;
  }
  if (widgets) {
    widgets.references = widgets.references || [];
    content = extractAndInjectCitations(content, widgets.references);
  }

  const prerequisitesStr = widgets.prerequisites && Array.isArray(widgets.prerequisites.items) && widgets.prerequisites.items.length > 0
    ? `<Prerequisites items={${JSON.stringify(widgets.prerequisites.items)}} />`
    : '';

  const diagnosticQuizStr = widgets.diagnosticQuiz && widgets.diagnosticQuiz.question
    ? `<DiagnosticQuiz question="${widgets.diagnosticQuiz.question.replace(/"/g, '&quot;')}" options={${JSON.stringify(widgets.diagnosticQuiz.options)}} correctIndex={${widgets.diagnosticQuiz.correctIndex}} targetSectionId="${widgets.diagnosticQuiz.targetSectionId}" sectionTitle="${widgets.diagnosticQuiz.sectionTitle.replace(/"/g, '&quot;')}" />`
    : '';

  const objectivesStr = widgets.learningObjectives && Array.isArray(widgets.learningObjectives.knowledge) && widgets.learningObjectives.knowledge.length > 0
    ? `<Objectives>
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
</Objectives>`
    : '';

  // Stitch New Pedagogical Widgets
  if (widgets.previousLessonSummary) {
    const prevSummaryStr = `<PreviousLessonSummary previousLessonTitle="${(widgets.previousLessonSummary.previousLessonTitle || '').replace(/"/g, '&quot;')}" keyTakeaways={${JSON.stringify(widgets.previousLessonSummary.keyTakeaways || [])}} cognitiveBridge="${(widgets.previousLessonSummary.cognitiveBridge || '').replace(/"/g, '&quot;')}" />`;
    content = replaceWidget(content, 'previousLessonSummary', prevSummaryStr).content;
  } else {
    content = replaceWidget(content, 'previousLessonSummary', '').content;
  }

  if (widgets.careerProfile) {
    const careerOutlook = widgets.careerProfile.careerOutlook || {};
    const careerStr = `<CareerProfile profession="${(widgets.careerProfile.profession || '').replace(/"/g, '&quot;')}" discipline="${(widgets.careerProfile.discipline || '').replace(/"/g, '&quot;')}" courseConnection="${(widgets.careerProfile.courseConnection || '').replace(/"/g, '&quot;')}" keyMissions={${JSON.stringify(widgets.careerProfile.keyMissions || [])}} careerOutlook={${JSON.stringify({ demand: careerOutlook.demand || '', typicalEmployers: careerOutlook.typicalEmployers || [], salaryIndication: careerOutlook.salaryIndication || '' })}} />`;
    content = replaceWidget(content, 'careerProfile', careerStr).content;
  } else {
    content = replaceWidget(content, 'careerProfile', '').content;
  }

  if (widgets.researchFocus) {
    const researchStr = `<ResearchFocus question="${(widgets.researchFocus.question || '').replace(/"/g, '&quot;')}" category="${(widgets.researchFocus.category || '').replace(/"/g, '&quot;')}" context="${(widgets.researchFocus.context || '').replace(/"/g, '&quot;')}" whyUnresolved="${(widgets.researchFocus.whyUnresolved || '').replace(/"/g, '&quot;')}" activeHypotheses={${JSON.stringify(widgets.researchFocus.activeHypotheses || [])}} />`;
    content = replaceWidget(content, 'researchFocus', researchStr).content;
  } else {
    content = replaceWidget(content, 'researchFocus', '').content;
  }

  if (widgets.recentNewsBridge) {
    const newsStr = `<RecentNewsBridge eventTitle="${(widgets.recentNewsBridge.eventTitle || '').replace(/"/g, '&quot;')}" date="${(widgets.recentNewsBridge.date || '').replace(/"/g, '&quot;')}" source="${(widgets.recentNewsBridge.source || '').replace(/"/g, '&quot;')}" description="${(widgets.recentNewsBridge.description || '').replace(/"/g, '&quot;')}" courseConnection="${(widgets.recentNewsBridge.courseConnection || '').replace(/"/g, '&quot;')}" whyItMatters="${(widgets.recentNewsBridge.whyItMatters || '').replace(/"/g, '&quot;')}" />`;
    content = replaceWidget(content, 'recentNewsBridge', newsStr).content;
  } else {
    content = replaceWidget(content, 'recentNewsBridge', '').content;
  }

  if (prerequisitesStr) {
    const { content: content1, replaced: repPrereq } = replaceWidget(content, 'prerequisites', prerequisitesStr);
    content = content1;
    if (!repPrereq) {
      content = `${prerequisitesStr}\n\n${content}`;
    }
  } else {
    content = replaceWidget(content, 'prerequisites', '').content;
  }

  if (diagnosticQuizStr) {
    const { content: content2, replaced: repDiag } = replaceWidget(content, 'diagnosticQuiz', diagnosticQuizStr);
    content = content2;
    if (!repDiag) {
      if (prerequisitesStr) {
        content = content.replace(prerequisitesStr, `${prerequisitesStr}\n\n${diagnosticQuizStr}`);
      } else {
        content = `${diagnosticQuizStr}\n\n${content}`;
      }
    }
  } else {
    content = replaceWidget(content, 'diagnosticQuiz', '').content;
  }

  if (objectivesStr) {
    const { content: content3, replaced: repObj } = replaceWidget(content, 'learningObjectives', objectivesStr);
    content = content3;
    if (!repObj) {
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
        if (diagnosticQuizStr) {
          content = content.replace(diagnosticQuizStr, `${diagnosticQuizStr}\n\n${objectivesStr}`);
        } else if (prerequisitesStr) {
          content = content.replace(prerequisitesStr, `${prerequisitesStr}\n\n${objectivesStr}`);
        } else {
          content = `${objectivesStr}\n\n${content}`;
        }
      }
    }
  } else {
    content = replaceWidget(content, 'learningObjectives', '').content;
  }

  widgets.interactiveComponents.forEach((comp: any) => {
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
      const mCaption = props.caption ? ` caption="${(props.caption || '').replace(/"/g, '&quot;')}"` : '';
      compStr = `<Mermaid chart={\`${props.chart || ''}\`}${mCaption} />`;
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
    } else if (comp.componentType === "Audio") {
      const aTitle = (props.title || '').replace(/"/g, '&quot;');
      const aUrl = (props.url || '').replace(/"/g, '&quot;');
      const aDur = props.duration ? ` duration="${props.duration.replace(/"/g, '&quot;')}"` : '';
      const aAi = props.aiGenerated !== undefined ? ` aiGenerated={${props.aiGenerated}}` : '';
      const aUnres = props.unresolved !== undefined ? ` unresolved={${props.unresolved}}` : '';
      const aAlt = props.alt ? ` alt="${props.alt.replace(/"/g, '&quot;')}"` : '';
      const aDesc = props.description ? ` description="${props.description.replace(/"/g, '&quot;')}"` : '';
      compStr = `<Audio title="${aTitle}" url="${aUrl}"${aDur}${aAi}${aUnres}${aAlt}${aDesc} />`;
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
    } else if (comp.componentType === "Biography") {
      const bName = (props.name || '').replace(/"/g, '&quot;');
      const bDates = props.dates ? ` dates="${props.dates.replace(/"/g, '&quot;')}"` : '';
      const bDesc = (props.description || '').replace(/"/g, '&quot;');
      const bWiki = props.wikipediaUrl ? ` wikipediaUrl="${props.wikipediaUrl.replace(/"/g, '&quot;')}"` : '';
      compStr = `<Biography name="${bName}"${bDates} description="${bDesc}"${bWiki} />`;
    } else if (comp.componentType === "Image") {
      const mDesc = (props.description || '').replace(/"/g, '&quot;');
      const mAlt = props.alt ? ` alt="${props.alt.replace(/"/g, '&quot;')}"` : '';
      const mCap = props.caption ? ` caption="${props.caption.replace(/"/g, '&quot;')}"` : '';
      const mTitle = props.title ? ` title="${props.title.replace(/"/g, '&quot;')}"` : '';
      const mSrc = props.src ? ` src="${props.src.replace(/"/g, '&quot;')}"` : '';
      const mFallbackUrl = props.fallbackUrl ? ` fallbackUrl="${props.fallbackUrl.replace(/"/g, '&quot;')}"` : '';
      const mUnresolved = props.unresolved !== undefined ? ` unresolved={${props.unresolved}}` : '';
      const mIsIllustration = props.isIllustration !== undefined ? ` isIllustration={${props.isIllustration}}` : '';
      compStr = `<Image description="${mDesc}"${mAlt}${mCap}${mTitle}${mSrc}${mFallbackUrl}${mUnresolved}${mIsIllustration} />`;
    } else if (comp.componentType === "Citation") {
      const cQuote = (props.quote || '').replace(/"/g, '&quot;');
      const cAuthor = (props.author || '').replace(/"/g, '&quot;');
      const cSource = (props.source || '').replace(/"/g, '&quot;');
      const cYear = props.year ? ` year="${props.year.replace(/"/g, '&quot;')}"` : '';
      const cOrig = props.original ? ` original="${props.original.replace(/"/g, '&quot;')}"` : '';
      const cComm = props.commentary ? ` commentary="${props.commentary.replace(/"/g, '&quot;')}"` : '';
      compStr = `<Citation quote="${cQuote}" author="${cAuthor}" source="${cSource}"${cYear}${cOrig}${cComm} />`;
    } else if (comp.componentType === "Epistemology") {
      const eTitle = (props.title || 'Critical Perspective').replace(/"/g, '&quot;');
      const eContent = props.content || '';
      compStr = `<Epistemology title="${eTitle}">\n${eContent}\n</Epistemology>`;
    } else if (comp.componentType === "MatchingEvaluation" || comp.componentType === "AssociationCorrespondance") {
      const titleAttr = props.title ? ` title="${props.title.replace(/"/g, '&quot;')}"` : '';
      const pairsAttr = (props.pairs || '').replace(/"/g, '&quot;');
      const explAttr = props.explanation ? ` explanation="${props.explanation.replace(/"/g, '&quot;')}"` : '';
      compStr = `<MatchingEvaluation pairs="${pairsAttr}"${titleAttr}${explAttr} />`;
    } else if (comp.componentType === "ReorderEvaluation" || comp.componentType === "ReordonnerItems") {
      const titleAttr = props.title ? ` title="${props.title.replace(/"/g, '&quot;')}"` : '';
      const itemsAttr = (props.items || '').replace(/"/g, '&quot;');
      const explAttr = props.explanation ? ` explanation="${props.explanation.replace(/"/g, '&quot;')}"` : '';
      compStr = `<ReorderEvaluation items="${itemsAttr}"${titleAttr}${explAttr} />`;
    } else if (comp.componentType === "Quiz") {
      const qProps = props || {};
      const qLimit = qProps.limit ? ` limit={${qProps.limit}}` : '';
      const qDuration = qProps.durationLimit ? ` durationLimit={${qProps.durationLimit}}` : '';
      const qMode = qProps.mode ? ` mode="${qProps.mode}"` : '';
      const qQDuration = qProps.questionDurationLimit ? ` questionDurationLimit={${qProps.questionDurationLimit}}` : '';
      const questionsMarkup = (qProps.questions || []).map((q: any) => {
        const qText = (q.q || '').replace(/"/g, '&quot;');
        const qExpl = (q.explanation || '').replace(/"/g, '&quot;');
        const optionsMarkup = (q.options || []).map((o: any) => {
          return `<Option text="${(o.text || '').replace(/"/g, '&quot;')}" correct={${o.correct}} />`;
        }).join('\n    ');
        return `  <Question q="${qText}" explanation="${qExpl}">\n    ${optionsMarkup}\n  </Question>`;
      }).join('\n  ');
      compStr = `<Quiz${qLimit}${qDuration}${qMode}${qQDuration}>\n  ${questionsMarkup}\n</Quiz>`;
    } else if (comp.componentType === "SolvedExercise" || comp.componentType === "ExerciceResolut") {
      const sTitle = (props.title || '').replace(/"/g, '&quot;');
      const sProblem = props.problem || '';
      const sSolution = props.solution || '';
      compStr = `<SolvedExercise title="${sTitle}">\n${sProblem}\n<Solution>\n${sSolution}\n</Solution>\n</SolvedExercise>`;
    } else if (comp.componentType === "UnsolvedExercise" || comp.componentType === "ExerciceACompleter") {
      const uTitle = (props.title || '').replace(/"/g, '&quot;');
      const uProblem = props.problem || '';
      const uCorrectAnswer = (props.correctAnswer || '').replace(/"/g, '&quot;');
      compStr = `<UnsolvedExercise title="${uTitle}" correctAnswer="${uCorrectAnswer}">\n${uProblem}\n</UnsolvedExercise>`;
    } else if (comp.componentType === "FillInBlanks" || comp.componentType === "TextesATrous") {
      const fSentence = (props.sentence || '').replace(/"/g, '&quot;');
      const fAnswer = (props.answer || '').replace(/"/g, '&quot;');
      compStr = `<FillInBlanks sentence="${fSentence}" answer="${fAnswer}" />`;
    } else if (comp.componentType === "Mermaid") {
      const mChart = props.chart || '';
      compStr = `<Mermaid>\n${mChart}\n</Mermaid>`;
    } else {
      const props = comp.props || {};
      const attrStrings: string[] = [];
      Object.entries(props).forEach(([key, val]) => {
        if (key === 'description' || key === 'commentary' || key === 'definition') {
          attrStrings.push(`${key}="${String(val).replace(/"/g, '&quot;')}"`);
        } else if (typeof val === 'string') {
          attrStrings.push(`${key}="${val.replace(/"/g, '&quot;')}"`);
        } else if (typeof val === 'boolean' || typeof val === 'number') {
          attrStrings.push(`${key}={${val}}`);
        }
      });
      const childrenVal = props.name || props.title || props.term || props.word || comp.id;
      compStr = `<${comp.componentType} id="${comp.id}" ${attrStrings.join(' ')}>${childrenVal}</${comp.componentType}>`;
    }

    const { content: contentComp, replaced: repComp } = replaceWidget(content, comp.id, compStr);
    content = contentComp;
    if (!repComp) {
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
        const summaryRegex = /\[\[\s*WIDGET\s*:\s*conclusionSummary\s*\]\]/i;
        if (summaryRegex.test(content)) {
          content = content.replace(summaryRegex, `${compStr}\n\n[[WIDGET:conclusionSummary]]`);
        } else {
          content = content + `\n\n${compStr}`;
        }
      }
    }
  });

  // Render GoingFurther suggested readings widget (no url tag at this point)
  let goingFurtherItemsStr = '';
  if (widgets.goingFurther && Array.isArray(widgets.goingFurther.items) && widgets.goingFurther.items.length > 0) {
    goingFurtherItemsStr = `<GoingFurther>\n  ${widgets.goingFurther.items.map((it: any) => {
      const authorAttr = it.author ? ` author="${it.author.replace(/"/g, '&quot;')}"` : '';
      const yearAttr = it.year ? ` year="${it.year.replace(/"/g, '&quot;')}"` : '';
      const refNumAttr = it.refNum ? ` refNum={${it.refNum}}` : '';
      const urlAttr = it.url ? ` url="${it.url.replace(/"/g, '&quot;')}"` : '';
      return `<GoingFurtherItem title="${it.title.replace(/"/g, '&quot;')}" type="${it.type}"${authorAttr}${yearAttr}${refNumAttr}${urlAttr} description="${it.description.replace(/"/g, '&quot;')}" />`;
    }).join('\n  ')}\n</GoingFurther>`;
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

  const summaryStr = `<Summary items={${JSON.stringify(widgets.conclusionSummary.items)}} />`;

  // Clean up/strip any existing widgets or anchors first to prevent duplicates or out-of-order rendering
  content = content
    .replace(/\[\[\s*WIDGET\s*:\s*conclusionSummary\s*\]\]/gi, '')
    .replace(/\[\[\s*WIDGET\s*:\s*whatsNext\s*\]\]/gi, '')
    .replace(/\[\[\s*WIDGET\s*:\s*goingFurther\s*\]\]/gi, '')
    .replace(/<Summary\b[^>]*>(?:[\s\S]*?<\/Summary>)?/gi, '')
    .replace(/<WhatsNext\b[^>]*>(?:[\s\S]*?<\/WhatsNext>)?/gi, '')
    .replace(/<GoingFurther\b[^>]*>[\s\S]*?<\/GoingFurther>/gi, '');

  const conclusionRegex = /^(#{2,3}\s*(?:Conclusion|Synthèse|Discussion|Synthèse\s*&\s*Discussion|Synthèse\s*&amp;\s*Discussion|Summary\s*&\s*Conclusion|Summary|Fazit|结论)[^\n]*)/mi;
  const conclusionMatch = content.match(conclusionRegex);
  
  if (conclusionMatch) {
    const headerText = conclusionMatch[0];
    const headerIdx = conclusionMatch.index!;
    
    // Find next heading
    const postHeader = content.substring(headerIdx + headerText.length);
    const nextHeadingRegex = /^#{2,3}\s+/m;
    const nextHeadingMatch = postHeader.match(nextHeadingRegex);
    
    let sectionEnd = content.length;
    if (nextHeadingMatch) {
      sectionEnd = headerIdx + headerText.length + nextHeadingMatch.index!;
    }
    
    const prose = content.substring(headerIdx + headerText.length, sectionEnd).trim();
    
    const rebuiltConclusion = `${headerText}\n\n${prose ? prose + '\n\n' : ''}${summaryStr}${whatsNextStr ? '\n\n' + whatsNextStr : ''}${goingFurtherItemsStr ? '\n\n' + goingFurtherItemsStr : ''}`;
    content = content.substring(0, headerIdx) + rebuiltConclusion + content.substring(sectionEnd);
  } else {
    content = content.trim() + `\n\n## Conclusion\n\n${summaryStr}${whatsNextStr ? '\n\n' + whatsNextStr : ''}${goingFurtherItemsStr ? '\n\n' + goingFurtherItemsStr : ''}`;
  }

  let finalEvalStr = '';
  if (widgets.finalEvaluation) {
    const finalEvalType = (widgets.finalEvaluation.type || '').toLowerCase();
    if (finalEvalType === "quiz" || finalEvalType === "qcm") {
      const fProps = widgets.finalEvaluation.props || {};
      finalEvalStr = `<Quiz durationLimit={${fProps.durationLimit || 1800}}${fProps.limit ? ` limit={${fProps.limit}}` : ''}>\n  ${(fProps.questions || []).map((q: any) => `  <Question q="${(q.q || '').replace(/"/g, '&quot;')}" explanation="${(q.explanation || '').replace(/"/g, '&quot;')}">\n    ${(q.options || []).map((o: any) => `<Option text="${(o.text || '').replace(/"/g, '&quot;')}" correct={${o.correct}} />`).join('\n    ')}\n  </Question>`).join('\n  ')}\n</Quiz>`;
    } else {
      const promptVal = (widgets.finalEvaluation.props?.prompt || "Rédigez un essai de synthèse structuré sur les concepts clés de cette leçon.").replace(/"/g, '&quot;');
      const subjectVal = (widgets.finalEvaluation.props?.subject || "Essai de synthèse").replace(/"/g, '&quot;');
      finalEvalStr = `<EssayEvaluation prompt="${promptVal}" subject="${subjectVal}" durationLimit={3600} />`;
    }
  }

  // Remove any existing finalEvaluation anchors
  content = content.replace(/\[\[\s*WIDGET\s*:\s*finalEvaluation\s*\]\]/gi, '');

  const contentLowerTmp = content.toLowerCase();
  let langKey = 'en';
  if (contentLowerTmp.includes('présentation') || contentLowerTmp.includes('introduction') || contentLowerTmp.includes('références') || contentLowerTmp.includes('glossaire') || contentLowerTmp.includes('conclusion') || contentLowerTmp.includes('synthèse')) {
    langKey = 'fr';
  } else if (contentLowerTmp.includes('referencias') || contentLowerTmp.includes('glosario') || contentLowerTmp.includes('conclusión')) {
    langKey = 'es';
  } else if (contentLowerTmp.includes('referenzen') || contentLowerTmp.includes('glossar') || contentLowerTmp.includes('fazit')) {
    langKey = 'de';
  } else if (contentLowerTmp.includes('参考文献') || contentLowerTmp.includes('词汇表') || contentLowerTmp.includes('结论')) {
    langKey = 'zh';
  }

  const finalEvalHeadings: Record<string, string> = {
    fr: '## Évaluation Finale',
    en: '## Final Evaluation',
    es: '## Evaluación Final',
    de: '## Abschlussbewertung',
    zh: '## 最终评估'
  };

  const selfEvalHeadings: Record<string, string> = {
    fr: '## Auto-évaluation',
    en: '## Self-Evaluation',
    es: '## Autoevaluación',
    de: '## Selbstbewertung',
    zh: '## 自我评估'
  };

  if (finalEvalStr) {
    const evalHeading = isTerminalEvaluation ? finalEvalHeadings[langKey] : selfEvalHeadings[langKey];
    const evalRegex = /^(#{2,3}\s*(?:Évaluation|Evaluation|Évaluation\s*Finale|Evaluation\s*Finale|Summative\s*Evaluation|Final\s*Evaluation|Quiz|Final\s*Quiz|Assessment|Abschlussbewertung|Evaluación|Evaluación\s*Final|最终评估|测试|测验)[^\n]*)/mi;
    const evalMatch = content.match(evalRegex);

    if (evalMatch) {
      const headerText = evalMatch[0];
      const headerIdx = evalMatch.index!;
      
      // Find next heading
      const postHeader = content.substring(headerIdx + headerText.length);
      const nextHeadingRegex = /^#{2,3}\s+/m;
      const nextHeadingMatch = postHeader.match(nextHeadingRegex);
      
      let sectionEnd = content.length;
      if (nextHeadingMatch) {
        sectionEnd = headerIdx + headerText.length + nextHeadingMatch.index!;
      }
      
      const prose = content.substring(headerIdx + headerText.length, sectionEnd).trim();
      const rebuiltSection = `${evalHeading}\n\n${prose ? prose + '\n\n' : ''}${finalEvalStr}`;
      content = content.substring(0, headerIdx) + rebuiltSection + content.substring(sectionEnd);
    } else {
      content = content.trim() + `\n\n${evalHeading}\n\n${finalEvalStr}`;
    }
  } else {
    // Remove any existing finalEvaluation anchors or sections
    const evalRegex = /^(#{2,3}\s*(?:Évaluation|Evaluation|Évaluation\s*Finale|Evaluation\s*Finale|Summative\s*Evaluation|Final\s*Evaluation|Quiz|Final\s*Quiz|Assessment|Abschlussbewertung|Evaluación|Evaluación\s*Final|最终评估|测试|测验)[^\n]*)/mi;
    content = content.replace(evalRegex, '');
  }

  // Strip markdown links ([text](url)) from glossary definitions to remove visible [Wikipedia] brackets
  const cleanGlossaryDef = (def: string): string => (def || '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')  // [text](url) -> text
    .replace(/\[\[([^\]]+)\]\]/g, '$1')          // [[text]] -> text
    .trim();
  const contentLower = content.toLowerCase();
  let glossaryHeading = '### Glossaire';
  let refHeading = '### Références';

  if (contentLower.includes('references') || contentLower.includes('glossary') || contentLower.includes('summary')) {
    glossaryHeading = '### Glossary';
    refHeading = '### References';
  } else if (contentLower.includes('referencias') || contentLower.includes('glosario') || contentLower.includes('conclusión')) {
    glossaryHeading = '### Glosario';
    refHeading = '### Referencias';
  } else if (contentLower.includes('referenzen') || contentLower.includes('glossar') || contentLower.includes('fazit')) {
    glossaryHeading = '### Glossar';
    refHeading = '### Referenzen';
  } else if (contentLower.includes('参考文献') || contentLower.includes('词汇表') || contentLower.includes('结论')) {
    glossaryHeading = '### 词汇表';
    refHeading = '### 参考文献';
  }

  // Strip any existing glossary and references headings to prevent duplication
  const glossaireRegex = /^#{2,3}\s*(?:Glossaire|Glossary|Lexique|Glosario|Glossar|词汇表)[^\n]*/gmi;
  const referencesRegex = /^#{2,3}\s*(?:Références|References|Réf\.|Réf|Bibliography|Referencias|Referenzen|参考文献)[^\n]*/gmi;
  
  content = content
    .replace(glossaireRegex, '')
    .replace(referencesRegex, '');

  if (Array.isArray(widgets.glossary) && widgets.glossary.length > 0) {
    const glossaryStr = `\n\n\n${glossaryHeading}\n\n${widgets.glossary.map((g: any) => `* **${g.term}** : ${cleanGlossaryDef(g.definition)}`).join('\n')}`;
    content = content.trim() + glossaryStr;
  }

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

  if (referencesList.length > 0) {
    const referencesStr = `\n\n\n${refHeading}\n\n${referencesList.join('\n')}`;
    content = content.trim() + referencesStr;
  }

  // Replace unresolved suffix-augmented inline interactive elements (RealPerson, ConceptLink, Glossary) with fallback tags
  content = content.replace(/\[\[\s*WIDGET\s*:\s*(RealPerson|HistoricalPerson|ConceptLink|Glossary|Biography|Image|Video|Audio|Mermaid|Quiz|SolvedExercise|UnsolvedExercise|FillInBlanks)\s*:\s*([^:\s\]]+)\s*(?::\s*([^\]]*?))?\s*\]\]/gi, (match, type, id, topic) => {
    const displayVal = topic ? topic.trim() : id.replace(/_/g, ' ');
    const cleanDisplay = displayVal.replace(/"/g, '&quot;');
    return `<${type} id="${id}" name="${cleanDisplay}" term="${cleanDisplay}">${displayVal}</${type}>`;
  });

  // Clean up any remaining unresolved [[WIDGET:...]] placeholders
  content = content.replace(/\[\[\s*WIDGET\s*:.*?\]\]+/gi, '');

  // Clean up empty self-closing InteractiveDiagram components without hotspotsBase64
  content = content.replace(/<InteractiveDiagram(?![\s\S]*?hotspotsBase64)[^>]*?\/>/gi, '');

  // Clean up generic/empty developer placeholders at the end of lessons
  content = content.replace(/<FunctionPlotter\s+fn=["']x\^2["']\s*\/?>/gi, '');

  // Nested function to sequentially renumber figures and diagrams in order of appearance
  function renumberFiguresAndCaptions(text: string, lang: string): string {
    let counter = 1;
    const tagRegex = /<(Image|CustomFigure|Mermaid)\b([\s\S]*?)\/?>/gi;
    
    return text.replace(tagRegex, (tagMatch, tagName, attrsStr) => {
      const captionRegex = /\bcaption=(?:"([^"]*)"|'([^']*)'|\{([\s\S]*?)\})/i;
      const captionMatch = attrsStr.match(captionRegex);
      
      let captionText = '';
      let matchedDelimiter = '"';
      
      if (captionMatch) {
        captionText = captionMatch[1] || captionMatch[2] || captionMatch[3] || '';
        if (captionMatch[2] !== undefined) matchedDelimiter = "'";
        if (captionMatch[3] !== undefined) matchedDelimiter = '{';
      }
      
      // If caption is empty/missing, look for description
      if (!captionText.trim()) {
        const descRegex = /\bdescription=(?:"([^"]*)"|'([^']*)'|\{([\s\S]*?)\})/i;
        const descMatch = attrsStr.match(descRegex);
        if (descMatch) {
          captionText = descMatch[1] || descMatch[2] || descMatch[3] || '';
        }
      }
      
      let cleanCaption = captionText.trim();
      const prefixRegex = /^(?:figure|fig|illustration|abbildung|abb|image|custom\s*figure)\s*(?:\d+(?:\.\d+)*|[a-z])?\s*(?:[:：\-–—]\s*)*/i;
      cleanCaption = cleanCaption.replace(prefixRegex, '').trim();
      
      let prefix = `Figure ${counter} : `;
      if (lang === 'en') {
        prefix = `Figure ${counter}: `;
      } else if (lang === 'de') {
        prefix = `Abbildung ${counter}: `;
      } else if (lang === 'es') {
        prefix = `Figura ${counter}: `;
      } else if (lang === 'zh') {
        prefix = `图 ${counter}: `;
      }
      
      const newCaptionText = `${prefix}${cleanCaption}`;
      counter++;
      
      let newAttrsStr = attrsStr;
      if (captionMatch) {
        const fullAttrMatch = captionMatch[0];
        let newAttrStr = '';
        if (matchedDelimiter === '{') {
          newAttrStr = `caption={\`${newCaptionText.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`}`;
        } else {
          newAttrStr = `caption=${matchedDelimiter}${newCaptionText.replace(new RegExp(matchedDelimiter, 'g'), '\\' + matchedDelimiter)}${matchedDelimiter}`;
        }
        newAttrsStr = attrsStr.replace(fullAttrMatch, newAttrStr);
      } else {
        newAttrsStr = ` caption="${newCaptionText}"` + attrsStr;
      }
      
      return `<${tagName}${newAttrsStr}/>`;
    });
  }

  // Renumber figures sequentially
  content = renumberFiguresAndCaptions(content, langKey);

  // Clean up any trailing unbalanced closing brackets ']' at the end of lines
  content = content.split('\n').map(line => {
    let cleanLine = line;
    const openCount = (cleanLine.match(/\[/g) || []).length;
    const closeCount = (cleanLine.match(/\]/g) || []).length;
    if (closeCount > openCount) {
      while (cleanLine.trim().endsWith(']') && (cleanLine.match(/\]/g) || []).length > (cleanLine.match(/\[/g) || []).length) {
        cleanLine = cleanLine.trim().slice(0, -1);
      }
    }
    return cleanLine;
  }).join('\n');

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
          contents: [{ parts: [{ text: compressPromptText(userPrompt) }] }],
          systemInstruction: { parts: [{ text: compressPromptText(systemInstruction) }] },
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
  const normDiscipline = discipline.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  for (const [id, meta] of Object.entries(dbCatalog)) {
    const disciplines: string[] = meta.disciplines || [];
    const hasAll = disciplines.some(d => d.toLowerCase() === 'all disciplines');
    if (hasAll) {
      filtered[id] = meta;
      continue;
    }
    
    const isMatch = disciplines.some(d => {
      const normD = d.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
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

  await initializeConstraints();
  await appendTaskLog(`[CONSTRAINTS] Loaded academic level constraints from database.`);

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
Your mission is to design the structure, lesson titles, and cognitive strategy of the course titled "${correctedCourseName}" for the level "${getDescriptiveLevelForPrompt(level)}". You do not write the course content; you construct its pure, highly-adapted computational and educational backbone.

An anatomy course is not structured like an algebraic topology or political philosophy course. You MUST adapt the skeleton of the course to the epistemological DNA of the discipline, the target audience's age (from Primary School to Bachelor/University Year 3), and the course's hourly volume.

---

# STEP 1: PARAMETERS AND COGNITIVE DNA
The following parameters are fixed *a priori* and must guide your architecture:
- **Course Title:** "${correctedCourseName}"
- **Target Level:** "${getDescriptiveLevelForPrompt(level)}"
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
   * **Grade-Level Tailoring Matrix for Interactive Sandboxes:**
     Interactive simulator/visualizer suggestions and cognitive artifacts must align to the target grade:
     - Middle School (Primary/Maternelle): Focus on high visual emphasis, gamified challenges, simplified sliders, zero complex algebra symbols. Use visual metaphors (e.g., sharing pizza slices for fractions, balancing scales for basic equations, coloring elements).
     - High School: Balanced representation of equations alongside visual models. Interactive variables mapping to standard physics/math formulas. Use presets aligned with official curricula (e.g., cell division phases, basic Cartesian graphs, ideal gas law, Nernst potentials).
     - University: Full scientific controls, rigorous mathematical formulas, multiple overlays, analytical grids, data export (JSON/CSV). Use sandbox exploration of full wave functions, GHK multi-ion equations, multi-variable simulations, derivative/integral solvers.
   * **Scope & Length Rules:**
     * *Primary School (foundation_1 & foundation_2):* Proportional to low hourly volume (e.g. 1h-3h). Narrative, metaphorical, and inductive approach. Maximum of 3 short items in total (including the Implicit Introduction and Terminal Evaluation).
     * *Middle & High School (secondary_1 & secondary_2):* Proportional to medium hourly volume (e.g. 5h-10h). Gradual transition to formalization, increasing rigor. 4 to 6 distinct items in total.

2. **Higher Education / University (L1 to M2 / from beginner to expert):**
   * Proportional to high hourly volume (e.g. 15h-30h or more).
   * **Grade-Level Tailoring Matrix for Interactive Sandboxes:**
     Propose high-fidelity, research-grade sandbox controls, rigorous mathematical formulas, analytical grids, and multi-variable simulations (e.g., Schrödinger equation laboratory, Hodgkin-Huxley membrane dynamics, multi-function comparison plotters).
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

    const courseSlugForSyllabus = cleanPathSegment(correctedCourseName);
    const localSyllabusPath = path.join(process.cwd(), 'drafts_revisions', `final_stage0_syllabus_${courseSlugForSyllabus}.json`);
    const localDraftSyllabusPath = path.join(process.cwd(), 'drafts_revisions', `draft_stage0_syllabus_${courseSlugForSyllabus}.json`);
    if (fs.existsSync(localSyllabusPath)) {
      await appendTaskLog(`[AI GENERATOR] Found local syllabus file ${localSyllabusPath}. Reusing to preserve customized structure.`);
      parsedSyllabus = JSON.parse(fs.readFileSync(localSyllabusPath, 'utf8'));
    } else if (fs.existsSync(localDraftSyllabusPath)) {
      await appendTaskLog(`[AI GENERATOR] Found local draft syllabus file ${localDraftSyllabusPath}. Reusing to preserve customized structure.`);
      parsedSyllabus = JSON.parse(fs.readFileSync(localDraftSyllabusPath, 'utf8'));
    } else if (taskId && extra && extra.syllabus) {
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

  let syllabusRejections = 0;
  let syllabusAttempts = 1;
  if (parsedSyllabus) {
    lessonsList = Array.isArray(parsedSyllabus) ? parsedSyllabus : (parsedSyllabus.lessons || []);
    courseContext = Array.isArray(parsedSyllabus) ? {} : (parsedSyllabus.courseContext || {});
  } else {
    try {
      let rawJson = '';
      let success = false;
      let syllabusApproved = false;
      let syllabusIteration = 0;
      const maxSyllabusIterations = 3;
      let currentSyllabusPrompt = promptSyllabus;

      while (!syllabusApproved && syllabusIteration < maxSyllabusIterations) {
        syllabusIteration++;
        syllabusAttempts = syllabusIteration;
        await appendTaskLog(`[AI GENERATOR] Syllabus generation iteration #${syllabusIteration}...`);
        
        let attemptJson = '';
        let attemptSuccess = false;

        if (isVertexConfigured()) {
          console.log(`[AI GENERATOR] Generating syllabus iteration #${syllabusIteration} for "${courseName}" via Vertex AI (${TASK_MODELS['course_generation']})...`);
          try {
            const res = await callVertexAI({
              task: 'course_generation',
              contents: [{ role: 'user', parts: [{ text: currentSyllabusPrompt }] }],
              generationConfig: {
                temperature: 0.1,
                responseMimeType: "application/json",
                responseSchema: syllabusSchema
              }
            });

            if (res && res.ok) {
              const jsonRes = await safeResponseJson(res, 'Vertex course syllabus generation');
              attemptJson = jsonRes.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
              attemptSuccess = true;
            }
          } catch (err) {
            console.warn(`[AI GENERATOR] Vertex AI syllabus generation exception.`, err);
          }
        }

        if (!attemptSuccess && apiKey) {
          console.log(`[AI GENERATOR] Generating syllabus iteration #${syllabusIteration} for "${courseName}" via AI Studio fallback (gemini-2.5-flash)...`);
          const startTime = Date.now();
          try {
            const compressedSyllabus = compressPromptText(currentSyllabusPrompt);
            const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ parts: [{ text: compressedSyllabus }] }],
                generationConfig: {
                  temperature: 0.1,
                  responseMimeType: "application/json",
                  responseSchema: syllabusSchema
                }
              })
            });
            if (res.ok) {
              const jsonRes = await safeResponseJson(res, 'AI Studio syllabus generation fallback');
              attemptJson = jsonRes.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
              attemptSuccess = true;

              const durationMs = Date.now() - startTime;
              const usage = jsonRes.usageMetadata || {};
              const promptTokens = usage.promptTokenCount || 0;
              const candidatesTokens = usage.candidatesTokenCount || usage.candidateTokenCount || 0;
              await recordMetrics('course_generation', 'gemini-2.5-flash', durationMs, promptTokens, candidatesTokens, compressedSyllabus);
            } else {
              const errText = await res.text();
              console.error(`[AI GENERATOR] AI Studio syllabus call failed (${res.status}):`, errText);
            }
          } catch (err) {
            console.error(`[AI GENERATOR] AI Studio fetch exception:`, err);
          }
        }

        if (!attemptSuccess || !attemptJson) {
          throw new Error(`[AI GENERATOR CRITICAL ERROR] AI model failed to generate syllabus for course "${correctedCourseName}". Syllabus raw JSON is empty.`);
        }

        const cleanedJson = attemptJson.replace(/```json/g, '').replace(/```/g, '').trim();
        let currentParsedSyllabus = null;
        try {
          currentParsedSyllabus = safeJsonParse(cleanedJson, 'generateCourseContent (Syllabus)');
        } catch (e) {
          await appendTaskLog(`[AI GENERATOR] Syllabus JSON syntax invalid: ${String(e)}. Retrying...`);
          continue;
        }

        // Run syllabus critique
        await appendTaskLog(`[AI GENERATOR] Running Critique on generated syllabus (Iteration #${syllabusIteration})...`);
        const syllabusCriticPrompt = `You are the Syllabus Critique Agent (Agent 1). Your job is to review the syllabus generated by the Pedagogical Architect.
Verify that:
1. The syllabus is completely aligned with the course name: "${correctedCourseName}" and level: "${getDescriptiveLevelForPrompt(level)}".
2. There are no redundant lessons or generic filler lessons.
3. The progression is logical and pedagogically sound.
4. The output matches the syllabusSchema structure.

### GENERATED SYLLABUS:
${JSON.stringify(currentParsedSyllabus, null, 2)}

You must return ONLY a valid JSON object matching this schema:
\`\`\`json
{
  "approved": boolean,
  "critique": "detailed critique explaining what to fix, or empty if approved"
}
\`\`\`
[REJECT-ONLY REPORTING MANDATE]
If the syllabus is approved, you MUST set approved: true, and critique: "". You must ONLY report failures/issues. Do not write any explanations or critique if the syllabus is approved.`;

        let critiqueJsonStr = '';
        let critiqueSuccess = false;

        if (isVertexConfigured()) {
          try {
            const res = await callVertexAI({
              task: 'course_generation',
              contents: [{ role: 'user', parts: [{ text: syllabusCriticPrompt }] }],
              generationConfig: {
                temperature: 0.1,
                responseMimeType: "application/json",
                responseSchema: syllabusAuditSchema
              }
            });
            if (res && res.ok) {
              const jsonRes = await safeResponseJson(res, 'Vertex syllabus critique');
              critiqueJsonStr = jsonRes.candidates?.[0]?.content?.parts?.[0]?.text || '';
              critiqueSuccess = true;
            }
          } catch (err) {
            console.warn(`[AI GENERATOR] Vertex AI syllabus critique exception.`, err);
          }
        }

        if (!critiqueSuccess && apiKey) {
          try {
            const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ parts: [{ text: compressPromptText(syllabusCriticPrompt) }] }],
                generationConfig: {
                  temperature: 0.1,
                  responseMimeType: "application/json",
                  responseSchema: syllabusAuditSchema
                }
              })
            });
            if (res.ok) {
              const jsonRes = await safeResponseJson(res, 'AI Studio syllabus critique');
              critiqueJsonStr = jsonRes.candidates?.[0]?.content?.parts?.[0]?.text || '';
              critiqueSuccess = true;
            }
          } catch (err) {
            console.error(`[AI GENERATOR] AI Studio critique fetch exception:`, err);
          }
        }

        saveDraftRevision(`prompt_stage0_syllabus_critique_${courseSlugForSyllabus}_iter${syllabusIteration}.md`, syllabusCriticPrompt);
        if (critiqueSuccess && critiqueJsonStr) {
          saveDraftRevision(`critique_stage0_syllabus_${courseSlugForSyllabus}_iter${syllabusIteration}.json`, critiqueJsonStr);
        }

        let critiqueObj = { approved: true, critique: '' };
        if (critiqueSuccess && critiqueJsonStr) {
          try {
            critiqueObj = safeJsonParse(critiqueJsonStr.replace(/```json/g, '').replace(/```/g, '').trim(), 'Syllabus Critique Parsing');
          } catch (e) {
            console.warn(`[AI GENERATOR] Failed to parse syllabus critique JSON:`, e);
          }
        }

        if (critiqueObj.approved) {
          await appendTaskLog(`[AI GENERATOR] Syllabus approved by Critique Agent on iteration #${syllabusIteration}!`);
          rawJson = attemptJson;
          parsedSyllabus = currentParsedSyllabus;
          syllabusApproved = true;
        } else {
          syllabusRejections++;
          await appendTaskLog(`[AI GENERATOR WARNING] Syllabus REJECTED by Critique Agent (rejection #${syllabusRejections}). Critique: "${critiqueObj.critique}". Retrying generation...`);
          currentSyllabusPrompt = `${promptSyllabus}
          
=============================================================================
🚨 SYLLABUS CRITIQUE FROM PREVIOUS ATTEMPT 🚨
Your previous syllabus draft was REJECTED by the Critique Agent. You MUST correct the following issues in this new generation:
"${critiqueObj.critique}"
=============================================================================`;
        }
      }

      if (!parsedSyllabus) {
        throw new Error(`[AI GENERATOR CRITICAL ERROR] Syllabus failed critique validation after ${maxSyllabusIterations} iterations.`);
      }

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
  } else if (process.env.LIMIT_LESSONS) {
    const limit = parseInt(process.env.LIMIT_LESSONS, 10);
    if (!isNaN(limit) && limit > 0) {
      lessonsList = lessonsList.slice(0, limit);
      console.log(`[LIMIT_LESSONS] Sliced lessons list to generate only the first ${limit} lessons.`);
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

    const usedDatabaseWidgetIds = new Set<string>();
    const usedMediaRegistry: Array<{ type: string; description: string; title?: string; caption?: string }> = [];

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

      const lessonStats: any = {
        courseName: correctedCourseName,
        lessonTitle: item.title,
        lessonSlug: item.slug,
        level: level,
        language: targetLang,
        startTime: Date.now(),
        endTime: 0,
        durationSeconds: 0,
        syllabusAttempts: syllabusAttempts,
        syllabusRejections: syllabusRejections,
        narrativeAttempts: 0,
        narrativeRejections: 0,
        narrativeGlobalRewrites: 0,
        narrativeLocalRepairs: 0,
        narrativeBlockAttempts: [] as Array<{ sections: string[]; attempts: number; approved: boolean }>,
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
      let lastCallFinishReason = '';

      // Helper to call Vertex AI or fallback Gemini 2.5 Flash
      const callAIEngine = async (
        promptText: string,
        schema?: any,
        temperature: number = 0.2,
        frequencyPenalty?: number,
        topP?: number,
        isJsonMode: boolean = false,
        task: keyof typeof TASK_MODELS = 'course_generation'
      ): Promise<string> => {
        let resultText = '';
        let success = false;
        let lastError = 'N/A';
        lastCallFinishReason = '';

        const generationConfig: any = { 
          temperature,
          maxOutputTokens: 8192
        };
        if (frequencyPenalty !== undefined) {
          generationConfig.frequencyPenalty = frequencyPenalty;
        }
        if (topP !== undefined) {
          generationConfig.topP = topP;
        }
        if (schema) {
          generationConfig.responseMimeType = "application/json";
          generationConfig.responseSchema = schema;
        } else if (isJsonMode || promptText.toLowerCase().includes('json') || promptText.toLowerCase().includes('schema')) {
          generationConfig.responseMimeType = "application/json";
        }

        if (isVertexConfigured()) {
          try {
            const res = await callVertexAI({
              task,
              contents: [{ role: 'user', parts: [{ text: promptText }] }],
              generationConfig
            });
            if (res && res.ok) {
              const resJson = await res.json();
              resultText = resJson.candidates?.[0]?.content?.parts?.[0]?.text || '';
              success = true;

              const candidate = resJson.candidates?.[0] || {};
              const finishReason = candidate.finishReason || 'UNKNOWN';
              lastCallFinishReason = finishReason;

              const usage = resJson.usageMetadata || {};
              const promptTokenCount = usage.promptTokenCount || 0;
              const candidateTokenCount = usage.candidatesTokenCount || usage.candidateTokenCount || 0;

              lessonStats.tokenMetrics.promptTokens += promptTokenCount;
              lessonStats.tokenMetrics.candidatesTokens += candidateTokenCount;

              const charCount = resultText.length;
              const wordCount = resultText.trim().split(/\s+/).filter(Boolean).length;
              const ratio = wordCount > 0 ? (candidateTokenCount / wordCount).toFixed(2) : '0';

              await appendTaskLog(`[AI ENGINE - VERTEX] Response status: finishReason="${finishReason}", characters=${charCount}, words=${wordCount}, tokens=${candidateTokenCount} (promptTokens=${promptTokenCount}). Tokens-to-Words ratio = ${ratio}.`);
              if (finishReason === 'MAX_TOKENS') {
                await appendTaskLog(`[AI ENGINE - WARNING] Vertex AI response was TRUNCATED because it reached output limit (maxOutputTokens=8192).`);
              }
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
            const compressedPrompt = compressPromptText(promptText);
            const bodyPayload: any = {
              contents: [{ parts: [{ text: compressedPrompt }] }],
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

              const candidate = resJson.candidates?.[0] || {};
              const finishReason = candidate.finishReason || 'UNKNOWN';
              lastCallFinishReason = finishReason;

              const usage = resJson.usageMetadata || {};
              const promptTokenCount = usage.promptTokenCount || 0;
              const candidateTokenCount = usage.candidatesTokenCount || usage.candidateTokenCount || 0;

              lessonStats.tokenMetrics.promptTokens += promptTokenCount;
              lessonStats.tokenMetrics.candidatesTokens += candidateTokenCount;

              const charCount = resultText.length;
              const wordCount = resultText.trim().split(/\s+/).filter(Boolean).length;
              const ratio = wordCount > 0 ? (candidateTokenCount / wordCount).toFixed(2) : '0';

              await appendTaskLog(`[AI ENGINE - STUDIO] Response status: finishReason="${finishReason}", characters=${charCount}, words=${wordCount}, tokens=${candidateTokenCount} (promptTokens=${promptTokenCount}). Tokens-to-Words ratio = ${ratio}.`);
              if (finishReason === 'MAX_TOKENS') {
                await appendTaskLog(`[AI ENGINE - WARNING] AI Studio response was TRUNCATED because it reached output limit.`);
              }
              await recordMetrics(task, 'gemini-2.5-flash', durationMs, promptTokenCount, candidateTokenCount, compressedPrompt);
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

      const isTerminalEvaluation = item.slug === 'evaluation-finale' || item.slug === 'final-evaluation';
      // Penultimate lesson = immediately before the terminal evaluation
      const terminalIdx = lessonsList.findIndex((l: any) => l.slug === 'evaluation-finale' || l.slug === 'final-evaluation');
      const penultimateIdx = terminalIdx !== -1 ? terminalIdx - 1 : originalSyllabusLessonsLength - 2;
      const isPenultimateLesson = !isTerminalEvaluation && realIndex === penultimateIdx;
      let approvedNarrativeText = '';

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

      const courseReferences = parsedSyllabus?.references || [];
      const referencesMetadata = courseReferences.length > 0
        ? courseReferences.map((ref: string, idx: number) => `[ref${idx + 1}] ${ref}\n`).join('')
        : 'None provided. Please construct academic references for the discipline.';

      if (isTerminalEvaluation) {
        approvedNarrativeText = '[[WIDGET:finalEvaluation]]';
      } else {
        // ───────────────────────────────────────────────────────────────
        // [STAGE 1] NARRATIVE SCRIBE (AGENT 3A)
        // ───────────────────────────────────────────────────────────────
        await appendTaskLog(`[AI GENERATOR - INVERTED] [STAGE 1] Drafting academic narrative text for lesson "${item.title}"...`);

        let pronunciationMandate = "";
        const isLanguageOrLinguistics = (courseContext.discipline || '').toLowerCase().includes('lang') || 
                                        (courseContext.discipline || '').toLowerCase().includes('linguistic') ||
                                        correctedCourseName.toLowerCase().includes('espagnol') ||
                                        correctedCourseName.toLowerCase().includes('semantique') ||
                                        correctedCourseName.toLowerCase().includes('sémantique');

        if (isLanguageOrLinguistics) {
          if (targetLang.toLowerCase() === 'fr') {
            pronunciationMandate = `
=============================================================================
🚨 MANDATORY PRONUNCIATION WIDGET REQUIREMENT 🚨
Since this lesson belongs to a Language or Linguistics course, you MUST insert the following bracketed widget:
[[WIDGET:SandboxPrononciation:psb_id:word_to_pronounce]]
at least once (and ideally multiple times) directly in the pronunciation, phonetic, or practice sections of your narrative text.
Do NOT use raw HTML/JSX tags. Exclusively write it as a bracketed anchor: [[WIDGET:SandboxPrononciation:psb_id:word_to_pronounce]].
=============================================================================
`;
          } else {
            pronunciationMandate = `
=============================================================================
🚨 MANDATORY PRONUNCIATION WIDGET REQUIREMENT 🚨
Since this lesson belongs to a Language or Linguistics course, you MUST insert the following bracketed widget:
[[WIDGET:PronunciationSandbox:psb_id:word_to_pronounce]]
at least once (and ideally multiple times) directly in the pronunciation, phonetic, or practice sections of your narrative text.
Do NOT use raw HTML/JSX tags. Exclusively write it as a bracketed anchor: [[WIDGET:PronunciationSandbox:psb_id:word_to_pronounce]].
=============================================================================
`;
          }
        }


        // --- 1. JIT Lesson Outline Generation & Critique ---
        await appendTaskLog(`[AI GENERATOR - INVERTED] [STAGE 1-A] Generating JIT outline plan for lesson "${item.title}"...`);
        const outlinePrompt = `You are the Lesson Planner Agent. Your job is to design the chapter outline/plan for the lesson:
Course: "${correctedCourseName}"
Level: "${getDescriptiveLevelForPrompt(levelInput)}"
Lesson Title: "${item.title}"
Lesson Description/Technical Depth: "${item.technicalDepth || 'N/A'}"
Discipline: "${courseContext.discipline || 'General'}"
Target Language: "${targetLang.toUpperCase()}"

Generate a list of 4 to 6 logical chapters/sections for this lesson, including an Introduction and a Conclusion.
For each section, provide a clear heading title (starting with "## ") and a short explanation of what Scribe should write in that section.
Do NOT write the content of the lesson, only the plan/structure.

You must return ONLY a valid JSON object matching the lessonOutlineSchema schema:
\`\`\`json
{
  "sections": [
    {
      "heading": "## Title of the Section",
      "description": "Pedagogical guidelines for this section"
    }
  ]
}
\`\`\`
Do NOT wrap your JSON response in markdown code blocks.`;

        let lessonOutlineObj: any = null;
        let outlineApproved = false;
        let outlineIteration = 0;
        const maxOutlineIterations = 3;
        let currentOutlinePrompt = outlinePrompt;

        while (!outlineApproved && outlineIteration < maxOutlineIterations) {
          outlineIteration++;
          let outlineRaw = await callAIEngine(currentOutlinePrompt, lessonOutlineSchema, 0.1);
          let cleanOutline = outlineRaw.replace(/```json/gi, '').replace(/```/gi, '').trim();
          let parsedOutline: any = null;
          try {
            parsedOutline = safeJsonParse(cleanOutline, 'JIT Lesson Outline Parsing');
          } catch (e) {
            await appendTaskLog(`[AI GENERATOR] JIT Outline JSON parsing failed: ${String(e)}. Retrying...`);
            continue;
          }

          // Critique the outline
          await appendTaskLog(`[AI GENERATOR] Critiquing outline for lesson "${item.title}" (Attempt #${outlineIteration})...`);
          const outlineCriticPrompt = `You are the Outline Critic Agent (Agent 2). Review this JIT lesson plan:
${JSON.stringify(parsedOutline, null, 2)}

Ensure:
1. The progression is pedagogically sound for the level "${getDescriptiveLevelForPrompt(levelInput)}".
2. The headings start with "## " (except intro/conclusion if needed, but they should be consistent).
3. The sections cover the technical depth: "${item.technicalDepth || 'N/A'}".

Return ONLY a valid JSON object matching the outlineAuditSchema:
\`\`\`json
{
  "approved": boolean,
  "critique": "detailed critique explaining what to fix, or empty if approved"
}
\`\`\`
[REJECT-ONLY REPORTING MANDATE]
If the outline is approved, you MUST set approved: true, and critique: "". You must ONLY report failures/issues. Do not write any explanations or critique if the outline is approved.`;

          saveDraftRevision(`prompt_stage1_outline_${item.slug}_iter${outlineIteration}.md`, currentOutlinePrompt);
          saveDraftRevision(`draft_stage1_outline_${item.slug}_iter${outlineIteration}.json`, outlineRaw);
          saveDraftRevision(`prompt_stage1_outline_critique${item.slug}_iter${outlineIteration}.md`, outlineCriticPrompt);

          let outlineCritiqueStr = await callAIEngine(outlineCriticPrompt, outlineAuditSchema, 0.1);
          saveDraftRevision(`critique_stage1_outline${item.slug}_iter${outlineIteration}.json`, outlineCritiqueStr);
          let cleanCritique = outlineCritiqueStr.replace(/```json/gi, '').replace(/```/gi, '').trim();
          let outlineCritique = { approved: true, critique: '' };
          try {
            outlineCritique = safeJsonParse(cleanCritique, 'Outline Critique Parsing');
          } catch (e) {
            console.warn(`[AI GENERATOR] Failed to parse outline critique JSON:`, e);
          }

          if (outlineCritique.approved) {
            await appendTaskLog(`[AI GENERATOR] Outline plan approved by Critique Agent on iteration #${outlineIteration}!`);
            lessonOutlineObj = parsedOutline;
            outlineApproved = true;
          } else {
            await appendTaskLog(`[AI GENERATOR WARNING] Outline REJECTED. Critique: "${outlineCritique.critique}". Retrying outline generation...`);
            currentOutlinePrompt = `${outlinePrompt}
            
=============================================================================
🚨 OUTLINE CRITIQUE FROM PREVIOUS ATTEMPT 🚨
"${outlineCritique.critique}"
=============================================================================`;
          }
        }

        if (!lessonOutlineObj || !lessonOutlineObj.sections) {
          await appendTaskLog(`[AI GENERATOR WARNING] Outline plan failed critique validation. Fallback to default outline.`);
          lessonOutlineObj = {
            sections: [
              { heading: "## Introduction", description: "Introduction to the topic" },
              { heading: "## Core Concepts", description: "First core concept explanations" },
              { heading: "## Advanced Mechanism", description: "Deep dive mechanics and models" },
              { heading: "## Conclusion", description: "Summary and conclusion of the lesson" }
            ]
          };
        }

        // Export outline
        saveDraftRevision(`jit_outline_${item.slug}.json`, JSON.stringify(lessonOutlineObj, null, 2));

        // Group outline sections into blocks of at most 2 sections each
        const outlineSections = lessonOutlineObj.sections;
        const blocks: any[] = [];
        for (let i = 0; i < outlineSections.length; i += 2) {
          blocks.push(outlineSections.slice(i, i + 2));
        }
        await appendTaskLog(`[AI GENERATOR] Grouped JIT plan into ${blocks.length} blocks for narrative writing.`);

        let fullNarrativeText = '';
        for (let bIdx = 0; bIdx < blocks.length; bIdx++) {
          const currentBlockSections = blocks[bIdx];
          const sectionHeadings = currentBlockSections.map((s: any) => s.heading);
          const blockAttemptEntry = {
            sections: sectionHeadings,
            attempts: 0,
            approved: false
          };
          lessonStats.narrativeBlockAttempts.push(blockAttemptEntry);

          const blockHeaderNames = currentBlockSections.map((s: any) => `"${s.heading}"`).join(', ');
          await appendTaskLog(`[AI GENERATOR - INVERTED] [STAGE 1-B] Writing narrative block ${bIdx + 1}/${blocks.length} (Sections: ${blockHeaderNames})...`);

          let blockApproved = false;
          let blockIteration = 0;
          const maxBlockIterations = 3;
          let blockFeedback = '';
          let cleanedBlockText = '';
          let needsScribeDraft = true;

          while (!blockApproved && blockIteration < maxBlockIterations) {
            blockIteration++;
            lessonStats.narrativeAttempts++;
            blockAttemptEntry.attempts = blockIteration;

            if (needsScribeDraft) {
              await appendTaskLog(`[AI GENERATOR] Scribe block generation iteration #${blockIteration} for block ${bIdx + 1}...`);
              const { min: minWords, max: maxWords } = getWordCountLimitForLevel(levelInput);

              const blockPrompt = `You are a world-class academic professor and expert writer (Agent 3A - Narrative Scribe).
Your task is to write a section of the academic MDX narrative content for the specified lesson.

We are writing the lesson block-by-block.
- This is Block ${bIdx + 1} out of ${blocks.length}.
- You MUST write the content for the following sections:
${currentBlockSections.map((s: any) => `* Heading: "${s.heading}"\n  Instructions: "${s.description}"`).join('\n')}

---

### GLOBAL CONTEXT:
- Course Name: "${correctedCourseName}"
- Academic Level: "${getDescriptiveLevelForPrompt(levelInput)}"
- Lesson Title: "${item.title}"
- Discipline: "${courseContext.discipline || 'General'}"
- Target Language: "${targetLang.toUpperCase()}"
- References available:
${referencesMetadata}

---

### PRE-EXISTING WIDGET INVENTORY:
The following relevant media and database resources are available for this course. If any of these are highly relevant to the current section, you should refer/embed them using their exact ID as [[WIDGET:id]] on a separate blank line:
${formattedCatalogList || 'None pre-existing.'}

### PEDAGOGICAL WIDGETS MANDATE (CRITICAL):
To make this curriculum visually rich, interactive, and academically rigorous, you MUST actively insert pedagogical widgets using bracketed anchors directly in the prose. 
You are REQUIRED to include:
- At least 2-3 inline hover-cards (using [[WIDGET:RealPerson:id:Name]], [[WIDGET:ConceptLink:id:Concept Name]], or [[WIDGET:Glossary:id:Term]]) for key figures, concepts, or technical terms in this block of prose.
- At least 1-2 block widgets/media (using [[WIDGET:Image:id]], [[WIDGET:Mermaid:id]], [[WIDGET:ComparisonSlider:id]], [[WIDGET:InteractiveDiagram:id]], [[WIDGET:DataChart:id]], or [[WIDGET:Video:id]]) placed on separate blank lines.
Choose from the following options:
1. [[WIDGET:Biography:unique_id]] - For key historical figures, scientists, authors, or artists. (e.g. [[WIDGET:Biography:rousseau]] or [[WIDGET:Biography:robespierre]] or [[WIDGET:Biography:louis_xvi]])
2. [[WIDGET:Image:unique_id]] - For relevant paintings, historical photos, maps, diagrams, or illustrations. (e.g. [[WIDGET:Image:prise_bastille]])
3. [[WIDGET:Video:unique_id]] - For relevant documentaries, video archives, or animations. (e.g. [[WIDGET:Video:revolution_francaise]])
4. [[WIDGET:Audio:unique_id]] - For audio speeches, narrations, or pronunciations. (e.g. [[WIDGET:Audio:declaration_droits]])
5. [[WIDGET:Mermaid:unique_id]] - For timelines, flowcharts, or structural diagrams. (e.g. [[WIDGET:Mermaid:timeline_causes]])
6. [[WIDGET:Quiz:unique_id]] - For formative multiple-choice quizzes to verify student comprehension.
7. [[WIDGET:SolvedExercise:unique_id]] - For step-by-step resolved exercises, coding snippets, or analytical case studies.
8. [[WIDGET:UnsolvedExercise:unique_id]] - For unsolved application exercises or practice questions.
9. [[WIDGET:FillInBlanks:unique_id]] - For interactive fill-in-the-blanks sentences.
10. [[WIDGET:RealPerson:unique_id:Person Name]] - Inline hover-card highlight for any person mentioned. (e.g. "...alors que [[WIDGET:RealPerson:louis_xvi:Louis XVI]] convoque...")
11. [[WIDGET:ConceptLink:unique_id:Concept Name]] - Inline hover-card highlight for conceptual terms. (e.g. "...l'essor de la [[WIDGET:ConceptLink:souverainete:Souveraineté]] populaire...")
12. [[WIDGET:Glossary:unique_id:Term]] - Inline hover-card highlight for vocabulary definitions. (e.g. "...les députés du [[WIDGET:Glossary:tiers_etat:Tiers État]] se réunissent...")

Please write them exactly in this anchor format [[WIDGET:Type:unique_id]] (or with topic/label for highlights). Do NOT write raw JSX/HTML tags!

---

### PREVIOUS TEXT (for transitions and context):
${bIdx > 0 ? `Below is the text generated in the previous blocks. Do NOT repeat any definitions, concepts, or sentences from this text. Start writing immediately from where it left off, ensuring a smooth transition:
"""
... ${fullNarrativeText.slice(-3000)}
"""` : 'None. This is the first block of the lesson.'}

---

⚠️ CRITICAL MARKUP & XML/JSX COMPLIANCE RULES (MDX SAFETY MANDATE):
1. ABSOLUTE PROHIBITION ON RAW INTERACTIVE OR CUSTOM JSX/HTML TAGS. Absolutely no custom JSX/HTML tags (such as <ConceptLink>, <RealPerson>, <Glossary>, etc.) are allowed inline in prose. Exclusively use [[WIDGET:id]] anchors for all widgets, media, links, or elements.
2. NO RAW HTML FOR LISTS. Use Markdown bullets/numbering.
3. NO LITERAL CURLY BRACES in plain text. Wrap in LaTeX or backticks.
4. NO STRAY import/export statements.
5. NO WIDGET ANCHORS INSIDE LISTS OR TABLES. Place them on separate blank lines.
6. Captions of images or Mermaid diagrams must NOT contain figure prefixes (like 'Figure 1:', 'Image A -'). CAPTIONS MUST ONLY contain the descriptive prose.
7. ACADEMIC REFERENCES CITATION MANDATE: You MUST actively cite the references listed under "### GLOBAL CONTEXT:" (if any) throughout the prose. Cite them inline using the format [ref1], [ref2], etc., where [ref1] maps to the first reference in the Global Context list, [ref2] to the second, and so on. Do not define a bibliography section here; simply cite them inline in this format.
${pronunciationMandate}
${bIdx === blocks.length - 1 ? `8. Since this is the LAST block, you MUST end with the ## Conclusion section containing at least two comprehensive academic paragraphs, and all conclusion widgets in this exact order:
  [[WIDGET:conclusionSummary]]
  [[WIDGET:whatsNext]]
  [[WIDGET:goingFurther]]
  followed by [[WIDGET:finalEvaluation]]` : ''}

${blockFeedback ? `
🚨 CRITIQUE FROM PREVIOUS ATTEMPT 🚨
The critique agent rejected your previous attempt for this block. Correct the following issues:
"${blockFeedback}"` : ''}

Write the content for the specified sections. Return ONLY the markdown content. Do NOT wrap the response in markdown code blocks.`;

              saveDraftRevision(`prompt_stage1_narrative_block${bIdx + 1}_${item.slug}_iter${blockIteration}.md`, blockPrompt);
              let blockRawText = await callAIEngine(blockPrompt, null, 0.35, 0.25, 0.85);
              saveDraftRevision(`draft_stage1_narrative_block${bIdx + 1}_${item.slug}_iter${blockIteration}.md`, blockRawText);
              cleanedBlockText = blockRawText.replace(/```json/gi, '').replace(/```mdx/gi, '').replace(/```/gi, '').trim();
            }

            // Audit the block text using Critic (Agent 4A)
            await appendTaskLog(`[AI GENERATOR] Auditing block ${bIdx + 1} text (Attempt #${blockIteration})...`);
            const blockCriticPrompt = `You are the Narrative Critic Agent (Agent 4A). Review the generated block of text for the lesson:
---
${cleanedBlockText}
---

Check checkpoints:
1. Zero-placeholders.
2. Accurate academic density and level-appropriate language.
3. Strict MDX/JSX safety (absolutely no raw custom component or custom JSX/HTML tags like <ConceptLink>, <RealPerson>, <Glossary>, etc. inline in prose. All interactive elements and special links must strictly use the [[WIDGET:id]] anchor format).
4. No figure prefixes like "Figure 1:" in visual captions.
5. Presence of pedagogical widgets: Check that the block contains at least 2-3 inline hover-cards (ConceptLink, Glossary, RealPerson) and at least 1-2 block widgets (Image, Mermaid, ComparisonSlider, InteractiveDiagram, DataChart, Video) as anchors. If completely missing, reject the block.
${bIdx === blocks.length - 1 ? `6. Valid ## Conclusion section with at least two paragraphs and the required conclusion widgets.` : ''}

Your audit must be in dual-mode:
- **"isGlobalRevision" MUST ONLY be set to true if the issues are widespread and catastrophic** (completely unparseable structure, severe length deficiency, or total failure of the block narrative requiring a complete full-text rewrite). If so, provide a comprehensive "globalCritique".
- **For standard, localized, or section-specific mistakes, you MUST set "isGlobalRevision": false**, and list ONLY the rejected sections requiring localized repair in the "sections" array.

Return ONLY a valid JSON object matching blockNarrativeAuditSchema:
\`\`\`json
{
  "approved": boolean,
  "isGlobalRevision": boolean,
  "globalCritique": "detailed feedback explaining what to fix globally, or empty if approved/local repair",
  "sections": [
    // If approved is false and isGlobalRevision is false, list ONLY the specific sections that are rejected. Do NOT include approved sections.
    {
      "heading": "heading of the rejected section",
      "approved": false,
      "critique": "detailed feedback explaining what to fix in this specific section"
    }
  ]
}
\`\`\`

[REJECT-ONLY REPORTING MANDATE]
1. If approved is true: approved MUST be true, isGlobalRevision MUST be false, globalCritique MUST be "", and sections MUST be empty.
2. If isGlobalRevision is true: approved MUST be false, isGlobalRevision MUST be true, globalCritique MUST describe the global issues, and sections MUST be empty.
3. If approved is false and isGlobalRevision is false: sections MUST ONLY contain sections that are rejected (with approved set to false). Any approved section MUST be strictly omitted from the array.`;

            saveDraftRevision(`prompt_stage1_narrative_block${bIdx + 1}_critique_${item.slug}_iter${blockIteration}.md`, blockCriticPrompt);

            let auditJsonStr = await callAIEngine(blockCriticPrompt, blockNarrativeAuditSchema, 0.1);
            saveDraftRevision(`critique_stage1_narrative_block${bIdx + 1}_${item.slug}_iter${blockIteration}.json`, auditJsonStr);
            let auditClean = auditJsonStr.replace(/```json/gi, '').replace(/```/gi, '').trim();
            let blockAudit = { approved: true, isGlobalRevision: false, globalCritique: '', sections: [] as any[] };
            try {
              const parsed = safeJsonParse(auditClean, 'Block Narrative Audit Parsing');
              if (parsed) {
                blockAudit = parsed;
              }
            } catch (e) {
              console.warn(`[AI GENERATOR] Failed to parse block audit JSON:`, e);
            }

            if (blockAudit.approved) {
              await appendTaskLog(`[AI GENERATOR] Block ${bIdx + 1} approved by Critique Agent!`);
              fullNarrativeText = (fullNarrativeText.trim() + "\n\n" + cleanedBlockText.trim()).trim();
              blockApproved = true;
              blockAttemptEntry.approved = true;
            } else {
              lessonStats.narrativeRejections++;
              const isGlobal = !!blockAudit.isGlobalRevision;

              if (isGlobal || blockIteration >= maxBlockIterations) {
                await appendTaskLog(`[AI GENERATOR WARNING] Block ${bIdx + 1} REJECTED globally. Critique: "${blockAudit.globalCritique}".`);
                blockFeedback = blockAudit.globalCritique || 'Narrative block rejected globally.';
                needsScribeDraft = true;
              } else {
                const rejectedSections = (blockAudit.sections || []).filter((s: any) => !s.approved);
                if (rejectedSections.length === 0) {
                  await appendTaskLog(`[AI GENERATOR WARNING] Block ${bIdx + 1} REJECTED but returned no rejected sections. Retrying globally.`);
                  blockFeedback = blockAudit.globalCritique || 'Narrative block rejected.';
                  needsScribeDraft = true;
                } else {
                  lessonStats.narrativeLocalRepairs++;
                  await appendTaskLog(`[AI GENERATOR WARNING] Block ${bIdx + 1} REJECTED locally. Repairing ${rejectedSections.length} section(s)...`);

                  const parsedSections = parseMarkdownSections(cleanedBlockText);
                  const rejectedSectionsData: any[] = [];

                  for (let i = 0; i < parsedSections.length; i++) {
                    const sec = parsedSections[i];
                    const secHeadingNorm = (sec.heading || 'Header / Introduction Block').trim().toLowerCase();
                    const criticMatch = rejectedSections.find((cs: any) => {
                      const csHeadingNorm = (cs.heading || 'Header / Introduction Block').trim().toLowerCase();
                      return csHeadingNorm === secHeadingNorm || csHeadingNorm.replace(/^##\s+/, '') === secHeadingNorm.replace(/^##\s+/, '');
                    });
                    if (criticMatch) {
                      rejectedSectionsData.push({
                        heading: sec.heading || 'Header / Introduction Block',
                        content: sec.content,
                        critique: criticMatch.critique,
                        precedingHeading: i > 0 ? parsedSections[i - 1].heading : null,
                        succeedingHeading: i < parsedSections.length - 1 ? parsedSections[i + 1].heading : null
                      });
                    }
                  }

                  if (rejectedSectionsData.length > 0) {
                    const promptJointRepair = `You are a world-class academic professor and expert writer (Agent 3A - Narrative Scribe).
We need to repair specific sections of the lesson narrative "${item.title}" (Block ${bIdx + 1}) that were rejected by the Narrative Critic (Agent 4A).

[CRITICAL] CRITICAL MDX COMPLIANCE:
- Absolutely no custom JSX/HTML tags (such as <ConceptLink>, <RealPerson>, <Glossary>, etc.) are allowed inline in prose. Exclusively use [[WIDGET:id]] anchors.
- Do NOT use raw HTML tags; use standard Markdown instead.
- Do NOT use literal curly braces { } in plain text.

[CRITICAL] RICH MARKDOWN TABLES AND MERMAID DIAGRAMS (MANDATORY FOR UNIVERSITY LEVELS):
- If the academic level is University/Higher Education (L1, L2, L3, M1, M2):
  * Ensure that if the section or heading is criticized for lacking structured comparative data or visual flows, you design and insert 1 to 2 rich Markdown tables (using standard \`| Column 1 | Column 2 |\` format) and/or 1 to 2 Mermaid diagrams (wrapped in standard triple-backticks \`\`\`mermaid ... \`\`\`) to visually model the concepts.

CONTEXT:
Course: "${correctedCourseName}" | Level: "${getDescriptiveLevelForPrompt(levelInput)}" | Language: "${targetLang.toUpperCase()}"
References available:
${referencesMetadata}

${rejectedSectionsData.map((rj, idx) => `
--- REJECTED SECTION ${idx + 1} ---
Heading: "${rj.heading}"
Neighborhood:
  - Preceding: ${rj.precedingHeading || 'None'}
  - Succeeding: ${rj.succeedingHeading || 'None'}
Critique from Agent 4A:
  "${rj.critique}"
Current Content:
${rj.content}
----------------------------------
`).join('\n')}

INSTRUCTIONS:
1. Repair each rejected section to fully resolve its critique.
2. Wrap each repaired section in: <revised_section heading="HEADING_EXACTLY_AS_SHOWN">[your repaired content]</revised_section>
3. Preserve all [[WIDGET:id]] anchors exactly as they are in the current content.
4. ACADEMIC REFERENCES CITATION MANDATE: Ensure that all inline citations in the format [ref1], [ref2], etc. mapping to the available global references are strictly preserved or added where necessary to support the academic rigor of the content. Do not define a bibliography section here; simply cite them inline in this format.
5. Do NOT include markdown code block wrappers or conversational text.`;

                    let scribeRepairOutput = await callAIEngine(promptJointRepair, null, 0.35, 0.25, 0.85);
                    const repairs = parseJointRepairOutput(scribeRepairOutput);

                    // Fallback: single section repair with no XML tags
                    if (repairs.size === 0 && rejectedSectionsData.length === 1) {
                      const key = rejectedSectionsData[0].heading.trim().toLowerCase();
                      repairs.set(key, scribeRepairOutput.trim());
                    }

                    // Apply repairs
                    for (const sec of parsedSections) {
                      const key = (sec.heading || 'Header / Introduction Block').trim().toLowerCase();
                      if (repairs.has(key)) {
                        await appendTaskLog(`[AI GENERATOR] Applying repaired content for section: "${sec.heading || 'Header / Introduction Block'}"`);
                        sec.content = repairs.get(key)!;
                      }
                    }

                    cleanedBlockText = reconstructMarkdown(parsedSections);
                    needsScribeDraft = false; // Repaired section is ready for re-audit
                  } else {
                    blockFeedback = 'Failed to map rejected sections. Retrying globally.';
                    needsScribeDraft = true;
                  }
                }
              }
            }
          }

          if (!blockApproved) {
            await appendTaskLog(`[AI GENERATOR WARNING] Block ${bIdx + 1} failed critique validation after max attempts. Moving forward with last draft.`);
            fullNarrativeText = (fullNarrativeText.trim() + "\n\n" + cleanedBlockText.trim()).trim();
          }
        }

        // Programmatic final preprocessor call on completed narrative
        let finalCleanedNarrative = preprocessMdx(fullNarrativeText, targetLang.toLowerCase(), false, item.slug);
        saveDraftRevision(`final_reconstructed_narrative_${item.slug}.md`, finalCleanedNarrative);
        approvedNarrativeText = finalCleanedNarrative;
      }

      // ───────────────────────────────────────────────────────────────
      // [STAGE 2] WIDGETS ARCHITECT (AGENT 3B)
      // ───────────────────────────────────────────────────────────────
      await appendTaskLog(`[AI GENERATOR - INVERTED] [STAGE 2] Designing interactive widgets JSON for lesson "${item.title}"...`);

      const activeAnchors = extractWidgetAnchors(approvedNarrativeText);
      const activeAnchorIds = new Set(activeAnchors.map(a => a.id.toLowerCase()));
      const activeAnchorTypes = new Set(activeAnchors.map(a => a.type.toLowerCase()));

      const dynamicCatalog = Object.fromEntries(
        Object.entries(prunedCatalog).filter(([id, meta]: [string, any]) => {
          const lowerId = id.toLowerCase();
          const lowerType = (meta.componentType || '').toLowerCase();
          return activeAnchorIds.has(lowerId) || activeAnchorTypes.has(lowerId) || (lowerType && activeAnchorIds.has(lowerType));
        })
      );

      const dynamicCatalogList = Object.entries(dynamicCatalog).map(([id, meta]: [string, any]) => {
        return `- ID: "${id}"
  Name: "${meta.nameEN || id}" (${meta.nameFR || id})
  Description: "${meta.descEN || meta.descFR || ''}"
  Disciplines: [${(meta.disciplines || []).join(', ')}]
  Educational Level: "${meta.levelEN || meta.levelFR || 'All levels'}"`;
      }).join('\n\n') || 'None anchored.';

      async function generateAndParseWidgetBlock(
        blockPrompt: string,
        blockSchema: any,
        blockName: string
      ): Promise<any> {
        let blockJsonStr = await callAIEngine(blockPrompt, blockSchema, 0.1, undefined, undefined, false, 'widget_placement');
        let cleanJson = blockJsonStr.replace(/\`\`\`json/gi, '').replace(/\`\`\`/gi, '').trim();

        let parsed: any = null;
        let parseSuccess = false;
        let preflightAttempts = 0;
        const maxPreflightAttempts = 2;
        let currentJsonStr = cleanJson;

        while (!parseSuccess && preflightAttempts <= maxPreflightAttempts) {
          try {
            parsed = safeJsonParse(currentJsonStr, `Widget Block ${blockName} Parsing`);
            parseSuccess = true;
          } catch (err: any) {
            preflightAttempts++;
            if (preflightAttempts > maxPreflightAttempts) {
              await appendTaskLog(`[AI GENERATOR] Pre-flight JSON parsing failed for ${blockName} after ${maxPreflightAttempts} repair attempts. Propagating error.`);
              throw err;
            }
            await appendTaskLog(`[AI GENERATOR] Pre-flight JSON parsing failed for ${blockName}: ${err.message}. Retrying local syntax repair (Attempt ${preflightAttempts}/${maxPreflightAttempts})...`);

            const preflightRepairPrompt = `You are a precise JSON syntax repair assistant.
The JSON output below has syntax errors (such as missing brackets, unescaped quotes, trailing commas, or incomplete properties) and cannot be parsed.
Your task is to fix the syntax errors and return ONLY the completely valid, parseable JSON object matching the required schema.

### PARSE ERROR:
${err.message}

### MALFORMED JSON TO REPAIR:
\\\`\\\`\\\`json
${currentJsonStr}
\\\`\\\`\\\`

Return ONLY the corrected and valid JSON response. Do NOT wrap your response in markdown code blocks.`;

            const repairedJsonStr = await callAIEngine(preflightRepairPrompt, blockSchema, 0.1, undefined, undefined, false, 'widget_placement');
            currentJsonStr = repairedJsonStr.replace(/\`\`\`json/gi, '').replace(/\`\`\`/gi, '').trim();
          }
        }
        return parsed;
      }

      let parsedWidgets: any = {
        prerequisites: { items: [] },
        diagnosticQuiz: { question: '', options: [], correctIndex: 0, targetSectionId: '', sectionTitle: '' },
        learningObjectives: { knowledge: [], skills: [], attitudes: [] },
        interactiveComponents: [],
        conclusionSummary: '',
        whatsNext: '',
        goingFurther: '',
        finalEvaluation: null,
        glossary: [],
        references: []
      };

      // --- Block 1: Structure Widgets ---
      let block1Approved = false;
      let block1Iteration = 0;
      const maxBlock1Iterations = 3;
      let block1Feedback = '';
      let block1Parsed: any = null;

      const block1Prompt = `You are a world-class educational curriculum architect and JSON data validator (Agent 3B - Widgets Architect).
Your task is to design the JSON object for the introductory widgets of the lesson:
Course: "${correctedCourseName}"
Level: "${getDescriptiveLevelForPrompt(levelInput)}"
Lesson Title: "${item.title}"
Language: "${targetLang.toUpperCase()}"

You must define the following JSON properties:
1. "prerequisites": List of 2-3 required concepts/lessons before taking this lesson.
2. "diagnosticQuiz": A single high-quality MCQ diagnostic question to check if the student has the prerequisites.
3. "learningObjectives": Knowledge, skills, and attitudes (3 items each) using Bloom's Taxonomy verbs (Analyze, Evaluate, Create for university level).

Return ONLY a valid JSON object matching this schema:
\\\`\\\`\\\`json
{
  "prerequisites": {
    "items": [
      { "title": "string", "slug": "string", "level": "string", "subject": "string" }
    ]
  },
  "diagnosticQuiz": {
    "question": "string",
    "options": ["string"],
    "correctIndex": integer,
    "targetSectionId": "string",
    "sectionTitle": "string"
  },
  "learningObjectives": {
    "knowledge": ["string"],
    "skills": ["string"],
    "attitudes": ["string"]
  }
}
\\\`\\\`\\\`
Do NOT wrap your JSON response in markdown code blocks.`;

      while (!block1Approved && block1Iteration < maxBlock1Iterations) {
        block1Iteration++;
        lessonStats.widgetsAttempts++;
        await appendTaskLog(`[AI GENERATOR] Generating Widget Block 1 (Attempt #${block1Iteration})...`);

        let block1PromptWithFeedback = block1Prompt;
        if (block1Feedback) {
          block1PromptWithFeedback += `\n\n🚨 PREVIOUS CRITIQUE:\n"${block1Feedback}"\nPlease fix these issues and regenerate.`;
        }

        try {
          block1Parsed = await generateAndParseWidgetBlock(block1PromptWithFeedback, widgetBlock1Schema, 'Block 1 Structure');
        } catch (e) {
          await appendTaskLog(`[AI GENERATOR] Widget Block 1 failed to parse. Retrying...`);
          continue;
        }

        // Critique block 1
        await appendTaskLog(`[AI GENERATOR] Auditing Widget Block 1...`);
        const block1CriticPrompt = `You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 1:
${JSON.stringify(block1Parsed, null, 2)}

Check:
1. Prerequisites are realistic.
2. DiagnosticQuiz index is correct.
3. LearningObjectives use Bloom's Taxonomy verbs (Analyze, Evaluate, Create for L1/L2/L3/Master levels).

Return ONLY a valid JSON object matching widgetBlockAuditSchema:
\`\`\`json
{
  "approved": boolean,
  "critique": "detailed feedback explaining what to fix globally, or empty if approved",
  "fields": [
    // If approved is false, list ONLY the fields/keys that are rejected. Do NOT include approved fields.
    {
      "field": "name of the field (e.g., 'prerequisites', 'diagnosticQuiz', or 'learningObjectives')",
      "approved": false,
      "critique": "detailed feedback explaining what to fix in this specific field"
    }
  ]
}
\`\`\`

[REJECT-ONLY REPORTING MANDATE]
1. If approved is true: approved MUST be true, critique MUST be "", and fields MUST be empty.
2. If approved is false: fields MUST ONLY contain fields that are rejected (with approved set to false). Any approved field MUST be strictly omitted from the array.`;

        saveDraftRevision(`prompt_stage2_widgets_block1_${item.slug}_iter${block1Iteration}.md`, block1PromptWithFeedback);
        if (block1Parsed) {
          saveDraftRevision(`draft_stage2_widgets_block1_${item.slug}_iter${block1Iteration}.json`, JSON.stringify(block1Parsed, null, 2));
        }
        saveDraftRevision(`prompt_stage2_widgets_block1_critique_${item.slug}_iter${block1Iteration}.md`, block1CriticPrompt);

        const criticJsonStr = await callAIEngine(block1CriticPrompt, widgetBlockAuditSchema, 0.1, undefined, undefined, false, 'widget_placement');
        saveDraftRevision(`critique_stage2_widgets_block1_${item.slug}_iter${block1Iteration}.json`, criticJsonStr);
        const cleanCritic = criticJsonStr.replace(/\`\`\`json/gi, '').replace(/\`\`\`/gi, '').trim();
        let auditResult = { approved: true, critique: '', fields: [] as any[] };
        try {
          auditResult = safeJsonParse(cleanCritic, 'Widget Block 1 Audit Parsing');
        } catch (e) {
          console.warn(`[AI GENERATOR] Failed to parse Block 1 critique:`, e);
        }

        if (auditResult.approved || isTerminalEvaluation) {
          await appendTaskLog(`[AI GENERATOR] Widget Block 1 approved by Critique Agent!`);
          block1Approved = true;
        } else {
          let critiqueMsg = auditResult.critique || 'Widget Block 1 rejected.';
          if (auditResult.fields && auditResult.fields.length > 0) {
            critiqueMsg += '\nDetailed errors:\n' + auditResult.fields.map((f: any) => `- Field "${f.field}": ${f.critique}`).join('\n');
          }
          await appendTaskLog(`[AI GENERATOR WARNING] Widget Block 1 REJECTED. Critique: "${critiqueMsg}".`);
          lessonStats.widgetsRejections++;
          block1Feedback = critiqueMsg;
        }
      }

      if (block1Parsed) {
        parsedWidgets.prerequisites = block1Parsed.prerequisites;
        parsedWidgets.diagnosticQuiz = block1Parsed.diagnosticQuiz;
        parsedWidgets.learningObjectives = block1Parsed.learningObjectives;
      }

      // --- Block 2: Narrative / Interactive Components ---
      let block2Approved = false;
      let block2Iteration = 0;
      const maxBlock2Iterations = 3;
      let block2Feedback = '';
      let block2Parsed: any = null;

      const activeCustomAnchors = activeAnchors.filter(a => !['prerequisites', 'diagnosticQuiz', 'learningObjectives', 'conclusionSummary', 'whatsNext', 'goingFurther', 'finalEvaluation', 'references'].includes(a.type));

      if (activeCustomAnchors.length === 0 || isTerminalEvaluation) {
        await appendTaskLog(`[AI GENERATOR] No custom narrative widget anchors found. Skipping Widget Block 2.`);
        block2Approved = true;
      } else {
        const block2Prompt = `You are a world-class educational curriculum architect and JSON data validator (Agent 3B - Widgets Architect).
Your task is to design the JSON object for the interactive components of the lesson.

The narrative text contains the following custom widget anchors that you MUST define:
${activeCustomAnchors.map(a => `- Anchor: [[WIDGET:${a.type}:${a.id}${a.topic ? `:${a.topic}` : ''}]] (Type: "${a.type}", ID: "${a.id}", Topic: "${a.topic || ''}")`).join('\n')}

---

### CATALOG AND GUIDELINES:
${dynamicCatalogList}

### REQUIRED PROPS STRUCTURE per componentType:
1. "Biography":
   - "name": (string) Full name of the person.
   - "dates": (string) Lifespan dates, e.g. "1723-1790" or "1856-1939".
   - "description": (string) Detailed biographical summary focusing on their contributions (8-12 sentences).
   - "wikipediaUrl": (string) Direct link to their English or French Wikipedia page.
2. "Image":
   - "description": (string) Detailed search/generation description for the image (at least 2-3 sentences of visual instructions). Do NOT generate sequential figure prefixes.
   - "alt": (string) Short description for accessibility.
   - "caption": (string) A detailed, italicized caption explaining academic relevance. Do NOT generate sequential figure numbers.
   - "title": (string) Short title of the image.
   - "searchQuery": (string) Highly canonical 1 to 3 search words (e.g. 'Claudio Monteverdi', 'Prise de la Bastille') to search in archives.
3. "Video":
   - "title": (string) Title of the video documentary or lecture segment.
   - "duration": (string) Estimated duration, e.g. "3:15".
4. "Audio":
   - "title": (string) Short descriptive title for the audio.
   - "duration": (string) e.g. "1:30".
   - "description": (string) Detailed description/narration text.
5. "Quiz":
   - "limit": (integer) Number of questions to display.
   - "questions": (array of objects) Each object must have:
     - "q": (string) The question card text.
     - "explanation": (string) Extremely concise, punchy explanation of the correct choice.
     - "options": (array of objects) Each option must have:
       - "text": (string) Option text.
       - "correct": (boolean) Whether correct.
6. "SolvedExercise":
   - "title": (string) Exercise title.
   - "problem": (string) The markdown-formatted problem statement.
   - "solution": (string) Detailed step-by-step solution.
7. "UnsolvedExercise":
   - "title": (string) Exercise title.
   - "problem": (string) Markdown problem statement.
   - "correctAnswer": (string) The correct analytical answer or formula.
8. "FillInBlanks":
   - "sentence": (string) Sentence containing one or more blanks represented by five underscores (_____).
   - "answer": (string) Correct comma-separated answers.
9. "Mermaid":
   - "chart": (string) Valid Mermaid chart notation starting with graph/sequenceDiagram/etc.
10. "RealPerson" or "HistoricalPerson":
   - "name": (string) Full name of the person (should match the Anchor Topic if provided).
   - "description": (string) Wikipedia-style hover card tooltip summary of this person (2-4 sentences).
11. "ConceptLink":
   - "name": (string) Name of the concept (should match the Anchor Topic if provided).
   - "description": (string) Wikipedia-style hover card tooltip summary of this concept (2-4 sentences).
12. "Glossary":
   - "term": (string) Glossary vocabulary term.
   - "definition": (string) Detailed vocabulary definition (2-4 sentences).

You must define the "interactiveComponents" array containing one object for each anchor listed above.
For each component:
- "id": Must match the ID from the anchor.
- "componentType": Must match the Type from the anchor.
- "sectionAnchor": The markdown heading "## Section Name" where this widget is placed in the narrative.
- "props": The specific properties required for the widget type as described above.

Return ONLY a valid JSON object matching this schema:
\\\`\\\`\\\`json
{
  "interactiveComponents": [
    {
      "id": "string",
      "componentType": "string",
      "sectionAnchor": "string",
      "props": {}
    }
  ]
}
\\\`\\\`\\\`
Do NOT wrap your JSON response in markdown code blocks.`;

        while (!block2Approved && block2Iteration < maxBlock2Iterations) {
          block2Iteration++;
          lessonStats.widgetsAttempts++;
          await appendTaskLog(`[AI GENERATOR] Generating Widget Block 2 (Attempt #${block2Iteration})...`);

          let block2PromptWithFeedback = block2Prompt;
          if (block2Feedback) {
            block2PromptWithFeedback += `\n\n🚨 PREVIOUS CRITIQUE:\n"${block2Feedback}"\nPlease fix these issues and regenerate.`;
          }

          try {
            block2Parsed = await generateAndParseWidgetBlock(block2PromptWithFeedback, widgetBlock2Schema, 'Block 2 Interactive');
          } catch (e) {
            await appendTaskLog(`[AI GENERATOR] Widget Block 2 failed to parse. Retrying...`);
            continue;
          }

          // Critique block 2
          await appendTaskLog(`[AI GENERATOR] Auditing Widget Block 2...`);
          const block2CriticPrompt = `You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 2:
${JSON.stringify(block2Parsed, null, 2)}

Ensure:
1. Every anchor specified in the prompt is mapped.
2. Captions and descriptions have no sequential figure prefixes like "Figure 1:".
3. Biography component details (dates, Wikipedia link) are correct.

Return ONLY a valid JSON object matching widgetBlockAuditSchema:
\`\`\`json
{
  "approved": boolean,
  "critique": "detailed feedback explaining what to fix globally, or empty if approved",
  "fields": [
    // If approved is false, list ONLY the fields/keys that are rejected. Do NOT include approved fields.
    {
      "field": "name of the field (e.g., 'interactiveComponents')",
      "approved": false,
      "critique": "detailed feedback explaining what to fix in this specific field"
    }
  ]
}
\`\`\`

[REJECT-ONLY REPORTING MANDATE]
1. If approved is true: approved MUST be true, critique MUST be "", and fields MUST be empty.
2. If approved is false: fields MUST ONLY contain fields that are rejected (with approved set to false). Any approved field MUST be strictly omitted from the array.`;

          saveDraftRevision(`prompt_stage2_widgets_block2_${item.slug}_iter${block2Iteration}.md`, block2PromptWithFeedback);
          if (block2Parsed) {
            saveDraftRevision(`draft_stage2_widgets_block2_${item.slug}_iter${block2Iteration}.json`, JSON.stringify(block2Parsed, null, 2));
          }
          saveDraftRevision(`prompt_stage2_widgets_block2_critique_${item.slug}_iter${block2Iteration}.md`, block2CriticPrompt);

          const criticJsonStr = await callAIEngine(block2CriticPrompt, widgetBlockAuditSchema, 0.1, undefined, undefined, false, 'widget_placement');
          saveDraftRevision(`critique_stage2_widgets_block2_${item.slug}_iter${block2Iteration}.json`, criticJsonStr);
          const cleanCritic = criticJsonStr.replace(/\`\`\`json/gi, '').replace(/\`\`\`/gi, '').trim();
          let auditResult = { approved: true, critique: '', fields: [] as any[] };
          try {
            auditResult = safeJsonParse(cleanCritic, 'Widget Block 2 Audit Parsing');
          } catch (e) {
            console.warn(`[AI GENERATOR] Failed to parse Block 2 critique:`, e);
          }

          if (auditResult.approved) {
            await appendTaskLog(`[AI GENERATOR] Widget Block 2 approved by Critique Agent!`);
            block2Approved = true;
          } else {
            let critiqueMsg = auditResult.critique || 'Widget Block 2 rejected.';
            if (auditResult.fields && auditResult.fields.length > 0) {
              critiqueMsg += '\nDetailed errors:\n' + auditResult.fields.map((f: any) => `- Field "${f.field}": ${f.critique}`).join('\n');
            }
            await appendTaskLog(`[AI GENERATOR WARNING] Widget Block 2 REJECTED. Critique: "${critiqueMsg}".`);
            lessonStats.widgetsRejections++;
            block2Feedback = critiqueMsg;
          }
        }
      }

      if (block2Parsed && Array.isArray(block2Parsed.interactiveComponents)) {
        parsedWidgets.interactiveComponents = block2Parsed.interactiveComponents;
      }

      // --- Block 3: Conclusion, What's Next & Glossary ---
      let block3Approved = false;
      let block3Iteration = 0;
      const maxBlock3Iterations = 3;
      let block3Feedback = '';
      let block3Parsed: any = null;

      const block3Prompt = `You are a world-class educational curriculum architect and JSON data validator (Agent 3B - Widgets Architect).
Your task is to design the JSON object for the conclusion, glossary, and transition widgets of the lesson:
Course: "${correctedCourseName}"
Level: "${getDescriptiveLevelForPrompt(levelInput)}"
Lesson Title: "${item.title}"
Language: "${targetLang.toUpperCase()}"

You must define the following JSON properties:
1. "conclusionSummary": A detailed text summarizing the key takeaways of this lesson (at least 5 sentences).
2. "whatsNext": A text showing the link/transition to the next lesson.
3. "goingFurther": Additional links or resources (with titles and URLs).
4. "glossary": An array of at least 3-4 key technical terms with detailed definitions.

Return ONLY a valid JSON object matching this schema:
\\\`\\\`\\\`json
{
  "conclusionSummary": "string",
  "whatsNext": "string",
  "goingFurther": "string",
  "glossary": [
    { "term": "string", "definition": "string" }
  ]
}
\\\`\\\`\\\`
Do NOT wrap your JSON response in markdown code blocks.`;

      while (!block3Approved && block3Iteration < maxBlock3Iterations) {
        block3Iteration++;
        lessonStats.widgetsAttempts++;
        await appendTaskLog(`[AI GENERATOR] Generating Widget Block 3 (Attempt #${block3Iteration})...`);

        let block3PromptWithFeedback = block3Prompt;
        if (block3Feedback) {
          block3PromptWithFeedback += `\n\n🚨 PREVIOUS CRITIQUE:\n"${block3Feedback}"\nPlease fix these issues and regenerate.`;
        }

        try {
          block3Parsed = await generateAndParseWidgetBlock(block3PromptWithFeedback, widgetBlock3Schema, 'Block 3 Conclusion & Glossary');
        } catch (e) {
          await appendTaskLog(`[AI GENERATOR] Widget Block 3 failed to parse. Retrying...`);
          continue;
        }

        // Critique block 3
        await appendTaskLog(`[AI GENERATOR] Auditing Widget Block 3...`);
        const block3CriticPrompt = `You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
${JSON.stringify(block3Parsed, null, 2)}

Ensure:
1. Glossary and conclusion summary are scientifically/academically accurate.
2. The language is strictly in ${targetLang.toUpperCase()}.

Return ONLY a valid JSON object matching widgetBlockAuditSchema:
\`\`\`json
{
  "approved": boolean,
  "critique": "detailed feedback explaining what to fix globally, or empty if approved",
  "fields": [
    // If approved is false, list ONLY the fields/keys that are rejected. Do NOT include approved fields.
    {
      "field": "name of the field (e.g., 'conclusionSummary', 'whatsNext', 'goingFurther', or 'glossary')",
      "approved": false,
      "critique": "detailed feedback explaining what to fix in this specific field"
    }
  ]
}
\`\`\`

[REJECT-ONLY REPORTING MANDATE]
1. If approved is true: approved MUST be true, critique MUST be "", and fields MUST be empty.
2. If approved is false: fields MUST ONLY contain fields that are rejected (with approved set to false). Any approved field MUST be strictly omitted from the array.`;

        saveDraftRevision(`prompt_stage2_widgets_block3_${item.slug}_iter${block3Iteration}.md`, block3PromptWithFeedback);
        if (block3Parsed) {
          saveDraftRevision(`draft_stage2_widgets_block3_${item.slug}_iter${block3Iteration}.json`, JSON.stringify(block3Parsed, null, 2));
        }
        saveDraftRevision(`prompt_stage2_widgets_block3_critique${item.slug}_iter${block3Iteration}.md`, block3CriticPrompt);

        const criticJsonStr = await callAIEngine(block3CriticPrompt, widgetBlockAuditSchema, 0.1, undefined, undefined, false, 'widget_placement');
        saveDraftRevision(`critique_stage2_widgets_block3${item.slug}_iter${block3Iteration}.json`, criticJsonStr);

        const cleanCritic = criticJsonStr.replace(/\`\`\`json/gi, '').replace(/\`\`\`/gi, '').trim();
        let auditResult = { approved: true, critique: '', fields: [] as any[] };
        try {
          auditResult = safeJsonParse(cleanCritic, 'Widget Block 3 Audit Parsing');
        } catch (e) {
          console.warn(`[AI GENERATOR] Failed to parse Block 3 critique:`, e);
        }

        if (auditResult.approved || isTerminalEvaluation) {
          await appendTaskLog(`[AI GENERATOR] Widget Block 3 approved by Critique Agent!`);
          block3Approved = true;
        } else {
          let critiqueMsg = auditResult.critique || 'Widget Block 3 rejected.';
          if (auditResult.fields && auditResult.fields.length > 0) {
            critiqueMsg += '\nDetailed errors:\n' + auditResult.fields.map((f: any) => `- Field "${f.field}": ${f.critique}`).join('\n');
          }
          await appendTaskLog(`[AI GENERATOR WARNING] Widget Block 3 REJECTED. Critique: "${critiqueMsg}".`);
          lessonStats.widgetsRejections++;
          block3Feedback = critiqueMsg;
        }
      }

      if (block3Parsed) {
        parsedWidgets.conclusionSummary = block3Parsed.conclusionSummary;
        parsedWidgets.whatsNext = block3Parsed.whatsNext;
        parsedWidgets.goingFurther = block3Parsed.goingFurther;
        parsedWidgets.glossary = block3Parsed.glossary;
      }


      // --- Block 4: Evaluation & Bibliography References ---
      let block4Approved = false;
      let block4Iteration = 0;
      const maxBlock4Iterations = 3;
      let block4Feedback = '';
      let block4Parsed: any = null;

      const block4Prompt = `You are a world-class educational curriculum architect and JSON data validator (Agent 3B - Widgets Architect).
Your task is to design the JSON object for the final evaluation quiz and reference widgets of the lesson:
Course: "${correctedCourseName}"
Level: "${getDescriptiveLevelForPrompt(levelInput)}"
Lesson Title: "${item.title}"
Language: "${targetLang.toUpperCase()}"
Citation Style: "${getCitationStyle(courseContext.discipline || correctedCourseName).fullName}"

You must define the following JSON properties:
1. "finalEvaluation": ${isTerminalEvaluation ? 'A comprehensive course-level final exam. Provide a Quiz containing exactly 15 questions covering the entire course.' : 'A lesson-level final quiz. Provide a Quiz containing 5-10 questions covering this lesson.'}
2. "references": An array of 3-5 authoritative academic bibliography entries in the requested citation style.

Return ONLY a valid JSON object matching this schema:
\\\`\\\`\\\`json
{
  "finalEvaluation": {
    "questions": [
      {
        "question": "string",
        "options": ["string"],
        "correctIndex": integer,
        "explanation": "string"
      }
    ]
  },
  "references": ["string"]
}
\\\`\\\`\\\`
Do NOT wrap your JSON response in markdown code blocks.`;

      while (!block4Approved && block4Iteration < maxBlock4Iterations) {
        block4Iteration++;
        lessonStats.widgetsAttempts++;
        await appendTaskLog(`[AI GENERATOR] Generating Widget Block 4 (Attempt #${block4Iteration})...`);

        let block4PromptWithFeedback = block4Prompt;
        if (block4Feedback) {
          block4PromptWithFeedback += `\n\n🚨 PREVIOUS CRITIQUE:\n"${block4Feedback}"\nPlease fix these issues and regenerate.`;
        }

        try {
          block4Parsed = await generateAndParseWidgetBlock(block4PromptWithFeedback, widgetBlock4Schema, 'Block 4 Evaluation & References');
        } catch (e) {
          await appendTaskLog(`[AI GENERATOR] Widget Block 4 failed to parse. Retrying...`);
          continue;
        }

        // Critique block 4
        await appendTaskLog(`[AI GENERATOR] Auditing Widget Block 4...`);
        const block4CriticPrompt = `You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 4:
${JSON.stringify(block4Parsed, null, 2)}

Ensure:
1. Bibliography entries are valid academic citations.
2. Quizzes are mathematically/scientifically accurate.
3. No HTML or custom Hover-Card tags inside quiz strings.

Return ONLY a valid JSON object matching widgetBlockAuditSchema:
\`\`\`json
{
  "approved": boolean,
  "critique": "detailed feedback explaining what to fix globally, or empty if approved",
  "fields": [
    // If approved is false, list ONLY the fields/keys that are rejected. Do NOT include approved fields.
    {
      "field": "name of the field (e.g., 'finalEvaluation' or 'references')",
      "approved": false,
      "critique": "detailed feedback explaining what to fix in this specific field"
    }
  ]
}
\`\`\`

[REJECT-ONLY REPORTING MANDATE]
1. If approved is true: approved MUST be true, critique MUST be "", and fields MUST be empty.
2. If approved is false: fields MUST ONLY contain fields that are rejected (with approved set to false). Any approved field MUST be strictly omitted from the array.`;

        saveDraftRevision(`prompt_stage2_widgets_block4_${item.slug}_iter${block4Iteration}.md`, block4PromptWithFeedback);
        if (block4Parsed) {
          saveDraftRevision(`draft_stage2_widgets_block4_${item.slug}_iter${block4Iteration}.json`, JSON.stringify(block4Parsed, null, 2));
        }
        saveDraftRevision(`prompt_stage2_widgets_block4_critique${item.slug}_iter${block4Iteration}.md`, block4CriticPrompt);

        const criticJsonStr = await callAIEngine(block4CriticPrompt, widgetBlockAuditSchema, 0.1, undefined, undefined, false, 'widget_placement');
        saveDraftRevision(`critique_stage2_widgets_block4${item.slug}_iter${block4Iteration}.json`, criticJsonStr);

        const cleanCritic = criticJsonStr.replace(/\`\`\`json/gi, '').replace(/\`\`\`/gi, '').trim();
        let auditResult = { approved: true, critique: '', fields: [] as any[] };
        try {
          auditResult = safeJsonParse(cleanCritic, 'Widget Block 4 Audit Parsing');
        } catch (e) {
          console.warn(`[AI GENERATOR] Failed to parse Block 4 critique:`, e);
        }

        if (auditResult.approved || isTerminalEvaluation) {
          await appendTaskLog(`[AI GENERATOR] Widget Block 4 approved by Critique Agent!`);
          block4Approved = true;
        } else {
          let critiqueMsg = auditResult.critique || 'Widget Block 4 rejected.';
          if (auditResult.fields && auditResult.fields.length > 0) {
            critiqueMsg += '\nDetailed errors:\n' + auditResult.fields.map((f: any) => `- Field "${f.field}": ${f.critique}`).join('\n');
          }
          await appendTaskLog(`[AI GENERATOR WARNING] Widget Block 4 REJECTED. Critique: "${critiqueMsg}".`);
          lessonStats.widgetsRejections++;
          block4Feedback = critiqueMsg;
        }
      }

      if (block4Parsed) {
        parsedWidgets.finalEvaluation = block4Parsed.finalEvaluation;
        parsedWidgets.references = block4Parsed.references;
      }
      // --- Programmatic Curation-First budget & normalization ---
      const dbCatalogKeys = Object.keys(prunedCatalog);
      if (parsedWidgets && Array.isArray(parsedWidgets.interactiveComponents)) {
        let databaseWidgetsInThisLesson = 0;
        parsedWidgets.interactiveComponents = parsedWidgets.interactiveComponents.filter((comp: any) => {
          if (!comp || !comp.componentType) return false;

          const matchedKey = dbCatalogKeys.find(
            key => key.toLowerCase() === comp.componentType.toLowerCase() || key.toLowerCase() === comp.id?.toLowerCase()
          );

          if (matchedKey) {
            const noPropsWidgets = new Set(['StructureViewer3D', 'QuantumOrbitalExplorer', 'DynamicSimulation', 'ChemicalStoichiometry', 'BasicMathExplorer']);
            const isDatabaseCurated = noPropsWidgets.has(matchedKey);

            const isDuplicate = usedDatabaseWidgetIds.has(matchedKey);
            const isOverBudget = (usedDatabaseWidgetIds.size + databaseWidgetsInThisLesson) >= 2;

            if (isDatabaseCurated && (isDuplicate || isOverBudget)) {
              console.log(`[WIDGET CURATION] Filtered out database widget "${matchedKey}" (Duplicate: ${isDuplicate}, OverBudget: ${isOverBudget})`);
              return false;
            }

            comp.componentType = matchedKey;
            if (isDatabaseCurated) {
              comp.id = matchedKey;
              comp.props = {};
              databaseWidgetsInThisLesson++;
              usedDatabaseWidgetIds.add(matchedKey);
            }
            appendTaskLog(`[WIDGET CURATION] Selected and approved widget: "${matchedKey}" (Database Curated: ${isDatabaseCurated})`);
            return true;
          }

          return true;
        });
      }

      parsedWidgets = await validateAndFixWidgets(parsedWidgets, courseContext.discipline || correctedCourseName, targetLang);

      // [STAGE 3] DETERMINISTIC STITCHING ENGINE
      // ───────────────────────────────────────────────────────────────
      await appendTaskLog(`[AI GENERATOR - INVERTED] [STAGE 3] Stitching narrative and widgets programmatically...`);
      const isLastLesson = realIndex === originalSyllabusLessonsLength - 1;
      let currentMdx = stitchLessonContent(approvedNarrativeText, parsedWidgets, isTerminalEvaluation);

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

      // Parse custom figures and add to global registry for deduplication
      try {
        const figures = extractCustomFigures(resolvedMdx);
        for (const fig of figures) {
          const isDup = usedMediaRegistry.some(existing => areMediaSimilar(existing, fig));
          if (!isDup) {
            usedMediaRegistry.push(fig);
          }
        }
      } catch (err) {
        console.warn(`[MEDIA DEDUPLICATION] Failed to parse and register figures for lesson "${item.title}":`, err);
      }

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
2. Keep all Math equations (wrapped in $ or $) completely untouched.
3. Do NOT translate technical code blocks. You will see placeholder tokens like __JSX_SELF_...__, __JSX_CLOSE_...__, __JSX_OPEN_...__, __JSX_ATTR_...__, __JSX_END_...__, and source attribution placeholders like __SRC_ATTR_PLACEHOLDER_...__. These placeholders protect the custom interactive components and figure source attributions from corruption. Do NOT translate or modify these placeholders or the '|||' separators. Preserve them EXACTLY as they are.
4. Translate the title and return ONLY the translated MDX content. Do not include markdown code block wrappers.
5. CRITICAL ACADEMIC INTEGRITY & CITATION RULES:
   - Do NOT translate any bibliographic references, book/article/publication titles, author names, publishers, publication cities, or citation texts. These must remain exactly in their original language to preserve academic citation integrity.
   - Do NOT translate the "Source:" prefix or any associated bibliographic links/attributions in figures, captions, or text.
   - In quote blocks (lines starting with '>'), do NOT translate the author name or the publication details following the '—' dash.
   - Translate the quote content into the target course language, followed by its original version in brackets (e.g., \`[Original: "Original quote..."]\`) IF the target course language is different from the quote's original language. If the target course language is the same as the quote's original language, only keep the original version (do NOT repeat it or wrap it in brackets). Never translate the original citation text in the brackets.
6. CRITICAL MDX COMPILER COMPLIANCE RULES:
   - Do NOT wrap the translated response in markdown code blocks (such as \`\`\`md or \`\`\`mdx). Return the raw MDX content directly.
   - Absolutely NO orphaned JSX tags or unclosed tags.
   - Never nest a custom component inside itself.
   - Do NOT generate empty components without text or children.
7. ZERO-COMMENTARY MANDATE: Do not add any conversational introduction, notes, or explanation (e.g. "Here is the translation:"). Return ONLY the translated MDX content.

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
                const compressedPrompt = compressPromptText(promptTranslate);
                const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    contents: [{ parts: [{ text: compressedPrompt }] }]
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
                  await recordMetrics('course_translation', 'gemini-2.5-flash', durationMs, promptTokens, candidatesTokens, compressedPrompt);
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
3. Custom attributes: For <Glossary>, are term/definition translated? For <HistoricalPerson>, are name/lang translated/updated? For <EssayEvaluation>, are prompt/subject translated? Are other properties (like durations, options, gradingSystem, IDs, itemsBase64 payloads) preserved exactly as in the original?
4. Formulas and Code: Are all Math equations ($...$ or $...$) and code blocks kept exactly as they were, untranslated?
5. Zero Translator Commentary: Did the translator introduce any notes, prefixes, or meta-conversational lines (e.g. "Here is the translation:")? If so, reject it.
6. Zero placeholders: Are there any placeholders or unfinished sections?
7. Assessment Integrity: Ensure all translated interactive assessments (<Quiz>, <Question>, <Option>, <DiagnosticQuiz>, <EssayEvaluation>, <UnsolvedExercise>) are complete, fully populated with high-quality, non-empty text matching the target course level, length, and complexity of the subject, and verify that the translation has not broken correct option attributes (e.g. "correct" prop on <Option>, or "correctIndex" on <DiagnosticQuiz>).
8. Academic References and Figure Sources: Do NOT expect or request translation of academic references, book/article/publication titles, author names, or citation texts inside <References> components or itemsBase64 attributes. These must remain exactly as they are in the original to preserve citation integrity.
9. Immutability of Citations and Sources: Verify that "Source:" prefixes and associated bibliographic links/attributions in figure captions or narrative text remain exactly in their original language (typically English) and have not been translated. Verify that quotes (lines starting with '>') have the quote translated to the target course language, followed by its original version in brackets (e.g. \`[Original: "Original quote..."]\`) if different from the target course language. Ensure that if the target course language matches the quote's original language, only one quote exists (no brackets or duplication). Ensure all citation details (author, book, publisher, etc. after the '—' dash) remain untranslated. Reject the translation if bibliographic citations, original quote blocks, reference metadata, or book titles are translated.

You must output ONLY a valid JSON object matching this structure:
{
  "approved": true or false,
  "critique": "If not approved, explain exactly what is wrong/missing/broken so the translator can correct it. If approved, keep this empty."
}

[REJECT-ONLY REPORTING MANDATE]
If the translation is approved, you MUST set approved: true, and critique: "". You must ONLY report failures/issues. Do not write any explanations or critique if the translation is approved.`;

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
                      contents: [{ parts: [{ text: compressPromptText(promptCritic) }] }],
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
2. Keep all Math equations (wrapped in $ or $) completely untouched.
3. Do NOT translate technical code blocks or placeholder tokens like __JSX_SELF_...__, __JSX_CLOSE_...__, __JSX_OPEN_...__, __JSX_ATTR_...__, __JSX_END_...__, and source attribution placeholders like __SRC_ATTR_PLACEHOLDER_...__. Preserve them EXACTLY as they are. Do not translate the '|||' separators. Absolutely do NOT append any text, properties, or attributes to these placeholders (for example, never append itemsBase64=... next to __JSX_SELF_References_...__).
4. Translate the title and return ONLY the translated MDX content. Do not include markdown code block wrappers.
5. CRITICAL ACADEMIC INTEGRITY & CITATION RULES:
   - Do NOT translate any bibliographic references, book/article/publication titles, author names, publishers, publication cities, or citation texts. These must remain exactly in their original language to preserve academic citation integrity.
   - Do NOT translate the "Source:" prefix or any associated bibliographic links/attributions in figures, captions, or text.
   - In quote blocks (lines starting with '>'), do NOT translate the author name or the publication details following the '—' dash.
   - Translate the quote content into the target course language, followed by its original version in brackets (e.g., \`[Original: "Original quote..."]\`) IF the target course language is different from the quote's original language. If the target course language is the same as the quote's original language, only keep the original version (do NOT repeat it or wrap it in brackets). Never translate the original citation text in the brackets.`;

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
                        contents: [{ parts: [{ text: compressPromptText(promptRefine) }] }]
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
                  const compressedTitle = compressPromptText(promptTitle);
                  const resTitle = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      contents: [{ parts: [{ text: compressedTitle }] }]
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
                    await recordMetrics('course_translation', 'gemini-2.5-flash', durationMs, promptTokens, candidatesTokens, compressedTitle);
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
                contents: [{ parts: [{ text: compressPromptText(promptCourseTitle) }] }]
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
                contents: [{ parts: [{ text: compressPromptText(promptCourseDesc) }] }]
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
          contents: [{ parts: [{ text: compressPromptText(promptIdentify) }] }],
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
          generationConfig: {
            temperature: 0.35,
            frequencyPenalty: 0.25,
            topP: 0.85
          }
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
            contents: [{ parts: [{ text: compressPromptText(promptRevise) }] }],
            generationConfig: {
              temperature: 0.35,
              frequencyPenalty: 0.25,
              topP: 0.85
            }
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
- **"isGlobalRevision" MUST ONLY be set to true if the issues are widespread and catastrophic** (completely unparseable structure, severe length deficiency, or total failure of the revision requiring a complete full-JSON rewrite). If so, provide a comprehensive "globalCritique".
- **For standard, localized, or section-specific mistakes, you MUST set "isGlobalRevision": false**, and list ONLY the rejected sections requiring localized repair in the "sections" array.

You must output ONLY a valid JSON object matching the revisionAuditSchema:
{
  "approved": true or false,
  "isGlobalRevision": true or false,
  "globalCritique": "Explain exactly what is wrong/missing/broken globally if isGlobalRevision is true. Otherwise keep empty.",
  "sections": [
    // If approved is false and isGlobalRevision is false, list ONLY the specific sections that are rejected. Do NOT include approved sections.
    {
      "heading": "Heading of the section, e.g., '## Introduction' (or '' for the header/frontmatter block)",
      "approved": false,
      "critique": "Explain exactly what is wrong/missing in this specific section."
    }
  ]
}

[REJECT-ONLY REPORTING MANDATE]
1. If approved is true: approved MUST be true, isGlobalRevision MUST be false, globalCritique MUST be "", and sections MUST be empty.
2. If isGlobalRevision is true: approved MUST be false, isGlobalRevision MUST be true, globalCritique MUST describe the global issues, and sections MUST be empty.
3. If approved is false and isGlobalRevision is false: sections MUST ONLY contain sections that are rejected (with approved set to false). Any approved section MUST be strictly omitted from the array.`;

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
              contents: [{ parts: [{ text: compressPromptText(promptCritic) }] }],
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
                generationConfig: {
                  temperature: 0.35,
                  frequencyPenalty: 0.25,
                  topP: 0.85
                }
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
                  contents: [{ parts: [{ text: compressPromptText(promptRefineGlobal) }] }],
                  generationConfig: {
                    temperature: 0.35,
                    frequencyPenalty: 0.25,
                    topP: 0.85
                  }
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
                  generationConfig: {
                    temperature: 0.35,
                    frequencyPenalty: 0.25,
                    topP: 0.85
                  }
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
                    contents: [{ parts: [{ text: compressPromptText(promptJointRepair) }] }],
                    generationConfig: {
                      temperature: 0.35,
                      frequencyPenalty: 0.25,
                      topP: 0.85
                    }
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
          contents: [{ parts: [{ text: compressPromptText(promptSystemic) }] }],
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
      const compressedHealer = compressPromptText(promptHealer);
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: compressedHealer }] }]
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
          await recordMetrics('course_generation', 'gemini-2.5-flash', durationMs, promptTokens, candidatesTokens, compressedHealer);
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
            temperature: 0.1,
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
            contents: [{ parts: [{ text: compressPromptText(prompt) }] }],
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

function isBookReference(text: string): boolean {
  const lowercase = text.toLowerCase();
  const bookKeywords = [
    'presses universitaires', 'éditions', 'editions', 'publisher', 'publishing', 'university press', 
    'lgdj', 'dalloz', 'lexisnexis', 'gualino', 'lextenso', 'springer', 'routledge', 'oxford', 
    'cambridge', 'palgrave', 'book', 'livre', 'manuel', 'traité', 'précis', 'introduction au', 
    'droit de', 'droit des', 'droit civil', 'droit commercial', 'droit des affaires'
  ];
  const articleKeywords = [
    'journal of', 'review of', 'revue de', 'revue française', 'revue internationale',
    'vol.', 'no.', 'issue', 'tome', 'fascicule', 'colloque', 'actes du colloque', 
    'article', 'working paper', 'preprint', 'doi:'
  ];
  let bookScore = 0;
  let articleScore = 0;
  for (const kw of bookKeywords) {
    if (lowercase.includes(kw)) bookScore++;
  }
  for (const kw of articleKeywords) {
    if (lowercase.includes(kw)) articleScore++;
  }
  if (/, (paris|london|new york|boston|chicago|berlin|tokyo),/i.test(lowercase)) {
    bookScore += 2;
  }
  if (/\bp\.\s*\d+/i.test(lowercase)) {
    bookScore += 0.5;
  }
  return bookScore >= articleScore;
}

async function validateAndFixBibliography(mdx: string, targetLang: string = 'fr'): Promise<string> {
  // Find the bibliography section to isolate it from inline body citations
  const refHeaderRegex = /(?:^|\n)(?:#{2,4})\s*(?:R[eé]f[eé]rences|References|Bibliographie)\b/i;
  const matchHeader = mdx.match(refHeaderRegex);
  if (!matchHeader || matchHeader.index === undefined) {
    console.log("[BIBLIOGRAPHY VALIDATOR] No references header found. Skipping bibliography validation.");
    return mdx;
  }

  const headerIndex = matchHeader.index;
  const bodyText = mdx.slice(0, headerIndex);
  const referencesText = mdx.slice(headerIndex);

  const refRegex = /(?:<a\s+id="ref-(\d+)"[^>]*><\/a>)?\s*\[(\d+)\]\s*([\s\S]*?)(?=\n\s*(?:<a\s+id="ref-\d+"|\[\d+\]|###|---\s*|$))/g;
  let match;
  const replacements: { original: string; replacement: string; refId: string }[] = [];
  let networkDisabled = false;

  while ((match = refRegex.exec(referencesText)) !== null) {
    const fullMatch = match[0];
    const refId = match[1] || match[2];
    const refNum = match[2];
    const rawRefText = match[3].trim();

    const linkMatch = rawRefText.match(/\[(.*?)\]\((.*?)\)/);
    let refText = rawRefText;
    let refUrl = '';
    if (linkMatch) {
      refText = linkMatch[1];
      refUrl = linkMatch[2];
    }

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

    const isWebResource = !isBookReference(refText) || 
      /futura\s*science|futura-science|site|web|article\s*en\s*ligne|en\s*ligne|internet|blog|press|news/i.test(refText);

    for (let attempt = 0; attempt < 3; attempt++) {
      if (networkDisabled) {
        console.log(`[BIBLIOGRAPHY VALIDATOR] Network queries disabled (prior timeout/error). Skipping attempt ${attempt + 1}.`);
        break;
      }
      const query = queries[attempt];
      if (!query) continue;
      console.log(`[BIBLIOGRAPHY VALIDATOR] Attempt ${attempt + 1}/3 with query: "${query}" (isWebResource: ${isWebResource})`);

      if (isWebResource) {
        try {
          const wikiRes = await fetchWithTimeout(`https://${targetLang}.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(query)}&limit=1&format=json`);
          if (wikiRes.ok) {
            const data = await wikiRes.json();
            if (data && data[3] && data[3][0]) {
              resolvedUrl = data[3][0];
              resolvedTitle = data[1]?.[0] || refText;
              break;
            }
          }
        } catch (e: any) {
          console.warn(`[BIBLIOGRAPHY VALIDATOR] Wikipedia search attempt ${attempt + 1} failed:`, e);
          if (e && (e.name === 'AbortError' || e.message?.includes('fetch failed'))) {
            console.warn(`[BIBLIOGRAPHY VALIDATOR] Network error/timeout detected. Disabling future network validations.`);
            networkDisabled = true;
          }
        }
      }

      if (networkDisabled) break;
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
      } catch (e: any) {
        console.warn(`[BIBLIOGRAPHY VALIDATOR] Crossref attempt ${attempt + 1} failed:`, e);
        if (e && (e.name === 'AbortError' || e.message?.includes('fetch failed'))) {
          console.warn(`[BIBLIOGRAPHY VALIDATOR] Network error/timeout detected. Disabling future network validations.`);
          networkDisabled = true;
        }
      }

      if (networkDisabled) break;
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
      } catch (e: any) {
        console.warn(`[BIBLIOGRAPHY VALIDATOR] Google Books attempt ${attempt + 1} failed:`, e);
        if (e && (e.name === 'AbortError' || e.message?.includes('fetch failed'))) {
          console.warn(`[BIBLIOGRAPHY VALIDATOR] Network error/timeout detected. Disabling future network validations.`);
          networkDisabled = true;
        }
      }

      if (networkDisabled) break;
      if (!isWebResource) {
        try {
          const wikiRes = await fetchWithTimeout(`https://${targetLang}.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(query)}&limit=1&format=json`);
          if (wikiRes.ok) {
            const data = await wikiRes.json();
            if (data && data[3] && data[3][0]) {
              resolvedUrl = data[3][0];
              resolvedTitle = data[1]?.[0] || refText;
              break;
            }
          }
        } catch (e: any) {
          console.warn(`[BIBLIOGRAPHY VALIDATOR] Fallback Wikipedia search attempt ${attempt + 1} failed:`, e);
          if (e && (e.name === 'AbortError' || e.message?.includes('fetch failed'))) {
            console.warn(`[BIBLIOGRAPHY VALIDATOR] Network error/timeout detected. Disabling future network validations.`);
            networkDisabled = true;
          }
        }
      }
    }

    if (!resolvedUrl) {
      if (isWebResource) {
        resolvedUrl = `https://www.google.com/search?q=${encodeURIComponent(refText)}`;
        resolvedTitle = refText;
        console.log(`[BIBLIOGRAPHY VALIDATOR] Fallback to Google Search URL: ${resolvedUrl}`);
      } else {
        resolvedUrl = `https://books.google.com/books?q=${encodeURIComponent(refText)}`;
        resolvedTitle = refText;
        console.log(`[BIBLIOGRAPHY VALIDATOR] Fallback to Google Books Search URL: ${resolvedUrl}`);
      }
    }

    if (resolvedUrl) {
      const updatedRef = `<a id="ref-${refId}"></a>[${refNum}] [${resolvedTitle}](${resolvedUrl})`;
      replacements.push({ original: fullMatch, replacement: updatedRef, refId });
      console.log(`[BIBLIOGRAPHY VALIDATOR] Successfully resolved to alternative URL: ${resolvedUrl}`);
    } else {
      replacements.push({ original: fullMatch, replacement: '', refId });
      console.warn(`[BIBLIOGRAPHY VALIDATOR] Failed to resolve Reference #${refId}. Marking for removal.`);
    }
  }

  let updatedRefText = referencesText;
  for (const rep of replacements) {
    updatedRefText = updatedRefText.replace(rep.original, rep.replacement);
  }

  let updatedMdx = bodyText + updatedRefText;
  for (const rep of replacements) {
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
  // 0. Do not strip media/image/hover-card tags before validation to preserve pedagogical components.
  let updatedMdx = mdx;

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
            const newTag = `<Audio url="${altUrl}" title="${title}" duration="${duration}" />`;
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

  // Validate and fix GoingFurtherItem tags
  const goingFurtherRegex = /<GoingFurtherItem\b([^>]*?)(?:\/>|>([\s\S]*?)<\/GoingFurtherItem>)/gi;
  let goingFurtherMatch;
  const goingFurtherBlocks: { fullBlock: string; attributes: string }[] = [];
  while ((goingFurtherMatch = goingFurtherRegex.exec(updatedMdx)) !== null) {
    goingFurtherBlocks.push({
      fullBlock: goingFurtherMatch[0],
      attributes: goingFurtherMatch[1]
    });
  }

  if (goingFurtherBlocks.length > 0) {
    console.log(`[EXTERNAL RESOURCE VALIDATOR] Validating ${goingFurtherBlocks.length} GoingFurtherItem elements...`);
    for (const block of goingFurtherBlocks) {
      const getAttr = (name: string) => {
        const curlyMatch = block.attributes.match(new RegExp(`${name}\\s*=\\s*\\{\\s*["']?([^"'}]*)["']?\\s*\\}`, 'i'));
        if (curlyMatch) return curlyMatch[1].trim();
        const quoteMatch = block.attributes.match(new RegExp(`${name}\\s*=\\s*(["'])([\\s\\S]*?)\\1`, 'i'));
        if (quoteMatch) return quoteMatch[2].trim();
        const unquotedMatch = block.attributes.match(new RegExp(`${name}\\s*=\\s*([^\\s/>]+)`, 'i'));
        if (unquotedMatch) return unquotedMatch[1].trim();
        return '';
      };

      const url = getAttr('url');
      const title = getAttr('title');
      const author = getAttr('author');
      const type = getAttr('type').toLowerCase() || 'website';

      if (url) {
        // 1. Check if the URL is obviously a placeholder/fake
        const lowerUrl = url.toLowerCase();
        const isPlaceholder = 
          lowerUrl.includes('example.com') || 
          lowerUrl.includes('your_youtube_id') || 
          lowerUrl.includes('youtube.com/watch?v=xxxxxx') ||
          lowerUrl.includes('youtube.com/watch?v=abcdef') ||
          lowerUrl.includes('youtube.com/watch?v=12345') ||
          lowerUrl.includes('test.com') ||
          lowerUrl.includes('placeholder') ||
          lowerUrl.includes('fakeurl');

        let isValid = !isPlaceholder;
        
        // 2. If it's a YouTube url, check via oembed/isVideoReachable
        if (isValid) {
          if (/youtube\.com|youtu\.be/i.test(url)) {
            const videoId = url.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/i)?.[1] || '';
            if (!videoId || videoId === 'dQw4w9WgXcQ' || videoId === 'xxxxxxxxx') {
              isValid = false;
            } else {
              const checkUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}&format=json`;
              isValid = await isUrlReachable(checkUrl);
            }
          } else {
            isValid = await isLinkReachable(url);
          }
        }

        if (!isValid) {
          console.log(`[EXTERNAL RESOURCE VALIDATOR] GoingFurtherItem has invalid/dead URL: ${url}`);
          let alternativeUrl = '';

          // 3. Try to find a real alternative if it is a video/film
          if ((type === 'video' || type === 'film' || type === 'movie') && title) {
            const alternative = await findAlternativeVideoWithFallback(title, targetLang);
            if (alternative && alternative.url) {
              alternativeUrl = alternative.url;
              console.log(`[EXTERNAL RESOURCE VALIDATOR] Found alternative video URL for "${title}": ${alternativeUrl}`);
            }
          }

          // 4. Fallback: try Wikipedia search for non-video types
          if (!alternativeUrl && title && type !== 'video' && type !== 'film' && type !== 'movie') {
            try {
              const query = (type === 'book' && author) ? `${title} ${author}` : title;
              const wikiRes = await fetchWithTimeout(`https://${targetLang}.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(query)}&limit=1&format=json`);
              if (wikiRes.ok) {
                const data = await wikiRes.json();
                if (data && data[3] && data[3][0] && await isUrlReachable(data[3][0])) {
                  alternativeUrl = data[3][0];
                }
              }
            } catch {}
          }

          // 5. Update the tag (replace URL if found, else strip it)
          let newTag = block.fullBlock;
          if (alternativeUrl) {
            newTag = block.fullBlock.replace(/url="[^"]*"/gi, `url="${alternativeUrl.replace(/"/g, '&quot;')}"`)
                                    .replace(/url='[^']*'/gi, `url="${alternativeUrl.replace(/"/g, '&quot;')}"`);
          } else {
            newTag = block.fullBlock.replace(/\s*url="[^"]*"/gi, '')
                                    .replace(/\s*url='[^']*'/gi, '');
          }
          updatedMdx = updatedMdx.replace(block.fullBlock, newTag);
        }
      } else {
        // No URL in original — try to auto-resolve from title
        let resolvedUrl = '';
        if (title) {
          if (type === 'video' || type === 'film' || type === 'movie') {
            const alt = await findAlternativeVideoWithFallback(title, targetLang);
            if (alt && alt.url) resolvedUrl = alt.url;
          } else {
            for (const lang of [targetLang, 'en']) {
              try {
                const query = (type === 'book' && author) ? `${title} ${author}` : title;
                const wikiRes = await fetchWithTimeout(`https://${lang}.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(query)}&limit=1&format=json`);
                if (wikiRes.ok) {
                  const data = await wikiRes.json();
                  if (data && data[3] && data[3][0] && await isUrlReachable(data[3][0])) {
                    resolvedUrl = data[3][0];
                    break;
                  }
                }
              } catch {}
              if (resolvedUrl) break;
            }
          }
          if (resolvedUrl) {
            const newTag = block.fullBlock.replace(/(\/?>)$/, ` url="${resolvedUrl.replace(/"/g, '&quot;')}" />`);
            updatedMdx = updatedMdx.replace(block.fullBlock, newTag);
            console.log(`[EXTERNAL RESOURCE VALIDATOR] Auto-resolved URL for "${title}": ${resolvedUrl}`);
          }
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

  const promptCurriculum = `You are a Curriculum Planner Agent (Agent 0). Your goal is to structure a full academic curriculum for "${curriculumName}" at the level "${getDescriptiveLevelForPrompt(level)}".
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
          temperature: 0.1,
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
        const compressedCurriculum = compressPromptText(promptCurriculum);
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: compressedCurriculum }] }],
            generationConfig: {
              temperature: 0.1,
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
          await recordMetrics('course_generation', 'gemini-2.5-flash', durationMs, promptTokens, candidatesTokens, compressedCurriculum);
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
    const { resolvedContent } = await resolvePrecompiledAnchors(cleanedContent, lang);
    const { serialize } = await import('next-mdx-remote/serialize');
    const remarkMath = (await import('remark-math')).default;
    const remarkGfm = (await import('remark-gfm')).default;
    const rehypeKatex = (await import('rehype-katex')).default;
    
    await serialize(resolvedContent, {
      mdxOptions: {
        remarkPlugins: [remarkMath, remarkGfm],
        rehypePlugins: [rehypeKatex, rehypeMdxSanitizer(lang)],
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
    'References', 'Explanation', 'Solution', 'KeyConcept', 'Instruction', 'Shape',
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
    'CalloutContainer', 'Image', 'Biography', 'Citation',
    
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

export function extractCustomFigures(mdx: string): Array<{ type: string; description: string; title?: string; caption?: string; searchQuery?: string }> {
  const figures: Array<{ type: string; description: string; title?: string; caption?: string; searchQuery?: string }> = [];
  const regex = /<(CustomFigure|Image)\s+([^>]*)\/>/g;
  let match;
  while ((match = regex.exec(mdx)) !== null) {
    const attrsStr = match[2];
    const typeMatch = attrsStr.match(/type=(["'])([\s\S]*?)\1/i);
    const descMatch = attrsStr.match(/description=(["'])([\s\S]*?)\1/i);
    const titleMatch = attrsStr.match(/title=(["'])([\s\S]*?)\1/i);
    const captionMatch = attrsStr.match(/caption=(["'])([\s\S]*?)\1/i);
    const searchQueryMatch = attrsStr.match(/searchQuery=(["'])([\s\S]*?)\1/i);
    if (typeMatch && descMatch) {
      figures.push({
        type: typeMatch[2],
        description: descMatch[2],
        title: titleMatch ? titleMatch[2] : undefined,
        caption: captionMatch ? captionMatch[2] : undefined,
        searchQuery: searchQueryMatch ? searchQueryMatch[2] : undefined
      });
    }
  }
  return figures;
}

export function areMediaSimilar(fig1: any, fig2: any): boolean {
  if (fig1.type !== fig2.type) return false;
  const desc1 = fig1.description.toLowerCase().trim();
  const desc2 = fig2.description.toLowerCase().trim();
  if (desc1 === desc2) return true;
  
  const words1 = desc1.split(/\s+/).filter((w: string) => w.length > 3);
  const words2 = desc2.split(/\s+/).filter((w: string) => w.length > 3);
  if (words1.length === 0 || words2.length === 0) return false;
  let matches = 0;
  for (const w of words1) {
    if (words2.includes(w)) matches++;
  }
  const similarity = matches / Math.min(words1.length, words2.length);
  return similarity > 0.6;
}

