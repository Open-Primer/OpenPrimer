You are the Narrative Critic Agent (Agent 4A). Review the generated block of text for the lesson:
---
### Identification et Décomposition des Fluctuations Macroéconomiques

L'analyse des cycles économiques réels, et plus généralement des fluctuations macroéconomiques, nécessite des outils statistiques et économétriques robustes pour distinguer les composantes sous-jacentes des séries temporelles. Les séries macroéconomiques observées, telles que le PIB, l'emploi ou l'investissement, sont en effet le résultat d'une combinaison de facteurs de long terme (tendance), de fluctuations de moyen terme (cycle) et de mouvements aléatoires de court terme (bruit). La capacité à séparer ces composantes est cruciale pour comprendre les dynamiques économiques et formuler des politiques appropriées.

Les économistes ont développé diverses techniques pour décomposer ces séries. Parmi les plus courantes, le [[WIDGET:ConceptLink:filtre_hodrick_prescott:filtre de Hodrick-Prescott (HP)]] est largement utilisé pour extraire la composante cyclique d'une série temporelle en minimisant une fonction de perte qui pénalise à la fois la variabilité du cycle et la variabilité de la tendance. Bien que populaire, il est important de noter que ce filtre peut introduire des distorsions, notamment aux extrémités des séries et en créant des cycles artificiels [[WIDGET:Reference:1]].

[[WIDGET:CustomFigure:hodrick_prescott_filter_example:Exemple de décomposition d'une série de PIB en tendance et cycle par le filtre de Hodrick-Prescott]]

Une alternative est le [[WIDGET:ConceptLink:filtre_baxter_king:filtre de Baxter-King (BK)]], qui est un filtre passe-bande. Il permet d'isoler les fluctuations d'une certaine fréquence, c'est-à-dire les cycles dont la durée se situe dans une plage spécifiée (par exemple, entre 6 et 32 trimestres pour les cycles économiques classiques). Contrairement au filtre HP, le filtre BK est un filtre à phase nulle, ce qui signifie qu'il ne décale pas les cycles dans le temps, mais il nécessite de tronquer la série aux extrémités.

L'[[WIDGET:Glossary:analyse_spectrale:analyse spectrale]], quant à elle, offre une perspective différente en examinant les séries temporelles dans le domaine fréquentiel. Elle permet d'identifier les fréquences dominantes des fluctuations et de quantifier l'importance relative de chaque composante cyclique. Cette méthode est particulièrement utile pour détecter des périodicités régulières ou des co-mouvements entre différentes séries à des fréquences spécifiques.

[[WIDGET:Mermaid:time_series_decomposition_process:Processus de décomposition d'une série temporelle macroéconomique]]

Ces méthodes sont essentielles pour la recherche empirique en macroéconomie, car elles permettent de préparer les données pour l'estimation de modèles et l'analyse des propriétés des cycles économiques. Elles aident à quantifier la volatilité des cycles et à étudier leur synchronisation entre pays ou secteurs.

### Chocs Stochastiques et Analyse de Réponse Impulsionnelle

Les modèles de cycles économiques réels (RBC) et leurs extensions, les modèles d'équilibre général dynamique stochastique (DSGE), postulent que les fluctuations macroéconomiques sont principalement dues à des chocs stochastiques exogènes. Ces chocs représentent des perturbations imprévues qui affectent l'économie.

On distingue plusieurs types de chocs stochastiques :
*   **Chocs technologiques :** Variations imprévues de la productivité totale des facteurs (PTF), comme une innovation majeure ou une catastrophe naturelle affectant la capacité de production. Ces chocs sont au cœur des modèles RBC [[WIDGET:Reference:13]].
*   **Chocs de préférences :** Changements dans les goûts ou les attitudes des ménages, par exemple, une augmentation soudaine du désir d'épargner ou de travailler.
*   **Chocs fiscaux :** Modifications inattendues des politiques gouvernementales, telles que des variations des taux d'imposition ou des dépenses publiques.
*   **Chocs monétaires :** Perturbations de la politique monétaire, comme des changements imprévus dans les taux d'intérêt directeurs ou la masse monétaire (plus pertinents dans les modèles Néo-Keynésiens).
*   **Chocs pétroliers ou de matières premières :** Variations des prix des intrants essentiels.

L'[[WIDGET:ConceptLink:analyse_reponse_impulsionnelle:analyse de réponse impulsionnelle (ARI)]] est une méthodologie clé pour quantifier et visualiser l'impact dynamique de ces chocs sur les variables macroéconomiques. Elle permet de tracer la trajectoire temporelle d'une variable économique en réponse à un choc unitaire (une déviation d'un écart-type) dans une autre variable, toutes choses égales par ailleurs.

La mise en œuvre de l'ARI se fait généralement dans le cadre de modèles économétriques comme les modèles à vecteurs autorégressifs (VAR) ou de modèles structurels comme les DSGE. Dans un modèle VAR, les variables sont traitées comme endogènes et leurs dynamiques sont expliquées par leurs propres valeurs passées et celles des autres variables du système. L'ARI dans un VAR permet d'estimer la réaction des variables à un choc sur l'un des termes d'erreur du modèle, souvent interprété comme un choc structurel après identification [[WIDGET:Reference:12]].

[[WIDGET:CustomFigure:impulse_response_function_example:Exemple de fonctions de réponse impulsionnelle d'un choc technologique sur le PIB et l'emploi]]

Dans les modèles DSGE, l'ARI est dérivée directement des équations structurelles du modèle. Elle illustre comment les agents optimisateurs réagissent aux chocs et comment ces réactions se propagent à travers l'économie au fil du temps. Par exemple, un choc technologique positif dans un modèle DSGE peut entraîner une augmentation temporaire de la production, de l'investissement et de l'emploi, suivie d'un retour progressif à l'équilibre de long terme. Des chercheurs comme [[WIDGET:RealPerson:smets_wouters:Smets et Wouters]] ont largement utilisé l'ARI pour analyser les effets des chocs dans leurs modèles DSGE estimés pour la zone euro [[WIDGET:Reference:11]].

L'ARI est un outil indispensable pour les macroéconomistes et les décideurs politiques, car elle fournit une compréhension quantitative des mécanismes de transmission des chocs et aide à évaluer l'efficacité potentielle des politiques de stabilisation.
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