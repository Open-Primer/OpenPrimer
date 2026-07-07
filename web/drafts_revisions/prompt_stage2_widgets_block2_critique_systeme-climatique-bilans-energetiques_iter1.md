You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 2:
{
  "interactiveComponents": [
    {
      "id": "systeme_climatique",
      "componentType": "ConceptLink",
      "sectionAnchor": "Introduction aux Concepts Clés",
      "props": {}
    },
    {
      "id": "giec",
      "componentType": "RealPerson",
      "sectionAnchor": "Introduction aux Concepts Clés",
      "props": {}
    },
    {
      "id": "climate_system_components",
      "componentType": "Mermaid",
      "sectionAnchor": "Composantes du Système Climatique",
      "props": {
        "chart": "graph TD\n    A[Atmosphère] --> B(Hydrosphère)\n    A --> C(Cryosphère)\n    A --> D(Lithosphère)\n    A --> E(Biosphère)\n    B --> A\n    B --> C\n    C --> A\n    C --> B\n    D --> A\n    D --> E\n    E --> A\n    E --> B\n    E --> D\n    subgraph Système Climatique\n        A\n        B\n        C\n        D\n        E\n    end"
      }
    },
    {
      "id": "rayonnement_solaire",
      "componentType": "ConceptLink",
      "sectionAnchor": "Introduction aux Concepts Clés",
      "props": {}
    },
    {
      "id": "albedo",
      "componentType": "Glossary",
      "sectionAnchor": "Introduction aux Concepts Clés",
      "props": {}
    },
    {
      "id": "effet_de_serre",
      "componentType": "Glossary",
      "sectionAnchor": "Introduction aux Concepts Clés",
      "props": {}
    },
    {
      "id": "earth_energy_balance",
      "componentType": "Image",
      "sectionAnchor": "Bilan Énergétique Terrestre",
      "props": {
        "description": "A detailed scientific diagram illustrating the Earth's energy balance. It should show incoming shortwave solar radiation, its partial reflection by clouds and the surface (albedo), and absorption by the atmosphere and surface. It must also depict outgoing longwave infrared radiation from the Earth's surface and atmosphere, including the greenhouse effect where some infrared radiation is re-emitted back to the surface. Include numerical values for energy fluxes in W/m² to represent the balance.",
        "alt": "Diagram of Earth's energy balance showing incoming solar radiation and outgoing thermal radiation.",
        "caption": "<i>This diagram illustrates the complex interplay of incoming solar radiation and outgoing terrestrial radiation that governs Earth's climate. It highlights the role of atmospheric absorption, surface reflection (albedo), and the greenhouse effect in maintaining the planet's thermal equilibrium, which is fundamental to understanding climate change.</i>",
        "searchQuery": "Earth energy balance diagram",
        "title": "Bilan Énergétique Terrestre"
      }
    },
    {
      "id": "ges",
      "componentType": "Glossary",
      "sectionAnchor": "Introduction aux Concepts Clés",
      "props": {}
    },
    {
      "id": "atmospheric_composition_chart",
      "componentType": "Mermaid",
      "sectionAnchor": "Composition Atmosphérique",
      "props": {
        "chart": "graph TD\n    N[Azote (N2) 78%] --> A(Atmosphère)\n    O[Oxygène (O2) 21%] --> A\n    Ar[Argon (Ar) 0.9%] --> A\n    CO2[Dioxyde de Carbone (CO2) 0.04%] --> A\n    Autres[Autres gaz traces et vapeur d'eau] --> A"
      }
    },
    {
      "id": "corps_noir",
      "componentType": "Glossary",
      "sectionAnchor": "Introduction aux Concepts Clés",
      "props": {}
    },
    {
      "id": "loi_stefan_boltzmann",
      "componentType": "ConceptLink",
      "sectionAnchor": "Introduction aux Concepts Clés",
      "props": {}
    },
    {
      "id": "one_layer_model_diagram",
      "componentType": "Mermaid",
      "sectionAnchor": "Modèle Simple de l'Atmosphère",
      "props": {
        "chart": "graph TD\n    Sol[Soleil] -- Rayonnement Solaire --> Terre[Surface Terrestre]\n    Terre -- Rayonnement Infrarouge --> Atm[Couche Atmosphérique]\n    Atm -- Réémission Infrarouge --> Espace[Espace]\n    Atm -- Réémission Infrarouge --> Terre\n    Terre -- Absorption --> Chaleur(Chaleur)\n    Atm -- Absorption --> Chaleur"
      }
    },
    {
      "id": "bilan_energetique",
      "componentType": "ConceptLink",
      "sectionAnchor": "Introduction aux Concepts Clés",
      "props": {}
    },
    {
      "id": "composition_atmospherique",
      "componentType": "ConceptLink",
      "sectionAnchor": "Introduction aux Concepts Clés",
      "props": {}
    },
    {
      "id": "gaz_effet_serre",
      "componentType": "Glossary",
      "sectionAnchor": "Introduction aux Concepts Clés",
      "props": {}
    },
    {
      "id": "changement_climatique",
      "componentType": "ConceptLink",
      "sectionAnchor": "Introduction aux Concepts Clés",
      "props": {}
    },
    {
      "id": "climate_system_interdependence",
      "componentType": "Mermaid",
      "sectionAnchor": "Interdépendance du Système Climatique",
      "props": {
        "chart": "graph LR\n    A[Rayonnement Solaire] --> B(Température Terrestre)\n    B --> C(Évaporation / Humidité)\n    C --> D(Nuages)\n    D -- Réflexion --> A\n    D -- Effet de Serre --> B\n    B --> E(Fonte des Glaces)\n    E -- Diminution Albédo --> B\n    B --> F(Cycle du Carbone)\n    F -- Émission CO2 --> G(Concentration GES)\n    G -- Effet de Serre Accru --> B\n    B --> H(Courants Océaniques)\n    H -- Distribution Chaleur --> B"
      }
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