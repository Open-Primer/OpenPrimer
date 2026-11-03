import fs from 'fs';
import path from 'path';
import { saveDraftRevision, safeJsonParse, getDescriptiveLevelForPrompt } from './coreUtils';
import { blockNarrativeAuditSchema } from './aiSchemas';
import { generateLessonOutlineStep } from './scribeOutlineGenerator';

function extractWidgetAnchors(mdx: string): string[] {
  const anchors: string[] = [];
  const regex = /\[\[WIDGET:([A-Za-z0-9_-]+):([A-Za-z0-9_-]+)(?::([^\]]+))?\]\]/g;
  let match;
  while ((match = regex.exec(mdx)) !== null) {
    anchors.push(match[0]);
  }
  return anchors;
}

export async function runScribeStep(
  item: any,
  lessonIdx: number,
  courseName: string,
  correctedCourseName: string,
  level: string,
  discipline: string,
  targetLang: string,
  lawMandate: string,
  lawCriticMandate: string,
  pronunciationMandate: string,
  callAIEngine: any,
  log: (msg: string) => Promise<void>
): Promise<{ approvedNarrativeText: string; activeAnchors: string[]; lessonOutlineObj: any }> {
  const lessonOutlineObj = await generateLessonOutlineStep(
    item,
    courseName,
    correctedCourseName,
    level,
    discipline,
    targetLang,
    callAIEngine,
    log
  );
  let approvedNarrativeText = '';
  const lessonStats: any = { narrativeBlockAttempts: [] };
        // Group outline sections into blocks of at most 2 sections each
        const outlineSections = lessonOutlineObj.sections;
        const blocks: any[] = [];
        for (let i = 0; i < outlineSections.length; i += 2) {
          blocks.push(outlineSections.slice(i, i + 2));
        }
        await log(`[AI GENERATOR] Grouped JIT plan into ${blocks.length} blocks for narrative writing.`);

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
          await log(`[AI GENERATOR - INVERTED] [STAGE 1-B] Writing narrative block ${bIdx + 1}/${blocks.length} (Sections: ${blockHeaderNames})...`);

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
              await log(`[AI GENERATOR] Scribe block generation iteration #${blockIteration} for block ${bIdx + 1}...`);
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

### LEVEL CONSTRAINTS (from database — MANDATORY to enforce):
- Minimum words per lesson block: ${constraint.minWordCount} — Maximum: ${constraint.maxWordCount}
- Minimum inline hover-cards per block: **${constraint.minHoverCardsPerBlock}** (ConceptLink, RealPerson, Glossary)
- Minimum block widgets per block: **${constraint.minBlockWidgetsPerBlock}** (Image, Mermaid, Video, DataChart, etc.)
- Minimum biographies (RealPerson) in this lesson: ${constraint.minBiographiesCount}
- Minimum concept links (ConceptLink) in this lesson: ${constraint.minConceptLinksCount}
- Minimum glossary terms in this lesson: ${constraint.minGlossaryCount}
- Minimum bibliographic references in this lesson: ${constraint.minReferencesCount}
- **MANDATED widget types for this level** (must include at least one): ${constraint.mandatedWidgetTypes.length > 0 ? constraint.mandatedWidgetTypes.join(', ') : 'None'}
- **DISCOURAGED widget types for this level** (avoid unless essential): ${constraint.discouragedWidgetTypes.length > 0 ? constraint.discouragedWidgetTypes.join(', ') : 'None'}

---

### PRE-EXISTING WIDGET INVENTORY:
The following relevant media and database resources are available for this course. If any of these are highly relevant to the current section, you should refer/embed them using their exact ID as [[WIDGET:id]] on a separate blank line:
${formattedCatalogList || 'None pre-existing.'}

### PEDAGOGICAL WIDGETS MANDATE (CRITICAL):
To make this curriculum visually rich, interactive, and academically rigorous, you MUST actively insert pedagogical widgets using bracketed anchors directly in the prose. 
- CRITICAL IMAGE RELEVANCE & CAPTIONING: Every Image or CustomFigure anchor you generate MUST have a strong, direct connection with the current lesson/concept, and must be highly informative (never generic, decorative, or filler). Visual captions for these figures must strictly be inquiry-based and academically relevant rather than purely descriptive. For example, instead of a plain caption like "Cette image représente un monocorde", write an inquiry-based caption like "Comment ce schéma d'un monocorde permet-il de visualiser concrètement les rapports harmoniques des longueurs de cordes ?". All captions must prompt active reflection, invite the learner to think, or show academic utility.
- CRITICAL INTERACTIVE WIDGET CONNECTION: Every interactive widget anchor (such as Quiz, SolvedExercise, UnsolvedExercise, FillInBlanks, Mermaid, DataChart, and other interactive diagrams/simulations) MUST be strongly connected to the lesson. Ensure they are placed in a context where they have specific parameters, equations, or data relevant to the lesson topics, and where a detailed explanation is pedagogically appropriate. You MUST provide a detailed description acting as a legend/caption in the anchor itself (e.g., [[WIDGET:Mermaid:id:Detailed description of the diagram and its variables]).
You are REQUIRED to include:
${isAbstractDiscipline ? `- At least ${constraint.minHoverCardsPerBlock} inline hover-cards (using [[WIDGET:RealPerson:id:Name]], [[WIDGET:ConceptLink:id:Concept Name]], or [[WIDGET:Glossary:id:Term]]) for key figures, concepts, or technical terms in this block of prose.
- DECORATIVE or generic images/photos (like [[WIDGET:Image]] or [[WIDGET:CustomFigure]]) are STRICTLY PROHIBITED for abstract textual disciplines like Law or Philosophy to maintain professional academic quality! If there is no highly specific real-world historical illustration (like a portrait or map), do NOT insert random decorative images. Instead, you are only encouraged to include highly structured block widgets, such as comparative/analytical tables, flowchart diagrams (using [[WIDGET:Mermaid:id:description]]), or quizzes ([[WIDGET:Quiz:id]]).
- ABSOLUTE PROHIBITION ON HORIZONTAL SEPARATOR LINES (like \`---\` or \`___\`) immediately below or above any widget.` : `- At least ${constraint.minHoverCardsPerBlock} inline hover-cards (using [[WIDGET:RealPerson:id:Name]], [[WIDGET:ConceptLink:id:Concept Name]], or [[WIDGET:Glossary:id:Term]]) for key figures, concepts, or technical terms in this block of prose.
- MANDATORY: At least ${constraint.minBlockWidgetsPerBlock} block widgets/media placed on separate blank lines, chosen from: [[WIDGET:Image:id:description]], [[WIDGET:CustomFigure:id:description]], [[WIDGET:Mermaid:id:description]], [[WIDGET:ComparisonSlider:id]], [[WIDGET:InteractiveDiagram:id]], [[WIDGET:DataChart:id]], [[WIDGET:Video:id:description]].
- MEDIA COMPOSITION REQUIREMENT: Each narrative block MUST include at minimum (a) at least 1 image or figure ([[WIDGET:Image]] or [[WIDGET:CustomFigure]]) showing a relevant diagram, formula, or scientific illustration AND (b) at least 1 structural/diagrammatic widget ([[WIDGET:Mermaid]] for flowcharts/timelines/graphs, or [[WIDGET:Video]] for a pedagogical video). These are NOT optional — a block with only text and hover-cards will be REJECTED.
${constraint.mandatedWidgetTypes.length > 0 ? `- MANDATED WIDGET TYPES for this academic level: you MUST include at least one occurrence of each of the following widget types across the lesson: ${constraint.mandatedWidgetTypes.join(', ')}.` : ''}
${constraint.discouragedWidgetTypes.length > 0 ? `- DISCOURAGED WIDGET TYPES for this academic level: avoid using the following unless strictly necessary: ${constraint.discouragedWidgetTypes.join(', ')}.` : ''}
- ABSOLUTE PROHIBITION ON HORIZONTAL SEPARATOR LINES (like \`---\` or \`___\`) immediately below or above any widget.`}
Choose from the following options:
1. [[WIDGET:Biography:unique_id]] - For key historical figures, scientists, authors, or artists. (e.g. [[WIDGET:Biography:rousseau]] or [[WIDGET:Biography:robespierre]] or [[WIDGET:Biography:louis_xvi]])
2. [[WIDGET:Image:unique_id:description]] (or [[WIDGET:CustomFigure:unique_id:description]]) - For relevant paintings, historical photos, maps, diagrams, or illustrations. Note: in the generated MDX component catalog, this maps to the CustomFigure component. (e.g. [[WIDGET:Image:prise_bastille:La prise de la Bastille le 14 juillet 1789]])
3. [[WIDGET:Video:unique_id:description]] - For relevant documentaries, video archives, or animations. (e.g. [[WIDGET:Video:revolution_francaise:Documentaire sur les grandes étapes de la Révolution française]])
4. [[WIDGET:Audio:unique_id:description]] - For audio speeches, narrations, musical examples, or pronunciations. (e.g. [[WIDGET:Audio:declaration_droits:Enregistrement sonore de la Déclaration des droits]])
5. [[WIDGET:Mermaid:unique_id:description]] - For timelines, flowcharts, or structural diagrams. (e.g. [[WIDGET:Mermaid:timeline_causes:Chronologie des causes de la Révolution]])
6. [[WIDGET:Quiz:unique_id]] - For formative multiple-choice quizzes to verify student comprehension.
7. [[WIDGET:SolvedExercise:unique_id]] - For step-by-step resolved exercises, coding snippets, or analytical case studies.
8. [[WIDGET:UnsolvedExercise:unique_id]] - For unsolved application exercises or practice questions.
9. [[WIDGET:FillInBlanks:unique_id]] - For interactive fill-in-the-blanks sentences.
10. [[WIDGET:RealPerson:unique_id:Person Name]] - Inline hover-card highlight for any person mentioned. (e.g. "...alors que [[WIDGET:RealPerson:louis_xvi:Louis XVI]] convoque...")
11. [[WIDGET:ConceptLink:unique_id:Concept Name]] - Inline hover-card highlight for conceptual terms. (e.g. "...l'essor de la [[WIDGET:ConceptLink:souverainete:Souveraineté]] populaire...")
12. [[WIDGET:Glossary:unique_id:Term]] - Inline hover-card highlight for vocabulary definitions. (e.g. "...les députés du [[WIDGET:Glossary:tiers_etat:Tiers État]] se réunissent...")
13. [[WIDGET:Quote:unique_id:description]] - Block widget for a famous quotation or author quote, including original/translation and source (renders as Citation in MDX). Scribe must place this anchor on a separate blank line. (e.g. [[WIDGET:Quote:marie_curie_perseverance:Citation de Marie Curie sur la persévérance dans la recherche scientifique]])
14. [[WIDGET:EventLink:unique_id:Event Name]] - Inline hover-card highlight for any key historical, cultural, or scientific event. (e.g. "...après la [[WIDGET:EventLink:bataille_marignan:Bataille de Marignan]] en 1515...")

Please write them exactly in this anchor format [[WIDGET:Type:unique_id:description]] (or [[WIDGET:Type:unique_id]] where description is not applicable, or with topic/label for highlights). Do NOT write raw JSX/HTML tags!

---

### PREVIOUS TEXT (for transitions and context):
${bIdx > 0 ? `Below is the text generated in the previous blocks. Do NOT repeat any definitions, concepts, or sentences from this text. Start writing immediately from where it left off, ensuring a smooth transition:
"""
... ${fullNarrativeText.slice(-3000)}
"""` : 'None. This is the first block of the lesson.'}

---

⚠️ CRITICAL MARKUP & XML/JSX COMPLIANCE RULES (MDX SAFETY MANDATE):
1. ABSOLUTE PROHIBITION ON RAW INTERACTIVE OR CUSTOM JSX/HTML TAGS. Absolutely no custom JSX/HTML tags (such as <ConceptLink>, <RealPerson>, <Glossary>, <sup id="cite-...">(...)</sup>, or <sup>(...)</sup>) are allowed inline in prose. Exclusively use [[WIDGET:id]] anchors for all widgets, media, links, or elements. For inline bibliographic reference citations, you MUST exclusively use [[WIDGET:Reference:num]] (e.g. [[WIDGET:Reference:1]]) instead of any HTML/JSX markup or brackets. Agent 3a must never attempt to output raw JSX/HTML tags; all features must strictly use [[WIDGET:id]] anchors.
2. NO RAW HTML FOR LISTS. Use Markdown bullets/numbering.
3. NO LITERAL CURLY BRACES in plain text. Wrap in LaTeX or backticks.
4. NO STRAY import/export statements.
5. NO WIDGET ANCHORS INSIDE LISTS OR TABLES. Place them on separate blank lines.
6. Captions of images or Mermaid diagrams must NOT contain figure prefixes (like 'Figure 1:', 'Image A -'). CAPTIONS MUST ONLY contain the descriptive prose.
7. ACADEMIC REFERENCES CITATION MANDATE: You MUST actively cite the references listed under "### GLOBAL CONTEXT:" (if any) throughout the prose. Cite them inline using the format [[WIDGET:Reference:1]], [[WIDGET:Reference:2]], etc., where [[WIDGET:Reference:1]] maps to the first reference in the Global Context list, [[WIDGET:Reference:2]] to the second, and so on. Exclusively use [[WIDGET:Reference:num]] anchors. Do not define a bibliography section here; simply cite them inline in this format.
8. MANDATORY DESCRIPTION FOR MEDIA WIDGETS: For all media/visual widgets (including Image, CustomFigure, Video, Audio, and Mermaid), you MUST append the description/caption as the third parameter in the widget anchor: [[WIDGET:Type:id:description]]. Absolute prohibition on placing external descriptions, captions, or comments (such as "*Description: ...*", "Caption: ...", "Légende: ...") directly in the narrative prose outside the anchor.
9. ABSOLUTE PROHIBITION ON RAW MERMAID DIAGRAMS. Never write raw Mermaid diagram code (e.g. wrapped in \`\`\`mermaid ... \`\`\`) directly in the narrative prose. Instead, you MUST only generate a widget anchor like \`[[WIDGET:Mermaid:id:description]]\` on a separate blank line, describing what the diagram should display in the description. The actual Mermaid diagram code will be generated later by the Widgets Architect (Agent 3b).
${pronunciationMandate}
${lawMandate}
${bIdx === blocks.length - 1 ? `10. Since this is the LAST block, you MUST end with the ## Conclusion section containing at least two comprehensive academic paragraphs, and all conclusion widgets in this exact order:
  [[WIDGET:conclusionSummary]]
  [[WIDGET:whatsNext]]
  [[WIDGET:goingFurther]]
  followed by [[WIDGET:finalEvaluation]]` : ''}

${blockFeedback ? `
🚨 CRITIQUE FROM PREVIOUS ATTEMPT 🚨
The critique agent rejected your previous attempt for this block. Correct the following issues:
"${blockFeedback}"` : ''}

Write the content for the specified sections. Return ONLY the markdown content. Do NOT wrap the response in markdown code blocks.`;

              if (process.env.DEBUG === 'true') saveDraftRevision(`prompt_stage1_narrative_block${bIdx + 1}_${item.slug}_iter${blockIteration}.md`, blockPrompt); // [FIX G4/G5]
              let blockRawText = await callAIEngine(blockPrompt, null, 0.35, 0.25, 0.85);
              if (process.env.DEBUG === 'true') saveDraftRevision(`draft_stage1_narrative_block${bIdx + 1}_${item.slug}_iter${blockIteration}.md`, blockRawText); // [FIX G4/G5]
              cleanedBlockText = blockRawText.replace(/```json/gi, '').replace(/```mdx/gi, '').replace(/```/gi, '').trim();
              cleanedBlockText = healNarrativeCitations(cleanedBlockText);
            }

            // Audit the block text using Critic (Agent 4A)
            await log(`[AI GENERATOR] Auditing block ${bIdx + 1} text (Attempt #${blockIteration})...`);
            const blockCriticPrompt = `You are the Narrative Critic Agent (Agent 4A). Review the generated block of text for the lesson:
---
${cleanedBlockText}
---

Check checkpoints:
1. Zero-placeholders.
2. Accurate academic density and level-appropriate language.
3. Strict MDX/JSX safety (absolutely no raw custom component or custom JSX/HTML tags like <ConceptLink>, <RealPerson>, <Glossary>, <sup id="cite-...">(...)</sup>, or <sup>(...)</sup> inline in prose. All interactive elements and special links must strictly use the [[WIDGET:id]] anchor format. For bibliographic citations, they MUST strictly use the [[WIDGET:Reference:num]] anchor format, e.g. [[WIDGET:Reference:1]]. Reject any block containing raw HTML citation tags or raw bracketed citation anchors like [ref1], [1] in text. Reject any block containing raw Mermaid diagram code (e.g. wrapped in \`\`\`mermaid ... \`\`\`). All diagrams must be anchored as [[WIDGET:Mermaid:id:description]] anchors).
4. No figure prefixes like "Figure 1:" in visual captions.
5. NO EXTERNAL WIDGET CAPTIONS/DESCRIPTIONS IN NARRATIVE PROSE: REJECT the block if there are any external descriptions, comments, or caption text (such as "*Description: ...*", "Caption: ...", "Légende: ...") placed directly in the narrative prose outside, above, or below a widget anchor (like Image, CustomFigure, Video, Audio, Mermaid, etc.). The description must be strictly inside the anchor itself as the third parameter (e.g. [[WIDGET:Image:id:description]] or [[WIDGET:CustomFigure:id:description]] or [[WIDGET:Video:id:description]] or [[WIDGET:Audio:id:description]] or [[WIDGET:Mermaid:id:description]]).
- CRITICAL IMAGE RELEVANCE & CAPTIONING: Reject the block if any image or custom figure anchor does not have a strong, direct connection with the current lesson/concept, or if it is merely decorative/filler. Also reject the block if captions are purely descriptive of what the image shows (e.g. "Buste de Pythagore", "Portrait de X") rather than being inquiry-based. Captions must strictly pose inquiry-based questions or prompt active pedagogical reflection.
- CRITICAL INTERACTIVE WIDGET CONNECTION: Reject the block if any interactive widget or diagram anchor is not strongly connected to the lesson content, or if its parameters, formulas, equations, or inputs appear generic or unrelated to the academic concepts being taught.
${isAbstractDiscipline ? `6. Presence of pedagogical widgets: Check that the block contains at least ${constraint.minHoverCardsPerBlock} inline hover-cards (ConceptLink, Glossary, RealPerson). Ensure that there are NO decorative, random, or generic images/photos (like [[WIDGET:Image]] or [[WIDGET:CustomFigure]]) generated, and reject the block if any generic/unrelated decorative images are found. Ensure that there are NO horizontal separator lines (like \`---\`) adjacent to widgets.` : `6. Presence of pedagogical widgets (MANDATORY — REJECT if not met): The block MUST contain ALL of the following:
   a) At least ${constraint.minHoverCardsPerBlock} inline hover-cards: [[WIDGET:RealPerson]], [[WIDGET:ConceptLink]], or [[WIDGET:Glossary]] anchors for key figures/concepts.
   b) At least 1 image or figure anchor: [[WIDGET:Image:id:description]] or [[WIDGET:CustomFigure:id:description]] showing a relevant diagram, illustration, or scientific figure.
   c) At least 1 structural/diagrammatic widget: [[WIDGET:Mermaid:id:description]] (for graphs, timelines, flowcharts) OR [[WIDGET:Video:id:description]] OR [[WIDGET:DataChart:id]] OR [[WIDGET:InteractiveDiagram:id]].
   d) The TOTAL block widget count (Image + Mermaid + Video + DataChart + etc.) must be at least ${constraint.minBlockWidgetsPerBlock}.
${constraint.mandatedWidgetTypes.length > 0 ? `   e) MANDATED TYPES: The final lesson must contain at least one occurrence of each mandated type: ${constraint.mandatedWidgetTypes.join(', ')}. If this is the LAST block (block ${bIdx + 1} of ${blocks.length}), you MUST reject the block if any of these mandated types are completely absent from the lesson cumulatively (including the current block and all previous blocks). If this is NOT the last block, do NOT reject the block for missing some mandated types, as they can be generated in subsequent blocks.` : ''}
   A block with ONLY inline hover-cards and no Image/Mermaid/Video block widgets MUST be REJECTED. Count explicitly: if (b) is missing → reject; if (c) is missing → reject; if total block widgets < ${constraint.minBlockWidgetsPerBlock} → reject.`}
${lawCriticMandate}
${bIdx === blocks.length - 1 ? `8. Valid ## Conclusion section with at least two paragraphs and the required conclusion widgets.` : ''}

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

            if (process.env.DEBUG === 'true') saveDraftRevision(`prompt_stage1_narrative_block${bIdx + 1}_critique_${item.slug}_iter${blockIteration}.md`, blockCriticPrompt); // [FIX G4/G5]

            let auditJsonStr = await callAIEngine(blockCriticPrompt, blockNarrativeAuditSchema, 0.1);
            if (process.env.DEBUG === 'true') saveDraftRevision(`critique_stage1_narrative_block${bIdx + 1}_${item.slug}_iter${blockIteration}.json`, auditJsonStr); // [FIX G4/G5]
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

            if (blockAudit.approved || blockIteration >= 2) {
              if (!blockAudit.approved) {
                await log(`[AI GENERATOR WARNING] Block ${bIdx + 1} warnings accepted on attempt #${blockIteration}. Proceeding with generated content.`);
              } else {
                await log(`[AI GENERATOR] Block ${bIdx + 1} approved by Critique Agent!`);
              }
              fullNarrativeText = (fullNarrativeText.trim() + "\n\n" + cleanedBlockText.trim()).trim();
              blockApproved = true;
              blockAttemptEntry.approved = true;
            } else {
              lessonStats.narrativeRejections++;
              const isGlobal = !!blockAudit.isGlobalRevision;

              if (isGlobal || blockIteration >= maxBlockIterations) {
                await log(`[AI GENERATOR WARNING] Block ${bIdx + 1} REJECTED globally. Critique: "${blockAudit.globalCritique}".`);
                blockFeedback = `[Block ${bIdx + 1}, Attempt ${blockIteration}] ${blockAudit.globalCritique || 'Narrative block rejected globally.'}`  // [FIX G7] block+attempt context;
                needsScribeDraft = true;
              } else {
                const rejectedSections = (blockAudit.sections || []).filter((s: any) => !s.approved);
                if (rejectedSections.length === 0) {
                  await log(`[AI GENERATOR WARNING] Block ${bIdx + 1} REJECTED but returned no rejected sections. Retrying globally.`);
                  blockFeedback = `[Block ${bIdx + 1}, Attempt ${blockIteration}] ${blockAudit.globalCritique || 'Narrative block rejected.'}`  // [FIX G7] block+attempt context;
                  needsScribeDraft = true;
                } else {
                  lessonStats.narrativeLocalRepairs++;
                  await log(`[AI GENERATOR WARNING] Block ${bIdx + 1} REJECTED locally. Repairing ${rejectedSections.length} section(s)...`);

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
- Absolutely no custom JSX/HTML tags (such as <ConceptLink>, <RealPerson>, <Glossary>, <sup id="cite-...">(...)</sup>, or <sup>(...)</sup>) are allowed inline in prose. Exclusively use [[WIDGET:id]] anchors. For bibliographic citations/references, you MUST exclusively use [[WIDGET:Reference:num]] (e.g. [[WIDGET:Reference:1]]) instead of any HTML/JSX markup or brackets. All features must strictly use [[WIDGET:id]] anchors.
- Do NOT use raw HTML tags; use standard Markdown instead.
- Do NOT use literal curly braces { } in plain text.

[CRITICAL] RICH MARKDOWN TABLES AND MERMAID DIAGRAMS (MANDATORY FOR UNIVERSITY LEVELS):
- If the academic level is University/Higher Education (L1, L2, L3, M1, M2):
  * Ensure that if the section or heading is criticized for lacking structured comparative data or visual flows, you design and insert 1 to 2 rich Markdown tables (using standard \`| Column 1 | Column 2 |\` format) and/or 1 to 2 Mermaid diagrams.
  * ABSOLUTE PROHIBITION ON RAW MERMAID CODE: Never write raw Mermaid diagram code (e.g. wrapped in \`\`\`mermaid ... \`\`\`) in the text. Instead, you MUST only insert a widget anchor like \`[[WIDGET:Mermaid:id:description]]\` on a separate blank line, describing exactly what the diagram should model. The actual Mermaid diagram code will be generated later by the Widgets Architect (Agent 3b).

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

${lawMandate}

INSTRUCTIONS:
1. Repair each rejected section to fully resolve its critique.
2. Wrap each repaired section in: <revised_section heading="HEADING_EXACTLY_AS_SHOWN">[your repaired content]</revised_section>
3. Preserve all [[WIDGET:id]] anchors exactly as they are in the current content.
4. ACADEMIC REFERENCES CITATION MANDATE: Ensure that all inline citations in the format [[WIDGET:Reference:1]], [[WIDGET:Reference:2]], etc. mapping to the available global references are strictly preserved or added where necessary to support the academic rigor of the content. Absolute prohibition on raw HTML/JSX tags (like <sup> or <a>) or brackets (like [1], [ref1]) for citations in the text. Exclusively use [[WIDGET:Reference:id]] anchors. Do not define a bibliography section here; simply cite them inline in this format.
5. Do NOT include markdown code block wrappers or conversational text.`;

                    let scribeRepairOutput = await callAIEngine(promptJointRepair, null, 0.35, 0.25, 0.85);
                    // [FIX R5] ORDERING INVARIANT: revised_section tags are extracted from scribeRepairOutput
                    // BEFORE preprocessMdx is called. This order must be preserved — do not run preprocessMdx
                    // on scribeRepairOutput directly, as it would corrupt the <revised_section> structural tags.
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
                        await log(`[AI GENERATOR] Applying repaired content for section: "${sec.heading || 'Header / Introduction Block'}"`);
                        sec.content = repairs.get(key)!;
                      }
                    }

                    cleanedBlockText = reconstructMarkdown(parsedSections);
                    cleanedBlockText = healNarrativeCitations(cleanedBlockText);
                    needsScribeDraft = false; // Repaired section is ready for re-audit
                  } else {
                    blockFeedback = `[Block ${bIdx + 1}, Attempt ${blockIteration}] Failed to map rejected sections. Retrying globally.`; // [FIX G7]
                    needsScribeDraft = true;
                  }
                }
              }
            }
          }

          if (!blockApproved) {
            await log(`[AI GENERATOR WARNING] Block ${bIdx + 1} failed critique validation after max attempts. Moving forward with last draft.`);
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
      await log(`[AI GENERATOR - INVERTED] [STAGE 2] Designing interactive widgets JSON for lesson "${item.title}"...`);

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
            
            // Validate schema compliance
            const schemaErrors = validateSchema(parsed, blockSchema);
            if (schemaErrors.length > 0) {
              throw new Error(`JSON does not match the required schema. Errors:\n` + schemaErrors.map(e => `- ${e}`).join('\n'));
            }
            
            // Check for forbidden placeholder strings
            const placeholderErrors = checkForForbiddenPlaceholders(parsed);
            if (placeholderErrors.length > 0) {
              throw new Error(`JSON contains forbidden placeholders or draft markers:\n` + placeholderErrors.map(e => `- ${e}`).join('\n'));
            }
            
            parseSuccess = true;
          } catch (err: any) {
            preflightAttempts++;
            if (preflightAttempts > maxPreflightAttempts) {
              await log(`[AI GENERATOR] Pre-flight JSON parsing/validation failed for ${blockName} after ${maxPreflightAttempts} repair attempts. Propagating error.`);
              throw err;
            }
            await log(`[AI GENERATOR] Pre-flight JSON parsing/validation failed for ${blockName}: ${err.message}. Retrying local syntax/schema repair (Attempt ${preflightAttempts}/${maxPreflightAttempts})...`);

            const preflightRepairPrompt = `You are a precise JSON syntax/schema repair assistant.
The JSON output below has syntax/schema errors and cannot be parsed or validated.
Your task is to fix these errors and return ONLY the completely valid, parseable JSON object matching the required schema.

### SCHEMA/PARSE ERROR:
${err.message}

### MALFORMED JSON TO REPAIR:
\`\`\`json
${currentJsonStr}
\`\`\`

Return ONLY the corrected and valid JSON response. Do NOT wrap your response in markdown code blocks.`;

            const repairedJsonStr = await callAIEngine(preflightRepairPrompt, blockSchema, 0.1, undefined, undefined, false, 'widget_placement');
            currentJsonStr = repairedJsonStr.replace(/\`\`\`json/gi, '').replace(/\`\`\`/gi, '').trim();
          }
        }
        // Clean empty string, null, and dummy placeholder properties from interactiveComponents props to prevent validation failures
        if (parsed && Array.isArray(parsed.interactiveComponents)) {
          // Fields that are NEVER valid in the raw generated media components — the media-resolver/validator handles them downstream.
          const IMAGE_FORBIDDEN_KEYS = ['url', 'wikipediaUrl', 'wikipediaLink', 'imageUrl'];
          const AUDIO_VIDEO_FORBIDDEN_KEYS = ['url', 'id', 'provider', 'unresolved', 'wikipediaUrl', 'wikipediaLink', 'imageUrl'];
          for (const comp of parsed.interactiveComponents) {
            if (comp && comp.props && typeof comp.props === 'object') {
              const compTypeLower = typeof comp.componentType === 'string' ? comp.componentType.toLowerCase() : '';
              // [FIX] Unconditionally strip URL/link/platform fields from Image, Audio, and Video components:
              // they are resolved downstream via searchQuery/description search.
              if (compTypeLower === 'image') {
                for (const forbiddenKey of IMAGE_FORBIDDEN_KEYS) {
                  delete comp.props[forbiddenKey];
                }
              } else if (compTypeLower === 'audio' || compTypeLower === 'video') {
                for (const forbiddenKey of AUDIO_VIDEO_FORBIDDEN_KEYS) {
                  delete comp.props[forbiddenKey];
                }
              }
              const ENTITY_WIDGET_TYPES = [
                'realperson', 'historicalperson', 'conceptlink', 'location', 
                'eventlink', 'historicaleventlink', 'evenementhistorique', 'événementhistorique', 
                'glossary', 'lexique', 'biography'
              ];
              if (ENTITY_WIDGET_TYPES.includes(compTypeLower)) {
                delete comp.props.wikipediaUrl;
                delete comp.props.wikipediaLink;
                delete comp.props.url;
                delete comp.props.imageUrl;
                delete comp.props.searchQuery;
                
                if (compTypeLower !== 'biography') {
                  delete comp.props.dates;
                  delete comp.props.year;
                  delete comp.props.birthYear;
                  delete comp.props.deathYear;
                }
              }
              for (const key of Object.keys(comp.props)) {
                const val = comp.props[key];
                if (
                  val === '' ||
                  val === null ||
                  val === 'null' ||
                  (typeof val === 'string' &&
                    (key.toLowerCase().includes('url') || key.toLowerCase().includes('link')) &&
                    (val.toLowerCase().includes('example.com') ||
                      val.toLowerCase().includes('placeholder') ||
                      val.toLowerCase().includes('tbd') ||
                      val.toLowerCase().includes('your_') ||
                      val.toLowerCase().includes('dummy')))
                ) {
                  delete comp.props[key];
                }
              }
            }
          }
        }
        // Clean empty string, null, and dummy placeholder properties from goingFurther items
        if (parsed && parsed.goingFurther && Array.isArray(parsed.goingFurther.items)) {
          for (const item of parsed.goingFurther.items) {
            if (item && typeof item === 'object') {
              for (const key of Object.keys(item)) {
                const val = item[key];
                if (
                  val === '' ||
                  val === null ||
                  val === 'null' ||
                  (typeof val === 'string' &&
                    (key.toLowerCase().includes('url') || key.toLowerCase().includes('link')) &&
                    (val.toLowerCase().includes('example.com') ||
                      val.toLowerCase().includes('placeholder') ||
                      val.toLowerCase().includes('tbd') ||
                      val.toLowerCase().includes('your_') ||
                      val.toLowerCase().includes('dummy')))
                ) {
                  delete item[key];
                }
              }
            }
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


  return { approvedNarrativeText, activeAnchors, lessonOutlineObj };
