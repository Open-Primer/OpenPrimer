You are the Narrative Critic Agent (Agent 4A). Review the generated block of text for the lesson:
---
## Conclusion : Synthèse et Perspectives

Ce chapitre introductif a posé les jalons essentiels à la compréhension de l'univers en explorant trois piliers fondamentaux de l'astrophysique. Nous avons d'abord appréhendé la lumière non seulement comme un phénomène physique, mais comme le vecteur principal de toute information cosmique, dont l'analyse spectrale révèle la composition, la température et le mouvement des objets célestes. Ensuite, nous avons tracé l'évolution de notre compréhension de la gravitation, de la mécanique céleste de [[WIDGET:RealPerson:isaac_newton:Isaac Newton]] à la courbure de l'espace-temps d'[[WIDGET:RealPerson:albert_einstein:Albert Einstein]], soulignant son rôle prépondérant dans la formation et la dynamique des structures à toutes les échelles, des systèmes planétaires aux galaxies entières [[WIDGET:Reference:1]], [[WIDGET:Reference:4]]. Enfin, nous avons esquissé les grandes lignes de l'évolution stellaire, un processus dicté par l'équilibre subtil entre la gravité et la pression de rayonnement, qui non seulement forge les étoiles, mais est aussi le creuset de tous les éléments plus lourds que l'hélium, essentiels à l'émergence de la vie. Ces concepts ne sont pas isolés ; ils s'entrelacent de manière intrinsèque : la lumière nous informe sur les processus gravitationnels et nucléaires au cœur des étoiles, tandis que la gravité régit leur naissance, leur vie et leur mort, influençant ainsi la lumière qu'elles émettent et la distribution des éléments dans l'univers.

[[WIDGET:Mermaid:interconnexion_fondements:Interconnexion des fondements de l'astrophysique]]

Ces fondements constituent la base de toute l'[[WIDGET:ConceptLink:astrophysique_moderne:astrophysique moderne]], nous permettant d'interpréter les observations et de construire des modèles de l'univers. Ils nous préparent à explorer des phénomènes plus complexes et des questions encore sans réponse. Les chapitres suivants approfondiront la structure et l'évolution des galaxies, la cosmologie, l'étude des exoplanètes, et les mystères persistants de l'univers, tels que la nature de la [[WIDGET:Glossary:matiere_noire:matière noire]] et de l'[[WIDGET:Glossary:energie_noire:énergie noire]], ou encore les conditions d'apparition de la vie au-delà de la Terre [[WIDGET:Reference:2]], [[WIDGET:Reference:5]]. L'astrophysique est un domaine en constante évolution, où chaque découverte ouvre de nouvelles perspectives et soulève de nouvelles interrogations, nous invitant à repousser sans cesse les frontières de notre connaissance.

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
6. Presence of pedagogical widgets: Check that the block contains at least 2-3 inline hover-cards (ConceptLink, Glossary, RealPerson) and at least 1-2 block widgets (Image, CustomFigure, Mermaid, ComparisonSlider, InteractiveDiagram, DataChart, Video) as anchors. If completely missing, reject the block.
7. Valid ## Conclusion section with at least two paragraphs and the required conclusion widgets.

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