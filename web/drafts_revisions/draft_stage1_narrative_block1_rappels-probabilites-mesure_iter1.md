## Introduction

Ce cours de Master 1 en Finance Quantitative vise à vous équiper des outils mathématiques fondamentaux nécessaires à la compréhension et à la modélisation des marchés financiers. Avant d'aborder les concepts avancés de calcul stochastique et de modélisation des instruments financiers complexes, il est impératif de consolider vos bases en théorie des probabilités et de la mesure. Cette leçon introductive est dédiée à la révision et à l'approfondissement de ces concepts essentiels.

La [[WIDGET:ConceptLink:finance_quantitative:finance quantitative]] repose intrinsèquement sur la capacité à quantifier l'incertitude et à modéliser l'évolution aléatoire des variables financières. Une compréhension rigoureuse des espaces de probabilité, des tribus (ou σ-algèbres) et des mesures est donc indispensable. Ces fondations permettent de définir précisément ce qu'est un événement, de formaliser l'information disponible à un instant donné, et d'attribuer des probabilités de manière cohérente. Sans ces prérequis, l'étude des [[WIDGET:Glossary:processus_stochastique:processus stochastiques]] – tels que le mouvement brownien ou les processus de Lévy – qui sont au cœur de la modélisation des prix d'actifs, des taux d'intérêt ou des volatilités, serait impossible ou lacunaire [[WIDGET:Reference:2]].

Cette révision vous préparera à aborder sereinement les chapitres ultérieurs sur le calcul stochastique, les martingales, et les applications directes en valorisation d'options et gestion des risques. Comme le soulignent des auteurs tels que [[WIDGET:RealPerson:shreve:Steven E. Shreve]] [[WIDGET:Reference:1]] ou [[WIDGET:RealPerson:bjork:Tomas Björk]] [[WIDGET:Reference:4]], une maîtrise solide de ces concepts probabilistes est la pierre angulaire de toute expertise en ingénierie financière.

[[WIDGET:Mermaid:prob_finance_flow:Diagramme conceptuel de l'importance des probabilités et de la mesure en finance quantitative]]

## Espaces de Probabilité et Tribus

La modélisation mathématique de phénomènes aléatoires, y compris ceux rencontrés en finance, commence par la définition d'un **espace de probabilité**. Un espace de probabilité est un triplet $(\Omega, \mathcal{F}, P)$, où chaque composant joue un rôle distinct et fondamental.

1.  **L'univers des possibles ($\Omega$)**: C'est l'ensemble de tous les résultats possibles d'une expérience aléatoire. Chaque élément $\omega \in \Omega$ représente une réalisation unique de l'expérience. Par exemple, si nous modélisons le prix d'une action à un horizon futur, $\Omega$ pourrait être l'ensemble de toutes les valeurs possibles que le prix pourrait prendre.

2.  **La tribu (ou σ-algèbre) ($\mathcal{F}$)**: C'est une collection de sous-ensembles de $\Omega$, appelés **événements mesurables**. La tribu $\mathcal{F}$ représente l'ensemble de tous les événements pour lesquels nous souhaitons assigner une probabilité. Elle doit satisfaire trois propriétés essentielles pour garantir la cohérence mathématique et la capacité à modéliser l'information:
    *   $\Omega \in \mathcal{F}$ (L'événement certain est mesurable).
    *   Si $A \in \mathcal{F}$, alors $A^c \in \mathcal{F}$ (Le complémentaire d'un événement mesurable est mesurable).
    *   Si $(A_i)_{i \in \mathbb{N}}$ est une suite dénombrable d'événements dans $\mathcal{F}$, alors $\bigcup_{i=1}^{\infty} A_i \in \mathcal{F}$ (L'union dénombrable d'événements mesurables est mesurable).

    La notion de [[WIDGET:ConceptLink:sigma_algebre:σ-algèbre]] est cruciale car elle formalise l'information disponible. À un instant donné, seuls les événements appartenant à la tribu sont "observables" ou "mesurables", c'est-à-dire que nous pouvons déterminer s'ils se sont produits ou non. En finance, la tribu est souvent interprétée comme l'information accumulée au cours du temps, permettant de prendre des décisions.

    **Exemples de tribus usuelles**:
    *   **Tribu triviale**: $\{\emptyset, \Omega\}$. C'est la plus petite tribu possible, ne permettant de distinguer aucun événement en dehors de l'impossible et du certain.
    *   **Tribu discrète**: $\mathcal{P}(\Omega)$, l'ensemble de toutes les parties de $\Omega$. C'est la plus grande tribu, où chaque sous-ensemble est un événement mesurable. Elle est utilisée lorsque $\Omega$ est fini ou dénombrable.
    *   **Tribu de Borel ($\mathcal{B}(\mathbb{R})$)**: Pour $\Omega = \mathbb{R}$, c'est la plus petite σ-algèbre contenant tous les intervalles ouverts (ou fermés) de $\mathbb{R}$. Elle est fondamentale pour la modélisation des variables aléatoires continues et est générée par les ensembles qui peuvent être formés par des opérations dénombrables sur des intervalles. Des références comme Oksendal [[WIDGET:Reference:13]] ou Karatzas et Shreve [[WIDGET:Reference:6]] détaillent l'importance de cette tribu en calcul stochastique.

3.  **La mesure de probabilité ($P$)**: C'est une fonction $P: \mathcal{F} \to [0, 1]$ qui attribue une probabilité à chaque événement mesurable de la tribu $\mathcal{F}$. Elle doit satisfaire les axiomes de Kolmogorov:
    *   $P(A) \ge 0$ pour tout $A \in \mathcal{F}$ (La probabilité d'un événement est non-négative).
    *   $P(\Omega) = 1$ (La probabilité de l'événement certain est 1).
    *   Pour toute suite dénombrable d'événements disjoints $(A_i)_{i \in \mathbb{N}}$ dans $\mathcal{F}$, $P(\bigcup_{i=1}^{\infty} A_i) = \sum_{i=1}^{\infty} P(A_i)$ (Additivité dénombrable).

    La [[WIDGET:Glossary:mesure_probabilite:mesure de probabilité]] $P$ quantifie la vraisemblance de chaque événement. En finance, c'est sous cette mesure que nous évaluons les espérances de gains ou de pertes, et que nous définissons les propriétés des processus stochastiques.

[[WIDGET:CustomFigure:prob_space_elements:Les trois éléments constitutifs d'un espace de probabilité]]