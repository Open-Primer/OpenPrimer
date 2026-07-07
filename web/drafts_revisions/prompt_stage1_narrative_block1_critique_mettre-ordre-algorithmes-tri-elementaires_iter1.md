You are the Narrative Critic Agent (Agent 4A). Review the generated block of text for the lesson:
---
## Introduction aux Algorithmes de Tri

Le tri est l'une des opérations les plus fondamentales et les plus étudiées en informatique. Il consiste à réorganiser une collection d'éléments dans un ordre spécifique, généralement croissant ou décroissant, basé sur une clé de tri définie. Bien que son concept puisse paraître simple, l'efficacité avec laquelle cette tâche est accomplie a des répercussions profondes sur la performance de nombreux systèmes informatiques.

L'importance du tri ne peut être sous-estimée. Un ensemble de données trié facilite considérablement d'autres opérations essentielles. Par exemple, la recherche d'un élément spécifique dans une liste triée peut être effectuée beaucoup plus rapidement qu'dans une liste non triée, notamment grâce à des algorithmes comme la recherche dichotomique. De même, la fusion de deux listes, l'identification de doublons, ou la réalisation d'analyses statistiques sont grandement simplifiées et accélérées lorsque les données sont ordonnées. En réalité, le tri est souvent utilisé comme une sous-routine critique dans des algorithmes plus complexes, servant de pierre angulaire à des solutions élégantes et performantes.

Les applications concrètes des algorithmes de tri sont omniprésentes dans le monde numérique. Dans les systèmes de gestion de bases de données (SGBD), le tri est essentiel pour l'indexation des données, l'optimisation des requêtes et la présentation des résultats aux utilisateurs. Pensez à la manière dont les résultats d'une recherche en ligne sont classés par pertinence, ou comment les produits sur un site de commerce électronique sont affichés par prix, popularité ou nouveauté. Les tableurs utilisent le tri pour organiser les colonnes de données. Les systèmes d'exploitation l'emploient pour planifier les processus, gérer les fichiers et organiser la mémoire. Dans le domaine de l'infographie, le tri est utilisé pour déterminer l'ordre de rendu des objets afin de gérer les problèmes de profondeur. Même dans des domaines comme la bio-informatique, le tri est crucial pour l'analyse de séquences génétiques ou la classification de données biologiques.

Avant de plonger dans les détails des algorithmes spécifiques, il est essentiel de comprendre quelques concepts de base. Un **algorithme de tri** est une procédure qui prend une liste ou un tableau d'éléments et produit une permutation de ces éléments telle que chaque élément est inférieur ou égal (ou supérieur ou égal) à l'élément qui le suit. La **clé de tri** est l'attribut sur lequel les éléments sont comparés et ordonnés. Par exemple, pour une liste d'objets `Personne` ayant des attributs `nom` et `age`, on pourrait trier par `nom` (alphabétiquement) ou par `age` (numériquement).

Deux propriétés importantes caractérisent les algorithmes de tri :
1.  **Tri en place (In-place sorting)** : Un algorithme est dit "en place" s'il ne nécessite qu'une quantité constante ou très faible de mémoire auxiliaire (indépendante de la taille de l'entrée) pour effectuer le tri. Cela signifie que les éléments sont réorganisés directement au sein de la structure de données originale.
2.  **Stabilité (Stability)** : Un algorithme de tri est stable si l'ordre relatif des éléments ayant des clés de tri égales est préservé. Par exemple, si une liste contient deux personnes nommées "Dupont", un tri stable garantira que leur ordre initial dans la liste est maintenu après le tri.

Enfin, l'évaluation de l'efficacité d'un algorithme de tri repose sur son analyse de **complexité**. Nous nous intéresserons principalement à la complexité temporelle (combien de temps l'algorithme prend-il en fonction de la taille de l'entrée, souvent exprimée en notation O-grand) et à la complexité spatiale (combien de mémoire auxiliaire l'algorithme utilise-t-il). Ces métriques nous permettront de comparer et de choisir l'algorithme le plus adapté à un problème donné.

L'objectif de cette leçon est de vous familiariser avec les algorithmes de tri élémentaires. Nous allons explorer leur fonctionnement interne, comprendre comment ils manipulent les données pour atteindre un état ordonné, et analyser leur performance. Cette compréhension des bases est cruciale avant d'aborder des algorithmes de tri plus avancés et plus efficaces.

## Le Tri par Sélection

Le tri par sélection (en anglais, *Selection Sort*) est l'un des algorithmes de tri les plus simples à comprendre et à implémenter. Son principe est intuitif : à chaque étape, il trouve l'élément le plus petit (ou le plus grand, selon l'ordre de tri souhaité) parmi les éléments non encore triés et le place à sa position correcte dans la partie déjà triée du tableau.

### Principe de Fonctionnement

L'algorithme du tri par sélection procède par itérations. Il divise conceptuellement le tableau en deux parties :
1.  Une partie triée, qui se construit progressivement à partir du début du tableau.
2.  Une partie non triée, qui contient les éléments restants.

À chaque itération `i` (allant de `0` à `n-2` pour un tableau de taille `n`) :
1.  L'algorithme parcourt la partie non triée du tableau (du `i`-ème élément jusqu'à la fin) pour trouver l'élément ayant la plus petite valeur.
2.  Une fois l'élément minimum trouvé, il est échangé avec l'élément situé à la position `i`.
3.  Après cet échange, l'élément à la position `i` est garanti d'être le plus petit parmi les `i+1` premiers éléments, et il est considéré comme faisant partie de la section triée. La partie triée s'étend donc d'un élément.

Ce processus est répété jusqu'à ce que l'avant-dernier élément soit placé correctement. Le dernier élément sera alors automatiquement à sa place.

### Pseudo-code Détaillé

Voici le pseudo-code de l'algorithme du tri par sélection pour trier un tableau `A` de taille `n` dans l'ordre croissant :

pseudo-code
Fonction TriParSelection(tableau A)
  n = longueur(A)

  // Parcourir tous les éléments du tableau
  Pour i de 0 à n - 2 faire
    // Trouver l'indice du plus petit élément dans la partie non triée A[i...n-1]
    min_idx = i

    Pour j de i + 1 à n - 1 faire
      Si A[j] < A[min_idx] alors
        min_idx = j
      Fin Si
    Fin Pour

    // Échanger l'élément trouvé avec l'élément courant (A[i])
    // si l'élément courant n'est pas déjà le plus petit
    Si min_idx != i alors
      temp = A[i]
      A[i] = A[min_idx]
      A[min_idx] = temp
    Fin Si
  Fin Pour
Fin Fonction


[[WIDGET:Mermaid:tri_selection_flow]]
mermaid
graph TD
    A[Début TriParSelection] --> B{Pour i de 0 à n-2};
    B -- Vrai --> C[min_idx = i];
    C --> D{Pour j de i+1 à n-1};
    D -- Vrai --> E{A[j] < A[min_idx]?};
    E -- Vrai --> F[min_idx = j];
    F --> D;
    E -- Faux --> D;
    D -- Faux --> G{min_idx != i?};
    G -- Vrai --> H[Échanger A[i] et A[min_idx]];
    H --> B;
    G -- Faux --> B;
    B -- Faux --> I[Fin TriParSelection];

<figcaption>Diagramme de flux simplifié de l'algorithme de Tri par Sélection.</figcaption>

### Illustration Pas à Pas

Considérons un tableau `A = [64, 25, 12, 22, 11]` et appliquons le tri par sélection.

| Étape | `i` | `j` | `min_idx` | Tableau `A` (avant échange) | Action | Tableau `A` (après échange) |
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
---

Check checkpoints:
1. Zero-placeholders.
2. Accurate academic density and level-appropriate language.
3. Strict MDX/JSX safety (no raw custom component tags, no wrapped verbs in hover-cards).
4. No figure prefixes like "Figure 1:" in visual captions.
5. Word count: The text block must be substantial, containing approximately 750 to 1125 words. Reject if it is too brief, skeletal, or lacks academic depth.
6. Interactive widgets: Ensure between 1 and 1 (at least 1) custom interactive widget anchors [[WIDGET:Type:ID]] are inserted correctly on separate blank lines in this block.


Return ONLY a valid JSON object matching blockNarrativeAuditSchema:
```json
{
  "approved": boolean,
  "critique": "detailed feedback explaining what to fix, or empty if approved"
}
```
Do NOT wrap your JSON response in markdown code blocks.