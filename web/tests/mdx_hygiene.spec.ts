import { test, expect } from '@playwright/test';
import { preprocessMdx } from '../src/lib/content';
import { stitchLessonContent, areComponentsDuplicate } from '../src/lib/ai';
import { resolveAndPersistMedia } from '../src/lib/media-resolver';

test.describe('MDX Structural Hygiene & HistoricalPerson Deduplication', () => {
  test('should strip HistoricalPerson from alert titles and deduplicate in body text', () => {
    const rawMdx = `
<Alert type="NOTE">
**Mini-Biographie : <HistoricalPerson name="Phineas_Gage" lang="fr" bio="Ouvrier...">Phineas Gage (1823 - 1860)</HistoricalPerson>**
</Alert>
 <HistoricalPerson name="Phineas_Gage" lang="fr" bio="Ouvrier...">Phineas Gage</HistoricalPerson> était un contremaître des chemins de fer...
    `.trim();

    const processed = preprocessMdx(rawMdx, 'fr');

    // Verify title tag is stripped
    expect(processed).toContain('**Mini-Biographie : Phineas Gage (1823 - 1860)**');
    expect(processed).not.toContain('**Mini-Biographie : <HistoricalPerson');

    // Verify first body mention remains a HistoricalPerson tag
    expect(processed).toContain('<HistoricalPerson name="Phineas_Gage"');
    
    // Verify there are no duplicate HistoricalPerson tags nested or adjacent
    const matches = processed.match(/<HistoricalPerson/g) || [];
    expect(matches.length).toBe(1);
  });

  test('should strip HistoricalPerson from headings', () => {
    const rawMdx = `
### <HistoricalPerson name="Isaac_Newton" lang="fr" bio="...">Isaac Newton</HistoricalPerson> et la gravitation
    `.trim();

    const processed = preprocessMdx(rawMdx, 'fr');
    expect(processed).toContain('### Isaac Newton et la gravitation');
    expect(processed).not.toContain('<HistoricalPerson');
  });

  test('should normalize FaitHistorique to HistoricalEvent', () => {
    const rawMdx = `
<FaitHistorique title="Fondation du laboratoire" date="1879">
  Le premier laboratoire de psychologie expérimentale...
</FaitHistorique>
    `.trim();

    const processed = preprocessMdx(rawMdx, 'fr');
    expect(processed).toContain('<HistoricalEvent title="Fondation du laboratoire" date="1879">');
    expect(processed).toContain('</HistoricalEvent>');
    expect(processed).not.toContain('<FaitHistorique');
  });

  test('should inject isFinal={true} to Quiz and EssayEvaluation when isSummative is true', () => {
    const rawMdx = `
<Quiz durationLimit={300}>
  <Question options="A|||B" correctIndex="0">Question 1</Question>
</Quiz>
<EssayEvaluation prompt="Structured essay" />
    `.trim();

    const processed = preprocessMdx(rawMdx, 'fr', true);
    expect(processed).toContain('<Quiz isFinal={true} durationLimit={300}>');
    expect(processed).toContain('<EssayEvaluation isFinal={true} prompt="Structured essay" />');
  });

  test('should parse references correctly and extract Google Books search URL query format as First Author Name + Book Title + Year', () => {
    const rawMdx = `
This is text.

### References

[1] Carlson, N. R., & Heth, C. D. (2010). *Physiological Psychology* (10e éd.). Pearson Education. [Google Books](https://books.google.com/books?q=Carlson)
    `.trim();

    const processed = preprocessMdx(rawMdx, 'fr');
    expect(processed).toContain('<References itemsBase64="');

    const base64Match = processed.match(/itemsBase64="([^"]+)"/);
    expect(base64Match).not.toBeNull();
    const decoded = Buffer.from(base64Match![1], 'base64').toString('utf8');
    const items = JSON.parse(decoded);

    expect(items.length).toBe(1);
    expect(items[0].text).toContain('Carlson, N. R., &amp; Heth, C. D. (2010). « Physiological Psychology » (10e éd.). Pearson Education.');
    // Check that "Google Books" placeholder text was removed from the reference text to avoid duplicates
    expect(items[0].text).not.toContain('Google Books');
    expect(items[0].scholarUrl).toContain('books.google.com/books?q=Carlson%20%22Physiological%20Psychology%22%202010');
  });

  test('should correctly handle and extract Markdown links containing nested parentheses', () => {
    const rawMdx = `
This is text.

### References

[1] Author. *Title*. [Google Books](https://books.google.com/books?id=Author_Title_(2010)_(10th))
    `.trim();

    const processed = preprocessMdx(rawMdx, 'fr');
    const base64Match = processed.match(/itemsBase64="([^"]+)"/);
    expect(base64Match).not.toBeNull();
    const decoded = Buffer.from(base64Match![1], 'base64').toString('utf8');
    const items = JSON.parse(decoded);

    expect(items.length).toBe(1);
    expect(items[0].scholarUrl).toBe('https://books.google.com/books?id=Author_Title_(2010)_(10th)');
  });

  test('should identify duplicate references, deduplicate them in references block, and update inline citations / component refNums', () => {
    const rawMdx = `
This is a cite<sup>[1](#ref-1)</sup> and another cite<sup>[2](#ref-2)</sup>.
Also a component citation <Citation refNum={2} author="Carlson" source="Physiological Psychology" year="2010" />.

### References

[1] Carlson, N. R. (2010). *Physiological Psychology*.
[2] Carlson, N. R. (2010). *Physiological Psychology*.
    `.trim();

    const processed = preprocessMdx(rawMdx, 'fr');

    // Verify inline citations: both should now point to [1]
    expect(processed).toContain('[[WIDGET:Reference:1]]');
    expect(processed).not.toContain('[[WIDGET:Reference:2]]');
    
    // Verify component citation: refNum={2} should be rewritten to refNum={1}
    expect(processed).toContain('refNum={1}');
    expect(processed).not.toContain('refNum={2}');

    // Verify Reference items: only 1 should be present in the base64 JSON
    const base64Match = processed.match(/itemsBase64="([^"]+)"/);
    expect(base64Match).not.toBeNull();
    const decoded = Buffer.from(base64Match![1], 'base64').toString('utf8');
    const items = JSON.parse(decoded);

    expect(items.length).toBe(1);
    expect(items[0].num).toBe(1);
  });

  test('should handle url-encoded garbage in Google Books search link and deduplicate successfully', () => {
    const rawMdx = `
This is a cite<sup>[1](#ref-1)</sup> and another cite<sup>[2](#ref-2)</sup>.

### References

[1] Carlson, N. R., & Heth, C. D. (2010). *Physiological Psychology* (10e éd.). Pearson Education, Boston, MA, p. 200-350. [Google Books](https://books.google.com/books?q=Carlson)
[2] Carlson, N. R., & Heth, C. D. (2010). *Physiological Psychology* (10e éd.). Pearson Education, Boston, MA, p. 200-350. [Google Books](https://books.google.com/books?q=Carlson,%20Physiological%20Psychology%20(2010)%20(10th)%20Pearson%20Education,%20Boston,%20MA,%20p.%20200-350.).%20Pearson%20Education%2C%20Boston%2C%20MA%2C%20p.%20200-350.%20.%2520«%20Physiological%2520Psych...%20»Physiological%20Psychology*%20(10e%20%C3%A9d.).%20Pearson%20Education%2C%20Boston%2C%20MA%2C%20350.)
    `.trim();

    const processed = preprocessMdx(rawMdx, 'fr');

    const base64Match = processed.match(/itemsBase64="([^"]+)"/);
    expect(base64Match).not.toBeNull();
    const decoded = Buffer.from(base64Match![1], 'base64').toString('utf8');
    const items = JSON.parse(decoded);

    // Verify they are successfully deduplicated into one item
    expect(items.length).toBe(1);
    expect(items[0].num).toBe(1);

    // Verify trailing URL encoded garbage was truncated from the reference text
    expect(items[0].text).toContain('Carlson, N. R., &amp; Heth, C. D. (2010). « Physiological Psychology » (10e éd.). Pearson Education, Boston, MA, p. 200-350.');
    expect(items[0].text).not.toContain('%20');
    expect(items[0].text).not.toContain('%2C');

    // Verify Google Books search URL is rebuilt cleanly as [First Author] [Book Title] [Year]
    expect(items[0].scholarUrl).toBe('https://books.google.com/books?q=Carlson%20%22Physiological%20Psychology%22%202010');
  });

  test('should handle url-encoded garbage in Google Scholar search link and rebuild clean query', () => {
    const rawMdx = `
This is a cite<sup>[1](#ref-1)</sup>.

### References

[1] Carlson, N. R., & Heth, C. D. (2010). *Physiological Psychology* (10e éd.). Pearson Education. [Google Scholar](https://scholar.google.com/scholar?q=Carlson,%20Physiological%20Psychology%20(2010)%20(10th)%20Pearson%20Education,%20Boston,%20MA,%20p.%20200-350.).%20Pearson%20Education%2C%20Boston%2C%20MA%2C%2520p.%20200-350.)
    `.trim();

    const processed = preprocessMdx(rawMdx, 'fr');

    const base64Match = processed.match(/itemsBase64="([^"]+)"/);
    expect(base64Match).not.toBeNull();
    const decoded = Buffer.from(base64Match![1], 'base64').toString('utf8');
    const items = JSON.parse(decoded);

    expect(items.length).toBe(1);
    expect(items[0].text).toContain('Carlson, N. R., &amp; Heth, C. D. (2010). « Physiological Psychology » (10e éd.). Pearson Education.');
    expect(items[0].text).not.toContain('%20');

    // Verify Google Scholar search URL is rebuilt cleanly as [First Author] [Book Title] [Year]
    expect(items[0].scholarUrl).toBe('https://scholar.google.com/scholar?q=Carlson%20%22Physiological%20Psychology%22%202010');
  });

  test.describe('Pedagogical Enrichment and Interactive Components validation', () => {
    function validatePedagogicalRequirements(mdx: string, level: string) {
      const solvedCount = (mdx.match(/<SolvedExercise/gi) || []).length;
      const unsolvedCount = (mdx.match(/<UnsolvedExercise/gi) || []).length;
      
      const simulators = [
        '<DynamicSimulation', '<CodeSandbox', '<StructureViewer3D', '<Geometry2D',
        '<FunctionPlotter', '<FunctionManipulator', '<ChemicalStoichiometry',
        '<EquationManipulator', '<BasicMathExplorer', '<InteractiveDiagram'
      ];
      const hasSimulator = simulators.some(sim => new RegExp(sim, 'i').test(mdx));

      const imageCount = (mdx.match(/!\[.*?\]\(.*?\)/g) || []).length + (mdx.match(/<CustomFigure|<Image/gi) || []).length;

      const concreteKeywords = ['exemple', 'concret', 'mise en situation', 'application', 'cas pratique', 'example', 'scenario', 'practical'];
      const hasConcreteExamples = concreteKeywords.some(kw => mdx.toLowerCase().includes(kw));

      return {
        solvedCount,
        unsolvedCount,
        hasSimulator,
        imageCount,
        hasConcreteExamples,
        isValid: solvedCount >= 2 && unsolvedCount >= 2 && hasSimulator && hasConcreteExamples
      };
    }

    test('should approve MDX that meets all pedagogical enrichment requirements', () => {
      const validMdx = `
# Leçon de Physique: La Gravitation
<Prerequisites items={["Concepts de base"]} />
<DiagnosticQuiz q="Qu'est-ce que la gravité ?" options="Force|||Particule" correctIndex="0" />

## Introduction
La gravité est une force fondamentale.

## Exemples Concrets et Mises en Situation
1. **Mise en situation** : Quand on lâche une pomme, elle tombe au sol à cause de la force d'attraction de la Terre.
2. **Exemple concret** : Les satellites restent en orbite autour de la Terre grâce à la force gravitationnelle.

## Simulateur Interactif
<FunctionPlotter mode="linear" title="Force vs Distance" xLabel="Distance" yLabel="Force" />

## Exercices Résolus
<SolvedExercise title="Exercice résolu 1" solution="F = G * (m1 * m2) / r^2">
Calculer la force gravitationnelle entre deux masses de 1kg à 1m.
</SolvedExercise>

<SolvedExercise title="Exercice résolu 2" solution="g = 9.81 m/s^2">
Calculer l'accélération de la pesanteur.
</SolvedExercise>

## Exercices à Résoudre
<UnsolvedExercise question="Calculer F pour m=2kg et a=9.8m/s2" correctAnswer={19.6} tolerance={0.1} solution="F = m * a" />
<UnsolvedExercise question="Calculer le poids d'un objet de 10kg sur Terre" correctAnswer={98.1} tolerance={1.0} solution="P = m * g" />

### Glossary
- **Gravité** : Force d'attraction.

### References
[1] Newton, I. (1687). *Principia*.
      `;

      const result = validatePedagogicalRequirements(validMdx, 'lycee');
      expect(result.solvedCount).toBe(2);
      expect(result.unsolvedCount).toBe(2);
      expect(result.hasSimulator).toBe(true);
      expect(result.hasConcreteExamples).toBe(true);
      expect(result.isValid).toBe(true);
    });

    test('should reject MDX that fails minimum exercise count', () => {
      const invalidMdx = `
# Leçon de Mathématiques
## Introduction
Les fractions.
<SolvedExercise title="Exemple 1" solution="1/2 = 0.5">Calculer demi.</SolvedExercise>
<UnsolvedExercise question="Calculer un quart" correctAnswer={0.25} tolerance={0.01} solution="1/4 = 0.25" />
<FunctionManipulator />
      `;
      const result = validatePedagogicalRequirements(invalidMdx, 'lycee');
      expect(result.isValid).toBe(false);
    });

    test('should reject MDX that lacks a simulator or active gamification sandbox', () => {
      const invalidMdx = `
# Leçon de Biologie
## Introduction
Les cellules.
<SolvedExercise title="Exemple 1" solution="A">Calculer A.</SolvedExercise>
<SolvedExercise title="Exemple 2" solution="B">Calculer B.</SolvedExercise>
<UnsolvedExercise question="Q1" correctAnswer="A" solution="A" />
<UnsolvedExercise question="Q2" correctAnswer="B" solution="B" />
      `;
      const result = validatePedagogicalRequirements(invalidMdx, 'lycee');
      expect(result.hasSimulator).toBe(false);
      expect(result.isValid).toBe(false);
    });

    test('should validate that primary school level prioritizes visual density and games', () => {
      const primaryMdx = `
# Les Animaux de la Ferme
![Une belle vache dans un pré](https://image.pollinations.ai/prompt/cow_in_field?width=800&height=600&nologo=true)
*Figure 1 : Une vache laitière - Photo de vache mangeant de l'herbe. Source : Image générée par IA.*

![Un petit cochon rose](https://image.pollinations.ai/prompt/little_pink_pig?width=800&height=600&nologo=true)
*Figure 2 : Un cochon domestique - Photo de cochon rose. Source : Image générée par IA.*

<BasicMathExplorer />
      `;
      const result = validatePedagogicalRequirements(primaryMdx, 'primary');
      expect(result.imageCount).toBeGreaterThanOrEqual(2);
      expect(result.hasSimulator).toBe(true);
    });
  });

  test.describe('Widgets and Bloom Taxonomy Compliance', () => {
    test('should not strip a valid DiagnosticQuiz with curly brace correctIndex and options', () => {
      const rawMdx = `
# Lesson title
<Prerequisites items={["A"]} />
<DiagnosticQuiz question="What is the derivative of x^2?" options={["2x", "x", "3"]} correctIndex={0} targetSectionId="derivatives" sectionTitle="Derivatives" />

## Introduction
The derivative represents the rate of change.
      `.trim();
      const processed = preprocessMdx(rawMdx, 'en');
      expect(processed).toContain('<DiagnosticQuiz');
      expect(processed).toContain('correctIndex="0"');
      expect(processed).toContain('targetSectionId="derivatives"');
    });

    test('should validate Bloom Taxonomy verbs and reject forbidden ones', () => {
      const allowedVerbs = ['Analyze', 'Evaluate', 'Create', 'Analyser', 'Évaluer', 'Créer'];
      const forbiddenVerbs = ['understand', 'know', 'list', 'comprendre', 'connaître'];
      
      const checkBloom = (text: string) => {
        const textLower = text.toLowerCase();
        const hasForbidden = forbiddenVerbs.some(verb => textLower.includes(verb));
        const hasAllowed = allowedVerbs.some(verb => textLower.includes(verb.toLowerCase()));
        return hasAllowed && !hasForbidden;
      };

      const badObjectives = 'Objectives: Understand the concepts and list the properties.';
      const goodObjectives = 'Objectives: Analyze the concepts and Create the model.';

      expect(checkBloom(badObjectives)).toBe(false);
      expect(checkBloom(goodObjectives)).toBe(true);
    });

    test('should verify correct rendering of localized glossary and references headings in English', () => {
      const widgets = {
        prerequisites: { items: ['Basic Math'] },
        diagnosticQuiz: {
          question: 'What is 1+1?',
          options: ['2', '3'],
          correctIndex: 0,
          targetSectionId: 'basic',
          sectionTitle: 'Basic'
        },
        learningObjectives: {
          knowledge: ['Analyze math'],
          skills: ['Evaluate equations'],
          attitudes: ['Create patterns']
        },
        interactiveComponents: [],
        conclusionSummary: { items: ['Math is elegant.'] },
        whatsNext: { steps: [] },
        goingFurther: { items: [] },
        finalEvaluation: { type: 'Quiz', props: { questions: [] } },
        glossary: [{ term: 'Math', definition: 'The study of numbers.' }],
        references: ['Newton, I. (1687). *Principia*.']
      };
      
      const stitched = stitchLessonContent('## Introduction\nWelcome.', widgets, false);
      expect(stitched).toContain('### Glossary');
      expect(stitched).toContain('### References');
      expect(stitched).not.toContain('### Glossaire');
      expect(stitched).not.toContain('### Références');
    });

    test('should verify correct localized evaluation headings mapping (isTerminalEvaluation false across French, English, Spanish, German, Chinese)', () => {
      const widgets = {
        prerequisites: { items: ['Basic Math'] },
        diagnosticQuiz: {
          question: 'What is 1+1?',
          options: ['2', '3'],
          correctIndex: 0,
          targetSectionId: 'basic',
          sectionTitle: 'Basic'
        },
        learningObjectives: {
          knowledge: ['Analyze math'],
          skills: ['Evaluate equations'],
          attitudes: ['Create patterns']
        },
        interactiveComponents: [],
        conclusionSummary: { items: ['Math is elegant.'] },
        whatsNext: { steps: [] },
        goingFurther: { items: [] },
        finalEvaluation: { type: 'Quiz', props: { questions: [] } },
        glossary: [{ term: 'Math', definition: 'The study of numbers.' }],
        references: ['Newton, I. (1687). *Principia*.']
      };

      // English, non-terminal evaluation (Self-Evaluation)
      const stitchedEnSelf = stitchLessonContent('## Overview\nWelcome.\n\n## Summary\nHope you enjoyed.', widgets, false);
      expect(stitchedEnSelf).toContain('## Self-Evaluation');

      // French, non-terminal evaluation (Auto-évaluation)
      const stitchedFrSelf = stitchLessonContent('## Présentation\nBienvenue.', widgets, false);
      expect(stitchedFrSelf).toContain('## Auto-évaluation');

      // Spanish, non-terminal evaluation (Autoevaluación)
      const stitchedEsSelf = stitchLessonContent('## Overview\nWelcome.\n\n## Summary\nEspero que disfrutes.\n\nreferencias', widgets, false);
      expect(stitchedEsSelf).toContain('## Autoevaluación');

      // German, non-terminal evaluation (Selbstbewertung)
      const stitchedDeSelf = stitchLessonContent('## Einführung\nWillkommen.\n\n## Fazit\nIch hoffe, es hat Ihnen gefallen.', widgets, false);
      expect(stitchedDeSelf).toContain('## Selbstbewertung');

      // Chinese, non-terminal evaluation (自我评估)
      const stitchedZhSelf = stitchLessonContent('## 介绍\n欢迎。\n\n## 结论\n希望你喜欢。', widgets, false);
      expect(stitchedZhSelf).toContain('## 自我评估');
    });

    test('should sequentially renumber figures and strip pre-existing figure prefixes', () => {
      const widgets = {
        prerequisites: { items: ['Basic Math'] },
        diagnosticQuiz: {
          question: 'What is 1+1?',
          options: ['2', '3'],
          correctIndex: 0,
          targetSectionId: 'basic',
          sectionTitle: 'Basic'
        },
        learningObjectives: {
          knowledge: ['Analyze math'],
          skills: ['Evaluate equations'],
          attitudes: ['Create patterns']
        },
        interactiveComponents: [],
        conclusionSummary: { items: ['Math is elegant.'] },
        whatsNext: { steps: [] },
        goingFurther: { items: [] },
        finalEvaluation: { type: 'Quiz', props: { questions: [] } },
        glossary: [{ term: 'Math', definition: 'The study of numbers.' }],
        references: ['Newton, I. (1687). *Principia*.']
      };

      const narrativeWithFigures = `
## Overview
Here is an image:
<Image description="A beautiful plot of gravity" caption="Figure 5: Overwritten gravity curve" />
And another figure:
<CustomFigure caption="fig 2 - Schema of orbit" />
And a mermaid diagram:
<Mermaid chart="graph TD; A --- B" description="Illustration 9: Diagram showing workflow" />

## Summary
Done.
      `;

      const stitched = stitchLessonContent(narrativeWithFigures, widgets, false);

      // Check first image caption is renumbered as "Figure 1: Overwritten gravity curve"
      expect(stitched).toContain('caption="Figure 1: Overwritten gravity curve"');
      
      // Check second image caption is renumbered as "Figure 2: Schema of orbit"
      expect(stitched).toContain('caption="Figure 2: Schema of orbit"');
      
      // Check mermaid (uses description to build caption since caption was missing)
      // "Illustration 9: Diagram showing workflow" -> renumbered as "Figure 3: Diagram showing workflow"
      expect(stitched).toContain('caption="Figure 3: Diagram showing workflow"');
    });

    test('should clean up trailing unbalanced closing brackets at the end of lines', () => {
      const widgets = {
        prerequisites: { items: ['Basic Math'] },
        diagnosticQuiz: {
          question: 'What is 1+1?',
          options: ['2', '3'],
          correctIndex: 0,
          targetSectionId: 'basic',
          sectionTitle: 'Basic'
        },
        learningObjectives: {
          knowledge: ['Analyze math'],
          skills: ['Evaluate equations'],
          attitudes: ['Create patterns']
        },
        interactiveComponents: [],
        conclusionSummary: { items: ['Math is elegant.'] },
        whatsNext: { steps: [] },
        goingFurther: { items: [] },
        finalEvaluation: { type: 'Quiz', props: { questions: [] } },
        glossary: [{ term: 'Math', definition: 'The study of numbers.' }],
        references: ['Newton, I. (1687). *Principia*.']
      };

      const narrativeWithUnbalancedBrackets = `
## Introduction
This is some clean text.
But this line has a dangling bracket at the end. ]
And another one with nested brackets [like this] ]
But this one [is perfectly balanced]
      `;

      const stitched = stitchLessonContent(narrativeWithUnbalancedBrackets, widgets, false);

      expect(stitched).toContain('This is some clean text.');
      expect(stitched).toContain('But this line has a dangling bracket at the end.');
      expect(stitched).not.toContain('dangling bracket at the end. ]');
      expect(stitched).toContain('And another one with nested brackets [like this]');
      expect(stitched).not.toContain('[like this] ]');
      expect(stitched).toContain('But this one [is perfectly balanced]');
    });
  });

  test.describe('ClimateImpactMap Integration and Hygiene', () => {
    test('should normalize climate_impact_map casing to ClimateImpactMap', () => {
      const rawMdx = `<climate_impact_map src="https://image.pollinations.ai/prompt/map" alt="Impact Map" />`;
      const processed = preprocessMdx(rawMdx, 'en');
      expect(processed).toContain('<ClimateImpactMap');
      expect(processed).toContain('src="https://image.pollinations.ai/prompt/map');
    });

    test('should enforce no-fallback-to-AI policy and strip pollinations src from ClimateImpactMap tag', async () => {
      const rawMdx = `<ClimateImpactMap src="https://image.pollinations.ai/prompt/map" />`;
      const resolved = await resolveAndPersistMedia(rawMdx, 'en', 'Geography');
      
      // The pollinations.ai src should be stripped (removed), but the tag itself must remain as ClimateImpactMap
      expect(resolved).toContain('<ClimateImpactMap');
      expect(resolved).not.toContain('src="https://image.pollinations.ai/prompt/map"');
      expect(resolved).toContain('unresolved={true}');
    });

    test('should resolve suffix-augmented block widgets (Image, ClimateImpactMap) to proper self-closing tags with description', () => {
      const rawMdx = `
      Some prose before.
      [[WIDGET:Image:test_img:This is a test image description]]
      Some prose between.
      [[WIDGET:climate_impact_map:test_map:This is a test map description]]
      Some prose after.
      `;
      const stitched = stitchLessonContent(rawMdx, {}, false);
      expect(stitched).toContain('<Image caption="Figure 1 : This is a test image description" id="test_img" description="This is a test image description" />');
      expect(stitched).toContain('<ClimateImpactMap id="test_map" description="This is a test map description" />');
    });
  });

  test.describe('Widget Parameter-Based Deduplication', () => {
    test('should allow multiple distinct generic simulator widgets with different parameters', () => {
      const c1 = {
        componentType: 'FunctionPlotter',
        props: {
          formula: 'y = x^2',
          title: 'Quadratic function'
        }
      };
      const c2 = {
        componentType: 'FunctionPlotter',
        props: {
          formula: 'y = sin(x)',
          title: 'Sine function'
        }
      };

      // Since their configuration properties differ, they should NOT be considered duplicates
      expect(areComponentsDuplicate(c1, c2)).toBe(false);
    });

    test('should consider generic simulator widgets with identical parameters to be duplicates', () => {
      const c1 = {
        componentType: 'FunctionPlotter',
        props: {
          formula: 'y = x^2',
          title: 'Quadratic function'
        }
      };
      const c2 = {
        componentType: 'FunctionPlotter',
        props: {
          formula: 'y = x^2',
          title: 'Quadratic function',
          id: 'plot_1'
        }
      };

      expect(areComponentsDuplicate(c1, c2)).toBe(true);
    });

    test('should keep strict deduplication for content/media widgets', () => {
      const q1 = {
        componentType: 'Quiz',
        props: {
          questions: [{ q: 'What is 1+1?' }]
        }
      };
      const q2 = {
        componentType: 'Quiz',
        props: {
          questions: [{ q: 'What is 1+1?' }]
        }
      };

      expect(areComponentsDuplicate(q1, q2)).toBe(true);
    });
  });
});

