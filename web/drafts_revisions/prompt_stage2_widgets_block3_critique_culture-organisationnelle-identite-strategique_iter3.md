You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "interactiveComponents": [
    {
      "id": "culture_strategie_interdependance",
      "componentType": "Image",
      "sectionAnchor": "## Culture et Stratégie",
      "props": {
        "description": "Ce diagramme illustre l'interdépendance dynamique entre la culture organisationnelle et l'identité stratégique. Il met en évidence comment la culture influence la formulation et la mise en œuvre de la stratégie, tandis que la stratégie, à son tour, façonne et renforce certains aspects de la culture. Cette interaction continue est cruciale pour l'atteinte de la performance globale et la durabilité de l'organisation.",
        "title": "Interdépendance Culture-Stratégie",
        "year": "2023"
      }
    },
    {
      "id": "culture_strategie_flux",
      "componentType": "Mermaid",
      "sectionAnchor": "## Culture et Stratégie",
      "props": {
        "code": "graph TD\n    A[Culture Organisationnelle] --> B{Formulation de la Stratégie}\n    B --> C[Mise en œuvre de la Stratégie]\n    C --> D[Performance Organisationnelle]\n    D --> A\n    B -- Façonne --> A\n    A -- Influence --> B"
      }
    },
    {
      "id": "schein_iceberg",
      "componentType": "CustomFigure",
      "sectionAnchor": "## Comprendre la Culture Organisationnelle",
      "props": {
        "description": "Cette figure représente le modèle de la culture organisationnelle d'Edgar Schein sous la métaphore d'un iceberg. La partie visible au-dessus de l'eau correspond aux artefacts (structures, processus, comportements observables). Juste sous la surface se trouvent les valeurs déclarées (stratégies, objectifs, philosophies). La base immergée de l'iceberg symbolise les postulats de base (croyances inconscientes, perceptions, pensées et sentiments), qui sont les fondements les plus profonds et les moins visibles de la culture.",
        "title": "Modèle de l'Iceberg de Schein",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Edgar_Schein",
        "year": "2023"
      }
    },
    {
      "id": "culture_formation_evolution",
      "componentType": "Video",
      "sectionAnchor": "## Dynamiques de la Culture",
      "props": {
        "title": "Formation et Évolution de la Culture Organisationnelle",
        "year": "2023"
      }
    },
    {
      "id": "transmission_culture",
      "componentType": "CustomFigure",
      "sectionAnchor": "## Dynamiques de la Culture",
      "props": {
        "description": "Cette illustration schématise les principaux mécanismes par lesquels la culture organisationnelle est transmise et perpétuée au sein d'une entreprise. Elle met en évidence la socialisation des nouveaux employés, l'importance des rituels et des cérémonies, le rôle des mythes et des histoires partagées, ainsi que l'impact du langage et des symboles dans la diffusion des valeurs et des normes culturelles.",
        "title": "Mécanismes de Transmission Culturelle",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Socialisation_organisationnelle",
        "year": "2023"
      }
    },
    {
      "id": "typologie_culturelle",
      "componentType": "Mermaid",
      "sectionAnchor": "## Typologies Culturelles",
      "props": {
        "code": "graph TD\n    subgraph \"Typologie des Cultures Organisationnelles (Cameron & Quinn)\"\n        A[Culture de Clan] -->|Caractéristiques| A_desc(Collaboration, Cohésion, Mentoring, Famille)\n        B[Culture d'Adhocratie] -->|Caractéristiques| B_desc(Créativité, Innovation, Dynamisme, Entrepreneurial)\n        C[Culture de Marché] -->|Caractéristiques| C_desc(Compétition, Résultats, Orientation Client, Performance)\n        D[Culture de Hiérarchie] -->|Caractéristiques| D_desc(Ordre, Efficacité, Stabilité, Procédures)\n    end"
      }
    },
    {
      "id": "culture_strategie_performance",
      "componentType": "Video",
      "sectionAnchor": "## Impact sur la Performance",
      "props": {
        "title": "Culture, Stratégie et Performance Organisationnelle",
        "year": "2023"
      }
    },
    {
      "id": "culture_strategy_alignment",
      "componentType": "CustomFigure",
      "sectionAnchor": "## Impact sur la Performance",
      "props": {
        "description": "Ce diagramme illustre le concept d'alignement dynamique entre la culture organisationnelle et la stratégie d'entreprise. Il montre comment un alignement réussi permet d'optimiser la performance, de favoriser l'innovation et d'assurer la durabilité à long terme de l'organisation. L'alignement n'est pas statique mais nécessite une adaptation continue face aux changements internes et externes.",
        "title": "Alignement Culture-Stratégie",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Alignement_stratégique",
        "year": "2023"
      }
    },
    {
      "id": "culture_evolution_flow",
      "componentType": "Mermaid",
      "sectionAnchor": "## Gérer le Changement Culturel",
      "props": {
        "code": "graph TD\n    A[Analyse de la Culture Actuelle] --> B{Identification des Écarts Culturels}\n    B --> C[Définition de la Culture Désirée]\n    C --> D{Planification des Interventions Culturelles}\n    D --> E[Mise en œuvre des Actions de Changement]\n    E --> F[Suivi et Évaluation]\n    F --> G[Adaptation Stratégique et Ajustements]\n    G --> A"
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