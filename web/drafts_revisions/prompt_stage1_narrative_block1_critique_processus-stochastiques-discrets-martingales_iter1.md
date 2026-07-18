You are the Narrative Critic Agent (Agent 4A). Review the generated block of text for the lesson:
---
## Introduction aux Processus Stochastiques et à la Finance Quantitative

Bienvenue dans le cours de Finance Quantitative et modélisation stochastique. Ce programme de Master 1 vise à vous doter des outils mathématiques et statistiques indispensables pour comprendre, analyser et modéliser les phénomènes complexes des marchés financiers. La finance moderne est intrinsèquement liée à l'incertitude, et c'est précisément là que les processus stochastiques trouvent leur pertinence.

Les marchés financiers sont des environnements dynamiques où les prix des actifs, les taux d'intérêt et la volatilité évoluent de manière aléatoire. La modélisation de cette incertitude est cruciale pour des tâches telles que la valorisation des produits dérivés, la gestion des risques et l'optimisation de portefeuille. Les processus stochastiques fournissent le cadre mathématique rigoureux pour capturer cette dynamique aléatoire. Des pionniers comme [[WIDGET:RealPerson:bachelier:Louis Bachelier]], dont les travaux sur la théorie de la spéculation ont anticipé le mouvement brownien, ont jeté les bases de cette discipline. Plus tard, le modèle de [[WIDGET:RealPerson:black_scholes:Black-Scholes-Merton]] a révolutionné la valorisation des options, démontrant la puissance des approches stochastiques en finance [[WIDGET:Reference:2]], [[WIDGET:Reference:3]].

L'objectif de cette leçon inaugurale est de poser les fondations nécessaires à la compréhension des modèles financiers plus avancés. Nous nous concentrerons initialement sur les processus stochastiques en temps discret, qui offrent une approche plus intuitive et souvent plus simple pour introduire des concepts clés, comme le modèle binomial de valorisation des options [[WIDGET:Reference:1]]. Un concept central que nous explorerons en profondeur est celui des martingales, qui sont des processus stochastiques dont l'espérance future conditionnelle à l'information présente est égale à leur valeur actuelle. Les martingales sont fondamentales en finance quantitative, notamment pour la valorisation sans [[WIDGET:ConceptLink:arbitrage:arbitrage]] des actifs dérivés [[WIDGET:Reference:7]].

La structure de ce cours est conçue pour vous faire progresser des concepts fondamentaux vers des applications complexes. Après cette introduction aux processus discrets et aux martingales, nous aborderons les processus en temps continu, le calcul stochastique (notamment le lemme d'Itô), et leurs applications directes à la valorisation des options, à la modélisation des taux d'intérêt et à la gestion du risque de crédit.

[[WIDGET:Mermaid:course_progression:Schéma conceptuel de la progression du cours de Finance Quantitative]]

## Fondements des Processus Stochastiques Discrets

Pour aborder les processus stochastiques en finance, il est essentiel de maîtriser certains concepts fondamentaux. Un processus stochastique en temps discret est une suite de variables aléatoires $(X_t)_{t \in T}$ où $T$ est un ensemble discret (par exemple, $T = \{0, 1, 2, \dots, N\}$ ou $T = \{0, 1, 2, \dots\}$). Chaque $X_t$ représente l'état d'un système à l'instant $t$, comme le prix d'une action à la clôture de chaque jour. Ces processus sont définis sur un espace de probabilité $(\Omega, \mathcal{F}, P)$.

Un concept crucial est celui de la [[WIDGET:ConceptLink:sigma_algebra:filtration]]. Une filtration $(\mathcal{F}_t)_{t \in T}$ est une suite croissante de $\sigma$-algèbres, c'est-à-dire $\mathcal{F}_0 \subseteq \mathcal{F}_1 \subseteq \dots \subseteq \mathcal{F}$, où $\mathcal{F}_t$ représente l'ensemble de toutes les informations disponibles jusqu'à l'instant $t$. En finance, $\mathcal{F}_t$ peut encapsuler l'historique des prix des actifs, les annonces économiques, etc., jusqu'à l'instant $t$.

[[WIDGET:Mermaid:filtration_concept:Illustration du concept de filtration et de l'accroissement de l'information au fil du temps]]

Un processus stochastique $(X_t)_{t \in T}$ est dit **adapté** à la filtration $(\mathcal{F}_t)_{t \in T}$ si, pour tout $t \in T$, la variable aléatoire $X_t$ est $\mathcal{F}_t$-mesurable. Cela signifie que la valeur de $X_t$ est connue (ou déterminable) à l'instant $t$, étant donné toute l'information disponible jusqu'à cet instant. En d'autres termes, on ne peut pas "voir le futur" pour déterminer $X_t$.

Un processus $(H_t)_{t \in T}$ est dit **prévisible** si, pour tout $t \in T$, la variable aléatoire $H_t$ est $\mathcal{F}_{t-1}$-mesurable (pour $t \ge 1$). Cela implique que la valeur de $H_t$ est connue *avant* l'instant $t$, en utilisant uniquement l'information disponible jusqu'à l'instant $t-1$. Les stratégies de trading, par exemple, sont souvent modélisées comme des processus prévisibles, car les décisions d'achat ou de vente à l'instant $t$ doivent être basées sur l'information disponible *avant* $t$.

Enfin, la compréhension de l'[[WIDGET:ConceptLink:esperance_conditionnelle:espérance conditionnelle]] est un prérequis fondamental pour les martingales. L'espérance conditionnelle $E[X|\mathcal{G}]$ d'une variable aléatoire $X$ par rapport à une $\sigma$-algèbre $\mathcal{G}$ peut être intuitivement comprise comme la "meilleure estimation" de $X$ étant donné l'information contenue dans $\mathcal{G}$. Elle possède plusieurs propriétés clés qui seront utilisées de manière extensive dans la théorie des martingales et la valorisation financière [[WIDGET:Reference:1]], [[WIDGET:Reference:7]]:

*   **Linéarité:** $E[aX + bY|\mathcal{G}] = aE[X|\mathcal{G}] + bE[Y|\mathcal{G}]$
*   **"Sortir ce qui est connu":** Si $Y$ est $\mathcal{G}$-mesurable, alors $E[XY|\mathcal{G}] = Y E[X|\mathcal{G}]$
*   **Propriété de la tour (ou espérance itérée):** Si $\mathcal{G}_1 \subseteq \mathcal{G}_2$, alors $E[E[X|\mathcal{G}_2]|\mathcal{G}_1] = E[X|\mathcal{G}_1]$
*   **Indépendance:** Si $X$ est indépendante de $\mathcal{G}$, alors $E[X|\mathcal{G}] = E[X]$

Ces propriétés sont cruciales pour manipuler les espérances dans les modèles stochastiques.

[[WIDGET:CustomFigure:conditional_expectation_properties:Résumé des propriétés clés de l'espérance conditionnelle]]
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