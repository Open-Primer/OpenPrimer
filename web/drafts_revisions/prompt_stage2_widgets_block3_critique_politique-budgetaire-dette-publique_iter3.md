You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "interactiveComponents": [
    {
      "id": "public_debt_evolution",
      "componentType": "Image",
      "sectionAnchor": "## Introduction à la dette publique",
      "props": {
        "description": "Ce graphique linéaire représente l'évolution historique de la dette publique, exprimée en pourcentage du Produit Intérieur Brut (PIB), pour un ensemble de pays développés sur une longue période. Il met en évidence les tendances générales, les périodes de forte augmentation (souvent liées à des guerres ou des crises économiques) et les phases de consolidation budgétaire. La courbe agrégée ou les courbes individuelles des pays illustrent la variabilité et la persistance de l'endettement public au fil du temps.",
        "title": "Évolution de la dette publique dans les pays développés",
        "year": "2023"
      }
    },
    {
      "id": "public_finance_sources",
      "componentType": "Mermaid",
      "sectionAnchor": "## Les sources de financement des dépenses publiques",
      "props": {
        "code": "graph TD\n    A[État] --> B{Dépenses Publiques}\n    B --> C[Services Publics]\n    B --> D[Investissements Publics]\n    B --> E[Transferts Sociaux]\n\n    F[Recettes Fiscales] --> A\n    G[Recettes Non Fiscales] --> A\n    H[Emprunts] --> A\n\n    F --> I[Impôts directs]\n    F --> J[Impôts indirects]\n    G --> K[Redevances]\n    G --> L[Ventes de biens et services]\n    H --> M[Émission de titres de dette]\n    H --> N[Prêts internationaux]\n\n    subgraph Sources de Financement\n        F\n        G\n        H\n    end\n\n    subgraph Utilisations des Fonds\n        C\n        D\n        E\n    end"
      }
    },
    {
      "id": "impot_investissement",
      "componentType": "Mermaid",
      "sectionAnchor": "## L'impact des politiques fiscales",
      "props": {
        "code": "graph TD\n    A[Augmentation des impôts] --> B{Coût du capital plus élevé}\n    A --> C{Réduction du revenu disponible}\n\n    B --> D[Diminution de l'investissement des entreprises]\n    C --> E[Diminution de l'offre de travail]\n\n    D --> F[Baisse de la productivité]\n    E --> G[Réduction de la croissance potentielle]\n\n    F --> H[Impact négatif sur le PIB]\n    G --> H"
      }
    },
    {
      "id": "dette_impact_flow",
      "componentType": "Mermaid",
      "sectionAnchor": "## Les conséquences économiques de la dette publique",
      "props": {
        "code": "graph TD\n    A[Augmentation de la Dette Publique] --> B{Augmentation des charges d'intérêts}\n    A --> C{Risque de perte de confiance des marchés}\n    A --> D{Effet d'éviction sur l'investissement privé}\n\n    B --> E[Réduction de la marge de manœuvre budgétaire]\n    C --> F[Augmentation des taux d'intérêt]\n    D --> G[Ralentissement de la croissance économique]\n\n    E --> H[Moins de fonds pour services publics/investissements]\n    F --> G\n    G --> I[Augmentation du chômage]\n    G --> J[Baisse du niveau de vie]\n\n    H --> J"
      }
    },
    {
      "id": "r_g_debt_dynamics",
      "componentType": "Image",
      "sectionAnchor": "## La dynamique de la dette publique",
      "props": {
        "description": "Ce graphique illustre la relation entre le taux d'intérêt réel (r) et le taux de croissance économique réel (g) et leur impact sur la dynamique du ratio dette/PIB. Il présente généralement des zones où le ratio dette/PIB est stable, en augmentation ou en diminution, en fonction des valeurs relatives de r et g. Lorsque r > g, la dette tend à augmenter par rapport au PIB, tandis que lorsque g > r, elle tend à diminuer, toutes choses égales par ailleurs. Le graphique peut montrer des courbes d'isodette ou des trajectoires de dette pour différentes combinaisons de r et g.",
        "title": "Dynamique du ratio dette/PIB (r vs g)",
        "year": "2023"
      }
    },
    {
      "id": "soutenabilite_risques",
      "componentType": "Mermaid",
      "sectionAnchor": "## La soutenabilité de la dette publique",
      "props": {
        "code": "graph TD\n    A[Dette Publique Non Soutenable] --> B{Perte de confiance des marchés}\n    A --> C{Augmentation des taux d'intérêt}\n    A --> D{Pression sur la monnaie nationale}\n    A --> E{Nécessité d'austérité budgétaire}\n\n    B --> C\n    C --> F[Coût du service de la dette insoutenable]\n    D --> G[Inflation importée]\n    D --> H[Fuite des capitaux]\n    E --> I[Réduction des services publics]\n    E --> J[Baisse de l'investissement public]\n\n    F --> I\n    F --> J\n    G --> K[Baisse du pouvoir d'achat]\n    H --> K\n    I --> L[Mécontentement social]\n    J --> M[Ralentissement économique]\n\n    K --> L\n    L --> N[Instabilité politique]\n    M --> N"
      }
    },
    {
      "id": "global_debt_trends",
      "componentType": "Image",
      "sectionAnchor": "## Tendances récentes de la dette publique mondiale",
      "props": {
        "description": "Ce graphique représente l'évolution récente de la dette publique mondiale, agrégée ou par grandes zones économiques (par exemple, pays avancés, marchés émergents), exprimée en pourcentage du Produit Intérieur Brut (PIB). Il met en évidence les tendances observées au cours des dernières décennies, notamment les pics liés à la crise financière de 2008, la pandémie de COVID-19, et les efforts de consolidation budgétaire. Le graphique permet de visualiser les niveaux d'endettement globaux et les différences régionales.",
        "title": "Tendances récentes de la dette publique mondiale",
        "year": "2023"
      }
    },
    {
      "id": "fiscal_monetary_interaction",
      "componentType": "Mermaid",
      "sectionAnchor": "## Interaction entre politiques budgétaire et monétaire",
      "props": {
        "code": "graph TD\n    A[Politique Budgétaire Expansive] --> B{Augmentation de la demande agrégée}\n    A --> C{Augmentation de la dette publique}\n\n    D[Politique Monétaire Accommodante] --> E{Baisse des taux d'intérêt}\n    D --> F{Augmentation de la masse monétaire}\n\n    B --> G[Pression inflationniste]\n    C --> H[Pression sur les taux d'intérêt à long terme]\n\n    E --> I[Stimule l'investissement et la consommation]\n    F --> G\n\n    G --> J[Réponse de la Banque Centrale]\n    H --> J\n\n    I --> K[Croissance économique]\n    J --> L[Ajustement des politiques]\n\n    K --> L"
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