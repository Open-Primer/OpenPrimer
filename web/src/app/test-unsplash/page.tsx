import React from 'react';
import { serialize } from 'next-mdx-remote/serialize';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import { MdxContent } from '@/components/mdx/MdxContent';
import { CourseClientWrapper } from '@/components/CourseClientWrapper';

export default async function TestUnsplashPage() {
  const rawMdx = `# Les bases de l'astrophysique d'observation

L'étude moderne de l'Univers repose sur la collecte minutieuse des photons émis par les corps célestes. Pour ce faire, les astronomes utilisent des instruments optiques sophistiqués placés dans des observatoires terrestres ou spatiaux.

<CustomFigure 
  src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w5ODcyMjJ8MHwxfHNlYXJjaHwxfHxuZWJ1bGF8ZW58MHx8fHwxNjg3OTAwMDAw&ixlib=rb-4.0.3&q=80&w=1080" 
  alt="Une nébuleuse colorée dans l'espace lointain" 
  caption="Une vue spectaculaire d'une nébuleuse cosmique, révélant des nuages interstellaires de gaz et de poussière — Source : Photo by Alexander Andrews on Unsplash" 
/>
`;

  const mdxSource = await serialize(rawMdx, {
    mdxOptions: {
      remarkPlugins: [remarkMath, remarkGfm],
      rehypePlugins: [rehypeKatex],
      format: 'mdx',
    },
  });

  const navItems = [
    {
      name: "Module 1 : Introduction",
      type: "folder",
      children: [
        { name: "1. Bases de l'astrophysique", path: "/test-unsplash", type: "file" }
      ]
    }
  ];

  return (
    <CourseClientWrapper 
      navItems={navItems} 
      pageContext={rawMdx}
      courseLevel="Licence 1"
      courseTitle="Astronomie et Astrophysique"
      courseSubject="Sciences de l'Univers"
    >
      <div className="max-w-4xl mx-auto py-16 px-12 pb-40">
        <header className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-2.5 py-1 rounded-md text-[10px] font-black tracking-wider bg-slate-900 border border-slate-800 text-slate-400 uppercase">
              L1 (101)
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-violet-400 to-emerald-400 leading-tight">
            Les bases de l'astrophysique d'observation
          </h1>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-500 rounded-full" />
        </header>

        <article className="prose prose-invert prose-slate max-w-none 
          prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-foreground
          prose-h2:text-2xl prose-h2:mt-16 prose-h2:mb-8 prose-h2:border-b prose-h2:border-slate-900/10 prose-h2:pb-4
          prose-p:text-foreground prose-p:leading-[1.8] prose-p:mb-8 prose-p:text-base
          prose-strong:text-blue-500 prose-strong:font-black">
          <MdxContent 
            source={mdxSource} 
            rawMdx={rawMdx} 
            courseSlug="astronomie" 
            lessonSlug="bases-astrophysique" 
          />
        </article>
      </div>
    </CourseClientWrapper>
  );
}
