You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 2:
{
  "interactiveComponents": [
    {
      "id": "droit_obligations",
      "componentType": "ConceptLink",
      "sectionAnchor": "## Main Content",
      "props": {}
    },
    {
      "id": "accord_volontes",
      "componentType": "Glossary",
      "sectionAnchor": "## Main Content",
      "props": {}
    },
    {
      "id": "theorie_reception",
      "componentType": "ConceptLink",
      "sectionAnchor": "## Main Content",
      "props": {}
    },
    {
      "id": "pourparlers",
      "componentType": "Glossary",
      "sectionAnchor": "## Main Content",
      "props": {}
    },
    {
      "id": "vices_consentement",
      "componentType": "ConceptLink",
      "sectionAnchor": "## Main Content",
      "props": {}
    },
    {
      "id": "reticence_dolosive",
      "componentType": "Glossary",
      "sectionAnchor": "## Main Content",
      "props": {}
    },
    {
      "id": "ordre_public",
      "componentType": "ConceptLink",
      "sectionAnchor": "## Main Content",
      "props": {}
    },
    {
      "id": "force_obligatoire",
      "componentType": "ConceptLink",
      "sectionAnchor": "## Main Content",
      "props": {}
    },
    {
      "id": "mise_en_demeure",
      "componentType": "Glossary",
      "sectionAnchor": "## Main Content",
      "props": {}
    },
    {
      "id": "responsabilite_contractuelle",
      "componentType": "ConceptLink",
      "sectionAnchor": "## Main Content",
      "props": {}
    },
    {
      "id": "autonomie_volonte",
      "componentType": "ConceptLink",
      "sectionAnchor": "## Main Content",
      "props": {}
    },
    {
      "id": "force_obligatoire",
      "componentType": "Glossary",
      "sectionAnchor": "## Main Content",
      "props": {}
    },
    {
      "id": "jean_carbonnier",
      "componentType": "RealPerson",
      "sectionAnchor": "## Main Content",
      "props": {}
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