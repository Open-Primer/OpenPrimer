You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 2:
{
  "interactiveComponents": [
    {
      "id": "rupture_macro",
      "componentType": "ConceptLink",
      "sectionAnchor": "",
      "props": {
        "name": "rupture macroéconomique",
        "searchQuery": "Choc économique",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Choc_%C3%A9conomique",
        "year": "2008"
      }
    },
    {
      "id": "paradigme",
      "componentType": "Glossary",
      "sectionAnchor": "",
      "props": {
        "searchQuery": "Paradigme",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Paradigme",
        "year": "1962"
      }
    },
    {
      "id": "john_maynard_keynes",
      "componentType": "RealPerson",
      "sectionAnchor": "",
      "props": {
        "name": "John Maynard Keynes",
        "searchQuery": "John Maynard Keynes",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/John_Maynard_Keynes"
      }
    },
    {
      "id": "demande_effective",
      "componentType": "ConceptLink",
      "sectionAnchor": "",
      "props": {
        "name": "Demande effective",
        "searchQuery": "Demande effective",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Demande_effective"
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