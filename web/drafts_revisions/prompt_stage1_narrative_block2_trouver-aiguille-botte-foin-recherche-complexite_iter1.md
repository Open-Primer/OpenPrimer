You are a world-class academic professor and expert writer (Agent 3A - Narrative Scribe).
Your task is to write a section of the academic MDX narrative content for the specified lesson.

We are writing the lesson block-by-block.
- This is Block 2 out of 4.
- You MUST write the content for the following sections:
* Heading: "## La Recherche Dichotomique: Diviser pour régner"
  Instructions: "Présenter l'algorithme de recherche dichotomique (ou binaire). Insister sur la condition préalable des données triées. Expliquer le mécanisme de division de l'intervalle de recherche et la réduction rapide de l'espace de recherche."
* Heading: "## Mesurer l'efficacité: Introduction à la Complexité Algorithmique"
  Instructions: "Définir la notion de complexité algorithmique (temporelle et spatiale). Introduire la notation Grand O (O-notation) comme outil standard pour caractériser la croissance du temps d'exécution en fonction de la taille des données. Donner des exemples simples (O(1), O(n), O(n²))."

---

### GLOBAL CONTEXT:
- Course Name: "Algorithmique fondamentale"
- Academic Level: "University Year 1 / Bachelor 1st Year (L1)"
- Lesson Title: "Trouver l'aiguille dans la botte de foin: Recherche et complexité algorithmique"
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
... F{Élément à l'index courant == Clé de recherche?};
    F -- Oui --> G[Retourner "Trouvé à l'index"];
    F -- Non --> H[Incrémenter index];
    H --> E;

Description: Diagramme de flux illustrant les étapes de l'algorithme de recherche séquentielle, de l'initialisation à la décision de trouver ou non l'élément.

**Avantages de la Recherche Séquentielle :**

*   **Simplicité :** C'est l'un des algorithmes les plus faciles à comprendre et à implémenter. Il ne nécessite que quelques lignes de code dans la plupart des langages de programmation.
*   **Pas de prérequis sur les données :** Contrairement à d'autres algorithmes de recherche plus avancés (que nous verrons plus tard), la recherche séquentielle ne nécessite pas que la collection de données soit triée. Les éléments peuvent être dans n'importe quel ordre.
*   **Applicabilité universelle :** Elle fonctionne sur n'importe quel type de structure de données linéaire (tableaux, listes chaînées, etc.) et pour n'importe quel type d'éléments comparables.

**Inconvénients de la Recherche Séquentielle :**

Malgré sa simplicité, la recherche séquentielle souffre d'un inconvénient majeur qui limite son utilisation dans de nombreux contextes : sa performance.

*   **Performance sur de grands ensembles de données :** C'est là que la recherche séquentielle montre ses limites.
    *   **Meilleur cas :** Si la clé de recherche est le tout premier élément de la collection, une seule comparaison est nécessaire. C'est le scénario le plus rapide.
    *   **Pire cas :** Si la clé de recherche est le dernier élément de la collection, ou si elle n'est pas présente du tout, l'algorithme doit parcourir *tous* les éléments de la collection. Si la collection contient `N` éléments, cela signifie `N` comparaisons.
    *   **Cas moyen :** En moyenne, si l'élément est présent et sa position est aléatoire, l'algorithme effectuera environ `N/2` comparaisons.

Pour une petite collection de quelques dizaines ou centaines d'éléments, cette différence n'est pas perceptible. Cependant, pour des collections de millions, de milliards, ou même de milliers de milliards d'éléments (comme c'est le cas dans les bases de données modernes ou sur le web), `N` comparaisons devient un nombre astronomiquement grand. Un algorithme qui nécessite `N` opérations pour une collection de `N` éléments est dit avoir une <ConceptLink slug="complexite-temporelle">complexité temporelle</ConceptLink> linéaire, notée `O(N)`. Cela signifie que le temps d'exécution augmente proportionnellement à la taille de l'entrée. Pour des applications exigeant des réponses rapides sur de vastes ensembles de données, la recherche séquentielle est donc inadaptée.

En résumé, bien que la recherche séquentielle soit un excellent point de départ pour comprendre les principes de la recherche algorithmique, sa faible performance sur de grands volumes de données nous pousse à explorer des méthodes plus sophistiquées et efficaces, qui seront le sujet de nos prochaines discussions.
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