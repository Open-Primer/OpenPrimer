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

L'équation d'Euler est la pierre angulaire de la théorie de la consommation intertemporelle. Elle indique que, à l'optimum, le taux marginal de substitution intertemporel (TMSI) entre la consommation présente et future doit être égal au prix relatif de la consommation présente en termes de consommation future, qui est $(1+r)$. En d'autres termes, l'utilité marginale de consommer une unité supplémentaire aujourd'hui doit être égale à l'utilité marginale actualisée de consommer cette mêm'unité (plus les intérêts qu'elle aurait générés) demain [[WIDGET:Reference:4]].

## L'Équation d'Euler et ses Implications
L'équation d'Euler, dérivée des conditions de premier ordre du problème de maximisation de l'utilité intertemporelle, est la pierre angulaire de la théorie de la consommation. Elle s'écrit comme suit :

$$u'(C_t) = \beta (1+r) u'(C_{t+1})$$

Cette équation fondamentale exprime la condition d'optimalité pour un ménage qui cherche à maximiser son utilité sur plusieurs périodes. Elle stipule que, à l'équilibre, l'utilité marginale de consommer une unité supplémentaire aujourd'hui ($u'(C_t)$) doit être égale à l'utilité marginale actualisée de reporter cette consommation à la période suivante. Le terme $\beta (1+r)$ représente le facteur par lequel l'utilité marginale future est pondérée. $\beta$ est le facteur d'escompte subjectif, reflétant la préférence pour le présent du ménage, tandis que $(1+r)$ est le facteur d'actualisation objectif lié au taux d'intérêt réel.

L'intuition économique est la suivante : si un ménage renonce à consommer une unité aujourd'hui, il perd $u'(C_t)$ d'utilité. En revanche, s'il épargne cette unité, elle lui rapportera $(1+r)$ unités à la période suivante, générant une utilité marginale de $(1+r)u'(C_{t+1})$. Cependant, cette utilité future est perçue avec un facteur d'escompte $\beta$. À l'optimum, le ménage ajuste sa consommation de sorte que le gain d'utilité marginale à consommer aujourd'hui soit exactement égal au gain d'utilité marginale actualisée à consommer demain. C'est la condition d'égalisation des utilités marginales actualisées de la consommation entre deux périodes .

[[WIDGET:ConceptLink:utilite_marginale:L'utilité marginale]] est la satisfaction supplémentaire qu'un individu retire de la consommation d'une unité supplémentaire d'un bien ou d'un service. Dans le contexte intertemporel, l'équation d'Euler assure que le ménage ne peut pas augmenter son utilité totale en transférant une unité de consommation d'une période à l'autre.

[[WIDGET:Mermaid:euler_intuition_flowchart:Intuition économique de l'équation d'Euler]]

Une implication majeure de l'équation d'Euler est le [[WIDGET:ConceptLink:lissage_consommation:lissage de la consommation]]. Sous des hypothèses standard d'utilité concave (utilité marginale décroissante), les ménages préfèrent une consommation relativement stable au fil du temps plutôt que des fluctuations importantes. L'équation d'Euler implique que les ménages vont chercher à maintenir leurs utilités marginales de consommation relativement constantes, ce qui se traduit par une consommation stable, même face à des chocs de revenu temporaires. Ce principe est au cœur des théories du revenu permanent de [[WIDGET:RealPerson:friedman:Milton Friedman]] et du cycle de vie de [[WIDGET:RealPerson:modigliani:Franco Modigliani]] .

En réponse aux chocs, l'équation d'Euler guide le comportement du ménage :
*   **Choc de revenu temporaire :** Un ménage recevant un revenu temporaire inattendu n'augmentera pas sa consommation de manière significative dans la période actuelle. Il épargnera une grande partie de ce revenu pour le répartir sur toutes les périodes futures, lissant ainsi l'impact du choc sur sa consommation.
*   **Choc de revenu permanent :** Un choc de revenu permanent aura un impact plus important sur la consommation actuelle et future, car la richesse totale du ménage est durablement modifiée.
*   **Choc de taux d'intérêt :** Une variation du taux d'intérêt réel modifie le « prix » de la consommation présente par rapport à la consommation future, ainsi que la valeur actualisée de la richesse du ménage. L'analyse de ces effets est cruciale et sera détaillée dans la section suivante.

[[WIDGET:CustomFigure:euler_equation_implications:Illustration des implications de l'équation d'Euler sur le lissage de la consommation]]
## Analyse des Effets de Richesse et de Substitution

Une variation du taux d'intérêt réel ($r$) a des conséquences complexes sur les décisions de consommation intertemporelle des ménages, car elle modifie à la fois le coût relatif de la consommation et la valeur de la richesse. Pour comprendre ces mécanismes, il est essentiel de distinguer l'[[WIDGET:Glossary:effet_substitution:effet de substitution]] et l'[[WIDGET:Glossary:effet_richesse:effet de richesse]].

### L'Effet de Substitution

L'effet de substitution capture le changement dans la consommation dû à une modification du prix relatif de la consommation présente par rapport à la consommation future, toutes choses égales par ailleurs (c'est-à-dire en maintenant le niveau d'utilité constant).
Lorsque le taux d'intérêt réel ($r$) augmente, la consommation présente ($C_t$) devient relativement plus chère par rapport à la consommation future ($C_{t+1}$). En effet, renoncer à consommer une unité aujourd'hui permet d'obtenir $(1+r)$ unités de consommation supplémentaires demain. Un $r$ plus élevé rend l'épargne plus attractive.
*   **Mécanisme :** Une augmentation de $r$ incite le ménage à substituer de la consommation présente par de la consommation future. Il réduit sa consommation actuelle pour épargner davantage et profiter d'un rendement plus élevé, ce qui lui permettra de consommer plus à l'avenir.
*   **Direction :** L'effet de substitution est toujours négatif pour la consommation présente. Une augmentation de $r$ conduit à une diminution de $C_t$ et une augmentation de $C_{t+1}$ (si l'utilité marginale de la consommation future est positive).

### L'Effet de Richesse

L'effet de richesse, également appelé effet de revenu, reflète le changement dans la consommation résultant d'une modification de la valeur actualisée des ressources totales du ménage (sa richesse totale sur l'horizon de vie).
Une variation du taux d'intérêt réel affecte la valeur présente des revenus futurs et de la richesse initiale du ménage.
*   **Pour un ménage prêteur (épargnant net) :** Une augmentation de $r$ rend ses revenus futurs (ou son épargne existante) plus précieux en termes de valeur présente. Le ménage devient effectivement plus riche. Cette augmentation de richesse l'incite à consommer davantage dans toutes les périodes, y compris la période présente.
*   **Pour un un ménage emprunteur (débiteur net) :** Une augmentation de $r$ rend le coût de ses dettes plus élevé et réduit la valeur présente nette de ses ressources. Le ménage devient effectivement plus pauvre. Cette diminution de richesse l'incite à réduire sa consommation dans toutes les périodes.
*   **Direction :** L'effet de richesse est ambigu pour la consommation présente. Il est positif pour les prêteurs et négatif pour les emprunteurs.

### Synthès'et Illustration

L'effet total d'une variation du taux d'intérêt réel sur la consommation présente est la somme de l'effet de substitution et de l'effet de richesse.
*   **Pour un prêteur :** L'effet de substitution pousse à réduire $C_t$, tandis que l'effet de richesse pousse à augmenter $C_t$. L'effet net sur $C_t$ est donc ambigu et dépend de l'ampleur relative des deux effets.
*   **Pour un emprunteur :** L'effet de substitution pousse à réduire $C_t$, et l'effet de richesse pousse également à réduire $C_t$. Dans ce cas, l'effet total sur $C_t$ est clairement négatif.

[[WIDGET:CustomFigure:effets_r_diagram:Représentation graphique des effets de substitution et de richesse d'une augmentation du taux d'intérêt]]

Ce diagramme illustre comment une augmentation du taux d'intérêt fait pivoter la contrainte budgétaire intertemporelle. L'effet de substitution est représenté par le mouvement le long d'une courbe d'indifférence vers un point où la consommation future est relativement plus élevée. L'effet de richesse est ensuite représenté par un déplacement parallèle de la contrainte budgétaire (virtuelle) vers une courbe d'indifférence plus élevée ou plus basse, selon que le ménage est prêteur ou emprunteur.

[[WIDGET:Video:intertemporal_choice_r:Explication des effets de richesse et de substitution sur la consommation intertemporelle]]

La compréhension de ces deux effets est cruciale pour analyser l'impact des politiques monétaires (qui influencent les taux d'intérêt) sur les décisions de consommation et d'épargne des ménages, et par extension, sur l'activité économique globale [[WIDGET:Reference:5]].

## Conclusion
Cette leçon a exploré en profondeur le [[WIDGET:ConceptLink:intertemporal_optimization:modèle d'optimisation intertemporelle]] du consommateur, un pilier fondamental de la macroéconomie moderne. Nous avons d'abord établi le cadre dans lequel les ménages prennent des décisions de consommation et d'épargne non pas pour une seule période, mais sur l'ensemble de leur horizon de vie, en tenant compte de leurs préférences et de leurs contraintes budgétaires.

Au cœur de ce modèle se trouve l'[[WIDGET:Glossary:euler_equation:équation d'Euler]], que nous avons dérivée comme la condition de premier ordre de maximisation de l'utilité intertemporelle. Cette équation cruciale révèle comment les ménages égalisent l'utilité marginale actualisée de la consommation entre les périodes, en tenant compte du taux d'intérêt réel. Elle constitue un lien direct entre les préférences des agents et les variables macroéconomiques telles que l'épargne et l'investissement .

[[WIDGET:CustomFigure:euler_equation_formula:Représentation de l'équation d'Euler pour la consommation intertemporelle]]

Nous avons ensuite analysé les mécanismes complexes par lesquels une variation du taux d'intérêt réel affecte les décisions de consommation, en distinguant l'[[WIDGET:ConceptLink:substitution_effect:effet de substitution]] et l'[[WIDGET:ConceptLink:wealth_effect:effet de richesse]]. L'effet de substitution incite à reporter la consommation vers la période où elle est relativement moins chère (ou plus rémunératrice pour l'épargne), tandis que l'effet de richesse modifie la valeur actualisée des ressources du ménage, influençant sa capacité globale à consommer. La compréhension de l'interaction de ces deux effets est essentielle pour prédire la réponse des ménages aux chocs économiques et aux politiques .

[[WIDGET:Mermaid:intertemporal_model_summary:Schéma récapitulatif du modèle de choix intertemporel montrant les préférences et contraintes menant à l'équation d'Euler, l'impact des variations de taux d'intérêt via les effets de substitution et de richesse sur les décisions de consommation/épargne, et l'agrégation vers les variables macroéconomiques et l'analyse politique.]]

La maîtrise de ces concepts est indispensable pour l'analyse des politiques économiques, notamment celles qui influencent les taux d'intérêt (politique monétaire) ou les revenus des ménages (politique fiscale). En effet, les décisions individuelles d'épargne et de consommation agrégées déterminent des variables macroéconomiques clés telles que l'investissement et le niveau général de l'activité économique , [[WIDGET:Reference:6]]. Ce modèle fournit les micro-fondations nécessaires pour comprendre les dynamiques macroéconomiques et pour évaluer l'impact des interventions gouvernementales sur le bien-être des agents et la stabilité économique [[WIDGET:Reference:19]].

[[WIDGET:conclusionSummary]]
[[WIDGET:whatsNext]]
[[WIDGET:goingFurther]]
[[WIDGET:finalEvaluation]]
