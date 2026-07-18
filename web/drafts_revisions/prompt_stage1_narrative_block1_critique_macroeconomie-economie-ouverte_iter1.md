You are the Narrative Critic Agent (Agent 4A). Review the generated block of text for the lesson:
---
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

Au cours de cette leçon, nous aborderons plusieurs thèmes majeurs, notamment la détermination des taux de change, les implications des flux de capitaux internationaux, l'efficacité des politiques monétaires et budgétaires en économie ouverte, et les défis posés par les déséquilibres extérieurs. Nous nous appuierons sur des cadres théoriques tels que le modèle Mundell-Fleming et le modèle IS-LM-BP, ainsi que sur des travaux fondamentaux en macroéconomie internationale [[WIDGET:Reference:9]].

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

La Parité des Taux d'Intérêt Couverte (PTIC), ou Covered Interest Rate Parity (CIP), est une condition d'arbitrage qui élimine le risque de change en utilisant des contrats à terme (forward contracts). Un investisseur qui place des fonds à l'étranger peut "couvrir" son risque de change en vendant à terme le montant attendu de monnaie étrangère.

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
---

Check checkpoints:
1. Zero-placeholders.
2. Accurate academic density and level-appropriate language.
3. Strict MDX/JSX safety (absolutely no raw custom component or custom JSX/HTML tags like <ConceptLink>, <RealPerson>, <Glossary>, <sup id="cite-...">(...)</sup>, or <sup>(...)</sup> inline in prose. All interactive elements and special links must strictly use the [[WIDGET:id]] anchor format. For bibliographic citations, they MUST strictly use the [[WIDGET:Reference:num]] anchor format, e.g. [[WIDGET:Reference:1]]. Reject any block containing raw HTML citation tags or raw bracketed citation anchors like [ref1], [1] in text. Reject any block containing raw Mermaid diagram code (e.g. wrapped in ```mermaid ... ```). All diagrams must be anchored as [[WIDGET:Mermaid:id:description]] anchors).
4. No figure prefixes like "Figure 1:" in visual captions.
5. NO EXTERNAL WIDGET CAPTIONS/DESCRIPTIONS IN NARRATIVE PROSE: REJECT the block if there are any external descriptions, comments, or caption text (such as "*Description: ...*", "Caption: ...", "Légende: ...") placed directly in the narrative prose outside, above, or below a widget anchor (like Image, CustomFigure, Video, Audio, Mermaid, etc.). The description must be strictly inside the anchor itself as the third parameter (e.g. [[WIDGET:Image:id:description]] or [[WIDGET:CustomFigure:id:description]] or [[WIDGET:Video:id:description]] or [[WIDGET:Audio:id:description]] or [[WIDGET:Mermaid:id:description]]).
6. Presence of pedagogical widgets (MANDATORY — REJECT if not met): The block MUST contain ALL of the following:
   a) At least 2-3 inline hover-cards: [[WIDGET:RealPerson]], [[WIDGET:ConceptLink]], or [[WIDGET:Glossary]] anchors for key figures/concepts.
   b) At least 1 image or figure anchor: [[WIDGET:Image:id:description]] or [[WIDGET:CustomFigure:id:description]] showing a relevant diagram, illustration, or scientific figure.
   c) At least 1 structural/diagrammatic widget: [[WIDGET:Mermaid:id:description]] (for graphs, timelines, flowcharts) OR [[WIDGET:Video:id:description]] OR [[WIDGET:DataChart:id]] OR [[WIDGET:InteractiveDiagram:id]].
   A block with ONLY inline hover-cards and no Image/Mermaid/Video block widgets MUST be REJECTED. Count explicitly: if (b) is missing → reject; if (c) is missing → reject.



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