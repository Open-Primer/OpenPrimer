# Le système climatique terrestre: bilans énergétiques et composition atmosphérique

## Introduction au système climatique terrestre

Le [[WIDGET:Glossary:systeme_climatique:système climatique]] terrestre est une entité dynamique et complexe, fruit d'interactions incessantes entre diverses composantes physiques et biologiques de notre planète. Loin d'être une simple somme de ses parties, il fonctionne comme un système intégré où chaque élément influence et est influencé par les autres, régulant ainsi le climat global que nous connaissons. Comprendre ce système est fondamental pour appréhender les mécanismes naturels qui façonnent notre environnement, ainsi que les perturbations anthropiques qui menacent son équilibre.

Ce système peut être décomposé en cinq composantes principales, souvent désignées comme des "sphères" (Barry & Chorley, 2009 [ref1]):

1.  **L'Atmosphère**: Il s'agit de l'enveloppe gazeuse qui entoure la Terre. Composée principalement d'azote (N₂), d'oxygène (O₂), d'argon (Ar) et de traces d'autres gaz (dont les gaz à effet de serre comme le dioxyde de carbone (CO₂) et la vapeur d'eau (H₂O)), l'atmosphère joue un rôle crucial dans la régulation thermique de la planète. Elle absorbe une partie du rayonnement solaire, réfléchit une autre, et piège le rayonnement infrarouge émis par la surface terrestre, créant ainsi l'effet de serre naturel essentiel à la vie. Elle est également le siège des phénomènes météorologiques.

2.  **L'Hydrosphère**: Cette composante englobe toutes les formes d'eau sur Terre, qu'elle soit liquide (océans, mers, lacs, rivières, eaux souterraines), solide (glaciers, calottes polaires, neige, pergélisol – formant la cryosphère, souvent considérée comme une composante distincte) ou gazeuse (vapeur d'eau dans l'atmosphère). Les océans, en particulier, représentent un réservoir de chaleur et de carbone colossal, influençant les courants marins et atmosphériques à l'échelle planétaire.

3.  **La Cryosphère**: Bien que souvent incluse dans l'hydrosphère, la cryosphère mérite une mention spécifique en raison de son rôle distinctif dans le système climatique. Elle comprend toutes les surfaces gelées de la Terre: les calottes glaciaires (Antarctique, Groenland), les glaciers de montagne, la neige saisonnière, la glace de mer et le pergélisol. Sa forte capacité à réfléchir le rayonnement solaire (albédo élevé) en fait un régulateur thermique majeur.

4.  **La Lithosphère**: Représentant la partie solide externe de la Terre, la lithosphère inclut la croûte terrestre et la partie supérieure du manteau. Les continents, les reliefs, les sols et les roches influencent les flux d'énergie et de matière. La géomorphologie des surfaces terrestres affecte l'absorption du rayonnement solaire, la circulation atmosphérique et la distribution de l'eau. Les processus géologiques, tels que le volcanisme, peuvent également injecter des gaz et des particules dans l'atmosphère, modifiant temporairement le climat.

5.  **La Biosphère**: Cette composante regroupe l'ensemble des organismes vivants (plantes, animaux, micro-organismes) et leurs environnements. La végétation, par exemple, influence l'albédo de la surface, le cycle de l'eau (évapotranspiration) et les échanges de gaz (photosynthèse et respiration) avec l'atmosphère, notamment le CO₂. Les écosystèmes marins jouent également un rôle crucial dans le cycle du carbone.

Ces composantes ne sont pas isolées; elles interagissent constamment à travers des boucles de rétroaction complexes. Par exemple, l'océan échange chaleur et humidité avec l'atmosphère, la végétation modifie la composition atmosphérique et le bilan hydrique des sols, tandis que la fonte des glaces (cryosphère) impacte le niveau marin (hydrosphère) et l'albédo (lithosphère/atmosphère).

[[WIDGET:Mermaid:climate_system_components]]
```mermaid
graph TD
    A[Atmosphère] -->|Échanges de gaz, chaleur, eau| B(Hydrosphère)
    A -->|Échanges de gaz, chaleur, eau| C(Cryosphère)
    A -->|Échanges de gaz, chaleur, eau| D(Lithosphère)
    A -->|Échanges de gaz, chaleur, eau| E(Biosphère)

    B -->|Échanges de chaleur, humidité| A
    B -->|Échanges de masse, énergie| C
    B -->|Érosion, sédimentation| D
    B -->|Support de vie, cycles biogéochimiques| E

    C -->|Réflexion solaire (albédo)| A
    C -->|Fonte, niveau marin| B
    C -->|Érosion, modelage des paysages| D
    C -->|Habitat, adaptation des espèces| E

    D -->|Émission de gaz volcaniques, poussières| A
    D -->|Cycle de l'eau, érosion| B
    D -->|Support des glaciers| C
    D -->|Support de la vie, cycles biogéochimiques| E

    E -->|Photosynthèse, respiration, évapotranspiration| A
    E -->|Cycles biogéochimiques, productivité marine| B
    E -->|Adaptation aux conditions glaciaires| C
    E -->|Formation des sols, altération des roches| D

    subgraph Système Climatique Terrestre
        A
        B
        C
        D
        E
    end
```
*Caption: Diagramme des interactions entre les principales composantes du système climatique terrestre.*

Au cœur de la régulation du système climatique se trouvent les **bilans énergétiques** et la **composition atmosphérique**. Le bilan énergétique global de la Terre, dicté principalement par le rayonnement solaire entrant et le rayonnement terrestre sortant, détermine la température moyenne de la planète. Toute modification de ce bilan, qu'elle soit due à des variations naturelles ou à des activités humaines, peut entraîner des changements climatiques significatifs. La composition atmosphérique, notamment la concentration des gaz à effet de serre, joue un rôle prépondérant dans la capacité de l'atmosphère à retenir la chaleur, modulant ainsi l'effet de serre naturel.

**Objectifs du cours**:
À l'issue de cette leçon, vous serez capable de:
*   Définir le système climatique terrestre et identifier ses composantes principales.
*   Expliquer les interactions fondamentales entre ces composantes.
*   Décrire les mécanismes des bilans énergétiques de la Terre et de l'atmosphère.
*   Appliquer les lois physiques fondamentales (Stefan-Boltzmann, Wien) pour comprendre les transferts d'énergie.
*   Analyser le rôle de la composition atmosphérique, en particulier des gaz à effet de serre, dans la régulation thermique de la planète.
*   Distinguer les différents flux d'énergie (radiatif, sensible, latent) et leur importance dans le système climatique.

## Les bilans énergétiques du système Terre-atmosphère

Le climat de la Terre est fondamentalement régi par l'énergie. L'énergie solaire est la principale force motrice du système climatique, déterminant la température de surface, les mouvements atmosphériques et océaniques, et le cycle de l'eau. Comprendre comment cette énergie est reçue, distribuée, transformée et réémise est essentiel pour saisir la dynamique climatique.

### 1. Sources d'énergie: Le rayonnement solaire

La quasi-totalité de l'énergie qui alimente le système climatique terrestre provient du Soleil sous forme de [[WIDGET:Glossary:rayonnement_electromagnetique:rayonnement électromagnétique]]. Le Soleil, une étoile de type G2V, émet un spectre continu de longueurs d'onde, allant des rayons gamma aux ondes radio, mais l'essentiel de son énergie est concentré dans le visible, l'ultraviolet (UV) et le proche infrarouge.

L'énergie solaire incidente à la limite supérieure de l'atmosphère terrestre est appelée la **constante solaire**. Sa valeur moyenne est d'environ 1361 W/m² (Watts par mètre carré). Cependant, en raison de la forme sphérique de la Terre et de son mouvement de rotation, l'énergie moyenne reçue par unité de surface terrestre est un quart de cette valeur, soit environ 340-342 W/m² (GIEC, 2021 [ref6]). Cette valeur est une moyenne annuelle et globale, et elle varie avec la latitude, l'heure du jour et la saison.

Le rayonnement solaire est principalement un rayonnement à ondes courtes (longueurs d'onde courtes), avec un pic d'émission dans le spectre visible (environ 0,5 micromètre). Ceci est en accord avec la [[WIDGET:ConceptLink:loi_de_wien:loi de Wien]], qui stipule que la longueur d'onde du maximum d'émission (λ_max) d'un corps noir est inversement proportionnelle à sa température absolue (T):

$$ \lambda_{max} = \frac{b}{T} $$

où `b` est la constante de déplacement de Wien (environ 2,898 x 10⁻³ m·K). La température de surface du Soleil étant d'environ 5778 K, son pic d'émission se situe bien dans le visible.

### 2. Mécanismes d'absorption, de réflexion et d'émission

Une fois que le rayonnement solaire atteint la Terre, il subit une série de transformations:

#### a) Absorption

L'absorption est le processus par lequel l'énergie radiante est convertie en énergie thermique par une substance.
*   **Dans l'atmosphère**: Une partie du rayonnement solaire est absorbée par les gaz atmosphériques (ozone pour l'UV, vapeur d'eau et CO₂ pour certaines bandes infrarouges) et par les aérosols (particules en suspension). Cette absorption réchauffe directement l'atmosphère.
*   **À la surface terrestre**: La majeure partie du rayonnement solaire qui n'a pas été réfléchi ou absorbé par l'atmosphère atteint la surface terrestre (océans, continents, végétation). Cette énergie est absorbée, entraînant un réchauffement de la surface. La quantité d'énergie absorbée dépend de la nature de la surface (couleur, texture, humidité).

#### b) Réflexion (Albédo)

La réflexion est le processus par lequel le rayonnement est renvoyé dans l'espace sans être absorbé. L'[[WIDGET:ConceptLink:albedo:albédo]] est une mesure de la réflectivité d'une surface, exprimée comme le rapport entre le rayonnement réfléchi et le rayonnement incident. Sa valeur varie de 0 (absorption totale, corps noir parfait) à 1 (réflexion totale, miroir parfait).

*   **Albédo de l'atmosphère**: Les nuages, les aérosols et les molécules de gaz diffusent et réfléchissent une partie du rayonnement solaire vers l'espace. Les nuages sont particulièrement efficaces pour réfléchir le rayonnement solaire, contribuant significulièrement à l'albédo planétaire.
*   **Albédo de la surface terrestre**:
    *   Neige fraîche et glace: Albédo très élevé (0,7 à 0,9).
    *   Déserts de sable: Albédo modéré à élevé (0,3 à 0,45).
    *   Forêts: Albédo faible (0,1 à 0,2).
    *   Océans: Albédo très faible (0,03 à 0,1) pour les angles d'incidence élevés (Soleil haut dans le ciel), mais peut augmenter considérablement pour les angles faibles (Soleil bas).

L'albédo moyen de la Terre est d'environ 0,3 (ou 30%), ce qui signifie qu'environ 30% du rayonnement solaire incident est réfléchi directement vers l'espace. Cette valeur est cruciale pour le bilan énergétique global.

#### c) Émission (Rayonnement terrestre ou infrarouge)

Toute substance ayant une température supérieure au zéro absolu (0 K ou -273,15 °C) émet du rayonnement électromagnétique. La Terre, ayant une température moyenne de surface d'environ 15 °C (288 K), émet du rayonnement dans la gamme de l'infrarouge lointain, appelé **rayonnement terrestre** ou **rayonnement à ondes longues**.

La quantité d'énergie émise par une surface est régie par la [[WIDGET:ConceptLink:loi_de_stefan_boltzmann:loi de Stefan-Boltzmann]], qui stipule que la puissance totale rayonnée par unité de surface d'un corps noir est directement proportionnelle à la quatrième puissance de sa température absolue:

$$ E = \sigma T^4 $$

où `E` est la puissance émise (W/m²), `σ` est la constante de Stefan-Boltzmann (5,67 x 10⁻⁸ W·m⁻²·K⁻⁴), et `T` est la température absolue (K). Pour un corps gris (comme la Terre), on introduit l'émissivité (ε), un facteur compris entre 0 et 1: `E = εσT⁴`. La surface terrestre a une émissivité proche de 1 dans l'infrarouge.

[[WIDGET:RealPerson:stefan_boltzmann:Josef Stefan et Ludwig Boltzmann]] ont formulé cette loi à la fin du XIXe siècle, jetant les bases de la compréhension du transfert radiatif de chaleur.

Le rayonnement terrestre est absorbé par les gaz à effet de serre (vapeur d'eau, CO₂, méthane, etc.) et les nuages dans l'atmosphère. Cette absorption réchauffe l'atmosphère, qui à son tour réémet du rayonnement infrarouge dans toutes les directions, y compris vers la surface terrestre. C'est ce processus qui est à l'origine de l'**effet de serre naturel**, essentiel pour maintenir la Terre à une température habitable. Sans cet effet, la température moyenne de la Terre serait d'environ -18 °C.

### 3. Le bilan radiatif global de la Terre

Le bilan radiatif global représente l'équilibre entre l'énergie solaire entrante et l'énergie sortante (réfléchie et émise par la Terre). Pour que la température moyenne de la Terre reste stable sur de longues périodes, l'énergie entrante doit être égale à l'énergie sortante.

En moyenne, sur une année et à l'échelle planétaire, le rayonnement solaire incident à la limite supérieure de l'atmosphère est d'environ 342 W/m².
*   Environ 107 W/m² (soit 31%) sont réfléchis vers l'espace par les nuages, l'atmosphère et la surface terrestre (albédo planétaire).
*   Les 235 W/m² restants (342 - 107) sont absorbés par le système Terre-atmosphère.
    *   Environ 77 W/m² sont absorbés directement par l'atmosphère (ozone, vapeur d'eau, nuages).
    *   Environ 158 W/m² sont absorbés par la surface terrestre (océans, continents, végétation).

La Terre et son atmosphère émettent également du rayonnement à ondes longues vers l'espace. Pour maintenir l'équilibre, cette émission doit être égale aux 235 W/m² absorbés. Ce processus est plus complexe en raison de l'effet de serre. La surface terrestre émet en moyenne environ 398 W/m² de rayonnement infrarouge. Cependant, une grande partie de ce rayonnement est absorbée par l'atmosphère et réémise. Au final, environ 235 W/m² sont émis vers l'espace depuis la haute atmosphère.

[[WIDGET:Image:earth_energy_balance]]
*Caption: Schéma simplifié du bilan énergétique global de la Terre, illustrant les flux de rayonnement solaire entrant, de rayonnement réfléchi, et de rayonnement terrestre sortant. Les valeurs sont des moyennes globales annuelles en W/m².*

Ce bilan est un équilibre dynamique. Des déséquilibres, même minimes, peuvent entraîner des changements climatiques. Par exemple, une augmentation des gaz à effet de serre réduit la capacité de la Terre à émettre du rayonnement à ondes longues vers l'espace pour une température donnée, ce qui conduit à un réchauffement du système jusqu'à ce qu'un nouvel équilibre soit atteint à une température plus élevée (GIEC, 2021 [ref6]).

### 4. Flux d'énergie entre la surface et l'atmosphère

Outre le rayonnement, l'énergie est échangée entre la surface terrestre et l'atmosphère par des processus non radiatifs: les flux de chaleur sensible et latente.

#### a) Flux de chaleur sensible

Le flux de chaleur sensible (ou chaleur sèche) est le transfert d'énergie thermique par conduction et convection, résultant d'une différence de température entre la surface et l'air au-dessus.
*   **Conduction**: Transfert de chaleur par contact direct entre molécules. La surface terrestre réchauffée par le soleil transfère de la chaleur à la couche d'air immédiatement adjacente.
*   **Convection**: Transfert de chaleur par le mouvement de fluides (ici, l'air). L'air réchauffé près de la surface devient moins dense et s'élève, transportant la chaleur vers des couches plus froides de l'atmosphère. Ce processus est responsable de la formation des thermiques et des mouvements verticaux de l'air.

Le flux de chaleur sensible est particulièrement important dans les régions arides et semi-arides où l'humidité est faible, et dans les zones urbaines où les surfaces absorbent beaucoup de chaleur. Il contribue au réchauffement de la basse atmosphère.

#### b) Flux de chaleur latente

Le flux de chaleur latente (ou chaleur humide) est l'énergie transférée lors des changements de phase de l'eau, principalement l'évaporation et la condensation.
*   **Évaporation**: Lorsque l'eau liquide à la surface (océans, lacs, sols humides, végétation par évapotranspiration) se transforme en vapeur d'eau, elle absorbe une grande quantité d'énergie thermique de l'environnement sans que sa température n'augmente. Cette énergie est appelée **chaleur latente de vaporisation**. La vapeur d'eau ainsi formée est transportée dans l'atmosphère.
*   **Condensation**: Lorsque la vapeur d'eau se condense pour former des nuages ou des précipitations, elle libère cette chaleur latente dans l'atmosphère. Cette libération de chaleur est une source d'énergie majeure pour les systèmes météorologiques, notamment les tempêtes et les cyclones tropicaux.

Le flux de chaleur latente est un mécanisme de transport d'énergie extrêmement efficace, en particulier dans les régions tropicales et océaniques. Il est un élément clé du cycle hydrologique et joue un rôle fondamental dans la distribution de la chaleur sur la planète. Par exemple, l'énergie absorbée par l'évaporation dans les tropiques est transportée sous forme de vapeur d'eau vers des latitudes plus élevées, où elle est libérée lors de la condensation, contribuant ainsi à l'équilibre thermique global.

En résumé, le bilan énergétique de la Terre est un équilibre délicat entre le rayonnement solaire entrant, le rayonnement réfléchi, le rayonnement terrestre émis, et les transferts de chaleur sensible et latente. Ces processus sont interdépendants et régissent la température et la dynamique du système climatique. Toute perturbation de cet équilibre, qu'elle soit naturelle ou anthropique, a des répercussions profondes sur le climat de notre planète.