You are the Narrative Critic Agent (Agent 4A). Review the generated block of text for the lesson:
---
## Conclusion et perspectives

Ce module a exploré la dynamique complexe des marchés financiers, en mettant en lumière leur rôle central dans l'allocation du capital et la croissance économique, mais aussi leur potentiel intrinsèque à générer des instabilités. Nous avons analysé la formation des bulles spéculatives, souvent alimentées par l'[[WIDGET:ConceptLink:exuberance_irrationnelle:exubérance irrationnelle]] des acteurs et des déséquilibres macroéconomiques, et leur éclatement dévastateur. Les crises financières qui en découlent, qu'elles soient bancaires, de change ou de dette souveraine, ont des répercussions profondes sur l'économie réelle, entraînant récessions, chômage et érosion de la confiance. Face à ces défis, nous avons examiné les réponses politiques, qu'elles soient monétaires (assouplissement quantitatif, taux directeurs), budgétaires (plans de relance, sauvetages) ou, plus récemment, macroprudentielles, visant à renforcer la résilience du système financier et à prévenir l'accumulation de risques systémiques [[WIDGET:Reference:1]], [[WIDGET:Reference:2]].

[[WIDGET:CustomFigure:cycle_financier_crise:Le cycle financier: de l'expansion à la crise et la réponse politique]]

L'histoire économique, jalonnée de crises récurrentes, de la Grande Dépression aux subprimes, nous enseigne l'importance cruciale d'une régulation financière robuste et proactive. Les travaux de chercheurs comme [[WIDGET:RealPerson:hyman_minsky:Hyman Minsky]] ont souligné la tendance inhérente du capitalisme financier à générer l'instabilité, rendant indispensable une surveillance constante et des cadres réglementaires adaptatifs. De plus, la nature globalisée des marchés financiers modernes signifie qu'une crise dans une région peut rapidement se propager à l'échelle mondiale par le biais de la [[WIDGET:ConceptLink:contagion_financiere:contagion financière]], comme l'a démontré la crise de 2008 [[WIDGET:Reference:9]]. Cela rend la coopération internationale non seulement souhaitable, mais impérative pour la prévention et la gestion des crises. Des initiatives telles que le Conseil de Stabilité Financière (FSB) et les accords de Bâle témoignent de cette prise de conscience collective, bien que leur mise en œuvre reste un défi constant [[WIDGET:Reference:19]].

[[WIDGET:Video:regulation_financiere_post_crise:L'évolution de la régulation financière après la crise de 2008]]

Les défis futurs pour la stabilité financière sont nombreux et complexes. L'essor rapide de la finance numérique (FinTech, crypto-actifs) pose de nouvelles questions en termes de régulation, de protection des consommateurs et de stabilité systémique. Les risques liés au changement climatique, avec leurs implications pour les actifs financiers et les passifs des entreprises, émergent également comme une préoccupation majeure. Enfin, les niveaux d'endettement public et privé, exacerbés par la pandémie de COVID-19, pourraient constituer de nouvelles sources de vulnérabilité [[WIDGET:Reference:15]]. La recherche future devra s'attacher à développer des modèles plus sophistiqués pour anticiper ces risques émergents, à affiner l'efficacité des instruments macroprudentiels dans un environnement de taux bas, et à mieux comprendre l'interaction entre l'innovation financière et la stabilité macroéconomique.

[[WIDGET:Mermaid:defis_futurs_marches:Défis futurs et pistes de recherche pour la stabilité financière]]

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