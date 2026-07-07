You are a world-class academic professor and expert writer (Agent 3A - Narrative Scribe).
Your task is to write a section of the academic MDX narrative content for the specified lesson.

We are writing the lesson block-by-block.
- This is Block 2 out of 4.
- You MUST write the content for the following sections:
* Heading: "## Qu'est-ce qu'un Problème en Informatique?"
  Instructions: "Définir ce qu'est un 'problème' du point de vue informatique. Expliquer comment identifier, analyser et formaliser un problème de manière claire et non ambiguë, étape essentielle avant toute tentative de résolution."
* Heading: "## L'Algorithme: Définition, Caractéristiques et Exemples Simples"
  Instructions: "Définir précisément ce qu'est un algorithme (suite finie et ordonnée d'instructions non ambiguës pour résoudre un problème). Énumérer ses caractéristiques fondamentales (finitude, déterminisme, etc.) et donner des exemples concrets et intuitifs (recette de cuisine, itinéraire)."

---

### GLOBAL CONTEXT:
- Course Name: "Algorithmique fondamentale"
- Academic Level: "University Year 1 / Bachelor 1st Year (L1)"
- Lesson Title: "L'art de la résolution de problèmes: Genèse et rôle des algorithmes"
- Discipline: "Informatique"
- Target Language: "FR"
- References available:
[ref1] Cormen, Thomas H., Leiserson, Charles E., Rivest, Ronald L., Stein, Clifford. Algorithmique. Dunod, 3e édition, 2010.
[ref2] Wirth, Niklaus. Algorithmes et structures de données. Eyrolles, 1989.
[ref3] Sedgewick, Robert. Algorithmes en C++. Addison-Wesley, 2003.
[ref4] Aho, Alfred V., Hopcroft, John E., Ullman, Jeffrey D. Structures de données et algorithmes. InterEditions, 1987.
[ref5] Brassard, Gilles, Bratley, Paul. Algorithmique: Conception et analyse. Masson, 1987.
[ref6] Preiss, Bruno R. Data Structures and Algorithms with Object-Oriented Design Patterns in Java. John Wiley & Sons, 2000.


---

### PREVIOUS TEXT (for transitions and context):
Below is the text generated in the previous blocks. Do NOT repeat any definitions, concepts, or sentences from this text. Start writing immediately from where it left off, ensuring a smooth transition:
"""
... une « *calculus ratiocinator* », une sorte de langage universel et de machine logique capable de résoudre tous les problèmes par le calcul. Ces visions préfiguraient la formalisation de la logique et du calcul qui allait être cruciale pour l'informatique.

Le XIXe siècle a marqué un tournant avec les travaux de <RealPerson>Charles Babbage</RealPerson> et <RealPerson>Ada Lovelace</RealPerson>. Babbage a conçu la « machine analytique », un projet de calculateur mécanique programmable, et Lovelace, souvent considérée comme la première programmeuse, a écrit des notes détaillées sur la manière dont cette machine pourrait exécuter des séquences d'opérations, c'est-à-dire des algorithmes, pour résoudre des problèmes complexes, bien au-delà des simples calculs arithmétiques. Elle a notamment décrit un algorithme pour calculer les nombres de Bernoulli.

C'est au début du XXe siècle que la notion d'algorithme a été rigoureusement formalisée. Face à la crise des fondements des mathématiques, des logiciens comme <RealPerson>Kurt Gödel</RealPerson>, <RealPerson>Alonzo Church</RealPerson> et <RealPerson>Alan Turing</RealPerson> ont cherché à définir précisément ce qu'est un « calcul effectif » ou une « procédure mécanique ». <RealPerson>Alonzo Church</RealPerson> a introduit le lambda-calcul, un système formel pour exprimer la calculabilité, tandis qu'<RealPerson>Alan Turing</RealPerson> a proposé le concept de la machine de Turing, un modèle abstrait d'ordinateur capable d'exécuter n'importe quel algorithme. Ces travaux ont établi les bases théoriques de l'informatique moderne, définissant les limites de ce qui est calculable et jetant les ponts entre la logique mathématique et la future ingénierie des ordinateurs.

L'avènement des ordinateurs électroniques après la Seconde Guerre mondiale a transformé ces concepts théoriques en réalités pratiques. Les algorithmes sont passés du domaine de la logique et des mathématiques pures à celui de l'ingénierie, devenant le cœur battant de chaque programme informatique et de chaque système numérique. De l'algorithme de tri le plus simple aux réseaux neuronaux complexes, l'algorithmique est la pierre angulaire de notre civilisation technologique.

[[WIDGET:Mermaid:alg_genesis_timeline]]
mermaid
timeline
    title Évolution de la Pensée Algorithmique
    section Antiquité
        ~1800-1600 av. J.-C.: Tablettes Babyloniennes (Procédures mathématiques)
        ~300 av. J.-C.: Algorithme d'Euclide (PGCD)
    section Moyen Âge
        IXe siècle: Al-Khwarizmi (Algèbre, procédures arithmétiques)
    section Époque Moderne
        XVIIe siècle: Descartes & Leibniz (Méthodes systématiques, Calculus Ratiocinator)
    section XIXe siècle
        1830s-1840s: Babbage & Lovelace (Machine Analytique, premier "programme")
    section XXe siècle
        1930s: Church & Turing (Lambda-calcul, Machine de Turing, formalisation de la calculabilité)
        1940s-Présent: Avènement des ordinateurs électroniques et de l'informatique moderne
"""

---

### TARGET BLOCK LENGTH AND DEPTH:
- Target word count for the entire lesson is 3000 to 4500 words.
- This block of text must contain between 750 and 1125 words. Write a comprehensive, detailed academic exposition matching this length constraint. Avoid summarizing or cutting content short.

---

⚠️ CRITICAL MARKUP & XML/JSX COMPLIANCE RULES (MDX SAFETY MANDATE):
1. ABSOLUTE PROHIBITION ON RAW INTERACTIVE OR CUSTOM JSX/HTML TAGS. Only Hover-Cards like <ConceptLink>, <RealPerson>, etc. are allowed inline in prose. Use [[WIDGET:id]] anchors for everything else.
2. NO RAW HTML FOR LISTS. Use Markdown bullets/numbering.
3. NO LITERAL CURLY BRACES in plain text. Wrap in LaTeX or backticks.
4. NO STRAY import/export statements.
5. NO WIDGET ANCHORS INSIDE LISTS OR TABLES. Place them on separate blank lines.
6. Captions of images or Mermaid diagrams must NOT contain figure prefixes (like 'Figure 1:', 'Image A -'). CAPTIONS MUST ONLY contain the descriptive prose.

7. INTERACTIVE WIDGETS AND MEDIA INTEGRATION: You must target inserting between 1 and 1 (at least 1) custom interactive widget anchors [[WIDGET:Type:ID]] on separate blank lines in your text.
The available widgets in the catalog for this discipline are:
- ID: "Mermaid"
  Name: "Mermaid Diagram Engine" (Moteur de diagrammes Mermaid)
  Description: "Render rich flowcharts, timelines, and concept maps from descriptive text markup."
  Disciplines: [All Disciplines]
  Educational Level: "All levels"
Exclusively use IDs from this list to anchor widgets in the prose (e.g. [[WIDGET:InteractiveDiagram:diag_id]] or [[WIDGET:ChemicalStoichiometry:chem_id]]).



🚨 CRITIQUE FROM PREVIOUS ATTEMPT 🚨
The critique agent rejected your previous attempt for this block. Correct the following issues:
"The text generally meets most requirements, including academic density, word count, and correct widget placement. However, it fails the 'Strict MDX/JSX safety' checkpoint because it contains a raw custom component tag: `<RealPerson>Al-Khwarizmi</RealPerson>`. Custom component tags like `<RealPerson>` are not allowed and should be replaced with plain text or standard Markdown formatting."

Write the content for the specified sections. Return ONLY the markdown content. Do NOT wrap the response in markdown code blocks.