You are the Narrative Critic Agent (Agent 4A). Review the generated block of text for the lesson:
---
### Théorèmes d'Existence et d'Unicité des Solutions d'EDS

La pertinence des Équations Différentielles Stochastiques en finance quantitative repose sur la certitude que les modèles qu'elles décrivent possèdent des solutions bien définies et uniques. Sans cette garantie, les prédictions et les valorisations dérivées de ces modèles seraient dépourvues de fondement théorique. L'existence et l'unicité des solutions d'EDS sont assurées sous certaines conditions sur les fonctions de dérive $\mu(t, x)$ et de diffusion $\sigma(t, x)$.

Les conditions les plus courantes pour garantir l'existence et l'unicité d'une solution forte à une EDS sont les suivantes [[WIDGET:Reference:13]]:

1.  **Condition de Lipschitz locale** sur les fonctions $\mu$ et $\sigma$ par rapport à la variable d'état $x$. Cela signifie qu'il existe une constante $L > 0$ telle que pour tout $t \in [0, T]$ et pour tout $x_1, x_2$ dans un domaine donné:
    $$ |\mu(t, x_1) - \mu(t, x_2)| + |\sigma(t, x_1) - \sigma(t, x_2)| \le L |x_1 - x_2| $$
    Cette [[WIDGET:ConceptLink:lipschitz_condition:Condition de Lipschitz]] assure que les fonctions ne varient pas trop rapidement, ce qui est crucial pour éviter des bifurcations ou des comportements chaotiques qui empêcheraient une solution unique.

2.  **Condition de croissance linéaire** sur les fonctions $\mu$ et $\sigma$ par rapport à la variable d'état $x$. Cela signifie qu'il existe une constante $K > 0$ telle que pour tout $t \in [0, T]$ et pour tout $x$:
    $$ |\mu(t, x)| + |\sigma(t, x)| \le K (1 + |x|) $$
    Cette [[WIDGET:ConceptLink:linear_growth:Croissance Linéaire]] garantit que les solutions ne "divergent" pas à l'infini en temps fini, assurant ainsi leur existence sur un intervalle de temps donné.

Sous ces deux conditions, le théorème d'existence et d'unicité de solutions fortes pour les EDS, souvent attribué à [[WIDGET:RealPerson:ito_kiyosi:Kiyosi Itô]] et d'autres, affirme qu'étant donné une condition initiale $X_0 = x_0$, il existe une unique solution $X_t$ à l'EDS sur un intervalle de temps $[0, T]$. Ce théorème est l'analogue stochastique du théorème de Picard-Lindelöf pour les équations différentielles ordinaires.

[[WIDGET:Mermaid:eds_existence_flow:Diagramme des conditions d'existence et d'unicité des solutions d'EDS]]

L'importance pratique de ces théorèmes en finance est capitale. Ils valident l'utilisation des EDS comme outils de modélisation. Par exemple, pour la valorisation des options, la garantie d'une solution unique à l'EDS décrivant le prix de l'actif sous-jacent est fondamentale pour que le prix de l'option soit lui-même unique et bien défini. Sans cette unicité, les stratégies de couverture et d'arbitrage seraient incertaines, minant la cohérence des marchés financiers [[WIDGET:Reference:4]], [[WIDGET:Reference:10]].

### EDS Linéaires et l'Équation de Black-Scholes

Les Équations Différentielles Stochastiques linéaires constituent une classe d'EDS pour lesquelles les fonctions de dérive et de diffusion dépendent linéairement du processus $X_t$. Une EDS linéaire générale peut s'écrire sous la forme:

$$ dX_t = (a(t)X_t + b(t)) \, dt + (c(t)X_t + d(t)) \, dW_t $$

où $a(t), b(t), c(t), d(t)$ sont des fonctions déterministes du temps. Ces EDS sont particulièrement importantes car elles admettent souvent des solutions explicites ou semi-explicites, ce qui facilite leur analyse et leur application. Un exemple classique est l'EDS linéaire où $c(t)=0$ et $d(t)$ est une constante, menant à un processus d'Ornstein-Uhlenbeck si $a(t)$ est une constante négative.

[[WIDGET:CustomFigure:eds_linear_example:Exemple de trajectoire d'une EDS linéaire]]

L'exemple le plus emblématique d'une EDS linéaire en finance est l'Équation Différentielle Stochastique de Black-Scholes pour la modélisation du prix d'un actif financier. Développée par [[WIDGET:RealPerson:black_scholes:Fischer Black et Myron Scholes]] (et indépendamment par Robert Merton), elle est la pierre angulaire de la théorie moderne de la valorisation des options [[WIDGET:Reference:3]]. L'EDS de Black-Scholes modélise le prix $S_t$ d'un actif (comme une action) comme un processus de mouvement brownien géométrique:

$$ dS_t = \mu S_t \, dt + \sigma S_t \, dW_t $$

où:
*   $S_t$ est le prix de l'actif au temps $t$.
*   $\mu$ est le taux de rendement espéré de l'actif (la dérive), supposé constant.
*   $\sigma$ est la volatilité de l'actif (la diffusion), supposée constante.
*   $dW_t$ est le différentiel d'un mouvement brownien standard.

Cette équation postule que les rendements instantanés de l'actif sont normalement distribués et que la volatilité est proportionnelle au prix de l'actif. Sa dérivation repose sur l'hypothèse d'un marché sans arbitrage et l'application du lemme d'Itô à la fonction de valeur d'une option. En appliquant le lemme d'Itô à une fonction $V(S_t, t)$ représentant le prix d'une option, et en construisant un portefeuille sans risque, on peut dériver l'équation aux dérivées partielles de Black-Scholes, qui est une équation de la chaleur parabolique [[WIDGET:Reference:2]], [[WIDGET:Reference:12]].

L'EDS de Black-Scholes est centrale dans la valorisation des options car elle fournit un cadre pour comprendre la dynamique des prix des actifs sous-jacents. La solution de cette EDS, $S_t = S_0 \exp\left(\left(\mu - \frac{1}{2}\sigma^2\right)t + \sigma W_t\right)$, montre que le prix de l'actif suit une distribution log-normale. Cette propriété est essentielle pour calculer les probabilités que le prix de l'actif atteigne certains niveaux, ce qui est directement lié au paiement des options. Elle est également fondamentale pour la gestion des risques, notamment pour la couverture des positions en options via le concept de "Grecques" [[WIDGET:Reference:14]].
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