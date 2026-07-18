You are the Narrative Critic Agent (Agent 4A). Review the generated block of text for the lesson:
---
Les propriétés de l'espérance conditionnelle que nous venons de revoir sont les piliers sur lesquels repose la théorie des martingales, un concept central en probabilités et en finance quantitative.

## Martingales Discrètes : Définition et Propriétés Fondamentales

Cette section se concentrera sur la définition formelle des martingales, sous-martingales et sur-martingales en temps discret. Elle explorera leurs propriétés clés, telles que l'inégalité de Doob et le théorème d'arrêt optionnel, en fournissant des exemples concrets pour illustrer ces concepts.

Un processus stochastique discret $(X_t)_{t \in T}$ est appelé une [[WIDGET:ConceptLink:martingale_def:Martingale]] par rapport à une filtration $(\mathcal{F}_t)_{t \in T}$ si les trois conditions suivantes sont remplies pour tout $t \in T$:
1.  **Adaptation:** Le processus $X_t$ est adapté à la filtration $\mathcal{F}_t$, c'est-à-dire que $X_t$ est $\mathcal{F}_t$-mesurable. Cela signifie que la valeur de $X_t$ est connue à l'instant $t$ compte tenu de l'information disponible jusqu'à $t$.
2.  **Intégrabilité:** $E[|X_t|] < \infty$. La valeur absolue de $X_t$ doit avoir une espérance finie pour tout $t$.
3.  **Propriété de Martingale:** $E[X_{t+1}|\mathcal{F}_t] = X_t$. L'espérance de la valeur future du processus, conditionnée par toute l'information disponible jusqu'à l'instant présent $t$, est égale à la valeur présente du processus.

Intuitivement, une martingale modélise un "jeu équitable" où le gain espéré à l'étape suivante, connaissant l'historique du jeu, est égal au gain actuel. Un exemple classique est la fortune d'un joueur dans un jeu de pile ou face équitable.

Par extension, nous définissons les sous-martingales et les sur-martingales :
*   Un processus $(X_t)_{t \in T}$ est une [[WIDGET:ConceptLink:submartingale_def:Sous-martingale]] si $E[X_{t+1}|\mathcal{F}_t] \ge X_t$. Cela représente un "jeu favorable" où le gain espéré futur est supérieur ou égal au gain actuel.
*   Un processus $(X_t)_{t \in T}$ est une [[WIDGET:ConceptLink:supermartingale_def:Sur-martingale]] si $E[X_{t+1}|\mathcal{F}_t] \le X_t$. Cela correspond à un "jeu défavorable" où le gain espéré futur est inférieur ou égal au gain actuel.

Ces concepts sont fondamentaux pour l'analyse des processus stochastiques et trouvent de nombreuses applications, notamment en finance pour la modélisation des prix d'actifs.

Parmi les propriétés essentielles des martingales, deux sont particulièrement remarquables :

1.  **L'Inégalité de Doob :** Cette inégalité, nommée d'après [[WIDGET:RealPerson:doob_joseph:Joseph L. Doob]], fournit une borne supérieure pour la probabilité qu'une martingale dépasse un certain seuil. Plus précisément, pour une sous-martingale $(X_t)_{t \in T}$ et un seuil $c > 0$, elle établit une relation entre la probabilité que le maximum du processus jusqu'à un certain temps $T$ dépasse $c$ et l'espérance de la valeur du processus à $T$. Elle est cruciale pour l'étude de la convergence des martingales et pour l'estimation du risque de dépassement [[WIDGET:Reference:7]], [[WIDGET:Reference:11]].

[[WIDGET:CustomFigure:doob_inequality:Formulation de l'inégalité de Doob pour les martingales, illustrant la borne supérieure de la probabilité de dépassement d'un seuil]]

2.  **Le Théorème d'Arrêt Optionnel :** Ce théorème est d'une importance capitale en finance. Il stipule que, sous certaines conditions (par exemple, si le temps d'arrêt est borné ou si la martingale est bornée), l'espérance d'une martingale à un [[WIDGET:Glossary:stopping_time:temps d'arrêt]] $T$ est égale à son espérance à l'instant initial. Un temps d'arrêt est une variable aléatoire $T$ dont la réalisation ne dépend que de l'information disponible jusqu'à l'instant $T$. En d'autres termes, on ne peut pas "battre" un jeu équitable en choisissant astucieusement le moment d'arrêter de jouer. Ce théorème est fondamental pour comprendre pourquoi il est impossible de générer des profits d'arbitrage dans un marché efficient [[WIDGET:Reference:1]], [[WIDGET:Reference:7]].

## Application aux Marchés Financiers : Le Modèle Binomial de Cox-Ross-Rubinstein

Cette section appliquera les concepts de martingales à la modélisation des marchés financiers. Elle détaillera la construction du modèle binomial de Cox-Ross-Rubinstein (CRR), expliquera l'absence d'opportunité d'arbitrage et introduira la mesure de probabilité risque-neutre. L'utilisation des martingales pour l'évaluation des options dans ce cadre sera un point central.

Le modèle binomial de [[WIDGET:RealPerson:cox_john:John C. Cox]], [[WIDGET:RealPerson:ross_stephen:Stephen A. Ross]] et [[WIDGET:RealPerson:rubinstein_mark:Mark Rubinstein]] (CRR) est un cadre discret et simple, mais puissant, pour la modélisation des prix d'actifs et l'évaluation des produits dérivés [[WIDGET:Reference:1]], [[WIDGET:Reference:3]]. Il repose sur les hypothèses suivantes :
*   Le temps est discret, divisé en $N$ périodes.
*   Il existe un actif sans risque (par exemple, une obligation) dont le prix $B_t$ évolue à un taux d'intérêt sans risque $r$ par période, soit $B_t = B_0 (1+r)^t$.
*   Il existe un actif risqué (par exemple, une action) dont le prix $S_t$ peut, à chaque période, soit augmenter d'un facteur $u > 1$ (up), soit diminuer d'un facteur $d < 1$ (down).
*   Les mouvements de prix sont indépendants d'une période à l'autre.

[[WIDGET:Mermaid:crr_model_tree:Arbre des prix du modèle binomial de Cox-Ross-Rubinstein sur plusieurs périodes]]

### Absence d'Opportunité d'Arbitrage

Une condition cruciale dans le modèle CRR est l'absence d'opportunité d'[[WIDGET:Glossary:arbitrage:arbitrage]]. L'arbitrage est la possibilité de réaliser un profit certain et sans risque, sans investissement initial. Dans le modèle CRR, cette condition est satisfaite si et seulement si $d < 1+r < u$. Si cette inégalité n'est pas respectée, il serait possible de construire une stratégie de trading qui génère un profit certain, ce qui est incompatible avec l'hypothèse d'un marché efficient [[WIDGET:Reference:1]], [[WIDGET:Reference:4]].

### La Mesure de Probabilité Risque-Neutre

L'absence d'arbitrage dans le modèle CRR est directement liée à l'existence d'une [[WIDGET:ConceptLink:risk_neutral_measure:Mesure de probabilité risque-neutre]] (souvent notée $Q$). Sous cette mesure, le prix actualisé de tout actif (y compris les produits dérivés) est une martingale. Cela signifie que l'espérance du prix actualisé futur est égale à son prix actualisé actuel.

Pour le modèle CRR, nous pouvons déterminer des probabilités "risque-neutres" $q$ et $1-q$ pour les mouvements à la hausse et à la baisse de l'action, telles que l'espérance du prix actualisé de l'action à la période suivante, sous $Q$, soit égale à son prix actualisé actuel. La probabilité $q$ est donnée par :

$q = \frac{(1+r) - d}{u - d}$

Sous cette mesure $Q$, les investisseurs sont indifférents au risque, et le rendement espéré de tous les actifs est le taux sans risque $r$.

### Évaluation des Options par Martingales

L'un des principaux avantages du cadre des martingales est sa capacité à évaluer les produits dérivés. Le prix d'une option (ou de tout autre instrument dérivé) à l'instant $t$, noté $V_t$, peut être calculé comme l'espérance de son payoff actualisé à maturité $T$, sous la mesure de probabilité risque-neutre $Q$ [[WIDGET:Reference:1]], [[WIDGET:Reference:8]]:

$V_t = E_Q\left[\frac{V_T}{(1+r)^{T-t}} \middle| \mathcal{F}_t\right]$

Cette formule est la pierre angulaire de l'évaluation des options dans le modèle CRR. Elle permet de remonter le temps, en calculant la valeur de l'option à chaque nœud de l'arbre binomial, en partant de sa valeur à maturité.

[[WIDGET:SolvedExercise:option_pricing_crr:Exemple d'évaluation d'une option d'achat européenne dans le modèle CRR à une période]]
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