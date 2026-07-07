Après avoir exploré la genèse historique et théorique de l'algorithmique, il est impératif de définir les concepts fondamentaux qui sous-tendent cette discipline. Au cœur de toute démarche algorithmique se trouve la notion de "problème".

## Qu'est-ce qu'un Problème en Informatique?

En informatique, un **problème** ne désigne pas une simple difficulté ou un obstacle, mais plutôt une question bien définie à laquelle il faut apporter une réponse ou une tâche spécifique à accomplir, généralement à partir d'un ensemble de données d'entrée pour produire un ensemble de données de sortie. Contrairement aux problèmes du monde réel qui sont souvent ambigus et multifacettes, un problème informatique doit être formulé avec une clarté et une précision absolues pour pouvoir être résolu par une machine.

L'identification et la formalisation d'un problème sont des étapes cruciales, souvent sous-estimées, qui précèdent toute tentative de conception algorithmique. Elles se décomposent en plusieurs phases :

1.  **Identification :** Il s'agit de reconnaître le besoin d'une solution computationnelle. Cela peut être le tri d'une liste d'éléments, la recherche d'une information spécifique, l'optimisation d'un processus, ou la modélisation d'un phénomène.
2.  **Analyse :** Cette phase consiste à comprendre en profondeur le problème. Quels sont les objectifs ? Quelles sont les données d'entrée disponibles et sous quelle forme ? Quelles sont les données de sortie attendues ? Quelles sont les contraintes (temps d'exécution, mémoire disponible, précision requise) ? Il est essentiel de distinguer les aspects pertinents des détails superflus.
3.  **Formalisation :** C'est l'étape où le problème est traduit en un énoncé précis et non ambigu, souvent en termes mathématiques ou logiques. Cela implique de :
    *   **Spécifier les entrées :** Définir le type, la plage de valeurs, la structure et la quantité des données que l'algorithme recevra. Par exemple, pour un problème de tri, l'entrée est une liste finie d'éléments comparables (nombres, chaînes de caractères).
    *   **Spécifier les sorties :** Décrire précisément ce que l'algorithme doit produire. Pour le tri, la sortie est la même liste d'éléments, mais ordonnée selon un critère défini (croissant, décroissant).
    *   **Énoncer la relation entre entrées et sorties :** Définir la propriété que la sortie doit satisfaire par rapport à l'entrée. Dans le cas du tri, la sortie doit être une permutation de l'entrée et ses éléments doivent être ordonnés.
    *   **Définir les contraintes :** Préciser les limites de temps, d'espace mémoire, ou d'autres ressources.

Une formalisation rigoureuse garantit que le problème est bien compris et qu'une solution correcte peut être vérifiée. Un problème mal défini est, par essence, insoluble de manière fiable par un algorithme. C'est la pierre angulaire sur laquelle repose l'efficacité de toute solution informatique.

[[WIDGET:Mermaid:problem_formalization_flow]]
mermaid
graph TD
    A[Problème du Monde Réel] --> B{Identification du Besoin};
    B --> C[Analyse du Problème];
    C --> D[Spécification des Entrées];
    C --> E[Spécification des Sorties];
    C --> F[Définition des Contraintes];
    D & E & F --> G[Formalisation du Problème];
    G --> H[Problème Informatique Bien Défini];
    H --> I[Conception de l'Algorithme];
    style A fill:#f9f,stroke:#333,stroke-width:2px;
    style H fill:#bbf,stroke:#333,stroke-width:2px;
    linkStyle 0,1,2,3,4,5,6,7,8 stroke:#333,stroke-width:1.5px,fill:none;
    linkStyle 6 stroke-dasharray: 5 5;
    linkStyle 7 stroke-dasharray: 5 5;
    linkStyle 8 stroke-dasharray: 5 5;
    classDef default fill:#fff,stroke:#333,stroke-width:1px;
    classDef highlight fill:#bbf,stroke:#333,stroke-width:2px;

## L'Algorithme: Définition, Caractéristiques et Exemples Simples

Une fois le problème clairement formalisé, l'étape suivante consiste à concevoir une méthode pour le résoudre : c'est le rôle de l'algorithme.

Un **algorithme** est une suite finie et ordonnée d'instructions non ambiguës et exécutables, conçue pour résoudre un problème spécifique ou une classe de problèmes. Il s'agit d'une procédure pas à pas qui, partant d'un état initial et de données d'entrée, aboutit à un état final et à des données de sortie après un nombre fini d'opérations. Le terme tire son origine du mathématicien perse du IXe siècle <RealPerson>Al-Khwarizmi</RealPerson>, dont les travaux ont introduit les chiffres indiens et les méthodes de calcul en Occident.

Pour qu'une séquence d'instructions puisse être qualifiée d'algorithme, elle doit posséder plusieurs caractéristiques fondamentales :

*   **Finitude :** L'algorithme doit se terminer après un nombre fini d'étapes, quel que soit le jeu de données d'entrée valide. Il ne doit pas boucler indéfiniment.
*   **Déterminisme :** Pour un même ensemble de données d'entrée, l'algorithme doit toujours produire le même résultat et suivre la même séquence d'opérations. Chaque étape doit être définie de manière unique, sans laisser de place à l'interprétation ou au choix arbitraire.
*   **Effectivité (ou Efficacité des étapes) :** Chaque instruction de l'algorithme doit être suffisamment simple et fondamentale pour pouvoir être exécutée en un temps fini, même par un opérateur humain avec des moyens limités (comme du papier et un crayon). Les opérations complexes doivent être décomposées en opérations élémentaires.
*   **Entrées (Inputs) :** L'algorithme doit accepter zéro ou plusieurs données d'entrée, qui sont les informations initiales sur lesquelles il va opérer. Ces entrées doivent être spécifiées en termes de type et de quantité.
*   **Sorties (Outputs) :** L'algorithme doit produire une ou plusieurs données de sortie, qui représentent la solution au problème. La relation entre les entrées et les sorties doit être clairement définie.
*   **Généralité :** Idéalement, un algorithme ne résout pas un cas particulier d'un problème, mais une classe entière de problèmes. Par exemple, un algorithme de tri doit pouvoir trier n'importe quelle liste d'éléments comparables, pas seulement une liste spécifique.

Pour illustrer ces concepts, considérons quelques exemples intuitifs et quotidiens :

*   **Une recette de cuisine :** C'est un algorithme pour préparer un plat. Les ingrédients sont les entrées, les étapes sont les instructions (mélanger, cuire, etc.), et le plat final est la sortie. Elle est finie (le plat est prêt à un moment donné), déterministe (si on suit les étapes, on obtient le même plat), et les instructions sont effectives (chacun peut les réaliser).
*   **Un itinéraire routier (GPS) :** Partant d'un point A et d'un point B (entrées), le GPS fournit une séquence d'instructions (tourner à gauche, prendre la sortie) pour atteindre la destination (sortie). L'itinéraire est fini et, pour des conditions de trafic données, déterministe.
*   **L'algorithme d'Euclide pour le calcul du Plus Grand Commun Diviseur (PGCD) :** C'est un exemple classique en mathématiques. Étant donné deux nombres entiers positifs (entrées), il fournit une séquence d'opérations (divisions successives avec reste) qui se termine toujours en produisant leur PGCD (sortie).

Ces exemples, bien que simples, encapsulent l'essence de l'algorithmique : une méthode systématique et rigoureuse pour transformer des entrées en sorties désirées, en suivant des règles précises. La conception d'algorithmes efficaces est donc l'art de traduire un problème formalisé en une séquence d'instructions qui respecte ces propriétés fondamentales.