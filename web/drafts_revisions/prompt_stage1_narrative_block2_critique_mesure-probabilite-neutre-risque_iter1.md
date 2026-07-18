You are the Narrative Critic Agent (Agent 4A). Review the generated block of text for the lesson:
---
Le concept de densité de Radon-Nikodym, introduit précédemment, est le fondement mathématique qui permet de passer d'une mesure de probabilité à une autre. Dans le contexte des processus stochastiques, et plus particulièrement des mouvements browniens, cet outil prend une forme spécifique et puissante connue sous le nom de théorème de Girsanov.

## Le Théorème de Girsanov et le Changement de Drift

Le [[WIDGET:ConceptLink:theoreme_girsanov:Théorème de Girsanov]] est l'un des piliers de la modélisation en finance quantitative, car il fournit le mécanisme précis pour transformer un processus stochastique, tel qu'un mouvement brownien, lors d'un changement de mesure de probabilité équivalente [[WIDGET:Reference:2]], [[WIDGET:Reference:7]]. Son essence réside dans la modification du *drift* d'un processus tout en laissant sa *volatilité* inchangée.

Considérons un mouvement brownien standard $W_t$ sous la mesure de probabilité historique $P$. Si nous souhaitons passer à une mesure équivalente $Q$, le théorème de Girsanov stipule qu'il existe un processus $\lambda_t$ (souvent interprété comme le prix de marché du risque) tel que le processus transformé $\tilde{W}_t$ défini par:

$$ \tilde{W}_t = W_t - \int_0^t \lambda_s ds $$

est un mouvement brownien sous la nouvelle mesure $Q$. Le processus $\lambda_t$ est lié à la densité de Radon-Nikodym $Z_t = \frac{dQ}{dP}|_{\mathcal{F}_t}$ par la relation $dZ_t = -Z_t \lambda_t dW_t$.

Ce résultat est d'une importance capitale. Il signifie que si un actif financier suit une équation différentielle stochastique (EDS) de la forme $dS_t = \mu S_t dt + \sigma S_t dW_t$ sous la mesure $P$ (où $\mu$ est le [[WIDGET:Glossary:drift:drift]] et $\sigma$ la [[WIDGET:Glossary:volatilite:volatilité]]), alors sous la mesure $Q$, l'EDS de l'actif sera transformée. En substituant $dW_t = d\tilde{W}_t + \lambda_t dt$, l'EDS devient:

$$ dS_t = (\mu + \sigma \lambda_t) S_t dt + \sigma S_t d\tilde{W}_t $$

Le théorème de Girsanov permet donc de changer le terme de drift du processus, passant de $\mu$ à $(\mu + \sigma \lambda_t)$, tandis que le terme de volatilité $\sigma$ reste rigoureusement identique. C'est cette invariance de la volatilité qui est cruciale : elle assure que la structure fondamentale de l'incertitude du marché est préservée, seule la "direction moyenne" du mouvement change.

[[WIDGET:Mermaid:girsanov_drift_change:Illustration schématique du changement de drift d'un processus stochastique via le théorème de Girsanov]]

Pour la neutralité au risque, l'objectif est de choisir $\lambda_t$ de telle sorte que le drift de l'actif actualisé devienne le taux sans risque. Plus précisément, sous la mesure neutre au risque $Q$, le drift de tout actif actualisé doit être nul, ce qui en fait une martingale. Pour un actif $S_t$ dont le prix actualisé est $e^{-rt}S_t$, son drift sous $Q$ doit être $r$. Le processus $\lambda_t$ est alors directement lié à la prime de risque de l'actif.

Le mathématicien russe [[WIDGET:RealPerson:girsanov:Igor Girsanov]] a formalisé ce théorème dans les années 1960, fournissant ainsi un outil indispensable pour la théorie moderne de la valorisation des options et des produits dérivés [[WIDGET:Reference:4]], [[WIDGET:Reference:11]].

## Valorisation des Actifs Dérivés sous Mesure Neutre au Risque

Le principe fondamental de la valorisation des actifs dérivés en finance quantitative repose sur l'absence d'opportunité d'arbitrage. Ce principe, couplé au théorème de Girsanov, conduit à la conclusion que le prix d'un actif dérivé peut être exprimé comme l'espérance de son payoff futur, actualisé au taux sans risque, sous la [[WIDGET:ConceptLink:mesure_neutre_risque:mesure neutre au risque]] $Q$.

Formellement, le prix à l'instant $t$ d'un actif dérivé dont le payoff à l'échéance $T$ est $V_T$ est donné par:

$$ V_t = E_Q[e^{-r(T-t)} V_T | \mathcal{F}_t] $$

où $r$ est le taux d'intérêt sans risque (supposé constant ici pour simplifier), et $E_Q[\cdot | \mathcal{F}_t]$ désigne l'espérance conditionnelle sous la mesure neutre au risque $Q$, étant donné l'information disponible à l'instant $t$.

Ce résultat est d'une puissance considérable car il transforme un problème de valorisation complexe (qui dépendrait des préférences de risque des investisseurs) en un calcul d'espérance sous une mesure de probabilité spécifique. L'absence d'arbitrage garantit l'existence et l'unicité de cette mesure $Q$ (dans un marché complet). Sous $Q$, tous les actifs actualisés (y compris l'actif sous-jacent et le dérivé) sont des martingales, ce qui signifie qu'ils n'offrent aucune prime de risque.

[[WIDGET:CustomFigure:valuation_process_diagram:Diagramme du processus de valorisation d'un dérivé sous mesure neutre au risque]]

La célèbre formule de [[WIDGET:RealPerson:black_scholes:Black-Scholes]] pour la valorisation des options européennes est un cas particulier de cette approche. Développée par Fischer Black, Myron Scholes et Robert Merton, elle permet de valoriser des options européennes sur des actions ne versant pas de dividendes, en supposant que le prix de l'action suit un mouvement brownien géométrique et que le taux sans risque et la volatilité sont constants [[WIDGET:Reference:3]], [[WIDGET:Reference:8]]. La formule de Black-Scholes calcule précisément cette espérance sous la mesure neutre au risque.

**Exemple simple de valorisation d'une option européenne:**

Considérons une option d'achat (call) européenne avec un prix d'exercice $K$ et une échéance $T$. Son payoff à l'échéance est $V_T = \max(S_T - K, 0)$, où $S_T$ est le prix de l'actif sous-jacent à l'échéance. Le prix de l'option à l'instant $t=0$ est alors:

$$ C_0 = E_Q[e^{-rT} \max(S_T - K, 0)] $$

Le défi consiste à calculer cette espérance. Dans le cadre du modèle de Black-Scholes, $S_T$ suit une distribution log-normale sous la mesure $Q$, ce qui permet de dériver une formule analytique explicite pour $C_0$. Pour d'autres dérivés ou des modèles plus complexes, cette espérance peut être calculée numériquement, par exemple, via des méthodes de Monte Carlo [[WIDGET:Reference:9]] ou des schémas aux différences finies pour résoudre l'équation aux dérivées partielles associée.
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