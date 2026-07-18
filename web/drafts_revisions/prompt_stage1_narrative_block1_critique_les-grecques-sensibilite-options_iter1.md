You are the Narrative Critic Agent (Agent 4A). Review the generated block of text for the lesson:
---
## Introduction aux Grecques et à la Sensibilité des Options

Les [[WIDGET:ConceptLink:option_financiere:options financières]] sont des instruments dérivés qui confèrent à leur détenteur le droit, mais non l'obligation, d'acheter (option d'achat ou *call*) ou de vendre (option de vente ou *put*) un actif sous-jacent à un prix et à une date prédéterminés. Elles jouent un rôle fondamental sur les marchés financiers modernes, permettant aux acteurs de spéculer sur les mouvements futurs des prix, de gérer les risques (couverture) ou de générer des revenus supplémentaires [[WIDGET:Reference:3]].

La valorisation et la gestion des risques associées aux options sont des défis complexes, car leur prix dépend de multiples facteurs, tels que le prix de l'actif sous-jacent, la volatilité implicite, le temps restant jusqu'à l'échéance, les taux d'intérêt sans risque et les dividendes attendus. Pour naviguer dans cette complexité, les professionnels de la finance quantitative utilisent un ensemble de mesures de sensibilité appelées les [[WIDGET:Glossary:grecques:Grecques]]. Ces mesures quantifient l'impact d'une variation de chacun de ces facteurs sur le prix de l'option, offrant ainsi une compréhension cruciale de son comportement dynamique [[WIDGET:Reference:14]].

La maîtrise des Grecques est indispensable pour plusieurs raisons:
*   **Évaluation:** Elles permettent de comprendre comment les modèles de valorisation, tels que le modèle de Black-Scholes-Merton, réagissent aux changements des paramètres d'entrée [[WIDGET:Reference:2]].
*   **Gestion des risques:** Elles aident à identifier et à quantifier les expositions au risque d'un portefeuille d'options, permettant ainsi une surveillance proactive.
*   **Couverture (*Hedging*):** Elles sont le fondement des stratégies de couverture, visant à neutraliser ou à réduire l'exposition d'un portefeuille aux fluctuations des marchés [[WIDGET:Reference:10]].

Dans cette leçon, nous explorerons les principales Grecques: le Delta, le Gamma, le Vega, le Theta et le Rho. Nous commencerons par les deux mesures les plus fondamentales liées à la sensibilité au prix de l'actif sous-jacent: le Delta et le Gamma.

[[WIDGET:Mermaid:option_sensitivity_factors:Diagramme des principaux facteurs influençant le prix d'une option et leurs Grecques associées]]

## Delta et Gamma: Mesures de la Sensibilité au Prix de l'Actif Sous-Jacent

### Le Delta ($\Delta$)

Le [[WIDGET:Glossary:delta:Delta]] d'une option est la mesure de la sensibilité du prix de l'option aux variations du prix de son actif sous-jacent. Mathématiquement, il est défini comme la dérivée partielle du prix de l'option par rapport au prix de l'actif sous-jacent ($S$):

$$
\Delta = \frac{\partial V}{\partial S}
$$

où $V$ est le prix de l'option.

**Interprétation et Utilisation:**
*   **Changement de prix:** Un Delta de 0,50 pour une option d'achat signifie que pour chaque augmentation de 1 € du prix de l'actif sous-jacent, le prix de l'option augmentera approximativement de 0,50 €.
*   **Équivalent actions:** Le Delta peut être interprété comme le nombre d'unités de l'actif sous-jacent qu'il faudrait détenir pour répliquer la sensibilité du prix de l'option. Par exemple, une option d'achat avec un Delta de 0,60 se comporte, en première approximation, comme la détention de 0,60 action de l'actif sous-jacent.
*   **Probabilité *in-the-money*:** Pour les options de type européen, le Delta d'une option d'achat est souvent considéré comme une approximation de la probabilité que l'option expire dans la monnaie (*in-the-money*) [[WIDGET:Reference:1]].
*   **Plage de valeurs:** Le Delta d'une option d'achat varie entre 0 et 1, tandis que celui d'une option de vente varie entre -1 et 0. Les options profondément dans la monnaie ont un Delta proche de 1 (pour les *calls*) ou -1 (pour les *puts*), se comportant presque comme l'actif sous-jacent lui-même. Les options loin de la monnaie ont un Delta proche de 0.

La [[WIDGET:ConceptLink:couverture_delta:couverture Delta]] est une stratégie fondamentale de gestion des risques qui consiste à créer un portefeuille dont le Delta total est nul. Cela permet de rendre le portefeuille insensible aux petites variations du prix de l'actif sous-jacent. Cependant, cette couverture n'est efficace que pour de petits mouvements de prix et doit être ajustée fréquemment, car le Delta lui-même change.

[[WIDGET:CustomFigure:delta_call_graph:Graphique illustrant l'évolution du Delta d'une option d'achat en fonction du prix du sous-jacent, montrant sa transition de 0 à 1]]

### Le Gamma ($\Gamma$)

Le [[WIDGET:Glossary:gamma:Gamma]] d'une option mesure la sensibilité du Delta de l'option aux variations du prix de l'actif sous-jacent. Il s'agit donc de la dérivée seconde du prix de l'option par rapport au prix de l'actif sous-jacent:

$$
\Gamma = \frac{\partial \Delta}{\partial S} = \frac{\partial^2 V}{\partial S^2}
$$

**Interprétation et Rôle:**
*   **Taux de changement du Delta:** Le Gamma indique à quelle vitesse le Delta d'une option change lorsque le prix du sous-jacent bouge. Un Gamma élevé signifie que le Delta est très volatil et que la couverture Delta doit être réajustée plus fréquemment.
*   **Convexité:** Le Gamma est une mesure de la convexité du prix de l'option par rapport au prix de l'actif sous-jacent. Une option avec un Gamma positif bénéficie des mouvements importants du sous-jacent (à la hausse comme à la baisse), car son Delta augmente lorsque le prix se déplace dans la direction favorable et diminue lorsque le prix se déplace dans la direction défavorable. Cela reflète la nature non linéaire des options [[WIDGET:Reference:3]].
*   **Gestion du risque de Delta:** Le Gamma est crucial pour la gestion du risque de Delta. Un portefeuille avec un Gamma élevé est plus difficile à couvrir car son Delta change rapidement, nécessitant des ajustements constants (rebalancement). Les traders cherchent souvent à gérer leur exposition au Gamma pour contrôler la fréquence et le coût de leurs ajustements de couverture.

Les options *at-the-money* (à la monnaie) ont généralement le Gamma le plus élevé, car leur Delta est le plus sensible aux mouvements du sous-jacent à ce point. À mesure que l'option s'éloigne de la monnaie (profondément *in-the-money* ou *out-of-the-money*), son Gamma tend vers zéro, indiquant que son Delta devient plus stable.

[[WIDGET:CustomFigure:gamma_option_graph:Graphique illustrant l'évolution du Gamma d'une option en fonction du prix du sous-jacent, montrant son pic à la monnaie]]
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