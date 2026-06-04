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
import { dbService } from '@/lib/db';

export default async function CoursePage({ params }: { params: { slug: string[] } }) {
  let lang = 'en';
  let autoSwitched = false;
  let slug: string[] = [];
  let pageData: any = null;
  try {
    const resolvedParams = await params;
    slug = resolvedParams?.slug || [];
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
      <CourseClientWrapper navItems={navItems} pageContext={pageData.content}>
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
            <ExportLessonButton title={title} subject={subject} level={level} content={pageData.content} lang={lang} />
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

          {/* Course Footer Metadata */}
          <div className="mt-20 pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 distraction-free-hide">
            <div className="flex items-center gap-6">
            </div>
          </div>

          {/* Footer Navigation */}
          {nextPage ? (
            <Link href={nextPage.path} className="mt-32 pt-12 border-t border-slate-900 flex justify-between items-center group cursor-pointer">
               <div>
                 <p className="text-lg font-black text-slate-500 group-hover:text-blue-400 transition-colors">
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

    const errorDetails = {
      fr: {
        title: "Lecture temporairement indisponible",
        desc: "Un problème technique est survenu lors de l'accès à ce cours. L'incident a été signalé automatiquement à nos équipes pour correction rapide.",
        button: "Parcourir le catalogue",
        nextLesson: "Aller à la page suivante",
        reportSent: "L'erreur a été transmise à l'administration."
      },
      en: {
        title: "Reading temporarily unavailable",
        desc: "A technical issue occurred while accessing this lesson. The incident has been automatically reported to our teams for a quick resolution.",
        button: "Browse the catalog",
        nextLesson: "Go to the next page",
        reportSent: "The error has been reported to the administration."
      },
      es: {
        title: "Lectura temporalmente no disponible",
        desc: "Se produjo un problema técnico al acceder a esta lección. El incidente ha sido reportado automáticamente a nuestros équipes para una rápida resolución.",
        button: "Explorar el catálogo",
        nextLesson: "Ir a la página siguiente",
        reportSent: "El error ha sido transmitido a la administración."
      },
      de: {
        title: "Lesen vorübergehend nicht verfügbar",
        desc: "Beim Zugriff auf diese Lektion ist ein technisches Problem aufgetreten. Der Vorfall wurde automatisch an unsere Teams gemeldet, um eine schnelle Lösung zu finden.",
        button: "Katalog durchsuchen",
        nextLesson: "Zur nächsten Seite gehen",
        reportSent: "Der Fehler wurde an die Administration gemeldet."
      },
      zh: {
        title: "阅读服务暂时不可用",
        desc: "访问此课程时发生技术问题。该事件已自动报告给我们的团队，以便快速解决。",
        button: "浏览课程目录",
        nextLesson: "前往下一页",
        reportSent: "错误已报告给管理部门。"
      }
    };
    
    const activeLangCode = lang.toLowerCase().split('-')[0];
    const activeErrorStrings = errorDetails[activeLangCode as keyof typeof errorDetails] || errorDetails.en;

    if (navItems.length > 0) {
      return (
        <CourseClientWrapper navItems={navItems} pageContext={pageData?.content || ''}>
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

            {/* Premium Glassmorphic Dialog Overlay */}
            <div className="absolute inset-0 flex items-center justify-center p-6 z-30">
              <div className="w-full max-w-xl bg-slate-900/40 backdrop-blur-xl border border-white/10 p-10 rounded-[40px] text-center shadow-[0_30px_100px_-20px_rgba(0,0,0,0.8),0_0_60px_-15px_rgba(239,68,68,0.15)] relative overflow-hidden">
                {/* Background glow orb inside dialog */}
                <div className="absolute -top-24 -left-24 w-48 h-48 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

                {/* Animated Warning Icon with dual circle pulse */}
                <div className="mx-auto w-20 h-20 bg-red-950/20 border border-red-500/25 rounded-full flex items-center justify-center mb-8 relative">
                  <div className="absolute inset-0 bg-red-500/5 rounded-full animate-ping duration-1000 scale-110 opacity-70" />
                  <div className="absolute inset-2 bg-red-950/40 border border-red-500/35 rounded-full flex items-center justify-center">
                    <svg 
                      className="w-8 h-8 text-red-500 animate-pulse" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor" 
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                </div>

                <h2 className="text-3xl font-extrabold tracking-tight text-white mb-4 bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  {activeErrorStrings.title}
                </h2>
                
                <p className="text-base text-slate-300 mb-6 leading-relaxed max-w-md mx-auto">
                  {activeErrorStrings.desc}
                </p>

                <p className="text-xs text-emerald-400 font-bold mb-8 flex items-center justify-center gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                  {activeErrorStrings.reportSent}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  {nextPage && (
                    <Link 
                      href={nextPage.path}
                      className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-100 text-slate-950 font-bold rounded-full transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98] text-center"
                    >
                      {activeErrorStrings.nextLesson}
                    </Link>
                  )}
                  
                  <Link 
                    href="/catalog"
                    className={`w-full sm:w-auto px-8 py-4 font-semibold rounded-full transition-all duration-200 active:scale-[0.98] text-center ${
                      nextPage 
                        ? 'bg-slate-950/60 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white' 
                        : 'bg-white hover:bg-slate-100 text-slate-950 font-bold'
                    }`}
                  >
                    {activeErrorStrings.button}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </CourseClientWrapper>
      );
    }

    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Glow ambient background effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-900/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-slate-900/30 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-xl bg-slate-900/60 backdrop-blur-3xl border border-slate-800/80 p-10 rounded-[40px] text-center shadow-[0_30px_100px_-20px_rgba(0,0,0,0.8),0_0_60px_-15px_rgba(239,68,68,0.15)] relative z-10 transition-all duration-300 hover:border-slate-700/80">
          
          {/* Animated Warning Icon with dual circle pulse */}
          <div className="mx-auto w-20 h-20 bg-red-950/30 border border-red-500/20 rounded-full flex items-center justify-center mb-8 relative">
            <div className="absolute inset-0 bg-red-500/5 rounded-full animate-ping duration-1000 scale-110 opacity-70" />
            <div className="absolute inset-2 bg-red-950/50 border border-red-500/30 rounded-full" />
            <svg 
              className="w-8 h-8 text-red-500 relative z-10 animate-pulse" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-white mb-4 bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            {activeErrorStrings.title}
          </h2>
          
          <p className="text-base text-slate-400 mb-10 leading-relaxed max-w-md mx-auto">
            {activeErrorStrings.desc}
          </p>

          <p className="text-xs text-emerald-400 font-bold mb-8 flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
            {activeErrorStrings.reportSent}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/catalog"
              className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-100 text-slate-950 font-bold rounded-full transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98] text-center"
            >
              {activeErrorStrings.button}
            </Link>
            
            <Link 
              href="/"
              className="w-full sm:w-auto px-8 py-4 bg-slate-950/60 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white font-semibold rounded-full transition-all duration-200 active:scale-[0.98] text-center"
            >
              {lang.toLowerCase() === 'fr' ? 'Accueil' : 'Home'}
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
