import { dbService } from './db';
import { supabase } from './supabase';

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

export async function generateCourseContent(courseName: string, level: string, targetLang: string = 'en') {
  if (!apiKey) {
    console.warn("GEMINI_API_KEY not configured. Falling back to default preseed.");
    return;
  }

  // 1. Generate syllabus (lesson titles and slugs) using Gemini
  const promptSyllabus = `You are an expert curriculum designer. Generate a structured list of lessons for a course titled "${courseName}" for level "${level}".
Return ONLY a valid JSON array of objects. Each object must have keys: "title" (lesson title) and "slug" (ASCII URL-friendly lesson slug).
Include about 4 to 5 key lessons (e.g. introduction, fundamental_principles, historical_context, advanced_topics, conclusion).
Do not include markdown code block backticks around the JSON.`;

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptSyllabus }] }]
      })
    });
    
    if (!res.ok) throw new Error(await res.text());
    const jsonRes = await res.json();
    const rawJson = jsonRes.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
    const cleanedJson = rawJson.replace(/```json/g, '').replace(/```/g, '').trim();
    const lessonsList: { title: string; slug: string }[] = JSON.parse(cleanedJson);

    // 2. For each lesson, generate rich MDX content using Gemini
    for (const item of lessonsList) {
      const promptContent = `You are a world-class academic professor. Generate the complete, professional, extremely detailed academic MDX lesson content for the lesson "${item.title}" in the course "${courseName}" (${level}).
Requirements:
1. Use professional, premium academic styling.
2. Structure it beautifully using markdown headers, bullet points, and high-impact custom alerts like:
> [!NOTE]
> Detailed academic contextualization.
3. Ensure there is a robust introduction, conceptual framework, historical perspective, and concrete real-world application.
4. Include some math formulas in LaTeX (using $ or $$ wrappers).
5. Write the response in "${targetLang.toUpperCase()}".
6. Return ONLY the raw MDX content. Do not wrap the response in markdown code blocks (\`\`\`).`;

      const contentRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptContent }] }]
        })
      });
      
      if (!contentRes.ok) continue;
      const contentJson = await contentRes.json();
      const rawMdx = contentJson.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      const mdxWithFrontmatter = `---
title: "${item.title}"
subject: "${courseName}"
level: "${level}"
module: "${item.title}"
---

${rawMdx}`;

      // Save to Supabase using dbService.saveLesson
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
  if (!apiKey) {
    console.warn("GEMINI_API_KEY not configured. JIT Translation skipped.");
    return;
  }

  try {
    // 1. Fetch all existing lessons for this course (usually in 'en')
    const { data: sourceLessons } = await supabase
      .from('lessons')
      .select('*')
      .eq('course_slug', courseSlug);

    if (!sourceLessons || sourceLessons.length === 0) {
      console.warn(`No source lessons found in database for course ${courseSlug} to translate.`);
      return;
    }

    // 2. For each lesson, translate using Gemini JIT translate prompt
    for (const lesson of sourceLessons) {
      const promptTranslate = `You are a professional academic translator. Translate the following academic MDX course content to target language code: "${targetLang.toUpperCase()}".
Rules:
1. Preserve all markdown structure, custom blockquotes, headings, lists, and links.
2. Keep all Math equations (wrapped in $ or $$) completely untouched.
3. Do NOT translate technical code blocks or JSX React tags.
4. Translate the title and return ONLY the translated MDX content. Do not include markdown code block wrappers (\`\`\`).

MDX CONTENT TO TRANSLATE:
${lesson.content}`;

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptTranslate }] }]
        })
      });

      if (!res.ok) continue;
      const resJson = await res.json();
      const translatedMdx = resJson.candidates?.[0]?.content?.parts?.[0]?.text || '';

      // Extract translated title from translated MDX frontmatter or title if possible, or translate lesson title
      let transTitle = lesson.title;
      try {
        const promptTitle = `Translate the lesson title "${lesson.title}" to "${targetLang.toUpperCase()}". Return only the translated string.`;
        const resTitle = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
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
      } catch (e) {}

      // Save translated lesson to Supabase using dbService.saveLesson
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
