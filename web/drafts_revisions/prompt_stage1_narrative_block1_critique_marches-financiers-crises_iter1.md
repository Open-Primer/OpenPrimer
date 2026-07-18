You are the Narrative Critic Agent (Agent 4A). Review the generated block of text for the lesson:
---
## Introduction aux marchés financiers et aux crises

Bienvenue dans ce module de Macroéconomie avancée, dédié à l'étude approfondie des marchés financiers, des bulles spéculatives et des crises macroéconomiques. Ce cours, destiné aux étudiants de Master 1, vise à vous fournir les outils conceptuels et analytiques nécessaires pour comprendre les dynamiques complexes qui animent les marchés financiers et leur impact sur l'économie réelle. L'objectif pédagogique principal est de dépasser une vision simplifiée de ces marchés pour en saisir les mécanismes sous-jacents, les sources d'instabilité et les implications pour la politique économique.

Dans une économie mondialisée et de plus en plus financiarisée, la compréhension des [[WIDGET:ConceptLink:marches_financiers:marchés financiers]] est devenue indispensable pour tout macroéconomiste. Loin d'être de simples intermédiaires, ils sont des acteurs centraux qui peuvent amplifier les cycles économiques, générer des périodes de croissance euphorique mais aussi des épisodes de contraction sévère. Nous explorerons comment des phénomènes tels que la [[WIDGET:Glossary:bulle_speculative:bulle spéculative]] peuvent se former, se développer et éclater, entraînant des conséquences dévastatrices pour l'emploi, la production et la stabilité sociale. L'œuvre de penseurs comme [[WIDGET:RealPerson:hyman_minsky:Hyman Minsky]] nous sera précieuse pour appréhender la nature endogène de l'instabilité financière.

Ce module abordera plusieurs thèmes clés :
*   Le rôle fondamental du crédit et de l'effet de levier dans la propagation des chocs et l'amplification des cycles économiques.
*   Les théories de la formation et de l'éclatement des bulles d'actifs, et leurs implications macroéconomiques.
*   Les mécanismes de transmission des chocs financiers à l'économie réelle, incluant les frictions financières et les contraintes de liquidité.
*   L'analyse des crises financières historiques et contemporaines, de la Grande Dépression à la crise financière mondiale de 2008, en passant par les crises de la dette souveraine.
*   Les réponses de politique économique et monétaire face aux crises, ainsi que les enjeux de la régulation financière.

[[WIDGET:Image:marches_financiers_overview:Représentation schématique des interconnexions des marchés financiers]]

[[WIDGET:Mermaid:cycle_financier_crise:Diagramme simplifié du cycle financier menant à une crise]]

## Le rôle du crédit et de l'effet de levier dans l'instabilité financière

Le crédit est le moteur de l'activité économique moderne. Sa création, principalement par le système bancaire, permet de financer l'investissement des entreprises, la consommation des ménages et l'innovation. Cependant, une création excessive de crédit peut également semer les graines de l'instabilité financière. Lorsque le crédit est abondant et peu coûteux, il encourage la prise de risque et l'augmentation de l'[[WIDGET:Glossary:effet_de_levier:effet de levier]]. L'effet de levier, qui consiste à financer une partie de ses actifs par l'emprunt, permet d'amplifier les rendements potentiels en période de croissance, mais il magnifie également les pertes en cas de retournement de marché.

Les mécanismes par lesquels un excès de crédit et de levier contribue à la fragilisation du système financier sont multiples. Premièrement, il peut alimenter une hausse artificielle des prix d'actifs (immobilier, actions), créant des bulles spéculatives. Les agents économiques, qu'il s'agisse de ménages, d'entreprises ou d'institutions financières, s'endettent pour acquérir ces actifs dont la valeur semble ne pouvoir que monter. Cette dynamique est pro-cyclique : l'augmentation des prix d'actifs renforce la confiance, facilite l'accès au crédit (les actifs servant de garanties) et encourage un levier encore plus important.

[[WIDGET:CustomFigure:credit_leverage_cycle:Illustration du cycle crédit-levier et son impact sur l'économie]]

Cependant, cette expansion est intrinsèquement fragile. Comme l'a souligné [[WIDGET:RealPerson:irving_fisher:Irving Fisher]] avec sa théorie de la déflation par la dette, un choc négatif (par exemple, une hausse des taux d'intérêt ou un ralentissement économique) peut inverser la tendance. La chute des prix d'actifs réduit la valeur des garanties, entraînant des appels de marge et forçant les agents à vendre leurs actifs pour rembourser leurs dettes. Cette vente massive accentue la baisse des prix, créant une spirale déflationniste et un processus de désendettement (deleveraging) douloureux. Les institutions financières, fortement interconnectées et souvent très endettées, se retrouvent alors exposées à un [[WIDGET:ConceptLink:risque_systemique:risque systémique]], où la défaillance d'une entité peut entraîner une cascade de faillites à travers l'ensemble du système. Ces dynamiques sont au cœur de l'hypothèse d'instabilité financière de Minsky, qui postule que des périodes prolongées de stabilité économique encouragent l'excès de prise de risque et l'endettement, conduisant inévitablement à l'instabilité [[WIDGET:Reference:15]].

[[WIDGET:Mermaid:minsky_hypothesis_flow:Diagramme de la chaîne d'événements de l'hypothèse d'instabilité financière de Minsky]]

[[WIDGET:DataChart:global_debt_gdp:Graphique de l'évolution de l'endettement mondial par rapport au PIB]]
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