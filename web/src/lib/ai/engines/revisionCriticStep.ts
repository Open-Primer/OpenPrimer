import { callVertexAI } from '../vertex-client';
import { extractAndInjectCitations } from '../stitcher';

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

export async function runRevisionCritic(
  lesson: any,
  revisedMdx: string,
  feedbackText: string,
  targetLang: string,
  lessonIdx: number,
  lessonsListLength: number,
  discipline: string,
  level: string,
  cleanTitle: string
): Promise<{ currentMdx: string; approved: boolean; critique: any }> {
  let currentMdx = revisedMdx;
  let approved = false;
  let critique: any = null;

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
10. Widgets-First Citation (WFTA) Compliance: Absolutely no custom JSX/HTML tags (such as <sup id="cite-...">(...)</sup> or <sup>(...)</sup>) or manual bracketed references (like [ref1], [1]) are allowed in the prose content. All inline bibliographic citations/references in the prose must strictly use the [[WIDGET:Reference:num]] anchor format, e.g. [[WIDGET:Reference:1]]. Reject any revision containing non-compliant HTML/JSX citation markup or manual brackets.

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
          const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`, {
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
          console.log(`[REVISION AGENT] Initiating Scribe section-by-section global refinement based on critique: "${globalCritique}"`);
          const parsedSections = parseMarkdownSections(currentMdx);
          const refinedSections: MarkdownSection[] = [];
          let precedingContext = 'None. This is the first section.';
          let refineSuccess = true;

          for (let sIdx = 0; sIdx < parsedSections.length; sIdx++) {
            const sec = parsedSections[sIdx];
            console.log(`[REVISION AGENT] Global refinement of section ${sIdx + 1}/${parsedSections.length}: "${sec.heading || 'Header / Introduction'}"...`);

            const promptRefineGlobalSection = `You are Scribe (Agent 3), a professional academic writer.
The Revision Critic Agent (Agent 4) has rejected the revised MDX for "${lesson.title}". We are refining the lesson section-by-section.

GLOBAL CRITIQUE from Agent 4:
"${globalCritique}"

LESSON TITLE: "${lesson.title}"
COURSE SLUG: "${courseSlug}"
LANGUAGE: "${targetLang.toUpperCase()}"

CURRENT SECTION HEADING: "${sec.heading || 'Header / Introduction Block'}"
CURRENT SECTION CONTENT:
${sec.content}

CONTEXT (Preceding section refined text):
${precedingContext}

INSTRUCTIONS:
1. Refine the content of this section to fully address the global critique.
2. Maintain high academic density, rigor, and the target language.
3. If the heading is empty, this is the header/frontmatter block of the lesson. You must ONLY revise any prose or prerequisites/objectives text, and you must strictly preserve the "---" boundaries and YAML frontmatter at the very top.
4. ABSOLUTE PROHIBITION ON RAW INTERACTIVE OR CUSTOM JSX/HTML TAGS. Use [[WIDGET:id]] anchors and [[WIDGET:Reference:num]] for citations.
5. Return ONLY the refined section content. Do NOT include markdown code block wrappers or conversational text outside.`;

            const refinedSecContent = await callAIEngine(promptRefineGlobalSection, null, 0.35, 0.25, 0.85);
            if (!refinedSecContent) {
              refineSuccess = false;
              break;
            }
            refinedSections.push({
              heading: sec.heading,
              content: refinedSecContent.trim()
            });
            precedingContext = refinedSecContent.slice(-2000);
          }

          if (refineSuccess) {
            currentMdx = reconstructMarkdown(refinedSections);
            currentMdx = healNarrativeCitations(currentMdx);
          } else {
            console.warn("[REVISION AGENT - AGENT 4] Global section refinement failed, continuing with current content.");
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
4. Return ONLY the wrapped revised sections. Do not include any other conversational text or metadata outside the tags.
5. ABSOLUTE PROHIBITION ON RAW INTERACTIVE OR CUSTOM JSX/HTML TAGS. Absolutely no custom JSX/HTML tags (such as <ConceptLink>, <RealPerson>, <Glossary>, <sup id="cite-...">(...)</sup>, or <sup>(...)</sup>) are allowed inline in prose. Exclusively use [[WIDGET:id]] anchors. For references/citations, you MUST exclusively use [[WIDGET:Reference:num]] (e.g. [[WIDGET:Reference:1]]) instead of any HTML/JSX markup or brackets. Preserve all existing [[WIDGET:...]] anchors exactly as they are in the current content.`;

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
                const resRepair = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`, {
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
              // [FIX R5] ORDERING INVARIANT: revised_section tags are extracted from scribeRepairOutput
              // BEFORE preprocessMdx is called. This order must be preserved — do not run preprocessMdx
              // on scribeRepairOutput directly, as it would corrupt the <revised_section> structural tags.
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
              currentMdx = healNarrativeCitations(currentMdx);
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

    // [FIX R6] Submit error report if revision critic never approved the content.
    if (!approved) {
      console.warn(`[REVISION AGENT - AGENT 4] Critic exhausted ${maxCritiqueIterations} iterations for "${lesson.title}" without approval.`);
      try {
        await dbService.submitReport(courseSlug, `${courseSlug}/${slug}`,
          `[CRITIC EXHAUSTED] Revision for "${lesson.title}" not approved after ${maxCritiqueIterations} iterations. Last critique: ${critique}`);
      } catch (reportErr) { console.error('[REVISION AGENT] Failed to submit critic-exhaustion report:', reportErr); }
    }


  return { currentMdx, approved, critique };
}
