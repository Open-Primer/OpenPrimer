L'œuvre pionnière de [[WIDGET:RealPerson:bachelier:Louis Bachelier]], bien que visionnaire, a nécessité plusieurs décennies pour être pleinement reconnue et formalisée dans un cadre mathématique rigoureux applicable aux marchés financiers. C'est dans les années 1970 que la finance stochastique a connu son véritable essor, avec l'émergence d'un modèle qui allait révolutionner la valorisation des produits dérivés.

## L'Émergence des Modèles Stochastiques Modernes

La contribution la plus emblématique et la plus influente à la finance stochastique moderne est sans conteste le modèle de valorisation des options de [[WIDGET:RealPerson:black:Fischer Black]] et [[WIDGET:RealPerson:scholes:Myron Scholes]] (1973), rapidement étendu par [[WIDGET:RealPerson:merton:Robert C. Merton]] (1973). Ce modèle a fourni une formule analytique pour le prix d'une option européenne, transformant la spéculation sur les options en une science quantitative [[WIDGET:Reference:3]].

La méthodologie de Black-Scholes-Merton repose sur plusieurs hypothèses clés, bien que simplificatrices, qui ont permis d'obtenir une solution élégante et traitable:
1.  **Mouvement Brownien Géométrique**: Le prix de l'actif sous-jacent suit un processus stochastique de type mouvement brownien géométrique, impliquant des rendements log-normaux.
2.  **Volatilité Constante**: La volatilité de l'actif sous-jacent est supposée constante et connue.
3.  **Taux d'Intérêt Sans Risque Constant**: Le taux d'intérêt sans risque est constant et connu.
4.  **Absence de Dividendes**: L'actif sous-jacent ne verse pas de dividendes pendant la durée de vie de l'option.
5.  **Marchés Parfaits**: Absence de coûts de transaction, de taxes, possibilité de vente à découvert sans restriction, et divisibilité infinie des actifs.
6.  **Absence d'Opportunité d'Arbitrage**: Il n'est pas possible de réaliser un profit sans risque.

Le cœur de la méthodologie réside dans le principe de la [[WIDGET:ConceptLink:replication_dynamique:réplication dynamique]]. L'idée est de construire un portefeuille composé de l'actif sous-jacent et d'un actif sans risque (par exemple, des obligations) qui réplique exactement les flux de trésorerie de l'option à l'échéance. En l'absence d'opportunité d'[[WIDGET:Glossary:arbitrage:arbitrage]], le prix de ce portefeuille réplicatif doit être égal au prix de l'option. Ce processus de réplication dynamique conduit à une équation aux dérivées partielles (EDP), l'équation de Black-Scholes, dont la solution est la célèbre formule de valorisation.

[[WIDGET:Image:black_scholes_formula:La formule de Black-Scholes pour la valorisation d'une option d'achat européenne]]

L'impact de ce modèle fut révolutionnaire. Il a non seulement fourni un outil pratique pour les traders et les institutions financières, mais il a également jeté les bases de la finance quantitative moderne. Il a démontré la puissance du calcul stochastique pour résoudre des problèmes financiers complexes et a ouvert la voie à la modélisation d'une multitude d'autres produits dérivés [[WIDGET:Reference:2]].

[[WIDGET:Mermaid:bsm_impact:Impact révolutionnaire du modèle Black-Scholes-Merton]]

Cependant, les hypothèses du modèle de Black-Scholes-Merton ont rapidement fait l'objet de critiques et d'extensions. La plus notable est l'observation empirique du "sourire de volatilité" (volatility smile), où la volatilité implicite extraite des prix de marché des options varie en fonction du prix d'exercice et de l'échéance, contredisant l'hypothèse de volatilité constante. Cela a stimulé la recherche sur des modèles plus sophistiqués intégrant la volatilité stochastique ou les sauts.

[[WIDGET:Quote:merton_quote:Citation de Robert C. Merton sur l'importance du modèle Black-Scholes]]

## Évolution et Diversification des Modèles Stochastiques

Les limites du modèle de Black-Scholes-Merton, notamment son incapacité à capturer la dynamique complexe des taux d'intérêt, la volatilité non constante et les événements extrêmes (sauts de prix), ont conduit à une prolifération de modèles stochastiques plus avancés et spécialisés.

### Modèles de Taux d'Intérêt
La valorisation des produits dérivés de taux d'intérêt a nécessité des modèles spécifiques. Les premiers modèles à un facteur, comme celui de [[WIDGET:RealPerson:vasicek:Oldrich Vasicek]] (1977) et le modèle de Cox-Ingersoll-Ross (CIR) (1985), ont introduit la notion de retour à la moyenne (mean reversion) pour les taux courts [[WIDGET:Reference:15]]. Ces modèles ont été suivis par des cadres plus flexibles comme le modèle de Heath-Jarrow-Morton (HJM) (1992), qui modélise directement la dynamique de l'ensemble de la courbe des taux forward, et le Libor Market Model (LMM) ou BGM (Brace-Gatarek-Musiela) (1997), qui modélise les taux Libor (ou Euribor) directement observables sur le marché, facilitant ainsi la [[WIDGET:Glossary:calibration:calibration]] aux prix de marché.

[[WIDGET:CustomFigure:interest_rate_models_taxonomy:Taxonomie simplifiée des principaux modèles de taux d'intérêt]]

### Modèles de Volatilité Stochastique
Pour adresser le problème du sourire de volatilité, des modèles de [[WIDGET:ConceptLink:volatilite_stochastique:volatilité stochastique]] ont été développés. Le modèle de [[WIDGET:RealPerson:heston:Steven Heston]] (1993) est l'un des plus célèbres, où la volatilité elle-même est modélisée comme un processus stochastique, souvent corrélé au prix de l'actif sous-jacent [[WIDGET:Reference:16]]. Ces modèles permettent de reproduire plus fidèlement les surfaces de volatilité observées sur les marchés.

[[WIDGET:Image:volatility_smile:Illustration d'un sourire de volatilité typique sur les marchés d'options]]

### Modèles à Sauts
Les modèles à sauts (jump processes) ont été introduits pour capturer les mouvements de prix brusques et discontinus, souvent observés lors d'annonces économiques ou d'événements imprévus. [[WIDGET:RealPerson:merton_jr:Robert C. Merton]] (1976) a proposé un modèle de diffusion avec sauts (jump-diffusion), combinant un mouvement brownien avec un processus de Poisson pour les sauts. Plus tard, des modèles comme celui de Kou (2002) ont utilisé des distributions de sauts plus complexes (par exemple, double exponentielle) pour mieux rendre compte des queues épaisses (fat tails) des distributions de rendements [[WIDGET:Reference:5]].

### Modèles de Risque de Crédit
La modélisation stochastique s'est également étendue au risque de crédit. Les modèles structurels, inspirés des travaux de Merton (1974), considèrent le défaut d'une entreprise comme un événement endogène lié à la valeur de ses actifs par rapport à ses dettes. Les modèles à intensité (ou modèles de forme réduite), développés par Jarrow et Turnbull (1995) ou Duffie et Singleton (1999), traitent le défaut comme un événement exogène modélisé par un processus de Poisson dont l'intensité peut être stochastique [[WIDGET:Reference:10]].

[[WIDGET:Mermaid:model_evolution_post_bsm:Évolution des modèles stochastiques post-Black-Scholes et leurs applications]]

### Intégration des Imperfections de Marché et Défis de Calibration
Les développements récents ont cherché à intégrer des imperfections de marché, telles que les coûts de transaction, la liquidité, ou les contraintes de financement, rendant les modèles encore plus réalistes mais aussi plus complexes. Un défi majeur pour tous ces modèles est la calibration, c'est-à-dire l'ajustement des paramètres du modèle aux prix observés sur le marché. Cela nécessite souvent des techniques numériques avancées, comme les méthodes de Monte Carlo [[WIDGET:Reference:9]] ou la résolution d'équations aux dérivées partielles par différences finies [[WIDGET:Reference:20]]. La robustesse et la stabilité de la calibration sont cruciales pour l'utilisation pratique de ces modèles.