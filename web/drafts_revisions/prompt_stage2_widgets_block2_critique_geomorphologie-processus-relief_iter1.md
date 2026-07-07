You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 2:
{
  "interactiveComponents": [
    {
      "id": "processus_endogenes",
      "componentType": "ConceptLink",
      "sectionAnchor": "## Processus Endogènes",
      "props": {}
    },
    {
      "id": "processus_exogenes",
      "componentType": "Glossary",
      "sectionAnchor": "## Processus Exogènes",
      "props": {}
    },
    {
      "id": "geomorphologie_overview",
      "componentType": "Mermaid",
      "sectionAnchor": "## Géomorphologie: Introduction",
      "props": {
        "chart": "graph TD; A[Géomorphologie] --> B(Processus Endogènes); A --> C(Processus Exogènes); B --> D{Tectonique des plaques}; B --> E{Volcanisme}; B --> F{Séismes}; C --> G{Érosion}; C --> H{Transport}; C --> I{Sédimentation}; G --> J(Eau); G --> K(Vent); G --> L(Glace); G --> M(Gravité);"
      }
    },
    {
      "id": "tectonique_plaques",
      "componentType": "ConceptLink",
      "sectionAnchor": "## Processus Endogènes",
      "props": {}
    }
  ]
}

Ensure:
1. Every anchor specified in the prompt is mapped.
2. Captions and descriptions have no sequential figure prefixes like "Figure 1:".
3. Biography component details (dates, Wikipedia link) are correct.

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