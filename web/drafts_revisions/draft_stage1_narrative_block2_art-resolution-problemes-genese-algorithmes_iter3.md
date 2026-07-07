## Qu'est-ce qu'un Problème en Informatique?

Après avoir exploré la genèse historique et philosophique de la notion d'algorithme, il est impératif de définir l'objet même que ces séquences d'instructions visent à résoudre : le problème. En informatique, un « problème » n'est pas une simple difficulté ou une question vague. Il s'agit d'une tâche bien définie, caractérisée par un ensemble d'entrées (données initiales) et un ensemble de sorties (résultats désirés) qui doivent satisfaire certaines propriétés ou relations avec les entrées. La résolution d'un problème informatique implique la transformation systématique de ces entrées en sorties au moyen d'un processus calculable.

L'identification d'un problème informatique commence par la reconnaissance d'un besoin ou d'une tâche qui peut être automatisée ou optimisée par le calcul. Cela peut aller de la simple recherche d'une information dans une base de données à la prédiction météorologique complexe. Une fois identifié, le problème doit être analysé en profondeur. Cette phase d'analyse consiste à comprendre les exigences, les contraintes et les spécifications. Quelles sont les données disponibles ? Sous quelle forme ? Quels sont les résultats attendus ? Quelles sont les limites de temps ou de ressources (mémoire, puissance de calcul) ? Par exemple, trier une liste de nombres est un problème ; l'analyse pourrait révéler que la liste est très grande, que les nombres sont des entiers ou des flottants, et que le tri doit être effectué en un temps minimal.

La phase la plus critique, avant toute tentative de résolution, est la formalisation du problème. Il s'agit de traduire le problème du langage naturel, souvent ambigu, en une description précise et non ambiguë, compréhensible par une machine ou un système formel. Cette formalisation implique généralement :
1.  **La définition de l'ensemble des entrées possibles (domaine) :** Quelles sont les caractéristiques des données que l'algorithme recevra ? S'agit-il de nombres entiers, de chaînes de caractères, de structures de données spécifiques ? Quelles sont leurs plages de valeurs ou leurs tailles maximales ?
2.  **La spécification des propriétés des sorties désirées (codomaine) :** Que doit produire l'algorithme en fonction des entrées ? Comment les sorties sont-elles liées aux entrées ? Par exemple, pour un problème de tri, la sortie doit être une permutation de l'entrée où les éléments sont ordonnés selon une relation donnée.
3.  **L'énoncé des contraintes et des préconditions :** Y a-t-il des conditions que les entrées doivent satisfaire pour que le problème soit bien défini ou que la solution soit valide ? Y a-t-il des limites sur les ressources utilisables ?

Un problème bien formalisé est la pierre angulaire d'une solution algorithmique réussie. Sans cette clarté, toute tentative de conception d'algorithme risque d'être inefficace, incorrecte, ou de ne pas répondre aux besoins réels. C'est cette rigueur qui distingue l'informatique des approches plus empiriques.

[[WIDGET:Mermaid:problem_formalization_flow]]
mermaid
graph TD
    A[Problème du Monde Réel] --> B{Identification du besoin};
    B --> C[Analyse des exigences];
    C --> D[Définition des Entrées (Domaine)];
    D --> E[Définition des Sorties (Codomaine)];
    E --> F[Spécification des Contraintes];
    F --> G[Problème Formalisé et Non Ambigü];
    G --> H[Conception de l'Algorithme];
    H --> I[Résolution];
    I --> J[Vérification et Validation];
    J --> A;
    style A fill:#f9f,stroke:#333,stroke-width:2px
    style G fill:#bbf,stroke:#333,stroke-width:2px
    style H fill:#dfd,stroke:#333,stroke-width:2px
    style I fill:#dfd,stroke:#333,stroke-width:2px
    style J fill:#dfd,stroke:#333,stroke-width:2px
    linkStyle 7 stroke-dasharray: 5 5;
    linkStyle 8 stroke-dasharray: 5 5;
    linkStyle 9 stroke-dasharray: 5 5;
    linkStyle 10 stroke-dasharray: 5 5;
    linkStyle 11 stroke-dasharray: 5 5;
    linkStyle 12 stroke-dasharray: 5 5;
    linkStyle 13 stroke-dasharray: 5 5;
    linkStyle 14 stroke-dasharray: 5 5;
    linkStyle 15 stroke-dasharray: 5 5;
    linkStyle 16 stroke-dasharray: 5 5;
    linkStyle 17 stroke-dasharray: 5 5;
    linkStyle 18 stroke-dasharray: 5 5;
    linkStyle 19 stroke-dasharray: 5 5;

## L'Algorithme: Définition, Caractéristiques et Exemples Simples

Une fois le problème clairement défini et formalisé, la prochaine étape est de concevoir une méthode pour le résoudre. C'est là qu'intervient l'algorithme. Un algorithme est une suite finie et ordonnée d'instructions non ambiguës, conçue pour résoudre un problème spécifique ou pour accomplir une tâche donnée. Il s'agit, en essence, d'une procédure pas à pas qui, partant d'un état initial et d'un ensemble de données d'entrée, aboutit à un état final et à un ensemble de données de sortie, après un nombre fini d'étapes.

Les caractéristiques fondamentales qui définissent un algorithme sont les suivantes, comme l'ont souligné des pionniers tels que Donald Knuth et les auteurs des références [ref1], [ref2], [ref5] :

1.  **Finitude (Finiteness) :** Un algorithme doit toujours se terminer après un nombre fini d'étapes. Chaque étape doit également prendre un temps fini. Cette propriété est cruciale car un processus qui ne se termine jamais n'est pas un algorithme au sens strict.
2.  **Déterminisme (Definiteness/Determinism) :** Chaque instruction doit être précise et non ambiguë. Pour des entrées données, l'algorithme doit toujours produire la même séquence d'opérations et le même résultat. Il n'y a pas de place pour l'interprétation subjective. (Il existe des algorithmes probabilistes, mais le concept fondamental reste le déterminisme des opérations individuelles).
3.  **Entrées (Input) :** Un algorithme doit accepter zéro ou plusieurs entrées, qui sont les quantités fournies au début de l'exécution. Ces entrées sont prises dans l'ensemble des données formalisées lors de la définition du problème.
4.  **Sorties (Output) :** Un algorithme doit produire une ou plusieurs sorties, qui sont les quantités ayant une relation spécifiée avec les entrées. Ces sorties représentent la solution au problème.
5.  **Efficacité (Effectiveness) :** Chaque opération ou instruction de l'algorithme doit être suffisamment simple et fondamentale pour pouvoir être exécutée en principe par une personne avec un crayon et du papier en un temps fini. Cela garantit que l'algorithme est "calculable" et non une simple abstraction théorique impossible à réaliser.

Pour illustrer ces concepts, considérons quelques exemples simples et intuitifs :

*   **Une recette de cuisine :** C'est un algorithme parfait. Elle spécifie une liste d'ingrédients (entrées), une séquence ordonnée d'étapes (mélanger, cuire à telle température pendant tant de temps), des instructions non ambiguës (couper en dés de 2 cm), et elle aboutit à un plat fini (sortie). Si toutes les étapes sont suivies correctement, le résultat est prévisible (déterminisme).
*   **L'itinéraire pour se rendre d'un point A à un point B :** C'est une suite d'instructions (tourner à gauche, prendre la première à droite, continuer sur 2 km) qui, si elles sont suivies, permettent d'atteindre la destination (sortie) à partir d'un point de départ (entrée). C'est fini, ordonné et, idéalement, non ambigu.
*   **L'algorithme d'Euclide pour le calcul du Plus Grand Commun Diviseur (PGCD) :** C'est l'un des plus anciens algorithmes connus. Pour trouver le PGCD de deux nombres entiers positifs `a` et `b`, il stipule de remplacer `a` par `b` et `b` par le reste de la division de `a` par `b`, et de répéter ce processus jusqu'à ce que `b` soit nul. Le PGCD est alors `a`. C'est une séquence finie, déterministe, avec des entrées (les deux nombres) et une sortie (le PGCD).

Ces exemples, bien que non informatiques au sens moderne, incarnent parfaitement les principes fondamentaux qui régissent la conception de tout algorithme, qu'il soit destiné à un humain ou à une machine. La capacité à décomposer un problème complexe en une série d'étapes simples et exécutables est au cœur de la pensée algorithmique.