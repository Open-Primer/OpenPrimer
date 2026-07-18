You are the Narrative Critic Agent (Agent 4A). Review the generated block of text for the lesson:
---
## Dérivation de l'Équation aux Dérivées Partielles de Black-Scholes

La puissance du modèle de Black-Scholes réside dans sa capacité à dériver une équation aux dérivées partielles (EDP) dont la solution représente le prix de l'option. Cette dérivation repose sur le principe d'absence d'opportunité d'arbitrage et la construction d'un portefeuille de réplication sans risque.

### 1. Modélisation de l'Actif Sous-jacent et de l'Option

Conformément à nos hypothèses, le prix de l'actif sous-jacent $S_t$ suit un [[WIDGET:ConceptLink:mouvement_brownien_geometrique:Mouvement Brownien Géométrique (MBG)]]. Son évolution est décrite par l'équation différentielle stochastique (EDS) suivante :

$dS_t = \mu S_t dt + \sigma S_t dW_t$

où $\mu$ est le taux de rendement espéré de l'actif, $\sigma$ est sa volatilité, et $dW_t$ est un processus de Wiener (ou mouvement brownien standard).

Le prix de l'option, que nous noterons $V$, est une fonction du prix de l'actif sous-jacent $S$ et du temps $t$, soit $V(S, t)$. Pour déterminer l'évolution stochastique de $V$, nous devons appliquer le [[WIDGET:ConceptLink:ito_lemma:Lemme d'Itô]]. Ce théorème fondamental du calcul stochastique, développé par [[WIDGET:RealPerson:k_ito:Kiyosi Itô]], permet de calculer la différentielle d'une fonction d'un processus stochastique [[WIDGET:Reference:2]], [[WIDGET:Reference:11]].

L'application du Lemme d'Itô à $V(S, t)$ donne :

$dV = \left( \frac{\partial V}{\partial t} + \mu S \frac{\partial V}{\partial S} + \frac{1}{2} \sigma^2 S^2 \frac{\partial^2 V}{\partial S^2} \right) dt + \sigma S \frac{\partial V}{\partial S} dW_t$

Cette équation décrit comment le prix de l'option change en fonction du temps, du prix de l'actif sous-jacent et de sa volatilité.

### 2. Construction d'un Portefeuille de Réplication Sans Risque (Delta-Hedging)

L'étape cruciale de la dérivation est la construction d'un portefeuille qui est instantanément sans risque. Ce concept est connu sous le nom de [[WIDGET:Glossary:delta_hedging:delta-hedging]]. L'idée est de combiner l'option avec une certaine quantité de l'actif sous-jacent de manière à ce que le portefeuille résultant soit immunisé contre les petites variations du prix de l'actif sous-jacent.

Considérons un portefeuille $\Pi$ composé d'une option de vente (ou d'achat) et d'une position courte (vente à découvert) sur $\Delta$ unités de l'actif sous-jacent :

$\Pi = V - \Delta S$

où $\Delta = \frac{\partial V}{\partial S}$ est le delta de l'option, représentant la sensibilité du prix de l'option aux variations du prix de l'actif sous-jacent.

La variation de la valeur de ce portefeuille $d\Pi$ est donnée par :

$d\Pi = dV - \Delta dS$

En substituant les expressions de $dV$ et $dS$ :

$d\Pi = \left( \frac{\partial V}{\partial t} + \mu S \frac{\partial V}{\partial S} + \frac{1}{2} \sigma^2 S^2 \frac{\partial^2 V}{\partial S^2} \right) dt + \sigma S \frac{\partial V}{\partial S} dW_t - \Delta (\mu S dt + \sigma S dW_t)$

Puisque $\Delta = \frac{\partial V}{\partial S}$, les termes stochastiques en $dW_t$ s'annulent :

$\sigma S \frac{\partial V}{\partial S} dW_t - \frac{\partial V}{\partial S} \sigma S dW_t = 0$

Il en résulte que la variation du portefeuille est purement déterministe :

$d\Pi = \left( \frac{\partial V}{\partial t} + \frac{1}{2} \sigma^2 S^2 \frac{\partial^2 V}{\partial S^2} \right) dt$

Ce portefeuille est désormais sans risque car il ne contient plus de terme $dW_t$.

### 3. Application du Principe d'Absence d'Arbitrage et Dérivation de l'EDP

Selon le principe d'absence d'arbitrage, un portefeuille sans risque doit rapporter le taux d'intérêt sans risque $r$. Ainsi, la variation de la valeur du portefeuille doit être égale à la valeur du portefeuille multipliée par le taux sans risque et la durée $dt$:

$d\Pi = r \Pi dt$

En substituant l'expression de $\Pi = V - \Delta S$ et l'expression de $d\Pi$ :

$\left( \frac{\partial V}{\partial t} + \frac{1}{2} \sigma^2 S^2 \frac{\partial^2 V}{\partial S^2} \right) dt = r (V - \Delta S) dt$

En divisant par $dt$ et en remplaçant $\Delta$ par $\frac{\partial V}{\partial S}$ :

$\frac{\partial V}{\partial t} + \frac{1}{2} \sigma^2 S^2 \frac{\partial^2 V}{\partial S^2} = r V - r S \frac{\partial V}{\partial S}$

En réarrangeant les termes, nous obtenons l'Équation aux Dérivées Partielles de Black-Scholes-Merton [[WIDGET:Reference:3]], [[WIDGET:Reference:4]]:

$\frac{\partial V}{\partial t} + r S \frac{\partial V}{\partial S} + \frac{1}{2} \sigma^2 S^2 \frac{\partial^2 V}{\partial S^2} - r V = 0$

Cette EDP doit être résolue avec des conditions aux limites spécifiques à l'option considérée (par exemple, pour une option d'achat européenne, $V(S, T) = \max(S-K, 0)$ à l'échéance $T$). Il est important de noter que le taux de rendement espéré de l'actif sous-jacent $\mu$ n'apparaît pas dans l'EDP finale. Cela signifie que le prix de l'option ne dépend pas des préférences de risque des investisseurs, mais uniquement des paramètres du marché et de l'actif sous-jacent.

[[WIDGET:Mermaid:bsm_derivation_flow:Flux de dérivation de l'équation de Black-Scholes, illustrant les étapes clés du processus]]

## La Formule de Valorisation des Options Européennes

La résolution de l'EDP de Black-Scholes, avec les conditions aux limites appropriées, conduit à une solution analytique élégante pour la valorisation des options européennes. Cette solution est l'une des formules les plus célèbres de la finance quantitative.

### 1. Formule de Black-Scholes pour une Option d'Achat Européenne (Call)

Le prix d'une option d'achat européenne $C(S, t)$ est donné par :

$C(S, t) = S N(d_1) - K e^{-r(T-t)} N(d_2)$

où :
*   $S$ est le prix actuel de l'actif sous-jacent.
*   $K$ est le prix d'exercice (strike price) de l'option.
*   $T$ est la date d'échéance de l'option.
*   $t$ est le temps actuel.
*   $r$ est le taux d'intérêt sans risque annualisé et continu.
*   $\sigma$ est la volatilité annualisée de l'actif sous-jacent.
*   $N(x)$ est la fonction de répartition cumulative de la loi normale centrée réduite (c'est-à-dire la probabilité qu'une variable normale standard soit inférieure ou égale à $x$).

Les termes $d_1$ et $d_2$ sont définis comme suit :

$d_1 = \frac{\ln(S/K) + (r + \sigma^2/2)(T-t)}{\sigma \sqrt{T-t}}$

$d_2 = d_1 - \sigma \sqrt{T-t}$

### 2. Interprétation Économique des Termes

La formule peut être interprétée comme la différence entre la valeur actuelle espérée de la réception de l'actif sous-jacent si l'option est exercée, et la valeur actuelle espérée du paiement du prix d'exercice si l'option est exercée.

*   **$S N(d_1)$** : Représente la valeur actuelle espérée du gain lié à la possession de l'actif sous-jacent à l'échéance, pondérée par la [[WIDGET:ConceptLink:probabilite_neutre_risque:probabilité neutre au risque]] que l'option expire dans la monnaie.
*   **$K e^{-r(T-t)} N(d_2)$** : Représente la valeur actuelle espérée du paiement du prix d'exercice à l'échéance, pondérée par la probabilité neutre au risque que l'option expire dans la monnaie.

Les termes $N(d_1)$ et $N(d_2)$ peuvent être vus comme des probabilités dans un monde neutre au risque. $N(d_2)$ est la probabilité que l'option d'achat expire dans la monnaie (c'est-à-dire $S_T > K$). $N(d_1)$ est légèrement différent et est lié à la probabilité que l'option expire dans la monnaie, mais dans un contexte où l'actif sous-jacent est utilisé comme numéraire.

### 3. Formule de Black-Scholes pour une Option de Vente Européenne (Put)

Le prix d'une option de vente européenne $P(S, t)$ est donné par :

$P(S, t) = K e^{-r(T-t)} N(-d_2) - S N(-d_1)$

Cette formule peut également être dérivée directement de l'EDP de Black-Scholes avec la condition aux limites $V(S, T) = \max(K-S, 0)$, ou plus simplement via la [[WIDGET:ConceptLink:parite_put_call:Parité Put-Call]] :

$C(S, t) - P(S, t) = S - K e^{-r(T-t)}$

### 4. Les "Grecques" : Sensibilités du Prix de l'Option

Les [[WIDGET:Glossary:grecques:Grecques]] sont des mesures de la sensibilité du prix d'une option aux variations des paramètres sous-jacents du modèle. Elles sont essentielles pour la gestion des risques et le hedging des portefeuilles d'options [[WIDGET:Reference:3]], [[WIDGET:Reference:14]].

*   **Delta ($\Delta = \frac{\partial V}{\partial S}$)** : Mesure la variation du prix de l'option pour une variation d'un euro du prix de l'actif sous-jacent. Il est crucial pour le delta-hedging, indiquant la quantité d'actif sous-jacent à détenir pour couvrir le risque de prix.
*   **Gamma ($\Gamma = \frac{\partial^2 V}{\partial S^2}$)** : Mesure la variation du delta de l'option pour une variation d'un euro du prix de l'actif sous-jacent. Un gamma élevé indique que le delta change rapidement, nécessitant des ajustements de couverture plus fréquents.
*   **Theta ($\Theta = \frac{\partial V}{\partial t}$)** : Mesure la variation du prix de l'option pour une variation d'un jour du temps restant jusqu'à l'échéance (décroissance temporelle). Le theta est généralement négatif pour les options longues, signifiant que leur valeur diminue avec le temps.
*   **Vega ($\mathcal{V} = \frac{\partial V}{\partial \sigma}$)** : Mesure la variation du prix de l'option pour une variation d'un point de pourcentage de la volatilité implicite de l'actif sous-jacent. Le vega est positif pour les options longues, indiquant que leur valeur augmente avec la volatilité.
*   **Rho ($\rho = \frac{\partial V}{\partial r}$)** : Mesure la variation du prix de l'option pour une variation d'un point de pourcentage du taux d'intérêt sans risque.

[[WIDGET:CustomFigure:greeks_formulas:Tableau récapitulatif des principales Grecques, leurs formules et leurs interprétations économiques]]

La compréhension de ces sensibilités est fondamentale pour les praticiens des marchés dérivés, leur permettant d'évaluer et de gérer les risques associés à leurs positions sur options.
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