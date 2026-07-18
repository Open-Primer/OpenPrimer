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