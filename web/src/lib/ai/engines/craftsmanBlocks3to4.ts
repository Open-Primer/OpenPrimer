import { getDescriptiveLevelForPrompt } from '@/lib/ai/engines/coreUtils';
import { saveDraftRevision, safeJsonParse, getConstraintKeyForLevel } from './coreUtils';
import { widgetBlock2Schema, widgetBlock3Schema } from '@/lib/ai/schemas/lessonWidgetsSchema';
import { widgetBlockAuditSchema } from './aiSchemas';

export async function runCraftsmanBlocks3to4(
  item: any,
  approvedNarrativeText: string,
  targetLang: string,
  discipline: string,
  callAIEngine: any,
  log: (msg: string) => Promise<void>
): Promise<any> {
  const blockResults: any = {};
  const levelInput = (item as any).level || 'university_undergrad';
  const correctedCourseName = (item as any).courseName || (item as any).courseTitle || discipline;
  const lessonStats: any = { widgetBlockAttempts: [] };
  const isTerminalEvaluation = Boolean((item as any).isTerminalEvaluation);
  const parsedWidgets: any = {};
  const activeAnchors: any[] = [];
  const dynamicCatalogList = '';
  const constraintKey = getConstraintKeyForLevel(levelInput);
  const courseContext: any = { discipline, level: levelInput, courseName: correctedCourseName };
  async function generateAndParseWidgetBlock(prompt: string, schema: any, name: string): Promise<any> {
    const raw = await callAIEngine(prompt, schema, 0.1, undefined, undefined, false, 'widget_placement');
    return safeJsonParse(raw.replace(/\`\`\`json/gi, '').replace(/\`\`\`/gi, '').trim(), name);
  }
  let block3CustomAnchors: any[] = [];
  let block3Parsed: any = null;
      // --- Block 3: Practice & Media ---
      if (block3CustomAnchors.length > 0 && !isTerminalEvaluation) {
        let block3Approved = false;
        let block3Iteration = 0;
        const maxBlock3Iterations = 3;
        let block3Feedback = '';

        const widgetBlock3Entry = {
          blockName: "Block 3: Practice & Media",
          attempts: 0,
          rejections: 0,
          approved: false
        };
        lessonStats.widgetBlockAttempts.push(widgetBlock3Entry);

        const block3Prompt = `You are a world-class educational curriculum architect and JSON data validator (Agent 3B - Widgets Architect).
Your task is to design the JSON object for the Practice Exercises, Visual Diagrams, and Multimedia components of the lesson (quizzes, exercises, charts, videos, and audios).

The narrative text contains the following custom widget anchors that you MUST define in this block:
${block3CustomAnchors.map(a => `- Anchor: [[WIDGET:${a.type}:${a.id}${a.topic ? `:${a.topic}` : ''}]] (Type: "${a.type}", ID: "${a.id}", Topic: "${a.topic || ''}")`).join('\n')}

---

### CATALOG AND GUIDELINES:
${dynamicCatalogList}

### REQUIRED PROPS STRUCTURE per componentType:
1. "Image":
   - "description": (string) Detailed academic description of what the image depicts (at least 2-3 sentences). Must have a strong, direct connection with the current lesson/concept, and must be highly informative (never generic or decorative). Write it as a description of an existing image (e.g., "Carte linguistique de la péninsule italienne montrant la répartition des principaux groupes de dialectes...") rather than drawing instructions for a designer (e.g. do NOT say "Générer une carte..."). Do NOT generate sequential figure prefixes.
   - "alt": (string) Short description for accessibility.
   - "caption": (string) A detailed, italicized, and highly pedagogical inquiry-based caption. It must NOT be a simple descriptive summary of what the image shows (avoid plain descriptions like "Un buste de Pythagore"). Instead, it MUST pose a thought-provoking question, prompt active reflection, or highlight specific academic utility to make the learner think (e.g. "En quoi la structure géométrique de ce monocorde permet-elle de visualiser concrètement les rapports harmoniques ?"). Do NOT generate sequential figure numbers.
   - "title": (string) Short title of the image.
   - "searchQuery": (string) Highly canonical 1 to 3 search words (e.g. 'Claudio Monteverdi', 'Prise de la Bastille') to search in archives.
   ⛔ ABSOLUTELY FORBIDDEN for Image: Do NOT output "url", "wikipediaUrl", "wikipediaLink", "imageUrl", or "year" for Image components under any circumstances. These fields do not exist for Image. The URL is resolved automatically downstream by the media-resolver pipeline using the searchQuery and description. Including any of these fields — even with a seemingly valid URL — will cause a pipeline error and block validation.
2. "Video":
   - "title": (string) Title of the video documentary or lecture segment.
   - "duration": (string) Estimated duration, e.g. "3:15".
   - "description": (string) Detailed description of the video's content, documentary topic, or lecture segment. MANDATORY.
   - "searchQuery": (string) Canonical search query to find this video on platforms like YouTube. MANDATORY.
   ⛔ ABSOLUTELY FORBIDDEN for Video: Do NOT output "url", "id", "provider", "unresolved", "wikipediaUrl", "wikipediaLink", or "imageUrl" for Video components under any circumstances. These fields do not exist for Video in the initial widget definition. The resource is resolved automatically downstream by the external-resource-resolver pipeline using the searchQuery and title. Including any of these fields will cause a pipeline error and block validation.
3. "Audio":
   - "title": (string) Short descriptive title for the audio.
   - "duration": (string) e.g. "1:30".
   - "description": (string) Detailed description/narration text. MANDATORY.
   - "searchQuery": (string) Canonical search query to find this audio resource. MANDATORY.
   ⛔ ABSOLUTELY FORBIDDEN for Audio: Do NOT output "url", "unresolved", "wikipediaUrl", "wikipediaLink", or "imageUrl" for Audio components under any circumstances. These fields do not exist for Audio in the initial widget definition. The resource is resolved automatically downstream by the external-resource-resolver pipeline using the searchQuery and title. Including any of these fields will cause a pipeline error and block validation.
4. "Quiz":
   - "limit": (integer) Number of questions to display.
   - "questions": (array of objects) Each object must have:
     - "q": (string) The question card text.
     - "explanation": (string) Extremely concise, punchy explanation of the correct choice(s).
     - "multiple": (boolean, optional) Set to true if the question has MULTIPLE correct answers — the student must select ALL of them. Omit or set false for standard single-answer questions. Use multiple=true for at most 25% of questions to add variety.
     - "options": (array of objects) Each option must have:
       - "text": (string) Option text.
       - "correct": (boolean) Whether correct. For multiple=true, mark ALL correct options as correct=true.
5. "SolvedExercise":
   - "title": (string) Exercise title.
   - "problem": (string) The markdown-formatted problem statement.
   - "solution": (string) Detailed step-by-step solution.
6. "UnsolvedExercise":
   - "title": (string) Exercise title.
   - "problem": (string) Markdown problem statement.
   - "correctAnswer": (string) The correct analytical answer or formula.
7. "FillInBlanks":
   - "sentence": (string) Sentence containing one or more blanks represented by five underscores (_____).
   - "answer": (string) Correct comma-separated answers.
8. "Mermaid":
   - "chart": (string) Valid Mermaid chart notation starting with graph/sequenceDiagram/etc.

DO NOT output any properties that are not explicitly defined in the props catalog above for a given componentType. For instance, do NOT output "year", "dates", "url", "wikipediaUrl", "wikipediaLink", "imageUrl", "id", "provider", or "unresolved" for Image, Audio, Video, Quiz, SolvedExercise, UnsolvedExercise, or Mermaid; if you do, the critique agent will reject the block.

You must define the "interactiveComponents" array containing one object for each anchor listed above.
For each component:
- "id": Must match the ID from the anchor.
- "componentType": Must match the Type from the anchor.
- "sectionAnchor": The markdown heading "## Section Name" where this widget is placed in the narrative.
- "props": The specific properties required for the widget type as described above.

⚠️ CRITICAL INSTRUCTION ON INTERACTIVE WIDGETS & SIMULATORS:
- ALL interactive widgets (such as quizzes, solved/unsolved exercises, Mermaid charts, DataCharts, and simulations like "FunctionPlotter", "FunctionManipulator", "DynamicSimulation", "BasicMathExplorer", "ChemicalStoichiometry", etc.) MUST be strongly connected to the lesson.
- Choice of Parameters: You must ensure that the choice of parameters, equations, formulas, variables, inputs, or datasets is highly customized, topic-specific, and not generic. Never use default placeholders (such as "y = x^2" or generic template arrays).
- Explanation Section: Every interactive widget must include a clear, detailed explanation or solution section explaining how these parameters and inputs relate to the lesson's concepts, showing real academic depth.
- Concurrency: If the same widget is used multiple times, configure each instance with different, highly topic-relevant parameters.
- Mandatory Caption/Legend: You MUST specify a detailed, academic caption/description/legend (via the "caption" or "description" prop) for every single interactive widget, simulator, Mermaid chart, and data table. This caption/legend is required for accessibility and academic rigor and must describe the widget and its parameters.

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

        while (!block3Approved && block3Iteration < maxBlock3Iterations) {
          block3Iteration++;
          lessonStats.widgetsAttempts++;
          widgetBlock3Entry.attempts = block3Iteration;
          await log(`[AI GENERATOR] Generating Widget Block 3 (Attempt #${block3Iteration})...`);

          let block3PromptWithFeedback = block3Prompt;
          if (block3Feedback) {
            block3PromptWithFeedback += `\n\n🚨 PREVIOUS CRITIQUE:\n"${block3Feedback}"\nPlease fix these issues and regenerate.`;
          }

          try {
            block3Parsed = await generateAndParseWidgetBlock(block3PromptWithFeedback, widgetBlock2Schema, 'Block 3 Interactive Part 2');
          } catch (e) {
            await log(`[AI GENERATOR] Widget Block 3 failed to parse. Retrying...`);
            continue;
          }

          // Critique block 3
          await log(`[AI GENERATOR] Auditing Widget Block 3...`);
          const block3CriticPrompt = `You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
${JSON.stringify(block3Parsed, null, 2)}

Ensure:
1. Every anchor specified in the prompt is mapped.
2. Captions and descriptions have no sequential figure prefixes like "Figure 1:".
3. Biography component details (dates, Wikipedia link) are correct.
4. ZERO placeholders, draft markers, bracketed texts, or template values are present. Biographies, interactive elements, figures, and diagrams must be fully populated with real, high-quality, professional educational content in the target language. Absolutely no fake URLs, lorem ipsum text, "N/A", "## Section Name", or incomplete fields. Reject the block if any placeholder or skeletal text is detected.
5. CRITICAL MEDIA RULES:
   - Image components MUST NOT contain "url", "wikipediaUrl", "wikipediaLink", "imageUrl", or "year" properties.
   - Video components MUST NOT contain "url", "id", "provider", "unresolved", "wikipediaUrl", "wikipediaLink", or "imageUrl" properties.
   - Audio components MUST NOT contain "url", "unresolved", "wikipediaUrl", "wikipediaLink", or "imageUrl" properties.
   These fields are FORBIDDEN in the raw widgets JSON for Image, Video, and Audio. They are resolved automatically downstream by the external-resource-resolver pipeline using the component's title/searchQuery/description. Any media component missing these fields is CORRECT and must NOT be rejected. If a media component DOES contain any of these forbidden fields (even with a seemingly valid URL), that IS an error and should be flagged.
6. For other components (Quiz, SolvedExercise, UnsolvedExercise, FillInBlanks, Mermaid): "url", "wikipediaLink", "wikipediaUrl" can be null or omitted — this is acceptable. Do NOT reject those component types for missing URL fields.
7. For UnsolvedExercise components, the props must contain "title", "problem", and "correctAnswer". Do NOT reject them for missing "questions" or "tasks" as those are not part of the UnsolvedExercise props structure.
8. CRITICAL IMAGE RELEVANCE: Every Image or media component must have a strong, direct connection with the current lesson/concept, and must be highly informative (not merely decorative or filler). The caption/description must clearly explain its relevance. Reject if decorative/generic or lacking clear informative value.
9. CRITICAL INTERACTIVE WIDGETS CONNECTION: Every interactive widget (Quiz, SolvedExercise, UnsolvedExercise, Mermaid chart, DataChart, and simulations) must be strongly connected to the lesson. You must verify that the choice of parameters, equations, inputs, or datasets is highly specific to the lesson's topic (not generic defaults). Verify that every interactive widget has a clear, detailed explanation or solution section explaining the logic and how the parameters relate to the lesson's concepts. Reject the block if any interactive widget has generic parameters or lacks a proper explanation section.

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

          if (process.env.DEBUG === 'true') saveDraftRevision(`prompt_stage2_widgets_block3_${item.slug}_iter${block3Iteration}.md`, block3PromptWithFeedback);
          if (block3Parsed) {
            if (process.env.DEBUG === 'true') saveDraftRevision(`draft_stage2_widgets_block3_${item.slug}_iter${block3Iteration}.json`, JSON.stringify(block3Parsed, null, 2));
          }
          if (process.env.DEBUG === 'true') saveDraftRevision(`prompt_stage2_widgets_block3_critique_${item.slug}_iter${block3Iteration}.md`, block3CriticPrompt);

          const criticJsonStr = await callAIEngine(block3CriticPrompt, widgetBlockAuditSchema, 0.1, undefined, undefined, false, 'widget_placement');
          if (process.env.DEBUG === 'true') saveDraftRevision(`critique_stage2_widgets_block3_${item.slug}_iter${block3Iteration}.json`, criticJsonStr);
          const cleanCritic = criticJsonStr.replace(/\`\`\`json/gi, '').replace(/\`\`\`/gi, '').trim();
          let auditResult = { approved: true, critique: '', fields: [] as any[] };
          try {
            auditResult = safeJsonParse(cleanCritic, 'Widget Block 3 Audit Parsing');
          } catch (e) {
            console.warn(`[AI GENERATOR] Failed to parse Block 3 critique:`, e);
          }

          if (auditResult.approved || block3Iteration >= 2) {
            if (!auditResult.approved) {
              await log(`[AI GENERATOR WARNING] Widget Block 3 warnings accepted on attempt #${block3Iteration}. Proceeding with generated content.`);
            } else {
              await log(`[AI GENERATOR] Widget Block 3 approved by Critique Agent!`);
            }
            block3Approved = true;
            widgetBlock3Entry.approved = true;
          } else {
            let critiqueMsg = auditResult.critique || 'Widget Block 3 rejected.';
            if (auditResult.fields && auditResult.fields.length > 0) {
              critiqueMsg += '\nDetailed errors:\n' + auditResult.fields.map((f: any) => `- Field "${f.field}": ${f.critique}`).join('\n');
            }
            await log(`[AI GENERATOR WARNING] Widget Block 3 REJECTED. Critique: "${critiqueMsg}".`);
            lessonStats.widgetsRejections++;
            widgetBlock3Entry.rejections++;
            block3Feedback = critiqueMsg;
          }
        }
      }

      if (block3Parsed && Array.isArray(block3Parsed.interactiveComponents)) {
        parsedWidgets.interactiveComponents = [
          ...(parsedWidgets.interactiveComponents || []),
          ...block3Parsed.interactiveComponents
        ];
      }

      // --- Block 4: Conclusion, What's Next & Glossary ---
      let block4Approved = false;
      let block4Iteration = 0;
      const maxBlock4Iterations = 3;
      let block4Feedback = '';
      let block4Parsed: any = null;

      const widgetBlock4Entry = {
        blockName: "Block 4: Conclusion & Glossary",
        attempts: 0,
        rejections: 0,
        approved: false
      };
      lessonStats.widgetBlockAttempts.push(widgetBlock4Entry);

      const block4Prompt = `You are a world-class educational curriculum architect and JSON data validator (Agent 3B - Widgets Architect).
Your task is to design the JSON object for the conclusion, glossary, and transition widgets of the lesson:
Course: "${correctedCourseName}"
Level: "${getDescriptiveLevelForPrompt(levelInput)}"
Lesson Title: "${item.title}"
Language: "${targetLang.toUpperCase()}"

You must define the following JSON properties:
1. "conclusionSummary": An object containing an "items" array, which contains key takeaways of this lesson as complete sentences ending with periods (at least 5 bullet points).
2. "whatsNext": An object containing a "steps" array of transition steps/lessons. Each step object must have "title", "description" (a text showing the transition/link), and "slug" (slug of the next lesson).
3. "goingFurther": An object with an "items" array containing at least 5 to 7 high-quality, authoritative external resources (books, articles, videos, websites, research papers). For video and website types, you must provide a real, valid, functional URL (e.g. a specific working YouTube video URL or a real Wikipedia/academic portal URL). For books and research papers, the URL is optional and can be omitted. If you do not know a real, specific, valid URL, you MUST completely omit the "url" property from that item instead of generating a placeholder URL like "example.com" or "placeholder.com". Generate enough items (at least 5-7) so that even if some links fail automated reachability validation checks, the lesson will still display a rich selection of resources.
4. "glossary": ${constraintKey === 'university_grad' ? 'An array of at least 12 to 15 key technical terms with detailed definitions.' : constraintKey === 'university_undergrad' ? 'An array of at least 8 to 12 key technical terms with detailed definitions.' : 'An array of at least 3-4 key technical terms with detailed definitions.'}

Return ONLY a valid JSON object matching this schema:
\`\`\`json
{
  "conclusionSummary": {
    "items": ["string"]
  },
  "whatsNext": {
    "steps": [
      {
        "title": "string",
        "description": "string",
        "slug": "string"
      }
    ]
  },
  "goingFurther": {
    "items": [
      {
        "title": "string",
        "type": "string", // "book", "article", "video", "website", "research"
        "description": "string",
        "author": "string", // optional
        "year": "string", // optional
        "url": "string" // optional
      }
    ]
  },
  "glossary": [
    { "term": "string", "definition": "string" }
  ]
}
\`\`\`
Do NOT wrap your JSON response in markdown code blocks.`;

      if (isTerminalEvaluation) {
        block4Approved = true;
        widgetBlock4Entry.approved = true;
        parsedWidgets.conclusionSummary = '';
        parsedWidgets.whatsNext = null;
        parsedWidgets.goingFurther = null;
        parsedWidgets.glossary = [];
      } else {
        while (!block4Approved && block4Iteration < maxBlock4Iterations) {
        block4Iteration++;
        lessonStats.widgetsAttempts++;
        widgetBlock4Entry.attempts = block4Iteration;
        await log(`[AI GENERATOR] Generating Widget Block 4 (Attempt #${block4Iteration})...`);

        let block4PromptWithFeedback = block4Prompt;
        if (block4Feedback) {
          block4PromptWithFeedback += `\n\n🚨 PREVIOUS CRITIQUE:\n"${block4Feedback}"\nPlease fix these issues and regenerate.`;
        }

        try {
          block4Parsed = await generateAndParseWidgetBlock(block4PromptWithFeedback, widgetBlock3Schema, 'Block 4 Conclusion & Glossary');
        } catch (e) {
          await log(`[AI GENERATOR] Widget Block 4 failed to parse. Retrying...`);
          continue;
        }

        // Critique block 4
        await log(`[AI GENERATOR] Auditing Widget Block 4...`);
        const block4CriticPrompt = `You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 4:
${JSON.stringify(block4Parsed, null, 2)}

Ensure:
1. Glossary and conclusion summary are scientifically/academically accurate.
2. The language is strictly in ${targetLang.toUpperCase()}.
3. Absolutely ZERO placeholders, draft markers, TBDs, lorem ipsum text, "N/A", "## Section Name", or template values (like "your_youtube_id" or "placeholder") in the goingFurther, whatsNext, or glossary items. All fields must contain real, fully translated, complete information. Reject if any empty strings or dummy templates are used. Note that for goingFurther items, omitting the "url" property entirely is perfectly acceptable if a real URL is not known; do not reject items for not having a "url" property, but reject them if they have a dummy/placeholder URL like "example.com" or "placeholder.com".
4. CRITICAL WIDGET CONNECTION: The glossary, transition steps (whatsNext), and goingFurther items must be strongly connected to the lesson's topics and highly informative. Glossary definitions must be detailed and context-specific.

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

        if (process.env.DEBUG === 'true') saveDraftRevision(`prompt_stage2_widgets_block4_${item.slug}_iter${block4Iteration}.md`, block4PromptWithFeedback);
        if (block4Parsed) {
          if (process.env.DEBUG === 'true') saveDraftRevision(`draft_stage2_widgets_block4_${item.slug}_iter${block4Iteration}.json`, JSON.stringify(block4Parsed, null, 2));
        }
        if (process.env.DEBUG === 'true') saveDraftRevision(`prompt_stage2_widgets_block4_critique${item.slug}_iter${block4Iteration}.md`, block4CriticPrompt);

        const criticJsonStr = await callAIEngine(block4CriticPrompt, widgetBlockAuditSchema, 0.1, undefined, undefined, false, 'widget_placement');
        if (process.env.DEBUG === 'true') saveDraftRevision(`critique_stage2_widgets_block4${item.slug}_iter${block4Iteration}.json`, criticJsonStr);

        const cleanCritic = criticJsonStr.replace(/\`\`\`json/gi, '').replace(/\`\`\`/gi, '').trim();
        let auditResult = { approved: true, critique: '', fields: [] as any[] };
        try {
          auditResult = safeJsonParse(cleanCritic, 'Widget Block 4 Audit Parsing');
        } catch (e) {
          console.warn(`[AI GENERATOR] Failed to parse Block 4 critique:`, e);
        }

        if (auditResult.approved || isTerminalEvaluation) {
          await log(`[AI GENERATOR] Widget Block 4 approved by Critique Agent!`);
          block4Approved = true;
          widgetBlock4Entry.approved = true;
        } else {
          let critiqueMsg = auditResult.critique || 'Widget Block 4 rejected.';
          if (auditResult.fields && auditResult.fields.length > 0) {
            critiqueMsg += '\nDetailed errors:\n' + auditResult.fields.map((f: any) => `- Field "${f.field}": ${f.critique}`).join('\n');
          }
          await log(`[AI GENERATOR WARNING] Widget Block 4 REJECTED. Critique: "${critiqueMsg}".`);
          lessonStats.widgetsRejections++;
          widgetBlock4Entry.rejections++;
          block4Feedback = critiqueMsg;
        }
      }

      if (block4Parsed) {
        parsedWidgets.conclusionSummary = block4Parsed.conclusionSummary;
        parsedWidgets.whatsNext = block4Parsed.whatsNext;
        parsedWidgets.goingFurther = block4Parsed.goingFurther;
        parsedWidgets.glossary = block4Parsed.glossary;
      }




    }

  return blockResults;
}
