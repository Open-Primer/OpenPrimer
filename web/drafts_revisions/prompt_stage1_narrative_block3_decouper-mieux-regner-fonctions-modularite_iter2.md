You are a world-class academic professor and expert writer (Agent 3A - Narrative Scribe).
Your task is to write a section of the academic MDX narrative content for the specified lesson.

We are writing the lesson block-by-block.
- This is Block 3 out of 3.
- You MUST write the content for the following sections:
* Heading: "## Concevoir des Algorithmes Modulaires"
  Instructions: "Guider l'étudiant sur la manière de décomposer un problème complexe en sous-problèmes gérables, chacun pouvant être résolu par une fonction. Présenter des principes de bonne conception de fonctions (cohérence, faible couplage, forte cohésion). Proposer une méthodologie pour la conception d'algorithmes modulaires et leur intégration."
* Heading: "## Conclusion: Maîtriser l'Art du Découpage"
  Instructions: "Récapituler les points clés abordés dans la leçon: la définition et l'utilité des fonctions, l'importance de la modularité et de la réutilisabilité, les mécanismes de passage de paramètres et les principes de conception. Souligner l'impact de ces concepts sur la qualité, l'efficacité et la maintenabilité du code. Ouvrir sur les prochaines étapes ou des concepts plus avancés liés à l'organisation du code."

---

### GLOBAL CONTEXT:
- Course Name: "Algorithmique fondamentale"
- Academic Level: "University Year 1 / Bachelor 1st Year (L1)"
- Lesson Title: "Découper pour mieux régner: Fonctions et modularité"
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
... arle alors de passage par référence constante dans certains langages).

**Exemple Illustratif (Pseudocode)**:

Pour indiquer un passage par référence en pseudocode, on utilise souvent le mot-clé `REF` ou `&` (comme en C++).

pseudocode
ALGORITHME Principal
    VARIABLES
        valeur1, valeur2 : ENTIER
    DEBUT
        valeur1 <- 5
        valeur2 <- 10
        ECRIRE "Avant l'échange : valeur1 = ", valeur1, ", valeur2 = ", valeur2 // Affiche 5, 10
        EchangerParReference(REF valeur1, REF valeur2) // 'REF' indique le passage par référence
        ECRIRE "Après l'échange : valeur1 = ", valeur1, ", valeur2 = ", valeur2  // Affiche 10, 5
    FIN

PROCEDURE EchangerParReference(REF a : ENTIER, REF b : ENTIER)
    VARIABLES
        temp : ENTIER
    DEBUT
        ECRIRE "Dans la procédure (avant échange) : a = ", a, ", b = ", b // Affiche 5, 10
        temp <- a
        a <- b // Modifie la variable originale 'valeur1'
        b <- temp // Modifie la variable originale 'valeur2'
        ECRIRE "Dans la procédure (après échange) : a = ", a, ", b = ", b // Affiche 10, 5
    FIN

Ici, `EchangerParReference` reçoit les références de `valeur1` et `valeur2`. Les modifications de `a` et `b` dans la procédure affectent directement `valeur1` et `valeur2` dans l'algorithme principal.

**Pièges Potentiels**:
*   **Effets de bord (Side Effects)**: Le passage par référence peut introduire des effets de bord difficiles à suivre. Une fonction peut modifier des variables de l'appelant sans que cela soit immédiatement évident à la lecture du code appelant, rendant le programme plus difficile à comprendre, à déboguer et à maintenir.
*   **Aliasing**: Si plusieurs références pointent vers la même donnée, des modifications via une référence peuvent avoir des conséquences inattendues sur d'autres références.
*   **Sécurité**: Moins sûr que le passage par valeur car il expose les données originales à la modification.

### Quand choisir l'un ou l'autre ?

Le choix entre passage par valeur et passage par référence dépend de l'intention de la fonction et de la nature des données :
*   **Par valeur**: Privilégiez-le par défaut pour les types simples et quand la fonction ne doit pas modifier l'original. C'est le mécanisme le plus sûr et le plus prévisible.
*   **Par référence**: Utilisez-le spécifiquement quand la fonction *doit* modifier l'original (par exemple, une procédure d'échange, ou une fonction qui remplit une structure de données) ou pour optimiser la performance en évitant des copies coûteuses de grandes structures. Dans ce dernier cas, si la modification n'est pas souhaitée, certains langages offrent le concept de "référence constante" pour combiner l'efficacité du passage par référence avec la sécurité de la non-modification.

Comprendre ces mécanismes est essentiel pour écrire des algorithmes corrects, efficaces et faciles à maintenir, en particulier lorsque vous travaillez avec des structures de données complexes ou que vous devez gérer des effets de bord.
"""

---

### TARGET BLOCK LENGTH AND DEPTH:
- Target word count for the entire lesson is 3000 to 4500 words.
- This block of text must contain between 1000 and 1500 words. Write a comprehensive, detailed academic exposition matching this length constraint. Avoid summarizing or cutting content short.

---

⚠️ CRITICAL MARKUP & XML/JSX COMPLIANCE RULES (MDX SAFETY MANDATE):
1. ABSOLUTE PROHIBITION ON RAW INTERACTIVE OR CUSTOM JSX/HTML TAGS. Only Hover-Cards like <ConceptLink>, <RealPerson>, etc. are allowed inline in prose. Use [[WIDGET:id]] anchors for everything else.
2. NO RAW HTML FOR LISTS. Use Markdown bullets/numbering.
3. NO LITERAL CURLY BRACES in plain text. Wrap in LaTeX or backticks.
4. NO STRAY import/export statements.
5. NO WIDGET ANCHORS INSIDE LISTS OR TABLES. Place them on separate blank lines.
6. Captions of images or Mermaid diagrams must NOT contain figure prefixes (like 'Figure 1:', 'Image A -'). CAPTIONS MUST ONLY contain the descriptive prose.

7. INTERACTIVE WIDGETS AND MEDIA INTEGRATION: You must target inserting between 1 and 2 (at least 1) custom interactive widget anchors [[WIDGET:Type:ID]] on separate blank lines in your text.
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


🚨 CRITIQUE FROM PREVIOUS ATTEMPT 🚨
The critique agent rejected your previous attempt for this block. Correct the following issues:
"The text is well-written, academically dense, and covers the topic comprehensively. The word count is appropriate, and the language is suitable. However, there is one minor issue: the caption for the Mermaid diagram includes a figure prefix "Diagramme 1 :", which violates the instruction "No figure prefixes like 'Figure 1:'". Please remove "Diagramme 1 :" from the caption. All other checkpoints, including widget placement and conclusion structure, are met."

Write the content for the specified sections. Return ONLY the markdown content. Do NOT wrap the response in markdown code blocks.