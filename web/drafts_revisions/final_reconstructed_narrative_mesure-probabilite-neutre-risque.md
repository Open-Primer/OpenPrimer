## Introduction à la Mesure Neutre au Risque

La [[WIDGET:ConceptLink:finance_quantitative:finance quantitative]] est une discipline qui applique des outils mathématiques et statistiques avancés à la modélisation et à l'analyse des marchés financiers. Au cœur de cette discipline se trouve la problématique de la valorisation des actifs dérivés. Un actif dérivé, tel qu'une option ou un swap, tire sa valeur d'un ou plusieurs actifs sous-jacents (actions, taux d'intérêt, devises, etc.) et ses flux de trésorerie futurs sont souvent incertains. La question fondamentale est de déterminer un prix « juste » pour ces instruments, un prix qui reflète leur valeur intrinsèque sans permettre d'opportunités d'arbitrage.

L'absence d'[[WIDGET:Glossary:arbitrage:opportunité d'arbitrage]] est un principe fondateur en finance moderne. Il stipule qu'il ne devrait pas être possible de réaliser un profit sans risque et sans investissement initial. Dans un marché sans arbitrage, la valorisation des dérivés ne peut pas être arbitraire ; elle doit être cohérente avec les prix des actifs sous-jacents. C'est dans ce contexte que la notion de mesure neutre au risque émerge comme un concept central et élégant.

Intuitivement, la mesure neutre au risque (souvent notée Q) est une mesure de probabilité « fictive » sous laquelle le rendement espéré de tout actif financier est égal au taux sans risque. En d'autres termes, sous cette mesure, les investisseurs sont « neutres au risque », ce qui signifie qu'ils ne demandent aucune prime de risque pour détenir des actifs risqués. La beauté de cette approche est qu'elle permet de valoriser n'importe quel actif dérivé comme l'espérance de ses flux de trésorerie futurs actualisés au taux sans risque, sans avoir à modéliser explicitement les préférences de risque des investisseurs. Ce concept a été formalisé par des travaux pionniers, notamment ceux de [[WIDGET:RealPerson:black_scholes:Fischer Black, Myron Scholes et Robert Merton]] pour le modèle de Black-Scholes [[WIDGET:Reference:3]], [[WIDGET:Reference:12]].

[[WIDGET:Mermaid:flux_valorisation_derive:Diagramme illustrant le flux de valorisation des dérivés via la mesure neutre au risque]]

L'importance de la mesure neutre au risque est double :
1.  **Théorique :** Elle fournit un cadre rigoureux pour la valorisation sans arbitrage, reliant les prix des dérivés aux prix des sous-jacents de manière cohérente. Elle est la pierre angulaire du théorème fondamental de la valorisation sans arbitrage.
2.  **Pratique :** Elle simplifie considérablement les calculs de valorisation. Au lieu de devoir estimer des primes de risque complexes et subjectives, on peut se concentrer sur la modélisation de la dynamique des sous-jacents sous cette mesure particulière, puis calculer des espérances. Cela est particulièrement utile pour les méthodes numériques comme les simulations de Monte Carlo [[WIDGET:Reference:9]].

## Fondements: Mesure Équivalente et Densité de Radon-Nikodym

Pour comprendre la mesure neutre au risque, il est essentiel de saisir les concepts de mesure de probabilité équivalente et de densité de Radon-Nikodym.

Une **mesure de probabilité** est une fonction qui attribue une probabilité à chaque événement d'un espace mesurable, respectant les axiomes de Kolmogorov. Dans le contexte financier, nous travaillons généralement avec une mesure de probabilité « réelle » ou « historique », souvent notée P, qui décrit la probabilité des événements tels qu'ils se produisent dans le monde réel, reflétant les anticipations et les primes de risque des investisseurs.

Une **mesure de probabilité équivalente** Q par rapport à une mesure P (notée $Q \sim P$) est une autre mesure de probabilité sur le mêm'espace mesurable telle que P et Q ont les mêmes ensembles de mesure nulle. Autrement dit, si un événement a une probabilité nulle sous P, il a également une probabilité nulle sous Q, et vice-versa. Cela signifie que les deux mesures « sont d'accord » sur ce qui est possible ou impossible. L'équivalence est cruciale car elle garantit que le passage à la mesure neutre au risque ne modifie pas les événements qui peuvent se produire (ou ne pas se produire) sur le marché.

Le lien mathématique entre deux mesures de probabilité équivalentes est établi par la **densité de Radon-Nikodym**. Si $Q \sim P$, alors il existe une fonction aléatoire non négative $Z$ (appelée densité de Radon-Nikodym ou dérivée de Radon-Nikodym) telle que pour tout événement $A$, la probabilité de $A$ sous Q peut être exprimée comme l'espérance de $Z$ sous P, conditionnée par $A$:

$$Q(A) = E_P[Z \cdot \mathbf{1}_A]$$

où $\mathbf{1}_A$ est la fonction indicatrice de l'événement $A$. Plus généralement, pour toute variable aléatoire intégrable $X$, l'espérance de $X$ sous Q peut être calculée comme l'espérance de $X \cdot Z$ sous P:

$$E_Q[X] = E_P[X \cdot Z]$$

La fonction $Z$ est souvent notée $dQ/dP$ et agit comme un « facteur de correction » qui ajuste les probabilités de P pour obtenir celles de Q. Dans le contexte de la finance quantitative, cette densité est étroitement liée au processus de Girsanov, qui permet de changer la mesure de probabilité sous laquelle un processus stochastique est une martingale [[WIDGET:Reference:7]], [[WIDGET:Reference:11]].

[[WIDGET:CustomFigure:radon_nikodym_formula:Formule de la densité de Radon-Nikodym pour le changement de mesure]]

Un changement de mesure est nécessaire pour passer d'une mesure historique (P) à une mesure neutre au risque (Q) pour plusieurs raisons fondamentales:
1.  **Élimination de la prime de risque :** Sous la mesure P, les rendements des actifs risqués incluent une prime de risque pour compenser les investisseurs pour l'incertitude. Sous la mesure Q, cette prime de risque est « supprimée » ou « absorbée » par le changement de mesure, de sorte que tous les actifs (actualisés au taux sans risque) ont le même rendement espéré que l'actif sans risque.
2.  **Valorisation sans arbitrage :** Le premier théorème fondamental de la valorisation sans arbitrage stipule qu'un marché est sans arbitrage si et seulement s'il existe une mesure de probabilité équivalente sous laquelle les prix des actifs actualisés sont des martingales [[WIDGET:Reference:4]], [[WIDGET:Reference:10]]. Cette mesure est précisément la mesure neutre au risque.
3.  **Simplification des calculs :** En transformant le problème de valorisation en un calcul d'espérance sous Q, on évite la nécessité de modéliser les préférences de risque individuelles des investisseurs, qui sont difficiles à observer et à quantifier.

La densité de Radon-Nikodym est donc l'outil mathématique qui permet ce passage crucial du « monde réel » (P) au « monde neutre au risque » (Q), transformant les probabilités de manière à ce que les prix actualisés des actifs deviennent des martingales.

Le concept de densité de Radon-Nikodym, introduit précédemment, est le fondement mathématique qui permet de passer d'une mesure de probabilité à une autre. Dans le contexte des processus stochastiques, et plus particulièrement des mouvements browniens, cet outil prend une forme spécifique et puissante connue sous le nom de théorème de Girsanov.

## Le Théorème de Girsanov et le Changement de Drift

Le [[WIDGET:ConceptLink:theoreme_girsanov:Théorème de Girsanov]] est l'un des piliers de la modélisation en finance quantitative, car il fournit le mécanisme précis pour transformer un processus stochastique, tel qu'un mouvement brownien, lors d'un changement de mesure de probabilité équivalente [[WIDGET:Reference:2]], [[WIDGET:Reference:7]]. Son essence réside dans la modification du *drift* d'un processus tout en laissant sa *volatilité* inchangée.

Considérons un mouvement brownien standard $W_t$ sous la mesure de probabilité historique $P$. Si nous souhaitons passer à une mesure équivalente $Q$, le théorème de Girsanov stipule qu'il existe un processus $\lambda_t$ (souvent interprété comme le prix de marché du risque) tel que le processus transformé $\tilde{W}_t$ défini par:

$$ \tilde{W}_t = W_t - \int_0^t \lambda_s ds $$

est un mouvement brownien sous la nouvelle mesure $Q$. Le processus $\lambda_t$ est lié à la densité de Radon-Nikodym $Z_t = \frac{dQ}{dP}|_{\mathcal{F}_t}$ par la relation $dZ_t = -Z_t \lambda_t dW_t$.

Ce résultat est d'une importance capitale. Il signifie que si un actif financier suit une équation différentielle stochastique (EDS) de la forme $dS_t = \mu S_t dt + \sigma S_t dW_t$ sous la mesure $P$ (où $\mu$ est le [[WIDGET:Glossary:drift:drift]] et $\sigma$ la [[WIDGET:Glossary:volatilite:volatilité]]), alors sous la mesure $Q$, l'EDS de l'actif sera transformée. En substituant $dW_t = d\tilde{W}_t + \lambda_t dt$, l'EDS devient:

$$ dS_t = (\mu + \sigma \lambda_t) S_t dt + \sigma S_t d\tilde{W}_t $$

Le théorème de Girsanov permet donc de changer le terme de drift du processus, passant de $\mu$ à $(\mu + \sigma \lambda_t)$, tandis que le terme de volatilité $\sigma$ reste rigoureusement identique. C'est cette invariance de la volatilité qui est cruciale : elle assure que la structure fondamentale de l'incertitude du marché est préservée, seule la « direction moyenne » du mouvement change.

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

## Conclusion
Cette exploration de la mesure de probabilité neutre au risque a mis en lumière des concepts fondamentaux de la finance quantitative. Nous avons vu comment le [[WIDGET:ConceptLink:theoreme_girsanov:théorème de Girsanov]] permet de passer d'une mesure de probabilité physique (historique) à une mesure équivalente sous laquelle les actifs financiers actualisés deviennent des [[WIDGET:ConceptLink:martingale:martingales]]. Cette transformation est cruciale car elle élimine la nécessité de modéliser les préférences de risque des investisseurs, simplifiant ainsi considérablement le problème de la valorisation des dérivés.

Le principe de [[WIDGET:Glossary:valorisation_neutre_risque:valorisation neutre au risque]], découlant de l'absence d'opportunités d'[[WIDGET:Glossary:arbitrage:arbitrage]], fournit un cadre robuste et cohérent pour le calcul du prix de tout instrument dérivé comme l'espérance de son payoff futur actualisé sous cette mesure. Ce cadre est la pierre angulaire de la modélisation financière moderne, permettant non seulement la valorisation d'options simples comme celles de Black-Scholes, mais aussi d'instruments plus complexes tels que les dérivés de taux d'intérêt [[WIDGET:Reference:15]], les dérivés de crédit, ou les options exotiques. Il est également essentiel pour la gestion des risques et la mise en place de stratégies de couverture efficaces.

[[WIDGET:Mermaid:risk_neutral_framework_flow:Schéma conceptuel du cadre de valorisation neutre au risque]]

Bien que puissant, le cadre de la mesure neutre au risque dans sa forme la plus simple (comme dans le modèle de Black-Scholes) repose sur des hypothèses simplificatrices, telles que la volatilité et les taux d'intérêt constants, ou l'absence de sauts dans les prix d'actifs. Les recherches et développements en finance quantitative visent à lever ces restrictions en intégrant des modèles plus sophistiqués, comme les modèles à volatilité stochastique (par exemple, le modèle de [[WIDGET:RealPerson:heston:Heston]]) [[WIDGET:Reference:16]], les modèles à sauts [[WIDGET:Reference:5]], ou les modèles multi-actifs. Ces avancées nécessitent souvent des techniques numériques plus complexes, telles que les méthodes de Monte Carlo [[WIDGET:Reference:9]] ou la résolution d'équations aux dérivées partielles stochastiques [[WIDGET:Reference:20]], pour calculer les espérances sous la mesure neutre au risque.

[[WIDGET:SolvedExercise:risk_neutral_steps:Exercice résolu sur les étapes clés de la valorisation neutre au risque]]

La compréhension approfondie de la mesure neutre au risque est donc indispensable pour tout professionnel de la finance quantitative. Elle offre une perspective unifiée et rigoureuse pour aborder la complexité des marchés financiers et la valorisation des instruments dérivés, tout en ouvrant la voie à des modèles plus réalistes et sophistiqués.

[[WIDGET:Quote:shreve_risk_neutral:Citation de Steven Shreve sur l'importance de la mesure neutre au risque]]

[[WIDGET:conclusionSummary]]
[[WIDGET:whatsNext]]
[[WIDGET:goingFurther]]
[[WIDGET:finalEvaluation]]
