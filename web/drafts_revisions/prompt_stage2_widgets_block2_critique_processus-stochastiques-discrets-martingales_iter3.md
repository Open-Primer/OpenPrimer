You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 2:
{
  "interactiveComponents": [
    {
      "id": "bachelier",
      "componentType": "RealPerson",
      "sectionAnchor": "## Introduction",
      "props": {
        "name": "Louis Bachelier",
        "wikipediaUrl": "https://en.wikipedia.org/wiki/Louis_Bachelier",
        "year": "1870-1946"
      }
    },
    {
      "id": "black_scholes",
      "componentType": "ConceptLink",
      "sectionAnchor": "## Introduction",
      "props": {
        "name": "Black-Scholes-Merton Model",
        "wikipediaUrl": "https://en.wikipedia.org/wiki/Black%E2%80%93Scholes_model",
        "year": "1973"
      }
    },
    {
      "id": "arbitrage",
      "componentType": "ConceptLink",
      "sectionAnchor": "## Introduction",
      "props": {
        "name": "Arbitrage",
        "wikipediaUrl": "https://en.wikipedia.org/wiki/Arbitrage"
      }
    },
    {
      "id": "sigma_algebra",
      "componentType": "ConceptLink",
      "sectionAnchor": "## Introduction",
      "props": {
        "name": "Filtration (mathematics)",
        "wikipediaUrl": "https://en.wikipedia.org/wiki/Filtration_(mathematics)"
      }
    },
    {
      "id": "esperance_conditionnelle",
      "componentType": "ConceptLink",
      "sectionAnchor": "## Introduction",
      "props": {
        "name": "Espérance conditionnelle",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Esp%C3%A9rance_conditionnelle"
      }
    },
    {
      "id": "martingale_def",
      "componentType": "ConceptLink",
      "sectionAnchor": "## Introduction",
      "props": {
        "name": "Martingale (probability theory)",
        "wikipediaUrl": "https://en.wikipedia.org/wiki/Martingale_(probability_theory)"
      }
    },
    {
      "id": "submartingale_def",
      "componentType": "ConceptLink",
      "sectionAnchor": "## Introduction",
      "props": {
        "name": "Sous-martingale",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Sous-martingale"
      }
    },
    {
      "id": "supermartingale_def",
      "componentType": "ConceptLink",
      "sectionAnchor": "## Introduction",
      "props": {
        "name": "Sur-martingale",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Sur-martingale"
      }
    },
    {
      "id": "doob_joseph",
      "componentType": "RealPerson",
      "sectionAnchor": "## Introduction",
      "props": {
        "name": "Joseph L. Doob",
        "wikipediaUrl": "https://en.wikipedia.org/wiki/Joseph_L._Doob",
        "year": "1910-2004"
      }
    },
    {
      "id": "stopping_time",
      "componentType": "Glossary",
      "sectionAnchor": "## Introduction",
      "props": {
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Temps_d%27arr%C3%AAt",
        "year": "1939"
      }
    },
    {
      "id": "cox_john",
      "componentType": "RealPerson",
      "sectionAnchor": "## Introduction",
      "props": {
        "name": "John C. Cox",
        "wikipediaUrl": "https://en.wikipedia.org/wiki/John_C._Cox",
        "year": "1943-"
      }
    },
    {
      "id": "ross_stephen",
      "componentType": "RealPerson",
      "sectionAnchor": "## Introduction",
      "props": {
        "name": "Stephen A. Ross",
        "wikipediaUrl": "https://en.wikipedia.org/wiki/Stephen_A._Ross",
        "year": "1944-2017"
      }
    },
    {
      "id": "rubinstein_mark",
      "componentType": "RealPerson",
      "sectionAnchor": "## Introduction",
      "props": {
        "name": "Mark Rubinstein",
        "wikipediaUrl": "https://en.wikipedia.org/wiki/Mark_Rubinstein",
        "year": "1944-"
      }
    },
    {
      "id": "arbitrage_glossary",
      "componentType": "Glossary",
      "sectionAnchor": "## Introduction",
      "props": {
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Arbitrage_(finance)"
      }
    },
    {
      "id": "risk_neutral_measure",
      "componentType": "ConceptLink",
      "sectionAnchor": "## Introduction",
      "props": {
        "name": "Mesure de probabilité risque-neutre",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Mesure_de_probabilit%C3%A9_risque-neutre"
      }
    },
    {
      "id": "discrete_stochastic_process",
      "componentType": "ConceptLink",
      "sectionAnchor": "## Introduction",
      "props": {
        "name": "Processus stochastique discret",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Processus_stochastique"
      }
    },
    {
      "id": "martingale_glossary",
      "componentType": "Glossary",
      "sectionAnchor": "## Introduction",
      "props": {
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Martingale_(probabilit%C3%A9s)"
      }
    },
    {
      "id": "crr_model",
      "componentType": "ConceptLink",
      "sectionAnchor": "## Introduction",
      "props": {
        "name": "Modèle de Cox-Ross-Rubinstein (CRR)",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Mod%C3%A8le_binomial_de_Cox-Ross-Rubinstein",
        "year": "1979"
      }
    },
    {
      "id": "shreve_steven",
      "componentType": "RealPerson",
      "sectionAnchor": "## Introduction",
      "props": {
        "name": "Steven E. Shreve",
        "wikipediaUrl": "https://en.wikipedia.org/wiki/Steven_E._Shreve",
        "year": "1949-"
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