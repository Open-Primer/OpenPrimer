You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 2:
{
  "interactiveComponents": [
    {
      "id": "nouvelle_macroeconomie_classique",
      "componentType": "ConceptLink",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "Nouvelle macroéconomie classique",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Nouvelle_macro%C3%A9conomie_classique",
        "year": "1970s (development period)"
      }
    },
    {
      "id": "nouvelle_macroeconomie_keynesienne",
      "componentType": "ConceptLink",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "Nouvelle macroéconomie keynésienne",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Nouvelle_macro%C3%A9conomie_keyn%C3%A9sienne",
        "year": "1980s (development period)"
      }
    },
    {
      "id": "critique_de_lucas",
      "componentType": "ConceptLink",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "Critique de Lucas",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Critique_de_Lucas",
        "year": "1976"
      }
    },
    {
      "id": "agent_representatif",
      "componentType": "Glossary",
      "sectionAnchor": "Main Content",
      "props": {
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Agent_repr%C3%A9sentatif",
        "year": "N/A"
      }
    },
    {
      "id": "optimisation_intertemporelle",
      "componentType": "ConceptLink",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "Optimisation intertemporelle",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Optimisation_intertemporelle",
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