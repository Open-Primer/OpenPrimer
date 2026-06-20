import { preprocessMdx, isolateJsxForTranslation, restoreJsxAfterTranslation } from './src/lib/content';

function testPreprocessor() {
  console.log("=== STARTING PREPROCESSOR RESILIENCE TEST ===");

  const testCases = [
    {
      name: "1. Curly/smart quote conversion in tags",
      input: `<Quiz title=“Un quiz incroyable” options={["A", "B"]} correctIndex={00} />`
    },
    {
      name: "2. Brace escaping inside code blocks and inline code (should NOT escape)",
      input: `Here is a text paragraph with some { braces } that should be escaped.

\`\`\`javascript
function test() {
  const obj = { key: "value" };
  if (x < y) {
    return obj;
  }
}
\`\`\`

Here is inline code \`const { x, y } = point;\` which also should not be escaped.`
    },
    {
      name: "3. FillInBlanks with blanks={['value']} conversion",
      input: `<FillInBlanks sentence="Un [Input] est..." blanks={["concept"]} />`
    },
    {
      name: "4. FillInBlanks block form to self-closing conversion",
      input: `<FillInBlanks sentence="Un [Input] est une forme." >concept</FillInBlanks>`
    },
    {
      name: "5. Quiz & Question tags nested and single line",
      input: `<Quiz><Question text="Quelle est la capitale?" options={['Paris', "Marseille"]} correctIndex={0} /><Question text="Combien?" options={['1', '2']} correctIndex={1} /></Quiz>`
    },
    {
      name: "6. Prerequisites and Summary arrays mapping",
      input: `<Prerequisites items={["Connaître A", 'Savoir B']} />\n<Summary items={["Un", "Deux"]} />`
    },
    {
      name: "7. Objectives block conversion from raw markdown",
      input: `## 🌟 Objectifs d'apprentissage
- **Savoir (Connaissances)** :
  - Expliquer le principe de relativité.
  - Définir le tenseur métrique.
- **Savoir-faire (Compétences)** :
  - Résoudre des équations différentielles.
- **Posture/Analyse (Attitudes)** :
  - Apprécier la démarche scientifique.`
    },
    {
      name: "8. Custom tag casing normalization",
      input: `<quiz><question q="Test?"><option text="Yes" /><option text="No" /></question></quiz>\n<historicalperson name="Einstein" />`
    },
    {
      name: "9. Pollinations AI URL spaces healing",
      input: `![A cute cat walking](https://image.pollinations.ai/prompt/A%20cute%20cat%20walking%20in%20a%20forest?width=800&height=600&nologo=true)`
    },
    {
      name: "10. Question with child Option tags having text in their bodies",
      input: `<Quiz><Question q="What is life?"><Option correct={true}>A chemical process</Option><Option correct={false}>A dream</Option></Question></Quiz>`
    },
    {
      name: "11. Blockquote contiguity list vs plain list",
      input: `Some normal text.

1.  First item with blockquote.
    > nested blockquote line 1
    > nested blockquote line 2

2.  Second item with blockquote.
    > nested blockquote line 3

Some paragraph break.

1.  First plain item.
2.  Second plain item.

Some other paragraph.
`
    },
    {
      name: "12. Bidirectional footnote citation normalization",
      input: `This is a sentence with a citation<sup><a id="ref-src-1" href="#ref-1">1</a></sup> and another one<sup> <a href="#ref-2" id="ref-src-2">2</a> </sup>.`
    },
    {
      name: "13. Citation and auto-references generation with bidirectional links",
      input: `<Citation author="David Hilbert" source="Radio Address" year="1930" original="Wir müssen wissen. Wir werden wissen.">Nous devons savoir. Nous saurons.</Citation>

And another citation:
<Citation author="Albert Einstein" source="The World as I See It" year="1934" original="Wir müssen wissen.">Le monde comme je le vois.</Citation>

And a duplicate citation to test consolidation:
<Citation author="David Hilbert" source="Radio Address" year="1930" original="Wir müssen wissen. Wir werden wissen.">Nous devons savoir. Nous saurons de nouveau.</Citation>`
    }
  ];

  testCases.forEach((tc) => {
    console.log(`\n--- Test Case: ${tc.name} ---`);
    console.log("INPUT:");
    console.log(tc.input);
    const output = preprocessMdx(tc.input, 'fr');
    console.log("OUTPUT:");
    console.log(output);
  });
}

function testTranslationIsolation() {
  console.log("\n=== STARTING JSX ISOLATION FOR TRANSLATION TEST ===");

  const inputMdx = `
<Prerequisites itemsBase64="WyJDb25uYcOudHJlIEEiXQ==" />

# Title of the lesson

Some introduction text.

<FillInBlanks sentence="An [Input] is red." answer="apple" blanks={["apple"]} />

<Glossary term="AI" definition="Artificial Intelligence" />

<Quiz>
  <Question q="What is the color of the sky?" explanation="Sky is blue because of scattering.">
    <Option text="Blue" correct={true} />
    <Option text="Red" correct={false} />
  </Question>
</Quiz>

<CriticalThinking>
Why is neuroscience important?
</CriticalThinking>
`;

  console.log("ORIGINAL MDX:");
  console.log(inputMdx);

  // 1. Isolate JSX
  const { content: isolated, registry } = isolateJsxForTranslation(inputMdx);
  console.log("\nISOLATED CONTENT (Sent to Translator):");
  console.log(isolated);

  // Simulate LLM translation on the isolated content
  let translatedIsolated = isolated
    .replace("Title of the lesson", "Titre de la leçon")
    .replace("Some introduction text.", "Texte d'introduction.")
    .replace("An [Input] is red.", "Un [Input] est rouge.")
    .replace("apple", "pomme")
    .replace("AI", "IA")
    .replace("Artificial Intelligence", "Intelligence Artificielle")
    .replace("What is the color of the sky?", "Quelle est la couleur du ciel ?")
    .replace("Sky is blue because of scattering.", "Le ciel est bleu à cause de la diffusion.")
    .replace("Blue", "Bleu")
    .replace("Red", "Rouge")
    .replace("Why is neuroscience important?", "Pourquoi les neurosciences sont-elles importantes ?");

  console.log("\nSIMULATED TRANSLATED ISOLATED:");
  console.log(translatedIsolated);

  // 2. Restore JSX
  const restored = restoreJsxAfterTranslation(translatedIsolated, registry);
  console.log("\nRESTORED TRANSLATED MDX:");
  console.log(restored);

  // Assertions to verify correctness
  const hasPrerequisites = restored.includes('<Prerequisites itemsBase64="WyJDb25uYcOudHJlIEEiXQ==" />');
  const hasFillInBlanks = restored.includes('<FillInBlanks sentence="Un [Input] est rouge." answer="pomme" blanks={["apple"]} />');
  const hasGlossary = restored.includes('<Glossary term="IA" definition="Intelligence Artificielle" />');
  const hasQuestion = restored.includes('<Question q="Quelle est la couleur du ciel ?" explanation="Le ciel est bleu à cause de la diffusion.">');
  const hasOption1 = restored.includes('<Option text="Bleu" correct={true} />');
  const hasOption2 = restored.includes('<Option text="Rouge" correct={false} />') || restored.includes('<Option text="Rouge" />');
  const hasCriticalThinking = restored.includes('<CriticalThinking>\nPourquoi les neurosciences sont-elles importantes ?\n</CriticalThinking>');

  console.log("\nVERIFICATION RESULTS:");
  console.log("Prerequisites Intact:", hasPrerequisites);
  console.log("FillInBlanks Intact/Translated:", hasFillInBlanks);
  console.log("Glossary Intact/Translated:", hasGlossary);
  console.log("Question Intact/Translated:", hasQuestion);
  console.log("Option 1 Intact/Translated:", hasOption1);
  console.log("Option 2 Intact/Translated:", hasOption2);
  console.log("CriticalThinking Intact/Translated:", hasCriticalThinking);

  if (hasPrerequisites && hasFillInBlanks && hasGlossary && hasQuestion && hasOption1 && hasOption2 && hasCriticalThinking) {
    console.log("\n🎉 ALL TRANSLATION ISOLATION TESTS PASSED!");
  } else {
    console.error("\n❌ SOME TRANSLATION ISOLATION TESTS FAILED!");
    process.exit(1);
  }
}

testPreprocessor();
testTranslationIsolation();

