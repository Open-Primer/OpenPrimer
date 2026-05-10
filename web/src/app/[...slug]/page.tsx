import React from 'react';
import Link from 'next/link';
import { getPageContent, getNavigationTree } from '@/lib/content';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import { Quiz, Question, Option } from '@/components/mdx/Quiz';
import { Glossary } from '@/components/mdx/Glossary';
import { Video } from '@/components/mdx/Video';
import { FillInBlanks, MetaNote } from '@/components/mdx/Interactive';
import { CourseClientWrapper } from '@/components/CourseClientWrapper';

const components = {
  Quiz,
  Question,
  Option,
  Glossary,
  Video,
  FillInBlanks,
  MetaNote,
};

export default async function CoursePage({ params }: { params: { slug: string[] } }) {
  const { slug } = await params;
  const pageData = await getPageContent(slug);
  if (!pageData) return notFound();
  
  const navItems = getNavigationTree();

  return (
    <CourseClientWrapper navItems={navItems} pageContext={pageData.content}>
      <div className="max-w-4xl mx-auto py-16 px-12 pb-40">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] mb-12">
          <Link href="/catalog" className="hover:text-blue-500 transition-colors">{pageData.meta.subject}</Link>
          <ChevronRight className="w-3 h-3 text-slate-800" />
          <span className="text-slate-500">{pageData.meta.module}</span>
          <ChevronRight className="w-3 h-3 text-slate-800" />
          <span className="text-blue-500">{pageData.meta.title}</span>
        </div>

        <header className="mb-12 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/5 border border-blue-500/10 text-blue-500/80 text-[8px] font-black uppercase tracking-widest mb-4">
            Core Module • {pageData.meta.level}
          </div>
          <h1 className="text-4xl font-black mb-6 tracking-tight text-white leading-tight">
            {pageData.meta.title}
          </h1>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-500 rounded-full mx-auto md:mx-0" />
        </header>

        <article className="prose prose-invert prose-slate prose-lg max-w-none 
          prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-white
          prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-8 prose-h2:border-b prose-h2:border-slate-900 prose-h2:pb-4
          prose-p:text-slate-300 prose-p:leading-[1.9] prose-p:mb-8 prose-p:text-lg
          prose-strong:text-blue-400 prose-strong:font-black
          prose-blockquote:border-l-4 prose-blockquote:border-blue-600 prose-blockquote:bg-blue-600/5 prose-blockquote:py-4 prose-blockquote:px-10 prose-blockquote:rounded-r-[40px] prose-blockquote:not-italic prose-blockquote:text-slate-200
          prose-code:text-emerald-400 prose-code:bg-emerald-400/5 prose-code:px-2 prose-code:py-1 prose-code:rounded-lg prose-code:before:content-none prose-code:after:content-none">
          <MDXRemote source={pageData.content} components={components} />
        </article>

        {/* Footer Navigation */}
        <div className="mt-32 pt-12 border-t border-slate-900 flex justify-between items-center group cursor-pointer">
           <div>
             <p className="text-[9px] font-black text-slate-700 uppercase tracking-widest mb-1">Next Chapter</p>
             <p className="text-lg font-black text-slate-500 group-hover:text-blue-400 transition-colors">Cell Compartmentalization</p>
           </div>
           <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-700 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-500 transition-all">
             <ChevronRight className="w-5 h-5" />
           </div>
        </div>
      </div>
    </CourseClientWrapper>
  );
}
