You are the Narrative Critic Agent (Agent 4A). Review the generated block of text for the lesson:
---
L'intégration de l'hétérogénéité des agents dans l'analyse macroéconomique révèle des dynamiques agrégées et des canaux de transmission des politiques économiques bien plus nuancés que ceux décrits par les modèles à agent représentatif.

## Impact de l'hétérogénéité sur la consommation et l'épargne agrégées

La distribution des revenus et de la richesse au sein d'une économie exerce une influence profonde sur les fonctions de consommation et d'épargne agrégées. Dans un cadre hétérogène, les ménages ne réagissent pas de manière uniforme aux variations de leurs revenus ou de leur patrimoine. Les ménages à faibles revenus ou à faible richesse ont généralement une [[WIDGET:ConceptLink:pmc_elevee:propension marginale à consommer (PMC)]] plus élevée que les ménages plus aisés. Cela s'explique par le fait qu'une part plus importante de leur revenu est consacrée aux biens de première nécessité, et qu'ils sont souvent contraints par des limites de liquidité ou d'accès au crédit.

[[WIDGET:CustomFigure:pmc_distribution:Distribution stylisée de la propension marginale à consommer en fonction du revenu]]

En conséquence, une redistribution des revenus des ménages riches vers les ménages pauvres peut entraîner une augmentation de la consommation agrégée et, par extension, de la demande agrégée. Inversement, une concentration croissante des revenus et de la richesse au sommet de la distribution, comme l'a documenté [[WIDGET:RealPerson:thomas_piketty:Thomas Piketty]] [[WIDGET:Reference:16]], peut freiner la consommation agrégée si les ménages les plus riches ont une PMC significativement plus faible. L'épargne agrégée, quant à elle, ne dépend pas seulement du niveau de revenu global, mais aussi de sa répartition. Une augmentation de l'épargne de précaution chez les ménages les plus vulnérables face aux chocs idiosyncratiques (comme dans les modèles de Bewley-Aiyagari-Huggett) peut coexister avec une épargne d'accumulation chez les plus riches, modifiant ainsi la composition et le niveau de l'épargne nationale. Ces effets de redistribution ont des implications directes pour la croissance économique, car la demande agrégée est un moteur clé de l'activité à court et moyen terme.

## Implications pour la politique monétaire et budgétaire

L'hétérogénéité des agents modifie substantiellement l'efficacité et les canaux de transmission de la politique monétaire et budgétaire.

En matière de politique monétaire, les modèles à agent représentatif suggèrent que les baisses de taux d'intérêt stimulent l'investissement et la consommation de manière uniforme. Cependant, avec l'hétérogénéité, les canaux de transmission deviennent plus complexes :
*   **Canal du bilan (Balance Sheet Channel)** : Les ménages et les entreprises endettés sont plus sensibles aux variations des taux d'intérêt. Une baisse des taux réduit le coût de leur dette, améliore leur capacité d'emprunt et peut stimuler leur consommation et leur investissement. Ce canal est particulièrement pertinent pour les ménages à faibles revenus qui sont souvent plus endettés.
*   **Canal du revenu (Income Channel)** : Les variations des taux d'intérêt affectent différemment les prêteurs et les emprunteurs. Une baisse des taux peut réduire le revenu des épargnants (souvent plus âgés ou plus riches) tout en augmentant le revenu disponible des emprunteurs (souvent plus jeunes ou moins riches). L'effet agrégé dépendra des PMC de ces différents groupes.
*   **Canal de la richesse (Wealth Channel)** : Les variations des taux d'intérêt influencent la valeur des actifs financiers et immobiliers. Les ménages détenant plus de patrimoine (généralement les plus aisés) verront leur richesse fluctuer davantage, ce qui peut affecter leur consommation via l'effet de richesse.

[[WIDGET:Mermaid:heterogeneous_monetary_policy:Canaux de transmission hétérogènes de la politique monétaire]]

Pour la politique budgétaire, l'hétérogénéité implique que les [[WIDGET:Glossary:multiplicateurs_budgetaires:multiplicateurs budgétaires]] ne sont pas uniformes. Une dépense publique ou une réduction d'impôts ciblée sur les ménages à faible revenu aura un multiplicateur plus élevé qu'une mesure bénéficiant aux ménages plus aisés, en raison de leur PMC plus élevée. Par exemple, les transferts sociaux vers les ménages vulnérables sont susceptibles d'être presque entièrement consommés, générant un fort effet stimulant sur la demande. Inversement, une réduction d'impôts pour les hauts revenus pourrait être largement épargnée, avec un impact limité sur la demande agrégée. Ces considérations sont cruciales pour la conception de politiques de stabilisation macroéconomique efficaces [[WIDGET:Reference:15]].

Les politiques visant à réduire les inégalités, telles que la fiscalité progressive, les investissements dans l'éducation et la santé, ou les systèmes de protection sociale robustes, ne sont donc pas seulement des objectifs de justice sociale. Elles peuvent également avoir des effets macroéconomiques positifs en stimulant la demande agrégée, en favorisant la mobilité sociale et en renforçant la résilience de l'économie face aux chocs.

[[WIDGET:Quote:keynes_consumption:Citation de John Maynard Keynes sur l'importance de la consommation dans l'économie]]
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