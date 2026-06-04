const { serialize } = require('next-mdx-remote/serialize');
const remarkMath = require('remark-math');
const rehypeKatex = require('rehype-katex');

const content = `
<DiagnosticQuiz question="Which of the following best describes the fundamental economic problem?" options={["How to maximize profit for businesses.", "How to allocate scarce resources to satisfy unlimited wants.", "How to ensure everyone has equal income.", "How to eliminate all poverty globally."]} correctIndex={1} targetSectionId="section-scarcity-foundation" sectionTitle="The Economic Problem: Scarcity" />
`;

async function test() {
  try {
    const mdxSource = await serialize(content, {
      mdxOptions: {
        remarkPlugins: [remarkMath],
        rehypePlugins: [rehypeKatex],
      },
    });
    console.log("Success!");
    console.log("Compiled CompiledSource snippet:");
    console.log(mdxSource.compiledSource.substring(0, 1000));
  } catch (err) {
    console.error("Error compiling MDX:", err);
  }
}

test();
