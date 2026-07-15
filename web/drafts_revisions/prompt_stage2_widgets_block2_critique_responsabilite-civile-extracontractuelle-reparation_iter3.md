You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 2:
{
  "interactiveComponents": [
    {
      "id": "responsabilite_civile_extracontractuelle",
      "componentType": "ConceptLink",
      "sectionAnchor": "## Introduction",
      "props": {
        "name": "responsabilité civile extracontractuelle",
        "searchQuery": "responsabilité civile extracontractuelle",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Responsabilit%C3%A9_civile_en_droit_fran%C3%A7ais#Responsabilit%C3%A9_extracontractuelle",
        "year": ""
      }
    },
    {
      "id": "responsabilite_contractuelle",
      "componentType": "ConceptLink",
      "sectionAnchor": "## Introduction",
      "props": {
        "name": "responsabilité contractuelle",
        "searchQuery": "responsabilité contractuelle",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Responsabilit%C3%A9_contractuelle_en_droit_fran%C3%A7ais",
        "year": ""
      }
    },
    {
      "id": "pothier",
      "componentType": "RealPerson",
      "sectionAnchor": "## Introduction",
      "props": {
        "name": "Robert Joseph Pothier",
        "searchQuery": "Robert Joseph Pothier",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Robert_Joseph_Pothier",
        "year": "1699-1772"
      }
    },
    {
      "id": "faute",
      "componentType": "Glossary",
      "sectionAnchor": "## Introduction",
      "props": {
        "searchQuery": "faute droit",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Faute_(droit)",
        "year": ""
      }
    },
    {
      "id": "garde_chose",
      "componentType": "ConceptLink",
      "sectionAnchor": "## Introduction",
      "props": {
        "name": "garde d'une chose",
        "searchQuery": "garde d'une chose droit",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Garde_d%27une_chose",
        "year": ""
      }
    },
    {
      "id": "pretium_doloris",
      "componentType": "Glossary",
      "sectionAnchor": "## Introduction",
      "props": {
        "searchQuery": "Pretium doloris",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Pretium_doloris",
        "year": ""
      }
    },
    {
      "id": "perte_de_chance",
      "componentType": "ConceptLink",
      "sectionAnchor": "## Introduction",
      "props": {
        "name": "perte de chance",
        "searchQuery": "perte de chance droit",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Perte_de_chance",
        "year": ""
      }
    },
    {
      "id": "carbonnier_jean",
      "componentType": "RealPerson",
      "sectionAnchor": "## Introduction",
      "props": {
        "name": "Jean Carbonnier",
        "searchQuery": "Jean Carbonnier",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Jean_Carbonnier",
        "year": "1908-2003"
      }
    },
    {
      "id": "in_concreto",
      "componentType": "Glossary",
      "sectionAnchor": "## Introduction",
      "props": {
        "searchQuery": "in concreto droit",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/In_concreto",
        "year": ""
      }
    },
    {
      "id": "partage_responsabilite",
      "componentType": "ConceptLink",
      "sectionAnchor": "## Introduction",
      "props": {
        "name": "partage de responsabilité",
        "searchQuery": "partage de responsabilité droit",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Partage_de_responsabilit%C3%A9",
        "year": ""
      }
    },
    {
      "id": "reparation_integrale",
      "componentType": "ConceptLink",
      "sectionAnchor": "## Introduction",
      "props": {
        "name": "réparation intégrale",
        "searchQuery": "réparation intégrale droit",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/R%C3%A9paration_int%C3%A9grale",
        "year": ""
      }
    },
    {
      "id": "prejudice_ecologique",
      "componentType": "Glossary",
      "sectionAnchor": "## Introduction",
      "props": {
        "searchQuery": "préjudice écologique",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Pr%C3%A9judice_%C3%A9cologique",
        "year": ""
      }
    }
  ]
}

Ensure:
1. Every anchor specified in the prompt is mapped.
2. Captions and descriptions have no sequential figure prefixes like "Figure 1:".
3. Biography component details (dates, Wikipedia link) are correct.
4. ZERO placeholders, draft markers, bracketed texts, or template values are present. Biographies, interactive elements, figures, and diagrams must be fully populated with real, high-quality, professional educational content in the target language. Absolutely no fake URLs, lorem ipsum text, or incomplete fields. Reject the block if any placeholder or skeletal text is detected.

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