import { saveDraftRevision, safeJsonParse } from './coreUtils';
import { widgetBlockAuditSchema } from './aiSchemas';

export async function runCraftsmanBlock5(
  item: any,
  approvedNarrativeText: string,
  targetLang: string,
  discipline: string,
  level: string,
  isTerminalEvaluation: boolean,
  courseReferences: any[],
  callAIEngine: any,
  log: (msg: string) => Promise<void>
): Promise<any> {
  const parsedWidgets: any = {};
      // --- Block 5: Evaluation & Bibliography References ---
      let block5Parsed: any = { finalEvaluation: null, references: [] };

      // --- Sub-Block 5A: Final Evaluation Quiz ---
      let block5QuizApproved = false;
      let block5QuizIteration = 0;
      const maxBlock5QuizIterations = 3;
      let block5QuizFeedback = '';
      let block5QuizParsed: any = null;

      const widgetBlock5QuizEntry = {
        blockName: "Block 5A: Final Quiz",
        attempts: 0,
        rejections: 0,
        approved: false
      };
      lessonStats.widgetBlockAttempts.push(widgetBlock5QuizEntry);

      const block5QuizPrompt = `You are a world-class educational curriculum architect and JSON data validator (Agent 3B - Widgets Architect).
Your task is to design the JSON object for the final evaluation quiz of the lesson:
Course: "${correctedCourseName}"
Level: "${getDescriptiveLevelForPrompt(levelInput)}"
Lesson Title: "${item.title}"
Language: "${targetLang.toUpperCase()}"

You must define the following JSON property:
1. "finalEvaluation": An object with a "type" property (value "Quiz"), and a "props" object containing a "durationLimit" (integer, e.g. 1800) and a "questions" array. ${isTerminalEvaluation ? 'Provide exactly 15 questions covering the entire course. Do not use any hover card tags like RealPerson, ConceptLink, etc., inside quiz questions or options.' : 'Provide 5-10 questions covering this lesson.'} Each question object in the array must contain "q" (the question string), "explanation" (string), and an "options" array. Each option object in the options array must contain "text" (string) and "correct" (boolean, true if correct, false otherwise).

Return ONLY a valid JSON object matching this schema:
\\\`\\\`\\\`json
{
  "finalEvaluation": {
    "type": "Quiz",
    "props": {
      "durationLimit": 1800,
      "questions": [
        {
          "q": "string",
          "explanation": "string",
          "multiple": false,
          "options": [
            {
              "text": "string",
              "correct": boolean
            }
          ]
        }
      ]
    }
  }
}
\\\`\\\`\\\`
Do NOT wrap your JSON response in markdown code blocks.`;

      while (!block5QuizApproved && block5QuizIteration < maxBlock5QuizIterations) {
        block5QuizIteration++;
        lessonStats.widgetsAttempts++;
        widgetBlock5QuizEntry.attempts = block5QuizIteration;
        await log(`[AI GENERATOR] Generating Widget Block 5 Quiz (Attempt #${block5QuizIteration})...`);

        let quizPromptWithFeedback = block5QuizPrompt;
        if (block5QuizFeedback) {
          quizPromptWithFeedback += `\n\n🚨 PREVIOUS CRITIQUE:\n"${block5QuizFeedback}"\nPlease fix these issues and regenerate.`;
        }

        const totalQuestions = isTerminalEvaluation ? 15 : 5;
        const chunkSize = 5;
        const questions: any[] = [];
        let chunkFailed = false;

        for (let startIndex = 0; startIndex < totalQuestions; startIndex += chunkSize) {
          const currentChunkSize = Math.min(chunkSize, totalQuestions - startIndex);
          await log(`[AI GENERATOR] Generating Quiz Chunk (Questions ${startIndex + 1} to ${startIndex + currentChunkSize} of ${totalQuestions})...`);
          
          let chunkPrompt = `You are a world-class educational curriculum architect and JSON data validator (Agent 3B - Widgets Architect).
Your task is to design a portion of the final evaluation quiz of the lesson:
Course: "${correctedCourseName}"
Level: "${getDescriptiveLevelForPrompt(levelInput)}"
Lesson Title: "${item.title}"
Language: "${targetLang.toUpperCase()}"

Generate exactly ${currentChunkSize} high-quality quiz questions (Questions ${startIndex + 1} to ${startIndex + currentChunkSize} out of ${totalQuestions} total questions).
${isTerminalEvaluation ? 'These questions should cover the entire course and must be highly comprehensive, spanning multiple topics. Do not use any hover card tags like RealPerson, ConceptLink, etc., inside quiz questions or options.' : 'These questions should cover this lesson.'}
Each question object in the array must contain "q" (the question string), "explanation" (string), and an "options" array. Each option object in the options array must contain "text" (string) and "correct" (boolean, true if correct, false otherwise).

Return ONLY a valid JSON object matching this schema:
\`\`\`json
{
  "questions": [
    {
      "q": "string",
      "explanation": "string",
      "multiple": false,
      "options": [
        {
          "text": "string",
          "correct": boolean
        }
      ]
    }
  ]
}
\`\`\`
Do NOT wrap your JSON response in markdown code blocks.`;

          if (block5QuizFeedback) {
            chunkPrompt += `\n\n🚨 PREVIOUS CRITIQUE FOR THE WHOLE QUIZ:\n"${block5QuizFeedback}"\nPlease keep this critique in mind when generating these questions.`;
          }

          try {
            const widgetBlock5QuizChunkSchema = {
              type: "object",
              properties: {
                questions: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      q: { type: "string" },
                      explanation: { type: "string" },
                      multiple: { type: "boolean" },
                      options: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            text: { type: "string" },
                            correct: { type: "boolean" }
                          },
                          required: ["text", "correct"]
                        }
                      }
                    },
                    required: ["q", "explanation", "options"]
                  }
                }
              },
              required: ["questions"]
            };

            const chunkParsed = await generateAndParseWidgetBlock(chunkPrompt, widgetBlock5QuizChunkSchema, `Block 5 Quiz Chunk [${startIndex + 1}-${startIndex + currentChunkSize}]`);
            if (chunkParsed && Array.isArray(chunkParsed.questions)) {
              questions.push(...chunkParsed.questions);
            } else {
              throw new Error("Invalid chunk format: 'questions' array is missing or empty.");
            }
          } catch (e: any) {
            await log(`[AI GENERATOR WARNING] Failed to generate Quiz Chunk starting at ${startIndex + 1}: ${e.message}`);
            chunkFailed = true;
            break;
          }
        }

        if (chunkFailed || questions.length < totalQuestions) {
          await log(`[AI GENERATOR] Chunked quiz generation failed. Retrying entire quiz generation attempt...`);
          continue;
        }

        block5QuizParsed = {
          finalEvaluation: {
            type: "Quiz",
            props: {
              durationLimit: 1800,
              questions: questions
            }
          }
        };

        // Critique Quiz
        await log(`[AI GENERATOR] Auditing Widget Block 5 Quiz...`);
        const block5QuizCriticPrompt = `You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 5 Quiz:
${JSON.stringify(block5QuizParsed, null, 2)}

Ensure:
1. Quizzes are mathematically/scientifically accurate.
2. No HTML or custom Hover-Card tags inside quiz strings.
3. Absolutely ZERO placeholders or generic filler text (like "Option A", "Option B", "Option", etc.) are allowed in the quiz questions or options. All questions and options must contain actual high-quality academic content in the target language. Reject if any question has dummy options.
4. If this is a terminal evaluation (isTerminalEvaluation is ${isTerminalEvaluation}), no media (images, video, audio) or Mermaid diagrams are allowed in the quiz questions/explanations unless they are absolutely functional to the assessment itself (e.g. diagram-based logic puzzles). Decorative images or non-essential diagrams must be rejected.
5. If this is a terminal evaluation, no hover cards (RealPerson, ConceptLink, Glossary) are allowed in the quiz questions/explanations.
6. CRITICAL EVALUATION CONNECTION: Every question in the finalEvaluation quiz must be strongly connected to the lesson's/course's topics, with specific parameters or scenarios and a detailed pedagogical explanation of the correct choice(s). Reject the block if any question is trivial, generic, or lacks explanation.

Return ONLY a valid JSON object matching widgetBlockAuditSchema:
\\\`\\\`\\\`json
{
  "approved": boolean,
  "critique": "detailed feedback explaining what to fix globally, or empty if approved",
  "fields": [
    {
      "field": "finalEvaluation",
      "approved": false,
      "critique": "detailed feedback explaining what to fix in the quiz"
    }
  ]
}
\\\`\\\`\\\`

[REJECT-ONLY REPORTING MANDATE]
1. If approved is true: approved MUST be true, critique MUST be "", and fields MUST be empty.
2. If approved is false: fields MUST ONLY contain fields that are rejected (with approved set to false). Any approved field MUST be strictly omitted from the array.`;

        if (process.env.DEBUG === 'true') saveDraftRevision(`prompt_stage2_widgets_block5_quiz_${item.slug}_iter${block5QuizIteration}.md`, quizPromptWithFeedback);
        if (block5QuizParsed) {
          if (process.env.DEBUG === 'true') saveDraftRevision(`draft_stage2_widgets_block5_quiz_${item.slug}_iter${block5QuizIteration}.json`, JSON.stringify(block5QuizParsed, null, 2));
        }
        if (process.env.DEBUG === 'true') saveDraftRevision(`prompt_stage2_widgets_block5_quiz_critique${item.slug}_iter${block5QuizIteration}.md`, block5QuizCriticPrompt);

        const criticJsonStr = await callAIEngine(block5QuizCriticPrompt, widgetBlockAuditSchema, 0.1, undefined, undefined, false, 'widget_placement');
        if (process.env.DEBUG === 'true') saveDraftRevision(`critique_stage2_widgets_block5_quiz_${item.slug}_iter${block5QuizIteration}.json`, criticJsonStr);

        const cleanCritic = criticJsonStr.replace(/\`\`\`json/gi, '').replace(/\`\`\`/gi, '').trim();
        let auditResult = { approved: true, critique: '', fields: [] as any[] };
        try {
          auditResult = safeJsonParse(cleanCritic, 'Widget Block 5 Quiz Audit Parsing');
        } catch (e) {
          console.warn(`[AI GENERATOR] Failed to parse Block 5 Quiz critique:`, e);
        }

        if (auditResult.approved || block5QuizIteration >= 2 || isTerminalEvaluation) {
          if (!auditResult.approved) {
            await log(`[AI GENERATOR WARNING] Widget Block 5 Quiz warnings accepted on attempt #${block5QuizIteration}. Proceeding with generated content.`);
          } else {
            await log(`[AI GENERATOR] Widget Block 5 Quiz approved by Critique Agent!`);
          }
          block5QuizApproved = true;
          widgetBlock5QuizEntry.approved = true;
        } else {
          let critiqueMsg = auditResult.critique || 'Widget Block 5 Quiz rejected.';
          if (auditResult.fields && auditResult.fields.length > 0) {
            critiqueMsg += '\nDetailed errors:\n' + auditResult.fields.map((f: any) => `- Field "${f.field}": ${f.critique}`).join('\n');
          }
          await log(`[AI GENERATOR WARNING] Widget Block 5 Quiz REJECTED. Critique: "${critiqueMsg}".`);
          lessonStats.widgetsRejections++;
          widgetBlock5QuizEntry.rejections++;
          block5QuizFeedback = critiqueMsg;
        }
      }

      if (block5QuizParsed) {
        block5Parsed.finalEvaluation = block5QuizParsed.finalEvaluation;
      }

      // --- Sub-Block 5B: References ---
      let needReferencesGeneration = false;
      if (isTerminalEvaluation) {
        block5Parsed.references = [];
      } else if (courseReferences && courseReferences.length > 0) {
        block5Parsed.references = courseReferences;
      } else {
        needReferencesGeneration = true;
      }

      if (needReferencesGeneration) {
        let block5RefApproved = false;
        let block5RefIteration = 0;
        const maxBlock5RefIterations = 3;
        let block5RefFeedback = '';
        let block5RefParsed: any = null;

        const widgetBlock5RefEntry = {
          blockName: "Block 5B: References",
          attempts: 0,
          rejections: 0,
          approved: false
        };
        lessonStats.widgetBlockAttempts.push(widgetBlock5RefEntry);

        const block5RefPrompt = `You are a world-class educational curriculum architect and JSON data validator (Agent 3B - References Architect).
Your task is to design the JSON object for the academic bibliography references of the lesson:
Course: "${correctedCourseName}"
Level: "${getDescriptiveLevelForPrompt(levelInput)}"
Lesson Title: "${item.title}"
Language: "${targetLang.toUpperCase()}"
Citation Style: "${getCitationStyle(courseContext.discipline || correctedCourseName).fullName}"

You must define the following JSON property:
1. "references": ${constraintKey === 'university_grad' ? 'An array of 8 to 12 authoritative academic bibliography entries in the requested citation style.' : constraintKey === 'university_undergrad' ? 'An array of 6 to 8 authoritative academic bibliography entries in the requested citation style.' : 'An array of 3-5 authoritative academic bibliography entries in the requested citation style.'}

Return ONLY a valid JSON object matching this schema:
\\\`\\\`\\\`json
{
  "references": ["string"]
}
\\\`\\\`\\\`
Do NOT wrap your JSON response in markdown code blocks.`;

        while (!block5RefApproved && block5RefIteration < maxBlock5RefIterations) {
          block5RefIteration++;
          lessonStats.widgetsAttempts++;
          widgetBlock5RefEntry.attempts = block5RefIteration;
          await log(`[AI GENERATOR] Generating Widget Block 5 References (Attempt #${block5RefIteration})...`);

          let refPromptWithFeedback = block5RefPrompt;
          if (block5RefFeedback) {
            refPromptWithFeedback += `\n\n🚨 PREVIOUS CRITIQUE:\n"${block5RefFeedback}"\nPlease fix these issues and regenerate.`;
          }

          try {
            block5RefParsed = await generateAndParseWidgetBlock(refPromptWithFeedback, widgetBlock5ReferencesSchema, 'Block 5 References');
          } catch (e) {
            await log(`[AI GENERATOR] Widget Block 5 References failed to parse. Retrying...`);
            continue;
          }

          // Critique References
          await log(`[AI GENERATOR] Auditing Widget Block 5 References...`);
          const block5RefCriticPrompt = `You are the References Critic Agent (Agent 4B). Review this Widget Block 5 References:
${JSON.stringify(block5RefParsed, null, 2)}

Ensure:
1. Bibliography entries are valid academic citations.
2. The citations are formatted correctly according to the requested citation style: "${getCitationStyle(courseContext.discipline || correctedCourseName).fullName}".
3. ZERO placeholders, draft markers, bracketed texts, "N/A" (or "n/a"), "## Section Name", or dummy bibliography entries are allowed. All citations must be real, valid, complete academic publications formatted in the target language. Reject if any placeholders are detected.

Return ONLY a valid JSON object matching widgetBlockAuditSchema:
\\\`\\\`\\\`json
{
  "approved": boolean,
  "critique": "detailed feedback explaining what to fix globally, or empty if approved",
  "fields": [
    {
      "field": "references",
      "approved": false,
      "critique": "detailed feedback explaining what to fix in the bibliography"
    }
  ]
}
\\\`\\\`\\\`

[REJECT-ONLY REPORTING MANDATE]
1. If approved is true: approved MUST be true, critique MUST be "", and fields MUST be empty.
2. If approved is false: fields MUST ONLY contain fields that are rejected (with approved set to false). Any approved field MUST be strictly omitted from the array.`;

          if (process.env.DEBUG === 'true') saveDraftRevision(`prompt_stage2_widgets_block5_ref_${item.slug}_iter${block5RefIteration}.md`, refPromptWithFeedback);
          if (block5RefParsed) {
            if (process.env.DEBUG === 'true') saveDraftRevision(`draft_stage2_widgets_block5_ref_${item.slug}_iter${block5RefIteration}.json`, JSON.stringify(block5RefParsed, null, 2));
          }
          if (process.env.DEBUG === 'true') saveDraftRevision(`prompt_stage2_widgets_block5_ref_critique${item.slug}_iter${block5RefIteration}.md`, block5RefCriticPrompt);

          const criticJsonStr = await callAIEngine(block5RefCriticPrompt, widgetBlockAuditSchema, 0.1, undefined, undefined, false, 'widget_placement');
          if (process.env.DEBUG === 'true') saveDraftRevision(`critique_stage2_widgets_block5_ref_${item.slug}_iter${block5RefIteration}.json`, criticJsonStr);

          const cleanCritic = criticJsonStr.replace(/\`\`\`json/gi, '').replace(/\`\`\`/gi, '').trim();
          let auditResult = { approved: true, critique: '', fields: [] as any[] };
          try {
            auditResult = safeJsonParse(cleanCritic, 'Widget Block 5 References Audit Parsing');
          } catch (e) {
            console.warn(`[AI GENERATOR] Failed to parse Block 5 References critique:`, e);
          }

          if (auditResult.approved) {
            await log(`[AI GENERATOR] Widget Block 5 References approved by Critique Agent!`);
            block5RefApproved = true;
            widgetBlock5RefEntry.approved = true;
          } else {
            let critiqueMsg = auditResult.critique || 'Widget Block 5 References rejected.';
            if (auditResult.fields && auditResult.fields.length > 0) {
              critiqueMsg += '\nDetailed errors:\n' + auditResult.fields.map((f: any) => `- Field "${f.field}": ${f.critique}`).join('\n');
            }
            await log(`[AI GENERATOR WARNING] Widget Block 5 References REJECTED. Critique: "${critiqueMsg}".`);
            lessonStats.widgetsRejections++;
            widgetBlock5RefEntry.rejections++;
            block5RefFeedback = critiqueMsg;
          }
        }

        if (block5RefParsed) {
          block5Parsed.references = block5RefParsed.references;
        }
      }

      if (block5Parsed) {
        if (isTerminalEvaluation) {
          block5Parsed.references = [];
          if (block5Parsed.finalEvaluation) {
            const cleanText = (str: string): string => {
              if (!str) return '';
              let cleaned = str;
              const entityTagsPattern = '(?:RealPerson|HistoricalPerson|FictionalCharacter|Location|Artwork|EventLink|HistoricalEventLink|EvenementHistorique|ÉvénementHistorique|Glossary|ConceptLink|ConceptLien|TheoremLink|TheoremeLien|ThéorèmeLien|InstitutionLink|InstitutionLien|SpeciesLink|SpeciesLien|EspeceLien|EspèceLien|OrganismeLien|ChemicalLink|ChemicalLien|MoleculesLien|MoleculeLien|ChimieLien|CelestialLink|CelestialLien|CorpsCeleste|CorpsCéleste|AstroLien)';
              const entityRegex = new RegExp('<(' + entityTagsPattern + ')\\b[^>]*?>([\\s\\S]*?)<\\/\\1>', 'gi');
              for (let i = 0; i < 3; i++) {
                cleaned = cleaned.replace(entityRegex, '$2');
              }
              cleaned = cleaned.replace(new RegExp('<(' + entityTagsPattern + ')\\b[^>]*?\\/>', 'gi'), '');
              cleaned = cleaned.replace(/\[\[\s*WIDGET\s*:\s*(?:Citation|Reference|Ref)\s*:\s*\d+\s*\]\]/gi, '');
              cleaned = cleaned.replace(/sup\s*>\s*<a\b[^>]*?id="ref-src-\d+"[^>]*?>\s*\d+\s*<\/a>\s*<\/sup>/gi, '');
              cleaned = cleaned.replace(/\[ref[-_]?\s*(\d+)\]/gi, '');
              cleaned = cleaned.replace(/sup\s*>\s*\[?(\d+)\]?\s*<\/sup>/gi, '');
              return cleaned;
            };

            const fe = block5Parsed.finalEvaluation;
            if (fe.props) {
              if (fe.props.prompt) fe.props.prompt = cleanText(fe.props.prompt);
              if (fe.props.subject) fe.props.subject = cleanText(fe.props.subject);
              if (Array.isArray(fe.props.questions)) {
                fe.props.questions = fe.props.questions.map((q: any) => {
                  const newQ = { ...q };
                  if (newQ.q) newQ.q = cleanText(newQ.q);
                  if (newQ.question) newQ.question = cleanText(newQ.question);
                  if (newQ.explanation) newQ.explanation = cleanText(newQ.explanation);
                  if (Array.isArray(newQ.options)) {
                    newQ.options = newQ.options.map((o: any) => {
                      if (typeof o === 'string') return cleanText(o);
                      if (o && typeof o === 'object') {
                        return { ...o, text: cleanText(o.text || '') };
                      }
                      return o;
                    });
                  }
                  return newQ;
                });
              }
            }
            if (Array.isArray(fe.questions)) {
              fe.questions = fe.questions.map((q: any) => {
                const newQ = { ...q };
                if (newQ.q) newQ.q = cleanText(newQ.q);
                if (newQ.question) newQ.question = cleanText(newQ.question);
                if (newQ.explanation) newQ.explanation = cleanText(newQ.explanation);
                if (Array.isArray(newQ.options)) {
                  newQ.options = newQ.options.map((o: any) => {
                    if (typeof o === 'string') return cleanText(o);
                    if (o && typeof o === 'object') {
                      return { ...o, text: cleanText(o.text || '') };
                    }
                    return o;
                  });
                }
                return newQ;
              });
            }
          }
        }
        parsedWidgets.finalEvaluation = block5Parsed.finalEvaluation;
        if (!isTerminalEvaluation && courseReferences && courseReferences.length > 0) {
          parsedWidgets.references = courseReferences;
        } else {
          parsedWidgets.references = block5Parsed.references;
        }
      } else if (!isTerminalEvaluation && courseReferences && courseReferences.length > 0) {
        parsedWidgets.references = courseReferences;
      }

  return parsedWidgets;
}
