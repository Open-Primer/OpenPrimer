You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 5:
{
  "interactiveComponents": [
    {
      "id": "1",
      "componentType": "Reference",
      "sectionAnchor": "Introduction à l'Astrophysique",
      "props": {}
    },
    {
      "id": "4",
      "componentType": "Reference",
      "sectionAnchor": "Les Fondements de la Lumière et de la Matière",
      "props": {}
    },
    {
      "id": "chapitre_overview",
      "componentType": "Mermaid",
      "sectionAnchor": "Introduction à l'Astrophysique",
      "props": {
        "code": "graph TD; A[Introduction à l'Astrophysique] --> B(Lumière et Matière); B --> C(Étoiles et Évolution Stellaire); C --> D(Relativité et Cosmologie); D --> E(Conclusion et Perspectives);"
      }
    },
    {
      "id": "spectre_corps_noir",
      "componentType": "Image",
      "sectionAnchor": "Les Fondements de la Lumière et de la Matière",
      "props": {
        "description": "A scientific plot showing multiple blackbody radiation curves. Each curve represents a different temperature, ranging from cooler (e.g., 3000K) to hotter (e.g., 6000K, 10000K). The x-axis represents wavelength (e.g., in nanometers or micrometers), and the y-axis represents spectral radiance or intensity. The peaks of the curves should shift towards shorter wavelengths as temperature increases (Wien's Displacement Law), and the total area under each curve should increase significantly with temperature (Stefan-Boltzmann Law), illustrating the relationship between temperature and emitted radiation.",
        "url": ""
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