import { getPageContent, getNavigationTree } from '@/lib/content';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import { Quiz, Question, Option } from '@/components/mdx/Quiz';
import { Sidebar } from '@/components/Sidebar';

const components = {
  Quiz,
  Question,
  Option,
};

export default async function CoursePage({ params }: { params: { slug: string[] } }) {
  const { slug } = await params;
  const page = await getPageContent(slug);

  if (!page) {
    notFound();
  }

  const navItems = getNavigationTree();

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar items={navItems} />
      <main className="flex-1 max-h-screen overflow-y-auto scroll-smooth">
        <div className="max-w-4xl mx-auto py-16 px-8">
          <header className="mb-12">
            <div className="flex items-center gap-2 text-blue-500 text-sm font-semibold uppercase tracking-wider mb-4">
              <span>{page.meta.subject}</span>
              <span className="text-slate-700">•</span>
              <span>{page.meta.level}</span>
            </div>
            <h1 className="text-5xl font-black mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              {page.meta.title}
            </h1>
            <p className="text-slate-500 italic">Module: {page.meta.module}</p>
          </header>

          <article className="prose prose-invert prose-slate prose-xl max-w-none 
            prose-headings:font-bold prose-headings:tracking-tight
            prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
            prose-blockquote:border-l-blue-500 prose-blockquote:bg-slate-900/50 prose-blockquote:py-1 prose-blockquote:px-6 prose-blockquote:rounded-r-xl
            prose-strong:text-slate-100 prose-code:text-blue-300 prose-code:bg-blue-500/10 prose-code:px-1 prose-code:rounded">
            <MDXRemote source={page.content} components={components} />
          </article>
        </div>
      </main>
    </div>
  );
}

export async function generateStaticParams() {
  const tree = getNavigationTree();
  const paths: { slug: string[] }[] = [];

  function flatten(items: any[]) {
    for (const item of items) {
      if (item.type === 'file') {
        paths.push({ slug: item.path.split(path.sep) });
      } else if (item.children) {
        flatten(item.children);
      }
    }
  }

  // flatten(tree); // This requires import 'path' which is already in content.ts
  // For now, let's keep it simple for the MVP
  return [];
}
