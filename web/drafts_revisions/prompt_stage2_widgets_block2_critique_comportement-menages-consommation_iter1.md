You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 2:
{
  "interactiveComponents": [
    {
      "id": "consommation_intertemporelle",
      "componentType": "ConceptLink",
      "sectionAnchor": "Consommation Intertemporelle",
      "props": {
        "name": "consommation intertemporelle",
        "searchQuery": "consommation intertemporelle",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Consommation_intertemporelle"
      }
    },
    {
      "id": "irving_fisher",
      "componentType": "RealPerson",
      "sectionAnchor": "Irving Fisher",
      "props": {
        "name": "Irving Fisher",
        "searchQuery": "Irving Fisher",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Irving_Fisher"
      }
    },
    {
      "id": "franco_modigliani",
      "componentType": "RealPerson",
      "sectionAnchor": "Franco Modigliani",
      "props": {
        "name": "Franco Modigliani",
        "searchQuery": "Franco Modigliani",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Franco_Modigliani"
      }
    },
    {
      "id": "milton_friedman",
      "componentType": "RealPerson",
      "sectionAnchor": "Milton Friedman",
      "props": {
        "name": "Milton Friedman",
        "searchQuery": "Milton Friedman",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Milton_Friedman"
      }
    },
    {
      "id": "equation_euler",
      "componentType": "Glossary",
      "sectionAnchor": "Équation d'Euler",
      "props": {
        "searchQuery": "équation d'Euler économie",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/%C3%89quation_d%27Euler_(%C3%A9conomie)"
      }
    },
    {
      "id": "facteur_actualisation",
      "componentType": "Glossary",
      "sectionAnchor": "Facteur d'actualisation",
      "props": {
        "searchQuery": "facteur d'actualisation",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Actualisation"
      }
    },
    {
      "id": "utilite_marginale",
      "componentType": "ConceptLink",
      "sectionAnchor": "L'utilité marginale",
      "props": {
        "name": "L'utilité marginale",
        "searchQuery": "utilité marginale",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Utilit%C3%A9_marginale"
      }
    },
    {
      "id": "lissage_consommation",
      "componentType": "ConceptLink",
      "sectionAnchor": "Lissage de la consommation",
      "props": {
        "name": "lissage de la consommation",
        "searchQuery": "lissage de la consommation",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Lissage_de_la_consommation"
      }
    },
    {
      "id": "friedman",
      "componentType": "RealPerson",
      "sectionAnchor": "Milton Friedman",
      "props": {
        "name": "Milton Friedman",
        "searchQuery": "Milton Friedman",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Milton_Friedman"
      }
    },
    {
      "id": "modigliani",
      "componentType": "RealPerson",
      "sectionAnchor": "Franco Modigliani",
      "props": {
        "name": "Franco Modigliani",
        "searchQuery": "Franco Modigliani",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Franco_Modigliani"
      }
    },
    {
      "id": "effet_substitution",
      "componentType": "Glossary",
      "sectionAnchor": "Effet de substitution",
      "props": {
        "searchQuery": "effet de substitution",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Effet_de_substitution"
      }
    },
    {
      "id": "effet_richesse",
      "componentType": "Glossary",
      "sectionAnchor": "Effet de richesse",
      "props": {
        "searchQuery": "effet de richesse économie",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Effet_de_revenu"
      }
    },
    {
      "id": "intertemporal_optimization",
      "componentType": "ConceptLink",
      "sectionAnchor": "Modèle d'optimisation intertemporelle",
      "props": {
        "name": "modèle d'optimisation intertemporelle",
        "searchQuery": "modèle d'optimisation intertemporelle",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Consommation_intertemporelle"
      }
    },
    {
      "id": "euler_equation",
      "componentType": "Glossary",
      "sectionAnchor": "Équation d'Euler",
      "props": {
        "searchQuery": "équation d'Euler économie",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/%C3%89quation_d%27Euler_(%C3%A9conomie)"
      }
    },
    {
      "id": "substitution_effect",
      "componentType": "ConceptLink",
      "sectionAnchor": "Effet de substitution",
      "props": {
        "name": "effet de substitution",
        "searchQuery": "effet de substitution",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Effet_de_substitution"
      }
    },
    {
      "id": "wealth_effect",
      "componentType": "ConceptLink",
      "sectionAnchor": "Effet de richesse",
      "props": {
        "name": "effet de richesse",
        "searchQuery": "effet de richesse économie",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Effet_de_revenu"
      }
    }
  ]
}

Ensure:
1. Every anchor specified in the prompt is mapped.
2. Captions and descriptions have no sequential figure prefixes like "Figure 1:".
3. Biography component details (dates, Wikipedia link) are correct.
4. ZERO placeholders, draft markers, bracketed texts, or template values are present. Biographies, interactive elements, figures, and diagrams must be fully populated with real, high-quality, professional educational content in the target language. Absolutely no fake URLs, lorem ipsum text, or incomplete fields. Reject the block if any placeholder or skeletal text is detected.
5. The "year", "dates", "url", or "wikipediaLink" properties can be "null" or omitted for components that do not require them or where the resource is unresolved/needs backend matching (such as ConceptLink, Location, Glossary, Image, Audio, and Video). Do NOT reject the block or treat "null" or omission as a placeholder or incomplete for these properties on non-applicable component types.

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