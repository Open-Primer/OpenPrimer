You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "interactiveComponents": [
    {
      "id": "macro_evolution",
      "componentType": "Mermaid",
      "sectionAnchor": "Évolution des paradigmes macroéconomiques",
      "props": {
        "code": "graph TD\n    A[Macroéconomie Traditionnelle] --> B{Hypothèses Homogènes};\n    B --> C[Agent Représentatif];\n    C --> D[Modèles DSGE Standard];\n    D --> E{Limites Observées};\n    E --> F[Crises Financières, Inégalités Croissantes];\n    F --> G[Montée de l'Hétérogénéité];\n    G --> H{Agents Hétérogènes};\n    H --> I[Modèles HANK/HAND];\n    I --> J[Micro-fondations Détaillées];\n    J --> K[Politiques Plus Nuancées];\n    K --> L[Comportements Non-Linéaires];\n    L --> M[Nouvelles Perspectives];"
      }
    },
    {
      "id": "gini_coefficient_interpretation",
      "componentType": "CustomFigure",
      "sectionAnchor": "Mesure de l'inégalité: Le coefficient de Gini",
      "props": {
        "title": "Interprétation visuelle du coefficient de Gini",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Coefficient_de_Gini",
        "year": "2023"
      }
    },
    {
      "id": "lorenz_curve",
      "componentType": "Image",
      "sectionAnchor": "La courbe de Lorenz et l'inégalité",
      "props": {
        "description": "Cette image représente une courbe de Lorenz typique, un graphique utilisé pour illustrer la distribution de revenu ou de richesse. L'axe des abscisses représente le pourcentage cumulé de la population, classé par revenu croissant, et l'axe des ordonnées représente le pourcentage cumulé du revenu total détenu par cette population. La ligne diagonale droite représente l'égalité parfaite, où chaque pourcentage de la population détient le même pourcentage de revenu. La courbe de Lorenz se situe en dessous de cette ligne, sa distance par rapport à la ligne d'égalité parfaite indiquant le degré d'inégalité.",
        "title": "Courbe de Lorenz et ligne d'égalité parfaite",
        "year": "2023"
      }
    },
    {
      "id": "pmc_distribution",
      "componentType": "CustomFigure",
      "sectionAnchor": "Hétérogénéité de la propension marginale à consommer",
      "props": {
        "title": "Distribution stylisée de la propension marginale à consommer en fonction du revenu",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Propension_%C3%A0_consommer",
        "year": "2023"
      }
    },
    {
      "id": "heterogeneous_monetary_policy",
      "componentType": "Mermaid",
      "sectionAnchor": "Implications pour la politique monétaire",
      "props": {
        "code": "graph TD\n    A[Politique Monétaire (Ex: Baisse des Taux)] --> B{Impact sur les Ménages};\n    B --> C1[Ménages Endettés];\n    C1 --> D1[Réduction Coût Dette];\n    D1 --> E1[Augmentation Revenu Disponible];\n    E1 --> F1[Augmentation Consommation];\n    B --> C2[Ménages Épargnants];\n    C2 --> D2[Baisse Rendement Épargne];\n    D2 --> E2[Réduction Revenu Intérêts];\n    E2 --> F2[Réduction Consommation/Augmentation Épargne Précaution];\n    B --> C3[Ménages à Faible Revenu];\n    C3 --> D3[Accès Crédit Amélioré];\n    D3 --> E3[Augmentation Consommation];\n    B --> C4[Ménages à Revenu Élevé];\n    C4 --> D4[Effet Richesse (Actifs Financiers)];\n    D4 --> E4[Augmentation Consommation/Investissement];\n    F1 & F2 & E3 & E4 --> G[Agrégat Macroéconomique];\n    G --> H[Effet Net Ambigu];"
      }
    },
    {
      "id": "keynes_consumption",
      "componentType": "Quote",
      "sectionAnchor": "Fondements théoriques de la consommation",
      "props": {
        "quote": "La loi psychologique fondamentale, sur laquelle nous pouvons nous appuyer avec une grande confiance, à la fois a priori à partir de notre connaissance de la nature humaine et a posteriori à partir des faits détaillés de l'expérience, est que les hommes sont disposés, en règle générale et en moyenne, à augmenter leur consommation à mesure que leur revenu augmente, mais pas d'une quantité aussi grande que l'augmentation de leur revenu.",
        "source": "Théorie générale de l'emploi, de l'intérêt et de la monnaie",
        "wikipediaLink": "Théorie générale de l'emploi, de l'intérêt et de la monnaie",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Th%C3%A9orie_g%C3%A9n%C3%A9rale_de_l%27emploi,_de_l%27int%C3%A9r%C3%AAt_et_de_la_monnaie",
        "year": "1936"
      }
    },
    {
      "id": "impact_heterogeneite",
      "componentType": "CustomFigure",
      "sectionAnchor": "Conséquences macroéconomiques de l'hétérogénéité",
      "props": {
        "title": "Impact de l'hétérogénéité sur les agrégats macroéconomiques",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/H%C3%A9t%C3%A9rog%C3%A9n%C3%A9it%C3%A9_des_agents_en_%C3%A9conomie",
        "year": "2023"
      }
    },
    {
      "id": "defis_politiques_heterogeneite",
      "componentType": "Mermaid",
      "sectionAnchor": "Défis et recommandations politiques",
      "props": {
        "code": "graph TD\n    A[Hétérogénéité des Agents] --> B{Défis pour les Décideurs Politiques};\n    B --> C1[Identification des Groupes Vulnérables];\n    C1 --> D1[Politiques Ciblées (Ex: Transferts, Subventions)];\n    B --> C2[Transmission Inégale des Politiques];\n    C2 --> D2[Évaluation des Effets Distributionnels];\n    D2 --> E2[Ajustement des Instruments];\n    B --> C3[Complexité des Modèles];\n    C3 --> D3[Développement de Modèles HANK/HAND];\n    D3 --> E3[Meilleure Prévision et Analyse];\n    B --> C4[Risques d'Instabilité Financière];\n    C4 --> D4[Régulation Macroprudentielle];\n    D4 --> E4[Surveillance des Inégalités de Richesse];\n    D1 & E2 & E3 & E4 --> F[Politiques Plus Robustes et Équitables];"
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