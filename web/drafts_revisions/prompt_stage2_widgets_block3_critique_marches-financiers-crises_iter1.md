You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "interactiveComponents": [
    {
      "id": "marches_financiers_overview",
      "componentType": "Image",
      "sectionAnchor": "Représentation schématique des interconnexions des marchés financiers",
      "props": {
        "description": "Cette image représente une vue d'overview schématique des interconnexions complexes au sein des marchés financiers. Elle illustre les flux de capitaux et les relations entre les différents acteurs, tels que les banques centrales, les banques commerciales, les marchés boursiers, les marchés obligataires, les fonds d'investissement et les entreprises. Les flèches indiquent les directions des transactions et des influences, soulignant la nature systémique du système financier mondial.",
        "title": "Interconnexions des Marchés Financiers",
        "year": "2023"
      }
    },
    {
      "id": "cycle_financier_crise",
      "componentType": "Mermaid",
      "sectionAnchor": "Diagramme simplifié du cycle financier menant à une crise",
      "props": {
        "code": "graph TD\n A[Expansion Économique] --> B{Optimisme et Prise de Risque};\n B --> C[Augmentation du Crédit et de l'Endettement];\n C --> D[Hausse des Prix d'Actifs (Bulles)];\n D --> E{Détérioration des Standards de Prêt};\n E --> F[Fragilité Financière Accrue];\n F --> G{Choc Externe ou Déclencheur};\n G --> H[Contraction du Crédit (Credit Crunch)];\n H --> I[Chute des Prix d'Actifs];\n I --> J[Faillites et Récessions];\n J --> K[Intervention des Autorités];\n K --> A;"
      }
    },
    {
      "id": "credit_leverage_cycle",
      "componentType": "CustomFigure",
      "sectionAnchor": "Illustration du cycle crédit-levier et son impact sur l'économie",
      "props": {
        "description": "Cette illustration représente le cycle crédit-levier, un concept central dans la compréhension des crises financières. Elle montre comment l'accès facile au crédit peut encourager l'endettement (levier), ce qui stimule la demande et les prix des actifs. Lorsque les prix des actifs augmentent, la valeur des garanties augmente, permettant un endettement encore plus important. Ce cycle positif peut devenir auto-entretenu jusqu'à ce qu'un choc ou une perte de confiance inverse la tendance, entraînant une contraction du crédit, une chute des prix des actifs et un désendettement forcé, souvent douloureux pour l'économie réelle.",
        "title": "Le Cycle Crédit-Levier et son Impact"
      }
    },
    {
      "id": "minsky_hypothesis_flow",
      "componentType": "Mermaid",
      "sectionAnchor": "Diagramme de la chaîne d'événements de l'hypothèse d'instabilité financière de Minsky",
      "props": {
        "code": "graph TD\n A[Période de Stabilité Économique] --> B{Optimisme et Prise de Risque};\n B --> C[Financement Couvert (Hedge Finance)];\n C --> D[Financement Spéculatif (Speculative Finance)];\n D --> E[Financement Ponzi (Ponzi Finance)];\n E --> F[Augmentation de la Vulnérabilité];\n F --> G{Choc ou Perte de Confiance};\n G --> H[Vente d'Actifs pour Rembourser Dettes];\n H --> I[Chute des Prix d'Actifs];\n I --> J[Crise Financière (Moment Minsky)];\n J --> K[Intervention des Autorités];"
      }
    },
    {
      "id": "global_debt_gdp",
      "componentType": "DataChart",
      "sectionAnchor": "Graphique de l'évolution de l'endettement mondial par rapport au PIB",
      "props": {
        "description": "Ce graphique illustre l'évolution historique de l'endettement mondial, mesuré en pourcentage du Produit Intérieur Brut (PIB). Il met en évidence les tendances d'accumulation de la dette publique, privée non financière et financière à travers les décennies, souvent en corrélation avec les périodes de croissance économique et les crises financières. Des pics d'endettement sont généralement observés avant ou pendant les récessions majeures, reflétant l'impact des politiques économiques et des événements mondiaux sur la solvabilité des nations et des entreprises."
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