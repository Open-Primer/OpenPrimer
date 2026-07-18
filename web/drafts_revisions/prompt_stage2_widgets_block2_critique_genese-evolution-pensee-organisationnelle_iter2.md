You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 2:
{
  "interactiveComponents": [
    {
      "id": "management_strategique",
      "componentType": "ConceptLink",
      "sectionAnchor": "Lesson Content",
      "props": {
        "name": "management stratégique",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Management_strat%C3%A9gique",
        "year": "N/A"
      }
    },
    {
      "id": "pens_org",
      "componentType": "ConceptLink",
      "sectionAnchor": "Lesson Content",
      "props": {
        "name": "Pensée Organisationnelle",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Th%C3%A9orie_des_organisations",
        "year": "N/A"
      }
    },
    {
      "id": "paradigme",
      "componentType": "Glossary",
      "sectionAnchor": "Lesson Content",
      "props": {
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Paradigme",
        "year": "N/A"
      }
    },
    {
      "id": "max_weber",
      "componentType": "RealPerson",
      "sectionAnchor": "Lesson Content",
      "props": {
        "name": "Max Weber",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Max_Weber",
        "year": "N/A"
      }
    },
    {
      "id": "bureaucratie",
      "componentType": "ConceptLink",
      "sectionAnchor": "Lesson Content",
      "props": {
        "name": "bureaucratie",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Bureaucratie",
        "year": "N/A"
      }
    },
    {
      "id": "f_w_taylor",
      "componentType": "RealPerson",
      "sectionAnchor": "Lesson Content",
      "props": {
        "name": "Frederick Winslow Taylor",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Frederick_Winslow_Taylor",
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