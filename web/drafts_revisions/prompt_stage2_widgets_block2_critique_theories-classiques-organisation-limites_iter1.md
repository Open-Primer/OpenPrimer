You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 2:
{
  "interactiveComponents": [
    {
      "id": "rationalisation",
      "componentType": "ConceptLink",
      "sectionAnchor": "## Section Name",
      "props": {
        "name": "Rationalisation",
        "searchQuery": "Rationalisation",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Rationalisation"
      }
    },
    {
      "id": "taylor_frederick",
      "componentType": "RealPerson",
      "sectionAnchor": "## Section Name",
      "props": {
        "name": "Frederick Winslow Taylor",
        "searchQuery": "Frederick Winslow Taylor",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Frederick_Winslow_Taylor"
      }
    },
    {
      "id": "fayol_henri",
      "componentType": "RealPerson",
      "sectionAnchor": "## Section Name",
      "props": {
        "name": "Henri Fayol",
        "searchQuery": "Henri Fayol",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Henri_Fayol"
      }
    },
    {
      "id": "weber_max",
      "componentType": "RealPerson",
      "sectionAnchor": "## Section Name",
      "props": {
        "name": "Max Weber",
        "searchQuery": "Max Weber",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Max_Weber"
      }
    },
    {
      "id": "bureaucratie",
      "componentType": "Glossary",
      "sectionAnchor": "## Section Name",
      "props": {
        "searchQuery": "Bureaucratie",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Bureaucratie"
      }
    },
    {
      "id": "productivite",
      "componentType": "Glossary",
      "sectionAnchor": "## Section Name",
      "props": {
        "searchQuery": "Productivité",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Productivit%C3%A9"
      }
    },
    {
      "id": "rationalisation",
      "componentType": "ConceptLink",
      "sectionAnchor": "## Section Name",
      "props": {
        "name": "Rationalisation",
        "searchQuery": "Rationalisation",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Rationalisation"
      }
    },
    {
      "id": "frederick_taylor",
      "componentType": "RealPerson",
      "sectionAnchor": "## Section Name",
      "props": {
        "name": "Frederick Taylor",
        "searchQuery": "Frederick Winslow Taylor",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Frederick_Winslow_Taylor"
      }
    },
    {
      "id": "henri_fayol",
      "componentType": "RealPerson",
      "sectionAnchor": "## Section Name",
      "props": {
        "name": "Henri Fayol",
        "searchQuery": "Henri Fayol",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Henri_Fayol"
      }
    },
    {
      "id": "deshumanisation_travail",
      "componentType": "ConceptLink",
      "sectionAnchor": "## Section Name",
      "props": {
        "name": "Déshumanisation du travail",
        "searchQuery": "Déshumanisation du travail",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/D%C3%A9shumanisation_du_travail"
      }
    },
    {
      "id": "elton_mayo",
      "componentType": "RealPerson",
      "sectionAnchor": "## Section Name",
      "props": {
        "name": "Elton Mayo",
        "searchQuery": "Elton Mayo",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Elton_Mayo"
      }
    },
    {
      "id": "rigidite_structurelle",
      "componentType": "Glossary",
      "sectionAnchor": "## Section Name",
      "props": {
        "searchQuery": "Rigidité structurelle",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Rigidit%C3%A9_structurelle"
      }
    },
    {
      "id": "theorie_contingence",
      "componentType": "ConceptLink",
      "sectionAnchor": "## Section Name",
      "props": {
        "name": "Théorie de la contingence",
        "searchQuery": "Théorie de la contingence",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Th%C3%A9orie_de_la_contingence"
      }
    },
    {
      "id": "standardisation",
      "componentType": "Glossary",
      "sectionAnchor": "## Section Name",
      "props": {
        "searchQuery": "Standardisation",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Standardisation"
      }
    },
    {
      "id": "hierarchie",
      "componentType": "ConceptLink",
      "sectionAnchor": "## Section Name",
      "props": {
        "name": "Hiérarchie",
        "searchQuery": "Hiérarchie",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Hi%C3%A9rarchie"
      }
    },
    {
      "id": "frederick_taylor",
      "componentType": "RealPerson",
      "sectionAnchor": "## Section Name",
      "props": {
        "name": "Frederick Taylor",
        "searchQuery": "Frederick Winslow Taylor",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Frederick_Winslow_Taylor"
      }
    },
    {
      "id": "rationalite_limitee",
      "componentType": "ConceptLink",
      "sectionAnchor": "## Section Name",
      "props": {
        "name": "Rationalité limitée",
        "searchQuery": "Rationalité limitée",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Rationalit%C3%A9_limit%C3%A9e"
      }
    },
    {
      "id": "management_participatif",
      "componentType": "Glossary",
      "sectionAnchor": "## Section Name",
      "props": {
        "searchQuery": "Management participatif",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Management_participatif"
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