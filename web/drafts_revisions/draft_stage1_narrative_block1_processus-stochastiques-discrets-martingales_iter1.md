## Introduction aux Processus Stochastiques et à la Finance Quantitative

Bienvenue dans le cours de Finance Quantitative et modélisation stochastique. Ce programme de Master 1 vise à vous doter des outils mathématiques et statistiques indispensables pour comprendre, analyser et modéliser les phénomènes complexes des marchés financiers. La finance moderne est intrinsèquement liée à l'incertitude, et c'est précisément là que les processus stochastiques trouvent leur pertinence.

Les marchés financiers sont des environnements dynamiques où les prix des actifs, les taux d'intérêt et la volatilité évoluent de manière aléatoire. La modélisation de cette incertitude est cruciale pour des tâches telles que la valorisation des produits dérivés, la gestion des risques et l'optimisation de portefeuille. Les processus stochastiques fournissent le cadre mathématique rigoureux pour capturer cette dynamique aléatoire. Des pionniers comme [[WIDGET:RealPerson:bachelier:Louis Bachelier]], dont les travaux sur la théorie de la spéculation ont anticipé le mouvement brownien, ont jeté les bases de cette discipline. Plus tard, le modèle de [[WIDGET:RealPerson:black_scholes:Black-Scholes-Merton]] a révolutionné la valorisation des options, démontrant la puissance des approches stochastiques en finance [[WIDGET:Reference:2]], [[WIDGET:Reference:3]].

L'objectif de cette leçon inaugurale est de poser les fondations nécessaires à la compréhension des modèles financiers plus avancés. Nous nous concentrerons initialement sur les processus stochastiques en temps discret, qui offrent une approche plus intuitive et souvent plus simple pour introduire des concepts clés, comme le modèle binomial de valorisation des options [[WIDGET:Reference:1]]. Un concept central que nous explorerons en profondeur est celui des martingales, qui sont des processus stochastiques dont l'espérance future conditionnelle à l'information présente est égale à leur valeur actuelle. Les martingales sont fondamentales en finance quantitative, notamment pour la valorisation sans [[WIDGET:ConceptLink:arbitrage:arbitrage]] des actifs dérivés [[WIDGET:Reference:7]].

La structure de ce cours est conçue pour vous faire progresser des concepts fondamentaux vers des applications complexes. Après cette introduction aux processus discrets et aux martingales, nous aborderons les processus en temps continu, le calcul stochastique (notamment le lemme d'Itô), et leurs applications directes à la valorisation des options, à la modélisation des taux d'intérêt et à la gestion du risque de crédit.

[[WIDGET:Mermaid:course_progression:Schéma conceptuel de la progression du cours de Finance Quantitative]]

## Fondements des Processus Stochastiques Discrets

Pour aborder les processus stochastiques en finance, il est essentiel de maîtriser certains concepts fondamentaux. Un processus stochastique en temps discret est une suite de variables aléatoires $(X_t)_{t \in T}$ où $T$ est un ensemble discret (par exemple, $T = \{0, 1, 2, \dots, N\}$ ou $T = \{0, 1, 2, \dots\}$). Chaque $X_t$ représente l'état d'un système à l'instant $t$, comme le prix d'une action à la clôture de chaque jour. Ces processus sont définis sur un espace de probabilité $(\Omega, \mathcal{F}, P)$.

Un concept crucial est celui de la [[WIDGET:ConceptLink:sigma_algebra:filtration]]. Une filtration $(\mathcal{F}_t)_{t \in T}$ est une suite croissante de $\sigma$-algèbres, c'est-à-dire $\mathcal{F}_0 \subseteq \mathcal{F}_1 \subseteq \dots \subseteq \mathcal{F}$, où $\mathcal{F}_t$ représente l'ensemble de toutes les informations disponibles jusqu'à l'instant $t$. En finance, $\mathcal{F}_t$ peut encapsuler l'historique des prix des actifs, les annonces économiques, etc., jusqu'à l'instant $t$.

[[WIDGET:Mermaid:filtration_concept:Illustration du concept de filtration et de l'accroissement de l'information au fil du temps]]

Un processus stochastique $(X_t)_{t \in T}$ est dit **adapté** à la filtration $(\mathcal{F}_t)_{t \in T}$ si, pour tout $t \in T$, la variable aléatoire $X_t$ est $\mathcal{F}_t$-mesurable. Cela signifie que la valeur de $X_t$ est connue (ou déterminable) à l'instant $t$, étant donné toute l'information disponible jusqu'à cet instant. En d'autres termes, on ne peut pas "voir le futur" pour déterminer $X_t$.

Un processus $(H_t)_{t \in T}$ est dit **prévisible** si, pour tout $t \in T$, la variable aléatoire $H_t$ est $\mathcal{F}_{t-1}$-mesurable (pour $t \ge 1$). Cela implique que la valeur de $H_t$ est connue *avant* l'instant $t$, en utilisant uniquement l'information disponible jusqu'à l'instant $t-1$. Les stratégies de trading, par exemple, sont souvent modélisées comme des processus prévisibles, car les décisions d'achat ou de vente à l'instant $t$ doivent être basées sur l'information disponible *avant* $t$.

Enfin, la compréhension de l'[[WIDGET:ConceptLink:esperance_conditionnelle:espérance conditionnelle]] est un prérequis fondamental pour les martingales. L'espérance conditionnelle $E[X|\mathcal{G}]$ d'une variable aléatoire $X$ par rapport à une $\sigma$-algèbre $\mathcal{G}$ peut être intuitivement comprise comme la "meilleure estimation" de $X$ étant donné l'information contenue dans $\mathcal{G}$. Elle possède plusieurs propriétés clés qui seront utilisées de manière extensive dans la théorie des martingales et la valorisation financière [[WIDGET:Reference:1]], [[WIDGET:Reference:7]]:

*   **Linéarité:** $E[aX + bY|\mathcal{G}] = aE[X|\mathcal{G}] + bE[Y|\mathcal{G}]$
*   **"Sortir ce qui est connu":** Si $Y$ est $\mathcal{G}$-mesurable, alors $E[XY|\mathcal{G}] = Y E[X|\mathcal{G}]$
*   **Propriété de la tour (ou espérance itérée):** Si $\mathcal{G}_1 \subseteq \mathcal{G}_2$, alors $E[E[X|\mathcal{G}_2]|\mathcal{G}_1] = E[X|\mathcal{G}_1]$
*   **Indépendance:** Si $X$ est indépendante de $\mathcal{G}$, alors $E[X|\mathcal{G}] = E[X]$

Ces propriétés sont cruciales pour manipuler les espérances dans les modèles stochastiques.

[[WIDGET:CustomFigure:conditional_expectation_properties:Résumé des propriétés clés de l'espérance conditionnelle]]