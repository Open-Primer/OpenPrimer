You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "interactiveComponents": [
    {
      "id": "option_sensitivity_factors",
      "componentType": "Mermaid",
      "sectionAnchor": "## Introduction aux Grecques",
      "props": {
        "code": "graph TD\n    A[Prix de l'Option] --> B(Prix du Sous-jacent)\n    A --> C(Volatilité Implicite)\n    A --> D(Temps à l'Échéance)\n    A --> E(Taux d'Intérêt Sans Risque)\n    A --> F(Dividendes Attendus)\n\n    B -- Delta --> G[Sensibilité au Prix]\n    B -- Gamma --> H[Sensibilité du Delta]\n    C -- Vega --> I[Sensibilité à la Volatilité]\n    D -- Theta --> J[Sensibilité au Temps]\n    E -- Rho --> K[Sensibilité aux Taux]\n    F -- Rho --> K"
      }
    },
    {
      "id": "delta_call_graph",
      "componentType": "Image",
      "sectionAnchor": "## Delta: Mesure de la sensibilité au prix du sous-jacent",
      "props": {
        "description": "Ce graphique représente l'évolution du Delta d'une option d'achat européenne en fonction du prix du sous-jacent. Il montre comment le Delta, qui mesure la sensibilité du prix de l'option aux variations du prix du sous-jacent, passe progressivement de 0 (pour les options profondément hors de la monnaie) à 1 (pour les options profondément dans la monnaie), avec une pente maximale lorsque l'option est à la monnaie.",
        "title": "Évolution du Delta d'une option d'achat",
        "year": "2023"
      }
    },
    {
      "id": "gamma_option_graph",
      "componentType": "Image",
      "sectionAnchor": "## Gamma: Mesure de la convexité",
      "props": {
        "description": "Ce graphique illustre la variation du Gamma d'une option en fonction du prix du sous-jacent. Le Gamma, qui mesure la sensibilité du Delta aux variations du prix du sous-jacent, atteint son pic lorsque l'option est à la monnaie (prix du sous-jacent proche du prix d'exercice), et diminue à mesure que l'option s'éloigne de la monnaie, que ce soit profondément dans la monnaie ou hors de la monnaie.",
        "title": "Évolution du Gamma d'une option",
        "year": "2023"
      }
    },
    {
      "id": "vega_option_graph",
      "componentType": "Image",
      "sectionAnchor": "## Vega: Mesure de la sensibilité à la volatilité",
      "props": {
        "description": "Ce graphique représente l'évolution du Vega d'une option en fonction du prix du sous-jacent et de la maturité. Le Vega, qui mesure la sensibilité du prix de l'option aux variations de la volatilité implicite, est généralement plus élevé pour les options à la monnaie et celles ayant une longue durée de vie, car elles sont plus sensibles aux changements de volatilité.",
        "title": "Évolution du Vega d'une option",
        "year": "2023"
      }
    },
    {
      "id": "theta_time_decay",
      "componentType": "Mermaid",
      "sectionAnchor": "## Theta: Mesure de la décroissance temporelle",
      "props": {
        "code": "graph TD\n    A[Valeur Temps de l'Option] --> B{Temps restant à l'échéance}\n    B -- Longue échéance --> C[Décroissance lente du Theta]\n    B -- Courte échéance --> D[Décroissance rapide du Theta]\n    C --> E(Perte de valeur temps progressive)\n    D --> F(Perte de valeur temps accélérée)\n    E -- Theta faible --> G[Impact modéré sur le prix]\n    F -- Theta élevé --> H[Impact fort sur le prix]"
      }
    },
    {
      "id": "hedging_challenges",
      "componentType": "Image",
      "sectionAnchor": "## Application des Grecques à la couverture",
      "props": {
        "description": "Cette illustration schématique présente les principaux défis rencontrés dans la mise en œuvre d'une couverture dynamique pour les options. Elle met en évidence les coûts de transaction associés aux ajustements fréquents de la position de couverture, le risque de saut (gap risk) où le prix du sous-jacent change brusquement entre deux ajustements, et l'impact de la liquidité du marché sur la capacité à exécuter les transactions de couverture.",
        "title": "Défis de la couverture dynamique",
        "year": "2023"
      }
    },
    {
      "id": "grecques_role_summary",
      "componentType": "Mermaid",
      "sectionAnchor": "## Synthèse et importance des Grecques",
      "props": {
        "code": "graph TD\n    A[Grecques] --> B{Mesure de Sensibilité}\n    B --> C[Delta: Prix du Sous-jacent]\n    B --> D[Gamma: Accélération du Delta]\n    B --> E[Vega: Volatilité]\n    B --> F[Theta: Temps]\n    B --> G[Rho: Taux d'Intérêt]\n\n    C --> H(Couverture directionnelle)\n    D --> I(Couverture de convexité)\n    E --> J(Couverture de volatilité)\n    F --> K(Gestion de la décroissance temporelle)\n    G --> L(Couverture de taux)\n\n    H & I & J & K & L --> M[Gestion des Risques d'Options]"
      }
    },
    {
      "id": "wilmott_greeks",
      "componentType": "Quote",
      "sectionAnchor": "## Synthèse et importance des Grecques",
      "props": {
        "quote": "The Greeks are the most important things in options trading. They tell you how your portfolio will react to changes in the market, and they are essential for managing risk.",
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