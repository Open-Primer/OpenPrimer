## Introduction à la Mesure Neutre au Risque

La [[WIDGET:ConceptLink:finance_quantitative:finance quantitative]] est une discipline qui applique des outils mathématiques et statistiques avancés à la modélisation et à l'analyse des marchés financiers. Au cœur de cette discipline se trouve la problématique de la valorisation des actifs dérivés. Un actif dérivé, tel qu'une option ou un swap, tire sa valeur d'un ou plusieurs actifs sous-jacents (actions, taux d'intérêt, devises, etc.) et ses flux de trésorerie futurs sont souvent incertains. La question fondamentale est de déterminer un prix "juste" pour ces instruments, un prix qui reflète leur valeur intrinsèque sans permettre d'opportunités d'arbitrage.

L'absence d'[[WIDGET:Glossary:arbitrage:opportunité d'arbitrage]] est un principe fondateur en finance moderne. Il stipule qu'il ne devrait pas être possible de réaliser un profit sans risque et sans investissement initial. Dans un marché sans arbitrage, la valorisation des dérivés ne peut pas être arbitraire ; elle doit être cohérente avec les prix des actifs sous-jacents. C'est dans ce contexte que la notion de mesure neutre au risque émerge comme un concept central et élégant.

Intuitivement, la mesure neutre au risque (souvent notée Q) est une mesure de probabilité "fictive" sous laquelle le rendement espéré de tout actif financier est égal au taux sans risque. En d'autres termes, sous cette mesure, les investisseurs sont "neutres au risque", ce qui signifie qu'ils ne demandent aucune prime de risque pour détenir des actifs risqués. La beauté de cette approche est qu'elle permet de valoriser n'importe quel actif dérivé comme l'espérance de ses flux de trésorerie futurs actualisés au taux sans risque, sans avoir à modéliser explicitement les préférences de risque des investisseurs. Ce concept a été formalisé par des travaux pionniers, notamment ceux de [[WIDGET:RealPerson:black_scholes:Fischer Black, Myron Scholes et Robert Merton]] pour le modèle de Black-Scholes [[WIDGET:Reference:3]], [[WIDGET:Reference:12]].

[[WIDGET:Mermaid:flux_valorisation_derive:Diagramme illustrant le flux de valorisation des dérivés via la mesure neutre au risque]]

L'importance de la mesure neutre au risque est double :
1.  **Théorique :** Elle fournit un cadre rigoureux pour la valorisation sans arbitrage, reliant les prix des dérivés aux prix des sous-jacents de manière cohérente. Elle est la pierre angulaire du théorème fondamental de la valorisation sans arbitrage.
2.  **Pratique :** Elle simplifie considérablement les calculs de valorisation. Au lieu de devoir estimer des primes de risque complexes et subjectives, on peut se concentrer sur la modélisation de la dynamique des sous-jacents sous cette mesure particulière, puis calculer des espérances. Cela est particulièrement utile pour les méthodes numériques comme les simulations de Monte Carlo [[WIDGET:Reference:9]].

## Fondements: Mesure Équivalente et Densité de Radon-Nikodym

Pour comprendre la mesure neutre au risque, il est essentiel de saisir les concepts de mesure de probabilité équivalente et de densité de Radon-Nikodym.

Une **mesure de probabilité** est une fonction qui attribue une probabilité à chaque événement d'un espace mesurable, respectant les axiomes de Kolmogorov. Dans le contexte financier, nous travaillons généralement avec une mesure de probabilité "réelle" ou "historique", souvent notée P, qui décrit la probabilité des événements tels qu'ils se produisent dans le monde réel, reflétant les anticipations et les primes de risque des investisseurs.

Une **mesure de probabilité équivalente** Q par rapport à une mesure P (notée $Q \sim P$) est une autre mesure de probabilité sur le même espace mesurable telle que P et Q ont les mêmes ensembles de mesure nulle. Autrement dit, si un événement a une probabilité nulle sous P, il a également une probabilité nulle sous Q, et vice-versa. Cela signifie que les deux mesures "sont d'accord" sur ce qui est possible ou impossible. L'équivalence est cruciale car elle garantit que le passage à la mesure neutre au risque ne modifie pas les événements qui peuvent se produire (ou ne pas se produire) sur le marché.

Le lien mathématique entre deux mesures de probabilité équivalentes est établi par la **densité de Radon-Nikodym**. Si $Q \sim P$, alors il existe une fonction aléatoire non négative $Z$ (appelée densité de Radon-Nikodym ou dérivée de Radon-Nikodym) telle que pour tout événement $A$, la probabilité de $A$ sous Q peut être exprimée comme l'espérance de $Z$ sous P, conditionnée par $A$:

$$Q(A) = E_P[Z \cdot \mathbf{1}_A]$$

où $\mathbf{1}_A$ est la fonction indicatrice de l'événement $A$. Plus généralement, pour toute variable aléatoire intégrable $X$, l'espérance de $X$ sous Q peut être calculée comme l'espérance de $X \cdot Z$ sous P:

$$E_Q[X] = E_P[X \cdot Z]$$

La fonction $Z$ est souvent notée $dQ/dP$ et agit comme un "facteur de correction" qui ajuste les probabilités de P pour obtenir celles de Q. Dans le contexte de la finance quantitative, cette densité est étroitement liée au processus de Girsanov, qui permet de changer la mesure de probabilité sous laquelle un processus stochastique est une martingale [[WIDGET:Reference:7]], [[WIDGET:Reference:11]].

[[WIDGET:CustomFigure:radon_nikodym_formula:Formule de la densité de Radon-Nikodym pour le changement de mesure]]

Un changement de mesure est nécessaire pour passer d'une mesure historique (P) à une mesure neutre au risque (Q) pour plusieurs raisons fondamentales:
1.  **Élimination de la prime de risque :** Sous la mesure P, les rendements des actifs risqués incluent une prime de risque pour compenser les investisseurs pour l'incertitude. Sous la mesure Q, cette prime de risque est "supprimée" ou "absorbée" par le changement de mesure, de sorte que tous les actifs (actualisés au taux sans risque) ont le même rendement espéré que l'actif sans risque.
2.  **Valorisation sans arbitrage :** Le premier théorème fondamental de la valorisation sans arbitrage stipule qu'un marché est sans arbitrage si et seulement s'il existe une mesure de probabilité équivalente sous laquelle les prix des actifs actualisés sont des martingales [[WIDGET:Reference:4]], [[WIDGET:Reference:10]]. Cette mesure est précisément la mesure neutre au risque.
3.  **Simplification des calculs :** En transformant le problème de valorisation en un calcul d'espérance sous Q, on évite la nécessité de modéliser les préférences de risque individuelles des investisseurs, qui sont difficiles à observer et à quantifier.

La densité de Radon-Nikodym est donc l'outil mathématique qui permet ce passage crucial du "monde réel" (P) au "monde neutre au risque" (Q), transformant les probabilités de manière à ce que les prix actualisés des actifs deviennent des martingales.