You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "interactiveComponents": [
    {
      "id": "macro_evolution",
      "componentType": "Mermaid",
      "sectionAnchor": "Évolution des paradigmes en macroéconomie face à l'hétérogénéité",
      "props": {
        "code": "graph TD\n    A[Macroéconomie Traditionnelle] --> B{Hypothèses Homogènes};\n    B --> C[Agent Représentatif];\n    C --> D[Modèles DSGE Standard];\n    D --> E{Limites Observées};\n    E --> F[Crises Financières, Inégalités Croissantes];\n    F --> G[Montée de l'Hétérogénéité];\n    G --> H[Agents Hétérogènes];\n    H --> I[Modèles HANK/HAND];\n    I --> J[Impact sur la Politique Économique];\n    J --> K[Distribution des Revenus et Richesses];\n    J --> L[Réponses Politiques Différenciées];"
      }
    },
    {
      "id": "gini_coefficient_interpretation",
      "componentType": "Image",
      "sectionAnchor": "Interprétation visuelle du coefficient de Gini",
      "props": {
        "description": "Cette figure illustre l'interprétation visuelle du coefficient de Gini à travers la courbe de Lorenz. Le coefficient de Gini est défini comme le rapport de l'aire entre la ligne d'égalité parfaite et la courbe de Lorenz (aire A) sur l'aire totale sous la ligne d'égalité parfaite (aire A + aire B). Une valeur de Gini proche de zéro indique une distribution très égale, tandis qu'une valeur proche de un (ou 100%) indique une inégalité maximale. La figure met en évidence comment l'écart entre la courbe de Lorenz et la ligne d'égalité parfaite se traduit directement par la valeur du coefficient de Gini.",
        "title": "Interprétation du coefficient de Gini",
        "year": "2023"
      }
    },
    {
      "id": "lorenz_curve",
      "componentType": "Image",
      "sectionAnchor": "Représentation graphique de la courbe de Lorenz et de la ligne d'égalité parfaite",
      "props": {
        "description": "Cette image représente une courbe de Lorenz, un graphique utilisé pour illustrer la distribution des revenus ou des richesses au sein d'une population. L'axe des abscisses représente le pourcentage cumulé de la population, classé par ordre croissant de revenu ou de richesse, tandis que l'axe des ordonnées représente le pourcentage cumulé du revenu ou de la richesse totale détenue par cette population. La ligne droite diagonale, appelée ligne d'égalité parfaite, indique une distribution parfaitement égale, où chaque pourcentage de la population détient le même pourcentage de revenu. La courbe de Lorenz s'éloigne de cette ligne pour montrer le degré d'inégalité.",
        "title": "Courbe de Lorenz et égalité parfaite",
        "year": "2023"
      }
    },
    {
      "id": "pmc_distribution",
      "componentType": "Image",
      "sectionAnchor": "Distribution stylisée de la propension marginale à consommer en fonction du revenu",
      "props": {
        "description": "Cette figure stylisée représente la distribution de la propension marginale à consommer (PMC) en fonction du niveau de revenu des ménages. Elle illustre l'hypothèse courante en macroéconomie hétérogène selon laquelle les ménages à faible revenu ont généralement une PMC plus élevée, c'est-à-dire qu'ils dépensent une plus grande proportion de tout revenu supplémentaire qu'ils reçoivent. Inversement, les ménages à revenu élevé ont tendance à avoir une PMC plus faible, épargnant une plus grande partie de leurs revenus additionnels. Cette distribution hétérogène de la PMC a des implications significatives pour l'efficacité des politiques de relance budgétaire.",
        "title": "Distribution de la PMC selon le revenu",
        "year": "2023"
      }
    },
    {
      "id": "heterogeneous_monetary_policy",
      "componentType": "Mermaid",
      "sectionAnchor": "Canaux de transmission hétérogènes de la politique monétaire",
      "props": {
        "code": "graph TD\n    A[Politique Monétaire] --> B{Taux d'Intérêt};\n    B --> C[Impact sur les Ménages];\n    C --> C1[Ménages Endettés] --> C1a[Réduction du Service de la Dette] --> C1b[Augmentation de la Consommation];\n    C --> C2[Ménages Épargnants] --> C2a[Baisse des Revenus de l'Épargne] --> C2b[Réduction de la Consommation/Augmentation de l'Épargne];\n    B --> D[Impact sur les Entreprises];\n    D --> D1[Petites Entreprises] --> D1a[Accès au Crédit Plus Difficile] --> D1b[Investissement Réduit];\n    D --> D2[Grandes Entreprises] --> D2a[Coût du Capital Réduit] --> D2b[Investissement Accru];\n    C1b & C2b & D1b & D2b --> E[Effet Agrégé Hétérogène];\n    E --> F[Inflation, Emploi, Croissance];"
      }
    },
    {
      "id": "keynes_consumption",
      "componentType": "Quote",
      "sectionAnchor": "Citation de John Maynard Keynes sur l'importance de la consommation dans l'économie",
      "props": {
        "quote": "La consommation est le seul but et l'unique objet de toute activité économique.",
        "source": "John Maynard Keynes"
      }
    },
    {
      "id": "impact_heterogeneite",
      "componentType": "Image",
      "sectionAnchor": "Impact de l'hétérogénéité sur les agrégats macroéconomiques",
      "props": {
        "description": "Cette figure schématise l'impact de l'hétérogénéité des agents sur les agrégats macroéconomiques. Elle illustre comment les différences individuelles en termes de revenus, de richesses, de propensions à consommer ou d'accès au crédit peuvent modifier la réponse globale de l'économie aux chocs ou aux politiques. Par exemple, une politique de relance budgétaire peut avoir un effet multiplicateur plus important si elle cible des ménages à forte propension marginale à consommer, ce qui est une conséquence directe de l'hétérogénéité.",
        "title": "Impact de l'hétérogénéité sur les agrégats",
        "year": "2023"
      }
    },
    {
      "id": "defis_politiques_heterogeneite",
      "componentType": "Mermaid",
      "sectionAnchor": "Défis pour les décideurs politiques face à l'hétérogénéité",
      "props": {
        "code": "graph TD\n    A[Hétérogénéité des Agents] --> B{Défis pour les Politiques};\n    B --> C[Politique Monétaire];\n    C --> C1[Effets Distributionnels];\n    C --> C2[Transmission Inégale];\n    B --> D[Politique Budgétaire];\n    D --> D1[Ciblage des Mesures];\n    D --> D2[Efficacité des Stimuli];\n    B --> E[Politique Structurelle];\n    E --> E1[Réformes du Marché du Travail];\n    E --> E2[Éducation et Formation];\n    B --> F[Mesure et Données];\n    F --> F1[Besoin de Données Micro];\n    F --> F2[Modèles Plus Complexes];\n    C1 & C2 & D1 & D2 & E1 & E2 & F1 & F2 --> G[Objectif: Stabilité et Équité];"
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