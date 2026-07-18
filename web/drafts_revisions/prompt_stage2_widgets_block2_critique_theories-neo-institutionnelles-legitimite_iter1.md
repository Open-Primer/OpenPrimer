You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 2:
{
  "interactiveComponents": [
    {
      "id": "weber_max",
      "componentType": "RealPerson",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "Max Weber",
        "searchQuery": "Max Weber",
        "wikipediaUrl": "https://en.wikipedia.org/wiki/Max_Weber",
        "year": "1864-1920"
      }
    },
    {
      "id": "neo_institutionnalisme",
      "componentType": "ConceptLink",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "néo-institutionnalisme",
        "searchQuery": "néo-institutionnalisme",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/N%C3%A9o-institutionnalisme",
        "year": "1970s"
      }
    },
    {
      "id": "dimaggio_powell",
      "componentType": "RealPerson",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "Paul J. DiMaggio",
        "searchQuery": "Paul J. DiMaggio",
        "wikipediaUrl": "https://en.wikipedia.org/wiki/Paul_DiMaggio",
        "year": "1951-"
      }
    },
    {
      "id": "legitimite_organisationnelle",
      "componentType": "Glossary",
      "sectionAnchor": "Main Content",
      "props": {
        "searchQuery": "légitimité organisationnelle",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/L%C3%A9gitimit%C3%A9_organisationnelle",
        "year": "1980s"
      }
    },
    {
      "id": "piliers_institutionnels",
      "componentType": "Glossary",
      "sectionAnchor": "Main Content",
      "props": {
        "searchQuery": "piliers institutionnels",
        "wikipediaUrl": "https://en.wikipedia.org/wiki/Institutional_theory",
        "year": "1990s"
      }
    },
    {
      "id": "isomorphisme",
      "componentType": "ConceptLink",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "isomorphisme",
        "searchQuery": "isomorphisme",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Isomorphisme_institutionnel",
        "year": "1983"
      }
    },
    {
      "id": "legitimite_organisationnelle",
      "componentType": "ConceptLink",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "légitimité organisationnelle",
        "searchQuery": "légitimité organisationnelle",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/L%C3%A9gitimit%C3%A9_organisationnelle",
        "year": "1980s"
      }
    },
    {
      "id": "decouplage",
      "componentType": "Glossary",
      "sectionAnchor": "Main Content",
      "props": {
        "searchQuery": "découplage",
        "wikipediaUrl": "https://en.wikipedia.org/wiki/Decoupling_(organizational_theory)",
        "year": "1977"
      }
    },
    {
      "id": "meyer_rowan",
      "componentType": "RealPerson",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "John W. Meyer",
        "searchQuery": "John W. Meyer",
        "wikipediaUrl": "https://en.wikipedia.org/wiki/John_W._Meyer",
        "year": "1935-"
      }
    },
    {
      "id": "champ_organisationnel",
      "componentType": "ConceptLink",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "champ organisationnel",
        "searchQuery": "champ organisationnel",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Champ_organisationnel",
        "year": "1983"
      }
    },
    {
      "id": "selznick_philip",
      "componentType": "RealPerson",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "Philip Selznick",
        "searchQuery": "Philip Selznick",
        "wikipediaUrl": "https://en.wikipedia.org/wiki/Philip_Selznick",
        "year": "1919-2010"
      }
    },
    {
      "id": "isomorphisme",
      "componentType": "ConceptLink",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "isomorphisme",
        "searchQuery": "isomorphisme",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Isomorphisme_institutionnel",
        "year": "1983"
      }
    },
    {
      "id": "de_institutionnalisation",
      "componentType": "Glossary",
      "sectionAnchor": "Main Content",
      "props": {
        "searchQuery": "dé-institutionnalisation",
        "wikipediaUrl": "https://en.wikipedia.org/wiki/Deinstitutionalisation",
        "year": "1960s"
      }
    },
    {
      "id": "friedberg_erhard",
      "componentType": "RealPerson",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "Erhard Friedberg",
        "searchQuery": "Erhard Friedberg",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Erhard_Friedberg",
        "year": "1942-"
      }
    },
    {
      "id": "crozier_michel",
      "componentType": "RealPerson",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "Michel Crozier",
        "searchQuery": "Michel Crozier",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Michel_Crozier",
        "year": "1922-2013"
      }
    },
    {
      "id": "isomorphisme_institutionnel",
      "componentType": "ConceptLink",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "isomorphisme institutionnel",
        "searchQuery": "isomorphisme institutionnel",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Isomorphisme_institutionnel",
        "year": "1983"
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