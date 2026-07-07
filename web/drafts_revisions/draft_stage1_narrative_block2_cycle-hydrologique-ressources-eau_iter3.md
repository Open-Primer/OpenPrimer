...Humidité initiale du sol**: Un sol sec a une capacité d'infiltration plus élevée qu'un sol déjà humide ou saturé.
*   **Végétation et couverture du sol**: La végétation intercepte les précipitations, ralentit le ruissellement et favorise l'infiltration grâce à ses racines qui créent des macropores. La litière organique au sol améliore également la structure du sol et sa capacité d'absorption.
*   **Intensité et durée des précipitations**: Si l'intensité des précipitations dépasse la capacité d'infiltration du sol, le surplus d'eau s'écoulera en surface. Des pluies prolongées peuvent saturer le sol, réduisant drastiquement l'infiltration.
*   **Température**: Le gel du sol peut empêcher l'infiltration, tandis que des températures élevées augmentent l'évaporation de l'eau de surface, ce qui peut paradoxalement augmenter la capacité d'infiltration si le sol s'assèche, ou la réduire si la surface devient compacte.
*   **Pente du terrain**: Sur des pentes raides, l'eau a moins de temps pour s'infiltrer et tend à ruisseler davantage.

L'infiltration est un processus fondamental qui alimente les réserves d'eau souterraine, essentielles pour l'approvisionnement en eau potable et le maintien des écosystèmes. La compréhension de ses mécanismes et des facteurs qui l'influencent est cruciale pour la gestion des ressources hydriques et la prévention des risques naturels comme les inondations et les sécheresses.

---

## Bilan hydrique et dynamique des réserves d'eau douce

Le [[WIDGET:ConceptLink:bilan_hydrique:bilan hydrique]] est un concept central en hydrologie, représentant l'équilibre entre les entrées et les sorties d'eau dans un système donné, ainsi que les variations de ses réserves. Il s'exprime généralement par l'équation fondamentale :

**P = E + R + ΔS**

Où :
*   **P** représente les précipitations (pluie, neige, grêle) qui constituent l'apport principal en eau au système.
*   **E** représente l'évapotranspiration, c'est-à-dire la somme de l'évaporation directe depuis les surfaces d'eau et du sol, et de la transpiration des plantes.
*   **R** représente le ruissellement total, incluant le ruissellement superficiel et l'écoulement souterrain qui alimentent les cours d'eau.
*   **ΔS** représente la variation des stocks d'eau dans le système (sol, nappes souterraines, lacs, glaciers, etc.).

L'analyse du bilan hydrique peut être réalisée à différentes échelles spatiales, chacune offrant une perspective unique sur la dynamique de l'eau.

### Analyse du bilan hydrique à différentes échelles

#### 1. À l'échelle du bassin versant

Le bassin versant est l'unité géographique fondamentale pour l'étude hydrologique. Il s'agit d'une zone drainée par un cours d'eau principal et ses affluents, délimitée par une ligne de partage des eaux. À cette échelle, le bilan hydrique permet de comprendre comment l'eau est reçue, stockée et évacuée.

*   **Entrées**: Les précipitations sont la principale entrée. Elles sont mesurées par des pluviomètres et peuvent varier considérablement en intensité et en répartition spatiale au sein d'un même bassin.
*   **Sorties**:
    *   **Évapotranspiration (E)**: Dépend de facteurs climatiques (température, humidité de l'air, vent, rayonnement solaire) et de la couverture végétale. Elle est souvent la composante la plus difficile à mesurer directement et est estimée par diverses méthodes (par exemple, la méthode de Thornthwaite ou de Penman-Monteith).
    *   **Débit des cours d'eau (R)**: Représente l'eau qui quitte le bassin par le réseau hydrographique. Il est mesuré par des stations hydrométriques et intègre le ruissellement de surface, l'écoulement hypodermique et la contribution des eaux souterraines.
*   **Stockage (ΔS)**: Comprend l'eau stockée dans le sol (humidité du sol), dans les nappes phréatiques, dans les lacs et réservoirs, et sous forme de neige ou de glace. Les variations de ces stocks sont cruciales pour comprendre la réponse hydrologique du bassin aux événements climatiques (sécheresses, crues).

L'étude du bilan hydrique à l'échelle du bassin versant est essentielle pour la gestion locale des ressources en eau, la prévision des crues et des étiages, et l'évaluation de l'impact des aménagements (barrages, déforestation, urbanisation) sur le régime hydrologique [ref2].

#### 2. À l'échelle régionale

À l'échelle régionale, le bilan hydrique agrège les dynamiques de plusieurs bassins versants ou de vastes zones géographiques caractérisées par des conditions climatiques et géomorphologiques similaires. L'objectif est de comprendre les grandes tendances de la disponibilité en eau et les interactions entre les systèmes hydrologiques.

*   **Facteurs régionaux**: Les régimes climatiques (méditerranéen, continental, océanique, tropical) influencent fortement les composantes du bilan. Par exemple, les régions arides ont une évapotranspiration potentielle élevée et des précipitations faibles, conduisant à un bilan déficitaire, tandis que les régions humides présentent souvent un excédent.
*   **Interconnexions**: À cette échelle, les transferts d'eau entre régions (par exemple, via de grands fleuves transfrontaliers ou des aquifères partagés) deviennent significatifs. Les politiques de gestion de l'eau doivent alors prendre en compte ces interdépendances.
*   **Modélisation**: Des modèles hydrologiques régionaux sont utilisés pour simuler les flux d'eau et les stocks sur de grandes surfaces, aidant à la planification des ressources et à l'évaluation des impacts du changement climatique [ref6].

#### 3. À l'échelle globale

Le bilan hydrique global décrit le cycle de l'eau à l'échelle planétaire, mettant en évidence les transferts massifs d'eau entre les océans, l'atmosphère et les continents. Il s'agit d'un système fermé où la quantité totale d'eau est constante, mais où sa répartition et son état changent continuellement.

[[WIDGET:Mermaid:global_water_cycle_balance]]
```mermaid
graph TD
    A[Océans] -->|Évaporation (434 000 km³/an)| B(Atmosphère)
    B -->|Précipitations sur océans (398 000 km³/an)| A
    B -->|Précipitations sur continents (113 000 km³/an)| C(Continents)
    C -->|Évapotranspiration (71 000 km³/an)| B
    C -->|Ruissellement vers océans (42 000 km³/an)| A
    subgraph Réservoirs Continentaux
        C1[Lacs et Rivières]
        C2[Eaux Souterraines]
        C3[Glaciers et Neige]
        C4[Humidité du Sol]
    end
    C --> C1
    C --> C2
    C --> C3
    C --> C4
    C1 <--> C2
    C1 <--> C4
    C3 --> C1
    C4 --> C2
    C2 --> C1
```
Bilan hydrique global simplifié, illustrant les principaux flux entre les océans, l'atmosphère et les continents. Les chiffres sont des ordres de grandeur annuels en km³.

*   **Réservoirs majeurs**:
    *   **Océans**: Contiennent environ 97,5% de l'eau totale de la Terre.
    *   **Glaciers et calottes polaires**: Environ 1,7% de l'eau totale, mais la plus grande réserve d'eau douce.
    *   **Eaux souterraines**: Environ 0,7% de l'eau totale, deuxième plus grande réserve d'eau douce.
    *   **Lacs et rivières**: Une fraction minime (0,01%), mais cruciale pour les écosystèmes et l'humanité.
    *   **Atmosphère et humidité du sol**: Des quantités encore plus faibles, mais des flux très dynamiques.
*   **Flux globaux**: Les principaux flux sont l'évaporation des océans, les précipitations sur les océans et les continents, l'évapotranspiration continentale et le ruissellement continental vers les océans. Ces flux sont à l'origine des grands cycles climatiques et hydrologiques [ref1].
*   **Changement climatique**: À cette échelle, le changement climatique modifie les flux et les stocks d'eau, avec des impacts sur la circulation atmosphérique, la fonte des glaces, l'élévation du niveau marin et la fréquence des événements extrêmes [ref6].

### Dynamique des principales réserves d'eau douce

L'eau douce, bien que ne représentant qu'une faible proportion de l'eau totale de la planète (environ 2,5%), est essentielle à la vie. Sa répartition et sa dynamique sont complexes et interconnectées.

[[WIDGET:Image:global_freshwater_distribution]]
Distribution mondiale des réserves d'eau douce.

#### 1. Eaux de surface

Les eaux de surface comprennent les lacs, les rivières, les zones humides et les réservoirs artificiels. Elles sont les plus accessibles et visibles des réserves d'eau douce.

*   **Lacs**:
    *   **Formation**: Les lacs peuvent se former de diverses manières : par des processus tectoniques (graben, fosses d'effondrement comme le lac Baïkal), par l'activité volcanique (lacs de cratère), par l'action glaciaire (lacs de cirque, lacs de barrage morainique), par dissolution de roches solubles (lacs karstiques), ou par des méandres abandonnés de rivières (lacs de bras mort).
    *   **Rôle hydrologique**: Les lacs agissent comme des régulateurs naturels des débits fluviaux, stockant l'eau pendant les périodes de crue et la restituant pendant les étiages. Ils sont aussi des sites importants d'évaporation.
    *   **Écologie**: Les lacs abritent des écosystèmes aquatiques riches et diversifiés, et sont des sources d'eau pour la faune et la flore.
    *   **Vulnérabilité**: Ils sont sensibles à la pollution, à l'eutrophisation et aux variations climatiques (assèchement).
*   **Rivières et fleuves**:
    *   **Réseaux de drainage**: Les rivières et fleuves constituent les artères du cycle hydrologique continental, collectant l'eau de ruissellement et souterraine des bassins versants et la transportant vers les lacs, les océans ou d'autres systèmes fluviaux.
    *   **Régimes hydrologiques**: Le régime d'un cours d'eau décrit ses variations de débit au cours de l'année. Il est influencé par le climat (régime pluvial), la fonte des neiges (régime nival) ou des glaciers (régime glaciaire), et la géologie du bassin.
    *   **Fonctions**: Ils sont essentiels pour l'approvisionnement en eau, l'irrigation, la navigation, la production d'énergie hydroélectrique et le maintien de la biodiversité. Ils jouent également un rôle majeur dans le transport des sédiments et des nutriments [ref3].

#### 2. Eaux souterraines

Les eaux souterraines représentent la plus grande réserve d'eau douce liquide de la planète, stockée dans les formations géologiques poreuses et perméables appelées aquifères.

*   **Aquifères**:
    *   **Définition**: Un [[WIDGET:Glossary:aquifere:aquifère]] est une formation géologique capable de stocker et de laisser circuler l'eau. Sa capacité dépend de sa porosité (volume des vides) et de sa perméabilité (capacité à laisser passer l'eau).
    *   **Types**:
        *   **Aquifères libres (ou nappes phréatiques)**: La surface de l'eau (niveau piézométrique) est en contact direct avec l'atmosphère via la zone non saturée. Ils sont facilement rechargeables par l'infiltration des précipitations.
        *   **Aquifères captifs (ou nappes artésiennes)**: L'aquifère est confiné entre deux couches imperméables (aquicludes). L'eau y est sous pression, et un forage peut entraîner une remontée spontanée de l'eau (puits artésien). Leur recharge est plus lente et se fait dans des zones d'affleurement lointaines.
    *   **Importance**: Les eaux souterraines sont une source d'eau potable vitale pour des milliards de personnes, en particulier dans les régions arides ou semi-arides. Elles alimentent également les cours d'eau et les zones humides, surtout pendant les périodes de sécheresse.
*   **Nappes phréatiques**:
    *   **Définition**: La nappe phréatique est la surface supérieure de la zone saturée d'un aquifère libre. Son niveau fluctue en fonction de la recharge (précipitations, infiltration) et des prélèvements (pompage, alimentation des cours d'eau).
    *   **Interactions**: Les nappes phréatiques sont en interaction constante avec les eaux de surface. Elles peuvent alimenter les rivières (écoulement de base) ou être rechargées par elles (en période de crue). Elles sont également sensibles à la pollution de surface.

#### 3. Glaces et neige

Les glaces et la neige constituent la plus grande réserve d'eau douce sur Terre, principalement sous forme solide.

*   **Glaciers et calottes polaires**:
    *   **Réservoirs massifs**: Les calottes glaciaires de l'Antarctique et du Groenland, ainsi que les glaciers de montagne, stockent d'énormes quantités d'eau douce. Par exemple, l'Antarctique contient environ 90% de la glace terrestre et 70% de l'eau douce de la planète.
    *   **Rôle climatique**: Ils jouent un rôle crucial dans la régulation du climat global en réfléchissant le rayonnement solaire (effet d'albédo) et en influençant la circulation océanique.
    *   **Approvisionnement en eau**: Dans de nombreuses régions montagneuses (Himalaya, Andes, Alpes), la fonte saisonnière des glaciers est une source d'eau vitale pour l'irrigation, l'hydroélectricité et l'approvisionnement en eau potable.
    *   **Vulnérabilité**: Ils sont extrêmement sensibles au réchauffement climatique, leur fonte accélérée contribuant à l'élévation du niveau de la mer et modifiant les régimes hydrologiques en aval [ref6].
*   **Neige**:
    *   **Stockage saisonnier**: La neige accumulée en hiver représente un stockage temporaire d'eau douce. Sa fonte printanière alimente les cours d'eau et recharge les sols et les nappes.
    *   **Importance hydrologique**: Dans les régions de montagne et les zones tempérées froides, le manteau neigeux est un régulateur essentiel du cycle hydrologique, influençant les débits fluviaux et la disponibilité de l'eau pour l'été.
*   **Permafrost**:
    *   **Définition**: Le permafrost est un sol dont la température reste inférieure ou égale à 0°C pendant au moins deux années consécutives. Il contient d'importantes quantités d'eau sous forme de glace.
    *   **Impact du dégel**: Le dégel du permafrost, induit par le réchauffement climatique, libère de l'eau et des gaz à effet de serre (méthane, CO2), modifie la topographie et l'hydrologie des régions arctiques et subarctiques, et peut affecter la stabilité des infrastructures.

### Interconnexion des réservoirs d'eau douce

L'un des aspects les plus importants du cycle hydrologique est l'interconnexion dynamique de ces différents réservoirs. L'eau n'est jamais statique ; elle est en mouvement constant, passant d'un compartiment à l'autre.

*   **Précipitations et infiltration**: Les précipitations rechargent directement les eaux de surface (lacs, rivières) et, par infiltration, les eaux souterraines et l'humidité du sol.
*   **Interaction surface-souterrain**: Les rivières et les lacs peuvent être alimentés par les nappes phréatiques (phénomène de "drainage" ou "exfiltration") ou, inversement, recharger les nappes (phénomène d'"infiltration" ou "recharge"). Cette interaction est cruciale pour le maintien des débits d'étiage et des écosystèmes aquatiques.
*   **Fonte des glaces et neige**: La fonte des glaciers et du manteau neigeux alimente les cours d'eau, qui à leur tour peuvent recharger les lacs et les nappes phréatiques en aval. Cette contribution est particulièrement importante pendant les saisons chaudes.
*   **Évapotranspiration**: L'eau des sols, des lacs et des rivières retourne à l'atmosphère par évaporation et transpiration, bouclant ainsi une partie du cycle.

Cette interdépendance signifie que toute perturbation d'un réservoir (par exemple, la surexploitation d'une nappe phréatique, la pollution d'un lac, la fonte d'un glacier) aura des répercussions sur les autres compartiments du système hydrologique. Comprendre ces liens est fondamental pour une gestion durable de l'eau. Le géographe et hydrologiste [[WIDGET:RealPerson:alfred_wegener:Alfred Wegener]] a, bien que plus connu pour sa théorie de la dérive des continents, souligné l'importance de l'observation des phénomènes naturels dans leur globalité, une approche qui résonne avec la vision intégrée du cycle de l'eau.

[[WIDGET:Quiz:water_reservoirs_interconnection]]
**Quiz: Interconnexion des Réservoirs d'Eau Douce**

1.  Quel est le plus grand réservoir d'eau douce sur Terre ?
    a) Les lacs et rivières
    b) Les eaux souterraines
    c) Les glaciers et calottes polaires
    d) L'humidité du sol

2.  Comment les nappes phréatiques peuvent-elles interagir avec les cours d'eau ?
    a) Elles ne peuvent qu'alimenter les cours d'eau.
    b) Elles ne peuvent être rechargées que par les cours d'eau.
    c) Elles peuvent à la fois alimenter et être rechargées par les cours d'eau.
    d) Il n'y a pas d'interaction directe entre les deux.

3.  Quel phénomène climatique est directement lié à la fonte accélérée des glaciers et a un impact sur le niveau des mers ?
    a) Les précipitations extrêmes
    b) Le réchauffement climatique
    c) La désertification
    d) L'eutrophisation

4.  L'équation P = E + R + ΔS représente :
    a) Le bilan énergétique d'un écosystème
    b) Le bilan sédimentaire d'un fleuve
    c) Le bilan hydrique d'un système
    d) Le cycle du carbone

---

## Enjeux contemporains et gestion des ressources en eau

La disponibilité et la qualité de l'eau douce sont devenues des préoccupations majeures à l'échelle mondiale au XXIe siècle. La croissance démographique, le développement économique et les changements climatiques exercent une pression sans précédent sur cette ressource vitale, transformant sa gestion en un défi complexe et multidimensionnel.

### Problématiques de la disponibilité et de la qualité de l'eau douce

#### 1. Disponibilité de l'eau douce

*   **Stress hydrique et pénurie**: Le [[WIDGET:Glossary:stress_hydrique:stress hydrique]] survient lorsque la demande en eau dépasse les ressources disponibles ou lorsque la qualité de l'eau limite son utilisation. La pénurie physique d'eau se manifeste par l'insuffisance des ressources naturelles pour satisfaire les besoins, tandis que la pénurie économique est due à un manque d'investissement dans les infrastructures pour capter, traiter et distribuer l'eau, même si la ressource est physiquement présente. Des régions entières, notamment au Moyen-Orient, en Afrique du Nord, en Asie centrale et dans certaines parties de l'Inde et de la Chine, sont déjà confrontées à un stress hydrique sévère [ref6].
*   **Accès inégal à l'eau potable**: Malgré les progrès, des milliards de personnes n'ont toujours pas accès à des services d'eau potable gérés en toute sécurité. Cet accès inégal est souvent lié à des facteurs socio-économiques, géographiques et politiques, exacerbant les inégalités et les conflits.
*   **Surexploitation des aquifères**: Le pompage excessif des eaux souterraines pour l'agriculture, l'industrie et l'approvisionnement urbain entraîne une baisse des niveaux piézométriques, l'épuisement des nappes fossiles (non renouvelables à l'échelle humaine) et, dans les zones côtières, l'intrusion d'eau salée, rendant l'eau impropre à la consommation ou à l'irrigation. C'est un problème majeur dans des régions comme la Californie, le nord de la Chine ou le bassin du Gange.

#### 2. Qualité de l'eau douce

*   **Pollution agricole**: L'utilisation intensive d'engrais (nitrates, phosphates) et de pesticides dans l'agriculture est une source majeure de pollution diffuse des eaux de surface et souterraines. Ces substances peuvent provoquer l'eutrophisation des lacs et rivières (prolifération d'algues, désoxygénation), et rendre l'eau impropre à la consommation.
*   **Pollution industrielle**: Les rejets industriels non traités ou mal traités contiennent souvent des métaux lourds, des produits chimiques organiques toxiques et d'autres polluants qui contaminent gravement les écosystèmes aquatiques et menacent la santé humaine.
*   **Pollution urbaine**: Les eaux usées domestiques et les eaux de ruissellement urbain (chargées de déchets, d'hydrocarbures, de microplastiques) contribuent à la pollution bactériologique et chimique des cours d'eau et des lacs, en particulier dans les zones où les infrastructures d'assainissement sont insuffisantes.
*   **Salinisation**: Outre l'intrusion marine dans les aquifères côtiers, la salinisation des sols et des eaux peut être causée par une irrigation excessive dans les zones arides, où l'évaporation concentre les sels minéraux.
*   **Impact sur les écosystèmes aquatiques**: La dégradation de la qualité de l'eau a des conséquences directes sur la biodiversité aquatique, entraînant la disparition d'espèces, la perturbation des chaînes alimentaires et la dégradation des services écosystémiques (purification naturelle de l'eau, régulation des crues).

### Impact des activités humaines et des changements climatiques sur le cycle hydrologique

Les activités humaines et le changement climatique sont les principaux moteurs des modifications du cycle hydrologique et des ressources en eau.

#### 1. Impact des activités humaines

*   **Agriculture**: L'agriculture est de loin le plus grand consommateur d'eau douce à l'échelle mondiale, représentant environ 70% des prélèvements. L'irrigation intensive, souvent inefficace, épuise les ressources en eau de surface et souterraines. La déforestation pour l'agriculture modifie également les régimes de ruissellement et d'infiltration.

[[WIDGET:DataChart:global_water_use_by_sector]]
```json
{
  "type": "pie",
  "data": {
    "labels": ["Agriculture", "Industrie", "Usage domestique"],
    "datasets": [{
      "data": [70, 20, 10],
      "backgroundColor": ["#4CAF50", "#2196F3", "#FFC107"]
    }]
  },
  "options": {
    "responsive": true,
    "plugins": {
      "title": {
        "display": true,
        "text": "Répartition mondiale de l'utilisation de l'eau douce par secteur (estimation)"
      }
    }
  }
}
```
Répartition mondiale estimée de l'utilisation de l'eau douce par secteur.

*   **Industrie**: Le secteur industriel utilise environ 20% de l'eau douce mondiale, principalement pour le refroidissement, les processus de fabrication et l'élimination des déchets. Les rejets d'eaux usées industrielles non traitées sont une source majeure de pollution.
*   **Urbanisation**: L'expansion urbaine entraîne l'imperméabilisation des sols (routes, bâtiments), ce qui réduit l'infiltration et augmente le ruissellement de surface, aggravant les risques d'inondation et diminuant la recharge des nappes. La concentration de populations génère également d'importants volumes d'eaux usées et de déchets.
*   **Aménagements hydrauliques**: La construction de barrages et de réservoirs modifie les régimes fluviaux naturels, affectant les écosystèmes en aval, la migration des poissons et le transport des sédiments. Bien qu'ils fournissent de l'énergie et régulent l'eau, ils peuvent aussi entraîner des déplacements de populations et des conflits d'usage.

#### 2. Impact des changements climatiques

Le Groupe d'experts intergouvernemental sur l'évolution du climat (GIEC) a clairement établi que le changement climatique modifie le cycle hydrologique mondial [ref6].

*   **Modification des régimes de précipitations**:
    *   **Augmentation des extrêmes**: Les régions déjà humides devraient connaître des précipitations plus intenses, augmentant le risque d'inondations. Les régions arides et semi-arides devraient faire face à des sécheresses plus fréquentes et plus sévères.
    *   **Variabilité accrue**: Une plus grande variabilité interannuelle et intra-annuelle des précipitations rend la planification des ressources en eau plus difficile.
*   **Fonte des glaciers et calottes polaires**: La fonte accélérée des glaciers et des calottes glaciaires contribue à l'élévation du niveau de la mer. À court terme, elle peut augmenter les débits fluviaux dans les régions glaciaires, mais à long terme, elle menace l'approvisionnement en eau des populations qui dépendent de cette source saisonnière.
*   **Augmentation de l'évapotranspiration**: Des températures plus élevées augmentent l'évaporation des surfaces d'eau et la transpiration des plantes, réduisant ainsi la disponibilité nette d'eau douce.
*   **Élévation du niveau de la mer**: L'élévation du niveau de la mer entraîne l'intrusion d'eau salée dans les aquifères côtiers et les estuaires, rendant les ressources en eau douce inutilisables. Cela affecte particulièrement les deltas densément peuplés.
*   **Impact sur la qualité de l'eau**: Les inondations peuvent entraîner le débordement des systèmes d'assainissement et la contamination des sources d'eau. Les sécheresses peuvent concentrer les polluants dans les cours d'eau et les lacs, dégradant la qualité de l'eau.

### Principes et défis de la gestion intégrée de l'eau (GIE)

Face à ces enjeux, la [[WIDGET:ConceptLink:gestion_integree_eau:Gestion Intégrée des Ressources en Eau (GIRE)]] est devenue le cadre de référence international pour une gestion durable de l'eau. Elle vise à coord