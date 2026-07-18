You are the Narrative Critic Agent (Agent 4A). Review the generated block of text for the lesson:
---
## Conclusion et Perspectives

Les Équations Différentielles Stochastiques (EDS) se sont révélées être un outil mathématique d'une puissance et d'une polyvalence inégalées pour la modélisation des phénomènes financiers. Depuis les travaux pionniers de [[WIDGET:RealPerson:ito_kiyosi:Kiyosi Itô]] sur le calcul stochastique, elles ont transformé notre compréhension des marchés, permettant de capturer l'incertitude inhérente aux prix des actifs et aux taux d'intérêt. Leur capacité à décrire l'évolution dynamique de variables sous l'influence de chocs aléatoires, comme le mouvement brownien, en fait le pilier de la finance quantitative moderne, de la valorisation des produits dérivés à la gestion des risques et à l'optimisation de portefeuille [[WIDGET:Reference:2]], [[WIDGET:Reference:4]].

Cependant, les modèles fondamentaux présentés, à l'instar de l'EDS de Black-Scholes, reposent sur des hypothèses simplificatrices qui, bien que facilitant l'analyse, ne reflètent pas toujours la complexité des marchés réels. La constance de la volatilité, l'absence de sauts dans les prix des actifs, la normalité des rendements et l'hypothèse de marchés parfaits sont autant de limites reconnues. Ces lacunes ont stimulé le développement de modèles plus sophistiqués, cherchant à mieux coller à la réalité empirique des marchés financiers.

[[WIDGET:CustomFigure:jump_diffusion_vs_gbm:Comparaison d'une trajectoire avec sauts et d'un mouvement brownien géométrique]]

Parmi les directions d'approfondissement, les [[WIDGET:ConceptLink:eds_a_sauts:EDS à sauts]] (ou modèles de diffusion-sauts) intègrent des discontinuités dans les trajectoires des prix, permettant de modéliser les chocs soudains et les événements extrêmes observés sur les marchés [[WIDGET:Reference:5]]. Les modèles à [[WIDGET:ConceptLink:volatilite_stochastique:volatilité stochastique]] (par exemple, le modèle de Heston ou de SABR) reconnaissent que la volatilité elle-même n'est pas constante mais évolue de manière aléatoire au fil du temps, capturant ainsi des phénomènes comme le "smile" ou le "skew" de volatilité [[WIDGET:Reference:16]].

[[WIDGET:Mermaid:eds_advanced_topics:Schéma des applications avancées des EDS en finance]]

D'autres avancées incluent l'utilisation de [[WIDGET:Glossary:processus_de_levy:processus de Lévy]] plus généraux que le mouvement brownien pour modéliser des distributions de rendements à queues épaisses, le contrôle stochastique pour l'optimisation dynamique des décisions financières, et la calibration de modèles, qui consiste à ajuster les paramètres des EDS aux données de marché observées. Les méthodes numériques, telles que les simulations de Monte Carlo [[WIDGET:Reference:9]] ou les schémas aux différences finies pour les équations aux dérivées partielles associées, deviennent alors indispensables pour résoudre ces modèles plus complexes. L'étude des EDS ouvre ainsi la voie à une compréhension plus fine et à une gestion plus robuste des risques et des opportunités dans l'univers financier.

[[WIDGET:Quiz:eds_conclusion_quiz]]
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