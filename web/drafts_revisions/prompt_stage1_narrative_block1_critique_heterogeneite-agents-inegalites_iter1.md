You are the Narrative Critic Agent (Agent 4A). Review the generated block of text for the lesson:
---
## Introduction : Hétérogénéité et inégalités en macroéconomie

La macroéconomie moderne, traditionnellement ancrée dans l'analyse des agrégats, est confrontée à un défi croissant : l'intégration de l'hétérogénéité des agents et des inégalités dans ses cadres d'analyse. Pendant des décennies, une grande partie de la théorie macroéconomique s'est appuyée sur le concept d'[[WIDGET:ConceptLink:agent_representatif:agent représentatif]], une simplification qui supposait que les décisions d'un agent unique pouvaient représenter celles de l'ensemble de l'économie. Cette approche, bien que puissante pour modéliser certains phénomènes agrégés (voir par exemple [[WIDGET:Reference:2]], [[WIDGET:Reference:10]]), s'est avérée insuffisante pour comprendre et expliquer des dynamiques économiques cruciales.

Les limites des modèles à agent représentatif sont devenues particulièrement évidentes face à des questions telles que la distribution des richesses, l'impact différencié des chocs économiques sur les ménages, le rôle des frictions financières, ou encore la transmission de la politique monétaire et budgétaire. En effet, ignorer la diversité des revenus, des richesses, des préférences ou des contraintes d'accès au crédit des agents peut conduire à des conclusions erronées sur l'efficacité des politiques publiques et la résilience des économies. Les travaux récents, notamment ceux de [[WIDGET:RealPerson:thomas_piketty:Thomas Piketty]] [[WIDGET:Reference:16]], ont mis en lumière l'ampleur et les conséquences des inégalités croissantes, renforçant la nécessité d'une approche plus nuancée.

[[WIDGET:Mermaid:macro_evolution:Évolution des paradigmes en macroéconomie face à l'hétérogénéité]]

Ce cours vise à explorer les fondements théoriques et empiriques de l'intégration de l'hétérogénéité et des inégalités dans l'analyse macroéconomique. Nous examinerons pourquoi et comment les modèles macroéconomiques ont évolué pour dépasser le paradigme de l'agent représentatif, et comment ces nouveaux cadres permettent une meilleure compréhension des phénomènes tels que les cycles économiques, la croissance à long terme et les effets distributifs des politiques. L'objectif est de fournir aux étudiants les outils nécessaires pour analyser de manière critique les défis macroéconomiques contemporains à la lumière de ces nouvelles perspectives.

## Fondements théoriques et mesure des inégalités

Pour appréhender l'impact de l'hétérogénéité et des inégalités, il est essentiel de définir précisément ces concepts et de maîtriser les outils de leur mesure. L'**hétérogénéité** fait référence à la diversité des caractéristiques des agents économiques (ménages, entreprises) qui les distinguent les uns des autres. Cette diversité peut concerner le revenu (salaires, revenus du capital), la richesse (patrimoine financier et immobilier), les préférences (aversion au risque, taux d'actualisation), les compétences, l'accès aux marchés financiers ou encore la démographie. L'**inégalité**, quant à elle, désigne la disparité dans la distribution d'une variable économique (revenu, richesse, consommation) au sein d'une population donnée.

La mesure des inégalités est un domaine riche en outils statistiques. Parmi les plus couramment utilisés, on trouve :

*   **Le coefficient de Gini** : C'est une mesure synthétique de l'inégalité de distribution d'une variable. Il varie de 0 (égalité parfaite, où tous les individus ont la même valeur de la variable) à 1 (inégalité parfaite, où un seul individu détient toute la variable). Le [[WIDGET:Glossary:coefficient_gini:coefficient de Gini]] est dérivé de la courbe de Lorenz.

[[WIDGET:CustomFigure:gini_coefficient_interpretation:Interprétation visuelle du coefficient de Gini]]

*   **La courbe de Lorenz** : Cette courbe représente graphiquement la part cumulée d'une variable (par exemple, le revenu) détenue par la part cumulée de la population, classée par ordre croissant de cette variable. Plus la [[WIDGET:Glossary:courbe_lorenz:courbe de Lorenz]] s'éloigne de la diagonale d'égalité parfaite (la ligne à 45 degrés), plus l'inégalité est forte.

[[WIDGET:Image:lorenz_curve:Représentation graphique de la courbe de Lorenz et de la ligne d'égalité parfaite]]

*   **Les ratios de quantiles** : Ces ratios comparent la part de la variable détenue par les percentiles supérieurs de la distribution à celle détenue par les percentiles inférieurs ou médians. Par exemple, le ratio P90/P10 compare le revenu du 90ème percentile à celui du 10ème percentile, tandis que le ratio P99/P50 met en évidence l'inégalité au sommet de la distribution.

L'intégration de l'hétérogénéité dans les modèles macroéconomiques a donné naissance à des cadres théoriques sophistiqués. Les **modèles de type Bewley-Aiyagari-Huggett** (souvent appelés modèles à [[WIDGET:ConceptLink:marches_incomplets:marchés incomplets]]) sont des exemples emblématiques. Ils permettent d'analyser comment les ménages, confrontés à des chocs de revenu idiosyncratiques et à des marchés incomplets (impossibilité de s'assurer contre tous les risques), accumulent de l'épargne de précaution, ce qui génère une distribution hétérogène de la richesse. Les **modèles à générations imbriquées (OLG - Overlapping Generations)**, introduits par [[WIDGET:RealPerson:paul_samuelson:Paul Samuelson]], sont un autre cadre important qui intègre l'hétérogénéité liée à l'âge et au cycle de vie, permettant d'étudier les dynamiques d'épargne, de consommation et de croissance sur plusieurs générations. Ces modèles, bien que plus complexes, offrent une compréhension plus riche des mécanismes macroéconomiques et de leurs implications distributives [[WIDGET:Reference:4]].
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