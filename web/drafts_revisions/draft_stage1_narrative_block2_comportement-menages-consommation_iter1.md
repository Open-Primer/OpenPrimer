## L'Équation d'Euler et ses Implications

L'équation d'Euler, dérivée des conditions de premier ordre du problème de maximisation de l'utilité intertemporelle, est la pierre angulaire de la théorie de la consommation. Elle s'écrit comme suit :

$$u'(C_t) = \beta (1+r) u'(C_{t+1})$$

Cette équation fondamentale exprime la condition d'optimalité pour un ménage qui cherche à maximiser son utilité sur plusieurs périodes. Elle stipule que, à l'équilibre, l'utilité marginale de consommer une unité supplémentaire aujourd'hui ($u'(C_t)$) doit être égale à l'utilité marginale actualisée de reporter cette consommation à la période suivante. Le terme $\beta (1+r)$ représente le facteur par lequel l'utilité marginale future est pondérée. $\beta$ est le facteur d'escompte subjectif, reflétant la préférence pour le présent du ménage, tandis que $(1+r)$ est le facteur d'actualisation objectif lié au taux d'intérêt réel.

L'intuition économique est la suivante : si un ménage renonce à consommer une unité aujourd'hui, il perd $u'(C_t)$ d'utilité. En revanche, s'il épargne cette unité, elle lui rapportera $(1+r)$ unités à la période suivante, générant une utilité marginale de $(1+r)u'(C_{t+1})$. Cependant, cette utilité future est perçue avec un facteur d'escompte $\beta$. À l'optimum, le ménage ajuste sa consommation de sorte que le gain d'utilité marginale à consommer aujourd'hui soit exactement égal au gain d'utilité marginale actualisée à consommer demain. C'est la condition d'égalisation des utilités marginales actualisées de la consommation entre deux périodes [[WIDGET:Reference:4]].

[[WIDGET:ConceptLink:utilite_marginale:L'utilité marginale]] est la satisfaction supplémentaire qu'un individu retire de la consommation d'une unité supplémentaire d'un bien ou d'un service. Dans le contexte intertemporel, l'équation d'Euler assure que le ménage ne peut pas augmenter son utilité totale en transférant une unité de consommation d'une période à l'autre.

[[WIDGET:Mermaid:euler_intuition_flowchart:Intuition économique de l'équation d'Euler]]

```mermaid
graph TD
    A[Renoncer à consommer C_t] --> B{Perte d'utilité marginale: u'(C_t)};
    A --> C[Épargner l'unité];
    C --> D[Rendement: (1+r) unités à t+1];
    D --> E[Gain d'utilité marginale future: (1+r)u'(C_{t+1})];
    E --> F[Actualisation subjective: β(1+r)u'(C_{t+1})];
    B & F --> G{Égalisation à l'optimum: u'(C_t) = β(1+r)u'(C_{t+1})};
    G --> H[Pas d'amélioration possible par transfert de consommation];
```

Une implication majeure de l'équation d'Euler est le [[WIDGET:ConceptLink:lissage_consommation:lissage de la consommation]]. Sous des hypothèses standard d'utilité concave (utilité marginale décroissante), les ménages préfèrent une consommation relativement stable au fil du temps plutôt que des fluctuations importantes. L'équation d'Euler implique que les ménages vont chercher à maintenir leurs utilités marginales de consommation relativement constantes, ce qui se traduit par une consommation stable, même face à des chocs de revenu temporaires. Ce principe est au cœur des théories du revenu permanent de [[WIDGET:RealPerson:friedman:Milton Friedman]] et du cycle de vie de [[WIDGET:RealPerson:modigliani:Franco Modigliani]] [[WIDGET:Reference:2]].

En réponse aux chocs, l'équation d'Euler guide le comportement du ménage :
*   **Choc de revenu temporaire :** Un ménage recevant un revenu temporaire inattendu n'augmentera pas sa consommation de manière significative dans la période actuelle. Il épargnera une grande partie de ce revenu pour le répartir sur toutes les périodes futures, lissant ainsi l'impact du choc sur sa consommation.
*   **Choc de revenu permanent :** Un choc de revenu permanent aura un impact plus important sur la consommation actuelle et future, car la richesse totale du ménage est durablement modifiée.
*   **Choc de taux d'intérêt :** Une variation du taux d'intérêt réel modifie le "prix" de la consommation présente par rapport à la consommation future, ainsi que la valeur actualisée de la richesse du ménage. L'analyse de ces effets est cruciale et sera détaillée dans la section suivante.

[[WIDGET:CustomFigure:euler_equation_implications:Illustration des implications de l'équation d'Euler sur le lissage de la consommation]]

## Analyse des Effets de Richesse et de Substitution

Une variation du taux d'intérêt réel ($r$) a des conséquences complexes sur les décisions de consommation intertemporelle des ménages, car elle modifie à la fois le coût relatif de la consommation et la valeur de la richesse. Pour comprendre ces mécanismes, il est essentiel de distinguer l'[[WIDGET:Glossary:effet_substitution:effet de substitution]] et l'[[WIDGET:Glossary:effet_richesse:effet de richesse]].

### L'Effet de Substitution

L'effet de substitution capture le changement dans la consommation dû à une modification du prix relatif de la consommation présente par rapport à la consommation future, toutes choses égales par ailleurs (c'est-à-dire en maintenant le niveau d'utilité constant).
Lorsque le taux d'intérêt réel ($r$) augmente, la consommation présente ($C_t$) devient relativement plus chère par rapport à la consommation future ($C_{t+1}$). En effet, renoncer à consommer une unité aujourd'hui permet d'obtenir $(1+r)$ unités de consommation supplémentaires demain. Un $r$ plus élevé rend l'épargne plus attractive.
*   **Mécanisme :** Une augmentation de $r$ incite le ménage à substituer de la consommation présente par de la consommation future. Il réduit sa consommation actuelle pour épargner davantage et profiter d'un rendement plus élevé, ce qui lui permettra de consommer plus à l'avenir.
*   **Direction :** L'effet de substitution est toujours négatif pour la consommation présente. Une augmentation de $r$ conduit à une diminution de $C_t$ et une augmentation de $C_{t+1}$ (si l'utilité marginale de la consommation future est positive).

### L'Effet de Richesse

L'effet de richesse, également appelé effet de revenu, reflète le changement dans la consommation résultant d'une modification de la valeur actualisée des ressources totales du ménage (sa richesse totale sur l'horizon de vie).
Une variation du taux d'intérêt réel affecte la valeur présente des revenus futurs et de la richesse initiale du ménage.
*   **Pour un ménage prêteur (épargnant net) :** Une augmentation de $r$ rend ses revenus futurs (ou son épargne existante) plus précieux en termes de valeur présente. Le ménage devient effectivement plus riche. Cette augmentation de richesse l'incite à consommer davantage dans toutes les périodes, y compris la période présente.
*   **Pour un un ménage emprunteur (débiteur net) :** Une augmentation de $r$ rend le coût de ses dettes plus élevé et réduit la valeur présente nette de ses ressources. Le ménage devient effectivement plus pauvre. Cette diminution de richesse l'incite à réduire sa consommation dans toutes les périodes.
*   **Direction :** L'effet de richesse est ambigu pour la consommation présente. Il est positif pour les prêteurs et négatif pour les emprunteurs.

### Synthèse et Illustration

L'effet total d'une variation du taux d'intérêt réel sur la consommation présente est la somme de l'effet de substitution et de l'effet de richesse.
*   **Pour un prêteur :** L'effet de substitution pousse à réduire $C_t$, tandis que l'effet de richesse pousse à augmenter $C_t$. L'effet net sur $C_t$ est donc ambigu et dépend de l'ampleur relative des deux effets.
*   **Pour un emprunteur :** L'effet de substitution pousse à réduire $C_t$, et l'effet de richesse pousse également à réduire $C_t$. Dans ce cas, l'effet total sur $C_t$ est clairement négatif.

[[WIDGET:CustomFigure:effets_r_diagram:Représentation graphique des effets de substitution et de richesse d'une augmentation du taux d'intérêt]]

Ce diagramme illustre comment une augmentation du taux d'intérêt fait pivoter la contrainte budgétaire intertemporelle. L'effet de substitution est représenté par le mouvement le long d'une courbe d'indifférence vers un point où la consommation future est relativement plus élevée. L'effet de richesse est ensuite représenté par un déplacement parallèle de la contrainte budgétaire (virtuelle) vers une courbe d'indifférence plus élevée ou plus basse, selon que le ménage est prêteur ou emprunteur.

[[WIDGET:Video:intertemporal_choice_r:Explication des effets de richesse et de substitution sur la consommation intertemporelle]]

La compréhension de ces deux effets est cruciale pour analyser l'impact des politiques monétaires (qui influencent les taux d'intérêt) sur les décisions de consommation et d'épargne des ménages, et par extension, sur l'activité économique globale [[WIDGET:Reference:5]].