...Humidité initiale du sol: Un sol sec a une capacité d'infiltration plus élevée qu'un sol déjà humide ou saturé.
*   **Intensité et durée des précipitations**: Si l'intensité des précipitations dépasse la capacité d'infiltration du sol, le ruissellement superficiel se produit. Des pluies prolongées peuvent saturer le sol et réduire considérablement l'infiltration.
*   **Végétation et couverture du sol**: La végétation intercepte les précipitations, ralentit le ruissellement, et ses racines améliorent la structure du sol, favorisant ainsi l'infiltration. Une couverture végétale dense protège le sol de la compaction par les gouttes de pluie, maintenant une capacité d'infiltration élevée.
*   **Température**: Le gel du sol peut empêcher l'infiltration, tandis que des températures plus élevées peuvent augmenter l'évapotranspiration, asséchant le sol et augmentant sa capacité d'infiltration ultérieure.

L'infiltration est donc un processus clé qui régule la répartition de l'eau entre les compartiments de surface et souterrains, influençant directement la recharge des nappes phréatiques et la disponibilité de l'eau pour la végétation.

## Bilan hydrique et dynamique des réserves d'eau douce

Le cycle hydrologique, bien que continu, peut être quantifié et analysé à travers le concept de bilan hydrique. Ce dernier représente la comptabilité des entrées, des sorties et des variations de stockage de l'eau au sein d'un système hydrologique défini, qu'il s'agisse d'un bassin versant, d'une région ou de la planète entière [ref1]. Comprendre le bilan hydrique est fondamental pour évaluer la disponibilité des ressources en eau et anticiper les impacts des changements environnementaux.

L'équation générale du bilan hydrique s'exprime comme suit :

$P = E + T + R + \Delta S$

Où :
*   $P$ représente les précipitations totales (entrées).
*   $E$ représente l'évaporation.
*   $T$ représente la transpiration des plantes. (Souvent $E$ et $T$ sont regroupés sous le terme d'évapotranspiration $ET$).
*   $R$ représente le ruissellement total (superficiel et souterrain, sorties).
*   $\Delta S$ représente la variation du stockage d'eau dans le système (sol, nappes phréatiques, lacs, glaciers).

Cette équation met en lumière l'interdépendance des différents processus hydrologiques et des réservoirs d'eau.

### Analyse des bilans hydriques à différentes échelles

L'échelle d'analyse est cruciale car elle détermine la complexité et la pertinence des termes du bilan.

#### 1. À l'échelle du bassin versant

Le bassin versant est l'unité géographique fondamentale pour l'étude hydrologique. Il s'agit d'une zone drainée par un cours d'eau et ses affluents, délimitée par une ligne de partage des eaux. À cette échelle, le bilan hydrique permet de comprendre comment l'eau se déplace et se stocke au sein d'un écosystème spécifique [ref2].

*   **Entrées**: Principalement les précipitations (pluie, neige, grêle) sur la surface du bassin.
*   **Sorties**:
    *   **Évapotranspiration (ET)**: L'eau retournant à l'atmosphère depuis la surface du sol, les plans d'eau et la végétation. Elle est influencée par la température, l'humidité de l'air, le vent et le type de végétation.
    *   **Débit des cours d'eau (Ruissellement total)**: L'eau qui quitte le bassin par le cours d'eau principal. Ce débit est la somme du ruissellement superficiel, du ruissellement hypodermique et de l'écoulement souterrain.
*   **Variations de stockage ($\Delta S$)**:
    *   **Humidité du sol**: L'eau retenue dans la zone non saturée du sol, essentielle pour la végétation.
    *   **Eaux souterraines**: L'eau stockée dans les aquifères sous le bassin.
    *   **Neige et glace**: Stockage temporaire ou permanent dans les régions froides ou montagneuses.
    *   **Lacs et réservoirs**: Stockage de surface.

L'étude du bilan hydrique à l'échelle du bassin versant est essentielle pour la gestion des ressources en eau locales, la prévision des crues et des étiages, et la planification agricole. Les activités humaines, telles que la déforestation, l'urbanisation ou la construction de barrages, peuvent modifier significativement les termes du bilan hydrique d'un bassin versant, en augmentant le ruissellement, en diminuant l'infiltration ou en modifiant l'évapotranspiration.

#### 2. À l'échelle régionale

À l'échelle régionale, le bilan hydrique intègre les dynamiques de plusieurs bassins versants et prend en compte des flux d'eau plus larges, y compris les transferts inter-bassins (naturels ou artificiels) et les interactions avec les systèmes atmosphériques régionaux. Les variations de stockage peuvent inclure des systèmes aquifères plus vastes, des réseaux de lacs interconnectés et des masses de glace régionales. L'analyse régionale est cruciale pour la planification de l'eau à grande échelle, la gestion des sécheresses et des inondations transfrontalières, et l'évaluation de la vulnérabilité des écosystèmes à des changements climatiques ou anthropiques plus larges. Elle permet de mettre en évidence les déséquilibres entre l'offre et la demande en eau sur des territoires plus étendus.

#### 3. À l'échelle globale

Au niveau global, le bilan hydrique décrit le cycle hydrologique planétaire, où les océans constituent le principal réservoir et les continents les zones de transit et de stockage temporaire. Les flux majeurs sont l'évaporation des océans, les précipitations sur les continents et les océans, et le ruissellement continental vers les océans. À cette échelle, $\Delta S$ représente les variations globales des réserves d'eau douce (glaciers, nappes phréatiques, lacs) et d'eau salée (océans). Le bilan hydrique global est un indicateur clé du fonctionnement du système climatique terrestre. Les changements observés dans les stocks d'eau douce (fonte des glaciers, diminution des nappes phréatiques) ont des implications directes sur l'élévation du niveau marin et la redistribution des masses d'eau, influençant la circulation océanique et atmosphérique [ref6].

[[WIDGET:Mermaid:water_balance_diagram]]
```mermaid
graph TD
    A[Précipitations (P)] --> B{Surface du sol}
    B --> C[Évapotranspiration (ET)]
    B --> D[Ruissellement superficiel (Rs)]
    B --> E[Infiltration]
    E --> F[Humidité du sol (ΔS_sol)]
    E --> G[Recharge des aquifères]
    G --> H[Eaux souterraines (ΔS_nappe)]
    H --> I[Écoulement souterrain (Rs_souterrain)]
    D --> J[Cours d'eau]
    I --> J
    J --> K[Océans / Sortie du bassin]
    C --> A
    subgraph Réservoirs
        F
        H
        L[Lacs / Réservoirs (ΔS_lac)]
        M[Glaciers / Neige (ΔS_glace)]
    end
    J --> L
    M --> J
    style A fill:#DDEEFF,stroke:#333,stroke-width:2px
    style C fill:#DDEEFF,stroke:#333,stroke-width:2px
    style K fill:#DDEEFF,stroke:#333,stroke-width:2px
    style J fill:#CCEEFF,stroke:#333,stroke-width:2px
    style L fill:#CCEEFF,stroke:#333,stroke-width:2px
    style M fill:#CCEEFF,stroke:#333,stroke-width:2px
    style F fill:#CCEEFF,stroke:#333,stroke-width:2px
    style H fill:#CCEEFF,stroke:#333,stroke-width:2px
```
*Diagramme conceptuel simplifié du bilan hydrique et de l'interconnexion des réservoirs d'eau douce.*

### Les principales réserves d'eau douce

La majeure partie de l'eau sur Terre est salée (environ 97,5%), principalement dans les océans. L'eau douce ne représente qu'environ 2,5% du volume total, et la majeure partie de cette eau douce est difficilement accessible.

#### 1. Les glaces et neiges permanentes

Les glaciers, les calottes glaciaires (Groenland, Antarctique) et les neiges permanentes de montagne constituent le plus grand réservoir d'eau douce de la planète, représentant environ 68,7% de l'eau douce totale [ref2].

*   **Rôle**: Ces masses de glace agissent comme des réservoirs naturels gigantesques, stockant l'eau sous forme solide pendant de longues périodes. Leur fonte saisonnière alimente de nombreux cours d'eau et systèmes hydrologiques, particulièrement dans les régions montagneuses et polaires. Elles sont cruciales pour l'approvisionnement en eau de millions de personnes, notamment en Asie (Himalaya) et en Amérique du Sud (Andes).
*   **Dynamique**: Les glaciers avancent et reculent en fonction du bilan de masse (accumulation de neige vs. ablation par fonte et sublimation). Les changements climatiques actuels entraînent une fonte accélérée de ces réserves, avec des conséquences majeures sur la disponibilité de l'eau à long terme et sur l'élévation du niveau marin [ref6].

#### 2. Les eaux souterraines

Les eaux souterraines représentent le deuxième plus grand réservoir d'eau douce, constituant environ 30,1% de l'eau douce totale. Elles sont stockées dans des formations géologiques perméables appelées [[WIDGET:Glossary:aquifere:aquifères]].

*   **Aquifères**: Un aquifère est une formation géologique capable de stocker et de laisser circuler l'eau. On distingue principalement :
    *   **Nappes phréatiques (ou nappes libres)**: Aquifères dont la surface supérieure (le niveau piézométrique) est en contact direct avec l'atmosphère via la zone non saturée du sol. Elles sont directement rechargées par l'infiltration des précipitations et des eaux de surface.
    *   **Nappes captives (ou nappes artésiennes)**: Aquifères confinés entre deux couches imperméables (aquicludes). Leur recharge se fait souvent à distance, là où l'aquifère affleure ou est en contact avec une zone de recharge.
*   **Rôle**: Les eaux souterraines sont une source d'eau potable vitale pour une grande partie de la population mondiale. Elles alimentent également les cours d'eau et les lacs, surtout pendant les périodes de sécheresse, assurant un débit de base. Leur mouvement est généralement lent, de quelques mètres par an à quelques mètres par jour, mais leur volume est considérable.
*   **Dynamique**: La recharge des aquifères dépend de l'infiltration des précipitations, de la percolation des eaux de surface (rivières, lacs) et, dans une moindre mesure, de l'irrigation. La décharge se fait par les sources, l'évapotranspiration (si la nappe est proche de la surface), le pompage anthropique et l'écoulement vers les cours d'eau ou les océans. La surexploitation des nappes phréatiques est une problématique majeure à l'échelle mondiale, conduisant à l'abaissement des niveaux piézométriques, à l'assèchement des zones humides et à l'intrusion saline dans les zones côtières.

#### 3. Les eaux de surface

Les eaux de surface (lacs, rivières, zones humides) ne représentent qu'une petite fraction de l'eau douce totale (environ 0,3%), mais elles sont les plus visibles et les plus facilement accessibles.

*   **Lacs**: Qu'ils soient naturels ou artificiels (réservoirs), les lacs sont des masses d'eau stagnantes qui jouent un rôle crucial dans le stockage temporaire de l'eau, la régulation des débits fluviaux, la biodiversité et les activités humaines (approvisionnement en eau, pêche, loisirs). Leur dynamique est influencée par les apports (précipitations directes, ruissellement, affluents, eaux souterraines) et les pertes (évaporation, émissaires, infiltration).
*   **Rivières et cours d'eau**: Ils constituent le réseau de drainage des continents, transportant l'eau des zones de précipitation vers les océans ou les lacs intérieurs. Les rivières sont des systèmes dynamiques, caractérisés par un écoulement continu (sauf pour les rivières intermittentes). Leur régime hydrologique (variations saisonnières de débit) est le reflet du bilan hydrique de leur bassin versant et est fortement influencé par le climat et la géomorphologie [ref3]. Ils sont essentiels pour l'approvisionnement en eau, l'irrigation, la production d'énergie hydroélectrique et le transport.
*   **Zones humides**: Marais, tourbières, mangroves, et autres écosystèmes où l'eau est présente de manière permanente ou saisonnière. Elles sont des réservoirs d'eau importants, agissant comme des éponges naturelles qui absorbent l'eau lors des crues et la libèrent lentement pendant les périodes sèches. Elles jouent un rôle vital dans la filtration de l'eau, la régulation des inondations, la recharge des nappes et la biodiversité.

### Interconnexion des réservoirs d'eau douce

Il est crucial de comprendre que ces différents réservoirs d'eau douce ne sont pas isolés, mais forment un [[WIDGET:ConceptLink:continuum_hydrologique:continuum hydrologique]] complexe et interconnecté. Les flux d'eau relient constamment ces compartiments, assurant la circulation de l'eau à travers le paysage.

*   **Interaction surface-souterrain**: Les rivières et les lacs peuvent recharger les nappes phréatiques (perte d'eau vers le sous-sol), et inversement, les nappes phréatiques peuvent alimenter les cours d'eau et les lacs (sources et résurgences), surtout pendant les périodes de faible précipitation. Ce lien est fondamental pour le maintien des débits d'étiage des rivières.
*   **Glaciers et eaux de surface**: La fonte des glaciers alimente directement les rivières et les lacs, contribuant de manière significative aux ressources en eau des régions de montagne et en aval.
*   **Atmosphère et tous les réservoirs**: L'évaporation des lacs, rivières, sols et glaciers, ainsi que la transpiration des plantes, renvoient l'eau à l'atmosphère, où elle se condense et retourne sous forme de précipitations, bouclant ainsi le cycle.

Cette interconnexion signifie que toute perturbation d'un réservoir ou d'un flux peut avoir des répercussions sur l'ensemble du système hydrologique. Par exemple, la surexploitation d'une nappe phréatique peut entraîner l'assèchement de rivières ou de zones humides adjacentes. La déforestation d'un bassin versant peut augmenter le ruissellement superficiel, réduire l'infiltration et la recharge des nappes, et augmenter l'érosion. La compréhension de ces liens est indispensable pour une gestion durable et intégrée des ressources en eau.

## Enjeux contemporains et gestion des ressources en eau

La disponibilité et la qualité de l'eau douce sont devenues des défis majeurs du 21e siècle. Alors que la population mondiale continue de croître et que les activités humaines s'intensifient, la pression sur les ressources en eau s'accroît, exacerbée par les changements climatiques [ref6].

### Problématiques de la disponibilité de l'eau douce

La disponibilité de l'eau douce est inégale à l'échelle mondiale, tant géographiquement que temporellement.

#### 1. Stress hydrique et pénurie d'eau

Le [[WIDGET:ConceptLink:stress_hydrique:stress hydrique]] survient lorsque la demande en eau dépasse la quantité d'eau disponible ou lorsque la qualité de l'eau limite son utilisation. La pénurie d'eau, quant à elle, est une situation plus grave où les ressources en eau douce sont insuffisantes pour satisfaire les besoins fondamentaux d'une population.

*   **Causes**:
    *   **Pénurie physique**: Insuffisance des ressources naturelles en eau dans une région donnée (par exemple, zones arides et semi-arides).
    *   **Pénurie économique**: Absence d'infrastructures adéquates pour capter, traiter et distribuer l'eau, même si la ressource est physiquement présente. Cela affecte souvent les pays en développement.
    *   **Croissance démographique**: Augmentation de la demande en eau pour l'alimentation, l'hygiène et l'industrie.
    *   **Changements climatiques**: Modification des régimes de précipitations, augmentation des sécheresses et de l'évapotranspiration.
*   **Conséquences**: Insécurité alimentaire (manque d'eau pour l'irrigation), problèmes de santé (accès limité à l'eau potable), conflits d'usage (entre agriculture, industrie, villes), migrations forcées.

#### 2. Surexploitation des aquifères

Les eaux souterraines, bien que vastes, ne sont pas illimitées et leur taux de recharge est souvent lent. La surexploitation des aquifères, c'est-à-dire le pompage d'eau à un rythme supérieur à celui de leur recharge naturelle, est une problématique mondiale croissante.

*   **Conséquences**:
    *   **Abaissement du niveau des nappes**: Rend le pompage plus coûteux et peut assécher les puits peu profonds.
    *   **Affaissement des sols (subsidence)**: Lorsque l'eau est retirée des pores du sol, la structure du sol peut se compacter, entraînant un affaissement permanent de la surface terrestre.
    *   **Intrusion saline**: Dans les régions côtières, la diminution de la pression des nappes d'eau douce permet à l'eau de mer de s'infiltrer dans l'aquifère, rendant l'eau impropre à la consommation ou à l'irrigation.
    *   **Assèchement des zones humides et des cours d'eau**: Les nappes surexploitées ne peuvent plus alimenter les écosystèmes de surface qui en dépendent.

### Problématiques de la qualité de l'eau douce

Au-delà de la quantité, la qualité de l'eau est tout aussi cruciale. De nombreuses sources d'eau douce sont contaminées, rendant l'eau impropre à la consommation ou à d'autres usages.

#### 1. Pollution d'origine agricole

L'agriculture est le plus grand consommateur d'eau douce et une source majeure de pollution.

*   **Pesticides et herbicides**: Contaminent les eaux de surface et souterraines, affectant la biodiversité aquatique et la santé humaine.
*   **Nitrates et phosphates**: Issus des engrais, ils provoquent l'eutrophisation des lacs et rivières, entraînant la prolifération d'algues, la diminution de l'oxygène et la mort des poissons.
*   **Érosion des sols**: Le ruissellement emporte des particules de sol et des polluants vers les cours d'eau.

#### 2. Pollution d'origine industrielle

Les industries rejettent souvent des effluents contenant une variété de polluants.

*   **Métaux lourds**: Plomb, mercure, cadmium, toxiques pour les écosystèmes et la santé humaine.
*   **Produits chimiques organiques**: Solvants, hydrocarbures, produits pharmaceutiques.
*   **Rejets thermiques**: L'eau chaude rejetée par les centrales électriques peut altérer les écosystèmes aquatiques en diminuant la teneur en oxygène de l'eau.

#### 3. Pollution d'origine urbaine

La croissance urbaine génère d'importantes quantités d'eaux usées.

*   **Eaux usées domestiques**: Contiennent des matières organiques, des nutriments, des bactéries pathogènes et des virus. Un traitement insuffisant ou inexistant de ces eaux est une cause majeure de maladies hydriques.
*   **Microplastiques**: Provenant des produits de consommation et des eaux usées, ils contaminent les écosystèmes aquatiques et la chaîne alimentaire.
*   **Pollution diffuse**: Le ruissellement urbain emporte huiles, graisses, métaux lourds et débris des surfaces imperméabilisées vers les cours d'eau.

### Impact des activités humaines et des changements climatiques sur le cycle hydrologique

Les activités anthropiques et le changement climatique interagissent pour modifier profondément le cycle hydrologique.

#### 1. Impact des activités humaines

*   **Agriculture**:
    *   **Irrigation**: Détourne d'énormes volumes d'eau des rivières et des aquifères, souvent avec une faible efficacité.
    *   **Drainage**: Modifie les régimes hydrologiques des zones humides et des sols agricoles.
    *   **Déforestation**: Réduit l'interception et l'infiltration, augmente le ruissellement et l'érosion, et diminue l'évapotranspiration à l'échelle locale.
*   **Industrie**:
    *   **Consommation d'eau**: Pour le refroidissement, les processus de fabrication, le nettoyage.
    *   **Modification des cours d'eau**: Barrages, canaux, endiguements pour l'hydroélectricité ou la navigation.
*   **Urbanisation**:
    *   **Imperméabilisation des sols**: Routes, bâtiments, parkings empêchent l'infiltration naturelle de l'eau, augmentant le ruissellement superficiel et le risque d'inondations urbaines.
    *   **Modification des débits**: Les systèmes de drainage urbains accélèrent l'évacuation de l'eau, perturbant les régimes hydrologiques naturels des cours d'eau.
    *   **Augmentation de la demande**: Concentre la demande en eau dans des zones restreintes, nécessitant des transferts d'eau sur de longues distances.

#### 2. Impact des changements climatiques

Le Groupe d'experts intergouvernemental sur l'évolution du climat (GIEC) a clairement établi que le changement climatique modifie déjà et continuera de modifier le cycle hydrologique mondial [ref6].

*   **Modification des régimes de précipitations**:
    *   **Intensification des événements extrêmes**: Augmentation de la fréquence et de l'intensité des fortes pluies, entraînant des inondations plus sévères.
    *   **Augmentation des périodes de sécheresse**: Dans d'autres régions, ou à d'autres moments de l'année, entraînant des pénuries d'eau et des feux de forêt.
    *   **Changements saisonniers**: Décalage des saisons des pluies, impactant l'agriculture et la recharge des aquifères.
*   **Fonte des glaciers et calottes glaciaires**:
    *   **Augmentation initiale des débits**: La fonte accélérée peut augmenter temporairement les débits des rivières glaciaires.
    *   **Diminution à long terme**: Une fois les glaciers réduits, la contribution de leur fonte aux débits diminuera drastiquement, menaçant l'approvisionnement en eau des populations dépendantes.
*   **Élévation du niveau de la mer**:
    *   **Intrusion saline**: Aggrave l'intrusion saline dans les aquifères côtiers, réduisant la disponibilité d'eau douce.
    *   **Submersion des zones humides côtières**: Affecte les écosystèmes et les services hydrologiques qu'ils fournissent.
*   **Augmentation de l'évapotranspiration**: Des températures plus élevées augmentent l'évaporation des surfaces d'eau et la transpiration des plantes, réduisant la quantité d'eau disponible dans les sols et les réservoirs.
*   **Impact sur la qualité de l'eau**: Des températures plus élevées peuvent favoriser la prolifération d'algues toxiques dans les lacs et réservoirs, et des débits plus faibles peuvent concentrer les polluants dans les rivières.

### Principes et défis de la gestion intégrée de l'eau

Face à ces enjeux complexes, la gestion intégrée des ressources en eau (GIRE) est devenue le cadre de référence international. Elle vise à promouvoir le développement et la gestion coordonnés de l'eau, des terres et des ressources connexes, afin de maximiser le bien-être économique et social qui en résulte, de manière équitable, sans compromettre la durabilité des écosystèmes vitaux.

#### 1. Principes de la GIRE

*   **Approche holistique et systémique**: Considérer l'eau non pas comme une ressource isolée, mais comme partie intégrante d'un écosystème plus large, en lien avec les terres, l'environnement et les activités humaines.
*   **Gestion par bassin versant**: Reconnaître le bassin versant comme l'unité géographique naturelle et pertinente pour la planification et la gestion de l'eau, transcendant les frontières administratives.
*   **Participation des parties prenantes**: Impliquer tous les acteurs concernés (gouvernements, communautés locales, agriculteurs, industries, ONG) dans les processus de décision.
*   **Efficience économique**: Utiliser l'eau de manière efficiente, en reconnaissant sa valeur économique, sans oublier sa valeur sociale et environnementale.
*   **Équité sociale**: Assurer un accès équitable à l'eau pour tous, en particulier pour les populations vulnérables.
