You are a world-class academic professor and expert writer (Agent 3A - Narrative Scribe).
Your task is to write a section of the academic MDX narrative content for the specified lesson.

We are writing the lesson block-by-block.
- This is Block 2 out of 3.
- You MUST write the content for the following sections:
* Heading: "## Les Listes Chaînées Simples"
  Instructions: "Introduire le concept de liste chaînée comme alternative aux tableaux, en expliquant la notion de nœud (donnée + pointeur vers le suivant). Décrire les opérations fondamentales : insertion en tête/queue/milieu, suppression d'un élément, et parcours de la liste. Mettre en évidence les avantages (taille dynamique, insertions/suppressions efficaces) et les inconvénients (accès séquentiel, surcharge mémoire pour les pointeurs)."
* Heading: "## Les Listes Chaînées Doubles"
  Instructions: "Présenter les listes doublement chaînées comme une amélioration des listes simples. Expliquer l'ajout d'un pointeur vers le nœud précédent. Décrire comment cela simplifie certaines opérations (parcours bidirectionnel, suppression sans connaître le prédécesseur). Comparer brièvement avec les listes simples en termes de complexité des opérations et d'utilisation mémoire."

---

### GLOBAL CONTEXT:
- Course Name: "Algorithmique fondamentale"
- Academic Level: "University Year 1 / Bachelor 1st Year (L1)"
- Lesson Title: "Organiser les données: Tableaux et listes chaînées"
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
...     style I fill:#f9f,stroke:#333,stroke-width:2px
        style J fill:#f9f,stroke:#333,stroke-width:2px
        style K fill:#f9f,stroke:#333,stroke-width:2px
        style L fill:#f9f,stroke:#333,stroke-width:2px

        subgraph "Étape 1: Suppression et Décalage"
            I -- "Supprimer" --> Suppressed(Vide)
            J -- "Décaler vers la gauche" --> J_prime[Élément 3']
            K -- "Décaler vers la gauche" --> K_prime[Élément 4']
            L -- "Décaler vers la gauche" --> L_prime[Élément 5']
        end
        H -- "Pointe vers" --> J_prime
    end

Illustration des opérations d'insertion et de suppression en milieu de tableau, montrant le décalage des éléments et le coût linéaire associé.

### Avantages et Inconvénients des Tableaux

**Avantages:**

*   **Accès Direct (O(1)):** La capacité d'accéder à n'importe quel élément en temps constant est un avantage majeur, rendant les tableaux idéaux pour les scénarios où les lectures fréquentes et aléatoires sont nécessaires.
*   **Efficacité Spatiale:** Les tableaux n'ont pas de surcharge mémoire par élément (contrairement aux listes chaînées qui stockent des pointeurs). Ils utilisent la mémoire de manière compacte.
*   **Localité Spatiale:** Les éléments étant stockés de manière contiguë, les tableaux bénéficient de la localité spatiale des caches processeur. Cela signifie que l'accès à un élément est susceptible de charger les éléments voisins dans le cache, accélérant les accès ultérieurs.
*   **Simplicité:** Leur concept est simple à comprendre et à implémenter.

**Inconvénients:**

*   **Taille Fixe (pour les statiques):** Le principal inconvénient des tableaux statiques est leur taille fixe. Cela peut entraîner un gaspillage de mémoire si le tableau est surdimensionné, ou des erreurs de débordement si le tableau est sous-dimensionné.
*   **Coût des Insertions/Suppressions en Milieu de Tableau (O(n)):** Les opérations d'insertion et de suppression qui ne se produisent pas à la fin du tableau sont coûteuses car elles nécessitent le décalage d'un grand nombre d'éléments.
*   **Coût du Redimensionnement (pour les dynamiques):** Bien que les tableaux dynamiques résolvent le problème de la taille fixe, le redimensionnement implique la copie de tous les éléments vers un nouvel emplacement, ce qui est une opération coûteuse en `O(n)`. Bien que ce coût soit amorti sur une série d'opérations, il peut provoquer des "pauses" perceptibles dans les applications en temps réel.

En résumé, les tableaux sont des structures de données extrêmement puissantes et efficaces pour les collections d'éléments dont la taille est connue ou ne change pas fréquemment, et où l'accès rapide par indice est primordial. Cependant, pour des applications nécessitant des insertions et suppressions fréquentes en milieu de collection, leurs performances peuvent être sous-optimales, ce qui nous amène à considérer d'autres structures linéaires, comme les listes chaînées, qui seront abordées dans la section suivante.
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




Write the content for the specified sections. Return ONLY the markdown content. Do NOT wrap the response in markdown code blocks.