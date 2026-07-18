You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 2:
{
  "interactiveComponents": [
    {
      "id": "approche_contingente",
      "componentType": "ConceptLink",
      "sectionAnchor": "Introduction",
      "props": {
        "name": "l'approche contingente",
        "searchQuery": "Théorie de la contingence",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Théorie_de_la_contingence",
        "year": "1960s-1970s"
      }
    },
    {
      "id": "rationalite_limitee",
      "componentType": "ConceptLink",
      "sectionAnchor": "Introduction",
      "props": {
        "name": "la rationalité limitée",
        "searchQuery": "Rationalité limitée",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Rationalité_limitée",
        "year": "1950s"
      }
    },
    {
      "id": "taylor",
      "componentType": "RealPerson",
      "sectionAnchor": "Introduction",
      "props": {
        "name": "Frederick Winslow Taylor",
        "searchQuery": "Frederick Winslow Taylor",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Frederick_Winslow_Taylor"
      }
    },
    {
      "id": "fayol",
      "componentType": "RealPerson",
      "sectionAnchor": "Introduction",
      "props": {
        "name": "Henri Fayol",
        "searchQuery": "Henri Fayol",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Henri_Fayol"
      }
    },
    {
      "id": "weber",
      "componentType": "RealPerson",
      "sectionAnchor": "Introduction",
      "props": {
        "name": "Max Weber",
        "searchQuery": "Max Weber",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Max_Weber"
      }
    },
    {
      "id": "lawrence_lorsch",
      "componentType": "RealPerson",
      "sectionAnchor": "Introduction",
      "props": {
        "name": "Paul R. Lawrence et Jay W. Lorsch",
        "searchQuery": "Paul R. Lawrence et Jay W. Lorsch",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Paul_R._Lawrence"
      }
    },
    {
      "id": "burns_stalker",
      "componentType": "RealPerson",
      "sectionAnchor": "Introduction",
      "props": {
        "name": "Tom Burns et G.M. Stalker",
        "searchQuery": "Tom Burns et G.M. Stalker",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Tom_Burns_(sociologue)"
      }
    },
    {
      "id": "woodward",
      "componentType": "RealPerson",
      "sectionAnchor": "Introduction",
      "props": {
        "name": "Joan Woodward",
        "searchQuery": "Joan Woodward",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Joan_Woodward"
      }
    },
    {
      "id": "herbert_simon",
      "componentType": "RealPerson",
      "sectionAnchor": "Introduction",
      "props": {
        "name": "Herbert Simon",
        "searchQuery": "Herbert Simon",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Herbert_Simon"
      }
    },
    {
      "id": "satisficing",
      "componentType": "Glossary",
      "sectionAnchor": "Introduction",
      "props": {
        "searchQuery": "Satisficing",
        "wikipediaUrl": "https://en.wikipedia.org/wiki/Satisficing",
        "year": "1956"
      }
    },
    {
      "id": "heuristiques",
      "componentType": "ConceptLink",
      "sectionAnchor": "Introduction",
      "props": {
        "name": "heuristiques",
        "searchQuery": "Heuristique",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Heuristique"
      }
    },
    {
      "id": "biais_cognitifs",
      "componentType": "ConceptLink",
      "sectionAnchor": "Introduction",
      "props": {
        "name": "biais cognitifs",
        "searchQuery": "Biais cognitif",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Biais_cognitif"
      }
    },
    {
      "id": "determinisme_organisationnel",
      "componentType": "ConceptLink",
      "sectionAnchor": "Introduction",
      "props": {
        "name": "déterminisme organisationnel",
        "searchQuery": "Déterminisme organisationnel",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Déterminisme"
      }
    },
    {
      "id": "agency_strategique",
      "componentType": "ConceptLink",
      "sectionAnchor": "Introduction",
      "props": {
        "name": "l'action stratégique",
        "searchQuery": "Action stratégique",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Théorie_de_l%27acteur_stratégique"
      }
    },
    {
      "id": "vuca_world",
      "componentType": "ConceptLink",
      "sectionAnchor": "Introduction",
      "props": {
        "name": "monde VUCA",
        "searchQuery": "VUCA",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/VUCA"
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