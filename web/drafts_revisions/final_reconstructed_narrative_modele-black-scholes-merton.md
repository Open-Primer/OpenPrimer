## Introduction au Modèle de Black-Scholes-Merton

Avant l'avènement du modèle de Black-Scholes-Merton (BSM), la valorisation des options était largement une affaire d'intuition et de méthodes *ad hoc*, manquant de fondements théoriques rigoureux. Le marché des produits dérivés, bien qu'existant, était fragmenté et moins sophistiqué. La publication révolutionnaire de l'article « The Pricing of Options and Corporate Liabilities » par [[WIDGET:RealPerson:fischer_black:Fischer Black]] et [[WIDGET:RealPerson:myron_scholes:Myron Scholes]] en 1973, suivie des travaux complémentaires de [[WIDGET:RealPerson:robert_merton:Robert Merton]] qui en a étendu la portée théorique, a marqué un tournant décisif dans la finance moderne [[WIDGET:Reference:3]]. Ces travaux ont été couronnés par le Prix de la Banque de Suèd'en sciences économiques en mémoire d'Alfred Nobel en 1997, décerné à Scholes et Merton (Black étant décédé en 1995).

Le modèle BSM a révolutionné la valorisation des options en fournissant une formule explicite et élégante pour le prix des options européennes, basée sur des principes d'absence d'[[WIDGET:ConceptLink:arbitrage:arbitrage]] et de réplication dynamique. Il a transformé la finance quantitative en une discipline scientifique, permettant aux acteurs du marché de valoriser, de gérer le risque et de négocier des [[WIDGET:Glossary:produit_derive:produits dérivés]] avec une précision sans précédent. Son impact s'est étendu bien au-delà de la simple valorisation des options, influençant la gestion des risques, la structuration des produits financiers complexes et le développement de nouveaux marchés.

[[WIDGET:Mermaid:bsm_historical_context:Contexte historique et impact du modèle de Black-Scholes-Merton]]

Dans cette leçon, nous explorerons en profondeur le modèle de Black-Scholes-Merton. Les objectifs d'apprentissage sont les suivants :
*   Comprendre le contexte historique et l'importance fondamentale du modèle BSM dans la finance quantitative.
*   Identifier et analyser les hypothèses clés sous-jacentes au modèle, ainsi que leurs implications.
*   Dériver l'équation différentielle partielle de Black-Scholes et sa solution.
*   Appréhender la formule de valorisation des options européennes et ses « Greeks » (sensibilités).
*   Discuter des limites du modèl'et des extensions courantes développées pour y remédier.

## Les Hypothèses Fondamentales du Modèle

Le modèle de Black-Scholes-Merton repose sur un ensemble d'hypothèses simplificatrices qui sont cruciales pour sa tractabilité mathématique et la dérivation d'une solution en forme fermée. Bien que ces hypothèses ne soient pas toujours parfaitement vérifiées dans le monde réel, elles permettent de construire un cadre théorique robuste qui sert de point de départ à des modèles plus complexes. Comprendre ces hypothèses est essentiel pour apprécier à la fois la puissance et les limites du modèle.

Voici les hypothèses fondamentales du modèle BSM et leur impact sur la modélisation :

1.  **Absence d'opportunités d'arbitrage** : Il n'existe aucune stratégie sans risque permettant de générer un profit positif. Cette hypothès'est la pierre angulaire de la théorie de la valorisation sans arbitrage et garantit l'unicité du prix de l'option [[WIDGET:Reference:4]].
2.  **Marché parfait** :
    *   **Liquidité parfaite** : Les actifs peuvent être achetés ou vendus en toute quantité sans affecter leur prix.
    *   **Absence de coûts de transaction** : Pas de commissions, de frais ou de taxes.
    *   **Divisibilité des actifs** : Il est possible d'acheter ou de vendre des fractions d'actifs.
    *   **Pas de restrictions sur les ventes à découvert** : Les actifs peuvent être vendus à découvert sans coût ni restriction.
    *   **Possibilité d'emprunter et de prêter au taux sans risque** : Les investisseurs peuvent emprunter ou prêter des fonds à un taux d'intérêt sans risque constant.
    Ces conditions simplifient considérablement le problèm'en éliminant les frictions de marché.
3.  **Taux d'intérêt sans risque constant et connu** : Le taux d'intérêt sans risque ($r$) est constant et identique pour l l'emprunt et le prêt sur toute la durée de vie de l'option. Cette hypothèse simplifie le calcul de la valeur temporelle de l'argent.
4.  **Absence de dividendes sur l'actif sous-jacent** : L'actif sous-jacent (par exemple, une action) ne verse pas de dividendes pendant la durée de vie de l'option. Cette simplification est souvent assouplie dans les extensions du modèle pour inclure des dividendes connus ou continus [[WIDGET:Reference:3]].
5.  **Prix de l'actif sous-jacent suit un mouvement brownien géométrique (MBG)** : C'est l'hypothèse la plus technique et fondamentale. Elle implique que le logarithme du prix de l'actif suit un processus de Wiener (mouvement brownien), et que les rendements de l'actif sont distribués normalement.
    *   **Log-normalité des prix** : Le prix de l'actif sous-jacent à l'échéance est log-normalement distribué. Cela signifie que les prix ne peuvent pas être négatifs.
    *   **Volatilité constante** : La [[WIDGET:Glossary:volatilite:volatilité]] ($\sigma$) de l'actif sous-jacent est constante et connue sur toute la durée de vie de l'option. C'est une simplification majeure, car la volatilité est connue pour varier dans le temps sur les marchés réels.
    *   **Continuité des prix** : Les prix de l'actif sous-jacent évoluent de manière continue, sans sauts brusques. Cela exclut les événements de marché soudains ou les chocs.
    Cette hypothèse permet d'utiliser les outils du calcul stochastique pour modéliser la dynamique des prix [[WIDGET:Reference:2]], [[WIDGET:Reference:11]].

[[WIDGET:Image:log_normal_dist:Illustration de la distribution log-normale des prix de l'actif sous-jacent]]

6.  **Options de style européen** : Le modèl'est spécifiquement conçu pour les options européennes, qui ne peuvent être exercées qu'à leur date d'échéance. Les options américaines, qui peuvent être exercées à tout moment avant ou à l'échéance, nécessitent des méthodes de valorisation plus complexes.
7.  **Durée de vie de l'option connue** : La date d'échéance de l'option est fixe et connue.

[[WIDGET:Mermaid:bsm_assumptions_flow:Schéma des hypothèses clés du modèle de Black-Scholes-Merton]]

L'impact combiné de ces hypothèses est de simplifier le problème de valorisation à un point où une solution analytique peut être dérivée. Elles permettent de construire un portefeuille de réplication dynamique qui élimine le risque et, par conséquent, de valoriser l'option sans référence aux préférences de risque des investisseurs. Cependant, la non-réalisation de certaines de ces hypothèses dans la pratique (par exemple, la volatilité constante ou l'absence de sauts de prix) a conduit au développement de modèles d'options plus sophistiqués, qui seront abordés dans des leçons ultérieures.

## Dérivation de l'Équation aux Dérivées Partielles de Black-Scholes

La puissance du modèle de Black-Scholes réside dans sa capacité à dériver une équation aux dérivées partielles (EDP) dont la solution représente le prix de l'option. Cette dérivation repose sur le principe d'absence d'opportunité d'arbitrage et la construction d'un portefeuille de réplication sans risque.

### 1. Modélisation de l'Actif Sous-jacent et de l'Option

Conformément à nos hypothèses, le prix de l'actif sous-jacent $S_t$ suit un [[WIDGET:ConceptLink:mouvement_brownien_geometrique:Mouvement Brownien Géométrique (MBG)]]. Son évolution est décrite par l'équation différentielle stochastique (EDS) suivante :

$dS_t = \mu S_t dt + \sigma S_t dW_t$

où $\mu$ est le taux de rendement espéré de l'actif, $\sigma$ est sa volatilité, et $dW_t$ est un processus de Wiener (ou mouvement brownien standard).

Le prix de l'option, que nous noterons $V$, est une fonction du prix de l'actif sous-jacent $S$ et du temps $t$, soit $V(S, t)$. Pour déterminer l'évolution stochastique de $V$, nous devons appliquer le [[WIDGET:ConceptLink:ito_lemma:Lemme d'Itô]]. Ce théorème fondamental du calcul stochastique, développé par [[WIDGET:RealPerson:k_ito:Kiyosi Itô]], permet de calculer la différentielle d'une fonction d'un processus stochastique [[WIDGET:Reference:2]], [[WIDGET:Reference:11]].

L'application du Lemme d'Itô à $V(S, t)$ donne :

$dV = \left( \frac{\partial V}{\partial t} + \mu S \frac{\partial V}{\partial S} + \frac{1}{2} \sigma^2 S^2 \frac{\partial^2 V}{\partial S^2} \right) dt + \sigma S \frac{\partial V}{\partial S} dW_t$

Cette équation décrit comment le prix de l'option change en fonction du temps, du prix de l'actif sous-jacent et de sa volatilité.

### 2. Construction d'un Portefeuille de Réplication Sans Risque (Delta-Hedging)

L'étape cruciale de la dérivation est la construction d'un portefeuille qui est instantanément sans risque. Ce concept est connu sous le nom de [[WIDGET:Glossary:delta_hedging:delta-hedging]]. L'idée est de combiner l'option avec une certaine quantité de l'actif sous-jacent de manière à ce que le portefeuille résultant soit immunisé contre les petites variations du prix de l'actif sous-jacent.

Considérons un portefeuille $\Pi$ composé d'une option de vente (ou d'achat) et d'une position courte (vente à découvert) sur $\Delta$ unités de l'actif sous-jacent :

$\Pi = V - \Delta S$

où $\Delta = \frac{\partial V}{\partial S}$ est le delta de l'option, représentant la sensibilité du prix de l'option aux variations du prix de l'actif sous-jacent.

La variation de la valeur de ce portefeuille $d\Pi$ est donnée par :

$d\Pi = dV - \Delta dS$

En substituant les expressions de $dV$ et $dS$ :

$d\Pi = \left( \frac{\partial V}{\partial t} + \mu S \frac{\partial V}{\partial S} + \frac{1}{2} \sigma^2 S^2 \frac{\partial^2 V}{\partial S^2} \right) dt + \sigma S \frac{\partial V}{\partial S} dW_t - \Delta (\mu S dt + \sigma S dW_t)$

Puisque $\Delta = \frac{\partial V}{\partial S}$, les termes stochastiques en $dW_t$ s'annulent :

$\sigma S \frac{\partial V}{\partial S} dW_t - \frac{\partial V}{\partial S} \sigma S dW_t = 0$

Il en résulte que la variation du portefeuille est purement déterministe :

$d\Pi = \left( \frac{\partial V}{\partial t} + \frac{1}{2} \sigma^2 S^2 \frac{\partial^2 V}{\partial S^2} \right) dt$

Ce portefeuille est désormais sans risque car il ne contient plus de terme $dW_t$.

### 3. Application du Principe d'Absence d'Arbitrage et Dérivation de l'EDP

Selon le principe d'absence d'arbitrage, un portefeuille sans risque doit rapporter le taux d'intérêt sans risque $r$. Ainsi, la variation de la valeur du portefeuille doit être égale à la valeur du portefeuille multipliée par le taux sans risque et la durée $dt$:

$d\Pi = r \Pi dt$

En substituant l'expression de $\Pi = V - \Delta S$ et l'expression de $d\Pi$ :

$\left( \frac{\partial V}{\partial t} + \frac{1}{2} \sigma^2 S^2 \frac{\partial^2 V}{\partial S^2} \right) dt = r (V - \Delta S) dt$

En divisant par $dt$ et en remplaçant $\Delta$ par $\frac{\partial V}{\partial S}$ :

$\frac{\partial V}{\partial t} + \frac{1}{2} \sigma^2 S^2 \frac{\partial^2 V}{\partial S^2} = r V - r S \frac{\partial V}{\partial S}$

En réarrangeant les termes, nous obtenons l'Équation aux Dérivées Partielles de Black-Scholes-Merton [[WIDGET:Reference:3]], [[WIDGET:Reference:4]]:

$\frac{\partial V}{\partial t} + r S \frac{\partial V}{\partial S} + \frac{1}{2} \sigma^2 S^2 \frac{\partial^2 V}{\partial S^2} - r V = 0$

Cette EDP doit être résolue avec des conditions aux limites spécifiques à l'option considérée (par exemple, pour une option d'achat européenne, $V(S, T) = \max(S-K, 0)$ à l'échéance $T$). Il est important de noter que le taux de rendement espéré de l'actif sous-jacent $\mu$ n'apparaît pas dans l'EDP finale. Cela signifie que le prix de l'option ne dépend pas des préférences de risque des investisseurs, mais uniquement des paramètrès du marché et de l'actif sous-jacent.

[[WIDGET:Mermaid:bsm_derivation_flow:Flux de dérivation de l'équation de Black-Scholes, illustrant les étapes clés du processus]]

## La Formule de Valorisation des Options Européennes

La résolution de l'EDP de Black-Scholes, avec les conditions aux limites appropriées, conduit à une solution analytique élégante pour la valorisation des options européennes. Cette solution est l'une des formules les plus célèbres de la finance quantitative.

### 1. Formule de Black-Scholes pour une Option d'Achat Européenne (Call)

Le prix d'une option d'achat européenne $C(S, t)$ est donné par :

$C(S, t) = S N(d_1) - K e^{-r(T-t)} N(d_2)$

où :
*   $S$ est le prix actuel de l'actif sous-jacent.
*   $K$ est le prix d'exercice (strike price) de l'option.
*   $T$ est la date d'échéance de l'option.
*   $t$ est le temps actuel.
*   $r$ est le taux d'intérêt sans risque annualisé et continu.
*   $\sigma$ est la volatilité annualisée de l'actif sous-jacent.
*   $N(x)$ est la fonction de répartition cumulative de la loi normale centrée réduite (c'est-à-dire la probabilité qu'une variable normale standard soit inférieure ou égale à $x$).

Les termes $d_1$ et $d_2$ sont définis comme suit :

$d_1 = \frac{\ln(S/K) + (r + \sigma^2/2)(T-t)}{\sigma \sqrt{T-t}}$

$d_2 = d_1 - \sigma \sqrt{T-t}$

### 2. Interprétation Économique des Termes

La formule peut être interprétée comme la différence entre la valeur actuelle espérée de la réception de l'actif sous-jacent si l'option est exercée, et la valeur actuelle espérée du paiement du prix d'exercice si l'option est exercée.

*   **$S N(d_1)$** : Représente la valeur actuelle espérée du gain lié à la possession de l'actif sous-jacent à l'échéance, pondérée par la [[WIDGET:ConceptLink:probabilite_neutre_risque:probabilité neutre au risque]] que l'option expire dans la monnaie.
*   **$K e^{-r(T-t)} N(d_2)$** : Représente la valeur actuelle espérée du paiement du prix d'exercice à l'échéance, pondérée par la probabilité neutre au risque que l'option expire dans la monnaie.

Les termes $N(d_1)$ et $N(d_2)$ peuvent être vus comme des probabilités dans un monde neutre au risque. $N(d_2)$ est la probabilité que l'option d'achat expire dans la monnaie (c'est-à-dire $S_T > K$). $N(d_1)$ est légèrement différent et est lié à la probabilité que l'option expire dans la monnaie, mais dans un contexte où l'actif sous-jacent est utilisé comme numéraire.

### 3. Formule de Black-Scholes pour une Option de Vente Européenne (Put)

Le prix d'une option de vente européenne $P(S, t)$ est donné par :

$P(S, t) = K e^{-r(T-t)} N(-d_2) - S N(-d_1)$

Cette formule peut également être dérivée directement de l'EDP de Black-Scholes avec la condition aux limites $V(S, T) = \max(K-S, 0)$, ou plus simplement via la [[WIDGET:ConceptLink:parite_put_call:Parité Put-Call]] :

$C(S, t) - P(S, t) = S - K e^{-r(T-t)}$

### 4. Les « Grecques » : Sensibilités du Prix de l'Option

Les [[WIDGET:Glossary:grecques:Grecques]] sont des mesures de la sensibilité du prix d'une option aux variations des paramètrès sous-jacents du modèle. Elles sont essentielles pour la gestion des risques etle hedging des portefeuilles d'options [[WIDGET:Reference:3]], [[WIDGET:Reference:14]].

*   **Delta ($\Delta = \frac{\partial V}{\partial S}$)** : Mesure la variation du prix de l'option pour une variation d'un euro du prix de l'actif sous-jacent. Il est crucial pour le delta-hedging, indiquant la quantité d'actif sous-jacent à détenir pour couvrir le risque de prix.
*   **Gamma ($\Gamma = \frac{\partial^2 V}{\partial S^2}$)** : Mesure la variation du delta de l'option pour une variation d'un euro du prix de l'actif sous-jacent. Un gamma élevé indique que le delta change rapidement, nécessitant des ajustements de couverture plus fréquents.
*   **Theta ($\Theta = \frac{\partial V}{\partial t}$)** : Mesure la variation du prix de l'option pour une variation d'un jour du temps restant jusqu'à l'échéance (décroissance temporelle). Le theta est généralement négatif pour les options longues, signifiant que leur valeur diminue avec le temps.
*   **Vega ($\mathcal{V} = \frac{\partial V}{\partial \sigma}$)** : Mesure la variation du prix de l'option pour une variation d'un point de pourcentage de la volatilité implicite de l'actif sous-jacent. Le vega est positif pour les options longues, indiquant que leur valeur augmente avec la volatilité.
*   **Rho ($\rho = \frac{\partial V}{\partial r}$)** : Mesure la variation du prix de l'option pour une variation d'un point de pourcentage du taux d'intérêt sans risque.

[[WIDGET:CustomFigure:greeks_formulas:Tableau récapitulatif des principales Grecques, leurs formules et leurs interprétations économiques]]

La compréhension de ces sensibilités est fondamentale pour les praticiens des marchés dérivés, leur permettant d'évaluer et de gérer les risques associés à leurs positions sur options.

Malgré son élégance mathématique et son impact révolutionnaire, le modèle de Black-Scholes-Merton repose sur un ensemble d'hypothèses simplificatrices qui, dans la pratique, ne sont pas toujours vérifiées. Ces écarts par rapport à la réalité des marchés financiers constituent les principales limites et critiques du modèle.

## Limites et Critiques du Modèle de Black-Scholes-Merton

La première et sans doute la plus significative des critiques concerne l'hypothèse de [[WIDGET:ConceptLink:volatilite_constante:volatilité constante]] de l'actif sous-jacent. Le modèle de Black-Scholes-Merton suppose que la volatilité est une constante déterministe sur toute la durée de vie de l'option. Or, les observations empiriques des marchés révèlent que la volatilité n'est pas constante. En effet, la [[WIDGET:Glossary:volatilite_implicite:volatilité implicite]], c'est-à-dire la volatilité qui, une fois insérée dans la formule de Black-Scholes, permet de retrouver le prix de marché de l'option, varie en fonction du prix d'exercice (strike) et de la maturité de l'option. Cette variation est souvent représentée par le phénomène de « sourire de volatilité » (volatility smile) ou de « skew de volatilité » (volatility skew), où les options hors de la monnaie ou très dans la monnaie affichent des volatilités implicites plus élevées que les options à la monnaie [[WIDGET:Reference:16]].

[[WIDGET:CustomFigure:volatility_smile_skew:Illustration schématique du sourire et du skew de volatilité, montrant la volatilité implicite en fonction du prix d'exercice]]

Une autre hypothèse fondamentale est que les rendements de l'actif sous-jacent suivent une [[WIDGET:ConceptLink:distribution_log_normale:distribution log-normale]], ce qui implique que les rendements sont normalement distribués. Cette hypothès'est souvent contredite par les données réelles, qui montrent des distributions de rendements avec des « queues épaisses » (fat tails) et une asymétrie (skewness), c'est-à-dire une probabilité plus élevée d'événements extrêmes (chocs importants) que ne le prévoit une distribution normale. Cela conduit le modèle de Black-Scholes-Merton à sous-estimer le prix des options « out-of-the-money » (hors de la monnaie) et à surestimer celui des options « in-the-money » (dans la monnaie) pour des actifs présentant de telles caractéristiques.

Le modèl'ignore également les [[WIDGET:Glossary:couts_transaction:coûts de transaction]] et les impôts, supposant que l'on peut acheter et vendre l'actif sous-jacent et les options sans frais. Dans la réalité, les coûts de transaction (commissions, spreads bid-ask) peuvent être significatifs, en particulier pour les stratégies de couverture dynamique qui nécessitent des ajustements fréquents du portefeuille. L'hypothèse de la possibilité de [[WIDGET:ConceptLink:trading_continu:trading continu]] et sans friction est également une idéalisation mathématique, car les marchés ne sont pas parfaitement liquides et les transactions ne peuvent pas être effectuées instantanément et en continu.

Enfin, le modèle suppose un taux d'intérêt sans risque constant et l'absence de dividendes (ou des dividendes connus et constants). Ces hypothèses sont également des simplifications qui peuvent être ajustées (par exemple, en utilisant des modèles de taux d'intérêt stochastiques ou en modifiant la formule pour les dividendes), mais elles soulignent la nature idéalisée du cadre initial.

Face à ces limites, de nombreuses extensions et modèles alternatifs ont été développés. Parmi eux, on peut citer les modèles à [[WIDGET:ConceptLink:volatilite_stochastique:volatilité stochastique]] (comme le modèlede Heston), qui permettent à la volatilité de varier de manière aléatoire au fil du temps [[WIDGET:Reference:14]], les modèles à sauts (jump-diffusion models) qui intègrent la possibilité de chocs soudains sur les prix des actifs [[WIDGET:Reference:5]], et les modèles de volatilité locale (local volatility models) qui calibrent la volatilité implicite observée sur le marché. Ces développements, souvent plus complexes, visent à mieux capturer la dynamique réelle des marchés financiers.

## Conclusion
Au terme de cette exploration du modèle de Black-Scholes-Merton, il est clair que sa contribution à la finance quantitative est monumentale. Nous avons détaillé les hypothèses fondamentales qui le sous-tendent, de la distribution log-normale des rendements à l'absence d'arbitrage et la possibilité de réplication parfaite. La dérivation de l'équation aux dérivées partielles (EDP) de Black-Scholes, une pierre angulaire de la modélisation financière, a été présentée, illustrant comment les principes de non-arbitrage et de couverture dynamique mènent à une équation différentielle stochastique dont la solution est la formule de valorisation des options.

La formule explicite pour les options d'achat et de vente européennes, ainsi que l'introduction des « Grecques » – ces mesures de sensibilité cruciales pour la gestion des risques etle hedging – ont démontré l'applicabilité pratique et la puissance analytique du modèle. Cependant, nous avons également abordé ses limites inhérentes, notamment l'hypothès'irréaliste de volatilité constante, la distribution log-normale des rendements qui ne capture pas les « queues épaisses », et l'idéalisation de marchés sans friction et avec trading continu. Ces critiques ont stimulé le développement de modèles plus sophistiqués, tels que les modèles à volatilité stochastique ou à sauts, qui tentent de mieux refléter la complexité des marchés réels [[WIDGET:Reference:10]], [[WIDGET:Reference:17]].

Malgré ses imperfections, le modèle de Black-Scholes-Merton demeure la fondation sur laquelle repose une grande partie de la finance quantitative moderne. Il a non seulement fourni un cadre pour la valorisation des options, mais a également transformé la compréhension des marchés dérivés et la gestion des risques. Son importance pédagogique est indéniable, servant de point de départ essentiel pour tout étudiant ou praticien souhaitant approfondir la modélisation financière. Il continue d'être un outil de référence, même si ses applications pratiques sont souvent complétées par des ajustements ou des modèles plus avancés.

[[WIDGET:conclusionSummary]]

[[WIDGET:whatsNext]]

[[WIDGET:goingFurther]]

[[WIDGET:finalEvaluation]]
