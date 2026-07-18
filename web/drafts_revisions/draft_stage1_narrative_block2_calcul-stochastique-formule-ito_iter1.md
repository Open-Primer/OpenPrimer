## La Formule d'Itô: Énoncé et Intuition

La formule d'Itô est la pierre angulaire du calcul stochastique, permettant de différencier des fonctions de processus stochastiques. Elle représente l'analogue stochastique de la règle de la chaîne du calcul différentiel classique, mais avec une différence fondamentale et non intuitive due à la nature hautement irrégulière des processus stochastiques comme le mouvement brownien [[WIDGET:Reference:2]].

Considérons un processus d'Itô $X_t$ défini par l'équation différentielle stochastique (EDS) suivante :
$$dX_t = \mu(t, X_t) dt + \sigma(t, X_t) dW_t$$
où $\mu(t, X_t)$ est le coefficient de dérive et $\sigma(t, X_t)$ est le coefficient de diffusion (volatilité), et $W_t$ est un mouvement brownien standard.

Pour une fonction $f(t, x)$ de classe $C^{1,2}$ (c'est-à-dire une fois continûment différentiable par rapport à $t$ et deux fois par rapport à $x$), la [[WIDGET:ConceptLink:ito_formula:Formule d'Itô]] pour $Y_t = f(t, X_t)$ s'énonce comme suit :
$$dY_t = df(t, X_t) = \left( \frac{\partial f}{\partial t}(t, X_t) + \mu(t, X_t) \frac{\partial f}{\partial x}(t, X_t) + \frac{1}{2} \sigma^2(t, X_t) \frac{\partial^2 f}{\partial x^2}(t, X_t) \right) dt + \sigma(t, X_t) \frac{\partial f}{\partial x}(t, X_t) dW_t$$

La différence cruciale avec la règle de la chaîne classique réside dans l'apparition du [[WIDGET:Glossary:ito_correction_term:Terme de correction d'Itô]] : $\frac{1}{2} \sigma^2(t, X_t) \frac{\partial^2 f}{\partial x^2}(t, X_t) dt$. Ce terme est directement lié à la variance du processus stochastique et est absent dans le calcul déterministe. Sans ce terme, la formule d'Itô serait incorrecte pour les processus stochastiques [[WIDGET:Reference:13]].

L'intuition derrière ce terme de correction provient du fait que les trajectoires du mouvement brownien ne sont pas différentiables et ont une variation quadratique non nulle. En effet, alors que $(dt)^2 = 0$ et $dt \cdot dW_t = 0$ dans le calcul classique (ou au sens de Stratonovich), dans le calcul d'Itô, on a $dW_t^2 = dt$. Cette propriété est fondamentale et découle de la variance des accroissements du mouvement brownien : $E[(dW_t)^2] = dt$. Lors d'un développement de Taylor d'ordre deux pour $f(t, X_t)$, les termes d'ordre $dX_t^2$ ne peuvent être ignorés car $dX_t^2$ contient un terme en $dW_t^2$ qui est d'ordre $dt$.

[[WIDGET:Mermaid:ito_vs_classical_chain_rule:Comparaison schématique de la règle de la chaîne classique et de la formule d'Itô, soulignant l'ajout du terme de correction]]

Le mathématicien japonais [[WIDGET:RealPerson:ito_kiyosi:Kiyosi Itô]] a développé cette théorie révolutionnaire, reconnaissant que la nature "rugueuse" des trajectoires stochastiques nécessitait une nouvelle approche pour la différentiation [[WIDGET:Reference:6]]. Le terme de correction d'Itô capture l'impact de la volatilité du processus sur la valeur moyenne de la fonction. Pour une fonction convexe, par exemple, la volatilité tend à augmenter la valeur moyenne de la fonction, et le terme de correction reflète précisément cet effet.

[[WIDGET:CustomFigure:ito_intuition_variance:Illustration intuitive du rôle de la variance dans la formule d'Itô, montrant comment les fluctuations aléatoires contribuent à un terme de correction non nul]]

## Applications Fondamentales de la Formule d'Itô en Finance

La formule d'Itô est un outil indispensable en finance quantitative, permettant de modéliser l'évolution des prix d'actifs et de valoriser des produits dérivés. Elle transforme des processus stochastiques en d'autres processus stochastiques, facilitant ainsi l'analyse et la résolution de problèmes complexes [[WIDGET:Reference:3]].

### 1. Dérivation du Mouvement Brownien Géométrique (MBG)

Le [[WIDGET:ConceptLink:geometric_brownian_motion:Mouvement Brownien Géométrique]] est le modèle le plus couramment utilisé pour les prix d'actifs financiers (actions, devises) en raison de sa capacité à capturer la croissance exponentielle et la volatilité. Si nous supposons que le rendement instantané d'un actif suit un mouvement brownien généralisé, alors le prix de l'actif $S_t$ peut être modélisé.
Soit $S_t = e^{X_t}$ où $X_t$ est un processus d'Itô de la forme $dX_t = \left(\mu - \frac{1}{2}\sigma^2\right) dt + \sigma dW_t$.
En appliquant la formule d'Itô à $f(X_t) = e^{X_t}$, nous pouvons dériver l'EDS du MBG.

[[WIDGET:SolvedExercise:gbm_derivation:Dérivation du Mouvement Brownien Géométrique via la formule d'Itô]]

Le résultat est l'EDS classique du MBG :
$$dS_t = \mu S_t dt + \sigma S_t dW_t$$
où $\mu$ est le taux de rendement attendu et $\sigma$ est la volatilité. Cette dérivation est fondamentale pour comprendre l'évolution des prix d'actifs sous l'hypothèse d'efficience des marchés [[WIDGET:Reference:4]].

### 2. Dérivation de l'Équation de Black-Scholes

L'une des applications les plus célèbres de la formule d'Itô est la dérivation de l'[[WIDGET:ConceptLink:black_scholes_pde:Équation de Black-Scholes]] pour l'évaluation des options. En supposant que le prix de l'actif sous-jacent suit un MBG et que la valeur d'une option $V(S_t, t)$ est une fonction de ce prix et du temps, la formule d'Itô permet de trouver l'EDS pour $dV(S_t, t)$. En combinant cette EDS avec un argument d'absence d'arbitrage (construction d'un portefeuille sans risque), on élimine le terme de mouvement brownien, conduisant à une équation différentielle partielle (EDP) déterministe [[WIDGET:Reference:3]].

L'EDP de Black-Scholes est :
$$\frac{\partial V}{\partial t} + r S \frac{\partial V}{\partial S} + \frac{1}{2} \sigma^2 S^2 \frac{\partial^2 V}{\partial S^2} - r V = 0$$
où $r$ est le taux d'intérêt sans risque. Cette équation est la base de la valorisation de la plupart des options européennes et a révolutionné la finance moderne [[WIDGET:Reference:12]].

[[WIDGET:CustomFigure:black_scholes_framework:Schéma conceptuel du modèle de Black-Scholes, illustrant les intrants et les extrants de l'équation]]

### 3. Applications à d'Autres Modèles Financiers

La formule d'Itô est également cruciale pour la construction et l'analyse d'une multitude d'autres modèles en finance quantitative :
- **Modèles de taux d'intérêt** : Des modèles comme Vasicek ou Cox-Ingersoll-Ross (CIR) décrivent l'évolution stochastique des taux d'intérêt. La formule d'Itô est utilisée pour transformer ces EDS et analyser les propriétés des processus, par exemple pour dériver l'EDS du carré du taux dans le modèle CIR [[WIDGET:Reference:15]].
- **Modèles de volatilité stochastique** : Des modèles comme Heston, où la volatilité elle-même est un processus stochastique, s'appuient sur la formule d'Itô pour dériver les EDP gouvernant les prix des options dans un environnement de volatilité fluctuante [[WIDGET:Reference:16]].
- **Changement de mesure de probabilité** : La formule d'Itô est un ingrédient clé dans le théorème de Girsanov, qui permet de changer de mesure de probabilité (par exemple, passer de la mesure historique à la mesure risque-neutre), un concept central pour l'évaluation des produits dérivés sans arbitrage [[WIDGET:Reference:7]].

En somme, la formule d'Itô est bien plus qu'un simple outil mathématique ; c'est un langage qui permet aux praticiens et chercheurs en finance de traduire des hypothèses économiques sur le comportement des marchés en modèles mathématiques rigoureux, et de résoudre des [[WIDGET:Glossary:stochastic_differential_equation:Équations Différentielles Stochastiques (EDS)]] pour la valorisation et la gestion des risques.