You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "interactiveComponents": [
    {
      "id": "option_sensitivity_factors",
      "componentType": "Mermaid",
      "sectionAnchor": "## Les Grecques: Mesures de Sensibilité des Options",
      "props": {
        "code": "graph TD\n    A[Prix de l'Option] --> B{Facteurs Influents};\n    B --> C[Prix du Sous-Jacent];\n    B --> D[Volatilité Implicite];\n    B --> E[Temps Restant à l'Échéance];\n    B --> F[Taux d'Intérêt];\n    B --> G[Dividendes];\n\n    C --> H[Delta];\n    C --> I[Gamma];\n    D --> J[Vega];\n    E --> K[Theta];\n    F --> L[Rho];\n    G --> M[Rho (impact indirect)];\n\n    H[Delta] -- Mesure --> N[Sensibilité au Prix du Sous-Jacent];\n    I[Gamma] -- Mesure --> O[Sensibilité du Delta];\n    J[Vega] -- Mesure --> P[Sensibilité à la Volatilité];\n    K[Theta] -- Mesure --> Q[Sensibilité au Temps];\n    L[Rho] -- Mesure --> R[Sensibilité au Taux d'Intérêt];"
      }
    },
    {
      "id": "delta_call_graph",
      "componentType": "Image",
      "sectionAnchor": "## Delta: La Sensibilité au Prix du Sous-Jacent",
      "props": {
        "description": "Ce graphique illustre l'évolution du Delta d'une option d'achat (call) en fonction du prix du sous-jacent. Il montre que le Delta d'une option d'achat varie de 0 (lorsque l'option est profondément hors de la monnaie) à 1 (lorsque l'option est profondément dans la monnaie), avec une pente plus raide autour du prix d'exercice, indiquant une sensibilité accrue à la monnaie.",
        "title": "Évolution du Delta d'une Option d'Achat",
        "year": "2023"
      }
    },
    {
      "id": "gamma_option_graph",
      "componentType": "Image",
      "sectionAnchor": "## Gamma: La Sensibilité du Delta",
      "props": {
        "description": "Ce graphique représente l'évolution du Gamma d'une option en fonction du prix du sous-jacent. Le Gamma est maximal lorsque l'option est à la monnaie (prix du sous-jacent proche du prix d'exercice), et diminue à mesure que l'option s'éloigne de la monnaie, que ce soit profondément dans la monnaie ou profondément hors de la monnaie. Cela indique que le Delta est le plus sensible aux changements du prix du sous-jacent lorsque l'option est à la monnaie.",
        "title": "Évolution du Gamma d'une Option",
        "year": "2023"
      }
    },
    {
      "id": "vega_option_graph",
      "componentType": "Image",
      "sectionAnchor": "## Vega: La Sensibilité à la Volatilité Implicite",
      "props": {
        "description": "Ce graphique montre l'évolution du Vega d'une option en fonction du prix du sous-jacent et de la maturité. Le Vega est généralement plus élevé pour les options à la monnaie et pour celles ayant une longue durée de vie, car la volatilité a un impact plus significatif sur leur valeur. Il diminue à mesure que l'option s'approche de l'échéance ou s'éloigne de la monnaie.",
        "title": "Évolution du Vega d'une Option",
        "year": "2023"
      }
    },
    {
      "id": "theta_time_decay",
      "componentType": "Mermaid",
      "sectionAnchor": "## Theta: La Sensibilité au Temps",
      "props": {
        "code": "graph TD\n    A[Temps Restant à l'Échéance] --> B{Valeur Temps de l'Option};\n    B --> C[Décroissance Lente (Longue Échéance)];\n    B --> D[Accélération de la Décroissance (Proche Échéance)];\n\n    C -- Theta Faible --> E[Perte de Valeur Temps Graduelle];\n    D -- Theta Élevé --> F[Perte de Valeur Temps Rapide];\n\n    style A fill:#f9f,stroke:#333,stroke-width:2px\n    style B fill:#ccf,stroke:#333,stroke-width:2px\n    style C fill:#afa,stroke:#333,stroke-width:2px\n    style D fill:#faa,stroke:#333,stroke-width:2px"
      }
    },
    {
      "id": "hedging_challenges",
      "componentType": "Image",
      "sectionAnchor": "## Défis de la Couverture Dynamique",
      "props": {
        "description": "Cette illustration schématique présente les principaux défis associés à la couverture dynamique des options. Elle met en évidence les coûts de transaction récurrents liés aux ajustements fréquents de la position de couverture, ainsi que le risque de saut (gap risk) où le prix du sous-jacent peut changer brusquement, rendant la couverture inefficace ou coûteuse.",
        "title": "Défis de la Couverture Dynamique",
        "year": "2023"
      }
    },
    {
      "id": "grecques_role_summary",
      "componentType": "Mermaid",
      "sectionAnchor": "## Conclusion: L'Importance des Grecques",
      "props": {
        "code": "graph TD\n    A[Grecques] --> B{Outils de Gestion des Risques};\n    B --> C[Delta];\n    B --> D[Gamma];\n    B --> E[Vega];\n    B --> F[Theta];\n    B --> G[Rho];\n\n    C -- Mesure --> H[Risque Directionnel];\n    D -- Mesure --> I[Risque de Volatilité du Delta];\n    E -- Mesure --> J[Risque de Volatilité Implicite];\n    F -- Mesure --> K[Risque Temporel];\n    G -- Mesure --> L[Risque de Taux d'Intérêt];\n\n    H -- Permet --> M[Couverture Delta-Neutre];\n    I -- Permet --> N[Couverture Gamma-Neutre];\n    J -- Permet --> O[Couverture Vega-Neutre];\n    K -- Permet --> P[Gestion de la Décroissance Temporelle];\n    L -- Permet --> Q[Gestion du Risque de Taux];\n\n    M & N & O & P & Q --> R[Optimisation du Portefeuille d'Options];"
      }
    },
    {
      "id": "wilmott_greeks",
      "componentType": "Quote",
      "sectionAnchor": "## Conclusion: L'Importance des Grecques",
      "props": {
        "quote": "Les Grecques sont le langage des options. Si vous ne les comprenez pas, vous ne comprenez pas les options.",
        "source": "Paul Wilmott"
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