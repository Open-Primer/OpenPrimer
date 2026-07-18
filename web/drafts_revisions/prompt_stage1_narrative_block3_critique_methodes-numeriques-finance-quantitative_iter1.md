You are the Narrative Critic Agent (Agent 4A). Review the generated block of text for the lesson:
---
## Conclusion et Perspectives

Ce cours a mis en lumière l'importance capitale des [[WIDGET:ConceptLink:methodes_numeriques:méthodes numériques]] dans la finance quantitative moderne. Nous avons exploré deux piliers fondamentaux : les méthodes de Monte Carlo et les méthodes aux différences finies. Les premières, avec leur flexibilité intrinsèque, se sont avérées indispensables pour la valorisation d'instruments financiers complexes et la gestion de problèmes de haute dimension, notamment ceux impliquant des trajectoires stochastiques dépendantes [[WIDGET:Reference:9]]. Les secondes, quant à elles, excellent dans la résolution d'équations aux dérivées partielles (EDP) qui modélisent l'évolution des prix d'actifs, offrant une approche robuste pour les options américaines et les problèmes de faible dimension [[WIDGET:Reference:14]], [[WIDGET:Reference:20]]. La capacité à choisir et à appliquer la méthode appropriée est une compétence essentielle pour tout quant, car elle détermine l'efficacité et la précision des modèles de valorisation et de gestion des risques. L'interaction entre la théorie stochastique, les modèles mathématiques et l'implémentation numérique est au cœur de l'ingénierie financière contemporaine, permettant de transformer des concepts abstraits en outils opérationnels pour les marchés.

[[WIDGET:Mermaid:numerical_methods_roadmap:Évolution des méthodes numériques en finance]]

L'avenir de la finance quantitative est intrinsèquement lié à l'évolution des capacités de calcul et à l'intégration de nouvelles approches. Au-delà des méthodes fondamentales étudiées, des perspectives passionnantes s'ouvrent. Les méthodes d'éléments finis (FEM), par exemple, offrent une alternative puissante aux différences finies pour des domaines de calcul complexes ou des conditions aux limites non triviales. L'essor de l'intelligence artificielle et du [[WIDGET:ConceptLink:machine_learning:Machine Learning]] révolutionne également le domaine, avec l'application des [[WIDGET:ConceptLink:neural_networks:réseaux de neurones]] pour des tâches allant de la calibration de modèles à la couverture dynamique, en passant par la résolution d'EDP stochastiques de haute dimension. Parallèlement, l'[[WIDGET:Glossary:numerical_optimization:optimisation numérique]] reste un domaine crucial, non seulement pour la calibration des paramètres de modèles, mais aussi pour la construction de portefeuilles optimaux et la gestion des contraintes de marché. Ces avancées promettent d'élargir encore le champ des possibles pour les professionnels de la finance quantitative, les dotant d'outils toujours plus sophistiqués pour naviguer dans la complexité des marchés financiers.

[[WIDGET:Quote:wilmott_future_quant:Citation de Paul Wilmott sur l'avenir de la finance quantitative]]

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