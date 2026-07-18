## Le Modèle de Hull-White et la Calibration

Les modèles de Vasicek et de CIR, bien que fondamentaux, présentent des limitations significatives, notamment leur incapacité à reproduire fidèlement la courbe des taux observée sur le marché à un instant donné. Pour pallier cette lacune, le modèle de [[WIDGET:RealPerson:john_hull:John Hull]] et [[WIDGET:RealPerson:alan_white:Alan White]], introduit en 1990, propose une extension du modèle de Vasicek. Ce modèle est un [[WIDGET:ConceptLink:no_arbitrage_model:modèle sans arbitrage]] car il permet d'ajuster parfaitement la structure par terme des taux d'intérêt initiale, une propriété essentielle pour la valorisation des produits dérivés.

L'équation différentielle stochastique (EDS) du taux court $r_t$ sous la mesure neutre au risque pour le modèle de Hull-White est donnée par :

$$dr_t = (\theta(t) - a r_t)dt + \sigma dW_t$$

où :
*   $r_t$ est le taux court instantané au temps $t$.
*   $\theta(t)$ est une fonction déterministe du temps, qui est précisément ajustée pour que le modèle reproduise la courbe des taux zéro-coupon initiale.
*   $a$ est le paramètre de retour à la moyenne, indiquant la vitesse à laquelle le taux court revient vers sa cible.
*   $\sigma$ est la volatilité du taux court, supposée constante dans la version la plus simple du modèle.
*   $dW_t$ est un processus de Wiener standard sous la mesure neutre au risque.

**Propriétés et Caractéristiques :**
*   **Retour à la moyenne :** Comme Vasicek, le modèle de Hull-White intègre un mécanisme de retour à la moyenne. Cependant, la cible de ce retour n'est pas une constante fixe, mais une fonction du temps $\theta(t)/a$, ce qui lui confère une flexibilité accrue.
*   **Ajustement de la courbe des taux initiale :** La fonction $\theta(t)$ est déterminée de manière unique pour que le modèle valorise correctement les obligations zéro-coupon de marché. Ceci est une propriété cruciale qui fait du Hull-White un modèle "sans arbitrage" par construction par rapport à la courbe des taux initiale [[WIDGET:Reference:15]].
*   **Tractabilité analytique :** Le modèle de Hull-White conserve une grande partie de la tractabilité analytique du modèle de Vasicek. Il existe des formules fermées pour le prix des obligations zéro-coupon et pour certains produits dérivés, ce qui facilite son implémentation.
*   **Taux négatifs :** Comme le modèle de Vasicek, le Hull-White est un processus gaussien et peut, théoriquement, générer des taux d'intérêt négatifs. Cependant, en pratique, lorsque le modèle est calibré aux données de marché, la probabilité de taux fortement négatifs est souvent faible, surtout pour des horizons de temps courts à moyens.

[[WIDGET:Mermaid:hull_white_concept_map:Carte conceptuelle du modèle de Hull-White, de ses origines à ses propriétés clés]]

### Calibration du Modèle de Hull-White

La calibration est le processus d'estimation des paramètres du modèle ($a$, $\sigma$, et la fonction $\theta(t)$) à partir des données de marché observées.

1.  **Calibration de $\theta(t)$ :** La fonction $\theta(t)$ est directement dérivée de la courbe des taux zéro-coupon observée sur le marché. En effet, pour que le modèle soit sans arbitrage, le prix d'une obligation zéro-coupon $P(t, T)$ doit correspondre aux prix de marché. En utilisant la formule de pricing des obligations zéro-coupon sous Hull-White, on peut résoudre pour $\theta(t)$ en fonction des taux forward de marché.
2.  **Calibration de $a$ et $\sigma$ :** Ces deux paramètres, qui régissent la dynamique stochastique et la volatilité du taux court, sont généralement calibrés à partir des prix des produits dérivés de taux d'intérêt.
    *   **Caps et Floors :** Les [[WIDGET:Glossary:caps_floors:Caps et Floors]] sont des options sur les taux flottants. Leurs prix de marché contiennent des informations précieuses sur la volatilité future des taux d'intérêt. En minimisant la somme des carrés des différences entre les prix des caps/floors calculés par le modèle et leurs prix de marché observés, on peut estimer $a$ et $\sigma$.
    *   **Swaptions :** Les swaptions (options sur swaps de taux d'intérêt) sont également des instruments clés pour la calibration. Leurs prix dépendent de la volatilité de la courbe des taux sur différentes maturités.
    *   **Volatilités de taux :** Parfois, la calibration se fait directement sur les volatilités implicites extraites des prix des caps/floors ou swaptions, plutôt que sur les prix eux-mêmes.

La calibration est souvent un problème d'optimisation numérique, où l'on cherche les valeurs de $a$ et $\sigma$ qui minimisent une fonction objectif (par exemple, la somme des erreurs quadratiques) entre les prix modélisés et les prix de marché. Des techniques comme les moindres carrés non linéaires ou les algorithmes génétiques peuvent être utilisées.

[[WIDGET:CustomFigure:hull_white_calibration_process:Diagramme illustrant le processus de calibration du modèle de Hull-White aux données de marché]]

## Applications et Limites des Modèles de Taux Courts

Les modèles de taux courts, en particulier le modèle de Hull-White, sont des outils indispensables en finance quantitative, mais ils présentent également des limites importantes.

### Applications Pratiques

1.  **Valorisation d'options sur taux :**
    *   **Caps et Floors :** Ces modèles permettent de valoriser les caps (plafonds de taux) et les floors (planchers de taux), qui sont des instruments de couverture contre la fluctuation des taux d'intérêt.
    *   **Swaptions :** La valorisation des swaptions, qui sont des options d'entrer dans un swap de taux d'intérêt, est une application majeure.
    *   **Obligations avec options intégrées :** Les obligations remboursables par anticipation (callable bonds) ou vendables (puttable bonds) peuvent être valorisées en utilisant des modèles de taux courts pour simuler les trajectoires futures des taux.
2.  **Gestion de Portefeuille et de Risque :**
    *   **Mesure du risque de taux :** Les modèles permettent d'estimer la sensibilité d'un portefeuille aux variations des taux d'intérêt (duration, convexité) et de calculer des mesures de risque comme la Value at Risk (VaR) pour des portefeuilles exposés aux taux.
    *   **Couverture (Hedging) :** Ils aident à concevoir des stratégies de couverture pour réduire l'exposition au risque de taux.
    *   **Gestion Actif-Passif (ALM) :** Les institutions financières utilisent ces modèles pour gérer l'adéquation entre leurs actifs et leurs passifs sensibles aux taux d'intérêt.
3.  **Pricing de Produits Structurés :** Les modèles de taux courts sont utilisés pour valoriser des produits financiers complexes dont les payoffs dépendent de l'évolution future des taux d'intérêt.
4.  **Simulation de Scénarios :** Ils permettent de générer des milliers de trajectoires de taux d'intérêt futures pour des analyses de stress, des tests de capital ou des projections financières.

### Limites des Modèles de Taux Courts

Malgré leur utilité, les modèles de taux courts à un facteur présentent plusieurs limitations :

1.  **Modélisation de la Volatilité Stochastique :** Les modèles comme Vasicek, CIR ou Hull-White (dans sa version standard) supposent une volatilité constante ou déterministe. Or, la volatilité des taux d'intérêt est en réalité [[WIDGET:ConceptLink:stochastic_volatility:stochastique]], c'est-à-dire qu'elle évolue de manière aléatoire au fil du temps. Cette limitation empêche ces modèles de reproduire des phénomènes observés sur le marché, comme le "sourire de volatilité" (volatility smile) des options de taux. Des modèles plus avancés intègrent une volatilité stochastique, souvent au prix d'une complexité accrue.
2.  **Modèles Multi-Facteurs :** Les modèles à un facteur supposent que toute la courbe des taux est mue par une seule source de risque (le taux court). Cela implique que les mouvements de la courbe des taux sont toujours parallèles. Cependant, en réalité, la courbe des taux peut subir des mouvements non parallèles : elle peut se tordre (twist), s'aplatir (flatten) ou se raidir (steepen). Pour capturer ces dynamiques plus complexes, des modèles multi-facteurs sont nécessaires. Ces modèles introduisent plusieurs sources de risque (par exemple, le taux court, la pente et la courbure de la courbe des taux) et sont souvent basés sur des travaux comme ceux de [[WIDGET:RealPerson:francis_longstaff:Longstaff]] et [[WIDGET:RealPerson:eduardo_schwartz:Schwartz]] [[WIDGET:Reference:10]].
3.  **Non-Arbitrage et Cohérence :** Bien que le modèle de Hull-White soit un modèle sans arbitrage par rapport à la courbe des taux initiale, il peut ne pas être parfaitement cohérent avec les prix de tous les instruments dérivés de taux sur le marché, en particulier ceux qui sont sensibles à la forme de la volatilité.
4.  **Taux Négatifs :** Comme mentionné, les modèles gaussiens comme Vasicek et Hull-White peuvent générer des taux négatifs, ce qui est devenu une préoccupation majeure dans un environnement de taux bas ou négatifs observé dans certaines économies. Des extensions ou des modèles alternatifs (comme le CIR ou des modèles de marché) sont nécessaires pour garantir la positivité des taux.
5.  **Hypothèses Simplificatrices :** Tous ces modèles reposent sur des hypothèses simplificatrices (marchés parfaits, absence de coûts de transaction, liquidité infinie, etc.) qui ne sont pas toujours vérifiées dans le monde réel.

[[WIDGET:CustomFigure:yield_curve_movements:Illustration des mouvements parallèles, de twist et de butterfly de la courbe des taux]]

Ces limitations soulignent la nécessité de modèles plus sophistiqués pour une modélisation complète et précise des marchés de taux d'intérêt, notamment les modèles de marché (comme le modèle de Heath-Jarrow-Morton ou le modèle LIBOR Market Model) qui seront abordés ultérieurement.