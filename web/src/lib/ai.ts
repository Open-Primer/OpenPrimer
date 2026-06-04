import { dbService } from './db';
import { supabase } from './supabase';
import { callVertexAI, isVertexConfigured } from './vertex-client';

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

export async function generateCourseContent(courseName: string, level: string, targetLang: string = 'en') {
  // 1. Generate syllabus (lesson titles and slugs)
  const promptSyllabus = `You are an expert curriculum designer. Generate a structured list of lessons for a course titled "${courseName}" for level "${level}".
Return ONLY a valid JSON array of objects. Each object must have keys: "title" (lesson title) and "slug" (ASCII URL-friendly lesson slug).
Include about 4 to 5 key lessons (e.g. introduction, fundamental_principles, historical_context, advanced_topics, conclusion).
Do not include markdown code block backticks around the JSON.`;

  try {
    let rawJson = '';
    
    if (isVertexConfigured()) {
      console.log(`[AI GENERATOR] Generating syllabus for "${courseName}" via Vertex AI (gemini-2.5-pro)...`);
      const res = await callVertexAI({
        task: 'course_generation',
        contents: [{ role: 'user', parts: [{ text: promptSyllabus }] }],
        generationConfig: { temperature: 0.2, responseMimeType: "application/json" }
      });

      if (res && res.ok) {
        const jsonRes = await res.json();
        rawJson = jsonRes.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
      }
    } else if (apiKey) {
      console.log(`[AI GENERATOR] Generating syllabus for "${courseName}" via AI Studio fallback (gemini-2.5-flash)...`);
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
      }
    }

    if (!rawJson) {
      console.warn("[AI GENERATOR] AI model failed to generate syllabus. Generating mock syllabus.");
      rawJson = JSON.stringify([
        { title: "Introduction", slug: "introduction" },
        { title: "Fundamental Principles", slug: "fundamental_principles" },
        { title: "Advanced Applications", slug: "advanced_applications" },
        { title: "Conclusion", slug: "conclusion" }
      ]);
    }

    const cleanedJson = rawJson.replace(/```json/g, '').replace(/```/g, '').trim();
    const lessonsList: { title: string; slug: string }[] = JSON.parse(cleanedJson);

    // 2. For each lesson, generate rich MDX content
    for (const item of lessonsList) {
      const promptContent = `You are a world-class academic professor. Generate the complete, professional, extremely detailed academic MDX lesson content for the lesson "${item.title}" in the course "${courseName}" (${level}).
Requirements:
1. Use professional, premium academic styling.
2. Structure it beautifully using markdown headers, bullet points, and high-impact custom alerts like:
> [!NOTE]
> Detailed academic contextualization.
3. Ensure there is a robust introduction, conceptual framework, historical perspective, and concrete real-world application.
4. Include some math formulas in LaTeX (using $ or $$ wrappers).
5. Radical Accessibility: Guarantee that EVERY SINGLE image, diagram, table, code block, or visual/multimedia container systematically includes detailed, descriptive, and meaningful alt tags, aria-labels, and semantic text summaries to ensure total accessibility.
6. Write the response in "${targetLang.toUpperCase()}".
7. Return ONLY the raw MDX content. Do not wrap the response in markdown code blocks (\`\`\`).`;

      let rawMdx = '';

      if (isVertexConfigured()) {
        console.log(`[AI GENERATOR] Generating lesson "${item.title}" via Vertex AI (gemini-2.5-pro)...`);
        const contentRes = await callVertexAI({
          task: 'course_generation',
          contents: [{ role: 'user', parts: [{ text: promptContent }] }],
          generationConfig: { temperature: 0.3 }
        });

        if (contentRes && contentRes.ok) {
          const contentJson = await contentRes.json();
          rawMdx = contentJson.candidates?.[0]?.content?.parts?.[0]?.text || '';
        }
      } else if (apiKey) {
        console.log(`[AI GENERATOR] Generating lesson "${item.title}" via AI Studio fallback (gemini-2.5-flash)...`);
        const contentRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: promptContent }] }]
          })
        });
        if (contentRes.ok) {
          const contentJson = await contentRes.ok ? await contentRes.json() : null;
          rawMdx = contentJson?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        }
      }

      if (!rawMdx) {
        console.warn(`[AI GENERATOR] Failed to generate content for "${item.title}". Using fallback mock content.`);
        rawMdx = `### Overview of ${item.title}\n\nThis is a premium fallback module for the lesson **${item.title}** under course **${courseName}**.\n\n> [!NOTE]\n> Please configure your AI Service account or API key to automatically compile full lessons.`;
      }

      const mdxWithFrontmatter = `---
title: "${item.title}"
subject: "${courseName}"
level: "${level}"
module: "${item.title}"
---

${rawMdx}`;

      // Save to Supabase
      await dbService.saveLesson({
        course_slug: courseName.toLowerCase().replace(/ /g, '_'),
        lesson_slug: item.slug,
        lang: targetLang.toLowerCase(),
        title: item.title,
        content: mdxWithFrontmatter
      });
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
3. Do NOT translate technical code blocks or JSX React tags.
4. Translate the title and return ONLY the translated MDX content. Do not include markdown code block wrappers.

MDX CONTENT TO TRANSLATE:
${lesson.content}`;

      let translatedMdx = '';

      if (isVertexConfigured()) {
        console.log(`[AI GENERATOR] Translating lesson "${lesson.title}" to ${targetLang} via Vertex AI (gemini-2.5-flash)...`);
        const res = await callVertexAI({
          task: 'course_translation',
          contents: [{ role: 'user', parts: [{ text: promptTranslate }] }],
          generationConfig: { temperature: 0.1 }
        });

        if (res && res.ok) {
          const resJson = await res.json();
          translatedMdx = resJson.candidates?.[0]?.content?.parts?.[0]?.text || '';
        }
      } else if (apiKey) {
        console.log(`[AI GENERATOR] Translating lesson "${lesson.title}" to ${targetLang} via AI Studio fallback (gemini-2.5-flash)...`);
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
        
        if (isVertexConfigured()) {
          const resTitle = await callVertexAI({
            task: 'course_translation',
            contents: [{ role: 'user', parts: [{ text: promptTitle }] }],
            generationConfig: { temperature: 0.1 }
          });
          if (resTitle && resTitle.ok) {
            const tJson = await resTitle.json();
            transTitle = (tJson.candidates?.[0]?.content?.parts?.[0]?.text || lesson.title).trim();
          }
        } else if (apiKey) {
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
          }
        }
      } catch (e) {
        console.warn(`[AI GENERATOR] Title translation failed:`, e);
      }

      // Save translated lesson to Supabase
      await dbService.saveLesson({
        course_slug: courseSlug,
        lesson_slug: lesson.lesson_slug,
        lang: targetLang.toLowerCase(),
        title: transTitle,
        content: translatedMdx
      });
    }
  } catch (err) {
    console.error("AI Translation failed:", err);
  }
}
