import { dbService } from './db';
import { supabase } from './supabase';
import { callVertexAI, isVertexConfigured, recordMetrics } from './vertex-client';

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

export async function generateCourseContent(courseName: string, level: string, targetLang: string = 'en') {
  // 1. Generate syllabus (lesson titles and slugs)
  const promptSyllabus = `You are the Primary Pedagogical Architect Agent (Agent 1 & 2).
Ta mission est de concevoir la structure, le chapitrage et la stratégie cognitive du cours intitulé "${courseName}" pour le niveau "${level}". Tu ne rédiges pas le cours, tu en crées l'ossature computationnelle et didactique la plus pure et la plus adaptée.

Un cours d'anatomie ne s'articule pas comme un cours de topologie algébrique ou de philosophie politique. Tu dois impérativement adapter le squelette du cours à l'ADN épistémologique de la discipline et à l'âge du public visé (de la Primaire à la Licence 3).

---

# ETAPE 1 : PROFILAGE DE LA DISCIPLINE (ADN COGNITIF)
Avant de générer le moindre chapitre, tu dois classifier la discipline cible selon son mode d'administration de la preuve et de la transmission. Tu choisiras et appliqueras la matrice dominante parmi les suivantes :

1. **Sciences Déductives / Formelles (Mathématiques, Logique, Physique Théorique) :**
   * *Focus :* Rigueur absolue, chaîne causale sans faille.
   * *Composants obligatoires :* Lemme ➔ Théorème ➔ Démonstration ➔ Corollaire. Chaque brique doit découler logiquement de la précédente.

2. **Sciences Empiriques / Expérimentales (Biologie, Physique Expérimentale, Chimie) :**
   * *Focus :* Observation du réel, double codage visuel.
   * *Composants obligatoires :* Hypothèse ➔ Protocole Expérimental ➔ Observation/Données ➔ Interprétation/Modélisation. Présence massive de schémas, d'atlas ou d'illustrations anatomiques/structurelles.

3. **Sciences Humaines et Discursives (Philosophie, Histoire, Littérature) :**
   * *Focus :* Rhétorique, problématisation, dialectique.
   * *Composants obligatoires :* Thèse ➔ Antithèse ➔ Synthèse (ou approche généalogique/conceptuelle). Analyse textuelle fine, contextualisation socio-historique, controverses doctrinales.

4. **Sciences Appliquées / Ingénierie (Informatique, Architecture des Systèmes, Électronique) :**
   * *Focus :* Résolution de problèmes, design pattern, constructivisme.
   * *Composants obligatoires :* Expression du besoin ➔ Contraintes techniques ➔ Spécification de l'Architecture ➔ Implémentation/Code ➔ Tests de validation.

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
* **Exhaustivité du chapitrage :** Tu dois spécifier 4 à 6 leçons bien distinctes (maximum 3 pour le niveau Primaire). L'agent rédacteur (Agent 3) ne doit avoir aucune extrapolation à faire sur le plan.`;

  try {
    let rawJson = '';
    let success = false;
    
    if (isVertexConfigured()) {
      console.log(`[AI GENERATOR] Generating syllabus for "${courseName}" via Vertex AI (gemini-2.5-pro)...`);
      try {
        const res = await callVertexAI({
          task: 'course_generation',
          contents: [{ role: 'user', parts: [{ text: promptSyllabus }] }],
          generationConfig: { temperature: 0.2, responseMimeType: "application/json" }
        });

        if (res && res.ok) {
          const jsonRes = await res.json();
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
            generationConfig: { responseMimeType: "application/json" }
          })
        });
        if (res.ok) {
          const jsonRes = await res.json();
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
      console.warn("[AI GENERATOR] AI model failed to generate syllabus. Generating mock syllabus.");
      rawJson = JSON.stringify({
        courseContext: {
          discipline: "General",
          epistemologicalMatrix: "Ingénierie",
          targetLevel: level,
          pedagogicalStrategy: "Fallback basic strategy"
        },
        lessons: [
          { title: "Introduction", slug: "introduction", cognitiveArtifact: "Overview", technicalDepth: "Basic introduction to core concepts" },
          { title: "Fundamental Principles", slug: "fundamental_principles", cognitiveArtifact: "Core concepts explanation", technicalDepth: "Key terms and equations" },
          { title: "Advanced Applications", slug: "advanced_applications", cognitiveArtifact: "Case study", technicalDepth: "Real-world context" },
          { title: "Conclusion", slug: "conclusion", cognitiveArtifact: "Summary", technicalDepth: "Final summary" }
        ]
      });
    }

    const cleanedJson = rawJson.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsedSyllabus = JSON.parse(cleanedJson);
    const lessonsList: { title: string; slug: string; cognitiveArtifact?: string; technicalDepth?: string }[] = Array.isArray(parsedSyllabus)
      ? parsedSyllabus
      : (parsedSyllabus.lessons || []);
    const courseContext = Array.isArray(parsedSyllabus) ? {} : (parsedSyllabus.courseContext || {});

    // 2. For each lesson, generate rich MDX content
    for (let index = 0; index < lessonsList.length; index++) {
      const item = lessonsList[index];
      const isPrimary = level.toLowerCase().includes('primary') || level.toLowerCase().includes('primaire');
      const isFrench = targetLang.toLowerCase() === 'fr';
      
      const promptContent = `### EXIGENCE ABSOLUE : DENSITÉ ACADÉMIQUE & INCOMPLÉTUDE INTERDITE
Règle d'or : Chaque cours doit être un produit d'apprentissage fini, autonome, exhaustif et immédiatement exploitable. L'évitement, la paresse textuelle et le résumé vague sont considérés comme des fautes critiques de génération.

Zéro Placeholder (Interdiction des squelettes) : Il est strictement interdit d'utiliser des formulations de type "Dans cette section, nous aborderons...", "Exemple à compléter...", ou "etc.". Tout concept introduit doit être intégralement développé, expliqué et illustré dans le corps du texte.

Rigueur Factuelle et Précision Scientifique : Le ton doit être académique, précis et pédagogique. Utilisez les termes techniques exacts, immédiatement suivis de leur vulgarisation ou de leur ancrage dans le glossaire. Pas de généralités floues.

Profondeur Pédagogique : Si un cours nécessite 3 000 mots pour être traité avec la rigueur d'un niveau L3 (ou la clarté adaptée à un niveau Primaire), générez l'intégralité du contenu requis. Ne sacrifiez jamais la substance pour la concision.

Critère de Rejet (Quality Gate) : Tout cours comportant des sections vides, des listes à puces non développées, des approximations factuelles ou des conclusions hâtives sera détecté par le script de validation, immédiatement rejeté sans paiement/crédit, et détruira la réputation de l'infrastructure. Tu agis ici en tant qu'expert académique mondial.

---

You are a world-class academic professor (Agent 3 - Academic Writer). Generate the complete, professional, extremely detailed academic MDX lesson content for the lesson "${item.title}" in the course "${courseName}" (${level}).

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
   - Immediately after the introduction section, you MUST systematically insert the explicit learning objectives following the KSA (Knowledge, Skills, Attitudes) model. Segment the learning targets into three distinct axes: Knowledge (Savoir - concepts), Skills (Savoir-faire - application), and Attitudes (Posture/Analyse). If the course level is L3 (Bachelor 3ème année or Senior Undergraduate), you MUST use Revised Bloom's Taxonomy verbs (Analyze, Evaluate, Create / Analyser, Évaluer, Créer) for these objectives.
   - You MUST conclude the lesson content (immediately before the evaluation) with a "Summary & Conclusion" or "Synthèse & Ouverture" section (using a heading like "## Conclusion" or "## Synthèse & Discussion").
   - This concluding section must contain:
     * A structured summary of the key takeaways using the custom \`<Summary items={["Key point 1", "Key point 2", ...]} />\` component.
     * A brief paragraph containing open reflection questions (questions ouvertes de réflexion) and an opening (ouverture) toward further study or neighboring fields.
5. Conceptual framework, historical perspective, and concrete real-world applications in the body of the lesson.
6. Controlled Digressions (Encadrés Epistémologiques):
   - If the course level is university level (L1, L2, L3 / undergraduate_1, undergraduate_2, undergraduate_3), you MUST systematically insert at least one controlled digression box in the body of the lesson using the custom component:
     \`<Epistemology title="Title of Digression">...</Epistemology>\`
     This box must explore the history of the concept, past controversies, or current limits/criticisms, breaking the dogmatic tone of the AI-generated text.
7. Include some math formulas in LaTeX (using $ or $$ wrappers) where appropriate for the level.
8. Radical Accessibility: Guarantee that EVERY SINGLE image, diagram, table, code block, or visual/multimedia container systematically includes detailed, descriptive, and meaningful alt tags, aria-labels, and semantic text summaries to ensure total accessibility.
9. Glossary and Highlighted Terms:
   - For every key, complex, or specific academic term introduced or highlighted in the text, you MUST wrap it in the custom \`<Glossary term="Term" definition="Clear, concise academic definition...">Term</Glossary>\` component.
   - At the bottom of the page (after the main content), systematically add a Glossary section (using the heading \`### Glossaire\` if writing in French, or \`### Glossary\` if in English/other languages) that lists all of these glossary terms alphabetically along with their definitions.
10. Historical Figures and Scientists:
    - For every historical figure, scientist, or prominent person mentioned in the text (e.g., Napoleon, Isaac Newton, Albert Einstein, Marie Curie, etc.), you MUST wrap their name in the custom React component: \`<HistoricalPerson name="Exact_Wikipedia_Page_Title_In_Target_Language" lang="target_language_code">DisplayName</HistoricalPerson>\`.
    - Examples (if writing in French): \`<HistoricalPerson name="Isaac_Newton" lang="fr">Isaac Newton</HistoricalPerson>\`, \`<HistoricalPerson name="Albert_Einstein" lang="fr">Albert Einstein</HistoricalPerson>\`, \`<HistoricalPerson name="Napoléon_Ier" lang="fr">Napoléon Bonaparte</HistoricalPerson>\`.
    - Examples (if writing in English): \`<HistoricalPerson name="Isaac_Newton" lang="en">Isaac Newton</HistoricalPerson>\`, \`<HistoricalPerson name="Albert_Einstein" lang="en">Albert Einstein</HistoricalPerson>\`, \`<HistoricalPerson name="Napoleon" lang="en">Napoleon Bonaparte</HistoricalPerson>\`.
    - Note: The \`name\` attribute must be the exact Wikipedia page title in the target language of the course (using underscores for spaces), and the \`lang\` attribute must be the language of the course ("${targetLang.toLowerCase()}").
11. Intermediate Formative Evaluations:
    - Throughout the body of the lesson, place a custom \`<Quiz>\` block with 1 or 2 \`<Question>\` elements after each key sub-concept (every 5-10 minutes of reading).
    - For every question in these intermediate quizzes, you MUST provide a detailed, supportive, and alternative explanation using the \`explanation\` attribute on the \`<Question>\` component:
      \`<Question q="Question text" explanation="Detailed alternative explanation, using different analogies, breaking down the steps simply, to help learners who fail to understand.">...\`
      This acts as pedagogical rerouting: if the student fails the question, the tutor will spontaneously react by showing this custom rerouting explanation.
12. Mandatory End-of-Lesson Evaluation:
    - You MUST systematically place an evaluation block at the very end of the main lesson content (after the Conclusion/Synthèse section, but before the Glossary and References sections).
    - You have full discretion to choose the most pedagogically appropriate format based on the course nature, level, and target audience:
      * MCQ Quiz: Use the custom \`<Quiz>\` component containing 3 to 5 \`<Question q="...">\` child components. Each question must contain several \`<Option text="..." correct />\` (or incorrect \`<Option text="..." />\`) tags. Best for scientific, math, or factual topics.
        - You can optionally add a \`durationLimit={seconds}\` attribute (e.g. \`durationLimit={180}\` for 3 minutes) to create a timed challenge.
      * Essay Evaluation: Use the custom \`<EssayEvaluation prompt="..." gradingSystem="..." subject="..." />\` component. Best for humanities, literature, conceptual discussions, or law theory.
        - The \`prompt\` must be the essay question/topic in "${targetLang.toUpperCase()}".
        - The \`gradingSystem\` attribute MUST be chosen based on the course's country/cultural context: use "0/20" for French/Francophone settings, "A-F" for US/UK/International settings, "0/10" for general European settings, or "pass-fail" for introductory courses.
        - The \`subject\` attribute must be the name of the subject (e.g. "Physics", "Biology", "Philosophy", "Law").
        - You can optionally add a \`durationLimit={seconds}\` attribute (e.g. \`durationLimit={300}\` for 5 minutes) to enforce a writing time limit.
13. Evaluation Matrix by Level (Matrice d'Évaluation par Niveau):
    You MUST strictly select the appropriate evaluation form and objectives depending on the target student level ("${level}"):
    - Primaire (CP-CM2): Gamification, visual identification, short fill-in-the-blanks (\`<FillInBlanks sentence="..." answer="..." />\`). Cognitive Objective: Recognition and simple retrieval (Reconnaissance et Restitution simple). Tutor Role: Immediate binary validation.
    - Collège (6e-3e): Complex multiple-choice questions (real MCQs using \`<Quiz>\` and \`<Question>\`), causal matching, short-answer questions. Cognitive Objective: Comprehension and direct application (Compréhension et Application directe). Tutor Role: Distractor analysis (explaining why a specific wrong option was chosen).
    - Lycée au Supérieur (L1-L3): Case studies, open-ended problem solving, essays/synthesis writing (\`<EssayEvaluation />\`), document/code analysis. Cognitive Objective: Analysis, critical thinking, and transfer of knowledge to unfamiliar contexts (Analyse, Critique, Transfert à un contexte inconnu). Tutor Role: Multi-criteria evaluation (Rubrics) via LLM grading with detailed feedback.
14. Clickable Footnotes and References:
   ${isPrimary ? `
   - Since this is a primary school level course, DO NOT include any bibliography or references section.` : `
   - Systematically include a bibliography/references section at the very end of the page (after the Glossary), using the heading \`### Références\` if writing in French, or \`### References\` if in English/other languages.
   - All references in this section MUST be real, high-quality, clickable links (using Markdown link syntax \`[Title / Author / Source](URL)\` with real or realistic scholarly URLs, e.g. redirecting to a scientific article, database, or academic website).
   - Link these references to the body text using a standard footnote numbering system. Inline in the body text, cite references as superscript/link style: \`<sup>[[1](#ref-1)]</sup>\`. In the References section at the bottom, prefix each reference item with the corresponding anchor tag, e.g. \`<a id="ref-1"></a>[1] [Reference Title / Author / Publisher](https://example.org/article-url)\`, so that clicking the inline note redirects the user to the reference at the bottom.`}
 15. Short Audio and Video Duration Limits (Micro-learning):
     - To optimize student focus and prevent attention loss, all recommended or embedded videos (using \`<Video id="..." title="..." provider="..." duration="..." />\` or \`<Video url="..." title="..." duration="..." />\`) and audio tracks (using \`<Audio url="..." title="..." duration="..." />\`) MUST be short (maximum 2 to 3 minutes long).
     - You MUST systematically populate the \`duration\` attribute (e.g. \`duration="2 min"\` or \`duration="1:45"\`) and keep it within this short micro-learning boundary.
 16. Authentic Resource References:
     - All external resources, including video IDs, audio URLs, and bibliography references, will be automatically checked for reachability and validated against live APIs (e.g. Crossref, Google Books, YouTube). Do not invent fake or hallucinated URLs or media IDs.
 17. Optional Enriching Elements (Éléments d'enrichissement facultatifs) :
     - Unlike the mandatory structures above, the following features are completely OPTIONAL. You should organically choose to use just one or two (or more) of them if they fit the level and subject, to avoid drowning the content in a rigid formatting scheme:
       * L'Ancre Problématique (The Hook): A real-world story, scene, or case study demonstrating the necessity of the concept.
       * Le Guide des Idées Reçues (Debunking Grid): 3 to 5 common misconceptions dismantled by the lesson.
       * Le Résumé "Skimmable" (Lecture Rapide): A bulleted/bolded ultra-condensed overview at the start/end of modules.
       * Graphiques Cognitifs: Visual diagrams, flowcharts, or timelines written in Mermaid.js.
       * Analogies Transversales: Creative cross-discipline analogies to explain abstract concepts.
       * Bac à Sable Interactif (Sandbox / Simulator): Simulation guides or interactive parameter manipulation cues.
       * L'Invite de Journalisation Métacognitive: A short metacognitive journal prompt encouraging self-reflection.
 18. Write the response in "${targetLang.toUpperCase()}".
 19. Return ONLY the raw MDX content. Do not wrap the response in markdown code blocks (\`\`\`).`;

      let rawMdx = '';
      let contentSuccess = false;
      let vertexStatus = 'Not Attempted';
      let vertexError = 'N/A';
      let studioStatus = 'Not Attempted';
      let studioError = 'N/A';

      if (isVertexConfigured()) {
        console.log(`[AI GENERATOR] Generating lesson "${item.title}" via Vertex AI (gemini-2.5-pro)...`);
        vertexStatus = 'Attempted';
        try {
          const contentRes = await callVertexAI({
            task: 'course_generation',
            contents: [{ role: 'user', parts: [{ text: promptContent }] }],
            generationConfig: { temperature: 0.3 }
          });

          if (contentRes && contentRes.ok) {
            const contentJson = await contentRes.json();
            rawMdx = contentJson.candidates?.[0]?.content?.parts?.[0]?.text || '';
            contentSuccess = true;
            vertexStatus = 'Success';
          } else {
            const status = contentRes ? contentRes.status : 'unknown';
            const statusText = contentRes ? contentRes.statusText : '';
            vertexError = `HTTP Error ${status}: ${statusText}`;
            console.error(`[AI GENERATOR] Vertex AI response error. Status: ${status}`);
          }
        } catch (err: any) {
          vertexError = err.message || String(err);
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
            const contentJson = await contentRes.json();
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
        } catch (err: any) {
          studioError = err.message || String(err);
          console.error(`[AI GENERATOR] AI Studio lesson content fetch exception:`, err);
        }
      }

      if (!rawMdx) {
        console.warn(`[AI GENERATOR] Failed to generate content for "${item.title}". Using fallback mock content.`);
        rawMdx = `# 🔍 Academic Generation Diagnostics

An error occurred while dynamically compiling the lesson content for **${item.title}** under course **${courseName}**.

> [!WARNING]
> The AI Generation pipeline was unable to contact the configured LLM providers or failed to validate the generated output. Below is a detailed, actionable diagnostics report to help you resolve this issue.

### 📋 Environment & Configuration Status

| Provider | Status | Configured | Error / Details |
| :--- | :--- | :--- | :--- |
| **Vertex AI** | ${vertexStatus} | \`${isVertexConfigured() ? 'TRUE' : 'FALSE'}\` | ${vertexError} |
| **Gemini AI Studio** | ${studioStatus} | \`${!!apiKey ? 'TRUE' : 'FALSE'}\` | ${studioError} |

### 🛠️ Actionable Troubleshooting Steps

1. **Verify Environment Variables**:
   Ensure the following are correctly defined in your server's \`.env.local\` or hosting provider dashboard:
   - \`GOOGLE_APPLICATION_CREDENTIALS\` (absolute path to GCP Service Account JSON file)
   - \`VERTEX_PROJECT_ID\` (your GCP project ID)
   - \`VERTEX_LOCATION\` (e.g., \`us-central1\`)
   - \`GEMINI_API_KEY\` (Gemini API Studio key)

2. **Check GCP & Vertex AI Permissions**:
   - Ensure the Vertex AI API is enabled in your Google Cloud Console.
   - Verify the Service Account has the **Vertex AI User** role.

3. **Verify API Quotas & Billing**:
   - Check if you have exceeded Vertex AI or AI Studio rate limits/quotas.
   - Confirm your Google Cloud Billing account is active.

4. **Server Logs**:
   - Inspect the server terminal output or deployment logs for full stack traces associated with this request.`;
      }

      // Agent 4 (Verifier/Critic) refinement loop
      let currentMdx = rawMdx;
      let approved = !contentSuccess; // Skip verification loop if generation failed and we are outputting diagnostics
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
1. "Zero-Placeholder": Detect if there are any skeletal placeholder formulations like "Dans cette section, nous aborderons...", "Example to complete...", "to be determined", "etc.", or generic non-developed placeholders.
2. "Academic Density": Verify that the content is exhaustive, detailed, and academically rigorous for the specified level ("${level}"). Look for lazy summaries or text-avoidance patterns.
3. "Structural Completeness": Ensure the presence of prerequisites, diagnostic quizzes, learning objectives, epistemological boxes (if university level), formative quizzes, and end-of-lesson evaluation.

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
                generationConfig: { temperature: 0.1, responseMimeType: "application/json" }
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
            console.log(`[AI GENERATOR - AGENT 4] Verifying lesson "${item.title}" via AI Studio fallback (gemini-2.5-flash)...`);
            const startTime = Date.now();
            try {
              const vRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  contents: [{ parts: [{ text: verifierPrompt }] }],
                  generationConfig: { responseMimeType: "application/json" }
                })
              });
              if (vRes.ok) {
                const vJson = await vRes.json();
                verifierRaw = vJson.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
                verifierSuccess = true;

                const durationMs = Date.now() - startTime;
                const usage = vJson.usageMetadata || {};
                const promptTokens = usage.promptTokenCount || 0;
                const candidatesTokens = usage.candidatesTokenCount || usage.candidateTokenCount || 0;
                await recordMetrics('course_generation', 'gemini-2.5-flash', durationMs, promptTokens, candidatesTokens, verifierPrompt);
              }
            } catch (err) {
              console.error(`[AI GENERATOR - AGENT 4] AI Studio verification fetch exception:`, err);
            }
          }

          const cleanedVJson = verifierRaw.replace(/```json/g, '').replace(/```/g, '').trim();
          const verificationResult = JSON.parse(cleanedVJson);

          if (verificationResult.approved === true) {
            console.log(`[AI GENERATOR - AGENT 4] Content approved for "${item.title}" on attempt ${iteration}!`);
            approved = true;
          } else {
            console.warn(`[AI GENERATOR - AGENT 4] Content REJECTED for "${item.title}" on attempt ${iteration}. Critique: ${verificationResult.critique}`);
            
            // Re-generate content using the critique
            const refinerPrompt = `You are a world-class academic professor (Agent 1/2/3). The verifier/critic (Agent 4) has rejected your previous output.
You must now rewrite, expand, and fully correct the MDX lesson content based on their feedback, ensuring zero placeholders and high academic density.

CRITIQUE FROM AGENT 4:
"${verificationResult.critique}"

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
              console.log(`[AI GENERATOR - REFINE] Refining lesson "${item.title}" via AI Studio fallback (gemini-2.5-flash)...`);
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
                  const promptTokens = usage.promptTokenCount || 0;
                  const candidatesTokens = usage.candidatesTokenCount || usage.candidateTokenCount || 0;
                  await recordMetrics('course_generation', 'gemini-2.5-flash', durationMs, promptTokens, candidatesTokens, refinerPrompt);
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
        } catch (vErr) {
          console.error("[AI GENERATOR - AGENT 4] Error during verification cycle, bypassing loop:", vErr);
          approved = true; // Bypass to avoid blocker/infinite loop
        }
      }

      // De-hallucinate bibliography links against Crossref / Google Books
      const validatedMdx = await validateAndFixBibliography(currentMdx);

      let mdxWithFrontmatter = `---
title: "${item.title}"
subject: "${courseName}"
level: "${level}"
module: "${item.title}"
order: ${index + 1}
---

${validatedMdx}`;

      // Pre-validate MDX compilation to avoid 404 or compilation crashes
      const mdxCheck = await validateMdxContent(mdxWithFrontmatter);
      if (!mdxCheck.success) {
        console.warn(`[AI GENERATOR - MDX VALIDATION ERROR] Content for "${item.title}" failed MDX validation: ${mdxCheck.error}. Applying fallback sanitization.`);
        mdxWithFrontmatter = sanitizeMdxFallback(mdxWithFrontmatter);
        
        const retryCheck = await validateMdxContent(mdxWithFrontmatter);
        if (!retryCheck.success) {
          console.error(`[AI GENERATOR - MDX CRITICAL ERROR] Sanitized content for "${item.title}" still failed MDX validation: ${retryCheck.error}. Auto-logging to DB.`);
          try {
            await dbService.submitReport(
              courseName.toLowerCase().replace(/ /g, '_'),
              `${courseName.toLowerCase().replace(/ /g, '_')}/${item.slug}`,
              `[GENERATION MDX EXCEPTION] ${retryCheck.error}`
            );
          } catch (reportErr) {
            console.error("Failed to auto-submit generation error report:", reportErr);
          }
        }
      }

      // Save to Supabase
      await dbService.saveLesson({
        course_slug: courseName.toLowerCase().replace(/ /g, '_'),
        lesson_slug: item.slug,
        lang: targetLang.toLowerCase(),
        title: item.title,
        content: mdxWithFrontmatter,
        order: index + 1
      });
    }

    // Save/Update the Course card in the database
    try {
      const courseSlug = courseName.toLowerCase().replace(/ /g, '_');
      const { data: allCourses } = await dbService.getAllCourses();
      const existingCourse = allCourses?.find(c => c.slug === courseSlug);
      
      const courseDescription = courseContext.description || `A comprehensive course on ${courseName} dynamically generated at ${level} level.`;
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
        title: courseName,
        description: courseDescription
      };

      await dbService.saveCourse({
        id: courseId,
        title: courseName,
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
      console.log(`[AI GENERATOR] Saved/Updated course card for "${courseName}" (ID: ${courseId}, ECTS: ${ectsCount}, Languages: ${updatedLanguages.join(', ')})`);
    } catch (saveErr) {
      console.error("[AI GENERATOR] Failed to save/update course card:", saveErr);
    }
  } catch (err) {
    console.error("AI Generation failed:", err);
  }
}

export async function translateCourseContent(courseSlug: string, targetLang: string) {
  try {
    // 1. Fetch all existing lessons for this course
    const { data: sourceLessons } = await supabase
      .from('lessons')
      .select('*')
      .eq('course_slug', courseSlug);

    if (!sourceLessons || sourceLessons.length === 0) {
      console.warn(`No source lessons found in database for course ${courseSlug} to translate.`);
      return;
    }

    // 2. For each lesson, translate
    for (const lesson of sourceLessons) {
      const promptTranslate = `You are a professional academic translator. Translate the following academic MDX course content to target language code: "${targetLang.toUpperCase()}".
Rules:
1. Preserve all markdown structure, custom blockquotes, headings, lists, and links.
2. Keep all Math equations (wrapped in $ or $$) completely untouched.
3. Do NOT translate technical code blocks. For JSX React tags:
   - For \`<Glossary term="..." definition="...">\`, translate the values of the \`term\` and \`definition\` attributes to the target language, as well as the text content inside the tag.
   - For \`<HistoricalPerson name="..." lang="...">\`, translate the value of the \`name\` attribute to the equivalent Wikipedia page title in the target language (e.g. changing "Napoleon" to "Napoléon_Ier" when translating to French), and update the \`lang\` attribute to the target language code (e.g. "fr"). Also translate the inner display name text if appropriate.
   - For \`<EssayEvaluation prompt="..." gradingSystem="..." subject="..." />\`, translate the value of the \`prompt\` and \`subject\` attributes to the target language. Keep the \`gradingSystem\` attribute values untouched.
   - Keep other tag names and syntax untouched.
4. Translate the title and return ONLY the translated MDX content. Do not include markdown code block wrappers.

MDX CONTENT TO TRANSLATE:
${lesson.content}`;

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
            translatedMdx = resJson.candidates?.[0]?.content?.parts?.[0]?.text || '';
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
            translatedMdx = resJson.candidates?.[0]?.content?.parts?.[0]?.text || '';
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
      let validatedMdx = await validateAndFixBibliography(translatedMdx);

      // Pre-validate translated MDX compilation
      const mdxCheck = await validateMdxContent(validatedMdx);
      if (!mdxCheck.success) {
        console.warn(`[AI GENERATOR - TRANSLATION MDX ERROR] Content for translated "${transTitle}" failed MDX validation: ${mdxCheck.error}. Applying fallback sanitization.`);
        validatedMdx = sanitizeMdxFallback(validatedMdx);

        const retryCheck = await validateMdxContent(validatedMdx);
        if (!retryCheck.success) {
          console.error(`[AI GENERATOR - TRANSLATION CRITICAL ERROR] Sanitized content for translated "${transTitle}" still failed MDX validation: ${retryCheck.error}. Auto-logging to DB.`);
          try {
            await dbService.submitReport(
              courseSlug,
              `${courseSlug}/${lesson.lesson_slug}`,
              `[TRANSLATION MDX EXCEPTION] ${retryCheck.error}`
            );
          } catch (reportErr) {
            console.error("Failed to auto-submit translation error report:", reportErr);
          }
        }
      }

      // Save translated lesson to Supabase
      await dbService.saveLesson({
        course_slug: courseSlug,
        lesson_slug: lesson.lesson_slug,
        lang: targetLang.toLowerCase(),
        title: transTitle,
        content: validatedMdx,
        order: lesson.order
      });
    }
  } catch (err) {
    console.error("AI Translation failed:", err);
  }
}

async function validateAndFixBibliography(mdx: string): Promise<string> {
  const refRegex = /<a id="ref-\d+"><\/a>\[\d+\]\s*\[(.*?)\]\((.*?)\)/g;
  let match;
  const replacements: { original: string; replacement: string }[] = [];

  while ((match = refRegex.exec(mdx)) !== null) {
    const fullMatch = match[0];
    const refText = match[1];

    try {
      console.log(`[BIBLIOGRAPHY VALIDATOR] Verifying Reference: "${refText}"`);
      const searchRes = await fetch(`https://api.crossref.org/works?query=${encodeURIComponent(refText)}&rows=1`);
      if (searchRes.ok) {
        const data = await searchRes.json();
        const item = data.message?.items?.[0];
        if (item && item.DOI) {
          const realUrl = `https://doi.org/${item.DOI}`;
          const cleanTitle = item.title?.[0] || refText;
          const cleanAuthor = item.author?.[0]?.family ? `by ${item.author[0].family}` : '';
          const replacementText = `${cleanTitle} ${cleanAuthor}`.trim();
          
          const originalRefId = fullMatch.match(/ref-\d+/)?.[0] || 'ref-1';
          const originalNum = fullMatch.match(/\[\d+\]/)?.[0] || '[1]';
          const updatedRef = `<a id="${originalRefId}"></a>${originalNum} [${replacementText}](${realUrl})`;
          
          replacements.push({ original: fullMatch, replacement: updatedRef });
          console.log(`[BIBLIOGRAPHY VALIDATOR] Crossref validation successful. Resolved to: ${realUrl}`);
          continue;
        }
      }
    } catch (e) {
      console.warn(`[BIBLIOGRAPHY VALIDATOR] Crossref check failed for "${refText}":`, e);
    }

    // Google Books fallback
    try {
      const gBooksRes = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(refText)}&maxResults=1`);
      if (gBooksRes.ok) {
        const data = await gBooksRes.json();
        const book = data.items?.[0]?.volumeInfo;
        if (book) {
          const realUrl = book.previewLink || book.infoLink || `https://books.google.com?q=${encodeURIComponent(refText)}`;
          const originalRefId = fullMatch.match(/ref-\d+/)?.[0] || 'ref-1';
          const originalNum = fullMatch.match(/\[\d+\]/)?.[0] || '[1]';
          const updatedRef = `<a id="${originalRefId}"></a>${originalNum} [${book.title} by ${book.authors?.join(', ') || 'Unknown'}](${realUrl})`;
          replacements.push({ original: fullMatch, replacement: updatedRef });
          console.log(`[BIBLIOGRAPHY VALIDATOR] Google Books validation successful. Resolved to: ${realUrl}`);
          continue;
        }
      }
    } catch (e) {
      console.warn(`[BIBLIOGRAPHY VALIDATOR] Google Books check failed for "${refText}":`, e);
    }
  }

  let updatedMdx = mdx;
  for (const rep of replacements) {
    updatedMdx = updatedMdx.replace(rep.original, rep.replacement);
  }

  return updatedMdx;
}

export async function generateCurriculum(curriculumName: string, level: string, targetLang: string = 'en') {
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
        generationConfig: { temperature: 0.2, responseMimeType: "application/json" }
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
            generationConfig: { responseMimeType: "application/json" }
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
    let parsedData: any;
    try {
      parsedData = JSON.parse(cleanedJson);
    } catch (e) {
      console.warn("Failed to parse AI curriculum JSON, trying to recover standard array...");
      throw e;
    }

    let masterDescription = `Structured curriculum for "${curriculumName}". Constituent modules planned. Synthesized by Episteme.`;
    let coursesList: { title: string; subject: string; volume: string; type: string; description: string }[] = [];

    if (Array.isArray(parsedData)) {
      coursesList = parsedData;
    } else if (parsedData && typeof parsedData === 'object') {
      masterDescription = parsedData.description || masterDescription;
      coursesList = parsedData.courses || [];
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

async function validateMdxContent(content: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { serialize } = await import('next-mdx-remote/serialize');
    const remarkMath = (await import('remark-math')).default;
    const remarkGfm = (await import('remark-gfm')).default;
    const rehypeKatex = (await import('rehype-katex')).default;
    
    await serialize(content, {
      mdxOptions: {
        remarkPlugins: [remarkMath, remarkGfm],
        rehypePlugins: [rehypeKatex],
        format: 'mdx',
      },
    });
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || String(err) };
  }
}

function sanitizeMdxFallback(mdx: string): string {
  const allowedTags = [
    'Prerequisites', 'DiagnosticQuiz', 'Quiz', 'Question', 'Option',
    'Summary', 'EssayEvaluation', 'Glossary', 'HistoricalPerson',
    'Epistemology', 'Video', 'Audio'
  ];
  const tagPattern = new RegExp(`<\\/?(${allowedTags.join('|')})\\b`, 'i');
  
  const parts = mdx.split(/(<\/?[a-zA-Z0-9_]+[^>]*>)/g);
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

