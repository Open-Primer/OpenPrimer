You are a world-class academic professor and expert writer (Agent 3A - Narrative Scribe).
Your task is to write a section of the academic MDX narrative content for the specified lesson.

We are writing the lesson block-by-block.
- This is Block 2 out of 4.
- You MUST write the content for the following sections:
* Heading: "## Le Tri par Insertion"
  Instructions: "Décrire le principe de fonctionnement du tri par insertion. Fournir le pseudo-code détaillé de l'algorithme. Illustrer son exécution avec un exemple pas à pas sur un petit tableau."
* Heading: "## Le Tri à Bulles"
  Instructions: "Décrire le principe de fonctionnement du tri à bulles. Fournir le pseudo-code détaillé de l'algorithme. Illustrer son exécution avec un exemple pas à pas sur un petit tableau."

---

### GLOBAL CONTEXT:
- Course Name: "Algorithmique fondamentale"
- Academic Level: "University Year 1 / Bachelor 1st Year (L1)"
- Lesson Title: "Mettre de l'ordre: Algorithmes de tri élémentaires"
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
... tion | Tableau `A` (après échange) |
| :---- | :-: | :-: | :-------: | :-------------------------- | :----- | :-------------------------- |
| **Initial** | - | - | - | `[64, 25, 12, 22, 11]` | - | `[64, 25, 12, 22, 11]` |
| **Itération 1** | `0` | - | `0` | `[64, 25, 12, 22, 11]` | `min_idx` initialisé à `0` (valeur `64`) | `[64, 25, 12, 22, 11]` |
| | | `1` | `0` | `[64, 25, 12, 22, 11]` | `A[1]` (`25`) < `A[0]` (`64`) est Faux | `[64, 25, 12, 22, 11]` |
| | | `2` | `0` | `[64, 25, 12, 22, 11]` | `A[2]` (`12`) < `A[0]` (`64`) est Vrai, `min_idx` devient `2` | `[64, 25, 12, 22, 11]` |
| | | `3` | `2` | `[64, 25, 12, 22, 11]` | `A[3]` (`22`) < `A[2]` (`12`) est Faux | `[64, 25, 12, 22, 11]` |
| | | `4` | `2` | `[64, 25, 12, 22, 11]` | `A[4]` (`11`) < `A[2]` (`12`) est Vrai, `min_idx` devient `4` | `[64, 25, 12, 22, 11]` |
| | **Fin boucle `j`** | | `4` | `[64, 25, 12, 22, 11]` | Échange `A[0]` (`64`) et `A[4]` (`11`) | `[11, 25, 12, 22, 64]` |
| **Itération 2** | `1` | - | `1` | `[11, 25, 12, 22, 64]` | `min_idx` initialisé à `1` (valeur `25`) | `[11, 25, 12, 22, 64]` |
| | | `2` | `1` | `[11, 25, 12, 22, 64]` | `A[2]` (`12`) < `A[1]` (`25`) est Vrai, `min_idx` devient `2` | `[11, 25, 12, 22, 64]` |
| | | `3` | `2` | `[11, 25, 12, 22, 64]` | `A[3]` (`22`) < `A[2]` (`12`) est Faux | `[11, 25, 12, 22, 64]` |
| | | `4` | `2` | `[11, 25, 12, 22, 64]` | `A[4]` (`64`) < `A[2]` (`12`) est Faux | `[11, 25, 12, 22, 64]` |
| | **Fin boucle `j`** | | `2` | `[11, 25, 12, 22, 64]` | Échange `A[1]` (`25`) et `A[2]` (`12`) | `[11, 12, 25, 22, 64]` |
| **Itération 3** | `2` | - | `2` | `[11, 12, 25, 22, 64]` | `min_idx` initialisé à `2` (valeur `25`) | `[11, 12, 25, 22, 64]` |
| | | `3` | `2` | `[11, 12, 25, 22, 64]` | `A[3]` (`22`) < `A[2]` (`25`) est Vrai, `min_idx` devient `3` | `[11, 12, 25, 22, 64]` |
| | | `4` | `3` | `[11, 12, 25, 22, 64]` | `A[4]` (`64`) < `A[3]` (`22`) est Faux | `[11, 12, 25, 22, 64]` |
| | **Fin boucle `j`** | | `3` | `[11, 12, 25, 22, 64]` | Échange `A[2]` (`25`) et `A[3]` (`22`) | `[11, 12, 22, 25, 64]` |
| **Itération 4** | `3` | - | `3` | `[11, 12, 22, 25, 64]` | `min_idx` initialisé à `3` (valeur `25`) | `[11, 12, 22, 25, 64]` |
| | | `4` | `3` | `[11, 12, 22, 25, 64]` | `A[4]` (`64`) < `A[3]` (`25`) est Faux | `[11, 12, 22, 25, 64]` |
| | **Fin boucle `j`** | | `3` | `[11, 12, 22, 25, 64]` | `min_idx` (`3`) est égal à `i` (`3`), pas d'échange | `[11, 12, 22, 25, 64]` |
| **Final** | - | - | - | `[11, 12, 22, 25, 64]` | Le tableau est trié. | `[11, 12, 22, 25, 64]` |

Après ces 4 itérations, le tableau est entièrement trié. Le tri par sélection est un algorithme de tri en place, car il ne nécessite qu'une quantité constante de mémoire auxiliaire (pour la variable `min_idx` et la variable `temp` lors de l'échange). Sa simplicité en fait un bon point de départ pour comprendre les mécanismes de tri, bien que sa performance ne soit pas optimale pour de grands ensembles de données, comme nous le verrons lors de l'analyse de complexité.
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