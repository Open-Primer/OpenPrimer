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

    La notion de [[WIDGET:ConceptLink:sigma_algebre:σ-algèbre]] est cruciale car elle formalise l'information disponible. À un instant donné, seuls les événements appartenant à la tribu sont « observables » ou « mesurables », c'est-à-dire que nous pouvons déterminer s'ils se sont produits ou non. En finance, la tribu est souvent interprétée comme l'information accumulée au cours du temps, permettant de prendre des décisions.

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

Nous avons établi les fondements d'un espace de probabilité $(\Omega, \mathcal{F}, P)$, qui nous permet de modéliser l'incertitude et d'attribuer des probabilités aux événements. Cependant, en finance quantitative, nous sommes rarement intéressés par les événements bruts de l'espace $\Omega$ directement, mais plutôt par des quantités numériques qui dépendent de ces événements, comme le prix d'un actif ou le rendement d'un portefeuille. C'est ici qu'intervient la notion de variable aléatoire.

## Variables Aléatoires et Mesure

Une [[WIDGET:ConceptLink:variable_aleatoire:variable aléatoire]] $X$ est une fonction qui associe un nombre réel à chaque résultat possible d'une expérience aléatoire. Plus formellement, sur un espace de probabilité $(\Omega, \mathcal{F}, P)$, une variable aléatoire $X$ est une fonction $X: \Omega \to \mathbb{R}$ telle que, pour tout ensemble de Borel $B \in \mathcal{B}(\mathbb{R})$, l'ensemble $X^{-1}(B) = \{\omega \in \Omega : X(\omega) \in B\}$ appartient à la tribu $\mathcal{F}$. Cette condition signifie que $X$ est une [[WIDGET:Glossary:fonction_mesurable:fonction mesurable]] de $(\Omega, \mathcal{F})$ vers $(\mathbb{R}, \mathcal{B}(\mathbb{R}))$. La mesurabilité est cruciale car elle garantit que nous pouvons attribuer une probabilité à tout événement lié aux valeurs prises par $X$.

Les variables aléatoires se classent principalement en deux catégories:
*   **Variables aléatoires discrètes**: Elles ne peuvent prendre qu'un nombre fini ou dénombrable de valeurs. Leur comportement est décrit par une fonction de masse de probabilité (FMP), $P(X=x_i)$, qui attribue une probabilité à chaque valeur possible $x_i$. Des exemples incluent le nombre de défauts sur un portefeuille de crédits ou le résultat d'un lancer de dé.
*   **Variables aléatoires continues**: Elles peuvent prendre n'importe quelle valeur dans un intervalle donné. Leur comportement est décrit par une fonction de densité de probabilité (FDP), $f_X(x)$, telle que $P(a \le X \le b) = \int_a^b f_X(x) dx$. Les rendements d'actifs financiers ou les taux d'intérêt sont souvent modélisés comme des variables aléatoires continues.

[[WIDGET:CustomFigure:types_variables_aleatoires:Classification des variables aléatoires et leurs caractéristiques principales]]

La loi de probabilité d'une variable aléatoire $X$ est la mesure de probabilité $P_X$ induite sur $(\mathbb{R}, \mathcal{B}(\mathbb{R}))$ par $X$, définie par $P_X(B) = P(X \in B)$ pour tout $B \in \mathcal{B}(\mathbb{R})$. Cette loi est entièrement caractérisée par la fonction de répartition $F_X(x) = P(X \le x)$.

L'**espérance mathématique** (ou valeur attendue) d'une variable aléatoire $X$, notée $\mathbb{E}[X]$, est une mesure de sa tendance centrale. Elle représente la valeur moyenne que l'on s'attend à observer si l'expérience était répétée un grand nombre de fois.
*   Pour une variable discrète $X$ prenant les valeurs $x_i$ avec probabilité $p_i$: $\mathbb{E}[X] = \sum_i x_i p_i$.
*   Pour une variable continue $X$ de densité $f_X(x)$: $\mathbb{E}[X] = \int_{-\infty}^{\infty} x f_X(x) dx$.

La puissance de la théorie de la mesure réside dans sa capacité à unifier ces définitions sous le concept d'**intégrale de Lebesgue**. Pour toute variable aléatoire $X$ intégrable (c'est-à-dire $\mathbb{E}[|X|] < \infty$), son espérance mathématique est donnée par l'intégrale de Lebesgue de $X$ par rapport à la mesure de probabilité $P$ sur l'espace fondamental $\Omega$:

$$ \mathbb{E}[X] = \int_{\Omega} X(\omega) dP(\omega) $$

Cette formulation est fondamentale en finance quantitative, car elle permet de traiter de manière rigoureuse des variables aléatoires complexes, y compris celles issues de processus stochastiques. Elle est la pierre angulaire pour la définition des martingales et pour l'évaluation des actifs financiers sous des mesures de probabilité équivalentes, comme détaillé dans des ouvrages de référence tels que [[WIDGET:Reference:7]] et .

[[WIDGET:Mermaid:lebesgue_integral_concept:Représentation conceptuelle de l'intégrale de Lebesgue pour le calcul de l'espérance]]

## Espérance Conditionnelle

En finance, l'information évolue constamment. Les décisions d'investissement sont prises non pas avec une connaissance parfaite de l'avenir, mais en fonction de l'information disponible à un instant donné. L'**espérance conditionnelle** est l'outil mathématique qui formalise cette idée de « mise à jour de l'espérance » en fonction d'une information partielle.

Soit $(\Omega, \mathcal{F}, P)$ un espace de probabilité et $X$ une variable aléatoire intégrable sur cet espace. Soit $\mathcal{G}$ une sous-$\sigma$-algèbre de $\mathcal{F}$ (c'est-à-dire $\mathcal{G} \subseteq \mathcal{F}$). La tribu $\mathcal{G}$ représente l'information disponible. L'[[WIDGET:ConceptLink:esperance_conditionnelle:espérance conditionnelle]] de $X$ sachant $\mathcal{G}$, notée $\mathbb{E}[X|\mathcal{G}]$, est une variable aléatoire qui satisfait les deux propriétés suivantes:
1.  $\mathbb{E}[X|\mathcal{G}]$ est $\mathcal{G}$-mesurable. Cela signifie que sa valeur est déterminée par l'information contenue dans $\mathcal{G}$.
2.  Pour tout événement $A \in \mathcal{G}$, on a $\int_A \mathbb{E}[X|\mathcal{G}] dP = \int_A X dP$. Cette propriété, souvent appelée « propriété de projection », indique que l'espérance de $X$ sur tout événement de $\mathcal{G}$ est la même que l'espérance de $\mathbb{E}[X|\mathcal{G}]$ sur cet événement.

L'existence et l'unicité (presque sûre) de $\mathbb{E}[X|\mathcal{G}]$ sont garanties par le théorème de Radon-Nikodym, un résultat fondamental de la théorie de la mesure. Le mathématicien [[WIDGET:RealPerson:kolmogorov:Andreï Kolmogorov]] a joué un rôle central dans la formalisation moderne de la théorie des probabilités et de l'espérance conditionnelle.

L'interprétation intuitive de $\mathbb{E}[X|\mathcal{G}]$ est la « meilleure estimation » de $X$ étant donnée l'information contenue dans $\mathcal{G}$. C'est la valeur moyenne de $X$ si nous connaissions tous les événements de $\mathcal{G}$.

Les propriétés fondamentales de l'espérance conditionnelle sont essentielles pour sa manipulation en finance:
*   **Linéarité**: $\mathbb{E}[aX+bY|\mathcal{G}] = a\mathbb{E}[X|\mathcal{G}] + b\mathbb{E}[Y|\mathcal{G}]$ pour des constantes $a, b \in \mathbb{R}$.
*   **Positivité**: Si $X \ge 0$, alors $\mathbb{E}[X|\mathcal{G}] \ge 0$ presque sûrement.
*   **Propriété de projection**: $\mathbb{E}[X|\mathcal{G}]$ est la projection orthogonale de $X$ sur l'espace des variables aléatoires $\mathcal{G}$-mesurables dans $L^2(P)$.
*   **Propriété de la tour (Tower Property)**: Si $\mathcal{H} \subseteq \mathcal{G} \subseteq \mathcal{F}$ sont des sous-$\sigma$-algèbres, alors $\mathbb{E}|\mathcal{H}] = \mathbb{E}[X|\mathcal{H}]$. Un cas particulier est $\mathbb{E}] = \mathbb{E}[X]$.
*   **« Sortir ce qui est connu »**: Si $Y$ est une variable aléatoire $\mathcal{G}$-mesurable, alors $\mathbb{E}[XY|\mathcal{G}] = Y\mathbb{E}[X|\mathcal{G}]$.
*   **Indépendance**: Si $X$ est indépendante de $\mathcal{G}$, alors $\mathbb{E}[X|\mathcal{G}] = \mathbb{E}[X]$.

[[WIDGET:CustomFigure:conditional_expectation_info:Interprétation de l'espérance conditionnelle comme une mise à jour de l'information disponible]]

En finance, $\mathcal{G}$ représente souvent la filtration, c'est-à-dire l'information accumulée au cours du temps. L'espérance conditionnelle est au cœur de la théorie des martingales, des processus de Markov, et des méthodes de valorisation des produits dérivés sous des mesures de probabilité risque-neutre, comme détaillé dans  et .

**Exemple concret**: Supposons que $X$ représente le prix futur d'une action et $\mathcal{G}$ représente l'ensemble des informations boursières disponibles jusqu'à aujourd'hui (cours passés, annonces économiques, etc.). Alors $\mathbb{E}[X|\mathcal{G}]$ est la prévision du prix futur de l'action basée sur toutes les informations actuelles. Si une nouvelle information $Y$ devient disponible (par exemple, un rapport de bénéfices), la nouvelle information est représentée par une $\sigma$-algèbre plus grande $\mathcal{G}' = \sigma(\mathcal{G}, Y)$, et la nouvelle prévision serait $\mathbb{E}[X|\mathcal{G}']$.

[[WIDGET:Quiz:conditional_expectation_quiz]]

## Conclusion
Au terme de ce module de rappel, nous avons revisité les piliers fondamentaux de la théorie des probabilités et de la mesure, indispensables à toute incursion sérieuse dans la finance quantitative. Nous avons d'abord établi le cadre rigoureux des [[WIDGET:ConceptLink:espace_mesurable:espaces mesurables]], définissant l'univers des événements possibles et la manière de les quantifier. Les [[WIDGET:Glossary:tribu:tribus]] (ou $\sigma$-algèbres) ont été présentées comme les structures essentielles pour organiser l'information, permettant de définir précisément ce qui est « mesurable » et donc observable. Sur cette base, les [[WIDGET:ConceptLink:variable_aleatoire:variables aléatoires]] ont été introduites comme des fonctions mesurables, transformant les résultats abstraits en quantités numériques exploitables. Enfin, nous avons exploré l'[[WIDGET:ConceptLink:esperance_conditionnelle:espérance conditionnelle]], un concept puissant qui permet de mettre à jour nos prévisions en fonction de l'information disponible, incarnée par une sous-$\sigma$-algèbre.

Ces concepts ne sont pas de simples abstractions mathématiques ; ils constituent la grammaire et le vocabulaire nécessaires pour comprendre et modéliser les phénomènes financiers complexes. La maîtrise des espaces mesurables et des tribus est le prérequis pour définir des processus stochastiques et leur évolution temporelle. L'espérance conditionnelle, en particulier, est au cœur de la théorie moderne de la valorisation des actifs. Elle est l'outil indispensable pour la construction des [[WIDGET:ConceptLink:martingale:martingales]], ces processus dont l'espérance future, conditionnée par l'information présente, est égale à leur valeur actuelle. Les martingales sont la pierre angulaire de la valorisation sans arbitrage des produits dérivés sous une mesure de probabilité risque-neutre, comme détaillé dans  et . De même, la compréhension des variables aléatoires et de leur mesurabilité est cruciale pour la définition et la manipulation des [[WIDGET:Glossary:integrale_stochastique:intégrales stochastiques]], qui permettent d'intégrer des fonctions par rapport à des processus aléatoires tels que le mouvement brownien, un concept central pour les modèles en temps continu popularisés par des figures comme [[WIDGET:RealPerson:ito:Kiyosi Itô]] , .

[[WIDGET:Mermaid:quant_finance_flow:Flux des concepts fondamentaux vers la finance quantitative avancée]]

La valorisation d'options, qu'il s'agisse du modèle de Black-Scholes ou de ses extensions, repose intrinsèquement sur ces fondations. L'espérance conditionnelle permet de calculer la valeur actuelle d'un flux de paiement futur, ajustée pour le risque et l'information disponible. Sans une compréhension solide de ces rappels, l'étude des modèles stochastiques avancés, des stratégies de couverture, et de la gestion des risques demeurerait superficielle. Ce module a donc jeté les bases solides sur lesquelles nous bâtirons les connaissances plus spécifiques à la finance quantitative.

[[WIDGET:CustomFigure:option_pricing_conceptual:Représentation conceptuelle du rôle des probabilités et de l'espérance conditionnelle dans la valorisation d'options]]

[[WIDGET:Quote:shreve_math_finance:Citation de Steven Shreve sur l'importance des mathématiques en finance quantitative]]

[[WIDGET:conclusionSummary]]

[[WIDGET:whatsNext]]

[[WIDGET:goingFurther]]

[[WIDGET:finalEvaluation]]
