You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "interactiveComponents": [
    {
      "id": "public_debt_evolution",
      "componentType": "Image",
      "sectionAnchor": "## Introduction à la dette publique",
      "props": {
        "description": "Ce graphique linéaire illustre l'évolution historique de la dette publique, exprimée en pourcentage du Produit Intérieur Brut (PIB), pour un ensemble de pays développés sur une longue période. Il met en évidence les tendances générales, les périodes de forte augmentation (souvent liées à des guerres ou des crises économiques) et de réduction de l'endettement. Les différentes lignes représentent probablement des groupes de pays ou des pays individuels, permettant une comparaison des trajectoires d'endettement.",
        "title": "Évolution de la dette publique dans les pays développés",
        "year": "2023"
      }
    },
    {
      "id": "public_finance_sources",
      "componentType": "Mermaid",
      "sectionAnchor": "## Les sources de financement des dépenses publiques",
      "props": {
        "code": "graph TD; A[Impôts] --> B(Recettes fiscales); C[Emprunts] --> D(Recettes non fiscales); B --> E[Budget de l'État]; D --> E; E --> F[Dépenses publiques]; F --> G{Services publics}; F --> H{Investissements};"
      }
    },
    {
      "id": "impot_investissement",
      "componentType": "CustomFigure",
      "sectionAnchor": "## L'impact des impôts sur l'économie",
      "props": {
        "description": "Cette figure conceptuelle représente l'impact des impôts sur l'investissement des entreprises et l'offre de travail des ménages. Elle illustre comment des taux d'imposition élevés sur les bénéfices des entreprises peuvent décourager l'investissement en réduisant la rentabilité attendue, tandis que des impôts élevés sur le revenu du travail peuvent réduire l'incitation à travailler ou à épargner. Le diagramme pourrait montrer des courbes d'offre et de demande ou des flèches directionnelles pour visualiser ces effets.",
        "title": "Impact des impôts sur l'investissement et l'offre de travail"
      }
    },
    {
      "id": "dette_impact_flow",
      "componentType": "Mermaid",
      "sectionAnchor": "## Les effets macroéconomiques de la dette publique",
      "props": {
        "code": "graph TD; A[Augmentation Dette Publique] --> B{Augmentation Charges Intérêts}; B --> C[Réduction Dépenses Publiques]; B --> D[Augmentation Impôts]; C --> E[Ralentissement Croissance]; D --> E; A --> F{Effet d'Éviction}; F --> G[Baisse Investissement Privé]; G --> E; A --> H{Perte Confiance Marchés}; H --> I[Augmentation Taux d'Intérêt]; I --> E;"
      }
    },
    {
      "id": "r_g_debt_dynamics",
      "componentType": "CustomFigure",
      "sectionAnchor": "## La dynamique de la dette publique",
      "props": {
        "description": "Cette figure représente la dynamique du ratio dette/PIB en fonction de la relation entre le taux d'intérêt réel (r) et le taux de croissance économique (g). Elle illustre comment un taux d'intérêt supérieur au taux de croissance (r > g) tend à augmenter le ratio dette/PIB si le solde primaire est nul ou négatif, tandis qu'un taux de croissance supérieur au taux d'intérêt (g > r) peut aider à stabiliser ou réduire ce ratio. Le graphique pourrait montrer des zones ou des courbes indiquant les conditions de soutenabilité de la dette.",
        "title": "Dynamique du ratio dette/PIB (r vs g)"
      }
    },
    {
      "id": "soutenabilite_risques",
      "componentType": "Mermaid",
      "sectionAnchor": "## La soutenabilité de la dette publique",
      "props": {
        "code": "graph TD; A[Dette Publique Non Soutenable] --> B{Crise de Confiance}; B --> C[Fuite des Capitaux]; C --> D[Dépréciation Monnaie]; D --> E[Inflation]; E --> F[Baisse Pouvoir d'Achat]; B --> G[Augmentation Taux d'Intérêt]; G --> H[Coût du Service de la Dette]; H --> I[Réduction Marges Budgétaires]; I --> J[Baisse Services Publics]; J --> K[Mécontentement Social];"
      }
    },
    {
      "id": "global_debt_trends",
      "componentType": "CustomFigure",
      "sectionAnchor": "## Tendances récentes de la dette publique mondiale",
      "props": {
        "description": "Cette figure présente l'évolution récente de la dette publique mondiale, exprimée en pourcentage du PIB global. Elle met en lumière les tendances d'endettement des dernières décennies, incluant les impacts des crises financières, des pandémies et des politiques de relance économique. Le graphique pourrait segmenter la dette par région ou par type de pays (avancés, émergents) pour offrir une perspective comparative sur l'accumulation de la dette à l'échelle planétaire.",
        "title": "Tendances récentes de la dette publique mondiale"
      }
    },
    {
      "id": "fiscal_monetary_interaction",
      "componentType": "Mermaid",
      "sectionAnchor": "## Interaction entre politiques budgétaire et monétaire",
      "props": {
        "code": "graph TD; A[Politique Budgétaire Expansive] --> B{Augmentation Demande Agrégée}; B --> C[Pression Inflationniste]; C --> D[Réaction Banque Centrale]; D --> E[Politique Monétaire Restrictive]; E --> F[Augmentation Taux d'Intérêt]; F --> G[Ralentissement Croissance]; A --> H[Augmentation Dette Publique]; H --> I[Pression sur Taux d'Intérêt]; I --> G;"
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