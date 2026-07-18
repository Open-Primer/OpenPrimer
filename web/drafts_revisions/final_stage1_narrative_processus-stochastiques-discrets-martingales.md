## Introduction aux Processus Stochastiques et à la Finance Quantitative

Bienvenue dans le cours de Finance Quantitative et modélisation stochastique. Ce programme de Master 1 vise à vous doter des outils mathématiques et statistiques indispensables pour comprendre, analyser et modéliser les phénomènes complexes des marchés financiers. La finance moderne est intrinsèquement liée à l'incertitude, et c'est précisément là que les processus stochastiques trouvent leur pertinence.

Les marchés financiers sont des environnements dynamiques où les prix des actifs, les taux d'intérêt et la volatilité évoluent de manière aléatoire. La modélisation de cette incertitude est cruciale pour des tâches telles que la valorisation des produits dérivés, la gestion des risques et l'optimisation de portefeuille. Les processus stochastiques fournissent le cadre mathématique rigoureux pour capturer cette dynamique aléatoire. Des pionniers comme , dont les travaux sur la théorie de la spéculation ont anticipé le mouvement brownien, ont jeté les bases de cette discipline. Plus tard, le modèle de [[WIDGET:RealPerson:black_scholes:Black-Scholes-Merton]] a révolutionné la valorisation des options, démontrant la puissance des approches stochastiques en finance [[WIDGET:Reference:2]], [[WIDGET:Reference:3]].

L'objectif de cette leçon inaugurale est de poser les fondations nécessaires à la compréhension des modèles financiers plus avancés. Nous nous concentrerons initialement sur les processus stochastiques en temps discret, qui offrent une approche plus intuitive et souvent plus simple pour introduire des concepts clés, comme le modèle binomial de valorisation des options [[WIDGET:Reference:1]]. Un concept central que nous explorerons en profondeur est celui des martingales, qui sont des processus stochastiques dont l'espérance future conditionnelle à l'information présente est égale à leur valeur actuelle. Les martingales sont fondamentales en finance quantitative, notamment pour la valorisation sans [[WIDGET:ConceptLink:arbitrage:arbitrage]] des actifs dérivés [[WIDGET:Reference:7]].

La structure de ce cours est conçue pour vous faire progresser des concepts fondamentaux vers des applications complexes. Après cette introduction aux processus discrets et aux martingales, nous aborderons les processus en temps continu, le calcul stochastique (notamment le lemme d'Itô), et leurs applications directes à la valorisation des options, à la modélisation des taux d'intérêt et à la gestion du risque de crédit.

[[WIDGET:Mermaid:course_progression:Schéma conceptuel de la progression du cours de Finance Quantitative]]

## Fondements des Processus Stochastiques Discrets

Pour aborder les processus stochastiques en finance, il est essentiel de maîtriser certains concepts fondamentaux. Un processus stochastique en temps discret est une suite de variables aléatoires $(X_t)_{t \in T}$ où $T$ est un ensemble discret (par exemple, $T = \{0, 1, 2, \dots, N\}$ ou $T = \{0, 1, 2, \dots\}$). Chaque $X_t$ représente l'état d'un système à l'instant $t$, comme le prix d'une action à la clôture de chaque jour. Ces processus sont définis sur un espace de probabilité $(\Omega, \mathcal{F}, P)$.

Un concept crucial est celui de la [[WIDGET:ConceptLink:sigma_algebra:filtration]]. Une filtration $(\mathcal{F}_t)_{t \in T}$ est une suite croissante de $\sigma$-algèbres, c'est-à-dire $\mathcal{F}_0 \subseteq \mathcal{F}_1 \subseteq \dots \subseteq \mathcal{F}$, où $\mathcal{F}_t$ représente l'ensemble de toutes les informations disponibles jusqu'à l'instant $t$. En finance, $\mathcal{F}_t$ peut encapsuler l'historique des prix des actifs, les annonces économiques, etc., jusqu'à l'instant $t$.

[[WIDGET:Mermaid:filtration_concept:Illustration du concept de filtration et de l'accroissement de l'information au fil du temps]]

Un processus stochastique $(X_t)_{t \in T}$ est dit **adapté** à la filtration $(\mathcal{F}_t)_{t \in T}$ si, pour tout $t \in T$, la variable aléatoire $X_t$ est $\mathcal{F}_t$-mesurable. Cela signifie que la valeur de $X_t$ est connue (ou déterminable) à l'instant $t$, étant donné toute l'information disponible jusqu'à cet instant. En d'autres termes, on ne peut pas « voir le futur » pour déterminer $X_t$.

Un processus $(H_t)_{t \in T}$ est dit **prévisible** si, pour tout $t \in T$, la variable aléatoire $H_t$ est $\mathcal{F}_{t-1}$-mesurable (pour $t \ge 1$). Cela implique que la valeur de $H_t$ est connue *avant* l'instant $t$, en utilisant uniquement l'information disponible jusqu'à l'instant $t-1$. Les stratégies de trading, par exemple, sont souvent modélisées comme des processus prévisibles, car les décisions d'achat ou de vente à l'instant $t$ doivent être basées sur l'information disponible *avant* $t$.

Enfin, la compréhension de l'[[WIDGET:ConceptLink:esperance_conditionnelle:espérance conditionnelle]] est un prérequis fondamental pour les martingales. L'espérance conditionnelle $E[X|\mathcal{G}]$ d'une variable aléatoire $X$ par rapport à une $\sigma$-algèbre $\mathcal{G}$ peut être intuitivement comprise comme la « meilleure estimation » de $X$ étant donné l'information contenue dans $\mathcal{G}$. Elle possède plusieurs propriétés clés qui seront utilisées de manière extensive dans la théorie des martingales et la valorisation financière , :

*   **Linéarité:** $E[aX + bY|\mathcal{G}] = aE[X|\mathcal{G}] + bE[Y|\mathcal{G}]$
*   **« Sortir ce qui est connu »:** Si $Y$ est $\mathcal{G}$-mesurable, alors $E[XY|\mathcal{G}] = Y E[X|\mathcal{G}]$
*   **Propriété de la tour (ou espérance itérée):** Si $\mathcal{G}_1 \subseteq \mathcal{G}_2$, alors $E[E[X|\mathcal{G}_2]|\mathcal{G}_1] = E[X|\mathcal{G}_1]$
*   **Indépendance:** Si $X$ est indépendante de $\mathcal{G}$, alors $E[X|\mathcal{G}] = E[X]$

Ces propriétés sont cruciales pour manipuler les espérances dans les modèles stochastiques.

[[WIDGET:CustomFigure:conditional_expectation_properties:Résumé des propriétés clés de l'espérance conditionnelle]]

Les propriétés de l'espérance conditionnelle que nous venons de revoir sont les piliers sur lesquels repose la théorie des martingales, un concept central en probabilités et en finance quantitative.

## Martingales Discrètes : Définition et Propriétés Fondamentales

Cette section se concentrera sur la définition formelle des martingales, sous-martingales et sur-martingales en temps discret. Elle explorera leurs propriétés clés, telles que l'inégalité de Doob et le théorème d'arrêt optionnel, en fournissant des exemples concrets pour illustrer ces concepts.

Un processus stochastique discret $(X_t)_{t \in T}$ est appelé une [[WIDGET:ConceptLink:martingale_def:Martingale]] par rapport à une filtration $(\mathcal{F}_t)_{t \in T}$ si les trois conditions suivantes sont remplies pour tout $t \in T$:
1.  **Adaptation:** Le processus $X_t$ est adapté à la filtration $\mathcal{F}_t$, c'est-à-dire que $X_t$ est $\mathcal{F}_t$-mesurable. Cela signifie que la valeur de $X_t$ est connue à l'instant $t$ compte tenu de l'information disponible jusqu'à $t$.
2.  **Intégrabilité:** $E[|X_t|] < \infty$. La valeur absolue de $X_t$ doit avoir une espérance finie pour tout $t$.
3.  **Propriété de Martingale:** $E[X_{t+1}|\mathcal{F}_t] = X_t$. L'espérance de la valeur future du processus, conditionnée par toute l'information disponible jusqu'à l'instant présent $t$, est égale à la valeur présente du processus.

Intuitivement, une martingale modélise un « jeu équitable » où le gain espéré à l'étape suivante, connaissant l'historique du jeu, est égal au gain actuel. Un exemple classique est la fortune d'un joueur dans un jeu de pile ou face équitable.

Par extension, nous définissons les sous-martingales et les sur-martingales :
*   Un processus $(X_t)_{t \in T}$ est une [[WIDGET:ConceptLink:submartingale_def:Sous-martingale]] si $E[X_{t+1}|\mathcal{F}_t] \ge X_t$. Cela représente un « jeu favorable » où le gain espéré futur est supérieur ou égal au gain actuel.
*   Un processus $(X_t)_{t \in T}$ est une [[WIDGET:ConceptLink:supermartingale_def:Sur-martingale]] si $E[X_{t+1}|\mathcal{F}_t] \le X_t$. Cela correspond à un « jeu défavorable » où le gain espéré futur est inférieur ou égal au gain actuel.

Ces concepts sont fondamentaux pour l'analyse des processus stochastiques et trouvent de nombreuses applications, notamment en finance pour la modélisation des prix d'actifs.

Parmi les propriétés essentielles des martingales, deux sont particulièrement remarquables :

1.  **L'Inégalité de Doob :** Cette inégalité, nommée d'après [[WIDGET:RealPerson:doob_joseph:Joseph L. Doob]], fournit une borne supérieure pour la probabilité qu'une martingale dépasse un certain seuil. Plus précisément, pour une sous-martingale $(X_t)_{t \in T}$ et un seuil $c > 0$, elle établit une relation entre la probabilité que le maximum du processus jusqu'à un certain temps $T$ dépasse $c$ et l'espérance de la valeur du processus à $T$. Elle est cruciale pour l'étude de la convergence des martingales et pour l'estimation du risque de dépassement , [[WIDGET:Reference:11]].

[[WIDGET:CustomFigure:doob_inequality:Formulation de l'inégalité de Doob pour les martingales, illustrant la borne supérieure de la probabilité de dépassement d'un seuil]]

2.  **Le Théorème d'Arrêt Optionnel :** Ce théorèm'est d'une importance capitale en finance. Il stipule que, sous certaines conditions (par exemple, si le temps d'arrêt est borné ou si la martingale est bornée), l'espérance d'une martingale à un [[WIDGET:Glossary:stopping_time:temps d'arrêt]] $T$ est égale à son espérance à l'instant initial. Un temps d'arrêt est une variable aléatoire $T$ dont la réalisation ne dépend que de l'information disponible jusqu'à l'instant $T$. En d'autres termes, on ne peut pas « battre » un jeu équitable en choisissant astucieusement le moment d'arrêter de jouer. Ce théorèm'est fondamental pour comprendre pourquoi il est impossible de générer des profits d'arbitrage dans un marché efficient , .

## Application aux Marchés Financiers : Le Modèle Binomial de Cox-Ross-Rubinstein

Cette section appliquera les concepts de martingales à la modélisation des marchés financiers. Elle détaillera la construction du modèle binomial de Cox-Ross-Rubinstein (CRR), expliquera l'absence d'opportunité d'arbitrage et introduira la mesure de probabilité risque-neutre. L'utilisation des martingales pour l'évaluation des options dans ce cadre sera un point central.

Le modèle binomial de [[WIDGET:RealPerson:cox_john:John C. Cox]], [[WIDGET:RealPerson:ross_stephen:Stephen A. Ross]] et [[WIDGET:RealPerson:rubinstein_mark:Mark Rubinstein]] (CRR) est un cadre discret et simple, mais puissant, pour la modélisation des prix d'actifs et l'évaluation des produits dérivés , . Il repose sur les hypothèses suivantes :
*   Le temps est discret, divisé en $N$ périodes.
*   Il existe un actif sans risque (par exemple, une obligation) dont le prix $B_t$ évolue à un taux d'intérêt sans risque $r$ par période, soit $B_t = B_0 (1+r)^t$.
*   Il existe un actif risqué (par exemple, une action) dont le prix $S_t$ peut, à chaque période, soit augmenter d'un facteur $u > 1$ (up), soit diminuer d'un facteur $d < 1$ (down).
*   Les mouvements de prix sont indépendants d'une période à l'autre.

[[WIDGET:Mermaid:crr_model_tree:Arbre des prix du modèle binomial de Cox-Ross-Rubinstein sur plusieurs périodes]]

### Absence d'Opportunité d'Arbitrage

Une condition cruciale dans le modèle CRR est l'absence d'opportunité d'[[WIDGET:Glossary:arbitrage:arbitrage]]. L'arbitrage est la possibilité de réaliser un profit certain et sans risque, sans investissement initial. Dans le modèle CRR, cette condition est satisfaite si et seulement si $d < 1+r < u$. Si cette inégalité n'est pas respectée, il serait possible de construire une stratégie de trading qui génère un profit certain, ce qui est incompatible avec l'hypothèse d'un marché efficient , [[WIDGET:Reference:4]].

### La Mesure de Probabilité Risque-Neutre

L'absence d'arbitrage dans le modèle CRR est directement liée à l'existence d'une [[WIDGET:ConceptLink:risk_neutral_measure:Mesure de probabilité risque-neutre]] (souvent notée $Q$). Sous cette mesure, le prix actualisé de tout actif (y compris les produits dérivés) est une martingale. Cela signifie que l'espérance du prix actualisé futur est égale à son prix actualisé actuel.

Pour le modèle CRR, nous pouvons déterminer des probabilités « risque-neutres » $q$ et $1-q$ pour les mouvements àl'hausse et à la baisse de l'action, telles que l'espérance du prix actualisé de l'action à la période suivante, sous $Q$, soit égale à son prix actualisé actuel. La probabilité $q$ est donnée par :

$q = \frac{(1+r) - d}{u - d}$

Sous cette mesure $Q$, les investisseurs sont indifférents au risque, et le rendement espéré de tous les actifs est le taux sans risque $r$.

### Évaluation des Options par Martingales

L'un des principaux avantages du cadre des martingales est sa capacité à évaluer les produits dérivés. Le prix d'une option (ou de tout autre instrument dérivé) à l'instant $t$, noté $V_t$, peut être calculé comme l'espérance de son payoff actualisé à maturité $T$, sous la mesure de probabilité risque-neutre $Q$ , [[WIDGET:Reference:8]]:

$V_t = E_Q\left[\frac{V_T}{(1+r)^{T-t}} \middle| \mathcal{F}_t\right]$

Cette formule est la pierre angulaire de l'évaluation des options dans le modèle CRR. Elle permet de remonter le temps, en calculant la valeur de l'option à chaque nœud de l'arbre binomial, en partant de sa valeur à maturité.

[[WIDGET:SolvedExercise:option_pricing_crr:Exemple d'évaluation d'une option d'achat européenne dans le modèle CRR à une période]]

## Conclusion
Au terme de cette leçon, nous avons exploré les fondements des [[WIDGET:ConceptLink:discrete_stochastic_process:processus stochastiques discrets]], des outils mathématiques indispensables pour modéliser l'évolution d'un systèm'au fil du temps par étapes distinctes. Nous avons ensuite introduit la notion cruciale de [[WIDGET:Glossary:martingale:martingale]], une classe particulière de processus stochastiques dont l'espérance conditionnelle future, étant donné l'information présente, est égale à sa valeur actuelle. Ce concept, central en théorie des probabilités, trouve une application particulièrement féconde en finance quantitative.

L'application de ces concepts a été illustrée à travers le [[WIDGET:ConceptLink:crr_model:modèle de Cox-Ross-Rubinstein (CRR)]], un cadre binomial discret qui sert de pierre angulaire à la compréhension de la valorisation des actifs dérivés. Nous avons vu comment l'absence d'opportunité d'arbitrage conduit naturellement à l'existence d'une mesure de probabilité risque-neutre, sous laquelle les prix actualisés des actifs sont des martingales. Cette approche, popularisée par des travaux comme ceux de [[WIDGET:RealPerson:shreve_steven:Steven E. Shreve]], permet de valoriser des options et autres produits dérivés en calculant l'espérance de leurs payoffs futurs actualisés sous cette mesure , . La puissance de cette méthodologie réside dans sa capacité à séparer le risque du rendement, offrant une base solide pour la prise de décision financière.

[[WIDGET:Mermaid:concept_flow:Flux conceptuel des processus stochastiques discrets aux martingales et au modèle CRR]]

Si le modèle CRR offre une intuition précieuse et une base calculatoire accessible, il représente une simplification du monde financier réel. Les perspectives d'extension de ces concepts sont vastes. La transition vers des modèles en temps continu est une étape naturelle et fondamentale en finance quantitative. Des modèles comme celui de [[WIDGET:ConceptLink:black_scholes:Black-Scholes-Merton]], qui repose sur le mouvement brownien géométrique, sont des extensions directes de la logique des martingales et des mesures risque-neutres dans un cadre continu , .

[[WIDGET:CustomFigure:discrete_to_continuous:Illustration de la convergence des modèles discrets vers les modèles continus]]

Au-delà des modèles en temps continu, l'étude des processus stochastiques s'étend à des dynamiques plus complexes, incluant les processus à sauts (pour modéliser les chocs de marché) [[WIDGET:Reference:5]], la volatilité stochastique (où la volatilité elle-mêm'est un processus aléatoire) [[WIDGET:Reference:16]], ou encore les modèles multi-actifs. Ces développements nécessitent souvent des outils mathématiques plus avancés, tels que le calcul stochastique d'Itô, les équations différentielles stochastiques (EDS) [[WIDGET:Reference:13]], et des méthodes numériques sophistiquées comme les simulations de Monte Carlo [[WIDGET:Reference:9]] ou les méthodes aux différences finies pour résoudre les équations aux dérivées partielles associées. La compréhension des martingales reste cependant un fil conducteur essentiel, garantissant la cohérence et l'absence d'arbitrage dans ces cadres plus élaborés.

[[WIDGET:Quote:musiela_rutkowski_martingales:Citation de Musiela et Rutkowski sur le rôle central des martingales en modélisation financière]]

[[WIDGET:conclusionSummary]]
[[WIDGET:whatsNext]]
[[WIDGET:goingFurther]]
[[WIDGET:finalEvaluation]]
