import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { supabase } from '../../../lib/supabase';
import { isDatabaseConfigured } from '../../../lib/db';
import { isRateLimited } from '../../../lib/rateLimit';

const CONTENT_PATH = fs.existsSync(path.join(process.cwd(), 'content'))
  ? path.join(process.cwd(), 'content')
  : path.join(process.cwd(), '../content');

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

function findCourseDir(base: string, targetSlug: string): string | null {
  if (!fs.existsSync(base)) return null;
  const items = fs.readdirSync(base, { withFileTypes: true });
  for (const item of items) {
    if (item.isDirectory()) {
      if (item.name.toLowerCase() === targetSlug.toLowerCase() || item.name.toLowerCase().startsWith(targetSlug.toLowerCase() + '_')) {
        return path.join(base, item.name);
      }
      const found = findCourseDir(path.join(base, item.name), targetSlug);
      if (found) return found;
    }
  }
  return null;
}

function getLessonFiles(dir: string, lang: string): { filePath: string; lessonSlug: string }[] {
  const results: { filePath: string; lessonSlug: string }[] = [];
  if (!fs.existsSync(dir)) return results;
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    if (item.isDirectory()) {
      results.push(...getLessonFiles(path.join(dir, item.name), lang));
    } else if (item.name.toLowerCase().endsWith(`.${lang.toLowerCase()}.mdx`)) {
      const lessonSlug = item.name.replace(/\.(en|fr|es|de|zh)\.mdx$/i, '');
      results.push({ filePath: path.join(dir, item.name), lessonSlug });
    }
  }
  return results;
}

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
    // 1. Try Database Mode first
    if (isDatabaseConfigured) {
      // Get course level/subject first to build paths
      const { data: course } = await supabase
        .from('courses')
        .select('level, subject')
        .eq('slug', courseSlug)
        .limit(1)
        .single();

      if (course) {
        const { data: dbLessons } = await supabase
          .from('lessons')
          .select('lesson_slug, title, content')
          .eq('course_slug', courseSlug)
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
          return NextResponse.json(results);
        }
      }
    }

    // 2. Fallback to Filesystem (offline/mock mode)
    let courseDir = null;
    const level = searchParams.get('level');
    const subject = searchParams.get('subject');

    if (level && subject) {
      const candidatePath = path.join(CONTENT_PATH, level, subject, courseSlug);
      if (fs.existsSync(candidatePath)) {
        courseDir = candidatePath;
      }
    }

    if (!courseDir) {
      courseDir = findCourseDir(CONTENT_PATH, courseSlug);
    }

    if (courseDir) {
      const files = getLessonFiles(courseDir, lang);
      for (const file of files) {
        const fileContent = fs.readFileSync(file.filePath, 'utf-8');
        const { data: meta, content } = matter(fileContent);

        const title = meta.title || file.lessonSlug.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
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

          const relative = path.relative(CONTENT_PATH, file.filePath).split(path.sep).join('/');
          const relativeClean = relative.replace(/\.(en|fr|es|de|zh)\.mdx$/i, '');

          results.push({
            path: '/' + relativeClean,
            name: title,
            excerpt
          });
        }
      }
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error('[API LESSON SEARCH ERROR]', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
