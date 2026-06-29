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
    },
    {
      name: "14. GoingFurtherItem with rich properties and types (books, movies, websites)",
      input: `<GoingFurther title={"Pour aller plus loin..."}>
  <GoingFurtherItem title={"The Structure of Scientific Revolutions"} type={'book'} author="Thomas S. Kuhn" year={1962} publisher="University of Chicago Press" wikipedia="https://en.wikipedia.org/wiki/The_Structure_of_Scientific_Revolutions" description="A landmark work on scientific paradigm shifts." />
  <GoingFurtherItem title="Copenhagen" type=movie director={"Howard Davies"} year="2002" imdb="https://www.imdb.com/title/tt0340057/" description="A film adaptation of the 1941 Bohr-Heisenberg meeting." />
  <GoingFurtherItem title="CERN Website" type="website" url="https://home.cern/" description="The official portal of the European Organization for Nuclear Research." />
</GoingFurther>`
    },
    {
      name: "16. Glossary and References section separation",
      input: `### Glossaire

- **Langage** : Faculté humaine universelle et innée de communiquer.
- **Langue** : Système de signes.

### Références

[1] Dubois, J. (2002). Dictionnaire de linguistique.
[2] Chomsky, N. (1957). Syntactic Structures.`
    },
    {
      name: "18. Empty attributes and stripped JSX comment healing",
      input: `<Question q="Quelle est la nature du langage ?" explanation={/* comment to be stripped */}>
  <Option text="Option 1" correct={}></Option>
  <Option text="Option 2" correct={   }></Option>
  <Option text="Option 3" correct={false}></Option>
</Question>`
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

function testSourceShielding() {
  console.log("\n=== STARTING SOURCE SHIELDING FOR TRANSLATION TEST ===");

  const inputMdx = `
<CustomFigure src="market.jpg" caption="Figure 1: Market scene in Latin America. Source: Wikimedia Commons" />

Some narrative text here.
*Figure 2: Map of Al-Andalus at its peak. Source: [Al-Andalus](https://en.wikipedia.org/wiki/Al-Andalus)*

Another figure with a full-width colon:
<CustomFigure src="saussure.jpg" caption="Figure 3: de Saussure. Source：Wikipedia" />
`;

  console.log("ORIGINAL MDX:");
  console.log(inputMdx.trim());

  // 1. Isolate JSX and Sources
  const { content: isolated, registry } = isolateJsxForTranslation(inputMdx);
  console.log("\nISOLATED CONTENT (Sent to Translator):");
  console.log(isolated.trim());

  // Assert that "Source:" attributions are shielded
  const hasSourcePlaceholder = isolated.includes('__SRC_ATTR_PLACEHOLDER_');
  const hasRawSource = isolated.includes('Source:') || isolated.includes('Source :') || isolated.includes('Source：');

  console.log("Has Source Placeholder:", hasSourcePlaceholder);
  console.log("Has Raw Source (should be false):", hasRawSource);

  // Simulate LLM translation
  let translatedIsolated = isolated
    .replace("Market scene in Latin America.", "Scène de marché en Amérique latine.")
    .replace("Map of Al-Andalus at its peak.", "Carte d'Al-Andalus à son apogée.")
    .replace("Some narrative text here.", "Texte narratif ici.")
    .replace("Another figure with a full-width colon:", "Une autre figure avec deux points de largeur totale :");

  console.log("\nSIMULATED TRANSLATED ISOLATED:");
  console.log(translatedIsolated.trim());

  // 2. Restore JSX and Sources
  const restored = restoreJsxAfterTranslation(translatedIsolated, registry);
  console.log("\nRESTORED TRANSLATED MDX:");
  console.log(restored.trim());

  // Verify that original sources are restored exactly
  const hasCustomFigure1Restored = restored.includes('caption="Figure 1: Scène de marché en Amérique latine. Source: Wikimedia Commons"');
  const hasMarkdownFigure2Restored = restored.includes("*Figure 2: Carte d'Al-Andalus à son apogée. Source: [Al-Andalus](https://en.wikipedia.org/wiki/Al-Andalus)*");
  const hasCustomFigure3Restored = restored.includes('caption="Figure 3: de Saussure. Source：Wikipedia"');

  console.log("\nVERIFICATION RESULTS:");
  console.log("CustomFigure 1 Restored Exactly:", hasCustomFigure1Restored);
  console.log("Markdown Figure 2 Restored Exactly:", hasMarkdownFigure2Restored);
  console.log("CustomFigure 3 Restored Exactly:", hasCustomFigure3Restored);

  if (hasSourcePlaceholder && !hasRawSource && hasCustomFigure1Restored && hasMarkdownFigure2Restored && hasCustomFigure3Restored) {
    console.log("\n🎉 ALL SOURCE SHIELDING TESTS PASSED!");
  } else {
    console.error("\n❌ SOME SOURCE SHIELDING TESTS FAILED!");
    process.exit(1);
  }
}

function testReferencesBlockAndGoingFurther() {
  console.log("\n=== STARTING REFERENCES BLOCK AND GOING FURTHER TEST ===");

  const inputMdx = `
Some text about paradigm shifts.

<GoingFurther>
  <GoingFurtherItem title="The Structure of Scientific Revolutions" type="book" description="A landmark work on scientific paradigm shifts." />
</GoingFurther>


### References

[1] Thomas S. Kuhn. 1962. *The Structure of Scientific Revolutions*. University of Chicago Press.
`;

  console.log("ORIGINAL MDX:");
  console.log(inputMdx.trim());

  // 1. Isolate JSX and References Block
  const { content: isolated, registry } = isolateJsxForTranslation(inputMdx);
  console.log("\nISOLATED CONTENT (Sent to Translator):");
  console.log(isolated.trim());

  // Check that references block is isolated
  const hasRefsPlaceholder = isolated.includes('__REFERENCES_BLOCK_PLACEHOLDER__');
  const hasRawRefs = isolated.includes('Thomas S. Kuhn');

  console.log("Has References Placeholder:", hasRefsPlaceholder);
  console.log("Has Raw References (should be false):", hasRawRefs);

  // Check that GoingFurtherItem has generic attribute placeholder (for translation)
  const hasGoingFurtherPlaceholder = isolated.includes('__JSX_ATTR_GENERIC_GoingFurtherItem_');
  console.log("Has GoingFurtherItem Translation Placeholder:", hasGoingFurtherPlaceholder);

  // Simulate LLM translation
  let translatedIsolated = isolated
    .replace("Some text about paradigm shifts.", "Quelques textes sur les changements de paradigme.")
    .replace("The Structure of Scientific Revolutions", "La structure des révolutions scientifiques")
    .replace("A landmark work on scientific paradigm shifts.", "Un ouvrage de référence sur les changements de paradigme scientifique.");

  console.log("\nSIMULATED TRANSLATED ISOLATED:");
  console.log(translatedIsolated.trim());

  // 2. Restore JSX and References Block
  const restored = restoreJsxAfterTranslation(translatedIsolated, registry, 'fr');
  console.log("\nRESTORED TRANSLATED MDX:");
  console.log(restored.trim());

  // Verify that the references block is restored exactly (but header localized)
  const hasRestoredRefs = restored.includes('[1] Thomas S. Kuhn. 1962. *The Structure of Scientific Revolutions*. University of Chicago Press.');
  const hasLocalizedHeader = restored.includes('### Références');
  const hasTranslatedGoingFurther = restored.includes('title="La structure des révolutions scientifiques"') && restored.includes('description="Un ouvrage de référence sur les changements de paradigme scientifique."');

  console.log("\nVERIFICATION RESULTS:");
  console.log("References Restored Exactly:", hasRestoredRefs);
  console.log("Header Localized to French:", hasLocalizedHeader);
  console.log("GoingFurtherItem Attributes Translated:", hasTranslatedGoingFurther);

  if (hasRefsPlaceholder && !hasRawRefs && hasGoingFurtherPlaceholder && hasRestoredRefs && hasLocalizedHeader && hasTranslatedGoingFurther) {
    console.log("\n🎉 ALL REFERENCES AND GOING FURTHER TESTS PASSED!");
  } else {
    console.error("\n❌ SOME REFERENCES OR GOING FURTHER TESTS FAILED!");
    process.exit(1);
  }
}

testPreprocessor();
testTranslationIsolation();
testSourceShielding();
testReferencesBlockAndGoingFurther();
