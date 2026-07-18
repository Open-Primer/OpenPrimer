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