import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { getPageContent, getNavigationTree, getFirstAvailableLanguage } from '@/lib/content';
import { serialize } from 'next-mdx-remote/serialize';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { CourseClientWrapper } from '@/components/CourseClientWrapper';
import { MdxContent } from '@/components/mdx/MdxContent';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { CourseCompletionFeedback } from '@/components/CourseCompletionFeedback';

export default async function CoursePage({ params }: { params: { slug: string[] } }) {
  let lang = 'en';
  let autoSwitched = false;
  try {
    const { slug } = await params;
    const cookieStore = await cookies();
    lang = (cookieStore.get('openprimer_lang')?.value || 'EN').toLowerCase();

    let pageData = await getPageContent(slug, lang);
    if (!pageData) {
      const altLang = await getFirstAvailableLanguage(slug);
      if (altLang) {
        lang = altLang.toLowerCase();
        pageData = await getPageContent(slug, lang);
        autoSwitched = true;
      }
    }

    if (!pageData) return notFound();

    // Serialize MDX on the server — safe to pass to client components
    const mdxSource = await serialize(pageData.content, {
      mdxOptions: {
        remarkPlugins: [remarkMath],
        rehypePlugins: [rehypeKatex],
      },
    });
    
    const coursePath = slug.slice(0, 3).join('/');
    const rawNav = getNavigationTree(coursePath, lang);
    const files = rawNav.filter(item => item.type === 'file');
    const folders = rawNav.filter(item => item.type === 'folder');
    
    const navItems = [
      ...(files.length > 0 ? [{ name: 'Overview', type: 'folder', children: files }] : []),
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
    const moduleName = pageData.meta.module || 'Overview';
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

    return (
      <CourseClientWrapper navItems={navItems} pageContext={pageData.content}>
        <div className="max-w-4xl mx-auto py-16 px-12 pb-40">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] mb-12 distraction-free-hide">
            <Link href="/catalog" className="hover:text-blue-500 transition-colors">{subject}</Link>
            <ChevronRight className="w-3 h-3 text-slate-800" />
            <span className="text-slate-500">{moduleName}</span>
            <ChevronRight className="w-3 h-3 text-slate-800" />
            <span className="text-blue-500">{title}</span>
          </div>

          <header className="mb-12 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/5 border border-blue-500/10 text-blue-500/80 text-[8px] font-black uppercase tracking-widest mb-4 distraction-free-hide">
              {getLocalizedCoreModule(lang, level)}
            </div>
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
    const isFr = lang.toLowerCase() === 'fr';
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-8">
        <div className="max-w-2xl bg-red-950/20 border border-red-500/30 p-8 rounded-[32px] text-center backdrop-blur-2xl">
          <h2 className="text-2xl font-black text-red-400 mb-4 uppercase tracking-wider">
            {isFr ? "Erreur de Rendu Académique" : "Academic Rendering Error"}
          </h2>
          <p className="text-sm text-slate-400 mb-6 leading-relaxed">
            {isFr 
              ? "Une erreur s'est produite lors de la compilation ou du rendu MDX de ce module de cours." 
              : "An error occurred during the compilation or MDX rendering of this course module."}
          </p>
          <pre className="text-left text-xs bg-black/60 border border-slate-900 p-6 rounded-2xl overflow-auto text-emerald-400 max-h-[300px] custom-scrollbar">
            {err ? (err.stack || err.message || String(err)) : "Unknown Error"}
          </pre>
        </div>
      </div>
    );
  }
}
