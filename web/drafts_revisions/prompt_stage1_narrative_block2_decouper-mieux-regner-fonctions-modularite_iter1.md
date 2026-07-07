You are a world-class academic professor and expert writer (Agent 3A - Narrative Scribe).
Your task is to write a section of the academic MDX narrative content for the specified lesson.

We are writing the lesson block-by-block.
- This is Block 2 out of 3.
- You MUST write the content for the following sections:
* Heading: "## L'Importance de la Modularité et de la Réutilisabilité"
  Instructions: "Expliquer pourquoi la modularité est cruciale en développement logiciel. Aborder les avantages comme la simplification du débogage, la facilité de maintenance, la réutilisabilité du code et la collaboration en équipe. Utiliser des exemples concrets pour montrer l'impact d'un code modulaire versus un code monolithique."
* Heading: "## Mécanismes de Passage de Paramètres"
  Instructions: "Détailler les deux principaux mécanismes de passage de paramètres: par valeur et par référence. Expliquer la différence fondamentale entre les deux, leurs implications sur la modification des données originales et quand utiliser l'un ou l'autre. Fournir des exemples illustratifs pour chaque mécanisme, en soulignant les pièges potentiels."

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
... st une fonction. Elle ne prend pas de paramètres. Elle retourne une valeur de type `REEL` (nombre à virgule flottante), qui est la constante Pi. L'appelant peut utiliser cette valeur dans d'autres calculs : `circonference = 2 * ObtenirValeurDePi() * rayon`.

#### 3. Fonction avec paramètres et valeur de retour

C'est le type de fonction le plus courant, permettant des calculs génériques.


FONCTION CalculerSomme(nombre1 : ENTIER, nombre2 : ENTIER) : ENTIER
    DEBUT
        // Les paramètres formels 'nombre1' et 'nombre2' sont utilisés ici.
        // Ils recevront les valeurs des paramètres actuels lors de l'appel.
        RETOURNER nombre1 + nombre2
    FIN

**Explication** : `CalculerSomme` est une fonction qui prend deux paramètres formels de type `ENTIER` (`nombre1`, `nombre2`) et retourne un `ENTIER`.
**Appel de la fonction** :

ALGORITHME Principal
    VARIABLES
        a, b, resultat : ENTIER
    DEBUT
        a <- 10
        b <- 25
        resultat <- CalculerSomme(a, b) // Ici, 'a' et 'b' sont les paramètres actuels
        ECRIRE "La somme de ", a, " et ", b, " est : ", resultat // Affiche "La somme de 10 et 25 est : 35"

        ECRIRE "La somme de 7 et 12 est : ", CalculerSomme(7, 12) // Les littéraux 7 et 12 sont aussi des paramètres actuels
    FIN

Dans cet exemple, la fonction `CalculerSomme` abstrait l'opération d'addition. L'algorithme principal n'a pas besoin de savoir *comment* l'addition est effectuée, seulement *qu'elle est effectuée* et qu'elle prend deux entiers pour en retourner un.

#### 4. Procédure avec paramètres et sans valeur de retour

Cette procédure prend des informations en entrée pour effectuer une action.


PROCEDURE AfficherCarre(nombre : ENTIER)
    DEBUT
        // Le paramètre formel 'nombre' est utilisé pour le calcul et l'affichage.
        ECRIRE "Le carré de ", nombre, " est : ", nombre * nombre
    FIN

**Explication** : `AfficherCarre` est une procédure qui prend un paramètre formel `nombre` de type `ENTIER`. Elle effectue un calcul (le carré) et une action (afficher le résultat), mais ne retourne pas de valeur.
**Appel de la procédure** :

ALGORITHME Principal
    VARIABLES
        valeur : ENTIER
    DEBUT
        valeur <- 8
        AfficherCarre(valeur) // 'valeur' est le paramètre actuel. Affiche "Le carré de 8 est : 64"
        AfficherCarre(5)      // 5 est le paramètre actuel. Affiche "Le carré de 5 est : 25"
    FIN


Ces exemples démontrent comment les fonctions et procédures permettent de structurer un algorithme en unités logiques. Chaque unité a une responsabilité claire, ce qui rend l'algorithme plus facile à comprendre, à développer et à maintenir. L'abstraction fournie par ces constructions est fondamentale pour gérer la complexité inhérente aux problèmes algorithmiques réels. En masquant les détails d'implémentation derrière une interface simple (la signature), elles encouragent une pensée modulaire et hiérarchique, essentielle pour la conception de systèmes informatiques robustes.
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