import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { getPageContent, getNavigationTree, getFirstAvailableLanguage, NavItem } from '@/lib/content';
import { serialize } from 'next-mdx-remote/serialize';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { CourseClientWrapper } from '@/components/CourseClientWrapper';
import { MdxContent } from '@/components/mdx/MdxContent';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import { CourseCompletionFeedback } from '@/components/CourseCompletionFeedback';
import { STATIC_UI_STRINGS } from '@/lib/translations';
import { ExportLessonButton } from '@/components/ExportLessonButton';
import { ErrorModal } from '@/components/modals/ErrorModal';
import { dbService } from '@/lib/db';

export default async function CoursePage({ params }: { params: { slug: string[] } }) {
  let lang = 'en';
  let autoSwitched = false;
  let slug: string[] = [];
  let pageData: any = null;
  try {
    const resolvedParams = await params;
    slug = (resolvedParams?.slug || []).map(part => decodeURIComponent(part));
    const cookieStore = await cookies();
    lang = (cookieStore.get('openprimer_lang')?.value || 'EN').toLowerCase();

    pageData = await getPageContent(slug, lang);
    if (!pageData) {
      const altLang = await getFirstAvailableLanguage(slug);
      if (altLang) {
        lang = altLang.toLowerCase();
        pageData = await getPageContent(slug, lang);
        autoSwitched = true;
      }
    }

    if (!pageData) return notFound();

    const normalizedLangCode = (lang.toUpperCase().split('-')[0]) as keyof typeof STATIC_UI_STRINGS;
    const t = STATIC_UI_STRINGS[normalizedLangCode] || STATIC_UI_STRINGS.EN;

    // Serialize MDX on the server — safe to pass to client components
    const mdxSource = await serialize(pageData.content, {
      mdxOptions: {
        remarkPlugins: [remarkMath, remarkGfm],
        rehypePlugins: [rehypeKatex],
        format: 'mdx',
      },
    });
    
    const coursePath = slug.slice(0, 3).join('/');
    const rawNav = await getNavigationTree(coursePath, lang);
    const files = rawNav.filter(item => item.type === 'file');
    const folders = rawNav.filter(item => item.type === 'folder');
    
    const navItems = [
      ...(files.length > 0 ? [{ name: t.overview || STATIC_UI_STRINGS.EN.overview, type: 'folder', children: files }] : []),
      ...folders
    ];

    const flatPages: any[] = [];
    navItems.forEach(folder => {
      folder.children?.forEach((p: any) => {
        flatPages.push(p);
      });
    });

    const currentPath = `/${slug.join('/')}`;
    const currentIndex = flatPages.findIndex(p => p.path === currentPath);
    const nextPage = currentIndex !== -1 && currentIndex < flatPages.length - 1 ? flatPages[currentIndex + 1] : null;

    const title = pageData.meta.title || 'Untitled Module';
    const subject = pageData.meta.subject || 'Academic Content';
    const moduleName = pageData.meta.module || t.overview || STATIC_UI_STRINGS.EN.overview;
    const level = pageData.meta.level || 'L1';
    const courseSlug = slug[2];
    const { data: courseData } = await dbService.getSyllabus(courseSlug);
    const courseVersion = courseData?.version || '1.0';

    const getLocalizedCoreModule = (currentLang: string, lvl: string) => {
      const lUpper = currentLang.toUpperCase();
      let moduleLabel = "Core Module";
      if (lUpper === 'FR') moduleLabel = "Module Principal";
      else if (lUpper === 'ES') moduleLabel = "Módulo Principal";
      else if (lUpper === 'DE') moduleLabel = "Kernmodul";
      else if (lUpper === 'ZH') moduleLabel = "核心模块";

      const lvlStr = String(lvl).toUpperCase();
      let lvlVal = lvlStr;
      if (lvlStr === 'L1') {
        if (lUpper === 'EN') lvlVal = '101';
        else if (lUpper === 'ZH') lvlVal = '大一 (101)';
        else if (lUpper === 'ES' || lUpper === 'DE') lvlVal = 'L1 (101)';
      } else if (lvlStr === 'L2') {
        if (lUpper === 'EN') lvlVal = '201';
        else if (lUpper === 'ZH') lvlVal = '大二 (201)';
        else if (lUpper === 'ES' || lUpper === 'DE') lvlVal = 'L2 (201)';
      } else if (lvlStr === 'L3') {
        if (lUpper === 'EN') lvlVal = '301';
        else if (lUpper === 'ZH') lvlVal = '大三 (301)';
        else if (lUpper === 'ES' || lUpper === 'DE') lvlVal = 'L3 (301)';
      } else if (lvlStr === 'M1') {
        if (lUpper === 'EN') lvlVal = '501';
        else if (lUpper === 'ZH') lvlVal = '研一 (501)';
        else if (lUpper === 'ES' || lUpper === 'DE' || lUpper === 'FR') lvlVal = 'M1 (501)';
      } else if (lvlStr === 'M2') {
        if (lUpper === 'EN') lvlVal = '502';
        else if (lUpper === 'ZH') lvlVal = '研二 (502)';
        else if (lUpper === 'ES' || lUpper === 'DE' || lUpper === 'FR') lvlVal = 'M2 (502)';
      } else if (/^\d+$/.test(lvlStr)) {
        const num = parseInt(lvlStr, 10);
        if (lUpper === 'ZH') lvlVal = `${num}年级`;
        else if (lUpper === 'EN') lvlVal = `Grade ${num}`;
        else if (lUpper === 'FR') lvlVal = `Niveau ${num}`;
        else if (lUpper === 'ES') lvlVal = `Grado ${num}`;
        else if (lUpper === 'DE') lvlVal = `Klasse ${num}`;
      }

      return `${moduleLabel} • ${lvlVal}`;
    };

    const getLocalizedSubject = (currentLang: string, sub: string) => {
      const lUpper = currentLang.toUpperCase();
      const subLower = sub.toLowerCase().trim();

      const dict: Record<string, Record<string, string>> = {
        physics: {
          FR: "Physique",
          ES: "Física",
          DE: "Physik",
          ZH: "物理",
          IT: "Fisica"
        },
        "classical mechanics": {
          FR: "Mécanique Classique",
          ES: "Mecánica Clásica",
          DE: "Klassische Mechanik",
          ZH: "经典力学",
          IT: "Meccanica Classica"
        },
        biology: {
          FR: "Biologie",
          ES: "Biología",
          DE: "Biologie",
          ZH: "生物",
          IT: "Biologia"
        },
        chemistry: {
          FR: "Chimie",
          ES: "Química",
          DE: "Chemie",
          ZH: "化学",
          IT: "Chimica"
        },
        law: {
          FR: "Droit",
          ES: "Derecho",
          DE: "Recht",
          ZH: "法律",
          IT: "Diritto"
        },
        mathematics: {
          FR: "Mathématiques",
          ES: "Matemáticas",
          DE: "Mathematik",
          ZH: "数学",
          IT: "Matematica"
        },
        economics: {
          FR: "Économie",
          ES: "Economía",
          DE: "Wirtschaft",
          ZH: "经济学",
          IT: "Economia"
        },
        "computer science": {
          FR: "Informatique",
          ES: "Informática",
          DE: "Informatik",
          ZH: "计算机科学",
          IT: "Informatica"
        },
        cs: {
          FR: "Informatique",
          ES: "Informática",
          DE: "Informatik",
          ZH: "计算机科学",
          IT: "Informatica"
        },
        history: {
          FR: "Histoire",
          ES: "Historia",
          DE: "Geschichte",
          ZH: "历史",
          IT: "Storia"
        }
      };

      if (dict[subLower] && dict[subLower][lUpper]) {
        return dict[subLower][lUpper];
      }
      return sub;
    };

    return (
      <CourseClientWrapper 
        navItems={navItems} 
        pageContext={pageData.content}
        courseLevel={level}
        courseTitle={title}
        courseSubject={subject}
      >
        <div className="max-w-4xl mx-auto py-16 px-12 pb-40">
          {/* Breadcrumbs & Export */}
          <div className="flex items-center justify-between gap-4 mb-12 distraction-free-hide">
            <div className="flex items-center gap-2 text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">
              <Link href="/catalog" className="hover:text-blue-500 transition-colors">{getLocalizedSubject(lang, subject)}</Link>
              <ChevronRight className="w-3 h-3 text-slate-800" />
              <span className="text-slate-500">{moduleName}</span>
              <ChevronRight className="w-3 h-3 text-slate-800" />
              <span className="text-blue-500">{title}</span>
            </div>
            <ExportLessonButton title={title} subject={subject} level={level} content={pageData.content} lang={lang} courseSlug={courseSlug} version={courseVersion} />
          </div>

          <header className="mb-12 text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-black mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-violet-400 to-emerald-400 leading-tight">
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
            <MdxContent source={mdxSource} />
          </article>

          {/* Footer Navigation */}
          {nextPage ? (
            <Link href={nextPage.path} className="mt-16 pt-8 border-t border-slate-900/30 flex justify-between items-center group cursor-pointer distraction-free-hide">
               <div>
                 <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1 group-hover:text-blue-400/80 transition-colors">
                   {lang.toLowerCase() === 'fr' ? 'Chapitre Suivant' : 'Next Chapter'}
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
          {autoSwitched && (
            <script dangerouslySetInnerHTML={{ __html: `
              document.cookie = "openprimer_lang=${lang.toUpperCase()}; path=/; max-age=31536000; SameSite=Lax";
              localStorage.setItem("openprimer_lang", "${lang.toUpperCase()}");
              try {
                const profile = JSON.parse(localStorage.getItem("op_user_profile") || "{}");
                if (profile && Object.keys(profile).length > 0) {
                  profile.preferredLang = "${lang.toLowerCase()}";
                  localStorage.setItem("op_user_profile", JSON.stringify(profile));
                }
              } catch(e){}
            ` }} />
          )}
        </div>
      </CourseClientWrapper>
    );
  } catch (err: any) {
    if (err && (err.message?.includes('NEXT_HTTP_ERROR_FALLBACK') || err.digest?.includes('NEXT_HTTP_ERROR_FALLBACK'))) {
      throw err;
    }
    console.error("CRITICAL ERROR IN CoursePage:", err);
    
    // In background, log the issue to the database
    let pagePath = 'Unknown Page';
    let courseSlug = 'general';
    try {
      pagePath = (slug && slug.length > 0) ? slug.join('/') : 'Unknown Page';
      courseSlug = (slug && slug[2]) || 'general';
      const errorMessage = err?.stack || err?.message || String(err);
      
      await dbService.submitReport(
        courseSlug,
        pagePath,
        `[CRITICAL RENDERING EXCEPTION] ${errorMessage}`
      );
      console.log(`[ERROR AUTO-REPORT] Logged rendering error for page ${pagePath}`);
    } catch (reportErr) {
      console.error("Failed to submit error report:", reportErr);
    }

    // Try to construct navigation data so the user has the sidebar context and can go to the next page
    let navItems: any[] = [];
    let nextPage: any = null;
    let title = 'Error';
    let subject = 'Academic Content';
    let moduleName = 'Overview';
    
    try {
      const coursePath = slug.slice(0, 3).join('/');
      const rawNav = await getNavigationTree(coursePath, lang);
      const normalizedLangCode = (lang.toUpperCase().split('-')[0]) as keyof typeof STATIC_UI_STRINGS;
      const t = STATIC_UI_STRINGS[normalizedLangCode] || STATIC_UI_STRINGS.EN;
      
      const files = rawNav.filter(item => item.type === 'file');
      const folders = rawNav.filter(item => item.type === 'folder');
      
      navItems = [
        ...(files.length > 0 ? [{ name: t.overview || STATIC_UI_STRINGS.EN.overview, type: 'folder', children: files }] : []),
        ...folders
      ];

      const flatPages: any[] = [];
      navItems.forEach(folder => {
        folder.children?.forEach((p: any) => {
          flatPages.push(p);
        });
      });

      const currentPath = `/${slug.join('/')}`;
      const currentIndex = flatPages.findIndex(p => p.path === currentPath);
      nextPage = currentIndex !== -1 && currentIndex < flatPages.length - 1 ? flatPages[currentIndex + 1] : null;

      if (pageData) {
        title = pageData.meta.title || 'Untitled Module';
        subject = pageData.meta.subject || 'Academic Content';
        moduleName = pageData.meta.module || t.overview || STATIC_UI_STRINGS.EN.overview;
      }
    } catch (e) {
      console.warn("Failed to generate sidebar for error view fallback:", e);
    }

    if (navItems.length > 0) {
      return (
        <CourseClientWrapper 
          navItems={navItems} 
          pageContext={pageData?.content || ''}
          courseLevel={pageData?.meta?.level || 'L1'}
          courseTitle={title}
          courseSubject={subject}
        >
          <div className="max-w-4xl mx-auto py-16 px-12 pb-40 relative min-h-[600px]">
            {/* Blurred background layout to give context */}
            <div className="filter blur-md opacity-30 select-none pointer-events-none">
              <div className="flex items-center justify-between gap-4 mb-12">
                <div className="flex items-center gap-2 text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">
                  <span>{subject}</span>
                  <ChevronRight className="w-3 h-3 text-slate-800" />
                  <span>{moduleName}</span>
                  <ChevronRight className="w-3 h-3 text-slate-800" />
                  <span className="text-blue-500">{title}</span>
                </div>
              </div>
              <header className="mb-12">
                <h1 className="text-3xl md:text-5xl font-black mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-violet-400 to-emerald-400 leading-tight">
                  {title}
                </h1>
                <div className="w-16 h-1 bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-500 rounded-full" />
              </header>
              <article className="prose prose-invert prose-slate max-w-none">
                <p>This course content could not be rendered due to a formatting anomaly in the module source. Please proceed using the navigation controls.</p>
              </article>
            </div>

            <ErrorModal 
              lang={lang} 
              subject={subject} 
              title={title} 
              nextPagePath={nextPage ? nextPage.path : null} 
            />
          </div>
        </CourseClientWrapper>
      );
    }

    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Glow ambient background effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-900/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-slate-900/30 rounded-full blur-[100px] pointer-events-none" />

        <ErrorModal 
          lang={lang} 
          subject={subject} 
          title={title} 
          nextPagePath={nextPage ? nextPage.path : null} 
        />
      </div>
    );
  }
}
