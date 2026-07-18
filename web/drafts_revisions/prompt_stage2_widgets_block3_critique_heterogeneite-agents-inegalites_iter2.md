You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "interactiveComponents": [
    {
      "id": "macro_evolution",
      "componentType": "Mermaid",
      "sectionAnchor": "Évolution des paradigmes en macroéconomie face à l'hétérogénéité",
      "props": {
        "code": "graph TD\n    A[Macroéconomie Traditionnelle] --> B{Hypothèses Homogènes};\n    B --> C[Agent Représentatif];\n    C --> D[Modèles DSGE Standard];\n    D --> E{Limites Observées};\n    E --> F[Crises Financières, Inégalités Croissantes];\n    F --> G[Nouveau Paradigme: Hétérogénéité];\n    G --> H[Agents Hétérogènes (Revenu, Préférences, Capacités)];\n    H --> I[Modèles HANK/HAND];\n    I --> J[Analyse des Effets Redistributifs];\n    J --> K[Politiques Macroprudentielles];\n    K --> L[Comportements Non-Rationnels];\n    L --> M[Approches Basées sur les Agents (ABM)];\n    G --> N[Impact sur la Politique Monétaire et Budgétaire];"
      }
    },
    {
      "id": "gini_coefficient_interpretation",
      "componentType": "CustomFigure",
      "sectionAnchor": "Interprétation visuelle du coefficient de Gini",
      "props": {
        "description": "Ce diagramme illustre l'interprétation visuelle du coefficient de Gini. Il représente une courbe de Lorenz, qui trace la proportion cumulée du revenu total détenue par la proportion cumulée des ménages. La ligne d'égalité parfaite, une diagonale à 45 degrés, indique une distribution où chaque pourcentage de la population détient le même pourcentage du revenu. La courbe de Lorenz se situe en dessous de cette ligne, et l'aire entre la ligne d'égalité parfaite et la courbe de Lorenz, divisée par l'aire totale sous la ligne d'égalité parfaite, donne le coefficient de Gini. Une valeur de Gini proche de 0 indique une égalité parfaite, tandis qu'une valeur proche de 1 (ou 100%) indique une inégalité maximale.",
        "title": "Interprétation Visuelle du Coefficient de Gini",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Coefficient_de_Gini",
        "year": "2023"
      }
    },
    {
      "id": "lorenz_curve",
      "componentType": "Image",
      "sectionAnchor": "Représentation graphique de la courbe de Lorenz et de la ligne d'égalité parfaite",
      "props": {
        "description": "Cette image présente une représentation graphique standard de la courbe de Lorenz et de la ligne d'égalité parfaite. L'axe des abscisses représente le pourcentage cumulé de la population (du plus pauvre au plus riche), et l'axe des ordonnées représente le pourcentage cumulé du revenu ou de la richesse totale détenue par cette population. La ligne diagonale à 45 degrés symbolise une distribution parfaitement égale. La courbe de Lorenz, qui se situe en dessous de cette diagonale, illustre la distribution réelle, montrant comment les pourcentages inférieurs de la population détiennent des pourcentages disproportionnellement faibles du revenu total.",
        "title": "Courbe de Lorenz et Ligne d'Égalité Parfaite",
        "year": "2023"
      }
    },
    {
      "id": "pmc_distribution",
      "componentType": "CustomFigure",
      "sectionAnchor": "Distribution stylisée de la propension marginale à consommer en fonction du revenu",
      "props": {
        "description": "Ce graphique stylisé illustre la distribution de la propension marginale à consommer (PMC) en fonction du niveau de revenu des ménages. Il montre généralement que les ménages à faible revenu ont une PMC plus élevée, ce qui signifie qu'ils dépensent une plus grande proportion de tout revenu supplémentaire qu'ils reçoivent. À mesure que le revenu augmente, la PMC tend à diminuer, les ménages plus riches ayant une PMC plus faible et épargnant une plus grande part de leur revenu additionnel. Cette hétérogénéité de la PMC est cruciale pour comprendre l'efficacité des politiques de relance budgétaire.",
        "title": "Distribution de la PMC en Fonction du Revenu",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Propension_marginale_%C3%A0_consommer",
        "year": "2023"
      }
    },
    {
      "id": "heterogeneous_monetary_policy",
      "componentType": "Mermaid",
      "sectionAnchor": "Canaux de transmission hétérogènes de la politique monétaire",
      "props": {
        "code": "graph TD\n    A[Politique Monétaire (Taux d'intérêt)] --> B{Impact sur les Ménages};\n    B --> B1[Ménages Endettés (Crédit)];\n    B --> B2[Ménages Épargnants (Revenu)];\n    B --> B3[Ménages à Faible Revenu (Liquidité)];\n    B1 --> C[Coût du Crédit];\n    B2 --> D[Rendement de l'Épargne];\n    B3 --> E[Contrainte de Liquidité];\n    C --> F[Consommation et Investissement (Ménages Endettés)];\n    D --> G[Consommation et Épargne (Ménages Épargnants)];\n    E --> H[Consommation (Ménages à Faible Revenu)];\n    A --> I{Impact sur les Entreprises};\n    I --> I1[Grandes Entreprises (Accès aux Marchés)];\n    I --> I2[PME (Dépendance Bancaire)];\n    I1 --> J[Coût du Capital];\n    I2 --> K[Accès au Financement];\n    J --> L[Investissement et Emploi (Grandes Entreprises)];\n    K --> M[Investissement et Emploi (PME)];\n    F & G & H & L & M --> N[Agrégats Macroéconomiques (PIB, Inflation)];"
      }
    },
    {
      "id": "keynes_consumption",
      "componentType": "Quote",
      "sectionAnchor": "Citation de John Maynard Keynes sur l'importance de la consommation dans l'économie",
      "props": {
        "quote": "La propension à consommer est la fonction fondamentale qui détermine le niveau de l'emploi.",
        "source": "Théorie Générale de l'Emploi, de l'Intérêt et de la Monnaie",
        "title": "Citation de John Maynard Keynes sur l'importance de la consommation dans l'économie",
        "year": "1936"
      }
    },
    {
      "id": "impact_heterogeneite",
      "componentType": "CustomFigure",
      "sectionAnchor": "Impact de l'hétérogénéité sur les agrégats macroéconomiques",
      "props": {
        "description": "Ce diagramme conceptuel représente l'impact de l'hétérogénéité des agents sur les agrégats macroéconomiques. Il met en évidence comment les différences individuelles en termes de revenu, de richesse, de préférences et de contraintes (par exemple, contraintes de liquidité) peuvent modifier la réponse agrégée de l'économie aux chocs ou aux politiques. Par exemple, une politique monétaire peut avoir des effets très différents sur la consommation et l'investissement globaux si les ménages réagissent de manière hétérogène en fonction de leur situation financière, par opposition à un modèle avec un agent représentatif homogène.",
        "title": "Impact de l'Hétérogénéité sur les Agrégats Macroéconomiques",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/H%C3%A9t%C3%A9rog%C3%A9n%C3%A9it%C3%A9_des_agents_%C3%A9conomiques",
        "year": "2023"
      }
    },
    {
      "id": "defis_politiques_heterogeneite",
      "componentType": "Mermaid",
      "sectionAnchor": "Défis pour les décideurs politiques face à l'hétérogénéité",
      "props": {
        "code": "graph TD\n    A[Hétérogénéité des Agents] --> B{Défis pour la Politique Économique};\n    B --> C[Identification des Canaux de Transmission];\n    C --> C1[Politique Monétaire];\n    C --> C2[Politique Budgétaire];\n    B --> D[Mesure et Suivi des Inégalités];\n    D --> D1[Données Microéconomiques];\n    D --> D2[Indicateurs de Bien-être];\n    B --> E[Conception de Politiques Ciblées];\n    E --> E1[Transferts Sociaux];\n    E --> E2[Fiscalité Progressive];\n    E --> E3[Réglementation du Marché du Travail];\n    B --> F[Arbitrages entre Efficacité et Équité];\n    F --> F1[Croissance vs Réduction des Inégalités];\n    F --> F2[Stabilité vs Redistribution];\n    B --> G[Communication et Légitimité des Politiques];\n    G --> G1[Explication des Effets Hétérogènes];\n    G --> G2[Consensus Social];\n    C1 & C2 & D1 & D2 & E1 & E2 & E3 & F1 & F2 & G1 & G2 --> H[Nécessité de Modèles Plus Sophistiqués];"
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