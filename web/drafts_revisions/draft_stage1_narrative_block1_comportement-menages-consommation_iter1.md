## Introduction au Comportement des Ménages et Consommation Intertemporelle

En macroéconomie, la compréhension des décisions des ménages est fondamentale pour analyser des phénomènes agrégés tels que la croissance économique, les cycles conjoncturels, l'inflation et l'efficacité des politiques publiques. Au cœur de cette analyse se trouve le concept de [[WIDGET:ConceptLink:consommation_intertemporelle:consommation intertemporelle]], qui reconnaît que les agents économiques ne prennent pas leurs décisions d'allocation de ressources de manière isolée pour une seule période, mais plutôt en considérant l'ensemble de leur horizon de vie.

La consommation intertemporelle est le processus par lequel les ménages répartissent leur consommation et leur épargne sur différentes périodes de temps, en tenant compte de leurs revenus présents et futurs, des taux d'intérêt et de leurs préférences. Cette perspective dynamique est cruciale car elle explique pourquoi les ménages épargnent (pour financer une consommation future plus élevée ou pour lisser leur consommation face à des chocs de revenus), pourquoi ils empruntent (pour financer une consommation présente supérieure à leur revenu actuel) et comment leurs décisions sont influencées par les anticipations. Des économistes pionniers comme [[WIDGET:RealPerson:irving_fisher:Irving Fisher]] ont jeté les bases de cette théorie, soulignant l'importance du taux d'intérêt comme prix de la consommation présente par rapport à la consommation future [[WIDGET:Reference:1]]. Plus tard, des travaux comme ceux de [[WIDGET:RealPerson:franco_modigliani:Franco Modigliani]] avec l'hypothèse du cycle de vie et de [[WIDGET:RealPerson:milton_friedman:Milton Friedman]] avec l'hypothèse du revenu permanent ont approfondi notre compréhension de ces mécanismes [[WIDGET:Reference:2]].

Ce cours vise à doter les étudiants de Master 1 des outils analytiques nécessaires pour modéliser et comprendre le comportement des ménages dans un cadre intertemporel. Nous explorerons les objectifs d'optimisation des ménages, la formulation de leur contrainte budgétaire sur plusieurs périodes, et la dérivation de l'[[WIDGET:Glossary:equation_euler:équation d'Euler]], qui est la condition d'optimalité clé pour la consommation intertemporelle. Nous analyserons également les effets de richesse et de substitution, qui décrivent comment les variations des taux d'intérêt ou des revenus affectent les décisions de consommation et d'épargne des ménages.

[[WIDGET:Mermaid:decision_intertemporelle:Diagramme illustrant le processus de décision intertemporelle des ménages]]

## Le Modèle d'Optimisation Intertemporelle des Ménages

Le cadre théorique de l'optimisation intertemporelle des ménages repose sur l'hypothèse que les ménages cherchent à maximiser leur utilité totale sur leur horizon de vie, sous une contrainte budgétaire intertemporelle.

### La Fonction d'Utilité Intertemporelle

La fonction d'utilité intertemporelle agrège l'utilité dérivée de la consommation à chaque période. Un ménage typique cherche à maximiser la somme actualisée de ses utilités instantanées. Si $C_t$ représente la consommation à la période $t$, la fonction d'utilité intertemporelle peut s'écrire comme suit:

$$U = \sum_{t=0}^{T} \beta^t u(C_t)$$

où:
*   $u(C_t)$ est la fonction d'utilité instantanée à la période $t$, supposée croissante et concave ($u'(C_t) > 0$, $u''(C_t) < 0$), reflétant la préférence pour plus de consommation et la désutilité marginale décroissante.
*   $\beta \in (0, 1)$ est le [[WIDGET:Glossary:facteur_actualisation:facteur d'actualisation]] (ou facteur de préférence temporelle), qui représente le degré d'impatience du ménage. Un $\beta$ plus petit indique une plus grande préférence pour la consommation présente par rapport à la consommation future. Ce facteur est crucial pour pondérer l'importance de l'utilité future par rapport à l'utilité présente [[WIDGET:Reference:3]].
*   $T$ est l'horizon de vie du ménage, qui peut être fini ou infini dans les modèles de croissance.

### La Contrainte Budgétaire Intertemporelle

La contrainte budgétaire intertemporelle relie les décisions de consommation et d'épargne du ménage à ses revenus et aux taux d'intérêt. Elle exprime que la valeur actualisée des consommations futures ne peut excéder la valeur actualisée des revenus futurs plus la richesse initiale.

Considérons un modèle simple à deux périodes (présent $t=0$ et futur $t=1$). Soit $Y_0$ et $Y_1$ les revenus du ménage aux périodes 0 et 1, $A_0$ la richesse initiale (épargne ou dette), et $r$ le taux d'intérêt réel.
La contrainte budgétaire à la période 0 est:
$C_0 + A_1 = Y_0 + A_0$
où $A_1$ est l'épargne (ou la dette) reportée à la période 1.

La contrainte budgétaire à la période 1 est:
$C_1 = Y_1 + (1+r)A_1$

En substituant $A_1$ de la première équation dans la seconde, on obtient la contrainte budgétaire intertemporelle sous forme de valeur présente:

$$C_0 + \frac{C_1}{1+r} = Y_0 + A_0 + \frac{Y_1}{1+r}$$

Cette équation stipule que la valeur présente totale de la consommation du ménage sur les deux périodes doit être égale à la valeur présente totale de ses ressources (richesse initiale plus revenus présents et futurs actualisés).

[[WIDGET:CustomFigure:contrainte_budgetaire:Représentation graphique de la contrainte budgétaire intertemporelle]]

### Le Problème de Maximisation

Le ménage résout le problème d'optimisation suivant:

$$\max_{C_0, C_1} \left[ u(C_0) + \beta u(C_1) \right]$$
sous la contrainte:
$$C_0 + \frac{C_1}{1+r} = Y_0 + A_0 + \frac{Y_1}{1+r}$$

Pour résoudre ce problème, nous utilisons la méthode du Lagrangien:

$$\mathcal{L}(C_0, C_1, \lambda) = u(C_0) + \beta u(C_1) - \lambda \left( C_0 + \frac{C_1}{1+r} - (Y_0 + A_0 + \frac{Y_1}{1+r}) \right)$$

Les conditions de premier ordre (CPO) par rapport à $C_0$ et $C_1$ sont:
1.  $\frac{\partial \mathcal{L}}{\partial C_0} = u'(C_0) - \lambda = 0 \implies u'(C_0) = \lambda$
2.  $\frac{\partial \mathcal{L}}{\partial C_1} = \beta u'(C_1) - \frac{\lambda}{1+r} = 0 \implies \beta u'(C_1) = \frac{\lambda}{1+r}$

En substituant $\lambda$ de la première CPO dans la seconde, nous obtenons l'équation d'Euler:

$$u'(C_0) = \frac{1}{1+r} \beta u'(C_1)$$

ou, de manière équivalente:

$$u'(C_0) = \beta (1+r) u'(C_1)$$

L'équation d'Euler est la pierre angulaire de la théorie de la consommation intertemporelle. Elle indique que, à l'optimum, le taux marginal de substitution intertemporel (TMSI) entre la consommation présente et future doit être égal au prix relatif de la consommation présente en termes de consommation future, qui est $(1+r)$. En d'autres termes, l'utilité marginale de consommer une unité supplémentaire aujourd'hui doit être égale à l'utilité marginale actualisée de consommer cette même unité (plus les intérêts qu'elle aurait générés) demain [[WIDGET:Reference:4]].