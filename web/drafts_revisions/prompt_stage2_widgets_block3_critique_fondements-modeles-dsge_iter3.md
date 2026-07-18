You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "interactiveComponents": [
    {
      "id": "dsge_structure_flow",
      "componentType": "Mermaid",
      "sectionAnchor": "## Modèles DSGE et leurs applications",
      "props": {
        "code": "graph TD\n    A[Agents Économiques] --> B(Optimisation Intertemporelle)\n    B --> C{Chocs Stochastiques}\n    C --> D[Équations de Comportement]\n    D --> E(Conditions d'Équilibre Général)\n    E --> F[Dynamique des Variables Macroéconomiques]\n    F --> G(Analyse des Politiques)\n    G --> A"
      }
    },
    {
      "id": "crra_utility_function",
      "componentType": "Image",
      "sectionAnchor": "## Modèles DSGE et leurs applications",
      "props": {
        "description": "Ce graphique illustre une fonction d'utilité à aversion relative au risque constante (CRRA) pour la consommation. L'axe des abscisses représente le niveau de consommation, tandis que l'axe des ordonnées représente le niveau d'utilité. La courbe est concave, reflétant le principe de l'utilité marginale décroissante : chaque unité supplémentaire de consommation apporte un gain d'utilité de plus en plus faible. La concavité de la fonction est directement liée au coefficient d'aversion au risque, qui est constant pour ce type de fonction, signifiant que la propension d'un individu à prendre des risques ne change pas avec sa richesse.",
        "title": "Fonction d'utilité CRRA",
        "year": "2023"
      }
    },
    {
      "id": "budget_constraint_graph",
      "componentType": "Image",
      "sectionAnchor": "## Modèles DSGE et leurs applications",
      "props": {
        "description": "Ce graphique représente la contrainte budgétaire intertemporelle d'un ménage sur deux périodes. L'axe horizontal représente la consommation présente (C1) et l'axe vertical la consommation future (C2). La droite de contrainte budgétaire, de pente négative, illustre le compromis entre la consommation présente et future, compte tenu du revenu actuel, du revenu futur anticipé et du taux d'intérêt. Tout point sur cette droite représente une combinaison de consommations présente et future que le ménage peut se permettre, en empruntant ou en épargnant.",
        "title": "Contrainte budgétaire intertemporelle",
        "year": "2023"
      }
    },
    {
      "id": "dsge_equilibrium_flow",
      "componentType": "Mermaid",
      "sectionAnchor": "## Modèles DSGE et leurs applications",
      "props": {
        "code": "graph TD\n    A[Ménages: Optimisation de l'Utilité] --> B(Entreprises: Maximisation du Profit)\n    B --> C{Marchés: Équilibre Offre/Demande}\n    C --> D[Gouvernement/Banque Centrale: Politiques]\n    D --> A\n    C -- Flux de Biens et Services --> B\n    C -- Flux de Travail et Capital --> A\n    A -- Épargne/Investissement --> C"
      }
    },
    {
      "id": "bellman_equation_explainer",
      "componentType": "Video",
      "sectionAnchor": "## Modèles DSGE et leurs applications",
      "props": {
        "title": "Explication de l'équation de Bellman et de la programmation dynamique",
        "year": "2022"
      }
    },
    {
      "id": "dsge_extensions_diagram",
      "componentType": "Image",
      "sectionAnchor": "## Modèles DSGE et leurs applications",
      "props": {
        "description": "Ce diagramme conceptuel illustre l'évolution et les extensions courantes des modèles DSGE au-delà de leur forme canonique. Il montre comment les modèles de base ont été enrichis pour inclure des éléments tels que les frictions financières, l'hétérogénéité des agents, les marchés du travail imparfaits, les chocs exogènes plus sophistiqués (par exemple, chocs pétroliers, chocs de productivité), et l'intégration de l'économie ouverte. Ces extensions visent à améliorer la capacité des modèles à reproduire les dynamiques macroéconomiques observées et à évaluer l'impact de politiques plus complexes.",
        "title": "Évolution et extensions des modèles DSGE",
        "year": "2023"
      }
    },
    {
      "id": "dsge_modeling_cycle",
      "componentType": "Mermaid",
      "sectionAnchor": "## Modèles DSGE et leurs applications",
      "props": {
        "code": "graph LR\n    A[Spécification Théorique] --> B(Calibration/Estimation)\n    B --> C{Simulation Numérique}\n    C --> D[Analyse des Politiques]\n    D --> E(Validation Empirique)\n    E --> A"
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