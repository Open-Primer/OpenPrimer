You are the Narrative Critic Agent (Agent 4A). Review the generated block of text for the lesson:
---
## Conclusion et Perspectives

Ce module a jeté les bases du calcul stochastique, un outil indispensable en finance quantitative. Nous avons d'abord exploré le [[WIDGET:ConceptLink:mouvement_brownien:Mouvement Brownien]], processus fondamental qui modélise l'incertitude et la nature aléatoire des marchés financiers. Sa non-différentiabilité et sa variation quadratique non nulle ont mis en évidence la nécessité d'une nouvelle approche intégrale. C'est ainsi que l'[[WIDGET:ConceptLink:integrale_ito:Intégrale d'Itô]] a été introduite, permettant d'intégrer des fonctions par rapport au Mouvement Brownien, une opération impossible avec l'intégrale de Riemann classique. Enfin, le [[WIDGET:ConceptLink:lemme_ito:Lemme d'Itô]], attribué à [[WIDGET:RealPerson:ito_kiyosi:Kiyosi Itô]], s'est révélé être la pierre angulaire de ce calcul, agissant comme une règle de la chaîne pour les processus stochastiques et introduisant un terme de correction crucial qui distingue le calcul stochastique du calcul déterministe. L'application de ce lemme à la dérivation de l'équation de Black-Scholes a clairement démontré sa puissance et son importance pratique dans la valorisation des dérivés.

Ces concepts fondamentaux ouvrent la voie à une compréhension approfondie des [[WIDGET:Glossary:eds:Équations Différentielles Stochastiques]] (EDS), qui sont au cœur de la modélisation des dynamiques d'actifs financiers et de nombreux autres phénomènes économiques [[WIDGET:Reference:13]], [[WIDGET:Reference:14]]. Les EDS permettent de décrire l'évolution des prix d'actions, des taux d'intérêt, des devises ou des matières premières de manière réaliste, en intégrant leur nature stochastique.

[[WIDGET:Mermaid:concept_map_stochastic_finance:Carte conceptuelle des liens entre Mouvement Brownien, Intégrale d'Itô, Lemme d'Itô et les EDS en finance stochastique]]

Parmi les applications et extensions futures de ces concepts, on peut citer:
*   **Modèles de taux d'intérêt**: L'application des EDS pour modéliser l'évolution des taux d'intérêt (par exemple, les modèles de Vasicek ou CIR) est essentielle pour la valorisation des obligations et des dérivés de taux [[WIDGET:Reference:15]].
*   **Modèles de volatilité stochastique**: Des modèles plus avancés, comme le modèle de Heston, permettent à la volatilité elle-même de suivre un processus stochastique, reflétant mieux la complexité des marchés [[WIDGET:Reference:16]].
*   **Gestion des risques**: Les simulations de Monte Carlo, basées sur la résolution numérique d'EDS, sont des outils incontournables pour l'estimation de mesures de risque telles que la Value-at-Risk (VaR) ou l'Expected Shortfall (ES) [[WIDGET:Reference:9]].
*   **Dérivés exotiques**: La valorisation et la couverture de produits financiers complexes, dont les payoffs dépendent de chemins de prix spécifiques ou de multiples sous-jacents, reposent entièrement sur la maîtrise de l'intégrale et du Lemme d'Itô.

[[WIDGET:CustomFigure:sde_simulation:Exemple de simulation de trajectoires d'une Équation Différentielle Stochastique]]

La maîtrise du Mouvement Brownien, de l'Intégrale d'Itô et du Lemme d'Itô est donc une compétence fondamentale pour quiconque souhaite s'engager dans la modélisation financière, la gestion de portefeuille ou la recherche en finance quantitative. C'est une passerelle vers des domaines plus complexes et des défis passionnants dans le monde de la finance moderne.

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
6. Presence of pedagogical widgets: Check that the block contains at least 2-3 inline hover-cards (ConceptLink, Glossary, RealPerson) and at least 2-3 block widgets (Image, CustomFigure, Mermaid, ComparisonSlider, InteractiveDiagram, DataChart, Video) as anchors. If completely missing, reject the block.

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