You are the Narrative Critic Agent (Agent 4A). Review the generated block of text for the lesson:
---
## Introduction au Calcul Stochastique et à la Formule d'Itô

Dans le domaine de la finance quantitative, la modélisation des prix d'actifs et des taux d'intérêt est une tâche complexe qui exige des outils mathématiques sophistiqués. Contrairement aux phénomènes déterministes décrits par le calcul différentiel classique, les marchés financiers sont intrinsèquement influencés par une multitude de facteurs aléatoires, rendant leurs évolutions imprévisibles et stochastiques. Le calcul différentiel ordinaire, qui repose sur l'hypothèse de fonctions suffisamment lisses et dérivables, se révèle insuffisant pour capturer la nature erratique et continue des mouvements de prix observés en temps réel.

C'est ici qu'intervient le [[WIDGET:ConceptLink:stochastic_calculus:Calcul stochastique]], une branche des mathématiques qui fournit le cadre rigoureux nécessaire pour analyser et modéliser les systèmes évoluant sous l'influence du hasard [[WIDGET:Reference:2]]. Développé notamment par le mathématicien japonais [[WIDGET:RealPerson:ito_kiyosi:Kiyosi Itô]], ce calcul permet de définir des notions de dérivée et d'intégrale pour des fonctions dont les trajectoires sont non-différentiables presque partout, comme celles des processus stochastiques.

[[WIDGET:Image:market_volatility:Représentation stylisée de la volatilité des marchés financiers]]

Au cœur du calcul stochastique appliqué à la finance se trouve la [[WIDGET:Glossary:ito_formula:Formule d'Itô]]. Cette formule est une généralisation de la règle de dérivation en chaîne (ou formule de Leibniz) du calcul classique, adaptée aux processus stochastiques. Elle est absolument fondamentale car elle permet de déterminer la dynamique d'une fonction d'un processus stochastique, ce qui est crucial pour la valorisation des produits dérivés, la gestion des risques et l'optimisation de portefeuille [[WIDGET:Reference:3]]. Sans la formule d'Itô, il serait impossible de dériver des équations différentielles stochastiques (EDS) qui régissent l'évolution des prix d'actifs sous des modèles comme celui de Black-Scholes-Merton [[WIDGET:Reference:12]].

L'objectif de cette leçon est de démystifier le calcul stochastique et de présenter en détail la formule d'Itô, en soulignant son importance pratique et théorique. Nous verrons pourquoi les outils classiques échouent face à la nature aléatoire des marchés et comment la formule d'Itô offre une solution élégante et puissante pour naviguer dans cet environnement incertain.

[[WIDGET:Mermaid:classical_vs_stochastic_calculus:Comparaison conceptuelle du calcul classique et du calcul stochastique]]

## Rappels et Fondements des Processus Stochastiques

Avant d'aborder la formule d'Itô, il est impératif de solidifier nos bases en matière de processus stochastiques. Cette section vise à réviser les concepts clés qui sont les piliers du calcul stochastique et, par extension, de la modélisation financière continue.

Le point de départ de la plupart des modèles financiers continus est le [[WIDGET:ConceptLink:brownian_motion:Mouvement Brownien]] (ou processus de Wiener), noté $W_t$. C'est un processus stochastique à temps continu qui modélise le mouvement aléatoire de particules dans un fluide. Ses propriétés sont cruciales :
1.  $W_0 = 0$ (le processus commence à zéro).
2.  Les trajectoires sont continues presque sûrement.
3.  Les accroissements sont indépendants : pour $0 \le s < t$, $W_t - W_s$ est indépendant des valeurs du processus jusqu'au temps $s$.
4.  Les accroissements sont stationnaires et suivent une loi normale : $W_t - W_s \sim \mathcal{N}(0, t-s)$.

Un [[WIDGET:Glossary:generalized_brownian_motion:Mouvement Brownien généralisé]] (ou processus de Wiener généralisé) est une extension du mouvement brownien standard, souvent utilisé pour modéliser les prix d'actifs. Il est défini par $dX_t = \mu dt + \sigma dW_t$, où $\mu$ est la dérive (tendance) et $\sigma$ est la volatilité [[WIDGET:Reference:13]].

[[WIDGET:CustomFigure:brownian_path:Exemple de trajectoire simulée d'un mouvement brownien standard]]

Un autre concept fondamental est celui de l'[[WIDGET:ConceptLink:stochastic_integral:Intégrale stochastique]], et plus spécifiquement l'intégrale d'Itô. Contrairement à l'intégrale de Riemann ou de Lebesgue, l'intégrale d'Itô est définie pour des intégrands qui sont des processus stochastiques non-anticipatifs par rapport au mouvement brownien. Cette construction est non triviale car les trajectoires du mouvement brownien ne sont pas à variation bornée, ce qui empêche l'utilisation des méthodes d'intégration classiques [[WIDGET:Reference:6]]. L'intégrale d'Itô est essentielle pour définir les solutions des équations différentielles stochastiques.

Enfin, les [[WIDGET:ConceptLink:martingale:Martingales]] jouent un rôle prépondérant en finance quantitative. Un processus stochastique est une martingale si son espérance conditionnelle future, étant donné l'information présente, est égale à sa valeur actuelle. En termes simples, une martingale représente un "jeu équitable" où l'espérance de gain futur est nulle. Les martingales sont au cœur de la théorie de l'évaluation sans arbitrage et de la mesure de probabilité risque-neutre, des concepts indispensables pour la valorisation des produits dérivés [[WIDGET:Reference:7]].

La maîtrise de ces concepts – mouvement brownien, intégrale stochastique et martingales – est la clé pour comprendre la logique et la puissance de la formule d'Itô et son application aux problèmes financiers.
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