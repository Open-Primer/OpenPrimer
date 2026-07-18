You are the Narrative Critic Agent (Agent 4A). Review the generated block of text for the lesson:
---
### Contraintes budgétaires intertemporelles et conditions d'équilibre

L'optimisation des ménages et des firmes, telle que décrite précédemment, est intrinsèquement liée à leurs contraintes budgétaires intertemporelles. Ces contraintes définissent l'ensemble des choix réalisables pour les agents économiques sur l'ensemble de leur horizon temporel, en tenant compte de leurs revenus, de leurs dépenses et de leurs possibilités d'emprunt ou d'épargne.

Pour un ménage représentatif, la contrainte budgétaire intertemporelle stipule que la valeur actualisée de sa consommation totale ne peut excéder la valeur actualisée de ses revenus (salaires, revenus du capital) plus sa richesse initiale. En d'autres termes, un ménage ne peut pas dépenser plus qu'il ne gagne sur l'ensemble de sa vie, en tenant compte des intérêts. Formellement, elle peut s'écrire, en l'absence de transferts gouvernementaux et avec un actif financier unique (par exemple, des obligations) :

$$
\sum_{t=0}^{\infty} \frac{C_t}{(1+r_t)^t} \le A_0 + \sum_{t=0}^{\infty} \frac{W_t N_t + R_t K_t}{(1+r_t)^t}
$$

où $C_t$ est la consommation, $r_t$ le taux d'intérêt réel, $A_0$ la richesse initiale, $W_t$ le salaire réel, $N_t$ le travail offert, $R_t$ le rendement réel du capital et $K_t$ le capital possédé. Cette formulation met en évidence le rôle crucial du [[WIDGET:ConceptLink:taux_interet_reel:taux d'intérêt réel]] comme prix intertemporel, influençant les décisions d'épargne et d'investissement [[WIDGET:Reference:2]].

[[WIDGET:CustomFigure:budget_constraint_graph:Représentation graphique d'une contrainte budgétaire intertemporelle pour un ménage]]

De même, pour une firme représentative, la contrainte budgétaire intertemporelle est souvent implicite dans sa décision de maximisation de la valeur. La valeur actualisée des profits futurs de la firme doit être suffisante pour couvrir ses investissements et distribuer des dividendes aux actionnaires. L'équation d'accumulation du capital est une composante clé de cette contrainte :

$$
K_{t+1} = (1-\delta)K_t + I_t
$$

où $K_t$ est le stock de capital, $\delta$ est le taux de dépréciation du capital, et $I_t$ est l'investissement. Les décisions d'investissement $I_t$ sont prises pour maximiser la valeur présente des profits futurs, en tenant compte du coût du capital et des rendements attendus [[WIDGET:Reference:13]].

L'équilibre général d'un modèle DSGE est atteint lorsque tous les agents économiques (ménages, firmes, et potentiellement le gouvernement et le secteur extérieur) optimisent leurs fonctions objectives sous leurs contraintes budgétaires respectives, et que tous les marchés (biens et services, travail, capital, monnaie) s'équilibrent simultanément. Cela implique que les prix et les quantités sont tels qu'il n'y a pas d'incitation pour un agent à modifier son comportement, étant donné le comportement des autres agents. Les conditions d'optimalité des agents, souvent exprimées par des équations d'Euler (par exemple, l'[[WIDGET:Glossary:euler_equation:équation d'Euler]] pour la consommation), et les contraintes budgétaires intertemporelles sont les piliers de cet équilibre. L'interaction de ces éléments détermine les trajectoires dynamiques des variables macroéconomiques clés, telles que la production, la consommation, l'investissement, l'emploi et l'inflation [[WIDGET:Reference:5]].

[[WIDGET:Mermaid:dsge_equilibrium_flow:Diagramme de flux de l'équilibre général dans un modèle DSGE]]

### Méthodes de résolution: La programmation dynamique

La résolution des problèmes d'optimisation intertemporelle sous incertitude, qui sont au cœur des modèles DSGE, repose fondamentalement sur la [[WIDGET:ConceptLink:programmation_dynamique:programmation dynamique]]. Développée par [[WIDGET:RealPerson:richard_bellman:Richard Bellman]], cette approche permet de décomposer un problème complexe en une séquence de problèmes plus simples, résolus de manière récursive. Elle est particulièrement adaptée aux situations où les décisions prises aujourd'hui affectent les opportunités futures.

Le principe central de la programmation dynamique est le principe d'optimalité de Bellman, qui stipule qu'une politique optimale a la propriété qu'à tout instant $t$, quelles que soient les décisions passées, les décisions restantes doivent constituer une politique optimale par rapport à l'état résultant des décisions passées. Cela conduit à la formulation de la fonction de valeur et de l'équation de Bellman.

La **fonction de valeur** $V(S_t)$ représente la valeur maximale (utilité ou profit actualisé) qu'un agent peut obtenir à partir d'un état $S_t$ donné, en suivant une politique optimale pour toutes les périodes futures. L'état $S_t$ regroupe toutes les variables pertinentes qui affectent les décisions futures de l'agent (par exemple, le stock de capital pour une firme, ou la richesse pour un ménage).

L'**équation de Bellman** exprime la fonction de valeur de manière récursive. Elle indique que la valeur maximale à l'instant $t$ est égale à la récompense immédiate (utilité ou profit) de la décision optimale prise à l'instant $t$, plus la valeur actualisée de la valeur maximale future (espérée), compte tenu de l'état résultant de cette décision. Pour un problème de maximisation, l'équation de Bellman s'écrit généralement sous la forme:

$$
V(S_t) = \max_{C_t, I_t, \dots} \left\{ U(C_t, I_t, \dots) + \beta E_t[V(S_{t+1})] \right\}
$$

où $U(\cdot)$ est la fonction d'utilité ou de profit instantanée, $\beta$ est le facteur d'actualisation, et $E_t[V(S_{t+1})]$ est l'espérance de la fonction de valeur future, conditionnelle à l'information disponible en $t$. La résolution de cette équation fonctionnelle permet de déterminer la politique optimale, c'est-à-dire les règles de décision qui maximisent la fonction de valeur à chaque période et pour chaque état possible [[WIDGET:Reference:4]], [[WIDGET:Reference:10]].

[[WIDGET:Video:bellman_equation_explainer:Explication détaillée de l'équation de Bellman et de la programmation dynamique]]
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