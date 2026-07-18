You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "interactiveComponents": [
    {
      "id": "dsge_structure_flow",
      "componentType": "Mermaid",
      "sectionAnchor": "## Modèles DSGE : Fondements et Structure",
      "props": {
        "code": "graph TD\n    A[Agents Économiques] --> B{Comportements Optimaux};\n    B --> C[Contraintes Budgétaires];\n    B --> D[Préférences];\n    C --> E[Équations de Comportement];\n    D --> E;\n    E --> F[Agrégation];\n    F --> G[Conditions d'Équilibre];\n    G --> H[Chocs Exogènes];\n    H --> I[Dynamique du Système];\n    I --> J[Variables Macroéconomiques];"
      }
    },
    {
      "id": "crra_utility_function",
      "componentType": "Image",
      "sectionAnchor": "## Les Agents Économiques et Leurs Comportements",
      "props": {
        "description": "Ce graphique illustre une fonction d'utilité à aversion relative au risque constante (CRRA) pour la consommation. L'axe des abscisses représente le niveau de consommation (C), tandis que l'axe des ordonnées représente le niveau d'utilité (U(C)). La courbe est concave, reflétant le principe de l'utilité marginale décroissante : chaque unité supplémentaire de consommation apporte un gain d'utilité de plus en plus faible. La concavité de la fonction est directement liée au paramètre d'aversion au risque, qui est constant pour toutes les tranches de consommation dans le cas CRRA. Différentes valeurs du paramètre d'aversion au risque modifieraient la courbure de la fonction, une aversion plus élevée se traduisant par une courbe plus fortement concave.",
        "title": "Fonction d'Utilité CRRA",
        "year": "2023"
      }
    },
    {
      "id": "budget_constraint_graph",
      "componentType": "Image",
      "sectionAnchor": "## Les Agents Économiques et Leurs Comportements",
      "props": {
        "description": "Ce graphique représente une contrainte budgétaire intertemporelle pour un ménage sur deux périodes. L'axe horizontal représente la consommation présente (C1) et l'axe vertical la consommation future (C2). La ligne droite descendante représente la contrainte budgétaire, dont la pente est déterminée par le taux d'intérêt réel. Tous les points sur ou en dessous de cette ligne sont des paniers de consommation réalisables. Les points d'intersection avec les axes indiquent la consommation maximale possible si toute la richesse est dépensée dans une seule période. La position et la pente de cette contrainte peuvent être affectées par des changements de revenu, de richesse initiale ou de taux d'intérêt.",
        "title": "Contrainte Budgétaire Intertemporelle",
        "year": "2023"
      }
    },
    {
      "id": "dsge_equilibrium_flow",
      "componentType": "Mermaid",
      "sectionAnchor": "## L'Équilibre Général dans les Modèles DSGE",
      "props": {
        "code": "graph TD\n    A[Décisions des Ménages] --> B{Offre de Travail};\n    A --> C{Demande de Biens de Consommation};\n    D[Décisions des Entreprises] --> E{Demande de Travail};\n    D --> F{Offre de Biens de Production};\n    B & E --> G[Marché du Travail];\n    C & F --> H[Marché des Biens];\n    G --> I[Salaires d'Équilibre];\n    H --> J[Prix d'Équilibre];\n    I & J --> K[Équilibre Général];\n    K --> L[Politiques Économiques];\n    L --> A;\n    L --> D;"
      }
    },
    {
      "id": "bellman_equation_explainer",
      "componentType": "Video",
      "sectionAnchor": "## La Résolution des Modèles DSGE",
      "props": {
        "title": "L'équation de Bellman et la programmation dynamique en économie",
        "year": "2020"
      }
    },
    {
      "id": "dsge_extensions_diagram",
      "componentType": "Image",
      "sectionAnchor": "## Extensions et Critiques des Modèles DSGE",
      "props": {
        "description": "Ce diagramme conceptuel illustre l'évolution et les principales extensions des modèles DSGE au fil du temps. Il pourrait montrer un noyau DSGE standard au centre, avec des branches s'étendant vers diverses améliorations et complexifications. Ces extensions incluraient, par exemple, l'introduction de frictions nominales (prix et salaires rigides), de frictions financières (marchés imparfaits, contraintes de crédit), d'hétérogénéité des agents (ménages et entreprises différents), de comportements non-rationnels (rationalité limitée), et l'intégration de données microéconomiques. Le diagramme mettrait en évidence comment ces ajouts visent à améliorer le réalisme et la capacité des modèles à reproduire les faits stylisés observés.",
        "title": "Évolution et Extensions des Modèles DSGE",
        "year": "2023"
      }
    },
    {
      "id": "dsge_modeling_cycle",
      "componentType": "Mermaid",
      "sectionAnchor": "## Le Cycle de Modélisation DSGE",
      "props": {
        "code": "graph LR\n    A[Observation des Faits Stylisés] --> B{Formulation du Modèle Théorique};\n    B --> C[Calibration/Estimation des Paramètres];\n    C --> D{Simulation et Analyse des Chocs};\n    D --> E[Validation et Évaluation];\n    E --> F[Implications pour les Politiques];\n    F --> A;"
      }
    }
  ]
}

Ensure:
1. Every anchor specified in the prompt is mapped.
2. Captions and descriptions have no sequential figure prefixes like "Figure 1:".
3. Biography component details (dates, Wikipedia link) are correct.
4. ZERO placeholders, draft markers, bracketed texts, or template values are present. Biographies, interactive elements, figures, and diagrams must be fully populated with real, high-quality, professional educational content in the target language. Absolutely no fake URLs, lorem ipsum text, or incomplete fields. Reject the block if any placeholder or skeletal text is detected.
5. CRITICAL MEDIA RULES:
   - Image components MUST NOT contain "url", "wikipediaUrl", "wikipediaLink", "imageUrl", or "year" properties.
   - Video components MUST NOT contain "url", "id", "provider", "unresolved", "wikipediaUrl", "wikipediaLink", or "imageUrl" properties.
   - Audio components MUST NOT contain "url", "unresolved", "wikipediaUrl", "wikipediaLink", or "imageUrl" properties.
   These fields are FORBIDDEN in the raw widgets JSON for Image, Video, and Audio. They are resolved automatically downstream by the external-resource-resolver pipeline using the component's title/searchQuery/description. Any media component missing these fields is CORRECT and must NOT be rejected. If a media component DOES contain any of these forbidden fields (even with a seemingly valid URL), that IS an error and should be flagged.
6. For other components (Quiz, SolvedExercise, UnsolvedExercise, FillInBlanks, Mermaid): "url", "wikipediaLink", "wikipediaUrl" can be null or omitted — this is acceptable. Do NOT reject those component types for missing URL fields.
7. For UnsolvedExercise components, the props must contain "title", "problem", and "correctAnswer". Do NOT reject them for missing "questions" or "tasks" as those are not part of the UnsolvedExercise props structure.

Return ONLY a valid JSON object matching widgetBlockAuditSchema:
```json
{
  "approved": boolean,
  "critique": "detailed feedback explaining what to fix globally, or empty if approved",
  "fields": [
    // If approved is false, list ONLY the fields/keys that are rejected. Do NOT include approved fields.
    {
      "field": "name of the field (e.g., 'interactiveComponents')",
      "approved": false,
      "critique": "detailed feedback explaining what to fix in this specific field"
    }
  ]
}
```

[REJECT-ONLY REPORTING MANDATE]
1. If approved is true: approved MUST be true, critique MUST be "", and fields MUST be empty.
2. If approved is false: fields MUST ONLY contain fields that are rejected (with approved set to false). Any approved field MUST be strictly omitted from the array.