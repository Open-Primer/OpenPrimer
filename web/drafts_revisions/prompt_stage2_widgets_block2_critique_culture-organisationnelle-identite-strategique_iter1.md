You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 2:
{
  "interactiveComponents": [
    {
      "id": "culture_organisationnelle",
      "componentType": "ConceptLink",
      "sectionAnchor": "",
      "props": {
        "name": "culture organisationnelle",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Culture_organisationnelle"
      }
    },
    {
      "id": "schein",
      "componentType": "RealPerson",
      "sectionAnchor": "",
      "props": {
        "name": "Edgar Schein",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Edgar_Schein"
      }
    },
    {
      "id": "identite_strategique",
      "componentType": "ConceptLink",
      "sectionAnchor": "",
      "props": {
        "name": "identité stratégique",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Identit%C3%A9_strat%C3%A9gique"
      }
    },
    {
      "id": "artefacts",
      "componentType": "Glossary",
      "sectionAnchor": "",
      "props": {
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Artefact_(culture)"
      }
    },
    {
      "id": "postulats_de_base",
      "componentType": "Glossary",
      "sectionAnchor": "",
      "props": {
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Culture_organisationnelle#Les_trois_niveaux_de_la_culture_selon_Schein"
      }
    },
    {
      "id": "hofstede",
      "componentType": "RealPerson",
      "sectionAnchor": "",
      "props": {
        "name": "Geert Hofstede",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Geert_Hofstede"
      }
    },
    {
      "id": "socialisation_organisationnelle",
      "componentType": "ConceptLink",
      "sectionAnchor": "",
      "props": {
        "name": "socialisation organisationnelle",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Socialisation_organisationnelle"
      }
    },
    {
      "id": "nonaka",
      "componentType": "RealPerson",
      "sectionAnchor": "",
      "props": {
        "name": "Ikujiro Nonaka",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Ikujiro_Nonaka"
      }
    },
    {
      "id": "takeuchi",
      "componentType": "RealPerson",
      "sectionAnchor": "",
      "props": {
        "name": "Hirotaka Takeuchi",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Hirotaka_Takeuchi"
      }
    },
    {
      "id": "friedberg",
      "componentType": "RealPerson",
      "sectionAnchor": "",
      "props": {
        "name": "Erhard Friedberg",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Erhard_Friedberg"
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