## Introduction au Calcul Stochastique et à la Formule d'Itô

Dans le domaine de la finance quantitative, la modélisation des prix d'actifs et des taux d'intérêt est une tâche complexe qui exige des outils mathématiques sophistiqués. Contrairement aux phénomènes déterministes décrits par le calcul différentiel classique, les marchés financiers sont intrinsèquement influencés par une multitude de facteurs aléatoires, rendant leurs évolutions imprévisibles et stochastiques. Le calcul différentiel ordinaire, qui repose sur l'hypothèse de fonctions suffisamment lisses et dérivables, se révèle insuffisant pour capturer la nature erratique et continue des mouvements de prix observés en temps réel.

C'est ici qu'intervient le [[WIDGET:ConceptLink:stochastic_calculus:Calcul stochastique]], une branche des mathématiques qui fournit le cadre rigoureux nécessaire pour analyser et modéliser les systèmes évoluant sous l'influence du hasard [[WIDGET:Reference:2]]. Développé notamment par le mathématicien japonais [[WIDGET:RealPerson:ito_kiyosi:Kiyosi Itô]], ce calcul permet de définir des notions de dérivée et d'intégrale pour des fonctions dont les trajectoires sont non-différentiables presque partout, comme celles des processus stochastiques.

[[WIDGET:Image:market_volatility:Représentation stylisée de la volatilité des marchés financiers]]

Au cœur du calcul stochastique appliqué à la finance se trouve la [[WIDGET:Glossary:ito_formula:Formule d'Itô]]. Cette formule est une généralisation de la règle de dérivation en chaîne (ou formule de Leibniz) du calcul classique, adaptée aux processus stochastiques. Elle est absolument fondamentale car elle permet de déterminer la dynamique d'une fonction d'un processus stochastique, ce qui est crucial pour la valorisation des produits dérivés, la gestion des risques et l'optimisation de portefeuille [[WIDGET:Reference:3]]. Sans la formule d'Itô, il serait impossible de dériver des équations différentielles stochastiques (EDS) qui régissent l'évolution des prix d'actifs sous des modèles comme celui de Black-Scholes-Merton [[WIDGET:Reference:12]].

L'objectif de cette leçon est de démystifier le calcul stochastique et de présenter en détail la formule d'Itô, en soulignant son importance pratique et théorique. Nous verrons pourquoi les outils classiques échouent face à la nature aléatoire des marchés et comment la formule d'Itô offre une solution élégante et puissante pour naviguer dans cet environnement incertain.

[[WIDGET:Mermaid:classical_vs_stochastic_calculus:Comparaison conceptuelle du calcul classique et du calcul stochastique]]

## Rappels et Fondements des Processus Stochastiques

Avant d'aborder la formule d'Itô, il est impératif de solidifier nos bases en matière de processus stochastiques. Cette section vise à réviser les concepts clés qui sont les piliers du calcul stochastique et, par extension, de la modélisation financière continue.

Le point de départ de la plupart des modèles financiers continus est le [[WIDGET:ConceptLink:brownian_motion:Mouvement Brownien]] (ou processus de Wiener), noté $W_t$. C'est un processus stochastique à temps continu qui modélise le mouvement aléatoire de particules dans un fluide. Ses propriétés sont cruciales :
1.  $W_0 = 0$ (le processus commence à zéro).
2.  Les trajectoires sont continues presque sûrement.
3.  Les accroissements sont indépendants : pour $0 \le s < t$, $W_t - W_s$ est indépendant des valeurs du processus jusqu'au temps $s$.
4.  Les accroissements sont stationnaires et suivent une loi normale : $W_t - W_s \sim \mathcal{N}(0, t-s)$.

Un [[WIDGET:Glossary:generalized_brownian_motion:Mouvement Brownien généralisé]] (ou processus de Wiener généralisé) est une extension du mouvement brownien standard, souvent utilisé pour modéliser les prix d'actifs. Il est défini par $dX_t = \mu dt + \sigma dW_t$, où $\mu$ est la dérive (tendance) et $\sigma$ est la volatilité [[WIDGET:Reference:13]].

[[WIDGET:CustomFigure:brownian_path:Exemple de trajectoire simulée d'un mouvement brownien standard]]

Un autre concept fondamental est celui de l'[[WIDGET:ConceptLink:stochastic_integral:Intégrale stochastique]], et plus spécifiquement l'intégrale d'Itô. Contrairement à l'intégrale de Riemann ou de Lebesgue, l'intégrale d'Itô est définie pour des intégrands qui sont des processus stochastiques non-anticipatifs par rapport au mouvement brownien. Cette construction est non triviale car les trajectoires du mouvement brownien ne sont pas à variation bornée, ce qui empêche l'utilisation des méthodes d'intégration classiques [[WIDGET:Reference:6]]. L'intégrale d'Itô est essentielle pour définir les solutions des équations différentielles stochastiques.

Enfin, les [[WIDGET:ConceptLink:martingale:Martingales]] jouent un rôle prépondérant en finance quantitative. Un processus stochastique est une martingale si son espérance conditionnelle future, étant donné l'information présente, est égale à sa valeur actuelle. En termes simples, une martingale représente un "jeu équitable" où l'espérance de gain futur est nulle. Les martingales sont au cœur de la théorie de l'évaluation sans arbitrage et de la mesure de probabilité risque-neutre, des concepts indispensables pour la valorisation des produits dérivés [[WIDGET:Reference:7]].

La maîtrise de ces concepts – mouvement brownien, intégrale stochastique et martingales – est la clé pour comprendre la logique et la puissance de la formule d'Itô et son application aux problèmes financiers.