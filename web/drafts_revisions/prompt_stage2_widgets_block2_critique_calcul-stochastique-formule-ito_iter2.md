You are the Widgets Critic Agent (Agent 4B). Review this Widget Block 2:
{
  "interactiveComponents": [
    {
      "id": "stochastic_calculus",
      "componentType": "ConceptLink",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "Calcul stochastique",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Calcul_stochastique"
      }
    },
    {
      "id": "ito_kiyosi",
      "componentType": "RealPerson",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "Kiyosi Itô",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Kiyosi_It%C3%B4"
      }
    },
    {
      "id": "ito_formula",
      "componentType": "Glossary",
      "sectionAnchor": "Main Content",
      "props": {
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Formule_d%27It%C3%B4"
      }
    },
    {
      "id": "brownian_motion",
      "componentType": "ConceptLink",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "Mouvement Brownien",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Mouvement_brownien"
      }
    },
    {
      "id": "generalized_brownian_motion",
      "componentType": "Glossary",
      "sectionAnchor": "Main Content",
      "props": {
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Mouvement_brownien"
      }
    },
    {
      "id": "stochastic_integral",
      "componentType": "ConceptLink",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "Intégrale stochastique",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Int%C3%A9grale_stochastique"
      }
    },
    {
      "id": "martingale",
      "componentType": "ConceptLink",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "Martingales",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Martingale_(probabilit%C3%A9s)"
      }
    },
    {
      "id": "ito_formula_concept",
      "componentType": "ConceptLink",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "Formule d'Itô",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Formule_d%27It%C3%B4"
      }
    },
    {
      "id": "ito_correction_term",
      "componentType": "Glossary",
      "sectionAnchor": "Main Content",
      "props": {
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Formule_d%27It%C3%B4#Le_terme_de_correction_d'It%C3%B4"
      }
    },
    {
      "id": "geometric_brownian_motion",
      "componentType": "ConceptLink",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "Mouvement Brownien Géométrique",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Mouvement_brownien_g%C3%A9om%C3%A9trique"
      }
    },
    {
      "id": "black_scholes_pde",
      "componentType": "ConceptLink",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "Équation de Black-Scholes",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/%C3%89quation_de_Black-Scholes"
      }
    },
    {
      "id": "stochastic_differential_equation",
      "componentType": "Glossary",
      "sectionAnchor": "Main Content",
      "props": {
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/%C3%89quation_diff%C3%A9rentielle_stochastique"
      }
    },
    {
      "id": "girsanov_theorem",
      "componentType": "Glossary",
      "sectionAnchor": "Main Content",
      "props": {
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Th%C3%A9or%C3%A8me_de_Girsanov"
      }
    },
    {
      "id": "ito_lemma_multidim",
      "componentType": "ConceptLink",
      "sectionAnchor": "Main Content",
      "props": {
        "name": "Lemme d'Itô multidimensionnel",
        "wikipediaUrl": "https://fr.wikipedia.org/wiki/Formule_d%27It%C3%B4#G%C3%A9n%C3%A9ralisation_multidimensionnelle"
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