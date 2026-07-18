## Introduction à la Macroéconomie en Économie Ouverte

L'étude de la macroéconomie en économie ouverte est devenue un pilier essentiel de l'analyse économique moderne. Dans un monde caractérisé par une interdépendance croissante des marchés de biens, de services et de capitaux, il est impératif de comprendre comment les décisions économiques nationales sont influencées par et influencent les conditions économiques internationales. Cette leçon vise à explorer les mécanismes complexes qui régissent les interactions entre les économies, en se concentrant sur le rôle central des taux de change et des flux de capitaux.

Une [[WIDGET:ConceptLink:economie_ouverte:économie ouverte]] se distingue d'une économie fermée par sa capacité à échanger des biens, des services et des actifs financiers avec le reste du monde. Cette ouverture introduit de nouvelles variables et de nouveaux canaux de transmission pour les chocs et les politiques économiques.

Nous commencerons par définir les concepts fondamentaux nécessaires à cette analyse :

1.  **Le Taux de Change Nominal (E)** : Il représente le prix d'une monnaie en termes d'une autre. Par exemple, si le taux de change nominal euro/dollar est de 1,10, cela signifie qu'un euro peut être échangé contre 1,10 dollars américains. C'est le prix auquel les devises sont échangées sur le marché des changes.
    [[WIDGET:Glossary:taux_change_nominal:Taux de change nominal]]

2.  **Le Taux de Change Réel (ε)** : Il mesure le prix des biens et services d'un pays par rapport aux biens et services d'un autre pays, exprimés dans une monnaie commune. Il est un indicateur clé de la compétitivité internationale d'un pays. La formule du taux de change réel est donnée par :

    $$
    \varepsilon = E \times \frac{P}{P^*}
    $$

    où $E$ est le taux de change nominal (unités de monnaie étrangère par unité de monnaie nationale), $P$ est le niveau des prix intérieurs et $P^*$ est le niveau des prix étrangers. Un taux de change réel élevé indique que les biens domestiques sont relativement plus chers que les biens étrangers, réduisant ainsi la compétitivité.
    [[WIDGET:Glossary:taux_change_reel:Taux de change réel]]

[[WIDGET:Image:taux_change_reel_formula:Formule du taux de change réel, illustrant la relation entre le taux de change nominal et les niveaux de prix domestiques et étrangers pour déterminer la compétitivité.]]

3.  **Les Régimes de Taux de Change** : Les pays adoptent différents régimes pour gérer leurs taux de change. Les deux catégories principales sont les régimes de taux de change fixes et les régimes de taux de change flottants. Dans un régime fixe, la valeur de la monnaie est ancrée à une autre monnaie ou à un panier de monnaies, nécessitant souvent l'intervention de la banque centrale. Dans un régime flottant, le taux de change est déterminé par les forces du marché de l'offre et de la demande.

[[WIDGET:Mermaid:regimes_taux_change:Diagramme conceptuel des principaux régimes de taux de change, distinguant les régimes fixes des régimes flottants et leurs sous-catégories.]]

Au cours de cette leçon, nous aborderons plusieurs thèmes majeurs, notamment la détermination des taux de change, les implications des flux de capitaux internationaux, l'efficacité des politiques monétaires et budgétaires en économie ouverte, et les défis posés par les déséquilibres extérieurs. Nous nous appuierons sur des cadres théoriques tels que le modèle Mundell-Fleming et le modèl'IS-LM-BP, ainsi que sur des travaux fondamentaux en macroéconomie internationale [[WIDGET:Reference:9]].

## La Parité des Taux d'Intérêt (PTI)

La [[WIDGET:ConceptLink:parite_taux_interet:Parité des Taux d'Intérêt]] (PTI) est un concept fondamental en macroéconomie internationale qui explique la relation entre les taux d'intérêt de différents pays et le taux de change. Elle repose sur l'idée que les investisseurs sont indifférents entre détenir des actifs domestiques ou étrangers si les rendements attendus sont équivalents, après ajustement pour le risque de change. Ce principe est crucial pour comprendre les mouvements de capitaux et la détermination du taux de change.

### Parité des Taux d'Intérêt Non Couverte (PTINC)

La Parité des Taux d'Intérêt Non Couverte (PTINC), ou Uncovered Interest Rate Parity (UIP), postule que le rendement attendu d'un investissement dans une monnaie étrangère, après conversion en monnaie nationale, doit être égal au rendement d'un investissement comparable en monnaie nationale. Cette condition suppose que les investisseurs sont neutres au risque et n'utilisent pas d'instruments de couverture contre le risque de change.

**Hypothèses clés :**
*   **Mobilité parfaite des capitaux** : Les capitaux peuvent circuler librement et sans coût entre les pays.
*   **Substituabilité parfaite des actifs** : Les actifs domestiques et étrangers sont considérés comme des substituts parfaits par les investisseurs.
*   **Neutralité au risque** : Les investisseurs ne demandent pas de prime de risque pour détenir des actifs étrangers.
*   **Anticipations rationnelles** : Les investisseurs forment des anticipations sur le taux de change futur de manière rationnelle.

**Dérivation de la formule :**
Considérons un investisseur ayant le choix entre deux placements pour une période donnée (par exemple, un an) :
1.  **Placement domestique :** Investir 1 unité de monnaie nationale (par exemple, 1 euro) rapporte $(1 + i_t)$ à la fin de la période, où $i_t$ est le taux d'intérêt domestique.
2.  **Placement étranger :**
    *   Convertir 1 euro en monnaie étrangère au taux de change spot actuel $E_t$ (unités de monnaie étrangère par euro). On obtient $E_t$ unités de monnaie étrangère.
    *   Investir ces $E_t$ unités de monnaie étrangère au taux d'intérêt étranger $i^*_t$. À la fin de la période, on obtient $E_t (1 + i^*_t)$ unités de monnaie étrangère.
    *   Convertir ce montant en monnaie nationale au taux de change spot futur *attendu* $E_{t+1}^e$. On obtient $E_t (1 + i^*_t) / E_{t+1}^e$ euros.

Pour qu'il n'y ait pas d'opportunité d'[[WIDGET:Glossary:arbitrage:arbitrage]] sans risque, les rendements des deux placements doivent être égaux :

$$
(1 + i_t) = \frac{E_t (1 + i^*_t)}{E_{t+1}^e}
$$

En réarrangeant, on obtient :

$$
\frac{E_{t+1}^e}{E_t} = \frac{1 + i^*_t}{1 + i_t}
$$

Pour de faibles taux d'intérêt, on peut approximer $(1 + x) \approx 1 + x$ et $(1 + x) / (1 + y) \approx 1 + x - y$. De plus, $\frac{E_{t+1}^e}{E_t} \approx 1 + \frac{E_{t+1}^e - E_t}{E_t}$.
Ainsi, la formule approximée de la PTINC est :

$$
i_t \approx i^*_t + \frac{E_{t+1}^e - E_t}{E_t}
$$

Cette approximation indique que le taux d'intérêt domestique doit être approximativement égal au taux d'intérêt étranger plus le taux d'appréciation attendu de la monnaie étrangère (ou de dépréciation attendue de la monnaie domestique).

[[WIDGET:CustomFigure:uip_derivation:Dérivation mathématique de la Parité des Taux d'Intérêt Non Couverte (PTINC), montrant l'égalité des rendements attendus des placements domestiques et étrangers.]]

**Implications :**
*   **Détermination du taux de change :** La PTINC suggère que le taux de change spot actuel est déterminé par les taux d'intérêt relatifs et les anticipations de taux de change futurs.
*   **Mouvements de capitaux :** Si $i_t > i^*_t + (E_{t+1}^e - E_t) / E_t$, les capitaux afflueront vers le pays domestique, provoquant une appréciation de la monnaie domestique (baisse de $E_t$) jusqu'à ce que l'égalité soit rétablie.
*   **Politique monétaire :** Une hausse des taux d'intérêt domestiques (par la banque centrale) devrait entraîner une appréciation de la monnaie nationale, toutes choses égales par ailleurs.

**Écarts par rapport à la PTINC :**
Empiriquement, la PTINC ne tient pas toujours. Les principales causes des écarts sont :
*   **Prime de risque de change :** Les investisseurs peuvent exiger une compensation pour le risque lié aux fluctuations imprévues du taux de change.
*   **Contrôles des capitaux :** Les restrictions sur les flux de capitaux empêchent l'arbitrage parfait.
*   **Coûts de transaction :** Les frais de courtage et autres coûts réduisent l'incitation à l'arbitrage pour de petits écarts.
*   **Anticipations non rationnelles :** Les investisseurs peuvent ne pas former des anticipations parfaitement rationnelles.

### Parité des Taux d'Intérêt Couverte (PTIC)

La Parité des Taux d'Intérêt Couverte (PTIC), ou Covered Interest Rate Parity (CIP), est une condition d'arbitrage qui élimine le risque de change en utilisant des contrats à terme (forward contracts). Un investisseur qui place des fonds à l'étranger peut « couvrir » son risque de change en vendant à terme le montant attendu de monnaie étrangère.

**Dérivation de la formule :**
1.  **Placement domestique :** Identique à la PTINC, 1 euro rapporte $(1 + i_t)$ euros.
2.  **Placement étranger avec couverture :**
    *   Convertir 1 euro en $E_t$ unités de monnaie étrangère.
    *   Investir $E_t$ unités de monnaie étrangère au taux $i^*_t$, obtenant $E_t (1 + i^*_t)$ unités de monnaie étrangère.
    *   Simultanément, vendre à terme ce montant de monnaie étrangère au taux de change à terme $F_t$ (unités de monnaie étrangère par euro). Le montant en euros sera $E_t (1 + i^*_t) / F_t$.

Pour qu'il n'y ait pas d'arbitrage sans risque, les rendements doivent être égaux :

$$
(1 + i_t) = \frac{E_t (1 + i^*_t)}{F_t}
$$

En réarrangeant, on obtient :

$$
\frac{F_t}{E_t} = \frac{1 + i^*_t}{1 + i_t}
$$

Ou, sous forme approximée pour de faibles taux :

$$
i_t \approx i^*_t + \frac{F_t - E_t}{E_t}
$$

Cette formule indique que le différentiel de taux d'intérêt entre deux pays doit être égal au différentiel entre le taux de change à terme et le taux de change spot.

**Implications :**
*   La PTIC est une condition d'arbitrage sans risque. Elle est généralement bien vérifiée empiriquement, surtout pour les monnaies majeures et les marchés financiers liquides, car les opportunités d'arbitrage sont rapidement exploitées par les acteurs du marché.
*   Elle implique que le taux de change à terme n'est pas un prédicteur impartial du taux de change spot futur si la PTINC ne tient pas.

[[WIDGET:Video:uip_cip_explanation:Explication détaillée de la Parité des Taux d'Intérêt Non Couverte (PTINC) et Couverte (PTIC), leurs mécanismes et leurs implications.]]

Les travaux de [[WIDGET:RealPerson:obstfeld:Maurice Obstfeld]] et [[WIDGET:RealPerson:rogoff:Kenneth Rogoff]] ont largement contribué à la compréhension de ces concepts et de leurs implications pour la macroéconomie internationale [[WIDGET:Reference:9]].

## La Balance des Paiements et le Taux de Change

La compréhension des mécanismes d'ajustement externe d'une économie ouverte passe inévitablement par l'analyse de sa [[WIDGET:Glossary:balance_des_paiements:Balance des Paiements]] (BdP). La BdP est un enregistrement systématique de toutes les transactions économiques entre les résidents d'un pays et le reste du monde sur une période donnée, généralement un an. Elle est structurée en plusieurs comptes principaux qui reflètent la nature des flux.

La structure standard de la balance des paiements comprend trois comptes majeurs :

1.  **Le Compte Courant (CC)** : Il enregistre les transactions de biens, de services, de revenus primaires (revenus du travail et du capital) et de revenus secondaires (transferts courants, comme l'aide internationale ou les envois de fonds des travailleurs). Un excédent du compte courant signifie que le pays gagne plus de devises étrangères qu'il n'en dépense pour ces transactions.
2.  **Le Compte de Capital (CK)** : Ce compte, souvent de taille modeste, enregistre les transferts de capital (ex: remises de dettes, transferts de propriété d'actifs fixes) et l'acquisition ou la cession d'actifs non produits non financiers (ex: brevets, droits d'auteur).
3.  **Le Compte Financier (CF)** : Il retrace les transactions d'actifs et de passifs financiers entre résidents et non-résidents. Il est subdivisé en investissements directs (ex: acquisition d'entreprises étrangères), investissements de portefeuille (ex: actions, obligations), autres investissements (ex: prêts bancaires) et variations des avoirs de réserve de la banque centrale. Un excédent du [[WIDGET:ConceptLink:compte_financier:Compte Financier]] indique un afflux net de capitaux étrangers.

Par définition comptable, la somme des soldes de ces comptes, ajustée pour les erreurs et omissions nettes, doit être nulle :

$$
\text{Solde du Compte Courant} + \text{Solde du Compte de Capital} + \text{Solde du Compte Financier} + \text{Erreurs et Omissions Nettes} = 0
$$

Cette identité fondamentale signifie qu'un déficit dans un compte doit être compensé par un excédent dans un ou plusieurs autres. Par exemple, un déficit du compte courant implique que le pays doit emprunter ou vendre des actifs à l'étranger, ce qui se traduit par un excédent du compte financier.

[[WIDGET:Mermaid:bdp_structure:Structure simplifiée de la Balance des Paiements]]

Les déséquilibres de la balance des paiements ont un impact direct sur la demande et l'offre de devises et, par conséquent, sur le taux de change. En régime de taux de change flottants, le taux de change s'ajuste pour équilibrer la BdP. Un déficit du compte courant, par exemple, implique que les résidents nationaux demandent plus de devises étrangères pour financer leurs importations et leurs paiements de revenus qu'ils n'en offrent via leurs exportations et revenus entrants. Cette demande excédentaire de devises étrangères exerce une pression à la dépréciation de la monnaie nationale. Inversement, un excédent du compte courant tend à apprécier la monnaie nationale. Les flux de capitaux enregistrés dans le compte financier agissent de manière similaire : un afflux net de capitaux (excédent du CF) crée une demande de monnaie nationale, entraînant son appréciation.

La relation entre le compte courant et l'épargne/investissement est une identité macroéconomique cruciale. Partant de l'identité du revenu national $Y = C + I + G + (X - M)$, où $X-M$ représente le solde du compte courant (CC), et en définissant l'épargne nationale $S = Y - C - G$, on obtient :

$$
S = I + (X - M)
$$

Ce qui peut être réécrit comme :

$$
CC = S - I
$$

Cette identité, souvent soulignée par des économistes comme [[WIDGET:RealPerson:obstfeld:Maurice Obstfeld]] et [[WIDGET:RealPerson:rogoff:Kenneth Rogoff]] [[WIDGET:Reference:9]], révèle qu'un excédent du compte courant (CC > 0) signifie que l'épargne nationale excède l'investissement national. Le surplus d'épargne est alors prêté au reste du monde, se traduisant par une exportation nette de capitaux. À l'inverse, un déficit du compte courant (CC &lt; 0) indique que l'investissement national est supérieur à l'épargne nationale, et le pays doit financer ce déficit en empruntant auprès de l'étranger, ce qui correspond à une importation nette de capitaux.

[[WIDGET:CustomFigure:cc_si_identity:L'identité fondamentale entre le Compte Courant, l'Épargne et l'Investissement]]

## Effets des Chocs et des Politiques sur le Taux de Change

L'analyse de l'impact des chocs externes et des politiques économiques sur le taux de change est fondamentale en macroéconomie ouverte. Ces effets varient considérablement selon le régime de taux de change adopté par un pays (fixes ou flottants) et peuvent être efficacement illustrés par des modèles tels que le [[WIDGET:Glossary:modele_mundell_fleming:Modèle Mundell-Fleming]]. Développé par [[WIDGET:RealPerson:mundell:Robert Mundell]] et [[WIDGET:RealPerson:fleming:J. Marcus Fleming]] dans les années 1960, ce modèl'est une extension du cadre IS-LM aux économies ouvertes, intégrant la mobilité des capitaux.

Le modèle Mundell-Fleming repose sur des hypothèses clés, notamment une petite économie ouverte (où le taux d'intérêt mondial $r^*$ est exogène), des prix fixes à court terme, et différentes hypothèses sur la mobilité des capitaux. Il permet d'analyser l'efficacité des politiques monétaires et budgétaires sous différents régimes de taux de change.

**1. Impact des Politiques Économiques :**

*   **En régime de taux de change flottants (avec mobilité parfaite des capitaux) :**
    *   **Politique Monétaire (expansionniste)** : Une augmentation de l'offre de monnaie ($M$) tend à réduire le taux d'intérêt domestique ($r$). Avec une mobilité parfaite des capitaux, cela provoque une fuite de capitaux, entraînant une dépréciation de la monnaie nationale. Cette dépréciation stimule les exportations nettes ($NX$), déplaçant la courbe IS vers la droite et augmentant le revenu national ($Y$). La politique monétaire est donc très efficace pour influencer la production.
    *   **Politique Budgétaire (expansionniste)** : Une augmentation des dépenses publiques ($G$) ou une réduction des impôts ($T$) déplace la courbe IS vers la droite, augmentant le revenu et le taux d'intérêt. L'attraction de capitaux étrangers qui en résulte provoque une appréciation de la monnaie. Cette appréciation réduit les exportations nettes, ce qui annule l'effet expansionniste initial de la politique budgétaire sur la production. La politique budgétaire est inefficace sous ce régime.

[[WIDGET:CustomFigure:mf_floating_monetary:Effet d'une politique monétaire expansionniste en régime de taux de change flottants (Modèle Mundell-Fleming)]]

*   **En régime de taux de change fixes (avec mobilité parfaite des capitaux) :**
    *   **Politique Monétaire (expansionniste)** : Une tentative d'augmentation de l'offre de monnaie réduit le taux d'intérêt, provoquant une fuite de capitaux. Pour maintenir le taux de change fixe, la banque centrale doit vendre des réserves de devises étrangères, ce qui réduit l'offre de monnaie domestique à son niveau initial. La politique monétaire est inefficace.
    *   **Politique Budgétaire (expansionniste)** : L'augmentation des dépenses publiques ou la réduction des impôts déplace la courbe IS vers la droite, augmentant le revenu et le taux d'intérêt. L'afflux de capitaux qui en découle met une pression à l'appréciation de la monnaie. Pour maintenir le taux de change fixe, la banque centrale doit acheter des devises étrangères, augmentant ainsi l'offre de monnaie domestique. Cette augmentation de l'offre de monnaie déplace la courbe LM vers la droite, renforçant l'effet expansionniste de la politique budgétaire sur la production. La politique budgétaire est très efficace.

[[WIDGET:Mermaid:mundell_fleming_summary:Synthèse des effets des politiques dans le modèle Mundell-Fleming]]

**2. Impact des Chocs Externes :**

*   **Variations des prix des matières premières :** Pour un pays exportateur net de matières premières, une hausse de leurs prix améliore les termes de l'échange, augmente les exportations nettes et, en régime flottant, entraîn'une appréciation de la monnaie. L'inverse est vrai pour un importateur net. En régime fixe, l'ajustement se ferait par des variations de la production ou des réserves de change.
*   **Crises financières internationales :** Ces chocs peuvent provoquer des « fuites de capitaux » des économies émergentes vers des monnaies considérées comme des « valeurs refuges » (ex: USD, JPY). En régime flottant, cela entraîn'une dépréciation des monnaies des pays touchés et une appréciation des monnaies refuges. En régime fixe, les banques centrales des pays touchés devraient défendre leur parité en puisant massivement dans leurs réserves, risquant un épuisement et une éventuelle dévaluation forcée.
*   **Chocs sur la demande étrangère :** Une récession chez les partenaires commerciaux réduit la demande d'exportations nationales. En régime flottant, cela déprécie la monnaie, ce qui peut amortir le choc en rendant les exportations plus compétitives. En régime fixe, cette flexibilité est absente, et le choc se traduit plus directement par une baisse de la production nationale.

Ces analyses montrent que le choix du régime de taux de change a des implications profondes sur la capacité d'une économie à absorber les chocs et sur l'efficacité de ses instruments de politique économique. Les travaux de [[WIDGET:RealPerson:blanchard:Olivier Blanchard]] et [[WIDGET:RealPerson:romer:David Romer]] fournissent des analyses détaillées de ces mécanismes dans leurs ouvrages de macroéconomie avancée [[WIDGET:Reference:1]], [[WIDGET:Reference:2]].

[[WIDGET:Video:mundell_fleming_explanation:Explication approfondie du modèle Mundell-Fleming, ses hypothèses et ses implications pour la politique économique en économie ouverte.]]

## Conclusion
Ce cours a exploré les mécanismes fondamentaux de la macroéconomie en économie ouverte, en mettant en lumière l'importance cruciale du taux de change. Nous avons d'abord établi la [[WIDGET:ConceptLink:pti:Parité des Taux d'Intérêt (PTI)]] comme condition d'équilibre sur les marchés financiers internationaux, reliant les taux d'intérêt domestiques et étrangers aux anticipations de taux de change. Ensuite, l'analyse de la [[WIDGET:ConceptLink:balance_paiements:Balance des Paiements]] nous a permis de comprendre comment les flux de biens, services et capitaux entre un pays et le reste du monde se compensent, et comment son déséquilibre peut exercer une pression sur le taux de change. Nous avons également examiné les principaux déterminants du taux de change, qu'ils soient réels (compétitivité, termes de l'échange) ou monétaires (taux d'intérêt, inflation, anticipations).

L'étude des régimes de taux de change fixes et flottants, notamment à travers le modèle de Mundell-Fleming, a révélé l'interdépendance profonde des économies mondiales. Le choix d'un régime de change n'est pas neutre ; il détermine l'efficacité des politiques monétaires et budgétaires et la capacité d'une économie à absorber les chocs externes. La gestion du taux de change est donc un pilier essentiel de la stabilité macroéconomique, influençant la compétitivité des exportations, le coût des importations, l'inflation et, in fine, le bien-être des citoyens. Une mauvaise gestion peut conduire à des crises de change, des déséquilibres commerciaux persistants ou une instabilité financière, comme l'ont souligné des travaux majeurs en macroéconomie internationale [[WIDGET:Reference:9]].

[[WIDGET:Image:global_interdependence:Illustration de l'interdépendance des économies mondiales via les flux commerciaux et financiers.]]

Les défis contemporains en macroéconomie ouverte sont nombreux et complexes. La volatilité accrue des marchés financiers, les « guerres des monnaies » potentielles, et l'émergence de nouvelles formes de monnaie comme les cryptomonnaies posent des questions fondamentales sur la nature et la gestion du système monétaire international. Le [[WIDGET:Glossary:impossible_trinity:Dilemme Impossible]] (ou Trinité Impossible) — l'incapacité pour un pays de maintenir simultanément des taux de change fixes, une libre circulation des capitaux et une politique monétaire autonome — reste une contrainte majeure pour les décideurs politiques. La coordination des politiques macroéconomiques entre pays est plus que jamais nécessaire pour faire face aux chocs globaux, qu'ils soient financiers, sanitaires ou climatiques. Les recherches actuelles, notamment celles de [[WIDGET:RealPerson:gourinchas:Pierre-Olivier Gourinchas]] et [[WIDGET:RealPerson:rey:Hélène Rey]], continuent d'explorer ces dynamiques complexes et leurs implications pour la stabilité financière mondiale [[WIDGET:Reference:20]].

[[WIDGET:Mermaid:exchange_rate_regime_decision:Diagramme de décision pour le choix d'un régime de taux de change et ses implications.]]

[[WIDGET:Video:future_of_global_economy:Discussion sur les défis futurs de l'économie mondiale et le rôle des taux de change.]]

[[WIDGET:conclusionSummary]]
[[WIDGET:whatsNext]]
[[WIDGET:goingFurther]]
[[WIDGET:finalEvaluation]]
