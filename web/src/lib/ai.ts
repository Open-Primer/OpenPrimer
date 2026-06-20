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

export async function correctCourseTitle(title: string, targetLang: string = 'en'): Promise<string> {
  const cleanTitle = title.trim();
  if (!cleanTitle || cleanTitle.length < 3) return title;
  
  const systemInstruction = `You are an elite academic copyeditor. Your task is to correct the spelling, grammar, accentuation, and capitalization of the course title in the language '${targetLang}'.
Rules:
- Standardize the capitalization (use Title Case appropriate for academic subjects in the target language).
- Correct any obvious spelling errors, typos, and punctuation issues.
- Do NOT translate the title to another language. Keep the original language if it makes sense (e.g., if the user wrote "droit des afaires" in French, correct it to "Droit des Affaires", not "Business Law").
- Respond with ONLY the corrected title text. Do not add any quotes, markdown formatting, explanations, or introductory text.`;

  const userPrompt = `Course Title to correct: "${cleanTitle}"`;

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
          if (sanitized && sanitized.length >= 3 && sanitized.length <= cleanTitle.length * 2 + 10 && !/sorry|error|apologize|cannot|unable/i.test(sanitized)) {
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
          if (sanitized && sanitized.length >= 3 && sanitized.length <= cleanTitle.length * 2 + 10 && !/sorry|error|apologize|cannot|unable/i.test(sanitized)) {
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
  const correctedCourseName = await correctCourseTitle(courseName, targetLang);
  console.log(`[TITLE CORRECTION] Corrected course title from "${courseName}" to "${correctedCourseName}"`);

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

# ETAPE 2 : ADAPTATION AU PUBLIC (GRADATION COGNITIVE)
Le plan doit refléter la capacité d'abstraction du public cible :
* **Primaire (CP-CM2) :** Approche narrative, inductive et ultra-visuelle. Le plan doit utiliser des métaphores concrètes. Maximum 3 grands axes très cours.
* **Collège/Lycée :** Transition vers la formalisation. Introduction des méthodes de la discipline (comment pense un historien ? comment calcule un physicien ?).
* **Supérieur (L1-L3) :** Formalisme académique strict, épistémologique et critique. Le plan doit inclure l'étude des limites des modèles présentés.

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
          console.log(`[AI GENERATOR] Found cached syllabus in task description for task ${taskId}. Reusing to prevent duplicate chapters.`);
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
    console.warn(`[AI GENERATOR WARNING] lessonOffset is ${lessonOffset} but no cached syllabus was found. Resetting offset to 0 to avoid duplicates and syllabus mismatch.`);
    lessonOffset = 0;
  }

  // If lessonOffset is 0, clear any existing lessons for this course and language to avoid duplicates from previous failed runs.
  if (lessonOffset === 0) {
    const cleanSlug = cleanPathSegment(correctedCourseName);
    console.log(`[AI GENERATOR] lessonOffset is 0. Clearing existing lessons for course "${cleanSlug}" and language "${targetLang.toLowerCase()}" to prevent duplicate chapters.`);
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
              console.log(`[AI GENERATOR] Successfully persisted generated syllabus to task description for task ${taskId}.`);
            }
          }
        } catch (err) {
          console.warn(`[AI GENERATOR WARNING] Failed to persist syllabus to task description:`, err);
        }
      }
    } catch (err) {
      console.error("AI Generation failed:", err);
      throw err;
    }
  }

    let completedLessons = lessonOffset;
    const updateTaskProgress = async () => {
      if (!taskId) return;
      completedLessons++;
      const currentProgress = 20 + Math.floor((completedLessons / lessonsList.length) * 70);
      try {
        await supabaseAdmin
          .from('task_queue')
          .update({ progress: Math.min(99, currentProgress) })
          .eq('id', taskId);
        console.log(`[TASK PROGRESS] Task ${taskId} updated to ${currentProgress}%`);
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
          console.log(`[INCREMENTAL] Skipping generation for already existing lesson: "${item.title}" (${item.slug})`);
          await updateTaskProgress();
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

      let promptPreamble = '';
      if (isLastLesson) {
        promptPreamble = `### EXIGENCE ABSOLUE : ÉVALUATION FINALE SOMMATIVE ET EXHAUSTIVE (ZÉRO VIDE)
Règle d'or : Cette dernière leçon est l'Évaluation Finale globale du cours "${correctedCourseName}". Elle ne doit PAS être un cours théorique classique, mais un examen complet et sérieux de validation qui couvre l'intégralité des concepts abordés dans l'ensemble des leçons précédentes.

Vous devez concevoir un examen d'évaluation final de haut niveau, qui prendra entre plusieurs dizaines de minutes et deux heures à réaliser. L'évitement ou la paresse textuelle (comme un quiz vide ou comportant seulement 2 ou 3 questions) sont strictement interdits et entraîneront le rejet immédiat du contenu.

Zéro Placeholder (Interdiction des squelettes) : Toutes les questions, options, explications, et consignes doivent être rédigées de manière exhaustive et complète.

Format du contenu de l'Évaluation Finale :
1. Introduction de l'Évaluation :
   - Un paragraphe d'introduction prestigieux rappelant le parcours de l'étudiant à travers le cours "${correctedCourseName}" et présentant les consignes de l'examen final.
   - Les objectifs pédagogiques de l'évaluation wrapped dans le composant custom \`<Objectives>\` (avec \`<Knowledge>\`, \`<Skills>\` et \`<Attitudes>\`).
2. Corps de l'Évaluation Finale :
   Générez un examen sommatif de qualité adapté à la discipline et au niveau du cours :
   
   * DISCIPLINE HUMANISTE / DISCURSIVE (Philosophie, Littérature, Histoire, Droit, Sciences Sociales, etc.) :
     - Vous devez obligatoirement insérer le composant de rédaction académique tutoré par IA :
       \`<EssayEvaluation prompt="[Un sujet d'examen final extrêmement complet, profond et structuré en plusieurs sous-questions couvrant l'ensemble du cours, obligeant l'étudiant à rédiger une synthèse approfondie]" gradingSystem="${targetLang.toLowerCase() === 'fr' ? '0/20' : 'A-F'}" subject="${correctedCourseName}" durationLimit={7200} />\`
     - Ajoutez également une série de 5 à 10 questions de réflexion critique à réponse ouverte.
     
   * DISCIPLINE SCIENTIFIQUE / TECHNIQUE / QUANTITATIVE (Mathématiques, Physique, Chimie, Informatique, Économie, etc.) :
     - Vous devez obligatoirement insérer un grand Quiz sommatif : \`<Quiz durationLimit={3600}>\` contenant entre 20 et 30 questions de haut niveau couvrant tous les chapitres du cours.
       Chaque question doit être rédigée sous la forme :
       \`<Question q="[Texte de la question]" explanation="[Explication alternative et constructive de la solution]">
         <Option text="[Option correcte]" correct={true} />
         <Option text="[Option erronée 1]" correct={false} />
         <Option text="[Option erronée 2]" correct={false} />
         <Option text="[Option erronée 3]" correct={false} />
       </Question>\`
     - Insérez également au moins 3 exercices résolus (\`<SolvedExercise>\`) et 3 exercices interactifs à réponse numérique (\`<UnsolvedExercise>\`).
     - Intégrez au moins un simulateur ou sandbox interactif de la discipline (\`<FunctionManipulator />\`, \`<EquationManipulator />\`, \`<Geometry2D />\`, \`<ChemicalStoichiometry />\` ou \`<CodeSandbox />\`).
     
   * NIVEAU PRIMAIRE (CP - CM2) :
     - Proposez un grand Quiz de 10 à 15 questions sous forme de défis (\`<Quiz durationLimit={1800}>\`) et des textes à trous (\`<FillInBlanks sentence="..." answer="..." />\`).
     
3. Glossaire et Références (comme d'habitude) :
   - Un glossaire complet réunissant tous les termes clés de l'évaluation et du cours.
   - Les références académiques de base du cours (pour les niveaux supérieurs, au moins 8 à 12 références).`;
      } else {
        promptPreamble = `### EXIGENCE ABSOLUE : DENSITÉ ACADÉMIQUE & INCOMPLÉTUDE INTERDITE
Règle d'or : Chaque cours doit être un produit d'apprentissage fini, autonome, exhaustif et immédiatement exploitable. L'évitement, la paresse textuelle et le résumé vague sont considérés comme des fautes critiques de génération.

Zéro Placeholder (Interdiction des squelettes) : Il est strictement interdit d'utiliser des formulations de type "Dans cette section, nous aborderons...", "Exemple à compléter...", ou "etc.". Tout concept introduit doit être intégralement développé, expliqué et illustré dans le corps du texte.

Interdiction absolue des balises de composants vides : Il est strictement proscrit de générer des balises de composants vides ou squelettiques (comme <Evaluation></Evaluation>, <SummativeEvaluation></SummativeEvaluation>, <Assignment></Assignment>, <Objectives></Objectives>, <Callout></Callout>, <CalloutContainer></CalloutContainer>, etc.). Si tu utilises l'un de ces composants, tu dois impérativement rédiger de manière détaillée et complète tout son contenu interne (questions, critères, textes, instructions). Tout composant vide ou partiellement rédigé sera rejeté.

Rigueur Factuelle et Précision Scientifique : Le ton doit être académique, précis et pédagogique. Utilisez les termes techniques exacts, immédiatement suivis de leur vulgarisation ou de leur ancrage dans le glossaire. Pas de généralités floues.

Profondeur Pédagogique : Si un cours nécessite 3 000 mots pour être traité avec la rigueur d'un niveau L3 (ou la clarté adaptée à un niveau Primaire), génerez l'intégralité du contenu requis. Ne sacrifiez jamais la substance pour la concision.

Critère de Rejet (Quality Gate) : Tout cours comportant des sections ou balises vides, des listes à puces non développées, des approximations factuelles ou des conclusions hâtives sera détecté par le script de validation, immédiatement rejeté sans paiement/crédit, et détruira la réputation de l'infrastructure. Tu agis ici en tant qu'expert académique mondial.`;
      }

      const promptContent = `${promptPreamble}

---

You are a world-class academic professor (Agent 3 - Academic Writer). Generate the complete, professional, extremely detailed academic MDX lesson content for the lesson "${item.title}" in the course "${correctedCourseName}" (${level}).

Pedagogical Context and Strategy (from Pedagogical Architect Agent 1 & 2):
${courseContext.pedagogicalStrategy ? `- Pedagogical Strategy: ${courseContext.pedagogicalStrategy}` : ''}
${courseContext.epistemologicalMatrix ? `- Epistemological Matrix / Discipline ADN: ${courseContext.epistemologicalMatrix}` : ''}
${item.cognitiveArtifact ? `- Expected Cognitive Artifact for this lesson: ${item.cognitiveArtifact}` : ''}
${item.technicalDepth ? `- Expected Guidelines and Technical Depth: ${item.technicalDepth}` : ''}

Requirements:
1. Use professional, premium academic styling.
2. Structure it beautifully using markdown headers, bullet points, and high-impact custom alerts like:
> [!NOTE]
> Detailed academic contextualization.
3. Level-Appropriate Content and Pedagogical Tone:
   - Carefully tailor the text density (number of paragraphs), vocabulary complexity, conceptual depth, and mathematical/scientific formulas strictly to the student's presumed level ("${level}").
   - The pedagogical tone must be highly engaging, educational, and respectful: it must be neither oversimplifying (dumbed-down), nor condescending, nor pedantic.
   - Use simpler, intuitive conceptual analogies and foundational mathematics for lower levels, and high formal rigor and advanced academic notation only for university levels, maintaining clarity and academic dignity at all levels.
   - Pedagogical Toolset & Disciplinary Adaptation (Outils Pédagogiques & Adaptations Disciplinaires) : Depending on the level, discipline, and context, you must dynamically align your pedagogical delivery:
       * Biology / Anatomy / Life Sciences: Prioritize visual illustrations, functional anatomical mappings, and physiological transport flow metaphors.
       * Mathematics / Theoretical Physics: Focus on absolute formal rigor; systematically declare precise definitions, lemmas, theorems, and corollaries, backed by clean mathematical proofs.
       * Philosophy / Humanities: Focus on rhetoric, comparative dialectics, historical controversy analysis, and conceptual debates.
       * Experimental Sciences (Chemistry, Physics): Deliver concepts following the empirical cycle: Hypothesis → Observation → Experimentation → Conclusion.
       * Engineering / Computer Science: Focus on applied sandboxes, algorithm tracing, engineering design patterns, and retroactive problem-solving exercises.
4. Systematic Course Structure (Prerequisites, Diagnostic Quiz, Introduction, Objectives, and Conclusion):
   - At the very beginning of the MDX content (before the Introduction), you MUST systematically insert a \`Prerequisites\` block:
     \`<Prerequisites items={[{ title: "Prerequisite Course Title", slug: "slug_of_prerequisite", level: "level_of_prerequisite", subject: "subject_of_prerequisite" }]} />\`
     List 1 to 2 logical strict prerequisite courses from lower levels or earlier progression.
   - Immediately after the Prerequisites block (and before the Introduction), you MUST insert a single diagnostic test flash block to allow adaptive skipping:
     \`<DiagnosticQuiz question="Diagnostic Question text" options={["Option A", "Option B", "Option C"]} correctIndex={0} targetSectionId="section-slug-to-skip-to" sectionTitle="Section Title to Skip" />\`
     This question should test the entry concepts of the first sections. If the user answers correctly, it lets them skip directly to the target section.
   - You MUST start the lesson with a clear, engaging "Introduction" or "Présentation" section (using a heading like "## Introduction" or "## Présentation" in the course language). This section must set the stage, define the learning objectives, and present the scope of the lesson.
   - Immediately after the introduction section, you MUST systematically insert the explicit learning objectives following the KSA (Knowledge, Skills, Attitudes) model. You MUST wrap the objectives inside the custom \`<Objectives>\` component, using the \`<Knowledge>\`, \`<Skills>\`, and \`<Attitudes>\` sub-components:
      \`<Objectives>
        <Knowledge>
          <ul className="list-disc pl-4 space-y-1">
            <li>Distinguer...</li>
            <li>Expliquer...</li>
          </ul>
        </Knowledge>
        <Skills>
          <ul className="list-disc pl-4 space-y-1">
            <li>Résoudre...</li>
            <li>Calculer...</li>
          </ul>
        </Skills>
        <Attitudes>
          <ul className="list-disc pl-4 space-y-1">
            <li>Apprécier...</li>
            <li>Analyser de manière critique...</li>
          </ul>
        </Attitudes>
      </Objectives>\`
      Segment the learning targets into three distinct axes: Knowledge (Savoir - concepts), Skills (Savoir-faire - application), and Attitudes (Posture/Analyse). If the course level is L3 (Bachelor 3ème année ou Senior Undergraduate), you MUST use Revised Bloom's Taxonomy verbs (Analyze, Evaluate, Create / Analyser, Évaluer, Créer) for these objectives.
   - You MUST conclude the lesson content (immediately before the evaluation) with a concluding section (using the heading "## Conclusion" or localized equivalent). Do NOT use headings like "## Synthèse & Discussion" or "## Synthèse & Ouverture", but the concluding section itself must contain the synthesis, discussion, questioning, and opening (synthèse, discussion, questionnement, ouverture) written in a natural, flowing manner.
    - This concluding section must contain:
      * A structured summary of the key takeaways using the custom \`<Summary items={["Key point 1", "Key point 2", ...]} />\` component. Each item in the array MUST be a complete, grammatically whole, and self-contained sentence in the course's language. Under NO circumstances should you split a single sentence, clause, or paragraph across multiple items or artificial bullet points. Provide exactly 3 to 4 points, each representing a distinct, complete educational takeaway.
      * A structured content block covering the synthesis, discussion, questioning, and opening (synthèse, discussion, questionnement, et ouverture) toward further study or neighboring fields. You can write multiple, lengthy paragraphs if appropriate for the course level and subject, but the text must flow naturally and you MUST NOT use any sub-headings or labels (do NOT write sub-headings like "Synthèse" or "Discussion").
5. Conceptual framework, historical perspective, and concrete real-world applications in the body of the lesson.
   - **Author Quotes (Citations d'auteurs, complete academic citations required)**: To capture student interest, anchor theoretical claims, and break text monotony, you MUST systematically weave high-impact, contextually relevant quotes from notable authors, scientists, and philosophers directly into the text. Format these quotes as standard markdown blockquotes, providing a complete bibliographic citation as the source (author, book title, publishing house, city, year, and page numbers):
     \`> "Quote text..." — Author name, *Book/Publication Title*, Publisher, City, Year, p. PageNumber\`
     Ensure every quote is beautifully integrated. If a quote is in a language other than the lesson's target language (e.g., an English quote in a French lesson), you MUST systematically translate it into the target language of the lesson and display the translation in brackets (e.g., [Traduction : ...] or [Translation: ...]) immediately following the quote. Every quote must be followed by a dedicated paragraph explaining its conceptual implications and context.
6. Controlled Digressions (Encadrés Epistémologiques):
   - If the course level is university level (L1, L2, L3 / undergraduate_1, undergraduate_2, undergraduate_3), you MUST systematically insert at least one controlled digression box in the body of the lesson using the custom component:
     \`<Epistemology title="Title of Digression">...</Epistemology>\`
     This box must explore the history of the concept, past controversies, or current limits/criticisms, breaking the dogmatic tone of the AI-generated text.
7. Include some math formulas in LaTeX (using $ or $$ wrappers) where appropriate for the level.
8. Radical Accessibility, Captions, Figuring & Failures (Accessibilité Radicale, Légendes, Numérotations et Secours) :
   - Guarantee that EVERY SINGLE image, diagram, table, code block, or visual/multimedia container systematically includes detailed, descriptive, and meaningful alt tags, aria-labels, and semantic text summaries to ensure total accessibility for screen readers and TTS (Text-To-Speech) voice synthesizers.
   - **Systematic Proportional Visual Enrichment & Decorative AI Ban**: Visual impact is crucial for learner appeal and engagement. However, you MUST strictly adhere to the following rules:
     * **STRICT BAN ON GENERIC/DECORATIVE AI IMAGES (INTERDICTION DES FIGURES DÉCORATIVES SANS VALEUR AJOUTÉE)**: You are strictly forbidden from generating or including low-value, simple, or generic decorative AI-generated illustrations (such as a simple balance to symbolize justice in a business law course, a generic gear for physics, or a lightbulb for ideas). All figures, images, and diagrams must have strong pedagogical, technical, or historical value (e.g., technical schematics, structural details, complex conceptual models, maps, or real artworks). Simple symbolic illustrations (like a balance) are tolerated ONLY for primary/elementary levels (CP-CM2). For high school (Lycée) and university levels (Supérieur), prioritize high-quality Wikimedia Commons diagrams, conceptual flowcharts ("Mermaid"), or specific, detailed academic illustrations.
     * *Minimum Baseline*: Include at least 2 to 3 high-impact illustrative images for abstract, formal, or symbolic courses (e.g., mathematics, logic, theoretical physics) to set the context or show direct visual applications of the concepts.
     * *High Visual Density (5 to 10+ images)*: For visual, spatial, empirical, or historical subjects (e.g., visual arts, geography, history, biology, architecture, geology, cinema), you MUST systematically include a much larger density of illustrative images directly related to the local context (e.g., specific artworks, maps, geographical features, historical artifacts, biological structures).
     * *Adaptation to Level*: For Primary levels (CP-CM2), maintain an extremely high illustration density (images every few paragraphs) to scaffold reading comprehension. For advanced levels (Lycée to L3), prioritize highly detailed visual figures illustrating specific, complex academic aspects.
   - **Secure Pollinations.ai Image Generation**: All images must be securely loaded using the following markdown URL syntax:
     \`![Alt Text](https://image.pollinations.ai/prompt/{descriptive_english_prompt_with_underscores}?width=800&height=600&nologo=true)\`
     *The prompt inside the curly braces MUST be written in English (the image generator's native language) for high aesthetic quality, be highly specific and illustrative, and use ONLY underscores (\`_\`) or hyphens (\`-\`) instead of spaces. Do NOT include raw spaces, quotes, or special characters in the URL, as they break rendering.*
   - **Prefer Wikimedia Commons for Real/Complex Illustrations**: For complex biological, chemical, physical, geographical, or anatomical diagrams (such as the plasma membrane structure, cell anatomy, molecular models, or historical maps), you MUST prefer using high-quality public domain images from Wikimedia Commons instead of generating lower-quality AI images (via Pollinations.ai) or building overly simplistic/incomplete custom interactive diagram components. Specify the real Wikimedia Commons image URL in the markdown syntax (e.g. \`![Structure of the Plasma Membrane](https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Cell_membrane_detailed_diagram_en.svg/1024px-Cell_membrane_detailed_diagram_en.svg.png)\`) and link to it in the references section.
   - **Systematic captions & sequential numbering (Légendage et Titrage)**: Every image/figure, video player, and audio player MUST be sequentially captioned and numbered directly below the element using italicized text:
     * For an Image/Figure: \`*Figure X : [Titre explicite] - [Description détaillée de ce qu'affiche l'image]. Source : [Spécifier systématiquement la source, par exemple "Wikimedia Commons" ou "Image générée par une intelligence artificielle à titre d'illustration"].*\`
     * For a Video: \`*Vidéo X : [Titre de la vidéo] - [Résumé structuré du contenu de la vidéo]. Source : [Spécifier systématiquement la source, par exemple "YouTube", "Vimeo", ou "Vidéo générée par une intelligence artificielle"].*\`
     * For an Audio track: \`*Audio X : [Titre de la piste audio] - [Transcription textuelle complète de ce qui est prononcé]. Source : [Spécifier systématiquement la source, par exemple "Enregistrement historique" ou "Audio généré par synthèse vocale d'intelligence artificielle"].*\`
   - **Footnote referencing**: Link every major actual external illustration, audio, or video resource to a reference/source at the bottom of the page using inline footnote superscript tags, e.g. <sup><a id="ref-src-1" href="#ref-1">1</a></sup>. Do NOT add footnotes or source references for system-generated flowcharts, interactive diagrams, sandboxes, equation solvers, or simulators, as they are constructed programmatically on the fly.
   - **Failures and Redirect links**: Directly below the caption of actual external resources that possess a real external origin (e.g. external images, audio, or video files with URLs), systematically insert a very short, non-intrusive source link in the format [Source](url) (or translated equivalent in the course's target language: e.g., [Source](url) in French/English, [Fuente](url) in Spanish, [Quelle](url) in German, [来源](url) in Chinese). Under NO circumstances should you use long verbose phrases like "Accéder directement à la ressource" or combine multiple languages. If the resource was generated by an artificial intelligence (e.g., Pollinations.ai images, AI-synthesized audio, or AI-generated video simulations), you MUST NOT insert any redirect link (as there is no external URL), but instead ensure the italicized caption itself explicitly states it was generated by an artificial intelligence.
9. Glossary and Highlighted Terms with Wikipedia integration :
   - For every key, complex, or specific academic term introduced or highlighted in the text, you MUST wrap it in the custom \`<Glossary term="Term" definition="Clear, concise academic definition...">Term</Glossary>\` component.
   - At the bottom of the page (after the main content), systematically add a Glossary section (using the heading \`### Glossaire\` if writing in French, or \`### Glossary\` if in English/other languages) that lists all of these glossary terms alphabetically.
   - **Systematic bottom Wikipedia redirects**: Every static entry in the bottom glossary list MUST contain a direct hyperlink to the corresponding Wikipedia page in the course language. Write them statically using a SINGLE-bracket Markdown link (NOT double-bracket) like: **Term** : Definition. [Wikipédia](https://${targetLang.toLowerCase()}.wikipedia.org/wiki/Wikipedia_Page_Title_In_Underscores). CRITICAL: Use ONLY a single pair of square brackets \`[Wikipédia](url)\` — NEVER double brackets \`[[Wikipédia](url)]\` as this produces a stray closing parenthesis \`)\` on screen. The Wikipedia link MUST NOT be wrapped in bold asterisks. Correct format: **Term** : Definition. [Wikipédia](url). Incorrect formats: **Term** : Definition. **[Wikipédia](url)** OR **Term** : Definition. [[Wikipédia](url)]. Do NOT wrap them in \`<Glossary>\` inside this bottom glossary list.
10. Connected Entities: Historical Figures, Fictional Characters, Key Geographic Places, and Artworks (Personnalités, Personnages Fictifs, Lieux Clés, et Œuvres d'art) :
    - Wrap all connected, illustrative entities mentioned in the text to enrich the course with hover-based overlays and Wikipedia redirects. To ensure complete resilience and avoid empty cards/warning boxes when Wikipedia summary requests fail client-side (e.g. due to minor spelling or casing mismatches), you MUST systematically define a high-quality 2-3 line fallback description in the "bio" (for persons) or "description" (for non-persons) attribute:
      * **Historical Figures, Authors, and Scientists**: For EVERY historical figure, scientist, writer, director, or real person mentioned in the main body text (outside of JSX component attribute list properties like options, explanation, knowledge, skills, attitudes arrays), you MUST systematically append their birth and death dates in parentheses right after their name (e.g., "(1643 - 1727)" or "(né en 1941)" / "(born 1941)" for living figures, or "(1769 - 1821)"). Wrap BOTH their name and their dates in the custom React component, and ALWAYS provide a high-quality 2-3 line biographical summary in the \`bio\` attribute (built on the fly) as a secure network fallback:
        \`<HistoricalPerson name="Exact_Wikipedia_Page_Title" lang="target_language_code" bio="A 2-3 line biography generated on the fly detailing their major achievements and relevance to the course.">DisplayName (Dates)</HistoricalPerson>\`.
        *IMPORTANT*: Do NOT require or place '<HistoricalPerson>' tags inside JSX component attribute properties (like inside 'options', 'explanation', 'knowledge', 'skills', or 'attitudes' arrays/objects of \`<Quiz>\`, \`<DiagnosticQuiz>\`, \`<Objectives>\` etc.), as nesting JSX elements inside JavaScript strings or array attributes is syntactically invalid in MDX and will crash the parser. Keep names as plain text when they appear inside these attributes. Also, do NOT wrap names or titles in '<Artwork>', '<Location>', or '<HistoricalPerson>' tags inside markdown image captions or figure titles, as these are transformed into JSX attributes and will display the raw HTML/JSX tags literally on the page. Keep captions as plain text.
        *IDEMPOTENCY / NO DUPLICATION*: Do NOT wrap a historical figure in a '<HistoricalPerson>' tag if they are already wrapped in one, and do NOT place a '<HistoricalPerson>' tag inside the bold title of a '**Mini-Biographie**' block (keep the title simple as plain text, e.g., '**Mini-Biographie : DisplayName (Dates)**', and only wrap the first mention of the person in the actual biography content/text below the title). Duplicate or nested '<HistoricalPerson>' tags for the same person are strictly prohibited.
        - Examples (French): \`<HistoricalPerson name="Isaac_Newton" lang="fr" bio="Physicien et mathématicien anglais, théoricien de la gravitation universelle et des lois du mouvement.">Isaac Newton (1643 - 1727)</HistoricalPerson>\`
        - Examples (English): \`<HistoricalPerson name="Isaac_Newton" lang="en" bio="English physicist and mathematician who formulated the laws of motion and universal gravitation.">Isaac Newton (1643 - 1727)</HistoricalPerson>\`
      * **Artworks and Works of Art (Œuvres d'art)**: For notable artworks mentioned in the text (e.g. paintings, sculptures, literary works, monuments like "L'Homme de Vitruve", "La Joconde", "La Cène", "La Nuit étoilée"), you MUST wrap them in \`<Artwork>\` and ALWAYS include a \`description\` attribute:
        \`<Artwork name="Exact_Wikipedia_Page_Title" lang="target_language_code" description="A 2-3 line fallback description of the artwork, its creator, dates, and significance.">DisplayName</Artwork>\`.
        - Example (French): \`<Artwork name="L'Homme_de_Vitruve" lang="fr" description="Célèbre dessin annoté de Léonard de Vinci datant de 1490, représentant les proportions idéales du corps humain selon Vitruve.">l'Homme de Vitruve</Artwork>\`
        - Example (English): \`<Artwork name="Vitruvian_Man" lang="en" description="Famous pen and ink drawing by Leonardo da Vinci around 1490, illustrating human body proportions according to Vitruvius.">Vitruvian Man</Artwork>\`
      * **Contextual Mini-Biographies (Minibios)**: To provide rich biographical context for key, central figures of the lesson (especially in history, philosophy, literature, and history of science), you MUST systematically include at least one detailed mini-biography panel directly inside the lesson text. Wrap this biography inside a styled information box (using standard markdown alert blocks like \`> [!INFO]\` or \`> [!NOTE]\` with a prominent title, e.g., \`> [!INFO] **Mini-Biographie : DisplayName (Dates)**\`). This mini-biography must be substantial and detailed: at least 4 to 6 lines for Primary/Collège levels, and at least 8 to 12 lines for high school (Lycée) or university levels (Supérieur), highlighting their primary academic contributions, major life events, and how their work specifically relates to the concepts covered in this lesson. At the end of the mini-biography text, you MUST systematically include a direct hyperlink to the person's Wikipedia page using standard markdown link syntax: \`[En savoir plus sur Wikipédia](https://\${targetLang.toLowerCase()}.wikipedia.org/wiki/Wikipedia_Page_Title_In_Underscores).\`
      * **Fictional Characters (Personnages de fiction)**: For fictional or mythological characters (like "Sherlock Holmes", "Mickey Mouse"), wrap them in the custom component and ALWAYS include a \`description\` attribute: \`<FictionalCharacter name="Exact_Wikipedia_Page_Title" lang="target_language_code" description="A 2-3 line fallback description of the character, their creator, source work, and role.">CharacterName</FictionalCharacter>\`.
        - Example (French): \`<FictionalCharacter name="Mickey_Mouse" lang="fr" description="Personnage de dessin animé emblématique de la Walt Disney Company créé en 1928, une souris anthropomorphe mondialement connue.">Mickey Mouse</FictionalCharacter>\`
        - Example (English): \`<FictionalCharacter name="Sherlock_Holmes" lang="en" description="Personnage de fiction britannique créé par Sir Arthur Conan Doyle en 1887, détective privé doté d'une mémoire et d'un esprit de déduction exceptionnels.">Sherlock Holmes</FictionalCharacter>\`
      * **Key Geographic Places (Lieux géographiques)**: For key cities, countries, regions, monuments, or geographical features (like "Château de Versailles", "Paris"), wrap them in the custom component and ALWAYS include a \`description\` attribute: \`<Location name="Exact_Wikipedia_Page_Title" lang="target_language_code" description="A 2-3 line fallback description of the location, its geography or history, and relevance.">PlaceName</Location>\`.
        - Example (French): \`<Location name="Château_de_Versailles" lang="fr" description="Résidence royale et monument historique situé à Versailles, symbole du pouvoir absolu de Louis XIV et joyau de l'art classique français.">Château de Versailles</Location>\`
        - Example (English): \`<Location name="Palace_of_Versailles" lang="en" description="Royal residence and historical monument located in Versailles, symbol of Louis XIV's absolute power and French classical art.">Palace of Versailles</Location>\`
      * **Historical Events (Événements historiques)**: For major historical events, revolutions, battles, or scientific milestones (like "Prise de la Bastille", "Storming of the Bastille"), wrap them in the custom component and ALWAYS include a \`description\` attribute: \`<HistoricalEvent name="Exact_Wikipedia_Page_Title" lang="target_language_code" description="A 2-3 line fallback description of the event, its dates, key participants, and historical impact.">EventName</HistoricalEvent>\`.
        - Example (French): \`<HistoricalEvent name="Prise_de_la_Bastille" lang="fr" description="Événement révolutionnaire survenu le 14 juillet 1789 à Paris, marquant la chute du symbole de l'absolutisme royal et le début de la Révolution française.">Prise de la Bastille</HistoricalEvent>\`
        - Example (English): \`<HistoricalEvent name="Storming_of_the_Bastille" lang="en" description="Key revolutionary event on July 14, 1789 in Paris, marquant la chute du symbole de l'absolutisme royal et le début de la Révolution française.">Storming of the Bastille</HistoricalEvent>\`
    - Note: The \`name\` attribute must be the exact Wikipedia page title in the target language of the course (using underscores for spaces), and the \`lang\` attribute must be the language of the course ("${targetLang.toLowerCase()}").
11. Intermediate Formative Scale-Based Evaluations (Évaluations formatives proportionnelles) :
    - Throughout the body of the lesson, place a custom \`<Quiz>\` block after each key sub-concept (every 5-10 minutes of reading).
    - Crucially, every single quiz and question generated MUST be fully filled and contains quality questions and options/answers directly related to the target course level, the length, and the complexity of the subject. There should be absolutely no empty, generic, or trivial quizzes.
    - The size of these quizzes MUST scale and be proportional to the complexity and length of the concept: use 1 to 2 \`<Question>\` elements for simple introductory sections, but 3 to 4 \`<Question>\` elements for deep, dense academic sections.
    - For every question in these intermediate quizzes, you MUST provide a detailed, supportive, and alternative explanation using the \`explanation\` attribute on the \`<Question>\` component:
      \`<Question q="Question text" explanation="Detailed alternative explanation, using different analogies, breaking down the steps simply, to help learners who fail to understand.">...\`
      This acts as pedagogical rerouting: if the student fails the question, the tutor will spontaneously react by showing this custom rerouting explanation.
12. Mandatory Proportional, Long & Timed End-of-Lesson Evaluation (Évaluation finale proportionnelle, validante et chronométrée) :
    - You MUST systematically place an evaluation block at the very end of the main lesson content (after the Conclusion/Synthèse section, but before the Glossary and References sections).
    - **Enforce longer, validating evaluation**: The end-of-lesson/end-of-course evaluations must be comprehensive, fully validating, and high-quality. Provide a substantial set of questions or essay prompts (e.g. at least 4 to 6 questions for typical lessons, and 8 to 12 comprehensive questions for deep, university-level chapters) to thoroughly assess all key lesson concepts.
    - **Mandatory Timed Challenges (\`durationLimit\` attribute)**: To break learning monotony and encourage focused self-assessment, you MUST systematically set a clear, reasonable duration limit on these final evaluations using the \`durationLimit={seconds}\` attribute (e.g. \`durationLimit={300}\` for 5 minutes, \`durationLimit={600}\` for 10 minutes, or \`durationLimit={900}\` for 15 minutes depending on the question count and complexity).
    - You MUST NOT limit evaluations to MCQ quizzes only! You MUST actively diversify the evaluation format based on the discipline, level, and context:
      * MCQ Quizzes: Use the custom \`<Quiz durationLimit={seconds}>\` component with multiple \`<Question>\` elements inside. Excellent for scientific, math, or factual topics.
        - **STRICT FLAT-PROP SYNTAX FOR QUIZZES**: You MUST format quizzes strictly using the Flat-Prop pattern. Option text and its correctness state MUST be passed entirely as attributes, and the \`<Option />\` tag MUST be self-closing:
          \`<Quiz>\`
            \`<Question q="Question text" explanation="Alternative helper explanation for students who get it wrong...">\`
              \`<Option text="Correct answer option" correct={true} />\`
              \`<Option text="Wrong answer option" correct={false} />\`
            \`</Question>\`
          \`</Quiz>\`
        - **NO PEDAGOGICAL TAGS**: It is strictly forbidden to use tags like \`<Explanation>\`, \`<Solution>\`, \`<KeyConcept>\`, \`<Instruction>\`, or \`<Shape>\` directly inside or outside the quizzes. Always pass explanation text in the \`explanation\` attribute of the \`<Question>\` component, or use approved worked example components like \`<SolvedExercise>\` and \`<UnsolvedExercise>\`.
      * Essay & Written Evaluations (Manual Tutor Grading): Use the custom \`<EssayEvaluation prompt="..." gradingSystem="..." subject="..." durationLimit={seconds} />\` component. You MUST systematically select this format for humanities, literature, history, social sciences, philosophy, law, or any deep conceptual/theoretical discussions where students are expected to write a structured analysis or synthesis. This will be manually reviewed, critiqued, and graded by the AI tutor.
        - The \`prompt\` must be the essay question/topic in "${targetLang.toUpperCase()}".
        - The \`gradingSystem\` attribute MUST be chosen based on the course's country/cultural context: use "0/20" for French/Francophone settings, "A-F" for US/UK/International settings, "0/10" for general European settings, or "pass-fail" for introductory courses.
        - The \`subject\` attribute must be the name of the subject (e.g. "Physics", "Biology", "Philosophy", "Law").
13. Evaluation Matrix by Level (Matrice d'Évaluation par Niveau):
    You MUST strictly select the appropriate evaluation form and objectives depending on the target student level ("${level}"):
    - Primaire (CP-CM2): Gamification, visual identification, short fill-in-the-blanks (\`<FillInBlanks sentence="..." answer="..." />\`). Cognitive Objective: Recognition and simple retrieval (Reconnaissance et Restitution simple). Tutor Role: Immediate binary validation.
    - Collège (6e-3e): Complex multiple-choice questions (real MCQs using \`<Quiz>\` and \`<Question>\`), causal matching, short-answer questions. Cognitive Objective: Comprehension and direct application (Compréhension et Application directe). Tutor Role: Distractor analysis (explaining why a specific wrong option was chosen).
    - Lycée au Supérieur (L1-L3): Case studies, open-ended problem solving, essays/synthesis writing (\`<EssayEvaluation />\`), document/code analysis. Cognitive Objective: Analysis, critical thinking, and transfer of knowledge to unfamiliar contexts (Analyse, Critique, Transfert à un contexte inconnu). Tutor Role: Multi-criteria evaluation (Rubrics) via LLM grading with detailed feedback.
14. Clickable Footnotes and References:
   ${isPrimary ? `
   - Since this is a primary school level course, DO NOT include any bibliography or references section.` : `
   - Systematically include a bibliography/references section at the very end of the page (after the Glossary), using the heading \`### Références\` if writing in French, or \`### References\` if in English/other languages.
   
   - **Academic Level Scaling for Reference Counts**:
     The number of references must scale proportionally with the academic depth of the course level ("${level}"):
     * *Collège / Lycée (Secondary school)*: Must systematically include exactly 3 to 5 references.
     * *University Level (L1, L2, L3, Master, Doctorat, undergraduate_1, undergraduate_2, undergraduate_3, graduate)*: Must systematically include at least 8 to 12 references (une bonne dizaine). Since this course level is "${level}", you must STRICTLY respect this reference count requirement.
   
   - **Citation Completeness — Discipline-Specific Bibliographic Standard**:
      Do NOT generate simple titles or placeholders. You MUST apply the **${getCitationStyle(courseContext.discipline || correctedCourseName).fullName}** citation standard to ALL references in this lesson, as it is the internationally recognised standard for this discipline.

      **Bibliographic format to use strictly: ${getCitationStyle(courseContext.discipline || correctedCourseName).name}**

      Format examples:
      * *Book*: ${getCitationStyle(courseContext.discipline || correctedCourseName).bookExample}
      * *Journal Article*: ${getCitationStyle(courseContext.discipline || correctedCourseName).articleExample}
      * *Book Chapter*: ${getCitationStyle(courseContext.discipline || correctedCourseName).chapterExample}
      * *Website / Online resource*: ${getCitationStyle(courseContext.discipline || correctedCourseName).websiteExample}

      Additional rules: ${getCitationStyle(courseContext.discipline || correctedCourseName).notes}

      Every reference MUST contain a real, high-quality link using Markdown link syntax \`[Citation details.](URL)\` with real, active URLs from databases, DOIs, publisher pages, or academic websites. Crucial: Do NOT include raw URLs in the bracketed link text. The bracketed link text must contain ONLY the formatted citation details following the ${getCitationStyle(courseContext.discipline || correctedCourseName).name} format above. The bracketed link text MUST end with a trailing period. Ensure all citations include complete bibliographic details for academic credibility.
   
   - **Active Bidirectional Links**:
     Every reference in the bibliography section MUST correspond to a footnote citation in the text.
     * *In the Body Text*: Place inline superscript/link citations exactly like this: \`<sup><a id="ref-src-X" href="#ref-X">X</a></sup>\` where X is the sequential footnote number starting at 1.
     * *In the References Section*: Each reference item must be its own distinct paragraph separated by a double newline. Prefix each item with its return-link anchor: \`<a id="ref-X" href="#ref-src-X">**[X]**</a> [Complete Academic Citation.](https://example.org/article-url)\` (where the bracketed text contains NO raw URLs, and the citation uses standard quotes rather than asterisks), so that clicking the inline superscript number smoothly scrolls down to the reference at the bottom, and clicking the \`**[X]**\` in the reference at the bottom smoothly scrolls back up to the exact footnote position in the body text.
   
   - Just before the References section, you CAN optionally include a "Pour aller plus loin" (Going Further) block to suggest deep-dive academic or research references (books, articles, videos, websites). Use the \`<GoingFurther>\` and \`<GoingFurtherItem>\` components as follows:
      \`\`\`mdx
     <GoingFurther title="Pour aller plus loin...">
       <GoingFurtherItem title="Title of Book" type="book" description="Brief description of why this book is relevant and highly recommended." />
       <GoingFurtherItem title="Academic Research Paper" type="research" url="https://doi.org/...or-real-url" description="Detailed description of this paper's advanced concepts." />
       <GoingFurtherItem title="Recommended Video Explainer" type="video" url="https://youtube.com/..." description="Short summary of this excellent 2-minute video visual breakdown." />
     </GoingFurther>
      \`\`\``}
 15. Short Audio and Video Duration Limits (Micro-learning):
     - To optimize student focus and prevent attention loss, all recommended or embedded videos (using \`<Video id="..." title="..." provider="..." duration="..." />\` or \`<Video url="..." title="..." duration="..." />\`) and audio tracks (using \`<Audio url="..." title="..." duration="..." />\`) MUST be short (maximum 2 to 3 minutes long).
     - You MUST systematically populate the \`duration\` attribute (e.g. \`duration="2 min"\` or \`duration="1:45"\`) and keep it within this short micro-learning boundary.
 16. Authentic Resource References:
     - All external resources, including video IDs, audio URLs, and bibliography references, will be automatically checked for reachability and validated against live APIs (e.g. Crossref, Google Books, YouTube). Do not invent fake or hallucinated URLs or media IDs.
 17. Mandatory and Discipline-Specific Visual, Interactive & Auditory Elements (Éléments visuels, interactifs et auditifs obligatoires par discipline) :
      - You MUST systematically integrate highly interactive and visual elements into the lesson content to enhance comprehension and engagement. These are NOT optional for their respective disciplines and are critical to visual and auditory learning:
        * Biology, Anatomy, Medicine, or Life Sciences: You MUST systematically insert at least one highly detailed custom \`<InteractiveDiagram>\` component. Do NOT use default placeholders. You MUST specify a custom \`title\`, a \`type\` (choose 'cell' for cellular structures, 'neuron' for neurons/nervous cells, or 'custom' for any other structures, organs, or pathways), and a custom \`hotspots\` array defining 3 to 6 distinct elements relevant to the topic.
           Example for a neuron:
           \`<InteractiveDiagram title="Anatomie du neurone moteur" type="neuron" hotspots={[
             { id: "soma", name: "Soma", x: 35, y: 50, description: "Corps cellulaire contenant le noyau et assurant la synthèse des protéines." },
             { id: "dendrites", name: "Dendrites", x: 15, y: 25, description: "Antennes réceptrices de signaux chimiques d'autres neurones." },
             { id: "axone", name: "Axone", x: 55, y: 52, description: "Câble conducteur de l'influx nerveux sous forme de potentiel d'action." },
             { id: "myeline", name: "Gaine de myéline", x: 72, y: 44, description: "Gaine protectrice lipidique qui accélère la conduction électrique." },
             { id: "synapse", name: "Terminaisons synaptiques", x: 90, y: 62, description: "Zones de contact libérant des neurotransmetteurs dans la fente synaptique." }
           ]} />\`
           Example for any other system (using type="custom"):
           \`<InteractiveDiagram title="La Synapse Chimique" type="custom" hotspots={[
             { id: "pre", name: "Membrane présynaptique", x: 25, y: 35, description: "Extrémité axonale où sont stockées les vésicules contenant les neurotransmetteurs." },
             { id: "ves", name: "Vésicules synaptiques", x: 40, y: 40, description: "Saccules membranaires libérant les neurotransmetteurs sous l'effet du calcium." },
             { id: "fente", name: "Fente synaptique", x: 55, y: 50, description: "Espace intercellulaire de 20 nm traversé par diffusion passive par les neurotransmetteurs." },
             { id: "recepteur", name: "Récepteurs postsynaptiques", x: 75, y: 65, description: "Canaux ioniques ou RCPG s'ouvrant après liaison du neurotransmetteur." }
           ]} />\`
           Coordinates x and y are integer percentages from 0 to 100 on a 2D canvas. Choose locations logically matching the underlying animated SVG layout.
        * Economics, Finance, Mathematics, or Physics: You MUST systematically insert at least one dynamic 2D graph simulator or interactive function coefficients manipulator tag:
             - \`<FunctionPlotter mode="linear|compound-interest|supply-demand" title="Graph Title" xLabel="X-Axis" yLabel="Y-Axis" />\` (plots supply-demand curves, compound interest, or linear growth, equipped with interactive parameter slider controls) OR
             - \`<FunctionManipulator />\` (stunning curves sandbox plotting linear, quadratic, sinusoidal wave, exponential, and logarithmic functions, equipped with interactive parameter sliders, explicit graduated linear/log axes, units, and zero origin point).
        * Step-by-Step Processes, Workflows, Chronological Events, Systems Pathways, or Logical Flows (All Disciplines): You MUST systematically include a visual flowchart written directly inside standard \`\`\`mermaid code blocks (parsed and rendered automatically in the client).
        * Quantitative, Mathematical, Scientific, or Economic Exercises: For any lesson with calculation steps, numerical derivations, formula applications, or mathematical proofs, you MUST systematically include:
             - At least one Solved Worked Example:
               \`<SolvedExercise title="Name of Example" solution="Detailed multi-line step-by-step mathematical or scientific derivation resolution details...">Full problem statement/text here...</SolvedExercise>\`
             - At least one Unsolved Interactive Calculation Challenge:
               \`<UnsolvedExercise question="Calculated challenge question requiring a numeric value response" correctAnswer={5.2} tolerance={0.05} placeholder="Enter numerical result..." hint="Helpful formula/clue hint..." solution="Step-by-step worked resolution revealed after correct answer or no attempts left..." unit="m/s" />\`
             - For lessons teaching basic subtraction (elementary levels like CP/CE), you MUST include:
               \`<BasicMathExplorer />\` (an interactive subtraction explorer with a curved step-jump number line and visual objects to cross out/manipulate).
             - For chemistry lessons teaching chemical reaction balancing, you MUST include:
               \`<ChemicalStoichiometry />\` (an elegant chemical reaction balancing sandbox).
             - For algebra or higher-level mathematics teaching equation solving, factoring, or isolating variables, you MUST include:
               \`<EquationManipulator />\` (an elegant sandbox supporting step-by-step algebraic equation solver pathways).
        * Chemistry, Biology, Material Sciences, Crystallography, or Molecular Physics: You MUST systematically include at least one interactive 3D particle structure viewer:
             - \`<StructureViewer3D presetId="h2o|co2|ch4|nacl|graphene" />\`
             - Support presets: "h2o" (bent water structure), "co2" (linear double-bond carbon dioxide), "ch4" (tetrahedral methane), "nacl" (Alternating ionic salt FCC crystal grid), or "graphene" (rippled carbon hexagonal sheet).
        * Physics, Biology, Optics, Thermodynamics, or Biochemical Reactions: You MUST systematically include at least one playable dynamic simulation with progress-scrubbing playback:
             - \`<DynamicSimulation presetId="mitosis|carnot|waves|doubleslit|enzyme" />\`
             - Support presets: "mitosis" (cell division phases), "carnot" (ideal heat engine PV cycle and piston), "waves" (sine wave traveling with sliders), "doubleslit" (diffraction wave interference fringes with laser wavelength slider), or "enzyme" (induced-fit lock-and-key substrate splitting).
        * Statistical, Analytical, Financial, or Measurement Data (All Disciplines): To display distributions, proportions, or comparative statistics, you MUST systematically include an elegant, high-impact SVG gradient chart:
             - \`<DataChart title="Chart Title" type="bar|donut" xAxisLabel="Label X" yAxisLabel="Label Y" unit="%" data={[{"label":"Name A","value":40},{"label":"Name B","value":60}]} />\`
        * Complex Transitions, Before-After comparisons, or state changes (e.g., cell division/mitosis phases, chemical reaction steps, or economic inflation comparison): You MUST systematically include a draggable before-after reveal slider component: \`<ComparisonSlider beforeLabel="Avant" afterLabel="Après" beforeContent="Description of before state..." afterContent="Description of after state..." />\`.
        * Computer Science, Software Engineering, Coding, or Web Development: You MUST systematically insert at least one interactive client-side coding sandbox block: \`<CodeSandbox initialCode="..." title="Titre du Bac à Sable" language="html|javascript|css" />\` where students can edit and execute HTML/CSS/JS code in real-time right inside the page.
         * Auditory and Video Enrichment (All Disciplines): You MUST systematically embed at least one short audio or video resource:
              - For **video**: use \`<Video id="" title="..." provider="YouTube" duration="..." />\`. Leave \`id\` empty — it will be auto-resolved from YouTube search.
              - For **audio**: use \`<Audio url="" title="..." duration="..." />\`. Leave \`url\` empty — the system will search Wikimedia Commons for a real CC-licensed file matching the title, or fall back to TTS synthesis.
              - The \`title\` is CRITICAL for audio resolution. It MUST be precise and searchable:
                * Music: exact instrument + work (e.g. \`title="Bach Prelude BWV 846 harpsichord"\`, \`title="Piano note Middle C"\`, \`title="Beethoven Symphony 5 opening"\`)
                * Languages: exact phrase to hear (e.g. \`title="French pronunciation Bonjour comment allez-vous"\`, \`title="Spanish Buenos dias")\`)
                * Natural sciences: taxonomy or event names (e.g. \`title="Nightingale Luscinia megarhynchos song"\`, \`title="Thunderstorm rain"\`, \`title="Wolf howling"\`)
                * History: speaker + event (e.g. \`title="Charles de Gaulle appel 18 juin 1940"\`, \`title="Martin Luther King I have a dream 1963"\`)
                * Other: most specific English/French description (e.g. \`title="Normal heartbeat sinus rhythm stethoscope"\`)
              - Keep duration under 2-3 minutes (e.g. \`duration="2 min"\`).
        * Geometry/Mathematics/Physics Chapters (Draggable 2D Sandbox): For any chapter teaching coordinate systems, triangle trigonometry, vectors, or trigonometric circles, you MUST systematically insert at least one 2D Geometry sandbox widget:
             - \`<Geometry2D preset="triangle|circle|vector" title="Titre de la sandbox" />\`. Use "triangle" for triangle area/trigonometry, "circle" for the unit circle (sine/cosine/angle), and "vector" for vector addition and magnitude.
        * Statistical or Tabular Data (Automatic Markdown Table-to-Chart rendering): To present comparative data tables, simple lists of measurements, or results, write standard Markdown tables (e.g. | Label | Value |). The system will automatically wrap it in a custom interactive component that displays a toggle tab so students can switch between the table and a dynamic SVG Bar/Line chart.
 18. Special Pedagogical Enrichment Blocks (Balises JSX d'Enrichissement) :
       You MUST dynamically and contextually enrich the lesson body using the following custom tags.
       *CRITICAL COMPONENT TAG NAME REQUIREMENT*: Regardless of the target language of the lesson (French, Spanish, German, Chinese, or any new language we may add), you MUST write the JSX tag names EXACTLY as specified below in canonical English (e.g. write '<CriticalThinking>', '<HistoricalFact>', '<DidYouKnow>', etc. NEVER translate the tag names themselves). This is strict and mandatory.
       - **Esprit Critique** (\`<CriticalThinking title="Titre">...</CriticalThinking>\`): Use this block to prompt the student to question an assumption, analyze methodological limits, think about potential biases, or consider counter-arguments.
       - **Le saviez-vous ?** (\`<DidYouKnow>...</DidYouKnow>\`): Insert exactly 1 highly surprising trivia, statistical fact, or analogy per lesson to capture interest.
       - **Anecdote Historique** (\`<HistoricalAnecdote title="..." date="...">...</HistoricalAnecdote>\`): Add a 2-4 sentence historical narrative detailing a TRULY anecdotal, unexpected, human, quirky, or surprising event or story (e.g. a funny misconception, an unusual experiment mishap, or a witty quote; NOT just a plain history event like the creation of a lab or the publication of a book). This should be a fun, social-gathering conversational snippet. Crucial: The HistoricalAnecdote and LeSaviezVous blocks in the same lesson must NEVER cover the exact same subject, discovery, or event.
       - **Fait Historique** (\`<HistoricalFact title="..." date="...">...</HistoricalFact>\`): Add a 2-4 sentence description of a landmark historical event, foundational experiment, or crucial historical milestone (such as the opening of a famous laboratory or the publication of a seminal textbook) that is important for academic context but is a factual milestone rather than a quirky anecdote.
       - **Idée Brillante** (\`<BrilliantIdea title="...">...</BrilliantIdea>\`): Highlight a highly creative, brilliant, or counter-intuitive idea, solution, or theory related to the concept.
       - **Point de vue** (\`<PointOfView topic="Titre" perspectives={[{"author":"Auteur A","view":"Avis A"},{"author":"Auteur B","view":"Avis B"}]} />\`): Use this block to compare differing theories, models, or socio-historical viewpoints.
       - **Et après ?** (\`<WhatsNext title="...">...</WhatsNext>\`): Place this systematically at the very end of the core lesson body (just before the final evaluation) to project students forward into next concepts or advanced career paths.
  19. Optional Pedagogical Enriching Elements (Éléments d'enrichissement pédagogiques facultatifs) :
     - The following features are completely OPTIONAL. You should organically choose to use just one or two of them if they fit the level and subject, to avoid drowning the content:
       * L'Ancre Problématique (The Hook): A real-world story, scene, or case study demonstrating the necessity of the concept.
       * Le Guide des Idées Reçues (Debunking Grid): 3 to 5 common misconceptions dismantled by the lesson.
       * Le Résumé "Skimmable" (Lecture Rapide): A bulleted/bolded ultra-condensed overview at the start/end of modules.
       * Analogies Transversales: Creative cross-discipline analogies to explain abstract concepts.
       * Bac à Sable Interactif (Sandbox / Simulator): Simulation guides or interactive parameter manipulation cues.
       * L'Invite de Journalisation Métacognitive: A short metacognitive journal prompt encouraging self-reflection.
  20. Write the response in "${targetLang.toUpperCase()}".
  21. Return ONLY the raw MDX content. Do not wrap the response in markdown code blocks (\`\`\`\`).
  22. CRITICAL MDX COMPILER COMPLIANCE RULES:
      - Absolutely NO orphaned JSX tags or unclosed tags. Ensure all tags (such as <Objectives>, <Quiz>, <Question>, <Option>, <Glossary>, <Video>, <Audio>, <FillInBlanks>, <SolvedProblem>, <Summary>, <SelfEval>, <HistoricalPerson>, <Location>, <Place>, <EntityLink>, <EssayEvaluation>, <OpenQuestion>, <ScientificDebate>, <Epistemology>, <GoingFurther>, <GoingFurtherItem>, <ComparisonSlider>, <CodeSandbox>, <InteractiveDiagram>, <FunctionPlotter>, <FunctionManipulator>, <SolvedExercise>, <UnsolvedExercise>, <BasicMathExplorer>, <ChemicalStoichiometry>, <EquationManipulator>, <StructureViewer3D>, <DynamicSimulation>, <DataChart>, <ComparisonSlider>, <Geometry2D>) are closed correctly.
      - JSX Attributes MUST be formatted strictly as: name="value". Do NOT use single quotes for attributes (like name='value'). Do NOT use braces without values.
      - Inside JSX attributes (like term, definition, bio, prompt, subject, q, explanation, title, beforeContent, afterContent), do NOT use raw double quotes. Use &quot; or escape them properly, or just use single quotes inside the double-quoted attribute.
      - Inside JSX attributes, do NOT use raw ampersands '&'. Use the word 'and' or wrap/escape it as '&amp;'.
      - Never nest a custom component inside itself (e.g. do NOT put <WhatsNext> inside <WhatsNext>).
      - Do NOT generate empty components like '<CriticalThinking />' or '<WhatsNext />' without text or children.
      - Frontmatter headers are allowed, but the main body must be raw MDX. Do NOT wrap the entire output in markdown block wrappers like \`\`\`html or \`\`\`mdx.`;

      let rawMdx = '';
      let contentSuccess = false;
      let vertexStatus = 'Not Attempted';
      let vertexError = 'N/A';
      let studioStatus = 'Not Attempted';
      let studioError = 'N/A';

      if (isVertexConfigured()) {
        console.log(`[AI GENERATOR] Generating lesson "${item.title}" via Vertex AI (${TASK_MODELS['course_generation']})...`);
        vertexStatus = 'Attempted';
        try {
          const contentRes = await callVertexAI({
            task: 'course_generation',
            contents: [{ role: 'user', parts: [{ text: promptContent }] }],
            generationConfig: { temperature: 0.3 }
          });

          if (contentRes && contentRes.ok) {
            const contentJson = await safeResponseJson(contentRes, 'Vertex lesson generation');
            rawMdx = contentJson.candidates?.[0]?.content?.parts?.[0]?.text || '';
            contentSuccess = true;
            vertexStatus = 'Success';
          } else {
            const status = contentRes ? contentRes.status : 'unknown';
            const statusText = contentRes ? contentRes.statusText : '';
            vertexError = `HTTP Error ${status}: ${statusText}`;
            console.error(`[AI GENERATOR] Vertex AI response error. Status: ${status}`);
          }
        } catch (err) {
          const error = err as Error;
          vertexError = error.message || String(err);
          console.warn(`[AI GENERATOR] Vertex AI lesson generation failed.`, err);
        }
      }
      
      if (!contentSuccess && apiKey) {
        console.log(`[AI GENERATOR] Generating lesson "${item.title}" via AI Studio fallback (gemini-2.5-flash)...`);
        studioStatus = 'Attempted';
        const startTime = Date.now();
        try {
          const contentRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: promptContent }] }]
            })
          });
          if (contentRes.ok) {
            const contentJson = await safeResponseJson(contentRes, 'AI Studio lesson generation fallback');
            rawMdx = contentJson?.candidates?.[0]?.content?.parts?.[0]?.text || '';
            contentSuccess = true;
            studioStatus = 'Success';

            const durationMs = Date.now() - startTime;
            const usage = contentJson.usageMetadata || {};
            const promptTokens = usage.promptTokenCount || 0;
            const candidatesTokens = usage.candidatesTokenCount || usage.candidateTokenCount || 0;
            await recordMetrics('course_generation', 'gemini-2.5-flash', durationMs, promptTokens, candidatesTokens, promptContent);
          } else {
            studioError = `HTTP Error ${contentRes.status}: ${contentRes.statusText}`;
            console.error(`[AI GENERATOR] AI Studio response error. Status: ${contentRes.status}`);
          }
        } catch (err) {
          const error = err as Error;
          studioError = error.message || String(err);
          console.error(`[AI GENERATOR] AI Studio lesson content fetch exception:`, err);
        }
      }

      if (!rawMdx) {
        const errorMsg = `[AI GENERATOR CRITICAL ERROR] Failed to generate content for lesson "${item.title}" in course "${correctedCourseName}". Vertex AI Status: ${vertexStatus} (${vertexError}), AI Studio Status: ${studioStatus} (${studioError}).`;
        console.error(errorMsg);
        throw new Error(errorMsg);
      }

      // Agent 4 (Verifier/Critic) refinement loop
      let currentMdx = rawMdx;
      let approved = !contentSuccess;
      let iteration = 0;
      const maxIterations = 3;

      while (!approved && iteration < maxIterations) {
        iteration++;
        console.log(`[AI GENERATOR - AGENT 4] Verifying lesson "${item.title}" (Attempt ${iteration}/${maxIterations})...`);
        
        const verifierPrompt = `You are the Verifier/Critic Agent (Agent 4). Your job is to strictly review the generated academic course content (MDX) to ensure it complies with the "Zero-Placeholder" and "Academic Density" policies.

MDX CONTENT TO VERIFY:
---
${currentMdx}
---

Your Checkpoints:
1. "Zero-Placeholder & Prohibited Empty Tags & Nested Wrappers & Content Collisions":
   - **STRICT ZERO-PLACEHOLDER CONSTRAINT**: Systematically reject (approved: false) if the lesson contains any placeholders, comments telling the user to write their own text, unwritten sections, or skeletons like "Insérer ici...", "[Placeholder]", "[À compléter]", "Lorem Ipsum", "..." for incomplete lists, or generic non-developed paragraphs. The text must be fully written, complete, and production-ready.
   - Detect if there are any empty custom component tags (e.g. <Evaluation></Evaluation>, <SummativeEvaluation></SummativeEvaluation>, <Objectives></Objectives>, <CriticalThinking />, <WhatsNext />, <BrilliantIdea />, <OpenQuestion />, <ScientificDebate />, etc.). If ANY tag is present but empty, lacks significant children/content, or is self-closing without proper props/data, you MUST reject the content (set "approved": false).
   - Nested wrappers are strictly forbidden (e.g. self-nesting is invalid). Use only one single tag for the block.
   - Content collision: Ensure that <HistoricalAnecdote>, <HistoricalFact>, and <DidYouKnow> do NOT cover the exact same subject, discovery, or event. If they overlap or duplicate information, reject the content (set "approved": false) so they are written on distinct, non-overlapping pedagogical hooks. Ensure that <HistoricalAnecdote> is TRULY anecdotal, quirky, funny, or human (not just a dry historical milestone). Factual milestones like the founding of a laboratory or publication of a textbook MUST be placed in a <HistoricalFact> (Fait Historique) block instead.
2. "Academic Density": Verify that the content is exhaustive, detailed, and academically rigorous for the specified level ("${level}"). Look for lazy summaries or text-avoidance patterns.
3. "Structural Completeness & Mandated Sections":
   - Ensure the presence of prerequisites at the very beginning (using '<Prerequisites items={[...]} />').
   - Ensure the presence of diagnostic quizzes (using '<DiagnosticQuiz ... />') before the introduction.
   - Ensure the presence of a proper introduction section (using '## Introduction' or a translated equivalent heading like '## Présentation').
   - Ensure the presence of learning objectives (using '<Objectives>' containing '<Knowledge>', '<Skills>', and '<Attitudes>' sub-components).
   - Ensure the presence of a forward-looking/what's next section (using '<WhatsNext>' component) before the final evaluation.
   - Ensure the presence of a concluding section (using the heading '## Conclusion' or localized equivalent) containing the '<Summary items={[...]} />' component.
   - Ensure the presence of a final validating/timed end-of-lesson evaluation (using '<Quiz durationLimit={...}>', '<SummativeEvaluation>', or '<EssayEvaluation ... />').
   - Ensure the presence of a glossary section (using a heading like '### Glossary' or '### Glossaire').
   - Ensure the presence of a bibliography/references section (using a heading like '### References' or '### Références'). Note: This references section is mandatory for all levels except if the level is primary ("${level}" indicates if it's primary).
    - Check formatting of bibliography references: verify that (a) they do NOT contain raw URLs, hyperlinks, or markdown link syntax in the citation text; (b) book/article titles inside the citation text must be wrapped in standard quotation marks (or French guillemets « ... » for French lessons) and NEVER in asterisks (*) or underscores (_); and (c) the citation format matches the discipline-appropriate style expected for the course (i.e., **${getCitationStyle(courseContext.discipline || correctedCourseName).name}**) — for example, APA 7 for psychology/social sciences, Vancouver for medicine, Chicago Notes-Bibliography for history/philosophy, IEEE for engineering/CS, CSE for biology, Bluebook/OSCOLA for law, etc. Reject if references are in plainly wrong format for the discipline.
     If any of these required structural sections/components are missing or malformed, you MUST reject the content (set "approved": false) and request the writer to add or correct them.
4. "Multimedia, Illustrations, & Non-Text Media Density":
   This checkpoint is DISCIPLINE-AWARE. Evaluate the illustration requirement against the course subject and level ("${level}", course: "${correctedCourseName}"):
   - For VISUAL, SPATIAL, HISTORICAL, or EMPIRICAL disciplines (visual arts, architecture, geography, geology, anatomy, biology, cinema, history of art, design, engineering diagrams): A text-only lesson is UNACCEPTABLE. Reject immediately if the content lacks at least 2 to 3 '<CustomFigure />' / '<Image />' elements, at least one '<Mermaid />' flowchart, or at least one '<InteractiveDiagram />'. These disciplines require high illustration density by design.
   - For QUANTITATIVE or EXPERIMENTAL disciplines (mathematics, physics, chemistry, economics, computer science): The absence of inline illustrations may be acceptable IF the content compensates with visual interactive components: '<Mermaid />', '<FunctionPlotter />', '<FunctionManipulator />', '<EquationManipulator />', '<Geometry2D />', '<DataChart />', '<StructureViewer3D />', '<BasicMathExplorer />', or '<ChemicalStoichiometry />'. Reject if NONE of these are present.
   - For TEXTUAL, PHILOSOPHICAL, LITERARY, or HUMANISTIC disciplines (philosophy, literature, linguistics, ethics, law, political theory): A text-dominant lesson is pedagogically acceptable and must NOT be rejected solely on the absence of inline figures. However, you MUST flag (in the critique, without setting "approved" to false for this reason alone) if ZERO visual elements are present, as at least a minimal enrichment (e.g. 1 portrait '<CustomFigure />' of a key thinker, 1 '<Mermaid />' concept map, or 1 '<CriticalThinking />' / '<PointOfView />' enrichment block) would still be beneficial for learner engagement and should be recommended.
   - "Audio/Video Integrity": When '<AudioPlayer />', '<Audio />', or '<Video />' components are present in the content, verify that:
     * Each has a non-empty 'src' or 'url' attribute (not a placeholder like "url_here" or "").
     * Each specifies a 'duration' attribute (e.g. duration="2 min" or duration="1:45") and that this duration does NOT exceed 3 minutes, in line with the micro-learning constraint.
     * Each has a caption line directly below it (italicized, e.g. *Audio 1 : Title - Description.*) and, for actual external resources, an accessible fallback redirect link. Reject any '<Audio />' or '<Video />' tag with a missing or empty 'duration' attribute.
   - Regardless of discipline: Verify that audio players ('<AudioPlayer />' / '<Audio />') or video players ('<Video />') are incorporated where spoken context or audio demonstrations are pedagogically valuable (e.g. listening comprehension for language courses, spoken philosophical lectures, or historical audio documents).
5. "Section Interactivity and Sandboxes":
   5a. "Per-Section Interactivity Rule": Every major conceptual section (demarcated by a '##' heading) MUST contain at least one interactive/active learning component. Passive reading blocks are prohibited. Valid interactive components include: formative quizzes ('<Quiz>'), fill-in-the-blanks ('<FillInBlanks />'), solved/unsolved exercises ('<SolvedExercise>' / '<UnsolvedExercise />'), or any sandbox/simulation widget ('<FunctionPlotter />', '<FunctionManipulator />', '<EquationManipulator />', '<Geometry2D />', '<CodeSandbox />', '<DataChart />', '<StructureViewer3D />', '<DynamicSimulation />', '<BasicMathExplorer />', or '<ChemicalStoichiometry />'). A section containing ONLY a '<Quiz>' is acceptable for introductory or textual sections, but deeper technical sections must use higher-order interactive components.
   5b. "Discipline-Specific Simulator Mandate": Beyond the per-section rule, apply these discipline-level simulator requirements:
     * LIFE SCIENCES / ANATOMY / BIOLOGY / MEDICINE / CHEMISTRY / MATERIAL SCIENCES: The lesson MUST contain at least one '<InteractiveDiagram />' (for anatomical or cellular structures) or '<StructureViewer3D presetId="..." />' (for molecular/crystal structures). A lesson in these disciplines without either component MUST be rejected.
     * MATHEMATICS / PHYSICS / ECONOMICS / FINANCE: The lesson MUST contain at least one dynamic graph, equation, or basic math explorer component: '<FunctionPlotter />', '<FunctionManipulator />', '<EquationManipulator />', '<DataChart />', '<Geometry2D />', or '<BasicMathExplorer />'. A lesson in these disciplines without any of these MUST be rejected.
     * COMPUTER SCIENCE / ENGINEERING / PROGRAMMING: The lesson MUST contain at least one '<CodeSandbox />' for active code execution. A lesson without it MUST be rejected.
     * HISTORY / GEOGRAPHY / POLITICAL SCIENCE / SOCIAL SCIENCES: The lesson MUST contain at least one process/timeline flowchart ('<Mermaid />'). A lesson without it MUST be rejected.
     * PHILOSOPHY / LITERATURE / LINGUISTICS / LAW / ETHICS: No mandatory simulator. However, the presence of at least one '<CriticalThinking />', '<PointOfView />', '<HistoricalAnecdote />', or '<HistoricalFact />' enrichment block is strongly recommended; flag its absence in the critique without causing a hard rejection.
6. "No Fragmented Sentences in Key Points": Check '<Summary items={[...]} />' and ensure none of the items are fragmented or artificially split clauses of a single sentence. Each item MUST be a complete, grammatically whole sentence.
7. "Connected Entities (Historical Figures, Places, Artworks) & Mini-Biographies":
   - Verify that EVERY historical figure, scientist, writer, director, or notable person mentioned in the main body text is wrapped in '<HistoricalPerson name="..." lang="..." bio="...">'. Verify that it has a non-empty \`bio\` attribute as a fallback. IMPORTANT: Do NOT require or check for '<HistoricalPerson>' tags inside JSX component attribute properties (like inside 'options', 'explanation', 'knowledge', 'skills', or 'attitudes' arrays/objects of \`<Quiz>\`, \`<DiagnosticQuiz>\`, \`<Objectives>\` etc.), as nesting JSX elements inside JavaScript strings or array attributes is syntactically invalid in MDX and crashes the parser.
     - Verify that \`<Location>\`, \`<Place>\`, \`<HistoricalEvent>\`, \`<EvenementHistorique>\`, \`<Artwork>\`, and \`<FictionalCharacter>\` tags systematically contain a non-empty \`description\` attribute detailing their background and relevance as a secure fallback. Reject if missing or empty.
   - Verify that there are no duplicate or nested '<HistoricalPerson>' tags for the same person in close proximity. Ensure that the bold titles of '**Mini-Biographie**' or '**Mini-Biography**' blocks do NOT contain '<HistoricalPerson>' tags (they must remain plain text, and the hover/wiki cards should only be placed in the biography body text below the title). Reject content (set "approved": false) if duplicate/nested tags are found.
   - Verify that notable works of art/artworks mentioned in the text (like "L'Homme de Vitruve") are wrapped in '<Artwork name="..." lang="..." description="...">'.
     - Verify that any Contextual Mini-Biography block (using \`> [!INFO]\` or \`> [!NOTE]\` titled \`Mini-Biographie\` or \`Mini-Biography\`) is substantial: at least 4 to 6 lines for Primary/Collège levels, and at least 8 to 12 lines for high school (Lycée) and university levels (Supérieur). Verify that it systematically includes a direct Wikipedia markdown link at the end (e.g. \`[En savoir plus sur Wikipédia](...)\`). Reject the content if it's too short or lacks the Wikipedia link.
8. "No Source Redirects for Flowcharts, Simulators, or AI Resources": Check system-generated flowcharts (mermaid diagrams), interactive simulators, or AI-generated resources (like Pollinations.ai images), and ensure they do NOT contain any "[Source]" / "[Link]" / "[Reference]" / "[Accéder]" text links below them, as they are constructed dynamically or have no external origin URL.
9. "Interactive Elements and Assessment Integrity": Systematically audit all <Quiz>, <Question>, <Option>, <DiagnosticQuiz>, <EssayEvaluation>, and <UnsolvedExercise> tags. Verify that:
    - Every <Question> element MUST have its question text defined in the 'q' attribute (e.g. <Question q="Question text?">) and not as raw text children.
    - Systematically reject (approved: false) any content containing deprecated pedagogical tags like <Explanation>, <Solution>, <Instruction>, or <KeyConcept>.
   - Every <Quiz> contains at least one <Question> element, and every <Question> contains at least two <Option> elements.
   - Every <Option /> tag MUST follow the Flat-Prop pattern: it must pass the option text via the 'text' attribute (e.g. <Option text="Option text" />) and its correctness state via the 'correct' boolean attribute (e.g. correct={true} or correct={false}), and it MUST be a self-closing tag. Systematically reject (approved: false) any question containing nested/wrapped text inside <Option> (like <Option>Text</Option>) or missing the 'text' attribute, or where no option has correct={true}.
   - Every <DiagnosticQuiz> has options, and a valid "correctIndex" attribute.
   - All text content and attributes inside these assessment tags are fully written, meaningful, and not empty or skeletal. Reject any empty or placeholder assessments.
10. "Foreign Language Quotes & Translations":
    - Verify that any quote in a language other than the lesson's target language (e.g., an English quote in a French lesson) is systematically translated into the target language of the lesson, and that this translation is displayed in brackets (e.g., [Traduction : ...] or [Translation: ...]) immediately following the quote. Reject if a foreign quote is not followed by its bracketed translation. Every quote must be followed by a dedicated paragraph explaining its conceptual implications and context.
11. "Wikimedia Commons Preference for Complex Diagrams":
    - For complex biological, chemical, physical, geographical, or anatomical diagrams (such as the plasma membrane structure, cell anatomy, molecular models, or historical maps), verify that high-quality public domain images from Wikimedia Commons are preferred over low-quality Pollinations.ai images or simple placeholders. Verify that the Wikimedia Commons image URL is correctly used in the markdown image syntax and linked/credited in the references section.
12. "DataChart Data Integrity":
    - Every \`<DataChart />\` tag MUST have a \`data={[...]}\` attribute with at least 2 valid data point objects (each with a label string and value number). A \`<DataChart />\` without a data attribute, with an empty data array, or with a string instead of a JSX array MUST be rejected (approved: false). Zero tolerance: no DataChart with invalid or missing data is acceptable at generation time.
13. "SolvedExercise Completeness":
    - Every \`<SolvedExercise>\` block MUST have: (a) a non-empty \`title\` attribute, (b) non-empty problem statement children (clearly formulating a concrete problem with enough context), AND (c) a non-empty \`solution="..."\` attribute or \`<Solution>...</Solution>\` child with step-by-step resolution. An empty \`<SolvedExercise>\` (missing children, missing solution, or where problem and solution are identical text) MUST be rejected (approved: false).

You must return a valid JSON object with the following keys:
- "approved": boolean (true if it perfectly complies with the policies; false if there are violations).
- "critique": string (detailed description of the violations and clear instructions on how the generating agent must expand or correct the text. Leave empty if approved).

Return ONLY a valid JSON object. Do not include markdown code block backticks around the JSON.`;

        let verifierRaw = '';
        let verifierSuccess = false;
        try {
          if (isVertexConfigured()) {
            try {
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
            } catch (err) {
              console.warn("[AI GENERATOR - AGENT 4] Vertex verification call exception:", err);
            }
          }
          
          if (!verifierSuccess && apiKey) {
            const startTime = Date.now();
            try {
              const vRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  contents: [{ parts: [{ text: verifierPrompt }] }],
                  generationConfig: {
                    responseMimeType: "application/json",
                    responseSchema: verificationSchema
                  }
                })
              });
              if (vRes.ok) {
                const vJson = await vRes.json();
                verifierRaw = vJson.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
                verifierSuccess = true;
              }
            } catch (err) {
              console.error(`[AI GENERATOR - AGENT 4] AI Studio verification fetch exception:`, err);
            }
          }

          const cleanedVJson = verifierRaw.replace(/```json/g, '').replace(/```/g, '').trim();
          const verificationResult = safeJsonParse(cleanedVJson, 'generateCourseContent (Agent 4 Verification)');

          if (verificationResult && verificationResult.approved === true) {
            console.log(`[AI GENERATOR - AGENT 4] Content approved for "${item.title}" on attempt ${iteration}!`);
            approved = true;
          } else {
            const critique = verificationResult?.critique || 'Invalid or empty verification response from AI critic.';
            console.warn(`[AI GENERATOR - AGENT 4] Content REJECTED for "${item.title}" on attempt ${iteration}. Critique: ${critique}`);
            
            const refinerPrompt = `You are a world-class academic professor (Agent 1/2/3). The verifier/critic (Agent 4) has rejected your previous output.
You must now rewrite, expand, and fully correct the MDX lesson content based on their feedback, ensuring zero placeholders and high academic density.

CRITIQUE FROM AGENT 4:
"${critique}"

PREVIOUS MDX CONTENT:
---
${currentMdx}
---

Generate the complete, updated, fully-fledged lesson content incorporating all corrections.
Return ONLY the raw MDX content. Do not wrap the response in markdown code blocks (\`\`\`).`;

            let refinedMdx = '';
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
                  refinedMdx = refJson.candidates?.[0]?.content?.parts?.[0]?.text || '';
                  refineSuccess = true;
                }
              } catch (err) {
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
                  refinedMdx = refJson?.candidates?.[0]?.content?.parts?.[0]?.text || '';
                  refineSuccess = true;
                  
                  const durationMs = Date.now() - startTime;
                  const usage = refJson.usageMetadata || {};
                  await recordMetrics('course_generation', 'gemini-2.5-flash', durationMs, usage.promptTokenCount || 0, usage.candidatesTokenCount || 0, refinerPrompt);
                }
              } catch (err) {
                console.error(`[AI GENERATOR - REFINE] AI Studio refinement fetch exception:`, err);
              }
            }

            if (refinedMdx) {
              currentMdx = refinedMdx;
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
order: ${index + 1}
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
      await updateTaskProgress();
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
      await dbService.saveCourse({
        ...course,
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

async function findAlternativeVideo(title: string, lang: string): Promise<{ id?: string; url?: string; provider?: string } | null> {
  console.log(`[ALTERNATIVE SEARCH] Searching alternative video for title: "${title}" (${lang})...`);
  const queries = [
    title,
    `${title} educational video`,
    `${title} lecture`
  ];
  
  for (let attempt = 0; attempt < 3; attempt++) {
    const query = queries[attempt];
    console.log(`[ALTERNATIVE SEARCH] Video Search Attempt ${attempt + 1}/3 with query: "${query}"`);
    
    const prompt = `You are a Research Agent (Agent C).
Find a real, public, educational YouTube or Vimeo video about: "${query}".
The video must be in language: "${lang}".
It must be a real video ID that exists. Do not invent video IDs.
If you know a real, highly popular video, output its ID (11 characters for YouTube) or URL.
Output JSON only:
{
  "provider": "youtube",
  "id": "11-character-id-here"
}
If you cannot find any real video, output: {}`;

    try {
      let rawJson = '';
      if (isVertexConfigured()) {
        const res = await callVertexAI({
          task: 'course_generation',
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: "application/json",
            responseSchema: videoSearchSchema
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
              responseSchema: videoSearchSchema
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
        const data = safeJsonParse(cleaned, 'Video Search Alternative');
        if (data.id || data.url) {
          const providerStr = data.provider || 'youtube';
          const videoTag = `<Video id="${data.id || ''}" url="${data.url || ''}" provider="${providerStr}" />`;
          const isReachable = await isVideoReachable(videoTag);
          if (isReachable) {
            console.log(`[ALTERNATIVE SEARCH] Found valid alternative video: ID=${data.id}, URL=${data.url}`);
            return { id: data.id, url: data.url, provider: providerStr };
          }
        }
      }
    } catch (err) {
      console.warn(`[ALTERNATIVE SEARCH] Video search exception on attempt ${attempt + 1}:`, err);
    }
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
You must model this curriculum on real-world academic programs (curriculums and syllabus guidelines from schools and universities) for this specific discipline and level.
Be flexible:
- Adjust the number of courses (typically between 5 and 15 courses) and credit/hour volumes based on the actual complexity and standard requirements of the level and discipline.
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
    'Summary', 'EssayEvaluation', 'Glossary', 'HistoricalPerson',
    'HistoricalEvent', 'HistoricalDate', 'Location', 'EntityLink',
    'Artwork', 'CriticalThinking', 'ScientificMethod', 'HistoricalAnecdote',
    'HistoricalFact', 'WhatsNext', 'EtApres', 'IdeeBrillante', 'BrilliantIdea',
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

