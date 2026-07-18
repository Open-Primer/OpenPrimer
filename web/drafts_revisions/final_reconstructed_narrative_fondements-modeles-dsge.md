## Introduction aux modèles DSGE

Les modèles d'équilibre général dynamique stochastique (DSGE) constituent l'épine dorsale de la macroéconomie moderne, offrant un cadre rigoureux pour l'analyse des phénomènes économiques complexes. Émergés des révolutions de la [[WIDGET:ConceptLink:nouvelle_macroeconomie_classique:Nouvelle macroéconomie classique]] et de la [[WIDGET:ConceptLink:nouvelle_macroeconomie_keynesienne:Nouvelle macroéconomie keynésienne]], ces modèles sont devenus des outils indispensables pour les chercheurs, les banques centrales et les institutions internationales dans leur quête de compréhension des cycles économiques, de la croissance à long terme et des effets des politiques économiques [[WIDGET:Reference:2]], [[WIDGET:Reference:5]].

Leur importance réside dans leur capacité à modéliser l'économie comme un systèm'intégré où les décisions des agents économiques (ménages, firmes, gouvernement) sont prises de manière optimale et prospective, en tenant compte des chocs stochastiques et des interactions sur différents marchés. Cette approche micro-fondée permet non seulement d'expliquer les fluctuations agrégées, mais aussi d'évaluer de manière cohérente l'impact des politiques monétaires et budgétaires, en répondant à la célèbre [[WIDGET:ConceptLink:critique_de_lucas:Critique de Lucas]] [[WIDGET:Reference:10]]. En effet, en modélisant les comportements des agents de manière structurelle, les DSGE permettent de simuler des scénarios contrefactuels et d'anticiper comment les agents modifieraient leurs décisions face à un changement de régime politique.

[[WIDGET:Mermaid:dsge_structure_flow:Diagramme de flux simplifié de la structure d'un modèle DSGE]]

Cette leçon vise à vous familiariser avec les fondements théoriques et méthodologiques des modèles DSGE. À l'issue de ce module, vous devriez être capable de:
*   Comprendre la structure fondamentale et les hypothèses clés des modèles DSGE.
*   Maîtriser les concepts d'optimisation intertemporelle et d'équilibre général dans un contexte dynamique et stochastique.
*   Appréhender la pertinence et les limites des DSGE pour l'analyse des politiques économiques et la prévision.

## Les fondements microéconomiques: Agents représentatifs et optimisation intertemporelle

Au cœur de tout modèle DSGE se trouve une modélisation explicite des comportements des agents économiques, ancrée dans des principes microéconomiques. Plutôt que de postuler des relations agrégées *ad hoc*, les DSGE dérivent les dynamiques macroéconomiques de l'optimisation des agents individuels. Une simplification courante, bien que parfois critiquée, est l'utilisation de l'[[WIDGET:Glossary:agent_representatif:agent représentatif]]. Ce concept suppose que tous les ménages d'un même type (ou toutes les firmes d'un même secteur) sont identiques et peuvent être représentés par un seul agent « moyen » qui prend des décisions optimales. Cette hypothèse simplifie considérablement la modélisation en permettant d'agréger les comportements individuels sans avoir à résoudre un problème de distribution complexe.

### L'optimisation intertemporelle des ménages

Les ménages, en tant qu'agents représentatifs, sont confrontés à un problème d'[[WIDGET:ConceptLink:optimisation_intertemporelle:optimisation intertemporelle]] sous incertitude. Leur objectif est de maximiser leur utilité totale sur un horizon infini, en tenant compte du fait que la consommation et le loisir d'aujourd'hui affectent leurs possibilités futures. L'utilité future est généralement actualisée par un facteur de préférence temporelle, reflétant la préférence des agents pour la consommation présente par rapport à la consommation future. Le problème typique d'un ménage représentatif peut être formulé comme la maximisation de l'espérance de l'utilité actualisée:

$$
E_0 \sum_{t=0}^{\infty} \beta^t U(C_t, L_t)
$$

où $E_0$ est l'opérateur d'espérance conditionnelle à l'information disponible en $t=0$, $\beta \in (0,1)$ est le facteur d'actualisation, $U(\cdot)$ est la fonction d'utilité, $C_t$ est la consommation et $L_t$ est le loisir à la période $t$. Cette maximisation est soumise à une contrainte budgétaire intertemporelle qui relie la consommation, l'épargne, le revenu du travail et le revenu du capital.

Une fonction d'utilité couramment utilisée est la fonction d'utilité à aversion relative au risque constante (CRRA - Constant Relative Risk Aversion), souvent sous la forme:

$$
U(C_t, L_t) = \frac{C_t^{1-\sigma}}{1-\sigma} - \chi \frac{L_t^{1+\psi}}{1+\psi}
$$

où $\sigma > 0$ est l'inverse de l'élasticité de substitution intertemporelle de la consommation (et mesure l'aversion au risque), et $\psi > 0$ est l'inverse de l'élasticité de Frisch de l'offre de travail.

[[WIDGET:CustomFigure:crra_utility_function:Exemple graphique d'une fonction d'utilité CRRA pour la consommation]]

### L'optimisation intertemporelle des firmes

De manière similaire, les firmes représentatives cherchent à maximiser leurs profits (ou la valeur de la firme) sur un horizon infini. Elles le font en choisissant de manière optimale leurs niveaux de production, d'investissement, de capital et de travail, en fonction de la technologie disponible, des prix des intrants et des prix de vente de leurs produits. La technologie de production est généralement décrite par une fonction de production agrégée, telle que la fonction de production Cobb-Douglas:

$$
Y_t = A_t K_t^\alpha N_t^{1-\alpha}
$$

où $Y_t$ est la production, $A_t$ est la productivité totale des facteurs (un choc technologique stochastique), $K_t$ est le stock de capital, $N_t$ est le travail, et $\alpha \in (0,1)$ est la part du capital dans le revenu. Les firmes prennent leurs décisions en anticipant les chocs futurs et les politiques économiques, en formant des [[WIDGET:ConceptLink:anticipations_rationnelles:anticipations rationnelles]] [[WIDGET:Reference:3]], [[WIDGET:Reference:4]].

Ces problèmes d'optimisation, pour les ménages comme pour les firmes, sont résolus en utilisant des techniques de programmation dynamique, souvent sous la forme d'équations d'Euler qui caractérisent les conditions d'optimalité intertemporelle.

### Contraintes budgétaires intertemporelles et conditions d'équilibre

L'optimisation des ménages et des firmes, telle que décrite précédemment, est intrinsèquement liée à leurs contraintes budgétaires intertemporelles. Ces contraintes définissent l'ensemble des choix réalisables pour les agents économiques sur l'ensemble de leur horizon temporel, en tenant compte de leurs revenus, de leurs dépenses et de leurs possibilités d'emprunt ou d'épargne.

Pour un ménage représentatif, la contrainte budgétaire intertemporelle stipule que la valeur actualisée de sa consommation totale ne peut excéder la valeur actualisée de ses revenus (salaires, revenus du capital) plus sa richesse initiale. En d'autres termes, un ménage ne peut pas dépenser plus qu'il ne gagne sur l'ensemble de sa vie, en tenant compte des intérêts. Formellement, elle peut s'écrire, en l'absence de transferts gouvernementaux et avec un actif financier unique (par exemple, des obligations) :

$$
\sum_{t=0}^{\infty} \frac{C_t}{(1+r_t)^t} \le A_0 + \sum_{t=0}^{\infty} \frac{W_t N_t + R_t K_t}{(1+r_t)^t}
$$

où $C_t$ est la consommation, $r_t$ le taux d'intérêt réel, $A_0$ la richesse initiale, $W_t$ le salaire réel, $N_t$ le travail offert, $R_t$ le rendement réel du capital et $K_t$ le capital possédé. Cette formulation met en évidence le rôle crucial du [[WIDGET:ConceptLink:taux_interet_reel:taux d'intérêt réel]] comme prix intertemporel, influençant les décisions d'épargne et d'investissement [[WIDGET:Reference:2]].

[[WIDGET:CustomFigure:budget_constraint_graph:Représentation graphique d'une contrainte budgétaire intertemporelle pour un ménage]]

De même, pour une firme représentative, la contrainte budgétaire intertemporelle est souvent implicite dans sa décision de maximisation de la valeur. La valeur actualisée des profits futurs de la firme doit être suffisante pour couvrir ses investissements et distribuer des dividendes aux actionnaires. L'équation d'accumulation du capital est une composante clé de cette contrainte :

$$
K_{t+1} = (1-\delta)K_t + I_t
$$

où $K_t$ est le stock de capital, $\delta$ est le taux de dépréciation du capital, et $I_t$ est l'investissement. Les décisions d'investissement $I_t$ sont prises pour maximiser la valeur présente des profits futurs, en tenant compte du coût du capital et des rendements attendus [[WIDGET:Reference:13]].

L'équilibre général d'un modèle DSGE est atteint lorsque tous les agents économiques (ménages, firmes, et potentiellement le gouvernement et le secteur extérieur) optimisent leurs fonctions objectives sous leurs contraintes budgétaires respectives, et que tous les marchés (biens et services, travail, capital, monnaie) s'équilibrent simultanément. Cela implique que les prix et les quantités sont tels qu'il n'y a pas d'incitation pour un agent à modifier son comportement, étant donné le comportement des autres agents. Les conditions d'optimalité des agents, souvent exprimées par des équations d'Euler (par exemple, l'[[WIDGET:Glossary:euler_equation:équation d'Euler]] pour la consommation), et les contraintes budgétaires intertemporelles sont les piliers de cet équilibre. L'interaction de ces éléments détermine les trajectoires dynamiques des variables macroéconomiques clés, telles que la production, la consommation, l'investissement, l'emploi et l'inflation [[WIDGET:Reference:5]].

[[WIDGET:Mermaid:dsge_equilibrium_flow:Diagramme de flux de l'équilibre général dans un modèle DSGE]]

### Méthodes de résolution: La programmation dynamique

La résolution des problèmes d'optimisation intertemporelle sous incertitude, qui sont au cœur des modèles DSGE, repose fondamentalement sur la [[WIDGET:ConceptLink:programmation_dynamique:programmation dynamique]]. Développée par [[WIDGET:RealPerson:richard_bellman:Richard Bellman]], cette approche permet de décomposer un problème complexe en une séquence de problèmes plus simples, résolus de manière récursive. Elle est particulièrement adaptée aux situations où les décisions prises aujourd'hui affectent les opportunités futures.

Le principe central de la programmation dynamique est le principe d'optimalité de Bellman, qui stipule qu'une politique optimale a la propriété qu'à tout instant $t$, quelles que soient les décisions passées, les décisions restantes doivent constituer une politique optimale par rapport à l'état résultant des décisions passées. Cela conduit à la formulation de la fonction de valeur et de l'équation de Bellman.

La **fonction de valeur** $V(S_t)$ représente la valeur maximale (utilité ou profit actualisé) qu'un agent peut obtenir à partir d'un état $S_t$ donné, en suivant une politique optimale pour toutes les périodes futures. L'état $S_t$ regroupe toutes les variables pertinentes qui affectent les décisions futures de l'agent (par exemple, le stock de capital pour une firme, ou la richesse pour un ménage).

L'**équation de Bellman** exprime la fonction de valeur de manière récursive. Elle indique que la valeur maximale à l'instant $t$ est égale à la récompense immédiate (utilité ou profit) de la décision optimale prise à l'instant $t$, plus la valeur actualisée de la valeur maximale future (espérée), compte tenu de l'état résultant de cette décision. Pour un problème de maximisation, l'équation de Bellman s'écrit généralement sous la forme:

$$
V(S_t) = \max_{C_t, I_t, \dots} \left\{ U(C_t, I_t, \dots) + \beta E_t[V(S_{t+1})] \right\}
$$

où $U(\cdot)$ est la fonction d'utilité ou de profit instantanée, $\beta$ est le facteur d'actualisation, et $E_t[V(S_{t+1})]$ est l'espérance de la fonction de valeur future, conditionnelle à l'information disponible en $t$. La résolution de cette équation fonctionnelle permet de déterminer la politique optimale, c'est-à-dire les règles de décision qui maximisent la fonction de valeur à chaque période et pour chaque état possible [[WIDGET:Reference:4]], [[WIDGET:Reference:10]].

[[WIDGET:Video:bellman_equation_explainer:Explication détaillée de l'équation de Bellman et de la programmation dynamique]]

## Conclusion
En somme, cette exploration des fondements des modèles DSGE a mis en lumière leur architecture rigoureuse, ancrée dans les principes de la microéconomie. Nous avons souligné le rôle central de l'[[WIDGET:ConceptLink:agent_representatif:agent représentatif]], dont les décisions d'optimisation intertemporelle, sous [[WIDGET:Glossary:contraintes_intertemporelles:contraintes intertemporelles]] de ressources et de budget, constituent la pierre angulaire de ces modèles. La résolution de ces problèmes d'optimisation, particulièrement en présence d'incertitude, s'appuie fondamentalement sur la [[WIDGET:ConceptLink:programmation_dynamique:programmation dynamique]] et l'équation de Bellman, permettant de dériver des règles de décision optimales pour les agents. C'est cette combinaison de micro-fondations, d'anticipations prospectives et de méthodes de résolution avancées qui confère aux modèles DSGE leur capacité à analyser les dynamiques macroéconomiques et les effets des politiques.

Malgré leur sophistication et leur utilité pour l'analyse des politiques, les modèles DSGE ne sont pas exempts de critiques. L'hypothèse de l'[[WIDGET:ConceptLink:anticipations_rationnelles:anticipations rationnelles]], bien que puissante, est souvent jugée trop exigeante, impliquant une connaissance parfaite des agents sur la structure de l'économie et la distribution des chocs futurs [[WIDGET:Reference:10]]. La simplification par l'[[WIDGET:ConceptLink:agent_representatif:agent représentatif]] est une autre limite majeure, car elle ignore l'hétérogénéité des ménages et des entreprises, ce qui peut masquer des dynamiques distributives importantes ou des comportements agrégés non linéaires [[WIDGET:Reference:16]]. De plus, les modèles DSGE initiaux ont souvent eu du mal à rendre compte de phénomènes complexes comme les crises financières, en raison d'une modélisation insuffisante des frictions financières et des interactions entre les secteurs bancaire et réel [[WIDGET:Reference:15]]. Le débat sur la calibration versus l'estimation bayésienne des paramètrès reste également vif, influençant la robustesse et la généralisabilité des résultats [[WIDGET:Reference:11]], [[WIDGET:Reference:12]].

[[WIDGET:CustomFigure:dsge_extensions_diagram:Évolution et extensions des modèles DSGE]]

Cependant, le cadre DSGE est en constante évolution pour adresser ces limitations et intégrer de nouvelles dimensions. Des extensions significatives incluent l'introduction d'agents hétérogènes (modèles HANK - Heterogeneous Agent New Keynesian) pour mieux capturer les effets distributifs et les réponses agrégées aux chocs [[WIDGET:Reference:6]]. La modélisation des frictions financières, des marchés du travail segmentés, et des comportements de [[WIDGET:ConceptLink:rationalite_limitee:rationalité limitée]] ou d'apprentissage est également un axe de recherche actif. Par ailleurs, l'intégration de chocs non-linéaires, la prise en compte des externalités et des biens publics, ou encore l'application à des problématiques de long terme comme la croissance endogène [[WIDGET:Reference:7]], [[WIDGET:Reference:8]] ou le changement climatique, élargissent continuellement le champ d'application des DSGE. Ces avancées témoignent de la flexibilité et de la pertinence continue de cette approche pour la recherche et l'élaboration des politiques macroéconomiques.

[[WIDGET:Mermaid:dsge_modeling_cycle:Cycle de développement et d'application d'un modèle DSGE]]

[[WIDGET:conclusionSummary]]

[[WIDGET:whatsNext]]

[[WIDGET:goingFurther]]

[[WIDGET:finalEvaluation]]
