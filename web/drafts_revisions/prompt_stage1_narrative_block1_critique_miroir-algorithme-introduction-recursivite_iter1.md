You are the Narrative Critic Agent (Agent 4A). Review the generated block of text for the lesson:
---
## Introduction: Le miroir de l'algorithme

Bienvenue dans cette leçon consacrée à l'un des concepts les plus élégants et puissants de l'informatique : la récursivité. Le titre, "Le miroir de l'algorithme", n'est pas choisi au hasard. Il évoque l'idée d'une réflexion, d'une structure qui se reproduit en elle-même, un peu comme une image se reflétant à l'infini entre deux miroirs parallèles, ou une poupée russe qui en contient une plus petite, et ainsi de suite. En programmation, la récursivité est une technique de résolution de problèmes où une fonction s'appelle elle-même pour accomplir une tâche. Plutôt que de résoudre un problème de manière itérative, c'est-à-dire en répétant une série d'instructions jusqu'à ce qu'une condition soit remplie, la récursivité aborde le problème en le décomposant en sous-problèmes plus petits et similaires, jusqu'à atteindre une forme triviale qui peut être résolue directement.

L'importance de la récursivité en informatique est capitale. Elle ne se limite pas à une simple curiosité intellectuelle ; elle est une pierre angulaire pour la compréhension et la conception de nombreux algorithmes et structures de données fondamentaux. Des algorithmes de tri comme le <ConceptLink slug="quicksort">Quicksort</ConceptLink> ou le <ConceptLink slug="mergesort">Mergesort</ConceptLink>, aux parcours d'arbres et de graphes, en passant par la génération de fractales ou l'évaluation d'expressions mathématiques, la récursivité offre souvent une solution plus concise, plus lisible et plus intuitive que son équivalent itératif. Elle est intrinsèquement liée à la pensée inductive et à la preuve par récurrence en mathématiques, offrant un pont naturel entre ces deux disciplines. Maîtriser la récursivité, c'est acquérir une nouvelle perspective sur la façon d'aborder la complexité algorithmique et de structurer la logique de vos programmes.

Au cours de cette leçon, nous allons explorer les fondements de la récursivité. Nous commencerons par définir formellement ce concept et en décomposer les éléments essentiels : le cas de base et l'appel récursif. Nous illustrerons ces principes avec des analogies simples et des exemples concrets pour solidifier votre compréhension. Par la suite, nous aborderons des exemples classiques de problèmes résolus par récursivité, analyserons les avantages et les inconvénients de cette approche, et discuterons des pièges courants à éviter. Enfin, nous verrons comment la récursivité peut être transformée en itération et vice-versa, et comment elle s'intègre dans des paradigmes de conception algorithmique plus larges. Préparez-vous à plonger dans ce monde où les fonctions se regardent dans le miroir pour résoudre des problèmes complexes.

## Principes Fondamentaux de la Récursivité

La récursivité est une technique de programmation où une fonction ou une procédure s'appelle elle-même, directement ou indirectement, pour résoudre un problème. C'est une méthode de définition d'une entité en termes d'elle-même. Pour qu'une telle définition soit utile et ne conduise pas à une boucle infinie, elle doit toujours inclure une condition d'arrêt et une progression vers cette condition.

Formellement, une fonction récursive est caractérisée par deux composants essentiels :

1.  **Le Cas de Base (ou Condition d'Arrêt)** : C'est la condition qui met fin à la séquence d'appels récursifs. Le cas de base représente la version la plus simple du problème, celle qui peut être résolue directement sans nécessiter d'autres appels à la fonction récursive. Sans un cas de base correctement défini et atteignable, la fonction s'appellerait indéfiniment, conduisant à une erreur d'exécution (généralement un débordement de pile, ou "stack overflow"). C'est le point d'ancrage de la récursivité, le "sol" sur lequel la chaîne d'appels se repose.

2.  **L'Appel Récursif (ou Étape Récursive)** : C'est l'étape où la fonction s'appelle elle-même, mais avec un ensemble de paramètres modifié. L'objectif de l'appel récursif est de décomposer le problème original en un ou plusieurs sous-problèmes plus petits, mais de même nature. Crucialement, chaque appel récursif doit rapprocher le problème de son cas de base. Si les paramètres ne convergent pas vers le cas de base, la récursivité ne s'arrêtera jamais. La solution au problème original est alors construite à partir des solutions des sous-problèmes.

Pour mieux saisir ces concepts, utilisons quelques analogies simples :

*   **Les Poupées Russes (Matriochkas)** : Imaginez une poupée russe. Pour l'ouvrir, vous la séparez en deux moitiés et trouvez une poupée plus petite à l'intérieur. Vous répétez ce processus avec la poupée plus petite, et ainsi de suite, jusqu'à ce que vous trouviez la plus petite poupée qui ne contient rien.
    *   **Cas de base** : La plus petite poupée, qui ne peut plus être ouverte.
    *   **Appel récursif** : Ouvrir une poupée pour en trouver une plus petite à l'intérieur. Chaque ouverture vous rapproche de la plus petite poupée.

*   **Le Dictionnaire** : Supposons que vous cherchiez un mot dans un dictionnaire.
    *   **Cas de base** : Si le dictionnaire ne contient qu'une seule page et que le mot est sur cette page, vous l'avez trouvé.
    *   **Appel récursif** : Si le dictionnaire a plusieurs pages, ouvrez-le au milieu. Si le mot est avant le milieu, cherchez-le dans la première moitié. Sinon, cherchez-le dans la seconde moitié. Vous répétez le processus sur une portion plus petite du dictionnaire, vous rapprochant ainsi du cas de base.

*   **Le Problème de la Tour de Hanoï** : C'est un exemple classique qui illustre la puissance de la récursivité. Pour déplacer `n` disques d'une tour source à une tour destination en utilisant une tour auxiliaire, en respectant les règles (un seul disque à la fois, jamais un disque plus grand sur un plus petit) :
    1.  Déplacer `n-1` disques de la source à l'auxiliaire (appel récursif).
    2.  Déplacer le plus grand disque (le `n`-ième) de la source à la destination (cas de base pour ce disque).
    3.  Déplacer `n-1` disques de l'auxiliaire à la destination (appel récursif).
    Le cas de base est trivial : si `n=1`, il suffit de déplacer le disque directement de la source à la destination.

La récursivité est fondamentalement une manière de penser à la résolution de problèmes en termes de "si je peux résoudre une version plus petite du même problème, alors je peux résoudre le problème actuel". C'est une approche "diviser pour régner" où la division est le fait de s'appeler soi-même avec des paramètres réduits.

Pour visualiser le flux d'exécution d'une fonction récursive, nous pouvons utiliser un diagramme simple :

[[WIDGET:Mermaid:recursive_flow]]
mermaid
graph TD
    A[Début Fonction Récursive(param)] --> B{param atteint cas de base?};
    B -- Oui --> C[Exécuter Cas de Base];
    C --> D[Retourner Résultat Cas de Base];
    B -- Non --> E[Préparer Appel Récursif];
    E --> F[Appel Récursif(param_modifié)];
    F --> G[Recevoir Résultat Sous-Problème];
    G --> H[Combiner Résultat et Retourner];
    D --> I[Fin];
    H --> I[Fin];


Ce diagramme illustre le cheminement logique : la fonction vérifie d'abord si elle est dans le cas le plus simple. Si oui, elle le résout directement. Sinon, elle transforme le problème en une version plus petite et se rappelle elle-même pour résoudre cette version plus petite, puis utilise le résultat pour construire la solution finale. C'est cette élégance et cette capacité à exprimer des solutions complexes de manière concise qui font de la récursivité un outil indispensable en algorithmique.
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