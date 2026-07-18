You are the Narrative Critic Agent (Agent 4A). Review the generated block of text for the lesson:
---
## Introduction : Au-delà des Hypothèses Simplificatrices

Dans le domaine de la [[WIDGET:ConceptLink:quantitative_finance:finance quantitative]] et de la modélisation stochastique, la valorisation des instruments financiers dérivés constitue un pilier central. Historiquement, le modèle de [[WIDGET:RealPerson:black_scholes:Black-Scholes]] (BSM), développé par Fischer Black, Myron Scholes et Robert Merton, a révolutionné la manière d'appréhender la [[WIDGET:ConceptLink:option_pricing:valorisation d'options]] [[WIDGET:Reference:3]], [[WIDGET:Reference:14]]. Sa formulation élégante et ses hypothèses simplificatrices ont permis une avancée majeure, offrant une solution analytique pour le prix des options européennes. Ce modèle est devenu la pierre angulaire de l'industrie financière, fournissant un cadre théorique robuste pour la couverture et la gestion des risques.

Cependant, l'observation des marchés financiers réels a rapidement mis en évidence les limites inhérentes au modèle de Black-Scholes. Les hypothèses sous-jacentes, bien que puissantes pour la tractabilité mathématique, ne reflètent pas toujours la complexité et la dynamique des prix d'actifs. En particulier, la volatilité des actifs financiers n'est pas constante, et les mouvements de prix ne sont pas toujours continus, présentant des sauts abrupts lors d'événements inattendus. Ces écarts entre la théorie et la réalité ont conduit à des erreurs de valorisation et à des inefficacités dans la gestion des portefeuilles de dérivés.

Ce cours vise à explorer les modèles qui vont au-delà du cadre de Black-Scholes, en intégrant des dynamiques de marché plus réalistes. Nous aborderons principalement deux extensions cruciales : les modèles à [[WIDGET:ConceptLink:stochastic_volatility:volatilité stochastique]], qui permettent à la volatilité de varier de manière aléatoire au fil du temps, et les modèles à sauts, qui intègrent la possibilité de mouvements de prix discontinus. Ces approches plus sophistiquées sont essentielles pour une compréhension approfondie et une modélisation précise des marchés financiers contemporains.

[[WIDGET:Mermaid:model_evolution:Évolution des modèles de valorisation d'options, du BSM aux modèles avancés]]

## Les Limites du Modèle de Black-Scholes

Le succès initial du modèle de Black-Scholes repose sur un ensemble d'hypothèses fondamentales qui, bien que simplificatrices, ont permis sa dérivation analytique [[WIDGET:Reference:2]], [[WIDGET:Reference:11]]. Parmi les plus critiques, on trouve :

*   **Volatilité constante et connue :** Le modèle suppose que la volatilité de l'actif sous-jacent reste inchangée pendant toute la durée de vie de l'option.
*   **Mouvements de prix continus :** Les prix des actifs suivent un [[WIDGET:ConceptLink:geometric_brownian_motion:mouvement brownien géométrique]], impliquant des changements de prix infinitésimaux et l'absence de sauts.
*   **Distribution log-normale des prix :** En conséquence du mouvement brownien géométrique, les prix des actifs sont supposés suivre une distribution log-normale, ce qui signifie que les rendements sont normalement distribués.
*   **Taux d'intérêt sans risque constant :** Le taux d'intérêt sans risque est supposé être constant et connu.
*   **Absence de coûts de transaction et de dividendes :** Le modèle original ne tient pas compte des coûts de transaction, des impôts, et suppose que l'actif sous-jacent ne verse pas de dividendes (bien que des extensions existent pour les dividendes continus).
*   **Possibilité de vente à découvert et de prêts sans restriction.**
*   **Marché efficient et absence d'opportunités d'arbitrage.**

Cependant, les observations empiriques des marchés financiers réels contredisent systématiquement plusieurs de ces hypothèses.

[[WIDGET:CustomFigure:bsm_assumptions_vs_reality:Tableau comparatif des hypothèses du modèle de Black-Scholes et des réalités du marché]]

La divergence la plus frappante est l'émergence du phénomène de "[[WIDGET:Glossary:volatility_smile:smile de volatilité]]" ou "skew de volatilité". Contrairement à l'hypothèse de volatilité constante, la [[WIDGET:ConceptLink:implied_volatility:volatilité implicite]] extraite des prix d'options observés sur le marché varie significativement en fonction du prix d'exercice (strike) et de la maturité de l'option [[WIDGET:Reference:16]]. Pour les options sur actions, on observe généralement un "skew" (asymétrie) où les options *out-of-the-money* (OTM) de vente ont une volatilité implicite plus élevée que les options *at-the-money* (ATM), et inversement pour les options d'achat. Sur les marchés de devises, on observe souvent une forme de "smile" plus symétrique. Ce phénomène indique clairement que les acteurs du marché attribuent des probabilités plus élevées aux événements extrêmes (grandes baisses ou hausses de prix) que ce que le modèle de Black-Scholes ne le ferait avec une volatilité constante.

[[WIDGET:Image:volatility_smile_example:Exemple graphique d'un smile de volatilité observé sur le marché des options]]

De plus, l'hypothèse de mouvements de prix continus est souvent violée par la présence de sauts (jumps) dans les séries temporelles de prix d'actifs [[WIDGET:Reference:5]]. Des événements macroéconomiques inattendus, des annonces de résultats d'entreprises, ou des chocs géopolitiques peuvent provoquer des variations de prix soudaines et importantes qui ne peuvent être expliquées par un processus de diffusion continu. Ces sauts contribuent à des distributions de rendements avec des "queues épaisses" (fat tails), c'est-à-dire une probabilité plus élevée d'événements extrêmes que celle prédite par une distribution normale.

Les conséquences de ces limites sont multiples et significatives pour la valorisation et la gestion des risques. Le modèle de Black-Scholes, lorsqu'il est appliqué directement, peut sous-évaluer ou surévaluer certaines options, en particulier celles loin du prix d'exercice (OTM ou ITM). Pour les praticiens, cela signifie que les stratégies de couverture basées sur le delta de Black-Scholes peuvent être inefficaces, exposant les portefeuilles à des risques non anticipés. La nécessité de "calibrer" le modèle en utilisant différentes volatilités implicites pour différentes options est une reconnaissance *de facto* de ses insuffisances, soulignant le besoin de modèles plus sophistiqués capables de capturer ces dynamiques de marché complexes.
---

Check checkpoints:
1. Zero-placeholders.
2. Accurate academic density and level-appropriate language.
3. Strict MDX/JSX safety (absolutely no raw custom component or custom JSX/HTML tags like <ConceptLink>, <RealPerson>, <Glossary>, <sup id="cite-...">(...)</sup>, or <sup>(...)</sup> inline in prose. All interactive elements and special links must strictly use the [[WIDGET:id]] anchor format. For bibliographic citations, they MUST strictly use the [[WIDGET:Reference:num]] anchor format, e.g. [[WIDGET:Reference:1]]. Reject any block containing raw HTML citation tags or raw bracketed citation anchors like [ref1], [1] in text. Reject any block containing raw Mermaid diagram code (e.g. wrapped in ```mermaid ... ```). All diagrams must be anchored as [[WIDGET:Mermaid:id:description]] anchors).
4. No figure prefixes like "Figure 1:" in visual captions.
5. NO EXTERNAL WIDGET CAPTIONS/DESCRIPTIONS IN NARRATIVE PROSE: REJECT the block if there are any external descriptions, comments, or caption text (such as "*Description: ...*", "Caption: ...", "Légende: ...") placed directly in the narrative prose outside, above, or below a widget anchor (like Image, CustomFigure, Video, Audio, Mermaid, etc.). The description must be strictly inside the anchor itself as the third parameter (e.g. [[WIDGET:Image:id:description]] or [[WIDGET:CustomFigure:id:description]] or [[WIDGET:Video:id:description]] or [[WIDGET:Audio:id:description]] or [[WIDGET:Mermaid:id:description]]).
6. Presence of pedagogical widgets: Check that the block contains at least 2-3 inline hover-cards (ConceptLink, Glossary, RealPerson) and at least 2-3 block widgets (Image, CustomFigure, Mermaid, ComparisonSlider, InteractiveDiagram, DataChart, Video) as anchors. If completely missing, reject the block.



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