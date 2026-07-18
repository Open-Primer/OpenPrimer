You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "interactiveComponents": [
    {
      "id": "culture_strategie_interdependance",
      "componentType": "Image",
      "sectionAnchor": "## Interdépendance Culture-Stratégie",
      "props": {
        "description": "Ce diagramme illustre la relation symbiotique et bidirectionnelle entre la culture organisationnelle et l'identité stratégique. Il montre comment la culture influence la formulation et la mise en œuvre de la stratégie, tandis que la stratégie, une fois définie, peut remodeler et renforcer certains aspects de la culture. Cette interdépendance est cruciale pour la performance globale et la résilience de l'organisation, créant un cycle vertueux ou vicieux selon l'alignement.",
        "title": "Interdépendance Culture-Stratégie",
        "year": "2023"
      }
    },
    {
      "id": "culture_strategie_flux",
      "componentType": "Mermaid",
      "sectionAnchor": "## Interdépendance Culture-Stratégie",
      "props": {
        "code": "graph TD; A[Culture Organisationnelle] --> B(Formulation de la Stratégie); B --> C{Mise en œuvre de la Stratégie}; C --> D[Performance Organisationnelle]; D --> A; C --> A;"
      }
    },
    {
      "id": "schein_iceberg",
      "componentType": "Image",
      "sectionAnchor": "## Modèles de Culture Organisationnelle",
      "props": {
        "description": "Représentation visuelle du modèle de la culture organisationnelle d'Edgar Schein, structuré comme un iceberg. La partie visible au-dessus de l'eau représente les artefacts (structures, processus, comportements observables). Juste sous la surface se trouvent les valeurs déclarées (philosophies, stratégies, objectifs). La base immergée, la plus grande et la plus difficile à percevoir, symbolise les postulats de base (croyances inconscientes, perceptions, pensées et sentiments).",
        "title": "Modèle de l'Iceberg de Schein",
        "year": "1985"
      }
    },
    {
      "id": "culture_formation_evolution",
      "componentType": "Video",
      "sectionAnchor": "## Dynamiques de la Culture Organisationnelle",
      "props": {
        "title": "Formation et Évolution de la Culture Organisationnelle",
        "year": "2022"
      }
    },
    {
      "id": "transmission_culture",
      "componentType": "Image",
      "sectionAnchor": "## Dynamiques de la Culture Organisationnelle",
      "props": {
        "description": "Cette illustration schématise les divers mécanismes par lesquels la culture organisationnelle est transmise et perpétuée au sein d'une entreprise. Elle met en évidence la socialisation des nouveaux employés, les rituels et cérémonies, les mythes et histoires partagés, ainsi que le langage et les symboles spécifiques qui contribuent à renforcer l'identité culturelle et à guider les comportements des membres.",
        "title": "Mécanismes de Transmission Culturelle",
        "year": "2021"
      }
    },
    {
      "id": "typologie_culturelle",
      "componentType": "Mermaid",
      "sectionAnchor": "## Typologies Culturelles",
      "props": {
        "code": "graph TD; A[Typologie de Cameron et Quinn] --> B(Clan); A --> C(Adhocratie); A --> D(Marché); A --> E(Hiérarchie); B -- Orientation --> F(Collaboration); C -- Orientation --> G(Création); D -- Orientation --> H(Compétition); E -- Orientation --> I(Contrôle);"
      }
    },
    {
      "id": "culture_strategie_performance",
      "componentType": "Video",
      "sectionAnchor": "## Culture, Stratégie et Performance",
      "props": {
        "title": "Culture, Stratégie et Performance: Une Analyse",
        "year": "2023"
      }
    },
    {
      "id": "culture_strategy_alignment",
      "componentType": "Image",
      "sectionAnchor": "## Culture, Stratégie et Performance",
      "props": {
        "description": "Ce diagramme illustre l'importance de l'alignement dynamique entre la culture organisationnelle et la stratégie pour assurer la performance et la durabilité à long terme. Il montre comment une culture forte et alignée peut faciliter l'exécution stratégique, tandis qu'une stratégie bien conçue peut renforcer et orienter la culture vers les objectifs souhaités, créant ainsi un avantage concurrentiel.",
        "title": "Alignement Culture-Stratégie",
        "year": "2022"
      }
    },
    {
      "id": "culture_evolution_flow",
      "componentType": "Mermaid",
      "sectionAnchor": "## Gestion et Évolution de la Culture",
      "props": {
        "code": "graph TD; A[Analyse Culturelle] --> B(Définition des Objectifs); B --> C(Planification des Interventions); C --> D(Mise en œuvre); D --> E(Évaluation et Ajustement); E --> A;"
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