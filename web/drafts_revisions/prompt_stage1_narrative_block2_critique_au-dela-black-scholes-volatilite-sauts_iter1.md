You are the Narrative Critic Agent (Agent 4A). Review the generated block of text for the lesson:
---
Les limites du modèle de Black-Scholes, notamment son incapacité à reproduire le [[WIDGET:Glossary:volatility_smile:smile de volatilité]] et à intégrer les mouvements discontinus, ont conduit au développement de modèles plus sophistiqués. Parmi ceux-ci, les modèles de volatilité stochastique et les modèles à sauts sont devenus des piliers de la finance quantitative moderne.

## Modèles de Volatilité Stochastique : Le Modèle de Heston

L'une des hypothèses les plus restrictives du modèle de Black-Scholes est celle d'une volatilité constante. En réalité, la volatilité des actifs financiers n'est pas statique ; elle évolue au fil du temps de manière imprévisible, souvent en grappes (clusters) et avec une certaine réversion à la moyenne. Les modèles de [[WIDGET:ConceptLink:volatilite_stochastique:volatilité stochastique]] abandonnent cette hypothèse en traitant la volatilité elle-même comme un processus stochastique, c'est-à-dire une variable aléatoire qui suit sa propre dynamique. Cette approche permet de mieux capturer la complexité des marchés financiers et de reproduire des phénomènes observés empiriquement, tels que le *smile* ou le *skew* de volatilité.

Le modèle de Heston, introduit par [[WIDGET:RealPerson:heston_steven:Steven Heston]] en 1993 [[WIDGET:Reference:16]], est sans doute l'un des modèles de volatilité stochastique les plus célèbres et les plus utilisés. Il propose une modélisation où le prix de l'actif sous-jacent et sa variance instantanée suivent des processus stochastiques corrélés.

Le processus pour le prix de l'actif $S_t$ est donné par :
$$dS_t = r S_t dt + \sqrt{v_t} S_t dW_t^{(1)}$$
où $r$ est le taux d'intérêt sans risque, $v_t$ est la variance instantanée (et non la volatilité $\sigma_t = \sqrt{v_t}$), et $dW_t^{(1)}$ est un mouvement brownien standard.

Le processus pour la variance $v_t$ est modélisé par un processus de Cox-Ingersoll-Ross (CIR), garantissant que la variance reste positive :
$$dv_t = \kappa (\theta - v_t) dt + \xi \sqrt{v_t} dW_t^{(2)}$$
où $\kappa$ est le taux de réversion à la moyenne de la variance, $\theta$ est la variance à long terme vers laquelle $v_t$ tend, $\xi$ est la volatilité de la variance (ou "vol-of-vol"), et $dW_t^{(2)}$ est un autre mouvement brownien.

Ces deux mouvements browniens sont corrélés avec un coefficient $\rho$: $d\langle W^{(1)}, W^{(2)} \rangle_t = \rho dt$. Une corrélation négative ($\rho < 0$) est souvent observée sur les marchés actions, signifiant que le prix de l'actif tend à baisser lorsque sa volatilité augmente, ce qui est crucial pour reproduire le *skew* de volatilité.

[[WIDGET:CustomFigure:heston_sdes:Équations différentielles stochastiques du modèle de Heston pour le prix de l'actif et sa variance]]

Les avantages du modèle de Heston sont multiples :
*   **Gestion du smile/skew de volatilité :** Grâce à la volatilité stochastique et à la corrélation entre le prix de l'actif et sa variance, le modèle de Heston peut reproduire fidèlement la forme du *smile* ou du *skew* de volatilité observé sur les marchés.
*   **Forme quasi-fermée pour les options européennes :** Un avantage majeur est l'existence d'une solution semi-analytique (sous forme d'intégrale) pour le prix des options européennes, ce qui rend le modèle calculatoirement efficace par rapport à d'autres modèles de volatilité stochastique qui nécessitent des méthodes numériques plus lourdes (comme Monte Carlo ou différences finies).
*   **Paramètres interprétables :** Les paramètres du modèle ($\kappa, \theta, \xi, \rho$) ont une interprétation financière claire, facilitant leur compréhension et leur [[WIDGET:ConceptLink:calibration:calibration]].

La [[WIDGET:ConceptLink:calibration:calibration]] du modèle de Heston consiste à trouver les valeurs des paramètres ($\kappa, \theta, \xi, \rho, v_0$) qui minimisent l'écart entre les prix d'options observés sur le marché et les prix calculés par le modèle. Cette étape est cruciale pour que le modèle soit pertinent pour la valorisation et la couverture. Les applications pratiques du modèle de Heston incluent la valorisation d'options européennes et exotiques, la gestion des risques (calcul du VaR, ES), et la couverture dynamique.

[[WIDGET:Mermaid:heston_advantages_disadvantages:Diagramme des avantages et des inconvénients du modèle de Heston]]

## Modèles à Sauts : Intégrer les Mouvements Discontinus

Bien que les modèles de volatilité stochastique améliorent significativement la modélisation des prix d'options, ils ne capturent pas toujours adéquatement les mouvements brusques et discontinus des prix, souvent appelés "sauts" (jumps). Ces sauts sont des changements de prix soudains et importants qui se produisent en réponse à des événements imprévus (annonces économiques, catastrophes naturelles, crises politiques, etc.) et qui sont responsables des "queues épaisses" (fat tails) observées dans la distribution des rendements des actifs [[WIDGET:Reference:5]]. Les modèles à sauts sont conçus spécifiquement pour intégrer ces mouvements discontinus.

Les modèles à sauts combinent généralement un processus de diffusion continu (comme celui de Black-Scholes) avec un [[WIDGET:Glossary:processus_de_poisson:processus de Poisson]] composé. Le processus de Poisson modélise la fréquence des sauts, tandis que la distribution des amplitudes des sauts décrit leur magnitude.

Un processus de Poisson $N_t$ avec un taux $\lambda$ compte le nombre d'événements (sauts) qui se produisent jusqu'au temps $t$. La probabilité d'observer $k$ sauts sur un intervalle de temps $t$ est donnée par la distribution de Poisson : $P(N_t = k) = \frac{e^{-\lambda t} (\lambda t)^k}{k!}$.

Le modèle de Merton (1976) [[WIDGET:Reference:10]], par exemple, est un modèle de diffusion-sauts où le prix de l'actif $S_t$ suit le processus :
$$dS_t = (r - \lambda \mu_J) S_t dt + \sigma S_t dW_t + S_{t^-} dJ_t$$
où $r$ est le taux sans risque, $\sigma$ est la volatilité de la partie diffusion, $dW_t$ est un mouvement brownien, $\lambda$ est le taux d'occurrence des sauts, $\mu_J$ est l'espérance du logarithme de l'amplitude des sauts, et $dJ_t$ représente la partie sauts. Chaque saut est modélisé comme un changement multiplicatif du prix, et l'amplitude des sauts est souvent supposée suivre une distribution log-normale ou une autre distribution asymétrique.

[[WIDGET:CustomFigure:jump_diffusion_path:Illustration d'une trajectoire de prix d'actif avec des sauts (modèle de diffusion-sauts)]]

Un autre exemple est le modèle de Kou (2002) [[WIDGET:Reference:19]], qui utilise une distribution double exponentielle pour l'amplitude des sauts, permettant de capturer à la fois les sauts positifs et négatifs avec des probabilités différentes. Le modèle de [[WIDGET:RealPerson:kou_s_g:Steven Kou]] est particulièrement efficace pour reproduire l'asymétrie des queues de distribution.

L'impact des modèles à sauts sur la valorisation des options est significatif. Ils attribuent une probabilité plus élevée aux événements extrêmes, ce qui conduit à des prix plus élevés pour les options *out-of-the-money* (OTM) et *in-the-money* (ITM) par rapport au modèle de Black-Scholes, et contribuent à expliquer le *smile* de volatilité. Pour la gestion des risques, ces modèles permettent une meilleure estimation du risque de queue et sont essentiels pour la valorisation et la couverture d'options exotiques dont la valeur est fortement sensible aux événements rares et extrêmes.

[[WIDGET:Quiz:jump_models_quiz:Quiz sur les modèles à sauts et leurs applications]]
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