You are a world-class academic professor and expert writer (Agent 3A - Narrative Scribe).
Your task is to write a section of the academic MDX narrative content for the specified lesson.

We are writing the lesson block-by-block.
- This is Block 4 out of 4.
- You MUST write the content for the following sections:
* Heading: "## Conclusion: Maîtriser le miroir"
  Instructions: "Récapituler les points clés de la leçon sur la récursivité. Souligner son utilité et sa puissance dans la conception d'algorithmes. Encourager la pratique et la reconnaissance des problèmes récursifs."

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
... let indiquent des sous-problèmes recalculés plusieurs fois.*

    La **mémoïsation** consiste à stocker les résultats des appels de fonction coûteux et à retourner le résultat stocké lorsque les mêmes entrées se présentent à nouveau. Cela transforme la complexité exponentielle en une complexité polynomiale (linéaire pour Fibonacci).

    **Version Récursive de Fibonacci avec Mémoïsation:**

    python
    memo = {} # Un dictionnaire pour stocker les résultats

    def fib_memoized(n):
        if n in memo: # Si le résultat est déjà calculé, le retourner
            return memo[n]
        if n <= 1:
            result = n
        else:
            result = fib_memoized(n - 1) + fib_memoized(n - 2)
        memo[n] = result # Stocker le résultat avant de le retourner
        return result
    

    Cette technique est un pilier de la <ConceptLink slug="dynamic-programming">programmation dynamique</ConceptLink> et est cruciale pour optimiser de nombreux algorithmes récursifs.

2.  **La Récursivité Terminale (Tail Recursion)**:
    Un appel récursif est dit **terminal** si l'appel récursif est la *dernière* opération effectuée par la fonction avant de retourner. Cela signifie qu'après l'appel récursif, il n'y a plus d'opérations à effectuer dans le cadre d'activation actuel.

    **Exemple de Factorielle Non Terminale (vu précédemment):**
    `return n * factorielle_recursive(n - 1)`
    Ici, après l'appel à `factorielle_recursive(n - 1)`, il faut encore multiplier le résultat par `n`. Ce n'est pas un appel terminal.

    **Exemple de Factorielle avec Récursivité Terminale:**

    python
    def factorielle_terminale(n, accumulateur=1):
        if n == 0:
            return accumulateur
        else:
            # L'appel récursif est la dernière opération
            return factorielle_terminale(n - 1, accumulateur * n)
    

    Dans cette version, la valeur accumulée est passée comme paramètre. Lorsque `factorielle_terminale(n - 1, accumulateur * n)` est appelée, le résultat de cet appel est directement retourné sans autre traitement.

    L'intérêt majeur de la récursivité terminale est que certains compilateurs (notamment ceux des langages fonctionnels comme Scheme ou Haskell, mais aussi certains compilateurs C++ ou Python dans des cas spécifiques) peuvent appliquer une **optimisation de la récursivité terminale (tail call optimization - TCO)**. Cette optimisation permet de réutiliser le même cadre de pile pour les appels récursifs terminaux, transformant de fait la récursion en une itération au niveau du code machine. Cela élimine l'overhead de la pile et prévient les débordements de pile, rendant la récursivité aussi efficace que l'itération pour ces cas spécifiques. Il est important de noter que tous les langages ou compilateurs ne supportent pas cette optimisation par défaut.

En maîtrisant ces concepts, vous pouvez choisir l'approche la plus appropriée et optimiser vos algorithmes récursifs pour qu'ils soient à la fois clairs et performants.
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
8. Since this is the LAST block, you MUST end with the ## Conclusion section containing at least two comprehensive academic paragraphs, and all conclusion widgets in this exact order:
  [[WIDGET:conclusionSummary]]
  [[WIDGET:whatsNext]]
  [[WIDGET:goingFurther]]
  followed by [[WIDGET:finalEvaluation]]



Write the content for the specified sections. Return ONLY the markdown content. Do NOT wrap the response in markdown code blocks.