You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "interactiveComponents": [
    {
      "id": "enjeux_socio_eco",
      "componentType": "CustomFigure",
      "sectionAnchor": "Représentation des enjeux socio-économiques contemporains pour les organisations",
      "props": {
        "title": "Enjeux socio-économiques pour les organisations",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Enjeux_socio-%C3%A9conomiques",
        "year": "2023"
      }
    },
    {
      "id": "modele_seci_nonaka",
      "componentType": "Image",
      "sectionAnchor": "Le modèle SECI de création de connaissance selon Nonaka et Takeuchi",
      "props": {
        "description": "Diagramme illustrant le modèle SECI de Nonaka et Takeuchi, qui décrit les quatre modes de conversion de la connaissance : Socialisation (tacite à tacite), Externalisation (tacite à explicite), Combinaison (explicite à explicite), et Internalisation (explicite à tacite). Le diagramme montre ces modes comme un processus cyclique, souvent représenté par une spirale de la connaissance, où la connaissance est créée et amplifiée au sein de l'organisation.",
        "title": "Le modèle SECI de création de connaissance",
        "year": "1995"
      }
    },
    {
      "id": "lien_ico",
      "componentType": "Mermaid",
      "sectionAnchor": "Diagramme illustrant les liens entre Innovation, Connaissance et Apprentissage Organisationnel",
      "props": {
        "code": "graph TD\n    A[Apprentissage Organisationnel] --> B(Création de Connaissance);\n    B --> C{Innovation};\n    C --> A;\n    C --> D[Avantage Compétitif];\n    B --> E[Capacité d'Adaptation];\n    A --> F[Développement des Compétences];\n    F --> B;\n    style A fill:#f9f,stroke:#333,stroke-width:2px\n    style B fill:#bbf,stroke:#333,stroke-width:2px\n    style C fill:#ccf,stroke:#333,stroke-width:2px\n    style D fill:#afa,stroke:#333,stroke-width:2px\n    style E fill:#afa,stroke:#333,stroke-width:2px\n    style F fill:#f9f,stroke:#333,stroke-width:2px"
      }
    },
    {
      "id": "structure_innovation",
      "componentType": "CustomFigure",
      "sectionAnchor": "Impact des structures organisationnelles sur l'apprentissage et l'innovation",
      "props": {
        "title": "Impact des structures organisationnelles",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Structure_organisationnelle",
        "year": "2022"
      }
    },
    {
      "id": "facteurs_intra_org",
      "componentType": "Mermaid",
      "sectionAnchor": "Facteurs sociaux intra-organisationnels de l'apprentissage et de l'innovation",
      "props": {
        "code": "graph TD\n    A[Culture Organisationnelle] --> B{Facteurs Sociaux Intra-Org};\n    C[Leadership et Management] --> B;\n    D[Communication Interne] --> B;\n    E[Confiance et Collaboration] --> B;\n    F[Partage de Connaissances] --> B;\n    B --> G[Apprentissage Organisationnel];\n    B --> H[Capacité d'Innovation];\n    G --> H;\n    style A fill:#f9f,stroke:#333,stroke-width:2px\n    style C fill:#f9f,stroke:#333,stroke-width:2px\n    style D fill:#f9f,stroke:#333,stroke-width:2px\n    style E fill:#f9f,stroke:#333,stroke-width:2px\n    style F fill:#f9f,stroke:#333,stroke-width:2px\n    style B fill:#bbf,stroke:#333,stroke-width:2px\n    style G fill:#ccf,stroke:#333,stroke-width:2px\n    style H fill:#afa,stroke:#333,stroke-width:2px"
      }
    },
    {
      "id": "types_reseaux_innovation",
      "componentType": "CustomFigure",
      "sectionAnchor": "Typologie des relations inter-organisationnelles pour l'innovation",
      "props": {
        "title": "Typologie des relations inter-organisationnelles",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/R%C3%A9seau_d%27innovation",
        "year": "2021"
      }
    },
    {
      "id": "reseaux_innovation_ex",
      "componentType": "Video",
      "sectionAnchor": "Exemple de réseau d'innovation ou de cluster",
      "props": {
        "title": "Exemple de cluster d'innovation technologique",
        "year": "2019"
      }
    },
    {
      "id": "synthese_innovation_apprentissage",
      "componentType": "CustomFigure",
      "sectionAnchor": "Interdépendance entre innovation, connaissance et apprentissage organisationnel",
      "props": {
        "title": "Interdépendance Innovation, Connaissance, Apprentissage",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Apprentissage_organisationnel",
        "year": "2024"
      }
    },
    {
      "id": "defis_perspectives_innovation",
      "componentType": "Mermaid",
      "sectionAnchor": "Défis et perspectives pour l'innovation et l'apprentissage",
      "props": {
        "code": "graph TD\n    A[Défis Actuels] --> B{Innovation et Apprentissage};\n    C[Perspectives Futures] --> B;\n\n    subgraph Défis\n        A1[Complexité Technologique] --> A;\n        A2[Résistance au Changement] --> A;\n        A3[Gestion des Connaissances] --> A;\n        A4[Pression Concurrentielle] --> A;\n    end\n\n    subgraph Perspectives\n        C1[IA et Automatisation] --> C;\n        C2[Apprentissage Continu] --> C;\n        C3[Écosystèmes Ouverts] --> C;\n        C4[Innovation Durable] --> C;\n    end\n\n    B --> D[Agilité Organisationnelle];\n    B --> E[Compétitivité Durable];\n    style A fill:#f9f,stroke:#333,stroke-width:2px\n    style C fill:#f9f,stroke:#333,stroke-width:2px\n    style B fill:#bbf,stroke:#333,stroke-width:2px\n    style D fill:#afa,stroke:#333,stroke-width:2px\n    style E fill:#afa,stroke:#333,stroke-width:2px"
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