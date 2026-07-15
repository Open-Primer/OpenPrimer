You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 5:
{
  "interactiveComponents": [
    {
      "id": "1",
      "componentType": "Reference",
      "sectionAnchor": "## Introduction aux fondements de l'astrophysique",
      "props": {
        "text": "Carroll, Bradley W., and Dale A. Ostlie. An Introduction to Modern Astrophysics. 2nd ed., Pearson, 2007."
      }
    },
    {
      "id": "4",
      "componentType": "Reference",
      "sectionAnchor": "## Introduction aux fondements de l'astrophysique",
      "props": {
        "text": "Schutz, Bernard F. A First Course in General Relativity. 2nd ed., Cambridge University Press, 2009."
      }
    },
    {
      "id": "chapitre_overview",
      "componentType": "Mermaid",
      "sectionAnchor": "## Introduction aux fondements de l'astrophysique",
      "props": {
        "code": "graph TD\n A[Astrophysique] --> B(Rayonnement Stellaire);\n A --> C(Structure et Évolution Stellaire);\n A --> D(Relativité et Cosmologie);\n B --> B1(Lois de Planck, Wien, Stefan-Boltzmann);\n B --> B2(Spectroscopie et Composition);\n C --> C1(Formation Stellaire);\n C --> C2(Séquence Principale);\n C --> C3(Phases Post-Séquence Principale);\n C --> C4(Diagramme de Hertzsprung-Russell);\n D --> D1(Relativité Restreinte);\n D --> D2(Relativité Générale et Trous Noirs);\n D --> D3(Cosmologie: Big Bang, Expansion);\n B1 & B2 --> C;\n C4 --> B;\n C3 --> D;"
      }
    },
    {
      "id": "spectre_corps_noir",
      "componentType": "Image",
      "sectionAnchor": "## Rayonnement et Spectroscopie Stellaires",
      "props": {
        "description": "A scientific plot showing multiple blackbody radiation curves. The x-axis represents wavelength (e.g., in nanometers or micrometers), and the y-axis represents spectral radiance or intensity. Each curve corresponds to a different temperature, ranging from cooler (e.g., 3000 K) to hotter (e.g., 6000 K, 10000 K). The peak of each curve should shift towards shorter wavelengths as temperature increases (Wien's Displacement Law), and the total area under each curve should increase significantly with temperature (Stefan-Boltzmann Law). The curves should be smooth and bell-shaped, characteristic of thermal radiation.",
        "title": "Rayonnement de Corps Noir",
        "url": "",
        "wikipediaLink": "",
        "wikipediaUrl": "",
        "year": "2023-10-26T10:00:00Z-05:00[America/New_York]"
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