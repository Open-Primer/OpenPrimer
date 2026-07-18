You are the Narrative Critic Agent (Agent 4A). Review the generated block of text for the lesson:
---

## L'Équation d'Euler et ses Implications
L'équation d'Euler, dérivée des conditions de premier ordre du problème de maximisation de l'utilité intertemporelle, est la pierre angulaire de la théorie de la consommation. Elle s'écrit comme suit :

$$u'(C_t) = \beta (1+r) u'(C_{t+1})$$

Cette équation fondamentale exprime la condition d'optimalité pour un ménage qui cherche à maximiser son utilité sur plusieurs périodes. Elle stipule que, à l'équilibre, l'utilité marginale de consommer une unité supplémentaire aujourd'hui ($u'(C_t)$) doit être égale à l'utilité marginale actualisée de reporter cette consommation à la période suivante. Le terme $\beta (1+r)$ représente le facteur par lequel l'utilité marginale future est pondérée. $\beta$ est le facteur d'escompte subjectif, reflétant la préférence pour le présent du ménage, tandis que $(1+r)$ est le facteur d'actualisation objectif lié au taux d'intérêt réel.

L'intuition économique est la suivante : si un ménage renonce à consommer une unité aujourd'hui, il perd $u'(C_t)$ d'utilité. En revanche, s'il épargne cette unité, elle lui rapportera $(1+r)$ unités à la période suivante, générant une utilité marginale de $(1+r)u'(C_{t+1})$. Cependant, cette utilité future est perçue avec un facteur d'escompte $\beta$. À l'optimum, le ménage ajuste sa consommation de sorte que le gain d'utilité marginale à consommer aujourd'hui soit exactement égal au gain d'utilité marginale actualisée à consommer demain. C'est la condition d'égalisation des utilités marginales actualisées de la consommation entre deux périodes [[WIDGET:Reference:4]].

[[WIDGET:ConceptLink:utilite_marginale:L'utilité marginale]] est la satisfaction supplémentaire qu'un individu retire de la consommation d'une unité supplémentaire d'un bien ou d'un service. Dans le contexte intertemporel, l'équation d'Euler assure que le ménage ne peut pas augmenter son utilité totale en transférant une unité de consommation d'une période à l'autre.

[[WIDGET:Mermaid:euler_intuition_flowchart:Intuition économique de l'équation d'Euler]]

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
---

Check checkpoints:
1. Zero-placeholders.
2. Accurate academic density and level-appropriate language.
3. Strict MDX/JSX safety (absolutely no raw custom component or custom JSX/HTML tags like <ConceptLink>, <RealPerson>, <Glossary>, <sup id="cite-...">(...)</sup>, or <sup>(...)</sup> inline in prose. All interactive elements and special links must strictly use the [[WIDGET:id]] anchor format. For bibliographic citations, they MUST strictly use the [[WIDGET:Reference:num]] anchor format, e.g. [[WIDGET:Reference:1]]. Reject any block containing raw HTML citation tags or raw bracketed citation anchors like [ref1], [1] in text. Reject any block containing raw Mermaid diagram code (e.g. wrapped in ```mermaid ... ```). All diagrams must be anchored as [[WIDGET:Mermaid:id:description]] anchors).
4. No figure prefixes like "Figure 1:" in visual captions.
5. NO EXTERNAL WIDGET CAPTIONS/DESCRIPTIONS IN NARRATIVE PROSE: REJECT the block if there are any external descriptions, comments, or caption text (such as "*Description: ...*", "Caption: ...", "Légende: ...") placed directly in the narrative prose outside, above, or below a widget anchor (like Image, CustomFigure, Video, Audio, Mermaid, etc.). The description must be strictly inside the anchor itself as the third parameter (e.g. [[WIDGET:Image:id:description]] or [[WIDGET:CustomFigure:id:description]] or [[WIDGET:Video:id:description]] or [[WIDGET:Audio:id:description]] or [[WIDGET:Mermaid:id:description]]).
6. Presence of pedagogical widgets (MANDATORY — REJECT if not met): The block MUST contain ALL of the following:
   a) At least 2-3 inline hover-cards: [[WIDGET:RealPerson]], [[WIDGET:ConceptLink]], or [[WIDGET:Glossary]] anchors for key figures/concepts.
   b) At least 1 image or figure anchor: [[WIDGET:Image:id:description]] or [[WIDGET:CustomFigure:id:description]] showing a relevant diagram, illustration, or scientific figure.
   c) At least 1 structural/diagrammatic widget: [[WIDGET:Mermaid:id:description]] (for graphs, timelines, flowcharts) OR [[WIDGET:Video:id:description]] OR [[WIDGET:DataChart:id]] OR [[WIDGET:InteractiveDiagram:id]].
   A block with ONLY inline hover-cards and no Image/Mermaid/Video block widgets MUST be REJECTED. Count explicitly: if (b) is missing → reject; if (c) is missing → reject.



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