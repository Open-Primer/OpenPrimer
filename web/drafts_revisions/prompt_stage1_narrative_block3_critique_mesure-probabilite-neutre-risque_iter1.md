You are the Narrative Critic Agent (Agent 4A). Review the generated block of text for the lesson:
---
## Conclusion et Perspectives

Cette exploration de la mesure de probabilité neutre au risque a mis en lumière des concepts fondamentaux de la finance quantitative. Nous avons vu comment le [[WIDGET:ConceptLink:theoreme_girsanov:théorème de Girsanov]] permet de passer d'une mesure de probabilité physique (historique) à une mesure équivalente sous laquelle les actifs financiers actualisés deviennent des [[WIDGET:ConceptLink:martingale:martingales]]. Cette transformation est cruciale car elle élimine la nécessité de modéliser les préférences de risque des investisseurs, simplifiant ainsi considérablement le problème de la valorisation des dérivés.

Le principe de [[WIDGET:Glossary:valorisation_neutre_risque:valorisation neutre au risque]], découlant de l'absence d'opportunités d'[[WIDGET:Glossary:arbitrage:arbitrage]], fournit un cadre robuste et cohérent pour le calcul du prix de tout instrument dérivé comme l'espérance de son payoff futur actualisé sous cette mesure. Ce cadre est la pierre angulaire de la modélisation financière moderne, permettant non seulement la valorisation d'options simples comme celles de Black-Scholes, mais aussi d'instruments plus complexes tels que les dérivés de taux d'intérêt [[WIDGET:Reference:15]], les dérivés de crédit, ou les options exotiques. Il est également essentiel pour la gestion des risques et la mise en place de stratégies de couverture efficaces.

[[WIDGET:Mermaid:risk_neutral_framework_flow:Schéma conceptuel du cadre de valorisation neutre au risque]]

Bien que puissant, le cadre de la mesure neutre au risque dans sa forme la plus simple (comme dans le modèle de Black-Scholes) repose sur des hypothèses simplificatrices, telles que la volatilité et les taux d'intérêt constants, ou l'absence de sauts dans les prix d'actifs. Les recherches et développements en finance quantitative visent à lever ces restrictions en intégrant des modèles plus sophistiqués, comme les modèles à volatilité stochastique (par exemple, le modèle de [[WIDGET:RealPerson:heston:Heston]]) [[WIDGET:Reference:16]], les modèles à sauts [[WIDGET:Reference:5]], ou les modèles multi-actifs. Ces avancées nécessitent souvent des techniques numériques plus complexes, telles que les méthodes de Monte Carlo [[WIDGET:Reference:9]] ou la résolution d'équations aux dérivées partielles stochastiques [[WIDGET:Reference:20]], pour calculer les espérances sous la mesure neutre au risque.

[[WIDGET:SolvedExercise:risk_neutral_steps:Exercice résolu sur les étapes clés de la valorisation neutre au risque]]

La compréhension approfondie de la mesure neutre au risque est donc indispensable pour tout professionnel de la finance quantitative. Elle offre une perspective unifiée et rigoureuse pour aborder la complexité des marchés financiers et la valorisation des instruments dérivés, tout en ouvrant la voie à des modèles plus réalistes et sophistiqués.

[[WIDGET:Quote:shreve_risk_neutral:Citation de Steven Shreve sur l'importance de la mesure neutre au risque]]

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