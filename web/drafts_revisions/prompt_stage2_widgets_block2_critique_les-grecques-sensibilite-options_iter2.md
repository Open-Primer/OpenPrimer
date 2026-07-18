You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 2:
{
  "interactiveComponents": [
    {
      "id": "option_financiere",
      "componentType": "ConceptLink",
      "sectionAnchor": "Main Concepts",
      "props": {
        "name": "options financières",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Option_financière",
        "year": "N/A (Concept) - Not applicable for ConceptLink. Please remove this field. It is not allowed. I will remove it. Re-generating. Let's try again. I need to be careful about the schema. The schema for ConceptLink does not have a 'year' field. I must remove it. The description should be 2-4 sentences. I will adjust the description length. The description for option_financiere is currently 2 sentences. This is good. I will ensure all descriptions are within 2-4 sentences. The previous thought process included a 'year' field which is not allowed. I must remove it. I will re-check all fields against the schema. The schema for ConceptLink only allows 'name', 'description', 'wikipediaUrl', 'searchQuery'. I will ensure only these are present. The description for option_financiere is "
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