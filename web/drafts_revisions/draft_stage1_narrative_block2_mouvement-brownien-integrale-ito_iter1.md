## L'Intégrale d'Itô: Définition et Propriétés Clés

Le mouvement brownien, comme nous l'avons vu, possède des trajectoires continues mais nulle part différentiables. Cette propriété fondamentale rend le calcul intégral classique, tel que l'intégrale de Riemann ou de Riemann-Stieltjes, inadapté pour intégrer des fonctions par rapport à ce processus. En effet, la variation quadratique non nulle du mouvement brownien empêche la convergence des sommes de Riemann-Stieltjes vers une valeur unique et bien définie pour des intégrands non trivialement lisses. C'est dans ce contexte que [[WIDGET:RealPerson:k_ito:Kiyosi Itô]] a développé une nouvelle théorie de l'intégration stochastique dans les années 1940, spécifiquement conçue pour les processus non différentiables comme le mouvement brownien [[WIDGET:Reference:13]].

L'intégrale d'Itô est essentielle pour définir et résoudre les [[WIDGET:ConceptLink:stochastic_differential_equation:Équations Différentielles Stochastiques (EDS)]], qui sont au cœur de la modélisation des dynamiques aléatoires en finance quantitative.

### Définition de l'Intégrale d'Itô

Pour comprendre l'intégrale d'Itô, commençons par des processus simples, appelés processus étagés (ou processus prévisibles simples). Un processus $X_t$ est étagé s'il peut s'écrire sous la forme:
$$ X_t = \sum_{i=0}^{n-1} \xi_i \mathbf{1}_{[t_i, t_{i+1})}(t) $$
où $0 = t_0 < t_1 < \dots < t_n = T$ est une partition de l'intervalle $[0, T]$, et $\xi_i$ sont des variables aléatoires mesurables par rapport à la filtration $\mathcal{F}_{t_i}$ (c'est-à-dire que $\xi_i$ est connue au temps $t_i$). Pour un tel processus, l'intégrale d'Itô par rapport au mouvement brownien $W_t$ est définie comme:
$$ \int_0^T X_t \, dW_t = \sum_{i=0}^{n-1} \xi_i (W_{t_{i+1}} - W_{t_i}) $$
Cette définition est intuitive: on multiplie la valeur du processus $X_t$ au début de chaque intervalle par l'accroissement du mouvement brownien sur cet intervalle. Le choix de prendre la valeur de $X_t$ au début de l'intervalle ($t_i$) est crucial et distingue l'intégrale d'Itô de l'intégrale de Stratonovich, qui prendrait une valeur intermédiaire. Ce choix assure que l'intégrale d'Itô est une [[WIDGET:Glossary:martingale:martingale]], une propriété fondamentale en finance.

[[WIDGET:CustomFigure:ito_vs_riemann:Illustration schématique de la différence entre les sommes d'Itô et de Riemann-Stieltjes pour un processus stochastique]]

L'extension de cette définition à des processus plus généraux (non étagés) se fait par un processus de limite. Pour un processus $X_t$ plus général, on construit une suite de processus étagés $X_t^{(n)}$ qui convergent vers $X_t$ dans un certain sens (par exemple, en moyenne quadratique). L'intégrale d'Itô de $X_t$ est alors définie comme la limite des intégrales d'Itô des processus étagés:
$$ \int_0^T X_t \, dW_t = \lim_{n \to \infty} \int_0^T X_t^{(n)} \, dW_t $$
Cette extension est rigoureuse et permet d'intégrer une large classe de processus stochastiques, à condition qu'ils satisfassent certaines conditions de mesurabilité et d'intégrabilité (par exemple, $E[\int_0^T X_t^2 dt] < \infty$) [[WIDGET:Reference:2]].

### Propriétés Clés de l'Intégrale d'Itô

L'intégrale d'Itô possède des propriétés distinctes de celles de l'intégrale de Riemann-Stieltjes:

1.  **Linéarité:** Pour des constantes $a, b$ et des processus $X_t, Y_t$ intégrables:
    $$ \int_0^T (a X_t + b Y_t) \, dW_t = a \int_0^T X_t \, dW_t + b \int_0^T Y_t \, dW_t $$
2.  **Propriété de Martingale:** Si $X_t$ est un processus prévisible et borné, alors l'intégrale d'Itô $M_t = \int_0^t X_s \, dW_s$ est une martingale par rapport à la filtration naturelle du mouvement brownien. Cette propriété est d'une importance capitale en finance pour la valorisation des actifs et la gestion des risques [[WIDGET:Reference:4]].
3.  **Isométrie d'Itô:** C'est l'une des propriétés les plus fondamentales et les plus utilisées. Pour un processus $X_t$ tel que $E[\int_0^T X_t^2 dt] < \infty$:
    $$ E \left[ \left( \int_0^T X_t \, dW_t \right)^2 \right] = E \left[ \int_0^T X_t^2 \, dt \right] $$
    Cette formule est l'analogue stochastique du théorème de Pythagore et est cruciale pour calculer les variances des intégrales stochastiques. Elle met en évidence que l'intégrale d'Itô est une transformation isométrique de l'espace des processus $L^2$ vers l'espace des variables aléatoires $L^2$.
4.  **Non-commutativité:** Contrairement au calcul classique où $f(x) dx = d(F(x))$, l'intégrale d'Itô ne suit pas les mêmes règles. Par exemple, $\int_0^T W_t \, dW_t \neq \frac{1}{2} W_T^2$. En fait, l'intégrale d'Itô de $W_t$ par rapport à $dW_t$ est donnée par:
    $$ \int_0^T W_t \, dW_t = \frac{1}{2} W_T^2 - \frac{1}{2} T $$
    Le terme $-\frac{1}{2} T$ est le "terme d'Itô" ou "correction d'Itô", et il provient directement de la variation quadratique non nulle du mouvement brownien. C'est cette correction qui rend le calcul d'Itô unique et indispensable pour les processus stochastiques.

[[WIDGET:Mermaid:ito_integral_concept:Diagramme conceptuel de l'intégrale d'Itô et ses propriétés clés]]

## Le Lemme d'Itô et Premières Applications

Le Lemme d'Itô est l'outil le plus puissant du calcul stochastique, agissant comme une généralisation de la règle de la chaîne pour les fonctions de processus d'Itô. Il permet de calculer la différentielle d'une fonction d'un processus stochastique, en tenant compte de la variation quadratique non nulle. Sans le Lemme d'Itô, il serait impossible de dériver les équations régissant l'évolution de nombreuses quantités financières.

### Formulation du Lemme d'Itô

Soit $X_t$ un processus d'Itô défini par l'équation différentielle stochastique (EDS):
$$ dX_t = \mu(t, X_t) \, dt + \sigma(t, X_t) \, dW_t $$
où $\mu(t, X_t)$ est le terme de dérive (drift) et $\sigma(t, X_t)$ est le terme de diffusion (volatility), et $W_t$ est un mouvement brownien.
Soit $f(t, x)$ une fonction de classe $C^2$ en $x$ et $C^1$ en $t$. Alors le processus $Y_t = f(t, X_t)$ est aussi un processus d'Itô, et sa différentielle stochastique est donnée par le Lemme d'Itô:
$$ dY_t = df(t, X_t) = \left( \frac{\partial f}{\partial t} + \mu(t, X_t) \frac{\partial f}{\partial x} + \frac{1}{2} \sigma(t, X_t)^2 \frac{\partial^2 f}{\partial x^2} \right) \, dt + \sigma(t, X_t) \frac{\partial f}{\partial x} \, dW_t $$
Le terme $\frac{1}{2} \sigma(t, X_t)^2 \frac{\partial^2 f}{\partial x^2} \, dt$ est la "correction d'Itô". Il est crucial et n'a pas d'équivalent dans la règle de la chaîne du calcul déterministe. Il apparaît en raison de la variation quadratique du mouvement brownien, où $(dW_t)^2 = dt$. Plus formellement, les règles de multiplication d'Itô sont:
*   $dt \cdot dt = 0$
*   $dt \cdot dW_t = 0$
*   $dW_t \cdot dW_t = dt$

Ces règles sont appliquées lors du développement de Taylor de $f(t, X_t)$ jusqu'au second ordre, et c'est le terme $(dX_t)^2$ qui génère la correction d'Itô.

### Application à la Dérivation du Modèle de Black-Scholes

Le Lemme d'Itô est indispensable pour la modélisation des prix d'actifs en finance. Un exemple emblématique est la dérivation de l'équation différentielle stochastique (EDS) pour le prix d'une option dans le modèle de Black-Scholes [[WIDGET:Reference:3]], [[WIDGET:Reference:8]].

Considérons le prix d'une action $S_t$ qui suit un mouvement brownien géométrique (GBM), une EDS couramment utilisée en finance:
$$ dS_t = \mu S_t \, dt + \sigma S_t \, dW_t $$
où $\mu$ est le taux de rendement espéré et $\sigma$ est la volatilité.
Supposons que le prix d'une option $V$ dépende du temps $t$ et du prix de l'action $S_t$, c'est-à-dire $V = V(t, S_t)$. Nous voulons trouver l'EDS pour $dV$. En appliquant le Lemme d'Itô à $V(t, S_t)$ avec $X_t = S_t$, $\mu(t, S_t) = \mu S_t$ et $\sigma(t, S_t) = \sigma S_t$:
$$ dV = \left( \frac{\partial V}{\partial t} + \mu S_t \frac{\partial V}{\partial S} + \frac{1}{2} (\sigma S_t)^2 \frac{\partial^2 V}{\partial S^2} \right) \, dt + \sigma S_t \frac{\partial V}{\partial S} \, dW_t $$
Cette équation est la base de l'équation aux dérivées partielles de Black-Scholes. En construisant un portefeuille auto-financé sans risque (en combinant l'option et l'action sous-jacente), et en appliquant le principe d'absence d'opportunité d'arbitrage, on peut montrer que le terme de dérive de $dV$ doit être égal à $rV \, dt$, où $r$ est le taux d'intérêt sans risque. Cela conduit à l'équation de Black-Scholes:
$$ \frac{\partial V}{\partial t} + r S \frac{\partial V}{\partial S} + \frac{1}{2} \sigma^2 S^2 \frac{\partial^2 V}{\partial S^2} - rV = 0 $$
Le Lemme d'Itô est donc un pont essentiel entre les dynamiques stochastiques des prix d'actifs et les équations aux dérivées partielles utilisées pour la valorisation des dérivés.

[[WIDGET:SolvedExercise:ito_lemma_gbm:Démonstration de l'application du Lemme d'Itô au mouvement brownien géométrique pour obtenir $d(\ln S_t)$]]