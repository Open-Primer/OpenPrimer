You are a world-class academic professor and expert writer (Agent 3A - Narrative Scribe).
Your task is to write a section of the academic MDX narrative content for the specified lesson.

We are writing the lesson block-by-block.
- This is Block 2 out of 4.
- You MUST write the content for the following sections:
* Heading: "## Exemples Classiques de Récursivité"
  Instructions: "Illustrer la récursivité avec des exemples fondamentaux. Détailler l'implémentation et le fonctionnement de la fonction factorielle et de la suite de Fibonacci en utilisant la récursivité. Mettre en évidence le cas de base et l'appel récursif pour chaque exemple."
* Heading: "## La Récursivité en Action: Les Tours de Hanoï"
  Instructions: "Présenter un exemple plus complexe et visuel de la récursivité avec le problème des Tours de Hanoï. Expliquer comment la récursivité permet de résoudre ce problème de manière élégante et concise, en détaillant les étapes logiques."

---

### GLOBAL CONTEXT:
- Course Name: "Algorithmique fondamentale"
- Academic Level: "University Year 1 / Bachelor 1st Year (L1)"
- Lesson Title: "Le miroir de l'algorithme: Introduction à la récursivité"
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
... uand la récursivité doit s'arrêter. Le cas de base est une instance du problème qui est suffisamment simple pour être résolue directement, sans nécessiter d'appels récursifs supplémentaires. Sans un cas de base clairement défini et atteignable, la fonction récursive s'appellerait indéfiniment, conduisant à une boucle infinie et, dans la plupart des environnements d'exécution, à un débordement de pile (stack overflow). Il est la "sortie" de la séquence d'appels récursifs.

2.  **L'Appel Récursif (Étape Récursive)** : C'est l'étape où la fonction s'appelle elle-même, mais avec des arguments modifiés de telle sorte que le nouveau problème soit une version plus petite ou plus simple du problème original. Chaque appel récursif doit progresser vers le cas de base. Si l'appel récursif ne simplifie pas le problème ou ne le rapproche pas du cas de base, la récursivité ne terminera jamais.

Pour illustrer ces principes, considérons une analogie simple : les poupées russes, ou *Matriochka*.

Imaginez que vous ayez une grande poupée russe. Votre tâche est de trouver la plus petite poupée à l'intérieur.
*   **Le problème initial** est de trouver la plus petite poupée dans la grande poupée que vous tenez.
*   **L'étape récursive** consiste à ouvrir la poupée que vous tenez. À l'intérieur, vous trouvez une poupée plus petite. Vous appliquez alors la même "règle" : trouver la plus petite poupée dans cette nouvelle poupée, qui est une instance plus petite du problème original.
*   **Le cas de base** est atteint lorsque vous ouvrez une poupée et qu'il n'y a plus de poupée à l'intérieur, ou que la poupée que vous tenez est déjà la plus petite. À ce moment-là, vous avez trouvé votre solution et vous pouvez arrêter.

[[WIDGET:Mermaid:recursive_matryoshka]]
mermaid
graph TD
    A[Ouvrir Grande Poupée] --> B{Y a-t-il une Poupée plus petite ?}
    B -- Oui --> C[Ouvrir Poupée plus petite]
    C --> B
    B -- Non --> D[C'est la plus petite !]
    D --> E[Arrêt]

*Légende: Diagramme illustrant l'analogie des poupées russes pour la récursivité. Chaque étape d'ouverture d'une poupée plus petite représente un appel récursif, jusqu'à ce que le cas de base (plus de poupée à l'intérieur) soit atteint.*

Une autre analogie est celle de la définition d'un ancêtre. Un ancêtre est soit un parent (cas de base), soit un ancêtre d'un parent (appel récursif). Pour trouver tous vos ancêtres, vous demandez à vos parents qui sont leurs ancêtres, et ils demandent à leurs parents, et ainsi de suite, jusqu'à ce que vous atteigniez des individus qui n'ont plus de parents connus (le cas de base).

Ces analogies mettent en lumière l'élégance de la récursivité : un problème complexe est résolu en appliquant la même logique à des sous-problèmes plus simples, jusqu'à ce qu'un point de résolution directe soit atteint. La clé est de s'assurer que chaque appel récursif réduit la complexité du problème et le rapproche du cas de base. Sans cette progression, la récursivité serait une impasse sans fin.
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




Write the content for the specified sections. Return ONLY the markdown content. Do NOT wrap the response in markdown code blocks.