You are the Narrative Critic Agent (Agent 4A). Review the generated block of text for the lesson:
---
## Conclusion et perspectives

En somme, cette exploration des fondements des modèles DSGE a mis en lumière leur architecture rigoureuse, ancrée dans les principes de la microéconomie. Nous avons souligné le rôle central de l'[[WIDGET:ConceptLink:agent_representatif:agent représentatif]], dont les décisions d'optimisation intertemporelle, sous [[WIDGET:Glossary:contraintes_intertemporelles:contraintes intertemporelles]] de ressources et de budget, constituent la pierre angulaire de ces modèles. La résolution de ces problèmes d'optimisation, particulièrement en présence d'incertitude, s'appuie fondamentalement sur la [[WIDGET:ConceptLink:programmation_dynamique:programmation dynamique]] et l'équation de Bellman, permettant de dériver des règles de décision optimales pour les agents. C'est cette combinaison de micro-fondations, d'anticipations prospectives et de méthodes de résolution avancées qui confère aux modèles DSGE leur capacité à analyser les dynamiques macroéconomiques et les effets des politiques.

Malgré leur sophistication et leur utilité pour l'analyse des politiques, les modèles DSGE ne sont pas exempts de critiques. L'hypothèse de l'[[WIDGET:ConceptLink:anticipations_rationnelles:anticipations rationnelles]], bien que puissante, est souvent jugée trop exigeante, impliquant une connaissance parfaite des agents sur la structure de l'économie et la distribution des chocs futurs [[WIDGET:Reference:10]]. La simplification par l'[[WIDGET:ConceptLink:agent_representatif:agent représentatif]] est une autre limite majeure, car elle ignore l'hétérogénéité des ménages et des entreprises, ce qui peut masquer des dynamiques distributives importantes ou des comportements agrégés non linéaires [[WIDGET:Reference:16]]. De plus, les modèles DSGE initiaux ont souvent eu du mal à rendre compte de phénomènes complexes comme les crises financières, en raison d'une modélisation insuffisante des frictions financières et des interactions entre les secteurs bancaire et réel [[WIDGET:Reference:15]]. Le débat sur la calibration versus l'estimation bayésienne des paramètres reste également vif, influençant la robustesse et la généralisabilité des résultats [[WIDGET:Reference:11]], [[WIDGET:Reference:12]].

[[WIDGET:CustomFigure:dsge_extensions_diagram:Évolution et extensions des modèles DSGE]]

Cependant, le cadre DSGE est en constante évolution pour adresser ces limitations et intégrer de nouvelles dimensions. Des extensions significatives incluent l'introduction d'agents hétérogènes (modèles HANK - Heterogeneous Agent New Keynesian) pour mieux capturer les effets distributifs et les réponses agrégées aux chocs [[WIDGET:Reference:6]]. La modélisation des frictions financières, des marchés du travail segmentés, et des comportements de [[WIDGET:ConceptLink:rationalite_limitee:rationalité limitée]] ou d'apprentissage est également un axe de recherche actif. Par ailleurs, l'intégration de chocs non-linéaires, la prise en compte des externalités et des biens publics, ou encore l'application à des problématiques de long terme comme la croissance endogène [[WIDGET:Reference:7]], [[WIDGET:Reference:8]] ou le changement climatique, élargissent continuellement le champ d'application des DSGE. Ces avancées témoignent de la flexibilité et de la pertinence continue de cette approche pour la recherche et l'élaboration des politiques macroéconomiques.

[[WIDGET:Mermaid:dsge_modeling_cycle:Cycle de développement et d'application d'un modèle DSGE]]

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
6. Presence of pedagogical widgets (MANDATORY — REJECT if not met): The block MUST contain ALL of the following:
   a) At least 2-3 inline hover-cards: [[WIDGET:RealPerson]], [[WIDGET:ConceptLink]], or [[WIDGET:Glossary]] anchors for key figures/concepts.
   b) At least 1 image or figure anchor: [[WIDGET:Image:id:description]] or [[WIDGET:CustomFigure:id:description]] showing a relevant diagram, illustration, or scientific figure.
   c) At least 1 structural/diagrammatic widget: [[WIDGET:Mermaid:id:description]] (for graphs, timelines, flowcharts) OR [[WIDGET:Video:id:description]] OR [[WIDGET:DataChart:id]] OR [[WIDGET:InteractiveDiagram:id]].
   A block with ONLY inline hover-cards and no Image/Mermaid/Video block widgets MUST be REJECTED. Count explicitly: if (b) is missing → reject; if (c) is missing → reject.

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