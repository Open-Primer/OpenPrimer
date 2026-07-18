You are the Narrative Critic Agent (Agent 4A). Review the generated block of text for the lesson:
---
## Introduction à la Modélisation des Taux d'Intérêt

La modélisation des taux d'intérêt est un pilier fondamental de la [[WIDGET:ConceptLink:finance_quantitative:finance quantitative]], essentielle pour l'évaluation des instruments financiers, la gestion des risques et la prise de décisions stratégiques. Les taux d'intérêt sont le coût de l'argent et influencent directement la valeur des obligations, des produits dérivés de taux, et même les décisions d'investissement des entreprises. Leur dynamique complexe, souvent imprévisible, pose des défis significatifs aux modélisateurs.

L'un des principaux défis réside dans la nature stochastique des taux d'intérêt, leur capacité à évoluer de manière non linéaire et leur dépendance à de multiples facteurs économiques. De plus, les taux d'intérêt ne peuvent pas être négatifs dans un environnement économique "normal" (bien que des taux négatifs aient été observés dans certaines économies récemment), et ils présentent souvent une tendance à revenir vers une moyenne de long terme, un phénomène connu sous le nom de [[WIDGET:Glossary:retour_moyenne:retour à la moyenne]].

Ce cours a pour objectif de vous fournir une compréhension approfondie des principaux modèles de taux d'intérêt utilisés en finance. Nous explorerons leurs fondements théoriques, leurs propriétés mathématiques, leurs avantages et leurs limites, ainsi que les méthodes de calibration et d'application pour la valorisation et la couverture. Nous commencerons par introduire les concepts clés de [[WIDGET:Glossary:taux_court:taux court]] (le taux d'intérêt instantané) et de la [[WIDGET:ConceptLink:courbe_taux:courbe des taux]] (la relation entre les taux d'intérêt et leurs maturités respectives), qui sont au cœur de toute modélisation des taux.

[[WIDGET:Mermaid:introduction_taux:Diagramme conceptuel des éléments clés de la modélisation des taux d'intérêt]]

La compréhension de la structure par terme des taux d'intérêt, représentée par la courbe des taux, est cruciale. Cette courbe reflète les anticipations du marché concernant les futurs taux courts et la prime de risque associée à l'horizon temporel. Des ouvrages de référence tels que ceux de [[WIDGET:RealPerson:john_hull:John Hull]] [[WIDGET:Reference:3]], [[WIDGET:RealPerson:darrell_duffie:Darrell Duffie]] [[WIDGET:Reference:10]] et Brigo & Mercurio [[WIDGET:Reference:15]] fournissent des bases solides pour cette exploration.

## Modèles de Taux Courts à un Facteur (Vasicek et CIR)

Les modèles de taux courts à un facteur sont parmi les plus fondamentaux pour décrire l'évolution stochastique du taux d'intérêt instantané, $r_t$. Ils supposent que le mouvement de l'ensemble de la courbe des taux est déterminé par un seul facteur, le taux court lui-même.

### Le Modèle de Vasicek

Proposé par [[WIDGET:RealPerson:oldrich_vasicek:Oldřich Vašíček]] en 1977, le modèle de Vasicek est un modèle de taux court qui incorpore la propriété de retour à la moyenne. Son équation différentielle stochastique (EDS) est donnée par :

$$dr_t = a(b - r_t)dt + \sigma dW_t$$

où :
*   $r_t$ est le taux court au temps $t$.
*   $a$ est la vitesse de retour à la moyenne (plus $a$ est grand, plus le retour est rapide).
*   $b$ est le niveau de retour à la moyenne (le taux d'intérêt de long terme vers lequel $r_t$ tend).
*   $\sigma$ est la volatilité du taux court.
*   $dW_t$ est un processus de Wiener standard (mouvement brownien) sous la mesure de probabilité risque-neutre.

**Propriétés et Caractéristiques :**
*   **Retour à la moyenne :** Le terme $a(b - r_t)dt$ indique que le taux $r_t$ est attiré vers le niveau $b$. Si $r_t > b$, la dérive est négative, tirant $r_t$ vers le bas ; si $r_t < b$, la dérive est positive, le tirant vers le haut.
*   **Volatilité constante :** La volatilité $\sigma$ est constante, ce qui signifie que les fluctuations du taux sont indépendantes de son niveau.
*   **Tractabilité analytique :** Le modèle de Vasicek est très apprécié pour sa grande tractabilité. Il permet d'obtenir des solutions analytiques pour les prix des obligations zéro-coupon et d'autres dérivés de taux.
*   **Inconvénient majeur :** Le modèle de Vasicek permet aux taux d'intérêt de devenir négatifs, ce qui était considéré comme irréaliste avant les années 2010 mais est devenu une réalité dans certains marchés.

Le prix d'une obligation zéro-coupon $P(t, T)$ à l'instant $t$ qui paie 1 unité monétaire à l'échéance $T$ sous le modèle de Vasicek est donné par $P(t, T) = A(t, T)e^{-B(t, T)r_t}$, où $A(t, T)$ et $B(t, T)$ sont des fonctions déterministes de $t$ et $T$. Pour une dérivation détaillée, on peut se référer à Shreve [[WIDGET:Reference:2]] ou Brigo & Mercurio [[WIDGET:Reference:15]].

### Le Modèle de Cox-Ingersoll-Ross (CIR)

Développé par [[WIDGET:RealPerson:john_cox:John C. Cox]], Stephen A. Ross et Mark Rubinstein en 1985, le modèle CIR est une alternative au modèle de Vasicek qui résout le problème des taux négatifs. Son EDS est :

$$dr_t = a(b - r_t)dt + \sigma\sqrt{r_t} dW_t$$

**Propriétés et Caractéristiques :**
*   **Retour à la moyenne :** Comme Vasicek, le modèle CIR présente un retour à la moyenne vers $b$ avec une vitesse $a$.
*   **Volatilité dépendante du niveau :** La volatilité est proportionnelle à $\sqrt{r_t}$. Cela signifie que la volatilité diminue lorsque le taux court diminue, et vice-versa.
*   **Positivité des taux :** Une propriété cruciale du modèle CIR est qu'il garantit que les taux d'intérêt restent positifs ($r_t \ge 0$), à condition que la condition $2ab \ge \sigma^2$ soit satisfaite. C'est un avantage significatif par rapport au modèle de Vasicek, le rendant plus réaliste pour la modélisation des taux d'intérêt.
*   **Tractabilité :** Bien que plus complexe que Vasicek, le modèle CIR reste analytiquement tractable, permettant également des solutions fermées pour les prix des obligations zéro-coupon.

Le prix d'une obligation zéro-coupon $P(t, T)$ sous le modèle CIR a également une forme exponentielle-affine $P(t, T) = A(t, T)e^{-B(t, T)r_t}$, avec des fonctions $A(t, T)$ et $B(t, T)$ plus complexes que celles du modèle de Vasicek.

[[WIDGET:CustomFigure:vasicek_cir_paths:Comparaison de trajectoires simulées des modèles de Vasicek et CIR, illustrant la positivité du CIR]]

**Avantages et Inconvénients Comparés :**

| Caractéristique       | Modèle de Vasicek                               | Modèle de CIR                                     |
| :-------------------- | :---------------------------------------------- | :------------------------------------------------ |
| **EDS**               | $dr_t = a(b - r_t)dt + \sigma dW_t$             | $dr_t = a(b - r_t)dt + \sigma\sqrt{r_t} dW_t$     |
| **Retour à la moyenne** | Oui                                             | Oui                                               |
| **Positivité des taux** | Non garanti (peut devenir négatif)              | Garanti si $2ab \ge \sigma^2$                     |
| **Volatilité**        | Constante ($\sigma$)                            | Dépendante du niveau ($\sigma\sqrt{r_t}$)         |
| **Tractabilité**      | Très élevée (solutions analytiques simples)     | Élevée (solutions analytiques, mais plus complexes) |
| **Réalisme**          | Moins réaliste pour les taux bas/négatifs       | Plus réaliste pour les taux positifs               |

Ces modèles à un facteur sont des points de départ essentiels pour comprendre la dynamique des taux d'intérêt. Cependant, leur simplicité limite leur capacité à capturer toutes les nuances de la courbe des taux, notamment les mouvements non parallèles. Les blocs suivants aborderont des modèles plus sophistiqués pour pallier ces limitations.

[[WIDGET:SolvedExercise:vasicek_cir_bond_price:Calcul du prix d'une obligation zéro-coupon sous le modèle de Vasicek]]
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