You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 2:
{
  "interactiveComponents": [
    {
      "id": "acoustique",
      "componentType": "Glossary",
      "sectionAnchor": "Introduction",
      "props": {
        "description": "L'acoustique est la science qui étudie le son, les infrasons et les ultrasons. Elle s'intéresse à leur production, leur transmission, leur réception et leurs effets. Ce domaine couvre un large éventail d'applications, de la musique à l'ingénierie, en passant par la médecine.",
        "name": "acoustique",
        "text": "L'acoustique est la science qui étudie le son, les infrasons et les ultrasons. Elle s'intéresse à leur production, leur transmission, leur réception et leurs effets. Ce domaine couvre un large éventail d'applications, de la musique à l'ingénierie, en passant par la médecine.",
        "title": "acoustique"
      }
    },
    {
      "id": "pythagore",
      "componentType": "RealPerson",
      "sectionAnchor": "Les origines antiques de l'acoustique",
      "props": {
        "description": "Pythagore était un mathématicien et philosophe grec de l'Antiquité, fondateur de l'école pythagoricienne."
      }
    }
  ]
}

Ensure:
1. Every anchor specified in the prompt is mapped.
2. Captions and descriptions have no sequential figure prefixes like "Figure 1:".
3. Biography component details (dates, Wikipedia link) are correct.
4. ZERO placeholders, draft markers, bracketed texts, or template values are present. Biographies, interactive elements, figures, and diagrams must be fully populated with real, high-quality, professional educational content in the target language. Absolutely no fake URLs, lorem ipsum text, "N/A", "## Section Name", or incomplete fields. Reject the block if any placeholder or skeletal text is detected.
5. The "year", "dates", "url", or "wikipediaLink" properties can be "null" or omitted for components that do not require them or where the resource is unresolved/needs backend matching (such as ConceptLink, Location, Glossary, Image, Audio, and Video). Do NOT reject the block or treat "null" or omission as a placeholder or incomplete for these properties on non-applicable component types.
6. CRITICAL WIDGET CONNECTION: Every interactive component or hover card (Biography, RealPerson, HistoricalPerson, ConceptLink, Location, Glossary, EventLink) must be strongly connected to the lesson's topics, informative, and detailed.

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