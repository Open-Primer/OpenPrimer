const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// 1. Load environment variables from .env.local
function parseEnv() {
  const envPath = path.join(__dirname, '../.env.local');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach(line => {
      const match = line.match(/^\s*([^#=\s]+)\s*=\s*(.*)$/);
      if (match) {
        const key = match[1].trim();
        let val = match[2].trim();
        if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
        if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
        process.env[key] = val;
      }
    });
  }
}
parseEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("🚨 Error: Supabase URL and Key must be defined in .env.local");
  process.exit(1);
}
if (!apiKey) {
  console.error("🚨 Error: GEMINI_API_KEY must be defined in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const GLOBAL_LANGUAGES = ['EN', 'FR', 'ES', 'DE', 'ZH', 'PT', 'AR', 'HI', 'UR'];

function cleanPathSegment(str) {
  if (!str) return 'general';
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9_-]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
}

async function translateText(sourceText, sourceLang, targetLang, courseTitle, level) {
  const prompt = `You are a distinguished university professor and master academic translator.
Translate the following university-grade lesson from ${sourceLang.toUpperCase()} into ${targetLang.toUpperCase()}.

COURSE: "${courseTitle}" (Level: ${level})

CRITICAL ACADEMIC TRANSLATION RULES:
1. UNIVERSAL RIGOR: Maintain university/PhD-level vocabulary, rigorous mathematical formalisms, and accurate scientific terminology.
2. PRESERVE LATEX: Keep all mathematical and physical equations intact in LaTeX syntax (e.g. \\( ... \\), $$ ... $$). Do NOT alter formulas.
3. PRESERVE JSX & HTML: Preserve all custom React component tags, props, and HTML tags untouched.
4. PRESERVE MARKDOWN: Maintain the exact Markdown heading hierarchy (#, ##, ###), bold/italic, bullet points, and tables.
5. PURE TRANSLATION ONLY: Output ONLY the translated markdown. Do NOT add conversational preambles or wrap the entire output in outer code block.

SOURCE CONTENT:
${sourceText}`;

  const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-3.7-flash:generateContent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.1 }
    })
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`AI Studio API Error (${res.status}): ${errText.substring(0, 200)}`);
  }

  const data = await res.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  return rawText.replace(/^```[a-z]*\r?\n/i, '').replace(/\r?\n```$/i, '').trim();
}

async function runBatchTranslation() {
  console.log("🌐 === OPENPRIMER BATCH TRANSLATION ENGINE (9 LANGUAGES) ===");
  console.log("Using model: Gemini 3.7 Flash via Google AI Studio");

  // 1. Fetch completed courses
  const { data: courses, error: coursesErr } = await supabase
    .from('courses')
    .select('id, title, level, subject, slug, source_lang')
    .order('created_at', { ascending: false });

  if (coursesErr || !courses || courses.length === 0) {
    console.log("No courses found in database.");
    return;
  }

  console.log(`Found ${courses.length} courses in database.`);

  for (const course of courses) {
    const sourceLang = (course.source_lang || 'FR').toUpperCase();
    const targetLangs = GLOBAL_LANGUAGES.filter(l => l !== sourceLang);

    // Fetch lessons for this course
    const { data: lessons, error: lessonsErr } = await supabase
      .from('lessons')
      .select('*')
      .eq('course_id', course.id);

    if (lessonsErr || !lessons || lessons.length === 0) continue;

    const sourceLessons = lessons.filter(l => (l.lang || 'fr').toUpperCase() === sourceLang && l.content && l.content.length > 200);
    if (sourceLessons.length === 0) continue;

    console.log(`\n📚 Processing course: "${course.title}" (${course.level}) [${sourceLessons.length} base lessons in ${sourceLang}]`);

    for (const targetLang of targetLangs) {
      const targetLangLower = targetLang.toLowerCase();
      console.log(`  ➔ Checking language variant: [${targetLang}]...`);

      for (const lesson of sourceLessons) {
        // Check if already translated
        const alreadyExists = lessons.some(l => l.lesson_slug === lesson.lesson_slug && l.lang?.toLowerCase() === targetLangLower && l.content && l.content.length > 200);
        if (alreadyExists) {
          continue;
        }

        try {
          console.log(`    Translating lesson "${lesson.title}" to ${targetLang}...`);
          const startTime = Date.now();
          const translatedContent = await translateText(
            lesson.content,
            sourceLang,
            targetLang,
            course.title,
            course.level
          );
          const duration = ((Date.now() - startTime) / 1000).toFixed(1);

          // Save in Supabase
          await supabase
            .from('lessons')
            .upsert({
              course_id: course.id,
              lesson_slug: lesson.lesson_slug,
              lang: targetLangLower,
              title: lesson.title,
              module: lesson.module,
              order_index: lesson.order_index,
              status: 'completed',
              content: translatedContent,
              updated_at: new Date().toISOString()
            }, { onConflict: 'course_id,lesson_slug,lang' });

          // Write offline MDX
          const contentDir = path.join(
            __dirname,
            '../content',
            cleanPathSegment(course.level || 'L1'),
            cleanPathSegment(course.subject || 'General'),
            cleanPathSegment(course.slug || course.title)
          );
          fs.mkdirSync(contentDir, { recursive: true });
          const mdxPath = path.join(contentDir, `${cleanPathSegment(lesson.lesson_slug)}.${targetLangLower}.mdx`);
          fs.writeFileSync(mdxPath, translatedContent, 'utf-8');

          console.log(`    ✓ Saved (${duration}s): ${lesson.lesson_slug}.${targetLangLower}.mdx`);

        } catch (err) {
          console.error(`    ✗ Translation error for ${lesson.lesson_slug} (${targetLang}):`, err.message);
        }
      }
    }
  }

  console.log("\n✨ Batch translation processing cycle finished.");
}

runBatchTranslation().catch(console.error);
