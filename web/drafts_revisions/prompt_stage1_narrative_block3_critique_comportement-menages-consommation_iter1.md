You are the Narrative Critic Agent (Agent 4A). Review the generated block of text for the lesson:
---
## Conclusion

Cette leçon a exploré en profondeur le [[WIDGET:ConceptLink:intertemporal_optimization:modèle d'optimisation intertemporelle]] du consommateur, un pilier fondamental de la macroéconomie moderne. Nous avons d'abord établi le cadre dans lequel les ménages prennent des décisions de consommation et d'épargne non pas pour une seule période, mais sur l'ensemble de leur horizon de vie, en tenant compte de leurs préférences et de leurs contraintes budgétaires.

Au cœur de ce modèle se trouve l'[[WIDGET:Glossary:euler_equation:équation d'Euler]], que nous avons dérivée comme la condition de premier ordre de maximisation de l'utilité intertemporelle. Cette équation cruciale révèle comment les ménages égalisent l'utilité marginale actualisée de la consommation entre les périodes, en tenant compte du taux d'intérêt réel. Elle constitue un lien direct entre les préférences des agents et les variables macroéconomiques telles que l'épargne et l'investissement [[WIDGET:Reference:2]].

[[WIDGET:CustomFigure:euler_equation_formula:Représentation de l'équation d'Euler pour la consommation intertemporelle]]

Nous avons ensuite analysé les mécanismes complexes par lesquels une variation du taux d'intérêt réel affecte les décisions de consommation, en distinguant l'[[WIDGET:ConceptLink:substitution_effect:effet de substitution]] et l'[[WIDGET:ConceptLink:wealth_effect:effet de richesse]]. L'effet de substitution incite à reporter la consommation vers la période où elle est relativement moins chère (ou plus rémunératrice pour l'épargne), tandis que l'effet de richesse modifie la valeur actualisée des ressources du ménage, influençant sa capacité globale à consommer. La compréhension de l'interaction de ces deux effets est essentielle pour prédire la réponse des ménages aux chocs économiques et aux politiques [[WIDGET:Reference:1]].

[[WIDGET:Mermaid:intertemporal_model_summary:Schéma récapitulatif du modèle de choix intertemporel montrant les préférences et contraintes menant à l'équation d'Euler, l'impact des variations de taux d'intérêt via les effets de substitution et de richesse sur les décisions de consommation/épargne, et l'agrégation vers les variables macroéconomiques et l'analyse politique.]]

La maîtrise de ces concepts est indispensable pour l'analyse des politiques économiques, notamment celles qui influencent les taux d'intérêt (politique monétaire) ou les revenus des ménages (politique fiscale). En effet, les décisions individuelles d'épargne et de consommation agrégées déterminent des variables macroéconomiques clés telles que l'investissement et le niveau général de l'activité économique [[WIDGET:Reference:5]], [[WIDGET:Reference:6]]. Ce modèle fournit les micro-fondations nécessaires pour comprendre les dynamiques macroéconomiques et pour évaluer l'impact des interventions gouvernementales sur le bien-être des agents et la stabilité économique [[WIDGET:Reference:19]].

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