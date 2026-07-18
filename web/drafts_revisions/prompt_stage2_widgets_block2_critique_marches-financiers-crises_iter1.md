You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 2:
{
  "interactiveComponents": [
    {
      "id": "marches_financiers",
      "componentType": "ConceptLink",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "marchés financiers",
        "searchQuery": "marchés financiers",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/March%C3%A9_financier",
        "year": "N/A"
      }
    },
    {
      "id": "bulle_speculative",
      "componentType": "Glossary",
      "sectionAnchor": "Main Content",
      "props": {
        "searchQuery": "bulle spéculative",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Bulle_sp%C3%A9culative",
        "year": "N/A"
      }
    },
    {
      "id": "hyman_minsky",
      "componentType": "RealPerson",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "Hyman Minsky",
        "searchQuery": "Hyman Minsky",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Hyman_Minsky",
        "year": "N/A"
      }
    },
    {
      "id": "effet_de_levier",
      "componentType": "Glossary",
      "sectionAnchor": "Main Content",
      "props": {
        "searchQuery": "effet de levier",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Effet_de_levier",
        "year": "N/A"
      }
    },
    {
      "id": "irving_fisher",
      "componentType": "RealPerson",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "Irving Fisher",
        "searchQuery": "Irving Fisher",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Irving_Fisher",
        "year": "N/A"
      }
    },
    {
      "id": "risque_systemique",
      "componentType": "ConceptLink",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "risque systémique",
        "searchQuery": "risque systémique",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Risque_syst%C3%A9mique",
        "year": "N/A"
      }
    },
    {
      "id": "bulle_financiere",
      "componentType": "Glossary",
      "sectionAnchor": "Main Content",
      "props": {
        "searchQuery": "bulles financières",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Bulle_sp%C3%A9culative",
        "year": "N/A"
      }
    },
    {
      "id": "irrational_exuberance",
      "componentType": "ConceptLink",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "exubérance irrationnelle",
        "searchQuery": "exubérance irrationnelle",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Exub%C3%A9rance_irrationnelle",
        "year": "N/A"
      }
    },
    {
      "id": "robert_shiller",
      "componentType": "RealPerson",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "Robert Shiller",
        "searchQuery": "Robert Shiller",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Robert_Shiller",
        "year": "N/A"
      }
    },
    {
      "id": "politiques_macroprudentielles",
      "componentType": "Glossary",
      "sectionAnchor": "Main Content",
      "props": {
        "searchQuery": "politiques macroprudentielles",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Politique_macroprudentielle",
        "year": "N/A"
      }
    },
    {
      "id": "exuberance_irrationnelle",
      "componentType": "ConceptLink",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "exubérance irrationnelle",
        "searchQuery": "exubérance irrationnelle",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Exub%C3%A9rance_irrationnelle",
        "year": "N/A"
      }
    },
    {
      "id": "contagion_financiere",
      "componentType": "ConceptLink",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "contagion financière",
        "searchQuery": "contagion financière",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Contagion_financière",
        "year": "N/A"
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