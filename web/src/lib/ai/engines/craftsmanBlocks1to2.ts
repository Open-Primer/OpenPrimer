import { saveDraftRevision, safeJsonParse } from './coreUtils';
import { widgetBlockAuditSchema } from './aiSchemas';

export async function runCraftsmanBlocks1to2(
  item: any,
  approvedNarrativeText: string,
  targetLang: string,
  discipline: string,
  callAIEngine: any,
  log: (msg: string) => Promise<void>
): Promise<any> {
  const blockResults: any = {};
      // --- Block 1: Structure Widgets ---
      // [FIX G10] TODO: The 4 widget block critic prompts below share ~80% structure.
      // Future refactor: extract to buildWidgetCriticPrompt(blockNum, content, context) helper
      // to reduce ~300 lines of duplication across block1–block4 critic prompts.
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

      const widgetBlock1Entry = {
        blockName: "Block 1: Structure",
        attempts: 0,
        rejections: 0,
        approved: false
      };
      lessonStats.widgetBlockAttempts.push(widgetBlock1Entry);

      if (isTerminalEvaluation) {
        block1Approved = true;
        widgetBlock1Entry.approved = true;
        parsedWidgets.prerequisites = null;
        parsedWidgets.diagnosticQuiz = null;
        parsedWidgets.learningObjectives = null;
      } else {
        while (!block1Approved && block1Iteration < maxBlock1Iterations) {
        block1Iteration++;
        lessonStats.widgetsAttempts++;
        widgetBlock1Entry.attempts = block1Iteration;
        await log(`[AI GENERATOR] Generating Widget Block 1 (Attempt #${block1Iteration})...`);

        let block1PromptWithFeedback = block1Prompt;
        if (block1Feedback) {
          block1PromptWithFeedback += `\n\n🚨 PREVIOUS CRITIQUE:\n"${block1Feedback}"\nPlease fix these issues and regenerate.`;
        }

        try {
          block1Parsed = await generateAndParseWidgetBlock(block1PromptWithFeedback, widgetBlock1Schema, 'Block 1 Structure');
        } catch (e) {
          await log(`[AI GENERATOR] Widget Block 1 failed to parse. Retrying...`);
          continue;
        }

        // Critique block 1
        await log(`[AI GENERATOR] Auditing Widget Block 1...`);
        const block1CriticPrompt = `You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 1:
${JSON.stringify(block1Parsed, null, 2)}

Check:
1. Prerequisites are realistic.
2. DiagnosticQuiz index is correct.
3. LearningObjectives use Bloom's Taxonomy verbs (Analyze, Evaluate, Create for L1/L2/L3/Master levels).
4. ZERO placeholders, draft markers (e.g. bracketed text like "[insert]"), or template values are allowed. Reject the block if any text or option contains placeholder words like "Option", "placeholder", "todo", "tbd", "tbc", "lorem", "ipsum", "N/A" (or "n/a"), "## Section Name" or empty strings. All text fields must be fully fleshed out and complete.
5. CRITICAL WIDGET CONNECTION: The diagnosticQuiz must be strongly connected to the lesson's topics, containing actual high-quality educational content with specific parameters and a clear explanation of how the question relates to the prerequisites.

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

        if (process.env.DEBUG === 'true') saveDraftRevision(`prompt_stage2_widgets_block1_${item.slug}_iter${block1Iteration}.md`, block1PromptWithFeedback); // [FIX G4/G5]
        if (block1Parsed) {
          if (process.env.DEBUG === 'true') saveDraftRevision(`draft_stage2_widgets_block1_${item.slug}_iter${block1Iteration}.json`, JSON.stringify(block1Parsed, null, 2)); // [FIX G4/G5]
        }
        if (process.env.DEBUG === 'true') saveDraftRevision(`prompt_stage2_widgets_block1_critique_${item.slug}_iter${block1Iteration}.md`, block1CriticPrompt); // [FIX G4/G5]

        const criticJsonStr = await callAIEngine(block1CriticPrompt, widgetBlockAuditSchema, 0.1, undefined, undefined, false, 'widget_placement');
        if (process.env.DEBUG === 'true') saveDraftRevision(`critique_stage2_widgets_block1_${item.slug}_iter${block1Iteration}.json`, criticJsonStr); // [FIX G4/G5]
        const cleanCritic = criticJsonStr.replace(/\`\`\`json/gi, '').replace(/\`\`\`/gi, '').trim();
        let auditResult = { approved: true, critique: '', fields: [] as any[] };
        try {
          auditResult = safeJsonParse(cleanCritic, 'Widget Block 1 Audit Parsing');
        } catch (e) {
          console.warn(`[AI GENERATOR] Failed to parse Block 1 critique:`, e);
        }

        if (auditResult.approved || isTerminalEvaluation) {
          await log(`[AI GENERATOR] Widget Block 1 approved by Critique Agent!`);
          block1Approved = true;
          widgetBlock1Entry.approved = true;
        } else {
          let critiqueMsg = auditResult.critique || 'Widget Block 1 rejected.';
          if (auditResult.fields && auditResult.fields.length > 0) {
            critiqueMsg += '\nDetailed errors:\n' + auditResult.fields.map((f: any) => `- Field "${f.field}": ${f.critique}`).join('\n');
          }
          await log(`[AI GENERATOR WARNING] Widget Block 1 REJECTED. Critique: "${critiqueMsg}".`);
          lessonStats.widgetsRejections++;
          widgetBlock1Entry.rejections++;
          block1Feedback = critiqueMsg;
        }
      }

      if (block1Parsed) {
        parsedWidgets.prerequisites = block1Parsed.prerequisites;
        parsedWidgets.diagnosticQuiz = block1Parsed.diagnosticQuiz;
        parsedWidgets.learningObjectives = block1Parsed.learningObjectives;
      }


      }      // --- Block 2: Narrative / Interactive Components ---
      let block2Approved = false;
      let block2Iteration = 0;
      const maxBlock2Iterations = 3;
      let block2Feedback = '';
      let block2Parsed: any = null;
      let block3Parsed: any = null;

      const widgetBlock2Entry = {
        blockName: "Block 2: Interactive",
        attempts: 0,
        rejections: 0,
        approved: false
      };
      lessonStats.widgetBlockAttempts.push(widgetBlock2Entry);

      const activeCustomAnchors = activeAnchors.filter(a => {
        const typeLower = a.type.toLowerCase();
        return !['prerequisites', 'diagnosticquiz', 'learningobjectives', 'conclusionsummary', 'whatsnext', 'goingfurther', 'finalevaluation', 'references', 'reference', 'citation', 'ref'].includes(typeLower);
      });

      const block2Types = ['biography', 'realperson', 'historicalperson', 'conceptlink', 'eventlink', 'historicaleventlink', 'evenementhistorique', 'événementhistorique', 'location', 'glossary'];
      const block2CustomAnchors = activeCustomAnchors.filter(a => block2Types.includes(a.type.toLowerCase()));
      const block3CustomAnchors = activeCustomAnchors.filter(a => !block2Types.includes(a.type.toLowerCase()));

      if (block2CustomAnchors.length === 0 || isTerminalEvaluation) {
        await log(`[AI GENERATOR] No enrichment hover card anchors found. Skipping Widget Block 2 (Enrichment).`);
        block2Approved = true;
        widgetBlock2Entry.approved = true;
      } else {
        const block2Prompt = `You are a world-class educational curriculum architect and JSON data validator (Agent 3B - Widgets Architect).
Your task is to design the JSON object for the Enrichment Hover Cards / Entity Links of the lesson (biographies, persons, concepts, events, locations, and glossary terms).

The narrative text contains the following custom widget anchors that you MUST define:
${block2CustomAnchors.map(a => `- Anchor: [[WIDGET:${a.type}:${a.id}${a.topic ? `:${a.topic}` : ''}]] (Type: "${a.type}", ID: "${a.id}", Topic: "${a.topic || ''}")`).join('\n')}

---

### CATALOG AND GUIDELINES:
${dynamicCatalogList}

### REQUIRED PROPS STRUCTURE per componentType:
1. "Biography":
   - "name": (string) Full name of the person.
   - "dates": (string) Lifespan dates, e.g. "1723-1790" or "1856-1939".
   - "description": (string) Detailed biographical summary focusing on their contributions (8-12 sentences).
   ⛔ ABSOLUTELY FORBIDDEN: Do NOT output "url", "wikipediaUrl", "wikipediaLink", "imageUrl", or "searchQuery". These are resolved automatically downstream.
2. "RealPerson" or "HistoricalPerson":
   - "name": (string) Full name of the person (should match the Anchor Topic if provided).
   - "description": (string) Wikipedia-style hover card tooltip summary of this person (2-4 sentences).
   ⛔ ABSOLUTELY FORBIDDEN: Do NOT output "dates", "year", "url", "wikipediaUrl", "wikipediaLink", "imageUrl", or "searchQuery". These are resolved automatically downstream.
3. "ConceptLink":
   - "name": (string) Name of the concept (should match the Anchor Topic if provided).
   - "description": (string) Wikipedia-style hover card tooltip summary of this concept (2-4 sentences).
   ⛔ ABSOLUTELY FORBIDDEN: Do NOT output "url", "wikipediaUrl", "wikipediaLink", "imageUrl", or "searchQuery". These are resolved automatically downstream.
4. "EventLink", "HistoricalEventLink", "EvenementHistorique", or "ÉvénementHistorique":
   - "name": (string) Name of the event (should match the Anchor Topic if provided).
   - "description": (string) Wikipedia-style hover card tooltip summary of this event (2-4 sentences).
   ⛔ ABSOLUTELY FORBIDDEN: Do NOT output "dates", "year", "url", "wikipediaUrl", "wikipediaLink", "imageUrl", or "searchQuery". These are resolved automatically downstream.
5. "Location":
   - "name": (string) Name of the location (should match the Anchor Topic if provided).
   - "description": (string) Wikipedia-style hover card tooltip summary of this location (2-4 sentences).
   ⛔ ABSOLUTELY FORBIDDEN: Do NOT output "url", "wikipediaUrl", "wikipediaLink", "imageUrl", or "searchQuery". These are resolved automatically downstream.
6. "Glossary":
   - "term": (string) Glossary vocabulary term.
   - "definition": (string) Detailed vocabulary definition (2-4 sentences).
   ⛔ ABSOLUTELY FORBIDDEN: Do NOT output "url", "wikipediaUrl", "wikipediaLink", "imageUrl", or "searchQuery". These are resolved automatically downstream.

DO NOT output any properties that are not explicitly defined in the props catalog above for a given componentType. For instance, do NOT output "year", "dates", "url", "wikipediaUrl", "wikipediaLink", "imageUrl", or "searchQuery" for Biography, RealPerson, HistoricalPerson, ConceptLink, HistoricalEventLink, Location, or Glossary; if you do, the critique agent will reject the block.

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
          widgetBlock2Entry.attempts = block2Iteration;
          await log(`[AI GENERATOR] Generating Widget Block 2 (Attempt #${block2Iteration})...`);

          let block2PromptWithFeedback = block2Prompt;
          if (block2Feedback) {
            block2PromptWithFeedback += `\n\n🚨 PREVIOUS CRITIQUE:\n"${block2Feedback}"\nPlease fix these issues and regenerate.`;
          }

          try {
            block2Parsed = await generateAndParseWidgetBlock(block2PromptWithFeedback, widgetBlock2Schema, 'Block 2 Interactive');
          } catch (e) {
            await log(`[AI GENERATOR] Widget Block 2 failed to parse. Retrying...`);
            continue;
          }

          // Critique block 2
          await log(`[AI GENERATOR] Auditing Widget Block 2...`);
          const block2CriticPrompt = `You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 2:
${JSON.stringify(block2Parsed, null, 2)}

Ensure:
1. Every anchor specified in the prompt is mapped.
2. Captions and descriptions have no sequential figure prefixes like "Figure 1:".
3. Biography component details (dates, Wikipedia link) are correct.
4. ZERO placeholders, draft markers, bracketed texts, or template values are present. Biographies, interactive elements, figures, and diagrams must be fully populated with real, high-quality, professional educational content in the target language. Absolutely no fake URLs, lorem ipsum text, "N/A", "## Section Name", or incomplete fields. Reject the block if any placeholder or skeletal text is detected.
5. The "year", "dates", "url", or "wikipediaLink" properties can be "null" or omitted for components that do not require them or where the resource is unresolved/needs backend matching (such as RealPerson, HistoricalPerson, ConceptLink, Location, Glossary, Image, Audio, Video, EventLink, HistoricalEventLink, EvenementHistorique, and ÉvénementHistorique). Do NOT reject the block or treat "null" or omission as a placeholder or incomplete for these properties on non-applicable component types.
6. CRITICAL WIDGET CONNECTION: Every interactive component or hover card (Biography, RealPerson, HistoricalPerson, ConceptLink, Location, Glossary, EventLink) must be strongly connected to the lesson's topics, informative, and detailed.

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

          if (process.env.DEBUG === 'true') saveDraftRevision(`prompt_stage2_widgets_block2_${item.slug}_iter${block2Iteration}.md`, block2PromptWithFeedback); // [FIX G4/G5]
          if (block2Parsed) {
            if (process.env.DEBUG === 'true') saveDraftRevision(`draft_stage2_widgets_block2_${item.slug}_iter${block2Iteration}.json`, JSON.stringify(block2Parsed, null, 2)); // [FIX G4/G5]
          }
          if (process.env.DEBUG === 'true') saveDraftRevision(`prompt_stage2_widgets_block2_critique_${item.slug}_iter${block2Iteration}.md`, block2CriticPrompt); // [FIX G4/G5]

          const criticJsonStr = await callAIEngine(block2CriticPrompt, widgetBlockAuditSchema, 0.1, undefined, undefined, false, 'widget_placement');
          if (process.env.DEBUG === 'true') saveDraftRevision(`critique_stage2_widgets_block2_${item.slug}_iter${block2Iteration}.json`, criticJsonStr); // [FIX G4/G5]
          const cleanCritic = criticJsonStr.replace(/\`\`\`json/gi, '').replace(/\`\`\`/gi, '').trim();
          let auditResult = { approved: true, critique: '', fields: [] as any[] };
          try {
            auditResult = safeJsonParse(cleanCritic, 'Widget Block 2 Audit Parsing');
          } catch (e) {
            console.warn(`[AI GENERATOR] Failed to parse Block 2 critique:`, e);
          }

          if (auditResult.approved || block2Iteration >= 2) {
            if (!auditResult.approved) {
              await log(`[AI GENERATOR WARNING] Widget Block 2 warnings accepted on attempt #${block2Iteration}. Proceeding with generated content.`);
            } else {
              await log(`[AI GENERATOR] Widget Block 2 approved by Critique Agent!`);
            }
            block2Approved = true;
            widgetBlock2Entry.approved = true;
          } else {
            let critiqueMsg = auditResult.critique || 'Widget Block 2 rejected.';
            if (auditResult.fields && auditResult.fields.length > 0) {
              critiqueMsg += '\nDetailed errors:\n' + auditResult.fields.map((f: any) => `- Field "${f.field}": ${f.critique}`).join('\n');
            }
            await log(`[AI GENERATOR WARNING] Widget Block 2 REJECTED. Critique: "${critiqueMsg}".`);
            lessonStats.widgetsRejections++;
            widgetBlock2Entry.rejections++;
            block2Feedback = critiqueMsg;
          }
        }
      }

      if (block2Parsed && Array.isArray(block2Parsed.interactiveComponents)) {
        parsedWidgets.interactiveComponents = block2Parsed.interactiveComponents;
      }


  return blockResults;
}
