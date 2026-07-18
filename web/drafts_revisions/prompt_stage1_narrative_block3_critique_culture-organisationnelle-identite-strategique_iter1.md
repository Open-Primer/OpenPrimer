You are the Narrative Critic Agent (Agent 4A). Review the generated block of text for the lesson:
---
## Conclusion: Gérer la Culture pour une Stratégie Durable

Ce parcours nous a permis d'explorer la complexité et l'importance de la [[WIDGET:ConceptLink:culture_organisationnelle:culture organisationnelle]] dans le champ de la sociologie des organisations et du management stratégique. Nous avons établi que la culture n'est pas un simple ensemble de pratiques superficielles, mais un système profond de valeurs, de normes et de [[WIDGET:Glossary:postulats_de_base:postulats de base]] partagés, influençant chaque facette de la vie organisationnelle, de la prise de décision à la performance, en passant par l'innovation et la gestion des conflits. Inspirée par les travaux de chercheurs comme [[WIDGET:RealPerson:schein:Edgar Schein]] [[WIDGET:Reference:10]], cette compréhension met en lumière la puissance de la culture comme levier ou frein stratégique. Elle façonne l'identité stratégique de l'organisation, déterminant comment elle se perçoit et est perçue par son environnement, et conditionne sa capacité à implémenter efficacement ses orientations stratégiques.

La gestion proactive de la culture organisationnelle est donc impérative pour toute organisation aspirant à la pérennité et à l'adaptabilité. Il ne s'agit pas de manipuler la culture, mais de la comprendre, de la nourrir et, si nécessaire, de la transformer pour l'aligner avec les objectifs stratégiques évolutifs. Cette démarche exige un leadership éclairé, capable de dialoguer avec les dynamiques internes et externes, comme l'ont souligné des auteurs tels que [[WIDGET:RealPerson:friedberg:Erhard Friedberg]] dans ses analyses sur le pouvoir et la règle [[WIDGET:Reference:13]]. Dans un environnement en constante mutation, où les défis économiques, technologiques et sociaux se multiplient, une culture agile, résiliente et orientée vers l'apprentissage devient un avantage concurrentiel décisif. Elle permet non seulement de soutenir la stratégie actuelle, mais aussi de préparer l'organisation à anticiper et à s'adapter aux changements futurs, assurant ainsi sa vitalité et sa pertinence à long terme.

[[WIDGET:CustomFigure:culture_strategy_alignment:Diagramme illustrant l'alignement dynamique entre la culture organisationnelle et la stratégie pour atteindre la performance et la durabilité.]]

[[WIDGET:Mermaid:culture_evolution_flow:Schéma du processus continu de gestion et d'évolution de la culture organisationnelle, de l'analyse à l'adaptation stratégique.]]

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