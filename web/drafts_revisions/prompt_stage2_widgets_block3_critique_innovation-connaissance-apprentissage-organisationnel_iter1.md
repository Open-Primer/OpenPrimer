You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "interactiveComponents": [
    {
      "id": "enjeux_socio_eco",
      "componentType": "CustomFigure",
      "sectionAnchor": "Représentation des enjeux socio-économiques contemporains pour les organisations",
      "props": {
        "title": "Enjeux Socio-Économiques pour les Organisations",
        "wikipediaLink": "https://fr.wikipedia.org/wiki/Responsabilit%C3%A9_soci%C3%A9tale_des_entreprises",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Responsabilit%C3%A9_soci%C3%A9tale_des_entreprises",
        "year": "2023"
      }
    },
    {
      "id": "modele_seci_nonaka",
      "componentType": "Image",
      "sectionAnchor": "Le modèle SECI de création de connaissance selon Nonaka et Takeuchi",
      "props": {
        "description": "Ce diagramme illustre le modèle SECI (Socialisation, Externalisation, Combinaison, Internalisation) de Nonaka et Takeuchi, décrivant les quatre modes de conversion de la connaissance au sein d'une organisation. Il montre comment la connaissance tacite et explicite interagit et se transforme à travers ces processus dynamiques, formant un cycle continu de création de connaissance. Les flèches indiquent les transitions entre les différents types de connaissance et les modes de conversion.",
        "title": "Modèle SECI de Nonaka et Takeuchi",
        "year": "1995"
      }
    },
    {
      "id": "lien_ico",
      "componentType": "Mermaid",
      "sectionAnchor": "Diagramme illustrant les liens entre Innovation, Connaissance et Apprentissage Organisationnel",
      "props": {
        "code": "graph TD\n    A[Connaissance] --> B{Apprentissage Organisationnel}\n    B --> C[Innovation]\n    C --> A\n    B -- Facilite --> A\n    C -- Génère de nouvelles --> A\n    A -- Alimente --> B"
      }
    },
    {
      "id": "structure_innovation",
      "componentType": "CustomFigure",
      "sectionAnchor": "Impact des structures organisationnelles sur l'apprentissage et l'innovation",
      "props": {
        "title": "Structures Organisationnelles et Innovation",
        "wikipediaLink": "https://fr.wikipedia.org/wiki/Structure_organisationnelle",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Structure_organisationnelle",
        "year": "2020"
      }
    },
    {
      "id": "facteurs_intra_org",
      "componentType": "Mermaid",
      "sectionAnchor": "Facteurs sociaux intra-organisationnels de l'apprentissage et de l'innovation",
      "props": {
        "code": "graph TD\n    A[Culture d'entreprise] --> B{Collaboration Interne}\n    B --> C[Partage de Connaissances]\n    C --> D[Apprentissage Organisationnel]\n    D --> E[Innovation]\n    A -- Favorise --> C\n    B -- Renforce --> D\n    E -- Influence --> A"
      }
    },
    {
      "id": "types_reseaux_innovation",
      "componentType": "CustomFigure",
      "sectionAnchor": "Typologie des relations inter-organisationnelles pour l'innovation",
      "props": {
        "title": "Typologie des Réseaux d'Innovation",
        "wikipediaLink": "https://fr.wikipedia.org/wiki/R%C3%A9seau_d%27innovation",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/R%C3%A9seau_d%27innovation",
        "year": "2018"
      }
    },
    {
      "id": "reseaux_innovation_ex",
      "componentType": "Video",
      "sectionAnchor": "Exemple de réseau d'innovation ou de cluster",
      "props": {
        "title": "Le Cluster de la Silicon Valley: Un Modèle d'Innovation",
        "year": "2021"
      }
    },
    {
      "id": "synthese_innovation_apprentissage",
      "componentType": "CustomFigure",
      "sectionAnchor": "Interdépendance entre innovation, connaissance et apprentissage organisationnel",
      "props": {
        "title": "Synthèse: Innovation, Connaissance et Apprentissage",
        "wikipediaLink": "https://fr.wikipedia.org/wiki/Gestion_des_connaissances",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Gestion_des_connaissances",
        "year": "2022"
      }
    },
    {
      "id": "defis_perspectives_innovation",
      "componentType": "Mermaid",
      "sectionAnchor": "Défis et perspectives pour l'innovation et l'apprentissage",
      "props": {
        "code": "graph TD\n    A[Défis Actuels] --> B{Complexité Technologique}\n    A --> C{Changement Rapide}\n    A --> D{Résistance au Changement}\n    E[Perspectives Futures] --> F{IA et Apprentissage}\n    E --> G{Écosystèmes Ouverts}\n    E --> H{Agilité Organisationnelle}\n    B -- Nécessite --> F\n    C -- Exige --> H\n    D -- Surmonté par --> G"
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