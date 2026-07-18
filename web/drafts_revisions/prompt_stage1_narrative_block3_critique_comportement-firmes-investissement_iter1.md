You are the Narrative Critic Agent (Agent 4A). Review the generated block of text for the lesson:
---
## Conclusion: Synthèse et Perspectives Macroéconomiques

Ce module a exploré en profondeur le comportement des firmes en matière d'investissement et d'accumulation de capital, des décisions microéconomiques fondamentales dont les agrégats ont des répercussions macroéconomiques majeures. Nous avons d'abord établi que la décision d'investissement découle de l'objectif de [[WIDGET:ConceptLink:maximisation_profit:maximisation du profit]] des firmes, qui évaluent la rentabilité future des projets de capital en comparant les coûts et les bénéfices actualisés. Un concept central à cette analyse dynamique est celui des [[WIDGET:ConceptLink:couts_ajustement:coûts d'ajustement]], qui expliquent pourquoi les firmes n'ajustent pas instantanément leur stock de capital à son niveau optimal. Ces coûts, qu'ils soient internes (liés à la réorganisation de la production) ou externes (liés aux marchés des biens d'équipement), introduisent une inertie et une progressivité dans le processus d'investissement, transformant une décision statique en un processus dynamique influencé par les anticipations. Le modèle de la Q de Tobin, en particulier, a mis en lumière l'importance des marchés financiers et des attentes des investisseurs dans la détermination de l'investissement, en reliant la valeur boursière de la firme à son incitation à investir.

Ces comportements microéconomiques agrégés sont d'une importance capitale pour la compréhension des phénomènes macroéconomiques. L'investissement des firmes est le moteur principal de l'accumulation de capital, un facteur déterminant de la croissance économique à long terme, comme le soulignent les modèles de croissance endogène et exogène [[WIDGET:Reference:7]], [[WIDGET:Reference:8]]. Par ailleurs, la volatilité de l'investissement est une composante majeure des [[WIDGET:Glossary:cycles_economiques:cycles économiques]], souvent amplifiant les chocs et contribuant aux fluctuations de l'activité économique [[WIDGET:Reference:10]], [[WIDGET:Reference:13]]. Les politiques économiques, qu'elles soient monétaires ou budgétaires, cherchent à influencer ces décisions d'investissement pour stabiliser l'économie ou stimuler la croissance. La politique monétaire, en agissant sur les taux d'intérêt, modifie le coût du capital et les taux d'actualisation des profits futurs, tandis que la politique budgétaire peut offrir des incitations fiscales ou investir directement dans les infrastructures. Cependant, l'efficacité de ces politiques est conditionnée par la manière dont les firmes forment leurs anticipations et intègrent les coûts d'ajustement. Les travaux de [[WIDGET:RealPerson:robert_lucas:Robert Lucas]] ont notamment mis en évidence que les agents rationnels adaptent leurs comportements en fonction des politiques anticipées, ce qui peut altérer les effets escomptés des interventions publiques [[WIDGET:Reference:10]].

[[WIDGET:CustomFigure:investment_macro_link:Schéma des liens entre l'investissement microéconomique des firmes et les agrégats macroéconomiques comme la croissance et les cycles]]

Comprendre les mécanismes sous-jacents à la décision d'investissement des firmes est donc essentiel non seulement pour l'analyse des marchés, mais aussi pour la conception de politiques économiques robustes et efficaces, capables de naviguer dans un environnement où les attentes et les frictions (telles que les coûts d'ajustement) jouent un rôle prépondérant.

[[WIDGET:Mermaid:policy_impact_flow:Diagramme de flux illustrant comment les politiques économiques influencent les décisions d'investissement des firmes et leurs impacts macroéconomiques]]

[[WIDGET:Quote:keynes_investment:Citation de John Maynard Keynes sur l'importance de l'investissement et des "esprits animaux" dans l'économie]]

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