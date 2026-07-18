You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 2:
{
  "interactiveComponents": [
    {
      "id": "stabilite_prix",
      "componentType": "ConceptLink",
      "sectionAnchor": "Key Concepts and Definitions",
      "props": {
        "name": "stabilité des prix",
        "searchQuery": "stabilité des prix",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Stabilit%C3%A9_des_prix"
      }
    },
    {
      "id": "croissance_durable",
      "componentType": "ConceptLink",
      "sectionAnchor": "Key Concepts and Definitions",
      "props": {
        "name": "croissance économique durable",
        "searchQuery": "croissance économique durable",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/D%C3%A9veloppement_durable"
      }
    },
    {
      "id": "plein_emploi",
      "componentType": "ConceptLink",
      "sectionAnchor": "Key Concepts and Definitions",
      "props": {
        "name": "plein emploi",
        "searchQuery": "plein emploi",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Plein_emploi"
      }
    },
    {
      "id": "woodford",
      "componentType": "RealPerson",
      "sectionAnchor": "Key Concepts and Definitions",
      "props": {
        "name": "Michael Woodford",
        "searchQuery": "Michael Woodford",
        "wikipediaUrl": "https://en.wikipedia.org/wiki/Michael_Woodford"
      }
    },
    {
      "id": "mecanismes_transmission",
      "componentType": "Glossary",
      "sectionAnchor": "Key Concepts and Definitions",
      "props": {
        "searchQuery": "mécanismes de transmission politique monétaire",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/M%C3%A9canismes_de_transmission_de_la_politique_mon%C3%A9taire"
      }
    },
    {
      "id": "rigidites_nominales",
      "componentType": "Glossary",
      "sectionAnchor": "Key Concepts and Definitions",
      "props": {
        "searchQuery": "rigidités nominales",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Rigidit%C3%A9_nominale"
      }
    },
    {
      "id": "christiano",
      "componentType": "RealPerson",
      "sectionAnchor": "Key Concepts and Definitions",
      "props": {
        "name": "Lawrence Christiano",
        "searchQuery": "Lawrence Christiano",
        "wikipediaUrl": "https://en.wikipedia.org/wiki/Lawrence_J._Christiano"
      }
    },
    {
      "id": "eichenbaum",
      "componentType": "RealPerson",
      "sectionAnchor": "Key Concepts and Definitions",
      "props": {
        "name": "Martin Eichenbaum",
        "searchQuery": "Martin Eichenbaum",
        "wikipediaUrl": "https://en.wikipedia.org/wiki/Martin_Eichenbaum"
      }
    },
    {
      "id": "evans",
      "componentType": "RealPerson",
      "sectionAnchor": "Key Concepts and Definitions",
      "props": {
        "name": "Charles Evans",
        "searchQuery": "Charles Evans economist",
        "wikipediaUrl": "https://en.wikipedia.org/wiki/Charles_L._Evans"
      }
    },
    {
      "id": "taux_directeur",
      "componentType": "Glossary",
      "sectionAnchor": "Key Concepts and Definitions",
      "props": {
        "searchQuery": "taux directeurs",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Taux_directeur"
      }
    },
    {
      "id": "politique_monetaire_conventionnelle",
      "componentType": "ConceptLink",
      "sectionAnchor": "Key Concepts and Definitions",
      "props": {
        "name": "politique monétaire",
        "searchQuery": "politique monétaire",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Politique_mon%C3%A9taire"
      }
    },
    {
      "id": "canal_des_taux_interet",
      "componentType": "ConceptLink",
      "sectionAnchor": "Key Concepts and Definitions",
      "props": {
        "name": "canal des taux d'intérêt",
        "searchQuery": "canal des taux d'intérêt politique monétaire",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/M%C3%A9canismes_de_transmission_de_la_politique_mon%C3%A9taire#Le_canal_des_taux_d'int%C3%A9r%C3%AAt"
      }
    },
    {
      "id": "taux_de_change",
      "componentType": "Glossary",
      "sectionAnchor": "Key Concepts and Definitions",
      "props": {
        "searchQuery": "taux de change",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Taux_de_change"
      }
    },
    {
      "id": "anticipations_rationnelles",
      "componentType": "ConceptLink",
      "sectionAnchor": "Key Concepts and Definitions",
      "props": {
        "name": "anticipations rationnelles",
        "searchQuery": "anticipations rationnelles",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Anticipations_rationnelles"
      }
    },
    {
      "id": "john_taylor",
      "componentType": "RealPerson",
      "sectionAnchor": "Key Concepts and Definitions",
      "props": {
        "name": "John Taylor",
        "searchQuery": "John B. Taylor economist",
        "wikipediaUrl": "https://en.wikipedia.org/wiki/John_B._Taylor"
      }
    },
    {
      "id": "incertitude_politique",
      "componentType": "ConceptLink",
      "sectionAnchor": "Key Concepts and Definitions",
      "props": {
        "name": "incertitude politique",
        "searchQuery": "incertitude politique",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Incertitude_politique"
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