You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 2:
{
  "interactiveComponents": [
    {
      "id": "cosmologie_physique",
      "componentType": "ConceptLink",
      "sectionAnchor": "Introduction à la Cosmologie",
      "props": {
        "name": "Cosmologie physique",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Cosmologie_physique",
        "year": "N/A (concept established over time, not a single year or event.)"
      }
    },
    {
      "id": "einstein",
      "componentType": "RealPerson",
      "sectionAnchor": "Introduction à la Cosmologie",
      "props": {
        "name": "Albert Einstein",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Albert_Einstein",
        "year": "N/A (person)"
      }
    },
    {
      "id": "univers_observable",
      "componentType": "Glossary",
      "sectionAnchor": "Introduction à la Cosmologie",
      "props": {
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Univers_observable",
        "year": "N/A (concept)"
      }
    },
    {
      "id": "decalage_vers_rouge",
      "componentType": "Glossary",
      "sectionAnchor": "Introduction à la Cosmologie",
      "props": {
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/D%C3%A9calage_vers_le_rouge",
        "year": "N/A (phenomenon)"
      }
    },
    {
      "id": "v_slipher",
      "componentType": "RealPerson",
      "sectionAnchor": "Introduction à la Cosmologie",
      "props": {
        "name": "Vesto Slipher",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Vesto_Slipher",
        "year": "N/A (person)"
      }
    },
    {
      "id": "e_hubble",
      "componentType": "RealPerson",
      "sectionAnchor": "Introduction à la Cosmologie",
      "props": {
        "name": "Edwin Hubble",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Edwin_Hubble",
        "year": "N/A (person)"
      }
    },
    {
      "id": "g_lemaitre",
      "componentType": "RealPerson",
      "sectionAnchor": "Introduction à la Cosmologie",
      "props": {
        "name": "Georges Lemaître",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Georges_Lema%C3%AEtre",
        "year": "N/A (person)"
      }
    },
    {
      "id": "loi_hubble_lemaitre",
      "componentType": "ConceptLink",
      "sectionAnchor": "Introduction à la Cosmologie",
      "props": {
        "name": "Loi de Hubble-Lemaître",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Loi_de_Hubble-Lema%C3%AEtre",
        "year": "N/A (concept)"
      }
    },
    {
      "id": "constante_hubble",
      "componentType": "ConceptLink",
      "sectionAnchor": "Introduction à la Cosmologie",
      "props": {
        "name": "Constante de Hubble",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Constante_de_Hubble",
        "year": "N/A (concept)"
      }
    },
    {
      "id": "chandelles_standard",
      "componentType": "Glossary",
      "sectionAnchor": "Introduction à la Cosmologie",
      "props": {
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Chandelle_standard",
        "year": "N/A (concept)"
      }
    },
    {
      "id": "relativite_generale",
      "componentType": "ConceptLink",
      "sectionAnchor": "Introduction à la Cosmologie",
      "props": {
        "name": "Relativité Générale",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Relativit%C3%A9_g%C3%A9n%C3%A9rale",
        "year": "N/A (concept)"
      }
    },
    {
      "id": "a_einstein",
      "componentType": "RealPerson",
      "sectionAnchor": "Introduction à la Cosmologie",
      "props": {
        "name": "Albert Einstein",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Albert_Einstein",
        "year": "N/A (person)"
      }
    },
    {
      "id": "principe_cosmologique",
      "componentType": "ConceptLink",
      "sectionAnchor": "Introduction à la Cosmologie",
      "props": {
        "name": "Principe Cosmologique",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Principe_cosmologique",
        "year": "N/A (concept)"
      }
    },
    {
      "id": "metrique_flrw",
      "componentType": "Glossary",
      "sectionAnchor": "Introduction à la Cosmologie",
      "props": {
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/M%C3%A9trique_de_Friedmann-Lema%C3%AEtre-Robertson-Walker",
        "year": "N/A (concept)"
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