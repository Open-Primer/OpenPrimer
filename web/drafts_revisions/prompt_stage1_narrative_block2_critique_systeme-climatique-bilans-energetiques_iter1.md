You are the Narrative Critic Agent (Agent 4A). Review the generated block of text for the lesson:
---
## Composition atmosphérique et rôle des gaz à effet de serre

L'atmosphère terrestre est une enveloppe gazeuse essentielle à la vie, dont la composition détermine en grande partie le climat de notre planète. Elle est principalement constituée d'azote (N₂), qui représente environ 78% de son volume, et d'oxygène (O₂), qui en constitue environ 21% [ref2]. Ces deux gaz diatomiques sont relativement transparents au rayonnement infrarouge terrestre et ne contribuent pas directement à l'effet de serre. Le 1% restant est composé d'une multitude de gaz traces, parmi lesquels certains jouent un rôle fondamental dans la régulation thermique de la Terre : les gaz à effet de serre (GES).

Les gaz à effet de serre sont des molécules polyatomiques capables d'absorber et de réémettre le [[WIDGET:Glossary:rayonnement_infrarouge:rayonnement infrarouge]] (IR) émis par la surface terrestre. Cette propriété est due à leur structure moléculaire qui leur permet d'entrer en vibration à des fréquences correspondant à celles du rayonnement IR. En absorbant ce rayonnement, ils piègent une partie de la chaleur dans l'atmosphère, réchauffant ainsi la planète. Ce phénomène naturel est crucial pour maintenir une température propice à la vie [ref5].

Les principaux gaz à effet de serre, qu'ils soient d'origine naturelle ou anthropique, incluent :

*   **Vapeur d'eau (H₂O)** : C'est le GES le plus abondant et le plus puissant à l'état naturel, contribuant à environ 60-70% de l'effet de serre naturel. Sa concentration varie fortement selon la température et l'humidité de l'air, agissant comme une rétroaction positive dans le système climatique [ref1].
*   **Dioxyde de carbone (CO₂) **: Bien que moins abondant que la vapeur d'eau, le CO₂ est le principal contributeur anthropique à l'intensification de l'effet de serre. Il est émis naturellement par la respiration, la décomposition organique et les éruptions volcaniques, mais ses concentrations ont considérablement augmenté depuis l'ère industrielle en raison de la combustion des énergies fossiles et de la déforestation. Il contribue à environ 20-25% de l'effet de serre naturel [ref6].
*   **Méthane (CH₄)** : Un GES beaucoup plus puissant que le CO₂ par molécule, mais présent en concentrations moindres. Il est produit par des processus naturels (zones humides, termites) et anthropiques (agriculture, élevage, exploitation des combustibles fossiles).
*   **Protoxyde d'azote (N₂O)** : Également un GES puissant, émis par les sols, les océans et les activités agricoles (engrais azotés) ainsi que certains processus industriels.
*   **Ozone (O₃)** : Présent dans la stratosphère où il protège de l'UV, et dans la troposphère où il agit comme un GES et un polluant.
*   **Chlorofluorocarbones (CFCs)** et autres halocarbures : Ces gaz sont entièrement d'origine anthropique, utilisés autrefois comme réfrigérants et propulseurs. Bien que leur production soit largement réglementée par le Protocole de Montréal, ils sont extrêmement puissants et persistants dans l'atmosphère [ref6].

La contribution relative de ces gaz à l'effet de serre naturel est dominée par la vapeur d'eau, suivie du dioxyde de carbone. Les autres gaz jouent un rôle plus modeste dans l'effet naturel, mais leur augmentation due aux activités humaines a des conséquences significatives sur le réchauffement climatique actuel [ref6].

[[WIDGET:Image:ghg_absorption_spectrum]]
*Spectre d'absorption des principaux gaz à effet de serre, illustrant leur capacité à piéger le rayonnement infrarouge terrestre.*

## Modélisation simplifiée de l'effet de serre

Pour comprendre l'ampleur de l'effet de serre, il est utile de recourir à des modèles simplifiés qui permettent de calculer une température d'équilibre théorique de la Terre. Ces modèles, bien que rudimentaires, illustrent les principes fondamentaux de l'équilibre énergétique planétaire.

### Modèle de corps noir (Terre sans atmosphère)

Le modèle le plus simple considère la Terre comme un [[WIDGET:ConceptLink:corps_noir:corps noir]] parfait en équilibre radiatif avec le Soleil, sans atmosphère. Dans ce scénario, la Terre absorbe le rayonnement solaire et émet son propre rayonnement infrarouge vers l'espace. L'équilibre est atteint lorsque l'énergie absorbée est égale à l'énergie émise.

L'énergie solaire absorbée par la Terre est donnée par :
$E_{abs} = S_0 (1 - \alpha) \pi R^2$
où $S_0$ est la constante solaire (environ 1361 W/m²), $\alpha$ est l'albédo planétaire (environ 0.3 pour la Terre), et $R$ est le rayon de la Terre.

L'énergie émise par la Terre, en tant que corps noir, est donnée par la loi de Stefan-Boltzmann :
$E_{émis} = \sigma T_e^4 \times 4 \pi R^2$
où $\sigma$ est la constante de Stefan-Boltzmann (5.67 x 10⁻⁸ W/m²K⁴) et $T_e$ est la température d'équilibre effective de la Terre.

En égalisant ces deux expressions ($E_{abs} = E_{émis}$), on obtient la température d'équilibre :
$S_0 (1 - \alpha) \pi R^2 = \sigma T_e^4 \times 4 \pi R^2$
$T_e^4 = \frac{S_0 (1 - \alpha)}{4 \sigma}$
En substituant les valeurs, on trouve une température d'équilibre $T_e$ d'environ 255 K, soit -18°C. Ce calcul, déjà évoqué, confirme que sans atmosphère, la Terre serait une planète gelée, incapable d'abriter la vie telle que nous la connaissons [ref5]. Ce concept a été exploré par des pionniers comme [[WIDGET:RealPerson:joseph_fourier:Joseph Fourier]] au début du XIXe siècle.

### Modèle à une couche atmosphérique

Pour illustrer l'effet de serre, on peut introduire une atmosphère simplifiée, représentée par une seule couche opaque au rayonnement infrarouge terrestre mais transparente au rayonnement solaire.

[[WIDGET:Mermaid:one_layer_model]]
*Diagramme conceptuel du modèle à une couche atmosphérique, montrant les flux de rayonnement solaire et infrarouge entre le Soleil, l'atmosphère et la surface terrestre.*

Dans ce modèle, la couche atmosphérique absorbe tout le rayonnement IR émis par la surface terrestre et le réémet à parts égales vers l'espace et vers la surface. En établissant les bilans énergétiques pour la surface et pour l'atmosphère, on peut calculer une nouvelle température d'équilibre pour la surface terrestre ($T_s$) et pour l'atmosphère ($T_a$).

1.  **Bilan énergétique de la surface terrestre :**
    La surface absorbe le rayonnement solaire ($S_0 (1-\alpha)/4$) et le rayonnement IR de l'atmosphère ($\sigma T_a^4$). Elle émet du rayonnement IR ($\sigma T_s^4$).
    $S_0 (1 - \alpha)/4 + \sigma T_a^4 = \sigma T_s^4$

2.  **Bilan énergétique de la couche atmosphérique :**
    L'atmosphère absorbe le rayonnement IR de la surface ($\sigma T_s^4$). Elle émet du rayonnement IR vers l'espace ($\sigma T_a^4$) et vers la surface ($\sigma T_a^4$).
    $\sigma T_s^4 = 2 \sigma T_a^4$
    D'où $T_s^4 = 2 T_a^4$, ou $T_a = T_s / (2)^{1/4}$.

En substituant $T_a^4$ dans l'équation de la surface :
$S_0 (1 - \alpha)/4 + \sigma (T_s^4 / 2) = \sigma T_s^4$
$S_0 (1 - \alpha)/4 = \sigma T_s^4 - \sigma T_s^4 / 2$
$S_0 (1 - \alpha)/4 = \sigma T_s^4 / 2$
$T_s^4 = \frac{S_0 (1 - \alpha)}{2 \sigma}$

En utilisant les mêmes valeurs, on obtient une température de surface $T_s$ d'environ 303 K, soit +30°C. Ce résultat est bien supérieur à la température observée (environ +15°C), mais il démontre clairement comment la présence d'une atmosphère opaque à l'IR augmente significativement la température de surface par rapport au modèle sans atmosphère.

### Limites des modèles simplifiés

Ces modèles, bien que pédagogiques, présentent des limites importantes [ref1] :
*   **Simplification de l'atmosphère** : L'atmosphère réelle n'est pas une simple couche opaque. Elle est composée de multiples couches avec des propriétés optiques différentes, et les gaz à effet de serre n'absorbent pas uniformément toutes les longueurs d'onde infrarouges.
*   **Absence de convection et de chaleur latente** : Les modèles radiatifs purs ignorent les transferts d'énergie par convection et les flux de chaleur latente (évaporation, condensation), qui jouent un rôle majeur dans la redistribution de la chaleur et la régulation de la température atmosphérique.
*   **Homogénéité** : Ils supposent une température uniforme sur toute la planète, ignorant les variations géographiques et saisonnières.
*   **Absence de nuages** : Les nuages ont un double rôle : ils réfléchissent le rayonnement solaire (effet refroidissant) et absorbent/réémettent le rayonnement IR (effet réchauffant), un aspect complexe non pris en compte ici.

Malgré ces simplifications, ces modèles sont des outils conceptuels précieux pour appréhender le mécanisme fondamental de l'effet de serre et l'importance de l'atmosphère dans la régulation thermique de la Terre. Des modèles climatiques plus sophistiqués, intégrant la dynamique atmosphérique et océanique, la circulation des fluides, les cycles biogéochimiques et les interactions complexes entre les différentes composantes du système terrestre, sont nécessaires pour des prévisions climatiques précises [ref6].
---

Check checkpoints:
1. Zero-placeholders.
2. Accurate academic density and level-appropriate language.
3. Strict MDX/JSX safety (absolutely no raw custom component or custom JSX/HTML tags like <ConceptLink>, <RealPerson>, <Glossary>, etc. inline in prose. All interactive elements and special links must strictly use the [[WIDGET:id]] anchor format).
4. No figure prefixes like "Figure 1:" in visual captions.
5. Presence of pedagogical widgets: Check that the block contains at least 2-3 inline hover-cards (ConceptLink, Glossary, RealPerson) and at least 1-2 block widgets (Image, Mermaid, ComparisonSlider, InteractiveDiagram, DataChart, Video) as anchors. If completely missing, reject the block.


Your audit must be in dual-mode:
- **"isGlobalRevision" MUST ONLY be set to true if the issues are widespread and catastrophic** (completely unparseable structure, severe length deficiency, or total failure of the block narrative requiring a complete full-text rewrite). If so, provide a comprehensive "globalCritique".
- **For standard, localized, or section-specific mistakes, you MUST set "isGlobalRevision": false**, and list ONLY the rejected sections requiring localized repair in the "sections" array.

Return ONLY a valid JSON object matching blockNarrativeAuditSchema:
```json
{
  "approved": boolean,
  "isGlobalRevision": boolean,
  "globalCritique": "detailed feedback explaining what to fix globally, or empty if approved/local repair",
  "sections": [
    // If approved is false and isGlobalRevision is false, list ONLY the specific sections that are rejected. Do NOT include approved sections.
    {
      "heading": "heading of the rejected section",
      "approved": false,
      "critique": "detailed feedback explaining what to fix in this specific section"
    }
  ]
}
```

[REJECT-ONLY REPORTING MANDATE]
1. If approved is true: approved MUST be true, isGlobalRevision MUST be false, globalCritique MUST be "", and sections MUST be empty.
2. If isGlobalRevision is true: approved MUST be false, isGlobalRevision MUST be true, globalCritique MUST describe the global issues, and sections MUST be empty.
3. If approved is false and isGlobalRevision is false: sections MUST ONLY contain sections that are rejected (with approved set to false). Any approved section MUST be strictly omitted from the array.