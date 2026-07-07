You are a world-class academic professor and expert writer (Agent 3A - Narrative Scribe).
Your task is to write a section of the academic MDX narrative content for the specified lesson.

We are writing the lesson block-by-block.
- This is Block 3 out of 4.
- You MUST write the content for the following sections:
* Heading: "## Performance Comparée: Séquentielle vs. Dichotomique"
  Instructions: "Appliquer la notation Grand O aux algorithmes de recherche séquentielle (O(n)) et dichotomique (O(log n)). Comparer leurs performances théoriques et pratiques, en soulignant l'impact du tri préalable pour la recherche dichotomique et les scénarios où l'un est préférable à l'autre."
* Heading: "## Cas Pratiques et Limitations"
  Instructions: "Discuter des scénarios d'application concrets pour chaque algorithme. Aborder les compromis (coût du tri vs. rapidité de recherche). Mentionner les limitations de ces algorithmes et les situations où d'autres approches ou structures de données seraient plus appropriées."

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
... ès grande. Elle ignore les facteurs constants et les termes d'ordre inférieur, car ce qui importe le plus pour de grandes valeurs de `N` est le terme qui croît le plus rapidement.

Par exemple, si un algorithme effectue `3N² + 2N + 5` opérations, la notation Grand O se concentrera sur `N²`, car pour un `N` très grand, `3N²` dominera largement `2N` et `5`. On écrirait alors `O(N²)`.

Voici quelques exemples courants de complexité temporelle, classés par ordre croissant d'inefficacité pour de grandes valeurs de `N` :

*   **O(1) - Complexité Constante :** Le temps d'exécution est indépendant de la taille de l'entrée. Le nombre d'opérations reste le même, quelle que soit la valeur de `N`.
    *   *Exemple :* Accéder à un élément spécifique d'un tableau par son index (ex: `tableau[5]`). Quelle que soit la taille du tableau, cette opération prend un temps constant.
*   **O(log N) - Complexité Logarithmique :** Le temps d'exécution croît très lentement avec la taille de l'entrée. C'est le cas de la recherche dichotomique. Doubler la taille de l'entrée n'augmente le temps d'exécution que d'une petite quantité constante.
    *   *Exemple :* Recherche dichotomique dans un tableau trié.
*   **O(N) - Complexité Linéaire :** Le temps d'exécution croît proportionnellement à la taille de l'entrée. Si `N` double, le temps d'exécution double également.
    *   *Exemple :* Recherche séquentielle dans un tableau non trié. Parcourir une liste pour trouver le maximum.
*   **O(N log N) - Complexité Linéarithmique :** Le temps d'exécution croît un peu plus vite que linéaire, mais beaucoup moins vite que quadratique. C'est une complexité très courante pour les algorithmes de tri efficaces.
    *   *Exemple :* Algorithmes de tri comme le tri fusion (Merge Sort) ou le tri rapide (Quick Sort) dans le cas moyen.
*   **O(N²) - Complexité Quadratique :** Le temps d'exécution croît proportionnellement au carré de la taille de l'entrée. Si `N` double, le temps d'exécution est multiplié par quatre. Ces algorithmes deviennent rapidement impraticables pour de grandes valeurs de `N`.
    *   *Exemple :* Algorithmes de tri simples comme le tri à bulles (Bubble Sort) ou le tri par sélection (Selection Sort), qui impliquent souvent des boucles imbriquées parcourant `N` éléments `N` fois.
*   **O(2^N) - Complexité Exponentielle :** Le temps d'exécution croît de manière exponentielle avec la taille de l'entrée. Ces algorithmes sont généralement inutilisables pour `N` supérieur à une vingtaine ou une trentaine.
    *   *Exemple :* Calcul récursif naïf de la suite de Fibonacci, ou résolution de certains problèmes par force brute.

Comprendre la complexité algorithmique est fondamental pour tout informaticien. Cela permet de choisir l'algorithme le plus adapté à un problème donné, en fonction des contraintes de performance et de la taille attendue des données. La notation Grand O nous offre un langage commun et rigoureux pour discuter et comparer l'efficacité des solutions algorithmiques.
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