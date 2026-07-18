You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "interactiveComponents": [
    {
      "id": "evolution_organisations",
      "componentType": "Mermaid",
      "sectionAnchor": "## L'évolution des formes organisationnelles",
      "props": {
        "code": "graph TD\n    A[Organisation Hiérarchique Traditionnelle] --> B(Organisation Matricielle)\n    B --> C(Organisation en Réseau)\n    C --> D(Organisation Plateforme)\n    D --> E(Organisation Décentralisée/DAO)\n\n    subgraph Caractéristiques\n        A -- Contrôle Centralisé --> F(Rigidité)\n        B -- Double Ligne de Rapport --> G(Complexité)\n        C -- Nœuds Interconnectés --> H(Flexibilité)\n        D -- Écosystème Ouvert --> I(Scalabilité)\n        E -- Gouvernance Distribuée --> J(Autonomie)\n    end\n\n    F & G & H & I & J -- Impact sur --> K(Management Stratégique)"
      }
    },
    {
      "id": "reseau_organisationnel",
      "componentType": "Image",
      "sectionAnchor": "## Les organisations en réseau",
      "props": {
        "description": "Une illustration schématique d'une organisation en réseau, où des nœuds circulaires représentent différentes entités (départements, équipes, partenaires externes) et des lignes interconnectées symbolisent les flux de communication, de collaboration et de ressources. La structure est décentralisée, sans point central unique de contrôle, mettant en évidence la fluidité des interactions et la capacité d'adaptation.",
        "title": "Organisation en Réseau",
        "year": "2023"
      }
    },
    {
      "id": "reseaux_organisationnels_explication",
      "componentType": "Video",
      "sectionAnchor": "## Les organisations en réseau",
      "props": {
        "title": "Principes et défis des organisations en réseau",
        "year": "2023"
      }
    },
    {
      "id": "continuum_organisationnel",
      "componentType": "Image",
      "sectionAnchor": "## Le continuum organisationnel",
      "props": {
        "description": "Un diagramme linéaire représentant le continuum des formes organisationnelles, allant des structures purement basées sur le marché (transactions ponctuelles, faible intégration) à l'extrême hiérarchie (intégration totale, contrôle centralisé). Au centre, diverses formes hybrides sont positionnées, telles que les alliances stratégiques, les coentreprises et les réseaux, illustrant des degrés variables d'intégration et de coordination entre les entités.",
        "title": "Le Continuum Organisationnel",
        "year": "2023"
      }
    },
    {
      "id": "facteurs_succes_partenariats",
      "componentType": "Mermaid",
      "sectionAnchor": "## Les partenariats stratégiques",
      "props": {
        "code": "graph TD\n    A[Partenariats Stratégiques] --> B(Confiance Mutuelle)\n    A --> C(Clarté des Objectifs)\n    A --> D(Communication Efficace)\n    A --> E(Partage des Risques et Bénéfices)\n    A --> F(Compatibilité Culturelle)\n    A --> G(Gouvernance Adaptée)\n\n    B & C & D & E & F & G -- Contribuent à --> H(Succès du Partenariat)"
      }
    },
    {
      "id": "modele_plateforme_numerique",
      "componentType": "Image",
      "sectionAnchor": "## Les organisations plateformes",
      "props": {
        "description": "Un schéma illustrant le fonctionnement d'une plateforme numérique, avec la plateforme centrale agissant comme un intermédiaire. Des flèches bidirectionnelles relient la plateforme aux 'utilisateurs' (consommateurs de services) et aux 'fournisseurs' (producteurs de services ou biens), montrant les interactions et les échanges de valeur facilités par la plateforme. Des éléments comme les algorithmes de mise en relation, les systèmes de réputation et les mécanismes de paiement sont implicitement représentés.",
        "title": "Modèle de Plateforme Numérique",
        "year": "2023"
      }
    },
    {
      "id": "impacts_plateformes_societe",
      "componentType": "Video",
      "sectionAnchor": "## Les organisations plateformes",
      "props": {
        "title": "Impacts sociaux et économiques des plateformes numériques",
        "year": "2023"
      }
    },
    {
      "id": "defis_opportunites_management",
      "componentType": "Image",
      "sectionAnchor": "## Défis et opportunités du management stratégique",
      "props": {
        "description": "Un diagramme conceptuel divisé en deux sections principales : 'Défis' et 'Opportunités' pour le management stratégique dans les nouvelles formes organisationnelles (réseaux et plateformes). Sous 'Défis', on trouve des points comme la gestion de la confiance, le contrôle sans hiérarchie, l'innovation ouverte et la gestion des risques. Sous 'Opportunités', sont listés la création de valeur, l'innovation accélérée et la résilience organisationnelle. Des flèches peuvent relier certains défis à des opportunités, suggérant que la résolution des défis peut débloquer des opportunités.",
        "title": "Défis et Opportunités du Management Stratégique",
        "year": "2023"
      }
    },
    {
      "id": "challenges_opportunities_flowchart",
      "componentType": "Mermaid",
      "sectionAnchor": "## Défis et opportunités du management stratégique",
      "props": {
        "code": "graph TD\n    A[Nouvelles Formes Organisationnelles] --> B{Défis?}\n    B -- Oui --> C[Gestion de la Confiance]\n    B -- Oui --> D[Contrôle sans Hiérarchie]\n    B -- Oui --> E[Innovation Ouverte]\n    B -- Oui --> F[Gestion des Risques]\n\n    A --> G{Opportunités?}\n    G -- Oui --> H[Création de Valeur Accrue]\n    G -- Oui --> I[Innovation Accélérée]\n    G -- Oui --> J[Résilience Organisationnelle]\n\n    C & D & E & F -- Nécessitent --> K[Nouvelles Compétences Managériales]\n    K -- Permettent de Saisir --> H & I & J\n    H & I & J -- Renforcent --> A"
      }
    },
    {
      "id": "future_of_organizations",
      "componentType": "Video",
      "sectionAnchor": "## L'avenir des organisations",
      "props": {
        "title": "L'avenir des organisations : IA, Métavers et Durabilité",
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