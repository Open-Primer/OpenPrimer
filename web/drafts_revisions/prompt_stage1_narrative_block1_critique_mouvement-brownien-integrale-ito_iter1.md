You are the Narrative Critic Agent (Agent 4A). Review the generated block of text for the lesson:
---
## Introduction au Mouvement Brownien et à l'Intégrale d'Itô

Dans le domaine de la finance quantitative moderne, la modélisation des phénomènes aléatoires est une pierre angulaire. Les prix des actifs financiers, les taux d'intérêt, et d'autres variables économiques clés évoluent de manière stochastique, rendant les outils de la théorie des probabilités indispensables. Au cœur de cette modélisation se trouvent le [[WIDGET:ConceptLink:mouvement_brownien:Mouvement Brownien]] et l'intégrale d'Itô, des concepts fondamentaux qui ont révolutionné notre compréhension et notre capacité à analyser les marchés financiers.

Historiquement, l'introduction du mouvement brownien comme modèle pour les prix d'actifs remonte aux travaux pionniers de [[WIDGET:RealPerson:bachelier:Louis Bachelier]] au début du XXe siècle, bien avant son adoption généralisée en physique par [[WIDGET:RealPerson:einstein:Albert Einstein]]. Cependant, c'est avec le développement du calcul stochastique, et en particulier de l'intégrale d'Itô par [[WIDGET:RealPerson:ito:Kiyosi Itô]], que ces outils ont trouvé leur pleine application en finance. Ils permettent de construire des modèles continus pour les prix d'actifs, comme le célèbre modèle de Black-Scholes pour l'évaluation des options, qui repose sur l'hypothèse que le prix de l'actif sous-jacent suit un processus de diffusion géométrique brownien [[WIDGET:Reference:3]], [[WIDGET:Reference:14]].

Ce cours de Master 1 vise à fournir une compréhension approfondie du mouvement brownien, de ses propriétés fondamentales, et de l'intégrale d'Itô. Nous explorerons comment ces concepts mathématiques abstraits peuvent être appliqués concrètement à la modélisation des marchés financiers, à la tarification des produits dérivés et à la gestion des risques. Le positionnement de ce module dans votre programme de Master 1 en finance quantitative est crucial : il constitue la base théorique indispensable pour aborder des sujets plus avancés tels que les équations différentielles stochastiques (EDS), la théorie de l'arbitrage en temps continu, et les méthodes numériques en finance [[WIDGET:Reference:2]], [[WIDGET:Reference:4]], [[WIDGET:Reference:13]].

[[WIDGET:Mermaid:course_objectives_flow:Diagramme des objectifs du cours et de son positionnement en M1]]

En maîtrisant ces outils, vous serez équipés pour comprendre et développer des modèles sophistiqués, essentiels pour toute carrière dans la finance quantitative.

## Le Mouvement Brownien: Construction et Propriétés Fondamentales

Le mouvement brownien, souvent noté $W_t$ ou $B_t$, est un processus stochastique en temps continu qui modélise le mouvement aléatoire de particules dans un fluide. Sa formalisation mathématique est rigoureuse et repose sur un ensemble de propriétés clés.

Un processus stochastique $(W_t)_{t \ge 0}$ est appelé mouvement brownien standard (ou processus de Wiener) s'il satisfait les conditions suivantes [[WIDGET:Reference:11]], [[WIDGET:Reference:13]]:

1.  **Condition initiale:** $W_0 = 0$ presque sûrement.
2.  **Accroissements indépendants:** Pour tout $0 \le s < t \le u < v$, les accroissements $(W_t - W_s)$ et $(W_v - W_u)$ sont indépendants. Plus généralement, pour toute suite de temps $0 \le t_0 < t_1 < \dots < t_n$, les accroissements $(W_{t_1} - W_{t_0}), (W_{t_2} - W_{t_1}), \dots, (W_{t_n} - W_{t_{n-1}})$ sont mutuellement indépendants.
3.  **Accroissements stationnaires et gaussiens:** Pour tout $0 \le s < t$, l'accroissement $(W_t - W_s)$ suit une loi normale centrée de variance $(t-s)$, c'est-à-dire $W_t - W_s \sim \mathcal{N}(0, t-s)$. Cette propriété implique que la moyenne de l'accroissement est nulle et sa variance est proportionnelle à la durée de l'intervalle.
4.  **Continuité des trajectoires:** Les trajectoires (ou chemins) du mouvement brownien sont continues presque sûrement. Cela signifie que pour chaque réalisation du processus, la fonction $t \mapsto W_t(\omega)$ est continue.

Ces propriétés définissent un processus unique et aux caractéristiques remarquables. Examinons plus en détail ses propriétés fondamentales:

*   **Accroissements Gaussiens:** Comme mentionné, les changements du mouvement brownien sur tout intervalle de temps sont distribués selon une loi normale. Cela signifie que les petits changements sont plus probables que les grands, et que les mouvements positifs et négatifs sont également probables.
*   **Trajectoires continues mais nulle part différentiables:** Bien que les chemins du mouvement brownien soient continus, ils sont extrêmement irréguliers. Une propriété contre-intuitive mais fondamentale est qu'ils ne sont différentiables en aucun point, presque sûrement [[WIDGET:Reference:6]]. Cela implique que la "vitesse" d'une particule brownienne n'est jamais bien définie, ce qui rend le calcul classique inadapté pour l'analyser et justifie le développement du calcul d'Itô.
*   **Variance proportionnelle au temps:** La variance de $W_t$ est égale à $t$. Plus généralement, la variance de l'accroissement $W_t - W_s$ est $t-s$. Cette propriété est cruciale pour la modélisation de la volatilité en finance, où la dispersion des prix d'actifs augmente avec le temps.
*   **Variation quadratique:** Une autre propriété essentielle, liée à l'irrégularité des trajectoires, est que le mouvement brownien a une [[WIDGET:Glossary:quadratic_variation:variation quadratique]] non nulle. Pour une partition $0 = t_0 < t_1 < \dots < t_n = T$ de l'intervalle $[0, T]$, la somme $\sum_{i=0}^{n-1} (W_{t_{i+1}} - W_{t_i})^2$ converge vers $T$ lorsque le pas de la partition tend vers zéro. Cette propriété est fondamentale pour l'intégrale d'Itô et distingue le mouvement brownien des fonctions différentiables classiques.

[[WIDGET:Image:simulated_brownian_path:Exemple de trajectoire simulée d'un mouvement brownien standard]]

Ces propriétés confèrent au mouvement brownien un rôle central dans la modélisation des incertitudes et des dynamiques aléatoires en finance, en physique et dans de nombreux autres domaines scientifiques.
---

Check checkpoints:
1. Zero-placeholders.
2. Accurate academic density and level-appropriate language.
3. Strict MDX/JSX safety (absolutely no raw custom component or custom JSX/HTML tags like <ConceptLink>, <RealPerson>, <Glossary>, <sup id="cite-...">(...)</sup>, or <sup>(...)</sup> inline in prose. All interactive elements and special links must strictly use the [[WIDGET:id]] anchor format. For bibliographic citations, they MUST strictly use the [[WIDGET:Reference:num]] anchor format, e.g. [[WIDGET:Reference:1]]. Reject any block containing raw HTML citation tags or raw bracketed citation anchors like [ref1], [1] in text. Reject any block containing raw Mermaid diagram code (e.g. wrapped in ```mermaid ... ```). All diagrams must be anchored as [[WIDGET:Mermaid:id:description]] anchors).
4. No figure prefixes like "Figure 1:" in visual captions.
5. NO EXTERNAL WIDGET CAPTIONS/DESCRIPTIONS IN NARRATIVE PROSE: REJECT the block if there are any external descriptions, comments, or caption text (such as "*Description: ...*", "Caption: ...", "Légende: ...") placed directly in the narrative prose outside, above, or below a widget anchor (like Image, CustomFigure, Video, Audio, Mermaid, etc.). The description must be strictly inside the anchor itself as the third parameter (e.g. [[WIDGET:Image:id:description]] or [[WIDGET:CustomFigure:id:description]] or [[WIDGET:Video:id:description]] or [[WIDGET:Audio:id:description]] or [[WIDGET:Mermaid:id:description]]).
6. Presence of pedagogical widgets: Check that the block contains at least 2-3 inline hover-cards (ConceptLink, Glossary, RealPerson) and at least 2-3 block widgets (Image, CustomFigure, Mermaid, ComparisonSlider, InteractiveDiagram, DataChart, Video) as anchors. If completely missing, reject the block.



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