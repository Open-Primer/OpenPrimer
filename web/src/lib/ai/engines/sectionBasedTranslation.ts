import { isVertexConfigured, callVertexAI } from '../vertex-client';
import { isolateJsxForTranslation, restoreJsxAfterTranslation } from '../content';
import { cleanPathSegment } from '../../translations';

export async function cascadeCurriculumTranslation(
  course: any,
  allCourses: any[],
  targetLang: string,
  translateFn: (slug: string, lang: string) => Promise<any>
) {
  const childIds = course.childCourses || [];
  for (const childId of childIds) {
    const childCourse = allCourses?.find(c => c.id === childId);
    if (childCourse && childCourse.slug) {
      try {
        console.log(`[TRANSLATOR] Translating curriculum child course: "${childCourse.slug}" to "${targetLang}"...`);
        await translateFn(childCourse.slug, targetLang);
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
        await translateFn(optCourse.slug, targetLang);
      } catch (optErr) {
        console.error(`[TRANSLATOR ERROR] Failed to translate curriculum optional course "${optCourse.slug}":`, optErr);
      }
    }
  }
}

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

// [FIX R5] ORDERING INVARIANT: revised_section tags are extracted from scribeRepairOutput
// BEFORE preprocessMdx is called. This order must be preserved — do not run preprocessMdx
// on scribeRepairOutput directly, as it would corrupt the <revised_section> structural tags.
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

// WFTA schemas and dynamic schema generators extracted to ./ai/schemas


async function performSectionBasedTranslation(
  lesson: { title: string; content: string; lesson_slug: string },
  targetLang: string,
  apiKey: string | undefined | null,
  stats?: any
): Promise<{ translatedMdx: string; transSuccess: boolean; transTitle: string; registry: Record<string, any> }> {
  let frontmatter: Record<string, any> = {};
  let hasFrontmatter = false;
  let remainingContent = lesson.content;

  const frontmatterMatch = lesson.content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (frontmatterMatch) {
    hasFrontmatter = true;
    const rawYaml = frontmatterMatch[1];
    remainingContent = lesson.content.substring(frontmatterMatch[0].length);
    rawYaml.split(/\r?\n/).forEach(line => {
      const parts = line.split(':');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        let val = parts.slice(1).join(':').trim();
        if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
        else if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
        frontmatter[key] = val;
      }
    });
  }

  const { content: isolatedContent, registry } = isolateJsxForTranslation(remainingContent);

  // 1. Translate Title first to use as context
  let transTitle = frontmatter.title || lesson.title;
  let transModule = frontmatter.module || '';

  try {
    const promptTitle = `Translate the lesson title "${transTitle}" to "${targetLang.toUpperCase()}". The translated title MUST NOT exceed 130 characters to avoid UI layout truncation. Return only the translated string.`;
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
          transTitle = (tJson.candidates?.[0]?.content?.parts?.[0]?.text || transTitle).trim();
          transTitleSuccess = true;
          if (stats) {
            const usage = tJson.usageMetadata || {};
            stats.tokenMetrics.promptTokens += usage.promptTokenCount || 0;
            stats.tokenMetrics.candidatesTokens += usage.candidatesTokenCount || usage.candidateTokenCount || 0;
          }
        }
      } catch (err) {
        console.warn("[AI GENERATOR] Vertex title translation call failed:", err);
      }
    }
    
    if (!transTitleSuccess && apiKey) {
      const startTime = Date.now();
      try {
        const compressedTitle = compressPromptText(promptTitle);
        const resTitle = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: compressedTitle }] }]
          })
        });
        if (resTitle.ok) {
          const tJson = await resTitle.json();
          transTitle = (tJson.candidates?.[0]?.content?.parts?.[0]?.text || transTitle).trim();
          transTitleSuccess = true;
          const durationMs = Date.now() - startTime;
          const usage = tJson.usageMetadata || {};
          const promptTokens = usage.promptTokenCount || 0;
          const candidatesTokens = usage.candidatesTokenCount || usage.candidateTokenCount || 0;
          if (stats) {
            stats.tokenMetrics.promptTokens += promptTokens;
            stats.tokenMetrics.candidatesTokens += candidatesTokens;
          }
          await recordMetrics('course_translation', 'gemini-3.5-flash-lite', durationMs, promptTokens, candidatesTokens, compressedTitle);
        }
      } catch (err) {
        console.error(`[AI GENERATOR] AI Studio title translation fetch exception:`, err);
      }
    }
  } catch (e) {
    console.warn(`[AI GENERATOR] Title translation failed:`, e);
  }

  if (transTitle.length > 130) {
    transTitle = transTitle.substring(0, 130).trim();
  }

  // 1b. Translate Module name if present
  if (transModule) {
    try {
      const promptModule = `Translate the course module name "${transModule}" to "${targetLang.toUpperCase()}". Return only the translated string.`;
      let transModuleSuccess = false;
      if (isVertexConfigured()) {
        try {
          const resModule = await callVertexAI({
            task: 'course_translation',
            contents: [{ role: 'user', parts: [{ text: promptModule }] }],
            generationConfig: { temperature: 0.1 }
          });
          if (resModule && resModule.ok) {
            const mJson = await resModule.json();
            transModule = (mJson.candidates?.[0]?.content?.parts?.[0]?.text || transModule).trim();
            transModuleSuccess = true;
            if (stats) {
              const usage = mJson.usageMetadata || {};
              stats.tokenMetrics.promptTokens += usage.promptTokenCount || 0;
              stats.tokenMetrics.candidatesTokens += usage.candidatesTokenCount || usage.candidateTokenCount || 0;
            }
          }
        } catch (err) {
          console.warn("[AI GENERATOR] Vertex module translation call failed:", err);
        }
      }
      
      if (!transModuleSuccess && apiKey) {
        const startTime = Date.now();
        try {
          const compressedModule = compressPromptText(promptModule);
          const resModule = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: compressedModule }] }]
            })
          });
          if (resModule.ok) {
            const mJson = await resModule.json();
            transModule = (mJson.candidates?.[0]?.content?.parts?.[0]?.text || transModule).trim();
            transModuleSuccess = true;
            const durationMs = Date.now() - startTime;
            const usage = mJson.usageMetadata || {};
            const promptTokens = usage.promptTokenCount || 0;
            const candidatesTokens = usage.candidatesTokenCount || usage.candidateTokenCount || 0;
            if (stats) {
              stats.tokenMetrics.promptTokens += promptTokens;
              stats.tokenMetrics.candidatesTokens += candidatesTokens;
            }
            await recordMetrics('course_translation', 'gemini-3.5-flash-lite', durationMs, promptTokens, candidatesTokens, compressedModule);
          }
        } catch (err) {
          console.error(`[AI GENERATOR] AI Studio module translation fetch exception:`, err);
        }
      }
    } catch (e) {
      console.warn(`[AI GENERATOR] Module translation failed:`, e);
    }
  }

  // 2. Split isolated content into sections
  const parsedSections = parseMarkdownSections(isolatedContent);
  if (stats) {
    stats.sectionsTotal = parsedSections.length;
  }
  // [FIX T1] Concurrency cap prevents 429 errors on large lessons.
  const MAX_PARALLEL_SECTIONS = Number(process.env.MAX_PARALLEL_SECTIONS ?? 3);
  const translatedSections = await mapConcurrent(parsedSections, MAX_PARALLEL_SECTIONS, async (sec: any) => {
    let translatedContent = sec.content;
    const sectionToTranslate = sec.heading ? `${sec.heading}\n${sec.content}` : sec.content;
    
    if (sectionToTranslate.trim()) {
      const promptTranslateSec = `You are a professional academic translator. Translate the following section of an academic MDX course lesson to target language code: "${targetLang.toUpperCase()}".
Lesson Title: "${transTitle}"

Rules:
1. Preserve all markdown structure, custom blockquotes, headings (including the main ## heading at the start, if present), lists, and links.
2. Keep all Math equations (wrapped in $ or $$) completely untouched.
3. Do NOT translate technical code blocks. You will see placeholder tokens like __JSX_SELF_...__, __JSX_CLOSE_...__, __JSX_OPEN_...__, __JSX_ATTR_...__, __JSX_END_...__, and source attribution placeholders like __SRC_ATTR_PLACEHOLDER_...__. These placeholders protect the custom interactive components and figure source attributions from corruption. Do NOT translate or modify these placeholders or the '|||' separators. Preserve them EXACTLY as they are.
4. Return ONLY the translated MDX content for this section. Do not include markdown code block wrappers (like \`\`\`md or \`\`\`mdx) or conversational intro/outro text.
5. CRITICAL ACADEMIC INTEGRITY & CITATION RULES:
   - Do NOT translate any bibliographic references, book/article/publication titles, author names, publishers, publication cities, or citation texts. These must remain exactly in their original language.
   - Do NOT translate the "Source:" prefix or any associated bibliographic links/attributions in figures, captions, or text.
   - In quote blocks (lines starting with '>'), do NOT translate the author name or the publication details following the '—' dash.
   - Translate the quote content into the target course language, followed by its original version in brackets (e.g., \`[Original: "Original quote..."]\`) IF the target course language is different from the quote's original language.
6. CRITICAL MDX COMPILER COMPLIANCE RULES:
   - Absolutely NO orphaned JSX tags or unclosed tags.
   - Never nest a custom component inside itself.
   - Do NOT generate empty components without text or children.
7. ZERO-COMMENTARY MANDATE: Do not add any conversational introduction or notes. Return ONLY the translated MDX section content.

MDX SECTION CONTENT TO TRANSLATE:
${sectionToTranslate}`;

      let secSuccess = false;
      if (isVertexConfigured()) {
        try {
          const resSec = await callVertexAI({
            task: 'course_translation',
            contents: [{ role: 'user', parts: [{ text: promptTranslateSec }] }],
            generationConfig: { temperature: 0.1 }
          });
          if (resSec && resSec.ok) {
            const resJson = await resSec.json();
            translatedContent = resJson.candidates?.[0]?.content?.parts?.[0]?.text || sectionToTranslate;
            secSuccess = true;
            if (stats) {
              const usage = resJson.usageMetadata || {};
              stats.tokenMetrics.promptTokens += usage.promptTokenCount || 0;
              stats.tokenMetrics.candidatesTokens += usage.candidatesTokenCount || usage.candidateTokenCount || 0;
            }
          }
        } catch (err) {
          console.warn(`[AI GENERATOR] Vertex translation call failed for section:`, err);
        }
      }
      
      if (!secSuccess && apiKey) {
        const startTime = Date.now();
        try {
          const compressedPrompt = compressPromptText(promptTranslateSec);
          const resSec = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: compressedPrompt }] }]
            })
          });
          if (resSec.ok) {
            const resJson = await resSec.json();
            translatedContent = resJson.candidates?.[0]?.content?.parts?.[0]?.text || sectionToTranslate;
            secSuccess = true;
            const durationMs = Date.now() - startTime;
            const usage = resJson.usageMetadata || {};
            const promptTokens = usage.promptTokenCount || 0;
            const candidatesTokens = usage.candidatesTokenCount || usage.candidateTokenCount || 0;
            if (stats) {
              stats.tokenMetrics.promptTokens += promptTokens;
              stats.tokenMetrics.candidatesTokens += candidatesTokens;
            }
            await recordMetrics('course_translation', 'gemini-3.5-flash-lite', durationMs, promptTokens, candidatesTokens, compressedPrompt);
          }
        } catch (err) {
          console.error(`[AI GENERATOR] AI Studio translation section fetch exception:`, err);
        }
      }

      // [FIX T2] Mark section as explicitly untranslated rather than silently returning source content.
      if (!secSuccess && sectionToTranslate.trim()) {
        console.error(`[TRANSLATION] Both Vertex and Studio failed for section "${sec.heading || 'Preamble'}" in "${lesson.title}". Marking as TRANSLATION_FAILED.`);
        translatedContent = `<!-- TRANSLATION_FAILED: ${(sec.heading || 'Preamble').replace(/-->/g, '->')} -->\n${sectionToTranslate}`;
        if (stats) {
          stats.sectionTranslationFailures++;
        }
      }
    }

    return {
      heading: '',
      content: translatedContent
    };
  });

  // Reconstruct and restore JSX
  const reconstructedIsolatedMdx = reconstructMarkdown(translatedSections);
  let translatedMdx = restoreJsxAfterTranslation(reconstructedIsolatedMdx, registry, targetLang);
  
  if (hasFrontmatter) {
    const cleanTitle = cleanImproperQuotes(transTitle);
    const cleanSubject = frontmatter.subject ? cleanImproperQuotes(frontmatter.subject) : '';
    const cleanLevel = frontmatter.level ? cleanImproperQuotes(frontmatter.level) : '';
    const cleanModule = transModule ? cleanImproperQuotes(transModule) : '';

    let reconstructedFrontmatter = `---\n`;
    reconstructedFrontmatter += `title: "${cleanTitle.replace(/"/g, '\\"')}"\n`;
    if (cleanSubject) {
      reconstructedFrontmatter += `subject: "${cleanSubject.replace(/"/g, '\\"')}"\n`;
    }
    if (cleanLevel) {
      reconstructedFrontmatter += `level: "${cleanLevel.replace(/"/g, '\\"')}"\n`;
    }
    if (cleanModule) {
      reconstructedFrontmatter += `module: "${cleanModule.replace(/"/g, '\\"')}"\n`;
    }
    if (frontmatter.order !== undefined) {
      reconstructedFrontmatter += `order: ${frontmatter.order}\n`;
    }
    reconstructedFrontmatter += `---\n\n`;
    translatedMdx = reconstructedFrontmatter + translatedMdx;
  }

  // [FIX T6] Return registry so the critic-refine loop reuses the same JSX placeholder keys.
  return {
    translatedMdx,
    transSuccess: !!translatedMdx,
    transTitle,
    registry
  };
}
