import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';
import { isDatabaseConfigured } from '../../../lib/db';
import { isRateLimited } from '../../../lib/rateLimit';

function cleanMarkdown(md: string): string {
  return md
    .replace(/---\n[\s\S]*?\n---/g, '') // remove frontmatter if any
    .replace(/<[^>]*>/g, '') // remove HTML/JSX tags
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // replace links with anchor text
    .replace(/[*#`_>~\-]/g, '') // remove markdown symbols
    .replace(/\{[^}]*\}/g, '') // remove curly braces templates/props
    .replace(/\s+/g, ' ') // collapse whitespaces
    .trim();
}

const normalizeText = (text: string) =>
  text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export async function GET(req: NextRequest) {
  // Rate limit: 30 req/min per IP (full-text content search is expensive)
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
  if (await isRateLimited(ip, 30, 60000, 'search_lessons')) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const { searchParams } = new URL(req.url);
  const courseSlug = searchParams.get('courseSlug');
  const q = searchParams.get('q');
  const lang = (searchParams.get('lang') || 'en').toLowerCase();

  if (!courseSlug || !q || !q.trim()) {
    return NextResponse.json([]);
  }
  if (q.length > 200) {
    return NextResponse.json({ error: 'Query too long' }, { status: 400 });
  }

  const qNorm = normalizeText(q);
  const results: { path: string; name: string; excerpt: string }[] = [];

  try {
    if (isDatabaseConfigured) {
      // Get course level/subject first to build paths
      const { data: course } = await supabase
        .from('courses')
        .select('level, subject')
        .ilike('slug', courseSlug)
        .limit(1)
        .single();

      if (course) {
        const { data: dbLessons } = await supabase
          .from('lessons')
          .select('lesson_slug, title, content')
          .ilike('course_slug', courseSlug)
          .eq('lang', lang);

        if (dbLessons && dbLessons.length > 0) {
          for (const lesson of dbLessons) {
            const title = lesson.title || lesson.lesson_slug.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
            const content = lesson.content || '';
            const cleanedContent = cleanMarkdown(content);

            const titleNorm = normalizeText(title);
            const contentNorm = normalizeText(cleanedContent);

            const titleMatch = titleNorm.includes(qNorm);
            const contentMatch = contentNorm.includes(qNorm);

            if (titleMatch || contentMatch) {
              let excerpt = '';
              if (contentMatch) {
                const matchIdx = contentNorm.indexOf(qNorm);
                const startIdx = Math.max(0, matchIdx - 40);
                const endIdx = Math.min(cleanedContent.length, matchIdx + q.length + 40);
                excerpt = cleanedContent.substring(startIdx, endIdx).replace(/\s+/g, ' ');
                if (startIdx > 0) excerpt = '...' + excerpt;
                if (endIdx < cleanedContent.length) excerpt = excerpt + '...';
              } else {
                excerpt = cleanedContent.substring(0, 80);
                if (cleanedContent.length > 80) excerpt += '...';
              }

              results.push({
                path: `/${course.level}/${course.subject}/${courseSlug}/${lesson.lesson_slug}`,
                name: title,
                excerpt
              });
            }
          }
        }
      }
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error('[API LESSON SEARCH ERROR]', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
