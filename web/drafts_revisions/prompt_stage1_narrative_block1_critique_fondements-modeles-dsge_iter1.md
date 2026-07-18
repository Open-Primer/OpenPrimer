You are the Narrative Critic Agent (Agent 4A). Review the generated block of text for the lesson:
---
## Introduction aux modèles DSGE

Les modèles d'équilibre général dynamique stochastique (DSGE) constituent l'épine dorsale de la macroéconomie moderne, offrant un cadre rigoureux pour l'analyse des phénomènes économiques complexes. Émergés des révolutions de la [[WIDGET:ConceptLink:nouvelle_macroeconomie_classique:Nouvelle macroéconomie classique]] et de la [[WIDGET:ConceptLink:nouvelle_macroeconomie_keynesienne:Nouvelle macroéconomie keynésienne]], ces modèles sont devenus des outils indispensables pour les chercheurs, les banques centrales et les institutions internationales dans leur quête de compréhension des cycles économiques, de la croissance à long terme et des effets des politiques économiques [[WIDGET:Reference:2]], [[WIDGET:Reference:5]].

Leur importance réside dans leur capacité à modéliser l'économie comme un système intégré où les décisions des agents économiques (ménages, firmes, gouvernement) sont prises de manière optimale et prospective, en tenant compte des chocs stochastiques et des interactions sur différents marchés. Cette approche micro-fondée permet non seulement d'expliquer les fluctuations agrégées, mais aussi d'évaluer de manière cohérente l'impact des politiques monétaires et budgétaires, en répondant à la célèbre [[WIDGET:ConceptLink:critique_de_lucas:Critique de Lucas]] [[WIDGET:Reference:10]]. En effet, en modélisant les comportements des agents de manière structurelle, les DSGE permettent de simuler des scénarios contrefactuels et d'anticiper comment les agents modifieraient leurs décisions face à un changement de régime politique.

[[WIDGET:Mermaid:dsge_structure_flow:Diagramme de flux simplifié de la structure d'un modèle DSGE]]

Cette leçon vise à vous familiariser avec les fondements théoriques et méthodologiques des modèles DSGE. À l'issue de ce module, vous devriez être capable de:
*   Comprendre la structure fondamentale et les hypothèses clés des modèles DSGE.
*   Maîtriser les concepts d'optimisation intertemporelle et d'équilibre général dans un contexte dynamique et stochastique.
*   Appréhender la pertinence et les limites des DSGE pour l'analyse des politiques économiques et la prévision.

## Les fondements microéconomiques: Agents représentatifs et optimisation intertemporelle

Au cœur de tout modèle DSGE se trouve une modélisation explicite des comportements des agents économiques, ancrée dans des principes microéconomiques. Plutôt que de postuler des relations agrégées *ad hoc*, les DSGE dérivent les dynamiques macroéconomiques de l'optimisation des agents individuels. Une simplification courante, bien que parfois critiquée, est l'utilisation de l'[[WIDGET:Glossary:agent_representatif:agent représentatif]]. Ce concept suppose que tous les ménages d'un même type (ou toutes les firmes d'un même secteur) sont identiques et peuvent être représentés par un seul agent "moyen" qui prend des décisions optimales. Cette hypothèse simplifie considérablement la modélisation en permettant d'agréger les comportements individuels sans avoir à résoudre un problème de distribution complexe.

### L'optimisation intertemporelle des ménages

Les ménages, en tant qu'agents représentatifs, sont confrontés à un problème d'[[WIDGET:ConceptLink:optimisation_intertemporelle:optimisation intertemporelle]] sous incertitude. Leur objectif est de maximiser leur utilité totale sur un horizon infini, en tenant compte du fait que la consommation et le loisir d'aujourd'hui affectent leurs possibilités futures. L'utilité future est généralement actualisée par un facteur de préférence temporelle, reflétant la préférence des agents pour la consommation présente par rapport à la consommation future. Le problème typique d'un ménage représentatif peut être formulé comme la maximisation de l'espérance de l'utilité actualisée:

$$
E_0 \sum_{t=0}^{\infty} \beta^t U(C_t, L_t)
$$

où $E_0$ est l'opérateur d'espérance conditionnelle à l'information disponible en $t=0$, $\beta \in (0,1)$ est le facteur d'actualisation, $U(\cdot)$ est la fonction d'utilité, $C_t$ est la consommation et $L_t$ est le loisir à la période $t$. Cette maximisation est soumise à une contrainte budgétaire intertemporelle qui relie la consommation, l'épargne, le revenu du travail et le revenu du capital.

Une fonction d'utilité couramment utilisée est la fonction d'utilité à aversion relative au risque constante (CRRA - Constant Relative Risk Aversion), souvent sous la forme:

$$
U(C_t, L_t) = \frac{C_t^{1-\sigma}}{1-\sigma} - \chi \frac{L_t^{1+\psi}}{1+\psi}
$$

où $\sigma > 0$ est l'inverse de l'élasticité de substitution intertemporelle de la consommation (et mesure l'aversion au risque), et $\psi > 0$ est l'inverse de l'élasticité de Frisch de l'offre de travail.

[[WIDGET:CustomFigure:crra_utility_function:Exemple graphique d'une fonction d'utilité CRRA pour la consommation]]

### L'optimisation intertemporelle des firmes

De manière similaire, les firmes représentatives cherchent à maximiser leurs profits (ou la valeur de la firme) sur un horizon infini. Elles le font en choisissant de manière optimale leurs niveaux de production, d'investissement, de capital et de travail, en fonction de la technologie disponible, des prix des intrants et des prix de vente de leurs produits. La technologie de production est généralement décrite par une fonction de production agrégée, telle que la fonction de production Cobb-Douglas:

$$
Y_t = A_t K_t^\alpha N_t^{1-\alpha}
$$

où $Y_t$ est la production, $A_t$ est la productivité totale des facteurs (un choc technologique stochastique), $K_t$ est le stock de capital, $N_t$ est le travail, et $\alpha \in (0,1)$ est la part du capital dans le revenu. Les firmes prennent leurs décisions en anticipant les chocs futurs et les politiques économiques, en formant des [[WIDGET:ConceptLink:anticipations_rationnelles:anticipations rationnelles]] [[WIDGET:Reference:3]], [[WIDGET:Reference:4]].

Ces problèmes d'optimisation, pour les ménages comme pour les firmes, sont résolus en utilisant des techniques de programmation dynamique, souvent sous la forme d'équations d'Euler qui caractérisent les conditions d'optimalité intertemporelle.
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