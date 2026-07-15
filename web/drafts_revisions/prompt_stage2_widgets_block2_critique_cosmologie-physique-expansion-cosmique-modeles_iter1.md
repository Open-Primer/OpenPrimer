You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 2:
{
  "interactiveComponents": [
    {
      "id": "cosmologie_physique",
      "componentType": "ConceptLink",
      "sectionAnchor": "## Section Name",
      "props": {
        "name": "cosmologie physique",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Cosmologie_physique",
        "year": "N/A (concept established over time, not a single year or event.)"
      }
    },
    {
      "id": "einstein",
      "componentType": "RealPerson",
      "sectionAnchor": "## Section Name",
      "props": {
        "name": "Albert Einstein",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Albert_Einstein",
        "year": "1879-1955"
      }
    },
    {
      "id": "univers_observable",
      "componentType": "Glossary",
      "sectionAnchor": "## Section Name",
      "props": {
        "name": "Univers observable",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Univers_observable",
        "year": "N/A (concept)"
      }
    },
    {
      "id": "decalage_vers_rouge",
      "componentType": "ConceptLink",
      "sectionAnchor": "## Section Name",
      "props": {
        "name": "Décalage vers le rouge",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/D%C3%A9calage_vers_le_rouge",
        "year": "N/A (phenomenon)"
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