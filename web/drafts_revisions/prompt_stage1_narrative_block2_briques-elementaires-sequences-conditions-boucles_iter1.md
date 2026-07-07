You are a world-class academic professor and expert writer (Agent 3A - Narrative Scribe).
Your task is to write a section of the academic MDX narrative content for the specified lesson.

We are writing the lesson block-by-block.
- This is Block 2 out of 4.
- You MUST write the content for the following sections:
* Heading: "## Les structures conditionnelles (Si-Alors-Sinon)"
  Instructions: "Introduire la notion de prise de décision dans un algorithme. Expliquer les structures 'Si-Alors' et 'Si-Alors-Sinon'. Aborder les opérateurs de comparaison et logiques. Illustrer avec des exemples concrets (ex: déterminer le plus grand de deux nombres, vérifier une condition)."
* Heading: "## Les boucles 'Tant que'"
  Instructions: "Présenter les structures itératives pour la répétition d'instructions. Expliquer le fonctionnement de la boucle 'Tant que' (While), en insistant sur la condition d'arrêt et le risque de boucle infinie. Fournir des exemples (ex: compter jusqu'à N, saisir une valeur valide)."

---

### GLOBAL CONTEXT:
- Course Name: "Algorithmique fondamentale"
- Academic Level: "University Year 1 / Bachelor 1st Year (L1)"
- Lesson Title: "Les briques élémentaires: Séquences, conditions et boucles"
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
... e la surface d'un rectangle**

Pour calculer la surface d'un rectangle, nous avons besoin de sa longueur et de sa largeur. L'algorithme séquentiel pour cette tâche se déroulerait comme suit :

1.  **Instruction 1 :** Demander à l'utilisateur la valeur de la longueur du rectangle.
2.  **Instruction 2 :** Stocker cette valeur dans une variable, par exemple `longueur`.
3.  **Instruction 3 :** Demander à l'utilisateur la valeur de la largeur du rectangle.
4.  **Instruction 4 :** Stocker cette valeur dans une variable, par exemple `largeur`.
5.  **Instruction 5 :** Calculer la surface en multipliant `longueur` par `largeur`.
6.  **Instruction 6 :** Stocker le résultat dans une variable, par exemple `surface`.
7.  **Instruction 7 :** Afficher la valeur de `surface` à l'utilisateur.

Chaque instruction est exécutée une seule fois, dans l'ordre spécifié. Il serait illogique de tenter de calculer la surface avant d'avoir obtenu les valeurs de la longueur et de la largeur.

[[WIDGET:Mermaid:seq_flowchart_area]]
Diagramme de flux illustrant un algorithme séquentiel pour le calcul de l'aire d'un rectangle.

**Exemple 2 : Échange de deux valeurs**

Un problème classique en algorithmique est l'échange du contenu de deux variables. Supposons que nous ayons une variable `A` contenant la valeur 10 et une variable `B` contenant la valeur 20, et que nous voulions que `A` contienne 20 et `B` contienne 10. Une approche naïve qui tenterait `A = B` puis `B = A` échouerait, car la première instruction écraserait la valeur originale de `A` avant qu'elle ne puisse être copiée dans `B`. Pour résoudre ce problème, une troisième variable temporaire est nécessaire, et l'ordre des opérations est vital :

1.  **Instruction 1 :** Déclarer une variable temporaire, par exemple `temp`.
2.  **Instruction 2 :** Copier la valeur de `A` dans `temp`. (Maintenant `temp` contient la valeur originale de `A`).
3.  **Instruction 3 :** Copier la valeur de `B` dans `A`. (Maintenant `A` contient la valeur originale de `B`).
4.  **Instruction 4 :** Copier la valeur de `temp` dans `B`. (Maintenant `B` contient la valeur originale de `A`).

Après ces quatre instructions exécutées séquentiellement, les valeurs de `A` et `B` sont correctement échangées. Cet exemple met en lumière l'importance cruciale de l'ordre dans une séquence : modifier l'ordre des instructions 2, 3 et 4 entraînerait un résultat incorrect.

La séquence est la base de tout algorithme. Même les algorithmes les plus complexes, qui intègrent des conditions et des boucles, sont fondamentalement des assemblages de séquences. Chaque bloc d'instructions à l'intérieur d'une condition ou d'une boucle est lui-même une séquence. La compréhension approfondie de cette structure élémentaire est donc indispensable avant de pouvoir aborder des concepts plus avancés de contrôle de flux. Elle garantit que les opérations sont effectuées dans un ordre logique et prévisible, ce qui est la pierre angulaire de la fiabilité de tout système informatique.
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