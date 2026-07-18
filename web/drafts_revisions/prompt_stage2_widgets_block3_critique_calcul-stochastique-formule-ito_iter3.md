You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 3:
{
  "interactiveComponents": [
    {
      "id": "market_volatility",
      "componentType": "Image",
      "sectionAnchor": "Introduction au Calcul Stochastique",
      "props": {
        "description": "Cette image représente de manière stylisée la volatilité des marchés financiers, souvent caractérisée par des mouvements erratiques et imprévisibles des prix des actifs. Les lignes sinueuses et les pics abrupts symbolisent les fluctuations rapides et l'incertitude inhérente aux marchés, où les prix peuvent changer de direction brusquement en réponse à divers facteurs économiques, politiques ou psychologiques. Cette représentation visuelle aide à comprendre la nature non-déterministe des trajectoires financières, qui est au cœur de l'étude du calcul stochastique.",
        "title": "Volatilité des Marchés Financiers",
        "year": "2023"
      }
    },
    {
      "id": "classical_vs_stochastic_calculus",
      "componentType": "Mermaid",
      "sectionAnchor": "Introduction au Calcul Stochastique",
      "props": {
        "title": "Comparaison conceptuelle du calcul classique et du calcul stochastique",
        "wikipediaLink": "https://fr.wikipedia.org/wiki/Calcul_stochastique",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Calcul_stochastique",
        "year": "2023"
      }
    },
    {
      "id": "brownian_path",
      "componentType": "CustomFigure",
      "sectionAnchor": "Introduction au Calcul Stochastique",
      "props": {
        "title": "Exemple de Trajectoire de Mouvement Brownien",
        "wikipediaLink": "https://fr.wikipedia.org/wiki/Mouvement_brownien",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Mouvement_brownien",
        "year": "2023"
      }
    },
    {
      "id": "ito_vs_classical_chain_rule",
      "componentType": "Mermaid",
      "sectionAnchor": "Introduction au Calcul Stochastique",
      "props": {
        "title": "Comparaison schématique de la règle de la chaîne classique et de la formule d'Itô",
        "wikipediaLink": "https://fr.wikipedia.org/wiki/Lemme_d%27It%C3%B4",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Lemme_d%27It%C3%B4",
        "year": "2023"
      }
    },
    {
      "id": "ito_intuition_variance",
      "componentType": "CustomFigure",
      "sectionAnchor": "Introduction au Calcul Stochastique",
      "props": {
        "title": "Illustration intuitive du rôle de la variance dans la formule d'Itô",
        "wikipediaLink": "https://fr.wikipedia.org/wiki/Lemme_d%27It%C3%B4",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Lemme_d%27It%C3%B4",
        "year": "2023"
      }
    },
    {
      "id": "gbm_derivation",
      "componentType": "SolvedExercise",
      "sectionAnchor": "Introduction au Calcul Stochastique",
      "props": {
        "title": "Dérivation du Mouvement Brownien Géométrique (MBG) via la Formule d'Itô",
        "wikipediaLink": "https://fr.wikipedia.org/wiki/Mouvement_brownien_g%C3%A9om%C3%A9trique",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Mouvement_brownien_g%C3%A9om%C3%A9trique",
        "year": "2023"
      }
    },
    {
      "id": "black_scholes_framework",
      "componentType": "CustomFigure",
      "sectionAnchor": "Introduction au Calcul Stochastique",
      "props": {
        "title": "Schéma Conceptuel du Modèle de Black-Scholes",
        "wikipediaLink": "https://fr.wikipedia.org/wiki/Mod%C3%A8le_de_Black-Scholes",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Mod%C3%A8le_de_Black-Scholes",
        "year": "2023"
      }
    },
    {
      "id": "ito_applications_flow",
      "componentType": "Mermaid",
      "sectionAnchor": "Introduction au Calcul Stochastique",
      "props": {
        "title": "Flux des applications de la formule d'Itô en finance quantitative",
        "wikipediaLink": "https://fr.wikipedia.org/wiki/Finance_quantitative",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Finance_quantitative",
        "year": "2023"
      }
    },
    {
      "id": "hull_ito_importance",
      "componentType": "Quote",
      "sectionAnchor": "Introduction au Calcul Stochastique",
      "props": {
        "quote": "Le calcul stochastique, et en particulier le lemme d'Itô, est la pierre angulaire de la finance quantitative moderne. Sans lui, il serait impossible de dériver et de comprendre les modèles d'évaluation des options et de gestion des risques que nous utilisons aujourd'hui.",
        "wikipediaLink": "https://fr.wikipedia.org/wiki/John_C._Hull",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/John_C._Hull",
        "year": "2023"
      }
    },
    {
      "id": "ito_multidim_example",
      "componentType": "SolvedExercise",
      "sectionAnchor": "Introduction au Calcul Stochastique",
      "props": {
        "title": "Exemple d'Application du Lemme d'Itô Multidimensionnel",
        "wikipediaLink": "https://fr.wikipedia.org/wiki/Lemme_d%27It%C3%B4",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Lemme_d%27It%C3%B4",
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