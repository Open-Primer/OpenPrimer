You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "interactiveComponents": [
    {
      "id": "dsge_structure_flow",
      "componentType": "Mermaid",
      "sectionAnchor": "Diagramme de flux simplifié de la structure d'un modèle DSGE",
      "props": {
        "code": "graph TD\n    A[Chocs Exogènes] --> B(Agents Optimisateurs);\n    B --> C{Décisions Intertemporelles};\n    C --> D[Agrégation des Comportements];\n    D --> E(Équilibre Général);\n    E --> F[Dynamique des Variables Macroéconomiques];\n    F --> G(Réponses de Politique Économique);\n    G --> A;"
      }
    },
    {
      "id": "crra_utility_function",
      "componentType": "Image",
      "sectionAnchor": "Exemple graphique d'une fonction d'utilité CRRA pour la consommation",
      "props": {
        "description": "Ce graphique illustre une fonction d'utilité à aversion relative au risque constante (CRRA) pour la consommation. L'axe des abscisses représente le niveau de consommation, tandis que l'axe des ordonnées représente le niveau d'utilité. La courbe montre une utilité marginale décroissante de la consommation, ce qui signifie que chaque unité supplémentaire de consommation apporte un gain d'utilité de plus en plus faible. La concavité de la courbe reflète l'aversion au risque de l'agent, avec une courbure plus prononcée pour des valeurs plus élevées du coefficient d'aversion au risque.",
        "title": "Fonction d'utilité CRRA",
        "year": "2023"
      }
    },
    {
      "id": "budget_constraint_graph",
      "componentType": "Image",
      "sectionAnchor": "Représentation graphique d'une contrainte budgétaire intertemporelle pour un ménage",
      "props": {
        "description": "Ce graphique représente la contrainte budgétaire intertemporelle d'un ménage sur deux périodes. L'axe des abscisses représente la consommation présente (C1) et l'axe des ordonnées la consommation future (C2). La droite de contrainte budgétaire relie les points de consommation maximale possible dans chaque période, compte tenu des revenus et du taux d'intérêt. La pente de cette droite est déterminée par le taux d'intérêt, reflétant le coût d'opportunité de la consommation présente par rapport à la consommation future. Les points sur ou sous la droite sont accessibles au ménage.",
        "title": "Contrainte Budgétaire Intertemporelle",
        "year": "2023"
      }
    },
    {
      "id": "dsge_equilibrium_flow",
      "componentType": "Mermaid",
      "sectionAnchor": "Diagramme de flux de l'équilibre général dans un modèle DSGE",
      "props": {
        "code": "graph TD\n    A[Ménages] -- Offre de travail, Demande de biens, Épargne --> B(Entreprises);\n    B -- Demande de travail, Offre de biens, Investissement --> A;\n    A -- Demande de monnaie --> C(Banque Centrale);\n    B -- Demande de crédit --> C;\n    C -- Taux d'intérêt, Offre de monnaie --> A;\n    C -- Taux d'intérêt, Politique monétaire --> B;\n    D[Gouvernement] -- Dépenses publiques, Impôts --> A;\n    D -- Dépenses publiques, Subventions --> B;\n    A & B & C & D -- Interactions --> E{Équilibre Général};\n    E -- Ajustement des prix et quantités --> A;\n    E -- Ajustement des prix et quantités --> B;\n    E -- Ajustement des prix et quantités --> C;\n    E -- Ajustement des prix et quantités --> D;"
      }
    },
    {
      "id": "bellman_equation_explainer",
      "componentType": "Video",
      "sectionAnchor": "Explication détaillée de l'équation de Bellman et de la programmation dynamique",
      "props": {
        "title": "L'équation de Bellman et la programmation dynamique en économie",
        "year": "2023"
      }
    },
    {
      "id": "dsge_extensions_diagram",
      "componentType": "Image",
      "sectionAnchor": "Évolution et extensions des modèles DSGE",
      "props": {
        "description": "Ce diagramme conceptuel illustre l'évolution et les principales extensions des modèles DSGE depuis leur forme canonique. Il montre comment les modèles ont intégré des frictions nominales (prix et salaires rigides), des frictions réelles (coûts d'ajustement, marchés imparfaits), des agents hétérogènes, et des chocs financiers ou de confiance. Le diagramme met en évidence la complexification progressive des modèles pour mieux capturer les réalités économiques et les dynamiques observées.",
        "title": "Évolution des Modèles DSGE",
        "year": "2023"
      }
    },
    {
      "id": "dsge_modeling_cycle",
      "componentType": "Mermaid",
      "sectionAnchor": "Cycle de développement et d'application d'un modèle DSGE",
      "props": {
        "code": "graph TD\n    A[Spécification Théorique] --> B(Calibration/Estimation);\n    B --> C{Simulation et Analyse de Chocs};\n    C --> D[Validation Empirique];\n    D --> E(Analyse de Politique Économique);\n    E --> F(Communication des Résultats);\n    F --> A;"
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