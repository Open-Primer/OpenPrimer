You are the Narrative Critic Agent (Agent 4A). Review the generated block of text for the lesson:
---
## Conclusion et Perspectives

Ce parcours à travers la sociologie des décisions et du changement stratégique a mis en lumière la richesse et la complexité des dynamiques organisationnelles. Loin d'une vision purement rationnelle et linéaire de la stratégie, nous avons exploré comment les décisions sont le fruit d'interactions complexes entre des acteurs aux intérêts divergents, des jeux de pouvoir, des cultures organisationnelles ancrées et des pressions institutionnelles externes. La stratégie n'est pas seulement un plan élaboré par une élite dirigeante, mais une construction sociale émergente, négociée et souvent contestée. Des penseurs comme [[WIDGET:RealPerson:michel_crozier:Michel Crozier]] et Erhard Friedberg [[WIDGET:Reference:1]], ou encore [[WIDGET:RealPerson:james_march:James March]] et Herbert Simon [[WIDGET:Reference:17]] avec leur concept de [[WIDGET:ConceptLink:rationalite_limitee:rationalité limitée]], nous ont montré que l'action organisée est toujours le résultat d'une interaction entre la structure et l'action individuelle, où les acteurs cherchent à maximiser leur marge de manœuvre dans un système contraint.

L'apport fondamental de la sociologie réside dans sa capacité à déconstruire les évidences managériales et à offrir une grille d'analyse plus fine et plus réaliste des phénomènes stratégiques. Elle permet de comprendre pourquoi certaines décisions, apparemment logiques, échouent, ou pourquoi le changement rencontre des résistances inattendues. En révélant les logiques d'acteurs, les systèmes d'action concrets [[WIDGET:Reference:13]], les mécanismes d'[[WIDGET:Glossary:isomorphisme_institutionnel:isomorphisme institutionnel]] [[WIDGET:Reference:9]] et l'influence des cultures [[WIDGET:Reference:10]], elle dote les managers d'outils conceptuels pour naviguer dans l'incertitude et la complexité. La gestion stratégique devient alors moins une affaire de planification rigide qu'un processus continu de négociation, d'apprentissage et d'adaptation, où la légitimité et la capacité à mobiliser les acteurs sont primordiales.

[[WIDGET:CustomFigure:complexite_strategique:Illustration de la complexité des décisions stratégiques en organisation]]

Les défis futurs pour les organisations et la recherche en sociologie du management sont immenses. L'accélération des transformations technologiques (IA, digitalisation), les impératifs de durabilité, la volatilité des marchés mondiaux et la diversité culturelle accrue [[WIDGET:Reference:15]] complexifient encore davantage les processus de décision et de changement. Il devient crucial d'intégrer ces nouvelles dimensions dans l'analyse stratégique, en s'interrogeant par exemple sur l'impact des algorithmes sur la prise de décision, les nouvelles formes de pouvoir et de résistance dans les organisations numériques, ou encore la gestion de la connaissance dans des environnements de plus en plus fluides [[WIDGET:Reference:12]]. La sociologie continuera d'être un guide essentiel pour déchiffrer ces évolutions, en rappelant que derrière chaque stratégie, chaque décision et chaque changement, se trouvent des hommes et des femmes, avec leurs rationalités, leurs émotions et leurs interactions sociales.

[[WIDGET:Mermaid:facteurs_sociologiques_strategie:Diagramme des facteurs sociologiques influençant la stratégie]]

[[WIDGET:Quote:friedberg_pouvoir:Le pouvoir n'est pas une chose que l'on possède, mais une relation que l'on construit. Il est la capacité d'un acteur à faire en sorte que d'autres acteurs fassent ce qu'ils n'auraient pas fait spontanément. - Erhard Friedberg]]

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