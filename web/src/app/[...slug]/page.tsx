import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { getPageContent, getNavigationTree, rehypeMdxSanitizer } from '@/lib/content';
import { serialize } from 'next-mdx-remote/serialize';
import { notFound, redirect, unstable_rethrow } from 'next/navigation';
import { cookies } from 'next/headers';
import { CourseClientWrapper } from '@/components/CourseClientWrapper';
import { MdxContent } from '@/components/mdx/MdxContent';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import { CourseCompletionFeedback } from '@/components/CourseCompletionFeedback';
import { STATIC_UI_STRINGS, cleanPathSegment, formatCourseLevel, getCoursePath, getCanonicalLevelFromSlug, getCanonicalSubjectFromSlug } from '@/lib/translations';
import { ExportLessonButton } from '@/components/ExportLessonButton';
import { dbService } from '@/lib/db';
import { supabase } from '@/lib/supabase';
import {
  resolveModuleName,
  getLocalizedSubject,
  renderCourseErrorFallback
} from './_components/SlugRouteHelpers';

export const dynamic = 'force-dynamic';

export default async function CoursePage({ params }: { params: { slug: string[] } }) {
  let lang = 'en';
  let userId: string | undefined = undefined;
  let slug: string[] = [];
  let pageData: any = null;
  let resolvedSandboxAllowed = false;
  try {
    const resolvedParams = await params;
    slug = (resolvedParams?.slug || []).map(part => cleanPathSegment(decodeURIComponent(part)));
    const cookieStore = await cookies();
    lang = (cookieStore.get('openprimer_lang')?.value || 'EN').toLowerCase();
    userId = cookieStore.get('op_user_id')?.value;

    // Proactively switch language if the requested language has no lessons in the DB for this course
    if (slug.length >= 3) {
      const courseSlug = slug[2];

      // Strict Barrier: Check if the course actually exists, is active, and check archiving level authorization
      const { data: courseData } = await dbService.getSyllabus(courseSlug);
      console.log(`[CoursePage Guard] getSyllabus returned courseData:`, courseData ? { id: courseData.id, slug: courseData.slug, archivingLevel: courseData.archivingLevel, is_active: courseData.is_active, isActive: courseData.isActive } : null);
      if (!courseData) {
        console.log(`[CoursePage] Blocked direct access because course '${courseSlug}' does not exist.`);
        return notFound();
      }

      let isAdmin = false;
      if (userId) {
        const { data: profile } = await dbService.getUserProfile(userId);
        if (profile?.role === 'admin') {
          isAdmin = true;
        }
      }

      const archivingLevel = typeof courseData.archivingLevel === 'number'
        ? courseData.archivingLevel
        : (courseData.archiving_level || 0);

      const isActive = courseData.is_active !== false && courseData.isActive !== false;
      
      console.log(`[CoursePage Guard] evaluates values:`, { userId, isAdmin, archivingLevel, isActive });

      // 1. Inactive check (if not active and not archived, only admin can bypass)
      if (!isActive && archivingLevel === 0 && !isAdmin) {
        console.log(`[CoursePage] Blocked direct access to course '${courseSlug}' because it is inactive and user is not admin.`);
        return notFound();
      }

      // 2. Archiving Level 2 check (only admin can bypass)
      if (archivingLevel >= 2 && !isAdmin) {
        console.log(`[CoursePage] Blocked direct access to course '${courseSlug}' because it is Level 2 archived and user is not admin.`);
        return notFound();
      }

      // 3. Archiving Level 1 check (only old/enrolled users and admins can access)
      if (archivingLevel === 1 && !isAdmin) {
        let isEnrolled = false;

        const enrolledCookie = cookieStore.get('op_enrolled_courses')?.value;
        console.log(`[CoursePage Guard] enrolledCookie raw value:`, enrolledCookie);
        if (enrolledCookie) {
          try {
            const enrolledList = JSON.parse(enrolledCookie);
            console.log(`[CoursePage Guard] enrolledList parsed:`, enrolledList, `courseData.id:`, courseData.id);
            if (Array.isArray(enrolledList) && enrolledList.includes(courseData.id)) {
              isEnrolled = true;
            }
          } catch (e) {}
        }

        if (!isEnrolled && userId) {
          const { data: progressData } = await dbService.getUserProgress(userId, lang);
          console.log(`[CoursePage Guard] dbService.getUserProgress returned progressData:`, progressData);
          if (progressData) {
            isEnrolled = progressData.enrolled?.includes(courseData.id) || 
                         progressData.activeModules?.some((m: any) => m.id === courseData.id);
          }
        }

        console.log(`[CoursePage Guard] isEnrolled resolved to:`, isEnrolled);

        if (!isEnrolled) {
          console.log(`[CoursePage] Blocked direct access to Level 1 archived course '${courseSlug}' because user is not enrolled/old and not admin.`);
          return notFound();
        }
      }

      try {
        const cookieStore = await cookies();
        if (cookieStore.get('op_mock_archiving_levels')?.value || cookieStore.get('op_allow_sandbox')?.value === 'true') {
          resolvedSandboxAllowed = true;
        }
      } catch (e) {}

      if (!courseData?.isCurriculum && !resolvedSandboxAllowed) {
        try {
          const { count } = await supabase
            .from('lessons')
            .select('*', { count: 'exact', head: true })
            .ilike('course_slug', courseSlug)
            .eq('lang', lang.toLowerCase());
          
          if (!count || count === 0) {
            const { data: otherLangs } = await supabase
              .from('lessons')
              .select('lang')
              .ilike('course_slug', courseSlug)
              .limit(1);
            
            if (otherLangs && otherLangs.length > 0) {
              const firstAvailableLang = otherLangs[0].lang;
              console.log(`[CoursePage Guard] Language '${lang}' has no lessons for course '${courseSlug}'. Server-fallback to: '${firstAvailableLang}'`);
              lang = firstAvailableLang.toLowerCase();
            } else {
              const redirectTarget = userId ? '/profile/curriculum' : '/catalog';
              console.log(`[CoursePage] No lessons found in any language for course '${courseSlug}'. Redirecting to: ${redirectTarget}`);
              redirect(redirectTarget);
            }
          }
        } catch (err) {
          if (err && (err as any).digest && (err as any).digest.startsWith('NEXT_REDIRECT')) {
            throw err;
          }
          console.error("[CoursePage] Error checking available languages:", err);
        }
      }
    }

    let redirectUrl = '';
    if (slug.length === 3 || (slug.length === 4 && slug[3] === 'introduction')) {
      const courseSlug = slug[2];
      try {
        const { data: courseData } = await dbService.getSyllabus(courseSlug);
        if (courseData?.isCurriculum && courseData.childCourses && courseData.childCourses.length > 0) {
          const { data: allCourses } = await dbService.getAllCourses();
          const firstChildId = courseData.childCourses[0];
          const firstChild = allCourses?.find(c => c.id === firstChildId);
          if (firstChild) {
            let resolvedSlug = 'introduction';
            try {
              const { data: firstLessonSlug } = await dbService.getFirstLessonSlug(firstChild.slug, lang);
              if (firstLessonSlug) {
                resolvedSlug = firstLessonSlug;
              }
            } catch (err) {
              console.error("Error fetching first lesson slug for curriculum child:", err);
            }
            redirectUrl = getCoursePath(firstChild.level, firstChild.subject, firstChild.slug, resolvedSlug, lang);
          }
        }

        if (!redirectUrl) {
          let firstLessonSlug = 'introduction';
          try {
            const { data: resolvedSlug } = await dbService.getFirstLessonSlug(courseSlug, lang);
            if (resolvedSlug) {
              firstLessonSlug = resolvedSlug;
            }
          } catch (err) {
            console.error("Error fetching first lesson slug:", err);
          }

          if (firstLessonSlug !== 'introduction') {
            const canonicalLevel = getCanonicalLevelFromSlug(slug[0], lang);
            const canonicalSubject = getCanonicalSubjectFromSlug(slug[1], lang);
            redirectUrl = getCoursePath(canonicalLevel, canonicalSubject, slug[2], firstLessonSlug, lang);
          } else if (!resolvedSandboxAllowed) {
            const { data: introLesson } = await supabase
              .from('lessons')
              .select('lesson_slug')
              .ilike('course_slug', courseSlug)
              .eq('lesson_slug', 'introduction')
              .eq('lang', lang.toLowerCase())
              .maybeSingle();

            if (!introLesson) {
              const { data: firstLesson } = await supabase
                .from('lessons')
                .select('lesson_slug')
                .ilike('course_slug', courseSlug)
                .eq('lang', lang.toLowerCase())
                .order('order', { ascending: true })
                .limit(1)
                .maybeSingle();

              if (firstLesson) {
                const canonicalLevel = getCanonicalLevelFromSlug(slug[0], lang);
                const canonicalSubject = getCanonicalSubjectFromSlug(slug[1], lang);
                redirectUrl = getCoursePath(canonicalLevel, canonicalSubject, slug[2], firstLesson.lesson_slug, lang);
              }
            }
          }
        }
      } catch (err) {
        console.error("[CoursePage Routing] Error executing fallback redirection:", err);
      }
    }

    if (redirectUrl) {
      console.log(`[CoursePage Routing] 'introduction' slug is missing. Redirecting to first available lesson: ${redirectUrl}`);
      redirect(redirectUrl);
    }

    pageData = await getPageContent(slug, lang);
    if (!pageData) {
      const redirectTarget = userId ? '/profile/curriculum' : '/catalog';
      console.log(`[CoursePage] No page content found for language '${lang}'. Redirecting to: ${redirectTarget}`);
      redirect(redirectTarget);
    }

    if (!pageData) return notFound();

    const normalizedLangCode = (lang.toUpperCase().split('-')[0]) as keyof typeof STATIC_UI_STRINGS;
    const t = STATIC_UI_STRINGS[normalizedLangCode] || STATIC_UI_STRINGS.EN;

    const mdxSource = await serialize(pageData.content, {
      mdxOptions: {
        remarkPlugins: [remarkMath, remarkGfm],
        rehypePlugins: [rehypeKatex, rehypeMdxSanitizer(lang)],
        format: 'mdx',
      },
    });
    
    const coursePath = slug.slice(0, 3).join('/');
    const rawNav = await getNavigationTree(coursePath, lang);
    const navItems = rawNav;

    const flatPages: any[] = [];
    navItems.forEach(item => {
      if (item.type === 'file') {
        flatPages.push(item);
      } else {
        item.children?.forEach((p: any) => {
          flatPages.push(p);
        });
      }
    });

    const currentPath = `/${slug.join('/')}`;
    const currentIndex = flatPages.findIndex(p => p.path === currentPath);
    const nextPage = currentIndex !== -1 && currentIndex < flatPages.length - 1 ? flatPages[currentIndex + 1] : null;

    const title = pageData.meta.title || 'Untitled Module';
    const subject = pageData.meta.subject || 'Academic Content';
    const moduleName = resolveModuleName(pageData.meta.module, lang, t);
    const level = pageData.meta.level || 'L1';
    const courseSlug = slug[2];
    const { data: courseData } = await dbService.getSyllabus(courseSlug);
    const courseVersion = courseData?.version || '1.0';

    return (
      <CourseClientWrapper 
        navItems={navItems} 
        pageContext={pageData.content}
        courseLevel={formatCourseLevel(level, lang)}
        courseTitle={title}
        courseSubject={subject}
        courseLang={lang}
      >
        <div className="max-w-4xl mx-auto py-16 px-12 pb-40">
          {/* Breadcrumbs & Export */}
          <div className="flex items-center justify-between gap-4 mb-12 distraction-free-hide">
            <div className="flex items-center gap-2 text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">
              <Link href="/catalog" className="hover:text-blue-500 transition-colors">{getLocalizedSubject(lang, subject)}</Link>
              <ChevronRight className="w-3 h-3 text-slate-800" />
              <span className="text-slate-500">{moduleName}</span>
            </div>
            <ExportLessonButton title={title} subject={subject} level={level} content={pageData.content} lang={lang} courseSlug={courseSlug} version={courseVersion} />
          </div>

          <header className="mb-12 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-4 distraction-free-hide">
              <span className="px-2.5 py-1 rounded-md text-[10px] font-black tracking-wider bg-slate-900 border border-slate-800 text-slate-400 uppercase">
                {formatCourseLevel(level, lang)}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-violet-400 to-emerald-400 leading-tight">
              {title}
            </h1>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-500 rounded-full mx-auto md:mx-0 distraction-free-hide" />
          </header>

          <article className="prose prose-invert prose-slate max-w-none 
            prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-foreground
            prose-h2:text-2xl prose-h2:mt-16 prose-h2:mb-8 prose-h2:border-b prose-h2:border-slate-900/10 prose-h2:pb-4
            prose-p:text-foreground prose-p:leading-[1.8] prose-p:mb-8 prose-p:text-base
            prose-strong:text-blue-500 prose-strong:font-black
            prose-blockquote:border-l-4 prose-blockquote:border-blue-600 prose-blockquote:bg-blue-600/5 prose-blockquote:py-4 prose-blockquote:px-10 prose-blockquote:rounded-r-[40px] prose-blockquote:not-italic prose-blockquote:text-foreground
            prose-code:text-emerald-400 prose-code:bg-emerald-400/5 prose-code:px-2 prose-code:py-1 prose-code:rounded-lg prose-code:before:content-none prose-code:after:content-none">
            <MdxContent 
              source={mdxSource} 
              rawMdx={pageData.content} 
              courseSlug={slug[2] || 'general'} 
              lessonSlug={slug.slice(3).join('/') || 'introduction'} 
            />
          </article>

          {/* Footer Navigation */}
          {nextPage ? (
            <Link href={nextPage.path} className="mt-16 pt-8 border-t border-slate-900/30 flex justify-between items-center group cursor-pointer distraction-free-hide">
               <div>
                 <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1 group-hover:text-blue-400/80 transition-colors">
                   {t.next_chapter || 'Next Chapter'}
                 </span>
                 <p className="text-lg font-black text-slate-300 group-hover:text-blue-400 transition-colors">
                   {nextPage.name}
                 </p>
               </div>
               <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-700 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-500 transition-all">
                 <ChevronRight className="w-5 h-5" />
               </div>
            </Link>
          ) : (
            <CourseCompletionFeedback
              courseId={slug[2] || 'Classical_Mechanics'}
              courseTitle={title}
              lang={lang}
            />
          )}
        </div>
      </CourseClientWrapper>
    );
  } catch (err: any) {
    if (
      err.digest === 'NEXT_NOT_FOUND' ||
      err.message === 'NEXT_NOT_FOUND' ||
      (err.digest && err.digest.startsWith('NEXT_REDIRECT')) ||
      (err.message && err.message.startsWith('NEXT_REDIRECT'))
    ) {
      throw err;
    }
    unstable_rethrow(err);
    console.error("CRITICAL ERROR IN CoursePage:", err);
    return renderCourseErrorFallback(err, slug, lang, pageData);
  }
}
