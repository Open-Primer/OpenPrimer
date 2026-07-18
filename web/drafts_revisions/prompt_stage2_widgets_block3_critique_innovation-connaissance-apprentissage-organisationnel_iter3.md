You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "interactiveComponents": [
    {
      "id": "enjeux_socio_eco",
      "componentType": "CustomFigure",
      "sectionAnchor": "Représentation des enjeux socio-économiques contemporains pour les organisations",
      "props": {
        "title": "Enjeux socio-économiques contemporains pour les organisations",
        "wikipediaLink": "https://fr.wikipedia.org/wiki/Enjeux_socio-%C3%A9conomiques",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Enjeux_socio-%C3%A9conomiques",
        "year": "2023"
      }
    },
    {
      "id": "modele_seci_nonaka",
      "componentType": "Image",
      "sectionAnchor": "Le modèle SECI de création de connaissance selon Nonaka et Takeuchi",
      "props": {
        "description": "Cette image représente le modèle SECI (Socialisation, Externalisation, Combinaison, Internalisation) de Nonaka et Takeuchi, un cadre théorique expliquant comment la connaissance est créée et transformée au sein des organisations. Elle détaille les quatre modes de conversion de la connaissance entre tacite et explicite, illustrant le processus dynamique de création de connaissance organisationnelle.",
        "title": "Modèle SECI de Nonaka et Takeuchi",
        "year": "1995"
      }
    },
    {
      "id": "lien_ico",
      "componentType": "Mermaid",
      "sectionAnchor": "Diagramme illustrant les liens entre Innovation, Connaissance et Apprentissage Organisationnel",
      "props": {
        "title": "Liens entre Innovation, Connaissance et Apprentissage Organisationnel",
        "wikipediaLink": "https://fr.wikipedia.org/wiki/Innovation",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Innovation",
        "year": "2023"
      }
    },
    {
      "id": "structure_innovation",
      "componentType": "CustomFigure",
      "sectionAnchor": "Impact des structures organisationnelles sur l'apprentissage et l'innovation",
      "props": {
        "title": "Impact des structures organisationnelles sur l'apprentissage et l'innovation",
        "wikipediaLink": "https://fr.wikipedia.org/wiki/Structure_organisationnelle",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Structure_organisationnelle",
        "year": "2023"
      }
    },
    {
      "id": "facteurs_intra_org",
      "componentType": "Mermaid",
      "sectionAnchor": "Facteurs sociaux intra-organisationnels de l'apprentissage et de l'innovation",
      "props": {
        "title": "Facteurs sociaux intra-organisationnels de l'apprentissage et de l'innovation",
        "wikipediaLink": "https://fr.wikipedia.org/wiki/Culture_d%27entreprise",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Culture_d%27entreprise",
        "year": "2023"
      }
    },
    {
      "id": "types_reseaux_innovation",
      "componentType": "CustomFigure",
      "sectionAnchor": "Typologie des relations inter-organisationnelles pour l'innovation",
      "props": {
        "title": "Typologie des relations inter-organisationnelles pour l'innovation",
        "wikipediaLink": "https://fr.wikipedia.org/wiki/R%C3%A9seau_d%27innovation",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/R%C3%A9seau_d%27innovation",
        "year": "2023"
      }
    },
    {
      "id": "reseaux_innovation_ex",
      "componentType": "Video",
      "sectionAnchor": "Exemple de réseau d'innovation ou de cluster",
      "props": {
        "title": "La Silicon Valley : Un Écosystème d'Innovation",
        "year": "2018"
      }
    },
    {
      "id": "synthese_innovation_apprentissage",
      "componentType": "CustomFigure",
      "sectionAnchor": "Interdépendance entre innovation, connaissance et apprentissage organisationnel",
      "props": {
        "title": "Interdépendance entre innovation, connaissance et apprentissage organisationnel",
        "wikipediaLink": "https://fr.wikipedia.org/wiki/Apprentissage_organisationnel",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Apprentissage_organisationnel",
        "year": "2023"
      }
    },
    {
      "id": "defis_perspectives_innovation",
      "componentType": "Mermaid",
      "sectionAnchor": "Défis et perspectives pour l'innovation et l'apprentissage",
      "props": {
        "title": "Défis et perspectives pour l'innovation et l'apprentissage",
        "wikipediaLink": "https://fr.wikipedia.org/wiki/Innovation_ouverte",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Innovation_ouverte",
        "year": "2023"
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