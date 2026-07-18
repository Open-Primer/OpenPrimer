You are the Narrative Critic Agent (Agent 4A). Review the generated block of text for the lesson:
---
Nous avons établi les fondements d'un espace de probabilité $(\Omega, \mathcal{F}, P)$, qui nous permet de modéliser l'incertitude et d'attribuer des probabilités aux événements. Cependant, en finance quantitative, nous sommes rarement intéressés par les événements bruts de l'espace $\Omega$ directement, mais plutôt par des quantités numériques qui dépendent de ces événements, comme le prix d'un actif ou le rendement d'un portefeuille. C'est ici qu'intervient la notion de variable aléatoire.

## Variables Aléatoires et Mesure

Une [[WIDGET:ConceptLink:variable_aleatoire:variable aléatoire]] $X$ est une fonction qui associe un nombre réel à chaque résultat possible d'une expérience aléatoire. Plus formellement, sur un espace de probabilité $(\Omega, \mathcal{F}, P)$, une variable aléatoire $X$ est une fonction $X: \Omega \to \mathbb{R}$ telle que, pour tout ensemble de Borel $B \in \mathcal{B}(\mathbb{R})$, l'ensemble $X^{-1}(B) = \{\omega \in \Omega : X(\omega) \in B\}$ appartient à la tribu $\mathcal{F}$. Cette condition signifie que $X$ est une [[WIDGET:Glossary:fonction_mesurable:fonction mesurable]] de $(\Omega, \mathcal{F})$ vers $(\mathbb{R}, \mathcal{B}(\mathbb{R}))$. La mesurabilité est cruciale car elle garantit que nous pouvons attribuer une probabilité à tout événement lié aux valeurs prises par $X$.

Les variables aléatoires se classent principalement en deux catégories:
*   **Variables aléatoires discrètes**: Elles ne peuvent prendre qu'un nombre fini ou dénombrable de valeurs. Leur comportement est décrit par une fonction de masse de probabilité (FMP), $P(X=x_i)$, qui attribue une probabilité à chaque valeur possible $x_i$. Des exemples incluent le nombre de défauts sur un portefeuille de crédits ou le résultat d'un lancer de dé.
*   **Variables aléatoires continues**: Elles peuvent prendre n'importe quelle valeur dans un intervalle donné. Leur comportement est décrit par une fonction de densité de probabilité (FDP), $f_X(x)$, telle que $P(a \le X \le b) = \int_a^b f_X(x) dx$. Les rendements d'actifs financiers ou les taux d'intérêt sont souvent modélisés comme des variables aléatoires continues.

[[WIDGET:CustomFigure:types_variables_aleatoires:Classification des variables aléatoires et leurs caractéristiques principales]]

La loi de probabilité d'une variable aléatoire $X$ est la mesure de probabilité $P_X$ induite sur $(\mathbb{R}, \mathcal{B}(\mathbb{R}))$ par $X$, définie par $P_X(B) = P(X \in B)$ pour tout $B \in \mathcal{B}(\mathbb{R})$. Cette loi est entièrement caractérisée par la fonction de répartition $F_X(x) = P(X \le x)$.

L'**espérance mathématique** (ou valeur attendue) d'une variable aléatoire $X$, notée $\mathbb{E}[X]$, est une mesure de sa tendance centrale. Elle représente la valeur moyenne que l'on s'attend à observer si l'expérience était répétée un grand nombre de fois.
*   Pour une variable discrète $X$ prenant les valeurs $x_i$ avec probabilité $p_i$: $\mathbb{E}[X] = \sum_i x_i p_i$.
*   Pour une variable continue $X$ de densité $f_X(x)$: $\mathbb{E}[X] = \int_{-\infty}^{\infty} x f_X(x) dx$.

La puissance de la théorie de la mesure réside dans sa capacité à unifier ces définitions sous le concept d'**intégrale de Lebesgue**. Pour toute variable aléatoire $X$ intégrable (c'est-à-dire $\mathbb{E}[|X|] < \infty$), son espérance mathématique est donnée par l'intégrale de Lebesgue de $X$ par rapport à la mesure de probabilité $P$ sur l'espace fondamental $\Omega$:

$$ \mathbb{E}[X] = \int_{\Omega} X(\omega) dP(\omega) $$

Cette formulation est fondamentale en finance quantitative, car elle permet de traiter de manière rigoureuse des variables aléatoires complexes, y compris celles issues de processus stochastiques. Elle est la pierre angulaire pour la définition des martingales et pour l'évaluation des actifs financiers sous des mesures de probabilité équivalentes, comme détaillé dans des ouvrages de référence tels que [[WIDGET:Reference:7]] et [[WIDGET:Reference:13]].

[[WIDGET:Mermaid:lebesgue_integral_concept:Représentation conceptuelle de l'intégrale de Lebesgue pour le calcul de l'espérance]]

## Espérance Conditionnelle

En finance, l'information évolue constamment. Les décisions d'investissement sont prises non pas avec une connaissance parfaite de l'avenir, mais en fonction de l'information disponible à un instant donné. L'**espérance conditionnelle** est l'outil mathématique qui formalise cette idée de "mise à jour de l'espérance" en fonction d'une information partielle.

Soit $(\Omega, \mathcal{F}, P)$ un espace de probabilité et $X$ une variable aléatoire intégrable sur cet espace. Soit $\mathcal{G}$ une sous-$\sigma$-algèbre de $\mathcal{F}$ (c'est-à-dire $\mathcal{G} \subseteq \mathcal{F}$). La tribu $\mathcal{G}$ représente l'information disponible. L'[[WIDGET:ConceptLink:esperance_conditionnelle:espérance conditionnelle]] de $X$ sachant $\mathcal{G}$, notée $\mathbb{E}[X|\mathcal{G}]$, est une variable aléatoire qui satisfait les deux propriétés suivantes:
1.  $\mathbb{E}[X|\mathcal{G}]$ est $\mathcal{G}$-mesurable. Cela signifie que sa valeur est déterminée par l'information contenue dans $\mathcal{G}$.
2.  Pour tout événement $A \in \mathcal{G}$, on a $\int_A \mathbb{E}[X|\mathcal{G}] dP = \int_A X dP$. Cette propriété, souvent appelée "propriété de projection", indique que l'espérance de $X$ sur tout événement de $\mathcal{G}$ est la même que l'espérance de $\mathbb{E}[X|\mathcal{G}]$ sur cet événement.

L'existence et l'unicité (presque sûre) de $\mathbb{E}[X|\mathcal{G}]$ sont garanties par le théorème de Radon-Nikodym, un résultat fondamental de la théorie de la mesure. Le mathématicien [[WIDGET:RealPerson:kolmogorov:Andreï Kolmogorov]] a joué un rôle central dans la formalisation moderne de la théorie des probabilités et de l'espérance conditionnelle.

L'interprétation intuitive de $\mathbb{E}[X|\mathcal{G}]$ est la "meilleure estimation" de $X$ étant donnée l'information contenue dans $\mathcal{G}$. C'est la valeur moyenne de $X$ si nous connaissions tous les événements de $\mathcal{G}$.

Les propriétés fondamentales de l'espérance conditionnelle sont essentielles pour sa manipulation en finance:
*   **Linéarité**: $\mathbb{E}[aX+bY|\mathcal{G}] = a\mathbb{E}[X|\mathcal{G}] + b\mathbb{E}[Y|\mathcal{G}]$ pour des constantes $a, b \in \mathbb{R}$.
*   **Positivité**: Si $X \ge 0$, alors $\mathbb{E}[X|\mathcal{G}] \ge 0$ presque sûrement.
*   **Propriété de projection**: $\mathbb{E}[X|\mathcal{G}]$ est la projection orthogonale de $X$ sur l'espace des variables aléatoires $\mathcal{G}$-mesurables dans $L^2(P)$.
*   **Propriété de la tour (Tower Property)**: Si $\mathcal{H} \subseteq \mathcal{G} \subseteq \mathcal{F}$ sont des sous-$\sigma$-algèbres, alors $\mathbb{E}[\mathbb{E}[X|\mathcal{G}]|\mathcal{H}] = \mathbb{E}[X|\mathcal{H}]$. Un cas particulier est $\mathbb{E}[\mathbb{E}[X|\mathcal{G}]] = \mathbb{E}[X]$.
*   **"Sortir ce qui est connu"**: Si $Y$ est une variable aléatoire $\mathcal{G}$-mesurable, alors $\mathbb{E}[XY|\mathcal{G}] = Y\mathbb{E}[X|\mathcal{G}]$.
*   **Indépendance**: Si $X$ est indépendante de $\mathcal{G}$, alors $\mathbb{E}[X|\mathcal{G}] = \mathbb{E}[X]$.

[[WIDGET:CustomFigure:conditional_expectation_info:Interprétation de l'espérance conditionnelle comme une mise à jour de l'information disponible]]

En finance, $\mathcal{G}$ représente souvent la filtration, c'est-à-dire l'information accumulée au cours du temps. L'espérance conditionnelle est au cœur de la théorie des martingales, des processus de Markov, et des méthodes de valorisation des produits dérivés sous des mesures de probabilité risque-neutre, comme détaillé dans [[WIDGET:Reference:2]] et [[WIDGET:Reference:4]].

**Exemple concret**: Supposons que $X$ représente le prix futur d'une action et $\mathcal{G}$ représente l'ensemble des informations boursières disponibles jusqu'à aujourd'hui (cours passés, annonces économiques, etc.). Alors $\mathbb{E}[X|\mathcal{G}]$ est la prévision du prix futur de l'action basée sur toutes les informations actuelles. Si une nouvelle information $Y$ devient disponible (par exemple, un rapport de bénéfices), la nouvelle information est représentée par une $\sigma$-algèbre plus grande $\mathcal{G}' = \sigma(\mathcal{G}, Y)$, et la nouvelle prévision serait $\mathbb{E}[X|\mathcal{G}']$.

[[WIDGET:Quiz:conditional_expectation_quiz]]
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