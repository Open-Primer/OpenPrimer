You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 2:
{
  "interactiveComponents": [
    {
      "id": "sociologie_decisions",
      "componentType": "ConceptLink",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "sociologie des décisions",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Sociologie_des_organisations#La_sociologie_des_d%C3%A9cisions",
        "year": "N/A"
      }
    },
    {
      "id": "changement_strategique",
      "componentType": "Glossary",
      "sectionAnchor": "Main Content",
      "props": {
        "searchQuery": "changement stratégique",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Gestion_du_changement",
        "year": "N/A"
      }
    },
    {
      "id": "herbert_simon",
      "componentType": "RealPerson",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "Herbert Simon",
        "searchQuery": "Herbert Simon",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Herbert_Simon",
        "year": "N/A"
      }
    },
    {
      "id": "james_march",
      "componentType": "RealPerson",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "James March",
        "searchQuery": "James G. March",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/James_G._March",
        "year": "N/A"
      }
    },
    {
      "id": "michel_crozier",
      "componentType": "RealPerson",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "Michel Crozier",
        "searchQuery": "Michel Crozier",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Michel_Crozier",
        "year": "N/A"
      }
    },
    {
      "id": "erhard_friedberg",
      "componentType": "RealPerson",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "Erhard Friedberg",
        "searchQuery": "Erhard Friedberg",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Erhard_Friedberg",
        "year": "N/A"
      }
    },
    {
      "id": "kurt_lewin",
      "componentType": "RealPerson",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "Kurt Lewin",
        "searchQuery": "Kurt Lewin",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Kurt_Lewin",
        "year": "N/A"
      }
    },
    {
      "id": "rationalite_limitee",
      "componentType": "ConceptLink",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "rationalité limitée",
        "searchQuery": "rationalité limitée",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Rationalit%C3%A9_limit%C3%A9e",
        "year": "N/A"
      }
    },
    {
      "id": "edgar_schein",
      "componentType": "RealPerson",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "Edgar Schein",
        "searchQuery": "Edgar Schein",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Edgar_Schein",
        "year": "N/A"
      }
    },
    {
      "id": "isomorphisme_institutionnel",
      "componentType": "Glossary",
      "sectionAnchor": "Main Content",
      "props": {
        "searchQuery": "isomorphisme institutionnel",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Isomorphisme_institutionnel",
        "year": "N/A"
      }
    },
    {
      "id": "paul_dimaggio",
      "componentType": "RealPerson",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "Paul DiMaggio",
        "searchQuery": "Paul DiMaggio",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Paul_DiMaggio",
        "year": "N/A"
      }
    },
    {
      "id": "walter_powell",
      "componentType": "RealPerson",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "Walter Powell",
        "searchQuery": "Walter W. Powell",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Walter_W._Powell",
        "year": "N/A"
      }
    },
    {
      "id": "habitus",
      "componentType": "ConceptLink",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "habitus",
        "searchQuery": "habitus sociologie",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Habitus_(sociologie)",
        "year": "N/A"
      }
    },
    {
      "id": "pierre_bourdieu",
      "componentType": "RealPerson",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "Pierre Bourdieu",
        "searchQuery": "Pierre Bourdieu",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Pierre_Bourdieu",
        "year": "N/A"
      }
    },
    {
      "id": "resistance_changement",
      "componentType": "Glossary",
      "sectionAnchor": "Main Content",
      "props": {
        "searchQuery": "résistance au changement",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/R%C3%A9sistance_au_changement",
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