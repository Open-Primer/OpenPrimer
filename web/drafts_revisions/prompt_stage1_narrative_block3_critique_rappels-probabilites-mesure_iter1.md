You are the Narrative Critic Agent (Agent 4A). Review the generated block of text for the lesson:
---
## Conclusion

Au terme de ce module de rappel, nous avons revisité les piliers fondamentaux de la théorie des probabilités et de la mesure, indispensables à toute incursion sérieuse dans la finance quantitative. Nous avons d'abord établi le cadre rigoureux des [[WIDGET:ConceptLink:espace_mesurable:espaces mesurables]], définissant l'univers des événements possibles et la manière de les quantifier. Les [[WIDGET:Glossary:tribu:tribus]] (ou $\sigma$-algèbres) ont été présentées comme les structures essentielles pour organiser l'information, permettant de définir précisément ce qui est "mesurable" et donc observable. Sur cette base, les [[WIDGET:ConceptLink:variable_aleatoire:variables aléatoires]] ont été introduites comme des fonctions mesurables, transformant les résultats abstraits en quantités numériques exploitables. Enfin, nous avons exploré l'[[WIDGET:ConceptLink:esperance_conditionnelle:espérance conditionnelle]], un concept puissant qui permet de mettre à jour nos prévisions en fonction de l'information disponible, incarnée par une sous-$\sigma$-algèbre.

Ces concepts ne sont pas de simples abstractions mathématiques ; ils constituent la grammaire et le vocabulaire nécessaires pour comprendre et modéliser les phénomènes financiers complexes. La maîtrise des espaces mesurables et des tribus est le prérequis pour définir des processus stochastiques et leur évolution temporelle. L'espérance conditionnelle, en particulier, est au cœur de la théorie moderne de la valorisation des actifs. Elle est l'outil indispensable pour la construction des [[WIDGET:ConceptLink:martingale:martingales]], ces processus dont l'espérance future, conditionnée par l'information présente, est égale à leur valeur actuelle. Les martingales sont la pierre angulaire de la valorisation sans arbitrage des produits dérivés sous une mesure de probabilité risque-neutre, comme détaillé dans [[WIDGET:Reference:4]] et [[WIDGET:Reference:7]]. De même, la compréhension des variables aléatoires et de leur mesurabilité est cruciale pour la définition et la manipulation des [[WIDGET:Glossary:integrale_stochastique:intégrales stochastiques]], qui permettent d'intégrer des fonctions par rapport à des processus aléatoires tels que le mouvement brownien, un concept central pour les modèles en temps continu popularisés par des figures comme [[WIDGET:RealPerson:ito:Kiyosi Itô]] [[WIDGET:Reference:2]], [[WIDGET:Reference:13]].

[[WIDGET:Mermaid:quant_finance_flow:Flux des concepts fondamentaux vers la finance quantitative avancée]]

La valorisation d'options, qu'il s'agisse du modèle de Black-Scholes ou de ses extensions, repose intrinsèquement sur ces fondations. L'espérance conditionnelle permet de calculer la valeur actuelle d'un flux de paiement futur, ajustée pour le risque et l'information disponible. Sans une compréhension solide de ces rappels, l'étude des modèles stochastiques avancés, des stratégies de couverture, et de la gestion des risques demeurerait superficielle. Ce module a donc jeté les bases solides sur lesquelles nous bâtirons les connaissances plus spécifiques à la finance quantitative.

[[WIDGET:CustomFigure:option_pricing_conceptual:Représentation conceptuelle du rôle des probabilités et de l'espérance conditionnelle dans la valorisation d'options]]

[[WIDGET:Quote:shreve_math_finance:Citation de Steven Shreve sur l'importance des mathématiques en finance quantitative]]

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