### Identification et Décomposition des Fluctuations Macroéconomiques

L'analyse des cycles économiques réels, et plus généralement des fluctuations macroéconomiques, nécessite des outils statistiques et économétriques robustes pour distinguer les composantes sous-jacentes des séries temporelles. Les séries macroéconomiques observées, telles que le PIB, l'emploi ou l'investissement, sont en effet le résultat d'une combinaison de facteurs de long terme (tendance), de fluctuations de moyen terme (cycle) et de mouvements aléatoires de court terme (bruit). La capacité à séparer ces composantes est cruciale pour comprendre les dynamiques économiques et formuler des politiques appropriées.

Les économistes ont développé diverses techniques pour décomposer ces séries. Parmi les plus courantes, le [[WIDGET:ConceptLink:filtre_hodrick_prescott:filtre de Hodrick-Prescott (HP)]] est largement utilisé pour extraire la composante cyclique d'une série temporelle en minimisant une fonction de perte qui pénalise à la fois la variabilité du cycle et la variabilité de la tendance. Bien que populaire, il est important de noter que ce filtre peut introduire des distorsions, notamment aux extrémités des séries et en créant des cycles artificiels [[WIDGET:Reference:1]].

[[WIDGET:CustomFigure:hodrick_prescott_filter_example:Exemple de décomposition d'une série de PIB en tendance et cycle par le filtre de Hodrick-Prescott]]

Une alternative est le [[WIDGET:ConceptLink:filtre_baxter_king:filtre de Baxter-King (BK)]], qui est un filtre passe-bande. Il permet d'isoler les fluctuations d'une certaine fréquence, c'est-à-dire les cycles dont la durée se situe dans une plage spécifiée (par exemple, entre 6 et 32 trimestres pour les cycles économiques classiques). Contrairement au filtre HP, le filtre BK est un filtre à phase nulle, ce qui signifie qu'il ne décale pas les cycles dans le temps, mais il nécessite de tronquer la série aux extrémités.

L'[[WIDGET:Glossary:analyse_spectrale:analyse spectrale]], quant à elle, offre une perspective différente en examinant les séries temporelles dans le domaine fréquentiel. Elle permet d'identifier les fréquences dominantes des fluctuations et de quantifier l'importance relative de chaque composante cyclique. Cette méthode est particulièrement utile pour détecter des périodicités régulières ou des co-mouvements entre différentes séries à des fréquences spécifiques.

[[WIDGET:Mermaid:time_series_decomposition_process:Processus de décomposition d'une série temporelle macroéconomique]]

Ces méthodes sont essentielles pour la recherche empirique en macroéconomie, car elles permettent de préparer les données pour l'estimation de modèles et l'analyse des propriétés des cycles économiques. Elles aident à quantifier la volatilité des cycles et à étudier leur synchronisation entre pays ou secteurs.

### Chocs Stochastiques et Analyse de Réponse Impulsionnelle

Les modèles de cycles économiques réels (RBC) et leurs extensions, les modèles d'équilibre général dynamique stochastique (DSGE), postulent que les fluctuations macroéconomiques sont principalement dues à des chocs stochastiques exogènes. Ces chocs représentent des perturbations imprévues qui affectent l'économie.

On distingue plusieurs types de chocs stochastiques :
*   **Chocs technologiques :** Variations imprévues de la productivité totale des facteurs (PTF), comme une innovation majeure ou une catastrophe naturelle affectant la capacité de production. Ces chocs sont au cœur des modèles RBC [[WIDGET:Reference:13]].
*   **Chocs de préférences :** Changements dans les goûts ou les attitudes des ménages, par exemple, une augmentation soudaine du désir d'épargner ou de travailler.
*   **Chocs fiscaux :** Modifications inattendues des politiques gouvernementales, telles que des variations des taux d'imposition ou des dépenses publiques.
*   **Chocs monétaires :** Perturbations de la politique monétaire, comme des changements imprévus dans les taux d'intérêt directeurs ou la masse monétaire (plus pertinents dans les modèles Néo-Keynésiens).
*   **Chocs pétroliers ou de matières premières :** Variations des prix des intrants essentiels.

L'[[WIDGET:ConceptLink:analyse_reponse_impulsionnelle:analyse de réponse impulsionnelle (ARI)]] est une méthodologie clé pour quantifier et visualiser l'impact dynamique de ces chocs sur les variables macroéconomiques. Elle permet de tracer la trajectoire temporelle d'une variable économique en réponse à un choc unitaire (une déviation d'un écart-type) dans une autre variable, toutes choses égales par ailleurs.

La mise en œuvre de l'ARI se fait généralement dans le cadre de modèles économétriques comme les modèles à vecteurs autorégressifs (VAR) ou de modèles structurels comme les DSGE. Dans un modèle VAR, les variables sont traitées comme endogènes et leurs dynamiques sont expliquées par leurs propres valeurs passées et celles des autres variables du système. L'ARI dans un VAR permet d'estimer la réaction des variables à un choc sur l'un des termes d'erreur du modèle, souvent interprété comme un choc structurel après identification [[WIDGET:Reference:12]].

[[WIDGET:CustomFigure:impulse_response_function_example:Exemple de fonctions de réponse impulsionnelle d'un choc technologique sur le PIB et l'emploi]]

Dans les modèles DSGE, l'ARI est dérivée directement des équations structurelles du modèle. Elle illustre comment les agents optimisateurs réagissent aux chocs et comment ces réactions se propagent à travers l'économie au fil du temps. Par exemple, un choc technologique positif dans un modèle DSGE peut entraîner une augmentation temporaire de la production, de l'investissement et de l'emploi, suivie d'un retour progressif à l'équilibre de long terme. Des chercheurs comme [[WIDGET:RealPerson:smets_wouters:Smets et Wouters]] ont largement utilisé l'ARI pour analyser les effets des chocs dans leurs modèles DSGE estimés pour la zone euro [[WIDGET:Reference:11]].

L'ARI est un outil indispensable pour les macroéconomistes et les décideurs politiques, car elle fournit une compréhension quantitative des mécanismes de transmission des chocs et aide à évaluer l'efficacité potentielle des politiques de stabilisation.