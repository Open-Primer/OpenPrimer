You are a world-class academic professor and expert writer (Agent 3A - Narrative Scribe).
Your task is to write a section of the academic MDX narrative content for the specified lesson.

We are writing the lesson block-by-block.
- This is Block 3 out of 4.
- You MUST write the content for the following sections:
* Heading: "## Les boucles 'Pour'"
  Instructions: "Décrire la boucle 'Pour' (For) comme une structure itérative adaptée aux répétitions avec un nombre connu d'itérations ou pour parcourir des séquences. Comparer 'Pour' et 'Tant que'. Illustrer avec des exemples (ex: somme des N premiers entiers, affichage d'une table de multiplication)."
* Heading: "## Exercices de conception d'algorithmes"
  Instructions: "Proposer une série d'exercices pratiques où les étudiants devront combiner les séquences, conditions et boucles pour résoudre des problèmes algorithmiques simples. Mettre l'accent sur la décomposition du problème et la logique de construction."

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
...  la suivante :


Tant que (condition est vraie) Faire
    // Bloc d'instructions à répéter
    Instruction X
    Instruction Y
Fin Tant que
// L'exécution continue ici


**Exemple de boucle "Tant que" : Compter jusqu'à N**
Supposons que nous voulions afficher les nombres de 1 à 5.


Algorithme CompterJusquaCinq
  Variables : compteur : Entier
  Début
    compteur <- 1 // Initialisation du compteur
    Tant que (compteur <= 5) Faire
      Afficher compteur
      compteur <- compteur + 1 // Incrémentation du compteur
    Fin Tant que
    Afficher "Comptage terminé."
  Fin


Dans cet exemple, la variable `compteur` est initialisée à 1. La condition `compteur <= 5` est vérifiée.
1.  `compteur` est 1 (Vrai) : Affiche 1, `compteur` devient 2.
2.  `compteur` est 2 (Vrai) : Affiche 2, `compteur` devient 3.
3.  `compteur` est 3 (Vrai) : Affiche 3, `compteur` devient 4.
4.  `compteur` est 4 (Vrai) : Affiche 4, `compteur` devient 5.
5.  `compteur` est 5 (Vrai) : Affiche 5, `compteur` devient 6.
6.  `compteur` est 6 (Faux) : La boucle se termine.
Le programme affiche ensuite "Comptage terminé.".

Un aspect crucial de la boucle "Tant que" est la **condition d'arrêt**. Le corps de la boucle doit contenir au moins une instruction qui, à un moment donné, rendra la condition fausse. Si cette condition n'est jamais rendue fausse, la boucle ne se terminera jamais, conduisant à une **boucle infinie**. Une boucle infinie consomme indéfiniment les ressources du système et est une erreur de programmation courante. Dans l'exemple précédent, si nous avions oublié l'instruction `compteur <- compteur + 1`, la condition `compteur <= 5` serait toujours vraie (car `compteur` resterait toujours à 1), et le programme afficherait indéfiniment le nombre 1.

**Exemple de boucle "Tant que" : Saisie de valeur valide**
Un autre usage courant est la validation d'entrée utilisateur, où l'on demande à l'utilisateur de saisir une valeur jusqu'à ce qu'elle respecte un certain critère.


Algorithme SaisieValide
  Variables : note : Entier
  Début
    note <- -1 // Initialisation à une valeur invalide pour entrer dans la boucle
    Tant que (note < 0 OU note > 20) Faire
      Afficher "Veuillez entrer une note entre 0 et 20 :"
      Lire note
    Fin Tant que
    Afficher "La note saisie est : ", note
  Fin


Ici, la boucle continue de demander une note tant que la valeur saisie n'est pas comprise entre 0 et 20. Dès qu'une note valide est entrée, la condition `(note < 0 OU note > 20)` devient fausse, et la boucle s'arrête.

La boucle "Tant que" est particulièrement utile lorsque le nombre d'itérations n'est pas connu à l'avance, mais dépend d'une condition dynamique qui évolue au fur et à mesure de l'exécution de l'algorithme. Elle offre une grande flexibilité pour gérer des scénarios où la répétition est conditionnelle à l'état du système. Comprendre son mécanisme et, surtout, la nécessité d'une condition d'arrêt bien définie est essentiel pour écrire des algorithmes robustes et efficaces.
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