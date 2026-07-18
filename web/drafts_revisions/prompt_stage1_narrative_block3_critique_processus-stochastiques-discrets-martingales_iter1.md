You are the Narrative Critic Agent (Agent 4A). Review the generated block of text for the lesson:
---
## Conclusion et Perspectives

Au terme de cette leçon, nous avons exploré les fondements des [[WIDGET:ConceptLink:discrete_stochastic_process:processus stochastiques discrets]], des outils mathématiques indispensables pour modéliser l'évolution d'un système au fil du temps par étapes distinctes. Nous avons ensuite introduit la notion cruciale de [[WIDGET:Glossary:martingale:martingale]], une classe particulière de processus stochastiques dont l'espérance conditionnelle future, étant donné l'information présente, est égale à sa valeur actuelle. Ce concept, central en théorie des probabilités, trouve une application particulièrement féconde en finance quantitative.

L'application de ces concepts a été illustrée à travers le [[WIDGET:ConceptLink:crr_model:modèle de Cox-Ross-Rubinstein (CRR)]], un cadre binomial discret qui sert de pierre angulaire à la compréhension de la valorisation des actifs dérivés. Nous avons vu comment l'absence d'opportunité d'arbitrage conduit naturellement à l'existence d'une mesure de probabilité risque-neutre, sous laquelle les prix actualisés des actifs sont des martingales. Cette approche, popularisée par des travaux comme ceux de [[WIDGET:RealPerson:shreve_steven:Steven E. Shreve]], permet de valoriser des options et autres produits dérivés en calculant l'espérance de leurs payoffs futurs actualisés sous cette mesure [[WIDGET:Reference:1]], [[WIDGET:Reference:8]]. La puissance de cette méthodologie réside dans sa capacité à séparer le risque du rendement, offrant une base solide pour la prise de décision financière.

[[WIDGET:Mermaid:concept_flow:Flux conceptuel des processus stochastiques discrets aux martingales et au modèle CRR]]

Si le modèle CRR offre une intuition précieuse et une base calculatoire accessible, il représente une simplification du monde financier réel. Les perspectives d'extension de ces concepts sont vastes. La transition vers des modèles en temps continu est une étape naturelle et fondamentale en finance quantitative. Des modèles comme celui de [[WIDGET:ConceptLink:black_scholes:Black-Scholes-Merton]], qui repose sur le mouvement brownien géométrique, sont des extensions directes de la logique des martingales et des mesures risque-neutres dans un cadre continu [[WIDGET:Reference:2]], [[WIDGET:Reference:4]].

[[WIDGET:CustomFigure:discrete_to_continuous:Illustration de la convergence des modèles discrets vers les modèles continus]]

Au-delà des modèles en temps continu, l'étude des processus stochastiques s'étend à des dynamiques plus complexes, incluant les processus à sauts (pour modéliser les chocs de marché) [[WIDGET:Reference:5]], la volatilité stochastique (où la volatilité elle-même est un processus aléatoire) [[WIDGET:Reference:16]], ou encore les modèles multi-actifs. Ces développements nécessitent souvent des outils mathématiques plus avancés, tels que le calcul stochastique d'Itô, les équations différentielles stochastiques (EDS) [[WIDGET:Reference:13]], et des méthodes numériques sophistiquées comme les simulations de Monte Carlo [[WIDGET:Reference:9]] ou les méthodes aux différences finies pour résoudre les équations aux dérivées partielles associées. La compréhension des martingales reste cependant un fil conducteur essentiel, garantissant la cohérence et l'absence d'arbitrage dans ces cadres plus élaborés.

[[WIDGET:Quote:musiela_rutkowski_martingales:Citation de Musiela et Rutkowski sur le rôle central des martingales en modélisation financière]]

[[WIDGET:conclusionSummary]]
[[WIDGET:whatsNext]]
[[WIDGET:goingFurther]]
[[WIDGET:finalEvaluation]]
---

Check checkpoints:
1. Zero-placeholders.
2. Accurate academic density and level-appropriate language.
3. Strict MDX/JSX safety (absolutely no raw custom component or custom JSX/HTML tags like <ConceptLink>, <RealPerson>, <Glossary>, <sup id="cite-...">(...)</sup>, or <sup>(...)</sup> inline in prose. All interactive elements and special links must strictly use the [[WIDGET:id]] anchor format. For bibliographic citations, they MUST strictly use the [[WIDGET:Reference:num]] anchor format, e.g. [[WIDGET:Reference:1]]. Reject any block containing raw HTML citation tags or raw bracketed citation anchors like [ref1], [1] in text. Reject any block containing raw Mermaid diagram code (e.g. wrapped in ```mermaid ... ```). All diagrams must be anchored as [[WIDGET:Mermaid:id:description]] anchors).
4. No figure prefixes like "Figure 1:" in visual captions.
5. NO EXTERNAL WIDGET CAPTIONS/DESCRIPTIONS IN NARRATIVE PROSE: REJECT the block if there are any external descriptions, comments, or caption text (such as "*Description: ...*", "Caption: ...", "Légende: ...") placed directly in the narrative prose outside, above, or below a widget anchor (like Image, CustomFigure, Video, Audio, Mermaid, etc.). The description must be strictly inside the anchor itself as the third parameter (e.g. [[WIDGET:Image:id:description]] or [[WIDGET:CustomFigure:id:description]] or [[WIDGET:Video:id:description]] or [[WIDGET:Audio:id:description]] or [[WIDGET:Mermaid:id:description]]).
6. Presence of pedagogical widgets: Check that the block contains at least 2-3 inline hover-cards (ConceptLink, Glossary, RealPerson) and at least 2-3 block widgets (Image, CustomFigure, Mermaid, ComparisonSlider, InteractiveDiagram, DataChart, Video) as anchors. If completely missing, reject the block.

8. Valid ## Conclusion section with at least two paragraphs and the required conclusion widgets.

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