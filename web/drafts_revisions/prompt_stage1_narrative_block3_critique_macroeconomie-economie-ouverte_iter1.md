You are the Narrative Critic Agent (Agent 4A). Review the generated block of text for the lesson:
---
## Conclusion et Perspectives

Ce cours a exploré les mécanismes fondamentaux de la macroéconomie en économie ouverte, en mettant en lumière l'importance cruciale du taux de change. Nous avons d'abord établi la [[WIDGET:ConceptLink:pti:Parité des Taux d'Intérêt (PTI)]] comme condition d'équilibre sur les marchés financiers internationaux, reliant les taux d'intérêt domestiques et étrangers aux anticipations de taux de change. Ensuite, l'analyse de la [[WIDGET:ConceptLink:balance_paiements:Balance des Paiements]] nous a permis de comprendre comment les flux de biens, services et capitaux entre un pays et le reste du monde se compensent, et comment son déséquilibre peut exercer une pression sur le taux de change. Nous avons également examiné les principaux déterminants du taux de change, qu'ils soient réels (compétitivité, termes de l'échange) ou monétaires (taux d'intérêt, inflation, anticipations).

L'étude des régimes de taux de change fixes et flottants, notamment à travers le modèle de Mundell-Fleming, a révélé l'interdépendance profonde des économies mondiales. Le choix d'un régime de change n'est pas neutre ; il détermine l'efficacité des politiques monétaires et budgétaires et la capacité d'une économie à absorber les chocs externes. La gestion du taux de change est donc un pilier essentiel de la stabilité macroéconomique, influençant la compétitivité des exportations, le coût des importations, l'inflation et, in fine, le bien-être des citoyens. Une mauvaise gestion peut conduire à des crises de change, des déséquilibres commerciaux persistants ou une instabilité financière, comme l'ont souligné des travaux majeurs en macroéconomie internationale [[WIDGET:Reference:9]].

[[WIDGET:Image:global_interdependence:Illustration de l'interdépendance des économies mondiales via les flux commerciaux et financiers.]]

Les défis contemporains en macroéconomie ouverte sont nombreux et complexes. La volatilité accrue des marchés financiers, les "guerres des monnaies" potentielles, et l'émergence de nouvelles formes de monnaie comme les cryptomonnaies posent des questions fondamentales sur la nature et la gestion du système monétaire international. Le [[WIDGET:Glossary:impossible_trinity:Dilemme Impossible]] (ou Trinité Impossible) — l'incapacité pour un pays de maintenir simultanément des taux de change fixes, une libre circulation des capitaux et une politique monétaire autonome — reste une contrainte majeure pour les décideurs politiques. La coordination des politiques macroéconomiques entre pays est plus que jamais nécessaire pour faire face aux chocs globaux, qu'ils soient financiers, sanitaires ou climatiques. Les recherches actuelles, notamment celles de [[WIDGET:RealPerson:gourinchas:Pierre-Olivier Gourinchas]] et [[WIDGET:RealPerson:rey:Hélène Rey]], continuent d'explorer ces dynamiques complexes et leurs implications pour la stabilité financière mondiale [[WIDGET:Reference:20]].

[[WIDGET:Mermaid:exchange_rate_regime_decision:Diagramme de décision pour le choix d'un régime de taux de change et ses implications.]]

[[WIDGET:Video:future_of_global_economy:Discussion sur les défis futurs de l'économie mondiale et le rôle des taux de change.]]

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