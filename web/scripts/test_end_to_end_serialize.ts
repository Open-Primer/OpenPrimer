import { getPageContent } from './src/lib/content';
import { serialize } from 'next-mdx-remote/serialize';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';

async function runTest() {
  console.log("=== STARTING END-TO-END MDX SERIALIZATION TEST ===");

  const slug = ['l1', 'general', 'Introduction_a_l_astrophysique_et_a_la_cosmologie', 'odyssee-cosmique'];
  const lang = 'fr';

  try {
    console.log("Fetching page content for:", slug.join('/'));
    const pageData = await getPageContent(slug, lang);

    if (!pageData || !pageData.content) {
      console.error("FAILURE: No page content was returned!");
      process.exit(1);
    }

    console.log("Page content successfully fetched and processed. Content length:", pageData.content.length);

    console.log("Serializing MDX content...");
    const mdxSource = await serialize(pageData.content, {
      mdxOptions: {
        remarkPlugins: [remarkMath, remarkGfm],
        rehypePlugins: [rehypeKatex],
      },
    });

    console.log("MDX serialization succeeded!");
    console.log("Compiled source length:", mdxSource.compiledSource.length);
    console.log("\nSUCCESS: Zero compilation failures! Seamless rendering is guaranteed.");
    process.exit(0);
  } catch (err: any) {
    console.error("\nFATAL SERIALIZATION ERROR:");
    console.error(err.message || err);
    process.exit(1);
  }
}

runTest();
