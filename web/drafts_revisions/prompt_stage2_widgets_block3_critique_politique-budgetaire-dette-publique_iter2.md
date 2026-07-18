You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "interactiveComponents": [
    {
      "id": "public_debt_evolution",
      "componentType": "Image",
      "sectionAnchor": "## La dette publique : Définition et Évolution",
      "props": {
        "description": "Ce graphique linéaire illustre l'évolution de la dette publique, exprimée en pourcentage du Produit Intérieur Brut (PIB), pour un ensemble de pays développés sur une période historique significative. Il met en évidence les tendances générales, les périodes d'augmentation rapide (souvent liées à des crises économiques, des guerres ou des politiques budgétaires expansionnistes) et les périodes de stabilisation ou de réduction. L'analyse de ces courbes permet de comprendre les dynamiques macroéconomiques et les réponses politiques face aux chocs économiques.",
        "title": "Évolution de la dette publique dans les pays développés",
        "year": "2023"
      }
    },
    {
      "id": "public_finance_sources",
      "componentType": "Mermaid",
      "sectionAnchor": "## Les sources de financement des dépenses publiques",
      "props": {
        "code": "graph TD\n    A[Financement des Dépenses Publiques] --> B(Recettes Fiscales)\n    A --> C(Recettes Non Fiscales)\n    A --> D(Emprunt Public)\n\n    B --> B1(Impôts Directs)\n    B --> B2(Impôts Indirects)\n    B1 --> B1a(Impôt sur le Revenu)\n    B1 --> B1b(Impôt sur les Sociétés)\n    B2 --> B2a(TVA)\n    B2 --> B2b(Taxes Spécifiques)\n\n    C --> C1(Revenus du Domaine Public)\n    C --> C2(Redevances et Amendes)\n\n    D --> D1(Émission d'Obligations d'État)\n    D --> D2(Prêts Internationaux)\n    D --> D3(Avances de la Banque Centrale)"
      }
    },
    {
      "id": "dette_impact_flow",
      "componentType": "Mermaid",
      "sectionAnchor": "## Les effets macroéconomiques de la dette publique",
      "props": {
        "code": "graph TD\n    A[Augmentation de la Dette Publique] --> B{Augmentation des Taux d'Intérêt?}\n    B -- Oui --> C[Effet d'Éviction]\n    C --> C1[Réduction de l'Investissement Privé]\n    C1 --> C2[Baisse de la Croissance Potentielle]\n\n    B -- Non --> D[Pression sur les Finances Publiques]\n    D --> D1[Augmentation du Service de la Dette]\n    D1 --> D2[Réduction des Dépenses Publiques Futures]\n    D2 --> D2a[Moins d'Investissement Public]\n    D2a --> C2\n\n    A --> E[Risque de Crise de Confiance]\n    E --> E1[Fuite des Capitaux]\n    E1 --> E2[Dépréciation de la Monnaie]\n    E2 --> E3[Inflation Importée]\n    E3 --> F[Baisse du Pouvoir d'Achat]\n\n    A --> G[Transfert de Charge aux Générations Futures]\n    G --> G1[Augmentation des Impôts Futurs]\n    G1 --> F"
      }
    },
    {
      "id": "soutenabilite_risques",
      "componentType": "Mermaid",
      "sectionAnchor": "## La soutenabilité de la dette publique",
      "props": {
        "code": "graph TD\n    A[Dette Publique Non Soutenable] --> B[Perte de Confiance des Marchés]\n    B --> C[Augmentation des Taux d'Intérêt]\n    C --> D[Augmentation du Coût du Service de la Dette]\n    D --> E[Pression Budgétaire Accrue]\n    E --> F[Réduction des Dépenses Essentielles]\n    E --> G[Augmentation des Impôts]\n\n    B --> H[Difficulté à Financer la Dette]\n    H --> I[Recours à la Monétisation de la Dette]\n    I --> J[Inflation Élevée]\n    J --> K[Baisse du Pouvoir d'Achat]\n\n    H --> L[Crise de la Dette Souveraine]\n    L --> M[Récession Économique]\n    M --> N[Augmentation du Chômage]\n    N --> O[Instabilité Sociale]"
      }
    },
    {
      "id": "fiscal_monetary_interaction",
      "componentType": "Mermaid",
      "sectionAnchor": "## Interaction entre politique budgétaire et monétaire",
      "props": {
        "code": "graph TD\n    A[Politique Budgétaire] --> B{Expansionniste ou Restrictive?}\n    B -- Expansionniste (Dépenses/Baisse Impôts) --> C[Stimulation de la Demande Globale]\n    C --> D[Augmentation du PIB]\n    C --> E[Pression Inflationniste]\n    E --> F[Réponse de la Banque Centrale]\n\n    B -- Restrictive (Réduction Dépenses/Hausse Impôts) --> G[Freinage de la Demande Globale]\n    G --> H[Ralentissement du PIB]\n    G --> I[Pression Déflationniste]\n    I --> F\n\n    F --> J[Politique Monétaire]\n    J --> K{Expansionniste ou Restrictive?}\n    K -- Expansionniste (Baisse Taux/QE) --> L[Stimulation du Crédit et de l'Investissement]\n    L --> D\n    L --> E\n\n    K -- Restrictive (Hausse Taux/QT) --> M[Freinage du Crédit et de l'Investissement]\n    M --> H\n    M --> I\n\n    D --> N[Objectif de Croissance]\n    J --> O[Objectif de Stabilité des Prix]\n    F --> P[Coordination des Politiques]"
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